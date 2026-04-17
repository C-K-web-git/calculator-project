import { MAX_DIGITS } from "../utility/Config";

/**
 * モジュール名:
 * - InputBuffer
 *
 * 主な機能:
 * - 計算したデータを保持する
 * - 入力バッファ（文字列）管理
 *
 * 備考:
 */
export class InputBuffer {
  /* 入力された数値の文字列 */
  private value = "";
  /* スクリーンに表示できる最大桁数 */
  private maxDigits = MAX_DIGITS;
  /* ピリオドのみが入力された際に補うための定数 */
  DEFAULT_DECIMAL_ZERO = "0.";
  /* 保持している値のデフォルト値 */
  DEFAULT_VALUE = "0";

  /**
   * 数字を連結する
   *
   * @param digit 渡ってきた数字
   */
  public pushDigit(digit: number): void {
    // 桁数上限を超える入力を拒否（追加を無視）
    if (this.digitCount() >= this.maxDigits) return;

    // 来る値が1桁目の場合、そのまま入れる
    if (this.value === "0") {
      this.value = String(digit);
    } else {
      // 2桁目が来たら、連結する
      this.value += String(digit);
    }
  }

  /**
   * 値を保持する
   *
   * @returns　{string} 保持された値
   */
  public getValue(): string {
    return this.value || this.DEFAULT_VALUE;
  }

  /**
   * 数字を設定する
   *
   * @param {string} digit 渡ってきた数字
   */
  public setValue(digit: string): void {
    this.value = digit;
  }

  /**
   * 小数点を設定する
   *
   */
  public pushDecimal() {
    // "." 単独入力は "0." に変換。
    if (this.value.length === 0) {
      this.value = this.DEFAULT_DECIMAL_ZERO;
    } else if (!this.value.includes(".")) {
      this.value += ".";
    }
  }

  /**
   * 値をすべて消す
   *
   */
  public clear(): void {
    this.value = "";
  }

  /**
   * 値を一文字消す
   *
   * @returns　{string} 1文字削除後の値
   */
  public removeLastChar(): string {
    return this.value.substring(0, this.value.length - 1);
  }

  /**
   * 数値にする
   *
   * @returns　{number} 数値に変換後の値
   */
  public toNumber(): number {
    return Number(this.value || 0);
  }

  /**
   * 空にする
   *
   * @returns　{boolean} true:空判定、false:値がある判定
   */
  public isEmpty(): boolean {
    if (this.value == null || this.value == undefined) {
      return true;
    }

    const trimmedValue = this.value.trim ? this.value.trim() : this.value;

    if (trimmedValue.length === 0) {
      // 空の場合の処理
      return true;
    }

    return false;
  }

  /**
   * 桁数をカウントする
   *
   * @returns　{number} 不要な文字列以外をカウントした数
   */
  public digitCount(): number {
    return this.value.replace(/[.\-]/g, "").length;
  }
}
