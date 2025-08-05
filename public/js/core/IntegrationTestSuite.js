/**
 * 統合テストスイート - HAQEI Future Simulator 統合システム検証
 * 
 * 目的：
 * - IntegratedTransformationOrchestratorの包括的テスト
 * - 各コンポーネント統合の精度確認
 * - パフォーマンス検証（1秒以内目標）
 * - エラー処理とフォールバック機能テスト
 * - bunenjin哲学実装の検証
 * 
 * テストカバレッジ：
 * - 統合精度テスト（7変化パターン計算精度）
 * - メタファー生成品質テスト
 * - 適応的表示正確性テスト
 * - エラー処理・フォールバック機能テスト
 * - パフォーマンステスト（応答時間・メモリ使用量）
 * - システム間データ整合性テスト
 * 
 * Author: Quality Assurance Team
 * Created: 2025-08-04
 * Testing Philosophy: 品質保証とbunenjin哲学の統合
 */

class IntegrationTestSuite {
  constructor() {
    console.log('🧪 統合テストスイート初期化開始');
    
    this.version = "1.0.0-comprehensive";
    this.testPhilosophy = "bunenjin-quality-assurance";
    this.testStatus = "ready";
    
    // テスト結果追跡
    this.testResults = {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      testSuites: {},
      startTime: null,
      endTime: null,
      overallResult: 'pending'
    };
    
    // パフォーマンス測定
    this.performanceBenchmarks = {
      responseTimeTarget: 1000, // 1秒目標
      memoryUsageLimit: 50, // MB
      cacheHitRateTarget: 0.7,
      accuracyThreshold: 0.8
    };
    
    // テストデータセット
    this.testDatasets = this.initializeTestDatasets();
    
    // エラーシナリオ
    this.errorScenarios = this.initializeErrorScenarios();
    
    // 品質評価基準
    this.qualityStandards = this.initializeQualityStandards();
    
    console.log('✅ 統合テストスイート初期化完了');
  }

  /**
   * テストデータセット初期化
   */
  initializeTestDatasets() {
    return {
      // 基本的な悩みパターン
      basicConcerns: [
        {
          name: "仕事の悩み_高緊急度",
          input: {
            userInput: "明日までにプロジェクトを完成させなければならないが、進捗が遅れている。どうすればよいか？",
            userProfile: { experienceLevel: '初心者' },
            emotionalContext: { intensity: 0.8, primary: 'anxiety' },
            contextualAnalysis: { confidence: 0.7 }
          },
          expected: {
            concernType: 'work',
            urgencyLevel: 'high',
            patterns: ['change', 'progress'],
            responseTime: 1000
          }
        },
        {
          name: "恋愛の悩み_中緊急度",
          input: {
            userInput: "恋人との関係がうまくいかない。相手の気持ちがわからず不安になる。",
            userProfile: { experienceLevel: '中級者' },
            emotionalContext: { intensity: 0.6, primary: 'sadness' },
            contextualAnalysis: { confidence: 0.8 }
          },
          expected: {
            concernType: 'love',
            urgencyLevel: 'medium',
            patterns: ['reversed', 'mutual'],
            responseTime: 1000
          }
        },
        {
          name: "人生の方向性_低緊急度",
          input: {
            userInput: "将来どのような人生を歩めばよいか、長期的な視点で考えたい。",
            userProfile: { experienceLevel: '上級者' },
            emotionalContext: { intensity: 0.4, primary: 'contemplative' },
            contextualAnalysis: { confidence: 0.9 }
          },
          expected: {
            concernType: 'growth',
            urgencyLevel: 'low',
            patterns: ['sequence', 'progress'],
            responseTime: 1000
          }
        }
      ],

      // エッジケース
      edgeCases: [
        {
          name: "空の入力",
          input: {
            userInput: "",
            userProfile: null,
            emotionalContext: null,
            contextualAnalysis: null
          },
          expected: {
            shouldFail: true,
            errorType: "ValidationError"
          }
        },
        {
          name: "非常に長い入力",
          input: {
            userInput: "あ".repeat(3000),
            userProfile: { experienceLevel: '初心者' },
            emotionalContext: { intensity: 0.5, primary: 'neutral' },
            contextualAnalysis: { confidence: 0.5 }
          },
          expected: {
            shouldFail: true,
            errorType: "ValidationError"
          }
        },
        {
          name: "特殊文字を含む入力",
          input: {
            userInput: "仕事で問題が発生！@#$%^&*()_+{}|:<>?[]\\;'\".,/`~",
            userProfile: { experienceLevel: '初心者' },
            emotionalContext: { intensity: 0.7, primary: 'stress' },
            contextualAnalysis: { confidence: 0.6 }
          },
          expected: {
            concernType: 'work',
            urgencyLevel: 'high',
            shouldSucceed: true
          }
        }
      ],

      // パフォーマンステスト用
      performanceTests: [
        {
          name: "同時実行テスト",
          concurrent: 10,
          input: {
            userInput: "仕事と家庭の両立で悩んでいます。",
            userProfile: { experienceLevel: '中級者' },
            emotionalContext: { intensity: 0.6, primary: 'stress' },
            contextualAnalysis: { confidence: 0.7 }
          }
        },
        {
          name: "メモリ使用量テスト",
          iterations: 100,
          input: {
            userInput: "人生について深く考えたい。",
            userProfile: { experienceLevel: '上級者' },
            emotionalContext: { intensity: 0.5, primary: 'contemplative' },
            contextualAnalysis: { confidence: 0.8 }
          }
        }
      ]
    };
  }

