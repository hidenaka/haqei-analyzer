/**
 * AuthenticEnergyBalanceEngine.js
 * 易経正統全体エネルギーバランスエンジン
 * 
 * 目的: 単一三爻偏重問題を解決し、全8三爻の調和的統合による64卦選択を実現
 * 
 * 改善内容:
 * - 従来: 最高値2三爻の機械的選択 → 改善: 全体調和重視の最適卦選択
 * - 5次元調和理論に基づく包括的評価システム
 * - Triple OS（Engine/Interface/SafeMode）別最適化
 * 
 * HaQei哲学統合: 複数人格の調和的共存を易経理論で実現
 */

class AuthenticEnergyBalanceEngine {
    constructor() {
        console.log('🌟 Initializing Authentic I-Ching Energy Balance Engine');
        
        // 易経正統理論の初期化
        this.initializeAuthenticTheory();
        
        // Triple OS別最適パターンの定義
        this.initializeOSOptimalPatterns();
        
        // 64卦データベースとの連携
        this.initializeHexagramDatabase();
        
        console.log('✅ Authentic Energy Balance Engine initialized successfully');
    }
    
    /**
     * 易経正統理論の初期化
     */
    initializeAuthenticTheory() {
        // 先天八卦対極関係（天地自然の理）
        this.polarPairs = [
            { yin: '坤', yang: '乾', relationship: 'heaven_earth', weight: 0.3 },
            { yin: '艮', yang: '兌', relationship: 'mountain_lake', weight: 0.25 },  
            { yin: '坎', yang: '離', relationship: 'water_fire', weight: 0.25 },
            { yin: '巽', yang: '震', relationship: 'wind_thunder', weight: 0.2 }
        ];
        
        // 五行相生相克関係
        this.elementalCycle = {
            '震': { element: 'wood', generates: 'fire', destroys: 'earth', generated_by: 'water', destroyed_by: 'metal' },
            '巽': { element: 'wood', generates: 'fire', destroys: 'earth', generated_by: 'water', destroyed_by: 'metal' },
            '離': { element: 'fire', generates: 'earth', destroys: 'metal', generated_by: 'wood', destroyed_by: 'water' },
            '艮': { element: 'earth', generates: 'metal', destroys: 'water', generated_by: 'fire', destroyed_by: 'wood' },
            '坤': { element: 'earth', generates: 'metal', destroys: 'water', generated_by: 'fire', destroyed_by: 'wood' },
            '乾': { element: 'metal', generates: 'water', destroys: 'wood', generated_by: 'earth', destroyed_by: 'fire' },
            '兌': { element: 'metal', generates: 'water', destroys: 'wood', generated_by: 'earth', destroyed_by: 'fire' },
            '坎': { element: 'water', generates: 'wood', destroys: 'fire', generated_by: 'metal', destroyed_by: 'earth' }
        };
        
        // 家族関係構造（社会的調和の基盤）
        this.familialStructure = {
            father: '乾',
            mother: '坤', 
            eldest_son: '震',
            middle_son: '坎',
            youngest_son: '艮',
            eldest_daughter: '巽',
            middle_daughter: '離',
            youngest_daughter: '兌'
        };
        
        // 方位調和（空間的安定の基盤）
        this.spatialHarmony = {
            '乾': { direction: 'northwest', season: 'late_autumn' },
            '兌': { direction: 'west', season: 'autumn' },
            '離': { direction: 'south', season: 'summer' },
            '震': { direction: 'east', season: 'spring' },
            '巽': { direction: 'southeast', season: 'late_spring' },
            '坎': { direction: 'north', season: 'winter' },
            '艮': { direction: 'northeast', season: 'late_winter' },
            '坤': { direction: 'southwest', season: 'late_summer' }
        };
    }
    
