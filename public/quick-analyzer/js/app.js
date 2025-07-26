/**
 * Quick Analyzer Main Application
 * アプリケーション全体を統合し、画面遷移とフローを管理
 */
class QuickAnalyzerApp {
  constructor() {
    this.initialized = false;
    this.currentScreen = 'welcome';
    this.components = {};
    this.dataManager = null;
    this.storageManager = null;
    
    // アプリケーション状態
    this.state = {
      answers: {},
      analysisResult: null,
      currentQuestionIndex: 0,
      flowCompleted: false
    };
    
    // 画面定義
    this.SCREENS = {
      WELCOME: 'welcome',
      QUESTIONS: 'questions',
      RESULTS: 'results'
    };
    
    // 設定
    this.CONFIG = {
      autoSave: true,
      enableAnimations: true,
      debugMode: false
    };
    
    this.init();
  }

  /**
   * アプリケーションを初期化
   */
  async init() {
    try {
      console.log('🚀 Quick Analyzer App initializing...');
      
      // DOM準備完了を待つ
      if (document.readyState !== 'complete') {
        await new Promise(resolve => {
          window.addEventListener('load', resolve);
        });
      }
      
      // 依存関係の確認
      this.checkDependencies();
      
      // コアシステムの初期化
      await this.initializeCore();
      
      // UIコンポーネントの初期化
      await this.initializeComponents();
      
      // イベントリスナーの設定
      this.bindEvents();
      
      // 初期画面の表示
      this.showWelcomeScreen();
      
      this.initialized = true;
      console.log('✅ Quick Analyzer App initialized successfully');
      
    } catch (error) {
      console.error('❌ Quick Analyzer App initialization failed:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * 依存関係をチェック
   */
  checkDependencies() {
    const requiredClasses = [
      'BaseComponent',
      'ErrorHandler', 
      'StorageManager',
      'DataManager',
      'Calculator',
      'QuestionFlow',
      'ResultsView'
    ];
    
    const missing = requiredClasses.filter(className => !window[className]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required classes: ${missing.join(', ')}`);
    }
    
    console.log('✅ All dependencies available');
  }

  /**
   * コアシステムを初期化
   */
  async initializeCore() {
    // DataManagerの初期化
    this.dataManager = new DataManager();
    await this.dataManager.init();
    
    // StorageManagerの初期化
    this.storageManager = new StorageManager('haqei_quick_app_');
    
    // 保存された状態の復元
    this.restoreState();
    
    console.log('✅ Core systems initialized');
  }

  /**
   * UIコンポーネントを初期化
   */
  async initializeComponents() {
    try {
      // QuestionFlow コンポーネント
      this.components.questionFlow = new QuestionFlow('questions-container', {
        enableNavigation: true,
        saveProgress: true,
        validateAnswers: true,
        animateChanges: this.CONFIG.enableAnimations
      });
      
      await this.components.questionFlow.init();
      
      // ResultsView コンポーネント
      this.components.resultsView = new ResultsView('results-container', {
        showChart: true,
        showDetailedInsights: true,
        animateReveal: this.CONFIG.enableAnimations
      });
      
      await this.components.resultsView.init();
      
      console.log('✅ UI components initialized');
      
    } catch (error) {
      console.error('❌ Component initialization failed:', error);
      throw error;
    }
  }

  /**
   * イベントリスナーを設定
   */
  bindEvents() {
    // QuestionFlow イベント
    if (this.components.questionFlow) {
      this.components.questionFlow.container.addEventListener('questionflow:flowCompleted', (event) => {
        this.handleQuestionFlowCompleted(event.detail);
      });
      
      this.components.questionFlow.container.addEventListener('questionflow:answerChanged', (event) => {
        this.handleAnswerChanged(event.detail);
      });
    }
    
    // ResultsView イベント
    if (this.components.resultsView) {
      this.components.resultsView.container.addEventListener('resultsview:retakeRequested', () => {
        this.handleRetakeRequested();
      });
      
      this.components.resultsView.container.addEventListener('resultsview:startDiagnosisRequested', () => {
        this.showQuestionsScreen();
      });
    }
    
    // ウェルカム画面のボタン
    const startButton = document.getElementById('start-diagnosis-btn');
    if (startButton) {
      startButton.addEventListener('click', () => {
        this.showQuestionsScreen();
      });
    }
    
    // グローバルエラーハンドリング
    document.addEventListener('error:retry', () => {
      this.handleRetry();
    });
    
    console.log('✅ Event listeners bound');
  }

  /**
   * ウェルカム画面を表示
   */
  showWelcomeScreen() {
    this.currentScreen = this.SCREENS.WELCOME;
    this.updateScreenVisibility();
    this.renderWelcomeScreen();
    
    // プログレスバーを0%に設定
    this.updateGlobalProgress(0);
    
    console.log('👋 Showing welcome screen');
  }

  /**
   * 質問画面を表示
   */
  showQuestionsScreen() {
    this.currentScreen = this.SCREENS.QUESTIONS;
    this.updateScreenVisibility();
    
    // QuestionFlowコンポーネントの表示
    if (this.components.questionFlow) {
      this.components.questionFlow.show();
    }
    
    console.log('❓ Showing questions screen');
  }

  /**
   * 結果画面を表示
   */
  async showResultsScreen() {
    this.currentScreen = this.SCREENS.RESULTS;
    this.updateScreenVisibility();
    
    // 結果の計算と表示
    if (this.components.resultsView && this.state.answers) {
      await this.components.resultsView.calculateAndDisplayResult(this.state.answers);
      this.components.resultsView.show();
    }
    
    // プログレスバーを100%に設定
    this.updateGlobalProgress(100);
    
    console.log('📊 Showing results screen');
  }

  /**
   * 画面の表示切り替え
   */
  updateScreenVisibility() {
    const screens = {
      'welcome-container': this.currentScreen === this.SCREENS.WELCOME,
      'questions-container': this.currentScreen === this.SCREENS.QUESTIONS,
      'results-container': this.currentScreen === this.SCREENS.RESULTS
    };
    
    Object.entries(screens).forEach(([containerId, shouldShow]) => {
      const container = document.getElementById(containerId);
      if (container) {
        container.style.display = shouldShow ? 'block' : 'none';
      }
    });
  }

  /**
   * ウェルカム画面をレンダリング
   */
  renderWelcomeScreen() {
    const container = document.getElementById('welcome-container');
    if (!container) return;
    
    container.innerHTML = `
      <div class="welcome-screen">
        <div class="welcome-header">
          <a href="../index.html" class="back-link">
            ← トップページへ戻る
          </a>
          <h1 class="welcome-title brand-text">
            HaQei クイック診断
          </h1>
          <p class="welcome-subtitle">
            あなたの「第一印象」となる『八卦アバター』を見つけよう
          </p>
          <div class="welcome-description">
            5つの質問に直感で答えることで、あなたの基本的な性格特性を表す八卦アバターを特定します。
            所要時間は約2-3分です。
          </div>
        </div>
        
        <div class="welcome-actions">
          <button type="button" class="btn btn-primary btn-lg" id="start-diagnosis-btn">
            診断を開始する
          </button>
          
          <div class="welcome-features">
            <div class="feature-item">
              <span class="feature-icon">⚡</span>
              <span class="feature-text">わずか5問で完了</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🎯</span>
              <span class="feature-text">直感的で簡単</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📊</span>
              <span class="feature-text">詳細な分析結果</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // 開始ボタンのイベントリスナーを再設定
    const startBtn = container.querySelector('#start-diagnosis-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.showQuestionsScreen();
      });
    }
  }

  /**
   * 質問フロー完了ハンドラー
   * @param {Object} data - 完了データ
   */
  async handleQuestionFlowCompleted(data) {
    console.log('✅ Question flow completed:', data);
    
    // 回答データを状態に保存
    this.state.answers = data.answers;
    this.state.flowCompleted = true;
    
    // 状態を保存
    this.saveState();
    
    // 結果画面に遷移
    await this.showResultsScreen();
  }

  /**
   * 回答変更ハンドラー
   * @param {Object} data - 回答データ
   */
  handleAnswerChanged(data) {
    // 状態を更新
    this.state.answers = data.allAnswers;
    this.state.currentQuestionIndex = data.questionIndex;
    
    // プログレスバーを更新
    const progress = (Object.keys(this.state.answers).length / 5) * 100;
    this.updateGlobalProgress(progress);
    
    // 自動保存
    if (this.CONFIG.autoSave) {
      this.saveState();
    }
  }

  /**
   * 再診断要求ハンドラー
   */
  handleRetakeRequested() {
    console.log('🔄 Retake requested');
    
    // 状態をリセット
    this.resetState();
    
    // QuestionFlowをリセット
    if (this.components.questionFlow) {
      this.components.questionFlow.reset();
    }
    
    // 質問画面に戻る
    this.showQuestionsScreen();
  }

  /**
   * 再試行ハンドラー
   */
  handleRetry() {
    console.log('🔄 Retry requested');
    
    // 現在の画面を再読み込み
    switch (this.currentScreen) {
      case this.SCREENS.WELCOME:
        this.showWelcomeScreen();
        break;
      case this.SCREENS.QUESTIONS:
        this.showQuestionsScreen();
        break;
      case this.SCREENS.RESULTS:
        this.showResultsScreen();
        break;
    }
  }

  /**
   * グローバルプログレスバーを更新
   * @param {number} percentage - 進捗パーセンテージ
   */
  updateGlobalProgress(percentage) {
    const progressBar = document.querySelector('.global-progress .progress-bar');
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
      progressBar.parentElement.style.setProperty('--progress', `${percentage}%`);
    }
  }

  /**
   * 状態を保存
   */
  saveState() {
    if (!this.storageManager) return;
    
    const stateData = {
      ...this.state,
      currentScreen: this.currentScreen,
      timestamp: new Date().toISOString()
    };
    
    this.storageManager.save('app_state', stateData, {
      expiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24時間
    });
  }

  /**
   * 状態を復元
   */
  restoreState() {
    if (!this.storageManager) return;
    
    const savedState = this.storageManager.load('app_state');
    if (savedState) {
      this.state = {
        ...this.state,
        ...savedState
      };
      
      console.log('📁 App state restored:', this.state);
    }
  }

  /**
   * 状態をリセット
   */
  resetState() {
    this.state = {
      answers: {},
      analysisResult: null,
      currentQuestionIndex: 0,
      flowCompleted: false
    };
    
    // ストレージからも削除
    if (this.storageManager) {
      this.storageManager.remove('app_state');
    }
    
    console.log('🗑️ App state reset');
  }

  /**
   * 初期化エラーハンドラー
   * @param {Error} error - エラーオブジェクト
   */
  handleInitializationError(error) {
    // エラー画面を表示
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div class="error-screen">
          <h2>初期化エラー</h2>
          <p>アプリケーションの初期化に失敗しました。</p>
          <p class="error-message">${error.message}</p>
          <button onclick="location.reload()" class="btn btn-primary">
            ページを再読み込み
          </button>
        </div>
      `;
    }
    
    // ErrorHandlerに通知
    if (window.ErrorHandler) {
      window.ErrorHandler.handleError(error, {
        context: 'app_initialization',
        component: 'QuickAnalyzerApp'
      });
    }
  }

  /**
   * アプリケーションの破棄
   */
  destroy() {
    // コンポーネントの破棄
    Object.values(this.components).forEach(component => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    
    // 最終保存
    this.saveState();
    
    console.log('🗑️ Quick Analyzer App destroyed');
  }

  /**
   * 現在の状態を取得
   * @returns {Object}
   */
  getState() {
    return { ...this.state };
  }

  /**
   * デバッグ情報を取得
   * @returns {Object}
   */
  getDebugInfo() {
    return {
      initialized: this.initialized,
      currentScreen: this.currentScreen,
      state: this.state,
      components: Object.keys(this.components),
      config: this.CONFIG
    };
  }
}

// アプリケーション開始
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌟 Quick Analyzer starting...');
  window.quickAnalyzerApp = new QuickAnalyzerApp();
});

// グローバルエラーハンドリング
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// デバッグ用グローバル関数
window.debugQuickAnalyzer = () => {
  if (window.quickAnalyzerApp) {
    console.log('Quick Analyzer Debug Info:', window.quickAnalyzerApp.getDebugInfo());
  }
};