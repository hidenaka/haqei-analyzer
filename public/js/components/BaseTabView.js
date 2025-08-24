/**
 * BaseTabView.js - 全タブコンポーネントの基底クラス
 * 共通機能とインターフェースを定義
 */

class BaseTabView {
    constructor(tabId) {
        this.tabId = tabId;
        this.container = null;
        this.isInitialized = false;
        this.data = null;
    }

    /**
     * タブコンテンツをレンダリング
     * @param {HTMLElement} container - レンダリング先のコンテナ
     */
    render(container) {
        this.container = container;
        
        if (!this.isInitialized) {
            this.init();
            this.isInitialized = true;
        }
        
        // renderContentにcontainerを渡す（サブクラスの実装に合わせて）
        this.renderContent(this.container);
        this.bindEvents();
    }

    /**
     * 初期化処理（サブクラスでオーバーライド）
     */
    init() {
        // サブクラスで実装
    }

    /**
     * コンテンツのレンダリング（サブクラスでオーバーライド）
     */
    renderContent() {
        // サブクラスで実装
        this.container.innerHTML = '<div class="tab-placeholder">コンテンツを準備中...</div>';
    }

    /**
     * イベントバインディング（サブクラスでオーバーライド）
     */
    bindEvents() {
        // サブクラスで実装
    }

    /**
     * データの設定
     * @param {Object} data - タブで使用するデータ
     */
    setData(data) {
        this.data = data;
        if (this.isInitialized) {
            this.renderContent();
        }
    }

    /**
     * タブがアクティブになった時の処理
     */
    onActivate() {
        // サブクラスで必要に応じてオーバーライド
    }

    /**
     * タブが非アクティブになった時の処理
     */
    onDeactivate() {
        // サブクラスで必要に応じてオーバーライド
    }

    /**
     * エラー表示
     * @param {string} message - エラーメッセージ
     */
    showError(message) {
        if (this.container) {
            this.container.innerHTML = `
                <div class="haqei-error-message">
                    <div class="haqei-error-icon">⚠️</div>
                    <div class="haqei-error-text">${message}</div>
                </div>
            `;
        }
    }

    /**
     * ローディング表示
     */
    showLoading() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="haqei-loading">
                    <div class="haqei-loading-spinner"></div>
                    <div class="haqei-loading-text">読み込み中...</div>
                </div>
            `;
        }
    }

    /**
     * 空状態の表示
     * @param {string} message - 空状態のメッセージ
     */
    showEmpty(message = 'データがありません') {
        if (this.container) {
            this.container.innerHTML = `
                <div class="haqei-empty-state">
                    <div class="haqei-empty-icon">📭</div>
                    <div class="haqei-empty-text">${message}</div>
                </div>
            `;
        }
    }

    /**
     * ユーティリティ: 要素作成
     * @param {string} tag - タグ名
     * @param {string} className - クラス名
     * @param {string} content - 内容
     * @returns {HTMLElement}
     */
    createElement(tag, className = '', content = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.innerHTML = content;
        return element;
    }

    /**
     * ユーティリティ: 安全なHTML挿入
     * @param {string} html - HTML文字列
     * @returns {string} - エスケープされたHTML
     */
    escapeHtml(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    /**
     * クリーンアップ処理
     */
    destroy() {
        this.container = null;
        this.data = null;
        this.isInitialized = false;
    }
}

// グローバルスコープに公開
window.BaseTabView = BaseTabView;