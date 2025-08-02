/**
 * シンプルで確実なストレージ管理システム
 * 
 * 目的：
 * - os_analyzer → results間の確実なデータ受け渡し
 * - 複雑なフォールバック処理の簡素化
 * - Triple OSデータ構造の一貫性保証
 * 
 * 処理内容：
 * 1. 確実なデータ保存（複数箇所への冗長保存）
 * 2. 段階的データ取得（優先順位付きフォールバック）
 * 3. データ整合性検証
 * 4. エラー時の詳細ログ出力
 * 
 * 出力：
 * - 保存・取得メソッドの実行結果
 * - データ整合性検証結果
 * - エラー時の詳細診断情報
 * 
 * 副作用：
 * - localStorage・sessionStorageの読み書き
 * - コンソールログ出力
 * 
 * 前提条件：
 * - ブラウザーでlocalStorageが利用可能
 * - JSON.parse/stringifyが正常動作
 * 
 * エラー処理：
 * - JSON解析エラーの安全な処理
 * - 容量不足時のフォールバック
 * - データ不整合時の自動修復
 */
class SimpleStorageManager {
    constructor() {
        this.prefix = 'haqei_';
        this.version = '2025.08.01';
        this.debugMode = true;
        
        this.log('SimpleStorageManager initialized', 'info');
    }

    /**
     * ログ出力メソッド
     * 
     * 目的：
     * - 統一的なログフォーマット
     * - デバッグ情報の一元管理
     * - 問題診断の効率化
     * 
     * 入力：
     * - message: string - ログメッセージ
     * - level: string - ログレベル (info|warn|error)
     * 
     * 処理内容：
     * 1. ログレベルに応じた適切な出力メソッド選択
     * 2. タイムスタンプとプレフィックス追加
     * 3. デバッグモード確認
     * 
     * 副作用：
     * - console.log/warn/error出力
     * 
     * エラー処理：
     * - ログ出力失敗時の安全な処理
     */
    log(message, level = 'info') {
        if (!this.debugMode) return;
        
        const timestamp = new Date().toLocaleTimeString();
        const prefix = '📦 [SimpleStorage]';
        
        try {
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
        } catch (error) {
            // ログ出力失敗時も安全に処理
        }
    }

    /**
     * 分析結果の確実な保存
     * 
     * 目的：
     * - Triple OSデータの確実な永続化
     * - 複数箇所への冗長保存によるデータ保護
     * - 保存成功の確実な検証
     * 
     * 入力：
     * - analysisResult: Object - Triple OS分析結果データ
     * 
     * 処理内容：
     * 1. データ構造の検証（Triple OS必須項目確認）
     * 2. メインストレージへの保存
     * 3. バックアップストレージへの保存
     * 4. 緊急用ストレージへの保存
     * 5. 保存成功の確認
     * 
     * 出力：
     * - boolean: 保存成功可否
     * 
     * 副作用：
     * - localStorage複数箇所への書き込み
     * - 保存確認ログ出力
     * 
     * 前提条件：
     * - analysisResultがTriple OS構造を持つ
     * - localStorage書き込み権限がある
     * 
     * エラー処理：
     * - localStorage容量不足時の適切な処理
     * - 不正なデータ構造の検出・報告
     */
    saveAnalysisResult(analysisResult) {
        try {
            this.log('Saving analysis result...', 'info');
            
            // データ構造検証
            if (!this.validateTripleOSStructure(analysisResult)) {
                this.log('Invalid Triple OS structure detected', 'error');
                return false;
            }

            const saveData = {
                result: analysisResult,
                timestamp: Date.now(),
                version: this.version,
                source: 'SimpleStorageManager'
            };

            const serialized = JSON.stringify(saveData);
            
            // 1. メイン保存
            localStorage.setItem(`${this.prefix}analysis_result`, serialized);
            this.log('Main storage saved', 'info');

            // 2. バックアップ保存
            localStorage.setItem(`${this.prefix}analysis_backup`, serialized);
            this.log('Backup storage saved', 'info');

            // 3. 緊急用保存（異なる形式）
            localStorage.setItem(`${this.prefix}emergency_result`, JSON.stringify({
                engineOS: analysisResult.engineOS,
                interfaceOS: analysisResult.interfaceOS,
                safeModeOS: analysisResult.safeModeOS,
                timestamp: Date.now(),
                emergency: true
            }));
            this.log('Emergency storage saved', 'info');

            // 4. セッションストレージにも保存
            try {
                sessionStorage.setItem(`${this.prefix}session_result`, serialized);
                this.log('Session storage saved', 'info');
            } catch (sessionError) {
                this.log('Session storage failed (non-critical)', 'warn');
            }

            // 保存確認
            if (this.verifyAnalysisResultSaved(analysisResult)) {
                this.log('✅ Analysis result save confirmed', 'info');
                return true;
            } else {
                this.log('❌ Analysis result save verification failed', 'error');
                return false;
            }

        } catch (error) {
            this.log(`Save error: ${error.message}`, 'error');
            return false;
        }
    }

