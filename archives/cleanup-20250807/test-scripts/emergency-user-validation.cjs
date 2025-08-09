const { chromium } = require('playwright');

async function validateUserExperience() {
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Console errors tracking
  const consoleErrors = [];
  const networkErrors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push({
        text: msg.text(),
        location: msg.location()
      });
      console.log('❌ Console Error:', msg.text());
    }
  });
  
  page.on('requestfailed', request => {
    networkErrors.push({
      url: request.url(),
      failure: request.failure()?.errorText
    });
    console.log('❌ Network Error:', request.url(), request.failure()?.errorText);
  });
  
  try {
    console.log('🔍 Step 1: Navigate to Future Simulator');
    await page.goto('http://127.0.0.1:8788/future_simulator.html');
    
    // Wait for page load
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    console.log('🔍 Step 2: Check initial page display');
    await page.screenshot({ path: 'screen-1-initial.png', fullPage: true });
    
    // Check for worryInput field
    console.log('🔍 Step 3: Looking for input field');
    const worryInput = await page.locator('#worryInput, textarea[placeholder*="悩み"], input[placeholder*="悩み"], textarea[placeholder*="心配"], textarea').first();
    
    if (await worryInput.count() > 0) {
      console.log('✅ Input field found');
      
      // Test input functionality
      console.log('🔍 Step 4: Test input functionality');
      await worryInput.fill('最近仕事で失敗が続いて、将来が不安です。転職を考えているのですが、この判断は正しいでしょうか？');
      await page.screenshot({ path: 'screen-2-question-1.png', fullPage: true });
      
      // Look for analyze button
      console.log('🔍 Step 5: Looking for analyze button');
      const analyzeButton = await page.locator('button:has-text("分析"), button:has-text("実行"), button:has-text("解析"), button[class*="analyze"]').first();
      
      if (await analyzeButton.count() > 0) {
        console.log('✅ Analyze button found');
        
        // Click analyze button
        console.log('🔍 Step 6: Click analyze button');
        await analyzeButton.click();
        
        // Wait for results
        await page.waitForTimeout(5000);
        await page.screenshot({ path: 'screen-3-result-full.png', fullPage: true });
        
        // Check for results display
        const resultsSection = await page.locator('.results, .analysis-result, #results, [class*="result"]').first();
        
        if (await resultsSection.count() > 0) {
          console.log('✅ Results section found');
        } else {
          console.log('❌ Results section NOT found');
        }
        
      } else {
        console.log('❌ Analyze button NOT found');
      }
      
    } else {
      console.log('❌ Input field NOT found');
    }
    
    // Final screenshot
    await page.screenshot({ path: 'screenshot-final.png', fullPage: true });
    
  } catch (error) {
    console.log('❌ Validation Error:', error.message);
    await page.screenshot({ path: 'error-final.png', fullPage: true });
  }
  
  console.log('\n📊 Error Summary:');
  console.log(`Console Errors: ${consoleErrors.length}`);
  console.log(`Network Errors: ${networkErrors.length}`);
  
  if (consoleErrors.length > 0) {
    console.log('\n🚨 Console Errors:');
    consoleErrors.forEach((error, i) => {
      console.log(`${i + 1}. ${error.text}`);
    });
  }
  
  if (networkErrors.length > 0) {
    console.log('\n🚨 Network Errors:');
    networkErrors.forEach((error, i) => {
      console.log(`${i + 1}. ${error.url} - ${error.failure}`);
    });
  }
  
  await browser.close();
  
  return {
    consoleErrors,
    networkErrors,
    success: consoleErrors.length === 0 && networkErrors.length === 0
  };
}

// Run validation
validateUserExperience()
  .then(result => {
    if (result.success) {
      console.log('\n✅ User experience validation PASSED');
    } else {
      console.log('\n❌ User experience validation FAILED');
    }
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });