import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();

// コンソールログをキャプチャ
const logs = [];
const errors = [];

page.on('console', msg => {
    const text = msg.text();
    logs.push({ type: msg.type(), text });
    console.log(`[${msg.type()}] ${text}`);
});

page.on('pageerror', error => {
    errors.push(error.toString());
    console.error('[PAGE ERROR]', error.toString());
});

// ページを開く
console.log('📍 Opening results.html...');
await page.goto('http://localhost:8012/public/results.html', {
    waitUntil: 'networkidle'
});

// ページの基本情報を取得
const pageInfo = await page.evaluate(() => {
    return {
        title: document.title,
        url: window.location.href,
        hasContainer: !!document.getElementById('virtual-persona-container'),
        hasLoadingOverlay: !!document.getElementById('loading-overlay'),
        backgroundColor: window.getComputedStyle(document.body).backgroundColor
    };
});

console.log('\n📊 Page Info:', pageInfo);

// localStorageの状態を確認
const localStorageData = await page.evaluate(() => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('haqei')) {
            const value = localStorage.getItem(key);
            try {
                data[key] = { 
                    size: value.length,
                    hasData: value.length > 0,
                    sample: value.substring(0, 100)
                };
            } catch (e) {
                data[key] = { error: e.message };
            }
        }
    }
    return data;
});

console.log('\n💾 LocalStorage HAQEI Data:');
console.log(JSON.stringify(localStorageData, null, 2));

// JavaScriptクラスの存在確認
const jsClasses = await page.evaluate(() => {
    return {
        StorageManager: typeof StorageManager !== 'undefined',
        TabNavigator: typeof TabNavigator !== 'undefined',
        BaseTabView: typeof BaseTabView !== 'undefined',
        BasicResultsTab: typeof BasicResultsTab !== 'undefined',
        VirtualPersonaResultsView: typeof VirtualPersonaResultsView !== 'undefined'
    };
});

console.log('\n🔧 JavaScript Classes:', jsClasses);

// 1秒待ってからDOM状態を確認
await page.waitForTimeout(1000);

const domState = await page.evaluate(() => {
    const loadingOverlay = document.getElementById('loading-overlay');
    const errorContainer = document.getElementById('error-container');
    const virtualPersonaContainer = document.getElementById('virtual-persona-container');
    
    return {
        loadingVisible: loadingOverlay && loadingOverlay.classList.contains('active'),
        errorVisible: errorContainer && errorContainer.style.display !== 'none',
        containerContent: virtualPersonaContainer ? virtualPersonaContainer.innerHTML.substring(0, 200) : null,
        hasTabNavigator: !!document.querySelector('.tab-navigator'),
        hasTabButtons: document.querySelectorAll('.tab-btn').length,
        activeTab: document.querySelector('.tab-btn.active')?.textContent
    };
});

console.log('\n🖼️ DOM State:', domState);

// StorageManagerのテスト実行
const storageTest = await page.evaluate(() => {
    if (typeof StorageManager === 'undefined') {
        return { error: 'StorageManager not defined' };
    }
    
    const sm = new StorageManager();
    const result = sm.getAnalysisResult();
    
    return {
        hasEngineOS: !!result.engineOS,
        hasInterfaceOS: !!result.interfaceOS,
        hasSafeModeOS: !!result.safeModeOS,
        engineScore: result.engineOS?.score,
        interfaceScore: result.interfaceOS?.score,
        safeModeScore: result.safeModeOS?.score
    };
});

console.log('\n📈 Storage Manager Test:', storageTest);

// TabNavigatorの状態を確認
const tabNavTest = await page.evaluate(() => {
    if (typeof TabNavigator === 'undefined') {
        return { error: 'TabNavigator not defined' };
    }
    
    // TabNavigatorのインスタンスを探す
    const tabNav = window.tabNavigator;
    if (tabNav) {
        return {
            exists: true,
            currentTab: tabNav.currentTab,
            tabs: tabNav.tabs
        };
    }
    
    return { exists: false, message: 'TabNavigator instance not found' };
});

console.log('\n🎯 TabNavigator Test:', tabNavTest);

// エラーがある場合は詳細を表示
if (errors.length > 0) {
    console.log('\n❌ Errors found:');
    errors.forEach(err => console.error(err));
}

// テストデータを生成してリロード
console.log('\n🔄 Generating test data and reloading...');
await page.evaluate(() => {
    const sm = new StorageManager();
    sm.generateTestData();
});

await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// リロード後の状態を確認
const afterReload = await page.evaluate(() => {
    const container = document.getElementById('virtual-persona-container');
    return {
        hasContent: container && container.innerHTML.length > 100,
        hasTabNav: !!document.querySelector('.tab-navigator'),
        tabButtons: document.querySelectorAll('.tab-btn').length,
        hasOSCards: document.querySelectorAll('.os-card').length
    };
});

console.log('\n🔄 After Reload State:', afterReload);

// スクリーンショットを撮る
await page.screenshot({ path: 'results-page-state.png', fullPage: true });
console.log('\n📸 Screenshot saved as results-page-state.png');

// 3秒待ってから終了
await page.waitForTimeout(3000);
await browser.close();
console.log('\n✅ Test completed');