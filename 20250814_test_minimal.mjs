import { chromium } from 'playwright';

async function testMinimal() {
    console.log('🔬 Testing minimal page');
    const browser = await chromium.launch({ headless: false });
    
    try {
        const page = await browser.newPage();
        
        page.on('pageerror', error => {
            console.error('❌ JS Error:', error.message);
        });
        
        page.on('console', msg => {
            if (msg.type() === 'log') {
                console.log('📋', msg.text());
            }
        });
        
        await page.goto('http://localhost:8788/20250814_minimal_test.html');
        await page.waitForTimeout(5000);
        
        const results = await page.evaluate(() => {
            return {
                containerExists: !!document.getElementById('i-ching-container'),
                hasRandomnessManager: !!window.randomnessManager
            };
        });
        
        console.log('Results:', results);
        
        await page.waitForTimeout(10000);
        
    } finally {
        await browser.close();
    }
}

testMinimal().catch(console.error);