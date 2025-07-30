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
    
    console.log("🔬 ResultsView initialized with scientific formatting:", !!this.formatter);
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

    // 🚀 最適化: 基本構造を即座に表示
    this.container.innerHTML = `
      <div class="results-container loading">
        <div class="results-header">
          <h2 class="results-title">🎯 あなたの人格OS</h2>
          <div class="primary-result skeleton">
            <div class="loading-placeholder">分析結果を表示中...</div>
          </div>
        </div>
        
        <div class="results-content">
          <div class="dimension-chart skeleton">
            <h3>8次元バランス</h3>
            <div class="loading-placeholder">データ読み込み中...</div>
          </div>
          
          <div class="insights-section skeleton">
            <h3>深い洞察</h3>
            <div class="loading-placeholder">洞察を生成中...</div>
          </div>
        </div>
      </div>
    `;
  }

  // 🚀 新規: 段階的データ読み込み
  async loadDataProgressively() {
    // 🚀 最適化: 段階1 - 基本情報
    await this.loadPrimaryResult();
    
    // 🚀 最適化: 段階2 - 次元データ
    await this.loadDimensionData();
    
    // 🚀 最適化: 段階3 - 洞察データ
    await this.loadInsightData();
    
    // 🚀 最適化: 段階4 - その他の詳細
    await this.loadAdditionalData();
    
    // 🚀 最適化: 最終段階 - イベントバインド
    this.bindEvents();
  }

  // 🚀 新規: 基本結果読み込み
  async loadPrimaryResult() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const primaryOS = this.analysisResult.primaryOS || this.analysisResult.engineOS;
        const primaryResultEl = this.container.querySelector('.primary-result');
        
        if (primaryResultEl && primaryOS) {
          primaryResultEl.innerHTML = `
            <div class="hexagram-display fade-in">
              <div class="hexagram-name">${primaryOS?.hexagramInfo?.name || primaryOS?.osName || "分析結果"}</div>
              <div class="hexagram-reading">${
                primaryOS?.hexagramInfo?.reading || primaryOS?.hexagramInfo?.name_jp || primaryOS?.hexagramInfo?.description || ""
              }</div>
              <div class="match-percentage">${this.formatScientificPercentage(primaryOS?.matchPercentage || primaryOS?.strength || 0)}</div>
              <div class="trigram-composition">構成八卦: ${this.getTrigramComposition(primaryOS)}</div>
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
}
