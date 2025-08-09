const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // コンソールエラーをキャッチ
  page.on('console', msg => console.log('🔍 Console:', msg.text()));
  page.on('pageerror', error => console.log('❌ Page Error:', error.message));
  
  try {
    await page.goto('http://127.0.0.1:8788/future_simulator.html');
    await page.waitForTimeout(5000);
    
    // ページの実際の状態確認
    const pageInfo = await page.evaluate(() => ({
      title: document.title,
      bodyContent: document.body.innerText.substring(0, 200),
      hasWorryInput: !!document.getElementById('worryInput'),
      backgroundColor: window.getComputedStyle(document.body).backgroundColor,
      displayStyle: window.getComputedStyle(document.body).display,
      bodyClass: document.body.className,
      errors: window.errors || 'no errors captured'
    }));
    
    console.log('📊 Page Status:', JSON.stringify(pageInfo, null, 2));
    
    await page.screenshot({ path: 'debug-black-screen.png', fullPage: true });
    
  } catch (error) {
    console.error('❌ Debug Error:', error.message);
  } finally {
    await browser.close();
  }
})();