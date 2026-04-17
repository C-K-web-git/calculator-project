import { ERROR_MESSAGE } from "../utility/Config";
import { DivisionByZeroError } from "../utility/DivisionByZeroError";
import type { Operation } from "./Operation";

/**
 * モジュール名:
 * - Evaluator
 *
 * 主な機能:
 * - 計算の実行
 *
 * 備考:
 */
export class Evaluator {
  /**
   * 計算する
   *
   * @param {number} a 左の数字
   * @param {Operation} operator 演算子
   * @param {number} b 右の数字
   * @returns {number} 計算結果
   * @throws {DivisionByZeroError} ０除算時のエラー
   */
  public compute(
    a: number,
    operator: (typeof Operation)[number],
    b: number,
  ): number {
    switch (operator) {
      case "Add":
        return a + b;
      case "Subtract":
        return a - b;
      case "Multiply":
        return a * b;
      case "Divide":
        if (b === 0) {
          throw new DivisionByZeroError(ERROR_MESSAGE);
        }
        return a / b;
    }
  }
}
