class DataPreflightCheck {
    async validateDataDependencies() {
        const requiredFiles = [
            {
                path: '/data/enhanced_hexagrams_complete.json',
                schema: {
                    type: 'array',
                    items: {
                        hexagram_id: 'number',
                        name_ja: 'string',
                        yao_lines: 'array'
                    }
                },
                fallback: '/data/basic_hexagrams.json'
            },
            {
                path: '/data/yaoci_31-63.json',
                schema: {
                    type: 'array',
                    items: {
                        line_id: 'number',
                        text: 'string',
                        interpretation: 'string'
                    }
                },
                fallback: null  // 必須データ
            },
            {
                path: '/data/h384.json',
                schema: {
                    type: 'array',
                    length: 384,
                    items: {
                        id: 'number',
                        hexagram: 'number',
                        line: 'number',
                        keywords: 'array'
                    }
                },
                fallback: 'generate_from_hexagrams()'  // 動的生成
            }
        ];
        
        const validation = {
            valid: [],
            missing: [],
            invalid: [],
            fallbacks: []
        };
        
        for (const file of requiredFiles) {
            try {
                const data = await fetch(file.path);
                if (!data.ok) throw new Error('File not found');
                
                const json = await data.json();
                if (this.validateSchema(json, file.schema)) {
                    validation.valid.push(file.path);
                } else {
                    validation.invalid.push(file.path);
                    if (file.fallback) {
                        validation.fallbacks.push(file.fallback);
                    }
                }
            } catch (error) {
                validation.missing.push(file.path);
                if (file.fallback) {
                    validation.fallbacks.push(file.fallback);
                }
            }
        }
        
        return validation;
    }

    validateSchema(data, schema) {
        // ここにスキーマ検証ロジックを実装
        // 例: 簡易的な型チェック
        if (schema.type === 'array' && !Array.isArray(data)) return false;
        // 追加のチェックを必要に応じて実装
        return true;
    }
}