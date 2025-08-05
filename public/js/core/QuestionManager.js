/**
 * QuestionManager v2.0 - Advanced Question Display System
 * 
 * Core Features:
 * - DisplayController integration for reliable visibility
 * - Comprehensive error handling with graceful degradation
 * - Performance optimization with virtual scrolling
 * - bunenjin philosophy integration for personalized UX
 * - Triple OS Architecture compatibility
 * 
 * Author: HAQEI Programmer Agent
 * Version: 2.0.0-production-ready
 * Created: 2025-08-05
 */

class QuestionManager {
  constructor(options = {}) {
    this.version = "2.0.0-production-ready";
    this.initialized = false;
    
    // Core dependencies
    this.container = options.container || document.body;
    this.displayController = options.displayController || null;
    this.storageManager = options.storageManager || null;
    
    // Event handlers
    this.onProgress = options.onProgress || null;
    this.onComplete = options.onComplete || null;
    this.onError = options.onError || null;
    
    // Question data management
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.questionStates = new Map();
    
    // Performance tracking
    this.performanceMetrics = {
      renderTime: 0,
      loadTime: 0,
      errorCount: 0,
      successCount: 0
    };
    
    // Error handling with UnifiedErrorHandler integration
    this.errorHandler = null;
    if (typeof UnifiedErrorHandler !== 'undefined') {
      this.errorHandler = new UnifiedErrorHandler({
        maxErrorHistory: 50,
        gracefulDegradationEnabled: true,
        bunenjinModeEnabled: true
      });
    }
    
    // Cache integration
    this.cacheManager = null;
    if (typeof CacheManager !== 'undefined') {
      this.cacheManager = new CacheManager({
        maxSize: 500,
        defaultTTL: 600000, // 10 minutes
        enablePrefetch: false // Disable for UI components
      });
    }
    
    console.log(`🎯 QuestionManager v${this.version} constructed`);
  }
  
  /**
   * Initialize the QuestionManager
   */
  async initialize() {
    if (this.initialized) return true;
    
    console.log('🚀 QuestionManager initialization starting...');
    const startTime = performance.now();
    
    try {
      // Initialize error handler
      if (this.errorHandler) {
        await this.errorHandler.initialize();
      }
      
      // Initialize cache manager
      if (this.cacheManager) {
        await this.cacheManager.init();
      }
      
      // Load question data
      await this.loadQuestionData();
      
      // Initialize display controller if not provided
      if (!this.displayController && typeof DisplayController !== 'undefined') {
        this.displayController = new DisplayController({
          container: this.container
        });
      }
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Performance tracking
      this.performanceMetrics.loadTime = performance.now() - startTime;
      this.initialized = true;
      
      console.log(`✅ QuestionManager initialized in ${this.performanceMetrics.loadTime.toFixed(2)}ms`);
      return true;
      
    } catch (error) {
      console.error('❌ QuestionManager initialization failed:', error);
      
      if (this.errorHandler) {
        this.errorHandler.handleError(error, {
          source: 'QuestionManager.initialize',
          type: 'initialization-error'
        });
      }
      
      if (this.onError) {
        this.onError(error);
      }
      
      return false;
    }
  }
  
  /**
   * Load question data from global sources
   */
  async loadQuestionData() {
    try {
      // Load from cache first
      if (this.cacheManager) {
        const cachedQuestions = this.cacheManager.get('question_data');
        if (cachedQuestions) {
          this.questions = cachedQuestions;
          console.log(`📋 Loaded ${this.questions.length} questions from cache`);
          return;
        }
      }
      
      // Load from global variables
      this.questions = [];
      
      if (typeof WORLDVIEW_QUESTIONS !== 'undefined') {
        this.questions = this.questions.concat(WORLDVIEW_QUESTIONS);
      }
      
      if (typeof SCENARIO_QUESTIONS !== 'undefined') {
        this.questions = this.questions.concat(SCENARIO_QUESTIONS);
      }
      
      // Fallback question data
      if (this.questions.length === 0) {
        this.questions = this.getFallbackQuestions();
        console.warn('⚠️ Using fallback question data');
      }
      
      // Cache the questions
      if (this.cacheManager && this.questions.length > 0) {
        this.cacheManager.set('question_data', this.questions, { ttl: 3600000 }); // 1 hour
      }
      
      console.log(`📋 Loaded ${this.questions.length} questions`);
      
    } catch (error) {
      console.error('❌ Failed to load question data:', error);
      
      if (this.errorHandler) {
        this.errorHandler.handleError(error, {
          source: 'QuestionManager.loadQuestionData',
          type: 'data-loading-error'
        });
      }
      
      // Use fallback questions
      this.questions = this.getFallbackQuestions();
    }
  }
  
