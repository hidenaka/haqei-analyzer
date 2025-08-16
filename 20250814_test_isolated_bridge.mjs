import { chromium } from 'playwright';

async function testIsolatedBridge() {
    console.log('🧪 Testing isolated bridge');
    const browser = await chromium.launch({ headless: false });
    
    try {
        const page = await browser.newPage();
        
        page.on('console', msg => {
            console.log('📋', msg.text());
        });
        
        page.on('pageerror', error => {
            console.error('❌', error.message);
        });
        
        await page.goto('http://localhost:8788/20250814_simple_bridge_test.html');
        await page.waitForTimeout(4000);
        
    } finally {
        await browser.close();
    }
}

testIsolatedBridge();