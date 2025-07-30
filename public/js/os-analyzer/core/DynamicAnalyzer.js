/**
 * DynamicAnalyzer.js
 * 動的変化対応システム
 * 
 * Phase 4: 批判的・生産的視点対応システム
 * REQ-009, REQ-010の実装
 */

class DynamicAnalyzer {
    constructor() {
        this.changePatterns = {
            rapid_change: 3,      // 3ヶ月以内：急速な変化
            moderate_change: 6,   // 6ヶ月以内：中程度の変化
            slow_change: 12,      // 12ヶ月以内：緩やかな変化
            stable_period: 24     // 24ヶ月以上：安定期間
        };

        this.iChingPhilosophy = {
            change_principle: "変化こそが自然の法則",
            stability_danger: "不易は停滞の始まり",
            adaptation_wisdom: "時と場に応じて変化する智慧",
            growth_direction: "対立から統合へ、分離から調和へ"
        };

        console.log("🔄 [DynamicAnalyzer] 動的変化対応システム初期化完了");
    }

    /**
     * 時系列分析の生成
     * REQ-009の実装
     */
    generateTimeBasedAnalysis(currentResult, historicalData = [], userContext = {}) {
        console.log("🔄 [DynamicAnalyzer] 時系列分析開始");

        const analysis = {
            current_state: this._analyzeCurrentState(currentResult),
            change_patterns: this._analyzeChangePatterns(historicalData),
            situational_variations: this._analyzeSituationalVariations(currentResult, userContext),
            future_predictions: this._generateFuturePredictions(currentResult, historicalData),
            iching_perspective: this._generateIChingPerspective(currentResult, historicalData),
            changeability_assessment: this._assessChangeability(currentResult),
            temporal_recommendations: this._generateTemporalRecommendations(currentResult, historicalData)
        };

        console.log("✅ [DynamicAnalyzer] 時系列分析完了", analysis);
        return analysis;
    }

    /**
     * 成長トラッキングシステム
     * REQ-010の実装
     */
    trackGrowth(userId, currentResult, previousResults = []) {
        console.log(`🔄 [DynamicAnalyzer] 成長追跡開始: User ${userId}`);

        const tracking = {
            user_id: userId,
            tracking_period: this._calculateTrackingPeriod(previousResults),
            growth_metrics: this._calculateGrowthMetrics(currentResult, previousResults),
            development_patterns: this._identifyDevelopmentPatterns(previousResults),
            milestone_analysis: this._analyzeMilestones(previousResults),
            growth_trajectory: this._predictGrowthTrajectory(previousResults),
            personalized_insights: this._generatePersonalizedInsights(currentResult, previousResults),
            next_assessment_recommendation: this._recommendNextAssessment(previousResults)
        };

        console.log("✅ [DynamicAnalyzer] 成長追跡完了", tracking);
        return tracking;
    }

    /**
     * 現在状態の分析
     */
    _analyzeCurrentState(currentResult) {
        const engineOS = currentResult.engineOS || {};
        const interfaceOS = currentResult.interfaceOS || {};
        const safeModeOS = currentResult.safeModeOS || {};

        return {
            measurement_date: new Date().toISOString().split('T')[0],
            system_balance: this._calculateSystemBalance(engineOS.score, interfaceOS.score, safeModeOS.score),
            dominant_system: this._identifyDominantSystem(engineOS, interfaceOS, safeModeOS),
            integration_level: this._assessIntegrationLevel(engineOS, interfaceOS, safeModeOS),
            current_phase: this._identifyCurrentPhase(currentResult),
            stability_indicators: this._analyzeStabilityIndicators(currentResult),
            change_readiness: this._assessChangeReadiness(currentResult)
        };
    }

