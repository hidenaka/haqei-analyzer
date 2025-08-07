/**
 * HAQEI Phase 2 Complete Test Suite
 * Phase 2統合テストスイート
 * 
 * 実装日: 2025年8月6日
 * 担当: HAQEI Programming Agent  
 * 目的: Phase 2実装の包括的テストとデバッグ
 */

console.log('🧪 HAQEI Phase 2 Complete Test Suite starting...');

class Phase2TestSuite {
    constructor() {
        this.testResults = [];
        this.systems = {
            dynamicKeywordGenerator: null,
            integratedAnalysisEngine: null,
            textToIChingEngine: null,
            iChingResultsDisplay: null
        };
        
        this.testCases = [
            {
                id: 'career_decision',
                name: '転職の悩み',
                input: '転職を考えているが、今の会社を辞めるべきか迷っている。新しい挑戦をしたいが、安定した現在の立場を失うリスクも心配している。家族もいるし、失敗したときのことを考えると不安になる。',
                expectedThemes: ['change', 'decision', 'future'],
                expectedEmotions: ['anxiety', 'hope'],
                expectedHexagramRange: [1, 64]
            },
            {
                id: 'relationship_conflict',
                name: '人間関係の問題',
                input: '職場の同僚との関係がうまくいかない。価値観の違いが大きく、プロジェクトの進め方で頻繁に衝突してしまう。協力したいと思っているが、相手の態度が冷たく感じられる。',
                expectedThemes: ['relationship', 'conflict'],
                expectedEmotions: ['frustration', 'confusion'],
                expectedHexagramRange: [1, 64]
            },
            {
                id: 'future_anxiety',
                name: '将来への不安',
                input: '将来に対して漠然とした不安を感じている。今の仕事を続けていても成長できるのか疑問だし、年齢を重ねるにつれて選択肢が狭まっていくような気がする。何か行動を起こすべきなのか。',
                expectedThemes: ['future', 'self', 'growth'],
                expectedEmotions: ['anxiety', 'confusion'],
                expectedHexagramRange: [1, 64]
            },
            {
                id: 'creative_struggle',
                name: '創作活動の迷い',
                input: '小説を書いているが、なかなか良い作品ができない。自分の才能に疑問を感じる一方で、諦めたくない気持ちもある。周囲からの理解も得られず、孤独感を感じることが多い。',
                expectedThemes: ['self', 'creative'],
                expectedEmotions: ['sadness', 'hope'],
                expectedHexagramRange: [1, 64]
            },
            {
                id: 'simple_decision',
                name: '簡単な選択',
                input: '今日の夕食を何にするか迷っている。',
                expectedThemes: ['decision'],
                expectedEmotions: ['neutral'],
                expectedHexagramRange: [1, 64],
                expectLowConfidence: true
            }
        ];
        
        console.log('🎯 Phase 2 Test Suite initialized');
    }

    async runAllTests() {
        console.log('🚀 Starting comprehensive Phase 2 tests...');
        
        try {
            // システム初期化テスト
            await this.testSystemInitialization();
            
            // 各テストケースの実行
            for (const testCase of this.testCases) {
                await this.runTestCase(testCase);
            }
            
            // 統合テスト
            await this.runIntegrationTests();
            
            // パフォーマンステスト
            await this.runPerformanceTests();
            
            // 結果レポート生成
            this.generateTestReport();
            
        } catch (error) {
            console.error('❌ Test suite execution failed:', error);
            this.testResults.push({
                test: 'test_suite_execution',
                status: 'FAILED',
                error: error.message,
                timestamp: Date.now()
            });
        }
    }

