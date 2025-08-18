/**
 * 完全にクリーンな状態の最終確認
 */

import { chromium } from 'playwright';

async function finalCleanCheck() {
    console.log('🧹 完全クリーン確認');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false
    });
    
    try {
        const page = await browser.newPage();
        
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(2000);
        
        console.log('📋 分析実行前の状態確認');
        const beforeAnalysis = await page.evaluate(() => {
            const container = document.getElementById('resultsContainer');
            return {
                exists: !!container,
                isEmpty: container ? container.innerHTML.trim() === '' : true,
                text: container?.innerText?.substring(0, 100)
            };
        });
        
        console.log(`  resultsContainer: ${beforeAnalysis.exists ? '存在' : '不在'}`);
        console.log(`  空っぽ: ${beforeAnalysis.isEmpty ? '✅' : '❌'}`);
        if (!beforeAnalysis.isEmpty) {
            console.log(`  内容: "${beforeAnalysis.text}..."`);
        }
        
        console.log('\n📋 分析実行');
        await page.fill('textarea', 'テスト');
        await page.click('#aiGuessBtn');
        await page.waitForTimeout(5000);
        
        const afterAnalysis = await page.evaluate(() => {
            const container = document.getElementById('resultsContainer');
            return {
                isEmpty: container ? container.innerHTML.trim() === '' : true,
                childCount: container?.children.length || 0,
                text: container?.innerText?.substring(0, 200),
                html: container?.innerHTML?.substring(0, 200)
            };
        });
        
        console.log('\n📊 分析後の状態:');
        if (afterAnalysis.isEmpty) {
            console.log('  ✅ 完全に空っぽです！');
            console.log('     新しい表示システムを実装できます');
        } else {
            console.log('  ❌ まだ何か表示されています');
            console.log(`     子要素: ${afterAnalysis.childCount}個`);
            console.log(`     テキスト: "${afterAnalysis.text}..."`);
            console.log(`     HTML: "${afterAnalysis.html}..."`);
        }
        
        // スクリーンショット
        await page.screenshot({ 
            path: '20250816_clean_state.png',
            fullPage: false
        });
        console.log('\n📸 スクリーンショット: 20250816_clean_state.png');
        
    } finally {
        console.log('\n⏰ 10秒後にブラウザを閉じます...');
        await page.waitForTimeout(10000);
        await browser.close();
    }
}

// 実行
finalCleanCheck().catch(console.error);