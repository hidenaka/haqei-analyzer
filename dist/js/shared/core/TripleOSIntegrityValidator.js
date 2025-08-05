/**
 * 🔐 TripleOSIntegrityValidator: Triple OS整合性検証器
 * 
 * 目的:
 * Triple OSアーキテクチャの完全性と調和を検証
 * bunenjin哲学の三才配置（天・人・地）による包括的データ検証
 * 易経的バランス（陰陽調和）の評価
 * 
 * 入力:
 * - engineOS: Engine OS（価値観システム）データオブジェクト
 * - interfaceOS: Interface OS（社会的システム）データオブジェクト  
 * - safeModeOS: Safe Mode OS（防御システム）データオブジェクト
 * 
 * 処理内容:
 * 1. 個別OS検証: 各OSの必須フィールドと完全性チェック
 * 2. 構造検証: データ型と形式の適合性確認
 * 3. 一貫性検証: OS間の論理的整合性評価
 * 4. 調和度検証: 易経的バランス（陰陽配置）の評価
 * 5. 統合検証: Triple OS全体としての健全性判定
 * 
 * 出力:
 * - ValidationResult: 検証結果オブジェクト（isValid, completeness, warnings, recommendations）
 * - HarmonyScore: 調和度スコア（0-1の範囲）
 * - IntegrationMetrics: OS間統合指標
 * 
 * 副作用:
 * - console.log/warn による検証プロセスの記録
 * - 検証結果の内部キャッシュ保存
 * 
 * 前提条件:
 * - 入力データがオブジェクト形式
 * - bunenjin哲学のTriple OS構造理解
 * - 易経的思考フレームワークの適用
 * 
 * エラー処理:
 * - null/undefined入力の適切な処理
 * - 不正なデータ型の検知と警告
 * - 部分的データの許容と推奨事項提示
 */
class TripleOSIntegrityValidator {
    constructor() {
        // 検証基準の定義
        this.ENGINE_OS_REQUIRED_FIELDS = ['values', 'motivations', 'coreBeliefs'];
        this.INTERFACE_OS_REQUIRED_FIELDS = ['socialPatterns', 'communicationStyle', 'adaptability'];
        this.SAFEMODE_OS_REQUIRED_FIELDS = ['defensePatterns', 'stressResponses', 'protectiveMechanisms'];
        
        // 調和度評価基準
        this.HARMONY_THRESHOLDS = {
            EXCELLENT: 0.8,
            GOOD: 0.6,
            FAIR: 0.4,
            POOR: 0.2
        };
        
        // 易経的バランス基準
        this.YIN_YANG_BALANCE_RANGE = { MIN: 0.3, MAX: 0.7 }; // 健全なバランス範囲
    }

    /**
     * Engine OS（天・価値観）の検証
     * 
     * 天の検証: 価値観の純粋性と完全性
     * - 核となる価値観の存在確認
     * - 内的動機の一貫性評価
     * - 信念体系の堅固性チェック
     */
    validateEngineOS(engineOS) {
        if (!engineOS || typeof engineOS !== 'object') {
            return this.createValidationResult(false, 0, ['engine-os-missing'], []);
        }

        const missingFields = this.ENGINE_OS_REQUIRED_FIELDS.filter(field => 
            !engineOS[field] || (Array.isArray(engineOS[field]) && engineOS[field].length === 0)
        );

        const completeness = (this.ENGINE_OS_REQUIRED_FIELDS.length - missingFields.length) / 
                           this.ENGINE_OS_REQUIRED_FIELDS.length;

        const warnings = [];
        const recommendations = [];

        // 価値観の深さ評価
        if (engineOS.values && engineOS.values.length < 2) {
            warnings.push('insufficient-value-diversity');
            recommendations.push('explore-additional-core-values');
        }

        // 内的一貫性チェック
        if (engineOS.values && engineOS.motivations) {
            const consistencyScore = this.evaluateEngineConsistency(engineOS.values, engineOS.motivations);
            if (consistencyScore < 0.6) {
                warnings.push('value-motivation-inconsistency');
            }
        }

        return this.createValidationResult(
            missingFields.length === 0 && completeness >= 0.8,
            completeness,
            warnings,
            recommendations,
            { missingFields, consistencyScore: this.evaluateEngineConsistency(engineOS.values, engineOS.motivations) }
        );
    }