    /**
     * 変化パターンの分析
     */
    _analyzeChangePatterns(historicalData) {
        if (!historicalData || historicalData.length < 2) {
            return {
                data_availability: "insufficient",
                message: "変化パターンの分析には最低2回の測定データが必要です",
                recommendation: "3ヶ月後の再診断をお勧めします"
            };
        }

        const patterns = [];
        for (let i = 1; i < historicalData.length; i++) {
            const previous = historicalData[i - 1];
            const current = historicalData[i];
            const timeDiff = this._calculateTimeDifference(previous.date, current.date);
            
            patterns.push({
                period: `${previous.date} → ${current.date}`,
                time_span: `${timeDiff}ヶ月`,
                changes: this._calculateChanges(previous, current),
                change_magnitude: this._calculateChangeMagnitude(previous, current),
                change_direction: this._identifyChangeDirection(previous, current)
            });
        }

        return {
            data_availability: "sufficient",
            total_measurements: historicalData.length,
            tracking_period: this._calculateTrackingPeriod(historicalData),
            change_patterns: patterns,
            overall_trend: this._identifyOverallTrend(patterns),
            change_velocity: this._calculateChangeVelocity(patterns),
            pattern_consistency: this._assessPatternConsistency(patterns)
        };
    }

    /**
     * 状況的変動の分析
     */
    _analyzeSituationalVariations(currentResult, userContext) {
        const variations = {
            life_stage_factors: this._analyzeLifeStageFactors(userContext),
            environmental_factors: this._analyzeEnvironmentalFactors(userContext),
            stress_level_impact: this._analyzeStressImpact(currentResult, userContext),
            relationship_context: this._analyzeRelationshipContext(userContext),
            professional_context: this._analyzeProfessionalContext(userContext),
            seasonal_patterns: this._analyzeSeasonalPatterns(userContext),
            cultural_influences: this._analyzeCulturalInfluences(userContext)
        };

        return {
            variation_factors: variations,
            context_sensitivity: this._assessContextSensitivity(currentResult),
            adaptation_patterns: this._identifyAdaptationPatterns(currentResult, userContext),
            situational_recommendations: this._generateSituationalRecommendations(variations)
        };
    }

    /**
     * 未来予測の生成
     */
    _generateFuturePredictions(currentResult, historicalData) {
        return {
            short_term: {
                timeframe: "3ヶ月以内",
                likely_changes: this._predictShortTermChanges(currentResult, historicalData),
                stability_probability: this._calculateStabilityProbability(currentResult, "short"),
                recommendations: [
                    "現在の傾向を観察し続ける",
                    "小さな変化の兆候に注意を払う",
                    "環境変化への適応準備を行う"
                ]
            },
            medium_term: {
                timeframe: "6-12ヶ月",
                development_possibilities: this._predictMediumTermDevelopment(currentResult, historicalData),
                growth_opportunities: this._identifyGrowthOpportunities(currentResult),
                recommendations: [
                    "意図的な成長に向けた行動計画の策定",
                    "新しい挑戦や学習機会の模索",
                    "定期的な自己評価システムの構築"
                ]
            },
            long_term: {
                timeframe: "1-3年",
                transformation_potential: this._assessTransformationPotential(currentResult, historicalData),
                life_integration: this._predictLifeIntegration(currentResult),
                recommendations: [
                    "長期的な人生ビジョンとの整合性確認",
                    "持続可能な成長戦略の構築",
                    "価値観の進化に対する開放性の維持"
                ]
            },
            uncertainty_factors: [
                "予期しない人生の出来事",
                "社会環境の大きな変化",
                "個人的な価値観の根本的転換",
                "健康状態や精神状態の変化"
            ]
        };
    }

