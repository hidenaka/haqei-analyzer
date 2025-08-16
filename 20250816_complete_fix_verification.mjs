// 完全修正検証: 全ての修正が統合されて動作するかを確認

import { test } from '@playwright/test';

test('完全修正検証テスト', async ({ page }) => {
    console.log('🎯 完全修正検証テスト開始');
    
    // ページを開く
    await page.goto('http://localhost:8788/os_analyzer.html');
    
    // 重要なログを監視
    page.on('console', msg => {
        if (msg.text().includes('結果画面') || msg.text().includes('OS結果構築') || msg.text().includes('OSカード生成')) {
            console.log(`[修正ログ]: ${msg.text()}`);
        }
    });
    
    // 開始ボタンをクリック
    await page.locator('#start-btn').click();
    
    // 最低限の回答を提供
    for (let i = 0; i < 8; i++) {
        const option = page.locator('.option').first();
        await option.waitFor({ timeout: 3000 });
        await option.click();
        
        if (i < 7) {
            const nextBtn = page.locator('#next-btn');
            await nextBtn.click();
            await page.waitForTimeout(100);
        }
    }
    
    // 修正された分析システムを実行
    const finalResult = await page.evaluate(async () => {
        try {
            // 最低限のテストデータで分析実行
            const testAnswers = [];
            for (let i = 0; i < 15; i++) {
                testAnswers.push({
                    questionId: i + 1,
                    selectedOption: i % 4 === 0 ? 'A' : i % 4 === 1 ? 'B' : i % 4 === 2 ? 'C' : 'D',
                    scoring: { 
                        '乾_創造性': Math.random() * 2, 
                        '震_行動性': Math.random() * 2,
                        '兌_調和性': Math.random() * 2,
                        '坎_探求性': Math.random() * 2
                    }
                });
            }
            
            console.log('🚀 修正済み分析システム実行中...');
            
            // 修正済みの分析フローを実行
            const tripleOSResults = await window.criticalCSSAnalyzer.tripleOSEngine.analyzeTripleOS(testAnswers);
            
            // state保存
            window.criticalCSSAnalyzer.state.tripleOSResults = tripleOSResults;
            
            // 修正済みのshowResultsを実行
            await window.criticalCSSAnalyzer.showResults(tripleOSResults);
            
            // 結果を待機
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 表示内容を確認
            const summaryView = document.getElementById('summary-view');
            const osCardsContainer = document.getElementById('os-cards-container');
            const resultsScreen = document.getElementById('results-screen');
            
            const summaryText = summaryView ? summaryView.textContent : '';
            const osCardsText = osCardsContainer ? osCardsContainer.textContent : '';
            
            // N/A問題の最終確認
            const hasNAIssue = summaryText.includes('N/A') || 
                               osCardsText.includes('N/A') ||
                               summaryText.includes('undefined') ||
                               osCardsText.includes('undefined') ||
                               summaryText.includes('null') ||
                               osCardsText.includes('null');
            
            return {
                success: true,
                tripleOSResults: tripleOSResults,
                displayStatus: {
                    resultsScreenActive: resultsScreen.classList.contains('active'),
                    resultsScreenDisplay: resultsScreen.style.display,
                    summaryExists: !!summaryView,
                    osCardsExists: !!osCardsContainer,
                    summaryHasContent: summaryText.length > 0,
                    osCardsHasContent: osCardsText.length > 0
                },
                engineOSData: {
                    hexagramId: tripleOSResults.engineOS?.hexagramId,
                    hexagramName: tripleOSResults.engineOS?.hexagramName
                },
                interfaceOSData: {
                    hexagramId: tripleOSResults.interfaceOS?.hexagramId,
                    hexagramName: tripleOSResults.interfaceOS?.hexagramName
                },
                safeModeOSData: {
                    hexagramId: tripleOSResults.safeModeOS?.hexagramId,
                    hexagramName: tripleOSResults.safeModeOS?.hexagramName
                },
                naIssueResolved: !hasNAIssue,
                summarySnippet: summaryText.substring(0, 200),
                osCardsSnippet: osCardsText.substring(0, 200)
            };
            
        } catch (error) {
            return { error: error.message, stack: error.stack };
        }
    });
    
    console.log('\n📋 完全修正検証結果:');
    
    if (finalResult.success) {
        console.log('✅ 分析システム: 正常動作');
        console.log(`✅ 結果画面表示: ${finalResult.displayStatus.resultsScreenActive ? '成功' : '失敗'}`);
        console.log(`✅ Summary表示: ${finalResult.displayStatus.summaryHasContent ? '成功' : '失敗'}`);
        console.log(`✅ OSCards表示: ${finalResult.displayStatus.osCardsHasContent ? '成功' : '失敗'}`);
        console.log(`✅ N/A問題解決: ${finalResult.naIssueResolved ? '成功' : '失敗'}`);
        
        console.log('\n🎨 実際の表示データ:');
        console.log(`- Engine OS: #${finalResult.engineOSData.hexagramId} ${finalResult.engineOSData.hexagramName}`);
        console.log(`- Interface OS: #${finalResult.interfaceOSData.hexagramId} ${finalResult.interfaceOSData.hexagramName}`);
        console.log(`- Safe Mode OS: #${finalResult.safeModeOSData.hexagramId} ${finalResult.safeModeOSData.hexagramName}`);
        
        console.log('\n📄 表示内容サンプル:');
        console.log(`Summary: "${finalResult.summarySnippet}"`);
        console.log(`OSCards: "${finalResult.osCardsSnippet}"`);
        
        // 最終判定
        const allSuccess = finalResult.displayStatus.resultsScreenActive &&
                          finalResult.displayStatus.summaryHasContent &&
                          finalResult.displayStatus.osCardsHasContent &&
                          finalResult.naIssueResolved;
        
        console.log(`\n🏆 最終結果: ${allSuccess ? '全修正完了・成功' : '一部修正必要'}`);
        
    } else {
        console.log('❌ システムエラー:', finalResult.error);
    }
    
    // 最終スクリーンショット
    await page.screenshot({ 
        path: `20250816_complete_fix_verification_${Date.now()}.png`,
        fullPage: false 
    });
    
    console.log('🏁 完全修正検証テスト完了');
});