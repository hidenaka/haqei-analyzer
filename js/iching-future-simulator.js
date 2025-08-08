/**
 * I Ching Future Simulator - Main Controller
 * 易経未来シミュレーター - メインコントローラー
 * 統合システム: 状況分析 → テーマ選択 → 爻変化 → 未来シナリオ
 */

class IChingFutureSimulator {
  constructor(container) {
    this.container = container;
    this.situationAnalyzer = null;
    this.transformationSimulator = null;
    this.metaphorDisplay = null;
    this.branchingSystem = null;
    
    this.currentAnalysis = null;
    this.isInitialized = false;
    
    console.log('🎯 I Ching Future Simulator initializing...');
  }

  /**
   * システム初期化
   */
  async init() {
    try {
      console.log('🔄 Initializing I Ching Future Simulator components...');

      // コンポーネント初期化
      this.initializeComponents();
      
      // H384データ読み込み
      this.loadH384Data();
      
      // イベントリスナー設定
      this.setupEventListeners();
      
      // UI初期化
      this.initializeUI();
      
      this.isInitialized = true;
      console.log('✅ I Ching Future Simulator initialized successfully');
      
      return true;
      
    } catch (error) {
      console.error('❌ Failed to initialize I Ching Future Simulator:', error);
      return false;
    }
  }

  /**
   * コンポーネント初期化
   */
  async initializeComponents() {
    // 状況分析器初期化
    this.situationAnalyzer = new IChingSituationAnalyzer();
    this.situationAnalyzer.init();
    
    // 変化シミュレーター初期化
    this.transformationSimulator = new YaoTransformationSimulator(this.situationAnalyzer);
    this.transformationSimulator.init();
    
    // メタファー表示システム初期化
    const displayContainer = this.container.querySelector('#iching-metaphor-container') || this.container;
    this.metaphorDisplay = new IChingMetaphorDisplay(displayContainer);
    this.metaphorDisplay.init();
    
    // 既存の未来分岐システムとの統合
    if (window.FutureBranchingSystem) {
      this.branchingSystem = new FutureBranchingSystem();
    }
  }

  /**
   * H384データ読み込み
   */
  async loadH384Data() {
    try {
      if (window.H384_DATA && Array.isArray(window.H384_DATA)) {
        console.log('✅ H384_DATA already loaded:', window.H384_DATA.length, 'entries');
        return true;
      }
      
      // H384データスクリプトを動的読み込み
      const script = document.createElement('script');
      script.src = './assets/H384H64database.js';
      
      return new Promise((resolve, reject) => {
        script.onload = () => {
          if (window.H384_DATA && Array.isArray(window.H384_DATA)) {
            console.log('✅ H384_DATA loaded successfully:', window.H384_DATA.length, 'entries');
            resolve(true);
          } else {
            reject(new Error('H384_DATA not available after script load'));
          }
        };
        
        script.onerror = () => {
          reject(new Error('Failed to load H384_DATA script'));
        };
        
        document.head.appendChild(script);
      });
      
    } catch (error) {
      console.error('❌ Failed to load H384 data:', error);
      throw error;
    }
  }

  /**
   * イベントリスナー設定
   */
  setupEventListeners() {
    // 変化トランスフォーメーションイベント
    if (this.metaphorDisplay && this.metaphorDisplay.container) {
      this.metaphorDisplay.container.addEventListener('ichingTransformation', (event) => {
        this.handleTransformation(event.detail);
      });
    }

    // 入力フォームイベント（既存のfuture_simulatorとの統合）
    const analysisForm = document.getElementById('situation-analysis-form');
    if (analysisForm) {
      analysisForm.addEventListener('submit', (event) => {
        event.preventDefault();
        this.handleSituationInput(event);
      });
    }

    // クイック分析ボタン
    const quickAnalysisBtn = document.getElementById('quick-analysis-btn');
    if (quickAnalysisBtn) {
      quickAnalysisBtn.addEventListener('click', () => {
        this.runQuickAnalysis();
      });
    }
  }

  /**
   * UI初期化
   */
  initializeUI() {
    // 入力フォームが存在しない場合は作成
    if (!document.getElementById('situation-input-section')) {
      this.createInputSection();
    }

    // ステータス表示エリア作成
    if (!document.getElementById('simulator-status')) {
      this.createStatusSection();
    }
  }

