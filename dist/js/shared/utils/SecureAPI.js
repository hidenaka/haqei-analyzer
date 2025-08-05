/**
 * セキュアAPIクライアント
 * CSRF保護、入力検証、エラーハンドリングを含む安全なAPI通信
 * @class SecureAPI
 */
class SecureAPI {
    constructor(options = {}) {
        this.baseURL = options.baseURL || '';
        this.timeout = options.timeout || 30000; // 30秒
        this.retryAttempts = options.retryAttempts || 3;
        this.retryDelay = options.retryDelay || 1000; // 1秒
        
        // CSRF保護が利用可能かチェック
        this.csrfProtection = window.csrfProtection || null;
        
        console.log('✅ SecureAPI initialized');
    }
    
    /**
     * セキュアなHTTPリクエスト
     * @param {string} url - リクエストURL
     * @param {Object} options - リクエストオプション
     * @returns {Promise<Object>} レスポンスデータ
     */
    async request(url, options = {}) {
        // URL検証
        if (!this.validateURL(url)) {
            throw new Error('Invalid URL provided');
        }
        
        // デフォルトオプションの設定
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'same-origin'
        };
        
        const requestOptions = this.mergeOptions(defaultOptions, options);
        
        // CSRF保護の適用
        if (this.csrfProtection && this.requiresCSRFProtection(requestOptions.method)) {
            const token = this.csrfProtection.getCurrentToken();
            requestOptions.headers['X-CSRF-Token'] = token;
        }
        
        // リクエストボディの検証とサニタイズ
        if (requestOptions.body) {
            requestOptions.body = this.sanitizeRequestBody(requestOptions.body);
        }
        
