// HaQei Analyzer - Storage Manager
// ローカルストレージを管理するクラス
class StorageManager {
  constructor() {
    this.storagePrefix = 'haqei_analyzer_';
    this.version = '1.0.0';
    this.init();
  }

  init() {
    // ストレージの初期化とバージョン管理
    this.checkVersion();
    console.log('🗄️ StorageManager initialized');
  }

  // バージョン確認と必要に応じてデータクリア
  checkVersion() {
    const storedVersion = this.getItem('version');
    if (storedVersion !== this.version) {
      console.log(`📦 Version changed from ${storedVersion} to ${this.version}, clearing storage`);
      this.clearAll();
      this.setItem('version', this.version);
    }
  }

  // キーにプレフィックスを付加
  getKey(key) {
    return `${this.storagePrefix}${key}`;
  }

  // アイテムの保存
  setItem(key, value) {
    try {
      const data = {
        value: value,
        timestamp: Date.now(),
        version: this.version
      };
      localStorage.setItem(this.getKey(key), JSON.stringify(data));
      console.log(`💾 Saved to storage: ${key}`);
      return true;
    } catch (error) {
      console.error('❌ Storage save failed:', error);
      return false;
    }
  }

  // アイテムの取得
  getItem(key) {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (!item) {
        return null;
      }

      const data = JSON.parse(item);
      
      // バージョン確認
      if (data.version !== this.version) {
        console.log(`⚠️ Version mismatch for ${key}, removing`);
        this.removeItem(key);
        return null;
      }

      return data.value;
    } catch (error) {
      console.error('❌ Storage get failed:', error);
      return null;
    }
  }

  // アイテムの削除
  removeItem(key) {
    try {
      localStorage.removeItem(this.getKey(key));
      console.log(`🗑️ Removed from storage: ${key}`);
      return true;
    } catch (error) {
      console.error('❌ Storage remove failed:', error);
      return false;
    }
  }

  // アイテムの存在確認
  hasItem(key) {
    return this.getItem(key) !== null;
  }

  // 全てのアプリケーションデータをクリア
  clearAll() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.storagePrefix)) {
          localStorage.removeItem(key);
        }
      });
      console.log('🧹 All storage cleared');
      return true;
    } catch (error) {
      console.error('❌ Storage clear failed:', error);
      return false;
    }
  }

  // 回答の保存
  saveAnswers(answers) {
    return this.setItem('answers', answers);
  }

  // 回答の取得
  getAnswers() {
    return this.getItem('answers') || [];
  }

  // 進行状況の保存
  saveProgress(progress) {
    const progressData = {
      currentQuestionIndex: progress.currentQuestionIndex || 0,
      totalQuestions: progress.totalQuestions || 0,
      completedQuestions: progress.completedQuestions || 0,
      lastUpdated: Date.now()
    };
    return this.setItem('progress', progressData);
  }

  // 進行状況の取得
  getProgress() {
    return this.getItem('progress');
  }

  // 分析結果の保存
  saveAnalysisResult(result) {
    return this.setItem('analysis_result', result);
  }

  // 分析結果の取得
  getAnalysisResult() {
    return this.getItem('analysis_result');
  }

  // 洞察データの保存
  saveInsights(insights) {
    return this.setItem('insights', insights);
  }

  // 洞察データの取得
  getInsights() {
    return this.getItem('insights');
  }

  // セッション情報の保存
  saveSession(sessionData) {
    const session = {
      sessionId: sessionData.sessionId || this.generateSessionId(),
      startTime: sessionData.startTime || Date.now(),
      lastActivity: Date.now(),
      stage: sessionData.stage || 'welcome', // welcome, questions, analysis, results, insights
      ...sessionData
    };
    return this.setItem('session', session);
  }

  // セッション情報の取得
  getSession() {
    return this.getItem('session');
  }

  // 新しいセッションの開始
  startNewSession() {
    const sessionData = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      lastActivity: Date.now(),
      stage: 'welcome'
    };
    
    // 古いデータをクリア
    this.removeItem('answers');
    this.removeItem('progress');
    this.removeItem('analysis_result');
    this.removeItem('insights');
    
    return this.saveSession(sessionData);
  }

  // セッションIDの生成
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // セッションの更新
  updateSession(updates) {
    const currentSession = this.getSession();
    if (!currentSession) {
      return this.startNewSession();
    }

    const updatedSession = {
      ...currentSession,
      ...updates,
      lastActivity: Date.now()
    };

    return this.saveSession(updatedSession);
  }

  // 設定の保存
  saveSettings(settings) {
    return this.setItem('settings', settings);
  }

  // 設定の取得
  getSettings() {
    return this.getItem('settings') || this.getDefaultSettings();
  }

  // デフォルト設定
  getDefaultSettings() {
    return {
      theme: 'dark',
      language: 'ja',
      animations: true,
      sounds: false,
      saveProgress: true,
      debugMode: false
    };
  }

  // 統計情報の保存
  saveStats(stats) {
    return this.setItem('stats', stats);
  }

  // 統計情報の取得
  getStats() {
    return this.getItem('stats') || this.getDefaultStats();
  }

  // デフォルト統計情報
  getDefaultStats() {
    return {
      totalSessions: 0,
      completedAnalyses: 0,
      averageCompletionTime: 0,
      lastAnalysisDate: null,
      favoriteHexagrams: []
    };
  }

  // 統計情報の更新
  updateStats(updates) {
    const currentStats = this.getStats();
    const updatedStats = {
      ...currentStats,
      ...updates,
      lastUpdated: Date.now()
    };
    return this.saveStats(updatedStats);
  }

  // データのエクスポート
  exportData() {
    const data = {
      version: this.version,
      timestamp: Date.now(),
      answers: this.getAnswers(),
      progress: this.getProgress(),
      analysisResult: this.getAnalysisResult(),
      insights: this.getInsights(),
      session: this.getSession(),
      settings: this.getSettings(),
      stats: this.getStats()
    };
    
    return JSON.stringify(data, null, 2);
  }

  // データのインポート
  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      // バージョン確認
      if (data.version !== this.version) {
        console.warn('⚠️ Import data version mismatch');
        return false;
      }

      // データの復元
      if (data.answers) this.saveAnswers(data.answers);
      if (data.progress) this.saveProgress(data.progress);
      if (data.analysisResult) this.saveAnalysisResult(data.analysisResult);
      if (data.insights) this.saveInsights(data.insights);
      if (data.session) this.saveSession(data.session);
      if (data.settings) this.saveSettings(data.settings);
      if (data.stats) this.saveStats(data.stats);

      console.log('✅ Data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Data import failed:', error);
      return false;
    }
  }

  // ストレージの容量チェック
  checkStorageQuota() {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(estimate => {
        const usage = estimate.usage;
        const quota = estimate.quota;
        const usageInMB = (usage / 1024 / 1024).toFixed(2);
        const quotaInMB = (quota / 1024 / 1024).toFixed(2);
        
        console.log(`📊 Storage usage: ${usageInMB}MB / ${quotaInMB}MB`);
        
        if (usage / quota > 0.8) {
          console.warn('⚠️ Storage is almost full');
        }
      });
    }
  }

  // 自動保存の設定
  setupAutoSave(interval = 30000) { // 30秒ごと
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }

    this.autoSaveInterval = setInterval(() => {
      // セッションの最終アクティビティを更新
      this.updateSession({ lastActivity: Date.now() });
    }, interval);
  }

  // 自動保存の停止
  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  // デバッグ情報の取得
  getDebugInfo() {
    return {
      version: this.version,
      storageKeys: Object.keys(localStorage).filter(key => 
        key.startsWith(this.storagePrefix)
      ),
      totalItems: Object.keys(localStorage).filter(key => 
        key.startsWith(this.storagePrefix)
      ).length,
      session: this.getSession(),
      settings: this.getSettings(),
      stats: this.getStats()
    };
  }
}

console.log('✅ StorageManager loaded');