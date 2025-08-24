import { chromium } from 'playwright';

async function testQuestionImprovements() {
  console.log('🚀 質問改善確認テストを開始します...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  try {
    // OS Analyzerページにアクセス
    console.log('📱 OS Analyzerページにアクセス中...');
    await page.goto('http://localhost:8787/os_analyzer.html');
    
    // ページ読み込み待機
    await page.waitForLoadState('networkidle');
    
    // 初期画面確認
    const title = await page.locator('h1').textContent();
    console.log(`✅ ページタイトル: ${title}`);
    
    // スタートボタンを探して実行
    console.log('🎯 スタートボタンをクリック...');
    
    // 複数のセレクタパターンを試行
    const startSelectors = [
      '[data-action="start-analysis"]',
      '.start-button',
      'button:has-text("スタート")',
      'button:has-text("開始")',
      '#startButton',
      '.btn-start'
    ];
    
    let startClicked = false;
    for (const selector of startSelectors) {
      try {
        const element = await page.locator(selector).first();
        if (await element.isVisible()) {
          await element.click();
          startClicked = true;
          console.log(`✅ スタートボタンクリック成功: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`❌ セレクタ失敗: ${selector}`);
      }
    }
    
    if (!startClicked) {
      console.log('⚠️ スタートボタンが見つからないため、手動確認用スクリーンショットを撮影');
      await page.screenshot({ 
        path: 'test-results/initial-page-debug.png',
        fullPage: true 
      });
      
      // ページ内のボタンを全て表示
      const buttons = await page.locator('button').allTextContents();
      console.log('🔍 発見されたボタン:', buttons);
      
      // クリック可能な要素を表示
      const clickables = await page.locator('[onclick], [data-action], .btn, .button').allTextContents();
      console.log('🔍 クリック可能要素:', clickables);
    }
    
    // 質問画面への遷移を待機
    await page.waitForTimeout(3000);
    
    // 質問画面の確認
    console.log('📝 質問画面の確認中...');
    
    const questionSelectors = [
      '.question-text',
      '.question-content', 
      '[data-question]',
      'h2',
      'h3'
    ];
    
    let questionFound = false;
    for (const selector of questionSelectors) {
      try {
        const questionElement = await page.locator(selector).first();
        if (await questionElement.isVisible()) {
          const questionText = await questionElement.textContent();
          console.log(`✅ 質問発見: ${questionText?.substring(0, 50)}...`);
          questionFound = true;
          break;
        }
      } catch (e) {
        console.log(`❌ 質問セレクタ失敗: ${selector}`);
      }
    }
    
    if (!questionFound) {
      console.log('⚠️ 質問画面への遷移を確認できません');
      await page.screenshot({ 
        path: 'test-results/no-question-debug.png',
        fullPage: true 
      });
    }
    
    // 改善確認のサンプルテスト
    console.log('🔍 改善内容の確認開始...');
    
    const pageContent = await page.content();
    
    // NGワードの確認
    const ngWords = ['革新的', '斬新な', '賢者', '状況による', '状況を見ながら'];
    const foundNgWords = ngWords.filter(word => pageContent.includes(word));
    
    if (foundNgWords.length > 0) {
      console.log(`❌ NGワードが発見されました: ${foundNgWords.join(', ')}`);
    } else {
      console.log('✅ NGワードは発見されませんでした');
    }
    
    // 改善されたワードの確認
    const improvedWords = ['新しい', '対応', '力'];
    const foundImprovedWords = improvedWords.filter(word => pageContent.includes(word));
    console.log(`✅ 改善されたワード: ${foundImprovedWords.join(', ')}`);
    
    // 最終スクリーンショット
    await page.screenshot({ 
      path: 'test-results/question-improvements-final.png',
      fullPage: true 
    });
    
    console.log('✅ テスト完了 - スクリーンショット保存済み');
    
  } catch (error) {
    console.error('❌ テスト実行エラー:', error);
    await page.screenshot({ 
      path: 'test-results/error-screenshot.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

// 実行
testQuestionImprovements().catch(console.error);