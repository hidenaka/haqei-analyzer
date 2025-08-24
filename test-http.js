import { chromium } from 'playwright';

(async () => {
    console.log('🚀 HAQEI Analyzer HTTPテスト開始');
    
    // ブラウザを起動
    const browser = await chromium.launch({ 
        headless: false,
        devtools: false 
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // コンソールログを監視
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        if (type === 'error') {
            console.error('❌ エラー:', text);
        } else if (type === 'warning') {
            console.warn('⚠️ 警告:', text);
        }
    });
    
    try {
        // results.htmlをテスト
        console.log('\n📄 results.htmlをテスト中...');
        await page.goto('http://localhost:8080/public/results.html');
        await page.waitForTimeout(3000);
        
        // エラーコンテナが表示されているかチェック
        const errorContainer = await page.$('#error-container');
        const errorStyle = await errorContainer.evaluate(el => window.getComputedStyle(el).display);
        console.log('エラーコンテナの表示状態:', errorStyle);
        
        // TabNavigatorの確認
        const tabNavigatorExists = await page.evaluate(() => {
            return typeof TabNavigator !== 'undefined';
        });
        console.log('TabNavigator存在確認:', tabNavigatorExists ? '✅' : '❌');
        
        // タブボタンの確認
        const tabButtons = await page.$$('.haqei-tab-button');
        console.log(`タブボタン数: ${tabButtons.length}`);
        
        // タブコンテンツの確認
        const tabPanels = await page.$$('.haqei-tab-panel');
        console.log(`タブパネル数: ${tabPanels.length}`);
        
        // 基本結果タブの内容確認
        const basicPanel = await page.$('[data-tab="basic"].haqei-tab-panel');
        if (basicPanel) {
            const isActive = await basicPanel.evaluate(el => el.classList.contains('active'));
            console.log('基本結果タブアクティブ:', isActive ? '✅' : '❌');
            
            // OSカードコンテナの確認
            const osCardsContainer = await basicPanel.$('#os-cards-container');
            console.log('OSカードコンテナ:', osCardsContainer ? '✅ 存在' : '❌ 見つかりません');
            
            if (osCardsContainer) {
                const osCards = await osCardsContainer.$$('.os-card');
                console.log(`OSカード数: ${osCards.length}`);
            }
        }
        
        // 背景色の確認
        const backgroundColor = await page.evaluate(() => {
            const body = document.body;
            return window.getComputedStyle(body).backgroundColor;
        });
        console.log('背景色:', backgroundColor);
        
        // スクリーンショット撮影
        await page.screenshot({ 
            path: 'test-screenshots/results-http.png', 
            fullPage: true 
        });
        console.log('✅ スクリーンショット保存');
        
        // 各タブをクリック
        console.log('\n📑 タブ切り替えテスト...');
        const tabs = ['detailed', 'insights', 'scenarios', 'export', 'settings'];
        for (const tabName of tabs) {
            const tabButton = await page.$(`[data-tab="${tabName}"]`);
            if (tabButton) {
                await tabButton.click();
                await page.waitForTimeout(1000);
                
                const panel = await page.$(`[data-tab="${tabName}"].haqei-tab-panel`);
                const isActive = await panel?.evaluate(el => el.classList.contains('active'));
                console.log(`${tabName}タブ:`, isActive ? '✅ アクティブ' : '❌ 非アクティブ');
                
                await page.screenshot({ 
                    path: `test-screenshots/tab-${tabName}-http.png`
                });
            }
        }
        
        // 基本タブに戻る
        const basicButton = await page.$('[data-tab="basic"]');
        await basicButton.click();
        await page.waitForTimeout(1000);
        
        console.log('\n✅ テスト完了！ブラウザは開いたままです。');
        console.log('手動で確認後、Ctrl+Cでプロセスを終了してください。');
        
    } catch (error) {
        console.error('❌ テスト中にエラーが発生:', error);
    }
    
    // ブラウザを閉じない
    await new Promise(() => {});
})();