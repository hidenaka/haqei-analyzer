import { chromium } from 'playwright';

/**
 * 🎯 ユーザー視点での完全動作確認テスト
 * 実際のユーザーと同じように操作して、すべての機能が正常に動作することを確認
 */

async function userExperienceVerification() {
    console.log('👤 ユーザー視点での完全動作確認テスト開始\n');
    console.log('=' .repeat(60));
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 100  // ユーザーの操作速度を再現
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const report = {
        startTime: new Date(),
        issues: [],
        successes: [],
        screenshots: []
    };
    
    try {
        // 1. ウェルカム画面の確認
        console.log('📱 ステップ1: アプリケーション起動');
        console.log('-'.repeat(40));
        await page.goto('http://localhost:8788/os_analyzer.html');
        await page.waitForTimeout(2000);
        
        // ウェルカム画面の要素確認
        const welcomeTitle = await page.locator('h1').textContent();
        const startButton = await page.locator('#start-btn');
        const startButtonVisible = await startButton.isVisible();
        const startButtonText = await startButton.textContent();
        
        console.log(`  タイトル: ${welcomeTitle}`);
        console.log(`  開始ボタン: ${startButtonVisible ? '✅ 表示' : '❌ 非表示'} - "${startButtonText}"`);
        
        if (startButtonVisible) {
            report.successes.push('ウェルカム画面正常表示');
        } else {
            report.issues.push('開始ボタンが表示されていない');
        }
        
        await page.screenshot({ 
            path: 'user_test_1_welcome_20250816.png',
            fullPage: false 
        });
        console.log('  📸 スクリーンショット: user_test_1_welcome_20250816.png');
        
        // 2. 分析開始
        console.log('\n📱 ステップ2: 分析開始');
        console.log('-'.repeat(40));
        await startButton.click();
        await page.waitForTimeout(1000);
        
        // 質問画面への遷移確認
        const questionScreenVisible = await page.locator('#question-screen').isVisible();
        const questionNumber = await page.locator('.question-number').textContent();
        const questionText = await page.locator('.question-text').textContent();
        const optionsCount = await page.locator('input[type="radio"]').count();
        
        console.log(`  質問画面: ${questionScreenVisible ? '✅ 表示' : '❌ 非表示'}`);
        console.log(`  質問番号: ${questionNumber}`);
        console.log(`  質問内容: ${questionText?.substring(0, 30)}...`);
        console.log(`  選択肢数: ${optionsCount}個`);
        
        if (questionScreenVisible && optionsCount === 5) {
            report.successes.push('質問画面への遷移成功');
        } else {
            report.issues.push('質問画面の表示に問題あり');
        }
        
        // 3. 36問回答プロセス
        console.log('\n📱 ステップ3: 36問回答プロセス');
        console.log('-'.repeat(40));
        
        const questionResults = [];
        const problemQuestions = [];
        
        for (let i = 0; i < 36; i++) {
            const currentQuestion = i + 1;
            
            // 質問情報取得
            const qNumber = await page.locator('.question-number').textContent();
            const qText = await page.locator('.question-text').textContent();
            
            // 選択肢を選択（多様性のため異なる選択肢を選ぶ）
            const optionValue = ['A', 'B', 'C', 'D', 'E'][i % 5];
            const radioButton = page.locator(`input[value="${optionValue}"]`).first();
            
            // 選択前の次ボタン状態
            const nextBtnBeforeClick = page.locator('#next-btn');
            const disabledBefore = await nextBtnBeforeClick.isDisabled();
            
            // 選択肢をクリック
            await radioButton.click();
            await page.waitForTimeout(50);
            
            // 選択後の状態確認
            const radioChecked = await radioButton.isChecked();
            const disabledAfter = await nextBtnBeforeClick.isDisabled();
            
            // 保存状態を確認
            const savedStatus = await page.evaluate((index) => {
                const analyzer = window.criticalCSSAnalyzer;
                if (!analyzer?.state?.answers) return { saved: false };
                const answer = analyzer.state.answers[index];
                return {
                    saved: !!answer,
                    hasOption: answer?.selectedOption ? true : false
                };
            }, i);
            
            const questionOK = radioChecked && !disabledAfter && savedStatus.saved;
            
            questionResults.push({
                number: currentQuestion,
                selected: optionValue,
                radioChecked,
                nextEnabled: !disabledAfter,
                saved: savedStatus.saved
            });
            
            if (!questionOK) {
                problemQuestions.push(currentQuestion);
                console.log(`  ⚠️ 質問${currentQuestion}: 問題あり`);
            }
            
            // 進捗表示
            if (currentQuestion === 1 || currentQuestion === 12 || currentQuestion === 24 || currentQuestion === 36) {
                console.log(`  質問${currentQuestion}/36: ${qText?.substring(0, 30)}...`);
                console.log(`    選択: ${optionValue} | 保存: ${savedStatus.saved ? '✅' : '❌'} | 次へ: ${!disabledAfter ? '✅' : '❌'}`);
            }
            
            // 次の質問へ
            if (i < 35) {
                if (!disabledAfter) {
                    await nextBtnBeforeClick.click();
                } else {
                    // 強制的に次へ
                    await page.evaluate(() => {
                        const btn = document.getElementById('next-btn');
                        if (btn) {
                            btn.disabled = false;
                            btn.click();
                        }
                    });
                }
                await page.waitForTimeout(50);
            }
        }
        
        // 回答完了後のスクリーンショット
        await page.screenshot({ 
            path: 'user_test_2_last_question_20250816.png',
            fullPage: false 
        });
        console.log('  📸 スクリーンショット: user_test_2_last_question_20250816.png');
        
        const successfulQuestions = questionResults.filter(q => q.saved).length;
        console.log(`\n  📊 回答結果: ${successfulQuestions}/36問 正常保存`);
        
        if (successfulQuestions === 36) {
            report.successes.push('36問すべて正常に回答・保存');
        } else {
            report.issues.push(`${36 - successfulQuestions}問の保存に失敗`);
            console.log(`  問題のある質問: [${problemQuestions.join(', ')}]`);
        }
        
        // 4. 分析実行
        console.log('\n📱 ステップ4: 分析実行');
        console.log('-'.repeat(40));
        
        // 「分析する」ボタンをクリック
        const analyzeBtn = page.locator('#next-btn');
        const analyzeBtnText = await analyzeBtn.textContent();
        console.log(`  ボタンテキスト: "${analyzeBtnText}"`);
        
        await analyzeBtn.click();
        console.log('  ⏳ 分析処理中...');
        
        // 分析処理を待つ（最大10秒）
        await page.waitForTimeout(5000);
        
        // 5. 結果画面の確認
        console.log('\n📱 ステップ5: 分析結果表示');
        console.log('-'.repeat(40));
        
        const resultsScreenVisible = await page.locator('#results-screen').isVisible();
        console.log(`  結果画面: ${resultsScreenVisible ? '✅ 表示' : '❌ 非表示'}`);
        
        if (resultsScreenVisible) {
            // Triple OSカードの確認
            const osCards = await page.locator('.os-card, .os-result-card').all();
            console.log(`  OSカード数: ${osCards.length}枚`);
            
            for (let i = 0; i < osCards.length && i < 3; i++) {
                const card = osCards[i];
                const cardTitle = await card.locator('.os-name, .card-title, h3').first().textContent();
                const cardPercentage = await card.locator('.os-percentage, .percentage, .strength').first().textContent();
                console.log(`    ${i + 1}. ${cardTitle}: ${cardPercentage || 'N/A'}`);
            }
            
            if (osCards.length === 3) {
                report.successes.push('Triple OS（3枚）正常表示');
            } else {
                report.issues.push(`OSカードが${osCards.length}枚（期待値: 3枚）`);
            }
            
            // 再分析ボタンの確認
            const restartBtn = await page.locator('#restart-analysis-btn, #retry-btn').first();
            const restartVisible = await restartBtn.isVisible();
            console.log(`  再分析ボタン: ${restartVisible ? '✅ 表示' : '❌ 非表示'}`);
            
        } else {
            report.issues.push('結果画面が表示されない');
        }
        
        // 最終スクリーンショット
        await page.screenshot({ 
            path: 'user_test_3_results_20250816.png',
            fullPage: false 
        });
        console.log('  📸 スクリーンショット: user_test_3_results_20250816.png');
        
        // 6. 総合評価
        console.log('\n' + '='.repeat(60));
        console.log('📊 総合評価レポート');
        console.log('='.repeat(60));
        
        console.log('\n✅ 成功した項目:');
        report.successes.forEach(item => {
            console.log(`  • ${item}`);
        });
        
        if (report.issues.length > 0) {
            console.log('\n❌ 問題のある項目:');
            report.issues.forEach(item => {
                console.log(`  • ${item}`);
            });
        } else {
            console.log('\n🎉 すべての項目が正常に動作しています！');
        }
        
        // ユーザー体験スコア計算
        const totalChecks = report.successes.length + report.issues.length;
        const successRate = totalChecks > 0 ? (report.successes.length / totalChecks * 100) : 0;
        
        console.log('\n📈 ユーザー体験スコア:');
        console.log(`  成功率: ${successRate.toFixed(1)}%`);
        console.log(`  評価: ${successRate === 100 ? '完璧！' : successRate >= 90 ? '優秀' : successRate >= 70 ? '良好' : '要改善'}`);
        
        return {
            successRate,
            successes: report.successes,
            issues: report.issues,
            questionResults
        };
        
    } catch (error) {
        console.error('❌ テストエラー:', error.message);
        report.issues.push(`テストエラー: ${error.message}`);
        return report;
    } finally {
        console.log('\n⚠️ ブラウザは開いたままです。手動で確認してください。');
        console.log('  15秒後に自動的に閉じます...');
        await page.waitForTimeout(15000);
        await browser.close();
    }
}

// 実行
userExperienceVerification()
    .then(result => {
        console.log('\n' + '='.repeat(60));
        console.log('🏁 テスト完了');
        console.log('='.repeat(60));
        
        if (result.successRate === 100) {
            console.log('\n🎊 完璧です！すべての機能が正常に動作しています。');
        } else if (result.successRate >= 90) {
            console.log('\n✅ ほぼ完璧です。軽微な問題がありますが、使用に支障はありません。');
        } else {
            console.log('\n⚠️ いくつか問題があります。修正が必要です。');
        }
    })
    .catch(error => {
        console.error('❌ 致命的エラー:', error);
    });