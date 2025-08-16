const { chromium } = require('playwright');

async function directTest() {
  console.log('🎯 Testing DynamicKeywordGenerator directly...');
  
  let browser;
  try {
    browser = await chromium.launch({ headless: false }); // Use headless: false to see the browser
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Capture all console messages and errors
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        console.log(`❌ Browser Error: ${text}`);
      } else {
        console.log(`🖥️  Browser [${type}]: ${text}`);
      }
    });
    
    page.on('pageerror', error => {
      console.log(`💥 Page Error: ${error.message}`);
      if (error.stack) {
        console.log(`   Stack: ${error.stack}`);
      }
    });
    
    // Use file:// protocol to avoid server issues
    const filePath = '/Users/hideakimacbookair/Desktop/haqei-analyzer/test-minimal.html';
    console.log(`🌐 Loading file directly: ${filePath}`);
    
    await page.goto(`file://${filePath}`);
    
    // Wait for script to load and execute
    await page.waitForTimeout(3000);
    
    // Check loading status
    const status = await page.textContent('#status');
    console.log(`📊 Status: ${status}`);
    
    // Get all log entries
    const logs = await page.evaluate(() => {
      const logElements = document.querySelectorAll('.log');
      return Array.from(logElements).map(el => ({
        text: el.textContent,
        class: el.className
      }));
    });
    
    console.log('\n📋 Browser Logs:');
    logs.forEach(log => {
      const prefix = log.class.includes('error') ? '❌' : 
                    log.class.includes('success') ? '✅' : 
                    '📝';
      console.log(`${prefix} ${log.text}`);
    });
    
    // Check if the object exists
    const exists = await page.evaluate(() => {
      return typeof window.DynamicKeywordGenerator !== 'undefined';
    });
    
    console.log(`\n🔍 DynamicKeywordGenerator exists: ${exists}`);
    
    if (exists) {
      // Check specific method
      const methodExists = await page.evaluate(() => {
        return typeof window.DynamicKeywordGenerator.generateEnhancedTripleOSDiagnosticText === 'function';
      });
      console.log(`🔧 generateEnhancedTripleOSDiagnosticText method: ${methodExists}`);
    }
    
    // Wait to see any async errors
    await page.waitForTimeout(2000);
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
directTest().catch(console.error);