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
            <p class="welcome-subtitle">3つの人格を特定し、その人格OSが相互に作用している様を易経のメタファーを通じて、<br>フィードバックをして、仮想のあなたを客観的にみることができる</p>
          </div>
          
          <div class="welcome-description">
            <div class="insight-promise">
              <p class="main-promise">✨ <strong>こんな気づきが得られます</strong></p>
              <ul class="promise-list">
                <li>「この場面では価値観重視の私だったから、あの判断をしたんだ」</li>
                <li>「人前では社会的な私が出るから、いつもと違う行動になったんだ」</li>
                <li>「あの時は防御モードだったから、つい避けてしまったんだ」</li>
              </ul>
            </div>
            <p class="time-info">📱 約5分・30問・完全無料</p>
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
              分析を開始する
            </button>
            <p class="start-note">※診断後、具体的な行動改善提案も受け取れます</p>
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

  // 表示時の初期化処理を追加
  show() {
    // 上部にスクロールを確実に設定
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // 基底クラスのshow処理を呼び出し
    if (super.show) {
      return super.show();
    }
    
    // フォールバック表示処理
    const containerElement = typeof this.container === 'string' 
      ? document.getElementById(this.container) 
      : this.container;
    
    if (containerElement) {
      containerElement.style.display = 'flex';
      containerElement.classList.add('visible');
      containerElement.style.opacity = '1';
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