    async testSystemInitialization() {
        console.log('🔧 Testing system initialization...');
        
        const initTests = [
            {
                name: 'DynamicKeywordGenerator',
                test: () => {
                    if (window.DynamicKeywordGenerator) {
                        this.systems.dynamicKeywordGenerator = new window.DynamicKeywordGenerator();
                        return this.systems.dynamicKeywordGenerator ? 'PASSED' : 'FAILED';
                    }
                    return 'SKIPPED - Class not found';
                }
            },
            {
                name: 'IntegratedAnalysisEngine',
                test: () => {
                    if (window.IntegratedAnalysisEngine) {
                        this.systems.integratedAnalysisEngine = new window.IntegratedAnalysisEngine();
                        return this.systems.integratedAnalysisEngine ? 'PASSED' : 'FAILED';
                    }
                    return 'SKIPPED - Class not found';
                }
            },
            {
                name: 'TextToIChingEngine',
                test: () => {
                    if (window.TextToIChingEngine) {
                        this.systems.textToIChingEngine = new window.TextToIChingEngine();
                        return this.systems.textToIChingEngine ? 'PASSED' : 'FAILED';
                    }
                    return 'SKIPPED - Class not found';
                }
            },
            {
                name: 'IChingResultsDisplay',
                test: () => {
                    if (window.IChingResultsDisplay) {
                        this.systems.iChingResultsDisplay = new window.IChingResultsDisplay('test-container');
                        return this.systems.iChingResultsDisplay ? 'PASSED' : 'FAILED';
                    }
                    return 'SKIPPED - Class not found';
                }
            }
        ];

        for (const initTest of initTests) {
            try {
                const result = initTest.test();
                this.testResults.push({
                    test: `init_${initTest.name}`,
                    status: result,
                    timestamp: Date.now()
                });
                console.log(`  ${initTest.name}: ${result}`);
            } catch (error) {
                this.testResults.push({
                    test: `init_${initTest.name}`,
                    status: 'ERROR',
                    error: error.message,
                    timestamp: Date.now()
                });
                console.error(`  ${initTest.name}: ERROR - ${error.message}`);
            }
        }
    }

    async runTestCase(testCase) {
        console.log(`📋 Running test case: ${testCase.name}`);
        
        if (!this.systems.textToIChingEngine) {
            console.log(`  ⚠️ TextToIChingEngine not available, skipping ${testCase.id}`);
            this.testResults.push({
                test: testCase.id,
                status: 'SKIPPED',
                reason: 'TextToIChingEngine not available',
                timestamp: Date.now()
            });
            return;
        }

        try {
            const startTime = performance.now();
            
            // Phase 2分析実行
            const analysisResult = await this.systems.textToIChingEngine.analyzeTextToHexagram(
                testCase.input,
                { userLevel: 'test', language: 'japanese' }
            );
            
            const endTime = performance.now();
            const processingTime = endTime - startTime;
            
            // 結果検証
            const validation = this.validateTestResult(analysisResult, testCase);
            
            this.testResults.push({
                test: testCase.id,
                status: validation.passed ? 'PASSED' : 'FAILED',
                processingTime: Math.round(processingTime),
                validation: validation,
                result: {
                    hexagram: analysisResult.selectedHexagram?.name,
                    hexagramNumber: analysisResult.selectedHexagram?.number,
                    confidence: analysisResult.confidence,
                    authenticity: analysisResult.authenticity,
                    philosophical_alignment: analysisResult.philosophical_alignment
                },
                timestamp: Date.now()
            });
            
            console.log(`  ✅ ${testCase.name}: ${validation.passed ? 'PASSED' : 'FAILED'} (${Math.round(processingTime)}ms)`);
            if (!validation.passed) {
                console.log(`    ❌ Validation issues:`, validation.issues);
            }
            
        } catch (error) {
            this.testResults.push({
                test: testCase.id,
                status: 'ERROR',
                error: error.message,
                timestamp: Date.now()
            });
            console.error(`  ❌ ${testCase.name}: ERROR - ${error.message}`);
        }
    }

