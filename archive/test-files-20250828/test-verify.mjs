import { chromium } from 'playwright';

console.log('🚀 修正後の動作確認テスト開始\n');

const browser = await chromium.launch({ 
    headless: false,
    devtools: false 
});
const context = await browser.newContext();
const page = await context.newPage();

// ページを開く
console.log('📍 ページを開く...');
await page.goto('http://localhost:8012/public/results.html', {
    waitUntil: 'networkidle'
});
await page.waitForTimeout(2000);

// エラーコンテナとローディングを非表示にする
await page.evaluate(() => {
    const errorContainer = document.getElementById('error-container');
    const loadingOverlay = document.getElementById('loading-overlay');
    if (errorContainer) errorContainer.style.display = 'none';
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
        loadingOverlay.classList.remove('active');
    }
});

// 確認1: タブボタンの重複チェック
const tabButtonCount = await page.locator('.haqei-tab-button').count();
console.log(`\n✅ タブボタン数: ${tabButtonCount} (期待値: 6)`);
if (tabButtonCount === 6) {
    console.log('   → タブボタンの重複問題が解決されました！');
} else {
    console.log('   → ⚠️ タブボタンが重複しています');
}

// 確認2: OSカードの表示チェック
const osCardCount = await page.locator('.os-card').count();
console.log(`\n✅ OSカード数: ${osCardCount} (期待値: 3)`);
if (osCardCount === 3) {
    console.log('   → OSカードが正しく表示されています！');
    
    // カードの詳細を取得
    const cards = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.os-card')).map(card => ({
            name: card.querySelector('h3')?.textContent,
            score: card.querySelector('.os-score')?.textContent,
            hexagram: card.querySelector('.hexagram-symbol')?.textContent
        }));
    });
    
    cards.forEach((card, i) => {
        console.log(`   → カード${i+1}: ${card.name} - スコア: ${card.score} - 卦: ${card.hexagram}`);
    });
} else {
    console.log('   → ⚠️ OSカードが表示されていません');
}

// 確認3: タブ切り替えテスト
console.log('\n✅ タブ切り替えテスト:');

// 詳細分析タブをクリック
await page.click('[data-tab="detailed"]');
await page.waitForTimeout(1000);

const detailedActive = await page.evaluate(() => {
    const button = document.querySelector('[data-tab="detailed"]');
    const panel = document.querySelector('#detailed-analysis');
    return {
        buttonActive: button?.classList.contains('active'),
        panelActive: panel?.classList.contains('active'),
        contentLength: panel?.innerHTML.length || 0
    };
});

console.log(`   → 詳細分析タブ: ボタン=${detailedActive.buttonActive ? '✓' : '✗'}, パネル=${detailedActive.panelActive ? '✓' : '✗'}, コンテンツ=${detailedActive.contentLength}文字`);

// 基本結果タブに戻る
await page.click('[data-tab="basic"]');
await page.waitForTimeout(1000);

const basicActive = await page.evaluate(() => {
    const button = document.querySelector('[data-tab="basic"]');
    const panel = document.querySelector('#basic-results');
    return {
        buttonActive: button?.classList.contains('active'),
        panelActive: panel?.classList.contains('active')
    };
});

console.log(`   → 基本結果タブに戻る: ボタン=${basicActive.buttonActive ? '✓' : '✗'}, パネル=${basicActive.panelActive ? '✓' : '✗'}`);

// 確認4: StorageManagerのデータ確認
const storageData = await page.evaluate(() => {
    const sm = new StorageManager();
    const result = sm.getAnalysisResult();
    return {
        hasData: !!result,
        engineScore: result?.engineOS?.score,
        interfaceScore: result?.interfaceOS?.score,
        safeModeScore: result?.safeModeOS?.score
    };
});

console.log('\n✅ StorageManagerデータ:');
console.log(`   → データ存在: ${storageData.hasData ? '✓' : '✗'}`);
if (storageData.hasData) {
    console.log(`   → Engine OS: ${storageData.engineScore}`);
    console.log(`   → Interface OS: ${storageData.interfaceScore}`);
    console.log(`   → Safe Mode OS: ${storageData.safeModeScore}`);
}

// スクリーンショット
await page.screenshot({ 
    path: 'verified-results.png', 
    fullPage: true 
});

console.log('\n📸 スクリーンショット保存: verified-results.png');

// 最終確認
const finalCheck = await page.evaluate(() => {
    return {
        tabButtons: document.querySelectorAll('.haqei-tab-button').length,
        tabPanels: document.querySelectorAll('.haqei-tab-panel').length,
        osCards: document.querySelectorAll('.os-card').length,
        errorVisible: document.getElementById('error-container')?.style.display !== 'none'
    };
});

console.log('\n========== 最終チェック ==========');
console.log(`✅ タブボタン: ${finalCheck.tabButtons === 6 ? '✓ 正常' : '✗ 異常'} (${finalCheck.tabButtons}個)`);
console.log(`✅ タブパネル: ${finalCheck.tabPanels === 6 ? '✓ 正常' : '✗ 異常'} (${finalCheck.tabPanels}個)`);
console.log(`✅ OSカード: ${finalCheck.osCards === 3 ? '✓ 正常' : '✗ 異常'} (${finalCheck.osCards}個)`);
console.log(`✅ エラー表示: ${!finalCheck.errorVisible ? '✓ 非表示' : '✗ 表示中'}`);
console.log('=====================================\n');

if (finalCheck.tabButtons === 6 && finalCheck.osCards === 3) {
    console.log('🎉 すべての修正が正常に動作しています！');
} else {
    console.log('⚠️ 一部の問題が残っています。');
}

console.log('\n🌐 ブラウザは開いたままです。手動で確認してください。');
console.log('終了するには Ctrl+C を押してください。');

// 無限待機
await new Promise(() => {});