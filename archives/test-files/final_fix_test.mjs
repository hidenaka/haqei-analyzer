import { chromium } from 'playwright';

/**
 * 🎯 最終修正確認テスト
 */

async function finalFixTest() {
    console.log('🎯 最終修正確認テスト開始\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 30
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // コンソール監視
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('Answer saved to criticalCSSAnalyzer')) {
                console.log(`[✅ FIXED] ${text}`);
            }
        });
        
        // 1. ページロード
        console.log('📡 ページロード...');
        await page.goto('http://localhost:8788/os_analyzer.html');
        await page.waitForTimeout(2000);
        
        // 2. 分析開始
        console.log('🖱️ 分析開始...');
        await page.locator('#start-btn').click();
        await page.waitForTimeout(500);
        
        // 3. 全36問に回答
        console.log('\n📝 36問に高速回答中...\n');
        let savedCount = 0;
        let failedCount = 0;
        const failedQuestions = [];
        
        for (let i = 0; i < 36; i++) {
            // radioボタンを選択
            const optionValue = ['A', 'B', 'C', 'D', 'E'][i % 5];
            await page.locator(`input[value="${optionValue}"]`).first().click();
            await page.waitForTimeout(30);
            
            // 保存状態を確認
            const saved = await page.evaluate((index) => {
                const analyzer = window.criticalCSSAnalyzer;
                if (!analyzer || !analyzer.state || !analyzer.state.answers) return false;
                return !!analyzer.state.answers[index];
            }, i);
            
            if (saved) {
                savedCount++;
            } else {
                failedCount++;
                failedQuestions.push(i + 1);
            }
            
            // 次へボタン
            if (i < 35) {
                const nextBtn = page.locator('#next-btn');
                if (await nextBtn.isEnabled()) {
                    await nextBtn.click();
                } else {
                    // 強制クリック
                    await page.evaluate(() => {
                        const btn = document.getElementById('next-btn');
                        if (btn) {
                            btn.disabled = false;
                            btn.click();
                        }
                    });
                }
                await page.waitForTimeout(30);
            }
            
            if ((i + 1) % 9 === 0) {
                console.log(`  進捗: ${i + 1}/36 (保存: ${savedCount}, 失敗: ${failedCount})`);
            }
        }
        
        // 4. 最終確認
        console.log('\n📊 最終確認...');
        const finalState = await page.evaluate(() => {
            const analyzer = window.criticalCSSAnalyzer;
            if (!analyzer || !analyzer.state || !analyzer.state.answers) {
                return { error: 'No analyzer or state' };
            }
            
            const answers = analyzer.state.answers;
            let validCount = 0;
            const missing = [];
            
            for (let i = 0; i < 36; i++) {
                if (answers[i] && answers[i].selectedOption) {
                    validCount++;
                } else {
                    missing.push(i + 1);
                }
            }
            
            return {
                totalAnswers: answers.length,
                validCount,
                missingQuestions: missing,
                sampleAnswer: answers[0]
            };
        });
        
        console.log('\n=== テスト結果 ===');
        console.log(`✅ 保存成功: ${savedCount}/36`);
        console.log(`❌ 保存失敗: ${failedCount}/36`);
        
        if (finalState.error) {
            console.log(`\n❌ エラー: ${finalState.error}`);
        } else {
            console.log(`\n📋 最終状態:`);
            console.log(`  配列長: ${finalState.totalAnswers}`);
            console.log(`  有効回答: ${finalState.validCount}/36`);
            if (finalState.missingQuestions.length > 0) {
                console.log(`  欠損質問: [${finalState.missingQuestions.join(', ')}]`);
            }
            if (finalState.sampleAnswer) {
                console.log(`\n  回答例（質問1）:`, JSON.stringify(finalState.sampleAnswer, null, 2));
            }
        }
        
        // 5. 分析実行
        console.log('\n🔄 分析実行...');
        await page.locator('#next-btn').click();
        await page.waitForTimeout(5000);
        
        // 6. 結果画面確認
        const resultsVisible = await page.locator('#results-screen').isVisible();
        const osCards = await page.locator('.os-card, .os-result-card').count();
        
        console.log(`\n結果画面: ${resultsVisible ? '✅ 表示' : '❌ 非表示'}`);
        console.log(`OSカード: ${osCards}枚表示`);
        
        // スクリーンショット
        await page.screenshot({ 
            path: 'final_fix_result_20250816.png',
            fullPage: false 
        });
        
        return {
            savedCount,
            failedCount,
            finalState,
            resultsVisible,
            osCards
        };
        
    } catch (error) {
        console.error('❌ テストエラー:', error.message);
        return { error: error.message };
    } finally {
        await browser.close();
    }
}

// 実行
finalFixTest()
    .then(result => {
        console.log('\n' + '='.repeat(50));
        if (result.savedCount === 36) {
            console.log('🎉 完璧！全36問の保存に成功しました！');
        } else if (result.savedCount >= 33) {
            console.log(`✅ 良好: ${result.savedCount}/36問の保存成功`);
        } else {
            console.log(`❌ 問題あり: ${result.savedCount}/36問しか保存されませんでした`);
        }
        
        if (result.resultsVisible && result.osCards === 3) {
            console.log('✅ Triple OS分析結果も正常に表示されています');
        }
        
        console.log('='.repeat(50));
    })
    .catch(error => {
        console.error('❌ 致命的エラー:', error);
    });