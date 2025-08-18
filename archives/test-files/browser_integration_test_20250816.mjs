import { chromium } from 'playwright';

async function testOSAnalyzerInBrowser() {
    console.log('🚀 Browser Integration Test: OSAnalyzer');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    const results = {
        loadSuccess: false,
        jsErrors: [],
        i1_navigation: false,
        i2_questionFlow: false,
        i3_jsErrors: false
    };
    
    try {
        console.log('📱 Loading OSAnalyzer page...');
        
        // Listen for console errors
        page.on('console', msg => {
            if (msg.type() === 'error') {
                results.jsErrors.push(msg.text());
            }
        });
        
        // Listen for uncaught exceptions
        page.on('pageerror', error => {
            results.jsErrors.push(error.message);
        });
        
        await page.goto('http://localhost:8788/os_analyzer.html', { waitUntil: 'networkidle' });
        results.loadSuccess = true;
        console.log('✅ Page loaded successfully');
        
        // Wait for page to fully initialize
        await page.waitForTimeout(2000);
        
        // Test I3: Check for JavaScript errors
        results.i3_jsErrors = results.jsErrors.length === 0;
        console.log(`🔍 I3 JavaScript Errors: ${results.jsErrors.length} errors found`);
        if (results.jsErrors.length > 0) {
            console.log('   Errors:', results.jsErrors.slice(0, 3).join(', '));
        }
        
        // Test I1: Try to find and click the analysis button
        console.log('🔍 I1 Testing navigation flow...');
        
        const analysisButton = await page.locator('button').filter({ hasText: '分析' }).first();
        const buttonExists = await analysisButton.count() > 0;
        console.log(`   Analysis button found: ${buttonExists}`);
        
        if (buttonExists) {
            // Check if button is clickable
            const isEnabled = await analysisButton.isEnabled();
            console.log(`   Button enabled: ${isEnabled}`);
            
            if (isEnabled) {
                // Click the button and check for screen transition
                await analysisButton.click();
                await page.waitForTimeout(1000);
                
                // Check if question screen appeared
                const questionElements = await page.locator('.question, [class*="question"], #question').count();
                const questionText = await page.locator('text=質問').count();
                const hasQuestionScreen = questionElements > 0 || questionText > 0;
                
                console.log(`   Question screen appeared: ${hasQuestionScreen}`);
                results.i1_navigation = hasQuestionScreen;
            }
        }
        
        // Test I2: Check question flow if we're on question screen
        console.log('🔍 I2 Testing question flow...');
        
        const nextButtons = await page.locator('button').filter({ hasText: '次' }).count();
        const questionContent = await page.locator('input[type="radio"], select, textarea').count();
        const windowQuestionsAvailable = await page.evaluate(() => {
            return typeof window.QUESTIONS !== 'undefined' && window.QUESTIONS && window.QUESTIONS.length > 0;
        });
        
        console.log(`   Next buttons found: ${nextButtons}`);
        console.log(`   Question inputs found: ${questionContent}`);
        console.log(`   window.QUESTIONS available: ${windowQuestionsAvailable}`);
        
        results.i2_questionFlow = nextButtons > 0 && questionContent > 0 && windowQuestionsAvailable;
        
    } catch (error) {
        console.error('❌ Browser test error:', error.message);
        results.jsErrors.push(error.message);
    } finally {
        await browser.close();
    }
    
    // Results summary
    console.log('\n📊 Browser Test Results:');
    console.log(`${results.loadSuccess ? '✅' : '❌'} Page Load: ${results.loadSuccess ? 'SUCCESS' : 'FAILED'}`);
    console.log(`${results.i3_jsErrors ? '✅' : '❌'} I3 JavaScript Errors: ${results.i3_jsErrors ? 'PASS' : 'FAIL'} (${results.jsErrors.length} errors)`);
    console.log(`${results.i1_navigation ? '✅' : '❌'} I1 Navigation Flow: ${results.i1_navigation ? 'PASS' : 'FAIL'}`);
    console.log(`${results.i2_questionFlow ? '✅' : '❌'} I2 Question Flow: ${results.i2_questionFlow ? 'PASS' : 'FAIL'}`);
    
    const overallSuccess = results.loadSuccess && results.i3_jsErrors && results.i1_navigation && results.i2_questionFlow;
    console.log(`\n🎯 OVERALL BROWSER TEST: ${overallSuccess ? '✅ ALL ISSUES RESOLVED' : '⚠️ ISSUES REMAIN'}`);
    
    return results;
}

testOSAnalyzerInBrowser().catch(console.error);
