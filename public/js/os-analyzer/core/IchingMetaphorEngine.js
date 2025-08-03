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
    this.engineOS = virtualPersonality?.engineOS;
    this.interfaceOS = virtualPersonality?.interfaceOS;
    this.safeModeOS = virtualPersonality?.safeModeOS;
    
    // personalityStateの安全な初期化チェック
    if (!this.virtualPersonality?.personalityState?.currentDominantOS) {
      console.warn('⚠️ IchingMetaphorEngine: personalityState.currentDominantOS is not initialized, using fallback');
      if (this.virtualPersonality?.personalityState) {
        this.virtualPersonality.personalityState.currentDominantOS = 'engine';
      }
    }
    
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
    // 安全なアクセスパターンを実装
    const personalityState = this.virtualPersonality?.personalityState || {};
    const dominantOS = personalityState.currentDominantOS || 'engine';
    const harmony = personalityState.internalHarmony || 0.5;
    
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
      practicalApplication: this.generatePracticalApplication(hexagram, dominantOS, harmony),
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
    // 安全なアクセスパターンを実装
    const personalityState = this.virtualPersonality?.personalityState || {};
    const dominantOS = personalityState.currentDominantOS || 'engine';
    const adaptability = personalityState.adaptabilityIndex || 0.5;
    
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
   * 状況に応じたガイダンスの生成
   */
  generateSituationalGuidance(situation, hexagram) {
    console.log(`🔮 Generating situational guidance for: ${situation}`);
    
    try {
      // 易経の智慧に基づく状況分析
      const hexagramData = this.getHexagramData(hexagram);
      const osStates = this.getOSStates();
      
      // 文人哲学に基づく実践的アドバイス
      const practicalAdvice = this.generatePracticalAdvice(situation, hexagramData, osStates);
      const timingGuidance = this.generateTimingGuidance(hexagramData);
      const actionSteps = this.generateActionSteps(situation, hexagramData);
      
      const guidance = {
        situation,
        hexagram: {
          name: hexagramData.name,
          meaning: hexagramData.meaning || '変化と調和',
          wisdom: hexagramData.wisdom || '易経の智慧'
        },
        practicalAdvice,
        timingGuidance,
        actionSteps,
        bunenjinInsight: this.generateBunenjinInsight(situation, hexagramData, osStates),
        timestamp: new Date().toISOString()
      };
      
      console.log(`✨ Situational guidance generated:`, guidance);
      return guidance;
      
    } catch (error) {
      console.error(`❌ Error generating situational guidance:`, error);
      return this.generateFallbackGuidance(situation);
    }
  }

  /**
   * 実践的アドバイスの生成
   */
  generatePracticalAdvice(situation, hexagramData, osStates) {
    const adviceTemplates = {
      'ストレス下での反応': [
        `${hexagramData.name}の智慧により、内なる静寂を保ちながら状況を客観視する`,
        `調和的な対応を心がけ、感情と理性のバランスを取る`,
        `長期的な視点で問題を捉え、一時的な困難に動じない`
      ],
      '重要な決断': [
        `${hexagramData.name}の導きにより、多角的な視点から判断する`,
        `内なる声と外的な状況の両方を考慮する`,
        `決断後の責任を受け入れる覚悟を持つ`
      ],
      '人間関係': [
        `相手の立場を理解し、共感的なコミュニケーションを重視する`,
        `自分の価値観を大切にしながらも、柔軟性を保つ`,
        `信頼関係の構築に時間をかける`
      ]
    };
    
    return adviceTemplates[situation] || [
      '状況を冷静に分析し、最適な対応を見つける',
      '内なる智慧を信頼し、直感と論理の両方を活用する',
      '長期的な成長と調和を重視した行動を取る'
    ];
  }

  /**
   * タイミングガイダンスの生成
   */
  generateTimingGuidance(hexagramData) {
    return {
      bestTiming: '内なる準備が整った時',
      avoidTiming: '感情的に不安定な時',
      preparation: `${hexagramData.name}の教えに従い、心の準備を整える`,
      signs: '直感が明確になり、周囲の状況が整った時'
    };
  }

  /**
   * アクションステップの生成
   */
  generateActionSteps(situation, hexagramData) {
    return [
      { step: 1, action: '現状の詳細な分析と理解', timing: '即座に' },
      { step: 2, action: `${hexagramData.name}の智慧を活用した戦略立案`, timing: '十分な検討時間をかける' },
      { step: 3, action: '小さな行動から開始し、段階的に進める', timing: '準備が整い次第' },
      { step: 4, action: '結果を観察し、必要に応じて調整する', timing: '継続的に' }
    ];
  }

  /**
   * 文人哲学に基づく洞察
   */
  generateBunenjinInsight(situation, hexagramData, osStates) {
    const dominantOS = osStates.dominantOS || 'engine';
    const osBalance = osStates.osBalance || { engine: 0.33, interface: 0.33, safemode: 0.34 };
    
    return {
      philosophicalPerspective: `分人思想により、${situation}における異なる自己の側面を理解する`,
      osIntegration: `${dominantOS} OSが主導し、他のOSとの調和を保つ`,
      balanceWisdom: `現在のOS バランス（Engine: ${Math.round(osBalance.engine * 100)}%, Interface: ${Math.round(osBalance.interface * 100)}%, SafeMode: ${Math.round(osBalance.safemode * 100)}%）を活用`,
      iChingConnection: `${hexagramData.name}の智慧と分人思想の統合により、真の自己理解を深める`
    };
  }

  /**
   * フォールバックガイダンス
   */
  generateFallbackGuidance(situation) {
    return {
      situation,
      practicalAdvice: ['状況を冷静に分析し、最適な対応を見つける'],
      timingGuidance: { bestTiming: '準備が整った時' },
      actionSteps: [{ step: 1, action: '現状分析', timing: '即座に' }],
      bunenjinInsight: { philosophicalPerspective: '分人思想による多面的理解' }
    };
  }

  /**
   * 易経データの取得
   * @param {Object} hexagram - 易経情報
   * @returns {Object} - 易経詳細データ
   */
  getHexagramData(hexagram) {
    // DataManagerからの詳細データ取得を試行
    if (this.dataManager && this.dataManager.getHexagramById) {
      try {
        const detailedData = this.dataManager.getHexagramById(hexagram.id || hexagram.name);
        if (detailedData) {
          return {
            id: detailedData.id || hexagram.id,
            name: detailedData.name || hexagram.name || '易経',
            meaning: detailedData.meaning || hexagram.meaning || '変化と調和',
            wisdom: detailedData.wisdom || detailedData.description || '易経の智慧',
            keywords: detailedData.keywords || ['変化', '調和', '智慧'],
            element: detailedData.element || '自然',
            direction: detailedData.direction || '中央'
          };
        }
      } catch (error) {
        console.warn('⚠️ DataManager hexagram lookup failed:', error);
      }
    }

    // フォールバック: 基本データ構造
    const fallbackData = {
      id: hexagram.id || 1,
      name: hexagram.name || '易経',
      meaning: hexagram.meaning || '変化と調和の智慧',
      wisdom: '状況に応じて柔軟に対応し、内なる智慧を信頼する',
      keywords: ['智慧', '調和', '変化', 'バランス'],
      element: '自然',
      direction: '中央'
    };

    // より具体的な情報がある場合は利用
    if (typeof hexagram === 'object') {
      Object.keys(hexagram).forEach(key => {
        if (hexagram[key] && !fallbackData[key]) {
          fallbackData[key] = hexagram[key];
        }
      });
    }

    return fallbackData;
  }

  /**
   * OSの状態取得
   * @returns {Object} - OSの現在状態
   */
  getOSStates() {
    const osStates = {
      dominantOS: 'engine',
      osBalance: { engine: 0.33, interface: 0.33, safemode: 0.34 },
      overallCoherence: 0.5,
      internalHarmony: 0.5,
      adaptabilityIndex: 0.5
    };

    // VirtualPersonalityからの状態取得を試行
    if (this.virtualPersonality) {
      const personalityState = this.virtualPersonality.personalityState || {};
      
      osStates.dominantOS = personalityState.currentDominantOS || 'engine';
      osStates.osBalance = personalityState.osBalance || osStates.osBalance;
      osStates.overallCoherence = personalityState.overallCoherence || 0.5;
      osStates.internalHarmony = personalityState.internalHarmony || 0.5;
      osStates.adaptabilityIndex = personalityState.adaptabilityIndex || 0.5;
    }

    return osStates;
  }

  /**
   * 最適なタイミングの提案
   * @param {Object} hexagram - 易経情報
   * @returns {Object} - タイミング提案
   */
  suggestOptimalTiming(hexagram) {
    const hexagramData = this.getHexagramData(hexagram);
    const osStates = this.getOSStates();
    
    // 易経に基づくタイミング分析
    const timingSuggestion = {
      bestTime: this.calculateBestTiming(hexagramData, osStates),
      avoidTime: this.calculateAvoidTiming(hexagramData, osStates),
      preparation: this.generatePreparationAdvice(hexagramData),
      indicators: this.generateTimingIndicators(hexagramData, osStates),
      cyclicalAdvice: this.generateCyclicalAdvice(hexagramData)
    };

    return timingSuggestion;
  }

  /**
   * 最適なタイミングの計算
   */
  calculateBestTiming(hexagramData, osStates) {
    const timingOptions = [
      '内なる準備が整った時',
      '直感が明確になった時', 
      '周囲の状況が調和した時',
      'エネルギーが最高潮に達した時',
      `${osStates.dominantOS} OSが活性化した時`
    ];

    // 易経の特性に基づいて最適なタイミングを選択
    const keywordBasedTiming = {
      '智慧': '深い洞察を得た時',
      '調和': '内外のバランスが取れた時',
      '変化': '変化の兆しを感じた時',
      'バランス': '心身が安定した時'
    };

    for (const keyword of hexagramData.keywords || []) {
      if (keywordBasedTiming[keyword]) {
        return keywordBasedTiming[keyword];
      }
    }

    return timingOptions[Math.floor(Math.random() * timingOptions.length)];
  }

  /**
   * 避けるべきタイミングの計算
   */
  calculateAvoidTiming(hexagramData, osStates) {
    return [
      '感情的に不安定な時',
      '外的圧力が強い時',
      '判断力が鈍っている時',
      'エネルギーが低下している時'
    ];
  }

  /**
   * 準備アドバイスの生成
   */
  generatePreparationAdvice(hexagramData) {
    return `${hexagramData.name}の教えに従い、心身の準備を整え、内なる智慧に耳を傾ける`;
  }

  /**
   * タイミング指標の生成
   */
  generateTimingIndicators(hexagramData, osStates) {
    return [
      '直感的な確信を感じる',
      '周囲の反応が好意的',
      `${osStates.dominantOS} OSからの明確なサイン`,
      '内なる平静を保てている'
    ];
  }

  /**
   * 周期的アドバイスの生成  
   */
  generateCyclicalAdvice(hexagramData) {
    return {
      daily: '朝の静寂な時間を活用する',
      weekly: '週の中頃に重要な決断を行う',
      monthly: '月の満ち欠けと共に行動を調整する',
      seasonal: `${hexagramData.element}の季節に合わせた活動を重視する`
    };
  }

  /**
   * 人生指針メタファーの生成
   */
  async generateLifeGuidanceMetaphor() {
    // 安全なアクセスパターンを実装
    const personalityMetadata = this.virtualPersonality?.personalityMetadata || {};
    const personalityState = this.virtualPersonality?.personalityState || {};
    const personalityType = personalityMetadata.personalityType || '標準型';
    const overallCoherence = personalityState.overallCoherence || 0.5;
    
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
    // 安全なアクセスパターンを実装
    const personalityState = osPersonalities || {};
    const dominantOS = personalityState.currentDominantOS || 'engine';
    const harmony = personalityState.internalHarmony || 0.5;

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
    // 安全なアクセスパターンを実装
    const personalityState = osPersonalities || {};
    const dominantOS = personalityState.currentDominantOS || 'engine';
    
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
      harmonicLevel: personalityState.internalHarmony || 0.5,
      balanceRecommendation: this.generateBalanceRecommendation(personalityState)
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
   * 象徴的意味の抽出
   * フォールバック実装を含む
   */
  extractSymbolicMeaning(hexagram, dominantOS) {
    // 入力パラメータのバリデーション
    if (!hexagram || !dominantOS) {
      console.warn('⚠️ extractSymbolicMeaning: Missing parameters, using fallback');
      return {
        primarySymbol: { id: 64, name: '未済', meaning: '無限の可能性' },
        interpretation: 'あなたの人格には限りない可能性が秘められています',
        elementalAspect: '調和的なエネルギー',
        spiritualDimension: '継続的な成長を目指す道筋',
        practicalManifestation: '柔軟性と適応力を人生に統合する'
      };
    }
    
    try {
    const symbolicMeanings = {
      engine: {
        1: '天のような創造力を持つ価値観の源泉',
        2: '大地のような包容力のある価値基盤',
        29: '深淵な水のような価値の探求',
        64: '未完成の価値観の可能性'
      },
      interface: {
        1: '天空のような高い社会的理想',
        2: '大地のような安定した社会性',
        29: '流れる水のような柔軟な対人関係',
        64: '発展途上の社会的スキル'
      },
      safemode: {
        1: '天の守護のような強固な防御',
        2: '大地の安定のような確実な保護',
        29: '深い水のような慎重な警戒',
        64: '未完成の防御システムの強化'
      }
    };

      const osSymbols = symbolicMeanings[dominantOS] || symbolicMeanings.engine;
      const meaning = osSymbols[hexagram.id] || `${hexagram.name}の象徴的意味を体現する${dominantOS}OS`;

      return {
        primarySymbol: hexagram,
        interpretation: meaning,
        elementalAspect: this.getElementalAspect(hexagram),
        spiritualDimension: this.getSpiritualDimension(hexagram, dominantOS),
        practicalManifestation: this.getPracticalManifestation(hexagram, dominantOS)
      };
      
    } catch (error) {
      console.error('❌ Error in extractSymbolicMeaning:', error);
      return {
        primarySymbol: { id: 64, name: '未済', meaning: '無限の可能性' },
        interpretation: '易経の智恵があなたの人格に新しい洞察をもたらします',
        elementalAspect: '調和的なエネルギー',
        spiritualDimension: '内なる統合への道筋',
        practicalManifestation: '日常における智恵の実践'
      };
    }
  }

  /**
   * 元素的側面の取得
   */
  getElementalAspect(hexagram) {
    const elementMap = {
      '天': '創造性と指導力',
      '地': '安定性と受容性',
      '水': '流動性と適応性',
      '火': '情熱と洞察力',
      '雷': '行動力と突破力',
      '風': '浸透力と影響力',
      '山': '不動性と瞑想力',
      '沢': '喜びと表現力'
    };

    return elementMap[hexagram.element] || '調和的なエネルギー';
  }

  /**
   * 精神的次元の取得
   */
  getSpiritualDimension(hexagram, dominantOS) {
    return `${hexagram.name}の精神性を通じて、${dominantOS}OSが内なる統合を目指す道筋`;
  }

  /**
   * 実践的表現の取得
   */
  getPracticalManifestation(hexagram, dominantOS) {
    const manifestations = {
      engine: `価値観として${hexagram.meaning}を日常に表現する`,
      interface: `社会的関係で${hexagram.meaning}を体現する`,
      safemode: `防御的判断で${hexagram.meaning}を活用する`
    };

    return manifestations[dominantOS] || `${hexagram.meaning}を人生に統合する`;
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

  /**
   * 実践的応用の生成 - 欠如していたメソッドの実装
   * @param {Object} hexagram - 卦のデータ
   * @param {string} dominantOS - 主導的OS
   * @param {number} harmony - 調和度
   * @returns {Object} 実践的応用の指針
   */
  generatePracticalApplication(hexagram, dominantOS = 'engine', harmony = 0.5) {
    // 入力パラメータの検証
    if (!hexagram) {
      console.warn('⚠️ generatePracticalApplication: hexagram parameter missing, using fallback');
      return {
        dailyPractice: ['内なる声に耳を傾ける時間を作る'],
        situationalApplication: {
          work: '価値観に基づいた決断を心がける',
          relationships: '相手の立場を理解しながら自分の考えを伝える',
          challenges: '困難な状況でも核となる信念を見失わない'
        },
        integration: {
          engineAlignment: '価値観システムとの整合性を確認する',
          interfaceHarmony: '社会的システムとのバランスを保つ',
          safemodeProtection: '防御システムの警告を適切に評価する'
        },
        progressIndicators: [
          '内的な平和を感じられる',
          '判断に迷いが少なくなる',
          '人間関係が改善される'
        ]
      };
    }

    try {
      // 卦の属性に基づく実践指針の生成
      const attributes = hexagram.attributes || ['調和', '成長', '智慧'];
      const hexagramName = hexagram.name || '未済';
      const hexagramMeaning = hexagram.meaning || '成長への道';

      // 主導OSに基づく特化指針
      const osSpecificGuidance = this.generateOSSpecificGuidance(hexagram, dominantOS);
      
      // 調和度に基づく実践レベル
      const practiceLevel = this.determinePracticeLevel(harmony);
      
      return {
        dailyPractice: this.generateDailyPractices(hexagram, dominantOS, harmony),
        situationalApplication: {
          work: `仕事では${hexagramName}の智慧に従い、${attributes[0]}を重視した判断を行いましょう`,
          relationships: `人間関係では${hexagramMeaning}の精神で、${attributes[1] || attributes[0]}を大切にしましょう`,
          challenges: `困難な状況では${hexagramName}が教える${attributes[2] || attributes[0]}の姿勢で乗り越えましょう`
        },
        integration: {
          engineAlignment: osSpecificGuidance.engine,
          interfaceHarmony: osSpecificGuidance.interface,
          safemodeProtection: osSpecificGuidance.safemode
        },
        practiceLevel: practiceLevel,
        progressIndicators: this.generateProgressIndicators(hexagram, harmony),
        timeframe: this.suggestPracticeTimeframe(harmony),
        adaptationTips: this.generateAdaptationTips(hexagram, dominantOS)
      };
      
    } catch (error) {
      console.error('❌ Error in generatePracticalApplication:', error);
      // フォールバック実装
      return {
        dailyPractice: ['易経の智慧を日常の選択に活かす'],
        situationalApplication: {
          work: '職場での判断において、内なる智慧を参考にする',
          relationships: '人との関わりで、調和と理解を大切にする',
          challenges: '困難な時こそ、長期的視点を保つ'
        },
        integration: {
          engineAlignment: '価値観システムとの調和を図る',
          interfaceHarmony: '社会的システムとのバランスを保つ',
          safemodeProtection: '防御システムの智慧を活かす'
        },
        progressIndicators: ['内的平和の向上', '判断力の向上', '人間関係の改善']
      };
    }
  }

  /**
   * OS特化指針の生成
   */
  generateOSSpecificGuidance(hexagram, dominantOS) {
    const hexagramName = hexagram.name || '未済';
    const attributes = hexagram.attributes || ['調和'];
    
    return {
      engine: `価値観システムでは、${hexagramName}の${attributes[0]}を核とした信念体系を構築しましょう`,
      interface: `社会的システムでは、${hexagramName}の智慧を他者との関係に活かしましょう`,
      safemode: `防御システムでは、${hexagramName}の教えを安全な判断の基準としましょう`
    };
  }

  /**
   * 実践レベルの決定
   */
  determinePracticeLevel(harmony) {
    if (harmony > 0.8) {
      return {
        level: 'advanced',
        description: '高度な統合実践',
        focus: '3つのOSの完全な調和を目指す'
      };
    } else if (harmony > 0.6) {
      return {
        level: 'intermediate',
        description: '中級統合実践',
        focus: 'OSの協力関係を強化する'
      };
    } else {
      return {
        level: 'beginner',
        description: '基礎統合実践',
        focus: '各OSの特性と役割を理解する'
      };
    }
  }

  /**
   * 日常実践の生成
   */
  generateDailyPractices(hexagram, dominantOS, harmony) {
    const hexagramName = hexagram.name || '未済';
    const practices = [];
    
    // 朝の実践
    practices.push(`朝の時間に${hexagramName}の智慧を心に留める瞑想を行う`);
    
    // OS特化実践
    if (dominantOS === 'engine') {
      practices.push('価値観に基づく今日の行動指針を設定する');
    } else if (dominantOS === 'interface') {
      practices.push('人間関係における調和的アプローチを意識する');
    } else {
      practices.push('一日の安全と安定を確保する行動計画を立てる');
    }
    
    // 調和度に応じた実践
    if (harmony > 0.7) {
      practices.push('3つのOSの統合的判断を意識した選択を行う');
    } else {
      practices.push('各OSの声に耳を傾け、バランスの取れた判断を心がける');
    }
    
    // 夜の振り返り
    practices.push(`夜に${hexagramName}の教えと今日の行動を照らし合わせて振り返る`);
    
    return practices;
  }

  /**
   * 進歩指標の生成
   */
  generateProgressIndicators(hexagram, harmony) {
    const indicators = [
      `${hexagram.name}の智慧が日常判断に自然に現れる`,
      '内的な対話がより建設的になる',
      '困難な状況での冷静さが向上する'
    ];
    
    if (harmony > 0.6) {
      indicators.push('3つのOSの協力がスムーズに感じられる');
    } else {
      indicators.push('各OSの特性をより明確に識別できる');
    }
    
    return indicators;
  }

  /**
   * 実践期間の提案
   */
  suggestPracticeTimeframe(harmony) {
    if (harmony > 0.7) {
      return {
        daily: '毎日の継続実践',
        review: '週次の振り返り',
        adjustment: '月次の調整'
      };
    } else {
      return {
        daily: '基礎的な日常実践',
        review: '3日ごとの小振り返り',
        adjustment: '週次の大幅調整'
      };
    }
  }

  /**
   * 適応のヒント生成
   */
  generateAdaptationTips(hexagram, dominantOS) {
    const tips = [];
    
    tips.push(`${hexagram.name}の教えを無理に当てはめず、自分の状況に応じて柔軟に解釈する`);
    
    if (dominantOS === 'engine') {
      tips.push('理想と現実のバランスを取りながら、価値観を実践に移す');
    } else if (dominantOS === 'interface') {
      tips.push('他者の反応を観察しながら、社会的な実践方法を調整する');
    } else {
      tips.push('安全性を確保しながら、段階的に新しい実践を取り入れる');
    }
    
    tips.push('完璧を求めず、継続的な改善を重視する');
    
    return tips;
  }

  /**
   * 季節的な側面のマッピング - 不足していたメソッドの実装
   */
  mapToSeasonalCycle(hexagram) {
    const seasonalMappings = {
      1: { season: '春', phase: '創造の始まり', energy: '上昇エネルギー' },
      2: { season: '秋', phase: '収穫と受容', energy: '安定エネルギー' },
      29: { season: '冬', phase: '深い内省', energy: '潜在エネルギー' },
      64: { season: '春', phase: '新しい可能性', energy: '変化エネルギー' }
    };

    return seasonalMappings[hexagram.id] || {
      season: '四季全体',
      phase: '継続的な循環',
      energy: '調和エネルギー'
    };
  }

  /**
   * 元素バランスの分析 - 不足していたメソッドの実装
   */
  analyzeElementalBalance(hexagram) {
    const elementalAnalysis = {
      primary: hexagram.element || '調和',
      qualities: hexagram.attributes || ['バランス'],
      interactions: this.calculateElementalInteractions(hexagram),
      recommendations: this.generateElementalRecommendations(hexagram)
    };

    return elementalAnalysis;
  }

  /**
   * 元素間相互作用の計算
   */
  calculateElementalInteractions(hexagram) {
    const element = hexagram.element || '調和';
    const interactionMap = {
      '天': { strengthens: ['火', '金'], weakens: ['地'], neutral: ['水', '木'] },
      '地': { strengthens: ['金', '水'], weakens: ['木'], neutral: ['火', '天'] },
      '水': { strengthens: ['木', '金'], weakens: ['火'], neutral: ['地', '天'] },
      '火': { strengthens: ['土', '木'], weakens: ['金'], neutral: ['水', '天'] },
      '調和': { strengthens: ['すべて'], weakens: [], neutral: [] }
    };

    return interactionMap[element] || interactionMap['調和'];
  }

  /**
   * 元素的推奨事項の生成
   */
  generateElementalRecommendations(hexagram) {
    const element = hexagram.element || '調和';
    const recommendationMap = {
      '天': ['リーダーシップを発揮する', '創造的な活動に取り組む', '高い目標を設定する'],
      '地': ['安定した基盤を築く', '他者をサポートする', '着実な成長を心がける'],
      '水': ['柔軟性を保つ', '状況に適応する', '深い洞察を求める'],
      '火': ['情熱的に取り組む', '明確なビジョンを持つ', '他者を照らす存在になる'],
      '調和': ['バランスを保つ', '全体性を意識する', '多様性を受け入れる']
    };

    return recommendationMap[element] || recommendationMap['調和'];
  }

  /**
   * バランス推奨事項の生成 - 不足していたメソッドの実装
   */
  generateBalanceRecommendation(personalityState) {
    const harmony = personalityState?.internalHarmony || 0.5;
    const dominantOS = personalityState?.currentDominantOS || 'engine';

    if (harmony > 0.8) {
      return '現在の優れたバランスを維持しながら、さらなる統合を目指しましょう';
    } else if (harmony > 0.6) {
      return '良好なバランスを基盤として、各OSの協力関係を深めましょう';
    } else if (harmony > 0.4) {
      return 'OS間の対話を促進し、相互理解を深めることでバランス改善を図りましょう';
    } else {
      return '各OSの特性を理解し、段階的な統合を通じてバランスを構築しましょう';
    }
  }

  /**
   * 関係性進化の評価 - 不足していたメソッドの実装
   */
  assessRelationshipEvolution(relationshipData) {
    const compatibility = relationshipData?.compatibility || 0.5;
    const conflict = relationshipData?.conflict || 0.3;
    const cooperation = relationshipData?.cooperation || 0.5;

    const evolutionScore = (compatibility + cooperation - conflict * 0.5) / 2;

    let evolutionPotential;
    if (evolutionScore > 0.7) {
      evolutionPotential = {
        level: 'high',
        direction: '深い統合と相互成長',
        timeframe: '短期間での進展',
        focus: '高次の協力関係の構築'
      };
    } else if (evolutionScore > 0.5) {
      evolutionPotential = {
        level: 'moderate',
        direction: '建設的な協力関係',
        timeframe: '中期的な発展',
        focus: '相互理解の深化'
      };
    } else {
      evolutionPotential = {
        level: 'developing',
        direction: '基礎関係の構築',
        timeframe: '長期的な育成',
        focus: '対話と理解の促進'
      };
    }

    return evolutionPotential;
  }

  /**
   * 関係性指針の生成 - 安全なアクセスパターンで修正
   */
  generateRelationshipGuidance(metaphor, relationshipData) {
    if (!metaphor || !relationshipData) {
      return '各OSの声に耳を傾け、調和的な関係性を築きましょう';
    }

    const guidanceMap = {
      harmony: '自然な調和を維持し、相互の成長を支援し合いましょう',
      tension: '建設的な対話を通じて、相違を成長の機会に変えましょう',
      cooperation: '協力関係を深め、共通の目標に向かって歩みましょう',
      balance: 'バランスを保ちながら、段階的な関係改善を図りましょう'
    };

    return guidanceMap[metaphor.type] || guidanceMap.balance;
  }

  /**
   * 現在の季節の決定 - 不足していたメソッドの実装
   */
  determinCurrentSeason(osPersonalities) {
    const harmony = osPersonalities?.internalHarmony || 0.5;
    const dominantOS = osPersonalities?.currentDominantOS || 'engine';

    if (harmony > 0.8) {
      return { season: '夏', description: '成熟と豊かさの季節' };
    } else if (harmony > 0.6) {
      return { season: '春', description: '成長と発展の季節' };
    } else if (harmony > 0.4) {
      return { season: '秋', description: '変化と準備の季節' };
    } else {
      return { season: '冬', description: '内省と基盤構築の季節' };
    }
  }

  /**
   * 次段階指針の生成 - 不足していたメソッドの実装
   */
  generateNextPhaseGuidance(hexagram) {
    const hexagramName = hexagram?.name || '未済';
    const attributes = hexagram?.attributes || ['成長'];

    return {
      immediate: `${hexagramName}の教えを日常的な選択に取り入れる`,
      shortTerm: `${attributes[0]}を重視した生活パターンを確立する`,
      longTerm: `${hexagramName}の智慧を人生の指針として統合する`,
      keyActions: [
        '毎日の振り返りを習慣化する',
        '各OSの声を意識的に聞く',
        'バランスの取れた判断を心がける'
      ]
    };
  }

  /**
   * 行動予測の生成 - 不足していたメソッドの実装（bunenjin哲学基盤）
   * @param {string} situation - 予測対象の状況
   * @param {Object} hexagram - 対応する卦のデータ
   * @returns {Object} bunenjin哲学に基づく行動予測
   */
  generateBehaviorPrediction(situation, hexagram) {
    console.log(`🔮 Generating behavior prediction for situation: ${situation} with hexagram: ${hexagram?.name}`);
    
    // MCPフックでログ出力
    if (typeof window !== 'undefined' && window.console) {
      console.log(`🧠 [BUNENJIN] Behavior prediction initiated for ${situation}`);
    }
    
    // 入力パラメータの検証
    if (!situation || !hexagram) {
      console.warn('⚠️ generateBehaviorPrediction: Missing parameters, using fallback prediction');
      return this.generateFallbackBehaviorPrediction(situation);
    }

    try {
      // 仮想人格の状態を安全に取得
      const personalityState = this.virtualPersonality?.personalityState || {};
      const dominantOS = personalityState.currentDominantOS || 'engine';
      const harmony = personalityState.internalHarmony || 0.5;
      const adaptability = personalityState.adaptabilityIndex || 0.5;

      // bunenjin哲学に基づく行動パターン分析
      const bunenjinAnalysis = this.analyzeBunenjinPattern(situation, hexagram, {
        dominantOS,
        harmony,
        adaptability
      });

      // 3つのOSの行動傾向予測
      const osReactions = this.predictOSReactions(situation, hexagram, personalityState);
      
      // 統合的行動予測の生成
      const integratedPrediction = this.generateIntegratedPrediction(
        bunenjinAnalysis,
        osReactions,
        hexagram
      );

      // 時系列行動パターンの予測
      const timelinePrediction = this.predictTimelinePattern(situation, hexagram, personalityState);

      // 確率的行動選択の計算
      const probabilityMatrix = this.calculateBehaviorProbability(
        integratedPrediction,
        personalityState
      );

      // MCPフックでbunenjin分析結果をログ出力
      console.log(`🎭 [BUNENJIN] Primary behavior pattern: ${integratedPrediction.primaryPattern}`);
      
      const prediction = {
        situation: situation,
        hexagramGuide: {
          id: hexagram.id,
          name: hexagram.name,
          meaning: hexagram.meaning,
          guidance: `${hexagram.name}の智慧に従い、${hexagram.attributes?.[0] || '調和'}を重視した行動`
        },
        bunenjinCore: bunenjinAnalysis,
        osReactions: osReactions,
        primaryBehavior: integratedPrediction.primaryPattern,
        alternativeBehaviors: integratedPrediction.alternatives,
        behaviorProbability: probabilityMatrix,
        timelinePattern: timelinePrediction,
        adaptationStrategy: this.generateAdaptationStrategy(bunenjinAnalysis, personalityState),
        warningSignals: this.identifyWarningSignals(situation, personalityState),
        growthOpportunities: this.identifyGrowthOpportunities(situation, hexagram, bunenjinAnalysis)
      };

      // MCPフックで最終予測をログ出力
      console.log(`✨ [BUNENJIN] Behavior prediction completed: ${prediction.primaryBehavior}`);
      
      return prediction;

    } catch (error) {
      console.error('❌ Error in generateBehaviorPrediction:', error);
      return this.generateFallbackBehaviorPrediction(situation);
    }
  }

  /**
   * bunenjin哲学パターン分析
   * bunenjin: 物事の本質を捉え、調和と成長を重視する東洋的智慧
   */
  analyzeBunenjinPattern(situation, hexagram, personalityMetrics) {
    const { dominantOS, harmony, adaptability } = personalityMetrics;
    
    // bunenjinの核心原理: 中庸・調和・成長・智慧
    const bunenjinPrinciples = {
      balance: this.assessBalanceNeed(situation, harmony),
      growth: this.assessGrowthPotential(situation, adaptability),
      wisdom: this.assessWisdomApplication(situation, hexagram),
      harmony: this.assessHarmonyRequirement(situation, dominantOS)
    };

    // 状況に対するbunenjin的アプローチ
    const bunenjinApproach = this.determineBunenjinApproach(bunenjinPrinciples, hexagram);
    
    return {
      principles: bunenjinPrinciples,
      approach: bunenjinApproach,
      philosophicalGuidance: this.generatePhilosophicalGuidance(bunenjinPrinciples, hexagram),
      practicalApplication: this.generateBunenjinPracticalSteps(bunenjinApproach, situation)
    };
  }

  /**
   * バランス必要性の評価
   */
  assessBalanceNeed(situation, harmony) {
    if (situation.includes('ストレス') || situation.includes('対立')) {
      return {
        level: 'high',
        focus: '内的平衡の回復',
        approach: '調和的解決を優先'
      };
    } else if (situation.includes('選択') || situation.includes('決定')) {
      return {
        level: 'moderate',
        focus: '多角的視点の統合',
        approach: '中庸の道を探求'
      };
    } else {
      return {
        level: 'maintenance',
        focus: '現状バランスの維持',
        approach: '安定的調和の継続'
      };
    }
  }

  /**
   * 成長可能性の評価
   */
  assessGrowthPotential(situation, adaptability) {
    if (situation.includes('挑戦') || situation.includes('新しい')) {
      return {
        potential: 'high',
        direction: '積極的成長',
        strategy: adaptability > 0.6 ? '大胆な前進' : '段階的発展'
      };
    } else if (situation.includes('学習') || situation.includes('経験')) {
      return {
        potential: 'moderate',
        direction: '継続的学習',
        strategy: '経験からの智慧獲得'
      };
    } else {
      return {
        potential: 'latent',
        direction: '潜在的発展',
        strategy: '機会の準備と待機'
      };
    }
  }

  /**
   * 智慧適用の評価
   */
  assessWisdomApplication(situation, hexagram) {
    const hexagramWisdom = hexagram.attributes || ['調和'];
    
    return {
      applicableWisdom: hexagramWisdom,
      applicationMethod: `${hexagram.name}の教えを${situation}に適用`,
      expectedInsight: `${hexagram.meaning}を通じた深い理解`,
      practicalExpression: `日常行動での${hexagramWisdom[0]}の実践`
    };
  }

  /**
   * 調和要求の評価
   */
  assessHarmonyRequirement(situation, dominantOS) {
    const harmonyStrategies = {
      engine: '価値観との整合性を重視した行動',
      interface: '社会的調和を考慮した対応',
      safemode: '安全性と調和のバランス'
    };

    return {
      strategy: harmonyStrategies[dominantOS],
      priority: situation.includes('人間関係') ? 'high' : 'moderate',
      approach: 'OS間の協調的判断'
    };
  }

  /**
   * bunenjinアプローチの決定
   */
  determineBunenjinApproach(principles, hexagram) {
    // 複数の原理を統合したアプローチ
    const primaryPrinciple = this.identifyPrimaryPrinciple(principles);
    
    return {
      primary: primaryPrinciple,
      methodology: this.selectBunenjinMethodology(primaryPrinciple, hexagram),
      integration: this.planPrincipleIntegration(principles),
      expectedOutcome: this.predictBunenjinOutcome(primaryPrinciple, hexagram)
    };
  }

  /**
   * 主要原理の特定
   */
  identifyPrimaryPrinciple(principles) {
    // 各原理の重要度を評価
    if (principles.balance.level === 'high') return 'balance';
    if (principles.growth.potential === 'high') return 'growth';
    if (principles.harmony.priority === 'high') return 'harmony';
    return 'wisdom';
  }

  /**
   * bunenjin方法論の選択
   */
  selectBunenjinMethodology(primaryPrinciple, hexagram) {
    const methodologies = {
      balance: `${hexagram.name}の調和的智慧による均衡回復`,
      growth: `${hexagram.name}の成長促進エネルギーの活用`,
      harmony: `${hexagram.name}の和合の力による関係性改善`,
      wisdom: `${hexagram.name}の深い洞察による問題解決`
    };

    return methodologies[primaryPrinciple] || methodologies.wisdom;
  }

  /**
   * 3つのOSの反応予測
   */
  predictOSReactions(situation, hexagram, personalityState) {
    const dominantOS = personalityState?.currentDominantOS || 'engine';
    const harmony = personalityState?.internalHarmony || 0.5;

    return {
      engineOS: this.predictEngineReaction(situation, hexagram, dominantOS === 'engine', harmony),
      interfaceOS: this.predictInterfaceReaction(situation, hexagram, dominantOS === 'interface', harmony),
      safemodeOS: this.predictSafemodeReaction(situation, hexagram, dominantOS === 'safemode', harmony)
    };
  }

  /**
   * Engine OS反応予測
   */
  predictEngineReaction(situation, hexagram, isDominant, harmony) {
    const baseReaction = {
      focus: '価値観と理想への整合性',
      approach: `${hexagram.name}の智慧に基づく信念の実践`,
      concern: '行動が価値観に忠実であるか',
      contribution: '道徳的・倫理的判断の提供'
    };

    if (isDominant) {
      baseReaction.influence = 'strong';
      baseReaction.leadership = `${hexagram.name}の教えを主導的に実行`;
    } else {
      baseReaction.influence = harmony > 0.6 ? 'collaborative' : 'advisory';
      baseReaction.support = `価値観的観点からの支援と助言`;
    }

    return baseReaction;
  }

  /**
   * Interface OS反応予測
   */
  predictInterfaceReaction(situation, hexagram, isDominant, harmony) {
    const baseReaction = {
      focus: '社会的調和と関係性',
      approach: `${hexagram.name}の智慧を人間関係に応用`,
      concern: '他者との調和が保たれるか',
      contribution: '社会的スキルと協力関係の構築'
    };

    if (situation.includes('対人関係') || situation.includes('チーム')) {
      baseReaction.activation = 'high';
      baseReaction.specialization = '関係性の調整と改善';
    }

    if (isDominant) {
      baseReaction.influence = 'strong';
      baseReaction.leadership = `${hexagram.name}を通じた社会的統合の推進`;
    }

    return baseReaction;
  }

  /**
   * SafeMode OS反応予測
   */
  predictSafemodeReaction(situation, hexagram, isDominant, harmony) {
    const baseReaction = {
      focus: '安全性とリスク管理',
      approach: `${hexagram.name}の慎重な智慧の適用`,
      concern: '行動に伴うリスクの評価',
      contribution: '安全で持続可能な選択肢の提示'
    };

    if (situation.includes('ストレス') || situation.includes('危険')) {
      baseReaction.activation = 'high';
      baseReaction.protection = '積極的なリスク回避策の提案';
    }

    if (isDominant) {
      baseReaction.influence = 'strong';
      baseReaction.caution = `${hexagram.name}の教えによる慎重な行動指針`;
    }

    return baseReaction;
  }

  /**
   * 統合的行動予測の生成
   */
  generateIntegratedPrediction(bunenjinAnalysis, osReactions, hexagram) {
    const primaryPattern = this.synthesizePrimaryPattern(bunenjinAnalysis, osReactions, hexagram);
    const alternatives = this.generateAlternativePatterns(bunenjinAnalysis, osReactions, hexagram);

    return {
      primaryPattern,
      alternatives,
      confidence: this.calculatePredictionConfidence(bunenjinAnalysis, osReactions),
      bunenjinAlignment: this.assessBunenjinAlignment(primaryPattern, bunenjinAnalysis)
    };
  }

  /**
   * 主要パターンの合成
   */
  synthesizePrimaryPattern(bunenjinAnalysis, osReactions, hexagram) {
    const approach = bunenjinAnalysis.approach;
    const dominantReaction = this.identifyDominantOSReaction(osReactions);
    
    return `${hexagram.name}の智慧に導かれ、${approach.methodology}を通じて、${dominantReaction.focus}を重視した${approach.primary}的な行動を取る`;
  }

  /**
   * 時系列行動パターンの予測
   */
  predictTimelinePattern(situation, hexagram, personalityState) {
    const adaptability = personalityState?.adaptabilityIndex || 0.5;
    
    return {
      immediate: `${hexagram.name}の直感的智慧による初期反応`,
      shortTerm: `${hexagram.attributes?.[0] || '調和'}を重視した継続的行動`,
      mediumTerm: `${hexagram.meaning}の深い理解に基づく行動修正`,
      longTerm: `${hexagram.name}の教えを人生に統合した成熟した対応`
    };
  }

  /**
   * 行動確率の計算
   */
  calculateBehaviorProbability(integratedPrediction, personalityState) {
    const harmony = personalityState?.internalHarmony || 0.5;
    const confidence = integratedPrediction.confidence || 0.7;
    
    return {
      primaryBehavior: Math.min(0.95, confidence * (0.7 + harmony * 0.3)),
      alternativeBehavior: Math.max(0.05, (1 - confidence) * 0.8),
      unexpectedBehavior: Math.max(0.01, (1 - harmony) * 0.1),
      adaptiveBehavior: personalityState?.adaptabilityIndex || 0.5
    };
  }

  /**
   * フォールバック行動予測
   */
  generateFallbackBehaviorPrediction(situation) {
    return {
      situation: situation || '一般的状況',
      hexagramGuide: {
        id: 64,
        name: '未済',
        meaning: '未だ成らず',
        guidance: '継続的な成長と学習を重視した行動'
      },
      bunenjinCore: {
        approach: {
          primary: 'wisdom',
          methodology: '未済の智慧による段階的成長'
        }
      },
      primaryBehavior: '状況を慎重に観察し、3つのOSの声を聞きながら、調和的で成長志向の行動を選択する',
      behaviorProbability: {
        primaryBehavior: 0.7,
        alternativeBehavior: 0.2,
        unexpectedBehavior: 0.1
      }
    };
  }

  /**
   * 適応戦略の生成
   */
  generateAdaptationStrategy(bunenjinAnalysis, personalityState) {
    return {
      flexibility: `${bunenjinAnalysis.approach.primary}の原理を保ちながら状況に応じた調整`,
      resilience: '予期せぬ変化に対する内的安定性の維持',
      learning: '経験から得られる智慧の統合と活用'
    };
  }

  /**
   * 警告信号の特定
   */
  identifyWarningSignals(situation, personalityState) {
    const harmony = personalityState?.internalHarmony || 0.5;
    
    const warnings = [];
    if (harmony < 0.4) {
      warnings.push('OS間の対立が行動の一貫性を阻害する可能性');
    }
    if (situation.includes('ストレス') && harmony < 0.6) {
      warnings.push('ストレス下での判断力低下のリスク');
    }
    
    return warnings;
  }

  /**
   * 成長機会の特定
   */
  identifyGrowthOpportunities(situation, hexagram, bunenjinAnalysis) {
    return [
      `${hexagram.name}の智慧を通じた自己理解の深化`,
      `${bunenjinAnalysis.approach.primary}の原理の実践的習得`,
      '3つのOSの協調関係の強化'
    ];
  }

  // 追加のヘルパーメソッド
  identifyDominantOSReaction(osReactions) {
    // 最も影響力の強いOSの反応を特定
    const reactions = [osReactions.engineOS, osReactions.interfaceOS, osReactions.safemodeOS];
    return reactions.find(r => r.influence === 'strong') || osReactions.engineOS;
  }

  generateAlternativePatterns(bunenjinAnalysis, osReactions, hexagram) {
    return [
      `より慎重な${hexagram.name}の適用による段階的アプローチ`,
      `より積極的な${hexagram.attributes?.[0] || '調和'}の実践`,
      `複数のOSの視点を同時に考慮した統合的判断`
    ];
  }

  calculatePredictionConfidence(bunenjinAnalysis, osReactions) {
    // bunenjin分析の一貫性とOS反応の協調性に基づく信頼度
    const analysisStrength = bunenjinAnalysis.approach.primary ? 0.8 : 0.6;
    const osCoordination = this.assessOSCoordination(osReactions);
    return (analysisStrength + osCoordination) / 2;
  }

  assessBunenjinAlignment(primaryPattern, bunenjinAnalysis) {
    // 予測がbunenjin哲学と整合しているかの評価
    return {
      philosophical: 'high',
      practical: 'moderate',
      spiritual: 'high'
    };
  }

  assessOSCoordination(osReactions) {
    // OS間の協調性を評価
    const collaborativeCount = [
      osReactions.engineOS,
      osReactions.interfaceOS,
      osReactions.safemodeOS
    ].filter(r => r.influence === 'collaborative').length;
    
    return collaborativeCount > 0 ? 0.8 : 0.6;
  }

  generatePhilosophicalGuidance(principles, hexagram) {
    return `${hexagram.name}の智慧に基づき、${Object.keys(principles).join('と')}を統合した東洋的智慧による人生指導`;
  }

  generateBunenjinPracticalSteps(approach, situation) {
    return [
      `${approach.primary}の原理に従った第一歩の実行`,
      `状況の全体的把握と調和的解決策の模索`,
      `継続的な学習と自己改善の実践`
    ];
  }

  planPrincipleIntegration(principles) {
    return '複数の原理を状況に応じて適切に組み合わせる統合的アプローチ';
  }

  predictBunenjinOutcome(primaryPrinciple, hexagram) {
    return `${hexagram.name}の${primaryPrinciple}を通じた内的成長と外的調和の達成`;
  }
}

// グローバルスコープでの利用可能化
if (typeof window !== 'undefined') {
  window.IchingMetaphorEngine = IchingMetaphorEngine;
}

console.log('✅ IchingMetaphorEngine.js loaded successfully');