import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    console.log('🚀 HAQEI Results画面の実際の挙動確認');
    
    const browser = await chromium.launch({ 
        headless: false,
        devtools: true
    });
    const page = await browser.newPage();
    
    // コンソールログを全て表示
    page.on('console', msg => {
        console.log(`[${msg.type()}]`, msg.text());
    });
    
    // エラーも表示
    page.on('pageerror', error => {
        console.error('❌ ページエラー:', error.message);
    });
    
    const resultsPath = `file://${path.join(__dirname, 'public', 'results.html')}`;
    console.log('📄 開くファイル:', resultsPath);
    
    await page.goto(resultsPath);
    await page.waitForTimeout(5000);
    
    // 画面の状態を取得
    const state = await page.evaluate(() => {
        const getElementInfo = (selector) => {
            const el = document.querySelector(selector);
            if (!el) return null;
            const style = window.getComputedStyle(el);
            return {
                exists: true,
                visible: style.display !== 'none',
                text: el.textContent?.trim().substring(0, 100)
            };
        };
        
        return {
            body: {
                backgroundColor: window.getComputedStyle(document.body).backgroundColor,
                color: window.getComputedStyle(document.body).color
            },
            errorContainer: getElementInfo('#error-container'),
            loadingOverlay: getElementInfo('#loading-overlay'),
            mainContainer: getElementInfo('#virtual-persona-container'),
            tabButtons: document.querySelectorAll('.haqei-tab-button').length,
            tabPanels: document.querySelectorAll('.haqei-tab-panel').length,
            osCards: document.querySelectorAll('.os-card').length
        };
    });
    
    console.log('\n📊 現在の画面状態:');
    console.log('背景色:', state.body.backgroundColor);
    console.log('文字色:', state.body.color);
    console.log('エラー表示:', state.errorContainer?.visible ? '❌ 表示中' : '✅ 非表示');
    console.log('ローディング:', state.loadingOverlay?.visible ? '⚠️ 表示中' : '✅ 非表示');
    console.log('タブボタン数:', state.tabButtons);
    console.log('タブパネル数:', state.tabPanels);
    console.log('OSカード数:', state.osCards);
    
    // スクリーンショットを撮影
    await page.screenshot({ 
        path: 'current-state.png', 
        fullPage: true 
    });
    console.log('\n📸 スクリーンショット保存: current-state.png');
    
    console.log('\n🔍 ブラウザのDevToolsとコンソールを確認してください');
    console.log('終了するにはCtrl+Cを押してください');
    
    // ブラウザを開いたままにする
    await new Promise(() => {});
})();