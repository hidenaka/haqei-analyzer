/**
 * シナリオカード表示最終テスト
 */

import { chromium } from 'playwright';

async function finalScenarioTest() {
    console.log('🔍 シナリオカード表示最終テスト');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false
    });
    
    try {
        const page = await browser.newPage();
        
        // ログ監視
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('Preserved') || text.includes('Restored') || 
                text.includes('SafeDOMUpdater') || text.includes('eight-scenarios')) {
                console.log(`  📝 ${text}`);
            }
        });
        
        console.log('📋 Step 1: ページ読み込み');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(2000);
        
        const initial = await page.evaluate(() => {
            const container = document.getElementById('eight-scenarios-display-container');
            return {
                exists: !!container,
                parent: container?.parentElement?.id,
                children: container?.children.length
            };
        });
        
        console.log(`\n  初期状態:`);
        console.log(`    eight-scenarios-display-container: ${initial.exists ? '✅' : '❌'}`);
        console.log(`    親要素: ${initial.parent || 'なし'}`);
        console.log(`    子要素: ${initial.children || 0}個`);
        
        console.log('\n📋 Step 2: 分析実行');
        
        await page.fill('textarea', '転職を検討中');
        await page.evaluate(() => {
            const btn = document.querySelector('#aiGuessBtn');
            if (btn) btn.click();
        });
        
        await page.waitForTimeout(5000);
        
        console.log('\n📋 Step 3: 分析後の状態');
        
        const after = await page.evaluate(() => {
            const eightContainer = document.getElementById('eight-scenarios-display-container');
            const scenarioCards = document.querySelectorAll('.scenario-card');
            const resultsContainer = document.getElementById('resultsContainer');
            
            // カードの配置場所を確認
            const cardLocations = {};
            scenarioCards.forEach(card => {
                const parent = card.parentElement;
                const location = parent?.id || parent?.className || 'unknown';
                cardLocations[location] = (cardLocations[location] || 0) + 1;
            });
            
            return {
                eightContainer: {
                    exists: !!eightContainer,
                    visible: eightContainer ? window.getComputedStyle(eightContainer).display !== 'none' : false,
                    children: eightContainer?.children.length || 0,
                    hasScenarioGrid: !!eightContainer?.querySelector('.scenarios-grid')
                },
                cards: {
                    total: scenarioCards.length,
                    locations: cardLocations
                },
                canvas: {
                    count: document.querySelectorAll('canvas').length
                }
            };
        });
        
        console.log(`\n  eight-scenarios-display-container:`);
        console.log(`    存在: ${after.eightContainer.exists ? '✅' : '❌'}`);
        console.log(`    表示: ${after.eightContainer.visible ? '✅' : '❌'}`);
        console.log(`    子要素: ${after.eightContainer.children}個`);
        console.log(`    .scenarios-grid: ${after.eightContainer.hasScenarioGrid ? '✅' : '❌'}`);
        
        console.log(`\n  シナリオカード:`);
        console.log(`    総数: ${after.cards.total}個`);
        console.log(`    配置場所:`);
        Object.entries(after.cards.locations).forEach(([location, count]) => {
            console.log(`      - ${location}: ${count}個`);
        });
        
        console.log(`\n  Canvas数: ${after.canvas.count}個`);
        
        console.log('\n=====================================');
        console.log('📊 結果評価');
        console.log('=====================================\n');
        
        const success = [];
        const issues = [];
        
        if (after.eightContainer.exists) {
            success.push('eight-scenarios-display-container維持');
        } else {
            issues.push('eight-scenarios-display-container消失');
        }
        
        if (after.cards.total > 0) {
            success.push(`シナリオカード表示（${after.cards.total}個）`);
        } else {
            issues.push('シナリオカード未表示');
        }
        
        if (after.canvas.count >= 4) {
            success.push('Canvas要素維持');
        } else {
            issues.push(`Canvas要素減少（${after.canvas.count}個）`);
        }
        
        if (success.length > 0) {
            console.log('✅ 成功項目:');
            success.forEach(s => console.log(`    - ${s}`));
        }
        
        if (issues.length > 0) {
            console.log('\n❌ 問題項目:');
            issues.forEach(i => console.log(`    - ${i}`));
        }
        
        const score = (success.length / (success.length + issues.length)) * 100;
        console.log(`\n総合スコア: ${Math.round(score)}%`);
        
        if (score >= 80) {
            console.log('🎉 成功！');
        } else if (score >= 60) {
            console.log('⚠️ 部分的成功');
        } else {
            console.log('❌ 追加対応必要');
        }
        
    } finally {
        console.log('\n⏰ 5秒後にブラウザを閉じます...');
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

// 実行
finalScenarioTest().catch(console.error);