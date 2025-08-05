/**
 * 動的キーワード生成システム - ユーザー入力に適応する高精度キーワード抽出
 * 
 * 目的：
 * - ユーザー入力からリアルタイムでコンテキスト適応キーワード生成
 * - SNSパターン、感情表現、易経64卦との動的マッピング
 * - Triple OSアーキテクチャとの統合
 * 
 * 入力：
 * - inputText: string - ユーザー入力テキスト
 * - contextType: string - コンテキストタイプ（optional）
 * - osContext: object - Triple OS状態情報（optional）
 * 
 * 処理内容：
 * 1. テキスト前処理・正規化
 * 2. kuromoji.js による形態素解析
 * 3. 感情・文脈パターンマッチング
 * 4. SNSパターンとの統合（KeywordExpansionEngine活用）
 * 5. 優先度付きキーワード生成
 * 6. 易経64卦への動的マッピング
 * 
 * 出力：
 * - keywords: Array<{keyword: string, priority: number, category: string}>
 * - confidence: number (0-1)
 * - contextAnalysis: object
 * - hexagramMapping: Array<{hexagram: number, confidence: number}>
 * 
 * 副作用：
 * - キーワードキャッシュの更新
 * - 分析統計の記録
 * 
 * 前提条件：
 * - kuromoji tokenizer が初期化済み
 * - KeywordExpansionEngine が利用可能
 * - SNS_WORRY_PATTERNS データが読み込み済み
 * 
 * エラー処理：
 * - tokenizer 未初期化時はフォールバック処理
 * - 不正入力時は空結果と警告ログ
 * - メモリ不足時は段階的処理切り替え
 */
class DynamicKeywordGenerator {
  constructor(kuromojiTokenizer) {
    this.tokenizer = kuromojiTokenizer;
    this.keywordExpansion = null; // 遅延初期化
    this.emotionPatterns = this.initializeEmotionPatterns();
    this.contextPatterns = this.initializeContextPatterns();
    this.cache = new Map();
    this.maxCacheSize = 100;
    this.statisticsTracker = {
      totalAnalyses: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageProcessingTime: 0
    };
  }

  /**
   * 感情パターンの初期化
   * 
   * 目的：
   * - 感情表現パターンの定義と優先度設定
   * - 易経64卦との感情マッピング準備
   * 
   * 処理内容：
   * - 基本感情カテゴリの定義（喜怒哀楽＋複合感情）
   * - 感情強度の段階設定
   * - 日本語特有の感情表現パターン
   * 
   * 出力：
   * - パターン定義オブジェクト
   */
  initializeEmotionPatterns() {
    return {
      // 不安・心配系
      anxiety: {
        patterns: [
          /不安/g, /心配/g, /気になる/g, /どうしよう/g,
          /困った/g, /悩む/g, /迷う/g, /わからない/g
        ],
        keywords: ['不安', '心配', '迷い', '悩み'],
        intensity: { weak: 0.3, moderate: 0.6, strong: 0.9 },
        hexagramAffinity: [29, 47, 5, 4] // 坎為水、沢水困、水天需、山水蒙
      },
      
      // 怒り・イライラ系
      anger: {
        patterns: [
          /イライラ/g, /腹立つ/g, /むかつく/g, /ムカつく/g,
          /怒り/g, /頭にくる/g, /許せない/g, /うざい/g
        ],
        keywords: ['怒り', 'イライラ', '憤り', '不満'],
        intensity: { weak: 0.2, moderate: 0.5, strong: 0.8 },
        hexagramAffinity: [51, 21, 38, 6] // 震為雷、火雷噬嗑、火沢睽、天水訟
      },
      
      // 悲しみ・落ち込み系
      sadness: {
        patterns: [
          /悲しい/g, /辛い/g, /つらい/g, /寂しい/g,
          /落ち込む/g, /へこむ/g, /泣きたい/g, /虚しい/g
        ],
        keywords: ['悲しみ', '辛さ', '寂しさ', '虚無感'],
        intensity: { weak: 0.3, moderate: 0.6, strong: 0.9 },
        hexagramAffinity: [47, 36, 23, 12] // 沢水困、地火明夷、山地剥、天地否
      },
      
      // 敏感・感受性系
      sensitivity: {
        patterns: [
          /敏感/g, /感じやすい/g, /気にしやすい/g, /繊細/g,
          /影響を受ける/g, /引きずる/g, /気になって/g
        ],
        keywords: ['敏感', '繊細', '感受性', '影響'],
        intensity: { weak: 0.4, moderate: 0.7, strong: 0.95 },
        hexagramAffinity: [29, 60, 61, 31] // 坎為水、水沢節、風沢中孚、沢山咸
      },
      
      // ストレス・圧力系
      stress: {
        patterns: [
          /ストレス/g, /プレッシャー/g, /圧力/g, /重圧/g,
          /疲れた/g, /しんどい/g, /きつい/g, /限界/g
        ],
        keywords: ['ストレス', '圧力', '疲労', '限界'],
        intensity: { weak: 0.3, moderate: 0.6, strong: 0.85 },
        hexagramAffinity: [47, 28, 59, 39] // 沢水困、沢風大過、風水渙、水山蹇
      }
    };
  }