    /**
     * Triple OS別最適パターンの定義
     */
    initializeOSOptimalPatterns() {
        this.osOptimalPatterns = {
            'Engine OS': {
                name: 'Creative-Stable Harmony',
                primary_trigrams: ['乾', '艮'],  // 創造-安定軸
                supportive_trigrams: ['震', '坎'], // 行動-探求軸
                ideal_ratios: {
                    '乾': [0.25, 0.30], '震': [0.20, 0.25], '坎': [0.15, 0.20], '艮': [0.20, 0.25],
                    '坤': [0.15, 0.20], '巽': [0.10, 0.15], '離': [0.10, 0.15], '兌': [0.08, 0.12]
                },
                balance_type: 'yang_dominant',
                harmony_focus: 'internal_consistency'
            },
            
            'Interface OS': {
                name: 'Social-Expressive Harmony', 
                primary_trigrams: ['兌', '離'],  // 調和-表現軸
                supportive_trigrams: ['巽', '坤'], // 適応-受容軸
                ideal_ratios: {
                    '兌': [0.25, 0.30], '離': [0.20, 0.25], '巽': [0.20, 0.25], '坤': [0.15, 0.20],
                    '艮': [0.10, 0.15], '坎': [0.08, 0.12], '震': [0.08, 0.12], '乾': [0.10, 0.15]
                },
                balance_type: 'yin_dominant',
                harmony_focus: 'social_adaptation'
            },
            
            'Safe Mode OS': {
                name: 'Defensive-Receptive Harmony',
                primary_trigrams: ['艮', '坤'],  // 安定-受容軸
                supportive_trigrams: ['坎', '巽'], // 探求-適応軸
                ideal_ratios: {
                    '艮': [0.25, 0.30], '坤': [0.20, 0.25], '坎': [0.15, 0.20], '巽': [0.15, 0.20],
                    '兌': [0.10, 0.15], '離': [0.08, 0.12], '震': [0.08, 0.12], '乾': [0.08, 0.12]
                },
                balance_type: 'balanced',
                harmony_focus: 'protective_stability'
            }
        };
    }
    
    /**
     * 64卦データベースとの連携初期化
     */
    initializeHexagramDatabase() {
        // 64卦正統マトリックス（先天八卦配列）
        this.authenticHexagramMatrix = [
            [1, 43, 14, 34, 9, 5, 26, 11],   // 乾上 (天)
            [58, 60, 38, 54, 61, 59, 28, 19], // 兌上 (沢)
            [50, 64, 56, 62, 55, 63, 35, 8],  // 離上 (火)
            [51, 16, 40, 32, 46, 48, 18, 7],  // 震上 (雷)
            [57, 20, 53, 42, 37, 45, 22, 36], // 巽上 (風)
            [6, 29, 4, 7, 59, 60, 3, 2],      // 坎上 (水)
            [33, 52, 39, 15, 53, 56, 31, 12], // 艮上 (山)
            [2, 47, 4, 7, 46, 29, 27, 24]     // 坤上 (地)
        ];
        
        this.trigramToIndex = {
            '乾': 0, '兌': 1, '離': 2, '震': 3,
            '巽': 4, '坎': 5, '艮': 6, '坤': 7
        };
    }
    
