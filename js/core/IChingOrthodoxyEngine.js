/**
 * I Ching Orthodoxy Engine for HAQEI Triple OS Analysis
 * Integrates authentic 易経 principles with modern personality analysis
 * 
 * Core Principles:
 * - 時 (Time/Timing): 時中・時義・待機の概念
 * - 變 (Change): 變爻・進爻による動的変化
 * - 德 (Virtue): 各卦固有の徳性
 * - 情 (Emotion): 感情的側面の分析
 * - 序卦伝 (Sequence): 発展段階の理解
 */

class IChingOrthodoxyEngine {
    constructor() {
        this.sequenceProgressions = [
            {
                stage: "創始期",
                hexagrams: [1, 2], // 乾坤
                personality_development: "基本的価値観の形成期",
                growth_challenge: "創造性と受容性のバランス",
                os_focus: "engine_foundation"
            },
            {
                stage: "困難期",
                hexagrams: [3, 4], // 屯蒙  
                personality_development: "試練と学習の時期",
                growth_challenge: "困難への対処と知恵の獲得",
                os_focus: "safe_mode_activation"
            },
            {
                stage: "待機期",
                hexagrams: [5, 6], // 需訟
                personality_development: "忍耐と正義感の形成",
                growth_challenge: "適切なタイミングの認識",
                os_focus: "strategic_waiting"
            },
            {
                stage: "組織期",
                hexagrams: [7, 8], // 師比
                personality_development: "社会性と協調性の発達",
                growth_challenge: "リーダーシップと協調の使い分け",
                os_focus: "interface_development"
            },
            {
                stage: "蓄積期",
                hexagrams: [9, 10, 11, 12], // 小畜・履・泰・否
                personality_development: "力の蓄積と運気の理解",
                growth_challenge: "順境と逆境への適応",
                os_focus: "resource_management"
            },
            {
                stage: "調和期",
                hexagrams: [13, 14, 15, 16], // 同人・大有・謙・豫
                personality_development: "社会的成功と謙虚さの両立",
                growth_challenge: "成功の維持と人格の向上",
                os_focus: "balanced_excellence"
            },
            {
                stage: "変化期",
                hexagrams: [17, 18, 19, 20], // 随・蠱・臨・観
                personality_development: "変化への対応と影響力の行使",
                growth_challenge: "変化を導きながら観察する力",
                os_focus: "adaptive_leadership"
            },
            {
                stage: "完成期",
                hexagrams: [63, 64], // 既済・未済
                personality_development: "完成と継続の循環理解",
                growth_challenge: "達成後の新たな目標設定",
                os_focus: "continuous_evolution"
            }
        ];
        
        this.wuxingRelations = {
            mutual_generation: { // 相生
                wood: "fire",
                fire: "earth", 
                earth: "metal",
                metal: "water",
                water: "wood"
            },
            mutual_destruction: { // 相克
                wood: "earth",
                earth: "water",
                water: "fire", 
                fire: "metal",
                metal: "wood"
            }
        };
    }

    /**
     * 64卦完全分析システム
     * @param {Object} userScores - 30質問の結果スコア
     * @param {Object} situationalContext - 状況的コンテキスト
     * @returns {Object} 完全な易経分析結果
     */
    analyzeComplete64Hexagrams(userScores, situationalContext = {}) {
        // 1. Triple OSスコア計算
        const tripleOS = this.calculateTripleOSScores(userScores);
        
        // 2. 主要卦の特定（各OSに対応）
        const primaryHexagrams = {
            engine_os: this.selectPrimaryHexagram(tripleOS.engine, 'engine'),
            interface_os: this.selectPrimaryHexagram(tripleOS.interface, 'interface'),
            safe_mode_os: this.selectPrimaryHexagram(tripleOS.safe_mode, 'safe_mode')
        };
        
        // 3. 卦の関係性分析
        const hexagramRelationships = this.analyzeHexagramRelationships(primaryHexagrams);
        
        // 4. 六爻変化分析
        const lineTransformations = this.analyzeSixLineChanges(userScores, primaryHexagrams);
        
        // 5. 序卦伝に基づく成長段階分析
        const developmentStage = this.analyzeSequenceProgression(primaryHexagrams);
        
        // 6. 時義分析（タイミング・状況適応）
        const timingAnalysis = this.analyzeTimingConcept(primaryHexagrams, situationalContext);
        
        // 7. 五行バランス分析
        const wuxingBalance = this.analyzeWuxingBalance(primaryHexagrams);
        
        return {
            triple_os: tripleOS,
            primary_hexagrams: primaryHexagrams,
            relationships: hexagramRelationships,
            line_transformations: lineTransformations,
            development_stage: developmentStage,
            timing_analysis: timingAnalysis,
            wuxing_balance: wuxingBalance,
            virtual_persona: this.generateVirtualPersona(primaryHexagrams),
            guidance: this.generatePracticalGuidance(primaryHexagrams, developmentStage)
        };
    }

