/**
 * LowScoreAnalyzer.js
 * 低スコア真意探求支援システム
 * 
 * Phase 4: 批判的・生産的視点対応システム
 * REQ-003, REQ-004の実装
 */

class LowScoreAnalyzer {
    constructor() {
        this.thresholds = {
            extremely_low: 5,     // 5%以下：極端に低い
            very_low: 15,         // 15%以下：非常に低い
            low: 30,              // 30%以下：低い
            moderate: 60          // 60%以下：中程度
        };
        
        console.log("🔍 [LowScoreAnalyzer] 低スコア真意探求システム初期化完了");
    }

    /**
     * 低スコアの多面的解釈を生成
     * REQ-003の実装
     */
    analyzeLowScore(score, osType, osName) {
        console.log(`🔍 [LowScoreAnalyzer] 低スコア分析開始: ${osName} (${score}%)`);

        // スコアレベル判定
        const scoreLevel = this._getScoreLevel(score);
        
        if (scoreLevel === 'normal') {
            return null; // 正常範囲のスコアは分析対象外
        }

        const analysis = {
            score: score,
            osType: osType,
            osName: osName,
            scoreLevel: scoreLevel,
            interpretations: this._generateInterpretations(score, osType, scoreLevel),
            selfAnalysisQuestions: this._generateSelfAnalysisQuestions(score, osType, osName),
            validationMethods: this._generateValidationMethods(score, osType),
            nextSteps: this._generateNextSteps(score, osType, scoreLevel)
        };

        console.log("✅ [LowScoreAnalyzer] 低スコア分析完了", analysis);
        return analysis;
    }

