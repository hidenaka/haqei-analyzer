/**
 * OS Analyzer 36問自動回答スクリプト
 * テスト用：36問を高速で回答して結果画面まで到達させる
 */

async function autoComplete36Questions() {
    console.log('🚀 Starting 36 questions auto-complete...');
    
    let completedCount = 0;
    const maxQuestions = 36;
    const results = [];
    
    try {
        for (let i = 0; i < maxQuestions; i++) {
            console.log(`📝 Processing question ${i + 1}/${maxQuestions}`);
            
            // Step 1: 選択肢を選ぶ
            const radios = document.querySelectorAll('input[type="radio"]:not(:checked)');
            
            if (radios.length > 0) {
                // OS別に異なる傾向で選択（テスト用）
                let selectedIndex = 0;
                
                if (i < 12) {
                    // Engine OS (Q1-12): 創造性・革新性重視
                    selectedIndex = 0; // 最初の選択肢
                } else if (i < 24) {
                    // Interface OS (Q13-24): バランス重視
                    selectedIndex = Math.floor(radios.length / 2); // 中間の選択肢
                } else {
                    // Safe Mode OS (Q25-36): 安定性重視
                    selectedIndex = radios.length - 1; // 最後の選択肢
                }
                
                // 選択肢をクリック
                radios[Math.min(selectedIndex, radios.length - 1)].click();
                results.push(`Q${i+1}: Option ${selectedIndex + 1}`);
                
                // 選択の反映を待つ
                await new Promise(resolve => setTimeout(resolve, 100));
            } else {
                console.warn(`⚠️ No radio buttons found for question ${i + 1}`);
            }
            
            // Step 2: 次へボタンを探してクリック
            const nextBtn = document.getElementById('next-btn');
            const allButtons = document.querySelectorAll('button:not(:disabled)');
            
            let buttonClicked = false;
            
            // 優先順位: next-btn > 「次」を含むボタン > 「分析」を含むボタン
            if (nextBtn && !nextBtn.disabled) {
                nextBtn.click();
                buttonClicked = true;
                completedCount++;
            } else {
                // 他のボタンを探す
                for (const btn of allButtons) {
                    const btnText = btn.textContent || '';
                    
                    if (btnText.includes('次') && !btn.disabled) {
                        btn.click();
                        buttonClicked = true;
                        completedCount++;
                        break;
                    } else if ((btnText.includes('分析') || btnText.includes('完了')) && !btn.disabled) {
                        console.log('📊 Final question reached, starting analysis...');
                        btn.click();
                        buttonClicked = true;
                        completedCount++;
                        
                        // 分析処理の完了を待つ
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        // 結果画面に到達したか確認
                        const resultsSection = document.getElementById('results-section');
                        if (resultsSection) {
                            console.log('✅ Results section found!');
                            return {
                                success: true,
                                completedQuestions: completedCount,
                                message: 'Successfully completed all questions and reached results'
                            };
                        }
                    }
                }
            }
            
            if (!buttonClicked) {
                console.warn(`⚠️ Could not find next button for question ${i + 1}`);
                // 手動で次の質問を表示してみる
                if (window.criticalCSSAnalyzer) {
                    window.criticalCSSAnalyzer.nextQuestion();
                    completedCount++;
                }
            }
            
            // 次の質問の読み込みを待つ
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // 結果画面に到達したかチェック
            const resultsCheck = document.getElementById('results-section');
            if (resultsCheck && resultsCheck.style.display !== 'none') {
                console.log('✅ Results section reached!');
                break;
            }
        }
        
        // 最終確認
        const finalCheck = document.getElementById('results-section');
        const analysisComplete = finalCheck && finalCheck.style.display !== 'none';
        
        return {
            success: analysisComplete,
            completedQuestions: completedCount,
            totalAnswers: results.length,
            message: analysisComplete ? 
                'Successfully completed all questions and reached results' : 
                `Completed ${completedCount} questions but did not reach results section`
        };
        
    } catch (error) {
        console.error('❌ Error during auto-complete:', error);
        return {
            success: false,
            completedQuestions: completedCount,
            error: error.message
        };
    }
}

// デバッグ用：現在の状態を取得
function getCurrentQuestionState() {
    const state = {
        currentQuestion: 0,
        totalAnswers: 0,
        questionVisible: false,
        resultsVisible: false,
        nextButtonEnabled: false
    };
    
    // 質問番号を取得
    const questionNum = document.querySelector('.question-number');
    if (questionNum) {
        const match = questionNum.textContent.match(/(\d+)/);
        if (match) {
            state.currentQuestion = parseInt(match[1]);
        }
    }
    
    // CriticalCSSAnalyzerの状態を確認
    if (window.criticalCSSAnalyzer) {
        state.currentQuestion = window.criticalCSSAnalyzer.currentQuestion || state.currentQuestion;
        state.totalAnswers = Object.keys(window.criticalCSSAnalyzer.state?.answers || {}).length;
    }
    
    // UI状態を確認
    state.questionVisible = !!document.querySelector('.question-container:not([style*="none"])');
    state.resultsVisible = !!document.querySelector('#results-section:not([style*="none"])');
    
    // 次へボタンの状態
    const nextBtn = document.getElementById('next-btn');
    state.nextButtonEnabled = nextBtn && !nextBtn.disabled;
    
    return state;
}

// 結果を確認する関数
function checkAnalysisResults() {
    const results = {
        visible: false,
        engineOS: null,
        interfaceOS: null,
        safeModeOS: null,
        localStorage: null
    };
    
    // 結果セクションの確認
    const resultsSection = document.getElementById('results-section');
    results.visible = resultsSection && resultsSection.style.display !== 'none';
    
    // OS結果カードを探す
    const osCards = document.querySelectorAll('.os-card, .persona-card');
    osCards.forEach(card => {
        const text = card.textContent || '';
        if (text.includes('Engine')) {
            results.engineOS = text.substring(0, 100); // 最初の100文字
        } else if (text.includes('Interface')) {
            results.interfaceOS = text.substring(0, 100);
        } else if (text.includes('Safe')) {
            results.safeModeOS = text.substring(0, 100);
        }
    });
    
    // localStorageの確認
    try {
        const stored = localStorage.getItem('haqei_analysis_results');
        if (stored) {
            results.localStorage = JSON.parse(stored);
        }
    } catch (e) {
        console.error('Failed to read localStorage:', e);
    }
    
    return results;
}

// グローバルに公開
window.autoComplete36Questions = autoComplete36Questions;
window.getCurrentQuestionState = getCurrentQuestionState;
window.checkAnalysisResults = checkAnalysisResults;

console.log('✅ Auto-complete script loaded');
console.log('🚀 Run: window.autoComplete36Questions()');
console.log('📊 Check state: window.getCurrentQuestionState()');
console.log('🔍 Check results: window.checkAnalysisResults()');