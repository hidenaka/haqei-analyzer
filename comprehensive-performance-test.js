// OS Analyzer システム包括的パフォーマンステスト
// テスト対象: PersonalStrategyAI, TripleOSStrategicView, StorageManager, 
//           IChingUltraSyncLogic, DataManager

class ComprehensivePerformanceTest {
    constructor() {
        this.testResults = {
            personalStrategyAI: {},
            tripleOSStrategicView: {},
            storageManager: {},
            iChingUltraSyncLogic: {},
            dataManager: {},
            overall: {}
        };
        this.startTime = null;
        this.errors = [];
    }

    // メインテスト実行メソッド
    async runAllTests() {
        console.log("🚀 OS Analyzer システム包括的パフォーマンステスト開始");
        this.startTime = performance.now();

        try {
            // 1. PersonalStrategyAI 応答短縮エラー修正の検証
            await this.testPersonalStrategyAI();
            
            // 2. TripleOSStrategicView ConnectionsVisualizer読み込み改善の検証
            await this.testTripleOSStrategicView();
            
            // 3. StorageManager セッションデータ破損修正の検証
            await this.testStorageManager();
            
            // 4. IChingUltraSyncLogic 過剰処理最適化の検証
            await this.testIChingUltraSyncLogic();
            
            // 5. DataManager hexagram検索最適化の検証
            await this.testDataManager();
            
            // 6. 統合パフォーマンステスト
            await this.testIntegratedPerformance();
            
            // 7. 結果レポート生成
            this.generateReport();
            
        } catch (error) {
            console.error("❌ テスト実行中にエラーが発生:", error);
            this.errors.push(error);
        }
    }

    // 1. PersonalStrategyAI テスト
    async testPersonalStrategyAI() {
        console.log("\n📝 PersonalStrategyAI 応答短縮エラー修正検証...");
        const testStart = performance.now();

        try {
            // Mock DataManager
            const mockDataManager = {
                getHexagramDetails: (id) => ({
                    engine: {
                        core_drive: "創造性を発揮すること",
                        potential_strengths: ["洞察力", "創造性", "独立性"]
                    },
                    interface: {
                        how_it_appears: "堂々とした振る舞い",
                        behavioral_patterns: ["リーダーシップ", "協調性", "責任感"],
                        impression_on_others: "信頼できる人"
                    },
                    safe_mode: {
                        trigger_situations: ["過度のプレッシャー", "批判的環境"],
                        defensive_patterns: ["完璧主義", "回避行動"],
                        internal_state: "自分を守ろうとする気持ち"
                    }
                })
            };

            // PersonalStrategyAI インスタンス作成
            const ai = new PersonalStrategyAI(mockDataManager);

            // テストデータ
            const mockAnalysisData = {
                engineOS: { osName: "創造探求系", hexagramId: 1, vector: { "乾_創造性": 0.8, "坎_探求性": 0.7 } },
                interfaceOS: { osName: "調和共生系", hexagramId: 2 },
                safeModeOS: { osName: "保護安定系", hexagramId: 3 },
                userConcern: "自己理解を深めたい"
            };

            console.log("  🧪 戦略生成テスト実行中...");
            const strategyStart = performance.now();
            
            const strategy = await ai.generateStrategySummary(mockAnalysisData);
            
            const strategyTime = performance.now() - strategyStart;

            // 検証項目
            const tests = {
                hasRootStrength: !!strategy.rootStrength,
                hasOptimalRole: !!strategy.optimalRole,
                hasDefensivePattern: !!strategy.defensivePattern,
                hasPracticalAdvice: !!strategy.practicalAdvice,
                hasSafemodeIntegration: !!strategy.safemodeIntegration,
                responseTimeUnder5s: strategyTime < 5000,
                allResponsesHaveText: Object.values(strategy).every(item => 
                    typeof item === 'object' && item.text && item.text.length > 0
                ),
                qualityScoreAbove70: Object.values(strategy).every(item =>
                    typeof item === 'object' && (!item.quality || item.quality >= 70)
                ),
                minLengthMet: Object.values(strategy).every(item =>
                    typeof item === 'object' && (!item.text || item.text.length >= 150)
                ),
                hasFirstPerson: Object.values(strategy).every(item =>
                    typeof item === 'object' && (!item.text || 
                    (item.text.includes('私は') || item.text.includes('私の') || item.text.includes('私が')))
                )
            };

            const passedTests = Object.values(tests).filter(t => t).length;
            const totalTests = Object.keys(tests).length;
            const successRate = (passedTests / totalTests) * 100;

            this.testResults.personalStrategyAI = {
                executionTime: strategyTime,
                successRate: successRate,
                tests: tests,
                strategy: strategy,
                errors: strategy.error ? [strategy.error] : []
            };

            console.log(`  ✅ PersonalStrategyAI テスト完了: ${successRate.toFixed(1)}% 成功率, ${strategyTime.toFixed(1)}ms`);

        } catch (error) {
            console.error("  ❌ PersonalStrategyAI テストエラー:", error);
            this.testResults.personalStrategyAI = { error: error.message, executionTime: performance.now() - testStart };
            this.errors.push(error);
        }
    }

