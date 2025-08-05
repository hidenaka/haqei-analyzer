// HaQei Analyzer - Expandable Section Component
// Phase 5.2: UX/情報アーキテクチャ再設計対応版

class ExpandableSection {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.container = typeof containerId === 'string' 
      ? document.getElementById(containerId) 
      : containerId;
      
    if (!this.container) {
      throw new Error(`Container element not found: ${containerId}`);
    }

    this.options = {
      level: 1, // 1-4の階層レベル
      title: '詳細を表示',
      icon: '▼',
      expandedIcon: '▲',
      initiallyExpanded: false,
      animationDuration: 300,
      onExpand: null,
      onCollapse: null,
      trackAnalytics: true,
      cacheContent: true,
      lazyLoad: false,
      mobileFriendly: true,
      
      // Phase 5.2: LayeredResultsView統合オプション
      integrateWithLayeredView: false,
      bunenjinMode: false,
      progressiveDisclosure: true,
      maxConcurrentExpansions: 2,
      autoCollapseInactive: true,
      
      // bunenjin哲学特化オプション
      bunenjinType: null, // 'engine', 'interface', 'safe', null
      showBunenjinIcon: true,
      emphasizeBalance: false,
      
      ...options
    };

    this.isExpanded = this.options.initiallyExpanded;
    this.contentCache = new Map();
    this.animationInProgress = false;
    
    // Phase 5.2: LayeredResultsView統合関連
    this.layeredViewRef = null;
    this.expansionTimestamp = null;
    this.bunenjinContext = null;
    
    // アナリティクスデータ
    this.analyticsData = {
      expansions: 0,
      totalTimeExpanded: 0,
      lastExpansionTime: null,
      userEngagement: 0
    };
    
