/**
 * テストデータ生成ユーティリティ
 * 
 * TDDテストケース用の多様なテストデータを生成
 * 4つのアーキタイプバランス、64卦多様性確保、統計的検証に対応
 */

class TestDataGenerator {
  constructor() {
    // アーキタイプ別テストパターン
    this.archetypePatterns = {
      creation: {
        temporal: ['始める', '新しい', '初めて', 'スタート', '立ち上げ', '創造', '誕生'],
        emotional: ['不安', '期待', 'わくわく', '迷い', '決意', '希望', '緊張'],
        contextual: ['挑戦', '未知', '可能性', '準備', '計画', '夢', '目標']
      },
      development: {
        temporal: ['続ける', '成長', '拡大', '進める', '発展', '向上', '継続'],
        emotional: ['焦り', '充実', '疲れ', '手応え', '達成感', '満足', '安定'],
        contextual: ['協力', '競争', '調整', '改善', '最適化', '学習', '経験']
      },
      transformation: {
        temporal: ['変える', '転換', '革命', '変革', '刷新', '一新', '転機'],
        emotional: ['恐れ', '覚悟', '解放', '混乱', '希望', '不安', '決断'],
        contextual: ['破壊', '再構築', '革新', '脱却', '新天地', '転身', '改革']
      },
      maturity: {
        temporal: ['完成', '達成', '終わり', '振り返り', '次へ', '完了', '卒業'],
        emotional: ['満足', '虚無', '感謝', '物足りなさ', '新たな渇望', '平静', '充実'],
        contextual: ['総括', '継承', '引き継ぎ', '遺産', '循環', '次世代', '伝承']
      }
    };

    // 軽微変化vs根本変革の判定パターン
    this.changeIntensityPatterns = {
      minor: {
        prefixes: ['少し', 'ちょっと', 'なんとなく', 'もしかしたら', 'できれば'],
        contexts: ['検討', '考える', '思う', '予定', '希望', '興味', '関心'],
        examples: [
          '転職を少し考えています',
          '副業を始めようかと思います',
          '資格取得を検討中です',
          '部署異動があるかもしれません',
          '新しいスキルを身につけたいです'
        ]
      },
      major: {
        intensifiers: ['完全に', '根本的に', '全く', '思い切って', '決意して'],
        actions: ['変える', '辞める', '始める', '移住する', '起業する'],
        examples: [
          '会社を辞めて起業します。人生を変えたい',
          '離婚して新しい人生をスタートします',
          '故郷を離れ、全く新しい環境で生活を始めます',
          'すべてを捨てて、本当にやりたいことに挑戦します'
        ]
      }
    };

    // 64卦の分類データ
    this.hexagramArchetypes = {
      creation: [1, 2, 3, 4], // 乾坤屯蒙
      development: [5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 19, 20, 22, 25, 26, 27, 30, 31, 32, 34, 35, 37, 42, 45, 46, 48, 52, 53, 57, 58, 60, 61, 62], // 需訟師比等
      transformation: [12, 18, 21, 23, 24, 28, 29, 33, 36, 38, 39, 40, 41, 43, 44, 47, 49, 50, 51, 54, 56, 59], // 否蠱噬嗑等
      maturity: [55, 63, 64] // 豊既済未済
    };
  }

  /**
   * バランスの取れたアーキタイプテストケース生成
   */
  generateBalancedArchetypeTests(count) {
    const testsPerArchetype = Math.floor(count / 4);
    const tests = [];
    
    Object.keys(this.archetypePatterns).forEach(archetype => {
      for (let i = 0; i < testsPerArchetype; i++) {
        tests.push(this.createArchetypeTest(archetype, i));
      }
    });

    // 残りの数を埋める
    const remaining = count - tests.length;
    for (let i = 0; i < remaining; i++) {
      const randomArchetype = Object.keys(this.archetypePatterns)[i % 4];
      tests.push(this.createArchetypeTest(randomArchetype, i + testsPerArchetype));
    }

    return this.shuffleArray(tests);
  }

