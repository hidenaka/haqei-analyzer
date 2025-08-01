/**
 * IchingMetaphorEngine.js - HAQEI易経メタファーエンジン
 * 
 * 仮想人格の複雑な行動パターンを易経の智慧で解説・物語化するエンジン
 * - 64卦との対応関係構築
 * - OS関係性の易経的解釈
 * - メタファー物語の動的生成
 * - 行動指針の易経ベース提供
 * 
 * @version 1.0.0
 * @date 2025-07-31
 */

class IchingMetaphorEngine {
  constructor(virtualPersonality) {
    this.virtualPersonality = virtualPersonality;
    this.engineOS = virtualPersonality.engineOS;
    this.interfaceOS = virtualPersonality.interfaceOS;
    this.safeModeOS = virtualPersonality.safeModeOS;
    
    // 易経データベース（簡略版）
    this.hexagramDatabase = this.initializeHexagramDatabase();
    this.trigramMeanings = this.initializeTrigramMeanings();
    
    // メタファー生成システム
    this.metaphorTemplates = this.loadMetaphorTemplates();
    this.narrativePatterns = this.loadNarrativePatterns();
    this.actionGuidancePatterns = this.loadActionGuidancePatterns();
    
    // 生成済みメタファーの管理
    this.generatedMetaphors = {
      personalityOverview: null,
      osRelationships: {},
      behaviorPatterns: {},
      lifeGuidance: null
    };
    
    // 易経的解釈の深度設定
    this.interpretationDepth = 'comprehensive'; // 'basic', 'standard', 'comprehensive'
    this.metaphorStyle = 'narrative'; // 'symbolic', 'narrative', 'practical'
    
    console.log('🔮 IchingMetaphorEngine initialized');
    
    // 初期化フラグ
    this.isInitialized = false;
    
    // 初期メタファー生成（非同期）
    this.initializationPromise = this.generateInitialMetaphors();
  }

  /**
   * 64卦データベースの初期化（簡略版）
   */
  initializeHexagramDatabase() {
    return {
      1: { name: '乾', meaning: '創造力・天の力', element: '天', attributes: ['創造', '強固', '持続'] },
      2: { name: '坤', meaning: '受容力・地の力', element: '地', attributes: ['受容', '育成', '支援'] },
      3: { name: '屯', meaning: '困難の始まり', element: '水雷', attributes: ['新生', '困難', '成長'] },
      4: { name: '蒙', meaning: '学びの段階', element: '山水', attributes: ['学習', '無知', '発見'] },
      5: { name: '需', meaning: '待つ時', element: '水天', attributes: ['忍耐', '準備', '時機'] },
      6: { name: '訟', meaning: '争いと対立', element: '天水', attributes: ['対立', '正義', '解決'] },
      7: { name: '師', meaning: '統率と組織', element: '地水', attributes: ['統率', '規律', '協力'] },
      8: { name: '比', meaning: '協調と団結', element: '水地', attributes: ['協調', '団結', '親密'] },
      // ... 他の卦も必要に応じて追加
      14: { name: '大有', meaning: '大いなる所有', element: '火天', attributes: ['豊かさ', '成功', '責任'] },
      17: { name: '随', meaning: '従うこと', element: '沢雷', attributes: ['追随', '適応', '柔軟'] },
      23: { name: '剥', meaning: '剥落と変化', element: '山地', attributes: ['変化', '削減', '本質'] },
      29: { name: '坎', meaning: '危険な深み', element: '水', attributes: ['危険', '深さ', '流動'] },
      30: { name: '離', meaning: '明るい火', element: '火', attributes: ['明晰', '美', '分離'] },
      31: { name: '咸', meaning: '感応', element: '沢山', attributes: ['感応', '魅力', '相互作用'] },
      32: { name: '恒', meaning: '持続', element: '雷風', attributes: ['持続', '恒常', '忍耐'] },
      50: { name: '鼎', meaning: '変革の器', element: '火風', attributes: ['変革', '創造', '文化'] },
      64: { name: '未済', meaning: '未だ成らず', element: '火水', attributes: ['未完', '可能性', '進歩'] }
    };
  }

  /**
   * 八卦の意味の初期化
   */
  initializeTrigramMeanings() {
    return {
      '乾': { element: '天', qualities: ['創造性', '強さ', '指導力'], direction: '南' },
      '坤': { element: '地', qualities: ['受容性', '母性', '安定'], direction: '北' },
      '震': { element: '雷', qualities: ['行動力', '発動', '突破'], direction: '東' },
      '巽': { element: '風', qualities: ['柔軟性', '浸透', '影響'], direction: '南東' },
      '坎': { element: '水', qualities: ['流動性', '深さ', '危険'], direction: '北' },
      '離': { element: '火', qualities: ['明晰性', '美', '認識'], direction: '南' },
      '艮': { element: '山', qualities: ['安定性', '静止', '瞑想'], direction: '北東' },
      '兌': { element: '沢', qualities: ['喜び', '表現', '交流'], direction: '西' }
    };
  }