  /**
   * コンテキストパターンの初期化
   * 
   * 目的：
   * - 状況・文脈パターンの定義
   * - Triple OSとの関連付け
   * 
   * 処理内容：
   * - 対人関係、仕事、将来、自己認識等のコンテキスト定義
   * - 各コンテキストとTriple OSの関連性設定
   * 
   * 出力：
   * - コンテキスト定義オブジェクト
   */
  initializeContextPatterns() {
    return {
      // 対人関係コンテキスト
      interpersonal: {
        patterns: [
          /人間関係/g, /友達/g, /家族/g, /恋人/g, /パートナー/g,
          /職場の人/g, /上司/g, /部下/g, /同僚/g, /周りの人/g
        ],
        keywords: ['人間関係', '対人', 'コミュニケーション', '関係性'],
        osRelevance: { engine: 0.3, interface: 0.8, safeMode: 0.4 }
      },
      
      // 仕事・キャリアコンテキスト
      career: {
        patterns: [
          /仕事/g, /会社/g, /職場/g, /キャリア/g, /転職/g,
          /昇進/g, /評価/g, /成果/g, /プロジェクト/g, /業務/g
        ],
        keywords: ['仕事', 'キャリア', '職場', '成果'],
        osRelevance: { engine: 0.6, interface: 0.7, safeMode: 0.3 }
      },
      
      // 将来・未来コンテキスト
      future: {
        patterns: [
          /将来/g, /未来/g, /これから/g, /今後/g, /先行き/g,
          /目標/g, /夢/g, /計画/g, /予定/g, /展望/g
        ],
        keywords: ['将来', '未来', '目標', '展望'],
        osRelevance: { engine: 0.8, interface: 0.4, safeMode: 0.5 }
      },
      
      // 自己認識コンテキスト
      selfAwareness: {
        patterns: [
          /自分/g, /私/g, /僕/g, /俺/g, /自己/g,
          /性格/g, /本質/g, /内面/g, /心/g, /気持ち/g
        ],
        keywords: ['自己', '内面', '本質', '自分'],
        osRelevance: { engine: 0.9, interface: 0.2, safeMode: 0.6 }
      }
    };
  }

