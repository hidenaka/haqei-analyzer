/**
 * QuestionManager v2.0
 * 30問フロー完全管理システム
 * 
 * HaQei哲学準拠：
 * - 確実性（各質問の確実な表示）
 * - 効率性（最適化されたレンダリング）
 * - 調和性（全体フローとの統合）
 */

class QuestionManager {
  constructor(options = {}) {
    this.container = options.container || null;
    this.displayController = options.displayController || null;
    this.storageManager = options.storageManager || null;
    
    // v4.3.1 決定論的要件: SeedableRandom統合
    this.rng = options.randomnessManager || window.randomnessManager || 
               (() => { throw new Error('RandomnessManager required for deterministic behavior'); });
    
    // 状態管理
    this.questions = [];
    this.currentIndex = 0;
    this.answers = new Map();
    this.renderedQuestions = new Map();
    
    // イベント管理
    this.eventHandlers = new Map();
    this.onProgress = options.onProgress || null;
    this.onComplete = options.onComplete || null;
    this.onError = options.onError || null;
    
    // パフォーマンス追跡
    this.metrics = {
      renderCount: 0,
      totalRenderTime: 0,
      errorCount: 0,
      startTime: Date.now()
    };
    
    console.log('📋 QuestionManager v2.0 initialized');
  }

  /**
   * 初期化：質問データの読み込みと準備
   */
  async initialize() {
    try {
      console.log('📋 QuestionManager initializing...');
      
      // 質問データを読み込み
      this.loadQuestions();
      
      // DisplayController を初期化
      if (!this.displayController && typeof DisplayController !== 'undefined') {
        this.displayController = new DisplayController({
          container: this.container,
          debugMode: true,
          autoFix: true
        });
      }
      
      // イベントリスナーを設定
      this.setupEventListeners();
      
      console.log(`📋 QuestionManager initialized with ${this.questions.length} questions`);
      return true;
      
    } catch (error) {
      console.error('❌ QuestionManager initialization failed:', error);
      this.metrics.errorCount++;
      return false;
    }
  }

  /**
   * 質問データの読み込み
   */
  async loadQuestions() {
    try {
      // グローバルデータから質問を取得
      let allQuestions = [];
      
      if (typeof WORLDVIEW_QUESTIONS !== 'undefined') {
        allQuestions = allQuestions.concat(WORLDVIEW_QUESTIONS);
      }
      
      if (typeof SCENARIO_QUESTIONS !== 'undefined') {
        allQuestions = allQuestions.concat(SCENARIO_QUESTIONS);
      }
      
      if (allQuestions.length === 0) {
        throw new Error('No question data available');
      }
      
      // 質問をシャッフル（オプション）
      this.questions = this.shuffleQuestions(allQuestions);
      
      // 30問に制限
      if (this.questions.length > 30) {
        this.questions = this.questions.slice(0, 30);
      }
      
      console.log(`📋 Loaded ${this.questions.length} questions`);
      return true;
      
    } catch (error) {
      console.error('❌ Failed to load questions:', error);
      
      // フォールバック用のデモ質問
      this.questions = this.generateFallbackQuestions();
      return false;
    }
  }

