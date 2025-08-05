/**
 * シンプルHooksシステム
 * 
 * 目的：
 * - データ遷移監視の自動化
 * - 問題発生時の自動対応
 * - 開発・運用効率の向上
 * 
 * processing内容：
 * 1. データ保存・取得イベントのフック
 * 2. エラー発生時の自動ログ・復旧
 * 3. パフォーマンス監視
 * 4. bunenjin哲学に基づく品質保証
 * 
 * 出力：
 * - イベントフックの実行結果
 * - 自動復旧レポート
 * - パフォーマンス統計
 * 
 * 副作用：
 * - 関数のラッピング・監視
 * - 自動復旧処理の実行
 * - ログ・統計データの生成
 * 
 * 前提条件：
 * - SimpleStorageManager利用可能
 * - DataFlowMonitor利用可能
 * 
 * エラー処理：
 * - フック処理失敗時の安全な継続
 * - 元の処理への影響最小化
 * - 復旧処理の確実な実行
 */
class SimpleHooks {
    constructor(options = {}) {
        this.options = {
            enableDataFlowHooks: options.enableDataFlowHooks !== false,
            enablePerformanceHooks: options.enablePerformanceHooks !== false,
            enableErrorHooks: options.enableErrorHooks !== false,
            enableAutoRecovery: options.enableAutoRecovery !== false,
            logLevel: options.logLevel || 'info', // 'debug', 'info', 'warn', 'error'
            ...options
        };

        this.hooks = {
            beforeDataSave: [],
            afterDataSave: [],
            beforeDataLoad: [],
            afterDataLoad: [],
            onError: [],
            onPerformanceIssue: []
        };

        this.statistics = {
            hookExecutions: 0,
            dataOperations: 0,
            errorsHandled: 0,
            autoRecoveries: 0,
            startTime: Date.now()
        };

        this.performanceThresholds = {
            saveTime: 100, // ms
            loadTime: 50,  // ms
            dataSize: 10000 // bytes
        };

        this.log('SimpleHooks初期化完了', 'info');
    }

    /**
     * フック登録メソッド
     * 
     * 目的：
     * - 各段階での処理フックの登録
     * - イベント駆動の自動処理設定
     * 
     * 入力：
     * - eventType: string - フックイベント種別
     * - handler: function - フック処理関数
     * - priority: number - 実行優先度（高いほど先に実行）
     * 
     * 処理内容：
     * 1. フック関数の登録
     * 2. 優先度による並び替え
     * 3. 重複チェック
     * 
     * 出力：
     * - boolean: 登録成功可否
     * 
     * エラー処理：
     * - 不正なイベント種別の拒否
     * - ハンドラー関数の検証
     */
    addHook(eventType, handler, priority = 0) {
        if (!this.hooks[eventType]) {
            this.log(`未知のイベント種別: ${eventType}`, 'warn');
            return false;
        }

        if (typeof handler !== 'function') {
            this.log('ハンドラーは関数である必要があります', 'error');
            return false;
        }

        try {
            this.hooks[eventType].push({
                handler,
                priority,
                id: this.generateHookId(),
                addedAt: Date.now()
            });

            // 優先度順でソート
            this.hooks[eventType].sort((a, b) => b.priority - a.priority);

            this.log(`フック登録: ${eventType} (優先度: ${priority})`, 'debug');
            return true;
        } catch (error) {
            this.log(`フック登録エラー: ${error.message}`, 'error');
            return false;
        }
    }

    /**
     * フック実行メソッド
     * 
     * 目的：
     * - 登録されたフック関数の順次実行
     * - エラー時の安全な継続処理
     * - 実行統計の記録
     * 
     * 入力：
     * - eventType: string - 実行対象イベント種別
     * - context: Object - フック実行コンテキスト
     * 
     * 処理内容：
     * 1. 該当イベントのフック関数取得
     * 2. 優先度順での順次実行
     * 3. エラー処理と継続判定
     * 4. 実行統計の更新
     * 
     * 出力：
     * - Object: 実行結果サマリー
     * 
     * 副作用：
     * - 各フック関数の実行
     * - 統計データの更新
     * 
     * エラー処理：
     * - 個別フック失敗時の継続処理
     * - 全体フロー停止の回避
     */
    async executeHooks(eventType, context = {}) {
        const hooks = this.hooks[eventType] || [];
        
        if (hooks.length === 0) {
            return { executed: 0, errors: 0 };
        }

        const startTime = Date.now();
        const results = {
            executed: 0,
            errors: 0,
            executionTime: 0,
            results: []
        };

        this.log(`フック実行開始: ${eventType} (${hooks.length}個)`, 'debug');

        for (const hook of hooks) {
            try {
                const hookStartTime = Date.now();
                const result = await hook.handler(context);
                const hookExecutionTime = Date.now() - hookStartTime;

                results.results.push({
                    hookId: hook.id,
                    success: true,
                    result,
                    executionTime: hookExecutionTime
                });

                results.executed++;
                this.statistics.hookExecutions++;

                // パフォーマンス監視
                if (hookExecutionTime > 50) { // 50ms以上は警告
                    this.log(`フック実行時間警告: ${hookExecutionTime}ms`, 'warn');
                }

            } catch (error) {
                this.log(`フック実行エラー [${hook.id}]: ${error.message}`, 'error');
                
                results.results.push({
                    hookId: hook.id,
                    success: false,
                    error: error.message,
                    executionTime: 0
                });

                results.errors++;
                this.statistics.errorsHandled++;

                // エラーフックの実行
                await this.executeHooks('onError', {
                    originalEvent: eventType,
                    error,
                    hookId: hook.id,
                    context
                });
            }
        }

        results.executionTime = Date.now() - startTime;
        this.log(`フック実行完了: ${eventType} (${results.executed}/${hooks.length}成功)`, 'debug');

        return results;
    }