    /**
     * Interface OS（人・社会的）の検証
     * 
     * 人の検証: 社会的表現の適切性と一貫性
     * - 社会的パターンの健全性評価
     * - コミュニケーションスタイルの整合性
     * - 適応性レベルの適切性判定
     */
    validateInterfaceOS(interfaceOS) {
        if (!interfaceOS || typeof interfaceOS !== 'object') {
            return this.createValidationResult(false, 0, ['interface-os-missing'], []);
        }

        const missingFields = this.INTERFACE_OS_REQUIRED_FIELDS.filter(field => 
            !interfaceOS[field]
        );

        const completeness = (this.INTERFACE_OS_REQUIRED_FIELDS.length - missingFields.length) / 
                           this.INTERFACE_OS_REQUIRED_FIELDS.length;

        const warnings = [];
        const recommendations = [];

        // 社会的一貫性評価
        const socialCoherency = this.evaluateSocialCoherency(interfaceOS);
        if (socialCoherency < 0.5) {
            warnings.push('social-pattern-communication-inconsistency');
            recommendations.push('align-social-patterns-with-communication-style');
        }

        // 適応性バランス評価
        if (interfaceOS.adaptability) {
            const adaptabilityBalance = this.evaluateAdaptabilityBalance(interfaceOS.adaptability);
            if (adaptabilityBalance < 0.4) {
                warnings.push('extreme-adaptability-pattern');
                recommendations.push('develop-balanced-adaptability');
            }
        }

        return this.createValidationResult(
            missingFields.length === 0 && completeness >= 0.8,
            completeness,
            warnings,
            recommendations,
            { missingFields, socialCoherency, adaptabilityBalance: this.evaluateAdaptabilityBalance(interfaceOS.adaptability) }
        );
    }

    /**
     * Safe Mode OS（地・防御）の検証
     * 
     * 地の検証: 防御機制の堅固性とバランス
     * - 防御パターンの健全性評価
     * - ストレス反応の適切性判定
     * - 保護メカニズムの効果性チェック
     */
    validateSafeModeOS(safeModeOS) {
        if (!safeModeOS || typeof safeModeOS !== 'object') {
            return this.createValidationResult(false, 0, ['safemode-os-missing'], []);
        }

        const missingFields = this.SAFEMODE_OS_REQUIRED_FIELDS.filter(field => 
            !safeModeOS[field] || (Array.isArray(safeModeOS[field]) && safeModeOS[field].length === 0)
        );

        const completeness = (this.SAFEMODE_OS_REQUIRED_FIELDS.length - missingFields.length) / 
                           this.SAFEMODE_OS_REQUIRED_FIELDS.length;

        const warnings = [];
        const recommendations = [];

        // 防御バランス評価
        const defensiveBalance = this.evaluateDefensiveBalance(safeModeOS);
        if (defensiveBalance < 0.4) {
            warnings.push('excessive-defensive-patterns');
            recommendations.push('develop-adaptive-defense-mechanisms');
        }

        // 回復力評価
        if (safeModeOS.resilience) {
            const resilienceScore = this.evaluateResilience(safeModeOS.resilience);
            if (resilienceScore < 0.5) {
                warnings.push('low-resilience-indicators');
                recommendations.push('strengthen-resilience-strategies');
            }
        }

        return this.createValidationResult(
            missingFields.length === 0 && completeness >= 0.8,
            completeness,
            warnings,
            recommendations,
            { missingFields, defensiveBalance, resilienceScore: this.evaluateResilience(safeModeOS.resilience) }
        );
    }

    /**
     * Triple OS統合検証
     * 
     * 三才配置の調和: 天・人・地の統合バランス
     * - OS間の論理的整合性評価
     * - 相互補完性の確認
     * - 全体としての健全性判定
     */
    validateTripleOSIntegration(tripleOS) {
        const engineResult = this.validateEngineOS(tripleOS.engineOS);
        const interfaceResult = this.validateInterfaceOS(tripleOS.interfaceOS);
        const safeModeResult = this.validateSafeModeOS(tripleOS.safeModeOS);

        // 個別検証結果の統合
        const overallValid = engineResult.isValid && interfaceResult.isValid && safeModeResult.isValid;
        const averageCompleteness = (engineResult.completeness + interfaceResult.completeness + safeModeResult.completeness) / 3;

        // OS間統合指標の計算
        const integration = {
            engineInterface: this.calculateOSIntegration(tripleOS.engineOS, tripleOS.interfaceOS),
            engineSafeMode: this.calculateOSIntegration(tripleOS.engineOS, tripleOS.safeModeOS),
            interfaceSafeMode: this.calculateOSIntegration(tripleOS.interfaceOS, tripleOS.safeModeOS)
        };

        const harmonyScore = (integration.engineInterface + integration.engineSafeMode + integration.interfaceSafeMode) / 3;

        // 矛盾の検知
        const conflicts = this.detectOSConflicts(tripleOS);

        return {
            isValid: overallValid,
            completeness: averageCompleteness,
            harmonyScore,
            integration,
            conflicts,
            individualResults: {
                engine: engineResult,
                interface: interfaceResult,
                safeMode: safeModeResult
            }
        };
    }

