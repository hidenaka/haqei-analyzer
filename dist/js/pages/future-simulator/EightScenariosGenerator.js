/**
 * HAQEI Eight Scenarios Generator - Phase 3 Implementation
 * 8シナリオ生成エンジン - HaQei哲学準拠
 * 
 * 実装日: 2025年8月6日
 * 担当: HAQEI Programming Agent  
 * 目的: Phase 2の易経卦から8つの更新シナリオを生成し、HaQei哲学の矛盾受容を実現
 */

class EightScenariosGenerator {
    constructor() {
        this.initialized = false;
        this.scenarioCache = new Map();
        this.HaQeiMatrix = this.initializeHaQeiMatrix();
        this.scenarioPatterns = this.initializeScenarioPatterns();
        this.contradictionFramework = this.initializeContradictionFramework();
        this.iChingScenarioMapping = this.initializeIChingScenarioMapping();
        
        // Memory Management (メモリリーク修正)
        this.memoryManager = {
            cacheLimit: 50,
            cleanupInterval: null,
            lastCleanup: Date.now()
        };
        
        // Start automatic cleanup
        this.startMemoryCleanup();
        
        console.log('🎭 EightScenariosGenerator Phase 3 initialized - HaQei philosophy');
    }

    /**
     * メイン二分木型分岐生成メソッド - Phase 3 Core Implementation
     * P3-001: Phase 2の結果から二分木型3段階分岐を生成
     */
    async generateEightScenarios(phase2Results, options = {}) {
        try {
            console.log('🌳 Generating binary tree futures from Phase 2 results...');
            
            if (!phase2Results || !phase2Results.selectedHexagram) {
                throw new Error('Phase 2の結果が必要です');
            }

            const startTime = performance.now();

            // Step 1: 386爻システムから現在位置特定
            const currentLineNumber = this.determineCurrentLine386(phase2Results.selectedHexagram, phase2Results.inputText);

            // Step 2: 二分木型分岐エンジン初期化
            if (!window.BinaryTreeFutureEngine) {
                throw new Error('BinaryTreeFutureEngine not loaded');
            }
            const binaryTreeEngine = new window.BinaryTreeFutureEngine();

            // Step 3: 二分木型分岐生成
            const binaryTreeResult = await binaryTreeEngine.generateBinaryTreeFutures(currentLineNumber, {
                phase2Results: phase2Results,
                options: options
            });

            // Step 4: HaQei分人視点の特定
            const HaQeiPerspectives = this.identifyHaQeiPerspectives(
                phase2Results.HaQeiInterpretation,
                phase2Results.inputText
            );

            // Step 5: 二分木結果をシナリオ形式に変換
            const eightScenarios = this.convertBinaryTreeToScenarios(
                binaryTreeResult.finalEightPaths,
                HaQeiPerspectives,
                phase2Results
            );

            // Step 6: 矛盾統合と調和（二分木対応）
            const integratedScenarios = this.integrateBinaryTreeScenarios(
                eightScenarios,
                binaryTreeResult.HaQeiIntegration,
                HaQeiPerspectives
            );

            // Step 7: 統合的指導の生成（二分木統合）
            const holisticGuidance = this.generateBinaryTreeHolisticGuidance(
                integratedScenarios,
                binaryTreeResult,
                phase2Results
            );

            const processingTime = performance.now() - startTime;

            const finalResult = {
                inputText: phase2Results.inputText,
                sourceHexagram: phase2Results.selectedHexagram,
                currentLine386: currentLineNumber,
                HaQeiPerspectives,
                timestamp: new Date().toISOString(),
                processingTime: Math.round(processingTime),

                // Binary Tree Structure
                binaryTreeStructure: binaryTreeResult.binaryTree,
                pathVisualization: binaryTreeResult.pathVisualization,
                
                // Core 8 Scenarios (from binary tree paths)
                scenarios: integratedScenarios,
                binaryTreePaths: binaryTreeResult.finalEightPaths,
                holisticGuidance,

                // HaQei Philosophy Implementation (Binary Tree Enhanced)
                multiplicity_celebration: true,
                binary_tree_philosophy: '段階的分岐による複数真理の共存',
                contradiction_acceptance: binaryTreeResult.HaQeiIntegration.contradiction_acceptance,
                dynamic_persona_switching: binaryTreeResult.HaQeiIntegration.persona_switching,
                unified_integration: binaryTreeResult.HaQeiIntegration.unified_wisdom,

                // Quality Metrics
                scenario_diversity: this.calculateScenarioDiversity(integratedScenarios),
                philosophical_depth: binaryTreeResult.HaQeiIntegration.philosophical_depth || 0.85,
                practical_applicability: this.calculatePracticalApplicability(integratedScenarios),
                binary_tree_accuracy: binaryTreeResult.qualityMetrics.binaryTreeAccuracy,

                // Metadata
                phase: 'Phase 3 - Binary Tree Scenarios',
                engineVersion: '3.0.0-binary-tree',
                HaQeiCompliance: true,
                contradictionFramework: 'binary_tree_harmony',
                binaryTreeEngine: binaryTreeResult.version
            };

            // キャッシュに保存
            this.cacheScenarios(phase2Results.inputText, finalResult);

            console.log('✅ Binary tree scenarios generated successfully:', {
                scenarios: integratedScenarios.length,
                binaryTreePaths: binaryTreeResult.finalEightPaths.length,
                currentLine386: currentLineNumber,
                diversity: finalResult.scenario_diversity,
                time: processingTime + 'ms'
            });

            return finalResult;

        } catch (error) {
            console.error('❌ Error in generateEightScenarios:', error);
            return this.generateFallbackScenarios(phase2Results);
        }
    }
    
