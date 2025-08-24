import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    console.log('🚀 HAQEI Analyzer テスト開始');
    
    // ブラウザを起動
    const browser = await chromium.launch({ 
        headless: false,
        devtools: true 
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // コンソールログを監視
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        if (type === 'error') {
            console.error('❌ ブラウザエラー:', text);
        } else if (type === 'warning') {
            console.warn('⚠️ ブラウザ警告:', text);
        } else {
            console.log(`📝 ${type}:`, text);
        }
    });
    
    // ページエラーを監視
    page.on('pageerror', error => {
        console.error('❌ ページエラー:', error.message);
    });
    
    try {
        // 1. index.htmlのテスト
        console.log('\n📄 index.htmlをテスト中...');
        const indexPath = `file://${path.join(__dirname, 'public', 'index.html')}`;
        await page.goto(indexPath);
        await page.waitForTimeout(2000);
        
        // スクリーンショット撮影
        await page.screenshot({ 
            path: 'test-screenshots/index.png', 
            fullPage: true 
        });
        console.log('✅ index.htmlのスクリーンショット保存');
        
        // 2. results.htmlのテスト
        console.log('\n📄 results.htmlをテスト中...');
        const resultsPath = `file://${path.join(__dirname, 'public', 'results.html')}`;
        await page.goto(resultsPath);
        await page.waitForTimeout(3000);
        
        // TabNavigatorが正しく初期化されているか確認
        const tabNavigatorExists = await page.evaluate(() => {
            return typeof TabNavigator !== 'undefined';
        });
        console.log('TabNavigator存在確認:', tabNavigatorExists ? '✅' : '❌');
        
        // タブボタンの存在確認
        const tabButtons = await page.$$('.haqei-tab-button');
        console.log(`タブボタン数: ${tabButtons.length}`);
        
        // 基本結果タブの内容確認
        const basicTabContent = await page.$('#os-cards-container');
        if (basicTabContent) {
            console.log('✅ 基本結果タブのコンテナが存在');
        } else {
            console.log('❌ 基本結果タブのコンテナが見つかりません');
        }
        
        // 背景色の確認
        const backgroundColor = await page.evaluate(() => {
            const body = document.body;
            const computedStyle = window.getComputedStyle(body);
            return computedStyle.backgroundColor;
        });
        console.log('背景色:', backgroundColor);
        
        // スクリーンショット撮影
        await page.screenshot({ 
            path: 'test-screenshots/results.png', 
            fullPage: true 
        });
        console.log('✅ results.htmlのスクリーンショット保存');
        
        // 3. 各タブをクリックしてテスト
        const tabs = ['detailed', 'insights', 'scenarios', 'export', 'settings'];
        for (const tabName of tabs) {
            const tabButton = await page.$(`[data-tab="${tabName}"]`);
            if (tabButton) {
                await tabButton.click();
                await page.waitForTimeout(1000);
                console.log(`✅ ${tabName}タブをクリック`);
                
                await page.screenshot({ 
                    path: `test-screenshots/tab-${tabName}.png`, 
                    fullPage: true 
                });
            }
        }
        
        console.log('\n✅ すべてのテストが完了しました！');
        
    } catch (error) {
        console.error('❌ テスト中にエラーが発生:', error);
    } finally {
        // ブラウザを閉じない（手動確認のため）
        console.log('\n🔍 ブラウザは開いたままです。手動で確認後、閉じてください。');
    }
})();