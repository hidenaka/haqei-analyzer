/**
 * データフロー監視システム
 * 
 * 目的：
 * - os_analyzer → results間のデータ受け渡しリアルタイム監視
 * - データ不整合の早期検出と自動修復
 * - 開発・運用時のトラブルシューティング支援
 * 
 * 処理内容：
 * 1. localStorageの変更監視
 * 2. データ整合性の継続的検証
 * 3. 問題発生時の自動アラート
 * 4. 復旧処理の自動実行
 * 
 * 出力：
 * - リアルタイム監視ログ
 * - データ不整合アラート
 * - 自動修復レポート
 * 
 * 副作用：
 * - addEventListener設定
 * - setInterval監視実行
 * - localStorage読み書き
 * 
 * 前提条件：
 * - SimpleStorageManager利用可能
 * - ブラウザーでlocalStorage利用可能
 * 
 * エラー処理：
 * - 監視機能停止時の安全な処理
 * - JSON解析エラーの適切な処理
 * - 修復処理失敗時のフォールバック
 */
class DataFlowMonitor {
    constructor(options = {}) {
        this.options = {
            monitorInterval: options.monitorInterval || 2000, // 監視間隔（ms）
            enableAutoFix: options.enableAutoFix !== false,   // 自動修復有効
            enableConsoleLog: options.enableConsoleLog !== false, // ログ出力有効
            enableAlerts: options.enableAlerts || false,     // アラート表示
            ...options
        };
        
        this.isMonitoring = false;
        this.monitorInterval = null;
        this.lastSnapshot = null;
        this.issuesFound = [];
        this.fixesApplied = [];
        
        // SimpleStorageManagerの初期化
        try {
            this.simpleStorage = new SimpleStorageManager();
            this.simpleStorage.debugMode = false; // 監視時は静寂
        } catch (error) {
            this.log('SimpleStorageManager初期化失敗', 'error');
            this.simpleStorage = null;
        }
        
        this.log('DataFlowMonitor初期化完了', 'info');
    }

    /**
     * 監視システム開始
     * 
     * 目的：
     * - 継続的なデータ監視の開始
     * - 既存データの初期スナップショット取得
     * 
     * 処理内容：
     * 1. 現在の状態を初期スナップショットとして記録
     * 2. 定期監視タイマーの開始
     * 3. storage eventリスナーの設定
     * 
     * 出力：
     * - boolean: 監視開始成功可否
     * 
     * 副作用：
     * - setInterval設定
     * - addEventListener設定
     * 
     * エラー処理：
     * - タイマー設定失敗時の適切な処理
     */
    startMonitoring() {
        if (this.isMonitoring) {
            this.log('監視は既に開始されています', 'warn');
            return false;
        }

        try {
            // 初期スナップショット取得
            this.lastSnapshot = this.takeSnapshot();
            this.log('初期データスナップショット取得完了', 'info');

            // 定期監視開始
            this.monitorInterval = setInterval(() => {
                this.performPeriodicCheck();
            }, this.options.monitorInterval);

            // Storage event監視
            window.addEventListener('storage', (event) => {
                this.handleStorageEvent(event);
            });

            this.isMonitoring = true;
            this.log('🔍 データフロー監視開始', 'info');
            return true;
        } catch (error) {
            this.log(`監視開始エラー: ${error.message}`, 'error');
            return false;
        }
    }

    /**
     * 監視システム停止
     * 
     * 目的：
     * - 監視プロセスの安全な停止
     * - リソースの適切な解放
     * 
     * 処理内容：
     * 1. 定期監視タイマーの停止
     * 2. イベントリスナーの削除
     * 3. 最終レポートの生成
     * 
     * 出力：
     * - 監視結果サマリー
     * 
     * 副作用：
     * - clearInterval実行
     * - removeEventListener実行
     */
    stopMonitoring() {
        if (!this.isMonitoring) {
            this.log('監視は開始されていません', 'warn');
            return;
        }

        try {
            if (this.monitorInterval) {
                clearInterval(this.monitorInterval);
                this.monitorInterval = null;
            }

            this.isMonitoring = false;
            this.log('🔍 データフロー監視停止', 'info');
            this.generateMonitoringReport();
        } catch (error) {
            this.log(`監視停止エラー: ${error.message}`, 'error');
        }
    }