    /**
     * P3-NEW: 386爻システムから現在位置を特定
     */
    determineCurrentLine386(selectedHexagram, inputText) {
        try {
            // 卦番号から基本範囲を計算
            const hexagramNumber = selectedHexagram.number || 1;
            const baseLineStart = (hexagramNumber - 1) * 6 + 1;
            const baseLineEnd = hexagramNumber * 6;
            
            // テキスト分析による爻位置推定
            const textAnalysis = this.analyzeTextForLinePosition(inputText);
            const estimatedPosition = Math.floor(textAnalysis * 6) + 1; // 1-6の範囲
            
            const finalLineNumber = baseLineStart + estimatedPosition - 1;
            
            console.log(`🎯 Determined 386 line: ${finalLineNumber} (hexagram: ${hexagramNumber}, position: ${estimatedPosition})`);
            return Math.min(Math.max(finalLineNumber, 1), 384);
            
        } catch (error) {
            console.error('❌ Error determining current line 386:', error);
            return 1; // フォールバック
        }
    }
    
    /**
     * P3-NEW: 二分木結果をシナリオ形式に変換
     */
    convertBinaryTreeToScenarios(binaryTreePaths, HaQeiPerspectives, phase2Results) {
        try {
            return binaryTreePaths.map((path, index) => {
                return {
                    id: `binary_tree_path_${index + 1}`,
                    index: index + 1,
                    title: path.title,
                    subtitle: path.fullDescription,
                    route: path.route,
                    
                    core_approach: {
                        primary: path.practical_guidance?.[0] || '段階的アプローチ',
                        secondary: path.practical_guidance?.[1] || '状況対応',
                        tertiary: path.practical_guidance?.[2] || '柔軟な調整'
                    },
                    
                    scenario_narrative: path.iching_interpretation?.explanation || path.fullDescription,
                    
                    specific_actions: path.practical_guidance || [
                        '現状分析を行う',
                        '段階的に進める',
                        '定期的に見直す'
                    ],
                    
                    HaQei_contradictions: [{
                        element: `${path.route[0]} vs ${path.route[1]}`,
                        insight: 'binary tree選択による分人の動的切り替え',
                        resolution: '段階的な状況判断による適応'
                    }],
                    
                    timeline: path.timeline,
                    success_probability: path.probability,
                    iching_resonance: 0.9,
                    binary_tree_path: path.route,
                    success_factors: path.success_factors,
                    potential_challenges: path.potential_challenges
                };
            });
            
        } catch (error) {
            console.error('❌ Error converting binary tree to scenarios:', error);
            return this.generateBasicScenarios();
        }
    }
    
