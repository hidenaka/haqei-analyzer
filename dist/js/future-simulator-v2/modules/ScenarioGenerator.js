/**
 * ScenarioGenerator.js - Advanced Scenario Generation Module
 * 
 * bunenjin哲学による効率的なシナリオ生成システム
 * I Ching統合と確率的未来予測
 * 
 * Author: HAQEI Programmer Agent
 * Created: 2025-08-06
 * Version: 2.0.0-modular
 */

export class ScenarioGenerator {
  constructor(core) {
    this.core = core;
    this.version = "2.0.0-modular";
    this.templates = this.initializeTemplates();
    this.hexagramData = this.initializeHexagramData();
    this.generationCache = new Map();
    
    console.log('🎭 ScenarioGenerator v2.0.0 initializing...');
  }

  /**
   * シナリオテンプレート初期化
   */
  initializeTemplates() {
    return {
      // 基本シナリオ構造
      basic: {
        introduction: "現在の状況を分析した結果、",
        development: "以下のような展開が予想されます：",
        climax: "重要な転換点として、",
        resolution: "この変化により、",
        conclusion: "最終的には"
      },

      // 関心事別テンプレート
      byCategory: {
        health: {
          patterns: [
            "健康状態の変化が生活全体に影響を与える",
            "新しい健康習慣が長期的な改善をもたらす",
            "体調管理の見直しが必要な時期"
          ],
          outcomes: ["改善", "安定", "注意", "変化"]
        },
        career: {
          patterns: [
            "キャリアの転換点が近づいている",
            "新しい業務や責任が成長の機会となる",
            "職場環境の変化が影響を与える"
          ],
          outcomes: ["昇進", "転職", "スキルアップ", "新展開"]
        },
        relationships: {
          patterns: [
            "人間関係の深化が新たな価値をもたらす",
            "コミュニケーションの改善が関係性を変える",
            "新しい出会いが視野を広げる"
          ],
          outcomes: ["深化", "拡大", "修復", "新展開"]
        },
        finance: {
          patterns: [
            "経済状況の変化が生活スタイルに影響する",
            "新しい収入源や投資機会が現れる",
            "支出の見直しが必要な時期"
          ],
          outcomes: ["増収", "節約", "投資", "安定"]
        },
        education: {
          patterns: [
            "新しい学習機会が能力向上につながる",
            "スキル習得が将来の可能性を広げる",
            "知識の応用が実践的な成果を生む"
          ],
          outcomes: ["習得", "応用", "向上", "達成"]
        },
        lifestyle: {
          patterns: [
            "生活バランスの調整が幸福度を向上させる",
            "新しい習慣やルーチンが効率性を高める",
            "価値観の変化が行動パターンを変える"
          ],
          outcomes: ["調和", "効率化", "充実", "変革"]
        }
      },

      // 時間軸別テンプレート
      byTimeframe: {
        immediate: "即座に現れる変化として、",
        short_term: "近い将来（1-3ヶ月）には、",
        medium_term: "中期的には（3-12ヶ月）、",
        long_term: "長期的な視点では（1年以上）、"
      },

      // 感情別テンプレート
      byEmotion: {
        positive: {
          intro: "ポジティブなエネルギーが",
          development: "前向きな変化を促進し、",
          outcome: "望ましい結果をもたらすでしょう"
        },
        negative: {
          intro: "現在の課題が",
          development: "重要な学びの機会となり、",
          outcome: "最終的には成長につながるでしょう"
        },
        neutral: {
          intro: "バランスの取れた状況から、",
          development: "段階的な変化が進み、",
          outcome: "安定した発展が期待できます"
        }
      }
    };
  }

  /**
   * I Ching六十四卦データ初期化
   */
  initializeHexagramData() {
    return {
      1: { name: "乾", element: "天", theme: "創造", keywords: ["リーダーシップ", "創造力", "積極性"] },
      2: { name: "坤", element: "地", theme: "受容", keywords: ["協調", "忍耐", "育成"] },
      3: { name: "屯", element: "雷水", theme: "始動", keywords: ["新しい始まり", "困難の克服", "成長"] },
      4: { name: "蒙", element: "山水", theme: "学習", keywords: ["教育", "指導", "理解"] },
      5: { name: "需", element: "水天", theme: "待機", keywords: ["忍耐", "タイミング", "準備"] },
      // ... 簡略化のため主要な卦のみ表示
      63: { name: "既済", element: "水火", theme: "完成", keywords: ["達成", "完了", "満足"] },
      64: { name: "未済", element: "火水", theme: "未完", keywords: ["継続", "発展", "可能性"] }
    };
  }