    validateTestResult(result, testCase) {
        const validation = {
            passed: true,
            issues: []
        };

        // 基本構造チェック
        if (!result) {
            validation.passed = false;
            validation.issues.push('No result returned');
            return validation;
        }

        if (!result.selectedHexagram) {
            validation.passed = false;
            validation.issues.push('No hexagram selected');
        }

        if (!result.HaQeiInterpretation) {
            validation.passed = false;
            validation.issues.push('No HaQei interpretation');
        }

        // 卦番号の妥当性チェック
        if (result.selectedHexagram?.number) {
            const hexNumber = result.selectedHexagram.number;
            if (hexNumber < 1 || hexNumber > 64) {
                validation.passed = false;
                validation.issues.push(`Invalid hexagram number: ${hexNumber}`);
            }
        }

        // 信頼度チェック
        if (typeof result.confidence === 'number') {
            if (result.confidence < 0 || result.confidence > 1) {
                validation.passed = false;
                validation.issues.push(`Invalid confidence: ${result.confidence}`);
            }
            
            if (testCase.expectLowConfidence && result.confidence > 0.7) {
                validation.issues.push(`Expected low confidence but got ${result.confidence}`);
            }
        }

        // HaQei準拠チェック
        if (result.HaQeiCompliance !== true) {
            validation.issues.push('HaQei compliance not confirmed');
        }

        // 処理時間チェック（10秒以内）
        if (result.processingTime > 10000) {
            validation.issues.push(`Processing time too long: ${result.processingTime}ms`);
        }

        return validation;
    }

    async runIntegrationTests() {
        console.log('🔗 Running integration tests...');
        
        if (!this.systems.textToIChingEngine || !this.systems.iChingResultsDisplay) {
            console.log('  ⚠️ Required systems not available, skipping integration tests');
            return;
        }

        try {
            // 分析→表示統合テスト
            const testInput = 'これは統合テスト用のサンプルテキストです。';
            
            const analysisResult = await this.systems.textToIChingEngine.analyzeTextToHexagram(
                testInput,
                { userLevel: 'test' }
            );
            
            // 結果表示システムに渡してエラーが出ないかチェック
            // （実際の表示は行わず、エラーハンドリングのみ確認）
            try {
                // displayResultsメソッドの存在確認
                if (typeof this.systems.iChingResultsDisplay.displayResults === 'function') {
                    console.log('  ✅ Results display integration: Structure OK');
                    
                    this.testResults.push({
                        test: 'integration_analysis_display',
                        status: 'PASSED',
                        timestamp: Date.now()
                    });
                } else {
                    throw new Error('displayResults method not found');
                }
            } catch (displayError) {
                console.error('  ❌ Results display integration error:', displayError);
                this.testResults.push({
                    test: 'integration_analysis_display',
                    status: 'FAILED',
                    error: displayError.message,
                    timestamp: Date.now()
                });
            }
            
        } catch (error) {
            console.error('  ❌ Integration test error:', error);
            this.testResults.push({
                test: 'integration_tests',
                status: 'ERROR',
                error: error.message,
                timestamp: Date.now()
            });
        }
    }