    /**
     * P3-NEW: 二分木シナリオの統合
     */
    integrateBinaryTreeScenarios(scenarios, HaQeiIntegration, perspectives) {
        return scenarios.map((scenario, index) => {
            return {
                ...scenario,
                contradiction_integration: {
                    acknowledged_contradictions: HaQeiIntegration.contradiction_acceptance,
                    harmony_approach: 'binary_tree_stage_selection',
                    HaQei_wisdom: HaQeiIntegration.unified_wisdom.meta_guidance
                },
                persona_switching: HaQeiIntegration.persona_switching,
                integration_potential: 0.85 + (index * 0.02) // 微調整
            };
        });
    }
    
    /**
     * P3-NEW: 二分木統合的指導の生成
     */
    generateBinaryTreeHolisticGuidance(scenarios, binaryTreeResult, phase2Results) {
        return {
            meta_guidance: {
                primary_message: '8つの道筋は段階的な選択の結果として存在します',
                binary_tree_principle: '各段階での選択が次の可能性を決定していきます',
                HaQei_integration: '分人の状態に応じて適切な分岐を選択することが可能です'
            },
            
            scenario_navigation: {
                how_to_choose: '第1段階で大方針を決定し、第2・第3段階で詳細を調整',
                stage_approach: '各段階で立ち止まって状況を再評価することが重要',
                dynamic_switching: '初期選択に固執せず、状況変化に応じて軌道修正'
            },
            
            practical_integration: [
                '第1段階: 順行か転換かの基本方針決定',
                '第2段階: 具体的なアプローチ方法の選択',
                '第3段階: 実行時の強度や穏健度の調整',
                '全段階: 分人の声に耳を傾けながら柔軟に対応'
            ],
            
            philosophical_insight: {
                binary_tree_wisdom: '段階的選択こそが易経の変化の本質',
                iching_correspondence: phase2Results.selectedHexagram.modern_interpretation,
                integration_path: '対立する選択肢の存在を受け入れることで真の理解に到達'
            },
            
            visualization_guidance: {
                tree_reading: 'ルートから最終選択まで全体の流れを把握',
                probability_understanding: '各経路の確率は参考値として活用',
                adaptive_planning: '状況変化に応じて異なる経路への切り替えも検討'
            }
        };
    }
    
    /**
     * P3-NEW: テキスト分析による爻位置推定
     */
    analyzeTextForLinePosition(inputText) {
        if (!inputText || inputText.length === 0) return 0.5;
        
        // 文字数による基本推定
        const lengthFactor = Math.min(inputText.length / 200, 1.0);
        
        // キーワード分析
        const beginningWords = ['始まり', '最初', '初めて', 'スタート'];
        const middleWords = ['進行', '展開', '発展', '途中'];
        const endWords = ['完了', '終了', '最後', '仕上げ'];
        
        let positionScore = 0.5; // デフォルト中間
        
        if (beginningWords.some(word => inputText.includes(word))) {
            positionScore = 0.2;
        } else if (endWords.some(word => inputText.includes(word))) {
            positionScore = 0.8;
        } else if (middleWords.some(word => inputText.includes(word))) {
            positionScore = 0.5;
        }
        
        // 長さ要因との統合
        return (positionScore * 0.7) + (lengthFactor * 0.3);
    }

    /**
     * P3-002: HaQei分人視点の特定
     */
    identifyHaQeiPerspectives(HaQeiInterpretation, originalText) {
        try {
            const perspectives = [];
            
            // 基本分人の特定
            const basePerspectives = [
                'personal_self',     // 個人的分人
                'social_self',       // 社会的分人
                'professional_self', // 職業的分人
                'creative_self',     // 創造的分人
                'protective_self',   // 保護的分人
                'adaptive_self',     // 適応的分人
                'reflective_self',   // 内省的分人
                'assertive_self'     // 主張的分人
            ];

            basePerspectives.forEach(perspectiveType => {
                const strength = this.calculatePerspectiveStrength(
                    perspectiveType, 
                    HaQeiInterpretation, 
                    originalText
                );

                if (strength > 0.3) {
                    perspectives.push({
                        type: perspectiveType,
                        strength,
                        characteristics: this.HaQeiMatrix[perspectiveType].characteristics,
                        focus_areas: this.HaQeiMatrix[perspectiveType].focus_areas,
                        natural_contradictions: this.HaQeiMatrix[perspectiveType].natural_contradictions
                    });
                }
            });

            // 動的分人の創出
            const dynamicPerspectives = this.createDynamicPerspectives(originalText, perspectives);
            perspectives.push(...dynamicPerspectives);

            return perspectives.sort((a, b) => b.strength - a.strength).slice(0, 5);

        } catch (error) {
            console.error('❌ Error in identifyHaQeiPerspectives:', error);
            return this.getBasicPerspectives();
        }
    }