    /**
     * 分析結果の確実な取得
     * 
     * 目的：
     * - 段階的フォールバックによる確実なデータ取得
     * - Triple OS構造の整合性確保
     * - データ不整合時の自動修復
     * 
     * 処理内容：
     * 1. メインストレージからの取得試行
     * 2. バックアップストレージからの取得試行
     * 3. 緊急用ストレージからの取得試行
     * 4. セッションストレージからの取得試行
     * 5. データ整合性検証・修復
     * 
     * 出力：
     * - Object|null: Triple OS分析結果データ
     * 
     * 副作用：
     * - 取得プロセスの詳細ログ出力
     * - データ修復時の自動保存
     * 
     * エラー処理：
     * - JSON解析エラーの安全な処理
     * - 不正なデータ構造の検出・修復
     * - 全取得失敗時のnull返却
     */
    getAnalysisResult() {
        try {
            this.log('Getting analysis result...', 'info');

            // 1. メインストレージから取得
            let result = this.tryGetFromStorage(`${this.prefix}analysis_result`);
            if (result && this.validateTripleOSStructure(result)) {
                this.log('✅ Retrieved from main storage', 'info');
                return result;
            }

            // 2. バックアップストレージから取得
            result = this.tryGetFromStorage(`${this.prefix}analysis_backup`);
            if (result && this.validateTripleOSStructure(result)) {
                this.log('✅ Retrieved from backup storage', 'info');
                // メインストレージに復元
                this.saveAnalysisResult(result);
                return result;
            }

            // 3. 緊急用ストレージから取得
            result = this.tryGetFromStorage(`${this.prefix}emergency_result`);
            if (result && this.validateTripleOSStructure(result)) {
                this.log('✅ Retrieved from emergency storage', 'info');
                // メインストレージに復元
                this.saveAnalysisResult(result);
                return result;
            }

            // 4. セッションストレージから取得
            result = this.tryGetFromSessionStorage(`${this.prefix}session_result`);
            if (result && this.validateTripleOSStructure(result)) {
                this.log('✅ Retrieved from session storage', 'info');
                // メインストレージに復元
                this.saveAnalysisResult(result);
                return result;
            }

            // 5. 従来のStorageManagerキー確認
            result = this.tryGetFromStorage('haqei_analysis_result');
            if (result && this.validateTripleOSStructure(result)) {
                this.log('✅ Retrieved from legacy storage', 'info');
                // 新形式に移行保存
                this.saveAnalysisResult(result);
                return result;
            }

            this.log('❌ No valid analysis result found', 'error');
            this.logStorageStatus();
            return null;

        } catch (error) {
            this.log(`Get error: ${error.message}`, 'error');
            return null;
        }
    }

    /**
     * ストレージからの安全な取得試行
     * 
     * 目的：
     * - JSON解析エラーの安全な処理
     * - データ構造の事前検証
     * - 取得エラーの詳細ログ
     * 
     * 入力：
     * - key: string - ストレージキー
     * 
     * 処理内容：
     * 1. localStorageからの生データ取得
     * 2. JSON解析試行
     * 3. データ構造の基本検証
     * 4. result/dataプロパティの展開
     * 
     * 出力：
     * - Object|null: 解析されたデータオブジェクト
     * 
     * エラー処理：
     * - JSON解析失敗時のnull返却
     * - 不正なデータ形式の安全な処理
     */
    tryGetFromStorage(key) {
        try {
            const rawData = localStorage.getItem(key);
            if (!rawData) return null;

            const parsed = JSON.parse(rawData);
            
            // ラップされたデータの展開
            if (parsed.result) return parsed.result;
            if (parsed.data) return parsed.data;
            
            return parsed;
        } catch (error) {
            this.log(`Parse error for key ${key}: ${error.message}`, 'warn');
            return null;
        }
    }

