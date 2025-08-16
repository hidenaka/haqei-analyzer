import { chromium } from 'playwright';
import fs from 'fs';

console.log('🔍 Future Simulator 実動作テスト開始\n');

const results = {
  timestamp: new Date().toISOString(),
  checks: []
};

async function test() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // 1. ページ読み込み
    console.log('📄 ページ読み込みテスト...');
    await page.goto('file:///Users/hideakimacbookair/Desktop/haqei-analyzer/public/future_simulator.html');
    await page.waitForTimeout(2000);
    
    // コンソールエラーチェック
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    results.checks.push({
      test: 'ページ読み込み',
      result: 'SUCCESS',
      details: 'ページが正常に読み込まれました'
    });
    
    // 2. DOM要素確認
    console.log('🔍 DOM要素存在確認...');
    
    const worryInput = await page.$('#worryInput');
    const aiGuessBtn = await page.$('#aiGuessBtn');
    
    if (!worryInput) {
      results.checks.push({
        test: 'worryInput存在',
        result: 'FAIL',
        details: 'worryInput要素が見つかりません'
      });
    } else {
      results.checks.push({
        test: 'worryInput存在',
        result: 'SUCCESS',
        details: 'worryInput要素を確認'
      });
    }
    
    if (!aiGuessBtn) {
      results.checks.push({
        test: 'aiGuessBtn存在',
        result: 'FAIL',
        details: 'aiGuessBtn要素が見つかりません'
      });
    } else {
      results.checks.push({
        test: 'aiGuessBtn存在',
        result: 'SUCCESS',
        details: 'aiGuessBtn要素を確認'
      });
    }
    
    // 3. 実際の操作テスト
    console.log('⚡ 実際の操作テスト...');
    
    if (worryInput && aiGuessBtn) {
      // テキスト入力
      await worryInput.fill('転職を検討していますが、タイミングが分からず悩んでいます');
      await page.waitForTimeout(500);
      
      results.checks.push({
        test: 'テキスト入力',
        result: 'SUCCESS',
        details: 'テキストが正常に入力されました'
      });
      
      // ボタンクリック
      await aiGuessBtn.click();
      console.log('  ボタンクリック実行...');
      
      // 結果待ち（最大30秒）
      try {
        await page.waitForSelector('.analysis-result, .scenario-card, #results-section', { 
          timeout: 30000 
        });
        
        results.checks.push({
          test: '分析実行',
          result: 'SUCCESS',
          details: '分析が実行され、結果が表示されました'
        });
        
        // スクリーンショット
        await page.screenshot({ 
          path: '20250814_test_result.png',
          fullPage: true 
        });
        
        results.checks.push({
          test: 'スクリーンショット',
          result: 'SUCCESS',
          details: 'スクリーンショット保存: 20250814_test_result.png'
        });
        
      } catch (error) {
        results.checks.push({
          test: '分析実行',
          result: 'FAIL',
          details: `結果表示タイムアウト: ${error.message}`
        });
      }
    }
    
    // 4. コンソールエラー確認
    if (consoleErrors.length > 0) {
      results.checks.push({
        test: 'コンソールエラー',
        result: 'WARNING',
        details: `エラー検出: ${consoleErrors.join(', ')}`
      });
    } else {
      results.checks.push({
        test: 'コンソールエラー',
        result: 'SUCCESS',
        details: 'コンソールエラーなし'
      });
    }
    
  } catch (error) {
    results.checks.push({
      test: '全体エラー',
      result: 'FAIL',
      details: error.message
    });
  } finally {
    await browser.close();
  }
  
  // 結果出力
  console.log('\n📊 テスト結果サマリー:');
  console.log('='.repeat(50));
  
  let successCount = 0;
  let failCount = 0;
  let warningCount = 0;
  
  results.checks.forEach(check => {
    const emoji = check.result === 'SUCCESS' ? '✅' : 
                  check.result === 'FAIL' ? '❌' : '⚠️';
    console.log(`${emoji} ${check.test}: ${check.result}`);
    console.log(`   ${check.details}`);
    
    if (check.result === 'SUCCESS') successCount++;
    else if (check.result === 'FAIL') failCount++;
    else warningCount++;
  });
  
  console.log('='.repeat(50));
  console.log(`成功: ${successCount} / 失敗: ${failCount} / 警告: ${warningCount}`);
  
  // JSONとして保存
  fs.writeFileSync(
    '20250814_test_results.json',
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n📄 詳細結果: 20250814_test_results.json');
  
  // 判定
  const isSuccess = failCount === 0;
  console.log(`\n🎯 最終判定: ${isSuccess ? 'PASS ✅' : 'FAIL ❌'}`);
  
  return isSuccess;
}

test().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('テストエラー:', error);
  process.exit(1);
});