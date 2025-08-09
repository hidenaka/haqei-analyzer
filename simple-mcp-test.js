/**
 * シンプルなMCP Playwright直接テスト
 * os_analyzer.htmlの実際の動作を確認
 */

import { chromium } from 'playwright';

async function testOsAnalyzer() {
  console.log('🚀 os_analyzer.htmlの直接テスト開始\n');
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: 2000 // ゆっくり動作して確認しやすく
  });
  
  const page = await browser.newPage();
  
  try {
    // 1. ページにアクセス
    console.log('📱 ページにアクセス中...');
    await page.goto('file:///Users/nakanohideaki/Desktop/haqei-analyzer/public/os_analyzer.html');
    
    // 2. ページ構造を確認
    console.log('📄 ページタイトル:', await page.title());
    
    // 3. ウェルカム画面の確認
    const welcomeVisible = await page.isVisible('#welcome-container');
    console.log('✅ ウェルカム画面:', welcomeVisible ? '表示されている' : '表示されていない');
    
    if (welcomeVisible) {
      const welcomeText = await page.textContent('#welcome-container');
      console.log('📝 ウェルカムテキスト:', welcomeText.substring(0, 100) + '...');
    }
    
    // 4. ボタンを探す
    console.log('\n🔍 利用可能なボタンを探しています...');
    const buttons = await page.$$('button');
    console.log(`📊 見つかったボタン数: ${buttons.length}`);
    
    for (let i = 0; i < buttons.length; i++) {
      const text = await buttons[i].textContent();
      console.log(`  ボタン${i + 1}: "${text.trim()}"`);
    }
    
    // 5. 開始ボタンをクリック
    const startButton = buttons[0];
    if (startButton) {
      console.log('\n🎯 最初のボタンをクリックします...');
      await startButton.click();
      
      // 6. 少し待って画面遷移を確認
      await page.waitForTimeout(3000);
      
      // 7. 質問画面の確認
      console.log('\n📋 質問画面の確認...');
      
      // 様々な要素を探す
      const selectors = [
        '.virtual-question-item',
        '.question-text',
        '.option-label',
        'h3',
        'label',
        'input[type="radio"]'
      ];
      
      for (const selector of selectors) {
        const elements = await page.$$(selector);
        if (elements.length > 0) {
          console.log(`✅ ${selector}: ${elements.length}個の要素が見つかりました`);
          
          // 最初の要素のテキストを表示
          if (elements[0]) {
            try {
              const text = await elements[0].textContent();
              if (text) {
                console.log(`   内容: "${text.substring(0, 50)}..."`);
              }
            } catch (e) {
              // テキストがない要素の場合
            }
          }
        }
      }
      
      // 8. 現在のページ構造を確認
      const questionsVisible = await page.isVisible('#questions-container');
      console.log('\n✅ 質問コンテナ:', questionsVisible ? '表示されている' : '表示されていない');
      
      // 9. 現在のURLを確認
      console.log('🔗 現在のURL:', page.url());
    }
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
  } finally {
    console.log('\n⏸️ ブラウザを開いたままにします（手動で確認してください）');
    // await browser.close(); // デバッグのため閉じない
  }
}

// 実行
testOsAnalyzer().catch(console.error);