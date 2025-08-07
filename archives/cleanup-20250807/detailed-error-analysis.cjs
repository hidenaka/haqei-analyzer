const { chromium } = require('playwright');

async function getDetailedErrorInfo() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let detailedErrors = [];
  
  // Capture all error details including line numbers
  page.on('pageerror', error => {
    detailedErrors.push({
      message: error.message,
      stack: error.stack,
      fileName: error.fileName || 'unknown',
      lineNumber: error.lineNumber || 'unknown',
      columnNumber: error.columnNumber || 'unknown'
    });
    
    console.log('🚨 PAGE ERROR DETAILS:');
    console.log('Message:', error.message);
    console.log('File:', error.fileName || 'N/A');  
    console.log('Line:', error.lineNumber || 'N/A');
    console.log('Column:', error.columnNumber || 'N/A');
    console.log('Stack:', error.stack || 'N/A');
    console.log('---');
  });
  
  // Also capture console errors with more detail
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const location = msg.location();
      console.log('🚨 CONSOLE ERROR:');
      console.log('Text:', msg.text());
      console.log('URL:', location.url || 'N/A');
      console.log('Line:', location.lineNumber || 'N/A'); 
      console.log('Column:', location.columnNumber || 'N/A');
      console.log('---');
    }
  });
  
  try {
    await page.goto('http://127.0.0.1:8788/future_simulator.html');
    await page.waitForTimeout(3000);
    
    // Try to get JavaScript evaluation errors
    try {
      const evalResult = await page.evaluate(() => {
        // Test if the main classes are defined
        const tests = {
          ProgressiveLoader: typeof ProgressiveLoader !== 'undefined',
          windowProgressiveLoader: typeof window.ProgressiveLoader !== 'undefined',
          documentReady: document.readyState,
          scriptCount: document.querySelectorAll('script').length
        };
        
        return tests;
      });
      
      console.log('🔍 JavaScript Environment Check:');
      console.log(JSON.stringify(evalResult, null, 2));
      
    } catch (evalError) {
      console.log('❌ JavaScript Evaluation Error:', evalError.message);
    }
    
  } catch (navError) {
    console.log('❌ Navigation Error:', navError.message);
  }
  
  await browser.close();
  
  return detailedErrors;
}

// Run detailed analysis
getDetailedErrorInfo()
  .then(errors => {
    console.log(`\n📊 Total Errors Captured: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('\n🎯 DETAILED ERROR ANALYSIS:');
      errors.forEach((error, i) => {
        console.log(`\nError ${i + 1}:`);
        console.log(`  Message: ${error.message}`);
        console.log(`  Location: ${error.fileName}:${error.lineNumber}:${error.columnNumber}`);
        if (error.stack) {
          console.log(`  Stack: ${error.stack.split('\n')[0]}`);
        }
      });
    }
  })
  .catch(error => {
    console.error('Analysis failed:', error);
  });