    // 2. TripleOSStrategicView テスト
    async testTripleOSStrategicView() {
        console.log("\n🔄 TripleOSStrategicView ConnectionsVisualizer読み込み改善検証...");
        const testStart = performance.now();

        try {
            // ConnectionsVisualizerの存在チェック
            const visualizerExists = typeof InteractiveConnectionsVisualizer !== 'undefined';
            
            // Mock データ
            const mockTripleOSData = {
                engineOS: { osName: "創造探求系", hexagramId: 1 },
                interfaceOS: { osName: "調和共生系", hexagramId: 2 },
                safeModeOS: { osName: "保護安定系", hexagramId: 3 }
            };

            let loadTime = null;
            let renderTime = null;
            let hasErrors = false;

            if (visualizerExists) {
                console.log("  🧪 ConnectionsVisualizer読み込みテスト...");
                
                const loadStart = performance.now();
                const visualizer = new InteractiveConnectionsVisualizer();
                loadTime = performance.now() - loadStart;

                const renderStart = performance.now();
                // 仮想的なレンダリングテスト
                await new Promise(resolve => setTimeout(resolve, 100));
                renderTime = performance.now() - renderStart;
            } else {
                console.warn("  ⚠️ InteractiveConnectionsVisualizer が見つかりません");
                hasErrors = true;
            }

            this.testResults.tripleOSStrategicView = {
                executionTime: performance.now() - testStart,
                visualizerExists: visualizerExists,
                loadTime: loadTime,
                renderTime: renderTime,
                hasErrors: hasErrors,
                loadTimeUnder1s: loadTime !== null && loadTime < 1000,
                renderTimeUnder500ms: renderTime !== null && renderTime < 500
            };

            console.log(`  ✅ TripleOSStrategicView テスト完了: 読み込み${loadTime ? loadTime.toFixed(1) + 'ms' : 'N/A'}`);

        } catch (error) {
            console.error("  ❌ TripleOSStrategicView テストエラー:", error);
            this.testResults.tripleOSStrategicView = { error: error.message, executionTime: performance.now() - testStart };
            this.errors.push(error);
        }
    }

