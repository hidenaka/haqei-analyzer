// ShadowAnalyzer.js - シャドウ分析エンジン
// Phase 4: 批判的・生産的視点対応システム

/**
 * シャドウ分析エンジン
 * 診断結果の「強み」の裏に隠れた「影」の部分を照らし出し、
 * 真の成長支援を行うためのクラス
 */
class ShadowAnalyzer {
    constructor() {
        this.shadowMappings = this._initializeShadowMappings();
        this.universalShadowPatterns = this._initializeUniversalPatterns();
        this.hexagramDetailsFallback = null; // HexagramDetailsFallback instance
        
        // Initialize hexagram details fallback if available
        this._initializeHexagramDetailsFallback();
        
        console.log("🌑 [ShadowAnalyzer] シャドウ分析エンジン初期化完了");
    }

    /**
     * 64卦全てのシャドウマッピングを初期化
     */
    _initializeShadowMappings() {
        return {
            // 乾為天系（創造・リーダーシップ）
            "乾為天": {
                強みの影: "創造性・リーダーシップ → 独断専行・他者軽視",
                盲点質問: "自分のアイデアを押し通すあまり、他者の意見を軽視していませんか？",
                成長課題: "協調性と謙虚さの獲得",
                具体例: "「自分が正しい」という確信で、チームの意見を聞かずに進めた経験はありませんか？",
                行動的影: "完璧主義による燃え尽き、周囲への過度な期待"
            },

            // 兌為沢系（調和・コミュニケーション）
            "兌為沢": {
                強みの影: "調和性・社交性 → 八方美人・本音隠蔽",
                盲点質問: "みんなに好かれようとするあまり、自分の本当の気持ちを抑え込んでいませんか？",
                成長課題: "自己主張と境界線の確立",
                具体例: "対立を避けるために、重要な意見を言えずに後悔した経験はありませんか？",
                行動的影: "ストレスの内面化、意思決定の先延ばし"
            },

            // 離為火系（表現・情熱）
            "離為火": {
                強みの影: "表現力・情熱 → 注目欲求・感情的暴走",
                盲点質問: "注目を浴びたいがために、本質的でない行動を取っていませんか？",
                成長課題: "冷静な判断力と持続性の確保",
                具体例: "感情が高ぶった時に、後で後悔するような発言や行動をしたことはありませんか？",
                行動的影: "継続力の不足、批判への過敏反応"
            },

            // 震為雷系（行動・変化）
            "震為雷": {
                強みの影: "行動力・変化対応 → 衝動性・継続性不足",
                盲点質問: "新しいことに飛び込むのは良いですが、途中で投げ出していませんか？",
                成長課題: "計画性と持続力の強化",
                具体例: "勢いで始めたものの、継続できずに中途半端に終わった経験はありませんか？",
                行動的影: "リスク計算の甘さ、他者の迷惑への無関心"
            },

            // 巽為風系（適応・柔軟性）
            "巽為風": {
                強みの影: "適応性・柔軟性 → 主体性不足・優柔不断",
                盲点質問: "状況に合わせすぎて、自分の軸を見失っていませんか？",
                成長課題: "核となる価値観の確立",
                具体例: "周りに合わせるあまり、自分が本当に何をしたいのか分からなくなった経験はありませんか？",
                行動的影: "決断力の欠如、責任回避の傾向"
            },

            // 坎為水系（探求・深み）
            "坎为水": {
                強みの影: "探求心・深い思考 → 完璧主義・行動力不足",
                盲点質問: "考えすぎて、実際の行動に移せないことはありませんか？",
                成長課題: "実行力と「とりあえずやってみる」勇気",
                具体例: "完璧な計画ができるまで行動せず、機会を逃した経験はありませんか？",
                行動的影: "分析麻痺、他者への批判的すぎる視点"
            },

            // 艮為山系（安定・慎重）
            "艮为山": {
                強みの影: "安定性・慎重さ → 変化回避・成長停滞",
                盲点質問: "安全を重視するあまり、成長のチャンスを逃していませんか？",
                成長課題: "適度なリスク受容と挑戦意欲",
                具体例: "新しい挑戦を避けて、同じ場所に留まり続けた結果、後悔した経験はありませんか？",
                行動的影: "現状維持バイアス、他者の変化への抵抗"
            },

            // 坤為地系（受容・支援）
            "坤为地": {
                強みの影: "受容性・支援力 → 自己犠牲・境界線欠如",
                盲点質問: "他者を支えるあまり、自分の健康や幸福を犠牲にしていませんか？",
                成長課題: "自己尊重と健全な境界線の設定",
                具体例: "「No」と言えずに、自分のキャパシティを超えて引き受けた経験はありませんか？",
                行動的影: "燃え尽き症候群、resentment（恨み）の蓄積"
            },

            // 複合卦の代表例
            "雷地豫": {
                強みの影: "楽観性・エンターテイメント性 → 現実逃避・責任回避",
                盲点質問: "楽しさを優先するあまり、重要な責任や困難な現実から目を逸らしていませんか？",
                成長課題: "現実と向き合う勇気と責任感の獲得",
                具体例: "問題が起きても「なんとかなる」と楽観視して、適切な対処を怠った経験はありませんか？",
                行動的影: "計画性の欠如、他者の真剣な話への軽視"
            },

            "天澤履": {
                強みの影: "礼節・品格 → 形式主義・本音の抑圧",
                盲点質問: "礼儀正しさを重視するあまり、本当に必要な率直さを失っていませんか？",
                成長課題: "真の誠実さと適切な自己表現",
                具体例: "礼節を重んじて、本音での議論を避け、問題の解決を先延ばしにした経験はありませんか？",
                行動的影: "偽善的印象、創造性の抑制"
            },

            "地山謙": {
                強みの影: "謙虚さ・慎み深さ → 自己価値の過小評価・消極性",
                盲点質問: "謙虚でいることで、自分の価値や能力を適切に評価・活用できていますか？",
                成長課題: "健全な自己評価と適切な自己主張",
                具体例: "謙遜しすぎて、本来受けるべき評価や機会を逃した経験はありませんか？",
                行動的影: "機会損失、他者からの軽視を招く"
            }

            // 注意: 実際の実装では全64卦のマッピングが必要
            // ここでは代表的なものを例示
        };
    }