  /**
   * エラーシナリオ初期化
   */
  initializeErrorScenarios() {
    return {
      componentFailures: [
        {
          name: "ConcernClassifier失敗",
          mockFailure: 'concernClassifier',
          input: {
            userInput: "仕事で困っています。",
            userProfile: { experienceLevel: '初心者' }
          },
          expectedBehavior: 'フォールバック実行'
        },
        {
          name: "PatternEngine失敗", 
          mockFailure: 'patternEngine',
          input: {
            userInput: "恋愛で悩んでいます。",
            userProfile: { experienceLevel: '中級者' }
          },
          expectedBehavior: 'フォールバック実行'
        },
        {
          name: "MetaphorEngine失敗",
          mockFailure: 'metaphorEngine',
          input: {
            userInput: "将来が不安です。",
            userProfile: { experienceLevel: '上級者' }
          },
          expectedBehavior: 'フォールバック実行'
        }
      ],
      
      networkIssues: [
        {
          name: "タイムアウト",
          scenario: 'timeout',
          duration: 5000
        },
        {
          name: "メモリ不足",
          scenario: 'memory_pressure',
          intensity: 'high'
        }
      ]
    };
  }

  /**
   * 品質評価基準初期化
   */
  initializeQualityStandards() {
    return {
      accuracy: {
        concernClassification: 0.85,
        patternCalculation: 0.90,
        metaphorRelevance: 0.80,
        displayAdaptation: 0.85
      },
      performance: {
        maxResponseTime: 1000,
        maxMemoryUsage: 50,
        minCacheHitRate: 0.70,
        maxErrorRate: 0.05
      },
      bunenjinPhilosophy: {
        multipleViews: true,
        paradoxAcceptance: true,
        tripleOSIntegration: true,
        wisdomIntegration: 0.80
      },
      userExperience: {
        insightfulnessScore: 0.80,
        actionabilityScore: 0.85,
        clarityScore: 0.80,
        relevanceScore: 0.85
      }
    };
  }

  /**
   * 包括的統合テスト実行
   */
  async runComprehensiveTests() {
    console.log('🚀 包括的統合テスト開始');
    this.testResults.startTime = new Date();
    
    try {
      // システム初期化確認
      const systemReady = await this.verifySystemInitialization();
      if (!systemReady) {
        throw new Error('システム初期化が不完全です');
      }
      
      // テストスイート実行
      console.log('📋 1. 基本機能テスト実行');
      await this.runBasicFunctionalityTests();
      
      console.log('⚡ 2. パフォーマンステスト実行');
      await this.runPerformanceTests();
      
      console.log('🛠️ 3. エラー処理テスト実行');
      await this.runErrorHandlingTests();
      
      console.log('🎯 4. 精度・品質テスト実行');
      await this.runAccuracyTests();
      
      console.log('🧘 5. bunenjin哲学統合テスト実行');
      await this.runBunenjinPhilosophyTests();
      
      console.log('🔄 6. システム統合テスト実行');
      await this.runSystemIntegrationTests();
      
      // テスト結果分析
      await this.analyzeTestResults();
      
      this.testResults.endTime = new Date();
      this.testResults.overallResult = this.calculateOverallResult();
      
      console.log('✅ 包括的統合テスト完了');
      return this.generateTestReport();
      
    } catch (error) {
      console.error('❌ 統合テスト実行エラー:', error);
      this.testResults.overallResult = 'error';
      this.testResults.endTime = new Date();
      return this.generateErrorReport(error);
    }
  }

  /**
   * システム初期化確認
   */
  async verifySystemInitialization() {
    console.log('🔍 システム初期化確認中...');
    
    try {
      // IntegratedTransformationOrchestratorの存在確認
      if (typeof IntegratedTransformationOrchestrator === 'undefined') {
        console.error('❌ IntegratedTransformationOrchestrator未利用可能');
        return false;
      }
      
      // システムインスタンス作成
      this.orchestrator = new IntegratedTransformationOrchestrator();
      
      // 初期化完了まで待機
      let attempts = 0;
      while (this.orchestrator.systemStatus === 'initializing' && attempts < 50) {
        await this.sleep(100);
        attempts++;
      }
      
      if (this.orchestrator.systemStatus === 'initializing') {
        console.warn('⚠️ システム初期化タイムアウト');
        return false;
      }
      
      console.log('✅ システム初期化確認完了');
      console.log('📊 システム状態:', this.orchestrator.systemHealth);
      
      return true;
      
    } catch (error) {
      console.error('❌ システム初期化確認エラー:', error);
      return false;
    }
  }

  /**
   * 基本機能テスト
   */
  async runBasicFunctionalityTests() {
    const testSuite = 'BasicFunctionality';
    this.testResults.testSuites[testSuite] = { passed: 0, failed: 0, tests: [] };
    
    for (const testData of this.testDatasets.basicConcerns) {
      const testResult = await this.runSingleTest(
        `${testSuite}_${testData.name}`,
        () => this.testBasicFunctionality(testData)
      );
      
      this.testResults.testSuites[testSuite].tests.push(testResult);
      if (testResult.passed) {
        this.testResults.testSuites[testSuite].passed++;
      } else {
        this.testResults.testSuites[testSuite].failed++;
      }
    }
  }

