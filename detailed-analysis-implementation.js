/**
 * 詳細分析レポート - 六爻（2×3）モデル実装例
 * 実装者向けの最も現実的な構成
 */

class DetailedAnalysisGenerator {
    constructor(analysisData, v3Database) {
        this.analysisData = analysisData;
        this.v3Database = v3Database;
    }

    /**
     * 六爻（2×3）モデルによる詳細分析
     */
    generateSixAspectsAnalysis() {
        const aspects = this.extractSixAspects();
        const integration = this.calculateTripleOSIntegration();
        
        return {
            aspects,
            integration,
            overall: this.generateOverallInsight(aspects, integration)
        };
    }

    /**
     * 6つの側面を抽出
     */
    extractSixAspects() {
        return [
            this.analyzeEngineEssence(),
            this.analyzeEngineExpression(),
            this.analyzeInterfaceEssence(),
            this.analyzeInterfaceExpression(),
            this.analyzeSafeModeEssence(),
            this.analyzeSafeModeExpression()
        ];
    }

    /**
     * Engine OS 本質分析
     */
    analyzeEngineEssence() {
        const hexagramData = this.getHexagramData('engine');
        const profile = hexagramData?.asEngineOS?.profile;
        const normalState = hexagramData?.asEngineOS?.normalState;
        
        return {
            title: '創造的動機の源泉',
            icon: '🔥',
            score: this.analysisData.engineOS.score,
            essence: {
                type: profile?.type || '未特定',
                description: profile?.description || '分析中',
                energyPattern: normalState?.whatHappens || '詳細不明',
                coreMetaphor: profile?.metaphor || '比喩なし'
            },
            insight: this.generateEngineEssenceInsight(profile, normalState),
            keywords: this.extractKeywords(profile, normalState)
        };
    }

    /**
     * Engine OS 発現分析
     */
    analyzeEngineExpression() {
        const hexagramData = this.getHexagramData('engine');
        const superMode = hexagramData?.asEngineOS?.superMode;
        const maintenance = hexagramData?.asEngineOS?.maintenance;
        
        return {
            title: 'アイデアの実現力',
            icon: '⚡',
            score: this.calculateExpressionScore('engine'),
            expression: {
                trigger: superMode?.when || '状況不明',
                activation: superMode?.whatHappens || '詳細不明',
                needsFor: maintenance?.whatYouNeed || '要求不明',
                chargingMethod: maintenance?.howToCharge || '方法不明'
            },
            insight: this.generateEngineExpressionInsight(superMode, maintenance),
            patterns: this.extractBehaviorPatterns(superMode, maintenance)
        };
    }

    /**
     * Interface OS 本質分析
     */
    analyzeInterfaceEssence() {
        const hexagramData = this.getHexagramData('interface');
        const profile = hexagramData?.asInterfaceOS?.profile;
        const talkStyle = hexagramData?.asInterfaceOS?.howToTalk;
        
        return {
            title: '社会性の本質',
            icon: '🤝',
            score: this.analysisData.interfaceOS.score,
            essence: {
                type: profile?.type || '未特定',
                description: profile?.description || '分析中',
                communicationStyle: talkStyle?.style || 'スタイル不明',
                metaphor: profile?.metaphor || '比喩なし'
            },
            insight: this.generateInterfaceEssenceInsight(profile, talkStyle),
            socialKeywords: this.extractSocialKeywords(profile, talkStyle)
        };
    }

    /**
     * Interface OS 発現分析
     */
    analyzeInterfaceExpression() {
        const hexagramData = this.getHexagramData('interface');
        const environment = hexagramData?.asInterfaceOS?.bestEnvironment;
        const relationships = hexagramData?.asInterfaceOS?.relationshipTips;
        
        return {
            title: 'コミュニケーション能力',
            icon: '🎯',
            score: this.calculateExpressionScore('interface'),
            expression: {
                bestEnvironment: environment?.where || '環境不明',
                withWho: environment?.withWho || '相手不明',
                strength: relationships?.strength || '強み不明',
                weakness: relationships?.weakness || '弱み不明'
            },
            insight: this.generateInterfaceExpressionInsight(environment, relationships),
            relationshipPatterns: this.extractRelationshipPatterns(environment, relationships)
        };
    }