    /**
     * HexagramDetailsFallbackの初期化
     */
    _initializeHexagramDetailsFallback() {
        try {
            if (window.hexagramDetailsFallback) {
                this.hexagramDetailsFallback = window.hexagramDetailsFallback;
                console.log("✅ [ShadowAnalyzer] HexagramDetailsFallback連携初期化完了");
            } else if (window.HexagramDetailsFallback) {
                this.hexagramDetailsFallback = new window.HexagramDetailsFallback();
                console.log("✅ [ShadowAnalyzer] HexagramDetailsFallback新規作成完了");
            } else {
                console.warn("⚠️ [ShadowAnalyzer] HexagramDetailsFallbackが利用できません - 動的シャドウ分析は制限されます");
            }
        } catch (error) {
            console.error("❌ [ShadowAnalyzer] HexagramDetailsFallback初期化エラー:", error);
        }
    }

    /**
     * 共通的なシャドウパターンを初期化
     */
    _initializeUniversalPatterns() {
        return {
            高スコア共通の影: {
                アイデンティティ固着: "「私は○○だから」という思考の硬直化",
                成長停止: "現状の自分に満足して、変化を拒む傾向",
                他者軽視: "自分の特性を基準に他者を判断する偏見"
            },
            低スコア共通の影: {
                自己否定: "「私には○○がない」という劣等感",
                可能性放棄: "「向いていない」として挑戦を避ける",
                外部依存: "他者や環境に過度に依存する傾向"
            }
        };
    }

    /**
     * メイン分析メソッド: 指定されたOSのシャドウ分析を実行
     * hexagram_details.jsのデータを動的に活用
     */
    analyzeShadow(osData, score) {
        console.log(`🌑 [ShadowAnalyzer] シャドウ分析開始: ${osData.osName} (${score}%)`);

        // hexagram_detailsから詳細データを取得
        const hexagramDetails = this._getHexagramDetails(osData);
        
        const shadowProfile = {
            osName: osData.osName,
            score: score,
            hexagramId: osData.hexagramId || osData.osId,
            shadowAspects: this._getShadowAspects(osData.osName, score, hexagramDetails),
            selfInquiryQuestions: this._generateSelfInquiryQuestions(osData.osName, score, hexagramDetails),
            integrationGuidance: this._generateIntegrationGuidance(osData.osName, score, hexagramDetails),
            growthChallenges: this._identifyGrowthChallenges(osData.osName, score, hexagramDetails),
            // hexagram_detailsから取得した詳細情報を追加
            dynamicInsights: this._extractDynamicInsights(hexagramDetails)
        };

        console.log("✅ [ShadowAnalyzer] シャドウ分析完了", shadowProfile);
        return shadowProfile;
    }

