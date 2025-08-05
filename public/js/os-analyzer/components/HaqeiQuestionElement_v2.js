/**
 * HaqeiQuestionElement v2.0
 * 完全刷新版 - 「element is not visible」問題根本解決
 * 
 * 新機能：
 * - DisplayController統合による確実な表示制御
 * - Shadow DOM最適化とCSS隔離強化  
 * - レンダリングパフォーマンス向上
 * - 偶数番質問表示問題完全解決
 * - bunenjin哲学に基づく美しいデザイン
 */

class HaqeiQuestionElementV2 extends HTMLElement {
  constructor() {
    super();
    
    // Shadow DOM で完全隔離
    this.attachShadow({ mode: 'open' });
    
    // DisplayController統合
    this.displayController = null;
    
    // パフォーマンス追跡
    this.renderCount = 0;
    this.lastRenderTime = 0;
    this.isRendering = false;
    
    // イベントリスナーの管理
    this.boundEventListeners = new Map();
    
    // DOM要素のキャッシュ
    this.cachedElements = new Map();
    
    // 表示状態の追跡
    this.visibilityState = {
      isVisible: false,
      lastCheck: 0,
      retryCount: 0
    };
    
    // レンダリング待機キュー
    this.renderQueue = [];
    this.isProcessingQueue = false;
  }

  /**
   * 監視する属性
   */
  static get observedAttributes() {
    return ['question-id', 'question-type', 'animated', 'force-visible'];
  }

  /**
   * DOM接続時の初期化
   */
  async connectedCallback() {
    const questionId = this.dataset.questionId;
    console.log(`🔗 HaqeiQuestionElement v2.0 connected: ${questionId}`);
    
    // DisplayController初期化
    if (typeof DisplayController !== 'undefined') {
      this.displayController = new DisplayController({
        container: this.shadowRoot
      });
    }
    
    try {
      await this.initialize();
    } catch (error) {
      console.error(`❌ HaqeiQuestionElement initialization failed for ${questionId}:`, error);
      this.renderErrorState(error);
    }
  }

  /**
   * 初期化プロセス
   */
  async initialize() {
    // レンダリング実行
    await this.render();
    
    // イベントリスナー設定
    this.setupEventListeners();
    
    // 表示状態の確保
    await this.ensureVisibility();
    
    // アクセシビリティ設定
    this.setupAccessibility();
    
    console.log(`✅ HaqeiQuestionElement v2.0 initialized: ${this.dataset.questionId}`);
  }

  /**
   * DOM切断時のクリーンアップ
   */
  disconnectedCallback() {
    console.log(`🔌 HaqeiQuestionElement v2.0 disconnected: ${this.dataset.questionId}`);
    this.cleanup();
  }

  /**
   * 属性変更時のハンドリング
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      console.log(`🔄 Attribute changed: ${name} = ${newValue}`);
      
      // force-visible属性の処理
      if (name === 'force-visible' && newValue !== null) {
        this.ensureVisibility(true);
      } else {
        this.queueRender();
      }
    }
  }

  /**
   * レンダリングキューに追加
   */
  queueRender() {
    this.renderQueue.push(() => this.render());
    this.processQueue();
  }

  /**
   * レンダリングキューの処理
   */
  async processQueue() {
    if (this.isProcessingQueue || this.renderQueue.length === 0) {
      return;
    }
    
    this.isProcessingQueue = true;
    
    while (this.renderQueue.length > 0) {
      const renderTask = this.renderQueue.shift();
      try {
        await renderTask();
      } catch (error) {
        console.error('❌ Render task failed:', error);
      }
    }
    
    this.isProcessingQueue = false;
  }

