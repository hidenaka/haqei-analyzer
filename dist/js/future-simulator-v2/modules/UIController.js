/**
 * UIController.js - Advanced UI Control Module
 * 
 * bunenjin哲学による効率的なUI制御システム
 * イベント駆動アーキテクチャとCSS-in-JS排除
 * 
 * Author: HAQEI Programmer Agent
 * Created: 2025-08-06
 * Version: 2.0.0-modular
 */

export class UIController {
  constructor(core) {
    this.core = core;
    this.version = "2.0.0-modular";
    this.elements = new Map();
    this.eventListeners = new Map();
    this.animationQueue = [];
    this.isAnimating = false;
    
    // UI状態管理
    this.state = {
      currentView: 'input',
      loading: false,
      error: null,
      results: null,
      preferences: this.loadUIPreferences()
    };

    console.log('🎨 UIController v2.0.0 initializing...');
  }

  /**
   * UI初期化
   */
  async initialize() {
    try {
      // DOM要素の取得とキャッシュ
      this.cacheElements();
      
      // イベントリスナーの設定
      this.setupEventListeners();
      
      // 初期UI状態の設定
      this.setupInitialState();
      
      // レスポンシブ対応
      this.setupResponsiveHandling();
      
      // アクセシビリティ強化
      this.setupAccessibility();
      
      // パフォーマンス監視
      this.setupPerformanceMonitoring();

      console.log('✅ UIController initialized successfully');
      return true;

    } catch (error) {
      console.error('❌ UIController initialization failed:', error);
      throw error;
    }
  }

  /**
   * DOM要素キャッシュ
   */
  cacheElements() {
    const elementSelectors = {
      // 入力関連
      textInput: '#textInput',
      analyzeButton: '#analyzeButton',
      clearButton: '#clearButton',
      
      // 表示関連
      loadingIndicator: '#loadingIndicator',
      resultContainer: '#resultContainer',
      errorContainer: '#errorContainer',
      
      // シナリオ関連
      scenarioContainer: '#scenarioContainer',
      scenarioCards: '.scenario-card',
      
      // ナビゲーション
      tabContainer: '#tabContainer',
      tabs: '.tab-button',
      
      // モーダル
      modalContainer: '#modalContainer',
      modalOverlay: '#modalOverlay',
      
      // エクスポート
      exportButton: '#exportButton',
      shareButton: '#shareButton'
    };

    Object.entries(elementSelectors).forEach(([key, selector]) => {
      const element = document.querySelector(selector);
      if (element) {
        this.elements.set(key, element);
      } else {
        console.warn(`⚠️ Element not found: ${selector}`);
      }
    });

    console.log(`📦 Cached ${this.elements.size} UI elements`);
  }

  /**
   * イベントリスナー設定
   */
  setupEventListeners() {
    // 分析ボタン
    this.addEventListenerSafe('analyzeButton', 'click', this.handleAnalyze.bind(this));
    
    // クリアボタン
    this.addEventListenerSafe('clearButton', 'click', this.handleClear.bind(this));
    
    // テキスト入力
    this.addEventListenerSafe('textInput', 'input', this.handleTextInput.bind(this));
    this.addEventListenerSafe('textInput', 'keydown', this.handleKeydown.bind(this));
    
    // エクスポート
    this.addEventListenerSafe('exportButton', 'click', this.handleExport.bind(this));
    this.addEventListenerSafe('shareButton', 'click', this.handleShare.bind(this));
    
    // モーダル
    this.addEventListenerSafe('modalOverlay', 'click', this.closeModal.bind(this));
    
    // ウィンドウイベント
    window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    
    // コアイベント
    this.core.addEventListener('analysis:start', this.handleAnalysisStart.bind(this));
    this.core.addEventListener('analysis:complete', this.handleAnalysisComplete.bind(this));
    this.core.addEventListener('analysis:error', this.handleAnalysisError.bind(this));

    console.log('🔗 Event listeners setup complete');
  }

