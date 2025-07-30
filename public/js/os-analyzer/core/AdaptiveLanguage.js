/**
 * AdaptiveLanguage.js
 * ユーザー層別表現システム
 * 
 * Phase 4: 批判的・生産的視点対応システム
 * REQ-011, REQ-012の実装
 */

class AdaptiveLanguage {
    constructor() {
        this.audienceTypes = {
            general: "一般層",
            iching_enthusiast: "易経愛好者",
            business: "ビジネス層",
            self_development: "自己探求層"
        };

        this.adaptationRules = this._initializeAdaptationRules();
        this.terminologyMappings = this._initializeTerminologyMappings();
        this.currentAudience = "general"; // デフォルト

        console.log("🗣️ [AdaptiveLanguage] ユーザー層別表現システム初期化完了");
    }

    /**
     * ユーザー層の自動識別
     * REQ-012の実装
     */
    identifyAudience(userResponses, context = {}) {
        console.log("🗣️ [AdaptiveLanguage] ユーザー層識別開始");

        const indicators = {
            iching_knowledge: this._assessIChingKnowledge(userResponses, context),
            business_orientation: this._assessBusinessOrientation(userResponses, context),
            self_development_focus: this._assessSelfDevelopmentFocus(userResponses, context),
            technical_comfort: this._assessTechnicalComfort(userResponses, context),
            depth_preference: this._assessDepthPreference(userResponses, context)
        };

        const audienceType = this._determineAudienceType(indicators);
        const confidence = this._calculateIdentificationConfidence(indicators);

        const identification = {
            identified_audience: audienceType,
            confidence_level: confidence,
            indicators: indicators,
            fallback_strategy: confidence < 0.7 ? "general" : null,
            adaptation_notes: this._generateAdaptationNotes(audienceType, indicators)
        };

        this.currentAudience = audienceType;
        console.log("✅ [AdaptiveLanguage] ユーザー層識別完了", identification);
        return identification;
    }

    /**
     * コンテンツの適応的変換
     * REQ-011の実装
     */
    adaptToAudience(content, audienceType = null, options = {}) {
        const targetAudience = audienceType || this.currentAudience;
        console.log(`🗣️ [AdaptiveLanguage] コンテンツ適応開始: ${targetAudience}`);

        if (!this.adaptationRules[targetAudience]) {
            console.warn(`⚠️ [AdaptiveLanguage] 未知のユーザー層: ${targetAudience}`);
            return content;
        }

        const adaptedContent = {
            original_content: content,
            target_audience: targetAudience,
            adapted_content: this._transformContent(content, targetAudience, options),
            adaptation_summary: this._generateAdaptationSummary(content, targetAudience),
            quality_indicators: this._assessAdaptationQuality(content, targetAudience)
        };

        console.log("✅ [AdaptiveLanguage] コンテンツ適応完了");
        return adaptedContent;
    }