  /**
   * 単一基本機能テスト
   */
  async testBasicFunctionality(testData) {
    const startTime = performance.now();
    
    try {
      // 統合システム実行
      const result = await this.orchestrator.executeIntegratedTransformation(testData.input);
      
      const responseTime = performance.now() - startTime;
      
      // 基本的な結果構造確認
      this.assertTrue(result !== null, 'Result should not be null');
      this.assertTrue(typeof result === 'object', 'Result should be an object');
      this.assertTrue(result.primaryMetaphor !== undefined, 'Primary metaphor should exist');
      this.assertTrue(result.integratedContent !== undefined, 'Integrated content should exist');
      this.assertTrue(result.systemInfo !== undefined, 'System info should exist');
      
      // パフォーマンス確認
      this.assertTrue(
        responseTime <= testData.expected.responseTime,
        `Response time should be <= ${testData.expected.responseTime}ms, got ${responseTime.toFixed(2)}ms`
      );
      
      // 悩み分類精度確認
      const concernAnalysis = result.concernAnalysis || result.integratedContent?.concernAnalysis;
      if (concernAnalysis && testData.expected.concernType) {
        this.assertTrue(
          concernAnalysis.nature?.primary === testData.expected.concernType ||
          concernAnalysis.concernType === testData.expected.concernType,
          `Expected concern type ${testData.expected.concernType}, got ${concernAnalysis.nature?.primary || concernAnalysis.concernType}`
        );
      }
      
      // 緊急度判定確認
      if (concernAnalysis && testData.expected.urgencyLevel) {
        this.assertTrue(
          concernAnalysis.urgency?.level === testData.expected.urgencyLevel ||
          concernAnalysis.urgencyLevel === testData.expected.urgencyLevel,
          `Expected urgency level ${testData.expected.urgencyLevel}, got ${concernAnalysis.urgency?.level || concernAnalysis.urgencyLevel}`
        );
      }
      
      // パターン確認
      if (testData.expected.patterns) {
        const availablePatterns = this.extractAvailablePatterns(result);
        for (const expectedPattern of testData.expected.patterns) {
          this.assertTrue(
            availablePatterns.includes(expectedPattern),
            `Expected pattern ${expectedPattern} not found in available patterns: ${availablePatterns.join(', ')}`
          );
        }
      }
      
      return {
        success: true,
        responseTime,
        details: {
          concernType: concernAnalysis?.nature?.primary || concernAnalysis?.concernType,
          urgencyLevel: concernAnalysis?.urgency?.level || concernAnalysis?.urgencyLevel,
          patterns: availablePatterns,
          qualityGrade: result.qualityMetrics?.overallGrade
        }
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        responseTime: performance.now() - startTime
      };
    }
  }

  /**
   * パフォーマンステスト
   */
  async runPerformanceTests() {
    const testSuite = 'Performance';
    this.testResults.testSuites[testSuite] = { passed: 0, failed: 0, tests: [] };
    
    // 応答時間テスト
    const responseTimeTest = await this.runSingleTest(
      `${testSuite}_ResponseTime`,
      () => this.testResponseTime()
    );
    this.testResults.testSuites[testSuite].tests.push(responseTimeTest);
    
    // 同時実行テスト
    const concurrentTest = await this.runSingleTest(
      `${testSuite}_ConcurrentExecution`,
      () => this.testConcurrentExecution()
    );
    this.testResults.testSuites[testSuite].tests.push(concurrentTest);
    
    // メモリ使用量テスト
    const memoryTest = await this.runSingleTest(
      `${testSuite}_MemoryUsage`,
      () => this.testMemoryUsage()
    );
    this.testResults.testSuites[testSuite].tests.push(memoryTest);
    
    // キャッシュ効率テスト
    const cacheTest = await this.runSingleTest(
      `${testSuite}_CacheEfficiency`, 
      () => this.testCacheEfficiency()
    );
    this.testResults.testSuites[testSuite].tests.push(cacheTest);
    
    // 結果集計
    this.testResults.testSuites[testSuite].passed = 
      this.testResults.testSuites[testSuite].tests.filter(t => t.passed).length;
    this.testResults.testSuites[testSuite].failed = 
      this.testResults.testSuites[testSuite].tests.filter(t => !t.passed).length;
  }

  /**
   * 応答時間テスト
   */
  async testResponseTime() {
    const testInput = this.testDatasets.basicConcerns[0].input;
    const iterations = 10;
    const responseTimes = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      await this.orchestrator.executeIntegratedTransformation(testInput);
      const responseTime = performance.now() - startTime;
      responseTimes.push(responseTime);
    }
    
    const averageTime = responseTimes.reduce((sum, time) => sum + time, 0) / iterations;
    const maxTime = Math.max(...responseTimes);
    
    this.assertTrue(
      averageTime <= this.performanceBenchmarks.responseTimeTarget,
      `Average response time should be <= ${this.performanceBenchmarks.responseTimeTarget}ms, got ${averageTime.toFixed(2)}ms`
    );
    
    this.assertTrue(
      maxTime <= this.performanceBenchmarks.responseTimeTarget * 1.5,
      `Max response time should be <= ${this.performanceBenchmarks.responseTimeTarget * 1.5}ms, got ${maxTime.toFixed(2)}ms`
    );
    
