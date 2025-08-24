/**
 * SummaryGenerator - AI要約システム
 * V3データベースを活用して4行要約と10行詳細サマリーを生成
 */
class SummaryGenerator {
    constructor() {
        this.version = '1.0.0';
        this.v3Database = null;
        this.initializeV3Database();
        console.log('📝 SummaryGenerator初期化完了');
    }

    /**
     * V3データベースの初期化
     */
    initializeV3Database() {
        if (typeof window !== 'undefined' && window.HexagramHumanTraitsV3) {
            this.v3Database = window.HexagramHumanTraitsV3;
            console.log('✅ V3データベース接続成功');
        } else {
            console.error('❌ V3データベースが見つかりません');
        }
    }

    /**
     * Triple OSの4行要約を生成
     * @param {Object} analysisData - Triple OS分析データ
     * @returns {Object} 4行要約オブジェクト
     */
    generateFourLineSummary(analysisData) {
        try {
            const { engineOS, interfaceOS, safeModeOS } = analysisData;
            
            // 各OSの特性を抽出
            const engineProfile = this.getOSProfile(engineOS.hexagramName, 'engineOS');
            const interfaceProfile = this.getOSProfile(interfaceOS.hexagramName, 'interfaceOS');
            const safeModeProfile = this.getOSProfile(safeModeOS.hexagramName, 'safeModeOS');

            // スコアバランス分析
            const balance = this.analyzeScoreBalance(engineOS.score, interfaceOS.score, safeModeOS.score);

            return {
                line1: `あなたの内なる原動力は「${engineProfile.type || 'バランス型'}」- ${engineProfile.description || '安定した推進力を持つ'}`,
                line2: `社会との関わり方は「${interfaceProfile.type || '調和型'}」- ${interfaceProfile.description || '周囲と協調しながら進む'}`,
                line3: `ストレス対処法は「${safeModeProfile.type || '適応型'}」- ${safeModeProfile.description || '状況に応じて柔軟に対応'}`,
                line4: `総合評価：${balance.dominant}が${balance.score}pts で最も強く、${balance.characteristic}な特性を持つ`
            };
        } catch (error) {
            console.error('❌ 4行要約生成エラー:', error);
            return this.getFallbackFourLineSummary(analysisData);
        }
    }

    /**
     * 10行詳細サマリーを生成
     * @param {Object} analysisData - Triple OS分析データ
     * @returns {Object} 詳細サマリーオブジェクト
     */
    generateDetailedSummary(analysisData) {
        try {
            const { engineOS, interfaceOS, safeModeOS } = analysisData;
            
            // V3データから詳細情報を取得
            const engineV3 = this.getV3DataForOS(engineOS.hexagramName, 'engineOS');
            const interfaceV3 = this.getV3DataForOS(interfaceOS.hexagramName, 'interfaceOS');
            const safeModeV3 = this.getV3DataForOS(safeModeOS.hexagramName, 'safeModeOS');

            // 相互作用分析
            const interactions = this.analyzeOSInteractions(engineOS, interfaceOS, safeModeOS);

            return {
                overview: this.generateOverview(engineOS, interfaceOS, safeModeOS),
                engineAnalysis: this.generateEngineAnalysis(engineV3, engineOS.score),
                interfaceAnalysis: this.generateInterfaceAnalysis(interfaceV3, interfaceOS.score),
                safeModeAnalysis: this.generateSafeModeAnalysis(safeModeV3, safeModeOS.score),
                interactions: interactions,
                recommendations: this.generateRecommendations(engineV3, interfaceV3, safeModeV3),
                strengths: this.extractStrengths(engineV3, interfaceV3, safeModeV3),
                growthAreas: this.identifyGrowthAreas(engineOS, interfaceOS, safeModeOS),
                actionItems: this.generateActionItems(engineV3, interfaceV3, safeModeV3),
                conclusion: this.generateConclusion(analysisData)
            };
        } catch (error) {
            console.error('❌ 詳細サマリー生成エラー:', error);
            return this.getFallbackDetailedSummary(analysisData);
        }
    }

