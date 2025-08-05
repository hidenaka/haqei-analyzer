/**
 * Progressive Loading Manager - 表示タイミング最適化システム
 * bunenjin哲学: 調和のとれたユーザー体験の実現
 */

class ProgressiveLoadingManager {
  constructor() {
    this.loadingStages = [
      { id: 'initial', label: '初期化中...', progress: 0 },
      { id: 'data', label: 'データ読み込み中...', progress: 25 },
      { id: 'analysis', label: '分析中...', progress: 50 },
      { id: 'rendering', label: '表示準備中...', progress: 75 },
      { id: 'complete', label: '完了', progress: 100 }
    ];
    
    this.currentStage = 0;
    this.callbacks = new Map();
    this.isLoading = false;
    
    this.initializeSkeletonSystem();
  }

  /**
   * スケルトンローディングシステムの初期化
   */
  initializeSkeletonSystem() {
    // スケルトンスタイルの動的生成
    if (!document.getElementById('skeleton-styles')) {
      const style = document.createElement('style');
      style.id = 'skeleton-styles';
      style.textContent = `
        .skeleton-container {
          position: relative;
          overflow: hidden;
        }
        
        .skeleton-item {
          background: linear-gradient(
            90deg, 
            rgba(55, 65, 81, 0.1) 25%, 
            rgba(75, 85, 99, 0.2) 37%, 
            rgba(55, 65, 81, 0.1) 63%
          );
          background-size: 400% 100%;
          animation: skeleton-wave 1.5s ease-in-out infinite;
          border-radius: 8px;
        }
        
        @keyframes skeleton-wave {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .fade-in-progressive {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .fade-in-progressive.loaded {
          opacity: 1;
          transform: translateY(0);
        }
        
        .progressive-delay-1 { transition-delay: 0.1s; }
        .progressive-delay-2 { transition-delay: 0.2s; }
        .progressive-delay-3 { transition-delay: 0.3s; }
        .progressive-delay-4 { transition-delay: 0.4s; }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * ローディング開始
   */
  startLoading(containerId, options = {}) {
    this.isLoading = true;
    this.currentStage = 0;
    
    const container = document.getElementById(containerId);
    if (!container) return;

    // ローディングオーバーレイの作成
    const overlay = this.createLoadingOverlay(options);
    container.appendChild(overlay);

    // プログレスバーの初期化
    this.updateProgress(0);
    
    // ステージ進行の開始
    this.advanceStage();
  }

  /**
   * ローディングオーバーレイの作成
   */
  createLoadingOverlay(options) {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
    
    overlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner" aria-hidden="true"></div>
        <div class="loading-text" id="loading-text">
          ${this.loadingStages[0].label}
        </div>
        <div class="progress-container">
          <div class="progress-bar" id="progress-bar">
            <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
          </div>
          <div class="progress-percentage" id="progress-percentage">0%</div>
        </div>
        ${options.showDetails ? '<div class="loading-details" id="loading-details"></div>' : ''}
      </div>
    `;
    
    return overlay;
  }

  /**
   * 進捗更新
   */
  updateProgress(percentage, details = '') {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-percentage');
    const detailsElement = document.getElementById('loading-details');
    
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
      progressFill.setAttribute('aria-valuenow', percentage);
    }
    
    if (progressText) {
      progressText.textContent = `${Math.round(percentage)}%`;
    }
    
    if (detailsElement && details) {
      detailsElement.textContent = details;
    }
  }

  /**
   * ステージ進行
   */
  advanceStage() {
    if (this.currentStage >= this.loadingStages.length) return;
    
    const stage = this.loadingStages[this.currentStage];
    const loadingText = document.getElementById('loading-text');
    
    if (loadingText) {
      loadingText.textContent = stage.label;
    }
    
    this.updateProgress(stage.progress);
    
    // コールバック実行
    if (this.callbacks.has(stage.id)) {
      this.callbacks.get(stage.id)();
    }
    
    this.currentStage++;
  }

