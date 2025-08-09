const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Full Flow Navigation Test Started');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500,
    args: ['--no-sandbox', '--disable-web-security']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Console logging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[BROWSER ERROR]`, msg.text());
    }
  });
  
  // Error logging
  page.on('pageerror', error => {
    console.error(`[PAGE ERROR]`, error.message);
  });
  
  try {
    console.log('📍 Step 1: Navigate to OS Analyzer...');
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    // Take screenshot of welcome screen
    await page.screenshot({ path: 'step1-welcome-screen.png' });
    console.log('📸 Welcome screen screenshot saved');
    
    console.log('📍 Step 2: Look for start button...');
    
    // Look for various possible start button selectors
    const startButtonSelectors = [
      '#start-btn',
      '.start-btn', 
      '[class*="start"]',
      'button[onclick*="start"]',
      'button:has-text("開始")',
      'button:has-text("スタート")',
      'button:has-text("診断開始")',
      'button:has-text("START")'
    ];
    
    let startButton = null;
    let foundSelector = null;
    
    for (const selector of startButtonSelectors) {
      try {
        startButton = await page.$(selector);
        if (startButton) {
          const isVisible = await startButton.isVisible();
          if (isVisible) {
            foundSelector = selector;
            console.log(`✅ Found start button with selector: ${selector}`);
            break;
          }
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!startButton) {
      console.log('🔍 No specific start button found, looking for any visible buttons...');
      const allButtons = await page.$$('button');
      console.log(`Found ${allButtons.length} buttons total`);
      
      for (let i = 0; i < allButtons.length; i++) {
        const button = allButtons[i];
        const isVisible = await button.isVisible();
        const text = await button.textContent();
        console.log(`Button ${i}: "${text}" - visible: ${isVisible}`);
        
        if (isVisible && (text.includes('開始') || text.includes('スタート') || text.includes('診断') || text.includes('START'))) {
          startButton = button;
          foundSelector = `button with text "${text}"`;
          break;
        }
      }
    }
    
    if (startButton) {
      console.log(`📍 Step 3: Click start button (${foundSelector})...`);
      await startButton.click();
      console.log('✅ Start button clicked');
      
      // Wait for questions to load
      await page.waitForTimeout(3000);
      
      // Take screenshot after start
      await page.screenshot({ path: 'step2-after-start-click.png' });
      console.log('📸 After start click screenshot saved');
      
      console.log('📍 Step 4: Check for questions...');
      
      // Look for questions with various selectors
      const questionSelectors = [
        '[data-question-id]',
        '.question',
        '[class*="question"]',
        'haqei-question'
      ];
      
      let questions = [];
      for (const selector of questionSelectors) {
        const elements = await page.$$(selector);
        if (elements.length > 0) {
          console.log(`Found ${elements.length} elements with selector: ${selector}`);
          
          for (let i = 0; i < Math.min(5, elements.length); i++) {
            const element = elements[i];
            const isVisible = await element.isVisible();
            const text = await element.textContent();
            questions.push({
              selector,
              index: i,
              visible: isVisible,
              text: text?.slice(0, 100) || 'No text',
              id: await element.getAttribute('data-question-id') || await element.getAttribute('id') || 'no-id'
            });
          }
          break;
        }
      }
      
      console.log('📋 Questions found:', questions);
      
      if (questions.length > 0 && questions.some(q => q.visible)) {
        console.log('✅ Questions are visible, proceeding with navigation test...');
        
        // Test answering the first question
        console.log('📍 Step 5: Answer first question...');
        
        const firstVisibleQuestion = questions.find(q => q.visible);
        console.log('🎯 Working with question:', firstVisibleQuestion);
        
        // Look for input elements in the first question
        const questionElement = await page.$(`[data-question-id="${firstVisibleQuestion.id}"]`) || 
                               await page.$(`.question:nth-of-type(1)`) ||
                               await page.$(`haqei-question:nth-of-type(1)`);
        
        if (questionElement) {
          // Look for radio inputs or clickable choices
          const choiceSelectors = [
            'input[type="radio"]',
            '.choice',
            '.option',
            '[class*="choice"]',
            '[class*="option"]',
            'button'
          ];
          
          let choiceClicked = false;
          
          for (const choiceSelector of choiceSelectors) {
            const choices = await questionElement.$$(choiceSelector);
            if (choices.length > 0) {
              console.log(`Found ${choices.length} choices with selector: ${choiceSelector}`);
              
              const firstChoice = choices[0];
              const isVisible = await firstChoice.isVisible();
              const text = await firstChoice.textContent();
              
              console.log(`First choice - visible: ${isVisible}, text: "${text?.slice(0, 50)}"`);
              
              if (isVisible) {
                console.log('🖱️ Clicking first choice...');
                await firstChoice.click();
                choiceClicked = true;
                console.log('✅ Choice clicked');
                break;
              }
            }
          }
          
          if (choiceClicked) {
            await page.waitForTimeout(1000);
            
            console.log('📍 Step 6: Look for next button...');
            
            // Look for next button
            const nextButtonSelectors = [
              '#next-btn',
              '.next-btn',
              '[class*="next"]',
              'button:has-text("次")',
              'button:has-text("Next")',
              'button:has-text("→")'
            ];
            
            let nextButton = null;
            let nextButtonSelector = null;
            
            for (const selector of nextButtonSelectors) {
              try {
                nextButton = await page.$(selector);
                if (nextButton) {
                  const isVisible = await nextButton.isVisible();
                  const isEnabled = !(await nextButton.getAttribute('disabled'));
                  
                  if (isVisible && isEnabled) {
                    nextButtonSelector = selector;
                    console.log(`✅ Found enabled next button: ${selector}`);
                    break;
                  } else {
                    console.log(`⚠️ Found next button ${selector} but visible:${isVisible}, enabled:${isEnabled}`);
                  }
                }
              } catch (e) {
                // Continue
              }
            }
            
            if (nextButton) {
              const buttonText = await nextButton.textContent();
              console.log(`📍 Step 7: Click next button ("${buttonText}")...`);
              
              await nextButton.click();
              console.log('✅ Next button clicked');
              
              await page.waitForTimeout(2000);
              
              // Check if we moved to next question
              console.log('📍 Step 8: Verify navigation to next question...');
              
              const currentQuestions = await page.$$eval('[data-question-id]:not([style*="display: none"]), .question:not([style*="display: none"])', 
                elements => elements.map(el => ({
                  id: el.dataset?.questionId || el.className,
                  visible: el.offsetParent !== null,
                  text: el.textContent?.slice(0, 50)
                }))
              );
              
              console.log('📋 Currently visible questions:', currentQuestions);
              
              if (currentQuestions.length > 0) {
                const currentQuestionId = currentQuestions[0].id;
                console.log(`📍 Current question: ${currentQuestionId}`);
                
                if (currentQuestionId !== firstVisibleQuestion.id && currentQuestionId !== 'question') {
                  console.log('✅ SUCCESS: Navigation to next question worked!');
                  
                  // Test completing all questions quickly
                  console.log('📍 Step 9: Test rapid completion...');
                  await testRapidCompletion(page);
                  
                } else {
                  console.log('❌ PROBLEM: Still on the same question - navigation not working');
                  
                  // Debug the navigation issue
                  await debugNavigationIssue(page);
                }
              } else {
                console.log('❌ No visible questions found after next click');
              }
              
            } else {
              console.log('❌ No enabled next button found');
              
              // Show all buttons for debugging
              const allButtons = await page.$$eval('button', buttons => 
                buttons.map(btn => ({
                  text: btn.textContent?.slice(0, 30),
                  disabled: btn.disabled,
                  visible: btn.offsetParent !== null,
                  classes: btn.className
                }))
              );
              console.log('🔍 All buttons on page:', allButtons);
            }
            
          } else {
            console.log('❌ Could not click any choice');
          }
        } else {
          console.log('❌ Could not find question element');
        }
        
      } else {
        console.log('❌ No visible questions found after start');
        
        // Debug what's actually visible
        const visibleElements = await page.$$eval('*', elements =>
          elements.filter(el => el.offsetParent !== null && el.textContent?.trim())
                 .slice(0, 10)
                 .map(el => ({
                   tag: el.tagName,
                   id: el.id,
                   classes: el.className,
                   text: el.textContent?.slice(0, 50)
                 }))
        );
        console.log('🔍 Visible elements:', visibleElements);
      }
      
    } else {
      console.log('❌ No start button found');
      
      // Show all visible elements for debugging
      const visibleElements = await page.$$eval('*', elements =>
        elements.filter(el => el.offsetParent !== null && el.tagName !== 'HTML' && el.tagName !== 'BODY')
               .slice(0, 20)
               .map(el => ({
                 tag: el.tagName,
                 id: el.id,
                 classes: el.className,
                 text: el.textContent?.slice(0, 100)
               }))
      );
      console.log('🔍 All visible elements:', visibleElements);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'error-state.png' });
  }
  
  console.log('🔍 Full flow test completed - keeping browser open for inspection');
  // Don't close browser immediately for debugging
  await page.waitForTimeout(10000);
  await browser.close();
})();

async function testRapidCompletion(page) {
  console.log('🚀 Starting rapid completion test...');
  
  for (let i = 2; i <= 30; i++) {
    console.log(`📋 Processing question ${i}...`);
    
    // Find current visible question
    const currentQuestion = await page.$('[data-question-id]:not([style*="display: none"]), .question:not([style*="display: none"])');
    
    if (currentQuestion) {
      // Click first available choice
      const choice = await currentQuestion.$('input[type="radio"], .choice, .option');
      if (choice) {
        await choice.click();
        await page.waitForTimeout(100);
        
        // Click next button
        const nextBtn = await page.$('#next-btn, .next-btn, button:has-text("次")');
        if (nextBtn) {
          const buttonText = await nextBtn.textContent();
          console.log(`🔘 Question ${i}: Clicking "${buttonText}"`);
          
          await nextBtn.click();
          await page.waitForTimeout(300);
          
          if (i === 30) {
            console.log('🎯 Last question completed, waiting for results...');
            await page.waitForTimeout(5000);
            
            // Check for results
            const resultsVisible = await page.evaluate(() => {
              const containers = ['#results-container', '.results', '[class*="result"]', '#analysis-container'];
              return containers.some(selector => {
                const el = document.querySelector(selector);
                return el && el.offsetParent !== null;
              });
            });
            
            console.log(`📊 Results visible: ${resultsVisible}`);
            
            if (resultsVisible) {
              console.log('✅ SUCCESS: Results are showing!');
              await page.screenshot({ path: 'results-success.png' });
            } else {
              console.log('❌ PROBLEM: Results not showing');
              await page.screenshot({ path: 'results-missing.png' });
              await debugResultsIssue(page);
            }
          }
        } else {
          console.log(`⚠️ No next button found for question ${i}`);
          break;
        }
      } else {
        console.log(`⚠️ No choice found for question ${i}`);
        break;
      }
    } else {
      console.log(`⚠️ Question ${i} not found`);
      break;
    }
  }
}

async function debugNavigationIssue(page) {
  console.log('🔍 Debugging navigation issue...');
  
  const debugInfo = await page.evaluate(() => {
    return {
      questionFlow: {
        exists: !!window.questionFlow,
        currentIndex: window.questionFlow?.currentQuestionIndex,
        totalQuestions: window.questionFlow?.questions?.length,
        answers: window.questionFlow?.answers?.length
      },
      visibleContainers: Array.from(document.querySelectorAll('[id*="container"]')).map(el => ({
        id: el.id,
        visible: el.offsetParent !== null,
        display: getComputedStyle(el).display
      })),
      errors: Array.from(document.querySelectorAll('.error, [class*="error"]')).map(el => el.textContent)
    };
  });
  
  console.log('🔍 Debug info:', debugInfo);
}

async function debugResultsIssue(page) {
  console.log('🔍 Debugging results issue...');
  
  const debugInfo = await page.evaluate(() => {
    return {
      currentUrl: window.location.href,
      visibleContainers: Array.from(document.querySelectorAll('[id*="container"], [class*="container"]')).map(el => ({
        id: el.id,
        classes: el.className,
        visible: el.offsetParent !== null,
        display: getComputedStyle(el).display
      })),
      questionFlow: {
        exists: !!window.questionFlow,
        currentIndex: window.questionFlow?.currentQuestionIndex,
        completed: window.questionFlow?.getCompletedCount?.() || 'unknown'
      }
    };
  });
  
  console.log('🔍 Results debug info:', debugInfo);
}