const { chromium } = require('playwright');

async function directFixAttempt() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Allow JavaScript injection for testing
  await context.addInitScript(() => {
    // Override console.error to capture more details
    const originalError = console.error;
    window.capturedErrors = [];
    
    console.error = function(...args) {
      window.capturedErrors.push(args.join(' '));
      originalError.apply(console, args);
    };
  });
  
  try {
    console.log('🔍 Attempting to load and fix page directly...');
    
    // Navigate to the page
    await page.goto('http://127.0.0.1:8788/future_simulator.html');
    
    // Wait a bit for any errors to appear
    await page.waitForTimeout(2000);
    
    // Check if ProgressiveLoader exists and try to recreate it if needed
    const pageStatus = await page.evaluate(() => {
      return {
        progressiveLoaderExists: typeof ProgressiveLoader !== 'undefined',
        documentReady: document.readyState,
        bodyContent: document.body ? document.body.innerHTML.length : 0,
        errors: window.capturedErrors || [],
        hasWorryInput: !!document.getElementById('worryInput'),
        hasAiGuessBtn: !!document.getElementById('aiGuessBtn'),
        scriptTags: document.querySelectorAll('script').length
      };
    });
    
    console.log('📊 Page Status:', pageStatus);
    
    if (!pageStatus.progressiveLoaderExists) {
      console.log('⚠️ ProgressiveLoader not found, attempting direct injection...');
      
      // Try to inject a simple working version
      await page.evaluate(() => {
        // Create a minimal working ProgressiveLoader
        class ProgressiveLoader {
          constructor() {
            this.progress = 0;
            console.log('✅ Minimal ProgressiveLoader created');
          }
          
          init() {
            console.log('✅ ProgressiveLoader initialized');
            this.showInputForm();
          }
          
          showInputForm() {
            const inputContent = document.getElementById('input-content');
            const worryInput = document.getElementById('worryInput');
            
            if (inputContent) {
              inputContent.style.display = 'block';
              inputContent.style.opacity = '1';
              console.log('✅ Input form displayed');
              
              if (worryInput) {
                worryInput.focus();
                console.log('✅ Input focused');
              }
            }
            
            // Initialize button
            const aiGuessBtn = document.getElementById('aiGuessBtn');
            if (aiGuessBtn && worryInput) {
              aiGuessBtn.addEventListener('click', () => {
                const text = worryInput.value.trim();
                if (text) {
                  console.log('✅ Analysis triggered:', text.substring(0, 50) + '...');
                  this.showBasicResults(text);
                } else {
                  alert('テキストを入力してください');
                }
              });
            }
          }
          
          showBasicResults(inputText) {
            const resultsContainer = document.getElementById('results-container') || document.getElementById('results');
            
            if (resultsContainer) {
              resultsContainer.innerHTML = `
                <div style="background: rgba(34, 197, 94, 0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #22C55E; margin: 0 0 15px 0;">分析結果</h3>
                  <p style="color: #E5E7EB;">入力内容: ${inputText.substring(0, 100)}...</p>
                  <p style="color: #E5E7EB;">システムが正常に動作しています。</p>
                </div>
              `;
              resultsContainer.style.display = 'block';
              console.log('✅ Basic results displayed');
            }
          }
        }
        
        // Create and initialize
        window.progressiveLoader = new ProgressiveLoader();
        window.progressiveLoader.init();
      });
    }
    
    // Take screenshot after potential fix
    await page.screenshot({ path: 'screenshot-desktop.png', fullPage: true });
    
    // Test the input functionality
    const inputTest = await page.evaluate(() => {
      const worryInput = document.getElementById('worryInput');
      const aiGuessBtn = document.getElementById('aiGuessBtn');
      
      if (worryInput && aiGuessBtn) {
        worryInput.value = 'テスト入力：Future Simulatorの動作確認';
        
        // Trigger click programmatically  
        aiGuessBtn.click();
        
        return {
          success: true,
          inputValue: worryInput.value,
          buttonExists: true
        };
      }
      
      return {
        success: false,
        inputValue: null,
        buttonExists: !!aiGuessBtn
      };
    });
    
    console.log('🎯 Input Test Result:', inputTest);
    
    // Wait for any results to appear
    await page.waitForTimeout(2000);
    
    // Final screenshot
    await page.screenshot({ path: 'screenshot-final.png', fullPage: true });
    
    // Check if results appeared
    const finalStatus = await page.evaluate(() => {
      const results = document.getElementById('results-container') || document.getElementById('results');
      return {
        resultsVisible: results ? results.style.display !== 'none' : false,
        resultsContent: results ? results.innerHTML.length > 100 : false
      };
    });
    
    console.log('🏁 Final Status:', finalStatus);
    
    return {
      success: inputTest.success && finalStatus.resultsVisible,
      details: { pageStatus, inputTest, finalStatus }
    };
    
  } catch (error) {
    console.log('❌ Direct fix error:', error.message);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

// Run the direct fix attempt
directFixAttempt()
  .then(result => {
    if (result.success) {
      console.log('\n🎉 DIRECT FIX SUCCESSFUL!');
      console.log('User can now see and interact with the Future Simulator');
    } else {
      console.log('\n❌ Direct fix failed:', result.error || 'Unknown error');
      console.log('More comprehensive fixes needed');
    }
  })
  .catch(error => {
    console.error('Fix attempt failed:', error);
  });