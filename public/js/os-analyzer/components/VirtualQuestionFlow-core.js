/**
 * VirtualQuestionFlow Core Module - Streamlined Version
 * 仮想スクロール実装の核心機能のみを抽出し、2,127行から400行に削減
 */

class VirtualQuestionFlowCore extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, options);
    
    // コア設定
    this.questions = options.questions || [];
    this.answers = [];
    this.currentQuestionIndex = 0;
    this.bufferSize = 2; // 表示バッファサイズ
    
    // パフォーマンス管理
    this.elementPool = new Map();
    this.activeElements = new Map();
    this.visibleRange = { start: 0, end: 0 };
    
    // 統合サービス（DisplayController, QuestionManager統合）
    this.initializeIntegratedServices(options);
    
    // DOM初期化
    this.initializeDOM();
    this.initializeEventListeners();
    
    console.log('✅ VirtualQuestionFlow Core initialized');
  }
  
  /**
   * 統合サービス初期化
   */
  initializeIntegratedServices(options) {
    // DisplayController v2.0統合
    if (typeof DisplayController !== 'undefined') {
      this.displayController = new DisplayController({ container: this.container });
      console.log('🎯 DisplayController integrated');
    }
    
    // QuestionManager v2.0統合
    if (typeof QuestionManager !== 'undefined') {
      this.questionManager = new QuestionManager({
        container: this.container,
        displayController: this.displayController,
        onProgress: options.onProgress,
        onComplete: options.onComplete
      });
      console.log('📋 QuestionManager v2.0 integrated');
    }
    
    // CacheManager統合
    if (typeof CacheManager !== 'undefined') {
      this.cacheManager = new CacheManager({ maxSize: 2000, defaultTTL: 900000 });
      console.log('💾 CacheManager integrated');
    }
    
    // PerformanceOptimizer統合
    if (typeof PerformanceOptimizer !== 'undefined') {
      this.performanceOptimizer = new PerformanceOptimizer();
      console.log('⚡ PerformanceOptimizer integrated');
    }
  }
  
  /**
   * DOM初期化（統合バージョン）
   */
  initializeDOM() {
    this.container.innerHTML = `
      <div id="virtual-container" class="virtual-container">
        <div id="virtual-viewport" class="virtual-viewport"></div>
        <div id="navigation-controls" class="navigation-controls">
          <button id="prev-btn" class="nav-button" disabled>前へ</button>
          <span id="progress-indicator" class="progress-indicator">1 / ${this.questions.length}</span>
          <button id="next-btn" class="nav-button">次へ</button>
        </div>
      </div>
    `;
  }
  
  /**
   * イベントリスナー初期化
   */
  initializeEventListeners() {
    // ナビゲーションボタン
    const prevBtn = this.container.querySelector('#prev-btn');
    const nextBtn = this.container.querySelector('#next-btn');
    
    prevBtn?.addEventListener('click', () => this.goToPrevious());
    nextBtn?.addEventListener('click', () => this.goToNext());
    
    // キーボードナビゲーション
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.goToPrevious();
      if (e.key === 'ArrowRight') this.goToNext();
    });
  }
  
  /**
   * 設問開始
   */
  async start() {
    if (this.questions.length === 0) {
      console.error('❌ No questions provided');
      return;
    }
    
    // 初期表示範囲設定
    this.updateVisibleRange();
    
    // 初期設問をレンダリング
    await this.renderVisibleQuestions();
    
    // 最初の設問を表示
    this.showCurrentQuestion();
    
    console.log('🚀 VirtualQuestionFlow Core started');
  }
  
  /**
   * 表示範囲更新
   */
  updateVisibleRange() {
    const start = Math.max(0, this.currentQuestionIndex - this.bufferSize);
    const end = Math.min(this.questions.length - 1, this.currentQuestionIndex + this.bufferSize);
    
    this.visibleRange = { start, end };
    console.log(`📏 Visible range: ${start}-${end}`);
  }
  
  /**
   * 表示範囲の設問をレンダリング
   */
  async renderVisibleQuestions() {
    // 非表示範囲の要素をプールに返却
    this.returnInactiveElementsToPool();
    
    // 表示範囲の要素を作成/表示
    for (let i = this.visibleRange.start; i <= this.visibleRange.end; i++) {
      await this.createQuestionElement(i);
    }
  }
  
  /**
   * 設問要素作成
   */
  async createQuestionElement(questionIndex) {
    const question = this.questions[questionIndex];
    if (!question || this.activeElements.has(questionIndex)) return;
    
    let questionElement;
    
    // プールから再利用を試行
    questionElement = this.getElementFromPool(question.id);
    
    if (!questionElement) {
      // Web Component作成
      try {
        questionElement = document.createElement('haqei-question');
        questionElement.dataset.questionId = question.id;
        questionElement.dataset.questionIndex = questionIndex;
        questionElement.setAttribute('data-question-id', question.id);
        
        // 設問データを設定
        if (questionElement.setQuestionData) {
          await questionElement.setQuestionData(question);
        }
        
        // 回答変更リスナー
        questionElement.addEventListener('answerChange', (e) => {
          this.handleAnswerChange(e.detail);
        });
        
      } catch (error) {
        console.error(`❌ Web Component creation failed for ${question.id}:`, error);
        questionElement = this.createFallbackElement(question);
      }
    }
    
    // アクティブ要素として管理
    this.activeElements.set(questionIndex, questionElement);
    
    // ビューポートに追加
    const viewport = this.container.querySelector('#virtual-viewport');
    if (viewport && !questionElement.parentNode) {
      viewport.appendChild(questionElement);
    }
    
    // 既存回答の復元
    const existingAnswer = this.findAnswerByQuestionId(question.id);
    if (existingAnswer && questionElement.restoreAnswer) {
      questionElement.restoreAnswer(existingAnswer);
    }
  }
  
  /**
   * フォールバック要素作成
   */
  createFallbackElement(question) {
    const element = document.createElement('div');
    element.className = 'question-fallback';
    element.dataset.questionId = question.id;
    
    element.innerHTML = `
      <div class="question-content">
        <h3 class="question-title">${question.title || `設問 ${question.number}`}</h3>
        <p class="question-text">${question.text}</p>
        <div class="question-choices">
          ${question.choices?.map((choice, index) => `
            <label class="choice-label">
              <input type="radio" name="${question.id}" value="${choice.value}" />
              <span class="choice-text">${choice.text}</span>
            </label>
          `).join('') || ''}
        </div>
      </div>
    `;
    
    // 回答変更イベント
    element.addEventListener('change', (event) => {
      if (event.target.type === 'radio') {
        this.handleAnswerChange({
          questionId: question.id,
          value: event.target.value,
          scoringTags: [],
          choiceType: null
        });
      }
    });
    
    console.log(`✅ Fallback element created for ${question.id}`);
    return element;
  }
  
  /**
   * 現在の設問を表示
   */
  showCurrentQuestion() {
    const currentIndex = this.currentQuestionIndex;
    
    // 全要素を非表示
    for (const [index, element] of this.activeElements) {
      if (index !== currentIndex) {
        element.style.display = 'none';
        element.setAttribute('aria-hidden', 'true');
      }
    }
    
    // 現在の要素を表示
    const currentElement = this.activeElements.get(currentIndex);
    if (currentElement) {
      currentElement.style.display = 'block';
      currentElement.style.opacity = '1';
      currentElement.style.visibility = 'visible';
      currentElement.setAttribute('aria-hidden', 'false');
      
      console.log(`🎯 Showing question: ${currentElement.dataset.questionId}`);
    }
  }
  
  /**
   * 回答変更処理
   */
  handleAnswerChange(detail) {
    const { questionId, value, scoringTags, choiceType } = detail;
    
    // 回答データを更新
    let answerIndex = this.findAnswerIndex(questionId);
    let answer;
    
    if (answerIndex >= 0) {
      answer = this.answers[answerIndex];
    } else {
      answer = { questionId, timestamp: new Date().toISOString() };
      answerIndex = this.answers.length;
      this.answers.push(answer);
    }
    
    // 回答内容を設定
    answer.selectedValue = value;
    answer.selectedChoice = `${questionId}${value.toLowerCase()}`;
    answer.scoring_tags = scoringTags;
    
    // 保存
    if (this.storageManager) {
      this.storageManager.saveAnswers(this.answers);
    }
    
    // UI更新
    this.updateProgress();
    this.updateNavigationButtons();
    
    console.log(`📝 Answer updated for ${questionId}:`, value);
    
    // 完了チェック
    if (this.getCompletedCount() === this.questions.length) {
      this.checkCompletion();
    }
  }
  
  /**
   * ナビゲーション：次へ
   */
  goToNext() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.updateVisibleRange();
      this.renderVisibleQuestions();
      this.showCurrentQuestion();
      this.updateNavigationButtons();
      this.updateProgress();
    }
  }
  
  /**
   * ナビゲーション：前へ
   */
  goToPrevious() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.updateVisibleRange();
      this.renderVisibleQuestions();
      this.showCurrentQuestion();
      this.updateNavigationButtons();
      this.updateProgress();
    }
  }
  
  /**
   * プログレス更新
   */
  updateProgress() {
    const indicator = this.container.querySelector('#progress-indicator');
    if (indicator) {
      const completed = this.getCompletedCount();
      indicator.textContent = `${this.currentQuestionIndex + 1} / ${this.questions.length} (完了: ${completed})`;
    }
  }
  
  /**
   * ナビゲーションボタン更新
   */
  updateNavigationButtons() {
    const prevBtn = this.container.querySelector('#prev-btn');
    const nextBtn = this.container.querySelector('#next-btn');
    
    if (prevBtn) prevBtn.disabled = this.currentQuestionIndex === 0;
    if (nextBtn) nextBtn.disabled = this.currentQuestionIndex === this.questions.length - 1;
  }
  
  /**
   * 完了チェック
   */
  checkCompletion() {
    if (this.getCompletedCount() === this.questions.length) {
      console.log('🏁 All questions completed');
      
      if (this.options.onComplete) {
        setTimeout(() => {
          this.options.onComplete(this.answers);
        }, 1000);
      }
    }
  }
  
  /**
   * ユーティリティメソッド
   */
  getElementFromPool(questionId) {
    const pool = this.elementPool.get(questionId);
    return pool && pool.length > 0 ? pool.pop() : null;
  }
  
  returnElementToPool(questionId, element) {
    if (!this.elementPool.has(questionId)) {
      this.elementPool.set(questionId, []);
    }
    element.style.display = 'none';
    this.elementPool.get(questionId).push(element);
  }
  
  returnInactiveElementsToPool() {
    const elementsToReturn = [];
    
    for (const [index, element] of this.activeElements) {
      if (index < this.visibleRange.start || index > this.visibleRange.end) {
        elementsToReturn.push({ index, element });
      }
    }
    
    elementsToReturn.forEach(({ index, element }) => {
      const questionId = element.dataset.questionId;
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      this.returnElementToPool(questionId, element);
      this.activeElements.delete(index);
    });
  }
  
  findAnswerIndex(questionId) {
    return this.answers.findIndex(answer => answer.questionId === questionId);
  }
  
  findAnswerByQuestionId(questionId) {
    return this.answers.find(answer => answer.questionId === questionId);
  }
  
  getCompletedCount() {
    return this.answers.filter(answer => answer.selectedValue).length;
  }
  
  /**
   * クリーンアップ
   */
  destroy() {
    // イベントリスナー削除
    document.removeEventListener('keydown', this.handleKeydown);
    
    // プール削除
    this.elementPool.clear();
    this.activeElements.clear();
    
    // 統合サービスのクリーンアップ
    if (this.displayController?.destroy) {
      this.displayController.destroy();
    }
    
    console.log('🧹 VirtualQuestionFlow Core cleaned up');
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.VirtualQuestionFlowCore = VirtualQuestionFlowCore;
}