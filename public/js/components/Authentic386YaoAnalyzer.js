/**
 * Authentic 386爻 Text Analyzer
 * 完全な64卦×6爻＋用九・用六を使用した正確なテキスト分析
 * 
 * CLAUDE.md準拠：指示範囲厳守、根本解決優先
 */

window.Authentic386YaoAnalyzer = class {
  constructor() {
    this.hexagramData = null;
    this.initialized = false;
    this.debugMode = true;
    
    // パフォーマンス最適化: インデックスマップ初期化
    this.keywordHexagramMap = null;
    this.emotionHexagramMap = null;
    this.patternHexagramMap = null;
    this.timePhaseHexagramMap = null;
  }
  
  async initialize() {
    console.log('🎋 Initializing Authentic 386爻 Analyzer...');
    
    try {
      // 完全版386爻データを読み込む
      const response = await fetch('/data/enhanced_hexagrams_complete.json');
      this.hexagramData = await response.json();
      
      // データ検証
      const yaoCount = this.hexagramData.reduce((sum, h) => sum + (h.six_lines?.length || 0), 0);
      const specialCount = this.hexagramData.filter(h => h.special_yao).length;
      
      console.log(`✅ Loaded ${this.hexagramData.length} hexagrams`);
      console.log(`✅ Total lines: ${yaoCount} regular + ${specialCount} special = ${yaoCount + specialCount}`);
      
      // パフォーマンス最適化: インデックスマップ構築
      this.buildOptimizationMaps();
      console.log('🚀 Performance optimization maps built');
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize 386爻 data:', error);
      return false;
    }
  }
  
  /**
   * パフォーマンス最適化: インデックスマップ構築
   */
  buildOptimizationMaps() {
    // キーワード→卦IDマッピング（O(1)検索用）
    this.keywordHexagramMap = new Map([
      ['creation', [1, 3]], // 乾為天, 水雷屯
      ['receptive', [2]], // 坤為地
      ['difficulty', [3, 39]], // 水雷屯, 水山蹇
      ['learning', [4]], // 山水蒙
      ['waiting', [5]], // 水天需
      ['conflict', [6]], // 天水訟
      ['harmony', [11, 13]], // 地天泰, 天火同人
      ['change', [49]], // 沢火革
      ['completion', [63]], // 水火既済
      ['continuation', [64]] // 火水未済
    ]);
    
    // 感情→卦IDマッピング
    this.emotionHexagramMap = new Map([
      ['anxiety', [4, 29]], // 山水蒙, 坎為水
      ['joy', [58, 16]], // 兌為沢, 雷地豫
      ['anger', [31, 21]], // 沢山咸, 火雷噬嗑
      ['sadness', [45, 47]], // 沢地萃, 沢水困
      ['calm', [52, 60]] // 艮為山, 水沢節
    ]);
    
    // パターン→卦IDマッピング
    this.patternHexagramMap = new Map([
      ['high-sensitivity', [31, 61]], // 沢山咸, 風沢中孚
      ['seeking-balance', [60, 15]], // 水沢節, 地山謙
      ['self-improvement', [15, 42]] // 地山謙, 風雷益
    ]);
    
    // 時期→卦IDマッピング
    this.timePhaseHexagramMap = new Map([
      ['beginning', [3, 1]], // 水雷屯, 乾為天
      ['developing', [46, 53]], // 地風升, 風山漸
      ['completion', [63]], // 水火既済
      ['transition', [49, 17]] // 沢火革, 沢雷随
    ]);
    
    // 卦ID→重要度マッピング（動的重み調整用）
    this.hexagramWeights = new Float32Array(65); // 0-64のインデックス
    this.hexagramWeights.fill(5); // 基礎点
    
    // 重要卦への加重
    [1, 2, 31, 15, 60, 49].forEach(id => this.hexagramWeights[id] = 8);
    
    // 動的重み調整システム: コンテキスト別重み
    this.contextualWeights = new Map([
      // 感情的状況での重み調整
      ['emotional-high', new Map([[31, 1.5], [21, 1.3], [58, 1.2]])], // 沢山咸, 火雷噬嗑, 兌為沢
      ['emotional-calm', new Map([[52, 1.5], [60, 1.3], [2, 1.2]])],  // 艮為山, 水沢節, 坤為地
      
      // 時期的状況での重み調整
      ['time-beginning', new Map([[1, 1.4], [3, 1.6], [4, 1.3]])],   // 乾為天, 水雷屯, 山水蒙
      ['time-transition', new Map([[49, 1.6], [17, 1.3], [18, 1.2]])], // 沢火革, 沢雷随, 山風蛊
      ['time-completion', new Map([[63, 1.5], [14, 1.3], [11, 1.2]])], // 水火既済, 火天大有, 地天泰
      
      // 性格的傾向での重み調整
      ['personality-sensitive', new Map([[31, 1.6], [61, 1.4], [37, 1.2]])], // 沢山咸, 風沢中孚, 風火家人
      ['personality-balanced', new Map([[15, 1.5], [60, 1.4], [11, 1.3]])],   // 地山謙, 水沢節, 地天泰
      ['personality-creative', new Map([[1, 1.4], [42, 1.3], [25, 1.2]])],    // 乾為天, 風雷益, 天雷無妄
      
      // 五行状態での重み調整
      ['wuxing-wood-peak', new Map([[1, 1.3], [34, 1.2], [51, 1.1]])],  // 木行極致時
      ['wuxing-fire-peak', new Map([[30, 1.3], [14, 1.2], [21, 1.1]])], // 火行極致時
      ['wuxing-earth-stable', new Map([[2, 1.3], [15, 1.2], [52, 1.1]])], // 土行安定時
      ['wuxing-metal-refined', new Map([[10, 1.3], [58, 1.2], [43, 1.1]])], // 金行精錬時
      ['wuxing-water-deep', new Map([[29, 1.3], [5, 1.2], [48, 1.1]])] // 水行深化時
    ]);
    
    // 五行理論統合: 卦の五行分類
    this.wuxingHexagramMap = new Map([
      // 木行（生長・発展・創造力）
      ['wood', [1, 3, 18, 34, 42, 51, 57]], // 乾為天, 水雷屯, 山風蠱, 雷天大壮, 風雷益, 震為雷, 巽為風
      
      // 火行（発散・明智・情熱）  
      ['fire', [13, 14, 21, 30, 35, 38, 49, 55, 56]], // 天火同人, 火天大有, 火雷噬嗑, 離為火, 火地晋, 火沢睽, 沢火革, 雷火豊, 火山旅
      
      // 土行（安定・中庸・受容）
      ['earth', [2, 7, 8, 15, 16, 20, 23, 24, 33, 52]], // 坤為地, 地水師, 水地比, 地山謙, 雷地豫, 風地観, 山地剥, 地雷復, 天山遯, 艮為山
      
      // 金行（収束・規律・清浄）
      ['metal', [10, 26, 28, 41, 43, 58]], // 天沢履, 山天大畜, 沢風大過, 山沢損, 天沢夬, 兌為沢
      
      // 水行（流動・智恵・柔軟）
      ['water', [5, 6, 29, 39, 47, 48, 60, 63, 64]] // 水天需, 天水訟, 坎為水, 水山蹇, 沢水困, 水風井, 水沢節, 水火既済, 火水未済
    ]);
    
    // 五行相生相克関係
    this.wuxingRelations = new Map([
      // 相生（生じる関係） - ボーナス
      ['wood', { generates: 'fire', generatedBy: 'water' }],
      ['fire', { generates: 'earth', generatedBy: 'wood' }], 
      ['earth', { generates: 'metal', generatedBy: 'fire' }],
      ['metal', { generates: 'water', generatedBy: 'earth' }],
      ['water', { generates: 'wood', generatedBy: 'metal' }],
      
      // 相克（抑制する関係） - ペナルティ
      ['wood', { controls: 'earth', controlledBy: 'metal' }],
      ['fire', { controls: 'metal', controlledBy: 'water' }],
      ['earth', { controls: 'water', controlledBy: 'wood' }],
      ['metal', { controls: 'wood', controlledBy: 'fire' }],
      ['water', { controls: 'fire', controlledBy: 'earth' }]
    ]);
  }
  
  /**
   * テキストから状況卦と爻を精密判定
   */
  analyzeText(text) {
    if (!this.initialized) {
      console.error('❌ Analyzer not initialized');
      return null;
    }
    
    // エラー処理強化: 入力検証
    const validatedText = this.validateAndCleanInput(text);
    if (!validatedText) {
      return null;
    }
    
    console.log('🔍 Analyzing text with 386爻 system:', validatedText.substring(0, 50));
    
    // 1. テキストの深層分析
    const analysis = this.performDeepAnalysis(validatedText);
    
    // 2. 最適な卦を選択
    const hexagram = this.selectOptimalHexagram(analysis);
    
    // 3. その卦の文脈で最適な爻を選択
    const yao = this.selectOptimalYao(validatedText, hexagram, analysis);
    
    // 4. 特別な爻の判定（用九・用六）
    const specialYao = this.checkSpecialYao(hexagram, analysis);
    
    return {
      hexagram: hexagram,
      yao: yao,
      specialYao: specialYao,
      analysis: analysis,
      confidence: this.calculateConfidence(hexagram, yao, analysis)
    };
  }
  
  /**
   * 入力検証とクリーニング（エラー処理強化）
   */
  validateAndCleanInput(text) {
    // null/undefined チェック
    if (!text) {
      console.warn('⚠️ Empty or null input text');
      return null;
    }
    
    // 型チェック
    if (typeof text !== 'string') {
      console.warn('⚠️ Input is not a string, converting...');
      text = String(text);
    }
    
    // 空文字・空白のみチェック
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      console.warn('⚠️ Input text is empty after trimming');
      return null;
    }
    
    // 長さ制限チェック（パフォーマンス保護）
    if (trimmed.length > 10000) {
      console.warn('⚠️ Input text too long, truncating to 10000 characters');
      return trimmed.substring(0, 10000);
    }
    
    // 最小長チェック
    if (trimmed.length < 2) {
      console.warn('⚠️ Input text too short for meaningful analysis');
      return null;
    }
    
    // 特殊文字のクリーニング（制御文字除去）
    const cleaned = trimmed.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
    
    // 重複空白の正規化
    const normalized = cleaned.replace(/\s+/g, ' ');
    
    return normalized;
  }
  
  /**
   * テキストの深層分析
   */
  performDeepAnalysis(text) {
    const analysis = {
      originalText: text, // 原文を保存
      keywords: [],
      emotions: [],
      timePhase: null,
      intensity: 0,
      patterns: []
    };
    
    // キーワード抽出
    const keywordPatterns = {
      creation: /創造|リーダー|始める|開拓|革新/g,
      receptive: /受容|育む|支える|包容|母性/g,
      difficulty: /困難|苦労|問題|壁|試練/g,
      learning: /学ぶ|教育|成長|啓蒙|未熟/g,
      waiting: /待つ|準備|忍耐|時機|タイミング/g,
      conflict: /争い|対立|議論|衝突|訴訟/g,
      harmony: /調和|協力|親密|仲間|チーム/g,
      change: /変化|変革|革命|転換|改革/g,
      completion: /完成|達成|成功|完了|終了/g,
      continuation: /継続|未完|途中|進行|まだ/g
    };
    
    for (const [key, pattern] of Object.entries(keywordPatterns)) {
      const matches = text.match(pattern);
      if (matches) {
        analysis.keywords.push({ type: key, count: matches.length, words: matches });
      }
    }
    
    // 感情分析
    const emotionPatterns = {
      anxiety: /不安|心配|恐れ|怖い/g,
      joy: /喜び|嬉しい|楽しい|幸せ/g,
      anger: /怒り|イライラ|むかつく|腹立つ/g,
      sadness: /悲しい|寂しい|辛い|苦しい/g,
      calm: /静か|落ち着|平穏|安心/g
    };
    
    for (const [emotion, pattern] of Object.entries(emotionPatterns)) {
      const matches = text.match(pattern);
      if (matches) {
        analysis.emotions.push({ type: emotion, intensity: matches.length });
      }
    }
    
    // 時期・段階の判定
    if (/始め|初め|最初|スタート|新しい/.test(text)) {
      analysis.timePhase = 'beginning';
    } else if (/途中|進行中|まだ|継続/.test(text)) {
      analysis.timePhase = 'developing';
    } else if (/完成|達成|終わり|完了/.test(text)) {
      analysis.timePhase = 'completion';
    } else if (/転換|変化|岐路|選択/.test(text)) {
      analysis.timePhase = 'transition';
    }
    
    // 強度計算
    analysis.intensity = Math.min(
      (analysis.keywords.reduce((sum, k) => sum + k.count, 0) + 
       analysis.emotions.reduce((sum, e) => sum + e.intensity, 0)) / 10,
      1.0
    );
    
    // パターン認識
    if (text.includes('敏感') && text.includes('影響')) {
      analysis.patterns.push('high-sensitivity');
    }
    if (/ニュートラル|バランス|中庸/.test(text)) {
      analysis.patterns.push('seeking-balance');
    }
    if (/自分.*性格|自己.*改善/.test(text)) {
      analysis.patterns.push('self-improvement');
    }
    
    // 五行理論統合: テキストの五行特性判定
    analysis.wuxing = this.analyzeWuxingCharacteristics(text);
    
    return analysis;
  }
  
  /**
   * 五行特性分析（テキストの五行属性判定）
   */
  analyzeWuxingCharacteristics(text) {
    const wuxingScores = {
      wood: 0, // 木行: 成長、発展、創造
      fire: 0, // 火行: 情熱、発散、明智
      earth: 0, // 土行: 安定、中庸、受容
      metal: 0, // 金行: 収束、規律、清浄
      water: 0  // 水行: 流動、智恵、柔軟
    };
    
    // 木行特性の検出
    if (/成長|発展|創造|芽生え|伸びる|拡大|前進|向上/.test(text)) {
      wuxingScores.wood += 3;
    }
    if (/春|青|緑|東|朝|新しい|始まり/.test(text)) {
      wuxingScores.wood += 2;
    }
    if (/怒り|イライラ|肝|目|筋肉/.test(text)) {
      wuxingScores.wood += 1;
    }
    
    // 火行特性の検出
    if (/情熱|熱意|明るい|輝く|発散|表現|喜び|興奮/.test(text)) {
      wuxingScores.fire += 3;
    }
    if (/夏|赤|南|昼|活発|積極的/.test(text)) {
      wuxingScores.fire += 2;
    }
    if (/心|血|舌|笑/.test(text)) {
      wuxingScores.fire += 1;
    }
    
    // 土行特性の検出
    if (/安定|中庸|バランス|調和|受容|包容|土台|基盤/.test(text)) {
      wuxingScores.earth += 3;
    }
    if (/晩夏|黄|中央|夕方|穏やか|謙虚/.test(text)) {
      wuxingScores.earth += 2;
    }
    if (/脾|胃|口|思考/.test(text)) {
      wuxingScores.earth += 1;
    }
    
    // 金行特性の検出
    if (/収束|規律|清浄|整理|潔白|正義|完成|終了/.test(text)) {
      wuxingScores.metal += 3;
    }
    if (/秋|白|西|夜|冷静|理性的/.test(text)) {
      wuxingScores.metal += 2;
    }
    if (/肺|鼻|皮膚|悲しみ/.test(text)) {
      wuxingScores.metal += 1;
    }
    
    // 水行特性の検出
    if (/流動|智恵|柔軟|深い|静か|内向|蓄積|忍耐/.test(text)) {
      wuxingScores.water += 3;
    }
    if (/冬|黒|北|深夜|寒い|暗い/.test(text)) {
      wuxingScores.water += 2;
    }
    if (/腎|耳|骨|恐れ/.test(text)) {
      wuxingScores.water += 1;
    }
    
    // 最高スコアの五行を特定
    const dominantWuxing = Object.entries(wuxingScores)
      .sort(([,a], [,b]) => b - a)[0];
    
    return {
      dominant: dominantWuxing[0],
      score: dominantWuxing[1],
      allScores: wuxingScores
    };
  }
  
  /**
   * 動的重み調整システム（コンテキスト依存スコアリング）
   */
  applyDynamicWeights(scores, analysis) {
    const contexts = this.determineActiveContexts(analysis);
    
    contexts.forEach(context => {
      const weightMap = this.contextualWeights.get(context);
      if (weightMap) {
        weightMap.forEach((multiplier, hexagramId) => {
          if (hexagramId <= 64) {
            scores[hexagramId] *= multiplier; // 動的重み適用
          }
        });
      }
    });
  }
  
  /**
   * アクティブなコンテキストの特定
   */
  determineActiveContexts(analysis) {
    const contexts = [];
    
    // 感情レベルによるコンテキスト
    const emotionIntensity = analysis.emotions.reduce((sum, e) => sum + e.intensity, 0);
    if (emotionIntensity >= 3) {
      contexts.push('emotional-high');
    } else if (analysis.emotions.some(e => e.type === 'calm')) {
      contexts.push('emotional-calm');
    }
    
    // 時期によるコンテキスト
    if (analysis.timePhase) {
      switch (analysis.timePhase) {
        case 'beginning':
          contexts.push('time-beginning');
          break;
        case 'transition':
          contexts.push('time-transition');
          break;
        case 'completion':
          contexts.push('time-completion');
          break;
      }
    }
    
    // パターンによるコンテキスト
    analysis.patterns.forEach(pattern => {
      switch (pattern) {
        case 'high-sensitivity':
          contexts.push('personality-sensitive');
          break;
        case 'seeking-balance':
          contexts.push('personality-balanced');
          break;
        case 'self-improvement':
          contexts.push('personality-creative');
          break;
      }
    });
    
    // 五行状態によるコンテキスト
    if (analysis.wuxing && analysis.wuxing.score >= 3) {
      const wuxingContext = `wuxing-${analysis.wuxing.dominant}`;
      switch (analysis.wuxing.dominant) {
        case 'wood':
          contexts.push('wuxing-wood-peak');
          break;
        case 'fire':
          contexts.push('wuxing-fire-peak');
          break;
        case 'earth':
          contexts.push('wuxing-earth-stable');
          break;
        case 'metal':
          contexts.push('wuxing-metal-refined');
          break;
        case 'water':
          contexts.push('wuxing-water-deep');
          break;
      }
    }
    
    return contexts;
  }
  
  /**
   * 最適な卦を選択（高速化版 O(n²)→O(n)）
   */
  selectOptimalHexagram(analysis) {
    // パフォーマンス最適化: 固定配列で高速スコア計算
    const scores = new Float32Array(65); // 0-64のインデックス
    scores.fill(0);
    
    // 基礎点追加（すべての卦）+ 動的重み調整
    for (let i = 1; i <= 64; i++) {
      scores[i] = this.hexagramWeights[i]; // 事前計算済み重み
    }
    
    // 動的重み調整システム適用
    this.applyDynamicWeights(scores, analysis);
    
    // 高速キーワードマッチング（O(1)検索）
    analysis.keywords.forEach(keyword => {
      const hexagramIds = this.keywordHexagramMap.get(keyword.type);
      if (hexagramIds) {
        hexagramIds.forEach(id => {
          if (id <= 64) {
            scores[id] += keyword.count * 15; // 主要卦
          }
        });
      }
    });
    
    // 高速感情マッチング（O(1)検索）
    analysis.emotions.forEach(emotion => {
      const hexagramIds = this.emotionHexagramMap.get(emotion.type);
      if (hexagramIds) {
        hexagramIds.forEach(id => {
          if (id <= 64) {
            scores[id] += emotion.intensity * 8;
          }
        });
      }
    });
    
    // 高速時期マッチング（O(1)検索）
    if (analysis.timePhase) {
      const hexagramIds = this.timePhaseHexagramMap.get(analysis.timePhase);
      if (hexagramIds) {
        hexagramIds.forEach(id => {
          if (id <= 64) {
            scores[id] += 12;
          }
        });
      }
    }
    
    // 高速パターンマッチング（O(1)検索）
    analysis.patterns.forEach(pattern => {
      const hexagramIds = this.patternHexagramMap.get(pattern);
      if (hexagramIds) {
        hexagramIds.forEach(id => {
          if (id <= 64) {
            scores[id] += 25; // パターンは高配点
          }
        });
      }
    });
    
    // 五行理論統合: 五行相性によるスコア調整
    if (analysis.wuxing && analysis.wuxing.score > 0) {
      const dominantWuxing = analysis.wuxing.dominant;
      const wuxingHexagrams = this.wuxingHexagramMap.get(dominantWuxing);
      
      if (wuxingHexagrams) {
        // 同一五行の卦にボーナス
        wuxingHexagrams.forEach(id => {
          if (id <= 64) {
            scores[id] += analysis.wuxing.score * 10; // 五行一致ボーナス
          }
        });
        
        // 相生関係の卦にボーナス
        const relation = this.wuxingRelations.get(dominantWuxing);
        if (relation) {
          const generatedWuxing = relation.generates;
          const generatedHexagrams = this.wuxingHexagramMap.get(generatedWuxing);
          if (generatedHexagrams) {
            generatedHexagrams.forEach(id => {
              if (id <= 64) {
                scores[id] += analysis.wuxing.score * 5; // 相生ボーナス
              }
            });
          }
          
          // 相克関係の卦にペナルティ
          const controlledWuxing = relation.controls;
          const controlledHexagrams = this.wuxingHexagramMap.get(controlledWuxing);
          if (controlledHexagrams) {
            controlledHexagrams.forEach(id => {
              if (id <= 64) {
                scores[id] -= analysis.wuxing.score * 3; // 相克ペナルティ
              }
            });
          }
        }
      }
    }
    
    // 最高スコアの卦を検索（線形探索で十分高速）
    let maxScore = 0;
    let selectedId = 1;
    for (let i = 1; i <= 64; i++) {
      if (scores[i] > maxScore) {
        maxScore = scores[i];
        selectedId = i;
      }
    }
    
    const selectedHexagram = this.hexagramData.find(h => h.hexagram_id === selectedId);
    
    if (this.debugMode) {
      console.log(`🎯 Selected hexagram: ${selectedHexagram.name_jp} (ID: ${selectedId})`);
      
      // トップ3スコア表示（デバッグ用）
      const topScores = [];
      for (let i = 1; i <= 64; i++) {
        if (scores[i] > 5) { // 基礎点より高いもののみ
          const h = this.hexagramData.find(hex => hex.hexagram_id === i);
          if (h) topScores.push({ name: h.name_jp, id: i, score: scores[i] });
        }
      }
      topScores.sort((a, b) => b.score - a.score);
      console.log('Top scores:', topScores.slice(0, 3).map(s => `${s.name}(${s.id}): ${s.score}`));
    }
    
    return selectedHexagram;
  }
  
  /**
   * 最適な爻を選択（卦固有の文脈で）
   */
  selectOptimalYao(text, hexagram, analysis) {
    // エラー処理強化: nullセーフティ
    if (!hexagram || !hexagram.six_lines || !Array.isArray(hexagram.six_lines) || hexagram.six_lines.length === 0) {
      console.warn(`⚠️ Invalid hexagram data for yao selection: ${hexagram?.name_jp || 'unknown'}`);
      return null;
    }
    
    // 入力テキスト検証
    if (!text || typeof text !== 'string') {
      console.warn('⚠️ Invalid text input for yao selection');
      return null;
    }
    
    const yaoScores = {};
    
    hexagram.six_lines.forEach(line => {
      // 爻データの検証
      if (!line || typeof line !== 'object' || typeof line.position !== 'number') {
        console.warn('⚠️ Invalid yao line data, skipping');
        return; // continue to next iteration
      }
      
      let score = 0;
      
      // 特定のキーワードマッチング（卦に応じて）
      if (hexagram.hexagram_id === 1) { // 乾為天
        if (text.includes('潜') || text.includes('隠') || text.includes('準備')) {
          if (line.position === 1) score += 20; // 初九：潜龍
        }
        if (text.includes('現れ') || text.includes('見える')) {
          if (line.position === 2) score += 20; // 九二：見龍在田
        }
        if (text.includes('警戒') || text.includes('注意')) {
          if (line.position === 3) score += 20; // 九三：君子終日乾乾
        }
        if (text.includes('躍') || text.includes('飛躍')) {
          if (line.position === 4) score += 20; // 九四：或躍在淵
        }
        if (text.includes('飛') || text.includes('頂点') || text.includes('リーダー')) {
          if (line.position === 5) score += 25; // 九五：飛龍在天
        }
        if (text.includes('高慢') || text.includes('傲慢') || text.includes('過ぎ')) {
          if (line.position === 6) score += 20; // 上九：亢龍有悔
        }
      }
      
      if (hexagram.hexagram_id === 5) { // 水天需
        if (text.includes('酒') || text.includes('食') || text.includes('楽しみ')) {
          if (line.position === 5) score += 25; // 九五：需于酒食
        }
      }
      
      if (hexagram.hexagram_id === 49) { // 沢火革
        if (text.includes('虎') || text.includes('大胆') || text.includes('変革')) {
          if (line.position === 5) score += 25; // 九五：大人虎変
        }
      }
      
      // 爻の意味とテキストの関連性
      if (line.meaning) {
        const meaningWords = line.meaning.split(/[、。,]/).filter(w => w.length > 0);
        meaningWords.forEach(word => {
          if (text.includes(word.trim())) {
            score += 8;
          }
        });
      }
      
      // 時期による爻位置の重み付け（改善版）
      if (analysis.timePhase) {
        switch (analysis.timePhase) {
          case 'beginning':
            if (line.position === 1) score += 15;
            if (line.position === 2) score += 10;
            break;
          case 'developing':
            if (line.position === 3) score += 15;
            if (line.position === 4) score += 15;
            break;
          case 'completion':
            if (line.position === 5) score += 15;
            if (line.position === 6) score += 10;
            break;
          case 'transition':
            if (line.position === 4) score += 15; // 転換点
            break;
        }
      }
      
      // 感情の強度による爻位置の調整
      const emotionIntensity = analysis.emotions.reduce((sum, e) => sum + e.intensity, 0);
      if (emotionIntensity > 2) {
        // 感情が強い時は中間の爻
        if (line.position >= 3 && line.position <= 4) score += 10;
      } else if (emotionIntensity === 0) {
        // 感情が弱い時は初爻か上爻
        if (line.position === 1 || line.position === 6) score += 5;
      }
      
      // パターンによる爻選択
      if (analysis.patterns.includes('high-sensitivity')) {
        if (line.position === 2 || line.position === 5) score += 8; // 感応しやすい位置
      }
      if (analysis.patterns.includes('seeking-balance')) {
        if (line.position === 3 || line.position === 4) score += 8; // 中庸の位置
      }
      
      // 基礎点
      score += 3;
      
      yaoScores[line.position] = score;
    });
    
    // 最高スコアの爻を選択
    const sortedYao = Object.entries(yaoScores).sort(([,a], [,b]) => b - a);
    const selectedPosition = sortedYao[0]?.[0];
    
    const selectedYao = hexagram.six_lines.find(l => l.position == selectedPosition);
    
    if (this.debugMode) {
      console.log(`📍 Selected yao: Position ${selectedPosition} - ${selectedYao?.name}`);
      console.log('Top yao scores:', sortedYao.slice(0, 3).map(([pos, score]) => `${pos}爻: ${score}`));
    }
    
    return selectedYao;
  }
  
  /**
   * 特別な爻（用九・用六）のチェック（精密化版）
   */
  checkSpecialYao(hexagram, analysis) {
    // エラー処理強化
    if (!hexagram || !analysis) {
      return null;
    }
    
    // 乾為天の用九チェック（精密化）
    if (hexagram.hexagram_id === 1 && hexagram.special_yao) {
      const yangConditions = this.checkYangPeakConditions(analysis);
      if (yangConditions.shouldUseYongJiu) {
        if (this.debugMode) {
          console.log('🐉 用九 detected:', yangConditions.reason);
        }
        return hexagram.special_yao;
      }
    }
    
    // 坤為地の用六チェック（精密化）
    if (hexagram.hexagram_id === 2 && hexagram.special_yao) {
      const yinConditions = this.checkYinCompletionConditions(analysis);
      if (yinConditions.shouldUseYongLiu) {
        if (this.debugMode) {
          console.log('☷ 用六 detected:', yinConditions.reason);
        }
        return hexagram.special_yao;
      }
    }
    
    return null;
  }
  
  /**
   * 陽の極致状態判定（用九のための精密判定）
   */
  checkYangPeakConditions(analysis) {
    const conditions = {
      shouldUseYongJiu: false,
      reason: '',
      confidence: 0
    };
    
    let yangScore = 0;
    let balanceScore = 0;
    
    // 極致状態のキーワード検出
    const peakKeywords = ['すべて', '完全', '極', '頂点', '成功', '達成'];
    const hasYangPeak = peakKeywords.some(keyword => 
      analysis.originalText.includes(keyword)
    );
    if (hasYangPeak) yangScore += 3;
    
    // 謙虚・バランス要素の検出
    const humilityKeywords = ['謙虚', '謙遜', '慎む', 'バランス', '調和'];
    const hasHumility = humilityKeywords.some(keyword => 
      analysis.originalText.includes(keyword)
    );
    if (hasHumility) balanceScore += 3;
    
    // 五行理論: 木行・火行の極致（陽の性質）
    if (analysis.wuxing && (analysis.wuxing.dominant === 'wood' || analysis.wuxing.dominant === 'fire')) {
      if (analysis.wuxing.score >= 3) yangScore += 2;
    }
    
    // 感情の極致状態
    const hasIntenseEmotion = analysis.emotions.some(e => e.intensity >= 3);
    if (hasIntenseEmotion) yangScore += 1;
    
    // 時期判定：完成期かつ転換点
    if (analysis.timePhase === 'completion' || analysis.timePhase === 'transition') {
      yangScore += 2;
    }
    
    // 判定条件
    if (yangScore >= 4 && balanceScore >= 2) {
      conditions.shouldUseYongJiu = true;
      conditions.reason = `陽の極致（${yangScore}点）+ バランス求心（${balanceScore}点）`;
      conditions.confidence = Math.min((yangScore + balanceScore) * 10, 100);
    }
    
    return conditions;
  }
  
  /**
   * 陰の完成状態判定（用六のための精密判定）
   */
  checkYinCompletionConditions(analysis) {
    const conditions = {
      shouldUseYongLiu: false,
      reason: '',
      confidence: 0
    };
    
    let yinScore = 0;
    let persistenceScore = 0;
    
    // 陰的特質のキーワード検出
    const yinKeywords = ['静か', '深い', '持続', '継続', '永続', '安定'];
    const hasYinNature = yinKeywords.some(keyword => 
      analysis.originalText.includes(keyword)
    );
    if (hasYinNature) yinScore += 3;
    
    // 正しさ・貞節の要素検出
    const righteousnessKeywords = ['正しい', '正しく', '貞', '純粋', '清廉'];
    const hasRighteousness = righteousnessKeywords.some(keyword => 
      analysis.originalText.includes(keyword)
    );
    if (hasRighteousness) persistenceScore += 3;
    
    // 五行理論: 金行・水行の完成（陰の性質）
    if (analysis.wuxing && (analysis.wuxing.dominant === 'metal' || analysis.wuxing.dominant === 'water')) {
      if (analysis.wuxing.score >= 3) yinScore += 2;
    }
    
    // 感情の安定状態
    const hasCalmEmotion = analysis.emotions.some(e => e.type === 'calm');
    if (hasCalmEmotion) yinScore += 2;
    
    // 継続性パターン
    if (analysis.patterns.includes('seeking-balance')) {
      persistenceScore += 2;
    }
    
    // 判定条件
    if (yinScore >= 4 && persistenceScore >= 2) {
      conditions.shouldUseYongLiu = true;
      conditions.reason = `陰の完成（${yinScore}点）+ 持続性（${persistenceScore}点）`;
      conditions.confidence = Math.min((yinScore + persistenceScore) * 10, 100);
    }
    
    return conditions;
  }
  
  /**
   * 信頼度計算
   */
  calculateConfidence(hexagram, yao, analysis) {
    let confidence = 50; // 基準値
    
    // データの充実度
    if (hexagram && hexagram.six_lines?.length === 6) confidence += 10;
    if (yao && yao.meaning) confidence += 10;
    
    // 分析の充実度
    if (analysis.keywords.length > 0) confidence += 10;
    if (analysis.emotions.length > 0) confidence += 10;
    if (analysis.timePhase) confidence += 10;
    if (analysis.patterns.length > 0) confidence += 10;
    
    // 強度による調整
    confidence += analysis.intensity * 20;
    
    return Math.min(Math.max(confidence, 0), 100);
  }
  
  /**
   * 未来シナリオ生成用のコンテキスト作成
   */
  createFutureContext(result) {
    return {
      currentHexagram: result.hexagram,
      currentYao: result.yao,
      specialYao: result.specialYao,
      keywords: result.analysis.keywords.map(k => k.words).flat(),
      emotions: result.analysis.emotions,
      timePhase: result.analysis.timePhase,
      patterns: result.analysis.patterns,
      confidence: result.confidence
    };
  }
};