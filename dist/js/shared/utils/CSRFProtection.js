/**
 * CSRF保護ユーティリティ
 * クライアントサイドでのCSRF攻撃対策を提供
 * @class CSRFProtection
 */
class CSRFProtection {
    constructor() {
        this.tokenStore = new Map();
        this.tokenKey = '_csrf_token';
        this.headerName = 'X-CSRF-Token';
        this.metaName = 'csrf-token';
        
        // セッションベースのトークン管理
        this.sessionId = this.getOrCreateSessionId();
        
        console.log('✅ CSRF Protection initialized');
    }
    
    /**
     * セッションIDの取得または生成
     * @returns {string} セッションID
     */
    getOrCreateSessionId() {
        let sessionId = sessionStorage.getItem('haqei_session_id');
        if (!sessionId) {
            sessionId = this.generateSecureRandom(32);
            sessionStorage.setItem('haqei_session_id', sessionId);
        }
        return sessionId;
    }
    
    /**
     * セキュアなランダム値生成
     * @param {number} length - 生成する長さ
     * @returns {string} ランダム文字列
     */
    generateSecureRandom(length) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    /**
     * CSRFトークンの生成
     * @returns {string} 生成されたトークン
     */
    generateToken() {
        const token = this.generateSecureRandom(32);
        const now = Date.now();
        
        this.tokenStore.set(this.sessionId, {
            token,
            createdAt: now,
            expiresAt: now + (30 * 60 * 1000), // 30分有効
            used: false
        });
        
        // メタタグに設定
        this.setMetaToken(token);
        
        // ローカルストレージにも保存（セッション間の連携用）
        localStorage.setItem(this.tokenKey, JSON.stringify({
            token,
            sessionId: this.sessionId,
            createdAt: now,
            expiresAt: now + (30 * 60 * 1000)
        }));
        
        console.log('🔐 CSRF token generated:', token.substring(0, 8) + '...');
        return token;
    }
    
