/**
 * DataCompressionManager.js
 * 古いデータの圧縮と現在のデータの保護を行うシステム
 * Storage容量の最適化とパフォーマンス向上を実現
 */

class DataCompressionManager {
    constructor() {
        this.storageKey = 'haqei_compressed_data';
        this.currentDataKey = 'haqei_current_data';
        this.compressionThreshold = 7; // 7日より古いデータを圧縮対象
        this.maxCompressedEntries = 100; // 圧縮データの最大保存数
        
        console.log('📦 DataCompressionManager initialized');
    }

    /**
     * 古いデータを圧縮して現在のデータを保護
     */
    compressOldDataKeepCurrent() {
        console.log('🗜️ Starting data compression process...');
        
        try {
            // 現在のデータを取得
            const currentAnswers = this.getCurrentAnswers();
            const currentAnalysis = this.getCurrentAnalysis();
            
            // 古いデータを特定
            const oldData = this.identifyOldData();
            
            if (oldData.length === 0) {
                console.log('ℹ️ No old data found to compress');
                return { compressed: 0, current: currentAnswers.length };
            }
            
            // データを圧縮
            const compressedData = this.compressData(oldData);
            
            // 圧縮データを保存
            this.saveCompressedData(compressedData);
            
            // 現在のデータを保護して保存
            this.saveCurrentData({
                answers: currentAnswers,
                analysis: currentAnalysis,
                timestamp: Date.now(),
                protected: true
            });
            
            // 古いデータをクリーンアップ
            this.cleanupOldData(oldData);
            
            console.log(`✅ Compression completed: ${oldData.length} old entries compressed, ${currentAnswers.length} current entries protected`);
            
            return {
                compressed: oldData.length,
                current: currentAnswers.length,
                storageReduced: this.calculateStorageReduction(oldData, compressedData)
            };
            
        } catch (error) {
            console.error('❌ Data compression failed:', error);
            return { error: error.message };
        }
    }

    /**
     * 現在のアクティブな回答データを取得
     */
    getCurrentAnswers() {
        try {
            const answers = JSON.parse(localStorage.getItem('haqei_answers') || '[]');
            const currentSession = JSON.parse(localStorage.getItem('haqei_current_session') || '{}');
            
            // 現在のセッションの回答のみを抽出
            const currentAnswers = answers.filter(answer => {
                if (!answer.timestamp) return true; // タイムスタンプがない場合は現在のデータとして扱う
                
                const answerTime = new Date(answer.timestamp);
                const now = new Date();
                const daysDiff = (now - answerTime) / (1000 * 60 * 60 * 24);
                
                return daysDiff <= this.compressionThreshold;
            });
            
            console.log(`📋 Current answers identified: ${currentAnswers.length} entries`);
            return currentAnswers;
            
        } catch (error) {
            console.warn('⚠️ Error getting current answers:', error);
            return [];
        }
    }

    /**
     * 現在の分析結果を取得
     */
    getCurrentAnalysis() {
        try {
            const analysisKeys = [
                'haqei_analysis_results',
                'haqei_triple_os_analysis',
                'haqei_strategic_insights',
                'haqei_personality_construction'
            ];
            
            const currentAnalysis = {};
            
            analysisKeys.forEach(key => {
                const data = localStorage.getItem(key);
                if (data) {
                    try {
                        const parsedData = JSON.parse(data);
                        if (parsedData.timestamp) {
                            const dataTime = new Date(parsedData.timestamp);
                            const now = new Date();
                            const daysDiff = (now - dataTime) / (1000 * 60 * 60 * 24);
                            
                            if (daysDiff <= this.compressionThreshold) {
                                currentAnalysis[key] = parsedData;
                            }
                        } else {
                            // タイムスタンプがない場合は現在のデータとして扱う
                            currentAnalysis[key] = parsedData;
                        }
                    } catch (parseError) {
                        console.warn(`⚠️ Error parsing ${key}:`, parseError);
                    }
                }
            });
            
            console.log(`🔬 Current analysis data: ${Object.keys(currentAnalysis).length} entries`);
            return currentAnalysis;
            
        } catch (error) {
            console.warn('⚠️ Error getting current analysis:', error);
            return {};
        }
    }

