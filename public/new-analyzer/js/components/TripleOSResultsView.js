// TripleOSResultsView.js - 3層OS分析結果表示コンポーネント
// HaQei Analyzer - Triple OS Results View Component

class TripleOSResultsView extends BaseComponent {
  constructor(containerId, options = {}, eightDimensionAnalysisEngine, internalCompatibilityEngine, relationshipVisualizationEngine) {
    super(containerId, options);
    this.analysisResult = null;
    this.eightDimensionAnalysisEngine = eightDimensionAnalysisEngine;
    this.internalCompatibilityEngine = internalCompatibilityEngine;
    this.relationshipVisualizationEngine = relationshipVisualizationEngine;
    this.advancedCompatibilityEngine = null;
    this.shareManager = null;
    this.pdfExporter = null;
    this.imageExporter = null;
    this.historyManager = null;
    this.analyticsCollector = null;
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

    if (this.options.enhancedMode) {
      this.renderEnhanced();
    } else {
      this.renderBasic();
    }

    this.bindEvents();
    this.startAnimations();
  }

  // 既存の基本表示をレンダリング
  renderBasic() {
    const { engineOS, interfaceOS, safeModeOS, consistencyScore, integration } =
      this.analysisResult;

    this.container.innerHTML = `
      <div class="triple-os-results-container">
        <div class="results-header">
          <h1 class="results-title animate-fade-in">🎯 3層人格OS分析結果</h1>
          <p class="results-subtitle animate-fade-in animate-delay-200">
            あなたの人格を3つの層で分析しました
          </p>
        </div>

        <div class="consistency-score-section animate-fade-in animate-delay-400">
          <div class="consistency-card">
            <h3 class="consistency-title">人格一貫性スコア</h3>
            <div class="consistency-score">
              <div class="score-circle">
                <div class="score-value">${Math.round(
                  consistencyScore.overall * 100
                )}%</div>
                <div class="score-label">総合一貫性</div>
              </div>
              <div class="score-breakdown">
                <div class="score-item">
                  <span class="score-name">エンジン ↔ インターフェース</span>
                  <span class="score-bar">
                    <span class="score-fill" style="width: ${
                      consistencyScore.engineInterface * 100
                    }%"></span>
                  </span>
                  <span class="score-percent">${Math.round(
                    consistencyScore.engineInterface * 100
                  )}%</span>
                </div>
                <div class="score-item">
                  <span class="score-name">エンジン ↔ セーフモード</span>
                  <span class="score-bar">
                    <span class="score-fill" style="width: ${
                      consistencyScore.engineSafeMode * 100
                    }%"></span>
                  </span>
                  <span class="score-percent">${Math.round(
                    consistencyScore.engineSafeMode * 100
                  )}%</span>
                </div>
                <div class="score-item">
                  <span class="score-name">インターフェース ↔ セーフモード</span>
                  <span class="score-bar">
                    <span class="score-fill" style="width: ${
                      consistencyScore.interfaceSafeMode * 100
                    }%"></span>
                  </span>
                  <span class="score-percent">${Math.round(
                    consistencyScore.interfaceSafeMode * 100
                  )}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="os-cards-section animate-fade-in animate-delay-600">
          <div class="os-cards-grid">
            ${this.renderOSCard(
              engineOS,
              "engine",
              "🔧",
              "エンジンOS",
              "核となる価値観・動機"
            )}
            ${this.renderOSCard(
              interfaceOS,
              "interface",
              "🖥️",
              "インターフェースOS",
              "外面的な行動パターン"
            )}
            ${this.renderOSCard(
              safeModeOS,
              "safemode",
              "🛡️",
              "セーフモードOS",
              "内面的な防御機制"
            )}
          </div>
        </div>

        <div class="integration-insights-section animate-fade-in animate-delay-800">
          <div class="integration-card">
            <h3 class="integration-title">統合洞察</h3>
            <div class="integration-content">
              <div class="insight-summary">
                <h4>全体的な分析</h4>
                <p>${integration.summary}</p>
              </div>
              
              <div class="insight-details">
                <div class="insight-item">
                  <strong>エンジンOS:</strong> ${integration.engineInsight}
                </div>
                <div class="insight-item">
                  <strong>インターフェースOS:</strong> ${
                    integration.interfaceInsight
                  }
                </div>
                <div class="insight-item">
                  <strong>セーフモードOS:</strong> ${
                    integration.safeModeInsight
                  }
                </div>
                <div class="insight-item">
                  <strong>一貫性:</strong> ${integration.consistencyInsight}
                </div>
              </div>

              <div class="recommendations">
                <h4>推奨事項</h4>
                <ul>
                  ${integration.recommendations
                    .map((rec) => `<li>${rec}</li>`)
                    .join("")}
                </ul>
              </div>
            </div>
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
      console.log("🔍 internalCompatibilityEngine:", this.internalCompatibilityEngine);
      
      if (!this.internalCompatibilityEngine) {
        console.warn("⚠️ internalCompatibilityEngine is not available");
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
        const strength = osData.strength || 0; // Assuming strength is a value between 0 and 1
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
    const summaryText = safeModeOS.hexagramInfo
      ? `<p>ストレスや困難な状況において、${safeModeOS.hexagramInfo.name}の防御機制が作動します。</p>`
      : `<p>ストレスや困難な状況において、特定の防御パターンは検出されませんでした。</p>`;

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
}