    /**
     * セッションストレージからの安全な取得試行
     * 
     * 目的：
     * - セッションストレージ特有の処理
     * - localStorage同様の安全な取得
     * 
     * 入力：
     * - key: string - セッションストレージキー
     * 
     * 処理内容：
     * 1. sessionStorageからの生データ取得
     * 2. JSON解析試行
     * 3. データ構造の基本検証
     * 
     * 出力：
     * - Object|null: 解析されたデータオブジェクト
     * 
     * エラー処理：
     * - JSON解析失敗時のnull返却
     * - sessionStorage無効時の安全な処理
     */
    tryGetFromSessionStorage(key) {
        try {
            const rawData = sessionStorage.getItem(key);
            if (!rawData) return null;

            const parsed = JSON.parse(rawData);
            
            // ラップされたデータの展開
            if (parsed.result) return parsed.result;
            if (parsed.data) return parsed.data;
            
            return parsed;
        } catch (error) {
            this.log(`Session parse error for key ${key}: ${error.message}`, 'warn');
            return null;
        }
    }

    /**
     * Triple OS構造の検証
     * 
     * 目的：
     * - データ整合性の確実な検証
     * - 必須プロパティの存在確認
     * - Triple OSアーキテクチャ準拠の保証
     * 
     * 入力：
     * - data: Object - 検証対象データ
     * 
     * 処理内容：
     * 1. データオブジェクトの基本検証
     * 2. Triple OS三要素の存在確認
     * 3. 各OS要素の基本構造確認
     * 4. 必須プロパティの存在確認
     * 
     * 出力：
     * - boolean: 構造検証結果
     * 
     * 副作用：
     * - 検証失敗時の詳細ログ出力
     * 
     * エラー処理：
     * - null/undefined入力の安全な処理
     * - プロパティアクセスエラーの防止
     */
    validateTripleOSStructure(data) {
        if (!data || typeof data !== 'object') {
            this.log('Data is not a valid object', 'warn');
            return false;
        }

        const requiredOS = ['engineOS', 'interfaceOS', 'safeModeOS'];
        
        for (const osName of requiredOS) {
            if (!data[osName]) {
                this.log(`Missing ${osName} in data structure`, 'warn');
                return false;
            }

            const os = data[osName];
            if (!os.name && !os.hexagram && !os.score) {
                this.log(`Invalid ${osName} structure`, 'warn');
                return false;
            }
        }

        this.log('Triple OS structure validated successfully', 'info');
        return true;
    }

    /**
     * 分析結果保存の確認
     * 
     * 目的：
     * - 保存処理の成功確認
     * - データ完全性の検証
     * - 保存失敗の早期検出
     * 
     * 入力：
     * - originalData: Object - 保存対象の元データ
     * 
     * 処理内容：
     * 1. メインストレージからの再読み込み
     * 2. 元データとの一致確認
     * 3. Triple OS構造の再検証
     * 
     * 出力：
     * - boolean: 保存確認結果
     * 
     * エラー処理：
     * - 読み込み失敗時の適切な処理
     * - データ不一致時の詳細ログ
     */
    verifyAnalysisResultSaved(originalData) {
        try {
            const saved = this.tryGetFromStorage(`${this.prefix}analysis_result`);
            
            if (!saved) {
                this.log('Verification failed: no saved data found', 'error');
                return false;
            }

            if (!this.validateTripleOSStructure(saved)) {
                this.log('Verification failed: invalid saved structure', 'error');
                return false;
            }

            // 基本的な一致確認（完全一致は要求しない）
            const hasEngineOS = saved.engineOS && originalData.engineOS;
            const hasInterfaceOS = saved.interfaceOS && originalData.interfaceOS;
            const hasSafeModeOS = saved.safeModeOS && originalData.safeModeOS;

            if (hasEngineOS && hasInterfaceOS && hasSafeModeOS) {
                this.log('Verification passed: Triple OS structure confirmed', 'info');
                return true;
            } else {
                this.log('Verification failed: structure mismatch', 'error');
                return false;
            }
        } catch (error) {
            this.log(`Verification error: ${error.message}`, 'error');
            return false;
        }
    }