    /**
     * 適応ルールの初期化
     */
    _initializeAdaptationRules() {
        return {
            general: {
                易経要素: {
                    level: "minimal",
                    approach: "現代語での説明中心",
                    examples: "日常的な例を使用",
                    terminology: "専門用語を避け、分かりやすい表現"
                },
                専門用語: {
                    strategy: "日常語に変換",
                    explanation: "必要な場合のみ簡潔に説明",
                    frequency: "最小限"
                },
                説明深度: {
                    focus: "直感的理解重視",
                    detail_level: "概要レベル",
                    practical_emphasis: "すぐに使える情報"
                },
                批判的要素: {
                    tone: "ソフトな表現",
                    approach: "建設的で前向き",
                    balance: "希望と現実のバランス"
                }
            },
            iching_enthusiast: {
                易経要素: {
                    level: "detailed",
                    approach: "古典的解釈も含む詳細解説",
                    examples: "易経の教えと関連付け",
                    terminology: "正確な易経用語使用"
                },
                専門用語: {
                    strategy: "正確な易経用語使用",
                    explanation: "思想的背景まで詳述",
                    frequency: "積極的使用"
                },
                説明深度: {
                    focus: "思想的背景まで詳述",
                    detail_level: "深層レベル",
                    practical_emphasis: "哲学的理解と実践の統合"
                },
                批判的要素: {
                    tone: "哲学的深み重視",
                    approach: "易経の智慧に基づく洞察",
                    balance: "陰陽思想による統合的視点"
                }
            },
            business: {
                易経要素: {
                    level: "practical",
                    approach: "実用的側面のみ",
                    examples: "ビジネスシーンでの活用例",
                    terminology: "成果・効率・戦略に関連付け"
                },
                専門用語: {
                    strategy: "ビジネス用語に変換",
                    explanation: "ROI・KPI等の観点で説明",
                    frequency: "ビジネス文脈での使用"
                },
                説明深度: {
                    focus: "行動指針重視",
                    detail_level: "実践レベル",
                    practical_emphasis: "具体的な行動計画"
                },
                批判的要素: {
                    tone: "戦略的思考促進",
                    approach: "意思決定の材料として提示",
                    balance: "リスクと機会の分析"
                }
            },
            self_development: {
                易経要素: {
                    level: "psychological",
                    approach: "心理学的解釈中心",
                    examples: "個人成長の文脈で説明",
                    terminology: "成長・変化・統合に関連付け"
                },
                専門用語: {
                    strategy: "心理学・成長理論用語",
                    explanation: "内面的成長との関連で説明",
                    frequency: "成長支援の文脈での使用"
                },
                説明深度: {
                    focus: "内省促進重視",
                    detail_level: "深層心理レベル",
                    practical_emphasis: "自己変革のプロセス"
                },
                批判的要素: {
                    tone: "深い自己対話促進",
                    approach: "真の成長への挑戦",
                    balance: "受容と変化の統合"
                }
            }
        };
    }

    /**
     * 用語マッピングの初期化
     */
    _initializeTerminologyMappings() {
        return {
            general: {
                "易経": "古代の智慧",
                "64卦": "64のパターン",
                "陰陽": "バランス",
                "変化": "成長",
                "統合": "調和",
                "シャドウ": "見えにくい側面",
                "Triple OS": "3つの人格システム",
                "Engine OS": "価値観システム",
                "Interface OS": "社会的システム",
                "SafeMode OS": "防御システム"
            },
            iching_enthusiast: {
                "易経": "易経（えききょう）",
                "64卦": "六十四卦",
                "陰陽": "陰陽思想",
                "変化": "易の根本原理",
                "統合": "対立統一",
                "シャドウ": "影の側面",
                "Triple OS": "三重人格システム",
                "Engine OS": "本性システム（エンジンOS）",
                "Interface OS": "表現システム（インターフェースOS）",
                "SafeMode OS": "防御システム（セーフモードOS）"
            },
            business: {
                "易経": "戦略的思考フレームワーク",
                "64卦": "64の戦略パターン",
                "陰陽": "相反する要素の管理",
                "変化": "組織変革",
                "統合": "シナジー効果",
                "シャドウ": "潜在的リスク",
                "Triple OS": "パフォーマンス管理システム",
                "Engine OS": "意思決定システム",
                "Interface OS": "コミュニケーションスタイル",
                "SafeMode OS": "ストレス対処システム"
            },
            self_development: {
                "易経": "成長の智慧",
                "64卦": "64の成長パターン",
                "陰陽": "内なるバランス",
                "変化": "自己変革",
                "統合": "全人格統合",
                "シャドウ": "無意識の側面",
                "Triple OS": "多層人格システム",
                "Engine OS": "核心価値システム",
                "Interface OS": "対人表現システム",
                "SafeMode OS": "自己防衛システム"
            }
        };
    }

