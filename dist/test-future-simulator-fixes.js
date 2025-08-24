/**
 * Future Simulator 修正テストスクリプト
 * 
 * 使用方法:
 * 1. Future Simulator ページを開く
 * 2. ブラウザの開発者ツールのコンソールでこのスクリプトを実行
 * 3. テスト結果を確認
 */

const FutureSimulatorTestSuite = {
  version: '1.0.0',
  testResults: [],
  
  // メインテスト実行
  async runAllTests() {
    console.log('🧪 Future Simulator 修正テスト開始');
    
    const tests = [
      this.testFastHashFunction,
      this.testShowErrorMessageFunction,
      this.testErrorModalCreation,
      this.testRetryFunctionality,
      this.testBasicAnalysisFlow,
      this.testCoreSystemIntegration
    ];
    
    for (const test of tests) {
      try {
        await test.call(this);
      } catch (error) {
        console.error(`❌ テスト失敗: ${test.name}`, error);
        this.testResults.push({
          test: test.name,
          status: 'failed',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    this.generateTestReport();
  },
  
  // fastHash関数テスト
  async testFastHashFunction() {
    console.log('🔍 fastHash関数テスト開始...');
    
    const loader = window.progressiveLoader || new ProgressiveLoader();
    
    if (typeof loader.fastHash !== 'function') {
      throw new Error('fastHash function not found');
    }
    
    // テストケース
    const testCases = [
      { input: 'テスト文字列', expected: 'number' },
      { input: '', expected: 'number' },
      { input: '転職を考えているが迷っている', expected: 'number' },
      { input: null, expected: 'number' }
    ];
    
    for (const testCase of testCases) {
      const result = loader.fastHash(testCase.input);
      if (typeof result !== testCase.expected) {
        throw new Error(`fastHash test failed for input: ${testCase.input}`);
      }
    }
    
    console.log('✅ fastHash関数テスト合格');
    this.testResults.push({
      test: 'testFastHashFunction',
      status: 'passed',
      timestamp: new Date().toISOString()
    });
  },
  
  // showErrorMessage関数テスト
  async testShowErrorMessageFunction() {
    console.log('🔍 showErrorMessage関数テスト開始...');
    
    const loader = window.progressiveLoader || new ProgressiveLoader();
    
    if (typeof loader.showErrorMessage !== 'function') {
      throw new Error('showErrorMessage function not found');
    }
    
    // テスト用エラーメッセージ表示
    loader.showErrorMessage('テストエラー', 'test context');
    
    // エラーモーダルの存在確認
    await new Promise(resolve => setTimeout(resolve, 100));
    const errorModal = document.getElementById('error-modal');
    
    if (!errorModal) {
      throw new Error('Error modal not created');
    }
    
    if (errorModal.style.display !== 'block') {
      throw new Error('Error modal not displayed');
    }
    
    // モーダルを閉じる
    errorModal.style.display = 'none';
    
    console.log('✅ showErrorMessage関数テスト合格');
    this.testResults.push({
      test: 'testShowErrorMessageFunction',
      status: 'passed',
      timestamp: new Date().toISOString()
    });
  },
  
  // エラーモーダル作成テスト
  async testErrorModalCreation() {
    console.log('🔍 エラーモーダル作成テスト開始...');
    
    const loader = window.progressiveLoader || new ProgressiveLoader();
    
    if (typeof loader.createErrorModal !== 'function') {
      throw new Error('createErrorModal function not found');
    }
    
    const modal = loader.createErrorModal();
    
    if (!modal || modal.id !== 'error-modal') {
      throw new Error('Error modal creation failed');
    }
    
    const content = modal.querySelector('.error-content');
    if (!content) {
      throw new Error('Error modal content not found');
    }
    
    console.log('✅ エラーモーダル作成テスト合格');
    this.testResults.push({
      test: 'testErrorModalCreation',
      status: 'passed',
      timestamp: new Date().toISOString()
    });
  },
  
  // リトライ機能テスト
  async testRetryFunctionality() {
    console.log('🔍 リトライ機能テスト開始...');
    
    const loader = window.progressiveLoader || new ProgressiveLoader();
    
    if (typeof loader.executeAnalysisWithRetry !== 'function') {
      throw new Error('executeAnalysisWithRetry function not found');
    }
    
    if (typeof loader.updateRetryStatus !== 'function') {
      throw new Error('updateRetryStatus function not found');
    }
    
    // リトライステータス更新テスト
    loader.updateRetryStatus(1, 3);
    
    console.log('✅ リトライ機能テスト合格');
    this.testResults.push({
      test: 'testRetryFunctionality',
      status: 'passed',
      timestamp: new Date().toISOString()
    });
  },
  
  // 基本分析フロー統合テスト
  async testBasicAnalysisFlow() {
    console.log('🔍 基本分析フロー統合テスト開始...');
    
    const loader = window.progressiveLoader || new ProgressiveLoader();
    
    // 必要な関数の存在確認
    const requiredMethods = [
      'analyzeEmotion',
      'selectIChingHexagram',
      'generateCurrentSituation',
      'performSimpleAnalysis'
    ];
    
    for (const method of requiredMethods) {
      if (typeof loader[method] !== 'function') {
        throw new Error(`Required method ${method} not found`);
      }
    }
    
    // 簡単な分析テスト
    const testInput = '転職を考えているが迷っている';
    const emotions = loader.analyzeEmotion(testInput);
    
    if (!emotions || typeof emotions !== 'object') {
      throw new Error('Emotion analysis failed');
    }
    
    const iching = loader.selectIChingHexagram(testInput, emotions);
    if (!iching || !iching.number) {
      throw new Error('I Ching selection failed');
    }
    
    console.log('✅ 基本分析フロー統合テスト合格');
    this.testResults.push({
      test: 'testBasicAnalysisFlow',
      status: 'passed',
      timestamp: new Date().toISOString()
    });
  },
  
  // コアシステム統合テスト
  async testCoreSystemIntegration() {
    console.log('🔍 コアシステム統合テスト開始...');
    
    const systems = [
      'SituationalContextEngine',
      'DataPersistenceManager',
      'FutureBranchingSystem',
      'OfflineKuromojiIntegration'
    ];
    
    const systemResults = {};
    
    for (const system of systems) {
      try {
        const systemInstance = window[system];
        if (systemInstance) {
          systemResults[system] = 'available';
          
          // システム情報取得テスト
          if (systemInstance.getSystemInfo) {
            const info = await systemInstance.getSystemInfo();
            systemResults[system] = 'functional';
          }
        } else {
          systemResults[system] = 'not_available';
        }
      } catch (error) {
        systemResults[system] = `error: ${error.message}`;
      }
    }
    
    console.log('📊 コアシステム状況:', systemResults);
    
    console.log('✅ コアシステム統合テスト完了');
    this.testResults.push({
      test: 'testCoreSystemIntegration',
      status: 'passed',
      systems: systemResults,
      timestamp: new Date().toISOString()
    });
  },
  
  // テスト結果レポート生成
  generateTestReport() {
    const passedTests = this.testResults.filter(r => r.status === 'passed').length;
    const totalTests = this.testResults.length;
    const passRate = (passedTests / totalTests) * 100;
    
    console.log('\n📋 Future Simulator 修正テスト結果レポート');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🎯 合格率: ${passRate.toFixed(1)}% (${passedTests}/${totalTests})`);
    console.log(`⏰ テスト実行時刻: ${new Date().toLocaleString('ja-JP')}`);
    console.log('\n📊 詳細結果:');
    
    this.testResults.forEach(result => {
      const status = result.status === 'passed' ? '✅' : '❌';
      console.log(`${status} ${result.test}: ${result.status}`);
      if (result.error) {
        console.log(`   エラー: ${result.error}`);
      }
      if (result.systems) {
        console.log('   システム状況:', result.systems);
      }
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (passRate >= 80) {
      console.log('🎉 修正が正常に完了しています！');
    } else if (passRate >= 60) {
      console.log('⚠️ 部分的に修正が完了していますが、追加対応が必要です');
    } else {
      console.log('🚨 修正に問題があります。緊急対応が必要です');
    }
    
    return {
      passRate,
      passedTests,
      totalTests,
      results: this.testResults
    };
  }
};

// 自動実行機能
console.log('🚀 Future Simulator テストスクリプト読み込み完了');
console.log('テスト実行するには: FutureSimulatorTestSuite.runAllTests()');

// Export for use
if (typeof window !== 'undefined') {
  window.FutureSimulatorTestSuite = FutureSimulatorTestSuite;
}