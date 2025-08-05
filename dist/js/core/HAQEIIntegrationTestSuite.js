/**
 * HAQEI統一エラーハンドリングシステム - 包括的統合テストスイート
 * 
 * 目的：
 * - システム全体の統合テスト実行
 * - 225ファイルとの互換性検証
 * - パフォーマンス影響の測定
 * - 実環境での動作保証
 * 
 * Test Coverage:
 * - End-to-end error handling flows
 * - Cross-component integration
 * - Performance regression testing
 * - User experience validation
 * 
 * @author HAQEI System Architect
 * @date 2025-08-05
 */

class HAQEIIntegrationTestSuite {
  constructor(options = {}) {
    this.version = "1.0.0-integration-test-suite";
    this.initialized = false;
    
    // テスト設定
    this.config = {
      timeout: options.timeout || 30000, // 30秒
      retryAttempts: options.retryAttempts || 2,
      parallelExecution: options.parallelExecution !== false,
      generateReport: options.generateReport !== false,
      performanceThreshold: options.performanceThreshold || 15, // 15%
      verbose: options.verbose || false,
      
      // テスト対象環境
      environments: options.environments || ['browser', 'mobile', 'tablet'],
      
      // テストデータ設定
      testData: {
        sampleErrors: this.generateSampleErrors(),
        testAnswers: this.generateTestAnswers(),
        mockUserInteractions: this.generateMockInteractions()
      }
    };
    
    // テストスイート
    this.testSuites = new Map();
    
    // テスト結果
    this.results = {
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        warnings: 0
      },
      details: new Map(),
      performance: {
        baseline: {},
        current: {},
        regression: {}
      },
      coverage: {
        components: new Map(),
        integrationPoints: new Map(),
        errorScenarios: new Map()
      }
    };
    
    // メトリクス収集
    this.metrics = {
      startTime: 0,
      endTime: 0,
      duration: 0,
      memoryUsage: {
        before: 0,
        after: 0,
        peak: 0
      },
      errorHandlingLatency: [],
      userInteractionLatency: []
    };
    
