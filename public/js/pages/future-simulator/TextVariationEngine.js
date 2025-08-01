/**
 * テキストバリエーション生成エンジン
 * 
 * 目的：
 * - 同じ意味を持つ多様な表現生成
 * - SNS特有要素の自然な組み込み
 * - ペルソナに応じた文体調整
 * - 386爻の本質を保ちながら表現を多様化
 * 
 * 主要機能：
 * - 同義語・類語変換
 * - 感情表現の強弱調整
 * - 絵文字・記号の適切な配置
 * - 文体のペルソナ適応
 * 
 * 前提条件：
 * - 日本語の自然な表現規則
 * - SNSでの一般的な表現パターン
 * - 世代別の言語使用傾向
 */
class TextVariationEngine {
  constructor() {
    this.synonymDictionary = this.initializeSynonymDictionary();
    this.emotionExpressions = this.initializeEmotionExpressions();
    this.snsElements = this.initializeSNSElements();
    this.personaStyles = this.initializePersonaStyles();
    this.variationPatterns = this.initializeVariationPatterns();
  }

  /**
   * 同義語辞書の初期化
   * 
   * 目的：
   * - 基本的な同義語・類語のマッピング
   * - 文脈に応じた適切な置換
   * 
   * 構造：
   * - カテゴリ別の同義語グループ
   * - 強度レベル別の表現
   */
  initializeSynonymDictionary() {
    return {
      // 感情表現の同義語
      emotions: {
        不安: ['心配', '気がかり', '懸念', 'モヤモヤ', '落ち着かない'],
        悲しい: ['辛い', '切ない', 'しんどい', '寂しい', '虚しい'],
        嬉しい: ['楽しい', '幸せ', 'ハッピー', '最高', 'ワクワク'],
        怒り: ['イライラ', 'ムカつく', '腹立つ', '頭にくる', 'キレそう'],
        困惑: ['迷う', '悩む', 'わからない', '混乱', 'どうしよう']
      },
      
      // 時間表現の同義語
      temporal: {
        今: ['現在', 'いま', '今まさに', 'ちょうど', 'この瞬間'],
        最近: ['このごろ', 'ここ最近', '近頃', 'ここんとこ', 'このところ'],
        いつも: ['常に', 'しょっちゅう', '毎回', 'ずっと', '四六時中']
      },
      
      // 程度表現の同義語
      degree: {
        とても: ['すごく', 'めっちゃ', 'かなり', '超', 'マジで'],
        少し: ['ちょっと', 'やや', '若干', 'ちょい', '微妙に'],
        完全に: ['まったく', '全然', '100%', '完璧に', 'ガチで']
      },
      
      // 行動表現の同義語
      actions: {
        頑張る: ['努力する', '踏ん張る', '粘る', 'ファイトする', '全力出す'],
        諦める: ['やめる', 'ギブアップ', '断念する', '投げ出す', '降参'],
        考える: ['思う', '悩む', '検討する', '思案する', 'じっくり考える']
      },
      
      // 状態表現の同義語
      states: {
        困難: ['大変', '厳しい', 'ハード', 'きつい', 'しんどい'],
        順調: ['うまくいく', 'スムーズ', '好調', 'いい感じ', '絶好調'],
        停滞: ['止まる', '進まない', '膠着', 'スタック', '行き詰まり']
      }
    };
  }

  /**
   * 感情表現パターンの初期化
   * 
   * 目的：
   * - 感情の強度別表現
   * - ペルソナ別の感情表現
   */
  initializeEmotionExpressions() {
    return {
      anxiety: {
        low: ['ちょっと不安', '少し心配', 'なんか気になる'],
        medium: ['不安だ', '心配になってきた', 'どうしよう'],
        high: ['めっちゃ不安', 'マジでやばい', 'パニックになりそう']
      },
      hope: {
        low: ['ちょっと期待', 'なんとかなるかも', '少し光が見えた'],
        medium: ['期待してる', 'きっと大丈夫', 'いけそうな気がする'],
        high: ['絶対うまくいく', '確信してる', '間違いない']
      },
      frustration: {
        low: ['ちょっとイラッと', '少しモヤモヤ', 'なんかな〜'],
        medium: ['イライラする', 'もどかしい', 'ストレス'],
        high: ['マジでムカつく', 'ブチ切れそう', '限界']
      }
    };
  }