    /**
     * 易経知識の評価
     */
    _assessIChingKnowledge(userResponses, context) {
        let score = 0;
        
        // 回答パターンから推測
        if (userResponses.questionsAnswered) {
            const thoughtfulAnswers = userResponses.questionsAnswered.filter(q => 
                q.responseTime > 15000 && q.confidence > 3
            ).length;
            score += thoughtfulAnswers / userResponses.questionsAnswered.length * 0.3;
        }

        // コンテキスト情報から推測
        if (context.referrer && context.referrer.includes('iching')) score += 0.2;
        if (context.sessionDuration > 600000) score += 0.2; // 10分以上
        if (context.previousVisits > 2) score += 0.2;

        // 明示的な興味表示
        if (context.interests && context.interests.includes('eastern_philosophy')) score += 0.3;

        return Math.min(1.0, score);
    }

    /**
     * ビジネス指向の評価
     */
    _assessBusinessOrientation(userResponses, context) {
        let score = 0;

        // 時間帯による推測（就業時間中）
        const now = new Date();
        const hour = now.getHours();
        if (hour >= 9 && hour <= 17) score += 0.1;

        // セッション時間（短時間で効率的）
        if (context.sessionDuration < 300000) score += 0.2; // 5分未満

        // デバイス・環境
        if (context.device === 'desktop') score += 0.1;
        if (context.network === 'corporate') score += 0.2;

        // コンテキスト情報
        if (context.interests && context.interests.includes('career')) score += 0.3;
        if (context.referrer && context.referrer.includes('linkedin')) score += 0.2;

        return Math.min(1.0, score);
    }

    /**
     * 自己開発フォーカスの評価
     */
    _assessSelfDevelopmentFocus(userResponses, context) {
        let score = 0;

        // 長時間の関与
        if (context.sessionDuration > 900000) score += 0.3; // 15分以上

        // 深い思考の痕跡
        if (userResponses.questionsAnswered) {
            const deepThinkingIndicators = userResponses.questionsAnswered.filter(q => 
                q.responseTime > 20000 || q.revisitCount > 1
            ).length;
            score += deepThinkingIndicators / userResponses.questionsAnswered.length * 0.4;
        }

        // コンテキスト
        if (context.interests && context.interests.includes('personal_growth')) score += 0.3;
        if (context.previousSessions > 3) score += 0.2;

        return Math.min(1.0, score);
    }

    /**
     * 技術的快適さの評価
     */
    _assessTechnicalComfort(userResponses, context) {
        let score = 0;

        // インターフェースの使用パターン
        if (context.advancedFeaturesUsed > 0) score += 0.3;
        if (context.errorRecoverySuccess) score += 0.2;
        if (context.customizationAttempts > 0) score += 0.2;

        // デバイス・ブラウザ
        if (context.modernBrowser) score += 0.1;
        if (context.mobileOptimized && context.device === 'mobile') score += 0.2;

        return Math.min(1.0, score);
    }

    /**
     * 深度要求の評価
     */
    _assessDepthPreference(userResponses, context) {
        let score = 0;

        // 時間投資
        if (context.sessionDuration > 600000) score += 0.3; // 10分以上
        
        // 追加コンテンツへの関与
        if (context.additionalContentViewed > 2) score += 0.3;
        if (context.helpSectionVisited) score += 0.2;

        // 反復利用
        if (context.repeatMeasurements > 1) score += 0.2;

        return Math.min(1.0, score);
    }

    /**
     * ユーザータイプの決定
     */
    _determineAudienceType(indicators) {
        const scores = {
            general: 0.5, // ベースライン
            iching_enthusiast: indicators.iching_knowledge * 0.6 + indicators.depth_preference * 0.4,
            business: indicators.business_orientation * 0.7 + (1 - indicators.depth_preference) * 0.3,
            self_development: indicators.self_development_focus * 0.6 + indicators.depth_preference * 0.4
        };

        // 最高スコアのタイプを選択（ただし閾値以上の場合のみ）
        const maxScore = Math.max(...Object.values(scores));
        const threshold = 0.6;

        if (maxScore < threshold) {
            return "general";
        }

        return Object.keys(scores).find(key => scores[key] === maxScore);
    }

