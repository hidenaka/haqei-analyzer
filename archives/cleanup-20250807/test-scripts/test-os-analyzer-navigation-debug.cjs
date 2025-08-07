const { chromium } = require('playwright');

(async () => {
  console.log('🔍 OS Analyzer Navigation Debug Test Started');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-web-security']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Console logging
  page.on('console', msg => {
    console.log(`[BROWSER ${msg.type().toUpperCase()}]`, msg.text());
  });
  
  // Error logging
  page.on('pageerror', error => {
    console.error(`[PAGE ERROR]`, error.message);
  });
  
  try {
    console.log('📍 Navigating to OS Analyzer...');
    await page.goto('http://localhost:8788/os_analyzer.html');
    
    console.log('⏳ Waiting for page to load...');
    await page.waitForTimeout(3000);
    
    // Take initial screenshot
    await page.screenshot({ path: 'debug-initial-load.png' });
    console.log('📸 Initial screenshot saved');
    
    // Check if questions are displayed
    console.log('🔍 Checking for questions...');
    const questions = await page.$$eval('[data-question-id]', elements => 
      elements.map(el => ({
        id: el.dataset.questionId,
        visible: el.offsetParent !== null,
        text: el.textContent.slice(0, 100)
      }))
    );
    
    console.log(`📋 Found ${questions.length} questions:`, questions);
    
    if (questions.length === 0) {
      console.log('❌ No questions found - checking for errors');
      const errors = await page.evaluate(() => {
        const errorElements = document.querySelectorAll('.error, [class*="error"]');
        return Array.from(errorElements).map(el => el.textContent);
      });
      console.log('🚨 Errors found:', errors);
    }
    
    // Look for the first visible question
    console.log('🎯 Looking for first visible question...');
    const firstQuestion = await page.$('[data-question-id="q1"]');
    
    if (firstQuestion) {
      console.log('✅ Found first question, checking choices...');
      
      // Look for choice elements
      const choices = await page.$$eval('[data-question-id="q1"] input[type="radio"], [data-question-id="q1"] .choice, [data-question-id="q1"] .option', 
        elements => elements.map(el => ({
          type: el.tagName,
          value: el.value || el.textContent?.slice(0, 50),
          visible: el.offsetParent !== null
        }))
      );
      
      console.log(`🔘 Found ${choices.length} choices:`, choices);
      
      if (choices.length > 0) {
        console.log('🖱️ Attempting to click first choice...');
        
        // Try to click the first available choice
        const firstChoice = await page.$('[data-question-id="q1"] input[type="radio"]');
        if (firstChoice) {
          await firstChoice.click();
          console.log('✅ Clicked first choice');
          
          await page.waitForTimeout(1000);
          
          // Look for next button
          console.log('🔍 Looking for next button...');
          const nextButton = await page.$('#next-btn, .next-btn, [class*="next"]');
          
          if (nextButton) {
            const buttonText = await nextButton.textContent();
            const isDisabled = await nextButton.getAttribute('disabled');
            
            console.log(`🔘 Found next button: "${buttonText}", disabled: ${isDisabled}`);
            
            if (!isDisabled) {
              console.log('🖱️ Clicking next button...');
              await nextButton.click();
              
              await page.waitForTimeout(2000);
              
              // Check if we moved to next question
              const currentQuestion = await page.evaluate(() => {
                const visibleQuestion = document.querySelector('[data-question-id]:not([style*="display: none"])');
                return visibleQuestion ? visibleQuestion.dataset.questionId : 'none';
              });
              
              console.log(`📍 Current question after next click: ${currentQuestion}`);
              
              if (currentQuestion === 'q1') {
                console.log('❌ PROBLEM: Still on question 1 - next button not working');
                
                // Debug: Check navigation logic
                const debugInfo = await page.evaluate(() => {
                  return {
                    questionFlow: window.questionFlow ? 'exists' : 'missing',
                    currentIndex: window.questionFlow?.currentQuestionIndex || 'unknown',
                    totalQuestions: window.questionFlow?.questions?.length || 'unknown',
                    answers: window.questionFlow?.answers?.length || 'unknown'
                  };
                });
                
                console.log('🔍 Debug info:', debugInfo);
              } else {
                console.log(`✅ Successfully moved to question: ${currentQuestion}`);
              }
            } else {
              console.log('⚠️ Next button is disabled');
            }
          } else {
            console.log('❌ No next button found');
          }
          
        } else {
          console.log('❌ No radio input found for first question');
        }
      } else {
        console.log('❌ No choices found for first question');
      }
    } else {
      console.log('❌ First question not found');
    }
    
    // Test completing all questions quickly
    console.log('🚀 Testing quick completion of all questions...');
    
    for (let i = 1; i <= 30; i++) {
      const questionId = `q${i}`;
      const question = await page.$(`[data-question-id="${questionId}"]`);
      
      if (question) {
        console.log(`📋 Processing question ${i}...`);
        
        // Click first available choice
        const choice = await page.$(`[data-question-id="${questionId}"] input[type="radio"]`);
        if (choice) {
          await choice.click();
          await page.waitForTimeout(100);
          
          // Click next button
          const nextBtn = await page.$('#next-btn, .next-btn');
          if (nextBtn) {
            const isLastQuestion = i === 30;
            const buttonText = await nextBtn.textContent();
            
            console.log(`🔘 Question ${i}: Button text = "${buttonText}"`);
            
            await nextBtn.click();
            await page.waitForTimeout(500);
            
            if (isLastQuestion) {
              console.log('🎯 Last question completed, checking for results...');
              await page.waitForTimeout(3000);
              
              // Check if results page is shown
              const resultsVisible = await page.evaluate(() => {
                const resultsContainer = document.querySelector('#results-container, .results, [class*="result"]');
                return resultsContainer && resultsContainer.offsetParent !== null;
              });
              
              console.log(`📊 Results visible: ${resultsVisible}`);
              
              if (!resultsVisible) {
                console.log('❌ PROBLEM: Results not showing after completing all questions');
                
                // Check current page state
                const pageState = await page.evaluate(() => {
                  return {
                    url: window.location.href,
                    visibleContainers: Array.from(document.querySelectorAll('[id*="container"]')).map(el => ({
                      id: el.id,
                      visible: el.offsetParent !== null
                    }))
                  };
                });
                
                console.log('🔍 Page state after completion:', pageState);
              } else {
                console.log('✅ Results are displaying correctly');
              }
              
              break;
            }
          }
        }
      } else {
        console.log(`⚠️ Question ${i} not found or not visible`);
        break;
      }
    }
    
    // Final screenshot
    await page.screenshot({ path: 'debug-final-state.png' });
    console.log('📸 Final screenshot saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'debug-error-state.png' });
  }
  
  console.log('🔍 Debug test completed');
  await browser.close();
})();