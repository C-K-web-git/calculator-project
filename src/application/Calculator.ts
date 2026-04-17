import { InputBuffer } from "../domain/InputBuffer";
import { Evaluator } from "../domain/Evaluator";
import { NumberFormatter } from "../domain/NumberFormatter";
import type { KeyToken } from "../ui/KeyToken";
import type { Operation } from "../domain/Operation";
import { CalcState } from "./CalcState";
import { ERROR_MESSAGE } from "../utility/Config";
import type { IDisplay } from "../ui/DomDisplay";

/**
 * モジュール名:
 * - Calculator
 *
 * 主な機能:
 * - IDisplayから受け取った要素を、それぞれの計算処理へ受け渡す
 *
 * 備考:
 * - 入力されたものを解釈し、それぞれの処理へ受け渡している
 */
export class Calculator {
  /* 計算処理を行う際にインスタンスとして使う変数 */
  evaluator: Evaluator;
  /* スクリーンに表示されている値 */
  buffer: InputBuffer;
  /* 表示用文字列に変換する際にインスタンスとして使う変数 */
  formatter: NumberFormatter;
  /* 最新の演算子を管理する変数 */
  operator: (typeof Operation)[number] | null;
  /* 最新の計算状態を管理する変数 */
  state: (typeof CalcState)[number];
  /* 計算する時の１つ目の数字情報を格納する変数 */
  left: number | null = null;
  /* 画面へ描画依頼をお願いする際にインスタンスとして使う変数 */
  display: IDisplay;
  /* 計算する時の２つ目の数字情報を格納する変数 */
  right: number | null = null;

  constructor(
    evaluator: Evaluator,
    buffer: InputBuffer,
    formatter: NumberFormatter,
    operator: (typeof Operation)[number],
    display: IDisplay,
  ) {
    this.evaluator = evaluator;
    this.buffer = buffer;
    this.formatter = formatter;
    this.operator = operator;
    this.state = "Ready";
    this.display = display;
  }

  /**
   * 受け取った値を振り分ける
   *
   * @param token ボタンを押した際にUIから受け取る値
   * @returns なし
   */
  public handle(token: KeyToken): void {
    switch (token.kind) {
      case "digit":
        this.handleDigit(token.value);
        // 描画依頼
        if (!this.buffer.isEmpty()) {
          this.display.render(this.buffer.getValue());
        } else {
          this.handleClear();
          this.handleError();
        }
        break;
      case "op":
        this.handleOperator(token.value);
        break;
      case "decimal":
        this.handleDecimalPoint();
        // 描画依頼
        this.display.render(this.buffer.getValue());
        break;
      case "equal":
        this.handleEqual();
        break;
      case "clear":
        this.handleBackspace();
        // 描画依頼
        this.display.render(this.buffer.getValue());
        break;
      case "allClear":
        this.handleAllClear();
        // 描画依頼
        this.display.render(this.buffer.getValue());
        break;
    }
  }

  /**
   * 数値が来た際に動く処理
   * bufferが更新されたら、leftを退避・更新する
   * 演算子が既に入力されている場合のみ、rightを退避・更新する
   *
   * @param {number} digit 数値
   * @returns なし
   */
  public handleDigit(digit: number): void {
    if (
      this.state === "Ready" ||
      this.state === "ResultShown" ||
      this.state === "Error"
    ) {
      // 新しい計算開始
      this.handleAllClear();
      this.updateBuffer(digit);
      this.state = "InputtingFirst";
    } else if (this.state === "OperatorEntered") {
      if (this.left == null) {
        return;
      }
      this.buffer.clear();
      this.updateBuffer(digit);
      this.state = "InputtingSecond";
    } else if (
      this.state === "InputtingFirst" ||
      this.state === "InputtingSecond"
    ) {
      this.updateBuffer(digit);
    }

    // 表示文字列を生成する
    this.formatter.formatForDisplay(digit);
  }

  /**
   * 小数点が来た際に動く処理
   *
   * @param なし
   * @returns なし
   */
  public handleDecimalPoint(): void {
    if (this.state === "Ready" || this.state === "Error") {
      this.buffer.pushDecimal();
      this.state = "InputtingFirst";
    } else {
      // 既に小数点が存在する場合は無視
    }
  }