    /**
     * メイン関数: 全体エネルギーバランスによる最適64卦選択
     * 
     * @param {Object} userEnergies - ユーザーの8三爻エネルギー
     * @param {String} osType - OS種別（Engine/Interface/Safe Mode）
     * @returns {Object} 最適64卦とその詳細分析
     */
    selectOptimalHexagramByEnergyBalance(userEnergies, osType) {
        console.log(`🌟 [${osType}] Selecting optimal hexagram with authentic energy balance`);
        console.log('📊 Input energies:', userEnergies);
        
        try {
            // 1. 全64卦候補の生成
            const allCandidates = this.generateAllHexagramCandidates();
            console.log(`🔍 Generated ${allCandidates.length} hexagram candidates`);
            
            // 2. 各候補の包括的評価
            const evaluatedCandidates = allCandidates.map(candidate => {
                const evaluation = this.evaluateHexagramCandidate(candidate, userEnergies, osType);
                return {
                    ...candidate,
                    ...evaluation
                };
            });
            
            // 3. 総合評価によるソート
            evaluatedCandidates.sort((a, b) => b.totalHarmonyScore - a.totalHarmonyScore);
            
            // 4. 最適解の詳細分析
            const optimalHexagram = evaluatedCandidates[0];
            const detailedAnalysis = this.generateDetailedAnalysis(optimalHexagram, userEnergies, osType);
            
            console.log(`🏆 [${osType}] Selected Hexagram ${optimalHexagram.hexagramId} (${optimalHexagram.name})`);
            console.log(`📈 Harmony Score: ${optimalHexagram.totalHarmonyScore.toFixed(2)}/100`);
            
            return {
                hexagramId: optimalHexagram.hexagramId,
                hexagramName: optimalHexagram.name,
                upperTrigram: optimalHexagram.upperTrigram,
                lowerTrigram: optimalHexagram.lowerTrigram,
                harmonyScore: optimalHexagram.totalHarmonyScore,
                energyUtilization: optimalHexagram.energyUtilization,
                osCompatibility: optimalHexagram.osCompatibility,
                detailedAnalysis: detailedAnalysis,
                alternativeCandidates: evaluatedCandidates.slice(1, 4), // トップ3候補
                improvementRecommendations: this.generateImprovementRecommendations(optimalHexagram, userEnergies, osType)
            };
            
        } catch (error) {
            console.error(`❌ Error in energy balance selection for ${osType}:`, error);
            return this.getFallbackHexagram(userEnergies, osType);
        }
    }
    
    /**
     * 全64卦候補の生成
     */
    generateAllHexagramCandidates() {
        const candidates = [];
        const trigrams = ['乾', '兌', '離', '震', '巽', '坎', '艮', '坤'];
        
        trigrams.forEach(upperTrigram => {
            trigrams.forEach(lowerTrigram => {
                const upperIndex = this.trigramToIndex[upperTrigram];
                const lowerIndex = this.trigramToIndex[lowerTrigram];
                const hexagramId = this.authenticHexagramMatrix[upperIndex][lowerIndex];
                
                // HEXAGRAMS配列からデータを取得（グローバル変数）
                const hexagramData = window.HEXAGRAMS ? 
                    window.HEXAGRAMS.find(h => h.hexagram_id === hexagramId) : null;
                
                candidates.push({
                    hexagramId,
                    name: hexagramData ? hexagramData.name_jp : `卦${hexagramId}`,
                    upperTrigram,
                    lowerTrigram,
                    hexagramData
                });
            });
        });
        
        return candidates;
    }
    
    /**
     * 64卦候補の包括的評価
     */
    evaluateHexagramCandidate(candidate, userEnergies, osType) {
        // 5つの調和次元による評価
        const polarHarmony = this.calculatePolarHarmony(candidate, userEnergies);
        const elementalFlow = this.calculateElementalFlow(candidate, userEnergies); 
        const familialBalance = this.calculateFamilialBalance(candidate, userEnergies);
        const spatialStability = this.calculateSpatialStability(candidate, userEnergies);
        const osCompatibility = this.calculateOSCompatibility(candidate, osType, userEnergies);
        
        // エネルギー活用度
        const energyUtilization = this.calculateEnergyUtilization(candidate, userEnergies);
        
        // 重み付き統合評価
        const weights = { polar: 0.25, elemental: 0.20, familial: 0.15, spatial: 0.10, os: 0.25, energy: 0.05 };
        
        const totalHarmonyScore = 
            (polarHarmony * weights.polar) +
            (elementalFlow * weights.elemental) +  
            (familialBalance * weights.familial) +
            (spatialStability * weights.spatial) +
            (osCompatibility * weights.os) +
            (energyUtilization * weights.energy);
        
        return {
            polarHarmony,
            elementalFlow,
            familialBalance, 
            spatialStability,
            osCompatibility,
            energyUtilization,
            totalHarmonyScore: Math.max(0, Math.min(100, totalHarmonyScore))
        };
    }
    
