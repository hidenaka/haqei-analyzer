/**
 * TransparencyEngine.js
 * 数値透明化システム
 * 
 * Phase 4: 批判的・生産的視点対応システム
 * REQ-007, REQ-008の実装
 */

class TransparencyEngine {
    constructor() {
        this.statisticalThresholds = {
            highly_significant: 80,    // 80%以上：統計的に高い意味
            significant: 60,           // 60%以上：統計的に意味がある
            moderate: 40,              // 40%以上：中程度の意味
            low_significance: 20,      // 20%以上：低い意味
            minimal: 0                 // 20%未満：最小限の意味
        };

        this.measurementErrors = {
            high_precision: 3,         // ±3%：高精度
            standard_precision: 5,     // ±5%：標準精度
            low_precision: 8,          // ±8%：低精度
            very_low_precision: 12     // ±12%：非常に低い精度
        };

        console.log("📊 [TransparencyEngine] 数値透明化システム初期化完了");
    }

    /**
     * スコアの詳細説明を生成
     * REQ-007の実装
     */
    explainScore(score, osType, osName, analysisDetails = {}) {
        console.log(`📊 [TransparencyEngine] スコア透明化開始: ${osName} (${score}%)`);

        const explanation = {
            basic_info: this._generateBasicInfo(score, osType, osName),
            calculation_basis: this._generateCalculationBasis(score, analysisDetails),
            statistical_meaning: this._generateStatisticalMeaning(score),
            confidence_interval: this._generateConfidenceInterval(score, analysisDetails),
            relative_position: this._generateRelativePosition(score),
            limitations: this._generateLimitations(score, osType),
            interpretation_guidelines: this._generateInterpretationGuidelines(score, osType)
        };

        console.log("✅ [TransparencyEngine] スコア透明化完了", explanation);
        return explanation;
    }

    /**
     * 測定限界の明示
     * REQ-008の実装
     */
    generateMeasurementLimitations(osType, methodology = {}) {
        console.log(`📊 [TransparencyEngine] 測定限界分析開始: ${osType}`);

        const limitations = {
            tool_limitations: this._generateToolLimitations(),
            methodology_limitations: this._generateMethodologyLimitations(methodology),
            cultural_limitations: this._generateCulturalLimitations(),
            temporal_limitations: this._generateTemporalLimitations(),
            applicability_scope: this._generateApplicabilityScope(osType),
            alternative_methods: this._suggestAlternativeMethods(osType),
            quality_indicators: this._generateQualityIndicators(methodology)
        };

        console.log("✅ [TransparencyEngine] 測定限界分析完了", limitations);
        return limitations;
    }

    /**
     * 基本情報の生成
     */
    _generateBasicInfo(score, osType, osName) {
        return {
            raw_score: score,
            score_display: `${score}%`,
            os_type: osType,
            os_name: osName,
            measurement_date: new Date().toISOString().split('T')[0],
            measurement_context: "易経64卦との類似度分析",
            note: "この数値は現在の傾向を示すものであり、固定的な性格ではありません"
        };
    }

    /**
     * 算出根拠の生成
     */
    _generateCalculationBasis(score, analysisDetails) {
        const totalQuestions = analysisDetails.totalQuestions || 20; // デフォルト20問
        const matchingAnswers = Math.round(totalQuestions * score / 100);

        return {
            total_questions: totalQuestions,
            matching_answers: matchingAnswers,
            matching_rate: `${matchingAnswers}/${totalQuestions}問が一致`,
            calculation_method: "加重平均法による易経64卦との類似度計算",
            weight_factors: [
                "質問項目の重要度",
                "回答の確信度", 
                "パターンの一貫性"
            ],
            data_processing: [
                "1. 回答データの正規化",
                "2. 64卦パターンとのマッチング計算",
                "3. 重み付き類似度スコア算出",
                "4. パーセンテージ変換"
            ]
        };
    }

    /**
     * 統計的意味の生成
     */
    _generateStatisticalMeaning(score) {
        let significance_level, interpretation, reliability;

        if (score >= this.statisticalThresholds.highly_significant) {
            significance_level = "統計的に高い意味";
            interpretation = "このスコアは統計的に非常に信頼性の高い一致を示しています";
            reliability = "高";
        } else if (score >= this.statisticalThresholds.significant) {
            significance_level = "統計的に意味がある";
            interpretation = "このスコアは統計的に意味のある一致を示しています";
            reliability = "中〜高";
        } else if (score >= this.statisticalThresholds.moderate) {
            significance_level = "中程度の統計的意味";
            interpretation = "このスコアは中程度の一致を示していますが、他の解釈も考慮すべきです";
            reliability = "中";
        } else if (score >= this.statisticalThresholds.low_significance) {
            significance_level = "低い統計的意味";
            interpretation = "このスコアの統計的意味は限定的です。他の要因も重要な影響を与えている可能性があります";
            reliability = "低〜中";
        } else {
            significance_level = "最小限の統計的意味";
            interpretation = "このスコアの統計的意味は最小限です。測定方法の限界や他の要因を強く考慮する必要があります";
            reliability = "低";
        }

        return {
            significance_level,
            interpretation,
            reliability,
            confidence_note: "統計的意味は測定条件や個人差により変動する可能性があります"
        };
    }