  /**
   * メインキーワード生成処理
   * 
   * 目的：
   * - ユーザー入力から動的にキーワードを生成
   * - 感情・文脈・易経マッピングの統合分析
   * 
   * 処理内容：
   * 1. キャッシュチェック
   * 2. テキスト前処理
   * 3. 形態素解析
   * 4. 感情・文脈分析
   * 5. キーワード優先度計算
   * 6. 易経マッピング
   * 
   * 出力：
   * - 包括的な分析結果オブジェクト
   */
  async generateContextualKeywords(inputText, contextType = null, osContext = null) {
    const startTime = performance.now();
    
    // 入力検証
    if (!inputText || typeof inputText !== 'string') {
      console.warn('DynamicKeywordGenerator: 無効な入力テキスト');
      return this.generateEmptyResult();
    }

    // キャッシュチェック
    const cacheKey = this.generateCacheKey(inputText, contextType);
    if (this.cache.has(cacheKey)) {
      this.statisticsTracker.cacheHits++;
      return this.cache.get(cacheKey);
    }

    try {
      // テキスト前処理
      const normalizedText = this.normalizeText(inputText);
      
      // 形態素解析
      const tokens = await this.tokenizeText(normalizedText);
      
      // 感情分析
      const emotionAnalysis = this.analyzeEmotions(normalizedText, tokens);
      
      // 文脈分析
      const contextAnalysis = this.analyzeContext(normalizedText, tokens, contextType);
      
      // キーワード抽出と優先度付け
      const keywords = this.extractKeywords(tokens, emotionAnalysis, contextAnalysis);
      
      // SNSパターン統合（KeywordExpansionEngineが利用可能な場合）
      const expandedKeywords = await this.expandKeywords(keywords, emotionAnalysis);
      
      // 易経マッピング
      const hexagramMapping = this.mapToHexagrams(expandedKeywords, emotionAnalysis, contextAnalysis);
      
      // 結果生成
      const result = {
        keywords: expandedKeywords,
        confidence: this.calculateConfidence(expandedKeywords, emotionAnalysis),
        emotionalContext: emotionAnalysis,
        contextualMapping: contextAnalysis,
        hexagramCandidates: hexagramMapping,
        processingTime: performance.now() - startTime
      };

      // キャッシュ更新
      this.updateCache(cacheKey, result);
      
      // 統計更新
      this.updateStatistics(result.processingTime);
      
      return result;
      
    } catch (error) {
      console.error('DynamicKeywordGenerator エラー:', error);
      return this.generateFallbackResult(inputText);
    }
  }

  /**
   * テキスト正規化
   */
  normalizeText(text) {
    return text
      .trim()
      .replace(/\s+/g, ' ') // 連続する空白を単一スペースに
      .replace(/[！？。、]/g, match => { // 全角句読点の処理
        const map = { '！': '!', '？': '?', '。': '.', '、': ',' };
        return map[match] || match;
      })
      .toLowerCase(); // 小文字化（日本語には影響なし）
  }

  /**
   * 形態素解析
   */
  async tokenizeText(text) {
    if (!this.tokenizer) {
      console.warn('Tokenizer未初期化、基本解析を実行');
      return this.basicTokenize(text);
    }

    return new Promise((resolve) => {
      this.tokenizer.tokenize(text, (err, tokens) => {
        if (err) {
          console.error('形態素解析エラー:', err);
          resolve(this.basicTokenize(text));
        } else {
          resolve(tokens);
        }
      });
    });
  }

  /**
   * 基本的なトークン化（フォールバック）
   */
  basicTokenize(text) {
    // 基本的な単語分割
    const words = text.match(/[一-龠]+|[ぁ-ん]+|[ァ-ヴー]+|[a-zA-Z0-9]+/g) || [];
    return words.map(word => ({
      surface_form: word,
      pos: 'unknown',
      basic_form: word
    }));
  }

