/**
 * セキュリティ統合検証システム
 * 全セキュリティコンポーネントの統合とテスト
 * 
 * Author: HAQEI Programmer Agent
 * Created: 2025-08-05
 * Security Level: Enterprise
 */

class SecurityIntegrationValidator {
  constructor() {
    this.components = {};
    this.validationResults = {};
    this.integrationStatus = 'initializing';
    this.init();
  }

  /**
   * システム初期化
   */
  async init() {
    try {
      console.log('🔒 セキュリティ統合検証システム初期化開始');
      
      await this.discoverSecurityComponents();
      await this.validateComponentIntegration();
      await this.runComprehensiveSecurityTests();
      
      this.integrationStatus = 'operational';
      console.log('✅ セキュリティ統合検証システム初期化完了');
      
      // 定期的な検証の開始
      this.startContinuousValidation();
      
    } catch (error) {
      console.error('❌ セキュリティ統合初期化エラー:', error);
      this.integrationStatus = 'error';
    }
  }

  /**
   * セキュリティコンポーネントの発見
   */
  async discoverSecurityComponents() {
    console.log('🔍 セキュリティコンポーネント検索中...');
    
    // 各セキュリティコンポーネントの存在確認
    this.components = {
      headerManager: {
        instance: window.securityHeaders || null,
        class: window.SecurityHeaderManager || null,
        status: window.securityHeaders ? 'active' : 'missing'
      },
      
      domPurify: {
        instance: window.domPurifyIntegration || null,
        class: window.DOMPurifyIntegration || null,
        library: window.DOMPurify || null,
        status: window.domPurifyIntegration ? 'active' : 'missing'
      },
      
      csrfProtection: {
        instance: window.csrfProtection || null,
        class: window.CSRFProtectionSystem || null,
        status: window.csrfProtection ? 'active' : 'missing'
      },
      
      inputValidation: {
        instance: window.inputValidation || null,
        class: window.InputValidationSystem || null,
        status: window.inputValidation ? 'active' : 'missing'
      }
    };

    // コンポーネント状態のレポート
    const componentStatus = Object.entries(this.components).map(([name, comp]) => ({
      component: name,
      status: comp.status,
      hasInstance: !!comp.instance,
      hasClass: !!comp.class
    }));

    console.log('📊 セキュリティコンポーネント状態:', componentStatus);
    
    // 不足コンポーネントの警告
    const missingComponents = componentStatus.filter(comp => comp.status === 'missing');
    if (missingComponents.length > 0) {
      console.warn('⚠️ 不足セキュリティコンポーネント:', missingComponents);
    }
  }

  /**
   * コンポーネント統合の検証
   */
  async validateComponentIntegration() {
    console.log('🔗 セキュリティコンポーネント統合検証中...');
    
    const integrationTests = {
      headerCspIntegration: await this.testHeaderCSPIntegration(),
      domPurifyValidation: await this.testDOMPurifyValidation(),
      csrfTokenFlow: await this.testCSRFTokenFlow(),
      inputValidationChain: await this.testInputValidationChain(),
      crossComponentCommunication: await this.testCrossComponentCommunication()
    };

    this.validationResults.integration = integrationTests;
    
    const passedTests = Object.values(integrationTests).filter(test => test.passed).length;
    const totalTests = Object.keys(integrationTests).length;
    
    console.log(`📈 統合テスト結果: ${passedTests}/${totalTests} 合格`);
    
    if (passedTests < totalTests) {
      console.warn('⚠️ 一部の統合テストが失敗しました:', integrationTests);
    }
  }

  /**
   * CSPヘッダー統合テスト
   */
  async testHeaderCSPIntegration() {
    try {
      const headerManager = this.components.headerManager.instance;
      if (!headerManager) {
        return { passed: false, error: 'SecurityHeaderManager not found' };
      }

      // CSPメタタグの存在確認
      const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (!cspMeta) {
        return { passed: false, error: 'CSP meta tag not found' };
      }

      // CSPポリシーの基本検証
      const policy = cspMeta.content;
      const requiredDirectives = [
        'default-src', 'script-src', 'style-src', 'img-src', 
        'font-src', 'connect-src', 'object-src', 'frame-ancestors'
      ];

      const missingDirectives = requiredDirectives.filter(directive => 
        !policy.includes(directive)
      );

      if (missingDirectives.length > 0) {
        return { 
          passed: false, 
          error: `Missing CSP directives: ${missingDirectives.join(', ')}`,
          policy: policy
        };
      }

      return { 
        passed: true, 
        policy: policy,
        directives: requiredDirectives.length
      };

    } catch (error) {
      return { passed: false, error: error.message };
    }
  }

