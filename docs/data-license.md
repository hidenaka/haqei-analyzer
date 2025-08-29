# Data License Information

## License Validator

```javascript
class LicenseValidator {
    checkDataLicense() {
        const licenses = {
            'enhanced_hexagrams_complete.json': {
                source: 'public_domain',
                attribution_required: false,
                commercial_use: true
            },
            'yaoci_31-63.json': {
                source: 'traditional_text',
                attribution_required: true,
                commercial_use: true
            },
            'h384.json': {
                source: 'generated',
                attribution_required: false,
                commercial_use: true
            }
        };
        
        // ライセンス違反チェック
        for (const [file, license] of Object.entries(licenses)) {
            if (!license.commercial_use && this.isCommercialProject()) {
                throw new Error(`License violation: ${file} cannot be used commercially`);
            }
        }
        
        return licenses;
    }

    isCommercialProject() {
        // プロジェクトが商用かどうかを判定するロジック
        return false; // 例: デフォルトで非商用
    }
}
```