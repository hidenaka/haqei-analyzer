import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: false }); // ヘッドレスモードを無効にして確認
    const page = await browser.newPage();
    
    console.log('🚀 HAQEI実装チェック開始（可視モード）\n');
    
    try {
        // publicフォルダから起動している場合
        console.log('📌 ページを開いています...');
        await page.goto('http://localhost:8000/results.html');
        await page.waitForTimeout(3000);
        
        console.log('📋 ページ読み込み完了\n');
        
        // ページのタイトルとURLを確認
        const title = await page.title();
        const url = page.url();
        console.log(`📄 ページタイトル: ${title}`);
        console.log(`🔗 URL: ${url}\n`);
        
        // 利用可能なクラスを確認
        const availableClasses = await page.evaluate(() => {
            const classes = [];
            if (typeof StorageManager !== 'undefined') classes.push('StorageManager');
            if (typeof TripleOSInteractionAnalyzer !== 'undefined') classes.push('TripleOSInteractionAnalyzer');
            if (typeof HexagramExtractor !== 'undefined') classes.push('HexagramExtractor');
            if (typeof ComprehensiveReportGenerator !== 'undefined') classes.push('ComprehensiveReportGenerator');
            if (typeof BasicResultsTab !== 'undefined') classes.push('BasicResultsTab');
            if (typeof DetailedAnalysisTab !== 'undefined') classes.push('DetailedAnalysisTab');
            if (typeof InsightsTab !== 'undefined') classes.push('InsightsTab');
            return classes;
        });
        
        console.log('🔧 利用可能なクラス:');
        availableClasses.forEach(cls => console.log(`   ✅ ${cls}`));
        console.log('');
        
        // タブの存在確認
        const tabs = await page.$$('[data-tab]');
        console.log(`📑 タブ数: ${tabs.length}個`);
        
        if (tabs.length > 0) {
            const tabNames = await page.$$eval('[data-tab]', elements => 
                elements.map(el => el.getAttribute('data-tab'))
            );
            console.log(`   タブ名: ${tabNames.join(', ')}`);
        }
        console.log('');
        
        // 1. BasicResultsタブの確認
        console.log('1️⃣ BasicResultsTab チェック');
        console.log('================================');
        
        // 基本タブが選択されているか確認
        const activeTab = await page.$('.tab-button.active, [data-tab].active');
        if (activeTab) {
            const activeTabName = await activeTab.getAttribute('data-tab');
            console.log(`   現在のアクティブタブ: ${activeTabName}`);
        }
        
        // OSカードの確認
        const osCards = await page.$$('.haqei-os-card, .os-card, .triple-os-card');
        console.log(`   OSカード数: ${osCards.length}個`);
        
        // 履歴比較セクションの確認
        const historicalComparison = await page.$('.historical-comparison-section, .history-comparison');
        console.log(`   履歴比較セクション: ${historicalComparison ? '✅ あり' : '❌ なし'}`);
        
        console.log('');
        
        // 2. DetailedAnalysisタブの確認
        console.log('2️⃣ DetailedAnalysisTab チェック');
        console.log('================================');
        
        // 詳細分析タブをクリック
        const detailedTab = await page.$('[data-tab="detailed-analysis"], [data-tab="detailed"]');
        if (detailedTab) {
            await detailedTab.click();
            await page.waitForTimeout(2000);
            console.log('   詳細分析タブをクリックしました');
            
            // 相互作用セクションの確認
            const interactionSection = await page.$('.interaction-details-section, .synergy-analysis-section');
            console.log(`   相互作用分析セクション: ${interactionSection ? '✅ あり' : '❌ なし'}`);
            
            if (interactionSection) {
                const synergyItems = await page.$$('.synergy-item');
                console.log(`   シナジー項目数: ${synergyItems.length}個`);
            }
        } else {
            console.log('   ⚠️ 詳細分析タブが見つかりません');
        }
        
        console.log('');
        
        // 3. InsightsTabの確認
        console.log('3️⃣ InsightsTab チェック');
        console.log('================================');
        
        // 洞察タブをクリック
        const insightsTab = await page.$('[data-tab="insights"]');
        if (insightsTab) {
            await insightsTab.click();
            await page.waitForTimeout(2000);
            console.log('   洞察タブをクリックしました');
            
            // 6爻発展段階セクションの確認
            const developmentSection = await page.$('.development-stages-section, .development-stages');
            console.log(`   6爻発展段階セクション: ${developmentSection ? '✅ あり' : '❌ なし'}`);
            
            if (developmentSection) {
                const stageItems = await page.$$('.stage-item');
                console.log(`   発展段階数: ${stageItems.length}個`);
                
                const currentStage = await page.$('.current-stage');
                console.log(`   現在段階の強調: ${currentStage ? '✅ あり' : '❌ なし'}`);
            }
            
            // 包括的レポートの確認
            const reportSection = await page.$('.comprehensive-report-section');
            console.log(`   包括的分析レポート: ${reportSection ? '✅ あり' : '❌ なし'}`);
        } else {
            console.log('   ⚠️ 洞察タブが見つかりません');
        }
        
        // スクリーンショットを撮影
        await page.screenshot({ path: 'implementation-check-visible.png', fullPage: true });
        console.log('\n📸 スクリーンショット保存: implementation-check-visible.png');
        
        // ブラウザを5秒間開いたままにして確認可能にする
        console.log('\n👀 ブラウザを5秒間表示します...');
        await page.waitForTimeout(5000);
        
    } catch (error) {
        console.error('❌ エラー発生:', error.message);
        console.error(error.stack);
    } finally {
        await browser.close();
        console.log('\n✅ チェック完了');
    }
})();