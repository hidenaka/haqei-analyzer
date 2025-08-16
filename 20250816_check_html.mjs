/**
 * HTMLの内容を詳しく確認
 */

import { chromium } from 'playwright';

async function checkHTML() {
    const browser = await chromium.launch({ 
        headless: false
    });
    
    try {
        const page = await browser.newPage();
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(2000);
        
        const htmlContent = await page.evaluate(() => {
            const container = document.getElementById('resultsContainer');
            return {
                innerHTML: container?.innerHTML,
                childNodes: container?.childNodes.length,
                firstChild: container?.firstChild?.nodeType,
                textContent: container?.textContent?.trim()
            };
        });
        
        console.log('resultsContainerの内容:');
        console.log(`  innerHTML: "${htmlContent.innerHTML?.substring(0, 200)}"`);
        console.log(`  childNodes: ${htmlContent.childNodes}`);
        console.log(`  firstChild type: ${htmlContent.firstChild} (1=Element, 3=Text)`);
        console.log(`  textContent: "${htmlContent.textContent}"`);
        
        if (htmlContent.textContent === '') {
            console.log('\n✅ 完全に空っぽです！');
        } else {
            console.log('\n❌ まだコンテンツがあります');
        }
        
    } finally {
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

checkHTML().catch(console.error);