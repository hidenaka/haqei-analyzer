/**
 * Edge Case Handler - Phase 2
 * 異常値検出とフォールバック処理の実装
 */

class EdgeCaseHandler {
    constructor() {
        
    // v4.3.1 決定論的要件: SeedableRandom統合
    this.rng = options.randomnessManager || window.randomnessManager || 
               (() => { throw new Error('RandomnessManager required for deterministic behavior'); });
    this.validationRules = {
            // データ検証ルール
            scores: {
                min: 0,
                max: 1,
                sumMin: 0.95,
                sumMax: 1.05
            },
            vectors: {
                dimensionCount: 8,
                minValue: 0,
                maxValue: 1,
                sumTolerance: 0.1
            },
            hexagram: {
                minId: 1,
                maxId: 64
            },
            confidence: {
                criticalThreshold: 0.3,
                warningThreshold: 0.5
            }
        };
        
        // エラーログ
        this.errorLog = [];
        
        // リカバリー戦略
        this.recoveryStrategies = new Map();
        this.initializeRecoveryStrategies();
    }
    
    /**
     * Triple OS結果の包括的検証
     */
    validateTripleOSResults(results) {
        const validation = {
            isValid: true,
            errors: [],
            warnings: [],
            corrections: {}
        };
        
        // 1. 構造検証
        const structureCheck = this.validateStructure(results);
        if (!structureCheck.isValid) {
            validation.isValid = false;
            validation.errors.push(...structureCheck.errors);
            results = this.applyStructureCorrections(results, structureCheck.corrections);
        }
        
        // 2. 数値範囲検証
        const rangeCheck = this.validateRanges(results);
        if (!rangeCheck.isValid) {
            validation.warnings.push(...rangeCheck.warnings);
            results = this.applyRangeCorrections(results, rangeCheck.corrections);
        }
        
        // 3. 論理的整合性検証
        const consistencyCheck = this.validateConsistency(results);
        if (!consistencyCheck.isValid) {
            validation.warnings.push(...consistencyCheck.warnings);
            results = this.applyConsistencyCorrections(results, consistencyCheck.corrections);
        }
        
        // 4. 極端値検出
        const extremeCheck = this.detectExtremeValues(results);
        if (extremeCheck.hasExtremes) {
            validation.warnings.push(...extremeCheck.warnings);
            results = this.normalizeExtremeValues(results, extremeCheck.extremes);
        }
        
        // 5. データ完全性チェック
        const completenessCheck = this.checkDataCompleteness(results);
        if (!completenessCheck.isComplete) {
            results = this.fillMissingData(results, completenessCheck.missing);
            validation.warnings.push(...completenessCheck.warnings);
        }
        
        return {
            validation,
            correctedResults: results,
            requiresUserNotification: validation.errors.length > 0
        };
    }
    
    /**
     * 構造検証
     */
    validateStructure(results) {
        const errors = [];
        const corrections = {};
        
        // 必須フィールドの存在確認
        const requiredFields = ['engineOS', 'interfaceOS', 'safeModeOS'];
        
        requiredFields.forEach(field => {
            if (!results || !results[field]) {
                errors.push(`Missing required field: ${field}`);
                corrections[field] = this.getDefaultOS(field);
            } else {
                // サブフィールドの検証
                const os = results[field];
                if (!os.hexagramId || !os.hexagramName) {
                    errors.push(`Incomplete data in ${field}`);
                    corrections[field] = {
                        ...os,
                        hexagramId: os.hexagramId || 1,
                        hexagramName: os.hexagramName || '乾為天'
                    };
                }
                
                if (!os.baguaEnergies || typeof os.baguaEnergies !== 'object') {
                    errors.push(`Invalid baguaEnergies in ${field}`);
                    corrections[field] = {
                        ...os,
                        baguaEnergies: this.getDefaultBaguaEnergies()
                    };
                }
            }
        });
        
        return {
            isValid: errors.length === 0,
            errors,
            corrections
        };
    }
    