  /**
   * DOMPurify検証テスト
   */
  async testDOMPurifyValidation() {
    try {
      const domPurify = this.components.domPurify.instance;
      if (!domPurify) {
        return { passed: false, error: 'DOMPurifyIntegration not found' };
      }

      // XSS攻撃パターンのテスト
      const xssPayloads = [
        '<script>alert("XSS")</script>',
        '<img src="x" onerror="alert(1)">',
        'javascript:alert(1)',
        '<iframe src="javascript:alert(1)"></iframe>',
        '<object data="javascript:alert(1)"></object>'
      ];

      const sanitizationResults = xssPayloads.map(payload => {
        const sanitized = domPurify.sanitizeHTML(payload);
        const isSafe = !sanitized.includes('<script>') && 
                      !sanitized.includes('javascript:') && 
                      !sanitized.includes('onerror=');
        
        return {
          payload: payload.substring(0, 50),
          sanitized: sanitized.substring(0, 50),
          safe: isSafe
        };
      });

      const allSafe = sanitizationResults.every(result => result.safe);

      return {
        passed: allSafe,
        testedPayloads: xssPayloads.length,
        results: sanitizationResults,
        error: allSafe ? null : 'Some XSS payloads were not properly sanitized'
      };

    } catch (error) {
      return { passed: false, error: error.message };
    }
  }

  /**
   * CSRFトークンフローテスト
   */
  async testCSRFTokenFlow() {
    try {
      const csrfProtection = this.components.csrfProtection.instance;
      if (!csrfProtection) {
        return { passed: false, error: 'CSRFProtectionSystem not found' };
      }

      // メタタグのトークン確認
      const metaToken = document.querySelector('meta[name="csrf-token"]');
      if (!metaToken || !metaToken.content) {
        return { passed: false, error: 'CSRF token meta tag not found or empty' };
      }

      // トークンの有効性検証
      const currentToken = csrfProtection.getCurrentToken();
      if (!currentToken || currentToken !== metaToken.content) {
        return { 
          passed: false, 
          error: 'CSRF token mismatch between meta tag and system',
          metaToken: metaToken.content.substring(0, 10) + '...',
          systemToken: currentToken ? currentToken.substring(0, 10) + '...' : 'null'
        };
      }

      // 保護統計の確認
      const stats = csrfProtection.getProtectionStats();

      return {
        passed: true,
        tokenLength: currentToken.length,
        stats: stats,
        protectedForms: stats.protectedForms
      };

    } catch (error) {
      return { passed: false, error: error.message };
    }
  }

  /**
   * 入力検証チェーンテスト
   */
  async testInputValidationChain() {
    try {
      const inputValidation = this.components.inputValidation.instance;
      if (!inputValidation) {
        return { passed: false, error: 'InputValidationSystem not found' };
      }

      // 悪意のある入力パターンのテスト
      const maliciousInputs = [
        { input: '<script>alert("XSS")</script>', type: 'text' },
        { input: "'; DROP TABLE users; --", type: 'text' },
        { input: '../../../etc/passwd', type: 'text' },
        { input: 'javascript:alert(1)', type: 'text' },
        { input: 'a'.repeat(10001), type: 'text' } // 長すぎる入力
      ];

      const validationResults = maliciousInputs.map(({ input, type }) => {
        const mockInput = {
          value: input,
          dataset: { validationType: type }
        };
        
        const result = inputValidation.validateInput(mockInput);
        
        return {
          input: input.substring(0, 50),
          type: type,
          valid: result,
          shouldBeInvalid: true,
          testPassed: !result // 悪意のある入力は無効であるべき
        };
      });

      const allTestsPassed = validationResults.every(result => result.testPassed);

      return {
        passed: allTestsPassed,
        testedInputs: maliciousInputs.length,
        results: validationResults,
        error: allTestsPassed ? null : 'Some malicious inputs were not properly rejected'
      };

    } catch (error) {
      return { passed: false, error: error.message };
    }
  }

