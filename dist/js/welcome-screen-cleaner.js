/**
 * Welcome Screen Cleaner
 * ウェルカム画面から不要な要素を削除し、クリーンな体験を提供
 */

class WelcomeScreenCleaner {
  constructor() {
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (this.isInitialized) return;

    // DOM読み込み完了後に初期化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.cleanWelcomeScreen());
    } else {
      setTimeout(() => this.cleanWelcomeScreen(), 100);
    }

    this.isInitialized = true;
  }

  cleanWelcomeScreen() {
    // ウェルカム画面が表示されている時のみ実行
    const welcomeContainer = document.getElementById('welcome-container');
    if (!welcomeContainer) return;

    // 1. 不要な進捗ガイダンスを削除
    this.removeProgressGuidanceFromWelcome();

    // 2. ウェルカム画面専用の進捗バー設定
    this.setupWelcomeProgressBar();

    // 3. 画面切り替え監視
    this.setupScreenTransitionMonitoring();

    console.log('✨ Welcome screen cleaned - ウェルカム画面をクリーンアップしました');
  }

  /**
   * ウェルカム画面から不要な進捗ガイダンスを削除
   */
  removeProgressGuidanceFromWelcome() {
    const welcomeContainer = document.getElementById('welcome-container');
    const questionsContainer = document.getElementById('questions-container');

    // ウェルカム画面が表示されている間は進捗ガイダンスを非表示
    if (welcomeContainer && welcomeContainer.style.display !== 'none') {
      // 既存の進捗ガイダンスを一時的に隠す
      const existingGuidance = document.querySelectorAll('.progress-guidance, .progress-guidance-fixed');
      existingGuidance.forEach(guidance => {
        guidance.style.display = 'none';
      });
    }
  }

  /**
   * ウェルカム画面専用の進捗バー設定
   */
  setupWelcomeProgressBar() {
    const progressBar = document.querySelector('.global-progress');
    if (!progressBar) return;

    // ウェルカム画面では最小限の進捗情報のみ表示
    const existingInfo = progressBar.querySelectorAll('.progress-info-container, .progress-info-container-fixed');
    existingInfo.forEach(info => {
      info.style.display = 'none';
    });

    // シンプルな進捗表示を作成
    let welcomeProgressInfo = progressBar.querySelector('.welcome-progress-info');
    if (!welcomeProgressInfo) {
      welcomeProgressInfo = document.createElement('div');
      welcomeProgressInfo.className = 'welcome-progress-info';
      welcomeProgressInfo.innerHTML = `
        <div class="welcome-progress-text">
          <span class="welcome-status">診断開始の準備</span>
        </div>
      `;
      progressBar.appendChild(welcomeProgressInfo);
    }

    this.addWelcomeProgressStyles();
  }

  /**
   * 画面切り替え監視
   */
  setupScreenTransitionMonitoring() {
    // MutationObserver で画面の切り替えを監視
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          this.handleScreenTransition();
        }
      });
    });

    // 各コンテナを監視
    const containers = [
      'welcome-container',
      'questions-container',
      'analysis-container',
      'results-container'
    ];

    containers.forEach(containerId => {
      const container = document.getElementById(containerId);
      if (container) {
        observer.observe(container, { attributes: true });
      }
    });

    // 定期的なチェックも追加（フォールバック）
    setInterval(() => this.handleScreenTransition(), 1000);
  }

  /**
   * 画面遷移ハンドリング
   */
  handleScreenTransition() {
    const welcomeContainer = document.getElementById('welcome-container');
    const questionsContainer = document.getElementById('questions-container');
    const progressBar = document.querySelector('.global-progress');

    if (!progressBar) return;

    const welcomeProgressInfo = progressBar.querySelector('.welcome-progress-info');
    const enhancedProgressInfo = progressBar.querySelectorAll('.progress-info-container, .progress-info-container-fixed');
    const guidanceElements = document.querySelectorAll('.progress-guidance, .progress-guidance-fixed');

    // ウェルカム画面が表示されているかチェック
    const isWelcomeScreen = welcomeContainer && 
      (welcomeContainer.style.display === 'flex' || 
       welcomeContainer.style.display === '' || 
       !welcomeContainer.style.display);

    const isQuestionsScreen = questionsContainer && 
      questionsContainer.style.display !== 'none';

    if (isWelcomeScreen && !isQuestionsScreen) {
      // ウェルカム画面: シンプルな表示
      if (welcomeProgressInfo) welcomeProgressInfo.style.display = 'block';
      enhancedProgressInfo.forEach(info => info.style.display = 'none');
      guidanceElements.forEach(guidance => guidance.style.display = 'none');
    } else if (isQuestionsScreen) {
      // 設問画面: 詳細な進捗表示
      if (welcomeProgressInfo) welcomeProgressInfo.style.display = 'none';
      enhancedProgressInfo.forEach(info => info.style.display = 'flex');
      guidanceElements.forEach(guidance => guidance.style.display = 'block');
    }
  }

  /**
   * ウェルカム画面用の進捗スタイル
   */
  addWelcomeProgressStyles() {
    if (document.getElementById('welcome-progress-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'welcome-progress-styles';
    styles.textContent = `
      .welcome-progress-info {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      }

      .welcome-progress-text {
        color: #1f2937;
        font-size: 14px;
        font-weight: 500;
        text-align: center;
      }

      .welcome-status {
        font-weight: 600;
        opacity: 0.8;
      }

      /* ウェルカム画面でのプログレスバーのスタイル調整 */
      #welcome-container:not([style*="display: none"]) ~ * .progress-guidance,
      #welcome-container:not([style*="display: none"]) ~ * .progress-guidance-fixed {
        display: none !important;
      }

      /* クリーンなウェルカム画面のための調整 */
      .welcome-container-active .progress-info-container,
      .welcome-container-active .progress-info-container-fixed {
        display: none !important;
      }
    `;

    document.head.appendChild(styles);
  }

  /**
   * 手動でウェルカム画面をクリーンアップ
   */
  cleanNow() {
    this.cleanWelcomeScreen();
    this.handleScreenTransition();
  }
}

// グローバルに公開
window.WelcomeScreenCleaner = WelcomeScreenCleaner;

// 自動初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.welcomeScreenCleaner = new WelcomeScreenCleaner();
  });
} else {
  window.welcomeScreenCleaner = new WelcomeScreenCleaner();
}

console.log('🧹 Welcome Screen Cleaner loaded - ウェルカム画面をクリーンに保ちます');