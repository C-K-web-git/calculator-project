/**
 * モジュール名:
 * - DivisionByZeroError
 *
 * 主な機能:
 * - カスタム例外クラス: 0除算時のエラーを表現する
 *
 * 備考:
 */
export class DivisionByZeroError extends Error {
  constructor(message = "0を割ることはできません。") {
    super(message);
    this.name = "DivisionByZeroError";
  }
}
