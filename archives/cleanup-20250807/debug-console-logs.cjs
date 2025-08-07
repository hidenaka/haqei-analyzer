const { chromium } = require('playwright');

async function debugConsoleLogs() {
    console.log('🔍 Starting console log debugging');
    
    let browser;
    let page;
    const consoleLogs = [];
    
    try {
        browser = await chromium.launch({ 
            headless: false,
            slowMo: 500
        });
        
        page = await browser.newPage();
        
        // Capture console messages
        page.on('console', msg => {
            const text = msg.text();
            console.log(`[BROWSER CONSOLE] ${msg.type()}: ${text}`);
            consoleLogs.push(`[${msg.type()}] ${text}`);
        });
        
        // Capture errors
        page.on('pageerror', err => {
            console.log(`[BROWSER ERROR] ${err.message}`);
            consoleLogs.push(`[ERROR] ${err.message}`);
        });
        
        // Navigate and wait
        console.log('📍 Loading os_analyzer.html...');
        await page.goto('http://localhost:8788/os_analyzer.html');
        
        // Wait for initialization
        await page.waitForTimeout(5000);
        console.log('⏱️ Page initialization complete');
        
        // Check if our debugging logs appear
        const hasBindingLogs = consoleLogs.some(log => log.includes('Binding events'));
        const hasAnalyzerReady = consoleLogs.some(log => log.includes('Critical CSS Analyzer ready'));
        const hasInitialization = consoleLogs.some(log => log.includes('HAQEI Emergency Analyzer initializing'));
        
        console.log(`\n📋 Console Log Analysis:`);
        console.log(`✅ Has initialization log: ${hasInitialization}`);
        console.log(`✅ Has analyzer ready log: ${hasAnalyzerReady}`);
        console.log(`✅ Has binding events log: ${hasBindingLogs}`);
        
        // Try clicking the start button
        console.log('\n🎯 Testing start button click...');
        await page.click('#start-btn');
        await page.waitForTimeout(2000);
        
        // Check for startAnalysis logs
        const hasStartAnalysisLog = consoleLogs.some(log => log.includes('startAnalysis called'));
        const hasShowScreenLog = consoleLogs.some(log => log.includes('showScreen called'));
        
        console.log(`✅ Has startAnalysis log: ${hasStartAnalysisLog}`);
        console.log(`✅ Has showScreen log: ${hasShowScreenLog}`);
        
        // Get current screen state
        const screenState = await page.evaluate(() => {
            const questionScreen = document.getElementById('question-screen');
            const welcomeScreen = document.getElementById('welcome-screen');
            
            return {
                questionActive: questionScreen ? questionScreen.classList.contains('active') : false,
                welcomeActive: welcomeScreen ? welcomeScreen.classList.contains('active') : false,
                questionExists: !!questionScreen,
                welcomeExists: !!welcomeScreen
            };
        });
        
        console.log('\n📺 Screen State:', screenState);
        
        // Print all console logs
        console.log('\n📜 All Console Logs:');
        consoleLogs.forEach((log, index) => {
            console.log(`${index + 1}: ${log}`);
        });
        
        await page.screenshot({ path: 'debug-console-test.png' });
        console.log('📸 Screenshot saved: debug-console-test.png');
        
    } catch (error) {
        console.error('💥 Error during debugging:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

debugConsoleLogs();