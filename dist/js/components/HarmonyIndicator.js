/**
 * HarmonyIndicator.js - bunenjin哲学調和度表示コンポーネント
 * 
 * 機能：
 * - bunenjin（分人）哲学に基づく複数人格の調和度可視化
 * - Triple OS間の統合・柔軟性・真正性指標表示
 * - リアルタイム調和度変化の動的表示
 * - アクセシビリティ準拠の調和状態表現
 * - I Ching易経による調和の叡智統合
 * 
 * bunenjin哲学の核心：
 * - 単一の「真の自分」を求めるのではなく
 * - 複数の人格（分人）が調和的に共存する状態を目指す
 * - 各分人の特性を尊重し、全体の統合を図る
 * 
 * バージョン: v1.0.0-harmony-integration
 * 作成日: 2025-08-05
 */

class HarmonyIndicator {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.options = {
      showAnimations: true,
      showDetails: true,
      colorTheme: 'bunenjin', // bunenjin, nature, minimal
      updateInterval: 100, // ms
      sensitivity: 0.1, // 変化感度
      ...options
    };
    
    // 調和度の指標
    this.harmonyMetrics = {
      overall: 0,      // 全体調和度
      integration: 0,  // 統合レベル
      flexibility: 0,  // 柔軟性指数
      authenticity: 0, // 真正性指数
      tension: 0,      // 緊張レベル
      stability: 0     // 安定性指数
    };
    
    // bunenjin哲学カラーパレット
    this.colorPalette = {
      bunenjin: {
        harmony: {
          excellent: '#a8e6cf',  // 優秀な調和 - 自然の緑
          good: '#88d8a3',       // 良好な調和 - 若葉の緑
          fair: '#ffd93d',       // 普通の調和 - 陽光の黄
          poor: '#ff8e8e',       // 改善必要 - 優しい赤
          critical: '#ff6b6b'    // 緊急対応 - 警告の赤
        },
        background: 'rgba(248, 250, 252, 0.95)',
        text: {
          primary: '#2d3748',
          secondary: '#4a5568',
          accent: '#38a169'
        },
        border: '#e2e8f0'
      },
      nature: {
        harmony: {
          excellent: '#68d391',
          good: '#9ae6b4',
          fair: '#fbb660',
          poor: '#fc8181',
          critical: '#f56565'
        },
        background: 'rgba(240, 253, 244, 0.95)',
        text: {
          primary: '#1a202c',
          secondary: '#2d3748',
          accent: '#38a169'
        },
        border: '#c6f6d5'
      },
      minimal: {
        harmony: {
          excellent: '#4299e1',
          good: '#63b3ed',
          fair: '#ed8936',
          poor: '#f56565',
          critical: '#e53e3e'
        },
        background: 'rgba(247, 250, 252, 0.95)',
        text: {
          primary: '#2d3748',
          secondary: '#718096',
          accent: '#3182ce'
        },
        border: '#e2e8f0'
      }
    };
    
    // アニメーション管理
    this.animations = {
      pulseInterval: null,
      updateInterval: null,
      transitionActive: false
    };
    
    // 状態管理
    this.currentState = 'initializing';
    this.previousMetrics = { ...this.harmonyMetrics };
    this.changeHistory = [];
    
