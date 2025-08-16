// 緊急デバッグ: データ構造確認とN/A問題の根本原因特定

import { test } from '@playwright/test';

test('データ構造とN/A問題のデバッグ', async ({ page }) => {
    console.log('🔍 データ構造デバッグテスト開始');
    
    // ページを開く
    await page.goto('http://localhost:8788/os_analyzer.html');
    
    // コンソールログを監視
    page.on('console', msg => {
        console.log(`[BROWSER]: ${msg.text()}`);
    });
    
    // 開始ボタンをクリック
    await page.locator('#start-btn').click();
    
    // 3問だけ答えて分析システムを部分的に起動
    for (let i = 0; i < 3; i++) {
        const option = page.locator('.option').first();
        await option.waitFor({ timeout: 5000 });
        await option.click();
        
        if (i < 2) {
            const nextBtn = page.locator('#next-btn');
            await nextBtn.click();
            await page.waitForTimeout(200);
        }
    }
    
    // JavaScriptで直接分析システムを起動してデータ構造を確認
    const dataStructureCheck = await page.evaluate(async () => {
        console.log('🔬 手動分析システム起動とデータ構造確認');
        
        // criticalCSSAnalyzerが利用可能か確認
        if (!window.criticalCSSAnalyzer) {
            return { error: 'criticalCSSAnalyzer not found' };
        }
        
        // 仮のTripleOSResultsを作成してテスト
        const fakeTripleOSResults = {
            engineOS: {
                hexagramId: 1,
                hexagramName: '乾為天',
                description: 'テスト用Engine OS',
                baguaEnergies: { '乾': 80, '兌': 60, '離': 40 }
            },
            interfaceOS: {
                hexagramId: 2,
                hexagramName: '坤為地', 
                description: 'テスト用Interface OS',
                baguaEnergies: { '坤': 75, '巽': 55, '震': 35 }
            },
            safeModeOS: {
                hexagramId: 29,
                hexagramName: '坎為水',
                description: 'テスト用Safe Mode OS',
                baguaEnergies: { '坎': 70, '艮': 50, '離': 30 }
            }
        };
        
        try {
            // state.tripleOSResultsに手動で設定
            window.criticalCSSAnalyzer.state.tripleOSResults = fakeTripleOSResults;
            
            // generateOnePagerSummaryを手動実行
            const summary = window.criticalCSSAnalyzer.generateOnePagerSummary(fakeTripleOSResults);
            
            // renderOnePagerSummaryを手動実行
            const summaryHTML = window.criticalCSSAnalyzer.renderOnePagerSummary(summary);
            
            // DOM要素に直接挿入して表示テスト
            const summaryView = document.getElementById('summary-view');
            const osCardsContainer = document.getElementById('os-cards-container');
            
            if (summaryView) {
                summaryView.innerHTML = summaryHTML;
            }
            
            if (osCardsContainer) {
                // createEnhancedOSCardも手動テスト
                osCardsContainer.innerHTML = '';
                const engineCard = window.criticalCSSAnalyzer.createEnhancedOSCard('Engine OS', fakeTripleOSResults.engineOS, '#6366f1');
                const interfaceCard = window.criticalCSSAnalyzer.createEnhancedOSCard('Interface OS', fakeTripleOSResults.interfaceOS, '#8b5cf6');
                const safeModeCard = window.criticalCSSAnalyzer.createEnhancedOSCard('Safe Mode OS', fakeTripleOSResults.safeModeOS, '#10b981');
                
                osCardsContainer.appendChild(engineCard);
                osCardsContainer.appendChild(interfaceCard);
                osCardsContainer.appendChild(safeModeCard);
            }
            
            return {
                success: true,
                summary: summary,
                summaryMainType: summary.mainType,
                stateTripleOSResults: window.criticalCSSAnalyzer.state.tripleOSResults,
                domElementsFound: {
                    summaryView: !!summaryView,
                    osCardsContainer: !!osCardsContainer
                }
            };
            
        } catch (error) {
            return { 
                error: error.message,
                stack: error.stack
            };
        }
    });
    
    console.log('📊 データ構造確認結果:', JSON.stringify(dataStructureCheck, null, 2));
    
    // 結果画面に強制遷移
    await page.evaluate(() => {
        if (window.criticalCSSAnalyzer && window.criticalCSSAnalyzer.showScreen) {
            window.criticalCSSAnalyzer.showScreen('results-screen');
        }
    });
    
    await page.waitForTimeout(2000);
    
    // 表示内容の確認
    const displayCheck = await page.evaluate(() => {
        const summaryView = document.getElementById('summary-view');
        const osCardsContainer = document.getElementById('os-cards-container');
        
        return {
            summaryContent: summaryView ? summaryView.textContent : null,
            osCardsContent: osCardsContainer ? osCardsContainer.textContent : null,
            summaryHTML: summaryView ? summaryView.innerHTML.substring(0, 500) : null,
            osCardsHTML: osCardsContainer ? osCardsContainer.innerHTML.substring(0, 500) : null
        };
    });
    
    console.log('🎨 表示内容確認:');
    console.log('Summary:', displayCheck.summaryContent);
    console.log('OSCards:', displayCheck.osCardsContent);
    
    // N/A問題のチェック
    const hasNAIssue = displayCheck.summaryContent?.includes('N/A') || 
                       displayCheck.osCardsContent?.includes('N/A') ||
                       displayCheck.summaryContent?.includes('undefined') ||
                       displayCheck.osCardsContent?.includes('undefined');
    
    console.log(`🚨 N/A問題: ${hasNAIssue ? '発見（要修正）' : '検出されず'}`);
    
    // スクリーンショット保存
    await page.screenshot({ 
        path: `20250816_data_structure_debug_${Date.now()}.png`,
        fullPage: false 
    });
    
    console.log('🏁 データ構造デバッグ完了');
});