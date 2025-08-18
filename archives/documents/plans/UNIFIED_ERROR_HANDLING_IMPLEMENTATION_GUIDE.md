# HAQEIアナライザー統一エラーハンドリングシステム 実装ガイド

## 🌟 概要

HAQEIアナライザーの統一エラーハンドリングシステムは、HaQei哲学、易経の変化原理、Triple OS Architectureを統合した世界最高水準のエラー処理システムです。

### 🎯 核心設計思想

- **エラーから学ぶ**: 易経の変化原理に基づく自己進化システム
- **調和を保つ**: ユーザー体験の継続性を最優先
- **分人対応**: 状況・感情に応じた適応的エラー対応
- **堅牢性**: グレースフルデグラデーションによる段階的機能継続

## 📁 ファイル構成

```
public/js/core/
├── UnifiedErrorHandler.js        # 統一エラーハンドラー（コア）
├── GracefulDegradationManager.js # グレースフルデグラデーション管理
├── UserFriendlyErrorUI.js        # ユーザーフレンドリーUI
├── StructuredLogger.js           # 構造化ログ・監視システム
├── ErrorTestSuite.js             # エラーテストスイート
└── ErrorSystemIntegrator.js      # システム統合管理
```

## 🚀 基本使用方法

### 1. システム初期化

```javascript
// 統合システムの初期化
const errorSystemIntegrator = new ErrorSystemIntegrator({
    enableUnifiedErrorHandler: true,
    enableGracefulDegradation: true,
    enableUserFriendlyUI: true,
    enableStructuredLogging: true,
    enableBunenjinAdaptation: true,
    enableTripleOSIntegration: true,
    enablePerformanceOptimization: true
});

// 初期化完了を待機
await errorSystemIntegrator.initialize();
```

### 2. エラーハンドリング

```javascript
// 基本的なエラーハンドリング
try {
    // 何らかの処理
} catch (error) {
    const result = await errorSystemIntegrator.handleError(error, {
        context: 'user-action',
        userInitiated: true,
        HaQeiPersona: 'empathetic'
    });
    
    console.log('エラー処理結果:', result);
}

// 手動エラー報告
errorSystemIntegrator.handleError(new Error('カスタムエラー'), {
    severity: 'high',
    category: 'user-input',
    recoverable: true
});
```

### 3. HaQei分人の活用

```javascript
// 分人の設定
const personaManager = {
    setPersona: (persona) => {
        // analytical: 分析的・論理的アプローチ
        // empathetic: 共感的・感情配慮アプローチ  
        // pragmatic: 実用的・効率重視アプローチ
        window.HaQeiPersona = { activePersona: persona };
    }
};

// 分人に応じたエラー処理
personaManager.setPersona('empathetic');
// → やさしく配慮のあるエラーメッセージ

personaManager.setPersona('analytical');
// → 詳細で技術的なエラー情報

personaManager.setPersona('pragmatic');
// → 簡潔で解決策重視のメッセージ
```

## 🎨 UI統合

### HTML統合

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>HAQEIアナライザー</title>
</head>
<body>
    <!-- コンテンツ -->
    
    <!-- エラーハンドリングシステム -->
    <script src="js/core/UnifiedErrorHandler.js"></script>
    <script src="js/core/GracefulDegradationManager.js"></script>
    <script src="js/core/UserFriendlyErrorUI.js"></script>
    <script src="js/core/StructuredLogger.js"></script>
    <script src="js/core/ErrorSystemIntegrator.js"></script>
    
    <script>
        // 自動初期化
        document.addEventListener('DOMContentLoaded', async () => {
            window.haqeiErrorSystem = new ErrorSystemIntegrator({
                enableAutoIntegration: true,
                enableBunenjinAdaptation: true
            });
        });
    </script>
