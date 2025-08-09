/**
 * Direct CSS Fix Test - Evaluates w-full class fix impact
 * Tests worryInput element visibility and functionality
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

async function testCSSFix() {
    console.log('🚀 Starting CSS Fix Verification Test...');
    
    const testResults = {
        timestamp: new Date().toISOString(),
        testName: 'CSS w-full Class Fix Verification',
        url: 'http://127.0.0.1:8083/future_simulator.html',
        results: {},
        screenshots: []
    };

    let browser, page;
    
    try {
        browser = await puppeteer.launch({ 
            headless: false, 
            defaultViewport: { width: 1280, height: 720 }
        });
        
        page = await browser.newPage();
        
        // Navigate to Future Simulator
        console.log('📄 Loading Future Simulator page...');
        await page.goto(testResults.url, { waitUntil: 'networkidle0' });
        
        // Take initial screenshot
        console.log('📸 Taking initial screenshot...');
        await page.screenshot({ 
            path: 'screenshot-initial-css-test.png', 
            fullPage: true 
        });
        testResults.screenshots.push('screenshot-initial-css-test.png');
        
        // Wait for page to fully load
        await page.waitForTimeout(3000);
        
        // Test 1: worryInput element analysis
        console.log('🔍 Testing worryInput element...');
        const worryInputTest = await page.evaluate(() => {
            const worryInput = document.getElementById('worryInput');
            
            if (\!worryInput) {
                return { exists: false, error: 'worryInput element not found' };
            }
            
            const rect = worryInput.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(worryInput);
            
            return {
                exists: true,
                dimensions: {
                    offsetWidth: worryInput.offsetWidth,
                    offsetHeight: worryInput.offsetHeight,
                    clientWidth: worryInput.clientWidth,
                    clientHeight: worryInput.clientHeight,
                    boundingRect: {
                        width: Math.round(rect.width),
                        height: Math.round(rect.height),
                        left: Math.round(rect.left),
                        top: Math.round(rect.top)
                    }
                },
                styles: {
                    width: computedStyle.width,
                    height: computedStyle.height,
                    display: computedStyle.display,
                    visibility: computedStyle.visibility,
                    opacity: computedStyle.opacity,
                    position: computedStyle.position
                },
                classes: Array.from(worryInput.classList),
                hasWFullClass: worryInput.classList.contains('w-full'),
                isGhost: rect.width === 0 || rect.height === 0
            };
        });
        
        testResults.results.worryInputTest = worryInputTest;
        
        // Test 2: Input functionality test
        if (worryInputTest.exists && \!worryInputTest.isGhost) {
            console.log('⌨️  Testing input functionality...');
            
            await page.focus('#worryInput');
            await page.type('#worryInput', 'テスト入力で動作確認');
            
            const inputValue = await page.evaluate(() => {
                const input = document.getElementById('worryInput');
                return input ? input.value : '';
            });
            
            testResults.results.inputFunctional = inputValue === 'テスト入力で動作確認';
            
            // Take screenshot after input
            await page.screenshot({ 
                path: 'screenshot-after-input.png', 
                fullPage: true 
            });
            testResults.screenshots.push('screenshot-after-input.png');
        }
        
        // Test 3: Button visibility test
        console.log('🔘 Testing button visibility...');
        const buttonTest = await page.evaluate(() => {
            const aiGuessBtn = document.getElementById('aiGuessBtn');
            
            if (\!aiGuessBtn) {
                return { exists: false, error: 'aiGuessBtn not found' };
            }
            
            const rect = aiGuessBtn.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(aiGuessBtn);
            
            return {
                exists: true,
                dimensions: {
                    offsetWidth: aiGuessBtn.offsetWidth,
                    offsetHeight: aiGuessBtn.offsetHeight,
                    boundingRect: {
                        width: Math.round(rect.width),
                        height: Math.round(rect.height)
                    }
                },
                styles: {
                    display: computedStyle.display,
                    visibility: computedStyle.visibility,
                    opacity: computedStyle.opacity
                },
                classes: Array.from(aiGuessBtn.classList),
                isVisible: rect.width > 0 && rect.height > 0 && computedStyle.visibility \!== 'hidden'
            };
        });
        
        testResults.results.buttonTest = buttonTest;
        
        // Test 4: Overall CSS class availability
        console.log('🎨 Testing CSS class availability...');
        const cssClassTest = await page.evaluate(() => {
            // Create test element with target classes
            const testEl = document.createElement('div');
            testEl.className = 'w-full block p-3 text-base mb-4';
            document.body.appendChild(testEl);
            
            const computedStyle = window.getComputedStyle(testEl);
            const result = {
                wFull: computedStyle.width.includes('100%') || computedStyle.width === '100%',
                block: computedStyle.display === 'block',
                padding: computedStyle.padding \!== '0px',
                margin: computedStyle.marginBottom \!== '0px'
            };
            
            document.body.removeChild(testEl);
            return result;
        });
        
        testResults.results.cssClassTest = cssClassTest;
        
        // Test 5: Ghost elements scan
        console.log('👻 Scanning for ghost elements...');
        const ghostElementsScan = await page.evaluate(() => {
            const allInputs = document.querySelectorAll('input, textarea, button');
            const ghostElements = [];
            
            allInputs.forEach((element, index) => {
                const rect = element.getBoundingClientRect();
                const isGhost = rect.width === 0 || rect.height === 0;
                
                if (isGhost) {
                    ghostElements.push({
                        index,
                        id: element.id || `unnamed-${index}`,
                        tagName: element.tagName.toLowerCase(),
                        classes: Array.from(element.classList),
                        dimensions: { width: rect.width, height: rect.height }
                    });
                }
            });
            
            return {
                totalElements: allInputs.length,
                ghostElements,
                ghostCount: ghostElements.length
            };
        });
        
        testResults.results.ghostElementsScan = ghostElementsScan;
        
        // Calculate success metrics
        const successMetrics = {
            worryInputVisible: worryInputTest.exists && \!worryInputTest.isGhost,
            inputFunctional: testResults.results.inputFunctional || false,
            buttonVisible: buttonTest.exists && buttonTest.isVisible,
            cssClassesWork: cssClassTest.wFull && cssClassTest.block,
            noGhostElements: ghostElementsScan.ghostCount === 0
        };
        
        const totalTests = Object.keys(successMetrics).length;
        const passedTests = Object.values(successMetrics).filter(Boolean).length;
        const successRate = Math.round((passedTests / totalTests) * 100);
        
        testResults.successMetrics = successMetrics;
        testResults.successRate = successRate;
        
        // Take final screenshot
        await page.screenshot({ 
            path: 'screenshot-final-css-test.png', 
            fullPage: true 
        });
        testResults.screenshots.push('screenshot-final-css-test.png');
        
        console.log(`🎯 CSS Fix Test Results: ${successRate}% success rate`);
        console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
        
        // Save detailed results
        fs.writeFileSync('css-fix-test-results.json', JSON.stringify(testResults, null, 2));
        console.log('📄 Results saved to css-fix-test-results.json');
        
        return testResults;
        
    } catch (error) {
        console.error('❌ Test execution error:', error);
        testResults.error = error.message;
        return testResults;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run test if called directly
if (require.main === module) {
    testCSSFix().then(results => {
        console.log('\n📋 Final Results Summary:');
        console.log(`Success Rate: ${results.successRate}%`);
        if (results.error) {
            console.error(`Error: ${results.error}`);
            process.exit(1);
        }
        process.exit(0);
    }).catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { testCSSFix };
EOF < /dev/null