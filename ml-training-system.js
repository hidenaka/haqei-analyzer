/**
 * 機械学習用トレーニングデータ生成システム
 * 1000人分のペルソナ + テストテキスト + 専門家評価
 */

class MLTrainingDataGenerator {
  constructor() {
    this.personas = [];
    this.testCases = [];
    this.expertEvaluations = [];
    this.userSatisfactionData = [];
  }

  /**
   * 1000人分のペルソナ生成
   */
  generatePersonas() {
    const demographics = {
      age_groups: [
        { range: '20-29', weight: 0.25 },
        { range: '30-39', weight: 0.30 },
        { range: '40-49', weight: 0.25 },
        { range: '50-59', weight: 0.15 },
        { range: '60+', weight: 0.05 }
      ],
      genders: [
        { type: 'female', weight: 0.6 },
        { type: 'male', weight: 0.35 },
        { type: 'other', weight: 0.05 }
      ],
      life_situations: [
        { category: 'career_change', weight: 0.20 },
        { category: 'relationship_issues', weight: 0.25 },
        { category: 'family_problems', weight: 0.15 },
        { category: 'health_concerns', weight: 0.10 },
        { category: 'financial_stress', weight: 0.15 },
        { category: 'personal_growth', weight: 0.15 }
      ],
      personality_traits: [
        { trait: 'sensitive', weight: 0.30 },
        { trait: 'analytical', weight: 0.25 },
        { trait: 'emotional', weight: 0.35 },
        { trait: 'practical', weight: 0.20 },
        { trait: 'spiritual', weight: 0.15 }
      ]
    };

    const worryPatterns = {
      emotional_sensitivity: [
        "他人の感情に敏感で疲れやすい",
        "周りの雰囲気に左右されがち",
        "人の目を気にしすぎる",
        "感情の浮き沈みが激しい"
      ],
      interpersonal: [
        "職場の人間関係がうまくいかない", 
        "恋人との将来に不安を感じる",
        "家族との価値観の違いに悩む",
        "友人関係の距離感がわからない"
      ],
      life_direction: [
        "人生の目標が見つからない",
        "このままの人生でいいのか迷う",
        "やりたいことと現実のギャップ",
        "将来への漠然とした不安"
      ],
      work_life: [
        "仕事にやりがいを感じられない",
        "転職すべきか迷っている",
        "ワークライフバランスが取れない",
        "昇進のプレッシャーに悩む"
      ]
    };

    // 1000人分のペルソナ生成
    for (let i = 0; i < 1000; i++) {
      const persona = {
        id: `persona_${i + 1}`,
        demographics: {
          age_group: this.weightedRandom(demographics.age_groups),
          gender: this.weightedRandom(demographics.genders),
          life_situation: this.weightedRandom(demographics.life_situations),
          personality_traits: this.selectMultiple(demographics.personality_traits, 2, 4)
        },
        worry_category: this.weightedRandom(Object.keys(worryPatterns)),
        emotional_state: {
          stress_level: Math.floor(Math.random() * 10) + 1,
          clarity_level: Math.floor(Math.random() * 10) + 1,
          urgency_level: Math.floor(Math.random() * 10) + 1
        }
      };
      
      this.personas.push(persona);
    }

    console.log(`✅ ${this.personas.length}人分のペルソナを生成完了`);
    return this.personas;
  }