</body>
</html>
```

### CSS統合

エラーUIのスタイルは自動的に注入されますが、カスタマイズも可能です：

```css
/* カスタムエラー通知スタイル */
.haqei-error-notification.custom-theme {
    background: linear-gradient(135deg, #your-color-1, #your-color-2);
    border-radius: 16px;
}

/* HaQei分人別カスタマイズ */
.haqei-error-notification.empathetic {
    background: linear-gradient(135deg, #fef7f0, #fed7aa);
    color: #92400e;
}

.haqei-error-notification.analytical {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    color: #1e293b;
}

.haqei-error-notification.pragmatic {
    background: linear-gradient(135deg, #f0fdf4, #bbf7d0);
    color: #166534;
}
```

## 🔧 設定オプション

### UnifiedErrorHandler設定

```javascript
const unifiedErrorHandler = new UnifiedErrorHandler({
    maxErrorHistory: 200,                    // エラー履歴の最大件数
    maxRetryAttempts: 3,                     // 最大再試行回数
    gracefulDegradationEnabled: true,        // グレースフルデグラデーション有効
    HaQeiModeEnabled: true,               // HaQei分人モード有効
    tripleOSIntegrationEnabled: true,        // Triple OS統合有効
    performanceOptimized: true,              // パフォーマンス最適化有効
    userFriendlyMessages: true,              // ユーザーフレンドリーメッセージ有効
    autoRecoveryEnabled: true,               // 自動回復有効
    logLevel: 'info',                        // ログレベル (debug, info, warn, error)
    memoryOptimization: true                 // メモリ最適化有効
});
```

### GracefulDegradationManager設定

```javascript
const degradationManager = new GracefulDegradationManager({
    enableAutoRecovery: true,                // 自動回復有効
    recoveryCheckInterval: 30000,            // 回復チェック間隔（ミリ秒）
    maxDegradationLevel: 5,                  // 最大縮退レベル
    userNotificationEnabled: true,           // ユーザー通知有効
    performanceMonitoring: true,             // パフォーマンス監視有効
    HaQeiAdaptation: true                 // HaQei適応有効
});
```

### UserFriendlyErrorUI設定

```javascript
const errorUI = new UserFriendlyErrorUI({
    theme: 'harmony',                        // テーマ (harmony, minimal, technical)
    language: 'ja',                          // 言語
    animationsEnabled: true,                 // アニメーション有効
    soundEnabled: false,                     // 音声有効
    hapticEnabled: false,                    // ハプティック有効
    accessibilityMode: false,                // アクセシビリティモード
    HaQeiPersonalization: true,           // HaQei個人化有効
    autoHideTimeout: 8000,                   // 自動非表示時間（ミリ秒）
    maxConcurrentNotifications: 3            // 最大同時通知数
});
```

## 📊 ログ・監視

### 構造化ログの利用

```javascript
const logger = new StructuredLogger({
    logLevel: 'info',                        // ログレベル
    maxLogEntries: 1000,                     // 最大ログエントリ数
    enablePersistence: true,                 // 永続化有効
    enableMetrics: true,                     // メトリクス有効
    enablePerformanceLogging: true,          // パフォーマンスログ有効
    enablePrivacyMode: false                 // プライバシーモード
});

// 各種ログの記録
logger.info('システム起動', { module: 'core' });
logger.warn('リソース使用量が高い', { memory: '80%' });
logger.error('データベース接続エラー', { error: error });

// 特殊ログ
logger.logUserAction('button-click', '#submit-btn', { page: 'analysis' });
logger.logIChingEvent('hexagram-calculation', 42, { result: 'success' });
logger.logTripleOSEvent('interface', 'mode-switch', { from: 'basic', to: 'advanced' });
```

### メトリクス取得

```javascript
// システム統計の取得
const stats = errorSystemIntegrator.getSystemStatistics();
console.log('システム統計:', stats);

// ヘルスチェックの実行
const health = await errorSystemIntegrator.performSystemHealthCheck();
console.log('システム健全性:', health);

// ログメトリクスの取得
const logMetrics = logger.generateMetrics();
console.log('ログメトリクス:', logMetrics);
```

## 🧪 テスト・検証

### 自動テストスイートの実行

```javascript
const testSuite = new ErrorTestSuite({
    HaQeiPersonaTesting: true,            // HaQei分人テスト有効
    tripleOSIntegrationTesting: true,        // Triple OS統合テスト有効
    stressTestingEnabled: true,              // ストレステスト有効
    detailedReporting: true                  // 詳細レポート有効
});

// 全テストの実行
const testResult = await testSuite.runAllTests();
console.log('テスト結果:', testResult);

// 特定テストの実行
await testSuite.runSingleTest('basic-js-error');

// ストレステストの実行
const stressResult = await testSuite.runStressTest(60000, 10); // 60秒間、10エラー/秒
```

### 手動テスト用ヘルパー

```javascript
// エラーシミュレーション
async function simulateError(type) {
    const errors = {
        javascript: () => { throw new Error('テスト用JavaScriptエラー'); },
        network: () => { throw new Error('Network request failed'); },
        storage: () => { 
            const error = new Error('Storage quota exceeded');
            error.name = 'QuotaExceededError';
            throw error;
        }
    };
    
    try {
        errors[type]();
    } catch (error) {
        await errorSystemIntegrator.handleError(error, { 
            testCase: type,
            HaQeiPersona: getCurrentPersona() 
        });
    }
}

// 使用例
await simulateError('javascript');
await simulateError('network');
await simulateError('storage');
```

## 🎭 HaQei分人システム詳細

### 分人別エラー対応特性

#### 分析型分人 (Analytical)
```javascript
{
    tone: 'informative',           // 情報提供重視
    detailLevel: 'high',          // 高詳細
    colorScheme: 'blue',          // 青系配色
    iconStyle: 'technical',       // 技術的アイコン
    logLevel: 'debug',            // デバッグレベルログ
    degradationThreshold: 0.8,    // 高い縮退閾値
    recoveryStrategy: 'thorough-analysis'  // 徹底分析による回復
}
```

#### 共感型分人 (Empathetic)
```javascript
{
    tone: 'reassuring',           // 安心感重視
    detailLevel: 'medium',        // 中程度詳細
    colorScheme: 'warm',          // 暖色系配色
    iconStyle: 'friendly',        // フレンドリーアイコン
    logLevel: 'info',             // 情報レベルログ
    degradationThreshold: 0.6,    // 低い縮退閾値（早期保護）
    recoveryStrategy: 'user-comfort-first'  // ユーザー快適性優先
}
```

#### 実用型分人 (Pragmatic)
```javascript
{
    tone: 'solution-focused',     // 解決策重視
    detailLevel: 'low',           // 低詳細（要点のみ）
    colorScheme: 'green',         // 緑系配色
    iconStyle: 'action',          // アクション指向アイコン
    logLevel: 'warn',             // 警告レベルログ
    degradationThreshold: 0.7,    // 中程度縮退閾値
    recoveryStrategy: 'quick-recovery'  // 迅速回復
}
```

### 分人切り替えの実装

```javascript
// 分人管理クラス
class BunenjinPersonaManager {
    constructor() {
        this.currentPersona = 'pragmatic';
        this.personalityHistory = [];
        this.adaptationRules = new Map();
    }
    
    setActivePersona(persona) {
        this.personalityHistory.push({
            from: this.currentPersona,
            to: persona,
            timestamp: Date.now(),
            reason: 'user-selection'
        });
        
        this.currentPersona = persona;
        this.notifySystemComponents(persona);
    }
    
    autoSelectPersona(context) {
        // コンテキストに基づく自動分人選択
        if (context.errorSeverity === 'critical') {
            return 'empathetic';  // 重大エラー時は共感的に
        } else if (context.technicalUser) {
            return 'analytical';  // 技術ユーザーには分析的に
        } else {
            return 'pragmatic';   // デフォルトは実用的に
        }
    }
    
    notifySystemComponents(persona) {
        // すべてのエラーシステムコンポーネントに通知
        if (window.errorSystemIntegrator) {
            window.errorSystemIntegrator.HaQeiIntegration.currentPersona = persona;
        }
    }
}

// グローバル分人管理
window.HaQeiPersona = new BunenjinPersonaManager();
```

## ⚡ パフォーマンス最適化

### メモリ最適化

```javascript
// 定期的なメモリクリーンアップ
setInterval(() => {
    if (errorSystemIntegrator) {
        errorSystemIntegrator.optimizeMemoryUsage();
    }
}, 300000); // 5分間隔

// エラー履歴のサイズ制限
const maxErrorHistory = 200;
if (errorHistory.length > maxErrorHistory) {
    errorHistory = errorHistory.slice(-maxErrorHistory);
}

// ログローテーション
logger.rotateLogs(); // 古いログの削除・圧縮
```

### 非同期処理最適化

```javascript
// バッチ処理による効率化
const errorBatch = [];
const processBatch = async () => {
    if (errorBatch.length > 0) {
        const batch = errorBatch.splice(0, 10); // 10件ずつ処理
        await Promise.all(batch.map(error => processError(error)));
    }
};

setInterval(processBatch, 1000); // 1秒間隔でバッチ処理

// Web Workers活用
const errorWorker = new Worker('error-processing-worker.js');
errorWorker.postMessage({ type: 'process-error', error: errorData });
```

## 🔒 セキュリティ・プライバシー

### 機密データ保護

```javascript
// ログからの機密データ除去
const sensitivePatterns = [
    /password/i,
    /token/i,
    /api[_-]?key/i,
    /secret/i,
    /credential/i
];

function sanitizeLogData(data) {
    let sanitized = JSON.stringify(data);
    sensitivePatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '[REDACTED]');
    });
    return JSON.parse(sanitized);
}