    /**
     * hexagram_detailsから詳細データを取得
     */
    _getHexagramDetails(osData) {
        if (!osData) return null;
        
        try {
            const hexagramId = osData.hexagramId || osData.osId;
            
            // 1. HEXAGRAM_DETAILSから直接取得を試行
            if (window.HEXAGRAM_DETAILS && hexagramId && window.HEXAGRAM_DETAILS[hexagramId]) {
                console.log(`✅ [ShadowAnalyzer] HEXAGRAM_DETAILSから詳細データ取得: 卦${hexagramId}`);
                return window.HEXAGRAM_DETAILS[hexagramId];
            }
            
            // 2. HexagramDetailsFallbackを使用
            if (this.hexagramDetailsFallback && hexagramId) {
                console.log(`🔄 [ShadowAnalyzer] HexagramDetailsFallbackから生成: 卦${hexagramId}`);
                return this.hexagramDetailsFallback.getHexagramDetails(hexagramId);
            }
            
            console.warn(`⚠️ [ShadowAnalyzer] hexagram_details取得失敗: 卦${hexagramId}`);
            return null;
            
        } catch (error) {
            console.error("❌ [ShadowAnalyzer] hexagram_details取得エラー:", error);
            return null;
        }
    }

    /**
     * hexagram_detailsから動的インサイトを抽出
     */
    _extractDynamicInsights(hexagramDetails) {
        if (!hexagramDetails) return null;

        try {
            return {
                // Engine OSからの洞察
                engineInsights: {
                    potentialStrengths: hexagramDetails.engine?.potential_strengths || [],
                    potentialWeaknesses: hexagramDetails.engine?.potential_weaknesses || [],
                    coreDrive: hexagramDetails.engine?.core_drive || null
                },
                // Interface OSからの洞察  
                interfaceInsights: {
                    behavioralPatterns: hexagramDetails.interface?.behavioral_patterns || [],
                    impressionOnOthers: hexagramDetails.interface?.impression_on_others || null,
                    howItAppears: hexagramDetails.interface?.how_it_appears || null
                },
                // Safe Mode OSからの洞察
                safeModeInsights: {
                    triggerSituations: hexagramDetails.safe_mode?.trigger_situations || [],
                    defensivePatterns: hexagramDetails.safe_mode?.defensive_patterns || [],
                    internalState: hexagramDetails.safe_mode?.internal_state || null
                }
            };
        } catch (error) {
            console.error("❌ [ShadowAnalyzer] 動的インサイト抽出エラー:", error);
            return null;
        }
    }

    /**
     * シャドウ側面の抽出（hexagram_details対応）
     */
    _getShadowAspects(osName, score, hexagramDetails = null) {
        const intensity = this._calculateShadowIntensity(score);
        
        // hexagram_detailsから動的にシャドウ情報を生成
        if (hexagramDetails) {
            return this._generateDynamicShadowAspects(osName, score, hexagramDetails, intensity);
        }
        
        // フォールバック: 既存のマッピングを使用
        const shadowData = this.shadowMappings[osName];
        if (!shadowData) {
            return this._generateGenericShadowAspects(osName, score);
        }

        return {
            primary_shadow: shadowData.強みの影,
            behavioral_risks: shadowData.行動的影,
            intensity_level: intensity,
            likelihood: this._calculateShadowLikelihood(score),
            data_source: "fixed_mapping"
        };
    }
    
