/**
 * VirtualQuestionFlow State Module
 * 状態管理と永続化を分離したモジュール
 */

class VirtualQuestionFlowState {
  constructor(core) {
    this.core = core;
    this.storageKey = 'haqei_question_flow_state';
    this.autoSaveInterval = null;
    this.saveDebounce = null;
    this.lastSavedState = null;
    
    this.initializeAutoSave();
  }
  
  /**
   * 自動保存初期化
   */
  initializeAutoSave() {
    // 5秒毎に自動保存
    this.autoSaveInterval = setInterval(() => {
      this.autoSave();
    }, 5000);
    
    // ページ離脱時に保存
    window.addEventListener('beforeunload', () => {
      this.saveCurrentState();
    });
    
    // ページ非表示時に保存
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.saveCurrentState();
      }
    });
    
    console.log('💾 Auto-save initialized');
  }
  
  /**
   * 現在の状態を取得
   */
  getCurrentState() {
    return {
      currentQuestionIndex: this.core.currentQuestionIndex,
      answers: this.core.answers,
      visibleRange: this.core.visibleRange,
      sessionId: this.getSessionId(),
      timestamp: Date.now(),
      version: '2.0'
    };
  }
  
  /**
   * 状態を保存
   */
  saveCurrentState() {
    try {
      const state = this.getCurrentState();
      const stateJson = JSON.stringify(state);
      
      // 前回保存時と同じ状態の場合はスキップ
      if (this.lastSavedState === stateJson) {
        return false;
      }
      
      // ローカルストレージに保存
      localStorage.setItem(this.storageKey, stateJson);
      
      // セッションストレージにもバックアップ
      sessionStorage.setItem(this.storageKey + '_backup', stateJson);
      
      this.lastSavedState = stateJson;
      console.log('💾 State saved successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to save state:', error);
      return false;
    }
  }
  
  /**
   * 状態を復元
   */
  restoreState() {
    try {
      // まずローカルストレージから試行
      let stateJson = localStorage.getItem(this.storageKey);
      
      // ローカルストレージが空の場合はセッションストレージから
      if (!stateJson) {
        stateJson = sessionStorage.getItem(this.storageKey + '_backup');
      }
      
      if (!stateJson) {
        console.log('💾 No saved state found');
        return false;
      }
      
      const state = JSON.parse(stateJson);
      
      // バージョン確認
      if (state.version !== '2.0') {
        console.warn('⚠️ Incompatible state version, skipping restore');
        return false;
      }
      
      // 状態の復元
      this.core.currentQuestionIndex = state.currentQuestionIndex || 0;
      this.core.answers = state.answers || [];
      this.core.visibleRange = state.visibleRange || { start: 0, end: 0 };
      
      console.log('💾 State restored successfully');
      console.log(`📍 Restored to question ${this.core.currentQuestionIndex + 1}`);
      console.log(`📝 Restored ${this.core.answers.length} answers`);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to restore state:', error);
      return false;
    }
  }
  
  /**
   * デバウンス付き保存
   */
  debouncedSave() {
    if (this.saveDebounce) {
      clearTimeout(this.saveDebounce);
    }
    
    this.saveDebounce = setTimeout(() => {
      this.saveCurrentState();
    }, 1000);
  }
  
  /**
   * 自動保存実行
   */
  autoSave() {
    // 変更がある場合のみ保存
    const currentState = JSON.stringify(this.getCurrentState());
    if (this.lastSavedState !== currentState) {
      this.saveCurrentState();
    }
  }
  
  /**
   * 回答データの管理
   */
  addAnswer(questionId, answerData) {
    const existingIndex = this.core.answers.findIndex(
      answer => answer.questionId === questionId
    );
    
    const answer = {
      questionId,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      ...answerData
    };
    
    if (existingIndex >= 0) {
      this.core.answers[existingIndex] = answer;
    } else {
      this.core.answers.push(answer);
    }
    
    // 即座にデバウンス保存
    this.debouncedSave();
    
    console.log(`📝 Answer added/updated: ${questionId}`);
    return answer;
  }
  
  /**
   * 回答データの削除
   */
  removeAnswer(questionId) {
    const index = this.core.answers.findIndex(
      answer => answer.questionId === questionId
    );
    
    if (index >= 0) {
      const removed = this.core.answers.splice(index, 1)[0];
      this.debouncedSave();
      console.log(`🗑️ Answer removed: ${questionId}`);
      return removed;
    }
    
    return null;
  }
  
  /**
   * 回答データの取得
   */
  getAnswer(questionId) {
    return this.core.answers.find(answer => answer.questionId === questionId);
  }
  
  /**
   * 全回答データの取得
   */
  getAllAnswers() {
    return [...this.core.answers];
  }
  
  /**
   * 回答データのクリア
   */
  clearAnswers() {
    this.core.answers = [];
    this.saveCurrentState();
    console.log('🧹 All answers cleared');
  }
  
  /**
   * 進捗統計の取得
   */
  getProgressStats() {
    const totalQuestions = this.core.questions.length;
    const answeredQuestions = this.core.answers.filter(
      answer => answer.selectedValue || answer.innerChoice || answer.outerChoice
    ).length;
    
    return {
      totalQuestions,
      answeredQuestions,
      unansweredQuestions: totalQuestions - answeredQuestions,
      completionRate: totalQuestions > 0 ? (answeredQuestions / totalQuestions * 100) : 0,
      currentPosition: this.core.currentQuestionIndex + 1,
      questionsRemaining: totalQuestions - (this.core.currentQuestionIndex + 1)
    };
  }
  
  /**
   * セッション管理
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('haqei_session_id');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      sessionStorage.setItem('haqei_session_id', sessionId);
    }
    return sessionId;
  }
  
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  /**
   * 状態のバリデーション
   */
  validateState(state) {
    if (!state || typeof state !== 'object') {
      return false;
    }
    
    // 必須フィールドの確認
    const requiredFields = ['currentQuestionIndex', 'answers', 'timestamp'];
    for (const field of requiredFields) {
      if (!(field in state)) {
        console.warn(`⚠️ Missing required state field: ${field}`);
        return false;
      }
    }
    
    // 型チェック
    if (typeof state.currentQuestionIndex !== 'number' ||
        !Array.isArray(state.answers)) {
      console.warn('⚠️ Invalid state data types');
      return false;
    }
    
    // 範囲チェック
    if (state.currentQuestionIndex < 0 || 
        state.currentQuestionIndex >= this.core.questions.length) {
      console.warn('⚠️ Invalid currentQuestionIndex');
      return false;
    }
    
    return true;
  }
  
  /**
   * 状態のリセット
   */
  resetState() {
    this.core.currentQuestionIndex = 0;
    this.core.answers = [];
    this.core.visibleRange = { start: 0, end: 0 };
    
    // ストレージをクリア
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.storageKey + '_backup');
    
    this.lastSavedState = null;
    
    console.log('🔄 State reset to initial values');
  }
  
  /**
   * エクスポート用データの生成
   */
  exportData() {
    const state = this.getCurrentState();
    const stats = this.getProgressStats();
    
    return {
      metadata: {
        exportedAt: new Date().toISOString(),
        sessionId: this.getSessionId(),
        version: '2.0'
      },
      state,
      statistics: stats,
      questions: this.core.questions.map(q => ({
        id: q.id,
        title: q.title,
        number: q.number
      }))
    };
  }
  
  /**
   * データのインポート
   */
  importData(importedData) {
    try {
      if (!importedData || !importedData.state) {
        throw new Error('Invalid import data');
      }
      
      const { state } = importedData;
      
      if (!this.validateState(state)) {
        throw new Error('Invalid state data');
      }
      
      // 状態を復元
      this.core.currentQuestionIndex = state.currentQuestionIndex;
      this.core.answers = state.answers;
      this.core.visibleRange = state.visibleRange;
      
      // 保存
      this.saveCurrentState();
      
      console.log('📥 Data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to import data:', error);
      return false;
    }
  }
  
  /**
   * クリーンアップ
   */
  destroy() {
    // 最終保存
    this.saveCurrentState();
    
    // タイマー削除
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    if (this.saveDebounce) {
      clearTimeout(this.saveDebounce);
    }
    
    // イベントリスナー削除
    window.removeEventListener('beforeunload', this.saveCurrentState);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    
    console.log('🧹 VirtualQuestionFlow State cleaned up');
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.VirtualQuestionFlowState = VirtualQuestionFlowState;
}