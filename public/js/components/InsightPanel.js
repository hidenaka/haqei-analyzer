// HaQei Analyzer - Insight Panel Component
class InsightPanel extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.analysisResult = null;
    this.insights = null;
    this.currentView = 'overview'; // overview, dimensions, hexagram, recommendations
  }

  get defaultOptions() {
    return {
      ...super.defaultOptions,
      onBack: null,
      onGenerateReport: null,
    };
  }

  setData(analysisResult, insights) {
    this.analysisResult = analysisResult;
    this.insights = insights;
    this.render();
  }

  render() {
    if (!this.analysisResult) {
      this.container.innerHTML = `
        <div class="insight-panel-container">
          <div class="error">分析結果が見つかりません。</div>
        </div>
      `;
      return;
    }

    this.container.innerHTML = `
      <div class="insight-panel-container">
        <div class="insight-header">
          <h2 class="insight-title">🔍 深い洞察パネル</h2>
          <div class="insight-navigation">
            <button class="nav-btn ${this.currentView === 'overview' ? 'active' : ''}" data-view="overview">概要</button>
            <button class="nav-btn ${this.currentView === 'dimensions' ? 'active' : ''}" data-view="dimensions">8次元分析</button>
            <button class="nav-btn ${this.currentView === 'hexagram' ? 'active' : ''}" data-view="hexagram">64卦詳細</button>
            <button class="nav-btn ${this.currentView === 'recommendations' ? 'active' : ''}" data-view="recommendations">推奨事項</button>
          </div>
        </div>

        <div class="insight-content">
          ${this.renderCurrentView()}
        </div>

        <div class="insight-actions">
          <button id="back-btn" class="btn btn-secondary">← 戻る</button>
          <button id="generate-report-btn" class="btn btn-primary">📊 レポート生成</button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderCurrentView() {
    switch (this.currentView) {
      case 'overview':
        return this.renderOverview();
      case 'dimensions':
        return this.renderDimensionsAnalysis();
      case 'hexagram':
        return this.renderHexagramDetails();
      case 'recommendations':
        return this.renderRecommendations();
      default:
        return this.renderOverview();
    }
  }

  renderOverview() {
    const primaryOS = this.analysisResult.primaryOS;
    
    return `
      <div class="overview-section">
        <div class="primary-hexagram">
          <div class="hexagram-card">
            <div class="hexagram-name">${primaryOS.hexagramInfo.name}</div>
            <div class="hexagram-reading">${primaryOS.hexagramInfo.reading || ''}</div>
            <div class="match-score">${primaryOS.matchPercentage.toFixed(1)}% マッチ</div>
            <div class="hexagram-description">
              ${primaryOS.hexagramInfo.description || '詳細な説明を生成中...'}
            </div>
          </div>
        </div>

        <div class="key-insights">
          <h3>🎯 主要な洞察</h3>
          <div class="insights-grid">
            ${this.renderKeyInsights()}
          </div>
        </div>

        <div class="dimension-overview">
          <h3>📊 8次元バランス概要</h3>
          <div class="dimension-radar">
            ${this.renderDimensionRadar()}
          </div>
        </div>
      </div>
    `;
  }

  renderDimensionsAnalysis() {
    const vector = this.analysisResult.eightDimensionVector;
    
    return `
      <div class="dimensions-section">
        <h3>📈 8次元詳細分析</h3>
        <div class="dimensions-detailed">
          ${this.renderDetailedDimensions(vector)}
        </div>
        
        <div class="dimension-insights">
          <h4>💡 次元別洞察</h4>
          ${this.renderDimensionInsights(vector)}
        </div>
      </div>
    `;
  }

  renderHexagramDetails() {
    const primaryOS = this.analysisResult.primaryOS;
    
    return `
      <div class="hexagram-section">
        <div class="hexagram-details">
          <h3>🔮 ${primaryOS.hexagramInfo.name} 詳細</h3>
          
          <div class="hexagram-attributes">
            <div class="attribute-item">
              <strong>読み:</strong> ${primaryOS.hexagramInfo.reading || 'N/A'}
            </div>
            <div class="attribute-item">
              <strong>象徴:</strong> ${primaryOS.hexagramInfo.symbol || 'N/A'}
            </div>
            <div class="attribute-item">
              <strong>意味:</strong> ${primaryOS.hexagramInfo.meaning || 'N/A'}
            </div>
          </div>

          <div class="hexagram-interpretation">
            <h4>🎭 あなたの人格パターン</h4>
            <p>${this.generateHexagramInterpretation(primaryOS)}</p>
          </div>

          <div class="hexagram-vector">
            <h4>🧮 この64卦の8次元ベクトル</h4>
            <div class="vector-display">
              ${this.renderHexagramVector(primaryOS.hexagramId)}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderRecommendations() {
    return `
      <div class="recommendations-section">
        <h3>💡 あなたへの推奨事項</h3>
        
        <div class="recommendations-categories">
          <div class="recommendation-category">
            <h4>🎯 キャリア・仕事</h4>
            <ul>
              ${this.generateCareerRecommendations()}
            </ul>
          </div>

          <div class="recommendation-category">
            <h4>🌱 成長・発展</h4>
            <ul>
              ${this.generateGrowthRecommendations()}
            </ul>
          </div>

          <div class="recommendation-category">
            <h4>🤝 人間関係</h4>
            <ul>
              ${this.generateRelationshipRecommendations()}
            </ul>
          </div>

          <div class="recommendation-category">
            <h4>⚠️ 注意点</h4>
            <ul>
              ${this.generateCautionRecommendations()}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  renderKeyInsights() {
    if (!this.insights) {
      return '<div class="insight-item">洞察を生成中...</div>';
    }

    const insights = [
      { title: '主要な強み', content: this.insights.strengths || '分析中...' },
      { title: '成長の可能性', content: this.insights.potential || '分析中...' },
      { title: '特徴的な行動パターン', content: this.insights.patterns || '分析中...' },
    ];

    return insights.map(insight => `
      <div class="insight-item">
        <h4>${insight.title}</h4>
        <p>${insight.content}</p>
      </div>
    `).join('');
  }

  renderDimensionRadar() {
    // 簡易的なレーダーチャート表示（実際のチャートライブラリを使用する場合は置き換え）
    return `
      <div class="radar-placeholder">
        <p>🎯 8次元バランス可視化</p>
        <p>※ 実際のレーダーチャートを表示するにはChart.jsなどのライブラリが必要です</p>
      </div>
    `;
  }

  renderDetailedDimensions(vector) {
    const dimensions = [
      { key: '乾_創造性', name: '創造性', icon: '🌟', description: '新しいアイデアを生み出す力' },
      { key: '震_行動性', name: '行動性', icon: '⚡', description: '積極的に行動する力' },
      { key: '坎_探求性', name: '探求性', icon: '🔍', description: '深く探求する力' },
      { key: '艮_安定性', name: '安定性', icon: '🗻', description: '安定を保つ力' },
      { key: '坤_受容性', name: '受容性', icon: '🌍', description: '受け入れる力' },
      { key: '巽_適応性', name: '適応性', icon: '🌊', description: '変化に適応する力' },
      { key: '離_表現性', name: '表現性', icon: '🔥', description: '自己表現する力' },
      { key: '兌_調和性', name: '調和性', icon: '☯️', description: '調和を作る力' },
    ];

    return dimensions.map(dim => {
      const score = vector[dim.key] || 0;
      const level = this.getDimensionLevel(score);
      
      return `
        <div class="dimension-detail">
          <div class="dimension-header">
            <span class="dimension-icon">${dim.icon}</span>
            <span class="dimension-name">${dim.name}</span>
            <span class="dimension-level ${level.class}">${level.text}</span>
          </div>
          <div class="dimension-description">${dim.description}</div>
          <div class="dimension-score-detail">スコア: ${score.toFixed(2)}</div>
        </div>
      `;
    }).join('');
  }

  renderDimensionInsights(vector) {
    // 最も高い次元と低い次元を特定
    const dimensions = ['乾_創造性', '震_行動性', '坎_探求性', '艮_安定性', '坤_受容性', '巽_適応性', '離_表現性', '兌_調和性'];
    const scores = dimensions.map(dim => ({ name: dim, score: vector[dim] || 0 }));
    scores.sort((a, b) => b.score - a.score);

    const highest = scores[0];
    const lowest = scores[scores.length - 1];

    return `
      <div class="dimension-analysis">
        <div class="strength-dimension">
          <h5>🌟 最も強い次元: ${highest.name}</h5>
          <p>あなたの${highest.name}は特に高く、これがあなたの主要な強みです。</p>
        </div>
        
        <div class="growth-dimension">
          <h5>🌱 成長の余地: ${lowest.name}</h5>
          <p>この次元を意識的に伸ばすことで、よりバランスの取れた人格となるでしょう。</p>
        </div>
      </div>
    `;
  }

  getDimensionLevel(score) {
    if (score >= 2.0) return { text: '非常に高い', class: 'very-high' };
    if (score >= 1.0) return { text: '高い', class: 'high' };
    if (score >= 0.0) return { text: '標準', class: 'normal' };
    if (score >= -1.0) return { text: '低い', class: 'low' };
    return { text: '非常に低い', class: 'very-low' };
  }

  generateHexagramInterpretation(primaryOS) {
    return `あなたの人格は「${primaryOS.hexagramInfo.name}」として特徴づけられます。この卦は${primaryOS.hexagramInfo.meaning || '独特の意味を持ち'}、あなたの行動パターンや価値観に深く反映されています。適合度${primaryOS.matchPercentage.toFixed(1)}%という高いマッチング率は、この分析の精度を示しています。`;
  }

  generateCareerRecommendations() {
    return [
      '<li>創造性を活かせる分野での活躍が期待できます</li>',
      '<li>チームワークを重視する環境が適しています</li>',
      '<li>継続的な学習と成長の機会がある職場を選びましょう</li>',
    ].join('');
  }

  generateGrowthRecommendations() {
    return [
      '<li>定期的な自己反省と目標設定を行いましょう</li>',
      '<li>新しいスキルの習得に積極的に取り組みましょう</li>',
      '<li>多様な経験を積むことで視野を広げましょう</li>',
    ].join('');
  }

  generateRelationshipRecommendations() {
    return [
      '<li>オープンなコミュニケーションを心がけましょう</li>',
      '<li>相手の価値観を尊重する姿勢が重要です</li>',
      '<li>協力的な関係性を築くことを意識しましょう</li>',
    ].join('');
  }

  generateCautionRecommendations() {
    return [
      '<li>完璧主義になりすぎないよう注意しましょう</li>',
      '<li>他人の意見にも耳を傾ける柔軟性を保ちましょう</li>',
      '<li>ストレス管理と適切な休息を忘れずに</li>',
    ].join('');
  }

  renderHexagramVector(hexagramId) {
    // 実際のベクトルデータを取得（仮の実装）
    return `
      <div class="hexagram-vector-display">
        <p>64卦ID: ${hexagramId}</p>
        <p>※ この64卦の標準的な8次元ベクトルを表示</p>
      </div>
    `;
  }

  bindEvents() {
    // ナビゲーションボタン
    this.container.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.target.dataset.view;
        this.currentView = view;
        this.render();
      });
    });

    // アクションボタン
    const backBtn = this.container.querySelector('#back-btn');
    const generateReportBtn = this.container.querySelector('#generate-report-btn');

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (this.options.onBack) {
          this.options.onBack();
        }
      });
    }

    if (generateReportBtn) {
      generateReportBtn.addEventListener('click', () => {
        if (this.options.onGenerateReport) {
          this.options.onGenerateReport(this.analysisResult, this.insights);
        }
      });
    }
  }
}