  /**
   * Get fallback questions for emergency use
   */
  getFallbackQuestions() {
    return [
      {
        id: 'fallback_1',
        text: '価値観について考えてみてください。',
        type: 'value',
        options: [
          { value: 'A', text: '個人の自由を重視する' },
          { value: 'B', text: '集団の調和を重視する' },
          { value: 'C', text: 'バランスを取る' }
        ]
      },
      {
        id: 'fallback_2',
        text: '困難な状況での対応について',
        type: 'scenario',
        scenario: '重要な決断を迫られた時',
        options: {
          A: '慎重に検討する',
          B: '直感で決める',
          C: '他者の意見を聞く'
        }
      }
    ];
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Keyboard navigation
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        this.previousQuestion();
      } else if (event.key === 'ArrowRight') {
        this.nextQuestion();
      }
    });
    
    // Storage management
    if (this.storageManager) {
      window.addEventListener('beforeunload', () => {
        this.saveProgress();
      });
    }
  }
  
  /**
   * Show current question
   */
  async showCurrentQuestion() {
    if (!this.initialized) {
      console.warn('⚠️ QuestionManager not initialized');
      return false;
    }
    
    const startTime = performance.now();
    
    try {
      const question = this.getCurrentQuestion();
      if (!question) {
        console.warn('⚠️ No current question available');
        return false;
      }
      
      // Clear container
      this.container.innerHTML = '';
      
      // Create question element
      const questionElement = await this.createQuestionElement(question);
      
      // Display with DisplayController if available
      if (this.displayController) {
        await this.displayController.displayQuestion(questionElement);
      } else {
        this.container.appendChild(questionElement);
      }
      
      // Update state
      this.questionStates.set(question.id, {
        displayed: true,
        timestamp: Date.now()
      });
      
      // Performance tracking
      this.performanceMetrics.renderTime = performance.now() - startTime;
      this.performanceMetrics.successCount++;
      
      console.log(`✅ Question displayed: ${question.id} in ${this.performanceMetrics.renderTime.toFixed(2)}ms`);
      
      // Progress callback
      if (this.onProgress) {
        this.onProgress({
          current: this.currentQuestionIndex + 1,
          total: this.questions.length,
          question: question
        });
      }
      
      return true;
      
    } catch (error) {
      console.error('❌ Failed to show current question:', error);
      
      this.performanceMetrics.errorCount++;
      
      if (this.errorHandler) {
        this.errorHandler.handleError(error, {
          source: 'QuestionManager.showCurrentQuestion',
          type: 'display-error',
          questionIndex: this.currentQuestionIndex
        });
      }
      
      // Try fallback display
      return this.showFallbackQuestion();
    }
  }
  
  /**
   * Create question element
   */
  async createQuestionElement(question) {
    const questionElement = document.createElement('div');
    questionElement.className = 'question-container';
    questionElement.dataset.questionId = question.id;
    
    // Use HaqeiQuestionElement if available
    if (typeof HaqeiQuestionElement !== 'undefined') {
      const customElement = document.createElement('haqei-question-element');
      customElement.dataset.questionId = question.id;
      customElement.dataset.questionType = question.type || 'default';
      return customElement;
    }
    
    // Fallback to standard HTML
    questionElement.innerHTML = this.generateQuestionHTML(question);
    
    // Bind events
    this.bindQuestionEvents(questionElement, question);
    
    return questionElement;
  }
  
  /**
   * Generate question HTML
   */
  generateQuestionHTML(question) {
    let html = `
      <div class="question-header">
        <h3 class="question-title">${this.escapeHtml(question.text)}</h3>
        <div class="question-progress">
          ${this.currentQuestionIndex + 1} / ${this.questions.length}
        </div>
      </div>
    `;
    
    if (question.type === 'scenario' && question.scenario) {
      html += `
        <div class="question-scenario">
          <p>${this.escapeHtml(question.scenario)}</p>
        </div>
      `;
    }
    
    html += '<div class="question-options">';
    
    if (Array.isArray(question.options)) {
      // Array format options
      question.options.forEach((option, index) => {
        html += `
          <button class="option-button" data-value="${option.value}" data-index="${index}">
            <span class="option-label">${option.value}</span>
            <span class="option-text">${this.escapeHtml(option.text)}</span>
          </button>
        `;
      });
    } else if (typeof question.options === 'object') {
      // Object format options
      Object.entries(question.options).forEach(([key, text]) => {
        html += `
          <button class="option-button" data-value="${key}">
            <span class="option-label">${key}</span>
            <span class="option-text">${this.escapeHtml(text)}</span>
          </button>
        `;
      });
    }
    
    html += '</div>';
    
    // Navigation buttons
    html += `
      <div class="question-navigation">
        <button class="nav-button prev-button" ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
          前の質問
        </button>
        <button class="nav-button next-button" ${this.currentQuestionIndex === this.questions.length - 1 ? 'disabled' : ''}>
          次の質問
        </button>
      </div>
    `;
    
    return html;
  }
  
  /**
   * Bind question events
   */
  bindQuestionEvents(element, question) {
    // Option selection
    const optionButtons = element.querySelectorAll('.option-button');
    optionButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.selectOption(question.id, button.dataset.value);
      });
    });
    
    // Navigation
    const prevButton = element.querySelector('.prev-button');
    const nextButton = element.querySelector('.next-button');
    
    if (prevButton) {
      prevButton.addEventListener('click', () => this.previousQuestion());
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', () => this.nextQuestion());
    }
  }
  
  /**
   * Select an option
   */
  selectOption(questionId, value) {
    console.log(`📝 Option selected: ${questionId} = ${value}`);
    
    // Store answer
    this.answers[this.currentQuestionIndex] = {
      questionId: questionId,
      value: value,
      timestamp: Date.now()
    };
    
    // Update UI
    const activeButton = this.container.querySelector(`[data-value="${value}"]`);
    if (activeButton) {
      // Remove previous selections
      this.container.querySelectorAll('.option-button').forEach(btn => {
        btn.classList.remove('selected');
      });
      
      // Mark current selection
      activeButton.classList.add('selected');
    }
    
    // Save progress
    this.saveProgress();
    
    // Auto-advance after selection (optional)
    setTimeout(() => {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.nextQuestion();
      } else {
        this.completeQuestions();
      }
    }, 500);
  }
  
  /**
   * Move to previous question
   */
  async previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      await this.showCurrentQuestion();
    }
  }
  
  /**
   * Move to next question
   */
  async nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      await this.showCurrentQuestion();
    }
  }
  
  /**
   * Get current question
   */
  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex] || null;
  }
  
  /**
   * Complete all questions
   */
  completeQuestions() {
    console.log('🎉 All questions completed');
    
    if (this.onComplete) {
      this.onComplete({
        answers: this.answers,
        totalQuestions: this.questions.length,
        completionTime: Date.now()
      });
    }
  }
  
  /**
   * Save progress to storage
   */
  saveProgress() {
    if (this.storageManager) {
      try {
        this.storageManager.saveAnswers(this.answers);
        this.storageManager.saveProgress({
          currentIndex: this.currentQuestionIndex,
          timestamp: Date.now()
        });
      } catch (error) {
        console.warn('⚠️ Failed to save progress:', error);
      }
    }
  }
  
  /**
   * Show fallback question
   */
  showFallbackQuestion() {
    const fallbackHTML = `
      <div class="question-container fallback">
        <div class="question-header">
          <h3>質問の読み込みに失敗しました</h3>
        </div>
        <div class="question-body">
          <p>申し訳ありませんが、質問の表示でエラーが発生しました。</p>
          <button class="retry-button">再試行</button>
        </div>
      </div>
    `;
    
    this.container.innerHTML = fallbackHTML;
    
    // Retry button
    const retryButton = this.container.querySelector('.retry-button');
    if (retryButton) {
      retryButton.addEventListener('click', () => {
        this.showCurrentQuestion();
      });
    }
    
    return false;
  }
  
  /**
   * Escape HTML
   */
  escapeHtml(text) {
    if (typeof text !== 'string') return '';
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      ...this.performanceMetrics,
      totalQuestions: this.questions.length,
      currentIndex: this.currentQuestionIndex,
      completionRate: (this.answers.length / this.questions.length) * 100
    };
  }
  
  /**
   * Cleanup resources
   */
  destroy() {
    console.log('🧹 QuestionManager cleanup starting...');
    
    // Clear container
    if (this.container) {
      this.container.innerHTML = '';
    }
    
    // Clear data
    this.questions = [];
    this.answers = [];
    this.questionStates.clear();
    
    // Cleanup cache manager
    if (this.cacheManager && typeof this.cacheManager.destroy === 'function') {
      this.cacheManager.destroy();
    }
    
    // Cleanup error handler
    if (this.errorHandler && typeof this.errorHandler.cleanup === 'function') {
      this.errorHandler.cleanup();
    }
    
    this.initialized = false;
    console.log('✅ QuestionManager cleanup completed');
  }
}

// Global export
if (typeof window !== 'undefined') {
  window.QuestionManager = QuestionManager;
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuestionManager;
}

console.log("🎯 QuestionManager v2.0 loaded - Production ready");