// 実装要件: 即座にクラッシュを防ぐ最小実装
class DataValidator {
    constructor() {
        this.criticalFiles = [
            {
                path: '/data/h384.json',
                fallback: this.generateMinimalH384Data,
                validate: (data) => Array.isArray(data) && data.length === 384
            },
            {
                path: '/data/enhanced_hexagrams_complete.json',
                fallback: this.generateBasicHexagrams,
                validate: (data) => Array.isArray(data) && data.length === 64
            },
            {
                path: '/data/yaoci_31-63.json',
                fallback: null,  // フォールバック不可（必須）
                validate: (data) => Array.isArray(data)
            }
        ];
        
        this.validationResults = {
            timestamp: null,
            files: {},
            isValid: false,
            fallbacksUsed: []
        };
    }
    
    async validateAll() {
        console.log('🔍 緊急データ検証開始...');
        this.validationResults.timestamp = Date.now();
        let allValid = true;
        
        for (const file of this.criticalFiles) {
            try {
                const response = await fetch(file.path);
                if (!response.ok) throw new Error(`404: ${file.path}`);
                
                const data = await response.json();
                const isValid = file.validate(data);
                
                this.validationResults.files[file.path] = {
                    exists: true,
                    valid: isValid,
                    size: JSON.stringify(data).length,
                    records: Array.isArray(data) ? data.length : 0
                };
                
                if (!isValid) {
                    console.error(`❌ 無効なデータ: ${file.path}`);
                    if (file.fallback) {
                        const fallbackData = file.fallback();
                        this.validationResults.fallbacksUsed.push(file.path);
                        console.warn(`⚠️ フォールバック使用: ${file.path}`);
                        window[`fallback_${file.path.split('/').pop().split('.')[0]}`] = fallbackData;
                    } else {
                        allValid = false;
                    }
                }
            } catch (error) {
                console.error(`❌ データ読み込み失敗: ${file.path}`, error);
                this.validationResults.files[file.path] = {
                    exists: false,
                    error: error.message
                };
                
                if (file.fallback) {
                    const fallbackData = file.fallback();
                    this.validationResults.fallbacksUsed.push(file.path);
                    window[`fallback_${file.path.split('/').pop().split('.')[0]}`] = fallbackData;
                } else {
                    allValid = false;
                }
            }
        }
        
        this.validationResults.isValid = allValid;
        
        // 結果をコンソールとLocalStorageに記録
        console.table(this.validationResults.files);
        localStorage.setItem('dataValidation', JSON.stringify(this.validationResults));
        
        return allValid;
    }
    
    generateMinimalH384Data() {
        // 最小限の384爻データ生成
        const data = [];
        for (let hex = 1; hex <= 64; hex++) {
            for (let line = 1; line <= 6; line++) {
                data.push({
                    id: (hex - 1) * 6 + line,
                    hexagram: hex,
                    line: line,
                    keywords: [`卦${hex}`, `爻${line}`],
                    interpretation: `卦${hex}の第${line}爻`
                });
            }
        }
        return data;
    }
    
    generateBasicHexagrams() {
        // 基本的な64卦データ生成
        const names = ['乾', '坤', '屯', '蒙', '需', '訟', '師', '比'];  // ... 省略
        return Array.from({length: 64}, (_, i) => ({
            id: i + 1,
            name: names[i] || `卦${i + 1}`,
            lines: Array.from({length: 6}, (_, j) => ({
                position: j + 1,
                text: `第${j + 1}爻`
            }))
        }));
    }
}

// 起動時の自動実行
window.addEventListener('DOMContentLoaded', async () => {
    const validator = new DataValidator();
    const isValid = await validator.validateAll();
    
    if (!isValid) {
        // ユーザーに警告表示
        const warning = document.createElement('div');
        warning.className = 'data-warning';
        warning.innerHTML = `
            <div style="background: #ff6b6b; color: white; padding: 10px; position: fixed; top: 0; width: 100%; z-index: 9999;">
                ⚠️ データ読み込みエラー: 一部機能が制限されています
                <button onclick="this.parentElement.remove()">×</button>
            </div>
        `;
        document.body.appendChild(warning);
    }
});