        // タイムアウト付きリクエスト実行
        return await this.executeWithRetry(url, requestOptions);
    }
    
    /**
     * URL検証
     * @param {string} url - 検証するURL
     * @returns {boolean} 検証結果
     */
    validateURL(url) {
        try {
            // 相対URLの場合は現在のオリジンを基準とする
            const fullURL = new URL(url, window.location.origin);
            
            // プロトコル検証（HTTPSまたはHTTP）
            if (!['http:', 'https:'].includes(fullURL.protocol)) {
                console.warn('Invalid protocol:', fullURL.protocol);
                return false;
            }
            
            // 危険なURLパターンのチェック
            const dangerousPatterns = [
                'javascript:',
                'data:',
                'vbscript:',
                'file:',
                'ftp:'
            ];
            
            if (dangerousPatterns.some(pattern => url.toLowerCase().includes(pattern))) {
                console.warn('Dangerous URL pattern detected:', url);
                return false;
            }
            
            return true;
        } catch (e) {
            console.warn('URL validation failed:', e);
            return false;
        }
    }
    
    /**
     * CSRF保護が必要なメソッドかチェック
     * @param {string} method - HTTPメソッド
     * @returns {boolean} CSRF保護の必要性
     */
    requiresCSRFProtection(method) {
        const protectedMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
        return protectedMethods.includes(method.toUpperCase());
    }
    
    /**
     * オプションのマージ
     * @param {Object} defaults - デフォルトオプション
     * @param {Object} options - ユーザーオプション
     * @returns {Object} マージされたオプション
     */
    mergeOptions(defaults, options) {
        return {
            ...defaults,
            ...options,
            headers: {
                ...defaults.headers,
                ...options.headers
            }
        };
    }
    
    /**
     * リクエストボディのサニタイズ
     * @param {any} body - リクエストボディ
     * @returns {string} サニタイズされたボディ
     */
    sanitizeRequestBody(body) {
        if (typeof body === 'string') {
            return body;
        }
        
        if (typeof body === 'object') {
            // オブジェクトの場合は再帰的にサニタイズ
            const sanitized = this.deepSanitize(body);
            return JSON.stringify(sanitized);
        }
        
        return String(body);
    }
    
    /**
     * オブジェクトの深いサニタイズ
     * @param {any} obj - サニタイズする対象
     * @returns {any} サニタイズされたオブジェクト
     */
    deepSanitize(obj) {
        if (obj === null || obj === undefined) {
            return obj;
        }
        
        if (typeof obj === 'string') {
            return SecurityValidator ? SecurityValidator.escapeHtml(obj) : obj;
        }
        
        if (typeof obj === 'number' || typeof obj === 'boolean') {
            return obj;
        }
        
        if (Array.isArray(obj)) {
            return obj.map(item => this.deepSanitize(item));
        }
        
        if (typeof obj === 'object') {
            const sanitized = {};
            Object.keys(obj).forEach(key => {
                // 危険なキー名をブロック
                if (this.isSafeKey(key)) {
                    sanitized[key] = this.deepSanitize(obj[key]);
                }
            });
            return sanitized;
        }
        
        return obj;
    }
    
    /**
     * 安全なキー名かチェック
     * @param {string} key - キー名
     * @returns {boolean} 安全性
     */
    isSafeKey(key) {
        const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
        return !dangerousKeys.includes(key);
    }
    
    /**
     * タイムアウト付きリクエスト実行
     * @param {string} url - リクエストURL
     * @param {Object} options - リクエストオプション
     * @returns {Promise<Object>} レスポンスデータ
     */
    async executeWithTimeout(url, options) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Content-Typeによる応答処理
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                return this.validateResponseData(data);
            } else {
                return await response.text();
            }
            
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }
    
    /**
     * リトライ機能付きリクエスト実行
     * @param {string} url - リクエストURL
     * @param {Object} options - リクエストオプション
     * @returns {Promise<Object>} レスポンスデータ
     */
    async executeWithRetry(url, options) {
        let lastError;
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                return await this.executeWithTimeout(url, options);
            } catch (error) {
                lastError = error;
                
                // リトライしない条件
                if (this.shouldNotRetry(error, attempt)) {
                    throw error;
                }
                
                // 最後の試行でない場合は待機
                if (attempt < this.retryAttempts) {
                    const delay = this.retryDelay * Math.pow(2, attempt - 1); // 指数バックオフ
                    console.warn(`Request failed (attempt ${attempt}), retrying in ${delay}ms:`, error.message);
                    await this.sleep(delay);
                }
            }
        }
        
        throw lastError;
    }
    
    /**
     * リトライすべきでないエラーかチェック
     * @param {Error} error - エラーオブジェクト
     * @param {number} attempt - 試行回数
     * @returns {boolean} リトライ不要かどうか
     */
    shouldNotRetry(error, attempt) {
        // クライアントエラー（4xx）はリトライしない
        if (error.message.includes('HTTP 4')) {
            return true;
        }
        
        // セキュリティエラーはリトライしない
        if (error.message.includes('CSRF') || error.message.includes('Unauthorized')) {
            return true;
        }
        
        return false;
    }
    
    /**
     * 指定時間待機
     * @param {number} ms - 待機時間（ミリ秒）
     * @returns {Promise<void>}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * レスポンスデータの検証
     * @param {any} data - レスポンスデータ
     * @returns {any} 検証済みデータ
     */
    validateResponseData(data) {
        // XSS対策のためレスポンスデータもサニタイズ
        return this.deepSanitize(data);
    }
    
    /**
     * GETリクエスト
     * @param {string} url - リクエストURL
     * @param {Object} options - オプション
     * @returns {Promise<Object>} レスポンスデータ
     */
    async get(url, options = {}) {
        return await this.request(url, { ...options, method: 'GET' });
    }
    
    /**
     * POSTリクエスト
     * @param {string} url - リクエストURL
     * @param {any} data - 送信データ
     * @param {Object} options - オプション
     * @returns {Promise<Object>} レスポンスデータ
     */
    async post(url, data = null, options = {}) {
        const requestOptions = {
            ...options,
            method: 'POST'
        };
        
        if (data !== null) {
            requestOptions.body = data;
        }
        
        return await this.request(url, requestOptions);
    }
    
    /**
     * PUTリクエスト
     * @param {string} url - リクエストURL
     * @param {any} data - 送信データ
     * @param {Object} options - オプション
     * @returns {Promise<Object>} レスポンスデータ
     */
    async put(url, data = null, options = {}) {
        const requestOptions = {
            ...options,
            method: 'PUT'
        };
        
        if (data !== null) {
            requestOptions.body = data;
        }
        
        return await this.request(url, requestOptions);
    }
    
    /**
     * DELETEリクエスト
     * @param {string} url - リクエストURL
     * @param {Object} options - オプション
     * @returns {Promise<Object>} レスポンスデータ
     */
    async delete(url, options = {}) {
        return await this.request(url, { ...options, method: 'DELETE' });
    }
    
    /**
     * 統計情報の取得
     * @returns {Object} 統計情報
     */
    getStats() {
        return {
            baseURL: this.baseURL,
            timeout: this.timeout,
            retryAttempts: this.retryAttempts,
            csrfProtectionEnabled: !!this.csrfProtection
        };
    }
}

// グローバルインスタンス
window.secureAPI = new SecureAPI();

// グローバルに公開
window.SecureAPI = SecureAPI;