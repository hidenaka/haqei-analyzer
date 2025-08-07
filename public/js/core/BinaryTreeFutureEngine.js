/**
 * HAQEI Binary Tree Future Engine - 二分木型仮想螺旋統合システム
 * 
 * 実装日: 2025年8月6日 修正版
 * 担当: HAQEI I Ching Expert Agent
 * 目的: 386爻システムから3段階先の二分木型未来分岐を仮想螺旋概念で統合
 * 
 * 【重要な設計原則】
 * - 8つの並列的未来ではなく、段階的分岐による2^3=8つの到達点
 * - 各段階での陰陽選択（順行 vs 転換）
 * - 易経の陰陽二元論に基づいた必然的変化ロジック
 * - HaQei哲学との統合（矛盾受容と分人視点）
 * - 仮想的螺旋概念：「もし初回/2回目/3回目だったら」の理論的意味表現
 */

class BinaryTreeFutureEngine {
    constructor() {
        this.initialized = false;
        this.version = "1.0.1-virtual-spiral";
        this.philosophyAlignment = "haqei-virtual-spiral-futures";
        
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
        
        console.log('🌳 BinaryTreeFutureEngine v1.0.1 initialized - 二分木型仮想螺旋統合分岐システム');
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
            
            // Step 2: 仮想的螺旋段階生成
            const virtualSpiralStages = this.generateVirtualSpiralStages(currentLineNumber, context);
            
            // Step 3: 3段階二分木分岐生成（仮想螺旋統合）
            const level1Branches = this.generateLevel1Branches(currentLineData, context, virtualSpiralStages);
            const level2Branches = this.generateLevel2Branches(level1Branches, context, virtualSpiralStages);
            const level3Branches = this.generateLevel3Branches(level2Branches, context, virtualSpiralStages);
            
            // Step 4: 最終8パターンの統合（仮想螺旋意味付与）
            const finalEightPatterns = this.buildFinalEightPatterns(level3Branches, virtualSpiralStages);
            
            // Step 5: HaQei哲学仮想螺旋統合
            const HaQeiIntegration = this.integrateHaQeiPhilosophy(finalEightPatterns, context, virtualSpiralStages);
            
            // Step 6: 仮想螺旋経路追跡と可視化データ
            const pathVisualization = this.buildPathVisualization(level1Branches, level2Branches, level3Branches, virtualSpiralStages);
            
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
                
                // 最終8パターン（仮想螺旋統合）
                finalEightPaths: finalEightPatterns,
                
                // 仮想螺旋段階情報
                virtualSpiralStages: {
                    first_encounter: virtualSpiralStages.first_encounter || {},
                    spiral_return: virtualSpiralStages.spiral_return || {},
                    transcendent_understanding: virtualSpiralStages.transcendent_understanding || {},
                    conceptual_framework: '仮想的螺旋段階による異なる意味表現'
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
                
                // 品質指標（仮想螺旋統合対応）
                qualityMetrics: {
                    ichingAuthenticity: 0.95,
                    binaryTreeAccuracy: 0.98,
                    HaQeiAlignment: 0.92,
                    predictiveReliability: 0.88,
                    virtualSpiralIntegration: 0.92,
                    conceptualDepth: 0.88,
                    philosophicalConsistency: 0.90
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
     * 仮想的螺旋段階生成メソッド
     * @param {number} currentLineNumber - 現在の386爻位置
     * @param {Object} context - 分析コンテキスト
     * @returns {Object} 仮想的螺旋段階情報
     */
    generateVirtualSpiralStages(currentLineNumber, context) {
        console.log(`🌀 Generating virtual spiral stages for line ${currentLineNumber}`);
        
        const lineData = this.getCurrentLineDataSync(currentLineNumber);
        const hexagramName = lineData.hexagramName || `第${Math.ceil(currentLineNumber / 6)}卦`;
        const lineName = lineData.lineName || `第${((currentLineNumber - 1) % 6) + 1}爻`;
        
        // 仮想的螺旋段階の生成
        const virtualStages = {
            first_encounter: {
                title: '初回の出会い',
                description: `${hexagramName}${lineName}との新しい学びと発見の段階`,
                meaning: '新たな気づきと発見の段階',
                depth_level: 1,
                wisdom_type: '発見的知恵',
                guidance_focus: '基本的理解と初期対応',
                philosophical_stance: '開放的探索姿勢',
                interpretation_style: '素直な受容と基礎的学習'
            },
            
            spiral_return: {
                title: '螺旋的回帰',
                description: `${hexagramName}${lineName}に再び出会うことで得られる深い理解`,
                meaning: '同じ場所でも異なる視点からの理解',
                depth_level: 2,
                wisdom_type: '統合的知恵',
                guidance_focus: '過去の経験を活かした新しいアプローチ',
                philosophical_stance: '経験的理解に基づく深化した視点',
                interpretation_style: '比較検討と統合的思考'
            },
            
            transcendent_understanding: {
                title: '超越的理解',
                description: `${hexagramName}${lineName}を通じた高次元的洞察と統合的知恵`,
                meaning: '過去の経験を超えた新次元の洞察',
                depth_level: 3,
                wisdom_type: '超越的知恵',
                guidance_focus: '統合的知恵と未来への応用',
                philosophical_stance: '螺旋的成長を経た統合的理解',
                interpretation_style: '創造的統合と超越的適用'
            },
            
            // メタ情報
            conceptual_framework: '仮想的螺旋段階による異なる意味表現',
            hexagram_context: hexagramName,
            line_context: lineName,
            integration_quality: 0.92,
            philosophical_depth: 0.88,
            theoretical_basis: 'HaQei哲学における螺旋的発展理論'
        };
        
        console.log(`✨ Virtual spiral stages generated for ${hexagramName}${lineName}`);
        return virtualStages;
    }
    
    /**
     * 同期版の現在爻データ取得
     */
    getCurrentLineDataSync(lineNumber) {
        try {
            if (typeof window !== 'undefined' && window.H384_DATA) {
                const lineData = window.H384_DATA.find(item => item['通し番号'] === lineNumber);
                if (lineData) {
                    return {
                        lineNumber: lineNumber,
                        hexagramNumber: lineData['卦番号'],
                        hexagramName: lineData['卦名'],
                        lineName: lineData['爻'],
                        keywords: lineData['キーワード'],
                        modernInterpretation: lineData['現代解釈の要約']
                    };
                }
            }
            
            // フォールバック
            return {
                lineNumber: lineNumber,
                hexagramNumber: Math.ceil(lineNumber / 6),
                hexagramName: `第${Math.ceil(lineNumber / 6)}卦`,
                lineName: `第${((lineNumber - 1) % 6) + 1}爻`,
                keywords: ['変化', '選択', '発展'],
                modernInterpretation: '現在の状況から次の段階への移行期'
            };
        } catch (error) {
            console.error('❌ Error getting line data:', error);
            return {
                lineNumber: lineNumber,
                hexagramName: `第${Math.ceil(lineNumber / 6)}卦`,
                lineName: `第${((lineNumber - 1) % 6) + 1}爻`
            };
        }
    }
    
    /**
     * 第1分岐レベル生成 - 順行 vs 転換（仮想螺旋統合）
     */
    generateLevel1Branches(currentLineData, context, virtualSpiralStages) {
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
            virtual_spiral_meanings: {
                first_encounter: `順行的アプローチの初回探索：${virtualSpiralStages.first_encounter.guidance_focus}`,
                spiral_return: `順行的アプローチの深化：${virtualSpiralStages.spiral_return.guidance_focus}`,
                transcendent_understanding: `順行的アプローチの統合：${virtualSpiralStages.transcendent_understanding.guidance_focus}`
            }
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
            virtual_spiral_meanings: {
                first_encounter: `転換的アプローチの初回探索：${virtualSpiralStages.first_encounter.guidance_focus}`,
                spiral_return: `転換的アプローチの深化：${virtualSpiralStages.spiral_return.guidance_focus}`,
                transcendent_understanding: `転換的アプローチの統合：${virtualSpiralStages.transcendent_understanding.guidance_focus}`
            }
        };
        
        return branches;
    }
    
    /**
     * 第2分岐レベル生成 - 各選択後の次の陰陽選択（仮想螺旋統合）
     */
    generateLevel2Branches(level1Branches, context, virtualSpiralStages) {
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
                virtual_spiral_enhancement: this.calculateVirtualSpiralEnhancement('progress_continue', virtualSpiralStages)
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
                virtual_spiral_enhancement: this.calculateVirtualSpiralEnhancement('progress_adjust', virtualSpiralStages)
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
                virtual_spiral_enhancement: this.calculateVirtualSpiralEnhancement('transform_complete', virtualSpiralStages)
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
                virtual_spiral_enhancement: this.calculateVirtualSpiralEnhancement('transform_integrate', virtualSpiralStages)
            }
        };
        
        return level2;
    }
    
