const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    console.log('🚀 HAQEI実装チェック開始\n');
    
    try {
        // ページを開く
        await page.goto('http://localhost:8000/public/results.html');
        await page.waitForTimeout(2000);
        
        console.log('📋 ページ読み込み完了\n');
        
        // 1. BasicResultsTabのチェック
        console.log('1️⃣ BasicResultsTab チェック');
        console.log('================================');
        
        // 基本タブをクリック
        const basicTab = await page.$('button[data-tab="basic"]');
        if (basicTab) {
            await basicTab.click();
            await page.waitForTimeout(1000);
        }
        
        // Triple OSカードの確認
        const osCards = await page.$$('.haqei-os-card');
        console.log(`✅ Triple OSカード数: ${osCards.length}個`);
        
        // 履歴比較セクションの確認
        const historicalComparison = await page.$('.historical-comparison-section');
        if (historicalComparison) {
            const comparisonText = await historicalComparison.textContent();
            console.log('✅ 履歴比較セクション: 表示されています');
            console.log(`   内容: ${comparisonText.substring(0, 50)}...`);
        } else {
            console.log('⚠️ 履歴比較セクション: 表示されていません（初回分析の可能性）');
        }
        
        // 日本語説明の確認
        const osNames = await page.$$eval('.haqei-os-name', elements => 
            elements.map(el => el.textContent)
        );
        console.log(`✅ OS名: ${osNames.join(', ')}`);
        
        console.log('');
        
        // 2. DetailedAnalysisTabのチェック
        console.log('2️⃣ DetailedAnalysisTab チェック');
        console.log('================================');
        
        // 詳細分析タブをクリック
        const detailedTab = await page.$('button[data-tab="detailed-analysis"]');
        if (detailedTab) {
            await detailedTab.click();
            await page.waitForTimeout(1000);
        }
        
        // 相互作用セクションの確認
        const interactionSection = await page.$('.interaction-details-section');
        if (interactionSection) {
            console.log('✅ 相互作用分析セクション: 表示されています');
            
            // シナジー項目の確認
            const synergyItems = await page.$$('.synergy-item');
            console.log(`✅ シナジー項目数: ${synergyItems.length}個`);
            
            // シナジー値の取得
            const synergyValues = await page.$$eval('.synergy-item span:last-child', 
                elements => elements.map(el => el.textContent)
            );
            console.log(`   シナジー値: ${synergyValues.join(', ')}`);
        } else {
            console.log('❌ 相互作用分析セクション: 表示されていません');
        }
        
        console.log('');
        
        // 3. InsightsTabのチェック
        console.log('3️⃣ InsightsTab チェック');
        console.log('================================');
        
        // 洞察タブをクリック
        const insightsTab = await page.$('button[data-tab="insights"]');
        if (insightsTab) {
            await insightsTab.click();
            await page.waitForTimeout(1000);
        }
        
        // 6爻発展段階セクションの確認
        const developmentSection = await page.$('.development-stages-section');
        if (developmentSection) {
            console.log('✅ 6爻発展段階セクション: 表示されています');
            
            // 現在の段階の確認
            const currentStage = await page.$('.current-stage');
            if (currentStage) {
                const stageText = await currentStage.textContent();
                console.log(`✅ 現在の段階が強調表示されています`);
                console.log(`   ${stageText.substring(0, 30)}...`);
            } else {
                console.log('⚠️ 現在の段階の強調表示が見つかりません');
            }
            
            // 段階数の確認
            const stageItems = await page.$$('.stage-item');
            console.log(`✅ 発展段階数: ${stageItems.length}個`);
        } else {
            console.log('⚠️ 6爻発展段階セクション: 表示されていません');
        }
        
        // ComprehensiveReportセクションの確認
        const reportSection = await page.$('.comprehensive-report-section');
        if (reportSection) {
            console.log('✅ 包括的分析レポート: 表示されています');
            
            // 品質指標の確認
            const qualityMetrics = await page.$('.quality-metrics-card');
            if (qualityMetrics) {
                console.log('   ✅ 品質指標カード: あり');
            }
        } else {
            console.log('⚠️ 包括的分析レポート: 表示されていません');
        }
        
        console.log('');
        
        // 4. 全体的なチェック
        console.log('4️⃣ 全体チェック');
        console.log('================================');
        
        // コンソールエラーの確認
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });
        
        await page.waitForTimeout(1000);
        
        if (consoleErrors.length > 0) {
            console.log('❌ コンソールエラー:');
            consoleErrors.forEach(error => console.log(`   - ${error}`));
        } else {
            console.log('✅ コンソールエラー: なし');
        }
        
        // TripleOSInteractionAnalyzerの存在確認
        const hasAnalyzer = await page.evaluate(() => {
            return typeof window.TripleOSInteractionAnalyzer !== 'undefined';
        });
        console.log(`✅ TripleOSInteractionAnalyzer: ${hasAnalyzer ? '存在' : '不在'}`);
        
        // StorageManagerの存在確認
        const hasStorageManager = await page.evaluate(() => {
            return typeof window.StorageManager !== 'undefined';
        });
        console.log(`✅ StorageManager: ${hasStorageManager ? '存在' : '不在'}`);
        
        // スクリーンショットを撮影
        await page.screenshot({ path: 'implementation-check.png', fullPage: true });
        console.log('\n📸 スクリーンショット保存: implementation-check.png');
        
    } catch (error) {
        console.error('❌ エラー発生:', error.message);
    } finally {
        await browser.close();
        console.log('\n✅ チェック完了');
    }
})();