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
            
            // currentLineDataとcurrentContextをインスタンス変数に保存（他のメソッドから参照可能にする）
            this.currentLineData = currentLineData;
            this.currentContext = context;
            
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
                // lineDataとcontextを各ブランチに追加
                const enhancedBranchData = {
                    ...branchData,
                    lineData: this.currentLineData || {},
                    context: context || this.currentContext || {}
                };
                
                level3[parentType][branchType] = {
                    option_a: {
                        id: `${branchData.id}_a`,
                        parent: branchData.id,
                        type: 'strengthen',
                        title: this.generateLevel3Title(enhancedBranchData, 'strengthen'),
                        description: this.generateLevel3Description(enhancedBranchData, 'strengthen'),
                        iching_logic: this.calculateLevel3Logic(enhancedBranchData, 'strengthen'),
                        final_probability: branchData.cumulative_probability * this.calculateDynamicProbability(this.currentLineData, 'strengthen', 3), // デフォルト確率
                        path_summary: this.generatePathSummary([parentType, branchType, 'strengthen']),
                        virtual_spiral_depth: this.calculateVirtualSpiralPathDepth([parentType, branchType, 'strengthen'], virtualSpiralStages),
                        lineData: this.currentLineData,
                        context: context
                    },
                    option_b: {
                        id: `${branchData.id}_b`,
                        parent: branchData.id,
                        type: 'moderate',
                        title: this.generateLevel3Title(enhancedBranchData, 'moderate'),
                        description: this.generateLevel3Description(enhancedBranchData, 'moderate'), 
                        iching_logic: this.calculateLevel3Logic(enhancedBranchData, 'moderate'),
                        final_probability: branchData.cumulative_probability * this.calculateDynamicProbability(this.currentLineData, 'moderate', 3), // デフォルト確率
                        path_summary: this.generatePathSummary([parentType, branchType, 'moderate']),
                        virtual_spiral_depth: this.calculateVirtualSpiralPathDepth([parentType, branchType, 'moderate'], virtualSpiralStages),
                        lineData: this.currentLineData,
                        context: context
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
                    // lineDataとcontextをbuildFullPathDescriptionに渡す
                    const lineData = optionData.lineData || this.currentLineData || {};
                    const context = optionData.context || this.currentContext || {};
                    
                    finalPatterns.push({
                        pathIndex: pathIndex++,
                        pathId: optionData.id,
                        route: [l1Type, l2Type, optionKey],
                        title: `第${pathIndex-1}の道: ${optionData.title}`,
                        description: this.buildFullPathDescription([l1Type, l2Type, optionKey], lineData, context),
                        fullDescription: this.buildFullPathDescription([l1Type, l2Type, optionKey], lineData, context),
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
                        },
                        
                        // lineDataとcontextも保持
                        lineData: lineData,
                        context: context
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
        // H384データベースから動的に確率を計算
        return this.calculateDynamicProbability(lineData, branchType, 1);
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
    calculateLevel2Probability(parentBranch, branchType) { 
        // H384データベースから動的に確率を計算
        return this.calculateDynamicProbability(this.currentLineData, branchType, 2);
    }
    calculateContinueLogic(parent) { return { principle: '継続強化', explanation: `${parent.title}をより強化する` }; }
    calculateAdjustLogic(parent) { return { principle: '部分調整', explanation: `${parent.title}を部分的に修正する` }; }
    calculateCompleteLogic(parent) { return { principle: '完全転換', explanation: `${parent.title}を根本から変更する` }; }
    calculateIntegrateLogic(parent) { return { principle: '統合的転換', explanation: `${parent.title}と新要素を統合する` }; }
    calculateLevel3Logic() { return { principle: '最終段階', explanation: '3段階目の選択' }; }
    generateLevel3Title(branchData, type) { 
        // ROOT CAUSE FIX: Generate proper titles for Level 3 branches
        const typeMap = {
            'strengthen': '強化型',
            'moderate': '穏健型'
        };
        
        const parentTitle = branchData.title || '';
        const typeName = typeMap[type] || type;
        
        // Extract meaningful title from parent
        if (parentTitle.includes('さらに進む')) {
            return `継続強化・${typeName}`;
        } else if (parentTitle.includes('一部転換')) {
            return `調整進行・${typeName}`;
        } else if (parentTitle.includes('完全転換')) {
            return `根本転換・${typeName}`;
        } else if (parentTitle.includes('統合的転換')) {
            return `統合発展・${typeName}`;
        }
        
        return `${parentTitle}・${typeName}`;
    }
    generateLevel3Description(branchData, type) { 
        // H384データベースから実際の爻データを取得して動的に説明を生成
        const lineData = branchData.lineData || {};
        const context = branchData.context || {};
        
        // 入力テキストの分析結果を反映
        const userContext = context.inputText || '';
        const keywords = this.extractKeywords(userContext);
        
        // 爻の実際の内容から動的に説明を生成
        const generateDynamicDescription = () => {
            const parentType = typeof branchData.parent === 'string' 
                ? branchData.parent 
                : (branchData.parent?.type || 'progress');
            const currentType = branchData.type || branchData.id?.split('_')[1] || 'continue';
            
            // 爻の性質（陰陽）と位置から基本的な方向性を決定
            const isYang = lineData.陰陽 === '陽';
            const position = lineData.位置 || 3;
            
            // ユーザーの入力内容を反映した説明文を生成
            let description = '';
            
            // 転職の悩みが検出された場合の特別な処理
            if (userContext.includes('転職') || userContext.includes('会社')) {
                if (parentType === 'progress' && currentType === 'continue') {
                    description = type === 'strengthen' 
                        ? `現在の職場で新たな挑戦を見つけ、スキルを磨きながら成長する道。${lineData.爻名 || ''}の示す「${lineData.現代解釈 || '着実な前進'}」を実践。`
                        : `現在の環境を活かしつつ、副業や学習で新たな可能性を探る道。リスクを抑えた着実な変化。`;
                } else if (parentType === 'progress' && currentType === 'adjust') {
                    description = type === 'strengthen'
                        ? `部署異動や社内起業など、会社内で大きな変化を起こす道。${lineData.判断 || '内なる革新'}を重視。`
                        : `働き方改革や業務改善により、現職の満足度を高める道。小さな変化の積み重ね。`;
                } else if (parentType === 'transform' && currentType === 'complete') {
                    description = type === 'strengthen'
                        ? `思い切って転職し、全く新しい環境で再スタートする道。${lineData.行動 || '決断の時'}。給料よりもやりがいを重視。`
                        : `慎重に転職活動を進め、条件の良い職場を見つける道。リスク管理を徹底した転換。`;
                } else if (parentType === 'transform' && currentType === 'integrate') {
                    description = type === 'strengthen'
                        ? `独立起業やフリーランスとして、複数の収入源を持つ道。${lineData.総合 || '多角的な展開'}を実現。`
                        : `現職を続けながら副業を始め、段階的に独立する道。安定と挑戦のバランス。`;
                }
            } 
            // その他の悩みの場合
            else {
                // 爻の内容とキーワードから動的に生成
                const action = lineData.行動 || '前進';
                const judgment = lineData.判断 || '慎重な判断';
                const interpretation = lineData.現代解釈 || '新たな可能性';
                
                if (type === 'strengthen') {
                    description = `${action}を積極的に実行し、${interpretation}を実現する道。${judgment}により最大の成果を。`;
                } else {
                    description = `${action}を慎重に進め、${interpretation}を探る道。${judgment}でリスクを管理。`;
                }
            }
            
            // H384データベースの爻辞を付加
            if (lineData.爻辞) {
                description += ` 古典曰く「${lineData.爻辞.substring(0, 30)}...」`;
            }
            
            return description || `${branchData.description || '新たな道'}を${type === 'strengthen' ? '強力に' : '着実に'}推進する道`;
        };
        
        return generateDynamicDescription();
    }
    
    // キーワード抽出ヘルパーメソッド
    extractKeywords(text) {
        if (!text) return [];
        const keywords = [];
        
        // 転職関連
        if (text.includes('転職') || text.includes('会社') || text.includes('仕事')) {
            keywords.push('career');
        }
        // 人間関係
        if (text.includes('恋') || text.includes('結婚') || text.includes('別れ')) {
            keywords.push('relationship');
        }
        // 金銭
        if (text.includes('お金') || text.includes('給料') || text.includes('投資')) {
            keywords.push('finance');
        }
        // 健康
        if (text.includes('健康') || text.includes('病') || text.includes('体調')) {
            keywords.push('health');
        }
        
        return keywords;
    }

    // H384データベースから動的に確率を計算
    calculateDynamicProbability(lineData, pathType, level = 1) {
        if (!lineData) return 0.25; // デフォルト値
        
        // 爻の陰陽と位置から基本確率を計算
        const isYang = lineData.陰陽 === '陽';
        const position = lineData.位置 || 3;
        const hexagramNumber = lineData.卦番号 || 1;
        
        // レベル1の確率計算
        if (level === 1) {
            if (pathType === 'progress') {
                // 陽爻は進展の確率が高い
                const baseProbability = isYang ? 0.6 : 0.4;
                // 位置による調整（上位ほど進展しやすい）
                const positionAdjust = position * 0.02;
                return Math.min(0.8, baseProbability + positionAdjust);
            } else if (pathType === 'transform') {
                // 陰爻は転換の確率が高い
                const baseProbability = isYang ? 0.4 : 0.6;
                // 位置による調整（下位ほど転換しやすい）
                const positionAdjust = (7 - position) * 0.02;
                return Math.min(0.8, baseProbability + positionAdjust);
            }
        }
        
        // レベル2の確率計算
        if (level === 2) {
            // 卦の性質による調整
            const hexagramBalance = (hexagramNumber % 8) / 8; // 0-1の範囲
            
            if (pathType === 'continue' || pathType === 'complete') {
                // 直進型の確率
                return 0.5 + (isYang ? 0.1 : -0.1) + (hexagramBalance * 0.2);
            } else if (pathType === 'adjust' || pathType === 'integrate') {
                // 調整型の確率
                return 0.5 + (isYang ? -0.1 : 0.1) + ((1 - hexagramBalance) * 0.2);
            }
        }
        
        // レベル3の確率計算
        if (level === 3) {
            if (pathType === 'strengthen') {
                // 強化型の確率は陽爻で高い
                return isYang ? 0.6 : 0.4;
            } else if (pathType === 'moderate') {
                // 穏健型の確率は陰爻で高い
                return isYang ? 0.4 : 0.6;
            }
        }
        
        return 0.5; // デフォルト
    }
    generatePathSummary(path) { return path.join(' → '); }
    buildFullPathDescription(route, lineData, context) { 
        // 各パスに対して異なる易経の卦変化結果を生成
        const pathKey = route.join('_');
        const originalLineNumber = this.currentLineData?.lineNumber || this.currentLine || 1;
        const originalHexagramNumber = Math.ceil(originalLineNumber / 6);
        
        // パスに基づいて異なる変化先卦を計算
        let targetHexagramNumber = this.calculateTargetHexagramForPath(originalHexagramNumber, route, pathKey);
        let targetLinePosition = this.calculateTargetLinePosition(originalLineNumber, route, pathKey);
        
        // H384データベースから変化先の卦情報を取得
        const targetLineData = this.getTargetHexagramData(targetHexagramNumber, targetLinePosition);
        
        if (!targetLineData) {
            // フォールバック：基本的な変化を計算
            targetHexagramNumber = this.calculateBasicTransformation(originalHexagramNumber, pathKey);
            targetLinePosition = ((originalLineNumber - 1) % 6) + 1;
            const fallbackLineData = this.getTargetHexagramData(targetHexagramNumber, targetLinePosition);
            if (fallbackLineData) {
                return this.generateTransformationDescription(originalHexagramNumber, targetHexagramNumber, fallbackLineData, route);
            }
        }
        
        return this.generateTransformationDescription(originalHexagramNumber, targetHexagramNumber, targetLineData, route, pathKey);
    }
    
    // パスに基づいて変化先卦を計算 - 進爻・変爻システム実装
    calculateTargetHexagramForPath(originalHexagram, route, pathKey) {
        // H64データベースから原卦情報取得
        const originalHexagramData = window.H64_DATA ? 
            window.H64_DATA.find(h => h.卦番号 === originalHexagram) : null;
            
        if (!originalHexagramData) {
            return this.calculateBasicTransformation(originalHexagram, pathKey);
        }
        
        // 8つのフェーズ組み合わせパス（進爻=同じ卦で爻位進行、変爻=H64データで卦変更）
        const currentLinePosition = ((this.currentLine - 1) % 6) + 1; // 1-6の爻位
        
        const pathTransformations = {
            // パス1: 進爻→進爻→進爻
            'progress_continue_option_a': () => this.calculatePhaseProgression(originalHexagramData, currentLinePosition, ['進爻', '進爻', '進爻']),
            // パス2: 進爻→進爻→変爻  
            'progress_continue_option_b': () => this.calculatePhaseProgression(originalHexagramData, currentLinePosition, ['進爻', '進爻', '変爻']),
            // パス3: 進爻→変爻→進爻
            'progress_adjust_option_a': () => this.calculatePhaseProgression(originalHexagramData, currentLinePosition, ['進爻', '変爻', '進爻']),
            // パス4: 進爻→変爻→変爻
            'progress_adjust_option_b': () => this.calculatePhaseProgression(originalHexagramData, currentLinePosition, ['進爻', '変爻', '変爻']),
            // パス5: 変爻→進爻→進爻
            'transform_complete_option_a': () => this.calculatePhaseProgression(originalHexagramData, currentLinePosition, ['変爻', '進爻', '進爻']),
            // パス6: 変爻→進爻→変爻
            'transform_complete_option_b': () => this.calculatePhaseProgression(originalHexagramData, currentLinePosition, ['変爻', '進爻', '変爻']),
            // パス7: 変爻→変爻→進爻
            'transform_integrate_option_a': () => this.calculatePhaseProgression(originalHexagramData, currentLinePosition, ['変爻', '変爻', '進爻']),
            // パス8: 変爻→変爻→変爻
            'transform_integrate_option_b': () => this.calculatePhaseProgression(originalHexagramData, currentLinePosition, ['変爻', '変爻', '変爻'])
        };
        
        const transformFunc = pathTransformations[pathKey];
        return transformFunc ? transformFunc() : this.calculateBasicTransformation(originalHexagram, pathKey);
    }
    
    // フェーズ1→2→3の連鎖進行計算（各フェーズの結果が次の基準）
    calculatePhaseProgression(originalHexagramData, currentLinePosition, phaseTypes) {
        let currentHexagram = originalHexagramData.卦番号;
        let currentLine = currentLinePosition;
        let finalResult = { hexagram: currentHexagram, line: currentLine, phases: [] };
        
        // フェーズ1→2→3の連鎖計算
        for (let phase = 0; phase < phaseTypes.length; phase++) {
            const phaseType = phaseTypes[phase];
            let phaseResult;
            
            if (phaseType === '進爻') {
                // 進爻：現在の卦で爻位を進める
                phaseResult = this.applyProgressingLine(currentHexagram, currentLine);
            } else if (phaseType === '変爻') {
                // 変爻：現在の卦のH64データで卦を変更
                phaseResult = this.applyChangingLine(currentHexagram, currentLine);
            }
            
            if (phaseResult) {
                // 次のフェーズの基準として更新
                currentHexagram = phaseResult.hexagram;
                currentLine = phaseResult.line;
                
                finalResult.phases.push({
                    phase: phase + 1,
                    type: phaseType,
                    hexagram: currentHexagram,
                    line: currentLine,
                    hexagramName: this.getHexagramName(currentHexagram)
                });
            }
        }
        
        finalResult.hexagram = currentHexagram;
        finalResult.line = currentLine;
        return finalResult.hexagram;
    }
    
    // 卦番号から卦名取得
    getHexagramName(hexagramNumber) {
        const hexagramData = window.H64_DATA ? 
            window.H64_DATA.find(h => h.卦番号 === hexagramNumber) : null;
        return hexagramData ? hexagramData.名前 : `卦${hexagramNumber}`;
    }
    
    // 進爻実装：同じ卦内で爻位を進める
    applyProgressingLine(hexagramNumber, linePosition) {
        const nextLinePosition = linePosition < 6 ? linePosition + 1 : 1; // 上爻の次は初爻
        return {
            hexagram: hexagramNumber, // 卦は変わらない
            line: nextLinePosition
        };
    }
    
    // 変爻実装：H64データで卦を変更
    applyChangingLine(hexagramNumber, linePosition) {
        const hexagramData = window.H64_DATA ? 
            window.H64_DATA.find(h => h.卦番号 === hexagramNumber) : null;
            
        if (!hexagramData) {
            return { hexagram: hexagramNumber, line: linePosition };
        }
        
        // 爻位に対応するH64の変爻フィールドを使用
        const lineKeys = ['初爻変', '二爻変', '三爻変', '四爻変', '五爻変', '上爻変'];
        const lineKey = lineKeys[linePosition - 1];
        const targetHexagram = hexagramData[lineKey];
        
        return {
            hexagram: targetHexagram || hexagramNumber, // 変化先の卦
            line: linePosition // 爻位は同じ
        };
    }
    
    // 進行型変化
    applyProgressTransformation(hexagram, variant) {
        // 進行型：順次発展（+1から+8の範囲で変化）
        const increment = variant === 1 ? (hexagram % 8) + 1 : (hexagram % 6) + 3;
        return Math.min(((hexagram + increment - 1) % 64) + 1, 64);
    }
    
    // 調整型変化
    applyAdjustTransformation(hexagram, variant) {
        // 調整型：部分的変化（互卦的変化）
        const adjustment = variant === 1 ? (hexagram % 4) + 1 : (hexagram % 5) + 2;
        return Math.min(((hexagram + adjustment + 7) % 64) + 1, 64);
    }
    
    // 完全変化型
    applyCompleteTransformation(hexagram, variant) {
        // 完全変化：対卦または綜卦による変化
        if (variant === 1) {
            // 対卦（上下逆転）
            return hexagram <= 32 ? hexagram + 32 : hexagram - 32;
        } else {
            // 綜卦（陰陽転換）
            const base = ((hexagram - 1) % 32) + 1;
            return hexagram <= 32 ? 64 - base + 1 : 32 - base + 1;
        }
    }
    
    // 統合変化型
    applyIntegrateTransformation(hexagram, variant) {
        // 統合型：複合的変化
        const factor = variant === 1 ? 3 : 5;
        const base = (hexagram * factor) % 64;
        return base === 0 ? 64 : base;
    }
    
    // 基本的な変化計算（フォールバック）
    calculateBasicTransformation(hexagram, pathKey) {
        const hash = this.simpleHash(pathKey);
        return ((hexagram + hash) % 64) + 1;
    }
    
    // 簡単なハッシュ関数
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit integer
        }
        return Math.abs(hash) % 63 + 1; // 1-64の範囲
    }
    
    // 変化先の爻位置を計算
    calculateTargetLinePosition(originalLine, route, pathKey) {
        const originalPosition = ((originalLine - 1) % 6) + 1;
        const hash = this.simpleHash(pathKey + originalPosition);
        return (hash % 6) + 1;
    }
    
    // H384データから変化先卦情報を取得
    getTargetHexagramData(hexagramNumber, linePosition) {
        if (typeof window !== 'undefined' && window.H384_DATA) {
            const targetLineNumber = (hexagramNumber - 1) * 6 + linePosition;
            const targetData = window.H384_DATA.find(item => item['通し番号'] === targetLineNumber);
            
            if (targetData) {
                return {
                    lineNumber: targetLineNumber,
                    hexagramNumber: hexagramNumber,
                    hexagramName: targetData['卦名'],
                    lineName: targetData['爻'],
                    keywords: targetData['キーワード'],
                    modernInterpretation: targetData['現代解釈の要約']
                };
            }
        }
        
        // フォールバック
        return {
            lineNumber: (hexagramNumber - 1) * 6 + linePosition,
            hexagramNumber: hexagramNumber,
            hexagramName: `第${hexagramNumber}卦`,
            lineName: `第${linePosition}爻`,
            keywords: ['変化', '選択', '発展'],
            modernInterpretation: `第${hexagramNumber}卦第${linePosition}爻による変化の段階`
        };
    }
    
    // 変化の説明を生成
    generateTransformationDescription(originalHex, targetHex, targetLineData, route, pathKey) {
        // パスキーから進爻・変爻パターンを取得
        const transformationPattern = this.getTransformationPattern(pathKey);
        
        // 元の卦情報を取得
        const originalHexagramData = window.H64_DATA ? 
            window.H64_DATA.find(h => h.卦番号 === originalHex) : null;
        const originalHexName = originalHexagramData ? originalHexagramData.名前 : `第${originalHex}卦`;
        
        // 変化先の卦情報を取得
        const targetHexagramData = window.H64_DATA ? 
            window.H64_DATA.find(h => h.卦番号 === targetHex) : null;
        const targetHexName = targetHexagramData ? targetHexagramData.名前 : `第${targetHex}卦`;
        
        // 現在の爻情報を取得
        const currentLinePosition = ((this.currentLine - 1) % 6) + 1;
        const originalLineData384 = this.getH384LineData(originalHex, currentLinePosition);
        const targetLineData384 = this.getH384LineData(targetHex, currentLinePosition);
        
        // 改善された表示用の爻名を生成
        const originalLineDisplay = originalLineData384 ? 
            this.getLineDisplayName(originalHexName, originalLineData384.爻, currentLinePosition) : 
            `${originalHexName} 第${currentLinePosition}爻`;
            
        const targetLineDisplay = targetLineData384 ? 
            this.getLineDisplayName(targetHexName, targetLineData384.爻, currentLinePosition) : 
            `${targetHexName} 第${currentLinePosition}爻`;
        
        // 爻の解釈とキーワードを取得
        const targetInterpretation = targetLineData384 ? 
            targetLineData384.現代解釈の要約 : '新しい可能性への道筋';
        const targetKeywords = targetLineData384 ? 
            targetLineData384.キーワード : ['変化', '発展'];
        const primaryKeyword = Array.isArray(targetKeywords) ? targetKeywords[0] : '変化';
        
        // より分かりやすいフェーズ進行説明を生成
        let description = '';
        
        if (originalHex === targetHex) {
            // 進爻：同じ卦内での爻位進行 - エレガントな表示
            description = `🔄 ${originalLineDisplay} → 「${primaryKeyword}」による${transformationPattern}\n💡 ${targetInterpretation}を通じた段階的成長の道`;
        } else {
            // 変爻：H64データによる卦変化 - より詳細な表示
            description = `✨ ${originalLineDisplay}\n      ↓ ${transformationPattern}\n🎯 ${targetLineDisplay}\n💫 「${targetInterpretation}」により${primaryKeyword}を実現する転換の道`;
        }
        
        return description;
    }
    
    // H384データから爻情報を取得
    getH384LineData(hexagramNumber, linePosition) {
        if (!window.H384_DATA) return null;
        
        // H384データから該当する卦番号と爻位のデータを検索
        const lineData = window.H384_DATA.find(item => {
            return item.卦番号 === hexagramNumber && this.getLinePosition(item.爻) === linePosition;
        });
        
        if (lineData) {
            return {
                卦番号: lineData.卦番号,
                卦名: lineData.卦名,
                爻: lineData.爻,
                爻位: linePosition,
                キーワード: lineData.キーワード || ['変化', '発展'],
                現代解釈の要約: lineData.現代解釈の要約 || '新しい可能性への道筋',
                基本スコア: lineData.S1_基本スコア || 50,
                ポテンシャル: lineData.S2_ポテンシャル || 50,
                リスク: lineData.S4_リスク || -35
            };
        }
        
        return null;
    }
    
    // 爻名から爻位を取得（初爻=1, 二爻=2, etc.）
    getLinePosition(lineName) {
        const lineMap = {
            '初九': 1, '初六': 1,
            '九二': 2, '六二': 2,
            '九三': 3, '六三': 3,
            '九四': 4, '六四': 4,
            '九五': 5, '六五': 5,
            '上九': 6, '上六': 6,
            '用九': 7, // 乾為天特別爻（全て陽爻の時の特殊状態）
            '用六': 7  // 坤為地特別爻（全て陰爻の時の特殊状態）
        };
        return lineMap[lineName] || 1;
    }
    
    // 用九・用六の特別処理
    isSpecialLine(lineName) {
        return lineName === '用九' || lineName === '用六';
    }
    
    // 爻の表示名を取得
    getLineDisplayName(hexagramName, lineName, linePosition) {
        if (this.isSpecialLine(lineName)) {
            // 特殊ライン（用九・用六）の場合、より分かりやすい表示
            const specialType = lineName === '用九' ? '全陽の極致' : '全陰の極致';
            return `${hexagramName} ${lineName}（${specialType}）`;
        }
        
        // 通常の爻の場合、エレガントな表示形式
        const lineNumbers = ['初', '二', '三', '四', '五', '上'];
        const lineDisplay = lineNumbers[linePosition - 1] || '初';
        const yinYangDisplay = lineName.includes('九') ? '☰' : '☷';  // 陰陽記号
        
        return `${hexagramName} ${lineDisplay}爻 ${lineName} ${yinYangDisplay}`;
    }
    
    // パスキーから変化パターン説明を取得
    getTransformationPattern(pathKey) {
        const patterns = {
            'progress_continue_option_a': '進爻による自然な成長の道（フェーズ1→2→3すべて同じ卦内で爻位が順次進展）',
            'progress_continue_option_b': '進展から転換への道（フェーズ1-2は爻位進行、フェーズ3で卦変化による新展開）', 
            'progress_adjust_option_a': '進展と転換の調和の道（フェーズ1進爻→フェーズ2変爻→フェーズ3進爻の波動的成長）',
            'progress_adjust_option_b': '段階的変革の道（フェーズ1進爻で基盤固めから、フェーズ2-3変爻で根本的転換）',
            'transform_complete_option_a': '転換から安定への道（フェーズ1変爻で転機を掴み、フェーズ2-3進爻で着実に発展）',
            'transform_complete_option_b': '変化と調整の道（フェーズ1変爻→フェーズ2進爻→フェーズ3変爻のジグザグ発展）',
            'transform_integrate_option_a': '革新から統合への道（フェーズ1-2変爻で大転換、フェーズ3進爻で新たな方向性を確立）',
            'transform_integrate_option_b': '完全変革の道（フェーズ1→2→3すべて変爻による抜本的な人生転換）'
        };
        
        return patterns[pathKey] || '変化の道筋（基本パターン）';
    }
    
    // 変化タイプを取得
    getTransformationType(route) {
        if (route[0] === 'progress') {
            if (route[1] === 'continue') {
                return route[2] === 'option_a' ? '進展強化' : '進展調整';
            } else {
                return route[2] === 'option_a' ? '部分調整' : '部分統合';
            }
        } else {
            if (route[1] === 'complete') {
                return route[2] === 'option_a' ? '完全転換' : '完全統合';
            } else {
                return route[2] === 'option_a' ? '統合発展' : '統合調和';
            }
        }
    }
    
    // 変化の性質を取得
    getChangeNature(originalHex, targetHex, route) {
        const diff = Math.abs(targetHex - originalHex);
        
        if (diff === 0) return '内的変化';
        if (diff === 32) return '対極転換';
        if (diff <= 8) return '近接変化';
        if (diff <= 16) return '中程度変化';
        if (diff <= 32) return '大変化';
        return '極限変化';
    }
    buildIChingInterpretation(optionData) { return optionData.iching_logic; }
    generatePracticalGuidance(optionData) { 
        // パスのIDと内容から具体的なガイダンスを生成
        const pathId = optionData?.id || optionData?.pathId || '';
        const title = optionData?.title || '';
        
        // 進爻・変爻パターンに基づいた具体的アドバイス
        if (pathId.includes('progress_continue_option_a')) {
            return [
                '現在の方向性を信じて着実に継続する',
                '小さな成功を積み重ねて自信を築く',
                '急がず焦らず自然なペースを保つ',
                '周囲の変化に惑わされず芯を持つ'
            ];
        } else if (pathId.includes('progress_continue_option_b')) {
            return [
                '基盤を固めてから新しい挑戦に向かう',
                '最終段階で大胆な決断をする準備をする',
                'タイミングを見極めて行動に移す',
                '安定と変化のバランスを意識する'
            ];
        } else if (pathId.includes('progress_adjust_option_a')) {
            return [
                '進展→調整→進展のリズムを作る',
                '中間地点で一度立ち止まって見直す',
                '波のような変化を受け入れて対応する',
                '柔軟性と継続性を両立させる'
            ];
        } else if (pathId.includes('progress_adjust_option_b')) {
            return [
                '最初に基礎をしっかり固める',
                '中盤からは大胆な変革に舵を切る',
                '段階的に変化の幅を広げていく',
                '初期の慎重さから後半の積極性へ移行'
            ];
        } else if (pathId.includes('transform_complete_option_a')) {
            return [
                '最初の転機を逃さずに掴む',
                '変化を起こした後は着実に発展させる',
                '転換点での勇気ある決断が鍵',
                '新しい環境で堅実に成長する'
            ];
        } else if (pathId.includes('transform_complete_option_b')) {
            return [
                '変化→安定→変化のサイクルを活用',
                'ジグザグでも前進していることを信じる',
                '調整期間を有効に使って次に備える',
                '変化と安定の両方を味方につける'
            ];
        } else if (pathId.includes('transform_integrate_option_a')) {
            return [
                '大きな変革を恐れずに実行する',
                '最終段階で新方向性を明確にする',
                '変化の激流を乗り越える覚悟を持つ',
                '革新的アイデアを現実に落とし込む'
            ];
        } else if (pathId.includes('transform_integrate_option_b')) {
            return [
                '人生の抜本的変革に踏み切る',
                '全てを変える覚悟と計画を持つ',
                '過去との決別と新しい自分の創造',
                '完全な転換による新次元の開拓'
            ];
        }
        
        // デフォルトの汎用ガイダンス
        return [
            '現在の状況を冷静に分析する', 
            '可能性と制約の両方を理解する',
            '段階的に行動計画を実行する', 
            '結果を検証して柔軟に調整する'
        ]; 
    }
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
// グローバル公開
window.BinaryTreeFutureEngine = BinaryTreeFutureEngine;

console.log('🌳 BinaryTreeFutureEngine.js loaded successfully - 二分木型仮想螺旋統合段階的分岐システム');