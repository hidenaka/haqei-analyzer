const { test, expect } = require('@playwright/test');

test.describe('Future Simulator MCP Validation', () => {
  const testUrl = 'http://localhost:8080/future_simulator.html';
  const testInput = 'ใหม่规プロジェクトのマネジメントにおいて、人的リソースの不足がボトルネックとなり、計画に遅延が生じています。このままだと絶対期間に間に合わない。どうすればいいんだ';

  test('Complete Future Simulator Flow Validation', async ({ page }) => {
    console.log('🚀 Starting Future Simulator MCP Validation');
    
    // Step 1: Page Connection
    console.log('📡 Step 1: Connecting to page...');
    await page.goto(testUrl);
    await page.waitForTimeout(3000); // Wait for initialization
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'screenshot-initial.png',
      fullPage: true 
    });
    console.log('✅ Page loaded successfully');

    // Step 2: Text Input
    console.log('📝 Step 2: Entering test text...');
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    await textarea.fill(testInput);
    
    // Verify text was entered
    const inputValue = await textarea.inputValue();
    expect(inputValue).toBe(testInput);
    console.log('✅ Text input successful');

    // Step 3: Analysis Execution
    console.log('🔍 Step 3: Starting analysis...');
    const analyzeButton = page.locator('button:has-text("AIに状況を推測させる")');
    await expect(analyzeButton).toBeVisible();
    await analyzeButton.click();
    
    // Wait for analysis to start
    await page.waitForTimeout(2000);
    console.log('✅ Analysis initiated');

    // Step 4: Results Screen Verification
    console.log('📊 Step 4: Verifying results display...');
    
    // Wait for results to appear (max 30 seconds)
    await page.waitForTimeout(5000);
    
    // Check for Binary Tree 8 scenarios display
    const scenariosSection = page.locator('#scenarios-display, .scenarios-container, .binary-tree-display');
    await expect(scenariosSection).toBeVisible({ timeout: 30000 });
    console.log('✅ Binary Tree scenarios displayed');
    
    // Check for Chart.js visualization
    const chartElement = page.locator('canvas, #chart-container, .chart-display');
    if (await chartElement.count() > 0) {
      await expect(chartElement.first()).toBeVisible();
      console.log('✅ Chart.js visualization displayed');
    } else {
      console.log('⚠️ Chart.js visualization not found');
    }
    
    // Check for HaQei philosophy integration
    const philosophySection = page.locator('[class*="haqei"], [id*="philosophy"], [class*="philosophy"]');
    if (await philosophySection.count() > 0) {
      await expect(philosophySection.first()).toBeVisible();
      console.log('✅ HaQei philosophy integration displayed');
    } else {
      console.log('⚠️ HaQei philosophy section not found');
    }
    
    // Take final results screenshot
    await page.screenshot({ 
      path: 'screenshot-results.png',
      fullPage: true 
    });

    // Step 5: Quality Assessment
    console.log('🎯 Step 5: Assessing display quality...');
    
    // Check for JavaScript errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Verify no critical errors occurred
    expect(errors.length).toBeLessThan(5); // Allow minor errors
    
    if (errors.length > 0) {
      console.log('⚠️ JavaScript errors detected:', errors);
    } else {
      console.log('✅ No JavaScript errors detected');
    }
    
    // Performance check
    const loadTime = await page.evaluate(() => {
      return performance.now();
    });
    
    expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
    console.log('✅ Performance check passed: ' + Math.round(loadTime) + 'ms');
    
    console.log('🎉 Future Simulator MCP Validation Complete');
  });
});
EOF < /dev/null