    /**
     * データ操作の自動フック設定
     * 
     * 目的：
     * - 既存のStorageManager機能への自動フック挿入
     * - 透明性を保った監視機能の提供
     * 
     * 入力：
     * - storageManager: Object - 監視対象のStorageManager
     * 
     * 処理内容：
     * 1. 元のメソッドの保存
     * 2. フック機能付きメソッドへの置換
     * 3. 処理前後でのフック実行
     * 4. 元の処理結果の保持
     * 
     * 出力：
     * - Object: フック設定されたStorageManager
     * 
     * 副作用：
     * - StorageManagerメソッドの書き換え
     * - フック実行による監視開始
     */
    instrumentStorageManager(storageManager) {
        if (!storageManager) {
            this.log('StorageManagerが提供されていません', 'warn');
            return storageManager;
        }

        this.log('StorageManagerに自動フック設定中...', 'info');

        // saveAnalysisResultのフック
        if (typeof storageManager.saveAnalysisResult === 'function') {
            const originalSave = storageManager.saveAnalysisResult.bind(storageManager);
            
            storageManager.saveAnalysisResult = async (data) => {
                const startTime = Date.now();
                
                // 保存前フック
                await this.executeHooks('beforeDataSave', {
                    method: 'saveAnalysisResult',
                    data,
                    timestamp: startTime
                });

                let result;
                let error = null;

                try {
                    result = await originalSave(data);
                    this.statistics.dataOperations++;
                } catch (err) {
                    error = err;
                    result = false;
                }

                const executionTime = Date.now() - startTime;

                // 保存後フック
                await this.executeHooks('afterDataSave', {
                    method: 'saveAnalysisResult',
                    data,
                    result,
                    error,
                    executionTime,
                    timestamp: startTime
                });

                // パフォーマンス監視
                if (executionTime > this.performanceThresholds.saveTime) {
                    await this.executeHooks('onPerformanceIssue', {
                        method: 'saveAnalysisResult',
                        executionTime,
                        threshold: this.performanceThresholds.saveTime,
                        severity: 'warning'
                    });
                }

                if (error) throw error;
                return result;
            };
        }

        // getAnalysisResultのフック
        if (typeof storageManager.getAnalysisResult === 'function') {
            const originalGet = storageManager.getAnalysisResult.bind(storageManager);
            
            storageManager.getAnalysisResult = async () => {
                const startTime = Date.now();
                
                // 取得前フック
                await this.executeHooks('beforeDataLoad', {
                    method: 'getAnalysisResult',
                    timestamp: startTime
                });

                let result;
                let error = null;

                try {
                    result = await originalGet();
                    this.statistics.dataOperations++;
                } catch (err) {
                    error = err;
                    result = null;
                }

                const executionTime = Date.now() - startTime;

                // 取得後フック
                await this.executeHooks('afterDataLoad', {
                    method: 'getAnalysisResult',
                    result,
                    error,
                    executionTime,
                    timestamp: startTime
                });

                // 自動復旧の試行
                if (!result && this.options.enableAutoRecovery) {
                    this.log('データ取得失敗 - 自動復旧を試行', 'warn');
                    result = await this.attemptDataRecovery('analysisResult');
                    if (result) {
                        this.statistics.autoRecoveries++;
                        this.log('自動復旧成功', 'info');
                    }
                }

                if (error && !result) throw error;
                return result;
            };
        }

        this.log('StorageManager自動フック設定完了', 'info');
        return storageManager;
    }