    /**
     * 数値範囲検証
     */
    validateRanges(results) {
        const warnings = [];
        const corrections = {};
        
        ['engineOS', 'interfaceOS', 'safeModeOS'].forEach(osType => {
            const os = results[osType];
            if (!os) return;
            
            // Hexagram ID範囲チェック
            if (os.hexagramId < 1 || os.hexagramId > 64) {
                warnings.push(`Invalid hexagram ID in ${osType}: ${os.hexagramId}`);
                corrections[`${osType}.hexagramId`] = Math.max(1, Math.min(64, os.hexagramId));
            }
            
            // Strength範囲チェック
            if (os.strength !== undefined) {
                if (os.strength < 0 || os.strength > 100) {
                    warnings.push(`Invalid strength in ${osType}: ${os.strength}`);
                    corrections[`${osType}.strength`] = Math.max(0, Math.min(100, os.strength));
                }
            }
            
            // BaguaEnergies範囲チェック
            if (os.baguaEnergies) {
                Object.entries(os.baguaEnergies).forEach(([bagua, value]) => {
                    if (value < 0 || value > 100) {
                        warnings.push(`Invalid bagua energy ${bagua} in ${osType}: ${value}`);
                        if (!corrections[`${osType}.baguaEnergies`]) {
                            corrections[`${osType}.baguaEnergies`] = {...os.baguaEnergies};
                        }
                        corrections[`${osType}.baguaEnergies`][bagua] = Math.max(0, Math.min(100, value));
                    }
                });
            }
        });
        
        return {
            isValid: warnings.length === 0,
            warnings,
            corrections
        };
    }
    
    /**
     * 論理的整合性検証
     */
    validateConsistency(results) {
        const warnings = [];
        const corrections = {};
        
        // 1. 3つのOSの合計が適切か
        const scores = this.extractScores(results);
        const sum = scores.engine + scores.interface + scores.safe;
        
        if (Math.abs(sum - 1) > this.validationRules.scores.sumTolerance) {
            warnings.push(`Score sum inconsistency: ${sum.toFixed(3)}`);
            
            // 正規化
            corrections.normalizedScores = {
                engine: scores.engine / sum,
                interface: scores.interface / sum,
                safe: scores.safe / sum
            };
        }
        
        // 2. 同一hexagramの重複チェック
        const hexagrams = [
            results.engineOS?.hexagramId,
            results.interfaceOS?.hexagramId,
            results.safeModeOS?.hexagramId
        ].filter(Boolean);
        
        const uniqueHexagrams = new Set(hexagrams);
        if (uniqueHexagrams.size < hexagrams.length) {
            warnings.push('Duplicate hexagrams detected across OS types');
            // 重複を解消する修正ロジック
            corrections.hexagramDiversity = this.ensureHexagramDiversity(results);
        }
        
        // 3. エネルギー分布の妥当性
        ['engineOS', 'interfaceOS', 'safeModeOS'].forEach(osType => {
            const os = results[osType];
            if (!os?.baguaEnergies) return;
            
            const values = Object.values(os.baguaEnergies);
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
            
            // 分散が極端に小さい（全て同じ値）
            if (variance < 1) {
                warnings.push(`Suspicious uniform distribution in ${osType}`);
                corrections[`${osType}.redistributed`] = this.redistributeEnergies(os.baguaEnergies);
            }
            
            // 分散が極端に大きい
            if (variance > 2000) {
                warnings.push(`Extreme variance in ${osType} energies`);
                corrections[`${osType}.smoothed`] = this.smoothEnergies(os.baguaEnergies);
            }
        });
        
        return {
            isValid: warnings.length === 0,
            warnings,
            corrections
        };
    }
    
