// Chart.js Phase2 Validation Script
const { chromium } = require('playwright');

async function validateChartJS() {
    console.log('🎯 Chart.js Phase2 Validation Starting...');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        // Navigate to OS Analyzer
        await page.goto('http://localhost:8788/os_analyzer.html');
        await page.waitForSelector('#start-btn', { timeout: 10000 });
        
        console.log('✅ Page loaded successfully');
        
        // Start analysis
        await page.click('#start-btn');
        await page.waitForSelector('.option', { timeout: 5000 });
        
        // Answer all 30 questions quickly
        for (let i = 0; i < 30; i++) {
            await page.waitForSelector('.option', { timeout: 3000 });
            const options = await page.$$('.option');
            if (options.length > 0) {
                await options[0].click();
                await page.waitForTimeout(300);
                
                const nextBtn = await page.$('#next-btn:not([disabled])');
                if (nextBtn) {
                    await nextBtn.click();
                    await page.waitForTimeout(200);
                }
            }
        }
        
        // Wait for results
        console.log('⏳ Waiting for analysis results...');
        await page.waitForSelector('#results-screen.active', { timeout: 15000 });
        
        // Wait for Chart.js to load
        await page.waitForTimeout(3000);
        
        // Verify Chart.js implementations
        console.log('🔍 Validating Chart.js implementations...');
        
        // Check for Triple OS Radar Chart
        const osChart = await page.$('#os-interaction-chart');
        if (osChart) {
            console.log('✅ Triple OS Radar Chart detected');
        } else {
            console.log('❌ Triple OS Radar Chart missing');
        }
        
        // Check for 8D Vector Chart (correct ID)
        const vectorChart = await page.$('canvas[id*="vector"]');
        if (vectorChart) {
            console.log('✅ 8D Vector Chart detected');
        } else {
            console.log('❌ 8D Vector Chart missing');
        }
        
        // Check for NEW HaQei Persona Chart
        const personaChart = await page.$('#haqei-persona-chart');
        if (personaChart) {
            console.log('✅ NEW: HaQei Persona Coordination Chart detected');
        } else {
            console.log('❌ HaQei Persona Chart missing');
        }
        
        // Take screenshot
        await page.screenshot({ 
            path: 'chart-js-phase2-validation.png',
            fullPage: true
        });
        console.log('📸 Screenshot saved: chart-js-phase2-validation.png');
        
        // Test chart interactions
        if (osChart) {
            await page.hover('#os-interaction-chart');
            console.log('✅ Chart hover interaction tested');
        }
        
        // Check for export buttons
        const exportButtons = await page.$$('.chart-export-btn');
        console.log(`✅ Found ${exportButtons.length} chart export buttons`);
        
        console.log('🎊 Chart.js Phase2 Validation COMPLETE');
        
    } catch (error) {
        console.error('❌ Validation failed:', error.message);
        await page.screenshot({ 
            path: 'chart-js-phase2-error.png',
            fullPage: true
        });
    } finally {
        await browser.close();
    }
}

validateChartJS().catch(console.error);