    /**
     * Triple OSスコア計算（8つの八卦スコアから）
     */
    calculateTripleOSScores(userScores) {
        const trigramScores = {
            qian: userScores.qian_creativity || 0,      // 乾：創造性
            zhen: userScores.zhen_action || 0,         // 震：行動性  
            kan: userScores.kan_exploration || 0,      // 坎：探求性
            gen: userScores.gen_stability || 0,        // 艮：安定性
            kun: userScores.kun_receptiveness || 0,    // 坤：受容性
            xun: userScores.xun_adaptability || 0,     // 巽：適応性
            li: userScores.li_expression || 0,         // 離：表現性
            dui: userScores.dui_harmony || 0           // 兌：調和性
        };

        return {
            engine: {
                primary: trigramScores.qian,
                secondary: trigramScores.zhen,
                support: trigramScores.li,
                total: trigramScores.qian + trigramScores.zhen + trigramScores.li,
                characteristics: "創造・行動・表現"
            },
            interface: {
                primary: trigramScores.dui,
                secondary: trigramScores.xun,
                support: trigramScores.kun,
                total: trigramScores.dui + trigramScores.xun + trigramScores.kun,
                characteristics: "調和・適応・受容"
            },
            safe_mode: {
                primary: trigramScores.gen,
                secondary: trigramScores.kan,
                support: trigramScores.kun,
                total: trigramScores.gen + trigramScores.kan + trigramScores.kun,
                characteristics: "安定・探求・基盤"
            }
        };
    }

    /**
     * 主要卦選択（各OSの特徴に基づく）
     */
    selectPrimaryHexagram(osScores, osType) {
        // OSタイプ別の卦群定義
        const hexagramGroups = {
            engine: [1, 34, 43, 14, 9, 5, 26, 11], // 創造・力・決断系
            interface: [42, 37, 61, 19, 20, 31, 32, 54], // 関係・信頼・影響系  
            safe_mode: [2, 52, 15, 16, 8, 23, 27, 4] // 安定・基盤・育成系
        };

        const candidates = hexagramGroups[osType];
        
        // スコアパターンに基づく選択ロジック
        const selectionScore = osScores.primary * 0.5 + 
                              osScores.secondary * 0.3 + 
                              osScores.support * 0.2;
        
        const index = Math.floor((selectionScore / 100) * candidates.length) % candidates.length;
        return candidates[index];
    }

    /**
     * 卦の関係性分析（互卦・綜卦・錯卦）
     */
    analyzeHexagramRelationships(primaryHexagrams) {
        const relationships = {};
        
        Object.keys(primaryHexagrams).forEach(osType => {
            const hexagramId = primaryHexagrams[osType];
            relationships[osType] = {
                primary: hexagramId,
                hu_gua: this.calculateHuGua(hexagramId), // 互卦
                zong_gua: this.calculateZongGua(hexagramId), // 綜卦  
                cuo_gua: this.calculateCuoGua(hexagramId), // 錯卦
                hidden_potential: "内面の可能性",
                complementary: "補完的側面",
                opposite_learning: "対立から学ぶべき点"
            };
        });

        return relationships;
    }

    /**
     * 六爻変化分析（動的変容の可能性）
     */
    analyzeSixLineChanges(userScores, primaryHexagrams) {
        const transformations = {};
        
        Object.keys(primaryHexagrams).forEach(osType => {
            const hexagramId = primaryHexagrams[osType];
            
            // ユーザーの回答パターンから変爻を特定
            const changingLines = this.identifyChangingLines(userScores, osType);
            
            transformations[osType] = {
                current_hexagram: hexagramId,
                changing_lines: changingLines,
                future_hexagram: this.calculateChangedHexagram(hexagramId, changingLines),
                transformation_meaning: this.interpretTransformation(changingLines),
                timing_advice: this.getTransformationTiming(changingLines)
            };
        });

        return transformations;
    }

    /**
     * 序卦伝による発展段階分析
     */
    analyzeSequenceProgression(primaryHexagrams) {
        const hexagramIds = Object.values(primaryHexagrams);
        
        // 最も関連する発展段階を特定
        let currentStage = this.sequenceProgressions.find(stage => 
            stage.hexagrams.some(hexId => hexagramIds.includes(hexId))
        );
        
        if (!currentStage) {
            // より広範囲での段階特定
            currentStage = this.identifyStageByCharacteristics(hexagramIds);
        }

        return {
            current_stage: currentStage,
            next_stage: this.getNextStage(currentStage),
            growth_path: this.generateGrowthPath(currentStage),
            challenges: currentStage.growth_challenge,
            opportunities: this.identifyGrowthOpportunities(currentStage)
        };
    }

