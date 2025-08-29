// 実装要件: データライセンス管理の最小実装
class LicenseValidator {
    constructor() {
        this.dataLicenses = {
            'h384.json': {
                source: 'Original Yi Jing Database',
                license: 'CC-BY-NC 4.0',
                attributionRequired: true,
                commercialUse: false,
                notes: 'Non-commercial use only'
            },
            'enhanced_hexagrams_complete.json': {
                source: 'Enhanced Hexagram Collection',
                license: 'MIT',
                attributionRequired: false,
                commercialUse: true,
                notes: 'Freely usable with no restrictions'
            },
            'yaoci_31-63.json': {
                source: 'Yaoci Supplementary Data',
                license: 'GPL-3.0',
                attributionRequired: true,
                commercialUse: true,
                notes: 'Source code must be open if modified'
            }
            // 追加のデータファイルはここに
        };
        
        this.validationResults = {
            timestamp: null,
            licenses: {},
            compliance: true,
            issues: []
        };
    }
    
    validateLicenses(isCommercial = false) {
        console.log('📜 ライセンス検証開始...');
        this.validationResults.timestamp = Date.now();
        let compliant = true;
        
        Object.entries(this.dataLicenses).forEach(([file, info]) => {
            const checks = {
                attribution: info.attributionRequired ? 'Required' : 'Not required',
                commercial: info.commercialUse ? 'Allowed' : 'Prohibited'
            };
            
            let fileCompliant = true;
            if (isCommercial && !info.commercialUse) {
                compliant = false;
                fileCompliant = false;
                this.validationResults.issues.push(`❌ ${file}: Commercial use prohibited under ${info.license}`);
            }
            
            this.validationResults.licenses[file] = {
                ...info,
                checks,
                compliant: fileCompliant
            };
        });
        
        this.validationResults.compliance = compliant;
        
        // 結果記録
        console.table(this.validationResults.licenses);
        localStorage.setItem('licenseValidation', JSON.stringify(this.validationResults));
        
        return compliant;
    }
    
    getAttributionText() {
        return Object.entries(this.dataLicenses)
            .filter(([_, info]) => info.attributionRequired)
            .map(([file, info]) => `${file}: Licensed under ${info.license} from ${info.source}`)
            .join('\n');
    }
    
    checkCommercialCompliance() {
        return this.validateLicenses(true);
    }
}

// 自動実行
window.addEventListener('DOMContentLoaded', () => {
    const validator = new LicenseValidator();
    const isCompliant = validator.checkCommercialCompliance();
    
    if (!isCompliant) {
        console.warn('⚠️ ライセンス違反の可能性あり');
        // UI警告表示（オプション）
    }
    
    // フッターに帰属表示追加（例）
    const footer = document.querySelector('footer');
    if (footer) {
        footer.innerHTML += `<p style="font-size: 0.8em;">${validator.getAttributionText().replace(/\n/g, '<br>')}</p>`;
    }
});