// プライバシーモード
const logger = new StructuredLogger({
    enablePrivacyMode: true,  // 機密データの自動除去
    dataRetentionPeriod: 7 * 24 * 60 * 60 * 1000  // 7日間の保持期間
});
```

### GDPR対応

```javascript
// ユーザーデータの削除
function deleteUserErrorData(userId) {
    logger.deleteUserData(userId);
    errorSystemIntegrator.deleteUserErrorHistory(userId);
}

// データエクスポート
function exportUserErrorData(userId) {
    return {
        errorHistory: errorSystemIntegrator.getUserErrorHistory(userId),
        logs: logger.getUserLogs(userId),
        preferences: errorSystemIntegrator.getUserPreferences(userId)
    };
}
```

## 🚀 デプロイメント

### プロダクション設定

```javascript
const productionConfig = {
    logLevel: 'warn',                        // プロダクションでは警告以上のみ
    enableDebugFeatures: false,              // デバッグ機能無効
    enableRemoteLogging: true,               // リモートログ有効
    enableErrorReporting: true,              // エラー報告有効
    enablePerformanceMonitoring: true,       // パフォーマンス監視有効
    enableUserFeedback: true,                // ユーザーフィードバック有効
    compressLogs: true,                      // ログ圧縮有効
    maxLogRetentionDays: 30                  // ログ保持期間30日
};

