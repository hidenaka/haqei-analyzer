/**
 * SNS風文章生成制御クラス
 * 
 * 目的：
 * - 384爻それぞれに対して10万パターンの文章生成を制御
 * - ペルソナ・感情強度・文章長のバランス管理
 * - 生成品質の一貫性確保と検証
 * 
 * 主要機能：
 * - AI APIとの連携による大量文章生成
 * - HexagramPatternTemplatesとの統合
 * - バッチ処理による効率的な生成
 * - 品質チェックとフィルタリング
 * 
 * 前提条件：
 * - HexagramPatternTemplatesが初期化済み
 * - TextVariationEngineが利用可能
 * - AI API（Gemini等）のアクセス権限
 */
class SNSTextGenerator {
  constructor() {
    this.patternTemplates = new HexagramPatternTemplates();
    this.variationEngine = null; // TextVariationEngineのインスタンス（後で初期化）
    this.generatedTexts = new Map(); // hexagram-line -> texts[]
    this.config = this.initializeConfig();
    this.statistics = this.initializeStatistics();
  }

  /**
   * 生成設定の初期化
   * 
   * 目的：
   * - バッチサイズ、品質基準等の設定
   * - ペルソナ分布の定義
   * - 文章パラメータの設定
   * 
   * 処理内容：
   * - 各種パラメータのデフォルト値設定
   * - 分布比率の定義
   * - 品質閾値の設定
   */
  initializeConfig() {
    return {
      batchSize: 100, // 一度に生成する文章数
      targetPerLine: 100000, // 各爻あたりの目標生成数（386爻で総計3860万）
      maxRetries: 3, // 生成失敗時のリトライ回数
      
      // ペルソナ分布（合計100%）
      personaDistribution: {
        young: 0.20,      // 18-25歳
        adult: 0.20,      // 26-35歳
        middle: 0.20,     // 36-45歳
        senior: 0.20,     // 46-60歳
        neutral: 0.20     // 性別・年齢不特定
      },
      
      // 感情強度分布
      emotionIntensityDistribution: {
        low: 0.30,    // 冷静
        medium: 0.50, // 一般的
        high: 0.20    // 強い感情
      },
      
      // 文章長分布
      lengthDistribution: {
        short: 0.30,  // 20文字以下
        medium: 0.50, // 21-100文字
        long: 0.20    // 101-200文字
      },
      
      // 品質基準
      qualityThresholds: {
        minConfidence: 0.7,      // 最低信頼度
        maxDuplicationRate: 0.05, // 最大重複率
        minKeywordMatch: 0.6     // 最低キーワード一致率
      }
    };
  }

  /**
   * 統計情報の初期化
   * 
   * 目的：
   * - 生成進捗の追跡
   * - 品質メトリクスの記録
   * - パフォーマンス測定
   */
  initializeStatistics() {
    return {
      totalGenerated: 0,
      totalAccepted: 0,
      totalRejected: 0,
      generationTime: 0,
      validationTime: 0,
      hexagramProgress: new Map(), // hexagram-line -> count
      personaCount: {},
      emotionCount: {},
      lengthCount: {}
    };
  }

