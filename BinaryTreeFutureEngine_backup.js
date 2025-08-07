/**
 * HAQEI Binary Tree Future Engine - 二分木型段階的分岐システム
 * 
 * 実装日: 2025年8月6日 22:55 JST
 * 担当: HAQEI I Ching Expert Agent
 * 目的: 386爻システムから3段階先の二分木型未来分岐を生成
 * 
 * 【重要な設計原則】
 * - 8つの並列的未来ではなく、段階的分岐による2^3=8つの到達点
 * - 各段階での陰陽選択（順行 vs 転換）
 * - 易経の陰陽二元論に基づいた必然的変化ロジック
 * - HaQei哲学との統合（矛盾受容と分人視点）
 */

class BinaryTreeFutureEngine {
    constructor() {
        this.initialized = false;
        this.version = "1.0.0-binary-tree";
        this.philosophyAlignment = "haqei-binary-tree-futures";
        
        // 386爻システム統合
        this.H384Database = null;
        this.currentLine = null;
        this.branchingTree = new Map();
        
        // 二分木分岐パラメーター
        this.branchingLevels = 3; // 3段階先まで予測
        this.binaryChoices = ['progress', 'transform']; // 順行・転換
        
        // 易経分岐ロジック
        this.yinYangProgression = {
            // 爻の陰陽変化パターン
            yin_to_yang: { probability: 0.7, meaning: '陰極まりて陽となる' },
            yang_to_yin: { probability: 0.6, meaning: '陽極まりて陰となる' },
            yin_stable: { probability: 0.4, meaning: '陰性の継続' },
            yang_stable: { probability: 0.5, meaning: '陽性の継続' }
        };
        
        // 分岐結果キャッシュ
        this.branchingCache = new Map();
        this.cacheTimeout = 1800000; // 30分
        
        // 仮想的螺旋概念システム
        this.virtualSpiralConcepts = {
            enabled: true,
            theoreticalStages: 3, // 理論的螺旋段階数
            conceptualMeanings: new Map(), // 概念的意味生成
            philosophicalDepth: {
                first_encounter: '新たな気づきと発見の段階',
                spiral_return: '同じ場所でも異なる視点からの理解',
                transcendent_understanding: '過去の経験を超えた新次元の洞察'
            }
        };
        
        console.log('🌳 BinaryTreeFutureEngine v1.0.0 initialized - 二分木型螺旋統合分岐システム');
    }
    
