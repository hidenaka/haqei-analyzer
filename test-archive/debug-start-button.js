/**
 * スタートボタンデバッグスクリプト
 * 質問フロー開始処理の問題を詳細に調査
 */

(function() {
    console.log('🔍 === START BUTTON DEBUG SCRIPT LOADED ===');
    
    // DOM要素の状態チェック
    function checkDOMElements() {
        console.log('📋 DOM Elements Check:');
        
        const elements = {
            'start-btn': document.getElementById('start-btn'),
            'question-screen': document.getElementById('question-screen'),
            'welcome-screen': document.getElementById('welcome-screen'),
            'landing-section': document.getElementById('landing-section'),
            'question-section': document.getElementById('question-section'),
            'analysis-screen': document.getElementById('analysis-screen'),
            'results-screen': document.getElementById('results-screen'),
            'prev-btn': document.getElementById('prev-btn'),
            'next-btn': document.getElementById('next-btn')
        };
        
        for (const [id, element] of Object.entries(elements)) {
            console.log(`  ${id}: ${element ? '✅ Found' : '❌ Not found'}`);
        }
        
        return elements;
    }
    
    // CriticalCSSAnalyzerの状態チェック
    function checkAnalyzerState() {
        console.log('🔧 Analyzer State Check:');
        
        if (window.criticalCSSAnalyzer) {
            console.log('  criticalCSSAnalyzer: ✅ Exists');
            console.log('  - startAnalysis:', typeof window.criticalCSSAnalyzer.startAnalysis);
            console.log('  - showScreen:', typeof window.criticalCSSAnalyzer.showScreen);
            console.log('  - showQuestion:', typeof window.criticalCSSAnalyzer.showQuestion);
            console.log('  - state:', window.criticalCSSAnalyzer.state);
            console.log('  - questions:', window.criticalCSSAnalyzer.questions?.length || 'undefined');
            
            // イベントリスナーの確認
            const startBtn = document.getElementById('start-btn');
            if (startBtn) {
                const listeners = getEventListeners(startBtn);
                console.log('  Start button listeners:', listeners);
            }
        } else {
            console.log('  criticalCSSAnalyzer: ❌ Not found');
        }
    }
    
    // イベントリスナー取得（Chrome DevTools用）
    function getEventListeners(element) {
        // 注: これはChrome DevToolsのみで動作
        if (typeof window.getEventListeners === 'function') {
            return window.getEventListeners(element);
        }
        return 'getEventListeners not available (use Chrome DevTools)';
    }
    
    // スタートボタンの修正パッチ
    function patchStartButton() {
        console.log('🔨 Applying start button patch...');
        
        const startBtn = document.getElementById('start-btn');
        if (!startBtn) {
            console.error('❌ Start button not found');
            return;
        }
        
        // 既存のリスナーをクリア（重複防止）
        const newBtn = startBtn.cloneNode(true);
        startBtn.parentNode.replaceChild(newBtn, startBtn);
        
        // 新しいリスナーを追加（デバッグ付き）
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎯 START BUTTON CLICKED');
            console.log('  Event:', e);
            console.log('  Target:', e.target);
            
            // アナライザーの存在確認
            if (!window.criticalCSSAnalyzer) {
                console.error('❌ criticalCSSAnalyzer not found');
                // 初期化を試みる
                try {
                    window.criticalCSSAnalyzer = new CriticalCSSAnalyzer();
                    console.log('✅ Created new CriticalCSSAnalyzer instance');
                } catch (error) {
                    console.error('❌ Failed to create CriticalCSSAnalyzer:', error);
                    return;
                }
            }
            
            // startAnalysisの実行
            try {
                console.log('🚀 Calling startAnalysis...');
                
                // メソッドの存在確認
                if (typeof window.criticalCSSAnalyzer.startAnalysis === 'function') {
                    window.criticalCSSAnalyzer.startAnalysis();
                    console.log('✅ startAnalysis called successfully');
                } else {
                    console.error('❌ startAnalysis is not a function');
                    
                    // フォールバック: 手動で画面遷移
                    console.log('⚠️ Attempting fallback transition...');
                    fallbackStartQuestions();
                }
            } catch (error) {
                console.error('❌ Error calling startAnalysis:', error);
                console.error('  Stack:', error.stack);
            }
        });
        
        console.log('✅ Start button patch applied');
    }
    
    // フォールバック: 手動で質問開始
    function fallbackStartQuestions() {
        console.log('🔄 Fallback: Manual question start');
        
        // ランディング画面を非表示
        const landingElements = [
            document.getElementById('landing-section'),
            document.getElementById('welcome-screen'),
            document.querySelector('.screen.active')
        ];
        
        landingElements.forEach(el => {
            if (el) {
                el.style.display = 'none';
                el.classList.remove('active');
                console.log(`  Hidden: ${el.id || el.className}`);
            }
        });
        
        // 質問画面を表示
        const questionElements = [
            document.getElementById('question-section'),
            document.getElementById('question-screen')
        ];
        
        questionElements.forEach(el => {
            if (el) {
                el.style.display = 'block';
                el.classList.add('active');
                console.log(`  Shown: ${el.id}`);
            }
        });
        
        // 最初の質問を表示
        if (window.criticalCSSAnalyzer && window.criticalCSSAnalyzer.showQuestion) {
            window.criticalCSSAnalyzer.showQuestion(0);
            console.log('✅ First question shown');
        } else if (window.QUESTIONS && window.QUESTIONS[0]) {
            // 手動で質問を表示
            const question = window.QUESTIONS[0];
            console.log('  Showing question manually:', question.text);
            
            // 質問番号
            const questionNum = document.getElementById('question-number');
            if (questionNum) questionNum.textContent = '1';
            
            // 質問テキスト
            const questionTitle = document.getElementById('question-title');
            if (questionTitle) questionTitle.textContent = question.text;
            
            // オプション表示
            const container = document.getElementById('options-container');
            if (container) {
                container.innerHTML = '';
                question.options.forEach(option => {
                    const div = document.createElement('div');
                    div.className = 'option';
                    div.innerHTML = `<span class="option-text">${option.text}</span>`;
                    div.onclick = () => selectOption(div, option);
                    container.appendChild(div);
                });
            }
        }
    }
    
    // オプション選択処理
    function selectOption(element, option) {
        console.log('  Option selected:', option.text);
        
        // 選択状態の更新
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        element.classList.add('selected');
        
        // 次へボタンを有効化
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
        
        // 回答を保存
        if (window.criticalCSSAnalyzer && window.criticalCSSAnalyzer.state) {
            window.criticalCSSAnalyzer.state.saveAnswer(
                window.criticalCSSAnalyzer.state.currentQuestion || 0,
                option
            );
        }
    }
    
    // デバッグ実行
    function runDebug() {
        console.log('\n🔍 === STARTING DEBUG SEQUENCE ===\n');
        
        // 1. DOM要素チェック
        const elements = checkDOMElements();
        
        // 2. アナライザー状態チェック
        checkAnalyzerState();
        
        // 3. パッチ適用
        patchStartButton();
        
        // 4. グローバル関数として公開
        window.debugStartButton = {
            checkDOM: checkDOMElements,
            checkAnalyzer: checkAnalyzerState,
            patch: patchStartButton,
            fallback: fallbackStartQuestions,
            manualStart: () => {
                console.log('📝 Manual start triggered');
                if (window.criticalCSSAnalyzer) {
                    window.criticalCSSAnalyzer.startAnalysis();
                } else {
                    fallbackStartQuestions();
                }
            }
        };
        
        console.log('\n✅ Debug setup complete');
        console.log('📌 Available commands:');
        console.log('  window.debugStartButton.checkDOM()');
        console.log('  window.debugStartButton.checkAnalyzer()');
        console.log('  window.debugStartButton.manualStart()');
        console.log('\n');
    }
    
    // DOMContentLoaded後に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runDebug);
    } else {
        // 既に読み込み完了している場合
        setTimeout(runDebug, 100);
    }
})();