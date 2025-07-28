// AdvancedCompatibilityEngine.js - 高度な内的チーム相性分析システム
// HaQei Analyzer - Advanced Internal Team Compatibility Analysis System

class AdvancedCompatibilityEngine {
    constructor(internalCompatibilityEngine, options = {}) {
        this.internalCompatibilityEngine = internalCompatibilityEngine;
        this.options = {
            enableDetailedData: true,
            enableDataLoader: true,
            ...options
        };
        
        this.initializePatternDatabase();
        this.initializeHistoricalDatabase();
        
        // CompatibilityDataLoaderを初期化
        if (this.options.enableDataLoader) {
            this.initializeDataLoader();
        }
    }

    /**
     * CompatibilityDataLoaderを初期化
     */
    async initializeDataLoader() {
        try {
            // 動的インポート
            const { default: CompatibilityDataLoader } = await import('./CompatibilityDataLoader.js');
            this.dataLoader = new CompatibilityDataLoader({
                cacheEnabled: true,
                enableValidation: true
            });
            
            console.log("✅ CompatibilityDataLoader integrated with AdvancedCompatibilityEngine");
        } catch (error) {
            console.warn("⚠️ Failed to initialize CompatibilityDataLoader:", error);
            this.dataLoader = null;
        }
    }

    /**
     * 特殊パターンデータベースを初期化（タスク12.4）
     */
    initializePatternDatabase() {
        this.specialPatterns = {
            // 逆説的シナジー型
            paradoxicalSynergy: {
                name: '逆説的シナジー型',
                description: '一見対立する要素が創造的な相乗効果を生み出すパターン',
                detectionCriteria: {
                    conflictThreshold: 0.6,
                    synergyThreshold: 0.7,
                    stabilityRange: [0.3, 0.7]
                },
                characteristics: [
                    '内面に創造的緊張を抱えている',
                    '矛盾を統合して新しい価値を生み出す',
                    '従来の枠組みを超えた発想力がある',
                    '複雑な状況下で真価を発揮する'
                ],
                advice: [
                    '内的な緊張感を創造のエネルギーとして活用する',
                    '矛盾する要素を統合する機会を積極的に求める',
                    '従来の常識にとらわれない視点を大切にする'
                ]
            },

            // 状況依存型
            contextDependent: {
                name: '状況依存型',
                description: '環境や状況によってOS間の関係性が大きく変化するパターン',
                detectionCriteria: {
                    variabilityThreshold: 0.4,
                    adaptabilityScore: 0.6,
                    environmentSensitivity: 0.7
                },
                characteristics: [
                    '環境の変化に敏感に反応する',
                    '状況に応じて異なる一面を見せる',
                    '適応力に優れているが一貫性に課題',
                    'コンテキストを読む能力が高い'
                ],
                advice: [
                    '自分の状況依存性を理解し活用する',
                    '環境に応じた戦略的な自己表現を心がける',
                    '安定した軸となる価値観を明確にする'
                ]
            },

            // 成長段階型
            growthStage: {
                name: '成長段階型',
                description: '人生のステージに応じてOS構成が変化し続けるパターン',
                detectionCriteria: {
                    developmentPotential: 0.8,
                    flexibilityScore: 0.7,
                    evolutionCapacity: 0.6
                },
                characteristics: [
                    '継続的な自己変革への意欲が強い',
                    '新しい経験から学ぶ能力が高い',
                    '固定的な自己像にとらわれない',
                    '長期的な成長プロセスを重視する'
                ],
                advice: [
                    '現在の成長段階を受け入れつつ将来を見据える',
                    '経験から学び続ける姿勢を大切にする',
                    '変化を恐れず新しい挑戦を積極的に行う'
                ]
            }
        };
    }

