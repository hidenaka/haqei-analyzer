/**
 * リアリスティックテキスト生成エンジン - 人間らしい悩み文章の生成
 * 
 * 目的：
 * - テストユーザーのペルソナに基づいた自然な悩み文章の生成
 * - 人間特有の言語パターン・感情表現の再現
 * - 状況卦算出精度向上のための多様なテキストデータ生成
 * 
 * 入力：
 * - userProfile: object - TestUserGeneratorで生成されたユーザープロファイル
 * - generationOptions: object - テキスト生成オプション
 * 
 * 処理内容：
 * 1. ペルソナ特性に基づく文体・語彙の選択
 * 2. 年齢・性別・職業に応じた言語パターンの適用
 * 3. 感情の深さ・複雑さの表現
 * 4. 口語的表現・言い淀み・感情の揺れの再現
 * 5. 文章の長さ・構造の自然な変動
 * 6. HSP特性に応じた繊細な表現の付加
 * 
 * 出力：
 * - worryText: string - 生成された悩み文章
 * - textMetadata: object - 文章の特性メタデータ
 * 
 * 副作用：
 * - なし（純粋な生成関数）
 * 
 * 前提条件：
 * - TestUserGeneratorによるユーザープロファイルが利用可能
 * - 日本語の自然な表現パターンのデータベース
 * 
 * エラー処理：
 * - 生成失敗時のフォールバック文章
 * - 不適切な表現の除外
 */
