/**
 * 7日間バリデーションスプリント - メトリクス収集システム
 * 
 * 機能:
 * - シナリオ選択率トラッキング
 * - 有用度評価収集  
 * - 決定時間測定
 * - fallbackレベル記録
 * - データ永続化・復旧
 */

class ValidationMetrics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.events = [];
        this.currentMetrics = {
            scenarioSelected: null,
            usefulnessRating: null,
            decisionTimeSec: null,
            fallbackLevel: 'full'
        };
        
        console.log('📊 ValidationMetrics initialized - Session:', this.sessionId);
    }
    
    /**
     * セッションID生成
     */
    generateSessionId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `VAL-${timestamp}-${random}`;
    }
    
    /**
     * シナリオ選択をトラッキング
     * @param {string} scenarioId - 選択されたシナリオID (FUT-001 等)
     * @param {number} selectionTime - 選択にかかった時間(秒)
     */
    trackScenarioSelection(scenarioId, selectionTime = null) {
        const decisionTime = selectionTime || Math.round((Date.now() - this.startTime) / 1000);
        
        this.currentMetrics.scenarioSelected = scenarioId;
        this.currentMetrics.decisionTimeSec = decisionTime;
        
        this.addEvent('scenario_selected', {
            scenarioId: scenarioId,
            decisionTimeSec: decisionTime,
            timestamp: Date.now()
        });
        
        console.log('🎯 シナリオ選択記録:', scenarioId, '決定時間:', decisionTime + '秒');
    }
    
    /**
     * 有用度評価をトラッキング
     * @param {number} rating - 1-5の評価
     * @param {string} reason - 評価理由（任意）
     */
    trackUsefulnessRating(rating, reason = '') {
        if (rating < 1 || rating > 5) {
            console.error('⚠️ 有用度評価は1-5の範囲で入力してください:', rating);
            return;
        }
        
        this.currentMetrics.usefulnessRating = rating;
        
        this.addEvent('usefulness_rated', {
            rating: rating,
            reason: reason,
            timestamp: Date.now()
        });
        
        console.log('⭐ 有用度評価記録:', rating + '/5', reason ? `理由: ${reason}` : '');
    }
    
    /**
     * 決定時間を記録
     * @param {number} seconds - 決定にかかった秒数
     */
    trackDecisionTime(seconds) {
        this.currentMetrics.decisionTimeSec = seconds;
        
        this.addEvent('decision_time_measured', {
            seconds: seconds,
            timestamp: Date.now()
        });
        
        console.log('⏱️ 決定時間記録:', seconds + '秒');
    }
    
    /**
     * fallbackレベルを記録
     * @param {string} level - full/partial/minimal/emergency
     */
    trackFallbackLevel(level) {
        const validLevels = ['full', 'partial', 'minimal', 'emergency'];
        if (!validLevels.includes(level)) {
            console.error('⚠️ 無効なfallbackレベル:', level, '有効値:', validLevels);
            return;
        }
        
        this.currentMetrics.fallbackLevel = level;
        
        this.addEvent('fallback_level_set', {
            level: level,
            timestamp: Date.now()
        });
        
        console.log('🔄 Fallbackレベル記録:', level);
    }
    
    /**
     * カスタムイベントを記録
     * @param {string} eventType - イベント種別
     * @param {Object} data - イベントデータ
     */
    addEvent(eventType, data) {
        this.events.push({
            eventType: eventType,
            data: data,
            sessionId: this.sessionId,
            timestamp: Date.now()
        });
    }
    
    /**
     * メトリクスをローカルストレージに保存
     */
    saveMetrics() {
        const metricsData = {
            sessionId: this.sessionId,
            startTime: this.startTime,
            endTime: Date.now(),
            currentMetrics: this.currentMetrics,
            events: this.events,
            savedAt: new Date().toISOString()
        };
        
        try {
            const key = `validation_metrics_${this.sessionId}`;
            localStorage.setItem(key, JSON.stringify(metricsData));
            
            // インデックスも更新
            this.updateMetricsIndex();
            
            console.log('💾 メトリクス保存完了:', key);
            return true;
        } catch (error) {
            console.error('❌ メトリクス保存失敗:', error);
            return false;
        }
    }
    
    /**
     * セッションデータを保存（個別セッション用）
     * @param {Object} sessionData - 保存するセッションデータ
     */
    saveSession(sessionData) {
        const key = `validation_session_${sessionData.sessionId || this.sessionId}`;
        try {
            localStorage.setItem(key, JSON.stringify(sessionData));
            console.log('💾 セッション保存完了:', key);
            return true;
        } catch (error) {
            console.error('❌ セッション保存失敗:', error);
            return false;
        }
    }
    
    /**
     * セッションデータを読み込み
     * @param {string} sessionId - 読み込むセッションID
     */
    loadSession(sessionId) {
        const key = `validation_session_${sessionId}`;
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('❌ セッション読み込み失敗:', error);
            return null;
        }
    }
    
    /**
     * メトリクスインデックスを更新（検索用）
     */
    updateMetricsIndex() {
        const indexKey = 'validation_metrics_index';
        let index = [];
        
        try {
            const existingIndex = localStorage.getItem(indexKey);
            index = existingIndex ? JSON.parse(existingIndex) : [];
        } catch (error) {
            console.warn('既存インデックス読み込み失敗、新規作成します');
            index = [];
        }
        
        // 現在のセッションを追加（重複回避）
        const existingEntry = index.find(entry => entry.sessionId === this.sessionId);
        if (!existingEntry) {
            index.push({
                sessionId: this.sessionId,
                startTime: this.startTime,
                lastSaved: Date.now(),
                scenario: this.currentMetrics.scenarioSelected,
                rating: this.currentMetrics.usefulnessRating
            });
            
            localStorage.setItem(indexKey, JSON.stringify(index));
        }
    }
    
    /**
     * 全メトリクスセッション取得
     */
    static getAllSessions() {
        const indexKey = 'validation_metrics_index';
        try {
            const index = localStorage.getItem(indexKey);
            return index ? JSON.parse(index) : [];
        } catch (error) {
            console.error('❌ セッション一覧取得失敗:', error);
            return [];
        }
    }
    
    /**
     * メトリクス分析用データエクスポート
     */
    exportData() {
        return {
            sessionInfo: {
                sessionId: this.sessionId,
                startTime: this.startTime,
                endTime: Date.now(),
                duration: Math.round((Date.now() - this.startTime) / 1000)
            },
            metrics: this.currentMetrics,
            events: this.events,
            summary: {
                totalEvents: this.events.length,
                hasScenarioSelection: !!this.currentMetrics.scenarioSelected,
                hasRating: !!this.currentMetrics.usefulnessRating,
                fallbackLevel: this.currentMetrics.fallbackLevel
            }
        };
    }
    
    /**
     * システム情報取得
     */
    getSystemInfo() {
        return {
            version: '1.0.0',
            sessionId: this.sessionId,
            eventsCount: this.events.length,
            startTime: new Date(this.startTime).toISOString(),
            currentMetrics: this.currentMetrics
        };
    }
}

// ブラウザ環境でグローバルに公開
if (typeof window !== 'undefined') {
    window.ValidationMetrics = ValidationMetrics;
    console.log('📊 ValidationMetrics registered to window object');
}

// Node.js環境対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ValidationMetrics;
}

console.log('📊 ValidationMetrics.js loaded successfully - 7日間バリデーションスプリント用メトリクス収集システム');