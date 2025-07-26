/**
 * ProgressIndicator - プログレス表示コンポーネント
 * 質問進捗の視覚的表示とアニメーション機能を提供
 */
class ProgressIndicator extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, {
      showPercentage: true,
      showSteps: true,
      animateChanges: true,
      smoothTransition: true,
      showTimeEstimate: false,
      ...options
    });
    
    this.currentStep = 0;
    this.totalSteps = 0;
    this.animationDuration = 300;
    this.previousProgress = 0;
    
    // プログレス計算設定
    this.PROGRESS_CONFIG = {
      minProgress: 0,
      maxProgress: 100,
      stepIncrement: 'equal', // 'equal' or 'weighted'
      includeWelcome: false,
      includeResults: false
    };
  }

  /**
   * デフォルトオプションを取得
   * @returns {Object}
   */
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      showPercentage: true,
      showSteps: true,
      animateChanges: true,
      smoothTransition: true,
      showTimeEstimate: false,
      theme: 'default' // 'default', 'minimal', 'detailed'
    };
  }

  /**
   * 初期化処理
   * @returns {Promise<void>}
   */
  async beforeInit() {
    this.log('debug', 'beforeInit', 'Initializing ProgressIndicator');
    
    // 全体の進捗設定を取得
    this.setupProgressConfiguration();
  }

  /**
   * プログレス設定をセットアップ
   */
  setupProgressConfiguration() {
    // DataManagerから質問数を取得
    if (window.DataManager) {
      const dataManager = new DataManager();
      const questions = dataManager.getQuestions();
      this.totalSteps = questions.length;
    } else {
      // フォールバック
      this.totalSteps = 5;
    }
    
    this.log('debug', 'setupProgressConfiguration', 'Progress configuration set', {
      totalSteps: this.totalSteps,
      config: this.PROGRESS_CONFIG
    });
  }

  /**
   * メインコンテンツをレンダリング
   * @returns {Promise<string>}
   */
  async renderContent() {
    const progressPercentage = this.calculateProgressPercentage();
    
    return `
      <div class="progress-indicator" data-animate="true">
        ${this.renderProgressHeader()}
        ${this.renderProgressBar(progressPercentage)}
        ${this.renderProgressDetails()}
        ${this.renderProgressFooter()}
      </div>
    `;
  }

  /**
   * プログレスヘッダーをレンダリング
   * @returns {string}
   */
  renderProgressHeader() {
    if (!this.options.showSteps && !this.options.showPercentage) {
      return '';
    }
    
    const progressPercentage = this.calculateProgressPercentage();
    
    return `
      <div class="progress-header">
        ${this.options.showSteps ? `
          <div class="progress-steps">
            <span class="step-current">${this.currentStep}</span>
            <span class="step-separator">/</span>
            <span class="step-total">${this.totalSteps}</span>
          </div>
        ` : ''}
        
        ${this.options.showPercentage ? `
          <div class="progress-percentage">
            <span class="percentage-value">${Math.round(progressPercentage)}</span>
            <span class="percentage-symbol">%</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * プログレスバーをレンダリング
   * @param {number} progressPercentage - 進捗パーセンテージ
   * @returns {string}
   */
  renderProgressBar(progressPercentage) {
    return `
      <div class="progress-container">
        <div class="progress-track">
          <div 
            class="progress-fill" 
            style="width: ${progressPercentage}%"
            data-progress="${progressPercentage}"
          >
            ${this.options.animateChanges ? `
              <div class="progress-shimmer"></div>
            ` : ''}
          </div>
        </div>
        ${this.renderProgressMarkers()}
      </div>
    `;
  }

  /**
   * プログレスマーカーをレンダリング
   * @returns {string}
   */
  renderProgressMarkers() {
    if (!this.options.showSteps || this.totalSteps <= 1) {
      return '';
    }
    
    const markers = [];
    for (let i = 1; i < this.totalSteps; i++) {
      const position = (i / this.totalSteps) * 100;
      const isCompleted = i < this.currentStep;
      
      markers.push(`
        <div 
          class="progress-marker ${isCompleted ? 'completed' : ''}"
          style="left: ${position}%"
          data-step="${i}"
        ></div>
      `);
    }
    
    return `<div class="progress-markers">${markers.join('')}</div>`;
  }

  /**
   * プログレス詳細をレンダリング
   * @returns {string}
   */
  renderProgressDetails() {
    if (this.options.theme === 'minimal') {
      return '';
    }
    
    return `
      <div class="progress-details">
        ${this.renderStepIndicators()}
        ${this.renderTimeEstimate()}
      </div>
    `;
  }

  /**
   * ステップインジケーターをレンダリング
   * @returns {string}
   */
  renderStepIndicators() {
    if (this.options.theme !== 'detailed' || this.totalSteps > 8) {
      return '';
    }
    
    const indicators = [];
    for (let i = 1; i <= this.totalSteps; i++) {
      const isCompleted = i <= this.currentStep;
      const isCurrent = i === this.currentStep + 1;
      
      indicators.push(`
        <div class="step-indicator ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}">
          <div class="step-number">${i}</div>
          <div class="step-status">
            ${isCompleted ? '✓' : isCurrent ? '●' : '○'}
          </div>
        </div>
      `);
    }
    
    return `
      <div class="step-indicators">
        ${indicators.join('')}
      </div>
    `;
  }

  /**
   * 時間推定をレンダリング
   * @returns {string}
   */
  renderTimeEstimate() {
    if (!this.options.showTimeEstimate) {
      return '';
    }
    
    const estimatedTime = this.calculateTimeEstimate();
    
    return `
      <div class="time-estimate">
        <span class="time-label">残り時間:</span>
        <span class="time-value">${estimatedTime}</span>
      </div>
    `;
  }

  /**
   * プログレスフッターをレンダリング
   * @returns {string}
   */
  renderProgressFooter() {
    const progressMessage = this.getProgressMessage();
    
    if (!progressMessage) {
      return '';
    }
    
    return `
      <div class="progress-footer">
        <div class="progress-message">${progressMessage}</div>
      </div>
    `;
  }

  /**
   * レンダリング後の処理
   * @returns {Promise<void>}
   */
  async afterRender() {
    // カスタムCSSプロパティの設定
    this.updateCSSVariables();
    
    // アニメーションの適用
    if (this.options.animateChanges) {
      this.applyProgressAnimation();
    }
    
    // アクセシビリティの設定
    this.setupProgressAccessibility();
  }

  /**
   * CSSカスタムプロパティを更新
   */
  updateCSSVariables() {
    const progressPercentage = this.calculateProgressPercentage();
    
    this.container.style.setProperty('--progress-percentage', `${progressPercentage}%`);
    this.container.style.setProperty('--animation-duration', `${this.animationDuration}ms`);
    this.container.style.setProperty('--total-steps', this.totalSteps);
    this.container.style.setProperty('--current-step', this.currentStep);
  }

  /**
   * プログレスアニメーションを適用
   */
  applyProgressAnimation() {
    const progressFill = this.$('.progress-fill');
    if (!progressFill) return;
    
    const currentProgress = this.calculateProgressPercentage();
    const previousProgress = this.previousProgress;
    
    if (this.options.smoothTransition && Math.abs(currentProgress - previousProgress) > 0) {
      // スムーズなトランジション
      progressFill.style.transition = `width ${this.animationDuration}ms ease-out`;
      
      // シマーエフェクトの開始
      this.startShimmerEffect();
      
      // アニメーション完了後の処理
      setTimeout(() => {
        this.stopShimmerEffect();
      }, this.animationDuration);
    }
    
    this.previousProgress = currentProgress;
  }

  /**
   * シマーエフェクトを開始
   */
  startShimmerEffect() {
    const shimmer = this.$('.progress-shimmer');
    if (shimmer) {
      shimmer.classList.add('active');
    }
  }

  /**
   * シマーエフェクトを停止
   */
  stopShimmerEffect() {
    const shimmer = this.$('.progress-shimmer');
    if (shimmer) {
      shimmer.classList.remove('active');
    }
  }

  /**
   * プログレスアクセシビリティを設定
   */
  setupProgressAccessibility() {
    const progressContainer = this.$('.progress-container');
    if (!progressContainer) return;
    
    const progressPercentage = this.calculateProgressPercentage();
    
    // ARIA属性の設定
    progressContainer.setAttribute('role', 'progressbar');
    progressContainer.setAttribute('aria-valuenow', Math.round(progressPercentage));
    progressContainer.setAttribute('aria-valuemin', '0');
    progressContainer.setAttribute('aria-valuemax', '100');
    progressContainer.setAttribute('aria-label', `質問進捗: ${this.currentStep}/${this.totalSteps}`);
    
    // ライブリージョンの更新
    const progressMessage = this.getProgressMessage();
    if (progressMessage) {
      progressContainer.setAttribute('aria-describedby', 'progress-message');
    }
  }

  /**
   * プログレスパーセンテージを計算
   * @returns {number}
   */
  calculateProgressPercentage() {
    if (this.totalSteps === 0) return 0;
    
    let progress;
    
    if (this.PROGRESS_CONFIG.stepIncrement === 'weighted') {
      // 重み付き計算（将来の拡張用）
      progress = this.calculateWeightedProgress();
    } else {
      // 均等計算
      progress = (this.currentStep / this.totalSteps) * 100;
    }
    
    return Math.max(
      this.PROGRESS_CONFIG.minProgress,
      Math.min(this.PROGRESS_CONFIG.maxProgress, progress)
    );
  }

  /**
   * 重み付きプログレスを計算
   * @returns {number}
   */
  calculateWeightedProgress() {
    // 将来の実装: 質問の重要度や難易度に基づく重み付き計算
    return (this.currentStep / this.totalSteps) * 100;
  }

  /**
   * 時間推定を計算
   * @returns {string}
   */
  calculateTimeEstimate() {
    // 平均的な質問回答時間を基に計算
    const averageTimePerQuestion = 15; // 秒
    const remainingQuestions = this.totalSteps - this.currentStep;
    const estimatedSeconds = remainingQuestions * averageTimePerQuestion;
    
    if (estimatedSeconds < 60) {
      return `${estimatedSeconds}秒`;
    } else {
      const minutes = Math.ceil(estimatedSeconds / 60);
      return `約${minutes}分`;
    }
  }

  /**
   * プログレスメッセージを取得
   * @returns {string}
   */
  getProgressMessage() {
    const progressPercentage = this.calculateProgressPercentage();
    
    if (progressPercentage === 0) {
      return '診断を開始しましょう！';
    } else if (progressPercentage < 25) {
      return '良いスタートです！';
    } else if (progressPercentage < 50) {
      return '順調に進んでいます。';
    } else if (progressPercentage < 75) {
      return 'もう少しで完了です！';
    } else if (progressPercentage < 100) {
      return 'あと少しで結果がわかります！';
    } else {
      return '診断完了！結果を確認しましょう。';
    }
  }

  /**
   * プログレスを更新
   * @param {number} currentStep - 現在のステップ
   * @param {number} totalSteps - 総ステップ数（オプション）
   */
  updateProgress(currentStep, totalSteps = null) {
    this.log('debug', 'updateProgress', 'Updating progress', {
      currentStep,
      totalSteps: totalSteps || this.totalSteps,
      previousStep: this.currentStep
    });
    
    const previousStep = this.currentStep;
    this.currentStep = Math.max(0, currentStep);
    
    if (totalSteps !== null) {
      this.totalSteps = Math.max(1, totalSteps);
    }
    
    // 再レンダリング
    this.render();
    
    // プログレス変更イベントを発火
    this.emit('progressChanged', {
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      previousStep,
      percentage: this.calculateProgressPercentage()
    });
  }

  /**
   * 次のステップに進む
   */
  nextStep() {
    this.updateProgress(this.currentStep + 1);
  }

  /**
   * 前のステップに戻る
   */
  previousStep() {
    this.updateProgress(Math.max(0, this.currentStep - 1));
  }

  /**
   * プログレスをリセット
   */
  reset() {
    this.updateProgress(0);
  }

  /**
   * プログレスを完了
   */
  complete() {
    this.updateProgress(this.totalSteps);
  }

  /**
   * 現在のプログレス情報を取得
   * @returns {Object}
   */
  getProgressInfo() {
    return {
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      percentage: this.calculateProgressPercentage(),
      isCompleted: this.currentStep >= this.totalSteps,
      remainingSteps: Math.max(0, this.totalSteps - this.currentStep),
      estimatedTime: this.calculateTimeEstimate()
    };
  }

  /**
   * プログレスのテーマを変更
   * @param {string} theme - テーマ名
   */
  setTheme(theme) {
    this.options.theme = theme;
    this.render();
  }

  /**
   * アニメーション設定を変更
   * @param {boolean} enable - アニメーションを有効にするか
   */
  setAnimationEnabled(enable) {
    this.options.animateChanges = enable;
    
    if (!enable) {
      this.stopShimmerEffect();
    }
  }
}

// グローバルに公開
window.ProgressIndicator = ProgressIndicator;