class RealisticTextGenerator {
  constructor() {
    // 基本的な文体パターン
    this.writingStyles = {
      formal: {
        name: '丁寧・フォーマル',
        patterns: {
          start: ['お世話になっております。', '初めまして。', 'ご相談があります。'],
          end: ['よろしくお願いいたします。', 'ご助言いただければ幸いです。', 'お力をお借りできればと思います。'],
          connectors: ['また、', 'そして、', 'さらに、', '加えて、'],
          hedging: ['かもしれません', 'のではないでしょうか', 'と思われます']
        }
      },
      casual: {
        name: 'カジュアル・親しみやすい',
        patterns: {
          start: ['こんにちは。', '聞いてください。', '実は...', 'ちょっと相談なんですが'],
          end: ['どう思いますか？', 'アドバイスください！', 'よろしくです。'],
          connectors: ['で、', 'それで、', 'あと、', 'んで、'],
          hedging: ['かも', 'っぽい', 'みたいな', 'って感じ']
        }
      },
      introspective: {
        name: '内省的・思索的',
        patterns: {
          start: ['最近考えているのですが...', 'ふと思うことがあって...', '自分の中で整理がつかなくて...'],
          end: ['...そんなことを考えています。', '答えが見つからないでいます。', '迷っています。'],
          connectors: ['でも、', 'ただ、', '一方で、', 'とはいえ、'],
          hedging: ['のかもしれない', 'ような気がする', 'と感じている']
        }
      }
    };
    
    // 感情表現のパターン
    this.emotionalExpressions = {
      anxiety: {
        mild: ['心配', '不安', '気になる', 'もやもや'],
        moderate: ['とても不安', '落ち着かない', '考えると怖い', '心配で眠れない'],
        severe: ['押しつぶされそう', 'パニックになりそう', '息苦しい', '頭が真っ白']
      },
      sadness: {
        mild: ['寂しい', '悲しい', 'つらい', '切ない'],
        moderate: ['とても悲しい', '涙が出る', '心が痛い', '空虚感'],
        severe: ['絶望的', '生きる意味がわからない', '何も感じない', '消えたい']
      },
      anger: {
        mild: ['イライラ', '腹立たしい', 'むかつく', '納得いかない'],
        moderate: ['怒りが収まらない', '許せない', '憤り', '理不尽'],
        severe: ['激怒', '爆発しそう', '憎い', '破壊したい']
      },
      confusion: {
        mild: ['わからない', '迷う', '困る', '悩む'],
        moderate: ['混乱している', '整理がつかない', '頭がぐちゃぐちゃ', '判断できない'],
        severe: ['完全に見失った', '何が何だか', 'カオス', '思考停止']
      }
    };
    
    // 年代別の言語特徴
    this.ageLanguagePatterns = {
      '18-24': {
        vocabulary: ['マジで', 'ヤバい', 'めっちゃ', 'ガチ', '〜じゃん', '〜的な'],
        sentence_enders: ['〜なんだけど', '〜って感じ', '〜みたいな'],
        emoji_usage: 0.3,
        abbreviations: true
      },
      '25-34': {
        vocabulary: ['本当に', 'かなり', 'すごく', '〜ですね', '〜かな'],
        sentence_enders: ['〜と思います', '〜ですが', '〜でしょうか'],
        emoji_usage: 0.1,
        abbreviations: false
      },
      '35-44': {
        vocabulary: ['実際', '確かに', '正直', '〜ですし', '〜ですから'],
        sentence_enders: ['〜ですね', '〜と思うのですが', '〜でしょう'],
        emoji_usage: 0.05,
        abbreviations: false
      },
      '45-54': {
        vocabulary: ['やはり', 'どうも', '〜でございます', '〜ようで'],
        sentence_enders: ['〜です', '〜ます', '〜でしょうか'],
        emoji_usage: 0.02,
        abbreviations: false
      },
      '55+': {
        vocabulary: ['昔は', '最近の', '〜だったのですが', '〜ものです'],
        sentence_enders: ['〜ですね', '〜と思います', '〜でしょう'],
        emoji_usage: 0.01,
        abbreviations: false
      }
    };
    
    // 職業別の専門用語・表現
    this.occupationalLanguage = {
      office: {
        terms: ['プロジェクト', 'タスク', 'ミーティング', 'デッドライン', 'パフォーマンス'],
        concerns: ['評価', '昇進', '人間関係', 'ワークライフバランス']
      },
      professional: {
        terms: ['専門性', 'キャリア', 'スキル', 'クライアント', '責任'],
        concerns: ['専門知識', '信頼', '成果', 'プレッシャー']
      },
      selfEmployed: {
        terms: ['収入', '顧客', '事業', '経営', '将来性'],
        concerns: ['不安定', '孤独', '決断', '責任']
      },
      student: {
        terms: ['授業', '単位', '就活', 'サークル', '友達'],
        concerns: ['進路', '成績', '人間関係', '将来']
      }
    };
    
    // 文章構造のテンプレート
    this.textStructures = {
      linear: {
        name: '順序立てて説明',
        pattern: ['状況説明', '問題提起', '感情表現', '質問・相談']
      },
      circular: {
        name: '堂々巡り',
        pattern: ['問題提起', '理由1', '反論', '理由2', '混乱', '元の問題']
      },
      fragmented: {
        name: '断片的',
        pattern: ['感情爆発', '状況の断片', '別の感情', '関連する記憶', '現在の混乱']
      },
      analytical: {
        name: '分析的',
        pattern: ['問題の定義', '原因分析', '影響評価', '選択肢検討', '決断の困難']
      }
    };
    
    // 言い淀み・口語表現
    this.colloquialisms = {
      hesitations: ['えっと...', 'その...', 'なんというか...', 'まあ...', 'うーん...'],
      fillers: ['〜みたいな', '〜的な', '〜っていうか', '〜というか'],
      repetitions: ['本当に本当に', 'もう、もう', 'なんか、なんか'],
      incomplete: ['でも...', 'だから...', 'つまり...', '要は...']
    };
    
    // HSP特有の表現
    this.hspExpressions = {
      sensory: ['音が気になって', '光が眩しくて', '匂いが強くて', '肌触りが'],
      emotional: ['人の感情を感じ取ってしまって', '雰囲気に圧倒されて', '共感しすぎて'],
      cognitive: ['考えすぎて', '細かいことが気になって', '深読みしてしまって'],
      physical: ['疲れやすくて', '刺激に弱くて', '休息が必要で']
    };
  }

