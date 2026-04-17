/**
 * モジュール名:
 * - main
 *
 * 主な機能:
 * - アプリケーションのエントリーポイント
 * - UIの初期化およびイベントリスナーの登録を行う
 *
 * 備考:
 * - 画面の特定のDOM要素が存在することを前提としている
 * - ユーザ操作に応じてCalculatorへイベントを送る役割を担う
 */

import { Calculator } from "./application/Calculator";
import { Evaluator } from "./domain/Evaluator";
import { InputBuffer } from "./domain/InputBuffer";
import { NumberFormatter } from "./domain/NumberFormatter";
import type { Operation } from "./domain/Operation";
import { DomDisplay } from "./ui/DomDisplay";
import { KeyMapper } from "./ui/KeyMapper";
import type { KeyToken } from "./ui/KeyToken";

const evaluator = new Evaluator(); // 入力された計算式を評価する
const buffer = new InputBuffer(); // ユーザのキー入力を蓄積する
const formatter = new NumberFormatter(); // 計算結果を表示形式に変換する
const keyMap = new Map<string, KeyToken>(); // キーマップの基礎情報
const keyMapper = new KeyMapper(keyMap); // 入力文字列をトークンに変換する

const el = document.getElementById("keys"); // キーが配置されるDOM要素
const displayEl = document.getElementById("screen"); // 結果を表示するDOM要素

// 現在押されたキーの種類および値を保持
let operatorOrDigit: number | (typeof Operation)[number] | null = "Add";

if (el != null && displayEl != null) {
  const display = new DomDisplay(displayEl); // 計算結果の表示を管理
  const calculator = new Calculator(
    evaluator,
    buffer,
    formatter,
    operatorOrDigit,
    display,
  );

  // キー入力（クリック）時にトークン化し、Calculatorに処理を委譲する
  el.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const kind = target.dataset.kind;
    const value = target.dataset.value;

    if (kind != null && value != null) {
      // キーの種類と値から対応するトークンを取得
      const token = keyMapper.resolve(value, kind as KeyToken["kind"]);
      if (token !== undefined) {
        // キー種別によって現在の入力状態を更新
        if (token.kind === "digit" || token.kind === "op") {
          operatorOrDigit = token.value;
        } else {
          operatorOrDigit = null;
        }
        // トークンをCalculatorに渡して処理実行
        calculator.handle(token);
      }
    }
  });
}