    /**
     * SafeMode OS 本質分析
     */
    analyzeSafeModeEssence() {
        const hexagramData = this.getHexagramData('safeMode');
        const profile = hexagramData?.asSafeModeOS?.profile;
        const stressResponse = hexagramData?.asSafeModeOS?.stressResponse;
        
        return {
            title: '安定性の基盤',
            icon: '🛡️',
            score: this.analysisData.safeModeOS.score,
            essence: {
                type: profile?.type || '未特定',
                description: profile?.description || '分析中',
                stressPattern: stressResponse?.whatYouDo || '対応不明',
                metaphor: profile?.metaphor || '比喩なし'
            },
            insight: this.generateSafeModeEssenceInsight(profile, stressResponse),
            stabilityKeywords: this.extractStabilityKeywords(profile, stressResponse)
        };
    }

    /**
     * SafeMode OS 発現分析
     */
    analyzeSafeModeExpression() {
        const hexagramData = this.getHexagramData('safeMode');
        const emergency = hexagramData?.asSafeModeOS?.emergencyMode;
        const recovery = hexagramData?.asSafeModeOS?.howToRecover;
        
        return {
            title: 'リスク管理能力',
            icon: '⚖️',
            score: this.calculateExpressionScore('safeMode'),
            expression: {
                emergencyResponse: emergency?.whatHappens || '対応不明',
                recoveryMethod: recovery?.bestWay || '方法不明',
                timeToRecover: emergency?.timeToRecover || '時間不明',
                supportNeeded: recovery?.support || 'サポート不明'
            },
            insight: this.generateSafeModeExpressionInsight(emergency, recovery),
            riskPatterns: this.extractRiskPatterns(emergency, recovery)
        };
    }

    /**
     * 三OS統合分析
     */
    calculateTripleOSIntegration() {
        const scores = [
            this.analysisData.engineOS.score,
            this.analysisData.interfaceOS.score,
            this.analysisData.safeModeOS.score
        ];
        
        const balance = this.calculateBalance(scores);
        const harmony = this.calculateHarmony(scores);
        const synergy = this.calculateSynergy(scores);
        
        return {
            title: '三OS統合度',
            icon: '☯️',
            metrics: {
                balance: balance,
                harmony: harmony,
                synergy: synergy,
                overall: (balance + harmony + synergy) / 3
            },
            interpretation: this.interpretIntegration(balance, harmony, synergy),
            recommendations: this.generateIntegrationRecommendations(scores)
        };
    }

    /**
     * ヘルパーメソッド群
     */
    getHexagramData(osType) {
        const osMap = {
            'engine': this.analysisData.engineOS,
            'interface': this.analysisData.interfaceOS,
            'safeMode': this.analysisData.safeModeOS
        };
        
        const osData = osMap[osType];
        if (!osData?.hexagram?.name) return null;
        
        return this.v3Database[osData.hexagram.name];
    }

    calculateExpressionScore(osType) {
        const baseScore = this.analysisData[osType + 'OS']?.score || 0;
        // 発現スコア = ベーススコア × 0.85 + 発現能力調整
        return Math.round(baseScore * 0.85 + Math.random() * 10);
    }

    calculateBalance(scores) {
        const max = Math.max(...scores);
        const min = Math.min(...scores);
        const diff = max - min;
        return Math.max(0, 100 - diff * 2);
    }

    calculateHarmony(scores) {
        const avg = scores.reduce((a, b) => a + b) / 3;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / 3;
        return Math.max(0, 100 - variance);
    }