  /**
   * 安全なイベントリスナー追加
   */
  addEventListenerSafe(elementKey, event, handler) {
    const element = this.elements.get(elementKey);
    if (element) {
      element.addEventListener(event, handler);
      
      // リスナー管理のためのトラッキング
      const listenerId = `${elementKey}_${event}`;
      this.eventListeners.set(listenerId, { element, event, handler });
    }
  }

  /**
   * 初期状態設定
   */
  setupInitialState() {
    // 初期ビューの設定
    this.showView('input');
    
    // ボタン状態の初期化
    this.updateButtonStates();
    
    // テーマの適用
    this.applyTheme(this.state.preferences.theme || 'default');
    
    // 言語設定
    this.applyLanguage(this.state.preferences.language || 'ja');

    console.log('🎯 Initial UI state configured');
  }

  /**
   * レスポンシブ対応設定
   */
  setupResponsiveHandling() {
    // ブレークポイントの定義
    this.breakpoints = {
      mobile: 768,
      tablet: 1024,
      desktop: 1280
    };

    // 初期レスポンシブ調整
    this.handleResize();

    console.log('📱 Responsive handling setup complete');
  }

  /**
   * アクセシビリティ設定
   */
  setupAccessibility() {
    // ARIAラベルの設定
    this.setupARIALabels();
    
    // キーボードナビゲーション
    this.setupKeyboardNavigation();
    
    // スクリーンリーダー対応
    this.setupScreenReaderSupport();
    
    // 高コントラストモード対応
    this.setupHighContrastMode();

    console.log('♿ Accessibility enhancements applied');
  }

  /**
   * パフォーマンス監視設定
   */
  setupPerformanceMonitoring() {
    // レンダリング時間の測定
    this.performanceMetrics = {
      renderTimes: [],
      animationFrames: 0,
      lastFrameTime: performance.now()
    };

    // フレームレート監視
    this.startFrameRateMonitoring();

    console.log('📊 Performance monitoring started');
  }

  /**
   * 分析処理ハンドラー
   */
  async handleAnalyze(event) {
    event.preventDefault();
    
    const textInput = this.elements.get('textInput');
    if (!textInput) return;

    const text = textInput.value.trim();
    if (!text) {
      this.showError('テキストを入力してください。');
      return;
    }

    try {
      // 分析実行
      await this.core.analyzeText(text);
      
    } catch (error) {
      console.error('分析エラー:', error);
      this.showError('分析中にエラーが発生しました。もう一度お試しください。');
    }
  }

  /**
   * クリア処理ハンドラー
   */
  handleClear(event) {
    event.preventDefault();
    
    // 入力フィールドをクリア
    const textInput = this.elements.get('textInput');
    if (textInput) {
      textInput.value = '';
      textInput.focus();
    }
    
    // 結果をクリア
    this.clearResults();
    
    // 入力ビューに戻る
    this.showView('input');
    
    // ボタン状態を更新
    this.updateButtonStates();
  }

  /**
   * テキスト入力ハンドラー
   */
  handleTextInput(event) {
    const text = event.target.value.trim();
    
    // ボタン状態の更新
    this.updateButtonStates();
    
    // 文字数表示の更新
    this.updateCharacterCount(text.length);
    
    // リアルタイムバリデーション
    this.validateTextInput(text);
  }

  /**
   * キーダウンハンドラー
   */
  handleKeydown(event) {
    // Ctrl+Enter で分析実行
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      this.handleAnalyze(event);
    }
    