  /**
   * 感情分析
   */
  analyzeEmotions(text, tokens) {
    const detectedEmotions = {};
    let maxIntensity = 0;
    let primaryEmotion = null;

    // 各感情パターンをチェック
    for (const [emotionType, emotionData] of Object.entries(this.emotionPatterns)) {
      let matchCount = 0;
      let totalIntensity = 0;

      // パターンマッチング
      for (const pattern of emotionData.patterns) {
        const matches = text.match(pattern);
        if (matches) {
          matchCount += matches.length;
        }
      }

      // トークンベースのマッチング
      for (const token of tokens) {
        if (emotionData.keywords.includes(token.surface_form) || 
            emotionData.keywords.includes(token.basic_form)) {
          matchCount += 2; // キーワード直接マッチは重み付け
        }
      }

      if (matchCount > 0) {
        // 強度計算
        const intensity = Math.min(matchCount * 0.2, 1.0);
        detectedEmotions[emotionType] = {
          matchCount,
          intensity,
          keywords: emotionData.keywords
        };

        if (intensity > maxIntensity) {
          maxIntensity = intensity;
          primaryEmotion = emotionType;
        }
      }
    }

    return {
      primary: primaryEmotion || 'neutral',
      secondary: this.findSecondaryEmotion(detectedEmotions, primaryEmotion),
      intensity: maxIntensity,
      details: detectedEmotions
    };
  }

  /**
   * 文脈分析
   */
  analyzeContext(text, tokens, providedContext) {
    const detectedContexts = {};
    
    // 提供されたコンテキストがある場合は優先
    if (providedContext && this.contextPatterns[providedContext]) {
      detectedContexts[providedContext] = { confidence: 0.8 };
    }

    // パターンベースのコンテキスト検出
    for (const [contextType, contextData] of Object.entries(this.contextPatterns)) {
      let matchCount = 0;

      for (const pattern of contextData.patterns) {
        const matches = text.match(pattern);
        if (matches) {
          matchCount += matches.length;
        }
      }

      if (matchCount > 0) {
        detectedContexts[contextType] = {
          matchCount,
          confidence: Math.min(matchCount * 0.15, 1.0),
          osRelevance: contextData.osRelevance
        };
      }
    }

    // 主要コンテキストの決定
    const primaryContext = Object.entries(detectedContexts)
      .sort(([, a], [, b]) => b.confidence - a.confidence)[0];

    return {
      situationType: primaryContext ? primaryContext[0] : 'general',
      temporalContext: this.detectTemporalContext(text),
      socialContext: this.detectSocialContext(detectedContexts),
      confidence: primaryContext ? primaryContext[1].confidence : 0.5,
      details: detectedContexts
    };
  }

