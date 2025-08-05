/**
 * Progress Display Enhancer - 設問進捗表示の改善
 * ユーザーフレンドリーな進捗情報とガイダンスを提供
 */

class ProgressDisplayEnhancer {
  constructor() {
    this.totalQuestions = 30; // WORLDVIEW_QUESTIONS (24) + SCENARIO_QUESTIONS (6)
    this.currentQuestion = 0;
    this.answeredQuestions = 0;
    this.init();
  }

  init() {
    this.enhanceProgressBar();
    this.addProgressInfo();
    this.setupProgressUpdates();
  }

  /**
   * プログレスバーの拡張
   */
  enhanceProgressBar() {
    const progressBar = document.querySelector('.global-progress');
    if (!progressBar) return;

    // プログレス情報コンテナを追加
    const progressInfo = document.createElement('div');
    progressInfo.className = 'progress-info-container';
    progressInfo.innerHTML = `
      <div class="progress-text">
        <span class="progress-current">準備中...</span>
        <span class="progress-total">全${this.totalQuestions}問</span>
      </div>
      <div class="progress-percentage">0%</div>
    `;

    progressBar.appendChild(progressInfo);

    // スタイルを追加
    this.addProgressStyles();
  }

  /**
   * プログレス情報の追加
   */
  addProgressInfo() {
    const questionsContainer = document.getElementById('questions-container');
    if (!questionsContainer) return;

    // 設問エリアにガイダンスを追加
    const guidanceContainer = document.createElement('div');
    guidanceContainer.className = 'progress-guidance';
    guidanceContainer.innerHTML = `
      <div class="guidance-content">
        <div class="guidance-icon">🎯</div>
        <div class="guidance-text">
          <div class="guidance-title">診断の進行状況</div>
          <div class="guidance-description">あなたの価値観と思考パターンを分析します</div>
        </div>
      </div>
      <div class="guidance-steps">
        <div class="step step-active">
          <div class="step-number">1</div>
          <div class="step-text">価値観設問<br><small>24問</small></div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-text">シナリオ設問<br><small>6問</small></div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-text">結果分析<br><small>診断完了</small></div>
        </div>
      </div>
    `;

    questionsContainer.insertBefore(guidanceContainer, questionsContainer.firstChild);
  }

  /**
   * 進捗更新の設定
   */
  setupProgressUpdates() {
    // 既存の進捗更新関数を拡張
    const originalUpdateProgress = window.updateProgress;
    window.updateProgress = (current, total) => {
      this.updateEnhancedProgress(current, total);
      if (originalUpdateProgress) {
        originalUpdateProgress(current, total);
      }
    };

    // ストレージ変更を監視
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = (key, value) => {
      if (key === 'haqei_answers') {
        try {
          const answers = JSON.parse(value);
          this.updateEnhancedProgress(answers.length, this.totalQuestions);
        } catch (e) {
          // エラーは無視
        }
      }
      originalSetItem.call(localStorage, key, value);
    };

    // 初期状態の設定
    this.checkInitialProgress();
  }

  /**
   * 拡張された進捗更新
   */
  updateEnhancedProgress(current, total = this.totalQuestions) {
    this.currentQuestion = current;
    this.answeredQuestions = current;

    const percentage = Math.round((current / total) * 100);

    // プログレスバーの更新
    const progressBar = document.querySelector('.global-progress .progress-bar');
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }

    // プログレステキストの更新
    const progressCurrent = document.querySelector('.progress-current');
    const progressPercentage = document.querySelector('.progress-percentage');

    if (progressCurrent) {
      if (current === 0) {
        progressCurrent.textContent = '開始準備中';
      } else if (current <= 24) {
        progressCurrent.textContent = `価値観設問 ${current}問目`;
      } else if (current <= 30) {
        progressCurrent.textContent = `シナリオ設問 ${current - 24}問目`;
      } else {
        progressCurrent.textContent = '診断完了';
      }
    }

    if (progressPercentage) {
      progressPercentage.textContent = `${percentage}%`;
    }

    // ステップインジケーターの更新
    this.updateStepIndicator(current);

