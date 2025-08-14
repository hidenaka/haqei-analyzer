/**
 * HAQEI 相互作用ルール管理システム
 * 衝突回避と優先順位管理
 * Version: 2.2.2
 */

class InteractionRules {
    constructor() {
        // 五行相生相剋の関係定義
        this.wuxingRelations = {
            generating: {
                '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
            },
            overcoming: {
                '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
            }
        };

        // 宮位間の相互作用定義
        this.palaceInteractions = {
            synergy: [
                ['乾宮', '震宮'], // 天雷（決断と行動）
                ['坤宮', '巽宮'], // 地風（受容と浸透）
                ['離宮', '坎宮'], // 火水（明晰と深淵の統合）
                ['艮宮', '兌宮']  // 山沢（安定と喜悦）
            ],
            tension: [
                ['乾宮', '坤宮'], // 天地（主導と受容の対立）
                ['震宮', '巽宮'], // 雷風（衝動と優柔不断）
                ['離宮', '坎宮'], // 火水（情熱と冷静）
                ['艮宮', '兌宮']  // 山沢（頑固と軽薄）
            ],
            neutral: [] // 自動計算
        };

        // 優先順位ルール
        this.priorityRules = {
            osOrder: ['engineOS', 'interfaceOS', 'safeModeOS'],
            conflictResolution: 'engineFirst', // engineFirst, balanced, contextual
            thresholds: {
                strong: 80,
                moderate: 60,
                weak: 40
            }
        };
    }

    /**
     * 宮の要素を取得
     */
    getPalaceElement(palaceName) {
        const elements = {
            '乾宮': '金', '坤宮': '土', '震宮': '木', '巽宮': '木',
            '坎宮': '水', '離宮': '火', '艮宮': '土', '兌宮': '金'
        };
        return elements[palaceName] || null;
    }

    /**
     * 相互作用タイプの判定
     */
    determineInteractionType(palace1, palace2) {
        // シナジー関係チェック
        for (const pair of this.palaceInteractions.synergy) {
            if ((pair[0] === palace1 && pair[1] === palace2) ||
                (pair[0] === palace2 && pair[1] === palace1)) {
                return { type: 'synergy', strength: 1.0 };
            }
        }

        // テンション関係チェック
        for (const pair of this.palaceInteractions.tension) {
            if ((pair[0] === palace1 && pair[1] === palace2) ||
                (pair[0] === palace2 && pair[1] === palace1)) {
                return { type: 'tension', strength: -0.5 };
            }
        }

        // 五行による関係チェック
        const element1 = this.getPalaceElement(palace1);
        const element2 = this.getPalaceElement(palace2);

        if (this.wuxingRelations.generating[element1] === element2) {
            return { type: 'generating', strength: 0.7 };
        }
        if (this.wuxingRelations.overcoming[element1] === element2) {
            return { type: 'overcoming', strength: -0.3 };
        }

        return { type: 'neutral', strength: 0 };
    }

    /**
     * 三者間の相互作用を計算
     */
    calculateTripleInteraction(enginePalace, interfacePalace, safeModePalace) {
        const interactions = {
            engineInterface: this.determineInteractionType(enginePalace, interfacePalace),
            engineSafeMode: this.determineInteractionType(enginePalace, safeModePalace),
            interfaceSafeMode: this.determineInteractionType(interfacePalace, safeModePalace)
        };

        // 総合スコアの計算
        const totalScore = 
            interactions.engineInterface.strength * 0.4 +
            interactions.engineSafeMode.strength * 0.3 +
            interactions.interfaceSafeMode.strength * 0.3;

        return {
            interactions,
            totalScore,
            dominantPattern: this.identifyDominantPattern(interactions)
        };
    }