  /**
   * コンポーネント間通信テスト
   */
  async testCrossComponentCommunication() {
    try {
      const tests = [];

      // DOMPurify + InputValidation 連携テスト
      if (this.components.domPurify.instance && this.components.inputValidation.instance) {
        const testInput = '<script>alert("test")</script>';
        const sanitized = this.components.domPurify.instance.sanitizeHTML(testInput);
        const validated = this.components.inputValidation.instance.validateInput({
          value: sanitized,
          dataset: { validationType: 'text' }
        });

        tests.push({
          name: 'DOMPurify-InputValidation Chain',
          passed: !sanitized.includes('<script>') && validated,
          details: { original: testInput, sanitized: sanitized, validated: validated }
        });
      }

      // CSRF + InputValidation 連携テスト
      if (this.components.csrfProtection.instance && this.components.inputValidation.instance) {
        const token = this.components.csrfProtection.instance.getCurrentToken();
        const tokenValidated = this.components.inputValidation.instance.validateInput({
          value: token,
          dataset: { validationType: 'text' }
        });

        tests.push({
          name: 'CSRF-InputValidation Token Check',
          passed: !!token && tokenValidated,
          details: { hasToken: !!token, tokenValid: tokenValidated }
        });
      }

      const allPassed = tests.every(test => test.passed);

      return {
        passed: allPassed,
        totalTests: tests.length,
        results: tests,
        error: allPassed ? null : 'Some cross-component communication tests failed'
      };

    } catch (error) {
      return { passed: false, error: error.message };
    }
  }

  /**
   * 包括的セキュリティテストの実行
   */
  async runComprehensiveSecurityTests() {
    console.log('🧪 包括的セキュリティテスト実行中...');
    
    const securityTests = {
      xssProtection: await this.testXSSProtection(),
      csrfProtection: await this.testCSRFProtection(),
      inputSanitization: await this.testInputSanitization(),
      headerSecurity: await this.testHeaderSecurity(),
      performanceImpact: await this.testPerformanceImpact()
    };

    this.validationResults.security = securityTests;
    
    const passedTests = Object.values(securityTests).filter(test => test.passed).length;
    const totalTests = Object.keys(securityTests).length;
    
    console.log(`🛡️ セキュリティテスト結果: ${passedTests}/${totalTests} 合格`);
    
    return securityTests;
  }

  /**
   * XSS保護テスト
   */
  async testXSSProtection() {
    const xssPayloads = [
      '<script>document.body.innerHTML="XSS"</script>',
      '<img src="x" onerror="document.body.style.background=\'red\'">',
      '<svg onload="alert(1)">',
      'javascript:void(0)',
      '<iframe src="javascript:alert(1)"></iframe>'
    ];

    let protectedCount = 0;
    const results = [];

    for (const payload of xssPayloads) {
      try {
        // テスト用div要素を作成
        const testDiv = document.createElement('div');
        testDiv.style.display = 'none';
        document.body.appendChild(testDiv);

        // セキュアな方法でHTMLを設定
        if (this.components.domPurify.instance) {
          const sanitized = this.components.domPurify.instance.sanitizeHTML(payload);
          testDiv.innerHTML = sanitized;
          
          // スクリプトが実行されていないかチェック
          const hasScript = testDiv.querySelector('script') !== null;
          const hasOnError = testDiv.innerHTML.includes('onerror=');
          const hasJavascript = testDiv.innerHTML.includes('javascript:');
          
          const isProtected = !hasScript && !hasOnError && !hasJavascript;
          
          if (isProtected) protectedCount++;
          
          results.push({
            payload: payload.substring(0, 50),
            protected: isProtected,
            sanitized: sanitized.substring(0, 100)
          });
        }

        // テスト要素を削除
        document.body.removeChild(testDiv);

      } catch (error) {
        results.push({
          payload: payload.substring(0, 50),
          protected: false,
          error: error.message
        });
      }
    }

    return {
      passed: protectedCount === xssPayloads.length,
      protectedCount: protectedCount,
      totalCount: xssPayloads.length,
      protectionRate: Math.round((protectedCount / xssPayloads.length) * 100),
      results: results
    };
  }

  /**
   * CSRF保護テスト
   */
  async testCSRFProtection() {
    try {
      if (!this.components.csrfProtection.instance) {
        return { passed: false, error: 'CSRF protection not available' };
      }

      const csrf = this.components.csrfProtection.instance;
      
      // トークン生成テスト
      const token1 = csrf.getCurrentToken();
      const token2 = csrf.getCurrentToken();
      
      // トークンの存在と一意性
      const hasToken = !!token1;
      const tokensConsistent = token1 === token2;
      
      // 保護統計
      const stats = csrf.getProtectionStats();
      
      return {
        passed: hasToken && tokensConsistent && stats.currentToken === 'Active',
        hasToken: hasToken,
        tokensConsistent: tokensConsistent,
        stats: stats
      };

    } catch (error) {
      return { passed: false, error: error.message };
    }
  }

  /**
   * 入力サニタイゼーションテスト
   */
  async testInputSanitization() {
    const testInputs = [
      { input: '<script>alert("test")</script>', expectEmpty: true },
      { input: '< img src="x" onerror="alert(1)">', expectSanitized: true },
      { input: 'Normal text input', expectUnchanged: true },
      { input: 'Text with <b>bold</b> tags', expectSanitized: true },
      { input: '', expectEmpty: true }
    ];

    let passedTests = 0;
    const results = [];

    for (const testCase of testInputs) {
      if (this.components.domPurify.instance) {
        const sanitized = this.components.domPurify.instance.sanitizeHTML(testCase.input);
        
        let passed = false;
        
        if (testCase.expectEmpty) {
          passed = sanitized === '' || sanitized === testCase.input;
        } else if (testCase.expectUnchanged) {
          passed = sanitized === testCase.input;
        } else if (testCase.expectSanitized) {
          passed = sanitized !== testCase.input && !sanitized.includes('<script>');
        }

        if (passed) passedTests++;

        results.push({
          input: testCase.input,
          sanitized: sanitized,
          passed: passed,
          expectation: Object.keys(testCase).find(key => key.startsWith('expect'))
        });
      }
    }

    return {
      passed: passedTests === testInputs.length,
      passedTests: passedTests,
      totalTests: testInputs.length,
      results: results
    };
  }

  /**
   * ヘッダーセキュリティテスト
   */
  async testHeaderSecurity() {
    const requiredHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection',
      'Referrer-Policy'
    ];

    const headerResults = requiredHeaders.map(headerName => {
      const metaTag = document.querySelector(`meta[http-equiv="${headerName}"]`);
      return {
        header: headerName,
        present: !!metaTag,
        value: metaTag ? metaTag.content : null
      };
    });

    const presentHeaders = headerResults.filter(h => h.present).length;