    /**
     * スコアの詳細説明を生成
     * @param {number} score - スコア値
     * @param {string} osType - OSタイプ
     * @returns {Object} スコア説明オブジェクト
     */
    explainScore(score, osType) {
        const scoreLevel = this.categorizeScore(score);
        const osTypeMap = {
            engineOS: '内なる原動力',
            interfaceOS: '社会適応力',
            safeModeOS: 'ストレス耐性'
        };

        return {
            level: scoreLevel.level,
            message: scoreLevel.message,
            interpretation: `${osTypeMap[osType] || 'この特性'}において${scoreLevel.interpretation}`,
            advice: this.getScoreAdvice(score, osType),
            percentile: this.calculatePercentile(score),
            visualization: this.generateScoreVisualization(score)
        };
    }

    /**
     * OSプロファイルを取得
     * @param {string} hexagramName - 卦名
     * @param {string} osType - OSタイプ
     * @returns {Object} プロファイル情報
     */
    getOSProfile(hexagramName, osType) {
        const v3Data = this.getV3DataForOS(hexagramName, osType);
        if (v3Data && v3Data.profile) {
            return v3Data.profile;
        }
        return { type: 'バランス型', description: '安定した特性を持つ' };
    }

    /**
     * V3データベースからOSデータを取得
     * @param {string} hexagramName - 卦名
     * @param {string} osType - OSタイプ
     * @returns {Object|null} V3データ
     */
    getV3DataForOS(hexagramName, osType) {
        if (!this.v3Database || !hexagramName) return null;

        const normalizedName = this.normalizeHexagramName(hexagramName);
        const hexagramData = this.v3Database[normalizedName];

        if (!hexagramData) return null;

        switch(osType) {
            case 'engineOS':
                return hexagramData.asEngineOS;
            case 'interfaceOS':
                return hexagramData.asInterfaceOS;
            case 'safeModeOS':
                return hexagramData.asSafeModeOS;
            default:
                return null;
        }
    }

    /**
     * 卦名の正規化
     * @param {string} name - 卦名
     * @returns {string} 正規化された卦名
     */
    normalizeHexagramName(name) {
        const replacements = {
            '为': '為', '泽': '澤', '讼': '訟', '师': '師',
            '贲': '賁', '剥': '剝', '复': '復', '风': '風'
        };

        let normalized = name;
        for (const [chinese, japanese] of Object.entries(replacements)) {
            normalized = normalized.replace(new RegExp(chinese, 'g'), japanese);
        }
        return normalized;
    }

    /**
     * スコアバランス分析
     * @param {number} engineScore - Engineスコア
     * @param {number} interfaceScore - Interfaceスコア  
     * @param {number} safeModeScore - SafeModeスコア
     * @returns {Object} バランス分析結果
     */
    analyzeScoreBalance(engineScore, interfaceScore, safeModeScore) {
        const scores = {
            'Engine OS': engineScore,
            'Interface OS': interfaceScore,
            'SafeMode OS': safeModeScore
        };

        const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const [dominant] = sortedScores[0];
        const score = scores[dominant];

        const characteristics = {
            'Engine OS': '創造的で革新的',
            'Interface OS': '社交的で協調的', 
            'SafeMode OS': '安定的で慎重'
        };

        return {
            dominant,
            score,
            characteristic: characteristics[dominant] || 'バランスの取れた'
        };
    }

    /**
     * スコアレベル分類
     * @param {number} score - スコア値
     * @returns {Object} スコアレベル情報
     */
    categorizeScore(score) {
        if (score >= 85) {
            return {
                level: 'exceptional',
                message: '非常に優秀',
                interpretation: '極めて高い能力を発揮している'
            };
        } else if (score >= 70) {
            return {
                level: 'high',
                message: '優秀',
                interpretation: '高い能力を持っている'
            };
        } else if (score >= 55) {
            return {
                level: 'good',
                message: '良好',
                interpretation: '良好なレベルにある'
            };
        } else if (score >= 40) {
            return {
                level: 'average',
                message: '平均的',
                interpretation: '平均的なレベルにある'
            };
        } else {
            return {
                level: 'developing',
                message: '発達途上',
                interpretation: '成長の余地がある'
            };
        }
    }