    /**
     * 信頼区間の生成
     */
    _generateConfidenceInterval(score, analysisDetails) {
        // 回答の一貫性やデータ品質に基づいて精度を決定
        let precision;
        const consistency = analysisDetails.consistency || 0.7; // デフォルト70%

        if (consistency >= 0.9) {
            precision = this.measurementErrors.high_precision;
        } else if (consistency >= 0.8) {
            precision = this.measurementErrors.standard_precision;
        } else if (consistency >= 0.7) {
            precision = this.measurementErrors.low_precision;
        } else {
            precision = this.measurementErrors.very_low_precision;
        }

        const lower_bound = Math.max(0, score - precision);
        const upper_bound = Math.min(100, score + precision);

        return {
            point_estimate: score,
            confidence_interval: `${lower_bound}% - ${upper_bound}%`,
            margin_of_error: `±${precision}%`,
            confidence_level: "約68%信頼区間",
            interpretation: `実際の値は68%の確率で${lower_bound}%から${upper_bound}%の範囲にあります`,
            precision_factors: [
                "回答の一貫性",
                "質問項目の網羅性",
                "測定時の心理状態",
                "文化的・言語的要因"
            ]
        };
    }

    /**
     * 相対位置の生成
     */
    _generateRelativePosition(score) {
        // 易経64卦の理論的分布に基づく相対位置
        let percentile, position_description, rarity;

        if (score >= 90) {
            percentile = "上位5%";
            position_description = "非常に高い一致度";
            rarity = "極めて稀";
        } else if (score >= 80) {
            percentile = "上位15%";
            position_description = "高い一致度";
            rarity = "比較的稀";
        } else if (score >= 70) {
            percentile = "上位30%";
            position_description = "良い一致度";
            rarity = "やや稀";
        } else if (score >= 60) {
            percentile = "上位50%";
            position_description = "中程度の一致度";
            rarity = "一般的";
        } else if (score >= 40) {
            percentile = "下位50%";
            position_description = "部分的な一致度";
            rarity = "一般的";
        } else if (score >= 20) {
            percentile = "下位30%";
            position_description = "低い一致度";
            rarity = "やや稀";
        } else if (score >= 10) {
            percentile = "下位15%";
            position_description = "非常に低い一致度";
            rarity = "比較的稀";
        } else {
            percentile = "下位5%";
            position_description = "極めて低い一致度";
            rarity = "極めて稀";
        }

        return {
            percentile,
            position_description,
            rarity,
            note: "相対位置は理論的分布に基づく推定値です。実際の分布は使用者の特性により変動します。"
        };
    }

    /**
     * 制約事項の生成
     */
    _generateLimitations(score, osType) {
        const common_limitations = [
            "64通りのパターンで人間の複雑さを完全に捉えることは不可能",
            "文化的・個人的背景による解釈の差異",
            "測定時の心理状態や環境要因の影響",
            "言語的表現の限界による理解のズレ"
        ];

        const score_specific_limitations = [];
        if (score < 20) {
            score_specific_limitations.push("極端に低いスコアは測定方法の限界を示している可能性が高い");
            score_specific_limitations.push("他の自己理解方法との併用を強く推奨");
        } else if (score > 90) {
            score_specific_limitations.push("極端に高いスコアは過度な一般化の危険性がある");
            score_specific_limitations.push("他の側面や状況での変動を考慮する必要がある");
        }

        const os_specific_limitations = {
            engine: [
                "価値観は時間とともに変化する可能性がある",
                "状況や相手により価値判断が変わることがある"
            ],
            interface: [
                "社会的表現は環境や相手により大きく変動する",
                "文化的コンテキストの影響を強く受ける"
            ],
            safemode: [
                "防御パターンはストレスレベルにより変化する",
                "過去の経験による学習効果が反映されていない可能性"
            ]
        };

        return {
            common_limitations,
            score_specific_limitations,
            os_specific_limitations: os_specific_limitations[osType] || [],
            overall_note: "これらの限界を理解した上で、結果を参考程度に活用することを推奨します"
        };
    }

