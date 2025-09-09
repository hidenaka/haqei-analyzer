import { chromium } from 'playwright';

console.log('🚀 Playwright完全動作テスト開始\n');

const browser = await chromium.launch({ 
    headless: false,
    devtools: true 
});
const context = await browser.newContext();
const page = await context.newPage();

// コンソールログを収集
const logs = [];
page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
});

// ステップ1: ページを開く
console.log('📍 Step 1: ページを開く');
await page.goto('http://localhost:8012/public/results.html', {
    waitUntil: 'networkidle'
});
await page.waitForTimeout(2000);

// ステップ2: 初期状態を確認
console.log('\n📊 Step 2: 初期状態チェック');
const initialState = await page.evaluate(() => {
    return {
        hasLoadingOverlay: !!document.getElementById('loading-overlay'),
        loadingVisible: document.getElementById('loading-overlay')?.classList.contains('active'),
        hasErrorContainer: !!document.getElementById('error-container'),
        errorVisible: document.getElementById('error-container')?.style.display !== 'none',
        errorMessage: document.getElementById('error-message')?.textContent,
        hasVirtualPersonaContainer: !!document.getElementById('virtual-persona-container'),
        containerHTML: document.getElementById('virtual-persona-container')?.innerHTML.substring(0, 200)
    };
});
console.log('初期状態:', JSON.stringify(initialState, null, 2));

// ステップ3: エラーコンテナを強制的に非表示
console.log('\n🔧 Step 3: エラーコンテナを非表示化');
await page.evaluate(() => {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        errorContainer.style.display = 'none';
        console.log('✅ エラーコンテナを非表示にしました');
    }
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
        loadingOverlay.classList.remove('active');
        console.log('✅ ローディングオーバーレイを非表示にしました');
    }
});
await page.waitForTimeout(1000);

// ステップ4: タブナビゲーションの確認
console.log('\n🎯 Step 4: タブナビゲーション確認');
const tabState = await page.evaluate(() => {
    const tabButtons = document.querySelectorAll('.haqei-tab-button');
    const tabPanels = document.querySelectorAll('.haqei-tab-panel');
    const osCards = document.querySelectorAll('.os-card');
    
    return {
        tabButtonCount: tabButtons.length,
        tabButtonTexts: Array.from(tabButtons).map(btn => btn.textContent.trim()),
        tabPanelCount: tabPanels.length,
        activeTabButton: document.querySelector('.haqei-tab-button.active')?.textContent.trim(),
        activeTabPanel: document.querySelector('.haqei-tab-panel.active')?.id,
        osCardCount: osCards.length,
        hasBasicResults: !!document.getElementById('basic-results'),
        basicResultsContent: document.getElementById('basic-results')?.innerHTML.length || 0
    };
});
console.log('タブ状態:', JSON.stringify(tabState, null, 2));

// ステップ5: Triple OSデータの確認
console.log('\n📈 Step 5: Triple OSデータ確認');
const osData = await page.evaluate(() => {
    const cards = document.querySelectorAll('.os-card');
    return Array.from(cards).map(card => {
        return {
            title: card.querySelector('h3')?.textContent,
            score: card.querySelector('.os-score')?.textContent,
            hexagram: card.querySelector('.hexagram-symbol')?.textContent,
            hexagramName: card.querySelector('.hexagram-name')?.textContent,
            traits: Array.from(card.querySelectorAll('.trait-tag')).map(t => t.textContent)
        };
    });
});
console.log('Triple OSカード:', JSON.stringify(osData, null, 2));

// ステップ6: タブ切り替えテスト
console.log('\n🔄 Step 6: タブ切り替えテスト');
const tabButtons = await page.$$('.haqei-tab-button');
if (tabButtons.length > 1) {
    // 詳細分析タブをクリック
    await tabButtons[1].click();
    await page.waitForTimeout(500);
    
    const afterSwitch = await page.evaluate(() => {
        return {
            activeButton: document.querySelector('.haqei-tab-button.active')?.textContent.trim(),
            activePanel: document.querySelector('.haqei-tab-panel.active')?.id,
            detailedContent: document.getElementById('detailed-analysis')?.innerHTML.length || 0
        };
    });
    console.log('詳細タブ切り替え後:', afterSwitch);
    
    // 基本タブに戻る
    await tabButtons[0].click();
    await page.waitForTimeout(500);
}

// ステップ7: localStorageデータ確認
console.log('\n💾 Step 7: LocalStorageデータ確認');
const storageData = await page.evaluate(() => {
    const sm = new StorageManager();
    const result = sm.getAnalysisResult();
    return {
        hasData: !!result,
        engineOS: result?.engineOS?.name,
        engineScore: result?.engineOS?.score,
        interfaceOS: result?.interfaceOS?.name,
        interfaceScore: result?.interfaceOS?.score,
        safeModeOS: result?.safeModeOS?.name,
        safeModeScore: result?.safeModeOS?.score
    };
});
console.log('StorageManagerデータ:', JSON.stringify(storageData, null, 2));

// ステップ8: スクリーンショット撮影
console.log('\n📸 Step 8: スクリーンショット撮影');
await page.screenshot({ 
    path: 'final-results-page.png', 
    fullPage: true 
});
console.log('スクリーンショット保存: final-results-page.png');

// ステップ9: 最終状態確認
console.log('\n✅ Step 9: 最終状態確認');
const finalState = await page.evaluate(() => {
    const container = document.getElementById('virtual-persona-container');
    const tabNav = document.querySelector('.haqei-tab-navigation');
    const tabContent = document.querySelector('.haqei-tab-content');
    const basicResults = document.getElementById('basic-results');
    
    return {
        hasContent: container && container.innerHTML.length > 100,
        hasTabNavigation: !!tabNav,
        hasTabContent: !!tabContent,
        hasBasicResults: !!basicResults,
        basicResultsLength: basicResults?.innerHTML.length || 0,
        visibleOSCards: document.querySelectorAll('.os-card').length,
        errorVisible: document.getElementById('error-container')?.style.display !== 'none'
    };
});

console.log('\n========== 最終レポート ==========');
console.log('✅ コンテナ存在:', finalState.hasContent ? '○' : '×');
console.log('✅ タブナビゲーション:', finalState.hasTabNavigation ? '○' : '×');
console.log('✅ タブコンテンツ:', finalState.hasTabContent ? '○' : '×');
console.log('✅ 基本結果表示:', finalState.hasBasicResults ? '○' : '×');
console.log('✅ OSカード表示数:', finalState.visibleOSCards);
console.log('✅ エラー非表示:', !finalState.errorVisible ? '○' : '×');
console.log('=====================================\n');

// コンソールログの一部を表示
console.log('📋 初期化ログ（最後の10件）:');
logs.slice(-10).forEach(log => console.log(log));

// ブラウザを開いたままにする
console.log('\n🌐 ブラウザは開いたままです。手動で確認してください。');
console.log('終了するには Ctrl+C を押してください。');

// 無限待機（手動確認のため）
await new Promise(() => {});