  /**
   * 特定アーキタイプのテストケース生成
   */
  createArchetypeTest(archetype, variation = 0) {
    const patterns = this.archetypePatterns[archetype];
    
    const temporal = this.getRandomElement(patterns.temporal);
    const emotional = this.getRandomElement(patterns.emotional);
    const contextual = this.getRandomElement(patterns.contextual);
    
    const templates = [
      `${temporal}ことに${emotional}を感じながら、${contextual}について考えています`,
      `${contextual}の場面で${temporal}必要があり、${emotional}な気持ちです`,
      `${emotional}な状況の中で、${temporal}ことで${contextual}を目指しています`,
      `${contextual}に向けて${temporal}段階にあり、${emotional}を覚えています`
    ];
    
    const template = templates[variation % templates.length];
    
    return {
      text: template,
      expectedArchetype: archetype,
      metadata: {
        temporal: temporal,
        emotional: emotional,
        contextual: contextual,
        variation: variation
      }
    };
  }

  /**
   * 軽微変化テストケース生成
   */
  generateMinorChangeTests(count = 20) {
    const tests = [];
    const { minor } = this.changeIntensityPatterns;
    
    for (let i = 0; i < count; i++) {
      if (i < minor.examples.length) {
        tests.push({
          text: minor.examples[i],
          expectedArchetype: 'development',
          expectedTransformation: false,
          changeIntensity: 'minor'
        });
      } else {
        // 動的生成
        const prefix = this.getRandomElement(minor.prefixes);
        const context = this.getRandomElement(minor.contexts);
        const action = this.getRandomElement(this.archetypePatterns.development.temporal);
        
        tests.push({
          text: `${prefix}${action}ことを${context}しています`,
          expectedArchetype: 'development',
          expectedTransformation: false,
          changeIntensity: 'minor'
        });
      }
    }
    
    return tests;
  }

  /**
   * 根本変革テストケース生成
   */
  generateMajorTransformationTests(count = 15) {
    const tests = [];
    const { major } = this.changeIntensityPatterns;
    
    for (let i = 0; i < count; i++) {
      if (i < major.examples.length) {
        tests.push({
          text: major.examples[i],
          expectedArchetype: 'transformation',
          expectedTransformation: true,
          changeIntensity: 'major'
        });
      } else {
        // 動的生成
        const intensifier = this.getRandomElement(major.intensifiers);
        const action = this.getRandomElement(major.actions);
        const context = this.getRandomElement(this.archetypePatterns.transformation.contextual);
        
        tests.push({
          text: `${intensifier}${action}ことで${context}を実現します`,
          expectedArchetype: 'transformation',
          expectedTransformation: true,
          changeIntensity: 'major'
        });
      }
    }
    
    return tests;
  }

  /**
   * 64卦多様性確保のための状況分析生成
   */
  generateDiverseSituationAnalyses(count) {
    const analyses = [];
    const hexagramsPerGeneration = Math.ceil(64 / count * 2); // 余裕を持って生成
    
    for (let i = 0; i < count; i++) {
      // 各卦をターゲットとする分析を生成
      const targetHexagram = (i % 64) + 1;
      const archetype = this.getArchetypeForHexagram(targetHexagram);
      
      analyses.push(this.createSituationAnalysisForHexagram(targetHexagram, archetype));
    }
    
    return analyses;
  }

  /**
   * 特定卦をターゲットとする状況分析生成
   */
  createSituationAnalysisForHexagram(hexagramNumber, archetype) {
    const analysis = {
      essence: {
        archetype: archetype,
        temporalState: this.getTemporalStateForHexagram(hexagramNumber),
        dynamicBalance: this.getDynamicBalanceForHexagram(hexagramNumber),
        relationalFocus: this.getRandomElement(['self-focused', 'other-focused', 'balanced'])
      },
      transformation: {
        from: {
          emotional: this.getRandomElement(['content', 'struggling', 'uncertain', 'motivated']),
          relational: this.getRandomElement(['isolated', 'connected', 'seeking'])
        },
        to: {
          growth: Math.random() > 0.5,
          transformation: archetype === 'transformation',
          stability: archetype === 'maturity'
        },
        obstacles: this.generateObstacles(),
        resources: this.generateResources()
      },
      metadata: {
        confidence: 0.6 + Math.random() * 0.4,
        complexity: Math.random(),
        urgency: Math.random(),
        targetHexagram: hexagramNumber
      }
    };

    // formatForIChingMapping メソッドを追加
    analysis.formatForIChingMapping = () => analysis;
    
    return analysis;
  }