const errorSystem = new ErrorSystemIntegrator(productionConfig);
```

### CDN配信

```html
<!-- CDN経由での読み込み（例） -->
<script src="https://cdn.haqei.com/error-system/v1.0.0/unified-error-handler.min.js"></script>
<script src="https://cdn.haqei.com/error-system/v1.0.0/error-system-integrator.min.js"></script>

<script>
    // CDN版の初期化
    window.HAQEI_ERROR_SYSTEM_CONFIG = {
        enableAutoInit: true,
        enableBunenjin: true,
        enableTripleOS: true
    };
</script>
```

## 📖 API リファレンス

### ErrorSystemIntegrator

#### コンストラクタ

```typescript
constructor(options: {
    enableUnifiedErrorHandler?: boolean;
    enableGracefulDegradation?: boolean;
    enableUserFriendlyUI?: boolean;
    enableStructuredLogging?: boolean;
    enableTestSuite?: boolean;
    enableBunenjinAdaptation?: boolean;
    enableTripleOSIntegration?: boolean;
    enablePerformanceOptimization?: boolean;
    enableSelfHealing?: boolean;
    debugMode?: boolean;
})
```

#### メソッド

```typescript
// システム初期化
async initialize(): Promise<void>

// エラーハンドリング
async handleError(error: Error, context?: object): Promise<ErrorResult>

// システム統計取得
getSystemStatistics(): SystemStatistics

// ヘルスチェック実行
async performSystemHealthCheck(): Promise<HealthStatus>

// パフォーマンス最適化
async optimizePerformance(): Promise<void>

