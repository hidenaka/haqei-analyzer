/**
 * セキュリティヘッダー管理クラス
 * クライアントサイドでのセキュリティヘッダー制御とContent Security Policy設定
 * @class SecurityHeaders
 */
class SecurityHeaders {
    constructor() {
        this.nonce = this.generateNonce();
        this.isProduction = this.isProductionEnvironment();
        
        console.log('✅ Security Headers initialized');
    }
    
    /**
     * nonceの生成
     * @returns {string} 生成されたnonce
     */
    generateNonce() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return btoa(String.fromCharCode(...array));
    }
    
    /**
     * 本番環境かどうかの判定
     * @returns {boolean} 本番環境かどうか
     */
    isProductionEnvironment() {
        const hostname = window.location.hostname;
        return hostname === 'haqei.com' || hostname === 'www.haqei.com';
    }
    
    /**
     * Content Security Policyの設定
     */
    setContentSecurityPolicy() {
        // 既存のCSPメタタグを削除
        const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (existingCSP) {
            existingCSP.remove();
        }
        
        // CSPポリシーの構築
        const cspDirectives = this.buildCSPDirectives();
        const cspString = Object.entries(cspDirectives)
            .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
            .join('; ');
        
        // CSPメタタグの追加
        const cspMeta = document.createElement('meta');
        cspMeta.httpEquiv = 'Content-Security-Policy';
        cspMeta.content = cspString;
        document.head.appendChild(cspMeta);
        
        console.log('🛡️ Content Security Policy set:', cspString);
    }
    
    /**
     * CSPディレクティブの構築
     * @returns {Object} CSPディレクティブオブジェクト
     */
    buildCSPDirectives() {
        const baseDirectives = {
            'default-src': ["'self'"],
            'script-src': [
                "'self'",
                `'nonce-${this.nonce}'`,
                "'unsafe-inline'", // Chart.js等の既存ライブラリのため一時的に許可
                'https://cdnjs.cloudflare.com'
            ],
            'style-src': [
                "'self'",
                `'nonce-${this.nonce}'`,
                "'unsafe-inline'" // カスタムCSSのため一時的に許可
            ],
            'img-src': [
                "'self'",
                'data:',
                'https:'
            ],
            'font-src': [
                "'self'",
                'data:',
                'https://fonts.googleapis.com',
                'https://fonts.gstatic.com'
            ],
            'connect-src': [
                "'self'",
                'https://api.haqei.com',
                'wss:'
            ],
            'frame-ancestors': ["'none'"],
            'base-uri': ["'self'"],
            'form-action': ["'self'"],
            'object-src': ["'none'"],
            'media-src': ["'self'"],
            'worker-src': ["'self'"]
        };
        
        // 開発環境では制限を緩和
        if (!this.isProduction) {
            baseDirectives['connect-src'].push('http://localhost:*', 'http://127.0.0.1:*');
            baseDirectives['script-src'].push('http://localhost:*', 'http://127.0.0.1:*');
        } else {
            // 本番環境では upgrade-insecure-requests を追加
            baseDirectives['upgrade-insecure-requests'] = [];
        }
        
        return baseDirectives;
    }
    
    /**
     * セキュリティ関連メタタグの設定
     */
    setSecurityMetaTags() {
        const metaTags = [
            // X-Content-Type-Options
            {
                httpEquiv: 'X-Content-Type-Options',
                content: 'nosniff'
            },
            // X-Frame-Options
            {
                httpEquiv: 'X-Frame-Options',
                content: 'DENY'
            },
            // X-XSS-Protection (古いブラウザ対応)
            {
                httpEquiv: 'X-XSS-Protection',
                content: '1; mode=block'
            },
            // Referrer Policy
            {
                name: 'referrer',
                content: 'strict-origin-when-cross-origin'
            },
            // Permissions Policy
            {
                httpEquiv: 'Permissions-Policy',
                content: 'geolocation=(), microphone=(), camera=(), usb=(), bluetooth=()'
            }
        ];
        
        // HSTS (本番環境のみ)
        if (this.isProduction) {
            metaTags.push({
                httpEquiv: 'Strict-Transport-Security',
                content: 'max-age=31536000; includeSubDomains; preload'
            });
        }
        
        // メタタグを追加
        metaTags.forEach(tagData => {
            // 既存のタグをチェック
            let selector = '';
            if (tagData.httpEquiv) {
                selector = `meta[http-equiv="${tagData.httpEquiv}"]`;
            } else if (tagData.name) {
                selector = `meta[name="${tagData.name}"]`;
            }
            
            if (selector) {
                const existing = document.querySelector(selector);
                if (existing) {
                    existing.remove();
                }
            }
            
            // 新しいメタタグを作成
            const meta = document.createElement('meta');
            if (tagData.httpEquiv) {
                meta.httpEquiv = tagData.httpEquiv;
            }
            if (tagData.name) {
                meta.name = tagData.name;
            }
            meta.content = tagData.content;
            
            document.head.appendChild(meta);
        });
        
        console.log('🔐 Security meta tags set');
    }
    
    /**
     * CORSヘッダーの検証
     * @param {Response} response - フェッチレスポンス
     * @returns {boolean} CORS検証結果
     */
    validateCORSHeaders(response) {
        const allowedOrigins = [
            'https://haqei.com',
            'https://www.haqei.com'
        ];
        
        if (!this.isProduction) {
            allowedOrigins.push('http://localhost:3000', 'http://127.0.0.1:3000');
        }
        
        const origin = response.headers.get('Access-Control-Allow-Origin');
        
        if (origin && origin !== '*' && !allowedOrigins.includes(origin)) {
            console.warn('Suspicious CORS origin:', origin);
            return false;
        }
        
        return true;
    }
    
    /**
     * セキュアなスクリプト読み込み
     * @param {string} src - スクリプトのURL
     * @param {Object} options - オプション
     * @returns {Promise<HTMLScriptElement>} 読み込まれたスクリプト要素
     */
    loadSecureScript(src, options = {}) {
        return new Promise((resolve, reject) => {
            // URL検証
            if (!this.validateScriptURL(src)) {
                reject(new Error('Invalid script URL'));
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.nonce = this.nonce;
            
            // セキュリティ属性の設定
            if (options.integrity) {
                script.integrity = options.integrity;
                script.crossOrigin = 'anonymous';
            }
            
            if (options.async !== false) {
                script.async = true;
            }
            
            if (options.defer) {
                script.defer = true;
            }
            
            // イベントハンドラー
            script.onload = () => resolve(script);
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            
            // スクリプトを挿入
            document.head.appendChild(script);
        });
    }
    
    /**
     * スクリプトURLの検証
     * @param {string} url - 検証するURL
     * @returns {boolean} 検証結果
     */
    validateScriptURL(url) {
        try {
            const scriptURL = new URL(url, window.location.origin);
            
            // 許可されたドメインのリスト
            const allowedDomains = [
                'haqei.com',
                'www.haqei.com',
                'cdnjs.cloudflare.com',
                'cdn.jsdelivr.net'
            ];
            
            if (!this.isProduction) {
                allowedDomains.push('localhost', '127.0.0.1');
            }
            
            // 同一オリジンまたは許可されたドメインからのみ読み込み
            if (scriptURL.origin === window.location.origin) {
                return true;
            }
            
            return allowedDomains.some(domain => scriptURL.hostname === domain);
            
        } catch (e) {
            console.error('Script URL validation failed:', e);
            return false;
        }
    }
    
    /**
     * インラインスクリプトのセキュア実行
     * @param {string} code - 実行するコード
     * @param {Object} context - 実行コンテキスト（オプション）
     */
    executeSecureInlineScript(code, context = {}) {
        // 危険なパターンのチェック
        const dangerousPatterns = [
            /eval\(/,
            /Function\(/,
            /setTimeout\s*\(\s*['"`]/,
            /setInterval\s*\(\s*['"`]/,
            /document\.write/,
            /innerHTML\s*=/,
            /outerHTML\s*=/,
            /javascript:/
        ];
        
        const isDangerous = dangerousPatterns.some(pattern => pattern.test(code));
        if (isDangerous) {
            console.error('Dangerous pattern detected in inline script:', code);
            return;
        }
        
        try {
            // セキュアなコンテキストで実行
            const func = new Function('context', 'SecureDOM', 'SecurityValidator', code);
            func(context, window.SecureDOM, window.SecurityValidator);
        } catch (error) {
            console.error('Secure inline script execution failed:', error);
        }
    }
    
    /**
     * セキュリティ状態の監視
     */
    monitorSecurityState() {
        // CSP違反の監視
        document.addEventListener('securitypolicyviolation', (event) => {
            console.error('CSP Violation:', {
                blockedURI: event.blockedURI,
                directive: event.violatedDirective,
                originalPolicy: event.originalPolicy,
                sourceFile: event.sourceFile,
                lineNumber: event.lineNumber
            });
            
            // CSP違反を報告する（本番環境）
            if (this.isProduction) {
                this.reportSecurityViolation(event);
            }
        });
        
        // Mixed content警告の監視
        if ('onSecurityPolicyViolation' in document) {
            document.onSecurityPolicyViolation = (event) => {
                console.warn('Security Policy Violation:', event);
            };
        }
        
        console.log('👁️ Security state monitoring enabled');
    }
    
    /**
     * セキュリティ違反の報告
     * @param {SecurityPolicyViolationEvent} event - 違反イベント
     */
    reportSecurityViolation(event) {
        const violationData = {
            blockedURI: event.blockedURI,
            directive: event.violatedDirective,
            originalPolicy: event.originalPolicy,
            sourceFile: event.sourceFile,
            lineNumber: event.lineNumber,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // セキュリティ違反レポートの送信（模擬）
        console.log('📊 Security violation reported:', violationData);
        
        // 実際の実装では適切なエンドポイントに送信
        // fetch('/api/security/violations', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(violationData)
        // });
    }
    
    /**
     * すべてのセキュリティヘッダーの適用
     */
    applyAllSecurityMeasures() {
        this.setContentSecurityPolicy();
        this.setSecurityMetaTags();
        this.monitorSecurityState();
        
        console.log('🛡️ All security measures applied');
    }
    
    /**
     * セキュリティ設定の取得
     * @returns {Object} セキュリティ設定情報
     */
    getSecurityConfig() {
        return {
            nonce: this.nonce,
            isProduction: this.isProduction,
            cspApplied: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
            securityMetaTagsCount: document.querySelectorAll('meta[http-equiv^="X-"], meta[name="referrer"]').length
        };
    }
}

// DOM読み込み完了時に自動適用
document.addEventListener('DOMContentLoaded', () => {
    const securityHeaders = new SecurityHeaders();
    securityHeaders.applyAllSecurityMeasures();
    
    // グローバルに公開
    window.securityHeaders = securityHeaders;
});

// グローバルに公開
window.SecurityHeaders = SecurityHeaders;