    /**
     * 古いデータを特定
     */
    identifyOldData() {
        const oldData = [];
        const threshold = new Date();
        threshold.setDate(threshold.getDate() - this.compressionThreshold);
        
        try {
            // LocalStorageの全てのキーをチェック
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                
                if (key && key.startsWith('haqei_')) {
                    const data = localStorage.getItem(key);
                    
                    try {
                        const parsedData = JSON.parse(data);
                        
                        if (parsedData.timestamp) {
                            const dataTime = new Date(parsedData.timestamp);
                            
                            if (dataTime < threshold) {
                                oldData.push({
                                    key: key,
                                    data: parsedData,
                                    size: data.length,
                                    timestamp: dataTime
                                });
                            }
                        }
                    } catch (parseError) {
                        // JSON以外のデータは古いデータとして扱わない
                        continue;
                    }
                }
            }
            
            console.log(`🗂️ Old data identified: ${oldData.length} entries older than ${this.compressionThreshold} days`);
            return oldData;
            
        } catch (error) {
            console.warn('⚠️ Error identifying old data:', error);
            return [];
        }
    }

    /**
     * データを圧縮
     */
    compressData(dataArray) {
        try {
            // データを日付でグループ化
            const groupedData = {};
            
            dataArray.forEach(item => {
                const dateKey = item.timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
                
                if (!groupedData[dateKey]) {
                    groupedData[dateKey] = [];
                }
                
                groupedData[dateKey].push({
                    key: item.key,
                    data: item.data,
                    originalSize: item.size
                });
            });
            
            // グループごとに圧縮
            const compressedGroups = {};
            let totalOriginalSize = 0;
            let totalCompressedSize = 0;
            
            Object.keys(groupedData).forEach(dateKey => {
                const groupData = groupedData[dateKey];
                const originalGroupSize = groupData.reduce((sum, item) => sum + item.originalSize, 0);
                
                // データを圧縮（重複削除、不要フィールド削除）
                const compressedGroup = this.compressGroupData(groupData);
                const compressedGroupSize = JSON.stringify(compressedGroup).length;
                
                compressedGroups[dateKey] = {
                    data: compressedGroup,
                    originalSize: originalGroupSize,
                    compressedSize: compressedGroupSize,
                    compressionRatio: ((originalGroupSize - compressedGroupSize) / originalGroupSize * 100).toFixed(1)
                };
                
                totalOriginalSize += originalGroupSize;
                totalCompressedSize += compressedGroupSize;
            });
            
            const overallCompressionRatio = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);
            
            console.log(`🗜️ Data compressed: ${totalOriginalSize} bytes → ${totalCompressedSize} bytes (${overallCompressionRatio}% reduction)`);
            
            return {
                compressedGroups: compressedGroups,
                metadata: {
                    compressionDate: new Date().toISOString(),
                    originalSize: totalOriginalSize,
                    compressedSize: totalCompressedSize,
                    compressionRatio: overallCompressionRatio,
                    entriesCompressed: dataArray.length
                }
            };
            
        } catch (error) {
            console.error('❌ Data compression error:', error);
            return null;
        }
    }

    /**
     * グループデータを圧縮
     */
    compressGroupData(groupData) {
        try {
            const compressed = {
                entries: [],
                summary: {
                    totalEntries: groupData.length,
                    dataTypes: {}
                }
            };
            
            groupData.forEach(item => {
                // 重要なデータのみを抽出
                const essentialData = this.extractEssentialData(item.data);
                
                compressed.entries.push({
                    key: item.key.replace('haqei_', ''), // プレフィックス削除
                    data: essentialData
                });
                
                // データタイプの統計
                const dataType = item.key.split('_')[1] || 'unknown';
                compressed.summary.dataTypes[dataType] = (compressed.summary.dataTypes[dataType] || 0) + 1;
            });
            
            return compressed;
            
        } catch (error) {
            console.error('❌ Group data compression error:', error);
            return { entries: [], summary: { error: error.message } };
        }
    }

    /**
     * 必要最小限のデータを抽出
     */
    extractEssentialData(data) {
        if (!data || typeof data !== 'object') {
            return data;
        }
        
        const essential = {};
        
        // 重要なフィールドのみを保持
        const importantFields = [
            'questionId', 'selectedValue', 'selectedChoice', 'choiceText',
            'engineOS', 'interfaceOS', 'safeModeOS',
            'analysisResults', 'insights', 'recommendations',
            'timestamp', 'sessionId'
        ];
        
        importantFields.forEach(field => {
            if (data.hasOwnProperty(field)) {
                essential[field] = data[field];
            }
        });
        
        // 配列データの圧縮
        if (Array.isArray(data)) {
            return data.map(item => this.extractEssentialData(item));
        }
        
        return Object.keys(essential).length > 0 ? essential : data;
    }

    /**
     * 圧縮データを保存
     */
    saveCompressedData(compressedData) {
        try {
            if (!compressedData) {
                throw new Error('No compressed data to save');
            }
            
            // 既存の圧縮データを取得
            const existingCompressed = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            
            // 新しい圧縮データを追加
            const updatedCompressed = {
                ...existingCompressed,
                ...compressedData.compressedGroups,
                _metadata: {
                    ...existingCompressed._metadata,
                    lastCompressionDate: compressedData.metadata.compressionDate,
                    totalCompressedEntries: (existingCompressed._metadata?.totalCompressedEntries || 0) + compressedData.metadata.entriesCompressed
                }
            };
            
            // 最大エントリ数を超えた場合は古いものを削除
            const compressedKeys = Object.keys(updatedCompressed).filter(key => !key.startsWith('_'));
            if (compressedKeys.length > this.maxCompressedEntries) {
                compressedKeys.sort().slice(0, compressedKeys.length - this.maxCompressedEntries).forEach(key => {
                    delete updatedCompressed[key];
                });
            }
            
            localStorage.setItem(this.storageKey, JSON.stringify(updatedCompressed));
            console.log('💾 Compressed data saved successfully');
            
        } catch (error) {
            console.error('❌ Error saving compressed data:', error);
        }
    }

    /**
     * 現在のデータを保護して保存
     */
    saveCurrentData(currentData) {
        try {
            const protectedData = {
                ...currentData,
                protected: true,
                lastUpdate: new Date().toISOString()
            };
            
            localStorage.setItem(this.currentDataKey, JSON.stringify(protectedData));
            console.log('🛡️ Current data protected and saved');
            
        } catch (error) {
            console.error('❌ Error saving current data:', error);
        }
    }

    /**
     * 古いデータをクリーンアップ
     */
    cleanupOldData(oldDataArray) {
        try {
            let cleanedCount = 0;
            
            oldDataArray.forEach(item => {
                localStorage.removeItem(item.key);
                cleanedCount++;
            });
            
            console.log(`🧹 Cleaned up ${cleanedCount} old data entries`);
            
        } catch (error) {
            console.error('❌ Error cleaning up old data:', error);
        }
    }

    /**
     * ストレージ容量削減量を計算
     */
    calculateStorageReduction(oldData, compressedData) {
        if (!compressedData || !compressedData.metadata) {
            return { error: 'No compression metadata available' };
        }
        
        const originalSize = compressedData.metadata.originalSize;
        const compressedSize = compressedData.metadata.compressedSize;
        const reduction = originalSize - compressedSize;
        const reductionPercentage = (reduction / originalSize * 100).toFixed(1);
        
        return {
            originalSize: this.formatBytes(originalSize),
            compressedSize: this.formatBytes(compressedSize),
            reduction: this.formatBytes(reduction),
            reductionPercentage: reductionPercentage + '%'
        };
    }

    /**
     * バイト数を読みやすい形式にフォーマット
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * 圧縮データの統計情報を取得
     */
    getCompressionStats() {
        try {
            const compressedData = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            const currentData = JSON.parse(localStorage.getItem(this.currentDataKey) || '{}');
            
            const stats = {
                compressed: {
                    totalGroups: Object.keys(compressedData).filter(key => !key.startsWith('_')).length,
                    totalEntries: compressedData._metadata?.totalCompressedEntries || 0,
                    lastCompressionDate: compressedData._metadata?.lastCompressionDate || null
                },
                current: {
                    answersCount: currentData.answers?.length || 0,
                    analysisCount: Object.keys(currentData.analysis || {}).length,
                    lastUpdate: currentData.lastUpdate || null,
                    protected: currentData.protected || false
                },
                storage: {
                    compressedSize: this.formatBytes(JSON.stringify(compressedData).length),
                    currentSize: this.formatBytes(JSON.stringify(currentData).length)
                }
            };
            
            return stats;
            
        } catch (error) {
            console.error('❌ Error getting compression stats:', error);
            return { error: error.message };
        }
    }

    /**
     * 自動圧縮の実行（定期的な実行用）
     */
    autoCompress() {
        console.log('🤖 Auto compression started');
        return this.compressOldDataKeepCurrent();
    }
}

// グローバル変数として公開
if (typeof window !== 'undefined') {
    window.DataCompressionManager = DataCompressionManager;
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataCompressionManager;
}

console.log('📦 DataCompressionManager loaded successfully');