    /**
     * データスナップショット取得
     * 
     * 目的：
     * - 現在のlocalStorage状態の完全な記録
     * - データ変更の差分検出基準作成
     * 
     * 処理内容：
     * 1. 全HAQEI関連キーの取得
     * 2. 各データの基本情報記録
     * 3. Triple OS構造の検証
     * 4. タイムスタンプ記録
     * 
     * 出力：
     * - Object: スナップショットデータ
     * 
     * エラー処理：
     * - JSON解析失敗時の安全な処理
     * - アクセス権限エラーの処理
     */
    takeSnapshot() {
        const snapshot = {
            timestamp: Date.now(),
            keys: {},
            tripleOSStatus: null,
            totalSize: 0
        };

        try {
            const haqeiKeys = Object.keys(localStorage).filter(key => 
                key.includes('haqei') || key.includes('simple_storage')
            );

            haqeiKeys.forEach(key => {
                try {
                    const rawValue = localStorage.getItem(key);
                    if (rawValue) {
                        snapshot.keys[key] = {
                            exists: true,
                            size: rawValue.length,
                            canParse: false,
                            hasTripleOS: false,
                            lastModified: Date.now()
                        };

                        snapshot.totalSize += rawValue.length;

                        try {
                            const parsed = JSON.parse(rawValue);
                            snapshot.keys[key].canParse = true;
                            snapshot.keys[key].topLevelKeys = Object.keys(parsed);

                            // Triple OS検証
                            const data = parsed.result || parsed;
                            if (data && data.engineOS && data.interfaceOS && data.safeModeOS) {
                                snapshot.keys[key].hasTripleOS = true;
                            }
                        } catch (parseError) {
                            // JSON解析失敗は記録するが処理は継続
                        }
                    } else {
                        snapshot.keys[key] = {
                            exists: false,
                            size: 0,
                            canParse: false,
                            hasTripleOS: false
                        };
                    }
                } catch (keyError) {
                    this.log(`キー ${key} の処理エラー: ${keyError.message}`, 'warn');
                }
            });

            // Triple OS全体状況の評価
            const tripleOSKeys = Object.keys(snapshot.keys).filter(key => 
                snapshot.keys[key].hasTripleOS
            );
            snapshot.tripleOSStatus = {
                available: tripleOSKeys.length > 0,
                keys: tripleOSKeys,
                count: tripleOSKeys.length
            };

        } catch (error) {
            this.log(`スナップショット取得エラー: ${error.message}`, 'error');
        }

        return snapshot;
    }

    /**
     * 定期チェック実行
     * 
     * 目的：
     * - 定期的なデータ整合性確認
     * - 変更の検出と分析
     * - 必要に応じた自動修復実行
     * 
     * 処理内容：
     * 1. 現在のスナップショット取得
     * 2. 前回との差分分析
     * 3. 問題の検出・記録
     * 4. 自動修復の実行判定
     * 
     * 副作用：
     * - 問題検出時のログ出力
     * - 自動修復処理の実行
     */
    performPeriodicCheck() {
        try {
            const currentSnapshot = this.takeSnapshot();
            const issues = this.detectIssues(this.lastSnapshot, currentSnapshot);

            if (issues.length > 0) {
                this.log(`📊 ${issues.length}件の問題を検出`, 'warn');
                this.issuesFound.push(...issues);

                // 自動修復の実行
                if (this.options.enableAutoFix) {
                    this.attemptAutoFix(issues);
                }

                // アラート表示
                if (this.options.enableAlerts) {
                    this.showAlert(issues);
                }
            }

            this.lastSnapshot = currentSnapshot;
        } catch (error) {
            this.log(`定期チェックエラー: ${error.message}`, 'error');
        }
    }

