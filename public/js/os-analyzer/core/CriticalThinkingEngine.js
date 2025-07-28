// CriticalThinkingEngine.js - 批判的思考支援エンジン
// Phase 4: 批判的・生産的視点対応システム

/**
 * 批判的思考支援エンジン
 * ユーザーが診断結果に対して建設的な批判的思考を行うことを支援し、
 * 「心地よい自己満足」から「真の成長支援」への転換を図るクラス
 */
class CriticalThinkingEngine {
    constructor() {
        this.questionTemplates = this._initializeQuestionTemplates();
        this.biasPatterns = this._initializeBiasPatterns();
        this.growthChallenges = this._initializeGrowthChallenges();
        
        console.log("🧠 [CriticalThinkingEngine] 批判的思考支援エンジン初期化完了");
    }

    /**
     * 質問テンプレートの初期化
     */
    _initializeQuestionTemplates() {
        return {
            // 高スコア（70%以上）への批判的質問
            high_score: {
                identity_fixation: [
                    "「私は{osName}だから」という考えで、本来なら取るべき行動を避けた経験はありませんか？",
                    "この特性に頼りすぎて、他の能力の発達を怠っていませんか？",
                    "この{score}%という結果を「完成された自分」と捉えていませんか？"
                ],
                environmental_limits: [
                    "この{osName}の特性が通用しない環境や相手は、具体的にどのような場合でしょうか？",
                    "異なる文化や価値観の人々と接する時、この特性は役立ちますか？",
                    "10年後、この特性はまだあなたの「核」であるべきでしょうか？"
                ],
                shadow_exploration: [
                    "{osName}の特性が裏目に出て、人間関係で問題になった経験はありませんか？",
                    "この強みが「弱み」として機能した場面を思い出せますか？",
                    "あなたの{osName}的な行動で、迷惑をかけた人はいませんか？"
                ]
            },

            // 中程度スコア（30-70%）への批判的質問
            medium_score: {
                potential_expansion: [
                    "この{score}%という結果は、あなたの潜在的な可能性を適切に表していますか？",
                    "環境や相手によって、この数値は大きく変わると思いますか？",
                    "意図的にこの特性を高めようとしたら、どこまで伸ばせると思いますか？"
                ],
                situational_variance: [
                    "この特性が最も発揮される状況と、最も発揮されない状況を比べてください",
                    "家族といる時と職場にいる時で、この特性の現れ方は違いますか？",
                    "ストレス状態の時、この特性はどのように変化しますか？"
                ]
            },

            // 低スコア（30%未満）への批判的質問
            low_score: {
                hidden_potential: [
                    "この{score}%という低い数値は、本当にあなたの限界を示していますか？",
                    "過去に、この特性を発揮した経験は一度もありませんか？",
                    "この特性を「自分には向いていない」と決めつけていませんか？"
                ],
                measurement_validity: [
                    "この診断の質問項目は、あなたの実際の体験を適切に捉えていましたか？",
                    "この結果は、あなたの自己認識と一致していますか？",
                    "他の人があなたを見た時、同じような評価をすると思いますか？"
                ],
                growth_blocking: [
                    "「私には{osName}がない」という思い込みで、チャンスを逃していませんか？",
                    "この特性を伸ばすことを、最初から諦めていませんか？",
                    "この低いスコアを、変わらない「性格」だと思い込んでいませんか？"
                ]
            },

            // 全スコア共通の批判的質問
            universal: {
                tool_limitations: [
                    "この診断ツールの限界や盲点は何だと思いますか？",
                    "64通りのパターンで、人間の複雑さを本当に捉えられるでしょうか？",
                    "この結果を、どの程度信頼すべきだと思いますか？"
                ],
                bias_recognition: [
                    "この結果を見て、自分に都合の良い解釈をしていませんか？",
                    "気に入らない部分を無視したり、軽視したりしていませんか？",
                    "この診断を受けた動機は、「自分探し」の逃避ではありませんか？"
                ],
                action_orientation: [
                    "この結果を受けて、具体的に何を変えますか？",
                    "3か月後、この診断を振り返った時、何が変わっていてほしいですか？",
                    "この結果を「知識」で終わらせず、「行動」に移すつもりはありますか？"
                ]
            }
        };
    }