    /**
     * hexagram_detailsから動的にシャドウ側面を生成
     */
    _generateDynamicShadowAspects(osName, score, hexagramDetails, intensity) {
        try {
            // potential_weaknessesを「強みの影」として活用
            const potentialWeaknesses = hexagramDetails.engine?.potential_weaknesses || [];
            const potentialStrengths = hexagramDetails.engine?.potential_strengths || [];
            
            // trigger_situationsとdefensive_patternsを統合
            const triggerSituations = hexagramDetails.safe_mode?.trigger_situations || [];
            const defensivePatterns = hexagramDetails.safe_mode?.defensive_patterns || [];
            
            // 強みから影を推測
            const strengthBasedShadows = potentialStrengths.map(strength => 
                `${strength} → 過度な依存や極端な表現による弊害`
            );
            
            return {
                primary_shadow: potentialWeaknesses.length > 0 ? 
                    potentialWeaknesses.join(', ') : 
                    strengthBasedShadows.join(', '),
                behavioral_risks: defensivePatterns.join(', ') || "過度な防御反応による関係性の問題",
                trigger_analysis: triggerSituations.join(', ') || "価値観が脅かされた時の反応",
                intensity_level: intensity,
                likelihood: this._calculateShadowLikelihood(score),
                data_source: "dynamic_hexagram_details",
                // 詳細な分析情報
                detailed_analysis: {
                    strength_to_shadow_mapping: this._mapStrengthsToShadows(potentialStrengths),
                    defensive_pattern_analysis: this._analyzeDefensivePatterns(defensivePatterns),
                    trigger_situation_insights: this._analyzeTriggerSituations(triggerSituations)
                }
            };
        } catch (error) {
            console.error("❌ [ShadowAnalyzer] 動的シャドウ側面生成エラー:", error);
            return this._generateGenericShadowAspects(osName, score);
        }
    }

    /**
     * 自己探求質問の生成（hexagram_details対応）
     */
    _generateSelfInquiryQuestions(osName, score, hexagramDetails = null) {
        const shadowData = this.shadowMappings[osName];
        const questions = [];

        if (shadowData) {
            // 特定の卦に対応した質問
            questions.push({
                type: "blind_spot",
                question: shadowData.盲点質問,
                purpose: "盲点への気づき"
            });

            questions.push({
                type: "concrete_example",
                question: shadowData.具体例,
                purpose: "過去の経験の振り返り"
            });
        }

        // スコアに応じた汎用質問
        if (score > 70) {
            questions.push({
                type: "identity_fixation",
                question: `「私は${osName}だから」という考えで、本来なら取るべき行動を避けた経験はありませんか？`,
                purpose: "アイデンティティ固着の検証"
            });

            questions.push({
                type: "growth_stagnation",
                question: `この強みが、逆に新しい成長を妨げている可能性はありませんか？`,
                purpose: "成長停滞の確認"
            });
        }

        // 環境依存性の質問
        questions.push({
            type: "environmental_limits",
            question: `この特性が通用しない、または裏目に出る環境や相手はどのような場合ですか？`,
            purpose: "適用限界の理解"
        });

        return questions;
    }

    /**
     * 統合的ガイダンスの生成
     */
    _generateIntegrationGuidance(osName, score) {
        const shadowData = this.shadowMappings[osName];
        
        return {
            shadow_acceptance: {
                message: "影の部分も「あなたの一部」として受け入れることから始まります",
                approach: "批判ではなく、理解と統合の視点で見つめてください"
            },
            practical_steps: this._generatePracticalSteps(osName, shadowData),
            mindset_shift: {
                from: `「私は${osName}だ」（固定的思考）`,
                to: `「私は${osName}の傾向があり、影の部分も含めて成長できる」（成長的思考）`
            },
            integration_timeline: "すぐに変わる必要はありません。まずは「気づき」から始めてください"
        };
    }

    /**
     * 具体的な実践ステップの生成
     */
    _generatePracticalSteps(osName, shadowData) {
        if (!shadowData) return this._generateGenericPracticalSteps();

        return [
            {
                step: 1,
                action: "観察",
                description: `日常で${shadowData.強みの影}の傾向が出る場面を意識的に観察する`
            },
            {
                step: 2,
                action: "一時停止",
                description: "その傾向が出そうな時に、一度立ち止まって考える習慣をつける"
            },
            {
                step: 3,
                action: "代替選択",
                description: `${shadowData.成長課題}を意識した別の選択肢を検討する`
            },
            {
                step: 4,
                action: "小さな実験",
                description: "リスクの少ない場面で、新しい行動パターンを試してみる"
            },
            {
                step: 5,
                action: "振り返り",
                description: "結果を振り返り、学びを次に活かす"
            }
        ];
    }

