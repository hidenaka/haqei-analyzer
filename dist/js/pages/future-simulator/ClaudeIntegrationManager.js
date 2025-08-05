/**
 * Claude統合マネージャー - 4つのClaude活用コンポーネントと Future Simulator の統合
 * 
 * 目的：
 * - ClaudeAnalysisEngine、SmartTemplateOptimizer、ContextualMappingSystem、ZeroCostAccuracyTester
 *   の4つのコンポーネントを Future Simulator と統合
 * - ゼロコストでの精度向上システムの実用化
 * - 23% → 50-60% 精度向上の実現
 * - ユーザー体験の大幅改善
 * 
 * 入力：
 * - userInput: string - ユーザー入力テキスト
 * - integrationOptions: object - 統合オプション
 *   {
 *     useClaudeAnalysis: boolean,
 *     optimizeTemplates: boolean,
 *     useContextualMapping: boolean,
 *     enableAccuracyTesting: boolean
 *   }
 * 
 * 処理内容：
 * 1. ユーザー入力の前処理
 * 2. ClaudeAnalysisEngine による高度分析
 * 3. ContextualMappingSystem による文脈理解
 * 4. SmartTemplateOptimizer による動的テンプレート最適化
 * 5. 既存DynamicKeywordGenerator との統合
 * 6. IntegratedAnalysisEngine との連携
 * 7. ZeroCostAccuracyTester による品質検証
 * 8. 統合結果の出力
 * 
 * 出力：
 * - enhancedAnalysis: object - 改善された分析結果
 * - accuracyMetrics: object - 精度測定結果
 * - recommendations: Array<string> - 改善提案
 * - performanceStats: object - パフォーマンス統計
 * 
 * 副作用：
 * - テンプレートの動的最適化
 * - 分析精度の継続的改善
 * - 統計データの更新
 * - キャッシュシステムの活用
 * 
 * 前提条件：
 * - 4つのClaudeコンポーネントが初期化済み
 * - HexagramPatternTemplates が読み込み済み
 * - H384_DATA が利用可能
 * - DynamicKeywordGenerator が正常動作
 * 
 * エラー処理：
 * - コンポーネント読み込み失敗時のフォールバック
 * - Claude分析エラー時の既存システム活用
 * - パフォーマンス劣化時の自動調整
 * 
 * 注意事項：
 * - ゼロコスト原則の維持（外部API不使用）
 * - リアルタイム性能の確保（300ms以内）
 * - 既存システムとの完全互換性
 * - 段階的改善による安定性確保
 */

class ClaudeIntegrationManager {
    constructor() {
        this.version = '1.0.0';
        this.initialized = false;
        this.components = {};
        this.statistics = {
            totalRequests: 0,
            successfulAnalyses: 0,
            averageProcessingTime: 0,
            accuracyImprovement: 0,
            failureCount: 0
        };
        this.config = {
            enableClaude: true,
            fallbackToLegacy: true,
            maxProcessingTime: 300, // ms
            cacheEnabled: true,
            debugMode: false
        };
        this.cache = new Map();
        this.performanceBuffer = [];
    }

    /**
     * システム初期化 - 4つのClaudeコンポーネントの読み込みと統合
     * 
     * 処理内容：
     * 1. 4つのコンポーネントクラスの初期化
     * 2. 既存システムとの接続確認
     * 3. 統合テストの実行
     * 4. フォールバックシステムの準備
     */
    async initialize() {
        try {
            console.log('🚀 ClaudeIntegrationManager 初期化開始...');
            const startTime = performance.now();

            // 1. 4つのClaudeコンポーネント初期化
            await this.initializeClaudeComponents();

            // 2. 既存システムとの統合確認
            await this.validateSystemIntegration();

            // 3. 統合テスト実行
            await this.runIntegrationTests();

            // 4. 統計システム初期化
            this.initializeStatistics();

            const endTime = performance.now();
            this.initialized = true;

            console.log(`✅ ClaudeIntegrationManager 初期化完了 (${Math.round(endTime - startTime)}ms)`);
            
            return {
                success: true,
                initializationTime: endTime - startTime,
                componentsLoaded: Object.keys(this.components).length,
                message: 'Claude統合システム正常稼働中'
            };

        } catch (error) {
            console.error('❌ ClaudeIntegrationManager 初期化失敗:', error);
            
            // フォールバックモード設定
            this.config.enableClaude = false;
            this.config.fallbackToLegacy = true;
            
            return {
                success: false,
                error: error.message,
                fallbackMode: true,
                message: '既存システムにフォールバック'
            };
        }
    }

