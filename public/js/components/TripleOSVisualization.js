/**
 * TripleOSVisualization.js - Triple OS可視化コンポーネント
 * 
 * 機能：
 * - Chart.js 3.9.1を使用した高品質Triple OS可視化
 * - bunenjin哲学に基づく調和的デザイン
 * - レスポンシブ対応とアクセシビリティ準拠
 * - I Ching易経統合による深層可視化
 * - 序卦伝関係性のネットワーク図表示
 * 
 * バージョン: v2.0.0-chart-integration
 * 作成日: 2025-08-05
 */

class TripleOSVisualization {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.options = {
      theme: 'bunenjin', // bunenjin, dark, light
      responsive: true,
      animations: true,
      accessibility: true,
      showLegend: true,
      showLabels: true,
      ...options
    };
    
    // Chart.js インスタンス管理
    this.charts = new Map();
    
    // bunenjin哲学カラーパレット
    this.colorPalette = {
      engine: {
        primary: '#ff6b6b',      // 情熱の赤
        secondary: '#ff8e8e',
        gradient: ['#ff6b6b', '#ff8e8e', '#ffb3b3']
      },
      interface: {
        primary: '#4ecdc4',      // 調和の青緑
        secondary: '#6dd5cd',
        gradient: ['#4ecdc4', '#6dd5cd', '#8dded7']
      },
      safeMode: {
        primary: '#ffd93d',      // 守護の黄
        secondary: '#ffe066',
        gradient: ['#ffd93d', '#ffe066', '#ffe799']
      },
      harmony: {
        primary: '#a8e6cf',      // 調和の緑
        secondary: '#88d8a3',
        background: 'rgba(168, 230, 207, 0.1)'
      }
    };
    
    // アニメーション設定
    this.animationConfig = {
      duration: 1000,
      easing: 'easeInOutCubic',
      delay: (context) => context.dataIndex * 100
    };
    
