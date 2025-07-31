// HaQei Analyzer - Results View Component (パフォーマンス最適化版)
// Phase 5.1: 統計システム根本改革対応版
class ResultsView extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.analysisResult = null;
    this.insights = null;
    
    // 🚀 パフォーマンス最適化: レンダリングキャッシュ
    this.renderCache = new Map();
    this.lastRenderTime = 0;
    this.isRendering = false;
    
    // 🚀 最適化: データベース連携強化
    this.dataCache = new Map();
    this.insightCache = new Map();

    // 🔬 Phase 5.1: 科学的フォーマッター初期化
    this.formatter = window.ScientificFormatter ? new window.ScientificFormatter() : null;
    this.statisticalEngine = window.StatisticalEngine ? new window.StatisticalEngine() : null;
    this.behavioralEngine = window.BehavioralInsightEngine ? new window.BehavioralInsightEngine() : null;
    
    console.log("✨ ResultsView initialized with information hierarchy:", !!this.formatter);
    
    // 🎯 画面リサイズ対応
    this.resizeHandler = this.handleResize.bind(this);
    window.addEventListener('resize', this.resizeHandler);
  }

  get defaultOptions() {
    return {
      ...super.defaultOptions,
      onExploreMore: null,
      onRetakeTest: null,
    };
  }

  // 🚀 最適化版: データ設定
  setData(analysisResult, insights) {
    this.analysisResult = analysisResult;
    this.insights = insights;
    
    // 🚀 最適化: 非同期レンダリング
    this.renderOptimized();
  }

  // 🚀 新規: 最適化されたレンダリング
  async renderOptimized() {
    if (this.isRendering) {
      console.log("🚀 Rendering already in progress, skipping duplicate request");
      return;
    }

    this.isRendering = true;
    
    try {
      // 🚀 最適化: 即座に基本構造を表示
      this.renderSkeletonStructure();
      
      // 🚀 最適化: 詳細情報を段階的に読み込み
      await this.loadDataProgressively();
      
    } catch (error) {
      console.error("❌ Error during optimized rendering:", error);
      this.renderFallback();
    } finally {
      this.isRendering = false;
    }
  }

  // 🚀 新規: スケルトン構造の表示
  renderSkeletonStructure() {
    if (!this.analysisResult) {
      this.container.innerHTML = `
        <div class="results-container">
          <div class="error">分析結果が見つかりません。</div>
        </div>
      `;
      return;
    }

    // ✨ 情報階層最適化: bunenjin哲学に基づく段階的表示構造
    this.container.innerHTML = `
      <div class="results-container loading information-hierarchy">
        <div class="results-header">
          <h2 class="results-title priority-critical">✨ あなたの行動パターンが見えてきました</h2>
          <div class="key-insight insight-container critical skeleton">
            <div class="loading-skeleton loading-placeholder">あなたの行動の核心的理由を分析中...</div>
          </div>
        </div>
        
        <div class="results-content information-grid">
          <div class="behavioral-insights insight-container high skeleton">
            <h3 class="priority-high">💡 「なぜあんな行動をしたのか？」の答え</h3>
            <div class="loading-skeleton loading-placeholder">行動パターンを分析中...</div>
          </div>
          
          <div class="constellation-section insight-container high skeleton">
            <h3 class="priority-high">✨ あなたの3つの人格OS - 星座図</h3>
            <div class="loading-skeleton loading-placeholder">星座表示を準備中...</div>
          </div>
          
          <div class="behavioral-flow-section insight-container medium skeleton">
            <h3 class="priority-medium">🎭 行動フローの分析 - あの時なぜその行動を？</h3>
            <div class="loading-placeholder">行動の時系列フローを分析中...</div>
          </div>
          
          <div class="action-suggestions insight-container low skeleton">
            <h3 class="priority-low">🎯 今日から試せること</h3>
            <div class="loading-skeleton loading-placeholder">具体的な改善提案を準備中...</div>
          </div>
          
          <div class="detailed-analysis skeleton" style="margin-top: 2rem;">
            <h3>📊 詳細分析（optional）</h3>
            <div class="loading-placeholder">詳細データを読み込み中...</div>
          </div>
        </div>
      </div>
    `;
  }

  // 🚀 新規: 段階的データ読み込み
  async loadDataProgressively() {
    // 🧠 Sequential OS Introduction System - 認知負荷最小化
    
    // Stage 1: Single Focus - Engine OS（本質的なあなた）のみ提示
    await this.introduceEngineOS();
    await this.waitForEngagement(3000);
    
    // Stage 2: Contextual Comparison - Interface OS（でも社会では...）
    await this.revealInterfaceContrast();
    await this.measureAhaResponse();
    
    // Stage 3: Complete Picture - Safe Mode OS（そして守るときは...）  
    await this.integrateSafeModeOS();
    
    // Stage 4: Synthesis - 統合された気づき（だから私は...）
    await this.synthesizeTripleInsight();
    
    // Stage 5: Action Bridge - 行動変容への橋渡し
    await this.bridgeToAction();
    await this.loadDetailedAnalysis();
    
    // 🚀 最終段階 - イベントバインドとクリーンアップ
    this.bindEvents();
    this.cleanupAnimations();
    this.enableInteractivity();
  }

  // ⏱️ 新規: タイミング制御用delay関数
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 🧹 新規: アニメーション完了後のクリーンアップ
  cleanupAnimations() {
    // ローディング状態を解除
    this.container.querySelector('.results-container')?.classList.remove('loading');
    
    // GPU加速を無効化してパフォーマンスを最適化
    const animatedElements = this.container.querySelectorAll('.hierarchy-priority-1, .hierarchy-priority-2, .hierarchy-priority-3, .hierarchy-priority-4');
    animatedElements.forEach(el => {
      el.classList.add('hierarchy-revealed');
    });
    
    console.log('✅ アニメーション最適化完了');
  }

  // 🎯 新規: インタラクティブ機能の有効化
  enableInteractivity() {
    // 情報密度の自動調整
    this.adjustInformationDensity();
    
    // Progressive Disclosure機能の有効化
    this.initializeProgressiveDisclosure();
    
    console.log('✅ インタラクティブ機能有効化完了');
  }

  // 📱 新規: 情報密度の自動調整
  adjustInformationDensity() {
    const container = this.container.querySelector('.results-container');
    const screenWidth = window.innerWidth;
    
    // 画面サイズに応じた情報密度クラスの設定
    container.classList.remove('information-density-high', 'information-density-medium', 'information-density-low');
    
    if (screenWidth < 768) {
      container.classList.add('information-density-low');
    } else if (screenWidth < 1200) {
      container.classList.add('information-density-medium');
    } else {
      container.classList.add('information-density-high');
    }
    
    console.log(`📱 Information density adjusted for screen width: ${screenWidth}px`);
  }

  // 🔄 新規: Progressive Disclosureの初期化
  initializeProgressiveDisclosure() {
    const triggers = this.container.querySelectorAll('.disclosure-trigger');
    
    triggers.forEach(trigger => {
      // アクセシビリティ属性の設定
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('tabindex', '0');
      
      // キーボード操作対応
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleDisclosure(trigger);
        }
      });
    });
    
    console.log('🔄 Progressive Disclosure initialized');
  }

  // 📱 新規: レスポンシブ対応の画面リサイズ処理
  handleResize() {
    // 情報密度の再調整
    this.adjustInformationDensity();
    
    // Triple OS星座の位置調整（モバイル対応）
    const constellation = this.container.querySelector('.triple-os-constellation');
    if (constellation) {
      this.adjustConstellationLayout();
    }
  }

  // 🌟 星座レイアウト調整
  adjustConstellationLayout() {
    const screenWidth = window.innerWidth;
    const osStars = this.container.querySelectorAll('.os-star');
    
    if (screenWidth < 768) {
      // モバイル: 縦配置
      osStars.forEach((star, index) => {
        star.style.position = 'relative';
        star.style.top = 'auto';
        star.style.left = 'auto';
        star.style.margin = '1rem auto';
        star.style.display = 'block';
      });
    } else {
      // デスクトップ: 星座配置
      osStars.forEach(star => {
        star.style.position = 'absolute';
        star.style.margin = '';
        star.style.display = 'flex';
      });
    }
  }
  }

  // 📱 新規: モバイル用折りたたみ機能
  enableCollapsibleSections(enable) {
    const lowPriorityElements = this.container.querySelectorAll('.priority-low');
    
    lowPriorityElements.forEach(el => {
      if (enable) {
        // モバイルでは低優先度情報を折りたたみ可能に
        if (!el.classList.contains('collapsible')) {
          el.classList.add('collapsible');
          el.addEventListener('click', this.handleCollapsibleClick.bind(this));
        }
      } else {
        // デスクトップ・タブレットでは折りたたみ解除
        el.classList.remove('collapsible', 'expanded');
        el.removeEventListener('click', this.handleCollapsibleClick.bind(this));
      }
    });
  }

  // 📱 新規: 折りたたみクリックハンドラー
  handleCollapsibleClick(event) {
    const element = event.target.closest('.collapsible');
    if (element) {
      element.classList.toggle('expanded');
    }
  }

  // ⚡ 新規: パフォーマンス最適化用debounce関数
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 🧠 Stage 1: Engine OS（本質的なあなた）単独紹介
  async introduceEngineOS() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const keyInsightEl = this.container.querySelector('.key-insight');
        const engineOS = this.analysisResult.engineOS || this.analysisResult.primaryOS;
        
        if (keyInsightEl && engineOS) {
          keyInsightEl.innerHTML = `
            <div class="engine-os-introduction fade-in">
              <div class="stage-indicator">Step 1/5</div>
              <h3>🔧 あなたの「本質的なOS」</h3>
              <div class="os-card-large engine-focus">
                <div class="os-name">${engineOS.osName || engineOS.hexagramInfo?.name || "分析中"}</div>
                <div class="os-description">${engineOS.hexagramInfo?.description || "あなたの核となる価値観・本質"}</div>
                <div class="os-match-rate">${this.formatScientificPercentage(engineOS.matchPercentage || engineOS.strength || 0)}</div>
              </div>
              <div class="single-focus-explanation">
                <p><strong>これが「一人の時のあなた」「心の奥底のあなた」です。</strong></p>
                <p>家族といる時、一人で考えている時、本当に大切な決断をする時に現れる姿です。</p>
                <div class="engagement-prompt">
                  <span>💭 この特徴、思い当たりますか？</span>
                </div>
              </div>
            </div>
          `;
          keyInsightEl.classList.remove('skeleton');
        }
        resolve();
      });
    });
  }

  // 🧠 Stage 2: Interface OS（社会的な違い）の対比提示
  async revealInterfaceContrast() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const behavioralInsightsEl = this.container.querySelector('.behavioral-insights');
        const engineOS = this.analysisResult.engineOS || this.analysisResult.primaryOS;
        const interfaceOS = this.analysisResult.interfaceOS;
        
        if (behavioralInsightsEl && engineOS && interfaceOS) {
          behavioralInsightsEl.innerHTML = `
            <div class="interface-contrast-reveal fade-in">
              <div class="stage-indicator">Step 2/5</div>
              <h3>🎭 でも、社会では別の姿に...</h3>
              
              <div class="contrast-cards">
                <div class="contrast-card personal">
                  <h4>👤 個人的なあなた</h4>
                  <div class="os-mini-card">${engineOS.osName || "本質的OS"}</div>
                  <p>家族や親しい人の前での姿</p>
                </div>
                
                <div class="contrast-arrow">→</div>
                
                <div class="contrast-card social">
                  <h4>🏢 社会的なあなた</h4>
                  <div class="os-mini-card interface">${interfaceOS.osName || "社会的OS"}</div>
                  <p>職場や初対面の人の前での姿</p>
                </div>
              </div>
              
              <div class="aha-moment-trigger">
                <p><strong>「なるほど！だから職場と家では私が違うのか」</strong></p>
                <p>この使い分けは自然で健全なことです。みんなが無意識にやっています。</p>
              </div>
              
              <!-- Triple OS Constellation View -->
              <div class="constellation-section">
                <h4>🌟 あなたの3つのOSの関係</h4>
                ${this.renderTripleOSConstellation()}
                <p class="constellation-note">星をクリックすると詳細が表示されます</p>
              </div>
            </div>
          `;
          behavioralInsightsEl.classList.remove('skeleton');
        }
        resolve();
      });
    });
  }

  // 🧠 Stage 3: Safe Mode OS（防御システム）の統合
  async integrateSafeModeOS() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const actionSuggestionsEl = this.container.querySelector('.action-suggestions');
        const safeModeOS = this.analysisResult.safeModeOS;
        
        if (actionSuggestionsEl && safeModeOS) {
          actionSuggestionsEl.innerHTML = `
            <div class="safemode-integration fade-in">
              <div class="stage-indicator">Step 3/5</div>
              <h3>🛡️ そして、守る時のあなた</h3>
              
              <div class="protection-explanation">
                <div class="safemode-card">
                  <div class="os-name">${safeModeOS.osName || "防御OS"}</div>
                  <div class="os-role">困難・ストレス・脅威から自分を守る時に発動</div>
                </div>
                
                <div class="protection-examples">
                  <h4>💡 こんな時に発動します</h4>
                  <ul>
                    <li>批判されそうな時</li>
                    <li>失敗を恐れる時</li>
                    <li>プレッシャーを感じる時</li>
                    <li>不安や心配がある時</li>
                  </ul>
                </div>
                
                <div class="healthy-defense">
                  <p><strong>🌟 これは「悪いもの」ではありません</strong></p>
                  <p>あなたを守るための大切な防御機制です。適切に理解することで、より健全に活用できます。</p>
                </div>
              </div>
            </div>
          `;
          actionSuggestionsEl.classList.remove('skeleton');
        }
        resolve();
      });
    });
  }

  // 🧠 Stage 4: 統合された気づき（だから私は...）
  async synthesizeTripleInsight() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const detailedAnalysisEl = this.container.querySelector('.detailed-analysis');
        
        if (detailedAnalysisEl && this.behavioralEngine) {
          const insights = this.behavioralEngine.generateBehavioralInsights(this.analysisResult);
          
          detailedAnalysisEl.innerHTML = `
            <div class="triple-synthesis fade-in">
              <div class="stage-indicator">Step 4/5</div>
              <h3>✨ 「だから私はあの時...」の答え</h3>
              
              <div class="insight-revelation">
                <div class="revelation-card">
                  <h4>🎯 あなたの行動パターンの全体像</h4>
                  <p class="main-insight">${insights.keyInsight.content}</p>
                  
                  <div class="behavioral-examples">
                    <h5>具体例：こんな時のあなた</h5>
                    ${insights.behavioralPatterns.map(pattern => `
                      <div class="pattern-example">
                        <strong>${pattern.situation}</strong>
                        <p>${pattern.pattern}</p>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
              
              <div class="understanding-check">
                <p>💭 「そうそう、まさにそれ！」と思える部分はありましたか？</p>
              </div>
              
              <!-- Behavioral Flow Timeline -->
              ${this.generateBehavioralFlowVisualization()}
            </div>
          `;
          detailedAnalysisEl.classList.remove('skeleton');
        }
        resolve();
      });
    });
  }

  // 🧠 Stage 5: 行動変容への橋渡し
  async bridgeToAction() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        // 新しい要素を作成して追加
        const actionBridgeEl = document.createElement('div');
        actionBridgeEl.className = 'action-bridge-section';
        actionBridgeEl.innerHTML = `
          <div class="action-bridge fade-in">
            <div class="stage-indicator">Step 5/5</div>
            <h3>🚀 今日から変われること</h3>
            
            <div class="transformation-pathway">
              <div class="pathway-step">
                <h4>🎯 今日から意識すること</h4>
                <p>「今、どのOSで行動しているかな？」と気づく練習をしてみてください。</p>
              </div>
              
              <div class="pathway-step">
                <h4>🌱 今週試せること</h4>
                <p>意識的に本質的なあなた（Engine OS）で決断する場面を1つ作ってみてください。</p>
              </div>
              
              <div class="pathway-step">
                <h4>🔮 さらに深く知りたい方へ</h4>
                <p>実際の悩みや状況を入力して、あなた専用の戦略的アドバイスを受けてみませんか？</p>
                <button class="btn btn-primary" id="explore-future-simulator">
                  Future Simulatorで具体的な戦略を立てる
                </button>
              </div>
            </div>
          </div>
        `;
        
        this.container.appendChild(actionBridgeEl);
        resolve();
      });
    });
  }

  // ユーティリティ：エンゲージメント待機
  async waitForEngagement(duration) {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    });
  }

  // ユーティリティ：Ahaモーメント測定（今後の拡張用）
  async measureAhaResponse() {
    // 今後、アイトラッキングやクリック測定を実装予定
    return new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
  }

  // 🌟 Triple OS Constellation View レンダリング
  renderTripleOSConstellation() {
    const engineOS = this.analysisResult.engineOS || this.analysisResult.primaryOS;
    const interfaceOS = this.analysisResult.interfaceOS;
    const safeModeOS = this.analysisResult.safeModeOS;

    return `
      <div class="constellation-container" id="triple-os-constellation">
        <!-- Engine OS Star -->
        <div class="os-star engine-os-star" data-os="engine" data-tooltip="本質的なあなた">
          <div class="os-star-name">${this.truncateOSName(engineOS?.osName || "Engine OS")}</div>
          <div class="os-star-type">本質</div>
        </div>
        
        <!-- Interface OS Star -->
        <div class="os-star interface-os-star" data-os="interface" data-tooltip="社会的なあなた">
          <div class="os-star-name">${this.truncateOSName(interfaceOS?.osName || "Interface OS")}</div>
          <div class="os-star-type">社会</div>
        </div>
        
        <!-- Safe Mode OS Star -->
        <div class="os-star safemode-os-star" data-os="safemode" data-tooltip="守る時のあなた">
          <div class="os-star-name">${this.truncateOSName(safeModeOS?.osName || "Safe Mode OS")}</div>
          <div class="os-star-type">防御</div>
        </div>
        
        <!-- Connection Lines -->
        <div class="constellation-line line-engine-interface"></div>
        <div class="constellation-line line-engine-safemode"></div>
        <div class="constellation-line line-interface-safemode"></div>
        
        <!-- Explanation Panel -->
        <div class="constellation-explanation">
          3つのOSが連携してあなたの行動を形成しています
        </div>
      </div>
    `;
  }

  // ユーティリティ：OS名の短縮（星座表示用）
  truncateOSName(osName) {
    if (!osName) return "OS";
    
    // 長すぎる名前を短縮
    if (osName.length > 8) {
      return osName.substring(0, 6) + "...";
    }
    return osName;
  }

  // 🔄 Behavioral Flow Timeline 生成
  generateBehavioralFlowVisualization() {
    const engineOS = this.analysisResult.engineOS || this.analysisResult.primaryOS;
    const interfaceOS = this.analysisResult.interfaceOS;
    const safeModeOS = this.analysisResult.safeModeOS;

    return `
      <div class="behavioral-flow-container">
        <h4>🔄 あなたの行動パターンの流れ</h4>
        <div class="flow-timeline animated">
          <div class="flow-step trigger">
            <div class="step-icon">⚡</div>
            <h5>きっかけ</h5>
            <p>${this.getContextualTrigger()}</p>
            <div class="flow-step-detail">
              <strong>具体例：</strong><br>
              ・会議での発言を求められる<br>
              ・新しいプロジェクトの依頼<br>  
              ・人間関係のトラブル
            </div>
          </div>
          
          <div class="flow-arrow">→</div>
          
          <div class="flow-step os-activation">
            <div class="step-icon">🧠</div>
            <h5>OS起動</h5>
            <p>${this.getPrimaryOSActivation(engineOS, interfaceOS, safeModeOS)}</p>
            <div class="flow-step-detail">
              <strong>あなたの場合：</strong><br>
              状況に応じて3つのOSが使い分けられます
            </div>
          </div>
          
          <div class="flow-arrow">→</div>
          
          <div class="flow-step action">
            <div class="step-icon">🎯</div>
            <h5>行動</h5>
            <p>${this.getTypicalAction()}</p>
            <div class="flow-step-detail">
              <strong>行動の特徴：</strong><br>
              OSの特性が行動に現れます
            </div>
          </div>
          
          <div class="flow-arrow">→</div>
          
          <div class="flow-step result">
            <div class="step-icon">✨</div>
            <h5>結果</h5>
            <p>${this.getTypicalOutcome()}</p>
            <div class="flow-step-detail">
              <strong>結果の傾向：</strong><br>
              OSの組み合わせが結果を決定します
            </div>
          </div>
        </div>
        
        <div class="behavior-examples">
          <h5>💡 実際のパターン例</h5>
          ${this.generateScenarioExamples()}
        </div>
      </div>
    `;
  }

  // きっかけパターンの取得
  getContextualTrigger() {
    return "重要な決断や対人関係の場面";
  }

  // OS起動パターンの取得
  getPrimaryOSActivation(engineOS, interfaceOS, safeModeOS) {
    const engineName = engineOS?.osName || "価値観重視";
    const interfaceName = interfaceOS?.osName || "社会適応";
    const safeModeName = safeModeOS?.osName || "防御";
    
    return `${engineName}・${interfaceName}・${safeModeName}のいずれかが起動`;
  }

  // 典型的行動の取得
  getTypicalAction() {
    return "OSの特性に基づいた判断・行動";
  }

  // 典型的結果の取得
  getTypicalOutcome() {
    return "OSに応じた結果・感情";
  }

  // シナリオ例の生成
  generateScenarioExamples() {
    const engineOS = this.analysisResult.engineOS || this.analysisResult.primaryOS;
    const interfaceOS = this.analysisResult.interfaceOS;
    const safeModeOS = this.analysisResult.safeModeOS;

    return `
      <div class="example-scenario">
        <div class="scenario-title">📍 プライベートな決断</div>
        <div class="scenario-flow">
          <span class="scenario-step">個人的状況</span>
          <span>→</span>
          <span class="scenario-step">${engineOS?.osName || "Engine OS"}起動</span>
          <span>→</span>
          <span class="scenario-step">価値観重視の判断</span>
          <span>→</span>
          <span class="scenario-step">本質的な選択</span>
        </div>
      </div>
      
      <div class="example-scenario">
        <div class="scenario-title">🏢 職場での対応</div>
        <div class="scenario-flow">
          <span class="scenario-step">社会的状況</span>
          <span>→</span>
          <span class="scenario-step">${interfaceOS?.osName || "Interface OS"}起動</span>
          <span>→</span>
          <span class="scenario-step">適応的な行動</span>
          <span>→</span>
          <span class="scenario-step">社会的成功</span>
        </div>
      </div>
      
      <div class="example-scenario">
        <div class="scenario-title">⚠️ ストレス状況</div>
        <div class="scenario-flow">
          <span class="scenario-step">脅威・困難</span>
          <span>→</span>
          <span class="scenario-step">${safeModeOS?.osName || "Safe Mode OS"}起動</span>
          <span>→</span>
          <span class="scenario-step">防御的行動</span>
          <span>→</span>
          <span class="scenario-step">自己保護</span>
        </div>
      </div>
    `;
  }

  // 🚀 旧メソッドのリファクタリング: 核心的気づき読み込み
  async loadKeyInsight() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const keyInsightEl = this.container.querySelector('.key-insight');
        
        if (keyInsightEl && this.behavioralEngine && this.analysisResult) {
          const insights = this.behavioralEngine.generateBehavioralInsights(this.analysisResult);
          
          keyInsightEl.innerHTML = `
            <div class="insight-card bunenjin-balance interactive-element priority-critical">
              <h4 class="priority-critical">${insights.keyInsight.title}</h4>
              <p class="main-insight priority-critical">${insights.keyInsight.content}</p>
              <p class="insight-explanation priority-high">${insights.keyInsight.explanation}</p>
            </div>
          `;
          keyInsightEl.classList.remove('skeleton');
        }
        resolve();
      });
    });
  }

  // 🚀 新規: 行動パターン説明読み込み
  async loadBehavioralPatterns() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const behavioralInsightsEl = this.container.querySelector('.behavioral-insights');
        
        if (behavioralInsightsEl && this.behavioralEngine && this.analysisResult) {
          const insights = this.behavioralEngine.generateBehavioralInsights(this.analysisResult);
          
          const patternsHtml = insights.behavioralPatterns.map(pattern => `
            <div class="pattern-card interactive-element priority-high">
              <h5 class="priority-high">📍 ${pattern.situation}</h5>
              <p class="priority-high"><strong>${pattern.pattern}</strong></p>
              <p class="example priority-medium"><em>例：${pattern.example}</em></p>
            </div>
          `).join('');
          
          behavioralInsightsEl.innerHTML = `
            <div class="patterns-container bagua-connection">
              ${patternsHtml}
            </div>
          `;
          behavioralInsightsEl.classList.remove('skeleton');
        }
        resolve();
      });
    });
  }

  // 🚀 新規: 行動提案読み込み
  async loadActionSuggestions() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const actionSuggestionsEl = this.container.querySelector('.action-suggestions');
        
        if (actionSuggestionsEl && this.behavioralEngine && this.analysisResult) {
          const insights = this.behavioralEngine.generateBehavioralInsights(this.analysisResult);
          
          const actionsHtml = insights.actionSuggestions.map(action => `
            <div class="action-card interactive-element priority-low">
              <h5 class="priority-medium">${action.title}</h5>
              <p class="action-text priority-low"><strong>${action.action}</strong></p>
              <p class="action-why priority-low">${action.why}</p>
            </div>
          `).join('');
          
          actionSuggestionsEl.innerHTML = `
            <div class="actions-container">
              ${actionsHtml}
              <div class="next-step insight-container low">
                <p class="priority-low"><strong>🚀 さらに深く理解したい方へ</strong></p>
                <p class="priority-low">実際の悩みや状況に基づいた戦略的アドバイスを受けることができます。</p>
                <button class="btn btn-outline-primary interactive-element priority-low" id="explore-future-simulator">
                  Future Simulatorで具体的な戦略を立てる
                </button>
              </div>
            </div>
          `;
          actionSuggestionsEl.classList.remove('skeleton');
        }
        resolve();
      });
    });
  }

  // 🚀 新規: 詳細分析データ読み込み
  async loadDetailedAnalysis() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const primaryOS = this.analysisResult.primaryOS || this.analysisResult.engineOS;
        const primaryResultEl = this.container.querySelector('.primary-result');
        
        if (primaryResultEl && primaryOS) {
          primaryResultEl.innerHTML = `
            <div class="hexagram-display insight-container low">
              <div class="hexagram-name priority-medium">${primaryOS?.hexagramInfo?.name || primaryOS?.osName || "分析結果"}</div>
              <div class="hexagram-reading priority-low">${
                primaryOS?.hexagramInfo?.reading || primaryOS?.hexagramInfo?.name_jp || primaryOS?.hexagramInfo?.description || ""
              }</div>
              <div class="match-percentage priority-low">${this.formatScientificPercentage(primaryOS?.matchPercentage || primaryOS?.strength || 0)}</div>
              <div class="trigram-composition priority-low">構成八卦: ${this.getTrigramComposition(primaryOS)}</div>
            </div>
          `;
          primaryResultEl.classList.remove('skeleton');
        }
        resolve();
      });
    });
  }

  // 🚀 新規: 次元データ読み込み
  async loadDimensionData() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const dimensionChart = this.container.querySelector('.dimension-chart');
        const vector = this.analysisResult.eightDimensionVector || this.analysisResult.dimensions || this.analysisResult.primaryOS?.userVector;
        
        if (dimensionChart) {
          dimensionChart.innerHTML = `
            <h3>8次元バランス</h3>
            <div class="dimensions-grid fade-in">
              ${this.renderDimensionScores(vector)}
            </div>
          `;
          dimensionChart.classList.remove('skeleton');
        }
        resolve();
      });
    });
  }

  // 🚀 新規: 洞察データ読み込み
  async loadInsightData() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const insightsSection = this.container.querySelector('.insights-section');
        
        if (insightsSection) {
          insightsSection.innerHTML = `
            <h3>深い洞察</h3>
            <div class="insights-content fade-in">
              ${this.renderInsightsOptimized()}
            </div>
          `;
          insightsSection.classList.remove('skeleton');
        }
        resolve();
      });
    });
  }

  // 🚀 新規: その他データ読み込み
  async loadAdditionalData() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const resultsContent = this.container.querySelector('.results-content');
        
        // 代替マッチとアクションボタンを追加
        const additionalHTML = `
          <div class="alternative-matches fade-in">
            <h3>その他の可能性</h3>
            <div class="matches-list">
              ${this.renderAlternativeMatches()}
            </div>
          </div>

          <div class="results-actions fade-in">
            <button id="explore-more-btn" class="btn btn-primary">
              💡 さらに詳しく探る
            </button>
            <button id="retake-test-btn" class="btn btn-secondary">
              🔄 もう一度診断する
            </button>
          </div>

          ${this.renderPremiumSection()}
          ${this.renderDataManagementSection()}
        `;
        
        resultsContent.insertAdjacentHTML('beforeend', additionalHTML);
        
        // ローディング状態を解除
        this.container.querySelector('.results-container').classList.remove('loading');
        
        resolve();
      });
    });
  }

  render() {
    if (!this.analysisResult) {
      this.container.innerHTML = `
        <div class="results-container">
          <div class="error">分析結果が見つかりません。</div>
        </div>
      `;
      return;
    }

    // TripleOS結果の場合は適切にデータを取得
    const primaryOS = this.analysisResult.primaryOS || this.analysisResult.engineOS;
    const vector = this.analysisResult.eightDimensionVector || this.analysisResult.dimensions || primaryOS?.userVector;

    this.container.innerHTML = `
      <div class="results-container">
        <div class="results-header">
          <h2 class="results-title">🎯 あなたの人格OS</h2>
          <div class="primary-result">
            <div class="hexagram-display">
              <div class="hexagram-name">${primaryOS?.hexagramInfo?.name || primaryOS?.osName || "分析結果"}</div>
              <div class="hexagram-reading">${
                primaryOS?.hexagramInfo?.reading || primaryOS?.hexagramInfo?.name_jp || ""
              }</div>
              <div class="match-percentage">${this.formatScientificPercentage(primaryOS?.matchPercentage || primaryOS?.strength || 0)}</div>
              <div class="trigram-composition">構成八卦: ${this.getTrigramComposition(
                primaryOS
              )}</div>
            </div>
          </div>
        </div>

        <div class="results-content">
          <div class="dimension-chart">
            <h3>8次元バランス</h3>
            <div class="dimensions-grid">
              ${this.renderDimensionScores(vector)}
            </div>
          </div>

          <div class="insights-section">
            <h3>深い洞察</h3>
            <div class="insights-content">
              ${this.renderInsights()}
            </div>
          </div>

          <div class="alternative-matches">
            <h3>その他の可能性</h3>
            <div class="matches-list">
              ${this.renderAlternativeMatches()}
            </div>
          </div>
        </div>

        <div class="results-actions">
          <button id="explore-more-btn" class="btn btn-primary">
            💡 さらに詳しく探る
          </button>
          <button id="retake-test-btn" class="btn btn-secondary">
            🔄 もう一度診断する
          </button>
        </div>

        <div class="premium-section">
          <div class="premium-card">
            <div class="premium-header">
              <h3>🌟 プロフェッショナル戦略レポート</h3>
              <div class="premium-price">¥2,980</div>
            </div>
            <div class="premium-content">
              <p class="premium-description">
                あなたの<strong>${primaryOS?.hexagramInfo?.name || primaryOS?.osName || "人格OS"}</strong>に特化した、
                Gemini Pro AIによる高精度な実践戦略レポートを取得しませんか？
              </p>
              
              <div class="premium-benefits">
                <h4>無料版との違い</h4>
                <div class="comparison-grid">
                  <div class="comparison-item">
                    <div class="free-feature">無料版: 「分析」</div>
                    <div class="premium-feature">有料版: 「実践戦略」</div>
                  </div>
                  <div class="comparison-item">
                    <div class="free-feature">無料版: 「知る」</div>
                    <div class="premium-feature">有料版: 「行動する」</div>
                  </div>
                  <div class="comparison-item">
                    <div class="free-feature">無料版: 「理解」</div>
                    <div class="premium-feature">有料版: 「変化」</div>
                  </div>
                </div>

                <div class="benefits-list">
                  <div class="benefit-item">
                    <span class="benefit-icon">📋</span>
                    <span class="benefit-text">具体的な行動計画（最初の三手）</span>
                  </div>
                  <div class="benefit-item">
                    <span class="benefit-icon">🛡️</span>
                    <span class="benefit-text">リスク管理戦略（守りの戦略）</span>
                  </div>
                  <div class="benefit-item">
                    <span class="benefit-icon">📈</span>
                    <span class="benefit-text">3ヶ月実行ロードマップ</span>
                  </div>
                  <div class="benefit-item">
                    <span class="benefit-icon">🤝</span>
                    <span class="benefit-text">6ヶ月継続サポートシステム</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="premium-actions">
              <button id="upgrade-to-premium-btn" class="btn btn-premium">
                🚀 プロフェッショナルレポートを取得する
              </button>
              <div class="premium-note">
                診断結果は自動的に引き継がれます
              </div>
            </div>
          </div>
        </div>

        <div class="data-management-section">
          <div class="data-card">
            <h3>📊 診断データの管理</h3>
            <p>あなたの診断結果を保存・エクスポートして、他のツールでも活用できます。</p>
            
            <div class="data-actions">
              <button id="export-json-btn" class="btn btn-outline">
                📄 JSON形式でエクスポート
              </button>
              <button id="export-summary-btn" class="btn btn-outline">
                📝 サマリーをエクスポート
              </button>
              <button id="view-insights-btn" class="btn btn-outline">
                🔍 詳細洞察を表示
              </button>
            </div>
            
            <div class="cross-platform-info">
              <h4>他のHaQeiツールとの連携</h4>
              <div class="platform-links">
                <a href="future_simulator.html" class="platform-link">
                  🔮 未来分岐シミュレーター
                </a>
                <a href="cockpit.html" class="platform-link">
                  🎛️ 戦略コックピット
                </a>
                <a href="library.html" class="platform-link">
                  📚 HaQeiライブラリ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderDimensionScores(vector) {
    if (!vector) {
      return '<p>8次元データを読み込み中...</p>';
    }

    const dimensions = [
      { key: "乾_創造性", name: "創造性", icon: "🌟" },
      { key: "震_行動性", name: "行動性", icon: "⚡" },
      { key: "坎_探求性", name: "探求性", icon: "🔍" },
      { key: "艮_安定性", name: "安定性", icon: "🗻" },
      { key: "坤_受容性", name: "受容性", icon: "🌍" },
      { key: "巽_適応性", name: "適応性", icon: "🌊" },
      { key: "離_表現性", name: "表現性", icon: "🔥" },
      { key: "兌_調和性", name: "調和性", icon: "☯️" },
    ];

    return dimensions
      .map((dim) => {
        const score = vector[dim.key] || 0;
        // スコアが-5〜+5の範囲から0〜1に正規化後、科学的フォーマッター使用
        const normalizedScore = Math.max(0, Math.min(1, (score + 5) / 10));
        const percentage = this.formatScientificPercentage(normalizedScore).replace('%', '');

        return `
        <div class="dimension-item">
          <div class="dimension-header">
            <span class="dimension-icon">${dim.icon}</span>
            <span class="dimension-name">${dim.name}</span>
            <span class="dimension-score">${this.formatScientificScore(score)}</span>
          </div>
          <div class="dimension-bar">
            <div class="dimension-fill" style="width: ${percentage}%"></div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  // 🚀 最適化版: 洞察レンダリング
  renderInsightsOptimized() {
    const cacheKey = `insights_${this.analysisResult?.primaryOS?.hexagramInfo?.name || 'default'}`;
    
    if (this.insightCache.has(cacheKey)) {
      return this.insightCache.get(cacheKey);
    }

    let insightsHTML;

    if (!this.insights) {
      // 🚀 最適化: データベースから動的に洞察を生成
      insightsHTML = this.generateDynamicInsights();
    } else {
      insightsHTML = `
        <div class="insight-summary">
          <h4>🎯 総合的な洞察</h4>
          <p>${this.insights.summary}</p>
        </div>
        
        <div class="insight-details">
          <h4>🔍 詳細な特徴</h4>
          <ul>
            ${
              this.insights.details
                ?.map((detail) => `<li>${detail}</li>`)
                .join("") || "<li>詳細な洞察を生成中...</li>"
            }
          </ul>
        </div>
        
        <div class="insight-recommendations">
          <h4>💡 おすすめのアクション</h4>
          <ul>
            ${
              this.insights.recommendations
                ?.map((rec) => `<li>${rec}</li>`)
                .join("") || "<li>推奨事項を生成中...</li>"
            }
          </ul>
        </div>
      `;
    }

    this.insightCache.set(cacheKey, insightsHTML);
    return insightsHTML;
  }

  // 🚀 新規: OS Manual Database活用の動的洞察生成
  generateDynamicInsights() {
    const primaryOS = this.analysisResult.primaryOS || this.analysisResult.engineOS;
    const vector = this.analysisResult.eightDimensionVector || this.analysisResult.dimensions || primaryOS?.userVector;

    if (!primaryOS || !primaryOS.osId) {
      return "<p>洞察を生成中...</p>";
    }

    // OS Manual Databaseから詳細データを取得
    const osManualData = this.getOSManualData(primaryOS.osId);
    
    if (osManualData) {
      // データベースから実際のコンテンツを使用
      return this.renderDatabaseInsights(osManualData, primaryOS);
    }

    // フォールバック: 従来の動的生成
    const hexagramName = primaryOS.hexagramInfo?.name || primaryOS.osName || "未知の人格OS";
    const hexagramDescription = primaryOS.hexagramInfo?.description || primaryOS.hexagramInfo?.catchphrase || "";
    const matchPercentage = primaryOS.matchPercentage || primaryOS.strength || 0;

    // 八卦情報からより詳細な洞察を生成
    const trigramInsights = this.generateTrigramInsights(primaryOS);
    const dimensionInsights = this.generateDimensionInsights(vector);
    const strategicInsights = this.generateStrategicInsights(primaryOS, vector);

    return `
      <div class="insight-summary">
        <h4>🎯 総合的な洞察</h4>
        <p>あなたの人格OSは<strong>「${hexagramName}」</strong>（適合度: ${this.formatScientificPercentage(matchPercentage)}）です。${hexagramDescription}</p>
        <p>この人格OSは、${trigramInsights.primaryCharacteristic}が特に強く、あなたの行動パターンと思考の核となっています。</p>
      </div>
      
      <div class="insight-details">
        <h4>🔍 詳細な特徴</h4>
        <ul>
          ${trigramInsights.details.map(detail => `<li>${detail}</li>`).join('')}
          ${dimensionInsights.map(insight => `<li>${insight}</li>`).join('')}
        </ul>
      </div>
      
      <div class="insight-recommendations">
        <h4>💡 おすすめのアクション</h4>
        <ul>
          ${strategicInsights.map(action => `<li>${action}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // 🚀 新規: 八卦に基づく洞察生成
  generateTrigramInsights(primaryOS) {
    const hexagramInfo = primaryOS.hexagramInfo;
    const trigramMapping = {
      1: { name: "乾", characteristic: "創造力と指導力", element: "天の力" },
      2: { name: "兌", characteristic: "調和性と社交性", element: "沢の恵み" },
      3: { name: "離", characteristic: "表現力と情熱", element: "火の輝き" },
      4: { name: "震", characteristic: "行動力とエネルギー", element: "雷の力強さ" },
      5: { name: "巽", characteristic: "適応性と柔軟性", element: "風の変化" },
      6: { name: "坎", characteristic: "探求心と深い洞察", element: "水の流れ" },
      7: { name: "艮", characteristic: "安定性と忍耐力", element: "山の堅実さ" },
      8: { name: "坤", characteristic: "受容性と支援力", element: "地の包容力" }
    };

    const upperTrigram = trigramMapping[hexagramInfo?.upper_trigram_id] || trigramMapping[1];
    const lowerTrigram = trigramMapping[hexagramInfo?.lower_trigram_id] || trigramMapping[1];

    return {
      primaryCharacteristic: upperTrigram.characteristic,
      details: [
        `上卦の${upperTrigram.name}（${upperTrigram.element}）により、${upperTrigram.characteristic}を発揮します`,
        `下卦の${lowerTrigram.name}（${lowerTrigram.element}）により、${lowerTrigram.characteristic}で基盤を支えます`,
        `この組み合わせにより、外的な環境と内的な性質が調和した独特の人格を形成しています`
      ]
    };
  }

  // 🚀 新規: 次元に基づく洞察生成
  generateDimensionInsights(vector) {
    if (!vector) return ["8次元データから詳細な分析を行っています"];

    const insights = [];
    const sortedDimensions = Object.entries(vector)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    const dimensionDescriptions = {
      '乾_創造性': '新しいアイデアを生み出し、革新的な解決策を見つける能力',
      '震_行動性': '決断を下し、積極的に行動に移す実行力',
      '坎_探求性': '物事の本質を深く理解しようとする探究心',
      '艮_安定性': '継続的に取り組み、安定した結果を生み出す力',
      '坤_受容性': '他者を理解し、協力的な関係を築く能力',
      '巽_適応性': '状況の変化に柔軟に対応する調整力',
      '離_表現性': '自分の考えを効果的に伝える表現力',
      '兌_調和性': '人間関係において調和と喜びを生み出す力'
    };

    sortedDimensions.forEach(([key, value]) => {
      const description = dimensionDescriptions[key] || '特別な能力';
      const strength = value > 15 ? '非常に強い' : value > 10 ? '強い' : '適度な';
      insights.push(`${key.split('_')[1]}の次元で${strength}特性を示し、${description}に長けています`);
    });

    return insights;
  }

  // 🚀 新規: 戦略的洞察生成
  generateStrategicInsights(primaryOS, vector) {
    const hexagramName = primaryOS.hexagramInfo?.name || primaryOS.osName;
    const strategies = [];

    // 易経の知恵に基づく戦略的アドバイス
    const strategicAdvice = {
      '乾為天': ['リーダーシップを発揮できる場面を積極的に見つけてください', '創造的なプロジェクトに挑戦することで成長が期待できます'],
      '坤為地': ['チームワークを重視し、支援する立場で力を発揮してください', '継続的な努力により確実な成果を積み重ねていきましょう'],
      '水雷屯': ['困難な状況でも粘り強く取り組むことで道が開けます', '基礎固めを重視し、長期的な視点で行動してください'],
      '山水蒙': ['学習と成長の機会を積極的に求めてください', '経験豊富な指導者から学ぶことが重要です'],
      '水天需': ['待つべき時を見極め、適切なタイミングで行動してください', '準備を怠らず、機会が来た時に備えましょう']
    };

    const specificAdvice = strategicAdvice[hexagramName] || [
      'あなたの人格OSの特性を活かせる環境を見つけてください',
      '強みを伸ばしつつ、バランスの取れた成長を目指しましょう'
    ];

    strategies.push(...specificAdvice);

    // 次元データに基づく追加アドバイス
    if (vector) {
      const weakestDimension = Object.entries(vector)
        .sort(([,a], [,b]) => a - b)[0];
      
      if (weakestDimension && weakestDimension[1] < 8) {
        const dimensionName = weakestDimension[0].split('_')[1];
        strategies.push(`${dimensionName}の分野を意識的に発達させることで、より多面的な能力を身につけられます`);
      }
    }

    return strategies;
  }

  // 🚀 最適化版: 従来メソッドの互換性維持
  renderInsights() {
    return this.renderInsightsOptimized();
  }

  renderAlternativeMatches() {
    // TripleOS結果の場合は他のOSを代替として表示
    if (this.analysisResult.analysisType === "tripleOS") {
      const alternatives = [];
      
      if (this.analysisResult.interfaceOS) {
        alternatives.push({
          name: `社会的な自分: ${this.analysisResult.interfaceOS.osName}`,
          percentage: this.formatScientificPercentage(this.analysisResult.interfaceOS.strength || 0).replace('%', '')
        });
      }
      
      if (this.analysisResult.safeModeOS) {
        alternatives.push({
          name: `守る力: ${this.analysisResult.safeModeOS.osName}`,
          percentage: this.formatScientificPercentage(this.analysisResult.safeModeOS.strength || 0).replace('%', '')
        });
      }
      
      if (alternatives.length === 0) {
        return "<p>3つの人格OSが分析されました。</p>";
      }
      
      return alternatives
        .map((alt, index) => `
        <div class="alternative-match">
          <div class="match-rank">${index + 2}</div>
          <div class="match-info">
            <div class="match-name">${alt.name}</div>
            <div class="match-percentage">${alt.percentage}%</div>
          </div>
        </div>
      `)
        .join("");
    }

    // 従来の単一OS結果の場合
    if (
      !this.analysisResult.alternativeMatches ||
      this.analysisResult.alternativeMatches.length === 0
    ) {
      return "<p>その他のマッチングを計算中...</p>";
    }

    return this.analysisResult.alternativeMatches
      .map(
        (match, index) => `
      <div class="alternative-match">
        <div class="match-rank">${index + 2}</div>
        <div class="match-info">
          <div class="match-name">${match.hexagramInfo?.name || match.osName || "不明"}</div>
          <div class="match-percentage">${this.formatScientificPercentage(match.matchPercentage || match.strength || 0)}</div>
        </div>
      </div>
    `
      )
      .join("");
  }

  // 🚀 最適化版: イベントバインド
  bindEvents() {
    // 📱 情報階層最適化: レスポンシブ対応の初期化
    this.adjustInformationDensity();
    
    // 📱 リサイズイベントでレスポンシブ調整
    const resizeHandler = this.debounce(() => {
      this.adjustInformationDensity();
    }, 150);
    
    window.addEventListener('resize', resizeHandler);
    
    // 🚀 最適化: イベント委譲を使用してパフォーマンス向上
    this.container.addEventListener('click', (e) => {
      const target = e.target.closest('button');
      if (!target) return;

      switch (target.id) {
        case 'explore-more-btn':
          if (this.options.onExploreMore) {
            this.options.onExploreMore(this.analysisResult);
          }
          break;
          
        case 'explore-future-simulator':
          this.handleFutureSimulatorNavigation();
          break;
          
        case 'retake-test-btn':
          if (this.options.onRetakeTest) {
            this.options.onRetakeTest();
          } else {
            window.location.reload();
          }
          break;
          
        case 'upgrade-to-premium-btn':
          this.handlePremiumUpgrade();
          break;
          
        case 'export-json-btn':
          this.handleDataExport('json');
          break;
          
        case 'export-summary-btn':
          this.handleDataExport('summary');
          break;
          
        case 'view-insights-btn':
          this.showDetailedInsights();
          break;
      }
    });
  }

  // 🚀 新規: プレミアムセクションのレンダリング
  renderPremiumSection() {
    const primaryOS = this.analysisResult.primaryOS || this.analysisResult.engineOS;
    
    return `
      <div class="premium-section">
        <div class="premium-card">
          <div class="premium-header">
            <h3>🌟 プロフェッショナル戦略レポート</h3>
            <div class="premium-price">¥2,980</div>
          </div>
          <div class="premium-content">
            <p class="premium-description">
              あなたの<strong>${primaryOS?.hexagramInfo?.name || primaryOS?.osName || "人格OS"}</strong>に特化した、
              Gemini Pro AIによる高精度な実践戦略レポートを取得しませんか？
            </p>
            
            <div class="premium-benefits">
              <h4>無料版との違い</h4>
              <div class="comparison-grid">
                <div class="comparison-item">
                  <div class="free-feature">無料版: 「分析」</div>
                  <div class="premium-feature">有料版: 「実践戦略」</div>
                </div>
                <div class="comparison-item">
                  <div class="free-feature">無料版: 「知る」</div>
                  <div class="premium-feature">有料版: 「行動する」</div>
                </div>
                <div class="comparison-item">
                  <div class="free-feature">無料版: 「理解」</div>
                  <div class="premium-feature">有料版: 「変化」</div>
                </div>
              </div>

              <div class="benefits-list">
                <div class="benefit-item">
                  <span class="benefit-icon">📋</span>
                  <span class="benefit-text">具体的な行動計画（最初の三手）</span>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">🛡️</span>
                  <span class="benefit-text">リスク管理戦略（守りの戦略）</span>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">📈</span>
                  <span class="benefit-text">3ヶ月実行ロードマップ</span>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">🤝</span>
                  <span class="benefit-text">6ヶ月継続サポートシステム</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="premium-actions">
            <button id="upgrade-to-premium-btn" class="btn btn-premium">
              🚀 プロフェッショナルレポートを取得する
            </button>
            <div class="premium-note">
              診断結果は自動的に引き継がれます
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 🚀 新規: データ管理セクションのレンダリング
  renderDataManagementSection() {
    return `
      <div class="data-management-section">
        <div class="data-card">
          <h3>📊 診断データの管理</h3>
          <p>あなたの診断結果を保存・エクスポートして、他のツールでも活用できます。</p>
          
          <div class="data-actions">
            <button id="export-json-btn" class="btn btn-outline">
              📄 JSON形式でエクスポート
            </button>
            <button id="export-summary-btn" class="btn btn-outline">
              📝 サマリーをエクスポート
            </button>
            <button id="view-insights-btn" class="btn btn-outline">
              🔍 詳細洞察を表示
            </button>
          </div>
          
          <div class="cross-platform-info">
            <h4>他のHaQeiツールとの連携</h4>
            <div class="platform-links">
              <a href="future_simulator.html" class="platform-link">
                🔮 未来分岐シミュレーター
              </a>
              <a href="cockpit.html" class="platform-link">
                🎛️ 戦略コックピット
              </a>
              <a href="library.html" class="platform-link">
                📚 HaQeiライブラリ
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 🚀 新規: フォールバックレンダリング
  renderFallback() {
    this.container.innerHTML = `
      <div class="results-container error-state">
        <div class="error-message">
          <h3>⚠️ 表示エラー</h3>
          <p>結果の表示中にエラーが発生しました。ページを再読み込みしてください。</p>
          <button onclick="window.location.reload()" class="btn btn-primary">
            🔄 再読み込み
          </button>
        </div>
      </div>
    `;
  }

  // 🚀 最適化版: 従来メソッドの互換性維持
  render() {
    this.renderOptimized();
  }

  // プレミアム版アップグレードの処理
  async handlePremiumUpgrade() {
    try {
      console.log('🚀 Initiating premium upgrade...');

      // CrossPlatformBridgeを使用してデータを準備
      if (typeof window !== 'undefined' && window.CrossPlatformBridge) {
        const bridge = new window.CrossPlatformBridge();
        
        // 現在の分析結果を使用して統一フォーマットデータを作成
        const rawAnswers = this.getRawAnswers();
        const completionResult = await bridge.completeDiagnosis(
          this.analysisResult, 
          rawAnswers,
          { source: 'os_analyzer_premium_upgrade' }
        );

        if (completionResult.success) {
          // プロフェッショナルレポート用のデータを準備
          const professionalData = bridge.prepareProfessionalReportData();
          
          if (professionalData.success) {
            // professional_report.htmlに遷移
            window.location.href = 'professional_report.html';
          } else {
            throw new Error('プロフェッショナルレポートデータの準備に失敗しました');
          }
        } else {
          throw new Error('診断データの準備に失敗しました');
        }
      } else {
        // フォールバック: 直接遷移
        console.warn('⚠️ CrossPlatformBridge not available, using fallback');
        window.location.href = 'professional_report.html';
      }

    } catch (error) {
      console.error('❌ Premium upgrade failed:', error);
      alert('プレミアム版へのアップグレードに失敗しました。もう一度お試しください。');
    }
  }

  // データエクスポートの処理
  async handleDataExport(format) {
    try {
      console.log(`📤 Exporting data in ${format} format...`);

      if (typeof window !== 'undefined' && window.CrossPlatformBridge) {
        const bridge = new window.CrossPlatformBridge();
        
        // 現在の分析結果を統一フォーマットで保存
        const rawAnswers = this.getRawAnswers();
        const completionResult = await bridge.completeDiagnosis(
          this.analysisResult, 
          rawAnswers,
          { source: 'os_analyzer_export' }
        );

        if (completionResult.success) {
          // データをエクスポート
          const exportResult = await bridge.exportDiagnosisData(format);
          
          if (exportResult.success) {
            // ファイルとしてダウンロード
            this.downloadFile(exportResult.data, exportResult.filename, format);
            
            // 成功メッセージ
            this.showNotification(
              `✅ ${format.toUpperCase()}形式でのエクスポートが完了しました。`,
              'success'
            );
          } else {
            throw new Error('エクスポートに失敗しました');
          }
        } else {
          throw new Error('診断データの準備に失敗しました');
        }
      } else {
        // フォールバック: 簡易エクスポート
        console.warn('⚠️ CrossPlatformBridge not available, using fallback');
        this.fallbackExport(format);
      }

    } catch (error) {
      console.error('❌ Data export failed:', error);
      this.showNotification(
        `❌ データのエクスポートに失敗しました: ${error.message}`,
        'error'
      );
    }
  }

  // ファイルダウンロード
  downloadFile(data, filename, format) {
    try {
      const mimeTypes = {
        json: 'application/json',
        summary: 'text/plain',
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

  // フォールバックエクスポート
  fallbackExport(format) {
    try {
      let data, filename;
      const timestamp = new Date().toISOString().slice(0, 10);

      if (format === 'json') {
        data = JSON.stringify(this.analysisResult, null, 2);
        filename = `haqei_analysis_${timestamp}.json`;
      } else {
        data = this.generateSimpleSummary();
        filename = `haqei_summary_${timestamp}.txt`;
      }

      this.downloadFile(data, filename, format);
      this.showNotification('エクスポートが完了しました（簡易版）', 'success');

    } catch (error) {
      console.error('❌ Fallback export failed:', error);
      this.showNotification('エクスポートに失敗しました', 'error');
    }
  }

  // 簡易サマリー生成
  generateSimpleSummary() {
    const primaryOS = this.analysisResult.primaryOS || this.analysisResult.engineOS;
    const vector = this.analysisResult.eightDimensionVector || this.analysisResult.dimensions || primaryOS?.userVector;

    let summary = '=== HaQei OS分析結果 ===\n';
    summary += `生成日時: ${new Date().toLocaleString('ja-JP')}\n\n`;
    summary += `主要人格OS: ${primaryOS?.hexagramInfo?.name || primaryOS?.osName || "不明"}\n`;
    summary += `適合度: ${this.formatScientificPercentage(primaryOS?.matchPercentage || primaryOS?.strength || 0)}\n\n`;
    
    if (vector) {
      summary += '--- 8次元バランス ---\n';
      Object.entries(vector).forEach(([key, value]) => {
        const dimensionName = key.split('_')[1] || key;
        summary += `${dimensionName}: ${this.formatScientificPercentage(value)}\n`;
      });
    }
    
    // TripleOS結果の場合は他のOSも追加
    if (this.analysisResult.analysisType === "tripleOS") {
      summary += '\n--- 3層人格OS ---\n';
      if (this.analysisResult.engineOS) {
        summary += `本質的な自分: ${this.analysisResult.engineOS.osName}\n`;
      }
      if (this.analysisResult.interfaceOS) {
        summary += `社会的な自分: ${this.analysisResult.interfaceOS.osName}\n`;
      }
      if (this.analysisResult.safeModeOS) {
        summary += `守る力: ${this.analysisResult.safeModeOS.osName}\n`;
      }
    }
    
    summary += '\n=== レポート終了 ===\n';
    summary += 'このデータは HaQei OS分析ツールで生成されました。\n';

    return summary;
  }

  // 詳細洞察の表示
  showDetailedInsights() {
    try {
      // モーダルまたは新しいセクションで詳細洞察を表示
      const insightsModal = document.createElement('div');
      insightsModal.className = 'insights-modal';
      insightsModal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()">
          <div class="modal-content" onclick="event.stopPropagation()">
            <div class="modal-header">
              <h3>🔍 詳細洞察</h3>
              <button class="modal-close" onclick="this.closest('.insights-modal').remove()">×</button>
            </div>
            <div class="modal-body">
              ${this.generateDetailedInsights()}
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" onclick="this.closest('.insights-modal').remove()">
                閉じる
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(insightsModal);

    } catch (error) {
      console.error('❌ Failed to show detailed insights:', error);
      this.showNotification('詳細洞察の表示に失敗しました', 'error');
    }
  }

  // 詳細洞察の生成
  generateDetailedInsights() {
    const primaryOS = this.analysisResult.primaryOS || this.analysisResult.engineOS;
    const vector = this.analysisResult.eightDimensionVector || this.analysisResult.dimensions || primaryOS?.userVector;

    let insights = '<div class="detailed-insights">';
    
    // 人格OS詳細
    insights += `
      <div class="insight-section">
        <h4>🎯 主要人格OS：${primaryOS?.hexagramInfo?.name || primaryOS?.osName || "不明"}</h4>
        <p><strong>適合度：</strong>${this.formatScientificPercentage(primaryOS?.matchPercentage || primaryOS?.strength || 0)}</p>
        <p><strong>特徴：</strong>${primaryOS?.hexagramInfo?.description || primaryOS?.description || '詳細分析中...'}</p>
      </div>
    `;

    // 8次元分析
    if (vector) {
      insights += `
        <div class="insight-section">
          <h4>📊 8次元バランス詳細</h4>
          <div class="dimensions-detailed">
      `;

      Object.entries(vector).forEach(([key, value]) => {
        const percentage = this.formatScientificPercentage(value);
        const dimensionName = key.split('_')[1] || key;
        const strength = value > 0.7 ? '強い' : value > 0.4 ? '中程度' : '弱い';
        
        insights += `
          <div class="dimension-detail">
            <strong>${dimensionName}：</strong>${percentage} （${strength}）
          </div>
        `;
      });

      insights += '</div></div>';
    }

    // TripleOS結果の場合は3つのOSの詳細を追加
    if (this.analysisResult.analysisType === "tripleOS") {
      insights += `
        <div class="insight-section">
          <h4>🎭 3層人格OSの詳細</h4>
          <div class="triple-os-details">
      `;
      
      if (this.analysisResult.engineOS) {
        insights += `
          <div class="os-detail">
            <strong>本質的な自分：</strong>${this.analysisResult.engineOS.osName} (${this.formatScientificPercentage(this.analysisResult.engineOS.strength || 0)})
          </div>
        `;
      }
      
      if (this.analysisResult.interfaceOS) {
        insights += `
          <div class="os-detail">
            <strong>社会的な自分：</strong>${this.analysisResult.interfaceOS.osName} (${this.formatScientificPercentage(this.analysisResult.interfaceOS.strength || 0)})
          </div>
        `;
      }
      
      if (this.analysisResult.safeModeOS) {
        insights += `
          <div class="os-detail">
            <strong>守る力：</strong>${this.analysisResult.safeModeOS.osName} (${this.formatScientificPercentage(this.analysisResult.safeModeOS.strength || 0)})
          </div>
        `;
      }
      
      insights += '</div></div>';
    }

    // 戦略的提案
    insights += `
      <div class="insight-section">
        <h4>💡 戦略的提案</h4>
        <p>より具体的な戦略と行動計画については、プロフェッショナルレポートをご利用ください。</p>
        <ul>
          <li>あなたの${primaryOS?.hexagramInfo?.name || primaryOS?.osName || "人格OS"}特性を活かした具体的行動計画</li>
          <li>リスク管理と防御戦略</li>
          <li>3ヶ月実行ロードマップ</li>
        </ul>
      </div>
    `;

    insights += '</div>';
    return insights;
  }

  // 回答データの取得（ヘルパーメソッド）
  getRawAnswers() {
    // StorageManagerから回答データを取得
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

  // 通知表示
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

      // 3秒後に自動削除
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);

    } catch (error) {
      console.error('❌ Failed to show notification:', error);
    }
  }

  // 🚀 新規: OS Manual Database取得
  getOSManualData(osId) {
    try {
      if (typeof window !== 'undefined' && window.OS_MANUAL_DATA) {
        return window.OS_MANUAL_DATA[osId.toString()];
      }
      return null;
    } catch (error) {
      console.error('❌ Failed to get OS Manual data:', error);
      return null;
    }
  }

  // 🚀 新規: データベース洞察レンダリング
  renderDatabaseInsights(osManualData, primaryOS) {
    const matchPercentage = primaryOS.matchPercentage || primaryOS.strength || 0;
    
    return `
      <div class="insight-summary">
        <h4>🎯 ${osManualData.name} の特徴</h4>
        <p>${osManualData.summary}</p>
        <div class="match-info">
          <strong>適合度:</strong> ${this.formatScientificPercentage(matchPercentage)}
        </div>
      </div>
      
      <div class="insight-details">
        <h4>🔍 実践的な洞察</h4>
        <ul>
          <li>マッチ度 ${this.formatScientificPercentage(matchPercentage)} で、この人格OSの特性が表れています。</li>
          ${primaryOS.trigramComposition ? `<li>八卦構成「${primaryOS.trigramComposition}」の特性を持ちます。</li>` : ''}
          <li>日常生活では、このOSの特徴を意識することで効果的な判断ができます。</li>
        </ul>
      </div>
      
      <div class="insight-recommendations">
        <h4>💡 今すぐできるアクション</h4>
        <ul>
          ${osManualData.quests ? osManualData.quests.map(quest => `<li>${quest}</li>`).join('') : '<li>この特性を活かす行動を考えてみてください。</li>'}
        </ul>
      </div>
      
      ${osManualData.debug_pattern ? `
      <div class="debug-insights">
        <h4>⚠️ 注意すべきパターン</h4>
        <div class="debug-pattern">
          <p><strong>デバッグパターン:</strong> ${osManualData.debug_pattern}</p>
          <p><strong>対処法:</strong> ${osManualData.debug_method}</p>
        </div>
      </div>
      ` : ''}
    `;
  }

  // 🔧 trigramComposition安全取得メソッド
  getTrigramComposition(osData) {
    if (!osData) return "乾 + 乾";
    
    // 既存のtrigramCompositionがあればそれを使用
    if (osData.trigramComposition) {
      return osData.trigramComposition;
    }
    
    // hexagramInfoから生成
    if (osData.hexagramInfo) {
      const upperTrigram = this.getTrigramName(
        osData.hexagramInfo.upper_trigram_id
      );
      const lowerTrigram = this.getTrigramName(
        osData.hexagramInfo.lower_trigram_id
      );
      return `${upperTrigram} + ${lowerTrigram}`;
    }
    
    // hexagramIdから推測を試行
    if (osData.hexagramId) {
      return `易経第${osData.hexagramId}卦`;
    }
    
    // フォールバック
    return "乾 + 乾";
  }

  // 🔧 八卦名取得ヘルパー
  getTrigramName(trigramId) {
    const trigramNames = {
      1: "乾",
      2: "兌",
      3: "離",
      4: "震",
      5: "巽",
      6: "坎",
      7: "艮",
      8: "坤",
    };
    return trigramNames[trigramId] || "乾";
  }

  // 🔬 Phase 5.1: 科学的数値フォーマッターヘルパーメソッド

  /**
   * 科学的パーセンテージフォーマット
   * @param {number} value - 0-1の値
   * @param {Object} options - フォーマットオプション
   * @returns {string} フォーマットされたパーセンテージ
   */
  formatScientificPercentage(value, options = {}) {
    // 数値の妥当性チェック
    if (isNaN(value) || value === null || value === undefined) {
      return "0.0%";
    }

    // 統計的妥当性チェック
    if (this.statisticalEngine) {
      const validation = this.statisticalEngine.validateScore(value, 'general');
      if (!validation.isValid) {
        console.log(`🔬 Display value corrected: ${value} → ${validation.correctedScore}`);
        value = validation.correctedScore;
      }
    }

    // 科学的フォーマッター使用（優先）
    if (this.formatter) {
      return this.formatter.formatPercentage(value, options);
    }

    // フォールバック: 科学的精度での処理（小数点以下1桁に統一）
    const clampedValue = Math.max(0, Math.min(1, value));
    const percentage = (clampedValue * 100).toFixed(1);
    return `${percentage}%`;
  }

  /**
   * 科学的スコアフォーマット
   * @param {number} score - 0-1のスコア
   * @param {Object} options - フォーマットオプション
   * @returns {string} フォーマットされたスコア
   */
  formatScientificScore(score, options = {}) {
    // 数値の妥当性チェック
    if (isNaN(score) || score === null || score === undefined) {
      return "0.0";
    }

    // 統計的妥当性チェック
    if (this.statisticalEngine) {
      const validation = this.statisticalEngine.validateScore(score, 'general');
      if (!validation.isValid) {
        console.log(`🔬 Display score corrected: ${score} → ${validation.correctedScore}`);
        score = validation.correctedScore;
      }
    }

    // 科学的フォーマッター使用（優先）
    if (this.formatter) {
      return this.formatter.formatScore(score, options);
    }

    // フォールバック: 科学的精度での処理（小数点以下1桁に統一）
    const clampedScore = Math.max(0, Math.min(1, score));
    return clampedScore.toFixed(1);
  }

  /**
   * 信頼区間付きフォーマット
   * @param {number} value - 中央値
   * @param {boolean} showConfidence - 信頼区間を表示するか
   * @returns {string} 信頼区間付きの値
   */
  formatWithConfidence(value, showConfidence = false) {
    if (!this.formatter || !showConfidence) {
      return this.formatScientificPercentage(value);
    }

    return this.formatter.formatWithConfidenceInterval(value);
  }

  /**
   * 統計品質インジケーターの生成
   * @param {Object} analysisResult - 分析結果
   * @returns {string} 品質インジケーターHTML
   */
  generateQualityIndicator(analysisResult) {
    if (!this.formatter || !this.statisticalEngine || !analysisResult.quality) {
      return '';
    }

    const quality = this.formatter.formatQualityGrade(
      analysisResult.quality.grade, 
      analysisResult.quality.ratio
    );

    return `
      <div class="statistical-quality-indicator">
        <div class="quality-badge" style="color: ${quality.color}">
          ${quality.display}
        </div>
        <div class="quality-description">
          ${analysisResult.quality.description}
        </div>
      </div>
    `;
  }

  /**
   * 透明性レポートの表示
   * @param {Object} transparencyReport - 透明性レポート
   * @returns {string} 透明性レポートHTML
   */
  generateTransparencyDisplay(transparencyReport) {
    if (!transparencyReport || !transparencyReport.methodology) {
      return '';
    }

    return `
      <div class="transparency-report">
        <h4>🔬 計算方法の透明性</h4>
        <div class="methodology">
          <p><strong>アルゴリズム:</strong> ${transparencyReport.methodology.algorithm}</p>
          <p><strong>重み付け:</strong> ${transparencyReport.methodology.weighting}</p>
          <p><strong>信頼度:</strong> ${transparencyReport.dataQuality.confidenceLevel}</p>
          <p><strong>誤差範囲:</strong> ${transparencyReport.dataQuality.standardError}</p>
        </div>
        <div class="limitations">
          <strong>分析の限界:</strong>
          <ul>
            ${transparencyReport.limitations.map(limit => `<li>${limit}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  /**
   * 🔬 Phase 5.1 統合: 安全なスコア変換ヘルパー
   * 任意の数値を0-1範囲の適切なスコアに変換
   * @param {number} rawValue - 生の数値
   * @param {string} sourceType - ソースの種類（percentage, score, ratio等）
   * @returns {number} 0-1に正規化されたスコア
   */
  normalizeToUnitScore(rawValue, sourceType = 'unknown') {
    try {
      // 無効値チェック
      if (isNaN(rawValue) || rawValue === null || rawValue === undefined) {
        console.warn(`🔬 Invalid raw value detected (${sourceType}):`, rawValue);
        return 0.5; // 中央値をデフォルトとする
      }

      // ソースタイプに応じた変換
      switch (sourceType) {
        case 'percentage':
          // 100%表記 → 0-1変換
          return Math.max(0, Math.min(1, rawValue / 100));
          
        case 'dimension_score':
          // -5〜+5の次元スコア → 0-1変換
          return Math.max(0, Math.min(1, (rawValue + 5) / 10));
          
        case 'strength':
        case 'match':
        case 'ratio':
          // すでに0-1範囲の値
          return Math.max(0, Math.min(1, rawValue));
          
        default:
          // 自動判定
          if (rawValue >= 0 && rawValue <= 1) {
            return rawValue; // すでに0-1範囲
          } else if (rawValue > 1 && rawValue <= 100) {
            return rawValue / 100; // パーセンテージと推定
          } else if (rawValue >= -5 && rawValue <= 5) {
            return (rawValue + 5) / 10; // 次元スコアと推定
          } else {
            // 範囲外の場合は0.5（中央値）に正規化
            console.warn(`🔬 Value outside expected range (${sourceType}):`, rawValue);
            return 0.5;
          }
      }
    } catch (error) {
      console.error(`🔬 Error in normalizeToUnitScore (${sourceType}):`, error);
      return 0.5;
    }
  }

  /**
   * 🔬 Phase 5.1 統合: 統計品質保証付きフォーマッター
   * すべての数値表示で統一的な品質保証を提供
   * @param {number} value - フォーマット対象値
   * @param {string} format - フォーマット種類（percentage, score）
   * @param {Object} options - 追加オプション
   * @returns {string} 品質保証済みフォーマット結果
   */
  formatWithQualityAssurance(value, format = 'percentage', options = {}) {
    try {
      // Step 1: 値の正規化
      const normalizedValue = this.normalizeToUnitScore(value, options.sourceType);
      
      // Step 2: 統計的妥当性検証
      let validatedValue = normalizedValue;
      if (this.statisticalEngine) {
        const validation = this.statisticalEngine.validateScore(normalizedValue, options.systemType || 'general');
        if (!validation.isValid) {
          console.log(`🔬 Quality assurance correction: ${normalizedValue} → ${validation.correctedScore}`);
          validatedValue = validation.correctedScore;
        }
      }

      // Step 3: フォーマット適用
      switch (format) {
        case 'percentage':
          return this.formatScientificPercentage(validatedValue, options);
        case 'score':
          return this.formatScientificScore(validatedValue, options);
        case 'confidence':
          return this.formatWithConfidence(validatedValue, options.showConfidence);
        default:
          return this.formatScientificPercentage(validatedValue, options);
      }
      
    } catch (error) {
      console.error('🔬 Error in formatWithQualityAssurance:', error);
      return format === 'score' ? '0.0' : '0.0%';
    }
  }

  // 🌟 新規: Triple OS Constellation View読み込み
  async loadTripleOSVisualization() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const constellationSection = this.container.querySelector('.constellation-section');
        
        if (constellationSection && this.analysisResult) {
          // Triple OS データの取得
          const engineOS = this.analysisResult.engineOS || this.analysisResult.primaryOS;
          const interfaceOS = this.analysisResult.interfaceOS;
          const safeModeOS = this.analysisResult.safeModeOS;
          
          // 星座表示のHTML生成
          const constellationHTML = this.generateConstellationView(engineOS, interfaceOS, safeModeOS);
          
          constellationSection.innerHTML = `
            <div class="constellation-intro">
              <h3 class="priority-high">✨ あなたの3つの人格OS - 星座図</h3>
              <p class="priority-high">クリックして各OSの関係性を確認してください</p>
            </div>
            ${constellationHTML}
            <div class="constellation-explanation">
              <p class="priority-medium">この3つの組み合わせが、あなたの複雑で多面的な人格を形成しています。</p>
            </div>
          `;
          
          constellationSection.classList.remove('skeleton');
          
          // インタラクティブ機能のバインド
          this.bindConstellationEvents();
        }
        resolve();
      });
    });
  }

  // 🌟 新機能: Behavioral Flow Timeline読み込み
  async loadBehavioralFlowTimeline() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const flowSection = this.container.querySelector('.behavioral-flow-section');
        
        if (flowSection && this.behavioralEngine && this.analysisResult) {
          // Behavioral Flow Timelineデータの生成
          const flowTimelines = this.behavioralEngine.generateBehavioralFlowTimeline(this.analysisResult);
          
          // 最初のシナリオ（代表的なもの）を表示
          const primaryScenario = flowTimelines[0];
          
          if (primaryScenario) {
            const flowHTML = this.renderFlowTimeline(primaryScenario);
            
            flowSection.innerHTML = `
              <div class="flow-timeline-intro">
                <h3 class="priority-medium">🎭 行動フローの分析 - あの時なぜその行動を？</h3>
                <p class="priority-medium">状況に応じてどのOSが活性化し、どんな行動につながったかを可視化します</p>
              </div>
              ${flowHTML}
              <div class="flow-scenarios-selector insight-container low">
                <h4 class="priority-low">💭 他のシナリオも見てみる</h4>
                <div class="scenario-buttons">
                  ${flowTimelines.map((scenario, index) => `
                    <button class="scenario-btn ${index === 0 ? 'active' : ''}" 
                            data-scenario-id="${scenario.scenarioId}" 
                            data-scenario-index="${index}">
                      ${scenario.title}
                    </button>
                  `).join('')}
                </div>
              </div>
            `;
            
            flowSection.classList.remove('skeleton');
            
            // Behavioral Flow Timeline用のイベントバインド
            this.bindFlowEvents(flowTimelines);
          }
        }
        resolve();
      });
    });
  }

  // 🌟 新機能: フロータイムライン表示HTML生成
  renderFlowTimeline(scenario) {
    return `
      <div class="behavioral-flow-container fade-in" data-scenario-id="${scenario.scenarioId}">
        <div class="flow-timeline-header">
          <div class="flow-timeline-title">${scenario.title}</div>
          <div class="flow-timeline-subtitle">${scenario.description}</div>
        </div>
        
        <div class="flow-timeline-viewport">
          <div class="flow-connection-line"></div>
          <div class="flow-step-container">
            ${scenario.flowSteps.map((step, index) => `
              <div class="flow-step" data-step-type="${step.type}" data-step-index="${index}">
                <div class="flow-step-icon ${step.type}" title="${step.title}">
                  ${step.icon}
                </div>
                <div class="flow-step-content" tabindex="0">
                  <div class="flow-step-title">
                    ${step.icon} ${step.title}
                  </div>
                  <div class="flow-step-description">
                    ${this.generateStepDescription(step)}
                  </div>
                  <div class="flow-step-details">
                    ${this.generateStepDetails(step)}
                  </div>
                  ${step.osActivationDisplay ? this.renderOSActivationDisplay(step.osActivationDisplay) : ''}
                  ${step.insights ? `
                    <div class="step-insights">
                      ${step.insights.map(insight => `<div class="insight-item">💡 ${insight}</div>`).join('')}
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
          
          <div class="flow-navigation">
            <button class="flow-nav-button" id="prev-scenario" title="前のシナリオ">‹</button>
            <button class="flow-nav-button" id="next-scenario" title="次のシナリオ">›</button>
          </div>
        </div>
        
        <div class="alternative-scenarios">
          <div class="alternative-scenarios-title">
            🔄 もしも別のOSで対応していたら...
          </div>
          <div class="scenarios-grid">
            ${scenario.alternativeOutcomes.map(alt => `
              <div class="scenario-option" data-os-type="${alt.osType}">
                <div class="scenario-title">${alt.title}</div>
                <div class="scenario-description">${alt.description}</div>
                <div class="scenario-outcome">
                  <strong>予想される結果:</strong> ${alt.outcome}
                </div>
                <div class="scenario-pros-cons">
                  <div class="pros">
                    <strong>メリット:</strong>
                    <ul>${alt.pros.map(pro => `<li>${pro}</li>`).join('')}</ul>
                  </div>
                  <div class="cons">
                    <strong>デメリット:</strong>
                    <ul>${alt.cons.map(con => `<li>${con}</li>`).join('')}</ul>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="bunenjin-insight">
          <h4>${scenario.bunenjinInsight.title}</h4>
          <div class="main-insight">${scenario.bunenjinInsight.mainInsight}</div>
          <div class="strategic-advice">
            <strong>💡 戦略的アドバイス:</strong> ${scenario.bunenjinInsight.strategicAdvice}
          </div>
          <div class="next-time-strategy">
            <strong>🎯 次回への活かし方:</strong> ${scenario.bunenjinInsight.nextTimeStrategy}
          </div>
          <div class="philosophical-note">
            <em>${scenario.bunenjinInsight.philosophicalNote}</em>
          </div>
        </div>
      </div>
    `;
  }

  // 🌟 新機能: ステップ説明の生成
  generateStepDescription(step) {
    if (step.content && step.content.description) {
      return step.content.description;
    }
    
    // ステップタイプに応じたデフォルト説明
    const defaultDescriptions = {
      situation: '状況を認識し、環境を評価する段階',
      emotion: '感情的な反応が生まれる瞬間',
      os_selection: 'どのOSで対応するかを選択する段階',
      behavior: '実際の行動として表現される段階',
      outcome: '行動の結果を評価する段階',
      reflection: '学習と次回への改善を考える段階'
    };
    
    return defaultDescriptions[step.type] || '詳細な分析を表示中...';
  }

  // 🌟 新機能: ステップ詳細の生成
  generateStepDetails(step) {
    if (!step.content) return '';
    
    let details = '';
    
    // 各ステップタイプに応じた詳細表示
    switch (step.type) {
      case 'situation':
        if (step.content.context) {
          details += `<div class="detail-item"><strong>状況:</strong> ${step.content.context}</div>`;
        }
        if (step.content.pressure) {
          details += `<div class="detail-item"><strong>プレッシャー:</strong> ${step.content.pressure}</div>`;
        }
        break;
        
      case 'emotion':
        if (step.content.primaryEmotion) {
          details += `<div class="detail-item"><strong>主要な感情:</strong> ${step.content.primaryEmotion}</div>`;
        }
        if (step.content.physicalReaction) {
          details += `<div class="detail-item"><strong>身体反応:</strong> ${step.content.physicalReaction}</div>`;
        }
        break;
        
      case 'behavior':
        if (step.content.actualBehavior) {
          details += `<div class="detail-item"><strong>実際の行動:</strong> ${step.content.actualBehavior}</div>`;
        }
        if (step.content.internalExperience) {
          details += `<div class="detail-item"><strong>内面体験:</strong> ${step.content.internalExperience}</div>`;
        }
        break;
        
      case 'outcome':
        if (step.content.immediateResult) {
          details += `<div class="detail-item"><strong>即座の結果:</strong> ${step.content.immediateResult}</div>`;
        }
        if (step.content.longTermImpact) {
          details += `<div class="detail-item"><strong>長期的影響:</strong> ${step.content.longTermImpact}</div>`;
        }
        break;
        
      case 'reflection':
        if (step.content.whatWorked && step.content.whatWorked.length > 0) {
          details += `<div class="detail-item"><strong>うまくいったこと:</strong> ${step.content.whatWorked.join(', ')}</div>`;
        }
        if (step.content.futureStrategy) {
          details += `<div class="detail-item"><strong>今後の戦略:</strong> ${step.content.futureStrategy}</div>`;
        }
        break;
    }
    
    return details;
  }

  // 🌟 新機能: OSアクティベーション表示の生成
  renderOSActivationDisplay(osActivation) {
    return `
      <div class="os-activation-display">
        <div class="os-activation-badge os-badge-primary" title="${osActivation.primary.reason}">
          ${osActivation.primary.name} (${(osActivation.primary.strength * 100).toFixed(0)}%)
        </div>
        <div class="os-activation-badge os-badge-secondary" title="${osActivation.secondary.reason}">
          ${osActivation.secondary.name} (${(osActivation.secondary.strength * 100).toFixed(0)}%)
        </div>
        <div class="os-activation-badge os-badge-suppressed" title="${osActivation.suppressed.reason}">
          ${osActivation.suppressed.name} (${(osActivation.suppressed.strength * 100).toFixed(0)}%)
        </div>
      </div>
    `;
  }

  // 🌟 新機能: フローイベントのバインド
  bindFlowEvents(flowTimelines) {
    const container = this.container;
    
    // シナリオ切り替えボタンのイベント
    const scenarioButtons = container.querySelectorAll('.scenario-btn');
    scenarioButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const scenarioIndex = parseInt(e.target.dataset.scenarioIndex);
        this.switchFlowScenario(flowTimelines, scenarioIndex);
      });
    });
    
    // ナビゲーションボタンのイベント
    const prevBtn = container.querySelector('#prev-scenario');
    const nextBtn = container.querySelector('#next-scenario');
    
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => this.navigateScenario(flowTimelines, -1));
      nextBtn.addEventListener('click', () => this.navigateScenario(flowTimelines, 1));
    }
    
    // フローステップのクリックイベント
    const flowSteps = container.querySelectorAll('.flow-step-content');
    flowSteps.forEach(step => {
      step.addEventListener('click', (e) => {
        this.handleFlowStepClick(e.target.closest('.flow-step'), flowTimelines);
      });
    });
    
    // 代替シナリオのクリックイベント
    const altScenarios = container.querySelectorAll('.scenario-option');
    altScenarios.forEach(scenario => {
      scenario.addEventListener('click', (e) => {
        this.showAlternativeScenarioDetail(e.target.closest('.scenario-option'));
      });
    });
    
    // フロー表示のアニメーション開始
    setTimeout(() => {
      const steps = container.querySelectorAll('.flow-step');
      steps.forEach(step => step.classList.add('visible'));
    }, 100);
  }

  // 🌟 新機能: シナリオ切り替え
  switchFlowScenario(flowTimelines, index) {
    const scenario = flowTimelines[index];
    if (!scenario) return;
    
    const flowContainer = this.container.querySelector('.behavioral-flow-container');
    const newFlowHTML = this.renderFlowTimeline(scenario);
    
    // フェードアウト → 更新 → フェードイン
    flowContainer.style.opacity = '0.5';
    
    setTimeout(() => {
      flowContainer.outerHTML = newFlowHTML;
      
      // 新しいコンテナを取得してイベントを再バインド
      const newContainer = this.container.querySelector('.behavioral-flow-container');
      newContainer.style.opacity = '1';
      
      // シナリオボタンの状態更新
      const buttons = this.container.querySelectorAll('.scenario-btn');
      buttons.forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
      });
      
      // イベントの再バインド
      this.bindFlowEvents(flowTimelines);
    }, 200);
  }

  // 🌟 新機能: ナビゲーション
  navigateScenario(flowTimelines, direction) {
    const currentActive = this.container.querySelector('.scenario-btn.active');
    if (!currentActive) return;
    
    const currentIndex = parseInt(currentActive.dataset.scenarioIndex);
    let newIndex = currentIndex + direction;
    
    // 範囲チェック
    if (newIndex < 0) newIndex = flowTimelines.length - 1;
    if (newIndex >= flowTimelines.length) newIndex = 0;
    
    this.switchFlowScenario(flowTimelines, newIndex);
  }

  // 🌟 新機能: フローステップクリック処理
  handleFlowStepClick(stepElement, flowTimelines) {
    // 詳細モーダルの表示
    const stepType = stepElement.dataset.stepType;
    const stepIndex = stepElement.dataset.stepIndex;
    const currentScenario = this.getCurrentScenario(flowTimelines);
    
    if (currentScenario && currentScenario.flowSteps[stepIndex]) {
      const step = currentScenario.flowSteps[stepIndex];
      this.showFlowStepDetail(step, currentScenario);
    }
    
    // ハイライト効果
    stepElement.classList.add('insight-highlight');
    setTimeout(() => {
      stepElement.classList.remove('insight-highlight');
    }, 2000);
  }

  // 🌟 新機能: 代替シナリオ詳細表示
  showAlternativeScenarioDetail(scenarioElement) {
    const osType = scenarioElement.dataset.osType;
    const title = scenarioElement.querySelector('.scenario-title').textContent;
    const description = scenarioElement.querySelector('.scenario-description').textContent;
    
    this.showFlowDetailModal({
      title: title,
      content: description,
      type: 'alternative-scenario',
      osType: osType
    });
  }

  // 🌟 新機能: フローステップ詳細モーダル
  showFlowStepDetail(step, scenario) {
    this.showFlowDetailModal({
      title: `${step.icon} ${step.title}`,
      content: step,
      type: 'flow-step',
      scenario: scenario
    });
  }

  // 🌟 新機能: フロー詳細モーダル表示
  showFlowDetailModal(data) {
    const modal = document.createElement('div');
    modal.className = 'flow-detail-modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="this.parentElement.remove()">
        <div class="modal-content" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3>${data.title}</h3>
            <button class="modal-close" onclick="this.closest('.flow-detail-modal').remove()">×</button>
          </div>
          <div class="modal-body">
            ${this.generateModalContent(data)}
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" onclick="this.closest('.flow-detail-modal').remove()">
              理解しました
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  // 🌟 新機能: モーダルコンテンツ生成
  generateModalContent(data) {
    if (data.type === 'flow-step') {
      const step = data.content;
      return `
        <div class="step-detail-content">
          <div class="step-description">
            <p>${this.generateStepDescription(step)}</p>
          </div>
          <div class="step-details">
            ${this.generateStepDetails(step)}
          </div>
          ${step.insights ? `
            <div class="step-insights">
              <h4>💡 このステップからの気づき</h4>
              ${step.insights.map(insight => `<p>• ${insight}</p>`).join('')}
            </div>
          ` : ''}
          <div class="bunenjin-insight">
            <h4>🌸 bunenjin哲学の視点</h4>
            <p>この行動は、あなたの${step.type}段階での戦略的選択です。「正しい」「間違い」ではなく、その時の状況に応じた最適解として理解しましょう。</p>
          </div>
        </div>
      `;
    } else if (data.type === 'alternative-scenario') {
      return `
        <div class="alternative-scenario-content">
          <p>${data.content}</p>
          <div class="bunenjin-insight">
            <h4>🌸 bunenjin哲学による理解</h4>
            <p>この代替シナリオは、あなたの「${data.osType} OS」による戦略的アプローチです。どのOSも正解であり、状況に応じて使い分けることが重要です。</p>
          </div>
        </div>
      `;
    }
    return '<p>詳細情報を読み込み中...</p>';
  }

  // 🌟 新機能: 現在のシナリオ取得
  getCurrentScenario(flowTimelines) {
    const activeButton = this.container.querySelector('.scenario-btn.active');
    if (!activeButton) return flowTimelines[0];
    
    const index = parseInt(activeButton.dataset.scenarioIndex);
    return flowTimelines[index] || flowTimelines[0];
  }

  // 🌟 新規: 星座表示HTML生成
  generateConstellationView(engineOS, interfaceOS, safeModeOS) {
    return `
      <div class="constellation-container fade-in">
        <div class="constellation-background"></div>
        <div class="constellation-stars">
          <div class="constellation-star star-1"></div>
          <div class="constellation-star star-2"></div>
          <div class="constellation-star star-3"></div>
          <div class="constellation-star star-4"></div>
          <div class="constellation-star star-5"></div>
          <div class="constellation-star star-6"></div>
        </div>
        
        <div class="constellation-title">人格OS星座</div>
        <div class="constellation-subtitle">bunenjin 分人思想</div>
        
        <div class="constellation-viewport">
          <svg class="constellation-connections">
            <line class="os-connection-line connection-strength-high" id="engine-interface-line" />
            <line class="os-connection-line connection-strength-medium" id="interface-safe-line" />
            <line class="os-connection-line connection-strength-medium" id="safe-engine-line" />
          </svg>
          
          <div class="os-constellation-node os-node-engine" 
               data-os-type="engine" 
               data-os-name="${engineOS?.osName || '本質OS'}" 
               data-strength="${this.formatScientificPercentage(engineOS?.strength || 0)}">
            <div class="os-node-icon"></div>
            <div class="os-node-label">Engine OS<br>${engineOS?.osName || '本質'}</div>
          </div>
          
          <div class="os-constellation-node os-node-interface" 
               data-os-type="interface" 
               data-os-name="${interfaceOS?.osName || '社会OS'}" 
               data-strength="${this.formatScientificPercentage(interfaceOS?.strength || 0)}">
            <div class="os-node-icon"></div>
            <div class="os-node-label">Interface OS<br>${interfaceOS?.osName || '社会'}</div>
          </div>
          
          <div class="os-constellation-node os-node-safe" 
               data-os-type="safe" 
               data-os-name="${safeModeOS?.osName || '防御OS'}" 
               data-strength="${this.formatScientificPercentage(safeModeOS?.strength || 0)}">
            <div class="os-node-icon"></div>
            <div class="os-node-label">Safe Mode OS<br>${safeModeOS?.osName || '防御'}</div>
          </div>
        </div>
        
        <div class="os-tooltip" id="os-tooltip">
          <div class="os-tooltip-title"></div>
          <div class="os-tooltip-description"></div>
        </div>
      </div>
    `;
  }

  // 🌟 新規: 接続線の生成と配置
  generateConnectionLines() {
    const engineNode = this.container.querySelector('.os-node-engine');
    const interfaceNode = this.container.querySelector('.os-node-interface');
    const safeNode = this.container.querySelector('.os-node-safe');
    
    if (!engineNode || !interfaceNode || !safeNode) return;
    
    const viewport = this.container.querySelector('.constellation-viewport');
    const viewportRect = viewport.getBoundingClientRect();
    
    // 各ノードの中心座標を計算
    const getNodeCenter = (node) => {
      const rect = node.getBoundingClientRect();
      const viewportOffset = viewport.getBoundingClientRect();
      return {
        x: rect.left - viewportOffset.left + rect.width / 2,
        y: rect.top - viewportOffset.top + rect.height / 2
      };
    };
    
    const engineCenter = getNodeCenter(engineNode);
    const interfaceCenter = getNodeCenter(interfaceNode);
    const safeCenter = getNodeCenter(safeNode);
    
    // 接続線の設定
    this.setConnectionLine('engine-interface-line', engineCenter, interfaceCenter);
    this.setConnectionLine('interface-safe-line', interfaceCenter, safeCenter);
    this.setConnectionLine('safe-engine-line', safeCenter, engineCenter);
  }

  // 🌟 新規: 接続線の座標設定
  setConnectionLine(lineId, startPoint, endPoint) {
    const line = this.container.querySelector(`#${lineId}`);
    if (!line) return;
    
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    line.style.left = `${startPoint.x}px`;
    line.style.top = `${startPoint.y}px`;
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
  }

  // 🌟 新規: 星座イベントのバインド
  bindConstellationEvents() {
    const nodes = this.container.querySelectorAll('.os-constellation-node');
    const tooltip = this.container.querySelector('#os-tooltip');
    const container = this.container.querySelector('.constellation-container');
    
    nodes.forEach(node => {
      // ホバーでツールチップ表示
      node.addEventListener('mouseenter', (e) => {
        this.showOSTooltip(e.target, tooltip);
        this.highlightOSRelationships(e.target, true);
      });
      
      node.addEventListener('mouseleave', () => {
        this.hideOSTooltip(tooltip);
        this.highlightOSRelationships(null, false);
      });
      
      // クリックで詳細表示
      node.addEventListener('click', (e) => {
        this.handleOSNodeClick(e.target);
      });
    });
    
    // 接続線の生成（レイアウト完了後）
    setTimeout(() => {
      this.generateConnectionLines();
      
      // アニメーション開始
      const lines = this.container.querySelectorAll('.os-connection-line');
      lines.forEach(line => line.classList.add('pulse'));
    }, 100);
  }

  // 🌟 新規: OSツールチップ表示
  showOSTooltip(node, tooltip) {
    const osType = node.dataset.osType;
    const osName = node.dataset.osName;
    const strength = node.dataset.strength;
    
    const descriptions = {
      engine: '本質的な価値観と動機の核となるOS。あなたの真の願いと深層心理を表します。',
      interface: '社会との接点で発揮される表現OS。他者との関係で見せる顔を表します。',
      safe: '困難や脅威から身を守る防御OS。ストレス下での行動パターンを表します。'
    };
    
    tooltip.querySelector('.os-tooltip-title').textContent = `${osName} (${strength})`;
    tooltip.querySelector('.os-tooltip-description').textContent = descriptions[osType] || '';
    
    // ツールチップの位置調整
    const nodeRect = node.getBoundingClientRect();
    const containerRect = this.container.querySelector('.constellation-container').getBoundingClientRect();
    
    tooltip.style.left = `${nodeRect.left - containerRect.left + nodeRect.width / 2}px`;
    tooltip.style.top = `${nodeRect.top - containerRect.top - 60}px`;
    tooltip.style.transform = 'translateX(-50%)';
    
    tooltip.classList.add('show');
  }

  // 🌟 新規: OSツールチップ非表示
  hideOSTooltip(tooltip) {
    tooltip.classList.remove('show');
  }

  // 🌟 新規: OS関係性ハイライト
  highlightOSRelationships(activeNode, highlight) {
    const container = this.container.querySelector('.constellation-container');
    const nodes = this.container.querySelectorAll('.os-constellation-node');
    const lines = this.container.querySelectorAll('.os-connection-line');
    
    if (highlight && activeNode) {
      container.classList.add('focused');
      
      nodes.forEach(node => {
        if (node === activeNode) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      });
      
      // 関連する接続線をハイライト
      const osType = activeNode.dataset.osType;
      lines.forEach(line => {
        const shouldHighlight = line.id.includes(osType);
        line.classList.toggle('highlighted', shouldHighlight);
      });
      
    } else {
      container.classList.remove('focused');
      nodes.forEach(node => node.classList.remove('active'));
      lines.forEach(line => line.classList.remove('highlighted'));
    }
  }

  // 🌟 新規: OSノードクリック処理
  handleOSNodeClick(node) {
    const osType = node.dataset.osType;
    const osName = node.dataset.osName;
    
    // bunenjin哲学に基づく詳細説明を表示
    const insights = this.generateOSInsight(osType, osName);
    
    this.showOSDetailModal({
      title: `${osName} の詳細`,
      type: osType,
      insights: insights
    });
  }

  // 🌟 新規: OS固有の洞察生成
  generateOSInsight(osType, osName) {
    const baseInsights = {
      engine: {
        role: '本質的動機システム',
        description: 'あなたの最も深い価値観と願いを司るOS。人生の方向性を決める羅針盤のような存在です。',
        examples: [
          '重要な決断を下す時に現れる',
          '長期的な目標設定に影響する',
          '価値観に関わる議論で強く反応する'
        ]
      },
      interface: {
        role: '社会適応システム',
        description: '他者との関係で発揮される表現力と適応能力を司るOS。社会的な成功と調和を担います。',
        examples: [
          'プレゼンテーションや会議で活躍',
          '人との関係構築で力を発揮',
          'チームワークが求められる場面で現れる'
        ]
      },
      safe: {
        role: '防御・回復システム',
        description: 'ストレスや困難から身を守り、安定を保つためのOS。危機管理と自己保護を担います。',
        examples: [
          'プレッシャーの強い状況で活性化',
          '予期しない変化への対応で現れる',
          '休息や回復が必要な時に優先される'
        ]
      }
    };
    
    return baseInsights[osType] || baseInsights.engine;
  }

  // 🌟 新規: OS詳細モーダル表示
  showOSDetailModal(data) {
    const modal = document.createElement('div');
    modal.className = 'os-detail-modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="this.parentElement.remove()">
        <div class="modal-content constellation-modal" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3>${data.title}</h3>
            <div class="os-type-badge os-${data.type}">${data.insights.role}</div>
            <button class="modal-close" onclick="this.closest('.os-detail-modal').remove()">×</button>
          </div>
          <div class="modal-body">
            <div class="os-description">
              <p>${data.insights.description}</p>
            </div>
            <div class="os-examples">
              <h4>💡 このOSが活躍する場面</h4>
              <ul>
                ${data.insights.examples.map(example => `<li>${example}</li>`).join('')}
              </ul>
            </div>
            <div class="bunenjin-philosophy">
              <h4>🌸 bunenjin哲学の視点</h4>
              <p>このOSは「真の自分」ではなく、あなたの多面的な人格の一部です。状況に応じて適切なOSを選択できることが、戦略的な生き方につながります。</p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" onclick="this.closest('.os-detail-modal').remove()">
              理解しました
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  // Future Simulatorへの導線処理
  handleFutureSimulatorNavigation() {
    // 分析結果をlocalStorageに保存
    this.saveDiagnosisForFutureUse();
    
    // Future Simulatorへリダイレクト（今後実装予定のページ）
    alert("🚀 Future Simulatorは間もなく公開予定です！\n\n現在の診断結果は保存されましたので、公開時にスムーズにご利用いただけます。\n\n保存された内容：\n・あなたの3つの人格OS\n・行動パターンの分析\n・具体的な改善提案");
    
    // 今後の実装: window.location.href = "/future_simulator.html";
  }

  // 診断結果をFuture Simulator用に保存
  saveDiagnosisForFutureUse() {
    const diagnosisData = {
      timestamp: new Date().toISOString(),
      analysisResult: this.analysisResult,
      insights: this.insights,
      behavioralInsights: this.behavioralEngine ? 
        this.behavioralEngine.generateBehavioralInsights(this.analysisResult) : null,
      version: "1.0",
      userJourney: "os_analyzer_completed"
    };
    
    try {
      localStorage.setItem('haqei_diagnosis_for_future_simulator', JSON.stringify(diagnosisData));
      console.log("✅ 診断結果をFuture Simulator用に保存しました");
      return true;
    } catch (error) {
      console.error("❌ 診断結果の保存に失敗しました:", error);
      return false;
    }
  }
}
