import { chromium } from 'playwright';

(async () => {
    console.log('🚀 HAQEI Analyzer 詳細テスト開始');
    
    const browser = await chromium.launch({ 
        headless: false,
        devtools: false 
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // エラーのみ記録
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.error('❌', msg.text());
        }
    });
    
    try {
        console.log('\n📄 results.htmlを開いています...');
        await page.goto('http://localhost:8080/public/results.html');
        await page.waitForTimeout(2000);
        
        // 1. 背景色の確認
        const styles = await page.evaluate(() => {
            const body = document.body;
            const container = document.getElementById('virtual-persona-container');
            return {
                bodyBg: window.getComputedStyle(body).backgroundColor,
                containerBg: container ? window.getComputedStyle(container).backgroundColor : null
            };
        });
        console.log('\n🎨 デザイン確認:');
        console.log('  - Body背景色:', styles.bodyBg);
        console.log('  - Container背景色:', styles.containerBg);
        
        // 2. タブシステムの確認
        console.log('\n📑 タブシステム確認:');
        const tabInfo = await page.evaluate(() => {
            const buttons = document.querySelectorAll('.haqei-tab-button');
            const panels = document.querySelectorAll('.haqei-tab-panel');
            const activeButton = document.querySelector('.haqei-tab-button.active');
            const activePanel = document.querySelector('.haqei-tab-panel.active');
            
            return {
                buttonCount: buttons.length,
                panelCount: panels.length,
                activeButtonText: activeButton ? activeButton.textContent.trim() : null,
                activePanelTab: activePanel ? activePanel.dataset.tab : null,
                buttonTabs: Array.from(buttons).map(b => b.dataset.tab)
            };
        });
        console.log('  - タブボタン数:', tabInfo.buttonCount);
        console.log('  - タブパネル数:', tabInfo.panelCount);
        console.log('  - アクティブボタン:', tabInfo.activeButtonText);
        console.log('  - アクティブパネル:', tabInfo.activePanelTab);
        console.log('  - 利用可能なタブ:', tabInfo.buttonTabs.join(', '));
        
        // 3. 基本結果タブの内容確認
        console.log('\n📊 基本結果タブの内容:');
        const basicContent = await page.evaluate(() => {
            const basicPanel = document.querySelector('[data-tab="basic"].haqei-tab-panel');
            if (!basicPanel) return { found: false };
            
            const osCards = basicPanel.querySelectorAll('.os-card');
            const summaryContainer = basicPanel.querySelector('#summary-container');
            const personalityContainer = basicPanel.querySelector('#personality-profile-container');
            
            return {
                found: true,
                isActive: basicPanel.classList.contains('active'),
                osCardCount: osCards.length,
                hasSummary: !!summaryContainer,
                hasPersonality: !!personalityContainer,
                osCardNames: Array.from(osCards).map(card => {
                    const nameEl = card.querySelector('.os-name');
                    const scoreEl = card.querySelector('.score-value');
                    return {
                        name: nameEl ? nameEl.textContent : 'Unknown',
                        score: scoreEl ? scoreEl.textContent : 'N/A'
                    };
                })
            };
        });
        
        if (basicContent.found) {
            console.log('  - パネル発見: ✅');
            console.log('  - アクティブ:', basicContent.isActive ? '✅' : '❌');
            console.log('  - OSカード数:', basicContent.osCardCount);
            console.log('  - サマリーセクション:', basicContent.hasSummary ? '✅' : '❌');
            console.log('  - 人物像セクション:', basicContent.hasPersonality ? '✅' : '❌');
            
            if (basicContent.osCardNames.length > 0) {
                console.log('  - OSカード詳細:');
                basicContent.osCardNames.forEach(card => {
                    console.log(`    • ${card.name}: ${card.score}点`);
                });
            }
        } else {
            console.log('  - パネル発見: ❌');
        }
        
        // 4. 各タブの動作確認
        console.log('\n🔄 タブ切り替えテスト:');
        const tabs = ['detailed', 'insights', 'scenarios', 'export', 'settings', 'basic'];
        
        for (const tabName of tabs) {
            const button = await page.$(`[data-tab="${tabName}"]`);
            if (button) {
                await button.click();
                await page.waitForTimeout(500);
                
                const tabState = await page.evaluate((tab) => {
                    const btn = document.querySelector(`[data-tab="${tab}"]`);
                    const panel = document.querySelector(`[data-tab="${tab}"].haqei-tab-panel`);
                    return {
                        buttonActive: btn?.classList.contains('active'),
                        panelActive: panel?.classList.contains('active'),
                        panelContent: panel?.textContent?.substring(0, 100)
                    };
                }, tabName);
                
                const status = tabState.buttonActive && tabState.panelActive ? '✅' : '⚠️';
                console.log(`  ${status} ${tabName}タブ: ボタン=${tabState.buttonActive}, パネル=${tabState.panelActive}`);
            }
        }
        
        // 5. エラーチェック
        console.log('\n🔍 エラーチェック:');
        const errorCheck = await page.evaluate(() => {
            const errorContainer = document.getElementById('error-container');
            const loadingOverlay = document.getElementById('loading-overlay');
            
            return {
                errorVisible: errorContainer ? window.getComputedStyle(errorContainer).display !== 'none' : false,
                loadingVisible: loadingOverlay ? loadingOverlay.classList.contains('active') : false
            };
        });
        console.log('  - エラー表示:', errorCheck.errorVisible ? '⚠️ 表示中' : '✅ 非表示');
        console.log('  - ローディング:', errorCheck.loadingVisible ? '⚠️ 表示中' : '✅ 非表示');
        
        // 最終スクリーンショット
        await page.screenshot({ 
            path: 'test-screenshots/final-state.png', 
            fullPage: true 
        });
        
        console.log('\n✅ テスト完了！');
        console.log('📸 スクリーンショット: test-screenshots/final-state.png');
        console.log('\n🔍 ブラウザは開いたままです。手動確認後、Ctrl+Cで終了してください。');
        
    } catch (error) {
        console.error('❌ テスト中にエラー:', error.message);
    }
    
    // ブラウザを開いたままにする
    await new Promise(() => {});
})();