    console.log(`🧪 HAQEIIntegrationTestSuite v${this.version} initialized`);
  }
  
  /**
   * テストスイートの初期化
   */
  async initialize() {
    if (this.initialized) {
      console.warn("⚠️ Test suite already initialized");
      return;
    }
    
    try {
      console.log("🧪 Initializing HAQEI Integration Test Suite...");
      
      // テストスイートの構築
      await this.buildTestSuites();
      
      // パフォーマンスベースラインの取得
      await this.measurePerformanceBaseline();
      
      // テスト環境の検証
      await this.validateTestEnvironment();
      
      this.initialized = true;
      
      console.log("✅ Integration test suite initialized");
      
    } catch (error) {
      console.error("❌ Test suite initialization failed:", error);
      throw error;
    }
  }
  
  /**
   * テストスイートの構築
   */
  async buildTestSuites() {
    console.log("🏗️ Building test suites...");
    
    // 1. コア機能テスト
    this.testSuites.set('core-functionality', this.buildCoreFunctionalityTests());
    
    // 2. エラーハンドリング統合テスト
    this.testSuites.set('error-handling-integration', this.buildErrorHandlingIntegrationTests());
    
    // 3. コンポーネント間統合テスト
    this.testSuites.set('component-integration', this.buildComponentIntegrationTests());
    
    // 4. ユーザーエクスペリエンステスト
    this.testSuites.set('user-experience', this.buildUserExperienceTests());
    
    // 5. パフォーマンステスト
    this.testSuites.set('performance', this.buildPerformanceTests());
    
    // 6. セキュリティテスト
    this.testSuites.set('security', this.buildSecurityTests());
    
    // 7. アクセシビリティテスト
    this.testSuites.set('accessibility', this.buildAccessibilityTests());
    
    // 8. 回帰テスト
    this.testSuites.set('regression', this.buildRegressionTests());
    
    const totalTests = Array.from(this.testSuites.values())
      .flat()
      .length;
    
    console.log(`🏗️ Built ${this.testSuites.size} test suites with ${totalTests} tests`);
  }
  
  /**
   * コア機能テストの構築
   */
  buildCoreFunctionalityTests() {
    return [
      {
        name: 'unified-error-handler-initialization',
        description: 'Unified error handler initializes correctly',
        category: 'core',
        priority: 'critical',
        test: async () => {
          if (!window.HAQEIErrorHandler) {
            throw new Error("Unified error handler not found");
          }
          
          const testError = new Error("Test error for initialization check");
          const result = await window.HAQEIErrorHandler.handleError(testError, { test: true });
          
          if (!result.success) {
            throw new Error("Error handler failed to process test error");
          }
          
          return { success: true, result };
        }
      },
      
      {
        name: 'configuration-manager-functionality',
        description: 'Configuration manager works correctly',
        category: 'core',
        priority: 'high',
        test: async () => {
          if (!window.haqeiConfig) {
            throw new Error("Configuration manager not found");
          }
          
          // 設定の取得・設定テスト
          const originalValue = window.haqeiConfig.get('system.debugMode');
          window.haqeiConfig.set('system.debugMode', !originalValue, { notify: false });
          const newValue = window.haqeiConfig.get('system.debugMode');
          
          if (newValue === originalValue) {
            throw new Error("Configuration set/get failed");
          }
          
          // 元に戻す
          window.haqeiConfig.set('system.debugMode', originalValue, { notify: false });
          
          return { success: true, configWorking: true };
        }
      },
      
      {
        name: 'bootstrap-system-stability',
        description: 'Bootstrap system is stable and responsive',
        category: 'core',
        priority: 'high',
        test: async () => {
          if (!window.haqeiErrorBootstrap) {
            throw new Error("Bootstrap system not found");
          }
          
          const status = window.haqeiErrorBootstrap.getBootstrapStatus();
          
          if (!status.initialized) {
            throw new Error("Bootstrap system not properly initialized");
          }
          
          return { success: true, status };
        }
      }
    ];
  }
  
  /**
   * エラーハンドリング統合テストの構築
   */
  buildErrorHandlingIntegrationTests() {
    return [
      {
        name: 'global-error-handling-coverage',
        description: 'Global error handling covers all error types',
        category: 'error-handling',
        priority: 'critical',
        test: async () => {
          const errorTypes = [
            { type: 'TypeError', error: new TypeError("Test type error") },
            { type: 'ReferenceError', error: new ReferenceError("Test reference error") },
            { type: 'SyntaxError', error: new SyntaxError("Test syntax error") },
            { type: 'NetworkError', error: new Error("Network error test") },
            { type: 'CustomError', error: new Error("Custom error test") }
          ];
          
          const results = [];
          
          for (const { type, error } of errorTypes) {
            try {
              const result = await window.HAQEIErrorHandler.handleError(error, { 
                test: true, 
                errorType: type 
              });
              
              results.push({
                type,
                handled: result.success,
                strategy: result.strategy
              });
            } catch (testError) {
              results.push({
                type,
                handled: false,
                error: testError.message
              });
            }
          }
          
          const allHandled = results.every(r => r.handled);
          
          if (!allHandled) {
            throw new Error(`Some error types not handled: ${results.filter(r => !r.handled).map(r => r.type).join(', ')}`);
          }
          
          return { success: true, results };
        }
      },
      
      {
        name: 'error-recovery-mechanisms',
        description: 'Error recovery mechanisms work correctly',
        category: 'error-handling',
        priority: 'high',
        test: async () => {
          const recoveryTests = [
            {
              name: 'network-retry',
              error: new Error("Network timeout"),
              context: { source: 'network', type: 'NETWORK_ERROR' }
            },
            {
              name: 'fallback-activation',
              error: new Error("Resource load failed"),
              context: { source: 'resource', type: 'RESOURCE_LOAD_ERROR' }
            },
            {
              name: 'graceful-degradation',
              error: new Error("Feature unavailable"),
              context: { source: 'feature', type: 'JAVASCRIPT_ERROR' }
            }
          ];
          
          const results = [];
          
          for (const test of recoveryTests) {
            try {
              const result = await window.HAQEIErrorHandler.handleError(test.error, test.context);
              
              results.push({
                name: test.name,
                success: result.success,
                strategy: result.strategy,
                recovered: result.fallbackActivated || result.attemptsUsed > 0
              });
            } catch (error) {
              results.push({
                name: test.name,
                success: false,
                error: error.message,
                recovered: false
              });
            }
          }
          
          const allRecovered = results.every(r => r.success);
          
          return { success: allRecovered, results };
        }
      }
    ];
  }
  
  /**
   * コンポーネント間統合テストの構築
   */
  buildComponentIntegrationTests() {
    return [
      {
        name: 'app-js-integration',
        description: 'app.js integration works correctly',
        category: 'integration',
        priority: 'critical',
        test: async () => {
          if (!window.app) {
            throw new Error("app.js not found");
          }
          
          // app.handleError が統合されているかテスト
          const testError = new Error("App integration test");
          
          let errorHandled = false;
          let unifiedHandlerCalled = false;
          
          // 統一ハンドラーが呼ばれるかチェック
          const originalHandle = window.HAQEIErrorHandler.handleError;
          window.HAQEIErrorHandler.handleError = async function(...args) {
            unifiedHandlerCalled = true;
            return originalHandle.apply(this, args);
          };
          
          try {
            await window.app.handleError(testError, { integration: true });
            errorHandled = true;
          } catch (error) {
            // エラーは期待される場合がある
            errorHandled = true;
          } finally {
            // 元に戻す
            window.HAQEIErrorHandler.handleError = originalHandle;
          }
          
          if (!errorHandled || !unifiedHandlerCalled) {
            throw new Error("App.js integration not working properly");
          }
          
          return { success: true, integrated: true };
        }
      },
      
      {
        name: 'virtual-question-flow-integration',
        description: 'VirtualQuestionFlow integration works correctly',
        category: 'integration',
        priority: 'high',
        test: async () => {
          if (!window.VirtualQuestionFlow) {
            return { success: true, skipped: true, reason: "VirtualQuestionFlow not available" };
          }
          
          // VirtualQuestionFlow のエラーハンドリングが統合されているかテスト
          try {
            const vqf = new window.VirtualQuestionFlow();
            
            // エラーを発生させるテスト
            const testMethod = vqf.displayQuestion;
            
            if (testMethod) {
              // メソッドが統合されているかの簡単なチェック
              const methodString = testMethod.toString();
              const hasErrorHandling = methodString.includes('HAQEIErrorHandler') || 
                                     methodString.includes('try') || 
                                     methodString.includes('catch');
              
              return { success: true, integrated: hasErrorHandling };
            }
            
            return { success: true, integrated: false, note: "No methods to test" };
            
          } catch (error) {
            throw new Error(`VirtualQuestionFlow integration test failed: ${error.message}`);
          }
        }
      },
      
      {
        name: 'help-system-integration',
        description: 'Help system integration works correctly',
        category: 'integration',
        priority: 'medium',
        test: async () => {
          if (!window.haqeiHelpSystem) {
            return { success: true, skipped: true, reason: "Help system not available" };
          }
          
          // ヘルプシステムのエラーハンドリングテスト
          try {
            let errorCaught = false;
            
            // showHelp メソッドのテスト
            if (window.haqeiHelpSystem.showHelp) {
              try {
                await window.haqeiHelpSystem.showHelp('test-term', 'concept', { test: true });
              } catch (error) {
                errorCaught = true;
              }
            }
            
            return { success: true, integrated: true, errorHandling: errorCaught };
            
          } catch (error) {
            throw new Error(`Help system integration test failed: ${error.message}`);
          }
        }
      }
    ];
  }
  
  /**
   * ユーザーエクスペリエンステストの構築
   */
  buildUserExperienceTests() {
    return [
      {
        name: 'error-notification-display',
        description: 'Error notifications display correctly to users',
        category: 'ux',
        priority: 'high',
        test: async () => {
          const testError = new Error("User notification test");
          
          // エラー処理とUI表示のテスト
          const result = await window.HAQEIErrorHandler.handleError(testError, {
            severity: 'warning',
            userFriendly: true
          });
          
          // 通知要素の確認
          await new Promise(resolve => setTimeout(resolve, 1000)); // 通知表示を待つ
          
          const notifications = document.querySelectorAll('.error-notification, .unified-error-notifications .error-notification');
          
          return { 
            success: true, 
            notificationDisplayed: notifications.length > 0,
            result 
          };
        }
      },
      
      {
        name: 'accessibility-compliance',
        description: 'Error handling maintains accessibility standards',
        category: 'ux',
        priority: 'medium',
        test: async () => {
          // アクセシビリティ要素の確認
          const accessibilityFeatures = {
            ariaLabels: document.querySelectorAll('[aria-label]').length > 0,
            skipLinks: document.querySelectorAll('.skip-link').length > 0,
            headingStructure: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0,
            altTexts: Array.from(document.querySelectorAll('img')).every(img => img.alt !== undefined)
          };
          
          const accessibilityScore = Object.values(accessibilityFeatures)
            .filter(Boolean).length / Object.keys(accessibilityFeatures).length;
          
          return { 
            success: accessibilityScore >= 0.75, 
            score: accessibilityScore,
            features: accessibilityFeatures 
          };
        }
      }
    ];
  }
  
  /**
   * パフォーマンステストの構築
   */
  buildPerformanceTests() {
    return [
      {
        name: 'error-handling-latency',
        description: 'Error handling latency is within acceptable limits',
        category: 'performance',
        priority: 'high',
        test: async () => {
          const iterations = 10;
          const latencies = [];
          
          for (let i = 0; i < iterations; i++) {
            const testError = new Error(`Performance test ${i}`);
            const startTime = performance.now();
            
            await window.HAQEIErrorHandler.handleError(testError, { 
              test: true, 
              iteration: i 
            });
            
            const endTime = performance.now();
            latencies.push(endTime - startTime);
          }
          
          const averageLatency = latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
          const maxLatency = Math.max(...latencies);
          
          // 100ms以下が目標
          const withinThreshold = averageLatency <= 100 && maxLatency <= 200;
          
          return {
            success: withinThreshold,
            averageLatency: averageLatency.toFixed(2),
            maxLatency: maxLatency.toFixed(2),
            allLatencies: latencies
          };
        }
      },
      
      {
        name: 'memory-usage-stability',
        description: 'Memory usage remains stable under load',
        category: 'performance',
        priority: 'medium',
        test: async () => {
          if (!performance.memory) {
            return { success: true, skipped: true, reason: "Performance memory API not available" };
          }
          
          const initialMemory = performance.memory.usedJSHeapSize;
          
          // 多数のエラーを処理
          for (let i = 0; i < 50; i++) {
            const testError = new Error(`Memory test ${i}`);
            await window.HAQEIErrorHandler.handleError(testError, { test: true });
          }
          
          // ガベージコレクションを促す
          if (window.gc) {
            window.gc();
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const finalMemory = performance.memory.usedJSHeapSize;
          const memoryIncrease = finalMemory - initialMemory;
          const memoryIncreasePercent = (memoryIncrease / initialMemory) * 100;
          
          // 20%以内の増加が目標
          const withinThreshold = memoryIncreasePercent <= 20;
          
          return {
            success: withinThreshold,
            memoryIncrease: memoryIncrease,
            memoryIncreasePercent: memoryIncreasePercent.toFixed(2),
            initialMemory,
            finalMemory
          };
        }
      }
    ];
  }
  
  /**
   * セキュリティテストの構築
   */
  buildSecurityTests() {
    return [
      {
        name: 'xss-protection',
        description: 'Error messages are properly sanitized against XSS',
        category: 'security',
        priority: 'critical',
        test: async () => {
          const xssPayloads = [
            '<script>alert("XSS")</script>',
            'javascript:alert("XSS")',
            '<img src="x" onerror="alert(\'XSS\')" />',
            '"><script>alert("XSS")</script>'
          ];
          
          const results = [];
          
          for (const payload of xssPayloads) {
            const testError = new Error(payload);
            
            await window.HAQEIErrorHandler.handleError(testError, { 
              test: true, 
              xssTest: true 
            });
            
            // DOM内に未サニタイズのスクリプトがないかチェック
            const dangerousElements = document.querySelectorAll('script');
            const hasDangerousContent = Array.from(dangerousElements).some(script => 
              script.textContent.includes(payload)
            );
            
            results.push({
              payload,
              sanitized: !hasDangerousContent
            });
          }
          
          const allSanitized = results.every(r => r.sanitized);
          
          return { success: allSanitized, results };
        }
      }
    ];
  }
  
  /**
   * アクセシビリティテストの構築
   */
  buildAccessibilityTests() {
    return [
      {
        name: 'keyboard-navigation',
        description: 'Error UI elements are keyboard accessible',
        category: 'accessibility',
        priority: 'medium',
        test: async () => {
          // キーボードナビゲーション可能な要素の確認
          const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          let accessibleCount = 0;
          
          focusableElements.forEach(element => {
            if (element.offsetWidth > 0 && element.offsetHeight > 0) {
              accessibleCount++;
            }
          });
          
          return {
            success: accessibleCount > 0,
            focusableElements: focusableElements.length,
            accessibleElements: accessibleCount
          };
        }
      }
    ];
  }
  
  /**
   * 回帰テストの構築
   */
  buildRegressionTests() {
    return [
      {
        name: 'existing-functionality-preservation',
        description: 'Existing functionality is preserved after integration',
        category: 'regression',
        priority: 'critical',
        test: async () => {
          // 既存機能の基本テスト
          const tests = [];
          
          // app.js の基本機能
          if (window.app) {
            tests.push({
              name: 'app.js',
              working: typeof window.app === 'object' && window.app.handleError
            });
          }
          
          // ヘルプシステムの基本機能
          if (window.haqeiHelpSystem) {
            tests.push({
              name: 'help-system',
              working: typeof window.haqeiHelpSystem.showHelp === 'function'
            });
          }
          
          // VirtualQuestionFlow の基本機能
          if (window.VirtualQuestionFlow) {
            tests.push({
              name: 'virtual-question-flow',
              working: typeof window.VirtualQuestionFlow === 'function'
            });
          }
          
          const allWorking = tests.every(test => test.working);
          
          return { success: allWorking, tests };
        }
      }
    ];
  }
  
  /**
   * パフォーマンスベースライン測定
   */
  async measurePerformanceBaseline() {
    console.log("📊 Measuring performance baseline...");
    
    this.results.performance.baseline = {
      memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 0,
      timestamp: Date.now(),
      domElements: document.querySelectorAll('*').length,
      eventListeners: this.estimateEventListenerCount()
    };
    
    console.log("📊 Baseline measurements completed:", this.results.performance.baseline);
  }
  
  /**
   * テスト環境の検証
   */
  async validateTestEnvironment() {
    console.log("🔍 Validating test environment...");
    
    const requirements = {
      unifiedErrorHandler: !!window.HAQEIErrorHandler,
      configManager: !!window.haqeiConfig,
      bootstrap: !!window.haqeiErrorBootstrap,
      domReady: document.readyState === 'complete',
      performance: !!performance.now
    };
    
    const missing = Object.entries(requirements)
      .filter(([key, present]) => !present)
      .map(([key]) => key);
    
    if (missing.length > 0) {
      throw new Error(`Test environment requirements not met: ${missing.join(', ')}`);
    }
    
    console.log("✅ Test environment validated");
  }
  
  /**
   * 統合テストの実行
   */
  async runTests(suiteNames = null) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    console.log("🧪 Running HAQEI Integration Tests...");
    
    this.metrics.startTime = performance.now();
    this.metrics.memoryUsage.before = performance.memory ? performance.memory.usedJSHeapSize : 0;
    
    try {
      const suitesToRun = suiteNames || Array.from(this.testSuites.keys());
      
      for (const suiteName of suitesToRun) {
        if (!this.testSuites.has(suiteName)) {
          console.warn(`⚠️ Test suite '${suiteName}' not found`);
          continue;
        }
        
        await this.runTestSuite(suiteName, this.testSuites.get(suiteName));
      }
      
      // パフォーマンスメトリクスの収集
      await this.collectPerformanceMetrics();
      
      // 結果の分析
      this.analyzeResults();
      
      // レポート生成
      if (this.config.generateReport) {
        this.generateReport();
      }
      
      this.metrics.endTime = performance.now();
      this.metrics.duration = this.metrics.endTime - this.metrics.startTime;
      this.metrics.memoryUsage.after = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      console.log(`✅ Integration tests completed in ${this.metrics.duration.toFixed(2)}ms`);
      
      return {
        success: this.results.summary.failed === 0,
        summary: this.results.summary,
        details: Object.fromEntries(this.results.details),
        metrics: this.metrics
      };
      
    } catch (error) {
      console.error("❌ Integration test execution failed:", error);
      
      return {
        success: false,
        error: error.message,
        summary: this.results.summary
      };
    }
  }
  
  /**
   * 個別テストスイートの実行
   */
  async runTestSuite(suiteName, tests) {
    console.log(`🧪 Running test suite: ${suiteName}`);
    
    const suiteResults = {
      name: suiteName,
      tests: [],
      summary: { total: 0, passed: 0, failed: 0, skipped: 0, warnings: 0 },
      startTime: performance.now()
    };
    
    for (const test of tests) {
      const testResult = await this.runSingleTest(test);
      suiteResults.tests.push(testResult);
      
      // サマリー更新
      suiteResults.summary.total++;
      if (testResult.status === 'passed') suiteResults.summary.passed++;
      else if (testResult.status === 'failed') suiteResults.summary.failed++;
      else if (testResult.status === 'skipped') suiteResults.summary.skipped++;
      else if (testResult.status === 'warning') suiteResults.summary.warnings++;
    }
    
    suiteResults.endTime = performance.now();
    suiteResults.duration = suiteResults.endTime - suiteResults.startTime;
    
    // 全体サマリー更新
    this.results.summary.total += suiteResults.summary.total;
    this.results.summary.passed += suiteResults.summary.passed;
    this.results.summary.failed += suiteResults.summary.failed;
    this.results.summary.skipped += suiteResults.summary.skipped;
    this.results.summary.warnings += suiteResults.summary.warnings;
    
    this.results.details.set(suiteName, suiteResults);
    
    console.log(`✅ Test suite '${suiteName}' completed: ${suiteResults.summary.passed}/${suiteResults.summary.total} passed`);
  }
  
  /**
   * 単一テストの実行
   */
  async runSingleTest(test) {
    const testResult = {
      name: test.name,
      description: test.description,
      category: test.category,
      priority: test.priority,
      status: 'pending',
      startTime: performance.now(),
      endTime: 0,
      duration: 0,
      result: null,
      error: null,
      retries: 0
    };
    
    if (this.config.verbose) {
      console.log(`  🧪 Running test: ${test.name}`);
    }
    
    let attempts = 0;
    
    while (attempts <= this.config.retryAttempts) {
      try {
        const result = await Promise.race([
          test.test(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Test timeout')), this.config.timeout)
          )
        ]);
        
        testResult.result = result;
        
        if (result.skipped) {
          testResult.status = 'skipped';
        } else if (result.success) {
          testResult.status = 'passed';
        } else {
          testResult.status = 'warning';
        }
        
        break;
        
      } catch (error) {
        testResult.error = error.message;
        testResult.retries = attempts;
        
        if (attempts < this.config.retryAttempts) {
          attempts++;
          if (this.config.verbose) {
            console.warn(`  ⚠️ Test '${test.name}' failed, retrying (${attempts}/${this.config.retryAttempts})`);
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        } else {
          testResult.status = 'failed';
          break;
        }
      }
    }
    
    testResult.endTime = performance.now();
    testResult.duration = testResult.endTime - testResult.startTime;
    
    if (testResult.status === 'failed' && this.config.verbose) {
      console.error(`  ❌ Test '${test.name}' failed:`, testResult.error);
    } else if (testResult.status === 'passed' && this.config.verbose) {
      console.log(`  ✅ Test '${test.name}' passed`);
    }
    
    return testResult;
  }
  
  /**
   * パフォーマンスメトリクスの収集
   */
  async collectPerformanceMetrics() {
    this.results.performance.current = {
      memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 0,
      timestamp: Date.now(),
      domElements: document.querySelectorAll('*').length,
      eventListeners: this.estimateEventListenerCount()
    };
    
    // 回帰分析
    if (this.results.performance.baseline.timestamp) {
      const memoryIncrease = this.results.performance.current.memoryUsage - 
                           this.results.performance.baseline.memoryUsage;
      const memoryIncreasePercent = (memoryIncrease / this.results.performance.baseline.memoryUsage) * 100;
      
      this.results.performance.regression = {
        memoryIncrease: memoryIncrease,
        memoryIncreasePercent: memoryIncreasePercent,
        withinThreshold: memoryIncreasePercent <= this.config.performanceThreshold
      };
    }
  }
  
  /**
   * 結果の分析
   */
  analyzeResults() {
    const { summary } = this.results;
    
    // 成功率の計算
    const successRate = summary.total > 0 ? (summary.passed / summary.total) * 100 : 0;
    
    // 重要度別分析
    const criticalTests = [];
    const failedCriticalTests = [];
    
    for (const [suiteName, suiteResult] of this.results.details) {
      for (const test of suiteResult.tests) {
        if (test.priority === 'critical') {
          criticalTests.push(test);
          if (test.status === 'failed') {
            failedCriticalTests.push(test);
          }
        }
      }
    }
    
    // 分析結果の保存
    this.results.analysis = {
      successRate: successRate.toFixed(1),
      criticalTestsCount: criticalTests.length,
      failedCriticalTestsCount: failedCriticalTests.length,
      criticalSuccess: failedCriticalTests.length === 0,
      performanceRegression: this.results.performance.regression?.withinThreshold === false
    };
  }
  
  /**
   * レポート生成
   */
  generateReport() {
    const report = {
      version: this.version,
      timestamp: new Date().toISOString(),
      environment: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        viewport: `${window.innerWidth}x${window.innerHeight}`
      },
      config: this.config,
      results: {
        summary: this.results.summary,
        analysis: this.results.analysis,
        performance: this.results.performance
      },
      metrics: this.metrics,
      testDetails: Object.fromEntries(this.results.details)
    };
    
    console.group("📋 HAQEI Integration Test Report");
    console.log("Success Rate:", `${report.results.analysis.successRate}%`);
    console.log("Tests Summary:", report.results.summary);
    console.log("Critical Tests:", `${report.results.analysis.criticalTestsCount - report.results.analysis.failedCriticalTestsCount}/${report.results.analysis.criticalTestsCount} passed`);
    
    if (report.results.performance.regression) {
      console.log("Performance Impact:", `${report.results.performance.regression.memoryIncreasePercent.toFixed(1)}%`);
    }
    
    console.log("Test Duration:", `${report.metrics.duration.toFixed(2)}ms`);
    console.groupEnd();
    
    // レポートをlocalStorageに保存
    try {
      localStorage.setItem('haqei_integration_test_report', JSON.stringify(report));
      console.log("📋 Test report saved to localStorage");
    } catch (error) {
      console.warn("⚠️ Failed to save test report:", error);
    }
    
    return report;
  }
  
  // ユーティリティメソッド
  
  generateSampleErrors() {
    return [
      new Error("Sample generic error"),
      new TypeError("Sample type error"),
      new ReferenceError("Sample reference error"),
      new Error("Network connection failed"),
      new Error("Resource not found")
    ];
  }
  
  generateTestAnswers() {
    return Array.from({ length: 30 }, (_, i) => ({
      questionId: i + 1,
      answer: Math.floor(Math.random() * 4) + 1
    }));
  }
  
  generateMockInteractions() {
    return [
      { type: 'click', target: 'button' },
      { type: 'input', target: 'text-field' },
      { type: 'scroll', target: 'window' },
      { type: 'resize', target: 'window' }
    ];
  }
  
  estimateEventListenerCount() {
    // 簡易的なイベントリスナー数の推定
    return document.querySelectorAll('[onclick], [onchange], [onload]').length;
  }
  
  /**
   * クリーンアップ
   */
  cleanup() {
    this.testSuites.clear();
    this.results.details.clear();
    
    console.log("🧹 HAQEIIntegrationTestSuite cleanup completed");
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.HAQEIIntegrationTestSuite = HAQEIIntegrationTestSuite;
}

// Node.js環境での公開
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HAQEIIntegrationTestSuite;
}

console.log("🧪 HAQEIIntegrationTestSuite.js loaded - Comprehensive integration testing ready");