  /**
   * 特定の卦・爻に対する文章生成
   * 
   * 目的：
   * - 指定された卦・爻の文章を大量生成
   * - テンプレートに基づく多様な表現
   * - 品質保証された出力
   * 
   * 入力：
   * - hexNum: 卦番号(1-64)
   * - lineNum: 爻番号(1-6)
   * - count: 生成数（デフォルト: 100,000）
   * 
   * 処理内容：
   * 1. テンプレート取得
   * 2. バッチ単位での生成
   * 3. 品質検証
   * 4. 統計更新
   * 
   * 出力：
   * - 生成された文章の配列
   * 
   * エラー処理：
   * - テンプレート不在時の例外
   * - API呼び出し失敗時のリトライ
   */
  async generateForHexagram(hexNum, lineNum, count = this.config.targetPerLine) {
    const startTime = performance.now();
    
    try {
      // テンプレート取得
      const template = this.patternTemplates.getLineTemplate(hexNum, lineNum);
      if (!template) {
        throw new Error(`テンプレートが見つかりません: ${hexNum}-${lineNum}`);
      }

      const key = `${hexNum}-${lineNum}`;
      const generatedTexts = [];
      let currentCount = 0;

      // バッチ処理で生成
      while (currentCount < count) {
        const batchSize = Math.min(this.config.batchSize, count - currentCount);
        const batch = await this.generateBatch(template, batchSize);
        
        // 品質検証
        const validatedBatch = await this.validateBatch(batch, template);
        generatedTexts.push(...validatedBatch);
        currentCount += validatedBatch.length;

        // 進捗更新
        this.updateProgress(hexNum, lineNum, validatedBatch.length);
        
        // レート制限対策
        if (currentCount < count) {
          await this.delay(100); // 100ms待機
        }
      }

      // 結果保存
      this.generatedTexts.set(key, generatedTexts);
      
      // 統計更新
      const endTime = performance.now();
      this.statistics.generationTime += (endTime - startTime);
      
      return generatedTexts;

    } catch (error) {
      console.error(`生成エラー (${hexNum}-${lineNum}):`, error);
      throw error;
    }
  }

  /**
   * バッチ単位での文章生成
   * 
   * 目的：
   * - 効率的な一括生成
   * - ペルソナ・感情・長さの分散確保
   * 
   * 処理内容：
   * 1. パラメータ分布に従った設定生成
   * 2. プロンプト構築
   * 3. AI API呼び出し
   * 4. 結果のパース
   */
  async generateBatch(template, batchSize) {
    const batch = [];
    
    for (let i = 0; i < batchSize; i++) {
      // パラメータをランダムに選択
      const persona = this.selectByDistribution(this.config.personaDistribution);
      const emotionIntensity = this.selectByDistribution(this.config.emotionIntensityDistribution);
      const length = this.selectByDistribution(this.config.lengthDistribution);
      
      // 文章生成（実際のAI API呼び出しはここで実装）
      const text = await this.generateSingleText(template, persona, emotionIntensity, length);
      
      batch.push({
        text: text,
        hexagram: template.hexagram,
        line: template.line,
        persona: persona,
        emotionLevel: emotionIntensity,
        length: length,
        template: template
      });
    }
    
    return batch;
  }

  /**
   * 単一文章の生成
   * 
   * 目的：
   * - テンプレートとパラメータから具体的な文章生成
   * - SNS風の自然な表現
   * 
   * 処理内容：
   * 1. 基本パターンの選択
   * 2. 感情表現の追加
   * 3. SNS要素の組み込み
   * 4. 長さ調整
   */
  async generateSingleText(template, persona, emotionIntensity, lengthType) {
    // 基本パターンを選択
    const basePattern = this.selectRandomElement(template.snsPatterns[persona] || template.snsPatterns.young);
    
    // 感情に応じた調整
    let text = this.adjustForEmotion(basePattern, template.emotions, emotionIntensity);
    
    // 長さに応じた調整
    text = this.adjustForLength(text, lengthType, template);
    
    // SNS要素の追加
    text = this.addSNSElements(text, persona, emotionIntensity);
    
    return text;
  }

  /**
   * 感情に応じた文章調整
   * 
   * 目的：
   * - 感情強度に応じた表現の変化
   * - 自然な感情表現の追加
   */
  adjustForEmotion(text, emotions, intensity) {
    if (intensity === 'high') {
      // 強い感情表現を追加
      const emotionWords = {
        anxiety: ['マジで', '本当に', 'めっちゃ'],
        frustration: ['くそ', 'もう', 'いい加減'],
        sadness: ['つらい', '悲しい', 'しんどい'],
        hope: ['絶対', 'きっと', '必ず'],
        determination: ['やってやる', '負けない', '諦めない']
      };
      
      // ランダムに感情語を挿入
      const primaryEmotion = emotions[0];
      if (emotionWords[primaryEmotion]) {
        const word = this.selectRandomElement(emotionWords[primaryEmotion]);
        text = word + text;
      }
    }
    
    return text;
  }

