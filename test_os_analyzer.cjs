const { chromium } = require('playwright');

(async () => {
  console.log('🚀 HAQEI OS Analyzer Testing');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const consoleErrors = [];
  const jsErrors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  page.on('pageerror', error => {
    jsErrors.push(error.message);
  });
  
  try {
    console.log('📍 Loading page...');
    await page.goto('http://localhost:8080/os_analyzer.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    const title = await page.title();
    console.log('✅ Title:', title);
    
    const hasStartBtn = await page.locator('#start-btn').count() > 0;
    console.log('Start button:', hasStartBtn ? '✅ Found' : '❌ Missing');
    
    const hasContainer = await page.locator('.app-container').count() > 0;
    console.log('Main container:', hasContainer ? '✅ Found' : '❌ Missing');
    
    console.log('📊 Errors:');
    console.log('Console errors:', consoleErrors.length);
    console.log('JS errors:', jsErrors.length);
    
    if (consoleErrors.length > 0) {
      consoleErrors.forEach((error, i) => console.log((i+1) + '. ' + error));
    }
    
    if (jsErrors.length > 0) {
      jsErrors.forEach((error, i) => console.log((i+1) + '. ' + error));
    }
    
  } catch (error) {
    console.error('❌ Fatal Error:', error.message);
  } finally {
    await browser.close();
  }
})();
