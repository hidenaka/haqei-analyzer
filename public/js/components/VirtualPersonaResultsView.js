/**
 * VirtualPersonaResultsView.js
 * 仮想人格対話型自己理解プラットフォーム - メインビューコンポーネント
 * 
 * 目的:
 * - 仮想人格システムの動的表示とインタラクション
 * - 3つのOS（精霊・守護者・賢者）の人格表現
 * - 易経メタファーによる象意解説
 * - 静的診断から動的自己理解への転換
 * 
 * 処理内容:
 * 1. VirtualPersonaEngineから生成された人格の視覚化
 * 2. 3つのOS間の相互作用の動的表示
 * 3. 易経象意による深層解説
 * 4. インタラクティブな自己探求プロンプト
 * 5. 成長の示唆とアクションプラン
 * 
 * 前提条件:
 * - VirtualPersonaEngineが初期化済み
 * - 分析結果データが取得済み
 * - bunenjin哲学に基づく設計理解
 * 
 * 副作用:
 * - DOM要素の動的生成と操作
 * - CSS アニメーション適用
 * - ユーザーインタラクション処理
 */

class VirtualPersonaResultsView {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.options = {
      analysisResult: null,
      insights: null,
      enableAnimations: true,
      showPhilosophicalIntro: true,
      ...options
    };
    
    this.personaEngine = new VirtualPersonaEngine();
    this.interactionSimulator = null;
    this.virtualPersonaData = null;
    this.currentView = 'overview'; // overview, personas, interactions, growth
    this.animationQueue = [];
    this.simulationResults = [];
    
