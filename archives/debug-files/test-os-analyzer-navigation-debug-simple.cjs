const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Simple OS Analyzer Debug Test');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-web-security']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Enhanced console logging
  page.on('console', msg => {
    const type = msg.type().toUpperCase();
    const text = msg.text();
    console.log(`[BROWSER ${type}] ${text}`);
  });
  
  // Error logging
  page.on('pageerror', error => {
    console.error(`[PAGE ERROR] ${error.message}`);
  });
  
  try {
    console.log('📍 Navigating to OS Analyzer...');
    await page.goto('http://localhost:8788/os_analyzer.html');
    
    console.log('⏳ Waiting for page to load...');
    await page.waitForTimeout(5000);
    
    // Check if global variables are loaded
    const globalCheck = await page.evaluate(() => {
      return {
        WORLDVIEW_QUESTIONS: typeof WORLDVIEW_QUESTIONS !== 'undefined' ? WORLDVIEW_QUESTIONS.length : 'undefined',
        SCENARIO_QUESTIONS: typeof SCENARIO_QUESTIONS !== 'undefined' ? SCENARIO_QUESTIONS.length : 'undefined',
        BaseComponent: typeof BaseComponent !== 'undefined',
        VirtualQuestionFlow: typeof VirtualQuestionFlow !== 'undefined',
        WelcomeScreen: typeof WelcomeScreen !== 'undefined',
        app: !!window.app,
        appReady: window.app ? 'initialized' : 'not ready'
      };
    });
    
    console.log('🔍 Global variables check:', globalCheck);
    
    // Check if start button exists and is visible
    const startButtonCheck = await page.evaluate(() => {
      const startBtn = document.querySelector('#start-analysis-btn');
      const startButtons = document.querySelectorAll('[class*="start"], #start-analysis-btn');
      return {
        correctButton: startBtn ? {
          tagName: startBtn.tagName,
          className: startBtn.className,
          text: startBtn.textContent?.slice(0, 50),
          visible: startBtn.offsetParent !== null,
          disabled: startBtn.disabled,
          id: startBtn.id
        } : null,
        allButtons: Array.from(startButtons).map(btn => ({
          tagName: btn.tagName,
          className: btn.className,
          text: btn.textContent?.slice(0, 50),
          visible: btn.offsetParent !== null,
          disabled: btn.disabled,
          id: btn.id
        }))
      };
    });
    
    console.log('🔘 Start buttons found:', startButtonCheck);
    
    // Find and click the correct start button
    const startButton = await page.$('#start-analysis-btn');
    if (startButton) {
      console.log('🖱️ Clicking start button...');
      await startButton.click();
      
      // Wait a bit for the transition
      await page.waitForTimeout(3000);
      
      // Check question flow initialization
      const questionFlowCheck = await page.evaluate(() => {
        return {
          questionFlow: window.app ? !!window.app.questionFlow : 'app not ready',
          questionFlowInit: window.app?.questionFlow ? 'initialized' : 'not initialized',
          questionsContainer: !!document.getElementById('questions-container'),
          questionsContainerVisible: document.getElementById('questions-container')?.offsetParent !== null,
          questionsContainerStyle: document.getElementById('questions-container')?.style.display,
          questionElements: document.querySelectorAll('[data-question-id]').length,
          visibleQuestions: Array.from(document.querySelectorAll('[data-question-id]')).filter(el => el.offsetParent !== null).length
        };
      });
      
      console.log('📋 Question flow check:', questionFlowCheck);
      
      // Take screenshots for debugging
      await page.screenshot({ path: 'debug-after-start-click.png' });
      console.log('📸 Screenshot saved: debug-after-start-click.png');
      
      // Check for any JavaScript errors
      const jsErrors = await page.evaluate(() => {
        return window.jsErrors || [];
      });
      
      if (jsErrors.length > 0) {
        console.log('🚨 JavaScript errors found:', jsErrors);
      }
      
    } else {
      console.log('❌ Start button not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'debug-error.png' });
  }
  
  console.log('🔍 Debug test completed - keeping browser open for inspection');
  await page.waitForTimeout(10000);
  await browser.close();
})();