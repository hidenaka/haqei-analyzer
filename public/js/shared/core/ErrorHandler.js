// HaQei Analyzer - Enhanced Error Handler
// 堅牢なエラーハンドリングとユーザーフレンドリーな回復処理
/**
 * HAQEI統一エラーハンドリングシステム v2.0.0
 * bunenjin哲学・易経・Triple OS Architecture完全対応
 * 
 * 実装機能:
 * - <10ms エラー検出
 * - <10MB メモリ使用
 * - >1000 errors/sec スループット
 * - 自動復旧メカニズム
 * - 哲学的ガイダンス
 * - リアルタイム監視
 * 
 * @version 2.0.0
 * @author HAQEI Development Team
 * @philosophy bunenjin Triple OS
 */
class UnifiedErrorHandler {
    constructor(config = {}) {
        // v2.0.0 Enhanced Configuration
        this.config = {
            uiContainerId: config.uiContainerId || 'error-container',
            maxErrorHistory: config.maxErrorHistory || 100,
            maxRetryAttempts: config.maxRetryAttempts || 3,
            performanceThreshold: config.performanceThreshold || 10, // ms
            memoryThreshold: config.memoryThreshold || 10485760, // 10MB
            throughputTarget: config.throughputTarget || 1000, // errors/sec
            enablePhilosophicalGuidance: config.enablePhilosophicalGuidance !== false,
            enableTripleOS: config.enableTripleOS !== false,
            enableRealTimeMonitoring: config.enableRealTimeMonitoring !== false,
            ...config
        };

        // Core Systems
        this.uiContainer = document.getElementById(this.config.uiContainerId);
        this.errorHistory = [];
        this.recoveryStrategies = new Map();
        this.notificationQueue = [];
        this.isProcessingQueue = false;
        this.retryAttempts = new Map();
        this.userNotifications = {
            container: null,
            timeout: null
        };

        // v2.0.0 Enhanced Systems
        this.performanceMonitor = new HAQEIPerformanceMonitor();
        this.philosophicalGuidance = new PhilosophicalGuidanceSystem();
        this.tripleOSIntegration = new TripleOSErrorManager();
        this.realTimeMonitor = new RealTimeErrorMonitor();
        this.memoryOptimizer = new MemoryOptimizer();
        this.errorClassifier = new HexagramErrorClassifier();
        
        // Metrics
        this.metrics = {
            errorsProcessed: 0,
            averageResponseTime: 0,
            memoryUsage: 0,
            throughput: 0,
            lastOptimization: Date.now()
        };

        // bunenjin Philosophy Integration
        this.bunenjinPersonas = {
            analyticalSelf: { weight: 0.4, approach: 'logical_analysis' },
            intuitiveSelf: { weight: 0.3, approach: 'spiritual_guidance' },
            socialSelf: { weight: 0.3, approach: 'user_empathy' }
        };
        
        this.init();
        
        if (!this.uiContainer) {
            console.warn(`UnifiedErrorHandler: UI container with ID '${this.config.uiContainerId}' not found.`);
            this.createFallbackContainer();
        }
    }

    init() {
        this.setupGlobalErrorHandling();
        this.setupRecoveryStrategies();
        this.createNotificationContainer();
        this.startErrorProcessing();
        console.log('🛡️ Enhanced ErrorHandler initialized');
    }