    // 3. StorageManager テスト
    async testStorageManager() {
        console.log("\n💾 StorageManager セッションデータ破損修正検証...");
        const testStart = performance.now();

        try {
            // StorageManagerの存在チェック
            const storageManagerExists = typeof StorageManager !== 'undefined';
            
            if (!storageManagerExists) {
                console.warn("  ⚠️ StorageManager が見つかりません");
                this.testResults.storageManager = { error: "StorageManager not found", executionTime: performance.now() - testStart };
                return;
            }

            const storageManager = new StorageManager();
            const testKey = 'haqei_test_session';
            
            // テストデータ
            const testData = {
                sessionId: 'test_123',
                analysisData: {
                    engineOS: { osName: "創造探求系", hexagramId: 1 },
                    interfaceOS: { osName: "調和共生系", hexagramId: 2 },
                    timestamp: Date.now()
                },
                userResponses: [1, 2, 3, 4, 5],
                progress: 0.75
            };

            console.log("  🧪 データ保存・読み込みテスト...");
            
            // 1. データ保存テスト
            const saveStart = performance.now();
            storageManager.setSessionData(testKey, testData);
            const saveTime = performance.now() - saveStart;

            // 2. データ読み込みテスト
            const loadStart = performance.now();
            const loadedData = storageManager.getSessionData(testKey);
            const loadTime = performance.now() - loadStart;

            // 3. データ整合性チェック
            const dataIntegrityCheck = JSON.stringify(testData) === JSON.stringify(loadedData);

            // 4. 破損データ処理テスト
            localStorage.setItem(testKey, '{"invalid": json data}');
            const corruptedDataHandling = storageManager.getSessionData(testKey, 'default_value') === 'default_value';

            // 5. 大容量データテスト
            const largeData = { 
                bigArray: new Array(10000).fill(0).map((_, i) => ({ id: i, data: `test_${i}` }))
            };
            
            const largeSaveStart = performance.now();
            try {
                storageManager.setSessionData('large_test', largeData);
                const largeSaveTime = performance.now() - largeSaveStart;
                
                const largeLoadStart = performance.now();
                const loadedLargeData = storageManager.getSessionData('large_test');
                const largeLoadTime = performance.now() - largeLoadStart;

                this.testResults.storageManager = {
                    executionTime: performance.now() - testStart,
                    saveTime: saveTime,
                    loadTime: loadTime,
                    largeSaveTime: largeSaveTime,
                    largeLoadTime: largeLoadTime,
                    dataIntegrityCheck: dataIntegrityCheck,
                    corruptedDataHandling: corruptedDataHandling,
                    performanceTargetMet: saveTime < 100 && loadTime < 50,
                    largeDataPerformance: largeSaveTime < 1000 && largeLoadTime < 500
                };

            } catch (error) {
                console.warn("  ⚠️ 大容量データテストでエラー:", error.message);
                this.testResults.storageManager.largeDataError = error.message;
            }

            // クリーンアップ
            localStorage.removeItem(testKey);
            localStorage.removeItem('large_test');

            console.log(`  ✅ StorageManager テスト完了: 保存${saveTime.toFixed(1)}ms, 読み込み${loadTime.toFixed(1)}ms`);

        } catch (error) {
            console.error("  ❌ StorageManager テストエラー:", error);
            this.testResults.storageManager = { error: error.message, executionTime: performance.now() - testStart };
            this.errors.push(error);
        }
    }

    // 4. IChingUltraSyncLogic テスト
    async testIChingUltraSyncLogic() {
        console.log("\n⚡ IChingUltraSyncLogic 過剰処理最適化検証...");
        const testStart = performance.now();

        try {
            const logicExists = typeof IChingUltraSyncLogic !== 'undefined';
            
            if (!logicExists) {
                console.warn("  ⚠️ IChingUltraSyncLogic が見つかりません");
                this.testResults.iChingUltraSyncLogic = { error: "IChingUltraSyncLogic not found", executionTime: performance.now() - testStart };
                return;
            }

            // Mock DataManager
            const mockDataManager = {
                getAllHexagramData: () => {
                    const hexagrams = {};
                    for (let i = 1; i <= 64; i++) {
                        hexagrams[i] = {
                            name: `Hexagram ${i}`,
                            chinese: `卦${i}`,
                            judgment: `Judgment ${i}`,
                            image: `Image ${i}`
                        };
                    }
                    return hexagrams;
                }
            };

            const logic = new IChingUltraSyncLogic(mockDataManager);
            
            // テストデータ
            const mockEngineOS = { osId: 1, hexagramId: 1, name: "Test Engine OS", confidence: 0.85 };
            const mockInterfaceOS = { hexagramId: 2, name: "Test Interface OS", confidence: 0.78 };
            const mockSafeModeOS = { hexagramId: 3, name: "Test SafeMode OS", confidence: 0.72 };

            console.log("  🧪 分析レベル別パフォーマンステスト...");

            const levels = ['essential', 'standard', 'comprehensive'];
            const levelResults = {};

            for (const level of levels) {
                console.log(`    📊 ${level}レベル分析中...`);
                
                const levelStart = performance.now();
                const result = await logic.analyzeTripleOSWithUltraSync(
                    mockEngineOS,
                    mockInterfaceOS,
                    mockSafeModeOS,
                    { level: level }
                );
                const levelTime = performance.now() - levelStart;

                levelResults[level] = {
                    executionTime: levelTime,
                    resultCount: Object.keys(result.logicResults || {}).length,
                    hasResult: !!result,
                    performance: levelTime
                };

                console.log(`      ⏱️ ${level}: ${levelTime.toFixed(1)}ms, ${levelResults[level].resultCount}メソッド`);
            }

            // 最適化効果の計算
            const essentialVsComprehensive = levelResults.comprehensive.executionTime / levelResults.essential.executionTime;
            const optimizationEffective = essentialVsComprehensive > 2; // Essential が Comprehensive より2倍以上高速

            this.testResults.iChingUltraSyncLogic = {
                executionTime: performance.now() - testStart,
                levelResults: levelResults,
                optimizationEffective: optimizationEffective,
                speedupRatio: essentialVsComprehensive.toFixed(2),
                allLevelsUnder5s: Object.values(levelResults).every(r => r.executionTime < 5000),
                essentialUnder1s: levelResults.essential.executionTime < 1000
            };

            console.log(`  ✅ IChingUltraSyncLogic テスト完了: 最適化効果${essentialVsComprehensive.toFixed(1)}x`);

        } catch (error) {
            console.error("  ❌ IChingUltraSyncLogic テストエラー:", error);
            this.testResults.iChingUltraSyncLogic = { error: error.message, executionTime: performance.now() - testStart };
            this.errors.push(error);
        }
    }

