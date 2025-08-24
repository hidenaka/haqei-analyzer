/**
 * I Ching Metaphor Display System
 * 易経メタファー表示システム - ビジュアル化とユーザーインタラクション
 */

class IChingMetaphorDisplay {
  constructor(container) {
    this.container = container;
    this.currentDisplay = null;
    this.animationQueue = [];
    this.isAnimating = false;
    
    console.log('🎨 I Ching Metaphor Display initialized');
  }

  /**
   * 初期化
   */
  async init() {
    try {
      this.setupContainer();
      this.initializeStyles();
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize I Ching Display:', error);
      return false;
    }
  }

  /**
   * コンテナセットアップ
   */
  setupContainer() {
    if (!this.container) {
      throw new Error('Container not provided');
    }

    this.container.innerHTML = '';
    this.container.className = 'iching-metaphor-display';
    
    // メインセクション作成
    this.container.innerHTML = `
      <div class="metaphor-header">
        <div class="hexagram-display">
          <div class="hexagram-visual"></div>
          <div class="hexagram-info">
            <h3 class="hexagram-name"></h3>
            <p class="hexagram-description"></p>
          </div>
        </div>
      </div>
      
      <div class="situation-analysis">
        <div class="current-situation">
          <h4>現在の状況</h4>
          <div class="situation-content"></div>
        </div>
        
        <div class="theme-selection">
          <h4>テーマの選択</h4>
          <div class="theme-options">
            <button class="theme-option" data-choice="follow">
              <div class="theme-icon">🌊</div>
              <div class="theme-label">従う</div>
              <div class="theme-description">現在のテーマに沿って進む</div>
            </button>
            <button class="theme-option" data-choice="change">
              <div class="theme-icon">🔄</div>
              <div class="theme-label">変える</div>
              <div class="theme-description">テーマを変えて新しい道へ</div>
            </button>
            <button class="theme-option" data-choice="create">
              <div class="theme-icon">✨</div>
              <div class="theme-label">創る</div>
              <div class="theme-description">全く新しいテーマを創造</div>
            </button>
          </div>
        </div>
      </div>
      
      <div class="transformation-display" style="display: none;">
        <div class="transformation-visual">
          <div class="from-state">
            <div class="yao-visual old"></div>
            <div class="state-label">現在</div>
          </div>
          <div class="transformation-arrow">
            <div class="arrow-visual"></div>
            <div class="transformation-type"></div>
          </div>
          <div class="to-state">
            <div class="yao-visual new"></div>
            <div class="state-label">変化後</div>
          </div>
        </div>
        <div class="transformation-metaphor"></div>
      </div>
      
      <!-- シナリオ表示セクションはユーザーのリクエストにより削除 -->
      
      <div class="loading-indicator" style="display: none;">
        <div class="iching-spinner"></div>
        <p>易経の知恵を読み取っています...</p>
      </div>
    `;
  }