  /**
   * メタファーテンプレートの読み込み
   */
  loadMetaphorTemplates() {
    return {
      personalityIntroduction: [
        "あなたの心の奥深くには、古代中国の智慧である易経の{hexagram}の卦が宿っています",
        "易経の{hexagram}が示すように、あなたの内面には{qualities}という特質が流れています",
        "あなたという人格は、易経でいう{hexagram}の象徴そのものです"
      ],
      osRelationship: [
        "{os1}と{os2}の関係は、易経の{metaphor}のような相互作用を見せています",
        "あなたの{os1}と{os2}は、まるで{metaphor}のように{relationship}しています",
        "{os1}と{os2}の間には、易経が教える{metaphor}の智慧が働いています"
      ],
      behaviorPrediction: [
        "この状況では、{hexagram}の教えに従って{behavior}することでしょう",
        "易経の{hexagram}が示すように、あなたは{behavior}という道を選ぶでしょう",
        "{hexagram}の智慧を体現するかのように、{behavior}へと向かいます"
      ],
      lifeGuidance: [
        "人生の道筋において、{hexagram}は{guidance}を示しています",
        "易経の{hexagram}があなたに{guidance}という智慧を授けています",
        "古代の智慧{hexagram}は、{guidance}の重要性を教えています"
      ]
    };
  }

  /**
   * 物語パターンの読み込み
   */
  loadNarrativePatterns() {
    return {
      heroJourney: {
        beginning: "あなたの物語は{hexagram}の始まりから出発します",
        middle: "人生の中程で、{challenges}という試練に直面し",
        climax: "{transformation}という大きな変化を迎え",
        resolution: "最終的に{wisdom}という智慧を獲得します"
      },
      cyclicPattern: {
        spring: "{hexagram}は新しい始まりの季節を表しています",
        summer: "成長と拡大の時期に{development}が起こります",
        autumn: "収穫と成熟の段階で{achievements}を得ます",
        winter: "内省と準備の時を通じて{preparation}します"
      },
      harmonicPattern: {
        thesis: "あなたの{os1}は{position1}という立場を取り",
        antithesis: "一方で{os2}は{position2}という対立する見解を持ち",
        synthesis: "最終的に{integration}という統合された智慧に到達します"
      }
    };
  }

  /**
   * 行動指針パターンの読み込み
   */
  loadActionGuidancePatterns() {
    return {
      immediate: [
        "今すぐ{action}することで、{hexagram}の智慧を実践できます",
        "{hexagram}の教えに従い、まず{action}から始めましょう",
        "易経の{hexagram}は、{action}という第一歩を示しています"
      ],
      shortTerm: [
        "短期的には、{hexagram}の智慧に基づいて{strategy}を実行します",
        "数週間から数ヶ月にかけて、{strategy}というアプローチを取りましょう",
        "{hexagram}は{period}という期間での{strategy}を推奨しています"
      ],
      longTerm: [
        "長期的な視点では、{hexagram}は{vision}という方向性を示しています",
        "人生の大きな流れにおいて、{vision}を目指すことが重要です",
        "易経の{hexagram}は、{vision}という人生の理想を描いています"
      ]
    };
  }

  /**
   * 初期メタファーの生成
   */
  async generateInitialMetaphors() {
    console.log('🎭 Generating initial I Ching metaphors...');
    
    try {
      // 人格全体のメタファー
      this.generatedMetaphors.personalityOverview = await this.generatePersonalityMetaphor();
      
      // OS間関係性のメタファー
      this.generatedMetaphors.osRelationships = await this.generateOSRelationshipMetaphors();
      
      // 行動パターンのメタファー
      this.generatedMetaphors.behaviorPatterns = await this.generateBehaviorPatternMetaphors();
      
      // 人生指針のメタファー
      this.generatedMetaphors.lifeGuidance = await this.generateLifeGuidanceMetaphor();
      
      console.log('✅ Initial metaphors generated successfully');
      this.isInitialized = true;
      
    } catch (error) {
      console.error('❌ Error generating initial metaphors:', error);
      this.generateFallbackMetaphors();
      this.isInitialized = true;
    }
  }

