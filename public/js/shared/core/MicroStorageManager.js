/**
 * MicroStorageManager.js
 * 設問回答保存専用の超軽量ストレージマネージャー
 * Critical Path最適化: わずか5KB以下で必要最小限の機能のみ
 */

class MicroStorageManager {
  constructor() {
    this.prefix = 'haqei_';
    this.cache = new Map();
  }

  // 設問回答の保存
  saveAnswers(answers) {
    try {
      const key = this.prefix + 'answers';
      const data = {
        answers: answers,
        timestamp: Date.now(),
        count: answers.length
      };
      
      localStorage.setItem(key, JSON.stringify(data));
      this.cache.set('answers', data);
      
      return true;
    } catch (error) {
      console.warn('Answer save failed:', error);
      return false;
    }
  }

  // 設問回答の取得
  getAnswers() {
    // キャッシュから高速取得
    if (this.cache.has('answers')) {
      return this.cache.get('answers').answers;
    }

    try {
      const key = this.prefix + 'answers';
      const item = localStorage.getItem(key);
      if (item) {
        const data = JSON.parse(item);
        this.cache.set('answers', data);
        return data.answers || [];
      }
    } catch (error) {
      console.warn('Answer load failed:', error);
    }
    
    return [];
  }

  // セッション情報の保存（最小限）
  saveSession(sessionData) {
    try {
      const key = this.prefix + 'session';
      const data = {
        ...sessionData,
        timestamp: Date.now()
      };
      
      localStorage.setItem(key, JSON.stringify(data));
      this.cache.set('session', data);
      
      return true;
    } catch (error) {
      console.warn('Session save failed:', error);
      return false;
    }
  }

  // セッション情報の取得
  getSession() {
    if (this.cache.has('session')) {
      return this.cache.get('session');
    }

    try {
      const key = this.prefix + 'session';
      const item = localStorage.getItem(key);
      if (item) {
        const data = JSON.parse(item);
        this.cache.set('session', data);
        return data;
      }
    } catch (error) {
      console.warn('Session load failed:', error);
    }
    
    return null;
  }

  // 新しいセッション開始
  startNewSession() {
    const session = {
      id: Date.now().toString(36),
      startTime: Date.now(),
      stage: 'welcome'
    };
    
    this.saveSession(session);
    return session;
  }

  // セッション更新
  updateSession(updates) {
    const session = this.getSession() || this.startNewSession();
    const updatedSession = { ...session, ...updates };
    this.saveSession(updatedSession);
    return updatedSession;
  }

  // プログレス保存（デバウンス付き）
  saveProgress(progressData) {
    if (this.progressTimer) {
      clearTimeout(this.progressTimer);
    }

    this.progressTimer = setTimeout(() => {
      try {
        const key = this.prefix + 'progress';
        const data = {
          ...progressData,
          timestamp: Date.now()
        };
        
        localStorage.setItem(key, JSON.stringify(data));
        this.cache.set('progress', data);
      } catch (error) {
        console.warn('Progress save failed:', error);
      }
    }, 500); // 0.5秒デバウンス
  }

  // プログレス取得
  getProgress() {
    if (this.cache.has('progress')) {
      return this.cache.get('progress');
    }

    try {
      const key = this.prefix + 'progress';
      const item = localStorage.getItem(key);
      if (item) {
        const data = JSON.parse(item);
        this.cache.set('progress', data);
        return data;
      }
    } catch (error) {
      console.warn('Progress load failed:', error);
    }
    
    return null;
  }

  // キー存在チェック
  hasData(dataType) {
    const key = this.prefix + dataType;
    return localStorage.getItem(key) !== null;
  }

  // データクリア
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      this.cache.clear();
      return true;
    } catch (error) {
      console.warn('Clear failed:', error);
      return false;
    }
  }

  // 分析結果の保存
  saveAnalysisResult(analysisResult) {
    try {
      const key = this.prefix + 'analysis_result';
      const data = {
        result: analysisResult,
        timestamp: Date.now(),
        version: '1.0.0'
      };
      
      localStorage.setItem(key, JSON.stringify(data));
      this.cache.set('analysis_result', data);
      
      return true;
    } catch (error) {
      console.warn('Analysis result save failed:', error);
      return false;
    }
  }

  // 分析結果の取得
  getAnalysisResult() {
    // キャッシュから高速取得
    if (this.cache.has('analysis_result')) {
      return this.cache.get('analysis_result').result;
    }

    try {
      const key = this.prefix + 'analysis_result';
      const item = localStorage.getItem(key);
      if (item) {
        const data = JSON.parse(item);
        this.cache.set('analysis_result', data);
        return data.result || null;
      }
    } catch (error) {
      console.warn('Analysis result load failed:', error);
    }
    
    return null;
  }

  // インサイトの保存
  saveInsights(insights) {
    try {
      const key = this.prefix + 'insights';
      const data = {
        insights: insights,
        timestamp: Date.now(),
        version: '1.0.0'
      };
      
      localStorage.setItem(key, JSON.stringify(data));
      this.cache.set('insights', data);
      
      return true;
    } catch (error) {
      console.warn('Insights save failed:', error);
      return false;
    }
  }

  // インサイトの取得
  getInsights() {
    // キャッシュから高速取得
    if (this.cache.has('insights')) {
      return this.cache.get('insights').insights;
    }

    try {
      const key = this.prefix + 'insights';
      const item = localStorage.getItem(key);
      if (item) {
        const data = JSON.parse(item);
        this.cache.set('insights', data);
        return data.insights || null;
      }
    } catch (error) {
      console.warn('Insights load failed:', error);
    }
    
    return null;
  }

  // クリーンアップ
  cleanup() {
    if (this.progressTimer) {
      clearTimeout(this.progressTimer);
    }
    this.cache.clear();
  }
}

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.MicroStorageManager = MicroStorageManager;
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MicroStorageManager;
}