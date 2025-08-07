const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Enhanced Shadow DOM Navigation Test with Event Debugging');
  
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
    await page.waitForTimeout(3000);
    
    // Click start button
    console.log('🖱️ Clicking start button...');
    const startButton = await page.$('#start-analysis-btn');
    if (startButton) {
      await startButton.click();
      await page.waitForTimeout(3000);
      
      console.log('📋 Testing enhanced Shadow DOM interaction with event debugging...');
      
      // Enhanced Shadow DOM interaction with proper event handling
      const interactionResult = await page.evaluate(() => {
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
        
        console.log('🔍 Searching for radio inputs in shadow DOM...');
        
        // Find all radio inputs in shadow DOM
        const radioInputs = shadowRoot.querySelectorAll('input[type="radio"]');
        console.log(`🔘 Found ${radioInputs.length} radio inputs in shadow DOM`);
        
        if (radioInputs.length === 0) {
          return { error: 'No radio inputs found in shadow DOM' };
        }
        
        const firstRadio = radioInputs[0];
        console.log(`🎯 First radio value: ${firstRadio.value}, name: ${firstRadio.name}`);
        
        // Check current answer state before clicking
        const beforeState = {
          checked: firstRadio.checked,
          hasAnswerChangeListener: !!questionElement.getAttribute('data-has-listener')
        };
        
        // Create a promise to track the answer-change event
        let answerChangeReceived = false;
        let answerChangeDetail = null;
        
        const answerChangeHandler = (event) => {
          console.log('🎉 Answer-change event received!', event.detail);
          answerChangeReceived = true;
          answerChangeDetail = event.detail;
        };
        
        // Add temporary listener to track events
        questionElement.addEventListener('answer-change', answerChangeHandler);
        
        // Manual event dispatch to force the change event
        console.log('🔧 Manually triggering change events...');
        
        // Method 1: Click the radio input
        firstRadio.click();
        
        // Method 2: Set checked and dispatch change event manually
        firstRadio.checked = true;
        const changeEvent = new Event('change', { bubbles: true });
        firstRadio.dispatchEvent(changeEvent);
        
        // Method 3: Click the label to trigger HaqeiQuestionElement's click handler
        const label = firstRadio.closest('.option-label');
        if (label) {
          console.log('🏷️ Found label, clicking it too...');
          label.click();
        }
        
        // Wait a moment for events to process
        return new Promise((resolve) => {
          setTimeout(() => {
            questionElement.removeEventListener('answer-change', answerChangeHandler);
            
            const afterState = {
              checked: firstRadio.checked,
              answerChangeReceived,
              answerChangeDetail
            };
            
            resolve({
              success: true,
              questionId: questionElement.dataset.questionId,
              beforeState,
              afterState,
              radioInputsCount: radioInputs.length,
              events: {
                answerChangeReceived,
                answerChangeDetail
              }
            });
          }, 500);
        });
      });
      
      const result = await interactionResult;
      console.log('🎯 Enhanced interaction result:', JSON.stringify(result, null, 2));
      
      if (result.success) {
        await page.waitForTimeout(2000);
        
        // Now check the next button state
        console.log('🔘 Checking next button state after answer...');
        
        const buttonState = await page.evaluate(() => {
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
          
          // Get the VirtualQuestionFlow instance to check answer state
          const questionsContainer = document.getElementById('questions-container');
          const vqfInstance = questionsContainer?._vqfInstance || window.globalVQF;
          
          let vqfState = null;
          if (vqfInstance) {
            try {
              const currentQuestion = vqfInstance.questions[vqfInstance.currentQuestionIndex];
              const hasAnswer = vqfInstance.checkCurrentQuestionAnswered(currentQuestion);
              const answerCount = vqfInstance.getCompletedCount();
              
              vqfState = {
                currentQuestionIndex: vqfInstance.currentQuestionIndex,
                currentQuestionId: currentQuestion?.id,
                hasAnswer,
                answerCount,
                totalQuestions: vqfInstance.questions.length
              };
            } catch (e) {
              vqfState = { error: e.message };
            }
          }
          
          return {
            success: true,
            buttonText: nextButton.textContent.trim(),
            buttonId: nextButton.id,
            buttonClass: nextButton.className,
            disabled: nextButton.disabled,
            visible: nextButton.offsetParent !== null,
            vqfState
          };
        });
        
        console.log('📊 Button state result:', JSON.stringify(buttonState, null, 2));
        
        // If button is still disabled, try to force-enable it and test navigation
        if (buttonState.success && buttonState.disabled) {
          console.log('⚠️ Button is still disabled, investigating...');
          
          // Try to manually update the VQF instance
          const forceUpdateResult = await page.evaluate(() => {
            const questionsContainer = document.getElementById('questions-container');
            const vqfInstance = questionsContainer?._vqfInstance || window.globalVQF;
            
            if (vqfInstance) {
              console.log('🔧 Force updating VQF navigation buttons...');
              vqfInstance.updateNavigationButtons();
              
              // Check if button is now enabled
              const nextButton = document.querySelector('#next-btn');
              return {
                success: true,
                newButtonState: {
                  disabled: nextButton?.disabled,
                  text: nextButton?.textContent.trim()
                }
              };
            }
            
            return { error: 'VQF instance not found' };
          });
          
          console.log('🔄 Force update result:', forceUpdateResult);
        }
        
        // Try clicking the next button regardless of state
        if (buttonState.success) {
          console.log('🖱️ Attempting to click next button...');
          
          const clickResult = await page.evaluate(() => {
            const nextButton = document.querySelector('#next-btn') || 
                              Array.from(document.querySelectorAll('button')).find(btn => 
                                btn.textContent.includes('次') || btn.textContent.includes('→')
                              );
            
            if (nextButton) {
              console.log('🔘 Clicking next button...');
              nextButton.click();
              return { success: true, clicked: true };
            }
            
            return { error: 'Next button not found for clicking' };
          });
          
          console.log('🎯 Click result:', clickResult);
          
          if (clickResult.success) {
            await page.waitForTimeout(2000);
            
            // Check if we navigated
            const navigationResult = await page.evaluate(() => {
              const activeQuestions = document.querySelectorAll('haqei-question.active-question');
              const allQuestions = document.querySelectorAll('haqei-question');
              
              return {
                totalQuestions: allQuestions.length,
                activeQuestions: activeQuestions.length,
                activeQuestionIds: Array.from(activeQuestions).map(q => q.dataset.questionId),
                firstFewQuestions: Array.from(allQuestions).slice(0, 3).map(q => ({
                  id: q.dataset.questionId,
                  hasActiveClass: q.classList.contains('active-question'),
                  visible: q.offsetParent !== null,
                  display: window.getComputedStyle(q).display
                }))
              };
            });
            
            console.log('📊 Final navigation result:', navigationResult);
            
            if (navigationResult.activeQuestions > 0) {
              const currentQuestion = navigationResult.activeQuestionIds[0];
              if (currentQuestion && currentQuestion !== 'q1') {
                console.log(`✅ SUCCESS: Navigation working! Now on ${currentQuestion}!`);
              } else {
                console.log('❌ PROBLEM: Still on Q1 - navigation not working');
              }
            } else {
              console.log('❌ PROBLEM: No active questions after navigation');
            }
          }
        }
      } else {
        console.log('❌ Enhanced interaction failed:', result.error);
      }
      
    } else {
      console.log('❌ Start button not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'enhanced-shadow-dom-navigation-error.png' });
  }
  
  console.log('⏳ Keeping browser open for manual inspection...');
  await page.waitForTimeout(15000);
  await browser.close();
})();