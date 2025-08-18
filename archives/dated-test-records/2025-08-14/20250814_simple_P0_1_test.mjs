/**
 * Simple P0-1 test - just check basic ESM loading
 */

import { chromium } from 'playwright';

async function simpleTest() {
    console.log('🔍 Simple P0-1 Test');
    const browser = await chromium.launch({ headless: false });
    
    try {
        const page = await browser.newPage();
        
        // Track errors
        page.on('pageerror', error => {
            console.error('❌ JS Error:', error.message);
        });
        
        // Track console
        page.on('console', msg => {
            if (msg.text().includes('[HAQEI][P0-1]')) {
                console.log('📋', msg.text());
            }
        });
        
        await page.goto('http://localhost:8788/future_simulator.html');
        await page.waitForTimeout(5000);
        
        // Basic checks
        const results = await page.evaluate(() => {
            return {
                containerExists: !!document.getElementById('i-ching-container'),
                containerVisible: document.getElementById('i-ching-container')?.offsetHeight > 0,
                hasRandomnessManager: !!window.randomnessManager,
                hasIChingSimulator: !!window.ichingSimulator,
                bodyLength: document.body.innerHTML.length
            };
        });
        
        console.log('\nResults:');
        console.log('Container exists:', results.containerExists ? '✅' : '❌');
        console.log('Container visible:', results.containerVisible ? '✅' : '❌');
        console.log('RandomnessManager:', results.hasRandomnessManager ? '✅' : '❌');
        console.log('IChingSimulator:', results.hasIChingSimulator ? '✅' : '❌');
        console.log('Page loaded:', results.bodyLength > 100000 ? '✅' : '❌');
        
        await page.waitForTimeout(15000);
        
    } finally {
        await browser.close();
    }
}

simpleTest().catch(console.error);