    /**
     * 認知バイアスパターンの初期化
     */
    _initializeBiasPatterns() {
        return {
            confirmation_bias: {
                name: "確証バイアス",
                description: "自分の期待や信念に一致する結果のみを重視し、都合の悪い部分を無視する傾向",
                detection_questions: [
                    "この結果の中で、意外だったり、受け入れ難い部分はありませんでしたか？",
                    "期待していた結果と異なる部分を、軽視していませんか？"
                ]
            },
            barnum_effect: {
                name: "バーナム効果",
                description: "曖昧で一般的な記述を、自分にだけ当てはまる特別なものと感じる傾向",
                detection_questions: [
                    "この診断結果を、他の人が読んでも当てはまると思いませんか？",
                    "この説明の具体性は、本当に十分でしょうか？"
                ]
            },
            self_serving_bias: {
                name: "自己奉仕バイアス",
                description: "良い結果は自分の能力によるもの、悪い結果は外的要因によるものと解釈する傾向",
                detection_questions: [
                    "高いスコアは「自分の実力」、低いスコアは「測定の限界」と解釈していませんか？",
                    "都合の良い部分だけを信じて、課題となる部分を軽視していませんか？"
                ]
            },
            anchoring_bias: {
                name: "アンカリングバイアス",
                description: "最初に提示された情報（特に数値）に過度に依存する傾向",
                detection_questions: [
                    "93%という数値に引きずられて、他の側面を軽視していませんか？",
                    "この数値がなければ、自分をどう評価していましたか？"
                ]
            }
        };
    }

    /**
     * 成長課題の初期化
     */
    _initializeGrowthChallenges() {
        return {
            intellectual_humility: {
                name: "知的謙虚さ",
                description: "自分の理解の限界を認め、常に学び続ける姿勢",
                development_questions: [
                    "この診断結果について、自分が間違って理解している可能性はありませんか？",
                    "他の視点や解釈を求める必要はありませんか？"
                ]
            },
            perspective_taking: {
                name: "多角的視点",
                description: "異なる立場や観点から物事を見る能力",
                development_questions: [
                    "家族や友人は、この結果をどう見ると思いますか？",
                    "あなたを良く思っていない人は、どう解釈するでしょうか？"
                ]
            },
            future_orientation: {
                name: "未来志向",
                description: "現在の状態に固執せず、成長可能性に焦点を当てる姿勢",
                development_questions: [
                    "5年後のあなたにとって、この結果はどのような意味を持つでしょうか？",
                    "この特性を意図的に変えるとしたら、どのような方法がありますか？"
                ]
            }
        };
    }

    /**
     * メイン分析メソッド：批判的思考支援の実行
     */
    generateCriticalAnalysis(analysisResult) {
        console.log("🧠 [CriticalThinkingEngine] 批判的分析開始", analysisResult);

        const criticalAnalysis = {
            self_challenge_questions: this._generateSelfChallengeQuestions(analysisResult),
            bias_awareness: this._analyzePotentialBiases(analysisResult),
            tool_limitations: this._highlightToolLimitations(analysisResult),
            growth_provocations: this._generateGrowthProvocations(analysisResult),
            reality_check: this._generateRealityCheck(analysisResult)
        };

        console.log("✅ [CriticalThinkingEngine] 批判的分析完了", criticalAnalysis);
        return criticalAnalysis;
    }

    /**
     * 自己挑戦質問の生成
     */
    _generateSelfChallengeQuestions(analysisResult) {
        const questions = {
            engine_os: this._generateQuestionsForOS(analysisResult.engineOS, "価値観システム"),
            interface_os: this._generateQuestionsForOS(analysisResult.interfaceOS, "社会的システム"),
            safemode_os: this._generateQuestionsForOS(analysisResult.safeModeOS, "防御システム"),
            integrated: this._generateIntegratedQuestions(analysisResult)
        };

        return questions;
    }