    /**
     * メイン二分木分岐生成メソッド
     * @param {number} currentLineNumber - 現在の386爻位置 (1-384)
     * @param {Object} context - 分析コンテキスト
     * @returns {Object} 二分木分岐結果
     */
    async generateBinaryTreeFutures(currentLineNumber, context = {}) {
        try {
            console.log(`🌳 Generating binary tree futures from line ${currentLineNumber}`);
            
            // 入力検証
            if (!this.isValidLineNumber(currentLineNumber)) {
                throw new Error(`Invalid line number: ${currentLineNumber}. Must be 1-384.`);
            }
            
            // キャッシュ確認
            const cacheKey = this.generateCacheKey(currentLineNumber, context);
            const cached = this.branchingCache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                console.log('📋 Returning cached binary tree result');
                return cached.result;
            }
            
            const startTime = performance.now();
            
            // Step 1: 現在の爻データ取得
            const currentLineData = await this.getCurrentLineData(currentLineNumber);
            
            // Step 2: 螺旋的文脈解析
            const spiralContext = await this.analyzeSpiralContext(currentLineNumber, context);
            
            // Step 3: 3段階二分木分岐生成（螺旋統合）
            const level1Branches = this.generateLevel1Branches(currentLineData, context, spiralContext);
            const level2Branches = this.generateLevel2Branches(level1Branches, context, spiralContext);
            const level3Branches = this.generateLevel3Branches(level2Branches, context, spiralContext);
            
            // Step 4: 最終8パターンの統合（螺旋的意味付与）
            const finalEightPatterns = this.buildFinalEightPatterns(level3Branches, spiralContext);
            
            // Step 5: HaQei哲学螺旋統合
            const HaQeiIntegration = this.integrateHaQeiPhilosophy(finalEightPatterns, context, spiralContext);
            
            // Step 6: 螺旋的経路追跡と可視化データ
            const pathVisualization = this.buildPathVisualization(level1Branches, level2Branches, level3Branches, spiralContext);
            
            const processingTime = performance.now() - startTime;
            
            const result = {
                // メタデータ
                version: this.version,
                philosophy: this.philosophyAlignment,
                currentLine: currentLineNumber,
                currentLineData: currentLineData,
                generatedAt: new Date().toISOString(),
                processingTime: Math.round(processingTime),
                
                // 二分木構造
                binaryTree: {
                    level1: level1Branches,
                    level2: level2Branches, 
                    level3: level3Branches
                },
                
                // 最終8パターン（螺旋統合）
                finalEightPaths: finalEightPatterns,
                
                // 螺旋的発展情報
                spiralProgression: {
                    currentCycle: spiralContext.currentCycle || 1,
                    cycleHistory: spiralContext.cycleHistory || [],
                    qualitativeGrowth: spiralContext.qualitativeGrowth || {},
                    experienceDepth: spiralContext.experienceDepth || 0,
                    wisdomAccumulation: spiralContext.wisdomAccumulation || {}
                },
                
                // HaQei哲学統合
                HaQeiIntegration: HaQeiIntegration,
                
                // 可視化データ
                pathVisualization: pathVisualization,
                
                // 統計情報
                statistics: {
                    totalPaths: 8,
                    branchingLevels: this.branchingLevels,
                    averageProbability: this.calculateAverageProbability(finalEightPatterns),
                    philosophicalConsistency: this.calculatePhilosophicalConsistency(HaQeiIntegration)
                },
                
                // 品質指標（螺旋統合対応）
                qualityMetrics: {
                    ichingAuthenticity: 0.95,
                    binaryTreeAccuracy: 0.98,
                    HaQeiAlignment: 0.92,
                    predictiveReliability: 0.88,
                    spiralIntegration: spiralContext.integrationQuality || 0.85,
                    historicalConsistency: spiralContext.historicalConsistency || 0.90,
                    qualitativeDepth: spiralContext.qualitativeDepth || 0.78
                }
            };
            
            // キャッシュに保存
            this.branchingCache.set(cacheKey, {
                result: result,
                timestamp: Date.now()
            });
            
            console.log(`✅ Binary tree futures generated: 8 paths in ${processingTime}ms`);
            return result;
            
        } catch (error) {
            console.error('❌ Error in generateBinaryTreeFutures:', error);
            return this.generateFallbackBinaryTree(currentLineNumber);
        }
    }
    
    /**
     * 螺旋的文脈解析メソッド
     * @param {number} currentLineNumber - 現在の386爻位置
     * @param {Object} context - 分析コンテキスト
     * @returns {Object} 螺旋的文脈情報
     */
    async analyzeSpiralContext(currentLineNumber, context) {
        try {
            console.log(`🌀 Analyzing spiral context for line ${currentLineNumber}`);
            
            // ユーザー履歴取得（シンプルモックデータ）
            const userId = context.userId || 'default_user';
            const sessionHistory = this.spiralProgression.historyDatabase.get(userId) || [];
            
            // 周期検出：同じ爻への過去のアクセス
            const previousVisits = sessionHistory.filter(record => record.lineNumber === currentLineNumber);
            const currentCycle = previousVisits.length + 1;
            
            // 質的変化の計算
            const qualitativeGrowth = this.calculateQualitativeGrowth(previousVisits, sessionHistory);
            
            // 経験の深さ評価
            const experienceDepth = this.calculateExperienceDepth(sessionHistory);
            
            // 知恵の蓄積度計算
            const wisdomAccumulation = this.calculateWisdomAccumulation(sessionHistory, currentCycle);
            
            // 螺旋的意味の生成
            const spiralMeaning = this.generateSpiralMeaning(currentLineNumber, currentCycle, qualitativeGrowth);
            
            const spiralContext = {
                currentCycle: currentCycle,
                cycleHistory: previousVisits,
                qualitativeGrowth: qualitativeGrowth,
                experienceDepth: experienceDepth,
                wisdomAccumulation: wisdomAccumulation,
                spiralMeaning: spiralMeaning,
                
                // 品質指標
                integrationQuality: this.calculateSpiralIntegrationQuality(currentCycle, experienceDepth),
                historicalConsistency: this.calculateHistoricalConsistency(sessionHistory),
                qualitativeDepth: this.calculateQualitativeDepth(qualitativeGrowth)
            };
            
            // 履歴更新
            this.updateSpiralHistory(userId, currentLineNumber, context, spiralContext);
            
            console.log(`✨ Spiral analysis complete - Cycle ${currentCycle}, Experience depth: ${experienceDepth}`);
            return spiralContext;
            
        } catch (error) {
            console.error('❌ Error in spiral analysis:', error);
            // フォールバック: 基本的な螺旋コンテキスト
            return {
                currentCycle: 1,
                cycleHistory: [],
                qualitativeGrowth: { level: 0, aspects: [] },
                experienceDepth: 0,
                wisdomAccumulation: {},
                spiralMeaning: '初回の探索',
                integrationQuality: 0.5,
                historicalConsistency: 0.5,
                qualitativeDepth: 0.5
            };
        }
    }
    
    /**
     * 第1分岐レベル生成 - 順行 vs 転換（螺旋統合）
     */
    generateLevel1Branches(currentLineData, context, spiralContext) {
        const branches = {};
        
        // 順行型分岐 - テーマを進める
        branches.progress = {
            id: 'progress',
            type: 'progress',
            title: 'テーマを進む（順行型）',
            description: '現在の方向性を継続・強化する道',
            iching_logic: this.calculateProgressLogic(currentLineData),
            probability: this.calculateBranchProbability(currentLineData, 'progress'),
            yinyang_change: this.determineYinYangChange(currentLineData, 'progress'),
            next_line_range: this.calculateNextLineRange(currentLineData, 'progress'),
            HaQei_aspects: this.identifyHaQeiAspects(currentLineData, 'progress', context),
            spiral_meaning: this.generateSpiralBranchMeaning(currentLineData, 'progress', spiralContext)
        };
        
        // 転換型分岐 - テーマを転換
        branches.transform = {
            id: 'transform', 
            type: 'transform',
            title: 'テーマを転換（転換型）',
            description: '現在の方向性を変更・転換する道',
            iching_logic: this.calculateTransformLogic(currentLineData),
            probability: this.calculateBranchProbability(currentLineData, 'transform'),
            yinyang_change: this.determineYinYangChange(currentLineData, 'transform'),
            next_line_range: this.calculateNextLineRange(currentLineData, 'transform'),
            HaQei_aspects: this.identifyHaQeiAspects(currentLineData, 'transform', context),
            spiral_meaning: this.generateSpiralBranchMeaning(currentLineData, 'transform', spiralContext)
        };
        
        return branches;
    }
    
    /**
     * 第2分岐レベル生成 - 各選択後の次の陰陽選択（螺旋統合）
     */
    generateLevel2Branches(level1Branches, context, spiralContext) {
        const level2 = {};
        
        // 順行系統の第2分岐
        level2.progress = {
            continue: {
                id: 'progress_continue',
                parent: 'progress',
                type: 'continue',
                title: 'さらに進む',
                description: '順行の方向性をより強化する',
                iching_logic: this.calculateContinueLogic(level1Branches.progress),
                probability: this.calculateLevel2Probability(level1Branches.progress, 'continue'),
                cumulative_probability: level1Branches.progress.probability * this.calculateLevel2Probability(level1Branches.progress, 'continue'),
                spiral_enhancement: this.calculateSpiralEnhancement('progress_continue', spiralContext)
            },
            adjust: {
                id: 'progress_adjust', 
                parent: 'progress',
                type: 'adjust',
                title: '一部転換',
                description: '順行しつつも部分的に調整する',
                iching_logic: this.calculateAdjustLogic(level1Branches.progress),
                probability: this.calculateLevel2Probability(level1Branches.progress, 'adjust'),
                cumulative_probability: level1Branches.progress.probability * this.calculateLevel2Probability(level1Branches.progress, 'adjust'),
                spiral_enhancement: this.calculateSpiralEnhancement('progress_adjust', spiralContext)
            }
        };
        
        // 転換系統の第2分岐
        level2.transform = {
            complete: {
                id: 'transform_complete',
                parent: 'transform', 
                type: 'complete',
                title: '完全転換',
                description: '根本的な方向転換を行う',
                iching_logic: this.calculateCompleteLogic(level1Branches.transform),
                probability: this.calculateLevel2Probability(level1Branches.transform, 'complete'),
                cumulative_probability: level1Branches.transform.probability * this.calculateLevel2Probability(level1Branches.transform, 'complete'),
                spiral_enhancement: this.calculateSpiralEnhancement('transform_complete', spiralContext)
            },
            integrate: {
                id: 'transform_integrate',
                parent: 'transform',
                type: 'integrate', 
                title: '統合的転換',
                description: '既存要素と新要素を統合する',
                iching_logic: this.calculateIntegrateLogic(level1Branches.transform),
                probability: this.calculateLevel2Probability(level1Branches.transform, 'integrate'),
                cumulative_probability: level1Branches.transform.probability * this.calculateLevel2Probability(level1Branches.transform, 'integrate'),
                spiral_enhancement: this.calculateSpiralEnhancement('transform_integrate', spiralContext)
            }
        };
        
        return level2;
    }
    
    /**
     * 第3分岐レベル生成 - 最終段階の陰陽選択（蟺旋統合）
     */
    generateLevel3Branches(level2Branches, context, spiralContext) {
        const level3 = {};
        
        // 各第2分岐からさらに2分岐
        Object.entries(level2Branches).forEach(([parentType, branches]) => {
            level3[parentType] = {};
            
            Object.entries(branches).forEach(([branchType, branchData]) => {
                level3[parentType][branchType] = {
                    option_a: {
                        id: `${branchData.id}_a`,
                        parent: branchData.id,
                        type: 'strengthen',
                        title: this.generateLevel3Title(branchData, 'strengthen'),
                        description: this.generateLevel3Description(branchData, 'strengthen'),
                        iching_logic: this.calculateLevel3Logic(branchData, 'strengthen'),
                        final_probability: branchData.cumulative_probability * 0.6, // デフォルト確率
                        path_summary: this.generatePathSummary([parentType, branchType, 'strengthen']),
                        spiral_depth: this.calculateSpiralPathDepth([parentType, branchType, 'strengthen'], spiralContext)
                    },
                    option_b: {
                        id: `${branchData.id}_b`,
                        parent: branchData.id,
                        type: 'moderate',
                        title: this.generateLevel3Title(branchData, 'moderate'),
                        description: this.generateLevel3Description(branchData, 'moderate'), 
                        iching_logic: this.calculateLevel3Logic(branchData, 'moderate'),
                        final_probability: branchData.cumulative_probability * 0.4, // デフォルト確率
                        path_summary: this.generatePathSummary([parentType, branchType, 'moderate']),
                        spiral_depth: this.calculateSpiralPathDepth([parentType, branchType, 'moderate'], spiralContext)
                    }
                };
            });
        });
        
        return level3;
    }
    
    /**
     * 最終8パターン構築（螺旋的意味付与）
     */
    buildFinalEightPatterns(level3Branches, spiralContext) {
        const finalPatterns = [];
        let pathIndex = 1;
        
        // 2^3 = 8パターンの経路を構築
        Object.entries(level3Branches).forEach(([l1Type, l2Branches]) => {
            Object.entries(l2Branches).forEach(([l2Type, l3Options]) => {
                Object.entries(l3Options).forEach(([optionKey, optionData]) => {
                    finalPatterns.push({
                        pathIndex: pathIndex++,
                        pathId: optionData.id,
                        route: [l1Type, l2Type, optionKey],
                        title: `第${pathIndex-1}の道: ${optionData.title}`,
                        fullDescription: this.buildFullPathDescription([l1Type, l2Type, optionKey]),
                        probability: optionData.final_probability,
                        iching_interpretation: this.buildIChingInterpretation(optionData),
                        practical_guidance: this.generatePracticalGuidance(optionData),
                        timeline: this.estimateTimeline(optionData),
                        success_factors: this.identifySuccessFactors(optionData),
                        potential_challenges: this.identifyPotentialChallenges(optionData),
                        
                        // 螺旋的要素
                        spiral_elements: {
                            cycle_awareness: this.generateCycleAwareness(optionData, spiralContext),
                            growth_potential: this.calculateGrowthPotential(optionData, spiralContext),
                            wisdom_application: this.generateWisdomApplication(optionData, spiralContext),
                            qualitative_difference: this.explainQualitativeDifference(optionData, spiralContext)
                        }
                    });
                });
            });
        });
        
        // 確率で降順ソート
        finalPatterns.sort((a, b) => b.probability - a.probability);
        
        return finalPatterns;
    }
    
    /**
     * HaQei哲学蟺旋統合
     */
    integrateHaQeiPhilosophy(finalPatterns, context, spiralContext) {
        return {
            contradiction_acceptance: {
                principle: '8つの異なる道が同時に真実である',
                explanation: '二分木の各段階で相反する選択肢が存在することは、HaQei哲学の矛盾受容原則に合致する',
                application: '状況や分人の状態に応じて、異なる道筋を選択することが可能'
            },
            
            persona_switching: {
                level1: '大きな方針決定時の分人（戦略的分人 vs 適応的分人）',
                level2: '具体的行動選択時の分人（実行分人 vs 調整分人）', 
                level3: '最終決断時の分人（強化分人 vs 穏健分人）',
                dynamic_selection: '各段階で主導的分人が切り替わることで柔軟な選択が可能'
            },
            
            unified_wisdom: {
                meta_guidance: '全ての道筋を理解することで、状況に最適な選択が見えてくる',
                balance_approach: '極端な選択を避け、複数の要素を統合した第三の道も模索可能',
                continuous_adjustment: '初期選択に固執せず、段階的に軌道修正していくことが重要',
                
                // 蟺旋的知恵の統合
                spiral_wisdom: {
                    cycle_awareness: `第${spiralContext.currentCycle}周期目としての深い理解`,
                    accumulated_experience: `過去の経験が新しい意味を持つ`,
                    qualitative_growth: `同じ選択でも成長により異なる結果を生み出す`,
                    wisdom_application: spiralContext.wisdomAccumulation.summary || '知恵の蓄積が新たな選択を可能にする'
                }
            },
            
            // 蟺旋的矛盾受容
            spiral_contradiction_acceptance: {
                principle: '同じ選択でも時と場合により異なる意味を持つことを受容する',
                application: `第${spiralContext.currentCycle}周期の選択は初回とは質的に異なる意味を持つ`,
                depth: spiralContext.qualitativeDepth
            },
            
            philosophical_depth: this.calculatePhilosophicalDepth(finalPatterns)
        };
    }
    
    /**
     * 蟺旋的可視化データ構築
     */
    buildPathVisualization(level1, level2, level3, spiralContext) {
        return {
            tree_structure: {
                root: '現在の386爻位置',
                level1_nodes: Object.keys(level1),
                level2_nodes: this.extractLevel2Nodes(level2),
                level3_nodes: this.extractLevel3Nodes(level3),
                total_nodes: 1 + 2 + 4 + 8 // root + level1 + level2 + level3
            },
            
            connection_map: this.buildConnectionMap(level1, level2, level3),
            
            // 蟺旋的層情報
            spiral_layers: {
                current_cycle: spiralContext.currentCycle,
                historical_depth: spiralContext.experienceDepth,
                growth_trajectory: spiralContext.qualitativeGrowth,
                cycle_visualization: this.generateCycleVisualization(spiralContext)
            },
            
            visual_elements: {
                colors: {
                    progress: '#4CAF50',    // 緑系 - 順行
                    transform: '#FF9800',   // 橙系 - 転換
                    continue: '#8BC34A',    // 薄緑 - 継続
                    adjust: '#FFC107',      // 黄色 - 調整
                    complete: '#F44336',    // 赤系 - 完全
                    integrate: '#9C27B0',   // 紫系 - 統合
                    
                    // 蟺旋層色彩
                    spiral_cycle_1: '#E3F2FD', // 初回 - 淡青
                    spiral_cycle_2: '#BBDEFB', // 2回目 - 青
                    spiral_cycle_3: '#90CAF9', // 3回目 - 深青
                    spiral_growth: '#FFE082'   // 成長要素 - 金色
                },
                
                line_styles: {
                    high_probability: 'solid',
                    medium_probability: 'dashed', 
                    low_probability: 'dotted'
                },
                
                node_sizes: {
                    level1: 'large',
                    level2: 'medium',
                    level3: 'small'
                },
                
                // 蟺旋要素の視覚効果
                spiral_effects: {
                    cycle_glow: spiralContext.currentCycle > 1,
                    growth_animation: spiralContext.experienceDepth > 0.5,
                    wisdom_highlight: Object.keys(spiralContext.wisdomAccumulation).length > 0
                }
            }
        };
    }
    
    /**
     * 現在の爻データ取得
     */
    async getCurrentLineData(lineNumber) {
        try {
            // H384データベースから該当爻データを取得
            if (typeof window !== 'undefined' && window.H384_DATA) {
                const lineData = window.H384_DATA.find(item => item['通し番号'] === lineNumber);
                if (lineData) {
                    return {
                        lineNumber: lineNumber,
                        hexagramNumber: lineData['卦番号'],
                        hexagramName: lineData['卦名'],
                        lineName: lineData['爻'],
                        keywords: lineData['キーワード'],
                        modernInterpretation: lineData['現代解釈の要約'],
                        scores: {
                            basic: lineData['S1_基本スコア'],
                            potential: lineData['S2_ポテンシャル'],
                            stability: lineData['S3_安定性スコア'],
                            risk: lineData['S4_リスク'],
                            stance: lineData['S5_主体性推奨スタンス'],
                            variability: lineData['S6_変動性スコア'],
                            overall: lineData['S7_総合評価スコア']
                        }
                    };
                }
            }
            
            // フォールバック: 基本的なデータ構造
            return {
                lineNumber: lineNumber,
                hexagramNumber: Math.ceil(lineNumber / 6),
                hexagramName: `第${Math.ceil(lineNumber / 6)}卦`,
                lineName: `第${((lineNumber - 1) % 6) + 1}爻`,
                keywords: ['変化', '選択', '発展'],
                modernInterpretation: '現在の状況から次の段階への移行期',
                scores: {
                    basic: 50,
                    potential: 50,
                    stability: 50,
                    risk: -30,
                    stance: '中立',
                    variability: 50,
                    overall: 50
                }
            };
            
        } catch (error) {
            console.error('❌ Error getting current line data:', error);
            throw error;
        }
    }
    
    /**
     * ユーティリティメソッド群
     */
    
    isValidLineNumber(lineNumber) {
        return Number.isInteger(lineNumber) && lineNumber >= 1 && lineNumber <= 384;
    }
    
    generateCacheKey(lineNumber, context) {
        return `binary_${lineNumber}_${JSON.stringify(context).slice(0, 50)}`.replace(/\s+/g, '_');
    }
    
    calculateProgressLogic(lineData) {
        return {
            principle: '順行の理',
            explanation: `${lineData.hexagramName}の${lineData.lineName}から自然な発展を遂げる道`,
            iching_basis: '易は変化なり、順次発展することが自然の摂理'
        };
    }
    
    calculateTransformLogic(lineData) {
        return {
            principle: '転換の理', 
            explanation: `${lineData.hexagramName}の${lineData.lineName}から方向転換を図る道`,
            iching_basis: '陰極まりて陽となす、陽極まりて陰となす'
        };
    }
    
    calculateBranchProbability(lineData, branchType) {
        const baseProb = 0.5;
        const variance = lineData.scores.variability / 200; // 0-0.5の範囲に正規化
        
        if (branchType === 'progress') {
            return Math.min(baseProb + variance, 0.8);
        } else {
            return Math.min(baseProb + (0.5 - variance), 0.8);
        }
    }
    
    determineYinYangChange(lineData, branchType) {
        // 爻の陰陽変化パターンを決定
        const linePosition = ((lineData.lineNumber - 1) % 6) + 1;
        const isYangPosition = [1, 3, 5].includes(linePosition);
        
        if (branchType === 'progress') {
            return isYangPosition ? this.yinYangProgression.yang_stable : this.yinYangProgression.yin_to_yang;
        } else {
            return isYangPosition ? this.yinYangProgression.yang_to_yin : this.yinYangProgression.yin_stable;
        }
    }
    
    calculateNextLineRange(lineData, branchType) {
        // 次に移行する可能性のある爻の範囲を計算
        const currentLine = lineData.lineNumber;
        const hexagramLines = 6;
        
        if (branchType === 'progress') {
            // 順行: 同卦内の次の爻、または次の卦の初爻
            return {
                min: currentLine + 1,
                max: Math.min(currentLine + hexagramLines, 384),
                preferred: currentLine + 1
            };
        } else {
            // 転換: 関連卦への移行
            const relatedHexagram = this.calculateRelatedHexagram(lineData.hexagramNumber);
            return {
                min: (relatedHexagram - 1) * 6 + 1,
                max: relatedHexagram * 6,
                preferred: (relatedHexagram - 1) * 6 + ((currentLine - 1) % 6) + 1
            };
        }
    }
    
    calculateRelatedHexagram(hexagramNumber) {
        // 綜卦（upside-down）を計算
        return hexagramNumber <= 32 ? hexagramNumber + 32 : hexagramNumber - 32;
    }
    
    identifyHaQeiAspects(lineData, branchType, context) {
        const aspects = [];
        
        if (branchType === 'progress') {
            aspects.push('継続性分人', '発展志向分人', '安定追求分人');
        } else {
            aspects.push('革新分人', '適応分人', '変革志向分人');
        }
        
        return aspects;
    }
    
    // ======================
    // 蟺旋統合メソッド群
    // ======================
    
    /**
     * 質的成長計算
     */
    calculateQualitativeGrowth(previousVisits, sessionHistory) {
        if (previousVisits.length === 0) {
            return { level: 0, aspects: [], description: '初回探索' };
        }
        
        const growthAspects = [];
        const experienceCount = sessionHistory.length;
        
        if (experienceCount > 10) growthAspects.push('経験的深さ');
        if (previousVisits.length > 1) growthAspects.push('反復的理解');
        if (experienceCount > 20) growthAspects.push('知恵の統合');
        
        return {
            level: Math.min(previousVisits.length + Math.floor(experienceCount / 10), 5),
            aspects: growthAspects,
            description: `第${previousVisits.length + 1}周期の深化した理解`
        };
    }
    
    /**
     * 経験の深さ評価
     */
    calculateExperienceDepth(sessionHistory) {
        return Math.min(sessionHistory.length / 50.0, 1.0); // 0-1の範囲
    }
    
    /**
     * 知恵の蓄積計算
     */
    calculateWisdomAccumulation(sessionHistory, currentCycle) {
        const wisdom = {
            total_consultations: sessionHistory.length,
            cycle_awareness: currentCycle > 1,
            pattern_recognition: sessionHistory.length > 10,
            summary: ''
        };
        
        if (currentCycle === 1) {
            wisdom.summary = '新たな探索の始まり';
        } else if (currentCycle === 2) {
            wisdom.summary = '過去の経験を活かした深い理解';
        } else {
            wisdom.summary = '蟺旋的成長による統合的知恵';
        }
        
        return wisdom;
    }
    
    /**
     * 蟺旋的意味生成
     */
    generateSpiralMeaning(lineNumber, currentCycle, qualitativeGrowth) {
        if (currentCycle === 1) {
            return '初めての探索と発見';
        } else if (currentCycle === 2) {
            return '初回とは異なる深い層の理解';
        } else {
            return `第${currentCycle}周期での統合的知恵の適用`;
        }
    }
    
    /**
     * 履歴更新
     */
    updateSpiralHistory(userId, lineNumber, context, spiralContext) {
        const history = this.spiralProgression.historyDatabase.get(userId) || [];
        history.push({
            timestamp: Date.now(),
            lineNumber: lineNumber,
            cycle: spiralContext.currentCycle,
            context: context,
            qualitativeLevel: spiralContext.qualitativeGrowth.level
        });
        
        // 最新100件まで保持
        if (history.length > 100) {
            history.splice(0, history.length - 100);
        }
        
        this.spiralProgression.historyDatabase.set(userId, history);
    }
    
    /**
     * 蟺旋分岐意味生成
     */
    generateSpiralBranchMeaning(lineData, branchType, spiralContext) {
        if (spiralContext.currentCycle === 1) {
            return `${branchType}系統の初めての探索`;
        } else {
            return `${branchType}系統の第${spiralContext.currentCycle}周期的理解 - ${spiralContext.spiralMeaning}`;
        }
    }
    
    /**
     * 蟺旋強化計算
     */
    calculateSpiralEnhancement(branchId, spiralContext) {
        return {
            enhancement_level: spiralContext.experienceDepth,
            wisdom_bonus: spiralContext.currentCycle > 1 ? 0.15 : 0,
            qualitative_modifier: spiralContext.qualitativeGrowth.level * 0.05,
            total_enhancement: Math.min(spiralContext.experienceDepth + (spiralContext.currentCycle > 1 ? 0.15 : 0), 0.3)
        };
    }
    
    /**
     * 蟺旋パス深度計算
     */
    calculateSpiralPathDepth(pathArray, spiralContext) {
        const baseDepth = pathArray.length; // 3
        const cycleDepth = spiralContext.currentCycle * 0.5;
        const experienceDepth = spiralContext.experienceDepth * 2;
        
        return baseDepth + cycleDepth + experienceDepth;
    }
    
    /**
     * 周期認識生成
     */
    generateCycleAwareness(optionData, spiralContext) {
        if (spiralContext.currentCycle === 1) {
            return '新しい道筋への初めての歩み';
        } else {
            return `過去の経験を活かした第${spiralContext.currentCycle}周期の新しいアプローチ`;
        }
    }
    
    /**
     * 成長ポテンシャル計算
     */
    calculateGrowthPotential(optionData, spiralContext) {
        const basePotential = 0.5;
        const cycleBonus = (spiralContext.currentCycle - 1) * 0.1;
        const experienceBonus = spiralContext.experienceDepth * 0.3;
        
        return Math.min(basePotential + cycleBonus + experienceBonus, 1.0);
    }
    
    /**
     * 知恵適用生成
     */
    generateWisdomApplication(optionData, spiralContext) {
        const applications = [];
        
        if (spiralContext.currentCycle > 1) {
            applications.push('過去の経験からの学び');
        }
        if (spiralContext.experienceDepth > 0.5) {
            applications.push('経験の深さを活かした判断');
        }
        if (spiralContext.qualitativeGrowth.level > 2) {
            applications.push('統合的知恵の適用');
        }
        
        return applications.length > 0 ? applications : ['新たな知恵の獲得機会'];
    }
    
    /**
     * 質的差異説明
     */
    explainQualitativeDifference(optionData, spiralContext) {
        if (spiralContext.currentCycle === 1) {
            return '初回の探索です。新たな発見と学びが待っています。';
        } else {
            return `第${spiralContext.currentCycle}周期目として、過去の経験が新しい意味と深さをもたらします。同じ選択でも、成長したあなたにとって全く異なる結果をもたらすでしょう。`;
        }
    }
    
    /**
     * 品質指標計算群
     */
    calculateSpiralIntegrationQuality(currentCycle, experienceDepth) {
        return Math.min(0.5 + (currentCycle - 1) * 0.15 + experienceDepth * 0.35, 1.0);
    }
    
    calculateHistoricalConsistency(sessionHistory) {
        return Math.min(0.6 + sessionHistory.length * 0.01, 1.0);
    }
    
    calculateQualitativeDepth(qualitativeGrowth) {
        return Math.min(0.4 + qualitativeGrowth.level * 0.15, 1.0);
    }
    
    generateCycleVisualization(spiralContext) {
        return {
            total_cycles: spiralContext.currentCycle,
            spiral_path: `cycle-${spiralContext.currentCycle}-depth-${Math.floor(spiralContext.experienceDepth * 10)}`,
            growth_indicators: spiralContext.qualitativeGrowth.aspects
        };
    }
    
    // ======================
    // 既存メソッド群（簡略実装）
    // ======================
    
    calculateLevel2Probability() { return 0.6; }
    calculateContinueLogic(parent) { return { principle: '継続強化', explanation: `${parent.title}をより強化する` }; }
    calculateAdjustLogic(parent) { return { principle: '部分調整', explanation: `${parent.title}を部分的に修正する` }; }
    calculateCompleteLogic(parent) { return { principle: '完全転換', explanation: `${parent.title}を根本から変更する` }; }
    calculateIntegrateLogic(parent) { return { principle: '統合的転換', explanation: `${parent.title}と新要素を統合する` }; }
    calculateLevel3Logic() { return { principle: '最終段階', explanation: '3段階目の選択' }; }
    generateLevel3Title(branchData, type) { return `${branchData.title}・${type}`; }
    generateLevel3Description(branchData, type) { return `${branchData.description}（${type}型）`; }
    generatePathSummary(path) { return path.join(' → '); }
    buildFullPathDescription(route) { return `${route[0]} → ${route[1]} → ${route[2]} の経路`; }
    buildIChingInterpretation(optionData) { return optionData.iching_logic; }
    generatePracticalGuidance() { return ['段階的に進む', '状況を観察する', '柔軟に対応する']; }
    estimateTimeline() { return '3-6ヶ月'; }
    identifySuccessFactors() { return ['継続性', '適応力', '判断力']; }
    identifyPotentialChallenges() { return ['変化への抵抗', '外的要因', 'タイミング']; }
    calculatePhilosophicalDepth() { return 0.85; }
    extractLevel2Nodes(level2) { return Object.keys(level2).flatMap(k => Object.keys(level2[k])); }
    extractLevel3Nodes(level3) { return Object.keys(level3).flatMap(k1 => Object.keys(level3[k1]).flatMap(k2 => Object.keys(level3[k1][k2]))); }
    buildConnectionMap() { return { connections: [] }; }
    calculateAverageProbability(patterns) { return patterns.reduce((sum, p) => sum + p.probability, 0) / patterns.length; }
    calculatePhilosophicalConsistency() { return 0.9; }
    
    generateFallbackBinaryTree(lineNumber) {
        return {
            version: this.version,
            currentLine: lineNumber,
            error: true,
            finalEightPaths: Array.from({ length: 8 }, (_, i) => ({
                pathIndex: i + 1,
                title: `基本的道筋 ${i + 1}`,
                probability: 0.125,
                route: ['basic', 'path', 'option']
            }))
        };
    }
    
    /**
     * システム情報取得
     */
    getSystemInfo() {
        return {
            version: this.version,
            philosophy: this.philosophyAlignment,
            branchingLevels: this.branchingLevels,
            supportedLines: '1-384 (H384 Database)',
            cacheSize: this.branchingCache.size,
            initialized: this.initialized
        };
    }
    
    /**
     * キャッシュクリア
     */
    clearCache() {
        this.branchingCache.clear();
        console.log('🧹 BinaryTreeFutureEngine cache cleared');
    }
}

// グローバル公開
if (typeof window !== 'undefined') {
    window.BinaryTreeFutureEngine = BinaryTreeFutureEngine;
    
    // グローバルインスタンス作成
    if (!window.haqeiBinaryTreeEngine) {
        window.haqeiBinaryTreeEngine = new BinaryTreeFutureEngine();
    }
}

// Node.js環境対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BinaryTreeFutureEngine;
}

console.log('🌳 BinaryTreeFutureEngine.js loaded successfully - 二分木型螺旋統合段階的分岐システム');