    /**
     * 多面的解釈の生成
     */
    _generateInterpretations(score, osType, scoreLevel) {
        const interpretations = {};

        // OS種別による解釈パターン
        const interpretationPatterns = {
            engine: {
                可能性1: {
                    title: "価値観の柔軟性・多様性",
                    interpretation: "固定的な価値観に縛られず、状況に応じて適応できる柔軟な判断力",
                    positive_aspects: [
                        "多角的な視点で物事を判断できる",
                        "環境の変化に柔軟に対応できる",
                        "他者の価値観を理解し受け入れやすい"
                    ],
                    verification: "異なる状況で一貫した判断基準があるかを確認する",
                    question: "相手や状況に応じて、意識的に価値観を使い分けていますか？"
                },
                可能性2: {
                    title: "価値観の模索・探求段階",
                    interpretation: "人生において重要な価値観をまだ見つけている最中の発展途上段階",
                    positive_aspects: [
                        "新しい価値観に対して開放的である",
                        "自己成長の可能性が大きい",
                        "多様な経験から学ぶ意欲がある"
                    ],
                    verification: "価値観に関する関心や探求意欲があるかを確認する",
                    question: "自分にとって本当に大切なものは何か、探求中ですか？"
                },
                可能性3: {
                    title: "測定システムとの不一致",
                    interpretation: "あなたの価値観が易経の64卦フレームワークと単純に合致しない独自性",
                    positive_aspects: [
                        "既存の枠組みにとらわれない独創性",
                        "個性的で唯一無二の価値観を持つ",
                        "多文化的・現代的な価値観を反映"
                    ],
                    verification: "他の価値観診断ツールや第三者評価と比較する",
                    question: "この結果は、あなたの実感や他者からの評価と一致していますか？"
                }
            },
            interface: {
                可能性1: {
                    title: "内向的表現スタイル",
                    interpretation: "派手な自己表現よりも、深い関係性での真摯な表現を重視する特性",
                    positive_aspects: [
                        "深く意味のある関係を築くのが得意",
                        "表面的でない本質的なコミュニケーション",
                        "聞き手としての優れた能力"
                    ],
                    verification: "親しい人との関係性の質を確認する",
                    question: "少数でも深い関係を持つ人がいますか？"
                },
                可能性2: {
                    title: "選択的表現力",
                    interpretation: "相手や場面を選んで、戦略的に自己表現を調整する高度な社交スキル",
                    positive_aspects: [
                        "状況に応じた適切な表現ができる",
                        "エネルギーを無駄遣いしない効率性",
                        "真に重要な場面での表現力は高い"
                    ],
                    verification: "重要な場面での表現力や影響力を確認する",
                    question: "本当に重要な時には、しっかりと自分を表現できますか？"
                },
                可能性3: {
                    title: "表現手段の多様性",
                    interpretation: "言葉や行動以外の方法（作品、行動、存在感等）で自己表現する特性",
                    positive_aspects: [
                        "非言語的な表現力に長けている",
                        "クリエイティブな表現手段を持つ",
                        "存在感や雰囲気で影響を与える"
                    ],
                    verification: "言葉以外の表現方法での影響力を確認する",
                    question: "言葉以外の方法で、自分らしさを表現していますか？"
                }
            },
            safemode: {
                可能性1: {
                    title: "防御システムの多様性",
                    interpretation: "特定の防御パターンに依存せず、状況に応じて多様な対処法を使い分ける能力",
                    positive_aspects: [
                        "困難な状況への適応力が高い",
                        "多様な対処法を使い分けられる",
                        "レジリエンス（回復力）が高い"
                    ],
                    verification: "過去の困難への対処方法の多様性を確認する",
                    question: "困難な時、その時々で異なる対処法を使っていますか？"
                },
                可能性2: {
                    title: "予防的対処能力",
                    interpretation: "問題が起きてから対処するより、事前に問題を避ける先読み能力",
                    positive_aspects: [
                        "問題を未然に防ぐ能力が高い",
                        "リスク管理能力に優れている",
                        "安定した環境を維持する能力"
                    ],
                    verification: "問題予防や環境整備への取り組みを確認する",
                    question: "困難な状況になる前に、問題を避ける工夫をしていますか？"
                },
                可能性3: {
                    title: "支援ネットワーク活用型",
                    interpretation: "一人で防御するより、周囲のサポートを効果的に活用する社会的対処能力",
                    positive_aspects: [
                        "人とのつながりを活かすのが上手",
                        "協力して問題解決する能力",
                        "孤立せずに支援を求められる"
                    ],
                    verification: "困難時の周囲からのサポート状況を確認する",
                    question: "困った時に、適切に人に助けを求めることができますか？"
                }
            }
        };

        const patterns = interpretationPatterns[osType];
        if (patterns) {
            interpretations.可能性1 = patterns.可能性1;
            interpretations.可能性2 = patterns.可能性2;
            interpretations.可能性3 = patterns.可能性3;
        }

        // スコアレベルによる追加解釈
        if (scoreLevel === 'extremely_low') {
            interpretations.特別考慮 = {
                title: "測定環境・心理状態の影響",
                interpretation: "診断時の心理状態や環境要因が結果に影響した可能性",
                positive_aspects: [
                    "本来の能力は数値以上である可能性が高い",
                    "環境が整えば能力を発揮できる",
                    "現在は潜在期・準備期にある"
                ],
                verification: "異なる時期・環境での再診断を試す",
                question: "診断時、体調不良やストレス状態ではありませんでしたか？"
            };
        }

        return interpretations;
    }

