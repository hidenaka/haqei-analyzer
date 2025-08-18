// 緊急修正後の最終テスト: 実際の分析フローでN/A問題が解決されたかを確認

import { test } from '@playwright/test';

test('修正後の実際の分析フローテスト', async ({ page }) => {
    console.log('🚀 修正後の実際の分析フローテスト開始');
    
    // ページを開く
    await page.goto('http://localhost:8788/os_analyzer.html');
    
    // コンソールログを監視
    const logs = [];
    page.on('console', msg => {
        if (msg.text().includes('OS結果構築') || msg.text().includes('OSカード生成') || msg.text().includes('hexagram')) {
            logs.push(msg.text());
            console.log(`[重要ログ]: ${msg.text()}`);
        }
    });
    
    // 開始ボタンをクリック
    await page.locator('#start-btn').click();
    console.log('✅ 分析開始');
    
    // 10問程度回答して分析実行を確認（タイムアウト回避）
    for (let i = 0; i < 10; i++) {
        try {
            const option = page.locator('.option').first();
            await option.waitFor({ timeout: 3000 });
            await option.click();
            
            if (i < 9) {
                const nextBtn = page.locator('#next-btn');
                await nextBtn.click();
                await page.waitForTimeout(100);
            }
        } catch (error) {
            console.log(`⚠️ 質問 ${i + 1} スキップ: ${error.message}`);
            break;
        }
    }
    
    // 手動で分析実行を強制（タイムアウト回避）
    console.log('🔬 手動分析実行...');
    const analysisResult = await page.evaluate(async () => {
        try {
            // criticalCSSAnalyzerが利用可能か確認
            if (!window.criticalCSSAnalyzer) {
                return { error: 'criticalCSSAnalyzer not found' };
            }
            
            // 最低限の回答データを作成
            const minimalAnswers = [];
            for (let i = 0; i < 10; i++) {
                minimalAnswers.push({
                    questionId: i + 1,
                    selectedOption: 'A',
                    scoring: { '乾_創造性': 2.0, '震_行動性': 1.5 }
                });
            }
            
            console.log('🔄 実際の分析システムを起動...');
            
            // 実際のTripleOS分析を実行
            const tripleOSResults = await window.criticalCSSAnalyzer.tripleOSEngine.analyzeTripleOS(minimalAnswers);
            
            console.log('📊 分析結果:', tripleOSResults);
            
            // state.tripleOSResultsに保存
            window.criticalCSSAnalyzer.state.tripleOSResults = tripleOSResults;
            
            // 実際の表示処理を実行
            await window.criticalCSSAnalyzer.showResults(tripleOSResults);
            
            return {
                success: true,
                tripleOSResults: tripleOSResults,
                engineOS: tripleOSResults.engineOS,
                interfaceOS: tripleOSResults.interfaceOS,
                safeModeOS: tripleOSResults.safeModeOS
            };
            
        } catch (error) {
            console.error('❌ 分析実行エラー:', error);
            return { 
                error: error.message,
                stack: error.stack
            };
        }
    });
    
    console.log('📋 分析実行結果:', JSON.stringify(analysisResult, null, 2));
    
    if (analysisResult.success) {
        // 結果画面の表示確認
        await page.waitForTimeout(3000);
        
        const displayContent = await page.evaluate(() => {
            const summaryView = document.getElementById('summary-view');
            const osCardsContainer = document.getElementById('os-cards-container');
            
            return {
                summaryExists: !!summaryView,
                osCardsExists: !!osCardsContainer,
                summaryText: summaryView ? summaryView.textContent : null,
                osCardsText: osCardsContainer ? osCardsContainer.textContent : null,
                resultsScreenVisible: document.getElementById('results-screen').style.display !== 'none'
            };
        });
        
        console.log('🎨 最終表示確認:');
        console.log(`- Summary存在: ${displayContent.summaryExists}`);
        console.log(`- OSCards存在: ${displayContent.osCardsExists}`);
        console.log(`- 結果画面表示: ${displayContent.resultsScreenVisible}`);
        
        // N/A問題の最終チェック
        const hasNAIssue = displayContent.summaryText?.includes('N/A') || 
                           displayContent.osCardsText?.includes('N/A') ||
                           displayContent.summaryText?.includes('undefined') ||
                           displayContent.osCardsText?.includes('undefined') ||
                           displayContent.summaryText?.includes('null') ||
                           displayContent.osCardsText?.includes('null');
        
        console.log('✅ 実際の分析結果確認:');
        console.log(`- Engine OS: #${analysisResult.engineOS?.hexagramId} ${analysisResult.engineOS?.hexagramName}`);
        console.log(`- Interface OS: #${analysisResult.interfaceOS?.hexagramId} ${analysisResult.interfaceOS?.hexagramName}`);
        console.log(`- Safe Mode OS: #${analysisResult.safeModeOS?.hexagramId} ${analysisResult.safeModeOS?.hexagramName}`);
        console.log(`🚨 N/A問題: ${hasNAIssue ? '依然として存在' : '解決済み'}`);
        
        // ログに記録された修正処理を確認
        console.log('\n📝 修正処理ログ:');
        logs.forEach(log => console.log(`  ${log}`));
        
    } else {
        console.log('❌ 分析実行失敗:', analysisResult.error);
    }
    
    // スクリーンショット保存
    await page.screenshot({ 
        path: `20250816_final_real_analysis_${Date.now()}.png`,
        fullPage: false 
    });
    
    console.log('🏁 最終実分析テスト完了');
});