    /**
     * 易経的視点の生成
     */
    _generateIChingPerspective(currentResult, historicalData) {
        const currentHexagram = this._identifyCurrentHexagram(currentResult);
        const changeHexagram = this._identifyChangeHexagram(currentResult, historicalData);

        return {
            philosophical_foundation: {
                core_principle: this.iChingPhilosophy.change_principle,
                wisdom: "易経では、変化しないものは停滞し、やがて衰退すると考えます",
                application: "現在の結果も永続的なものではなく、時と共に変化する一時的な状態です"
            },
            current_hexagram_insight: {
                hexagram: currentHexagram,
                meaning: this._getHexagramMeaning(currentHexagram),
                current_position: "現在のあなたの状態を表す卦",
                guidance: this._getHexagramGuidance(currentHexagram)
            },
            change_dynamics: {
                change_hexagram: changeHexagram,
                transformation_direction: this._getTransformationDirection(currentHexagram, changeHexagram),
                timing_wisdom: "変化には適切な時があります。急がず、しかし機を逃さずに",
                balance_teaching: "陰と陽のバランス、動と静の調和が成長の鍵です"
            },
            practical_wisdom: {
                adaptation_strategy: "環境に応じて柔軟に変化しつつ、核となる価値観は保持する",
                growth_approach: "対立や矛盾を統合の機会として捉える",
                time_perspective: "短期的な変化に一喜一憂せず、長期的な流れを見る",
                acceptance_teaching: "変化を受け入れることが、真の安定につながります"
            }
        };
    }

    /**
     * 変化可能性の評価
     */
    _assessChangeability(currentResult) {
        const engineScore = currentResult.engineOS?.score || 0;
        const interfaceScore = currentResult.interfaceOS?.score || 0;
        const safeModeScore = currentResult.safeModeOS?.score || 0;

        // スコアの極端さは変化の可能性を示唆
        const extremeness = this._calculateExtremeness([engineScore, interfaceScore, safeModeScore]);
        const balance = this._calculateSystemBalance(engineScore, interfaceScore, safeModeScore);

        return {
            overall_changeability: this._calculateOverallChangeability(extremeness, balance),
            system_specific_changeability: {
                engine_os: this._assessSystemChangeability(engineScore, "価値観システム"),
                interface_os: this._assessSystemChangeability(interfaceScore, "社会的システム"),
                safemode_os: this._assessSystemChangeability(safeModeScore, "防御システム")
            },
            change_factors: {
                internal_factors: [
                    "自己認識の深化",
                    "価値観の進化",
                    "学習と経験の蓄積",
                    "内面的成長への意欲"
                ],
                external_factors: [
                    "環境の変化",
                    "人間関係の変化",
                    "社会的役割の変化",
                    "人生段階の移行"
                ]
            },
            change_resistance_factors: [
                "既存パターンへの安定志向",
                "変化への恐怖や不安",
                "社会的期待による制約",
                "過去の成功体験への固着"
            ],
            change_facilitation_strategies: [
                "小さな変化から始める漸進的アプローチ",
                "変化の意味と価値の明確化",
                "サポートシステムの構築",
                "定期的な振り返りと調整"
            ]
        };
    }

    /**
     * 時間的推奨事項の生成
     */
    _generateTemporalRecommendations(currentResult, historicalData) {
        return {
            immediate_actions: {
                timeframe: "今から1週間",
                actions: [
                    "現在の結果を深く理解する時間を取る",
                    "日常行動パターンを意識的に観察する",
                    "変化への開放性について内省する"
                ],
                purpose: "現状認識と変化への準備"
            },
            short_term_planning: {
                timeframe: "1週間から3ヶ月",
                actions: [
                    "具体的な変化目標を1-2個設定する",
                    "変化を支援する環境や関係を整える",
                    "定期的な自己観察システムを構築する"
                ],
                purpose: "変化の基盤づくりと実験的取り組み"
            },
            medium_term_development: {
                timeframe: "3ヶ月から1年",
                actions: [
                    "設定した目標の進捗を定期的に評価する",
                    "必要に応じて戦略や目標を調整する",
                    "新しい挑戦や学習機会を積極的に求める"
                ],
                purpose: "持続的な成長と適応的な調整"
            },
            long_term_vision: {
                timeframe: "1年以上",
                actions: [
                    "人生の大きな方向性と整合性を確認する",
                    "価値観の進化と成長を受け入れる",
                    "他者の成長支援にも関わる"
                ],
                purpose: "統合的な人格発達と社会的貢献"
            },
            reassessment_schedule: {
                next_measurement: "3ヶ月後",
                rationale: "変化の兆候を適切に捉えるため",
                follow_up: "その後は6ヶ月間隔での定期測定を推奨",
                long_term: "年1回の包括的な評価で長期的変化を追跡"
            }
        };
    }

