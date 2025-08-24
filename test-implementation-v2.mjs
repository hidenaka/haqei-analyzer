import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    console.log('🚀 HAQEI実装チェック開始\n');
    
    try {
        // publicフォルダから起動している場合
        await page.goto('http://localhost:8000/results.html');
        await page.waitForTimeout(3000);
        
        console.log('📋 ページ読み込み完了\n');
        
        // まず分析を実行して結果を生成
        console.log('🔄 テストデータを生成中...');
        await page.evaluate(() => {
            // StorageManagerを使ってテストデータを生成
            if (window.StorageManager) {
                const manager = new StorageManager();
                manager.generateTestData();
                console.log('Test data generated');
            }
        });
        
        await page.reload();
        await page.waitForTimeout(2000);
        
        // 1. BasicResultsTabのチェック
        console.log('1️⃣ BasicResultsTab チェック');
        console.log('================================');
        
        // Triple OSカードの確認
        const osCards = await page.$$('.haqei-os-card, .os-card');
        console.log(`✅ Triple OSカード数: ${osCards.length}個`);
        
        if (osCards.length > 0) {
            // OS名の取得
            const osNames = await page.$$eval('.haqei-os-name, .os-name', elements => 
                elements.map(el => el.textContent)
            );
            console.log(`✅ OS名: ${osNames.join(', ')}`);
        }
        
        // 履歴比較セクションの確認
        const historicalComparison = await page.$('.historical-comparison-section');
        if (historicalComparison) {
            const comparisonText = await historicalComparison.textContent();
            console.log('✅ 履歴比較セクション: 表示されています');
        } else {
            console.log('⚠️ 履歴比較セクション: 表示されていません（初回分析の可能性）');
        }
        
        console.log('');
        
        // 2. DetailedAnalysisTabのチェック
        console.log('2️⃣ DetailedAnalysisTab チェック');
        console.log('================================');
        
        // 詳細分析タブをクリック
        const detailedTab = await page.$('[data-tab="detailed-analysis"], [data-tab="detailed"]');
        if (detailedTab) {
            await detailedTab.click();
            await page.waitForTimeout(2000);
            
            // 相互作用セクションの確認
            const interactionSection = await page.$('.interaction-details-section');
            if (interactionSection) {
                console.log('✅ 相互作用分析セクション: 表示されています');
                
                // シナジー項目の確認
                const synergyItems = await page.$$('.synergy-item');
                console.log(`   シナジー項目数: ${synergyItems.length}個`);
            } else {
                console.log('❌ 相互作用分析セクション: 表示されていません');
            }
        } else {
            console.log('⚠️ 詳細分析タブが見つかりません');
        }
        
        console.log('');
        
        // 3. InsightsTabのチェック
        console.log('3️⃣ InsightsTab チェック');
        console.log('================================');
        
        // 洞察タブをクリック
        const insightsTab = await page.$('[data-tab="insights"]');
        if (insightsTab) {
            await insightsTab.click();
            await page.waitForTimeout(2000);
            
            // 6爻発展段階セクションの確認
            const developmentSection = await page.$('.development-stages-section');
            if (developmentSection) {
                console.log('✅ 6爻発展段階セクション: 表示されています');
                
                // 現在の段階の確認
                const currentStage = await page.$('.current-stage');
                if (currentStage) {
                    console.log('   ✅ 現在の段階が強調表示されています');
                }
                
                // 段階数の確認
                const stageItems = await page.$$('.stage-item');
                console.log(`   発展段階数: ${stageItems.length}個`);
            } else {
                console.log('⚠️ 6爻発展段階セクション: 表示されていません');
            }
            
            // ComprehensiveReportセクションの確認
            const reportSection = await page.$('.comprehensive-report-section');
            if (reportSection) {
                console.log('✅ 包括的分析レポート: 表示されています');
            } else {
                console.log('⚠️ 包括的分析レポート: 表示されていません');
            }
        } else {
            console.log('⚠️ 洞察タブが見つかりません');
        }
        
        console.log('');
        
        // 4. 全体的なチェック
        console.log('4️⃣ 全体チェック');
        console.log('================================');
        
        // TripleOSInteractionAnalyzerの存在確認
        const hasAnalyzer = await page.evaluate(() => {
            return typeof window.TripleOSInteractionAnalyzer !== 'undefined';
        });
        console.log(`TripleOSInteractionAnalyzer: ${hasAnalyzer ? '✅ 存在' : '❌ 不在'}`);
        
        // StorageManagerの存在確認
        const hasStorageManager = await page.evaluate(() => {
            return typeof window.StorageManager !== 'undefined';
        });
        console.log(`StorageManager: ${hasStorageManager ? '✅ 存在' : '❌ 不在'}`);
        
        // HexagramExtractorの存在確認
        const hasHexagramExtractor = await page.evaluate(() => {
            return typeof window.HexagramExtractor !== 'undefined';
        });
        console.log(`HexagramExtractor: ${hasHexagramExtractor ? '✅ 存在' : '❌ 不在'}`);
        
        // ComprehensiveReportGeneratorの存在確認
        const hasReportGenerator = await page.evaluate(() => {
            return typeof window.ComprehensiveReportGenerator !== 'undefined';
        });
        console.log(`ComprehensiveReportGenerator: ${hasReportGenerator ? '✅ 存在' : '❌ 不在'}`);
        
        // スクリーンショットを撮影
        await page.screenshot({ path: 'implementation-check-final.png', fullPage: true });
        console.log('\n📸 スクリーンショット保存: implementation-check-final.png');
        
    } catch (error) {
        console.error('❌ エラー発生:', error.message);
    } finally {
        await browser.close();
        console.log('\n✅ チェック完了');
    }
})();