/**
 * OS Analyzer パフォーマンステスト
 * 新旧システムの比較検証
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

class PerformanceTest {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      timestamp: new Date().toISOString(),
      tests: []
    };
  }

  async init() {
    console.log('🚀 パフォーマンステスト開始...');
    
    this.browser = await puppeteer.launch({
      headless: false, // デバッグ用に表示
      slowMo: 50,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    
    // ネットワーク監視
    await this.page.setRequestInterception(true);
    this.page.on('request', (request) => {
      if (request.url().includes('.js')) {
        console.log(`📦 JS Loading: ${request.url().split('/').pop()}`);
      }
      request.continue();
    });
    
    // コンソールログを監視
    this.page.on('console', (msg) => {
      if (msg.text().includes('⚡') || msg.text().includes('🎨') || msg.text().includes('💾')) {
        console.log(`🖥️  ${msg.text()}`);
      }
    });
    
    // パフォーマンスメトリクス監視
    await this.page.evaluateOnNewDocument(() => {
      window.performanceData = {
        loadTimes: [],
        renderTimes: [],
        memoryUsage: [],
        domElementCounts: []
      };
    });
  }

  async testInitialLoad() {
    console.log('\n📊 テスト1: 初期読み込み速度');
    
    const startTime = Date.now();
    
    await this.page.goto('http://localhost:8788/public/os_analyzer.html');
    
    // DOMContentLoadedを待機
    await this.page.waitForSelector('#welcome-container', { timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    
    // JavaScriptファイルの読み込み状況を確認
    const jsLoadStatus = await this.page.evaluate(() => {
      return {
        hasBaseComponent: typeof BaseComponent !== 'undefined',
        hasStorageManager: typeof StorageManager !== 'undefined',
        hasDataManager: typeof DataManager !== 'undefined',
        hasVirtualQuestionFlow: typeof VirtualQuestionFlow !== 'undefined',
        hasHaqeiQuestionElement: typeof HaqeiQuestionElement !== 'undefined',
        hasWelcomeScreen: typeof WelcomeScreen !== 'undefined'
      };
    });
    
    const testResult = {
      name: 'initial_load',
      loadTime,
      success: jsLoadStatus.hasWelcomeScreen,
      details: jsLoadStatus
    };
    
    this.results.tests.push(testResult);
    
    console.log(`✅ 初期読み込み: ${loadTime}ms`);
    console.log('📦 コンポーネント読み込み状況:', jsLoadStatus);
    
    return testResult;
  }

  async testQuestionFlowPerformance() {
    console.log('\n📊 テスト2: 設問フロー開始速度');
    
    // 診断開始ボタンをクリック
    await this.page.waitForSelector('.start-diagnosis-btn', { timeout: 5000 });
    
    const startTime = Date.now();
    await this.page.click('.start-diagnosis-btn');
    
    // Virtual Question Flowの初期化を待機
    await this.page.waitForSelector('#virtual-viewport', { timeout: 10000 });
    
    const flowStartTime = Date.now() - startTime;
    
    // 設問レンダリング状況を確認
    const renderStatus = await this.page.evaluate(() => {
      const viewport = document.querySelector('#virtual-viewport');
      const questionElements = viewport ? viewport.querySelectorAll('haqei-question') : [];
      const activeElements = Array.from(questionElements).filter(el => el.style.display !== 'none');
      
      return {
        totalQuestions: window.WORLDVIEW_QUESTIONS ? window.WORLDVIEW_QUESTIONS.length : 0,
        renderedElements: questionElements.length,
        visibleElements: activeElements.length,
        hasVirtualViewport: !!viewport
      };
    });
    
    const testResult = {
      name: 'question_flow_start',
      flowStartTime,
      success: renderStatus.hasVirtualViewport && renderStatus.visibleElements > 0,
      details: renderStatus
    };
    
    this.results.tests.push(testResult);
    
    console.log(`✅ 設問フロー開始: ${flowStartTime}ms`);
    console.log('🎯 レンダリング状況:', renderStatus);
    
    return testResult;
  }

  async testQuestionNavigation() {
    console.log('\n📊 テスト3: 設問ナビゲーション速度');
    
    const navigationTimes = [];
    
    // 5回設問を進めてパフォーマンスを測定
    for (let i = 0; i < 5; i++) {
      // 最初の選択肢を選択
      const radioSelector = 'haqei-question input[type="radio"]';
      await this.page.waitForSelector(radioSelector, { timeout: 5000 });
      await this.page.click(radioSelector);
      
      // 次へボタンをクリック
      const startTime = Date.now();
      await this.page.click('#next-btn');
      
      // 次の設問の表示を待機
      await this.page.waitForFunction(() => {
        const currentQuestion = document.querySelector('.current-question');
        return currentQuestion && parseInt(currentQuestion.textContent) === i + 2;
      }, { timeout: 3000 });
      
      const navTime = Date.now() - startTime;
      navigationTimes.push(navTime);
      
      console.log(`➡️ 設問${i + 1}→${i + 2}: ${navTime}ms`);
    }
    
    const avgNavigationTime = navigationTimes.reduce((a, b) => a + b, 0) / navigationTimes.length;
    
    // パフォーマンス統計を取得
    const performanceStats = await this.page.evaluate(() => {
      if (window.app && window.app.questionFlow && window.app.questionFlow.getPerformanceStats) {
        return window.app.questionFlow.getPerformanceStats();
      }
      return null;
    });
    
    const testResult = {
      name: 'question_navigation',
      avgNavigationTime,
      allNavigationTimes: navigationTimes,
      success: avgNavigationTime < 100, // 100ms以下が目標
      details: { performanceStats }
    };
    
    this.results.tests.push(testResult);
    
    console.log(`✅ 平均ナビゲーション: ${avgNavigationTime.toFixed(1)}ms`);
    if (performanceStats) {
      console.log('⚡ パフォーマンス統計:', performanceStats);
    }
    
    return testResult;
  }

  async testMemoryUsage() {
    console.log('\n📊 テスト4: メモリ使用量');
    
    const memoryStats = await this.page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024), // MB
          totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024), // MB
          jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) // MB
        };
      }
      return null;
    });
    
    const domStats = await this.page.evaluate(() => {
      return {
        totalElements: document.querySelectorAll('*').length,
        questionElements: document.querySelectorAll('haqei-question').length,
        activeQuestions: Array.from(document.querySelectorAll('haqei-question')).filter(el => el.style.display !== 'none').length
      };
    });
    
    const testResult = {
      name: 'memory_usage',
      memoryStats,
      domStats,
      success: memoryStats ? memoryStats.usedJSHeapSize < 50 : true, // 50MB以下が目標
    };
    
    this.results.tests.push(testResult);
    
    console.log('💾 メモリ使用量:', memoryStats);
    console.log('🏗️ DOM統計:', domStats);
    
    return testResult;
  }

  async generateReport() {
    console.log('\n📄 テストレポート生成中...');
    
    // 総合評価
    const allTests = this.results.tests;
    const successfulTests = allTests.filter(test => test.success);
    const successRate = (successfulTests.length / allTests.length) * 100;
    
    this.results.summary = {
      totalTests: allTests.length,
      successfulTests: successfulTests.length,
      successRate: successRate.toFixed(1),
      overallGrade: successRate >= 80 ? 'A' : successRate >= 60 ? 'B' : 'C'
    };
    
    // レポートファイル保存
    const reportPath = `/Users/hideakimacbookair/Desktop/haqei-analyzer/performance-report-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    console.log('\n🎯 === テスト結果サマリー ===');
    console.log(`📊 総合成功率: ${this.results.summary.successRate}% (${successfulTests.length}/${allTests.length})`);
    console.log(`🏆 総合評価: ${this.results.summary.overallGrade}級`);
    console.log(`📄 詳細レポート: ${reportPath}`);
    
    // 個別テスト結果
    allTests.forEach(test => {
      const status = test.success ? '✅' : '❌';
      console.log(`${status} ${test.name}: ${test.success ? 'PASS' : 'FAIL'}`);
    });
    
    return this.results;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runFullTest() {
    try {
      await this.init();
      
      await this.testInitialLoad();
      await this.testQuestionFlowPerformance();
      await this.testQuestionNavigation();
      await this.testMemoryUsage();
      
      const report = await this.generateReport();
      
      await this.cleanup();
      
      return report;
      
    } catch (error) {
      console.error('❌ テスト実行エラー:', error);
      await this.cleanup();
      throw error;
    }
  }
}

// テスト実行
if (require.main === module) {
  const test = new PerformanceTest();
  test.runFullTest()
    .then(report => {
      console.log('\n🎉 テスト完了');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 テスト失敗:', error);
      process.exit(1);
    });
}

module.exports = PerformanceTest;