  /**
   * 各ペルソナに対応するテストテキスト生成
   */
  generateTestTexts() {
    // SNS風の自然な文章パターンを含む多様なテンプレート
    const templates = {
      emotional_sensitivity: {
        formal: [
          "{age_context}なのですが、{sensitivity_issue}。{specific_situation}という状況で、{desired_outcome}したいと思っています。{background_context}",
          "最近{sensitivity_pattern}ことが多くて困っています。{emotional_impact}。どうすれば{solution_direction}できるでしょうか。"
        ],
        casual: [
          "うーん、{sensitivity_issue}んだよね😔 {emotional_impact}みたいな感じで。。。{desired_outcome}したいんだけど、どうしたらいいかな？",
          "{sensitivity_pattern}のがほんとしんどい💦 {trigger_situation}って状況になると{emotional_response}しちゃって、、、{ideal_state}になれたらなあ",
          "相談です🙏 {personality_trait}すぎて疲れる...{specific_situation}みたいなことが続いてて、{desired_outcome}方法ある？？"
        ],
        messy: [
          "{sensitivity_issue}。。。ほんとに。{emotional_impact}し、{desired_outcome}したいって思うんだけど、、なんていうか{background_context}みたいな感じで。どうしよう",
          "あー{sensitivity_pattern}のまじでしんどい！！{trigger_situation}→{emotional_response}のパターンもうやだ😭{ideal_state}なりたい。。。",
          "{personality_trait}な自分がいやになる。{specific_situation}とかあると、もう、、、{emotional_impact}で。{desired_outcome}にはどうしたら"
        ],
        broken: [
          "{sensitivity_issue}んだけど。{emotional_impact}。{desired_outcome}したい。でも。。。",
          "{sensitivity_pattern}。しんどい。{trigger_situation}。{emotional_response}。{ideal_state}。無理かな",
          "{personality_trait}。{specific_situation}。{emotional_impact}。{desired_outcome}。"
        ]
      },
      interpersonal: {
        formal: [
          "{relationship_context}の問題で悩んでいます。{specific_conflict}という状況で、{emotional_impact}。{desired_resolution}したいのですが。"
        ],
        casual: [
          "{relationship_context}とうまくいかなくて😞 {specific_conflict}みたいなことがあって、{emotional_impact}。{desired_resolution}したいんだけどなー",
          "{interpersonal_pattern}ことばっかりで疲れた💦 {stress_manifestation}状態。{solution_seeking}にはどうすれば？？"
        ],
        messy: [
          "{relationship_context}。。。もうやだ。{specific_conflict}で{emotional_impact}みたいになってる。{desired_resolution}したいけど、どうやって？？？",
          "また{interpersonal_pattern}😤 {stress_manifestation}だし、{background_info}もあるし。。。{solution_seeking}方法教えて！"
        ],
        broken: [
          "{relationship_context}。だめ。{specific_conflict}。{emotional_impact}。{desired_resolution}。できない。",
          "{interpersonal_pattern}。{stress_manifestation}。{solution_seeking}。わからない。"
        ]
      },
      life_direction: {
        formal: [
          "{age_context}、{current_situation}。{dissatisfaction_source}で、{future_anxiety}。{seeking_direction}したいと考えています。"
        ],
        casual: [
          "{current_situation}なんだけど、{dissatisfaction_source}で悩んでる😅 {future_anxiety}し、{seeking_direction}したいなー",
          "{life_stage_context}で{existential_question}って感じ。{current_attempts}してるけど{obstacles}。{guidance_request}かも？"
        ],
        messy: [
          "人生。。。{current_situation}。{dissatisfaction_source}。{future_anxiety}みたいな。{seeking_direction}したいけどどうすれば？？",
          "{existential_question}。{current_attempts}したけど{obstacles}で。。。もう{guidance_request}しかない？"
        ],
        broken: [
          "{current_situation}。{dissatisfaction_source}。{future_anxiety}。{seeking_direction}。どうする。",
          "{existential_question}。{current_attempts}。{obstacles}。{guidance_request}。"
        ]
      },
      work_life: {
        formal: [
          "{career_context}ですが、{work_issue}。{impact_description}で、{decision_struggle}。{advice_request}。"
        ],
        casual: [
          "仕事の話なんだけど、{work_issue}で困ってる💦 {impact_description}状態で、{decision_struggle}。{advice_request}かな？",
          "{career_context}だけど{specific_challenge}っていう問題が。。。{stress_symptoms}で{change_desire}考えてる"
        ],
        messy: [
          "仕事。。。{work_issue}。{impact_description}でもう。。。{decision_struggle}けどどうしよう😭{advice_request}？？",
          "{specific_challenge}！！まじでしんどい。{stress_symptoms}だし{change_desire}しようかな。。。でも不安"
        ],
        broken: [
          "仕事。{work_issue}。{impact_description}。{decision_struggle}。{advice_request}。",
          "{specific_challenge}。{stress_symptoms}。{change_desire}。不安。"
        ]
      }
    };

    // よりリアルな人間の表現を含む文脈変数
    const contextVariables = {
      age_context: {
        "20-29": ["20代後半", "社会人3年目", "就職して数年", "アラサー", "20代最後の年", "新卒で入って4年目"],
        "30-39": ["30代前半", "結婚を考える年齢", "キャリアの分岐点", "30過ぎて", "アラサー卒業して", "30代になってから"],
        "40-49": ["40代", "中間管理職", "人生の折り返し地点", "40過ぎて", "アラフォー", "管理職になって"],
        "50-59": ["50代", "子育てが一段落", "老後を考える年齢", "50過ぎたら", "アラフィフ", "定年まであと少し"],
        "60+": ["60代", "定年退職後", "人生の総仕上げ", "還暦過ぎて", "シニアになって", "老後生活"]
      },
      
      // 感情的敏感さの表現（様々な口調）
      sensitivity_issue: [
        "世の中イライラしてる人敏感に感じやすく対応しちゃう",
        "他人の感情に巻き込まれやすい性格",
        "周りの空気を読みすぎて疲れちゃう",
        "人の顔色ばっかり見てしまう",
        "みんなの機嫌に左右されがち",
        "空気読みすぎて自分がしんどい",
        "他人の感情もらっちゃう体質",
        "敏感すぎてつらい",
        "HSPっぽくて生きづらい",
        "繊細すぎるのかも"
      ],
      
      // より自然な欲求表現
      desired_outcome: [
        "もっとニュートラルを保てるように",
        "感情に振り回されないように",
        "自分らしくいられるように",
        "精神的に安定していたい",
        "もっと楽に生きたい",
        "気にしすぎない人になりたい",
        "鈍感力がほしい",
        "メンタル強くなりたい",
        "もっと図太くなりたい",
        "自分軸で生きられるように",
        "ブレない自分になりたい"
      ],
      
      // 感情的インパクトの表現
      emotional_impact: [
        "めっちゃしんどい",
        "すごく疲れる",
        "もう限界",
        "毎日がつらい",
        "心がざわざわする",
        "モヤモヤが止まらない",
        "イライラが収まらない",
        "不安でたまらない",
        "気持ちがしんどすぎる",
        "メンタルやられる"
      ],
      
      // トリガー状況（口語的）
      trigger_situation: [
        "職場がピリピリしてると",
        "みんながイライラしてると",
        "雰囲気悪い時",
        "誰かが不機嫌だと",
        "空気が重い時",
        "周りがザワザワしてる時",
        "人間関係がギスギスしてると",
        "変な空気になると"
      ],
      
      // 感情的反応
      emotional_response: [
        "もらっちゃう",
        "引きずられる",
        "巻き込まれる",
        "しんどくなる",
        "疲れちゃう",
        "ダメージ受ける",
        "気持ち悪くなる",
        "落ち込む"
      ],
      
      // 理想的状態
      ideal_state: [
        "マイペースで",
        "もっと楽に",
        "自分らしく",
        "ニュートラルに",
        "冷静に",
        "穏やかに",
        "気にしないで",
        "堂々と"
      ],
      
      // 人間関係コンテキスト
      relationship_context: [
        "彼氏",
        "彼女",
        "夫",
        "妻",
        "職場の人",
        "上司",
        "同僚",
        "友達",
        "親",
        "家族",
        "ママ友",
        "パート先の人"
      ],
      
      // 仕事関係
      work_issue: [
        "やりがい感じない",
        "人間関係がしんどい",
        "残業多すぎ",
        "給料安い",
        "上司がむかつく",
        "同僚と合わない",
        "やることが意味わからん",
        "会社の方針についていけない",
        "将来性が見えない",
        "スキルアップできない"
      ]
    };

    this.testCases = this.personas.map((persona, index) => {
      const template = this.selectTemplate(templates, persona.worry_category, persona);
      const generatedText = this.fillTemplate(template, persona, contextVariables);
      
      return {
        id: `test_case_${index + 1}`,
        persona_id: persona.id,
        input_text: generatedText,
        expected_analysis: {
          context_type: this.predictContextType(persona),
          emotional_complexity: this.calculateEmotionalComplexity(persona),
          suggested_hexagrams: this.suggestHexagrams(persona),
          confidence_expectation: this.calculateExpectedConfidence(persona)
        },
        metadata: {
          text_length: generatedText.length,
          complexity_score: this.calculateTextComplexity(generatedText),
          emotional_indicators: this.extractEmotionalIndicators(generatedText)
        }
      };
    });

    console.log(`✅ ${this.testCases.length}件のテストケースを生成完了`);
    return this.testCases;
  }

