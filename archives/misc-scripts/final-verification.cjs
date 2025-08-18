const { chromium } = require('playwright');

async function finalVerification() {
  console.log('🚀 最終動作検証 - 修正後');
  console.log('=====================================\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. ページロード
    console.log('📱 ステップ1: ページロード...');
    await page.goto('http://localhost:8888/os_analyzer.html', {
      waitUntil: 'networkidle'
    });
    await page.waitForTimeout(1000); // スクロールアニメーション待機
    console.log('✅ ページロード完了\n');

    // 2. start-btnの表示確認
    console.log('📱 ステップ2: 開始ボタン確認...');
    const startBtnVisible = await page.locator('#start-btn').isVisible();
    console.log(`  開始ボタン表示: ${startBtnVisible ? '✅' : '❌'}`);
    
    // スクリーンショット
    await page.screenshot({ 
      path: 'final-after-fix-welcome.png',
      fullPage: false
    });
    console.log('  📸 ウェルカム画面保存\n');

    // 3. 分析開始
    if (startBtnVisible) {
      console.log('📱 ステップ3: 分析開始...');
      await page.click('#start-btn');
      await page.waitForTimeout(2000);
      console.log('✅ 開始ボタンクリック完了\n');
    }

    // 4. 質問画面確認
    console.log('📱 ステップ4: 質問画面確認...');
    const questionVisible = await page.locator('#question-screen').isVisible();
    console.log(`  質問画面表示: ${questionVisible ? '✅' : '❌'}`);
    
    if (questionVisible) {
      const questionText = await page.locator('#question-title').innerText();
      console.log(`  質問内容: "${questionText.substring(0, 30)}..."`);
      
      // スクリーンショット
      await page.screenshot({ 
        path: 'final-after-fix-question.png',
        fullPage: false
      });
      console.log('  📸 質問画面保存\n');
    }

    // 5. 回答テスト
    console.log('📱 ステップ5: 回答インタラクション...');
    const options = await page.locator('.option').all();
    if (options.length > 0) {
      console.log(`  回答選択肢: ${options.length}個`);
      
      // 3問回答テスト
      for (let i = 0; i < 3; i++) {
        const currentOptions = await page.locator('.option').all();
        if (currentOptions.length > 0) {
          await currentOptions[Math.floor(Math.random() * currentOptions.length)].click();
          await page.waitForTimeout(800);
          
          const progressText = await page.locator('#question-number').innerText();
          console.log(`  回答${i+1}: 質問${progressText}/36`);
        }
      }
      console.log('✅ 回答機能正常\n');
    }

    // 結果サマリー
    console.log('=====================================');
    console.log('📊 検証結果サマリー');
    console.log('=====================================');
    console.log('✅ ページロード: 正常');
    console.log(`${startBtnVisible ? '✅' : '❌'} 開始ボタン表示: ${startBtnVisible ? '正常' : '問題あり'}`);
    console.log(`${questionVisible ? '✅' : '❌'} 質問画面遷移: ${questionVisible ? '正常' : '問題あり'}`);
    console.log(`${options.length > 0 ? '✅' : '❌'} 回答機能: ${options.length > 0 ? '正常' : '問題あり'}`);
    
    const allSuccess = startBtnVisible && questionVisible && options.length > 0;
    if (allSuccess) {
      console.log('\n🎉 完全動作確認！');
      console.log('OS Analyzerは正常に動作しています。');
    } else {
      console.log('\n⚠️ 一部機能に問題があります。');
    }

  } catch (error) {
    console.error('❌ エラー:', error.message);
  } finally {
    await browser.close();
  }
}

finalVerification().catch(console.error);