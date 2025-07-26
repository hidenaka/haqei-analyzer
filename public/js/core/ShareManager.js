// ShareManager.js - プライバシー対応の共有管理システム
// HaQei Analyzer - Privacy-Aware Share Management System

class ShareManager {
    constructor(options = {}) {
        this.options = {
            expirationDays: 30,
            keyPrefix: 'haqei_share_',
            urlBasePath: '/results',
            enableAnalytics: false,
            enableEncryption: false,
            maxShares: 50, // 最大共有数制限
            ...options
        };
        
        this.initializeCleanupScheduler();
    }

    /**
     * 診断結果の共有URLを生成（タスク11.1）
     * @param {Object} analysisResult - 分析結果データ
     * @param {Object} metadata - 追加メタデータ
     * @returns {Object} 共有情報
     */
    generateShareableURL(analysisResult, metadata = {}) {
        try {
            // 1. 個人情報を除去したデータを作成
            const sanitizedData = this.sanitizeData(analysisResult);
            
            // 2. ランダムで推測困難なIDを生成
            const shareId = this.generateSecureId();
            
            // 3. 有効期限を設定
            const expirationDate = this.calculateExpirationDate();
            
            // 4. 共有データを構築
            const shareData = {
                id: shareId,
                data: sanitizedData,
                metadata: {
                    createdAt: Date.now(),
                    expiresAt: expirationDate.getTime(),
                    version: '1.0',
                    type: 'triple_os_analysis',
                    ...this.sanitizeMetadata(metadata)
                },
                analytics: {
                    viewCount: 0,
                    lastAccessed: null,
                    userAgent: this.options.enableAnalytics ? navigator.userAgent : null
                }
            };

            // 5. ローカルストレージに保存
            if (!this.saveShareData(shareId, shareData)) {
                throw new Error('共有データの保存に失敗しました');
            }

            // 6. 共有URLを生成
            const shareURL = this.buildShareURL(shareId);

            console.log("✅ Share URL generated successfully:", shareId);

            return {
                success: true,
                shareId: shareId,
                shareURL: shareURL,
                expiresAt: expirationDate,
                message: '共有URLが正常に生成されました'
            };

        } catch (error) {
            console.error("❌ Failed to generate share URL:", error);
            return {
                success: false,
                error: error.message,
                message: '共有URLの生成に失敗しました'
            };
        }
    }

    /**
     * 個人情報除去機能（sanitizeData）
     * @param {Object} data - 原始データ
     * @returns {Object} サニタイズされたデータ
     */
    sanitizeData(data) {
        const sanitized = JSON.parse(JSON.stringify(data)); // ディープクローン

        // 除去すべき個人情報のキー
        const sensitiveKeys = [
            'personalInfo',
            'userInfo',
            'email',
            'name',
            'phone',
            'address',
            'ip',
            'sessionId',
            'deviceId',
            'browserFingerprint',
            'gpsLocation',
            'timestamp', // 具体的なタイムスタンプを除去
            'userAgent'
        ];

        // 再帰的に敏感な情報を除去
        this.recursivelyRemoveSensitiveData(sanitized, sensitiveKeys);

        // 特定のフィールドをハッシュ化または匿名化
        if (sanitized.metadata) {
            delete sanitized.metadata.userId;
            delete sanitized.metadata.sessionId;
            // タイムスタンプを日付のみに変更
            if (sanitized.metadata.createdAt) {
                sanitized.metadata.createdAt = new Date(sanitized.metadata.createdAt).toDateString();
            }
        }

        // 質問と回答のペアをランダム化（任意）
        if (this.options.anonymizeAnswers && sanitized.responses) {
            sanitized.responses = this.anonymizeResponses(sanitized.responses);
        }

        return sanitized;
    }

    /**
     * 再帰的に敏感なデータを除去
     */
    recursivelyRemoveSensitiveData(obj, sensitiveKeys) {
        if (typeof obj !== 'object' || obj === null) return;

        Object.keys(obj).forEach(key => {
            if (sensitiveKeys.includes(key)) {
                delete obj[key];
            } else if (typeof obj[key] === 'object') {
                this.recursivelyRemoveSensitiveData(obj[key], sensitiveKeys);
            }
        });
    }

    /**
     * メタデータをサニタイズ
     */
    sanitizeMetadata(metadata) {
        const safe = {};
        const allowedKeys = ['title', 'description', 'tags', 'category'];
        
        allowedKeys.forEach(key => {
            if (metadata[key]) {
                safe[key] = metadata[key];
            }
        });

        return safe;
    }

    /**
     * 質問回答を匿名化
     */
    anonymizeResponses(responses) {
        // 回答パターンは保持しつつ、具体的な内容を削除
        return responses.map(response => ({
            questionId: response.questionId,
            answerIndex: response.answerIndex,
            // 具体的な回答テキストは除去
        }));
    }