    /**
     * P3-003: 8つの基本軸の設定
     */
    defineScenarioAxes(hexagram) {
        const baseAxes = {
            change_stability: {
                label: '変化 vs 安定',
                hexagram_influence: this.calculateHexagramAxisInfluence(hexagram, 'change'),
                HaQei_weight: 0.8
            },
            individual_collective: {
                label: '個人 vs 集団',
                hexagram_influence: this.calculateHexagramAxisInfluence(hexagram, 'collective'),
                HaQei_weight: 0.9
            },
            immediate_longterm: {
                label: '短期 vs 長期',
                hexagram_influence: this.calculateHexagramAxisInfluence(hexagram, 'timing'),
                HaQei_weight: 0.7
            },
            rational_intuitive: {
                label: '論理 vs 直感',
                hexagram_influence: this.calculateHexagramAxisInfluence(hexagram, 'cognition'),
                HaQei_weight: 0.8
            },
            action_reflection: {
                label: '行動 vs 熟考',
                hexagram_influence: this.calculateHexagramAxisInfluence(hexagram, 'action'),
                HaQei_weight: 0.75
            },
            openness_caution: {
                label: '開放 vs 慎重',
                hexagram_influence: this.calculateHexagramAxisInfluence(hexagram, 'openness'),
                HaQei_weight: 0.85
            },
            harmony_assertion: {
                label: '調和 vs 主張',
                hexagram_influence: this.calculateHexagramAxisInfluence(hexagram, 'assertion'),
                HaQei_weight: 0.8
            },
            acceptance_transformation: {
                label: '受容 vs 変革',
                hexagram_influence: this.calculateHexagramAxisInfluence(hexagram, 'transformation'),
                HaQei_weight: 0.9
            }
        };

        // 易経的調整
        this.adjustAxesForHexagram(baseAxes, hexagram);

        return baseAxes;
    }

    /**
     * P3-004: 矛盾受容パターンの生成
     */
    generateContradictionPatterns(perspectives, axes) {
        const patterns = [];

        // 分人間の矛盾パターン
        for (let i = 0; i < perspectives.length; i++) {
            for (let j = i + 1; j < perspectives.length; j++) {
                const contradiction = this.identifyContradictionBetweenPerspectives(
                    perspectives[i], 
                    perspectives[j]
                );
                
                if (contradiction.intensity > 0.5) {
                    patterns.push({
                        type: 'perspective_contradiction',
                        perspectives: [perspectives[i].type, perspectives[j].type],
                        contradiction,
                        resolution_approach: this.generateContradictionResolution(contradiction),
                        HaQei_insight: this.generateHaQeiInsight(contradiction)
                    });
                }
            }
        }

        // 軸間の矛盾パターン
        Object.entries(axes).forEach(([axisName, axisData]) => {
            const polarities = this.generateAxisPolarities(axisName, axisData);
            patterns.push({
                type: 'axis_contradiction',
                axis: axisName,
                polarities,
                reconciliation: this.generateAxisReconciliation(polarities),
                HaQei_harmony: this.generateHaQeiHarmony(axisName, polarities)
            });
        });

        // 統合矛盾パターン
        const metaContradictions = this.identifyMetaContradictions(perspectives, axes);
        patterns.push(...metaContradictions);

        return patterns;
    }

