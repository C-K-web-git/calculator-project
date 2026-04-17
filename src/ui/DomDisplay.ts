/**
 * モジュール名:
 * - IDisplay
 *
 * 主な機能:
 * - 表示操作の抽象的なインタフェース
 *
 * 備考:
 */
export interface IDisplay {
  render(text: string): void;
  renderError(message: string): void;
}

/**
 * モジュール名:
 * - DomDisplay
 *
 * 主な機能:
 * - DOM要素に表示を反映する
 *
 * 備考:
 *
 */
export class DomDisplay implements IDisplay {
  /* 画面から送られてきたclassやID情報 */
  private el: HTMLElement;

  constructor(screenElement: HTMLElement) {
    this.el = screenElement;
  }

  /**
   * スクリーン表示の更新
   *
   * @param text スクリーンに映る値
   */
  render(text: string) {
    this.el.textContent = text;
    // エラーのクラスは確実に除去しておく
    this.el.classList.remove("error");
  }

  /**
   * エラー表示の更新
   *
   * @param message スクリーンに映る値
   */
  renderError(message: string): void {
    this.render(message);
    // エラー表示なのでエラー用クラスを付与
    this.el.classList.add("error");
  }
}
