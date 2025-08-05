// DiagnosisHistoryManager.js - 診断履歴管理機能
// HaQei Analyzer - Diagnosis History Management System

class DiagnosisHistoryManager {
    constructor(options = {}) {
        this.options = {
            maxHistoryCount: 10,
            retentionDays: 90,
            keyPrefix: 'haqei_history_',
            enableComparison: true,
            enableTrends: true,
            autoCleanup: true,
            encryptData: false,
            ...options
        };
        
        this.storageKey = this.options.keyPrefix + 'records';
        this.metadataKey = this.options.keyPrefix + 'metadata';
        
        if (this.options.autoCleanup) {
            this.initializeCleanupScheduler();
        }
    }

    /**
     * 診断結果を履歴に保存
     * @param {Object} analysisResult - 分析結果
     * @param {Object} metadata - メタデータ
     * @returns {string} 履歴レコードID
     */
    saveToHistory(analysisResult, metadata = {}) {
        try {
            const recordId = this.generateRecordId();
            const timestamp = Date.now();
            
            const record = {
                id: recordId,
                timestamp: timestamp,
                date: new Date(timestamp).toISOString(),
                analysisResult: this.sanitizeAnalysisResult(analysisResult),
                metadata: {
                    version: '1.0',
                    userAgent: navigator.userAgent,
                    screenResolution: `${screen.width}x${screen.height}`,
                    language: navigator.language,
                    ...this.sanitizeMetadata(metadata)
                },
                summary: this.generateSummary(analysisResult)
            };

            // 暗号化オプション
            if (this.options.encryptData) {
                record.analysisResult = this.encryptData(record.analysisResult);
            }

            // 既存の履歴を取得
            const history = this.getHistory();
            
            // 新しいレコードを追加
            history.unshift(record);
            
            // 最大件数制限
            if (history.length > this.options.maxHistoryCount) {
                history.splice(this.options.maxHistoryCount);
            }

            // 保存
            localStorage.setItem(this.storageKey, JSON.stringify(history));
            
            // メタデータを更新
            this.updateMetadata(recordId);
            
            console.log("✅ Diagnosis saved to history:", recordId);
            return recordId;
            
        } catch (error) {
            console.error("❌ Failed to save to history:", error);
            throw error;
        }
    }

    /**
     * 履歴を取得
     * @returns {Array} 履歴レコードの配列
     */
    getHistory() {
        try {
            const historyData = localStorage.getItem(this.storageKey);
            if (!historyData) return [];
            
            const history = JSON.parse(historyData);
            
            // 期限切れレコードを除去
            const cutoffDate = Date.now() - (this.options.retentionDays * 24 * 60 * 60 * 1000);
            const validHistory = history.filter(record => record.timestamp > cutoffDate);
            
            // 復号化オプション
            if (this.options.encryptData) {
                validHistory.forEach(record => {
                    record.analysisResult = this.decryptData(record.analysisResult);
                });
            }
            
            return validHistory;
            
        } catch (error) {
            console.error("❌ Failed to get history:", error);
            return [];
        }
    }

    /**
     * 特定の履歴レコードを取得
     * @param {string} recordId - レコードID
     * @returns {Object|null} 履歴レコード
     */
    getRecord(recordId) {
        const history = this.getHistory();
        return history.find(record => record.id === recordId) || null;
    }

    /**
     * 履歴レコードを削除
     * @param {string} recordId - レコードID
     * @returns {boolean} 削除成功可否
     */
    deleteRecord(recordId) {
        try {
            const history = this.getHistory();
            const filteredHistory = history.filter(record => record.id !== recordId);
            
            localStorage.setItem(this.storageKey, JSON.stringify(filteredHistory));
            this.updateMetadata();
            
            console.log("🗑️ History record deleted:", recordId);
            return true;
            
        } catch (error) {
            console.error("❌ Failed to delete record:", error);
            return false;
        }
    }

    /**
     * 履歴を全て削除
     */
    clearHistory() {
        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.metadataKey);
            
