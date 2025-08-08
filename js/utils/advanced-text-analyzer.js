/**
 * Advanced Text Analyzer for Real-World Input
 * SNS、口語表現、不完全文章対応
 * 
 * CLAUDE.md準拠：根本解決優先、フォールバック禁止
 */

window.AdvancedTextAnalyzer = {
  
  /**
   * 実際のユーザー入力を解析
   * SNSスタイル、口語、感情表現に対応
   */
  analyzeRealUserText(input) {
    console.log('🧠 Advanced Text Analysis for:', input.substring(0, 50));
    
    const analysis = {
      // 1. 感情の深層分析
      emotions: this.analyzeDeepEmotions(input),
      
      // 2. 口語・SNS表現の正規化
      normalized: this.normalizeColloquialText(input),
      
      // 3. 文脈からの意図推測
      intentions: this.inferIntentionsFromContext(input),
      
      // 4. 心理状態の多層分析
      psychologicalState: this.analyzePsychologicalLayers(input),
      
      // 5. 関係性パターン抽出
      relationalPatterns: this.extractRelationalPatterns(input),
      
      // 6. 易経マッピング用キーワード生成
      ichingKeywords: this.generateIChingRelevantKeywords(input)
    };
    
    return this.mapToHexagram(analysis);
  },
  
  /**
   * 深層感情分析
   * 表面的な言葉だけでなく、文脈から真の感情を読み取る
   */
  analyzeDeepEmotions(text) {
    const emotions = {
      surface: [],    // 表面的な感情
      underlying: [], // 潜在的な感情
      complexity: 0   // 感情の複雑さ
    };
    
    // SNS特有の表現パターン
    const patterns = {
      frustration: [
        /イライラ|むかつく|うざい|きれそう/,
        /もう.*無理|まじ.*やばい/,
        /www$|笑$|草$/  // 自嘲的な笑い
      ],
      anxiety: [
        /不安|心配|怖い|やばい/,
        /どうしよう|どうしたら|わからない/,
        /。。。|・・・|…/  // 言葉にできない不安
      ],
      helplessness: [
        /もうダメ|つらい|しんどい|疲れた/,
        /できない|無理|諦め/,
        /かも(?!しれない)/  // 曖昧な表現
      ],
      sensitivity: [
        /敏感|感じやすい|影響.*受け/,
        /気になる|気にしちゃう|考えちゃう/,
        /自分.*嫌|自己嫌悪/
      ],
      suppression: [
        /言えない|我慢|耐える/,
        /でも|だけど|けど/,  // 葛藤の表現
        /したい.*けど.*ない/  // 願望と現実のギャップ
      ]
    };
    
    // パターンマッチングで感情を抽出
    for (const [emotion, patternList] of Object.entries(patterns)) {
      for (const pattern of patternList) {
        if (pattern.test(text)) {
          emotions.surface.push(emotion);
          
          // 深層分析
          if (emotion === 'frustration' && text.includes('自分')) {
            emotions.underlying.push('self-directed-anger');
          }
          if (emotion === 'sensitivity' && text.includes('ニュートラル')) {
            emotions.underlying.push('desire-for-stability');
          }
        }
      }
    }
    
    // 感情の複雑さを計算
    emotions.complexity = emotions.surface.length + emotions.underlying.length * 2;
    
    return emotions;
  },
  
  /**
   * 口語表現の正規化
   * SNSや話し言葉を分析可能な形に変換
   */
  normalizeColloquialText(text) {
    let normalized = text;
    
    // 口語表現の正規化マップ
    const colloquialMap = {
      'しちゃう': 'してしまう',
      'やばい': '危険/困難',
      'むかつく': '怒りを感じる',
      'まにあわない': '間に合わない',
      'www': '',  // 笑い表現を除去
      '。。。': '（不安）',
      '！！': '（強調）',
      'かも': '可能性がある',
      '無理': '困難である',
      'ダメ': '不可能/絶望的'
    };
    
    for (const [colloquial, formal] of Object.entries(colloquialMap)) {
      normalized = normalized.replace(new RegExp(colloquial, 'g'), formal);
    }
    
    // 文章の断片化を検出
    const fragments = normalized.split(/。|！|？/).filter(f => f.length > 0);
    
    return {
      original: text,
      normalized: normalized,
      fragments: fragments,
      isFragmented: fragments.length > 3,
      hasEmotionalMarkers: /！|。。。|www/.test(text)
    };
  },
  
  /**
   * 文脈からの意図推測
   * 不完全な文章から真の意図を読み取る
   */
  inferIntentionsFromContext(text) {
    const intentions = [];
    
    // 「〜たい」願望パターン
    if (/したい|たい(?!へん)|欲しい|なりたい/.test(text)) {
      intentions.push('desire-for-change');
    }
    
    // 「どうしたら」相談パターン
    if (/どうしたら|どうすれば|どうやって|するには/.test(text)) {
      intentions.push('seeking-advice');
    }
    
    // 自己改善パターン
    if (/ニュートラル|保てる|なるには|改善|直したい/.test(text)) {
      intentions.push('self-improvement');
    }
    
    // 感情コントロールパターン
    if (/気持ち.*浮き沈み|感情.*コントロール|冷静|落ち着/.test(text)) {
      intentions.push('emotional-regulation');
    }
    
    // 対人関係パターン
    if (/人|相手|みんな|世の中|親|友/.test(text)) {
      intentions.push('interpersonal-issues');
    }
    
    return intentions;
  },
  
  /**
   * 心理状態の多層分析
   */
  analyzePsychologicalLayers(text) {
    return {
      // 認知層（どう考えているか）
      cognitive: {
        selfAwareness: /自分.*性格|自分.*気持ち/.test(text),
        problemRecognition: /問題|困った|悩み/.test(text),
        solutionSeeking: /どうしたら|するには|方法/.test(text)
      },
      
      // 感情層（どう感じているか）
      emotional: {
        overwhelmed: /もう.*無理|疲れた|しんどい/.test(text),
        frustrated: /イライラ|むかつく|腹立つ/.test(text),
        anxious: /不安|心配|怖い/.test(text)
      },
      
      // 行動層（どう行動しているか）
      behavioral: {
        avoidance: /逃げ|避け|関わらない/.test(text),
        suppression: /我慢|耐える|言えない/.test(text),
        seeking: /相談|聞いて|教えて/.test(text)
      }
    };
  },
  
  /**
   * 関係性パターンの抽出
   */
  extractRelationalPatterns(text) {
    const patterns = [];
    
    if (/世の中|みんな|他人|人々/.test(text)) {
      patterns.push('society-individual');
    }
    
    if (/影響.*受け|敏感.*感じ|反応/.test(text)) {
      patterns.push('high-sensitivity');
    }
    
    if (/自分.*相手|自分.*他人/.test(text)) {
      patterns.push('self-other-boundary');
    }
    
    if (/親|家族|身内/.test(text)) {
      patterns.push('family-dynamics');
    }
    
    return patterns;
  },
  
  /**
   * 易経マッピング用キーワード生成
   * 分析結果を易経の概念に変換
   */
  generateIChingRelevantKeywords(text) {
    const analysis = {
      emotions: this.analyzeDeepEmotions(text),
      intentions: this.inferIntentionsFromContext(text),
      psychological: this.analyzePsychologicalLayers(text)
    };
    
    const keywords = [];
    
    // 感情から易経キーワードへ
    if (analysis.emotions.underlying.includes('desire-for-stability')) {
      keywords.push('中庸', '平衡', '調和', '安定');
    }
    
    if (analysis.emotions.surface.includes('sensitivity')) {
      keywords.push('感応', '共感', '影響', '変化');
    }
    
    // 意図から易経キーワードへ
    if (analysis.intentions.includes('self-improvement')) {
      keywords.push('修養', '成長', '改善', '進歩');
    }
    
    if (analysis.intentions.includes('emotional-regulation')) {
      keywords.push('節度', '抑制', '自制', '静止');
    }
    
    // 心理状態から易経キーワードへ
    if (analysis.psychological.cognitive.solutionSeeking) {
      keywords.push('方向', '道', '指針', '啓蒙');
    }
    
    return keywords;
  },
  
  /**
   * 分析結果を最適な卦にマッピング
   */
  mapToHexagram(analysis) {
    // 易経64卦との照合ロジック
    const hexagramScores = {};
    
    // 例：風沢中孚（61番）- 真心で人の心を動かす
    if (analysis.emotions.underlying.includes('desire-for-stability')) {
      hexagramScores[61] = (hexagramScores[61] || 0) + 10;
    }
    
    // 例：水沢節（60番）- 自分を律し節度を保つ
    if (analysis.intentions.includes('emotional-regulation')) {
      hexagramScores[60] = (hexagramScores[60] || 0) + 15;
    }
    
    // 例：沢山咸（31番）- 理屈抜きに心で感じ取る共感者
    if (analysis.relationalPatterns.includes('high-sensitivity')) {
      hexagramScores[31] = (hexagramScores[31] || 0) + 12;
    }
    
    // 最高スコアの卦を選択
    const bestHexagramId = Object.entries(hexagramScores)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 1;
    
    return {
      hexagramId: parseInt(bestHexagramId),
      confidence: Math.min(hexagramScores[bestHexagramId] || 0, 100),
      analysis: analysis,
      keywords: analysis.ichingKeywords
    };
  }
};

// 初期化
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ AdvancedTextAnalyzer loaded - SNS/口語対応版');
  });
}