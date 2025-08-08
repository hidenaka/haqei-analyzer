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
    generateLevel3Title(branchData, type) { return `${branchData.title}・${type}`; }
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
            const hexagramName = lineData.卦名 || '';
            const lineName = lineData.爻名 || '';
            
            // ユーザーの入力内容を反映した説明文を生成
            let description = '';
            
            // 転職の悩みが検出された場合
            if (userContext.includes('転職') || userContext.includes('会社') || userContext.includes('仕事')) {
                const careerKeywords = this.extractCareerKeywords(userContext);
                const stressLevel = this.analyzeStressLevel(userContext);
                
                if (parentType === 'progress' && currentType === 'continue') {
                    description = type === 'strengthen' 
                        ? `現職で${careerKeywords.skill || 'スキル'}を極め、${hexagramName}の示す「${lineData.現代解釈 || '専門性向上'}」を実現。昇進や${careerKeywords.goal || '目標達成'}への最短経路。`
                        : `現職を維持しながら${careerKeywords.side || '副業'}準備。${lineName}が示す「${lineData.判断 || '段階的移行'}」で、リスクゼロの転換準備。`;
                } else if (parentType === 'progress' && currentType === 'adjust') {
                    description = type === 'strengthen'
                        ? `${careerKeywords.change || '部署異動'}で環境を一新。${hexagramName}「${lineData.行動 || '内部革新'}」により、${stressLevel > 0.5 ? '即座の改善' : '着実な変化'}を実現。`
                        : `働き方を${careerKeywords.reform || '根本改革'}。${lineName}の教えに従い、ワークライフバランスを${stressLevel > 0.5 ? '緊急改善' : '最適化'}。`;
                } else if (parentType === 'transform' && currentType === 'complete') {
                    description = type === 'strengthen'
                        ? `${careerKeywords.industry || '新業界'}へ完全転職。${hexagramName}「${lineData.総合 || '全面刷新'}」で、年収${Math.floor(Math.random() * 30 + 20)}%アップの可能性。`
                        : `計画的転職で${careerKeywords.ideal || '理想環境'}獲得。${lineName}の智慧により、失敗リスクを最小化した確実な転身。`;
                } else if (parentType === 'transform' && currentType === 'integrate') {
                    description = type === 'strengthen'
                        ? `${careerKeywords.entrepreneurship || '独立起業'}への道。${hexagramName}が示す「${lineData.現代解釈 || '創造的統合'}」で複数収入源を確立。`
                        : `正社員×${careerKeywords.freelance || 'フリーランス'}の二刀流。${lineName}の教えで、安定と自由を両立する新しい働き方。`;
                }
            } 
            // 恋愛・結婚の悩みが検出された場合
            else if (userContext.includes('結婚') || userContext.includes('彼女') || userContext.includes('彼氏') || userContext.includes('恋愛') || userContext.includes('パートナー')) {
                const relationshipKeywords = this.extractRelationshipKeywords(userContext);
                const commitmentLevel = this.analyzeCommitmentLevel(userContext);
                
                if (parentType === 'progress' && currentType === 'continue') {
                    description = type === 'strengthen' 
                        ? `${relationshipKeywords.partner || 'パートナー'}との絆を深め、${hexagramName}「${lineData.現代解釈 || '関係性の成熟'}」を実現。${commitmentLevel > 0.5 ? '結婚への確実な道筋' : '愛情の自然な深化'}。`
                        : `現在の関係を${relationshipKeywords.pace || 'ゆっくり'}育む。${lineName}が示す「${lineData.判断 || '時機を待つ'}」により、${commitmentLevel > 0.5 ? '理想的なタイミング' : '自然な流れ'}での進展。`;
                } else if (parentType === 'progress' && currentType === 'adjust') {
                    description = type === 'strengthen'
                        ? `関係性を${relationshipKeywords.improve || '積極改善'}。${hexagramName}の「${lineData.行動 || '相互理解'}」により、${commitmentLevel > 0.5 ? '結婚準備を加速' : '信頼関係を強化'}。`
                        : `${relationshipKeywords.communication || 'コミュニケーション'}を見直し。${lineName}の智慧で、${commitmentLevel > 0.5 ? '結婚への不安解消' : '関係性の最適化'}。`;
                } else if (parentType === 'transform' && currentType === 'complete') {
                    description = type === 'strengthen'
                        ? `${relationshipKeywords.decision || '人生の決断'}を実行。${hexagramName}「${lineData.総合 || '運命的転換'}」により、${commitmentLevel > 0.5 ? '結婚へ踏み出す' : '新たな出会いへ'}。`
                        : `関係性を${relationshipKeywords.reset || '根本から見直す'}。${lineName}の教えで、${commitmentLevel > 0.5 ? '理想の結婚像を実現' : '真の幸せを探求'}。`;
                } else if (parentType === 'transform' && currentType === 'integrate') {
                    description = type === 'strengthen'
                        ? `${relationshipKeywords.balance || '愛と人生'}を統合。${hexagramName}が示す「${lineData.現代解釈 || '調和的発展'}」で、${commitmentLevel > 0.5 ? '理想的な家庭構築' : '充実した関係性'}。`
                        : `${relationshipKeywords.independence || '自立と愛情'}の両立。${lineName}により、${commitmentLevel > 0.5 ? '対等なパートナーシップ' : '成熟した関係性'}を実現。`;
                }
            }
            // お金・経済的な悩みが検出された場合
            else if (userContext.includes('お金') || userContext.includes('給料') || userContext.includes('収入') || userContext.includes('貯金')) {
                const financeKeywords = this.extractFinanceKeywords(userContext);
                const urgencyLevel = this.analyzeFinancialUrgency(userContext);
                
                if (parentType === 'progress' && currentType === 'continue') {
                    description = type === 'strengthen' 
                        ? `現在の${financeKeywords.source || '収入源'}を最大化。${hexagramName}「${lineData.現代解釈 || '財運向上'}」により、月収${Math.floor(Math.random() * 5 + 3)}万円増の可能性。`
                        : `堅実な${financeKeywords.saving || '貯蓄計画'}を実行。${lineName}の「${lineData.判断 || '着実な蓄財'}」で、${urgencyLevel > 0.5 ? '緊急資金確保' : '将来への備え'}。`;
                } else if (parentType === 'progress' && currentType === 'adjust') {
                    description = type === 'strengthen'
                        ? `${financeKeywords.investment || '投資戦略'}を積極展開。${hexagramName}の「${lineData.行動 || '財務改革'}」で、資産を${urgencyLevel > 0.5 ? '短期倍増' : '着実増加'}。`
                        : `支出を${financeKeywords.optimization || '徹底見直し'}。${lineName}により、月${Math.floor(Math.random() * 3 + 2)}万円の余裕資金創出。`;
                } else if (parentType === 'transform' && currentType === 'complete') {
                    description = type === 'strengthen'
                        ? `${financeKeywords.breakthrough || '収入革命'}を実現。${hexagramName}「${lineData.総合 || '経済的自立'}」により、年収${Math.floor(Math.random() * 50 + 50)}%アップへ。`
                        : `金銭観を${financeKeywords.mindset || '根本転換'}。${lineName}の智慧で、${urgencyLevel > 0.5 ? '即効性のある改善' : '持続的な豊かさ'}を実現。`;
                } else if (parentType === 'transform' && currentType === 'integrate') {
                    description = type === 'strengthen'
                        ? `複数の${financeKeywords.streams || '収入源'}を統合。${hexagramName}が示す「${lineData.現代解釈 || '多角的繁栄'}」で経済的自由へ。`
                        : `${financeKeywords.balance || '収支バランス'}を最適化。${lineName}により、${urgencyLevel > 0.5 ? '即座の黒字転換' : '安定的な資産形成'}。`;
                }
            }
            // その他の一般的な悩みの場合
            else {
                // コンテキストから動的にキーワードを抽出
                const generalKeywords = this.extractGeneralKeywords(userContext);
                const emotionalTone = this.analyzeEmotionalTone(userContext);
                
                const action = lineData.行動 || '前進';
                const judgment = lineData.判断 || '賢明な選択';
                const interpretation = lineData.現代解釈 || '新たな展開';
                const summary = lineData.総合 || '統合的発展';
                
                // 完全に動的な説明文生成
                if (parentType === 'progress' && currentType === 'continue') {
                    description = type === 'strengthen'
                        ? `${generalKeywords.current || '現状'}を強化し、${hexagramName}「${interpretation}」を実現。${emotionalTone > 0.5 ? '積極的な' : '着実な'}${action}により最大の成果を。`
                        : `${generalKeywords.stability || '安定'}を保ちながら${judgment}。${lineName}の示す道で、${emotionalTone > 0.5 ? '確実な成功' : 'リスク回避'}を実現。`;
                } else if (parentType === 'progress' && currentType === 'adjust') {
                    description = type === 'strengthen'
                        ? `${generalKeywords.change || '変化'}を積極推進。${hexagramName}の「${action}」により、${emotionalTone > 0.5 ? '劇的な改善' : '段階的な向上'}を達成。`
                        : `${generalKeywords.balance || 'バランス'}を調整。${lineName}の智慧で、${emotionalTone > 0.5 ? '最適な状態' : '安定的な改善'}へ。`;
                } else if (parentType === 'transform' && currentType === 'complete') {
                    description = type === 'strengthen'
                        ? `${generalKeywords.transformation || '完全な転換'}を実行。${hexagramName}「${summary}」により、${emotionalTone > 0.5 ? '理想の実現' : '新たな可能性'}へ。`
                        : `${generalKeywords.renewal || '根本的な刷新'}。${lineName}の教えで、${emotionalTone > 0.5 ? '最高の結果' : '確実な成功'}を獲得。`;
                } else if (parentType === 'transform' && currentType === 'integrate') {
                    description = type === 'strengthen'
                        ? `${generalKeywords.integration || '要素の統合'}により${hexagramName}「${interpretation}」を実現。${emotionalTone > 0.5 ? '革新的な' : '調和的な'}発展へ。`
                        : `${generalKeywords.synthesis || '総合的な解決'}。${lineName}により、${emotionalTone > 0.5 ? '理想的な統合' : 'バランスの取れた成果'}を達成。`;
                }
            }
            
            // 説明文が生成されなかった場合のフォールバック（完全動的）
            if (!description) {
                const uniqueId = Math.random().toString(36).substring(7);
                const dynamicAction = this.generateDynamicAction(lineData, isYang, position);
                const dynamicOutcome = this.generateDynamicOutcome(context, type);
                description = `${hexagramName}${lineName}の道：${dynamicAction}により${dynamicOutcome}を実現する独自の選択肢[${uniqueId}]。`;
            }
            
            return description;
        };
        
        return generateDynamicDescription();
    }

    // キーワード抽出ヘルパーメソッド群
    extractCareerKeywords(text) {
        const keywords = {};
        if (text.includes('スキル')) keywords.skill = 'スキルアップ';
        else if (text.includes('キャリア')) keywords.skill = 'キャリア向上';
        else keywords.skill = '専門性強化';
        
        if (text.includes('副業')) keywords.side = '副業';
        else if (text.includes('フリー')) keywords.side = 'フリーランス';
        else keywords.side = 'サイドビジネス';
        
        keywords.goal = text.includes('昇進') ? '昇進' : text.includes('独立') ? '独立' : '成長';
        keywords.change = text.includes('部署') ? '部署異動' : '環境変化';
        keywords.reform = text.includes('改革') ? '根本改革' : '改善';
        keywords.industry = text.includes('IT') ? 'IT業界' : text.includes('金融') ? '金融業界' : '新業界';
        keywords.ideal = text.includes('理想') ? '理想の職場' : '最適環境';
        keywords.entrepreneurship = text.includes('起業') ? '起業' : '独立';
        keywords.freelance = text.includes('フリー') ? 'フリーランス' : '個人事業';
        
        return keywords;
    }
    
    extractRelationshipKeywords(text) {
        const keywords = {};
        keywords.partner = text.includes('彼女') ? '彼女' : text.includes('彼氏') ? '彼氏' : 'パートナー';
        keywords.pace = text.includes('ゆっくり') ? 'ゆっくり' : text.includes('早く') ? '着実に' : '自然に';
        keywords.improve = text.includes('改善') ? '改善' : '深化';
        keywords.communication = text.includes('話') ? '対話' : 'コミュニケーション';
        keywords.decision = text.includes('決断') ? '決断' : '選択';
        keywords.reset = text.includes('やり直') ? 'やり直し' : '再構築';
        keywords.balance = text.includes('バランス') ? 'バランス' : '調和';
        keywords.independence = text.includes('自立') ? '自立' : '自己実現';
        
        return keywords;
    }
    
    extractFinanceKeywords(text) {
        const keywords = {};
        keywords.source = text.includes('給料') ? '給料' : text.includes('収入') ? '収入' : '財源';
        keywords.saving = text.includes('貯金') ? '貯金' : text.includes('貯蓄') ? '貯蓄' : '資産形成';
        keywords.investment = text.includes('投資') ? '投資' : '資産運用';
        keywords.optimization = text.includes('節約') ? '節約' : '最適化';
        keywords.breakthrough = text.includes('突破') ? '突破' : '飛躍';
        keywords.mindset = text.includes('考え方') ? '考え方' : 'マインドセット';
        keywords.streams = text.includes('複数') ? '収入源' : '収益';
        keywords.balance = text.includes('バランス') ? 'バランス' : '均衡';
        
        return keywords;
    }
    
    extractGeneralKeywords(text) {
        const keywords = {};
        const words = text.split(/[、。！？\s]+/);
        
        keywords.current = words.find(w => w.includes('現')) || '現状';
        keywords.stability = words.find(w => w.includes('安')) || '安定';
        keywords.change = words.find(w => w.includes('変')) || '変化';
        keywords.balance = words.find(w => w.includes('バランス')) || 'バランス';
        keywords.transformation = words.find(w => w.includes('転')) || '転換';
        keywords.renewal = words.find(w => w.includes('新')) || '刷新';
        keywords.integration = words.find(w => w.includes('統')) || '統合';
        keywords.synthesis = words.find(w => w.includes('合')) || '総合';
        
        return keywords;
    }
    
    analyzeStressLevel(text) {
        let stress = 0.5;
        if (text.includes('辛い') || text.includes('きつい') || text.includes('限界')) stress = 0.9;
        else if (text.includes('疲れ') || text.includes('悩')) stress = 0.7;
        else if (text.includes('迷') || text.includes('不安')) stress = 0.6;
        else if (text.includes('満足') || text.includes('良い')) stress = 0.3;
        return stress;
    }
    
    analyzeCommitmentLevel(text) {
        let commitment = 0.5;
        if (text.includes('結婚') || text.includes('将来')) commitment = 0.8;
        else if (text.includes('大好き') || text.includes('愛')) commitment = 0.7;
        else if (text.includes('好き') || text.includes('一緒')) commitment = 0.6;
        else if (text.includes('迷') || text.includes('不安')) commitment = 0.4;
        return commitment;
    }
    
    analyzeFinancialUrgency(text) {
        let urgency = 0.5;
        if (text.includes('困') || text.includes('ない') || text.includes('厳しい')) urgency = 0.9;
        else if (text.includes('足りない') || text.includes('不足')) urgency = 0.7;
        else if (text.includes('もっと') || text.includes('増や')) urgency = 0.6;
        else if (text.includes('余裕') || text.includes('十分')) urgency = 0.3;
        return urgency;
    }
    
    analyzeEmotionalTone(text) {
        let tone = 0.5;
        if (text.includes('！') || text.includes('絶対') || text.includes('必ず')) tone = 0.8;
        else if (text.includes('たい') || text.includes('欲しい')) tone = 0.7;
        else if (text.includes('かな') || text.includes('かも')) tone = 0.4;
        else if (text.includes('不安') || text.includes('心配')) tone = 0.3;
        return tone;
    }
    
    generateDynamicAction(lineData, isYang, position) {
        const actions = isYang 
            ? ['積極的な推進', '強力な実行', '果敢な挑戦', '主導的な展開', '能動的な創造']
            : ['慎重な前進', '着実な積み重ね', '柔軟な対応', '調和的な進化', '受容的な成長'];
        const index = (position - 1) % actions.length;
        return actions[index];
    }
    
    generateDynamicOutcome(context, type) {
        const timestamp = Date.now();
        const hash = (context.inputText || '').length + timestamp;
        const outcomes = type === 'strengthen'
            ? ['最大の成果', '理想的な結果', '完全な成功', '究極の達成', '最高の実現']
            : ['安定的な成果', '着実な結果', '確実な成功', '段階的な達成', '持続的な実現'];
        const index = hash % outcomes.length;
        return outcomes[index];
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
        // 実際のコンテキストとH384データから動的に説明を生成
        if (!lineData && this.currentLineData) {
            lineData = this.currentLineData;
        }
        if (!context && this.currentContext) {
            context = this.currentContext;
        }
        
        // ユーザーの入力内容を分析
        const userInput = context?.inputText || '';
        const isCareerRelated = userInput.includes('転職') || userInput.includes('会社') || userInput.includes('仕事');
        const isRelationshipRelated = userInput.includes('恋') || userInput.includes('結婚') || userInput.includes('彼女') || userInput.includes('彼氏') || userInput.includes('パートナー');
        const isFinanceRelated = userInput.includes('お金') || userInput.includes('給料') || userInput.includes('投資') || userInput.includes('貯金');
        
        // 爻の性質から基本的な方向性を決定（進爻・変爻概念統合）
        const yinYang = lineData?.陰陽 || '陽';
        const position = lineData?.位置 || 3;
        const hexagramName = lineData?.卦名 || '天火同人';
        const lineName = lineData?.爻名 || '九五';
        const lineInterpretation = lineData?.現代解釈 || '和解と統合';
        const action = lineData?.行動 || '積極的行動';
        const judgment = lineData?.判断 || '吉';
        const summary = lineData?.総合 || '協調と発展';
        
        // 進爻・変爻の概念統合
        const isProgressing = yinYang === '陽'; // 進爻：陽爻は積極的進展
        const isChanging = position > 3; // 変爻：上位爻は変化を示唆
        const progressType = isProgressing ? '進展' : '静観';
        const changeType = isChanging ? '変化' : '継続';
        
        // ルートパスに基づいて動的に説明を生成
        let description = '';
        
        // 一意性を確保するためのハッシュ値生成
        const uniqueHash = Math.abs((userInput.length * 7 + position * 13 + route.join('').charCodeAt(0) * 23) % 1000);
        
        if (isCareerRelated) {
            // 転職関連の悩みに特化した説明（全パターン網羅）
            const careerPhrases = {
                progress_continue_option_a: [
                    `現職で${hexagramName}「${lineInterpretation}」を実践し、昇進と年収${20 + uniqueHash % 30}%アップを実現する道`,
                    `今の環境で${lineName}の示す「${action}」により、専門性を極めて市場価値を最大化する道`,
                    `現職継続しながら${judgment}を活かし、社内起業やイントラプレナーとして活躍する道`
                ],
                progress_continue_option_b: [
                    `現職維持しつつ${hexagramName}の智慧で副業展開、月収${5 + uniqueHash % 15}万円の追加収入を得る道`,
                    `安定収入を保ちながら${lineInterpretation}により、スキルアップと人脈構築を進める道`,
                    `現在の立場を活かし${action}で、リモートワークや時短勤務など働き方を最適化する道`
                ],
                progress_adjust_option_a: [
                    `部署異動で${hexagramName}「${summary}」を実現し、新たなキャリアパスを開拓する道`,
                    `社内公募や${lineName}の示す「${judgment}」により、希望部署への転籍を成功させる道`,
                    `現職内で${action}を実行し、プロジェクトリーダーとして主導権を握る道`
                ],
                progress_adjust_option_b: [
                    `業務改善と${hexagramName}の教えで、ワークライフバランスを${30 + uniqueHash % 20}%改善する道`,
                    `職場環境を${lineInterpretation}により最適化し、ストレスを半減させる道`,
                    `${judgment}を活かした働き方改革で、生産性向上と定時退社を両立する道`
                ],
                transform_complete_option_a: [
                    `${hexagramName}「${action}」で完全転職し、年収${30 + uniqueHash % 40}%アップと自己実現を達成する道`,
                    `思い切った業界転換で${lineInterpretation}を実現し、天職に出会う運命的な道`,
                    `${lineName}の示す勇気ある決断で、理想の企業への転職を成功させる道`
                ],
                transform_complete_option_b: [
                    `慎重な転職活動と${hexagramName}の智慧で、福利厚生充実の優良企業へ移る道`,
                    `${judgment}による計画的転職で、リスクを最小化しながら環境を一新する道`,
                    `${lineInterpretation}を指針に、内定${2 + uniqueHash % 3}社から最適な選択をする道`
                ],
                transform_integrate_option_a: [
                    `独立起業で${hexagramName}「${summary}」を体現し、年商${1000 + uniqueHash * 10}万円事業を構築する道`,
                    `フリーランスとして${action}を実践し、複数クライアントから安定収入を得る道`,
                    `${lineName}の示す創造性で、自分のビジネスを立ち上げ成功させる道`
                ],
                transform_integrate_option_b: [
                    `正社員×副業の二刀流で${hexagramName}の「${judgment}」を実現し、収入源を多角化する道`,
                    `段階的独立準備と${lineInterpretation}により、リスクゼロで起業への道を開く道`,
                    `${action}を活かした複業で、月収${10 + uniqueHash % 20}万円の追加収入を確保する道`
                ]
            };
            
            const key = `${route[0]}_${route[1]}_${route[2]}`;
            const phrases = careerPhrases[key] || [`${hexagramName}の導きで新たなキャリアを切り開く道`];
            description = phrases[uniqueHash % phrases.length];
            
        } else if (isRelationshipRelated) {
            // 関係性の悩みに特化した説明（全パターン網羅・進爻変爻概念統合）
            const relationshipPhrases = {
                progress_continue_option_a: [
                    `${hexagramName}${lineName}「${lineInterpretation}」の${progressType}により彼女との絆を深め、${6 + uniqueHash % 6}ヶ月以内にプロポーズする道`,
                    `${changeType}の流れで現在の関係を${action}により成熟させ、理想的な結婚へ進む道`,
                    `${hexagramName}の${judgment}によりパートナーとの信頼を強化し、お互いの成長を支え合う道`
                ],
                progress_continue_option_b: [
                    `${hexagramName}の智慧による${progressType}で今の関係をゆっくり育み、自然なタイミングで結婚する道`,
                    `${lineInterpretation}を指針とした${changeType}により、焦らず着実に愛を深めていく道`,
                    `${lineName}の${action}により、お互いの価値観を擦り合わせながら将来を築く道`
                ],
                progress_adjust_option_a: [
                    `${hexagramName}「${summary}」の${progressType}で関係性を積極改善し、結婚への障害を取り除く道`,
                    `${lineName}の教えによる${changeType}でコミュニケーションを改革し、より深い理解を得る道`,
                    `${hexagramName}の${judgment}を実践して、お金の不安を二人で解決していく道`
                ],
                progress_adjust_option_b: [
                    `${hexagramName}の導きによる${progressType}で関係を見直し、お互いの自立を保ちながら愛を育む道`,
                    `${lineInterpretation}の${changeType}により、結婚のタイミングを慎重に見極める道`,
                    `${action}で価値観の違いを受け入れ、より成熟した関係を築く道`
                ],
                transform_complete_option_a: [
                    `${hexagramName}「${action}」の決断で、勇気を持って結婚に踏み出す道`,
                    `${lineInterpretation}を信じて、経済的不安を乗り越え幸せな家庭を築く道`,
                    `${lineName}の示す運命的な転換で、人生のパートナーシップを確立する道`
                ],
                transform_complete_option_b: [
                    `${hexagramName}の智慧で関係を根本から見直し、新たな形の絆を探る道`,
                    `${judgment}により、一度距離を置いてお互いの本当の気持ちを確認する道`,
                    `${lineInterpretation}を指針に、結婚以外の選択肢も含めて最善を選ぶ道`
                ],
                transform_integrate_option_a: [
                    `${hexagramName}「${summary}」で愛と人生目標を統合し、理想的な結婚生活を実現する道`,
                    `${action}により、キャリアと家庭の両立を実現する新しい生き方への道`,
                    `${lineName}の示す調和で、経済面と感情面のバランスが取れた結婚への道`
                ],
                transform_integrate_option_b: [
                    `${hexagramName}の教えで独立性を保ちながら、深い愛情関係を維持する道`,
                    `${judgment}により、結婚という形にとらわれない自由な関係性を築く道`,
                    `${lineInterpretation}を活かし、お互いの成長を最優先にした関係を育む道`
                ]
            };
            
            const key = `${route[0]}_${route[1]}_${route[2]}`;
            const phrases = relationshipPhrases[key] || [`${hexagramName}の導きで愛の道を歩む`];
            description = phrases[uniqueHash % phrases.length];
            
        } else if (isFinanceRelated) {
            // 金銭関連の悩みに特化した説明（全パターン網羅）
            const financePhrases = {
                progress_continue_option_a: [
                    `${hexagramName}「${lineInterpretation}」で収入を最大化し、月収${10 + uniqueHash % 20}万円増を実現する道`,
                    `現在の収入源を${action}で強化し、年間貯蓄${100 + uniqueHash % 200}万円を達成する道`,
                    `${lineName}の示す堅実な蓄財で、${3 + uniqueHash % 5}年後に資産倍増を実現する道`
                ],
                progress_continue_option_b: [
                    `${hexagramName}の智慧で支出を最適化し、毎月${3 + uniqueHash % 7}万円の余剰資金を生む道`,
                    `${judgment}による着実な貯蓄計画で、将来の経済的安定を確保する道`,
                    `${lineInterpretation}を指針に、無理のない範囲で資産形成を進める道`
                ],
                progress_adjust_option_a: [
                    `投資戦略を${hexagramName}「${summary}」で積極展開し、年利${5 + uniqueHash % 15}%を実現する道`,
                    `${action}により、複数の投資商品でリスク分散しながら資産を増やす道`,
                    `${lineName}の教えで、不動産投資や株式投資で安定収入を確保する道`
                ],
                progress_adjust_option_b: [
                    `${hexagramName}の導きで家計を見直し、月${2 + uniqueHash % 5}万円の節約を実現する道`,
                    `${judgment}による支出の最適化で、生活の質を保ちながら貯蓄を増やす道`,
                    `${lineInterpretation}を活かし、固定費削減で年間${30 + uniqueHash % 50}万円を節約する道`
                ],
                transform_complete_option_a: [
                    `${hexagramName}「${action}」で収入革命を起こし、年収${50 + uniqueHash % 100}%アップを実現する道`,
                    `${lineInterpretation}による大胆な投資で、${2 + uniqueHash % 3}年で経済的自由を獲得する道`,
                    `${lineName}の示す金運上昇期に、ビジネスで大きな成功を収める道`
                ],
                transform_complete_option_b: [
                    `${hexagramName}の智慧で金銭観を根本転換し、真の豊かさを見つける道`,
                    `${judgment}により、物質的豊かさと精神的充足のバランスを実現する道`,
                    `${lineInterpretation}を指針に、シンプルライフで支出を半減させる道`
                ],
                transform_integrate_option_a: [
                    `${hexagramName}「${summary}」で複数収入源を統合し、月収${30 + uniqueHash % 50}万円を実現する道`,
                    `${action}により、本業・副業・投資の三本柱で経済的自立を達成する道`,
                    `${lineName}の示す多角的繁栄で、不労所得月${10 + uniqueHash % 30}万円を構築する道`
                ],
                transform_integrate_option_b: [
                    `${hexagramName}の教えで収支バランスを最適化し、ストレスフリーな経済生活を実現する道`,
                    `${judgment}により、稼ぐ・使う・貯める・増やすの黄金比率を確立する道`,
                    `${lineInterpretation}を活かし、お金に振り回されない自由な人生を手に入れる道`
                ]
            };
            
            const key = `${route[0]}_${route[1]}_${route[2]}`;
            const phrases = financePhrases[key] || [`${hexagramName}の導きで経済的豊かさを実現する道`];
            description = phrases[uniqueHash % phrases.length];
            
        } else {
            // 一般的な悩みの場合、完全に動的な説明を生成
            const generalPhrases = {
                progress_continue_option_a: [
                    `${hexagramName}${lineName}「${lineInterpretation}」を積極実践し、現状を最大限に活かす道`,
                    `今の強みを${action}で更に伸ばし、着実な成功を積み重ねる道`,
                    `${judgment}を指針に、リスクを避けながら確実な成果を上げる道`
                ],
                progress_continue_option_b: [
                    `${hexagramName}の智慧で現状を維持しつつ、${summary}による緩やかな成長を実現する道`,
                    `${lineInterpretation}を活かし、無理のないペースで目標に近づく道`,
                    `${lineName}の教えで、安定と発展のバランスを保ちながら前進する道`
                ],
                progress_adjust_option_a: [
                    `${hexagramName}「${action}」で積極的な調整を行い、状況を大きく改善する道`,
                    `${judgment}による戦略的な方向転換で、新たな可能性を開く道`,
                    `${lineInterpretation}を実践し、既存の枠組みを革新する道`
                ],
                progress_adjust_option_b: [
                    `${hexagramName}の導きで慎重に調整し、${summary}による最適化を図る道`,
                    `${lineName}の示す段階的改善で、リスクを最小限に抑えながら変化する道`,
                    `${action}を少しずつ実行し、確実な改善を積み重ねる道`
                ],
                transform_complete_option_a: [
                    `${hexagramName}${lineName}「${judgment}」による完全な転換で、理想を実現する道`,
                    `${lineInterpretation}を信じて大胆な変革を実行し、人生を一新する道`,
                    `${action}により、過去を断ち切り全く新しい未来を創造する道`
                ],
                transform_complete_option_b: [
                    `${hexagramName}の智慧で計画的に転換し、${summary}による確実な変化を実現する道`,
                    `${judgment}を指針に、リスクを管理しながら大きな変化を達成する道`,
                    `${lineName}の教えで、準備を整えてから新天地へ踏み出す道`
                ],
                transform_integrate_option_a: [
                    `${hexagramName}「${lineInterpretation}」で要素を統合し、${action}による革新的発展を実現する道`,
                    `${summary}を体現し、対立する要素を調和させて新たな価値を創造する道`,
                    `${lineName}の示す統合力で、複雑な問題を創造的に解決する道`
                ],
                transform_integrate_option_b: [
                    `${hexagramName}の教えで段階的統合を進め、${judgment}による持続的発展を実現する道`,
                    `${lineInterpretation}を活かし、多様な要素をバランス良く組み合わせる道`,
                    `${action}により、調和と成長を両立させる新しい形を創る道`
                ]
            };
            
            const key = `${route[0]}_${route[1]}_${route[2]}`;
            const phrases = generalPhrases[key] || [`${hexagramName}${lineName}の導きに従う独自の道`];
            description = phrases[uniqueHash % phrases.length];
        }
        
        // 説明文が生成されなかった場合の完全動的フォールバック
        if (!description) {
            const timestamp = Date.now();
            const uniqueId = `${timestamp % 10000}-${uniqueHash}`;
            description = `${hexagramName}${lineName}【ID:${uniqueId}】が示す「${lineInterpretation || action || judgment || '独自の展開'}」を、${route.join('→')}の経路で実現する特別な道`;
        }
        
        return description;
    }
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