const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    console.log('🔍 Starting visibility debug test...');
    await page.goto('http://127.0.0.1:8788/public/future_simulator.html');
    
    // Wait for page load
    await page.waitForTimeout(2000);
    
    const results = await page.evaluate(() => {
      const worryInput = document.getElementById('worryInput');
      const aiGuessBtn = document.getElementById('aiGuessBtn');
      const mainContent = document.getElementById('main-content');
      
      return {
        inputExists: Boolean(worryInput),
        buttonExists: Boolean(aiGuessBtn),
        inputVisible: worryInput ? (worryInput.offsetWidth > 0 && worryInput.offsetHeight > 0) : false,
        buttonVisible: aiGuessBtn ? (aiGuessBtn.offsetWidth > 0 && aiGuessBtn.offsetHeight > 0) : false,
        inputDisplay: worryInput ? getComputedStyle(worryInput).display : null,
        buttonDisplay: aiGuessBtn ? getComputedStyle(aiGuessBtn).display : null,
        inputOpacity: worryInput ? getComputedStyle(worryInput).opacity : null,
        buttonOpacity: aiGuessBtn ? getComputedStyle(aiGuessBtn).opacity : null,
        mainContentDisplay: mainContent ? getComputedStyle(mainContent).display : 'not found',
        bodyClass: document.body.className,
        documentTitle: document.title,
        errorLogs: window.console ? 'Console available' : 'No console'
      };
    });
    
    console.log('🚨 CRITICAL VISIBILITY DEBUG RESULTS:');
    console.log(JSON.stringify(results, null, 2));
    
    // スクリーンショット撮影
    await page.screenshot({ 
      path: 'critical-visibility-debug.png', 
      fullPage: true 
    });
    
    console.log('📸 Screenshot saved: critical-visibility-debug.png');
    
    await browser.close();
    
  } catch (error) {
    console.error('❌ Debug test failed:', error);
  }
})();