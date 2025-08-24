/**
 * I Ching Situation Analyzer
 * 易経状況分析エンジン - ユーザー入力から卦・爻を特定
 */

class IChingSituationAnalyzer {
  constructor(options = {}) {
    
    // v4.3.1 決定論的要件: SeedableRandom統合
    this.rng = options.randomnessManager || window.randomnessManager || 
               (() => { throw new Error('RandomnessManager required for deterministic behavior'); });
    this.h384Data = null;
    this.hexagramMapping = this.initHexagramMapping();
    this.keywordDatabase = this.initKeywordDatabase();
    this.emotionDetector = new EmotionDetector();
    
    console.log('🎯 I Ching Situation Analyzer initialized');
  }

  /**
   * H384データの初期化
   */
  async init() {
    try {
      // H384_DATAの取得
      if (window.H384_DATA && Array.isArray(window.H384_DATA)) {
        this.h384Data = window.H384_DATA;
        console.log('✅ H384_DATA loaded:', this.h384Data.length, 'entries');
        return true;
      } else {
        console.error('❌ H384_DATA not available');
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to initialize:', error);
      return false;
    }
  }

  /**
   * メイン分析関数：状況テキストから卦・爻を特定
   */
  analyzeSituation(inputText) {
    console.log('🔍 [DEBUG] IChingSituationAnalyzer.analyzeSituation called with:', inputText.substring(0, 50) + '...');
    console.log('🔍 [DEBUG] H384 Data available:', !!this.h384Data, 'entries:', this.h384Data ? this.h384Data.length : 0);

    try {
      // 1. テキストの前処理
      const processedText = this.preprocessText(inputText);
      
      // 2. キーワード抽出
      const keywords = this.extractKeywords(processedText);
      
      // 3. 感情状態分析
      const emotionState = this.emotionDetector.analyze(processedText);
      
      // 4. 状況パターン識別
      const situationPattern = this.identifySituationPattern(processedText, keywords, emotionState);
      
      // 5. 卦の特定
      const hexagram = this.selectHexagram(situationPattern, keywords, emotionState);
      
      // 6. 爻の特定
      const yao = this.selectYao(hexagram, situationPattern, emotionState);
      
      // 7. 確信度計算
      const confidence = this.calculateConfidence(keywords, emotionState, situationPattern);

      const result = {
        hexagram: hexagram,
        yao: yao,
        confidence: confidence,
        analysis: {
          keywords: keywords,
          emotion: emotionState,
          pattern: situationPattern,
          metaphor: this.generateMetaphor(hexagram, yao),
          currentTheme: this.getCurrentTheme(hexagram, yao)
        },
        h384Entry: this.getH384Entry(hexagram.number, yao.position)
      };

      console.log('✅ [DEBUG] Analysis result generated:', {
        hexagramName: result.hexagram?.name,
        yaoName: result.yao?.name,
        confidence: result.confidence,
        h384Available: !!result.h384Entry
      });
      return result;

    } catch (error) {
      console.error('❌ Analysis failed:', error);
      return this.getFallbackResult(inputText);
    }
  }

  /**
   * テキスト前処理
   */
  preprocessText(text) {
    return text
      .toLowerCase()
      .replace(/[「」『』（）\(\)]/g, ' ') // 括弧除去
      .replace(/[。、！？!?]/g, ' ') // 句読点を空白に
      .replace(/\s+/g, ' ') // 複数空白を1つに
      .trim();
  }

  /**
   * キーワード抽出
   */
  extractKeywords(text) {
    const keywords = [];
    
    // 基本感情キーワード
    const emotionKeywords = {
      anxiety: ['不安', '心配', '悩み', '困っ', '迷っ', 'やばい', 'まずい'],
      stress: ['ストレス', '疲れ', 'きつい', 'しんどい', '限界', '忙しい'],
      confusion: ['分からない', 'どうし', 'わからん', '混乱', '迷子'],
      hope: ['期待', '希望', 'やる気', '頑張', '成功', '成長'],
      fear: ['怖い', '恐れ', '不安', 'リスク', '危険', '失敗'],
      anger: ['腹立つ', '怒り', 'ムカ', 'イライラ', '許せな']
    };

    // 状況カテゴリーキーワード
    const situationKeywords = {
      career: ['仕事', '会社', '転職', '職場', 'キャリア', '同僚', '上司', '部下'],
      love: ['恋愛', '彼氏', '彼女', '恋人', '好き', '別れ', '結婚', 'デート'],
      family: ['家族', '親', '子供', '兄弟', '姉妹', '夫', '妻', '家庭'],
      health: ['健康', '病気', '体調', '疲労', '医者', '病院', '薬'],
      money: ['お金', '金銭', '給料', '収入', '支出', '借金', '投資', '節約'],
      study: ['勉強', '学校', '試験', '受験', '資格', '学習', '教育'],
      relationship: ['人間関係', '友達', '友人', 'コミュニケーション', '孤独']
    };

    // キーワードマッチング
    for (const [category, words] of Object.entries({...emotionKeywords, ...situationKeywords})) {
      for (const word of words) {
        if (text.includes(word)) {
          keywords.push({ word, category, weight: this.calculateKeywordWeight(word, text) });
        }
      }
    }

    return keywords.sort((a, b) => b.weight - a.weight);
  }

  /**
   * キーワードの重み計算
   */
  calculateKeywordWeight(word, text) {
    const frequency = (text.match(new RegExp(word, 'g')) || []).length;
    const position = text.indexOf(word) / text.length; // 前半ほど重要
    const length = word.length; // 長いワードほど重要
    
    return frequency * 2 + (1 - position) + length * 0.5;
  }

  /**
   * 状況パターン識別
   */
  identifySituationPattern(text, keywords, emotion) {
    const patterns = {
      beginning: ['始まり', '開始', 'スタート', '初めて', '新しい'],
      crisis: ['危機', 'ピンチ', '大変', '緊急', '切羽詰まっ'],
      stagnation: ['停滞', '進まない', '変わらな', '同じ', 'マンネリ'],
      growth: ['成長', '発展', '進歩', '向上', '改善'],
      transformation: ['変化', '変わる', '転換', '変革', '革命'],
      completion: ['完成', '終了', '完了', 'ゴール', '達成'],
      conflict: ['対立', '争い', '喧嘩', '問題', 'トラブル'],
      cooperation: ['協力', 'チーム', '一緒', '協働', '連携']
    };

    const patternScores = {};
    
    for (const [pattern, words] of Object.entries(patterns)) {
      let score = 0;
      for (const word of words) {
        if (text.includes(word)) {
          score += this.calculateKeywordWeight(word, text);
        }
      }
      if (score > 0) {
        patternScores[pattern] = score;
      }
    }

    // 感情状態からもパターンを推測
    if (emotion.dominant === 'anxiety') {
      patternScores.crisis = (patternScores.crisis || 0) + 3;
    }
    if (emotion.dominant === 'confusion') {
      patternScores.stagnation = (patternScores.stagnation || 0) + 3;
    }

    // 最高スコアのパターンを返す
    const topPattern = Object.entries(patternScores)
      .sort((a, b) => b[1] - a[1])[0];

    return {
      primary: topPattern ? topPattern[0] : 'stagnation',
      scores: patternScores,
      confidence: topPattern ? topPattern[1] / 10 : 0.3
    };
  }

  /**
   * 卦の選択
   */
  selectHexagram(situationPattern, keywords, emotion) {
    console.log('🎯 [DEBUG] selectHexagram called with pattern:', situationPattern.primary);
    
    const hexagramPriority = this.getHexagramByPattern(situationPattern.primary);
    console.log('🎯 [DEBUG] hexagramPriority array:', hexagramPriority.length, 'entries');
    
    // 基本的な卦の選択（配列が空でないことを確認）
    let selectedHexagram = hexagramPriority && hexagramPriority.length > 0 ? 
      hexagramPriority[0] : this.hexagramMapping['乾']; // フォールバック：乾為天
    
    console.log('🎯 [DEBUG] selectedHexagram before emotion adjustment:', selectedHexagram?.name);
    
    // 感情状態による調整
    if (emotion.dominant === 'anxiety' && emotion.intensity > 0.7) {
      // 高不安の場合は「需」（待つ）や「謙」（謙遜）を優先
      const anxietyHexagram = this.hexagramMapping['需'] || this.hexagramMapping['謙'];
      if (anxietyHexagram) {
        selectedHexagram = anxietyHexagram;
        console.log('🎯 [DEBUG] Anxiety adjustment -> 需/謙');
      }
    } else if (emotion.dominant === 'hope' && emotion.intensity > 0.6) {
      // 希望が強い場合は「乾」（創造）を優先
      const hopeHexagram = this.hexagramMapping['乾'];
      if (hopeHexagram) {
        selectedHexagram = hopeHexagram;
        console.log('🎯 [DEBUG] Hope adjustment -> 乾');
      }
    }

    // 最終検証：選択された卦が有効かどうか確認
    if (!selectedHexagram || !selectedHexagram.number || !selectedHexagram.name) {
      console.warn('⚠️ [DEBUG] Invalid hexagram selected, using fallback');
      selectedHexagram = this.hexagramMapping['乾']; // 安全なフォールバック
    }

    console.log('🎯 [DEBUG] Final selected hexagram:', {
      name: selectedHexagram.name,
      number: selectedHexagram.number,
      symbol: selectedHexagram.symbol
    });

    return selectedHexagram;
  }

  /**
   * パターンベースの卦選択
   */
  getHexagramByPattern(pattern) {
    console.log('🎯 [DEBUG] getHexagramByPattern called with:', pattern);
    
    const patternMap = {
      beginning: ['屯', '蒙', '需'], // 困難な始まり、学び、待機
      crisis: ['坎', '困', '蹇'], // 危険、困難、障害
      stagnation: ['否', '遯', '艮'], // 停滞、退避、止まる
      growth: ['晋', '升', '漸'], // 前進、上昇、漸進
      transformation: ['革', '鼎', '震'], // 革命、変革、震動
      completion: ['既済', '履', '泰'], // 完成、実行、平和
      conflict: ['訟', '師', '同人'], // 争い、軍事、同志
      cooperation: ['比', '萃', '豫'] // 協力、集合、喜び
    };

    const hexagramNames = patternMap[pattern] || ['屯', '需', '比']; // フォールバック
    console.log('🎯 [DEBUG] Pattern mapped to hexagram names:', hexagramNames);
    
    const hexagrams = [];
    for (const name of hexagramNames) {
      const hexagram = this.hexagramMapping[name];
      if (hexagram && hexagram.number && hexagram.name) {
        hexagrams.push(hexagram);
        console.log('🎯 [DEBUG] Valid hexagram added:', hexagram.name);
      } else {
        console.warn('⚠️ [DEBUG] Invalid hexagram skipped:', name);
      }
    }
    
    // 少なくとも1つの有効な卦を保証
    if (hexagrams.length === 0) {
      console.warn('⚠️ [DEBUG] No valid hexagrams found, adding fallback');
      const fallback = this.hexagramMapping['乾'];
      if (fallback) {
        hexagrams.push(fallback);
      }
    }
    
    console.log('🎯 [DEBUG] Final hexagrams array length:', hexagrams.length);
    return hexagrams;
  }

  /**
   * 爻の選択
   */
  selectYao(hexagram, situationPattern, emotion) {
    console.log('🎯 [DEBUG] selectYao called with pattern:', situationPattern.primary);
    
    // 状況の深刻度と進展度から爻位を決定
    let position = 1; // デフォルトは初爻

    // パターンによる調整
    switch (situationPattern.primary) {
      case 'beginning':
        position = 1; // 初爻
        console.log('🎯 [DEBUG] Beginning pattern -> position 1');
        break;
      case 'growth':
        position = 2; // 二爻
        console.log('🎯 [DEBUG] Growth pattern -> position 2');
        break;
      case 'crisis':
        position = 3; // 三爻（困難な位置）
        console.log('🎯 [DEBUG] Crisis pattern -> position 3');
        break;
      case 'transformation':
        position = 4; // 四爻（変化の位置）
        console.log('🎯 [DEBUG] Transformation pattern -> position 4');
        break;
      case 'completion':
        position = 5; // 五爻（最高位）
        console.log('🎯 [DEBUG] Completion pattern -> position 5');
        break;
      case 'stagnation':
        position = 6; // 上爻（行き過ぎ）
        console.log('🎯 [DEBUG] Stagnation pattern -> position 6');
        break;
      default:
        position = Math.floor(this.rng.next() * 6) + 1; // ランダム選択
        console.log('🎯 [DEBUG] Default/random pattern -> position', position);
        break;
    }

    // 感情の強度による微調整
    if (emotion && emotion.intensity > 0.8) {
      position = Math.min(6, position + 1); // 感情が強いと上の爻へ
      console.log('🎯 [DEBUG] High emotion intensity adjustment -> position', position);
    }
    
    // 位置の範囲確認（1-6の範囲に収める）
    position = Math.max(1, Math.min(6, position));
    console.log('🎯 [DEBUG] Final position after range check:', position);

    // 爻名の配列（確実に存在する配列）
    const yaoNames = ['初', '二', '三', '四', '五', '上'];
    const yaoName = yaoNames[position - 1]; // 配列の範囲内であることを保証
    
    const yao = {
      position: position,
      name: yaoName,
      description: this.getYaoDescription(position)
    };
    
    console.log('🎯 [DEBUG] Final yao object:', yao);
    return yao;
  }

  /**
   * H384エントリの取得
   */
  getH384Entry(hexagramNumber, yaoPosition) {
    console.log('🎯 [DEBUG] getH384Entry called with:', { hexagramNumber, yaoPosition });
    
    if (!this.h384Data || !Array.isArray(this.h384Data)) {
      console.warn('⚠️ [DEBUG] H384 data not available');
      return null;
    }

    // 入力値の検証
    if (!hexagramNumber || !yaoPosition || 
        hexagramNumber < 1 || hexagramNumber > 64 || 
        yaoPosition < 1 || yaoPosition > 6) {
      console.warn('⚠️ [DEBUG] Invalid input values:', { hexagramNumber, yaoPosition });
      return null;
    }

    // 通し番号の計算：(卦番号-1)*6 + 爻位置
    const sequenceNumber = (hexagramNumber - 1) * 6 + yaoPosition;
    console.log('🎯 [DEBUG] Calculated sequence number:', sequenceNumber);
    
    // 通し番号の範囲チェック（1-384の範囲）
    if (sequenceNumber < 1 || sequenceNumber > 384) {
      console.warn('⚠️ [DEBUG] Sequence number out of range:', sequenceNumber);
      return null;
    }
    
    // H384データから該当エントリを検索
    const entry = this.h384Data.find(item => {
      const itemSeq = item['通し番号'];
      return itemSeq === sequenceNumber;
    });
    
    if (entry) {
      console.log('🎯 [DEBUG] Found H384 entry:', {
        sequenceNumber: entry['通し番号'],
        hexagramName: entry['卦名'],
        keywords: entry['キーワード']?.slice(0, 3)
      });
    } else {
      console.warn('⚠️ [DEBUG] H384 entry not found for sequence:', sequenceNumber);
      
      // フォールバック：最初のエントリを返す
      if (this.h384Data.length > 0) {
        console.log('🎯 [DEBUG] Using fallback H384 entry');
        return this.h384Data[0];
      }
    }
    
    return entry || null;
  }

  /**
   * 確信度計算
   */
  calculateConfidence(keywords, emotion, situationPattern) {
    let confidence = 0.5; // ベース確信度

    // キーワードマッチ度による調整
    const keywordScore = keywords.reduce((sum, kw) => sum + kw.weight, 0) / 20;
    confidence += Math.min(0.3, keywordScore);

    // 感情の明確さによる調整
    confidence += emotion.intensity * 0.2;

    // パターンの明確さによる調整
    confidence += situationPattern.confidence * 0.2;

    return Math.min(1.0, Math.max(0.3, confidence));
  }

  /**
   * メタファー生成
   */
  generateMetaphor(hexagram, yao) {
    const h384Entry = this.getH384Entry(hexagram.number, yao.position);
    if (!h384Entry) return '変化の時';

    const keywords = h384Entry['キーワード'] || [];
    const summary = h384Entry['現代解釈の要約'] || '';

    return {
      primary: keywords[0] || '変化',
      keywords: keywords,
      situation: summary,
      symbol: `${hexagram.name}の${yao.name}爻`
    };
  }

  /**
   * 現在のテーマ取得
   */
  getCurrentTheme(hexagram, yao) {
    const h384Entry = this.getH384Entry(hexagram.number, yao.position);
    if (!h384Entry) return 'この時期のテーマ';

    return {
      theme: h384Entry['キーワード'][0] || '変化',
      description: h384Entry['現代解釈の要約'] || '',
      stance: h384Entry['S5_主体性推奨スタンス'] || '中立',
      risk: h384Entry['S4_リスク'] || 0,
      potential: h384Entry['S2_ポテンシャル'] || 50
    };
  }

  /**
   * フォールバック結果
   */
  getFallbackResult(inputText) {
    return {
      hexagram: { number: 1, name: '乾為天' },
      yao: { position: 1, name: '初', description: '始まりの時' },
      confidence: 0.3,
      analysis: {
        keywords: [{ word: '状況', category: 'general', weight: 1 }],
        emotion: { dominant: 'neutral', intensity: 0.5 },
        pattern: { primary: 'beginning', confidence: 0.3 },
        metaphor: { primary: '始まり', situation: inputText.substring(0, 50) + '...' },
        currentTheme: { theme: '新しい展開', description: '現在は新しい始まりの時期です。' }
      },
      h384Entry: this.h384Data ? this.h384Data[0] : null
    };
  }

  /**
   * 卦マッピングの初期化
   */
  initHexagramMapping() {
    return {
      // 基本8卦
      '乾': { number: 1, name: '乾為天', symbol: '☰☰' },
      '坤': { number: 2, name: '坤為地', symbol: '☷☷' },
      '屯': { number: 3, name: '水雷屯', symbol: '☵☳' },
      '蒙': { number: 4, name: '山水蒙', symbol: '☶☵' },
      '需': { number: 5, name: '水天需', symbol: '☵☰' },
      '訟': { number: 6, name: '天水訟', symbol: '☰☵' },
      '師': { number: 7, name: '地水師', symbol: '☷☵' },
      '比': { number: 8, name: '水地比', symbol: '☵☷' },
      
      // パターンマップで参照される重要な卦
      '坎': { number: 29, name: '坎為水', symbol: '☵☵' },
      '困': { number: 47, name: '沢水困', symbol: '☱☵' },
      '蹇': { number: 39, name: '水山蹇', symbol: '☵☶' },
      '否': { number: 12, name: '天地否', symbol: '☰☷' },
      '遯': { number: 33, name: '天山遯', symbol: '☰☶' },
      '艮': { number: 52, name: '艮為山', symbol: '☶☶' },
      '晋': { number: 35, name: '火地晋', symbol: '☲☷' },
      '升': { number: 46, name: '地風升', symbol: '☷☴' },
      '漸': { number: 53, name: '風山漸', symbol: '☴☶' },
      '革': { number: 49, name: '沢火革', symbol: '☱☲' },
      '鼎': { number: 50, name: '火風鼎', symbol: '☲☴' },
      '震': { number: 51, name: '震為雷', symbol: '☳☳' },
      '既済': { number: 63, name: '水火既済', symbol: '☵☲' },
      '履': { number: 10, name: '天沢履', symbol: '☰☱' },
      '泰': { number: 11, name: '地天泰', symbol: '☷☰' },
      '同人': { number: 13, name: '天火同人', symbol: '☰☲' },
      '萃': { number: 45, name: '沢地萃', symbol: '☱☷' },
      '豫': { number: 16, name: '雷地豫', symbol: '☳☷' }
    };
  }

  /**
   * キーワードデータベース初期化
   */
  initKeywordDatabase() {
    return {
      // 実装時に詳細キーワードデータベースを構築
    };
  }

  /**
   * 爻の説明
   */
  getYaoDescription(position) {
    const descriptions = {
      1: '物事の始まり、基礎を固める時',
      2: '発展の兆し、協力者との出会い',
      3: '試練の時、注意深い行動が必要',
      4: '転換点、重要な決断の時',
      5: '最高の時、リーダーシップを発揮',
      6: '行き過ぎ、謙虚さが必要'
    };
    return descriptions[position] || '変化の時';
  }
}

/**
 * 感情検出クラス
 */
class EmotionDetector {
  analyze(text) {
    const emotions = {
      anxiety: 0,
      hope: 0,
      anger: 0,
      sadness: 0,
      fear: 0,
      confusion: 0,
      excitement: 0
    };

    // 感情キーワードによる検出
    const emotionWords = {
      anxiety: ['不安', '心配', '悩み', '迷っ', 'やばい'],
      hope: ['期待', '希望', 'やる気', '楽しみ', '嬉しい'],
      anger: ['腹立つ', '怒り', 'ムカ', 'イライラ'],
      sadness: ['悲しい', '寂しい', '辛い', '涙'],
      fear: ['怖い', '恐れ', '不安', '心配'],
      confusion: ['分からない', '混乱', 'どうして', 'なぜ'],
      excitement: ['興奮', 'わくわく', '楽しい', '最高']
    };

    let totalScore = 0;
    for (const [emotion, words] of Object.entries(emotionWords)) {
      for (const word of words) {
        const matches = (text.match(new RegExp(word, 'g')) || []).length;
        emotions[emotion] += matches;
        totalScore += matches;
      }
    }

    // 正規化
    if (totalScore > 0) {
      for (const emotion in emotions) {
        emotions[emotion] = emotions[emotion] / totalScore;
      }
    }

    // 最も強い感情を特定
    const dominant = Object.entries(emotions)
      .sort((a, b) => b[1] - a[1])[0];

    return {
      dominant: dominant[0],
      intensity: dominant[1],
      all: emotions
    };
  }
}

// グローバルスコープに公開
window.IChingSituationAnalyzer = IChingSituationAnalyzer;