  /**
   * リアルな悩み文章の生成
   * 
   * 目的：
   * - ユーザープロファイルに基づいた自然な文章生成
   * - 人間らしい感情表現と言語パターンの再現
   * 
   * 処理内容：
   * - プロファイル分析
   * - 文体・構造の決定
   * - 文章の組み立て
   * 
   * 出力：
   * - 200-800文字程度の自然な悩み文章
   */
  async generateWorryText(userProfile, options = {}) {
    // プロファイルの分析
    const analysisResult = this.analyzeUserProfile(userProfile);
    
    // 文体の決定
    const writingStyle = this.selectWritingStyle(analysisResult);
    
    // 文章構造の選択
    const structure = this.selectTextStructure(analysisResult);
    
    // 感情の深さ決定
    const emotionalDepth = this.determineEmotionalDepth(userProfile.worryProfile);
    
    // 文章の生成
    const generatedText = this.constructText({
      profile: userProfile,
      analysis: analysisResult,
      style: writingStyle,
      structure: structure,
      emotionalDepth: emotionalDepth,
      options: options
    });
    
    // メタデータの生成
    const metadata = {
      characterCount: generatedText.length,
      style: writingStyle.name,
      structure: structure.name,
      emotionalIntensity: emotionalDepth,
      hspInfluence: userProfile.hspTraits.isHSP,
      generatedAt: new Date().toISOString()
    };
    
    return {
      text: generatedText,
      metadata: metadata
    };
  }

  /**
   * ユーザープロファイルの分析
   */
  analyzeUserProfile(profile) {
    const age = profile.basicInfo.age;
    const ageRange = this.getAgeRange(age);
    
    return {
      ageRange: ageRange,
      gender: profile.basicInfo.gender,
      occupation: profile.basicInfo.occupation.category,
      personalityType: this.determinePersonalityType(profile.personality),
      worryThemes: profile.worryProfile.mainThemes,
      emotionalState: this.assessEmotionalState(profile),
      communicationStyle: this.determineCommunicationStyle(profile)
    };
  }

  /**
   * 文体の選択
   */
  selectWritingStyle(analysis) {
    // パーソナリティと年齢に基づいて文体を選択
    if (analysis.personalityType === 'analytical' || analysis.ageRange === '45-54' || analysis.ageRange === '55+') {
      return this.writingStyles.formal;
    } else if (analysis.personalityType === 'expressive' || analysis.ageRange === '18-24') {
      return this.writingStyles.casual;
    } else {
      return this.writingStyles.introspective;
    }
  }

  /**
   * 文章構造の選択
   */
  selectTextStructure(analysis) {
    const structures = Object.entries(this.textStructures);
    
    // パーソナリティタイプに基づいて構造を選択
    if (analysis.personalityType === 'analytical') {
      return this.textStructures.analytical;
    } else if (analysis.emotionalState.intensity > 0.7) {
      return Math.random() > 0.5 ? this.textStructures.circular : this.textStructures.fragmented;
    } else {
      return this.textStructures.linear;
    }
  }

  /**
   * 感情の深さ決定
   */
  determineEmotionalDepth(worryProfile) {
    const depthMap = {
      'surface': 'mild',
      'moderate': 'moderate',
      'deep': 'severe'
    };
    
    return depthMap[worryProfile.depthLevel] || 'moderate';
  }