    // 応援メッセージの表示
    this.showEncouragementMessage(current, total);
  }

  /**
   * ステップインジケーターの更新
   */
  updateStepIndicator(current) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
      step.classList.remove('step-active', 'step-completed');
      
      if (index === 0 && current <= 24) {
        step.classList.add('step-active');
      } else if (index === 0 && current > 24) {
        step.classList.add('step-completed');
      } else if (index === 1 && current > 24 && current <= 30) {
        step.classList.add('step-active');
      } else if (index === 1 && current > 30) {
        step.classList.add('step-completed');
      } else if (index === 2 && current > 30) {
        step.classList.add('step-active');
      }
    });
  }

  /**
   * 応援メッセージの表示
   */
  showEncouragementMessage(current, total) {
    const milestones = [5, 10, 15, 20, 24, 27, 30];
    const messages = [
      '良いスタートです！',
      'いい感じに進んでいます',
      '半分以上完了しました',
      'もう少しで価値観設問完了です',
      '価値観設問完了！シナリオ設問に進みます',
      'あと少しで診断完了です',
      '診断完了！結果を分析中です...'
    ];

    if (milestones.includes(current)) {
      const messageIndex = milestones.indexOf(current);
      this.showToast(messages[messageIndex]);
    }
  }

  /**
   * トーストメッセージの表示
   */
  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'progress-toast';
    toast.innerHTML = `
      <div class="toast-icon">🎉</div>
      <div class="toast-message">${message}</div>
    `;

    document.body.appendChild(toast);

    // アニメーション
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * 初期進捗の確認
   */
  checkInitialProgress() {
    try {
      const answers = JSON.parse(localStorage.getItem('haqei_answers') || '[]');
      if (answers.length > 0) {
        this.updateEnhancedProgress(answers.length, this.totalQuestions);
      }
    } catch (e) {
      console.warn('Progress check failed:', e);
    }
  }

  /**
   * プログレススタイルの追加
   */
  addProgressStyles() {
    if (document.getElementById('progress-enhancement-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'progress-enhancement-styles';
    styles.textContent = `
      .global-progress {
        position: relative;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 8px;
        margin: 10px 20px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .progress-info-container {
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
      }

      .progress-text {
        display: flex;
        flex-direction: column;
        color: #1f2937;
        font-size: 12px;
        font-weight: 500;
      }

      .progress-current {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 2px;
      }

      .progress-total {
        font-size: 11px;
        opacity: 0.8;
      }

      .progress-percentage {
        color: #1f2937;
        font-size: 16px;
        font-weight: 700;
      }

      .progress-guidance {
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        border-radius: 12px;
        padding: 20px;
        margin: 20px 0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }

      .guidance-content {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }

      .guidance-icon {
        font-size: 24px;
        margin-right: 12px;
      }

      .guidance-title {
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 4px;
      }

      .guidance-description {
        font-size: 14px;
        color: #6b7280;
      }

      .guidance-steps {
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }

      .step {
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

      .step-active {
        border-color: #3b82f6;
        background: #eff6ff;
      }

      .step-completed {
        border-color: #10b981;
        background: #ecfdf5;
      }

      .step-number {
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

      .step-active .step-number {
        background: #3b82f6;
        color: white;
      }

      .step-completed .step-number {
        background: #10b981;
        color: white;
      }

      .step-text {
        font-size: 12px;
        font-weight: 500;
        color: #374151;
        line-height: 1.4;
      }

      .step-text small {
        font-size: 10px;
        color: #6b7280;
      }

      .progress-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 10000;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
      }

      .progress-toast.show {
        transform: translateX(0);
        opacity: 1;
      }

      .progress-toast.hide {
        transform: translateX(100%);
        opacity: 0;
      }

      .toast-icon {
        font-size: 18px;
      }

      .toast-message {
        font-size: 14px;
        font-weight: 500;
      }

      @media (max-width: 768px) {
        .guidance-steps {
          flex-direction: column;
          gap: 8px;
        }

        .step {
          flex-direction: row;
          text-align: left;
          padding: 12px;
        }

        .step-number {
          margin-right: 12px;
          margin-bottom: 0;
        }

        .progress-toast {
          top: 10px;
          right: 10px;
          left: 10px;
          max-width: none;
        }
      }
    `;

    document.head.appendChild(styles);
  }
}

// グローバルに公開
window.ProgressDisplayEnhancer = ProgressDisplayEnhancer;

// 自動初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.progressDisplayEnhancer = new ProgressDisplayEnhancer();
  });
} else {
  window.progressDisplayEnhancer = new ProgressDisplayEnhancer();
}

console.log('🎯 Progress Display Enhancer loaded - 進捗表示が改善されました');