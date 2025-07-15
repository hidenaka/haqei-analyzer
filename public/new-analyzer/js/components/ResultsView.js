// HaQei Analyzer - Results View Component
class ResultsView extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.analysisResult = null;
    this.insights = null;
  }

  get defaultOptions() {
    return {
      ...super.defaultOptions,
      onExploreMore: null,
      onRetakeTest: null,
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
        <div class="results-container">
          <div class="error">分析結果が見つかりません。</div>
        </div>
      `;
      return;
    }

    const primaryOS = this.analysisResult.primaryOS;
    const vector = this.analysisResult.eightDimensionVector;

    this.container.innerHTML = `
      <div class="results-container">
        <div class="results-header">
          <h2 class="results-title">🎯 あなたの人格OS</h2>
          <div class="primary-result">
            <div class="hexagram-display">
              <div class="hexagram-name">${primaryOS.hexagramInfo.name}</div>
              <div class="hexagram-reading">${
                primaryOS.hexagramInfo.reading || ""
              }</div>
              <div class="match-percentage">${primaryOS.matchPercentage.toFixed(
                1
              )}%</div>
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
      </div>
    `;

    this.bindEvents();
  }

  renderDimensionScores(vector) {
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
        const percentage = Math.max(0, Math.min(100, (score + 5) * 10)); // -5〜+5を0〜100%に変換

        return `
        <div class="dimension-item">
          <div class="dimension-header">
            <span class="dimension-icon">${dim.icon}</span>
            <span class="dimension-name">${dim.name}</span>
            <span class="dimension-score">${score.toFixed(1)}</span>
          </div>
          <div class="dimension-bar">
            <div class="dimension-fill" style="width: ${percentage}%"></div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  renderInsights() {
    if (!this.insights) {
      return "<p>洞察を生成中...</p>";
    }

    return `
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

  renderAlternativeMatches() {
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
          <div class="match-name">${match.hexagramInfo.name}</div>
          <div class="match-percentage">${match.matchPercentage.toFixed(
            1
          )}%</div>
        </div>
      </div>
    `
      )
      .join("");
  }

  bindEvents() {
    const exploreMoreBtn = this.container.querySelector("#explore-more-btn");
    const retakeTestBtn = this.container.querySelector("#retake-test-btn");

    if (exploreMoreBtn) {
      exploreMoreBtn.addEventListener("click", () => {
        if (this.options.onExploreMore) {
          this.options.onExploreMore(this.analysisResult);
        }
      });
    }

    if (retakeTestBtn) {
      retakeTestBtn.addEventListener("click", () => {
        if (this.options.onRetakeTest) {
          this.options.onRetakeTest();
        } else {
          // デフォルトの処理: ページリロード
          window.location.reload();
        }
      });
    }
  }

  // 🔧 trigramComposition安全取得メソッド
  getTrigramComposition(osData) {
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
}