    /**
     * 対極調和度の計算
     */
    calculatePolarHarmony(candidate, userEnergies) {
        const upperEnergy = userEnergies[candidate.upperTrigram] || 0;
        const lowerEnergy = userEnergies[candidate.lowerTrigram] || 0;
        
        // この64卦が対極関係にあるかチェック
        let isPolarPair = false;
        let polarWeight = 1.0;
        
        this.polarPairs.forEach(pair => {
            if ((candidate.upperTrigram === pair.yang && candidate.lowerTrigram === pair.yin) ||
                (candidate.upperTrigram === pair.yin && candidate.lowerTrigram === pair.yang)) {
                isPolarPair = true;
                polarWeight = pair.weight;
            }
        });
        
        if (isPolarPair) {
            // 黄金比（1.618:1）に近いほど理想的
            const ratio = upperEnergy > lowerEnergy ? 
                upperEnergy / Math.max(lowerEnergy, 1) : 
                lowerEnergy / Math.max(upperEnergy, 1);
            
            const idealRatio = 1.618;
            const harmonyScore = 100 - Math.abs(ratio - idealRatio) / idealRatio * 50;
            
            return Math.max(0, harmonyScore * polarWeight * 100);
        }
        
        // 対極でない場合は一般的調和度を計算
        const totalEnergy = upperEnergy + lowerEnergy;
        const balanceRatio = totalEnergy > 0 ? Math.min(upperEnergy, lowerEnergy) / Math.max(upperEnergy, lowerEnergy) : 0;
        
        return balanceRatio * 60; // 最大60点（対極ペアより低い評価）
    }
    
    /**
     * 五行循環流動度の計算
     */
    calculateElementalFlow(candidate, userEnergies) {
        const upperElement = this.elementalCycle[candidate.upperTrigram];
        const lowerElement = this.elementalCycle[candidate.lowerTrigram];
        
        if (!upperElement || !lowerElement) return 50; // デフォルト
        
        const upperEnergy = userEnergies[candidate.upperTrigram] || 0;
        const lowerEnergy = userEnergies[candidate.lowerTrigram] || 0;
        
        let flowScore = 50; // ベースライン
        
        // 相生関係チェック
        if (upperElement.element === lowerElement.generated_by) {
            flowScore += 25; // 上卦が下卦を生成
        }
        if (lowerElement.element === upperElement.generated_by) {
            flowScore += 25; // 下卦が上卦を生成
        }
        
        // 相克関係チェック（適度な緊張は有益）
        if (upperElement.element === lowerElement.destroyed_by && upperEnergy < lowerEnergy * 1.5) {
            flowScore += 15; // 適度な相克
        }
        if (lowerElement.element === upperElement.destroyed_by && lowerEnergy < upperEnergy * 1.5) {
            flowScore += 15; // 適度な相克
        }
        
        // 過度な相克は減点
        if (upperElement.destroys === lowerElement.element && upperEnergy > lowerEnergy * 2) {
            flowScore -= 20;
        }
        if (lowerElement.destroys === upperElement.element && lowerEnergy > upperEnergy * 2) {
            flowScore -= 20;
        }
        
        return Math.max(0, Math.min(100, flowScore));
    }
    
    /**
     * 家族関係調和度の計算
     */
    calculateFamilialBalance(candidate, userEnergies) {
        // 家族内での世代・性別関係の調和を評価
        const upperRole = this.getFamilialRole(candidate.upperTrigram);
        const lowerRole = this.getFamilialRole(candidate.lowerTrigram);
        
        let familyScore = 50; // ベースライン
        
        // 父母関係
        if ((upperRole === 'father' && lowerRole === 'mother') || 
            (upperRole === 'mother' && lowerRole === 'father')) {
            familyScore += 30; // 最高の調和
        }
        
        // 親子関係
        if (upperRole === 'father' && lowerRole.includes('son')) familyScore += 20;
        if (upperRole === 'mother' && lowerRole.includes('daughter')) familyScore += 20;
        if (lowerRole === 'father' && upperRole.includes('son')) familyScore += 15;
        if (lowerRole === 'mother' && upperRole.includes('daughter')) familyScore += 15;
        
        // 同世代関係
        if (upperRole.includes('son') && lowerRole.includes('son')) familyScore += 10;
        if (upperRole.includes('daughter') && lowerRole.includes('daughter')) familyScore += 10;
        
        return Math.max(0, Math.min(100, familyScore));
    }
    
