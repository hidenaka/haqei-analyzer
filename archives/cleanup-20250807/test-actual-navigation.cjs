const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Actual Question Navigation Test');
  
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
    if (type === 'ERROR' || text.includes('q1') || text.includes('q2') || text.includes('Navigation') || text.includes('Next')) {
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
      
      console.log('📋 Questions should now be displayed. Testing interaction...');
      
      // Test question 1 interaction
      console.log('🎯 Testing Q1 interaction...');
      
      // Look for first question choice
      const firstChoice = await page.$('haqei-question input[type="radio"]');
      if (firstChoice) {
        console.log('🔘 Found first choice, clicking...');
        await firstChoice.click();
        
        await page.waitForTimeout(1000);
        
        // Look for next button
        const nextButton = await page.$('#next-btn, .next-btn, button:has-text("次")');
        if (nextButton) {
          const buttonText = await nextButton.textContent();
          const isDisabled = await nextButton.getAttribute('disabled');
          
          console.log(`🔘 Found next button: "${buttonText}", disabled: ${!!isDisabled}`);
          
          if (!isDisabled) {
            console.log('🖱️ Clicking next button...');
            await nextButton.click();
            
            await page.waitForTimeout(2000);
            
            // Check if we moved to next question
            const questionCheck = await page.evaluate(() => {
              const questions = document.querySelectorAll('haqei-question');
              const visible = Array.from(questions).map((q, index) => ({
                index,
                id: q.getAttribute('data-question-id') || `q${index + 1}`,
                isVisible: q.offsetParent !== null || q.getBoundingClientRect().width > 0,
                hasClass: q.classList.contains('active-question'),
                display: window.getComputedStyle(q).display,
                visibility: window.getComputedStyle(q).visibility,
                opacity: window.getComputedStyle(q).opacity
              }));
              
              return {
                totalQuestions: questions.length,
                visibleQuestions: visible.filter(q => q.isVisible).length,
                activeQuestions: visible.filter(q => q.hasClass).length,
                questionDetails: visible.slice(0, 5) // First 5 questions
              };
            });
            
            console.log('📊 Question status after next click:', questionCheck);
            
            if (questionCheck.activeQuestions > 0) {
              const activeQuestion = questionCheck.questionDetails.find(q => q.hasClass);
              if (activeQuestion && activeQuestion.id !== 'q1') {
                console.log(`✅ SUCCESS: Navigation working! Now on ${activeQuestion.id}`);
                
                // Test a few more navigation steps
                console.log('🚀 Testing rapid navigation through multiple questions...');
                await testRapidNavigation(page, 5); // Test 5 more questions
                
              } else if (activeQuestion && activeQuestion.id === 'q1') {
                console.log('❌ PROBLEM: Still on Q1 - navigation not working');
              }
            } else {
              console.log('❌ PROBLEM: No active questions found after navigation');
            }
            
          } else {
            console.log('⚠️ Next button is disabled');
          }
        } else {
          console.log('❌ No next button found');
          
          // Debug: show all buttons
          const allButtons = await page.$$eval('button', buttons => 
            buttons.map(btn => ({
              text: btn.textContent?.slice(0, 30),
              id: btn.id,
              className: btn.className,
              disabled: btn.disabled,
              visible: btn.offsetParent !== null
            }))
          );
          console.log('🔍 All buttons on page:', allButtons);
        }
        
      } else {
        console.log('❌ No radio input found for first question');
        
        // Debug: show what question elements exist
        const questionElements = await page.$$eval('haqei-question', elements =>
          elements.map((el, index) => ({
            index,
            id: el.getAttribute('data-question-id'),
            className: el.className,
            hasContent: el.textContent?.length > 0,
            hasRadios: el.querySelectorAll('input[type="radio"]').length,
            hasChoices: el.querySelectorAll('.choice, .option').length
          }))
        );
        console.log('🔍 Question elements found:', questionElements);
      }
      
    } else {
      console.log('❌ Start button not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'navigation-test-error.png' });
  }
  
  console.log('⏳ Keeping browser open for manual inspection...');
  await page.waitForTimeout(15000);
  await browser.close();
})();

async function testRapidNavigation(page, questionCount) {
  for (let i = 2; i <= questionCount + 1; i++) {
    console.log(`📋 Testing question ${i}...`);
    
    // Click first available choice
    const choice = await page.$('haqei-question.active-question input[type="radio"]');
    if (choice) {
      await choice.click();
      await page.waitForTimeout(200);
      
      // Click next button
      const nextBtn = await page.$('#next-btn, .next-btn, button:has-text("次")');
      if (nextBtn) {
        const buttonText = await nextBtn.textContent();
        console.log(`🔘 Question ${i}: Clicking "${buttonText.trim()}"...`);
        
        await nextBtn.click();
        await page.waitForTimeout(500);
        
        // Quick check if we advanced
        const currentQuestion = await page.evaluate(() => {
          const active = document.querySelector('haqei-question.active-question');
          return active ? active.getAttribute('data-question-id') || 'unknown' : 'none';
        });
        
        console.log(`📍 After Q${i} navigation: Currently on ${currentQuestion}`);
        
      } else {
        console.log(`⚠️ No next button found for question ${i}`);
        break;
      }
    } else {
      console.log(`⚠️ No choice found for question ${i}`);
      break;
    }
  }
}