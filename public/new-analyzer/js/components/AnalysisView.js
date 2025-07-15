// HaQei Analyzer - Analysis View Component
class AnalysisView extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.analysisSteps = [
      "価値観データを8次元で解析中...",
      "64卦の特性マトリックスを計算中...",
      "コサイン類似度を算出中...",
      "最適な人格OSを特定中...",
      "深い洞察を生成中...",
    ];
    this.currentStep = 0;
    this.analysisInterval = null;
  }

  get defaultOptions() {
    return {
      ...super.defaultOptions,
      onAnalysisComplete: null,
      analysisDuration: 5000, // 5秒
    };
  }

  render() {
    this.container.innerHTML = `
      <div class="analysis-container">
        <div class="analysis-header">
          <h2 class="analysis-title">🔬 深い洞察を生成中</h2>
          <p class="analysis-subtitle">古代の叡智と現代の数学が融合する瞬間</p>
        </div>

        <div class="analysis-visual">
          <div class="analysis-spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
          </div>
          
          <div class="analysis-progress">
            <div class="progress-circle">
              <div class="progress-text">
                <span id="progress-percent">0</span>%
              </div>
            </div>
          </div>
        </div>

        <div class="analysis-steps">
          <div id="current-step" class="step-text">
            分析を開始しています...
          </div>
          
          <div class="steps-list">
            ${this.analysisSteps
              .map(
                (step, index) => `
              <div class="step-item" data-step="${index}">
                <div class="step-icon">
                  <div class="step-number">${index + 1}</div>
                  <div class="step-check">✓</div>
                </div>
                <div class="step-text">${step}</div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <div class="analysis-footer">
          <p class="analysis-note">
            💡 あなたの価値観は8次元ベクトルとして数値化され、<br>
            64通りの人格OSパターンと照合されています
          </p>
        </div>
      </div>
    `;
  }

  async startAnalysis() {
    console.log("🔬 Starting analysis animation...");

    // プログレス更新
    const progressPercent = this.container.querySelector("#progress-percent");
    const currentStepEl = this.container.querySelector("#current-step");

    let progress = 0;
    const stepDuration =
      this.options.analysisDuration / this.analysisSteps.length;

    this.analysisInterval = setInterval(() => {
      // プログレス更新
      progress += 100 / this.analysisSteps.length;
      if (progressPercent) {
        progressPercent.textContent = Math.min(Math.round(progress), 100);
      }

      // 現在のステップを更新
      if (currentStepEl && this.currentStep < this.analysisSteps.length) {
        currentStepEl.textContent = this.analysisSteps[this.currentStep];
      }

      // ステップアイテムを完了状態に
      const stepItem = this.container.querySelector(
        `[data-step="${this.currentStep}"]`
      );
      if (stepItem) {
        stepItem.classList.add("completed");
      }

      this.currentStep++;

      // 分析完了
      if (this.currentStep >= this.analysisSteps.length) {
        this.completeAnalysis();
      }
    }, stepDuration);
  }

  completeAnalysis() {
    clearInterval(this.analysisInterval);

    const currentStepEl = this.container.querySelector("#current-step");
    const progressPercent = this.container.querySelector("#progress-percent");

    if (currentStepEl) {
      currentStepEl.textContent = "✨ 分析完了！深い洞察が生成されました";
      currentStepEl.style.color = "var(--accent-400)";
    }

    if (progressPercent) {
      progressPercent.textContent = "100";
    }

    // 完了アニメーション
    setTimeout(() => {
      if (this.options.onAnalysisComplete) {
        this.options.onAnalysisComplete();
      }
    }, 1000);
  }

  onShow() {
    // 表示時に分析開始
    setTimeout(() => {
      this.startAnalysis();
    }, 500);
  }

  onHide() {
    // 非表示時にインターバルクリア
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }
  }
}