  /**
   * SNS要素の初期化
   * 
   * 目的：
   * - 絵文字、顔文字、記号のパターン
   * - ペルソナ別の使用傾向
   */
  initializeSNSElements() {
    return {
      emojis: {
        positive: ['😊', '✨', '🌟', '💫', '🎉', '👍', '💪'],
        negative: ['😔', '😢', '😭', '💔', '😰', '😱', '🥺'],
        neutral: ['🤔', '😅', '💦', '📝', '💭', '🙏', '👀']
      },
      
      emoticons: {
        positive: ['(^^)', '(*´▽｀*)', '\\(^o^)/', 'ヽ(´▽｀)/'],
        negative: ['(T_T)', '(´；ω；`)', 'orz', '(>_<)'],
        neutral: ['(・_・)', '(´・ω・`)', '(￣▽￣)', '( ˘ω˘ )']
      },
      
      punctuation: {
        excitement: ['！', '!!', '!!!', '!?'],
        question: ['？', '??', '???', '?!'],
        ellipsis: ['...', '。。。', '・・・', '…']
      },
      
      lineBreaks: {
        young: ['\n', '\n\n', '。\n'],
        adult: ['。', '。\n', '、'],
        senior: ['。', '。', '、']
      }
    };
  }

  /**
   * ペルソナ別スタイルの初期化
   * 
   * 目的：
   * - 世代別の言語使用パターン
   * - 特徴的な表現の定義
   */
  initializePersonaStyles() {
    return {
      young: {
        endings: ['〜', 'よね', 'じゃん', 'っしょ', 'だよ'],
        intensifiers: ['マジ', 'ガチ', '超', 'めっちゃ', 'やばい'],
        fillers: ['なんか', 'ってか', 'つか', 'みたいな'],
        abbreviations: true,
        emojiFrequency: 0.7
      },
      
      adult: {
        endings: ['です', 'ます', 'ですね', 'でしょう', 'かな'],
        intensifiers: ['とても', 'かなり', '非常に', '本当に'],
        fillers: ['やはり', 'おそらく', 'たぶん', '思うのですが'],
        abbreviations: false,
        emojiFrequency: 0.3
      },
      
      senior: {
        endings: ['です', 'ます', 'でございます', 'ですな'],
        intensifiers: ['大変', '実に', '誠に', 'まことに'],
        fillers: ['思うに', '考えるに', 'さて', '振り返ると'],
        abbreviations: false,
        emojiFrequency: 0.1
      }
    };
  }

  /**
   * バリエーションパターンの初期化
   * 
   * 目的：
   * - 文章構造の変換パターン
   * - 表現の多様化手法
   */
  initializeVariationPatterns() {
    return {
      // 文の始まり方
      openings: {
        statement: ['', 'えっと、', 'あの、', 'そういえば、', 'ところで、'],
        emotion: ['うわー、', 'あー、', 'もう、', 'はぁ、', 'よし、'],
        time: ['今日も', '最近', 'さっき', 'また', 'いつも']
      },
      
      // 文の終わり方
      closings: {
        assertion: ['', 'と思う', 'って感じ', 'なんだよね', 'みたい'],
        question: ['かな？', 'よね？', 'でしょ？', 'じゃない？'],
        emotion: ['なー', 'よ', 'わ', 'ね', 'さ']
      },
      
      // 接続詞
      connectors: {
        addition: ['それに', 'あと', 'さらに', 'そして', 'また'],
        contrast: ['でも', 'だけど', 'しかし', 'ただ', 'けど'],
        result: ['だから', 'なので', 'そのため', 'ゆえに', 'よって']
      }
    };
  }

