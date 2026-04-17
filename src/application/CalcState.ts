/**
 * モジュール名:
 * - CalcState
 *
 * 主な機能:
 * - 電卓の状態管理
 *
 * 備考:
 */
export const CalcState = [
  "Ready",
  "InputtingFirst",
  "OperatorEntered",
  "InputtingSecond",
  "ResultShown",
  "Error",
] as const;
