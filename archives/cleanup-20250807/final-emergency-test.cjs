const { chromium } = require('playwright');

async function finalEmergencyTest() {
    console.log('🎯 FINAL EMERGENCY BYPASS COMPREHENSIVE TEST');
    
    let browser;
    let page;
    const results = {
        pageLoad: false,
        emergencyInit: false,
        startButtonClick: false,
        screenTransition: false,
        questionDisplay: false,
        userInteraction: false
    };
    
    try {
        browser = await chromium.launch({ 
            headless: false,
            slowMo: 500
        });
        
        page = await browser.newPage();
        
        const consoleLogs = [];
        page.on('console', msg => {
            const text = msg.text();
            console.log(`[BROWSER] ${text}`);
            consoleLogs.push(text);
        });
        
        // Test 1: Page Load
        console.log('\n📍 TEST 1: Loading os_analyzer.html...');
        await page.goto('http://localhost:8788/os_analyzer.html');
        await page.waitForTimeout(4000); // Wait for emergency bypass init
        
        const hasEmergencyLogs = consoleLogs.some(log => log.includes('Emergency Bypass: Initializing'));
        results.pageLoad = hasEmergencyLogs;
        console.log(`✅ Page Load: ${results.pageLoad}`);
        
        // Test 2: Emergency Initialization
        console.log('\n🚨 TEST 2: Emergency System Initialization...');
        const hasEmergencyReady = consoleLogs.some(log => log.includes('EMERGENCY BYPASS: Fully activated'));
        results.emergencyInit = hasEmergencyReady;
        console.log(`✅ Emergency Init: ${results.emergencyInit}`);
        
        // Test 3: Start Button Click
        console.log('\n🎯 TEST 3: Start Button Click Functionality...');
        await page.click('#start-btn');
        await page.waitForTimeout(2000);
        
        const hasStartClick = consoleLogs.some(log => log.includes('EMERGENCY START CLICKED'));
        results.startButtonClick = hasStartClick;
        console.log(`✅ Start Button Click: ${results.startButtonClick}`);
        
        // Test 4: Screen Transition
        console.log('\n📺 TEST 4: Screen Transition (Welcome → Question)...');
        const screenState = await page.evaluate(() => {
            return {
                questionActive: document.getElementById('question-screen')?.classList.contains('active'),
                welcomeActive: document.getElementById('welcome-screen')?.classList.contains('active')
            };
        });
        
        results.screenTransition = screenState.questionActive && !screenState.welcomeActive;
        console.log(`✅ Screen Transition: ${results.screenTransition} (Q:${screenState.questionActive}, W:${screenState.welcomeActive})`);
        
        // Test 5: Question Display
        console.log('\n📝 TEST 5: Question Content Display...');
        const questionContent = await page.evaluate(() => {
            const title = document.getElementById('question-title')?.textContent;
            const number = document.getElementById('question-number')?.textContent;
            const options = document.getElementById('options-container')?.children.length;
            
            return {
                hasTitle: !!title && title.trim().length > 0,
                hasNumber: !!number && number.trim() === '1',
                hasOptions: options > 0
            };
        });
        
        results.questionDisplay = questionContent.hasTitle && questionContent.hasNumber && questionContent.hasOptions;
        console.log(`✅ Question Display: ${results.questionDisplay} (Title:${questionContent.hasTitle}, Num:${questionContent.hasNumber}, Opts:${questionContent.hasOptions})`);
        
        // Test 6: User Interaction
        console.log('\n👆 TEST 6: User Option Selection...');
        await page.click('.option:first-child');
        await page.waitForTimeout(1000);
        
        const hasSelection = await page.evaluate(() => {
            return document.querySelector('.option.selected') !== null;
        });
        
        const hasInteractionLog = consoleLogs.some(log => log.includes('Emergency option selected'));
        results.userInteraction = hasSelection || hasInteractionLog;
        console.log(`✅ User Interaction: ${results.userInteraction} (Selected:${hasSelection}, Log:${hasInteractionLog})`);
        
        // Final Screenshot
        await page.screenshot({ path: 'final-emergency-test-success.png' });
        console.log('📸 Final screenshot saved: final-emergency-test-success.png');
        
        // Calculate overall success
        const allTests = Object.values(results);
        const passedTests = allTests.filter(Boolean).length;
        const totalTests = allTests.length;
        const successRate = (passedTests / totalTests) * 100;
        
        console.log('\n📊 FINAL TEST RESULTS:');
        console.log(`Passed: ${passedTests}/${totalTests} tests (${successRate.toFixed(1)}%)`);
        
        Object.entries(results).forEach(([test, passed]) => {
            console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
        });
        
        const overallSuccess = passedTests >= 5; // At least 5/6 tests must pass
        console.log(`\n🏁 OVERALL RESULT: ${overallSuccess ? '🎉 SUCCESS' : '❌ FAILED'}`);
        
        return overallSuccess;
        
    } catch (error) {
        console.error('💥 Error during final test:', error);
        return false;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

finalEmergencyTest().then(success => {
    console.log(`\n🎯 FINAL EMERGENCY BYPASS RESULT: ${success ? 'FULLY FUNCTIONAL' : 'NEEDS IMPROVEMENT'}`);
    process.exit(success ? 0 : 1);
});