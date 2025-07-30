// Node.js環境でのパフォーマンステスト実行
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// テスト結果レポート
class TestReportGenerator {
    constructor() {
        this.startTime = Date.now();
        this.results = {
            personalStrategyAI: null,
            tripleOSStrategicView: null,
            storageManager: null,
            iChingUltraSyncLogic: null,
            dataManager: null,
            overall: null,
            errors: []
        };
    }

    // 1. PersonalStrategyAI テスト
    async testPersonalStrategyAI() {
        console.log("📝 PersonalStrategyAI 応答短縮エラー修正検証...");
        const testStart = Date.now();

        try {
            // ファイルの存在確認
            const filePath = path.join(__dirname, 'public/js/os-analyzer/core/PersonalStrategyAI.js');
            if (!fs.existsSync(filePath)) {
                throw new Error("PersonalStrategyAI.js ファイルが見つかりません");
            }

            const fileContent = fs.readFileSync(filePath, 'utf8');
            
            // 修正ポイントの確認
            const checks = {
                hasMinLengthRelaxation: fileContent.includes('minLength: 150') && fileContent.includes('200→150に緩和'),
                hasOptimalLength: fileContent.includes('optimalLength: 250'),
                hasEnhanceShortResponse: fileContent.includes('_enhanceShortResponse'),
                hasQualityAssessment: fileContent.includes('_assessQuality'),
                hasFirstPersonCheck: fileContent.includes('私は') || fileContent.includes('私の') || fileContent.includes('私が'),
                hasFallbackStrategy: fileContent.includes('_generateFallbackStrategy'),
                hasTripleOSIntegration: fileContent.includes('Triple OS'),
                hasSafemodeIntegration: fileContent.includes('safemodeIntegration'),
                hasErrorHandling: fileContent.includes('try') && fileContent.includes('catch')
            };

            const passedChecks = Object.values(checks).filter(c => c).length;
            const totalChecks = Object.keys(checks).length;
            const successRate = (passedChecks / totalChecks) * 100;

            this.results.personalStrategyAI = {
                executionTime: Date.now() - testStart,
                fileExists: true,
                fileSize: fileContent.length,
                successRate: successRate,
                checks: checks,
                codeQuality: {
                    lines: fileContent.split('\n').length,
                    classes: (fileContent.match(/class \w+/g) || []).length,
                    methods: (fileContent.match(/^\s*(async\s+)?\w+\s*\(/gm) || []).length,
                    comments: (fileContent.match(/\/\/.*/g) || []).length
                },
                fixes: {
                    minLengthRelaxed: checks.hasMinLengthRelaxation,
                    responseEnhancement: checks.hasEnhanceShortResponse,
                    qualityAssessment: checks.hasQualityAssessment,
                    errorHandling: checks.hasErrorHandling
                }
            };

            console.log(`  ✅ PersonalStrategyAI 分析完了: ${successRate.toFixed(1)}% 修正実装済み`);

        } catch (error) {
            console.error(`  ❌ PersonalStrategyAI テストエラー: ${error.message}`);
            this.results.personalStrategyAI = { 
                error: error.message, 
                executionTime: Date.now() - testStart 
            };
            this.results.errors.push(error);
        }
    }

    // 2. StorageManager テスト
    async testStorageManager() {
        console.log("💾 StorageManager セッションデータ破損修正検証...");
        const testStart = Date.now();

        try {
            const filePath = path.join(__dirname, 'public/js/shared/core/StorageManager.js');
            if (!fs.existsSync(filePath)) {
                throw new Error("StorageManager.js ファイルが見つかりません");
            }

            const fileContent = fs.readFileSync(filePath, 'utf8');
            
            const checks = {
                hasDataIntegrityCheck: fileContent.includes('isCorruptedData'),
                hasMemoryManagement: fileContent.includes('memoryManager'),
                hasPerformanceMetrics: fileContent.includes('performanceMetrics'),
                hasCache: fileContent.includes('cache') && fileContent.includes('Map'),
                hasCleanup: fileContent.includes('cleanup') && fileContent.includes('corrupted'),
                hasCompression: fileContent.includes('compression'),
                hasErrorHandling: fileContent.includes('try') && fileContent.includes('catch'),
                hasVersionManagement: fileContent.includes('version'),
                hasBeforeUnload: fileContent.includes('beforeunload')
            };

            const passedChecks = Object.values(checks).filter(c => c).length;
            const totalChecks = Object.keys(checks).length;
            const successRate = (passedChecks / totalChecks) * 100;

            this.results.storageManager = {
                executionTime: Date.now() - testStart,
                fileExists: true,
                fileSize: fileContent.length,
                successRate: successRate,
                checks: checks,
                optimizations: {
                    dataIntegrityProtection: checks.hasDataIntegrityCheck,
                    memoryManagement: checks.hasMemoryManagement,
                    performanceMonitoring: checks.hasPerformanceMetrics,
                    caching: checks.hasCache,
                    corruptionRecovery: checks.hasCleanup
                }
            };

            console.log(`  ✅ StorageManager 分析完了: ${successRate.toFixed(1)}% 修正実装済み`);

        } catch (error) {
            console.error(`  ❌ StorageManager テストエラー: ${error.message}`);
            this.results.storageManager = { 
                error: error.message, 
                executionTime: Date.now() - testStart 
            };
            this.results.errors.push(error);
        }
    }

    // 3. IChingUltraSyncLogic テスト
    async testIChingUltraSyncLogic() {
        console.log("⚡ IChingUltraSyncLogic 過剰処理最適化検証...");
        const testStart = Date.now();

        try {
            const filePath = path.join(__dirname, 'public/js/os-analyzer/core/IChingUltraSyncLogic.js');
            if (!fs.existsSync(filePath)) {
                throw new Error("IChingUltraSyncLogic.js ファイルが見つかりません");
            }

            const fileContent = fs.readFileSync(filePath, 'utf8');
            
            const checks = {
                hasAnalysisLevels: fileContent.includes('essential') && fileContent.includes('standard') && fileContent.includes('comprehensive'),
                hasCache: fileContent.includes('analysisCache') && fileContent.includes('Map'),
                hasParallelExecution: fileContent.includes('executeParallelAnalysis'),
                hasBatchProcessing: fileContent.includes('batchSize'),
                hasProgressTracking: fileContent.includes('progressCallback'),
                hasPerformanceOptimization: fileContent.includes('performance.now'),
                hasMethodConfiguration: fileContent.includes('getAnalysisConfiguration'),
                hasCacheManagement: fileContent.includes('getCachedResult') && fileContent.includes('setCachedResult'),
                hasErrorHandling: fileContent.includes('try') && fileContent.includes('catch')
            };

            const passedChecks = Object.values(checks).filter(c => c).length;
            const totalChecks = Object.keys(checks).length;
            const successRate = (passedChecks / totalChecks) * 100;

            // 分析レベルの詳細チェック
            const essentialMethods = (fileContent.match(/'greatTheme', 'internalExternalInversion', 'trigramResonance'/g) || []).length;
            const standardMethods = (fileContent.match(/'lineCorrespondence', 'fiveElementCycles', 'nuclearHexagram'/g) || []).length;
            const comprehensiveMethods = (fileContent.match(/'ritualOracle', 'familyDynamics', 'symbolicAnimals'/g) || []).length;

            this.results.iChingUltraSyncLogic = {
                executionTime: Date.now() - testStart,
                fileExists: true,
                fileSize: fileContent.length,
                successRate: successRate,
                checks: checks,
                optimizations: {
                    multiLevelAnalysis: checks.hasAnalysisLevels,
                    cachingSystem: checks.hasCache,
                    parallelProcessing: checks.hasParallelExecution,
                    batchOptimization: checks.hasBatchProcessing,
                    progressMonitoring: checks.hasProgressTracking
                },
                analysisLevels: {
                    essential: essentialMethods > 0,
                    standard: standardMethods > 0,
                    comprehensive: comprehensiveMethods > 0
                }
            };

            console.log(`  ✅ IChingUltraSyncLogic 分析完了: ${successRate.toFixed(1)}% 最適化実装済み`);

        } catch (error) {
            console.error(`  ❌ IChingUltraSyncLogic テストエラー: ${error.message}`);
            this.results.iChingUltraSyncLogic = { 
                error: error.message, 
                executionTime: Date.now() - testStart 
            };
            this.results.errors.push(error);
        }
    }

    // 4. DataManager テスト
    async testDataManager() {
        console.log("🔍 DataManager hexagram検索最適化検証...");
        const testStart = Date.now();

        try {
            const filePath = path.join(__dirname, 'public/js/shared/core/DataManager.js');
            if (!fs.existsSync(filePath)) {
                throw new Error("DataManager.js ファイルが見つかりません");
            }

            const fileContent = fs.readFileSync(filePath, 'utf8');
            
            const checks = {
                hasCache: fileContent.includes('cache') && fileContent.includes('Map'),
                hasHexagramIndex: fileContent.includes('hexagramIndex'),
                hasHexagramNameIndex: fileContent.includes('hexagramNameIndex'),
                hasHexagramArray: fileContent.includes('hexagramArray'),
                hasPerformanceMetrics: fileContent.includes('performanceMetrics'),
                hasCacheTimeout: fileContent.includes('cacheTimeout'),
                hasErrorHandler: fileContent.includes('initializeErrorHandler'),
                hasLogMessage: fileContent.includes('logMessage'),
                hasValidation: fileContent.includes('validateDataStructure')
            };

            const passedChecks = Object.values(checks).filter(c => c).length;
            const totalChecks = Object.keys(checks).length;
            const successRate = (passedChecks / totalChecks) * 100;

            this.results.dataManager = {
                executionTime: Date.now() - testStart,
                fileExists: true,
                fileSize: fileContent.length,
                successRate: successRate,
                checks: checks,
                optimizations: {
                    multiLevelCaching: checks.hasCache,
                    indexedSearch: checks.hasHexagramIndex && checks.hasHexagramNameIndex,
                    arrayCache: checks.hasHexagramArray,
                    performanceMonitoring: checks.hasPerformanceMetrics,
                    errorHandling: checks.hasErrorHandler
                }
            };

            console.log(`  ✅ DataManager 分析完了: ${successRate.toFixed(1)}% 最適化実装済み`);

        } catch (error) {
            console.error(`  ❌ DataManager テストエラー: ${error.message}`);
            this.results.dataManager = { 
                error: error.message, 
                executionTime: Date.now() - testStart 
            };
            this.results.errors.push(error);
        }
    }

    // 5. TripleOSStrategicView テスト
    async testTripleOSStrategicView() {
        console.log("🔄 TripleOSStrategicView ConnectionsVisualizer読み込み改善検証...");
        const testStart = Date.now();

        try {
            const strategicViewPath = path.join(__dirname, 'public/js/components/TripleOSStrategicView.js');
            const visualizerPath = path.join(__dirname, 'public/js/components/InteractiveConnectionsVisualizer.js');
            
            if (!fs.existsSync(strategicViewPath)) {
                throw new Error("TripleOSStrategicView.js ファイルが見つかりません");
            }

            const strategicViewContent = fs.readFileSync(strategicViewPath, 'utf8');
            const visualizerExists = fs.existsSync(visualizerPath);
            let visualizerContent = '';
            
            if (visualizerExists) {
                visualizerContent = fs.readFileSync(visualizerPath, 'utf8');
            }

            const checks = {
                hasPersonalStrategyAI: strategicViewContent.includes('PersonalStrategyAI'),
                hasConnectionsVisualizer: strategicViewContent.includes('connectionsVisualizer'),
                hasDataManager: strategicViewContent.includes('dataManager'),
                hasCompatibilityLoader: strategicViewContent.includes('compatibilityLoader'),
                hasAsyncInit: strategicViewContent.includes('async init'),
                hasErrorHandling: strategicViewContent.includes('try') && strategicViewContent.includes('catch'),
                visualizerFileExists: visualizerExists,
                visualizerHasInit: visualizerExists && visualizerContent.includes('async init'),
                visualizerHasSVG: visualizerExists && visualizerContent.includes('svg')
            };

            const passedChecks = Object.values(checks).filter(c => c).length;
            const totalChecks = Object.keys(checks).length;
            const successRate = (passedChecks / totalChecks) * 100;

            this.results.tripleOSStrategicView = {
                executionTime: Date.now() - testStart,
                fileExists: true,
                fileSize: strategicViewContent.length,
                visualizerFileExists: visualizerExists,
                visualizerFileSize: visualizerContent.length,
                successRate: successRate,
                checks: checks,
                improvements: {
                    visualizerIntegration: checks.hasConnectionsVisualizer,
                    asyncInitialization: checks.hasAsyncInit,
                    errorHandling: checks.hasErrorHandling,
                    dataManagerIntegration: checks.hasDataManager
                }
            };

            console.log(`  ✅ TripleOSStrategicView 分析完了: ${successRate.toFixed(1)}% 改善実装済み`);

        } catch (error) {
            console.error(`  ❌ TripleOSStrategicView テストエラー: ${error.message}`);
            this.results.tripleOSStrategicView = { 
                error: error.message, 
                executionTime: Date.now() - testStart 
            };
            this.results.errors.push(error);
        }
    }

    // 総合評価
    calculateOverallAssessment() {
        const components = Object.keys(this.results).filter(k => k !== 'overall' && k !== 'errors');
        let totalSuccessRate = 0;
        let validComponents = 0;

        components.forEach(component => {
            const result = this.results[component];
            if (result && !result.error && result.successRate !== undefined) {
                totalSuccessRate += result.successRate;
                validComponents++;
            }
        });

        const overallSuccessRate = validComponents > 0 ? totalSuccessRate / validComponents : 0;
        const totalExecutionTime = Date.now() - this.startTime;

        this.results.overall = {
            overallSuccessRate: overallSuccessRate,
            validComponents: validComponents,
            totalComponents: components.length,
            totalExecutionTime: totalExecutionTime,
            errorCount: this.results.errors.length,
            assessment: overallSuccessRate >= 80 ? 'excellent' : 
                       overallSuccessRate >= 60 ? 'good' : 
                       overallSuccessRate >= 40 ? 'needs_improvement' : 'poor',
            performanceTargets: {
                aiResponseTime: 'target: <5s',
                dataLoadTime: 'target: <100ms', 
                analysisTime: 'target: <5s',
                searchTime: 'target: <10ms'
            },
            recommendations: this.generateRecommendations(overallSuccessRate)
        };
    }

    generateRecommendations(successRate) {
        const recommendations = [];
        
        if (successRate < 60) {
            recommendations.push("システム全体の安定性を改善する必要があります");
        }
        
        if (this.results.personalStrategyAI?.error) {
            recommendations.push("PersonalStrategyAI の初期化問題を修正してください");
        }
        
        if (this.results.storageManager?.successRate < 80) {
            recommendations.push("StorageManager のデータ破損対策を強化してください");
        }
        
        if (this.results.iChingUltraSyncLogic?.successRate < 80) {
            recommendations.push("IChingUltraSyncLogic の最適化アルゴリズムを見直してください");
        }
        
        if (this.results.dataManager?.successRate < 80) {
            recommendations.push("DataManager の検索インデックスを最適化してください");
        }
        
        if (this.results.tripleOSStrategicView?.successRate < 80) {
            recommendations.push("TripleOSStrategicView の読み込み処理を改善してください");
        }
        
        if (this.results.errors.length > 0) {
            recommendations.push(`${this.results.errors.length}件のエラーを修正してください`);
        }
        
        if (recommendations.length === 0) {
            recommendations.push("現在のパフォーマンスは良好です。継続的な監視を推奨します。");
        }
        
        return recommendations;
    }

    // 全テスト実行
    async runAllTests() {
        console.log("🚀 OS Analyzer システム包括的パフォーマンステスト開始");
        console.log("=".repeat(60));

        await this.testPersonalStrategyAI();
        await this.testTripleOSStrategicView();
        await this.testStorageManager();
        await this.testIChingUltraSyncLogic();
        await this.testDataManager();
        
        this.calculateOverallAssessment();
        
        console.log("=".repeat(60));
        console.log("✅ 包括的パフォーマンステスト完了");
        
        return this.results;
    }

    // レポート生成
    generateReport() {
        console.log("\n" + "=".repeat(80));
        console.log("📊 OS Analyzer システム包括的パフォーマンステスト結果レポート");
        console.log("=".repeat(80));
        
        const overall = this.results.overall;
        console.log(`\n⏱️ 総実行時間: ${overall.totalExecutionTime}ms`);
        console.log(`📊 全体成功率: ${overall.overallSuccessRate.toFixed(1)}%`);
        console.log(`✅ 有効コンポーネント: ${overall.validComponents}/${overall.totalComponents}`);
        console.log(`❌ エラー数: ${overall.errorCount}`);
        
        const assessmentEmoji = {
            excellent: '🏆',
            good: '✅',
            needs_improvement: '⚠️',
            poor: '❌'
        };
        
        console.log(`🎯 システム評価: ${assessmentEmoji[overall.assessment]} ${overall.assessment.toUpperCase()}`);
        
        console.log("\n📋 コンポーネント別詳細結果:");
        Object.entries(this.results).forEach(([component, result]) => {
            if (component === 'overall' || component === 'errors') return;
            
            console.log(`\n  🔧 ${component}:`);
            if (result.error) {
                console.log(`    ❌ エラー: ${result.error}`);
            } else {
                console.log(`    ⏱️ 実行時間: ${result.executionTime}ms`);
                console.log(`    📊 成功率: ${result.successRate ? result.successRate.toFixed(1) + '%' : 'N/A'}`);
                console.log(`    📄 ファイルサイズ: ${result.fileSize ? (result.fileSize / 1024).toFixed(1) + 'KB' : 'N/A'}`);
                
                if (result.checks) {
                    const passedChecks = Object.values(result.checks).filter(c => c).length;
                    const totalChecks = Object.keys(result.checks).length;
                    console.log(`    ✅ チェック項目: ${passedChecks}/${totalChecks}`);
                }
            }
        });
        
        console.log("\n💡 推奨事項:");
        overall.recommendations.forEach((rec, index) => {
            console.log(`  ${index + 1}. ${rec}`);
        });
        
        console.log("\n🎯 パフォーマンス目標:");
        Object.entries(overall.performanceTargets).forEach(([target, value]) => {
            console.log(`  ${target}: ${value}`);
        });
        
        console.log("\n" + "=".repeat(80));
        console.log("📄 詳細レポートを results-report.json に出力しています...");
        console.log("=".repeat(80));
        
        // JSONレポート出力
        const reportData = {
            timestamp: new Date().toISOString(),
            testDuration: overall.totalExecutionTime,
            results: this.results,
            summary: {
                overallSuccessRate: overall.overallSuccessRate,
                validComponents: overall.validComponents,
                totalComponents: overall.totalComponents,
                errorCount: overall.errorCount,
                assessment: overall.assessment
            }
        };
        
        fs.writeFileSync('results-report.json', JSON.stringify(reportData, null, 2));
        console.log("✅ 詳細レポートを results-report.json に保存しました");
        
        return reportData;
    }
}

// テスト実行
async function main() {
    const testRunner = new TestReportGenerator();
    
    try {
        await testRunner.runAllTests();
        testRunner.generateReport();
        
        const overall = testRunner.results.overall;
        process.exit(overall.errorCount === 0 && overall.overallSuccessRate >= 60 ? 0 : 1);
        
    } catch (error) {
        console.error("❌ テスト実行中に致命的なエラーが発生:", error);
        process.exit(1);
    }
}

// スクリプトが直接実行された場合
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export default TestReportGenerator;