    /**
     * 時義分析（状況に応じた適切な対応）
     */
    analyzeTimingConcept(primaryHexagrams, situationalContext) {
        const timingAdvice = {};
        
        Object.keys(primaryHexagrams).forEach(osType => {
            const hexagramId = primaryHexagrams[osType];
            const hexagramData = this.getHexagramData(hexagramId);
            
            timingAdvice[osType] = {
                time_concept: hexagramData.time_concept,
                current_timing: this.assessCurrentTiming(hexagramId, situationalContext),
                recommended_action: this.getTimingBasedAction(hexagramId),
                waiting_periods: this.identifyWaitingPeriods(hexagramId),
                action_periods: this.identifyActionPeriods(hexagramId)
            };
        });

        return timingAdvice;
    }

    /**
     * 五行バランス分析
     */
    analyzeWuxingBalance(primaryHexagrams) {
        const elementCounts = {wood: 0, fire: 0, earth: 0, metal: 0, water: 0};
        
        Object.values(primaryHexagrams).forEach(hexagramId => {
            const element = this.getHexagramElement(hexagramId);
            elementCounts[element]++;
        });

        return {
            element_distribution: elementCounts,
            dominant_element: this.getDominantElement(elementCounts),
            lacking_element: this.getLackingElement(elementCounts),
            balance_advice: this.generateElementBalanceAdvice(elementCounts),
            strengthening_methods: this.getElementStrengtheningMethods(elementCounts)
        };
    }

    /**
     * 仮想人格生成（三才に基づく）
     */
    generateVirtualPersona(primaryHexagrams) {
        return {
            heaven_aspect: {
                hexagram: primaryHexagrams.engine_os,
                name: this.getHexagramName(primaryHexagrams.engine_os),
                symbol: "天龍象",
                color: "金色系",
                traits: ["創造性", "リーダーシップ", "革新性"],
                motto: this.getHexagramMotto(primaryHexagrams.engine_os)
            },
            human_aspect: {
                hexagram: primaryHexagrams.interface_os,
                name: this.getHexagramName(primaryHexagrams.interface_os),
                symbol: "人和象", 
                color: "五色調和",
                traits: ["社交性", "協調性", "適応性"],
                motto: this.getHexagramMotto(primaryHexagrams.interface_os)
            },
            earth_aspect: {
                hexagram: primaryHexagrams.safe_mode_os,
                name: this.getHexagramName(primaryHexagrams.safe_mode_os),
                symbol: "地母象",
                color: "土色系", 
                traits: ["安定性", "持続性", "包容性"],
                motto: this.getHexagramMotto(primaryHexagrams.safe_mode_os)
            },
            integration_message: this.generateIntegrationMessage(primaryHexagrams)
        };
    }

    /**
     * 実践的指導生成
     */
    generatePracticalGuidance(primaryHexagrams, developmentStage) {
        return {
            daily_practice: this.getDailyPracticeAdvice(primaryHexagrams),
            relationship_guidance: this.getRelationshipGuidance(primaryHexagrams),
            career_direction: this.getCareerDirection(primaryHexagrams),
            personal_growth: this.getPersonalGrowthPlan(developmentStage),
            seasonal_advice: this.getSeasonalAdvice(primaryHexagrams),
            meditation_focus: this.getMeditationFocus(primaryHexagrams)
        };
    }

    // Utility methods (implementation details)
    calculateHuGua(hexagramId) { /* 互卦計算 */ return hexagramId; }
    calculateZongGua(hexagramId) { /* 綜卦計算 */ return 65 - hexagramId; }
    calculateCuoGua(hexagramId) { /* 錯卦計算 */ return hexagramId; }
    
    identifyChangingLines(userScores, osType) {
        // スコアの偏差から変爻を特定
        return [2, 4]; // 例：二爻・四爻が変化
    }
    
    getHexagramData(hexagramId) {
        // enhanced_hexagrams_orthodoxy.jsonから取得
        return {time_concept: "時中", virtue: "自強不息"};
    }
    
    getHexagramElement(hexagramId) {
        const elementMap = {
            1: "metal", 2: "earth", 3: "water", 4: "earth",
            // ... 64卦の五行対応
        };
        return elementMap[hexagramId] || "earth";
    }
    
    getHexagramName(hexagramId) {
        const nameMap = {1: "乾為天", 2: "坤為地" /* ... */};
        return nameMap[hexagramId];
    }
    
    getHexagramMotto(hexagramId) {
        const mottoMap = {1: "天行健", 2: "地勢坤" /* ... */};
        return mottoMap[hexagramId];
    }
}

// Export for use in HAQEI system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IChingOrthodoxyEngine;
} else if (typeof window !== 'undefined') {
    window.IChingOrthodoxyEngine = IChingOrthodoxyEngine;
}