    /**
     * 成長メトリクスの計算
     */
    _calculateGrowthMetrics(currentResult, previousResults) {
        if (!previousResults || previousResults.length === 0) {
            return {
                baseline_establishment: {
                    message: "これが最初の測定です。今後の変化追跡のベースラインとなります",
                    recommendations: [
                        "3ヶ月後の再測定で変化パターンの観察を開始",
                        "現在の状態を詳細に記録・保存",
                        "環境や状況の変化も併せて記録"
                    ]
                }
            };
        }

        const latest = previousResults[previousResults.length - 1];
        const metrics = {
            score_changes: this._calculateScoreChanges(currentResult, latest),
            balance_evolution: this._calculateBalanceEvolution(currentResult, previousResults),
            consistency_trends: this._calculateConsistencyTrends(previousResults),
            growth_velocity: this._calculateGrowthVelocity(previousResults),
            development_direction: this._identifyDevelopmentDirection(currentResult, previousResults)
        };

        return metrics;
    }

    /**
     * 発達パターンの特定
     */
    _identifyDevelopmentPatterns(previousResults) {
        if (previousResults.length < 3) {
            return {
                pattern_analysis: "insufficient_data",
                message: "発達パターンの特定には最低3回の測定が必要です"
            };
        }

        const patterns = {
            linear_development: this._checkLinearDevelopment(previousResults),
            cyclical_patterns: this._identifyCyclicalPatterns(previousResults),
            breakthrough_moments: this._identifyBreakthroughMoments(previousResults),
            plateau_periods: this._identifyPlateauPeriods(previousResults),
            regression_phases: this._identifyRegressionPhases(previousResults)
        };

        return {
            identified_patterns: patterns,
            dominant_pattern: this._identifyDominantPattern(patterns),
            pattern_implications: this._analyzePatternImplications(patterns),
            future_pattern_predictions: this._predictFuturePatterns(patterns)
        };
    }

    /**
     * マイルストーン分析
     */
    _analyzeMilestones(previousResults) {
        const milestones = [];

        for (let i = 1; i < previousResults.length; i++) {
            const previous = previousResults[i - 1];
            const current = previousResults[i];
            const significance = this._calculateMilestoneSignificance(previous, current);

            if (significance.is_milestone) {
                milestones.push({
                    date: current.date,
                    type: significance.type,
                    description: significance.description,
                    impact_level: significance.impact_level,
                    changes: this._describeChanges(previous, current)
                });
            }
        }

        return {
            total_milestones: milestones.length,
            milestones: milestones,
            milestone_frequency: milestones.length > 0 ? this._calculateMilestoneFrequency(milestones, previousResults) : null,
            next_milestone_prediction: this._predictNextMilestone(milestones, previousResults)
        };
    }

    /**
     * 成長軌道の予測
     */
    _predictGrowthTrajectory(previousResults) {
        if (previousResults.length < 2) {
            return {
                prediction_availability: "insufficient_data",
                message: "軌道予測には複数の測定点が必要です"
            };
        }

        return {
            trajectory_type: this._identifyTrajectoryType(previousResults),
            growth_rate: this._calculateGrowthRate(previousResults),
            projected_development: this._projectDevelopment(previousResults),
            confidence_level: this._calculatePredictionConfidence(previousResults),
            factors_affecting_trajectory: [
                "個人的な努力と意識",
                "環境の支援度",
                "人生イベントの影響",
                "健康状態の変化"
            ]
        };
    }

    /**
     * 個人化インサイトの生成
     */
    _generatePersonalizedInsights(currentResult, previousResults) {
        const insights = {
            unique_development_pattern: this._identifyUniquePattern(currentResult, previousResults),
            personal_strengths_evolution: this._analyzeStrengthsEvolution(previousResults),
            challenge_areas_progress: this._analyzeChallengeProgress(previousResults),
            life_integration_level: this._assessLifeIntegration(currentResult, previousResults),
            wisdom_development: this._assessWisdomDevelopment(previousResults)
        };

        return {
            key_insights: insights,
            personalized_recommendations: this._generatePersonalizedRecommendations(insights),
            celebration_points: this._identifyCelebrationPoints(insights),
            areas_for_focus: this._identifyFocusAreas(insights)
        };
    }