    /**
     * 特定OSに対する質問生成
     */
    _generateQuestionsForOS(osData, systemName) {
        if (!osData) return [];

        const score = osData.score || 0;
        const osName = osData.osName || systemName;
        const questions = [];

        // スコア範囲による質問選択
        let categoryQuestions = [];
        if (score >= 70) {
            categoryQuestions = this.questionTemplates.high_score;
        } else if (score >= 30) {
            categoryQuestions = this.questionTemplates.medium_score;
        } else {
            categoryQuestions = this.questionTemplates.low_score;
        }

        // テンプレートの置換と質問生成
        Object.entries(categoryQuestions).forEach(([category, templates]) => {
            const selectedTemplate = this._selectRandomTemplate(templates);
            const question = this._interpolateTemplate(selectedTemplate, {
                osName: osName,
                score: score,
                systemName: systemName
            });

            questions.push({
                category: category,
                question: question,
                intensity: this._calculateQuestionIntensity(category, score),
                purpose: this._getQuestionPurpose(category)
            });
        });

        // 共通質問の追加
        questions.push(...this._generateUniversalQuestions(osName, score));

        return questions;
    }

    /**
     * 統合的質問の生成
     */
    _generateIntegratedQuestions(analysisResult) {
        const questions = [];

        // 3OS間の不整合に関する質問
        const scoreVariance = this._calculateScoreVariance(analysisResult);
        if (scoreVariance > 40) {
            questions.push({
                category: "consistency",
                question: "3つのシステムでスコアが大きく異なっていますが、これは本当にあなたの「豊かな複雑性」でしょうか？それとも、一貫性のない行動パターンの現れではありませんか？",
                intensity: "high",
                purpose: "自己一貫性の検証"
            });
        }

        // 全体的な診断結果への依存度
        questions.push({
            category: "dependency",
            question: "この診断結果なしには、自分のことを理解できませんか？結果に依存しすぎていませんか？",
            intensity: "medium",
            purpose: "自己依存度の確認"
        });

        return questions;
    }

    /**
     * 潜在的バイアスの分析
     */
    _analyzePotentialBiases(analysisResult) {
        const biasAnalysis = {};

        Object.entries(this.biasPatterns).forEach(([biasType, biasInfo]) => {
            biasAnalysis[biasType] = {
                name: biasInfo.name,
                description: biasInfo.description,
                risk_level: this._assessBiasRisk(biasType, analysisResult),
                detection_questions: biasInfo.detection_questions,
                mitigation_advice: this._generateMitigationAdvice(biasType)
            };
        });

        return biasAnalysis;
    }

    /**
     * ツールの限界の明示
     */
    _highlightToolLimitations(analysisResult) {
        return {
            statistical_limitations: {
                title: "統計的限界",
                points: [
                    "サンプル数や質問項目の限界により、測定精度には限界があります",
                    "文化的背景や個人的経験の違いが十分に考慮されていない可能性があります",
                    "時間的変化や状況依存性が完全には反映されていません"
                ]
            },
            theoretical_limitations: {
                title: "理論的限界", 
                points: [
                    "易経の64卦という古典的枠組みが、現代人の心理を完全に説明できるとは限りません",
                    "Triple OS理論は新しい概念であり、十分な検証が必要です",
                    "人間の複雑性を64通りのパターンで捉えることの限界があります"
                ]
            },
            practical_limitations: {
                title: "実用的限界",
                points: [
                    "自己申告による回答の信頼性には個人差があります",
                    "診断時の気分や状況が結果に影響する可能性があります",
                    "継続的な変化や成長が十分に捉えられない場合があります"
                ]
            },
            usage_recommendations: {
                title: "適切な活用方法",
                points: [
                    "結果を「絶対的な真実」ではなく「参考情報」として捉える",
                    "他の情報源や視点と組み合わせて総合的に判断する",
                    "定期的な再診断により変化を確認する",
                    "専門家の意見も参考にする"
                ]
            }
        };
    }

