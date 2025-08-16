import { chromium } from 'playwright';

/**
 * 🔍 33/36問題の詳細調査 - なぜ3問が保存されないのか
 */

async function investigateMissingAnswers() {
    console.log('🔍 33/36問題の詳細調査開始\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 500  // ゆっくり実行して観察
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        const saveErrors = [];
        const clickEvents = [];
        const stateChanges = [];
        
        // コンソールメッセージを詳細に監視
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('saveAnswer') || text.includes('Failed to save') || 
                text.includes('currentQuestion') || text.includes('Missing questions')) {
                console.log(`[CONSOLE] ${text}`);
            }
        });
        
        // 1. ページロード
        console.log('📡 ページロード...');
        await page.goto('http://localhost:8788/os_analyzer.html');
        await page.waitForTimeout(2000);
        
        // 2. 分析開始
        console.log('🖱️ 分析開始...\n');
        await page.locator('#start-btn').click();
        await page.waitForTimeout(1000);
        
        // 3. 各質問で詳細な状態を記録
        console.log('📝 各質問の詳細な状態を記録中...\n');
        const questionStates = [];
        
        for (let i = 1; i <= 36; i++) {
            // 現在の質問番号を取得
            const questionNumber = await page.locator('#question-number').textContent();
            const questionText = await page.locator('#question-title').textContent();
            
            console.log(`質問 ${questionNumber}: ${questionText.substring(0, 30)}...`);
            
            // 選択前の状態を記録
            const beforeState = await page.evaluate(() => {
                const analyzer = window.currentAnalyzer || window.OSAnalyzer;
                if (analyzer && analyzer.state) {
                    return {
                        currentQuestion: analyzer.state.currentQuestion,
                        answersLength: analyzer.state.answers ? analyzer.state.answers.length : 0,
                        answersKeys: analyzer.state.answers ? Object.keys(analyzer.state.answers).length : 0
                    };
                }
                return null;
            });
            
            // 選択肢をクリック
            await page.locator('.option').first().click();
            await page.waitForTimeout(300);
            
            // 選択後の状態を記録
            const afterState = await page.evaluate(() => {
                const analyzer = window.currentAnalyzer || window.OSAnalyzer;
                if (analyzer && analyzer.state) {
                    const answers = analyzer.state.answers;
                    const currentQ = analyzer.state.currentQuestion;
                    
                    // 現在の質問の回答が保存されているか確認
                    const currentAnswerSaved = answers && answers[currentQ] && answers[currentQ].selectedOption;
                    
                    return {
                        currentQuestion: currentQ,
                        answersLength: answers ? answers.length : 0,
                        answersKeys: answers ? Object.keys(answers).length : 0,
                        currentAnswerSaved: !!currentAnswerSaved,
                        lastAnswer: answers && answers[currentQ] ? {
                            index: currentQ,
                            hasOption: !!answers[currentQ].selectedOption
                        } : null
                    };
                }
                return null;
            });
            
            // 状態変化を記録
            questionStates.push({
                questionNumber: i,
                displayNumber: questionNumber,
                beforeState,
                afterState,
                saved: afterState?.currentAnswerSaved || false
            });
            
            // 保存されなかった場合は詳細を表示
            if (!afterState?.currentAnswerSaved) {
                console.log(`  ❌ 質問${i}の回答が保存されていません！`);
                console.log(`     Before: ${JSON.stringify(beforeState)}`);
                console.log(`     After: ${JSON.stringify(afterState)}`);
            } else {
                console.log(`  ✅ 保存成功`);
            }
            
            // 次へボタンの状態確認
            const nextBtn = page.locator('#next-btn');
            const isEnabled = await nextBtn.isEnabled();
            console.log(`  次ボタン: ${isEnabled ? '有効' : '無効'}`);
            
            // 次へ進む
            if (i < 36) {
                if (isEnabled) {
                    await nextBtn.click();
                } else {
                    console.log('  ⚠️ 次ボタンが無効なので強制クリック');
                    await page.evaluate(() => {
                        const btn = document.getElementById('next-btn');
                        if (btn) {
                            btn.disabled = false;
                            btn.click();
                        }
                    });
                }
                await page.waitForTimeout(500);
            }
            
            console.log('');
        }
        
        // 4. 最終的な回答データを確認
        console.log('\n📊 最終的な回答データ分析...\n');
        
        const finalAnalysis = await page.evaluate(() => {
            const analyzer = window.currentAnalyzer || window.OSAnalyzer;
            if (!analyzer || !analyzer.state || !analyzer.state.answers) {
                return { error: 'No analyzer or state found' };
            }
            
            const answers = analyzer.state.answers;
            const analysis = {
                totalSlots: answers.length,
                filledSlots: 0,
                emptySlots: [],
                validAnswers: [],
                invalidAnswers: []
            };
            
            // 各スロットを確認
            for (let i = 0; i < 36; i++) {
                if (answers[i]) {
                    if (answers[i].selectedOption) {
                        analysis.filledSlots++;
                        analysis.validAnswers.push(i);
                    } else {
                        analysis.invalidAnswers.push({
                            index: i,
                            data: answers[i]
                        });
                    }
                } else {
                    analysis.emptySlots.push(i);
                }
            }
            
            return analysis;
        });
        
        console.log('=== 最終分析結果 ===');
        console.log(`配列の長さ: ${finalAnalysis.totalSlots}`);
        console.log(`有効な回答: ${finalAnalysis.filledSlots}/36`);
        console.log(`空のスロット: ${finalAnalysis.emptySlots.length}個`);
        if (finalAnalysis.emptySlots.length > 0) {
            console.log(`  空のインデックス: [${finalAnalysis.emptySlots.join(', ')}]`);
        }
        console.log(`無効な回答: ${finalAnalysis.invalidAnswers.length}個`);
        if (finalAnalysis.invalidAnswers.length > 0) {
            console.log('  無効な回答の詳細:');
            finalAnalysis.invalidAnswers.forEach(inv => {
                console.log(`    質問${inv.index + 1}: ${JSON.stringify(inv.data)}`);
            });
        }
        
        // 5. 問題のパターンを分析
        console.log('\n🔍 問題のパターン分析...\n');
        
        const missingQuestions = questionStates.filter(q => !q.saved);
        if (missingQuestions.length > 0) {
            console.log(`保存されなかった質問: ${missingQuestions.length}個`);
            missingQuestions.forEach(q => {
                console.log(`  質問${q.questionNumber} (表示: ${q.displayNumber})`);
            });
            
            // パターンを探す
            const missingNumbers = missingQuestions.map(q => q.questionNumber);
            console.log(`\n欠損パターン: [${missingNumbers.join(', ')}]`);
            
            // 連続しているか確認
            const isConsecutive = missingNumbers.every((num, i) => {
                if (i === 0) return true;
                return num === missingNumbers[i - 1] + 1;
            });
            
            if (isConsecutive) {
                console.log('⚠️ 連続した質問が欠損しています');
            }
            
            // 特定の範囲に集中しているか
            const min = Math.min(...missingNumbers);
            const max = Math.max(...missingNumbers);
            if (max - min <= 5) {
                console.log(`⚠️ 質問${min}〜${max}の範囲に集中しています`);
            }
        }
        
        // スクリーンショット
        await page.screenshot({ 
            path: 'investigation_result_20250816.png',
            fullPage: false 
        });
        
        return {
            questionStates,
            finalAnalysis,
            missingQuestions
        };
        
    } catch (error) {
        console.error('❌ 調査エラー:', error);
        return { error: error.message };
    } finally {
        console.log('\n⚠️ ブラウザは開いたままです。手動で確認してください。');
    }
}

// 実行
investigateMissingAnswers()
    .then(result => {
        console.log('\n' + '='.repeat(50));
        console.log('📋 調査完了');
        
        if (result.missingQuestions && result.missingQuestions.length > 0) {
            console.log(`\n❌ ${result.missingQuestions.length}個の質問で回答が保存されていません`);
            console.log('詳細は上記のログを確認してください');
        } else if (!result.error) {
            console.log('\n✅ すべての質問で回答が保存されています');
        }
        
        console.log('='.repeat(50));
    })
    .catch(error => {
        console.error('❌ 致命的エラー:', error);
    });