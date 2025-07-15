// TripleOSResultsView.js - 3層OS分析結果表示コンポーネント
// HaQei Analyzer - Triple OS Results View Component

class TripleOSResultsView extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.analysisResult = null;
  }

  get defaultOptions() {
    return {
      ...super.defaultOptions,
      onExploreMore: null,
      onRetakeTest: null,
      onGenerateReport: null,
      showAnimation: true,
    };
  }

  // 分析結果データを設定
  setData(analysisResult) {
    this.analysisResult = analysisResult;
    console.log("🎯 TripleOSResultsView: Data set", analysisResult);
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
          <button id="retake-test-btn" class="btn btn-secondary">
            🔄 再診断
          </button>
        </div>
      </div>
    `;

    this.bindEvents();
    this.startAnimations();
  }

  // OSカードをレンダリング
  renderOSCard(osData, type, icon, title, description) {
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
            <div class="hexagram-name">${osData.hexagramInfo.name}</div>
            <div class="hexagram-reading">${
              osData.hexagramInfo.reading || ""
            }</div>
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

  // インターフェースOS詳細
  renderInterfaceDetails(interfaceOS) {
    const matches = interfaceOS.keywordMatches || [];

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
          <p>外面的な行動において、${
            interfaceOS.hexagramInfo.name
          }の特徴が強く現れています。</p>
        </div>
      </div>
    `;
  }

  // セーフモードOS詳細
  renderSafeModeDetails(safeModeOS) {
    const matches = safeModeOS.lineMatches || [];

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
          <p>ストレスや困難な状況において、${
            safeModeOS.hexagramInfo.name
          }の防御機制が作動します。</p>
        </div>
      </div>
    `;
  }

  // イベントバインド
  bindEvents() {
    const exploreBtn = this.container.querySelector("#explore-more-btn");
    const reportBtn = this.container.querySelector("#generate-report-btn");
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

    if (retakeBtn) {
      retakeBtn.addEventListener("click", () => {
        if (this.options.onRetakeTest) {
          this.options.onRetakeTest();
        }
      });
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
}