  /**
   * 専門家評価システム
   */
  createExpertEvaluationSystem() {
    const expertEvaluationSchema = {
      case_id: '', // テストケースID
      expert_id: '', // 専門家ID
      evaluation: {
        // 卦の適切性評価
        hexagram_accuracy: {
          primary_hexagram: {
            number: 0, // 1-64
            line: 0, // 1-6  
            confidence: 0, // 1-10
            reasoning: ''
          },
          alternative_hexagrams: [
            { number: 0, line: 0, confidence: 0, reasoning: '' }
          ]
        },
        
        // 分析の深度評価
        analysis_depth: {
          emotional_understanding: 0, // 1-10
          context_comprehension: 0, // 1-10
          practical_applicability: 0, // 1-10
          traditional_accuracy: 0 // 1-10
        },
        
        // 改善提案
        improvement_suggestions: {
          missed_aspects: [],
          better_interpretations: [],
          additional_considerations: []
        },
        
        // 総合評価
        overall_rating: 0, // 1-10
        user_satisfaction_prediction: 0, // 1-10
        expert_notes: ''
      },
      timestamp: new Date().toISOString()
    };

    return expertEvaluationSchema;
  }

  /**
   * ユーザー納得感シミュレーション
   */
  simulateUserSatisfaction(testCase, expertEvaluation) {
    const satisfactionFactors = {
      // 個人的共感度
      personal_resonance: this.calculateResonance(testCase, expertEvaluation),
      
      // 説明の明確さ
      explanation_clarity: this.evaluateClarity(expertEvaluation),
      
      // 実用性
      practical_value: this.assessPracticalValue(expertEvaluation),
      
      // 納得感
      conviction_level: this.measureConviction(testCase, expertEvaluation)
    };

    const overallSatisfaction = Object.values(satisfactionFactors)
      .reduce((sum, score) => sum + score, 0) / Object.keys(satisfactionFactors).length;

    return {
      case_id: testCase.id,
      satisfaction_score: Math.round(overallSatisfaction * 10) / 10,
      factor_breakdown: satisfactionFactors,
      feedback_type: this.categorizeFeedback(overallSatisfaction),
      user_comments: this.generateUserComments(overallSatisfaction, satisfactionFactors)
    };
  }

