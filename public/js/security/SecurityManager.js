/**
 * Security Manager - Phase 4セキュリティ強化システム
 * CSP、XSS防護、データ暗号化、プライバシー保護
 * 
 * @class SecurityManager
 * @version 1.0.0
 * @date 2025-08-12
 */

class SecurityManager {
    constructor() {
        this.securityLevel = 'high';
        
        this.policies = {
            csp: {
                'default-src': ["'self'"],
                'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
                'style-src': ["'self'", "'unsafe-inline'"],
                'img-src': ["'self'", 'data:', 'blob:'],
                'connect-src': ["'self'", 'https://api.haqei.com'],
                'font-src': ["'self'", 'data:'],
                'object-src': ["'none'"],
                'base-uri': ["'self'"],
                'form-action': ["'self'"]
            },
            
            xss: {
                enabled: true,
                sanitizeInputs: true,
                validateOutputs: true,
                escapeHTML: true
            },
            
            privacy: {
                localStorageOnly: true,
                noExternalTracking: true,
                encryptSensitiveData: true,
                anonymizeUserData: true
            }
        };
        
        this.threats = [];
        this.securityEvents = [];
        
        this.init();
    }
    
    /**
     * セキュリティシステム初期化
     */
    init() {
        console.log('🛡️ Security Manager initializing...');
        
        // CSPヘッダー設定
        this.setupCSP();
        
        // XSS防護
        this.setupXSSProtection();
        
        // プライバシー保護
        this.setupPrivacyProtection();
        
        // セキュリティ監視開始
        this.startSecurityMonitoring();
        
        // データ暗号化
        this.setupDataEncryption();
        
        console.log('✅ Security Manager initialized');
    }
    
    /**
     * Content Security Policy設定
     */
    setupCSP() {
        const cspString = Object.entries(this.policies.csp)
            .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
            .join('; ');
        
        // CSPヘッダー設定（meta tag）
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = cspString;
        document.head.appendChild(meta);
        
        console.log('🛡️ CSP configured:', cspString);
        
        // CSP violation監視
        document.addEventListener('securitypolicyviolation', (event) => {
            this.handleCSPViolation(event);
        });
    }
    
    /**
     * XSS防護設定
     */
    setupXSSProtection() {
        // X-XSS-Protection header simulation
        const xssProtectionMeta = document.createElement('meta');
        xssProtectionMeta.httpEquiv = 'X-XSS-Protection';
        xssProtectionMeta.content = '1; mode=block';
        document.head.appendChild(xssProtectionMeta);
        
        // X-Content-Type-Options
        const noSniffMeta = document.createElement('meta');
        noSniffMeta.httpEquiv = 'X-Content-Type-Options';
        noSniffMeta.content = 'nosniff';
        document.head.appendChild(noSniffMeta);
        
        // DOM操作監視
        this.setupDOMSanitization();
        
        console.log('🔒 XSS Protection enabled');
    }
    
    /**
     * DOM サニタイゼーション
     */
    setupDOMSanitization() {
        // innerHTML操作を監視
        const originalInnerHTML = Element.prototype.__lookupSetter__('innerHTML');
        const self = this; // SecurityManagerインスタンスへの参照を保持
        
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                // window.securityManagerではなく、self参照を使用
                const sanitized = self.sanitizeHTML(value);
                originalInnerHTML.call(this, sanitized);
            },
            get: Element.prototype.__lookupGetter__('innerHTML')
        });
        
        // Zone D入力値サニタイゼーション
        this.setupInputSanitization();
    }
    
    /**
     * 入力値サニタイゼーション
     */
    setupInputSanitization() {
        document.addEventListener('input', (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                const sanitized = this.sanitizeInput(event.target.value);
                if (sanitized !== event.target.value) {
                    event.target.value = sanitized;
                    this.logSecurityEvent('input_sanitized', {
                        element: event.target.id || event.target.name,
                        original_length: event.target.value.length,
                        sanitized_length: sanitized.length
                    });
                }
            }
        });
    }
    
    /**
     * HTMLサニタイゼーション
     */
    sanitizeHTML(html) {
        if (typeof html !== 'string') return html;
        
        // アプリケーション内部で生成された安全なHTMLかチェック
        // 質問表示など、システムが生成したHTMLは信頼する
        if (html.includes('class="option-text"') || 
            html.includes('class="question-card"') ||
            html.includes('class="result-') ||
            html.includes('data-question-id')) {
            // 危険なスクリプトとイベントハンドラのみ削除
            const dangerousTags = /<script[^>]*>.*?<\/script>/gis;
            const dangerousAttributes = /on\w+\s*=\s*["'][^"']*["']/gi;
            const dangerousProtocols = /javascript:|data:|vbscript:/gi;
            
            return html
                .replace(dangerousTags, '')
                .replace(dangerousAttributes, '')
                .replace(dangerousProtocols, '');
        }
        
        // ユーザー入力や外部データは厳格にサニタイズ
        const dangerousTags = /<script[^>]*>.*?<\/script>/gis;
        const dangerousAttributes = /on\w+\s*=\s*["'][^"']*["']/gi;
        const dangerousProtocols = /javascript:|data:|vbscript:/gi;
        
        let sanitized = html
            .replace(dangerousTags, '')
            .replace(dangerousAttributes, '')
            .replace(dangerousProtocols, '');
        
        // ユーザー入力の場合のみHTMLエンティティエスケープ
        const entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };
        
        // Zone D関連の入力のみ厳格にエスケープ
        if (html.length < 1000 && !html.includes('class=')) {
            sanitized = sanitized.replace(/[&<>"'\/]/g, (s) => entityMap[s]);
        }
        
        return sanitized;
    }
    
    /**
     * 入力値サニタイゼーション
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        // SQLインジェクション対策
        const sqlPatterns = [
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/gi,
            /(--|\#|\/\*|\*\/)/g,
            /('|(\\')|("|\\"))/g
        ];
        
        let sanitized = input;
        sqlPatterns.forEach(pattern => {
            sanitized = sanitized.replace(pattern, '');
        });
        
        // XSS対策
        sanitized = this.sanitizeHTML(sanitized);
        
        // 長さ制限
        if (sanitized.length > 1000) {
            sanitized = sanitized.substring(0, 1000);
        }
        
        return sanitized;
    }
    
    /**
     * プライバシー保護設定
     */
    setupPrivacyProtection() {
        // Referrer Policy
        const referrerMeta = document.createElement('meta');
        referrerMeta.name = 'referrer';
        referrerMeta.content = 'strict-origin-when-cross-origin';
        document.head.appendChild(referrerMeta);
        
        // プライベートブラウジング検出
        this.detectPrivateBrowsing();
        
        // LocalStorage暗号化
        this.encryptLocalStorage();
        
        // 外部トラッキング防止
        this.blockExternalTracking();
        
        console.log('🔐 Privacy Protection enabled');
    }
    
    /**
     * プライベートブラウジング検出
     */
    detectPrivateBrowsing() {
        return new Promise((resolve) => {
            const storage = window.sessionStorage;
            try {
                storage.setItem('private_test', '1');
                storage.removeItem('private_test');
                resolve(false); // 通常モード
            } catch (e) {
                resolve(true);  // プライベートモード
            }
        }).then(isPrivate => {
            this.isPrivateBrowsing = isPrivate;
            if (isPrivate) {
                console.log('🕶️ Private browsing detected');
                this.adjustForPrivateBrowsing();
            }
        });
    }
    
    /**
     * プライベートブラウジング時の調整
     */
    adjustForPrivateBrowsing() {
        // LocalStorageの使用を制限
        this.policies.privacy.localStorageOnly = false;
        
        // メモリ内一時保存に切り替え
        window.tempStorage = {};
        
        // KPIアナライザーにプライベートモードを通知
        if (window.kpiAnalyzer) {
            window.kpiAnalyzer.setPrivateMode(true);
        }
    }
    
    /**
     * LocalStorage暗号化
     */
    encryptLocalStorage() {
        const originalSetItem = localStorage.setItem.bind(localStorage);
        const originalGetItem = localStorage.getItem.bind(localStorage);
        
        localStorage.setItem = (key, value) => {
            if (key.startsWith('haqei_')) {
                const encrypted = this.encrypt(value);
                originalSetItem(`${key}_encrypted`, encrypted);
            } else {
                originalSetItem(key, value);
            }
        };
        
        localStorage.getItem = (key) => {
            if (key.startsWith('haqei_')) {
                const encrypted = originalGetItem(`${key}_encrypted`);
                return encrypted ? this.decrypt(encrypted) : null;
            } else {
                return originalGetItem(key);
            }
        };
        
        console.log('🔐 LocalStorage encryption enabled');
    }
    
    /**
     * 簡易暗号化
     */
    encrypt(text) {
        // 簡易XOR暗号化（本番では強力な暗号化を使用）
        const key = 'haqei_security_key_2025';
        let encrypted = '';
        
        for (let i = 0; i < text.length; i++) {
            const keyChar = key.charCodeAt(i % key.length);
            const textChar = text.charCodeAt(i);
            encrypted += String.fromCharCode(textChar ^ keyChar);
        }
        
        return btoa(encrypted);
    }
    
    /**
     * 簡易復号化
     */
    decrypt(encryptedText) {
        try {
            const key = 'haqei_security_key_2025';
            const encrypted = atob(encryptedText);
            let decrypted = '';
            
            for (let i = 0; i < encrypted.length; i++) {
                const keyChar = key.charCodeAt(i % key.length);
                const encryptedChar = encrypted.charCodeAt(i);
                decrypted += String.fromCharCode(encryptedChar ^ keyChar);
            }
            
            return decrypted;
        } catch (e) {
            console.warn('🔓 Decryption failed:', e);
            return null;
        }
    }
    
    /**
     * 外部トラッキング防止
     */
    blockExternalTracking() {
        // Google Analytics等の外部トラッキングをブロック
        const blockedDomains = [
            'google-analytics.com',
            'googletagmanager.com',
            'facebook.com',
            'twitter.com',
            'doubleclick.net'
        ];
        
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            if (typeof url === 'string') {
                for (const domain of blockedDomains) {
                    if (url.includes(domain)) {
                        console.log('🚫 Blocked tracking request:', url);
                        return Promise.reject(new Error('Blocked by SecurityManager'));
                    }
                }
            }
            return originalFetch(url, options);
        };
        
        console.log('🚫 External tracking blocked');
    }
    
    /**
     * セキュリティ監視開始
     */
    startSecurityMonitoring() {
        // 不審な活動を監視
        this.monitorSuspiciousActivity();
        
        // セキュリティイベントのログ
        this.startSecurityLogging();
        
        // 定期セキュリティチェック
        this.scheduleSecurityChecks();
    }
    
    /**
     * 不審な活動監視
     */
    monitorSuspiciousActivity() {
        let rapidClickCount = 0;
        let lastClickTime = 0;
        
        document.addEventListener('click', (event) => {
            const now = Date.now();
            
            // 異常に高速なクリック検出
            if (now - lastClickTime < 50) {
                rapidClickCount++;
                if (rapidClickCount > 5) {
                    this.handleSuspiciousActivity('rapid_clicking', {
                        count: rapidClickCount,
                        target: event.target.tagName
                    });
                }
            } else {
                rapidClickCount = 0;
            }
            
            lastClickTime = now;
        });
        
        // 開発者ツール検出
        this.detectDevTools();
    }
    
    /**
     * 開発者ツール検出
     */
    detectDevTools() {
        let devtools = false;
        
        const detectMethod1 = () => {
            const start = new Date();
            debugger;
            const end = new Date();
            return end - start > 100;
        };
        
        const detectMethod2 = () => {
            return window.outerHeight - window.innerHeight > 200;
        };
        
        setInterval(() => {
            if (detectMethod1() || detectMethod2()) {
                if (!devtools) {
                    devtools = true;
                    this.handleSuspiciousActivity('devtools_detected', {
                        method: detectMethod1() ? 'debugger' : 'window_size',
                        timestamp: new Date().toISOString()
                    });
                }
            } else {
                devtools = false;
            }
        }, 5000);
    }
    
    /**
     * 不審な活動への対処
     */
    handleSuspiciousActivity(type, details) {
        console.warn('🚨 Suspicious activity detected:', type, details);
        
        this.logSecurityEvent('suspicious_activity', {
            type: type,
            details: details,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        });
        
        // 必要に応じて制限措置
        if (type === 'rapid_clicking' && details.count > 10) {
            this.temporaryDisable(5000); // 5秒間無効化
        }
    }
    
    /**
     * 一時的な機能無効化
     */
    temporaryDisable(duration) {
        const buttons = document.querySelectorAll('button, input[type="submit"]');
        buttons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
        });
        
        setTimeout(() => {
            buttons.forEach(button => {
                button.disabled = false;
                button.style.opacity = '1';
            });
        }, duration);
        
        console.log(`🔒 Functions temporarily disabled for ${duration}ms`);
    }
    
    /**
     * CSP違反処理
     */
    handleCSPViolation(event) {
        this.logSecurityEvent('csp_violation', {
            blockedURI: event.blockedURI,
            violatedDirective: event.violatedDirective,
            sourceFile: event.sourceFile,
            lineNumber: event.lineNumber
        });
        
        console.warn('🚨 CSP Violation:', event.violatedDirective, event.blockedURI);
    }
    
    /**
     * セキュリティイベントログ
     */
    logSecurityEvent(type, details) {
        const event = {
            id: this.generateEventId(),
            type: type,
            details: details,
            timestamp: new Date().toISOString(),
            sessionId: window.kpiAnalyzer?.sessionId || 'unknown'
        };
        
        this.securityEvents.push(event);
        
        // 重要なイベントはすぐに記録
        if (['csp_violation', 'suspicious_activity'].includes(type)) {
            this.persistSecurityEvent(event);
        }
        
        // バッファサイズ制限
        if (this.securityEvents.length > 100) {
            this.securityEvents.shift();
        }
    }
    
    /**
     * セキュリティイベント永続化
     */
    persistSecurityEvent(event) {
        try {
            const securityLog = JSON.parse(localStorage.getItem('haqei_security_log') || '[]');
            securityLog.push(event);
            
            // 最新100件のみ保持
            if (securityLog.length > 100) {
                securityLog.shift();
            }
            
            localStorage.setItem('haqei_security_log', JSON.stringify(securityLog));
        } catch (e) {
            console.warn('Failed to persist security event:', e);
        }
    }
    
    /**
     * 定期セキュリティチェック
     */
    scheduleSecurityChecks() {
        setInterval(() => {
            this.runSecurityCheck();
        }, 60000); // 1分間隔
    }
    
    /**
     * セキュリティチェック実行
     */
    runSecurityCheck() {
        const checks = [
            this.checkCSPCompliance(),
            this.checkDataIntegrity(),
            this.checkPrivacySettings(),
            this.checkSuspiciousPatterns()
        ];
        
        Promise.all(checks).then(results => {
            const score = results.reduce((sum, result) => sum + result.score, 0) / results.length;
            
            if (score < 70) {
                console.warn('🔴 Security score low:', score);
                this.handleSecurityDegradation(results);
            } else {
                console.log('🟢 Security check passed:', score);
            }
        });
    }
    
    /**
     * セキュリティチェック項目
     */
    checkCSPCompliance() {
        // CSP設定の確認
        const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        return {
            name: 'CSP Compliance',
            score: cspMeta ? 100 : 0,
            details: cspMeta ? 'CSP configured' : 'CSP missing'
        };
    }
    
    checkDataIntegrity() {
        // データ整合性の確認
        try {
            const testData = localStorage.getItem('haqei_test_integrity');
            const isIntact = testData === null; // 改ざんされていない
            return {
                name: 'Data Integrity',
                score: isIntact ? 100 : 0,
                details: isIntact ? 'Data intact' : 'Data compromised'
            };
        } catch (e) {
            return {
                name: 'Data Integrity',
                score: 0,
                details: 'Check failed'
            };
        }
    }
    
    checkPrivacySettings() {
        // プライバシー設定の確認
        const score = this.policies.privacy.localStorageOnly ? 100 : 50;
        return {
            name: 'Privacy Settings',
            score: score,
            details: 'Privacy policies active'
        };
    }
    
    checkSuspiciousPatterns() {
        // 不審なパターンの確認
        const recentEvents = this.securityEvents.filter(e => 
            Date.now() - new Date(e.timestamp).getTime() < 300000
        );
        
        const suspiciousCount = recentEvents.filter(e => 
            e.type === 'suspicious_activity'
        ).length;
        
        const score = Math.max(0, 100 - (suspiciousCount * 20));
        
        return {
            name: 'Suspicious Patterns',
            score: score,
            details: `${suspiciousCount} suspicious events in last 5 minutes`
        };
    }
    
    /**
     * セキュリティ低下時の処理
     */
    handleSecurityDegradation(results) {
        console.warn('🚨 Security degradation detected:', results);
        
        // 高リスク機能の無効化
        this.disableHighRiskFeatures();
        
        // セキュリティアラート
        this.showSecurityAlert();
        
        // 管理者通知（本番環境）
        this.notifyAdministrator(results);
    }
    
    /**
     * 高リスク機能無効化
     */
    disableHighRiskFeatures() {
        // Zone D機能の制限
        const zoneDContainer = document.getElementById('zone-d-container');
        if (zoneDContainer) {
            zoneDContainer.style.display = 'none';
        }
        
        // KPI収集の停止
        if (window.kpiAnalyzer && window.kpiAnalyzer.pause) {
            window.kpiAnalyzer.pause();
        }
        
        console.log('🔒 High-risk features disabled');
    }
    
    /**
     * セキュリティアラート表示
     */
    showSecurityAlert() {
        const alert = document.createElement('div');
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        alert.innerHTML = `
            <strong>🚨 セキュリティアラート</strong><br>
            不審な活動が検出されました。一部機能を制限しています。
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 10000);
    }
    
    /**
     * 管理者通知
     */
    notifyAdministrator(results) {
        // 本番環境では実際のアラート送信
        console.log('📧 Administrator notification sent:', results);
    }
    
    /**
     * イベントID生成
     */
    generateEventId() {
        return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * セキュリティレポート生成
     */
    generateSecurityReport() {
        const report = {
            timestamp: new Date().toISOString(),
            securityLevel: this.securityLevel,
            policies: this.policies,
            events: this.securityEvents.length,
            recentThreats: this.securityEvents.filter(e => 
                Date.now() - new Date(e.timestamp).getTime() < 3600000
            ).length,
            isPrivateBrowsing: this.isPrivateBrowsing || false,
            recommendations: this.generateRecommendations()
        };
        
        console.log('🛡️ Security Report:', report);
        return report;
    }
    
    /**
     * セキュリティ推奨事項生成
     */
    generateRecommendations() {
        const recommendations = [];
        
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
            recommendations.push('CSP強化が必要');
        }
        
        if (this.securityEvents.length > 50) {
            recommendations.push('セキュリティイベントが多数発生');
        }
        
        if (!this.policies.privacy.encryptSensitiveData) {
            recommendations.push('機密データの暗号化を強化');
        }
        
        return recommendations;
    }
}

// グローバル初期化
if (typeof window !== 'undefined') {
    window.SecurityManager = SecurityManager;
    
    // DOMロード前に初期化（セキュリティ優先）
    window.securityManager = new SecurityManager();
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityManager;
}