/**
 * テキストベクトル化システム
 * 
 * 日本語テキストを意味的に分析し、
 * 状況理解のための高次元ベクトル表現に変換
 */

class TextVectorizer {
  constructor() {
    // 意味的次元の定義
    this.semanticDimensions = {
      // 感情次元
      emotional: {
        positive: ['嬉しい', '楽しい', '幸せ', '喜び', '満足', '充実', '感謝', '愛', '希望'],
        negative: ['悲しい', '辛い', '苦しい', '怒り', '不満', '失望', '恐怖', '不安', '後悔'],
        neutral: ['普通', '平常', '日常', '通常', '一般的', '平凡', '当たり前']
      },
      
      // 時間次元
      temporal: {
        past: ['過去', '昔', '以前', 'かつて', '前に', 'だった', 'でした', '経験', '記憶'],
        present: ['今', '現在', '最近', 'いま', '現時点', 'ている', 'です', '日々'],
        future: ['未来', '将来', '今後', 'これから', '予定', 'つもり', 'たい', '目標']
      },
      
      // 行動次元
      action: {
        active: ['する', '行動', '実行', '挑戦', '取り組む', '進める', '動く', '活動'],
        passive: ['される', '待つ', '受ける', '任せる', '流れる', '委ねる', '見守る'],
        thinking: ['考える', '思う', '感じる', '悩む', '迷う', '検討', '分析', '理解']
      },
      
      // 関係性次元
      relational: {
        individual: ['自分', '私', '個人', '一人', '独自', '自己', '内面', '本音'],
        interpersonal: ['相手', '他人', '友人', '家族', '恋人', '仲間', '同僚', '知人'],
        social: ['社会', '世間', '会社', '組織', 'コミュニティ', '集団', '公', '全体']
      },
      
      // 確信度次元
      certainty: {
        certain: ['確実', '必ず', '絶対', '間違いない', '確信', '明確', 'はっきり'],
        uncertain: ['かも', 'たぶん', '多分', 'おそらく', '不確か', '曖昧', 'わからない'],
        questioning: ['どう', 'なぜ', '何', 'いつ', 'どこ', 'だろうか', 'でしょうか']
      },
      
      // 価値次元
      value: {
        material: ['お金', '収入', '財産', '物質', '経済', '贅沢', '所有', '資産'],
        spiritual: ['心', '精神', '魂', '信念', '価値観', '哲学', '意味', '目的'],
        experiential: ['経験', '体験', '成長', '学び', '発見', '気づき', '変化', '進化']
      }
    };
    
    // 複合概念パターン
    this.conceptPatterns = {
      // 葛藤パターン
      conflict: {
        patterns: ['でも', 'しかし', 'けれど', '一方で', 'とはいえ', 'ただし'],
        weight: 1.5
      },
      
      // 変化パターン
      change: {
        patterns: ['から', 'へ', 'なる', '変わる', '移る', '転じる', 'シフト'],
        weight: 1.3
      },
      
      // 因果パターン
      causality: {
        patterns: ['ので', 'から', 'ため', '結果', '原因', 'よって', 'せいで'],
        weight: 1.2
      },
      
      // 比較パターン
      comparison: {
        patterns: ['より', 'ほど', '比べて', '対して', '違い', '同じ', '似て'],
        weight: 1.1
      }
    };
    
    // ベクトル次元数
    this.vectorDimension = 128;
  }
  
  /**
   * テキストをベクトル化
   */
  vectorize(text) {
    // 前処理
    const processedText = this.preprocess(text);
    
    // 基本的な特徴抽出
    const basicFeatures = this.extractBasicFeatures(processedText);
    
    // 意味的特徴抽出
    const semanticFeatures = this.extractSemanticFeatures(processedText);
    
    // 構造的特徴抽出
    const structuralFeatures = this.extractStructuralFeatures(processedText);
    
    // 文脈的特徴抽出
    const contextualFeatures = this.extractContextualFeatures(processedText);
    
    // 特徴の統合とベクトル化
    const integratedVector = this.integrateFeatures({
      basic: basicFeatures,
      semantic: semanticFeatures,
      structural: structuralFeatures,
      contextual: contextualFeatures
    });
    
    // 正規化
    const normalizedVector = this.normalizeVector(integratedVector);
    
    return {
      vector: normalizedVector,
      features: {
        basic: basicFeatures,
        semantic: semanticFeatures,
        structural: structuralFeatures,
        contextual: contextualFeatures
      },
      metadata: {
        originalLength: text.length,
        processedLength: processedText.length,
        dimension: this.vectorDimension
      }
    };
  }
  
