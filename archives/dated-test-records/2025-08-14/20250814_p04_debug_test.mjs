/**
 * P0-4: Debug Test - なぜ分析が実行されないかを調査
 */

import { chromium } from 'playwright';

async function debugFutureSimulator() {
  console.log('🕵️ P0-4: デバッグ調査開始');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-web-security']
  });
  
  try {
    const page = await browser.newPage();
    
    // コンソールログを監視
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      console.log(`[${type.toUpperCase()}] ${text}`);
    });
    
    // エラーを監視
    page.on('pageerror', error => {
      console.error('❌ Page Error:', error.message);
    });
    
    console.log('📍 Future Simulatorページを開いています...');
    await page.goto('http://localhost:8788/future_simulator.html', { 
      waitUntil: 'networkidle',
      timeout: 10000
    });
    
    // ページの基本状態を確認
    const hasWorryInput = await page.locator('#worryInput').count() > 0;
    const hasAiGuessBtn = await page.locator('#aiGuessBtn').count() > 0;
    const hasResultsContainer = await page.locator('#resultsContainer').count() > 0;
    
    console.log('🔍 DOM要素の存在確認:');
    console.log(`  #worryInput: ${hasWorryInput}`);
    console.log(`  #aiGuessBtn: ${hasAiGuessBtn}`);
    console.log(`  #resultsContainer: ${hasResultsContainer}`);
    
    if (!hasWorryInput || !hasAiGuessBtn || !hasResultsContainer) {
      console.error('❌ 必須DOM要素が不足しています');
      return { success: false, error: 'Missing DOM elements' };
    }
    
    // ボタンの状態を確認
    const buttonDisabled = await page.locator('#aiGuessBtn').getAttribute('disabled');
    const buttonText = await page.locator('#aiGuessBtn').textContent();
    const buttonBound = await page.locator('#aiGuessBtn').getAttribute('data-bound');
    
    console.log('🔍 ボタンの状態:');
    console.log(`  disabled: ${buttonDisabled}`);
    console.log(`  text: "${buttonText}"`);
    console.log(`  data-bound: ${buttonBound}`);
    
    // v4.3.1のスクリプトが読み込まれているか確認
    const v431Script = await page.evaluate(() => {
      return typeof window.FutureSimulatorV431 !== 'undefined';
    });
    
    console.log(`🔍 v4.3.1スクリプト読み込み: ${v431Script}`);
    
    // 入力フィールドにテスト値を設定
    const testInput = 'チームの人間関係が複雑で、仕事の効率が悪い。解決策はあるか？';
    await page.fill('#worryInput', testInput);
    console.log('📝 テスト入力を設定完了');
    
    // ボタンクリック前のコンソール監視
    console.log('🎯 ボタンクリックを実行...');
    
    // JavaScriptでボタンクリックイベントを直接発火
    const clickResult = await page.evaluate(() => {
      const btn = document.getElementById('aiGuessBtn');
      if (!btn) return { error: 'Button not found' };
      
      console.log('Direct button click attempt');
      btn.click();
      
      return { 
        success: true,
        buttonExists: !!btn,
        buttonDisabled: btn.disabled,
        buttonText: btn.textContent,
        hasEventListeners: btn.dataset.bound === '1'
      };
    });
    
    console.log('🔍 ボタンクリック結果:', clickResult);
    
    // 3秒待機してから再度確認
    await page.waitForTimeout(3000);
    
    // 結果コンテナの変化を確認
    const resultsVisible = await page.locator('#resultsContainer').isVisible();
    const resultsContent = await page.locator('#resultsContainer').innerHTML();
    
    console.log('🔍 結果コンテナ状態:');
    console.log(`  visible: ${resultsVisible}`);
    console.log(`  content length: ${resultsContent.length}`);
    console.log(`  content preview: ${resultsContent.substring(0, 100)}...`);
    
    // 現在のボタンの状態を再確認
    const currentButtonText = await page.locator('#aiGuessBtn').textContent();
    const currentButtonDisabled = await page.locator('#aiGuessBtn').getAttribute('disabled');
    
    console.log('🔍 ボタンの現在状態:');
    console.log(`  text: "${currentButtonText}"`);
    console.log(`  disabled: ${currentButtonDisabled}`);
    
    // 最終スクリーンショット
    await page.screenshot({ 
      path: '20250814_p04_debug_screenshot.png',
      fullPage: true 
    });
    
    const diagnosis = {
      domElementsExist: hasWorryInput && hasAiGuessBtn && hasResultsContainer,
      v431ScriptLoaded: v431Script,
      buttonClickExecuted: clickResult.success,
      resultsAppeared: resultsContent.length > 50,
      buttonTextChanged: buttonText !== currentButtonText
    };
    
    console.log('🎯 診断結果:', diagnosis);
    
    return diagnosis;
    
  } catch (error) {
    console.error('❌ デバッグテストエラー:', error);
    return { success: false, error: error.message };
  } finally {
    // ブラウザを開いたまま残しておく（調査のため）
    console.log('🔍 ブラウザを開いたまま残します（手動確認用）');
    // await browser.close();
  }
}

// メイン実行
if (import.meta.url === `file://${process.argv[1]}`) {
  debugFutureSimulator()
    .then(result => {
      console.log('🎉 デバッグ調査完了');
      console.log('詳細:', result);
    })
    .catch(error => {
      console.error('💥 デバッグ調査失敗:', error);
    });
}