/**
 * 実ブラウザ動作検証システム
 * Playwright使用 - ユーザー視点での動作確認
 * 
 * @date 2025-08-16
 */

const { chromium } = require('playwright');
const fs = require('fs');

console.log('🌐 実ブラウザ動作検証開始');
console.log(`📅 実行日時: ${new Date().toISOString()}`);

async function verifyRealBrowserOperation() {
  let browser = null;
  let page = null;
  
  const results = {
    passed: 0,
    failed: 0,
    errors: [],
    screenshots: []
  };
  
  try {
    // 1. ブラウザ起動
    console.log('\n1️⃣ ブラウザ起動中...');
    browser = await chromium.launch({ 
      headless: false, // 実際の画面で確認
      slowMo: 1000 // 操作を見やすくする
    });
    page = await browser.newPage();
    
    // 2. Future Simulatorページアクセス
    console.log('\n2️⃣ Future Simulatorページアクセス');
    const startTime = Date.now();
    
    await page.goto('http://localhost:8788/future_simulator.html', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    const loadTime = Date.now() - startTime;
    console.log(`✅ ページロード完了 (${loadTime}ms)`);
    
    // スクリーンショット撮影
    await page.screenshot({ 
      path: 'browser_test_initial_load.png',
      fullPage: false 
    });
    results.screenshots.push('browser_test_initial_load.png');
    results.passed++;
    
    // 3. コンソールエラー確認
    console.log('\n3️⃣ コンソールエラー確認');
    let hasConsoleErrors = false;
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`❌ Console Error: ${msg.text()}`);
        hasConsoleErrors = true;
        results.errors.push(`Console Error: ${msg.text()}`);
      }
    });
    
    // 少し待ってJavaScriptの初期化を完了させる
    await page.waitForTimeout(3000);
    
    if (!hasConsoleErrors) {
      console.log('✅ コンソールエラーなし');
      results.passed++;
    } else {
      console.log('❌ コンソールエラーあり');
      results.failed++;
    }
    
    // 4. Phase 2クラス存在確認
    console.log('\n4️⃣ Phase 2クラス存在確認');
    
    const phase2Classes = await page.evaluate(() => {
      return {
        EnhancedH384DataExtractor: typeof window.EnhancedH384DataExtractor !== 'undefined',
        ExpressionVariationEngine: typeof window.ExpressionVariationEngine !== 'undefined', 
        ExpressionQualityValidator: typeof window.ExpressionQualityValidator !== 'undefined',
        FutureSimulatorExpression: typeof window.FutureSimulatorExpression !== 'undefined'
      };
    });
    
    let phase2ClassesOK = 0;
    Object.entries(phase2Classes).forEach(([className, exists]) => {
      if (exists) {
        console.log(`✅ ${className} クラス読み込み確認`);
        phase2ClassesOK++;
      } else {
        console.log(`❌ ${className} クラス未読み込み`);
        results.errors.push(`Phase 2クラス未読み込み: ${className}`);
      }
    });
    
    if (phase2ClassesOK === 4) {
      console.log('✅ Phase 2クラス: 全て読み込み完了');
      results.passed++;
    } else {
      console.log(`❌ Phase 2クラス: 不完全 (${phase2ClassesOK}/4)`);
      results.failed++;
    }
    
    // 5. テキスト入力フィールド確認
    console.log('\n5️⃣ テキスト入力フィールド確認');
    
    const inputSelector = 'textarea[placeholder*="悩み"], input[type="text"], textarea';
    await page.waitForSelector(inputSelector, { timeout: 10000 });
    
    const inputField = await page.$(inputSelector);
    if (inputField) {
      console.log('✅ テキスト入力フィールド発見');
      results.passed++;
    } else {
      console.log('❌ テキスト入力フィールド未発見');
      results.failed++;
      results.errors.push('テキスト入力フィールドが見つからない');
    }
    
    // 6. 実際のテキスト入力テスト
    console.log('\n6️⃣ 実際のテキスト入力テスト');
    
    const testText = '新しい仕事で人手不足で困っています。チームの協力を得て効率的に進めたいです。';
    
    await page.fill(inputSelector, testText);
    console.log(`✅ テキスト入力完了: "${testText}"`);
    
    // スクリーンショット撮影
    await page.screenshot({ 
      path: 'browser_test_text_input.png',
      fullPage: false 
    });
    results.screenshots.push('browser_test_text_input.png');
    results.passed++;
    
    // 7. 分析ボタンクリックテスト
    console.log('\n7️⃣ 分析ボタンクリックテスト');
    
    const buttonSelector = 'button[onclick*="analyze"], button:has-text("分析"), button:has-text("開始"), .analyze-button, #analyze-btn';
    
    try {
      await page.waitForSelector(buttonSelector, { timeout: 5000 });
      const analyzeButton = await page.$(buttonSelector);
      
      if (analyzeButton) {
        console.log('✅ 分析ボタン発見');
        
        // ボタンクリック
        await analyzeButton.click();
        console.log('✅ 分析ボタンクリック完了');
        
        // 処理完了まで待機
        await page.waitForTimeout(5000);
        
        results.passed++;
      } else {
        console.log('❌ 分析ボタン未発見');
        results.failed++;
        results.errors.push('分析ボタンが見つからない');
      }
    } catch (error) {
      console.log(`❌ 分析ボタン操作エラー: ${error.message}`);
      results.failed++;
      results.errors.push(`分析ボタン操作エラー: ${error.message}`);
    }
    
    // 8. 結果表示確認
    console.log('\n8️⃣ 結果表示確認');
    
    const resultSelector = '.scenario-card, .result-card, #results, .analysis-result';
    
    try {
      await page.waitForSelector(resultSelector, { timeout: 10000 });
      
      const resultElements = await page.$$(resultSelector);
      
      if (resultElements.length > 0) {
        console.log(`✅ 結果表示確認: ${resultElements.length}個の要素`);
        
        // 8カード表示確認
        if (resultElements.length >= 8) {
          console.log('✅ 8カード表示確認');
          results.passed++;
        } else {
          console.log(`⚠️ カード表示不足: ${resultElements.length}/8`);
          results.errors.push(`8カード表示不足: ${resultElements.length}個のみ`);
          results.failed++;
        }
        
        // スクリーンショット撮影
        await page.screenshot({ 
          path: 'browser_test_results.png',
          fullPage: false 
        });
        results.screenshots.push('browser_test_results.png');
        
      } else {
        console.log('❌ 結果表示なし');
        results.failed++;
        results.errors.push('分析結果が表示されない');
      }
    } catch (error) {
      console.log(`❌ 結果表示確認エラー: ${error.message}`);
      results.failed++;
      results.errors.push(`結果表示確認エラー: ${error.message}`);
    }
    
    // 最終スクリーンショット
    await page.screenshot({ 
      path: 'browser_test_final_state.png',
      fullPage: false 
    });
    results.screenshots.push('browser_test_final_state.png');
    
  } catch (error) {
    console.error(`🚨 ブラウザテスト実行エラー: ${error.message}`);
    results.failed++;
    results.errors.push(`ブラウザテスト実行エラー: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  return results;
}

/**
 * 検証結果レポート生成
 */
function generateBrowserTestReport(results) {
  const totalTests = results.passed + results.failed;
  const successRate = totalTests > 0 ? Math.round((results.passed / totalTests) * 100) : 0;
  
  console.log('\n' + '='.repeat(60));
  console.log('🌐 実ブラウザ動作検証結果');
  console.log('='.repeat(60));
  console.log(`✅ 成功: ${results.passed} テスト`);
  console.log(`❌ 失敗: ${results.failed} テスト`);
  console.log(`📊 成功率: ${successRate}%`);
  
  if (results.errors.length > 0) {
    console.log('\n🚨 検出された問題:');
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }
  
  if (results.screenshots.length > 0) {
    console.log('\n📸 生成されたスクリーンショット:');
    results.screenshots.forEach((screenshot) => {
      console.log(`- ${screenshot}`);
    });
  }
  
  // 評価
  let evaluation;
  if (successRate >= 90) {
    evaluation = '🎉 優秀 - ユーザー体験良好';
  } else if (successRate >= 75) {
    evaluation = '✅ 良好 - 軽微な問題あり';
  } else if (successRate >= 60) {
    evaluation = '⚠️ 改善要 - 重要な問題あり';
  } else {
    evaluation = '🚨 不合格 - 致命的問題あり';
  }
  
  console.log(`\n📊 総合評価: ${evaluation}`);
  
  return {
    totalTests,
    successRate,
    evaluation,
    errors: results.errors,
    screenshots: results.screenshots
  };
}

/**
 * メイン実行関数
 */
async function runRealBrowserVerification() {
  console.log('🔍 実ブラウザ動作検証開始');
  console.log(`📅 実行日時: ${new Date().toISOString()}`);
  
  // 検証実行
  const testResults = await verifyRealBrowserOperation();
  
  // レポート生成
  const report = generateBrowserTestReport(testResults);
  
  return {
    ...report,
    timestamp: new Date().toISOString(),
    testDetails: testResults
  };
}

// メイン実行
if (require.main === module) {
  runRealBrowserVerification().catch(console.error);
}

module.exports = { runRealBrowserVerification };