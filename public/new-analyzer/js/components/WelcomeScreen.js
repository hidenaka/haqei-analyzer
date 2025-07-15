// WelcomeScreen.js - ウェルカム画面UIコンポーネント（雛形）
// HaQei Analyzer - Welcome Screen Component
class WelcomeScreen extends BaseComponent {
  get defaultOptions() {
    return {
      ...super.defaultOptions,
      onStart: null,
    };
  }

  render() {
    this.container.innerHTML = `
        <div class="welcome-content">
          <div class="welcome-header">
            <h1 class="welcome-title">🎯 HaQei Analyzer</h1>
            <p class="welcome-subtitle">古代の叡智と現代のテクノロジーが融合した、深い自己洞察体験</p>
          </div>
          
          <div class="welcome-description">
            <p>30の質問を通じて、あなたの価値観を8次元で分析し、64通りの人格OSの中からあなたに最適なものを特定します。</p>
            <p>所要時間：約5-7分</p>
          </div>
          
          <div class="welcome-actions">
            <button id="start-analysis-btn" class="btn btn-primary btn-lg">
              深い洞察を始める
            </button>
          </div>
        </div>
      `;
  }

  bindEvents() {
    const startBtn = this.container.querySelector("#start-analysis-btn");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        if (this.options.onStart) {
          this.options.onStart();
        }
      });
    }
  }
}