    /**
     * 空間安定度の計算
     */
    calculateSpatialStability(candidate, userEnergies) {
        const upperSpatial = this.spatialHarmony[candidate.upperTrigram];
        const lowerSpatial = this.spatialHarmony[candidate.lowerTrigram];
        
        if (!upperSpatial || !lowerSpatial) return 50;
        
        // 方位の対称性評価
        const directions = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
        const upperIndex = directions.indexOf(upperSpatial.direction.replace('_', ''));
        const lowerIndex = directions.indexOf(lowerSpatial.direction.replace('_', ''));
        
        let stabilityScore = 50;
        
        // 対角関係（最も安定）
        const angleDiff = Math.abs(upperIndex - lowerIndex);
        if (angleDiff === 4) { // 正対角
            stabilityScore += 30;
        } else if (angleDiff === 2 || angleDiff === 6) { // 直角
            stabilityScore += 20;
        } else if (angleDiff === 1 || angleDiff === 7 || angleDiff === 3 || angleDiff === 5) { // 斜角
            stabilityScore += 10;
        }
        
        return Math.max(0, Math.min(100, stabilityScore));
    }
    
    /**
     * OS適合性の計算
     */
    calculateOSCompatibility(candidate, osType, userEnergies) {
        const osPattern = this.osOptimalPatterns[osType];
        if (!osPattern) return 50;
        
        let compatibilityScore = 0;
        
        // 主要三爻との適合性
        if (osPattern.primary_trigrams.includes(candidate.upperTrigram)) {
            compatibilityScore += 30;
        }
        if (osPattern.primary_trigrams.includes(candidate.lowerTrigram)) {
            compatibilityScore += 25;
        }
        
        // 支援三爻との適合性
        if (osPattern.supportive_trigrams.includes(candidate.upperTrigram)) {
            compatibilityScore += 20;
        }
        if (osPattern.supportive_trigrams.includes(candidate.lowerTrigram)) {
            compatibilityScore += 15;
        }
        
        // 理想比率との適合度
        const upperEnergy = userEnergies[candidate.upperTrigram] || 0;
        const lowerEnergy = userEnergies[candidate.lowerTrigram] || 0;
        const totalUserEnergy = Object.values(userEnergies).reduce((sum, energy) => sum + energy, 0);
        
        if (totalUserEnergy > 0) {
            const upperRatio = upperEnergy / totalUserEnergy;
            const lowerRatio = lowerEnergy / totalUserEnergy;
            
            const upperIdealRange = osPattern.ideal_ratios[candidate.upperTrigram];
            const lowerIdealRange = osPattern.ideal_ratios[candidate.lowerTrigram];
            
            if (upperIdealRange && upperRatio >= upperIdealRange[0] && upperRatio <= upperIdealRange[1]) {
                compatibilityScore += 10;
            }
            if (lowerIdealRange && lowerRatio >= lowerIdealRange[0] && lowerRatio <= lowerIdealRange[1]) {
                compatibilityScore += 10;
            }
        }
        
        return Math.max(0, Math.min(100, compatibilityScore));
    }
    
    /**
     * エネルギー活用度の計算
     */
    calculateEnergyUtilization(candidate, userEnergies) {
        const upperEnergy = userEnergies[candidate.upperTrigram] || 0;
        const lowerEnergy = userEnergies[candidate.lowerTrigram] || 0;
        const totalUserEnergy = Object.values(userEnergies).reduce((sum, energy) => sum + energy, 0);
        
        if (totalUserEnergy === 0) return 0;
        
        const utilizationRatio = (upperEnergy + lowerEnergy) / totalUserEnergy;
        
        // 30-70%の活用が理想的（極端すぎず、十分活用）
        if (utilizationRatio >= 0.3 && utilizationRatio <= 0.7) {
            return 100;
        } else if (utilizationRatio >= 0.2 && utilizationRatio <= 0.8) {
            return 80;
        } else if (utilizationRatio >= 0.15 && utilizationRatio <= 0.85) {
            return 60;
        } else {
            return Math.max(20, utilizationRatio * 100);
        }
    }
    