  /**
   * 機械学習用データセット生成
   */
  generateMLDataset() {
    console.log('🚀 機械学習用データセット生成開始...');
    
    // Step 1: ペルソナ生成
    this.generatePersonas();
    
    // Step 2: テストケース生成
    this.generateTestTexts();
    
    // Step 3: 専門家評価スキーマ準備
    const evaluationSchema = this.createExpertEvaluationSystem();
    
    // Step 4: 機械学習用データセット構築
    const mlDataset = {
      metadata: {
        version: '1.0',
        generated_at: new Date().toISOString(),
        total_personas: this.personas.length,
        total_test_cases: this.testCases.length,
        quality_target: '80%+ accuracy, 4.0+ user satisfaction'
      },
      
      personas: this.personas,
      test_cases: this.testCases,
      evaluation_schema: evaluationSchema,
      
      // 機械学習用の特徴量定義
      feature_definitions: {
        input_features: [
          'text_length', 'emotional_keywords', 'context_indicators',
          'complexity_score', 'sentiment_polarity', 'urgency_markers'
        ],
        target_features: [
          'hexagram_number', 'line_number', 'confidence_score',
          'user_satisfaction', 'expert_rating'
        ]
      },
      
      // 訓練/検証/テスト分割
      data_split: {
        training: this.testCases.slice(0, 700),    // 70%
        validation: this.testCases.slice(700, 850), // 15%
        testing: this.testCases.slice(850, 1000)    // 15%
      }
    };

    console.log('✅ 機械学習用データセット生成完了');
    console.log(`📊 統計: 訓練用${mlDataset.data_split.training.length}件, 検証用${mlDataset.data_split.validation.length}件, テスト用${mlDataset.data_split.testing.length}件`);
    
    return mlDataset;
  }

