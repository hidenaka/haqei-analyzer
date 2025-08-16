import { chromium } from 'playwright';

/**
 * 🎯 保存機能の修正確認テスト
 */

async function testSaveFix() {
    console.log('🎯 保存機能の修正確認テスト開始\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 50  // 速く実行
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // コンソールメッセージ監視
        const consoleLogs = [];
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('Option clicked') || text.includes('selectOption') || 
                text.includes('saveAnswer') || text.includes('criticalCSSAnalyzer')) {
                consoleLogs.push(text);
                console.log(`[LOG] ${text}`);
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
        console.log('\n📝 36問に回答中...\n');
        const savedQuestions = [];
        const failedQuestions = [];
        
        for (let i = 1; i <= 36; i++) {
            // 選択肢をクリック
            const optionIndex = i % 5;
            const options = await page.locator('.option').all();
            if (options[optionIndex]) {
                await options[optionIndex].click();
            } else {
                await page.locator('.option').first().click();
            }
            await page.waitForTimeout(50);
            
            // 保存状態を確認
            const saveStatus = await page.evaluate((questionIndex) => {
                const analyzer = window.criticalCSSAnalyzer || window.currentAnalyzer;
                if (!analyzer || !analyzer.state) return { saved: false, error: 'No analyzer' };
                
                const answer = analyzer.state.answers[questionIndex - 1];
                return {
                    saved: !!answer,
                    hasOption: answer?.selectedOption ? true : false,
                    questionId: answer?.id || answer?.questionId
                };
            }, i);
            
            if (saveStatus.saved && saveStatus.hasOption) {
                savedQuestions.push(i);
                if (i % 6 === 0) {
                    console.log(`✅ 質問${i}まで保存成功 (${savedQuestions.length}/36)`);
                }
            } else {
                failedQuestions.push(i);
                console.log(`❌ 質問${i}の保存失敗`);
            }
            
            // 次へボタン
            if (i < 36) {
                const nextBtn = page.locator('#next-btn');
                const isEnabled = await nextBtn.isEnabled();
                if (!isEnabled) {
                    console.log(`⚠️ 質問${i}で次ボタンが無効`);
                    // 強制的に有効化
                    await page.evaluate(() => {
                        const btn = document.getElementById('next-btn');
                        if (btn) {
                            btn.disabled = false;
                            btn.click();
                        }
                    });
                } else {
                    await nextBtn.click();
                }
                await page.waitForTimeout(50);
            }
        }
        
        // 4. 最終結果確認
        console.log('\n📊 最終結果確認...\n');
        
        const finalResult = await page.evaluate(() => {
            const analyzer = window.criticalCSSAnalyzer || window.currentAnalyzer;
            if (!analyzer || !analyzer.state || !analyzer.state.answers) {
                return { error: 'No analyzer or state' };
            }
            
            const answers = analyzer.state.answers;
            let validCount = 0;
            const missingIndexes = [];
            
            for (let i = 0; i < 36; i++) {
                if (answers[i] && answers[i].selectedOption) {
                    validCount++;
                } else {
                    missingIndexes.push(i + 1);
                }
            }
            
            return {
                totalAnswers: answers.length,
                validAnswers: validCount,
                missingQuestions: missingIndexes
            };
        });
        
        console.log('=== テスト結果 ===');
        console.log(`✅ 保存成功: ${savedQuestions.length}/36`);
        console.log(`❌ 保存失敗: ${failedQuestions.length}/36`);
        
        if (finalResult.error) {
            console.log(`\n❌ エラー: ${finalResult.error}`);
        } else {
            console.log(`\n📋 最終確認:`);
            console.log(`  配列長: ${finalResult.totalAnswers}`);
            console.log(`  有効回答: ${finalResult.validAnswers}/36`);
            if (finalResult.missingQuestions.length > 0) {
                console.log(`  欠損質問: [${finalResult.missingQuestions.join(', ')}]`);
            }
        }
        
        if (failedQuestions.length > 0) {
            console.log(`\n❌ 保存失敗した質問: [${failedQuestions.join(', ')}]`);
        }
        
        // 「分析する」ボタンをクリック
        console.log('\n🔄 分析開始...');
        await page.locator('#next-btn').click();
        await page.waitForTimeout(5000);
        
        // 結果画面の確認
        const resultsVisible = await page.locator('#results-screen').isVisible();
        console.log(`\n結果画面表示: ${resultsVisible ? '✅ 成功' : '❌ 失敗'}`);
        
        // スクリーンショット
        await page.screenshot({ 
            path: 'save_fix_test_20250816.png',
            fullPage: false 
        });
        
        return {
            savedCount: savedQuestions.length,
            failedCount: failedQuestions.length,
            resultsVisible,
            finalResult
        };
        
    } catch (error) {
        console.error('❌ テストエラー:', error.message);
        return { error: error.message };
    } finally {
        await browser.close();
    }
}

// 実行
testSaveFix()
    .then(result => {
        console.log('\n' + '='.repeat(50));
        if (result.savedCount === 36) {
            console.log('🎉 全36問の保存に成功しました！');
        } else if (result.savedCount >= 33) {
            console.log(`⚠️ ${result.savedCount}/36問の保存成功（改善されました）`);
        } else {
            console.log(`❌ ${result.savedCount}/36問しか保存されませんでした`);
        }
        console.log('='.repeat(50));
    })
    .catch(error => {
        console.error('❌ 致命的エラー:', error);
    });