    /**
     * 極端値検出
     */
    detectExtremeValues(results) {
        const extremes = [];
        const warnings = [];
        
        ['engineOS', 'interfaceOS', 'safeModeOS'].forEach(osType => {
            const os = results[osType];
            if (!os?.baguaEnergies) return;
            
            Object.entries(os.baguaEnergies).forEach(([bagua, value]) => {
                // 極端に高い値
                if (value > 95) {
                    extremes.push({ osType, bagua, value, type: 'high' });
                    warnings.push(`Extremely high value: ${osType}.${bagua} = ${value}`);
                }
                
                // 極端に低い値
                if (value < 5) {
                    extremes.push({ osType, bagua, value, type: 'low' });
                    warnings.push(`Extremely low value: ${osType}.${bagua} = ${value}`);
                }
            });
            
            // 全体的な偏り
            const values = Object.values(os.baguaEnergies);
            const highCount = values.filter(v => v > 80).length;
            const lowCount = values.filter(v => v < 20).length;
            
            if (highCount > 6) {
                warnings.push(`Too many high values in ${osType}`);
            }
            if (lowCount > 6) {
                warnings.push(`Too many low values in ${osType}`);
            }
        });
        
        return {
            hasExtremes: extremes.length > 0,
            extremes,
            warnings
        };
    }
    
    /**
     * データ完全性チェック
     */
    checkDataCompleteness(results) {
        const missing = [];
        const warnings = [];
        
        const baguaDimensions = ['乾', '震', '坎', '兌', '離', '巽', '艮', '坤'];
        
        ['engineOS', 'interfaceOS', 'safeModeOS'].forEach(osType => {
            const os = results[osType];
            if (!os) {
                missing.push({ type: osType, field: 'entire' });
                warnings.push(`Entire ${osType} is missing`);
                return;
            }
            
            // 必須フィールド
            if (!os.hexagramId) {
                missing.push({ type: osType, field: 'hexagramId' });
            }
            if (!os.hexagramName) {
                missing.push({ type: osType, field: 'hexagramName' });
            }
            
            // Bagua energiesの完全性
            if (!os.baguaEnergies) {
                missing.push({ type: osType, field: 'baguaEnergies' });
                warnings.push(`Missing baguaEnergies in ${osType}`);
            } else {
                baguaDimensions.forEach(dim => {
                    if (!(dim in os.baguaEnergies)) {
                        missing.push({ type: osType, field: `baguaEnergies.${dim}` });
                        warnings.push(`Missing dimension ${dim} in ${osType}`);
                    }
                });
            }
        });
        
        return {
            isComplete: missing.length === 0,
            missing,
            warnings
        };
    }
    
    /**
     * 構造修正の適用
     */
    applyStructureCorrections(results, corrections) {
        const corrected = { ...results };
        
        Object.entries(corrections).forEach(([field, value]) => {
            corrected[field] = value;
        });
        
        return corrected;
    }
    
    /**
     * 範囲修正の適用
     */
    applyRangeCorrections(results, corrections) {
        const corrected = JSON.parse(JSON.stringify(results));
        
        Object.entries(corrections).forEach(([path, value]) => {
            const parts = path.split('.');
            let current = corrected;
            
            for (let i = 0; i < parts.length - 1; i++) {
                current = current[parts[i]];
            }
            
            current[parts[parts.length - 1]] = value;
        });
        
        return corrected;
    }
    
    /**
     * 整合性修正の適用
     */
    applyConsistencyCorrections(results, corrections) {
        let corrected = { ...results };
        
        if (corrections.normalizedScores) {
            // スコアの正規化を適用
            const scores = corrections.normalizedScores;
            if (corrected.engineOS) corrected.engineOS.normalizedScore = scores.engine;
            if (corrected.interfaceOS) corrected.interfaceOS.normalizedScore = scores.interface;
            if (corrected.safeModeOS) corrected.safeModeOS.normalizedScore = scores.safe;
        }
        
        if (corrections.hexagramDiversity) {
            corrected = corrections.hexagramDiversity;
        }
        
        // エネルギー再分配の適用
        ['engineOS', 'interfaceOS', 'safeModeOS'].forEach(osType => {
            if (corrections[`${osType}.redistributed`]) {
                corrected[osType].baguaEnergies = corrections[`${osType}.redistributed`];
            }
            if (corrections[`${osType}.smoothed`]) {
                corrected[osType].baguaEnergies = corrections[`${osType}.smoothed`];
            }
        });
        
        return corrected;
    }
    