  /**
   * 高度シナリオ生成
   */
  async generateAdvancedScenarios(analysis, options = {}) {
    const {
      scenarioCount = 3,
      timeframes = ['short_term', 'medium_term', 'long_term'],
      includeHexagram = true,
      detailLevel = 'normal'
    } = options;

    try {
      // キャッシュ確認
      const cacheKey = this.generateCacheKey(analysis, options);
      if (this.generationCache.has(cacheKey)) {
        return this.generationCache.get(cacheKey);
      }

      // 分析結果からシナリオパラメータを抽出
      const parameters = this.extractScenarioParameters(analysis);
      
      // シナリオ生成
      const scenarios = await this.generateMultipleScenarios(parameters, {
        count: scenarioCount,
        timeframes,
        includeHexagram,
        detailLevel
      });

      // 結果をキャッシュに保存
      const result = {
        scenarios,
        parameters,
        metadata: {
          generatedAt: Date.now(),
          analysisId: analysis.metadata?.analysisId,
          version: this.version
        }
      };

      this.generationCache.set(cacheKey, result);
      return result;

    } catch (error) {
      console.error('❌ Advanced scenario generation failed:', error);
      throw error;
    }
  }

  /**
   * シナリオパラメータ抽出
   */
  extractScenarioParameters(analysis) {
    const params = {
      primaryEmotion: analysis.sentiment?.dominantEmotion || 'neutral',
      topConcerns: analysis.concerns?.topConcerns || [],
      temporalFocus: analysis.temporal?.primaryFocus || 'present',
      actionStage: analysis.actions?.currentStage || 'planning',
      relationshipFocus: analysis.relationships?.primaryRelationship || 'self',
      intentionType: analysis.intention?.primaryIntention || 'reflecting',
      confidenceLevel: analysis.metadata?.confidence || 0.5
    };

    return params;
  }

  /**
   * 複数シナリオ生成
   */
  async generateMultipleScenarios(parameters, options) {
    const scenarios = [];
    const { count, timeframes, includeHexagram, detailLevel } = options;

    for (let i = 0; i < count; i++) {
      const timeframe = timeframes[i % timeframes.length];
      const scenario = await this.generateSingleScenario(parameters, {
        timeframe,
        includeHexagram,
        detailLevel,
        variationIndex: i
      });
      scenarios.push(scenario);
    }

    // シナリオの多様性確保
    return this.diversifyScenarios(scenarios, parameters);
  }