    /**
     * 家族役割の取得
     */
    getFamilialRole(trigram) {
        const roleMap = {
            '乾': 'father',
            '坤': 'mother',
            '震': 'eldest_son', 
            '坎': 'middle_son',
            '艮': 'youngest_son',
            '巽': 'eldest_daughter',
            '離': 'middle_daughter', 
            '兌': 'youngest_daughter'
        };
        return roleMap[trigram] || 'unknown';
    }
    
    /**
     * 詳細分析の生成
     */
    generateDetailedAnalysis(optimalHexagram, userEnergies, osType) {
        return {
            energyDistribution: {
                upper: userEnergies[optimalHexagram.upperTrigram] || 0,
                lower: userEnergies[optimalHexagram.lowerTrigram] || 0,
                utilization: optimalHexagram.energyUtilization,
                balance: this.analyzeEnergyBalance(optimalHexagram, userEnergies)
            },
            harmonyBreakdown: {
                polarHarmony: optimalHexagram.polarHarmony,
                elementalFlow: optimalHexagram.elementalFlow,
                familialBalance: optimalHexagram.familialBalance,
                spatialStability: optimalHexagram.spatialStability,
                osCompatibility: optimalHexagram.osCompatibility
            },
            authenticInterpretation: this.generateAuthenticInterpretation(optimalHexagram, osType),
            improvedAspects: this.identifyImprovedAspects(optimalHexagram, userEnergies)
        };
    }
    
    /**
     * 易経正統解釈の生成
     */
    generateAuthenticInterpretation(hexagram, osType) {
        const upperTrigram = hexagram.upperTrigram;
        const lowerTrigram = hexagram.lowerTrigram;
        
        return {
            traditional_meaning: `${upperTrigram}卦在上，${lowerTrigram}卦在下，象徴${this.getTrigramMeaning(upperTrigram)}與${this.getTrigramMeaning(lowerTrigram)}的調和統一`,
            os_context: this.getOSContextInterpretation(hexagram, osType),
            practical_guidance: this.getPracticalGuidance(hexagram, osType),
            energy_wisdom: `您的${upperTrigram}能量與${lowerTrigram}能量達成最佳平衡，體現了${osType}系統的和諧運作`
        };
    }
    
    /**
     * 三爻の意味取得
     */
    getTrigramMeaning(trigram) {
        const meanings = {
            '乾': '純陽創造力',
            '坤': '純陰包容力', 
            '震': '雷鳴行動力',
            '巽': '風行滲透力',
            '坎': '水流探索力',
            '離': '火焰表現力',
            '艮': '山嶽安定力',
            '兌': '沼澤調和力'
        };
        return meanings[trigram] || '未知の力';
    }
    
    /**
     * OS文脈解釈
     */
    getOSContextInterpretation(hexagram, osType) {
        const contextMap = {
            'Engine OS': `內在價值系統以${hexagram.upperTrigram}為主導，${hexagram.lowerTrigram}為支援，形成穩定的核心人格架構`,
            'Interface OS': `社交互動系統通過${hexagram.upperTrigram}的外在表現，結合${hexagram.lowerTrigram}的內在調節，達成和諧的人際關係`,
            'Safe Mode OS': `防護系統以${hexagram.upperTrigram}作為主要防線，${hexagram.lowerTrigram}提供後備支援，確保心理安全與穩定`
        };
        return contextMap[osType] || '系統運作正常';
    }
    
    /**
     * 実践的指導の取得
     */
    getPracticalGuidance(hexagram, osType) {
        // 簡化版 - 実際の実装ではより詳細な指導を生成
        return `在${osType}運作時，保持${hexagram.upperTrigram}與${hexagram.lowerTrigram}的動態平衡，順應自然變化的節奏`;
    }
    
