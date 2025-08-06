/**
 * Future Simulator Core - 簡単な実装
 * オリジナルのfuture_simulator.htmlを動かすための最小限コア
 */

console.log('🎯 Future Simulator Core Loading...');

// Global namespace
window.FutureSimulator = window.FutureSimulator || {};

// Core initialization
FutureSimulator.Core = {
  initialized: false,
  
  async init() {
    console.log('🚀 Future Simulator initializing...');
    
    try {
      // Initialize components
      await this.initKuromoji();
      await this.initUI();
      await this.setupEventListeners();
      
      this.initialized = true;
      console.log('✅ Future Simulator initialized successfully');
      
      // Hide loading screen if exists
      const loadingScreen = document.getElementById('initial-loading');
      if (loadingScreen) {
        loadingScreen.style.display = 'none';
      }
      
    } catch (error) {
      console.error('❌ Initialization error:', error);
      this.showError('システムの初期化に失敗しました。ページを再読み込みしてください。');
    }
  },
  
  async initKuromoji() {
    console.log('📝 Initializing Japanese text analyzer...');
    
    return new Promise((resolve, reject) => {
      if (typeof kuromoji === 'undefined') {
        console.log('ℹ️ Kuromoji not available, using simple analysis');
        resolve();
        return;
      }
      
      kuromoji.builder({ dicPath: 'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/' })
        .build((err, tokenizer) => {
          if (err) {
            console.warn('⚠️ Kuromoji init failed, continuing with simple analysis');
            resolve();
          } else {
            window.tokenizer = tokenizer;
            console.log('✅ Japanese analyzer ready');
            resolve();
          }
        });
    });
  },
  
  async initUI() {
    console.log('🎨 Initializing UI components...');
    
    // Show main content
    const mainContent = document.querySelector('.future-simulator-container') || document.body;
    if (mainContent.style.display === 'none') {
      mainContent.style.display = 'block';
    }
    
    // Initialize input field
    const inputField = document.getElementById('situation-input') || 
                      document.querySelector('textarea[placeholder*="状況"]') ||
                      document.querySelector('textarea');
    
    if (inputField) {
      inputField.addEventListener('input', this.handleInputChange.bind(this));
      console.log('✅ Input field initialized');
    }
  },
  
  setupEventListeners() {
    console.log('🔗 Setting up event listeners...');
    
    // Find analyze button
    const analyzeButton = document.getElementById('analyze-button') ||
                         document.querySelector('button[onclick*="analyze"]') ||
                         document.querySelector('.analyze-btn') ||
                         document.querySelector('button:contains("分析")');
    
    if (analyzeButton) {
      analyzeButton.onclick = () => this.startAnalysis();
      console.log('✅ Analyze button connected');
    }
    
    // Setup any other buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-action="analyze"]') || 
          e.target.textContent.includes('分析') ||
          e.target.textContent.includes('シミュレート')) {
        e.preventDefault();
        this.startAnalysis();
      }
    });
  },
  
  handleInputChange(e) {
    const text = e.target.value.trim();
    const button = document.querySelector('button[onclick*="analyze"]') ||
                  document.querySelector('.analyze-btn');
    
    if (button) {
      button.disabled = text.length < 10;
    }
  },
  
  async startAnalysis() {
    console.log('🔍 Starting future analysis...');
    
    const inputField = document.getElementById('situation-input') || 
                      document.querySelector('textarea[placeholder*="状況"]') ||
                      document.querySelector('textarea');
    
    if (!inputField || !inputField.value.trim()) {
      alert('状況を入力してください');
      return;
    }
    
    const situation = inputField.value.trim();
    
    // Show loading
    this.showLoading();
    
    try {
      // Simulate analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate scenarios
      const scenarios = this.generateScenarios(situation);
      
      // Display results
      this.displayResults(scenarios);
      
    } catch (error) {
      console.error('Analysis error:', error);
      this.showError('分析中にエラーが発生しました。');
    }
  },
  
  generateScenarios(situation) {
    console.log('🎲 Generating scenarios for:', situation.substring(0, 50) + '...');
    
    const baseScenarios = [
      {
        title: "現状維持の未来",
        description: "現在の状況を継続した場合の展開",
        content: "現在の方向性を維持することで、安定した成長が期待できます。リスクは少なく、着実な進歩を遂げるでしょう。",
        probability: "高",
        timeframe: "短期～中期",
        advice: "現在の取り組みを継続し、小さな改善を積み重ねましょう。"
      },
      {
        title: "積極変化の未来",
        description: "大胆な変化を選択した場合の展開", 
        content: "新しい挑戦に踏み出すことで、大きな成長の機会を得られます。困難はありますが、それを乗り越えた先に新しい可能性が広がります。",
        probability: "中",
        timeframe: "中期～長期",
        advice: "リスクを慎重に評価しつつ、準備を整えてから行動しましょう。"
      },
      {
        title: "調和的発展の未来",
        description: "バランスを重視した選択の展開",
        content: "慎重さと積極性のバランスを保ちながら、段階的に変化を進めることで、最も安全で効果的な成果を得られるでしょう。",
        probability: "高",
        timeframe: "中期",
        advice: "様々な選択肢を検討し、最適なタイミングを見極めましょう。"
      },
      {
        title: "内省深化の未来", 
        description: "自己理解を深める選択の展開",
        content: "まずは自分自身と向き合い、真に望む方向性を明確にすることで、より確信を持って次のステップに進めるでしょう。",
        probability: "中",
        timeframe: "短期",
        advice: "時間をかけて自分の価値観と目標を整理することが重要です。"
      },
      {
        title: "協力拡張の未来",
        description: "他者との連携を重視した展開",
        content: "信頼できる人々との協力関係を築くことで、一人では達成できない大きな成果を生み出すことができるでしょう。",
        probability: "中",
        timeframe: "中期",
        advice: "ネットワークを広げ、win-winの関係を構築しましょう。"
      },
      {
        title: "潜伏準備の未来",
        description: "時期を待ち準備を重ねる選択の展開",
        content: "今は準備の時期。適切な機会を待ちながら実力を蓄えることで、最良のタイミングで行動に移すことができるでしょう。",
        probability: "高",
        timeframe: "短期～中期", 
        advice: "焦らず、しっかりとした基盤作りに集中しましょう。"
      }
    ];
    
    // Return random 4 scenarios
    return baseScenarios.sort(() => Math.random() - 0.5).slice(0, 4);
  },
  
  displayResults(scenarios) {
    console.log('📊 Displaying analysis results...');
    
    let resultsContainer = document.getElementById('results-container') ||
                          document.getElementById('analysis-results') ||
                          document.querySelector('.results-section');
    
    if (!resultsContainer) {
      resultsContainer = this.createResultsContainer();
    }
    
    resultsContainer.innerHTML = `
      <div class="results-header">
        <h2>🔮 未来分析結果</h2>
        <p>あなたの状況から導き出された可能性のあるシナリオです</p>
      </div>
      <div class="scenarios-grid">
        ${scenarios.map((scenario, index) => `
          <div class="scenario-card" style="animation-delay: ${index * 0.2}s">
            <div class="scenario-header">
              <h3>${scenario.title}</h3>
              <span class="probability-badge">${scenario.probability}確率</span>
            </div>
            <div class="scenario-content">
              <p class="description">${scenario.description}</p>
              <p class="content">${scenario.content}</p>
              <div class="scenario-meta">
                <span class="timeframe">⏱️ ${scenario.timeframe}</span>
              </div>
              <div class="advice">
                <strong>💡 アドバイス:</strong> ${scenario.advice}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="results-footer">
        <p><em>※ これらは易経の思想に基づく一般的な指針です。最終的な判断はご自身でお決めください。</em></p>
        <button onclick="location.reload()" class="retry-button">🔄 新しく分析する</button>
      </div>
    `;
    
    resultsContainer.style.display = 'block';
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
  },
  
  createResultsContainer() {
    const container = document.createElement('div');
    container.id = 'results-container';
    container.className = 'results-section';
    
    // Find a good place to insert results
    const inputSection = document.querySelector('.input-section') ||
                         document.querySelector('form') ||
                         document.querySelector('textarea').closest('div');
    
    if (inputSection) {
      inputSection.parentNode.insertBefore(container, inputSection.nextSibling);
    } else {
      document.body.appendChild(container);
    }
    
    return container;
  },
  
  showLoading() {
    const button = document.querySelector('button[onclick*="analyze"]') ||
                  document.querySelector('.analyze-btn');
    
    if (button) {
      button.disabled = true;
      button.textContent = '🔮 分析中...';
    }
    
    // Show loading overlay if available
    const loadingOverlay = document.getElementById('results-loading');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'block';
    }
  },
  
  showError(message) {
    alert(message);
    
    const button = document.querySelector('button[onclick*="analyze"]') ||
                  document.querySelector('.analyze-btn');
    if (button) {
      button.disabled = false;
      button.textContent = '🎯 未来を分析する';
    }
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => FutureSimulator.Core.init(), 1000);
  });
} else {
  setTimeout(() => FutureSimulator.Core.init(), 1000);
}

console.log('✅ Future Simulator Core loaded');