    /**
     * 成長課題の特定
     */
    _identifyGrowthChallenges(osName, score) {
        const shadowData = this.shadowMappings[osName];
        
        return {
            primary_challenge: shadowData?.成長課題 || "バランスの取れた自己表現",
            development_areas: this._identifyDevelopmentAreas(osName, score),
            recommended_practices: this._recommendPractices(osName, shadowData),
            support_resources: this._suggestSupportResources(osName)
        };
    }

    /**
     * 開発領域の特定
     */
    _identifyDevelopmentAreas(osName, score) {
        const areas = [];
        
        if (score > 80) {
            areas.push("過度な依存からの脱却");
            areas.push("他の特性の開発");
            areas.push("柔軟性の獲得");
        } else if (score > 60) {
            areas.push("影の部分への気づき");
            areas.push("バランスの調整");
        } else {
            areas.push("強みの適切な活用");
            areas.push("自信の構築");
        }

        return areas;
    }

    /**
     * 推奨プラクティスの提案
     */
    _recommendPractices(osName, shadowData) {
        const practices = [
            "日記による自己観察（週3回、5分間）",
            "信頼できる人からのフィードバック収集（月1回）",
            "意図的な「影の統合」実験（週1回）"
        ];

        if (shadowData?.成長課題) {
            practices.push(`${shadowData.成長課題}に関する書籍・記事の学習`);
        }

        return practices;
    }

    /**
     * サポートリソースの提案
     */
    _suggestSupportResources(osName) {
        return [
            "自己探求関連書籍の読書",
            "メンタリング・コーチングの活用",
            "同じ課題を持つ人々との交流",
            "専門的なカウンセリング（必要に応じて）"
        ];
    }

    /**
     * シャドウの強度計算
     */
    _calculateShadowIntensity(score) {
        if (score > 80) return "高（注意深い観察が必要）";
        if (score > 60) return "中（定期的な確認を推奨）";
        if (score > 40) return "低（意識的な活用で回避可能）";
        return "極低（現在は大きな懸念なし）";
    }

    /**
     * シャドウ発現の可能性計算
     */
    _calculateShadowLikelihood(score) {
        // スコアが高いほど、その特性の影も現れやすい
        const likelihood = Math.min(score * 0.8, 85); // 最大85%
        return `${Math.round(likelihood)}%`;
    }

    /**
     * 汎用シャドウ側面の生成（マッピングにない卦用）
     */
    _generateGenericShadowAspects(osName, score) {
        return {
            primary_shadow: `${osName}の特性の過度な表現や誤用`,
            behavioral_risks: "バランスを欠いた行動パターン",
            intensity_level: this._calculateShadowIntensity(score),
            likelihood: this._calculateShadowLikelihood(score)
        };
    }

    /**
     * 汎用実践ステップの生成
     */
    _generateGenericPracticalSteps() {
        return [
            {
                step: 1,
                action: "自己観察",
                description: "日常の行動パターンを意識的に観察する"
            },
            {
                step: 2,
                action: "フィードバック収集",
                description: "信頼できる人から率直な意見をもらう"
            },
            {
                step: 3,
                action: "バランス調整",
                description: "極端な傾向を和らげる実験をする"
            },
            {
                step: 4,
                action: "継続的改善",
                description: "小さな変化を積み重ねていく"
            }
        ];
    }

    /**
     * 複数OSのシャドウ統合分析
     */
    analyzeIntegratedShadow(engineOS, interfaceOS, safeModeOS) {
        console.log("🌑 [ShadowAnalyzer] 統合シャドウ分析開始");

        const integratedAnalysis = {
            system_conflicts: this._identifySystemConflicts(engineOS, interfaceOS, safeModeOS),
            compound_risks: this._identifyCompoundRisks(engineOS, interfaceOS, safeModeOS),
            integration_opportunities: this._identifyIntegrationOpportunities(engineOS, interfaceOS, safeModeOS),
            holistic_guidance: this._generateHolisticGuidance(engineOS, interfaceOS, safeModeOS)
        };

        return integratedAnalysis;
    }

