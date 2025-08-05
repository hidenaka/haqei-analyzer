/**
 * VirtualQuestionFlow Navigator Module
 * ナビゲーション処理とフロー制御を分離したモジュール
 */

class VirtualQuestionFlowNavigator {
  constructor(core) {
    this.core = core;
    this.navigationDebounce = null;
    this.autoAdvanceTimer = null;
    this.completionObserver = null;
    
    this.initializeKeyboardNavigation();
    this.initializeCompletionObserver();
  }
  
  /**
   * キーボードナビゲーション初期化
   */
  initializeKeyboardNavigation() {
    this.handleKeydown = (e) => {
      // フォーカス中の入力要素がある場合はキーボードナビゲーションを無効化
      if (document.activeElement && 
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        return;
      }
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          this.goToPrevious();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ': // スペースキー
          e.preventDefault();
          this.goToNext();
          break;
        case 'Home':
          e.preventDefault();
          this.goToFirst();
          break;
        case 'End':
          e.preventDefault();
          this.goToLast();
          break;
        case 'Enter':
          e.preventDefault();
          this.handleEnterKey();
          break;
      }
    };
    
    document.addEventListener('keydown', this.handleKeydown);
    console.log('⌨️ Keyboard navigation initialized');
  }
  
  /**
   * 完了監視オブザーバー初期化
   */
  initializeCompletionObserver() {
    this.completionObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'data-answered') {
          this.handleAnswerStateChange(mutation.target);
        }
      });
    });
    
    console.log('👁️ Completion observer initialized');
  }
  
  /**
   * 次の設問への移動
   */
  goToNext() {
    if (this.navigationDebounce) return;
    
    if (this.core.currentQuestionIndex < this.core.questions.length - 1) {
      this.setNavigationDebounce();
      
      const currentIndex = this.core.currentQuestionIndex;
      this.core.currentQuestionIndex++;
      
      this.performNavigation(currentIndex, this.core.currentQuestionIndex, 'next');
      
      console.log(`➡️ Navigated to question ${this.core.currentQuestionIndex + 1}`);
    } else {
      console.log('➡️ Already at the last question');
      this.handleLastQuestionReached();
    }
  }
  
  /**
   * 前の設問への移動
   */
  goToPrevious() {
    if (this.navigationDebounce) return;
    
    if (this.core.currentQuestionIndex > 0) {
      this.setNavigationDebounce();
      
      const currentIndex = this.core.currentQuestionIndex;
      this.core.currentQuestionIndex--;
      
      this.performNavigation(currentIndex, this.core.currentQuestionIndex, 'previous');
      
      console.log(`⬅️ Navigated to question ${this.core.currentQuestionIndex + 1}`);
    } else {
      console.log('⬅️ Already at the first question');
    }
  }
  
  /**
   * 最初の設問への移動
   */
  goToFirst() {
    if (this.core.currentQuestionIndex !== 0) {
      const currentIndex = this.core.currentQuestionIndex;
      this.core.currentQuestionIndex = 0;
      
      this.performNavigation(currentIndex, 0, 'first');
      console.log('⏪ Navigated to first question');
    }
  }
  
  /**
   * 最後の設問への移動
   */
  goToLast() {
    const lastIndex = this.core.questions.length - 1;
    if (this.core.currentQuestionIndex !== lastIndex) {
      const currentIndex = this.core.currentQuestionIndex;
      this.core.currentQuestionIndex = lastIndex;
      
      this.performNavigation(currentIndex, lastIndex, 'last');
      console.log('⏩ Navigated to last question');
    }
  }
  
  /**
   * 指定された設問への移動
   */
  goToQuestion(questionIndex) {
    if (questionIndex < 0 || questionIndex >= this.core.questions.length) {
      console.error(`❌ Invalid question index: ${questionIndex}`);
      return false;
    }
    
    if (this.core.currentQuestionIndex !== questionIndex) {
      const currentIndex = this.core.currentQuestionIndex;
      this.core.currentQuestionIndex = questionIndex;
      
      this.performNavigation(currentIndex, questionIndex, 'direct');
      console.log(`🎯 Navigated directly to question ${questionIndex + 1}`);
    }
    
    return true;
  }
  
  /**
   * ナビゲーション実行
   */
  async performNavigation(fromIndex, toIndex, direction) {
    try {
      // 表示範囲更新
      this.core.updateVisibleRange();
      
      // 必要な要素をレンダリング
      await this.core.renderVisibleQuestions();
      
      // アニメーション付き遷移（Rendererが利用可能な場合）
      if (this.core.renderer && this.core.renderer.animateTransition) {
        const fromElement = this.core.activeElements.get(fromIndex);
        const toElement = this.core.activeElements.get(toIndex);
        this.core.renderer.animateTransition(fromElement, toElement, direction);
      } else {
        // 基本的な表示切り替え
        this.core.showCurrentQuestion();
      }
      
      // UI更新
      this.core.updateNavigationButtons();
      this.core.updateProgress();
      
      // フォーカス管理
      this.manageFocus(toIndex);
      
      // 進捗イベント送信
      this.dispatchNavigationEvent(fromIndex, toIndex, direction);
      
    } catch (error) {
      console.error('❌ Navigation failed:', error);
      // エラー時はフォールバック処理
      this.core.showCurrentQuestion();
    }
  }
  
  /**
   * ナビゲーションデバウンス設定
   */
  setNavigationDebounce() {
    this.navigationDebounce = setTimeout(() => {
      this.navigationDebounce = null;
    }, 300);
  }
  
  /**
   * Enterキー処理
   */
  handleEnterKey() {
    const currentElement = this.core.activeElements.get(this.core.currentQuestionIndex);
    if (!currentElement) return;
    
    // 現在の設問で選択可能な最初のオプションにフォーカス
    const firstOption = currentElement.querySelector('input[type="radio"]');
    if (firstOption) {
      firstOption.focus();
    }
  }
  
  /**
   * フォーカス管理
   */
  manageFocus(questionIndex) {
    const element = this.core.activeElements.get(questionIndex);
    if (!element) return;
    
    // Web Componentの場合
    if (element.shadowRoot) {
      const firstFocusable = element.shadowRoot.querySelector(
        'input, button, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
    } else {
      // フォールバック要素の場合
      const firstInput = element.querySelector('input[type="radio"]');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  }
  
  /**
   * 回答状態変更処理
   */
  handleAnswerStateChange(element) {
    const questionId = element.dataset.questionId;
    const isAnswered = element.hasAttribute('data-answered');
    
    console.log(`📝 Answer state changed: ${questionId} = ${isAnswered}`);
    
    // 自動進行の処理（オプション）
    if (isAnswered && this.core.options.autoAdvance) {
      this.scheduleAutoAdvance();
    }
    
    // 完了チェック
    this.checkOverallCompletion();
  }
  
  /**
   * 自動進行のスケジュール
   */
  scheduleAutoAdvance() {
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
    }
    
    this.autoAdvanceTimer = setTimeout(() => {
      if (this.core.currentQuestionIndex < this.core.questions.length - 1) {
        this.goToNext();
      }
    }, this.core.options.autoAdvanceDelay || 1500);
  }
  
  /**
   * 全体完了チェック
   */
  checkOverallCompletion() {
    const completedCount = this.core.getCompletedCount();
    const totalCount = this.core.questions.length;
    
    if (completedCount === totalCount) {
      console.log('🏁 All questions completed');
      this.handleAllQuestionsCompleted();
    }
  }
  
  /**
   * 最後の設問到達処理
   */
  handleLastQuestionReached() {
    console.log('🏁 Reached the last question');
    
    // 最後の設問に答えがある場合は完了処理
    const lastAnswer = this.core.findAnswerByQuestionId(`q${this.core.questions.length}`);
    if (lastAnswer && lastAnswer.selectedValue) {
      setTimeout(() => {
        this.handleAllQuestionsCompleted();
      }, 1000);
    }
  }
  
  /**
   * 全設問完了処理
   */
  handleAllQuestionsCompleted() {
    if (this.core.options.onComplete) {
      // 少し遅延して完了処理を実行（最後の設問表示を確保）
      setTimeout(() => {
        this.core.options.onComplete(this.core.answers);
      }, 1500);
    }
    
    this.dispatchCompletionEvent();
  }
  
  /**
   * ナビゲーションイベント配信
   */
  dispatchNavigationEvent(fromIndex, toIndex, direction) {
    const event = new CustomEvent('questionNavigation', {
      detail: {
        fromIndex,
        toIndex,
        direction,
        progress: {
          current: toIndex + 1,
          total: this.core.questions.length,
          completed: this.core.getCompletedCount()
        }
      }
    });
    
    this.core.container.dispatchEvent(event);
  }
  
  /**
   * 完了イベント配信
   */
  dispatchCompletionEvent() {
    const event = new CustomEvent('questionsCompleted', {
      detail: {
        answers: this.core.answers,
        completedAt: new Date().toISOString(),
        totalQuestions: this.core.questions.length
      }
    });
    
    this.core.container.dispatchEvent(event);
  }
  
  /**
   * 進捗統計取得
   */
  getNavigationStats() {
    return {
      currentIndex: this.core.currentQuestionIndex,
      currentQuestion: this.core.currentQuestionIndex + 1,
      totalQuestions: this.core.questions.length,
      completedCount: this.core.getCompletedCount(),
      completionRate: (this.core.getCompletedCount() / this.core.questions.length * 100).toFixed(1),
      isFirstQuestion: this.core.currentQuestionIndex === 0,
      isLastQuestion: this.core.currentQuestionIndex === this.core.questions.length - 1,
      canGoNext: this.core.currentQuestionIndex < this.core.questions.length - 1,
      canGoPrevious: this.core.currentQuestionIndex > 0
    };
  }
  
  /**
   * クリーンアップ
   */
  destroy() {
    // イベントリスナー削除
    document.removeEventListener('keydown', this.handleKeydown);
    
    // タイマー削除
    if (this.navigationDebounce) {
      clearTimeout(this.navigationDebounce);
    }
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
    }
    
    // オブザーバー削除
    if (this.completionObserver) {
      this.completionObserver.disconnect();
    }
    
    console.log('🧹 VirtualQuestionFlow Navigator cleaned up');
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.VirtualQuestionFlowNavigator = VirtualQuestionFlowNavigator;
}