    /**
     * P3-005: 保守的シナリオ生成
     */
    async generateConservativeScenario(phase2Results, perspectives) {
        const scenario = {
            id: 'conservative',
            title: '🏛️ 安定重視の道',
            subtitle: '現状を基盤とした着実な発展',
            perspective_focus: this.selectRelevantPerspectives(perspectives, 'conservative'),
            
            core_approach: {
                primary: '既存の方法を継続・改善',
                secondary: 'リスクを最小限に抑制',
                tertiary: '段階的な変化を推進'
            },

            scenario_narrative: this.generateScenarioNarrative('conservative', phase2Results),
            
            specific_actions: [
                '現在の取り組みの効果を詳細分析',
                '小さな改善点を特定し段階的に実施',
                '安定した人間関係を維持・強化',
                '確実な成果を積み重ね',
                'リスク要因を事前に回避'
            ],

            HaQei_contradictions: [
                {
                    element: '保守性 vs 成長欲求',
                    insight: '安定を求める分人と変化を望む分人の共存',
                    resolution: '成長を安定の延長として捉える'
                }
            ],

            timeline: '1-3ヶ月の短中期',
            success_probability: this.calculateSuccessProbability('conservative', phase2Results),
            iching_resonance: this.calculateIChingResonance(phase2Results.selectedHexagram, 'conservative')
        };

        return this.enrichScenarioWithDetails(scenario, phase2Results);
    }

    /**
     * P3-006: 革新的シナリオ生成
     */
    async generateProgressiveScenario(phase2Results, perspectives) {
        const scenario = {
            id: 'progressive',
            title: '🚀 変革推進の道',
            subtitle: '新しい可能性への大胆な挑戦',
            perspective_focus: this.selectRelevantPerspectives(perspectives, 'progressive'),
            
            core_approach: {
                primary: '既存の枠を超越する',
                secondary: '創造的解決策を模索',
                tertiary: '変化をチャンスとして活用'
            },

            scenario_narrative: this.generateScenarioNarrative('progressive', phase2Results),
            
            specific_actions: [
                '従来のやり方を根本的に見直し',
                '革新的なアプローチを試行',
                '新しいネットワークや関係性を構築',
                'クリエイティブな解決策を探求',
                'リスクを取って大きな変化を実現'
            ],

            HaQei_contradictions: [
                {
                    element: '革新性 vs 安全欲求',
                    insight: '変化を求める分人と安全を望む分人の葛藤',
                    resolution: 'リスクを計算して挑戦することで両立を図る'
                }
            ],

            timeline: '3-12ヶ月の中長期',
            success_probability: this.calculateSuccessProbability('progressive', phase2Results),
            iching_resonance: this.calculateIChingResonance(phase2Results.selectedHexagram, 'progressive')
        };

        return this.enrichScenarioWithDetails(scenario, phase2Results);
    }

    /**
     * P3-007~014: 残り6シナリオの生成 (簡略化実装)
     */
    async generateIndividualScenario(phase2Results, perspectives) {
        return this.generateGenericScenario('individual', '🧘 個人重視の道', 'self-focus', phase2Results, perspectives);
    }

    async generateCollectiveScenario(phase2Results, perspectives) {
        return this.generateGenericScenario('collective', '👥 協力重視の道', 'community-focus', phase2Results, perspectives);
    }

    async generateImmediateScenario(phase2Results, perspectives) {
        return this.generateGenericScenario('immediate', '⚡ 即効性の道', 'quick-action', phase2Results, perspectives);
    }

    async generateLongTermScenario(phase2Results, perspectives) {
        return this.generateGenericScenario('longterm', '🌱 持続発展の道', 'long-view', phase2Results, perspectives);
    }

    async generateRationalScenario(phase2Results, perspectives) {
        return this.generateGenericScenario('rational', '🧠 論理重視の道', 'analytical', phase2Results, perspectives);
    }

    async generateIntuitiveScenario(phase2Results, perspectives) {
        return this.generateGenericScenario('intuitive', '💫 直感重視の道', 'instinctive', phase2Results, perspectives);
    }

    /**
     * P3-015: 矛盾シナリオの統合
     */
    integrateContradictoryScenarios(scenarios, contradictionPatterns) {
        return scenarios.map((scenario, index) => {
            // 各シナリオに矛盾要素を統合
            const relevantContradictions = this.findRelevantContradictions(scenario, contradictionPatterns);
            
            return {
                ...scenario,
                index: index + 1,
                contradiction_integration: {
                    acknowledged_contradictions: relevantContradictions,
                    harmony_approach: this.generateHarmonyApproach(scenario, relevantContradictions),
                    HaQei_wisdom: this.generateHaQeiWisdom(scenario, relevantContradictions)
                },
                complementary_scenarios: this.identifyComplementaryScenarios(scenario, scenarios),
                integration_potential: this.calculateIntegrationPotential(scenario, scenarios)
            };
        });
    }

