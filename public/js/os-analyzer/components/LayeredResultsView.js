// HaQei Analyzer - Layered Results View Component
// Phase 5.2: UX/情報アーキテクチャ再設計版
// bunenjin哲学に基づく4階層情報構造実装

class LayeredResultsView extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.analysisResult = null;
    this.insights = null;
    
    // 4階層状態管理
    this.layerStates = {
      level1: { isExpanded: true, loaded: false },   // 基本結果（常時表示）
      level2: { isExpanded: false, loaded: false },  // 詳細分析
      level3: { isExpanded: false, loaded: false },  // 批判的視点
      level4: { isExpanded: false, loaded: false }   // 実践ガイド
    };
    
    // パフォーマンス最適化
    this.renderCache = new Map();
    this.contentCache = new Map();
    this.layerComponents = new Map();
    
    // bunenjin哲学フレームワーク
    this.bunenjinFramework = {
      engineOS: null,
      interfaceOS: null,
      safeModeOS: null,
      interactionPatterns: null
    };
    
    // 科学的フォーマッター
    this.formatter = window.ScientificFormatter ? new window.ScientificFormatter() : null;
    this.statisticalEngine = window.StatisticalEngine ? new window.StatisticalEngine() : null;
    
    console.log("🏗️ LayeredResultsView initialized with 4-layer architecture");
  }

  get defaultOptions() {
    return {
      ...super.defaultOptions,
      enableProgressiveDisclosure: true,  // 段階的開示の有効化
      trackLayerAnalytics: true,          // 階層別アナリティクス
      mobileOptimized: true,              // モバイル最適化
      animationDuration: 300,             // アニメーション時間
      maxConcurrentLayers: 2,             // 同時展開可能階層数
      autoCollapseInactive: true,         // 非アクティブ階層の自動折りたたみ
      onLayerExpand: null,
      onLayerCollapse: null,
      onInsightGenerate: null
    };
  }

  // データ設定と初期化
  async setData(analysisResult, insights) {
    this.analysisResult = analysisResult;
    this.insights = insights;
    
    // bunenjin分析データの構造化
    this.structureBunenjinData();
    
    // 4階層レンダリング開始
    await this.renderLayeredStructure();
  }

  // bunenjin分析データの構造化
  structureBunenjinData() {
    if (!this.analysisResult) return;

    // Triple OS Architecture データの抽出
    this.bunenjinFramework = {
      engineOS: this.analysisResult.engineOS || this.analysisResult.primaryOS,
      interfaceOS: this.analysisResult.interfaceOS,
      safeModeOS: this.analysisResult.safeModeOS,
      interactionPatterns: this.analysisResult.interactionPatterns || this.generateInteractionPatterns()
    };

    console.log("🎭 Bunenjin framework structured:", this.bunenjinFramework);
  }

  // 相互作用パターンの生成
  generateInteractionPatterns() {
    const { engineOS, interfaceOS, safeModeOS } = this.bunenjinFramework;
    
    if (!engineOS || !interfaceOS || !safeModeOS) return null;

    return {
      engineInterface: this.analyzeOSInteraction(engineOS, interfaceOS, 'engine-interface'),
      engineSafe: this.analyzeOSInteraction(engineOS, safeModeOS, 'engine-safe'),
      interfaceSafe: this.analyzeOSInteraction(interfaceOS, safeModeOS, 'interface-safe'),
      tripleHarmony: this.analyzeTripleHarmony(engineOS, interfaceOS, safeModeOS)
    };
  }

  // OS間相互作用の分析
  analyzeOSInteraction(os1, os2, type) {
    const strength1 = os1.strength || os1.matchPercentage || 0;
    const strength2 = os2.strength || os2.matchPercentage || 0;
    
    const synergy = this.calculateSynergy(os1, os2);
    const tension = this.calculateTension(os1, os2);
    
    return {
      type,
      synergy: synergy,
      tension: tension,
      balance: (synergy - tension + 1) / 2, // 0-1に正規化
      description: this.generateInteractionDescription(os1, os2, synergy, tension)
    };
  }

  // 3つのOSのハーモニー分析
  analyzeTripleHarmony(engineOS, interfaceOS, safeModeOS) {
    const avgStrength = (
      (engineOS.strength || 0) + 
      (interfaceOS.strength || 0) + 
      (safeModeOS.strength || 0)
    ) / 3;

    const variance = this.calculateOSVariance(engineOS, interfaceOS, safeModeOS);
    const harmony = Math.max(0, 1 - variance); // 低分散 = 高ハーモニー

    return {
      level: harmony,
      balance: avgStrength,
      dominantOS: this.findDominantOS(engineOS, interfaceOS, safeModeOS),
      recommendation: this.generateHarmonyRecommendation(harmony, variance)
    };
  }

  // 4階層構造のレンダリング
  async renderLayeredStructure() {
    if (!this.analysisResult) {
      this.renderError("分析結果が見つかりません");
      return;
    }

    // メインコンテナの構築
    this.container.innerHTML = `
      <div class="layered-results-container" data-mobile-optimized="${this.options.mobileOptimized}">
        <!-- Level 1: 基本結果（分人の認識） -->
        <div class="result-layer" data-level="1" data-state="expanded">
          <div class="layer-content" id="layer-1-content">
            ${await this.renderLevel1Content()}
          </div>
        </div>

        <!-- Level 2: 詳細分析（分人の理解） -->
        <div class="result-layer" data-level="2" data-state="collapsed">
          <div class="layer-header" data-level="2">
            <button class="layer-toggle" aria-expanded="false" aria-controls="layer-2-content">
              <span class="toggle-icon">▼</span>
              <span class="layer-title">もっと詳しく：あなたの分人たちの特性</span>
              <span class="layer-badge">Level 2</span>
            </button>
          </div>
          <div class="layer-content" id="layer-2-content" aria-hidden="true">
            <div class="content-placeholder">
              <div class="loading-indicator">詳細分析を準備中...</div>
            </div>
          </div>
        </div>

        <!-- Level 3: 批判的視点（分人の影） -->
        <div class="result-layer" data-level="3" data-state="collapsed">
          <div class="layer-header" data-level="3">
            <button class="layer-toggle" aria-expanded="false" aria-controls="layer-3-content">
              <span class="toggle-icon">▼</span>
              <span class="layer-title">注意深く見る：限界と注意点</span>
              <span class="layer-badge">Level 3</span>
            </button>
          </div>
          <div class="layer-content" id="layer-3-content" aria-hidden="true">
            <div class="content-placeholder">
              <div class="loading-indicator">批判的視点を準備中...</div>
            </div>
          </div>
        </div>

        <!-- Level 4: 実践ガイド（分人の活用） -->
        <div class="result-layer" data-level="4" data-state="collapsed">
          <div class="layer-header" data-level="4">
            <button class="layer-toggle" aria-expanded="false" aria-controls="layer-4-content">
              <span class="toggle-icon">▼</span>
              <span class="layer-title">実践する：分人を活かす戦略</span>
              <span class="layer-badge">Level 4</span>
            </button>
          </div>
          <div class="layer-content" id="layer-4-content" aria-hidden="true">
            <div class="content-placeholder">
              <div class="loading-indicator">実践ガイドを準備中...</div>
            </div>
          </div>
        </div>

        <!-- アクションボタン -->
        <div class="layer-actions">
          <button id="expand-all-btn" class="btn btn-secondary">
            すべて展開
          </button>
          <button id="collapse-all-btn" class="btn btn-outline">
            すべて折りたたみ
          </button>
          <button id="export-insights-btn" class="btn btn-primary">
            洞察をエクスポート
          </button>
        </div>

        <!-- プレミアム誘導（Level 5 相当） -->
        <div class="premium-transition">
          ${this.renderPremiumTransition()}
        </div>
      </div>
    `;

    // イベントリスナーの設定
    this.bindLayerEvents();
    
    // Level 1の初期状態設定
    this.layerStates.level1.loaded = true;
    
    console.log("🏗️ 4-layer structure rendered successfully");
  }

  // Level 1: 基本結果（分人の認識）
  async renderLevel1Content() {
    const cacheKey = 'level1_bunenjin_recognition';
    
    if (this.contentCache.has(cacheKey)) {
      return this.contentCache.get(cacheKey);
    }

    const { engineOS, interfaceOS, safeModeOS } = this.bunenjinFramework;
    
    const content = `
      <div class="bunenjin-introduction">
        <div class="intro-header">
          <h2 class="results-title">🎭 あなたの3つの分人</h2>
          <div class="intro-subtitle">
            私たちには複数の「顔」があります。それぞれの分人を理解することで、より豊かな人生が見えてきます。
          </div>
        </div>

        <div class="bunenjin-overview">
          <div class="bunenjin-grid">
            <!-- Engine OS: 本質的な分人 -->
            <div class="bunenjin-card engine-bunenjin" data-os-type="engine">
              <div class="bunenjin-icon">🔥</div>
              <div class="bunenjin-info">
                <h3 class="bunenjin-title">本質的な自分</h3>
                <div class="bunenjin-name">${engineOS?.osName || engineOS?.hexagramInfo?.name || '分析中'}</div>
                <div class="bunenjin-essence">${this.getBunenjinEssence(engineOS, 'engine')}</div>
                <div class="bunenjin-strength">${this.formatScientificPercentage(engineOS?.strength || engineOS?.matchPercentage || 0)}</div>
              </div>
            </div>

            <!-- Interface OS: 社会的な分人 -->
            <div class="bunenjin-card interface-bunenjin" data-os-type="interface">
              <div class="bunenjin-icon">🎭</div>
              <div class="bunenjin-info">
                <h3 class="bunenjin-title">社会的な自分</h3>
                <div class="bunenjin-name">${interfaceOS?.osName || interfaceOS?.hexagramInfo?.name || '分析中'}</div>
                <div class="bunenjin-essence">${this.getBunenjinEssence(interfaceOS, 'interface')}</div>
                <div class="bunenjin-strength">${this.formatScientificPercentage(interfaceOS?.strength || interfaceOS?.matchPercentage || 0)}</div>
              </div>
            </div>

            <!-- Safe Mode OS: 守る分人 -->
            <div class="bunenjin-card safe-bunenjin" data-os-type="safe">
              <div class="bunenjin-icon">🛡️</div>
              <div class="bunenjin-info">
                <h3 class="bunenjin-title">守る自分</h3>
                <div class="bunenjin-name">${safeModeOS?.osName || safeModeOS?.hexagramInfo?.name || '分析中'}</div>
                <div class="bunenjin-essence">${this.getBunenjinEssence(safeModeOS, 'safe')}</div>
                <div class="bunenjin-strength">${this.formatScientificPercentage(safeModeOS?.strength || safeModeOS?.matchPercentage || 0)}</div>
              </div>
            </div>
          </div>

          <!-- バランス表示 -->
          <div class="bunenjin-balance">
            <h4>3つの分人のバランス</h4>
            <div class="balance-visualization">
              ${this.renderBunenjinBalance()}
            </div>
            <div class="balance-insight">
              ${this.generateBalanceInsight()}
            </div>
          </div>
        </div>

        <!-- 次のレベルへの誘導 -->
        <div class="level-transition">
          <div class="transition-message">
            これは表面的な姿です。さらに深く理解したい場合は、下の「もっと詳しく」をクリックしてください。
          </div>
          <button class="transition-btn" data-target-level="2">
            <span class="btn-icon">🔍</span>
            <span class="btn-text">もっと詳しく見てみる</span>
          </button>
        </div>
      </div>
    `;

    this.contentCache.set(cacheKey, content);
    return content;
  }

  // 分人のエッセンス生成
  getBunenjinEssence(osData, type) {
    if (!osData) return '準備中...';

    const essenceMap = {
      engine: osData.hexagramInfo?.catchphrase || osData.description || '内なる動機を司る分人',
      interface: osData.hexagramInfo?.catchphrase || osData.description || '他者との関わりを司る分人',
      safe: osData.hexagramInfo?.catchphrase || osData.description || '安全と安定を司る分人'
    };

    return essenceMap[type] || osData.hexagramInfo?.catchphrase || '特別な役割を持つ分人';
  }

  // 分人バランスの可視化
  renderBunenjinBalance() {
    const { engineOS, interfaceOS, safeModeOS } = this.bunenjinFramework;
    
    const engineStrength = engineOS?.strength || engineOS?.matchPercentage || 0;
    const interfaceStrength = interfaceOS?.strength || interfaceOS?.matchPercentage || 0;
    const safeStrength = safeModeOS?.strength || safeModeOS?.matchPercentage || 0;

    return `
      <div class="balance-bars">
        <div class="balance-item">
          <div class="balance-label">本質的</div>
          <div class="balance-bar">
            <div class="balance-fill engine-fill" style="width: ${(engineStrength * 100)}%"></div>
          </div>
          <div class="balance-value">${this.formatScientificPercentage(engineStrength)}</div>
        </div>
        <div class="balance-item">
          <div class="balance-label">社会的</div>
          <div class="balance-bar">
            <div class="balance-fill interface-fill" style="width: ${(interfaceStrength * 100)}%"></div>
          </div>
          <div class="balance-value">${this.formatScientificPercentage(interfaceStrength)}</div>
        </div>
        <div class="balance-item">
          <div class="balance-label">守備的</div>
          <div class="balance-bar">
            <div class="balance-fill safe-fill" style="width: ${(safeStrength * 100)}%"></div>
          </div>
          <div class="balance-value">${this.formatScientificPercentage(safeStrength)}</div>
        </div>
      </div>
    `;
  }

  // バランス洞察の生成
  generateBalanceInsight() {
    const { engineOS, interfaceOS, safeModeOS, interactionPatterns } = this.bunenjinFramework;
    
    if (!interactionPatterns) {
      return "分人間の相互作用を分析中...";
    }

    const harmony = interactionPatterns.tripleHarmony;
    let insight = "";

    if (harmony.level > 0.7) {
      insight = `あなたの3つの分人は調和が取れています（調和度: ${this.formatScientificPercentage(harmony.level)}）。`;
    } else if (harmony.level > 0.4) {
      insight = `分人間でいくつかの調整が必要かもしれません（調和度: ${this.formatScientificPercentage(harmony.level)}）。`;
    } else {
      insight = `分人間の緊張が見られます（調和度: ${this.formatScientificPercentage(harmony.level)}）。これは成長の機会でもあります。`;
    }

    if (harmony.dominantOS) {
      insight += ` 現在は「${harmony.dominantOS.type}」の分人が主導的です。`;
    }

    return insight;
  }

  // プレミアム移行セクション
  renderPremiumTransition() {
    return `
      <div class="premium-transition-card">
        <div class="premium-header">
          <h3>🌟 より深い洞察をお求めですか？</h3>
          <div class="premium-subtitle">
            プロフェッショナル戦略レポートで、あなたの分人たちを活かす具体的な戦略を手に入れましょう
          </div>
        </div>
        
        <div class="premium-benefits">
          <div class="benefit-item">
            <span class="benefit-icon">🎯</span>
            <span class="benefit-text">3つの分人を活かす実践的な行動計画</span>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">⚖️</span>
            <span class="benefit-text">分人間のバランス調整方法</span>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">🚀</span>
            <span class="benefit-text">3ヶ月実行ロードマップ</span>
          </div>
        </div>
        
        <div class="premium-action">
          <button id="upgrade-premium-btn" class="btn btn-premium">
            プロフェッショナルレポートを取得（¥2,980）
          </button>
        </div>
      </div>
    `;
  }

  // 階層別イベントリスナーの設定
  bindLayerEvents() {
    // 階層展開・折りたたみ
    this.container.addEventListener('click', async (e) => {
      const toggleBtn = e.target.closest('.layer-toggle');
      const transitionBtn = e.target.closest('.transition-btn');
      
      if (toggleBtn) {
        const level = parseInt(toggleBtn.closest('[data-level]').dataset.level);
        await this.toggleLayer(level);
      }
      
      if (transitionBtn) {
        const targetLevel = parseInt(transitionBtn.dataset.targetLevel);
        await this.expandLayer(targetLevel);
      }
    });

    // 全体制御ボタン
    const expandAllBtn = this.container.querySelector('#expand-all-btn');
    const collapseAllBtn = this.container.querySelector('#collapse-all-btn');
    const exportBtn = this.container.querySelector('#export-insights-btn');
    const premiumBtn = this.container.querySelector('#upgrade-premium-btn');

    if (expandAllBtn) {
      expandAllBtn.addEventListener('click', () => this.expandAllLayers());
    }
    
    if (collapseAllBtn) {
      collapseAllBtn.addEventListener('click', () => this.collapseAllLayers());
    }
    
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportInsights());
    }
    
    if (premiumBtn) {
      premiumBtn.addEventListener('click', () => this.handlePremiumUpgrade());
    }
  }

  // 階層の展開・折りたたみ
  async toggleLayer(level) {
    const currentState = this.layerStates[`level${level}`];
    
    if (currentState.isExpanded) {
      await this.collapseLayer(level);
    } else {
      await this.expandLayer(level);
    }
  }

  // 階層の展開
  async expandLayer(level) {
    const layerKey = `level${level}`;
    const layerState = this.layerStates[layerKey];
    
    if (layerState.isExpanded) return;

    // 同時展開制限の確認
    if (this.options.maxConcurrentLayers) {
      const expandedCount = Object.values(this.layerStates)
        .filter(state => state.isExpanded).length;
        
      if (expandedCount >= this.options.maxConcurrentLayers) {
        await this.collapseOldestLayer();
      }
    }

    // コンテンツの読み込み
    if (!layerState.loaded) {
      await this.loadLayerContent(level);
    }

    // UI更新
    await this.updateLayerUI(level, true);
    
    // 状態更新
    layerState.isExpanded = true;
    
    // アナリティクス
    if (this.options.trackLayerAnalytics) {
      this.trackLayerEvent('expand', level);
    }

    // コールバック
    if (this.options.onLayerExpand) {
      this.options.onLayerExpand(level, layerState);
    }

    console.log(`🔍 Layer ${level} expanded`);
  }

  // 階層の折りたたみ
  async collapseLayer(level) {
    const layerKey = `level${level}`;
    const layerState = this.layerStates[layerKey];
    
    if (!layerState.isExpanded || level === 1) return; // Level 1は常時表示

    // UI更新
    await this.updateLayerUI(level, false);
    
    // 状態更新
    layerState.isExpanded = false;
    
    // アナリティクス
    if (this.options.trackLayerAnalytics) {
      this.trackLayerEvent('collapse', level);
    }

    // コールバック
    if (this.options.onLayerCollapse) {
      this.options.onLayerCollapse(level, layerState);
    }

    console.log(`📁 Layer ${level} collapsed`);
  }

  // 階層コンテンツの読み込み
  async loadLayerContent(level) {
    const contentElement = this.container.querySelector(`#layer-${level}-content`);
    if (!contentElement) return;

    try {
      let content = '';
      
      switch (level) {
        case 2:
          content = await this.renderLevel2Content();
          break;
        case 3:
          content = await this.renderLevel3Content();
          break;
        case 4:
          content = await this.renderLevel4Content();
          break;
        default:
          content = '<div class="error">不明な階層です</div>';
      }

      contentElement.innerHTML = content;
      this.layerStates[`level${level}`].loaded = true;
      
      console.log(`📦 Layer ${level} content loaded`);
      
    } catch (error) {
      console.error(`❌ Failed to load layer ${level} content:`, error);
      contentElement.innerHTML = `
        <div class="content-error">
          <span class="error-icon">⚠️</span>
          <span class="error-message">コンテンツの読み込みに失敗しました</span>
          <button class="retry-btn" onclick="this.closest('.layered-results-container').__layeredView.loadLayerContent(${level})">
            再試行
          </button>
        </div>
      `;
    }
  }

  // 階層UIの更新
  async updateLayerUI(level, isExpanded) {
    const layerElement = this.container.querySelector(`[data-level="${level}"]`);
    const toggleButton = layerElement?.querySelector('.layer-toggle');
    const contentElement = layerElement?.querySelector('.layer-content');
    const toggleIcon = toggleButton?.querySelector('.toggle-icon');

    if (!layerElement || !toggleButton || !contentElement) return;

    // 状態属性の更新
    layerElement.dataset.state = isExpanded ? 'expanded' : 'collapsed';
    toggleButton.setAttribute('aria-expanded', isExpanded);
    contentElement.setAttribute('aria-hidden', !isExpanded);

    // アイコンの更新
    if (toggleIcon) {
      toggleIcon.textContent = isExpanded ? '▲' : '▼';
    }

    // アニメーション
    if (this.options.enableProgressiveDisclosure) {
      await this.animateLayerTransition(contentElement, isExpanded);
    } else {
      contentElement.style.display = isExpanded ? 'block' : 'none';
    }
  }

  // 階層遷移アニメーション
  async animateLayerTransition(element, expanding) {
    return new Promise(resolve => {
      if (expanding) {
        element.style.display = 'block';
        element.style.maxHeight = '0';
        element.style.opacity = '0';
        element.style.overflow = 'hidden';
        
        // フォーストリップ
        element.offsetHeight;
        
        element.style.transition = `all ${this.options.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        element.style.maxHeight = element.scrollHeight + 'px';
        element.style.opacity = '1';
        
        setTimeout(() => {
          element.style.maxHeight = 'none';
          element.style.overflow = 'visible';
          element.style.transition = '';
          resolve();
        }, this.options.animationDuration);
        
      } else {
        element.style.maxHeight = element.scrollHeight + 'px';
        element.style.overflow = 'hidden';
        
        // フォーストリップ
        element.offsetHeight;
        
        element.style.transition = `all ${this.options.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        element.style.maxHeight = '0';
        element.style.opacity = '0';
        
        setTimeout(() => {
          element.style.display = 'none';
          element.style.transition = '';
          resolve();
        }, this.options.animationDuration);
      }
    });
  }

  // 科学的パーセンテージフォーマット（互換性維持）
  formatScientificPercentage(value, options = {}) {
    if (isNaN(value) || value === null || value === undefined) {
      return "0.0%";
    }

    if (this.formatter) {
      return this.formatter.formatPercentage(value, options);
    }

    const clampedValue = Math.max(0, Math.min(1, value));
    const percentage = (clampedValue * 100).toFixed(1);
    return `${percentage}%`;
  }

  // エラー表示
  renderError(message) {
    this.container.innerHTML = `
      <div class="layered-error">
        <div class="error-icon">⚠️</div>
        <div class="error-message">${message}</div>
        <button class="error-retry" onclick="window.location.reload()">
          再読み込み
        </button>
      </div>
    `;
  }

  // ヘルパーメソッド: シナジー計算
  calculateSynergy(os1, os2) {
    // 簡易的なシナジー計算（実際にはより複雑なロジックが必要）
    const strength1 = os1.strength || os1.matchPercentage || 0;
    const strength2 = os2.strength || os2.matchPercentage || 0;
    return Math.min(strength1, strength2) * 0.8 + Math.abs(strength1 - strength2) * 0.2;
  }

  // ヘルパーメソッド: テンション計算
  calculateTension(os1, os2) {
    const strength1 = os1.strength || os1.matchPercentage || 0;
    const strength2 = os2.strength || os2.matchPercentage || 0;
    return Math.abs(strength1 - strength2) * 0.6;
  }

  // ヘルパーメソッド: OS分散計算
  calculateOSVariance(engineOS, interfaceOS, safeModeOS) {
    const strengths = [
      engineOS.strength || engineOS.matchPercentage || 0,
      interfaceOS.strength || interfaceOS.matchPercentage || 0,
      safeModeOS.strength || safeModeOS.matchPercentage || 0
    ];
    
    const mean = strengths.reduce((a, b) => a + b, 0) / strengths.length;
    const variance = strengths.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / strengths.length;
    
    return Math.sqrt(variance);
  }

  // ヘルパーメソッド: 支配的OS特定
  findDominantOS(engineOS, interfaceOS, safeModeOS) {
    const systems = [
      { os: engineOS, type: 'engine', name: '本質的な自分' },
      { os: interfaceOS, type: 'interface', name: '社会的な自分' },
      { os: safeModeOS, type: 'safe', name: '守る自分' }
    ];

    return systems.reduce((dominant, current) => {
      const currentStrength = current.os.strength || current.os.matchPercentage || 0;
      const dominantStrength = dominant.os.strength || dominant.os.matchPercentage || 0;
      
      return currentStrength > dominantStrength ? current : dominant;
    });
  }

  // 相互作用説明の生成
  generateInteractionDescription(os1, os2, synergy, tension) {
    if (synergy > 0.7 && tension < 0.3) {
      return "これらの分人は相互に強化し合う関係にあります";
    } else if (tension > 0.7) {
      return "これらの分人間には緊張関係が見られます";
    } else {
      return "これらの分人は適度なバランスを保っています";
    }
  }

  // ハーモニー推奨事項の生成
  generateHarmonyRecommendation(harmony, variance) {
    if (harmony > 0.8) {
      return "現在の分人バランスは良好です。この調和を維持してください。";
    } else if (variance > 0.3) {
      return "分人間の差が大きいようです。最も弱い分人を意識的に発達させることを検討してください。";
    } else {
      return "分人間の調整に取り組むことで、より統合された自己理解が得られるでしょう。";
    }
  }

  // Level 2: 詳細分析（分人の理解）
  async renderLevel2Content() {
    const cacheKey = 'level2_bunenjin_understanding';
    
    if (this.contentCache.has(cacheKey)) {
      return this.contentCache.get(cacheKey);
    }

    const { engineOS, interfaceOS, safeModeOS, interactionPatterns } = this.bunenjinFramework;
    
    const content = `
      <div class="level2-detailed-analysis">
        <div class="analysis-intro">
          <h3>🔍 分人たちの詳細な特性</h3>
          <p>あなたの3つの分人をより深く理解してみましょう。それぞれの動機、行動パターン、そして相互作用を探ります。</p>
        </div>

        <!-- 各分人の詳細分析 -->
        <div class="bunenjin-detailed-grid">
          <!-- Engine OS詳細 -->
          <div class="bunenjin-detailed-card engine-detailed">
            <div class="detailed-header">
              <div class="bunenjin-icon-large">🔥</div>
              <div class="bunenjin-title-group">
                <h4>本質的な自分</h4>
                <div class="bunenjin-name">${engineOS?.osName || engineOS?.hexagramInfo?.name || '分析中'}</div>
              </div>
            </div>
            
            <div class="detailed-content">
              <div class="characteristic-section">
                <h5>コアの動機</h5>
                <p>${this.generateCoreMotivation(engineOS, 'engine')}</p>
              </div>
              
              <div class="characteristic-section">
                <h5>行動パターン</h5>
                <ul class="pattern-list">
                  ${this.generateBehaviorPatterns(engineOS, 'engine').map(pattern => `<li>${pattern}</li>`).join('')}
                </ul>
              </div>
              
              <div class="characteristic-section">
                <h5>強みと課題</h5>
                <div class="strengths-challenges-grid">
                  <div class="strengths">
                    <h6>強み</h6>
                    <ul>
                      ${this.generateStrengths(engineOS, 'engine').map(strength => `<li>${strength}</li>`).join('')}
                    </ul>
                  </div>
                  <div class="challenges">
                    <h6>課題</h6>
                    <ul>
                      ${this.generateChallenges(engineOS, 'engine').map(challenge => `<li>${challenge}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Interface OS詳細 -->
          <div class="bunenjin-detailed-card interface-detailed">
            <div class="detailed-header">
              <div class="bunenjin-icon-large">🎭</div>
              <div class="bunenjin-title-group">
                <h4>社会的な自分</h4>
                <div class="bunenjin-name">${interfaceOS?.osName || interfaceOS?.hexagramInfo?.name || '分析中'}</div>
              </div>
            </div>
            
            <div class="detailed-content">
              <div class="characteristic-section">
                <h5>コアの動機</h5>
                <p>${this.generateCoreMotivation(interfaceOS, 'interface')}</p>
              </div>
              
              <div class="characteristic-section">
                <h5>行動パターン</h5>
                <ul class="pattern-list">
                  ${this.generateBehaviorPatterns(interfaceOS, 'interface').map(pattern => `<li>${pattern}</li>`).join('')}
                </ul>
              </div>
              
              <div class="characteristic-section">
                <h5>強みと課題</h5>
                <div class="strengths-challenges-grid">
                  <div class="strengths">
                    <h6>強み</h6>
                    <ul>
                      ${this.generateStrengths(interfaceOS, 'interface').map(strength => `<li>${strength}</li>`).join('')}
                    </ul>
                  </div>
                  <div class="challenges">
                    <h6>課題</h6>
                    <ul>
                      ${this.generateChallenges(interfaceOS, 'interface').map(challenge => `<li>${challenge}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Safe Mode OS詳細 -->
          <div class="bunenjin-detailed-card safe-detailed">
            <div class="detailed-header">
              <div class="bunenjin-icon-large">🛡️</div>
              <div class="bunenjin-title-group">
                <h4>守る自分</h4>
                <div class="bunenjin-name">${safeModeOS?.osName || safeModeOS?.hexagramInfo?.name || '分析中'}</div>
              </div>
            </div>
            
            <div class="detailed-content">
              <div class="characteristic-section">
                <h5>コアの動機</h5>
                <p>${this.generateCoreMotivation(safeModeOS, 'safe')}</p>
              </div>
              
              <div class="characteristic-section">
                <h5>行動パターン</h5>
                <ul class="pattern-list">
                  ${this.generateBehaviorPatterns(safeModeOS, 'safe').map(pattern => `<li>${pattern}</li>`).join('')}
                </ul>
              </div>
              
              <div class="characteristic-section">
                <h5>強みと課題</h5>
                <div class="strengths-challenges-grid">
                  <div class="strengths">
                    <h6>強み</h6>
                    <ul>
                      ${this.generateStrengths(safeModeOS, 'safe').map(strength => `<li>${strength}</li>`).join('')}
                    </ul>
                  </div>
                  <div class="challenges">
                    <h6>課題</h6>
                    <ul>
                      ${this.generateChallenges(safeModeOS, 'safe').map(challenge => `<li>${challenge}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分人間の相互作用分析 -->
        <div class="interaction-analysis">
          <h4>🔄 分人間の相互作用</h4>
          <div class="interactions-grid">
            ${interactionPatterns ? this.renderInteractionPatterns(interactionPatterns) : '<p>相互作用データを準備中...</p>'}
          </div>
        </div>

        <!-- 統計的信頼度の表示 -->
        <div class="statistical-confidence">
          <h4>📊 分析の信頼度</h4>
          <div class="confidence-metrics">
            ${this.renderConfidenceMetrics()}
          </div>
          <div class="methodology-note">
            <p><strong>分析方法：</strong>易経の64卦理論と現代心理学を統合した独自アルゴリズムを使用</p>
            <p><strong>データ品質：</strong>${this.calculateOverallConfidence()}</p>
          </div>
        </div>
      </div>
    `;

    this.contentCache.set(cacheKey, content);
    return content;
  }

  // Level 3: 批判的視点（分人の影）
  async renderLevel3Content() {
    const cacheKey = 'level3_critical_perspective';
    
    if (this.contentCache.has(cacheKey)) {
      return this.contentCache.get(cacheKey);
    }

    const content = `
      <div class="level3-critical-analysis">
        <div class="critical-intro">
          <h3>⚠️ 注意深く見る：限界と注意点</h3>
          <p>どんな分析にも限界があります。あなたの分人理解をより正確にするために、以下の点に注意してください。</p>
        </div>

        <!-- 各分人の影の側面 -->
        <div class="shadow-analysis">
          <h4>🌑 分人たちの影の側面</h4>
          <div class="shadow-grid">
            <div class="shadow-card engine-shadow">
              <h5>本質的な自分の影</h5>
              <div class="shadow-content">
                ${this.generateShadowAnalysis('engine')}
              </div>
            </div>
            
            <div class="shadow-card interface-shadow">
              <h5>社会的な自分の影</h5>
              <div class="shadow-content">
                ${this.generateShadowAnalysis('interface')}
              </div>
            </div>
            
            <div class="shadow-card safe-shadow">
              <h5>守る自分の影</h5>
              <div class="shadow-content">
                ${this.generateShadowAnalysis('safe')}
              </div>
            </div>
          </div>
        </div>

        <!-- 認知バイアスへの注意 -->
        <div class="bias-warnings">
          <h4>🧠 認知バイアスに注意</h4>
          <div class="bias-list">
            <div class="bias-item">
              <h5>確証バイアス</h5>
              <p>自分に都合の良い結果だけを信じてしまう傾向があります。批判的な視点も大切にしてください。</p>
            </div>
            <div class="bias-item">
              <h5>バーナム効果</h5>
              <p>曖昧で一般的な記述を自分に特有だと感じてしまうことがあります。具体性を重視してください。</p>
            </div>
            <div class="bias-item">
              <h5>自己奉仕バイアス</h5>
              <p>成功は自分のおかげ、失敗は外的要因のせいにしがちです。バランスの取れた自己理解を心がけてください。</p>
            </div>
          </div>
        </div>

        <!-- ツールの限界 -->
        <div class="tool-limitations">
          <h4>🔧 このツールの限界</h4>
          <div class="limitations-content">
            <div class="limitation-section">
              <h5>分析の限界</h5>
              <ul>
                <li>回答時の心理状態や環境による影響を受ける可能性があります</li>
                <li>文化的背景や個人的経験の違いが十分反映されない場合があります</li>
                <li>時間の経過とともに人格は変化するため、定期的な再評価が必要です</li>
                <li>複雑な人間性のすべてを数値化することはできません</li>
              </ul>
            </div>
            
            <div class="limitation-section">
              <h5>解釈の注意点</h5>
              <ul>
                <li>結果は自己理解の一つの視点に過ぎません</li>
                <li>職業選択や人生の重要な決定の唯一の根拠にすべきではありません</li>
                <li>他者との関係性の複雑さを完全に予測することはできません</li>
                <li>心理的な問題がある場合は専門家に相談してください</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 健全な活用方法 -->
        <div class="healthy-usage">
          <h4>✅ 健全な活用方法</h4>
          <div class="usage-guidelines">
            <div class="guideline-item">
              <h5>参考程度に留める</h5>
              <p>結果は自己理解のきっかけとして活用し、絶対的な真実として捉えないでください。</p>
            </div>
            <div class="guideline-item">
              <h5>多角的な視点を持つ</h5>
              <p>他者からのフィードバックや異なる分析ツールと組み合わせて理解を深めてください。</p>
            </div>
            <div class="guideline-item">
              <h5>成長の機会として活用</h5>
              <p>現在の状態を固定的に捉えず、発達や変化の可能性を信じてください。</p>
            </div>
          </div>
        </div>

        <!-- データプライバシー -->
        <div class="privacy-note">
          <h4>🔒 プライバシーについて</h4>
          <p>あなたの回答データはローカルストレージに保存され、外部に送信されることはありません。データの管理はあなた自身が行えます。</p>
        </div>
      </div>
    `;

    this.contentCache.set(cacheKey, content);
    return content;
  }

  // Level 4: 実践ガイド（分人の活用）
  async renderLevel4Content() {
    const cacheKey = 'level4_practical_guide';
    
    if (this.contentCache.has(cacheKey)) {
      return this.contentCache.get(cacheKey);
    }

    const { engineOS, interfaceOS, safeModeOS } = this.bunenjinFramework;

    const content = `
      <div class="level4-practical-guide">
        <div class="guide-intro">
          <h3>🚀 実践する：分人を活かす戦略</h3>
          <p>理解から行動へ。あなたの3つの分人を日常生活で活かすための具体的な方法をご紹介します。</p>
        </div>

        <!-- 実践戦略 -->
        <div class="practical-strategies">
          <h4>📋 今すぐ始められる実践戦略</h4>
          
          <div class="strategy-sections">
            <!-- Engine OS活用戦略 -->
            <div class="strategy-section engine-strategy">
              <h5>🔥 本質的な自分を活かす戦略</h5>
              <div class="strategy-content">
                <div class="daily-practices">
                  <h6>日常の実践</h6>
                  <ul>
                    ${this.generateDailyPractices(engineOS, 'engine').map(practice => `<li>${practice}</li>`).join('')}
                  </ul>
                </div>
                <div class="micro-experiments">
                  <h6>小さな実験</h6>
                  <ul>
                    ${this.generateMicroExperiments(engineOS, 'engine').map(experiment => `<li>${experiment}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>

            <!-- Interface OS活用戦略 -->
            <div class="strategy-section interface-strategy">
              <h5>🎭 社会的な自分を活かす戦略</h5>
              <div class="strategy-content">
                <div class="daily-practices">
                  <h6>日常の実践</h6>
                  <ul>
                    ${this.generateDailyPractices(interfaceOS, 'interface').map(practice => `<li>${practice}</li>`).join('')}
                  </ul>
                </div>
                <div class="micro-experiments">
                  <h6>小さな実験</h6>
                  <ul>
                    ${this.generateMicroExperiments(interfaceOS, 'interface').map(experiment => `<li>${experiment}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>

            <!-- Safe Mode OS活用戦略 -->
            <div class="strategy-section safe-strategy">
              <h5>🛡️ 守る自分を活かす戦略</h5>
              <div class="strategy-content">
                <div class="daily-practices">
                  <h6>日常の実践</h6>
                  <ul>
                    ${this.generateDailyPractices(safeModeOS, 'safe').map(practice => `<li>${practice}</li>`).join('')}
                  </ul>
                </div>
                <div class="micro-experiments">
                  <h6>小さな実験</h6>
                  <ul>
                    ${this.generateMicroExperiments(safeModeOS, 'safe').map(experiment => `<li>${experiment}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分人調和の実践 -->
        <div class="harmony-practices">
          <h4>⚖️ 分人間の調和を育む方法</h4>
          <div class="harmony-techniques">
            <div class="technique-item">
              <h5>分人対話法</h5>
              <p>重要な決断の前に、3つの分人それぞれの「声」を聞いてみましょう。</p>
              <div class="technique-steps">
                <ol>
                  <li>静かな場所で、本質的な自分は何を求めているかを考える</li>
                  <li>社会的な自分はどう行動したいかを考える</li>
                  <li>守る自分は何を心配しているかを考える</li>
                  <li>3つの声のバランスを取った答えを見つける</li>
                </ol>
              </div>
            </div>

            <div class="technique-item">
              <h5>日記による分人観察</h5>
              <p>日々の行動や感情を分人の視点から振り返ってみましょう。</p>
              <div class="technique-steps">
                <ol>
                  <li>今日の出来事で、どの分人が主導したかを記録</li>
                  <li>各分人がどのように感じたかを想像して書く</li>
                  <li>分人間の対立や協力があったかを振り返る</li>
                  <li>明日はどの分人をもっと活かしたいかを考える</li>
                </ol>
              </div>
            </div>

            <div class="technique-item">
              <h5>状況別分人切り替え</h5>
              <p>場面に応じて適切な分人を前面に出す練習をしましょう。</p>
              <div class="technique-examples">
                <ul>
                  <li><strong>創作活動：</strong>本質的な自分を前面に</li>
                  <li><strong>会議や交渉：</strong>社会的な自分を活用</li>
                  <li><strong>リスク判断：</strong>守る自分の声を重視</li>
                  <li><strong>プライベート：</strong>3つのバランスを大切に</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 継続的改善システム -->
        <div class="continuous-improvement">
          <h4>📈 継続的な自己理解の深化</h4>
          
          <div class="improvement-framework">
            <div class="framework-section">
              <h5>週次振り返り</h5>
              <div class="reflection-questions">
                <ul>
                  <li>今週、どの分人が最も活躍しましたか？</li>
                  <li>分人間で対立や緊張を感じた場面はありましたか？</li>
                  <li>新しく発見した分人の特性はありましたか？</li>
                  <li>来週、どの分人をもっと発達させたいですか？</li>
                </ul>
              </div>
            </div>

            <div class="framework-section">
              <h5>月次実験計画</h5>
              <div class="experiment-planning">
                <ol>
                  <li><strong>実験目標の設定：</strong>今月はどの分人を重点的に発達させるか</li>
                  <li><strong>具体的行動の計画：</strong>毎日できる小さな実践を決める</li>
                  <li><strong>進捗の記録：</strong>変化や気づきを日々記録する</li>
                  <li><strong>結果の評価：</strong>月末に実験の成果を振り返る</li>
                </ol>
              </div>
            </div>

            <div class="framework-section">
              <h5>長期的成長計画</h5>
              <div class="growth-areas">
                <div class="growth-item">
                  <h6>3ヶ月目標</h6>
                  <p>${this.generateShortTermGoal()}</p>
                </div>
                <div class="growth-item">
                  <h6>1年後のビジョン</h6>
                  <p>${this.generateLongTermVision()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 実践支援ツール -->
        <div class="practice-tools">
          <h4>🛠️ 実践を支援するツール</h4>
          <div class="tools-list">
            <div class="tool-item">
              <h5>分人バランス チェッカー</h5>
              <p>定期的に分人のバランスを確認し、調整が必要な領域を特定できます。</p>
              <button class="tool-button" onclick="alert('この機能は今後実装予定です')">
                チェックを開始
              </button>
            </div>
            
            <div class="tool-item">
              <h5>実践記録テンプレート</h5>
              <p>日々の分人観察と実践を記録するためのテンプレートをダウンロードできます。</p>
              <button class="tool-button" onclick="this.closest('.layered-results-container').__layeredView.downloadPracticeTemplate()">
                テンプレートダウンロード
              </button>
            </div>
            
            <div class="tool-item">
              <h5>分人対話ガイド</h5>
              <p>重要な決断時に3つの分人の声を聞くためのガイド質問集です。</p>
              <button class="tool-button" onclick="this.closest('.layered-results-container').__layeredView.showDialogueGuide()">
                ガイドを表示
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.contentCache.set(cacheKey, content);
    return content;
  }

  // コンテンツ生成ヘルパーメソッド群

  generateCoreMotivation(osData, type) {
    if (!osData) return "動機を分析中...";
    
    const motivationMap = {
      engine: `${osData.osName || 'この分人'}は、内なる価値観と信念に基づいて行動し、真の自己実現を求める動機を持っています。`,
      interface: `${osData.osName || 'この分人'}は、他者との調和的な関係を築き、社会の中で意味のある役割を果たそうとする動機を持っています。`,
      safe: `${osData.osName || 'この分人'}は、安全と安定を確保し、リスクから身を守りながら着実に歩みを進める動機を持っています。`
    };
    
    return motivationMap[type] || "独特な動機を持つ分人です。";
  }

  generateBehaviorPatterns(osData, type) {
    if (!osData) return ["行動パターンを分析中..."];
    
    const patternMap = {
      engine: [
        "直感的な判断を重視し、内なる声に従って行動する",
        "創造的な活動や自己表現に積極的に取り組む",
        "価値観に反することには強い抵抗を示す",
        "長期的な視点で物事を考える傾向がある"
      ],
      interface: [
        "他者との関係性を考慮して行動を決める",
        "協調性を重視し、対立を避けようとする",
        "社会的な期待に応えようと努力する",
        "コミュニケーションを通じて問題を解決する"
      ],
      safe: [
        "慎重に状況を分析してから行動に移る",
        "リスクを事前に評価し、対策を立てる",
        "既知の方法や確実な道を選ぶ傾向がある",
        "安定した環境を維持しようとする"
      ]
    };
    
    return patternMap[type] || ["特徴的な行動パターンを持っています"];
  }

  generateStrengths(osData, type) {
    const strengthMap = {
      engine: [
        "独創性と創造力",
        "強い価値観と信念",
        "真の自己への忠実さ",
        "長期的なビジョン"
      ],
      interface: [
        "優れたコミュニケーション能力",
        "他者への共感と理解",
        "協調性とチームワーク",
        "社会適応力"
      ],
      safe: [
        "リスク管理能力",
        "慎重な判断力",
        "安定性の維持",
        "継続的な努力"
      ]
    };
    
    return strengthMap[type] || ["独特な強みを持っています"];
  }

  generateChallenges(osData, type) {
    const challengeMap = {
      engine: [
        "現実的な制約を軽視しがち",
        "他者の意見を受け入れにくい",
        "短期的な成果に焦りを感じる",
        "完璧主義による停滞"
      ],
      interface: [
        "自分の意見を抑えすぎる",
        "他者に依存しやすい",
        "批判や対立を恐れる",
        "表面的な関係に留まりがち"
      ],
      safe: [
        "新しい挑戦を避けがち",
        "変化への適応が困難",
        "機会を逃すことがある",
        "過度な心配や不安"
      ]
    };
    
    return challengeMap[type] || ["成長のための課題があります"];
  }

  generateShadowAnalysis(type) {
    const shadowMap = {
      engine: `
        <p><strong>過度の自己中心性：</strong>内なる声ばかりを重視し、他者の視点を軽視する危険性</p>
        <p><strong>現実逃避の傾向：</strong>理想と現実のギャップに直面した時の逃避行動</p>
        <p><strong>燃え尽き症候群：</strong>情熱だけに頼った行動による疲弊</p>
      `,
      interface: `
        <p><strong>偽りの自己：</strong>他者に合わせすぎて本来の自分を見失う危険性</p>
        <p><strong>承認依存：</strong>他者の評価に過度に依存する傾向</p>
        <p><strong>境界線の曖昧さ：</strong>自分と他者の責任の区別が不明確になること</p>
      `,
      safe: `
        <p><strong>過度の保守性：</strong>リスクを避けすぎて成長機会を逃す傾向</p>
        <p><strong>不安の増大：</strong>心配事が現実以上に大きく感じられること</p>
        <p><strong>停滞への誘惑：</strong>安全な現状に留まり続けたい欲求</p>
      `
    };
    
    return shadowMap[type] || '<p>影の側面を分析中...</p>';
  }

  generateDailyPractices(osData, type) {
    const practiceMap = {
      engine: [
        "朝の10分間、本当にやりたいことを静かに考える時間を持つ",
        "直感に従って小さな決断を下してみる（服装、食事など）",
        "創造的な活動に毎日5分以上取り組む",
        "価値観に関する質問を自分に投げかける"
      ],
      interface: [
        "毎日誰かに感謝の気持ちを伝える",
        "相手の立場で物事を考える練習をする",
        "積極的に雑談や軽い会話を楽しむ",
        "チームや家族の役に立つ小さな行動をする"
      ],
      safe: [
        "毎日のルーティンを大切にし、安定したリズムを保つ",
        "明日の計画を前日に立てる習慣を作る",
        "小さなリスクでも事前に対策を考える",
        "健康管理や財務管理など基盤を整える"
      ]
    };
    
    return practiceMap[type] || ["この分人を活かす実践を考えてみましょう"];
  }

  generateMicroExperiments(osData, type) {
    const experimentMap = {
      engine: [
        "今週、普段選ばない創造的な活動に1時間挑戦する",
        "「もし制約がなかったら？」という質問で決断してみる",
        "直感で書店や図書館で本を選んで読んでみる",
        "SNSで自分の価値観に関する投稿をしてみる"
      ],
      interface: [
        "新しい人と会話する機会を週に1回作る",
        "普段は言わない感謝や褒め言葉を意識的に伝える",
        "グループ活動やコミュニティイベントに参加する",
        "誰かの相談に親身になって答える"
      ],
      safe: [
        "小さな新しい習慣を1つ始めて1週間続ける",
        "日用品の在庫チェックと補充システムを作る",
        "緊急時の連絡先リストを更新する",
        "家計簿や健康記録を1週間つけてみる"
      ]
    };
    
    return experimentMap[type] || ["この分人を発達させる実験を考えてみましょう"];
  }

  generateShortTermGoal() {
    const goals = [
      "3つの分人のバランスを意識した意思決定ができるようになる",
      "各分人の強みを日常生活で活かせるようになる",
      "分人間の対立を建設的に解決できるようになる",
      "状況に応じて適切な分人を前面に出せるようになる"
    ];
    
    return goals[Math.floor(Math.random() * goals.length)];
  }

  generateLongTermVision() {
    const visions = [
      "3つの分人が調和し、統合された豊かな人格を育む",
      "分人の多様性を活かして、より創造的で充実した人生を送る",
      "他者との関係においても分人理解を活かし、深いつながりを築く",
      "人生の様々な場面で適切な分人を活用し、より効果的に目標を達成する"
    ];
    
    return visions[Math.floor(Math.random() * visions.length)];
  }

  // 相互作用パターンの表示
  renderInteractionPatterns(patterns) {
    if (!patterns) return '<p>相互作用データを準備中...</p>';
    
    return `
      <div class="interaction-item">
        <h5>本質×社会</h5>
        <div class="interaction-metrics">
          <span class="synergy">協調: ${this.formatScientificPercentage(patterns.engineInterface.synergy)}</span>
          <span class="tension">緊張: ${this.formatScientificPercentage(patterns.engineInterface.tension)}</span>
        </div>
        <p>${patterns.engineInterface.description}</p>
      </div>
      
      <div class="interaction-item">
        <h5>本質×守備</h5>
        <div class="interaction-metrics">
          <span class="synergy">協調: ${this.formatScientificPercentage(patterns.engineSafe.synergy)}</span>
          <span class="tension">緊張: ${this.formatScientificPercentage(patterns.engineSafe.tension)}</span>
        </div>
        <p>${patterns.engineSafe.description}</p>
      </div>
      
      <div class="interaction-item">
        <h5>社会×守備</h5>
        <div class="interaction-metrics">
          <span class="synergy">協調: ${this.formatScientificPercentage(patterns.interfaceSafe.synergy)}</span>
          <span class="tension">緊張: ${this.formatScientificPercentage(patterns.interfaceSafe.tension)}</span>
        </div>
        <p>${patterns.interfaceSafe.description}</p>
      </div>
      
      <div class="harmony-summary">
        <h5>全体的な調和</h5>
        <div class="harmony-level">調和度: ${this.formatScientificPercentage(patterns.tripleHarmony.level)}</div>
        <p>${patterns.tripleHarmony.recommendation}</p>
      </div>
    `;
  }

  // 信頼度メトリクスの表示
  renderConfidenceMetrics() {
    const { engineOS, interfaceOS, safeModeOS } = this.bunenjinFramework;
    
    const avgConfidence = [
      engineOS?.strength || engineOS?.matchPercentage || 0,
      interfaceOS?.strength || interfaceOS?.matchPercentage || 0,
      safeModeOS?.strength || safeModeOS?.matchPercentage || 0
    ].reduce((a, b) => a + b, 0) / 3;

    return `
      <div class="confidence-grid">
        <div class="confidence-item">
          <div class="confidence-label">本質的な自分</div>
          <div class="confidence-bar">
            <div class="confidence-fill" style="width: ${(engineOS?.strength || engineOS?.matchPercentage || 0) * 100}%"></div>
          </div>
          <div class="confidence-value">${this.formatScientificPercentage(engineOS?.strength || engineOS?.matchPercentage || 0)}</div>
        </div>
        
        <div class="confidence-item">
          <div class="confidence-label">社会的な自分</div>
          <div class="confidence-bar">
            <div class="confidence-fill" style="width: ${(interfaceOS?.strength || interfaceOS?.matchPercentage || 0) * 100}%"></div>
          </div>
          <div class="confidence-value">${this.formatScientificPercentage(interfaceOS?.strength || interfaceOS?.matchPercentage || 0)}</div>
        </div>
        
        <div class="confidence-item">
          <div class="confidence-label">守る自分</div>
          <div class="confidence-bar">
            <div class="confidence-fill" style="width: ${(safeModeOS?.strength || safeModeOS?.matchPercentage || 0) * 100}%"></div>
          </div>
          <div class="confidence-value">${this.formatScientificPercentage(safeModeOS?.strength || safeModeOS?.matchPercentage || 0)}</div>
        </div>
        
        <div class="overall-confidence">
          <strong>全体信頼度: ${this.formatScientificPercentage(avgConfidence)}</strong>
        </div>
      </div>
    `;
  }

  calculateOverallConfidence() {
    const { engineOS, interfaceOS, safeModeOS } = this.bunenjinFramework;
    
    const confidenceScore = [
      engineOS?.strength || engineOS?.matchPercentage || 0,
      interfaceOS?.strength || interfaceOS?.matchPercentage || 0,
      safeModeOS?.strength || safeModeOS?.matchPercentage || 0
    ].reduce((a, b) => a + b, 0) / 3;

    if (confidenceScore > 0.8) return "高品質（信頼性が高い結果です）";
    if (confidenceScore > 0.6) return "良好（概ね信頼できる結果です）";
    if (confidenceScore > 0.4) return "標準的（参考程度にご活用ください）";
    return "限定的（より多くのデータが必要です）";
  }

  // 全階層展開
  async expandAllLayers() {
    for (let level = 2; level <= 4; level++) {
      await this.expandLayer(level);
      // 少し間隔を空けてスムーズな展開を実現
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // 全階層折りたたみ
  async collapseAllLayers() {
    for (let level = 4; level >= 2; level--) {
      await this.collapseLayer(level);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // 最古の階層を折りたたみ
  async collapseOldestLayer() {
    // 実装予定：展開時刻を記録して最古のものを特定
    // 今回は単純にレベル2から順番に確認
    for (let level = 2; level <= 4; level++) {
      if (this.layerStates[`level${level}`].isExpanded) {
        await this.collapseLayer(level);
        break;
      }
    }
  }

  // 洞察エクスポート
  async exportInsights() {
    try {
      const insights = this.generateComprehensiveInsights();
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `bunenjin_insights_${timestamp}.txt`;
      
      this.downloadFile(insights, filename, 'text');
      
      this.showNotification('洞察をエクスポートしました', 'success');
      
    } catch (error) {
      console.error('❌ Export failed:', error);
      this.showNotification('エクスポートに失敗しました', 'error');
    }
  }

  // 包括的洞察の生成
  generateComprehensiveInsights() {
    const { engineOS, interfaceOS, safeModeOS } = this.bunenjinFramework;
    
    let insights = '=== あなたの分人分析 包括レポート ===\n';
    insights += `生成日時: ${new Date().toLocaleString('ja-JP')}\n\n`;
    
    insights += '【3つの分人の概要】\n';
    insights += `本質的な自分: ${engineOS?.osName || '分析中'} (${this.formatScientificPercentage(engineOS?.strength || 0)})\n`;
    insights += `社会的な自分: ${interfaceOS?.osName || '分析中'} (${this.formatScientificPercentage(interfaceOS?.strength || 0)})\n`;
    insights += `守る自分: ${safeModeOS?.osName || '分析中'} (${this.formatScientificPercentage(safeModeOS?.strength || 0)})\n\n`;
    
    insights += '【実践のポイント】\n';
    insights += '1. 日々の意思決定で3つの分人の声を聞く\n';
    insights += '2. 状況に応じて適切な分人を前面に出す\n';
    insights += '3. 分人間のバランスを意識する\n';
    insights += '4. 定期的に分人の成長を振り返る\n\n';
    
    insights += '【注意点】\n';
    insights += '- この分析は自己理解の一つの視点です\n';
    insights += '- 結果を絶対視せず、参考程度に活用してください\n';
    insights += '- 継続的な自己観察と成長を心がけてください\n\n';
    
    insights += '=== レポート終了 ===\n';
    insights += 'Generated by HaQei Bunenjin Analyzer\n';
    
    return insights;
  }

  // 実践テンプレートのダウンロード
  downloadPracticeTemplate() {
    const template = `
# 分人実践記録テンプレート

## 日付: ___________

### 今日の分人バランス
- 本質的な自分の活躍度: □□□□□ (5段階)
- 社会的な自分の活躍度: □□□□□ (5段階)  
- 守る自分の活躍度: □□□□□ (5段階)

### 今日の出来事と分人の反応
**出来事:** 
**本質的な自分の反応:**
**社会的な自分の反応:**
**守る自分の反応:**

### 分人間の対話
**対立や緊張があった場面:**
**どのように調和を図ったか:**

### 明日への活かし方
**明日重点的に活かしたい分人:**
**具体的な実践予定:**

### 気づきとメモ
    `;
    
    const timestamp = new Date().toISOString().slice(0, 10);
    this.downloadFile(template, `bunenjin_practice_template_${timestamp}.txt`, 'text');
    
    this.showNotification('実践記録テンプレートをダウンロードしました', 'success');
  }

  // 分人対話ガイドの表示
  showDialogueGuide() {
    const modal = document.createElement('div');
    modal.className = 'dialogue-guide-modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="this.parentElement.remove()">
        <div class="modal-content" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3>🗣️ 分人対話ガイド</h3>
            <button class="modal-close" onclick="this.closest('.dialogue-guide-modal').remove()">×</button>
          </div>
          <div class="modal-body">
            <h4>重要な決断をする前に、3つの分人の声を聞いてみましょう</h4>
            
            <div class="dialogue-section">
              <h5>🔥 本質的な自分への質問</h5>
              <ul>
                <li>この選択は自分の価値観に合っているか？</li>
                <li>本当にやりたいことは何か？</li>
                <li>長期的に見て後悔しない選択は？</li>
                <li>直感的に感じることは？</li>
              </ul>
            </div>
            
            <div class="dialogue-section">
              <h5>🎭 社会的な自分への質問</h5>
              <ul>
                <li>この選択は他者にどのような影響を与えるか？</li>
                <li>周りの人はどう思うだろうか？</li>
                <li>協力や調和を保てる方法は？</li>
                <li>社会的な責任を果たせているか？</li>
              </ul>
            </div>
            
            <div class="dialogue-section">
              <h5>🛡️ 守る自分への質問</h5>
              <ul>
                <li>この選択にはどのようなリスクがあるか？</li>
                <li>安全で確実な方法は？</li>
                <li>失敗した時の対策は？</li>
                <li>現在の安定を脅かさないか？</li>
              </ul>
            </div>
            
            <div class="integration-section">
              <h5>⚖️ 統合の質問</h5>
              <ul>
                <li>3つの声のバランスを取るとどうなるか？</li>
                <li>どの分人の声を最も重視すべきか？</li>
                <li>全ての分人が納得できる選択はあるか？</li>
              </ul>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" onclick="this.closest('.dialogue-guide-modal').remove()">
              閉じる
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  // プレミアムアップグレード処理
  async handlePremiumUpgrade() {
    // 既存のResultsViewのメソッドを再利用
    try {
      console.log('🚀 Initiating premium upgrade from LayeredResultsView...');

      if (typeof window !== 'undefined' && window.CrossPlatformBridge) {
        const bridge = new window.CrossPlatformBridge();
        
        const rawAnswers = this.getRawAnswers();
        const completionResult = await bridge.completeDiagnosis(
          this.analysisResult, 
          rawAnswers,
          { source: 'layered_results_premium_upgrade' }
        );

        if (completionResult.success) {
          const professionalData = bridge.prepareProfessionalReportData();
          
          if (professionalData.success) {
            window.location.href = 'professional_report.html';
          } else {
            throw new Error('プロフェッショナルレポートデータの準備に失敗しました');
          }
        } else {
          throw new Error('診断データの準備に失敗しました');
        }
      } else {
        console.warn('⚠️ CrossPlatformBridge not available, using fallback');
        window.location.href = 'professional_report.html';
      }

    } catch (error) {
      console.error('❌ Premium upgrade failed:', error);
      this.showNotification('プレミアム版へのアップグレードに失敗しました。もう一度お試しください。', 'error');
    }
  }

  // ファイルダウンロードヘルパー
  downloadFile(data, filename, format) {
    try {
      const mimeTypes = {
        json: 'application/json',
        text: 'text/plain',
        csv: 'text/csv'
      };

      const blob = new Blob([data], { type: mimeTypes[format] || 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('❌ File download failed:', error);
      this.showNotification('ファイルのダウンロードに失敗しました', 'error');
    }
  }

  // 回答データ取得（互換性維持）
  getRawAnswers() {
    try {
      if (typeof window !== 'undefined' && window.StorageManager) {
        const storage = new window.StorageManager();
        return storage.getAnswers() || [];
      }
      return [];
    } catch (error) {
      console.warn('⚠️ Failed to get raw answers:', error);
      return [];
    }
  }

  // 通知表示（互換性維持）
  showNotification(message, type = 'info') {
    try {
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);

    } catch (error) {
      console.error('❌ Failed to show notification:', error);
    }
  }

  // アナリティクストラッキング
  trackLayerEvent(action, level, additionalData = {}) {
    if (typeof window !== 'undefined' && window.AnalyticsTracker) {
      window.AnalyticsTracker.track('layered_results', {
        action,
        level,
        timestamp: Date.now(),
        ...additionalData
      });
    }
  }

  // コンポーネントの破棄
  destroy() {
    // キャッシュのクリア
    this.renderCache.clear();
    this.contentCache.clear();
    this.layerComponents.clear();
    
    // 参照の削除
    if (this.container) {
      this.container.innerHTML = '';
      this.container.__layeredView = null;
    }
    
    console.log("🗑️ LayeredResultsView destroyed");
  }
}

// グローバル登録
if (typeof window !== 'undefined') {
  window.LayeredResultsView = LayeredResultsView;
}