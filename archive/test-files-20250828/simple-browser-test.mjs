import { chromium } from 'playwright';

async function testFullFlow() {
  console.log('🚀 質問システム全体フローテストを開始します...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  try {
    // OS Analyzerページにアクセス
    console.log('📱 OS Analyzerページにアクセス中...');
    await page.goto('file://' + process.cwd() + '/public/os_analyzer.html');
    
    // ページ読み込み待機
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    console.log('✅ ページ読み込み完了');
    
    // スクリーンショット（初期画面）
    await page.screenshot({ 
      path: 'test-results/01-initial-page.png',
      fullPage: true 
    });
    
    console.log('📸 初期画面スクリーンショット保存');
    
    // スタートボタンを探す
    const startSelectors = [
      'text=開始',
      'text=スタート', 
      'text=START',
      '.start-btn',
      '[data-action="start"]',
      'button'
    ];
    
    let started = false;
    for (const selector of startSelectors) {
      try {
        const button = await page.locator(selector).first();
        if (await button.isVisible({ timeout: 2000 })) {
          console.log(`🎯 スタートボタン発見: ${selector}`);
          await button.click();
          started = true;
          break;
        }
      } catch (e) {
        console.log(`⏭️ ${selector} 試行`);
      }
    }
    
    if (!started) {
      console.log('⚠️ スタートボタンが見つかりません。手動操作が必要かもしれません。');
      
      // すべてのボタンをリストアップ
      const allButtons = await page.locator('button, [role="button"], .btn').all();
      console.log(`🔍 発見されたボタン数: ${allButtons.length}`);
      
      for (let i = 0; i < Math.min(allButtons.length, 3); i++) {
        try {
          const buttonText = await allButtons[i].textContent();
          console.log(`ボタン${i + 1}: "${buttonText}"`);
          
          if (buttonText && (buttonText.includes('開始') || buttonText.includes('スタート') || buttonText.includes('START'))) {
            console.log(`🎯 スタートボタンを発見してクリック: "${buttonText}"`);
            await allButtons[i].click();
            started = true;
            break;
          }
        } catch (e) {
          console.log(`ボタン${i + 1}: テキスト取得失敗`);
        }
      }
    }
    
    if (started) {
      console.log('✅ スタートボタンクリック成功');
      await page.waitForTimeout(3000);
      
      // 質問画面の確認
      await page.screenshot({ 
        path: 'test-results/02-after-start.png',
        fullPage: true 
      });
      
      console.log('📸 スタート後スクリーンショット保存');
      
      // 自動回答実行（全部Aを選択）
      console.log('🤖 自動回答開始（全質問にA選択）...');
      
      for (let i = 1; i <= 36; i++) {
        try {
          // 質問番号確認
          const questionNumber = await page.locator('.question-number, .q-number, [data-question]').textContent().catch(() => '不明');
          console.log(`📝 質問${i}: ${questionNumber}`);
          
          // 選択肢Aをクリック
          const optionSelectors = [
            'input[value="A"]',
            'button[data-value="A"]',
            '.option-A',
            'text=A.',
            '[data-option="A"]'
          ];
          
          let optionSelected = false;
          for (const selector of optionSelectors) {
            try {
              const option = await page.locator(selector).first();
              if (await option.isVisible({ timeout: 1000 })) {
                await option.click();
                optionSelected = true;
                console.log(`✅ 選択肢A選択完了`);
                break;
              }
            } catch (e) {
              continue;
            }
          }
          
          if (!optionSelected) {
            console.log(`⚠️ 質問${i}で選択肢Aが見つかりません`);
          }
          
          // 次へボタンをクリック
          const nextSelectors = [
            'text=次へ',
            'text=Next',
            '.next-btn',
            '[data-action="next"]',
            'button:has-text("次")'
          ];
          
          let nextClicked = false;
          for (const selector of nextSelectors) {
            try {
              const nextBtn = await page.locator(selector).first();
              if (await nextBtn.isVisible({ timeout: 1000 })) {
                await nextBtn.click();
                nextClicked = true;
                break;
              }
            } catch (e) {
              continue;
            }
          }
          
          if (!nextClicked) {
            console.log(`⚠️ 質問${i}で次へボタンが見つかりません`);
          }
          
          await page.waitForTimeout(500);
          
          // 最後の質問の場合は結果ページを待つ
          if (i === 36) {
            console.log('🎯 最終質問完了 - 結果ページを待機中...');
            await page.waitForTimeout(5000);
            break;
          }
        } catch (error) {
          console.log(`❌ 質問${i}でエラー: ${error.message}`);
        }
      }
      
      // 結果ページの確認
      console.log('📊 結果ページの確認中...');
      
      await page.screenshot({ 
        path: 'test-results/03-results-page.png',
        fullPage: true 
      });
      
      console.log('📸 結果ページスクリーンショット保存');
      
      // 結果の内容確認
      const pageContent = await page.content();
      const hasResults = pageContent.includes('結果') || pageContent.includes('Result') || 
                        pageContent.includes('Engine OS') || pageContent.includes('Interface OS') || 
                        pageContent.includes('Safe Mode');
      
      if (hasResults) {
        console.log('✅ 結果ページが正常に表示されています');
        
        // Triple OS結果の確認
        try {
          const engineOS = await page.locator('text=Engine OS').textContent({ timeout: 2000 }).catch(() => '未検出');
          const interfaceOS = await page.locator('text=Interface OS').textContent({ timeout: 2000 }).catch(() => '未検出');
          const safeModeOS = await page.locator('text=Safe Mode').textContent({ timeout: 2000 }).catch(() => '未検出');
          
          console.log(`📊 Engine OS: ${engineOS}`);
          console.log(`📊 Interface OS: ${interfaceOS}`);
          console.log(`📊 Safe Mode OS: ${safeModeOS}`);
        } catch (e) {
          console.log('⚠️ Triple OS結果の詳細取得に失敗');
        }
      } else {
        console.log('⚠️ 結果ページが正常に表示されていない可能性があります');
      }
      
      console.log('🎉 全フローテスト完了！');
      
    } else {
      console.log('❌ スタートボタンが見つからなかったため、フローテストを完了できませんでした');
    }
    
  } catch (error) {
    console.error('❌ テスト実行エラー:', error.message);
    await page.screenshot({ 
      path: 'test-results/error-screenshot.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
    console.log('✅ ブラウザ終了');
  }
}

// 実行
testFullFlow().catch(console.error);