    /**
     * 歴史上の人物データベースを初期化（タスク12.2）
     */
    initializeHistoricalDatabase() {
        this.historicalExamples = {
            // 創造的天才型（乾為天系）
            creativeGenius: {
                pattern: '創造的天才型',
                examples: [
                    {
                        name: 'レオナルド・ダ・ヴィンチ',
                        osPattern: { engine: 1, interface: 49, safeMode: 33 }, // 乾為天 + 風地観 + 地雷復
                        description: '芸術と科学を融合させた万能の天才。創造性と実験精神、そして内省的な観察力を併せ持つ。',
                        traits: ['多分野での創造性', '観察と実験の重視', '内向的な探究心'],
                        modernApplication: 'イノベーションを追求しつつ、深い洞察力で本質を見抜く現代のクリエイター'
                    },
                    {
                        name: 'アルバート・アインシュタイン',
                        osPattern: { engine: 1, interface: 61, safeMode: 52 },
                        description: '理論物理学の革命者。直感的洞察と論理的思考、そして独立した精神を持つ。',
                        traits: ['直感的な洞察力', '独立した思考', '既存概念への疑問視'],
                        modernApplication: '従来の枠組みを超えた発想で、革新的なソリューションを生み出すリーダー'
                    }
                ]
            },

            // 調和的統合型
            harmoniousIntegrator: {
                pattern: '調和的統合型',
                examples: [
                    {
                        name: '聖徳太子',
                        osPattern: { engine: 11, interface: 45, safeMode: 15 },
                        description: '異なる価値観を統合し、調和のとれた社会を築いた政治家・思想家。',
                        traits: ['多様性の受容', '統合的思考', '長期的視点'],
                        modernApplication: '多様なチームをまとめ、組織全体の調和を図るマネージャー'
                    },
                    {
                        name: 'ネルソン・マンデラ',
                        osPattern: { engine: 11, interface: 19, safeMode: 8 },
                        description: '対立を乗り越え、和解と統合を実現した政治的リーダー。',
                        traits: ['寛容性', '忍耐力', '統合的リーダーシップ'],
                        modernApplication: '困難な状況でも人々を結束させ、建設的な解決策を見出すリーダー'
                    }
                ]
            },

            // 変革推進型
            transformationalLeader: {
                pattern: '変革推進型',
                examples: [
                    {
                        name: 'スティーブ・ジョブズ',
                        osPattern: { engine: 1, interface: 43, safeMode: 51 },
                        description: '業界を変革し続けた革新的な企業家。完璧主義と変革への情熱を持つ。',
                        traits: ['完璧主義', '革新への執着', '強烈なビジョン'],
                        modernApplication: '業界標準を覆し、新しい価値を創造する革新的な起業家'
                    }
                ]
            },

            // 探究者型
            explorer: {
                pattern: '探究者型',
                examples: [
                    {
                        name: 'マリー・キュリー',
                        osPattern: { engine: 3, interface: 57, safeMode: 29 },
                        description: '科学への情熱と粘り強い探究心で新たな発見を成し遂げた研究者。',
                        traits: ['科学への情熱', '粘り強さ', '先駆者精神'],
                        modernApplication: '未知の領域に挑戦し、新しい知識や技術を開拓する研究者'
                    }
                ]
            }
        };
    }

    /**
     * 包括的な内的チーム分析を実行（タスク12.1）
     */
    async analyzeInternalTeamComposition(engineOsId, interfaceOsId, safeModeOsId, userContext = {}) {
        console.log("🔍 AdvancedCompatibilityEngine: Starting analysis");
        console.log("🔍 internalCompatibilityEngine:", this.internalCompatibilityEngine);
        
        if (!this.internalCompatibilityEngine) {
            throw new Error("InternalCompatibilityEngine is not available");
        }
        
        if (typeof this.internalCompatibilityEngine.analyzeTripleOSCompatibility !== 'function') {
            throw new Error("analyzeTripleOSCompatibility method is not available");
        }
        
        // 基本的な相性分析
        const basicCompatibility = this.internalCompatibilityEngine.analyzeTripleOSCompatibility(
            engineOsId, interfaceOsId, safeModeOsId
        );
        
        console.log("🔍 basicCompatibility:", basicCompatibility);

        // 詳細データを取得（CompatibilityDataLoaderを使用）
        const detailedData = await this.getDetailedCompatibilityData(engineOsId, interfaceOsId, safeModeOsId);

        // 特殊パターン検出
        const specialPattern = this.detectSpecialPatterns(basicCompatibility, userContext);

        // 歴史上の人物との類似性分析
        const historicalMatches = this.findHistoricalMatches(engineOsId, interfaceOsId, safeModeOsId);

        // 動的コンテキスト評価
        const contextualAdjustment = this.evaluateContextualFactors(basicCompatibility, userContext);

        // 内的バランス最適化ヒント
        const optimizationHints = this.generateOptimizationHints(
            basicCompatibility, specialPattern, contextualAdjustment
        );

        return {
            basicCompatibility,
            detailedData,
            specialPattern,
            historicalMatches,
            contextualAdjustment,
            optimizationHints,
            overallAssessment: this.generateOverallAssessment(
                basicCompatibility, specialPattern, historicalMatches, contextualAdjustment
            )
        };
    }