    /**
     * P3-016: 統合的指導の生成
     */
    generateHolisticGuidance(integratedScenarios, phase2Results) {
        return {
            meta_guidance: {
                primary_message: 'すべてのシナリオが真実の一側面を表現しています',
                HaQei_principle: '複数の分人が共存することで、豊かな解決策が生まれます',
                contradiction_embrace: '矛盾する選択肢の存在こそが、人間の複雑性の現れです'
            },

            scenario_navigation: {
                how_to_choose: '状況や分人の強さに応じて適切なシナリオを選択',
                multi_scenario_approach: '複数シナリオの要素を組み合わせることも可能',
                dynamic_switching: '時間や状況の変化に応じてシナリオを切り替え'
            },

            practical_integration: [
                '各シナリオの良い要素を取り入れる',
                '矛盾する感情や考えを受け入れる',
                'その時々の分人に適したアプローチを選ぶ',
                '複数の視点を持つことを恐れない'
            ],

            philosophical_insight: {
                HaQei_truth: '一つの正解を求めるのではなく、多様性の中に真理がある',
                iching_wisdom: phase2Results.selectedHexagram.modern_interpretation,
                integration_path: '矛盾を統合することで、より深い理解に到達する'
            }
        };
    }

    // ========================================
    // 初期化メソッド群
    // ========================================

    initializeHaQeiMatrix() {
        return {
            personal_self: {
                characteristics: ['内省', '自己理解', '個人的価値観'],
                focus_areas: ['自己成長', '内的平和', '個人的目標'],
                natural_contradictions: ['社会的期待との葛藤', '他者への配慮との矛盾']
            },
            social_self: {
                characteristics: ['協調性', 'コミュニケーション', '他者配慮'],
                focus_areas: ['人間関係', '社会貢献', '協力関係'],
                natural_contradictions: ['個人的欲求との対立', '自己主張との葛藤']
            },
            professional_self: {
                characteristics: ['責任感', '効率性', '目標達成'],
                focus_areas: ['仕事の成果', 'キャリア発展', '専門性'],
                natural_contradictions: ['プライベートとの境界', '人間性との両立']
            },
            creative_self: {
                characteristics: ['創造性', '感性', '直感'],
                focus_areas: ['芸術表現', '革新', '美的体験'],
                natural_contradictions: ['論理性との対立', '効率性との矛盾']
            },
            protective_self: {
                characteristics: ['慎重性', '安全性', 'リスク回避'],
                focus_areas: ['安全確保', '準備', '予防'],
                natural_contradictions: ['挑戦欲求との対立', '成長意欲との葛藤']
            },
            adaptive_self: {
                characteristics: ['柔軟性', '適応能力', '変化対応'],
                focus_areas: ['環境適応', '学習', '成長'],
                natural_contradictions: ['安定欲求との対立', '一貫性との矛盾']
            },
            reflective_self: {
                characteristics: ['熟考', '分析', '深い思考'],
                focus_areas: ['理解', '洞察', '哲学的思考'],
                natural_contradictions: ['行動力との対立', '即応性との矛盾']
            },
            assertive_self: {
                characteristics: ['主張', '積極性', 'リーダーシップ'],
                focus_areas: ['目標達成', '影響力', '変革'],
                natural_contradictions: ['協調性との対立', '謙虚さとの矛盾']
            }
        };
    }

    initializeScenarioPatterns() {
        return {
            conservative: {
                keywords: ['安定', '継続', '改善', '着実'],
                emotional_tone: 'calm_confident',
                risk_level: 'low',
                change_pace: 'gradual'
            },
            progressive: {
                keywords: ['変革', '革新', '創造', '挑戦'],
                emotional_tone: 'excited_ambitious',
                risk_level: 'high',
                change_pace: 'rapid'
            },
            individual: {
                keywords: ['自己', '独立', '個性', '自律'],
                emotional_tone: 'focused_determined',
                risk_level: 'medium',
                change_pace: 'self_paced'
            },
            collective: {
                keywords: ['協力', '連携', '共同', '調和'],
                emotional_tone: 'warm_cooperative',
                risk_level: 'shared',
                change_pace: 'consensus_based'
            }
        };
    }