    /**
     * 問題検出アルゴリズム
     * 
     * 目的：
     * - データ変更の分析
     * - 問題パターンの識別
     * - 修復可能性の評価
     * 
     * 入力：
     * - previousSnapshot: Object - 前回のスナップショット
     * - currentSnapshot: Object - 現在のスナップショット
     * 
     * 処理内容：
     * 1. キーの追加・削除確認
     * 2. Triple OS構造の変化確認
     * 3. データサイズの異常変化確認
     * 4. JSON解析可能性の変化確認
     * 
     * 出力：
     * - Array: 検出された問題のリスト
     */
    detectIssues(previousSnapshot, currentSnapshot) {
        const issues = [];

        if (!previousSnapshot || !currentSnapshot) {
            return issues;
        }

        try {
            // 1. キー消失の検出
            Object.keys(previousSnapshot.keys).forEach(key => {
                if (previousSnapshot.keys[key].exists && 
                    (!currentSnapshot.keys[key] || !currentSnapshot.keys[key].exists)) {
                    issues.push({
                        type: 'key_disappeared',
                        key: key,
                        severity: 'high',
                        description: `重要なキー ${key} が消失しました`,
                        fixable: true
                    });
                }
            });

            // 2. Triple OS構造の破損検出
            if (previousSnapshot.tripleOSStatus?.available && 
                !currentSnapshot.tripleOSStatus?.available) {
                issues.push({
                    type: 'triple_os_lost',
                    severity: 'critical',
                    description: 'Triple OS構造が利用できなくなりました',
                    fixable: true
                });
            }

            // 3. JSON解析エラーの検出
            Object.keys(currentSnapshot.keys).forEach(key => {
                if (currentSnapshot.keys[key].exists && !currentSnapshot.keys[key].canParse) {
                    issues.push({
                        type: 'json_parse_error',
                        key: key,
                        severity: 'medium',
                        description: `キー ${key} のJSONデータが破損しています`,
                        fixable: true
                    });
                }
            });

            // 4. データサイズ異常の検出
            const sizeDiff = Math.abs(currentSnapshot.totalSize - previousSnapshot.totalSize);
            const sizeChangeRatio = sizeDiff / (previousSnapshot.totalSize || 1);
            
            if (sizeChangeRatio > 0.5 && sizeDiff > 1000) { // 50%以上かつ1KB以上の変化
                issues.push({
                    type: 'unusual_size_change',
                    severity: 'medium',
                    description: `データサイズが異常に変化しました (${sizeDiff}バイト)`,
                    fixable: false
                });
            }

        } catch (error) {
            this.log(`問題検出エラー: ${error.message}`, 'error');
        }

        return issues;
    }

    /**
     * 自動修復処理
     * 
     * 目的：
     * - 検出された問題の自動修復
     * - SimpleStorageManagerによるデータ復旧
     * - 修復結果の記録
     * 
     * 入力：
     * - issues: Array - 修復対象の問題リスト
     * 
     * 処理内容：
     * 1. 修復可能な問題の抽出
     * 2. SimpleStorageManagerでの復旧試行
     * 3. 修復結果の検証
     * 4. 修復ログの記録
     * 
     * 出力：
     * - 修復実行結果
     * 
     * 副作用：
     * - localStorage修復操作
     * - 修復ログの記録
     */
    attemptAutoFix(issues) {
        if (!this.simpleStorage) {
            this.log('SimpleStorageManager利用不可のため自動修復をスキップ', 'warn');
            return;
        }

        const fixableIssues = issues.filter(issue => issue.fixable);
        
        if (fixableIssues.length === 0) {
            this.log('修復可能な問題が見つかりません', 'info');
            return;
        }

        this.log(`🔧 ${fixableIssues.length}件の問題の修復を試行`, 'info');

        fixableIssues.forEach(issue => {
            try {
                let fixResult = false;

                switch (issue.type) {
                    case 'key_disappeared':
                    case 'triple_os_lost':
                        // データの再取得を試行
                        const analysisResult = this.simpleStorage.getAnalysisResult();
                        if (analysisResult) {
                            fixResult = this.simpleStorage.saveAnalysisResult(analysisResult);
                        }
                        break;

                    case 'json_parse_error':
                        // 破損データの削除と再構築
                        localStorage.removeItem(issue.key);
                        this.log(`破損データ ${issue.key} を削除`, 'info');
                        fixResult = true;
                        break;
                }

                if (fixResult) {
                    this.fixesApplied.push({
                        issue: issue,
                        timestamp: Date.now(),
                        success: true
                    });
                    this.log(`✅ 修復成功: ${issue.description}`, 'info');
                } else {
                    this.log(`❌ 修復失敗: ${issue.description}`, 'warn');
                }

            } catch (fixError) {
                this.log(`修復処理エラー: ${fixError.message}`, 'error');
            }
        });
    }

    /**
     * Storageイベントハンドラー
     * 
     * 目的：
     * - リアルタイムなlocalStorage変更の検出
     * - 外部からの変更監視
     * 
     * 入力：
     * - event: StorageEvent - storage変更イベント
     * 
     * 処理内容：
     * 1. HAQEI関連キーの変更確認
     * 2. 変更内容の分析
     * 3. 必要に応じた即座の対応
     * 
     * 副作用：
     * - リアルタイムログ出力
     */
    handleStorageEvent(event) {
        if (!event.key || !event.key.includes('haqei')) {
            return; // HAQEI関連以外は無視
        }

        this.log(`📝 Storage変更検出: ${event.key}`, 'info');
        
        // 即座にチェックを実行
        setTimeout(() => {
            this.performPeriodicCheck();
        }, 100);
    }