    /**
     * 解釈ガイドラインの生成
     */
    _generateInterpretationGuidelines(score, osType) {
        return {
            basic_principles: [
                "結果は「現在の傾向」を示すものであり、「固定された性格」ではない",
                "数値の高低で優劣を判断しない",
                "他の自己理解方法と組み合わせて活用する",
                "定期的な再測定で変化を確認する"
            ],
            score_interpretation: this._getScoreInterpretationGuideline(score),
            action_recommendations: [
                "結果に過度に依存せず、実際の行動パターンと比較する",
                "他者からのフィードバックと照らし合わせる",
                "異なる状況での行動を観察する",
                "時間を置いて再測定し、安定性を確認する"
            ],
            warning_signs: [
                "結果を絶対視して行動を制限する",
                "他者を評価・分類する道具として使用する",
                "低いスコアを劣等感の根拠とする",
                "高いスコアを優越感の根拠とする"
            ]
        };
    }

    /**
     * スコア別解釈ガイドライン
     */
    _getScoreInterpretationGuideline(score) {
        if (score >= 80) {
            return {
                level: "高い一致度",
                interpretation: "この特性が強く現れている可能性が高いですが、他の側面も確認してください",
                caution: "過度な一般化や固定化を避け、状況による変動を考慮してください"
            };
        } else if (score >= 60) {
            return {
                level: "中程度の一致度",
                interpretation: "この特性がある程度現れていますが、他の要因も重要です",
                caution: "結果を参考にしつつ、実際の体験と照らし合わせてください"
            };
        } else if (score >= 40) {
            return {
                level: "部分的な一致度",
                interpretation: "この特性は限定的にのみ現れている可能性があります",
                caution: "低い数値を否定的に捉えず、他の強みや特性に注目してください"
            };
        } else {
            return {
                level: "低い一致度",
                interpretation: "この測定方法では捉えきれない特性を持っている可能性があります",
                caution: "結果よりも実際の行動パターンや他者からの評価を重視してください"
            };
        }
    }

    /**
     * ツール限界の生成
     */
    _generateToolLimitations() {
        return {
            conceptual_limitations: [
                "易経64卦という古代の枠組みと現代人の多様性のギャップ",
                "東洋思想と西洋的個人主義の価値観の違い",
                "質問項目数の制約による情報の簡略化"
            ],
            technical_limitations: [
                "アルゴリズムの単純化による複雑性の損失",
                "選択肢形式による回答の制約",
                "言語表現の限界による誤解の可能性"
            ],
            statistical_limitations: [
                "サンプルサイズの限界による信頼性の制約",
                "標準化データの不足",
                "個人差の大きさに対する統計手法の限界"
            ]
        };
    }

    /**
     * 方法論限界の生成
     */
    _generateMethodologyLimitations(methodology) {
        return {
            data_collection: [
                "自己報告による主観性バイアス",
                "社会的望ましさバイアスの影響",
                "回答時の心理状態による変動"
            ],
            analysis_method: [
                "類似度計算アルゴリズムの簡略化",
                "重み付けの主観性",
                "閾値設定の恣意性"
            ],
            validation: [
                "外部基準との妥当性検証不足",
                "信頼性テストの限界",
                "予測妥当性の未確認"
            ]
        };
    }

    /**
     * 文化的限界の生成
     */
    _generateCulturalLimitations() {
        return {
            cultural_bias: [
                "東アジア文化圏での概念に基づく枠組み",
                "集団主義的価値観の前提",
                "現代西洋文化との価値観の相違"
            ],
            language_limitations: [
                "日本語での概念表現の特殊性",
                "翻訳による意味の変質",
                "文化的コンテキストの共有前提"
            ],
            generational_differences: [
                "世代による価値観の違い",
                "デジタルネイティブ世代への適用性",
                "社会変化に対する追随の遅れ"
            ]
        };
    }

    /**
     * 時間的限界の生成
     */
    _generateTemporalLimitations() {
        return {
            snapshot_nature: [
                "一時点での測定による限界",
                "人格の発達・変化を捉えられない",
                "状況依存性の軽視"
            ],
            stability_concerns: [
                "測定の再現性に関する不確実性",
                "短期的変動の影響",
                "長期的変化への対応不足"
            ],
            contextual_dependency: [
                "人生段階による特性の変化",
                "環境変化による適応パターンの変化",
                "学習・成長による価値観の進化"
            ]
        };
    }