  /**
   * スタイル初期化
   */
  initializeStyles() {
    if (document.getElementById('iching-metaphor-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'iching-metaphor-styles';
    styles.textContent = `
      .iching-metaphor-display {
        font-family: 'Inter', 'Noto Sans JP', sans-serif;
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .metaphor-header {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        border: 2px solid rgba(99, 102, 241, 0.3);
        border-radius: 1rem;
        padding: 2rem;
        margin-bottom: 2rem;
        color: #ffffff;
      }

      .hexagram-display {
        display: flex;
        align-items: center;
        gap: 2rem;
      }

      .hexagram-visual {
        width: 120px;
        height: 120px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
        border: 2px solid #6366f1;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        position: relative;
        overflow: hidden;
      }

      .hexagram-visual::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: conic-gradient(from 0deg, transparent, rgba(99, 102, 241, 0.3), transparent);
        animation: rotate 8s linear infinite;
      }

      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .hexagram-info h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, #6366f1, #a855f7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .situation-analysis {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
      }

      .current-situation, .theme-selection {
        background: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 0.75rem;
        padding: 1.5rem;
        color: #ffffff;
      }

      .current-situation h4, .theme-selection h4 {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #e2e8f0;
      }

      .situation-content {
        background: rgba(99, 102, 241, 0.1);
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 0.5rem;
        padding: 1rem;
        color: #cbd5e1;
      }

      .theme-options {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .theme-option {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: rgba(51, 65, 85, 0.5);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 0.5rem;
        color: #ffffff;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: left;
      }

      .theme-option:hover {
        border-color: rgba(99, 102, 241, 0.5);
        background: rgba(99, 102, 241, 0.1);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
      }

      .theme-option.selected {
        border-color: #6366f1;
        background: rgba(99, 102, 241, 0.2);
        box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
      }

      .theme-icon {
        font-size: 1.5rem;
        width: 40px;
        text-align: center;
      }

      .theme-label {
        font-weight: 600;
        font-size: 1rem;
        min-width: 60px;
      }

      .theme-description {
        color: #94a3b8;
        font-size: 0.875rem;
        flex: 1;
      }

      .transformation-display {
        background: linear-gradient(135deg, #334155 0%, #475569 100%);
        border: 2px solid rgba(168, 85, 247, 0.3);
        border-radius: 1rem;
        padding: 2rem;
        margin-bottom: 2rem;
        color: #ffffff;
      }

      .transformation-visual {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 3rem;
        margin-bottom: 1.5rem;
      }

      .from-state, .to-state {
        text-align: center;
      }

      .yao-visual {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin: 0 auto 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
        color: #ffffff;
        position: relative;
        overflow: hidden;
      }

      .yao-visual.old {
        background: linear-gradient(135deg, #64748b, #475569);
        border: 2px solid #94a3b8;
      }

      .yao-visual.new {
        background: linear-gradient(135deg, #a855f7, #9333ea);
        border: 2px solid #c084fc;
        animation: glow 2s ease-in-out infinite alternate;
      }

      @keyframes glow {
        from { box-shadow: 0 0 20px rgba(168, 85, 247, 0.5); }
        to { box-shadow: 0 0 30px rgba(168, 85, 247, 0.8); }
      }

      .transformation-arrow {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }

      .arrow-visual {
        width: 60px;
        height: 60px;
        background: linear-gradient(45deg, #6366f1, #8b5cf6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: #ffffff;
        position: relative;
      }

      .arrow-visual::after {
        content: '→';
        animation: pulse 1.5s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }

      .transformation-type {
        font-size: 0.875rem;
        color: #c084fc;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .state-label {
        font-size: 0.875rem;
        color: #94a3b8;
        font-weight: 500;
      }

      .transformation-metaphor {
        background: rgba(168, 85, 247, 0.1);
        border: 1px solid rgba(168, 85, 247, 0.3);
        border-radius: 0.75rem;
        padding: 1.5rem;
        text-align: center;
      }

      .scenarios-display {
        color: #ffffff;
      }

      .scenarios-display h4 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: #e2e8f0;
        text-align: center;
      }

      .scenarios-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 1.5rem;
      }

      .scenario-card {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 0.75rem;
        padding: 1.5rem;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .scenario-card.optimistic {
        border-color: rgba(34, 197, 94, 0.4);
      }

      .scenario-card.realistic {
        border-color: rgba(99, 102, 241, 0.4);
      }

      .scenario-card.challenging {
        border-color: rgba(239, 68, 68, 0.4);
      }

      .scenario-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
      }

      .scenario-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      .scenario-icon {
        font-size: 1.5rem;
      }

      .scenario-title {
        font-weight: 600;
        font-size: 1.125rem;
      }

      .scenario-probability {
        margin-left: auto;
        background: rgba(99, 102, 241, 0.2);
        color: #c084fc;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .scenario-timeline {
        margin-bottom: 1rem;
      }

      .timeline-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        background: rgba(51, 65, 85, 0.3);
        border-radius: 0.5rem;
      }

      .timeline-timeframe {
        font-size: 0.75rem;
        color: #94a3b8;
        min-width: 80px;
      }

      .timeline-description {
        font-size: 0.875rem;
        color: #cbd5e1;
      }

      .loading-indicator {
        text-align: center;
        padding: 3rem;
        color: #ffffff;
      }

      .iching-spinner {
        width: 60px;
        height: 60px;
        border: 4px solid rgba(99, 102, 241, 0.2);
        border-top: 4px solid #6366f1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      @media (max-width: 768px) {
        .situation-analysis {
          grid-template-columns: 1fr;
        }
        
        .transformation-visual {
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .scenarios-container {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  /**
   * 状況分析結果の表示
   */
  displaySituationAnalysis(analysisResult) {
    console.log('🎨 [DEBUG] IChingMetaphorDisplay.displaySituationAnalysis called');
    console.log('🎨 [DEBUG] Analysis result received:', {
      hasHexagram: !!analysisResult?.hexagram,
      hasYao: !!analysisResult?.yao,
      hexagramName: analysisResult?.hexagram?.name,
      confidence: analysisResult?.confidence
    });

    this.currentDisplay = analysisResult;
    
    // ヘキサグラム表示
    this.updateHexagramDisplay(analysisResult.hexagram, analysisResult.yao);
    
    // 現在状況表示
    this.updateSituationDisplay(analysisResult.analysis);
    
    // テーマ選択のイベント設定
    this.setupThemeSelection();
    
    // アニメーション開始
    this.animateEntry();
  }

  /**
   * ヘキサグラム表示更新
   */
  updateHexagramDisplay(hexagram, yao) {
    console.log('🎨 [DEBUG] updateHexagramDisplay called with:', { 
      hexagramName: hexagram?.name, 
      yaoName: yao?.name,
      yaoPosition: yao?.position 
    });
    
    const hexagramVisual = this.container.querySelector('.hexagram-visual');
    const hexagramName = this.container.querySelector('.hexagram-name');
    const hexagramDescription = this.container.querySelector('.hexagram-description');
    
    // 安全な値の設定（undefinedを回避）
    const safehexagramName = hexagram?.name || '乾為天';
    const safeHexagramSymbol = hexagram?.symbol || '☰☰';
    const safeYaoName = yao?.name || '初';
    const safeYaoDescription = yao?.description || '物事の始まりの時';
    
    console.log('🎨 [DEBUG] Safe values:', {
      safehexagramName,
      safeHexagramSymbol,
      safeYaoName,
      safeYaoDescription
    });
    
    if (hexagramVisual) {
      hexagramVisual.textContent = safeHexagramSymbol;
    }
    
    if (hexagramName) {
      // "undefined文" エラーを回避するために安全な文字列結合
      hexagramName.textContent = `${safehexagramName} - ${safeYaoName}文`;
      console.log('🎨 [DEBUG] Hexagram name set to:', hexagramName.textContent);
    }
    
    if (hexagramDescription) {
      hexagramDescription.textContent = safeYaoDescription;
    }
  }

  /**
   * 状況表示更新
   */
  updateSituationDisplay(analysis) {
    const situationContent = this.container.querySelector('.situation-content');
    
    if (situationContent) {
      const metaphor = analysis.metaphor;
      const theme = analysis.currentTheme;
      
      situationContent.innerHTML = `
        <div class="metaphor-section">
          <h5 style="margin-bottom: 0.5rem; color: #c084fc;">現在のメタファー</h5>
          <p style="margin-bottom: 1rem;">${metaphor.situation || metaphor.primary}</p>
        </div>
        
        <div class="theme-section">
          <h5 style="margin-bottom: 0.5rem; color: #6366f1;">現在のテーマ</h5>
          <p style="margin-bottom: 0.5rem; font-weight: 600;">${theme.theme}</p>
          <p style="font-size: 0.875rem; color: #94a3b8;">${theme.description}</p>
        </div>
        
        <div class="keywords-section" style="margin-top: 1rem;">
          <h5 style="margin-bottom: 0.5rem; color: #22c55e;">キーワード</h5>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${analysis.keywords.slice(0, 5).map(kw => 
              `<span style="background: rgba(34, 197, 94, 0.2); color: #22c55e; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">${kw.word}</span>`
            ).join('')}
          </div>
        </div>
      `;
    }
  }

  /**
   * テーマ選択セットアップ
   */
  setupThemeSelection() {
    const themeOptions = this.container.querySelectorAll('.theme-option');
    
    console.log('🎯 [DEBUG] Setting up theme selection, found options:', themeOptions.length);
    
    themeOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        const choice = option.dataset.choice;
        
        // 選択状態の更新
        themeOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        // 選択のアニメーション
        this.animateThemeSelection(option, choice);
        
        // 変化シミュレーション実行
        setTimeout(() => {
          this.triggerTransformation(choice);
        }, 300);
      });
    });
  }

  /**
   * テーマ選択アニメーション
   */
  animateThemeSelection(element, choice) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
      element.style.transform = 'scale(1.02)';
      setTimeout(() => {
        element.style.transform = 'scale(1)';
      }, 150);
    }, 100);
  }

  /**
   * 変化トリガー
   */
  triggerTransformation(choice) {
    console.log('🔄 Triggering transformation for choice:', choice);
    
    // ローディング表示
    this.showLoading();
    
    // カスタムイベントを発火して変化をトリガー
    const event = new CustomEvent('ichingTransformation', {
      detail: { 
        currentSituation: this.currentDisplay, 
        choice: choice 
      }
    });
    
    this.container.dispatchEvent(event);
  }

  /**
   * 変化結果表示
   */
  displayTransformation(transformationResult) {
    console.log('🎨 Displaying transformation result:', transformationResult);
    
    this.hideLoading();
    
    // 変化表示セクションを表示
    const transformationDisplay = this.container.querySelector('.transformation-display');
    transformationDisplay.style.display = 'block';
    
    // 変化ビジュアル更新
    this.updateTransformationVisual(transformationResult);
    
    // 変化メタファー更新
    this.updateTransformationMetaphor(transformationResult);
    
    // シナリオ表示
    setTimeout(() => {
      this.displayScenarios(transformationResult.scenarios);
    }, 1000);
    
    // アニメーション開始
    this.animateTransformation();
  }

  /**
   * 変化ビジュアル更新
   */
  updateTransformationVisual(transformationResult) {
    const oldYaoVisual = this.container.querySelector('.yao-visual.old');
    const newYaoVisual = this.container.querySelector('.yao-visual.new');
    const transformationType = this.container.querySelector('.transformation-type');
    const arrowVisual = this.container.querySelector('.arrow-visual');
    
    if (oldYaoVisual) {
      oldYaoVisual.textContent = this.currentDisplay.yao.name;
    }
    
    if (newYaoVisual) {
      newYaoVisual.textContent = transformationResult.newSituation.yao.name;
    }
    
    if (transformationType) {
      transformationType.textContent = this.getTransformationTypeLabel(transformationResult.choice);
    }
    
    if (arrowVisual) {
      arrowVisual.innerHTML = `<span>${transformationResult.transformation.metaphor.symbol}</span>`;
    }
  }

  /**
   * 変化メタファー更新
   */
  updateTransformationMetaphor(transformationResult) {
    const metaphorContainer = this.container.querySelector('.transformation-metaphor');
    
    if (metaphorContainer) {
      const metaphor = transformationResult.transformation.metaphor;
      const comparison = transformationResult.comparison;
      
      metaphorContainer.innerHTML = `
        <h5 style="margin-bottom: 1rem; font-size: 1.125rem; color: #c084fc;">変化のメタファー</h5>
        <p style="margin-bottom: 1rem; font-size: 1rem; font-weight: 600; color: #ffffff;">
          ${metaphor.transformation}
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div style="text-align: center;">
            <div style="color: #22c55e; font-weight: 600;">改善度</div>
            <div style="font-size: 1.5rem; margin: 0.5rem 0;">
              ${comparison.improvement > 0 ? '+' : ''}${Math.round(comparison.improvement * 100)}%
            </div>
          </div>
          <div style="text-align: center;">
            <div style="color: #6366f1; font-weight: 600;">確信度</div>
            <div style="font-size: 1.5rem; margin: 0.5rem 0;">
              ${Math.round(transformationResult.transformation.confidence * 100)}%
            </div>
          </div>
        </div>
        <div style="margin-top: 1rem; padding: 1rem; background: rgba(30, 41, 59, 0.5); border-radius: 0.5rem;">
          <h6 style="color: #94a3b8; margin-bottom: 0.5rem;">主な変化</h6>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${comparison.changes.map(change => 
              `<li style="margin-bottom: 0.25rem; color: #cbd5e1;">• ${change}</li>`
            ).join('')}
          </ul>
        </div>
      `;
    }
  }

  /**
   * シナリオ表示
   */
  displayScenarios(scenarios) {
    // 8つのシナリオ表示を有効化（動的データ表示のため）
    if (!scenarios || scenarios.length === 0) {
      console.warn('⚠️ No scenarios data available for display');
      return;
    }
    
    const scenariosDisplay = this.container.querySelector('.scenarios-display');
    const scenariosContainer = this.container.querySelector('.scenarios-container');
    
    scenariosDisplay.style.display = 'block';
    
    if (scenariosContainer) {
      scenariosContainer.innerHTML = scenarios.map(scenario => this.createScenarioCard(scenario)).join('');
      
      // アニメーション
      const cards = scenariosContainer.querySelectorAll('.scenario-card');
      cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'all 0.5s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 200);
      });
    }
  }

  /**
   * シナリオカード作成
   */
  createScenarioCard(scenario) {
    return `
      <div class="scenario-card ${scenario.type}">
        <div class="scenario-header">
          <span class="scenario-icon">${scenario.icon}</span>
          <span class="scenario-title">${scenario.title}</span>
          <span class="scenario-probability">${Math.round(scenario.probability * 100)}%</span>
        </div>
        
        <div class="scenario-timeline">
          ${scenario.timeline.slice(0, 3).map(item => `
            <div class="timeline-item">
              <span class="timeline-timeframe">${item.timeframe}</span>
              <span class="timeline-description">${item.description}</span>
            </div>
          `).join('')}
        </div>
        
        ${scenario.outcomes ? `
          <div class="scenario-outcomes">
            <h6 style="color: #94a3b8; margin-bottom: 0.5rem; font-size: 0.875rem;">予想される結果</h6>
            ${scenario.outcomes.slice(0, 2).map(outcome => `
              <div style="margin-bottom: 0.5rem; font-size: 0.875rem; color: #cbd5e1;">
                • ${outcome.title}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * エントリアニメーション
   */
  animateEntry() {
    const elements = [
      this.container.querySelector('.metaphor-header'),
      this.container.querySelector('.current-situation'),
      this.container.querySelector('.theme-selection')
    ];
    
    elements.forEach((element, index) => {
      if (element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        setTimeout(() => {
          element.style.transition = 'all 0.6s ease';
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, index * 200);
      }
    });
  }

  /**
   * 変化アニメーション
   */
  animateTransformation() {
    const transformationDisplay = this.container.querySelector('.transformation-display');
    if (transformationDisplay) {
      transformationDisplay.style.opacity = '0';
      transformationDisplay.style.transform = 'scale(0.9)';
      setTimeout(() => {
        transformationDisplay.style.transition = 'all 0.8s ease';
        transformationDisplay.style.opacity = '1';
        transformationDisplay.style.transform = 'scale(1)';
      }, 100);
    }
  }

  /**
   * ローディング表示
   */
  showLoading() {
    const loadingIndicator = this.container.querySelector('.loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.style.display = 'block';
      loadingIndicator.style.opacity = '0';
      setTimeout(() => {
        loadingIndicator.style.transition = 'opacity 0.3s ease';
        loadingIndicator.style.opacity = '1';
      }, 50);
    }
  }

  /**
   * ローディング非表示
   */
  hideLoading() {
    const loadingIndicator = this.container.querySelector('.loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.style.opacity = '0';
      setTimeout(() => {
        loadingIndicator.style.display = 'none';
      }, 300);
    }
  }

  /**
   * 変化タイプラベル取得
   */
  getTransformationTypeLabel(choice) {
    const labels = {
      follow: '従順',
      change: '変革',
      create: '創造'
    };
    return labels[choice] || '変化';
  }

  /**
   * リセット
   */
  reset() {
    this.currentDisplay = null;
    const displays = this.container.querySelectorAll('.transformation-display, .scenarios-display');
    displays.forEach(display => display.style.display = 'none');
    
    const selected = this.container.querySelector('.theme-option.selected');
    if (selected) selected.classList.remove('selected');
  }
}

// グローバルスコープに公開
window.IChingMetaphorDisplay = IChingMetaphorDisplay;