    /**
     * メタタグにトークンを設定
     * @param {string} token - CSRFトークン
     */
    setMetaToken(token) {
        let metaTag = document.querySelector(`meta[name="${this.metaName}"]`);
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.name = this.metaName;
            document.head.appendChild(metaTag);
        }
        metaTag.content = token;
    }
    
    /**
     * 現在のトークンを取得
     * @returns {string|null} 現在のトークン
     */
    getCurrentToken() {
        // まずメタタグから取得
        const metaTag = document.querySelector(`meta[name="${this.metaName}"]`);
        if (metaTag && metaTag.content) {
            return metaTag.content;
        }
        
        // ローカルストレージから取得
        try {
            const stored = localStorage.getItem(this.tokenKey);
            if (stored) {
                const tokenData = JSON.parse(stored);
                if (Date.now() < tokenData.expiresAt) {
                    this.setMetaToken(tokenData.token);
                    return tokenData.token;
                }
            }
        } catch (e) {
            console.warn('Failed to parse stored CSRF token:', e);
        }
        
        // 新しいトークンを生成
        return this.generateToken();
    }
    
    /**
     * トークンの検証
     * @param {string} token - 検証するトークン
     * @returns {boolean} 検証結果
     */
    validateToken(token) {
        if (!token) {
            console.warn('No CSRF token provided');
            return false;
        }
        
        const stored = this.tokenStore.get(this.sessionId);
        if (!stored) {
            console.warn('No stored CSRF token found');
            return false;
        }
        
        if (Date.now() > stored.expiresAt) {
            console.warn('CSRF token expired');
            this.tokenStore.delete(this.sessionId);
            return false;
        }
        
        if (stored.used) {
            console.warn('CSRF token already used');
            return false;
        }
        
        // タイミング攻撃を防ぐための定数時間比較
        if (!this.constantTimeEqual(stored.token, token)) {
            console.warn('CSRF token mismatch');
            return false;
        }
        
        // ワンタイム使用のためマーク
        stored.used = true;
        
        console.log('✅ CSRF token validated successfully');
        return true;
    }
    
    /**
     * 定数時間での文字列比較
     * @param {string} a - 比較する文字列A
     * @param {string} b - 比較する文字列B
     * @returns {boolean} 比較結果
     */
    constantTimeEqual(a, b) {
        if (a.length !== b.length) {
            return false;
        }
        
        let result = 0;
        for (let i = 0; i < a.length; i++) {
            result |= a.charCodeAt(i) ^ b.charCodeAt(i);
        }
        
        return result === 0;
    }
    
    /**
     * 期限切れトークンのクリーンアップ
     */
    cleanupExpiredTokens() {
        const now = Date.now();
        for (const [sessionId, tokenData] of this.tokenStore.entries()) {
            if (now > tokenData.expiresAt) {
                this.tokenStore.delete(sessionId);
                console.log('🧹 Expired CSRF token cleaned up');
            }
        }
    }
    
    /**
     * セキュアなフェッチリクエスト
     * @param {string} url - リクエストURL
     * @param {Object} options - フェッチオプション
     * @returns {Promise<Response>} フェッチレスポンス
     */
    async secureRequest(url, options = {}) {
        // CSRFトークンを取得
        const token = this.getCurrentToken();
        
        // デフォルトオプションを設定
        const secureOptions = {
            credentials: 'same-origin', // 同一オリジンのみクッキー送信
            ...options,
            headers: {
                'Content-Type': 'application/json',
                [this.headerName]: token,
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(url, secureOptions);
            
            // 新しいトークンがレスポンスヘッダーに含まれているかチェック
            const newToken = response.headers.get('X-New-CSRF-Token');
            if (newToken) {
                this.setMetaToken(newToken);
                localStorage.setItem(this.tokenKey, JSON.stringify({
                    token: newToken,
                    sessionId: this.sessionId,
                    createdAt: Date.now(),
                    expiresAt: Date.now() + (30 * 60 * 1000)
                }));
                console.log('🔄 CSRF token updated from server');
            }
            
            return response;
        } catch (error) {
            console.error('❌ Secure request failed:', error);
            throw error;
        }
    }
    
    /**
     * フォームにCSRFトークンを追加
     * @param {HTMLFormElement} form - 対象フォーム
     */
    addTokenToForm(form) {
        if (!form || !(form instanceof HTMLFormElement)) {
            console.error('Invalid form element provided');
            return;
        }
        
        // 既存のCSRFトークン入力を削除
        const existingToken = form.querySelector(`input[name="${this.tokenKey}"]`);
        if (existingToken) {
            existingToken.remove();
        }
        
        // 新しいCSRFトークン入力を追加
        const token = this.getCurrentToken();
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = this.tokenKey;
        tokenInput.value = token;
        
        form.appendChild(tokenInput);
        console.log('🔐 CSRF token added to form');
    }
    
    /**
     * 全フォームにCSRFトークンを追加
     */
    protectAllForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // POSTメソッドのフォームのみ保護
            if (form.method.toLowerCase() === 'post') {
                this.addTokenToForm(form);
            }
        });
        console.log(`🛡️ Protected ${forms.length} forms with CSRF tokens`);
    }
    
    /**
     * オリジン検証
     * @param {string} origin - 検証するオリジン
     * @returns {boolean} 検証結果
     */
    validateOrigin(origin) {
        const expectedOrigins = [
            'https://haqei.com',
            'https://www.haqei.com',
            'http://localhost:3000',
            'http://127.0.0.1:3000'
        ];
        
        return expectedOrigins.includes(origin);
    }
    
    /**
     * リファラー検証
     * @param {string} referer - 検証するリファラー
     * @returns {boolean} 検証結果
     */
    validateReferer(referer) {
        if (!referer) {
            return false;
        }
        
        const allowedDomains = [
            'haqei.com',
            'www.haqei.com',
            'localhost:3000',
            '127.0.0.1:3000'
        ];
        
        try {
            const url = new URL(referer);
            return allowedDomains.includes(url.host);
        } catch (e) {
            console.warn('Invalid referer URL:', referer);
            return false;
        }
    }
    
    /**
     * SameSite Cookieの設定
     * @param {string} name - Cookie名
     * @param {string} value - Cookie値
     * @param {Object} options - Cookieオプション
     */
    setSecureCookie(name, value, options = {}) {
        const secureOptions = {
            httpOnly: false, // クライアント側で設定するため
            secure: location.protocol === 'https:',
            sameSite: 'Strict',
            path: '/',
            maxAge: 3600, // 1時間
            ...options
        };
        
        let cookieString = `${name}=${value}`;
        
        Object.entries(secureOptions).forEach(([key, val]) => {
            if (key === 'maxAge') {
                cookieString += `; Max-Age=${val}`;
            } else if (key === 'httpOnly' && val) {
                cookieString += '; HttpOnly';
            } else if (key === 'secure' && val) {
                cookieString += '; Secure';
            } else if (key === 'sameSite') {
                cookieString += `; SameSite=${val}`;
            } else if (typeof val === 'string') {
                cookieString += `; ${key}=${val}`;
            }
        });
        
        document.cookie = cookieString;
        console.log('🍪 Secure cookie set:', name);
    }
    
    /**
     * 統計情報の取得
     * @returns {Object} 統計情報
     */
    getStats() {
        return {
            activeTokens: this.tokenStore.size,
            sessionId: this.sessionId,
            currentToken: this.getCurrentToken()?.substring(0, 8) + '...'
        };
    }
}

// グローバルインスタンス
window.csrfProtection = new CSRFProtection();

// 定期的なクリーンアップ（5分毎）
setInterval(() => {
    window.csrfProtection.cleanupExpiredTokens();
}, 5 * 60 * 1000);

// DOM読み込み完了時に全フォームを保護
document.addEventListener('DOMContentLoaded', () => {
    window.csrfProtection.protectAllForms();
});

// グローバルに公開
window.CSRFProtection = CSRFProtection;