  // ===== ヘルパーメソッド =====
  
  weightedRandom(items) {
    const weights = items.map(item => item.weight || 1);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return items[i].type || items[i].range || items[i].category || items[i];
      }
    }
    return items[0];
  }

  selectMultiple(items, min, max) {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const selected = [];
    const available = [...items];
    
    for (let i = 0; i < count && available.length > 0; i++) {
      const index = Math.floor(Math.random() * available.length);
      selected.push(available.splice(index, 1)[0]);
    }
    
    return selected;
  }

  selectTemplate(templates, category, persona) {
    const categoryTemplates = templates[category] || templates.emotional_sensitivity;
    
    // ペルソナの特性に基づいて文体を選択
    const textStyleWeights = this.calculateTextStyleWeights(persona);
    const selectedStyle = this.weightedRandom([
      { type: 'formal', weight: textStyleWeights.formal },
      { type: 'casual', weight: textStyleWeights.casual },
      { type: 'messy', weight: textStyleWeights.messy },
      { type: 'broken', weight: textStyleWeights.broken }
    ]);
    
    const styleTemplates = categoryTemplates[selectedStyle] || categoryTemplates.casual;
    return {
      template: styleTemplates[Math.floor(Math.random() * styleTemplates.length)],
      style: selectedStyle
    };
  }

  /**
   * ペルソナの特性に基づいて文体の重みを計算
   */
  calculateTextStyleWeights(persona) {
    const age = persona.demographics.age_group;
    const stressLevel = persona.emotional_state.stress_level;
    const clarityLevel = persona.emotional_state.clarity_level;
    
    // 年齢による文体傾向
    const ageWeights = {
      "20-29": { formal: 0.1, casual: 0.5, messy: 0.3, broken: 0.1 },
      "30-39": { formal: 0.2, casual: 0.4, messy: 0.3, broken: 0.1 },
      "40-49": { formal: 0.4, casual: 0.3, messy: 0.2, broken: 0.1 },
      "50-59": { formal: 0.5, casual: 0.3, messy: 0.15, broken: 0.05 },
      "60+": { formal: 0.6, casual: 0.25, messy: 0.1, broken: 0.05 }
    };
    
    let weights = ageWeights[age] || ageWeights["30-39"];
    
    // ストレスレベルによる調整（高いほどmessy/brokenが増える）
    if (stressLevel > 7) {
      weights.messy *= 1.5;
      weights.broken *= 2.0;
      weights.formal *= 0.5;
    }
    
    // 明確さレベルによる調整（低いほどbrokenが増える）
    if (clarityLevel < 4) {
      weights.broken *= 3.0;
      weights.messy *= 1.3;
      weights.formal *= 0.3;
    }
    
    // 正規化
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    Object.keys(weights).forEach(key => {
      weights[key] = weights[key] / total;
    });
    
    return weights;
  }

  fillTemplate(templateObj, persona, variables) {
    let result = templateObj.template || templateObj;
    
    // テンプレート変数を実際の値に置換
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      if (result.includes(`{${key}}`)) {
        const options = variables[key][persona.demographics.age_group] || variables[key];
        const selected = Array.isArray(options) ? 
          options[Math.floor(Math.random() * options.length)] : options;
        result = result.replace(regex, selected);
      }
    });

    return result;
  }

  predictContextType(persona) {
    const mapping = {
      emotional_sensitivity: 'personal',
      interpersonal: 'relationship', 
      life_direction: 'philosophical',
      work_life: 'business'
    };
    return mapping[persona.worry_category] || 'personal';
  }

  calculateEmotionalComplexity(persona) {
    return persona.emotional_state.stress_level + 
           (10 - persona.emotional_state.clarity_level) +
           persona.demographics.personality_traits.length;
  }

  suggestHexagrams(persona) {
    // 簡易的な卦推定ロジック（実際は専門家が決定）
    const suggestions = {
      emotional_sensitivity: [27, 52, 61], // 山雷頤、艮為山、風沢中孚
      interpersonal: [31, 37, 54], // 沢山咸、風火家人、雷沢帰妹
      life_direction: [53, 20, 4], // 風山漸、風地観、山水蒙  
      work_life: [14, 32, 42] // 火天大有、雷風恒、風雷益
    };
    
    return suggestions[persona.worry_category] || [1, 2, 3];
  }

  calculateExpectedConfidence(persona) {
    const baseConfidence = 0.7;
    const clarityBonus = persona.emotional_state.clarity_level * 0.02;
    const complexityPenalty = this.calculateEmotionalComplexity(persona) * -0.01;
    
    return Math.max(0.3, Math.min(0.95, baseConfidence + clarityBonus + complexityPenalty));
  }

  calculateTextComplexity(text) {
    const sentences = text.split(/[。！？]/).length;
    const avgLength = text.length / sentences;
    return Math.min(10, Math.round(avgLength / 10));
  }

  extractEmotionalIndicators(text) {
    const indicators = {
      positive: ['嬉しい', '満足', '充実'].filter(w => text.includes(w)).length,
      negative: ['悩み', '不安', '困る'].filter(w => text.includes(w)).length,
      neutral: ['普通', 'バランス'].filter(w => text.includes(w)).length
    };
    return indicators;
  }

  calculateResonance(testCase, expertEvaluation) {
    // ペルソナの特性と専門家評価の整合性
    return Math.random() * 10; // 簡易実装
  }

  evaluateClarity(expertEvaluation) {
    return expertEvaluation.analysis_depth.emotional_understanding * 0.8 + 
           expertEvaluation.analysis_depth.context_comprehension * 0.2;
  }

  assessPracticalValue(expertEvaluation) {
    return expertEvaluation.analysis_depth.practical_applicability;
  }

  measureConviction(testCase, expertEvaluation) {
    return expertEvaluation.hexagram_accuracy.primary_hexagram.confidence;
  }

  categorizeFeedback(satisfaction) {
    if (satisfaction >= 8) return 'accurate';
    if (satisfaction >= 6) return 'somewhat';
    return 'inaccurate';
  }

  generateUserComments(satisfaction, factors) {
    if (satisfaction >= 8) {
      return "非常に的確で納得できる分析でした。自分の状況をよく理解してもらえた感じがします。";
    } else if (satisfaction >= 6) {
      return "ある程度当たっている部分もありますが、もう少し具体的だと良かったです。";
    } else {
      return "あまり自分の状況に合っていないように感じました。";
    }
  }
}

// 使用例
const generator = new MLTrainingDataGenerator();
const dataset = generator.generateMLDataset();

// データセットをJSONファイルとして出力
console.log('💾 データセットを保存中...');
// localStorage.setItem('ml_training_dataset', JSON.stringify(dataset, null, 2));

// ES Modules対応のエクスポート
export default MLTrainingDataGenerator;

// CommonJS互換性
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MLTrainingDataGenerator;
}