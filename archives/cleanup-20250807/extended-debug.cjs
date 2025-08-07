const { chromium } = require('playwright');

async function extendedDebug() {
    console.log('🔍 Extended debugging with longer wait times');
    
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
        
        // Wait longer for emergency workaround
        console.log('⏱️ Waiting 6 seconds for emergency workaround...');
        await page.waitForTimeout(6000);
        
        // Check for emergency logs
        const hasEmergencyLogs = consoleLogs.some(log => log.includes('Emergency workaround'));
        console.log(`🚨 Has emergency logs: ${hasEmergencyLogs}`);
        
        // Try clicking the start button
        console.log('🎯 Attempting to click start button...');
        try {
            await page.click('#start-btn');
            await page.waitForTimeout(2000);
            
            // Check screen state
            const screenState = await page.evaluate(() => {
                return {
                    questionActive: document.getElementById('question-screen')?.classList.contains('active'),
                    welcomeActive: document.getElementById('welcome-screen')?.classList.contains('active')
                };
            });
            
            console.log('📺 Final screen state:', screenState);
            
            if (screenState.questionActive) {
                console.log('🎉 SUCCESS: Emergency fix worked!');
                return true;
            }
        } catch (clickError) {
            console.error('❌ Click failed:', clickError.message);
        }
        
        // Print all logs
        console.log('\n📜 All Console Logs:');
        consoleLogs.forEach((log, index) => {
            console.log(`${index + 1}: ${log}`);
        });
        
        await page.screenshot({ path: 'extended-debug-result.png' });
        
    } catch (error) {
        console.error('💥 Error during extended debugging:', error);
        return false;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
    
    return false;
}

extendedDebug().then(success => {
    console.log(`\n🏁 Extended Debug Result: ${success ? 'SUCCESS' : 'FAILED'}`);
    process.exit(success ? 0 : 1);
});