    /**
     * 自己分析支援質問の生成
     * REQ-004の実装
     */
    _generateSelfAnalysisQuestions(score, osType, osName) {
        const baseQuestions = [
            {
                category: "self_recognition",
                question: `この${score}%という結果を見て、最初にどのような感情を持ちましたか？`,
                purpose: "結果への感情的反応から自己認識を探る",
                follow_up: "その感情は、あなたの自己イメージと関係がありますか？"
            },
            {
                category: "situational_analysis", 
                question: `${osName}の特性が必要な場面で、あなたはどのように行動しますか？`,
                purpose: "具体的な行動パターンの確認",
                follow_up: "その行動は、結果と一致していますか？"
            },
            {
                category: "alternative_strengths",
                question: `${osName}以外で、あなたが得意だと感じる分野はありますか？`,
                purpose: "他の強みや特性の発見",
                follow_up: "それらの強みは、このテストでは測定されていない可能性があります"
            }
        ];

        // OS種別による追加質問
        const additionalQuestions = {
            engine: [
                {
                    category: "value_exploration",
                    question: "人生で最も大切にしていることは何ですか？それは変化していますか？",
                    purpose: "価値観の現状と変化の確認",
                    follow_up: "その価値観は、易経の64卦には当てはまらない独自のものかもしれません"
                },
                {
                    category: "decision_patterns",
                    question: "重要な決断をする時、何を基準に判断しますか？",
                    purpose: "実際の判断基準の確認",
                    follow_up: "その基準は一貫していますか？それとも状況に応じて変わりますか？"
                }
            ],
            interface: [
                {
                    category: "expression_methods",
                    question: "人に自分のことを理解してもらう時、どのような方法を使いますか？",
                    purpose: "表現方法の多様性確認",
                    follow_up: "言葉以外の表現方法（行動、作品、存在感等）も使っていますか？"
                },
                {
                    category: "relationship_quality",
                    question: "あなたにとって意味のある人間関係はどのようなものですか？",
                    purpose: "関係性の質への価値観確認",
                    follow_up: "数は少なくても、深い関係を築けている人はいますか？"
                }
            ],
            safemode: [
                {
                    category: "stress_response",
                    question: "最近経験した困難な状況で、どのように対処しましたか？",
                    purpose: "実際の対処パターンの確認",
                    follow_up: "その対処法は、過去の経験から学んだものでしたか？"
                },
                {
                    category: "support_systems",
                    question: "困った時に頼れる人や方法はありますか？",
                    purpose: "サポートシステムの確認",
                    follow_up: "一人で抱え込まず、適切に助けを求められていますか？"
                }
            ]
        };

        const questions = [...baseQuestions];
        if (additionalQuestions[osType]) {
            questions.push(...additionalQuestions[osType]);
        }

        return questions;
    }

    /**
     * 検証方法の生成
     */
    _generateValidationMethods(score, osType) {
        const methods = [
            {
                method: "時間を置いた再診断",
                description: "1-2週間後に同じ診断を受けて結果の安定性を確認",
                rationale: "一時的な心理状態や環境要因の影響を排除"
            },
            {
                method: "第三者からの観察",
                description: "信頼できる人にあなたの特性について聞いてみる",
                rationale: "自己認識と他者認識のギャップを確認"
            },
            {
                method: "具体的行動記録",
                description: "1週間、関連する行動や反応を日記に記録",
                rationale: "実際の行動パターンと診断結果の整合性確認"
            }
        ];

        // OS種別による追加検証方法
        const additionalMethods = {
            engine: [
                {
                    method: "価値観の言語化",
                    description: "自分の価値観を文章で説明し、易経64卦と比較",
                    rationale: "価値観の独自性や複雑性を確認"
                }
            ],
            interface: [
                {
                    method: "表現場面の分析",
                    description: "様々な社交場面での自分の行動を観察・記録",
                    rationale: "選択的表現や状況適応性を確認"
                }
            ],  
            safemode: [
                {
                    method: "ストレス対処の振り返り",
                    description: "過去6ヶ月の困難な状況とその対処法をリストアップ",
                    rationale: "対処パターンの多様性や効果性を確認"
                }
            ]
        };

        if (additionalMethods[osType]) {
            methods.push(...additionalMethods[osType]);
        }

        return methods;
    }