    console.log("🎭 HarmonyIndicator initialized with bunenjin philosophy");
  }
  
  /**
   * 調和度インディケーターの初期化
   */
  async initialize() {
    if (!this.container) {
      console.error(`❌ Container with ID '${this.containerId}' not found`);
      return false;
    }
    
    try {
      // UIの構築
      this.buildHarmonyUI();
      
      // スタイルの適用
      this.applyHarmonyStyles();
      
      // イベントリスナーの設定
      this.setupEventListeners();
      
      // アニメーション開始
      if (this.options.showAnimations) {
        this.startAnimations();
      }
      
      this.currentState = 'ready';
      console.log("✅ HarmonyIndicator initialized successfully");
      return true;
      
    } catch (error) {
      console.error("❌ Error initializing HarmonyIndicator:", error);
      this.currentState = 'error';
      return false;
    }
  }
  
  /**
   * 調和度UIの構築
   */
  buildHarmonyUI() {
    const theme = this.colorPalette[this.options.colorTheme];
    
    this.container.innerHTML = `
      <div class="harmony-indicator" data-theme="${this.options.colorTheme}">
        <!-- メイン調和度表示 -->
        <div class="harmony-main-display">
          <div class="harmony-circle">
            <div class="harmony-inner-circle">
              <div class="harmony-value" id="harmony-main-value">--</div>
              <div class="harmony-label">調和度</div>
              <div class="harmony-status" id="harmony-status">初期化中</div>
            </div>
            <svg class="harmony-progress-ring" width="200" height="200">
              <circle class="harmony-ring-background" cx="100" cy="100" r="85" 
                      fill="none" stroke="${theme.border}" stroke-width="8"/>
              <circle class="harmony-ring-progress" cx="100" cy="100" r="85" 
                      fill="none" stroke="${theme.harmony.good}" stroke-width="8"
                      stroke-linecap="round" stroke-dasharray="534.07" stroke-dashoffset="534.07"/>
            </svg>
          </div>
        </div>
        
        <!-- 詳細指標表示 -->
        <div class="harmony-details" ${!this.options.showDetails ? 'style="display: none;"' : ''}>
          <div class="harmony-metric">
            <div class="metric-label">統合度</div>
            <div class="metric-bar">
              <div class="metric-fill" id="integration-fill" style="width: 0%"></div>
            </div>
            <div class="metric-value" id="integration-value">0%</div>
          </div>
          
          <div class="harmony-metric">
            <div class="metric-label">柔軟性</div>
            <div class="metric-bar">
              <div class="metric-fill" id="flexibility-fill" style="width: 0%"></div>
            </div>
            <div class="metric-value" id="flexibility-value">0%</div>
          </div>
          
          <div class="harmony-metric">
            <div class="metric-label">真正性</div>
            <div class="metric-bar">
              <div class="metric-fill" id="authenticity-fill" style="width: 0%"></div>
            </div>
            <div class="metric-value" id="authenticity-value">0%</div>
          </div>
          
          <div class="harmony-metric tension-metric">
            <div class="metric-label">緊張度</div>
            <div class="metric-bar">
              <div class="metric-fill tension-fill" id="tension-fill" style="width: 0%"></div>
            </div>
            <div class="metric-value" id="tension-value">0%</div>
          </div>
        </div>
        
        <!-- 調和の洞察 -->
        <div class="harmony-insights">
          <div class="insight-panel" id="harmony-insight">
            <div class="insight-icon">🎭</div>
            <div class="insight-text">bunenjin哲学による調和度分析を準備中...</div>
          </div>
        </div>
        
        <!-- bunenjin哲学ガイダンス -->
        <div class="bunenjin-guidance">
          <div class="guidance-header">
            <span class="guidance-icon">🌸</span>
            <span class="guidance-title">bunenjin の智慧</span>
          </div>
          <div class="guidance-content" id="bunenjin-guidance">
            複数の分人が調和し、状況に応じて適切に表れることで、真の自分らしさが発揮されます。
          </div>
        </div>
        
        <!-- アクセシビリティ用 -->
        <div class="sr-only" aria-live="polite" id="harmony-status-announcement"></div>
      </div>
    `;
  }
  
  /**
   * 調和度の更新
   * 
   * @param {Object} tripleOSData - Triple OS分析データ
   * @param {Object} bunenjinData - bunenjin哲学データ  
   */
  updateHarmony(tripleOSData, bunenjinData = null) {
    console.log("🎭 Updating harmony indicators");
    
    try {
      // メトリクスの計算
      this.calculateHarmonyMetrics(tripleOSData, bunenjinData);
      
      // UIの更新
      this.updateHarmonyUI();
      
      // 洞察の生成
      this.updateHarmonyInsights();
      
      // bunenjinガイダンスの更新
      this.updateBunenjinGuidance();
      
      // 履歴の記録
      this.recordHarmonyChange();
      
      // アクセシビリティ通知
      this.announceHarmonyChange();
      
    } catch (error) {
      console.error("❌ Error updating harmony:", error);
    }
  }
  
  /**
   * 調和度メトリクスの計算
   */
  calculateHarmonyMetrics(tripleOSData, bunenjinData) {
    // 前回の値を保存
    this.previousMetrics = { ...this.harmonyMetrics };
    
    // bunenjinデータがある場合はそれを使用
    if (bunenjinData) {
      this.harmonyMetrics.overall = bunenjinData.harmony || 0.5;
      this.harmonyMetrics.integration = bunenjinData.integration || 0.5;
      this.harmonyMetrics.flexibility = bunenjinData.flexibility || 0.5;
      this.harmonyMetrics.authenticity = bunenjinData.authenticity || 0.5;
      this.harmonyMetrics.tension = bunenjinData.tension || 0.3;
    } else {
      // Triple OSデータから計算
      this.calculateFromTripleOS(tripleOSData);
    }
    
    // 安定性指数の計算
    this.harmonyMetrics.stability = this.calculateStability();
  }
  
  /**
   * Triple OSデータからの調和度計算
   */
  calculateFromTripleOS(tripleOSData) {
    const engine = tripleOSData.engine || {};
    const interface = tripleOSData.interface || {};
    const safeMode = tripleOSData.safeMode || {};
    
    // 各OSの強度を取得
    const engineStrength = engine.strength || 0.5;
    const interfaceStrength = interface.strength || 0.5;
    const safeModeStrength = safeMode.strength || 0.5;
    
    // 強度のバランスから調和度を計算
    const strengths = [engineStrength, interfaceStrength, safeModeStrength];
    const maxStrength = Math.max(...strengths);
    const minStrength = Math.min(...strengths);
    const strengthRange = maxStrength - minStrength;
    
    // 調和度（範囲が小さいほど調和している）
    this.harmonyMetrics.overall = Math.max(0, 1 - strengthRange);
    
    // 統合度（各OSの統合スコアの平均）
    const integrationScores = [
      engine.scores?.integration || 0.5,
      interface.scores?.integration || 0.5,
      safeMode.scores?.integration || 0.5
    ];
    this.harmonyMetrics.integration = integrationScores.reduce((sum, score) => sum + score, 0) / 3;
    
    // 柔軟性（各OSの柔軟性スコアの平均）
    const flexibilityScores = [
      engine.scores?.flexibility || 0.5,
      interface.scores?.flexibility || 0.5,
      safeMode.scores?.flexibility || 0.5
    ];
    this.harmonyMetrics.flexibility = flexibilityScores.reduce((sum, score) => sum + score, 0) / 3;
    
    // 真正性（各OSの一貫性スコアの平均）
    const authenticityScores = [
      engine.scores?.consistency || 0.5,
      interface.scores?.consistency || 0.5,
      safeMode.scores?.consistency || 0.5
    ];
    this.harmonyMetrics.authenticity = authenticityScores.reduce((sum, score) => sum + score, 0) / 3;
    
    // 緊張度（調和度の逆数）
    this.harmonyMetrics.tension = Math.max(0, 1 - this.harmonyMetrics.overall);
  }
  
  /**
   * 安定性指数の計算
   */
  calculateStability() {
    // 過去の変化履歴から安定性を計算
    if (this.changeHistory.length < 2) return 0.5;
    
    const recentChanges = this.changeHistory.slice(-5); // 直近5回の変化
    const changes = recentChanges.map((record, index) => {
      if (index === 0) return 0;
      const prev = recentChanges[index - 1];
      return Math.abs(record.overall - prev.overall);
    }).filter(change => change > 0);
    
    if (changes.length === 0) return 1.0; // 変化がない = 安定
    
    const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    return Math.max(0, 1 - avgChange * 10); // 変化が小さいほど安定
  }
  
  /**
   * 調和度UIの更新
   */
  updateHarmonyUI() {
    const theme = this.colorPalette[this.options.colorTheme];
    
    // メイン調和度の更新
    const mainValue = document.getElementById('harmony-main-value');
    const harmonyStatus = document.getElementById('harmony-status');
    const progressRing = this.container.querySelector('.harmony-ring-progress');
    
    if (mainValue) {
      const percentage = Math.round(this.harmonyMetrics.overall * 100);
      mainValue.textContent = `${percentage}%`;
      
      // 色の更新
      const color = this.getHarmonyColor(this.harmonyMetrics.overall);
      mainValue.style.color = color;
      
      // プログレスリングの更新
      if (progressRing) {
        const circumference = 534.07;
        const offset = circumference - (percentage / 100) * circumference;
        progressRing.style.strokeDashoffset = offset;
        progressRing.style.stroke = color;
        
        if (this.options.showAnimations) {
          progressRing.style.transition = 'stroke-dashoffset 0.8s ease, stroke 0.3s ease';
        }
      }
    }
    
    if (harmonyStatus) {
      harmonyStatus.textContent = this.getHarmonyStatusText(this.harmonyMetrics.overall);
    }
    
    // 詳細メトリクスの更新
    this.updateMetricBar('integration', this.harmonyMetrics.integration);
    this.updateMetricBar('flexibility', this.harmonyMetrics.flexibility);
    this.updateMetricBar('authenticity', this.harmonyMetrics.authenticity);
    this.updateMetricBar('tension', this.harmonyMetrics.tension, true); // 緊張度は逆色
  }
  
  /**
   * メトリクスバーの更新
   */
  updateMetricBar(metricName, value, isReverse = false) {
    const fill = document.getElementById(`${metricName}-fill`);
    const valueEl = document.getElementById(`${metricName}-value`);
    
    if (!fill || !valueEl) return;
    
    const percentage = Math.round(value * 100);
    
    if (this.options.showAnimations) {
      fill.style.transition = 'width 0.6s ease, background-color 0.3s ease';
    }
    
    fill.style.width = `${percentage}%`;
    valueEl.textContent = `${percentage}%`;
    
    // 色の設定
    const color = isReverse ? 
      this.getHarmonyColor(1 - value, true) : 
      this.getHarmonyColor(value);
    fill.style.backgroundColor = color;
  }
  
  /**
   * 調和度に応じた色の取得
   */
  getHarmonyColor(value, isReverse = false) {
    const theme = this.colorPalette[this.options.colorTheme];
    
    if (isReverse) value = 1 - value;
    
    if (value >= 0.8) return theme.harmony.excellent;
    if (value >= 0.6) return theme.harmony.good;
    if (value >= 0.4) return theme.harmony.fair;
    if (value >= 0.2) return theme.harmony.poor;
    return theme.harmony.critical;
  }
  
  /**
   * 調和度ステータステキストの取得
   */
  getHarmonyStatusText(value) {
    if (value >= 0.8) return "高度な調和";
    if (value >= 0.6) return "良好な調和";
    if (value >= 0.4) return "バランス調整中";
    if (value >= 0.2) return "調和の向上が必要";
    return "統合を要する状態";
  }
  
  /**
   * 調和の洞察更新
   */
  updateHarmonyInsights() {
    const insightPanel = document.getElementById('harmony-insight');
    if (!insightPanel) return;
    
    const insight = this.generateHarmonyInsight();
    
    insightPanel.innerHTML = `
      <div class="insight-icon">${insight.icon}</div>
      <div class="insight-text">${insight.text}</div>
    `;
  }
  
  /**
   * 調和の洞察生成
   */
  generateHarmonyInsight() {
    const overall = this.harmonyMetrics.overall;
    const integration = this.harmonyMetrics.integration;
    const flexibility = this.harmonyMetrics.flexibility;
    const authenticity = this.harmonyMetrics.authenticity;
    
    if (overall >= 0.8) {
      return {
        icon: "🌸",
        text: "あなたの分人たちは美しく調和しています。この状態を大切に保ちながら、更なる成長を目指しましょう。"
      };
    } else if (overall >= 0.6) {
      return {
        icon: "🌿",
        text: "分人の調和は良好です。時々内なる声に耳を傾け、バランスを保ちましょう。"
      };
    } else if (overall >= 0.4) {
      if (integration < 0.4) {
        return {
          icon: "🔄",
          text: "統合度の向上に注力しましょう。各分人の声を聞き、共通点を見つけることが重要です。"
        };
      } else if (flexibility < 0.4) {
        return {
          icon: "🌊",
          text: "柔軟性を高めることで、より調和の取れた状態に導かれるでしょう。"
        };
      } else {
        return {
          icon: "⚖️",
          text: "分人間のバランスを意識することで、調和度を向上させることができます。"
        };
      }
    } else {
      return {
        icon: "🌱",
        text: "分人の調和には時間が必要です。焦らず、一歩ずつ統合を図っていきましょう。"
      };
    }
  }
  
  /**
   * bunenjinガイダンスの更新
   */
  updateBunenjinGuidance() {
    const guidanceContent = document.getElementById('bunenjin-guidance');
    if (!guidanceContent) return;
    
    const guidance = this.generateBunenjinGuidance();
    guidanceContent.textContent = guidance;
  }
  
  /**
   * bunenjinガイダンスの生成
   */
  generateBunenjinGuidance() {
    const overall = this.harmonyMetrics.overall;
    const tension = this.harmonyMetrics.tension;
    
    const guidances = [
      "単一の「真の自分」を求めるのではなく、複数の分人が調和的に共存することが大切です。",
      "各分人にはそれぞれの役割があります。状況に応じて適切な分人が表れることを受け入れましょう。",
      "分人間の対立は自然なことです。対立を恐れず、統合の機会として活用しましょう。",
      "調和とは均一ではありません。多様性を保ちながらも、全体として一つの方向に向かうことです。",
      "時には一つの分人が強く表れることもあります。それも自然な流れとして受け入れましょう。"
    ];
    
    if (overall >= 0.8) {
      return "あなたの分人たちは美しく調和しています。この多様性の中の統一を大切にしてください。";
    } else if (tension > 0.6) {
      return "分人間の緊張を感じているかもしれません。それぞれの声に耳を傾け、対話の機会を作りましょう。";
    } else {
      return guidances[Math.floor(Math.random() * guidances.length)];
    }
  }
  
  /**
   * 変化履歴の記録
   */
  recordHarmonyChange() {
    this.changeHistory.push({
      timestamp: Date.now(),
      overall: this.harmonyMetrics.overall,
      integration: this.harmonyMetrics.integration,
      flexibility: this.harmonyMetrics.flexibility,
      authenticity: this.harmonyMetrics.authenticity,
      tension: this.harmonyMetrics.tension
    });
    
    // 履歴サイズ制限（最大50件）
    if (this.changeHistory.length > 50) {
      this.changeHistory.shift();
    }
  }
  
  /**
   * アクセシビリティ通知
   */
  announceHarmonyChange() {
    const announcement = document.getElementById('harmony-status-announcement');
    if (!announcement) return;
    
    const percentage = Math.round(this.harmonyMetrics.overall * 100);
    const status = this.getHarmonyStatusText(this.harmonyMetrics.overall);
    
    announcement.textContent = `調和度が${percentage}パーセントに更新されました。現在の状態: ${status}`;
  }
  
  /**
   * 調和度スタイルの適用
   */
  applyHarmonyStyles() {
    const styleId = 'harmony-indicator-styles';
    if (document.getElementById(styleId)) return;
    
    const theme = this.colorPalette[this.options.colorTheme];
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .harmony-indicator {
        font-family: 'Inter', sans-serif;
        background: ${theme.background};
        border: 2px solid ${theme.border};
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        backdrop-filter: blur(8px);
      }
      
      .harmony-main-display {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 30px;
      }
      
      .harmony-circle {
        position: relative;
        width: 200px;
        height: 200px;
      }
      
      .harmony-inner-circle {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 2;
      }
      
      .harmony-value {
        font-size: 2.5em;
        font-weight: 700;
        color: ${theme.text.primary};
        line-height: 1;
        margin-bottom: 5px;
      }
      
      .harmony-label {
        font-size: 0.9em;
        font-weight: 500;
        color: ${theme.text.secondary};
        margin-bottom: 8px;
      }
      
      .harmony-status {
        font-size: 0.8em;
        font-weight: 500;
        color: ${theme.text.accent};
        padding: 4px 8px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 12px;
      }
      
      .harmony-progress-ring {
        position: absolute;
        top: 0;
        left: 0;
        transform: rotate(-90deg);
      }
      
      .harmony-ring-background {
        opacity: 0.2;
      }
      
      .harmony-details {
        margin-bottom: 24px;
      }
      
      .harmony-metric {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.6);
      }
      
      .metric-label {
        font-weight: 500;
        color: ${theme.text.primary};
        min-width: 80px;
        font-size: 0.9em;
      }
      
      .metric-bar {
        flex: 1;
        height: 8px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        overflow: hidden;
      }
      
      .metric-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.6s ease;
      }
      
      .metric-value {
        font-weight: 600;
        color: ${theme.text.primary};
        min-width: 40px;
        text-align: right;
        font-size: 0.9em;
      }
      
      .tension-metric .metric-fill {
        background: ${theme.harmony.poor} !important;
      }
      
      .harmony-insights {
        margin-bottom: 20px;
      }
      
      .insight-panel {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.8);
        border-radius: 12px;
        border-left: 4px solid ${theme.text.accent};
      }
      
      .insight-icon {
        font-size: 1.5em;
        flex-shrink: 0;
      }
      
      .insight-text {
        color: ${theme.text.primary};
        line-height: 1.5;
        font-size: 0.95em;
      }
      
      .bunenjin-guidance {
        background: linear-gradient(135deg, rgba(168, 230, 207, 0.2), rgba(136, 216, 163, 0.2));
        border: 1px solid rgba(168, 230, 207, 0.4);
        border-radius: 12px;
        padding: 16px;
      }
      
      .guidance-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
      }
      
      .guidance-icon {
        font-size: 1.2em;
      }
      
      .guidance-title {
        font-weight: 600;
        color: ${theme.text.primary};
        font-size: 1em;
      }
      
      .guidance-content {
        color: ${theme.text.primary};
        line-height: 1.6;
        font-size: 0.95em;
        text-align: justify;
      }
      
      /* アニメーション */
      @keyframes harmonyPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
      }
      
      .harmony-circle.pulse {
        animation: harmonyPulse 2s ease-in-out infinite;
      }
      
      /* レスポンシブ対応 */
      @media (max-width: 768px) {
        .harmony-indicator {
          padding: 16px;
        }
        
        .harmony-circle {
          width: 160px;
          height: 160px;
        }
        
        .harmony-value {
          font-size: 2em;
        }
        
        .harmony-metric {
          flex-direction: column;
          align-items: stretch;
          gap: 8px;
        }
        
        .metric-label {
          min-width: auto;
        }
        
        .metric-value {
          text-align: left;
        }
      }
      
      /* アクセシビリティ */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      
      /* フォーカス表示 */
      .harmony-indicator:focus-within {
        outline: 2px solid ${theme.text.accent};
        outline-offset: 2px;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  /**
   * イベントリスナーの設定
   */
  setupEventListeners() {
    // マウスホバー時のアニメーション
    const harmonyCircle = this.container.querySelector('.harmony-circle');
    if (harmonyCircle && this.options.showAnimations) {
      harmonyCircle.addEventListener('mouseenter', () => {
        harmonyCircle.classList.add('pulse');
      });
      
      harmonyCircle.addEventListener('mouseleave', () => {
        harmonyCircle.classList.remove('pulse');
      });
    }
    
    // リサイズイベント
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  
  /**
   * リサイズハンドリング
   */
  handleResize() {
    // リサイズ後のUI調整が必要な場合はここに実装
  }
  
  /**
   * アニメーションの開始
   */
  startAnimations() {
    // パルスアニメーション（必要に応じて）
    if (this.animations.pulseInterval) {
      clearInterval(this.animations.pulseInterval);
    }
    
    // 定期更新アニメーション（必要に応じて）
    if (this.options.updateInterval && this.options.updateInterval > 0) {
      this.animations.updateInterval = setInterval(() => {
        // 定期的な更新処理
      }, this.options.updateInterval);
    }
  }
  
  /**
   * アニメーションの停止
   */
  stopAnimations() {
    if (this.animations.pulseInterval) {
      clearInterval(this.animations.pulseInterval);
      this.animations.pulseInterval = null;
    }
    
    if (this.animations.updateInterval) {
      clearInterval(this.animations.updateInterval);
      this.animations.updateInterval = null;
    }
  }
  
  /**
   * 調和度データの取得
   */
  getHarmonyData() {
    return {
      metrics: { ...this.harmonyMetrics },
      state: this.currentState,
      changeHistory: [...this.changeHistory],
      stability: this.harmonyMetrics.stability
    };
  }
  
  /**
   * リセット
   */
  reset() {
    this.harmonyMetrics = {
      overall: 0,
      integration: 0,
      flexibility: 0,
      authenticity: 0,
      tension: 0,
      stability: 0
    };
    
    this.changeHistory = [];
    this.currentState = 'ready';
    
    // UIのリセット
    this.updateHarmonyUI();
  }
  
  /**
   * 破棄
   */
  destroy() {
    this.stopAnimations();
    
    // イベントリスナーの削除
    window.removeEventListener('resize', this.handleResize.bind(this));
    
    // スタイルの削除
    const style = document.getElementById('harmony-indicator-styles');
    if (style) {
      style.remove();
    }
    
    this.currentState = 'destroyed';
  }
  
  /**
   * 統計情報の取得
   */
  getStats() {
    return {
      currentState: this.currentState,
      metricsCount: Object.keys(this.harmonyMetrics).length,
      historyLength: this.changeHistory.length,
      theme: this.options.colorTheme,
      animationsEnabled: this.options.showAnimations
    };
  }
}

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.HarmonyIndicator = HarmonyIndicator;
  console.log('✅ HarmonyIndicator loaded with bunenjin philosophy integration');
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HarmonyIndicator;
}