  /**
   * キーワード抽出
   */
  extractKeywords(tokens, emotionAnalysis, contextAnalysis) {
    const keywordMap = new Map();

    // 形態素からのキーワード抽出
    for (const token of tokens) {
      if (this.isKeywordCandidate(token)) {
        const keyword = token.basic_form || token.surface_form;
        const priority = this.calculateKeywordPriority(token, emotionAnalysis, contextAnalysis);
        
        if (keywordMap.has(keyword)) {
          keywordMap.set(keyword, {
            ...keywordMap.get(keyword),
            frequency: keywordMap.get(keyword).frequency + 1,
            priority: Math.max(keywordMap.get(keyword).priority, priority)
          });
        } else {
          keywordMap.set(keyword, {
            keyword,
            priority,
            category: this.categorizeKeyword(token, emotionAnalysis),
            confidence: priority * 0.8,
            source: 'morphological_analysis',
            frequency: 1
          });
        }
      }
    }

    // 感情キーワードの追加
    if (emotionAnalysis.primary) {
      const emotionKeywords = this.emotionPatterns[emotionAnalysis.primary].keywords;
      for (const keyword of emotionKeywords) {
        if (!keywordMap.has(keyword)) {
          keywordMap.set(keyword, {
            keyword,
            priority: 0.7,
            category: 'emotional_trait',
            confidence: 0.6,
            source: 'emotion_analysis',
            frequency: 1
          });
        }
      }
    }

    // 優先度でソートして配列に変換
    return Array.from(keywordMap.values())
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 20); // 上位20個に制限
  }

  /**
   * キーワード候補判定
   */
  isKeywordCandidate(token) {
    // 品詞による判定
    const keywordPos = ['名詞', '動詞', '形容詞', '形容動詞'];
    const excludePos = ['助詞', '助動詞', '記号'];
    
    if (excludePos.some(pos => token.pos?.startsWith(pos))) {
      return false;
    }
    
    if (keywordPos.some(pos => token.pos?.startsWith(pos))) {
      // 一般的すぎる単語を除外
      const commonWords = ['する', 'ある', 'なる', 'いる', 'こと', 'もの'];
      return !commonWords.includes(token.basic_form || token.surface_form);
    }
    
    return false;
  }

  /**
   * キーワード優先度計算
   */
  calculateKeywordPriority(token, emotionAnalysis, contextAnalysis) {
    let priority = 0.5; // 基本優先度

    // 品詞による重み付け
    if (token.pos?.startsWith('名詞')) priority += 0.2;
    if (token.pos?.startsWith('動詞')) priority += 0.1;
    if (token.pos?.startsWith('形容詞')) priority += 0.15;

    // 感情関連の重み付け
    if (emotionAnalysis.primary && this.isEmotionRelated(token, emotionAnalysis.primary)) {
      priority += 0.3;
    }

    // 文脈関連の重み付け
    if (contextAnalysis.situationType && this.isContextRelated(token, contextAnalysis.situationType)) {
      priority += 0.2;
    }

    return Math.min(priority, 1.0);
  }

  /**
   * キーワードカテゴリ分類
   */
  categorizeKeyword(token, emotionAnalysis) {
    if (this.isEmotionRelated(token, emotionAnalysis.primary)) {
      return 'emotional_trait';
    }
    
    if (token.pos?.startsWith('動詞')) {
      return 'action';
    }
    
    if (token.pos?.startsWith('形容詞') || token.pos?.startsWith('形容動詞')) {
      return 'characteristic';
    }
    
    return 'general';
  }

  /**
   * キーワード拡張（SNSパターン統合）
   */
  async expandKeywords(keywords, emotionAnalysis) {
    // KeywordExpansionEngineの遅延初期化
    if (!this.keywordExpansion && window.KeywordExpansionEngine) {
      this.keywordExpansion = new window.KeywordExpansionEngine();
    }

    if (!this.keywordExpansion) {
      return keywords; // 拡張エンジンが利用できない場合はそのまま返す
    }

    try {
      const expandedKeywords = [...keywords];
      
      // 各キーワードに対してSNSパターンとの関連を検索
      for (const keyword of keywords) {
        const relatedPatterns = await this.keywordExpansion.findRelatedPatterns(keyword.keyword);
        
        for (const pattern of relatedPatterns) {
          if (!expandedKeywords.find(k => k.keyword === pattern)) {
            expandedKeywords.push({
              keyword: pattern,
              priority: keyword.priority * 0.7, // 関連キーワードは優先度を下げる
              category: 'sns_related',
              confidence: keyword.confidence * 0.8,
              source: 'keyword_expansion',
              frequency: 1
            });
          }
        }
      }

      return expandedKeywords.slice(0, 30); // 最大30個に制限
      
    } catch (error) {
      console.warn('キーワード拡張エラー:', error);
      return keywords;
    }
  }

  /**
   * 易経64卦へのマッピング
   */
  mapToHexagrams(keywords, emotionAnalysis, contextAnalysis) {
    const hexagramScores = new Map();

    // 感情ベースのマッピング
    if (emotionAnalysis.primary && this.emotionPatterns[emotionAnalysis.primary]) {
      const affinityHexagrams = this.emotionPatterns[emotionAnalysis.primary].hexagramAffinity;
      for (const hexagram of affinityHexagrams) {
        hexagramScores.set(hexagram, (hexagramScores.get(hexagram) || 0) + emotionAnalysis.intensity);
      }
    }

    // キーワードベースのマッピング
    for (const keyword of keywords) {
      const hexagramMatches = this.findHexagramMatches(keyword.keyword);
      for (const match of hexagramMatches) {
        const currentScore = hexagramScores.get(match.hexagram) || 0;
        hexagramScores.set(match.hexagram, currentScore + (keyword.priority * match.confidence));
      }
    }

    // スコアを正規化して上位候補を返す
    const totalScore = Array.from(hexagramScores.values()).reduce((sum, score) => sum + score, 0);
    
    return Array.from(hexagramScores.entries())
      .map(([hexagram, score]) => ({
        hexagram,
        confidence: totalScore > 0 ? score / totalScore : 0,
        reason: this.generateHexagramReason(hexagram, emotionAnalysis, keywords)
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5); // 上位5候補
  }

  /**
   * 卦とキーワードのマッチング
   */
  findHexagramMatches(keyword) {
    // 簡易的な卦マッピング（実際の実装では詳細なデータベースを使用）
    const hexagramKeywordMap = {
      '不安': [29, 47, 5],
      '心配': [29, 47, 4],
      '怒り': [51, 21, 38],
      'イライラ': [51, 21, 6],
      '悲しみ': [47, 36, 23],
      '敏感': [29, 60, 61],
      '影響': [31, 61, 32],
      'ストレス': [47, 28, 59],
      '将来': [3, 24, 42],
      '仕事': [46, 48, 21],
      '人間関係': [31, 61, 13]
    };

    const matches = [];
    for (const [key, hexagrams] of Object.entries(hexagramKeywordMap)) {
      if (keyword.includes(key) || key.includes(keyword)) {
        for (const hexagram of hexagrams) {
          matches.push({
            hexagram,
            confidence: 0.7
          });
        }
      }
    }

    return matches;
  }

  /**
   * 卦選択理由の生成
   */
  generateHexagramReason(hexagram, emotionAnalysis, keywords) {
    // 簡易的な理由生成（実際の実装では詳細な卦の意味データベースを使用）
    const hexagramMeanings = {
      29: '水の困難・感情の渦',
      47: '困窮・外的圧力',
      5: '待つ時・準備期間',
      51: '雷の衝撃・変化の始まり',
      31: '感応・相互影響',
      60: '節度・適切な制限',
      61: '中孚・内なる誠実'
    };

    return hexagramMeanings[hexagram] || `卦${hexagram}の影響`;
  }

  /**
   * 信頼度計算
   */
  calculateConfidence(keywords, emotionAnalysis) {
    // 複数の要因から総合的な信頼度を計算
    let confidence = 0.5; // 基本信頼度

    // キーワード数による信頼度調整
    if (keywords.length >= 5) confidence += 0.2;
    if (keywords.length >= 10) confidence += 0.1;

    // 感情分析の明確さによる調整
    if (emotionAnalysis.intensity > 0.7) confidence += 0.15;

    // 高優先度キーワードの存在
    const highPriorityCount = keywords.filter(k => k.priority > 0.8).length;
    confidence += highPriorityCount * 0.05;

    return Math.min(confidence, 0.95);
  }

  /**
   * ヘルパーメソッド群
   */
  
  findSecondaryEmotion(detectedEmotions, primaryEmotion) {
    const emotions = Object.entries(detectedEmotions)
      .filter(([type]) => type !== primaryEmotion)
      .sort(([, a], [, b]) => b.intensity - a.intensity);
    
    return emotions.length > 0 ? emotions[0][0] : null;
  }

  detectTemporalContext(text) {
    if (/今|現在|最近|今日/.test(text)) return 'current_state';
    if (/将来|未来|これから|今後/.test(text)) return 'future_concern';
    if (/過去|以前|昔|前に/.test(text)) return 'past_experience';
    return 'general';
  }

  detectSocialContext(detectedContexts) {
    if (detectedContexts.interpersonal) return 'interpersonal_influence';
    if (detectedContexts.career) return 'professional_environment';
    if (detectedContexts.selfAwareness) return 'self_reflection';
    return 'general_social';
  }

  isEmotionRelated(token, emotionType) {
    if (!emotionType || !this.emotionPatterns[emotionType]) return false;
    
    const keywords = this.emotionPatterns[emotionType].keywords;
    const word = token.basic_form || token.surface_form;
    
    return keywords.some(keyword => word.includes(keyword) || keyword.includes(word));
  }

  isContextRelated(token, contextType) {
    if (!contextType || !this.contextPatterns[contextType]) return false;
    
    const keywords = this.contextPatterns[contextType].keywords;
    const word = token.basic_form || token.surface_form;
    
    return keywords.some(keyword => word.includes(keyword) || keyword.includes(word));
  }

  generateCacheKey(text, contextType) {
    return `${text.substring(0, 100)}_${contextType || 'none'}`;
  }

  updateCache(key, result) {
    if (this.cache.size >= this.maxCacheSize) {
      // LRU: 最も古いエントリを削除
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, result);
    this.statisticsTracker.cacheMisses++;
  }

  updateStatistics(processingTime) {
    this.statisticsTracker.totalAnalyses++;
    const prevAvg = this.statisticsTracker.averageProcessingTime;
    const totalAnalyses = this.statisticsTracker.totalAnalyses;
    
    this.statisticsTracker.averageProcessingTime = 
      (prevAvg * (totalAnalyses - 1) + processingTime) / totalAnalyses;
  }

  generateEmptyResult() {
    return {
      keywords: [],
      confidence: 0,
      emotionalContext: { primary: null, secondary: null, intensity: 0 },
      contextualMapping: { situationType: 'unknown' },
      hexagramCandidates: [],
      processingTime: 0
    };
  }

  generateFallbackResult(inputText) {
    // エラー時の基本的な分析結果を返す
    return {
      keywords: this.basicTokenize(inputText).slice(0, 5).map(token => ({
        keyword: token.surface_form,
        priority: 0.5,
        category: 'general',
        confidence: 0.3,
        source: 'fallback'
      })),
      confidence: 0.3,
      emotionalContext: { primary: 'unknown', secondary: null, intensity: 0.3 },
      contextualMapping: { situationType: 'general', confidence: 0.3 },
      hexagramCandidates: [
        { hexagram: 1, confidence: 0.2, reason: 'デフォルト' }
      ],
      processingTime: 0,
      fallbackMode: true
    };
  }

  /**
   * 初期化メソッド - IntegratedAnalysisEngineとの互換性のため
   */
  async initialize() {
    try {
      console.log('🔄 DynamicKeywordGenerator初期化開始');
      
      // KeywordExpansionEngineの初期化確認
      if (typeof KeywordExpansionEngine !== 'undefined' && !this.keywordExpansion) {
        this.keywordExpansion = new KeywordExpansionEngine();
        console.log('✅ KeywordExpansionEngine初期化完了');
      }
      
      // SNS_WORRY_PATTERNSの確認
      if (typeof SNS_WORRY_PATTERNS !== 'undefined') {
        console.log('✅ SNS_WORRY_PATTERNS利用可能');
      } else {
        console.warn('⚠️ SNS_WORRY_PATTERNS未定義 - 基本パターンを使用');
      }
      
      console.log('✅ DynamicKeywordGenerator初期化完了');
      return true;
      
    } catch (error) {
      console.error('❌ DynamicKeywordGenerator初期化エラー:', error);
      return false;
    }
  }

  /**
   * 初期化状態の確認
   */
  isInitialized() {
    return {
      tokenizer: !!this.tokenizer,
      keywordExpansion: !!this.keywordExpansion,
      emotionPatterns: !!this.emotionPatterns,
      contextPatterns: !!this.contextPatterns,
      overall: !!this.tokenizer && !!this.emotionPatterns
    };
  }
}

// グローバルスコープにエクスポート
if (typeof window !== 'undefined') {
  window.DynamicKeywordGenerator = DynamicKeywordGenerator;
}