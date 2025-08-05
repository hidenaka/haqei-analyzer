import { chromium } from 'playwright';

(async () => {
  const userDataDir = '/tmp/playwright-debug-' + Date.now();
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    devtools: true // Open DevTools
  });
  
  const page = await context.newPage();
  
  // Inject error capturing before navigation
  await page.addInitScript(() => {
    window.__capturedErrors = [];
    window.__originalError = window.onerror;
    
    window.onerror = function(message, source, lineno, colno, error) {
      window.__capturedErrors.push({
        message,
        source,
        lineno,
        colno,
        error: error?.toString()
      });
      if (window.__originalError) {
        return window.__originalError(message, source, lineno, colno, error);
      }
    };
    
    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      window.__capturedErrors.push({
        type: 'unhandledRejection',
        reason: event.reason?.toString(),
        promise: event.promise
      });
    });
  });
  
  console.log('Navigating to future_simulator.html...');
  
  // Capture all console messages
  const consoleLogs = [];
  page.on('console', async msg => {
    const args = await Promise.all(msg.args().map(arg => arg.jsonValue().catch(() => arg.toString())));
    const log = {
      type: msg.type(),
      text: msg.text(),
      args: args
    };
    consoleLogs.push(log);
    console.log(`[${log.type}] ${log.text}`);
  });
  
  // Navigate
  await page.goto('file:///Users/nakanohideaki/Desktop/haqei-analyzer/public/future_simulator.html', {
    waitUntil: 'networkidle'
  });
  
  // Wait a bit more
  await page.waitForTimeout(5000);
  
  // Get captured errors
  const capturedErrors = await page.evaluate(() => window.__capturedErrors);
  console.log('\n=== CAPTURED ERRORS ===');
  console.log(JSON.stringify(capturedErrors, null, 2));
  
  // Check initialization state
  const initState = await page.evaluate(() => {
    return {
      domContentLoaded: document.readyState === 'complete',
      moduleScriptExecuted: typeof window.isProductionEnvironment !== 'undefined',
      kuromojiLoaded: typeof window.kuromoji !== 'undefined',
      dictionaryManagerLoaded: typeof window.DictionaryManager !== 'undefined',
      systemInitialized: document.querySelector('#loading-screen')?.style.display === 'none'
    };
  });
  
  console.log('\n=== INITIALIZATION STATE ===');
  console.log(JSON.stringify(initState, null, 2));
  
  // Check for specific errors in module script
  const moduleErrors = await page.evaluate(() => {
    const moduleScript = document.querySelector('script[type="module"]');
    if (!moduleScript) return 'No module script found';
    
    try {
      // Try to check if functions are defined
      return {
        hasInitFunctions: typeof window.initializeSystem !== 'undefined',
        hasShowResults: typeof window.showResults !== 'undefined',
        hasHandleAnalysis: typeof window.handleAnalysis !== 'undefined'
      };
    } catch (e) {
      return { error: e.toString() };
    }
  });
  
  console.log('\n=== MODULE SCRIPT STATE ===');
  console.log(JSON.stringify(moduleErrors, null, 2));
  
  // Check console logs for specific patterns
  const syntaxErrors = consoleLogs.filter(log => 
    log.text.includes('Unexpected') || 
    log.text.includes('SyntaxError') ||
    log.type === 'error'
  );
  
  if (syntaxErrors.length > 0) {
    console.log('\n=== SYNTAX ERRORS FOUND ===');
    syntaxErrors.forEach(err => {
      console.log(`[${err.type}] ${err.text}`);
    });
  }
  
  // Try to manually trigger initialization
  console.log('\n=== ATTEMPTING MANUAL INITIALIZATION ===');
  const manualInit = await page.evaluate(() => {
    try {
      // Check if the loading screen remover exists
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        console.log('Found loading screen, attempting to hide...');
        loadingScreen.style.display = 'none';
        return 'Loading screen hidden manually';
      }
      return 'No loading screen found';
    } catch (e) {
      return 'Error: ' + e.toString();
    }
  });
  
  console.log(manualInit);
  
  // Final screenshot
  await page.screenshot({ path: 'deep-debug-result.png', fullPage: true });
  
  console.log('\n=== KEEPING BROWSER OPEN FOR INSPECTION ===');
  console.log('Check the DevTools console for any errors.');
  console.log('Browser will close in 30 seconds...');
  
  await page.waitForTimeout(30000);
  await context.close();
})();