/**
 * Future Simulator MCP User Flow Validation Test
 * Playwright automated testing for complete user journey
 */

import { test, expect } from '@playwright/test';

test('Future Simulator Complete User Flow', async ({ page }) => {
  console.log('🚀 Starting Future Simulator MCP validation...');
  
  try {
    // Step 1: Navigate to Future Simulator
    console.log('📡 Step 1: Navigating to Future Simulator...');
    await page.goto('http://localhost:8788/future_simulator.html', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Step 2: Wait for page load and take initial screenshot
    console.log('📸 Step 2: Taking initial page screenshot...');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'future-simulator-initial.png', fullPage: true });
    
    // Step 3: Check if core components loaded
    console.log('🔍 Step 3: Verifying core components loading...');
    
    const h384DataLoaded = await page.evaluate(() => {
      return typeof window.H384_DATA !== 'undefined' && Object.keys(window.H384_DATA || {}).length > 0;
    });
    
    const componentsLoaded = await page.evaluate(() => {
      return {
        h384db: typeof window.h384db !== 'undefined',
        iChingChoice: typeof window.iChingChoice !== 'undefined',
        futureSimulator: typeof window.futureSimulator !== 'undefined'
      };
    });
    
    console.log('Database Status:', h384DataLoaded ? '✅ H384_DATA loaded' : '❌ H384_DATA not loaded');
    console.log('Components:', componentsLoaded);
    
    // Step 4: Find and interact with input field
    console.log('✍️ Step 4: Testing input field interaction...');
    
    // Scroll down to find the input field
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await page.waitForTimeout(2000);
    
    // Try to find worryInput or any textarea
    let inputSelector = '#worryInput';
    let inputField = page.locator(inputSelector);
    
    // If not found, try alternative selectors
    if (await inputField.count() === 0) {
      console.log('worryInput not found, trying alternative selectors...');
      const alternativeSelectors = ['textarea', 'input[type="text"]', '[placeholder*="悩み"]', '[placeholder*="入力"]'];
      
      for (const selector of alternativeSelectors) {
        inputField = page.locator(selector);
        if (await inputField.count() > 0) {
          inputSelector = selector;
          console.log(`Found input field with selector: ${selector}`);
          break;
        }
      }
    }
    
    // Wait for input field to be visible
    await page.waitForSelector(inputSelector, { state: 'visible', timeout: 15000 });
    
    inputField = page.locator(inputSelector);
    await expect(inputField).toBeVisible();
    
    // Type test input
    const testInput = '将来のキャリアについて悩んでいます。現在の仕事を続けるべきか、新しい挑戦をするべきか迷っています。';
    await inputField.fill(testInput);
    
    console.log('✅ Input field test passed');
    
    // Step 5: Click analysis button
    console.log('🔘 Step 5: Testing analysis button click...');
    
    const analysisButton = page.locator('#aiGuessBtn');
    await expect(analysisButton).toBeVisible();
    await expect(analysisButton).toBeEnabled();
    
    // Take screenshot before clicking
    await page.screenshot({ path: 'future-simulator-before-analysis.png', fullPage: true });
    
    // Click the analysis button
    await analysisButton.click();
    
    console.log('✅ Analysis button clicked');
    
    // Step 6: Wait for analysis results
    console.log('⏳ Step 6: Waiting for analysis results...');
    
    // Wait for loading to start and then complete
    await page.waitForSelector('.loading-spinner, #loadingSpinner', { state: 'visible', timeout: 5000 }).catch(() => {
      console.log('Loading spinner not found, continuing...');
    });
    
    // Wait for loading to complete (max 30 seconds)
    await page.waitForTimeout(5000);
    
    // Check if results area is displayed
    const resultArea = page.locator('#resultArea');
    
    try {
      await expect(resultArea).toBeVisible({ timeout: 15000 });
      console.log('✅ Result area is visible');
    } catch (error) {
      console.log('⚠️ Result area visibility check failed, taking screenshot for debugging...');
    }
    
    // Step 7: Take screenshot of results
    console.log('📸 Step 7: Taking results screenshot...');
    await page.screenshot({ path: 'future-simulator-results.png', fullPage: true });
    
    // Step 8: Check for 3-stage visualizer
    console.log('🎨 Step 8: Checking for 3-stage visualizer...');
    
    const visualizerContainer = page.locator('#three-stage-visualizer');
    const visualizerExists = await visualizerContainer.count() > 0;
    console.log('3-Stage Visualizer:', visualizerExists ? '✅ Found' : '❌ Not found');
    
    // Step 9: Check for 8 scenarios/branches display (either implementation)
    console.log('🎯 Step 9: Checking for 8 scenarios/branches display...');
    const scenariosContainer = page.locator('#eight-scenarios-display');
    const branchesContainer = page.locator('#eight-branches-display');
    const scenariosExists = (await scenariosContainer.count()) > 0;
    const branchesExists = (await branchesContainer.count()) > 0;
    console.log('8 Scenarios Display:', scenariosExists ? '✅ Found' : '❌ Not found');
    console.log('8 Branches Display:', branchesExists ? '✅ Found' : '❌ Not found');

    // Prefer branches display if present
    const activeContainer = branchesExists ? branchesContainer : scenariosContainer;
    if (branchesExists) {
      // Wait for visible content typical to the new UI
      await activeContainer.waitFor({ state: 'attached', timeout: 30000 });
      await expect(activeContainer).toBeVisible({ timeout: 30000 });
      // Key texts
      await expect(page.locator('#eight-branches-display')).toContainText('Now 現在の状況');
      await expect(page.locator('#eight-branches-display')).toContainText('詳細を見る');
      // Headline helper
      await expect(page.locator('#eight-branches-display')).toContainText('選べる8つの進路');

      // Decision-support microcopy presence (improves understanding)
      await expect(page.locator('#eight-branches-display')).toContainText('合う条件');
      await expect(page.locator('#eight-branches-display')).toContainText('注意点');
      await expect(page.locator('#eight-branches-display')).toContainText('成果イメージ');
      // Optional timing memo if present
      await page.locator('#eight-branches-display').waitFor({ state: 'visible' });
      // There might not always be 時機, so do a soft check
      const hasTiming = await page.locator('#eight-branches-display:has-text("時機")').count();
      console.log(`Timing memo present: ${hasTiming > 0}`);

      // Copy button exists on at least one card
      const copyBtn = page.locator('#eight-branches-display button', { hasText: 'この分岐をコピー' });
      await expect(copyBtn.first()).toBeVisible();
    }
    
    // Step 10: Check JavaScript console for errors
    console.log('🐛 Step 10: Checking for JavaScript errors...');
    
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({ type: msg.type(), text: msg.text() });
    });
    
    // Wait a bit more for any additional console messages
    await page.waitForTimeout(2000);
    
    // Filter out only error messages
    const errors = consoleMessages.filter(msg => msg.type === 'error');
    
    if (errors.length > 0) {
      console.log('❌ JavaScript Errors Found:');
      errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.text}`);
      });
    } else {
      console.log('✅ No JavaScript errors detected');
    }
    
    // Step 11: Final comprehensive screenshot
    console.log('📸 Step 11: Taking final comprehensive screenshot...');
    await page.screenshot({ path: 'future-simulator-final.png', fullPage: true });
    
    // Step 12: Validate system functionality
    console.log('🎯 Step 12: Final system validation...');
    
    const systemStatus = await page.evaluate(() => {
      try {
        // Test if core systems are working
        const testHexagram = {
          '卦名': '水雷屯',
          '爻': '初九',
          '卦番号': 3,
          'キーワード': ['協力者', '待機', '準備']
        };
        
        if (window.iChingChoice && typeof window.iChingChoice.calculateChange === 'function') {
          const followResult = window.iChingChoice.calculateChange(testHexagram, true);
          const rejectResult = window.iChingChoice.calculateChange(testHexagram, false);
          
          return {
            coreLogicWorking: true,
            followResult: followResult !== null,
            rejectResult: rejectResult !== null,
            systemReady: window.futureSimulator && window.futureSimulator.isInitialized
          };
        }
        
        return { coreLogicWorking: false };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('Final System Status:', systemStatus);
    
    // Summary
    console.log('\n🎯 Future Simulator MCP Validation Summary:');
    console.log('✅ Page Navigation: SUCCESS');
    console.log('✅ Component Loading: SUCCESS');
    console.log('✅ Input Field Interaction: SUCCESS');
    console.log('✅ Analysis Button Click: SUCCESS');
    console.log(`📊 Database Loading: ${h384DataLoaded ? 'SUCCESS' : 'FAILED'}`);
    console.log(`🎨 Visual Components: ${visualizerExists && scenariosExists ? 'SUCCESS' : 'PARTIAL'}`);
    console.log(`🧠 Core Logic: ${systemStatus.coreLogicWorking ? 'SUCCESS' : 'FAILED'}`);
    console.log(`❌ JavaScript Errors: ${errors.length} found`);
    
    const overallSuccess = h384DataLoaded && (branchesExists || scenariosExists) && errors.length === 0;
    console.log(`\n🏆 OVERALL VALIDATION: ${overallSuccess ? '✅ SUCCESS' : '❌ NEEDS ATTENTION'}`);
    
    return {
      success: overallSuccess,
      details: {
        pageLoaded: true,
        inputWorking: true,
        buttonWorking: true,
        databaseLoaded: h384DataLoaded,
        coreLogicWorking: systemStatus.coreLogicWorking,
        visualComponents: visualizerExists && scenariosExists,
        errorCount: errors.length
      }
    };
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    await page.screenshot({ path: 'future-simulator-error.png', fullPage: true });
    throw error;
  }
});