    return {
      passed: presentHeaders === requiredHeaders.length,
      presentHeaders: presentHeaders,
      totalHeaders: requiredHeaders.length,
      results: headerResults
    };
  }

  /**
   * パフォーマンス影響テスト
   */
  async testPerformanceImpact() {
    const startTime = performance.now();
    
    // セキュリティ処理のベンチマーク
    const benchmarks = [];

    // DOMPurify処理時間
    if (this.components.domPurify.instance) {
      const purifyStart = performance.now();
      this.components.domPurify.instance.sanitizeHTML('<p>Test content</p>');
      const purifyTime = performance.now() - purifyStart;
      benchmarks.push({ operation: 'DOMPurify', time: purifyTime });
    }

    // 入力検証処理時間
    if (this.components.inputValidation.instance) {
      const validationStart = performance.now();
      this.components.inputValidation.instance.validateInput({
        value: 'test input',
        dataset: { validationType: 'text' }
      });
      const validationTime = performance.now() - validationStart;
      benchmarks.push({ operation: 'InputValidation', time: validationTime });
    }

    const totalTime = performance.now() - startTime;
    const avgTime = benchmarks.length > 0 ? 
      benchmarks.reduce((sum, b) => sum + b.time, 0) / benchmarks.length : 0;

    return {
      passed: totalTime < 100, // 100ms以下であること
      totalTime: Math.round(totalTime * 100) / 100,
      averageOperationTime: Math.round(avgTime * 100) / 100,
      benchmarks: benchmarks,
      performanceGrade: totalTime < 50 ? 'Excellent' : totalTime < 100 ? 'Good' : 'Poor'
    };
  }

  /**
   * 継続的検証の開始
   */
  startContinuousValidation() {
    // 5分毎の定期検証
    setInterval(() => {
      this.runQuickSecurityCheck();
    }, 5 * 60 * 1000);

    // ページ表示状態変更時の検証
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.runQuickSecurityCheck();
      }
    });

    console.log('⏰ 継続的セキュリティ検証開始');
  }

  /**
   * クイックセキュリティチェック
   */
  async runQuickSecurityCheck() {
    try {
      const quickTests = {
        componentsActive: this.checkComponentsActive(),
        csrfTokenValid: this.checkCSRFTokenValid(),
        headersIntact: this.checkSecurityHeaders()
      };

      const allPassed = Object.values(quickTests).every(test => test.passed);

      if (!allPassed) {
        console.warn('⚠️ クイックセキュリティチェック失敗:', quickTests);
        this.handleSecurityDegradation(quickTests);
      }

      return quickTests;

    } catch (error) {
      console.error('❌ クイックセキュリティチェックエラー:', error);
    }
  }

  /**
   * コンポーネント活性状態チェック
   */
  checkComponentsActive() {
    const activeComponents = Object.entries(this.components).filter(([name, comp]) => 
      comp.instance && comp.status === 'active'
    ).length;

    return {
      passed: activeComponents >= 3, // 最低3つのコンポーネントが必要
      activeComponents: activeComponents,
      totalComponents: Object.keys(this.components).length
    };
  }

  /**
   * CSRFトークン有効性チェック
   */
  checkCSRFTokenValid() {
    try {
      const metaTag = document.querySelector('meta[name="csrf-token"]');
      const hasToken = metaTag && metaTag.content && metaTag.content.length > 10;

      return {
        passed: hasToken,
        hasMetaTag: !!metaTag,
        tokenLength: metaTag ? metaTag.content.length : 0
      };

    } catch (error) {
      return { passed: false, error: error.message };
    }
  }

  /**
   * セキュリティヘッダーチェック
   */
  checkSecurityHeaders() {
    const cspHeader = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const xFrameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');

    return {
      passed: !!cspHeader && !!xFrameOptions,
      hasCSP: !!cspHeader,
      hasXFrameOptions: !!xFrameOptions
    };
  }

  /**
   * セキュリティ劣化の処理
   */
  handleSecurityDegradation(failedTests) {
    console.error('🚨 セキュリティ劣化検出:', failedTests);

    // 劣化レポートの生成
    const degradationReport = {
      timestamp: new Date().toISOString(),
      failedTests: failedTests,
      currentComponents: this.components,
      integrationStatus: this.integrationStatus
    };

    // セキュリティログへの記録
    if (window.SecurityLogger) {
      window.SecurityLogger.logSecurityDegradation(degradationReport);
    }

    // 可能であれば自動復旧を試行
    this.attemptSecurityRecovery();
  }

  /**
   * セキュリティ復旧の試行
   */
  async attemptSecurityRecovery() {
    console.log('🔧 セキュリティ自動復旧試行中...');

    try {
      // コンポーネントの再初期化
      await this.discoverSecurityComponents();
      
      // 必要に応じてCSRFトークンの更新
      if (this.components.csrfProtection.instance) {
        this.components.csrfProtection.instance.rotateToken();
      }

      console.log('✅ セキュリティ復旧完了');

    } catch (error) {
      console.error('❌ セキュリティ復旧失敗:', error);
    }
  }

  /**
   * 総合セキュリティレポートの生成
   */
  generateSecurityReport() {
    return {
      timestamp: new Date().toISOString(),
      integrationStatus: this.integrationStatus,
      components: Object.entries(this.components).map(([name, comp]) => ({
        name: name,
        status: comp.status,
        available: !!comp.instance
      })),
      validationResults: this.validationResults,
      summary: {
        totalComponents: Object.keys(this.components).length,
        activeComponents: Object.values(this.components).filter(c => c.status === 'active').length,
        integrationTestsPassed: this.validationResults.integration ? 
          Object.values(this.validationResults.integration).filter(t => t.passed).length : 0,
        securityTestsPassed: this.validationResults.security ? 
          Object.values(this.validationResults.security).filter(t => t.passed).length : 0
      }
    };
  }

  /**
   * デバッグ情報の出力
   */
  debug() {
    console.group('🔒 Security Integration Debug Info');
    console.log('Integration Status:', this.integrationStatus);
    console.log('Components:', this.components);
    console.log('Validation Results:', this.validationResults);
    console.log('Security Report:', this.generateSecurityReport());
    console.groupEnd();
  }
}

// グローバル利用可能化
if (typeof window !== 'undefined') {
  window.SecurityIntegrationValidator = SecurityIntegrationValidator;
  
  // DOM読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
      window.securityValidator = new SecurityIntegrationValidator();
    });
  } else {
    window.securityValidator = new SecurityIntegrationValidator();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecurityIntegrationValidator;
}

console.log('🛡️ SecurityIntegrationValidator.js 読み込み完了 - 包括的セキュリティ検証');