import { chromium } from 'playwright';

(async () => {
    console.log('🚀 HAQEI Analyzer 最終確認テスト');
    
    const browser = await chromium.launch({ 
        headless: false
    });
    const page = await browser.newPage();
    
    try {
        // results.htmlを開く
        console.log('\n📄 results.htmlを開いています...');
        const filePath = 'file:///Users/hideakimacbookair/Desktop/haqei-analyzer/public/results.html';
        await page.goto(filePath);
        await page.waitForTimeout(3000);
        
        // スクリーンショット撮影
        await page.screenshot({ 
            path: 'test-screenshots/results-final.png', 
            fullPage: true 
        });
        
        // 現在の状態を確認
        const pageState = await page.evaluate(() => {
            // エラーコンテナの状態
            const errorContainer = document.getElementById('error-container');
            const errorVisible = errorContainer ? 
                window.getComputedStyle(errorContainer).display !== 'none' : false;
            
            // ローディングの状態
            const loadingOverlay = document.getElementById('loading-overlay');
            const loadingVisible = loadingOverlay ? 
                loadingOverlay.classList.contains('active') : false;
            
            // タブシステムの状態
            const tabButtons = document.querySelectorAll('.haqei-tab-button');
            const tabPanels = document.querySelectorAll('.haqei-tab-panel');
            const activeButton = document.querySelector('.haqei-tab-button.active');
            
            // 背景色
            const backgroundColor = window.getComputedStyle(document.body).backgroundColor;
            
            // OSカードの状態
            const osCards = document.querySelectorAll('.os-card');
            
            return {
                errorVisible,
                loadingVisible,
                tabButtonCount: tabButtons.length,
                tabPanelCount: tabPanels.length,
                activeTab: activeButton ? activeButton.dataset.tab : null,
                backgroundColor,
                osCardCount: osCards.length,
                hasContent: document.body.textContent.trim().length > 0
            };
        });
        
        console.log('\n📊 ページ状態:');
        console.log('  背景色:', pageState.backgroundColor);
        console.log('  エラー表示:', pageState.errorVisible ? '❌ あり' : '✅ なし');
        console.log('  ローディング:', pageState.loadingVisible ? '⚠️ 表示中' : '✅ 完了');
        console.log('  タブボタン数:', pageState.tabButtonCount);
        console.log('  タブパネル数:', pageState.tabPanelCount);
        console.log('  アクティブタブ:', pageState.activeTab || 'なし');
        console.log('  OSカード数:', pageState.osCardCount);
        console.log('  コンテンツ:', pageState.hasContent ? '✅ あり' : '❌ なし');
        
        if (pageState.tabButtonCount > 0) {
            // 各タブをクリックしてテスト
            console.log('\n🔄 タブ切り替えテスト:');
            const tabs = ['basic', 'detailed', 'insights', 'scenarios', 'export', 'settings'];
            
            for (const tabName of tabs) {
                const button = await page.$(`[data-tab="${tabName}"]`);
                if (button) {
                    await button.click();
                    await page.waitForTimeout(1000);
                    
                    // スクリーンショット
                    await page.screenshot({ 
                        path: `test-screenshots/tab-${tabName}-final.png`
                    });
                    
                    console.log(`  ✅ ${tabName}タブ切り替え完了`);
                }
            }
        }
        
        console.log('\n✅ テスト完了！');
        console.log('📸 スクリーンショット保存先: test-screenshots/');
        console.log('\n画面を確認してください。Ctrl+Cで終了します。');
        
    } catch (error) {
        console.error('❌ エラー:', error.message);
    }
    
    // ブラウザを開いたままにする
    await new Promise(() => {});
})();