  /**
   * 入力セクション作成
   */
  createInputSection() {
    const inputSection = document.createElement('div');
    inputSection.id = 'situation-input-section';
    inputSection.className = 'situation-input-section';
    
    inputSection.innerHTML = `
      <div class="input-header">
        <h3>🔍 状況分析</h3>
        <p>現在の状況や悩みを自由に入力してください。易経の知恵で分析し、最適な未来パターンを提示します。</p>
      </div>
      
      <form id="situation-analysis-form" class="analysis-form">
        <div class="input-group">
          <label for="situation-text">現在の状況・悩み・課題</label>
          <textarea 
            id="situation-text" 
            name="situation" 
            rows="4" 
            placeholder="例: 転職を考えているが、今の安定した職場を離れるべきか迷っています。新しい挑戦をしたい気持ちと、リスクを恐れる気持ちが混在しています..."
            required
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="analyze-btn primary">
            <span class="btn-icon">🎯</span>
            状況を分析する
          </button>
          <button type="button" id="quick-analysis-btn" class="analyze-btn secondary">
            <span class="btn-icon">⚡</span>
            クイック分析
          </button>
        </div>
      </form>
      
      <div class="example-situations">
        <h4>分析例</h4>
        <div class="example-grid">
          <button class="example-btn" data-example="career">
            💼 キャリアの悩み
          </button>
          <button class="example-btn" data-example="love">
            💕 恋愛・人間関係
          </button>
          <button class="example-btn" data-example="life">
            🌱 人生の転換点
          </button>
        </div>
      </div>
    `;

    // コンテナの最初に挿入
    this.container.insertBefore(inputSection, this.container.firstChild);

    // サンプル例のイベント設定
    const exampleBtns = inputSection.querySelectorAll('.example-btn');
    exampleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.loadExampleSituation(btn.dataset.example);
      });
    });
    
    this.addInputSectionStyles();
  }

  /**
   * ステータスセクション作成
   */
  createStatusSection() {
    const statusSection = document.createElement('div');
    statusSection.id = 'simulator-status';
    statusSection.className = 'simulator-status';
    
    statusSection.innerHTML = `
      <div class="status-indicator">
        <div class="status-icon">🌟</div>
        <div class="status-text">易経シミュレーター準備完了</div>
      </div>
    `;
    
    this.container.appendChild(statusSection);
  }

  /**
   * 入力セクションスタイル追加
   */
  addInputSectionStyles() {
    if (document.getElementById('input-section-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'input-section-styles';
    styles.textContent = `
      .situation-input-section {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        border: 2px solid rgba(99, 102, 241, 0.3);
        border-radius: 1rem;
        padding: 2rem;
        margin-bottom: 2rem;
        color: #ffffff;
      }

      .input-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .input-header h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, #6366f1, #a855f7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .input-header p {
        color: #94a3b8;
        font-size: 0.975rem;
        line-height: 1.6;
      }

      .analysis-form {
        margin-bottom: 2rem;
      }

      .input-group {
        margin-bottom: 1.5rem;
      }

      .input-group label {
        display: block;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #e2e8f0;
      }

      .input-group textarea {
        width: 100%;
        padding: 1rem;
        background: rgba(51, 65, 85, 0.5);
        border: 1px solid rgba(148, 163, 184, 0.3);
        border-radius: 0.5rem;
        color: #ffffff;
        font-size: 1rem;
        line-height: 1.5;
        resize: vertical;
        font-family: inherit;
      }

      .input-group textarea:focus {
        outline: none;
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      }

      .input-group textarea::placeholder {
        color: #64748b;
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .analyze-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
      }

      .analyze-btn.primary {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: #ffffff;
      }

      .analyze-btn.primary:hover {
        background: linear-gradient(135deg, #5855eb, #7c3aed);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
      }

      .analyze-btn.secondary {
        background: rgba(51, 65, 85, 0.8);
        color: #e2e8f0;
        border: 1px solid rgba(148, 163, 184, 0.3);
      }

      .analyze-btn.secondary:hover {
        background: rgba(71, 85, 105, 0.8);
        border-color: rgba(99, 102, 241, 0.5);
      }

      .example-situations {
        border-top: 1px solid rgba(148, 163, 184, 0.2);
        padding-top: 1.5rem;
      }

      .example-situations h4 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #cbd5e1;
        text-align: center;
      }

      .example-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .example-btn {
        padding: 1rem;
        background: rgba(51, 65, 85, 0.3);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 0.5rem;
        color: #e2e8f0;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.875rem;
        text-align: center;
      }

      .example-btn:hover {
        border-color: rgba(99, 102, 241, 0.5);
        background: rgba(99, 102, 241, 0.1);
        transform: translateY(-2px);
      }

      .simulator-status {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: rgba(30, 41, 59, 0.9);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 0.75rem;
        padding: 1rem;
        color: #ffffff;
        z-index: 1000;
        min-width: 200px;
      }

      .status-indicator {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .status-icon {
        font-size: 1.25rem;
      }

      .status-text {
        font-size: 0.875rem;
        font-weight: 500;
      }

      @media (max-width: 768px) {
        .form-actions {
          flex-direction: column;
        }
        
        .example-grid {
          grid-template-columns: 1fr;
        }
        
        .simulator-status {
          bottom: 1rem;
          right: 1rem;
          left: 1rem;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  /**
   * サンプル状況読み込み
   */
  loadExampleSituation(type) {
    const examples = {
      career: '現在5年間同じ会社で働いていますが、成長が停滞している感じがします。転職を考えていますが、今の安定した環境を離れることへの不安と、新しい挑戦への期待が混在しています。どう判断すべきか迷っています。',
      
      love: '3年付き合っている恋人がいますが、最近将来への不安を感じています。結婚の話も出ていますが、本当にこの人と一生を共にできるのか、他にもっと良い相手がいるのではないかという思いが頭をよぎります。',
      
      life: '人生の大きな転換点に立っています。今の生活は安定していますが、どこか物足りなさを感じています。新しいことを始めたい気持ちと、変化への恐れが戦っていて、どの方向に進むべきか分からない状態です。'
    };

    const textarea = document.getElementById('situation-text');
    if (textarea && examples[type]) {
      textarea.value = examples[type];
      textarea.focus();
    }
  }

  /**
   * 状況入力処理
   */
  async handleSituationInput(event) {
    const formData = new FormData(event.target);
    const situationText = formData.get('situation');
    
    if (!situationText || situationText.trim().length < 10) {
      alert('状況をもう少し詳しく入力してください（10文字以上）');
      return;
    }
    
    await this.analyzeSituation(situationText);
  }

  /**
   * クイック分析実行
   */
  async runQuickAnalysis() {
    const quickSituations = [
      '人生の重要な選択に迫られており、どの道を選ぶべきか迷っています。',
      '新しい環境への変化を考えているが、リスクと可能性のバランスを測りかねています。',
      '現在の状況に満足していないが、具体的にどう変えるべきか方向性が見えません。'
    ];
    
    const randomSituation = quickSituations[Math.floor(Math.random() * quickSituations.length)];
    await this.analyzeSituation(randomSituation);
  }

  /**
   * 状況分析実行
   */
  async analyzeSituation(situationText) {
    if (!this.isInitialized) {
      console.error('❌ Simulator not initialized');
      return;
    }

    try {
      console.log('🔍 Analyzing situation:', situationText.substring(0, 50) + '...');
      
      // ステータス更新
      this.updateStatus('分析中...', '🔄');
      
      // 状況分析実行
      console.log('🎯 [DEBUG] Calling situationAnalyzer.analyzeSituation...');
      const analysisResult = this.situationAnalyzer.analyzeSituation(situationText);
      
      console.log('🎯 [DEBUG] Analysis result received:', !!analysisResult);
      
      if (analysisResult) {
        this.currentAnalysis = {
          ...analysisResult,
          inputText: situationText,
          timestamp: new Date().toISOString()
        };
        
        // 結果表示
        console.log('🎯 [DEBUG] Calling metaphorDisplay.displaySituationAnalysis...');
        this.metaphorDisplay.displaySituationAnalysis(this.currentAnalysis);
        
        // ステータス更新
        this.updateStatus('分析完了 - テーマを選択してください', '✅');
        
        // 入力セクションを畳む
        this.collapsInputSection();
        
        console.log('✅ Situation analysis completed:', this.currentAnalysis);
        
      } else {
        throw new Error('Analysis failed');
      }
      
    } catch (error) {
      console.error('❌ Analysis error:', error);
      this.updateStatus('分析エラー', '❌');
      alert('分析中にエラーが発生しました。もう一度お試しください。');
    }
  }

  /**
   * 変化処理
   */
  async handleTransformation(detail) {
    const { currentSituation, choice } = detail;
    
    if (!currentSituation || !choice) {
      console.error('❌ Invalid transformation data');
      return;
    }

    try {
      console.log('🔄 Processing transformation:', choice);
      
      // ステータス更新
      this.updateStatus('未来シナリオを生成中...', '🔮');
      
      // 変化シミュレーション実行
      const transformationResult = this.transformationSimulator.simulateTransformation(
        currentSituation, 
        choice
      );
      
      if (transformationResult) {
        // 結果表示
        this.metaphorDisplay.displayTransformation(transformationResult);
        
        // 分岐ビジュアライザーとの統合
        if (this.branchingSystem) {
          this.integrateBranchingSystem(transformationResult);
        }
        
        // ステータス更新
        this.updateStatus('シミュレーション完了', '🌟');
        
        console.log('✅ Transformation completed:', transformationResult);
        
      } else {
        throw new Error('Transformation failed');
      }
      
    } catch (error) {
      console.error('❌ Transformation error:', error);
      this.updateStatus('シミュレーションエラー', '❌');
      alert('シミュレーション中にエラーが発生しました。');
    }
  }

  /**
   * 分岐システム統合
   */
  async integrateBranchingSystem(transformationResult) {
    if (!this.branchingSystem) return;

    try {
      // 分岐データを変換
      const branchingData = {
        current: transformationResult.newSituation.h384Entry ? 
          transformationResult.newSituation.h384Entry['現代解釈の要約'] : 
          '新しい状況に移行しました',
        
        choices: transformationResult.scenarios.map(scenario => ({
          type: scenario.type,
          label: scenario.title,
          description: scenario.timeline[0]?.description || scenario.title
        })),
        
        outcomes: transformationResult.scenarios.map(scenario => ({
          type: scenario.type === 'optimistic' ? 'positive' : 
                scenario.type === 'challenging' ? 'challenging' : 'neutral',
          label: scenario.title,
          description: scenario.outcomes[0]?.title || scenario.title,
          timeframe: scenario.timeline[0]?.timeframe || '未来',
          probability: Math.round(scenario.probability * 100)
        }))
      };
      
      // 分岐ビジュアライザーコンテナを探す
      const branchingContainer = document.getElementById('future-branching-container');
      if (branchingContainer && this.branchingSystem) {
        try {
          // 安全にFutureBranchingSystemを初期化
          if (typeof this.branchingSystem.init === 'function') {
            await this.branchingSystem.init(branchingContainer);
          }
          
          // createBranchingメソッドが存在する場合のみ実行
          if (typeof this.branchingSystem.createBranching === 'function') {
            this.branchingSystem.createBranching(branchingData);
          } else {
            console.log('📊 FutureBranchingSystem統合スキップ（createBranchingメソッド未実装）');
          }
        } catch (error) {
          console.warn('⚠️ FutureBranchingSystem統合エラー:', error.message);
        }
      }
      
    } catch (error) {
      console.error('❌ Branching system integration error:', error);
    }
  }

  /**
   * ステータス更新
   */
  updateStatus(text, icon = '🌟') {
    const statusText = document.querySelector('.status-text');
    const statusIcon = document.querySelector('.status-icon');
    
    if (statusText) statusText.textContent = text;
    if (statusIcon) statusIcon.textContent = icon;
  }

  /**
   * 入力セクション折りたたみ
   */
  collapsInputSection() {
    const inputSection = document.getElementById('situation-input-section');
    if (inputSection) {
      inputSection.style.transform = 'translateY(-20px)';
      inputSection.style.opacity = '0.7';
      inputSection.style.maxHeight = '200px';
      inputSection.style.overflow = 'hidden';
      
      // 「再分析」ボタンを追加
      const reanalyzeBtn = document.createElement('button');
      reanalyzeBtn.textContent = '🔄 再分析';
      reanalyzeBtn.className = 'analyze-btn secondary';
      reanalyzeBtn.style.margin = '1rem auto';
      reanalyzeBtn.style.display = 'block';
      
      reanalyzeBtn.addEventListener('click', () => {
        this.expandInputSection();
      });
      
      inputSection.appendChild(reanalyzeBtn);
    }
  }

  /**
   * 入力セクション展開
   */
  expandInputSection() {
    const inputSection = document.getElementById('situation-input-section');
    if (inputSection) {
      inputSection.style.transform = 'translateY(0)';
      inputSection.style.opacity = '1';
      inputSection.style.maxHeight = 'none';
      
      // 再分析ボタン削除
      const reanalyzeBtn = inputSection.querySelector('button:last-child');
      if (reanalyzeBtn && reanalyzeBtn.textContent.includes('再分析')) {
        reanalyzeBtn.remove();
      }
      
      // メタファー表示をリセット
      if (this.metaphorDisplay) {
        this.metaphorDisplay.reset();
      }
      
      this.updateStatus('再分析の準備完了', '🔄');
    }
  }

  /**
   * リセット
   */
  reset() {
    this.currentAnalysis = null;
    
    if (this.metaphorDisplay) {
      this.metaphorDisplay.reset();
    }
    
    this.expandInputSection();
    
    const textarea = document.getElementById('situation-text');
    if (textarea) {
      textarea.value = '';
    }
    
    this.updateStatus('リセット完了', '🔄');
  }

  /**
   * 公開メソッド: 外部からの分析実行
   */
  async analyzeText(text) {
    return await this.analyzeSituation(text);
  }

  /**
   * 公開メソッド: 現在の分析結果取得
   */
  getCurrentAnalysis() {
    return this.currentAnalysis;
  }

  /**
   * 公開メソッド: システム状態確認
   */
  isReady() {
    return this.isInitialized && 
           this.situationAnalyzer && 
           this.transformationSimulator && 
           this.metaphorDisplay;
  }
}

// グローバルスコープに公開
window.IChingFutureSimulator = IChingFutureSimulator;