    /**
     * 次回評価の推奨
     */
    _recommendNextAssessment(previousResults) {
        const frequency = this._calculateOptimalFrequency(previousResults);
        const timing = this._calculateOptimalTiming(previousResults);

        return {
            recommended_date: timing.next_date,
            recommended_frequency: frequency.frequency,
            rationale: frequency.rationale,
            preparation_suggestions: [
                "測定前に現在の状況と心境を整理",
                "前回からの変化や出来事を振り返り",
                "測定に集中できる環境と時間を確保"
            ],
            context_considerations: [
                "大きな人生の変化がある場合は時期を調整",
                "ストレスの高い時期は避ける",
                "成長への意欲が高い時期を選ぶ"
            ]
        };
    }

    // ヘルパーメソッド群（実装の詳細）
    _calculateSystemBalance(engine, interfaceOS, safemode) {
        const scores = [engine || 0, interfaceOS || 0, safemode || 0];
        const avg = scores.reduce((sum, score) => sum + score, 0) / 3;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / 3;
        return Math.sqrt(variance) < 15 ? "balanced" : "imbalanced";
    }

    _identifyDominantSystem(engineOS, interfaceOS, safeModeOS) {
        const scores = {
            engine: engineOS?.score || 0,
            interface: interfaceOS?.score || 0,
            safemode: safeModeOS?.score || 0
        };
        
        const dominant = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        return {
            system: dominant,
            score: scores[dominant],
            dominance_level: scores[dominant] - Math.max(...Object.values(scores).filter(s => s !== scores[dominant]))
        };
    }

    _calculateTimeDifference(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
        return diffMonths;
    }

    _calculateChangeMagnitude(previous, current) {
        const engineChange = Math.abs((current.engineOS?.score || 0) - (previous.engineOS?.score || 0));
        const interfaceChange = Math.abs((current.interfaceOS?.score || 0) - (previous.interfaceOS?.score || 0));
        const safemodeChange = Math.abs((current.safeModeOS?.score || 0) - (previous.safeModeOS?.score || 0));
        
        const avgChange = (engineChange + interfaceChange + safemodeChange) / 3;
        
        if (avgChange > 20) return "major";
        if (avgChange > 10) return "moderate";
        if (avgChange > 5) return "minor";
        return "minimal";
    }

    _identifyCurrentHexagram(currentResult) {
        // 現在の状態を最も表すヘキサグラムを特定
        const dominant = this._identifyDominantSystem(
            currentResult.engineOS,
            currentResult.interfaceOS,
            currentResult.safeModeOS
        );
        
        return currentResult[`${dominant.system}OS`]?.hexagramId || 1;
    }

    _getHexagramMeaning(hexagramId) {
        // ヘキサグラムの意味を取得（実装では HEXAGRAM_DETAILS から取得）
        if (typeof window !== 'undefined' && window.HEXAGRAM_DETAILS && window.HEXAGRAM_DETAILS[hexagramId]) {
            return window.HEXAGRAM_DETAILS[hexagramId].description || "変化と調和の象徴";
        }
        return "変化と調和の象徴";
    }

    _calculateOverallChangeability(extremeness, balance) {
        let changeability = 0.5; // ベースライン50%
        
        // 極端なスコアは変化の可能性を示唆
        changeability += extremeness * 0.3;
        
        // バランスの取れた状態は安定性を示唆
        if (balance === "balanced") {
            changeability -= 0.2;
        } else {
            changeability += 0.2;
        }
        
        return Math.max(0.1, Math.min(0.9, changeability));
    }
}

// グローバルスコープに登録
if (typeof window !== 'undefined') {
    window.DynamicAnalyzer = DynamicAnalyzer;
    console.log("✅ [DynamicAnalyzer] グローバル登録完了");
} else {
    // Node.js環境での利用
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = DynamicAnalyzer;
    }
}