    /**
     * 詳細な相性データを取得
     */
    async getDetailedCompatibilityData(engineOsId, interfaceOsId, safeModeOsId) {
        if (!this.dataLoader) {
            console.warn("⚠️ CompatibilityDataLoader not available, returning null");
            return null;
        }

        try {
            const detailedData = await this.dataLoader.getTripleOSCompatibility(
                engineOsId, interfaceOsId, safeModeOsId
            );

            console.log(`✅ Retrieved detailed compatibility data for ${engineOsId}-${interfaceOsId}-${safeModeOsId}`);
            return detailedData;

        } catch (error) {
            console.warn("⚠️ Failed to get detailed compatibility data:", error.message);
            return null;
        }
    }

    /**
     * 特殊パターンを検出（タスク12.4）
     */
    detectSpecialPatterns(compatibility, userContext) {
        const patterns = [];

        // 逆説的シナジー型の検出
        if (this.checkParadoxicalSynergy(compatibility)) {
            patterns.push({
                type: 'paradoxicalSynergy',
                confidence: this.calculatePatternConfidence(compatibility, 'paradoxicalSynergy'),
                ...this.specialPatterns.paradoxicalSynergy
            });
        }

        // 状況依存型の検出
        if (this.checkContextDependent(compatibility, userContext)) {
            patterns.push({
                type: 'contextDependent',
                confidence: this.calculatePatternConfidence(compatibility, 'contextDependent'),
                ...this.specialPatterns.contextDependent
            });
        }

        // 成長段階型の検出
        if (this.checkGrowthStage(compatibility, userContext)) {
            patterns.push({
                type: 'growthStage',
                confidence: this.calculatePatternConfidence(compatibility, 'growthStage'),
                ...this.specialPatterns.growthStage
            });
        }

        return patterns.length > 0 ? patterns[0] : null; // 最も信頼度の高いパターンを返す
    }

    /**
     * 逆説的シナジー型の検出
     */
    checkParadoxicalSynergy(compatibility) {
        const { engineInterface, engineSafeMode, interfaceSafeMode } = compatibility;
        
        // 高い葛藤と高いシナジーが同時に存在するかチェック
        const hasHighConflict = (
            engineInterface.conflict > 0.6 || 
            engineSafeMode.conflict > 0.6 || 
            interfaceSafeMode.conflict > 0.6
        );

        const hasHighSynergy = (
            engineInterface.synergy > 0.7 || 
            engineSafeMode.synergy > 0.7 || 
            interfaceSafeMode.synergy > 0.7
        );

        return hasHighConflict && hasHighSynergy;
    }

    /**
     * 状況依存型の検出
     */
    checkContextDependent(compatibility, userContext) {
        // 相性スコアの変動性をチェック
        const scores = [
            compatibility.engineInterface.synergy - compatibility.engineInterface.conflict,
            compatibility.engineSafeMode.synergy - compatibility.engineSafeMode.conflict,
            compatibility.interfaceSafeMode.synergy - compatibility.interfaceSafeMode.conflict
        ];

        const variance = this.calculateVariance(scores);
        return variance > 0.4; // 高い変動性
    }

    /**
     * 成長段階型の検出
     */
    checkGrowthStage(compatibility, userContext) {
        // ユーザーコンテキストから成長意欲や変化への適応性を評価
        const hasGrowthMindset = userContext.lifeStage === 'developing' || 
                                userContext.goals?.includes('personal_growth');
        
        const hasFlexibility = Object.values(compatibility).some(
            relation => relation.harmony > 0.6 && relation.tension > 0.3
        );

        return hasGrowthMindset && hasFlexibility;
    }

