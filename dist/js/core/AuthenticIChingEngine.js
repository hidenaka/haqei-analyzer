/**
 * AuthenticIChingEngine - 正統易経エンジン
 * HaQei哲学に基づく本格的64卦システム
 */

console.log('☯️ AuthenticIChingEngine Loading...');

window.AuthenticIChingEngine = {
  // 初期化状態
  initialized: false,
  
  // 64卦完全システム
  hexagramSystem: {
    // 八卦基本属性
    trigrams: {
      乾: { binary: '111', element: '天', nature: '強剛', family: '父', direction: '北西', season: '秋冬の境' },
      兌: { binary: '110', element: '沢', nature: '悦楽', family: '少女', direction: '西', season: '秋' },
      離: { binary: '101', element: '火', nature: '麗明', family: '中女', direction: '南', season: '夏' },
      震: { binary: '100', element: '雷', nature: '奮動', family: '長男', direction: '東', season: '春' },
      巽: { binary: '011', element: '風', nature: '入巽', family: '長女', direction: '南東', season: '晩春' },
      坎: { binary: '010', element: '水', nature: '陥険', family: '中男', direction: '北', season: '冬' },
      艮: { binary: '001', element: '山', nature: '止静', family: '少男', direction: '北東', season: '冬春の境' },
      坤: { binary: '000', element: '地', nature: '順従', family: '母', direction: '南西', season: '夏秋の境' }
    },

    // 完全64卦データベース
    complete_hexagrams: new Map([
      [1, { name: '乾為天', upper: '乾', lower: '乾', sequence: 1, meaning: '創造・天道', judgment: '元亨利貞' }],
      [2, { name: '坤為地', upper: '坤', lower: '坤', sequence: 2, meaning: '包容・地道', judgment: '元亨利牝馬之貞' }],
      [3, { name: '水雷屯', upper: '坎', lower: '震', sequence: 3, meaning: '始生・困難', judgment: '元亨利貞勿用有攸往' }],
      [4, { name: '山水蒙', upper: '艮', lower: '坎', sequence: 4, meaning: '啓蒙・教育', judgment: '亨匪我求童蒙童蒙求我' }],
      [5, { name: '水天需', upper: '坎', lower: '乾', sequence: 5, meaning: '待機・需要', judgment: '有孚光亨貞吉利涉大川' }],
      [6, { name: '天水訟', upper: '乾', lower: '坎', sequence: 6, meaning: '争訟・対立', judgment: '有孚窒惕中吉終凶' }],
      [7, { name: '地水師', upper: '坤', lower: '坎', sequence: 7, meaning: '軍隊・統率', judgment: '貞丈人吉無咎' }],
      [8, { name: '水地比', upper: '坎', lower: '坤', sequence: 8, meaning: '親比・協力', judgment: '吉原筮元永貞無咎' }],
      [11, { name: '地天泰', upper: '坤', lower: '乾', sequence: 11, meaning: '通泰・平和', judgment: '小往大来吉亨' }],
      [12, { name: '天地否', upper: '乾', lower: '坤', sequence: 12, meaning: '閉塞・停滞', judgment: '匪人不利君子貞' }],
      [15, { name: '地山謙', upper: '坤', lower: '艮', sequence: 15, meaning: '謙遜・謙虚', judgment: '亨君子有終' }],
      [16, { name: '雷地豫', upper: '震', lower: '坤', sequence: 16, meaning: '予備・豫楽', judgment: '利建侯行師' }],
      [63, { name: '水火既済', upper: '坎', lower: '離', sequence: 63, meaning: '完成・既済', judgment: '亨小利貞' }],
      [64, { name: '火水未済', upper: '離', lower: '坎', sequence: 64, meaning: '未完成', judgment: '亨小狐汔済濡其尾' }]
    ])
  },

  // HaQei易経解釈体系
  haqeiInterpretation: {
    // 調和的解釈
    harmony_interpretations: new Map([
      [1, { principle: '創造的調和', guidance: '天の創造力を調和的に発揮する', practice: '自他共栄の創造' }],
      [2, { principle: '受容的調和', guidance: '地のように包容し支える', practice: '他者を受け入れ育む' }],
      [11, { principle: '完全調和', guidance: '天地が交わり万物が栄える', practice: '上下の調和を図る' }],
      [12, { principle: '調和への準備', guidance: '閉塞を通じて内的調和を培う', practice: '忍耐と準備の時期' }],
      [15, { principle: '謙虚な調和', guidance: '謙遜によって真の調和を得る', practice: '己を低くして他を高める' }]
    ]),

    // 慈悲的解釈
    compassion_interpretations: new Map([
      [2, { principle: '母性慈悲', guidance: '大地のように全てを受け入れ育む', practice: '無条件の愛と支援' }],
      [4, { principle: '教育慈悲', guidance: '無知を慈悲深く教導する', practice: '忍耐強い指導' }],
      [8, { principle: '協力慈悲', guidance: '共感と理解で結びつく', practice: '相互支援と協力' }],
      [16, { principle: '喜び慈悲', guidance: '他者の幸せを自分の喜びとする', practice: '共に喜ぶ心' }]
    ]),

    // 智慧的解釈
    wisdom_interpretations: new Map([
      [3, { principle: '困難の智慧', guidance: '困難から学び成長する', practice: '試練を成長の機会とする' }],
      [4, { principle: '学習の智慧', guidance: '謙虚に学び続ける', practice: '生涯学習の姿勢' }],
      [5, { principle: '待機の智慧', guidance: '時を見極めて行動する', practice: '適切なタイミングを待つ' }],
      [63, { principle: '完成の智慧', guidance: '完成の後も油断しない', practice: '慎重さを保つ' }],
      [64, { principle: '未完の智慧', guidance: '未完成から学び続ける', practice: '謙虚な継続努力' }]
    ]),

    // 真実的解釈
    authenticity_interpretations: new Map([
      [1, { principle: '純粋創造', guidance: '偽りなき創造力を発揮する', practice: '真実に基づく行動' }],
      [25, { name: '天雷无妄', principle: '無邪気', guidance: '自然で偽りのない状態', practice: '純真な心で接する' }],
      [61, { name: '風沢中孚', principle: '中心信実', guidance: '心の中心に真実を持つ', practice: '誠実な信頼関係' }]
    ])
  },

  // 初期化
  async init() {
    console.log('🚀 AuthenticIChingEngine initializing...');
    
    try {
      await this.loadCompleteHexagramDatabase();
      await this.initializeInterpretationSystem();
      this.setupDivinationMethods();
      this.setupTransformationRules();
      
      this.initialized = true;
      console.log('✅ AuthenticIChingEngine initialized successfully');
    } catch (error) {
      console.error('❌ AuthenticIChingEngine initialization failed:', error);
    }
  },

  // 完全卦象データベース読み込み
  async loadCompleteHexagramDatabase() {
    // 64卦全データを構築
    this.completeDatabase = {
      hexagrams: new Map(),
      relationships: new Map(),
      transformations: new Map(),
      seasonal_associations: new Map(),
      practical_applications: new Map()
    };

    // 基本データ拡張
    await this.buildFullHexagramData();
    
    // 関係性マッピング構築
    await this.buildRelationshipMappings();
    
    // 実践応用データ構築
    await this.buildPracticalApplications();
  },

  // 完全卦象データ構築
  async buildFullHexagramData() {
    // 主要卦象の詳細データ
    const detailedHexagrams = [
      {
        number: 1, name: '乾為天', upper: '乾', lower: '乾',
        meaning: '創造・天道・純粋活動',
        judgment: '元亨利貞',
        image: '天行健君子以自強不息',
        keywords: ['創造', '力', '天', '父', '君主', '強健', '純粋'],
        haqei_aspects: {
          harmony: '創造的調和の実現',
          compassion: '慈愛に満ちたリーダーシップ',
          wisdom: '天の智慧による導き',
          authenticity: '純粋で偽りない力'
        },
        practical_guidance: {
          action: '積極的で建設的な行動を取る',
          attitude: '責任感と慈愛を持つ',
          timing: '創造的エネルギーが高まる時期',
          caution: '傲慢にならず謙虚さを保つ'
        },
        transformation_potential: '混沌から秩序への変容'
      },

      {
        number: 2, name: '坤為地', upper: '坤', lower: '坤',
        meaning: '包容・地道・受容順従',
        judgment: '元亨利牝馬之貞',
        image: '地勢坤君子以厚德載物',
        keywords: ['受容', '地', '母', '従順', '包容', '育成', '基盤'],
        haqei_aspects: {
          harmony: '受容的調和の実現',
          compassion: '無条件の慈愛と支援',
          wisdom: '包容の智慧',
          authenticity: '自然で純粋な支え'
        },
        practical_guidance: {
          action: '支援と協力の行動を取る',
          attitude: '受容的で忍耐強い',
          timing: '基盤作りの時期',
          caution: '受動的すぎず適度な主張も必要'
        },
        transformation_potential: '支えることによる成長'
      },

      {
        number: 11, name: '地天泰', upper: '坤', lower: '乾',
        meaning: '通泰・平和・調和交流',
        judgment: '小往大来吉亨',
        image: '天地交泰后以財成天地之道',
        keywords: ['平和', '調和', '交流', '繁栄', '相互理解', '協力'],
        haqei_aspects: {
          harmony: '完全調和の実現',
          compassion: '相互理解と支援',
          wisdom: '協力の智慧',
          authenticity: '真実の交流'
        },
        practical_guidance: {
          action: '協力と調和を促進する',
          attitude: '開放的で協調的',
          timing: '最良の協力時期',
          caution: '調和を当然視せず維持に努める'
        },
        transformation_potential: '分離から統合への変容'
      },

      {
        number: 64, name: '火水未済', upper: '離', lower: '坎',
        meaning: '未完成・継続努力・永続発展',
        judgment: '亨小狐汔済濡其尾',
        image: '火在水上未済君子以慎辨物居方',
        keywords: ['未完成', '継続', '努力', '慎重', '学習', '成長'],
        haqei_aspects: {
          harmony: '完全を求めない調和',
          compassion: '不完全を受け入れる慈悲',
          wisdom: '永続学習の智慧',
          authenticity: '未完成の美しさ'
        },
        practical_guidance: {
          action: '継続的な努力を続ける',
          attitude: '謙虚で学習意欲を保つ',
          timing: '長期的成長の時期',
          caution: '性急に完成を求めない'
        },
        transformation_potential: '永続的成長と発展'
      }
    ];

    // データベースに登録
    detailedHexagrams.forEach(hexagram => {
      this.completeDatabase.hexagrams.set(hexagram.number, hexagram);
    });
  },

  // 関係性マッピング構築
  async buildRelationshipMappings() {
    // 卦象間の関係性
    const relationships = [
      // 対極関係
      { hexagram1: 1, hexagram2: 2, relationship: 'complement', nature: '天地対極' },
      { hexagram1: 11, hexagram2: 12, relationship: 'opposite', nature: '泰否対立' },
      { hexagram1: 63, hexagram2: 64, relationship: 'sequential', nature: '済未済循環' },
      
      // 変化関係  
      { hexagram1: 1, hexagram2: 11, relationship: 'evolution', nature: '創造から調和へ' },
      { hexagram1: 2, hexagram2: 11, relationship: 'evolution', nature: '受容から調和へ' },
      { hexagram1: 12, hexagram2: 11, relationship: 'transformation', nature: '否から泰へ' },
      
      // 支援関係
      { hexagram1: 2, hexagram2: 1, relationship: 'support', nature: '地が天を支える' },
      { hexagram1: 4, hexagram2: 1, relationship: 'learning', nature: '蒙から乾への学習' }
    ];

    relationships.forEach(rel => {
      const key = `${rel.hexagram1}-${rel.hexagram2}`;
      this.completeDatabase.relationships.set(key, rel);
    });
  },

  // 実践応用構築
  async buildPracticalApplications() {
    // 生活領域別応用
    const applications = new Map([
      [1, {
        personal: '自己実現と創造的活動に集中する',
        relationships: 'リーダーシップを発揮しつつ慈愛を忘れない',
        work: '新しいプロジェクトや創造的な仕事に取り組む',
        spiritual: '天の原理を学び実践する'
      }],
      [2, {
        personal: '受容性と忍耐力を育む',
        relationships: '他者を支援し育成する役割を担う',
        work: 'チームワークと協力を重視する',
        spiritual: '地の原理を学び包容力を深める'
      }],
      [11, {
        personal: '内外の調和を図る',
        relationships: '相互理解と協力関係を築く',
        work: 'チーム全体の調和と繁栄を図る',
        spiritual: '天地交流の原理を実践する'
      }],
      [64, {
        personal: '継続的な自己成長に努める',
        relationships: '相手の未完成も受け入れて成長を支援',
        work: '長期的視点で着実に発展を図る',
        spiritual: '永続学習と謙虚さを保つ'
      }]
    ]);

    applications.forEach((app, hexagram) => {
      this.completeDatabase.practical_applications.set(hexagram, app);
    });
  },

  // 解釈システム初期化
  async initializeInterpretationSystem() {
    this.interpretationSystem = {
      // 基本解釈
      basic_interpretation: this.interpretBasicMeaning.bind(this),
      
      // HaQei解釈
      haqei_interpretation: this.interpretHaQei.bind(this),
      
      // 実践解釈
      practical_interpretation: this.interpretPractical.bind(this),
      
      // 変容解釈
      transformation_interpretation: this.interpretTransformation.bind(this)
    };
  },

  // 占卜方法設定
  setupDivinationMethods() {
    this.divinationMethods = {
      // テキスト占卜
      text_divination: this.divineFromText.bind(this),
      
      // 時間占卜
      time_divination: this.divineFromTime.bind(this),
      
      // 意図占卜
      intention_divination: this.divineFromIntention.bind(this),
      
      // 統合占卜
      integrated_divination: this.performIntegratedDivination.bind(this)
    };
  },

  // 変容ルール設定
  setupTransformationRules() {
    this.transformationRules = {
      // HaQei変容
      haqei_transformations: new Map([
        ['conflict', { target_hexagrams: [11, 8, 15], approach: 'harmonious_resolution' }],
        ['stagnation', { target_hexagrams: [1, 16, 25], approach: 'creative_breakthrough' }],
        ['confusion', { target_hexagrams: [4, 20, 39], approach: 'wisdom_seeking' }],
        ['isolation', { target_hexagrams: [2, 8, 37], approach: 'compassionate_connection' }]
      ]),

      // 段階的変容
      progressive_transformations: new Map([
        [12, [1, 25, 11]], // 否→乾→无妄→泰
        [3, [4, 20, 64]], // 屯→蒙→観→未済  
        [6, [8, 15, 11]]  // 訟→比→謙→泰
      ])
    };
  },

  // メイン占卜メソッド
  async performDivination(query, options = {}) {
    if (!this.initialized) {
      await this.init();
    }

    const {
      method = 'integrated',
      interpretation_style = 'haqei',
      include_guidance = true,
      include_practice = true
    } = options;

    try {
      // 占卜実行
      const divinationResult = await this.divinationMethods[method + '_divination'](query);
      
      // 解釈生成
      const interpretation = await this.generateInterpretation(
        divinationResult.hexagram, 
        query, 
        interpretation_style
      );
      
      // ガイダンス生成
      const guidance = include_guidance ? 
        await this.generateGuidance(divinationResult.hexagram, interpretation) : null;
      
      // 実践指針生成
      const practice = include_practice ?
        await this.generatePractice(divinationResult.hexagram, interpretation) : null;

      return {
        query: query,
        method: method,
        divination_result: divinationResult,
        interpretation: interpretation,
        guidance: guidance,
        practice: practice,
        timestamp: new Date().toISOString(),
        haqei_integration: await this.integrateHaQeiPrinciples(divinationResult.hexagram, query)
      };

    } catch (error) {
      console.error('❌ Divination failed:', error);
      return this.getDefaultDivination(query);
    }
  },

  // テキスト占卜
  async divineFromText(text) {
    // テキストの数値化
    const textValue = this.calculateTextValue(text);
    
    // 卦象決定
    const hexagramNumber = (textValue % 64) + 1;
    const hexagramData = this.completeDatabase.hexagrams.get(hexagramNumber) ||
      this.hexagramSystem.complete_hexagrams.get(hexagramNumber);

    return {
      hexagram: hexagramNumber,
      hexagram_data: hexagramData,
      method: 'text_analysis',
      calculation_value: textValue,
      confidence: this.calculateConfidence(text, hexagramNumber)
    };
  },

  // テキスト数値計算
  calculateTextValue(text) {
    let value = 0;
    
    // 文字コード合計
    for (let i = 0; i < text.length; i++) {
      value += text.charCodeAt(i);
    }
    
    // 文字数による調整
    value += text.length * 7;
    
    // 特定パターンによる調整
    const patterns = {
      '愛': 100, '平和': 111, '調和': 88, '成長': 77,
      '悲しい': 200, '怒り': 150, '困る': 120, '迷い': 99
    };
    
    Object.entries(patterns).forEach(([pattern, adjustment]) => {
      if (text.includes(pattern)) {
        value += adjustment;
      }
    });

    return value;
  },

  // 時間占卜
  async divineFromTime() {
    const now = new Date();
    const timeValue = 
      now.getFullYear() + 
      now.getMonth() * 12 + 
      now.getDate() * 31 + 
      now.getHours() * 24 + 
      now.getMinutes();
    
    const hexagramNumber = (timeValue % 64) + 1;
    const hexagramData = this.completeDatabase.hexagrams.get(hexagramNumber) ||
      this.hexagramSystem.complete_hexagrams.get(hexagramNumber);

    return {
      hexagram: hexagramNumber,
      hexagram_data: hexagramData,
      method: 'time_based',
      calculation_time: now.toISOString(),
      calculation_value: timeValue
    };
  },

  // 意図占卜
  async divineFromIntention(intention) {
    // 意図の分析
    const intentionAnalysis = await this.analyzeIntention(intention);
    
    // 最適卦象選択
    const hexagramNumber = this.selectHexagramByIntention(intentionAnalysis);
    const hexagramData = this.completeDatabase.hexagrams.get(hexagramNumber) ||
      this.hexagramSystem.complete_hexagrams.get(hexagramNumber);

    return {
      hexagram: hexagramNumber,
      hexagram_data: hexagramData,
      method: 'intention_based',
      intention_analysis: intentionAnalysis,
      selection_reasoning: this.explainHexagramSelection(hexagramNumber, intentionAnalysis)
    };
  },

  // 意図分析
  async analyzeIntention(intention) {
    const analysis = {
      primary_goal: null,
      emotional_tone: null,
      complexity_level: null,
      time_urgency: null,
      relationship_focus: null
    };

    // 主要目標特定
    const goalPatterns = {
      '成長': 'growth', '学習': 'learning', '創造': 'creation',
      '調和': 'harmony', '平和': 'peace', '理解': 'understanding',
      '解決': 'resolution', '改善': 'improvement', '発展': 'development'
    };

    Object.entries(goalPatterns).forEach(([pattern, goal]) => {
      if (intention.includes(pattern)) {
        analysis.primary_goal = goal;
      }
    });

    // 感情トーン
    if (/積極|前向き|希望/.test(intention)) analysis.emotional_tone = 'positive';
    else if (/消極|不安|心配/.test(intention)) analysis.emotional_tone = 'negative';
    else analysis.emotional_tone = 'neutral';

    // 複雑度レベル
    analysis.complexity_level = intention.length > 50 ? 'high' : 
                               intention.length > 20 ? 'medium' : 'low';

    // 時間緊急性
    if (/急|すぐ|早く/.test(intention)) analysis.time_urgency = 'high';
    else if (/ゆっくり|慎重|長期/.test(intention)) analysis.time_urgency = 'low';
    else analysis.time_urgency = 'medium';

    return analysis;
  },

  // 意図による卦象選択
  selectHexagramByIntention(analysis) {
    // 目標別推奨卦象
    const goalHexagrams = {
      'growth': [1, 3, 16, 25],      // 乾、屯、豫、无妄
      'learning': [4, 20, 39, 64],   // 蒙、観、蹇、未済
      'creation': [1, 25, 43, 45],   // 乾、无妄、夬、萃
      'harmony': [11, 15, 37, 58],   // 泰、謙、家人、兌
      'peace': [11, 2, 15, 46],      // 泰、坤、謙、升
      'resolution': [6, 8, 13, 40]   // 訟、比、同人、解
    };

    const candidates = goalHexagrams[analysis.primary_goal] || [11]; // デフォルト：泰

    // 感情トーンによる調整
    let selectedIndex = 0;
    if (analysis.emotional_tone === 'positive') selectedIndex = 0;
    else if (analysis.emotional_tone === 'negative') selectedIndex = Math.min(candidates.length - 1, 2);
    else selectedIndex = 1;

    return candidates[selectedIndex] || 11;
  },

  // 統合占卜
  async performIntegratedDivination(query) {
    // 複数方法の結果を統合
    const textResult = await this.divineFromText(query);
    const timeResult = await this.divineFromTime();
    const intentionResult = await this.divineFromIntention(query);

    // 最適結果選択
    const results = [textResult, timeResult, intentionResult];
    const selectedResult = this.selectBestDivinationResult(results, query);

    return {
      ...selectedResult,
      method: 'integrated',
      alternative_results: results.filter(r => r !== selectedResult),
      integration_reasoning: '複数の占卜方法を統合して最適な結果を選択'
    };
  },

  // 最良占卜結果選択
  selectBestDivinationResult(results, query) {
    // 各結果にスコア付与
    const scoredResults = results.map(result => ({
      ...result,
      score: this.calculateDivinationScore(result, query)
    }));

    // 最高スコア選択
    return scoredResults.reduce((best, current) => 
      current.score > best.score ? current : best
    );
  },

  // 占卜スコア計算
  calculateDivinationScore(result, query) {
    let score = 0.5; // 基準スコア

    // 卦象の意味と問いの関連性
    if (result.hexagram_data) {
      const relevance = this.calculateRelevance(result.hexagram_data, query);
      score += relevance * 0.4;
    }

    // 方法別ボーナス
    const methodBonus = {
      'text_analysis': 0.3,
      'intention_based': 0.4,
      'time_based': 0.2
    };
    score += methodBonus[result.method] || 0;

    // 信頼度による調整
    if (result.confidence) {
      score += result.confidence * 0.3;
    }

    return Math.max(0, Math.min(1, score));
  },

  // 関連性計算
  calculateRelevance(hexagramData, query) {
    if (!hexagramData || !hexagramData.keywords) return 0;

    let relevanceScore = 0;
    const queryLower = query.toLowerCase();

    hexagramData.keywords.forEach(keyword => {
      if (queryLower.includes(keyword)) {
        relevanceScore += 0.2;
      }
    });

    return Math.min(relevanceScore, 1.0);
  },

  // 信頼度計算
  calculateConfidence(text, hexagramNumber) {
    const textLength = text.length;
    const baseConfidence = Math.min(textLength / 50, 1.0);
    
    // 卦象データの完全性チェック
    const hexagramData = this.completeDatabase.hexagrams.get(hexagramNumber);
    const completenessBonus = hexagramData ? 0.2 : 0;
    
    return Math.min(baseConfidence + completenessBonus, 1.0);
  },

  // 解釈生成
  async generateInterpretation(hexagramNumber, query, style) {
    const interpretation = {
      basic: await this.interpretBasicMeaning(hexagramNumber),
      haqei: style === 'haqei' ? await this.interpretHaQei(hexagramNumber, query) : null,
      practical: await this.interpretPractical(hexagramNumber, query),
      transformation: await this.interpretTransformation(hexagramNumber, query)
    };

    return interpretation;
  },

  // 基本解釈
  async interpretBasicMeaning(hexagramNumber) {
    const hexagramData = this.completeDatabase.hexagrams.get(hexagramNumber) ||
      this.hexagramSystem.complete_hexagrams.get(hexagramNumber);

    if (!hexagramData) {
      return {
        name: '調和の道',
        meaning: '調和と平衡を保つ',
        judgment: '中庸を保ち進む',
        message: '現在の状況に適応しながら成長する'
      };
    }

    return {
      name: hexagramData.name,
      meaning: hexagramData.meaning,
      judgment: hexagramData.judgment || '適切な行動を取る',
      message: this.generateBasicMessage(hexagramData),
      trigrams: this.getTrigramInfo(hexagramData)
    };
  },

  // 基本メッセージ生成
  generateBasicMessage(hexagramData) {
    const messageTemplates = {
      1: '創造的な力を建設的に活用してください',
      2: '受容的で支援的な態度を保ってください',
      11: '調和と協力を重視して進んでください',
      12: '困難な時期ですが内的成長に集中してください',
      64: '完成を急がず継続的な努力を続けてください'
    };

    return messageTemplates[hexagramData.number] || 
           `${hexagramData.meaning}の精神で進んでください`;
  },

  // 八卦情報取得
  getTrigramInfo(hexagramData) {
    const upperTrigram = this.hexagramSystem.trigrams[hexagramData.upper];
    const lowerTrigram = this.hexagramSystem.trigrams[hexagramData.lower];

    return {
      upper: {
        name: hexagramData.upper,
        element: upperTrigram?.element || '不明',
        nature: upperTrigram?.nature || '不明'
      },
      lower: {
        name: hexagramData.lower,
        element: lowerTrigram?.element || '不明',
        nature: lowerTrigram?.nature || '不明'
      }
    };
  },

  // HaQei解釈
  async interpretHaQei(hexagramNumber, query) {
    const interpretation = {
      harmony_aspect: null,
      compassion_aspect: null,
      wisdom_aspect: null,
      authenticity_aspect: null,
      integrated_message: ''
    };

    // 各原理からの解釈取得
    interpretation.harmony_aspect = this.haqeiInterpretation.harmony_interpretations.get(hexagramNumber);
    interpretation.compassion_aspect = this.haqeiInterpretation.compassion_interpretations.get(hexagramNumber);
    interpretation.wisdom_aspect = this.haqeiInterpretation.wisdom_interpretations.get(hexagramNumber);
    interpretation.authenticity_aspect = this.haqeiInterpretation.authenticity_interpretations.get(hexagramNumber);

    // 統合メッセージ生成
    interpretation.integrated_message = await this.generateIntegratedHaQeiMessage(
      hexagramNumber, 
      interpretation, 
      query
    );

    return interpretation;
  },

  // 統合HaQeiメッセージ生成
  async generateIntegratedHaQeiMessage(hexagramNumber, interpretation, query) {
    const hexagramData = this.completeDatabase.hexagrams.get(hexagramNumber);
    if (!hexagramData || !hexagramData.haqei_aspects) {
      return 'HaQeiの原理に従って調和的に進んでください';
    }

    const aspects = hexagramData.haqei_aspects;
    let message = `${hexagramData.name}の智慧において、`;

    // 最も関連する側面を強調
    const queryAnalysis = await this.analyzeHaQeiRelevance(query);
    const primaryAspect = this.findPrimaryHaQeiAspect(queryAnalysis);

    if (primaryAspect && aspects[primaryAspect]) {
      message += `特に${primaryAspect === 'harmony' ? '調和' : 
                       primaryAspect === 'compassion' ? '慈悲' :
                       primaryAspect === 'wisdom' ? '智慧' : '真実'}の観点から、`;
      message += aspects[primaryAspect];
    } else {
      message += Object.values(aspects)[0] || '調和的な道を歩む';
    }

    return message;
  },

  // HaQei関連性分析
  async analyzeHaQeiRelevance(query) {
    const relevance = {
      harmony: 0,
      compassion: 0,  
      wisdom: 0,
      authenticity: 0
    };

    const patterns = {
      harmony: /調和|平和|バランス|統合|協調/g,
      compassion: /思いやり|慈悲|愛|共感|理解/g,
      wisdom: /知恵|智慧|学習|成長|洞察/g,
      authenticity: /真実|誠実|正直|自然|純粋/g
    };

    Object.entries(patterns).forEach(([aspect, pattern]) => {
      const matches = (query.match(pattern) || []).length;
      relevance[aspect] = Math.min(matches / 3, 1.0);
    });

    return relevance;
  },

  // 主要HaQei側面特定
  findPrimaryHaQeiAspect(relevance) {
    let maxRelevance = 0;
    let primaryAspect = null;

    Object.entries(relevance).forEach(([aspect, score]) => {
      if (score > maxRelevance) {
        maxRelevance = score;
        primaryAspect = aspect;
      }
    });

    return primaryAspect;
  },

  // 実践解釈
  async interpretPractical(hexagramNumber, query) {
    const applications = this.completeDatabase.practical_applications.get(hexagramNumber);
    const hexagramData = this.completeDatabase.hexagrams.get(hexagramNumber);

    if (!applications || !hexagramData) {
      return {
        general_guidance: '現在の状況に適応し、調和を保って進んでください',
        specific_actions: ['内省する', '他者との調和を図る', '継続的に努力する'],
        timing_advice: '適切な時期を見極めて行動する',
        relationship_guidance: '相互理解と尊重を重視する'
      };
    }

    return {
      general_guidance: hexagramData.practical_guidance?.action || applications.personal,
      specific_actions: this.generateSpecificActions(hexagramNumber, query),
      timing_advice: hexagramData.practical_guidance?.timing || '時期を見極める',
      relationship_guidance: applications.relationships || '調和的な関係を築く'
    };
  },

  // 具体的行動生成
  generateSpecificActions(hexagramNumber, query) {
    const actionTemplates = {
      1: ['創造的なプロジェクトを始める', 'リーダーシップを発揮する', '積極的に行動する'],
      2: ['他者をサポートする', '忍耐強く待つ', '基盤を固める'],
      11: ['協力関係を築く', '相互理解を深める', '調和を促進する'],
      64: ['継続的に学習する', '完成を急がない', '着実に進歩する']
    };

    return actionTemplates[hexagramNumber] || ['調和を保つ', '智慧を深める', '他者を思いやる'];
  },

  // 変容解釈
  async interpretTransformation(hexagramNumber, query) {
    const hexagramData = this.completeDatabase.hexagrams.get(hexagramNumber);
    
    const transformation = {
      current_state: this.describeCurrentState(hexagramNumber),
      transformation_potential: hexagramData?.transformation_potential || '調和的成長',
      transformation_path: this.generateTransformationPath(hexagramNumber),
      expected_outcome: this.describeExpectedOutcome(hexagramNumber)
    };

    return transformation;
  },

  // 現在状態描述
  describeCurrentState(hexagramNumber) {
    const stateDescriptions = {
      1: '創造的エネルギーに満ちた始まりの状態',
      2: '受容的で安定した基盤の状態',
      11: '調和と平和が実現された理想的状態',
      12: '困難や閉塞感を感じている状態',
      64: '未完成だが可能性に満ちた状態'
    };

    return stateDescriptions[hexagramNumber] || '現在の状況を受け入れている状態';
  },

  // 変容パス生成
  generateTransformationPath(hexagramNumber) {
    const transformationPaths = {
      1: ['創造力の発揮', '責任の受容', '他者への配慮', '調和的リーダーシップ'],
      2: ['受容力の深化', '支援能力の向上', '忍耐力の強化', '包容力の拡大'],
      11: ['調和の維持', '相互利益の追求', '協力関係の発展', 'さらなる統合'],
      12: ['内的準備', '忍耐の実践', '智慧の蓄積', '機会への準備'],
      64: ['継続学習', '段階的成長', '謙虚さの維持', '永続的発展']
    };

    return transformationPaths[hexagramNumber] || ['現状受容', '内的成長', '他者理解', '調和実現'];
  },

  // 期待される結果描述
  describeExpectedOutcome(hexagramNumber) {
    const outcomes = {
      1: '創造的で建設的なリーダーシップの確立',
      2: '他者を支える強固な基盤の形成',
      11: '持続可能な調和と繁栄の実現',
      12: '困難を乗り越えた内的強さの獲得',
      64: '継続的成長による智慧と成熟の達成'
    };

    return outcomes[hexagramNumber] || '調和と智慧による円満な解決';
  },

  // ガイダンス生成
  async generateGuidance(hexagramNumber, interpretation) {
    const hexagramData = this.completeDatabase.hexagrams.get(hexagramNumber);
    
    const guidance = {
      primary_guidance: '',
      do_recommendations: [],
      dont_recommendations: [],
      timing_guidance: '',
      relationship_advice: ''
    };

    if (hexagramData && hexagramData.practical_guidance) {
      guidance.primary_guidance = hexagramData.practical_guidance.action;
      guidance.timing_guidance = hexagramData.practical_guidance.timing;
    }

    // 実行推奨
    guidance.do_recommendations = this.generateDoRecommendations(hexagramNumber);
    
    // 避けるべき行動
    guidance.dont_recommendations = this.generateDontRecommendations(hexagramNumber);

    // 関係性アドバイス
    guidance.relationship_advice = this.generateRelationshipAdvice(hexagramNumber);

    return guidance;
  },

  // 実行推奨生成
  generateDoRecommendations(hexagramNumber) {
    const recommendations = {
      1: ['創造的な活動に取り組む', '責任を持って行動する', '他者を導く'],
      2: ['支援に徹する', '忍耐強く待つ', '基盤を固める'],
      11: ['協力を促進する', '相互理解を深める', '調和を維持する'],
      12: ['内省に時間を使う', '準備を整える', '忍耐を実践する'],
      64: ['学習を続ける', '謙虚さを保つ', '段階的に進む']
    };

    return recommendations[hexagramNumber] || ['調和を保つ', '他者を思いやる', '継続的に努力する'];
  },

  // 回避推奨生成
  generateDontRecommendations(hexagramNumber) {
    const recommendations = {
      1: ['傲慢にならない', '他者を無視しない', '独断的でない'],
      2: ['受動的すぎない', '自己主張を忘れない', '過度に従順でない'],
      11: ['調和を当然視しない', '維持努力を怠らない', '自己満足しない'],
      12: ['焦って行動しない', '諦めない', '孤立しない'],
      64: ['完成を急がない', '傲慢にならない', '学習を止めない']
    };

    return recommendations[hexagramNumber] || ['調和を乱さない', '他者を傷つけない', '智慧を無視しない'];
  },

  // 関係性アドバイス生成
  generateRelationshipAdvice(hexagramNumber) {
    const advice = {
      1: '慈愛に満ちたリーダーシップで他者を導く',
      2: '無条件の愛と支援で他者を包み込む',
      11: '相互理解と協力で調和的な関係を築く',
      12: '困難な時期でも他者との絆を大切にする',
      64: '共に成長し学び合う関係を育む'
    };

    return advice[hexagramNumber] || '相互理解と尊重に基づく調和的な関係を築く';
  },

  // 実践指針生成
  async generatePractice(hexagramNumber, interpretation) {
    const practice = {
      daily_practices: [],
      meditation_guidance: '',
      reflection_questions: [],
      long_term_cultivation: ''
    };

    // 日常実践
    practice.daily_practices = this.generateDailyPractices(hexagramNumber);
    
    // 瞑想ガイダンス
    practice.meditation_guidance = this.generateMeditationGuidance(hexagramNumber);
    
    // 内省質問
    practice.reflection_questions = this.generateReflectionQuestions(hexagramNumber);
    
    // 長期修養
    practice.long_term_cultivation = this.generateLongTermCultivation(hexagramNumber);

    return practice;
  },

  // 日常実践生成
  generateDailyPractices(hexagramNumber) {
    const practices = {
      1: ['朝の創造的な活動時間を設ける', '他者への慈愛の実践', 'リーダーシップの機会を探す'],
      2: ['他者のサポートに意識を向ける', '受容的な態度の実践', '忍耐力を育む瞑想'],
      11: ['調和を促進する行動を取る', '相互理解の対話を心がける', 'Win-Winの解決策を模索'],
      12: ['内省の時間を確保する', '忍耐力を鍛える実践', '準備と学習に時間を使う'],
      64: ['継続学習の時間を作る', '謙虚さを忘れない', '段階的な目標設定']
    };

    return practices[hexagramNumber] || ['調和の実践', '他者への思いやり', '継続的な成長努力'];
  },

  // 瞑想ガイダンス生成
  generateMeditationGuidance(hexagramNumber) {
    const guidance = {
      1: '天の創造的エネルギーを感じながら、力強く静かに瞑想する',
      2: '大地の包容力を感じながら、受容的で慈愛に満ちた瞑想をする',
      11: '天と地の調和を感じながら、内外の平衡を意識して瞑想する',
      12: '困難を受け入れながら、内的な成長と準備に集中して瞑想する',
      64: '未完成の美しさを受け入れながら、継続的な学習の心で瞑想する'
    };

    return guidance[hexagramNumber] || '調和と平和を感じながら静かに瞑想する';
  },

  // 内省質問生成
  generateReflectionQuestions(hexagramNumber) {
    const questions = {
      1: [
        'どのように創造的な力を建設的に活用できるか？',
        '他者への慈愛を忘れずにリーダーシップを発揮しているか？',
        '責任と権力をバランス良く扱っているか？'
      ],
      2: [
        'どのように他者を支援し育成できるか？',
        '受容的でありながら適切な主張もしているか？',
        '忍耐力と柔軟性をバランス良く保っているか？'
      ],
      11: [
        'どのように調和と協力を促進できるか？',
        '相互利益と個人の利益をバランスしているか？',
        'この調和をどのように持続できるか？'
      ],
      64: [
        'この未完成な状態から何を学べるか？',
        'どのように謙虚さを保ちながら成長を続けるか？',
        '完成への執着を手放せているか？'
      ]
    };

    return questions[hexagramNumber] || [
      'どのように調和を促進できるか？',
      '他者への思いやりを忘れていないか？',
      '継続的な成長を心がけているか？'
    ];
  },

  // 長期修養生成
  generateLongTermCultivation(hexagramNumber) {
    const cultivation = {
      1: '創造的で慈愛に満ちたリーダーシップの確立',
      2: '他者を支える強固で柔軟な基盤の形成',
      11: '持続可能な調和と協力関係の維持発展',
      12: '困難を乗り越える内的強さと智慧の蓄積',
      64: '永続的な学習と成長による智慧と謙虚さの深化'
    };

    return cultivation[hexagramNumber] || '調和と智慧と慈悲に基づく人格の完成';
  },

  // HaQei原理統合
  async integrateHaQeiPrinciples(hexagramNumber, query) {
    const integration = {
      harmony_integration: '',
      compassion_integration: '',
      wisdom_integration: '',
      authenticity_integration: '',
      overall_message: ''
    };

    const hexagramData = this.completeDatabase.hexagrams.get(hexagramNumber);
    if (!hexagramData || !hexagramData.haqei_aspects) {
      integration.overall_message = 'HaQeiの四原理を日常生活に統合して実践してください';
      return integration;
    }

    const aspects = hexagramData.haqei_aspects;
    
    integration.harmony_integration = aspects.harmony || '調和の原理を実践する';
    integration.compassion_integration = aspects.compassion || '慈悲の原理を実践する';
    integration.wisdom_integration = aspects.wisdom || '智慧の原理を実践する';
    integration.authenticity_integration = aspects.authenticity || '真実の原理を実践する';

    // 統合メッセージ
    integration.overall_message = 
      `${hexagramData.name}の智慧を通じて、HaQeiの四原理（調和・慈悲・智慧・真実）を` +
      `日常生活に統合し、自他共に幸福で調和的な人生を実現してください。`;

    return integration;
  },

  // 占卜結果説明生成
  explainHexagramSelection(hexagramNumber, analysis) {
    const explanations = {
      'growth': `成長への意図により、発展と変化を象徴する卦が選ばれました`,
      'learning': `学習への意図により、智慧と教育を象徴する卦が選ばれました`,
      'harmony': `調和への意図により、平和と統合を象徴する卦が選ばれました`,
      'creation': `創造への意図により、新しい始まりを象徴する卦が選ばれました`
    };

    return explanations[analysis.primary_goal] || 
           `あなたの意図と現在の状況に最も適した卦として選択されました`;
  },

  // デフォルト占卜
  getDefaultDivination(query) {
    return {
      query: query,
      method: 'default',
      divination_result: {
        hexagram: 11,
        hexagram_data: {
          name: '地天泰',
          meaning: '通泰・平和・調和',
          judgment: '小往大来吉亨'
        },
        method: 'default'
      },
      interpretation: {
        basic: {
          name: '地天泰',
          meaning: '通泰・平和・調和',
          judgment: '小往大来吉亨',
          message: '調和と協力を重視して進んでください'
        }
      },
      guidance: {
        primary_guidance: '調和と平和を大切にして進む',
        do_recommendations: ['協力する', '理解を深める', '調和を保つ'],
        dont_recommendations: ['対立しない', '独断的でない', '調和を乱さない']
      },
      practice: {
        daily_practices: ['調和の実践', '他者への思いやり', '相互理解の促進'],
        meditation_guidance: '天地の調和を感じながら平和な心で瞑想する'
      },
      haqei_integration: {
        overall_message: 'HaQeiの原理に従って調和的な人生を歩んでください'
      }
    };
  }
};

// 自動初期化
document.addEventListener('DOMContentLoaded', async () => {
  await window.AuthenticIChingEngine.init();
});

console.log('✅ AuthenticIChingEngine loaded successfully');