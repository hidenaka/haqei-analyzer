// ActionBridgeView.js - Phase 5.3実践行動ブリッジUI
// HaQei Analyzer - Phase 5.3: 実践行動ブリッジ強化

class ActionBridgeView {
  constructor(containerId) {
    this.containerId = containerId;
    this.actionBridge = null;
    this.experimentTracker = null;
    this.behaviorUtils = null;
    this.currentActionPackage = null;
    this.activeExperiments = [];
    
    // UI状態管理
    this.uiState = {
      currentView: 'overview', // overview, experiments, progress, insights
      selectedAction: null,
      experimentInProgress: false,
      showBunenjinGuidance: true
    };
    
    this.initializeComponents();
    console.log("🌉 ActionBridgeView initialized");
  }
  
  /**
   * コンポーネントの初期化
   */
  initializeComponents() {
    // 依存コンポーネントの初期化
    if (typeof StorageManager !== 'undefined' && typeof StatisticalEngine !== 'undefined') {
      const storageManager = new StorageManager();
      const statisticalEngine = new StatisticalEngine();
      
      this.actionBridge = new ActionBridgeEngine(storageManager, statisticalEngine);
      this.experimentTracker = new ExperimentTracker(storageManager, statisticalEngine);
      this.behaviorUtils = new BehaviorChangeUtils(storageManager, statisticalEngine);
      
      console.log("✅ Phase 5.3 components initialized successfully");
    } else {
      console.error("❌ Required dependencies not available");
    }
  }
  
