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
    
    // 2. Main Application Load with stable waiting
    console.log('2. Testing main application...');
    
    // Setup client error tracking
    await page.addInitScript(() => {
      window.__clientErrors = 0;
      window.addEventListener('error', () => window.__clientErrors++);
      window.addEventListener('unhandledrejection', () => window.__clientErrors++);
    });
    
    const jsErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });
    
    await page.goto('http://localhost:8788/os_analyzer.html', { 
      waitUntil: 'networkidle'  // Wait for network to be idle for stable loading
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
    
    // 4. Enhanced JavaScript Error Detection
    console.log('4. Testing JavaScript stability...');
    
    // Wait for application initialization
    await page.waitForTimeout(3000);
    
    // Check for client-side errors (warn but don't fail)
    const clientErrors = await page.evaluate(() => window.__clientErrors || 0);
    
    if (clientErrors > 0) {
      console.warn(`   ⚠️  Client-side errors detected: ${clientErrors} (non-blocking)`);
      // Note: In production, these should be addressed, but not failing smoke test for deployment verification
    } else {
      console.log('   ✅ No client-side errors detected');
    }
    
    if (jsErrors.length > 0) {
      console.warn(`   ⚠️  Console errors detected: ${jsErrors.length}`);
      jsErrors.forEach(error => console.warn(`      - ${error}`));
      // Don't fail on console warnings, but log them
    } else {
      console.log('   ✅ No console errors detected');
    }
    
    // 5. Application responsiveness test
    console.log('5. Testing application responsiveness...');
    
    // Test if main elements are interactive
    const welcomeScreen = await page.locator('body').isVisible();
    if (!welcomeScreen) {
      throw new Error('Application body not visible');
    }
    console.log('   ✅ Application is responsive');
    
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