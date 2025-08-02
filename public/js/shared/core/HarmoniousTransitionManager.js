/**
 * 🎯 HarmoniousTransitionManager: 調和的遷移管理システム
 * 
 * 目的:
 * os_analyzer.html → results.html間の確実で調和の取れた画面遷移を管理
 * bunenjin哲学の三才配置（天・人・地）をTriple OSアーキテクチャに適用
 * 
 * 入力:
 * - result: Triple OS分析結果オブジェクト（engineOS, interfaceOS, safeModeOS）
 * - insights: 分析インサイトオブジェクト
 * - storageManager: データ永続化を担当するStorageManagerインスタンス
 * 
 * 処理内容:
 * 1. 乾卦（創造的開始）: データ保存プロセスの開始
 * 2. 坤卦（受容的完成）: データ整合性の検証
 * 3. 屯卦（困難克服）: 実際の画面遷移実行
 * 4. 蒙卦（学習完成）: 遷移プロセスの完了
 * 
 * 出力:
 * - Promise&lt;void&gt;: 遷移完了または例外
 * - イベント発火: 各段階での状態変化通知
 * 
 * 副作用:
 * - localStorage への分析結果・インサイト保存
 * - DOM イベント発火（stateChanged）
 * - window.location.href による画面遷移
 * 
 * 前提条件:
 * - StorageManager が正常に初期化済み
 * - result が有効なTriple OS構造を持つ
 * - DOM環境での実行（ブラウザ環境）
 * 
 * エラー処理:
 * - データ構造検証失敗: InvalidTripleOSStructureError
 * - ストレージ保存失敗: StorageSaveError 
 * - 遷移実行失敗: TransitionExecutionError
 */
class HarmoniousTransitionManager extends EventTarget {
    constructor(storageManager) {
        super();
        this.storageManager = storageManager;
        this.state = 'idle'; // idle -> saving -> validating -> transitioning -> completed -> error
        this.lastError = null;
        this.transitionStartTime = null;
        
        // 易経の四段階対応
        this.TRANSITION_STAGES = {
            QIAN: 'saving',      // 乾卦: 創造的開始
            KUN: 'validating',   // 坤卦: 受容的完成  
            ZHUN: 'transitioning', // 屯卦: 困難克服
            MENG: 'completed'    // 蒙卦: 学習完成
        };
    }

    /**
     * 易経的変化に基づく段階的遷移実行
     * 
     * bunenjin哲学統合:
     * - Engine OS: 内的確実性（データ保存の確実性）
     * - Interface OS: 社会的配慮（ユーザー体験の配慮）
     * - Safe Mode OS: 防御機制（エラー回復とデータ保護）
     */
    async executeHarmoniousTransition(result, insights) {
        try {
            this.transitionStartTime = Date.now();
            this.lastError = null;

            // 入力データの事前検証（Safe Mode OS）
            this.validateTripleOSStructure(result);

            // 第一段階: 乾卦（創造的開始）- データ保存準備
            this.setState(this.TRANSITION_STAGES.QIAN);
            await this.saveWithVerification(result, insights);
            
            // 第二段階: 坤卦（受容的完成）- データ検証
            this.setState(this.TRANSITION_STAGES.KUN);
            await this.validateDataIntegrity();
            
            // 第三段階: 屯卦（困難克服）- 遷移実行
            this.setState(this.TRANSITION_STAGES.ZHUN);
            await this.executeTransition();
            
            // 第四段階: 蒙卦（学習完成）- 遷移完了
            this.setState(this.TRANSITION_STAGES.MENG);
            
            console.log(`✅ [HarmoniousTransition] 調和的遷移完了 (${Date.now() - this.transitionStartTime}ms)`);
            
        } catch (error) {
            this.setState('error');
            this.lastError = error;
            console.error('❌ [HarmoniousTransition] 遷移失敗:', error);
            throw error;
        }
    }

    /**
     * Triple OS構造の妥当性検証
     * 
     * 三才配置による検証:
     * - 天（Engine OS）: 価値観データの存在確認
     * - 人（Interface OS）: 社会的データの存在確認
     * - 地（Safe Mode OS）: 防御データの存在確認
     */
    validateTripleOSStructure(result) {
        if (!result || typeof result !== 'object') {
            throw new Error('Invalid Triple OS structure: Missing result object');
        }

        // 天の検証: Engine OS
        if (!result.engineOS || typeof result.engineOS !== 'object') {
            throw new Error('Invalid Triple OS structure: Missing or invalid Engine OS');
        }

        // 人の検証: Interface OS
        if (!result.interfaceOS || typeof result.interfaceOS !== 'object') {
            throw new Error('Invalid Triple OS structure: Missing or invalid Interface OS');
        }

        // 地の検証: Safe Mode OS
        if (!result.safeModeOS || typeof result.safeModeOS !== 'object') {
            throw new Error('Invalid Triple OS structure: Missing or invalid Safe Mode OS');
        }
    }