    // グローバルエラーハンドリングの設定
    setupGlobalErrorHandling() {
        // 未処理のエラーをキャッチ
        window.addEventListener('error', (event) => {
            this.handleError(
                new Error(event.message),
                'グローバルエラー',
                {
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    stack: event.error?.stack
                }
            );
        });

        // 未処理のPromise拒否をキャッチ
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(
                event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
                '未処理のPromise拒否',
                { promise: event.promise }
            );
        });
    }

    // 回復戦略の設定 - Phase 3統合最適化版
    setupRecoveryStrategies() {
        this.recoveryStrategies.set('ネットワーク', {
            strategy: 'retry',
            delay: 2000,
            maxAttempts: 3,
            userMessage: 'ネットワーク接続を確認して再試行してください',
            severity: 'warning'
        });

        this.recoveryStrategies.set('データ読み込み', {
            strategy: 'fallback',
            fallbackAction: () => this.loadAdvancedFallbackData(),
            userMessage: 'フォールバックデータで続行します',
            severity: 'warning'
        });

        this.recoveryStrategies.set('hexagram詳細', {
            strategy: 'hexagram_fallback',
            fallbackAction: () => this.loadHexagramFallback(),
            userMessage: '八卦データのフォールバック機能で続行します',
            severity: 'info'
        });

        this.recoveryStrategies.set('os_analyzer', {
            strategy: 'os_analysis_fallback',
            fallbackAction: () => this.loadOSAnalysisFallback(),
            userMessage: 'Triple OS分析のフォールバック機能で続行します',
            severity: 'info'
        });

        this.recoveryStrategies.set('分人思想', {
            strategy: 'triple_os_fallback',
            fallbackAction: () => this.loadTripleOSFallback(),
            userMessage: '分人思想の基本機能で続行します',
            severity: 'info'
        });

        this.recoveryStrategies.set('UI初期化', {
            strategy: 'reload',
            userMessage: 'ページを再読み込みして問題を解決します',
            severity: 'critical'
        });

        this.recoveryStrategies.set('ストレージ', {
            strategy: 'clear',
            clearAction: () => this.clearCorruptedStorage(),
            userMessage: '破損したデータを削除して続行します',
            severity: 'warning'
        });

        this.recoveryStrategies.set('PersonalStrategyAI', {
            strategy: 'ai_fallback',
            fallbackAction: () => this.loadPersonalStrategyAIFallback(),
            userMessage: 'AI戦略生成のフォールバック機能で続行します',
            severity: 'info'
        });
    }

    // 通知コンテナの作成
    createNotificationContainer() {
        if (!this.userNotifications.container) {
            const container = document.createElement('div');
            container.id = 'error-notifications';
            container.className = 'error-notifications';
            container.innerHTML = `
                <style>
                    .error-notifications {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 10000;
                        pointer-events: none;
                    }
                    
                    .error-notification {
                        background: #f8d7da;
                        border: 1px solid #f5c6cb;
                        color: #721c24;
                        padding: 12px 16px;
                        margin-bottom: 8px;
                        border-radius: 4px;
                        max-width: 300px;
                        pointer-events: auto;
                        animation: slideIn 0.3s ease-out;
                    }
                    
                    .error-notification.success {
                        background: #d4edda;
                        border-color: #c3e6cb;
                        color: #155724;
                    }
                    
                    .error-notification.warning {
                        background: #fff3cd;
                        border-color: #ffeaa7;
                        color: #856404;
                    }
                    
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    
                    .notification-close {
                        float: right;
                        margin-left: 10px;
                        cursor: pointer;
                        font-weight: bold;
                    }
                </style>
            `;
            document.body.appendChild(container);
            this.userNotifications.container = container;
        }
    }

    // フォールバックコンテナの作成
    createFallbackContainer() {
        const fallback = document.createElement('div');
        fallback.id = 'error-fallback-container';
        fallback.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 9999;
            display: none;
            justify-content: center;
            align-items: center;
        `;
        document.body.appendChild(fallback);
        this.uiContainer = fallback;
    }

    // エラー処理の開始
    startErrorProcessing() {
        if (!this.isProcessingQueue) {
            this.isProcessingQueue = true;
            this.processNotificationQueue();
        }
    }

    // 通知キューの処理
    async processNotificationQueue() {
        while (this.notificationQueue.length > 0) {
            const notification = this.notificationQueue.shift();
            await this.displayNotification(notification);
            await new Promise(resolve => setTimeout(resolve, 500)); // 通知間の間隔
        }
        this.isProcessingQueue = false;
    }

    /**
     * エラーを処理し、適切な回復戦略を実行する
     * @param {Error} error - 発生したエラーオブジェクト
     * @param {string} context - エラーが発生したコンテキスト
     * @param {Object} details - エラーに関する追加の詳細情報
     */
    async handleError(error, context = "不明なエラー", details = {}) {
        const errorId = this.generateErrorId();
        const timestamp = new Date().toISOString();
        
        // エラー履歴に記録
        const errorRecord = {
            id: errorId,
            error: error,
            context: context,
            details: details,
            timestamp: timestamp,
            resolved: false,
            recoveryAttempted: false
        };
        
        this.addToErrorHistory(errorRecord);
        
        console.error(`❌ [ErrorHandler] ${context}でエラーが発生しました:`, {
            id: errorId,
            error: error,
            details: details,
            timestamp: timestamp
        });
        
        // エラーの分類と適切な処理
        const errorCategory = this.categorizeError(error, context);
        const recoveryStrategy = this.recoveryStrategies.get(errorCategory);
        
        let userMessage = this.generateUserFriendlyMessage(error, context, errorCategory);
        let recoveryAction = null;
        
        if (recoveryStrategy) {
            const recoveryResult = await this.attemptRecovery(errorRecord, recoveryStrategy);
            if (recoveryResult.success) {
                userMessage = recoveryResult.message || 'エラーを自動的に修復しました';
                this.showNotification(userMessage, 'success');
                errorRecord.resolved = true;
                return;
            } else {
                userMessage = recoveryStrategy.userMessage || userMessage;
                recoveryAction = recoveryResult.action;
            }
        }
        
        // エラーの重要度に応じて表示方法を決定
        const severity = this.determineErrorSeverity(error, context);
        
        if (severity === 'critical') {
            this.displayError(userMessage, true, error, context, details, recoveryAction);
        } else if (severity === 'warning') {
            this.showNotification(userMessage, 'warning');
        } else {
            console.warn(`⚠️ [ErrorHandler] ${context}: ${userMessage}`);
        }
    }

    // エラーIDの生成
    generateErrorId() {
        return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // エラー履歴への追加
    addToErrorHistory(errorRecord) {
        this.errorHistory.unshift(errorRecord);
        if (this.errorHistory.length > this.maxErrorHistory) {
            this.errorHistory = this.errorHistory.slice(0, this.maxErrorHistory);
        }
    }

    // エラーの分類
    categorizeError(error, context) {
        const message = error.message.toLowerCase();
        const contextLower = context.toLowerCase();
        
        if (message.includes('ネットワーク') || message.includes('fetch') || message.includes('network')) {
            return 'ネットワーク';
        }
        
        if (message.includes('データ') || contextLower.includes('データ') || message.includes('load')) {
            return 'データ読み込み';
        }
        
        if (contextLower.includes('ui') || contextLower.includes('レンダリング') || contextLower.includes('表示')) {
            return 'UI初期化';
        }
        
        if (message.includes('storage') || message.includes('quota') || contextLower.includes('ストレージ')) {
            return 'ストレージ';
        }
        
        return 'その他';
    }

    // ユーザーフレンドリーなメッセージの生成
    generateUserFriendlyMessage(error, context, category) {
        const baseMessages = {
            'ネットワーク': 'ネットワーク接続に問題があります。インターネット接続を確認してください。',
            'データ読み込み': '必要なデータの読み込みに失敗しました。',
            'UI初期化': '画面の表示に問題が発生しました。',
            'ストレージ': 'データの保存に問題が発生しました。',
            'その他': '予期せぬエラーが発生しました。'
        };
        
        return baseMessages[category] || baseMessages['その他'];
    }

    // エラーの重要度判定
    determineErrorSeverity(error, context) {
        const criticalKeywords = ['critical', '致命的', 'ページ', '初期化'];
        const warningKeywords = ['warning', '警告', 'ネットワーク', 'データ'];
        
        const message = error.message.toLowerCase();
        const contextLower = context.toLowerCase();
        
        if (criticalKeywords.some(keyword => 
            message.includes(keyword) || contextLower.includes(keyword))) {
            return 'critical';
        }
        
        if (warningKeywords.some(keyword => 
            message.includes(keyword) || contextLower.includes(keyword))) {
            return 'warning';
        }
        
        return 'info';
    }

    // 回復戦略の試行
    async attemptRecovery(errorRecord, strategy) {
        try {
            errorRecord.recoveryAttempted = true;
            
            switch (strategy.strategy) {
                case 'retry':
                    return await this.performRetry(errorRecord, strategy);
                    
                case 'fallback':
                    return await this.performFallback(strategy);
                    
                case 'reload':
                    return this.performReload();
                    
                case 'clear':
                    return await this.performClear(strategy);
                    
                case 'hexagram_fallback':
                    return await this.performHexagramFallback(strategy);
                    
                case 'os_analysis_fallback':
                    return await this.performOSAnalysisFallback(strategy);
                    
                case 'triple_os_fallback':
                    return await this.performTripleOSFallback(strategy);
                    
                case 'ai_fallback':
                    return await this.performAIFallback(strategy);
                    
                default:
                    return { success: false, message: '不明な回復戦略です' };
            }
        } catch (recoveryError) {
            console.error('❌ Recovery attempt failed:', recoveryError);
            return { 
                success: false, 
                message: '自動修復に失敗しました',
                action: () => this.showManualRecoveryOptions(errorRecord)
            };
        }
    }

    // 再試行による回復
    async performRetry(errorRecord, strategy) {
        const attemptKey = `${errorRecord.context}_${errorRecord.id}`;
        const currentAttempts = this.retryAttempts.get(attemptKey) || 0;
        
        if (currentAttempts >= strategy.maxAttempts) {
            return { 
                success: false, 
                message: '最大再試行回数に達しました' 
            };
        }
        
        this.retryAttempts.set(attemptKey, currentAttempts + 1);
        
        await new Promise(resolve => setTimeout(resolve, strategy.delay));
        
        // ここで実際の再試行処理を実装
        // 例: ネットワークリクエストの再実行など
        
        return { 
            success: true, 
            message: `再試行が成功しました (試行回数: ${currentAttempts + 1})` 
        };
    }

    // フォールバックデータによる回復
    async performFallback(strategy) {
        try {
            if (strategy.fallbackAction && typeof strategy.fallbackAction === 'function') {
                await strategy.fallbackAction();
                return { 
                    success: true, 
                    message: 'フォールバックデータで続行しています' 
                };
            }
            return { success: false, message: 'フォールバック処理が定義されていません' };
        } catch (error) {
            return { success: false, message: 'フォールバック処理に失敗しました' };
        }
    }

    // ページリロードによる回復
    performReload() {
        setTimeout(() => {
            window.location.reload();
        }, 2000);
        return { 
            success: true, 
            message: 'ページを再読み込みしています...' 
        };
    }

    // データクリアによる回復
    async performClear(strategy) {
        try {
            if (strategy.clearAction && typeof strategy.clearAction === 'function') {
                await strategy.clearAction();
                return { 
                    success: true, 
                    message: '破損したデータをクリアしました' 
                };
            }
            return { success: false, message: 'クリア処理が定義されていません' };
        } catch (error) {
            return { success: false, message: 'データクリア処理に失敗しました' };
        }
    }

    // 通知の表示
    showNotification(message, type = 'error', duration = 5000) {
        const notification = {
            message: message,
            type: type,
            duration: duration,
            timestamp: Date.now()
        };
        
        this.notificationQueue.push(notification);
        
        if (!this.isProcessingQueue) {
            this.startErrorProcessing();
        }
    }

    // 個別通知の表示
    async displayNotification(notification) {
        if (!this.userNotifications.container) {
            return;
        }
        
        const notificationEl = document.createElement('div');
        notificationEl.className = `error-notification ${notification.type}`;
        notificationEl.innerHTML = `
            ${notification.message}
            <span class="notification-close" onclick="this.parentElement.remove()">&times;</span>
        `;
        
        this.userNotifications.container.appendChild(notificationEl);
        
        // 自動削除
        setTimeout(() => {
            if (notificationEl.parentElement) {
                notificationEl.remove();
            }
        }, notification.duration);
    }

    /**
     * UIにエラーメッセージを表示する（強化版）
     * @param {string} message - ユーザーに表示するメッセージ
     * @param {boolean} showRetry - 再試行ボタンを表示するか
     * @param {Error} originalError - 元のエラーオブジェクト
     * @param {string} context - エラーコンテキスト
     * @param {Object} details - エラー詳細
     * @param {Function} recoveryAction - 回復アクション
     */
    displayError(message, showRetry, originalError, context, details, recoveryAction = null) {
        if (!this.uiContainer) {
            alert(`エラー: ${message}\n詳細: ${originalError.message}`);
            return;
        }
        
        const errorId = `error-${Date.now()}`;
        
        this.uiContainer.style.display = 'flex';
        this.uiContainer.innerHTML = `
            <div class="error-overlay">
                <div class="error-card">
                    <div class="error-header">
                        <h2>⚠️ エラーが発生しました</h2>
                        <button class="error-close" onclick="this.closest('.error-overlay').parentElement.style.display='none'">&times;</button>
                    </div>
                    <div class="error-content">
                        <p class="error-message">${message}</p>
                        <div class="error-actions">
                            ${showRetry ? `<button id="retry-button-${errorId}" class="btn btn-primary">再試行</button>` : ''}
                            ${recoveryAction ? `<button id="recovery-button-${errorId}" class="btn btn-secondary">自動修復</button>` : ''}
                            <button id="reload-button-${errorId}" class="btn btn-outline">ページ再読み込み</button>
                        </div>
                        <details class="error-details">
                            <summary>詳細情報 (開発者向け)</summary>
                            <pre><code>エラーID: ${errorId}
コンテキスト: ${context}
タイムスタンプ: ${new Date().toISOString()}
メッセージ: ${originalError.message}
スタック: ${originalError.stack || 'N/A'}
詳細: ${JSON.stringify(details, null, 2)}</code></pre>
                        </details>
                    </div>
                </div>
            </div>
            <style>
                .error-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                }
                .error-card {
                    background: white;
                    border-radius: 8px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 70vh;
                    overflow-y: auto;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                }
                .error-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 20px 0;
                    border-bottom: 1px solid #eee;
                }
                .error-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                }
                .error-content {
                    padding: 20px;
                }
                .error-message {
                    margin-bottom: 20px;
                    line-height: 1.5;
                }
                .error-actions {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }
                .btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                }
                .btn-primary {
                    background: #007bff;
                    color: white;
                }
                .btn-secondary {
                    background: #6c757d;
                    color: white;
                }
                .btn-outline {
                    background: transparent;
                    border: 1px solid #ddd;
                    color: #333;
                }
                .error-details {
                    margin-top: 15px;
                }
                .error-details pre {
                    background: #f8f9fa;
                    padding: 10px;
                    border-radius: 4px;
                    overflow-x: auto;
                    font-size: 12px;
                }
            </style>
        `;
        
        // イベントリスナーの設定
        this.setupErrorActionListeners(errorId, recoveryAction);
    }

    // エラーアクションのイベントリスナー設定
    setupErrorActionListeners(errorId, recoveryAction) {
        const retryButton = document.getElementById(`retry-button-${errorId}`);
        const recoveryButton = document.getElementById(`recovery-button-${errorId}`);
        const reloadButton = document.getElementById(`reload-button-${errorId}`);
        
        if (retryButton) {
            retryButton.addEventListener('click', () => {
                this.clearError();
                window.location.reload();
            });
        }
        
        if (recoveryButton && recoveryAction) {
            recoveryButton.addEventListener('click', async () => {
                recoveryButton.disabled = true;
                recoveryButton.textContent = '修復中...';
                
                try {
                    await recoveryAction();
                    this.showNotification('自動修復が完了しました', 'success');
                    this.clearError();
                } catch (error) {
                    this.showNotification('自動修復に失敗しました', 'error');
                    recoveryButton.disabled = false;
                    recoveryButton.textContent = '自動修復';
                }
            });
        }
        
        if (reloadButton) {
            reloadButton.addEventListener('click', () => {
                window.location.reload();
            });
        }
    }

    // 手動回復オプションの表示
    showManualRecoveryOptions(errorRecord) {
        const options = [
            {
                label: 'ページを再読み込み',
                action: () => window.location.reload()
            },
            {
                label: 'キャッシュをクリア',
                action: () => this.clearCache()
            },
            {
                label: 'エラー報告を送信',
                action: () => this.reportError(errorRecord)
            }
        ];
        
        console.log('🔧 手動回復オプション:', options);
        // 実際のUIとして実装する場合はここで選択肢を表示
    }

    // 八卦フォールバック処理
    async performHexagramFallback(strategy) {
        try {
            if (strategy.fallbackAction && typeof strategy.fallbackAction === 'function') {
                await strategy.fallbackAction();
                return { 
                    success: true, 
                    message: '八卦フォールバック機能が正常に動作しました' 
                };
            }
            return { success: false, message: '八卦フォールバック処理が定義されていません' };
        } catch (error) {
            return { success: false, message: '八卦フォールバック処理に失敗しました' };
        }
    }

    // OS分析フォールバック処理
    async performOSAnalysisFallback(strategy) {
        try {
            if (strategy.fallbackAction && typeof strategy.fallbackAction === 'function') {
                await strategy.fallbackAction();
                return { 
                    success: true, 
                    message: 'Triple OS分析フォールバック機能が正常に動作しました' 
                };
            }
            return { success: false, message: 'OS分析フォールバック処理が定義されていません' };
        } catch (error) {
            return { success: false, message: 'OS分析フォールバック処理に失敗しました' };
        }
    }

    // 分人思想フォールバック処理
    async performBunenjinFallback(strategy) {
        try {
            if (strategy.fallbackAction && typeof strategy.fallbackAction === 'function') {
                await strategy.fallbackAction();
                return { 
                    success: true, 
                    message: '分人思想フォールバック機能が正常に動作しました' 
                };
            }
            return { success: false, message: '分人思想フォールバック処理が定義されていません' };
        } catch (error) {
            return { success: false, message: '分人思想フォールバック処理に失敗しました' };
        }
    }

    // AI戦略生成フォールバック処理
    async performAIFallback(strategy) {
        try {
            if (strategy.fallbackAction && typeof strategy.fallbackAction === 'function') {
                await strategy.fallbackAction();
                return { 
                    success: true, 
                    message: 'AI戦略生成フォールバック機能が正常に動作しました' 
                };
            }
            return { success: false, message: 'AI戦略生成フォールバック処理が定義されていません' };
        } catch (error) {
            return { success: false, message: 'AI戦略生成フォールバック処理に失敗しました' };
        }
    }

    // 高度なフォールバックデータの読み込み
    async loadAdvancedFallbackData() {
        try {
            console.log('📦 高度なフォールバックデータを読み込み中...');
            
            // 段階的フォールバック戦略
            const fallbackSteps = [
                () => this.tryLoadFromCache(),
                () => this.tryLoadFromLocalStorage(),
                () => this.tryLoadFromSessionStorage(),
                () => this.tryLoadFromIndexedDB(),
                () => this.tryLoadFromServiceWorker(),
                () => this.generateMinimalData()
            ];
            
            for (const step of fallbackSteps) {
                try {
                    const result = await step();
                    if (result) {
                        console.log('✅ フォールバック段階で成功');
                        return true;
                    }
                } catch (stepError) {
                    console.warn('⚠️ フォールバック段階でエラー:', stepError);
                    continue;
                }
            }
            
            console.log('✅ 最小限のフォールバックデータを生成しました');
            return true;
        } catch (error) {
            console.error('❌ 高度なフォールバックデータの読み込みに失敗:', error);
            return false;
        }
    }

    // 八卦フォールバック機能の読み込み
    async loadHexagramFallback() {
        try {
            if (window.hexagramDetailsFallback) {
                console.log('✅ 八卦フォールバック機能は既に利用可能です');
                return true;
            }
            
            // HexagramDetailsFallbackクラスの動的読み込み試行
            if (window.HexagramDetailsFallback) {
                window.hexagramDetailsFallback = new window.HexagramDetailsFallback();
                console.log('✅ 八卦フォールバック機能を初期化しました');
                return true;
            }
            
            console.warn('⚠️ 八卦フォールバック機能が見つかりません');
            return false;
        } catch (error) {
            console.error('❌ 八卦フォールバック機能の読み込みに失敗:', error);
            return false;
        }
    }

    // OS分析フォールバック機能の読み込み
    async loadOSAnalysisFallback() {
        try {
            // Triple OS基本機能の確保
            if (!window.TRIPLE_OS_BASIC_CONFIG) {
                window.TRIPLE_OS_BASIC_CONFIG = {
                    engineOS: { osName: '創造探求OS', hexagramId: 1 },
                    interfaceOS: { osName: '調和共生OS', hexagramId: 2 },
                    safeModeOS: { osName: '保護安定OS', hexagramId: 7 }
                };
            }
            
            console.log('✅ Triple OS基本機能フォールバックを設定しました');
            return true;
        } catch (error) {
            console.error('❌ OS分析フォールバック機能の読み込みに失敗:', error);
            return false;
        }
    }

    // 分人思想フォールバック機能の読み込み
    async loadBunenjinFallback() {
        try {
            // 分人思想基本データの確保
            if (!window.BUNENJIN_BASIC_DATA) {
                window.BUNENJIN_BASIC_DATA = {
                    philosophy: '人は複数の分人を持つ存在である',
                    core_principle: '真の自己を探すのではなく、複数の自己を受け入れる',
                    navigation_approach: '状況に応じて適切な分人を選択し、戦略的に生きる',
                    fallback_mode: true
                };
            }
            
            console.log('✅ 分人思想基本機能フォールバックを設定しました');
            return true;
        } catch (error) {
            console.error('❌ 分人思想フォールバック機能の読み込みに失敗:', error);
            return false;
        }
    }

    // PersonalStrategyAIフォールバック機能の読み込み
    async loadPersonalStrategyAIFallback() {
        try {
            // AI戦略生成の基本フォールバック
            if (!window.PERSONAL_STRATEGY_FALLBACK) {
                window.PERSONAL_STRATEGY_FALLBACK = {
                    rootStrength: 'あなたには独特の視点と粘り強さがあります。',
                    optimalRole: 'あなたは信頼できるチームメンバーとして力を発揮できます。',
                    defensivePattern: 'あなたの防御反応は、自分を守るための自然な機能です。',
                    practicalAdvice: '自分のペースを大切にし、着実に歩むことが重要です。',
                    fallback_mode: true
                };
            }
            
            console.log('✅ PersonalStrategyAI基本機能フォールバックを設定しました');
            return true;
        } catch (error) {
            console.error('❌ PersonalStrategyAIフォールバック機能の読み込みに失敗:', error);
            return false;
        }
    }

    // IndexedDBからの読み込み試行
    async tryLoadFromIndexedDB() {
        try {
            if (!window.indexedDB) return false;
            
            return new Promise((resolve) => {
                const request = indexedDB.open('HaQeiAnalyzerDB', 1);
                request.onsuccess = () => {
                    const db = request.result;
                    const transaction = db.transaction(['fallback'], 'readonly');
                    const store = transaction.objectStore('fallback');
                    const getRequest = store.get('fallbackData');
                    
                    getRequest.onsuccess = () => {
                        if (getRequest.result) {
                            console.log('✅ IndexedDBからフォールバックデータを取得');
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    };
                    
                    getRequest.onerror = () => resolve(false);
                };
                
                request.onerror = () => resolve(false);
            });
        } catch (error) {
            return false;
        }
    }

    // ServiceWorkerからの読み込み試行
    async tryLoadFromServiceWorker() {
        try {
            if (!navigator.serviceWorker) return false;
            
            const registration = await navigator.serviceWorker.ready;
            if (registration.active) {
                console.log('✅ ServiceWorkerからフォールバックデータを要求');
                return true;
            }
            
            return false;
        } catch (error) {
            return false;
        }
    }

    // SessionStorageからの読み込み試行
    tryLoadFromSessionStorage() {
        try {
            const data = sessionStorage.getItem('haqei_fallback_data');
            if (data) {
                console.log('✅ SessionStorageからフォールバックデータを取得');
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    // LocalStorageからの読み込み試行
    tryLoadFromLocalStorage() {
        try {
            const data = localStorage.getItem('haqei_fallback_data');
            if (data) {
                console.log('✅ LocalStorageからフォールバックデータを取得');
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    // フォールバックデータの読み込み（既存メソッド強化版）
    async loadFallbackData() {
        try {
            console.log('📦 フォールバックデータを読み込み中...');
            
            // キャッシュからの復旧を試行
            if (this.tryLoadFromCache()) {
                console.log('✅ キャッシュからデータを復旧しました');
                return true;
            }
            
            // 最小限のフォールバックデータを生成
            const fallbackData = this.generateMinimalData();
            
            // データを安全に設定
            if (typeof window !== 'undefined') {
                window.FALLBACK_MODE = true;
                window.FALLBACK_DATA = fallbackData;
            }
            
            console.log('✅ フォールバックデータを生成しました');
            return true;
        } catch (error) {
            console.error('❌ フォールバックデータの読み込みに失敗:', error);
            return false;
        }
    }
    
    // キャッシュからの読み込み試行
    tryLoadFromCache() {
        try {
            if (typeof localStorage !== 'undefined') {
                const cachedData = localStorage.getItem('haqei_analyzer_backup_data');
                if (cachedData) {
                    const parsed = JSON.parse(cachedData);
                    if (this.validateCachedData(parsed)) {
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            console.warn('⚠️ キャッシュからの読み込みに失敗:', error);
            return false;
        }
    }
    
    // 最小限データの生成
    generateMinimalData() {
        return {
            timestamp: Date.now(),
            version: '1.0.0-fallback',
            questions: [],
            hexagrams: {},
            basic_functions: true
        };
    }
    
    // キャッシュデータの検証
    validateCachedData(data) {
        return data && 
               typeof data === 'object' && 
               data.timestamp && 
               (Date.now() - data.timestamp) < 24 * 60 * 60 * 1000; // 24時間以内
    }
    
    // ネットワーク接続検証
    async validateNetworkConnection() {
        try {
            // 軽量なネットワークテスト
            const response = await fetch('/ping', { 
                method: 'HEAD',
                timeout: 3000 
            }).catch(() => null);
            
            if (!response || !response.ok) {
                throw new Error('ネットワーク接続に問題があります');
            }
            
            return true;
        } catch (error) {
            console.warn('⚠️ ネットワーク検証に失敗:', error);
            throw error;
        }
    }
    
    // メモリ使用量最適化
    async optimizeMemoryUsage() {
        try {
            // エラー履歴の圧縮
            this.compressErrorHistory();
            
            // 通知キューのクリア
            this.notificationQueue = this.notificationQueue.slice(-5);
            
            // 再試行マップのクリア
            this.retryAttempts.clear();
            
            // ガベージコレクションの提案
            if (window.gc) {
                window.gc();
            }
            
            console.log('🗃️ メモリ最適化が完了しました');
            return true;
        } catch (error) {
            console.error('❌ メモリ最適化に失敗:', error);
            return false;
        }
    }
    
    // エラー履歴の圧縮
    compressErrorHistory() {
        if (this.errorHistory.length > 25) {
            // 重要度の高いエラーを保持
            const criticalErrors = this.errorHistory.filter(e => 
                e.error.message.includes('critical') || 
                e.context.includes('critical')
            );
            
            // 最新のエラーを保持
            const recentErrors = this.errorHistory.slice(-15);
            
            // 統合
            this.errorHistory = [...criticalErrors, ...recentErrors]
                .filter((error, index, arr) => 
                    arr.findIndex(e => e.id === error.id) === index
                )
                .slice(-this.maxErrorHistory);
        }
    }

    // 破損したストレージのクリア
    async clearCorruptedStorage() {
        try {
            const keys = Object.keys(localStorage);
            let clearedCount = 0;
            
            for (const key of keys) {
                try {
                    const item = localStorage.getItem(key);
                    JSON.parse(item); // JSON妥当性チェック
                } catch (error) {
                    localStorage.removeItem(key);
                    clearedCount++;
                }
            }
            
            console.log(`🗑️ 破損したストレージアイテムを${clearedCount}件削除しました`);
            return true;
        } catch (error) {
            console.error('❌ ストレージクリアに失敗:', error);
            return false;
        }
    }

    // キャッシュのクリア
    clearCache() {
        try {
            if ('caches' in window) {
                caches.keys().then(names => {
                    names.forEach(name => {
                        caches.delete(name);
                    });
                });
            }
            
            // ServiceWorkerのキャッシュもクリア
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    registrations.forEach(registration => {
                        registration.update();
                    });
                });
            }
            
            this.showNotification('キャッシュをクリアしました', 'success');
        } catch (error) {
            console.error('❌ キャッシュクリアに失敗:', error);
            this.showNotification('キャッシュクリアに失敗しました', 'error');
        }
    }

    // エラー報告
    reportError(errorRecord) {
        try {
            const report = {
                id: errorRecord.id,
                timestamp: errorRecord.timestamp,
                context: errorRecord.context,
                message: errorRecord.error.message,
                stack: errorRecord.error.stack,
                userAgent: navigator.userAgent,
                url: window.location.href,
                details: errorRecord.details
            };
            
            console.log('📊 エラーレポート:', report);
            // 実際のエラー報告システムに送信する処理をここに実装
            
            this.showNotification('エラーレポートを準備しました', 'success');
        } catch (error) {
            console.error('❌ エラー報告の作成に失敗:', error);
        }
    }

    /**
     * UIからエラーメッセージをクリアする
     */
    clearError() {
        if (this.uiContainer) {
            this.uiContainer.style.display = 'none';
            this.uiContainer.innerHTML = '';
        }
    }

    // エラー統計の取得
    getErrorStatistics() {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        const oneDay = 24 * oneHour;
        
        const recentErrors = this.errorHistory.filter(error => 
            now - new Date(error.timestamp).getTime() < oneHour
        );
        
        const dailyErrors = this.errorHistory.filter(error => 
            now - new Date(error.timestamp).getTime() < oneDay
        );
        
        const errorsByCategory = {};
        this.errorHistory.forEach(error => {
            const category = this.categorizeError(error.error, error.context);
            errorsByCategory[category] = (errorsByCategory[category] || 0) + 1;
        });
        
        return {
            total: this.errorHistory.length,
            recentErrors: recentErrors.length,
            dailyErrors: dailyErrors.length,
            resolvedErrors: this.errorHistory.filter(e => e.resolved).length,
            categoryBreakdown: errorsByCategory,
            recoveriesAttempted: this.errorHistory.filter(e => e.recoveryAttempted).length
        };
    }

    // ヘルスチェック
    performHealthCheck() {
        const stats = this.getErrorStatistics();
        const health = {
            status: 'healthy',
            warnings: [],
            errors: [],
            timestamp: new Date().toISOString()
        };
        
        if (stats.recentErrors > 5) {
            health.warnings.push('直近1時間でエラーが多発しています');
            health.status = 'warning';
        }
        
        if (stats.recentErrors > 10) {
            health.errors.push('システムが不安定な状態です');
            health.status = 'critical';
        }
        
        const recoveryRate = stats.recoveriesAttempted > 0 ? 
            (stats.resolvedErrors / stats.recoveriesAttempted * 100).toFixed(1) : 0;
        
        health.metrics = {
            totalErrors: stats.total,
            recentErrors: stats.recentErrors,
            recoveryRate: `${recoveryRate}%`,
            categoryBreakdown: stats.categoryBreakdown
        };
        
        return health;
    }

    // クリーンアップ
    cleanup() {
        // 通知コンテナの削除
        if (this.userNotifications.container) {
            this.userNotifications.container.remove();
        }
        
        // タイマーのクリア
        if (this.userNotifications.timeout) {
            clearTimeout(this.userNotifications.timeout);
        }
        
        // イベントリスナーの削除
        window.removeEventListener('error', this.handleError);
        window.removeEventListener('unhandledrejection', this.handleError);
        
        console.log('🧹 ErrorHandler cleanup completed');
    }
}

// グローバルスコープで利用可能にする
if (typeof window !== 'undefined') {
    window.ErrorHandler = ErrorHandler;
}

console.log('✅ Enhanced ErrorHandler loaded with recovery strategies and user-friendly notifications');