    /**
     * スコアアドバイス生成
     * @param {number} score - スコア値
     * @param {string} osType - OSタイプ
     * @returns {string} アドバイス文
     */
    getScoreAdvice(score, osType) {
        const adviceMap = {
            engineOS: {
                high: '創造的な取り組みを続け、新しいチャレンジを',
                medium: '好奇心を大切にし、学習機会を増やしましょう',
                low: '小さな改善から始め、成功体験を積み重ねましょう'
            },
            interfaceOS: {
                high: 'リーダーシップを発揮し、他者をサポートしましょう',
                medium: 'コミュニケーション機会を増やしましょう',
                low: '信頼関係の構築から始めましょう'
            },
            safeModeOS: {
                high: '安定感を活かし、チームの支えとなりましょう',
                medium: 'リスク管理能力を磨きましょう',
                low: 'ストレス対処法を身に付けましょう'
            }
        };

        const level = score >= 70 ? 'high' : score >= 50 ? 'medium' : 'low';
        return adviceMap[osType]?.[level] || '継続的な成長を心がけましょう';
    }

    /**
     * パーセンタイル計算
     * @param {number} score - スコア値
     * @returns {number} パーセンタイル
     */
    calculatePercentile(score) {
        // 正規分布を仮定したパーセンタイル計算
        if (score >= 85) return 95;
        if (score >= 75) return 85;
        if (score >= 65) return 70;
        if (score >= 55) return 55;
        if (score >= 45) return 40;
        if (score >= 35) return 25;
        return 15;
    }

    /**
     * スコア可視化データ生成
     * @param {number} score - スコア値
     * @returns {Object} 可視化データ
     */
    generateScoreVisualization(score) {
        return {
            percentage: score,
            color: this.getScoreColor(score),
            width: `${score}%`,
            label: this.categorizeScore(score).message
        };
    }

    /**
     * スコア色取得
     * @param {number} score - スコア値
     * @returns {string} CSS色値
     */
    getScoreColor(score) {
        if (score >= 80) return '#10b981'; // green
        if (score >= 60) return '#3b82f6'; // blue
        if (score >= 40) return '#f59e0b'; // orange
        return '#ef4444'; // red
    }

    /**
     * OS相互作用分析
     * @param {Object} engineOS - Engine OS データ
     * @param {Object} interfaceOS - Interface OS データ
     * @param {Object} safeModeOS - SafeMode OS データ
     * @returns {Object} 相互作用分析結果
     */
    analyzeOSInteractions(engineOS, interfaceOS, safeModeOS) {
        return {
            engineInterface: `${engineOS.hexagramName}と${interfaceOS.hexagramName}の組み合わせにより、創造性と社交性のバランスが生まれます`,
            engineSafeMode: `${engineOS.hexagramName}と${safeModeOS.hexagramName}により、革新性と安定性の調和が取れています`,
            interfaceSafeMode: `${interfaceOS.hexagramName}と${safeModeOS.hexagramName}により、適応力と安定感が両立しています`
        };
    }

    /**
     * フォールバック4行要約
     */
    getFallbackFourLineSummary(analysisData) {
        return {
            line1: 'あなたの内なる原動力は創造的なエネルギーに満ちています',
            line2: '社会との関わりではバランスの取れた適応力を発揮します',
            line3: 'ストレス状況では冷静に対処する能力があります',
            line4: '総合的に見て、バランスの取れた成熟した人格特性を持っています'
        };
    }

    /**
     * フォールバック詳細サマリー
     */
    getFallbackDetailedSummary(analysisData) {
        return {
            overview: '分析データの読み込みに問題がありましたが、基本的な特性は確認できています',
            engineAnalysis: '内なる原動力：創造的で前向きなエネルギーを持つ',
            interfaceAnalysis: '社会適応力：バランスの取れたコミュニケーション能力',
            safeModeAnalysis: 'ストレス耐性：適度な安定性と柔軟性を併せ持つ',
            interactions: '各要素が調和的に働き、総合的なバランスを保っている',
            recommendations: '現在の状態を維持しつつ、新しい挑戦も取り入れましょう',
            strengths: 'バランスの取れた人格構造',
            growthAreas: 'より詳細な分析のためにデータの再取得をお勧めします',
            actionItems: '継続的な自己観察と成長意識の維持',
            conclusion: '全体的に健康的で安定した人格特性を示しています'
        };
    }

    // 以下、詳細サマリー生成用のヘルパーメソッド群
    generateOverview(engineOS, interfaceOS, safeModeOS) {
        return `あなたの人格は${engineOS.hexagramName}、${interfaceOS.hexagramName}、${safeModeOS.hexagramName}の3つの要素により構成されています`;
    }