    /**
     * 極端値の正規化
     */
    normalizeExtremeValues(results, extremes) {
        const corrected = JSON.parse(JSON.stringify(results));
        
        extremes.forEach(extreme => {
            const os = corrected[extreme.osType];
            if (!os?.baguaEnergies) return;
            
            if (extreme.type === 'high') {
                // 95以上を90に制限
                os.baguaEnergies[extreme.bagua] = Math.min(90, extreme.value);
            } else if (extreme.type === 'low') {
                // 5以下を10に引き上げ
                os.baguaEnergies[extreme.bagua] = Math.max(10, extreme.value);
            }
        });
        
        // 正規化後の合計を100%に調整
        ['engineOS', 'interfaceOS', 'safeModeOS'].forEach(osType => {
            const os = corrected[osType];
            if (!os?.baguaEnergies) return;
            
            const values = Object.values(os.baguaEnergies);
            const sum = values.reduce((a, b) => a + b, 0);
            
            if (sum !== 0 && Math.abs(sum - 800) > 10) {
                // 比率を保ちながら正規化
                Object.keys(os.baguaEnergies).forEach(key => {
                    os.baguaEnergies[key] = (os.baguaEnergies[key] / sum) * 800;
                });
            }
        });
        
        return corrected;
    }
    
    /**
     * 欠損データの補完
     */
    fillMissingData(results, missing) {
        const filled = JSON.parse(JSON.stringify(results));
        
        missing.forEach(item => {
            if (item.field === 'entire') {
                filled[item.type] = this.getDefaultOS(item.type);
            } else if (item.field === 'hexagramId') {
                filled[item.type].hexagramId = this.getDefaultHexagramId(item.type);
            } else if (item.field === 'hexagramName') {
                filled[item.type].hexagramName = this.getHexagramName(filled[item.type].hexagramId);
            } else if (item.field === 'baguaEnergies') {
                filled[item.type].baguaEnergies = this.getDefaultBaguaEnergies();
            } else if (item.field.startsWith('baguaEnergies.')) {
                const dim = item.field.split('.')[1];
                if (!filled[item.type].baguaEnergies) {
                    filled[item.type].baguaEnergies = {};
                }
                filled[item.type].baguaEnergies[dim] = 50; // デフォルト値
            }
        });
        
        return filled;
    }
    
    /**
     * リカバリー戦略の初期化
     */
    initializeRecoveryStrategies() {
        // データ欠損時の戦略
        this.recoveryStrategies.set('missingOS', (type) => {
            return this.getDefaultOS(type);
        });
        
        // 計算エラー時の戦略
        this.recoveryStrategies.set('calculationError', (error) => {
            this.logError('Calculation error', error);
            return {
                synergy: 0.5,
                tension: 0.3,
                confidence: 0.4
            };
        });
        
        // レンダリングエラー時の戦略
        this.recoveryStrategies.set('renderError', (error) => {
            this.logError('Render error', error);
            return this.getFallbackDisplay();
        });
    }
    
    /**
     * デフォルトOS生成
     */
    getDefaultOS(type) {
        const defaults = {
            engineOS: {
                hexagramId: 1,
                hexagramName: '乾為天',
                strength: 33,
                baguaEnergies: this.getDefaultBaguaEnergies()
            },
            interfaceOS: {
                hexagramId: 2,
                hexagramName: '坤為地',
                strength: 33,
                baguaEnergies: this.getDefaultBaguaEnergies()
            },
            safeModeOS: {
                hexagramId: 52,
                hexagramName: '艮為山',
                strength: 34,
                baguaEnergies: this.getDefaultBaguaEnergies()
            }
        };
        
        return defaults[type] || defaults.engineOS;
    }
    
    /**
     * デフォルト八卦エネルギー
     */
    getDefaultBaguaEnergies() {
        return {
            '乾': 50,
            '震': 50,
            '坎': 50,
            '兌': 50,
            '離': 50,
            '巽': 50,
            '艮': 50,
            '坤': 50
        };
    }
    
