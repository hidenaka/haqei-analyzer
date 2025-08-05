/**
 * セキュリティバリデーター
 * XSS対策、入力検証、出力エンコーディングを担当
 * @class SecurityValidator
 */
class SecurityValidator {
    /**
     * HTML特殊文字のエスケープ
     * @param {string} str - エスケープする文字列
     * @returns {string} エスケープされた文字列
     */
    static escapeHtml(str) {
        if (str === null || str === undefined) {
            return '';
        }
        
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };
        
        return String(str).replace(/[&<>"'\/]/g, s => map[s]);
    }
    
    /**
     * 属性値のエスケープ
     * @param {string} str - エスケープする文字列
     * @returns {string} エスケープされた文字列
     */
    static escapeAttribute(str) {
        if (str === null || str === undefined) {
            return '';
        }
        
        return String(str)
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
    
    /**
     * JavaScript文字列のエスケープ
     * @param {string} str - エスケープする文字列
     * @returns {string} エスケープされた文字列
     */
    static escapeJs(str) {
        if (str === null || str === undefined) {
            return '';
        }
        
        return String(str)
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'")
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029');
    }
    
    /**
     * URL用エンコーディング
     * @param {string} str - エンコードする文字列
     * @returns {string} エンコードされた文字列
     */
    static encodeUrl(str) {
        if (str === null || str === undefined) {
            return '';
        }
        
        return encodeURIComponent(str);
    }
    
    /**
     * CSS用エンコーディング
     * @param {string} str - エンコードする文字列
     * @returns {string} エンコードされた文字列
     */
    static encodeCss(str) {
        if (str === null || str === undefined) {
            return '';
        }
        
        return String(str).replace(/[^\w\-]/g, (char) => {
            return '\\' + char.charCodeAt(0).toString(16) + ' ';
        });
    }
    
    /**
     * 安全なテキスト挿入
     * @param {HTMLElement} element - 対象要素
     * @param {string} text - 挿入するテキスト
     */
    static setTextContent(element, text) {
        if (!element) return;
        element.textContent = text || '';
    }
    
    /**
     * 安全な属性設定
     * @param {HTMLElement} element - 対象要素
     * @param {string} name - 属性名
     * @param {string} value - 属性値
     */
    static setAttribute(element, name, value) {
        if (!element) return;
        
        // 危険な属性をブロック
        const dangerousAttributes = ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur'];
        if (dangerousAttributes.includes(name.toLowerCase())) {
            console.warn(`Blocked dangerous attribute: ${name}`);
            return;
        }
        
        // ホワイトリスト属性
        const allowedAttributes = [
            'class', 'id', 'data-question-id', 'data-value', 'data-type',
            'aria-label', 'aria-describedby', 'aria-live', 'aria-atomic',
            'role', 'tabindex', 'disabled', 'readonly', 'required',
            'placeholder', 'title', 'alt', 'href', 'src'
        ];
        
        if (allowedAttributes.includes(name.toLowerCase())) {
            element.setAttribute(name, this.escapeAttribute(value));
        } else {
            console.warn(`Attribute not in whitelist: ${name}`);
        }
    }
    
    /**
     * 質問回答の検証
     * @param {Object} answer - 検証する回答
     * @returns {Object} 検証結果
     */
    static validateAnswer(answer) {
        const errors = [];
        
        // 必須チェック
        if (answer === null || answer === undefined || answer === '') {
            errors.push('回答は必須です');
        }
        
        // オブジェクト形式チェック
        if (typeof answer !== 'object') {
            errors.push('回答は適切な形式ではありません');
        } else {
            // タイプチェック
            if (!['single', 'multiple', 'text'].includes(answer.type)) {
                errors.push('無効な回答タイプです');
            }
            
            // 値の範囲チェック
            if (answer.type === 'single') {
                const value = parseInt(answer.value);
                if (isNaN(value) || value < 1 || value > 5) {
                    errors.push('回答は1-5の範囲で選択してください');
                }
            }
            
            // テキスト長チェック
            if (answer.type === 'text' && answer.value) {
                if (answer.value.length > 1000) {
                    errors.push('テキストは1000文字以内で入力してください');
                }
            }
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
    
    /**
     * 安全なHTML要素作成
     * @param {string} tagName - タグ名
     * @param {Object} attributes - 属性オブジェクト
     * @param {string} textContent - テキストコンテンツ
     * @returns {HTMLElement} 作成された要素
     */
    static createElement(tagName, attributes = {}, textContent = '') {
        const element = document.createElement(tagName);
        
        // 属性設定
        Object.entries(attributes).forEach(([name, value]) => {
            this.setAttribute(element, name, value);
        });
        
        // テキスト設定
        if (textContent) {
            this.setTextContent(element, textContent);
        }
        
        return element;
    }
    
    /**
     * 数値の安全な検証
     * @param {any} value - 検証する値
     * @param {number} min - 最小値
     * @param {number} max - 最大値
     * @returns {Object} 検証結果
     */
    static validateNumber(value, min = -Infinity, max = Infinity) {
        const num = Number(value);
        
        if (isNaN(num)) {
            return { valid: false, error: '有効な数値ではありません' };
        }
        
        if (num < min) {
            return { valid: false, error: `値は${min}以上である必要があります` };
        }
        
        if (num > max) {
            return { valid: false, error: `値は${max}以下である必要があります` };
        }
        
        return { valid: true, value: num };
    }
    
    /**
     * 文字列の安全な検証
     * @param {any} value - 検証する値
     * @param {number} maxLength - 最大長
     * @param {RegExp} pattern - 検証パターン（オプション）
     * @returns {Object} 検証結果
     */
    static validateString(value, maxLength = 1000, pattern = null) {
        const str = String(value || '');
        
        if (str.length > maxLength) {
            return { valid: false, error: `文字数は${maxLength}文字以内にしてください` };
        }
        
        if (pattern && !pattern.test(str)) {
            return { valid: false, error: '入力形式が正しくありません' };
        }
        
        return { valid: true, value: str };
    }
}

// グローバルに公開
window.SecurityValidator = SecurityValidator;