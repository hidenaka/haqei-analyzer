import { chromium } from 'playwright';

(async () => {
  // Launch browser with isolated profile
  const userDataDir = '/tmp/playwright-isolated-' + Date.now();
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false
  });
  
  const page = await context.newPage();
  
  console.log('Navigating to future_simulator.html...');
  
  // Navigate to the problematic page
  await page.goto('file:///Users/nakanohideaki/Desktop/haqei-analyzer/public/future_simulator.html');
  
  // Capture console messages
  const consoleLogs = [];
  page.on('console', msg => {
    const logEntry = `[${msg.type()}] ${msg.text()}`;
    console.log('Console:', logEntry);
    consoleLogs.push(logEntry);
  });
  
  // Capture errors
  const pageErrors = [];
  page.on('pageerror', error => {
    console.error('Page error:', error.message);
    pageErrors.push(error.message);
  });
  
  // Wait for potential initialization
  await page.waitForTimeout(3000);
  
  // Check current state
  const pageTitle = await page.title();
  console.log('Page title:', pageTitle);
  
  // Check if still showing loading screen
  const loadingVisible = await page.isVisible('text=システムを初期化中');
  console.log('Loading screen visible:', loadingVisible);
  
  // Get the actual error from console
  const consoleError = await page.evaluate(() => {
    // Check if there's a syntax error in window
    return window.syntaxError || null;
  });
  
  if (consoleError) {
    console.log('Window syntax error:', consoleError);
  }
  
  // Try to get the module script content
  const moduleScriptExists = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[type="module"]'));
    return scripts.length > 0;
  });
  
  console.log('Module script exists:', moduleScriptExists);
  
  // Get all external script loading status
  const scriptStatus = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    return scripts.map(s => ({
      src: s.src,
      loaded: s.complete !== undefined ? s.complete : 'unknown'
    }));
  });
  
  console.log('External scripts status:');
  scriptStatus.forEach(s => console.log(`  ${s.src}: ${s.loaded}`));
  
  // Check if DOMContentLoaded fired
  const domReady = await page.evaluate(() => document.readyState);
  console.log('Document ready state:', domReady);
  
  // Summary
  console.log('\n=== SUMMARY ===');
  console.log('Console logs:', consoleLogs.length);
  console.log('Page errors:', pageErrors.length);
  if (pageErrors.length > 0) {
    console.log('First error:', pageErrors[0]);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'loading-issue-debug.png', fullPage: true });
  console.log('Screenshot saved as loading-issue-debug.png');
  
  // Keep browser open for manual inspection
  console.log('\nBrowser will close in 10 seconds...');
  await page.waitForTimeout(10000);
  
  await context.close();
})();