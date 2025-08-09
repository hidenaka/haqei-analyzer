const { chromium } = require('playwright');

async function testEmergencyBypass() {
    console.log('🚨 Testing Emergency Bypass with MCP');
    
    let browser;
    let page;
    const consoleLogs = [];
    
    try {
        browser = await chromium.launch({ 
            headless: false,
            slowMo: 1000
        });
        
        page = await browser.newPage();
        
        // Capture console messages
        page.on('console', msg => {
            const text = msg.text();
            console.log(`[BROWSER] ${text}`);
            consoleLogs.push(text);
        });
        
        // Navigate to test page
        console.log('📍 Loading emergency bypass test page...');
        await page.goto('http://localhost:8788/test-emergency-bypass.html');
        await page.waitForTimeout(3000);
        
        // Inject emergency bypass
        console.log('🚨 Injecting emergency bypass...');
        await page.click('button:has-text("Inject Emergency Bypass")');
        await page.waitForTimeout(3000);
        
        // Test start button
        console.log('🧪 Testing start button...');
        await page.click('button:has-text("Test Start Button")');
        await page.waitForTimeout(3000);
        
        // Check for success logs
        const hasSuccess = consoleLogs.some(log => log.includes('SUCCESS: Emergency bypass working'));
        const hasEmergencyLogs = consoleLogs.some(log => log.includes('EMERGENCY START BUTTON CLICKED'));
        const hasQuestionScreen = consoleLogs.some(log => log.includes('Question screen activated'));
        
        console.log(`\n📋 Test Results:`);
        console.log(`✅ Has success logs: ${hasSuccess}`);
        console.log(`🚨 Has emergency button logs: ${hasEmergencyLogs}`);
        console.log(`📺 Has question screen activation: ${hasQuestionScreen}`);
        
        // Take screenshot
        await page.screenshot({ path: 'emergency-bypass-test-result.png' });
        console.log('📸 Screenshot saved');
        
        const overallSuccess = hasSuccess || (hasEmergencyLogs && hasQuestionScreen);
        
        if (overallSuccess) {
            console.log('🎉 EMERGENCY BYPASS TEST: SUCCESS!');
            return true;
        } else {
            console.log('❌ EMERGENCY BYPASS TEST: FAILED');
            
            // Print all logs for debugging
            console.log('\n📜 All Browser Logs:');
            consoleLogs.forEach((log, index) => {
                console.log(`${index + 1}: ${log}`);
            });
            
            return false;
        }
        
    } catch (error) {
        console.error('💥 Error during bypass test:', error);
        return false;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

testEmergencyBypass().then(success => {
    console.log(`\n🏁 Final Result: ${success ? 'EMERGENCY BYPASS WORKS' : 'EMERGENCY BYPASS FAILED'}`);
    process.exit(success ? 0 : 1);
});