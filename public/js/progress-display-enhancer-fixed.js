/**
 * Progress Display Enhancer - Fixed Version
 * ユーザーフレンドリーな進捗表示（文字化け修正）
 */

class ProgressDisplayEnhancerFixed {
  constructor() {
    this.totalQuestions = 30;
    this.currentQuestion = 0;
    this.answeredQuestions = 0;
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    
    // ページ読み込み完了後に初期化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.delayedInit());
    } else {
      setTimeout(() => this.delayedInit(), 100);
    }
  }

  delayedInit() {
    try {
      this.enhanceProgressBar();
      this.setupProgressUpdates();
      this.isInitialized = true;
      console.log('✅ Progress Display Enhancer Fixed initialized');
    } catch (error) {
      console.warn('Progress enhancer initialization failed:', error);
    }
  }

  /**
   * プログレスバーの拡張（文字化け防止）
   */
  enhanceProgressBar() {
    const progressBar = document.querySelector('.global-progress');
    if (!progressBar) return;

    // 既存の問題のある要素を削除
    const existingInfo = progressBar.querySelector('.progress-info-container');
    if (existingInfo) {
      existingInfo.remove();
    }

    // クリーンなプログレス情報コンテナを作成
    const progressInfo = document.createElement('div');
    progressInfo.className = 'progress-info-container-fixed';
    progressInfo.innerHTML = `
      <div class="progress-text-fixed">
        <span class="progress-current-fixed">開始準備中</span>
        <span class="progress-total-fixed">全30問</span>
      </div>
      <div class="progress-percentage-fixed">0%</div>
    `;

    progressBar.appendChild(progressInfo);
    this.addCleanProgressStyles();
  }

  /**
   * ガイダンス表示は設問開始時のみ
   */
  showGuidanceWhenNeeded() {
    const questionsContainer = document.getElementById('questions-container');
    const welcomeContainer = document.getElementById('welcome-container');
    
    // ウェルカム画面では表示しない
    if (welcomeContainer && welcomeContainer.style.display !== 'none') {
      return;
    }

    // 設問画面でのみ表示
    if (questionsContainer && questionsContainer.style.display !== 'none') {
      this.addProgressGuidance();
    }
  }

  addProgressGuidance() {
    const questionsContainer = document.getElementById('questions-container');
    if (!questionsContainer) return;

    // 既存のガイダンスをチェック
    if (questionsContainer.querySelector('.progress-guidance-fixed')) return;

    const guidanceContainer = document.createElement('div');
    guidanceContainer.className = 'progress-guidance-fixed';
    guidanceContainer.innerHTML = `
      <div class="guidance-content-fixed">
        <div class="guidance-icon-fixed">🎯</div>
        <div class="guidance-text-fixed">
          <div class="guidance-title-fixed">診断の進行状況</div>
          <div class="guidance-description-fixed">あなたの価値観と思考パターンを分析します</div>
        </div>
      </div>
      <div class="guidance-steps-fixed">
        <div class="step-fixed step-active-fixed">
          <div class="step-number-fixed">1</div>
          <div class="step-text-fixed">価値観設問<br><small>24問</small></div>
        </div>
        <div class="step-fixed">
          <div class="step-number-fixed">2</div>
          <div class="step-text-fixed">シナリオ設問<br><small>6問</small></div>
        </div>
        <div class="step-fixed">
          <div class="step-number-fixed">3</div>
          <div class="step-text-fixed">結果分析<br><small>診断完了</small></div>
        </div>
      </div>
    `;

    questionsContainer.insertBefore(guidanceContainer, questionsContainer.firstChild);
  }

  /**
   * 進捗更新（文字化け防止）
   */
  setupProgressUpdates() {
    // 既存の更新関数を拡張（安全な方法で）
    const originalUpdateProgress = window.updateProgress;
    window.updateProgress = (current, total) => {
      this.updateCleanProgress(current, total);
      if (originalUpdateProgress) {
        try {
          originalUpdateProgress(current, total);
        } catch (e) {
          console.debug('Original progress update failed:', e);
        }
      }
    };

    // ストレージ監視（安全な方法で）
    this.monitorProgressChanges();
  }

  monitorProgressChanges() {
    // 定期的に進捗をチェック（localStorage監視の代替）
    setInterval(() => {
      try {
        const answers = JSON.parse(localStorage.getItem('haqei_answers') || '[]');
        if (answers.length !== this.answeredQuestions) {
          this.updateCleanProgress(answers.length, this.totalQuestions);
        }
      } catch (e) {
        // エラーは静かに処理
      }
    }, 1000);
  }

  /**
   * クリーンな進捗更新
   */
  updateCleanProgress(current, total = this.totalQuestions) {
    this.currentQuestion = current;
    this.answeredQuestions = current;

    const percentage = Math.round((current / total) * 100);

    // プログレスバーの更新
    const progressBar = document.querySelector('.global-progress .progress-bar');
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }

    // テキストの更新（文字化け防止）
    const progressCurrent = document.querySelector('.progress-current-fixed');
    const progressPercentage = document.querySelector('.progress-percentage-fixed');

    if (progressCurrent) {
      let statusText = '開始準備中';
      if (current === 0) {
        statusText = '開始準備中';
      } else if (current <= 24) {
        statusText = `価値観設問 ${current}問目`;
      } else if (current <= 30) {
        statusText = `シナリオ設問 ${current - 24}問目`;
      } else {
        statusText = '診断完了';
      }
      progressCurrent.textContent = statusText;
    }

    if (progressPercentage) {
      progressPercentage.textContent = `${percentage}%`;
    }

    // ステップインジケーターの更新
    this.updateStepIndicatorFixed(current);

    // 画面に応じてガイダンス表示
    this.showGuidanceWhenNeeded();
  }

  updateStepIndicatorFixed(current) {
    const steps = document.querySelectorAll('.step-fixed');
    steps.forEach((step, index) => {
      step.classList.remove('step-active-fixed', 'step-completed-fixed');
      
      if (index === 0 && current <= 24) {
        step.classList.add('step-active-fixed');
      } else if (index === 0 && current > 24) {
        step.classList.add('step-completed-fixed');
      } else if (index === 1 && current > 24 && current <= 30) {
        step.classList.add('step-active-fixed');
      } else if (index === 1 && current > 30) {
        step.classList.add('step-completed-fixed');
      } else if (index === 2 && current > 30) {
        step.classList.add('step-active-fixed');
      }
    });
  }

  /**
   * クリーンなプログレススタイル
   */
  addCleanProgressStyles() {
    if (document.getElementById('progress-enhancement-styles-fixed')) return;

    const styles = document.createElement('style');
    styles.id = 'progress-enhancement-styles-fixed';
    styles.textContent = `
      .progress-info-container-fixed {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 16px;
        z-index: 2;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      }

      .progress-text-fixed {
        display: flex;
        flex-direction: column;
        color: #1f2937;
        font-size: 12px;
        font-weight: 500;
      }

      .progress-current-fixed {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 2px;
      }

      .progress-total-fixed {
        font-size: 11px;
        opacity: 0.8;
      }

      .progress-percentage-fixed {
        color: #1f2937;
        font-size: 16px;
        font-weight: 700;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      }

      .progress-guidance-fixed {
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        border-radius: 12px;
        padding: 20px;
        margin: 20px 0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      }

      .guidance-content-fixed {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }

      .guidance-icon-fixed {
        font-size: 24px;
        margin-right: 12px;
      }

      .guidance-title-fixed {
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 4px;
      }

      .guidance-description-fixed {
        font-size: 14px;
        color: #6b7280;
      }

      .guidance-steps-fixed {
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }

      .step-fixed {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 16px 12px;
        border-radius: 8px;
        background: white;
        border: 2px solid #e5e7eb;
        transition: all 0.3s ease;
      }

      .step-active-fixed {
        border-color: #3b82f6;
        background: #eff6ff;
      }

      .step-completed-fixed {
        border-color: #10b981;
        background: #ecfdf5;
      }

      .step-number-fixed {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #e5e7eb;
        color: #6b7280;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 8px;
      }

      .step-active-fixed .step-number-fixed {
        background: #3b82f6;
        color: white;
      }

      .step-completed-fixed .step-number-fixed {
        background: #10b981;
        color: white;
      }

      .step-text-fixed {
        font-size: 12px;
        font-weight: 500;
        color: #374151;
        line-height: 1.4;
      }

      .step-text-fixed small {
        font-size: 10px;
        color: #6b7280;
      }

      @media (max-width: 768px) {
        .guidance-steps-fixed {
          flex-direction: column;
          gap: 8px;
        }

        .step-fixed {
          flex-direction: row;
          text-align: left;
          padding: 12px;
        }

        .step-number-fixed {
          margin-right: 12px;
          margin-bottom: 0;
        }
      }
    `;

    document.head.appendChild(styles);
  }
}

// グローバルに公開
window.ProgressDisplayEnhancerFixed = ProgressDisplayEnhancerFixed;

// 既存のエンハンサーを無効化してから新しいものを初期化
if (window.progressDisplayEnhancer) {
  window.progressDisplayEnhancer = null;
}

// 自動初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.progressDisplayEnhancerFixed = new ProgressDisplayEnhancerFixed();
  });
} else {
  window.progressDisplayEnhancerFixed = new ProgressDisplayEnhancerFixed();
}

console.log('🔧 Progress Display Enhancer Fixed loaded - 文字化けとUI問題を修正しました');