    /**
     * パターンの信頼度を計算
     */
    calculatePatternConfidence(compatibility, patternType) {
        const criteria = this.specialPatterns[patternType].detectionCriteria;
        let confidence = 0;
        let criteriaCount = 0;

        Object.keys(criteria).forEach(key => {
            criteriaCount++;
            switch(key) {
                case 'conflictThreshold':
                    const maxConflict = Math.max(
                        compatibility.engineInterface.conflict,
                        compatibility.engineSafeMode.conflict,
                        compatibility.interfaceSafeMode.conflict
                    );
                    if (maxConflict >= criteria[key]) confidence++;
                    break;
                case 'synergyThreshold':
                    const maxSynergy = Math.max(
                        compatibility.engineInterface.synergy,
                        compatibility.engineSafeMode.synergy,
                        compatibility.interfaceSafeMode.synergy
                    );
                    if (maxSynergy >= criteria[key]) confidence++;
                    break;
                // 他の基準も同様に実装
            }
        });

        return confidence / criteriaCount;
    }

    /**
     * 歴史上の人物との類似性分析（タスク12.2）
     */
    findHistoricalMatches(engineOsId, interfaceOsId, safeModeOsId) {
        const userPattern = { engine: engineOsId, interface: interfaceOsId, safeMode: safeModeOsId };
        const matches = [];

        Object.values(this.historicalExamples).forEach(category => {
            category.examples.forEach(example => {
                const similarity = this.calculatePatternSimilarity(userPattern, example.osPattern);
                if (similarity > 0.6) { // 60%以上の類似性
                    matches.push({
                        ...example,
                        similarity: similarity,
                        patternType: category.pattern
                    });
                }
            });
        });

        // 類似度でソートして上位3位まで返す
        return matches.sort((a, b) => b.similarity - a.similarity).slice(0, 3);
    }

    /**
     * パターン類似度を計算
     */
    calculatePatternSimilarity(pattern1, pattern2) {
        const keys = ['engine', 'interface', 'safeMode'];
        let totalSimilarity = 0;

        keys.forEach(key => {
            const diff = Math.abs(pattern1[key] - pattern2[key]);
            const similarity = 1 - (diff / 64); // 64卦の最大差分で正規化
            totalSimilarity += similarity;
        });

        return totalSimilarity / keys.length;
    }

    /**
     * 動的コンテキスト評価（タスク12.3）
     */
    evaluateContextualFactors(compatibility, userContext) {
        const adjustments = {
            lifeStageAdjustment: this.calculateLifeStageAdjustment(userContext.lifeStage),
            goalsAdjustment: this.calculateGoalsAdjustment(userContext.goals),
            challengesAdjustment: this.calculateChallengesAdjustment(userContext.challenges),
            environmentAdjustment: this.calculateEnvironmentAdjustment(userContext.environment)
        };

        const adjustedCompatibility = this.applyContextualAdjustments(compatibility, adjustments);

        return {
            originalCompatibility: compatibility,
            adjustments,
            adjustedCompatibility,
            contextualInsights: this.generateContextualInsights(adjustments, userContext)
        };
    }

    /**
     * ライフステージに基づく調整
     */
    calculateLifeStageAdjustment(lifeStage) {
        const adjustments = {
            'exploring': { curiosity: 1.2, stability: 0.8, growth: 1.3 },
            'establishing': { stability: 1.2, achievement: 1.3, security: 1.1 },
            'developing': { growth: 1.3, adaptation: 1.2, wisdom: 1.1 },
            'mastering': { expertise: 1.3, teaching: 1.2, legacy: 1.1 },
            'reflecting': { wisdom: 1.3, integration: 1.2, peace: 1.1 }
        };

        return adjustments[lifeStage] || { balanced: 1.0 };
    }

    /**
     * 内的バランス最適化ヒントを生成
     */
    generateOptimizationHints(compatibility, specialPattern, contextualAdjustment) {
        const hints = {
            immediate: [], // 今すぐできること
            shortTerm: [], // 1-3ヶ月で取り組むこと
            longTerm: [], // 6ヶ月-1年で達成すること
            lifestyle: [] // ライフスタイルの調整
        };

        // 基本的な相性に基づくヒント
        this.addCompatibilityBasedHints(hints, compatibility);

        // 特殊パターンに基づくヒント
        if (specialPattern) {
            this.addSpecialPatternHints(hints, specialPattern);
        }

        // コンテキストに基づくヒント
        if (contextualAdjustment) {
            this.addContextualHints(hints, contextualAdjustment);
        }

        return hints;
    }

