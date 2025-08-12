/**
 * Playwrightを使用したos_analyzer.html統合テスト
 */

const { chromium } = require('playwright');

(async () => {
    console.log('🚀 Playwright統合テスト開始');
    
    // ブラウザ起動
    const browser = await chromium.launch({
        headless: false, // ブラウザを表示
        slowMo: 500 // 動作を見やすくするため遅延追加
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // 1. テストページを開く
        console.log('📄 test-os-analyzer-integration.html を開く');
        await page.goto('file:///Users/hideakimacbookair/Desktop/haqei-analyzer/test-os-analyzer-integration.html');
        await page.waitForTimeout(2000);
        
        // 2. スクリプト読み込み状況を確認
        console.log('📚 スクリプト読み込み状況確認');
        const loadStatus = await page.evaluate(() => {
            const status = {
                H384_DATA: typeof H384_DATA !== 'undefined',
                ExpressionGenerator: typeof ExpressionGenerator !== 'undefined',
                KeywordAnalyzer: typeof KeywordAnalyzer !== 'undefined',
                TripleOSInteractionAnalyzer: typeof TripleOSInteractionAnalyzer !== 'undefined'
            };
            return status;
        });
        
        console.log('  ✅ H384_DATA:', loadStatus.H384_DATA ? '読み込み成功' : '❌ 読み込み失敗');
        console.log('  ✅ ExpressionGenerator:', loadStatus.ExpressionGenerator ? '読み込み成功' : '❌ 読み込み失敗');
        console.log('  ✅ KeywordAnalyzer:', loadStatus.KeywordAnalyzer ? '読み込み成功' : '❌ 読み込み失敗');
        console.log('  ✅ TripleOSInteractionAnalyzer:', loadStatus.TripleOSInteractionAnalyzer ? '読み込み成功' : '❌ 読み込み失敗');
        
        // 3. 分析テスト実行
        console.log('\n🔬 分析テスト実行');
        await page.click('button:has-text("分析テスト実行")');
        await page.waitForTimeout(1000);
        
        const analyzerResult = await page.textContent('#analyzerResult');
        if (analyzerResult.includes('分析成功')) {
            console.log('  ✅ TripleOSInteractionAnalyzer分析成功');
        } else {
            console.log('  ❌ 分析失敗:', analyzerResult.substring(0, 100));
        }
        
        // 4. 表現生成テスト
        console.log('\n✏️ 表現生成テスト');
        await page.click('button:has-text("表現生成テスト")');
        await page.waitForTimeout(1000);
        
        const expressionResult = await page.textContent('#expressionResult');
        if (expressionResult.includes('生成された表現')) {
            console.log('  ✅ 表現生成成功');
            const expression = await page.locator('#expressionResult p').textContent();
            console.log('  生成内容:', expression.substring(0, 50) + '...');
        } else {
            console.log('  ❌ 表現生成失敗');
        }
        
        // 5. 統合テスト
        console.log('\n🔗 統合テスト実行');
        await page.click('button:has-text("統合テスト実行")');
        await page.waitForTimeout(1000);
        
        const integrationResult = await page.textContent('#integrationResult');
        if (integrationResult.includes('統合テスト成功')) {
            console.log('  ✅ 統合テスト成功');
        } else {
            console.log('  ❌ 統合テスト失敗');
        }
        
        // 6. os_analyzer.htmlのテスト
        console.log('\n📊 os_analyzer.html を開く');
        await page.goto('file:///Users/hideakimacbookair/Desktop/haqei-analyzer/os_analyzer.html');
        await page.waitForTimeout(2000);
        
        // TripleOSInteractionAnalyzerが読み込まれているか確認
        const osAnalyzerStatus = await page.evaluate(() => {
            return typeof TripleOSInteractionAnalyzer !== 'undefined';
        });
        
        if (osAnalyzerStatus) {
            console.log('  ✅ os_analyzer.htmlでTripleOSInteractionAnalyzer利用可能');
        } else {
            console.log('  ❌ os_analyzer.htmlでTripleOSInteractionAnalyzer未読み込み');
        }
        
        // コンソールログ確認
        page.on('console', msg => {
            if (msg.text().includes('TripleOS分析結果')) {
                console.log('  ✅ TripleOS分析が実行されました');
            }
        });
        
        // 質問に回答して分析を実行
        console.log('\n🎯 質問回答して分析実行');
        const firstQuestion = await page.locator('.question-card').first();
        if (await firstQuestion.isVisible()) {
            // 最初の質問に回答
            await page.click('.question-card:first-child .option:first-child');
            console.log('  ✅ 質問1に回答');
            
            // スクロールして他の質問にも回答（簡易的に）
            for (let i = 2; i <= 5; i++) {
                const selector = `.question-card:nth-child(${i}) .option:first-child`;
                if (await page.locator(selector).isVisible()) {
                    await page.click(selector);
                    console.log(`  ✅ 質問${i}に回答`);
                    await page.waitForTimeout(500);
                }
            }
        }
        
        // スクリーンショット保存
        await page.screenshot({ 
            path: 'test-os-analyzer-result.png',
            fullPage: false
        });
        console.log('\n📸 スクリーンショット保存: test-os-analyzer-result.png');
        
        console.log('\n✅ 全テスト完了');
        
    } catch (error) {
        console.error('❌ テスト中にエラー発生:', error);
    } finally {
        await browser.close();
        console.log('🔚 ブラウザを閉じました');
    }
})();