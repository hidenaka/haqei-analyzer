/**
 * Debug the specific "Unexpected token 'export'" error
 */

import { chromium } from 'playwright';

async function debugExportError() {
    console.log('🔍 Debugging Export Error');
    const browser = await chromium.launch({ headless: false });
    
    try {
        const page = await browser.newPage();
        
        // Comprehensive error tracking
        const errorDetails = [];
        
        page.on('pageerror', error => {
            const details = {
                message: error.message,
                stack: error.stack || 'No stack trace',
                timestamp: new Date().toISOString()
            };
            errorDetails.push(details);
            
            console.error('❌ JS Error:', error.message);
            
            // Extract file info from stack if available
            if (error.stack) {
                const fileMatch = error.stack.match(/at (.*\.js):\d+:\d+/);
                if (fileMatch) {
                    console.error('   📁 File:', fileMatch[1]);
                }
            }
        });
        
        // Network failures
        page.on('requestfailed', request => {
            console.error('🌐 Request failed:', request.url(), request.failure()?.errorText);
        });
        
        console.log('📍 Navigating to Future Simulator...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'domcontentloaded',  // Don't wait for network idle due to errors
            timeout: 15000
        });
        
        await page.waitForTimeout(3000);
        
        console.log('\n📊 Error Summary:');
        console.log('================');
        
        if (errorDetails.length === 0) {
            console.log('✅ No JavaScript errors detected!');
        } else {
            console.log(`❌ Found ${errorDetails.length} JavaScript errors:`);
            
            errorDetails.forEach((error, index) => {
                console.log(`\n${index + 1}. ${error.message}`);
                if (error.stack) {
                    // Extract meaningful stack trace lines
                    const stackLines = error.stack.split('\n')
                        .filter(line => line.trim() && line.includes('.js'))
                        .slice(0, 3); // First 3 relevant lines
                    
                    if (stackLines.length > 0) {
                        console.log('   Stack:');
                        stackLines.forEach(line => console.log(`   ${line.trim()}`));
                    }
                }
                console.log('   Time:', error.timestamp);
            });
        }
        
        // Check basic page state
        const pageState = await page.evaluate(() => {
            return {
                title: document.title,
                bodyLength: document.body.innerHTML.length,
                scriptsCount: document.querySelectorAll('script').length,
                containerExists: !!document.getElementById('i-ching-container')
            };
        });
        
        console.log('\n📄 Page State:');
        console.log('===============');
        console.log('Title:', pageState.title);
        console.log('Body length:', pageState.bodyLength);
        console.log('Scripts loaded:', pageState.scriptsCount);
        console.log('Container exists:', pageState.containerExists);
        
        await page.waitForTimeout(10000);
        
    } finally {
        await browser.close();
    }
}

debugExportError().catch(console.error);