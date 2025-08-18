/**
 * QuestionManager - 質問表示と回答処理を管理するクラス
 * OS Analyzer用に実装
 */

'use strict';

class QuestionManager {
    constructor() {
        console.log('🔧 QuestionManager: Constructor called');
        console.log('🔧 QuestionManager: window.QUESTIONS available:', !!window.QUESTIONS);
        console.log('🔧 QuestionManager: window.unifiedQuestions available:', !!window.unifiedQuestions);
        
        // 複数のソースから質問データを取得
        this.questions = window.QUESTIONS || window.unifiedQuestions || [];
        console.log('🔧 QuestionManager: Questions loaded:', this.questions.length);
        
        if (this.questions.length > 0) {
            console.log('🔧 QuestionManager: First question:', this.questions[0]);
            if (this.questions.length > 1) {
                console.log('🔧 QuestionManager: Second question (Q2):', this.questions[1]);
            }
        }
        
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.isInitialized = false;
        console.log('🔧 QuestionManager: Starting initialization');
        this.initializeWhenReady();
    }

    initializeWhenReady() {
        if (document.readyState === 'loading') {
            console.log('⏳ QuestionManager: DOM not ready, deferring init until DOMContentLoaded');
            document.addEventListener('DOMContentLoaded', () => {
                if (!this.isInitialized) {
                    this.init();
                    this.isInitialized = true;
                }
            }, { once: true });
        } else {
            this.init();
            this.isInitialized = true;
        }
    }

