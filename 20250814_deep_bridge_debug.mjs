/**
 * Deep bridge debugging - Why isn't the bridge working?
 */

import { chromium } from 'playwright';

async function deepBridgeDebug() {
    console.log('🔬 Deep Bridge Debug');
    const browser = await chromium.launch({ headless: false });
    
    try {
        const page = await browser.newPage();
        
        // Track all console messages with timestamps
        page.on('console', msg => {
            const timestamp = new Date().toISOString().substr(11, 12);
            const text = msg.text();
            
            if (text.includes('[HAQEI][P0-2]') || text.includes('SeedableRandom') || text.includes('RandomnessManager')) {
                console.log(`${timestamp} 📋 BRIDGE: ${text}`);
            } else if (text.includes('ERROR') || text.includes('error')) {
                console.log(`${timestamp} ❌ ERROR: ${text}`);
            }
        });
        
        // Track script loading
        let bridgeScriptLoaded = false;
        page.on('response', response => {
            if (response.url().includes('SeedableRandom-bridge.js')) {
                bridgeScriptLoaded = true;
                console.log(`📥 Bridge script loaded: ${response.status()}`);
            }
        });
        
        console.log('📍 Loading full page...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'load',
            timeout: 15000
        });
        
        // Wait and check bridge status
        await page.waitForTimeout(3000);
        
        const bridgeStatus = await page.evaluate(() => {
            return {
                randomnessManagerExists: !!window.randomnessManager,
                randomnessManagerType: window.randomnessManager?.constructor?.name || 'none',
                randomnessManagerFallback: window.randomnessManager?.fallback || false,
                
                // Check bridge logs in console
                bridgeMessages: window.console._bridgeMessages || 'none'
            };
        });
        
        console.log('\n🔍 Final Bridge Status:');
        console.log('=======================');
        console.log('Bridge script loaded:', bridgeScriptLoaded);
        console.log('RandomnessManager exists:', bridgeStatus.randomnessManagerExists);
        console.log('RandomnessManager type:', bridgeStatus.randomnessManagerType);
        console.log('Is fallback:', bridgeStatus.randomnessManagerFallback);
        
        if (!bridgeStatus.randomnessManagerExists) {
            console.log('\n❌ PROBLEM: RandomnessManager not found!');
            console.log('This means the bridge script did not execute successfully.');
        } else if (bridgeStatus.randomnessManagerFallback) {
            console.log('\n⚠️ FALLBACK ACTIVE: Bridge enhanced load failed');
        } else {
            console.log('\n✅ SUCCESS: Enhanced RandomnessManager loaded');
        }
        
        await page.waitForTimeout(5000);
        
    } finally {
        await browser.close();
    }
}

deepBridgeDebug().catch(console.error);