/**
 * HaqeiQuestionElement.js v2.0
 * Web Components技術による超高速設問表示システム
 * Shadow DOMによる完全DOM隔離とレンダリング最適化
 * 
 * v2.0の新機能：
 * - DisplayController統合による確実な表示制御
 * - 「element is not visible」問題の根本解決
 * - CSS競合の完全回避
 * - パフォーマンス向上とメモリ最適化
 */

class HaqeiQuestionElement extends HTMLElement {
  constructor() {
    super();
    
    // Shadow DOM で完全隔離
    this.attachShadow({ mode: 'open' });
    
    // DisplayController統合（v2.0新機能）
    this.displayController = null;
    
    // パフォーマンス追跡
    this.renderCount = 0;
    this.lastRenderTime = 0;
    this.isRendering = false;
    
    // イベントリスナーの管理
    this.boundEventListeners = new Map();
    
    // DOM要素のキャッシュ
    this.cachedElements = new Map();
    
    // 表示状態の追跡（v2.0新機能）
    this.visibilityState = {
      isVisible: false,
      lastCheck: 0,
      retryCount: 0
    };
  }

  /**
   * 監視する属性（変更時に自動再レンダリング）
   */
  static get observedAttributes() {
    return ['question-id', 'question-type', 'animated'];
  }

  /**
   * DOM接続時の初期化（v2.0強化版）
   */
  async connectedCallback() {
    const questionId = this.dataset.questionId;
    console.log('🔗 HaqeiQuestionElement v2.0 connected:', questionId);
    
    // DisplayController初期化
    if (typeof DisplayController !== 'undefined') {
      this.displayController = new DisplayController({
        container: this.shadowRoot
      });
    }
    
    try {
      await this.render();
      this.setupEventListeners();
      await this.ensureVisibility();
    } catch (error) {
      console.error(`❌ HaqeiQuestionElement initialization failed for ${questionId}:`, error);
      this.renderErrorState(error);
    }
  }

  /**
   * DOM切断時のクリーンアップ
   */
  disconnectedCallback() {
    console.log('🔌 HaqeiQuestionElement disconnected:', this.dataset.questionId);
    this.cleanup();
  }