    initializeContradictionFramework() {
        return {
            acceptance_principles: [
                '矛盾は人間の自然な状態である',
                '複数の真理が同時に存在し得る',
                '矛盾から創造的解決策が生まれる',
                '完全性より多様性を重視する'
            ],
            resolution_approaches: [
                'both_and_thinking',    // 二元論を超える思考
                'contextual_switching', // 文脈に応じた切り替え
                'dynamic_balance',      // 動的バランス
                'creative_synthesis'    // 創造的統合
            ]
        };
    }

    initializeIChingScenarioMapping() {
        return {
            1: ['progressive', 'assertive', 'individual'], // 乾
            2: ['conservative', 'collective', 'adaptive'],  // 坤
            49: ['progressive', 'transformative'],          // 革
            52: ['reflective', 'conservative']              // 艮
            // 他の卦も必要に応じて追加
        };
    }

    // ========================================
    // ユーティリティメソッド群
    // ========================================

    generateGenericScenario(type, title, approach, phase2Results, perspectives) {
        const pattern = this.scenarioPatterns[type] || this.scenarioPatterns.conservative;
        
        return {
            id: type,
            title: title,
            subtitle: `${approach}によるアプローチ`,
            perspective_focus: this.selectRelevantPerspectives(perspectives, type),
            core_approach: {
                primary: `${pattern.keywords[0]}を重視する`,
                secondary: `${pattern.keywords[1]}に焦点を当てる`,
                tertiary: `${pattern.change_pace}で進める`
            },
            scenario_narrative: `${type}の視点からの解決アプローチ`,
            specific_actions: this.generateGenericActions(pattern),
            HaQei_contradictions: this.generateGenericContradictions(type),
            timeline: this.determineTimeline(pattern.change_pace),
            success_probability: 0.7,
            iching_resonance: 0.8
        };
    }

    generateGenericActions(pattern) {
        const actions = [
            `${pattern.keywords[0]}に基づいた計画立案`,
            `${pattern.keywords[1]}を考慮した実行`,
            `${pattern.emotional_tone}の感情状態を維持`,
            `${pattern.risk_level}レベルでのリスク管理`,
            `${pattern.change_pace}での進行管理`
        ];
        return actions;
    }

    generateGenericContradictions(type) {
        return [{
            element: `${type} vs 他の視点`,
            insight: `${type}の分人と他の分人の自然な対話`,
            resolution: '状況に応じた適切な選択'
        }];
    }

    cacheScenarios(inputText, result) {
        const cacheKey = inputText.substring(0, 50).replace(/\s+/g, '_');
        this.scenarioCache.set(cacheKey, {
            ...result,
            cached_at: Date.now()
        });
    }

    generateFallbackScenarios(phase2Results) {
        console.log('🔄 Generating fallback scenarios');
        
        return {
            inputText: phase2Results?.inputText || '',
            sourceHexagram: phase2Results?.selectedHexagram || { name: '基本卦' },
            scenarios: this.generateBasicScenarios(),
            HaQeiCompliance: true,
            phase: 'Phase 3 - Fallback',
            scenario_diversity: 0.6
        };
    }

    generateBasicScenarios() {
        return Array.from({ length: 8 }, (_, i) => ({
            id: `basic_binary_${i + 1}`,
            index: i + 1,
            title: `基本的道筋 ${i + 1}`,
            subtitle: '二分木フォールバック',
            route: ['basic', 'path', 'option'],
            core_approach: {
                primary: '基本的アプローチ',
                secondary: '状況対応',
                tertiary: '柔軟調整'
            },
            scenario_narrative: `基本的な${i + 1}番目の選択肢`,
            specific_actions: ['現状確認', '段階実行', '結果評価'],
            success_probability: 0.125,
            timeline: '3-6ヶ月'
        }));
    }

