/**
 * HAQEI E2E Smoke Test
 * 軽量な表示確認テスト
 */
const { chromium } = require('playwright');

async function smokeTest() {
  console.log('🔍 Starting HAQEI E2E Smoke Test...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // 1. Health Check
    console.log('1. Testing health endpoint...');
    const healthResponse = await page.goto('http://localhost:8788/health', { 
      waitUntil: 'domcontentloaded' 
    });
    
    if (healthResponse.status() !== 200) {
      throw new Error(`Health check failed: ${healthResponse.status()}`);
    }
    console.log('   ✅ Health check passed');
    
    // 2. Main Application Load
    console.log('2. Testing main application...');
    await page.goto('http://localhost:8788/os_analyzer.html', { 
      waitUntil: 'domcontentloaded' 
    });
    
    const title = await page.title();
    console.log(`   📄 Page title: "${title}"`);
    
    if (!title.toLowerCase().includes('haqei') && !title.toLowerCase().includes('os analyzer')) {
      throw new Error(`Unexpected title: ${title}`);
    }
    console.log('   ✅ Title check passed');
    
    // 3. Basic DOM Elements Check
    console.log('3. Testing basic DOM elements...');
    const bodyExists = await page.locator('body').count() > 0;
    if (!bodyExists) {
      throw new Error('Body element not found');
    }
    console.log('   ✅ Basic DOM structure verified');
    
    // 4. JavaScript Loading Check
    console.log('4. Testing JavaScript loading...');
    const jsErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });
    
    // Wait for any immediate JS execution
    await page.waitForTimeout(2000);
    
    if (jsErrors.length > 0) {
      console.warn(`   ⚠️  JavaScript errors detected: ${jsErrors.length}`);
      jsErrors.forEach(error => console.warn(`      - ${error}`));
    } else {
      console.log('   ✅ No immediate JavaScript errors');
    }
    
    console.log('🎉 All smoke tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Smoke test failed:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

// CLI execution
if (require.main === module) {
  smokeTest().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { smokeTest };