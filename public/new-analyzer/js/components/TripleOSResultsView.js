// TripleOSResultsView.js - 3層OS分析結果表示コンポーネント
// HaQei Analyzer - Triple OS Results View Component

class TripleOSResultsView extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, options);

    // ★★★ 観測所 ★★★
    console.log("🕵️‍♂️ [TRACE-CHECKPOINT 3] TripleOSResultsViewが受け取ったオプション内容を検証します。", options);
    
    this.analysisResult = options.analysisResult;
    this.insights = options.insights;
    this.compatibilityLoader = options.compatibilityLoader;
    this.dataManager = options.dataManager;
    this.compatibilityAnalysisData = null;

    if (this.compatibilityLoader) {
        console.log("✅ [TripleOSResultsView] compatibilityLoaderは正常に到着しました。");
    } else {
        // もし、ここが実行された場合、app.jsとTripleOSResultsViewの間で何かが起きている
        console.error("❌ [TripleOSResultsView] 致命的エラー: compatibilityLoaderが到着しませんでした。");
    }

    // 既存のプロパティも保持
    this.advancedCompatibilityEngine = null;
    this.shareManager = null;
    this.pdfExporter = null;
    this.imageExporter = null;
    this.historyManager = null;
    this.analyticsCollector = null;
    this.radarChart = null; // Chart.jsインスタンスを保存
    
    // 初期化処理
    this.initializeShareManager();
    this.initializeAdvancedCompatibilityEngine();
    this.initializeExportSystems();
    this.initializeAnalytics();
  }

  get defaultOptions() {
    return {
      ...super.defaultOptions,
      onExploreMore: null,
      onRetakeTest: null,
      onGenerateReport: null,
      showAnimation: true,
      enhancedMode: false, // 新しいオプション
    };
  }

  // 分析結果データを設定
  setData(analysisResult) {
    this.analysisResult = analysisResult;
    console.log("🎯 TripleOSResultsView: Data set", analysisResult);
    
    // 履歴に保存
    if (this.historyManager) {
      this.historyManager.saveToHistory(analysisResult, {
        timestamp: Date.now(),
        version: '1.0'
      });
    }
    
    // アナリティクス追跡
    if (this.analyticsCollector) {
      this.analyticsCollector.trackDiagnosisUsage(analysisResult, {
        enhancedModeUsed: this.options.enhancedMode,
        completionTime: Date.now() - (analysisResult.startTime || Date.now())
      });
    }
  }

  render() {
    if (!this.analysisResult) {
      this.container.innerHTML = `
        <div class="error">
          分析結果が見つかりません。
        </div>
      `;
      return;
    }

    const { engineOS, interfaceOS, safeModeOS } = this.analysisResult;
    const archetypeTitle = engineOS && engineOS.hexagramInfo ? engineOS.hexagramInfo.catchphrase || "あなたの原型" : "あなたの原型";
    const archetypeCatchphrase = "あなたの分析結果の要約がここに表示されます。"; // これは後でInsightsから取得

    const html = `
    <div class="results-view-final">

        <section class="summary-hero">
            <div class="hero-text">
                <h1 class="archetype-title">${engineOS && engineOS.osName ? engineOS.osName : '不明'}の人</h1>
                <p class="archetype-catchphrase">${archetypeTitle}</p>
            </div>
            <div class="chart-container">
                <canvas id="profile-radar-chart"></canvas>
            </div>
        </section>

        <section class="os-cards-section">
            <h2 class="section-title">あなたの3層人格OS</h2>
            <div class="os-cards-container">
                
                <div class="os-card" data-os-type="engine">
                    <div class="os-card-header">
                        <div class="os-icon">🔧</div>
                        <div class="os-label-group">
                            <h3>エンジンOS</h3>
                            <p>核となる価値観と動機</p>
                        </div>
                        <div class="os-score-group">
                            <div class="os-name">${engineOS && engineOS.osName ? engineOS.osName : '不明'}</div>
                            <div class="os-score">${engineOS && engineOS.strength ? Math.round(engineOS.strength * 100) : 0}%</div>
                        </div>
                    </div>
                    <div class="os-card-body">
                        ${this.generateOSCardBody(engineOS, 'engine')}
                    </div>
                </div>

                <div class="os-card" data-os-type="interface">
                    <div class="os-card-header">
                        <div class="os-icon">🖥️</div>
                        <div class="os-label-group">
                            <h3>インターフェースOS</h3>
                            <p>外面的な行動パターン</p>
                        </div>
                        <div class="os-score-group">
                            <div class="os-name">${interfaceOS && interfaceOS.osName ? interfaceOS.osName : '不明'}</div>
                            <div class="os-score">${interfaceOS && interfaceOS.matchScore ? interfaceOS.matchScore : 0}%</div>
                        </div>
                    </div>
                    <div class="os-card-body">
                        ${this.generateOSCardBody(interfaceOS, 'interface')}
                    </div>
                </div>

                <div class="os-card" data-os-type="safemode">
                    <div class="os-card-header">
                        <div class="os-icon">🛡️</div>
                        <div class="os-label-group">
                            <h3>セーフモードOS</h3>
                            <p>内面的な防御機制</p>
                        </div>
                        <div class="os-score-group">
                            <div class="os-name">${safeModeOS && safeModeOS.osName ? safeModeOS.osName : '不明'}</div>
                            <div class="os-score">${safeModeOS && safeModeOS.matchScore ? safeModeOS.matchScore : 0}%</div>
                        </div>
                    </div>
                    <div class="os-card-body">
                        ${this.generateOSCardBody(safeModeOS, 'safemode')}
                    </div>
                </div>

            </div>
        </section>

        <section class="dynamics-section">
            <h2 class="section-title">内なる力学</h2>
            <div class="dynamics-cards-container">
                <div id="interface-dynamics-card-container"></div>
                <div id="safemode-dynamics-card-container"></div>
            </div>
        </section>
        
    </div>
    `;

    this.container.innerHTML = html;
    
    // イベントリスナーをバインド
    this._bindEventListeners();
    
    // レーダーチャートを描画（少し遅延させる）
    setTimeout(() => {
      this.renderRadarChart();
    }, 100);
    
    // 力学データを非同期で読み込み
    setTimeout(() => {
      this.loadDynamicsData();
    }, 200); 
  }

  /**
   * OSカードのボディ部分のHTMLを生成
   */
  generateOSCardBody(osData, osType) {
    if (!osData || !osData.hexagramId || !this.dataManager) {
      return '<p>詳細情報を読み込めませんでした。</p>';
    }

    try {
      const hexagramDetails = this.dataManager.getHexagramDetails(osData.hexagramId);
      
      // hexagramDetailsは常に何らかの値を返すように修正されているので、nullチェックは不要
      const strengths = hexagramDetails.potential_strengths || [];
      const weaknesses = hexagramDetails.potential_weaknesses || [];

      const strengthsHtml = strengths.length > 0 ? 
        strengths.map(s => `<li>${s}</li>`).join('') : 
        '<li>分析データを準備中です...</li>';
        
      const weaknessesHtml = weaknesses.length > 0 ? 
        weaknesses.map(w => `<li>${w}</li>`).join('') : 
        '<li>分析データを準備中です...</li>';

      // OSタイプごとに基本的な説明を追加
      const osTypeDescription = this.getOSTypeDescription(osType);

      return `
        <div class="os-card-description">
          <p>${osTypeDescription}</p>
        </div>
        <h4>潜在的な強み</h4>
        <ul>${strengthsHtml}</ul>
        <h4>成長の課題</h4>
        <ul>${weaknessesHtml}</ul>
      `;
    } catch (error) {
      console.error('OSカード詳細の生成でエラー:', error);
      return '<p>詳細情報の生成でエラーが発生しました。</p>';
    }
  }

  /**
   * OSタイプごとの基本説明を取得
   */
  getOSTypeDescription(osType) {
    const descriptions = {
      engine: 'あなたの核となる価値観と内的動機を表します。これは最も深い層での意思決定の基準となり、人生の方向性を決める重要な要素です。',
      interface: 'あなたが外の世界とどのように関わり、他者にどのような印象を与えるかを表します。コミュニケーションスタイルや行動パターンの基盤となります。',
      safemode: 'ストレスや困難な状況で発動する防御機制を表します。危機的状況での反応パターンや、自己保護のメカニズムを理解するのに重要です。'
    };
    
    return descriptions[osType] || 'このOSタイプの詳細な説明を準備中です。';
  }

  // 新しいストーリー型UI表示をレンダリング
  renderBasic() {
    const { engineOS, interfaceOS, safeModeOS, consistencyScore, integration } =
      this.analysisResult;

    this.container.innerHTML = `
      <div class="triple-os-results-container">
        <!-- フェーズ1: 人格の要約セクション -->
        <section class="summary-hero">
          <div class="archetype-title">${this.generateArchetypeTitle()}</div>
          <div class="archetype-catchphrase">${this.generateArchetypeCatchphrase()}</div>
          <div class="profile-chart-container">
            <canvas id="profile-radar-chart" width="400" height="400"></canvas>
          </div>
        </section>

        <!-- フェーズ2: インタラクティブな3OSカードセクション -->
        <section class="os-cards-section">
          <h2>あなたの3層人格OS</h2>
          <div class="os-cards-grid">
            ${this.generateOSCard('engine', engineOS, '🔧', 'エンジンOS', '内なる核となる価値観と動機')}
            ${this.generateOSCard('interface', interfaceOS, '🌐', 'インターフェースOS', '外の世界との関わり方')}
            ${this.generateOSCard('safemode', safeModeOS, '🛡️', 'セーフモードOS', 'ストレス時の防御機制')}
          </div>
        </section>

        <!-- フェーズ3: 内なる力学（相性分析）セクション -->
        <section class="dynamics-section">
          <h2>内なる力学</h2>
          <div class="dynamics-cards">
            <div id="interface-dynamics-card-container" class="dynamics-loading">データを読み込み中...</div>
            <div id="safemode-dynamics-card-container" class="dynamics-loading">データを読み込み中...</div>
          </div>
        </section>

        <!-- 従来の詳細分析ボタンは残す（要求があれば非表示も可能） -->
        <div class="legacy-actions" style="display: none;">
          <div class="compatibility-analysis-section animate-fade-in animate-delay-800">
            <button class="compatibility-analysis-btn">
              🎯 完全相性分析を表示
            </button>
          </div>
        </div>
      </div>
    `;
    
    // レンダリング完了後、少し遅延してレーダーチャートを描画
    setTimeout(() => {
      this.renderRadarChart();
    }, 100);
    
    // 相性分析データを非同期で読み込み
    setTimeout(() => {
      this.loadDynamicsData();
    }, 200);
  }

  // 拡張された表示をレンダリング
  renderEnhanced() {
    const { engineOS, interfaceOS, safeModeOS, consistencyScore, integration } =
      this.analysisResult;

    this.container.innerHTML = `
      <div class="triple-os-results-container enhanced-mode">
        <div class="results-header">
          <h1 class="results-title animate-fade-in">✨ 拡張3層人格OS分析結果 ✨</h1>
          <p class="results-subtitle animate-fade-in animate-delay-200">
            あなたのOSをより深く、多角的に分析しました
          </p>
        </div>

        <!-- OS詳細情報 -->
        <div class="enhanced-section">
            <h3>OS詳細情報</h3>
            <div class="os-detail-grid">
                ${this.renderEnhancedOSCard(engineOS, "engine", "エンジンOS")}
                ${this.renderEnhancedOSCard(interfaceOS, "interface", "インターフェースOS")}
                ${this.renderEnhancedOSCard(safeModeOS, "safemode", "セーフモードOS")}
            </div>
        </div>

        <!-- 8次元プロファイル -->
        <div class="enhanced-section">
            <h3>8次元プロファイル</h3>
            <div class="chart-container">
                <canvas id="eight-dimension-radar-chart"></canvas>
            </div>
            <div id="eight-dimension-details" class="dimension-details"></div>
        </div>

        <!-- OS間相性分析 -->
        <div class="enhanced-section">
            <h3>内的チーム相性分析</h3>
            <div id="compatibility-analysis-container">
                <!-- 高度相性分析結果がここに入る -->
                <div class="loading-placeholder">内的チーム相性分析を実行中...</div>
            </div>
        </div>

        <!-- 動的コンテキスト評価 -->
        <div class="enhanced-section">
            <h3>パーソナライズド洞察</h3>
            <div id="context-evaluation-container">
                <!-- コンテキスト評価UI -->
                <div class="context-input-section">
                    <h4>現在の状況をお聞かせください</h4>
                    <div class="context-form">
                        <div class="form-group">
                            <label for="life-stage-select">現在のライフステージ:</label>
                            <select id="life-stage-select" class="context-select">
                                <option value="">選択してください</option>
                                <option value="exploring">探索期（新しいことを学び経験を積む時期）</option>
                                <option value="establishing">確立期（基盤を築き安定を求める時期）</option>
                                <option value="developing">発展期（スキルを磨き成長する時期）</option>
                                <option value="mastering">熟練期（専門性を深め指導する時期）</option>
                                <option value="reflecting">統合期（経験を振り返り智慧を深める時期）</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>現在の目標（複数選択可）:</label>
                            <div class="checkbox-group">
                                <label><input type="checkbox" value="career_growth"> キャリア成長</label>
                                <label><input type="checkbox" value="personal_growth"> 個人的成長</label>
                                <label><input type="checkbox" value="relationship_improvement"> 人間関係の改善</label>
                                <label><input type="checkbox" value="work_life_balance"> ワークライフバランス</label>
                                <label><input type="checkbox" value="creative_expression"> 創造的表現</label>
                                <label><input type="checkbox" value="leadership_development"> リーダーシップ開発</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>現在直面している課題（複数選択可）:</label>
                            <div class="checkbox-group">
                                <label><input type="checkbox" value="stress_management"> ストレス管理</label>
                                <label><input type="checkbox" value="decision_making"> 意思決定</label>
                                <label><input type="checkbox" value="communication"> コミュニケーション</label>
                                <label><input type="checkbox" value="time_management"> 時間管理</label>
                                <label><input type="checkbox" value="conflict_resolution"> 対立解決</label>
                                <label><input type="checkbox" value="change_adaptation"> 変化への適応</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="environment-select">主な活動環境:</label>
                            <select id="environment-select" class="context-select">
                                <option value="">選択してください</option>
                                <option value="corporate">企業・組織</option>
                                <option value="startup">スタートアップ・ベンチャー</option>
                                <option value="creative">クリエイティブ・芸術</option>
                                <option value="academic">学術・研究</option>
                                <option value="freelance">フリーランス・個人事業</option>
                                <option value="education">教育・指導</option>
                            </select>
                        </div>
                        <button id="update-context-btn" class="btn btn-primary">洞察を更新</button>
                    </div>
                </div>
                <div id="contextual-insights-results" class="contextual-results">
                    <!-- コンテキスト評価結果がここに表示される -->
                </div>
            </div>
        </div>

        <!-- OS関係性アニメーション -->
        <div class="enhanced-section">
            <div id="internal-team-dynamics-container">
                <!-- Internal Team Dynamics Visualizer がここに表示されます -->
            </div>
        </div>

        <!-- 内的統合ガイダンス -->
        <div class="enhanced-section">
            <h3>内的統合ガイダンス</h3>
            <div id="guidance-container">
                <!-- 内的統合ガイダンスがここに入る -->
                <p>あなたへのパーソナルな統合ガイダンスがここに表示されます。</p>
            </div>
        </div>

        <div class="results-actions animate-fade-in animate-delay-1000">
          <button id="explore-more-btn" class="btn btn-lg">
            📊 詳細分析を見る
          </button>
          <button id="generate-report-btn" class="btn btn-secondary">
            📄 レポート生成
          </button>
          <button id="export-pdf-btn" class="btn btn-secondary">
            📄 PDF出力
          </button>
          <button id="export-image-btn" class="btn btn-secondary">
            🖼️ 画像保存
          </button>
          <button id="share-results-btn" class="btn btn-secondary">
            🔗 結果を共有
          </button>
          <button id="retake-test-btn" class="btn btn-secondary">
            🔄 再診断
          </button>
        </div>
      </div>
    `;

    // 8次元レーダーチャートの描画
    this.renderEightDimensionRadarChart(engineOS.userVector);
    this.renderEightDimensionDetails(engineOS.userVector);
    
    // 内的チーム力学の可視化を初期化
    this.initializeInternalTeamDynamics();
    
    // インタラクティブシステムを初期化
    this.initializeInteractiveSystem();
    
    // 高度相性分析を実行
    this.renderAdvancedCompatibilityAnalysis();
    
    // コンテキスト評価のイベントリスナーを設定
    this.setupContextEvaluationEvents();
  }

  // 8次元レーダーチャートを描画するメソッド
  renderEightDimensionRadarChart(userVector) {
    const ctx = document.getElementById('eight-dimension-radar-chart').getContext('2d');
    if (!ctx) return;

    const labels = Object.values(this.eightDimensionAnalysisEngine.dimensions).map(d => d.name);
    const data = Object.values(userVector);

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'あなたの8次元プロファイル',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        display: false
                    },
                    suggestedMin: 0,
                    suggestedMax: 1,
                    pointLabels: {
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const dimensionName = context.label;
                            const value = context.raw;
                            const interpretation = this.eightDimensionAnalysisEngine._interpretValue(value, dimensionName);
                            return `${dimensionName}: ${value.toFixed(2)}
${interpretation}`;
                        }
                    }
                }
            }
        }
    });
  }

  // 8次元の詳細説明をレンダリングするメソッド
  renderEightDimensionDetails(userVector) {
    const container = document.getElementById('eight-dimension-details');
    if (!container) return;

    const analysis = this.eightDimensionAnalysisEngine.analyzeDimensions(userVector);
    const { strengths, weaknesses } = this.eightDimensionAnalysisEngine.analyzeStrengthsWeaknesses(userVector);

    let html = '<h4>各次元の解釈</h4>';
    for (const key in analysis) {
        const dim = analysis[key];
        html += `
            <div class="dimension-detail-item">
                <strong>${dim.name}:</strong> ${dim.interpretation}
            </div>
        `;
    }

    html += '<h4>強みと弱み</h4>';
    html += '<div class="strength-weakness-section">';
    html += '<div class="strengths"><h5>強み</h5><ul>';
    strengths.forEach(s => { html += `<li>${s}</li>`; });
    html += '</ul></div>';
    html += '<div class="weaknesses"><h5>弱み</h5><ul>';
    weaknesses.forEach(w => { html += `<li>${w}</li>`; });
    html += '</ul></div>';
    html += '</div>';

    container.innerHTML = html;
  }

  // 内的チーム力学の可視化を初期化
  async initializeInternalTeamDynamics() {
    try {
      // InternalTeamDynamicsVisualizerをインポート
      const { default: InternalTeamDynamicsVisualizer } = await import('./InternalTeamDynamicsVisualizer.js');
      
      // 相性データを取得
      const compatibilityData = this.internalCompatibilityEngine ? 
        this.internalCompatibilityEngine.analyzeTripleOSCompatibility(
          this.analysisResult.engineOS.hexagramId,
          this.analysisResult.interfaceOS.hexagramId,
          this.analysisResult.safeModeOS.hexagramId
        ) : null;

      // 可視化コンポーネントを作成
      this.internalTeamDynamicsVisualizer = new InternalTeamDynamicsVisualizer(
        'internal-team-dynamics-container',
        {
          width: 600,
          height: 400,
          enableParticles: true,
          enableRadar: true,
          animationSpeed: 1.0,
          particleCount: 50,
          showLabels: true
        }
      );

      // データを設定
      this.internalTeamDynamicsVisualizer.setDynamicsData(this.analysisResult, compatibilityData);
      
      // レンダリング
      this.internalTeamDynamicsVisualizer.render();
      
      console.log("✅ Internal Team Dynamics Visualizer initialized successfully");
      
    } catch (error) {
      console.error("❌ Failed to initialize Internal Team Dynamics Visualizer:", error);
      
      // フォールバック表示
      const container = document.getElementById('internal-team-dynamics-container');
      if (container) {
        container.innerHTML = `
          <div class="dynamics-error">
            内的チーム力学の可視化を読み込み中にエラーが発生しました。
            <br>
            <small>エラー詳細: ${error.message}</small>
          </div>
        `;
      }
    }
  }

  // インタラクティブシステムを初期化
  async initializeInteractiveSystem() {
    try {
      // InteractiveSystemをインポート
      const { default: InteractiveSystem } = await import('./InteractiveSystem.js');
      
      // インタラクティブシステムを作成
      this.interactiveSystem = new InteractiveSystem(
        this.containerId,
        {
          enableCardExpansion: true,
          enableTooltips: true,
          enableTabs: true,
          animationDuration: 300,
          tooltipDelay: 500,
          maxExpandedCards: 3,
        }
      );

      // システムを有効化
      this.interactiveSystem.activate();
      
      // OSカードにdata-card-id属性を追加
      this.addCardIdentifiers();
      
      console.log("✅ Interactive System initialized successfully");
      
    } catch (error) {
      console.error("❌ Failed to initialize Interactive System:", error);
    }
  }

  // OSカードに識別子を追加
  addCardIdentifiers() {
    const cards = this.container.querySelectorAll('.os-detail-card, .os-card');
    
    cards.forEach((card, index) => {
      if (card.classList.contains('os-detail-card-engine') || card.classList.contains('os-card-engine')) {
        card.setAttribute('data-card-id', 'engine');
      } else if (card.classList.contains('os-detail-card-interface') || card.classList.contains('os-card-interface')) {
        card.setAttribute('data-card-id', 'interface');
      } else if (card.classList.contains('os-detail-card-safemode') || card.classList.contains('os-card-safemode')) {
        card.setAttribute('data-card-id', 'safemode');
      } else {
        card.setAttribute('data-card-id', `card-${index}`);
      }
    });
  }

  // ShareManagerを初期化
  async initializeShareManager() {
    try {
      const { default: ShareManager } = await import('../core/ShareManager.js');
      
      this.shareManager = new ShareManager({
        expirationDays: 30,
        keyPrefix: 'haqei_share_',
        urlBasePath: '/results',
        enableAnalytics: true,
        maxShares: 50
      });
      
      console.log("✅ ShareManager initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize ShareManager:", error);
    }
  }

  // AdvancedCompatibilityEngineを初期化
  async initializeAdvancedCompatibilityEngine() {
    try {
      console.log("🔍 Initializing AdvancedCompatibilityEngine...");
      
      if (!this.internalCompatibilityEngine) {
        // 対話型UIでは必須ではないため、デバッグレベルでログ出力
        console.debug("🔍 internalCompatibilityEngine is not available (not required for interactive UI)");
        return;
      }
      
      const { default: AdvancedCompatibilityEngine } = await import('../core/AdvancedCompatibilityEngine.js');
      
      this.advancedCompatibilityEngine = new AdvancedCompatibilityEngine(this.internalCompatibilityEngine);
      
      console.log("✅ AdvancedCompatibilityEngine initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize AdvancedCompatibilityEngine:", error);
    }
  }

  // 高度相性分析を実行してレンダリング
  async renderAdvancedCompatibilityAnalysis() {
    const container = document.getElementById('compatibility-analysis-container');
    if (!container || !this.advancedCompatibilityEngine) {
      console.warn("⚠️ AdvancedCompatibilityEngine not available");
      return;
    }

    try {
      // デフォルトのユーザーコンテキスト
      const defaultUserContext = {
        lifeStage: 'developing',
        goals: ['personal_growth'],
        challenges: [],
        environment: { type: 'corporate' }
      };

      // 高度相性分析を実行
      console.log("🔍 Starting advanced compatibility analysis...");
      console.log("🔍 Engine ID:", this.analysisResult.engineOS.hexagramId);
      console.log("🔍 Interface ID:", this.analysisResult.interfaceOS.hexagramId);
      console.log("🔍 SafeMode ID:", this.analysisResult.safeModeOS.hexagramId);
      
      const advancedAnalysis = await this.advancedCompatibilityEngine.analyzeInternalTeamComposition(
        this.analysisResult.engineOS.hexagramId,
        this.analysisResult.interfaceOS.hexagramId,
        this.analysisResult.safeModeOS.hexagramId,
        defaultUserContext
      );
      
      console.log("🔍 Advanced analysis result:", advancedAnalysis);

      // 結果をレンダリング
      container.innerHTML = this.renderAdvancedAnalysisResults(advancedAnalysis);
      
      console.log("✅ Advanced compatibility analysis rendered successfully");
      
    } catch (error) {
      console.error("❌ Failed to render advanced compatibility analysis:", error);
      container.innerHTML = `
        <div class="analysis-error">
          高度相性分析の実行中にエラーが発生しました。
          <br>
          <small>エラー詳細: ${error.message}</small>
        </div>
      `;
    }
  }

  // 高度分析結果をレンダリング
  renderAdvancedAnalysisResults(analysis) {
    console.log("🔍 Analysis object received:", analysis);
    
    if (!analysis) {
      return '<div class="analysis-error">分析結果が取得できませんでした。</div>';
    }
    
    const { overallAssessment, specialPattern, historicalMatches, optimizationHints } = analysis;
    
    console.log("🔍 overallAssessment:", overallAssessment);
    
    if (!overallAssessment) {
      return '<div class="analysis-error">総合評価データが取得できませんでした。</div>';
    }
    
    if (typeof overallAssessment.teamEffectiveness === 'undefined') {
      return '<div class="analysis-error">チーム効果性データが見つかりません。</div>';
    }
    
    let html = `
      <div class="advanced-analysis-results">
        <!-- 総合評価 -->
        <div class="overall-assessment">
          <h4>🎯 内的チーム効果性</h4>
          <div class="effectiveness-score">
            <div class="score-circle-large">
              <div class="score-value-large">${Math.round(overallAssessment.teamEffectiveness * 100)}%</div>
              <div class="score-label-large">チーム効果性</div>
            </div>
          </div>
          
          <div class="assessment-details">
            <div class="strength-areas">
              <h5>✨ 強みエリア</h5>
              <ul>
                ${overallAssessment.strengthAreas.map(area => `<li>${area}</li>`).join('')}
              </ul>
            </div>
            
            <div class="growth-areas">
              <h5>🌱 成長エリア</h5>
              <ul>
                ${overallAssessment.growthAreas.map(area => `<li>${area}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
    `;

    // 特殊パターンがあれば表示
    if (specialPattern) {
      html += `
        <div class="special-pattern">
          <h4>🔍 特殊パターン検出</h4>
          <div class="pattern-card">
            <h5>${specialPattern.name}</h5>
            <p class="pattern-description">${specialPattern.description}</p>
            <div class="pattern-confidence">
              信頼度: ${Math.round(specialPattern.confidence * 100)}%
            </div>
            
            <div class="pattern-characteristics">
              <h6>特徴:</h6>
              <ul>
                ${specialPattern.characteristics.map(char => `<li>${char}</li>`).join('')}
              </ul>
            </div>
            
            <div class="pattern-advice">
              <h6>アドバイス:</h6>
              <ul>
                ${specialPattern.advice.map(advice => `<li>${advice}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
    }

    // 歴史上の人物マッチがあれば表示
    if (historicalMatches.length > 0) {
      html += `
        <div class="historical-matches">
          <h4>📚 歴史上の人物との類似性</h4>
          <div class="matches-grid">
      `;
      
      historicalMatches.forEach(match => {
        html += `
          <div class="historical-match-card">
            <h5>${match.name}</h5>
            <div class="similarity-score">類似度: ${Math.round(match.similarity * 100)}%</div>
            <p class="match-description">${match.description}</p>
            <div class="match-traits">
              <strong>特徴:</strong> ${match.traits.join(', ')}
            </div>
            <div class="modern-application">
              <strong>現代への応用:</strong> ${match.modernApplication}
            </div>
          </div>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
    }

    // 最適化ヒント
    if (optimizationHints) {
      html += `
        <div class="optimization-hints">
          <h4>💡 内的バランス最適化ヒント</h4>
          <div class="hints-tabs">
            <div class="hints-tab-nav">
              <button class="hints-tab-btn active" data-tab="immediate">今すぐ</button>
              <button class="hints-tab-btn" data-tab="shortTerm">短期</button>
              <button class="hints-tab-btn" data-tab="longTerm">長期</button>
              <button class="hints-tab-btn" data-tab="lifestyle">ライフスタイル</button>
            </div>
            
            <div class="hints-tab-content">
              <div class="hints-tab-panel active" id="hints-immediate">
                <ul>
                  ${optimizationHints.immediate.map(hint => `<li>${hint}</li>`).join('')}
                </ul>
              </div>
              <div class="hints-tab-panel" id="hints-shortTerm">
                <ul>
                  ${optimizationHints.shortTerm.map(hint => `<li>${hint}</li>`).join('')}
                </ul>
              </div>
              <div class="hints-tab-panel" id="hints-longTerm">
                <ul>
                  ${optimizationHints.longTerm.map(hint => `<li>${hint}</li>`).join('')}
                </ul>
              </div>
              <div class="hints-tab-panel" id="hints-lifestyle">
                <ul>
                  ${optimizationHints.lifestyle.map(hint => `<li>${hint}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    html += `
      </div>
    `;

    // ヒントタブの動作を設定
    setTimeout(() => {
      this.setupHintsTabNavigation();
    }, 100);

    return html;
  }

  // ヒントタブのナビゲーションを設定
  setupHintsTabNavigation() {
    const tabButtons = document.querySelectorAll('.hints-tab-btn');
    const tabPanels = document.querySelectorAll('.hints-tab-panel');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        
        // アクティブなタブを切り替え
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(`hints-${targetTab}`).classList.add('active');
      });
    });
  }

  // コンテキスト評価のイベントリスナーを設定
  setupContextEvaluationEvents() {
    const updateBtn = document.getElementById('update-context-btn');
    if (!updateBtn) return;

    updateBtn.addEventListener('click', () => {
      this.updateContextualInsights();
    });
  }

  // コンテキストに基づく洞察を更新
  async updateContextualInsights() {
    if (!this.advancedCompatibilityEngine) {
      console.warn("⚠️ AdvancedCompatibilityEngine not available");
      return;
    }

    try {
      // フォームからユーザーコンテキストを取得
      const userContext = this.getUserContextFromForm();
      
      // 更新ボタンを無効化
      const updateBtn = document.getElementById('update-context-btn');
      updateBtn.disabled = true;
      updateBtn.textContent = '分析中...';

      // 新しいコンテキストで再分析
      const updatedAnalysis = await this.advancedCompatibilityEngine.analyzeInternalTeamComposition(
        this.analysisResult.engineOS.hexagramId,
        this.analysisResult.interfaceOS.hexagramId,
        this.analysisResult.safeModeOS.hexagramId,
        userContext
      );

      // 結果を表示
      const resultsContainer = document.getElementById('contextual-insights-results');
      resultsContainer.innerHTML = this.renderContextualInsights(updatedAnalysis, userContext);
      
      // 相性分析結果も更新
      const compatibilityContainer = document.getElementById('compatibility-analysis-container');
      compatibilityContainer.innerHTML = this.renderAdvancedAnalysisResults(updatedAnalysis);
      
      console.log("✅ Contextual insights updated successfully");
      
    } catch (error) {
      console.error("❌ Failed to update contextual insights:", error);
    } finally {
      // ボタンを再有効化
      const updateBtn = document.getElementById('update-context-btn');
      updateBtn.disabled = false;
      updateBtn.textContent = '洞察を更新';
    }
  }

  // フォームからユーザーコンテキストを取得
  getUserContextFromForm() {
    const lifeStage = document.getElementById('life-stage-select').value;
    const environment = document.getElementById('environment-select').value;
    
    const goals = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
      .filter(cb => cb.closest('.form-group').querySelector('label').textContent.includes('目標'))
      .map(cb => cb.value);
    
    const challenges = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
      .filter(cb => cb.closest('.form-group').querySelector('label').textContent.includes('課題'))
      .map(cb => cb.value);

    return {
      lifeStage,
      goals,
      challenges,
      environment: { type: environment }
    };
  }

  // コンテキスト洞察をレンダリング
  renderContextualInsights(analysis, userContext) {
    const { contextualAdjustment } = analysis;
    
    if (!contextualAdjustment) {
      return '<div class="no-insights">コンテキスト情報が不足しています。</div>';
    }

    let html = `
      <div class="contextual-insights">
        <h4>📊 あなたの状況に基づく洞察</h4>
        
        <div class="context-summary">
          <div class="context-tags">
    `;

    // ライフステージタグ
    if (userContext.lifeStage) {
      const stageLabels = {
        'exploring': '探索期',
        'establishing': '確立期', 
        'developing': '発展期',
        'mastering': '熟練期',
        'reflecting': '統合期'
      };
      html += `<span class="context-tag stage">${stageLabels[userContext.lifeStage]}</span>`;
    }

    // 目標タグ
    userContext.goals.forEach(goal => {
      const goalLabels = {
        'career_growth': 'キャリア成長',
        'personal_growth': '個人成長',
        'relationship_improvement': '人間関係改善',
        'work_life_balance': 'ワークライフバランス',
        'creative_expression': '創造的表現',
        'leadership_development': 'リーダーシップ開発'
      };
      html += `<span class="context-tag goal">${goalLabels[goal]}</span>`;
    });

    // 課題タグ
    userContext.challenges.forEach(challenge => {
      const challengeLabels = {
        'stress_management': 'ストレス管理',
        'decision_making': '意思決定',
        'communication': 'コミュニケーション',
        'time_management': '時間管理',
        'conflict_resolution': '対立解決',
        'change_adaptation': '変化適応'
      };
      html += `<span class="context-tag challenge">${challengeLabels[challenge]}</span>`;
    });

    html += `
          </div>
        </div>
        
        <div class="contextual-recommendations">
          <h5>🎯 あなたの状況に特化した推奨事項</h5>
          <div class="recommendations-grid">
    `;

    // コンテキスト洞察を表示
    if (contextualAdjustment.contextualInsights) {
      contextualAdjustment.contextualInsights.forEach(insight => {
        html += `<div class="insight-card">${insight}</div>`;
      });
    }

    html += `
          </div>
        </div>
      </div>
    `;

    return html;
  }

  // エクスポートシステムを初期化
  async initializeExportSystems() {
    try {
      // PDFエクスポーターを初期化
      const { default: PDFExporter } = await import('../core/PDFExporter.js');
      this.pdfExporter = new PDFExporter({
        pageFormat: 'A4',
        includeCharts: true,
        watermark: 'HaQei Analyzer'
      });

      // 画像エクスポーターを初期化
      const { default: ImageExporter } = await import('../core/ImageExporter.js');
      this.imageExporter = new ImageExporter({
        format: 'png',
        quality: 0.9,
        includeWatermark: true
      });

      // 履歴マネージャーを初期化
      const { default: DiagnosisHistoryManager } = await import('../core/DiagnosisHistoryManager.js');
      this.historyManager = new DiagnosisHistoryManager({
        maxHistoryCount: 10,
        enableComparison: true,
        enableTrends: true
      });

      console.log("✅ Export systems initialized successfully");

    } catch (error) {
      console.error("❌ Failed to initialize export systems:", error);
    }
  }

  // アナリティクスを初期化
  async initializeAnalytics() {
    try {
      const { default: AnalyticsCollector } = await import('../core/AnalyticsCollector.js');
      this.analyticsCollector = new AnalyticsCollector({
        enableTracking: true,
        anonymizeData: true,
        enableLocalStorage: true
      });

      console.log("✅ Analytics initialized successfully");

    } catch (error) {
      console.error("❌ Failed to initialize analytics:", error);
    }
  }

  // 🔧 八卦記号取得ヘルパー
  getTrigramSymbol(trigramId) {
    const trigramSymbols = {
      1: '☰', // 乾
      2: '☱', // 兌
      3: '☲', // 離
      4: '☳', // 震
      5: '☴', // 巽
      6: '☵', // 坎
      7: '☶', // 艮
      8: '☷', // 坤
    };
    return trigramSymbols[trigramId] || '';
  }

  // 拡張モード用のOSカードレンダリング
  renderEnhancedOSCard(osData, type, title) {
    const hexagramName = osData.hexagramInfo ? osData.hexagramInfo.name : "分析不能";
    const hexagramId = osData.hexagramId || (osData.hexagramInfo ? osData.hexagramInfo.hexagram_id : null);

    let detailedInfo = {};
    if (window.HEXAGRAM_DETAILS && hexagramId) {
        detailedInfo = window.HEXAGRAM_DETAILS[hexagramId] || {};
    }

    let specificDetailsHtml = '';
    if (type === 'engine') {
        const engineDetails = detailedInfo.engine || {};
        specificDetailsHtml = `
            <div class="detail-section">
                <h5>核となる動機</h5>
                <p>${engineDetails.core_drive || '情報なし'}</p>
            </div>
            <div class="detail-section">
                <h5>強み</h5>
                <ul>
                    ${(engineDetails.potential_strengths || []).map(item => `<li>${item}</li>`).join('') || '<li>情報なし</li>'}
                </ul>
            </div>
            <div class="detail-section">
                <h5>弱み</h5>
                <ul>
                    ${(engineDetails.potential_weaknesses || []).map(item => `<li>${item}</li>`).join('') || '<li>情報なし</li>'}
                </ul>
            </div>
        `;
    } else if (type === 'interface') {
        const interfaceDetails = detailedInfo.interface || {};
        specificDetailsHtml = `
            <div class="detail-section">
                <h5>発揮場面</h5>
                <p>${interfaceDetails.how_it_appears || '情報なし'}</p>
            </div>
            <div class="detail-section">
                <h5>行動パターン例</h5>
                <ul>
                    ${(interfaceDetails.behavioral_patterns || []).map(item => `<li>${item}</li>`).join('') || '<li>情報なし</li>'}
                </ul>
            </div>
            <div class="detail-section">
                <h5>他者からの印象</h5>
                <p>${interfaceDetails.impression_on_others || '情報なし'}</p>
            </div>
        `;
    } else if (type === 'safemode') {
        const safeModeDetails = detailedInfo.safe_mode || {};
        specificDetailsHtml = `
            <div class="detail-section">
                <h5>発動状況</h5>
                <ul>
                    ${(safeModeDetails.trigger_situations || []).map(item => `<li>${item}</li>`).join('') || '<li>情報なし</li>'}
                </ul>
            </div>
            <div class="detail-section">
                <h5>防御パターン例</h5>
                <ul>
                    ${(safeModeDetails.defensive_patterns || []).map(item => `<li>${item}</li>`).join('') || '<li>情報なし</li>'}
                </ul>
            </div>
            <div class="detail-section">
                <h5>内面の思考・感情</h5>
                <p>${safeModeDetails.internal_state || '情報なし'}</p>
            </div>
        `;
    }

    let hexagramVisualHtml = '';
    if (osData.hexagramInfo && osData.hexagramInfo.upper_trigram_id && osData.hexagramInfo.lower_trigram_id) {
        const upperTrigramId = osData.hexagramInfo.upper_trigram_id;
        const lowerTrigramId = osData.hexagramInfo.lower_trigram_id;
        const upperTrigramName = this.getTrigramName(upperTrigramId);
        const lowerTrigramName = this.getTrigramName(lowerTrigramId);
        const upperTrigramSymbol = this.getTrigramSymbol(upperTrigramId);
        const lowerTrigramSymbol = this.getTrigramSymbol(lowerTrigramId);

        hexagramVisualHtml = `
            <div class="hexagram-visual-section">
                <div class="hexagram-symbol-large">${upperTrigramSymbol}<br>${lowerTrigramSymbol}</div>
                <div class="trigram-composition-text">
                    <p>上卦: ${upperTrigramName} (${upperTrigramSymbol})</p>
                    <p>下卦: ${lowerTrigramName} (${lowerTrigramSymbol})</p>
                </div>
            </div>
        `;
    }

    let engineStrengthMeterHtml = '';
    if (type === 'engine') {
        const strength = osData.activation || osData.score || osData.strength || 0; // Use activation as primary strength indicator
        engineStrengthMeterHtml = `
            <div class="engine-strength-meter">
                <h5>エンジン強度</h5>
                <div class="strength-bar-visual">
                    <div class="strength-fill-visual" style="width: ${strength * 100}%"></div>
                </div>
                <div class="strength-value-text">${Math.round(strength * 100)}%</div>
            </div>
        `;
    }

    return `
        <div class="os-detail-card os-detail-card-${type}">
            <h4>${title}: ${hexagramName}</h4>
            ${hexagramVisualHtml}
            <p class="catchphrase">「${detailedInfo.catchphrase || osData.hexagramInfo?.catchphrase || 'キャッチフレーズ不明'}」</p>
            ${engineStrengthMeterHtml}
            <div class="detail-section">
                <h5>説明</h5>
                <p>${detailedInfo.description || osData.hexagramInfo?.description || '詳細説明なし'}</p>
            </div>
            <div class="detail-section">
                <h5>キーワード</h5>
                <p>${(detailedInfo.keywords || []).join(', ') || 'キーワードなし'}</p>
            </div>
            ${specificDetailsHtml}
        </div>
    `;
  }

  // OSカードをレンダリング
  renderOSCard(osData, type, icon, title, description) {
    const hexagramName = osData.hexagramInfo ? osData.hexagramInfo.name : "分析不能";
    const hexagramReading = osData.hexagramInfo ? osData.hexagramInfo.reading : "";
    const strengthDisplay = this.getStrengthDisplay(osData, type);
    const cardClass = `os-card os-card-${type}`;

    return `
      <div class="${cardClass}">
        <div class="os-card-header">
          <div class="os-icon">${icon}</div>
          <div class="os-info">
            <h3 class="os-title">${title}</h3>
            <p class="os-description">${description}</p>
          </div>
        </div>
        
        <div class="os-card-content">
          <div class="hexagram-display">
            <div class="hexagram-name">${hexagramName}</div>
            <div class="hexagram-reading">${hexagramReading}</div>
          </div>
          
          ${strengthDisplay}
          
          <div class="os-details">
            ${this.renderOSDetails(osData, type)}
          </div>
        </div>
      </div>
    `;
  }

  // 強度表示を取得
  getStrengthDisplay(osData, type) {
    if (type === "engine") {
      const strength = osData.strength || 0;
      return `
        <div class="strength-display">
          <div class="strength-label">エンジン強度</div>
          <div class="strength-bar">
            <div class="strength-fill" style="width: ${strength * 100}%"></div>
          </div>
          <div class="strength-value">${Math.round(strength * 100)}%</div>
        </div>
      `;
    } else {
      const score = osData.matchScore || 0;
      return `
        <div class="match-score-display">
          <div class="match-label">マッチスコア</div>
          <div class="match-value">${Math.round(score)}%</div>
        </div>
      `;
    }
  }

  // OS詳細をレンダリング
  renderOSDetails(osData, type) {
    switch (type) {
      case "engine":
        return this.renderEngineDetails(osData);
      case "interface":
        return this.renderInterfaceDetails(osData);
      case "safemode":
        return this.renderSafeModeDetails(osData);
      default:
        return "";
    }
  }

  // エンジンOS詳細
  renderEngineDetails(engineOS) {
    // dominantTrigramsの防御的取得
    let topTrigrams = [];
    let errorMsg = "";
    if (
      !engineOS ||
      !engineOS.dominantTrigrams ||
      !Array.isArray(engineOS.dominantTrigrams)
    ) {
      errorMsg =
        '<div class="trigram-error" style="color:#ff6b6b">dominantTrigrams未生成エラー</div>';
      // フォールバック用ダミーデータ
      topTrigrams = [
        { id: 1, name: "乾", energy: 0 },
        { id: 2, name: "兌", energy: 0 },
        { id: 3, name: "離", energy: 0 },
      ];
    } else if (engineOS.dominantTrigrams.length === 0) {
      errorMsg =
        '<div class="trigram-error" style="color:#ff6b6b">dominantTrigrams空配列エラー</div>';
      topTrigrams = [
        { id: 1, name: "乾", energy: 0 },
        { id: 2, name: "兌", energy: 0 },
        { id: 3, name: "離", energy: 0 },
      ];
    } else {
      // 配列の各要素が有効なオブジェクトかチェック
      const validTrigrams = engineOS.dominantTrigrams.filter(
        (trigram) => trigram && typeof trigram === "object" && trigram.name
      );
      if (validTrigrams.length === 0) {
        errorMsg =
          '<div class="trigram-error" style="color:#ff6b6b">dominantTrigrams不正データエラー</div>';
        topTrigrams = [
          { id: 1, name: "乾", energy: 0 },
          { id: 2, name: "兌", energy: 0 },
          { id: 3, name: "離", energy: 0 },
        ];
      } else {
        topTrigrams = validTrigrams.slice(0, 3);
      }
    }

    return `
      <div class="engine-details">
        <h5>主要な八卦エネルギー</h5>
        ${errorMsg}
        <div class="trigram-composition">
          構成八卦: ${this.getTrigramComposition(engineOS)}
        </div>
        <div class="trigram-list">
          ${topTrigrams
            .map(
              (trigram, index) => `
            <div class="trigram-item">
              <span class="trigram-rank">${index + 1}位</span>
              <span class="trigram-name">${trigram.name}</span>
              <span class="trigram-energy">${
                trigram.energy !== undefined ? trigram.energy.toFixed(1) : "0.0"
              }</span>
            </div>
          `
            )
            .join("")}
        </div>
        <div class="vector-summary">
          <h6>8次元プロファイル</h6>
          <div class="dimension-chips">
            ${Object.entries(engineOS.userVector || {})
              .sort(([, a], [, b]) => b - a)
              .slice(0, 4)
              .map(
                ([key, value]) => `
                <span class="dimension-chip">
                  ${key.split("_")[1]}: ${value.toFixed(1)}
                </span>
              `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  // 🔧 trigramComposition安全取得メソッド
  getTrigramComposition(osData) {
    if (osData.trigramComposition) {
      return osData.trigramComposition;
    }
    if (osData.hexagramInfo) {
      const upperTrigram = this.getTrigramName(
        osData.hexagramInfo.upper_trigram_id
      );
      const lowerTrigram = this.getTrigramName(
        osData.hexagramInfo.lower_trigram_id
      );
      return `${upperTrigram} + ${lowerTrigram}`;
    }
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

  // インターフェースOS詳細
  renderInterfaceDetails(interfaceOS) {
    const matches = interfaceOS.keywordMatches || [];
    const summaryText = interfaceOS.hexagramInfo
      ? `<p>外面的な行動において、${interfaceOS.hexagramInfo.name}の特徴が強く現れています。</p>`
      : `<p>外面的な行動において、特定の強い傾向は検出されませんでした。</p>`;

    return `
      <div class="interface-details">
        <h5>外面行動パターン</h5>
        <div class="keyword-matches">
          ${matches
            .slice(0, 5)
            .map(
              (match) => `
            <span class="keyword-tag">${match}</span>
          `
            )
            .join("")}
        </div>
        
        <div class="choice-summary">
          <h6>選択傾向</h6>
          ${summaryText}
        </div>
      </div>
    `;
  }

  // セーフモードOS詳細
  renderSafeModeDetails(safeModeOS) {
    const matches = safeModeOS.lineMatches || [];
    const summaryText = safeModeOS.hexagramInfo && safeModeOS.hexagramInfo.name
      ? `<p>ストレスや困難な状況において、${safeModeOS.hexagramInfo.name}の防御機制が作動します。</p>`
      : `<p>分析不能。セーフモードOS情報が読み込めていません。データベースへの接続を確認してください。</p>`;

    return `
      <div class="safemode-details">
        <h5>内面防御機制</h5>
        <div class="line-matches">
          ${matches
            .slice(0, 5)
            .map(
              (match) => `
            <span class="line-tag">${match}</span>
          `
            )
            .join("")}
        </div>
        
        <div class="defense-summary">
          <h6>防御パターン</h6>
          ${summaryText}
        </div>
      </div>
    `;
  }

  // イベントバインド
  bindEvents() {
    const exploreBtn = this.container.querySelector("#explore-more-btn");
    const reportBtn = this.container.querySelector("#generate-report-btn");
    const pdfBtn = this.container.querySelector("#export-pdf-btn");
    const imageBtn = this.container.querySelector("#export-image-btn");
    const shareBtn = this.container.querySelector("#share-results-btn");
    const retakeBtn = this.container.querySelector("#retake-test-btn");
    const compatibilityBtn = this.container.querySelector("#show-compatibility-btn");

    if (exploreBtn) {
      exploreBtn.addEventListener("click", () => {
        if (this.options.onExploreMore) {
          this.options.onExploreMore(this.analysisResult);
        }
      });
    }

    if (reportBtn) {
      reportBtn.addEventListener("click", () => {
        if (this.options.onGenerateReport) {
          this.options.onGenerateReport(this.analysisResult);
        }
      });
    }

    if (pdfBtn) {
      pdfBtn.addEventListener("click", () => {
        this.handlePDFExport();
      });
    }

    if (imageBtn) {
      imageBtn.addEventListener("click", () => {
        this.handleImageExport();
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        this.handleShareResults();
      });
    }

    if (retakeBtn) {
      retakeBtn.addEventListener("click", () => {
        if (this.options.onRetakeTest) {
          this.options.onRetakeTest();
        }
      });
    }

    // 相性分析表示ボタン
    if (compatibilityBtn) {
      compatibilityBtn.addEventListener("click", () => {
        this.showCompatibilityAnalysis();
      });
    }

    // モーダル閉じる処理を設定
    this.setupModalEventListeners();

    // タブ切り替えイベント
    const tabBtns = this.container.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.switchCompatibilityTab(e.target.dataset.tab);
      });
    });
  }

  /**
   * 相性分析セクションの表示/非表示を切り替え
   */
  async toggleCompatibilityAnalysis() {
    const section = this.container.querySelector("#full-compatibility-analysis");
    const btn = this.container.querySelector("#show-compatibility-btn");
    
    if (!section) return;

    if (section.style.display === "none" || !section.style.display) {
      // 表示する
      section.style.display = "block";
      btn.textContent = "🔄 相性分析を隠す";
      
      // データを読み込み
      await this.loadCompatibilityData();
    } else {
      // 隠す
      section.style.display = "none";
      btn.textContent = "🎯 完全相性分析を見る";
    }
  }

  /**
   * 相性分析データを読み込み、表示する
   */
  async loadCompatibilityData() {
    if (!this.analysisResult) return;

    const { engineOS, interfaceOS, safeModeOS } = this.analysisResult;
    
    try {
      // エンジン-インターフェース相性を読み込み
      await this.loadEngineInterfaceAnalysis(engineOS.hexagramId, interfaceOS.hexagramId);
      
      // エンジン-セーフモード相性を読み込み  
      await this.loadEngineSafemodeAnalysis(engineOS.hexagramId, safeModeOS.hexagramId);
      
      // 総合分析を生成
      this.generateOverviewAnalysis();
      
    } catch (error) {
      console.error("❌ 相性分析データの読み込みに失敗:", error);
      this.showCompatibilityError(error.message);
    }
  }

  /**
   * エンジン-インターフェース相性分析を読み込み・表示
   */
  async loadEngineInterfaceAnalysis(engineOsId, interfaceOsId) {
    const container = this.container.querySelector("#tab-engine-interface");
    
    try {
      const data = await this.compatibilityDataLoader.loadInterfaceData(engineOsId);
      
      // 該当するInterface OSの組み合わせを探す
      const combination = data.internal_team_analysis.interface_combinations.find(
        c => c.interface_id === interfaceOsId
      );

      if (!combination) {
        throw new Error(`Interface combination not found for OS ${interfaceOsId}`);
      }

      // HTMLを生成
      const html = `
        <div class="compatibility-analysis">
          <h4>🤝 チーム相性分析: ${combination.interface_name}</h4>
          <div class="compatibility-summary">
            <div class="compatibility-type ${combination.type.toLowerCase()}">
              <span class="type-label">${combination.type}</span>
              <span class="score-label">${Math.round(combination.overall_score * 100)}%</span>
            </div>
            <p class="summary-text">${combination.summary}</p>
          </div>
          
          <div class="compatibility-details">
            <h5>📊 詳細評価</h5>
            <div class="evaluation-grid">
              ${Object.entries(combination.evaluation).map(([key, evaluation]) => `
                <div class="evaluation-item">
                  <div class="eval-header">
                    <span class="eval-name">${this.getEvaluationName(key)}</span>
                    <span class="eval-score">${Math.round(evaluation.score * 100)}%</span>
                  </div>
                  <p class="eval-desc">${evaluation.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="compatibility-advice">
            <div class="advice-section">
              <h5>💪 強み</h5>
              <ul>
                ${combination.advice.strengths.map(strength => `<li>${strength}</li>`).join('')}
              </ul>
            </div>
            <div class="advice-section">
              <h5>⚠️ 課題</h5>
              <ul>
                ${combination.advice.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
              </ul>
            </div>
            <div class="advice-section">
              <h5>💡 推奨事項</h5>
              <ul>
                ${combination.advice.recommendations.map(rec => `<li>${rec}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
      
      container.innerHTML = html;

    } catch (error) {
      console.error("❌ Interface analysis loading failed:", error);
      container.innerHTML = `
        <div class="error-message">
          <h4>🤝 チーム相性分析</h4>
          <p>分析データの読み込みに失敗しました: ${error.message}</p>
        </div>
      `;
    }
  }

  /**
   * エンジン-セーフモード相性分析を読み込み・表示
   */
  async loadEngineSafemodeAnalysis(engineOsId, safemodeOsId) {
    const container = this.container.querySelector("#tab-engine-safemode");
    
    try {
      // safemodeOsIdがnullの場合の処理
      if (safemodeOsId === null) {
        container.innerHTML = `
          <div class="safemode-null-analysis">
            <h4>⚠️ ストレス時行動パターン: 分析不能</h4>
            <div class="null-explanation">
              <p class="null-summary">
                内面的な防御機制が複雑なため、特定のパターンに分類できませんでした。
                これは、あなたが状況に応じて多様な対応ができる一方で、
                ストレス要因を特定しにくい側面も示唆しています。
              </p>
              
              <div class="null-advice">
                <h5>💡 代替的アプローチ</h5>
                <ul>
                  <li>ストレス反応が複雑で予測しにくいため、定期的な自己点検が重要</li>
                  <li>特定のパターンに依存せず、柔軟な対処法を複数準備する</li>
                  <li>ストレス初期段階での早めの対応を心がける</li>
                  <li>信頼できるサポート体制を構築しておく</li>
                </ul>
              </div>
              
              <div class="null-interpretation">
                <h5>🔍 この結果の意味</h5>
                <p>
                  セーフモードが特定できない場合、一般的に以下の特徴があります：
                </p>
                <ul>
                  <li>高い適応能力と状況判断力を持つ</li>
                  <li>ストレス反応が状況によって大きく変わる</li>
                  <li>内面の複雑さと豊かさを示している</li>
                  <li>予測可能なパターンに縛られない柔軟性がある</li>
                </ul>
              </div>
            </div>
          </div>
        `;
        return;
      }

      const data = await this.compatibilityDataLoader.loadSafemodeData(engineOsId);
      
      // 該当するSafeMode OSの組み合わせを探す
      const combination = data.internal_team_analysis.safemode_combinations.find(
        c => c.safemode_id === safemodeOsId
      );

      if (!combination) {
        throw new Error(`Safemode combination not found for OS ${safemodeOsId}`);
      }

      // HTMLを生成
      const html = `
        <div class="safemode-analysis">
          <h4>⚠️ ストレス時行動パターン: ${combination.safemode_name}</h4>
          <div class="safemode-summary">
            <div class="safemode-type ${combination.type.toLowerCase()}">
              <span class="type-label">${combination.type}</span>
              <span class="danger-label">危険度: ${Math.round(combination.overall_score * 100)}%</span>
            </div>
            <p class="summary-text">${combination.summary}</p>
          </div>
          
          <div class="safemode-details">
            <h5>📊 詳細評価</h5>
            <div class="evaluation-grid">
              ${Object.entries(combination.evaluation).map(([key, evaluation]) => `
                <div class="evaluation-item">
                  <div class="eval-header">
                    <span class="eval-name">${this.getSafemodeEvaluationName(key)}</span>
                    <span class="eval-score ${evaluation.score > 0.7 ? 'high' : evaluation.score > 0.4 ? 'medium' : 'low'}">${Math.round(evaluation.score * 100)}%</span>
                  </div>
                  <p class="eval-desc">${evaluation.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="safemode-advice">
            <div class="trigger-section">
              <h5>🚨 トリガー警告</h5>
              <p class="trigger-warning">${combination.advice.trigger_warning}</p>
            </div>
            <div class="symptoms-section">
              <h5>🔍 メルトダウン症状</h5>
              <p class="symptoms-text">${combination.advice.meltdown_symptoms}</p>
            </div>
            <div class="recovery-section">
              <h5>🛠️ 回復戦略</h5>
              <p class="recovery-text">${combination.advice.recovery_strategies}</p>
            </div>
          </div>
        </div>
      `;
      
      container.innerHTML = html;

    } catch (error) {
      console.error("❌ Safemode analysis loading failed:", error);
      container.innerHTML = `
        <div class="error-message">
          <h4>⚠️ ストレス時行動パターン</h4>
          <p>分析データの読み込みに失敗しました: ${error.message}</p>
        </div>
      `;
    }
  }

  /**
   * 総合分析を生成
   */
  generateOverviewAnalysis() {
    const container = this.container.querySelector("#tab-overview");
    const { engineOS, interfaceOS, safeModeOS, consistencyScore } = this.analysisResult;
    
    const html = `
      <div class="overview-analysis">
        <h4>🎯 総合相性分析</h4>
        
        <div class="overall-compatibility">
          <div class="consistency-overview">
            <h5>人格一貫性</h5>
            <div class="consistency-meter">
              <div class="meter-bar">
                <div class="meter-fill" style="width: ${Math.round(consistencyScore.overall * 100)}%"></div>
              </div>
              <span class="meter-value">${Math.round(consistencyScore.overall * 100)}%</span>
            </div>
            <p class="consistency-interpretation">
              ${this.getConsistencyInterpretation(consistencyScore.overall)}
            </p>
          </div>
          
          <div class="os-harmony">
            <h5>OS間調和度</h5>
            <div class="harmony-grid">
              <div class="harmony-item">
                <span class="harmony-label">エンジン ↔ インターフェース</span>
                <span class="harmony-score">${Math.round(consistencyScore.engineInterface * 100)}%</span>
              </div>
              <div class="harmony-item">
                <span class="harmony-label">エンジン ↔ セーフモード</span>
                <span class="harmony-score">${Math.round(consistencyScore.engineSafeMode * 100)}%</span>
              </div>
              <div class="harmony-item">
                <span class="harmony-label">インターフェース ↔ セーフモード</span>
                <span class="harmony-score">${Math.round(consistencyScore.interfaceSafeMode * 100)}%</span>
              </div>
            </div>
          </div>
          
          <div class="integration-insights">
            <h5>統合的洞察</h5>
            <div class="insights-content">
              ${this.generateIntegrationInsights()}
            </div>
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML = html;
  }

  /**
   * タブを切り替える
   */
  switchCompatibilityTab(tabId) {
    // タブボタンのアクティブ状態を更新
    this.container.querySelectorAll(".tab-btn").forEach(btn => {
      btn.classList.remove("active");
    });
    this.container.querySelector(`[data-tab="${tabId}"]`).classList.add("active");
    
    // タブコンテンツの表示を更新
    this.container.querySelectorAll(".tab-content").forEach(content => {
      content.classList.remove("active");
    });
    this.container.querySelector(`#tab-${tabId}`).classList.add("active");
  }

  /**
   * 評価項目名を取得
   */
  getEvaluationName(key) {
    const names = {
      functional_efficiency: "機能効率",
      growth_potential: "成長可能性", 
      stress_resilience: "ストレス耐性",
      creativity: "創造性",
      integration_challenge: "統合難易度"
    };
    return names[key] || key;
  }

  /**
   * セーフモード評価項目名を取得
   */
  getSafemodeEvaluationName(key) {
    const names = {
      crisis_resilience: "危機耐性",
      recovery_potential: "回復可能性",
      collateral_damage: "副次的被害",
      lesson_learned: "学習効果", 
      integration_difficulty: "統合難易度"
    };
    return names[key] || key;
  }

  /**
   * 一貫性スコアの解釈を取得
   */
  getConsistencyInterpretation(score) {
    if (score >= 0.8) {
      return "非常に高い一貫性を持っています。内面と外面、平時とストレス時の行動に大きな矛盾がなく、安定した人格構造を示しています。";
    } else if (score >= 0.6) {
      return "適度な一貫性を保っています。時と場合に応じて柔軟に対応しつつ、根本的な価値観は一貫している状態です。";
    } else if (score >= 0.4) {
      return "やや一貫性に欠ける面があります。状況によって行動パターンが変わりやすく、内面の複雑さが表れています。";
    } else {
      return "一貫性が低く、多面的で複雑な人格構造を持っています。これは豊かな内面性の表れでもありますが、自己理解を深める余地があります。";
    }
  }

  /**
   * 統合的洞察を生成
   */
  generateIntegrationInsights() {
    const { engineOS, interfaceOS, safeModeOS } = this.analysisResult;
    
    const insights = [
      `あなたの核となる価値観（${engineOS.osName}）が、`,
      `外面的な行動（${interfaceOS.hexagramInfo?.name || '未特定'}）として現れ、`,
      `ストレス時には${safeModeOS.hexagramId ? safeModeOS.hexagramInfo?.name || '特定の防御機制' : '複雑な防御機制'}が作動します。`
    ].join('');
    
    return `
      <p class="primary-insight">${insights}</p>
      <div class="insight-recommendations">
        <h6>💡 統合的な成長のために</h6>
        <ul>
          <li>各OSの特性を理解し、状況に応じて意識的に切り替える</li>
          <li>ストレス時の反応パターンを事前に把握し、対策を準備する</li>
          <li>内面と外面のギャップを埋めるための具体的な行動計画を立てる</li>
        </ul>
      </div>
    `;
  }

  /**
   * 相性分析エラーを表示
   */
  showCompatibilityError(message) {
    const section = this.container.querySelector("#full-compatibility-analysis");
    if (section) {
      section.innerHTML = `
        <div class="compatibility-error">
          <h3>❌ 相性分析エラー</h3>
          <p>相性分析データの読み込み中にエラーが発生しました。</p>
          <p class="error-detail">${message}</p>
          <button class="retry-btn" onclick="this.closest('.triple-os-results-container').querySelector('#show-compatibility-btn').click()">
            🔄 再試行
          </button>
        </div>
      `;
    }
  }

  // 結果共有を処理
  async handleShareResults() {
    if (!this.shareManager || !this.analysisResult) {
      this.showShareMessage('共有機能の初期化中にエラーが発生しました。', 'error');
      return;
    }

    try {
      // 共有ボタンを無効化
      const shareBtn = this.container.querySelector("#share-results-btn");
      if (shareBtn) {
        shareBtn.disabled = true;
        shareBtn.textContent = '🔗 生成中...';
      }

      // 共有URLを生成
      const shareResult = this.shareManager.generateShareableURL(this.analysisResult, {
        title: '3層人格OS診断結果',
        description: 'HaQei Analyzerによる詳細診断結果',
        category: 'personality_analysis'
      });

      if (shareResult.success) {
        this.showShareDialog(shareResult);
      } else {
        this.showShareMessage(`共有URLの生成に失敗しました: ${shareResult.message}`, 'error');
      }

    } catch (error) {
      console.error('Share error:', error);
      this.showShareMessage('共有処理中にエラーが発生しました。', 'error');
    } finally {
      // 共有ボタンを有効化
      const shareBtn = this.container.querySelector("#share-results-btn");
      if (shareBtn) {
        shareBtn.disabled = false;
        shareBtn.textContent = '🔗 結果を共有';
      }
    }
  }

  // 共有ダイアログを表示
  showShareDialog(shareResult) {
    const dialogHtml = `
      <div class="share-dialog-overlay">
        <div class="share-dialog">
          <div class="share-dialog-header">
            <h3>📤 診断結果の共有</h3>
            <button class="share-dialog-close">&times;</button>
          </div>
          <div class="share-dialog-content">
            <p class="share-success-message">
              ✅ 共有URLが正常に生成されました！
            </p>
            <div class="share-url-section">
              <label for="share-url-input">共有URL:</label>
              <div class="share-url-container">
                <input 
                  type="text" 
                  id="share-url-input" 
                  value="${shareResult.shareURL}" 
                  readonly
                  class="share-url-input"
                />
                <button id="copy-url-btn" class="btn btn-primary copy-btn">
                  📋 コピー
                </button>
              </div>
            </div>
            <div class="share-info">
              <div class="share-info-item">
                <span class="info-label">有効期限:</span>
                <span class="info-value">${shareResult.expiresAt.toLocaleDateString('ja-JP')} まで</span>
              </div>
              <div class="share-info-item">
                <span class="info-label">共有ID:</span>
                <span class="info-value">${shareResult.shareId}</span>
              </div>
            </div>
            <div class="share-notice">
              <p>⚠️ <strong>プライバシーについて:</strong></p>
              <ul>
                <li>個人を特定できる情報は共有URLには含まれません</li>
                <li>データはお使いのブラウザにのみ保存され、サーバーには送信されません</li>
                <li>30日間の有効期限後は自動的に削除されます</li>
              </ul>
            </div>
          </div>
          <div class="share-dialog-actions">
            <button id="share-close-btn" class="btn btn-secondary">閉じる</button>
          </div>
        </div>
      </div>
    `;

    // ダイアログをページに追加
    const dialogElement = document.createElement('div');
    dialogElement.innerHTML = dialogHtml;
    document.body.appendChild(dialogElement);

    // イベントリスナーを設定
    this.bindShareDialogEvents(dialogElement, shareResult.shareURL);
  }

  // 共有ダイアログのイベントを設定
  bindShareDialogEvents(dialogElement, shareURL) {
    const overlay = dialogElement.querySelector('.share-dialog-overlay');
    const closeBtn = dialogElement.querySelector('.share-dialog-close');
    const closeActionBtn = dialogElement.querySelector('#share-close-btn');
    const copyBtn = dialogElement.querySelector('#copy-url-btn');
    const urlInput = dialogElement.querySelector('#share-url-input');

    // ダイアログを閉じる
    const closeDialog = () => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        if (dialogElement.parentNode) {
          dialogElement.parentNode.removeChild(dialogElement);
        }
      }, 300);
    };

    // イベントリスナー
    closeBtn.addEventListener('click', closeDialog);
    closeActionBtn.addEventListener('click', closeDialog);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDialog();
    });

    // URLをコピー
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(shareURL);
        copyBtn.textContent = '✅ コピー済み';
        copyBtn.style.background = 'var(--synergy-color)';
        
        setTimeout(() => {
          copyBtn.textContent = '📋 コピー';
          copyBtn.style.background = '';
        }, 2000);
        
        this.showShareMessage('共有URLをクリップボードにコピーしました。', 'success');
      } catch (error) {
        // フォールバック: 手動選択
        urlInput.select();
        urlInput.setSelectionRange(0, 99999);
        this.showShareMessage('URLを手動でコピーしてください。', 'warning');
      }
    });

    // ESCキーで閉じる
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeDialog();
        document.removeEventListener('keydown', escHandler);
      }
    });

    // フェードイン
    setTimeout(() => {
      overlay.style.opacity = '1';
    }, 10);
  }

  // 共有メッセージを表示
  showShareMessage(message, type = 'info') {
    const messageElement = document.createElement('div');
    messageElement.className = `share-message ${type}`;
    messageElement.textContent = message;
    
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
      messageElement.classList.add('visible');
    }, 10);

    setTimeout(() => {
      messageElement.classList.remove('visible');
      setTimeout(() => {
        if (messageElement.parentNode) {
          messageElement.parentNode.removeChild(messageElement);
        }
      }, 300);
    }, 4000);
  }

  // PDF出力を処理
  async handlePDFExport() {
    if (!this.pdfExporter || !this.analysisResult) {
      this.showMessage('PDF出力機能の初期化中にエラーが発生しました。', 'error');
      return;
    }

    try {
      // ボタンを無効化
      const pdfBtn = this.container.querySelector("#export-pdf-btn");
      if (pdfBtn) {
        pdfBtn.disabled = true;
        pdfBtn.textContent = '📄 生成中...';
      }

      // 追加データを収集
      const additionalData = {};
      if (this.advancedCompatibilityEngine) {
        additionalData.advancedCompatibility = await this.advancedCompatibilityEngine.analyzeInternalTeamComposition(
          this.analysisResult.engineOS.hexagramId,
          this.analysisResult.interfaceOS.hexagramId,
          this.analysisResult.safeModeOS.hexagramId
        );
      }

      // PDF生成・保存
      const result = await this.pdfExporter.savePDF(this.analysisResult, additionalData);

      if (result.success) {
        this.showMessage(`PDF が正常に保存されました: ${result.filename}`, 'success');
        
        // アナリティクス追跡
        if (this.analyticsCollector) {
          this.analyticsCollector.trackUserAction('pdf_export', 'export_button', {
            filename: result.filename
          });
        }
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      console.error('PDF export error:', error);
      this.showMessage('PDF出力中にエラーが発生しました。', 'error');
      
      // フォールバック: テキスト保存
      try {
        const fallbackResult = await this.pdfExporter.fallbackSave(this.analysisResult);
        if (fallbackResult.success) {
          this.showMessage(`テキスト形式で保存されました: ${fallbackResult.filename}`, 'warning');
        }
      } catch (fallbackError) {
        console.error('Fallback save failed:', fallbackError);
      }
      
    } finally {
      // ボタンを有効化
      const pdfBtn = this.container.querySelector("#export-pdf-btn");
      if (pdfBtn) {
        pdfBtn.disabled = false;
        pdfBtn.textContent = '📄 PDF出力';
      }
    }
  }

  // 画像出力を処理
  async handleImageExport() {
    if (!this.imageExporter) {
      this.showMessage('画像出力機能の初期化中にエラーが発生しました。', 'error');
      return;
    }

    try {
      // ボタンを無効化
      const imageBtn = this.container.querySelector("#export-image-btn");
      if (imageBtn) {
        imageBtn.disabled = true;
        imageBtn.textContent = '🖼️ 生成中...';
      }

      // 結果コンテナ全体をキャプチャ
      const result = await this.imageExporter.downloadImage(
        this.container.querySelector('.triple-os-results-container'),
        null,
        { 
          backgroundColor: '#ffffff',
          scale: 2 
        }
      );

      if (result.success) {
        this.showMessage(`画像が正常に保存されました: ${result.filename}`, 'success');
        
        // アナリティクス追跡
        if (this.analyticsCollector) {
          this.analyticsCollector.trackUserAction('image_export', 'export_button', {
            filename: result.filename,
            width: result.width,
            height: result.height
          });
        }
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      console.error('Image export error:', error);
      this.showMessage('画像出力中にエラーが発生しました。', 'error');
      
    } finally {
      // ボタンを有効化
      const imageBtn = this.container.querySelector("#export-image-btn");
      if (imageBtn) {
        imageBtn.disabled = false;
        imageBtn.textContent = '🖼️ 画像保存';
      }
    }
  }

  // アニメーション開始
  startAnimations() {
    if (!this.options.showAnimation) return;

    // 一貫性スコアのアニメーション
    setTimeout(() => {
      this.animateConsistencyScore();
    }, 1000);

    // OSカードのアニメーション
    setTimeout(() => {
      this.animateOSCards();
    }, 1500);
  }

  // 一貫性スコアアニメーション
  animateConsistencyScore() {
    const scoreCircle = this.container.querySelector(".score-circle");
    const scoreFills = this.container.querySelectorAll(".score-fill");

    if (scoreCircle) {
      scoreCircle.classList.add("animate-pulse");
    }

    scoreFills.forEach((fill, index) => {
      setTimeout(() => {
        fill.style.transition = "width 1s ease-out";
        fill.style.width = fill.style.width; // トリガー
      }, index * 200);
    });
  }

  // OSカードアニメーション
  animateOSCards() {
    const cards = this.container.querySelectorAll(".os-card");

    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("animate-scale-in");
      }, index * 300);
    });
  }

  // 表示
  show() {
    super.show();
    this.render();
  }

  // 非表示
  hide() {
    return super.hide();
  }

  // HaQei診断テキスト生成（詳細フォーマット対応）
  generateTripleOSText(participant, result, format) {
    console.log("📝 generateTripleOSText開始:", {
      participant: participant.name,
      format,
      resultStructure: result ? Object.keys(result) : "none",
    });

    if (format === "detailed") {
      // 【修正1】データ参照の一貫性を確保
      const engineOS = result.engineOS;
      const interfaceOS = result.interfaceOS;
      const safeModeOS = result.safeModeOS;

      // 各OSのデータが正しく存在するかチェック
      if (
        !engineOS?.hexagramInfo ||
        !interfaceOS?.hexagramInfo ||
        !safeModeOS?.hexagramInfo
      ) {
        console.error("❌ OSデータが不完全です", {
          engineOS: !!engineOS?.hexagramInfo,
          interfaceOS: !!interfaceOS?.hexagramInfo,
          safeModeOS: !!safeModeOS?.hexagramInfo,
        });
        return this.generateErrorResult(participant);
      }

      // 【修正2】各OSの詳細情報を安全に取得
      const engineOSDetails = this.getOSDetails(engineOS, "engine");
      const interfaceOSDetails = this.getOSDetails(interfaceOS, "interface");
      const safeModeOSDetails = this.getOSDetails(safeModeOS, "safemode");

      // 【修正3】統合洞察を生成
      const integration = this.generateIntegratedInsights(
        engineOS,
        interfaceOS,
        safeModeOS,
        result.consistencyScore
      );

      return `
🎯 ${participant.name}様の HaQei 人格OS診断結果

═══════════════════════════════════════════
【あなたの3層人格OS】
═══════════════════════════════════════════

🔧 **エンジンOS（根源的な力）**
【${engineOSDetails.name}】
💥 「${engineOSDetails.catchphrase}」

🎯 **人格の核心**
${engineOSDetails.coreDescription}

🔧 **戦略的役割**
${engineOSDetails.strategicRole}

🚀 **このOSを攻めに使うと？**
${engineOSDetails.offensiveStrategy}

🛡️ **このOSが守りに入ると？**
${engineOSDetails.defensivePattern}

🔧 **暴走時のデバッグ方法**
⚠️ 症状: ${engineOSDetails.symptom}
💊 対処法: ${engineOSDetails.solution}

🎯 **今週のクエスト**
${engineOSDetails.weeklyQuests}

─────────────────────────────

🖥️ **インターフェースOS（表の顔）**
【${interfaceOSDetails.name}】
「${interfaceOSDetails.catchphrase}」

${interfaceOSDetails.description}

─────────────────────────────

🛡️ **セーフモードOS（内なる顔）**
【${safeModeOSDetails.name}】
「${safeModeOSDetails.catchphrase}」

${safeModeOSDetails.description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【人格一貫性スコア】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${Math.round((result.consistencyScore?.overall || 0) * 100)}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【統合洞察＆アクションプラン】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧠 **あなたの人格構造の全体像**
${integration.overallStructure}

⚡ **エネルギーの流れと相互作用**
${integration.energyFlow}

🎯 **人格の一貫性と成長のヒント**
${integration.growthHints}

🌟 **今月のパーソナル・クエスト**
${integration.personalQuests}

💡 **基本的な心構え**
${integration.basicMindset}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ **診断完了日時**: ${new Date().toLocaleString("ja-JP")}
🎯 **HaQei Analyzer v1.0**

この診断結果はいかがでしたか？
ぜひあなたの率直なフィードバックをお聞かせください 🙏
      `.trim();
    }

    // 他のフォーマット（summary, data）の処理...
    return this.generateSummaryFormat(participant, result);
  }

  // 【新規追加】OSの詳細情報を安全に取得するメソッド
  getOSDetails(osData, osType) {
    try {
      const hexagramInfo = osData.hexagramInfo;
      if (!hexagramInfo) {
        throw new Error(`${osType} OSのhexagramInfoが見つかりません`);
      }

      // 基本情報の取得
      const name = hexagramInfo.name || hexagramInfo.name_jp || "名称不明";
      const catchphrase = hexagramInfo.catchphrase || "特徴を分析中...";

      // 【重要】同じ卦IDから一貫してデータを取得
      const hexagramId = osData.hexagramId || hexagramInfo.hexagram_id;
      const detailedInfo = this.getDetailedHexagramInfo(hexagramId);

      return {
        name: name,
        catchphrase: catchphrase,
        coreDescription: detailedInfo.coreDescription,
        strategicRole: detailedInfo.strategicRole,
        offensiveStrategy: detailedInfo.offensiveStrategy,
        defensivePattern: detailedInfo.defensivePattern,
        symptom: detailedInfo.symptom,
        solution: detailedInfo.solution,
        weeklyQuests: detailedInfo.weeklyQuests,
        description: detailedInfo.description,
      };
    } catch (error) {
      console.error(`❌ ${osType} OSの詳細取得エラー:`, error);
      return this.getFallbackOSDetails();
    }
  }

  // 【新規追加】詳細な64卦情報を取得（データの一貫性を保証）
  getDetailedHexagramInfo(hexagramId) {
    // ここで実際の64卦データベースから詳細情報を取得
    // 現在は仮のデータを返す
    const hexagramDetails = {
      1: {
        // 乾為天
        coreDescription:
          "あなたの心の奥底には、天空を駆ける龍のような、創造と革新への強烈な衝動が宿っています。",
        strategicRole:
          "• 新しいプロジェクトの立ち上げリーダー\n• 革新的なアイデアの提案者\n• 組織変革の推進者",
        offensiveStrategy:
          "あなたの創造的エネルギーを、新しい価値を生み出す『イノベーションエンジン』として活用しましょう。",
        defensivePattern:
          "プライドが高くなりすぎて、他者の意見を聞き入れなくなる『独裁者モード』。",
        symptom: "周囲の意見を聞かず、自分の考えだけで突き進んでしまう。",
        solution:
          "定期的に信頼できる人から率直なフィードバックを求め、謙虚さを保つよう心がけましょう。",
        weeklyQuests:
          "1. 今週は必ず3人以上の人に意見を求めてから決断する\n2. 自分のアイデアに対する反対意見を積極的に聞く時間を作る",
        description: "天の龍のような創造的エネルギーに満ちた存在です。",
      },
      50: {
        // 火風鼎
        coreDescription:
          "あなたは、革命の後の混乱を収め、新たな文化や秩序を安定させる、三本足の鼎（かなえ）のような存在です。",
        strategicRole:
          "• 組織の安定化リーダー\n• 新しい文化の創造者\n• 多様性を活かすマネージャー",
        offensiveStrategy:
          "あなたの『まとめる力』を、多様な才能を統合して新しい価値を生み出す『シナジー創造エンジン』として活用しましょう。",
        defensivePattern:
          "完璧を求めすぎて、決断が遅くなる『優柔不断モード』。",
        symptom:
          "あらゆる意見を取り入れようとして、結果的に方向性が定まらなくなる。",
        solution:
          "『80点で前に進む』勇気を持ち、完璧を目指すより実行を重視しましょう。",
        weeklyQuests:
          "1. 今週は『これで十分』と言える基準を事前に決めて行動する\n2. チームメンバーの得意分野を活かした役割分担を明確にする",
        description: "新たな安定を築き上げる、懐の深いまとめ役です。",
      },
      // 他の64卦のデータも同様に定義...
    };

    return hexagramDetails[hexagramId] || this.getFallbackHexagramDetails();
  }

  // 【新規追加】統合洞察を生成
  generateIntegratedInsights(
    engineOS,
    interfaceOS,
    safeModeOS,
    consistencyScore
  ) {
    const overallScore = (consistencyScore?.overall || 0) * 100;

    return {
      overallStructure: `あなたは「${engineOS.hexagramInfo.name}」を核として、「${interfaceOS.hexagramInfo.name}」で世界と関わり、「${safeModeOS.hexagramInfo.name}」で自分を守る多層構造を持っています。`,

      energyFlow: this.analyzeEnergyFlow(engineOS, interfaceOS, safeModeOS),

      growthHints:
        overallScore >= 70
          ? "あなたの3つのOSは高い一貫性を示しており、内面と外面が調和した安定した人格構造です。この一貫性を活かし、自分らしさを大切にしながら成長を続けてください。"
          : "あなたの3つのOSには多様性があり、複雑で多面的な人格の特徴を示しています。この複雑さを理解し、場面に応じて適切なOSを使い分けることで、大きな可能性が開花します。",

      personalQuests: this.generatePersonalQuests(
        engineOS,
        interfaceOS,
        safeModeOS
      ),

      basicMindset: `• 自分の3つのOSの特性を理解し、それぞれの強みを活かす\n• 内面と外面のバランスを意識し、無理をしすぎない\n• 困った時は、自分の『セーフモードOS』を活用する\n• 一貫性スコア${Math.round(
        overallScore
      )}%を参考に、自分の複雑さを受け入れる`,
    };
  }

  // エネルギーフローを分析
  analyzeEnergyFlow(engineOS, interfaceOS, safeModeOS) {
    // 五行の相性などを考慮した分析ロジック
    return `エンジンOS「${engineOS.hexagramInfo.name}」の内なるエネルギーが、インターフェースOS「${interfaceOS.hexagramInfo.name}」を通じて外部に表現され、困難な時にはセーフモードOS「${safeModeOS.hexagramInfo.name}」が働いて自分を守ります。`;
  }

  // パーソナルクエストを生成
  generatePersonalQuests(engineOS, interfaceOS, safeModeOS) {
    return `以下から興味のあるものを選んで取り組んでみてください：

1. エンジンOS「${engineOS.hexagramInfo.name}」の特性を活かした新しい挑戦を始める
2. インターフェースOS「${interfaceOS.hexagramInfo.name}」の特徴を意識した人間関係の構築
3. セーフモードOS「${safeModeOS.hexagramInfo.name}」を理解し、ストレス対処法を見直す
4. 3つのOSのバランスを保つための日々の習慣を作る`;
  }

  // エラー時のフォールバック
  generateErrorResult(participant) {
    return `
🎯 ${participant.name}様の診断結果

申し訳ございません。診断データの処理中にエラーが発生いたしました。
システムを確認いたしますので、少々お待ちください。

診断エンジンの状態を確認し、改めて結果をお送りいたします。
    `.trim();
  }

  // フォールバックOSDetails
  getFallbackOSDetails() {
    return {
      name: "データ取得エラー",
      catchphrase: "詳細情報を取得中...",
      coreDescription:
        "申し訳ございません。データの取得中にエラーが発生しました。",
      strategicRole: "• システムを確認中です",
      offensiveStrategy: "データを再取得しています。",
      defensivePattern: "エラーが発生しています。",
      symptom: "データ不整合",
      solution: "システム管理者にご連絡ください。",
      weeklyQuests: "データ修復をお待ちください。",
      description: "データ取得エラーが発生しています。",
    };
  }

  // フォールバック64卦詳細
  getFallbackHexagramDetails() {
    return {
      coreDescription: "詳細情報を取得中です。",
      strategicRole: "• データを確認中",
      offensiveStrategy: "情報を取得しています。",
      defensivePattern: "データ確認中。",
      symptom: "情報取得中",
      solution: "少々お待ちください。",
      weeklyQuests: "データ取得をお待ちください。",
      description: "詳細情報を準備中です。",
    };
  }

  // イベントバインディング（完全実装）
  bindEvents() {
    // 完全相性分析ボタンのイベント - 修正版
    const showCompatibilityBtn = document.getElementById('show-compatibility-btn');
    if (showCompatibilityBtn) {
      showCompatibilityBtn.addEventListener('click', () => {
        console.log("🖱️ [bindEvents] 詳細分析ボタンがクリックされました。");
        this.showCompatibilityAnalysis(); // toggleではなくshowに統一
      });
    }
    
    // タブ切り替えイベント
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.switchCompatibilityTab(e.target.dataset.tab);
      });
    });
  }

  // 完全相性分析表示の切り替え
  async toggleFullCompatibilityAnalysis() {
    const analysisSection = document.getElementById('full-compatibility-analysis');
    const button = document.getElementById('show-compatibility-btn');
    
    if (!analysisSection) return;
    
    if (analysisSection.style.display === 'none') {
      // 表示する
      analysisSection.style.display = 'block';
      button.textContent = '🎯 完全相性分析を隠す';
      
      // 全ての相性データを読み込んで表示
      await this.loadFullCompatibilityAnalysis();
    } else {
      // 非表示にする
      analysisSection.style.display = 'none';
      button.textContent = '🎯 完全相性分析を見る';
    }
  }

  // タブ切り替え処理
  switchCompatibilityTab(tabName) {
    // 全てのタブボタンとコンテンツを非アクティブにする
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // 選択されたタブをアクティブにする
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    // 必要に応じてデータを読み込む
    if (tabName === 'overview') {
      this.renderOverviewAnalysis();
    }
  }

  // 完全相性分析の読み込み
  async loadFullCompatibilityAnalysis() {
    // 既にデータがあれば再取得しない
    if (this.compatibilityAnalysisData) return;

    if (!this.analysisResult) return;
    
    try {
      // 2. CompatibilityDataLoader.jsに定義された正しいメソッド名を呼び出す
      const { engineOS, interfaceOS, safeModeOS } = this.analysisResult;

      const [interfaceData, safemodeData] = await Promise.all([
        this.compatibilityLoader.loadInterfaceData(engineOS.hexagramId),
        this.compatibilityLoader.loadSafemodeData(engineOS.hexagramId)
      ]);

      // 標準化されたデータ構造で、クラスのプロパティに結果を保存
      this.compatibilityAnalysisData = {
        interfaceData: interfaceData,
        safemodeData: safemodeData
      };
      
      // 各タブにデータを表示（旧来の関数も保持）
      this.renderEngineInterfaceAnalysis(interfaceData);
      this.renderEngineSafeModeAnalysis(safemodeData);
      
    } catch (error) {
      console.error('完全相性分析読み込みエラー:', error);
      this.showAnalysisError(error);
    }
  }

  // Engine-Interface分析の表示
  renderEngineInterfaceAnalysis(data) {
    const contentDiv = document.getElementById('tab-engine-interface');
    if (!contentDiv || !data) return;
    
    // --- ▼ここから追加（ガード節）▼ ---
    if (!data.internal_team_analysis || !Array.isArray(data.internal_team_analysis.interface_combinations)) {
      console.error('チーム相性分析のデータ構造が不正です:', data);
      if (contentDiv) {
        contentDiv.innerHTML = '<div class="analysis-card"><h4>🤝 チーム相性分析</h4><p class="error-text">分析データの構造が不正で表示できません。</p></div>';
      }
      return;
    }
    // --- ▲ここまで追加▲ ---
    
    const interfaceData = data.internal_team_analysis.interface_combinations.find(
      combo => combo.interface_id === this.analysisResult.interfaceOS.hexagramId
    );
    
    if (!interfaceData) {
      contentDiv.innerHTML = '<p>該当する詳細データが見つかりませんでした。</p>';
      return;
    }
    
    contentDiv.innerHTML = this.generateCompatibilityHTML(
      data.engine_os_name, 
      interfaceData.interface_name, 
      interfaceData,
      'エンジンOSとインターフェースOSの相性分析'
    );
  }

  // Engine-SafeMode分析の表示
  renderEngineSafeModeAnalysis(data) {
    const contentDiv = document.getElementById('tab-engine-safemode');
    if (!contentDiv || !data) return;
    
    // --- ▼ここから追加（ガード節）▼ ---
    if (!data.internal_team_analysis || !Array.isArray(data.internal_team_analysis.safemode_combinations)) {
      console.error('セーフモード相性分析のデータ構造が不正です:', data);
      if (contentDiv) {
        contentDiv.innerHTML = '<div class="analysis-card"><h4>🛡️ セーフモード相性分析</h4><p class="error-text">分析データの構造が不正で表示できません。</p></div>';
      }
      return;
    }
    // --- ▲ここまで追加▲ ---
    
    const safeModeData = data.internal_team_analysis.safemode_combinations.find(
      combo => combo.safemode_id === this.analysisResult.safeModeOS.hexagramId
    );
    
    if (!safeModeData) {
      contentDiv.innerHTML = '<p>該当する詳細データが見つかりませんでした。</p>';
      return;
    }
    
    contentDiv.innerHTML = this.generateCompatibilityHTML(
      data.engine_os_name, 
      safeModeData.safemode_name, 
      safeModeData,
      'エンジンOSとセーフモードOSの相性分析'
    );
  }

  // 相性分析HTMLの生成（共通）
  generateCompatibilityHTML(os1Name, os2Name, compatibilityData, title) {
    return `
      <div class="compatibility-detail">
        <div class="compatibility-header">
          <h4>${title}</h4>
          <h5>${os1Name} × ${os2Name}</h5>
          <div class="compatibility-type ${compatibilityData.type.toLowerCase()}">${compatibilityData.type}</div>
          <div class="overall-score">総合スコア: ${Math.round(compatibilityData.overall_score * 100)}%</div>
        </div>
        
        <div class="compatibility-summary">
          <p>${compatibilityData.summary}</p>
        </div>
        
        <div class="evaluation-scores">
          <h5>📊 評価項目</h5>
          <div class="score-grid">
            <div class="score-item">
              <span class="score-label">機能効率性</span>
              <span class="score-value">${Math.round(compatibilityData.evaluation.functional_efficiency.score * 100)}%</span>
              <p class="score-desc">${compatibilityData.evaluation.functional_efficiency.description}</p>
            </div>
            <div class="score-item">
              <span class="score-label">成長ポテンシャル</span>
              <span class="score-value">${Math.round(compatibilityData.evaluation.growth_potential.score * 100)}%</span>
              <p class="score-desc">${compatibilityData.evaluation.growth_potential.description}</p>
            </div>
            <div class="score-item">
              <span class="score-label">ストレス耐性</span>
              <span class="score-value">${Math.round(compatibilityData.evaluation.stress_resilience.score * 100)}%</span>
              <p class="score-desc">${compatibilityData.evaluation.stress_resilience.description}</p>
            </div>
            <div class="score-item">
              <span class="score-label">創造性</span>
              <span class="score-value">${Math.round(compatibilityData.evaluation.creativity.score * 100)}%</span>
              <p class="score-desc">${compatibilityData.evaluation.creativity.description}</p>
            </div>
            <div class="score-item">
              <span class="score-label">統合困難度</span>
              <span class="score-value">${Math.round(compatibilityData.evaluation.integration_challenge.score * 100)}%</span>
              <p class="score-desc">${compatibilityData.evaluation.integration_challenge.description}</p>
            </div>
          </div>
        </div>
        
        <div class="advice-section">
          <div class="strengths">
            <h5>✨ 強み</h5>
            <ul>
              ${compatibilityData.advice.strengths.map(strength => `<li>${strength}</li>`).join('')}
            </ul>
          </div>
          
          <div class="challenges">
            <h5>⚠️ 課題</h5>
            <ul>
              ${compatibilityData.advice.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
            </ul>
          </div>
          
          <div class="recommendations">
            <h5>💡 推奨事項</h5>
            <ul>
              ${compatibilityData.advice.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  // 総合分析の準備
  prepareOverviewAnalysis(engineInterfaceData, engineSafeModeData) {
    // 後で総合分析が要求された時に使用するデータを保存
    this.fullCompatibilityData = {
      engineInterface: engineInterfaceData,
      engineSafeMode: engineSafeModeData
    };
  }

  // 総合分析の表示
  renderOverviewAnalysis() {
    const contentDiv = document.getElementById('tab-overview');
    if (!contentDiv) return;
    
    const data = this.compatibilityAnalysisData; // クラスのプロパティからデータを取得

    // 標準化されたデータ構造をチェックするガード節
    if (!data || !data.interfaceData || !data.interfaceData.internal_team_analysis) {
      console.error('総合分析データの内部構造が不正です:', data);
      if (contentDiv) {
        contentDiv.innerHTML = '<div class="analysis-card"><h4>📊 総合分析</h4><p class="error-text">総合分析データの内部構造が不正です。</p></div>';
      }
      return;
    }

    // 標準化されたキー名でデータにアクセスする
    const interfaceCombinations = data.interfaceData.internal_team_analysis.interface_combinations;
    const safemodeAnalysis = data.safemodeData;

    // さらに詳細なデータ構造チェック
    if (!Array.isArray(interfaceCombinations)) {
      console.error('interface_combinations が配列ではありません:', interfaceCombinations);
      contentDiv.innerHTML = '<div class="analysis-card"><h4>📊 総合分析</h4><p class="error-text">分析データの形式が不正です。</p></div>';
      return;
    }
    
    // Engine-Interface のデータ
    const eiData = interfaceCombinations.find(
      combo => combo.interface_id === this.analysisResult.interfaceOS.hexagramId
    );
    
    // Engine-SafeMode のデータ  
    let esData = null;
    if (safemodeAnalysis && safemodeAnalysis.internal_team_analysis && 
        Array.isArray(safemodeAnalysis.internal_team_analysis.safemode_combinations)) {
      esData = safemodeAnalysis.internal_team_analysis.safemode_combinations.find(
        combo => combo.safemode_id === this.analysisResult.safeModeOS?.hexagramId
      );
    }
    
    if (!eiData || !esData) {
      contentDiv.innerHTML = '<p>総合分析に必要なデータが不足しています。</p>';
      return;
    }
    
    // 総合スコア計算
    const overallScore = (eiData.overall_score + esData.overall_score) / 2;
    
    contentDiv.innerHTML = `
      <div class="overview-analysis">
        <div class="overview-header">
          <h4>🎯 内的チーム総合分析</h4>
          <div class="total-score">総合調和スコア: ${Math.round(overallScore * 100)}%</div>
        </div>
        
        <div class="comparison-grid">
          <div class="comparison-item">
            <h5>エンジン ↔ インターフェース</h5>
            <div class="mini-score">${Math.round(eiData.overall_score * 100)}%</div>
            <div class="type-badge ${eiData.type.toLowerCase()}">${eiData.type}</div>
            <p>${eiData.summary}</p>
          </div>
          
          <div class="comparison-item">
            <h5>エンジン ↔ セーフモード</h5>
            <div class="mini-score">${Math.round(esData.overall_score * 100)}%</div>
            <div class="type-badge ${esData.type.toLowerCase()}">${esData.type}</div>
            <p>${esData.summary}</p>
          </div>
        </div>
        
        <div class="integrated-insights">
          <h5>🔮 統合洞察</h5>
          <div class="insight-content">
            ${this.generateIntegratedInsights(eiData, esData, overallScore)}
          </div>
        </div>
        
        <div class="action-recommendations">
          <h5>🎯 統合的行動提案</h5>
          <div class="recommendations-content">
            ${this.generateIntegratedRecommendations(eiData, esData)}
          </div>
        </div>
      </div>
    `;
  }

  // 統合洞察の生成
  generateIntegratedInsights(eiData, esData, overallScore) {
    let insights = [];
    
    if (overallScore > 0.8) {
      insights.push("あなたの内的チームは高度に統合されており、各OSが相互にサポートし合う理想的な状態です。");
    } else if (overallScore > 0.6) {
      insights.push("内的チームは概ね調和しており、適切な意識により更なる統合が可能です。");
    } else if (overallScore > 0.4) {
      insights.push("内的チームには改善の余地があり、意識的な統合努力が必要です。");
    } else {
      insights.push("内的チームに大きな葛藤があり、段階的な調整が重要です。");
    }
    
    // タイプ別の追加洞察
    if (eiData.type === esData.type) {
      insights.push(`エンジンOSは一貫して${eiData.type}的な関係性を築く傾向があります。`);
    } else {
      insights.push(`エンジンOSは状況に応じて${eiData.type}的（対外）と${esData.type}的（内面）の異なる関係性を示します。`);
    }
    
    return insights.map(insight => `<p>${insight}</p>`).join('');
  }

  // 統合的推奨事項の生成
  generateIntegratedRecommendations(eiData, esData) {
    let recommendations = [];
    
    // 両方の強みを活かす提案
    const commonStrengths = eiData.advice.strengths.filter(s => 
      esData.advice.strengths.some(es => es.includes(s.split('')[0]))
    );
    
    if (commonStrengths.length > 0) {
      recommendations.push("共通の強み「" + commonStrengths[0] + "」を日常的に活用しましょう。");
    }
    
    // 課題の統合的解決
    recommendations.push("外向き（インターフェース）と内向き（セーフモード）のバランスを意識的に調整する時間を設けましょう。");
    
    // 具体的な行動提案
    recommendations.push("毎日10分間、3つのOSが協調している瞬間を意識的に観察してみてください。");
    
    return recommendations.map(rec => `<p>• ${rec}</p>`).join('');
  }

  // エラー表示
  showAnalysisError(error) {
    const sections = ['tab-engine-interface', 'tab-engine-safemode', 'tab-overview'];
    sections.forEach(sectionId => {
      const contentDiv = document.getElementById(sectionId);
      if (contentDiv) {
        contentDiv.innerHTML = `
          <div class="error">
            <p>分析の読み込みに失敗しました。</p>
            <p>エラー: ${error.message}</p>
          </div>
        `;
      }
    });
  }

  // startAnimations（空の実装）
  startAnimations() {
    // アニメーション処理があれば実装
  }

  /**
   * フェーズ1: アーキタイプの称号を生成
   */
  generateArchetypeTitle() {
    const { engineOS, interfaceOS, safeModeOS } = this.analysisResult;
    
    // 初期実装: engineOSの名前をベースに称号を生成
    if (engineOS && engineOS.hexagramInfo && engineOS.hexagramInfo.name_jp) {
      return `${engineOS.hexagramInfo.name_jp} の人`;
    }
    
    return "静かなる革命家"; // フォールバック
  }

  /**
   * フェーズ1: アーキタイプのキャッチフレーズを生成
   */
  generateArchetypeCatchphrase() {
    const { engineOS } = this.analysisResult;
    
    // 初期実装: engineOSのキャッチフレーズを使用
    if (engineOS && engineOS.catchphrase) {
      return engineOS.catchphrase;
    }
    
    return "内なる情熱と、冷静な分析力で世界を再構築する。"; // フォールバック
  }

  /**
   * フェーズ1: レーダーチャートを描画
   */
  renderRadarChart() {
    const canvas = document.getElementById('profile-radar-chart');
    if (!canvas) {
      console.warn('profile-radar-chart canvas not found');
      return;
    }

    // 既存のChartインスタンスを破棄
    if (this.radarChart) {
      this.radarChart.destroy();
      this.radarChart = null;
    }

    const ctx = canvas.getContext('2d');
    const vector = this.analysisResult.engineOS.userVector;
    
    if (!vector) {
      console.warn('userVector not found in engineOS');
      return;
    }

    // 8次元の各特性に関する説明を定義
    const dimensionDescriptions = {
        '創造性(乾)': '新しいアイデアや概念を生み出す能力。',
        '行動性(震)': '目標に向かって即座に実行に移す力。',
        '探求性(坎)': '未知の物事や本質を深く掘り下げる力。',
        '安定性(艮)': '物事を着実に維持し、継続させる能力。',
        '受容性(坤)': '他者の意見や状況を受け入れ、育む力。',
        '適応性(巽)': '変化する状況に柔軟に対応する能力。',
        '表現性(離)': '自己の感情や思考を外部に伝える力。',
        '調和性(兌)': '他者と協力し、円滑な関係を築く能力。'
    };

    const labels = Object.keys(dimensionDescriptions);
    const data = [
      vector['乾_創造性'] || 0,
      vector['震_行動性'] || 0,
      vector['坎_探求性'] || 0,
      vector['艮_安定性'] || 0,
      vector['坤_受容性'] || 0,
      vector['巽_適応性'] || 0,
      vector['離_表現性'] || 0,
      vector['兌_調和性'] || 0
    ];

    this.radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'あなたの8次元プロファイル',
                data: data,
                backgroundColor: 'rgba(101, 99, 255, 0.2)',
                borderColor: 'rgba(101, 99, 255, 1)',
                pointBackgroundColor: 'rgba(101, 99, 255, 1)',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        // ツールチップの表示をカスタマイズ
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const description = dimensionDescriptions[label] || '';
                            return `${label}: ${value.toFixed(1)} - ${description}`;
                        }
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: '#f0f0f0', font: { size: 12 } },
                    ticks: {
                        color: '#f0f0f0',
                        backdropColor: 'rgba(0,0,0,0.5)'
                    }
                }
            }
        }
    });
  }

  /**
   * フェーズ2: OSカードのHTMLを生成
   */
  generateOSCard(osType, osData, icon, title, description) {
    const osName = osData && osData.hexagramInfo ? osData.hexagramInfo.name_jp : '未設定';
    const score = osType === 'engine' ? (osData.strength || 0) : 
                  osType === 'interface' ? (osData.matchScore || 0) : 
                  (osData.matchScore || 0);

    return `
      <div class="os-card" data-os-type="${osType}">
        <div class="os-card-header">
          <div class="os-icon">${icon}</div>
          <h3>${title}</h3>
          <div class="os-name">${osName}</div>
          <div class="os-score">${Math.round(score)}%</div>
        </div>
        <div class="os-card-details">
          <p class="os-description">${description}</p>
          <div class="os-detailed-info">
            ${this.generateOSCardDetails(osType, osData)}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * フェーズ2: OSカードの詳細情報を生成
   */
  generateOSCardDetails(osType, osData) {
    if (!osData || !osData.hexagramInfo) {
      return '<p>詳細情報がありません。</p>';
    }

    return `
      <div class="os-details">
        <h4>${osData.hexagramInfo.name_jp}</h4>
        <p class="os-catchphrase">${osData.catchphrase || '情報なし'}</p>
        <div class="os-properties">
          ${osType === 'engine' ? this.generateEngineDetails(osData) : 
            osType === 'interface' ? this.generateInterfaceDetails(osData) :
            this.generateSafeModeDetails(osData)}
        </div>
      </div>
    `;
  }

  /**
   * エンジンOSの詳細を生成
   */
  generateEngineDetails(engineOS) {
    const trigrams = engineOS.dominantTrigrams || [];
    return `
      <div class="dominant-trigrams">
        <h5>主要な価値観</h5>
        <ul>
          ${trigrams.map(t => `<li>${t.name}: ${Math.round(t.percentage)}%</li>`).join('')}
        </ul>
      </div>
    `;
  }

  /**
   * インターフェースOSの詳細を生成
   */
  generateInterfaceDetails(interfaceOS) {
    const matches = interfaceOS.keywordMatches || [];
    return `
      <div class="keyword-matches">
        <h5>関連キーワード</h5>
        <ul>
          ${matches.map(match => `<li>${match}</li>`).join('') || '<li>キーワード情報なし</li>'}
        </ul>
      </div>
    `;
  }

  /**
   * セーフモードOSの詳細を生成
   */
  generateSafeModeDetails(safeModeOS) {
    const matches = safeModeOS.lineMatches || [];
    return `
      <div class="line-matches">
        <h5>関連パターン</h5>
        <ul>
          ${matches.map(match => `<li>${match}</li>`).join('') || '<li>パターン情報なし</li>'}
        </ul>
      </div>
    `;
  }

  /**
   * フェーズ3: 相性分析データを非同期で読み込み
   */
  async loadDynamicsData() {
    try {
      const { engineOS, interfaceOS, safeModeOS } = this.analysisResult;
      
      // インターフェース相性分析データ読み込み
      if (this.compatibilityLoader && engineOS && interfaceOS) {
        const interfaceData = await this.compatibilityLoader.loadInterfaceData(engineOS.hexagramId);
        this.renderInterfaceDynamicsCard(interfaceData, interfaceOS);
      }

      // セーフモード相性分析データ読み込み
      if (this.compatibilityLoader && engineOS && safeModeOS) {
        const safemodeData = await this.compatibilityLoader.loadSafemodeData(engineOS.hexagramId);
        this.renderSafemodeDynamicsCard(safemodeData, safeModeOS);
      }
    } catch (error) {
      console.error('相性分析データの読み込みに失敗:', error);
      this.renderDynamicsError();
    }
  }

  /**
   * インターフェース相性分析カードを描画
   */
  renderInterfaceDynamicsCard(data, interfaceOS) {
    const container = document.getElementById('interface-dynamics-card-container');
    if (!container || !data || !interfaceOS) return;

    // 該当する組み合わせを検索
    const combination = data.internal_team_analysis?.interface_combinations?.find(
      c => c.interface_id === interfaceOS.hexagramId
    );

    if (!combination) {
      container.innerHTML = '<div class="dynamics-error">相性データが見つかりませんでした</div>';
      return;
    }

    container.innerHTML = `
      <div class="dynamics-card">
        <div class="dynamics-header">
          <h4>🤝 エンジンOS vs インターフェースOS</h4>
          <span class="dynamics-type ${combination.type.toLowerCase()}">${combination.type}</span>
        </div>
        <div class="dynamics-score">
          <span>総合スコア</span>
          <div class="score-bar-container">
            <div class="score-bar" style="width: ${Math.round(combination.overall_score * 100)}%;"></div>
          </div>
          <span>${Math.round(combination.overall_score * 100)}%</span>
        </div>
        <div class="dynamics-body">
          <p class="summary">${combination.summary}</p>
        </div>
      </div>
    `;
  }

  /**
   * セーフモード相性分析カードを描画
   */
  renderSafemodeDynamicsCard(data, safeModeOS) {
    const container = document.getElementById('safemode-dynamics-card-container');
    if (!container || !data || !safeModeOS) return;

    // 該当する組み合わせを検索
    const combination = data.internal_team_analysis?.safemode_combinations?.find(
      c => c.safemode_id === safeModeOS.hexagramId
    );

    if (!combination) {
      container.innerHTML = '<div class="dynamics-error">相性データが見つかりませんでした</div>';
      return;
    }

    container.innerHTML = `
      <div class="dynamics-card">
        <div class="dynamics-header">
          <h4>🛡️ エンジンOS vs セーフモードOS</h4>
          <span class="dynamics-type ${combination.type.toLowerCase()}">${combination.type}</span>
        </div>
        <div class="dynamics-score">
          <span>総合スコア</span>
          <div class="score-bar-container">
            <div class="score-bar" style="width: ${Math.round(combination.overall_score * 100)}%;"></div>
          </div>
          <span>${Math.round(combination.overall_score * 100)}%</span>
        </div>
        <div class="dynamics-body">
          <p class="summary">${combination.summary}</p>
        </div>
      </div>
    `;
  }

  /**
   * 相性分析エラー表示
   */
  renderDynamicsError() {
    const containers = ['interface-dynamics-card-container', 'safemode-dynamics-card-container'];
    containers.forEach(containerId => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '<div class="dynamics-error">相性分析データの読み込みに失敗しました</div>';
      }
    });
  }

  /**
   * モーダルイベントリスナーの設定
   */
  setupModalEventListeners() {
    const modal = document.getElementById('compatibility-modal');
    if (!modal) return;

    const closeButton = modal.querySelector('.modal-close-button');
    const overlay = modal.querySelector('.modal-overlay');

    if (closeButton) {
      closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }
  }

  /**
   * 完全相性分析モーダルを表示
   */
  async showCompatibilityAnalysis() {
    const modal = document.getElementById('compatibility-modal');
    const body = document.getElementById('compatibility-modal-body');

    if (!modal || !body) {
      console.error('Modal elements not found');
      return;
    }

    // モーダルとローディング表示を即座に行う
    body.innerHTML = '<p class="loading-text">分析データを読み込み中...</p>';
    modal.style.display = 'flex';

    // ローダーがなければ処理を中断
    if (!this.compatibilityLoader) {
      body.innerHTML = '<p class="error-text">エラー: 詳細分析エンジンが初期化されていません。</p>';
      return;
    }

    try {
      // --- データ取得処理 ---
      // まだデータを取得していなければ（キャッシュがなければ）、非同期で取得する
      if (!this.compatibilityAnalysisData) {
        console.log("🔄 詳細分析データをサーバーから取得します...");
        const { engineOS, interfaceOS, safeModeOS } = this.analysisResult;
        const [interfaceData, safemodeData] = await Promise.all([
          this.compatibilityLoader.loadInterfaceData(engineOS.hexagramId),
          this.compatibilityLoader.loadSafemodeData(engineOS.hexagramId)
        ]);
        // 取得したデータをクラス内にキャッシュする
        this.compatibilityAnalysisData = { interfaceData, safemodeData };
        console.log("✅ 詳細分析データの取得が完了しました。");
      }

      // --- UI描画処理 ---
      // キャッシュしたデータを使ってHTMLを生成する
      const { interfaceData, safemodeData } = this.compatibilityAnalysisData;
      const interfaceHtml = this._renderInterfaceHtml(interfaceData, this.analysisResult.interfaceOS.hexagramId);
      const safemodeHtml = this._renderSafemodeHtml(safemodeData, this.analysisResult.safeModeOS ? this.analysisResult.safeModeOS.hexagramId : null);
      
      // タブのHTML構造を生成
      const finalHtml = `
        <div class="tab-buttons">
          <button class="tab-button active" data-tab="interface">エンジン↔インターフェース</button>
          <button class="tab-button" data-tab="safemode">エンジン↔セーフモード</button>
        </div>
        <div class="tab-content-container">
          <div id="tab-interface" class="tab-content active">${interfaceHtml}</div>
          <div id="tab-safemode" class="tab-content">${safemodeHtml}</div>
        </div>
      `;
      
      // データを完全に描画
      body.innerHTML = finalHtml;
      
      // タブ切り替え機能を初期化
      this._initTabs();

    } catch (error) {
      console.error("完全相性分析の表示に失敗しました:", error);
      body.innerHTML = `<p class="error-text">エラー: 詳細データの取得に失敗しました。<br>${error.message}</p>`;
    }
  }

  /**
   * interfaceデータのHTMLを生成するヘルパー関数
   */
  _renderInterfaceHtml(data, interfaceOsId) {
    if (!data || !data.internal_team_analysis || !data.internal_team_analysis.interface_combinations) {
      return '<div class="dynamics-card"><p>データが見つかりません</p></div>';
    }

    const combination = data.internal_team_analysis.interface_combinations.find(c => c.interface_id === interfaceOsId);
    if (!combination) {
      return '<div class="dynamics-card"><p>該当データなし</p></div>';
    }

    // 5つの評価項目をHTMLに変換
    const evaluationHtml = Object.entries(combination.evaluation || {}).map(([key, value]) => `
        <div class="evaluation-item">
            <div class="evaluation-label">${key.replace(/_/g, ' ')}</div>
            <div class="evaluation-bar-container">
                <div class="evaluation-bar" style="width: ${(value.score || 0) * 100}%;"></div>
            </div>
            <div class="evaluation-score">${Math.round((value.score || 0) * 100)}%</div>
            <p class="evaluation-description">${value.description || '説明なし'}</p>
        </div>
    `).join('');

    const dynamicsType = combination.type === 'harmony' ? 'harmony' : 'tension';

    return `
        <div class="dynamics-card is-expandable">
            <div class="dynamics-header">
                <h4>エンジン ⟷ インターフェース</h4>
                <span class="dynamics-type ${dynamicsType}">${combination.type || 'unknown'}</span>
            </div>
            <p class="dynamics-summary">${combination.summary || 'データがありません'}</p>
            <div class="dynamics-details">
                ${evaluationHtml}
            </div>
        </div>
    `;
  }

  /**
   * safemodeデータのHTMLを生成するヘルパー関数
   */
  _renderSafemodeHtml(data, safemodeOsId) {
    if (!safemodeOsId) {
      return '<div class="dynamics-card"><p>セーフモードOSが分析不能のため、詳細データはありません</p></div>';
    }

    if (!data || !data.internal_team_analysis || !data.internal_team_analysis.safemode_combinations) {
      return '<div class="dynamics-card"><p>データが見つかりません</p></div>';
    }

    const combination = data.internal_team_analysis.safemode_combinations.find(c => c.safemode_id === safemodeOsId);
    if (!combination) {
      return '<div class="dynamics-card"><p>該当データなし</p></div>';
    }

    // 5つの評価項目をHTMLに変換
    const evaluationHtml = Object.entries(combination.evaluation || {}).map(([key, value]) => `
        <div class="evaluation-item">
            <div class="evaluation-label">${key.replace(/_/g, ' ')}</div>
            <div class="evaluation-bar-container">
                <div class="evaluation-bar" style="width: ${(value.score || 0) * 100}%;"></div>
            </div>
            <div class="evaluation-score">${Math.round((value.score || 0) * 100)}%</div>
            <p class="evaluation-description">${value.description || '説明なし'}</p>
        </div>
    `).join('');

    const dynamicsType = combination.type === 'harmony' ? 'harmony' : 'tension';

    return `
        <div class="dynamics-card is-expandable">
            <div class="dynamics-header">
                <h4>エンジン ⟷ セーフモード</h4>
                <span class="dynamics-type ${dynamicsType}">${combination.type || 'unknown'}</span>
            </div>
            <p class="dynamics-summary">${combination.summary || 'データがありません'}</p>
            <div class="dynamics-details">
                ${evaluationHtml}
            </div>
        </div>
    `;
  }

  /**
   * タブ切り替えのためのヘルパー関数
   */
  _initTabs() {
    const modal = document.getElementById('compatibility-modal');
    const tabButtons = modal.querySelectorAll('.tab-button');
    const tabContents = modal.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabName = button.dataset.tab;

        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        tabContents.forEach(content => {
          content.classList.remove('active');
          if (content.id === `tab-${tabName}`) {
            content.classList.add('active');
          }
        });
      });
    });
  }

  /**
   * イベントリスナーを設定する処理を、独立したメソッドに分離
   * 新しいUI用にOSカードのクリック展開機能を追加
   */
  _bindEventListeners() {
    console.log("✅ [TripleOSResultsView] Binding event listeners...");

    try {
        // フェーズ2: OSカードのクリック展開機能
        const osCards = document.querySelectorAll('.os-card');
        osCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                console.log("🖱️ OSカードがクリックされました:", card.dataset.osType);
                this.toggleOSCard(card);
            });
        });

        // フェーズ3: 力学カードのクリック展開機能
        const dynamicsCards = document.querySelectorAll('.dynamics-card.is-expandable');
        dynamicsCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                console.log("🖱️ 力学カードがクリックされました");
                this.toggleDynamicsCard(card);
            });
        });

        // 従来のモーダル機能も保持（非表示にしているが）
        const showButton = document.getElementById('show-compatibility-btn');
        const modal = document.getElementById('compatibility-modal');
        
        if (showButton && modal) {
            const closeButton = modal.querySelector('.modal-close-button');
            const overlay = modal.querySelector('.modal-overlay');

            showButton.addEventListener('click', () => {
                console.log("🖱️ 詳細分析ボタンがクリックされました。");
                this.showCompatibilityAnalysis();
            });

            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            }

            if (overlay) {
                overlay.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            }
        }
            
        console.log("✅ [TripleOSResultsView] All event listeners have been bound successfully.");

    } catch (error) {
        console.error("❌ [TripleOSResultsView] An error occurred while binding event listeners:", error);
    }
  }

  /**
   * フェーズ2: OSカードの展開/折りたたみを切り替え
   */
  toggleOSCard(card) {
    const isExpanded = card.classList.contains('is-expanded');
    
    // 他のカードを閉じる（アコーディオン式）
    document.querySelectorAll('.os-card.is-expanded').forEach(otherCard => {
        if (otherCard !== card) {
            otherCard.classList.remove('is-expanded');
        }
    });
    
    // クリックされたカードを切り替え
    card.classList.toggle('is-expanded');
    
    console.log(`OSカード ${card.dataset.osType} を${isExpanded ? '折りたたみ' : '展開'}しました`);
  }

  /**
   * フェーズ3: 力学カードの展開/折りたたみを切り替え
   */
  toggleDynamicsCard(card) {
    const isExpanded = card.classList.contains('is-expanded');
    
    // 他の力学カードを閉じる（アコーディオン式）
    document.querySelectorAll('.dynamics-card.is-expanded').forEach(otherCard => {
        if (otherCard !== card) {
            otherCard.classList.remove('is-expanded');
        }
    });
    
    // クリックされたカードを切り替え
    card.classList.toggle('is-expanded');
    
    console.log(`力学カードを${isExpanded ? '折りたたみ' : '展開'}しました`);
  }
}
