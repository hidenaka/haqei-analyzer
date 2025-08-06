/**
 * HAQEI Future Simulator Local Development Configuration - Complete Version
 * ローカル開発環境用設定 - Phase 1 Implementation
 * 
 * 実装日: 2025年8月6日
 * 担当: HAQEI Programming Agent  
 * 目的: 開発環境での最適化とデバッグ支援
 */

// 開発環境フラグの設定
window.HAQEI_DEV_MODE = true;
window.HAQEI_LOCAL_DEV = true;

// 開発環境用設定オブジェクト
window.HAQEI_CONFIG = {
    // ==================================
    // 開発モード設定
    // ==================================
    skipComplexInit: true,              // 複雑な初期化をスキップ
    useSimpleAnalysis: true,            // 簡易分析モードを使用
    enableDebugMode: true,              // デバッグモードを有効化
    skipKuromojiInit: false,            // kuromoji.js初期化をスキップしない
    maxInitTimeout: 5000,               // 初期化タイムアウト (ms)
    fallbackMode: true,                 // フォールバック機能を有効化
    
    // ==================================
    // パフォーマンス最適化
    // ==================================
    performance: {
        enableCache: true,              // キャッシュを有効化
        cacheTimeout: 300000,           // キャッシュタイムアウト (5分)
        enableLazyLoading: true,        // 遅延読み込みを有効化
        enableCompression: false,       // 開発時は圧縮無効
        enableMinification: false,      // 開発時は最小化無効
        maxConcurrentRequests: 3        // 同時リクエスト数制限
    },
    
    // ==================================
    // デバッグ設定
    // ==================================
    debug: {
        enableConsoleLogging: true,     // コンソールログを有効化
        logLevel: 'debug',              // ログレベル (debug|info|warn|error)
        enablePerformanceLogging: true, // パフォーマンスログを有効化
        enableErrorTracking: true,      // エラートラッキングを有効化
        showDebugUI: true,             // デバッグUIを表示
        enableNetworkLogging: false     // ネットワークログ (本番では無効)
    },
    
    // ==================================
    // 分析エンジン設定
    // ==================================
    analysis: {
        enableDynamicKeywords: true,    // 動的キーワード生成有効
        enableIntegratedAnalysis: true, // 統合分析有効
        enableIChingIntegration: true,  // I Ching統合有効
        enableBunenjinPhilosophy: true, // bunenjin哲学有効
        maxKeywords: 20,                // 最大キーワード数
        analysisTimeout: 15000,         // 分析タイムアウト (15秒)
        enableCache: true,              // 分析結果キャッシュ
        cacheExpiry: 1800000,           // キャッシュ有効期限 (30分)
        minConfidenceThreshold: 0.3     // 最低信頼度閾値
    }
};

// ==================================
// 開発者用ユーティリティ関数
// ==================================

// デバッグログ関数
window.HAQEI_DEBUG = {
    log: function(message, data = null) {
        if (window.HAQEI_CONFIG.debug.enableConsoleLogging) {
            const timestamp = new Date().toISOString();
            if (data) {
                console.log(`[HAQEI-DEBUG ${timestamp}]`, message, data);
            } else {
                console.log(`[HAQEI-DEBUG ${timestamp}]`, message);
            }
        }
    },
    
    warn: function(message, data = null) {
        const timestamp = new Date().toISOString();
        if (data) {
            console.warn(`[HAQEI-WARN ${timestamp}]`, message, data);
        } else {
            console.warn(`[HAQEI-WARN ${timestamp}]`, message);
        }
    },
    
    error: function(message, error = null) {
        const timestamp = new Date().toISOString();
        if (error) {
            console.error(`[HAQEI-ERROR ${timestamp}]`, message, error);
        } else {
            console.error(`[HAQEI-ERROR ${timestamp}]`, message);
        }
    }
};

// ==================================
// 初期化完了通知
// ==================================
console.log('✅ HAQEI Future Simulator Local Development Config loaded successfully');
console.log('🔧 Development mode enabled:', window.HAQEI_DEV_MODE);
console.log('📊 Debug mode enabled:', window.HAQEI_CONFIG.debug.enableConsoleLogging);