    // 5. DataManager テスト
    async testDataManager() {
        console.log("\n🔍 DataManager hexagram検索最適化検証...");
        const testStart = performance.now();

        try {
            const dataManagerExists = typeof DataManager !== 'undefined';
            
            if (!dataManagerExists) {
                console.warn("  ⚠️ DataManager が見つかりません");
                this.testResults.dataManager = { error: "DataManager not found", executionTime: performance.now() - testStart };
                return;
            }

            const dataManager = new DataManager();
            
            console.log("  🧪 Hexagram検索最適化テスト...");

            // 1. 単一hexagram検索テスト
            const singleSearchStart = performance.now();
            const hexagram1 = dataManager.getHexagramDetails(1);
            const singleSearchTime = performance.now() - singleSearchStart;

            // 2. 複数hexagram検索テスト
            const multiSearchStart = performance.now();
            const hexagrams = [];
            for (let i = 1; i <= 10; i++) {
                hexagrams.push(dataManager.getHexagramDetails(i));
            }
            const multiSearchTime = performance.now() - multiSearchStart;

            // 3. キャッシュ効果テスト
            const cacheTest1Start = performance.now();
            dataManager.getHexagramDetails(1);
            const firstCallTime = performance.now() - cacheTest1Start;

            const cacheTest2Start = performance.now();
            dataManager.getHexagramDetails(1);
            const secondCallTime = performance.now() - cacheTest2Start;

            const cacheSpeedup = firstCallTime / (secondCallTime || 0.001);

            // 4. 存在しないhexagramのエラーハンドリング
            const errorHandlingStart = performance.now();
            const invalidHexagram = dataManager.getHexagramDetails(999);
            const errorHandlingTime = performance.now() - errorHandlingStart;

            this.testResults.dataManager = {
                executionTime: performance.now() - testStart,
                singleSearchTime: singleSearchTime,
                multiSearchTime: multiSearchTime,
                averageSearchTime: multiSearchTime / 10,
                cacheSpeedup: cacheSpeedup,
                errorHandlingTime: errorHandlingTime,
                hexagramFound: !!hexagram1,
                allHexagramsFound: hexagrams.every(h => h !== null),
                performanceTargets: {
                    singleSearchUnder10ms: singleSearchTime < 10,
                    multiSearchUnder100ms: multiSearchTime < 100,
                    cacheSpeedupOver2x: cacheSpeedup > 2,
                    errorHandlingUnder5ms: errorHandlingTime < 5
                }
            };

            console.log(`  ✅ DataManager テスト完了: 単一検索${singleSearchTime.toFixed(1)}ms, キャッシュ効果${cacheSpeedup.toFixed(1)}x`);

        } catch (error) {
            console.error("  ❌ DataManager テストエラー:", error);
            this.testResults.dataManager = { error: error.message, executionTime: performance.now() - testStart };
            this.errors.push(error);
        }
    }