  /**
   * 人格全体のメタファー生成
   */
  async generatePersonalityMetaphor() {
    const dominantOS = this.virtualPersonality.personalityState.currentDominantOS;
    const harmony = this.virtualPersonality.personalityState.internalHarmony;
    
    // 主導OSに基づく代表的な卦を選択
    let primaryHexagram;
    switch (dominantOS) {
      case 'engine':
        primaryHexagram = harmony > 0.7 ? 1 : harmony > 0.4 ? 14 : 29; // 乾/大有/坎
        break;
      case 'interface':
        primaryHexagram = harmony > 0.7 ? 31 : harmony > 0.4 ? 8 : 6; // 咸/比/訟
        break;
      case 'safemode':
        primaryHexagram = harmony > 0.7 ? 32 : harmony > 0.4 ? 23 : 3; // 恒/剥/屯
        break;
      default:
        primaryHexagram = 64; // 未済
    }
    
    const hexagram = this.hexagramDatabase[primaryHexagram];
    if (!hexagram) {
      return this.generateFallbackPersonalityMetaphor();
    }
    
    // メタファー物語の構築
    const metaphor = {
      primaryHexagram: {
        id: primaryHexagram,
        name: hexagram.name,
        meaning: hexagram.meaning,
        attributes: hexagram.attributes
      },
      narrative: this.constructPersonalityNarrative(hexagram, dominantOS, harmony),
      symbolicMeaning: this.extractSymbolicMeaning(hexagram, dominantOS),
      practicalApplication: this.generatePracticalApplication(hexagram),
      seasonalAspect: this.mapToSeasonalCycle(hexagram),
      elementalBalance: this.analyzeElementalBalance(hexagram)
    };
    
    return metaphor;
  }

  /**
   * 人格物語の構築
   */
  constructPersonalityNarrative(hexagram, dominantOS, harmony) {
    const templates = this.metaphorTemplates.personalityIntroduction;
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    const narrative = template
      .replace('{hexagram}', `${hexagram.name}（${hexagram.meaning}）`)
      .replace('{qualities}', hexagram.attributes.join('と'));
    
    // 調和度に基づく追加説明
    let harmonyDescription;
    if (harmony > 0.7) {
      harmonyDescription = `この${hexagram.name}の力は、あなたの3つのOS人格が調和的に統合されることで、より純粋で力強い形で発現しています。`;
    } else if (harmony > 0.4) {
      harmonyDescription = `${hexagram.name}のエネルギーは、時として内面の複雑さと相まって、独特な深みと多面性を生み出しています。`;
    } else {
      harmonyDescription = `${hexagram.name}の智慧は、内なる対話と成長を通じて、より統合された形で現れようとしています。`;
    }
    
    return {
      introduction: narrative,
      harmonyAspect: harmonyDescription,
      osIntegration: this.describeOSIntegration(hexagram, dominantOS)
    };
  }

  /**
   * OS統合の描写
   */
  describeOSIntegration(hexagram, dominantOS) {
    const osDescriptions = {
      engine: `あなたの価値観OS（Engine）が${hexagram.name}の核心的エネルギーを体現し`,
      interface: `あなたの社会的OS（Interface）が${hexagram.name}の表現力を通じて`,
      safemode: `あなたの防御OS（SafeMode）が${hexagram.name}の慎重な智慧を活かして`
    };
    
    return `${osDescriptions[dominantOS]}、他の2つのOSとの絶妙なバランスを保ちながら、あなた独自の人格パターンを創り出しています。`;
  }

  /**
   * OS関係性メタファーの生成
   */
  async generateOSRelationshipMetaphors() {
    const relationships = {};
    
    // Engine-Interface関係性
    relationships['engine-interface'] = await this.generatePairRelationshipMetaphor('engine', 'interface');
    
    // Engine-SafeMode関係性
    relationships['engine-safemode'] = await this.generatePairRelationshipMetaphor('engine', 'safemode');
    
    // Interface-SafeMode関係性
    relationships['interface-safemode'] = await this.generatePairRelationshipMetaphor('interface', 'safemode');
    
    return relationships;
  }

  /**
   * ペア関係性メタファーの生成
   */
  async generatePairRelationshipMetaphor(osType1, osType2) {
    const relationshipEngine = this.virtualPersonality.relationshipEngine;
    const key = `${osType1}-${osType2}`;
    
    // 関係性データを取得
    let relationshipData;
    if (relationshipEngine && relationshipEngine.relationshipMatrix) {
      relationshipData = relationshipEngine.relationshipMatrix[key];
    }
    
    if (!relationshipData) {
      return this.generateFallbackRelationshipMetaphor(osType1, osType2);
    }
    
    // 関係性の性質に基づく易経的解釈
    const metaphor = this.selectRelationshipMetaphor(relationshipData, osType1, osType2);
    
    return {
      relationship: key,
      metaphor: metaphor,
      narrative: this.constructRelationshipNarrative(metaphor, osType1, osType2, relationshipData),
      guidance: this.generateRelationshipGuidance(metaphor, relationshipData),
      evolutionPotential: this.assessRelationshipEvolution(relationshipData)
    };
  }

