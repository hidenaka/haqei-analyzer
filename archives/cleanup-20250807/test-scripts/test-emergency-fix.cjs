const { chromium } = require('playwright');

async function testEmergencyFix() {
    console.log('🚨 Starting MCP Emergency Fix Verification');
    
    let browser;
    let page;
    
    try {
        // Launch browser
        browser = await chromium.launch({ 
            headless: false, // Show browser for visual confirmation
            slowMo: 1000 // Slow down for observation
        });
        
        page = await browser.newPage();
        
        // Navigate to the fixed application
        console.log('📍 Navigating to os_analyzer.html');
        await page.goto('http://localhost:8788/os_analyzer.html');
        
        // Wait for page to load completely
        await page.waitForTimeout(3000);
        console.log('⏱️ Page load complete');
        
        // Check if start button exists
        const startButton = await page.$('#start-btn');
        if (!startButton) {
            console.error('❌ FAILED: Start button not found');
            return false;
        }
        console.log('✅ Start button found');
        
        // Check initial state - question screen should NOT be active
        const initialActiveScreen = await page.evaluate(() => {
            const questionScreen = document.getElementById('question-screen');
            return questionScreen ? questionScreen.classList.contains('active') : false;
        });
        
        console.log(`📊 Initial question screen active: ${initialActiveScreen}`);
        
        // Take screenshot before click
        await page.screenshot({ path: 'before-click.png' });
        console.log('📸 Screenshot taken: before-click.png');
        
        // Click the start button
        console.log('🎯 Clicking start button...');
        await page.click('#start-btn');
        
        // Wait for potential animations/transitions
        await page.waitForTimeout(2000);
        
        // Check if question screen is now active
        const postClickActiveScreen = await page.evaluate(() => {
            const questionScreen = document.getElementById('question-screen');
            return questionScreen ? questionScreen.classList.contains('active') : false;
        });
        
        console.log(`📊 Post-click question screen active: ${postClickActiveScreen}`);
        
        // Take screenshot after click
        await page.screenshot({ path: 'after-click.png' });
        console.log('📸 Screenshot taken: after-click.png');
        
        // Verify question content is displayed
        const questionData = await page.evaluate(() => {
            const questionTitle = document.getElementById('question-title');
            const questionNumber = document.getElementById('question-number');
            const optionsContainer = document.getElementById('options-container');
            
            return {
                title: questionTitle ? questionTitle.textContent : null,
                number: questionNumber ? questionNumber.textContent : null,
                hasOptions: optionsContainer ? optionsContainer.children.length > 0 : false
            };
        });
        
        console.log('📝 Question data:', questionData);
        
        // Success criteria
        const success = postClickActiveScreen && 
                       questionData.title && 
                       questionData.number && 
                       questionData.hasOptions;
        
        if (success) {
            console.log('🎉 SUCCESS: Emergency fix is working!');
            console.log('✅ Start button successfully triggered question flow');
            console.log(`✅ Question ${questionData.number}: "${questionData.title}"`);
            console.log(`✅ Options available: ${questionData.hasOptions}`);
            
            // Test answering a question
            console.log('🧪 Testing question answer...');
            await page.click('.option:first-child');
            await page.waitForTimeout(1000);
            
            // Check if next button is available or if we moved to next question
            const nextBtnExists = await page.$('#next-btn');
            console.log(`📍 Next button available: ${!!nextBtnExists}`);
            
            // Take final screenshot
            await page.screenshot({ path: 'question-answered.png' });
            console.log('📸 Screenshot taken: question-answered.png');
            
            return true;
        } else {
            console.log('❌ FAILED: Emergency fix did not work');
            console.log(`❌ Question screen active: ${postClickActiveScreen}`);
            console.log(`❌ Question title: ${questionData.title}`);
            console.log(`❌ Question number: ${questionData.number}`);
            console.log(`❌ Has options: ${questionData.hasOptions}`);
            return false;
        }
        
    } catch (error) {
        console.error('💥 Error during testing:', error);
        return false;
    } finally {
        if (page) {
            // Get console logs from the page
            console.log('📋 Collecting console logs from page...');
            await page.evaluate(() => {
                console.log('=== Page Console Output ===');
            });
        }
        
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testEmergencyFix().then(success => {
    console.log(`\n🏁 Final Result: ${success ? 'EMERGENCY FIX SUCCESSFUL' : 'EMERGENCY FIX FAILED'}`);
    process.exit(success ? 0 : 1);
});