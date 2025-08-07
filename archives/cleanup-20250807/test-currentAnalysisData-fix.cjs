const playwright = require('playwright');

async function testFutureSimulator() {
  console.log('🚀 Future Simulator MCP Testing Started');
  const browser = await playwright.chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Track console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log('🐛 Console Error:', msg.text());
    }
  });
  
  try {
    // Navigate to Future Simulator
    console.log('📍 Navigating to Future Simulator...');
    await page.goto('http://127.0.0.1:8080/future_simulator.html');
    await page.waitForTimeout(3000);
    
    // Wait for initialization
    console.log('⏳ Waiting for system initialization...');
    await page.waitForSelector('#worryInput', { timeout: 15000 });
    await page.waitForSelector('#aiGuessBtn', { timeout: 5000 });
    
    // Take initial screenshot
    await page.screenshot({ path: 'screenshot-initial.png' });
    console.log('📸 Initial screenshot taken');
    
    // Input test text
    const testText = 'これからの人生の方向性について悩んでいます。どのような選択をすべきか迷っています。新しい仕事を始めるべきか、現在の職場に留まるべきか決断に迷っています。';
    console.log('✍️ Entering test text...');
    await page.fill('#worryInput', testText);
    await page.waitForTimeout(1000);
    
    // Check if button is enabled
    const isButtonEnabled = await page.isEnabled('#aiGuessBtn');
    console.log(`🔘 Analysis button enabled: ${isButtonEnabled}`);
    
    // Submit analysis
    console.log('🔍 Starting analysis...');
    await page.click('#aiGuessBtn');
    
    // Wait for analysis to start and check for errors
    await page.waitForTimeout(2000);
    
    // Check for the specific currentAnalysisData error
    const hasCurrentAnalysisDataError = errors.some(error => 
      error.includes('currentAnalysisData is not defined')
    );
    
    if (hasCurrentAnalysisDataError) {
      console.log('❌ currentAnalysisData error still exists!');
      console.log('Related errors:', errors.filter(e => e.includes('currentAnalysisData')));
    } else {
      console.log('✅ No currentAnalysisData errors detected so far');
    }
    
    // Wait longer for analysis completion
    console.log('⏳ Waiting for analysis completion...');
    await page.waitForTimeout(8000);
    
    // Take final screenshot
    await page.screenshot({ path: 'screenshot-final.png' });
    console.log('📸 Final screenshot taken');
    
    // Final error check
    const finalCurrentAnalysisDataError = errors.some(error => 
      error.includes('currentAnalysisData is not defined')
    );
    
    if (finalCurrentAnalysisDataError) {
      console.log('❌ CRITICAL: currentAnalysisData error still exists after analysis');
      console.log('All errors:', errors);
      return false;
    } else {
      console.log('✅ SUCCESS: No currentAnalysisData errors detected throughout the test');
    }
    
    // Check for any other JS errors
    const otherErrors = errors.filter(e => !e.includes('currentAnalysisData'));
    if (otherErrors.length > 0) {
      console.log('⚠️ Other JavaScript errors detected:');
      otherErrors.forEach(error => console.log('   -', error));
    }
    
    console.log('✅ MCP Testing completed successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Testing failed:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

testFutureSimulator()
  .then(success => {
    console.log(success ? '🎉 TEST PASSED: currentAnalysisData fix successful' : '💥 TEST FAILED: currentAnalysisData fix unsuccessful');
    process.exit(success ? 0 : 1);
  })
  .catch(console.error);