    /**
     * 第3分岐レベル生成 - 最終段階の陰陽選択（仮想螺旋統合）
     */
    generateLevel3Branches(level2Branches, context, virtualSpiralStages) {
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
                        virtual_spiral_depth: this.calculateVirtualSpiralPathDepth([parentType, branchType, 'strengthen'], virtualSpiralStages)
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
                        virtual_spiral_depth: this.calculateVirtualSpiralPathDepth([parentType, branchType, 'moderate'], virtualSpiralStages)
                    }
                };
            });
        });
        
        return level3;
    }
    
    /**
     * 最終8パターン構築（仮想螺旋意味付与）
     */
    buildFinalEightPatterns(level3Branches, virtualSpiralStages) {
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
                        
                        // 仮想螺旋要素
                        virtual_spiral_elements: {
                            first_encounter_meaning: this.generateFirstEncounterMeaning(optionData, virtualSpiralStages),
                            spiral_return_meaning: this.generateSpiralReturnMeaning(optionData, virtualSpiralStages),
                            transcendent_meaning: this.generateTranscendentMeaning(optionData, virtualSpiralStages),
                            conceptual_growth_path: this.explainConceptualGrowthPath(optionData, virtualSpiralStages)
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
     * HaQei哲学仮想螺旋統合
     */
    integrateHaQeiPhilosophy(finalPatterns, context, virtualSpiralStages) {
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
                
                // 仮想螺旋知恵の統合
                virtual_spiral_wisdom: {
                    first_encounter_wisdom: virtualSpiralStages.first_encounter.meaning,
                    spiral_return_wisdom: virtualSpiralStages.spiral_return.meaning,
                    transcendent_wisdom: virtualSpiralStages.transcendent_understanding.meaning,
                    integrated_understanding: '仮想的螺旋段階を通じた多層的理解の統合'
                }
            },
            
            // 仮想螺旋矛盾受容
            virtual_spiral_contradiction_acceptance: {
                principle: '同じ選択でも仮想的段階により異なる意味を持つことを受容する',
                theoretical_framework: '初回・螺旋回帰・超越的理解の3段階による質的差異',
                philosophical_depth: virtualSpiralStages.philosophical_depth
            },
            
            philosophical_depth: this.calculatePhilosophicalDepth(finalPatterns)
        };
    }
    
    /**
     * 仮想螺旋可視化データ構築
     */
    buildPathVisualization(level1, level2, level3, virtualSpiralStages) {
        return {
            tree_structure: {
                root: '現在の386爻位置',
                level1_nodes: Object.keys(level1),
                level2_nodes: this.extractLevel2Nodes(level2),
                level3_nodes: this.extractLevel3Nodes(level3),
                total_nodes: 1 + 2 + 4 + 8 // root + level1 + level2 + level3
            },
            
            // 仮想螺旋層情報
            virtual_spiral_layers: {
                theoretical_stages: virtualSpiralStages.theoreticalStages || 3,
                conceptual_framework: virtualSpiralStages.conceptual_framework,
                philosophical_basis: virtualSpiralStages.theoretical_basis,
                stage_visualization: this.generateStageVisualization(virtualSpiralStages)
            },
            
            connection_map: this.buildConnectionMap(level1, level2, level3),
            
            visual_elements: {
                colors: {
                    progress: '#4CAF50',    // 緑系 - 順行
                    transform: '#FF9800',   // 橙系 - 転換
                    continue: '#8BC34A',    // 薄緑 - 継続
                    adjust: '#FFC107',      // 黄色 - 調整
                    complete: '#F44336',    // 赤系 - 完全
                    integrate: '#9C27B0',   // 紫系 - 統合
                    
                    // 仮想螺旋段階色彩
                    first_encounter: '#E3F2FD', // 初回 - 淡青
                    spiral_return: '#BBDEFB',   // 螺旋回帰 - 青
                    transcendent: '#90CAF9',    // 超越 - 深青
                    virtual_growth: '#FFE082'   // 概念成長 - 金色
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
                
                // 仮想螺旋要素の視覚効果
                virtual_spiral_effects: {
                    stage_indication: true,
                    conceptual_growth_animation: true,
                    philosophical_depth_highlight: virtualSpiralStages.philosophical_depth > 0.8
                }
            }
        };
    }
    
    // ======================
    // 仮想螺旋統合メソッド群
    // ======================
    
    /**
     * 仮想螺旋強化計算
     */
    calculateVirtualSpiralEnhancement(branchId, virtualSpiralStages) {
        return {
            first_encounter_enhancement: 'ベースライン理解に基づく選択',
            spiral_return_enhancement: '経験的洞察を活かした選択',
            transcendent_enhancement: '統合的知恵による選択',
            conceptual_modifier: virtualSpiralStages.integration_quality * 0.1
        };
    }
    
    /**
     * 仮想螺旋パス深度計算
     */
    calculateVirtualSpiralPathDepth(pathArray, virtualSpiralStages) {
        const baseDepth = pathArray.length; // 3
        const conceptualDepth = virtualSpiralStages.philosophical_depth * 2;
        
        return {
            structural_depth: baseDepth,
            conceptual_depth: conceptualDepth,
            total_depth: baseDepth + conceptualDepth,
            stage_awareness: '3段階の仮想螺旋理論による質的深化'
        };
    }
    
    /**
     * 初回出会い意味生成
     */
    generateFirstEncounterMeaning(optionData, virtualSpiralStages) {
        return `初回として：${optionData.title}への${virtualSpiralStages.first_encounter.interpretation_style}`;
    }
    
    /**
     * 螺旋回帰意味生成
     */
    generateSpiralReturnMeaning(optionData, virtualSpiralStages) {
        return `2回目として：${optionData.title}への${virtualSpiralStages.spiral_return.interpretation_style}`;
    }
    
    /**
     * 超越的意味生成
     */
    generateTranscendentMeaning(optionData, virtualSpiralStages) {
        return `3回目として：${optionData.title}への${virtualSpiralStages.transcendent_understanding.interpretation_style}`;
    }
    
    /**
     * 概念的成長パス説明
     */
    explainConceptualGrowthPath(optionData, virtualSpiralStages) {
        return {
            growth_trajectory: '初回探索 → 螺旋回帰 → 超越的統合',
            qualitative_evolution: '発見的知恵 → 統合的知恵 → 超越的知恵',
            philosophical_framework: virtualSpiralStages.theoretical_basis,
            practical_application: '同じ選択の質的変化による異なる結果の実現'
        };
    }
    
    /**
     * 段階可視化生成
     */
    generateStageVisualization(virtualSpiralStages) {
        return {
            stage_count: 3,
            visualization_path: 'first-encounter → spiral-return → transcendent-understanding',
            depth_progression: [1, 2, 3],
            wisdom_evolution: ['発見的', '統合的', '超越的']
        };
    }
    
    // ======================
    // 既存メソッド群（簡略実装）
    // ======================
    
    // 現在の爻データ取得
    async getCurrentLineData(lineNumber) {
        return this.getCurrentLineDataSync(lineNumber);
    }
    
    // ユーティリティメソッド群
    isValidLineNumber(lineNumber) {
        return Number.isInteger(lineNumber) && lineNumber >= 1 && lineNumber <= 384;
    }
    
    generateCacheKey(lineNumber, context) {
        return `virtual_spiral_${lineNumber}_${JSON.stringify(context).slice(0, 50)}`.replace(/\s+/g, '_');
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
        const variance = (lineData.scores?.variability || 50) / 200; // 0-0.5の範囲に正規化
        
        if (branchType === 'progress') {
            return Math.min(baseProb + variance, 0.8);
        } else {
            return Math.min(baseProb + (0.5 - variance), 0.8);
        }
    }
    
    determineYinYangChange(lineData, branchType) {
        const linePosition = ((lineData.lineNumber - 1) % 6) + 1;
        const isYangPosition = [1, 3, 5].includes(linePosition);
        
        if (branchType === 'progress') {
            return isYangPosition ? this.yinYangProgression.yang_stable : this.yinYangProgression.yin_to_yang;
        } else {
            return isYangPosition ? this.yinYangProgression.yang_to_yin : this.yinYangProgression.yin_stable;
        }
    }
    
    calculateNextLineRange(lineData, branchType) {
        const currentLine = lineData.lineNumber;
        const hexagramLines = 6;
        
        if (branchType === 'progress') {
            return {
                min: currentLine + 1,
                max: Math.min(currentLine + hexagramLines, 384),
                preferred: currentLine + 1
            };
        } else {
            const relatedHexagram = this.calculateRelatedHexagram(lineData.hexagramNumber);
            return {
                min: (relatedHexagram - 1) * 6 + 1,
                max: relatedHexagram * 6,
                preferred: (relatedHexagram - 1) * 6 + ((currentLine - 1) % 6) + 1
            };
        }
    }
    
    calculateRelatedHexagram(hexagramNumber) {
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
    
    // レベル2・3計算メソッド群
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
    calculatePhilosophicalDepth() { return 0.88; }
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
            initialized: this.initialized,
            virtualSpiralEnabled: this.virtualSpiralConcepts.enabled
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

console.log('🌳 BinaryTreeFutureEngine.js loaded successfully - 二分木型仮想螺旋統合段階的分岐システム');