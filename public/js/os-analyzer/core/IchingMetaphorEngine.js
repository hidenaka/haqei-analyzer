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
    
    // 初期メタファー生成
    this.generateInitialMetaphors();
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
      
    } catch (error) {
      console.error('❌ Error generating initial metaphors:', error);
      this.generateFallbackMetaphors();
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
   * 生成されたメタファーの統合取得
   */
  getIntegratedMetaphors() {
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

  // 追加の詳細メソッドは必要に応じて実装...

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