  /**
   * テキストのバリエーション生成（メイン関数）
   * 
   * 目的：
   * - 入力テキストから多様な表現を生成
   * - 意味を保ちながら表現を変化
   * 
   * 入力：
   * - text: 元のテキスト
   * - options: 生成オプション（ペルソナ、感情レベル等）
   * 
   * 処理内容：
   * 1. 基本的な同義語置換
   * 2. ペルソナに応じた文体調整
   * 3. SNS要素の追加
   * 4. 感情表現の調整
   * 
   * 出力：
   * - バリエーション配列
   */
  generateVariations(text, options = {}) {
    const {
      persona = 'young',
      emotionLevel = 'medium',
      count = 5,
      maintainLength = false,
      emotions = []
    } = options;

    const variations = [];
    
    // 基本バリエーション生成
    for (let i = 0; i < count; i++) {
      let variation = text;
      
      // 1. 同義語置換
      variation = this.applySynonymReplacement(variation);
      
      // 2. ペルソナ調整
      variation = this.adjustForPersona(variation, persona);
      
      // 3. 感情表現の調整
      if (emotions.length > 0) {
        variation = this.adjustEmotionExpression(variation, emotions[0], emotionLevel);
      }
      
      // 4. SNS要素の追加
      variation = this.addSNSElements(variation, persona);
      
      // 5. 文構造の変更
      if (!maintainLength) {
        variation = this.modifyStructure(variation, persona);
      }
      
      // 6. 長さ調整
      if (maintainLength) {
        variation = this.adjustLength(variation, text.length);
      }
      
      variations.push(variation);
    }
    
    // 重複除去
    return [...new Set(variations)];
  }

  /**
   * 同義語置換の適用
   * 
   * 目的：
   * - テキスト内の単語を同義語に置換
   * - 自然な文章を保つ
   */
  applySynonymReplacement(text) {
    let result = text;
    
    // 各カテゴリの同義語を確率的に置換
    Object.entries(this.synonymDictionary).forEach(([category, groups]) => {
      Object.entries(groups).forEach(([original, synonyms]) => {
        if (result.includes(original) && Math.random() < 0.5) {
          const replacement = this.selectRandom(synonyms);
          result = result.replace(original, replacement);
        }
      });
    });
    
    return result;
  }

  /**
   * ペルソナに応じた調整
   * 
   * 目的：
   * - 世代に応じた言葉遣いに変換
   * - 自然な口調の実現
   */
  adjustForPersona(text, persona) {
    const style = this.personaStyles[persona];
    if (!style) return text;
    
    let result = text;
    
    // 文末表現の調整
    const currentEnding = this.detectEnding(result);
    if (currentEnding && Math.random() < 0.7) {
      const newEnding = this.selectRandom(style.endings);
      result = this.replaceEnding(result, newEnding);
    }
    
    // 強調表現の追加
    if (Math.random() < 0.5) {
      const intensifier = this.selectRandom(style.intensifiers);
      result = this.addIntensifier(result, intensifier);
    }
    
    // フィラーの追加
    if (Math.random() < 0.3) {
      const filler = this.selectRandom(style.fillers);
      result = filler + result;
    }
    
    return result;
  }

  /**
   * 感情表現の調整
   * 
   * 目的：
   * - 感情の強度に応じた表現変更
   * - 自然な感情表現の実現
   */
  adjustEmotionExpression(text, emotion, level) {
    const expressions = this.emotionExpressions[emotion];
    if (!expressions || !expressions[level]) return text;
    
    // 感情表現を文頭または文末に追加
    const expression = this.selectRandom(expressions[level]);
    
    if (Math.random() < 0.5) {
      // 文頭に追加
      return expression + '、' + text;
    } else {
      // 文末に追加
      return text + '。' + expression;
    }
  }

  /**
   * SNS要素の追加
   * 
   * 目的：
   * - 絵文字、顔文字、記号の自然な追加
   * - ペルソナに応じた頻度調整
   */
  addSNSElements(text, persona) {
    const style = this.personaStyles[persona];
    let result = text;
    
    // 絵文字の追加
    if (Math.random() < style.emojiFrequency) {
      const emotion = this.detectEmotion(text);
      const emojiCategory = emotion === 'positive' ? 'positive' : 
                           emotion === 'negative' ? 'negative' : 'neutral';
      const emoji = this.selectRandom(this.snsElements.emojis[emojiCategory]);
      result += emoji;
    }
    
    // 句読点の調整
    if (persona === 'young' && Math.random() < 0.5) {
      result = this.adjustPunctuation(result);
    }
    
    return result;
  }

  /**
   * 文構造の変更
   * 
   * 目的：
   * - 文の順序や構造を変更
   * - より多様な表現の生成
   */
  modifyStructure(text, persona) {
    let result = text;
    
    // 開始表現の追加
    if (Math.random() < 0.3) {
      const openingType = this.selectRandom(['statement', 'emotion', 'time']);
      const opening = this.selectRandom(this.variationPatterns.openings[openingType]);
      result = opening + result;
    }
    
    // 終了表現の変更
    if (Math.random() < 0.5) {
      const closingType = this.selectRandom(['assertion', 'question', 'emotion']);
      const closing = this.selectRandom(this.variationPatterns.closings[closingType]);
      result = this.addClosing(result, closing);
    }
    
    return result;
  }

