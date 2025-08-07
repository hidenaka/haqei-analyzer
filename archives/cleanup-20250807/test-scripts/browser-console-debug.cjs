const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // すべてのコンソールメッセージとエラーを詳細にキャプチャ
  const allMessages = [];
  
  page.on('console', msg => {
    const text = msg.text();
    allMessages.push({ type: 'console', level: msg.type(), message: text });
    console.log(`[CONSOLE ${msg.type().toUpperCase()}]`, text);
  });
  
  page.on('pageerror', err => {
    allMessages.push({ type: 'error', message: err.message, stack: err.stack });
    console.log('❌ PAGE ERROR:', err.message);
    if (err.stack) {
      console.log('Stack trace:', err.stack);
    }
  });
  
  page.on('requestfailed', request => {
    allMessages.push({ type: 'failed_request', url: request.url(), failure: request.failure()?.errorText });
    console.log('❌ REQUEST FAILED:', request.url(), request.failure()?.errorText);
  });
  
  try {
    console.log('🚀 Navigating and capturing detailed errors...');
    await page.goto('http://localhost:8788/os_analyzer.html');
    
    // 長時間待機してすべてのエラーを収集
    await page.waitForTimeout(8000);
    
    console.log('\n📊 DETAILED DIAGNOSTIC SUMMARY:');
    console.log('Total messages captured:', allMessages.length);
    
    const errors = allMessages.filter(m => m.type === 'error' || m.level === 'error');
    console.log('Errors found:', errors.length);
    
    errors.forEach((error, index) => {
      console.log(`\n🔴 Error #${index + 1}:`);
      console.log('Message:', error.message);
      if (error.stack) {
        console.log('Stack:', error.stack);
      }
    });
    
    const failedRequests = allMessages.filter(m => m.type === 'failed_request');
    console.log('\n📁 Failed resource loads:', failedRequests.length);
    failedRequests.forEach(req => {
      console.log('Failed URL:', req.url);
      console.log('Error:', req.failure);
    });
    
    // 最終的に何が初期化されているかチェック
    const finalState = await page.evaluate(() => {
      return {
        windowObjects: Object.keys(window).filter(key => 
          key.includes('HAQEI') || key.includes('critical') || key.includes('H384') ||
          key.includes('AuthenticEnergyBalance') || key.includes('virtualPersona') ||
          key.includes('HEXAGRAMS') || key.includes('QUESTIONS')
        ),
        hasScriptError: window.lastScriptError || null
      };
    });
    
    console.log('\n🔍 Final window state:', finalState);
    
  } catch (error) {
    console.log('❌ Navigation Error:', error.message);
  }
  
  await page.waitForTimeout(3000);
  await browser.close();
})();