    /**
     * 次のステップの生成
     */
    _generateNextSteps(score, osType, scoreLevel) {
        const steps = [];

        // 共通ステップ
        steps.push({
            priority: "immediate",
            action: "結果の受け入れ",
            description: "この結果を批判的に捉えつつ、自己否定はせずに探求の材料として活用する",
            timeframe: "今すぐ"
        });

        steps.push({
            priority: "short_term", 
            action: "多面的な自己観察",
            description: "1-2週間、関連する行動や反応を意識的に観察する",
            timeframe: "1-2週間"
        });

        // スコアレベル別ステップ
        if (scoreLevel === 'extremely_low' || scoreLevel === 'very_low') {
            steps.push({
                priority: "immediate",
                action: "測定条件の確認",
                description: "診断時の心理状態や環境要因が影響した可能性を検討する",
                timeframe: "今すぐ"
            });

            steps.push({
                priority: "short_term",
                action: "再診断の実施",
                description: "異なる時期・環境で再度診断を受けて結果の安定性を確認する",
                timeframe: "1-2週間後"
            });
        }

        // OS種別ステップ
        const osSpecificSteps = {
            engine: [
                {
                    priority: "medium_term",
                    action: "価値観の探求",
                    description: "自分にとって本当に大切なものは何かを深く探求する",
                    timeframe: "1-3ヶ月"
                }
            ],
            interface: [
                {
                    priority: "medium_term", 
                    action: "表現方法の多様化",
                    description: "言葉以外の自己表現方法を意識的に試してみる",
                    timeframe: "1-3ヶ月"
                }
            ],
            safemode: [
                {
                    priority: "medium_term",
                    action: "対処パターンの整理",
                    description: "これまでの困難への対処法を整理し、効果的なパターンを見つける", 
                    timeframe: "1-3ヶ月"
                }
            ]
        };

        if (osSpecificSteps[osType]) {
            steps.push(...osSpecificSteps[osType]);
        }

        // 長期的ステップ
        steps.push({
            priority: "long_term",
            action: "継続的な自己理解",
            description: "定期的に自己分析を行い、変化や成長を記録する",
            timeframe: "3ヶ月以上"
        });

        return steps;
    }

    /**
     * スコアレベルの判定
     */
    _getScoreLevel(score) {
        if (score <= this.thresholds.extremely_low) {
            return 'extremely_low';
        } else if (score <= this.thresholds.very_low) {
            return 'very_low';
        } else if (score <= this.thresholds.low) {
            return 'low';
        } else if (score <= this.thresholds.moderate) {
            return 'moderate';
        } else {
            return 'normal';
        }
    }

    /**
     * インタラクティブな質問フローの生成
     * REQ-004の拡張実装
     */
    generateInteractiveQuestionFlow(analysis) {
        if (!analysis) return null;

        const flow = {
            currentStep: 0,
            totalSteps: 5,
            steps: [
                {
                    id: "initial_reaction",
                    title: "最初の印象",
                    question: analysis.selfAnalysisQuestions.find(q => q.category === "self_recognition")?.question,
                    type: "multiple_choice",
                    options: [
                        { value: "surprise", text: "意外だった" },
                        { value: "expected", text: "予想通りだった" },
                        { value: "disappointed", text: "がっかりした" },
                        { value: "relieved", text: "安心した" },
                        { value: "confused", text: "よくわからない" }
                    ]
                },
                {
                    id: "interpretation_preference",
                    title: "解釈の選択",
                    question: "3つの可能性の中で、最も共感できるものはどれですか？",
                    type: "interpretation_choice",
                    options: Object.keys(analysis.interpretations).map(key => ({
                        value: key,
                        text: analysis.interpretations[key].title,
                        description: analysis.interpretations[key].interpretation
                    }))
                },
                {
                    id: "validation_commitment",
                    title: "検証への取り組み",
                    question: "結果を検証するために、どの方法を試してみたいですか？",
                    type: "multiple_select",
                    options: analysis.validationMethods.map(method => ({
                        value: method.method,
                        text: method.method,
                        description: method.description
                    }))
                },
                {
                    id: "action_planning",
                    title: "行動計画",
                    question: "まず最初に取り組みたいことは何ですか？",
                    type: "priority_ranking",
                    options: analysis.nextSteps.filter(step => step.priority === "immediate" || step.priority === "short_term")
                        .map(step => ({
                            value: step.action,
                            text: step.action,
                            description: step.description
                        }))
                },
                {
                    id: "support_needs",
                    title: "サポートの必要性",
                    question: "この探求を進めるにあたって、どのようなサポートがあると良いですか？",
                    type: "multiple_select",
                    options: [
                        { value: "periodic_check", text: "定期的なチェックイン" },
                        { value: "expert_consultation", text: "専門家との相談" },
                        { value: "peer_discussion", text: "同じような人との交流" },
                        { value: "additional_resources", text: "追加の学習資料" },
                        { value: "none", text: "特に必要ない" }
                    ]
                }
            ]
        };

        return flow;
    }