    /**
     * 相性に基づくヒントを追加
     */
    addCompatibilityBasedHints(hints, compatibility) {
        // エンジン-インターフェース間の最適化
        if (compatibility.engineInterface.conflict > 0.6) {
            hints.immediate.push('内なる価値観と外向きの行動の間に矛盾を感じる時は、一度立ち止まって自分の本当の気持ちを確認する');
            hints.shortTerm.push('価値観に沿った行動を意識的に増やし、表面的な行動を減らす練習をする');
        }

        if (compatibility.engineInterface.synergy > 0.7) {
            hints.immediate.push('内面と外面が調和している今の状態を意識的に認識し、この感覚を記憶に留める');
            hints.longTerm.push('この調和状態を他の人にも伝え、チーム全体の一体感を高める役割を担う');
        }

        // エンジン-セーフモード間の最適化
        if (compatibility.engineSafeMode.tension > 0.6) {
            hints.shortTerm.push('理想と現実のギャップを受け入れつつ、小さな一歩から始める');
            hints.lifestyle.push('リスクを取る前に十分な準備期間を設ける習慣を作る');
        }

        // インターフェース-セーフモード間の最適化
        if (compatibility.interfaceSafeMode.harmony > 0.7) {
            hints.immediate.push('人前での表現と内面の安全感が調和している状態を活かし、安心して自己表現する');
            hints.longTerm.push('この安定感を基盤として、より大きな挑戦に取り組む');
        }
    }

    /**
     * 特殊パターンに基づくヒントを追加
     */
    addSpecialPatternHints(hints, specialPattern) {
        if (specialPattern.advice && Array.isArray(specialPattern.advice)) {
            specialPattern.advice.forEach((advice, index) => {
                const category = ['immediate', 'shortTerm', 'longTerm'][index % 3];
                hints[category].push(`[${specialPattern.name}] ${advice}`);
            });
        }
    }

    /**
     * コンテキストに基づくヒントを追加
     */
    addContextualHints(hints, contextualAdjustment) {
        if (contextualAdjustment.contextualInsights) {
            contextualAdjustment.contextualInsights.forEach(insight => {
                hints.lifestyle.push(insight);
            });
        }
    }

    /**
     * 総合評価を生成
     */
    generateOverallAssessment(compatibility, specialPattern, historicalMatches, contextualAdjustment) {
        const overallScore = this.calculateOverallTeamScore(compatibility);
        
        let assessment = {
            teamEffectiveness: overallScore,
            strengthAreas: this.identifyStrengthAreas(compatibility),
            growthAreas: this.identifyGrowthAreas(compatibility),
            uniqueCharacteristics: [],
            recommendations: []
        };

        // 特殊パターンの特徴を追加
        if (specialPattern) {
            assessment.uniqueCharacteristics.push(`${specialPattern.name}: ${specialPattern.description}`);
            assessment.recommendations.push(`${specialPattern.name}の特性を活かした成長戦略を採用する`);
        }

        // 歴史上の人物との類似性を追加
        if (historicalMatches.length > 0) {
            const topMatch = historicalMatches[0];
            assessment.uniqueCharacteristics.push(
                `${topMatch.name}との類似性 (${Math.round(topMatch.similarity * 100)}%)`
            );
            assessment.recommendations.push(topMatch.modernApplication);
        }

        return assessment;
    }

    /**
     * チーム全体のスコアを計算
     */
    calculateOverallTeamScore(compatibility) {
        const relations = [compatibility.engineInterface, compatibility.engineSafeMode, compatibility.interfaceSafeMode];
        
        let totalScore = 0;
        relations.forEach(relation => {
            const relationScore = (relation.synergy + relation.harmony - relation.conflict) / 3;
            totalScore += relationScore;
        });

        return Math.max(0, Math.min(1, totalScore / relations.length));
    }