    console.log('🎭 VirtualPersonaResultsView initialized - 仮想人格対話型システム');
  }

  /**
   * メイン初期化処理
   */
  async init() {
    try {
      console.log('🌱 VirtualPersonaResultsView initialization starting...');
      
      // Phase 1: 仮想人格データ生成
      await this.generateVirtualPersona();
      
      // Phase 2: UI構築
      await this.buildInterface();
      
      // Phase 3: インタラクション設定
      this.setupInteractions();
      
      // Phase 4: 初期アニメーション開始
      if (this.options.enableAnimations) {
        this.startInitialAnimations();
      }
      
      console.log('✨ VirtualPersonaResultsView initialization completed');
      
    } catch (error) {
      console.error('❌ VirtualPersonaResultsView initialization failed:', error);
      this.renderErrorFallback(error);
    }
  }

  /**
   * 仮想人格データの生成
   */
  async generateVirtualPersona() {
    try {
      console.log('🧬 Generating virtual persona data...');
      
      const analysisResult = this.options.analysisResult;
      const rawAnswers = this.extractRawAnswers();
      
      if (!analysisResult) {
        throw new Error('Analysis result is required for persona generation');
      }
      
      this.virtualPersonaData = await this.personaEngine.generateVirtualPersona(
        analysisResult, 
        rawAnswers
      );
      
      // OSInteractionSimulatorの初期化
      this.interactionSimulator = new OSInteractionSimulator(this.virtualPersonaData);
      
      console.log('✅ Virtual persona generated:', this.virtualPersonaData);
      
    } catch (error) {
      console.error('❌ Persona generation failed:', error);
      throw error;
    }
  }

  /**
   * メインインターフェース構築
   */
  async buildInterface() {
    if (!this.container) {
      throw new Error(`Container with ID '${this.containerId}' not found`);
    }
    
    // コンテナをクリア
    this.container.innerHTML = '';
    this.container.className = 'virtual-persona-results-container';
    
    // メインレイアウト構築
    const layout = this.createMainLayout();
    this.container.appendChild(layout);
    
    // 各セクションの構築
    await this.buildPhilosophicalIntro();
    await this.buildPersonaCards();
    await this.buildInteractionTheater();
    await this.buildGrowthGuidance();
    await this.buildNavigationControls();
    
    console.log('🏗️ Interface built successfully');
  }

  /**
   * メインレイアウトの作成
   */
  createMainLayout() {
    const layout = document.createElement('div');
    layout.className = 'persona-main-layout';
    layout.innerHTML = `
      <div class="persona-header" id="persona-header">
        <!-- 哲学的導入部 -->
      </div>
      
      <div class="persona-content" id="persona-content">
        <div class="persona-cards-section" id="persona-cards">
          <!-- 3つのOS人格カード -->
        </div>
        
        <div class="interaction-theater" id="interaction-theater">
          <!-- 相互作用シアター -->
        </div>
        
        <div class="growth-guidance" id="growth-guidance">
          <!-- 成長の示唆 -->
        </div>
      </div>
      
      <div class="persona-navigation" id="persona-navigation">
        <!-- ナビゲーションコントロール -->
      </div>
    `;
    
    return layout;
  }

  /**
   * 哲学的導入部の構築
   */
  async buildPhilosophicalIntro() {
    const header = document.getElementById('persona-header');
    if (!header) return;
    
    const personas = this.virtualPersonaData.personas;
    
    header.innerHTML = `
      <div class="philosophical-intro">
        <div class="cosmic-title">
          <h1>🌌 内面に存在する複数の自己</h1>
          <p class="cosmic-subtitle">三つの側面が織りなす、複雑な人格構造</p>
        </div>
        
        <div class="persona-introduction">
          <div class="intro-narrative">
            ${this.virtualPersonaData.narrative.introduction}
          </div>
          
          <div class="persona-trinity">
            <div class="persona-preview essence-preview">
              <div class="persona-symbol">✨</div>
              <h3>${personas.essence.name}</h3>
              <p>${personas.essence.nature}</p>
            </div>
            <div class="persona-preview social-preview">
              <div class="persona-symbol">🛡️</div>
              <h3>${personas.social.name}</h3>
              <p>${personas.social.nature}</p>
            </div>
            <div class="persona-preview defense-preview">
              <div class="persona-symbol">🧙‍♂️</div>
              <h3>${personas.defense.name}</h3>
              <p>${personas.defense.nature}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 3つのOS人格カードの構築
   */
  async buildPersonaCards() {
    const cardsContainer = document.getElementById('persona-cards');
    if (!cardsContainer) return;
    
    const personas = this.virtualPersonaData.personas;
    
    cardsContainer.innerHTML = `
      <div class="personas-header">
        <h2>🎭 三つの自己の特徴分析</h2>
        <p>それぞれが異なる機能と特性を持ち、この人格を構成しています</p>
      </div>
      
      <div class="persona-cards-grid">
        ${this.createPersonaCard('essence', personas.essence, '✨', 'essence-card')}
        ${this.createPersonaCard('social', personas.social, '🛡️', 'social-card')}
        ${this.createPersonaCard('defense', personas.defense, '🧙‍♂️', 'defense-card')}
      </div>
    `;
  }

  /**
   * 個別人格カードの作成
   */
  createPersonaCard(type, persona, symbol, className) {
    return `
      <div class="persona-card ${className}" data-persona="${type}">
        <div class="persona-card-header">
          <div class="persona-symbol-large">${symbol}</div>
          <h3 class="persona-name">${persona.name}</h3>
          <p class="persona-nature">${persona.nature}</p>
        </div>
        
        <div class="persona-details">
          <div class="persona-voice">
            <h4>🗣️ この側面の特徴</h4>
            <blockquote>"${persona.voice}"</blockquote>
          </div>
          
          <div class="persona-attributes">
            ${type === 'essence' ? `
              <div class="attribute-item">
                <span class="attribute-label">願望:</span>
                <span class="attribute-value">${persona.desires.join('、')}</span>
              </div>
              <div class="attribute-item">
                <span class="attribute-label">恐れ:</span>
                <span class="attribute-value">${persona.fears.join('、')}</span>
              </div>
              <div class="attribute-item">
                <span class="attribute-label">信念:</span>
                <span class="attribute-value">${persona.motto}</span>
              </div>
            ` : type === 'social' ? `
              <div class="attribute-item">
                <span class="attribute-label">関心事:</span>
                <span class="attribute-value">${persona.concerns.join('、')}</span>
              </div>
              <div class="attribute-item">
                <span class="attribute-label">強み:</span>
                <span class="attribute-value">${persona.strengths.join('、')}</span>
              </div>
              <div class="attribute-item">
                <span class="attribute-label">助言:</span>
                <span class="attribute-value">${persona.advice}</span>
              </div>
            ` : `
              <div class="attribute-item">
                <span class="attribute-label">警告:</span>
                <span class="attribute-value">${persona.warnings.join('、')}</span>
              </div>
              <div class="attribute-item">
                <span class="attribute-label">防護:</span>
                <span class="attribute-value">${persona.protections.join('、')}</span>
              </div>
              <div class="attribute-item">
                <span class="attribute-label">瞑想:</span>
                <span class="attribute-value">${persona.meditation}</span>
              </div>
            `}
          </div>
        </div>
        
        <div class="hexagram-connection">
          <div class="hexagram-info">
            <span class="hexagram-number">${persona.hexagram?.number || '―'}</span>
            <span class="hexagram-name">${persona.hexagram?.name || '探求中'}</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 相互作用シアターの構築
   */
  async buildInteractionTheater() {
    const theater = document.getElementById('interaction-theater');
    if (!theater) return;
    
    // 動的シミュレーションの実行
    if (this.interactionSimulator) {
      console.log('🔄 Running OS interaction simulations...');
      this.simulationResults = await this.interactionSimulator.simulateCommonScenarios();
      console.log('✅ Simulations completed:', this.simulationResults.length);
    }
    
    theater.innerHTML = `
      <div class="theater-header">
        <h2>🎬 動的相互作用シミュレーション</h2>
        <p>様々な状況における三つの自己の相互作用パターンをリアルタイムで分析</p>
        <div class="simulation-controls">
          <button class="simulation-btn" onclick="this.runCustomSimulation()">
            🎯 カスタムシミュレーション実行
          </button>
          <button class="simulation-btn" onclick="this.showSimulationHistory()">
            📊 シミュレーション履歴
          </button>
        </div>
      </div>
      
      <div class="simulation-results">
        ${this.simulationResults.map((simulation, index) => this.createSimulationDisplay(simulation, index)).join('')}
      </div>
      
      <div class="static-interactions" style="margin-top: 2rem;">
        <h3>基本的な相互作用パターン</h3>
        <div class="interaction-scenarios">
          ${this.virtualPersonaData.interactions.map((interaction, index) => this.createInteractionScenario(interaction, index)).join('')}
        </div>
      </div>
    `;
  }

  /**
   * シミュレーション結果の表示作成
   */
  createSimulationDisplay(simulation, index) {
    if (simulation.fallback) {
      return `
        <div class="simulation-error">
          <h4>❌ シミュレーション ${index + 1}: ${simulation.situation.name}</h4>
          <p>エラー: ${simulation.error}</p>
        </div>
      `;
    }
    
    const finalState = simulation.finalState;
    const dominantOS = finalState.dominantOS;
    const balance = finalState.balance;
    
    return `
      <div class="simulation-display" data-simulation="${index}">
        <div class="simulation-header">
          <h4>🎯 シミュレーション: ${simulation.situation.name}</h4>
          <div class="simulation-meta">
            <span class="iteration-count">反復回数: ${simulation.iterations.length}</span>
            <span class="convergence-status ${simulation.convergenceAchieved ? 'converged' : 'not-converged'}">
              ${simulation.convergenceAchieved ? '✅ 収束' : '⏳ 未収束'}
            </span>
          </div>
        </div>
        
        <div class="simulation-content">
          <div class="situation-description">
            <p><strong>状況:</strong> ${simulation.situation.description}</p>
          </div>
          
          <div class="os-balance-display">
            <h5>🎭 最終的なOS活性度バランス</h5>
            <div class="balance-bars">
              <div class="balance-bar essence-bar">
                <span class="bar-label">本質的自己</span>
                <div class="bar-container">
                  <div class="bar-fill" style="width: ${(balance.essence * 100).toFixed(1)}%"></div>
                  <span class="bar-value">${(balance.essence * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div class="balance-bar social-bar">
                <span class="bar-label">社会的自己</span>
                <div class="bar-container">
                  <div class="bar-fill" style="width: ${(balance.social * 100).toFixed(1)}%"></div>
                  <span class="bar-value">${(balance.social * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div class="balance-bar defense-bar">
                <span class="bar-label">防衛的自己</span>
                <div class="bar-container">
                  <div class="bar-fill" style="width: ${(balance.defense * 100).toFixed(1)}%"></div>
                  <span class="bar-value">${(balance.defense * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
            <div class="dominant-os">
              <strong>支配的OS:</strong> 
              <span class="os-badge ${dominantOS}-badge">${this.getOSDisplayName(dominantOS)}</span>
            </div>
          </div>
          
          <div class="final-decision">
            <h5>🎯 統合された判断</h5>
            <div class="decision-text">${finalState.finalDecision}</div>
            <div class="confidence-meter">
              <span class="confidence-label">判断の確信度:</span>
              <div class="confidence-bar">
                <div class="confidence-fill" style="width: ${(finalState.confidence * 100).toFixed(1)}%"></div>
                <span class="confidence-value">${(finalState.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
          
          <div class="simulation-details-toggle">
            <button class="details-btn" onclick="this.toggleSimulationDetails(${index})">
              📋 詳細な相互作用プロセスを表示
            </button>
            <div class="simulation-details" id="sim-details-${index}" style="display: none;">
              ${this.createSimulationDetailsView(simulation)}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * シミュレーション詳細ビューの作成
   */
  createSimulationDetailsView(simulation) {
    return `
      <div class="simulation-timeline">
        <h6>🔄 相互作用の時系列</h6>
        ${simulation.iterations.map((iteration, idx) => `
          <div class="iteration-step">
            <div class="iteration-header">
              <span class="iteration-number">反復 ${idx + 1}</span>
              <span class="iteration-timestamp">${new Date(iteration.timestamp).toLocaleTimeString()}</span>
            </div>
            <div class="iteration-interactions">
              ${iteration.interactions.map(interaction => `
                <div class="interaction-detail">
                  <div class="interaction-flow">
                    <span class="os-from ${interaction.from}">${this.getOSDisplayName(interaction.from)}</span>
                    <span class="interaction-arrow">→</span>
                    <span class="os-to ${interaction.to}">${this.getOSDisplayName(interaction.to)}</span>
                  </div>
                  <div class="interaction-dialogue">
                    <div class="dialogue-message from-message">
                      "${interaction.dialogue.source.message}"
                    </div>
                    <div class="dialogue-message to-message">
                      "${interaction.dialogue.target.message}"
                    </div>
                  </div>
                  <div class="interaction-metrics">
                    <span class="influence-value">影響度: ${(interaction.influence * 100).toFixed(1)}%</span>
                    <span class="adjustment-value">調整: ${(interaction.adjustment * 100).toFixed(1)}%</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="analysis-results">
        <h6>📊 分析結果</h6>
        ${simulation.analysisResults ? this.createAnalysisResultsView(simulation.analysisResults) : '<p>分析結果を生成中...</p>'}
      </div>
    `;
  }

  /**
   * OS表示名の取得
   */
  getOSDisplayName(osType) {
    const names = {
      'essence': '本質的自己',
      'social': '社会的自己', 
      'defense': '防衛的自己'
    };
    return names[osType] || osType;
  }

  /**
   * シミュレーション詳細の表示切り替え
   */
  toggleSimulationDetails(index) {
    const detailsElement = document.getElementById(`sim-details-${index}`);
    if (detailsElement) {
      const isVisible = detailsElement.style.display !== 'none';
      detailsElement.style.display = isVisible ? 'none' : 'block';
      
      const button = detailsElement.previousElementSibling;
      if (button) {
        button.textContent = isVisible ? '📋 詳細な相互作用プロセスを表示' : '📋 詳細を非表示';
      }
    }
  }

  /**
   * 相互作用シナリオの作成
   */
  createInteractionScenario(interaction, index) {
    const scenario = interaction.scenario;
    
    return `
      <div class="interaction-scenario" data-scenario="${index}">
        <div class="scenario-header">
          <h3>${this.getScenarioTitle(interaction.type)}</h3>
          <div class="scenario-setting">${scenario.setting}</div>
        </div>
        
        <div class="dialogue-container">
          ${scenario.dialogue.map(line => `
            <div class="dialogue-line ${line.speaker}-line">
              <div class="speaker-icon">${this.getSpeakerIcon(line.speaker)}</div>
              <div class="dialogue-bubble">
                <div class="speaker-name">${this.getSpeakerName(line.speaker)}</div>
                <div class="dialogue-text">${line.text}</div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="scenario-resolution">
          <div class="resolution-label">この対話パターンの特徴:</div>
          <div class="resolution-text">${scenario.resolution}</div>
          <div class="outcome-badge">${this.getOutcomeBadge(interaction.outcome)}</div>
        </div>
      </div>
    `;
  }

  /**
   * 成長の示唆セクション構築
   */
  async buildGrowthGuidance() {
    const guidance = document.getElementById('growth-guidance');
    if (!guidance) return;
    
    const growthSuggestions = this.virtualPersonaData.growthSuggestions;
    
    guidance.innerHTML = `
      <div class="growth-header">
        <h2>🌱 発達可能性の分析</h2>
        <p>三つの自己をバランス良く発達させるための方向性の提案</p>
      </div>
      
      <div class="growth-sections">
        <div class="growth-section essence-growth">
          <h3>${growthSuggestions.essence.title}</h3>
          <ul class="growth-suggestions">
            ${growthSuggestions.essence.suggestions.map(suggestion => 
              `<li><span class="suggestion-icon">✨</span>${suggestion}</li>`
            ).join('')}
          </ul>
        </div>
        
        <div class="growth-section social-growth">
          <h3>${growthSuggestions.social.title}</h3>
          <ul class="growth-suggestions">
            ${growthSuggestions.social.suggestions.map(suggestion => 
              `<li><span class="suggestion-icon">🛡️</span>${suggestion}</li>`
            ).join('')}
          </ul>
        </div>
        
        <div class="growth-section defense-growth">
          <h3>${growthSuggestions.defense.title}</h3>
          <ul class="growth-suggestions">
            ${growthSuggestions.defense.suggestions.map(suggestion => 
              `<li><span class="suggestion-icon">🧙‍♂️</span>${suggestion}</li>`
            ).join('')}
          </ul>
        </div>
        
        <div class="growth-section integration-growth">
          <h3>${growthSuggestions.integration.title}</h3>
          <ul class="growth-suggestions">
            ${growthSuggestions.integration.suggestions.map(suggestion => 
              `<li><span class="suggestion-icon">🌌</span>${suggestion}</li>`
            ).join('')}
          </ul>
        </div>
      </div>
      
      <div class="philosophical-conclusion">
        ${this.virtualPersonaData.narrative.essence}
      </div>
    `;
  }

  /**
   * ナビゲーションコントロール構築
   */
  async buildNavigationControls() {
    const navigation = document.getElementById('persona-navigation');
    if (!navigation) return;
    
    navigation.innerHTML = `
      <div class="navigation-controls">
        <button class="nav-button active" data-view="overview">
          <span class="nav-icon">🌌</span>
          <span class="nav-label">全体像</span>
        </button>
        <button class="nav-button" data-view="personas">
          <span class="nav-icon">🎭</span>
          <span class="nav-label">三つの存在</span>
        </button>
        <button class="nav-button" data-view="interactions">
          <span class="nav-icon">🎬</span>
          <span class="nav-label">内なる対話</span>
        </button>
        <button class="nav-button" data-view="growth">
          <span class="nav-icon">🌱</span>
          <span class="nav-label">成長の道</span>
        </button>
      </div>
      
      <div class="action-buttons">
        <button class="action-button primary" onclick="this.exportPersonaData()">
          <span class="action-icon">📋</span>
          <span class="action-label">人格データをエクスポート</span>
        </button>
        <button class="action-button secondary" onclick="location.href = 'os_analyzer.html'">
          <span class="action-icon">🔄</span>
          <span class="action-label">新しい分析を開始</span>
        </button>
      </div>
    `;
  }

  /**
   * インタラクション設定
   */
  setupInteractions() {
    // ナビゲーションボタン
    document.querySelectorAll('.nav-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view');
        this.switchView(view);
      });
    });

    // 人格カードのホバー効果
    document.querySelectorAll('.persona-card').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        this.highlightPersonaConnections(e.currentTarget.getAttribute('data-persona'));
      });
      
      card.addEventListener('mouseleave', () => {
        this.clearHighlights();
      });
    });

    // 相互作用シナリオのアニメーション
    this.setupScenarioAnimations();
  }

  /**
   * ビュー切り替え
   */
  switchView(view) {
    // ナビゲーションボタンの更新
    document.querySelectorAll('.nav-button').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === view);
    });

    // コンテンツセクションの表示切り替え
    const sections = {
      'overview': ['persona-header', 'persona-cards', 'interaction-theater', 'growth-guidance'],
      'personas': ['persona-cards'],
      'interactions': ['interaction-theater'],
      'growth': ['growth-guidance']
    };

    // 全セクションを非表示
    document.querySelectorAll('.persona-header, .persona-cards-section, .interaction-theater, .growth-guidance').forEach(section => {
      section.style.display = 'none';
    });

    // 選択されたビューのセクションを表示
    if (sections[view]) {
      sections[view].forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.style.display = 'block';
        }
      });
    }

    this.currentView = view;
  }

  /**
   * 初期アニメーション開始
   */
  startInitialAnimations() {
    // フェードイン効果
    const elements = document.querySelectorAll('.persona-card, .interaction-scenario, .growth-section');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('fade-in');
      }, index * 200);
    });
  }

  /**
   * シナリオアニメーション設定
   */
  setupScenarioAnimations() {
    document.querySelectorAll('.interaction-scenario').forEach(scenario => {
      scenario.addEventListener('click', (e) => {
        const scenarioElement = e.currentTarget;
        this.playScenarioAnimation(scenarioElement);
      });
    });
  }

  /**
   * 人格接続のハイライト
   */
  highlightPersonaConnections(personaType) {
    // 関連する相互作用シナリオをハイライト
    const interactions = this.virtualPersonaData.interactions;
    interactions.forEach((interaction, index) => {
      if (interaction.participants.includes(personaType)) {
        const scenarioElement = document.querySelector(`[data-scenario="${index}"]`);
        if (scenarioElement) {
          scenarioElement.classList.add('highlighted');
        }
      }
    });
  }

  /**
   * ハイライトクリア
   */
  clearHighlights() {
    document.querySelectorAll('.highlighted').forEach(element => {
      element.classList.remove('highlighted');
    });
  }

  /**
   * ヘルパーメソッド群
   */
  getScenarioTitle(type) {
    const titles = {
      'creative_harmony': '🎨 創造と調和の協奏曲',
      'harmony_stability': '⚖️ 調和と安定の協調',
      'creative_caution': '⚡ 創造と慎重さの対話',
      'triple_integration': '🌌 三位一体の統合'
    };
    return titles[type] || '内なる対話';
  }

  getSpeakerIcon(speaker) {
    const icons = {
      'essence': '✨',
      'social': '🛡️',
      'defense': '🧙‍♂️',
      'integration': '🌌'
    };
    return icons[speaker] || '💭';
  }

  getSpeakerName(speaker) {
    if (!this.virtualPersonaData?.personas) return speaker;
    
    const names = {
      'essence': this.virtualPersonaData.personas.essence.name,
      'social': this.virtualPersonaData.personas.social.name,
      'defense': this.virtualPersonaData.personas.defense.name,
      'integration': '統合された智慧'
    };
    return names[speaker] || speaker;
  }

  getOutcomeBadge(outcome) {
    const badges = {
      'balanced_innovation': '🎯 バランスの取れた革新',
      'sustainable_growth': '🌿 持続可能な成長',
      'wise_innovation': '💡 賢明な革新',
      'authentic_action': '⭐ 真正性ある行動'
    };
    return badges[outcome] || outcome;
  }

  /**
   * データ抽出ヘルパー
   */
  extractRawAnswers() {
    // StorageManagerから生の回答データを取得
    try {
      const storageManager = new StorageManager();
      return storageManager.getAnswers() || [];
    } catch (error) {
      console.warn('Failed to extract raw answers:', error);
      return [];
    }
  }

  /**
   * エラーフォールバック表示
   */
  renderErrorFallback(error) {
    if (!this.container) return;
    
    this.container.innerHTML = `
      <div class="error-fallback">
        <div class="error-content">
          <h2>🌀 仮想人格システムの調整中</h2>
          <p>あなたの内なる存在たちとの対話を準備していますが、少し時間がかかっています。</p>
          <p class="error-details">エラー詳細: ${error.message}</p>
          <div class="error-actions">
            <button onclick="location.reload()" class="retry-button">
              再試行
            </button>
            <button onclick="location.href = 'os_analyzer.html'" class="restart-button">
              分析をやり直す
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 人格データエクスポート
   */
  exportPersonaData() {
    if (!this.virtualPersonaData) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      version: 'VirtualPersona v1.0',
      ...this.virtualPersonaData
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `haqei-virtual-persona-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * クリーンアップ
   */
  cleanup() {
    // イベントリスナーの削除
    document.querySelectorAll('.nav-button, .persona-card, .interaction-scenario').forEach(element => {
      element.replaceWith(element.cloneNode(true));
    });
    
    // アニメーションの停止
    this.animationQueue.forEach(animation => {
      if (animation.pause) animation.pause();
    });
    
    console.log('🧹 VirtualPersonaResultsView cleanup completed');
  }
}

// グローバル登録
if (typeof window !== 'undefined') {
  window.VirtualPersonaResultsView = VirtualPersonaResultsView;
}

console.log('🎭 VirtualPersonaResultsView loaded - 仮想人格対話型自己理解システム');