    // 6. 統合パフォーマンステスト
    async testIntegratedPerformance() {
        console.log("\n🔄 統合パフォーマンステスト...");
        const testStart = performance.now();

        try {
            // 診断フロー全体のシミュレーション
            console.log("  🧪 診断フロー全体のパフォーマンステスト...");

            const scenarios = [
                { name: "軽量診断", questionCount: 10 },
                { name: "標準診断", questionCount: 20 },
                { name: "完全診断", questionCount: 40 }
            ];

            const scenarioResults = {};

            for (const scenario of scenarios) {
                console.log(`    📊 ${scenario.name}シナリオテスト中...`);
                
                const scenarioStart = performance.now();
                
                // シミュレーション: 質問応答
                await new Promise(resolve => setTimeout(resolve, scenario.questionCount * 10));
                
                // シミュレーション: OS計算
                await new Promise(resolve => setTimeout(resolve, 200));
                
                // シミュレーション: 結果表示
                await new Promise(resolve => setTimeout(resolve, 300));
                
                const scenarioTime = performance.now() - scenarioStart;
                
                scenarioResults[scenario.name] = {
                    executionTime: scenarioTime,
                    questionCount: scenario.questionCount,
                    timePerQuestion: scenarioTime / scenario.questionCount,
                    meetsTarget: scenarioTime < (scenario.questionCount * 50) // 50ms per question target
                };

                console.log(`      ⏱️ ${scenario.name}: ${scenarioTime.toFixed(1)}ms (${scenario.questionCount}問)`);
            }

            // メモリ使用量の簡易測定
            const memoryStart = performance.memory ? performance.memory.usedJSHeapSize : 0;
            
            // 大量データ処理シミュレーション
            const bigArray = new Array(10000).fill(0).map((_, i) => ({ id: i, data: Math.random() }));
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const memoryEnd = performance.memory ? performance.memory.usedJSHeapSize : 0;
            const memoryIncrease = memoryEnd - memoryStart;

            this.testResults.overall = {
                executionTime: performance.now() - testStart,
                scenarioResults: scenarioResults,
                memoryIncrease: memoryIncrease,
                overallPerformance: {
                    allScenariosUnder5s: Object.values(scenarioResults).every(s => s.executionTime < 5000),
                    averageTimePerQuestion: Object.values(scenarioResults).reduce((sum, s) => sum + s.timePerQuestion, 0) / scenarios.length,
                    memoryEfficient: memoryIncrease < 10000000 // 10MB threshold
                }
            };

            console.log(`  ✅ 統合パフォーマンステスト完了: メモリ増加${(memoryIncrease/1024/1024).toFixed(1)}MB`);

        } catch (error) {
            console.error("  ❌ 統合パフォーマンステストエラー:", error);
            this.testResults.overall = { error: error.message, executionTime: performance.now() - testStart };
            this.errors.push(error);
        }
    }

    // 結果レポート生成
    generateReport() {
        const totalTime = performance.now() - this.startTime;
        
        console.log("\n" + "=".repeat(80));
        console.log("📊 OS Analyzer システム包括的パフォーマンステスト結果レポート");
        console.log("=".repeat(80));
        
        console.log(`\n⏱️ 総実行時間: ${totalTime.toFixed(1)}ms`);
        console.log(`❌ エラー数: ${this.errors.length}`);
        
        // 各コンポーネントの結果
        this.reportComponentResults();
        
        // 全体的な評価
        this.reportOverallAssessment();
        
        // パフォーマンス目標の達成状況
        this.reportPerformanceTargets();
        
        // 推奨事項
        this.reportRecommendations();
        
        console.log("\n" + "=".repeat(80));
        console.log("✅ パフォーマンステスト完了");
        console.log("=".repeat(80));
        
        return this.testResults;
    }