    /**
     * 検証付きデータ保存（Engine OS: 内的確実性）
     */
    async saveWithVerification(result, insights) {
        try {
            // 分析結果の保存
            const saveResultSuccess = await this.storageManager.saveAnalysisResult(result);
            if (!saveResultSuccess) {
                throw new Error('Analysis result save failed');
            }

            // インサイトの保存
            const saveInsightsSuccess = await this.storageManager.saveInsights(insights);
            if (!saveInsightsSuccess) {
                throw new Error('Insights save failed');
            }

            // セッション状態の更新
            await this.storageManager.updateSession({ 
                stage: "results",
                transitionTime: Date.now()
            });

            console.log('💾 [HarmoniousTransition] データ保存完了');
            
        } catch (error) {
            console.error('❌ [HarmoniousTransition] データ保存失敗:', error);
            throw error;
        }
    }

    /**
     * データ整合性検証（Interface OS: 社会的配慮）
     */
    async validateDataIntegrity() {
        try {
            // 保存されたデータの再取得・検証
            const savedResult = this.storageManager.getAnalysisResult();
            const savedInsights = this.storageManager.getInsights();

            if (!savedResult) {
                throw new Error('Data integrity check failed: Analysis result not found');
            }

            if (!savedInsights) {
                console.warn('⚠️ [HarmoniousTransition] インサイトデータが見つかりません（継続可能）');
            }

            // Triple OS構造の再検証
            this.validateTripleOSStructure(savedResult);

            console.log('✅ [HarmoniousTransition] データ整合性検証完了');
            
        } catch (error) {
            console.error('❌ [HarmoniousTransition] データ整合性検証失敗:', error);
            throw error;
        }
    }

    /**
     * 画面遷移実行（Safe Mode OS: 防御機制）
     */
    async executeTransition() {
        try {
            // 遷移前の最終確認
            if (this.state !== this.TRANSITION_STAGES.ZHUN) {
                throw new Error('Invalid state for transition execution');
            }

            // 遷移実行（実際の実装では適切な遷移メカニを使用）
            console.log('🔄 [HarmoniousTransition] results.htmlへ遷移中...');
            
            // 実際の遷移は外部で実装（テスト可能性のため）
            this.dispatchEvent(new CustomEvent('readyForTransition', {
                detail: { 
                    targetUrl: 'results.html',
                    transitionTime: Date.now() - this.transitionStartTime
                }
            }));

        } catch (error) {
            console.error('❌ [HarmoniousTransition] 遷移実行失敗:', error);
            throw error;
        }
    }

    /**
     * 状態変更とイベント発火
     */
    setState(newState) {
        const previousState = this.state;
        this.state = newState;
        
        console.log(`🔄 [HarmoniousTransition] 状態変更: ${previousState} → ${newState}`);
        
        this.dispatchEvent(new CustomEvent('stateChanged', {
            detail: {
                previousState,
                state: newState,
                timestamp: Date.now()
            }
        }));
    }

    /**
     * 現在の状態取得（Interface OS: 透明性）
     */
    getCurrentState() {
        return this.state;
    }

    /**
     * 遷移進捗情報取得（Interface OS: ユーザー配慮）
     */
    getTransitionProgress() {
        const stageOrder = ['idle', 'saving', 'validating', 'transitioning', 'completed'];
        const currentIndex = stageOrder.indexOf(this.state);
        
        return {
            currentStage: this.state,
            completedStages: stageOrder.slice(0, Math.max(0, currentIndex)),
            nextStage: currentIndex &lt; stageOrder.length - 1 ? stageOrder[currentIndex + 1] : null,
            progressPercentage: currentIndex >= 0 ? (currentIndex / (stageOrder.length - 1)) * 100 : 0
        };
    }

    /**
     * 最後のエラー取得（Safe Mode OS: エラー情報提供）
     */
    getLastError() {
        return this.lastError;
    }

    /**
     * 遷移時間取得（パフォーマンス監視）
     */
    getTransitionDuration() {
        return this.transitionStartTime ? Date.now() - this.transitionStartTime : null;
    }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HarmoniousTransitionManager;
} else if (typeof window !== 'undefined') {
    window.HarmoniousTransitionManager = HarmoniousTransitionManager;
}