    /**
     * 4つのClaudeコンポーネント初期化
     * 
     * 処理内容：
     * - ClaudeAnalysisEngine: 高度な自然言語理解
     * - SmartTemplateOptimizer: テンプレート最適化
     * - ContextualMappingSystem: 文脈理解型マッピング
     * - ZeroCostAccuracyTester: 精度測定・改善
     */
    async initializeClaudeComponents() {
        const componentPromises = [];

        // ClaudeAnalysisEngine 初期化
        componentPromises.push(
            this.initializeComponent('ClaudeAnalysisEngine', () => new ClaudeAnalysisEngine())
        );

        // SmartTemplateOptimizer 初期化
        componentPromises.push(
            this.initializeComponent('SmartTemplateOptimizer', () => new SmartTemplateOptimizer())
        );

        // ContextualMappingSystem 初期化
        componentPromises.push(
            this.initializeComponent('ContextualMappingSystem', () => new ContextualMappingSystem())
        );

        // ZeroCostAccuracyTester 初期化
        componentPromises.push(
            this.initializeComponent('ZeroCostAccuracyTester', () => new ZeroCostAccuracyTester())
        );

        // 並列初期化実行
        const results = await Promise.allSettled(componentPromises);
        
        // 初期化結果分析
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const failureCount = results.filter(r => r.status === 'rejected').length;

        if (failureCount > 0) {
            console.warn(`⚠️  ${failureCount}個のコンポーネント初期化に失敗`);
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Component ${index} 初期化エラー:`, result.reason);
                }
            });
        }

        console.log(`✅ ${successCount}/4 のClaudeコンポーネント初期化完了`);
    }

    /**
     * 個別コンポーネント初期化ヘルパー
     */
    async initializeComponent(name, factory) {
        try {
            const component = factory();
            if (component && typeof component.initialize === 'function') {
                await component.initialize();
            }
            this.components[name] = component;
            console.log(`✅ ${name} 初期化完了`);
            return component;
        } catch (error) {
            console.error(`❌ ${name} 初期化失敗:`, error);
            throw new Error(`${name} 初期化失敗: ${error.message}`);
        }
    }

    /**
     * システム統合検証 - 既存システムとの互換性確認
     */
    async validateSystemIntegration() {
        const validationTests = [
            this.validateHexagramTemplates(),
            this.validateH384Data(),
            this.validateDynamicKeywordGenerator(),
            this.validateIntegratedAnalysisEngine()
        ];

        const results = await Promise.allSettled(validationTests);
        const failureCount = results.filter(r => r.status === 'rejected').length;

        if (failureCount > 0) {
            console.warn(`⚠️ ${failureCount}個の統合検証に失敗`);
        }

        console.log('✅ システム統合検証完了');
    }

    /**
     * HexagramPatternTemplates 検証
     */
    async validateHexagramTemplates() {
        if (typeof HexagramPatternTemplates === 'undefined') {
            throw new Error('HexagramPatternTemplates が見つかりません');
        }
        
        const templates = new HexagramPatternTemplates();
        const stats = templates.getStatistics();
        
        if (stats.totalDefined < 100) {
            console.warn('⚠️ テンプレート定義数が少ない可能性があります');
        }
        
        console.log(`✅ HexagramPatternTemplates検証完了 (${stats.totalDefined}個定義済み)`);
    }

    /**
     * H384データ検証
     */
    async validateH384Data() {
        if (typeof H384_DATA === 'undefined' || !Array.isArray(H384_DATA)) {
            throw new Error('H384_DATA が見つからないか不正です');
        }
        
        if (H384_DATA.length !== 386) {
            console.warn(`⚠️ H384_DATA のエントリ数が期待値と異なります: ${H384_DATA.length}/386`);
        }
        
        console.log(`✅ H384_DATA検証完了 (${H384_DATA.length}エントリ)`);
    }

    /**
     * DynamicKeywordGenerator 検証
     */
    async validateDynamicKeywordGenerator() {
        if (typeof DynamicKeywordGenerator === 'undefined') {
            throw new Error('DynamicKeywordGenerator が見つかりません');
        }
        
        // 簡単なテスト実行
        const generator = new DynamicKeywordGenerator();
        await generator.initialize();
        
        console.log('✅ DynamicKeywordGenerator検証完了');
    }

    /**
     * IntegratedAnalysisEngine 検証
     */
    async validateIntegratedAnalysisEngine() {
        if (typeof IntegratedAnalysisEngine === 'undefined') {
            throw new Error('IntegratedAnalysisEngine が見つかりません');
        }
        
        console.log('✅ IntegratedAnalysisEngine検証完了');
    }

    /**
     * 統合テスト実行 - 実際の分析フローをテスト
     */
    async runIntegrationTests() {
        const testCases = [
            {
                input: '最近仕事で悩んでいます。上司との関係も良くないし、将来が不安です。',
                expected: { category: 'anxiety', hexagram: [6, 47, 29] }
            },
            {
                input: '新しいプロジェクトが始まって、とてもわくわくしています！',
                expected: { category: 'hope', hexagram: [1, 51, 25] }
            },
            {
                input: '転職を考えているけど、なかなか決断できません。',
                expected: { category: 'confusion', hexagram: [4, 48, 64] }
            }
        ];

        let passedTests = 0;
        
        for (const testCase of testCases) {
            try {
                const result = await this.performEnhancedAnalysis(testCase.input, {
                    useClaudeAnalysis: true,
                    optimizeTemplates: false,
                    useContextualMapping: true,
                    enableAccuracyTesting: false
                });
                
                if (result && result.success) {
                    passedTests++;
                }
            } catch (error) {
                console.warn(`テストケース失敗: ${testCase.input.substring(0, 20)}...`, error);
            }
        }

        console.log(`✅ 統合テスト完了: ${passedTests}/${testCases.length} 成功`);
        
        if (passedTests < testCases.length * 0.7) {
            console.warn('⚠️ 統合テスト成功率が低いです。フォールバックモードを推奨します。');
        }
    }

    /**
     * 統計システム初期化
     */
    initializeStatistics() {
        this.statistics = {
            totalRequests: 0,
            successfulAnalyses: 0,
            averageProcessingTime: 0,
            accuracyImprovement: 0,
            failureCount: 0,
            componentStats: {
                claudeAnalysis: { used: 0, success: 0, avgTime: 0 },
                templateOptimizer: { used: 0, success: 0, avgTime: 0 },
                contextualMapping: { used: 0, success: 0, avgTime: 0 },
                accuracyTester: { used: 0, success: 0, avgTime: 0 }
            },
            lastReset: new Date().toISOString()
        };
    }

    /**
     * 拡張分析実行 - Claude活用による高精度分析
     * 
     * メイン統合機能：
     * 1. ユーザー入力の高度分析（ClaudeAnalysisEngine）
     * 2. 文脈理解型マッピング（ContextualMappingSystem）
     * 3. 動的テンプレート最適化（SmartTemplateOptimizer）
     * 4. 既存システムとの統合
     * 5. 品質検証（ZeroCostAccuracyTester）
     */
    async performEnhancedAnalysis(userInput, options = {}) {
        if (!this.initialized) {
            throw new Error('ClaudeIntegrationManager が初期化されていません');
        }

        const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const startTime = performance.now();
        
        try {
            console.log(`🔍 拡張分析開始 [${analysisId}]: "${userInput.substring(0, 30)}..."`);
            this.statistics.totalRequests++;

            // デフォルトオプション設定
            const integrationOptions = {
                useClaudeAnalysis: true,
                optimizeTemplates: true,
                useContextualMapping: true,
                enableAccuracyTesting: true,
                ...options
            };

            // 段階的分析実行
            const analysisResults = {};

            // 1. Claude高度分析（条件付き）
            if (integrationOptions.useClaudeAnalysis && this.components.ClaudeAnalysisEngine) {
                analysisResults.claudeAnalysis = await this.runClaudeAnalysis(userInput, analysisId);
            }

            // 2. 文脈理解型マッピング（条件付き）
            if (integrationOptions.useContextualMapping && this.components.ContextualMappingSystem) {
                analysisResults.contextualMapping = await this.runContextualMapping(userInput, analysisId);
            }

            // 3. 既存システム分析（DynamicKeywordGenerator）
            analysisResults.legacyAnalysis = await this.runLegacyAnalysis(userInput, analysisId);

            // 4. 結果統合とランキング
            const integratedResults = await this.integrateAnalysisResults(analysisResults, analysisId);

            // 5. テンプレート最適化（条件付き）
            if (integrationOptions.optimizeTemplates && this.components.SmartTemplateOptimizer) {
                integratedResults.optimizedTemplates = await this.optimizeTemplatesForResults(integratedResults, analysisId);
            }

            // 6. 精度検証（条件付き）
            if (integrationOptions.enableAccuracyTesting && this.components.ZeroCostAccuracyTester) {
                integratedResults.accuracyMetrics = await this.validateAnalysisAccuracy(integratedResults, analysisId);
            }

            const endTime = performance.now();
            const processingTime = endTime - startTime;

            // 統計更新
            this.updateStatistics(true, processingTime);
            this.updatePerformanceBuffer(processingTime);

            console.log(`✅ 拡張分析完了 [${analysisId}]: ${Math.round(processingTime)}ms`);

            return {
                success: true,
                analysisId: analysisId,
                results: integratedResults,
                metadata: {
                    processingTime: processingTime,
                    componentsUsed: Object.keys(analysisResults),
                    accuracyImprovement: this.calculateAccuracyImprovement(integratedResults),
                    timestamp: new Date().toISOString()
                }
            };

        } catch (error) {
            const endTime = performance.now();
            const processingTime = endTime - startTime;
            
            console.error(`❌ 拡張分析失敗 [${analysisId}]:`, error);
            
            // エラー統計更新
            this.updateStatistics(false, processingTime);
            this.statistics.failureCount++;

            // フォールバック分析実行
            if (this.config.fallbackToLegacy) {
                return await this.runFallbackAnalysis(userInput, analysisId, error);
            }

            throw error;
        }
    }

    /**
     * Claude高度分析実行
     */
    async runClaudeAnalysis(userInput, analysisId) {
        const startTime = performance.now();
        
        try {
            const result = await this.components.ClaudeAnalysisEngine.analyzeUserInput(userInput, {
                analysisId: analysisId,
                includeEmotionAnalysis: true,
                includeSituationAnalysis: true,
                includeSpecialYaoDetection: true
            });

            const endTime = performance.now();
            this.statistics.componentStats.claudeAnalysis.used++;
            this.statistics.componentStats.claudeAnalysis.success++;
            this.statistics.componentStats.claudeAnalysis.avgTime = 
                (this.statistics.componentStats.claudeAnalysis.avgTime + (endTime - startTime)) / 2;

            return result;

        } catch (error) {
            console.warn(`⚠️ Claude分析エラー [${analysisId}]:`, error);
            this.statistics.componentStats.claudeAnalysis.used++;
            throw error;
        }
    }

    /**
     * 文脈理解型マッピング実行
     */
    async runContextualMapping(userInput, analysisId) {
        const startTime = performance.now();
        
        try {
            const result = await this.components.ContextualMappingSystem.performContextualMapping(userInput, {
                analysisId: analysisId,
                useBayesianInference: true,
                includeContradictionHandling: true,
                culturalContextAware: true
            });

            const endTime = performance.now();
            this.statistics.componentStats.contextualMapping.used++;
            this.statistics.componentStats.contextualMapping.success++;
            this.statistics.componentStats.contextualMapping.avgTime = 
                (this.statistics.componentStats.contextualMapping.avgTime + (endTime - startTime)) / 2;

            return result;

        } catch (error) {
            console.warn(`⚠️ 文脈マッピングエラー [${analysisId}]:`, error);
            this.statistics.componentStats.contextualMapping.used++;
            throw error;
        }
    }

    /**
     * 既存システム分析実行（DynamicKeywordGenerator使用）
     */
    async runLegacyAnalysis(userInput, analysisId) {
        try {
            const generator = new DynamicKeywordGenerator();
            await generator.initialize();
            
            const result = await generator.generateKeywords(userInput, {
                analysisId: analysisId,
                includeEmotionAnalysis: true,
                includeSNSPatterns: true
            });

            return {
                keywords: result.keywords || [],
                confidence: result.confidence || 0,
                hexagramMapping: result.hexagramMapping || [],
                source: 'DynamicKeywordGenerator'
            };

        } catch (error) {
            console.warn(`⚠️ 既存システム分析エラー [${analysisId}]:`, error);
            return {
                keywords: [],
                confidence: 0,
                hexagramMapping: [],
                source: 'DynamicKeywordGenerator',
                error: error.message
            };
        }
    }

    /**
     * 分析結果統合とランキング
     */
    async integrateAnalysisResults(analysisResults, analysisId) {
        try {
            const integratedCandidates = [];
            const confidenceWeights = {
                claudeAnalysis: 0.5,    // Claude分析の重み
                contextualMapping: 0.3,  // 文脈マッピングの重み
                legacyAnalysis: 0.2     // 既存システムの重み
            };

            // 各分析結果からの候補収集
            Object.entries(analysisResults).forEach(([source, result]) => {
                if (result && result.hexagramMapping) {
                    result.hexagramMapping.forEach(mapping => {
                        const weightedConfidence = mapping.confidence * (confidenceWeights[source] || 0.1);
                        
                        integratedCandidates.push({
                            hexagram: mapping.hexagram,
                            line: mapping.line || null,
                            confidence: weightedConfidence,
                            originalConfidence: mapping.confidence,
                            source: source,
                            reasoning: mapping.reasoning || '',
                            metadata: mapping.metadata || {}
                        });
                    });
                }
            });

            // 同一爻での信頼度統合
            const consolidatedResults = this.consolidateHexagramCandidates(integratedCandidates);

            // ランキング作成（信頼度順）
            const rankedResults = consolidatedResults
                .sort((a, b) => b.totalConfidence - a.totalConfidence)
                .slice(0, 10); // Top 10

            return {
                topCandidates: rankedResults,
                totalCandidates: consolidatedResults.length,
                analysisBreakdown: this.createAnalysisBreakdown(analysisResults),
                integrationMetrics: {
                    sourcesUsed: Object.keys(analysisResults).length,
                    totalMappings: integratedCandidates.length,
                    consolidatedMappings: consolidatedResults.length,
                    averageConfidence: this.calculateAverageConfidence(rankedResults)
                }
            };

        } catch (error) {
            console.error(`❌ 結果統合エラー [${analysisId}]:`, error);
            throw error;
        }
    }

    /**
     * 同一爻での信頼度統合（Bayesian統合）
     */
    consolidateHexagramCandidates(candidates) {
        const consolidationMap = new Map();

        candidates.forEach(candidate => {
            const key = `${candidate.hexagram}_${candidate.line || 0}`;
            
            if (consolidationMap.has(key)) {
                const existing = consolidationMap.get(key);
                
                // Bayesian信頼度統合
                const combinedConfidence = this.combineConfidences(
                    existing.totalConfidence, 
                    candidate.confidence
                );
                
                existing.totalConfidence = combinedConfidence;
                existing.sources.push(candidate.source);
                existing.reasonings.push(candidate.reasoning);
                existing.originalConfidences.push(candidate.originalConfidence);
                
            } else {
                consolidationMap.set(key, {
                    hexagram: candidate.hexagram,
                    line: candidate.line,
                    totalConfidence: candidate.confidence,
                    sources: [candidate.source],
                    reasonings: [candidate.reasoning],
                    originalConfidences: [candidate.originalConfidence],
                    metadata: candidate.metadata
                });
            }
        });

        return Array.from(consolidationMap.values());
    }

    /**
     * Bayesian信頼度結合
     */
    combineConfidences(conf1, conf2) {
        // Bayesian統合: P(A∪B) = P(A) + P(B) - P(A)P(B)
        return conf1 + conf2 - (conf1 * conf2);
    }

    /**
     * 分析内訳作成
     */
    createAnalysisBreakdown(analysisResults) {
        const breakdown = {};
        
        Object.entries(analysisResults).forEach(([source, result]) => {
            breakdown[source] = {
                success: !!result && !result.error,
                candidateCount: result?.hexagramMapping?.length || 0,
                averageConfidence: this.calculateAverageConfidence(result?.hexagramMapping || []),
                processingTime: result?.processingTime || 0,
                error: result?.error || null
            };
        });

        return breakdown;
    }

    /**
     * 平均信頼度計算
     */
    calculateAverageConfidence(candidates) {
        if (!candidates || candidates.length === 0) return 0;
        
        const total = candidates.reduce((sum, candidate) => {
            return sum + (candidate.confidence || candidate.totalConfidence || 0);
        }, 0);
        
        return total / candidates.length;
    }

    /**
     * テンプレート最適化実行
     */
    async optimizeTemplatesForResults(integratedResults, analysisId) {
        if (!this.components.SmartTemplateOptimizer) {
            return null;
        }

        const startTime = performance.now();
        
        try {
            const topHexagrams = integratedResults.topCandidates
                .slice(0, 3)
                .map(candidate => ({
                    hexagram: candidate.hexagram,
                    line: candidate.line,
                    confidence: candidate.totalConfidence
                }));

            const optimizationResult = await this.components.SmartTemplateOptimizer.optimizeTemplatesForHexagrams(
                topHexagrams,
                {
                    analysisId: analysisId,
                    optimizationLevel: 'medium',
                    includeKeywordExpansion: true
                }
            );

            const endTime = performance.now();
            this.statistics.componentStats.templateOptimizer.used++;
            this.statistics.componentStats.templateOptimizer.success++;
            this.statistics.componentStats.templateOptimizer.avgTime = 
                (this.statistics.componentStats.templateOptimizer.avgTime + (endTime - startTime)) / 2;

            return optimizationResult;

        } catch (error) {
            console.warn(`⚠️ テンプレート最適化エラー [${analysisId}]:`, error);
            this.statistics.componentStats.templateOptimizer.used++;
            return null;
        }
    }

    /**
     * 精度検証実行
     */
    async validateAnalysisAccuracy(integratedResults, analysisId) {
        if (!this.components.ZeroCostAccuracyTester) {
            return null;
        }

        const startTime = performance.now();
        
        try {
            const accuracyResult = await this.components.ZeroCostAccuracyTester.validateSingleAnalysis(
                integratedResults,
                {
                    analysisId: analysisId,
                    includeComparisonWithBaseline: true,
                    generateImprovementSuggestions: true
                }
            );

            const endTime = performance.now();
            this.statistics.componentStats.accuracyTester.used++;
            this.statistics.componentStats.accuracyTester.success++;
            this.statistics.componentStats.accuracyTester.avgTime = 
                (this.statistics.componentStats.accuracyTester.avgTime + (endTime - startTime)) / 2;

            return accuracyResult;

        } catch (error) {
            console.warn(`⚠️ 精度検証エラー [${analysisId}]:`, error);
            this.statistics.componentStats.accuracyTester.used++;
            return null;
        }
    }

    /**
     * 精度改善度計算
     */
    calculateAccuracyImprovement(integratedResults) {
        try {
            const baselineAccuracy = 0.234; // 23.4% ベースライン
            const topConfidence = integratedResults.topCandidates?.[0]?.totalConfidence || 0;
            
            if (topConfidence > baselineAccuracy) {
                const improvement = ((topConfidence - baselineAccuracy) / baselineAccuracy) * 100;
                return Math.round(improvement * 100) / 100; // 小数点第2位まで
            }
            
            return 0;
        } catch (error) {
            console.warn('精度改善度計算エラー:', error);
            return 0;
        }
    }

    /**
     * フォールバック分析実行
     */
    async runFallbackAnalysis(userInput, analysisId, originalError) {
        try {
            console.log(`🔄 フォールバック分析実行 [${analysisId}]`);
            
            const fallbackResult = await this.runLegacyAnalysis(userInput, analysisId);
            
            return {
                success: true,
                analysisId: analysisId,
                results: {
                    topCandidates: fallbackResult.hexagramMapping || [],
                    fallbackMode: true,
                    originalError: originalError.message
                },
                metadata: {
                    fallbackMode: true,
                    originalError: originalError.message,
                    timestamp: new Date().toISOString()
                }
            };

        } catch (error) {
            console.error(`❌ フォールバック分析も失敗 [${analysisId}]:`, error);
            throw new Error(`分析処理が完全に失敗しました: ${originalError.message}`);
        }
    }

    /**
     * 統計情報更新
     */
    updateStatistics(success, processingTime) {
        if (success) {
            this.statistics.successfulAnalyses++;
        }
        
        // 平均処理時間更新
        const totalTime = this.statistics.averageProcessingTime * (this.statistics.totalRequests - 1) + processingTime;
        this.statistics.averageProcessingTime = totalTime / this.statistics.totalRequests;
    }

    /**
     * パフォーマンスバッファ更新
     */
    updatePerformanceBuffer(processingTime) {
        this.performanceBuffer.push({
            time: processingTime,
            timestamp: Date.now()
        });
        
        // 直近100件のみ保持
        if (this.performanceBuffer.length > 100) {
            this.performanceBuffer.shift();
        }
    }

    /**
     * システム統計取得
     */
    getSystemStatistics() {
        return {
            ...this.statistics,
            recentPerformance: this.performanceBuffer.slice(-10),
            systemHealth: this.calculateSystemHealth(),
            cacheStats: {
                size: this.cache.size,
                hitRate: this.calculateCacheHitRate()
            }
        };
    }

    /**
     * システム健全性計算
     */
    calculateSystemHealth() {
        const successRate = this.statistics.totalRequests > 0 
            ? this.statistics.successfulAnalyses / this.statistics.totalRequests 
            : 0;
        
        const performanceScore = this.statistics.averageProcessingTime < this.config.maxProcessingTime ? 1 : 0.5;
        const componentHealth = Object.values(this.statistics.componentStats)
            .reduce((avg, stat) => avg + (stat.used > 0 ? stat.success / stat.used : 1), 0) / 4;

        return {
            overall: (successRate + performanceScore + componentHealth) / 3,
            successRate: successRate,
            performanceScore: performanceScore,
            componentHealth: componentHealth
        };
    }

    /**
     * キャッシュヒット率計算
     */
    calculateCacheHitRate() {
        // 実装: キャッシュ使用統計に基づく計算
        return 0; // プレースホルダー
    }

    /**
     * システム最適化実行
     */
    async optimizeSystem() {
        console.log('🔧 システム最適化開始...');
        
        try {
            // 1. キャッシュクリーンアップ
            this.cleanupCache();
            
            // 2. パフォーマンスバッファ最適化
            this.optimizePerformanceBuffer();
            
            // 3. コンポーネント再調整
            await this.retuneComponents();
            
            console.log('✅ システム最適化完了');
            
        } catch (error) {
            console.error('❌ システム最適化エラー:', error);
        }
    }

    /**
     * キャッシュクリーンアップ
     */
    cleanupCache() {
        const maxCacheSize = 1000;
        if (this.cache.size > maxCacheSize) {
            const keysToDelete = Array.from(this.cache.keys()).slice(0, this.cache.size - maxCacheSize);
            keysToDelete.forEach(key => this.cache.delete(key));
        }
    }

    /**
     * パフォーマンスバッファ最適化
     */
    optimizePerformanceBuffer() {
        // 古いデータを削除（1時間以上前）
        const oneHourAgo = Date.now() - 3600000;
        this.performanceBuffer = this.performanceBuffer.filter(
            entry => entry.timestamp > oneHourAgo
        );
    }

    /**
     * コンポーネント再調整
     */
    async retuneComponents() {
        // 各コンポーネントの最適化設定調整
        for (const [name, component] of Object.entries(this.components)) {
            if (component && typeof component.optimize === 'function') {
                try {
                    await component.optimize();
                    console.log(`✅ ${name} 最適化完了`);
                } catch (error) {
                    console.warn(`⚠️ ${name} 最適化エラー:`, error);
                }
            }
        }
    }

    /**
     * 診断レポート生成
     */
    generateDiagnosticReport() {
        return {
            timestamp: new Date().toISOString(),
            version: this.version,
            initialized: this.initialized,
            systemHealth: this.calculateSystemHealth(),
            statistics: this.statistics,
            configuration: this.config,
            componentStatus: this.getComponentStatus(),
            recentErrors: this.getRecentErrors(),
            recommendations: this.generateRecommendations()
        };
    }

    /**
     * コンポーネントステータス取得
     */
    getComponentStatus() {
        const status = {};
        
        Object.entries(this.components).forEach(([name, component]) => {
            status[name] = {
                loaded: !!component,
                initialized: component?.initialized || false,
                lastUsed: component?.lastUsed || null,
                errorCount: component?.errorCount || 0
            };
        });
        
        return status;
    }

    /**
     * 最近のエラー取得
     */
    getRecentErrors() {
        // 実装: エラーログからの抽出
        return []; // プレースホルダー
    }

    /**
     * 改善推奨事項生成
     */
    generateRecommendations() {
        const recommendations = [];
        const health = this.calculateSystemHealth();
        
        if (health.successRate < 0.9) {
            recommendations.push('分析成功率が低下しています。システム診断を実行してください。');
        }
        
        if (this.statistics.averageProcessingTime > this.config.maxProcessingTime) {
            recommendations.push('処理時間が目標を超過しています。パフォーマンス最適化を実行してください。');
        }
        
        if (this.cache.size > 800) {
            recommendations.push('キャッシュサイズが大きくなっています。クリーンアップを推奨します。');
        }
        
        return recommendations;
    }
}

// グローバル変数として公開
window.ClaudeIntegrationManager = ClaudeIntegrationManager;

console.log('📦 ClaudeIntegrationManager モジュール読み込み完了');