  /**
   * 属性変更時のハンドリング
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      console.log(`🔄 Attribute changed: ${name} = ${newValue}`);
      this.render();
    }
  }

  /**
   * メインレンダリングメソッド（v2.0強化版）
   */
  async render() {
    if (this.isRendering) {
      console.warn('⚠️ Render already in progress, skipping...');
      return;
    }
    
    this.isRendering = true;
    const startTime = performance.now();
    const questionId = this.dataset.questionId;
    const animated = this.hasAttribute('animated');
    
    console.log(`🎨 Starting render v2.0: ${questionId}`);
    
    if (!questionId) {
      this.renderErrorState('No question ID specified');
      this.isRendering = false;
      return;
    }

    try {
      // プリコンパイル済みテンプレートを取得
      const template = this.getPrecompiledTemplate(questionId);
      if (!template) {
        throw new Error(`Template not found for: ${questionId}`);
      }

      // CSS スタイルと HTML を一括設定
      this.shadowRoot.innerHTML = `
        ${this.getEnhancedStyles()}
        <div class="question-container ${animated ? 'animated' : ''}" id="question-container">
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
   * プリコンパイル済みテンプレートを取得
   */
  getPrecompiledTemplate(questionId) {
    if (typeof window.PRECOMPILED_QUESTION_TEMPLATES !== 'undefined') {
      return window.PRECOMPILED_QUESTION_TEMPLATES[questionId];
    }
    
    console.warn('⚠️ Precompiled templates not loaded, using fallback');
    return this.getFallbackTemplate(questionId);
  }

  /**
   * フォールバック用テンプレート（実際の設問データ対応）
   */
  getFallbackTemplate(questionId) {
    // グローバルから実際の設問データを取得
    let question = null;
    
    if (typeof WORLDVIEW_QUESTIONS !== 'undefined') {
      question = WORLDVIEW_QUESTIONS.find(q => q.id === questionId);
    }
    
    if (!question && typeof SCENARIO_QUESTIONS !== 'undefined') {
      question = SCENARIO_QUESTIONS.find(q => q.id === questionId);
    }
    
    if (!question) {
      // 最小限のフォールバック
      return `
        <div class="question-item value-question slide-in">
          <div class="question-header">
            <div class="question-icon">❓</div>
            <h3 class="question-title">設問が見つかりません: ${questionId}</h3>
          </div>
          <div class="question-options">
            <p>設問データの読み込みに失敗しました。</p>
          </div>
        </div>
      `;
    }
    
    // シナリオ設問の判定を修正（両方のデータ構造に対応）
    if (question.scenario || (question.options && typeof question.options === 'object' && !Array.isArray(question.options))) {
      return this.generateScenarioTemplate(question);
    }
    
    // 通常の価値観設問の判定
    if (question.options && Array.isArray(question.options)) {
      return this.generateValueQuestionTemplate(question);
    }
    
    // デフォルトは価値観設問として処理
    return this.generateValueQuestionTemplate(question);
  }
  
  /**
   * 価値観設問用テンプレート生成
   */
  generateValueQuestionTemplate(question) {
    // データ構造に応じた安全な処理
    const options = Array.isArray(question.options) ? question.options : [];
    
    if (options.length === 0) {
      console.warn(`⚠️ No options found for question ${question.id}`);
      return `
        <div class="question-item value-question slide-in">
          <div class="question-header">
            <div class="question-icon">💭</div>
            <h3 class="question-title">${question.title || question.question || '設問'}</h3>
          </div>
          <div class="question-options">
            <p>選択肢が見つかりません。</p>
          </div>
        </div>
      `;
    }
    
    const optionsHtml = options.map((option, index) => `
      <label class="option-label">
        <input type="radio" name="question-${question.id}" value="${option.id}" 
               data-scoring='${JSON.stringify(option.scoring_tags || [])}'>
        <div class="option-content">
          <div class="option-indicator"></div>
          <span class="option-text">${option.text}</span>
        </div>
      </label>
    `).join('');
    
    return `
      <div class="question-item value-question slide-in">
        <div class="question-header">
          <div class="question-icon">💭</div>
          <h3 class="question-title">${question.title || question.question}</h3>
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
    // 両方のデータ構造に対応
    const innerOptions = question.inner_q?.options || question.options?.inner || [];
    const outerOptions = question.outer_q?.options || question.options?.outer || [];
    
    // 内面の質問テキスト
    const innerQuestionText = question.inner_q?.question || question.inner_question || '内面的にはどう感じますか？';
    const outerQuestionText = question.outer_q?.question || question.outer_question || '外面的にはどう行動しますか？';
    
    if (innerOptions.length === 0 || outerOptions.length === 0) {
      console.warn(`⚠️ Missing options for scenario question ${question.id}`);
    }
    
    const innerOptionsHtml = innerOptions.map(option => `
      <label class="option-label">
        <input type="radio" name="inner-${question.id}" value="${option.id}" 
               data-choice-type="inner" data-scoring='${JSON.stringify(option.scoring_tags || [])}'>
        <div class="option-content">
          <div class="option-indicator"></div>
          <span class="option-text">${option.text}</span>
        </div>
      </label>
    `).join('');
    
    const outerOptionsHtml = outerOptions.map(option => `
      <label class="option-label">
        <input type="radio" name="outer-${question.id}" value="${option.id}" 
               data-choice-type="outer" data-scoring='${JSON.stringify(option.scoring_tags || [])}'>
        <div class="option-content">
          <div class="option-indicator"></div>
          <span class="option-text">${option.text}</span>
        </div>
      </label>
    `).join('');
    
    return `
      <div class="question-item scenario-question slide-in">
        <div class="scenario-context">
          <div class="scenario-icon">🎭</div>
          <h3 class="scenario-title">${question.title || 'シナリオ設問'}</h3>
          <p class="scenario-text">${question.scenario || question.description || ''}</p>
        </div>
        
        <div class="scenario-choices">
          <div class="choice-section">
            <div class="choice-header">
              <span class="choice-icon">🧠</span>
              <h4 class="choice-title">${innerQuestionText}</h4>
            </div>
            <div class="choice-options">
              ${innerOptionsHtml}
            </div>
          </div>
          
          <div class="choice-section">
            <div class="choice-header">
              <span class="choice-icon">🌍</span>
              <h4 class="choice-title">${outerQuestionText}</h4>
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
   * 強化されたCSS スタイル（v2.0）
   */
  getEnhancedStyles() {
    return `
      <style>
        :host {
          display: block !important;
          contain: layout style paint;
          will-change: transform;
          opacity: 1 !important;
          visibility: visible !important;
        }
        
        :host(.active-question) {
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
          z-index: 10 !important;
        }

        .question-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          box-sizing: border-box;
          /* 完全見切れ防止: すべてのマージン・パディングを最適化 */
          margin-top: 30px !important; /* 上部に確実な余白を設ける */
          padding-top: 20px !important; /* 追加の上部パディング */
          margin-bottom: 20px !important; /* 下部余白も確保 */
        }

        .question-container.animated .slide-in {
          animation: slideInFromRight 0.5s ease-out;
        }

        .question-item {
          background: rgba(30, 41, 59, 0.95);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(99, 102, 241, 0.3);
          color: #f1f5f9;
        }

        .question-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }

        .question-icon {
          font-size: 24px;
          margin-right: 12px;
        }

        .question-title {
          font-size: 18px;
          font-weight: 600;
          color: #f1f5f9;
          margin: 0;
          line-height: 1.4;
        }

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
          margin-bottom: 12px;
          z-index: 10;
        }

        .option-label:last-child {
          margin-bottom: 0;
        }

        .option-label:hover {
          border-color: rgba(99, 102, 241, 0.5);
          background-color: rgba(99, 102, 241, 0.15);
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
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

        /* 選択済みスタイルの強化 */
        .option-label input[type="radio"]:checked + .option-content {
          font-weight: 500;
        }

        .option-label input[type="radio"]:checked ~ .option-ripple {
          background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
        }

        /* シナリオ設問用スタイル */
        .scenario-question {
          background: rgba(30, 41, 59, 0.95);
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
        }

        .scenario-title {
          font-size: 18px;
          font-weight: 600;
          color: #f1f5f9;
          margin: 0 0 16px 0;
          line-height: 1.4;
          word-break: normal;
          white-space: normal;
          overflow-wrap: break-word;
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
        }

        .choice-header {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
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
          word-break: normal;
          white-space: normal;
          overflow-wrap: break-word;
        }

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

        @media (max-width: 768px) {
          .scenario-choices {
            grid-template-columns: 1fr;
          }
          
          .question-container {
            padding: 16px;
            margin-top: 0;
            padding-top: 0;
          }

          .option-label {
            padding: 14px 16px;
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
        }

        /* エラー状態 */
        .error-question {
          background: rgba(220, 38, 38, 0.1) !important;
          border-color: rgba(248, 113, 113, 0.3) !important;
        }

        .error-content {
          text-align: center !important;
          padding: 20px !important;
        }

        .error-icon {
          font-size: 48px !important;
          margin-bottom: 16px !important;
        }

        .error-title {
          color: #fca5a5 !important;
          font-size: 18px !important;
          margin-bottom: 12px !important;
        }

        .error-message {
          color: #fecaca !important;
          font-size: 14px !important;
        }

        .error {
          color: #dc2626;
          text-align: center;
          padding: 20px;
          font-weight: 500;
        }
      </style>
    `;
  }

  /**
   * DOM要素をキャッシュ
   */
  cacheElements() {
    this.cachedElements.clear();
    
    const inputs = this.shadowRoot.querySelectorAll('input[type="radio"]');
    const labels = this.shadowRoot.querySelectorAll('.option-label');
    
    this.cachedElements.set('inputs', inputs);
    this.cachedElements.set('labels', labels);
  }

  /**
   * イベントリスナーの設定
   */
  setupEventListeners() {
    const inputs = this.cachedElements.get('inputs') || this.shadowRoot.querySelectorAll('input[type="radio"]');
    const labels = this.cachedElements.get('labels') || this.shadowRoot.querySelectorAll('.option-label');
    
    // WCAG 2.1 AA準拠 - ARIA属性とアクセシビリティの設定
    this.setupAccessibility();
    
    // 🔧 修正: radio inputとlabelの両方にイベントリスナーを設定
    inputs.forEach(input => {
      const changeHandler = (event) => {
        this.handleAnswerChange(event);
      };
      
      input.addEventListener('change', changeHandler);
      this.boundEventListeners.set(input, changeHandler);
    });
    
    // 🔧 追加: labelに直接クリックイベントを追加（visibility問題の回避）
    labels.forEach((label, index) => {
      const clickHandler = (event) => {
        // labelがクリックされた時、関連するradio inputを探してチェック
        const input = label.querySelector('input[type="radio"]');
        if (input && !input.checked) {
          input.checked = true;
          // 手動でchangeイベントを発火
          const changeEvent = new Event('change', { bubbles: true });
          input.dispatchEvent(changeEvent);
        }
      };
      
      // キーボードナビゲーション対応
      const keydownHandler = (event) => {
        this.handleKeyboardNavigation(event, index);
      };
      
      label.addEventListener('click', clickHandler);
      label.addEventListener('keydown', keydownHandler);
      this.boundEventListeners.set(label, clickHandler);
      
      // 🔧 強制的に表示状態を確保
      label.style.display = 'flex';
      label.style.visibility = 'visible';
      label.style.opacity = '1';
      label.style.pointerEvents = 'auto';
    });
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
    });
  }

  /**
   * パフォーマンス情報を取得
   */
  getPerformanceInfo() {
    return {
      renderCount: this.renderCount,
      lastRenderTime: this.lastRenderTime,
      cachedElementsCount: this.cachedElements.size,
      questionId: this.dataset.questionId
    };
  }

  /**
   * 表示状態の確保（v2.0新機能）
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
   * エラー状態のレンダリング（v2.0新機能）
   */
  renderErrorState(error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const styles = this.getEnhancedStyles();
    
    this.shadowRoot.innerHTML = `
      ${styles}
      <div class="question-container error-state">
        <div class="question-item error-question">
          <div class="error-content">
            <div class="error-icon">⚠️</div>
            <h3 class="error-title">設問の読み込みに失敗しました</h3>
            <p class="error-message">${this.escapeHtml(errorMessage)}</p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * HTMLエスケープ（v2.0新機能）
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
   * クリーンアップ（v2.0強化版）
   */
  cleanup() {
    // イベントリスナーの削除
    for (const [element, handler] of this.boundEventListeners) {
      // inputとlabelで異なるイベントタイプを削除
      if (element.tagName === 'INPUT') {
        element.removeEventListener('change', handler);
      } else if (element.classList.contains('option-label')) {
        element.removeEventListener('click', handler);
      }
    }
    this.boundEventListeners.clear();
    
    // キャッシュのクリア
    this.cachedElements.clear();
    
    // DisplayControllerのクリーンアップ
    if (this.displayController) {
      this.displayController.destroy();
      this.displayController = null;
    }
    
    console.log(`🧹 HaqeiQuestionElement v2.0 cleaned up: ${this.dataset.questionId}`);
  }
}

// Web Component として登録
if (typeof customElements !== 'undefined') {
  customElements.define('haqei-question', HaqeiQuestionElement);
  console.log('✅ HaqeiQuestionElement registered as <haqei-question>');
}

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.HaqeiQuestionElement = HaqeiQuestionElement;
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HaqeiQuestionElement;
}