  /**
   * テキストの構築
   */
  constructText(params) {
    const { profile, analysis, style, structure, emotionalDepth } = params;
    const segments = [];
    
    // 開始部分
    segments.push(this.generateOpening(style, analysis));
    
    // 構造に従って内容を生成
    structure.pattern.forEach((element, index) => {
      switch (element) {
        case '状況説明':
          segments.push(this.generateSituationDescription(profile, analysis));
          break;
        case '問題提起':
          segments.push(this.generateProblemStatement(profile, analysis));
          break;
        case '感情表現':
          segments.push(this.generateEmotionalExpression(analysis, emotionalDepth));
          break;
        case '質問・相談':
          segments.push(this.generateQuestion(style, analysis));
          break;
        case '理由1':
        case '理由2':
          segments.push(this.generateReasoning(profile, analysis, index));
          break;
        case '反論':
          segments.push(this.generateCounterArgument(analysis));
          break;
        case '混乱':
          segments.push(this.generateConfusion(analysis, emotionalDepth));
          break;
        case '感情爆発':
          segments.push(this.generateEmotionalOutburst(analysis, emotionalDepth));
          break;
        case '状況の断片':
          segments.push(this.generateFragmentedSituation(profile, analysis));
          break;
        case '関連する記憶':
          segments.push(this.generateRelatedMemory(analysis));
          break;
        case '問題の定義':
          segments.push(this.generateProblemDefinition(profile, analysis));
          break;
        case '原因分析':
          segments.push(this.generateCauseAnalysis(profile, analysis));
          break;
        case '影響評価':
          segments.push(this.generateImpactAssessment(profile, analysis));
          break;
        case '選択肢検討':
          segments.push(this.generateOptionsConsideration(profile, analysis));
          break;
        case '決断の困難':
          segments.push(this.generateDecisionDifficulty(analysis, emotionalDepth));
          break;
      }
      
      // 接続詞の追加
      if (index < structure.pattern.length - 1) {
        segments.push(this.selectConnector(style, analysis));
      }
    });
    
    // HSP特性の反映
    if (profile.hspTraits.isHSP) {
      segments.push(this.generateHSPExpression(profile.hspTraits));
    }
    
    // 終了部分
    segments.push(this.generateClosing(style, analysis));
    
    // セグメントを結合して自然な文章に
    let text = segments.join('');
    
    // 口語表現の追加
    text = this.addColloquialisms(text, analysis);
    
    // 年代別の言語特徴の適用
    text = this.applyAgeLanguageFeatures(text, analysis.ageRange);
    
    return text;
  }

  // ========== テキスト生成ヘルパーメソッド ==========

  /**
   * 開始部分の生成
   */
  generateOpening(style, analysis) {
    const patterns = style.patterns.start;
    const selected = patterns[Math.floor(Math.random() * patterns.length)];
    
    // 言い淀みを追加する可能性
    if (Math.random() < 0.3) {
      const hesitation = this.colloquialisms.hesitations[
        Math.floor(Math.random() * this.colloquialisms.hesitations.length)
      ];
      return hesitation + selected;
    }
    
    return selected;
  }

