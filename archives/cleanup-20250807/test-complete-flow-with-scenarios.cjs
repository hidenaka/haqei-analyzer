const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Complete Flow Test with Proper Scenario Question Handling');
  
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
      
      console.log('🚀 Starting complete 30-question flow test with scenario support...');
      
      // Function to answer current question properly (supports both normal and scenario questions)
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
          
          // Access shadow root
          const shadowRoot = activeQuestion.shadowRoot;
          if (!shadowRoot) {
            return { error: `No shadow root for Q${qNum}` };
          }
          
          const radioInputs = shadowRoot.querySelectorAll('input[type="radio"]');
          if (radioInputs.length === 0) {
            return { error: `No radio inputs found for Q${qNum}` };
          }
          
          // Check if this is a scenario question (has both inner and outer choices)
          const innerRadios = shadowRoot.querySelectorAll('input[data-choice-type="inner"]');
          const outerRadios = shadowRoot.querySelectorAll('input[data-choice-type="outer"]');
          const isScenarioQuestion = innerRadios.length > 0 && outerRadios.length > 0;
          
          console.log(`📊 Q${qNum} analysis: Total radios: ${radioInputs.length}, Inner: ${innerRadios.length}, Outer: ${outerRadios.length}, IsScenario: ${isScenarioQuestion}`);
          
          let answers = [];
          
          if (isScenarioQuestion) {
            // Scenario question: select both inner and outer
            if (innerRadios.length > 0) {
              const firstInner = innerRadios[0];
              firstInner.click();
              firstInner.checked = true;
              const innerEvent = new Event('change', { bubbles: true });
              firstInner.dispatchEvent(innerEvent);
              answers.push({ type: 'inner', value: firstInner.value });
              console.log(`✅ Q${qNum} inner choice selected: ${firstInner.value}`);
            }
            
            if (outerRadios.length > 0) {
              const firstOuter = outerRadios[0];
              firstOuter.click();
              firstOuter.checked = true;
              const outerEvent = new Event('change', { bubbles: true });
              firstOuter.dispatchEvent(outerEvent);
              answers.push({ type: 'outer', value: firstOuter.value });
              console.log(`✅ Q${qNum} outer choice selected: ${firstOuter.value}`);
            }
          } else {
            // Normal question: select first radio
            const firstRadio = radioInputs[0];
            firstRadio.click();
            firstRadio.checked = true;
            const event = new Event('change', { bubbles: true });
            firstRadio.dispatchEvent(event);
            answers.push({ type: 'normal', value: firstRadio.value });
            console.log(`✅ Q${qNum} choice selected: ${firstRadio.value}`);
          }
          
          // Wait for answer processing and check next button
          setTimeout(() => {
            const nextButton = document.querySelector('#next-btn');
            if (nextButton && !nextButton.disabled) {
              console.log(`➡️ Q${qNum} complete, clicking next...`);
              nextButton.click();
            } else if (nextButton && nextButton.disabled) {
              console.log(`⚠️ Q${qNum} answered but next button still disabled`);
            } else {
              console.log(`❌ Next button not found for Q${qNum}`);
            }
          }, 200);
          
          return {
            success: true,
            questionId,
            questionNum: qNum,
            isScenarioQuestion,
            answers,
            totalRadios: radioInputs.length,
            innerRadios: innerRadios.length,
            outerRadios: outerRadios.length
          };
        }, questionNum);
        
        return result;
      };
      
      // Answer all 30 questions
      console.log('📝 Starting to answer all 30 questions with proper scenario handling...');
      
      for (let i = 1; i <= 30; i++) {
        console.log(`\n🔄 Processing Question ${i}/30...`);
        
        // Wait for question to be visible
        await page.waitForTimeout(500);
        
        // Answer the current question
        const answerResult = await answerCurrentQuestion(i);
        if (answerResult.error) {
          console.error(`❌ Error on Q${i}:`, answerResult.error);
          
          // Debug current state
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
        
        if (answerResult.isScenarioQuestion) {
          console.log(`✅ Q${i} (SCENARIO) processed: ${answerResult.questionId} - Inner: ${answerResult.answers[0]?.value}, Outer: ${answerResult.answers[1]?.value}`);
        } else {
          console.log(`✅ Q${i} (NORMAL) processed: ${answerResult.questionId} (${answerResult.answers[0]?.value})`);
        }
        
        // Wait for navigation to complete
        await page.waitForTimeout(600);
        
        // Check if we're on the last question
        if (i === 30) {
          console.log('🏁 Reached final question (Q30), checking for completion...');
          
          // Wait for final processing
          await page.waitForTimeout(3000);
          
          // Check final state and next button
          const finalState = await page.evaluate(() => {
            const nextBtn = document.querySelector('#next-btn');
            const resultsContainer = document.getElementById('results-container');
            const questionsContainer = document.getElementById('questions-container');
            
            return {
              nextButtonText: nextBtn?.textContent.trim(),
              nextButtonDisabled: nextBtn?.disabled,
              nextButtonVisible: nextBtn ? nextBtn.offsetParent !== null : false,
              resultsVisible: resultsContainer ? resultsContainer.offsetParent !== null : false,
              questionsVisible: questionsContainer ? questionsContainer.offsetParent !== null : false
            };
          });
          
          console.log('🔍 Final state after Q30:', JSON.stringify(finalState, null, 2));
          
          // If next button shows "分析開始" or is enabled, click it
          if (finalState.nextButtonText && (finalState.nextButtonText.includes('分析') || !finalState.nextButtonDisabled)) {
            console.log('🖱️ Clicking final button to start analysis...');
            await page.click('#next-btn');
            await page.waitForTimeout(5000);
            
            // Check for results display
            const analysisResult = await page.evaluate(() => {
              const resultsContainer = document.getElementById('results-container');
              const analysisContainer = document.getElementById('analysis-container');
              
              // Look for result indicators
              const resultElements = Array.from(document.querySelectorAll('*')).filter(el => 
                el.textContent && (
                  el.textContent.includes('分析結果') ||
                  el.textContent.includes('あなたの') ||
                  el.textContent.includes('結果') ||
                  el.textContent.includes('プロファイル') ||
                  el.textContent.includes('診断')
                )
              );
              
              return {
                resultsContainerVisible: resultsContainer ? resultsContainer.offsetParent !== null : false,
                analysisContainerVisible: analysisContainer ? analysisContainer.offsetParent !== null : false,
                resultElementsFound: resultElements.length,
                resultTexts: resultElements.slice(0, 3).map(el => el.textContent.slice(0, 100)),
                bodyText: document.body.textContent.slice(0, 500) // Sample of body text
              };
            });
            
            console.log('📊 Analysis result:', JSON.stringify(analysisResult, null, 2));
            
            if (analysisResult.resultsContainerVisible || analysisResult.analysisContainerVisible || analysisResult.resultElementsFound > 0) {
              console.log('🎉 SUCCESS: Complete 30-question flow working! Results displayed!');
            } else {
              console.log('⚠️ Analysis may have started but results not clearly visible yet');
            }
          } else {
            console.log('⚠️ Final button state needs investigation');
          }
        }
        
        // Progress update every 5 questions
        if (i % 5 === 0) {
          const progressInfo = await page.evaluate(() => {
            const progressText = document.querySelector('.progress-text');
            const vqfInstance = document.getElementById('questions-container')?._vqfInstance;
            
            return {
              progressDisplay: progressText?.textContent.trim(),
              answeredCount: vqfInstance ? vqfInstance.getCompletedCount() : 'N/A'
            };
          });
          
          console.log(`📈 Progress Q${i}: ${progressInfo.progressDisplay} (Answered: ${progressInfo.answeredCount})`);
        }
      }
      
      console.log('🏁 Completed all 30 questions with scenario support!');
      
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
        console.log('✅ VERIFICATION SUCCESS: All questions properly answered including scenarios!');
      } else {
        console.log('⚠️ VERIFICATION: Some questions may need review');
      }
      
    } else {
      console.log('❌ Start button not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'complete-flow-scenario-test-error.png' });
  }
  
  console.log('⏳ Keeping browser open for final inspection...');
  await page.waitForTimeout(15000);
  await browser.close();
})();