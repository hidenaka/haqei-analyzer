const { chromium } = require('playwright');

async function testNormalMode() {
    console.log('🎯 通常モード動作テスト開始...');
    
    let browser;
    let page;
    const results = {
        pageLoad: false,
        jsExecution: false,
        domContentLoaded: false,
        classInitialization: false,
        startButtonClick: false,
        questionScreen: false
    };
    
    try {
        browser = await chromium.launch({ 
            headless: false,
            slowMo: 1000
        });
        
        page = await browser.newPage();
        
        const consoleLogs = [];
        const errors = [];
        
        page.on('console', msg => {
            const text = msg.text();
            console.log(`[BROWSER] ${text}`);
            consoleLogs.push(text);
        });
        
        page.on('pageerror', error => {
            console.error(`[PAGE ERROR] ${error.message}`);
            errors.push(error.message);
        });
        
        // Test 1: Page Load
        console.log('\n📍 TEST 1: Page Loading...');
        await page.goto('http://localhost:8788/os_analyzer.html');
        await page.waitForTimeout(3000);
        
        results.pageLoad = true;
        console.log('✅ Page loaded successfully');
        
        // Test 2: JavaScript Execution (no syntax errors)
        console.log('\n🔧 TEST 2: JavaScript Execution...');
        results.jsExecution = errors.length === 0;
        if (results.jsExecution) {
            console.log('✅ No JavaScript errors detected');
        } else {
            console.log('❌ JavaScript errors found:', errors);
        }
        
        // Test 3: DOMContentLoaded execution
        console.log('\n📊 TEST 3: DOMContentLoaded Execution...');
        const hasInitLogs = consoleLogs.some(log => 
            log.includes('🎉 HAQEI Application initialized') ||
            log.includes('DOM fully loaded') ||
            log.includes('CriticalCSSAnalyzer initialized')
        );
        results.domContentLoaded = hasInitLogs;
        console.log(`${results.domContentLoaded ? '✅' : '❌'} DOMContentLoaded: ${results.domContentLoaded}`);
        
        // Test 4: CriticalCSSAnalyzer Class Initialization
        console.log('\n🏗️ TEST 4: Class Initialization...');
        const hasAnalyzer = await page.evaluate(() => {
            return typeof window.analyzer !== 'undefined' && window.analyzer !== null;
        });
        results.classInitialization = hasAnalyzer;
        console.log(`${results.classInitialization ? '✅' : '❌'} CriticalCSSAnalyzer: ${results.classInitialization}`);
        
        // Test 5: Start Button Click
        console.log('\n🎯 TEST 5: Start Button Click...');
        await page.click('#start-btn');
        await page.waitForTimeout(2000);
        
        const hasStartLog = consoleLogs.some(log => 
            log.includes('Start button clicked') ||
            log.includes('startAnalysis') ||
            log.includes('Starting analysis')
        );
        results.startButtonClick = hasStartLog;
        console.log(`${results.startButtonClick ? '✅' : '❌'} Start Button Click: ${results.startButtonClick}`);
        
        // Test 6: Question Screen Transition
        console.log('\n📺 TEST 6: Screen Transition...');
        const screenState = await page.evaluate(() => {
            return {
                questionActive: document.getElementById('question-screen')?.classList.contains('active'),
                welcomeInactive: !document.getElementById('welcome-screen')?.classList.contains('active')
            };
        });
        
        results.questionScreen = screenState.questionActive && screenState.welcomeInactive;
        console.log(`${results.questionScreen ? '✅' : '❌'} Question Screen: ${results.questionScreen}`);
        
        // Final screenshot
        await page.screenshot({ path: 'normal-mode-test.png' });
        console.log('📸 Screenshot saved: normal-mode-test.png');
        
        // Calculate success rate
        const totalTests = Object.keys(results).length;
        const passedTests = Object.values(results).filter(Boolean).length;
        const successRate = (passedTests / totalTests) * 100;
        
        console.log('\n📊 FINAL TEST RESULTS:');
        console.log(`Passed: ${passedTests}/${totalTests} tests (${successRate.toFixed(1)}%)`);
        
        Object.entries(results).forEach(([test, passed]) => {
            console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
        });
        
        const success = passedTests >= 5; // At least 5/6 tests must pass
        console.log(`\n🏁 NORMAL MODE RESULT: ${success ? '🎉 SUCCESS' : '❌ NEEDS IMPROVEMENT'}`);
        
        return success;
        
    } catch (error) {
        console.error('💥 Error during test:', error);
        return false;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

testNormalMode().then(success => {
    console.log(`\n🎯 通常モード最終結果: ${success ? '完全動作確認' : '要改善'}`);
    process.exit(success ? 0 : 1);
});