  /**
   * メインレンダリングメソッド
   */
  async render() {
    if (this.isRendering) {
      console.warn('⚠️ Render already in progress, queuing...');
      return;
    }
    
    this.isRendering = true;
    const startTime = performance.now();
    const questionId = this.dataset.questionId;
    
    console.log(`🎨 Starting render v2.0: ${questionId}`);
    
    if (!questionId) {
      this.renderErrorState('No question ID specified');
      this.isRendering = false;
      return;
    }

    try {
      // 設問データを取得
      const questionData = this.getQuestionData(questionId);
      if (!questionData) {
        throw new Error(`Question data not found for: ${questionId}`);
      }

      // テンプレートを生成
      const template = this.generateTemplate(questionData);
      const styles = this.getEnhancedStyles();
      
      // Shadow DOM に挿入
      this.shadowRoot.innerHTML = `
        ${styles}
        <div class="question-container" id="question-container">
          ${template}
        </div>
      `;

      // DOM要素をキャッシュ
      this.cacheElements();
      
      // パフォーマンス記録
      this.renderCount++;
      this.lastRenderTime = performance.now() - startTime;
      
      console.log(`⚡ Rendered v2.0 ${questionId} in ${this.lastRenderTime.toFixed(2)}ms (count: ${this.renderCount})`);
      
    } catch (error) {
      console.error(`❌ Render failed for ${questionId}:`, error);
      this.renderErrorState(error);
    } finally {
      this.isRendering = false;
    }
  }

  /**
   * 設問データを取得
   */
  getQuestionData(questionId) {
    // グローバル変数から設問データを取得
    let question = null;
    
    if (typeof WORLDVIEW_QUESTIONS !== 'undefined') {
      question = WORLDVIEW_QUESTIONS.find(q => q.id === questionId);
    }
    
    if (!question && typeof SCENARIO_QUESTIONS !== 'undefined') {
      question = SCENARIO_QUESTIONS.find(q => q.id === questionId);
    }
    
    return question;
  }

  /**
   * テンプレート生成
   */
  generateTemplate(question) {
    // シナリオ設問の判定
    const isScenario = question.scenario || 
                      (question.inner_q && question.outer_q) ||
                      (question.options && typeof question.options === 'object' && !Array.isArray(question.options));
    
    if (isScenario) {
      return this.generateScenarioTemplate(question);
    } else {
      return this.generateValueQuestionTemplate(question);
    }
  }

  /**
   * 価値観設問用テンプレート生成
   */
  generateValueQuestionTemplate(question) {
    const options = Array.isArray(question.options) ? question.options : [];
    
    if (options.length === 0) {
      return this.generateErrorTemplate(`選択肢が見つかりません: ${question.id}`);
    }
    
    const optionsHtml = options.map((option, index) => `
      <label class="option-label" data-option-index="${index}">
        <input type="radio" 
               name="question-${question.id}" 
               value="${option.id}" 
               data-scoring='${JSON.stringify(option.scoring_tags || [])}'>
        <div class="option-content">
          <div class="option-indicator"></div>
          <span class="option-text">${this.escapeHtml(option.text)}</span>
        </div>
        <div class="option-ripple"></div>
      </label>
    `).join('');
    
    return `
      <div class="question-item value-question">
        <div class="question-header">
          <div class="question-icon">💭</div>
          <h3 class="question-title">${this.escapeHtml(question.title || question.question)}</h3>
        </div>
        <div class="question-options">
          ${optionsHtml}
        </div>
      </div>
    `;
  }

