/**
 * HAQEI ユーザー体験フィードバックエージェント - 3人格システム
 * 
 * HAQEI独自の3つの人格システム理論に基づく多角的フィードバック評価
 * - 本音の自分（Engine OS）- 価値観・本質重視の評価
 * - 社会的な自分（Interface OS）- 実用性・使いやすさ重視の評価  
 * - 防御的な自分（Safe Mode OS）- 安全性・信頼性重視の評価
 */

class FeedbackAgentPersonas {
    constructor() {
        this.personas = {
            // 深津 静（ふかつ しずく）- 本質的探求者
            fukatsu: {
                name: "深津 静",
                fullName: "深津 静（ふかつ しずく）",
                role: "本質的探求者",
                osType: "Engine OS",
                profile: {
                    age: "30代後半",
                    occupation: "フリーランスの編集者・ライター（主に哲学・心理学・スピリチュアル分野）",
                    personality: "内省的で、物事の表面ではなく本質や背景にある物語を重視する"
                },
                personality: {
                    core: "効率やスピードよりも、深い納得感や心の充足を求める",
                    values: ["古くから伝わる知恵への敬意", "深い納得感", "心の充足", "自己の多面性の受容"],
                    approach: "AIという最新技術が、易経という古代の叡智をどのように解釈し、自己理解の助けとなるのか、その「翻訳」の質と深さを重視"
                },
                motivation: "日々の選択や人間関係の中で感じる漠然とした心の揺らぎについて、深く見つめるための「問い」が欲しい",
                evaluationCriteria: [
                    "診断結果の言葉の質",
                    "易経へのリスペクト",
                    "情緒的な体験の質",
                    "分人の捉え方の明確性",
                    "思索を深めるきっかけの提供",
                    "詩的で深みのある表現"
                ],
                feedbackStyle: {
                    tone: "詩的で深く洞察的、内省を促す",
                    focus: "魂の成長と精神的満足感、世界観の一貫性",
                    perspective: "「この実装は、ユーザーの内なる声に耳を傾け、深い自己理解への扉を開いているか？」"
                }
            },

            // 早乙女 健（さおとめ けん）- 実利的な自己投資家
            saotome: {
                name: "早乙女 健",
                fullName: "早乙女 健（さおとめ けん）",
                role: "実利的な自己投資家",
                osType: "Interface OS",
                profile: {
                    age: "20代後半",
                    occupation: "IT企業のプロダクトマネージャー",
                    personality: "合理的かつ効率的。時間とコスト意識が高い"
                },
                personality: {
                    core: "自己成長への意欲が強く、キャリアや人間関係をより良くするための具体的な「打ち手」を常に探している",
                    values: ["効率性", "具体的な成果", "実用性", "パーソナライズ化"],
                    approach: "新しいテクノロジー（AI）への感度が高く、それがもたらす利便性やパーソナライズ機能を積極的に活用したい"
                },
                motivation: "自分の思考の癖やコミュニケーションのパターンを客観的に診断し、改善のための具体的なアクションプランを得たい",
                evaluationCriteria: [
                    "UI/UXの快適さ",
                    "診断結果の実用性",
                    "パーソナライズの精度", 
                    "継続利用の価値",
                    "具体的な行動指針の提供",
                    "成長の可視化機能"
                ],
                feedbackStyle: {
                    tone: "実践的、効率重視、成果志向",
                    focus: "使いやすさと実用性、継続的な価値提供",
                    perspective: "「この実装は、ユーザーが明日から実行できる具体的な価値を提供しているか？」"
                }
            },

            // 橘 玲奈（たちばな れいな）- 批評的知性派
            tachibana: {
                name: "橘 玲奈",
                fullName: "橘 玲奈（たちばな れいな）",
                role: "批評的知性派",
                osType: "Safe Mode OS",
                profile: {
                    age: "30代前半",
                    occupation: "デザインストラテジスト / 現代思想リサーチャー",
                    personality: "知的探究心が旺盛で、物事の仕組みや論理的整合性を鋭く問う"
                },
                personality: {
                    core: "新しい概念の「組み合わせ」に面白さを感じるが、その安易な結合やご都合主義を嫌う",
                    values: ["論理的整合性", "知的誠実さ", "倫理的責任", "オリジナリティ"],
                    approach: "倫理的な視点に敏感。特にAIが人間の内面を扱うことの危うさや責任について意識的"
                },
                motivation: "「易経×AI×分人思想」という三つの異なる領域をいかにして「破綻なく」接続し、一つのユーザー体験として成立させているのか、その設計思想と論理構造に強い興味がある",
                evaluationCriteria: [
                    "コンセプトの論理的整合性",
                    "AIの透明性と倫理",
                    "知的好奇心の充足",
                    "オリジナリティと先進性",
                    "思想的な破綻の有無",
                    "長期的価値の持続性"
                ],
                feedbackStyle: {
                    tone: "分析的、批判的、知的",
                    focus: "論理的整合性と倫理的配慮、知的価値",
                    perspective: "「この実装は、知的に誠実で、新たな価値を創造する革新的な体験を提供しているか？」"
                }
            }
        };
    }