  /**
   * 状況説明の生成
   */
  generateSituationDescription(profile, analysis) {
    const themes = analysis.worryThemes;
    const occupation = profile.basicInfo.occupation.specific;
    const age = profile.basicInfo.age;
    
    const templates = [
      `私は${age}歳の${occupation}です。${themes[0]}について悩んでいます。`,
      `${occupation}として働いていますが、最近${themes[0]}のことで頭がいっぱいです。`,
      `${themes[0]}と${themes[1]}の間で板挟みになっています。`,
      `ここ${profile.worryProfile.duration}ほど、${themes[0]}について考え続けています。`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * 感情表現の生成
   */
  generateEmotionalExpression(analysis, depth) {
    const primaryEmotion = this.determinePrimaryEmotion(analysis);
    const expressions = this.emotionalExpressions[primaryEmotion][depth];
    const selected = expressions[Math.floor(Math.random() * expressions.length)];
    
    const templates = [
      `正直、${selected}です。`,
      `もう${selected}で、どうしたらいいか...`,
      `${selected}という気持ちでいっぱいです。`,
      `最近は${selected}という感じが続いています。`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * 質問・相談の生成
   */
  generateQuestion(style, analysis) {
    const patterns = style.patterns.end;
    const worryTheme = analysis.worryThemes[0];
    
    const questions = [
      `このような${worryTheme}について、どう考えたらいいでしょうか？`,
      `私はどうすべきなのでしょうか。`,
      `こんな状況から抜け出すには、何から始めればいいですか？`,
      `同じような経験をされた方はいらっしゃいますか？`
    ];
    
    const question = questions[Math.floor(Math.random() * questions.length)];
    const ending = patterns[Math.floor(Math.random() * patterns.length)];
    
    return question + ending;
  }

  /**
   * HSP表現の生成
   */
  generateHSPExpression(hspTraits) {
    const traits = hspTraits.traits;
    const expressions = [];
    
    // 特性に応じた表現を選択
    traits.forEach(trait => {
      if (trait.includes('音')) {
        expressions.push(...this.hspExpressions.sensory);
      } else if (trait.includes('共感')) {
        expressions.push(...this.hspExpressions.emotional);
      } else if (trait.includes('深く')) {
        expressions.push(...this.hspExpressions.cognitive);
      }
    });
    
    if (expressions.length === 0) {
      expressions.push(...this.hspExpressions.physical);
    }
    
    const selected = expressions[Math.floor(Math.random() * expressions.length)];
    
    return `それに、私はHSP気質があるようで、${selected}、余計に疲れてしまいます。`;
  }

  /**
   * 口語表現の追加
   */
  addColloquialisms(text, analysis) {
    // 若い世代ほど口語表現を多用
    const colloquialProbability = analysis.ageRange === '18-24' ? 0.4 : 
                                 analysis.ageRange === '25-34' ? 0.2 : 0.1;
    
    if (Math.random() < colloquialProbability) {
      // フィラーの追加
      const filler = this.colloquialisms.fillers[
        Math.floor(Math.random() * this.colloquialisms.fillers.length)
      ];
      
      // 文中のランダムな位置に挿入
      const sentences = text.split('。');
      if (sentences.length > 2) {
        const insertIndex = Math.floor(Math.random() * (sentences.length - 1)) + 1;
        sentences[insertIndex] = filler + sentences[insertIndex];
        text = sentences.join('。');
      }
    }
    
    return text;
  }

  /**
   * 年代別言語特徴の適用
   */
  applyAgeLanguageFeatures(text, ageRange) {
    const features = this.ageLanguagePatterns[ageRange] || this.ageLanguagePatterns['35-44'];
    
    // 語彙の置換
    if (features.vocabulary && features.vocabulary.length > 0) {
      // ランダムに1-2個の特徴的な語彙を追加
      const vocabCount = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < vocabCount; i++) {
        const vocab = features.vocabulary[Math.floor(Math.random() * features.vocabulary.length)];
        
        // 適切な位置に語彙を挿入する処理（簡略化）
        if (vocab.includes('〜')) {
          // 文末表現
          text = text.replace(/です。/, vocab.replace('〜', '') + '。');
        }
      }
    }
    
    return text;
  }

  // ========== ユーティリティメソッド ==========

  /**
   * 年齢範囲の取得
   */
  getAgeRange(age) {
    if (age <= 24) return '18-24';
    if (age <= 34) return '25-34';
    if (age <= 44) return '35-44';
    if (age <= 54) return '45-54';
    return '55+';
  }

  /**
   * パーソナリティタイプの判定
   */
  determinePersonalityType(personality) {
    // 最も高いスコアの特性を見つける
    let highestTrait = null;
    let highestScore = 0;
    
    for (const [trait, data] of Object.entries(personality)) {
      if (data.value > highestScore) {
        highestScore = data.value;
        highestTrait = trait;
      }
    }
    
    // 特性に基づくタイプ分類
    const typeMap = {
      'openness': 'creative',
      'conscientiousness': 'analytical',
      'extraversion': 'expressive',
      'agreeableness': 'harmonious',
      'neuroticism': 'sensitive'
    };
    
    return typeMap[highestTrait] || 'balanced';
  }

  /**
   * 感情状態の評価
   */
  assessEmotionalState(profile) {
    const worryDepth = profile.worryProfile.depthLevel;
    const urgency = profile.worryProfile.urgency;
    
    const intensityMap = {
      'surface': 0.3,
      'moderate': 0.6,
      'deep': 0.9
    };
    
    return {
      intensity: intensityMap[worryDepth] || 0.5,
      urgency: urgency,
      complexity: profile.worryProfile.mainThemes.length / 3
    };
  }

  /**
   * コミュニケーションスタイルの決定
   */
  determineCommunicationStyle(profile) {
    const extraversion = profile.personality.extraversion.value;
    const agreeableness = profile.personality.agreeableness.value;
    
    if (extraversion > 0.6 && agreeableness > 0.6) {
      return 'friendly';
    } else if (extraversion < 0.4 && agreeableness < 0.4) {
      return 'reserved';
    } else if (extraversion > 0.6 && agreeableness < 0.4) {
      return 'assertive';
    } else {
      return 'balanced';
    }
  }

  /**
   * 主要な感情の決定
   */
  determinePrimaryEmotion(analysis) {
    // 悩みのテーマから主要な感情を推測
    const themes = analysis.worryThemes;
    
    if (themes.some(t => t.includes('不安') || t.includes('心配'))) {
      return 'anxiety';
    } else if (themes.some(t => t.includes('悲し') || t.includes('喪失'))) {
      return 'sadness';
    } else if (themes.some(t => t.includes('怒') || t.includes('不満'))) {
      return 'anger';
    } else {
      return 'confusion';
    }
  }

  /**
   * 接続詞の選択
   */
  selectConnector(style, analysis) {
    const connectors = style.patterns.connectors;
    return connectors[Math.floor(Math.random() * connectors.length)];
  }

  /**
   * 終了部分の生成
   */
  generateClosing(style, analysis) {
    const patterns = style.patterns.end;
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  // 以下、各構造要素の生成メソッド（簡略化）
  
  generateProblemStatement(profile, analysis) {
    const theme = analysis.worryThemes[0];
    return `問題は、${theme}をどうすればいいかということです。`;
  }
  
  generateReasoning(profile, analysis, index) {
    const reasons = [
      '一つには、将来のことを考えると不安になるからです。',
      'また、周りの人たちの期待に応えなければというプレッシャーもあります。',
      'そして、自分自身でも本当はどうしたいのかわからなくなっています。'
    ];
    return reasons[index % reasons.length];
  }
  
  generateCounterArgument(analysis) {
    return 'でも、そう簡単に決められることではないんです。';
  }
  
  generateConfusion(analysis, depth) {
    const expressions = this.emotionalExpressions.confusion[depth];
    const selected = expressions[Math.floor(Math.random() * expressions.length)];
    return `もう${selected}。`;
  }
  
  generateEmotionalOutburst(analysis, depth) {
    return 'なんでこんなことになってしまったんだろう！';
  }
  
  generateFragmentedSituation(profile, analysis) {
    return '昨日も、今日も、同じことの繰り返し...';
  }
  
  generateRelatedMemory(analysis) {
    return '前にも似たようなことがあって、あの時は...';
  }
  
  generateProblemDefinition(profile, analysis) {
    const theme = analysis.worryThemes[0];
    return `現在直面している問題は、${theme}に関することです。`;
  }
  
  generateCauseAnalysis(profile, analysis) {
    return 'この問題の原因を考えてみると、いくつかの要因が絡み合っているようです。';
  }
  
  generateImpactAssessment(profile, analysis) {
    return 'このまま放置すると、仕事にも私生活にも影響が出そうです。';
  }
  
  generateOptionsConsideration(profile, analysis) {
    return '選択肢としては、いくつか考えられますが...';
  }
  
  generateDecisionDifficulty(analysis, depth) {
    return 'どれを選んでも、完璧な答えではないような気がして、決められません。';
  }
}

// グローバル利用のためのエクスポート
window.RealisticTextGenerator = RealisticTextGenerator;