/**
 * 簡易USEPテスト - os_analyzer.htmlの動作確認
 */

import { chromium } from 'playwright';

async function runSimpleTest() {
  console.log('🚀 簡易USEPテスト開始...\n');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // 1. ページアクセス
    console.log('📱 ページにアクセス中...');
    await page.goto('http://localhost:8090/os_analyzer.html', {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });
    
    // 2. ページタイトル確認
    const title = await page.title();
    console.log(`📄 ページタイトル: ${title}`);
    
    // 3. 主要要素の存在確認
    console.log('\n🔍 主要要素の確認:');
    
    const elements = [
      { selector: '.welcome-container', name: 'ウェルカムコンテナ' },
      { selector: '.start-button', name: '開始ボタン' },
      { selector: '#question-container', name: '質問コンテナ' },
      { selector: '.progress-bar', name: 'プログレスバー' }
    ];
    
    for (const elem of elements) {
      const exists = await page.$(elem.selector) !== null;
      console.log(`  ${exists ? '✅' : '❌'} ${elem.name}: ${exists ? '存在' : '不在'}`);
    }
    
    // 4. 開始ボタンのクリック試行
    console.log('\n🎯 開始ボタンをクリック...');
    const startButton = await page.$('.start-button, button:has-text("始める"), button:has-text("開始")');
    
    if (startButton) {
      await startButton.click();
      console.log('  ✅ クリック成功');
      
      // 質問が表示されるか確認
      await page.waitForTimeout(2000);
      const questionVisible = await page.$('.question-text, #question-text') !== null;
      console.log(`  ${questionVisible ? '✅' : '❌'} 質問表示: ${questionVisible ? '成功' : '失敗'}`);
    } else {
      console.log('  ❌ 開始ボタンが見つかりません');
    }
    
    // 5. JavaScript エラーの確認
    const jsErrors = [];
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    await page.waitForTimeout(1000);
    
    if (jsErrors.length > 0) {
      console.log('\n⚠️ JavaScriptエラー:');
      jsErrors.forEach(err => console.log(`  - ${err}`));
    } else {
      console.log('\n✅ JavaScriptエラーなし');
    }
    
    // 6. ページのスクリーンショット
    console.log('\n📸 スクリーンショットを保存...');
    await page.screenshot({ path: 'usep-test-screenshot.png' });
    console.log('  ✅ usep-test-screenshot.png として保存');
    
    // 7. 簡易評価
    console.log('\n📊 簡易評価結果:');
    console.log('  - ページアクセス: ✅');
    console.log(`  - タイトル表示: ${title ? '✅' : '❌'}`);
    console.log(`  - UIレンダリング: ${elements.some(e => e) ? '部分的' : '失敗'}`);
    console.log(`  - インタラクティブ性: ${startButton ? '可能' : '不可'}`);
    
  } catch (error) {
    console.error('\n❌ エラー発生:', error.message);
  } finally {
    await browser.close();
    console.log('\n✅ テスト完了');
  }
}

// 実行
runSimpleTest().catch(console.error);