  /**
   * 関係性メタファーの選択
   */
  selectRelationshipMetaphor(relationshipData, osType1, osType2) {
    const compatibility = relationshipData.compatibility || 0.5;
    const conflict = relationshipData.conflict || 0.3;
    const cooperation = relationshipData.cooperation || 0.5;
    
    // 関係性パターンに基づくメタファー選択
    if (compatibility > 0.7 && cooperation > 0.7) {
      return {
        type: 'harmony',
        hexagram: 31, // 咸（感応）
        description: '互いに感応し合う関係',
        element: '沢山',
        qualities: ['調和', '相互理解', '自然な協力']
      };
    } else if (conflict > 0.6) {
      return {
        type: 'tension',
        hexagram: 6, // 訟（争い）
        description: '建設的な緊張関係',
        element: '天水',
        qualities: ['対立', '成長', '解決への道']
      };
    } else if (cooperation > 0.6) {
      return {
        type: 'cooperation',
        hexagram: 8, // 比（親しみ）
        description: '協力的な関係',
        element: '水地',
        qualities: ['協調', '支援', '共同歩調']
      };
    } else {
      return {
        type: 'balance',
        hexagram: 64, // 未済（未完成）
        description: '発展途上の関係',
        element: '火水',
        qualities: ['可能性', '成長', '統合への道']
      };
    }
  }

  /**
   * 関係性物語の構築
   */
  constructRelationshipNarrative(metaphor, osType1, osType2, relationshipData) {
    const hexagram = this.hexagramDatabase[metaphor.hexagram];
    const osNames = {
      engine: 'あなたの価値観システム',
      interface: 'あなたの社会的システム',
      safemode: 'あなたの防御システム'
    };
    
    const template = this.metaphorTemplates.osRelationship[0]; // 簡略化
    
    return template
      .replace('{os1}', osNames[osType1])
      .replace('{os2}', osNames[osType2])
      .replace('{metaphor}', `${hexagram.name}（${hexagram.meaning}）`)
      .replace('{relationship}', metaphor.description);
  }

  /**
   * 行動パターンメタファーの生成
   */
  async generateBehaviorPatternMetaphors() {
    const patterns = {};
    
    // 典型的な状況でのパターン
    const situations = [
      'ストレス下での反応',
      '新しい挑戦への対処',
      '対人関係での行動',
      '重要な決定時の傾向'
    ];
    
    for (const situation of situations) {
      patterns[situation] = await this.generateBehaviorMetaphor(situation);
    }
    
    return patterns;
  }

  /**
   * 個別行動メタファーの生成
   */
  async generateBehaviorMetaphor(situation) {
    const dominantOS = this.virtualPersonality.personalityState.currentDominantOS;
    const adaptability = this.virtualPersonality.personalityState.adaptabilityIndex || 0.5;
    
    // 状況とOS特性に基づく卦の選択
    let hexagramId;
    if (situation.includes('ストレス')) {
      hexagramId = adaptability > 0.6 ? 32 : 29; // 恒 or 坎
    } else if (situation.includes('挑戦')) {
      hexagramId = dominantOS === 'engine' ? 1 : 17; // 乾 or 随
    } else if (situation.includes('対人関係')) {
      hexagramId = 31; // 咸
    } else {
      hexagramId = 50; // 鼎
    }
    
    const hexagram = this.hexagramDatabase[hexagramId];
    
    return {
      situation,
      hexagram: {
        id: hexagramId,
        name: hexagram.name,
        meaning: hexagram.meaning
      },
      prediction: this.generateBehaviorPrediction(situation, hexagram),
      guidance: this.generateSituationalGuidance(situation, hexagram),
      timing: this.suggestOptimalTiming(hexagram)
    };
  }

  /**
   * 人生指針メタファーの生成
   */
  async generateLifeGuidanceMetaphor() {
    const personalityType = this.virtualPersonality.personalityMetadata?.personalityType || '標準型';
    const overallCoherence = this.virtualPersonality.personalityState.overallCoherence || 0.5;
    
    // 人格タイプと統合レベルに基づく指針卦の選択
    let guidanceHexagram;
    if (overallCoherence > 0.8) {
      guidanceHexagram = 14; // 大有（大いなる所有）
    } else if (overallCoherence > 0.6) {
      guidanceHexagram = 50; // 鼎（変革の器）
    } else {
      guidanceHexagram = 64; // 未済（未だ成らず）
    }
    
    const hexagram = this.hexagramDatabase[guidanceHexagram];
    
    return {
      guidanceHexagram: {
        id: guidanceHexagram,
        name: hexagram.name,
        meaning: hexagram.meaning,
        attributes: hexagram.attributes
      },
      lifePhilosophy: this.extractLifePhilosophy(hexagram),
      actionPrinciples: this.generateActionPrinciples(hexagram),
      timelineGuidance: this.generateTimelineGuidance(hexagram),
      spiritualAspect: this.extractSpiritualAspect(hexagram)
    };
  }

