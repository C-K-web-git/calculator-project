import { MAX_DIGITS } from "../utility/Config";

/**
 * モジュール名:
 * - NumberFormatter
 *
 * 主な機能:
 * - 表示をフォーマットする（通常/指数）
 *
 * 備考:
 */
export class NumberFormatter {
  /* 保持している値 */
  private maxDigits = MAX_DIGITS;

  /**
   * スクリーンに表示する用に変換する
   *
   * @param {number} formatValue　内部で扱ってきた値
   *
   * @returns {string} displayValue スクリーン表示用の値
   */
  public formatForDisplay(formatValue: number): string {
    let displayValue;
    // 表示されている値の桁数をチェックする
    // falseの場合は、最大桁数に合うように整形する
    if (!this.fits(formatValue)) {
      displayValue = formatValue.toExponential(1);
      // trueの場合は、何もせずにそのまま代入
    } else {
      displayValue = String(formatValue);
    }
    // 正規表現を使って0を末尾から削除(ゼロが1つ以上連続している部分を対象)
    // 例: 2.5000 → 2.5
    displayValue = displayValue.replace(/0+$/, "");
    // もし末尾が「.」だったら削除
    displayValue = displayValue.replace(/\.$/, "");
    return displayValue;
  }

  /**
   * 電卓の画面に表示できる文字数の制限を超えていないか調べる
   *
   * @param {number} formatValue　内部で扱ってきた値
   *
   * @returns　{boolean} true:超えていない判定、false:超えている判定
   */
  public fits(formatValue: number): boolean {
    return formatValue.toString().length < this.maxDigits;
  }
}