    generateEngineAnalysis(engineV3, score) {
        if (!engineV3) return `内なる原動力スコア ${score}pts - 分析中`;
        return `${engineV3.profile?.type || '創造型'}として${score}ptsのエネルギーを持つ`;
    }

    generateInterfaceAnalysis(interfaceV3, score) {
        if (!interfaceV3) return `社会適応力スコア ${score}pts - 分析中`;
        return `${interfaceV3.profile?.type || '調和型'}として${score}ptsの社交性を発揮`;
    }

    generateSafeModeAnalysis(safeModeV3, score) {
        if (!safeModeV3) return `ストレス耐性スコア ${score}pts - 分析中`;
        return `${safeModeV3.profile?.type || '安定型'}として${score}ptsの安定感を保持`;
    }

    generateRecommendations(engineV3, interfaceV3, safeModeV3) {
        const recommendations = [];
        if (engineV3?.maintenance?.tip) recommendations.push(engineV3.maintenance.tip);
        if (interfaceV3?.relationshipTips?.advice) recommendations.push(interfaceV3.relationshipTips.advice);
        if (safeModeV3?.howToRecover?.bestWay) recommendations.push(safeModeV3.howToRecover.bestWay);
        return recommendations.length > 0 ? recommendations.join('、') : '現状維持と継続的成長';
    }

    extractStrengths(engineV3, interfaceV3, safeModeV3) {
        return '創造性、協調性、安定性のバランスが取れている';
    }

    identifyGrowthAreas(engineOS, interfaceOS, safeModeOS) {
        const scores = [engineOS.score, interfaceOS.score, safeModeOS.score];
        const minScore = Math.min(...scores);
        if (minScore < 50) {
            return 'より低いスコアの領域での能力向上';
        }
        return '全体的なバランス向上と専門性の深化';
    }

    generateActionItems(engineV3, interfaceV3, safeModeV3) {
        return '定期的な自己振り返りと新しい挑戦への取り組み';
    }

    generateConclusion(analysisData) {
        return 'Triple OS分析により、あなたの多面的な人格特性が明らかになりました';
    }