    /**
     * システム間コンフリクトの特定
     */
    _identifySystemConflicts(engineOS, interfaceOS, safeModeOS) {
        const conflicts = [];

        // 価値観システムと社会的システムの乖離
        if (Math.abs(engineOS.score - interfaceOS.score) > 50) {
            conflicts.push({
                type: "engine_interface_gap",
                description: "本音と建前の大きな乖離が、内的ストレスや疲労を生み出す可能性",
                risk_level: "高"
            });
        }

        // 防御システムの異常発動リスク
        if (safeModeOS.score < 20 && (engineOS.score > 70 || interfaceOS.score > 70)) {
            conflicts.push({
                type: "safemode_insufficiency",
                description: "防御機能の不足により、ストレス時に適切な対処ができない可能性",
                risk_level: "中"
            });
        }

        return conflicts;
    }

    /**
     * 複合リスクの特定
     */
    _identifyCompoundRisks(engineOS, interfaceOS, safeModeOS) {
        // 複数のシャドウが重なった時の複合的リスクを分析
        return [
            "複数の特性が同時に影として現れた時の増幅効果",
            "システム間の矛盾による内的混乱",
            "過度な適応努力による燃え尽き"
        ];
    }

    /**
     * 統合の機会の特定
     */
    _identifyIntegrationOpportunities(engineOS, interfaceOS, safeModeOS) {
        return [
            "各システムの強みを活かした相互補完",
            "影の部分の建設的な統合",
            "状況に応じた適切なシステム選択"
        ];
    }

    /**
     * 全体的なガイダンスの生成
     */
    _generateHolisticGuidance(engineOS, interfaceOS, safeModeOS) {
        return {
            core_message: "完璧な人格などありません。影を含めた全体が「あなた」です",
            integration_approach: "影を排除するのではなく、理解し、統合することで成長します",
            practical_wisdom: "一度に全てを変える必要はありません。小さな気づきから始めてください"
        };
    }

    /**
     * 強み→影のマッピング分析
     */
    _mapStrengthsToShadows(strengths) {
        const mappings = {};
        if (!Array.isArray(strengths)) return mappings;

        strengths.forEach(strength => {
            switch(strength) {
                case '協力的':
                    mappings[strength] = '過度な依存、自己主張の欠如';
                    break;
                case '調和的':
                    mappings[strength] = '対立回避による問題先送り';
                    break;
                case '受容的':
                    mappings[strength] = '境界線の欠如、搾取されやすさ';
                    break;
                case '安定的':
                    mappings[strength] = '変化への過度な抵抗';
                    break;
                case '創造的':
                    mappings[strength] = '現実逃避、実行力不足';
                    break;
                default:
                    mappings[strength] = '過度な発揮による副作用';
            }
        });
        return mappings;
    }

    /**
     * 防御パターンの分析
     */
    _analyzeDefensivePatterns(patterns) {
        if (!Array.isArray(patterns) || patterns.length === 0) {
            return {
                primary_pattern: "回避的行動",
                trigger_context: "価値観が脅かされる状況",
                impact_assessment: "中程度"
            };
        }

        return {
            primary_pattern: patterns[0] || "回避的行動",
            secondary_patterns: patterns.slice(1),
            trigger_context: "コンフリクトや批判的状況",
            impact_assessment: patterns.length > 2 ? "高" : "中程度"
        };
    }

    /**
     * トリガー状況の洞察分析
     */
    _analyzeTriggerSituations(triggers) {
        if (!Array.isArray(triggers) || triggers.length === 0) {
            return {
                high_risk_scenarios: ["価値観の否定", "急激な変化"],
                coping_recommendations: ["事前準備", "サポート体制の構築"],
                early_warning_signs: ["不安感の増大", "回避行動の強化"]
            };
        }

        return {
            high_risk_scenarios: triggers,
            coping_recommendations: [
                "状況認識の向上",
                "代替的対応策の準備",
                "感情調整技術の活用"
            ],
            early_warning_signs: [
                "身体的緊張の増加",
                "思考の硬直化",
                "社会的引きこもり傾向"
            ]
        };
    }
}

// グローバルスコープに登録
if (typeof window !== 'undefined') {
    window.ShadowAnalyzer = ShadowAnalyzer;
    console.log("✅ [ShadowAnalyzer] グローバル登録完了");
} else {
    // Node.js環境での利用
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ShadowAnalyzer;
    }
}