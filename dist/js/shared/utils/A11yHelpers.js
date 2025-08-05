class A11yHelpers {
    /**
     * 要素にスクリーンリーダー向けのテキストを追加する
     * @param {HTMLElement} element - 対象のHTML要素
     * @param {string} text - スクリーンリーダーで読み上げられるテキスト
     */
    static addScreenReaderOnlyText(element, text) {
        const span = document.createElement('span');
        span.className = 'sr-only'; // スクリーンリーダーのみに表示されるスタイル
        span.textContent = text;
        element.appendChild(span);
    }

    /**
     * インタラクティブ要素のキーボードナビゲーションを強化する
     * @param {HTMLElement} element - 対象のHTML要素
     * @param {function} callback - EnterまたはSpaceキーが押されたときに実行されるコールバック
     */
    static enableKeyboardClick(element, callback) {
        element.setAttribute('tabindex', '0'); // フォーカス可能にする
        element.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // デフォルトのスペースバーの動作（スクロールなど）を防ぐ
                callback();
            }
        });
    }

    /**
     * ARIA属性を設定する
     * @param {HTMLElement} element - 対象のHTML要素
     * @param {string} attribute - ARIA属性名 (例: 'aria-label', 'aria-expanded')
     * @param {string} value - ARIA属性の値
     */
    static setAriaAttribute(element, attribute, value) {
        element.setAttribute(attribute, value);
    }

    /**
     * ライブリージョンを設定し、動的なコンテンツの変更をスクリーンリーダーに通知する
     * @param {HTMLElement} element - ライブリージョンとして機能する要素
     * @param {string} politeness - 'polite' または 'assertive'
     */
    static setLiveRegion(element, politeness = 'polite') {
        element.setAttribute('aria-live', politeness);
        element.setAttribute('aria-atomic', 'true'); // リージョン全体を読み上げる
    }
}
