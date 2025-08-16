const { chromium } = require('playwright');

async function testDynamicKeywordGenerator() {
  console.log('🚀 Starting browser test...');
  
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Capture console logs and errors
    page.on('console', msg => {
      console.log(`🖥️  Browser Console [${msg.type()}]: ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
      console.log(`❌ Page Error: ${error.message}`);
      console.log(`   Stack: ${error.stack}`);
    });
    
    console.log('🌐 Navigating to test page...');
    await page.goto('http://localhost:8788/test-minimal.html');
    
    // Wait a bit for scripts to load
    await page.waitForTimeout(2000);
    
    // Check if DynamicKeywordGenerator loaded
    const isLoaded = await page.evaluate(() => {
      return typeof window.DynamicKeywordGenerator !== 'undefined';
    });
    
    if (isLoaded) {
      console.log('✅ DynamicKeywordGenerator loaded successfully in browser');
      
      // Test key method exists
      const hasMethod = await page.evaluate(() => {
        return typeof window.DynamicKeywordGenerator.generateEnhancedTripleOSDiagnosticText === 'function';
      });
      
      if (hasMethod) {
        console.log('✅ generateEnhancedTripleOSDiagnosticText method exists');
      } else {
        console.log('❌ generateEnhancedTripleOSDiagnosticText method missing');
      }
      
      // Test initialization
      try {
        await page.evaluate(() => {
          if (window.DynamicKeywordGenerator.init) {
            window.DynamicKeywordGenerator.init();
          }
        });
        console.log('✅ Initialization successful');
      } catch (error) {
        console.log(`❌ Initialization failed: ${error.message}`);
      }
      
    } else {
      console.log('❌ DynamicKeywordGenerator failed to load');
      
      // Get any error messages from the page
      const errorLogs = await page.evaluate(() => {
        const logs = document.querySelectorAll('.log.error');
        return Array.from(logs).map(log => log.textContent);
      });
      
      if (errorLogs.length > 0) {
        console.log('📋 Error logs from browser:');
        errorLogs.forEach(log => console.log(`   ${log}`));
      }
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
testDynamicKeywordGenerator().catch(console.error);