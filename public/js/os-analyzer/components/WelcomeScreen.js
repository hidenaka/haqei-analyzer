// WelcomeScreen.js - ウェルカム画面UIコンポーネント（雛形）
// HaQei Analyzer - Welcome Screen Component

// BaseComponentの存在確認
if (typeof BaseComponent === "undefined") {
  console.error("❌ [WelcomeScreen] BaseComponent が定義されていません");
  // 緊急フォールバック用の最小限BaseComponent
  window.BaseComponent = class BaseComponent {
    constructor(container, options = {}) {
      this.container = container;
      this.options = { ...this.defaultOptions, ...options };
    }
    get defaultOptions() {
      return {};
    }
    render() {}
    bindEvents() {}
  };
}

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

          <div class="triple-os-intro">
            <h3>🔺 HaQei独自の「3つの人格システム」理論</h3>
            <p>私たちは誰もが、状況に応じて使い分ける3つの人格システムを持っています：</p>
            
            <div class="os-cards">
              <div class="os-card engine-os">
                <div class="os-icon">⚙️</div>
                <h4>価値観システム</h4>
                <p>本質的な自分・核となる価値観</p>
                <p class="os-detail">誰も見ていない時、心から信頼できる人といる時に現れる「本音の自分」</p>
              </div>
              
              <div class="os-card interface-os">
                <div class="os-icon">🎭</div>
                <h4>社会的システム</h4>
                <p>他者に見せる自分・社会的な表現</p>
                <p class="os-detail">職場や友人関係、初対面の人との関わりで見せる「社会的な自分」</p>
              </div>
              
              <div class="os-card safemode-os">
                <div class="os-icon">🛡️</div>
                <h4>防御システム</h4>
                <p>内なる自分の防御機制</p>
                <p class="os-detail">困難や脅威に直面した時、無意識に発動する「守る力を持つ智慧」</p>
              </div>
            </div>

            <div class="safemode-emphasis">
              <p class="emphasis-text">
                <span class="emphasis-icon">💡</span>
                特に「防御システム」は、あなたを守るために発動する大切な機能です。
                これは悪いものではなく、適切に理解し活用することで、より健全な自己統合への道が開けます。
              </p>
            </div>
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

// グローバルスコープに明示的に登録
window.WelcomeScreen = WelcomeScreen;

// 読み込み確認ログ
console.log(
  "✅ [WelcomeScreen] WelcomeScreen クラスが定義されました:",
  typeof WelcomeScreen
);