// クリーンアップ
async cleanup(): Promise<void>
```

### UnifiedErrorHandler

#### メソッド

```typescript
// エラーハンドリング
async handleError(error: Error, context?: object): Promise<ErrorResult>

// 回復戦略設定
setRecoveryStrategy(errorType: string, strategy: RecoveryStrategy): void

// フォールバックシステム設定
setFallbackSystem(name: string, system: FallbackSystem): void

// 統計取得
getErrorStatistics(): ErrorStatistics

// ヘルスチェック
performHealthCheck(): HealthStatus
```

### UserFriendlyErrorUI

#### メソッド

```typescript
// エラー表示
async displayError(errorData: ErrorData, options?: DisplayOptions): Promise<string>

// 通知非表示
async hideNotification(notificationId: string): Promise<void>

// テーマ設定
setTheme(theme: 'harmony' | 'minimal' | 'technical'): void

// HaQei分人設定
setBunenjinPersona(persona: 'analytical' | 'empathetic' | 'pragmatic'): void
```

## 🎯 ベストプラクティス

### 1. エラーコンテキストの充実

```javascript
// ❌ 悪い例
throw new Error('エラーが発生しました');

// ✅ 良い例
const error = new Error('ユーザー入力検証エラー');
error.context = {
    field: 'email',
    value: userInput.email,
    validationRule: 'email-format',
    userAction: 'form-submission',
    timestamp: Date.now()
};
throw error;
```

### 2. 分人に応じたエラー設計

```javascript
// HaQei分人を考慮したエラー設計
const createPersonaAwareError = (baseError, context) => {
    const persona = getCurrentPersona();
    
    return {
        ...baseError,
        persona: persona,
        message: adaptMessageToPersona(baseError.message, persona),
        actions: generatePersonaActions(baseError, persona),
        severity: adjustSeverityForPersona(baseError.severity, persona)
    };
};
```

### 3. 段階的エラー処理

```javascript
// レベル別エラー処理
const handleErrorGracefully = async (error, context) => {
    // レベル1: 基本的な処理
    try {
        return await basicErrorHandling(error, context);
    } catch (level1Error) {
        
        // レベル2: グレースフルデグラデーション
        try {
            await degradationManager.degradeToLevel(1);
            return await fallbackErrorHandling(error, context);
        } catch (level2Error) {
            
            // レベル3: 緊急フォールバック
            return await emergencyFallback(error, context);
        }
    }
};
```

### 4. ログの構造化

```javascript
// 構造化ログの例
logger.error('データベース接続エラー', {
    category: logger.categories.SYSTEM,
    error: error,
    context: {
        operation: 'user-login',
        userId: user.id,
        database: 'postgresql',
        connectionPool: 'main',
        retryAttempt: 2
    },
    HaQei: {
        activePersona: getCurrentPersona(),
        userEmotionalState: 'frustrated'
    },
    performance: {
        responseTime: 5432,
        memoryUsage: getMemoryUsage()
    },
    recovery: {
        strategy: 'database-fallback',
        success: false
    }
});
```

## 🔮 今後の拡張予定

### フェーズ2: AI統合
- 機械学習によるエラーパターン予測
- 自動的な回復戦略最適化
- ユーザー行動からの分人推定

### フェーズ3: 分散システム対応
- マイクロサービス間エラー伝播
- 分散ログ集約・分析
- クラスター全体のヘルスモニタリング

### フェーズ4: リアルタイム分析
- エラーストリーム処理
- リアルタイムダッシュボード
- プロアクティブな問題検出

## 📞 サポート・お問い合わせ

### 技術サポート
- GitHub Issues: [HAQEIアナライザー リポジトリ](https://github.com/haqei/analyzer)
- 技術文書: [開発者ドキュメント](https://docs.haqei.com)

### HaQei哲学についてのご質問
- 哲学的サポート: philosophy@haqei.com
- HaQei研究会: [研究会ページ](https://HaQei.org)

---

*このシステムは、HaQei哲学の「人は複数の分人を持つ存在である」という理念に基づき、エラーという困難な状況においても、それぞれの分人が適切に対応できる調和的なシステムを目指しています。*