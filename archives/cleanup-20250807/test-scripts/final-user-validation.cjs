const { chromium } = require('playwright');

async function finalUserValidation() {
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  console.log('🎯 FINAL USER EXPERIENCE VALIDATION');
  console.log('==================================');
  
  try {
    console.log('✅ Step 1: Navigate to Future Simulator');
    await page.goto('http://127.0.0.1:8788/future_simulator.html');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Step 2: Capture initial screen');
    await page.screenshot({ path: 'screenshot-step1-connection.png', fullPage: true });
    
    console.log('✅ Step 3: Find and test input field');
    const worryInput = await page.locator('#worryInput').first();
    await worryInput.fill('最近仕事でプレッシャーが強く、将来のキャリアに不安を感じています。転職すべきか、現職で頑張るべきか迷っています。');
    
    await page.screenshot({ path: 'screenshot-step2-input.png', fullPage: true });
    console.log('✅ Input text entered successfully');
    
    console.log('✅ Step 4: Find analyze button');
    // Try multiple selectors for the button
    const analyzeButton = await page.locator('#aiGuessBtn, button:has-text("分析実行"), button:has-text("分析"), button[id="aiGuessBtn"]').first();
    
    const buttonVisible = await analyzeButton.isVisible();
    console.log(`Button visible: ${buttonVisible}`);
    
    if (buttonVisible) {
      console.log('✅ Step 5: Click analyze button');
      await analyzeButton.click();
      
      await page.screenshot({ path: 'screenshot-step3-analysis.png', fullPage: true });
      
      console.log('✅ Step 6: Wait for results');
      await page.waitForTimeout(3000);
      
      await page.screenshot({ path: 'screenshot-step4-results.png', fullPage: true });
      
      // Check if results appeared
      const resultsContainer = await page.locator('#results-container, #results').first();
      const resultsVisible = await resultsContainer.isVisible().catch(() => false);
      
      console.log(`Results visible: ${resultsVisible}`);
      
      if (resultsVisible) {
        console.log('🎉 COMPLETE SUCCESS: Full user workflow validated!');
        
        // Take mobile view screenshot
        await page.setViewportSize({ width: 390, height: 844 });
        await page.screenshot({ path: 'screenshot-step5-mobile.png', fullPage: true });
        
        return {
          success: true,
          message: 'Complete user experience validated successfully',
          steps: {
            navigation: true,
            input: true,
            button: true,
            analysis: true,
            results: true
          }
        };
      } else {
        return {
          success: false,
          message: 'Analysis completed but results not displayed',
          steps: {
            navigation: true,
            input: true,
            button: true,
            analysis: true,
            results: false
          }
        };
      }
      
    } else {
      return {
        success: false,
        message: 'Analyze button not found or not visible',
        steps: {
          navigation: true,
          input: true,
          button: false,
          analysis: false,
          results: false
        }
      };
    }
    
  } catch (error) {
    console.log('❌ Validation error:', error.message);
    await page.screenshot({ path: 'screenshot-error.png', fullPage: true });
    
    return {
      success: false,
      message: error.message,
      steps: {}
    };
  } finally {
    await browser.close();
  }
}

// Run final validation
finalUserValidation()
  .then(result => {
    console.log('\n🎯 FINAL VALIDATION REPORT');
    console.log('=========================');
    console.log(`Status: ${result.success ? '✅ SUCCESS' : '❌ FAILURE'}`);
    console.log(`Message: ${result.message}`);
    
    if (result.steps) {
      console.log('\nStep Results:');
      Object.entries(result.steps).forEach(([step, status]) => {
        console.log(`  ${step}: ${status ? '✅' : '❌'}`);
      });
    }
    
    if (result.success) {
      console.log('\n🎊 USER EXPERIENCE FULLY RESTORED!');
      console.log('Future Simulator is now working as expected.');
    } else {
      console.log('\n⚠️  Additional fixes may be needed.');
    }
  })
  .catch(error => {
    console.error('Final validation failed:', error);
  });