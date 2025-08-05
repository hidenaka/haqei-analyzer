/**
 * Future Simulator ローカル開発環境用設定
 * セキュリティポリシーを開発環境用に緩和
 * 最優先で読み込まれ、環境を自動判定
 */

(function() {
    'use strict';
    
    // 環境検出
    const ENV = {
        isDevelopment: ['localhost', '127.0.0.1'].includes(window.location.hostname),
        isStaging: window.location.hostname.includes('staging'),
        isProduction: !(['localhost', '127.0.0.1'].includes(window.location.hostname)) && 
                      !window.location.hostname.includes('staging')
    };
    
    // グローバル設定オブジェクト
    window.HAQEI_CONFIG = {
        environment: ENV.isDevelopment ? 'development' : 
                    ENV.isStaging ? 'staging' : 'production',
        security: {
            enableCSP: !ENV.isDevelopment,
            enableSRI: !ENV.isDevelopment,
            allowInlineScripts: ENV.isDevelopment,
            allowInlineStyles: ENV.isDevelopment,
            allowExternalScripts: true,
            CSPNonce: ENV.isDevelopment ? 'dev-nonce' : null
        },
        debug: ENV.isDevelopment,
        errorHandling: {
            showDetails: ENV.isDevelopment,
            logToConsole: true,
            logToServer: ENV.isProduction,
            suppressCSPWarnings: ENV.isDevelopment
        },
        performance: {
            enableOptimizations: !ENV.isDevelopment,
            lazyLoadThreshold: ENV.isDevelopment ? 0 : 200
        }
    };
    
    // 開発環境の場合、追加の緩和設定
    if (ENV.isDevelopment) {
        console.log('🔧 HAQEI開発環境モード有効化');
        console.log('📋 環境設定:', window.HAQEI_CONFIG);
        
        // SecurityHeaderManagerの事前設定
        window.SECURITY_OVERRIDE = true;
        window.DEV_MODE = true;
        window.DISABLE_CSP = true;
        
        // DOMPurifyのintegrityチェックをスキップ
        window.SKIP_INTEGRITY_CHECK = true;
        
        // インラインスクリプト・スタイルを許可
        window.ALLOW_INLINE_SCRIPTS = true;
        window.ALLOW_INLINE_STYLES = true;
    
    // セキュリティマネージャーの初期化を遅延
    if (typeof window.SecurityHeaderManager !== 'undefined') {
        const originalInit = window.SecurityHeaderManager.prototype.init;
        window.SecurityHeaderManager.prototype.init = function() {
            console.log('🛡️ セキュリティマネージャー: 開発モードで初期化');
            // CSPを無効化
            this.environment = 'development';
            this.config.enableCSP = false;
            // オリジナルのinitを呼び出し
            return originalInit.call(this);
        };
    }
    
    // エラーログの詳細表示
    window.addEventListener('error', (e) => {
        console.error('🚨 グローバルエラー:', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            error: e.error
        });
    });
    
    // リソース読み込みエラーの詳細表示
    window.addEventListener('error', (e) => {
        if (e.target && e.target !== window) {
            console.error('🚨 リソース読み込みエラー:', {
                type: e.target.tagName,
                src: e.target.src || e.target.href,
                message: 'Failed to load resource'
            });
        }
    }, true);
        
        // CSP違反を抑制
        const originalViolationHandler = window.addEventListener;
        window.addEventListener = function(type, handler, options) {
            if (type === 'securitypolicyviolation' && ENV.isDevelopment) {
                console.log('🔇 CSP違反イベントを抑制');
                return;
            }
            return originalViolationHandler.call(window, type, handler, options);
        };
    }
    
    console.log('✅ HAQEI環境設定完了:', window.HAQEI_CONFIG.environment);
})();