            console.log("🗑️ All history cleared");
            return true;
            
        } catch (error) {
            console.error("❌ Failed to clear history:", error);
            return false;
        }
    }

    /**
     * 診断結果の比較
     * @param {string} recordId1 - 比較元レコードID
     * @param {string} recordId2 - 比較先レコードID
     * @returns {Object} 比較結果
     */
    compareResults(recordId1, recordId2) {
        if (!this.options.enableComparison) {
            throw new Error('Comparison feature is disabled');
        }

        const record1 = this.getRecord(recordId1);
        const record2 = this.getRecord(recordId2);
        
        if (!record1 || !record2) {
            throw new Error('One or both records not found');
        }

        return {
            record1: {
                id: record1.id,
                date: record1.date,
                summary: record1.summary
            },
            record2: {
                id: record2.id,
                date: record2.date,
                summary: record2.summary
            },
            comparison: {
                timeDifference: this.calculateTimeDifference(record1.timestamp, record2.timestamp),
                consistencyChange: this.compareConsistencyScores(record1.analysisResult, record2.analysisResult),
                osChanges: this.compareOSChanges(record1.analysisResult, record2.analysisResult),
                keyInsights: this.generateComparisonInsights(record1.analysisResult, record2.analysisResult)
            }
        };
    }

    /**
     * トレンド分析
     * @param {number} periodDays - 分析期間（日数）
     * @returns {Object} トレンド分析結果
     */
    analyzeTrends(periodDays = 30) {
        if (!this.options.enableTrends) {
            throw new Error('Trends feature is disabled');
        }

        const history = this.getHistory();
        const cutoffDate = Date.now() - (periodDays * 24 * 60 * 60 * 1000);
        const recentHistory = history.filter(record => record.timestamp > cutoffDate);
        
        if (recentHistory.length < 2) {
            return {
                message: '十分なデータがありません。最低2回の診断結果が必要です。',
                dataPoints: recentHistory.length
            };
        }

        return {
            period: `${periodDays}日間`,
            dataPoints: recentHistory.length,
            consistencyTrend: this.analyzeConsistencyTrend(recentHistory),
            osStabilityTrend: this.analyzeOSStabilityTrend(recentHistory),
            insights: this.generateTrendInsights(recentHistory),
            recommendations: this.generateTrendRecommendations(recentHistory)
        };
    }

    /**
     * 再診断リンクを生成
     * @param {string} recordId - 参照する履歴レコードID
     * @returns {string} 再診断URL
     */
    generateRetestLink(recordId = null) {
        const baseUrl = window.location.origin + window.location.pathname;
        const params = new URLSearchParams();
        
        params.set('action', 'retest');
        if (recordId) {
            params.set('reference', recordId);
        }
        params.set('timestamp', Date.now().toString());
        
        return `${baseUrl}?${params.toString()}`;
    }

    /**
     * 履歴統計を取得
     */
    getStatistics() {
        const history = this.getHistory();
        const metadata = this.getMetadata();
        
        if (history.length === 0) {
            return {
                totalDiagnoses: 0,
                firstDiagnosis: null,
                lastDiagnosis: null,
                averageInterval: null,
                mostCommonOS: null
            };
        }

        const timestamps = history.map(record => record.timestamp).sort((a, b) => a - b);
        const intervals = [];
        for (let i = 1; i < timestamps.length; i++) {
            intervals.push(timestamps[i] - timestamps[i-1]);
        }

        return {
            totalDiagnoses: history.length,
            firstDiagnosis: new Date(timestamps[0]),
            lastDiagnosis: new Date(timestamps[timestamps.length - 1]),
            averageInterval: intervals.length > 0 ? 
                Math.round(intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length / (24 * 60 * 60 * 1000)) : null,
            mostCommonOS: this.findMostCommonOS(history),
            storageUsed: this.calculateStorageUsage(),
            metadata: metadata
        };
    }

    /**
     * データをエクスポート
     * @param {string} format - エクスポート形式 ('json', 'csv')
     * @returns {Object} エクスポート結果
     */
    exportData(format = 'json') {
        const history = this.getHistory();
        const statistics = this.getStatistics();
        
        const exportData = {
            metadata: {
                exportDate: new Date().toISOString(),
                version: '1.0',
                recordCount: history.length
            },
            statistics: statistics,
            records: history
        };

        switch (format) {
            case 'json':
                return {
                    success: true,
                    data: JSON.stringify(exportData, null, 2),
                    filename: `haqei_history_${new Date().toISOString().slice(0, 10)}.json`,
                    mimeType: 'application/json'
                };
                
            case 'csv':
                return {
                    success: true,
                    data: this.convertToCSV(history),
                    filename: `haqei_history_${new Date().toISOString().slice(0, 10)}.csv`,
                    mimeType: 'text/csv'
                };
                
            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }

    /**
     * データをインポート
     * @param {string} data - インポートデータ
     * @param {string} format - データ形式
     * @returns {Object} インポート結果
     */
    importData(data, format = 'json') {
        try {
            let importedRecords = [];
            
            switch (format) {
                case 'json':
                    const jsonData = JSON.parse(data);
                    importedRecords = jsonData.records || [];
                    break;
                    
                default:
                    throw new Error(`Unsupported import format: ${format}`);
            }

            // データの検証
            const validRecords = importedRecords.filter(record => 
                record.id && record.timestamp && record.analysisResult
            );

            // 既存の履歴とマージ
            const existingHistory = this.getHistory();
            const existingIds = new Set(existingHistory.map(record => record.id));
            
            const newRecords = validRecords.filter(record => !existingIds.has(record.id));
            const mergedHistory = [...existingHistory, ...newRecords];
            
            // 日時順でソート
            mergedHistory.sort((a, b) => b.timestamp - a.timestamp);
            
            // 最大件数制限
            if (mergedHistory.length > this.options.maxHistoryCount) {
                mergedHistory.splice(this.options.maxHistoryCount);
            }

            // 保存
            localStorage.setItem(this.storageKey, JSON.stringify(mergedHistory));
            this.updateMetadata();
            
            return {
                success: true,
                importedCount: newRecords.length,
                skippedCount: validRecords.length - newRecords.length,
                totalCount: mergedHistory.length
            };
            
        } catch (error) {
            console.error("❌ Failed to import data:", error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // === プライベートメソッド ===

    /**
     * レコードIDを生成
     */
    generateRecordId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2);
        return `${timestamp}-${random}`;
    }

    /**
     * 分析結果をサニタイズ
     */
    sanitizeAnalysisResult(result) {
        // 個人情報を除去
        const sanitized = JSON.parse(JSON.stringify(result));
        
        // 除去対象キー
        const sensitiveKeys = ['userInfo', 'personalData', 'ip', 'sessionId'];
        
        const removeSensitiveData = (obj) => {
            if (typeof obj !== 'object' || obj === null) return;
            
            Object.keys(obj).forEach(key => {
                if (sensitiveKeys.includes(key)) {
                    delete obj[key];
                } else if (typeof obj[key] === 'object') {
                    removeSensitiveData(obj[key]);
                }
            });
        };
        
        removeSensitiveData(sanitized);
        return sanitized;
    }

    /**
     * メタデータをサニタイズ
     */
    sanitizeMetadata(metadata) {
        const safe = {};
        const allowedKeys = ['title', 'notes', 'tags', 'category'];
        
        allowedKeys.forEach(key => {
            if (metadata[key]) {
                safe[key] = metadata[key];
            }
        });
        
        return safe;
    }

    /**
     * サマリーを生成
     */
    generateSummary(analysisResult) {
        const engineOS = analysisResult.engineOS?.hexagramInfo?.name || '不明';
        const interfaceOS = analysisResult.interfaceOS?.hexagramInfo?.name || '不明';
        const safeModeOS = analysisResult.safeModeOS?.hexagramInfo?.name || '不明';
        const consistency = Math.round((analysisResult.consistencyScore?.overall || 0) * 100);
        
        return {
            engineOS,
            interfaceOS,
            safeModeOS,
            consistencyScore: consistency,
            shortDescription: `${engineOS} | ${interfaceOS} | ${safeModeOS} (一貫性: ${consistency}%)`
        };
    }

    /**
     * メタデータを更新
     */
    updateMetadata(newRecordId = null) {
        const metadata = {
            lastUpdated: Date.now(),
            recordCount: this.getHistory().length,
            version: '1.0'
        };
        
        if (newRecordId) {
            metadata.lastRecordId = newRecordId;
        }
        
        localStorage.setItem(this.metadataKey, JSON.stringify(metadata));
    }

    /**
     * メタデータを取得
     */
    getMetadata() {
        try {
            const data = localStorage.getItem(this.metadataKey);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            return {};
        }
    }

    /**
     * 時間差を計算
     */
    calculateTimeDifference(timestamp1, timestamp2) {
        const diffMs = Math.abs(timestamp1 - timestamp2);
        const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
        const diffHours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        
        if (diffDays > 0) {
            return `${diffDays}日${diffHours}時間`;
        } else {
            return `${diffHours}時間`;
        }
    }

    /**
     * 一貫性スコアを比較
     */
    compareConsistencyScores(result1, result2) {
        const score1 = (result1.consistencyScore?.overall || 0) * 100;
        const score2 = (result2.consistencyScore?.overall || 0) * 100;
        const difference = score2 - score1;
        
        return {
            previous: Math.round(score1),
            current: Math.round(score2),
            difference: Math.round(difference),
            trend: difference > 5 ? 'improved' : difference < -5 ? 'declined' : 'stable'
        };
    }

    /**
     * OS変化を比較
     */
    compareOSChanges(result1, result2) {
        const os1 = {
            engine: result1.engineOS?.hexagramInfo?.name || '不明',
            interface: result1.interfaceOS?.hexagramInfo?.name || '不明',
            safeMode: result1.safeModeOS?.hexagramInfo?.name || '不明'
        };
        
        const os2 = {
            engine: result2.engineOS?.hexagramInfo?.name || '不明',
            interface: result2.interfaceOS?.hexagramInfo?.name || '不明',
            safeMode: result2.safeModeOS?.hexagramInfo?.name || '不明'
        };
        
        return {
            engine: { changed: os1.engine !== os2.engine, from: os1.engine, to: os2.engine },
            interface: { changed: os1.interface !== os2.interface, from: os1.interface, to: os2.interface },
            safeMode: { changed: os1.safeMode !== os2.safeMode, from: os1.safeMode, to: os2.safeMode }
        };
    }

    /**
     * 比較洞察を生成
     */
    generateComparisonInsights(result1, result2) {
        const insights = [];
        
        const consistencyComparison = this.compareConsistencyScores(result1, result2);
        if (consistencyComparison.trend === 'improved') {
            insights.push('人格の一貫性が向上しています。内面と外面の調和が進んでいる可能性があります。');
        } else if (consistencyComparison.trend === 'declined') {
            insights.push('人格の一貫性が低下しています。新しい環境や変化に適応している可能性があります。');
        } else {
            insights.push('人格の一貫性は安定しています。');
        }
        
        const osChanges = this.compareOSChanges(result1, result2);
        const changedCount = Object.values(osChanges).filter(change => change.changed).length;
        
        if (changedCount === 0) {
            insights.push('すべてのOSが安定しており、人格構造に大きな変化はありません。');
        } else if (changedCount === 1) {
            insights.push('一部のOSに変化が見られます。段階的な成長や適応の過程にある可能性があります。');
        } else {
            insights.push('複数のOSに変化が見られます。大きな人生の変化や成長期にある可能性があります。');
        }
        
        return insights;
    }

    /**
     * 一貫性トレンドを分析
     */
    analyzeConsistencyTrend(history) {
        const scores = history.map(record => 
            (record.analysisResult.consistencyScore?.overall || 0) * 100
        ).reverse(); // 古い順に並び替え
        
        if (scores.length < 2) return null;
        
        const trend = scores[scores.length - 1] - scores[0];
        const volatility = this.calculateVolatility(scores);
        
        return {
            scores: scores,
            overallTrend: trend > 5 ? 'improving' : trend < -5 ? 'declining' : 'stable',
            trendValue: Math.round(trend),
            volatility: Math.round(volatility),
            currentScore: Math.round(scores[scores.length - 1])
        };
    }

    /**
     * OS安定性トレンドを分析
     */
    analyzeOSStabilityTrend(history) {
        const osSequences = {
            engine: history.map(r => r.analysisResult.engineOS?.hexagramInfo?.name).reverse(),
            interface: history.map(r => r.analysisResult.interfaceOS?.hexagramInfo?.name).reverse(),
            safeMode: history.map(r => r.analysisResult.safeModeOS?.hexagramInfo?.name).reverse()
        };
        
        const stability = {};
        Object.keys(osSequences).forEach(osType => {
            const sequence = osSequences[osType];
            const changes = sequence.slice(1).filter((os, index) => os !== sequence[index]);
            stability[osType] = {
                changeCount: changes.length,
                stabilityRate: sequence.length > 1 ? (sequence.length - changes.length) / sequence.length : 1,
                currentOS: sequence[sequence.length - 1]
            };
        });
        
        return stability;
    }

    /**
     * ボラティリティを計算
     */
    calculateVolatility(values) {
        if (values.length < 2) return 0;
        
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        
        return Math.sqrt(variance);
    }

    /**
     * 最頻OS を検出
     */
    findMostCommonOS(history) {
        const osCount = {};
        
        history.forEach(record => {
            const engineOS = record.analysisResult.engineOS?.hexagramInfo?.name;
            const interfaceOS = record.analysisResult.interfaceOS?.hexagramInfo?.name;
            const safeModeOS = record.analysisResult.safeModeOS?.hexagramInfo?.name;
            
            [engineOS, interfaceOS, safeModeOS].forEach(os => {
                if (os) {
                    osCount[os] = (osCount[os] || 0) + 1;
                }
            });
        });
        
        const mostCommon = Object.entries(osCount).sort((a, b) => b[1] - a[1])[0];
        return mostCommon ? { name: mostCommon[0], count: mostCommon[1] } : null;
    }

    /**
     * ストレージ使用量を計算
     */
    calculateStorageUsage() {
        const historyData = localStorage.getItem(this.storageKey) || '';
        const metadataData = localStorage.getItem(this.metadataKey) || '';
        
        return {
            bytes: historyData.length + metadataData.length,
            kb: Math.round((historyData.length + metadataData.length) / 1024 * 100) / 100
        };
    }

    /**
     * CSVに変換
     */
    convertToCSV(history) {
        const headers = [
            'ID', '日時', 'エンジンOS', 'インターフェースOS', 'セーフモードOS', '一貫性スコア'
        ];
        
        const rows = history.map(record => [
            record.id,
            new Date(record.timestamp).toLocaleString('ja-JP'),
            record.summary.engineOS,
            record.summary.interfaceOS,
            record.summary.safeModeOS,
            record.summary.consistencyScore
        ]);
        
        return [headers, ...rows].map(row => 
            row.map(cell => `"${cell}"`).join(',')
        ).join('\n');
    }

    /**
     * 簡易暗号化
     */
    encryptData(data) {
        // 実際の実装では適切な暗号化ライブラリを使用
        return btoa(JSON.stringify(data));
    }

    /**
     * 簡易復号化
     */
    decryptData(encryptedData) {
        try {
            return JSON.parse(atob(encryptedData));
        } catch (error) {
            console.error("❌ Failed to decrypt data:", error);
            return null;
        }
    }

    /**
     * クリーンアップスケジューラーを初期化
     */
    initializeCleanupScheduler() {
        // ページ読み込み時にクリーンアップ実行
        this.cleanupExpiredRecords();
        
        // 定期的なクリーンアップ（6時間ごと）
        this.cleanupInterval = setInterval(() => {
            this.cleanupExpiredRecords();
        }, 6 * 60 * 60 * 1000);
    }

    /**
     * 期限切れレコードをクリーンアップ
     */
    cleanupExpiredRecords() {
        try {
            const history = this.getHistory();
            const originalCount = history.length;
            
            // getHistory()は既に期限切れを除去済み
            if (originalCount > history.length) {
                localStorage.setItem(this.storageKey, JSON.stringify(history));
                this.updateMetadata();
                
                console.log(`🧹 Cleaned up ${originalCount - history.length} expired records`);
            }
            
        } catch (error) {
            console.error("❌ Failed to cleanup expired records:", error);
        }
    }

    /**
     * トレンド洞察を生成
     */
    generateTrendInsights(history) {
        const insights = [];
        
        const consistencyTrend = this.analyzeConsistencyTrend(history);
        if (consistencyTrend) {
            if (consistencyTrend.overallTrend === 'improving') {
                insights.push('一貫性スコアが上昇傾向にあります。自己理解が深まっている可能性があります。');
            } else if (consistencyTrend.overallTrend === 'declining') {
                insights.push('一貫性スコアが下降傾向にあります。新しい挑戦や変化の時期かもしれません。');
            }
            
            if (consistencyTrend.volatility > 15) {
                insights.push('一貫性スコアの変動が大きいです。不安定な時期や過渡期にある可能性があります。');
            }
        }
        
        return insights;
    }

    /**
     * トレンド推奨事項を生成
     */
    generateTrendRecommendations(history) {
        const recommendations = [];
        
        const consistencyTrend = this.analyzeConsistencyTrend(history);
        const stabilityTrend = this.analyzeOSStabilityTrend(history);
        
        if (consistencyTrend?.overallTrend === 'declining') {
            recommendations.push('一貫性の低下が見られます。自己理解を深める時間を設けることを推奨します。');
        }
        
        const unstableOSCount = Object.values(stabilityTrend).filter(
            stability => stability.stabilityRate < 0.7
        ).length;
        
        if (unstableOSCount > 1) {
            recommendations.push('複数のOSに変化が見られます。変化を受け入れつつ、核となる価値観を見つめ直してみてください。');
        }
        
        if (history.length >= 5) {
            recommendations.push('定期的な診断を継続されています。この調子で自己成長の記録を続けてください。');
        }
        
        return recommendations;
    }

    /**
     * システム破棄
     */
    destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        console.log("📊 DiagnosisHistoryManager destroyed");
    }
}

export default DiagnosisHistoryManager;