  /**
   * 希少卦ターゲット分析生成
   */
  createRareHexagramTargetAnalysis(hexagramNumber) {
    const archetype = this.getArchetypeForHexagram(hexagramNumber);
    
    return {
      essence: {
        archetype: archetype,
        temporalState: 'present-focused',
        dynamicBalance: 'seeking-balance',
        relationalFocus: 'balanced'
      },
      transformation: {
        from: { emotional: 'content', relational: 'connected' },
        to: { growth: true, transformation: false, stability: true },
        obstacles: [],
        resources: [{ type: 'internal', strength: 'high' }]
      },
      metadata: {
        confidence: 0.8,
        complexity: 0.3,
        urgency: 0.2,
        targetHexagram: hexagramNumber,
        rareHexagramTarget: true
      },
      formatForIChingMapping: function() { return this; }
    };
  }

  /**
   * 同一アーキタイプテスト生成
   */
  generateSameArchetypeTests(count, archetype) {
    const tests = [];
    
    for (let i = 0; i < count; i++) {
      tests.push(this.createSituationAnalysisForHexagram(
        this.getRandomHexagramForArchetype(archetype),
        archetype
      ));
    }
    
    return tests;
  }

  /**
   * ユーザーフレンドリーテキスト生成
   */
  generateUserFriendlyTestTexts(count) {
    const templates = [
      '新しい仕事を始めて、期待と不安でいっぱいです',
      '長年の夢だった資格を取得し、次のステップを考えています',
      '人間関係で悩んでいて、どう対処すべきか迷っています',
      '転職を考えていますが、家族のことも心配です',
      'プロジェクトが成功し、次の目標を設定したいです',
      '健康問題で生活スタイルを見直す必要があります',
      '子供の進学で家計を見直しています',
      '新しい趣味を始めて充実した日々を送っています',
      '昇進の話があり、責任の重さを感じています',
      '引っ越しを検討していて、新しい環境への期待があります'
    ];
    
    const texts = [];
    for (let i = 0; i < count; i++) {
      texts.push(templates[i % templates.length]);
    }
    
    return texts;
  }

  /**
   * 包括的テスト生成（100人テスト用）
   */
  generateComprehensiveTests(count) {
    const tests = [];
    const archetypeDistribution = [25, 25, 25, 25]; // 均等分布
    
    let currentIndex = 0;
    Object.keys(this.archetypePatterns).forEach((archetype, archetypeIndex) => {
      const testsForArchetype = archetypeDistribution[archetypeIndex];
      
      for (let i = 0; i < testsForArchetype; i++) {
        const test = this.createArchetypeTest(archetype, i);
        tests.push({
          ...test,
          userSatisfactionScore: 3.5 + Math.random() * 1.5, // 3.5-5.0
          diversityScore: 3.0 + Math.random() * 2.0, // 3.0-5.0
          index: currentIndex++
        });
      }
    });
    
    return this.shuffleArray(tests);
  }

  /**
   * 品質保証テスト生成
   */
  generateQualityAssuranceTests(count) {
    const tests = [];
    
    // アーキタイプバランステスト
    const balancedTests = this.generateBalancedArchetypeTests(count * 0.6);
    
    // エッジケーステスト
    const edgeTests = this.generateEdgeCaseTests(count * 0.2);
    
    // 複雑度テスト
    const complexityTests = this.generateComplexityTests(count * 0.2);
    
    return [...balancedTests, ...edgeTests, ...complexityTests];
  }

  /**
   * エッジケーステスト生成
   */
  generateEdgeCaseTests(count) {
    const edgeCases = [
      { text: '', expectedArchetype: null, isEdgeCase: true },
      { text: 'あ', expectedArchetype: null, isEdgeCase: true },
      { text: '今日はいい天気ですね。散歩でもしましょうか。', expectedArchetype: 'development', isEdgeCase: true },
      { text: '！@#$%^&*()', expectedArchetype: null, isEdgeCase: true },
      { text: '同じ単語を繰り返します。同じ単語を繰り返します。同じ単語を繰り返します。', expectedArchetype: 'development', isEdgeCase: true }
    ];
    
    const tests = [];
    for (let i = 0; i < count; i++) {
      tests.push(edgeCases[i % edgeCases.length]);
    }
    
    return tests;
  }

