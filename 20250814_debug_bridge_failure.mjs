/**
 * Debug why SeedableRandom-bridge doesn't work in full page
 */

import { chromium } from 'playwright';

async function debugBridgeFailure() {
    console.log('🔍 Debugging SeedableRandom Bridge Failure');
    const browser = await chromium.launch({ headless: false });
    
    try {
        const page = await browser.newPage();
        
        // Monitor all script loads and errors
        const scriptLoads = [];
        const scriptErrors = [];
        
        page.on('response', response => {
            if (response.url().includes('.js')) {
                scriptLoads.push({
                    url: response.url().split('/').pop(),
                    status: response.status(),
                    ok: response.ok()
                });
            }
        });
        
        page.on('pageerror', error => {
            scriptErrors.push(error.message);
            if (error.message.includes('export')) {
                console.error('❌ Export Error:', error.message);
            }
        });
        
        // Special focus on bridge loading
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('SeedableRandom') || text.includes('[HAQEI]')) {
                console.log('📋 Bridge:', text);
            }
        });
        
        console.log('📍 Loading page...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'load',
            timeout: 15000
        });
        
        await page.waitForTimeout(3000);
        
        // Check what happened with the bridge
        const bridgeStatus = await page.evaluate(() => {
            return {
                randomnessManagerExists: !!window.randomnessManager,
                seedableRandomExists: !!window.SeedableRandom,
                randomnessManagerType: typeof window.randomnessManager,
                windowKeys: Object.keys(window).filter(k => k.includes('andom')),
                consoleErrorCount: window.console ? 'available' : 'none'
            };
        });
        
        console.log('\n🔍 Bridge Status:');
        console.log('==================');
        console.log('RandomnessManager exists:', bridgeStatus.randomnessManagerExists);
        console.log('SeedableRandom exists:', bridgeStatus.seedableRandomExists);
        console.log('RandomnessManager type:', bridgeStatus.randomnessManagerType);
        console.log('Random-related window keys:', bridgeStatus.windowKeys);
        
        console.log('\n📂 Script Loading Status:');
        console.log('===========================');
        console.log(`Total scripts attempted: ${scriptLoads.length}`);
        
        const bridgeScript = scriptLoads.find(s => s.url.includes('SeedableRandom-bridge'));
        if (bridgeScript) {
            console.log(`SeedableRandom-bridge.js: ${bridgeScript.status} (${bridgeScript.ok ? 'OK' : 'Failed'})`);
        } else {
            console.log('❌ SeedableRandom-bridge.js: NOT FOUND in loads');
        }
        
        console.log('\n🚨 Script Errors:');
        console.log('==================');
        console.log(`Total errors: ${scriptErrors.length}`);
        
        const exportErrors = scriptErrors.filter(e => e.includes('export'));
        if (exportErrors.length > 0) {
            console.log(`Export errors: ${exportErrors.length}`);
            exportErrors.forEach(e => console.log(`  - ${e}`));
        }
        
        // Identify which script is causing the export error
        const firstExportError = exportErrors[0];
        if (firstExportError) {
            console.log('\n🎯 First export error analysis:');
            console.log(firstExportError);
        }
        
        await page.waitForTimeout(10000);
        
    } finally {
        await browser.close();
    }
}

debugBridgeFailure().catch(console.error);