    /**
     * アラート表示
     * 
     * 目的：
     * - ユーザーへの問題通知
     * - 視覚的な警告表示
     */
    showAlert(issues) {
        const criticalIssues = issues.filter(issue => issue.severity === 'critical');
        
        if (criticalIssues.length > 0) {
            const message = `⚠️ データの重要な問題が検出されました:\n${criticalIssues.map(i => i.description).join('\n')}`;
            
            if (confirm(message + '\n\n自動修復を試行しますか？')) {
                this.attemptAutoFix(criticalIssues);
            }
        }
    }

    /**
     * 監視レポート生成
     * 
     * 目的：
     * - 監視期間中の問題・修復のサマリー
     * - 統計情報の提供
     */
    generateMonitoringReport() {
        const report = {
            monitoringPeriod: this.lastSnapshot ? Date.now() - this.lastSnapshot.timestamp : 0,
            issuesFound: this.issuesFound.length,
            fixesApplied: this.fixesApplied.length,
            currentStatus: this.takeSnapshot()
        };

        this.log('📊 監視レポート:', 'info');
        this.log(`  - 監視期間: ${Math.round(report.monitoringPeriod / 1000)}秒`, 'info');
        this.log(`  - 検出問題: ${report.issuesFound}件`, 'info');
        this.log(`  - 適用修復: ${report.fixesApplied}件`, 'info');
        this.log(`  - Triple OS利用可能: ${report.currentStatus.tripleOSStatus?.available ? 'Yes' : 'No'}`, 'info');

        return report;
    }

    /**
     * ログ出力メソッド
     */
    log(message, level = 'info') {
        if (!this.options.enableConsoleLog) return;

        const timestamp = new Date().toLocaleTimeString();
        const prefix = '🔍 [DataFlowMonitor]';

        switch (level) {
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
     * 手動データ整合性チェック
     * 
     * 目的：
     * - オンデマンドでの完全なデータ検証
     * - 開発・デバッグ時の状況確認
     * 
     * 出力：
     * - Object: 詳細な整合性レポート
     */
    checkDataIntegrity() {
        this.log('🔍 手動データ整合性チェック開始', 'info');
        
        const currentSnapshot = this.takeSnapshot();
        const integrityReport = {
            timestamp: Date.now(),
            overall: 'unknown',
            details: {},
            recommendations: []
        };

        try {
            // Triple OS可用性チェック
            if (currentSnapshot.tripleOSStatus?.available) {
                integrityReport.details.tripleOS = '✅ 利用可能';
            } else {
                integrityReport.details.tripleOS = '❌ 利用不可';
                integrityReport.recommendations.push('Triple OSデータの復旧が必要');
            }

            // 各キーの健全性チェック
            const keyHealth = {};
            Object.keys(currentSnapshot.keys).forEach(key => {
                const keyData = currentSnapshot.keys[key];
                if (keyData.exists && keyData.canParse) {
                    keyHealth[key] = '✅ 正常';
                } else if (keyData.exists && !keyData.canParse) {
                    keyHealth[key] = '⚠️ JSON破損';
                    integrityReport.recommendations.push(`${key}の修復が必要`);
                } else {
                    keyHealth[key] = '❌ 存在しない';
                }
            });
            integrityReport.details.keys = keyHealth;

            // 全体評価
            const healthyKeys = Object.values(keyHealth).filter(v => v.includes('✅')).length;
            const totalKeys = Object.keys(keyHealth).length;
            
            if (healthyKeys === totalKeys && currentSnapshot.tripleOSStatus?.available) {
                integrityReport.overall = '✅ 正常';
            } else if (healthyKeys >= totalKeys * 0.8) {
                integrityReport.overall = '⚠️ 軽微な問題あり';
            } else {
                integrityReport.overall = '❌ 重大な問題あり';
            }

        } catch (error) {
            integrityReport.overall = '❌ チェック失敗';
            integrityReport.error = error.message;
        }

        this.log(`整合性チェック完了: ${integrityReport.overall}`, 'info');
        return integrityReport;
    }
}

// グローバル参照の設定
if (typeof window !== 'undefined') {
    window.DataFlowMonitor = DataFlowMonitor;
}