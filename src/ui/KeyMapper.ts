import { Operation } from "../domain/Operation";
import type { KeyToken } from "./KeyToken";

/**
 * モジュール名:
 * - KeyMapper
 *
 * 主な機能:
 * - 入力された内容(キーの種類と値)を解釈し、
 * 　それぞれの内容に対応する情報として変換して返す
 *
 * 備考:
 *
 */
export class KeyMapper {
  /* 「キーの種類と値」として受け取る型 */
  keyMap: Map<string, KeyToken>;
  /* 演算子が入力された際に、
  「入力された演算子と内部で扱う用の演算子」として受け取る型 */
  opMap: { [key: string]: (typeof Operation)[number] } = {
    "+": "Add",
    "-": "Subtract",
    "*": "Multiply",
    "÷": "Divide",
  };

  constructor(keyMap: Map<string, KeyToken>) {
    this.keyMap = keyMap;
  }

  /**
   * 受け取ったDOM要素（押されたボタンなど）から、
   * どの種類のキー操作かを判定して、キー種別や値を示すKeyTokenを返す
   *
   * @param {KeyToken["kind"]} kind 種類
   * @param {string} value 型
   *
   * @returns {KeyToken}  整形結果
   */
  public resolve(value: string, kind: KeyToken["kind"]): KeyToken | undefined {
    if (kind === "digit") {
      this.keyMap.set("digit", { kind: "digit", value: Number(value) });
    }
    if (kind === "decimal") {
      this.keyMap.set("decimal", { kind: "decimal" });
    }
    if (kind === "op") {
      const opValue = this.opMap[value] ?? "Add";
      this.keyMap.set("op", { kind: "op", value: opValue });
    }
    if (kind === "equal") {
      this.keyMap.set("equal", { kind: "equal" });
    }
    if (kind === "clear") {
      this.keyMap.set("clear", { kind: "clear" });
    }
    if (kind === "allClear") {
      this.keyMap.set("allClear", { kind: "allClear" });
    }

    return this.keyMap.get(kind);
  }
}
