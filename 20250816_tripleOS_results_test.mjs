// 緊急修正要求: TripleOS結果表示テスト
// CTO指示: DOM要素修正後の動作確認

import { test } from '@playwright/test';

test('TripleOS結果が表示されるかテスト', async ({ page }) => {
    console.log('🔍 TripleOS結果表示の緊急テスト開始');
    
    // ページを開く
    await page.goto('http://localhost:8788/os_analyzer.html');
    
    // コンソールログを監視
    const logs = [];
    page.on('console', msg => {
        logs.push(msg.text());
        console.log(`[BROWSER]: ${msg.text()}`);
    });
    
    // Step1: 分析開始ボタンをクリック
    console.log('🚀 分析開始ボタンをクリック...');
    const startBtn = page.locator('#start-btn');
    await startBtn.waitFor({ timeout: 10000 });
    await startBtn.click();
    
    // Step2: 質問ページの確認
    console.log('📝 質問ページの確認...');
    const questionCard = page.locator('.card.question-card').first();
    await questionCard.waitFor({ timeout: 10000 });
    
    // Step2: 質問に答える (36問全てに答えて分析開始)
    console.log('🎯 質問に回答中... (36問)');
    for (let i = 0; i < 36; i++) {
        try {
            // 質問が表示されるまで待機
            const option = page.locator('.option').first();
            await option.waitFor({ timeout: 5000 });
            await option.click();
            await page.waitForTimeout(100);
            
            // 最後の質問でない場合は次へ進む
            if (i < 35) {
                const nextBtn = page.locator('#next-btn');
                await nextBtn.waitFor({ timeout: 5000 });
                await nextBtn.click();
                await page.waitForTimeout(200);
            } else {
                // 最後の質問では分析開始ボタンをクリック
                const analyzeBtn = page.locator('#analyze-btn');
                await analyzeBtn.waitFor({ timeout: 5000 });
                await analyzeBtn.click();
                console.log('🔬 分析開始ボタンをクリック');
                break;
            }
        } catch (error) {
            console.log(`⚠️ 質問 ${i + 1} で問題発生: ${error.message}`);
            break;
        }
    }
    
    // Step3: 結果画面に遷移するまで待機
    console.log('⏳ 結果画面遷移を待機...');
    const resultsScreen = page.locator('#results-screen');
    await resultsScreen.waitFor({ timeout: 30000 });
    
    // Step4: DOM要素の存在確認
    console.log('🔍 DOM要素の確認...');
    
    // 修正した要素の確認
    const summaryView = page.locator('#summary-view');
    const osCardsContainer = page.locator('#os-cards-container'); 
    const unifiedResults = page.locator('#os-analyzer-unified-results');
    
    console.log('📋 要素の存在チェック:');
    console.log(`- summary-view: ${await summaryView.count()}`);
    console.log(`- os-cards-container: ${await osCardsContainer.count()}`);
    console.log(`- os-analyzer-unified-results: ${await unifiedResults.count()}`);
    
    // Step5: state.tripleOSResultsの確認
    console.log('💾 state.tripleOSResults確認...');
    const stateCheck = await page.evaluate(() => {
        // criticalCSSAnalyzerのstateを確認
        if (window.criticalCSSAnalyzer && window.criticalCSSAnalyzer.state) {
            return {
                tripleOSResults: window.criticalCSSAnalyzer.state.tripleOSResults,
                hasState: true,
                stateKeys: Object.keys(window.criticalCSSAnalyzer.state)
            };
        }
        return { hasState: false };
    });
    
    console.log('📊 State確認結果:', JSON.stringify(stateCheck, null, 2));
    
    // Step6: 実際のコンテンツが表示されているかチェック
    console.log('🎨 表示コンテンツ確認...');
    const summaryContent = await summaryView.textContent();
    const osCardsContent = await osCardsContainer.textContent();
    
    console.log(`- Summary内容: "${summaryContent}"`);
    console.log(`- OSCards内容: "${osCardsContent}"`);
    
    // Step7: N/A表示のチェック（これが問題）
    const hasNADisplays = summaryContent?.includes('N/A') || osCardsContent?.includes('N/A');
    console.log(`🚨 N/A表示問題: ${hasNADisplays ? 'あり（要修正）' : 'なし（正常）'}`);
    
    // 結果レポート
    console.log('\n📋 緊急テスト結果:');
    console.log(`✅ DOM要素修正: ${await osCardsContainer.count() > 0 ? '成功' : '失敗'}`);
    console.log(`💾 State保存: ${stateCheck.tripleOSResults ? '成功' : '失敗'}`);
    console.log(`🎨 コンテンツ表示: ${summaryContent || osCardsContent ? '成功' : '失敗'}`);
    console.log(`❌ N/A問題: ${hasNADisplays ? '存在（要修正）' : '解決済み'}`);
    
    // スクリーンショット保存
    await page.screenshot({ 
        path: `20250816_tripleOS_results_test_${Date.now()}.png`,
        fullPage: false 
    });
    
    console.log('🏁 緊急テスト完了');
});