  /**
   * 長さ調整
   * 
   * 目的：
   * - 指定された長さに近づける
   * - 自然な文章を保つ
   */
  adjustLength(text, targetLength) {
    const currentLength = text.length;
    
    if (Math.abs(currentLength - targetLength) <= 5) {
      return text; // 許容範囲内
    }
    
    if (currentLength < targetLength) {
      // 延長
      return this.extendText(text, targetLength);
    } else {
      // 短縮
      return this.shortenText(text, targetLength);
    }
  }

  /**
   * テキストの延長
   */
  extendText(text, targetLength) {
    const additions = [
      'って感じ',
      'みたいな',
      'かな〜',
      'と思う',
      'なんだよね'
    ];
    
    let result = text;
    while (result.length < targetLength - 5) {
      const addition = this.selectRandom(additions);
      result += addition;
      if (result.length >= targetLength) break;
    }
    
    return result;
  }

  /**
   * テキストの短縮
   */
  shortenText(text, targetLength) {
    // 句読点で分割して短縮
    const sentences = text.split(/[。！？]/);
    let result = '';
    
    for (const sentence of sentences) {
      if (result.length + sentence.length <= targetLength) {
        result += sentence + '。';
      } else {
        break;
      }
    }
    
    return result || text.substring(0, targetLength);
  }

  // ===== ユーティリティメソッド =====
  
  /**
   * ランダム選択
   */
  selectRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * 文末検出
   */
  detectEnding(text) {
    const endings = ['です', 'ます', 'だ', 'だよ', 'よね', 'かな'];
    for (const ending of endings) {
      if (text.endsWith(ending)) {
        return ending;
      }
    }
    return null;
  }

  /**
   * 文末置換
   */
  replaceEnding(text, newEnding) {
    const currentEnding = this.detectEnding(text);
    if (currentEnding) {
      return text.slice(0, -currentEnding.length) + newEnding;
    }
    return text + newEnding;
  }

  /**
   * 強調表現の追加
   */
  addIntensifier(text, intensifier) {
    // 形容詞や動詞の前に追加
    const patterns = [
      /(難しい|大変|辛い|楽しい|嬉しい)/,
      /(頑張|努力|諦め|考え)/
    ];
    
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return text.replace(pattern, intensifier + '$1');
      }
    }
    
    // パターンにマッチしない場合は文頭に追加
    return intensifier + text;
  }

  /**
   * 感情の検出
   */
  detectEmotion(text) {
    const positiveWords = ['嬉しい', '楽しい', '幸せ', '最高', '良い', '成功'];
    const negativeWords = ['悲しい', '辛い', '困る', '失敗', '不安', '心配'];
    
    for (const word of positiveWords) {
      if (text.includes(word)) return 'positive';
    }
    
    for (const word of negativeWords) {
      if (text.includes(word)) return 'negative';
    }
    
    return 'neutral';
  }

  /**
   * 句読点の調整
   */
  adjustPunctuation(text) {
    let result = text;
    
    // 。を！に変更（50%の確率）
    if (Math.random() < 0.5) {
      result = result.replace(/。/g, '！');
    }
    
    // 、を削除（30%の確率）
    if (Math.random() < 0.3) {
      result = result.replace(/、/g, '');
    }
    
    return result;
  }

  /**
   * 終了表現の追加
   */
  addClosing(text, closing) {
    // 既存の句読点を削除
    let result = text.replace(/[。！？]+$/, '');
    
    // 新しい終了表現を追加
    return result + closing;
  }

  /**
   * バッチ処理用の高速バリエーション生成
   * 
   * 目的：
   * - 大量のテキストを効率的に処理
   * - メモリ効率を考慮
   */
  generateBatchVariations(texts, options = {}) {
    const results = [];
    
    for (const text of texts) {
      const variations = this.generateVariations(text, options);
      results.push({
        original: text,
        variations: variations
      });
    }
    
    return results;
  }
}

// グローバルスコープにエクスポート
if (typeof window !== 'undefined') {
  window.TextVariationEngine = TextVariationEngine;
}