  /**
   * ステージコールバックの登録
   */
  onStage(stageId, callback) {
    this.callbacks.set(stageId, callback);
  }

  /**
   * スケルトンローディングの作成
   */
  createSkeletonLoader(type, count = 1) {
    const skeletonTemplates = {
      card: () => `
        <div class="skeleton-container card">
          <div class="skeleton-item" style="height: 20px; width: 60%; margin-bottom: 12px;"></div>
          <div class="skeleton-item" style="height: 16px; width: 100%; margin-bottom: 8px;"></div>
          <div class="skeleton-item" style="height: 16px; width: 80%; margin-bottom: 16px;"></div>
          <div class="skeleton-item" style="height: 40px; width: 120px;"></div>
        </div>
      `,
      list: () => `
        <div class="skeleton-container">
          <div class="skeleton-item" style="height: 16px; width: 100%; margin-bottom: 8px;"></div>
        </div>
      `,
      chart: () => `
        <div class="skeleton-container">
          <div class="skeleton-item" style="height: 300px; width: 100%;"></div>
        </div>
      `,
      button: () => `
        <div class="skeleton-container">
          <div class="skeleton-item" style="height: 44px; width: 120px;"></div>
        </div>
      `
    };
    
    const template = skeletonTemplates[type] || skeletonTemplates.card;
    return Array(count).fill(0).map(() => template()).join('');
  }

  /**
   * プログレッシブレンダリング
   */
  renderProgressively(elements, delay = 100) {
    elements.forEach((element, index) => {
      element.classList.add('fade-in-progressive');
      element.classList.add(`progressive-delay-${Math.min(index + 1, 4)}`);
      
      setTimeout(() => {
        element.classList.add('loaded');
      }, delay * index);
    });
  }

  /**
   * ローディング完了
   */
  completeLoading() {
    this.isLoading = false;
    
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
      }, 300);
    }
    
    // スケルトンの削除とコンテンツの表示
    document.querySelectorAll('.skeleton-container').forEach(skeleton => {
      skeleton.style.opacity = '0';
      setTimeout(() => skeleton.remove(), 300);
    });
    
    // プログレッシブレンダリングの開始
    const contentElements = document.querySelectorAll('[data-progressive-load]');
    this.renderProgressively(Array.from(contentElements));
  }

  /**
   * ローディング中かどうかの確認
   */
  isCurrentlyLoading() {
    return this.isLoading;
  }

  /**
   * エラー状態の表示
   */
  showLoadingError(message, retryCallback = null) {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
      const content = overlay.querySelector('.loading-content');
      content.innerHTML = `
        <div class="error-icon" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;">⚠️</div>
        <div class="error-message" style="color: #f87171; font-size: 1.125rem; margin-bottom: 1rem;">
          ${message}
        </div>
        ${retryCallback ? `
          <button class="btn retry-button" onclick="this.parentElement.dispatchEvent(new CustomEvent('retry'))">
            再試行
          </button>
        ` : ''}
      `;
      
      if (retryCallback) {
        content.addEventListener('retry', retryCallback);
      }
    }
  }
}

// グローバル利用のためのエクスポート
window.ProgressiveLoadingManager = ProgressiveLoadingManager;

// 使用例のコメント
/*
使用方法:

const loadingManager = new ProgressiveLoadingManager();

// ローディング開始
loadingManager.startLoading('main-container', { showDetails: true });

// ステージごとのコールバック設定
loadingManager.onStage('data', () => {
  console.log('データ読み込み開始');
});

loadingManager.onStage('analysis', () => {
  loadingManager.advanceStage();
});

// 完了
setTimeout(() => {
  loadingManager.completeLoading();
}, 3000);

// スケルトンローダーの使用
const skeletonHTML = loadingManager.createSkeletonLoader('card', 3);
document.getElementById('content').innerHTML = skeletonHTML;
*/