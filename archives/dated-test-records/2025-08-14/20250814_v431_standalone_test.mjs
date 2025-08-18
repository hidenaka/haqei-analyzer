/**
 * v4.3.1スタンドアロンテスト
 */

import { chromium } from 'playwright';

async function testV431Standalone() {
  console.log('🧪 v4.3.1スタンドアロンテスト開始');
  
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
    
    // コンソールログ監視
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      console.log(`[${type.toUpperCase()}] ${text}`);
    });
    
    console.log('📍 スタンドアロンテストページを開いています...');
    await page.goto('http://localhost:8788/20250814_v431_standalone_test.html', { 
      waitUntil: 'networkidle',
      timeout: 10000
    });
    
    // 初期化完了まで待機
    await page.waitForTimeout(6000);
    
    console.log(`🔍 JavaScript エラー数: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('❌ 検出されたエラー:');
      errors.forEach(error => console.log(`  - ${error}`));
    }
    
    // v4.3.1の状態確認
    const v431State = await page.evaluate(() => {
      return {
        available: typeof window.FutureSimulatorV431 !== 'undefined',
        btnExists: !!document.getElementById('aiGuessBtn'),
        btnDisabled: document.getElementById('aiGuessBtn')?.disabled,
        btnBound: document.getElementById('aiGuessBtn')?.dataset?.bound
      };
    });
    
    console.log('🔍 v4.3.1状態:', v431State);
    
    if (v431State.available && !v431State.btnDisabled) {
      console.log('✅ v4.3.1が正常に読み込まれ、ボタンが有効です！');
      
      // 実際にテスト実行
      await page.fill('#worryInput', 'チームの人間関係が複雑で、仕事の効率が悪い。解決策はあるか？');
      await page.click('#aiGuessBtn');
      
      // 結果を少し待つ
      await page.waitForTimeout(5000);
      
      // カード数確認
      const cardCount = await page.locator('.scenario-card-v431').count();
      console.log(`🎯 生成されたカード数: ${cardCount}`);
      
      if (cardCount === 8) {
        console.log('🎉 8カード生成成功！');
      } else if (cardCount > 0) {
        console.log(`⚠️ カード数異常: 期待値8, 実際${cardCount}`);
      } else {
        console.log('❌ カード生成失敗');
      }
    } else if (!v431State.available) {
      console.log('❌ v4.3.1スクリプトが読み込まれていません');
    } else if (v431State.btnDisabled) {
      console.log('❌ ボタンが無効化されています');
    }
    
    // スクリーンショット
    await page.screenshot({ 
      path: '20250814_v431_standalone_result.png',
      fullPage: true 
    });
    
    return {
      errors: errors.length,
      v431Available: v431State.available,
      buttonEnabled: !v431State.btnDisabled,
      success: v431State.available && !v431State.btnDisabled && errors.length === 0
    };
    
  } catch (error) {
    console.error('❌ テストエラー:', error);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

// 実行
testV431Standalone().then(result => {
  console.log('🎯 スタンドアロンテスト結果:', result);
  if (result.success) {
    console.log('🎉 v4.3.1スタンドアロンテスト成功！');
  } else {
    console.log('💥 v4.3.1スタンドアロンテスト失敗');
  }
}).catch(console.error);