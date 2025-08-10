const { chromium } = require('playwright');

(async () => {
  console.log('🔍 DETAILED HAQEI OS Analyzer Testing');
  
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  
  const allErrors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      allErrors.push('CONSOLE: ' + msg.text());
    }
  });
  
  page.on('pageerror', error => {
    allErrors.push('JS ERROR: ' + error.message);
  });
  
  try {
    console.log('📍 Loading page with network monitoring...');
    await page.goto('http://localhost:8080/os_analyzer.html', { waitUntil: 'networkidle' });
    
    console.log('🔍 Analyzing page structure...');
    
    // Get all container elements
    const containers = await page.evaluate(() => {
      const elements = document.querySelectorAll('div[class*="container"], div[class*="app"], main, section');
      return Array.from(elements).map(el => ({
        tag: el.tagName,
        className: el.className,
        id: el.id
      }));
    });
    
    console.log('📦 Found containers:', containers.length);
    containers.forEach((container, i) => {
      console.log(i+1 + '. ' + container.tag + (container.className ? ' class="' + container.className + '"' : '') + (container.id ? ' id="' + container.id + '"' : ''));
    });
    
    // Test button functionality
    console.log('
🔍 Testing start button interaction...');
    const startButton = await page.locator('#start-btn');
    
    if (await startButton.count() > 0) {
      await startButton.click();
      await page.waitForTimeout(2000);
      
      // Check what happened after click
      const visibleElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('*[style*="display: block"], *[style*="display: flex"], .visible, .show');
        return Array.from(elements).slice(0,10).map(el => ({
          tag: el.tagName,
          className: el.className,
          id: el.id,
          visible: el.offsetWidth > 0 && el.offsetHeight > 0
        }));
      });
      
      console.log('👁️ Visible elements after click:', visibleElements.length);
    }
    
    // Check for questions
    console.log('
📋 Looking for question elements...');
    const questions = await page.evaluate(() => {
      const questionElements = document.querySelectorAll('*[class*="question"], *[id*="question"], input[type="radio"], input[type="checkbox"], select');
      return questionElements.length;
    });
    console.log('❓ Found question-related elements:', questions);
    
    // Check external dependencies
    console.log('
📡 Checking external resources...');
    const response = await page.goto('http://localhost:8080/assets/H384H64database.js');
    console.log('Database file status:', response.status());
    
    await page.goto('http://localhost:8080/os_analyzer.html');
    
    console.log('
⚠️ All errors found:');
    if (allErrors.length === 0) {
      console.log('✅ No errors detected\!');
    } else {
      allErrors.forEach((error, i) => console.log((i+1) + '. ' + error));
    }
    
    // Take a screenshot for manual review
    await page.screenshot({ path: 'test_screenshot.png', fullPage: true });
    console.log('📷 Screenshot saved as test_screenshot.png');
    
  } catch (error) {
    console.error('❌ Fatal Error:', error.message);
  } finally {
    await browser.close();
  }
})();
