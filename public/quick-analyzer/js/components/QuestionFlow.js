/**
 * QuestionFlow - 質問フローコンポーネント
 * 段階的な質問表示、回答処理、ナビゲーション機能を提供
 */
class QuestionFlow extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, {
      enableNavigation: true,
      showQuestionNumbers: true,
      autoAdvance: false,
      validateAnswers: true,
      saveProgress: true,
      shuffleOptions: false,
      ...options
    });
    
    this.currentQuestionIndex = 0;
    this.questions = [];
    this.answers = {};
    this.questionHistory = [];
    this.dataManager = null;
    this.progressIndicator = null;
    this.storageManager = null;
    
    // 質問フロー設定
    this.FLOW_CONFIG = {
      transitionDuration: 300,
      autoSaveInterval: 5000,
      maxHistoryLength: 10,
      requireAllAnswers: true,
      allowBackNavigation: true
    };
    
    // 回答検証設定
    this.VALIDATION_CONFIG = {
      enabled: true,
      showErrors: true,
      errorTimeout: 3000
    };
  }

  /**
   * デフォルトオプションを取得
   * @returns {Object}
   */
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      enableNavigation: true,
      showQuestionNumbers: true,
      autoAdvance: false,
      validateAnswers: true,
      saveProgress: true,
      shuffleOptions: false,
      theme: 'default'
    };
  }

  /**
   * 初期化前処理
   * @returns {Promise<void>}
   */
  async beforeInit() {
    this.log('debug', 'beforeInit', 'Initializing QuestionFlow');
    
    // 依存関係の初期化
    await this.initializeDependencies();
    
    // 質問データの読み込み
    await this.loadQuestions();
    
    // 保存された進捗の復元
    if (this.options.saveProgress) {
      this.restoreProgress();
    }
  }

  /**
   * 依存関係を初期化
   * @returns {Promise<void>}
   */
  async initializeDependencies() {
    // DataManagerの取得（グローバルインスタンスを使用）
    if (window.quickAnalyzerApp && window.quickAnalyzerApp.dataManager) {
      this.dataManager = window.quickAnalyzerApp.dataManager;
    } else if (window.DataManager) {
      this.dataManager = new DataManager();
      if (!this.dataManager.isLoaded()) {
        await this.dataManager.init();
      }
    } else {
      throw new Error('DataManager not available');
    }
    
    // StorageManagerの初期化
    if (window.StorageManager) {
      this.storageManager = new StorageManager('haqei_question_flow_');
    }
    
    // ProgressIndicatorの検索
    this.findProgressIndicator();
  }

  /**
   * ProgressIndicatorを検索
   */
  findProgressIndicator() {
    // グローバルプログレスバーを検索
    const globalProgress = document.querySelector('.global-progress .progress-bar');
    if (globalProgress) {
      this.progressIndicator = {
        element: globalProgress,
        update: (percentage) => {
          globalProgress.style.width = `${percentage}%`;
          globalProgress.parentElement.style.setProperty('--progress', `${percentage}%`);
        }
      };
    }
  }

  /**
   * 質問データを読み込み
   * @returns {Promise<void>}
   */
  async loadQuestions() {
    try {
      this.questions = this.dataManager.getQuestions();
      
      if (!this.questions || this.questions.length === 0) {
        throw new Error('No questions available');
      }
      
      // オプションのシャッフル
      if (this.options.shuffleOptions) {
        this.shuffleQuestionOptions();
      }
      
      this.log('debug', 'loadQuestions', 'Questions loaded', {
        questionCount: this.questions.length
      });
      
    } catch (error) {
      this.handleError(error, 'loadQuestions');
      throw error;
    }
  }

  /**
   * 質問のオプションをシャッフル
   */
  shuffleQuestionOptions() {
    this.questions.forEach(question => {
      if (question.options && question.options.length > 1) {
        // Fisher-Yates shuffle
        for (let i = question.options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [question.options[i], question.options[j]] = [question.options[j], question.options[i]];
        }
      }
    });
  }

  /**
   * メインコンテンツをレンダリング
   * @returns {Promise<string>}
   */
  async renderContent() {
    const currentQuestion = this.getCurrentQuestion();
    
    if (!currentQuestion) {
      return this.renderNoQuestionsMessage();
    }
    
    return `
      <div class="question-flow" data-animate="true">
        ${this.renderQuestionHeader()}
        ${this.renderCurrentQuestion(currentQuestion)}
        ${this.renderNavigation()}
        ${this.renderValidationMessage()}
      </div>
    `;
  }

  /**
   * 質問ヘッダーをレンダリング
   * @returns {string}
   */
  renderQuestionHeader() {
    const progressPercentage = this.calculateProgress();
    
    return `
      <div class="question-header">
        ${this.options.showQuestionNumbers ? `
          <div class="question-counter">
            質問 ${this.currentQuestionIndex + 1} / ${this.questions.length}
          </div>
        ` : ''}
        
        <div class="question-instruction">
          直感で答えてください。正解はありません。
        </div>
        
        <div class="question-progress">
          <div class="progress-container">
            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
          </div>
          <div class="progress-text">
            <span>進捗: ${Math.round(progressPercentage)}%</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 現在の質問をレンダリング
   * @param {Object} question - 質問オブジェクト
   * @returns {string}
   */
  renderCurrentQuestion(question) {
    const isAnswered = this.isQuestionAnswered(question.id);
    const selectedAnswer = this.answers[question.id];
    
    return `
      <div class="question-card ${isAnswered ? 'answered' : ''}" data-question-id="${question.id}">
        <div class="question-content">
          <h3 class="question-text">${this.escapeHtml(question.text)}</h3>
          
          <div class="question-options">
            ${question.options.map((option, index) => this.renderOption(question, option, index, selectedAnswer)).join('')}
          </div>
          
          ${question.description ? `
            <div class="question-description">
              ${this.escapeHtml(question.description)}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * 選択肢をレンダリング
   * @param {Object} question - 質問オブジェクト
   * @param {Object} option - 選択肢オブジェクト
   * @param {number} index - インデックス
   * @param {string} selectedAnswer - 選択済み回答
   * @returns {string}
   */
  renderOption(question, option, index, selectedAnswer) {
    const isSelected = selectedAnswer === option.value;
    const optionId = `${question.id}-${option.value}`;
    
    return `
      <div class="option-item" data-option-value="${option.value}">
        <input 
          type="radio" 
          id="${optionId}"
          name="${question.id}"
          value="${option.value}"
          class="option-input"
          ${isSelected ? 'checked' : ''}
          data-question-id="${question.id}"
        >
        <label for="${optionId}" class="option-label">
          <div class="option-content">
            <div class="option-text">${this.escapeHtml(option.text)}</div>
            ${option.description ? `
              <div class="option-description">${this.escapeHtml(option.description)}</div>
            ` : ''}
          </div>
          <div class="option-indicator">
            <div class="option-check">✓</div>
          </div>
        </label>
      </div>
    `;
  }

  /**
   * ナビゲーションをレンダリング
   * @returns {string}
   */
  renderNavigation() {
    if (!this.options.enableNavigation) {
      return '';
    }
    
    const canGoBack = this.canGoBack();
    const canGoNext = this.canGoNext();
    const isLastQuestion = this.isLastQuestion();
    
    return `
      <div class="question-navigation">
        <button 
          type="button" 
          class="nav-button btn btn-secondary ${canGoBack ? '' : 'disabled'}"
          id="prev-question-btn"
          ${canGoBack ? '' : 'disabled'}
        >
          ← 前の質問
        </button>
        
        <div class="nav-info">
          <div class="progress-info">
            ${this.currentQuestionIndex + 1} / ${this.questions.length}
          </div>
        </div>
        
        <button 
          type="button" 
          class="nav-button btn btn-primary ${canGoNext ? '' : 'disabled'}"
          id="next-question-btn"
          ${canGoNext ? '' : 'disabled'}
        >
          ${isLastQuestion ? '結果を見る →' : '次の質問 →'}
        </button>
      </div>
    `;
  }

  /**
   * バリデーションメッセージをレンダリング
   * @returns {string}
   */
  renderValidationMessage() {
    return `
      <div id="validation-message" class="validation-message" style="display: none;">
        <div class="validation-content">
          <span class="validation-text"></span>
        </div>
      </div>
    `;
  }

  /**
   * 質問なしメッセージをレンダリング
   * @returns {string}
   */
  renderNoQuestionsMessage() {
    return `
      <div class="no-questions-message">
        <h3>質問の読み込みに失敗しました</h3>
        <p>申し訳ございませんが、質問データが利用できません。</p>
        <button type="button" class="btn btn-primary" onclick="location.reload()">
          ページを再読み込み
        </button>
      </div>
    `;
  }

  /**
   * レンダリング後処理
   * @returns {Promise<void>}
   */
  async afterRender() {
    // イベントリスナーの設定
    this.bindQuestionEvents();
    
    // キーボードナビゲーション
    this.setupKeyboardNavigation();
    
    // プログレスの更新
    this.updateProgress();
    
    // 自動保存の開始
    if (this.options.saveProgress) {
      this.startAutoSave();
    }
  }

  /**
   * 質問関連のイベントをバインド
   */
  bindQuestionEvents() {
    // 選択肢の変更イベント
    const optionInputs = this.$$('.option-input');
    optionInputs.forEach(input => {
      this.addEventListener(input, 'change', this.handleAnswerChange);
    });
    
    // ナビゲーションボタン
    const prevBtn = this.$('#prev-question-btn');
    const nextBtn = this.$('#next-question-btn');
    
    if (prevBtn) {
      this.addEventListener(prevBtn, 'click', this.handlePreviousQuestion);
    }
    
    if (nextBtn) {
      this.addEventListener(nextBtn, 'click', this.handleNextQuestion);
    }
  }

  /**
   * キーボードナビゲーションを設定
   */
  setupKeyboardNavigation() {
    this.addEventListener(document, 'keydown', (e) => {
      if (!this.container.contains(document.activeElement)) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          if (this.canGoBack()) {
            e.preventDefault();
            this.goToPreviousQuestion();
          }
          break;
          
        case 'ArrowRight':
          if (this.canGoNext()) {
            e.preventDefault();
            this.goToNextQuestion();
          }
          break;
          
        case 'Enter':
          if (this.canGoNext()) {
            e.preventDefault();
            this.goToNextQuestion();
          }
          break;
          
        case '1':
        case '2':
        case '3':
        case '4':
          // 数字キーで選択肢を選択
          const optionIndex = parseInt(e.key) - 1;
          this.selectOptionByIndex(optionIndex);
          break;
      }
    });
  }

  /**
   * 回答変更ハンドラー
   * @param {Event} event - 変更イベント
   */
  handleAnswerChange(event) {
    const input = event.target;
    const questionId = input.dataset.questionId;
    const answer = input.value;
    
    this.log('debug', 'handleAnswerChange', 'Answer changed', {
      questionId,
      answer
    });
    
    // 回答を保存
    this.setAnswer(questionId, answer);
    
    // バリデーションメッセージを非表示
    this.hideValidationMessage();
    
    // ナビゲーションの更新
    this.updateNavigation();
    
    // 自動進行
    if (this.options.autoAdvance && !this.isLastQuestion()) {
      setTimeout(() => {
        this.goToNextQuestion();
      }, 1000);
    }
    
    // 回答変更イベントを発火
    this.emit('answerChanged', {
      questionId,
      answer,
      questionIndex: this.currentQuestionIndex,
      allAnswers: { ...this.answers }
    });
  }

  /**
   * 前の質問ハンドラー
   * @param {Event} event - クリックイベント
   */
  handlePreviousQuestion(event) {
    event.preventDefault();
    this.goToPreviousQuestion();
  }

  /**
   * 次の質問ハンドラー
   * @param {Event} event - クリックイベント
   */
  handleNextQuestion(event) {
    event.preventDefault();
    this.goToNextQuestion();
  }

  /**
   * 前の質問に移動
   */
  goToPreviousQuestion() {
    if (!this.canGoBack()) {
      this.log('warn', 'goToPreviousQuestion', 'Cannot go back');
      return;
    }
    
    this.currentQuestionIndex--;
    this.addToHistory('back');
    this.renderAndTransition('slideInFromLeft');
    
    this.emit('questionChanged', {
      direction: 'back',
      questionIndex: this.currentQuestionIndex,
      question: this.getCurrentQuestion()
    });
  }

  /**
   * 次の質問に移動
   */
  goToNextQuestion() {
    if (!this.canGoNext()) {
      if (this.options.validateAnswers) {
        this.showValidationMessage('この質問に回答してください。');
      }
      return;
    }
    
    if (this.isLastQuestion()) {
      // 最後の質問の場合は完了処理
      this.completeQuestionFlow();
      return;
    }
    
    this.currentQuestionIndex++;
    this.addToHistory('forward');
    this.renderAndTransition('slideInFromRight');
    
    this.emit('questionChanged', {
      direction: 'forward',
      questionIndex: this.currentQuestionIndex,
      question: this.getCurrentQuestion()
    });
  }

  /**
   * 特定の質問に移動
   * @param {number} questionIndex - 質問インデックス
   */
  goToQuestion(questionIndex) {
    if (questionIndex < 0 || questionIndex >= this.questions.length) {
      this.log('warn', 'goToQuestion', 'Invalid question index', { questionIndex });
      return;
    }
    
    const direction = questionIndex > this.currentQuestionIndex ? 'forward' : 'back';
    this.currentQuestionIndex = questionIndex;
    this.addToHistory(direction);
    this.renderAndTransition(direction === 'forward' ? 'slideInFromRight' : 'slideInFromLeft');
    
    this.emit('questionChanged', {
      direction,
      questionIndex: this.currentQuestionIndex,
      question: this.getCurrentQuestion()
    });
  }

  /**
   * レンダリングとトランジション
   * @param {string} animationClass - アニメーションクラス
   */
  async renderAndTransition(animationClass) {
    // 退場アニメーション
    if (this.options.animations) {
      await this.applyExitAnimations();
    }
    
    // 再レンダリング
    await this.render();
    
    // 入場アニメーション
    if (this.options.animations) {
      const questionCard = this.$('.question-card');
      if (questionCard) {
        questionCard.classList.add(animationClass);
      }
    }
  }

  /**
   * 質問フローを完了
   */
  completeQuestionFlow() {
    this.log('info', 'completeQuestionFlow', 'Question flow completed', {
      totalAnswers: Object.keys(this.answers).length,
      allAnswered: this.areAllQuestionsAnswered()
    });
    
    // 最終保存
    if (this.options.saveProgress) {
      this.saveProgress();
    }
    
    // 完了イベントを発火
    this.emit('flowCompleted', {
      answers: { ...this.answers },
      completionTime: new Date().toISOString(),
      totalQuestions: this.questions.length
    });
  }

  /**
   * 回答を設定
   * @param {string} questionId - 質問ID
   * @param {string} answer - 回答
   */
  setAnswer(questionId, answer) {
    this.answers[questionId] = answer;
    
    // プログレスの更新
    this.updateProgress();
    
    // 保存
    if (this.options.saveProgress) {
      this.saveProgress();
    }
  }

  /**
   * 回答を取得
   * @param {string} questionId - 質問ID
   * @returns {string|null}
   */
  getAnswer(questionId) {
    return this.answers[questionId] || null;
  }

  /**
   * 現在の質問を取得
   * @returns {Object|null}
   */
  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex] || null;
  }

  /**
   * 質問が回答済みかチェック
   * @param {string} questionId - 質問ID
   * @returns {boolean}
   */
  isQuestionAnswered(questionId) {
    return !!this.answers[questionId];
  }

  /**
   * すべての質問が回答済みかチェック
   * @returns {boolean}
   */
  areAllQuestionsAnswered() {
    return this.questions.every(q => this.isQuestionAnswered(q.id));
  }

  /**
   * 最後の質問かチェック
   * @returns {boolean}
   */
  isLastQuestion() {
    return this.currentQuestionIndex >= this.questions.length - 1;
  }

  /**
   * 戻ることができるかチェック
   * @returns {boolean}
   */
  canGoBack() {
    return this.FLOW_CONFIG.allowBackNavigation && this.currentQuestionIndex > 0;
  }

  /**
   * 進むことができるかチェック
   * @returns {boolean}
   */
  canGoNext() {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return false;
    
    if (this.FLOW_CONFIG.requireAllAnswers) {
      return this.isQuestionAnswered(currentQuestion.id);
    }
    
    return true;
  }

  /**
   * 進捗を計算
   * @returns {number}
   */
  calculateProgress() {
    if (this.questions.length === 0) return 0;
    
    const answeredCount = Object.keys(this.answers).length;
    return (answeredCount / this.questions.length) * 100;
  }

  /**
   * プログレスを更新
   */
  updateProgress() {
    const progress = this.calculateProgress();
    
    // グローバルプログレスバーの更新
    if (this.progressIndicator) {
      this.progressIndicator.update(progress);
    }
    
    // ローカルプログレスバーの更新
    const progressFill = this.$('.progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
    
    const progressText = this.$('.progress-text span');
    if (progressText) {
      progressText.textContent = `進捗: ${Math.round(progress)}%`;
    }
  }

  /**
   * ナビゲーションを更新
   */
  updateNavigation() {
    const prevBtn = this.$('#prev-question-btn');
    const nextBtn = this.$('#next-question-btn');
    
    if (prevBtn) {
      prevBtn.disabled = !this.canGoBack();
      prevBtn.classList.toggle('disabled', !this.canGoBack());
    }
    
    if (nextBtn) {
      nextBtn.disabled = !this.canGoNext();
      nextBtn.classList.toggle('disabled', !this.canGoNext());
      
      if (this.isLastQuestion()) {
        nextBtn.textContent = '結果を見る →';
      } else {
        nextBtn.textContent = '次の質問 →';
      }
    }
  }

  /**
   * インデックスで選択肢を選択
   * @param {number} optionIndex - 選択肢インデックス
   */
  selectOptionByIndex(optionIndex) {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion || !currentQuestion.options[optionIndex]) return;
    
    const option = currentQuestion.options[optionIndex];
    const input = this.$(`input[value="${option.value}"]`);
    
    if (input) {
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  /**
   * バリデーションメッセージを表示
   * @param {string} message - メッセージ
   */
  showValidationMessage(message) {
    const messageContainer = this.$('#validation-message');
    const messageText = this.$('.validation-text');
    
    if (messageContainer && messageText) {
      messageText.textContent = message;
      messageContainer.style.display = 'block';
      messageContainer.classList.add('animate-fadeIn');
      
      // 自動非表示
      if (this.VALIDATION_CONFIG.errorTimeout > 0) {
        setTimeout(() => {
          this.hideValidationMessage();
        }, this.VALIDATION_CONFIG.errorTimeout);
      }
    }
  }

  /**
   * バリデーションメッセージを非表示
   */
  hideValidationMessage() {
    const messageContainer = this.$('#validation-message');
    
    if (messageContainer) {
      messageContainer.style.display = 'none';
      messageContainer.classList.remove('animate-fadeIn');
    }
  }

  /**
   * 履歴に追加
   * @param {string} action - アクション
   */
  addToHistory(action) {
    this.questionHistory.push({
      questionIndex: this.currentQuestionIndex,
      action,
      timestamp: Date.now()
    });
    
    // 履歴の制限
    if (this.questionHistory.length > this.FLOW_CONFIG.maxHistoryLength) {
      this.questionHistory = this.questionHistory.slice(-this.FLOW_CONFIG.maxHistoryLength);
    }
  }

  /**
   * 進捗を保存
   */
  saveProgress() {
    if (!this.storageManager) return;
    
    const progressData = {
      currentQuestionIndex: this.currentQuestionIndex,
      answers: this.answers,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    this.storageManager.save('progress', progressData, {
      expiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24時間
    });
  }

  /**
   * 進捗を復元
   */
  restoreProgress() {
    if (!this.storageManager) return;
    
    const progressData = this.storageManager.load('progress');
    
    if (progressData) {
      this.currentQuestionIndex = progressData.currentQuestionIndex || 0;
      this.answers = progressData.answers || {};
      
      this.log('info', 'restoreProgress', 'Progress restored', {
        currentQuestionIndex: this.currentQuestionIndex,
        answerCount: Object.keys(this.answers).length
      });
    }
  }

  /**
   * 自動保存を開始
   */
  startAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    
    this.autoSaveInterval = setInterval(() => {
      this.saveProgress();
    }, this.FLOW_CONFIG.autoSaveInterval);
  }

  /**
   * 自動保存を停止
   */
  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  /**
   * 質問フローをリセット
   */
  reset() {
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionHistory = [];
    
    // 保存された進捗を削除
    if (this.storageManager) {
      this.storageManager.remove('progress');
    }
    
    // 再レンダリング
    this.render();
    
    this.emit('flowReset');
  }

  /**
   * すべての回答を取得
   * @returns {Object}
   */
  getAllAnswers() {
    return { ...this.answers };
  }

  /**
   * 進捗情報を取得
   * @returns {Object}
   */
  getProgressInfo() {
    return {
      currentQuestionIndex: this.currentQuestionIndex,
      totalQuestions: this.questions.length,
      answeredCount: Object.keys(this.answers).length,
      progressPercentage: this.calculateProgress(),
      isCompleted: this.areAllQuestionsAnswered(),
      canGoBack: this.canGoBack(),
      canGoNext: this.canGoNext()
    };
  }

  /**
   * コンポーネント破棄
   */
  destroy() {
    // 自動保存停止
    this.stopAutoSave();
    
    // 最終保存
    if (this.options.saveProgress) {
      this.saveProgress();
    }
    
    super.destroy();
  }
}

// グローバルに公開
window.QuestionFlow = QuestionFlow;