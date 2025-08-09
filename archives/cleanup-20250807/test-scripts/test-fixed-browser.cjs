const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // コンソールエラーをキャッチ
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error') {
      console.log('❌ Console Error:', msg.text());
    } else if (type === 'warn') {
      console.log('⚠️ Console Warning:', msg.text());
    } else {
      console.log(`🔍 Console ${type}:`, msg.text());
    }
  });
  
  page.on('pageerror', error => console.log('❌ Page Error:', error.message));
  
  try {
    console.log('🎯 Testing fixed JavaScript in browser...');
    await page.goto('http://127.0.0.1:8788/future_simulator.html');
    await page.waitForTimeout(5000);
    
    // ページの実際の状態確認
    const pageInfo = await page.evaluate(() => ({
      title: document.title,
      hasWorryInput: !!document.getElementById('worryInput'),
      inputVisible: document.getElementById('worryInput')?.offsetHeight > 0,
      backgroundColor: window.getComputedStyle(document.body).backgroundColor,
      hasContent: document.body.innerText.length > 100,
      elementCount: document.querySelectorAll('*').length
    }));
    
    console.log('📊 Fixed Page Status:');
    console.log(`- ページタイトル: ${pageInfo.title}`);
    console.log(`- worryInput存在: ${pageInfo.hasWorryInput ? '✅' : '❌'}`);
    console.log(`- worryInput表示: ${pageInfo.inputVisible ? '✅' : '❌'}`);
    console.log(`- 背景色: ${pageInfo.backgroundColor}`);
    console.log(`- コンテンツあり: ${pageInfo.hasContent ? '✅' : '❌'}`);
    console.log(`- 要素数: ${pageInfo.elementCount}`);
    
    await page.screenshot({ path: 'fixed-screen-test.png', fullPage: true });
    console.log('📸 スクリーンショット保存: fixed-screen-test.png');
    
    // 入力テスト
    if (pageInfo.inputVisible) {
      console.log('📝 入力テスト実行...');
      await page.fill('#worryInput', '修正後テスト入力');
      await page.screenshot({ path: 'fixed-input-test.png', fullPage: true });
      console.log('✅ 入力テスト成功');
    }
    
  } catch (error) {
    console.error('❌ Fixed Test Error:', error.message);
  } finally {
    await browser.close();
  }
})();