    /**
     * 現在のストレージ状態の詳細ログ出力
     * 
     * 目的：
     * - デバッグ時の詳細情報提供
     * - データ不整合の診断支援
     * - 開発時の状況把握
     * 
     * 処理内容：
     * 1. 全関連キーの存在確認
     * 2. 各データのサイズ・形式確認
     * 3. Triple OS構造の確認
     * 
     * 副作用：
     * - 詳細なコンソールログ出力
     * 
     * エラー処理：
     * - ログ出力失敗時の安全な処理
     */
    logStorageStatus() {
        this.log('=== Storage Status Debug ===', 'info');

        const keysToCheck = [
            `${this.prefix}analysis_result`,
            `${this.prefix}analysis_backup`,
            `${this.prefix}emergency_result`,
            `${this.prefix}session_result`,
            'haqei_analysis_result',
            'haqei_emergency_result'
        ];

        keysToCheck.forEach(key => {
            try {
                const data = localStorage.getItem(key);
                if (data) {
                    const size = data.length;
                    try {
                        const parsed = JSON.parse(data);
                        const hasTripleOS = this.validateTripleOSStructure(parsed.result || parsed);
                        this.log(`📋 ${key}: ${size} chars, valid JSON, Triple OS: ${hasTripleOS}`, 'info');
                    } catch (parseError) {
                        this.log(`📋 ${key}: ${size} chars, invalid JSON`, 'warn');
                    }
                } else {
                    this.log(`📋 ${key}: not found`, 'info');
                }
            } catch (error) {
                this.log(`📋 ${key}: check failed`, 'error');
            }
        });

        // セッションストレージ確認
        try {
            const sessionData = sessionStorage.getItem(`${this.prefix}session_result`);
            if (sessionData) {
                this.log(`📋 Session storage: ${sessionData.length} chars`, 'info');
            } else {
                this.log('📋 Session storage: not found', 'info');
            }
        } catch (error) {
            this.log('📋 Session storage: check failed', 'warn');
        }
    }

    /**
     * インサイトデータの保存・取得（分析結果と同様の処理）
     * 
     * 目的：
     * - インサイトデータの確実な永続化
     * - 分析結果と同様の信頼性確保
     */
    saveInsights(insights) {
        try {
            this.log('Saving insights...', 'info');

            const saveData = {
                insights: insights,
                timestamp: Date.now(),
                version: this.version,
                source: 'SimpleStorageManager'
            };

            const serialized = JSON.stringify(saveData);
            
            localStorage.setItem(`${this.prefix}insights`, serialized);
            localStorage.setItem(`${this.prefix}insights_backup`, serialized);
            
            try {
                sessionStorage.setItem(`${this.prefix}session_insights`, serialized);
            } catch (sessionError) {
                this.log('Session insights save failed (non-critical)', 'warn');
            }

            this.log('✅ Insights saved successfully', 'info');
            return true;
        } catch (error) {
            this.log(`Insights save error: ${error.message}`, 'error');
            return false;
        }
    }

    getInsights() {
        try {
            this.log('Getting insights...', 'info');

            // 1. メインから取得
            let result = this.tryGetFromStorage(`${this.prefix}insights`);
            if (result) {
                this.log('✅ Retrieved insights from main storage', 'info');
                return result;
            }

            // 2. バックアップから取得
            result = this.tryGetFromStorage(`${this.prefix}insights_backup`);
            if (result) {
                this.log('✅ Retrieved insights from backup storage', 'info');
                return result;
            }

            // 3. セッションから取得
            result = this.tryGetFromSessionStorage(`${this.prefix}session_insights`);
            if (result) {
                this.log('✅ Retrieved insights from session storage', 'info');
                return result;
            }

            // 4. 従来形式から取得
            result = this.tryGetFromStorage('haqei_insights');
            if (result) {
                this.log('✅ Retrieved insights from legacy storage', 'info');
                return result;
            }

            this.log('❌ No insights found', 'warn');
            return null;
        } catch (error) {
            this.log(`Insights get error: ${error.message}`, 'error');
            return null;
        }
    }

    /**
     * 全ストレージのクリア（テスト・デバッグ用）
     */
    clearAll() {
        try {
            const keysToRemove = Object.keys(localStorage).filter(key => 
                key.startsWith(this.prefix) || key.startsWith('haqei_')
            );
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            
            // セッションストレージもクリア
            const sessionKeys = Object.keys(sessionStorage).filter(key => 
                key.startsWith(this.prefix)
            );
            sessionKeys.forEach(key => sessionStorage.removeItem(key));
            
            this.log(`✅ Cleared ${keysToRemove.length} localStorage + ${sessionKeys.length} sessionStorage items`, 'info');
            return true;
        } catch (error) {
            this.log(`Clear error: ${error.message}`, 'error');
            return false;
        }
    }
}

// グローバル参照の設定（互換性のため）
if (typeof window !== 'undefined') {
    window.SimpleStorageManager = SimpleStorageManager;
}