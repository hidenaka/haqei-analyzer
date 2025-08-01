/**
 * HaqeiQuestionElement.js
 * Web Components技術による超高速設問表示システム
 * Shadow DOMによる完全DOM隔離とレンダリング最適化
 */

class HaqeiQuestionElement extends HTMLElement {
  constructor() {
    super();
    
    // Shadow DOM で完全隔離
    this.attachShadow({ mode: 'open' });
    
    // パフォーマンス追跡
    this.renderCount = 0;
    this.lastRenderTime = 0;
    
    // イベントリスナーの管理
    this.boundEventListeners = new Map();
    
    // DOM要素のキャッシュ
    this.cachedElements = new Map();
  }

  /**
   * 監視する属性（変更時に自動再レンダリング）
   */
  static get observedAttributes() {
    return ['question-id', 'question-type', 'animated'];
  }

  /**
   * DOM接続時の初期化
   */
  connectedCallback() {
    console.log('🔗 HaqeiQuestionElement connected:', this.dataset.questionId);
    this.render();
    this.setupEventListeners();
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
   * メインレンダリングメソッド
   */
  render() {
    const startTime = performance.now();
    
    const questionId = this.dataset.questionId;
    const animated = this.hasAttribute('animated');
    
    if (!questionId) {
      this.shadowRoot.innerHTML = '<div class="error">No question ID specified</div>';
      return;
    }

    // プリコンパイル済みテンプレートを取得
    const template = this.getPrecompiledTemplate(questionId);
    if (!template) {
      this.shadowRoot.innerHTML = `<div class="error">Template not found for: ${questionId}</div>`;
      return;
    }

    // CSS スタイルと HTML を一括設定
    this.shadowRoot.innerHTML = `
      ${this.getStyles()}
      <div class="question-container ${animated ? 'animated' : ''}">
        ${template}
      </div>
    `;

    // DOM要素をキャッシュ
    this.cacheElements();
    
    // パフォーマンス記録
    this.renderCount++;
    this.lastRenderTime = performance.now() - startTime;
    
    console.log(`⚡ Rendered ${questionId} in ${this.lastRenderTime.toFixed(2)}ms (count: ${this.renderCount})`);
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
   * Shadow DOM 用 CSS スタイル
   */
  getStyles() {
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
          /* 追加: 上部見切れ防止のための大幅なマージン拡大 */
          margin-top: 60px;
          padding-top: 40px;
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
          display: flex;
          align-items: center;
          padding: 16px;
          border: 2px solid rgba(99, 102, 241, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
          background: rgba(51, 65, 85, 0.8);
          color: #e2e8f0;
        }

        .option-label:hover {
          border-color: rgba(99, 102, 241, 0.5);
          background-color: rgba(99, 102, 241, 0.2);
          transform: translateX(4px);
        }

        .option-label input[type="radio"] {
          margin: 0;
          margin-right: 12px;
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
          border: 2px solid #d1d5db;
          border-radius: 50%;
          margin-right: 12px;
          transition: all 0.2s ease;
        }

        .option-label input[type="radio"]:checked + .option-content .option-indicator {
          border-color: #3b82f6;
          background-color: #3b82f6;
        }

        .option-text {
          font-size: 16px;
          color: #e2e8f0;
          line-height: 1.5;
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
          font-size: 16px;
          font-weight: 600;
          color: #f1f5f9;
          margin: 0 0 12px 0;
        }

        .scenario-text {
          font-size: 14px;
          color: #cbd5e1;
          line-height: 1.6;
          margin: 0;
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
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
          margin: 0;
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
          }
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
    
    inputs.forEach(input => {
      const changeHandler = (event) => {
        this.handleAnswerChange(event);
      };
      
      input.addEventListener('change', changeHandler);
      this.boundEventListeners.set(input, changeHandler);
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
   * クリーンアップ
   */
  cleanup() {
    // イベントリスナーの削除
    for (const [element, handler] of this.boundEventListeners) {
      element.removeEventListener('change', handler);
    }
    this.boundEventListeners.clear();
    
    // キャッシュのクリア
    this.cachedElements.clear();
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