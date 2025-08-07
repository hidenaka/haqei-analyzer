const { chromium } = require('playwright');

async function detectErrors() {
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Comprehensive error tracking
  const errors = {
    console: [],
    network: [],
    javascript: [],
    css: [],
    uncaught: []
  };
  
  // Console error tracking
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.console.push({
        text: msg.text(),
        location: msg.location(),
        type: msg.type()
      });
      console.log(`🚨 Console Error: ${msg.text()}`);
    }
    
    if (msg.type() === 'warning') {
      console.log(`⚠️  Console Warning: ${msg.text()}`);
    }
  });
  
  // Network error tracking
  page.on('requestfailed', request => {
    errors.network.push({
      url: request.url(),
      failure: request.failure()?.errorText,
      method: request.method()
    });
    console.log(`🔌 Network Error: ${request.url()} - ${request.failure()?.errorText}`);
  });
  
  // Page error tracking
  page.on('pageerror', error => {
    errors.javascript.push({
      message: error.message,
      stack: error.stack
    });
    console.log(`💥 JavaScript Error: ${error.message}`);
  });
  
  try {
    console.log('🔍 Loading Future Simulator page...');
    
    // Go to page and capture immediate errors
    const response = await page.goto('http://127.0.0.1:8788/future_simulator.html', {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });
    
    console.log(`📊 Response Status: ${response?.status()}`);
    
    // Wait for any dynamic errors
    await page.waitForTimeout(3000);
    
    // Check what's actually in the DOM
    const bodyContent = await page.evaluate(() => {
      return {
        bodyTextLength: document.body?.textContent?.length || 0,
        hasVisibleElements: document.querySelectorAll('*:not(script):not(style)').length > 10,
        firstVisibleElement: document.querySelector('body > *:not(script):not(style)')?.tagName,
        stylesheetCount: document.styleSheets.length,
        scriptCount: document.querySelectorAll('script').length
      };
    });
    
    console.log('📋 DOM Analysis:', bodyContent);
    
    // Check for specific elements
    const elementCheck = await page.evaluate(() => {
      return {
        hasWorryInput: !!document.getElementById('worryInput'),
        hasAiGuessBtn: !!document.getElementById('aiGuessBtn'),
        hasInputContent: !!document.getElementById('input-content'),
        hasMainContainer: !!document.querySelector('.container, .main, .app'),
        visibleElements: Array.from(document.querySelectorAll('*')).filter(el => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden';
        }).length
      };
    });
    
    console.log('🎯 Element Analysis:', elementCheck);
    
    // Take detailed screenshots
    await page.screenshot({ path: 'error-display.png', fullPage: true });
    
    // Check computed styles of body
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity
      };
    });
    
    console.log('🎨 Body Styles:', bodyStyles);
    
  } catch (error) {
    console.log('❌ Page Load Error:', error.message);
    errors.uncaught.push(error.message);
  }
  
  await browser.close();
  
  // Summary report
  console.log('\n📊 COMPREHENSIVE ERROR REPORT');
  console.log('=====================================');
  console.log(`Console Errors: ${errors.console.length}`);
  console.log(`Network Errors: ${errors.network.length}`);
  console.log(`JavaScript Errors: ${errors.javascript.length}`);
  
  if (errors.console.length > 0) {
    console.log('\n🚨 CONSOLE ERRORS:');
    errors.console.forEach((error, i) => {
      console.log(`${i + 1}. ${error.text}`);
    });
  }
  
  if (errors.network.length > 0) {
    console.log('\n🔌 NETWORK ERRORS:');
    errors.network.forEach((error, i) => {
      console.log(`${i + 1}. ${error.url} - ${error.failure}`);
    });
  }
  
  if (errors.javascript.length > 0) {
    console.log('\n💥 JAVASCRIPT ERRORS:');
    errors.javascript.forEach((error, i) => {
      console.log(`${i + 1}. ${error.message}`);
    });
  }
  
  return errors;
}

// Run detection
detectErrors()
  .then(errors => {
    const totalErrors = errors.console.length + errors.network.length + errors.javascript.length;
    console.log(`\n🎯 Total Errors Found: ${totalErrors}`);
    
    if (totalErrors === 0) {
      console.log('✅ No critical errors detected - investigating rendering issue');
    } else {
      console.log('❌ Critical errors found - need immediate fixing');
    }
  })
  .catch(error => {
    console.error('Detection failed:', error);
  });