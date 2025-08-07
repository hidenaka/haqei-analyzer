// 自動テストスクリプト - 30問完全動作確認
import { chromium } from 'playwright';

(async () => {
  console.log('🚀 HAQEI 30問動作確認テスト開始...\n');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // エラー監視
    const errors = [];
    page.on('pageerror', error => {
      errors.push(error.message);
      console.error('❌ ページエラー:', error.message);
    });
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
        console.error('❌ コンソールエラー:', msg.text());
      }
    });
    
    // ページを開く
    console.log('📄 os_analyzer.htmlを開いています...');
    await page.goto('http://localhost:3001/os_analyzer.html');
    await page.waitForTimeout(2000);
    
    // ウェルカム画面の確認
    const welcomeScreen = await page.$('#welcomeScreen');
    if (welcomeScreen) {
      console.log('✅ ウェルカム画面表示確認');
    } else {
      console.error('❌ ウェルカム画面が表示されていません');
      process.exit(1);
    }
    
    // スタートボタンをクリック
    console.log('🎬 分析を開始...');
    await page.click('#startButton');
    await page.waitForTimeout(1000);
    
    // 30問に回答
    console.log('\n📝 30問への回答開始...');
    for (let i = 1; i <= 30; i++) {
      try {
        // 質問が表示されるまで待つ
        await page.waitForSelector('.question-container', { timeout: 5000 });
        
        // 質問テキストを取得
        const questionText = await page.$eval('.question-text', el => el.textContent);
        console.log(`  質問 ${i}/30: ${questionText.substring(0, 40)}...`);
        
        // 回答ボタンを取得して最初のボタンをクリック
        const buttons = await page.$$('.answer-button');
        if (buttons.length > 0) {
          await buttons[0].click();
        } else {
          console.error(`  ❌ 質問 ${i} の回答ボタンが見つかりません`);
          break;
        }
        
        await page.waitForTimeout(500);
      } catch (error) {
        console.error(`❌ 質問 ${i} でエラー:`, error.message);
        break;
      }
    }
    
    // 結果表示を待つ
    console.log('\n⏳ 結果表示を待っています...');
    await page.waitForTimeout(3000);
    
    // 結果コンテナの確認
    const resultsVisible = await page.evaluate(() => {
      const container = document.getElementById('resultsContainer');
      return container && container.style.display !== 'none';
    });
    
    if (resultsVisible) {
      console.log('✅ 結果画面が表示されました');
      
      // Chart.jsの確認
      const chartLoaded = await page.evaluate(() => typeof Chart !== 'undefined');
      console.log(`✅ Chart.js読み込み: ${chartLoaded ? '成功' : '失敗'}`);
      
      // getHexagramData関数の確認
      const hexagramFuncExists = await page.evaluate(() => {
        const engine = window.tripleOSEngine;
        return engine && typeof engine.getHexagramData === 'function';
      });
      console.log(`✅ getHexagramData関数: ${hexagramFuncExists ? '存在' : '不在'}`);
      
      // レイヤーボタンの確認
      const layerButtons = await page.$$('.layer-button');
      console.log(`✅ レイヤーボタン数: ${layerButtons.length}`);
      
    } else {
      console.error('❌ 結果画面が表示されませんでした');
    }
    
    // エラーサマリー
    console.log('\n📊 テスト結果サマリー:');
    if (errors.length === 0) {
      console.log('🎉 エラーなし！すべて正常に動作しています。');
    } else {
      console.log(`⚠️  ${errors.length}個のエラーが検出されました:`);
      errors.slice(0, 5).forEach((err, i) => {
        console.log(`  ${i + 1}. ${err.substring(0, 100)}`);
      });
    }
    
  } catch (error) {
    console.error('❌ テスト実行エラー:', error.message);
  } finally {
    await browser.close();
    console.log('\n✅ テスト完了');
  }
})();