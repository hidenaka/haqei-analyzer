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
  
  // 正統386爻システム統合
  authentic386Integration: null,
  useAuthentic386: true,
  
  async init() {
    console.log('🚀 Future Simulator initializing...');
    
    try {
      // Initialize components in proper order with error handling
      this.initKuromoji();
      this.init386System();
      this.initializeEngines();
      this.initUI();
      this.setupEventListeners();
      
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
  
  async init386System() {
    console.log('🎋 Initializing Authentic 386 System...');
    
    try {
      if (typeof window.Authentic386Integration !== 'undefined') {
        this.authentic386Integration = new window.Authentic386Integration();
        this.authentic386Integration.initialize();
        console.log('✅ Authentic 386 System integrated successfully');
        this.useAuthentic386 = true;
      } else {
        console.warn('⚠️ Authentic386Integration not available, using legacy system');
        this.useAuthentic386 = false;
      }
    } catch (error) {
      console.error('❌ 386 System initialization error:', error);
      this.useAuthentic386 = false;
    }
  },
  
  async initUI() {
    console.log('🎨 Initializing UI components...');
    
    try {
      // Show main content
      const mainContent = document.querySelector('.future-simulator-container') || document.body;
      if (mainContent.style.display === 'none') {
        mainContent.style.display = 'block';
      }
      
      // Initialize input field with error handling
      const inputField = document.getElementById('situation-input') || 
                      document.querySelector('textarea[placeholder*="状況"]') ||
                      document.querySelector('textarea');
    
      if (inputField) {
        inputField.addEventListener('input', this.handleInputChange.bind(this));
        this.setupCharacterCounter(inputField);
        console.log('✅ Input field initialized');
      }
      
      // Setup Charts if available with error handling
      if (typeof Chart !== 'undefined') {
        console.log('📊 Chart.js available');
      } else {
        console.log('ℹ️ Chart.js not available, using fallback displays');
        this.setupFallbackVisualization();
      }
      
    } catch (error) {
      console.error('❌ UI initialization error:', error);
      // Continue without failing completely
    }
  },
  
  // Safe character counter setup
  setupCharacterCounter(textarea) {
    try {
      if (textarea.nextElementSibling?.classList?.contains('character-counter')) {
        return; // Counter already exists
      }
      
      const counter = document.createElement('div');
      counter.className = 'character-counter';
      counter.style.cssText = 'font-size: 12px; color: #6b7280; text-align: right; margin-top: 4px;';
      
      const updateCounter = () => {
        const length = textarea.value.length;
        counter.textContent = `${length} 文字`;
        counter.style.color = length > 500 ? '#ef4444' : '#6b7280';
      };
      
      textarea.addEventListener('input', updateCounter);
      textarea.parentNode.insertBefore(counter, textarea.nextSibling);
      updateCounter();
      
    } catch (error) {
      console.error('❌ Character counter setup error:', error);
    }
  },

  // Fallback visualization system
  setupFallbackVisualization() {
    console.log('🎨 Setting up fallback visualization system...');
    
    window.createFallbackChart = (data, container) => {
      if (!container) return;
      
      try {
        const maxValue = Math.max(...data.map(d => d.value || 0));
        const bars = data.map(item => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          return `
            <div class="chart-bar" style="margin-bottom: 8px;">
              <div class="bar-label" style="display: inline-block; width: 120px; font-size: 12px;">${item.label || 'データ'}</div>
              <div class="bar-container" style="display: inline-block; width: 200px; background: #e2e8f0; height: 20px; border-radius: 10px; overflow: hidden; vertical-align: middle;">
                <div class="bar-fill" style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, #3b82f6, #06b6d4); transition: width 0.5s ease;"></div>
              </div>
              <span style="margin-left: 8px; font-size: 12px; color: #6b7280;">${item.value || 0}%</span>
            </div>
          `;
        }).join('');
        
        container.innerHTML = `
          <div class="fallback-chart" style="padding: 16px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="margin-bottom: 16px; font-weight: bold; color: #374151;">データ可視化</div>
            ${bars}
          </div>
        `;
      } catch (error) {
        console.error('❌ Fallback chart error:', error);
        container.innerHTML = '<div style="padding: 16px; color: #6b7280;">データの表示でエラーが発生しました</div>';
      }
    };
  },
  
  setupEventListeners() {
    console.log('🔗 Setting up event listeners...');
    
    // Find analyze button
    const analyzeButton = document.getElementById('analyze-button') ||
                         document.querySelector('button[onclick*="analyze"]') ||
                         document.querySelector('.analyze-btn') ||
                         Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('分析'));
    
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
    console.log('🔍 Starting advanced 512-pattern analysis...');
    
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
      let analysisResult;
      
      // 🎋 正統386爻システム優先分析
      if (this.useAuthentic386 && this.authentic386Integration) {
        console.log('🎋 Using Authentic 386-Line Analysis System');
        analysisResult = this.authentic386Integration.analyzeWithAuthentic386(situation, {
          branchCount: 8,
          enableSpecialLines: true,
          integrationMode: 'enhanced'
        });
        
        // 386爻結果表示
        this.displayAuthentic386Results(analysisResult);
        
      } else if (window.Extended512HexagramEngine && window.Extended512HexagramEngine.initialized) {
        console.log('🌟 Using Extended 512-Pattern Analysis System');
        analysisResult = window.Extended512HexagramEngine.analyze512Pattern(situation, {
          detailed: true,
          include_yong_yao: true,
          branch_count: 8
        });
        
        // Enhanced display for 512-pattern results
        this.display512PatternResults(analysisResult);
        
      } else if (window.BinaryTreeFutureEngine) {
        console.log('🌳 Using Binary Tree Future Analysis System');
        
        // Generate random line number from 1-384 for demonstration
        const currentLine = Math.floor(Math.random() * 384) + 1;
        const context = { inputText: situation };
        
        const binaryTreeEngine = new window.BinaryTreeFutureEngine();
        const binaryResult = binaryTreeEngine.generateBinaryTreeFutures(currentLine, context);
        
        // Display binary tree results
        this.displayBinaryTreeResults(binaryResult);
        
      } else {
        console.log('⚡ Using Standard Analysis System');
        // Fallback to standard system
        // await new Promise(resolve => setTimeout(resolve, 2000));
        const scenarios = this.generateScenarios(situation);
        this.displayResults(scenarios);
      }
      
    } catch (error) {
      console.error('Analysis error:', error);
      this.showError('分析中にエラーが発生しました。標準システムで再試行します。');
      
      // Fallback to standard analysis
      const scenarios = this.generateScenarios(situation);
      this.displayResults(scenarios);
    }
  },

  // 🎋 正統386爻結果表示システム
  displayAuthentic386Results(analysisResult) {
    console.log('🎋 Displaying Authentic 386-Line results:', {
      mode: analysisResult.integrationMode,
      special: analysisResult.specialLineDetected?.detected,
      authenticity: analysisResult.authenticity
    });
    
    const resultsContainer = this.getResultsContainer();
    if (!resultsContainer) {
      console.error('Results container not found');
      return;
    }
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Create authentic 386-line UI structure
    const resultHTML = this.generateAuthentic386HTML(analysisResult);
    resultsContainer.innerHTML = resultHTML;
    
    // Add interactive features
    this.setupAuthentic386Interactions(analysisResult);
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Hide loading
    this.hideLoading();
  },

  // 正統386爻HTML生成
  generateAuthentic386HTML(result) {
    const isSpecial = result.specialLineDetected?.detected;
    const specialType = result.specialLineDetected?.type;
    
    let currentPatternCard = '';
    
    // 特殊爻の場合
    if (isSpecial) {
      currentPatternCard = `
        <div class="current-pattern-card bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-6 border-2 border-orange-300 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-800">🌟 特殊爻検出</h2>
            <span class="px-4 py-2 bg-orange-600 text-white rounded-full text-sm font-bold animate-pulse">
              ${specialType} - 極めて稀
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="text-center p-4 bg-white rounded-lg border border-orange-200">
              <div class="text-4xl mb-2">${specialType === 'YouKuu' ? '🐉' : '🌙'}</div>
              <div class="font-bold text-orange-700">${specialType}</div>
              <div class="text-sm text-orange-600">
                ${specialType === 'YouKuu' ? '群龍無首吉' : '利永貞'}
              </div>
            </div>
            <div class="text-center p-4 bg-white rounded-lg border border-orange-200">
              <div class="text-3xl mb-2">⚡</div>
              <div class="font-semibold text-gray-700">変化レベル</div>
              <div class="text-sm text-orange-600">最大級変化</div>
            </div>
            <div class="text-center p-4 bg-white rounded-lg border border-orange-200">
              <div class="text-3xl mb-2">🎯</div>
              <div class="font-semibold text-gray-700">信頼性</div>
              <div class="text-sm text-orange-600">${Math.round(result.authenticity * 100)}%</div>
            </div>
          </div>
          
          <div class="bg-orange-100 rounded-lg p-4 border border-orange-200">
            <h3 class="font-bold text-orange-800 mb-2">特殊状況解釈:</h3>
            <p class="text-orange-700">
              ${this.getSpecialLineInterpretation(specialType)}
            </p>
          </div>
        </div>
      `;
    } else {
      // 通常爻の場合
      const hexagram = result.integratedAnalysis?.hexagram;
      currentPatternCard = `
        <div class="current-pattern-card bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-800">現在の状況</h2>
            <span class="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
              正統386爻システム
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="text-center p-4 bg-white rounded-lg">
              <div class="text-3xl mb-2">☯️</div>
              <div class="font-semibold text-gray-700">${hexagram?.number || '?'}. ${hexagram?.name || '未確定'}</div>
              <div class="text-sm text-gray-500">易経卦</div>
            </div>
            <div class="text-center p-4 bg-white rounded-lg">
              <div class="text-3xl mb-2">🔮</div>
              <div class="font-semibold text-gray-700">信頼性</div>
              <div class="text-sm text-blue-600">${Math.round(result.authenticity * 100)}%</div>
            </div>
            <div class="text-center p-4 bg-white rounded-lg">
              <div class="text-3xl mb-2">🎯</div>
              <div class="font-semibold text-gray-700">分析モード</div>
              <div class="text-sm text-blue-600">${result.integrationMode}</div>
            </div>
          </div>
        </div>
      `;
    }
    
    // 8シナリオ表示
    const scenarios = result.eightScenarios?.scenarios || [];
    const scenariosHTML = this.generateScenariosHTML(scenarios);
    
    return `
      <div class="analysis-results-386 fade-in">
        ${currentPatternCard}
        
        <!-- 8つの未来分岐 -->
        <div class="scenarios-section">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">🌸 8つの変化の道筋</h2>
          ${scenariosHTML}
        </div>
        
        <!-- 推奨行動 -->
        <div class="recommendation-card bg-green-50 rounded-xl p-6 mt-6 border border-green-200">
          <h3 class="text-xl font-bold text-green-800 mb-3">🎯 推奨行動</h3>
          <p class="text-green-700">${this.getActionRecommendation(result)}</p>
        </div>
      </div>
    `;
  },

  // シナリオHTML生成（共通）
  generateScenariosHTML(scenarios) {
    if (!scenarios || scenarios.length === 0) {
      return '<p class="text-gray-500">シナリオデータを生成中...</p>';
    }
    
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        ${scenarios.map((scenario, index) => `
          <div class="scenario-card bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow cursor-pointer"
               onclick="FutureSimulator.Core.showScenarioDetail(${index})">
            <div class="text-center mb-3">
              <div class="text-2xl mb-2">${this.getScenarioEmoji(scenario.direction)}</div>
              <h4 class="font-semibold text-gray-800">${scenario.name || scenario.direction}</h4>
            </div>
            <div class="text-sm text-gray-600 mb-2">
              ${scenario.description?.substring(0, 80)}...
            </div>
            <div class="flex justify-between text-xs text-gray-500">
              <span>確率: ${Math.round((scenario.probability || 0.125) * 100)}%</span>
              <span>${scenario.timeframe || 'medium_term'}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // 386爻インタラクション設定
  setupAuthentic386Interactions(result) {
    // シナリオクリックイベント設定
    window.currentAnalysisResult = result;
    
    // 特殊爻の場合の追加インタラクション
    if (result.specialLineDetected?.detected) {
      console.log('🌟 Special line interactions enabled');
      // 特殊爻専用のインタラクション設定
      this.setupSpecialLineInteractions(result.specialLineDetected.type);
    }
  },

  // 特殊爻解釈テキスト
  getSpecialLineInterpretation(specialType) {
    if (specialType === 'YouKuu') {
      return '全ての要素が最高度の創造的エネルギーを持つ極めて稀な状況です。リーダーシップを分散し、各人が自律的に協力することで理想的な結果が期待できます。「群龍無首」の状態 - 特定のリーダーに依存しない組織の最高形態です。';
    } else if (specialType === 'YouRokuu') {
      return '全ての要素が最高度の受容的エネルギーを持つ極めて稀な状況です。地道で持続的なアプローチにより、長期的な安定と発展が期待できます。「永貞に利し」の状態 - 正道を守り続けることによる真の利益の獲得です。';
    }
    return '特殊な状況が検出されました。';
  },

  // 行動推奨
  getActionRecommendation(result) {
    const special = result.specialLineDetected;
    if (special?.detected) {
      if (special.type === 'YouKuu') {
        return '創造力が最高潮に達している状況です。各メンバーの自主性を最大限活かし、トップダウンではなく協調的なアプローチで進めることをお勧めします。';
      } else if (special.type === 'YouRokuu') {
        return '受容性と持続性が最高度に発揮される状況です。急がず着実に、正道を守りながら長期的な視点で取り組むことをお勧めします。';
      }
    }
    return result.recommendedAction || '易経の指導に従い、現在の状況に適した方法で進めることをお勧めします。';
  },

  // シナリオ絵文字
  getScenarioEmoji(direction) {
    const emojiMap = {
      'creative_leadership': '🐉',
      'joyful_expression': '😊',
      'illuminating_clarity': '☀️',
      'initiating_action': '⚡',
      'gentle_penetration': '🌿',
      'adaptive_flow': '🌊',
      'stable_foundation': '🏔️',
      'receptive_support': '🌙',
      '乾': '🐉', '兌': '😊', '離': '☀️', '震': '⚡',
      '巽': '🌿', '坎': '🌊', '艮': '🏔️', '坤': '🌙'
    };
    return emojiMap[direction] || '🔮';
  },

  // シナリオ詳細表示
  showScenarioDetail(index) {
    if (window.currentAnalysisResult && window.currentAnalysisResult.eightScenarios) {
      const scenario = window.currentAnalysisResult.eightScenarios.scenarios[index];
      if (scenario) {
        alert(`${scenario.name}\n\n${scenario.description || 'シナリオの詳細情報'}\n\n推奨: ${scenario.recommendation || '状況に応じて対応してください'}`);
      }
    }
  },

  // 特殊爻インタラクション
  setupSpecialLineInteractions(specialType) {
    // 特殊爻用の追加UI要素やイベント設定
    console.log(`🌟 Setting up ${specialType} interactions`);
  },

  // 🌟 512パターン結果表示システム
  display512PatternResults(analysisResult) {
    console.log('🎨 Displaying 512-pattern results:', analysisResult.pattern_id);
    
    const resultsContainer = this.getResultsContainer();
    if (!resultsContainer) {
      console.error('Results container not found');
      return;
    }
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Create enhanced UI structure
    const resultHTML = this.generate512PatternHTML(analysisResult);
    resultsContainer.innerHTML = resultHTML;
    
    // Add interactive features
    this.setup512PatternInteractions(analysisResult);
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Hide loading
    this.hideLoading();
  },

  // 512パターンHTML生成
  generate512PatternHTML(result) {
    const current = result.current_pattern;
    const branches = result.future_branches;
    
    return `
      <div class="analysis-results-512 fade-in">
        <!-- Current Pattern Display -->
        <div class="current-pattern-card bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border border-purple-200">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-800">現在の状況パターン</h2>
            <span class="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
              ${current.id} (512中の${current.pattern_index + 1})
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="text-center p-4 bg-white rounded-lg">
              <div class="text-3xl mb-2">☯️</div>
              <div class="font-semibold text-gray-700">第${current.line_position}爻</div>
              <div class="text-sm text-gray-500">
                ${current.is_yong_yao ? '用爻（特殊）' : '通常爻'}
              </div>
            </div>
            <div class="text-center p-4 bg-white rounded-lg">
              <div class="text-3xl mb-2">${this.getElementEmoji(current.dominant_element)}</div>
              <div class="font-semibold text-gray-700">${current.dominant_element}の性質</div>
              <div class="text-sm text-gray-500">${current.transformation_type}</div>
            </div>
            <div class="text-center p-4 bg-white rounded-lg">
              <div class="text-3xl mb-2">🎯</div>
              <div class="font-semibold text-gray-700">信頼性</div>
              <div class="text-sm text-gray-500">${Math.round(current.authenticity_score * 100)}%</div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg p-4">
            <h3 class="font-semibold text-gray-800 mb-2">HaQei哲学的意味</h3>
            <p class="text-gray-700">${current.haqei_meaning}</p>
          </div>
          
          ${result.yong_yao_analysis ? this.generateYongYaoHTML(result.yong_yao_analysis) : ''}
        </div>

        <!-- Future Branches (8 Scenarios) -->
        <div class="future-branches-container">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800">八象未来分岐図</h2>
            <span class="text-sm text-gray-600">
              512パターンから8つの代表的な未来を選出
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            ${branches.map((branch, index) => this.generateBranchHTML(branch, index)).join('')}
          </div>
        </div>

        <!-- Philosophical Guidance -->
        <div class="philosophical-guidance bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mt-6 border border-amber-200">
          <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-2xl mr-2">🧘‍♂️</span>
            HaQei哲学的指導
          </h3>
          <div class="space-y-3">
            ${result.philosophical_guidance ? 
              result.philosophical_guidance.map(guidance => 
                `<p class="text-gray-700 leading-relaxed">${guidance}</p>`
              ).join('') : 
              '<p class="text-gray-700">状況に応じた指導を生成中...</p>'
            }
          </div>
        </div>
      </div>
    `;
  },

  // 用爻分析HTML生成
  generateYongYaoHTML(yongYaoAnalysis) {
    return `
      <div class="yong-yao-analysis mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
        <h4 class="font-semibold text-amber-800 mb-2 flex items-center">
          <span class="text-lg mr-2">⚡</span>
          用爻の特殊な意味 - ${yongYaoAnalysis.type === 'yong_jiu' ? '用九（創造の極致）' : '用六（受容の極致）'}
        </h4>
        <p class="text-amber-700 text-sm leading-relaxed">${yongYaoAnalysis.wisdom}</p>
        <div class="mt-2 text-xs text-amber-600">
          注意事項: ${yongYaoAnalysis.caution}
        </div>
      </div>
    `;
  },

  // 分岐HTML生成
  generateBranchHTML(branch, index) {
    return `
      <div class="branch-card bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
           data-branch-index="${index}" 
           data-bagua="${branch.bagua}">
        <div class="text-center mb-3">
          <div class="text-4xl mb-2">${branch.emoji}</div>
          <h3 class="font-bold text-gray-800 text-sm">${branch.nature}の道</h3>
          <p class="text-xs text-gray-600">${branch.direction}</p>
        </div>
        
        <div class="space-y-2">
          <div class="text-xs">
            <span class="font-semibold">関連性:</span> 
            <span class="inline-block w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-blue-500 rounded-full" 
                   style="width: ${Math.min(100, branch.relevance_score)}%"></div>
            </span>
          </div>
          <div class="text-xs">
            <span class="font-semibold">確率:</span> ${branch.probability}
          </div>
        </div>
        
        <p class="text-xs text-gray-700 mt-2 line-clamp-3">${branch.description}</p>
        
        <div class="mt-3 pt-2 border-t border-gray-100">
          <p class="text-xs text-blue-600 font-medium">クリックで詳細表示</p>
        </div>
      </div>
    `;
  },

  // Interactive features setup
  setup512PatternInteractions(analysisResult) {
    // Branch card interactions
    document.querySelectorAll('.branch-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const branchIndex = parseInt(e.currentTarget.dataset.branchIndex);
        const branch = analysisResult.future_branches[branchIndex];
        this.showBranchDetails(branch, analysisResult);
      });
    });
  },

  // Show branch details modal
  showBranchDetails(branch, analysisResult) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-gray-800 flex items-center">
            <span class="text-3xl mr-3">${branch.emoji}</span>
            ${branch.nature}の道 (${branch.bagua})
          </h2>
          <button class="close-modal text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        <div class="space-y-4">
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">方向性</h3>
            <p class="text-gray-700">${branch.direction}</p>
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">詳細説明</h3>
            <p class="text-gray-700">${branch.description}</p>
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">指導内容</h3>
            <p class="text-gray-700">${branch.guidance}</p>
          </div>
          
          ${branch.haqei_wisdom ? `
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">HaQei智慧</h3>
              <p class="text-gray-700">${branch.haqei_wisdom}</p>
            </div>
          ` : ''}
          
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div class="text-center p-3 bg-blue-50 rounded-lg">
              <div class="font-semibold text-blue-800">関連性</div>
              <div class="text-2xl font-bold text-blue-600">${Math.round(branch.relevance_score)}%</div>
            </div>
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <div class="font-semibold text-green-800">確率</div>
              <div class="text-2xl font-bold text-green-600">${branch.probability}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close-modal').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  },

  // 🌳 Binary Tree Results Display System
  displayBinaryTreeResults(binaryResult) {
    console.log('🌳 Displaying Binary Tree results:', {
      currentLine: binaryResult.currentLine,
      totalPaths: binaryResult.finalEightPaths?.length || 0,
      version: binaryResult.version
    });
    
    const resultsContainer = this.getResultsContainer();
    if (!resultsContainer) {
      console.error('Results container not found');
      return;
    }
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Create binary tree UI structure
    const resultHTML = this.generateBinaryTreeHTML(binaryResult);
    resultsContainer.innerHTML = resultHTML;
    
    // Add interactive features
    this.setupBinaryTreeInteractions(binaryResult);
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Hide loading
    this.hideLoading();
  },

  // Binary Tree HTML生成
  generateBinaryTreeHTML(result) {
    const currentLine = result.currentLine;
    const currentLineData = result.currentLineData;
    const finalPaths = result.finalEightPaths || [];
    
    return `
      <div class="binary-tree-results fade-in">
        <!-- Current Position Display -->
        <div class="current-position-card bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 mb-6 border border-emerald-200">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-800">🎯 現在の状況（${currentLine}爻）</h2>
            <span class="px-3 py-1 bg-emerald-600 text-white rounded-full text-sm font-medium">
              二分木未来分岐システム
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="text-center p-4 bg-white rounded-lg">
              <div class="text-3xl mb-2">☯️</div>
              <div class="font-semibold text-gray-700">${currentLineData?.hexagramName || '第' + Math.ceil(currentLine / 6) + '卦'}</div>
              <div class="text-sm text-gray-500">${currentLineData?.lineName || '第' + (((currentLine - 1) % 6) + 1) + '爻'}</div>
            </div>
            <div class="text-center p-4 bg-white rounded-lg">
              <div class="text-3xl mb-2">🌳</div>
              <div class="font-semibold text-gray-700">分岐方式</div>
              <div class="text-sm text-emerald-600">3段階段階的選択</div>
            </div>
            <div class="text-center p-4 bg-white rounded-lg">
              <div class="text-3xl mb-2">🎯</div>
              <div class="font-semibold text-gray-700">最終パターン</div>
              <div class="text-sm text-emerald-600">${finalPaths.length}つの道筋</div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg p-4">
            <h3 class="font-semibold text-gray-800 mb-2">現在の位置づけ</h3>
            <p class="text-gray-700">${currentLineData?.modernInterpretation || 'この位置から3段階の選択を経て、8つの未来の可能性に到達します'}</p>
          </div>
        </div>

        <!-- Selection Process Guide -->
        <div class="selection-guide mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">🌳 段階的選択プロセス</h2>
          <div class="process-flow bg-white rounded-lg p-6 border border-gray-200">
            <div class="flex items-center justify-center space-x-4 text-sm">
              <div class="text-center">
                <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                  <span class="font-bold text-emerald-700">1</span>
                </div>
                <div class="font-medium">第1選択</div>
                <div class="text-gray-500">テーマの方向</div>
              </div>
              <div class="text-2xl text-gray-400">→</div>
              <div class="text-center">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span class="font-bold text-blue-700">2</span>
                </div>
                <div class="font-medium">第2選択</div>
                <div class="text-gray-500">実行方法</div>
              </div>
              <div class="text-2xl text-gray-400">→</div>
              <div class="text-center">
                <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <span class="font-bold text-purple-700">3</span>
                </div>
                <div class="font-medium">第3選択</div>
                <div class="text-gray-500">最終調整</div>
              </div>
              <div class="text-2xl text-gray-400">→</div>
              <div class="text-center">
                <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                  <span class="font-bold text-orange-700">8</span>
                </div>
                <div class="font-medium">最終結果</div>
                <div class="text-gray-500">8つの道筋</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive Selection Interface -->
        <div class="interactive-selection mb-6">
          <div id="level-1-selection" class="selection-level active">
            <h3 class="text-xl font-bold text-gray-800 mb-4">🎯 第1段階：基本方針を選択</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button class="level1-option bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg p-4 transition-all duration-300" data-choice="progress">
                <div class="text-3xl mb-2">🌱</div>
                <div class="font-bold text-green-800">テーマを進む（順行型）</div>
                <div class="text-sm text-green-600 mt-2">現在の方向性を継続・強化する道</div>
              </button>
              <button class="level1-option bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 rounded-lg p-4 transition-all duration-300" data-choice="transform">
                <div class="text-3xl mb-2">🔄</div>
                <div class="font-bold text-orange-800">テーマを転換（転換型）</div>
                <div class="text-sm text-orange-600 mt-2">現在の方向性を変更・転換する道</div>
              </button>
            </div>
          </div>

          <div id="level-2-selection" class="selection-level hidden">
            <h3 class="text-xl font-bold text-gray-800 mb-4">🎯 第2段階：実行方法を選択</h3>
            <div id="level-2-options" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Dynamic content will be filled by JavaScript -->
            </div>
          </div>

          <div id="level-3-selection" class="selection-level hidden">
            <h3 class="text-xl font-bold text-gray-800 mb-4">🎯 第3段階：最終調整を選択</h3>
            <div id="level-3-options" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Dynamic content will be filled by JavaScript -->
            </div>
          </div>
        </div>

        <!-- Final Eight Patterns Display (Initially Hidden) -->
        <div id="final-patterns-display" class="final-patterns hidden">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">🌸 到達した未来の道筋</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            ${finalPaths.map((path, index) => `
              <div class="path-card bg-white rounded-lg p-4 border hover:shadow-lg transition-shadow cursor-pointer" data-path-index="${index}">
                <div class="text-center mb-3">
                  <div class="text-2xl mb-2">🎯</div>
                  <h4 class="font-semibold text-gray-800">${path.title}</h4>
                </div>
                <div class="text-sm text-gray-600 mb-2">
                  ${(path.fullDescription || '').substring(0, 80)}...
                </div>
                <div class="flex justify-between text-xs text-gray-500">
                  <span>確率: ${Math.round((path.probability || 0.125) * 100)}%</span>
                  <span>パス${path.pathIndex}</span>
                </div>
                <div class="mt-2 text-xs text-blue-600">
                  経路: ${(path.route || []).join(' → ')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- HaQei Philosophy Integration -->
        ${result.HaQeiIntegration ? this.generateHaQeiIntegrationHTML(result.HaQeiIntegration) : ''}
      </div>
    `;
  },

  // HaQei統合HTML生成
  generateHaQeiIntegrationHTML(HaQeiIntegration) {
    return `
      <div class="haqei-integration bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 mt-6 border border-amber-200">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span class="text-2xl mr-2">🧘‍♂️</span>
          HaQei哲学的統合
        </h3>
        
        <div class="space-y-4">
          <div class="bg-white rounded-lg p-4">
            <h4 class="font-semibold text-amber-800 mb-2">🤝 矛盾受容の原則</h4>
            <p class="text-amber-700 text-sm">${HaQeiIntegration.contradiction_acceptance?.explanation || '複数の相反する道筋が同時に存在することを受け入れることで、より豊かな選択肢が生まれます'}</p>
          </div>
          
          <div class="bg-white rounded-lg p-4">
            <h4 class="font-semibold text-amber-800 mb-2">🎭 段階的分人切り替え</h4>
            <div class="space-y-2 text-sm text-amber-700">
              <div><strong>第1段階:</strong> ${HaQeiIntegration.persona_switching?.level1 || '戦略的思考分人'}</div>
              <div><strong>第2段階:</strong> ${HaQeiIntegration.persona_switching?.level2 || '実行判断分人'}</div>
              <div><strong>第3段階:</strong> ${HaQeiIntegration.persona_switching?.level3 || '最終決断分人'}</div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg p-4">
            <h4 class="font-semibold text-amber-800 mb-2">🌟 統合的知恵</h4>
            <p class="text-amber-700 text-sm">${HaQeiIntegration.unified_wisdom?.meta_guidance || '全ての選択肢を理解することで、状況に最適な判断が可能になります'}</p>
          </div>
        </div>
      </div>
    `;
  },

  // Binary Tree Interactions Setup
  setupBinaryTreeInteractions(binaryResult) {
    console.log('🌳 Setting up binary tree interactions');
    
    // Store binary result globally for access
    window.currentBinaryResult = binaryResult;
    
    // Level 1 selection handlers
    document.querySelectorAll('.level1-option').forEach(button => {
      button.addEventListener('click', (e) => {
        const choice = e.currentTarget.dataset.choice;
        this.handleLevel1Selection(choice, binaryResult);
      });
    });
    
    // Final pattern click handlers
    document.querySelectorAll('.path-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const pathIndex = parseInt(e.currentTarget.dataset.pathIndex);
        this.showPathDetails(pathIndex, binaryResult);
      });
    });
  },

  // Level 1 Selection Handler
  handleLevel1Selection(choice, binaryResult) {
    console.log(`🎯 Level 1 selection: ${choice}`);
    
    // Hide level 1, show level 2
    document.getElementById('level-1-selection').classList.add('hidden');
    document.getElementById('level-2-selection').classList.remove('hidden');
    
    // Generate level 2 options based on choice
    const level2Container = document.getElementById('level-2-options');
    
    if (choice === 'progress') {
      level2Container.innerHTML = `
        <button class="level2-option bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg p-4 transition-all duration-300" data-choice="continue" data-parent="progress">
          <div class="text-2xl mb-2">⬆️</div>
          <div class="font-bold text-green-800">さらに進む</div>
          <div class="text-sm text-green-600 mt-2">順行の方向性をより強化する</div>
        </button>
        <button class="level2-option bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 rounded-lg p-4 transition-all duration-300" data-choice="adjust" data-parent="progress">
          <div class="text-2xl mb-2">⚖️</div>
          <div class="font-bold text-yellow-800">一部転換</div>
          <div class="text-sm text-yellow-600 mt-2">順行しつつも部分的に調整する</div>
        </button>
      `;
    } else {
      level2Container.innerHTML = `
        <button class="level2-option bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-lg p-4 transition-all duration-300" data-choice="complete" data-parent="transform">
          <div class="text-2xl mb-2">🔄</div>
          <div class="font-bold text-red-800">完全転換</div>
          <div class="text-sm text-red-600 mt-2">根本的な方向転換を行う</div>
        </button>
        <button class="level2-option bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-lg p-4 transition-all duration-300" data-choice="integrate" data-parent="transform">
          <div class="text-2xl mb-2">🤝</div>
          <div class="font-bold text-purple-800">統合的転換</div>
          <div class="text-sm text-purple-600 mt-2">既存要素と新要素を統合する</div>
        </button>
      `;
    }
    
    // Add level 2 click handlers
    document.querySelectorAll('.level2-option').forEach(button => {
      button.addEventListener('click', (e) => {
        const choice = e.currentTarget.dataset.choice;
        const parent = e.currentTarget.dataset.parent;
        this.handleLevel2Selection(parent, choice, binaryResult);
      });
    });
  },

  // Level 2 Selection Handler  
  handleLevel2Selection(parent, choice, binaryResult) {
    console.log(`🎯 Level 2 selection: ${parent} → ${choice}`);
    
    // Hide level 2, show level 3
    document.getElementById('level-2-selection').classList.add('hidden');
    document.getElementById('level-3-selection').classList.remove('hidden');
    
    // Generate level 3 options
    const level3Container = document.getElementById('level-3-options');
    level3Container.innerHTML = `
      <button class="level3-option bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg p-4 transition-all duration-300" data-choice="strengthen" data-path="${parent}-${choice}">
        <div class="text-2xl mb-2">💪</div>
        <div class="font-bold text-blue-800">継続強化</div>
        <div class="text-sm text-blue-600 mt-2">選択した方向性をさらに強化</div>
      </button>
      <button class="level3-option bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 rounded-lg p-4 transition-all duration-300" data-choice="moderate" data-path="${parent}-${choice}">
        <div class="text-2xl mb-2">⚖️</div>
        <div class="font-bold text-gray-800">部分的修正</div>
        <div class="text-sm text-gray-600 mt-2">バランスを保ちながら調整</div>
      </button>
    `;
    
    // Add level 3 click handlers
    document.querySelectorAll('.level3-option').forEach(button => {
      button.addEventListener('click', (e) => {
        const choice = e.currentTarget.dataset.choice;
        const path = e.currentTarget.dataset.path;
        this.handleLevel3Selection(path, choice, binaryResult);
      });
    });
  },

  // Level 3 Selection Handler (Final)
  handleLevel3Selection(path, choice, binaryResult) {
    console.log(`🎯 Final selection: ${path} → ${choice}`);
    
    // Hide level 3 selection
    document.getElementById('level-3-selection').classList.add('hidden');
    
    // Show final patterns with the selected path highlighted
    const finalPatternsDisplay = document.getElementById('final-patterns-display');
    finalPatternsDisplay.classList.remove('hidden');
    
    // Add completion message
    const completionMessage = document.createElement('div');
    completionMessage.className = 'completion-message bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6';
    completionMessage.innerHTML = `
      <div class="flex items-center">
        <div class="text-3xl mr-4">🎉</div>
        <div>
          <div class="font-bold text-emerald-800">選択プロセス完了！</div>
          <div class="text-sm text-emerald-600">あなたの3段階選択: ${path} → ${choice}</div>
          <div class="text-sm text-emerald-600">以下の8つの道筋があなたの前に開かれています</div>
        </div>
      </div>
    `;
    
    finalPatternsDisplay.insertBefore(completionMessage, finalPatternsDisplay.firstChild);
    
    // Scroll to results
    finalPatternsDisplay.scrollIntoView({ behavior: 'smooth' });
  },

  // Path Details Display
  showPathDetails(pathIndex, binaryResult) {
    const path = binaryResult.finalEightPaths[pathIndex];
    if (!path) return;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-gray-800">
            ${path.title}
          </h2>
          <button class="close-modal text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        <div class="space-y-4">
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">選択経路</h3>
            <div class="flex items-center space-x-2 text-sm bg-gray-50 p-3 rounded-lg">
              ${(path.route || []).map(step => `<span class="bg-white px-2 py-1 rounded">${step}</span>`).join('<span class="text-gray-400">→</span>')}
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">詳細説明</h3>
            <p class="text-gray-700">${path.fullDescription || path.title}</p>
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">実践的指導</h3>
            <ul class="list-disc list-inside text-gray-700 space-y-1">
              ${(path.practical_guidance || ['状況を観察する', '段階的に進む', '柔軟に対応する']).map(guidance => 
                `<li>${guidance}</li>`
              ).join('')}
            </ul>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-3 bg-blue-50 rounded-lg">
              <div class="font-semibold text-blue-800">実現確率</div>
              <div class="text-2xl font-bold text-blue-600">${Math.round((path.probability || 0.125) * 100)}%</div>
            </div>
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <div class="font-semibold text-green-800">期間目安</div>
              <div class="text-lg font-bold text-green-600">${path.timeline || '3-6ヶ月'}</div>
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">成功要因</h3>
            <div class="flex flex-wrap gap-2">
              ${(path.success_factors || ['継続性', '適応力', '判断力']).map(factor => 
                `<span class="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">${factor}</span>`
              ).join('')}
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">注意すべき課題</h3>
            <div class="flex flex-wrap gap-2">
              ${(path.potential_challenges || ['変化への抵抗', '外的要因', 'タイミング']).map(challenge => 
                `<span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">${challenge}</span>`
              ).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close-modal').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  },

  // Get Results Container (utility method)
  getResultsContainer() {
    return document.getElementById('results-container') ||
           document.getElementById('analysis-results') ||
           document.querySelector('.results-section') ||
           this.createResultsContainer();
  },

  // Helper methods
  getElementEmoji(element) {
    const emojis = {
      '木': '🌱', '火': '🔥', '土': '🌍', '金': '⚡', '水': '🌊'
    };
    return emojis[element] || '⭐';
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
  
  hideLoading() {
    const button = document.querySelector('button[onclick*="analyze"]') ||
                  document.querySelector('.analyze-btn');
    
    if (button) {
      button.disabled = false;
      button.textContent = '🎯 未来を分析する';
    }
    
    // Hide loading overlay if available
    const loadingOverlay = document.getElementById('results-loading');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
  },
  
  async initializeEngines() {
    console.log('🔧 Initializing analysis engines...');
    
    try {
      // Initialize engines with error handling
      if (window.IntegratedAnalysisEngine) {
        window.IntegratedAnalysisEngine.init();
      }
      
      if (window.SituationalContextEngine) {
        window.SituationalContextEngine.init();
      }
      
      if (window.MultiDimensionalContextAnalyzer) {
        window.MultiDimensionalContextAnalyzer.init();
      }
      
      console.log('✅ Analysis engines initialized');
    } catch (error) {
      console.error('❌ Engine initialization error:', error);
      // Continue execution - don't fail completely
    }
  },

  showError(message) {
    console.error('❌ System Error:', message);
    
    // Try to show in UI
    const errorDisplay = document.getElementById('error-display') || document.getElementById('result-display');
    if (errorDisplay) {
      errorDisplay.innerHTML = `
        <div class="error-message" style="background: #ff4444; color: white; padding: 1rem; border-radius: 0.5rem;">
          <h3>システムエラー</h3>
          <p>${message}</p>
          <p><small>詳細はコンソールをご確認ください。</small></p>
        </div>
      `;
    } else {
      alert(message);
    }
    
    this.hideLoading();
  },

  // Enhanced error handling for component loading
  safeLoadComponent(componentName) {
    try {
      const component = window[componentName];
      if (component && typeof component.init === 'function') {
        component.init();
        console.log(`✅ ${componentName} loaded successfully`);
        return true;
      } else {
        console.warn(`⚠️ ${componentName} not available or missing init method`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error loading ${componentName}:`, error.message);
      return false;
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