  /**
   * 演算子が来た際に動く処理
   *
   * @param {Operation} operation 演算子
   * @returns なし
   */
  public handleOperator(operation: (typeof Operation)[number]): void {
    const isLeftUnset = this.left === null;
    const isRightUnset = this.right === null;
    const isOperatorUnset = this.operator === null;
    const hasLeftNoOperator = !isLeftUnset && isOperatorUnset;

    // left 未設定で operator を押した場合
    if (isRightUnset || isLeftUnset || hasLeftNoOperator) {
      // 最後の演算子に置換（多重演算子対策)
      this.operator = operation;
      this.state = "OperatorEntered";
    }

    if (!isOperatorUnset) {
      if (
        this.state === "ResultShown" ||
        this.state === "Ready" ||
        this.state === "InputtingFirst"
      ) {
        this.operator = operation;
        this.state = "OperatorEntered";
      } else if (this.state === "OperatorEntered") {
        // 演算子の上書き
        this.operator = operation;
      } else if (this.state === "InputtingSecond") {
        // 計算に使う演算子を退避
        const operatorBeforeChange = this.operator;
        // 演算子入力時点で、left (operation) buffer が揃っていれば即時計算
        if (
          this.left !== null &&
          operatorBeforeChange !== null &&
          this.right !== null
        ) {
          try {
            const result = this.evaluator.compute(
              this.left,
              operatorBeforeChange,
              this.right,
            );
            if (result != null) {
              this.buffer.setValue(this.formatter.formatForDisplay(result));
              this.display.render(this.buffer.getValue());
              this.left = result;
              this.operator = operation;
              this.state = "OperatorEntered";
            } else {
              this.handleClear();
              this.handleError();
            }
          } catch (error) {
            this.handleError();
          }
        }
      }
    }
  }

  /**
   * イコールが来た際に動く処理
   *
   * @param なし
   * @returns なし
   */
  public handleEqual(): void {
    // left と buffer が揃っている場合のみ計算処理を行う
    if (
      this.left !== null &&
      this.operator !== null &&
      !this.buffer.isEmpty()
    ) {
      const action = this.operator;
      this.right = this.buffer.toNumber();
      try {
        const result = this.evaluator.compute(this.left, action, this.right);
        if (result != null) {
          const displayResult = this.formatter.formatForDisplay(result);
          this.buffer.setValue(displayResult); // 結果を buffer にセット
          this.display.render(this.buffer.getValue());
          this.left = result; // left に結果を保持
          this.state = "ResultShown";
        } else {
          this.handleClear();
          this.handleError();
        }
        // 計算時の0除算は例外で表現
      } catch (error) {
        this.handleError();
      }
    } else {
      // 揃っていない場合は現表示維持。何もしない。
    }
  }

  /**
   * 保持している値をクリアする処理
   *
   * @param なし
   * @returns なし
   */
  public handleClear(): void {
    this.left = null;
    this.operator = null;
    this.buffer.clear();
  }

  /**
   * C(クリア)が押された際に動く処理
   *
   * @param なし
   * @returns なし
   */
  public handleAllClear(): void {
    this.handleClear();
    this.state = "Ready";
  }

  /**
   * ←(バックスペース)が押された際に動く処理
   *
   * @param なし
   * @returns なし
   */
  public handleBackspace(): void {
    if (this.state === "ResultShown") {
      return;
    }
    const removedChar = this.buffer.removeLastChar();
    this.buffer.setValue(removedChar);
  }

  /**
   * 保持している値を呼び出す処理
   *
   * @param なし
   * @returns　{string} 保持された値
   */
  public getDisplayValue(): string {
    return this.buffer.getValue();
  }

  /**
   * エラー時の共通処理
   *
   * @param なし
   * @returns なし
   */
  public handleError(): void {
    this.buffer.setValue(ERROR_MESSAGE);
    this.display.renderError(ERROR_MESSAGE);
    this.state = "Error";
  }

  /**
   * 保持している値を呼び出す処理
   *
   * @param {number} digit 数値
   * @returns なし
   */
  public updateBuffer(digit: number): void {
    this.buffer.pushDigit(digit);
    if (this.state === "OperatorEntered") {
      this.right = this.buffer.toNumber();
    } else {
      this.left = this.buffer.toNumber();
    }
  }
}
