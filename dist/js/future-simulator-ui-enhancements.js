/**
 * Future Simulator UI Enhancements
 * bunenjin哲学: 最高のユーザー体験を実現するUI/UX統合システム
 */

class FutureSimulatorUIEnhancements {
  constructor() {
    this.loadingManager = null;
    this.errorManager = null;
    this.responsiveManager = null;
    this.initialized = false;
    
    this.initializationSteps = [
      { id: 'managers', label: '管理システム初期化中...', weight: 20 },
      { id: 'ui', label: 'UI要素読み込み中...', weight: 30 },
      { id: 'data', label: 'データ準備中...', weight: 25 },
      { id: 'finalize', label: '最終調整中...', weight: 25 }
    ];
    
    this.initializeEnhancements();
  }

  /**
   * UI強化システムの初期化
   */
  async initializeEnhancements() {
    try {
      await this.waitForDOMReady();
      await this.initializeManagers();
      await this.setupProgressiveLoading();
      await this.enhanceExistingElements();
      await this.setupResponsiveEnhancements();
      await this.finalizeInitialization();
      
      this.initialized = true;
      console.log('✅ Future Simulator UI Enhancement System - 初期化完了');
    } catch (error) {
      console.error('❌ UI Enhancement System 初期化エラー:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * DOM準備完了待機
   */
  waitForDOMReady() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  }

  /**
   * 管理システムの初期化
   */
  async initializeManagers() {
    this.updateInitialLoadingProgress('managers', 0);
    
    // Progressive Loading Manager
    if (typeof ProgressiveLoadingManager !== 'undefined') {
      this.loadingManager = new ProgressiveLoadingManager();
      this.updateInitialLoadingProgress('managers', 30);
    }
    
    // User Error Manager
    if (typeof UserErrorManager !== 'undefined') {
      this.errorManager = new UserErrorManager();
      this.updateInitialLoadingProgress('managers', 60);
    }
    
    // Responsive Enhancement Manager
    if (typeof ResponsiveEnhancementManager !== 'undefined') {
      this.responsiveManager = new ResponsiveEnhancementManager();
      this.updateInitialLoadingProgress('managers', 100);
    }
    
    // グローバルエラーハンドラーの設定
    this.setupGlobalErrorHandling();
  }

  /**
   * プログレッシブローディングの設定
   */
  async setupProgressiveLoading() {
    this.updateInitialLoadingProgress('ui', 0);
    
    if (!this.loadingManager) return;
    
    // スケルトンローダーの準備
    const skeletonElements = document.querySelectorAll('.skeleton-container');
    skeletonElements.forEach(skeleton => {
      skeleton.setAttribute('aria-label', '読み込み中');
      skeleton.setAttribute('role', 'status');
    });
    
    this.updateInitialLoadingProgress('ui', 50);
    
    // プログレッシブレンダリング対象要素の準備
    const progressiveElements = document.querySelectorAll('[data-progressive-load]');
    progressiveElements.forEach((element, index) => {
      element.classList.add('fade-in-progressive');
      element.classList.add(`progressive-delay-${Math.min(index + 1, 4)}`);
    });
    
    this.updateInitialLoadingProgress('ui', 100);
  }

  /**
   * 既存要素の強化
   */
  async enhanceExistingElements() {
    this.updateInitialLoadingProgress('data', 0);
    
    // フォーム要素の強化
    await this.enhanceFormElements();
    this.updateInitialLoadingProgress('data', 25);
    
    // ボタン要素の強化
    await this.enhanceButtonElements();
    this.updateInitialLoadingProgress('data', 50);
    
    // モーダルの強化
    await this.enhanceModalElements();
    this.updateInitialLoadingProgress('data', 75);
    
    // アクセシビリティの強化
    await this.enhanceAccessibility();
    this.updateInitialLoadingProgress('data', 100);
  }

  /**
   * フォーム要素の強化
   */
  async enhanceFormElements() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
      // 自動リサイズ機能
      this.addAutoResize(textarea);
      
      // リアルタイム文字数カウント
      this.addCharacterCounter(textarea);
      
      // 入力支援メッセージ
      this.addInputGuidance(textarea);
    });
    
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
    inputs.forEach(input => {
      // バリデーション強化
      this.addInputValidation(input);
    });
  }

  /**
   * テキストエリアの自動リサイズ
   */
  addAutoResize(textarea) {
    const resize = () => {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(textarea.scrollHeight, 120) + 'px';
    };
    
    textarea.addEventListener('input', resize);
    textarea.addEventListener('paste', () => setTimeout(resize, 0));
    
    // 初期サイズ調整
    setTimeout(resize, 0);
  }

  /**
   * 文字数カウンターの追加
   */
  addCharacterCounter(textarea) {
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
      position: absolute;
      bottom: 8px;
      right: 12px;
      font-size: 0.75rem;
      color: #9ca3af;
      pointer-events: none;
      background: rgba(17, 24, 39, 0.8);
      padding: 2px 6px;
      border-radius: 4px;
    `;
    
    const updateCounter = () => {
      const length = textarea.value.length;
      counter.textContent = `${length} 文字`;
      
      if (length > 2000) {
        counter.style.color = '#ef4444';
      } else if (length > 1500) {
        counter.style.color = '#f59e0b';
      } else {
        counter.style.color = '#9ca3af';
      }
    };
    
    textarea.addEventListener('input', updateCounter);
    textarea.parentNode.style.position = 'relative';
    textarea.parentNode.appendChild(counter);
    
    updateCounter();
  }

  /**
   * 入力支援メッセージの追加
   */
  addInputGuidance(textarea) {
    let guidanceTimeout;
    
    const showGuidance = (message) => {
      if (this.responsiveManager) {
        this.responsiveManager.announceToScreenReader(message);
      }
    };
    
    textarea.addEventListener('focus', () => {
      if (textarea.value.length === 0) {
        guidanceTimeout = setTimeout(() => {
          showGuidance('自然な言葉で入力してください。正式な文章である必要はありません。');
        }, 3000);
      }
    });
    
    textarea.addEventListener('blur', () => {
      clearTimeout(guidanceTimeout);
    });
    
    textarea.addEventListener('input', () => {
      clearTimeout(guidanceTimeout);
    });
  }

  /**
   * ボタン要素の強化
   */
  async enhanceButtonElements() {
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
      // タッチフィードバックの追加
      this.addTouchFeedback(button);
      
      // キーボードアクセシビリティの強化
      this.enhanceKeyboardAccess(button);
      
      // ローディング状態の管理
      this.addLoadingState(button);
    });
  }

  /**
   * タッチフィードバックの追加
   */
  addTouchFeedback(element) {
    let isPressed = false;
    
    const addClass = () => {
      if (!isPressed) {
        element.classList.add('interactive');
        isPressed = true;
      }
    };
    
    const removeClass = () => {
      if (isPressed) {
        element.classList.remove('interactive');
        isPressed = false;
      }
    };
    
    element.addEventListener('touchstart', addClass, { passive: true });
    element.addEventListener('touchend', removeClass, { passive: true });
    element.addEventListener('touchcancel', removeClass, { passive: true });
    element.addEventListener('mousedown', addClass);
    element.addEventListener('mouseup', removeClass);
    element.addEventListener('mouseleave', removeClass);
  }

  /**
   * キーボードアクセシビリティの強化
   */
  enhanceKeyboardAccess(element) {
    // フォーカス表示の強化
    element.addEventListener('focus', () => {
      element.classList.add('focus-visible');
    });
    
    element.addEventListener('blur', () => {
      element.classList.remove('focus-visible');
    });
    
    // Enterキーでの実行
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && element.getAttribute('role') === 'button') {
        e.preventDefault();
        element.click();
      }
    });
  }

  /**
   * ボタンのローディング状態管理
   */
  addLoadingState(button) {
    const originalText = button.textContent;
    
    button.setLoading = (loading = true) => {
      if (loading) {
        button.disabled = true;
        button.classList.add('loading');
        button.innerHTML = `
          <span class="loading-spinner" style="
            width: 16px; 
            height: 16px; 
            border: 2px solid rgba(255,255,255,0.3); 
            border-left: 2px solid white; 
            border-radius: 50%; 
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-right: 8px;
          "></span>
          処理中...
        `;
      } else {
        button.disabled = false;
        button.classList.remove('loading');
        button.textContent = originalText;
      }
    };
  }

  /**
   * モーダル要素の強化
   */
  async enhanceModalElements() {
    const modals = document.querySelectorAll('.modal, [role="dialog"]');
    modals.forEach(modal => {
      this.enhanceModal(modal);
    });
  }

  /**
   * 個別モーダルの強化
   */
  enhanceModal(modal) {
    // フォーカストラップの設定
    this.setupFocusTrap(modal);
    
    // Escapeキーでの閉じる機能
    this.setupEscapeClose(modal);
    
    // オーバーレイクリックでの閉じる機能
    this.setupOverlayClose(modal);
    
    // アクセシビリティ属性の設定
    if (!modal.hasAttribute('role')) {
      modal.setAttribute('role', 'dialog');
    }
    if (!modal.hasAttribute('aria-modal')) {
      modal.setAttribute('aria-modal', 'true');
    }
  }

  /**
   * アクセシビリティの強化
   */
  async enhanceAccessibility() {
    // ARIA属性の自動設定
    this.setupAutoARIA();
    
    // スキップリンクの追加
    this.addSkipLinks();
    
    // ランドマークの設定
    this.setupLandmarks();
  }

  /**
   * レスポンシブエンハンスメントの設定
   */
  async setupResponsiveEnhancements() {
    if (!this.responsiveManager) return;
    
    // ブレークポイント変更の監視
    this.responsiveManager.onBreakpointChange((newBreakpoint, oldBreakpoint) => {
      this.handleBreakpointChange(newBreakpoint, oldBreakpoint);
    });
    
    // 画面回転の監視
    this.responsiveManager.onOrientationChange((isLandscape, angle) => {
      this.handleOrientationChange(isLandscape, angle);
    });
  }

  /**
   * ブレークポイント変更の処理
   */
  handleBreakpointChange(newBreakpoint, oldBreakpoint) {
    console.log(`ブレークポイント変更: ${oldBreakpoint} -> ${newBreakpoint}`);
    
    // レイアウト調整
    this.adjustLayoutForBreakpoint(newBreakpoint);
    
    // インタラクション調整
    this.adjustInteractionForBreakpoint(newBreakpoint);
  }

  /**
   * ブレークポイント別レイアウト調整
   */
  adjustLayoutForBreakpoint(breakpoint) {
    const container = document.getElementById('main-container');
    if (!container) return;
    
    // モバイル用の調整
    if (['xs', 'sm'].includes(breakpoint)) {
      container.classList.add('mobile-layout');
      this.optimizeForMobile();
    } else {
      container.classList.remove('mobile-layout');
      this.optimizeForDesktop();
    }
  }

  /**
   * モバイル最適化
   */
  optimizeForMobile() {
    // タッチ対応の強化
    document.body.classList.add('touch-optimized');
    
    // スクロール最適化
    document.documentElement.style.webkitOverflowScrolling = 'touch';
  }

  /**
   * デスクトップ最適化
   */
  optimizeForDesktop() {
    document.body.classList.remove('touch-optimized');
  }

  /**
   * グローバルエラーハンドリングの設定
   */
  setupGlobalErrorHandling() {
    if (!this.errorManager) return;
    
    // 未処理の例外をキャッチ
    window.addEventListener('error', (event) => {
      this.errorManager.displayError(event.error || new Error(event.message), {
        context: 'global',
        retryCallback: () => window.location.reload()
      });
    });
    
    // Promise の拒否をキャッチ
    window.addEventListener('unhandledrejection', (event) => {
      this.errorManager.displayError(new Error(`Promise拒否: ${event.reason}`), {
        context: 'promise',
        retryCallback: () => window.location.reload()
      });
    });
  }

  /**
   * 初期化進捗の更新
   */
  updateInitialLoadingProgress(stepId, percentage) {
    const step = this.initializationSteps.find(s => s.id === stepId);
    if (!step) return;
    
    const currentStepIndex = this.initializationSteps.indexOf(step);
    const previousStepsWeight = this.initializationSteps
      .slice(0, currentStepIndex)
      .reduce((sum, s) => sum + s.weight, 0);
    
    const totalProgress = previousStepsWeight + (step.weight * percentage / 100);
    
    const progressBar = document.getElementById('initial-loading-progress');
    const progressText = document.getElementById('initial-loading-percentage');
    const loadingText = document.getElementById('initial-loading-text');
    
    if (progressBar) {
      progressBar.style.width = `${totalProgress}%`;
      progressBar.setAttribute('aria-valuenow', totalProgress);
    }
    
    if (progressText) {
      progressText.textContent = `${Math.round(totalProgress)}%`;
    }
    
    if (loadingText && percentage === 0) {
      loadingText.textContent = step.label;
    }
  }

  /**
   * 初期化完了処理
   */
  async finalizeInitialization() {
    this.updateInitialLoadingProgress('finalize', 0);
    
    // スケルトンの非表示とコンテンツの表示
    setTimeout(() => {
      this.showMainContent();
      this.updateInitialLoadingProgress('finalize', 50);
    }, 500);
    
    // 初期ローディング画面の非表示
    setTimeout(() => {
      this.hideInitialLoading();
      this.updateInitialLoadingProgress('finalize', 100);
    }, 1000);
  }

  /**
   * メインコンテンツの表示
   */
  showMainContent() {
    const mainContainer = document.getElementById('main-container');
    const skeletons = document.querySelectorAll('.skeleton-container');
    const contents = document.querySelectorAll('.input-content, .fade-in-progressive');
    
    // スケルトンを非表示
    skeletons.forEach(skeleton => {
      skeleton.style.opacity = '0';
      setTimeout(() => {
        skeleton.style.display = 'none';
      }, 300);
    });
    
    // コンテンツを表示
    contents.forEach((content, index) => {
      setTimeout(() => {
        content.style.display = 'block';
        content.classList.add('loaded');
      }, 100 * (index + 1));
    });
    
    // メインコンテナのフェードイン
    if (mainContainer) {
      mainContainer.style.transition = 'opacity 0.5s ease';
      mainContainer.style.opacity = '1';
    }
  }

  /**
   * 初期ローディング画面の非表示
   */
  hideInitialLoading() {
    const initialLoading = document.getElementById('initial-loading');
    if (initialLoading) {
      initialLoading.style.opacity = '0';
      setTimeout(() => {
        initialLoading.style.display = 'none';
      }, 300);
    }
  }

  /**
   * 初期化エラーの処理
   */
  handleInitializationError(error) {
    console.error('UI Enhancement System 初期化エラー:', error);
    
    // エラー表示
    const errorDiv = document.createElement('div');
    errorDiv.className = 'initialization-error';
    errorDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(220, 38, 38, 0.9);
        color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        z-index: 10000;
      ">
        <h3>システム初期化エラー</h3>
        <p>UI拡張機能の読み込みに失敗しました</p>
        <button onclick="location.reload()" style="
          margin-top: 10px;
          padding: 8px 16px;
          background: white;
          color: #dc2626;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        ">
          ページを再読み込み
        </button>
      </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // 基本機能での動作を継続
    setTimeout(() => {
      this.showMainContent();
      this.hideInitialLoading();
    }, 2000);
  }

  /**
   * 画面回転の処理
   */
  handleOrientationChange(isLandscape, angle) {
    // 画面回転時の処理
    console.log(`画面回転: ${isLandscape ? 'landscape' : 'portrait'} (${angle}度)`);
    
    // レイアウトの再調整
    setTimeout(() => {
      this.adjustLayoutForOrientation(isLandscape);
    }, 100);
  }

  /**
   * 向き別レイアウト調整
   */
  adjustLayoutForOrientation(isLandscape) {
    const body = document.body;
    
    if (isLandscape) {
      body.classList.add('landscape-mode');
    } else {
      body.classList.remove('landscape-mode');
    }
  }

  // その他のヘルパーメソッド（setupFocusTrap, setupEscapeClose, etc.）は
  // ResponsiveEnhancementManagerから継承または参照
}

// 自動初期化
document.addEventListener('DOMContentLoaded', () => {
  window.futureSimulatorUI = new FutureSimulatorUIEnhancements();
});

// グローバル利用のためのエクスポート
window.FutureSimulatorUIEnhancements = FutureSimulatorUIEnhancements;