  /**
   * 文章長の調整
   * 
   * 目的：
   * - 指定された長さカテゴリに合わせる
   * - 自然な文章構造を維持
   */
  adjustForLength(text, lengthType, template) {
    const lengthRanges = {
      short: { min: 10, max: 20 },
      medium: { min: 21, max: 100 },
      long: { min: 101, max: 200 }
    };
    
    const range = lengthRanges[lengthType];
    
    if (text.length < range.min) {
      // 文章を延長
      const additions = [
        '。' + this.selectRandomElement(template.keyPhrases),
        '...って感じ',
        'かな。',
        'と思う。'
      ];
      text += this.selectRandomElement(additions);
    } else if (text.length > range.max) {
      // 文章を短縮（句読点で区切る）
      const sentences = text.split(/[。！？]/);
      text = sentences[0] + (text.match(/[。！？]/) || [''])[0];
    }
    
    return text;
  }

  /**
   * SNS要素の追加
   * 
   * 目的：
   * - 絵文字、顔文字の自然な追加
   * - ペルソナに応じた表現調整
   */
  addSNSElements(text, persona, emotionIntensity) {
    const emojiMap = {
      young: {
        anxiety: ['😰', '😱', '💦'],
        frustration: ['😤', '💢', '😠'],
        sadness: ['😢', '😭', '💔'],
        hope: ['✨', '🌟', '💫'],
        determination: ['💪', '🔥', '👊']
      },
      adult: {
        anxiety: ['💦', '...'],
        frustration: ['。', '...'],
        sadness: ['。', '...'],
        hope: ['！', '。'],
        determination: ['。', '！']
      }
    };
    
    // ペルソナと感情に応じて絵文字を追加
    if (persona === 'young' && emotionIntensity !== 'low' && Math.random() < 0.7) {
      // 若年層は70%の確率で絵文字使用
      const emojis = emojiMap.young;
      // 実装省略
    }
    
    return text;
  }

  /**
   * バッチの品質検証
   * 
   * 目的：
   * - 生成文章の品質チェック
   * - 重複除去
   * - 不適切表現のフィルタリング
   * 
   * 処理内容：
   * 1. キーワード一致率チェック
   * 2. 重複チェック
   * 3. 不適切表現チェック
   * 4. 信頼度計算
   */
  async validateBatch(batch, template) {
    const validatedBatch = [];
    const existingTexts = new Set(this.generatedTexts.get(`${template.hexagram}-${template.line}`) || []);
    
    for (const item of batch) {
      // キーワード一致率チェック
      const keywordMatch = this.calculateKeywordMatch(item.text, template.keyPhrases);
      
      // 重複チェック
      const isDuplicate = existingTexts.has(item.text);
      
      // 不適切表現チェック
      const isAppropriate = this.checkAppropriate(item.text);
      
      // 信頼度計算
      const confidence = this.calculateConfidence(item, template, keywordMatch);
      
      // 品質基準を満たす場合のみ採用
      if (keywordMatch >= this.config.qualityThresholds.minKeywordMatch &&
          !isDuplicate &&
          isAppropriate &&
          confidence >= this.config.qualityThresholds.minConfidence) {
        
        item.keywords = this.extractKeywords(item.text, template);
        item.emotionTags = this.extractEmotionTags(item.text, template);
        item.confidence = confidence;
        item.id = `${template.hexagram}_${template.line}_${String(validatedBatch.length + 1).padStart(5, '0')}`;
        
        validatedBatch.push(item);
        this.statistics.totalAccepted++;
      } else {
        this.statistics.totalRejected++;
      }
    }
    
    return validatedBatch;
  }

  /**
   * キーワード一致率の計算
   * 
   * 目的：
   * - テンプレートのキーフレーズとの一致度測定
   * - 爻の本質との関連性確認
   */
  calculateKeywordMatch(text, keyPhrases) {
    let matchCount = 0;
    
    for (const phrase of keyPhrases) {
      if (text.includes(phrase)) {
        matchCount++;
      }
    }
    
    return matchCount / keyPhrases.length;
  }