    /**
     * フローの回答を分析してフィードバックを生成
     */
    analyzeFlowResponses(flowResponses, originalAnalysis) {
        const feedback = {
            insights: [],
            recommendations: [],
            nextActions: []
        };

        // 最初の印象分析
        if (flowResponses.initial_reaction) {
            const reaction = flowResponses.initial_reaction;
            const reactionInsights = {
                surprise: "結果が意外だったということは、自己認識と実際の行動パターンにギャップがある可能性があります。",
                expected: "予想通りだったということは、ある程度の自己理解ができています。",
                disappointed: "がっかりしたということは、その特性を重要視している証拠です。",
                relieved: "安心したということは、その特性への負担感があったのかもしれません。",
                confused: "混乱しているのは自然です。複雑な人格は簡単には測れません。"
            };
            
            if (reactionInsights[reaction]) {
                feedback.insights.push(reactionInsights[reaction]);
            }
        }

        // 解釈選択分析
        if (flowResponses.interpretation_preference) {
            const selectedInterpretation = originalAnalysis.interpretations[flowResponses.interpretation_preference];
            if (selectedInterpretation) {
                feedback.insights.push(`「${selectedInterpretation.title}」の解釈を選んだことで、あなたの自己理解の方向性が見えてきます。`);
                feedback.recommendations.push(`この解釈に基づいて、${selectedInterpretation.verification}を試してみてください。`);
            }
        }

        // 検証方法選択分析
        if (flowResponses.validation_commitment && Array.isArray(flowResponses.validation_commitment)) {
            const methodCount = flowResponses.validation_commitment.length;
            if (methodCount > 0) {
                feedback.insights.push(`${methodCount}つの検証方法を選択したことは、積極的な自己探求の姿勢を示しています。`);
                feedback.nextActions.push("選択した検証方法を1つずつ、順番に実践してみてください。");
            }
        }

        // 行動計画分析
        if (flowResponses.action_planning) {
            feedback.nextActions.push(`「${flowResponses.action_planning}」から始めることで、具体的な変化を実感できるでしょう。`);
        }

        // サポート需要分析
        if (flowResponses.support_needs && Array.isArray(flowResponses.support_needs)) {
            const needsSupport = !flowResponses.support_needs.includes('none');
            if (needsSupport) {
                feedback.recommendations.push("一人で抱え込まず、適切なサポートを活用することで、より効果的な自己探求ができます。");
            } else {
                feedback.recommendations.push("自立的な探求姿勢は素晴らしいですが、行き詰まった時には遠慮なくサポートを求めてください。");
            }
        }

        return feedback;
    }
}

// グローバルスコープに登録
if (typeof window !== 'undefined') {
    window.LowScoreAnalyzer = LowScoreAnalyzer;
    console.log("✅ [LowScoreAnalyzer] グローバル登録完了");
} else {
    // Node.js環境での利用
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = LowScoreAnalyzer;
    }
}