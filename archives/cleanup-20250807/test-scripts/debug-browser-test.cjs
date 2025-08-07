const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // エラーログ収集
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  try {
    console.log('🚀 Navigating to OS Analyzer...');
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    console.log('🔍 Looking for start button...');
    const startBtn = await page.$('.start-button');
    if (startBtn) {
      console.log('✅ Start button found - attempting click...');
      await startBtn.click();
      await page.waitForTimeout(2000);
      
      // 質問画面への遷移を確認
      const questionScreen = await page.$('#questions-screen');
      if (questionScreen) {
        console.log('✅ Successfully transitioned to question screen');
      } else {
        console.log('❌ Failed to transition to question screen');
      }
    } else {
      console.log('❌ Start button not found');
    }
    
  } catch (error) {
    console.log('❌ NAVIGATION ERROR:', error.message);
  }
  
  await page.waitForTimeout(5000);
  await browser.close();
})();