  /**
   * シナリオ設問用テンプレート生成
   */
  generateScenarioTemplate(question) {
    const innerOptions = question.inner_q?.options || question.options?.inner || [];
    const outerOptions = question.outer_q?.options || question.options?.outer || [];
    
    const innerQuestionText = question.inner_q?.question || question.inner_question || '内面的にはどう感じますか？';
    const outerQuestionText = question.outer_q?.question || question.outer_question || '外面的にはどう行動しますか？';
    
    const innerOptionsHtml = innerOptions.map(option => `
      <label class="option-label">
        <input type="radio" 
               name="inner-${question.id}" 
               value="${option.id}" 
               data-choice-type="inner" 
               data-scoring='${JSON.stringify(option.scoring_tags || [])}'>
        <div class="option-content">
          <div class="option-indicator"></div>
          <span class="option-text">${this.escapeHtml(option.text)}</span>
        </div>
        <div class="option-ripple"></div>
      </label>
    `).join('');
    
    const outerOptionsHtml = outerOptions.map(option => `
      <label class="option-label">
        <input type="radio" 
               name="outer-${question.id}" 
               value="${option.id}" 
               data-choice-type="outer" 
               data-scoring='${JSON.stringify(option.scoring_tags || [])}'>
        <div class="option-content">
          <div class="option-indicator"></div>
          <span class="option-text">${this.escapeHtml(option.text)}</span>
        </div>
        <div class="option-ripple"></div>
      </label>
    `).join('');
    
    return `
      <div class="question-item scenario-question">
        <div class="scenario-context">
          <div class="scenario-icon">🎭</div>
          <h3 class="scenario-title">${this.escapeHtml(question.title || 'シナリオ設問')}</h3>
          <p class="scenario-text">${this.escapeHtml(question.scenario || question.description || '')}</p>
        </div>
        
        <div class="scenario-choices">
          <div class="choice-section">
            <div class="choice-header">
              <span class="choice-icon">🧠</span>
              <h4 class="choice-title">${this.escapeHtml(innerQuestionText)}</h4>
            </div>
            <div class="choice-options">
              ${innerOptionsHtml}
            </div>
          </div>
          
          <div class="choice-section">
            <div class="choice-header">
              <span class="choice-icon">🌍</span>
              <h4 class="choice-title">${this.escapeHtml(outerQuestionText)}</h4>
            </div>
            <div class="choice-options">
              ${outerOptionsHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * エラー状態のテンプレート生成
   */
  generateErrorTemplate(message) {
    return `
      <div class="question-item error-question">
        <div class="error-content">
          <div class="error-icon">⚠️</div>
          <h3 class="error-title">設問の読み込みに失敗しました</h3>
          <p class="error-message">${this.escapeHtml(message)}</p>
        </div>
      </div>
    `;
  }

  /**
   * エラー状態のレンダリング
   */
  renderErrorState(error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const template = this.generateErrorTemplate(errorMessage);
    const styles = this.getEnhancedStyles();
    
    this.shadowRoot.innerHTML = `
      ${styles}
      <div class="question-container error-state">
        ${template}
      </div>
    `;
  }

  /**
   * 強化されたCSS スタイル
   */
  getEnhancedStyles() {
    return `
      <style>
        /* ホスト要素の基本スタイル */
        :host {
          display: block !important;
          contain: layout style paint;
          will-change: transform;
          opacity: 1 !important;
          visibility: visible !important;
          width: 100% !important;
          min-height: 200px !important;
          height: auto !important;
          position: relative !important;
          z-index: 10 !important;
          margin: 20px auto !important;
          max-width: 800px !important;
          box-sizing: border-box !important;
        }
        
        :host(.active-question) {
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
          z-index: 100 !important;
        }

        /* 質問コンテナ */
        .question-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          box-sizing: border-box;
          min-height: 200px;
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        /* 質問アイテム */
        .question-item {
          background: rgba(30, 41, 59, 0.95);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(99, 102, 241, 0.3);
          color: #f1f5f9;
          min-height: 150px;
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
          transition: all 0.3s ease;
        }

        .question-item:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
          border-color: rgba(99, 102, 241, 0.5);
        }