    // Escape でクリア
    if (event.key === 'Escape') {
      this.handleClear(event);
    }
  }

  /**
   * リサイズハンドラー
   */
  handleResize() {
    const width = window.innerWidth;
    
    // デバイス判定
    let deviceType = 'desktop';
    if (width < this.breakpoints.mobile) {
      deviceType = 'mobile';
    } else if (width < this.breakpoints.tablet) {
      deviceType = 'tablet';
    }
    
    // レスポンシブクラスの適用
    document.body.className = document.body.className.replace(/device-\w+/g, '');
    document.body.classList.add(`device-${deviceType}`);
    
    // レイアウト調整
    this.adjustLayoutForDevice(deviceType);
  }

  /**
   * 分析開始ハンドラー
   */
  handleAnalysisStart(event) {
    console.log('🔄 Analysis started');
    this.showLoading(true);
    this.updateButtonStates();
  }

  /**
   * 分析完了ハンドラー
   */
  handleAnalysisComplete(event) {
    console.log('✅ Analysis completed');
    const { result } = event.detail;
    
    this.showLoading(false);
    this.displayResults(result);
    this.showView('results');
    this.updateButtonStates();
  }

  /**
   * 分析エラーハンドラー
   */
  handleAnalysisError(event) {
    console.error('❌ Analysis error:', event.detail.error);
    
    this.showLoading(false);
    this.showError('分析中にエラーが発生しました。しばらく経ってから再試行してください。');
    this.updateButtonStates();
  }

  /**
   * ビュー表示
   */
  showView(viewName) {
    // 現在のビューを非表示
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
    });
    
    // 指定されたビューを表示
    const targetView = document.querySelector(`.view-${viewName}`);
    if (targetView) {
      targetView.classList.add('active');
      this.state.currentView = viewName;
      
      // ビュー変更アニメーション
      this.animateViewTransition(viewName);
    }
  }

  /**
   * ローディング表示制御
   */
  showLoading(show = true) {
    const loadingIndicator = this.elements.get('loadingIndicator');
    if (!loadingIndicator) return;

    this.state.loading = show;
    
    if (show) {
      loadingIndicator.classList.add('active');
      this.animateLoadingIndicator();
    } else {
      loadingIndicator.classList.remove('active');
    }
  }

  /**
   * エラー表示
   */
  showError(message, duration = 5000) {
    const errorContainer = this.elements.get('errorContainer');
    if (!errorContainer) return;

    this.state.error = message;
    
    // エラーメッセージの設定
    errorContainer.textContent = message;
    errorContainer.classList.add('active');
    
    // アニメーション
    this.animateErrorMessage();
    
    // 自動消去
    if (duration > 0) {
      setTimeout(() => {
        this.clearError();
      }, duration);
    }
  }

  /**
   * エラークリア
   */
  clearError() {
    const errorContainer = this.elements.get('errorContainer');
    if (errorContainer) {
      errorContainer.classList.remove('active');
      this.state.error = null;
    }
  }

  /**
   * 結果表示
   */
  displayResults(results) {
    const resultContainer = this.elements.get('resultContainer');
    if (!resultContainer) return;

    this.state.results = results;
    
    // 結果コンテナのクリア
    resultContainer.innerHTML = '';
    
    // シナリオの表示
    if (results.scenarios && results.scenarios.length > 0) {
      this.displayScenarios(results.scenarios);
    }
    
    // 分析結果の表示
    if (results.analysis) {
      this.displayAnalysisSummary(results.analysis);
    }
    
    // メタデータの表示
    if (results.metadata) {
      this.displayMetadata(results.metadata);
    }
    
    // アニメーション
    this.animateResultsDisplay();
  }

  /**
   * シナリオ表示
   */
  displayScenarios(scenarios) {
    const scenarioContainer = this.elements.get('scenarioContainer') || 
                             this.elements.get('resultContainer');
    if (!scenarioContainer) return;

    const scenarioHTML = scenarios.map((scenario, index) => 
      this.generateScenarioHTML(scenario, index)
    ).join('');
    
    const scenarioSection = document.createElement('div');
    scenarioSection.className = 'scenarios-section';
    scenarioSection.innerHTML = `
      <h2 class="scenarios-title">未来シナリオ</h2>
      <div class="scenarios-grid">
        ${scenarioHTML}
      </div>
    `;
    
    scenarioContainer.appendChild(scenarioSection);
    
    // シナリオカードのイベントリスナー設定
    this.setupScenarioCardListeners();
  }

  /**
   * シナリオHTML生成
   */
  generateScenarioHTML(scenario, index) {
    const hexagramInfo = scenario.hexagram ? 
      `<div class="hexagram-info">
        <span class="hexagram-number">${scenario.hexagram.number}</span>
        <span class="hexagram-name">${scenario.hexagram.name}</span>
      </div>` : '';

    const impactClass = `impact-${scenario.impact}`;
    const probabilityClass = scenario.probability > 70 ? 'high-probability' : 
                           scenario.probability > 40 ? 'medium-probability' : 'low-probability';

    return `
      <div class="scenario-card ${impactClass} ${probabilityClass}" 
           data-scenario-id="${scenario.id}" 
           data-index="${index}">
        <div class="scenario-header">
          <h3 class="scenario-title">${this.escapeHtml(scenario.title)}</h3>
          ${hexagramInfo}
        </div>
        
        <div class="scenario-content">
          <p class="scenario-description">${this.escapeHtml(scenario.description)}</p>
          
          <div class="scenario-metrics">
            <div class="metric">
              <span class="metric-label">確率</span>
              <span class="metric-value">${scenario.probability}%</span>
            </div>
            <div class="metric">
              <span class="metric-label">影響度</span>
              <span class="metric-value impact-${scenario.impact}">${this.translateImpact(scenario.impact)}</span>
            </div>
            <div class="metric">
              <span class="metric-label">期間</span>
              <span class="metric-value">${this.translateTimeframe(scenario.timeframe)}</span>
            </div>
          </div>
        </div>
        
        <div class="scenario-actions">
          <button class="action-button view-details" data-scenario-id="${scenario.id}">
            詳細を見る
          </button>
          <button class="action-button export-scenario" data-scenario-id="${scenario.id}">
            エクスポート
          </button>
        </div>
      </div>
    `;
  }

  /**
   * シナリオカードリスナー設定
   */
  setupScenarioCardListeners() {
    // 詳細表示ボタン
    document.querySelectorAll('.view-details').forEach(button => {
      button.addEventListener('click', (e) => {
        const scenarioId = e.target.dataset.scenarioId;
        this.showScenarioDetails(scenarioId);
      });
    });
    
    // エクスポートボタン
    document.querySelectorAll('.export-scenario').forEach(button => {
      button.addEventListener('click', (e) => {
        const scenarioId = e.target.dataset.scenarioId;
        this.exportScenario(scenarioId);
      });
    });
    
    // カードクリック
    document.querySelectorAll('.scenario-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('action-button')) {
          card.classList.toggle('expanded');
        }
      });
    });
  }

  /**
   * ボタン状態更新
   */
  updateButtonStates() {
    const textInput = this.elements.get('textInput');
    const analyzeButton = this.elements.get('analyzeButton');
    const clearButton = this.elements.get('clearButton');
    
    if (!textInput || !analyzeButton) return;

    const hasText = textInput.value.trim().length > 0;
    const isLoading = this.state.loading;
    
    // 分析ボタン
    analyzeButton.disabled = !hasText || isLoading;
    analyzeButton.classList.toggle('loading', isLoading);
    
    // クリアボタン
    if (clearButton) {
      clearButton.disabled = isLoading;
    }
  }

  /**
   * 文字数表示更新
   */
  updateCharacterCount(count) {
    const charCounter = document.querySelector('.char-counter');
    if (charCounter) {
      charCounter.textContent = `${count} 文字`;
      
      // 制限近くでの警告
      const maxChars = 1000;
      if (count > maxChars * 0.9) {
        charCounter.classList.add('warning');
      } else {
        charCounter.classList.remove('warning');
      }
    }
  }

  /**
   * テキストバリデーション
   */
  validateTextInput(text) {
    const minLength = 10;
    const maxLength = 1000;
    
    let isValid = true;
    let message = '';
    
    if (text.length < minLength) {
      isValid = false;
      message = `最低${minLength}文字以上入力してください。`;
    } else if (text.length > maxLength) {
      isValid = false;
      message = `${maxLength}文字以内で入力してください。`;
    }
    
    this.showValidationMessage(message);
    return isValid;
  }

  /**
   * バリデーションメッセージ表示
   */
  showValidationMessage(message) {
    let validationMsg = document.querySelector('.validation-message');
    if (!validationMsg) {
      validationMsg = document.createElement('div');
      validationMsg.className = 'validation-message';
      const textInput = this.elements.get('textInput');
      if (textInput) {
        textInput.parentNode.appendChild(validationMsg);
      }
    }
    
    validationMsg.textContent = message;
    validationMsg.classList.toggle('visible', message.length > 0);
  }

  /**
   * アニメーション関連メソッド
   */
  animateViewTransition(viewName) {
    this.queueAnimation({
      type: 'viewTransition',
      target: viewName,
      duration: 300
    });
  }

  animateLoadingIndicator() {
    const indicator = this.elements.get('loadingIndicator');
    if (indicator) {
      indicator.style.animation = 'spin 1s linear infinite';
    }
  }

  animateErrorMessage() {
    const errorContainer = this.elements.get('errorContainer');
    if (errorContainer) {
      errorContainer.style.animation = 'slideInDown 0.3s ease-out';
    }
  }

  animateResultsDisplay() {
    this.queueAnimation({
      type: 'resultsDisplay',
      duration: 600
    });
  }

  /**
   * アニメーションキュー管理
   */
  queueAnimation(animation) {
    this.animationQueue.push(animation);
    if (!this.isAnimating) {
      this.processAnimationQueue();
    }
  }

  async processAnimationQueue() {
    if (this.animationQueue.length === 0) {
      this.isAnimating = false;
      return;
    }

    this.isAnimating = true;
    const animation = this.animationQueue.shift();
    
    try {
      await this.executeAnimation(animation);
    } catch (error) {
      console.warn('⚠️ Animation error:', error);
    }
    
    // 次のアニメーション処理
    setTimeout(() => this.processAnimationQueue(), 50);
  }

  async executeAnimation(animation) {
    return new Promise(resolve => {
      switch (animation.type) {
        case 'viewTransition':
          this.executeViewTransitionAnimation(animation);
          break;
        case 'resultsDisplay':
          this.executeResultsDisplayAnimation(animation);
          break;
        default:
          console.warn('Unknown animation type:', animation.type);
      }
      
      setTimeout(resolve, animation.duration || 300);
    });
  }

  /**
   * ユーティリティメソッド
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  translateImpact(impact) {
    const translations = {
      high: '高',
      medium: '中',
      low: '低'
    };
    return translations[impact] || impact;
  }

  translateTimeframe(timeframe) {
    const translations = {
      short_term: '短期',
      medium_term: '中期', 
      long_term: '長期'
    };
    return translations[timeframe] || timeframe;
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * 設定関連メソッド
   */
  loadUIPreferences() {
    try {
      const stored = localStorage.getItem('futureSimulator:uiPreferences');
      return stored ? JSON.parse(stored) : {
        theme: 'default',
        language: 'ja',
        animationsEnabled: true,
        autoSave: true
      };
    } catch (error) {
      console.warn('⚠️ Failed to load UI preferences:', error);
      return {};
    }
  }

  saveUIPreferences() {
    try {
      localStorage.setItem('futureSimulator:uiPreferences', JSON.stringify(this.state.preferences));
    } catch (error) {
      console.warn('⚠️ Failed to save UI preferences:', error);
    }
  }

  /**
   * クリーンアップ
   */
  dispose() {
    // イベントリスナーの削除
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners.clear();
    
    // アニメーションの停止
    this.animationQueue.length = 0;
    this.isAnimating = false;
    
    // 設定の保存
    this.saveUIPreferences();
    
    console.log('🧹 UIController disposed');
  }

  /**
   * デバッグ情報取得
   */
  getDebugInfo() {
    return {
      version: this.version,
      state: this.state,
      elementsCount: this.elements.size,
      listenersCount: this.eventListeners.size,
      animationQueueLength: this.animationQueue.length,
      performanceMetrics: this.performanceMetrics
    };
  }
}

export default UIController;