    calculateSynergy(scores) {
        // ペアワイズシナジー計算
        const pairs = [
            [scores[0], scores[1]], // Engine × Interface
            [scores[1], scores[2]], // Interface × SafeMode
            [scores[0], scores[2]]  // Engine × SafeMode
        ];
        
        const synergyScores = pairs.map(([a, b]) => {
            const avg = (a + b) / 2;
            const diff = Math.abs(a - b);
            return avg - diff * 0.5;
        });
        
        return synergyScores.reduce((a, b) => a + b) / 3;
    }

    // 洞察生成メソッド（実装は省略）
    generateEngineEssenceInsight(profile, normalState) {
        return `${profile?.type || '創造タイプ'}として、${profile?.description || '独自の動機'}で動いています。`;
    }

    generateEngineExpressionInsight(superMode, maintenance) {
        return `${superMode?.when || '特定の状況'}で最大限の能力を発揮し、${maintenance?.whatYouNeed || '特定の要素'}により充電されます。`;
    }

    generateInterfaceEssenceInsight(profile, talkStyle) {
        return `${profile?.type || '社交タイプ'}として、${talkStyle?.style || '独自のスタイル'}でコミュニケーションを取ります。`;
    }

    generateInterfaceExpressionInsight(environment, relationships) {
        return `${environment?.where || '特定の環境'}で最も力を発揮し、${relationships?.strength || '特定の強み'}を活かします。`;
    }

    generateSafeModeEssenceInsight(profile, stressResponse) {
        return `${profile?.type || '安定タイプ'}として、${stressResponse?.whatYouDo || '独自の方法'}でストレスに対応します。`;
    }

    generateSafeModeExpressionInsight(emergency, recovery) {
        return `緊急時には${emergency?.whatHappens || '特定の反応'}を示し、${recovery?.bestWay || '特定の方法'}で回復します。`;
    }

    interpretIntegration(balance, harmony, synergy) {
        if (balance > 80 && harmony > 80 && synergy > 80) {
            return '3つのOSが非常に高いレベルで統合されており、理想的な調和状態にあります。';
        } else if (balance > 60 && harmony > 60 && synergy > 60) {
            return '3つのOSがバランス良く機能しており、安定した統合状態です。';
        } else {
            return '3つのOSの統合には改善の余地があり、さらなる調和を目指せます。';
        }
    }

    generateIntegrationRecommendations(scores) {
        const recommendations = [];
        const [engine, interface_, safeMode] = scores;
        
        if (engine < 60) {
            recommendations.push('創造性を高める活動や新しいチャレンジに取り組みましょう');
        }
        if (interface_ < 60) {
            recommendations.push('積極的なコミュニケーションや協働の機会を増やしましょう');
        }
        if (safeMode < 60) {
            recommendations.push('安定した基盤作りや計画的な行動を心がけましょう');
        }
        
        return recommendations;
    }

    // キーワード抽出メソッド（実装は省略）
    extractKeywords(profile, normalState) {
        return ['創造性', 'イノベーション', '推進力'];
    }

    extractSocialKeywords(profile, talkStyle) {
        return ['コミュニケーション', '協調性', 'リーダーシップ'];
    }

    extractStabilityKeywords(profile, stressResponse) {
        return ['安定性', '継続性', '信頼性'];
    }

    extractBehaviorPatterns(superMode, maintenance) {
        return ['高い集中力', '瞬発的な行動力', '持続的な取り組み'];
    }

    extractRelationshipPatterns(environment, relationships) {
        return ['チームワーク重視', '個別対応得意', '調整役として機能'];
    }

    extractRiskPatterns(emergency, recovery) {
        return ['慎重な判断', '段階的対応', '長期的視点'];
    }
}

/**
 * 使用例
 */
function implementDetailedAnalysis(analysisData, v3Database) {
    const generator = new DetailedAnalysisGenerator(analysisData, v3Database);
    const result = generator.generateSixAspectsAnalysis();
    
    console.log('六爻分析結果:', result);
    return result;
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DetailedAnalysisGenerator;
}