    /**
     * 改善提案の生成
     */
    generateImprovementRecommendations(optimalHexagram, userEnergies, osType) {
        const recommendations = [];
        
        // エネルギーバランスの改善提案
        const totalEnergy = Object.values(userEnergies).reduce((sum, energy) => sum + energy, 0);
        const avgEnergy = totalEnergy / 8;
        
        Object.entries(userEnergies).forEach(([trigram, energy]) => {
            if (energy < avgEnergy * 0.5) {
                recommendations.push({
                    type: 'energy_boost',
                    trigram: trigram,
                    current: energy,
                    target: avgEnergy * 0.7,
                    suggestion: `${trigram}エネルギーの活性化を推奨します。${this.getTrigramMeaning(trigram)}を意識的に育成してください。`
                });
            }
        });
        
        // OS特化改善提案
        const osPattern = this.osOptimalPatterns[osType];
        if (osPattern) {
            osPattern.primary_trigrams.forEach(trigram => {
                const currentRatio = (userEnergies[trigram] || 0) / totalEnergy;
                const idealRange = osPattern.ideal_ratios[trigram];
                
                if (idealRange && currentRatio < idealRange[0]) {
                    recommendations.push({
                        type: 'os_optimization',
                        trigram: trigram,
                        currentRatio: currentRatio,
                        targetRange: idealRange,
                        suggestion: `${osType}の効果的運用のため、${trigram}エネルギーの増強が有効です。`
                    });
                }
            });
        }
        
        return recommendations;
    }
    
    /**
     * フォールバック64卦（エラー時）
     */
    getFallbackHexagram(userEnergies, osType) {
        console.warn(`🚨 Using fallback hexagram selection for ${osType}`);
        
        // 安全な乾為天（創造）を返す
        return {
            hexagramId: 1,
            hexagramName: '乾為天',
            upperTrigram: '乾',
            lowerTrigram: '乾', 
            harmonyScore: 75,
            energyUtilization: 50,
            osCompatibility: 60,
            detailedAnalysis: {
                note: 'フォールバック選択：安全で安定した創造的エネルギーパターン'
            },
            alternativeCandidates: [],
            improvementRecommendations: []
        };
    }
    
    /**
     * エネルギーバランス分析
     */
    analyzeEnergyBalance(hexagram, userEnergies) {
        const upperEnergy = userEnergies[hexagram.upperTrigram] || 0;
        const lowerEnergy = userEnergies[hexagram.lowerTrigram] || 0;
        const total = upperEnergy + lowerEnergy;
        
        if (total === 0) return 'balanced';
        
        const ratio = upperEnergy / lowerEnergy;
        
        if (ratio > 2.0) return 'upper_dominant';
        if (ratio < 0.5) return 'lower_dominant';
        if (ratio >= 1.2 && ratio <= 2.0) return 'upper_leaning';
        if (ratio >= 0.5 && ratio <= 0.8) return 'lower_leaning';
        return 'balanced';
    }
    
    /**
     * 改善された側面の特定
     */
    identifyImprovedAspects(hexagram, userEnergies) {
        return {
            energyUtilization: hexagram.energyUtilization > 70 ? 'excellent' : 'good',
            trigramSynergy: this.calculateTrigramSynergy(hexagram),
            authenticAlignment: hexagram.totalHarmonyScore > 80 ? 'high' : 'moderate',
            practicalApplicability: 'enhanced'
        };
    }
    
    /**
     * 三爻シナジーの計算
     */
    calculateTrigramSynergy(hexagram) {
        const upperElement = this.elementalCycle[hexagram.upperTrigram];
        const lowerElement = this.elementalCycle[hexagram.lowerTrigram];
        
        if (!upperElement || !lowerElement) return 'neutral';
        
        // 相生関係チェック
        if (upperElement.generates === lowerElement.element || 
            lowerElement.generates === upperElement.element) {
            return 'generative';
        }
        
        // 相克関係チェック
        if (upperElement.destroys === lowerElement.element || 
            lowerElement.destroys === upperElement.element) {
            return 'challenging';
        }
        
        return 'neutral';
    }
}

// グローバルエクスポート
window.AuthenticEnergyBalanceEngine = AuthenticEnergyBalanceEngine;

console.log('✅ AuthenticEnergyBalanceEngine loaded successfully');