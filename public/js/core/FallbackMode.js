// 実装要件: 縮退運転の最小機能定義
class FallbackMode {
    constructor() {
        this.mode = 'normal';  // normal, degraded, minimal
        this.capabilities = {
            normal: {
                features: ['full-analysis', 'advanced-search', 'ml-prediction'],
                dataRequirements: ['h384', 'hexagrams', 'yaoci']
            },
            degraded: {
                features: ['basic-analysis', 'simple-search'],
                dataRequirements: ['h384', 'hexagrams']
            },
            minimal: {
                features: ['static-lookup'],
                dataRequirements: ['h384']
            }
        };
        
        this.currentCapabilities = this.capabilities.normal;
    }
    
    determineMode(validationResults) {
        const availableData = Object.entries(validationResults.files)
            .filter(([_, info]) => info.exists && info.valid)
            .map(([path]) => path.split('/').pop().split('.')[0]);
        
        if (this.checkRequirements('normal', availableData)) {
            this.mode = 'normal';
        } else if (this.checkRequirements('degraded', availableData)) {
            this.mode = 'degraded';
        } else if (this.checkRequirements('minimal', availableData)) {
            this.mode = 'minimal';
        } else {
            this.mode = 'offline';
            console.error('❌ 最小データ要件未達 - オフラインモード');
            return false;
        }
        
        this.currentCapabilities = this.capabilities[this.mode];
        console.log(`🛡️ 運用モード: ${this.mode}`);
        this.notifyUser();
        return true;
    }
    
    checkRequirements(mode, available) {
        return this.capabilities[mode].dataRequirements.every(req => available.includes(req));
    }
    
    isFeatureAvailable(feature) {
        return this.currentCapabilities.features.includes(feature);
    }
    
    notifyUser() {
        if (this.mode !== 'normal') {
            const message = `⚠️ ${this.mode.toUpperCase()}モード: 一部機能が制限されています。利用可能: ${this.currentCapabilities.features.join(', ')}`;
            // UI通知（例: Toast or Banner）
            const banner = document.createElement('div');
            banner.className = 'fallback-banner';
            banner.textContent = message;
            banner.style = 'background: #ffd700; padding: 10px; position: fixed; top: 0; width: 100%; z-index: 999;';
            document.body.appendChild(banner);
        }
    }
}

// DataValidatorとの統合例
window.addEventListener('DOMContentLoaded', () => {
    // 仮定: validatorはDataValidatorインスタンス
    validator.validateAll().then(isValid => {
        const fallback = new FallbackMode();
        fallback.determineMode(validator.validationResults);
    });
});