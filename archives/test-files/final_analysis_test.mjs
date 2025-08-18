import { chromium } from 'playwright';

/**
 * 🎯 最終分析機能テスト
 */

async function finalAnalysisTest() {
    console.log('🎯 最終分析機能テスト\n');
    console.log('=' .repeat(60));
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 30
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // エラーと成功ログを監視
        const errorLogs = [];
        const successLogs = [];
        
        page.on('console', msg => {
            const text = msg.text();
            if (msg.type() === 'error' || text.includes('❌') || text.includes('Error')) {
                errorLogs.push(text);
                if (!text.includes('Permissions-Policy') && !text.includes('404')) {
                    console.log(`[ERROR] ${text}`);
                }
            } else if (text.includes('✅') || text.includes('strength') || text.includes('percentage') || 
                      text.includes('ExpressionGenerator') || text.includes('TripleOSInteractionAnalyzer')) {
                successLogs.push(text);
                console.log(`[SUCCESS] ${text}`);
            }
        });
        
        console.log('【最終動作確認】');
        
        // 1. ページロード
        console.log('\n📡 ページロード...');
        await page.goto('http://localhost:8788/os_analyzer.html');
        await page.waitForTimeout(2000);
        
        // 2. 分析開始
        console.log('🖱️ 分析開始...');
        await page.locator('#start-btn').click();
        await page.waitForTimeout(500);
        
        // 3. バランスの良い回答パターン
        console.log('\n📝 多様な回答パターンで36問回答...');
        const answerPattern = ['A', 'B', 'C', 'D', 'E', 'A', 'C', 'E', 'B', 'D', 'A', 'E'];
        
        for (let i = 0; i < 36; i++) {
            const answer = answerPattern[i % answerPattern.length];
            await page.locator(`input[value="${answer}"]`).first().click();
            await page.waitForTimeout(15);
            if (i < 35) {
                await page.locator('#next-btn').click();
                await page.waitForTimeout(15);
            }
        }
        
        console.log('✅ 36問回答完了');
        
        // 4. 分析実行
        console.log('\n🔄 分析実行...');
        await page.locator('#next-btn').click();
        console.log('⏳ Triple OS分析処理中...');
        await page.waitForTimeout(8000);
        
        // 5. 結果確認
        console.log('\n📊 結果確認...');
        
        const finalResults = await page.evaluate(() => {
            const results = {
                osCards: [],
                hasVisibleResults: false,
                internalData: null
            };
            
            // DOM表示の確認
            const cards = document.querySelectorAll('.os-card, .os-result-card');
            results.hasVisibleResults = cards.length > 0;
            
            cards.forEach(card => {
                const name = card.querySelector('.os-name, .card-title, h3')?.textContent?.trim();
                const percentage = card.querySelector('.os-percentage, .percentage, .strength, .os-strength')?.textContent?.trim();
                const hexagram = card.querySelector('.os-hexagram-info span')?.textContent?.trim();
                const hexagramName = card.querySelectorAll('.os-hexagram-info span')[1]?.textContent?.trim();
                
                if (name) {
                    results.osCards.push({
                        name,
                        percentage: percentage || 'N/A',
                        hexagram: hexagram || 'N/A',
                        hexagramName: hexagramName || 'N/A',
                        hasRealData: percentage && percentage !== 'N/A' && percentage !== '0%' && !percentage.includes('undefined')
                    });
                }
            });
            
            // 内部データの確認
            const analyzer = window.criticalCSSAnalyzer;
            if (analyzer?.state?.tripleOSResults) {
                const tos = analyzer.state.tripleOSResults;
                results.internalData = {
                    engineOS: {
                        strength: tos.engineOS?.strength || 0,
                        percentage: tos.engineOS?.percentage || 0,
                        hexagramId: tos.engineOS?.hexagramId || 0,
                        hexagramName: tos.engineOS?.hexagramName || 'N/A'
                    },
                    interfaceOS: {
                        strength: tos.interfaceOS?.strength || 0,
                        percentage: tos.interfaceOS?.percentage || 0,
                        hexagramId: tos.interfaceOS?.hexagramId || 0,
                        hexagramName: tos.interfaceOS?.hexagramName || 'N/A'
                    },
                    safeModeOS: {
                        strength: tos.safeModeOS?.strength || 0,
                        percentage: tos.safeModeOS?.percentage || 0,
                        hexagramId: tos.safeModeOS?.hexagramId || 0,
                        hexagramName: tos.safeModeOS?.hexagramName || 'N/A'
                    }
                };
            }
            
            return results;
        });
        
        // 6. 結果表示と判定
        console.log('\n=== 最終結果 ===');
        
        // エラー集計
        const criticalErrors = errorLogs.filter(err => 
            !err.includes('Permissions-Policy') && 
            !err.includes('404') && 
            !err.includes('Error handling system initialized')
        );
        
        console.log(`重要なエラー数: ${criticalErrors.length}`);
        if (criticalErrors.length > 0) {
            console.log('重要なエラー:');
            criticalErrors.forEach(err => console.log(`  • ${err}`));
        }
        
        // DOM結果
        console.log(`\nTriple OSカード表示: ${finalResults.osCards.length}枚`);
        finalResults.osCards.forEach(card => {
            console.log(`  ${card.name}:`);
            console.log(`    強度: ${card.percentage}`);
            console.log(`    易卦: ${card.hexagram} ${card.hexagramName}`);
            console.log(`    実データ: ${card.hasRealData ? '✅ あり' : '❌ なし'}`);
        });
        
        // 内部データ
        if (finalResults.internalData) {
            console.log('\n内部分析データ:');
            Object.entries(finalResults.internalData).forEach(([osType, data]) => {
                console.log(`  ${osType}:`);
                console.log(`    強度: ${data.strength} | パーセンテージ: ${data.percentage}%`);
                console.log(`    易卦: ${data.hexagramId} ${data.hexagramName}`);
            });
        }
        
        // 最終判定
        const hasRealDOMData = finalResults.osCards.some(card => card.hasRealData);
        const hasRealInternalData = finalResults.internalData && 
            Object.values(finalResults.internalData).some(data => data.strength > 0);
        
        console.log('\n=== 最終判定 ===');
        console.log(`分析エンジン動作: ${criticalErrors.length === 0 ? '✅ 正常' : '❌ エラー'}`);
        console.log(`結果画面表示: ${finalResults.hasVisibleResults ? '✅ 成功' : '❌ 失敗'}`);
        console.log(`実データ計算: ${hasRealInternalData ? '✅ 成功' : '❌ 失敗'}`);
        console.log(`DOM実データ表示: ${hasRealDOMData ? '✅ 成功' : '❌ 失敗'}`);
        
        if (criticalErrors.length === 0 && hasRealInternalData) {
            console.log('\n🎉 完全成功！実際の分析計算が動作しています！');
        } else if (criticalErrors.length === 0) {
            console.log('\n⚠️ エラーは解決しましたが、まだ実データ表示に課題があります');
        } else {
            console.log('\n❌ まだ分析エンジンにエラーが残っています');
        }
        
        // スクリーンショット
        await page.screenshot({ 
            path: 'final_analysis_test_20250816.png',
            fullPage: false 
        });
        
        return {
            criticalErrorCount: criticalErrors.length,
            hasVisibleResults: finalResults.hasVisibleResults,
            hasRealInternalData,
            hasRealDOMData,
            osCards: finalResults.osCards,
            internalData: finalResults.internalData
        };
        
    } catch (error) {
        console.error('❌ テストエラー:', error.message);
        return { error: error.message };
    } finally {
        console.log('\n📸 スクリーンショット: final_analysis_test_20250816.png');
        console.log('⚠️ ブラウザは開いたままです。10秒後に閉じます...');
        await page.waitForTimeout(10000);
        await browser.close();
    }
}

// 実行
finalAnalysisTest()
    .then(result => {
        console.log('\n' + '=' .repeat(60));
        console.log('🏁 最終テスト完了');
        console.log('=' .repeat(60));
        
        if (!result.error && result.criticalErrorCount === 0 && result.hasRealInternalData) {
            console.log('\n🎊 大成功！分析機能が完全に動作しています！');
        } else if (!result.error && result.criticalErrorCount === 0) {
            console.log('\n✅ エラーは解決済み。実データ表示の最終調整が必要です。');
        }
    })
    .catch(error => {
        console.error('❌ 致命的エラー:', error);
    });