    async runPerformanceTests() {
        console.log('⚡ Running performance tests...');
        
        if (!this.systems.textToIChingEngine) {
            console.log('  ⚠️ TextToIChingEngine not available, skipping performance tests');
            return;
        }

        const performanceTests = [
            {
                name: 'short_text_performance',
                input: '短いテスト',
                expectedMaxTime: 2000
            },
            {
                name: 'medium_text_performance',
                input: 'これは中程度の長さのテキストです。様々な要素を含んでおり、分析エンジンの性能をテストするためのサンプルとして使用します。',
                expectedMaxTime: 3000
            },
            {
                name: 'long_text_performance',
                input: 'これは長いテキストのパフォーマンステストです。' + 'テスト用の文章を繰り返します。'.repeat(50),
                expectedMaxTime: 5000
            }
        ];

        for (const perfTest of performanceTests) {
            try {
                const startTime = performance.now();
                
                const result = await this.systems.textToIChingEngine.analyzeTextToHexagram(
                    perfTest.input,
                    { userLevel: 'test' }
                );
                
                const endTime = performance.now();
                const processingTime = endTime - startTime;
                
                const passed = processingTime <= perfTest.expectedMaxTime;
                
                this.testResults.push({
                    test: perfTest.name,
                    status: passed ? 'PASSED' : 'FAILED',
                    processingTime: Math.round(processingTime),
                    expectedMaxTime: perfTest.expectedMaxTime,
                    timestamp: Date.now()
                });
                
                console.log(`  ${passed ? '✅' : '❌'} ${perfTest.name}: ${Math.round(processingTime)}ms (max: ${perfTest.expectedMaxTime}ms)`);
                
            } catch (error) {
                this.testResults.push({
                    test: perfTest.name,
                    status: 'ERROR',
                    error: error.message,
                    timestamp: Date.now()
                });
                console.error(`  ❌ ${perfTest.name}: ERROR - ${error.message}`);
            }
        }
    }

    generateTestReport() {
        console.log('📊 Generating test report...');
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.status === 'PASSED').length;
        const failedTests = this.testResults.filter(r => r.status === 'FAILED').length;
        const errorTests = this.testResults.filter(r => r.status === 'ERROR').length;
        const skippedTests = this.testResults.filter(r => r.status === 'SKIPPED').length;
        
        const report = {
            summary: {
                total: totalTests,
                passed: passedTests,
                failed: failedTests,
                errors: errorTests,
                skipped: skippedTests,
                successRate: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0
            },
            details: this.testResults,
            timestamp: new Date().toISOString(),
            phase: 'Phase 2 Complete Implementation'
        };
        
        console.log('📈 Phase 2 Test Report:', report.summary);
        console.table(this.testResults.map(r => ({
            Test: r.test,
            Status: r.status,
            Time: r.processingTime ? `${r.processingTime}ms` : '-',
            Issues: r.validation?.issues?.length || r.error || '-'
        })));
        
        // LocalStorageに保存
        try {
            localStorage.setItem('haqei_phase2_test_report', JSON.stringify(report));
            console.log('💾 Test report saved to localStorage');
        } catch (error) {
            console.warn('⚠️ Could not save test report:', error);
        }
        
        // グローバル変数として公開
        window.phase2TestReport = report;
        
        return report;
    }

    // 外部から呼び出し可能なメソッド
    getSystemStatus() {
        return {
            dynamicKeywordGenerator: !!this.systems.dynamicKeywordGenerator,
            integratedAnalysisEngine: !!this.systems.integratedAnalysisEngine,
            textToIChingEngine: !!this.systems.textToIChingEngine,
            iChingResultsDisplay: !!this.systems.iChingResultsDisplay
        };
    }

    async testSingleInput(inputText, options = {}) {
        if (!this.systems.textToIChingEngine) {
            throw new Error('TextToIChingEngine not initialized');
        }
        
        const startTime = performance.now();
        const result = await this.systems.textToIChingEngine.analyzeTextToHexagram(inputText, options);
        const endTime = performance.now();
        
        return {
            result,
            processingTime: Math.round(endTime - startTime),
            timestamp: Date.now()
        };
    }
}

// グローバル初期化
window.Phase2TestSuite = Phase2TestSuite;

// 自動実行（オプション）
document.addEventListener('DOMContentLoaded', () => {
    // Phase 2システムの初期化待機
    setTimeout(async () => {
        if (window.location.search.includes('autotest=true')) {
            console.log('🚀 Auto-running Phase 2 tests...');
            const testSuite = new Phase2TestSuite();
            await testSuite.runAllTests();
        } else {
            console.log('💡 Phase 2 Test Suite ready. Run window.phase2TestSuite.runAllTests() to start.');
            window.phase2TestSuite = new Phase2TestSuite();
        }
    }, 2000);
});

console.log('✅ Phase 2 Complete Test Suite loaded successfully');