    console.log("🎨 TripleOSVisualization initialized with bunenjin design philosophy");
  }
  
  /**
   * Triple OS統合可視化の生成
   * 
   * @param {Object} tripleOSData - Triple OS分析データ
   * @param {Object} ichingData - I Ching統合データ  
   * @param {Object} sequenceData - 序卦伝関係性データ
   */
  async createTripleOSVisualization(tripleOSData, ichingData = null, sequenceData = null) {
    console.log("🎨 Creating comprehensive Triple OS visualization");
    
    try {
      // コンテナの準備
      this.prepareContainer();
      
      // メイン可視化の作成
      await this.createMainVisualization(tripleOSData);
      
      // I Ching統合可視化
      if (ichingData) {
        await this.createIChingVisualization(ichingData);
      }
      
      // 序卦伝関係性可視化
      if (sequenceData) {
        await this.createSequenceVisualization(sequenceData);
      }
      
      // インタラクティブ要素の追加
      this.addInteractiveElements();
      
      console.log("✅ Triple OS visualization created successfully");
      
    } catch (error) {
      console.error("❌ Error creating Triple OS visualization:", error);
      this.createFallbackVisualization(tripleOSData);
    }
  }
  
  /**
   * コンテナの準備
   */
  prepareContainer() {
    if (!this.container) {
      throw new Error(`Container with ID '${this.containerId}' not found`);
    }
    
    this.container.innerHTML = `
      <div class="triple-os-visualization" data-theme="${this.options.theme}">
        <!-- メインレーダーチャート -->
        <div class="visualization-section main-radar">
          <h3 class="section-title">Triple OS統合分析</h3>
          <div class="chart-container">
            <canvas id="triple-os-radar" width="400" height="400"></canvas>
          </div>
        </div>
        
        <!-- OSバランスチャート -->
        <div class="visualization-section os-balance">
          <h3 class="section-title">OS強度バランス</h3>
          <div class="chart-container">
            <canvas id="os-balance-chart" width="400" height="200"></canvas>
          </div>
        </div>
        
        <!-- 調和度インディケーター -->
        <div class="visualization-section harmony-indicator">
          <h3 class="section-title">bunenjin調和度</h3>
          <div class="harmony-display">
            <canvas id="harmony-gauge" width="300" height="150"></canvas>
            <div class="harmony-metrics">
              <div class="metric">
                <span class="label">統合度</span>
                <span class="value" id="integration-value">-</span>
              </div>
              <div class="metric">
                <span class="label">柔軟性</span>
                <span class="value" id="flexibility-value">-</span>
              </div>
              <div class="metric">
                <span class="label">真正性</span>
                <span class="value" id="authenticity-value">-</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- I Ching統合表示 -->
        <div class="visualization-section iching-integration" style="display: none;">
          <h3 class="section-title">易経統合分析</h3>
          <div class="iching-display">
            <canvas id="iching-hexagram-chart" width="400" height="300"></canvas>
          </div>
        </div>
        
        <!-- 序卦伝関係性ネットワーク -->
        <div class="visualization-section sequence-network" style="display: none;">
          <h3 class="section-title">序卦伝関係性</h3>
          <div class="network-container">
            <canvas id="sequence-network-chart" width="500" height="400"></canvas>
          </div>
        </div>
        
        <!-- 詳細データパネル -->
        <div class="visualization-section data-panel">
          <h3 class="section-title">詳細データ</h3>
          <div class="data-tabs">
            <button class="tab-button active" data-tab="engine">Engine OS</button>
            <button class="tab-button" data-tab="interface">Interface OS</button>
            <button class="tab-button" data-tab="safemode">SafeMode OS</button>
          </div>
          <div class="tab-content" id="tab-content">
            <!-- タブコンテンツがここに表示される -->
          </div>
        </div>
      </div>
    `;
    
    // CSSスタイルの動的追加
    this.addDynamicStyles();
  }
  
  /**
   * メイン可視化の作成
   */
  async createMainVisualization(tripleOSData) {
    // レーダーチャートの作成
    await this.createRadarChart(tripleOSData);
    
    // バランスチャートの作成
    await this.createBalanceChart(tripleOSData);
    
    // 調和度ゲージの作成
    await this.createHarmonyGauge(tripleOSData);
  }
  
  /**
   * レーダーチャートの作成
   */
  async createRadarChart(tripleOSData) {
    const canvas = document.getElementById('triple-os-radar');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // データの準備
    const engineData = tripleOSData.engine || {};
    const interfaceData = tripleOSData.interface || {};
    const safeModeData = tripleOSData.safeMode || {};
    
    const radarData = {
      labels: [
        '強度', '一貫性', '柔軟性', '統合度', '適応性', '安定性'
      ],
      datasets: [
        {
          label: 'Engine OS',
          data: [
            (engineData.scores?.strength || 0.5) * 100,
            (engineData.scores?.consistency || 0.5) * 100,
            (engineData.scores?.flexibility || 0.5) * 100,
            (engineData.scores?.integration || 0.5) * 100,
            (engineData.scores?.adaptability || 0.5) * 100,
            (engineData.scores?.stability || 0.5) * 100
          ],
          backgroundColor: this.colorPalette.engine.primary + '40',
          borderColor: this.colorPalette.engine.primary,
          borderWidth: 2,
          pointBackgroundColor: this.colorPalette.engine.primary,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: this.colorPalette.engine.primary
        },
        {
          label: 'Interface OS',
          data: [
            (interfaceData.scores?.strength || 0.5) * 100,
            (interfaceData.scores?.consistency || 0.5) * 100,
            (interfaceData.scores?.flexibility || 0.5) * 100,
            (interfaceData.scores?.integration || 0.5) * 100,
            (interfaceData.scores?.adaptability || 0.5) * 100,
            (interfaceData.scores?.stability || 0.5) * 100
          ],
          backgroundColor: this.colorPalette.interface.primary + '40',
          borderColor: this.colorPalette.interface.primary,
          borderWidth: 2,
          pointBackgroundColor: this.colorPalette.interface.primary,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: this.colorPalette.interface.primary
        },
        {
          label: 'SafeMode OS',
          data: [
            (safeModeData.scores?.strength || 0.5) * 100,
            (safeModeData.scores?.consistency || 0.5) * 100,
            (safeModeData.scores?.flexibility || 0.5) * 100,
            (safeModeData.scores?.integration || 0.5) * 100,
            (safeModeData.scores?.adaptability || 0.5) * 100,
            (safeModeData.scores?.stability || 0.5) * 100
          ],
          backgroundColor: this.colorPalette.safeMode.primary + '40',
          borderColor: this.colorPalette.safeMode.primary,
          borderWidth: 2,
          pointBackgroundColor: this.colorPalette.safeMode.primary,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: this.colorPalette.safeMode.primary
        }
      ]
    };
    
    const config = {
      type: 'radar',
      data: radarData,
      options: {
        responsive: this.options.responsive,
        maintainAspectRatio: false,
        animation: this.options.animations ? this.animationConfig : false,
        plugins: {
          legend: {
            display: this.options.showLegend,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              font: {
                family: "'Inter', sans-serif",
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#333',
            borderWidth: 1,
            titleFont: {
              family: "'Inter', sans-serif",
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              family: "'Inter', sans-serif",
              size: 12
            },
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${context.parsed.r.toFixed(1)}%`;
              }
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            min: 0,
            max: 100,
            ticks: {
              stepSize: 20,
              font: {
                family: "'Inter', sans-serif",
                size: 10
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            angleLines: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            pointLabels: {
              font: {
                family: "'Inter', sans-serif",
                size: 12,
                weight: '500'
              }
            }
          }
        }
      }
    };
    
    const radarChart = new Chart(ctx, config);
    this.charts.set('radar', radarChart);
  }
  
  /**
   * バランスチャートの作成
   */
  async createBalanceChart(tripleOSData) {
    const canvas = document.getElementById('os-balance-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const balanceData = {
      labels: ['Engine OS', 'Interface OS', 'SafeMode OS'],
      datasets: [{
        label: 'OS強度',
        data: [
          (tripleOSData.engine?.strength || 0.5) * 100,
          (tripleOSData.interface?.strength || 0.5) * 100,
          (tripleOSData.safeMode?.strength || 0.5) * 100
        ],
        backgroundColor: [
          this.colorPalette.engine.primary,
          this.colorPalette.interface.primary,
          this.colorPalette.safeMode.primary
        ],
        borderColor: [
          this.colorPalette.engine.primary,
          this.colorPalette.interface.primary,
          this.colorPalette.safeMode.primary
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }]
    };
    
    const config = {
      type: 'bar',
      data: balanceData,
      options: {
        responsive: this.options.responsive,
        maintainAspectRatio: false,
        animation: this.options.animations ? this.animationConfig : false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            callbacks: {
              label: (context) => {
                return `強度: ${context.parsed.y.toFixed(1)}%`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 100,
            ticks: {
              callback: (value) => value + '%',
              font: {
                family: "'Inter', sans-serif",
                size: 11
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            ticks: {
              font: {
                family: "'Inter', sans-serif",
                size: 12,
                weight: '500'
              }
            },
            grid: {
              display: false
            }
          }
        }
      }
    };
    
    const balanceChart = new Chart(ctx, config);
    this.charts.set('balance', balanceChart);
  }
  
  /**
   * 調和度ゲージの作成
   */
  async createHarmonyGauge(tripleOSData) {
    const canvas = document.getElementById('harmony-gauge');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const bunenjin = tripleOSData.bunenjin || {};
    
    const harmonyValue = (bunenjin.harmony || 0.5) * 100;
    const integrationValue = (bunenjin.integration || 0.5) * 100;
    const flexibilityValue = (bunenjin.flexibility || 0.5) * 100;
    const authenticityValue = (bunenjin.authenticity || 0.5) * 100;
    
    // ゲージチャートの作成（ドーナツチャートを使用）
    const gaugeData = {
      datasets: [{
        data: [harmonyValue, 100 - harmonyValue],
        backgroundColor: [
          this.colorPalette.harmony.primary,
          'rgba(0, 0, 0, 0.1)'
        ],
        borderWidth: 0,
        cutout: '70%',
        rotation: -90,
        circumference: 180
      }]
    };
    
    const config = {
      type: 'doughnut',
      data: gaugeData,
      options: {
        responsive: this.options.responsive,
        maintainAspectRatio: false,
        animation: this.options.animations ? {
          animateRotate: true,
          duration: 1500
        } : false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        }
      },
      plugins: [{
        id: 'centerText',
        beforeDraw: (chart) => {
          const { width, height, ctx } = chart;
          ctx.restore();
          
          const fontSize = (height / 114).toFixed(2);
          ctx.font = `bold ${fontSize}em 'Inter', sans-serif`;
          ctx.textBaseline = 'middle';
          ctx.fillStyle = this.colorPalette.harmony.primary;
          
          const text = `${harmonyValue.toFixed(0)}%`;
          const textX = Math.round((width - ctx.measureText(text).width) / 2);
          const textY = height / 1.4;
          
          ctx.fillText(text, textX, textY);
          
          // 「調和度」ラベル
          ctx.font = `${(fontSize * 0.6).toFixed(2)}em 'Inter', sans-serif`;
          ctx.fillStyle = '#666';
          const labelText = '調和度';
          const labelX = Math.round((width - ctx.measureText(labelText).width) / 2);
          const labelY = textY + 20;
          ctx.fillText(labelText, labelX, labelY);
          
          ctx.save();
        }
      }]
    };
    
    const gaugeChart = new Chart(ctx, config);
    this.charts.set('gauge', gaugeChart);
    
    // メトリクス値の更新
    this.updateMetricsDisplay(integrationValue, flexibilityValue, authenticityValue);
  }
  
  /**
   * I Ching可視化の作成
   */
  async createIChingVisualization(ichingData) {
    const section = this.container.querySelector('.iching-integration');
    if (!section || !ichingData.enabled) return;
    
    section.style.display = 'block';
    
    const canvas = document.getElementById('iching-hexagram-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const hexagrams = ichingData.hexagrams || {};
    
    // 卦の強度を表示するバーチャート
    const hexagramData = {
      labels: [
        hexagrams.engine?.name || 'Engine卦',
        hexagrams.interface?.name || 'Interface卦',
        hexagrams.safeMode?.name || 'SafeMode卦'
      ],
      datasets: [{
        label: '卦の影響度',
        data: [
          this.calculateHexagramStrength(hexagrams.engine),
          this.calculateHexagramStrength(hexagrams.interface),
          this.calculateHexagramStrength(hexagrams.safeMode)
        ],
        backgroundColor: [
          this.colorPalette.engine.primary + '80',
          this.colorPalette.interface.primary + '80',
          this.colorPalette.safeMode.primary + '80'
        ],
        borderColor: [
          this.colorPalette.engine.primary,
          this.colorPalette.interface.primary,
          this.colorPalette.safeMode.primary
        ],
        borderWidth: 2
      }]
    };
    
    const config = {
      type: 'polarArea',
      data: hexagramData,
      options: {
        responsive: this.options.responsive,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.label}: ${context.parsed.r.toFixed(1)}%`;
              }
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            min: 0,
            max: 100
          }
        }
      }
    };
    
    const ichingChart = new Chart(ctx, config);
    this.charts.set('iching', ichingChart);
  }
  
  /**
   * 序卦伝関係性可視化の作成
   */
  async createSequenceVisualization(sequenceData) {
    const section = this.container.querySelector('.sequence-network');
    if (!section) return;
    
    section.style.display = 'block';
    
    const canvas = document.getElementById('sequence-network-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // 関係性強度を表示するネットワーク風チャート
    const relationshipData = sequenceData.pairRelations || {};
    
    const networkData = {
      datasets: [{
        label: 'OS関係性',
        data: [
          {
            x: 30, y: 80,
            r: (relationshipData.engineInterface?.strength || 0.5) * 20,
            label: 'Engine-Interface',
            backgroundColor: this.colorPalette.engine.primary + '80'
          },
          {
            x: 80, y: 80,
            r: (relationshipData.engineSafeMode?.strength || 0.5) * 20,
            label: 'Engine-SafeMode',
            backgroundColor: this.colorPalette.interface.primary + '80'
          },
          {
            x: 55, y: 30,
            r: (relationshipData.interfaceSafeMode?.strength || 0.5) * 20,
            label: 'Interface-SafeMode',
            backgroundColor: this.colorPalette.safeMode.primary + '80'
          }
        ]
      }]
    };
    
    const config = {
      type: 'bubble',
      data: networkData,
      options: {
        responsive: this.options.responsive,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const point = context.parsed;
                return `${context.raw.label}: 強度 ${((point.r || 0) / 20 * 100).toFixed(0)}%`;
              }
            }
          }
        },
        scales: {
          x: {
            min: 0,
            max: 100,
            display: false
          },
          y: {
            min: 0,
            max: 100,
            display: false
          }
        }
      }
    };
    
    const networkChart = new Chart(ctx, config);
    this.charts.set('network', networkChart);
  }
  
  /**
   * インタラクティブ要素の追加
   */
  addInteractiveElements() {
    // タブ切り替え機能
    const tabButtons = this.container.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        this.switchTab(tabName);
      });
    });
    
    // 初期タブの表示
    this.switchTab('engine');
  }
  
  /**
   * タブ切り替え
   */
  switchTab(tabName) {
    // アクティブボタンの更新
    const tabButtons = this.container.querySelectorAll('.tab-button');
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // タブコンテンツの更新
    const tabContent = this.container.querySelector('#tab-content');
    if (tabContent) {
      tabContent.innerHTML = this.generateTabContent(tabName);
    }
  }
  
  /**
   * タブコンテンツの生成
   */
  generateTabContent(tabName) {
    const osData = this.getOSData(tabName);
    
    return `
      <div class="os-detail-content">
        <div class="os-strength-bar">
          <div class="strength-label">${osData.name} 強度</div>
          <div class="strength-progress">
            <div class="strength-fill" 
                 style="width: ${(osData.strength * 100).toFixed(0)}%; 
                        background-color: ${osData.color}">
            </div>
          </div>
          <div class="strength-value">${(osData.strength * 100).toFixed(0)}%</div>
        </div>
        
        <div class="os-characteristics">
          <h4>主要特性</h4>
          <ul class="trait-list">
            ${osData.traits.map(trait => `<li>${trait}</li>`).join('')}
          </ul>
        </div>
        
        <div class="os-keywords">
          <h4>キーワード</h4>
          <div class="keyword-tags">
            ${osData.keywords.map(keyword => 
              `<span class="keyword-tag" style="border-color: ${osData.color}">${keyword}</span>`
            ).join('')}
          </div>
        </div>
        
        <div class="os-guidance">
          <h4>活用ガイダンス</h4>
          <p>${osData.guidance}</p>
        </div>
      </div>
    `;
  }
  
  /**
   * OSデータの取得
   */
  getOSData(osType) {
    const osMap = {
      engine: {
        name: 'Engine OS',
        color: this.colorPalette.engine.primary,
        strength: 0.75,
        traits: ['強固な価値観', '一貫した判断基準', '内なる動機'],
        keywords: ['価値観', '信念', '本質', '核心'],
        guidance: 'あなたの核となる価値観を大切にし、それに基づいて行動することで真の自分らしさを発揮できます。'
      },
      interface: {
        name: 'Interface OS',
        color: this.colorPalette.interface.primary,
        strength: 0.65,
        traits: ['適応的表現', '社会的調和', '関係性重視'],
        keywords: ['社会性', '表現', '適応', '関係'],
        guidance: '他者との関係を大切にし、状況に応じて適切に自分を表現することで良好な人間関係を築けます。'
      },
      safemode: {
        name: 'SafeMode OS',
        color: this.colorPalette.safeMode.primary,
        strength: 0.55,
        traits: ['慎重な防御', '安全確保', 'リスク回避'],
        keywords: ['防御', '安全', '保護', '警戒'],
        guidance: '適切な自己保護により、安心して挑戦し成長することができます。バランスが重要です。'
      }
    };
    
    return osMap[osType] || osMap.engine;
  }
  
  /**
   * メトリクス表示の更新
   */
  updateMetricsDisplay(integration, flexibility, authenticity) {
    const integrationEl = document.getElementById('integration-value');
    const flexibilityEl = document.getElementById('flexibility-value');
    const authenticityEl = document.getElementById('authenticity-value');
    
    if (integrationEl) integrationEl.textContent = `${integration.toFixed(0)}%`;
    if (flexibilityEl) flexibilityEl.textContent = `${flexibility.toFixed(0)}%`;
    if (authenticityEl) authenticityEl.textContent = `${authenticity.toFixed(0)}%`;
  }
  
  /**
   * 卦の強度計算
   */
  calculateHexagramStrength(hexagram) {
    if (!hexagram) return 50;
    
    // 卦IDに基づく簡略化された強度計算
    const baseStrength = ((hexagram.id || 32) / 64) * 100;
    return Math.max(20, Math.min(100, baseStrength));
  }
  
  /**
   * 動的スタイルの追加
   */
  addDynamicStyles() {
    const styleId = 'triple-os-visualization-styles';
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .triple-os-visualization {
        font-family: 'Inter', sans-serif;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }
      
      .visualization-section {
        background: white;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }
      
      .section-title {
        font-size: 1.2em;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 15px;
        text-align: center;
      }
      
      .chart-container {
        position: relative;
        height: 300px;
        margin: 20px 0;
      }
      
      .harmony-display {
        display: flex;
        align-items: center;
        gap: 30px;
      }
      
      .harmony-metrics {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      
      .metric {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        background: #f7fafc;
        border-radius: 6px;
        border-left: 4px solid ${this.colorPalette.harmony.primary};
      }
      
      .metric .label {
        font-weight: 500;
        color: #4a5568;
      }
      
      .metric .value {
        font-weight: 600;
        color: #2d3748;
        font-size: 1.1em;
      }
      
      .data-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        border-bottom: 2px solid #e2e8f0;
      }
      
      .tab-button {
        padding: 12px 20px;
        border: none;
        background: transparent;
        color: #718096;
        font-weight: 500;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.3s ease;
      }
      
      .tab-button.active {
        color: #2d3748;
        border-bottom-color: ${this.colorPalette.harmony.primary};
      }
      
      .tab-button:hover {
        color: #4a5568;
      }
      
      .os-detail-content {
        padding: 20px 0;
      }
      
      .os-strength-bar {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 20px;
      }
      
      .strength-label {
        font-weight: 500;
        min-width: 120px;
      }
      
      .strength-progress {
        flex: 1;
        height: 8px;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
      }
      
      .strength-fill {
        height: 100%;
        transition: width 0.8s ease;
      }
      
      .strength-value {
        font-weight: 600;
        min-width: 40px;
        text-align: right;
      }
      
      .os-characteristics {
        margin-bottom: 20px;
      }
      
      .trait-list {
        list-style: none;
        padding: 0;
        margin: 10px 0;
      }
      
      .trait-list li {
        padding: 8px 0;
        border-bottom: 1px solid #e2e8f0;
        color: #4a5568;
      }
      
      .trait-list li::before {
        content: '▶';
        color: ${this.colorPalette.harmony.primary};
        margin-right: 8px;
      }
      
      .keyword-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 10px 0;
      }
      
      .keyword-tag {
        padding: 6px 12px;
        background: #f7fafc;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        font-size: 0.9em;
        color: #4a5568;
      }
      
      .os-guidance {
        background: #f0fff4;
        border: 1px solid #9ae6b4;
        border-radius: 6px;
        padding: 15px;
        color: #276749;
        line-height: 1.6;
      }
      
      .os-guidance h4 {
        margin: 0 0 10px 0;
        color: #2f855a;
      }
      
      /* レスポンシブ対応 */
      @media (max-width: 768px) {
        .triple-os-visualization {
          padding: 15px;
        }
        
        .harmony-display {
          flex-direction: column;
          gap: 20px;
        }
        
        .data-tabs {
          flex-wrap: wrap;
        }
        
        .tab-button {
          padding: 10px 15px;
          font-size: 0.9em;
        }
        
        .os-strength-bar {
          flex-direction: column;
          align-items: stretch;
          gap: 10px;
        }
        
        .strength-label {
          min-width: auto;
        }
        
        .strength-value {
          text-align: left;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  /**
   * フォールバック可視化の作成
   */
  createFallbackVisualization(tripleOSData) {
    console.warn("⚠️ Creating fallback visualization");
    
    this.container.innerHTML = `
      <div class="fallback-visualization">
        <h3>Triple OS分析結果</h3>
        <div class="simple-os-display">
          <div class="os-item">
            <h4>Engine OS</h4>
            <div class="simple-bar" style="background: ${this.colorPalette.engine.primary}; width: 75%"></div>
          </div>
          <div class="os-item">
            <h4>Interface OS</h4>
            <div class="simple-bar" style="background: ${this.colorPalette.interface.primary}; width: 65%"></div>
          </div>
          <div class="os-item">
            <h4>SafeMode OS</h4>
            <div class="simple-bar" style="background: ${this.colorPalette.safeMode.primary}; width: 55%"></div>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * チャートの破棄
   */
  destroy() {
    this.charts.forEach(chart => {
      chart.destroy();
    });
    this.charts.clear();
  }
  
  /**
   * 統計情報の取得
   */
  getStats() {
    return {
      chartsCreated: this.charts.size,
      theme: this.options.theme,
      responsive: this.options.responsive,
      animations: this.options.animations
    };
  }
}

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.TripleOSVisualization = TripleOSVisualization;
  console.log('✅ TripleOSVisualization loaded with Chart.js 3.9.1 integration');
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TripleOSVisualization;
}