  /**
   * 複雑度テスト生成
   */
  generateComplexityTests(count) {
    const complexTexts = [
      '転職を考えているが、家族との関係、経済的状況、将来への不安、現在の職場での人間関係、スキルアップの必要性、住宅ローンの問題、子供の教育費、両親の介護問題が複雑に絡み合っている',
      '新しい事業を立ち上げたいという夢があるが、資金調達、市場分析、競合他社との差別化、チーム構築、技術開発、マーケティング戦略、法的な問題、リスク管理など考慮すべき要素が山積みだ',
      '結婚について真剣に考えているが、相手の家族との関係、経済的な準備、住む場所の問題、仕事の両立、将来の子供のこと、価値観の違い、お互いの成長、周囲の期待など様々な要因を検討している'
    ];
    
    const tests = [];
    for (let i = 0; i < count; i++) {
      tests.push({
        text: complexTexts[i % complexTexts.length],
        expectedArchetype: 'transformation',
        complexity: 'high',
        expectedComplexity: 0.8 + Math.random() * 0.2
      });
    }
    
    return tests;
  }

  /**
   * 検証テスト生成
   */
  generateValidationTests(count) {
    const tests = [];
    
    // 確実に判定できるテストケース
    const certainTests = [
      { text: '会社を設立し、新しい事業を始めます', expectedArchetype: 'creation', certainty: 'high' },
      { text: '現在のプロジェクトを着実に進めています', expectedArchetype: 'development', certainty: 'high' },
      { text: '人生を根本的に変える決断をしました', expectedArchetype: 'transformation', certainty: 'high' },
      { text: '長年の目標を達成し、次の段階を考えています', expectedArchetype: 'maturity', certainty: 'high' }
    ];
    
    // 曖昧なテストケース
    const ambiguousTests = [
      { text: '何かを始めたいと思っています', expectedArchetype: 'creation', certainty: 'low' },
      { text: '変化が必要かもしれません', expectedArchetype: 'development', certainty: 'low' },
      { text: 'いろいろ考えています', expectedArchetype: null, certainty: 'very_low' }
    ];
    
    for (let i = 0; i < count; i++) {
      if (i < count * 0.7) {
        // 70%は確実なテスト
        tests.push(certainTests[i % certainTests.length]);
      } else {
        // 30%は曖昧なテスト
        tests.push(ambiguousTests[i % ambiguousTests.length]);
      }
    }
    
    return tests;
  }

  // ヘルパーメソッド

  getArchetypeForHexagram(hexagramNumber) {
    for (const [archetype, hexagrams] of Object.entries(this.hexagramArchetypes)) {
      if (hexagrams.includes(hexagramNumber)) {
        return archetype;
      }
    }
    return 'development'; // デフォルト
  }

  getRandomHexagramForArchetype(archetype) {
    const hexagrams = this.hexagramArchetypes[archetype];
    return this.getRandomElement(hexagrams);
  }

  getTemporalStateForHexagram(hexagramNumber) {
    const temporalStates = ['future-oriented', 'present-focused', 'transitional', 'past-oriented'];
    return temporalStates[hexagramNumber % 4];
  }

  getDynamicBalanceForHexagram(hexagramNumber) {
    const balances = ['strong-drive', 'strong-resistance', 'seeking-balance', 'neutral'];
    return balances[hexagramNumber % 4];
  }

  generateObstacles() {
    const obstacles = [
      { type: 'internal', description: '自己不信', strength: 'medium' },
      { type: 'external', description: '時間不足', strength: 'high' },
      { type: 'relational', description: '家族の反対', strength: 'low' }
    ];
    
    return obstacles.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  generateResources() {
    const resources = [
      { type: 'internal', description: '強い意志', strength: 'high' },
      { type: 'external', description: '十分な資金', strength: 'medium' },
      { type: 'relational', description: '友人のサポート', strength: 'high' }
    ];
    
    return resources.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  createStandardAnalysis() {
    return this.createSituationAnalysisForHexagram(1, 'creation');
  }

  createTransformationAnalysis() {
    return this.createSituationAnalysisForHexagram(49, 'transformation');
  }

  getBaselineScore(hexagramNumber, analysis) {
    // ベースラインスコア計算（希少卦ボーナス前）
    let score = 0;
    
    // アーキタイプマッチ
    const hexagramArchetype = this.getArchetypeForHexagram(hexagramNumber);
    if (hexagramArchetype === analysis.essence.archetype) {
      score += 20; // 調整後の重み
    }
    
    // 基本スコア（dynamics, transformationFit等）
    score += 40; // 平均的な追加スコア
    
    return score;
  }
}

module.exports = TestDataGenerator;