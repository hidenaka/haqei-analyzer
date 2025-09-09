// 実装要件: 緊急データ検証システム
class EmergencyDataValidator extends DataValidator {
    constructor() {
        super();
        this.monitorInterval = null;
        this.alertThreshold = {
            failureRate: 0.2,  // 20%以上の失敗でアラート
            maxRetries: 3
        };
        this.retryCount = {};
    }
    
    startMonitoring(interval = 300000) {  // 5分ごと
        this.monitorInterval = setInterval(() => {
            this.validateAll().then(isValid => {
                if (!isValid) {
                    this.triggerAlert('データ検証失敗');
                }
            });
        }, interval);
        console.log('🛡️ 緊急データ監視開始');
    }
    
    stopMonitoring() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            console.log('🛑 緊急データ監視停止');
        }
    }
    
    async validateWithRetry(file) {
        const key = file.path;
        this.retryCount[key] = this.retryCount[key] || 0;
        
        try {
            const response = await fetch(file.path);
            if (!response.ok) throw new Error('Fetch failed');
            
            const data = await response.json();
            if (file.validate(data)) {
                this.retryCount[key] = 0;
                return data;
            }
            throw new Error('Validation failed');
        } catch (error) {
            this.retryCount[key]++;
            if (this.retryCount[key] >= this.alertThreshold.maxRetries) {
                this.triggerAlert(`ファイル${key}の複数回失敗`);
                if (file.fallback) {
                    return file.fallback();
                }
            }
            // 即時リトライ
            if (this.retryCount[key] < this.alertThreshold.maxRetries) {
                return this.validateWithRetry(file);
            }
            throw error;
        }
    }
    
    triggerAlert(message) {
        console.error(`🚨 アラート: ${message}`);
        // ここに通知システム統合（例: Email, Slack）
        // 例: fetch('/api/alert', { method: 'POST', body: JSON.stringify({message}) });
    }
    
    getStatus() {
        return {
            mode: 'emergency',
            lastValidation: this.validationResults.timestamp,
            health: this.validationResults.isValid ? 'healthy' : 'degraded',
            retries: this.retryCount
        };
    }
}

// 自動起動
window.addEventListener('DOMContentLoaded', () => {
    const emergencyValidator = new EmergencyDataValidator();
    emergencyValidator.startMonitoring();
    // FallbackModeとの統合（オプション）
});