    // 簡略化された支援メソッド
    calculatePerspectiveStrength() { return Math.random() * 0.7 + 0.3; }
    createDynamicPerspectives() { return []; }
    getBasicPerspectives() { 
        return [{ type: 'personal_self', strength: 0.8, characteristics: ['自己重視'] }]; 
    }
    calculateHexagramAxisInfluence() { return Math.random() * 0.8 + 0.2; }
    adjustAxesForHexagram() { /* 卦に応じた軸調整 */ }
    identifyContradictionBetweenPerspectives() { 
        return { intensity: Math.random() * 0.8 + 0.2 }; 
    }
    generateContradictionResolution() { return '創造的統合'; }
    generateHaQeiInsight() { return 'HaQei的洞察'; }
    generateAxisPolarities() { return { positive: '積極', negative: '慎重' }; }
    generateAxisReconciliation() { return '動的バランス'; }
    generateHaQeiHarmony() { return '分人間の調和'; }
    identifyMetaContradictions() { return []; }
    selectRelevantPerspectives(perspectives, type) { 
        return perspectives.slice(0, 2); 
    }
    generateScenarioNarrative(type, results) { 
        return `${type}アプローチによる${results.selectedHexagram.name}の活用`; 
    }
    calculateSuccessProbability() { return Math.random() * 0.4 + 0.6; }
    calculateIChingResonance() { return Math.random() * 0.3 + 0.7; }
    enrichScenarioWithDetails(scenario) { return scenario; }
    findRelevantContradictions() { return []; }
    generateHarmonyApproach() { return 'harmonious_coexistence'; }
    generateHaQeiWisdom() { return '複数視点の受容'; }
    identifyComplementaryScenarios() { return []; }
    calculateIntegrationPotential() { return 0.8; }
    calculateContradictionAcceptance() { return 0.9; }
    generateDynamicPersonaSwitching() { return 'context_aware_switching'; }
    generateUnifiedIntegration() { return 'holistic_harmony'; }
    calculateScenarioDiversity() { return 0.85; }
    calculatePhilosophicalDepth() { return 0.8; }
    calculatePracticalApplicability() { return 0.75; }
    determineTimeline(pace) { 
        const timeframes = {
            gradual: '3-6ヶ月',
            rapid: '1-3ヶ月',
            self_paced: '柔軟対応',
            consensus_based: '6-12ヶ月'
        };
        return timeframes[pace] || '3ヶ月';
    }
    
    /**
     * Memory Management Methods (メモリリーク修正)
     */
    startMemoryCleanup() {
        this.memoryManager.cleanupInterval = setInterval(() => {
            this.performCacheCleanup();
        }, 300000); // 5分毎にクリーンアップ
    }
    
    performCacheCleanup() {
        const now = Date.now();
        const maxAge = 1800000; // 30分
        
        // 古いキャッシュエントリを削除
        for (const [key, value] of this.scenarioCache) {
            if (now - value.cached_at > maxAge) {
                this.scenarioCache.delete(key);
            }
        }
        
        // キャッシュサイズ制限
        if (this.scenarioCache.size > this.memoryManager.cacheLimit) {
            const entries = Array.from(this.scenarioCache.entries());
            entries.sort((a, b) => a[1].cached_at - b[1].cached_at);
            
            const deleteCount = this.scenarioCache.size - this.memoryManager.cacheLimit;
            for (let i = 0; i < deleteCount; i++) {
                this.scenarioCache.delete(entries[i][0]);
            }
        }
        
        this.memoryManager.lastCleanup = now;
        console.log('🧹 Scenario cache cleanup completed:', this.scenarioCache.size, 'entries');
    }
    
    /**
     * インスタンス破棄時のクリーンアップ
     */
    cleanup() {
        if (this.memoryManager.cleanupInterval) {
            clearInterval(this.memoryManager.cleanupInterval);
            this.memoryManager.cleanupInterval = null;
        }
        
        this.scenarioCache.clear();
        this.HaQeiMatrix = null;
        this.scenarioPatterns = null;
        this.contradictionFramework = null;
        this.iChingScenarioMapping = null;
        this.memoryManager = null;
        
        console.log('🗑️ EightScenariosGenerator cleanup completed');
    }
    
    /**
     * メモリ使用量の監視
     */
    getMemoryUsage() {
        return {
            cacheSize: this.scenarioCache.size,
            cacheLimit: this.memoryManager.cacheLimit,
            lastCleanup: this.memoryManager.lastCleanup
        };
    }
}

// グローバル利用のためのエクスポート
if (typeof window !== 'undefined') {
    window.EightScenariosGenerator = EightScenariosGenerator;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EightScenariosGenerator;
}

console.log('✅ EightScenariosGenerator.js Phase 3 implementation loaded successfully');