  /**
   * テキスト前処理
   */
  preprocess(text) {
    // 基本的な正規化
    let processed = text
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[！？]/g, match => match === '！' ? '!' : '?');
    
    // 句読点の統一
    processed = processed
      .replace(/、/g, ',')
      .replace(/。/g, '.');
    
    // 数値の正規化（プライバシー保護）
    processed = processed.replace(/\d+/g, '<NUM>');
    
    // URLやメールアドレスの除去
    processed = processed
      .replace(/https?:\/\/[^\s]+/g, '<URL>')
      .replace(/[\w\.-]+@[\w\.-]+\.\w+/g, '<EMAIL>');
    
    return processed;
  }
  
  /**
   * 基本的特徴の抽出
   */
  extractBasicFeatures(text) {
    return {
      length: text.length,
      sentenceCount: (text.match(/[.!?]/g) || []).length + 1,
      wordCount: text.split(/\s+/).length,
      exclamationCount: (text.match(/!/g) || []).length,
      questionCount: (text.match(/\?/g) || []).length,
      avgSentenceLength: text.length / ((text.match(/[.!?]/g) || []).length + 1)
    };
  }
  
  /**
   * 意味的特徴の抽出
   */
  extractSemanticFeatures(text) {
    const features = {};
    
    // 各意味次元でのスコア計算
    Object.entries(this.semanticDimensions).forEach(([dimension, categories]) => {
      features[dimension] = {};
      
      Object.entries(categories).forEach(([category, keywords]) => {
        let score = 0;
        keywords.forEach(keyword => {
          const matches = (text.match(new RegExp(keyword, 'g')) || []).length;
          score += matches;
        });
        features[dimension][category] = score;
      });
      
      // 次元内での正規化
      const total = Object.values(features[dimension]).reduce((a, b) => a + b, 0);
      if (total > 0) {
        Object.keys(features[dimension]).forEach(category => {
          features[dimension][category] /= total;
        });
      }
    });
    
    return features;
  }
  
  /**
   * 構造的特徴の抽出
   */
  extractStructuralFeatures(text) {
    const features = {
      complexity: 0,
      coherence: 0,
      conceptDiversity: 0
    };
    
    // 複雑さの計算（複合概念の使用）
    Object.entries(this.conceptPatterns).forEach(([concept, data]) => {
      data.patterns.forEach(pattern => {
        if (text.includes(pattern)) {
          features.complexity += data.weight;
        }
      });
    });
    
    // 一貫性の計算（同じ概念の繰り返し）
    const words = text.split(/\s+/);
    const uniqueWords = new Set(words);
    features.coherence = 1 - (uniqueWords.size / words.length);
    
    // 概念の多様性
    let conceptCount = 0;
    Object.values(this.semanticDimensions).forEach(dimension => {
      Object.values(dimension).forEach(keywords => {
        if (keywords.some(keyword => text.includes(keyword))) {
          conceptCount++;
        }
      });
    });
    features.conceptDiversity = conceptCount / 30; // 正規化
    
    return features;
  }
  
  /**
   * 文脈的特徴の抽出
   */
  extractContextualFeatures(text) {
    const features = {
      narrativeFlow: 0,
      emotionalIntensity: 0,
      cognitiveLoad: 0,
      socialOrientation: 0
    };
    
    // 物語の流れ（時間マーカーの順序性）
    const temporalMarkers = ['まず', '次に', 'そして', '最後に', '結果'];
    let flowScore = 0;
    let lastIndex = -1;
    temporalMarkers.forEach(marker => {
      const index = text.indexOf(marker);
      if (index > lastIndex) {
        flowScore++;
        lastIndex = index;
      }
    });
    features.narrativeFlow = flowScore / temporalMarkers.length;
    
    // 感情的強度
    const intensifiers = ['とても', 'すごく', '本当に', '非常に', 'かなり'];
    intensifiers.forEach(word => {
      if (text.includes(word)) features.emotionalIntensity += 0.2;
    });
    features.emotionalIntensity = Math.min(features.emotionalIntensity, 1);
    
    // 認知的負荷（複雑な表現の使用）
    const complexExpressions = ['つまり', '言い換えれば', '要するに', '具体的には'];
    complexExpressions.forEach(expr => {
      if (text.includes(expr)) features.cognitiveLoad += 0.25;
    });
    
    // 社会的志向性
    const socialMarkers = ['みんな', '他の人', '社会', '世間', '周り'];
    socialMarkers.forEach(marker => {
      if (text.includes(marker)) features.socialOrientation += 0.2;
    });
    features.socialOrientation = Math.min(features.socialOrientation, 1);
    
    return features;
  }
  
  /**
   * 特徴の統合
   */
  integrateFeatures(allFeatures) {
    const vector = new Array(this.vectorDimension).fill(0);
    let index = 0;
    
    // 基本特徴の埋め込み（6次元）
    const basicValues = Object.values(allFeatures.basic);
    basicValues.forEach((value, i) => {
      if (index < this.vectorDimension) {
        vector[index++] = value / 100; // 正規化
      }
    });
    
    // 意味的特徴の埋め込み
    Object.values(allFeatures.semantic).forEach(dimension => {
      Object.values(dimension).forEach(value => {
        if (index < this.vectorDimension) {
          vector[index++] = value;
        }
      });
    });
    
    // 構造的特徴の埋め込み
    Object.values(allFeatures.structural).forEach(value => {
      if (index < this.vectorDimension) {
        vector[index++] = value;
      }
    });
    
    // 文脈的特徴の埋め込み
    Object.values(allFeatures.contextual).forEach(value => {
      if (index < this.vectorDimension) {
        vector[index++] = value;
      }
    });
    
    // 残りの次元は相互作用特徴で埋める
    while (index < this.vectorDimension) {
      // 感情×時間の相互作用
      const emotionTime = 
        (allFeatures.semantic.emotional?.positive || 0) * 
        (allFeatures.semantic.temporal?.future || 0);
      vector[index++] = emotionTime;
      
      if (index >= this.vectorDimension) break;
      
      // 行動×関係性の相互作用
      const actionRelation = 
        (allFeatures.semantic.action?.active || 0) * 
        (allFeatures.semantic.relational?.social || 0);
      vector[index++] = actionRelation;
      
      if (index >= this.vectorDimension) break;
      
      // ランダムノイズ（過学習防止）
      vector[index++] = Math.random() * 0.1;
    }
    
    return vector;
  }
  
  /**
   * ベクトルの正規化
   */
  normalizeVector(vector) {
    // L2正規化
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitude === 0) {
      return vector;
    }
    
    return vector.map(val => val / magnitude);
  }
  
  /**
   * 2つのベクトル間の類似度計算
   */
  calculateSimilarity(vector1, vector2) {
    if (vector1.length !== vector2.length) {
      throw new Error('Vectors must have the same dimension');
    }
    
    // コサイン類似度
    let dotProduct = 0;
    for (let i = 0; i < vector1.length; i++) {
      dotProduct += vector1[i] * vector2[i];
    }
    
    return dotProduct; // 正規化済みベクトルなので、これがコサイン類似度
  }
  
  /**
   * 特徴の重要度分析
   */
  analyzeFeatureImportance(vectorizedResult) {
    const importance = {
      emotional: 0,
      temporal: 0,
      relational: 0,
      structural: 0
    };
    
    // 各カテゴリの寄与度を計算
    const features = vectorizedResult.features;
    
    // 感情的側面の重要度
    const emotionalTotal = Object.values(features.semantic.emotional || {})
      .reduce((sum, val) => sum + Math.abs(val), 0);
    importance.emotional = emotionalTotal;
    
    // 時間的側面の重要度
    const temporalTotal = Object.values(features.semantic.temporal || {})
      .reduce((sum, val) => sum + Math.abs(val), 0);
    importance.temporal = temporalTotal;
    
    // 関係性の重要度
    const relationalTotal = Object.values(features.semantic.relational || {})
      .reduce((sum, val) => sum + Math.abs(val), 0);
    importance.relational = relationalTotal;
    
    // 構造的複雑さの重要度
    importance.structural = features.structural.complexity * 0.5 + 
                          features.structural.conceptDiversity * 0.5;
    
    // 正規化
    const total = Object.values(importance).reduce((sum, val) => sum + val, 0);
    if (total > 0) {
      Object.keys(importance).forEach(key => {
        importance[key] /= total;
      });
    }
    
    return importance;
  }
}

// エクスポート
if (typeof window !== 'undefined') {
  window.TextVectorizer = TextVectorizer;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TextVectorizer;
}