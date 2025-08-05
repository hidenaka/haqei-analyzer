const { chromium } = require('playwright');

(async () => {
  // Launch browser with isolated profile
  const browser = await chromium.launch({
    headless: false,
    args: ['--user-data-dir=/tmp/playwright-isolated-' + Date.now()]
  });

  const page = await browser.newPage();
  
  // Navigate to the problematic page
  await page.goto('file:///Users/nakanohideaki/Desktop/haqei-analyzer/public/future_simulator.html');
  
  // Wait for console messages
  page.on('console', msg => {
    console.log('Console:', msg.type(), msg.text());
  });
  
  // Capture errors
  page.on('pageerror', error => {
    console.error('Page error:', error.message);
  });
  
  // Wait a bit to see what happens
  await page.waitForTimeout(5000);
  
  // Check if still on loading screen
  const loadingText = await page.textContent('body');
  console.log('Page content:', loadingText);
  
  // Get all script errors
  const errors = await page.evaluate(() => {
    return window.__errors || [];
  });
  
  console.log('Captured errors:', errors);
  
  // Check if the loading indicator is still visible
  const isLoading = await page.isVisible('text=システムを初期化中');
  console.log('Still loading?', isLoading);
  
  // Take a screenshot
  await page.screenshot({ path: 'loading-issue.png' });
  
  await browser.close();
})();