    /**
     * 九宮構成による人格深層分析を生成
     * @param {Object} analysisData - Triple OS分析データ
     * @returns {Object} 九宮分析オブジェクト
     */
    generateNinePhaseAnalysis(analysisData) {
    try {
        const { engineOS, interfaceOS, safeModeOS } = analysisData;
        
        // V3データから詳細情報を取得
        const engineV3 = this.getV3DataForOS(engineOS.hexagramName, 'engineOS');
        const interfaceV3 = this.getV3DataForOS(interfaceOS.hexagramName, 'interfaceOS');
        const safeModeV3 = this.getV3DataForOS(safeModeOS.hexagramName, 'safeModeOS');
        
        return {
            // Engine OS 列（内なる原動力）- WHY/HOW/WHERE
            engineDrive: {
                title: '動機の源泉「なぜ」',
                subtitle: 'あなたを突き動かす根本的な理由',
                content: {
                    main: engineV3?.profile?.description || '創造的エネルギーと前進力',
                    metaphor: engineV3?.profile?.metaphor,
                    normal: engineV3?.normalState?.whatHappens,
                    example: engineV3?.normalState?.example,
                    energyLevel: engineV3?.normalState?.energyLevel,
                    coreValue: engineV3?.deepInsight?.coreValue || this.generateCoreValue(engineV3),
                    lifeMission: engineV3?.deepInsight?.lifeMission,
                    morning: engineV3?.dailyPatterns?.morning,
                    topStrength: engineV3?.strengthWeakness?.topStrength
                },
                score: engineOS.score,
                type: 'engine'
            },
            engineCreativity: {
                title: 'エネルギーパターン「どのように」',
                subtitle: '力の使い方と発揮の仕方',
                content: {
                    main: engineV3?.superMode?.whatHappens || '独自のアイデアと革新性',
                    when: engineV3?.superMode?.when,
                    example: engineV3?.superMode?.example,
                    energyLevel: engineV3?.superMode?.energyLevel,
                    restMode: engineV3?.restMode?.whatHappens,
                    howToRest: engineV3?.restMode?.howToRest,
                    decision: engineV3?.dailyPatterns?.decision,
                    problemSolving: engineV3?.dailyPatterns?.problemSolving,
                    hiddenTalent: engineV3?.strengthWeakness?.hiddenTalent
                },
                score: engineOS.score,
                type: 'engine'
            },
            enginePropulsion: {
                title: '成長の方向性「どこへ」',
                subtitle: 'あなたが目指す理想の姿',
                content: {
                    main: engineV3?.maintenance?.whatYouNeed || '目標達成への持続力',
                    howToCharge: engineV3?.maintenance?.howToCharge,
                    warning: engineV3?.maintenance?.warning,
                    tip: engineV3?.maintenance?.tip,
                    idealBalance: engineV3?.osBalance?.idealBalance,
                    whenBalanced: engineV3?.osBalance?.whenBalanced,
                    innerConflict: engineV3?.deepInsight?.innerConflict,
                    growthPath: engineV3?.deepInsight?.growthPath,
                    creativity: engineV3?.dailyPatterns?.creativity,
                    blindSpot: engineV3?.strengthWeakness?.blindSpot,
                    improvement: engineV3?.strengthWeakness?.improvement
                },
                score: engineOS.score,
                type: 'engine'
            },
            
            // Interface OS 列（社会適応力）- HOW/WHERE/WHO
            interfaceAdaptation: {
                title: 'コミュニケーション特性「どう伝える」',
                subtitle: '他者との関わり方の基本スタイル',
                content: {
                    main: interfaceV3?.howToTalk?.style || 'バランスの取れた対人関係',
                    metaphor: interfaceV3?.profile?.metaphor,
                    example: interfaceV3?.howToTalk?.example,
                    goodAt: interfaceV3?.howToTalk?.goodAt,
                    notGoodAt: interfaceV3?.howToTalk?.notGoodAt,
                    profile: interfaceV3?.profile?.description,
                    socialMission: interfaceV3?.deepInsight?.socialMission,
                    firstImpression: interfaceV3?.communicationPatterns?.firstImpression,
                    presentation: interfaceV3?.communicationPatterns?.presentation
                },
                score: interfaceOS.score,
                type: 'interface'
            },
            interfaceCommunication: {
                title: '環境適応性「どこで輝く」',
                subtitle: 'あなたの力が最大化される場所',
                content: {
                    main: interfaceV3?.bestEnvironment?.where || '効果的な意思疎通能力',
                    example: interfaceV3?.bestEnvironment?.example,
                    withWho: interfaceV3?.bestEnvironment?.withWho,
                    avoid: interfaceV3?.bestEnvironment?.avoid,
                    strength: interfaceV3?.relationshipTips?.strength,
                    relationshipPattern: interfaceV3?.deepInsight?.relationshipPattern,
                    listening: interfaceV3?.communicationPatterns?.listening
                },
                score: interfaceOS.score,
                type: 'interface'
            },
            interfaceHarmony: {
                title: '関係性パターン「誰とどう」',
                subtitle: '人間関係の築き方と深め方',
                content: {
                    main: interfaceV3?.relationshipTips?.advice || '環境との調和を重視',
                    strength: interfaceV3?.relationshipTips?.strength,
                    weakness: interfaceV3?.relationshipTips?.weakness,
                    withWho: interfaceV3?.bestEnvironment?.withWho,
                    profile: interfaceV3?.profile?.description,
                    connectionPath: interfaceV3?.deepInsight?.connectionPath,
                    conflict: interfaceV3?.communicationPatterns?.conflict,
                    coreValue: interfaceV3?.deepInsight?.coreValue
                },
                score: interfaceOS.score,
                type: 'interface'
            },
            
            // SafeMode OS 列（ストレス耐性）- HOW/WHAT/WHEN
            safeModeStability: {
                title: '防御メカニズム「どう守る」',
                subtitle: 'ストレス時の自己防衛パターン',
                content: {
                    main: safeModeV3?.stressResponse?.whatYouDo || '困難な状況での冷静さ',
                    metaphor: safeModeV3?.profile?.metaphor,
                    example: safeModeV3?.stressResponse?.example,
                    goodPoint: safeModeV3?.stressResponse?.goodPoint,
                    badPoint: safeModeV3?.stressResponse?.badPoint,
                    profile: safeModeV3?.profile?.description,
                    defenseMechanism: safeModeV3?.deepInsight?.defenseMechanism,
                    earlySign: safeModeV3?.stressPatterns?.earlySign,
                    peakStress: safeModeV3?.stressPatterns?.peakStress
                },
                score: safeModeOS.score,
                type: 'safemode'
            },
            safeModeResilience: {
                title: '回復プロセス「どう立ち直る」',
                subtitle: '困難からの復活メカニズム',
                content: {
                    main: safeModeV3?.emergencyMode?.whatHappens || 'ストレスからの立ち直り力',
                    example: safeModeV3?.emergencyMode?.example,
                    recovery: safeModeV3?.emergencyMode?.recovery,
                    timeToRecover: safeModeV3?.emergencyMode?.timeToRecover,
                    bestWay: safeModeV3?.howToRecover?.bestWay,
                    environment: safeModeV3?.howToRecover?.environment,
                    vulnerablePoint: safeModeV3?.deepInsight?.vulnerablePoint,
                    breakingPoint: safeModeV3?.stressPatterns?.breakingPoint,
                    preventiveMeasure: safeModeV3?.stressPatterns?.preventiveMeasure
                },
                score: safeModeOS.score,
                type: 'safemode'
            },
            safeModeBalance: {
                title: '成長機会「何を学ぶ」',
                subtitle: '困難を糧に変える力',
                content: {
                    main: safeModeV3?.howToRecover?.support || '心身の調和を保つ能力',
                    example: safeModeV3?.howToRecover?.example,
                    environment: safeModeV3?.howToRecover?.environment,
                    support: safeModeV3?.howToRecover?.support,
                    whenImbalanced: safeModeV3?.osBalance?.whenImbalanced,
                    tip: safeModeV3?.osBalance?.tip,
                    healingPath: safeModeV3?.deepInsight?.healingPath,
                    coreValue: safeModeV3?.deepInsight?.coreValue
                },
                score: safeModeOS.score,
                type: 'safemode'
            }
        };
    } catch (error) {
        console.error('❌ 九宮分析生成エラー:', error);
        return this.getFallbackNinePhaseAnalysis();
    }
    }

