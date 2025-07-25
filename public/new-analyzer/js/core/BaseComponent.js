// BaseComponent.js - ベースUIコンポーネントクラス（雛形）
// HaQei Analyzer - Base Component Class
class BaseComponent {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.options = { ...this.defaultOptions, ...options };
    this.state = {};
    this.isVisible = false;

    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }

    // this.init(); // ★★★ 自動実行を削除 - 子クラスが明示的に呼び出すまで待機 ★★★
  }

  get defaultOptions() {
    return {
      animation: true,
      animationDuration: 300,
    };
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    throw new Error("render() must be implemented by subclass");
  }

  bindEvents() {
    // Override in subclass
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.onStateChange();
  }

  onStateChange() {
    // Override in subclass
  }

  // 表示
  async show() {
    console.log(`🔄 Showing component: ${this.containerId}`);

    if (this.isVisible) {
      console.log(`⚠️  Component already visible: ${this.containerId}`);
      return;
    }

    // まず表示状態にする - CSSの詳細度を上回るため!importantを使用
    if (this.container.classList.contains('screen-container')) {
      this.container.style.setProperty('display', 'block', 'important');
    } else {
      this.container.style.setProperty('display', 'flex', 'important');
    }
    this.container.style.setProperty('opacity', '1', 'important');
    this.container.style.setProperty('transform', 'translateY(0)', 'important');
    this.container.style.setProperty('visibility', 'visible', 'important');
    
    // visibleクラスを追加してCSS側でも制御
    this.container.classList.add('visible');

    this.isVisible = true;
    console.log(`✅ Component shown: ${this.containerId} - forced with !important and .visible class`);

    this.onShow();
  }

  // 非表示
  async hide() {
    console.log(`🔄 Hiding component: ${this.containerId}`);

    if (!this.isVisible) {
      console.log(`⚠️  Component already hidden: ${this.containerId}`);
      return;
    }

    // 非表示にする（!important フラグ付きで確実に）
    this.container.style.setProperty('display', 'none', 'important');
    this.container.style.setProperty('opacity', '0', 'important');
    this.container.classList.remove('visible');

    this.isVisible = false;
    console.log(`✅ Component hidden: ${this.containerId}`);

    this.onHide();
  }

  onShow() {}
  onHide() {}

  async animateIn() {
    return new Promise((resolve) => {
      this.container.style.opacity = "0";
      this.container.style.transform = "translateY(20px)";

      requestAnimationFrame(() => {
        this.container.style.transition = `opacity ${this.options.animationDuration}ms ease, transform ${this.options.animationDuration}ms ease`;
        this.container.style.opacity = "1";
        this.container.style.transform = "translateY(0)";

        setTimeout(resolve, this.options.animationDuration);
      });
    });
  }

  async animateOut() {
    return new Promise((resolve) => {
      this.container.style.transition = `opacity ${this.options.animationDuration}ms ease, transform ${this.options.animationDuration}ms ease`;
      this.container.style.opacity = "0";
      this.container.style.transform = "translateY(-20px)";

      setTimeout(resolve, this.options.animationDuration);
    });
  }

  createElement(tag, className = "", content = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
  }

  destroy() {
    if (this.container) {
      this.container.innerHTML = "";
    }
    this.onDestroy();
  }

  onDestroy() {}
}

// グローバルスコープで利用可能にする
if (typeof window !== "undefined") {
  window.BaseComponent = BaseComponent;
}