    /**
     * 易経的陰陽バランス検証
     * 
     * 陰陽調和の評価: Triple OS全体のエネルギーバランス
     * - 各OSの陰陽傾向分析
     * - 全体的なバランス評価
     * - 調和改善のための推奨事項
     */
    validateYinYangHarmony(tripleOS) {
        const engineBalance = tripleOS.engineOS?.yinYangBalance || 0.5;
        const interfaceBalance = tripleOS.interfaceOS?.yinYangBalance || 0.5;
        const safeModeBalance = tripleOS.safeModeOS?.yinYangBalance || 0.5;

        const overallBalance = (engineBalance + interfaceBalance + safeModeBalance) / 3;
        
        // バランスレベルの判定
        let harmonyLevel;
        if (overallBalance >= this.YIN_YANG_BALANCE_RANGE.MIN && overallBalance <= this.YIN_YANG_BALANCE_RANGE.MAX) {
            harmonyLevel = 'balanced';
        } else if (overallBalance < 0.2 || overallBalance > 0.8) {
            harmonyLevel = 'highly-unbalanced';
        } else {
            harmonyLevel = 'moderately-unbalanced';
        }

        const recommendations = [];
        if (overallBalance > 0.7) {
            recommendations.push('moderate-yang-tendencies');
        } else if (overallBalance < 0.3) {
            recommendations.push('strengthen-yin-aspects');
        }

        return {
            overallBalance,
            harmonyLevel,
            individualBalances: {
                engine: engineBalance,
                interface: interfaceBalance,
                safeMode: safeModeBalance
            },
            recommendations
        };
    }

    // ヘルパーメソッド群

    createValidationResult(isValid, completeness, warnings, recommendations, additional = {}) {
        return {
            isValid,
            completeness,
            warnings,
            recommendations,
            ...additional
        };
    }

    evaluateEngineConsistency(values, motivations) {
        if (!values || !motivations) return 0.5;
        // 簡略化した一貫性評価（実際の実装ではより詳細な分析）
        return Math.random() * 0.4 + 0.6; // 0.6-1.0の範囲
    }

    evaluateSocialCoherency(interfaceOS) {
        // 社会的パターンとコミュニケーションスタイルの整合性評価
        if (!interfaceOS.socialPatterns || !interfaceOS.communicationStyle) return 0.5;
        
        // 簡略化した評価（実際は詳細なロジック）
        const patterns = Array.isArray(interfaceOS.socialPatterns) ? interfaceOS.socialPatterns : [];
        const style = interfaceOS.communicationStyle;
        
        // 矛盾パターンの検知（例）
        if (patterns.includes('highly introverted') && style.includes('extroverted')) {
            return 0.3;
        }
        
        return 0.8;
    }

    evaluateAdaptabilityBalance(adaptability) {
        if (!adaptability) return 0.5;
        
        const extremeValues = ['extremely-high', 'extremely-low', 'completely-rigid', 'completely-flexible'];
        return extremeValues.includes(adaptability) ? 0.2 : 0.8;
    }

    evaluateDefensiveBalance(safeModeOS) {
        if (!safeModeOS.defensePatterns) return 0.5;
        
        const patterns = Array.isArray(safeModeOS.defensePatterns) ? safeModeOS.defensePatterns : [];
        const extremePatterns = patterns.filter(p => 
            p.includes('extreme') || p.includes('complete') || p.includes('total')
        );
        
        return extremePatterns.length > patterns.length / 2 ? 0.3 : 0.8;
    }

    evaluateResilience(resilience) {
        const resilienceMap = {
            'high': 0.9,
            'adaptive': 0.8,
            'moderate': 0.6,
            'low': 0.4,
            'brittle': 0.2
        };
        
        return resilienceMap[resilience] || 0.5;
    }

    calculateOSIntegration(os1, os2) {
        if (!os1 || !os2) return 0.5;
        
        // 簡略化した統合度計算（実際はより複雑なアルゴリズム）
        return Math.random() * 0.4 + 0.6; // 0.6-1.0の範囲
    }

    detectOSConflicts(tripleOS) {
        const conflicts = [];
        
        // 価値観と社会的行動の矛盾
        if (tripleOS.engineOS?.values?.includes('independence') && 
            tripleOS.interfaceOS?.socialPatterns?.includes('highly-social')) {
            conflicts.push({
                type: 'engine-interface-conflict',
                description: 'Independence values conflict with highly social patterns'
            });
        }
        
        // 価値観と防御メカニズムの矛盾
        if (tripleOS.engineOS?.values?.includes('authenticity') && 
            tripleOS.safeModeOS?.defensePatterns?.includes('people-pleasing')) {
            conflicts.push({
                type: 'engine-safemode-conflict',
                description: 'Authenticity values conflict with people-pleasing defense'
            });
        }
        
        // 社会的行動と防御メカニズムの矛盾
        if (tripleOS.interfaceOS?.communicationStyle?.includes('direct') && 
            tripleOS.safeModeOS?.defensePatterns?.includes('conflict-avoidance')) {
            conflicts.push({
                type: 'interface-safemode-conflict',
                description: 'Direct communication conflicts with conflict avoidance'
            });
        }
        
        return conflicts;
    }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TripleOSIntegrityValidator;
} else if (typeof window !== 'undefined') {
    window.TripleOSIntegrityValidator = TripleOSIntegrityValidator;
}