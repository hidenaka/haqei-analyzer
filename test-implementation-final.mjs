import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    console.log('🚀 HAQEI実装チェック - os_analyzer.html\n');
    
    try {
        // os_analyzer.htmlを開く（完全な実装がある）
        console.log('📌 os_analyzer.htmlを開いています...');
        await page.goto('http://localhost:8000/public/os_analyzer.html');
        await page.waitForTimeout(3000);
        
        const title = await page.title();
        console.log(`📄 ページタイトル: ${title}\n`);
        
        // 利用可能なクラスを確認
        const availableClasses = await page.evaluate(() => {
            const classes = {};
            classes.StorageManager = typeof StorageManager !== 'undefined';
            classes.TripleOSInteractionAnalyzer = typeof TripleOSInteractionAnalyzer !== 'undefined';
            classes.HexagramExtractor = typeof HexagramExtractor !== 'undefined';
            classes.ComprehensiveReportGenerator = typeof ComprehensiveReportGenerator !== 'undefined';
            classes.BasicResultsTab = typeof BasicResultsTab !== 'undefined';
            classes.DetailedAnalysisTab = typeof DetailedAnalysisTab !== 'undefined';
            classes.InsightsTab = typeof InsightsTab !== 'undefined';
            return classes;
        });
        
        console.log('🔧 クラスの実装状況:');
        console.log('================================');
        Object.entries(availableClasses).forEach(([cls, exists]) => {
            console.log(`${exists ? '✅' : '❌'} ${cls}: ${exists ? '実装済み' : '未実装'}`);
        });
        console.log('');
        
        // results.htmlも確認
        console.log('📌 results.htmlを開いています...');
        await page.goto('http://localhost:8000/public/results.html');
        await page.waitForTimeout(2000);
        
        const resultsTitle = await page.title();
        console.log(`📄 results.html タイトル: ${resultsTitle}\n`);
        
        // resultsページでのクラス実装状況
        const resultsClasses = await page.evaluate(() => {
            const classes = {};
            classes.StorageManager = typeof StorageManager !== 'undefined';
            classes.TripleOSInteractionAnalyzer = typeof TripleOSInteractionAnalyzer !== 'undefined';
            classes.HexagramExtractor = typeof HexagramExtractor !== 'undefined';
            classes.ComprehensiveReportGenerator = typeof ComprehensiveReportGenerator !== 'undefined';
            classes.BasicResultsTab = typeof BasicResultsTab !== 'undefined';
            classes.DetailedAnalysisTab = typeof DetailedAnalysisTab !== 'undefined';
            classes.InsightsTab = typeof InsightsTab !== 'undefined';
            return classes;
        });
        
        console.log('🔧 results.htmlでのクラス実装状況:');
        console.log('================================');
        Object.entries(resultsClasses).forEach(([cls, exists]) => {
            console.log(`${exists ? '✅' : '❌'} ${cls}: ${exists ? '実装済み' : '未実装'}`);
        });
        console.log('');
        
        // タブの存在確認
        const tabs = await page.$$('[data-tab]');
        if (tabs.length > 0) {
            const tabNames = await page.$$eval('[data-tab]', elements => 
                elements.map(el => el.getAttribute('data-tab'))
            );
            console.log(`📑 タブ構成: ${tabNames.join(', ')}`);
        } else {
            console.log('📑 タブが見つかりません');
        }
        
        // コンポーネントの確認
        console.log('\n📊 実装確認結果サマリー');
        console.log('================================');
        
        // 必須クラスの実装状況
        const essentialClasses = [
            'TripleOSInteractionAnalyzer',
            'StorageManager',
            'HexagramExtractor',
            'ComprehensiveReportGenerator'
        ];
        
        essentialClasses.forEach(cls => {
            const osAnalyzerHas = availableClasses[cls];
            const resultsHas = resultsClasses[cls];
            
            if (osAnalyzerHas && resultsHas) {
                console.log(`✅ ${cls}: 両方のページで実装済み`);
            } else if (osAnalyzerHas && !resultsHas) {
                console.log(`⚠️ ${cls}: os_analyzerのみ実装（results.htmlに未実装）`);
            } else if (!osAnalyzerHas && resultsHas) {
                console.log(`⚠️ ${cls}: results.htmlのみ実装`);
            } else {
                console.log(`❌ ${cls}: 両方のページで未実装`);
            }
        });
        
        // スクリーンショット保存
        await page.goto('http://localhost:8000/public/os_analyzer.html');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'os-analyzer-check.png', fullPage: false });
        
        await page.goto('http://localhost:8000/public/results.html');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'results-check.png', fullPage: false });
        
        console.log('\n📸 スクリーンショット保存完了');
        console.log('   - os-analyzer-check.png');
        console.log('   - results-check.png');
        
    } catch (error) {
        console.error('❌ エラー発生:', error.message);
    } finally {
        await browser.close();
        console.log('\n✅ チェック完了');
    }
})();