    /**
     * 支配的パターンの特定
     */
    identifyDominantPattern(interactions) {
        const scores = {
            synergy: 0,
            tension: 0,
            neutral: 0
        };

        Object.values(interactions).forEach(interaction => {
            if (interaction.type === 'synergy' || interaction.type === 'generating') {
                scores.synergy += Math.abs(interaction.strength);
            } else if (interaction.type === 'tension' || interaction.type === 'overcoming') {
                scores.tension += Math.abs(interaction.strength);
            } else {
                scores.neutral += 1;
            }
        });

        // 最も強いパターンを返す
        return Object.keys(scores).reduce((a, b) => 
            scores[a] > scores[b] ? a : b
        );
    }

    /**
     * 衝突の検出と解決
     */
    resolveConflicts(engineOS, interfaceOS, safeModeOS) {
        const conflicts = [];
        const resolutions = [];

        // 強度の極端な差を検出
        const strengthDiff = {
            ei: Math.abs(engineOS.strength - interfaceOS.strength),
            es: Math.abs(engineOS.strength - safeModeOS.strength),
            is: Math.abs(interfaceOS.strength - safeModeOS.strength)
        };

        // 衝突条件1: 極端な強度差
        if (strengthDiff.ei > 60) {
            conflicts.push({
                type: 'strength_imbalance',
                pair: ['engine', 'interface'],
                severity: 'high'
            });
            resolutions.push(this.generateResolution('strength_imbalance', engineOS, interfaceOS));
        }

        // 衝突条件2: Safe Modeの過剰防御
        if (safeModeOS.strength > 80 && engineOS.strength < 40) {
            conflicts.push({
                type: 'defensive_overdrive',
                severity: 'medium'
            });
            resolutions.push({
                action: 'balance_defense',
                suggestion: '防御機制を緩和し、内的価値観の表現を促進'
            });
        }

        // 衝突条件3: 相剋関係の強い組み合わせ
        const palaceConflicts = this.detectPalaceConflicts(
            engineOS.palaceName,
            interfaceOS.palaceName,
            safeModeOS.palaceName
        );
        
        if (palaceConflicts.length > 0) {
            conflicts.push(...palaceConflicts);
            palaceConflicts.forEach(conflict => {
                resolutions.push(this.generatePalaceResolution(conflict));
            });
        }

        return {
            hasConflicts: conflicts.length > 0,
            conflicts,
            resolutions,
            priority: this.determinePriority(conflicts)
        };
    }

    /**
     * 宮位間の衝突検出
     */
    detectPalaceConflicts(enginePalace, interfacePalace, safeModePalace) {
        const conflicts = [];
        const palaces = [
            { name: enginePalace, os: 'engine' },
            { name: interfacePalace, os: 'interface' },
            { name: safeModePalace, os: 'safeMode' }
        ];

        // 各ペアをチェック
        for (let i = 0; i < palaces.length; i++) {
            for (let j = i + 1; j < palaces.length; j++) {
                const interaction = this.determineInteractionType(
                    palaces[i].name,
                    palaces[j].name
                );
                
                if (interaction.type === 'tension' || interaction.type === 'overcoming') {
                    conflicts.push({
                        type: 'palace_conflict',
                        pair: [palaces[i].os, palaces[j].os],
                        palaces: [palaces[i].name, palaces[j].name],
                        interaction: interaction.type,
                        severity: Math.abs(interaction.strength) > 0.4 ? 'high' : 'medium'
                    });
                }
            }
        }

        return conflicts;
    }

    /**
     * 解決策の生成
     */
    generateResolution(conflictType, os1, os2) {
        const resolutions = {
            strength_imbalance: {
                action: 'balance_strength',
                suggestion: `${os1.strength > os2.strength ? '内的価値観' : '社会的側面'}の過剰を調整し、バランスを回復`,
                practices: [
                    '瞑想や内省による自己認識',
                    '他者との対話による視点の拡大',
                    '段階的な行動変容'
                ]
            },
            defensive_overdrive: {
                action: 'reduce_defense',
                suggestion: '過剰な防御機制を緩和し、成長への開放性を促進',
                practices: [
                    'リスクを段階的に受け入れる練習',
                    '信頼できる環境での自己開示',
                    'ポジティブな経験の意識的な記録'
                ]
            }
        };

        return resolutions[conflictType] || {
            action: 'general_balance',
            suggestion: '全体的なバランスの調整'
        };
    }