    /**
     * ランダムで推測困難なID生成
     * @returns {string} セキュアなランダムID
     */
    generateSecureId() {
        // 複数の乱数ソースを組み合わせてセキュリティを向上
        const timestamp = Date.now().toString(36);
        const randomPart1 = Math.random().toString(36).substring(2);
        const randomPart2 = Math.random().toString(36).substring(2);
        
        // Crypto APIが利用可能な場合はより安全な乱数を使用
        let cryptoRandom = '';
        if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint8Array(16);
            window.crypto.getRandomValues(array);
            cryptoRandom = Array.from(array, byte => byte.toString(36)).join('');
        }

        // 組み合わせてハッシュ化
        const combined = `${timestamp}-${randomPart1}-${randomPart2}-${cryptoRandom}`;
        
        // 簡易ハッシュ（本格的な暗号化ライブラリが望ましい）
        return this.simpleHash(combined).substring(0, 16);
    }

    /**
     * 簡易ハッシュ関数
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit整数に変換
        }
        return Math.abs(hash).toString(36);
    }

    /**
     * 有効期限を計算
     * @returns {Date} 有効期限
     */
    calculateExpirationDate() {
        const expiration = new Date();
        expiration.setDate(expiration.getDate() + this.options.expirationDays);
        return expiration;
    }

    /**
     * ローカルストレージに共有データを保存
     * @param {string} shareId - 共有ID
     * @param {Object} shareData - 共有データ
     * @returns {boolean} 保存成功可否
     */
    saveShareData(shareId, shareData) {
        try {
            // 既存の共有数をチェック
            if (this.getShareCount() >= this.options.maxShares) {
                this.cleanupOldestShares();
            }

            const key = this.options.keyPrefix + shareId;
            const dataString = JSON.stringify(shareData);
            
            // ストレージ容量をチェック
            if (this.getStorageSize() + dataString.length > this.getMaxStorageSize()) {
                this.cleanupOldShares(5); // 古い共有を5個削除
            }

            localStorage.setItem(key, dataString);
            
            // インデックスに追加
            this.addToShareIndex(shareId, shareData.metadata.expiresAt);
            
            return true;
        } catch (error) {
            console.error("Failed to save share data:", error);
            return false;
        }
    }

    /**
     * 共有インデックスに追加
     */
    addToShareIndex(shareId, expiresAt) {
        const indexKey = this.options.keyPrefix + 'index';
        let index = [];
        
        try {
            const existing = localStorage.getItem(indexKey);
            if (existing) {
                index = JSON.parse(existing);
            }
        } catch (error) {
            console.warn("Failed to load share index:", error);
        }

        index.push({
            id: shareId,
            expiresAt: expiresAt,
            createdAt: Date.now()
        });

        // 期限切れのエントリを削除
        index = index.filter(item => item.expiresAt > Date.now());

        try {
            localStorage.setItem(indexKey, JSON.stringify(index));
        } catch (error) {
            console.error("Failed to save share index:", error);
        }
    }

    /**
     * 共有URLを構築
     * @param {string} shareId - 共有ID
     * @returns {string} 完全な共有URL
     */
    buildShareURL(shareId) {
        const baseUrl = window.location.origin;
        return `${baseUrl}${this.options.urlBasePath}?share=${shareId}`;
    }

    /**
     * 共有データを取得（タスク11.2の期限管理）
     * @param {string} shareId - 共有ID
     * @returns {Object} 共有データまたはエラー情報
     */
    getSharedData(shareId) {
        try {
            const key = this.options.keyPrefix + shareId;
            const dataString = localStorage.getItem(key);
            
            if (!dataString) {
                return {
                    success: false,
                    error: 'NOT_FOUND',
                    message: '指定された共有URLが見つかりません。'
                };
            }

            const shareData = JSON.parse(dataString);
            const now = Date.now();

            // 有効期限をチェック
            if (shareData.metadata.expiresAt < now) {
                // 期限切れのデータを削除
                this.deleteShareData(shareId);
                
                return {
                    success: false,
                    error: 'EXPIRED',
                    message: 'この共有URLは有効期限が切れています。',
                    expiredAt: new Date(shareData.metadata.expiresAt)
                };
            }

            // アクセス統計を更新
            shareData.analytics.viewCount++;
            shareData.analytics.lastAccessed = now;
            
            // 更新されたデータを保存
            localStorage.setItem(key, JSON.stringify(shareData));

            return {
                success: true,
                data: shareData.data,
                metadata: shareData.metadata,
                analytics: shareData.analytics
            };

        } catch (error) {
            console.error("Failed to get shared data:", error);
            return {
                success: false,
                error: 'SYSTEM_ERROR',
                message: 'データの取得中にエラーが発生しました。'
            };
        }
    }

    /**
     * 共有データを削除
     * @param {string} shareId - 共有ID
     */
    deleteShareData(shareId) {
        try {
            const key = this.options.keyPrefix + shareId;
            localStorage.removeItem(key);
            this.removeFromShareIndex(shareId);
            console.log("Share data deleted:", shareId);
        } catch (error) {
            console.error("Failed to delete share data:", error);
        }
    }

    /**
     * 共有インデックスから削除
     */
    removeFromShareIndex(shareId) {
        const indexKey = this.options.keyPrefix + 'index';
        try {
            const existing = localStorage.getItem(indexKey);
            if (existing) {
                let index = JSON.parse(existing);
                index = index.filter(item => item.id !== shareId);
                localStorage.setItem(indexKey, JSON.stringify(index));
            }
        } catch (error) {
            console.error("Failed to update share index:", error);
        }
    }

    /**
     * 期限切れの自動削除機能（タスク11.2）
     */
    cleanupExpiredShares() {
        const indexKey = this.options.keyPrefix + 'index';
        let deletedCount = 0;
        
        try {
            const existing = localStorage.getItem(indexKey);
            if (!existing) return deletedCount;

            const index = JSON.parse(existing);
            const now = Date.now();
            const validShares = [];

            index.forEach(item => {
                if (item.expiresAt < now) {
                    // 期限切れのデータを削除
                    this.deleteShareData(item.id);
                    deletedCount++;
                } else {
                    validShares.push(item);
                }
            });

            // インデックスを更新
            localStorage.setItem(indexKey, JSON.stringify(validShares));
            
            if (deletedCount > 0) {
                console.log(`🧹 Cleaned up ${deletedCount} expired shares`);
            }

        } catch (error) {
            console.error("Failed to cleanup expired shares:", error);
        }

        return deletedCount;
    }

    /**
     * クリーンアップスケジューラーを初期化
     */
    initializeCleanupScheduler() {
        // ページ読み込み時にクリーンアップを実行
        this.cleanupExpiredShares();
        
        // 定期的なクリーンアップ（1時間ごと）
        this.cleanupInterval = setInterval(() => {
            this.cleanupExpiredShares();
        }, 60 * 60 * 1000); // 1時間
    }

    /**
     * 古い共有データを削除
     */
    cleanupOldShares(count = 10) {
        const indexKey = this.options.keyPrefix + 'index';
        try {
            const existing = localStorage.getItem(indexKey);
            if (!existing) return;

            let index = JSON.parse(existing);
            // 作成日時でソート（古い順）
            index.sort((a, b) => a.createdAt - b.createdAt);

            // 古いものから削除
            for (let i = 0; i < Math.min(count, index.length); i++) {
                this.deleteShareData(index[i].id);
            }

        } catch (error) {
            console.error("Failed to cleanup old shares:", error);
        }
    }

    /**
     * 最も古い共有を削除
     */
    cleanupOldestShares(count = 5) {
        this.cleanupOldShares(count);
    }

    /**
     * 現在の共有数を取得
     */
    getShareCount() {
        const indexKey = this.options.keyPrefix + 'index';
        try {
            const existing = localStorage.getItem(indexKey);
            if (!existing) return 0;
            const index = JSON.parse(existing);
            return index.length;
        } catch (error) {
            return 0;
        }
    }

    /**
     * ストレージ使用量を取得
     */
    getStorageSize() {
        let total = 0;
        for (let key in localStorage) {
            if (key.startsWith(this.options.keyPrefix)) {
                total += localStorage[key].length;
            }
        }
        return total;
    }

    /**
     * 最大ストレージサイズを取得
     */
    getMaxStorageSize() {
        // ローカルストレージの一般的な制限は5MB
        return 5 * 1024 * 1024; // 5MB
    }

    /**
     * すべての共有データをリスト
     */
    listShares() {
        const indexKey = this.options.keyPrefix + 'index';
        try {
            const existing = localStorage.getItem(indexKey);
            if (!existing) return [];
            return JSON.parse(existing);
        } catch (error) {
            console.error("Failed to list shares:", error);
            return [];
        }
    }

    /**
     * 診断結果の共有統計を取得
     */
    getShareStatistics() {
        const shares = this.listShares();
        const now = Date.now();
        
        return {
            totalShares: shares.length,
            activeShares: shares.filter(s => s.expiresAt > now).length,
            expiredShares: shares.filter(s => s.expiresAt <= now).length,
            storageUsed: this.getStorageSize(),
            oldestShare: shares.length > 0 ? new Date(Math.min(...shares.map(s => s.createdAt))) : null,
            newestShare: shares.length > 0 ? new Date(Math.max(...shares.map(s => s.createdAt))) : null
        };
    }

    /**
     * システムを破棄
     */
    destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }

    /**
     * 期限切れ時の適切なメッセージを生成（タスク11.2）
     */
    generateExpirationMessage(expiredAt) {
        const now = new Date();
        const expired = new Date(expiredAt);
        const daysSinceExpiration = Math.floor((now - expired) / (1000 * 60 * 60 * 24));

        let message = `この共有URLは ${expired.toLocaleDateString('ja-JP')} に有効期限が切れています。`;
        
        if (daysSinceExpiration === 0) {
            message += ' 本日期限切れとなりました。';
        } else if (daysSinceExpiration === 1) {
            message += ' 昨日期限切れとなりました。';
        } else {
            message += ` ${daysSinceExpiration}日前に期限切れとなりました。`;
        }

        message += '\n\n再度診断を実行して、新しい共有URLを生成してください。';

        return message;
    }
}

export default ShareManager;