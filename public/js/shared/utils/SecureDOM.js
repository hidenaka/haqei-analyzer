/**
 * セキュアなDOM操作クラス
 * XSS対策を考慮したDOM操作メソッドを提供
 * @class SecureDOM
 */
class SecureDOM {
    /**
     * 安全なテキスト設定
     * @param {HTMLElement} element - 対象要素
     * @param {string} text - 設定するテキスト
     */
    static setText(element, text) {
        if (!element) {
            console.error('SecureDOM.setText: element is null or undefined');
            return;
        }
        element.textContent = text || '';
    }
    
    /**
     * 安全なHTML設定（サニタイズ必須）
     * @param {HTMLElement} element - 対象要素
     * @param {string} html - 設定するHTML
     * @param {Object} options - DOMPurifyオプション
     */
    static setHTML(element, html, options = {}) {
        if (!element) {
            console.error('SecureDOM.setHTML: element is null or undefined');
            return;
        }
        
        // DOMPurifyが利用可能な場合は使用
        if (typeof DOMPurify !== 'undefined') {
            const defaultOptions = {
                ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span', 'p', 'div', 'br', 'ul', 'ol', 'li'],
                ALLOWED_ATTR: ['class', 'id', 'data-question-id', 'data-value'],
                KEEP_CONTENT: true,
                SAFE_FOR_TEMPLATES: true
            };
            
            const purifyOptions = { ...defaultOptions, ...options };
            element.innerHTML = DOMPurify.sanitize(html, purifyOptions);
        } else {
            // DOMPurifyが利用できない場合は警告してテキストとして設定
            console.warn('DOMPurify not available. Setting as text content instead.');
            this.setText(element, html);
        }
    }
    
    /**
     * 安全な属性設定
     * @param {HTMLElement} element - 対象要素
     * @param {string} name - 属性名
     * @param {string} value - 属性値
     */
    static setAttribute(element, name, value) {
        SecurityValidator.setAttribute(element, name, value);
    }
    
    /**
     * 安全なクラス追加
     * @param {HTMLElement} element - 対象要素
     * @param {string} className - クラス名
     */
    static addClass(element, className) {
        if (!element || !className) return;
        
        // クラス名の検証（英数字、ハイフン、アンダースコアのみ許可）
        if (!/^[a-zA-Z0-9\-_\s]+$/.test(className)) {
            console.warn(`Invalid class name: ${className}`);
            return;
        }
        
        element.classList.add(className);
    }
    
    /**
     * 安全なクラス削除
     * @param {HTMLElement} element - 対象要素
     * @param {string} className - クラス名
     */
    static removeClass(element, className) {
        if (!element || !className) return;
        element.classList.remove(className);
    }
    
    /**
     * 安全なクラス切り替え
     * @param {HTMLElement} element - 対象要素
     * @param {string} className - クラス名
     * @param {boolean} force - 強制的に追加/削除
     */
    static toggleClass(element, className, force = undefined) {
        if (!element || !className) return;
        
        // クラス名の検証
        if (!/^[a-zA-Z0-9\-_\s]+$/.test(className)) {
            console.warn(`Invalid class name: ${className}`);
            return;
        }
        
        element.classList.toggle(className, force);
    }
    
    /**
     * 安全なスタイル設定
     * @param {HTMLElement} element - 対象要素
     * @param {string} property - CSSプロパティ
     * @param {string} value - 値
     */
    static setStyle(element, property, value) {
        if (!element || !property) return;
        
        // 危険なCSSプロパティをブロック
        const dangerousProperties = ['javascript', 'expression', 'behavior', '-moz-binding'];
        if (dangerousProperties.some(dangerous => property.toLowerCase().includes(dangerous))) {
            console.warn(`Blocked dangerous CSS property: ${property}`);
            return;
        }
        
        // 値に危険な文字列が含まれていないかチェック
        const valueStr = String(value);
        if (valueStr.includes('javascript:') || valueStr.includes('expression(')) {
            console.warn(`Blocked dangerous CSS value: ${value}`);
            return;
        }
        
        element.style[property] = SecurityValidator.encodeCss(value);
    }
    
    /**
     * 安全な要素作成
     * @param {string} tagName - タグ名
     * @param {Object} options - オプション
     * @returns {HTMLElement} 作成された要素
     */
    static createElement(tagName, options = {}) {
        const { attributes = {}, text = '', html = '', styles = {}, classes = [] } = options;
        
        const element = document.createElement(tagName);
        
        // 属性設定
        Object.entries(attributes).forEach(([name, value]) => {
            this.setAttribute(element, name, value);
        });
        
        // クラス設定
        classes.forEach(className => this.addClass(element, className));
        
        // スタイル設定
        Object.entries(styles).forEach(([property, value]) => {
            this.setStyle(element, property, value);
        });
        
        // コンテンツ設定
        if (html && typeof DOMPurify !== 'undefined') {
            this.setHTML(element, html);
        } else if (text) {
            this.setText(element, text);
        }
        
        return element;
    }
    
    /**
     * 安全なイベントリスナー追加
     * @param {HTMLElement} element - 対象要素
     * @param {string} event - イベント名
     * @param {Function} handler - ハンドラー関数
     * @param {Object} options - オプション
     */
    static addEventListener(element, event, handler, options = {}) {
        if (!element || !event || typeof handler !== 'function') return;
        
        // イベント名の検証
        const allowedEvents = [
            'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave',
            'keydown', 'keyup', 'keypress', 'change', 'input', 'submit', 'focus', 'blur',
            'scroll', 'resize', 'load', 'unload', 'beforeunload'
        ];
        
        if (!allowedEvents.includes(event.toLowerCase())) {
            console.warn(`Event type not in whitelist: ${event}`);
            return;
        }
        
        element.addEventListener(event, handler, options);
    }
    
    /**
     * 要素の安全な検索
     * @param {string} selector - セレクター
     * @param {HTMLElement} parent - 親要素（省略可）
     * @returns {HTMLElement|null} 見つかった要素
     */
    static querySelector(selector, parent = document) {
        if (!selector || typeof selector !== 'string') return null;
        
        try {
            return parent.querySelector(selector);
        } catch (e) {
            console.error('Invalid selector:', selector, e);
            return null;
        }
    }
    
    /**
     * 要素の安全な複数検索
     * @param {string} selector - セレクター
     * @param {HTMLElement} parent - 親要素（省略可）
     * @returns {NodeList} 見つかった要素のリスト
     */
    static querySelectorAll(selector, parent = document) {
        if (!selector || typeof selector !== 'string') return [];
        
        try {
            return parent.querySelectorAll(selector);
        } catch (e) {
            console.error('Invalid selector:', selector, e);
            return [];
        }
    }
    
    /**
     * フォームデータの安全な取得
     * @param {HTMLFormElement} form - フォーム要素
     * @returns {Object} サニタイズされたフォームデータ
     */
    static getFormData(form) {
        if (!form || !(form instanceof HTMLFormElement)) {
            console.error('Invalid form element');
            return {};
        }
        
        const data = {};
        const formData = new FormData(form);
        
        for (const [key, value] of formData.entries()) {
            // キーのサニタイズ
            const sanitizedKey = key.replace(/[^\w\-]/g, '_');
            
            // 値のサニタイズ
            if (typeof value === 'string') {
                data[sanitizedKey] = SecurityValidator.escapeHtml(value);
            } else {
                data[sanitizedKey] = value;
            }
        }
        
        return data;
    }
}

// グローバルに公開
window.SecureDOM = SecureDOM;