    /**
     * Hexagram多様性の確保
     */
    ensureHexagramDiversity(results) {
        const corrected = { ...results };
        const usedIds = new Set();
        
        ['engineOS', 'interfaceOS', 'safeModeOS'].forEach((osType, index) => {
            const os = corrected[osType];
            if (!os) return;
            
            if (usedIds.has(os.hexagramId)) {
                // 重複している場合、近い別の卦を選択
                let newId = os.hexagramId;
                while (usedIds.has(newId)) {
                    newId = (newId % 64) + 1;
                }
                os.hexagramId = newId;
                os.hexagramName = this.getHexagramName(newId);
            }
            
            usedIds.add(os.hexagramId);
        });
        
        return corrected;
    }
    
    /**
     * エネルギー再分配
     */
    redistributeEnergies(energies) {
        const dimensions = Object.keys(energies);
        const redistributed = {};
        
        dimensions.forEach((dim, i) => {
            // ランダムな変動を加える
            const base = 100 / dimensions.length;
            const variation = (this.rng.next() - 0.5) * 20;
            redistributed[dim] = Math.max(10, Math.min(90, base + variation));
        });
        
        return redistributed;
    }
    
    /**
     * エネルギー平滑化
     */
    smoothEnergies(energies) {
        const values = Object.values(energies);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const smoothed = {};
        
        Object.entries(energies).forEach(([key, value]) => {
            // 平均に向けて収束
            const diff = value - mean;
            smoothed[key] = value - (diff * 0.5);
        });
        
        return smoothed;
    }
    
    /**
     * スコア抽出
     */
    extractScores(results) {
        const getScore = (os) => {
            if (!os) return 0.33;
            if (os.normalizedScore !== undefined) return os.normalizedScore;
            if (os.strength !== undefined) return os.strength / 100;
            return 0.33;
        };
        
        return {
            engine: getScore(results.engineOS),
            interface: getScore(results.interfaceOS),
            safe: getScore(results.safeModeOS)
        };
    }
    
    /**
     * デフォルトHexagram ID取得
     */
    getDefaultHexagramId(type) {
        const defaults = {
            engineOS: 1,
            interfaceOS: 2,
            safeModeOS: 52
        };
        return defaults[type] || 1;
    }
    
    /**
     * Hexagram名取得
     */
    getHexagramName(id) {
        // 簡略版：実際には完全な64卦マッピングが必要
        const names = {
            1: '乾為天',
            2: '坤為地',
            52: '艮為山'
            // ... 他の61卦
        };
        return names[id] || `卦${id}`;
    }
    
    /**
     * フォールバック表示
     */
    getFallbackDisplay() {
        return `
            <div class="error-fallback">
                <h3>一時的な表示エラー</h3>
                <p>データの表示中にエラーが発生しました。</p>
                <p>ページを更新するか、もう一度お試しください。</p>
            </div>
        `;
    }
    
    /**
     * エラーログ記録
     */
    logError(context, error) {
        const errorEntry = {
            timestamp: new Date().toISOString(),
            context,
            error: error.message || error,
            stack: error.stack
        };
        
        this.errorLog.push(errorEntry);
        
        // コンソールにも出力（開発環境）
        if (typeof console !== 'undefined') {
            console.error(`[EdgeCaseHandler] ${context}:`, error);
        }
        
        // エラーログが100件を超えたら古いものを削除
        if (this.errorLog.length > 100) {
            this.errorLog = this.errorLog.slice(-50);
        }
    }
    
    /**
     * エラーレポート生成
     */
    generateErrorReport() {
        return {
            totalErrors: this.errorLog.length,
            recentErrors: this.errorLog.slice(-10),
            errorsByContext: this.groupErrorsByContext(),
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * コンテキスト別エラー集計
     */
    groupErrorsByContext() {
        const grouped = {};
        
        this.errorLog.forEach(entry => {
            if (!grouped[entry.context]) {
                grouped[entry.context] = 0;
            }
            grouped[entry.context]++;
        });
        
        return grouped;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EdgeCaseHandler;
}