  /**
   * 不適切表現のチェック
   * 
   * 目的：
   * - 公序良俗に反する表現の除外
   * - 過度に攻撃的な表現の除外
   */
  checkAppropriate(text) {
    // 不適切語のリスト（実際はより包括的なリストが必要）
    const inappropriatePatterns = [
      /死にたい/,
      /殺す/,
      /自殺/,
      // その他の不適切表現
    ];
    
    for (const pattern of inappropriatePatterns) {
      if (pattern.test(text)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * 信頼度の計算
   * 
   * 目的：
   * - 生成文章の品質スコア算出
   * - 多面的な評価
   */
  calculateConfidence(item, template, keywordMatch) {
    let confidence = 0.5; // 基本スコア
    
    // キーワード一致率の影響
    confidence += keywordMatch * 0.3;
    
    // 感情の一致度
    const emotionMatch = this.calculateEmotionMatch(item.text, template.emotions);
    confidence += emotionMatch * 0.2;
    
    // 長さの適切性
    if (this.isLengthAppropriate(item.text, item.length)) {
      confidence += 0.1;
    }
    
    // 最大1.0に正規化
    return Math.min(confidence, 1.0);
  }

  /**
   * 感情の一致度計算
   * 
   * 目的：
   * - 文章の感情とテンプレート感情の一致度測定
   */
  calculateEmotionMatch(text, templateEmotions) {
    // 簡易的な感情判定（実際はより高度な感情分析が必要）
    const emotionPatterns = {
      anxiety: /不安|心配|怖|どうしよう/,
      frustration: /イライラ|ムカ|うざ|もどかし/,
      sadness: /悲し|辛い|寂し|虚し/,
      confusion: /わからない|迷|混乱|どっち/,
      hope: /期待|楽しみ|ワクワク|きっと/,
      determination: /頑張|決めた|覚悟|やる/
    };
    
    let matchCount = 0;
    for (const emotion of templateEmotions) {
      if (emotionPatterns[emotion] && emotionPatterns[emotion].test(text)) {
        matchCount++;
      }
    }
    
    return matchCount / templateEmotions.length;
  }

  /**
   * キーワード抽出
   * 
   * 目的：
   * - 生成文章から重要キーワードを抽出
   * - 検索用インデックス作成
   */
  extractKeywords(text, template) {
    const keywords = [];
    
    // テンプレートのキーフレーズをチェック
    for (const phrase of template.keyPhrases) {
      if (text.includes(phrase)) {
        keywords.push(phrase);
      }
    }
    
    // 追加の重要語抽出（簡易版）
    const importantWords = text.match(/[\u4e00-\u9fa5]{2,}/g) || [];
    for (const word of importantWords) {
      if (word.length >= 2 && word.length <= 4 && !keywords.includes(word)) {
        keywords.push(word);
      }
    }
    
    return keywords.slice(0, 5); // 最大5個
  }

  /**
   * 感情タグの抽出
   * 
   * 目的：
   * - 文章の感情分類
   * - 検索・分析用タグ付け
   */
  extractEmotionTags(text, template) {
    const tags = [];
    
    // テンプレートの感情を基本として採用
    tags.push(...template.emotions.slice(0, 2));
    
    // 追加の感情検出（簡易版）
    if (text.includes('！') || text.includes('!')) {
      tags.push('excited');
    }
    if (text.includes('？') || text.includes('?')) {
      tags.push('questioning');
    }
    
    return [...new Set(tags)]; // 重複除去
  }

  /**
   * 進捗更新
   * 
   * 目的：
   * - 生成進捗の記録
   * - リアルタイム監視用
   */
  updateProgress(hexNum, lineNum, count) {
    const key = `${hexNum}-${lineNum}`;
    const current = this.statistics.hexagramProgress.get(key) || 0;
    this.statistics.hexagramProgress.set(key, current + count);
    this.statistics.totalGenerated += count;
  }

  /**
   * 分布に基づく選択
   * 
   * 目的：
   * - 確率分布に従ったランダム選択
   * - バランスの取れた生成
   */
  selectByDistribution(distribution) {
    const random = Math.random();
    let cumulative = 0;
    
    for (const [key, probability] of Object.entries(distribution)) {
      cumulative += probability;
      if (random < cumulative) {
        return key;
      }
    }
    
    // フォールバック
    return Object.keys(distribution)[0];
  }

  /**
   * ランダム要素選択
   */
  selectRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * 長さの適切性チェック
   */
  isLengthAppropriate(text, lengthType) {
    const lengths = {
      short: { min: 10, max: 20 },
      medium: { min: 21, max: 100 },
      long: { min: 101, max: 200 }
    };
    
    const range = lengths[lengthType];
    return text.length >= range.min && text.length <= range.max;
  }

  /**
   * 遅延処理
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * データセットのエクスポート
   * 
   * 目的：
   * - 生成結果の外部出力
   * - 学習データとしての活用
   * 
   * 処理内容：
   * 1. JSON形式での構造化
   * 2. メタデータの付与
   * 3. 圧縮可能な形式
   * 
   * 出力：
   * - 構造化されたデータセット
   */
  exportToDataset() {
    const dataset = {
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0',
        totalTexts: this.statistics.totalGenerated,
        acceptedTexts: this.statistics.totalAccepted,
        rejectedTexts: this.statistics.totalRejected,
        config: this.config
      },
      hexagrams: {}
    };
    
    // 各卦・爻のデータを構造化
    for (const [key, texts] of this.generatedTexts.entries()) {
      const [hexNum, lineNum] = key.split('-').map(Number);
      
      if (!dataset.hexagrams[hexNum]) {
        dataset.hexagrams[hexNum] = {
          name: this.patternTemplates.templates[hexNum]?.name || `卦${hexNum}`,
          lines: {}
        };
      }
      
      dataset.hexagrams[hexNum].lines[lineNum] = {
        texts: texts.map(item => ({
          id: item.id,
          text: item.text,
          persona: item.persona,
          emotion_level: item.emotionLevel,
          length: item.length,
          keywords: item.keywords,
          emotion_tags: item.emotionTags,
          confidence: item.confidence
        })),
        statistics: {
          total: texts.length,
          personaDistribution: this.calculateDistribution(texts, 'persona'),
          emotionDistribution: this.calculateDistribution(texts, 'emotionLevel'),
          lengthDistribution: this.calculateDistribution(texts, 'length'),
          averageConfidence: this.calculateAverageConfidence(texts)
        }
      };
    }
    
    return dataset;
  }

  /**
   * 分布計算
   */
  calculateDistribution(texts, field) {
    const counts = {};
    
    for (const text of texts) {
      const value = text[field];
      counts[value] = (counts[value] || 0) + 1;
    }
    
    const total = texts.length;
    const distribution = {};
    
    for (const [key, count] of Object.entries(counts)) {
      distribution[key] = count / total;
    }
    
    return distribution;
  }

  /**
   * 平均信頼度計算
   */
  calculateAverageConfidence(texts) {
    if (texts.length === 0) return 0;
    
    const sum = texts.reduce((acc, text) => acc + text.confidence, 0);
    return sum / texts.length;
  }

  /**
   * 生成統計の取得
   * 
   * 目的：
   * - 進捗状況の確認
   * - 品質メトリクスの確認
   * 
   * 出力：
   * - 統計情報オブジェクト
   */
  getStatistics() {
    return {
      ...this.statistics,
      completionRate: this.calculateCompletionRate(),
      qualityRate: this.statistics.totalAccepted / (this.statistics.totalGenerated || 1),
      averageGenerationTime: this.statistics.generationTime / (this.statistics.totalGenerated || 1)
    };
  }

  /**
   * 完了率計算
   */
  calculateCompletionRate() {
    const targetTotal = 386 * this.config.targetPerLine; // 386爻
    return this.statistics.totalGenerated / targetTotal;
  }
}

// グローバルスコープにエクスポート
if (typeof window !== 'undefined') {
  window.SNSTextGenerator = SNSTextGenerator;
}