    /**
     * 宮位衝突の解決策生成
     */
    generatePalaceResolution(conflict) {
        const palace1 = conflict.palaces[0];
        const palace2 = conflict.palaces[1];
        
        return {
            action: 'harmonize_palaces',
            suggestion: `${palace1}と${palace2}の対立を調和させる`,
            practices: this.getHarmonizationPractices(palace1, palace2)
        };
    }

    /**
     * 調和のための実践方法
     */
    getHarmonizationPractices(palace1, palace2) {
        const practices = {
            '乾宮_坤宮': [
                'リーダーシップと協調性のバランス',
                '決断と受容のタイミング分離',
                '役割の明確化と相互尊重'
            ],
            '震宮_巽宮': [
                '行動と熟考のサイクル確立',
                '短期目標と長期戦略の統合',
                '衝動性の制御と柔軟性の維持'
            ],
            '離宮_坎宮': [
                '情熱と冷静さの使い分け',
                '表現と内省のバランス',
                '感情と理性の統合'
            ],
            '艮宮_兌宮': [
                '安定性と変化の両立',
                '深い関係と広い交流の調和',
                '堅実さと楽しさの共存'
            ]
        };

        const key = [palace1, palace2].sort().join('_');
        return practices[key] || [
            '相反する特性の価値を認識',
            '状況に応じた使い分けの練習',
            '統合的な視点の獲得'
        ];
    }

    /**
     * 優先順位の決定
     */
    determinePriority(conflicts) {
        if (conflicts.length === 0) return 'none';
        
        const hasCritical = conflicts.some(c => c.severity === 'critical');
        const hasHigh = conflicts.some(c => c.severity === 'high');
        const hasMedium = conflicts.some(c => c.severity === 'medium');

        if (hasCritical) return 'immediate';
        if (hasHigh) return 'high';
        if (hasMedium) return 'moderate';
        return 'low';
    }

    /**
     * 相互作用レポートの生成
     */
    generateInteractionReport(engineOS, interfaceOS, safeModeOS) {
        const palaceInteraction = this.calculateTripleInteraction(
            engineOS.palaceName,
            interfaceOS.palaceName,
            safeModeOS.palaceName
        );

        const conflictResolution = this.resolveConflicts(
            engineOS,
            interfaceOS,
            safeModeOS
        );

        return {
            summary: {
                overallHarmony: palaceInteraction.totalScore > 0 ? 'positive' : 'challenging',
                dominantPattern: palaceInteraction.dominantPattern,
                conflictLevel: conflictResolution.priority
            },
            details: {
                palaceInteractions: palaceInteraction.interactions,
                conflicts: conflictResolution.conflicts,
                resolutions: conflictResolution.resolutions
            },
            recommendations: this.generateRecommendations(
                palaceInteraction,
                conflictResolution
            )
        };
    }

    /**
     * 推奨事項の生成
     */
    generateRecommendations(palaceInteraction, conflictResolution) {
        const recommendations = [];

        // ポジティブな相互作用を強化
        if (palaceInteraction.totalScore > 0.5) {
            recommendations.push({
                type: 'strength',
                message: 'Triple OSの調和的な関係を活かし、統合的な成長を促進'
            });
        }

        // 衝突の解決を優先
        if (conflictResolution.hasConflicts) {
            conflictResolution.resolutions.forEach(resolution => {
                recommendations.push({
                    type: 'resolution',
                    message: resolution.suggestion,
                    practices: resolution.practices
                });
            });
        }

        // バランス調整の提案
        if (Math.abs(palaceInteraction.totalScore) < 0.2) {
            recommendations.push({
                type: 'balance',
                message: '中立的な関係を活性化し、相互作用を促進'
            });
        }

        return recommendations;
    }
}

// グローバルインスタンスの作成
if (typeof window !== 'undefined') {
    window.HAQEIInteractionRules = new InteractionRules();
}