/**
 * 結果画面のHTML構造を詳細に調査
 */

import { chromium } from 'playwright';

async function inspectResultStructure() {
    console.log('🔍 結果画面構造の詳細調査\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 100
    });
    
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:3001/os_analyzer.html', { waitUntil: 'networkidle' });
        
        // 診断開始
        const startButton = await page.$('.start-button');
        if (startButton) await startButton.click();
        
        // 30問回答
        for (let i = 0; i < 30; i++) {
            await page.waitForTimeout(100);
            const options = await page.$$('.option');
            if (options.length === 0) break;
            await options[i % 3].click();
            const nextButton = await page.$('#next-btn, button:has-text("次へ")');
            if (nextButton) await nextButton.click();
        }
        
        // 結果画面待機
        await page.waitForTimeout(3000);
        
        // 結果画面のHTML構造を詳細に取得
        const resultStructure = await page.evaluate(() => {
            const result = {
                osCards: [],
                rawHTML: ''
            };
            
            // OS カードを探す
            const cards = document.querySelectorAll('.os-card');
            cards.forEach((card, index) => {
                const cardInfo = {
                    index: index,
                    html: card.outerHTML,
                    textContent: card.textContent,
                    children: []
                };
                
                // 子要素を詳しく調査
                card.childNodes.forEach(child => {
                    if (child.nodeType === 1) { // Element node
                        cardInfo.children.push({
                            tagName: child.tagName,
                            className: child.className,
                            textContent: child.textContent?.substring(0, 100)
                        });
                    }
                });
                
                result.osCards.push(cardInfo);
            });
            
            // 結果セクション全体のHTML
            const resultsSection = document.querySelector('#results-section');
            if (resultsSection) {
                result.rawHTML = resultsSection.innerHTML.substring(0, 2000);
            }
            
            return result;
        });
        
        console.log('📊 結果画面の構造解析:\n');
        
        resultStructure.osCards.forEach((card, i) => {
            console.log(`🎯 OS Card ${i + 1}:`);
            console.log('  子要素:');
            card.children.forEach(child => {
                console.log(`    - ${child.tagName}.${child.className}: "${child.textContent?.substring(0, 50)}..."`);
            });
            console.log('  全テキスト長:', card.textContent.length, '文字');
            console.log('  キャッチフレーズ検出:', card.textContent.includes('「') ? '✅' : '❌');
            console.log('');
        });
        
        // 実際のHTMLを一部表示
        console.log('📝 実際のHTML構造（最初の500文字）:');
        console.log(resultStructure.rawHTML.substring(0, 500));
        
        await page.screenshot({ path: 'result-structure-inspection.png', fullPage: true });
        
    } finally {
        await browser.close();
    }
}

inspectResultStructure().catch(console.error);