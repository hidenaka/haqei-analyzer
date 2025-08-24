import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    console.log('🚀 最終動作確認テスト\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        devtools: false
    });
    const page = await browser.newPage();
    
    // エラーのみ記録
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
            console.error('❌', msg.text().substring(0, 100));
        }
    });
    
    // ページを開く
    const resultsPath = `file://${path.join(__dirname, 'public', 'results.html')}`;
    console.log('📄 Opening:', resultsPath);
    await page.goto(resultsPath);
    await page.waitForTimeout(3000);
    
    // 1. 基本結果タブの確認
    console.log('\n========== 基本結果タブ ==========');
    const basicContent = await page.evaluate(() => {
        const panel = document.querySelector('[data-tab="basic"].haqei-tab-panel');
        if (!panel) return { error: 'Panel not found' };
        
        const osCards = panel.querySelectorAll('.os-card');
        const summary = panel.querySelector('#summary-container');
        const personality = panel.querySelector('#personality-profile-container');
        const historical = panel.querySelector('#historical-comparison-container');
        
        return {
            isActive: panel.classList.contains('active'),
            hasContent: panel.innerHTML.trim().length > 100,
            sections: {
                osCards: osCards.length,
                hasSummary: !!summary,
                hasPersonality: !!personality,
                hasHistorical: !!historical
            },
            osCardDetails: Array.from(osCards).map(card => ({
                name: card.querySelector('.os-name')?.textContent || 'Unknown',
                score: card.querySelector('.score-value')?.textContent || 'N/A'
            }))
        };
    });
    
    console.log('状態:', basicContent.isActive ? '✅ アクティブ' : '❌ 非アクティブ');
    console.log('コンテンツ:', basicContent.hasContent ? '✅ あり' : '❌ なし');
    
    if (basicContent.sections) {
        console.log('\nセクション:');
        console.log(`  OSカード: ${basicContent.sections.osCards}個`);
        console.log(`  サマリー: ${basicContent.sections.hasSummary ? '✅' : '❌'}`);
        console.log(`  人物像: ${basicContent.sections.hasPersonality ? '✅' : '❌'}`);
        console.log(`  履歴比較: ${basicContent.sections.hasHistorical ? '✅' : '❌'}`);
        
        if (basicContent.osCardDetails.length > 0) {
            console.log('\nOSカード詳細:');
            basicContent.osCardDetails.forEach(card => {
                console.log(`  • ${card.name}: ${card.score}`);
            });
        }
    }
    
    // スクリーンショット（基本結果）
    await page.screenshot({ 
        path: path.join(__dirname, 'final-basic.png'),
        fullPage: true 
    });
    
    // 2. 詳細分析タブの確認
    console.log('\n========== 詳細分析タブ ==========');
    const detailedButton = await page.$('[data-tab="detailed"]');
    await detailedButton.click();
    await page.waitForTimeout(2000);
    
    const detailedContent = await page.evaluate(() => {
        const panel = document.querySelector('[data-tab="detailed"].haqei-tab-panel');
        if (!panel) return { error: 'Panel not found' };
        
        // 相互作用セクションの詳細確認
        const interactionSection = panel.querySelector('.interaction-details-section');
        let interactionValues = [];
        
        if (interactionSection) {
            const items = interactionSection.querySelectorAll('.synergy-item');
            interactionValues = Array.from(items).map(item => {
                const spans = item.querySelectorAll('span');
                return {
                    label: spans[0]?.textContent,
                    value: spans[spans.length - 1]?.textContent
                };
            });
        }
        
        return {
            isActive: panel.classList.contains('active'),
            hasContent: panel.innerHTML.trim().length > 100,
            hasInteractionSection: !!interactionSection,
            interactionValues
        };
    });
    
    console.log('状態:', detailedContent.isActive ? '✅ アクティブ' : '❌ 非アクティブ');
    console.log('コンテンツ:', detailedContent.hasContent ? '✅ あり' : '❌ なし');
    console.log('相互作用セクション:', detailedContent.hasInteractionSection ? '✅ あり' : '❌ なし');
    
    if (detailedContent.interactionValues.length > 0) {
        console.log('\n相互作用の値:');
        detailedContent.interactionValues.forEach(item => {
            console.log(`  • ${item.label}: ${item.value}`);
        });
    }
    
    // スクリーンショット（詳細分析）
    await page.screenshot({ 
        path: path.join(__dirname, 'final-detailed.png'),
        fullPage: true 
    });
    
    // 3. 最終サマリー
    console.log('\n========== 最終結果 ==========');
    if (errors.length === 0) {
        console.log('✅ エラーなし - すべて正常に動作しています！');
    } else {
        console.log(`❌ ${errors.length}個のエラーが発生`);
    }
    
    console.log('\n📸 スクリーンショット:');
    console.log('  • final-basic.png');
    console.log('  • final-detailed.png');
    
    console.log('\n✅ テスト完了！');
    console.log('ブラウザを確認してください。Ctrl+Cで終了。\n');
    
    // ブラウザを開いたままにする
    await new Promise(() => {});
})();