    return {
      success: true,
      details: {
        averageTime: averageTime.toFixed(2),
        maxTime: maxTime.toFixed(2),
        minTime: Math.min(...responseTimes).toFixed(2),
        iterations
      }
    };
  }

  /**
   * 同時実行テスト
   */
  async testConcurrentExecution() {
    const testData = this.testDatasets.performanceTests.find(t => t.name === '同時実行テスト');
    const concurrentRequests = testData.concurrent;
    
    const startTime = performance.now();
    
    // 同時リクエスト実行
    const promises = Array.from({ length: concurrentRequests }, () =>
      this.orchestrator.executeIntegratedTransformation(testData.input)
    );
    
    const results = await Promise.allSettled(promises);
    const totalTime = performance.now() - startTime;
    
    const successfulResults = results.filter(r => r.status === 'fulfilled');
    const failedResults = results.filter(r => r.status === 'rejected');
    
    this.assertTrue(
      successfulResults.length >= concurrentRequests * 0.9,
      `At least 90% of concurrent requests should succeed, got ${successfulResults.length}/${concurrentRequests}`
    );
    
    this.assertTrue(
      totalTime <= this.performanceBenchmarks.responseTimeTarget * 2,
      `Concurrent execution should complete within ${this.performanceBenchmarks.responseTimeTarget * 2}ms, got ${totalTime.toFixed(2)}ms`
    );
    
    return {
      success: true,
      details: {
        concurrentRequests,
        successfulResults: successfulResults.length,
        failedResults: failedResults.length,
        totalTime: totalTime.toFixed(2),
        averageTimePerRequest: (totalTime / concurrentRequests).toFixed(2)
      }
    };
  }

  /**
   * メモリ使用量テスト
   */
  async testMemoryUsage() {
    const testData = this.testDatasets.performanceTests.find(t => t.name === 'メモリ使用量テスト');
    const iterations = testData.iterations;
    
    // 初期メモリ使用量（概算）
    const initialMemory = this.estimateMemoryUsage();
    
    // 繰り返し実行
    for (let i = 0; i < iterations; i++) {
      await this.orchestrator.executeIntegratedTransformation(testData.input);
      
      // メモリリーク検出のため定期的にチェック
      if (i % 20 === 0) {
        const currentMemory = this.estimateMemoryUsage();
        const memoryGrowth = currentMemory - initialMemory;
        
        this.assertTrue(
          memoryGrowth <= this.performanceBenchmarks.memoryUsageLimit,
          `Memory growth should be <= ${this.performanceBenchmarks.memoryUsageLimit}MB, got ${memoryGrowth.toFixed(2)}MB at iteration ${i}`
        );
      }
    }
    
    const finalMemory = this.estimateMemoryUsage();
    const totalMemoryGrowth = finalMemory - initialMemory;
    
    return {
      success: true,
      details: {
        iterations,
        initialMemory: initialMemory.toFixed(2),
        finalMemory: finalMemory.toFixed(2),
        memoryGrowth: totalMemoryGrowth.toFixed(2),
        memoryLimit: this.performanceBenchmarks.memoryUsageLimit
      }
    };
  }

  /**
   * キャッシュ効率テスト
   */
  async testCacheEfficiency() {
    const testInput = this.testDatasets.basicConcerns[0].input;
    const iterations = 20;
    
    // キャッシュクリア
    this.orchestrator.integratedCache.clear();
    
    const startTime = performance.now();
    
    // 同じ入力を繰り返し実行
    for (let i = 0; i < iterations; i++) {
      await this.orchestrator.executeIntegratedTransformation(testInput);
    }
    
    const totalTime = performance.now() - startTime;
    const averageTime = totalTime / iterations;
    
    // キャッシュヒット率の確認
    const cacheHitRate = this.orchestrator.performanceMetrics.cacheHitRate;
    
    this.assertTrue(
      cacheHitRate >= this.performanceBenchmarks.cacheHitRateTarget,
      `Cache hit rate should be >= ${this.performanceBenchmarks.cacheHitRateTarget}, got ${cacheHitRate.toFixed(3)}`
    );
    
    this.assertTrue(
      averageTime <= this.performanceBenchmarks.responseTimeTarget * 0.5,
      `Average cached response time should be <= ${this.performanceBenchmarks.responseTimeTarget * 0.5}ms, got ${averageTime.toFixed(2)}ms`
    );
    
    return {
      success: true,
      details: {
        iterations,
        totalTime: totalTime.toFixed(2),
        averageTime: averageTime.toFixed(2),
        cacheHitRate: cacheHitRate.toFixed(3),
        cacheSize: this.orchestrator.integratedCache.size
      }
    };
  }

  /**
   * エラー処理テスト
   */
  async runErrorHandlingTests() {
    const testSuite = 'ErrorHandling';
    this.testResults.testSuites[testSuite] = { passed: 0, failed: 0, tests: [] };
    
    // エッジケーステスト
    for (const edgeCase of this.testDatasets.edgeCases) {
      const testResult = await this.runSingleTest(
        `${testSuite}_${edgeCase.name}`,
        () => this.testEdgeCase(edgeCase)
      );
      
      this.testResults.testSuites[testSuite].tests.push(testResult);
    }
    
    // コンポーネント失敗テスト
    for (const failureScenario of this.errorScenarios.componentFailures) {
      const testResult = await this.runSingleTest(
        `${testSuite}_${failureScenario.name}`,
        () => this.testComponentFailure(failureScenario)
      );
      
      this.testResults.testSuites[testSuite].tests.push(testResult);
    }
    
    // 結果集計
    this.testResults.testSuites[testSuite].passed = 
      this.testResults.testSuites[testSuite].tests.filter(t => t.passed).length;
    this.testResults.testSuites[testSuite].failed = 
      this.testResults.testSuites[testSuite].tests.filter(t => !t.passed).length;
  }

  /**
   * エッジケーステスト
   */
  async testEdgeCase(edgeCase) {
    try {
      const result = await this.orchestrator.executeIntegratedTransformation(edgeCase.input);
      
      if (edgeCase.expected.shouldFail) {
        // 失敗が期待されるケース
        this.assertTrue(false, 'Should have failed but succeeded');
      } else {
        // 成功が期待されるケース
        this.assertTrue(result !== null, 'Result should not be null');
        this.assertTrue(result.systemInfo !== undefined, 'System info should exist');
      }
      
      return { success: true, details: { result: 'handled appropriately' } };
      
    } catch (error) {
      if (edgeCase.expected.shouldFail) {
        // 期待される失敗
        if (edgeCase.expected.errorType) {
          this.assertTrue(
            error.message.includes(edgeCase.expected.errorType) || 
            error.constructor.name === edgeCase.expected.errorType,
            `Expected error type ${edgeCase.expected.errorType}, got ${error.constructor.name}: ${error.message}`
          );
        }
        return { success: true, details: { error: error.message, expected: true } };
      } else {
        // 予期しない失敗
        return { success: false, error: error.message };
      }
    }
  }

  /**
   * コンポーネント失敗テスト
   */
  async testComponentFailure(failureScenario) {
    // コンポーネント失敗のモック（実装例）
    const originalComponent = this.orchestrator.components[failureScenario.mockFailure];
    
    try {
      // コンポーネントを意図的に失敗させる
      this.orchestrator.components[failureScenario.mockFailure] = null;
      
      const result = await this.orchestrator.executeIntegratedTransformation(failureScenario.input);
      
      // フォールバック動作の確認
      this.assertTrue(result !== null, 'Should have fallback result');
      this.assertTrue(
        result.systemInfo?.fallbackMode === true || 
        result.fallback === true,
        'Should indicate fallback mode'
      );
      
      return {
        success: true,
        details: {
          component: failureScenario.mockFailure,
          fallbackExecuted: true,
          result: 'handled with fallback'
        }
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: { component: failureScenario.mockFailure }
      };
    } finally {
      // コンポーネントを復元
      this.orchestrator.components[failureScenario.mockFailure] = originalComponent;
    }
  }

  /**
   * 精度・品質テスト
   */
  async runAccuracyTests() {
    const testSuite = 'Accuracy';
    this.testResults.testSuites[testSuite] = { passed: 0, failed: 0, tests: [] };
    
    // 悩み分類精度テスト
    const concernAccuracyTest = await this.runSingleTest(
      `${testSuite}_ConcernClassificationAccuracy`,
      () => this.testConcernClassificationAccuracy()
    );
    this.testResults.testSuites[testSuite].tests.push(concernAccuracyTest);
    
    // パターン計算精度テスト
    const patternAccuracyTest = await this.runSingleTest(
      `${testSuite}_PatternCalculationAccuracy`,
      () => this.testPatternCalculationAccuracy()
    );
    this.testResults.testSuites[testSuite].tests.push(patternAccuracyTest);
    
    // メタファー品質テスト
    const metaphorQualityTest = await this.runSingleTest(
      `${testSuite}_MetaphorQuality`,
      () => this.testMetaphorQuality()
    );
    this.testResults.testSuites[testSuite].tests.push(metaphorQualityTest);
    
    // 結果集計
    this.testResults.testSuites[testSuite].passed = 
      this.testResults.testSuites[testSuite].tests.filter(t => t.passed).length;
    this.testResults.testSuites[testSuite].failed = 
      this.testResults.testSuites[testSuite].tests.filter(t => !t.passed).length;
  }

  /**
   * 悩み分類精度テスト
   */
  async testConcernClassificationAccuracy() {
    const testCases = this.testDatasets.basicConcerns;
    let correctClassifications = 0;
    const results = [];
    
    for (const testCase of testCases) {
      try {
        const result = await this.orchestrator.executeIntegratedTransformation(testCase.input);
        const concernAnalysis = result.concernAnalysis || result.integratedContent?.concernAnalysis;
        
        const classifiedType = concernAnalysis?.nature?.primary || concernAnalysis?.concernType;
        const expectedType = testCase.expected.concernType;
        
        const isCorrect = classifiedType === expectedType;
        if (isCorrect) correctClassifications++;
        
        results.push({
          input: testCase.name,
          expected: expectedType,
          actual: classifiedType,
          correct: isCorrect,
          confidence: concernAnalysis?.confidence || 0
        });
        
      } catch (error) {
        results.push({
          input: testCase.name,
          error: error.message,
          correct: false
        });
      }
    }
    
    const accuracy = correctClassifications / testCases.length;
    const targetAccuracy = this.qualityStandards.accuracy.concernClassification;
    
    this.assertTrue(
      accuracy >= targetAccuracy,
      `Concern classification accuracy should be >= ${targetAccuracy}, got ${accuracy.toFixed(3)}`
    );
    
    return {
      success: true,
      details: {
        accuracy: accuracy.toFixed(3),
        targetAccuracy,
        correctClassifications,
        totalTests: testCases.length,
        results
      }
    };
  }

  /**
   * パターン計算精度テスト
   */
  async testPatternCalculationAccuracy() {
    const testCases = this.testDatasets.basicConcerns;
    let correctPatterns = 0;
    const results = [];
    
    for (const testCase of testCases) {
      try {
        const result = await this.orchestrator.executeIntegratedTransformation(testCase.input);
        const availablePatterns = this.extractAvailablePatterns(result);
        
        // 期待されるパターンが含まれているかチェック
        const expectedPatterns = testCase.expected.patterns || [];
        const hasExpectedPatterns = expectedPatterns.every(pattern => 
          availablePatterns.includes(pattern)
        );
        
        if (hasExpectedPatterns) correctPatterns++;
        
        results.push({
          input: testCase.name,
          expected: expectedPatterns,
          actual: availablePatterns,
          correct: hasExpectedPatterns
        });
        
      } catch (error) {
        results.push({
          input: testCase.name,
          error: error.message,
          correct: false
        });
      }
    }
    
    const accuracy = correctPatterns / testCases.length;
    const targetAccuracy = this.qualityStandards.accuracy.patternCalculation;
    
    this.assertTrue(
      accuracy >= targetAccuracy,
      `Pattern calculation accuracy should be >= ${targetAccuracy}, got ${accuracy.toFixed(3)}`
    );
    
    return {
      success: true,
      details: {
        accuracy: accuracy.toFixed(3),
        targetAccuracy,
        correctPatterns,
        totalTests: testCases.length,
        results
      }
    };
  }

  /**
   * メタファー品質テスト
   */
  async testMetaphorQuality() {
    const testCases = this.testDatasets.basicConcerns;
    let totalQualityScore = 0;
    const results = [];
    
    for (const testCase of testCases) {
      try {
        const result = await this.orchestrator.executeIntegratedTransformation(testCase.input);
        const primaryMetaphor = result.primaryMetaphor || result.integratedContent?.primaryInsight;
        
        // メタファー品質評価
        const qualityScore = this.evaluateMetaphorQuality(primaryMetaphor);
        totalQualityScore += qualityScore;
        
        results.push({
          input: testCase.name,
          metaphor: primaryMetaphor?.essence || primaryMetaphor?.fullText,
          qualityScore: qualityScore.toFixed(3),
          criteria: {
            clarity: qualityScore,
            relevance: qualityScore,
            insight: qualityScore
          }
        });
        
      } catch (error) {
        results.push({
          input: testCase.name,
          error: error.message,
          qualityScore: 0
        });
      }
    }
    
    const averageQuality = totalQualityScore / testCases.length;
    const targetQuality = this.qualityStandards.accuracy.metaphorRelevance;
    
    this.assertTrue(
      averageQuality >= targetQuality,
      `Metaphor quality should be >= ${targetQuality}, got ${averageQuality.toFixed(3)}`
    );
    
    return {
      success: true,
      details: {
        averageQuality: averageQuality.toFixed(3),
        targetQuality,
        totalTests: testCases.length,
        results
      }
    };
  }

  /**
   * bunenjin哲学統合テスト
   */
  async runBunenjinPhilosophyTests() {
    const testSuite = 'BunenjinPhilosophy';
    this.testResults.testSuites[testSuite] = { passed: 0, failed: 0, tests: [] };
    
    // 複数視点テスト
    const multipleViewsTest = await this.runSingleTest(
      `${testSuite}_MultipleViews`,
      () => this.testMultipleViews()
    );
    this.testResults.testSuites[testSuite].tests.push(multipleViewsTest);
    
    // 矛盾許容テスト
    const paradoxAcceptanceTest = await this.runSingleTest(
      `${testSuite}_ParadoxAcceptance`,
      () => this.testParadoxAcceptance()
    );
    this.testResults.testSuites[testSuite].tests.push(paradoxAcceptanceTest);
    
    // Triple OS統合テスト
    const tripleOSTest = await this.runSingleTest(
      `${testSuite}_TripleOSIntegration`,
      () => this.testTripleOSIntegration()
    );
    this.testResults.testSuites[testSuite].tests.push(tripleOSTest);
    
    // 結果集計
    this.testResults.testSuites[testSuite].passed = 
      this.testResults.testSuites[testSuite].tests.filter(t => t.passed).length;
    this.testResults.testSuites[testSuite].failed = 
      this.testResults.testSuites[testSuite].tests.filter(t => !t.passed).length;
  }

  /**
   * 複数視点テスト
   */
  async testMultipleViews() {
    const testInput = this.testDatasets.basicConcerns[0].input;
    const result = await this.orchestrator.executeIntegratedTransformation(testInput);
    
    // bunenjin統合の確認
    const bunenjinIntegration = result.bunenjinIntegration || result.integratedContent?.bunenjinWisdom;
    
    this.assertTrue(
      bunenjinIntegration !== undefined,
      'Bunenjin integration should exist'
    );
    
    // 複数視点の確認
    const multipleViews = bunenjinIntegration?.multipleViews;
    this.assertTrue(
      multipleViews !== undefined,
      'Multiple views should exist'
    );
    
    this.assertTrue(
      multipleViews?.perspectives && multipleViews.perspectives.length >= 2,
      'Should have at least 2 perspectives'
    );
    
    // 各視点の内容確認
    for (const perspective of multipleViews.perspectives || []) {
      this.assertTrue(
        perspective.name && perspective.insight,
        'Each perspective should have name and insight'
      );
    }
    
    return {
      success: true,
      details: {
        perspectiveCount: multipleViews?.perspectives?.length || 0,
        perspectives: multipleViews?.perspectives?.map(p => p.name) || []
      }
    };
  }

  /**
   * 矛盾許容テスト
   */
  async testParadoxAcceptance() {
    const testInput = this.testDatasets.basicConcerns[1].input; // 恋愛の悩み
    const result = await this.orchestrator.executeIntegratedTransformation(testInput);
    
    const bunenjinIntegration = result.bunenjinIntegration || result.integratedContent?.bunenjinWisdom;
    const dividedPerformance = bunenjinIntegration?.dividedPerformance;
    
    this.assertTrue(
      dividedPerformance !== undefined,
      'Divided performance should exist'
    );
    
    this.assertTrue(
      dividedPerformance?.paradoxes && dividedPerformance.paradoxes.length > 0,
      'Should have identified paradoxes'
    );
    
    return {
      success: true,
      details: {
        paradoxCount: dividedPerformance?.paradoxes?.length || 0,
        paradoxes: dividedPerformance?.paradoxes || []
      }
    };
  }

  /**
   * Triple OS統合テスト
   */
  async testTripleOSIntegration() {
    const testInput = this.testDatasets.basicConcerns[2].input; // 人生の方向性
    const result = await this.orchestrator.executeIntegratedTransformation(testInput);
    
    const bunenjinIntegration = result.bunenjinIntegration || result.integratedContent?.bunenjinWisdom;
    const tripleOSIntegration = bunenjinIntegration?.tripleOSIntegration;
    
    this.assertTrue(
      tripleOSIntegration !== undefined,
      'Triple OS integration should exist'
    );
    
    // 3つのOSの確認
    const osTypes = ['engineOS', 'interfaceOS', 'safeModeOS'];
    for (const osType of osTypes) {
      this.assertTrue(
        tripleOSIntegration[osType] !== undefined,
        `${osType} should exist`
      );
      
      this.assertTrue(
        tripleOSIntegration[osType]?.focus && tripleOSIntegration[osType]?.guidance,
        `${osType} should have focus and guidance`
      );
    }
    
    return {
      success: true,
      details: {
        availableOS: osTypes.filter(os => tripleOSIntegration?.[os] !== undefined),
        engineOSFocus: tripleOSIntegration?.engineOS?.focus,
        interfaceOSFocus: tripleOSIntegration?.interfaceOS?.focus,
        safeModeOSFocus: tripleOSIntegration?.safeModeOS?.focus
      }
    };
  }

  /**
   * システム統合テスト
   */
  async runSystemIntegrationTests() {
    const testSuite = 'SystemIntegration';
    this.testResults.testSuites[testSuite] = { passed: 0, failed: 0, tests: [] };
    
    // データ整合性テスト
    const dataConsistencyTest = await this.runSingleTest(
      `${testSuite}_DataConsistency`,
      () => this.testDataConsistency()
    );
    this.testResults.testSuites[testSuite].tests.push(dataConsistencyTest);
    
    // システム健全性テスト
    const systemHealthTest = await this.runSingleTest(
      `${testSuite}_SystemHealth`,
      () => this.testSystemHealth()
    );
    this.testResults.testSuites[testSuite].tests.push(systemHealthTest);
    
    // 結果集計
    this.testResults.testSuites[testSuite].passed = 
      this.testResults.testSuites[testSuite].tests.filter(t => t.passed).length;
    this.testResults.testSuites[testSuite].failed = 
      this.testResults.testSuites[testSuite].tests.filter(t => !t.passed).length;
  }

  /**
   * データ整合性テスト
   */
  async testDataConsistency() {
    const testInput = this.testDatasets.basicConcerns[0].input;
    const result = await this.orchestrator.executeIntegratedTransformation(testInput);
    
    // 基本構造の整合性確認
    this.assertTrue(
      result.systemInfo !== undefined,
      'System info should exist'
    );
    
    this.assertTrue(
      result.systemInfo.version !== undefined,
      'Version should be specified'
    );
    
    this.assertTrue(
      result.systemInfo.timestamp !== undefined,
      'Timestamp should exist'
    );
    
    // 各コンポーネント結果の整合性確認
    const concernAnalysis = result.concernAnalysis;
    const patternResults = result.patternResults;
    const metaphorResults = result.primaryMetaphor || result.integratedContent?.primaryInsight;
    
    // 悩み分析とパターンの整合性
    if (concernAnalysis && patternResults) {
      this.assertTrue(
        concernAnalysis.nature?.primary || concernAnalysis.concernType,
        'Concern type should be classified'
      );
      
      this.assertTrue(
        patternResults.patterns || patternResults.inputHexagram,
        'Patterns should be calculated'
      );
    }
    
    // メタファーの存在確認
    this.assertTrue(
      metaphorResults?.essence || metaphorResults?.fullText,
      'Metaphor should be generated'
    );
    
    return {
      success: true,
      details: {
        systemInfo: !!result.systemInfo,
        concernAnalysis: !!concernAnalysis,
        patternResults: !!patternResults,
        metaphorResults: !!metaphorResults,
        bunenjinIntegration: !!(result.bunenjinIntegration || result.integratedContent?.bunenjinWisdom)
      }
    };
  }

  /**
   * システム健全性テスト
   */
  async testSystemHealth() {
    const diagnostics = await this.orchestrator.runSystemDiagnostics();
    
    this.assertTrue(
      diagnostics !== undefined,
      'System diagnostics should be available'
    );
    
    this.assertTrue(
      diagnostics.overallHealth !== 'critical',
      'System health should not be critical'
    );
    
    // パフォーマンス指標確認
    if (diagnostics.performance) {
      this.assertTrue(
        diagnostics.performance.averageResponseTime <= this.performanceBenchmarks.responseTimeTarget * 1.5,
        `Average response time should be reasonable, got ${diagnostics.performance.averageResponseTime}ms`
      );
      
      this.assertTrue(
        diagnostics.performance.successRate >= 0.8,
        `Success rate should be >= 0.8, got ${diagnostics.performance.successRate}`
      );
    }
    
    return {
      success: true,
      details: {
        overallHealth: diagnostics.overallHealth,
        componentHealth: diagnostics.componentHealth,
        performance: diagnostics.performance,
        errorCount: diagnostics.errors?.recentErrorCount || 0,
        recommendations: diagnostics.recommendations || []
      }
    };
  }

  /**
   * ヘルパーメソッド群
   */

  // 単一テスト実行
  async runSingleTest(testName, testFunction) {
    console.log(`  🧪 ${testName} 実行中...`);
    this.testResults.totalTests++;
    
    try {
      const startTime = performance.now();
      const result = await testFunction();
      const duration = performance.now() - startTime;
      
      if (result.success) {
        this.testResults.passedTests++;
        console.log(`  ✅ ${testName} 成功 (${duration.toFixed(2)}ms)`);
        return {
          name: testName,
          passed: true,
          duration: duration.toFixed(2),
          details: result.details
        };
      } else {
        this.testResults.failedTests++;
        console.log(`  ❌ ${testName} 失敗: ${result.error}`);
        return {
          name: testName,
          passed: false,
          duration: duration.toFixed(2),
          error: result.error,
          details: result.details
        };
      }
    } catch (error) {
      this.testResults.failedTests++;
      console.error(`  ❌ ${testName} エラー:`, error);
      return {
        name: testName,
        passed: false,
        error: error.message,
        stack: error.stack
      };
    }
  }

  // アサーション
  assertTrue(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  // パターン抽出
  extractAvailablePatterns(result) {
    const patterns = [];
    
    // パターン結果から
    if (result.patternResults?.patterns) {
      for (const pattern of result.patternResults.patterns) {
        patterns.push(pattern.pattern);
      }
    }
    
    // メタファー結果から
    if (result.availableMetaphors) {
      patterns.push(...Object.keys(result.availableMetaphors));
    }
    
    // 統合コンテンツから
    if (result.integratedContent?.patternSummary) {
      const summary = result.integratedContent.patternSummary;
      if (summary.mainPattern) {
        patterns.push(summary.mainPattern);
      }
    }
    
    return [...new Set(patterns)]; // 重複除去
  }

  // メタファー品質評価
  evaluateMetaphorQuality(metaphor) {
    if (!metaphor) return 0;
    
    let score = 0;
    
    // 長さ評価（適切な長さ）
    const text = metaphor.essence || metaphor.fullText || '';
    if (text.length >= 10 && text.length <= 200) score += 0.2;
    
    // 内容評価（基本的な実装）
    if (text.includes('成長') || text.includes('変化') || text.includes('智慧')) score += 0.2;
    if (text.includes('川') || text.includes('山') || text.includes('花')) score += 0.2;
    
    // アクション指針の存在
    if (metaphor.actionGuidance || metaphor.guidance) score += 0.2;
    
    // 洞察レベル
    if (metaphor.insightLevel === 'profound' || metaphor.insightLevel === 'deep') score += 0.2;
    
    return Math.min(score, 1.0);
  }

  // メモリ使用量推定（簡易実装）
  estimateMemoryUsage() {
    // JavaScriptのメモリ使用量は直接取得できないため、
    // オブジェクトサイズの概算値を返す
    const cacheSize = this.orchestrator?.integratedCache?.size || 0;
    const estimatedMemoryMB = cacheSize * 0.01; // 1エントリあたり約10KB想定
    return estimatedMemoryMB;
  }

  // スリープ関数
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 総合結果計算
  calculateOverallResult() {
    const successRate = this.testResults.passedTests / Math.max(this.testResults.totalTests, 1);
    
    if (successRate >= 0.95) return 'excellent';
    if (successRate >= 0.85) return 'good';
    if (successRate >= 0.70) return 'acceptable';
    return 'needs_improvement';
  }

  // テスト結果分析
  async analyzeTestResults() {
    console.log('📊 テスト結果分析中...');
    
    // システム診断実行
    if (this.orchestrator) {
      const diagnostics = await this.orchestrator.runSystemDiagnostics();
      this.testResults.systemDiagnostics = diagnostics;
    }
    
    // 品質指標計算
    this.testResults.qualityMetrics = {
      testCoverage: this.calculateTestCoverage(),
      performanceGrade: this.calculatePerformanceGrade(),
      accuracyScore: this.calculateAccuracyScore(),
      reliabilityScore: this.calculateReliabilityScore()
    };
  }

  // テストカバレッジ計算
  calculateTestCoverage() {
    const testSuites = Object.keys(this.testResults.testSuites);
    const expectedSuites = ['BasicFunctionality', 'Performance', 'ErrorHandling', 'Accuracy', 'BunenjinPhilosophy', 'SystemIntegration'];
    
    const coverage = testSuites.filter(suite => expectedSuites.includes(suite)).length / expectedSuites.length;
    return Math.round(coverage * 100);
  }

  // パフォーマンス評価
  calculatePerformanceGrade() {
    const performanceTests = this.testResults.testSuites.Performance?.tests || [];
    const passedPerformanceTests = performanceTests.filter(t => t.passed).length;
    const totalPerformanceTests = performanceTests.length;
    
    if (totalPerformanceTests === 0) return 'N/A';
    
    const performanceScore = passedPerformanceTests / totalPerformanceTests;
    if (performanceScore >= 0.9) return 'A';
    if (performanceScore >= 0.8) return 'B';
    if (performanceScore >= 0.7) return 'C';
    return 'D';
  }

  // 精度スコア計算
  calculateAccuracyScore() {
    const accuracyTests = this.testResults.testSuites.Accuracy?.tests || [];
    const passedAccuracyTests = accuracyTests.filter(t => t.passed).length;
    const totalAccuracyTests = accuracyTests.length;
    
    if (totalAccuracyTests === 0) return 0;
    
    return Math.round((passedAccuracyTests / totalAccuracyTests) * 100);
  }

  // 信頼性スコア計算
  calculateReliabilityScore() {
    const errorHandlingTests = this.testResults.testSuites.ErrorHandling?.tests || [];
    const passedErrorTests = errorHandlingTests.filter(t => t.passed).length;
    const totalErrorTests = errorHandlingTests.length;
    
    if (totalErrorTests === 0) return 0;
    
    return Math.round((passedErrorTests / totalErrorTests) * 100);
  }

  // テストレポート生成
  generateTestReport() {
    const duration = this.testResults.endTime - this.testResults.startTime;
    
    return {
      summary: {
        version: this.version,
        testPhilosophy: this.testPhilosophy,
        overallResult: this.testResults.overallResult,
        totalTests: this.testResults.totalTests,
        passedTests: this.testResults.passedTests,
        failedTests: this.testResults.failedTests,
        successRate: (this.testResults.passedTests / Math.max(this.testResults.totalTests, 1) * 100).toFixed(1) + '%',
        duration: duration + 'ms'
      },
      
      qualityMetrics: this.testResults.qualityMetrics,
      
      testSuites: this.testResults.testSuites,
      
      systemDiagnostics: this.testResults.systemDiagnostics,
      
      recommendations: this.generateRecommendations(),
      
      bunenjinCompliance: this.evaluateBunenjinCompliance(),
      
      timestamp: new Date().toISOString()
    };
  }

  // エラーレポート生成
  generateErrorReport(error) {
    return {
      summary: {
        overallResult: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      },
      testResults: this.testResults,
      recommendations: ['システム初期化の確認', 'エラーログの詳細確認']
    };
  }

  // 推奨事項生成
  generateRecommendations() {
    const recommendations = [];
    
    const successRate = this.testResults.passedTests / Math.max(this.testResults.totalTests, 1);
    
    if (successRate < 0.8) {
      recommendations.push('テスト成功率が低いため、システム品質の改善が必要');
    }
    
    if (this.testResults.testSuites.Performance?.failed > 0) {
      recommendations.push('パフォーマンステストが失敗したため、最適化が必要');
    }
    
    if (this.testResults.testSuites.Accuracy?.failed > 0) {
      recommendations.push('精度テストが失敗したため、アルゴリズムの改善が必要');
    }
    
    if (this.testResults.testSuites.ErrorHandling?.failed > 0) {
      recommendations.push('エラー処理テストが失敗したため、フォールバック機能の強化が必要');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('すべてのテストが良好に動作しています');
    }
    
    return recommendations;
  }

  // bunenjin哲学準拠評価
  evaluateBunenjinCompliance() {
    const bunenjinTests = this.testResults.testSuites.BunenjinPhilosophy?.tests || [];
    const passedBunenjinTests = bunenjinTests.filter(t => t.passed).length;
    const totalBunenjinTests = bunenjinTests.length;
    
    if (totalBunenjinTests === 0) {
      return { compliance: 'not_tested', score: 0 };
    }
    
    const complianceScore = passedBunenjinTests / totalBunenjinTests;
    
    let complianceLevel = 'low';
    if (complianceScore >= 0.9) complianceLevel = 'excellent';
    else if (complianceScore >= 0.8) complianceLevel = 'good';
    else if (complianceScore >= 0.7) complianceLevel = 'acceptable';
    
    return {
      compliance: complianceLevel,
      score: Math.round(complianceScore * 100),
      passedTests: passedBunenjinTests,
      totalTests: totalBunenjinTests,
      areas: {
        multipleViews: bunenjinTests.find(t => t.name.includes('MultipleViews'))?.passed || false,
        paradoxAcceptance: bunenjinTests.find(t => t.name.includes('ParadoxAcceptance'))?.passed || false,
        tripleOSIntegration: bunenjinTests.find(t => t.name.includes('TripleOSIntegration'))?.passed || false
      }
    };
  }
}

// グローバルスコープに登録
if (typeof window !== 'undefined') {
  window.IntegrationTestSuite = IntegrationTestSuite;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = IntegrationTestSuite;
}

console.log('🌟 IntegrationTestSuite.js 読み込み完了 - HAQEI統合テストシステム');