  /**
   * メインビューのレンダリング
   * @param {Object} osAnalysisData - OS分析データ
   */
  render(osAnalysisData) {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Container not found: ${this.containerId}`);
      return;
    }
    
    // Action Packageの生成
    if (this.actionBridge && osAnalysisData) {
      this.currentActionPackage = this.actionBridge.generateOptimizedActions(osAnalysisData);
    }
    
    container.innerHTML = this.generateMainHTML();
    this.attachEventListeners();
    this.renderCurrentView();
    
    console.log("🎯 ActionBridgeView rendered");
  }
  
  /**
   * メインHTMLの生成
   * @returns {string} HTML文字列
   */
  generateMainHTML() {
    return `
      <div class="action-bridge-container">
        <!-- ヘッダー -->
        <div class="action-bridge-header">
          <h2 class="section-title">
            🌉 実践行動ブリッジ
            <span class="bunenjin-badge">分人思想統合</span>
          </h2>
          <p class="section-description">
            あなたの複数の分人が協力して、実践的な行動変容を支援します
          </p>
        </div>
        
        <!-- ナビゲーション -->
        <nav class="action-bridge-nav">
          <button class="nav-btn active" data-view="overview">概要</button>
          <button class="nav-btn" data-view="experiments">実験</button>
          <button class="nav-btn" data-view="progress">進捗</button>
          <button class="nav-btn" data-view="insights">洞察</button>
        </nav>
        
        <!-- メインコンテンツ -->
        <div class="action-bridge-content">
          <div id="action-bridge-view-content">
            <!-- 動的コンテンツがここに挿入される -->
          </div>
        </div>
        
        <!-- bunenjin哲学ガイダンス -->
        <div class="bunenjin-guidance ${this.uiState.showBunenjinGuidance ? '' : 'hidden'}">
          <div class="guidance-header">
            <h4>🎭 bunenjin哲学ガイダンス</h4>
            <button class="close-guidance" title="ガイダンスを閉じる">×</button>
          </div>
          <div class="guidance-content">
            <p>このシステムは「本当の自分」を探すのではなく、あなたの複数の分人が状況に応じて最適に表現されることを支援します。</p>
            <p>統一された理想像を追求するのではなく、多様で豊かな分人の協調体系を育成していきましょう。</p>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * イベントリスナーの設定
   */
  attachEventListeners() {
    const container = document.getElementById(this.containerId);
    
    // ナビゲーションボタン
    container.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.target.dataset.view;
        this.switchView(view);
      });
    });
    
    // bunenjinガイダンス閉じるボタン
    const closeBtn = container.querySelector('.close-guidance');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.uiState.showBunenjinGuidance = false;
        container.querySelector('.bunenjin-guidance').classList.add('hidden');
      });
    }
  }
  
  /**
   * ビューの切り替え
   * @param {string} view - 切り替え先ビュー
   */
  switchView(view) {
    this.uiState.currentView = view;
    
    // ナビゲーションボタンのアクティブ状態更新
    const container = document.getElementById(this.containerId);
    container.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    this.renderCurrentView();
  }
  
  /**
   * 現在のビューをレンダリング
   */
  renderCurrentView() {
    const contentContainer = document.getElementById('action-bridge-view-content');
    if (!contentContainer) return;
    
    switch (this.uiState.currentView) {
      case 'overview':
        contentContainer.innerHTML = this.renderOverviewView();
        this.attachOverviewEventListeners();
        break;
      case 'experiments':
        contentContainer.innerHTML = this.renderExperimentsView();
        this.attachExperimentsEventListeners();
        break;
      case 'progress':
        contentContainer.innerHTML = this.renderProgressView();
        this.attachProgressEventListeners();
        break;
      case 'insights':
        contentContainer.innerHTML = this.renderInsightsView();
        this.attachInsightsEventListeners();
        break;
    }
  }
  
  /**
   * 概要ビューのレンダリング
   * @returns {string} HTML文字列
   */
  renderOverviewView() {
    if (!this.currentActionPackage) {
      return '<p class="loading-message">行動パッケージを生成中...</p>';
    }
    
    const immediate = this.currentActionPackage.immediate || [];
    const shortTerm = this.currentActionPackage.shortTerm || [];
    
    return `
      <div class="overview-section">
        <div class="stats-cards">
          <div class="stat-card immediate">
            <div class="stat-icon">⚡</div>
            <div class="stat-content">
              <h3>${immediate.length}</h3>
              <p>即座実行可能な行動</p>
            </div>
          </div>
          <div class="stat-card experiments">
            <div class="stat-icon">🧪</div>
            <div class="stat-content">
              <h3>${shortTerm.length}</h3>
              <p>短期実験プログラム</p>
            </div>
          </div>
          <div class="stat-card active">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <h3>${this.activeExperiments.length}</h3>
              <p>進行中の実験</p>
            </div>
          </div>
        </div>
        
        <div class="immediate-actions">
          <h3>🚀 今すぐできる行動</h3>
          <div class="actions-grid">
            ${immediate.slice(0, 3).map(action => this.renderActionCard(action)).join('')}
          </div>
        </div>
        
        <div class="quick-start">
          <h3>✨ クイックスタート</h3>
          <p>最初の一歩として、最も簡単な行動から始めてみましょう。</p>
          <button class="btn-primary start-first-action">
            最初の行動を開始
          </button>
        </div>
      </div>
    `;
  }
  
  /**
   * 実験ビューのレンダリング
   * @returns {string} HTML文字列
   */
  renderExperimentsView() {
    if (!this.experimentTracker) {
      return '<p class="error-message">実験トラッカーが利用できません</p>';
    }
    
    const userExperiments = this.experimentTracker.getUserExperiments('current_user');
    const suggestions = this.experimentTracker.suggestNextExperiments('current_user', this.currentActionPackage);
    
    return `
      <div class="experiments-section">
        <div class="experiment-controls">
          <h3>🧪 実験管理</h3>
          <button class="btn-secondary create-experiment">新しい実験を作成</button>
        </div>
        
        <div class="experiment-suggestions">
          <h4>💡 推奨実験</h4>
          <div class="suggestions-grid">
            ${suggestions.map(suggestion => this.renderSuggestionCard(suggestion)).join('')}
          </div>
        </div>
        
        <div class="experiment-history">
          <h4>📊 実験履歴</h4>
          <div class="experiments-list">
            ${userExperiments.slice(0, 5).map(exp => this.renderExperimentCard(exp)).join('')}
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * 進捗ビューのレンダリング
   * @returns {string} HTML文字列
   */
  renderProgressView() {
    if (!this.experimentTracker) {
      return '<p class="error-message">進捗データが利用できません</p>';
    }
    
    return `
      <div class="progress-section">
        <div class="progress-header">
          <h3>📈 成長トラッキング</h3>
          <p>あなたの分人の成長を可視化します</p>
        </div>
        
        <div class="growth-visualization">
          <canvas id="growth-chart" width="400" height="200"></canvas>
        </div>
        
        <div class="progress-metrics">
          <div class="metric-card">
            <h4>Engine OS 成長</h4>
            <div class="progress-bar">
              <div class="progress-fill engine" style="width: 65%"></div>
            </div>
            <p>65% - 内なる価値観の明確化が進んでいます</p>
          </div>
          
          <div class="metric-card">
            <h4>Interface OS 成長</h4>
            <div class="progress-bar">
              <div class="progress-fill interface" style="width: 48%"></div>
            </div>
            <p>48% - 関係性構築スキルを育成中</p>
          </div>
          
          <div class="metric-card">
            <h4>SafeMode OS 成長</h4>
            <div class="progress-bar">
              <div class="progress-fill safemode" style="width: 72%"></div>
            </div>
            <p>72% - 安全確保システムが安定化</p>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * 洞察ビューのレンダリング
   * @returns {string} HTML文字列
   */
  renderInsightsView() {
    if (!this.behaviorUtils) {
      return '<p class="error-message">洞察データが利用できません</p>';
    }
    
    return `
      <div class="insights-section">
        <div class="insights-header">
          <h3>🔍 bunenjin洞察</h3>
          <p>あなたの分人システムから得られた洞察</p>
        </div>
        
        <div class="insight-cards">
          <div class="insight-card primary">
            <div class="insight-icon">🎭</div>
            <h4>分人バランス分析</h4>
            <p>あなたの Engine OS 分人が最も活発に活動しており、Interface OS 分人との連携が今後の成長のカギとなります。</p>
            <div class="bunenjin-note">
              これは個性の偏りではなく、現在の生活状況への自然な適応です。
            </div>
          </div>
          
          <div class="insight-card">
            <div class="insight-icon">🌱</div>
            <h4>成長パターン</h4>
            <p>micro-experiment からの段階的な成長パターンが確立されています。継続することで大きな変化が期待できます。</p>
          </div>
          
          <div class="insight-card">
            <div class="insight-icon">🔄</div>
            <h4>適応戦略</h4>
            <p>状況に応じた分人の使い分けが向上しています。特に仕事環境での適応力が顕著に改善されています。</p>
          </div>
        </div>
        
        <div class="recommendations">
          <h4>🎯 個別推奨事項</h4>
          <ul class="recommendation-list">
            <li>Interface OS 分人の育成のため、週2回の新しい人との会話を継続</li>
            <li>SafeMode OS 分人の知恵を活かし、リスク評価を他の分人と共有</li>
            <li>分人間の協力関係をさらに強化するため、内的対話の時間を確保</li>
          </ul>
        </div>
      </div>
    `;
  }
  
  /**
   * 行動カードのレンダリング
   * @param {Object} action - 行動データ
   * @returns {string} HTML文字列
   */
  renderActionCard(action) {
    return `
      <div class="action-card" data-action-id="${action.id}">
        <div class="action-header">
          <h4>${action.title}</h4>
          <span class="difficulty-badge ${action.difficulty}">${action.difficulty}</span>
        </div>
        <p class="action-description">${action.description}</p>
        <div class="action-details">
          <span class="time-estimate">⏱️ ${action.timeMinutes}分</span>
          <span class="outcome">🎯 ${action.expectedOutcome}</span>
        </div>
        ${action.bunenjinNote ? `
          <div class="bunenjin-note">
            <small>💭 ${action.bunenjinNote}</small>
          </div>
        ` : ''}
        <button class="btn-primary start-action" data-action-id="${action.id}">
          開始する
        </button>
      </div>
    `;
  }
  
  /**
   * 提案カードのレンダリング
   * @param {Object} suggestion - 提案データ
   * @returns {string} HTML文字列
   */
  renderSuggestionCard(suggestion) {
    return `
      <div class="suggestion-card">
        <div class="suggestion-header">
          <h4>${suggestion.title}</h4>
          <span class="success-rate">${Math.round(suggestion.estimatedSuccess * 100)}% 成功率</span>
        </div>
        <p>${suggestion.description}</p>
        ${suggestion.bunenjinNote ? `
          <div class="bunenjin-note">
            <small>${suggestion.bunenjinNote}</small>
          </div>
        ` : ''}
        <button class="btn-secondary start-suggestion" data-suggestion="${JSON.stringify(suggestion).replace(/"/g, '&quot;')}">
          実験を開始
        </button>
      </div>
    `;
  }
  
  /**
   * 実験カードのレンダリング
   * @param {Object} experiment - 実験データ
   * @returns {string} HTML文字列
   */
  renderExperimentCard(experiment) {
    const statusIcon = {
      'active': '🔄',
      'completed': '✅',
      'planned': '📅',
      'abandoned': '⏸️'
    };
    
    return `
      <div class="experiment-card ${experiment.status}">
        <div class="experiment-header">
          <span class="status-icon">${statusIcon[experiment.status] || '❓'}</span>
          <h4>${experiment.title}</h4>
          <span class="experiment-date">${new Date(experiment.startDate).toLocaleDateString('ja-JP')}</span>
        </div>
        <p>${experiment.description}</p>
        <div class="experiment-actions">
          <button class="btn-small view-details" data-experiment-id="${experiment.id}">詳細</button>
          ${experiment.status === 'active' ? 
            `<button class="btn-small record-results" data-experiment-id="${experiment.id}">結果記録</button>` : 
            ''
          }
        </div>
      </div>
    `;
  }
  
  /**
   * 概要ビューのイベントリスナー
   */
  attachOverviewEventListeners() {
    const container = document.getElementById(this.containerId);
    
    // 最初の行動開始ボタン
    const startBtn = container.querySelector('.start-first-action');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startFirstAction();
      });
    }
    
    // 行動開始ボタン
    container.querySelectorAll('.start-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const actionId = e.target.dataset.actionId;
        this.startAction(actionId);
      });
    });
  }
  
  /**
   * 実験ビューのイベントリスナー
   */
  attachExperimentsEventListeners() {
    const container = document.getElementById(this.containerId);
    
    // 提案開始ボタン
    container.querySelectorAll('.start-suggestion').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const suggestionData = JSON.parse(e.target.dataset.suggestion.replace(/&quot;/g, '"'));
        this.startSuggestion(suggestionData);
      });
    });
    
    // 実験詳細ボタン
    container.querySelectorAll('.view-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const experimentId = e.target.dataset.experimentId;
        this.viewExperimentDetails(experimentId);
      });
    });
  }
  
  /**
   * 進捗ビューのイベントリスナー
   */
  attachProgressEventListeners() {
    // Chart.jsグラフの描画
    this.renderGrowthChart();
  }
  
  /**
   * 洞察ビューのイベントリスナー
   */
  attachInsightsEventListeners() {
    // 特別なイベントリスナーは現在不要
  }
  
  /**
   * 最初の行動の開始
   */
  startFirstAction() {
    if (!this.currentActionPackage || !this.currentActionPackage.immediate.length) {
      alert('利用可能な行動がありません');
      return;
    }
    
    const firstAction = this.currentActionPackage.immediate[0];
    this.startAction(firstAction.id);
  }
  
  /**
   * 行動の開始
   * @param {string} actionId - 行動ID
   */
  startAction(actionId) {
    const action = this.currentActionPackage.immediate.find(a => a.id === actionId);
    if (!action) {
      console.error('Action not found:', actionId);
      return;
    }
    
    // 実験としてトラッキング開始
    if (this.experimentTracker) {
      const experimentId = this.experimentTracker.trackExperiment({
        title: action.title,
        description: action.description,
        difficulty: action.difficulty,
        osTarget: action.osTarget || 'general',
        expectedDuration: `${action.timeMinutes}分`,
        metadata: { actionId, source: 'immediate_action' }
      });
      
      console.log(`🧪 Action started as experiment: ${experimentId}`);
      alert(`行動「${action.title}」を開始しました！\n実験として記録されます。`);
    }
  }
  
  /**
   * 提案の開始
   * @param {Object} suggestion - 提案データ
   */
  startSuggestion(suggestion) {
    if (this.experimentTracker) {
      const experimentId = this.experimentTracker.trackExperiment({
        title: suggestion.title,
        description: suggestion.description,
        difficulty: suggestion.difficulty || 'micro',
        osTarget: 'general',
        expectedDuration: '1週間',
        metadata: { source: 'suggestion', suggestionType: suggestion.type }
      });
      
      console.log(`🧪 Suggestion started as experiment: ${experimentId}`);
      alert(`実験「${suggestion.title}」を開始しました！`);
    }
  }
  
  /**
   * 実験詳細の表示
   * @param {string} experimentId - 実験ID
   */
  viewExperimentDetails(experimentId) {
    // 詳細モーダルの表示（簡略化）
    alert(`実験詳細: ${experimentId}\n（詳細モーダルは今後実装予定）`);
  }
  
  /**
   * 成長チャートの描画
   */
  renderGrowthChart() {
    const canvas = document.getElementById('growth-chart');
    if (!canvas || typeof Chart === 'undefined') {
      console.warn('Chart.js or canvas not available');
      return;
    }
    
    // サンプルデータでチャート描画
    new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: Array.from({length: 30}, (_, i) => `${i+1}日`),
        datasets: [
          {
            label: 'Engine OS',
            data: Array.from({length: 30}, () => Math.random() * 0.8 + 0.2),
            borderColor: '#FF6B6B',
            backgroundColor: '#FF6B6B20',
            tension: 0.4
          },
          {
            label: 'Interface OS',
            data: Array.from({length: 30}, () => Math.random() * 0.8 + 0.2),
            borderColor: '#4ECDC4',
            backgroundColor: '#4ECDC420',
            tension: 0.4
          },
          {
            label: 'SafeMode OS',
            data: Array.from({length: 30}, () => Math.random() * 0.8 + 0.2),
            borderColor: '#45B7D1',
            backgroundColor: '#45B7D120',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: '分人成長トラッキング'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 1,
            ticks: {
              callback: function(value) {
                return (value * 100).toFixed(0) + '%';
              }
            }
          }
        }
      }
    });
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== "undefined") {
  window.ActionBridgeView = ActionBridgeView;
}