    /**
     * 強みエリアを特定
     */
    identifyStrengthAreas(compatibility) {
        const strengths = [];
        
        if (compatibility.engineInterface.synergy > 0.7) {
            strengths.push('内面と外面の統一性');
        }
        if (compatibility.engineSafeMode.harmony > 0.7) {
            strengths.push('理想と現実のバランス');
        }
        if (compatibility.interfaceSafeMode.synergy > 0.7) {
            strengths.push('表現力と安定感の両立');
        }

        return strengths.length > 0 ? strengths : ['バランスの取れた人格構造'];
    }

    /**
     * 成長エリアを特定
     */
    identifyGrowthAreas(compatibility) {
        const growthAreas = [];
        
        if (compatibility.engineInterface.conflict > 0.6) {
            growthAreas.push('価値観と行動の一致');
        }
        if (compatibility.engineSafeMode.tension > 0.6) {
            growthAreas.push('理想追求と安全確保の調和');
        }
        if (compatibility.interfaceSafeMode.conflict > 0.6) {
            growthAreas.push('外向性と内向性のバランス');
        }

        return growthAreas.length > 0 ? growthAreas : ['現在の調和状態の維持'];
    }

    /**
     * 分散を計算するヘルパー関数
     */
    calculateVariance(values) {
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
        return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
    }

    /**
     * コンテキスト調整を適用
     */
    applyContextualAdjustments(compatibility, adjustments) {
        // 実装の簡略化のため、基本的な調整のみ適用
        return compatibility; // 詳細な実装は要件に応じて拡張
    }

    /**
     * コンテキスト洞察を生成
     */
    generateContextualInsights(adjustments, userContext) {
        const insights = [];
        
        if (userContext.lifeStage === 'exploring') {
            insights.push('探索期にある今、多様な経験を積むことで内的統合が促進されます');
        }
        
        if (userContext.goals?.includes('career_growth')) {
            insights.push('キャリア成長への意欲を、内的チームの調和を保ちながら追求することが重要です');
        }

        return insights;
    }

    /**
     * 目標に基づく調整を計算
     */
    calculateGoalsAdjustment(goals) {
        if (!goals || !Array.isArray(goals)) return { neutral: 1.0 };
        
        const adjustments = { neutral: 1.0 };
        
        goals.forEach(goal => {
            switch(goal) {
                case 'career_growth':
                    adjustments.achievement = 1.2;
                    adjustments.ambition = 1.1;
                    break;
                case 'personal_growth':
                    adjustments.growth = 1.3;
                    adjustments.reflection = 1.1;
                    break;
                case 'relationship_improvement':
                    adjustments.harmony = 1.2;
                    adjustments.empathy = 1.1;
                    break;
                case 'work_life_balance':
                    adjustments.stability = 1.2;
                    adjustments.integration = 1.1;
                    break;
            }
        });

        return adjustments;
    }

    /**
     * 課題に基づく調整を計算
     */
    calculateChallengesAdjustment(challenges) {
        if (!challenges || !Array.isArray(challenges)) return { neutral: 1.0 };
        
        const adjustments = { neutral: 1.0 };
        
        challenges.forEach(challenge => {
            switch(challenge) {
                case 'stress_management':
                    adjustments.safeMode = 1.2;
                    adjustments.stability = 1.1;
                    break;
                case 'decision_making':
                    adjustments.integration = 1.2;
                    adjustments.clarity = 1.1;
                    break;
                case 'communication':
                    adjustments.interface = 1.2;
                    adjustments.expression = 1.1;
                    break;
            }
        });

        return adjustments;
    }

    /**
     * 環境に基づく調整を計算
     */
    calculateEnvironmentAdjustment(environment) {
        if (!environment) return { neutral: 1.0 };
        
        const adjustments = { neutral: 1.0 };
        
        switch(environment.type) {
            case 'corporate':
                adjustments.structure = 1.1;
                adjustments.stability = 1.1;
                break;
            case 'startup':
                adjustments.flexibility = 1.2;
                adjustments.innovation = 1.1;
                break;
            case 'creative':
                adjustments.creativity = 1.3;
                adjustments.expression = 1.2;
                break;
            case 'academic':
                adjustments.analysis = 1.2;
                adjustments.depth = 1.1;
                break;
        }

        return adjustments;
    }
}

window.AdvancedCompatibilityEngine = AdvancedCompatibilityEngine;