    this.init();
  }

  init() {
    this.createStructure();
    this.bindEvents();
    this.setupAccessibility();
    
    if (this.options.trackAnalytics) {
      this.initAnalytics();
    }
  }

  createStructure() {
    const sectionId = `expandable-section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const contentId = `${sectionId}-content`;
    
    // bunenjin哲学対応の特別構造
    if (this.options.bunenjinMode) {
      this.createBunenjinStructure(sectionId, contentId);
    } else {
      this.createStandardStructure(sectionId, contentId);
    }

    this.headerElement = this.container.querySelector('.section-header');
    this.contentElement = this.container.querySelector('.section-content');
    this.contentWrapper = this.container.querySelector('.content-wrapper');
    this.iconElement = this.container.querySelector('.section-icon');
  }

  // 標準構造の作成
  createStandardStructure(sectionId, contentId) {
    this.container.innerHTML = `
      <div class="expandable-section level-${this.options.level}" data-level="${this.options.level}">
        <button 
          class="section-header ${this.isExpanded ? 'expanded' : 'collapsed'}"
          aria-expanded="${this.isExpanded}"
          aria-controls="${contentId}"
          data-section-level="${this.options.level}"
        >
          <span class="section-icon" aria-hidden="true">${this.isExpanded ? this.options.expandedIcon : this.options.icon}</span>
          <span class="section-title">${this.options.title}</span>
          <span class="level-indicator">Level ${this.options.level}</span>
        </button>
        <div 
          class="section-content ${this.isExpanded ? 'expanded' : 'collapsed'}"
          id="${contentId}"
          aria-hidden="${!this.isExpanded}"
          style="max-height: ${this.isExpanded ? 'none' : '0'}"
        >
          <div class="content-wrapper">
            ${this.isExpanded ? this.getInitialContent() : ''}
          </div>
        </div>
      </div>
    `;
  }

  // bunenjin哲学特化構造の作成
  createBunenjinStructure(sectionId, contentId) {
    const bunenjinIcons = {
      engine: '🔥',
      interface: '🎭',
      safe: '🛡️'
    };
    
    const bunenjinThemes = {
      engine: 'engine-bunenjin',
      interface: 'interface-bunenjin',
      safe: 'safe-bunenjin'
    };
    
    const bunenjinIcon = this.options.showBunenjinIcon && this.options.bunenjinType 
      ? bunenjinIcons[this.options.bunenjinType] || '🎭'
      : '';
    
    const themeClass = this.options.bunenjinType 
      ? bunenjinThemes[this.options.bunenjinType] || ''
      : '';

    this.container.innerHTML = `
      <div class="expandable-section bunenjin-section level-${this.options.level} ${themeClass}" 
           data-level="${this.options.level}" 
           data-bunenjin-type="${this.options.bunenjinType || ''}">
        <button 
          class="section-header bunenjin-header ${this.isExpanded ? 'expanded' : 'collapsed'}"
          aria-expanded="${this.isExpanded}"
          aria-controls="${contentId}"
          data-section-level="${this.options.level}"
          data-bunenjin-type="${this.options.bunenjinType || ''}"
        >
          ${bunenjinIcon ? `<span class="bunenjin-icon" aria-hidden="true">${bunenjinIcon}</span>` : ''}
          <span class="section-icon" aria-hidden="true">${this.isExpanded ? this.options.expandedIcon : this.options.icon}</span>
          <span class="section-title">${this.options.title}</span>
          <div class="section-meta">
            <span class="level-indicator">Level ${this.options.level}</span>
            ${this.options.emphasizeBalance ? '<span class="balance-indicator">⚖️</span>' : ''}
          </div>
        </button>
        <div 
          class="section-content bunenjin-content ${this.isExpanded ? 'expanded' : 'collapsed'}"
          id="${contentId}"
          aria-hidden="${!this.isExpanded}"
          style="max-height: ${this.isExpanded ? 'none' : '0'}"
        >
          <div class="content-wrapper bunenjin-content-wrapper">
            ${this.isExpanded ? this.getInitialContent() : ''}
          </div>
          ${this.options.emphasizeBalance ? this.renderBalanceIndicator() : ''}
        </div>
      </div>
    `;
  }

  // バランスインジケーターのレンダリング
  renderBalanceIndicator() {
    return `
      <div class="balance-indicator-section">
        <div class="balance-note">
          この情報があなたの分人バランスにどう影響するかを考えてみましょう
        </div>
      </div>
    `;
  }

  getInitialContent() {
    if (this.options.lazyLoad) {
      return '<div class="loading-placeholder">読み込み中...</div>';
    }
    return '<div class="content-placeholder">コンテンツを準備中...</div>';
  }

  bindEvents() {
    this.headerElement.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });

    // キーボードアクセシビリティ
    this.headerElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      }
    });

    // モバイル対応: タッチイベント
    if (this.options.mobileFriendly) {
      this.headerElement.addEventListener('touchstart', (e) => {
        this.headerElement.classList.add('touch-active');
      });

      this.headerElement.addEventListener('touchend', (e) => {
        this.headerElement.classList.remove('touch-active');
      });
    }
  }

  setupAccessibility() {
    // ARIAラベルの動的更新
    this.updateAriaLabels();
    
    // フォーカス管理
    this.headerElement.tabIndex = 0;
    this.headerElement.setAttribute('role', 'button');
  }

  updateAriaLabels() {
    const action = this.isExpanded ? '折りたたむ' : '展開する';
    this.headerElement.setAttribute('aria-label', `${this.options.title} - ${action}`);
  }

  async toggle() {
    if (this.animationInProgress) {
      return;
    }

    if (this.isExpanded) {
      await this.collapse();
    } else {
      await this.expand();
    }
  }

  async expand() {
    if (this.isExpanded || this.animationInProgress) {
      return;
    }

    this.animationInProgress = true;

    try {
      // Phase 5.2: LayeredResultsView統合チェック
      if (this.options.integrateWithLayeredView) {
        const shouldProceed = await this.checkLayeredViewConstraints();
        if (!shouldProceed) {
          console.log('🚫 Expansion blocked by LayeredView constraints');
          this.animationInProgress = false;
          return;
        }
      }

      // アナリティクス更新
      this.analyticsData.expansions++;
      this.analyticsData.lastExpansionTime = Date.now();
      this.expansionTimestamp = Date.now();

      // 分析トラッキング
      if (this.options.trackAnalytics) {
        this.trackEvent('expand', { 
          level: this.options.level,
          bunenjinType: this.options.bunenjinType,
          expansionCount: this.analyticsData.expansions
        });
      }

      // コンテンツの遅延読み込み
      if (this.options.lazyLoad && this.contentWrapper.innerHTML.includes('loading-placeholder')) {
        await this.loadContent();
      }

      // 展開アニメーション
      await this.performExpandAnimation();

      this.isExpanded = true;
      this.updateUI();

      // Phase 5.2: LayeredResultsViewに通知
      if (this.layeredViewRef && this.options.integrateWithLayeredView) {
        this.layeredViewRef.onSectionExpanded?.(this);
      }

      // コールバック実行
      if (this.options.onExpand) {
        await this.options.onExpand(this);
      }

    } catch (error) {
      console.error('❌ Expansion failed:', error);
      this.isExpanded = false;
    } finally {
      this.animationInProgress = false;
    }
  }

  async collapse() {
    if (!this.isExpanded || this.animationInProgress) {
      return;
    }

    this.animationInProgress = true;

    try {
      // 分析トラッキング
      if (this.options.trackAnalytics) {
        this.trackEvent('collapse', { level: this.options.level });
      }

      // 折りたたみアニメーション
      await this.performCollapseAnimation();

      this.isExpanded = false;
      this.updateUI();

      // コールバック実行
      if (this.options.onCollapse) {
        await this.options.onCollapse(this);
      }

    } catch (error) {
      console.error('❌ Collapse failed:', error);
      this.isExpanded = true;
    } finally {
      this.animationInProgress = false;
    }
  }

  async performExpandAnimation() {
    return new Promise((resolve) => {
      // 高さを測定
      this.contentElement.style.maxHeight = 'none';
      this.contentElement.style.height = 'auto';
      const targetHeight = this.contentElement.scrollHeight;
      
      // アニメーション開始状態にリセット
      this.contentElement.style.maxHeight = '0';
      this.contentElement.style.height = '0';
      
      // フォーストリップ
      this.contentElement.offsetHeight;

      // アニメーション実行
      this.contentElement.style.transition = `all ${this.options.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      this.contentElement.style.maxHeight = `${targetHeight}px`;
      this.contentElement.style.height = `${targetHeight}px`;

      setTimeout(() => {
        this.contentElement.style.maxHeight = 'none';
        this.contentElement.style.height = 'auto';
        this.contentElement.style.transition = '';
        resolve();
      }, this.options.animationDuration);
    });
  }

  async performCollapseAnimation() {
    return new Promise((resolve) => {
      const currentHeight = this.contentElement.scrollHeight;
      
      // 現在の高さを明示的に設定
      this.contentElement.style.height = `${currentHeight}px`;
      this.contentElement.style.maxHeight = `${currentHeight}px`;
      
      // フォーストリップ
      this.contentElement.offsetHeight;

      // アニメーション実行
      this.contentElement.style.transition = `all ${this.options.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      this.contentElement.style.maxHeight = '0';
      this.contentElement.style.height = '0';

      setTimeout(() => {
        this.contentElement.style.transition = '';
        resolve();
      }, this.options.animationDuration);
    });
  }

  updateUI() {
    // ヘッダーの状態更新
    this.headerElement.classList.toggle('expanded', this.isExpanded);
    this.headerElement.classList.toggle('collapsed', !this.isExpanded);
    this.headerElement.setAttribute('aria-expanded', this.isExpanded);

    // コンテンツの状態更新
    this.contentElement.classList.toggle('expanded', this.isExpanded);
    this.contentElement.classList.toggle('collapsed', !this.isExpanded);
    this.contentElement.setAttribute('aria-hidden', !this.isExpanded);

    // アイコンの更新
    this.iconElement.textContent = this.isExpanded ? this.options.expandedIcon : this.options.icon;

    // ARIAラベルの更新
    this.updateAriaLabels();
  }

  async loadContent() {
    if (this.options.cacheContent && this.contentCache.has('content')) {
      this.contentWrapper.innerHTML = this.contentCache.get('content');
      return;
    }

    try {
      // プレースホルダー表示
      this.contentWrapper.innerHTML = `
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <span class="loading-text">コンテンツを読み込み中...</span>
        </div>
      `;

      // 実際のコンテンツ読み込み（カスタムローダー実行）
      let content = '<div class="default-content">コンテンツが設定されていません</div>';
      
      if (this.options.contentLoader) {
        content = await this.options.contentLoader(this.options.level);
      }

      this.contentWrapper.innerHTML = content;

      // キャッシュに保存
      if (this.options.cacheContent) {
        this.contentCache.set('content', content);
      }

    } catch (error) {
      console.error('❌ Content loading failed:', error);
      this.contentWrapper.innerHTML = `
        <div class="error-state">
          <span class="error-icon">⚠️</span>
          <span class="error-text">コンテンツの読み込みに失敗しました</span>
          <button class="retry-button" onclick="this.parentElement.parentElement.parentElement.parentElement.__expandableSection.loadContent()">
            再試行
          </button>
        </div>
      `;
    }
  }

  setContent(content) {
    this.contentWrapper.innerHTML = content;
    
    if (this.options.cacheContent) {
      this.contentCache.set('content', content);
    }

    // 高さの再計算
    if (this.isExpanded) {
      this.contentElement.style.height = 'auto';
      this.contentElement.style.maxHeight = 'none';
    }
  }

  updateTitle(newTitle) {
    this.options.title = newTitle;
    this.container.querySelector('.section-title').textContent = newTitle;
    this.updateAriaLabels();
  }

  // LayeredResultsView統合制約チェック
  async checkLayeredViewConstraints() {
    if (!this.layeredViewRef || !this.options.integrateWithLayeredView) {
      return true;
    }

    // 最大同時展開数チェック
    if (this.options.maxConcurrentExpansions) {
      const currentExpanded = this.layeredViewRef.getExpandedSectionsCount?.();
      if (currentExpanded >= this.options.maxConcurrentExpansions) {
        // 最古のセクションを折りたたみ
        if (this.options.autoCollapseInactive) {
          await this.layeredViewRef.collapseOldestSection?.();
          return true;
        } else {
          // 展開をブロック
          return false;
        }
      }
    }

    return true;
  }

  // LayeredResultsViewとの統合設定
  integrateWithLayeredView(layeredViewRef, bunenjinContext = null) {
    this.layeredViewRef = layeredViewRef;
    this.bunenjinContext = bunenjinContext;
    this.options.integrateWithLayeredView = true;
    
    console.log(`🔗 ExpandableSection integrated with LayeredResultsView (Level ${this.options.level})`);
  }

  // bunenjin文脈の設定
  setBunenjinContext(context) {
    this.bunenjinContext = context;
    if (context) {
      this.options.bunenjinMode = true;
      this.options.bunenjinType = context.type || null;
      this.options.emphasizeBalance = context.emphasizeBalance || false;
      
      // 文脈に基づいてタイトルを更新
      if (context.title) {
        this.updateTitle(context.title);
      }
    }
  }

  // ユーザーエンゲージメント計算
  calculateUserEngagement() {
    const now = Date.now();
    let engagement = 0;

    // 展開回数による評価
    engagement += Math.min(this.analyticsData.expansions * 10, 50);

    // 展開時間による評価
    if (this.isExpanded && this.expansionTimestamp) {
      const currentSessionTime = now - this.expansionTimestamp;
      engagement += Math.min(currentSessionTime / 1000, 30); // 最大30秒分
    }

    // 総展開時間による評価
    engagement += Math.min(this.analyticsData.totalTimeExpanded / 1000 / 10, 20); // 最大20点

    this.analyticsData.userEngagement = Math.round(engagement);
    return this.analyticsData.userEngagement;
  }

  // 展開時間の更新
  updateExpandedTime() {
    if (this.isExpanded && this.expansionTimestamp) {
      const sessionTime = Date.now() - this.expansionTimestamp;
      this.analyticsData.totalTimeExpanded += sessionTime;
      this.expansionTimestamp = Date.now(); // リセット
    }
  }

  // 分析トラッキング（拡張版）
  trackEvent(action, data = {}) {
    if (typeof window !== 'undefined' && window.AnalyticsTracker) {
      const enhancedData = {
        action,
        level: this.options.level,
        title: this.options.title,
        bunenjinMode: this.options.bunenjinMode,
        bunenjinType: this.options.bunenjinType,
        userEngagement: this.calculateUserEngagement(),
        sessionId: this.getSessionId(),
        ...data
      };

      window.AnalyticsTracker.track('expandable_section', enhancedData);

      // bunenjin特化トラッキング
      if (this.options.bunenjinMode) {
        window.AnalyticsTracker.track('bunenjin_section', enhancedData);
      }
    }
  }

  // セッションID生成
  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return this.sessionId;
  }

  // アナリティクス初期化
  initAnalytics() {
    this.trackEvent('initialize', {
      initiallyExpanded: this.options.initiallyExpanded
    });
  }

  // 破棄処理
  destroy() {
    // 展開時間の最終更新
    this.updateExpandedTime();

    // アナリティクス最終レポート
    if (this.options.trackAnalytics) {
      this.trackEvent('destroy', {
        finalEngagement: this.calculateUserEngagement(),
        totalExpansions: this.analyticsData.expansions,
        totalTimeExpanded: this.analyticsData.totalTimeExpanded
      });
    }

    // LayeredResultsView統合の解除
    if (this.layeredViewRef && this.options.integrateWithLayeredView) {
      this.layeredViewRef.onSectionDestroyed?.(this);
      this.layeredViewRef = null;
    }

    // DOM要素とキャッシュのクリア
    if (this.container) {
      this.container.innerHTML = '';
      this.container.__expandableSection = null;
    }
    
    this.contentCache.clear();
    this.bunenjinContext = null;
    
    console.log(`🗑️ ExpandableSection destroyed (Level ${this.options.level})`);
  }

  // 静的ファクトリーメソッド
  static create(containerId, options = {}) {
    const instance = new ExpandableSection(containerId, options);
    
    // コンテナ要素に参照を保存（再試行ボタン用）
    if (instance.container) {
      instance.container.__expandableSection = instance;
    }
    
    return instance;
  }

  // Cipherメモリレイヤー対応
  getMemoryState() {
    return {
      isExpanded: this.isExpanded,
      level: this.options.level,
      title: this.options.title,
      timestamp: Date.now()
    };
  }

  restoreMemoryState(state) {
    if (state.isExpanded !== this.isExpanded) {
      this.toggle();
    }
  }
}

// Global registration
if (typeof window !== 'undefined') {
  window.ExpandableSection = ExpandableSection;
}