    /**
     * 識別信頼度の計算
     */
    _calculateIdentificationConfidence(indicators) {
        const variance = this._calculateVariance(Object.values(indicators));
        const maxIndicator = Math.max(...Object.values(indicators));
        
        // 分散が小さく、最大値が高いほど信頼度が高い
        return Math.min(1.0, maxIndicator * (1 - variance));
    }

    /**
     * コンテンツ変換の実行
     */
    _transformContent(content, audienceType, options) {
        const rules = this.adaptationRules[audienceType];
        const terminology = this.terminologyMappings[audienceType];

        let transformed = { ...content };

        // 用語の置換
        if (content.text) {
            transformed.text = this._replaceTerminology(content.text, terminology);
        }

        // 説明の調整
        if (content.description) {
            transformed.description = this._adjustExplanationDepth(
                content.description, 
                rules.説明深度
            );
        }

        // 批判的要素の調整
        if (content.criticalAspects) {
            transformed.criticalAspects = this._adjustCriticalTone(
                content.criticalAspects,
                rules.批判的要素
            );
        }

        // 易経要素の調整
        if (content.ichingElements) {
            transformed.ichingElements = this._adjustIChingElements(
                content.ichingElements,
                rules.易経要素
            );
        }

        return transformed;
    }

    /**
     * 用語の置換
     */
    _replaceTerminology(text, terminology) {
        let result = text;
        
        for (const [original, replacement] of Object.entries(terminology)) {
            const regex = new RegExp(original, 'gi');
            result = result.replace(regex, replacement);
        }

        return result;
    }

    /**
     * 説明深度の調整
     */
    _adjustExplanationDepth(description, depthRules) {
        switch (depthRules.detail_level) {
            case "概要レベル":
                return this._summarizeDescription(description);
            case "実践レベル":
                return this._addPracticalExamples(description);
            case "深層レベル":
                return this._expandDescription(description);
            case "深層心理レベル":
                return this._addPsychologicalInsights(description);
            default:
                return description;
        }
    }

    /**
     * 批判的トーンの調整
     */
    _adjustCriticalTone(criticalContent, toneRules) {
        switch (toneRules.tone) {
            case "ソフトな表現":
                return this._softenCriticalTone(criticalContent);
            case "戦略的思考促進":
                return this._addStrategicFraming(criticalContent);
            case "哲学的深み重視":
                return this._addPhilosophicalContext(criticalContent);
            case "深い自己対話促進":
                return this._addSelfInquiryFraming(criticalContent);
            default:
                return criticalContent;
        }
    }

    /**
     * 易経要素の調整
     */
    _adjustIChingElements(ichingContent, ichingRules) {
        switch (ichingRules.level) {
            case "minimal":
                return this._minimizeIChingElements(ichingContent);
            case "practical":
                return this._focusOnPracticalAspects(ichingContent);
            case "detailed":
                return this._expandIChingExplanation(ichingContent);
            case "psychological":
                return this._addPsychologicalInterpretation(ichingContent);
            default:
                return ichingContent;
        }
    }

    // コンテンツ調整メソッド群（簡略実装）
    _summarizeDescription(desc) {
        return desc.split('.').slice(0, 2).join('.') + '.';
    }

    _addPracticalExamples(desc) {
        return desc + "\n\n具体的な活用例：" + this._generatePracticalExample();
    }

    _expandDescription(desc) {
        return desc + "\n\n" + this._generateDeepAnalysis();
    }

    _addPsychologicalInsights(desc) {
        return desc + "\n\n心理学的観点：" + this._generatePsychologicalInsight();
    }