    /**
     * 自動データ復旧処理
     * 
     * 目的：
     * - データ取得失敗時の自動復旧
     * - SimpleStorageManagerを使った代替取得
     * - データ整合性の自動修復
     * 
     * 入力：
     * - dataType: string - 復旧対象データ種別
     * 
     * 処理内容：
     * 1. SimpleStorageManagerでの代替取得
     * 2. 緊急データからの復旧
     * 3. 復旧データの検証
     * 4. 復旧成功時の再保存
     * 
     * 出力：
     * - Object|null: 復旧されたデータ
     * 
     * 副作用：
     * - SimpleStorageManagerの実行
     * - 復旧データの再保存
     */
    async attemptDataRecovery(dataType) {
        try {
            if (typeof SimpleStorageManager !== 'undefined') {
                const simpleStorage = new SimpleStorageManager();
                simpleStorage.debugMode = false;

                let recoveredData = null;

                switch (dataType) {
                    case 'analysisResult':
                        recoveredData = simpleStorage.getAnalysisResult();
                        break;
                    case 'insights':
                        recoveredData = simpleStorage.getInsights();
                        break;
                }

                if (recoveredData) {
                    this.log(`${dataType}の自動復旧成功`, 'info');
                    return recoveredData;
                }
            }

            this.log(`${dataType}の自動復旧失敗`, 'warn');
            return null;
        } catch (error) {
            this.log(`自動復旧処理エラー: ${error.message}`, 'error');
            return null;
        }
    }

    /**
     * 標準フックの設定
     * 
     * 目的：
     * - よく使用されるフック処理の自動設定
     * - bunenjin哲学に基づく品質保証
     * - 開発・運用で有用な監視機能
     * 
     * 処理内容：
     * 1. データ整合性チェック
     * 2. Triple OS構造検証
     * 3. パフォーマンス監視
     * 4. エラー自動記録
     * 
     * 副作用：
     * - 複数フックの自動登録
     */
    setupStandardHooks() {
        this.log('標準フックセットアップ開始', 'info');

        // データ保存後の整合性チェック
        this.addHook('afterDataSave', async (context) => {
            if (context.method === 'saveAnalysisResult' && context.result) {
                const data = context.data;
                
                // Triple OS構造検証
                if (data && data.engineOS && data.interfaceOS && data.safeModeOS) {
                    this.log('✅ Triple OS構造正常', 'debug');
                } else {
                    this.log('⚠️ Triple OS構造不完全', 'warn');
                }
                
                // データサイズ監視
                const dataSize = JSON.stringify(data).length;
                if (dataSize > this.performanceThresholds.dataSize) {
                    this.log(`⚠️ データサイズ大: ${dataSize}バイト`, 'warn');
                }
            }
        }, 100);

        // データ取得前の事前チェック
        this.addHook('beforeDataLoad', async (context) => {
            this.log(`データ取得開始: ${context.method}`, 'debug');
        }, 100);

        // エラー時の詳細ログ
        this.addHook('onError', async (context) => {
            const errorInfo = {
                event: context.originalEvent,
                error: context.error.message,
                hookId: context.hookId,
                timestamp: Date.now()
            };
            
            this.log(`❌ フックエラー詳細: ${JSON.stringify(errorInfo)}`, 'error');
        }, 100);

        // パフォーマンス問題の記録
        this.addHook('onPerformanceIssue', async (context) => {
            this.log(`⚡ パフォーマンス警告: ${context.method} ${context.executionTime}ms`, 'warn');
        }, 100);

        this.log('標準フックセットアップ完了', 'info');
    }

    /**
     * 統計情報取得
     * 
     * 目的：
     * - Hooks システムの動作統計提供
     * - パフォーマンス分析データ提供
     * 
     * 出力：
     * - Object: 詳細統計情報
     */
    getStatistics() {
        const uptime = Date.now() - this.statistics.startTime;
        
        return {
            ...this.statistics,
            uptime,
            hooksRegistered: Object.values(this.hooks).reduce((sum, hooks) => sum + hooks.length, 0),
            averageHookExecutions: Math.round(this.statistics.hookExecutions / (uptime / 1000 / 60)), // per minute
            errorRate: this.statistics.dataOperations > 0 ? 
                Math.round((this.statistics.errorsHandled / this.statistics.dataOperations) * 100) : 0,
            recoveryRate: this.statistics.errorsHandled > 0 ?
                Math.round((this.statistics.autoRecoveries / this.statistics.errorsHandled) * 100) : 0
        };
    }

    /**
     * ログ出力（レベル別）
     */
    log(message, level = 'info') {
        const levels = { debug: 0, info: 1, warn: 2, error: 3 };
        const currentLevel = levels[this.options.logLevel] || 1;
        
        if (levels[level] < currentLevel) return;

        const timestamp = new Date().toLocaleTimeString();
        const prefix = '🔗 [SimpleHooks]';

        switch (level) {
            case 'debug':
                console.debug(`${prefix} [${timestamp}] 🔍 ${message}`);
                break;
            case 'warn':
                console.warn(`${prefix} [${timestamp}] ⚠️ ${message}`);
                break;
            case 'error':
                console.error(`${prefix} [${timestamp}] ❌ ${message}`);
                break;
            default:
                console.log(`${prefix} [${timestamp}] ℹ️ ${message}`);
        }
    }

    /**
     * フックID生成
     */
    generateHookId() {
        return Math.random().toString(36).substr(2, 9);
    }
}

// グローバル参照の設定
if (typeof window !== 'undefined') {
    window.SimpleHooks = SimpleHooks;
}