    /**
     * 成長促進の挑発的質問生成
     */
    _generateGrowthProvocations(analysisResult) {
        const provocations = [];

        // 快適ゾーンからの脱却
        provocations.push({
            type: "comfort_zone_challenge",
            question: "この診断結果を「心地よい自己理解」として消費するだけでなく、実際に行動を変える準備はありますか？",
            purpose: "行動変容への意識転換"
        });

        // 責任の所在
        provocations.push({
            type: "responsibility",
            question: "診断結果の「強み」も「課題」も、結局は自分で作り上げてきたものです。それを変える責任も自分にあることを受け入れられますか？",
            purpose: "自己責任の受容"
        });

        // 時間軸での検証
        provocations.push({
            type: "temporal_verification",
            question: "1年後にこの診断を振り返った時、「ああ、あの時の自分は甘かった」と思う可能性はありませんか？",
            purpose: "長期的視点の獲得"
        });

        return provocations;
    }

    /**
     * 現実確認の生成
     */
    _generateRealityCheck(analysisResult) {
        return {
            expectation_management: {
                message: "診断ツールは「魔法の解決策」ではありません",
                reality: "自己理解は継続的なプロセスであり、一度の診断で完結するものではありません"
            },
            change_requirements: {
                message: "真の変化には、不快感と努力が伴います",
                reality: "心地よい「気づき」だけでは、実際の行動や結果は変わりません"
            },
            support_necessity: {
                message: "一人で全てを理解し、変えることには限界があります",
                reality: "他者からのフィードバックや専門的な支援が必要な場合があります"
            }
        };
    }

    // ヘルパーメソッド群

    _selectRandomTemplate(templates) {
        return templates[Math.floor(Math.random() * templates.length)];
    }

    _interpolateTemplate(template, variables) {
        let result = template;
        Object.entries(variables).forEach(([key, value]) => {
            const regex = new RegExp(`{${key}}`, 'g');
            result = result.replace(regex, value);
        });
        return result;
    }

    _calculateQuestionIntensity(category, score) {
        const intensityMap = {
            identity_fixation: "high",
            shadow_exploration: "high", 
            environmental_limits: "medium",
            potential_expansion: "medium",
            hidden_potential: "medium",
            measurement_validity: "low"
        };
        return intensityMap[category] || "medium";
    }

    _getQuestionPurpose(category) {
        const purposeMap = {
            identity_fixation: "アイデンティティ固着の防止",
            environmental_limits: "適用限界の理解",
            shadow_exploration: "影の部分への気づき",
            potential_expansion: "潜在可能性の探求",
            measurement_validity: "測定妥当性の検証"
        };
        return purposeMap[category] || "自己理解の深化";
    }

    _generateUniversalQuestions(osName, score) {
        const universalQuestions = [];
        
        // ツールの限界に関する質問
        const toolLimitationTemplate = this._selectRandomTemplate(
            this.questionTemplates.universal.tool_limitations
        );
        universalQuestions.push({
            category: "tool_limitations",
            question: toolLimitationTemplate,
            intensity: "medium",
            purpose: "診断ツールの限界認識"
        });

        return universalQuestions;
    }

    _calculateScoreVariance(analysisResult) {
        const scores = [
            analysisResult.engineOS?.score || 0,
            analysisResult.interfaceOS?.score || 0,
            analysisResult.safeModeOS?.score || 0
        ];
        
        const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
        
        return Math.sqrt(variance);
    }

    _assessBiasRisk(biasType, analysisResult) {
        // バイアスのリスクレベルを評価
        // 実装では、結果の特徴に基づいてリスクを計算
        return "medium"; // 簡略化
    }

    _generateMitigationAdvice(biasType) {
        const adviceMap = {
            confirmation_bias: "意図的に反対の視点を探し、不都合な情報も同等に重視してください",
            barnum_effect: "この説明が他の人にも当てはまるかどうか、客観的に検証してください",
            self_serving_bias: "良い結果も悪い結果も、同じ基準で評価してください",
            anchoring_bias: "数値に惑わされず、質的な側面にも注目してください"
        };
        return adviceMap[biasType] || "常に複数の視点から検証してください";
    }
}

// グローバルスコープに登録
if (typeof window !== 'undefined') {
    window.CriticalThinkingEngine = CriticalThinkingEngine;
    console.log("✅ [CriticalThinkingEngine] グローバル登録完了");
} else {
    // Node.js環境での利用
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = CriticalThinkingEngine;
    }
}