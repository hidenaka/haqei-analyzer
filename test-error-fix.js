import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    console.log('🚀 エラー修正確認テスト');
    
    const browser = await chromium.launch({ 
        headless: false,
        devtools: true
    });
    const page = await browser.newPage();
    
    // エラーを記録
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            const text = msg.text();
            errors.push(text);
            console.error('❌', text);
        }
    });
    
    page.on('pageerror', error => {
        errors.push(error.message);
        console.error('❌ ページエラー:', error.message);
    });
    
    const resultsPath = `file://${path.join(__dirname, 'public', 'results.html')}`;
    console.log('📄 開くファイル:', resultsPath);
    
    await page.goto(resultsPath);
    await page.waitForTimeout(3000);
    
    // 詳細分析タブをクリック
    console.log('\n📑 詳細分析タブをテスト...');
    const detailedButton = await page.$('[data-tab="detailed"]');
    if (detailedButton) {
        await detailedButton.click();
        await page.waitForTimeout(2000);
        
        // 詳細分析タブの内容を確認
        const detailedState = await page.evaluate(() => {
            const panel = document.querySelector('[data-tab="detailed"].haqei-tab-panel');
            if (!panel) return { found: false };
            
            // 各セクションの存在確認
            const sections = {
                balance: !!panel.querySelector('.balance-analysis-section'),
                synergy: !!panel.querySelector('.synergy-analysis-section'),
                interaction: !!panel.querySelector('.interaction-details-section'),
                integrated: !!panel.querySelector('.integrated-summary-section'),
                action: !!panel.querySelector('.action-plan-section')
            };
            
            // シナジーカードの確認
            const synergyCards = panel.querySelectorAll('.synergy-card');
            
            return {
                found: true,
                isActive: panel.classList.contains('active'),
                sections,
                synergyCardCount: synergyCards.length,
                hasContent: panel.textContent.trim().length > 100
            };
        });
        
        console.log('\n📊 詳細分析タブの状態:');
        console.log('  - タブ発見:', detailedState.found ? '✅' : '❌');
        console.log('  - アクティブ:', detailedState.isActive ? '✅' : '❌');
        console.log('  - コンテンツ:', detailedState.hasContent ? '✅ あり' : '❌ なし');
        
        if (detailedState.sections) {
            console.log('  - セクション:');
            console.log('    • バランス分析:', detailedState.sections.balance ? '✅' : '❌');
            console.log('    • シナジー分析:', detailedState.sections.synergy ? '✅' : '❌');
            console.log('    • 相互作用詳細:', detailedState.sections.interaction ? '✅' : '❌');
            console.log('    • 統合サマリー:', detailedState.sections.integrated ? '✅' : '❌');
            console.log('    • アクションプラン:', detailedState.sections.action ? '✅' : '❌');
        }
        
        console.log('  - シナジーカード数:', detailedState.synergyCardCount);
    }
    
    // 基本結果タブに戻る
    console.log('\n📑 基本結果タブに戻る...');
    const basicButton = await page.$('[data-tab="basic"]');
    if (basicButton) {
        await basicButton.click();
        await page.waitForTimeout(2000);
        
        // 基本結果タブの状態確認
        const basicState = await page.evaluate(() => {
            const panel = document.querySelector('[data-tab="basic"].haqei-tab-panel');
            if (!panel) return { found: false };
            
            const osCards = panel.querySelectorAll('.os-card');
            const osCardData = Array.from(osCards).map(card => {
                const name = card.querySelector('.os-name')?.textContent;
                const score = card.querySelector('.score-value')?.textContent;
                return { name, score };
            });
            
            return {
                found: true,
                isActive: panel.classList.contains('active'),
                osCardCount: osCards.length,
                osCardData,
                hasContent: panel.textContent.trim().length > 100
            };
        });
        
        console.log('\n📊 基本結果タブの状態:');
        console.log('  - タブ発見:', basicState.found ? '✅' : '❌');
        console.log('  - アクティブ:', basicState.isActive ? '✅' : '❌');
        console.log('  - コンテンツ:', basicState.hasContent ? '✅ あり' : '❌ なし');
        console.log('  - OSカード数:', basicState.osCardCount);
        
        if (basicState.osCardData && basicState.osCardData.length > 0) {
            console.log('  - OSカード詳細:');
            basicState.osCardData.forEach(card => {
                console.log(`    • ${card.name}: ${card.score}点`);
            });
        }
    }
    
    // スクリーンショット
    await page.screenshot({ 
        path: 'test-screenshots/after-fix.png', 
        fullPage: true 
    });
    
    // エラーサマリー
    console.log('\n📋 エラーサマリー:');
    if (errors.length === 0) {
        console.log('  ✅ エラーなし！');
    } else {
        console.log(`  ❌ ${errors.length}個のエラーが発生:`);
        errors.forEach((err, i) => {
            console.log(`    ${i + 1}. ${err.substring(0, 100)}...`);
        });
    }
    
    console.log('\n✅ テスト完了！');
    console.log('🔍 ブラウザのコンソールを確認してください');
    console.log('終了するにはCtrl+Cを押してください');
    
    // ブラウザを開いたままにする
    await new Promise(() => {});
})();