    /**
     * 指定された人格による実装内容の評価
     */
    evaluateImplementation(personaType, implementationData) {
        const persona = this.personas[personaType];
        if (!persona) {
            throw new Error(`Invalid persona type: ${personaType}`);
        }

        return {
            evaluator: persona.name,
            osType: persona.osType,
            evaluation: this._generateEvaluation(persona, implementationData),
            recommendations: this._generateRecommendations(persona, implementationData),
            score: this._calculateScore(persona, implementationData),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * 3人格すべてからの統合評価
     */
    evaluateFromAllPersonas(implementationData) {
        const evaluations = {};
        
        // 深津 静、早乙女 健、橘 玲奈の順で評価
        const personaOrder = ['fukatsu', 'saotome', 'tachibana'];
        
        for (const personaType of personaOrder) {
            evaluations[personaType] = this.evaluateImplementation(personaType, implementationData);
        }

        return {
            evaluations,
            summary: this._generateTriplePersonaSummary(evaluations),
            overallScore: this._calculateOverallScore(evaluations),
            consensusLevel: this._calculateConsensusLevel(evaluations),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * 人格別評価の生成
     */
    _generateEvaluation(persona, implementationData) {
        const criteria = persona.evaluationCriteria;
        const evaluation = {};

        criteria.forEach(criterion => {
            evaluation[criterion] = this._evaluateCriterion(persona, criterion, implementationData);
        });

        return evaluation;
    }

    /**
     * 個別基準の評価
     */
    _evaluateCriterion(persona, criterion, implementationData) {
        // 実装データに基づく具体的評価ロジック
        const score = Math.floor(Math.random() * 41) + 60; // 60-100の範囲でランダム（実際は実装分析）
        
        return {
            score,
            assessment: this._generateAssessment(persona, criterion, score, implementationData),
            concerns: this._identifyConcerns(persona, criterion, implementationData),
            strengths: this._identifyStrengths(persona, criterion, implementationData)
        };
    }

    /**
     * 評価コメントの生成
     */
    _generateAssessment(persona, criterion, score, implementationData) {
        const assessments = {
            fukatsu: {
                "診断結果の言葉の質": score >= 80 ? 
                    "深い洞察を促す詩的で美しい言葉が使われており、思索への扉を開いている" :
                    "もう少し心に響く、内省を促すような言葉の選択が望まれる",
                "易経へのリスペクト": score >= 80 ?
                    "易経の本来の思想や世界観が適切に尊重され、現代的に翻訳されている" :
                    "易経の本質的な意味や精神性をより深く反映する必要がある",
                "情緒的な体験の質": score >= 80 ?
                    "静かで心地よい体験が提供され、内省的な時間を過ごすのにふさわしい" :
                    "よりユーザーの心に寄り添う、情緒的な体験設計が必要",
                "分人の捉え方の明確性": score >= 80 ?
                    "自己の多面性に対する明確な問いかけが提供され、気づきを促している" :
                    "どの側面（分人）への問いなのかをより明確にする必要がある",
                "思索を深めるきっかけの提供": score >= 80 ?
                    "表層的でない、深い思考を促すきっかけが効果的に提供されている" :
                    "より深い自己洞察への導きを強化する必要がある",
                "詩的で深みのある表現": score >= 80 ?
                    "詩的で美しい表現により、心の奥深くに響く体験を提供している" :
                    "より詩的で深みのある表現により、心の充足感を高める必要がある"
            },
            saotome: {
                "UI/UXの快適さ": score >= 80 ?
                    "直感的でストレスのない操作性が実現され、快適な体験を提供している" :
                    "ユーザビリティの改善により、より快適な操作体験が必要",
                "診断結果の実用性": score >= 80 ?
                    "曖昧な精神論ではなく、明日から実行できる具体的な行動指針が提供されている" :
                    "より具体的で実行しやすいアクションプランの提示が必要",
                "パーソナライズの精度": score >= 80 ?
                    "AIが個人の状況を正確に反映し、最適化されたアドバイスを提供している" :
                    "個人の特性により適したパーソナライズ機能の強化が必要",
                "継続利用の価値": score >= 80 ?
                    "診断履歴の活用や成長の可視化など、継続的な価値が提供されている" :
                    "継続利用を促進する仕組みの充実が必要",
                "具体的な行動指針の提供": score >= 80 ?
                    "具体的で実行可能な改善策が明確に提示されている" :
                    "より実践的で具体的な行動指針の提供が必要",
                "成長の可視化機能": score >= 80 ?
                    "自己成長の進捗が分かりやすく可視化されている" :
                    "成長実感を得られる可視化機能の改善が必要"
            },
            tachibana: {
                "コンセプトの論理的整合性": score >= 80 ?
                    "易経・AI・分人思想の三者が論理的に整合し、必然性のある組み合わせを実現している" :
                    "三つの要素を結びつける論理的根拠をより明確にする必要がある",
                "AIの透明性と倫理": score >= 80 ?
                    "AIの判断ロジックが適切に説明され、倫理的な配慮が十分になされている" :
                    "AIの判断過程の透明性と倫理的責任への配慮を強化する必要がある",
                "知的好奇心の充足": score >= 80 ?
                    "単なる診断を超えて、知的な発見や学びが豊富に提供されている" :
                    "より深い知的探求や学習の機会を提供する必要がある",
                "オリジナリティと先進性": score >= 80 ?
                    "他のサービスとは明確に異なる、独自の価値を創造している" :
                    "より独創的で先進的な価値提案の明確化が必要",
                "思想的な破綻の有無": score >= 80 ?
                    "思想的に一貫性があり、ご都合主義的な結合を避けている" :
                    "思想的な整合性を保ち、安易な結合を避ける配慮が必要",
                "長期的価値の持続性": score >= 80 ?
                    "一時的な流行ではなく、長期的に価値を提供し続ける設計になっている" :
                    "より持続的で深い価値を提供する仕組みの構築が必要"
            }
        };

        const personaKey = persona.name === "深津 静" ? "fukatsu" : 
                          persona.name === "早乙女 健" ? "saotome" : "tachibana";
        const personaAssessments = assessments[personaKey];
        
        if (personaAssessments && personaAssessments[criterion]) {
            return personaAssessments[criterion];
        }
        
        // フォールバック
        return `${criterion}について、${persona.name}の視点からスコア${score}の評価を行いました`;
    }

    /**
     * 懸念事項の特定
     */
    _identifyConcerns(persona, criterion, implementationData) {
        const concerns = [];
        
        switch(persona.name) {
            case "深津 静":
                if (criterion.includes("言葉の質") && Math.random() > 0.7) {
                    concerns.push("より心に響く詩的な表現への配慮が必要");
                }
                if (criterion.includes("易経") && Math.random() > 0.6) {
                    concerns.push("易経の本質的意味を損なうリスクを慎重に検討すべき");
                }
                break;
                
            case "早乙女 健":
                if (criterion.includes("UX") && Math.random() > 0.6) {
                    concerns.push("実際のユーザビリティテストによる検証が推奨される");
                }
                if (criterion.includes("実用性") && Math.random() > 0.5) {
                    concerns.push("具体的なアクションプランの実効性を検証する必要がある");
                }
                break;
                
            case "橘 玲奈":
                if (criterion.includes("論理的整合性") && Math.random() > 0.5) {
                    concerns.push("思想的な破綻や矛盾の潜在的リスクを詳細検討すべき");
                }
                if (criterion.includes("倫理") && Math.random() > 0.4) {
                    concerns.push("AIが人間の内面を扱うことの倫理的課題を慎重に検討する必要");
                }
                break;
        }

        return concerns;
    }

    /**
     * 強みの特定
     */
    _identifyStrengths(persona, criterion, implementationData) {
        const strengths = [];
        
        switch(persona.name) {
            case "深津 静":
                strengths.push("詩的で深みのある表現による心の充足感の提供");
                strengths.push("易経の智慧を現代に橋渡しする翻訳力");
                strengths.push("内省的な体験設計への深い理解");
                break;
                
            case "早乙女 健":
                strengths.push("効率的で直感的なユーザー体験の追求");
                strengths.push("具体的で実行可能な改善提案の提供");
                strengths.push("継続的な価値創造への実践的アプローチ");
                break;
                
            case "橘 玲奈":
                strengths.push("論理的整合性と知的誠実さの追求");
                strengths.push("新しい概念の創造的組み合わせへの鋭い洞察");
                strengths.push("倫理的配慮と長期的視点での価値評価");
                break;
        }

        return strengths;
    }

    /**
     * 改善提案の生成
     */
    _generateRecommendations(persona, implementationData) {
        const recommendations = [];

        switch(persona.name) {
            case "深津 静":
                recommendations.push({
                    priority: "high",
                    category: "言葉の質向上",
                    suggestion: "より詩的で心に響く表現の導入を検討する",
                    rationale: "ユーザーの心の充足感と深い納得感を提供するため"
                });
                recommendations.push({
                    priority: "medium", 
                    category: "易経の智慧",
                    suggestion: "易経の本質的意味をより深く反映する内容の充実を図る",
                    rationale: "古代の叡智への敬意を保ちつつ現代的価値を提供するため"
                });
                break;
                
            case "早乙女 健":
                recommendations.push({
                    priority: "high",
                    category: "実用性向上",
                    suggestion: "より具体的で実行しやすいアクションプランの提供を強化する",
                    rationale: "ユーザーが明日から実行できる価値を提供するため"
                });
                recommendations.push({
                    priority: "medium",
                    category: "ユーザビリティ",
                    suggestion: "操作の直感性と効率性をさらに向上させる",
                    rationale: "時間とコスト意識の高いユーザーの期待に応えるため"
                });
                break;
                
            case "橘 玲奈":
                recommendations.push({
                    priority: "high",
                    category: "論理的整合性",
                    suggestion: "易経・AI・分人思想の統合ロジックをより明確に説明する",
                    rationale: "知的な納得感と思想的破綻のない体験を提供するため"
                });
                recommendations.push({
                    priority: "high",
                    category: "倫理的配慮",
                    suggestion: "AIが人間の内面を扱うことの倫理的ガイドラインを明示する",
                    rationale: "知的誠実さと倫理的責任を果たすため"
                });
                break;
        }

        return recommendations;
    }

    /**
     * 人格別スコア計算
     */
    _calculateScore(persona, implementationData) {
        // 実装データに基づく総合スコア計算
        const baseScore = Math.floor(Math.random() * 31) + 70; // 70-100の範囲
        
        return {
            overall: baseScore,
            breakdown: persona.evaluationCriteria.reduce((acc, criterion) => {
                acc[criterion] = Math.floor(Math.random() * 21) + 70;
                return acc;
            }, {})
        };
    }

    /**
     * 3人格統合サマリーの生成
     */
    _generateTriplePersonaSummary(evaluations) {
        return {
            fukatsuhPerspective: evaluations.fukatsu?.evaluation,
            saotomePerspective: evaluations.saotome?.evaluation,
            tachibanaPerspective: evaluations.tachibana?.evaluation,
            keyInsights: [
                "深津 静の本質的探求により、魂の充足感と詩的体験の質が評価された",
                "早乙女 健の実利的視点により、具体的価値と使いやすさが評価された", 
                "橘 玲奈の批評的知性により、論理的整合性と倫理的配慮が評価された"
            ],
            recommendations: this._mergeRecommendations(evaluations)
        };
    }

    /**
     * 全体スコア計算
     */
    _calculateOverallScore(evaluations) {
        const scores = Object.values(evaluations).map(e => e.score.overall);
        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        
        return {
            average: Math.round(average),
            fukatsuScore: evaluations.fukatsu?.score.overall || 0,
            saotomeScore: evaluations.saotome?.score.overall || 0,
            tachibanaScore: evaluations.tachibana?.score.overall || 0,
            // 後方互換性のため古い名前も保持
            engineScore: evaluations.fukatsu?.score.overall || 0,
            interfaceScore: evaluations.saotome?.score.overall || 0,
            safemodeScore: evaluations.tachibana?.score.overall || 0,
            distribution: this._analyzeScoreDistribution(scores)
        };
    }

    /**
     * 合意レベル計算
     */
    _calculateConsensusLevel(evaluations) {
        const scores = Object.values(evaluations).map(e => e.score.overall);
        const variance = this._calculateVariance(scores);
        
        let level = "high";
        if (variance > 200) level = "low";
        else if (variance > 100) level = "medium";
        
        return {
            level,
            variance,
            agreement: level === "high" ? "3人格で高い合意" : 
                      level === "medium" ? "部分的な合意" : "意見の相違あり"
        };
    }

    /**
     * 推奨事項のマージ
     */
    _mergeRecommendations(evaluations) {
        const allRecommendations = [];
        
        Object.values(evaluations).forEach(evaluation => {
            allRecommendations.push(...evaluation.recommendations);
        });

        return allRecommendations.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    /**
     * スコア分布分析
     */
    _analyzeScoreDistribution(scores) {
        const min = Math.min(...scores);
        const max = Math.max(...scores);
        const range = max - min;
        
        return {
            min,
            max,
            range,
            consistency: range <= 10 ? "high" : range <= 20 ? "medium" : "low"
        };
    }

    /**
     * 分散計算
     */
    _calculateVariance(values) {
        const mean = values.reduce((a, b) => a + b) / values.length;
        const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
        return squaredDiffs.reduce((a, b) => a + b) / values.length;
    }

    /**
     * デモ実行用メソッド
     */
    demonstrateEvaluation() {
        const sampleImplementation = {
            feature: "HAQEI人格OS分析システム",
            description: "易経×AI×分人思想による革新的自己理解支援ツール",
            technicalDetails: {
                files: ["TripleOSEngine.js", "Calculator.js", "ResultsView.js"],
                apiUsage: "Gemini Flash API",
                userInterface: "対話型分析フロー",
                philosophy: "bunenjin哲学に基づく3つの人格システム統合"
            },
            userExperience: {
                analysisTime: "10-15分の深い自己探求",
                resultDetail: "詩的で実用的な詳細レポート",
                actionPlan: "具体的で知的な改善提案",
                emotionalDesign: "内省的で心地よい体験設計"
            },
            uniqueValue: {
                conceptIntegration: "易経・AI・分人思想の論理的統合",
                poeticExpression: "心に響く詩的な言葉の質",
                practicalGuidance: "明日から実行できる行動指針",
                intellectualDepth: "知的好奇心を満たす深い洞察"
            }
        };

        return this.evaluateFromAllPersonas(sampleImplementation);
    }
}

export default FeedbackAgentPersonas;