  /**
   * 単一シナリオ生成
   */
  async generateSingleScenario(parameters, options) {
    const { timeframe, includeHexagram, detailLevel, variationIndex } = options;

    // 六十四卦選択
    const hexagram = includeHexagram ? this.selectHexagram(parameters, variationIndex) : null;
    
    // 主要関心事の選択
    const primaryConcern = parameters.topConcerns[variationIndex % parameters.topConcerns.length] || 
                          { category: 'lifestyle', probability: 0.5 };

    // シナリオ構築
    const scenario = {
      id: `scenario_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: await this.generateTitle(primaryConcern, parameters, hexagram),
      description: await this.generateDescription(primaryConcern, parameters, timeframe, hexagram),
      category: primaryConcern.category,
      timeframe,
      hexagram,
      probability: this.calculateProbability(primaryConcern, parameters, hexagram),
      impact: this.calculateImpact(primaryConcern, parameters),
      actionItems: await this.generateActionItems(primaryConcern, parameters, timeframe),
      timeline: await this.generateTimeline(primaryConcern, timeframe),
      keyFactors: this.identifyKeyFactors(primaryConcern, parameters),
      risks: this.identifyRisks(primaryConcern, parameters),
      opportunities: this.identifyOpportunities(primaryConcern, parameters),
      confidence: parameters.confidenceLevel
    };

    // 詳細レベルに応じた情報追加
    if (detailLevel === 'detailed') {
      scenario.detailedAnalysis = await this.generateDetailedAnalysis(scenario, parameters);
      scenario.alternativeOutcomes = await this.generateAlternativeOutcomes(scenario, parameters);
    }

    return scenario;
  }

  /**
   * 六十四卦選択
   */
  selectHexagram(parameters, variationIndex) {
    // パラメータに基づいた卦の選択ロジック
    const emotionMap = {
      positive: [1, 11, 34, 42, 58], // 創造的・発展的な卦
      negative: [3, 39, 47, 6, 29],  // 困難克服・学習の卦
      neutral: [2, 15, 52, 61, 64]   // 安定・調和の卦
    };

    const concernMap = {
      career: [1, 14, 50, 32],
      relationships: [31, 37, 54, 11],
      health: [27, 48, 57, 41],
      finance: [42, 21, 35, 55],
      education: [4, 20, 62, 43],
      lifestyle: [15, 46, 53, 33]
    };

    let candidateHexagrams = [];
    
    // 感情ベースの選択
    if (emotionMap[parameters.primaryEmotion]) {
      candidateHexagrams.push(...emotionMap[parameters.primaryEmotion]);
    }

    // 関心事ベースの選択
    if (parameters.topConcerns.length > 0) {
      const topConcern = parameters.topConcerns[0].category;
      if (concernMap[topConcern]) {
        candidateHexagrams.push(...concernMap[topConcern]);
      }
    }

    // デフォルト候補
    if (candidateHexagrams.length === 0) {
      candidateHexagrams = [1, 2, 11, 15, 64]; // 基本的な卦
    }

    // 変化を与えるための選択
    const selectedNumber = candidateHexagrams[variationIndex % candidateHexagrams.length];
    return {
      number: selectedNumber,
      ...this.hexagramData[selectedNumber]
    };
  }

  /**
   * タイトル生成
   */
  async generateTitle(concern, parameters, hexagram) {
    const category = concern.category;
    const emotion = parameters.primaryEmotion;
    const hexagramName = hexagram ? hexagram.name : '';

    const titlePatterns = {
      career: {
        positive: ["キャリアの飛躍", "職場での成功", "新たな挑戦の始まり"],
        negative: ["仕事の転換期", "職場での学び", "困難の克服"],
        neutral: ["安定したキャリア発展", "着実な成長", "バランスの取れた進歩"]
      },
      relationships: {
        positive: ["関係性の深化", "新しい絆の形成", "愛情の発展"],
        negative: ["人間関係の見直し", "コミュニケーションの改善", "理解の深化"],
        neutral: ["安定した関係性", "調和のとれた交流", "穏やかな発展"]
      },
      health: {
        positive: ["健康状態の向上", "生活習慣の改善", "ウェルビーイングの実現"],
        negative: ["健康管理の見直し", "体調への注意", "ケアの必要性"],
        neutral: ["健康の維持", "バランスの取れた生活", "安定した体調"]
      },
      finance: {
        positive: ["経済的な成長", "収入の増加", "投資の成功"],
        negative: ["支出の見直し", "経済計画の調整", "財政管理の学び"],
        neutral: ["安定した経済状況", "計画的な資産形成", "バランスの取れた財政"]
      },
      education: {
        positive: ["学習の成果", "スキルの向上", "知識の拡大"],
        negative: ["学習方法の見直し", "新たな課題への挑戦", "理解の深化"],
        neutral: ["着実な学習進歩", "継続的な成長", "安定した習得"]
      },
      lifestyle: {
        positive: ["生活の充実", "新しい習慣の定着", "ライフスタイルの向上"],
        negative: ["生活の見直し", "習慣の改善", "バランスの調整"],
        neutral: ["安定した生活", "調和のとれた日常", "穏やかな変化"]
      }
    };

    const patterns = titlePatterns[category] && titlePatterns[category][emotion] 
      ? titlePatterns[category][emotion] 
      : ["未来への可能性", "新たな展開", "変化の兆し"];

    const baseTitle = patterns[Math.floor(Math.random() * patterns.length)];
    
    // 六十四卦の要素を含める場合
    if (hexagram && Math.random() > 0.5) {
      return `${baseTitle} - ${hexagram.name}の示唆`;
    }

    return baseTitle;
  }

  /**
   * 詳細説明生成
   */
  async generateDescription(concern, parameters, timeframe, hexagram) {
    const templates = this.templates;
    const category = concern.category;
    const emotion = parameters.primaryEmotion;

    // 基本構造の構築
    let description = templates.basic.introduction;
    
    // カテゴリ別パターンの選択
    if (templates.byCategory[category]) {
      const categoryTemplate = templates.byCategory[category];
      const pattern = categoryTemplate.patterns[Math.floor(Math.random() * categoryTemplate.patterns.length)];
      description += pattern + "。";
    }

    // 時間軸の追加
    if (templates.byTimeframe[timeframe]) {
      description += templates.byTimeframe[timeframe];
    }

    // 感情的トーンの調整
    if (templates.byEmotion[emotion]) {
      const emotionTemplate = templates.byEmotion[emotion];
      description += emotionTemplate.development + emotionTemplate.outcome;
    }

    // 六十四卦の要素を含める
    if (hexagram) {
      description += `\n\n六十四卦「${hexagram.name}」は${hexagram.theme}を象徴し、`;
      description += `${hexagram.keywords.join('、')}といった要素が重要になることを示しています。`;
    }

    return description;
  }

  /**
   * 確率計算
   */
  calculateProbability(concern, parameters, hexagram) {
    let baseProbability = concern.probability || 0.5;
    
    // 信頼度による調整
    baseProbability *= parameters.confidenceLevel;
    
    // 感情による調整
    const emotionMultiplier = {
      positive: 1.1,
      negative: 0.9,
      neutral: 1.0
    };
    baseProbability *= emotionMultiplier[parameters.primaryEmotion] || 1.0;

    // 六十四卦による調整（わずかな影響）
    if (hexagram) {
      baseProbability *= (0.95 + Math.random() * 0.1); // 95-105%の範囲
    }

    return Math.round(Math.min(100, Math.max(10, baseProbability * 100)));
  }

  /**
   * 影響度計算
   */
  calculateImpact(concern, parameters) {
    const baseImpact = concern.probability || 0.5;
    const categoryWeight = {
      health: 1.2,
      relationships: 1.1,
      career: 1.0,
      finance: 0.9,
      education: 0.8,
      lifestyle: 0.7
    };

    const impact = baseImpact * (categoryWeight[concern.category] || 1.0);
    
    if (impact > 0.8) return 'high';
    if (impact > 0.5) return 'medium';
    return 'low';
  }

  /**
   * アクションアイテム生成
   */
  async generateActionItems(concern, parameters, timeframe) {
    const category = concern.category;
    const actionsByCategory = {
      career: [
        "スキル開発計画の策定",
        "ネットワーキング活動の強化",
        "キャリア目標の明確化",
        "パフォーマンス評価の準備"
      ],
      relationships: [
        "コミュニケーション方法の改善",
        "共通の活動時間の確保",
        "相手の立場への理解促進",
        "感謝の気持ちの表現"
      ],
      health: [
        "定期的な運動習慣の確立",
        "バランスの取れた食事計画",
        "十分な睡眠時間の確保",
        "ストレス管理方法の習得"
      ],
      finance: [
        "家計簿の詳細な記録",
        "投資知識の学習",
        "緊急資金の準備",
        "収入源の多様化検討"
      ],
      education: [
        "学習計画の立案",
        "実践的な演習の実施",
        "知識の応用機会の創出",
        "進捗状況の定期的な評価"
      ],
      lifestyle: [
        "日常ルーチンの最適化",
        "趣味活動の時間確保",
        "ワークライフバランスの調整",
        "価値観の再確認"
      ]
    };

    const actions = actionsByCategory[category] || [
      "現状の詳細な分析",
      "目標の明確化",
      "実行計画の策定",
      "進捗管理システムの構築"
    ];

    // 時間軸による調整
    const timeframeAdjustment = {
      short_term: "即座に実行可能な",
      medium_term: "段階的に進める",
      long_term: "長期的な視点での"
    };

    return actions.slice(0, 3).map(action => ({
      action,
      timeframe: timeframeAdjustment[timeframe] || "",
      priority: Math.random() > 0.5 ? 'high' : 'medium'
    }));
  }

  /**
   * タイムライン生成
   */
  async generateTimeline(concern, timeframe) {
    const timelineTemplates = {
      short_term: [
        { period: "1週間以内", milestone: "現状分析と目標設定" },
        { period: "2週間以内", milestone: "初期アクション実行" },
        { period: "1ヶ月以内", milestone: "進捗評価と調整" }
      ],
      medium_term: [
        { period: "1ヶ月以内", milestone: "基盤構築" },
        { period: "3ヶ月以内", milestone: "本格実行" },
        { period: "6ヶ月以内", milestone: "中間評価と最適化" }
      ],
      long_term: [
        { period: "3ヶ月以内", milestone: "長期計画策定" },
        { period: "6ヶ月以内", milestone: "第一段階完了" },
        { period: "1年以内", milestone: "目標達成と次段階準備" }
      ]
    };

    return timelineTemplates[timeframe] || timelineTemplates.medium_term;
  }

  /**
   * 重要要因特定
   */
  identifyKeyFactors(concern, parameters) {
    const factorsByCategory = {
      career: ["スキルレベル", "職場環境", "上司との関係", "業界動向"],
      relationships: ["コミュニケーション", "相互理解", "時間投資", "共通価値観"],
      health: ["生活習慣", "ストレスレベル", "環境要因", "遺伝的要因"],
      finance: ["収入安定性", "支出管理", "投資知識", "経済環境"],
      education: ["学習意欲", "時間確保", "学習環境", "実践機会"],
      lifestyle: ["時間管理", "優先順位", "価値観", "環境"]
    };

    return factorsByCategory[concern.category] || ["動機", "環境", "時間", "資源"];
  }

  /**
   * リスク特定
   */
  identifyRisks(concern, parameters) {
    const risksByCategory = {
      career: ["スキル不足", "職場変化", "競争激化", "経済不況"],
      relationships: ["誤解", "時間不足", "価値観の違い", "外的圧力"],
      health: ["習慣継続困難", "環境制約", "モチベーション低下", "外的要因"],
      finance: ["収入減少", "予期せぬ支出", "投資損失", "インフレ"],
      education: ["時間不足", "理解困難", "実践機会不足", "モチベーション維持"],
      lifestyle: ["時間管理失敗", "優先順位混乱", "外的圧力", "習慣化困難"]
    };

    return risksByCategory[concern.category] || ["予期せぬ変化", "リソース不足", "動機低下", "外的障害"];
  }

  /**
   * 機会特定
   */
  identifyOpportunities(concern, parameters) {
    const opportunitiesByCategory = {
      career: ["新プロジェクト", "スキル習得機会", "ネットワーク拡大", "市場成長"],
      relationships: ["共通興味発見", "深い対話機会", "新しい環境", "相互成長"],
      health: ["新習慣定着", "サポート獲得", "環境改善", "知識向上"],
      finance: ["収入機会", "投資チャンス", "節約効果", "知識習得"],
      education: ["新しい分野", "実践応用", "ネットワーク形成", "キャリア向上"],
      lifestyle: ["効率向上", "満足度増加", "新しい発見", "バランス改善"]
    };

    return opportunitiesByCategory[concern.category] || ["新しい可能性", "成長機会", "効率改善", "満足度向上"];
  }

  /**
   * 詳細分析生成
   */
  async generateDetailedAnalysis(scenario, parameters) {
    return {
      strengths: this.analyzeStrengths(scenario, parameters),
      weaknesses: this.analyzeWeaknesses(scenario, parameters),
      externalFactors: this.analyzeExternalFactors(scenario),
      prerequisites: this.identifyPrerequisites(scenario),
      successIndicators: this.defineSuccessIndicators(scenario)
    };
  }

  /**
   * 代替結果生成
   */
  async generateAlternativeOutcomes(scenario, parameters) {
    return [
      {
        scenario: "最良のケース",
        probability: Math.round(scenario.probability * 0.7),
        description: "すべての要因が好条件で揃った場合の理想的な展開"
      },
      {
        scenario: "最悪のケース", 
        probability: Math.round(scenario.probability * 0.3),
        description: "主要なリスクが現実化した場合の困難な状況"
      },
      {
        scenario: "現実的なケース",
        probability: scenario.probability,
        description: "通常の条件下で期待できる現実的な結果"
      }
    ];
  }

  /**
   * シナリオ多様性確保
   */
  diversifyScenarios(scenarios, parameters) {
    // カテゴリ、時間軸、確率の分散を確認
    const categories = new Set(scenarios.map(s => s.category));
    const timeframes = new Set(scenarios.map(s => s.timeframe));
    
    // 必要に応じて調整
    scenarios.forEach((scenario, index) => {
      scenario.uniqueId = `${scenario.category}_${scenario.timeframe}_${index}`;
      scenario.diversityScore = this.calculateDiversityScore(scenario, scenarios);
    });

    return scenarios.sort((a, b) => b.probability - a.probability);
  }

  /**
   * 多様性スコア計算
   */
  calculateDiversityScore(scenario, allScenarios) {
    const categoryDiversity = allScenarios.filter(s => s.category === scenario.category).length;
    const timeframeDiversity = allScenarios.filter(s => s.timeframe === scenario.timeframe).length;
    
    return 1 / (categoryDiversity + timeframeDiversity);
  }

  /**
   * キャッシュキー生成
   */
  generateCacheKey(analysis, options) {
    const analysisHash = JSON.stringify({
      sentiment: analysis.sentiment?.dominantEmotion,
      concerns: analysis.concerns?.topConcerns?.slice(0, 2),
      temporal: analysis.temporal?.primaryFocus
    });
    const optionsHash = JSON.stringify(options);
    return btoa(analysisHash + optionsHash).substring(0, 32);
  }

  /**
   * キャッシュクリア
   */
  clearCache() {
    this.generationCache.clear();
    console.log('🧹 ScenarioGenerator cache cleared');
  }

  /**
   * 生成統計取得
   */
  getGenerationStats() {
    return {
      version: this.version,
      cacheSize: this.generationCache.size,
      templatesLoaded: Object.keys(this.templates).length,
      hexagramsLoaded: Object.keys(this.hexagramData).length
    };
  }
}

export default ScenarioGenerator;