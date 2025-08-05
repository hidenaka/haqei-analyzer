/**
 * VirtualQuestionFlow v2.0 - Unified Modular Version
 * 2,127行から800行に削減したモジュラー統合版
 */

class VirtualQuestionFlow extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, options);
    
    // モジュール化された各システムを初期化
    this.initializeModularSystems(options);
    
    // DOM初期化
    this.initializeDOM();
    
    console.log('✅ VirtualQuestionFlow v2.0 initialized with modular architecture');
  }
  
  /**
   * モジュラーシステム初期化
   */
  initializeModularSystems(options) {
    // Core システム（基本機能）
    this.core = new VirtualQuestionFlowCore(this.container.id, options);
    
    // Renderer システム（レンダリング処理）
    this.renderer = new VirtualQuestionFlowRenderer(this.core);
    this.core.renderer = this.renderer; // 相互参照
    
    // Navigator システム（ナビゲーション処理）
    this.navigator = new VirtualQuestionFlowNavigator(this.core);
    this.core.navigator = this.navigator; // 相互参照
    
    // State システム（状態管理）
    this.state = new VirtualQuestionFlowState(this.core);
    this.core.state = this.state; // 相互参照
    
    // Utils システム（ユーティリティと緊急修正）
    this.utils = new VirtualQuestionFlowUtils(this.core);
    this.core.utils = this.utils; // 相互参照
    
    console.log('🧩 Modular systems initialized');
  }
  
  /**
   * DOM初期化（簡素化版）
   */
  initializeDOM() {
    // Core で基本的な DOM は初期化済み
    // 追加のイベントリスナーのみ設定
    
    // 包括的なエラーハンドリング
    window.addEventListener('error', (e) => {
      console.error('❌ Global error in VirtualQuestionFlow:', e.error);
      this.handleGlobalError(e.error);
    });
    
    // リサイズ対応
    window.addEventListener('resize', () => {
      if (this.renderer) {
        this.renderer.adjustForViewport();
      }
    });
  }
  
  /**
   * 設問開始（統合版）
   */
  async start() {
    try {
      // 状態復元を試行
      const restored = this.state.restoreState();
      if (restored) {
        console.log('📄 State restored from previous session');
      }
      
      // Core システムで開始
      await this.core.start();
      
      // 復元された状態に応じて画面更新
      if (restored && this.core.currentQuestionIndex > 0) {
        await this.core.renderVisibleQuestions();
        this.core.showCurrentQuestion();
        this.core.updateNavigationButtons();
        this.core.updateProgress();
      }
      
      // 初回診断実行
      this.utils.runComprehensiveDiagnostics();
      
      console.log('🚀 VirtualQuestionFlow v2.0 started successfully');
      
    } catch (error) {
      console.error('❌ Failed to start VirtualQuestionFlow:', error);
      this.handleStartupError(error);
    }
  }
  
  /**
   * 設問データ設定
   */
  setQuestions(questions) {
    this.core.questions = questions;
    console.log(`📋 ${questions.length} questions loaded`);
  }
  
  /**
   * ナビゲーション：次へ（統合版）
   */
  goToNext() {
    this.navigator.goToNext();
  }
  
  /**
   * ナビゲーション：前へ（統合版）
   */
  goToPrevious() {
    this.navigator.goToPrevious();
  }
  
  /**
   * 指定された設問への移動
   */
  goToQuestion(questionIndex) {
    return this.navigator.goToQuestion(questionIndex);
  }
  
  /**
   * 回答変更処理（統合版）
   */
  handleAnswerChange(detail) {
    // State システムで回答管理
    const answer = this.state.addAnswer(detail.questionId, {
      selectedValue: detail.value,
      selectedChoice: `${detail.questionId}${detail.value.toLowerCase()}`,
      scoring_tags: detail.scoringTags || [],
      choiceType: detail.choiceType
    });
    
    // Core システムでUI更新
    this.core.updateProgress();
    this.core.updateNavigationButtons();
    
    // 完了チェック
    const completedCount = this.state.getProgressStats().answeredQuestions;
    if (completedCount === this.core.questions.length) {
      this.handleAllQuestionsCompleted();
    }
    
    console.log(`📝 Answer processed: ${detail.questionId} = ${detail.value}`);
  }
  
  /**
   * 全設問完了処理
   */
  handleAllQuestionsCompleted() {
    console.log('🏁 All questions completed');
    
    if (this.core.options.onComplete) {
      setTimeout(() => {
        this.core.options.onComplete(this.state.getAllAnswers());
      }, 1500);
    }
  }
  
  /**
   * 緊急修正の実行
   */
  applyEmergencyFixes() {
    return this.utils.applyAllEmergencyFixes();
  }
  
  /**
   * 診断の実行
   */
  runDiagnostics() {
    return this.utils.runComprehensiveDiagnostics();
  }
  
  /**
   * 進捗統計の取得
   */
  getProgress() {
    return this.state.getProgressStats();
  }
  
  /**
   * 現在の状態取得
   */
  getCurrentState() {
    return this.state.getCurrentState();
  }
  
  /**
   * 回答データの取得
   */
  getAnswers() {
    return this.state.getAllAnswers();
  }
  
  /**
   * デバッグ情報の取得
   */
  getDebugInfo() {
    return this.utils.getDebugInfo();
  }
  
  /**
   * パフォーマンス測定
   */
  measurePerformance(operation, func) {
    return this.utils.measurePerformance(operation, func);
  }
  
  /**
   * グローバルエラーハンドリング
   */
  handleGlobalError(error) {
    console.error('🚨 Global error handled:', error);
    
    // 緊急修正を試行
    try {
      this.applyEmergencyFixes();
      console.log('🚑 Emergency fixes applied after error');
    } catch (fixError) {
      console.error('❌ Emergency fixes failed:', fixError);
    }
  }
  
  /**
   * 起動エラーハンドリング
   */
  handleStartupError(error) {
    console.error('🚨 Startup error handled:', error);
    
    // フォールバック表示
    this.container.innerHTML = `
      <div class="error-container">
        <h2>設問システム初期化エラー</h2>
        <p>システムの初期化中にエラーが発生しました。</p>
        <button onclick="location.reload()">ページを再読み込み</button>
      </div>
    `;
  }
  
  /**
   * 統計情報の取得（統合版）
   */
  getStats() {
    return {
      navigation: this.navigator.getNavigationStats(),
      progress: this.state.getProgressStats(),
      performance: this.utils.performanceMetrics,
      system: this.utils.getDebugInfo()
    };
  }
  
  /**
   * エクスポート用データ
   */
  exportData() {
    return this.state.exportData();
  }
  
  /**
   * データのインポート
   */
  importData(data) {
    return this.state.importData(data);
  }
  
  /**
   * 状態のリセット
   */
  reset() {
    this.state.resetState();
    this.core.currentQuestionIndex = 0;
    this.core.updateVisibleRange();
    this.core.renderVisibleQuestions();
    this.core.showCurrentQuestion();
    this.core.updateNavigationButtons();
    this.core.updateProgress();
    
    console.log('🔄 VirtualQuestionFlow reset to initial state');
  }
  
  /**
   * 要素の検証と修正
   */
  verifyAndFix() {
    const results = this.utils.runComprehensiveDiagnostics();
    
    if (!results.domStructure || !results.answerData) {
      console.warn('⚠️ Issues detected, applying fixes...');
      this.applyEmergencyFixes();
    }
    
    return results;
  }
  
  /**
   * リアルタイム監視の開始
   */
  startMonitoring() {
    // 5秒毎にシステム状態をチェック
    this.monitoringInterval = setInterval(() => {
      const stats = this.getStats();
      
      // パフォーマンス問題の検出
      if (stats.performance.renderTime > 100) {
        console.warn('⚠️ Performance issue detected');
        this.applyEmergencyFixes();
      }
      
      // DOM整合性の検証
      if (stats.system.elements.activeElementsCount === 0 && this.core.questions.length > 0) {
        console.warn('⚠️ DOM consistency issue detected');
        this.verifyAndFix();
      }
      
    }, 5000);
    
    console.log('👁️ Real-time monitoring started');
  }
  
  /**
   * 監視の停止
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('👁️ Monitoring stopped');
    }
  }
  
  /**
   * 完全なクリーンアップ
   */
  destroy() {
    // 監視停止
    this.stopMonitoring();
    
    // 各モジュールのクリーンアップ
    if (this.utils) this.utils.destroy();
    if (this.state) this.state.destroy();
    if (this.navigator) this.navigator.destroy();
    if (this.renderer) this.renderer.destroy();
    if (this.core) this.core.destroy();
    
    // イベントリスナー削除
    window.removeEventListener('error', this.handleGlobalError);
    window.removeEventListener('resize', this.handleResize);
    
    console.log('🧹 VirtualQuestionFlow v2.0 completely destroyed');
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.VirtualQuestionFlow = VirtualQuestionFlow;
  console.log('✅ VirtualQuestionFlow v2.0 (Unified Modular Version) loaded');
}