  /**
   * 質問をシャッフル（Fisher-Yates アルゴリズム）
   */
  shuffleQuestions(questions) {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.rng.nextInt(0, i); // 決定論的Fisher-Yatesシャッフル
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * 現在の質問を表示
   */
  async showCurrentQuestion() {
    const startTime = performance.now();
    
    try {
      const question = this.questions[this.currentIndex];
      if (!question) {
        throw new Error('No current question available');
      }
      
      console.log(`📋 Showing question ${this.currentIndex + 1}/${this.questions.length}: ${question.id}`);
      
      // 既存の質問要素をクリア
      this.clearContainer();
      
      // HaqeiQuestionElement を作成
      const questionElement = this.createQuestionElement(question);
      
      // コンテナに追加
      if (this.container) {
        this.container.appendChild(questionElement);
      }
      
      // 表示状態を確保
      if (this.displayController) {
        const success = this.displayController.ensureElementVisible(questionElement, {
          forceDisplay: true,
          useImportant: true,
          clearConflicts: true,
          observeChanges: true
        });
        
        if (!success) {
          console.warn(`⚠️ Failed to ensure visibility for question ${question.id}`);
        }
      }
      
      // 既存回答を復元
      this.restoreAnswer(questionElement, question.id);
      
      // レンダリング情報を記録
      this.renderedQuestions.set(question.id, {
        element: questionElement,
        renderTime: performance.now() - startTime,
        timestamp: Date.now()
      });
      
      // メトリクス更新
      this.metrics.renderCount++;
      this.metrics.totalRenderTime += performance.now() - startTime;
      
      // 進捗報告
      this.reportProgress();
      
      console.log(`✅ Question ${question.id} rendered in ${(performance.now() - startTime).toFixed(2)}ms`);
      
    } catch (error) {
      console.error(`❌ Failed to show question ${this.currentIndex}:`, error);
      this.metrics.errorCount++;
      
      if (this.onError) {
        this.onError(error);
      }
    }
  }

  /**
   * HaqeiQuestionElement を作成
   */
  async createQuestionElement(question) {
    // Web Components が利用可能な場合
    if (typeof HaqeiQuestionElement !== 'undefined') {
      const element = document.createElement('haqei-question');
      element.dataset.questionId = question.id;
      element.dataset.questionType = this.getQuestionType(question);
      element.setAttribute('animated', '');
      
      return element;
    }
    
    // フォールバック: 通常のHTML要素
    return this.createFallbackQuestionElement(question);
  }

  /**
   * フォールバック用質問要素作成
   */
  createFallbackQuestionElement(question) {
    const div = document.createElement('div');
    div.className = 'question-fallback';
    div.innerHTML = `
      <div class="question-header">
        <h3>${question.title || question.question || 'Question'}</h3>
      </div>
      <div class="question-content">
        <p>質問の表示でエラーが発生しました。ページを再読み込みしてください。</p>
        <button onclick="window.location.reload()">再読み込み</button>
      </div>
    `;
    return div;
  }

  /**
   * 質問タイプを判定
   */
  getQuestionType(question) {
    // シナリオ質問の判定
    if (question.scenario || 
        (question.options && typeof question.options === 'object' && !Array.isArray(question.options))) {
      return 'scenario';
    }
    
    // 通常の価値観質問
    return 'value';
  }

  /**
   * コンテナをクリア
   */
  clearContainer() {
    if (this.container) {
      // 既存の質問要素を削除
      const existingQuestions = this.container.querySelectorAll('haqei-question, .question-fallback');
      existingQuestions.forEach(element => {
        // クリーンアップ
        if (element.cleanup && typeof element.cleanup === 'function') {
          element.cleanup();
        }
        element.remove();
      });
    }
  }

  /**
   * 回答を処理
   */
  handleAnswer(questionId, answerData) {
    console.log(`📝 Answer received for ${questionId}:`, answerData);
    
    // 回答を保存
    this.answers.set(questionId, {
      ...answerData,
      timestamp: Date.now(),
      questionIndex: this.currentIndex
    });
    
    // ストレージに保存
    if (this.storageManager) {
      this.storageManager.saveAnswer(questionId, answerData);
    }
    
    // 自動で次の質問に進む（遅延を追加）
    setTimeout(() => {
      this.nextQuestion();
    }, 500);
  }

  /**
   * 既存回答を復元
   */
  restoreAnswer(questionElement, questionId) {
    const savedAnswer = this.answers.get(questionId);
    if (savedAnswer && questionElement.restoreAnswer) {
      questionElement.restoreAnswer(savedAnswer);
    }
  }

  /**
   * 次の質問に進む
   */
  async nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.showCurrentQuestion();
    } else {
      this.completeQuestionnaire();
    }
  }

  /**
   * 前の質問に戻る
   */
  async previousQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.showCurrentQuestion();
    }
  }

  /**
   * 質問番号に直接ジャンプ
   */
  async jumpToQuestion(index) {
    if (index >= 0 && index < this.questions.length) {
      this.currentIndex = index;
      this.showCurrentQuestion();
    }
  }

  /**
   * 進捗を報告
   */
  reportProgress() {
    const progress = {
      currentIndex: this.currentIndex,
      totalQuestions: this.questions.length,
      answeredCount: this.answers.size,
      progressPercentage: ((this.currentIndex + 1) / this.questions.length) * 100
    };
    
    if (this.onProgress) {
      this.onProgress(progress);
    }
  }

  /**
   * アンケート完了処理
   */
  completeQuestionnaire() {
    console.log('🎊 Questionnaire completed!');
    
    // 回答データを整理
    const answersArray = Array.from(this.answers.entries()).map(([questionId, answerData]) => ({
      questionId,
      ...answerData
    }));
    
    // 完了時のメトリクス
    const completionMetrics = {
      totalTime: Date.now() - this.metrics.startTime,
      averageRenderTime: this.metrics.totalRenderTime / this.metrics.renderCount,
      errorRate: this.metrics.errorCount / this.metrics.renderCount,
      completionRate: (this.answers.size / this.questions.length) * 100
    };
    
    console.log('📊 Completion metrics:', completionMetrics);
    
    if (this.onComplete) {
      this.onComplete({
        answers: answersArray,
        metrics: completionMetrics,
        originalAnswers: answersArray, // 互換性のため
        preparedAnswers: this.prepareAnswersForAnalysis(answersArray)
      });
    }
  }

  /**
   * 分析用に回答データを準備
   */
  prepareAnswersForAnalysis(answers) {
    return answers.map(answer => ({
      questionId: answer.questionId,
      selectedValue: answer.value || answer.selectedValue,
      selectedChoice: answer.selectedChoice || `${answer.questionId}${answer.value}`,
      choiceText: answer.choiceText || answer.text,
      scoringTags: answer.scoringTags || [],
      timestamp: answer.timestamp,
      choiceType: answer.choiceType || null
    }));
  }

  /**
   * イベントリスナーを設定
   */
  setupEventListeners() {
    // answer-change イベントをリッスン
    if (this.container) {
      this.container.addEventListener('answer-change', (event) => {
        const { questionId, value, scoringTags, choiceType } = event.detail;
        this.handleAnswer(questionId, {
          value,
          scoringTags,
          choiceType,
          selectedValue: value,
          choiceText: event.target.textContent || `選択肢${value}`
        });
      });
    }
    
    console.log('📋 Event listeners set up');
  }

  /**
   * フォールバック用デモ質問を生成
   */
  generateFallbackQuestions() {
    const fallbackQuestions = [];
    for (let i = 1; i <= 5; i++) {
      fallbackQuestions.push({
        id: `fallback_${i}`,
        title: `デモ質問 ${i}`,
        question: `これは質問データ読み込み失敗時のデモ質問です（${i}/5）`,
        options: [
          { id: 'a', text: '選択肢A', scoring_tags: [] },
          { id: 'b', text: '選択肢B', scoring_tags: [] },
          { id: 'c', text: '選択肢C', scoring_tags: [] }
        ]
      });
    }
    return fallbackQuestions;
  }

  /**
   * 統計情報を取得
   */
  getStats() {
    return {
      ...this.metrics,
      questionsLoaded: this.questions.length,
      currentProgress: this.currentIndex + 1,
      answersCollected: this.answers.size,
      completionRate: (this.answers.size / this.questions.length) * 100,
      displayControllerStats: this.displayController ? this.displayController.getStats() : null
    };
  }

  /**
   * クリーンアップ
   */
  destroy() {
    // 全ての質問要素をクリーンアップ
    this.clearContainer();
    
    // DisplayController をクリーンアップ
    if (this.displayController) {
      this.displayController.destroy();
    }
    
    // イベントハンドラーをクリア
    this.eventHandlers.clear();
    
    console.log('📋 QuestionManager destroyed', this.getStats());
  }
}

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.QuestionManager = QuestionManager;
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuestionManager;
}