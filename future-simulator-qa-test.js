const playwright = require('playwright');
const fs = require('fs');

async function comprehensiveQATest() {
  console.log('🧪 Future Simulator QA 包括テスト開始');
  
  const testReport = {
    timestamp: new Date().toISOString(),
    overall: { status: 'RUNNING', score: 0, errors: [] },
    basicTests: { status: 'PENDING', results: [] },
    virtualUser: { 
      status: 'PENDING',
      persona: '佐藤美由紀（32歳、マーケティング職）',
      scenario: '転職検討の悩み',
      steps: []
    },
    screenshots: [],
    performance: {},
    recommendations: []
  };

  const browser = await playwright.chromium.launch({ 
    headless: false,
    args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  });
  
  const page = await context.newPage();

  // コンソールログ監視
  page.on('console', msg => {
    if (msg.type() === 'error') {
      testReport.overall.errors.push({
        type: 'console_error',
        message: msg.text(),
        location: msg.location()
      });
    }
  });

  try {
    // Test 1: 基本機能テスト
    console.log('📋 Basic Functionality Test');
    testReport.basicTests.status = 'RUNNING';
    
    const startTime = Date.now();
    await page.goto('http://localhost:8080/future_simulator.html', { 
      waitUntil: 'load', 
      timeout: 15000 
    });
    const loadTime = Date.now() - startTime;
    testReport.performance.loadTime = loadTime;
    
    // スクリーンショット: 初期画面
    await page.screenshot({ 
      path: 'screenshot-initial.png', 
      fullPage: true 
    });
    testReport.screenshots.push({
      name: 'initial_screen',
      file: 'screenshot-initial.png'
    });
    
    testReport.basicTests.results.push({
      test: 'Page Load',
      status: loadTime < 3000 ? 'PASS' : 'WARN',
      value: `${loadTime}ms`,
      expected: '<3000ms'
    });

    // 初期化完了まで待機
    await page.waitForTimeout(5000);
    
    // CSS適用確認
    const hasValidCSS = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      return styles.fontFamily && styles.fontFamily \!== 'initial';
    });
    
    testReport.basicTests.results.push({
      test: 'CSS Application',
      status: hasValidCSS ? 'PASS' : 'FAIL',
      value: hasValidCSS ? 'Applied' : 'Not Applied'
    });

    testReport.basicTests.status = 'COMPLETED';

    // Test 2: 仮想ユーザー体験（佐藤美由紀さん）
    console.log('👤 Virtual User Experience Test');
    testReport.virtualUser.status = 'RUNNING';
    
    const testInput = '転職を考えているが、現在の会社での昇進のチャンスもある。どちらを選ぶべきか迷っている。家族のことも考慮すると決断が難しい';
    
    // テキスト入力フィールド検索
    const inputSelectors = [
      '#situation-input',
      '#textInput', 
      'textarea[placeholder*="状況"]',
      'textarea'
    ];
    
    let inputField = null;
    for (const selector of inputSelectors) {
      try {
        inputField = await page.$(selector);
        if (inputField) break;
      } catch (e) {}
    }
    
    if (inputField) {
      await inputField.fill(testInput);
      testReport.virtualUser.steps.push({
        step: 'Text Input',
        status: 'SUCCESS',
        description: 'Successfully entered consultation text'
      });
      
      await page.waitForTimeout(1000);
    } else {
      testReport.virtualUser.steps.push({
        step: 'Text Input',
        status: 'FAIL',
        description: 'Could not find text input field'
      });
    }

    // 分析ボタン検索
    const buttonSelectors = [
      '#analyze-button',
      '#analyzeButton',
      'button[onclick*="analyze"]',
      '.analyze-btn'
    ];
    
    let analyzeButton = null;
    for (const selector of buttonSelectors) {
      try {
        analyzeButton = await page.$(selector);
        if (analyzeButton) break;
      } catch (e) {}
    }
    
    // ボタンが見つからない場合、テキストで検索
    if (\!analyzeButton) {
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && (text.includes('分析') || text.includes('シミュレート'))) {
          analyzeButton = btn;
          break;
        }
      }
    }
    
    if (analyzeButton) {
      // ボタン有効性確認
      const isEnabled = await analyzeButton.isEnabled();
      
      if (isEnabled) {
        await analyzeButton.click();
        testReport.virtualUser.steps.push({
          step: 'Analysis Start',
          status: 'SUCCESS',
          description: 'Analysis button clicked successfully'
        });
        
        // 分析処理待機
        await page.waitForTimeout(8000);
        
        // スクリーンショット: 分析後
        await page.screenshot({ 
          path: 'screenshot-analysis-result.png', 
          fullPage: true 
        });
        testReport.screenshots.push({
          name: 'analysis_result',
          file: 'screenshot-analysis-result.png'
        });
        
        // 結果表示確認
        const hasResults = await page.evaluate(() => {
          const resultElements = [
            document.getElementById('results-container'),
            document.getElementById('analysis-results'),
            document.querySelector('.results-section'),
            document.querySelector('.scenario-card')
          ];
          
          return resultElements.some(el => el && el.innerHTML && el.innerHTML.length > 100);
        });
        
        testReport.virtualUser.steps.push({
          step: 'Results Display',
          status: hasResults ? 'SUCCESS' : 'PARTIAL',
          description: hasResults ? 'Analysis results displayed' : 'Results may not be fully displayed'
        });
        
      } else {
        testReport.virtualUser.steps.push({
          step: 'Analysis Start', 
          status: 'FAIL',
          description: 'Analysis button is disabled'
        });
      }
    } else {
      testReport.virtualUser.steps.push({
        step: 'Button Detection',
        status: 'FAIL', 
        description: 'Could not find analysis button'
      });
    }

    testReport.virtualUser.status = 'COMPLETED';

    // Test 3: レスポンシブテスト
    console.log('📱 Responsive Design Test');
    
    // モバイル表示
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'screenshot-mobile.png', 
      fullPage: true 
    });
    testReport.screenshots.push({
      name: 'mobile_view',
      file: 'screenshot-mobile.png'
    });

    // タブレット表示  
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ 
      path: 'screenshot-tablet.png', 
      fullPage: true 
    });
    testReport.screenshots.push({
      name: 'tablet_view', 
      file: 'screenshot-tablet.png'
    });

    // デスクトップに戻す
    await page.setViewportSize({ width: 1200, height: 800 });

    // 総合評価計算
    const basicPassed = testReport.basicTests.results.filter(r => r.status === 'PASS').length;
    const basicTotal = testReport.basicTests.results.length;
    const userSuccess = testReport.virtualUser.steps.filter(s => s.status === 'SUCCESS').length;
    const userTotal = testReport.virtualUser.steps.length;
    
    const basicScore = basicTotal > 0 ? (basicPassed / basicTotal) * 50 : 0;
    const userScore = userTotal > 0 ? (userSuccess / userTotal) * 50 : 0;
    
    testReport.overall.score = Math.round(basicScore + userScore);
    testReport.overall.status = testReport.overall.score >= 70 ? 'PASS' : 'FAIL';

    // 推奨事項生成
    if (testReport.overall.errors.length > 0) {
      testReport.recommendations.push('Console errors need to be addressed');
    }
    
    if (testReport.performance.loadTime > 3000) {
      testReport.recommendations.push('Performance optimization needed');
    }
    
    if (testReport.overall.score < 80) {
      testReport.recommendations.push('Some functionality improvements required');
    }

    // レポート保存
    fs.writeFileSync('future-simulator-qa-report.json', 
                     JSON.stringify(testReport, null, 2), 'utf8');

    console.log('✅ QA Test Completed');
    console.log(`📊 Overall Score: ${testReport.overall.score}%`);
    console.log(`🎯 Status: ${testReport.overall.status}`);
    console.log(`📝 Screenshots: ${testReport.screenshots.length} captured`);
    console.log(`⚠️ Console Errors: ${testReport.overall.errors.length}`);

  } catch (error) {
    console.error('❌ Test Error:', error);
    testReport.overall.status = 'ERROR';
    testReport.overall.error = error.message;
    
    fs.writeFileSync('future-simulator-qa-report.json', 
                     JSON.stringify(testReport, null, 2), 'utf8');
  } finally {
    await browser.close();
    console.log('🏁 Browser closed - Test completed');
  }
}

comprehensiveQATest().catch(console.error);
EOF < /dev/null