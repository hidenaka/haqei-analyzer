import { chromium } from 'playwright';

async function quickDebug() {
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(2000);
        
        const inputCheck = await page.evaluate(() => {
            const input = document.querySelector('#situation-text');
            if (!input) return { exists: false };
            
            const rect = input.getBoundingClientRect();
            const style = window.getComputedStyle(input);
            const parent = input.parentElement;
            const parentStyle = parent ? window.getComputedStyle(parent) : null;
            
            return {
                exists: true,
                visible: style.display !== 'none' && style.visibility !== 'hidden',
                rect: { width: rect.width, height: rect.height },
                display: style.display,
                visibility: style.visibility,
                parentDisplay: parentStyle?.display,
                parentVisibility: parentStyle?.visibility,
                parentId: parent?.id
            };
        });
        
        console.log('入力欄の状態:', inputCheck);
        
        // スクリーンショット
        await page.screenshot({ path: '20250814_debug_screenshot.png' });
        
    } finally {
        await browser.close();
    }
}

quickDebug();
