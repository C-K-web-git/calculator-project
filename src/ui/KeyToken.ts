import type { Operation } from "../domain/Operation";

/**
 * モジュール名:
 * - KeyToken
 *
 * 主な機能:
 * - 渡る値の種類と型を結びつける
 *
 * 備考:
 */
export type KeyToken =
  | { kind: "digit"; value: number }
  | { kind: "decimal" }
  | { kind: "op"; value: (typeof Operation)[number] }
  | { kind: "equal" }
  | { kind: "clear" }
  | { kind: "allClear" };