    init() {
        // 複数の可能性のあるIDを試す
        this.questionContainer = 
            document.getElementById('question-container') ||
            document.getElementById('question-title') ||
            document.querySelector('.question-container');
        
        this.optionsContainer = 
            document.getElementById('options-container') ||
            document.getElementById('answer-options') ||
            document.querySelector('.options-container');
        
        if (!this.questionContainer || !this.optionsContainer) {
            console.warn('QuestionManager: Creating missing elements');
            this.createMissingElements();
        }
        
        // 要素が作成または見つかった後の確認
        if (this.questionContainer && this.optionsContainer) {
            console.log('✅ QuestionManager initialized with elements');
        } else {
            console.error('❌ QuestionManager: Failed to initialize elements');
        }
        
        // ナビゲーションボタンの設定（nullチェック付き）
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.showPreviousQuestion());
        } else {
            console.warn('⚠️ QuestionManager: prev-btn element not found');
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.handleNextButtonClick());
        } else {
            console.warn('⚠️ QuestionManager: next-btn element not found');
        }
        
        // 進捗表示要素のnullチェック
        this.progressFill = document.querySelector('.progress-fill');
        this.questionNumber = document.getElementById('question-number');
        
        if (!this.progressFill) {
            console.warn('⚠️ QuestionManager: progress-fill element not found');
        }
        
        if (!this.questionNumber) {
            console.warn('⚠️ QuestionManager: question-number element not found');
        }
        
        console.log('📋 QuestionManager initialized with', this.questions.length, 'questions');
    }

    // 不足要素を動的に作成
    createMissingElements() {
        const questionScreen = document.getElementById('question-screen') || 
                              document.querySelector('.question-screen');
        
        if (!questionScreen) {
            console.error('Question screen not found, cannot create elements');
            return;
        }
        
        // question-containerを作成
        if (!this.questionContainer) {
            this.questionContainer = document.createElement('div');
            this.questionContainer.id = 'question-container';
            this.questionContainer.innerHTML = `
                <div id="question-title"></div>
                <div id="question-number"></div>
            `;
            questionScreen.appendChild(this.questionContainer);
            console.log('Created question-container');
        }
        
        // options-containerを作成
        if (!this.optionsContainer) {
            this.optionsContainer = document.createElement('div');
            this.optionsContainer.id = 'options-container';
            questionScreen.appendChild(this.optionsContainer);
            console.log('Created options-container');
        }
    }
    
    /**
     * フォールバックコンテナを作成
     * @param {string} id - 作成するコンテナのID
     * @returns {HTMLElement} 作成されたコンテナ要素
     */
    createFallbackContainer(id) {
        console.log(`🔧 QuestionManager: Creating fallback container for ${id}`);
        const container = document.createElement('div');
        container.id = id;
        container.className = 'fallback-container';
        
        // 可能であれば適切な親要素に追加
        const questionScreen = document.querySelector('.question-screen') || 
                              document.getElementById('question-screen') ||
                              document.querySelector('.screen.active') ||
                              document.body;
        
        if (questionScreen) {
            questionScreen.appendChild(container);
        }
        
        return container;
    }

    /**
     * 指定したインデックスの質問を表示（安全化）
     * @param {number} index - 表示する質問のインデックス
     */
    displayQuestion(index) {
        console.log(`📋 Displaying question ${index + 1}/${this.questions.length}`);
        
        if (!this.questions || this.questions.length === 0) {
            console.error('❌ No questions available');
            console.error('❌ Questions array state:', this.questions);
            console.error('❌ window.QUESTIONS state:', window.QUESTIONS);
            return;
        }
        
        if (index < 0 || index >= this.questions.length) {
            console.error(`❌ Invalid question index: ${index}`);
            return;
        }
        
        this.currentQuestionIndex = index;
        const question = this.questions[index];
        
        // 質問番号を表示（nullチェック強化）
        const questionNumber = document.getElementById('question-number');
        if (questionNumber) {
            questionNumber.textContent = `質問 ${index + 1}/${this.questions.length}`;
        }
        
        // 質問テキストを表示（nullチェック強化）
        const questionTitle = document.getElementById('question-title');
        if (questionTitle) {
            questionTitle.textContent = question.text;
        }
        
        // 選択肢表示（option-radioクラスを使用）
        if (this.optionsContainer) {
            try {
                this.optionsContainer.innerHTML = '';
                
                question.options.forEach((option, optIndex) => {
                    const label = document.createElement('label');
                    label.className = 'option-label';
                    label.setAttribute('for', `option-${index}-${optIndex}`);
                    
                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = `question-${index}`;
                    radio.value = optIndex;
                    radio.id = `option-${index}-${optIndex}`;
                    
                    // 既存の回答があれば選択状態にする
                    if (this.answers[question.id] === optIndex) {
                        radio.checked = true;
                        label.classList.add('selected');
                    }
                    
                    // ラジオボタンの変更イベント
                    radio.addEventListener('change', (event) => {
                        
                        // 次へボタンを有効化
                        const nextBtn = document.getElementById('next-btn');
                        if (nextBtn) {
                            nextBtn.disabled = false;
                            nextBtn.style.opacity = '1';
                            nextBtn.style.cursor = 'pointer';
                        }
                        
                        // 選択状態のスタイルを更新
                        document.querySelectorAll('.option-label').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        label.classList.add('selected');
                        
                        // 回答を保存
                        this.saveAnswer(question.id, optIndex);
                    });
                    
                    // テキストスパンを作成
                    const span = document.createElement('span');
                    span.className = 'option-text';
                    span.textContent = option.text;
                    
                    // 要素を組み立て
                    label.appendChild(radio);
                    label.appendChild(span);
                    
                    // コンテナに追加
                    this.optionsContainer.appendChild(label);
                });
                
                console.log(`📋 Question ${index + 1} displayed with ${question.options.length} options`);
                
            } catch (error) {
                console.error('❌ Error creating options:', error);
                // フォールバック：シンプルなリスト表示
                this.optionsContainer.innerHTML = question.options.map(option => 
                    `<div class="option-fallback">${option.text}</div>`
                ).join('');
            }
        } else {
            console.error('❌ Options container not available for display');
        }
        
        // プログレスバーを更新
        this.updateProgress(index);
        
        // ナビゲーションボタンの状態更新
        this.updateNavigationButtons();
    }

    /**
     * 回答を保存
     * @param {string} questionId - 質問ID
     * @param {string} answer - 回答値
     */
    saveAnswer(questionId, answer) {
        this.answers[questionId] = answer;
        console.log(`💾 Answer saved for ${questionId}:`, answer);
    }

    /**
     * 前の質問を表示
     */
    showPreviousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.displayQuestion(this.currentQuestionIndex - 1);
        }
    }

    /**
     * 次へボタンのクリック処理
     */
    handleNextButtonClick() {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        
        // 現在の質問に回答しているか確認（0やfalseも有効な回答として扱う）
        if (this.answers[currentQuestion.id] === undefined || this.answers[currentQuestion.id] === null) {
            alert('この質問に回答してから次に進んでください。');
            return;
        }
        
        // 最後の質問の場合は結果画面へ
        if (this.currentQuestionIndex === this.questions.length - 1) {
            console.log('📊 Processing results');
            this.processResults();
        } else {
            // 次の質問へ
            const nextIndex = this.currentQuestionIndex + 1;
            console.log(`📋 Moving to question ${nextIndex + 1}/${this.questions.length}`);
            this.displayQuestion(nextIndex);
        }
    }

    /**
     * プログレスバーを更新
     */
    updateProgress(questionIndex) {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            const progress = ((questionIndex + 1) / this.questions.length) * 100;
            progressFill.style.width = `${progress}%`;
            console.log(`📊 Progress updated: ${progress.toFixed(1)}%`);
        }
    }

    /**
     * ナビゲーションボタンの状態を更新
     */
    updateNavigationButtons() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentQuestionIndex === 0;
        }
        
        if (this.nextBtn) {
            const isLastQuestion = this.currentQuestionIndex === this.questions.length - 1;
            this.nextBtn.textContent = isLastQuestion ? '結果を見る' : '次へ';
            
            // 回答が選択されていない場合は無効化
            const currentQuestion = this.questions[this.currentQuestionIndex];
            if (currentQuestion && this.answers[currentQuestion.id] === undefined) {
                this.nextBtn.disabled = true;
            }
        }
    }

    /**
     * 結果を処理して結果画面に遷移
     */
    processResults() {
        // 回答データから結果を計算
        const results = this.calculateResults();
        
        // 結果を保存
        if (typeof saveAnalysisResults === 'function') {
            saveAnalysisResults(results);
        }
        
        // 結果画面に遷移
        if (window.ScreenManager) {
            window.ScreenManager.switchTo('results');
        } else {
            // フォールバック: 結果画面を直接表示
            const resultsScreen = document.getElementById('results-screen');
            if (resultsScreen) {
                document.querySelectorAll('.welcome-screen, .question-screen').forEach(screen => {
                    screen.classList.remove('active');
                });
                resultsScreen.classList.add('active');
            }
        }
    }

    /**
     * 回答から結果を計算
     * @returns {Object} 計算された結果オブジェクト
     */
    calculateResults() {
        // スコアの初期化
        const scores = {
            '乾_創造性': 0, '兌_調和性': 0, '離_表現性': 0, '震_行動性': 0,
            '巽_適応性': 0, '坎_探求性': 0, '艮_安定性': 0, '坤_受容性': 0
        };
        
        // 回答からスコアを集計
        Object.entries(this.answers).forEach(([questionId, answer]) => {
            const question = this.questions.find(q => q.id === questionId);
            if (question) {
                const option = question.options.find(opt => opt.value === answer);
                if (option && option.scoring) {
                    Object.entries(option.scoring).forEach(([key, value]) => {
                        if (scores.hasOwnProperty(key)) {
                            scores[key] += value;
                        }
                    });
                }
            }
        });
        
        // スコアを正規化
        Object.keys(scores).forEach(key => {
            scores[key] = Math.max(0, Math.min(10, scores[key]));
        });
        
        // 結果オブジェクトの作成
        const results = {
            engine_os: this.determineOS(scores, 'engine'),
            interface_os: this.determineOS(scores, 'interface'),
            safe_mode_os: this.determineOS(scores, 'safe_mode'),
            scores: scores,
            interactions: this.calculateInteractions(scores)
        };
        
        console.log('📊 Calculated results:', results);
        return results;
    }

    /**
     * スコアから各OSを決定
     * @param {Object} scores - 集計されたスコア
     * @param {string} osType - OS種別 (engine, interface, safe_mode)
     * @returns {string} 決定されたOS
     */
    determineOS(scores, osType) {
        if (osType === 'engine') {
            // Engine OS: 乾_創造性, 震_行動性, 坎_探求性, 艮_安定性
            const engineScores = {
                '乾': scores['乾_創造性'],
                '震': scores['震_行動性'],
                '坎': scores['坎_探求性'],
                '艮': scores['艮_安定性']
            };
            return this.getHighestKey(engineScores);
        } else if (osType === 'interface') {
            // Interface OS: 兌_調和性, 離_表現性
            const interfaceScores = {
                '兌': scores['兌_調和性'],
                '離': scores['離_表現性']
            };
            return this.getHighestKey(interfaceScores);
        } else if (osType === 'safe_mode') {
            // Safe Mode OS: 巽_適応性, 坤_受容性
            const safeModeScores = {
                '巽': scores['巽_適応性'],
                '坤': scores['坤_受容性']
            };
            return this.getHighestKey(safeModeScores);
        }
        return '';
    }

    /**
     * オブジェクトの中で最も高い値を持つキーを返す
     * @param {Object} obj - 対象オブジェクト
     * @returns {string} 最も高い値を持つキー
     */
    getHighestKey(obj) {
        return Object.entries(obj).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    }

    /**
     * OSの相互作用を計算
     * @param {Object} scores - 集計されたスコア
     * @returns {Object} 相互作用の結果
     */
    calculateInteractions(scores) {
        // 簡易版の相互作用計算（実際の実装はより複雑になる可能性あり）
        const engine = this.determineOS(scores, 'engine');
        const interface_ = this.determineOS(scores, 'interface');
        const safeMode = this.determineOS(scores, 'safe_mode');
        
        // TripleOSInteractionAnalyzerが利用可能であれば使用
        if (typeof TripleOSInteractionAnalyzer !== 'undefined') {
            return TripleOSInteractionAnalyzer.analyze(engine, interface_, safeMode);
        }
        
        // 簡易フォールバック
        return {
            primary: `${engine}×${interface_}`,
            secondary: `${interface_}×${safeMode}`,
            tertiary: `${safeMode}×${engine}`,
            description: `${engine}を原動力に、${interface_}で表現し、${safeMode}で安定を保つ特性があります。`
        };
    }
}

// シングルトンインスタンスを作成してグローバルに公開
window.QuestionManager = new QuestionManager();

// 質問表示関数をグローバルに公開
window.displayQuestion = function(index) {
    if (window.QuestionManager) {
        window.QuestionManager.displayQuestion(index);
    }
};

// 分析開始関数をグローバルに公開
window.startQuestionFlow = function() {
    if (window.ScreenManager) {
        window.ScreenManager.switchTo('question');
    }
    
    if (window.QuestionManager) {
        window.QuestionManager.displayQuestion(0);
    }
    
    return true;
};