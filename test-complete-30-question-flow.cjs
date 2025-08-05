const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Complete 30-Question Flow Test - Start to Results');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 200, // Faster for 30 questions
    args: ['--no-sandbox', '--disable-web-security']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Focused console logging
  page.on('console', msg => {
    const type = msg.type().toUpperCase();
    const text = msg.text();
    if (type === 'ERROR' || 
        text.includes('question') || 
        text.includes('analysis') || 
        text.includes('results') ||
        text.includes('complete') ||
        text.includes('Answer updated') ||
        text.includes('Moved to question') ||
        text.includes('All ') ||
        text.includes('🏁')) {
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
      await page.waitForTimeout(2000);
      
      console.log('🚀 Starting complete 30-question flow test...');
      
      // Function to answer current question and move to next
      const answerCurrentQuestion = async (questionNum) => {
        const result = await page.evaluate((qNum) => {
          // Find current active question
          const activeQuestion = document.querySelector('haqei-question.active-question') ||
                                document.querySelector('haqei-question');
          
          if (!activeQuestion) {
            return { error: `No active question found for Q${qNum}` };
          }
          
          const questionId = activeQuestion.dataset.questionId;
          console.log(`📋 Answering Q${qNum} (${questionId})...`);
          
          // Access shadow root and click first radio input
          const shadowRoot = activeQuestion.shadowRoot;
          if (!shadowRoot) {
            return { error: `No shadow root for Q${qNum}` };
          }
          
          const radioInputs = shadowRoot.querySelectorAll('input[type=\"radio\"]');
          if (radioInputs.length === 0) {
            return { error: `No radio inputs found for Q${qNum}` };
          }
          
          // Click the first radio input
          const firstRadio = radioInputs[0];
          firstRadio.click();
          firstRadio.checked = true;
          
          // Dispatch change event
          const changeEvent = new Event('change', { bubbles: true });
          firstRadio.dispatchEvent(changeEvent);
          
          // Wait for answer to be processed
          setTimeout(() => {
            // Check if next button is available and enabled
            const nextButton = document.querySelector('#next-btn');
            if (nextButton && !nextButton.disabled) {
              console.log(`✅ Q${qNum} answered, clicking next...`);
              nextButton.click();
            } else if (nextButton && nextButton.disabled) {
              console.log(`⚠️ Q${qNum} answered but next button still disabled`);
            } else {
              console.log(`❌ Next button not found for Q${qNum}`);
            }
          }, 100);
          
          return {
            success: true,
            questionId,
            questionNum: qNum,
            radioValue: firstRadio.value,
            radioCount: radioInputs.length
          };
        }, questionNum);
        
        return result;
      };
      
      // Answer all 30 questions
      console.log('📝 Starting to answer all 30 questions...');
      
      for (let i = 1; i <= 30; i++) {
        console.log(`\n🔄 Processing Question ${i}/30...`);
        
        // Wait for question to be visible
        await page.waitForTimeout(300);
        
        // Answer the current question
        const answerResult = await answerCurrentQuestion(i);
        if (answerResult.error) {
          console.error(`❌ Error on Q${i}:`, answerResult.error);
          
          // Try to debug what's on screen
          const debugInfo = await page.evaluate(() => {
            const questions = document.querySelectorAll('haqei-question');
            const activeQuestions = document.querySelectorAll('haqei-question.active-question');
            const nextBtn = document.querySelector('#next-btn');
            
            return {
              totalQuestions: questions.length,
              activeQuestions: activeQuestions.length,
              activeIds: Array.from(activeQuestions).map(q => q.dataset.questionId),
              nextButtonExists: !!nextBtn,
              nextButtonDisabled: nextBtn?.disabled,
              nextButtonText: nextBtn?.textContent.trim()
            };
          });
          
          console.log('🔍 Debug info:', debugInfo);
          break;
        }
        
        console.log(`✅ Q${i} processed: ${answerResult.questionId} (${answerResult.radioValue})`);
        
        // Wait for navigation to complete
        await page.waitForTimeout(400);
        
        // Check if we're on the last question
        if (i === 30) {
          console.log('🏁 Reached final question (Q30), checking for analysis completion...');
          
          // Wait a bit longer for final processing
          await page.waitForTimeout(2000);
          
          // Check if analysis has started or results are showing
          const finalState = await page.evaluate(() => {
            const resultsContainer = document.getElementById('results-container');
            const questionsContainer = document.getElementById('questions-container');
            const nextBtn = document.querySelector('#next-btn');
            
            // Look for any analysis or results indicators
            const analysisElements = document.querySelectorAll('[id*="analysis"], [id*="result"], [class*="analysis"], [class*="result"]');
            
            return {
              resultsContainerExists: !!resultsContainer,
              resultsContainerVisible: resultsContainer ? resultsContainer.offsetParent !== null : false,
              questionsContainerVisible: questionsContainer ? questionsContainer.offsetParent !== null : false,
              nextButtonText: nextBtn?.textContent.trim(),
              nextButtonDisabled: nextBtn?.disabled,
              analysisElementsCount: analysisElements.length,
              analysisElementIds: Array.from(analysisElements).slice(0, 5).map(el => ({
                id: el.id,
                className: el.className,
                visible: el.offsetParent !== null
              }))
            };
          });
          
          console.log('🔍 Final state after Q30:', JSON.stringify(finalState, null, 2));
          
          // If next button shows "分析開始", click it
          if (finalState.nextButtonText && finalState.nextButtonText.includes('分析')) {
            console.log('🖱️ Clicking analysis start button...');
            await page.click('#next-btn');
            await page.waitForTimeout(3000);
            
            // Check for results
            const analysisResult = await page.evaluate(() => {
              const resultsContainer = document.getElementById('results-container');
              const hasResults = resultsContainer && resultsContainer.offsetParent !== null;
              
              // Look for various result indicators
              const resultElements = Array.from(document.querySelectorAll('*')).filter(el => 
                el.textContent && (
                  el.textContent.includes('分析結果') ||
                  el.textContent.includes('あなたの') ||
                  el.textContent.includes('結果') ||
                  el.textContent.includes('プロファイル')
                )
              );
              
              return {
                resultsShowing: hasResults,
                resultElementsFound: resultElements.length,
                resultTexts: resultElements.slice(0, 3).map(el => el.textContent.slice(0, 50))
              };
            });
            
            console.log('📊 Analysis result:', JSON.stringify(analysisResult, null, 2));
            
            if (analysisResult.resultsShowing || analysisResult.resultElementsFound > 0) {
              console.log('🎉 SUCCESS: Complete flow working! Results displayed after 30 questions!');
            } else {
              console.log('⚠️ Analysis triggered but results not clearly visible');
            }
          } else {
            console.log('⚠️ Final button state unclear, may need manual investigation');
          }
        }
        
        // Brief progress update every 5 questions
        if (i % 5 === 0) {
          const progressInfo = await page.evaluate(() => {
            const progressText = document.querySelector('.progress-text');
            const vqfInstance = document.getElementById('questions-container')?._vqfInstance;
            
            return {
              progressDisplay: progressText?.textContent.trim(),
              answeredCount: vqfInstance ? vqfInstance.getCompletedCount() : 'N/A'
            };
          });
          
          console.log(`📈 Progress checkpoint Q${i}: ${progressInfo.progressDisplay} (Answered: ${progressInfo.answeredCount})`);
        }
      }
      
      console.log('🏁 Completed all 30 questions!');
      
      // Final verification
      const finalVerification = await page.evaluate(() => {
        const vqfInstance = document.getElementById('questions-container')?._vqfInstance;
        const answeredCount = vqfInstance ? vqfInstance.getCompletedCount() : 0;
        const totalQuestions = vqfInstance ? vqfInstance.questions.length : 0;
        
        return {
          answeredCount,
          totalQuestions,
          allQuestionsAnswered: answeredCount === totalQuestions,
          currentQuestionIndex: vqfInstance ? vqfInstance.currentQuestionIndex : -1
        };
      });
      
      console.log('📊 Final verification:', finalVerification);
      
      if (finalVerification.allQuestionsAnswered) {
        console.log('✅ VERIFICATION SUCCESS: All questions properly answered!');
      } else {
        console.log('❌ VERIFICATION ISSUE: Not all questions were answered properly');
      }
      
    } else {
      console.log('❌ Start button not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'complete-flow-test-error.png' });
  }
  
  console.log('⏳ Keeping browser open for final inspection...');
  await page.waitForTimeout(10000);
  await browser.close();
})();