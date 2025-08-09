const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // より詳細なエラーログ収集
  page.on('console', msg => {
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log('❌ PAGE ERROR:', err.message);
    console.log('Stack trace:', err.stack);
  });
  
  page.on('response', response => {
    if (!response.ok()) {
      console.log(`❌ HTTP ERROR: ${response.status()} - ${response.url()}`);
    }
  });
  
  try {
    console.log('🚀 Navigating to OS Analyzer...');
    await page.goto('http://localhost:8788/os_analyzer.html');
    
    // JavaScriptエラーを待つ
    await page.waitForTimeout(5000);
    
    // ページの実際のJavaScript実行状況を確認
    const hasAnalyzer = await page.evaluate(() => {
      return typeof window.criticalCSSAnalyzer !== 'undefined';
    });
    
    console.log('Analyzer instance exists:', hasAnalyzer);
    
    if (!hasAnalyzer) {
      console.log('❌ JavaScript failed to initialize properly');
    }
    
  } catch (error) {
    console.log('❌ NAVIGATION ERROR:', error.message);
  }
  
  await page.waitForTimeout(3000);
  await browser.close();
})();