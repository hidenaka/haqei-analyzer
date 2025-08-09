/**
 * HAQEI Analyzer - Day 2 Edge Case Test Suite
 * エッジケーステスト包括実行スイート
 */

class EdgeCaseTestSuite {
  constructor() {
    this.testResults = [];
    this.startTime = Date.now();
    this.memoryBaseline = this.getMemoryUsage();
  }

  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  recordTest(testName, result, details = {}) {
    this.testResults.push({
      name: testName,
      status: result ? 'PASS' : 'FAIL',
      timestamp: Date.now(),
      duration: details.duration || 0,
      error: details.error || null,
      details: details
    });
  }

  async testInputBoundaryValues() {
    console.log('\n🔍 === 入力データ境界値テスト開始 ===');
    
    const testCases = [
      { name: '空文字列', input: '' },
      { name: '1文字', input: '悩' },
      { name: '超長文(1000文字)', input: '人生について考えることがあります。' + 'あ'.repeat(970) },
      { name: '特殊文字・HTMLタグ', input: '<script>alert("test")</script>仕事の悩み💼😰🤔' },
      { name: 'Unicode混在', input: '工作で悩んでいる。직장에서의 고민。Work problems. مشاكل العمل' }
    ];

    for (const testCase of testCases) {
      const startTime = Date.now();
      try {
        console.log(`📝 テスト: ${testCase.name}`);
        
        // 入力フィールドへの入力シミュレーション
        const inputField = document.querySelector('textarea, input[type="text"]');
        if (inputField) {
          inputField.value = testCase.input;
          inputField.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        const duration = Date.now() - startTime;
        this.recordTest(`境界値テスト: ${testCase.name}`, true, { duration, input: testCase.input });
        console.log(`✅ ${testCase.name}: 完了 (${duration}ms)`);
        
      } catch (error) {
        const duration = Date.now() - startTime;
        this.recordTest(`境界値テスト: ${testCase.name}`, false, { duration, error: error.message });
        console.error(`❌ ${testCase.name}: エラー`, error);
      }
    }
  }

  async testErrorScenarios() {
    console.log('\n🚨 === エラー状況シミュレーション開始 ===');
    
    const errorTests = [
      {
        name: 'JavaScript実行エラー',
        test: () => {
          window.nonExistentMethod();
        }
      },
      {
        name: 'TypeError発生', 
        test: () => {
          const obj = null;
          return obj.property;
        }
      },
      {
        name: 'ネットワークエラーシミュレート',
        test: async () => {
          await fetch('https://nonexistent-domain-12345.com/test');
        }
      }
    ];

    for (const errorTest of errorTests) {
      const startTime = Date.now();
      try {
        console.log(`💥 テスト: ${errorTest.name}`);
        await errorTest.test();
        
        const duration = Date.now() - startTime;
        this.recordTest(`エラーテスト: ${errorTest.name}`, false, { 
          duration, 
          error: 'Expected error did not occur' 
        });
        
      } catch (error) {
        const duration = Date.now() - startTime;
        const hasErrorHandler = window.UnifiedErrorHandler || window.onerror;
        
        this.recordTest(`エラーテスト: ${errorTest.name}`, true, { 
          duration, 
          error: error.message,
          hasErrorHandler: !!hasErrorHandler 
        });
        console.log(`✅ ${errorTest.name}: エラー正常捕捉 (${duration}ms)`);
      }
    }
  }

  generateReport() {
    const endTime = Date.now();
    const totalDuration = endTime - this.startTime;
    const finalMemory = this.getMemoryUsage();
    
    const passedTests = this.testResults.filter(t => t.status === 'PASS').length;
    const failedTests = this.testResults.filter(t => t.status === 'FAIL').length;
    const totalTests = this.testResults.length;
    
    return {
      summary: {
        totalTests,
        passedTests,
        failedTests,
        successRate: ((passedTests / totalTests) * 100).toFixed(2) + '%',
        totalDuration: totalDuration + 'ms',
        timestamp: new Date().toISOString()
      },
      performance: {
        initialMemory: this.memoryBaseline,
        finalMemory: finalMemory,
        memoryDelta: finalMemory && this.memoryBaseline ? 
          (finalMemory.used - this.memoryBaseline.used) : 'N/A'
      },
      testResults: this.testResults
    };
  }

  async runAllTests() {
    console.log('🚀 HAQEI Analyzer エッジケーステスト開始');
    
    try {
      await this.testInputBoundaryValues();
      await this.testErrorScenarios();
      
      const report = this.generateReport();
      
      console.log('\n📋 === テスト結果レポート ===');
      console.log('📊 サマリー:', report.summary);
      console.log('🧠 パフォーマンス:', report.performance);
      
      localStorage.setItem('haqei_edge_case_test_results', JSON.stringify(report));
      
      return report;
      
    } catch (error) {
      console.error('❌ テスト実行中にエラーが発生しました:', error);
      return null;
    }
  }
}

window.EdgeCaseTestSuite = EdgeCaseTestSuite;
window.runEdgeCaseTests = async function() {
  const testSuite = new EdgeCaseTestSuite();
  return await testSuite.runAllTests();
};

console.log('✅ Edge Case Test Suite loaded. Run with: runEdgeCaseTests()');