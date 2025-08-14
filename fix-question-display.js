// 質問1の表示問題を修正するパッチ

(function() {
    console.log('🔧 質問表示修正パッチ適用中...');
    
    // オリジナルのshowQuestion関数を保存
    const originalShowQuestion = window.criticalCSSAnalyzer?.showQuestion;
    
    // DOMContentLoaded後に実行
    function applyFix() {
        if (window.criticalCSSAnalyzer) {
            // showQuestion関数をオーバーライド
            window.criticalCSSAnalyzer.showQuestion = function(index) {
                console.log(`📝 質問 ${index + 1} を表示中...`);
                
                if (index >= QUESTIONS.length) {
                    this.proceedToAnalysis();
                    return;
                }
                
                this.state.currentQuestion = index;
                this.showScreen('question-screen');
                
                const question = QUESTIONS[index];
                console.log(`  質問内容: "${question.text}"`);
                
                // プログレスバー更新
                const progress = ((index + 1) / QUESTIONS.length) * 100;
                document.getElementById('progress-fill').style.width = `${progress}%`;
                
                // 質問番号と質問文を確実に設定
                const questionNumber = document.getElementById('question-number');
                const questionTitle = document.getElementById('question-title');
                
                if (questionNumber) {
                    questionNumber.textContent = index + 1;
                }
                
                if (questionTitle) {
                    // 確実に正しい質問テキストを設定
                    questionTitle.textContent = question.text;
                    console.log(`  ✅ 質問タイトル設定: "${question.text}"`);
                } else {
                    console.error('❌ question-title要素が見つかりません');
                }
                
                // オプション表示
                const container = document.getElementById('options-container');
                if (container) {
                    container.innerHTML = '';
                    
                    question.options.forEach((option, i) => {
                        const optionDiv = document.createElement('div');
                        optionDiv.className = 'option';
                        optionDiv.setAttribute('tabindex', '0');
                        optionDiv.setAttribute('role', 'radio');
                        optionDiv.setAttribute('aria-checked', 'false');
                        optionDiv.setAttribute('data-value', option.value);
                        
                        const optionText = document.createElement('span');
                        optionText.className = 'option-text';
                        optionText.textContent = option.text;
                        
                        optionDiv.appendChild(optionText);
                        optionDiv.onclick = () => this.selectOption(optionDiv, option);
                        
                        container.appendChild(optionDiv);
                    });
                }
                
                // ナビゲーションボタンの状態更新
                document.getElementById('prev-btn').disabled = index === 0;
                document.getElementById('next-btn').disabled = true;
                
                // 選択状態のリセット
                this.state.currentSelection = null;
            };
            
            console.log('✅ 質問表示修正パッチ適用完了');
            
            // 最初の質問が「HaQeiとは？」になっている場合、正しい質問を表示
            const currentTitle = document.getElementById('question-title')?.textContent;
            if (currentTitle && currentTitle.includes('HaQei')) {
                console.log('⚠️ 間違った質問を検出、修正中...');
                if (window.criticalCSSAnalyzer.state.currentQuestion === 0) {
                    window.criticalCSSAnalyzer.showQuestion(0);
                }
            }
        }
    }
    
    // DOMContentLoaded後に適用
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(applyFix, 100);
        });
    } else {
        setTimeout(applyFix, 100);
    }
})();