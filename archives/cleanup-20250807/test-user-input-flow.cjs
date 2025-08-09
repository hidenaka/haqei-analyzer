const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    console.log('🎯 Testing complete user input flow...');
    await page.goto('http://127.0.0.1:8788/public/future_simulator.html');
    await page.waitForTimeout(2000);
    
    // Test 1: Input field interaction
    console.log('📝 Testing input field...');
    await page.fill('#worryInput', '最近、仕事でストレスが多く、将来への不安が増しています。どのような心構えで前に進むべきでしょうか？');
    
    await page.waitForTimeout(1000);
    
    // Test 2: Button click
    console.log('🔘 Testing button click...');
    await page.click('#aiGuessBtn');
    
    await page.waitForTimeout(3000);
    
    // Final screenshot
    await page.screenshot({ 
      path: 'user-flow-success.png', 
      fullPage: true 
    });
    
    console.log('✅ User input flow test completed successfully!');
    console.log('📸 Screenshot saved: user-flow-success.png');
    
    await browser.close();
    
  } catch (error) {
    console.error('❌ User flow test failed:', error);
  }
})();