  /**
   * フォールバック用の基本メタファー生成
   */
  generateFallbackMetaphors() {
    console.log('🔄 Generating fallback metaphors...');
    
    this.generatedMetaphors = {
      personalityOverview: {
        primaryHexagram: { id: 64, name: '未済', meaning: '未だ成らず' },
        narrative: { introduction: 'あなたの人格は易経の未済の卦のように、無限の可能性を秘めています' }
      },
      osRelationships: {
        'engine-interface': { metaphor: { type: 'balance', description: 'バランスの取れた関係' } },
        'engine-safemode': { metaphor: { type: 'balance', description: 'バランスの取れた関係' } },
        'interface-safemode': { metaphor: { type: 'balance', description: 'バランスの取れた関係' } }
      },
      behaviorPatterns: {
        '一般的な行動': { hexagram: { name: '未済', meaning: '成長への道' } }
      },
      lifeGuidance: {
        guidanceHexagram: { id: 64, name: '未済', meaning: '未だ成らず' },
        lifePhilosophy: '常に成長し続ける人生'
      }
    };
  }

  /**
   * 初期化完了を待つ
   */
  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initializationPromise;
    }
    return this.isInitialized;
  }

  /**
   * 生成されたメタファーの統合取得
   */
  async getIntegratedMetaphors() {
    await this.ensureInitialized();
    return {
      timestamp: new Date().toISOString(),
      personalityOverview: this.generatedMetaphors.personalityOverview,
      osRelationships: this.generatedMetaphors.osRelationships,
      behaviorPatterns: this.generatedMetaphors.behaviorPatterns,
      lifeGuidance: this.generatedMetaphors.lifeGuidance,
      practicalApplications: this.generatePracticalApplications(),
      dailyGuidance: this.generateDailyGuidance()
    };
  }

  /**
   * 実践的応用の生成
   */
  generatePracticalApplications() {
    const guidance = this.generatedMetaphors.lifeGuidance;
    if (!guidance || !guidance.guidanceHexagram) {
      return ['日々の選択において、内なる声に耳を傾けましょう'];
    }
    
    return [
      `${guidance.guidanceHexagram.name}の教えに従い、${guidance.guidanceHexagram.attributes?.[0] || '調和'}を大切にしましょう`,
      `易経の智慧を日常に活かし、バランスの取れた判断を心がけましょう`,
      `${guidance.guidanceHexagram.meaning}の精神で、現在の課題に取り組みましょう`
    ];
  }

  /**
   * 日常指針の生成
   */
  generateDailyGuidance() {
    return {
      morning: '朝の時間は、易経の智慧を心に留めて一日を始めましょう',
      afternoon: '午後の活動では、3つのOSのバランスを意識しましょう',
      evening: '夕方は内省の時間として、一日の行動を易経的に振り返りましょう'
    };
  }

  /**
   * OS関係性の易経的解説 (ドキュメント仕様実装)
   */
  explainOSRelationship(osTypeA, osTypeB) {
    console.log(`🔮 Explaining relationship between ${osTypeA} and ${osTypeB}...`);
    
    const relationshipKey = `${osTypeA}-${osTypeB}`;
    const relationshipMetaphor = this.generatedMetaphors.osRelationships[relationshipKey];
    
    if (!relationshipMetaphor) {
      return this.generateFallbackRelationshipExplanation(osTypeA, osTypeB);
    }
    
    const hexagram = this.hexagramDatabase[relationshipMetaphor.metaphor.hexagram];
    
    return {
      relationshipType: relationshipMetaphor.metaphor.type,
      hexagramReference: {
        id: relationshipMetaphor.metaphor.hexagram,
        name: hexagram?.name || '未知',
        meaning: hexagram?.meaning || '関係性の探求'
      },
      explanation: this.generateDetailedRelationshipExplanation(osTypeA, osTypeB, relationshipMetaphor),
      practicalGuidance: this.generateRelationshipGuidance(relationshipMetaphor.metaphor, relationshipMetaphor),
      seasonalAnalogy: this.mapRelationshipToSeason(relationshipMetaphor.metaphor),
      evolutionPath: this.suggestRelationshipEvolution(relationshipMetaphor)
    };
  }

  /**
   * 詳細な関係性解説の生成
   */
  generateDetailedRelationshipExplanation(osA, osB, relationshipMetaphor) {
    const osNames = {
      engine: '価値観システム',
      interface: '社会的システム',
      safemode: '防御システム'
    };

    const explanationTemplates = {
      harmony: [
        `あなたの${osNames[osA]}と${osNames[osB]}は、易経の智慧が示すように自然な調和を保っています。`,
        `この2つのシステムは互いに補完し合い、バランスの取れた判断を可能にします。`,
        `${relationshipMetaphor.metaphor.description}という関係性は、あなたの人格に安定感をもたらします。`
      ],
      tension: [
        `あなたの${osNames[osA]}と${osNames[osB]}の間には建設的な緊張関係があります。`,
        `この緊張は成長の源泉となり、より深い自己理解を促します。`,
        `易経では、このような対立は新しい智慧を生み出す力と考えられています。`
      ],
      cooperation: [
        `あなたの${osNames[osA]}と${osNames[osB]}は積極的に協力し合う関係にあります。`,
        `この協力関係により、複雑な状況でも統合された判断が可能になります。`,
        `2つのシステムが手を取り合うことで、より強い自己が現れます。`
      ]
    };

    const templates = explanationTemplates[relationshipMetaphor.metaphor.type] || explanationTemplates.harmony;
    return templates.join(' ');
  }

  /**
   * 人格物語の構築 (ドキュメント仕様実装)
   */
  createPersonalityStory() {
    console.log('📖 Creating personality story...');
    
    const personalityOverview = this.generatedMetaphors.personalityOverview;
    if (!personalityOverview) {
      return this.generateFallbackPersonalityStory();
    }

    const storyPattern = this.selectStoryPattern();
    return this.constructStoryFromPattern(storyPattern, personalityOverview);
  }

  /**
   * 物語パターンの選択
   */
  selectStoryPattern() {
    const patterns = Object.keys(this.narrativePatterns);
    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    return { type: selectedPattern, template: this.narrativePatterns[selectedPattern] };
  }

  /**
   * パターンから物語を構築
   */
  constructStoryFromPattern(storyPattern, personalityData) {
    const hexagram = personalityData.primaryHexagram;
    const osPersonalities = this.virtualPersonality.personalityState;

    switch (storyPattern.type) {
      case 'heroJourney':
        return this.createHeroJourneyStory(storyPattern.template, hexagram, osPersonalities);
      case 'cyclicPattern':
        return this.createCyclicStory(storyPattern.template, hexagram, osPersonalities);
      case 'harmonicPattern':
        return this.createHarmonicStory(storyPattern.template, hexagram, osPersonalities);
      default:
        return this.createDefaultStory(hexagram);
    }
  }

  /**
   * ヒーローズジャーニー物語の作成
   */
  createHeroJourneyStory(template, hexagram, osPersonalities) {
    const dominantOS = osPersonalities.currentDominantOS;
    const harmony = osPersonalities.internalHarmony;

    return {
      title: `${hexagram.name}の旅路`,
      narrative: {
        beginning: template.beginning.replace('{hexagram}', `${hexagram.name}（${hexagram.meaning}）`),
        middle: template.middle.replace('{challenges}', this.generateChallenges(dominantOS)),
        climax: template.climax.replace('{transformation}', this.generateTransformation(hexagram, harmony)),
        resolution: template.resolution.replace('{wisdom}', this.generateWisdom(hexagram))
      },
      personalReflection: this.generatePersonalReflection(hexagram, dominantOS),
      actionInvitation: this.generateActionInvitation(hexagram)
    };
  }

  /**
   * 循環パターン物語の作成
   */
  createCyclicStory(template, hexagram, osPersonalities) {
    return {
      title: `${hexagram.name}の四季`,
      narrative: {
        spring: template.spring.replace('{hexagram}', hexagram.name),
        summer: template.summer.replace('{development}', this.generateDevelopment(hexagram)),
        autumn: template.autumn.replace('{achievements}', this.generateAchievements(hexagram)),
        winter: template.winter.replace('{preparation}', this.generatePreparation(hexagram))
      },
      currentSeason: this.determinCurrentSeason(osPersonalities),
      nextPhaseGuidance: this.generateNextPhaseGuidance(hexagram)
    };
  }

  /**
   * 調和パターン物語の作成
   */
  createHarmonicStory(template, hexagram, osPersonalities) {
    const dominantOS = osPersonalities.currentDominantOS;
    
    return {
      title: `${hexagram.name}の調和`,
      narrative: {
        thesis: template.thesis
          .replace('{os1}', this.getOSDisplayName('engine'))
          .replace('{position1}', this.getOSPosition('engine')),
        antithesis: template.antithesis
          .replace('{os2}', this.getOSDisplayName('safemode'))
          .replace('{position2}', this.getOSPosition('safemode')),
        synthesis: template.synthesis
          .replace('{integration}', this.generateIntegration(hexagram))
      },
      harmonicLevel: osPersonalities.internalHarmony,
      balanceRecommendation: this.generateBalanceRecommendation(osPersonalities)
    };
  }

  /**
   * 易経ベース行動指針 (ドキュメント仕様実装)
   */
  generateActionGuidance() {
    console.log('🎯 Generating I Ching based action guidance...');
    
    const lifeGuidance = this.generatedMetaphors.lifeGuidance;
    if (!lifeGuidance || !lifeGuidance.guidanceHexagram) {
      return this.generateFallbackActionGuidance();
    }

    const hexagram = this.hexagramDatabase[lifeGuidance.guidanceHexagram.id];
    const personalityState = this.virtualPersonality.personalityState;

    return {
      overallPhilosophy: this.generateOverallPhilosophy(hexagram),
      immediateActions: this.generateImmediateActions(hexagram, personalityState),
      shortTermStrategy: this.generateShortTermStrategy(hexagram, personalityState),
      longTermVision: this.generateLongTermVision(hexagram, personalityState),
      situationalGuidance: this.generateSituationalGuidance(hexagram),
      warningsAndCautions: this.generateWarningsAndCautions(hexagram),
      supportiveHexagrams: this.findSupportiveHexagrams(hexagram)
    };
  }

  /**
   * 全体哲学の生成
   */
  generateOverallPhilosophy(hexagram) {
    const philosophyTemplates = {
      1: '創造の力を信じ、リーダーシップを発揮する人生を歩みましょう',
      2: '受容と支援の精神で、周囲との調和を大切にしましょう',
      29: '困難な状況でも流動性を保ち、適応力を発揮しましょう',
      64: '未完成を恐れず、常に成長し続ける姿勢を持ちましょう'
    };

    return philosophyTemplates[hexagram.id] || 
           `${hexagram.name}の智慧に従い、${hexagram.attributes[0]}を大切にする人生を歩みましょう`;
  }

  /**
   * 即座の行動指針
   */
  generateImmediateActions(hexagram, personalityState) {
    const dominantOS = personalityState.currentDominantOS;
    const actionPatterns = this.actionGuidancePatterns.immediate;
    
    const selectedPattern = actionPatterns[Math.floor(Math.random() * actionPatterns.length)];
    const action = this.generateSpecificAction(hexagram, dominantOS);
    
    return {
      primary: selectedPattern
        .replace('{action}', action)
        .replace('{hexagram}', `${hexagram.name}（${hexagram.meaning}）`),
      supportingActions: this.generateSupportingActions(hexagram, dominantOS),
      timeframe: '今日から3日以内',
      expectedOutcome: this.generateExpectedOutcome(action, hexagram)
    };
  }

  /**
   * 特定行動の生成
   */
  generateSpecificAction(hexagram, dominantOS) {
    const actionMap = {
      engine: {
        1: '価値観を明確にし、理想に向けた第一歩を踏み出す',
        2: '他者の意見を受け入れながら、自分の信念を整理する',
        29: '困難な状況でも、核となる価値観を見失わずに行動する'
      },
      interface: {
        1: '周囲との関係性を見直し、建設的な対話を始める',
        2: '協力的な姿勢で、チームや家族との絆を深める',
        29: '変化する環境に適応しながら、人間関係を維持する'
      },
      safemode: {
        1: 'リスクを適切に評価し、安全な環境で新しい挑戦を始める',
        2: '安定した基盤を築きながら、着実に成長を図る',
        29: '予期せぬ状況に備え、複数の選択肢を準備する'
      }
    };

    return actionMap[dominantOS]?.[hexagram.id] || 
           `${hexagram.attributes[0]}を意識した具体的な行動を取る`;
  }

  /**
   * 関係性の季節的類推
   */
  mapRelationshipToSeason(metaphorData) {
    const seasonMap = {
      harmony: { season: '春', description: '新しい成長と調和の季節' },
      tension: { season: '夏', description: '活発な変化と成長の季節' },
      cooperation: { season: '秋', description: '収穫と成熟の季節' },
      balance: { season: '冬', description: '内省と準備の季節' }
    };

    return seasonMap[metaphorData.type] || seasonMap.balance;
  }

  /**
   * 関係性進化の提案
   */
  suggestRelationshipEvolution(relationshipMetaphor) {
    const currentType = relationshipMetaphor.metaphor.type;
    const evolutionPaths = {
      tension: ['建設的な対話を通じて協力関係へ', '相互理解を深めて調和へ'],
      cooperation: ['より深い信頼関係の構築', '統合された判断システムの形成'],
      harmony: ['この調和を維持しつつ、新しい挑戦への準備', '安定した関係性を基盤とした成長'],
      balance: ['バランスを保ちながら、より積極的な協力関係へ']
    };

    return evolutionPaths[currentType] || ['現在の関係性を維持しつつ、さらなる深化を目指す'];
  }

  /**
   * フォールバック関係性解説
   */
  generateFallbackRelationshipExplanation(osA, osB) {
    const osNames = {
      engine: '価値観システム',
      interface: '社会的システム', 
      safemode: '防御システム'
    };

    return {
      relationshipType: 'balance',
      hexagramReference: { id: 64, name: '未済', meaning: '発展途上の関係' },
      explanation: `あなたの${osNames[osA]}と${osNames[osB]}は、現在発展途上の関係にあります。易経の未済の卦が示すように、この関係性には大きな可能性が秘められています。`,
      practicalGuidance: '両方のシステムの声に耳を傾け、対話を通じて理解を深めましょう',
      seasonalAnalogy: { season: '春', description: '新しい関係性の芽吹きの季節' },
      evolutionPath: ['相互理解を深める', 'バランスの取れた協力関係を築く']
    };
  }

  /**
   * フォールバック物語生成
   */
  generateFallbackPersonalityStory() {
    return {
      title: '未済の物語',
      narrative: {
        introduction: 'あなたの人格は易経の未済の卦のように、完成への道のりにあります',
        development: '3つのシステムが異なる視点を持ちながらも、統合に向かって成長しています',
        resolution: 'この多様性こそが、あなたの人格の豊かさと可能性を示しています'
      },
      theme: '成長と可能性',
      message: '完成ではなく、継続的な成長を大切にしましょう'
    };
  }

  /**
   * フォールバック行動指針
   */
  generateFallbackActionGuidance() {
    return {
      overallPhilosophy: '易経の智慧を日常に活かし、バランスの取れた判断を心がける',
      immediateActions: {
        primary: '今日から、内なる3つの声に耳を傾ける時間を作りましょう',
        supportingActions: ['自己対話の時間を設ける', '各システムの意見を記録する'],
        timeframe: '今日から1週間',
        expectedOutcome: '自己理解の深化'
      },
      shortTermStrategy: '1ヶ月をかけて、各システムの特徴と役割を理解する',
      longTermVision: '統合された自己として、人生の各場面で適切な判断ができるようになる',
      situationalGuidance: {
        stress: '防御システムの声を聞きつつ、価値観システムの指針も確認する',
        relationships: '社会的システムと価値観システムのバランスを取る',
        decisions: '3つのシステム全ての視点を考慮してから決断する'
      }
    };
  }

  // 追加のヘルパーメソッド
  generateChallenges(dominantOS) {
    const challengeMap = {
      engine: '理想と現実のギャップ',
      interface: '個人の思いと周囲の期待の対立',
      safemode: '安全性と成長の必要性の矛盾'
    };
    return challengeMap[dominantOS] || '人生の複雑な課題';
  }

  generateTransformation(hexagram, harmony) {
    if (harmony > 0.7) {
      return `${hexagram.name}の智慧による内的統合`;
    } else if (harmony > 0.4) {
      return `${hexagram.name}を通じた成長と変化`;
    } else {
      return `${hexagram.name}の教えによる新しい視点の獲得`;
    }
  }

  generateWisdom(hexagram) {
    return `${hexagram.name}が教える「${hexagram.attributes[0]}」の真の意味`;
  }

  getOSDisplayName(osType) {
    const names = {
      engine: '価値観システム',
      interface: '社会的システム',
      safemode: '防御システム'
    };
    return names[osType] || osType;
  }

  getOSPosition(osType) {
    const positions = {
      engine: '理想を追求し、本質的価値を重視する立場',
      interface: '調和を保ち、関係性を大切にする立場',
      safemode: '安全を確保し、リスクを管理する立場'
    };
    return positions[osType] || '中立的な立場';
  }

  /**
   * 人生哲学の抽出
   */
  extractLifePhilosophy(hexagram) {
    return `${hexagram.name}（${hexagram.meaning}）の智慧に基づく人生哲学`;
  }

  /**
   * 行動原則の生成
   */
  generateActionPrinciples(hexagram) {
    return hexagram.attributes.map(attr => `${attr}を重視した行動を心がける`);
  }

  /**
   * タイムライン指針の生成
   */
  generateTimelineGuidance(hexagram) {
    return {
      immediate: `今すぐ${hexagram.attributes[0]}に焦点を当てる`,
      shortTerm: `短期的に${hexagram.attributes[1] || hexagram.attributes[0]}を発展させる`,
      longTerm: `長期的に${hexagram.meaning}を体現する人生を築く`
    };
  }

  /**
   * 精神的側面の抽出
   */
  extractSpiritualAspect(hexagram) {
    return `${hexagram.name}の精神性を通じて、内なる統合を目指す`;
  }
}

// グローバルスコープでの利用可能化
if (typeof window !== 'undefined') {
  window.IchingMetaphorEngine = IchingMetaphorEngine;
}

console.log('✅ IchingMetaphorEngine.js loaded successfully');