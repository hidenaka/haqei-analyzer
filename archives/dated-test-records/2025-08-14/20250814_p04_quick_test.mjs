/**
 * P0-4: 簡易テスト - 修正後の動作確認
 */

import { chromium } from 'playwright';

async function quickTest() {
  console.log('🧪 修正後の簡易テスト開始');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-web-security']
  });
  
  try {
    const page = await browser.newPage();
    
    // エラー監視
    const errors = [];
    page.on('pageerror', error => {
      errors.push(error.message);
      console.error('❌ Page Error:', error.message);
    });
    
    console.log('📍 Future Simulatorページを開いています...');
    await page.goto('http://localhost:8788/future_simulator.html', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });
    
    // 2秒待機してJavaScriptの初期化を待つ
    await page.waitForTimeout(2000);
    
    // v4.3.1スクリプトの読み込み確認
    const v431Available = await page.evaluate(() => {
      return typeof window.FutureSimulatorV431 !== 'undefined';
    });
    
    console.log(`🔍 v4.3.1スクリプト: ${v431Available ? '✅ 読み込み成功' : '❌ 読み込み失敗'}`);
    console.log(`🔍 JavaScript エラー数: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('❌ 検出されたエラー:');
      errors.forEach(error => console.log(`  - ${error}`));
    }
    
    // 基本的な入力とクリックテスト
    await page.fill('#worryInput', 'テスト入力');
    
    // ボタンの状態確認
    const buttonState = await page.evaluate(() => {
      const btn = document.getElementById('aiGuessBtn');
      return {
        exists: !!btn,
        disabled: btn?.disabled,
        text: btn?.textContent?.trim(),
        bound: btn?.dataset?.bound
      };
    });
    
    console.log('🔍 ボタン状態:', buttonState);
    
    // ボタンクリック
    await page.click('#aiGuessBtn');
    
    // 短時間待機
    await page.waitForTimeout(3000);
    
    // 結果確認
    const hasResults = await page.locator('.scenarios-main-container').count() > 0;
    console.log(`🔍 結果表示: ${hasResults ? '✅ 成功' : '❌ 失敗'}`);
    
    if (hasResults) {
      const cardCount = await page.locator('.scenario-card-v431').count();
      console.log(`🎯 カード数: ${cardCount}`);
    }
    
    // スクリーンショット
    await page.screenshot({ 
      path: '20250814_p04_quick_test_result.png', 
      fullPage: true 
    });
    
    return {
      v431Loaded: v431Available,
      errorCount: errors.length,
      buttonWorking: hasResults,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ テストエラー:', error);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

// 実行
quickTest().then(result => {
  console.log('🎯 テスト結果:', result);
}).catch(console.error);