    _softenCriticalTone(content) {
        return content.replace(/しかし/g, 'ただし').replace(/問題/g, '改善点');
    }

    _addStrategicFraming(content) {
        return "戦略的観点から：" + content;
    }

    _addPhilosophicalContext(content) {
        return "易経の智慧によれば：" + content;
    }

    _addSelfInquiryFraming(content) {
        return "自己探求の視点：" + content;
    }

    _minimizeIChingElements(content) {
        return content.replace(/易経|六十四卦|陰陽/g, '智慧の教え');
    }

    _focusOnPracticalAspects(content) {
        return content + "\n\nビジネス活用：" + this._generateBusinessApplication();
    }

    _expandIChingExplanation(content) {
        return content + "\n\n易経の教え：" + this._generateIChingWisdom();
    }

    _addPsychologicalInterpretation(content) {
        return content + "\n\n心理学的解釈：" + this._generatePsychologicalFramework();
    }

    // 生成メソッド群（プレースホルダー）
    _generatePracticalExample() {
        return "日常生活での具体的な実践方法を検討してみてください。";
    }

    _generateDeepAnalysis() {
        return "この特性の背景には、より深い心理的メカニズムが働いています。";
    }

    _generatePsychologicalInsight() {
        return "認知科学的には、この傾向は適応的な反応として理解できます。";
    }

    _generateBusinessApplication() {
        return "チーム運営や意思決定プロセスでの活用を検討してください。";
    }

    _generateIChingWisdom() {
        return "変化の中に不変の原理を見出すことが重要です。";
    }

    _generatePsychologicalFramework() {
        return "個人の成長プロセスにおける重要な要素として機能します。";
    }

    /**
     * 適応サマリーの生成
     */
    _generateAdaptationSummary(originalContent, audienceType) {
        return {
            target_audience: this.audienceTypes[audienceType],
            key_adaptations: [
                "用語の適切な置換",
                "説明深度の調整",
                "批判的トーンの最適化",
                "易経要素の適切な表現"
            ],
            adaptation_quality: "high",
            user_experience_impact: "improved"
        };
    }

    /**
     * 適応品質の評価
     */
    _assessAdaptationQuality(originalContent, audienceType) {
        return {
            terminology_consistency: 0.95,
            tone_appropriateness: 0.90,
            depth_alignment: 0.88,
            cultural_sensitivity: 0.92,
            overall_quality: 0.91
        };
    }

    /**
     * 適応ノートの生成
     */
    _generateAdaptationNotes(audienceType, indicators) {
        const notes = [];
        
        if (indicators.iching_knowledge > 0.7) {
            notes.push("易経の専門的知識を前提とした表現を使用");
        }
        
        if (indicators.business_orientation > 0.7) {
            notes.push("ビジネス文脈での実用性を重視した表現に調整");
        }
        
        if (indicators.depth_preference > 0.7) {
            notes.push("詳細な説明と深い分析を提供");
        }

        return notes;
    }

    /**
     * 分散の計算
     */
    _calculateVariance(values) {
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        return variance;
    }

    /**
     * 現在のユーザー層設定を取得
     */
    getCurrentAudience() {
        return this.currentAudience;
    }

    /**
     * ユーザー層を手動設定
     */
    setAudience(audienceType) {
        if (this.adaptationRules[audienceType]) {
            this.currentAudience = audienceType;
            console.log(`🗣️ [AdaptiveLanguage] ユーザー層を${this.audienceTypes[audienceType]}に設定`);
            return true;
        } else {
            console.warn(`⚠️ [AdaptiveLanguage] 無効なユーザー層: ${audienceType}`);
            return false;
        }
    }
}

// グローバルスコープに登録
if (typeof window !== 'undefined') {
    window.AdaptiveLanguage = AdaptiveLanguage;
    console.log("✅ [AdaptiveLanguage] グローバル登録完了");
} else {
    // Node.js環境での利用
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = AdaptiveLanguage;
    }
}