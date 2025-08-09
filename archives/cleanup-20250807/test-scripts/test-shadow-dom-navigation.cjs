const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Shadow DOM Navigation Test');
  
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
    if (type === 'ERROR' || text.includes('Next') || text.includes('clicked') || text.includes('navigation')) {
      console.log(`[BROWSER ${type}] ${text}`);
    }
  });
  
  // Error logging
  page.on('pageerror', error => {
    console.error(`[PAGE ERROR] ${error.message}`);
  });
  
  try {
    console.log('📍 Navigating to OS Analyzer...');
    await page.goto('http://localhost:8788/os_analyzer.html');
    
    console.log('⏳ Waiting for page to load...');
    await page.waitForTimeout(3000);
    
    // Click start button
    console.log('🖱️ Clicking start button...');
    const startButton = await page.$('#start-analysis-btn');
    if (startButton) {
      await startButton.click();
      await page.waitForTimeout(3000);
      
      console.log('📋 Testing Shadow DOM interaction...');
      
      // Test clicking on the first question using shadow DOM access
      const clickResult = await page.evaluate(() => {
        // Find the first haqei-question element
        const questionElement = document.querySelector('haqei-question');
        if (!questionElement) {
          return { error: 'No haqei-question element found' };
        }
        
        console.log('📍 Found question element:', questionElement.dataset.questionId);
        
        // Access shadow root
        const shadowRoot = questionElement.shadowRoot;
        if (!shadowRoot) {
          return { error: 'No shadow root found' };
        }
        
        // Find the first radio input in shadow DOM
        const radioInput = shadowRoot.querySelector('input[type="radio"]');
        if (!radioInput) {
          return { error: 'No radio input found in shadow DOM' };
        }
        
        console.log('🔘 Found radio input, attempting click...');
        
        // Try clicking the radio input
        radioInput.click();
        
        // Wait a moment and check if it's selected
        setTimeout(() => {
          console.log('📊 Radio input checked:', radioInput.checked);
        }, 100);
        
        return {
          success: true,
          questionId: questionElement.dataset.questionId,
          radioChecked: radioInput.checked,
          radioValue: radioInput.value
        };
      });
      
      console.log('🎯 Click result:', clickResult);
      
      if (clickResult.success) {
        await page.waitForTimeout(1000);
        
        // Now test the next button
        console.log('🔘 Testing next button...');
        
        const nextButtonResult = await page.evaluate(() => {
          // Look for next button in various ways
          const nextButton = document.querySelector('#next-btn') || 
                            document.querySelector('.next-btn') ||
                            document.querySelector('button[onclick*="next"]') ||
                            Array.from(document.querySelectorAll('button')).find(btn => 
                              btn.textContent.includes('次') || 
                              btn.textContent.includes('Next') ||
                              btn.textContent.includes('→')
                            );
          
          if (!nextButton) {
            return { error: 'Next button not found' };
          }
          
          console.log('🔘 Found next button:', nextButton.textContent.trim());
          console.log('🔘 Button disabled:', nextButton.disabled);
          console.log('🔘 Button visible:', nextButton.offsetParent !== null);
          
          if (nextButton.disabled) {
            return { error: 'Next button is disabled' };
          }
          
          // Click the next button
          nextButton.click();
          console.log('✅ Next button clicked');
          
          return {
            success: true,
            buttonText: nextButton.textContent.trim(),
            buttonId: nextButton.id,
            buttonClass: nextButton.className
          };
        });
        
        console.log('➡️ Next button result:', nextButtonResult);
        
        if (nextButtonResult.success) {
          await page.waitForTimeout(2000);
          
          // Check if we moved to the next question
          const navigationResult = await page.evaluate(() => {
            const activeQuestions = document.querySelectorAll('haqei-question.active-question');
            const allQuestions = document.querySelectorAll('haqei-question');
            
            return {
              totalQuestions: allQuestions.length,
              activeQuestions: activeQuestions.length,
              activeQuestionIds: Array.from(activeQuestions).map(q => q.dataset.questionId),
              firstQuestionId: allQuestions[0]?.dataset.questionId,
              questionStates: Array.from(allQuestions).slice(0, 5).map(q => ({
                id: q.dataset.questionId,
                hasActiveClass: q.classList.contains('active-question'),
                visible: q.offsetParent !== null,
                display: window.getComputedStyle(q).display,
                opacity: window.getComputedStyle(q).opacity
              }))
            };
          });
          
          console.log('📊 Navigation result:', navigationResult);
          
          if (navigationResult.activeQuestions > 0) {
            const currentQuestion = navigationResult.activeQuestionIds[0];
            if (currentQuestion && currentQuestion !== 'q1') {
              console.log(`✅ SUCCESS: Successfully navigated to ${currentQuestion}!`);
              
              // Test a few more navigations
              console.log('🚀 Testing additional navigation steps...');
              await testMultipleNavigation(page, 3);
              
            } else {
              console.log('❌ PROBLEM: Still on Q1 or invalid question');
            }
          } else {
            console.log('❌ PROBLEM: No active questions after navigation');
          }
        }
      } else {
        console.log('❌ Failed to interact with first question:', clickResult.error);
      }
      
    } else {
      console.log('❌ Start button not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'shadow-dom-navigation-error.png' });
  }
  
  console.log('⏳ Keeping browser open for manual inspection...');
  await page.waitForTimeout(10000);
  await browser.close();
})();

async function testMultipleNavigation(page, steps) {
  for (let i = 1; i <= steps; i++) {
    console.log(`📋 Additional navigation step ${i}...`);
    
    const stepResult = await page.evaluate(() => {
      // Find current active question
      const activeQuestion = document.querySelector('haqei-question.active-question');
      if (!activeQuestion) {
        return { error: 'No active question found' };
      }
      
      // Click first radio in shadow DOM
      const shadowRoot = activeQuestion.shadowRoot;
      const radioInput = shadowRoot?.querySelector('input[type="radio"]');
      if (radioInput) {
        radioInput.click();
      }
      
      // Find and click next button
      const nextButton = document.querySelector('#next-btn') || 
                        document.querySelector('.next-btn') ||
                        Array.from(document.querySelectorAll('button')).find(btn => 
                          btn.textContent.includes('次') || btn.textContent.includes('Next')
                        );
      
      if (nextButton && !nextButton.disabled) {
        nextButton.click();
        return { success: true, currentQuestion: activeQuestion.dataset.questionId };
      } else {
        return { error: 'Next button not available' };
      }
    });
    
    console.log(`📊 Step ${i} result:`, stepResult);
    
    if (!stepResult.success) {
      console.log(`⚠️ Navigation stopped at step ${i}: ${stepResult.error}`);
      break;
    }
    
    await page.waitForTimeout(1000);
  }
}