        /* 質問ヘッダー */
        .question-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }

        .question-icon {
          font-size: 24px;
          margin-right: 12px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .question-title {
          font-size: 18px;
          font-weight: 600;
          color: #f1f5f9;
          margin: 0;
          line-height: 1.4;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        /* 質問オプション */
        .question-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .option-label {
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          align-items: center;
          padding: 16px 20px;
          border: 2px solid rgba(99, 102, 241, 0.2);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          background: rgba(51, 65, 85, 0.8);
          color: #e2e8f0;
          margin-bottom: 8px;
          z-index: 1;
          min-height: 60px;
          box-sizing: border-box;
        }

        .option-label:hover {
          border-color: rgba(99, 102, 241, 0.5);
          background-color: rgba(99, 102, 241, 0.15);
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }

        .option-label:active {
          transform: translateX(2px) scale(0.98);
        }

        .option-label input[type="radio"] {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .option-content {
          display: flex;
          align-items: center;
          flex: 1;
          position: relative;
          z-index: 2;
        }

        .option-indicator {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(203, 213, 225, 0.5);
          border-radius: 50%;
          margin-right: 16px;
          transition: all 0.3s ease;
          position: relative;
          flex-shrink: 0;
          background: transparent;
        }

        .option-indicator::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #3b82f6;
          transform: translate(-50%, -50%) scale(0);
          transition: transform 0.3s ease;
        }

        .option-label input[type="radio"]:checked + .option-content .option-indicator {
          border-color: #3b82f6;
          background-color: rgba(59, 130, 246, 0.1);
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
        }

        .option-label input[type="radio"]:checked + .option-content .option-indicator::after {
          transform: translate(-50%, -50%) scale(1);
        }

        .option-text {
          font-size: 15px;
          color: #e2e8f0;
          line-height: 1.6;
          flex: 1;
          word-break: normal;
          word-wrap: break-word;
          white-space: normal;
          overflow-wrap: break-word;
          letter-spacing: 0.01em;
        }

        .option-ripple {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .option-label:active .option-ripple {
          opacity: 1;
        }

        /* 選択済みスタイル */
        .option-label input[type="radio"]:checked + .option-content {
          font-weight: 500;
        }

        .option-label input[type="radio"]:checked ~ .option-ripple {
          background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
          opacity: 0.5;
        }

        /* シナリオ設問スタイル */
        .scenario-question {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(51, 65, 85, 0.85));
        }

        .scenario-context {
          background: rgba(30, 41, 59, 0.9);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          border-left: 4px solid #6366f1;
          color: #f1f5f9;
        }

        .scenario-icon {
          font-size: 28px;
          margin-bottom: 8px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .scenario-title {
          font-size: 18px;
          font-weight: 600;
          color: #f1f5f9;
          margin: 0 0 16px 0;
          line-height: 1.4;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .scenario-text {
          font-size: 16px;
          color: #cbd5e1;
          line-height: 1.8;
          margin: 12px 0;
          word-break: normal;
          word-wrap: break-word;
          white-space: normal;
          overflow-wrap: break-word;
          letter-spacing: 0.02em;
          font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
        }

        .scenario-choices {
          display: grid;
          gap: 20px;
          grid-template-columns: 1fr 1fr;
        }

        .choice-section {
          background: rgba(51, 65, 85, 0.6);
          border-radius: 8px;
          padding: 16px;
          border: 1px solid rgba(99, 102, 241, 0.2);
          transition: all 0.3s ease;
        }

        .choice-section:hover {
          border-color: rgba(99, 102, 241, 0.4);
          background: rgba(51, 65, 85, 0.8);
        }

        .choice-header {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(203, 213, 225, 0.2);
        }

        .choice-icon {
          font-size: 20px;
          margin-right: 8px;
        }

        .choice-title {
          font-size: 16px;
          font-weight: 600;
          color: #e2e8f0;
          margin: 0;
          line-height: 1.4;
        }

        /* エラー状態 */
        .error-question {
          background: rgba(220, 38, 38, 0.1);
          border-color: rgba(248, 113, 113, 0.3);
        }

        .error-content {
          text-align: center;
          padding: 20px;
        }

        .error-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .error-title {
          color: #fca5a5;
          font-size: 18px;
          margin-bottom: 12px;
        }

        .error-message {
          color: #fecaca;
          font-size: 14px;
        }

        /* アニメーション */
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .slide-in {
          animation: slideInFromRight 0.5s ease-out;
        }

        /* レスポンシブ対応 */
        @media (max-width: 768px) {
          :host {
            margin: 10px auto !important;
          }
          
          .question-container {
            padding: 16px;
          }

          .question-item {
            padding: 20px;
          }

          .scenario-choices {
            grid-template-columns: 1fr;
          }

          .option-label {
            padding: 14px 16px;
            min-height: 50px;
          }

          .option-indicator {
            width: 18px;
            height: 18px;
            margin-right: 12px;
          }

          .option-indicator::after {
            width: 8px;
            height: 8px;
          }

          .option-text {
            font-size: 14px;
          }
        }

        /* アクセシビリティ */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* ハイコントラストモード */
        @media (prefers-contrast: high) {
          .question-item {
            border-width: 3px;
          }
          
          .option-label {
            border-width: 2px;
          }
        }

        /* フォーカス表示 */
        .option-label:focus-within {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      </style>
    `;
  }

  /**
   * DOM要素をキャッシュ
   */
  cacheElements() {
    this.cachedElements.clear();
    
    const container = this.shadowRoot.querySelector('#question-container');
    const inputs = this.shadowRoot.querySelectorAll('input[type="radio"]');
    const labels = this.shadowRoot.querySelectorAll('.option-label');
    
    this.cachedElements.set('container', container);
    this.cachedElements.set('inputs', inputs);
    this.cachedElements.set('labels', labels);
  }

  /**
   * イベントリスナーの設定
   */
  setupEventListeners() {
    const inputs = this.cachedElements.get('inputs') || this.shadowRoot.querySelectorAll('input[type="radio"]');
    const labels = this.cachedElements.get('labels') || this.shadowRoot.querySelectorAll('.option-label');
    
    // ラジオボタンのchangeイベント
    inputs.forEach(input => {
      const changeHandler = (event) => {
        this.handleAnswerChange(event);
        this.addRippleEffect(event.target.closest('.option-label'));
      };
      
      input.addEventListener('change', changeHandler);
      this.boundEventListeners.set(input, { type: 'change', handler: changeHandler });
    });
    
    // ラベルのクリックイベント
    labels.forEach(label => {
      const clickHandler = (event) => {
        const input = label.querySelector('input[type="radio"]');
        if (input && !input.checked) {
          input.checked = true;
          const changeEvent = new Event('change', { bubbles: true });
          input.dispatchEvent(changeEvent);
        }
        this.addRippleEffect(label);
      };
      
      label.addEventListener('click', clickHandler);
      this.boundEventListeners.set(label, { type: 'click', handler: clickHandler });
      
      // キーボードアクセシビリティ
      const keyHandler = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          clickHandler(event);
        }
      };
      
      label.addEventListener('keydown', keyHandler);
      this.boundEventListeners.set(label, { type: 'keydown', handler: keyHandler });
      
      // タブインデックス設定
      label.setAttribute('tabindex', '0');
      label.setAttribute('role', 'radio');
    });
  }

  /**
   * リップル効果の追加
   */
  addRippleEffect(label) {
    const ripple = label.querySelector('.option-ripple');
    if (ripple) {
      ripple.style.opacity = '1';
      setTimeout(() => {
        ripple.style.opacity = '0';
      }, 300);
    }
  }

  /**
   * 回答変更ハンドリング
   */
  handleAnswerChange(event) {
    const input = event.target;
    const questionId = this.dataset.questionId;
    
    console.log(`📝 Answer changed for ${questionId}:`, input.value);
    
    // カスタムイベントを発火
    this.dispatchEvent(new CustomEvent('answer-change', {
      detail: {
        questionId: questionId,
        value: input.value,
        scoringTags: input.dataset.scoring ? JSON.parse(input.dataset.scoring) : [],
        choiceType: input.dataset.choiceType || null
      },
      bubbles: true,
      composed: true
    }));
    
    // 選択アニメーション
    this.animateSelection(input.closest('.option-label'));
  }

  /**
   * 選択アニメーション
   */
  animateSelection(label) {
    label.style.transform = 'scale(1.02)';
    setTimeout(() => {
      label.style.transform = '';
    }, 200);
  }

  /**
   * 表示状態の確保
   */
  async ensureVisibility(force = false) {
    if (!this.displayController) {
      console.warn('⚠️ DisplayController not available, using fallback');
      this.fallbackEnsureVisibility();
      return;
    }
    
    try {
      const success = await this.displayController.ensureElementVisible(this, {
        forceDisplay: force || this.hasAttribute('force-visible'),
        useImportant: true,
        clearConflicts: true,
        observeChanges: true
      });
      
      this.visibilityState.isVisible = success;
      this.visibilityState.lastCheck = Date.now();
      
      if (!success) {
        this.visibilityState.retryCount++;
        console.warn(`⚠️ Visibility ensure failed for ${this.dataset.questionId} (retry: ${this.visibilityState.retryCount})`);
      }
      
    } catch (error) {
      console.error(`❌ Error ensuring visibility for ${this.dataset.questionId}:`, error);
      this.fallbackEnsureVisibility();
    }
  }

  /**
   * フォールバック表示確保
   */
  fallbackEnsureVisibility() {
    this.style.cssText = `
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      position: relative !important;
      width: 100% !important;
      min-height: 200px !important;
      height: auto !important;
      z-index: 10 !important;
    `;
    
    const container = this.shadowRoot.querySelector('.question-container');
    if (container) {
      container.style.cssText = `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        min-height: 200px !important;
      `;
    }
  }

  /**
   * アクセシビリティ設定
   */
  setupAccessibility() {
    this.setAttribute('role', 'group');
    this.setAttribute('aria-label', `質問: ${this.dataset.questionId}`);
    
    const labels = this.shadowRoot.querySelectorAll('.option-label');
    labels.forEach((label, index) => {
      label.setAttribute('aria-label', `選択肢 ${index + 1}`);
    });
  }

  /**
   * 既存回答の復元
   */
  restoreAnswer(answerData) {
    if (!answerData) return;

    const inputs = this.cachedElements.get('inputs') || this.shadowRoot.querySelectorAll('input[type="radio"]');
    
    inputs.forEach(input => {
      const choiceType = input.dataset.choiceType;
      let shouldCheck = false;

      if (choiceType === 'inner' && answerData.innerChoice) {
        shouldCheck = input.value === answerData.innerChoice.value;
      } else if (choiceType === 'outer' && answerData.outerChoice) {
        shouldCheck = input.value === answerData.outerChoice.value;
      } else if (!choiceType && answerData.selectedValue) {
        shouldCheck = input.value === answerData.selectedValue;
      }

      input.checked = shouldCheck;
      
      if (shouldCheck) {
        this.animateSelection(input.closest('.option-label'));
      }
    });
  }

  /**
   * HTMLエスケープ
   */
  escapeHtml(text) {
    if (typeof text !== 'string') return '';
    
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * パフォーマンス情報を取得
   */
  getPerformanceInfo() {
    return {
      renderCount: this.renderCount,
      lastRenderTime: this.lastRenderTime,
      cachedElementsCount: this.cachedElements.size,
      questionId: this.dataset.questionId,
      visibilityState: this.visibilityState,
      boundListeners: this.boundEventListeners.size
    };
  }

  /**
   * クリーンアップ
   */
  cleanup() {
    // イベントリスナーの削除
    for (const [element, { type, handler }] of this.boundEventListeners) {
      element.removeEventListener(type, handler);
    }
    this.boundEventListeners.clear();
    
    // キャッシュのクリア
    this.cachedElements.clear();
    
    // DisplayControllerのクリーンアップ
    if (this.displayController) {
      this.displayController.destroy();
      this.displayController = null;
    }
    
    // レンダリングキューのクリア
    this.renderQueue.length = 0;
    this.isProcessingQueue = false;
    
    console.log(`🧹 HaqeiQuestionElement v2.0 cleaned up: ${this.dataset.questionId}`);
  }
}

// Web Component として登録
if (typeof customElements !== 'undefined') {
  customElements.define('haqei-question-v2', HaqeiQuestionElementV2);
  console.log('✅ HaqeiQuestionElement v2.0 registered as <haqei-question-v2>');
}

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.HaqeiQuestionElementV2 = HaqeiQuestionElementV2;
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HaqeiQuestionElementV2;
}