    /**
     * コアバリューの生成
     * @param {Object} v3Data - V3データ
     * @returns {string} コアバリュー文字列
     */
    generateCoreValue(v3Data) {
        if (!v3Data) return null;
        
        // profileとmaintenanceから核となる価値を抽出
        const type = v3Data?.profile?.type || '';
        const need = v3Data?.maintenance?.whatYouNeed || '';
        
        // タイプに基づいてコアバリューを生成
        if (type.includes('革新') || type.includes('創造')) {
            return '新しさと変革 - 常に進化し続けることが生きがい';
        } else if (type.includes('育成') || type.includes('支援')) {
            return '成長と貢献 - 他者の可能性を開花させることが喜び';
        } else if (type.includes('調和') || type.includes('安定')) {
            return 'バランスと平和 - 調和のとれた環境を創ることが使命';
        } else if (type.includes('分析') || type.includes('論理')) {
            return '真理と理解 - 物事の本質を解明することが目的';
        } else if (type.includes('実行') || type.includes('達成')) {
            return '成果と実現 - 目標を形にすることが原動力';
        }
        
        return need; // フォールバック
    }

    /**
     * フォールバック九宮分析
     */
    getFallbackNinePhaseAnalysis() {
        return {
            engineDrive: { title: '原動力の源泉', content: '創造的で前向きなエネルギー', type: 'engine' },
            engineCreativity: { title: '創造性の発現', content: '独自のアイデアと革新性', type: 'engine' },
            enginePropulsion: { title: '推進力の特徴', content: '目標達成への持続力', type: 'engine' },
            interfaceAdaptation: { title: '社会適応性', content: 'バランスの取れた対人関係', type: 'interface' },
            interfaceCommunication: { title: 'コミュニケーション', content: '効果的な意思疎通能力', type: 'interface' },
            interfaceHarmony: { title: '調和の維持', content: '環境との調和を重視', type: 'interface' },
            safeModeStability: { title: '安定性の基盤', content: '困難な状況での冷静さ', type: 'safemode' },
            safeModeResilience: { title: '回復力', content: 'ストレスからの立ち直り力', type: 'safemode' },
            safeModeBalance: { title: 'バランス感覚', content: '心身の調和を保つ能力', type: 'safemode' }
        };
    }
}

// グローバル公開
if (typeof window !== 'undefined') {
    window.SummaryGenerator = SummaryGenerator;
}