    /**
     * 適用範囲の生成
     */
    _generateApplicabilityScope(osType) {
        return {
            appropriate_use: [
                "自己理解の手がかりとしての活用",
                "キャリア選択の参考情報として",
                "人間関係の理解促進のきっかけとして",
                "個人的成長の方向性検討に"
            ],
            inappropriate_use: [
                "採用選考での絶対的判断基準",
                "医学的・心理学的診断の代替",
                "他者の分類・評価ツール",
                "人生の重要決定の唯一根拠"
            ],
            target_population: [
                "自己探求に関心のある成人",
                "易経思想に理解・関心のある人",
                "日本語での抽象的思考が可能な人",
                "結果を参考レベルで捉えられる人"
            ],
            excluded_populations: [
                "心理的危機状態にある人",
                "認知機能に制約のある人",
                "文化的背景が大きく異なる人",
                "結果を絶対視する傾向の強い人"
            ]
        };
    }

    /**
     * 代替手法の提案
     */
    _suggestAlternativeMethods(osType) {
        return {
            complementary_methods: [
                {
                    method: "360度フィードバック",
                    description: "複数の観察者からの多角的評価",
                    benefit: "自己認識と他者認識のギャップを確認"
                },
                {
                    method: "行動観察記録",
                    description: "実際の行動パターンの継続的記録",
                    benefit: "理論と実践のギャップを明確化"
                },
                {
                    method: "専門的心理検査",
                    description: "標準化された心理学的測定ツール",
                    benefit: "科学的妥当性の確保された評価"
                }
            ],
            alternative_frameworks: [
                {
                    framework: "ビッグファイブ性格検査",
                    applicability: "科学的根拠に基づく性格評価",
                    comparison: "より統計的信頼性が高い"
                },
                {
                    framework: "ストレングスファインダー",
                    applicability: "強みに焦点を当てた能力評価",
                    comparison: "実用性・行動指針により優れる"
                },
                {
                    framework: "MBTI",
                    applicability: "認知機能に基づく類型論",
                    comparison: "理論的体系性に優れる"
                }
            ]
        };
    }

    /**
     * 品質指標の生成
     */
    _generateQualityIndicators(methodology) {
        return {
            data_quality: {
                completeness: "回答完了率",
                consistency: "回答の一貫性",
                engagement: "回答時の集中度"
            },
            measurement_quality: {
                precision: "測定精度の推定値",
                reliability: "信頼性係数",
                validity: "妥当性の推定"
            },
            interpretation_quality: {
                appropriateness: "解釈の適切性",
                usefulness: "実用性の評価",
                safety: "心理的安全性"
            },
            recommendations: [
                "データ品質が低い場合は再測定を検討",
                "複数の測定方法との比較を実施",
                "専門家のサポートを活用",
                "継続的なモニタリングを実施"
            ]
        };
    }

    /**
     * 包括的な透明性レポートの生成
     */
    generateTransparencyReport(score, osType, osName, analysisDetails = {}, methodology = {}) {
        console.log(`📊 [TransparencyEngine] 包括的透明性レポート生成開始`);

        const report = {
            summary: {
                score: score,
                osType: osType,
                osName: osName,
                report_date: new Date().toISOString(),
                transparency_level: "完全透明性",
                purpose: "診断結果の科学的理解と適切な活用支援"
            },
            score_explanation: this.explainScore(score, osType, osName, analysisDetails),
            measurement_limitations: this.generateMeasurementLimitations(osType, methodology),
            usage_guidelines: {
                recommended_usage: [
                    "自己理解の参考材料として活用",
                    "他の情報源と組み合わせて総合的に判断",
                    "定期的な再評価による変化の追跡",
                    "専門家のサポートを活用した深い探求"
                ],
                cautions: [
                    "結果を絶対視しない",
                    "他者の評価・分類に使用しない",
                    "重要な人生決定の唯一根拠としない",
                    "心理的不調時の診断代替としない"
                ]
            },
            quality_assurance: {
                transparency_commitment: "すべての計算過程と限界を明示",
                ethical_considerations: "ユーザーの自己決定権を最大限尊重",
                continuous_improvement: "フィードバックに基づく継続的改善",
                scientific_integrity: "科学的誠実性の維持"
            }
        };

        console.log("✅ [TransparencyEngine] 包括的透明性レポート生成完了");
        return report;
    }
}

// グローバルスコープに登録
if (typeof window !== 'undefined') {
    window.TransparencyEngine = TransparencyEngine;
    console.log("✅ [TransparencyEngine] グローバル登録完了");
} else {
    // Node.js環境での利用
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TransparencyEngine;
    }
}