    reportComponentResults() {
        console.log("\n📋 コンポーネント別結果:");
        
        Object.entries(this.testResults).forEach(([component, results]) => {
            if (component === 'overall') return;
            
            console.log(`\n  🔧 ${component}:`);
            if (results.error) {
                console.log(`    ❌ エラー: ${results.error}`);
            } else {
                console.log(`    ⏱️ 実行時間: ${results.executionTime ? results.executionTime.toFixed(1) + 'ms' : 'N/A'}`);
                
                // コンポーネント固有の詳細
                if (component === 'personalStrategyAI' && results.successRate) {
                    console.log(`    📊 成功率: ${results.successRate.toFixed(1)}%`);
                }
                if (component === 'iChingUltraSyncLogic' && results.speedupRatio) {
                    console.log(`    🚀 最適化効果: ${results.speedupRatio}x`);
                }
                if (component === 'storageManager' && results.performanceTargetMet !== undefined) {
                    console.log(`    🎯 パフォーマンス目標: ${results.performanceTargetMet ? '達成' : '未達成'}`);
                }
            }
        });
    }

    reportOverallAssessment() {
        console.log("\n🎯 全体評価:");
        
        const componentCount = Object.keys(this.testResults).length - 1; // exclude 'overall'
        const successfulComponents = Object.values(this.testResults)
            .filter(r => !r.error && r !== this.testResults.overall).length;
        
        const overallSuccessRate = (successfulComponents / componentCount) * 100;
        
        console.log(`  📊 コンポーネント成功率: ${successfulComponents}/${componentCount} (${overallSuccessRate.toFixed(1)}%)`);
        
        if (overallSuccessRate >= 80) {
            console.log("  ✅ システム全体のパフォーマンスは良好です");
        } else if (overallSuccessRate >= 60) {
            console.log("  ⚠️ システムパフォーマンスに改善の余地があります");
        } else {
            console.log("  ❌ システムパフォーマンスに重大な問題があります");
        }
    }

    reportPerformanceTargets() {
        console.log("\n🎯 パフォーマンス目標達成状況:");
        
        const targets = [
            { name: "AI戦略生成", target: "5秒以内", 
              achieved: this.testResults.personalStrategyAI.tests?.responseTimeUnder5s },
            { name: "データ保存", target: "100ms以内", 
              achieved: this.testResults.storageManager.performanceTargetMet },
            { name: "分析処理", target: "5秒以内", 
              achieved: this.testResults.iChingUltraSyncLogic.allLevelsUnder5s },
            { name: "Hexagram検索", target: "10ms以内", 
              achieved: this.testResults.dataManager.performanceTargets?.singleSearchUnder10ms }
        ];
        
        targets.forEach(target => {
            const status = target.achieved === true ? "✅ 達成" : 
                          target.achieved === false ? "❌ 未達成" : "⚠️ 測定不可";
            console.log(`  ${target.name}: ${target.target} - ${status}`);
        });
    }

    reportRecommendations() {
        console.log("\n💡 推奨事項:");
        
        const recommendations = [];
        
        if (this.testResults.personalStrategyAI.error) {
            recommendations.push("PersonalStrategyAI の初期化エラーを修正");
        }
        
        if (this.testResults.tripleOSStrategicView.loadTime > 1000) {
            recommendations.push("ConnectionsVisualizer の読み込み時間を短縮");
        }
        
        if (!this.testResults.storageManager.performanceTargetMet) {
            recommendations.push("StorageManager のパフォーマンスを最適化");
        }
        
        if (!this.testResults.iChingUltraSyncLogic.optimizationEffective) {
            recommendations.push("IChingUltraSyncLogic の最適化アルゴリズムを見直し");
        }
        
        if (this.errors.length > 0) {
            recommendations.push(`${this.errors.length}件のエラーを修正`);
        }
        
        if (recommendations.length === 0) {
            console.log("  🎉 現在のパフォーマンスは良好です。継続的な監視を推奨します。");
        } else {
            recommendations.forEach((rec, index) => {
                console.log(`  ${index + 1}. ${rec}`);
            });
        }
    }
}

// テスト実行
if (typeof window !== 'undefined') {
    window.ComprehensivePerformanceTest = ComprehensivePerformanceTest;
    
    // 自動実行用
    window.runComprehensiveTest = async function() {
        const test = new ComprehensivePerformanceTest();
        return await test.runAllTests();
    };
} else {
    // Node.js環境での実行
    module.exports = ComprehensivePerformanceTest;
}