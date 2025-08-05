/**
 * 文化適応エンジン - 文脈依存メタファー生成システム
 * 
 * 目的：
 * - 易経の普遍的智慧を現代的・文化的文脈に適応させる
 * - ユーザーの文化的背景に応じたメタファーの選択と調整
 * - 世代、職業、地域による表現の最適化
 * - 国際化対応を見据えた拡張可能な設計
 * 
 * 入力：
 * - hexagramMapping: object - 易経マッピング結果
 * - userContext: object - ユーザーコンテキスト（年齢、職業、地域等）
 * - culturalSettings: object - 文化設定（言語、地域、表現スタイル）
 * 
 * 処理内容：
 * 1. 文化的コンテキスト分析
 * 2. メタファーバンク検索
 * 3. 世代別表現調整
 * 4. 職業別用語選択
 * 5. 地域特性反映
 * 6. 表現スタイル最適化
 * 
 * 出力：
 * - adaptedMetaphors: Array - 文化適応されたメタファー群
 * - expressionStyle: object - 推奨表現スタイル
 * - culturalNotes: Array - 文化的配慮事項
 * - confidence: number - 適応信頼度
 * 
 * 副作用：
 * - メタファー使用履歴の記録
 * - 文化適応パターンの学習
 * 
 * 前提条件：
 * - HexagramMappingEngineの結果が利用可能
 * - ユーザーコンテキストが提供される
 * 
 * エラー処理：
 * - 文化データ不足時のデフォルト処理
 * - 不適切表現の自動フィルタリング
 */
class CulturalAdaptationEngine {
  constructor() {
    // メタファーバンク（日本文化用初期設定）
    this.metaphorBank = {
      // 自然メタファー
      nature: {
        growth: ['種から芽が出る', '花が咲く', '実を結ぶ', '根を張る'],
        flow: ['川の流れ', '潮の満ち引き', '風の向き', '波の動き'],
        seasons: ['春の訪れ', '夏の成長', '秋の収穫', '冬の蓄え'],
        weather: ['晴れ間', '雨上がり', '嵐の前', '霧の中']
      },
      
      // ビジネスメタファー
      business: {
        strategy: ['戦略的布石', 'ピボット', 'ブレークスルー', 'シナジー効果'],
        growth: ['スケールアップ', '市場開拓', 'イノベーション', 'パラダイムシフト'],
        challenge: ['ボトルネック', 'クリティカルパス', 'リスクヘッジ', 'コンティンジェンシー'],
        team: ['チームビルディング', 'コラボレーション', 'アライアンス', 'エンゲージメント']
      },
      
      // 日常生活メタファー
      daily: {
        journey: ['一歩ずつ', '道を開く', '岐路に立つ', '目的地へ'],
        cooking: ['材料を揃える', '火加減', '味付け', '盛り付け'],
        building: ['土台作り', '柱を立てる', '屋根をかける', '仕上げ'],
        gardening: ['土を耕す', '種まき', '水やり', '剪定']
      },
      
      // スポーツメタファー
      sports: {
        preparation: ['ウォーミングアップ', 'トレーニング', 'コンディション調整', 'メンタル強化'],
        competition: ['スタートライン', 'ペース配分', 'ラストスパート', 'ゴールイン'],
        team: ['チームプレー', 'パスワーク', 'フォーメーション', '連携'],
        improvement: ['基礎練習', 'スキルアップ', 'フォーム改善', '記録更新']
      },
      
      // 芸術メタファー
      arts: {
        creation: ['下書き', '色を重ねる', 'ハーモニー', 'コンポジション'],
        expression: ['テーマ', 'モチーフ', 'タッチ', 'トーン'],
        development: ['習作', '本番', '完成', '展示'],
        style: ['独自性', 'オリジナリティ', 'インスピレーション', 'クリエイティビティ']
      }
    };
    
    // 世代別表現スタイル
    this.generationStyles = {
      'gen_z': {      // 1997-2012年生まれ
        tone: 'casual',
        emoji: true,
        slang: true,
        digitalNative: true,
        preferredMetaphors: ['sports', 'daily', 'arts']
      },
      'millennial': { // 1981-1996年生まれ
        tone: 'friendly',
        emoji: false,
        slang: false,
        digitalNative: true,
        preferredMetaphors: ['business', 'daily', 'nature']
      },
      'gen_x': {      // 1965-1980年生まれ
        tone: 'professional',
        emoji: false,
        slang: false,
        digitalNative: false,
        preferredMetaphors: ['business', 'nature', 'sports']
      },
      'boomer': {     // 1946-1964年生まれ
        tone: 'formal',
        emoji: false,
        slang: false,
        digitalNative: false,
        preferredMetaphors: ['nature', 'daily', 'arts']
      }
    };
    
    // 職業別専門用語
    this.professionalTerms = {
      'tech': ['アルゴリズム', 'イテレーション', 'デバッグ', 'リファクタリング'],
      'medical': ['診断', '治療', '予防', '経過観察'],
      'education': ['学習', '成長', '理解', '実践'],
      'creative': ['発想', 'インスピレーション', '表現', '創造'],
      'business': ['戦略', '実行', '分析', '最適化'],
      'service': ['対応', 'サポート', '改善', '満足度']
    };
    
    // 地域特性
    this.regionalCharacteristics = {
      'tokyo': { pace: 'fast', formality: 'high', innovation: 'high' },
      'osaka': { pace: 'moderate', formality: 'moderate', humor: 'high' },
      'kyoto': { pace: 'slow', formality: 'very_high', tradition: 'high' },
      'rural': { pace: 'slow', formality: 'moderate', community: 'high' }
    };
    
    // 表現禁忌リスト（センシティブな表現を避ける）
    this.tabooExpressions = [
      '運命', '宿命', '決定的', '絶対的', '必然的'  // 決定論的表現を避ける
    ];
    
    // 使用履歴
    this.usageHistory = [];
    this.adaptationPatterns = new Map();
  }

  /**
   * 初期化処理
   */
  async initialize() {
    console.log('🌏 CulturalAdaptationEngine 初期化開始');
    
    // 追加のメタファーデータやローカライゼーションデータを読み込む
    // 将来的な拡張ポイント
    
    console.log('✅ CulturalAdaptationEngine 初期化完了');
    return true;
  }

  /**
   * 文化適応メタファー生成
   * 
   * 目的：
   * - 易経の智慧を現代的・文化的に適応させる
   * - ユーザーに最も響く表現を選択
   * 
   * 処理内容：
   * - 文化的コンテキストの分析
   * - 最適なメタファーの選択
   * - 表現スタイルの調整
   * 
   * 出力：
   * - 文化適応された表現セット
   */
  async generateCulturallyAdaptedMetaphors(hexagramMapping, userContext = {}, culturalSettings = {}) {
    console.log('🎭 文化適応メタファー生成開始');
    
    try {
      // 文化的コンテキスト分析
      const culturalContext = this.analyzeCulturalContext(userContext, culturalSettings);
      
      // 基本メタファー選択
      const baseMetaphors = this.selectBaseMetaphors(hexagramMapping, culturalContext);
      
      // 世代別調整
      const generationAdjusted = this.adjustForGeneration(baseMetaphors, culturalContext);
      
      // 職業別調整
      const professionAdjusted = this.adjustForProfession(generationAdjusted, culturalContext);
      
      // 地域別調整
      const regionalAdjusted = this.adjustForRegion(professionAdjusted, culturalContext);
      
      // 表現スタイル最適化
      const optimizedExpressions = this.optimizeExpressionStyle(regionalAdjusted, culturalContext);
      
      // タブー表現チェック
      const safeExpressions = this.filterTabooExpressions(optimizedExpressions);
      
      // 最終結果生成
      const result = {
        adaptedMetaphors: safeExpressions,
        expressionStyle: this.determineExpressionStyle(culturalContext),
        culturalNotes: this.generateCulturalNotes(culturalContext),
        confidence: this.calculateAdaptationConfidence(safeExpressions, culturalContext),
        metadata: {
          generation: culturalContext.generation,
          profession: culturalContext.profession,
          region: culturalContext.region,
          adaptationLevel: culturalContext.adaptationLevel
        }
      };
      
      // 使用履歴記録
      this.recordUsage(result);
      
      console.log('✨ 文化適応メタファー生成完了');
      return result;
      
    } catch (error) {
      console.error('🚨 文化適応エラー:', error);
      return this.generateFallbackMetaphors(hexagramMapping);
    }
  }

  /**
   * 文化的コンテキスト分析
   */
  analyzeCulturalContext(userContext, culturalSettings) {
    const context = {
      generation: this.identifyGeneration(userContext.age),
      profession: this.identifyProfession(userContext.occupation),
      region: this.identifyRegion(userContext.location),
      language: culturalSettings.language || 'ja',
      formality: culturalSettings.formality || 'moderate',
      adaptationLevel: culturalSettings.adaptationLevel || 'balanced'
    };
    
    // コンテキストの一貫性チェック
    context.consistency = this.checkContextConsistency(context);
    
    return context;
  }

  /**
   * 基本メタファー選択
   */
  selectBaseMetaphors(hexagramMapping, culturalContext) {
    const metaphors = [];
    const hexagram = hexagramMapping.primaryHexagram;
    const line = hexagramMapping.selectedLine;
    
    if (!hexagram) return metaphors;
    
    // 卦の性質に基づくメタファーカテゴリ選択
    const categories = this.determineMetaphorCategories(hexagram, culturalContext);
    
    categories.forEach(category => {
      const categoryMetaphors = this.metaphorBank[category.type];
      if (categoryMetaphors && categoryMetaphors[category.subtype]) {
        const selected = this.selectFromCategory(
          categoryMetaphors[category.subtype],
          hexagram,
          line
        );
        metaphors.push(...selected);
      }
    });
    
    return metaphors;
  }

  /**
   * 世代別調整
   */
  adjustForGeneration(metaphors, culturalContext) {
    const generation = culturalContext.generation;
    const style = this.generationStyles[generation];
    
    if (!style) return metaphors;
    
    return metaphors.map(metaphor => {
      const adjusted = { ...metaphor };
      
      // トーン調整
      if (style.tone === 'casual') {
        adjusted.expression = this.casualizeExpression(metaphor.expression);
      } else if (style.tone === 'formal') {
        adjusted.expression = this.formalizeExpression(metaphor.expression);
      }
      
      // 絵文字追加
      if (style.emoji && generation === 'gen_z') {
        adjusted.emoji = this.selectEmoji(metaphor.type);
      }
      
      // デジタルネイティブ向け調整
      if (style.digitalNative) {
        adjusted.digitalReference = this.addDigitalReference(metaphor);
      }
      
      return adjusted;
    });
  }

  /**
   * 職業別調整
   */
  adjustForProfession(metaphors, culturalContext) {
    const profession = culturalContext.profession;
    const terms = this.professionalTerms[profession];
    
    if (!terms) return metaphors;
    
    return metaphors.map(metaphor => {
      const adjusted = { ...metaphor };
      
      // 専門用語の組み込み
      if (Math.random() > 0.5) { // 50%の確率で専門用語を使用
        const term = terms[Math.floor(Math.random() * terms.length)];
        adjusted.professionalVariant = this.incorporateProfessionalTerm(
          metaphor.expression,
          term,
          profession
        );
      }
      
      return adjusted;
    });
  }

  /**
   * 地域別調整
   */
  adjustForRegion(metaphors, culturalContext) {
    const region = culturalContext.region;
    const characteristics = this.regionalCharacteristics[region];
    
    if (!characteristics) return metaphors;
    
    return metaphors.map(metaphor => {
      const adjusted = { ...metaphor };
      
      // ペース調整
      if (characteristics.pace === 'fast') {
        adjusted.expression = this.accelerateExpression(metaphor.expression);
      } else if (characteristics.pace === 'slow') {
        adjusted.expression = this.decelerateExpression(metaphor.expression);
      }
      
      // 地域特有の表現追加
      if (region === 'osaka' && characteristics.humor === 'high') {
        adjusted.humorousVariant = this.addHumor(metaphor.expression);
      }
      
      return adjusted;
    });
  }

  /**
   * 表現スタイル最適化
   */
  optimizeExpressionStyle(metaphors, culturalContext) {
    return metaphors.map(metaphor => {
      const optimized = { ...metaphor };
      
      // 文の長さ調整
      if (culturalContext.generation === 'gen_z') {
        optimized.expression = this.shortenExpression(metaphor.expression);
      }
      
      // 敬語レベル調整
      if (culturalContext.formality === 'high') {
        optimized.expression = this.addKeigo(metaphor.expression);
      }
      
      // アクセシビリティ向上
      optimized.simplified = this.simplifyExpression(metaphor.expression);
      
      return optimized;
    });
  }

  /**
   * タブー表現フィルタリング
   */
  filterTabooExpressions(expressions) {
    return expressions.map(expr => {
      let filtered = { ...expr };
      
      this.tabooExpressions.forEach(taboo => {
        if (expr.expression.includes(taboo)) {
          filtered.expression = expr.expression.replace(
            taboo,
            this.getSafeAlternative(taboo)
          );
          filtered.wasFiltered = true;
        }
      });
      
      return filtered;
    });
  }

  /**
   * 表現スタイル決定
   */
  determineExpressionStyle(culturalContext) {
    const style = {
      tone: this.determineTone(culturalContext),
      formality: this.determineFormalityLevel(culturalContext),
      complexity: this.determineComplexityLevel(culturalContext),
      metaphorDensity: this.determineMetaphorDensity(culturalContext),
      recommendations: this.generateStyleRecommendations(culturalContext)
    };
    
    return style;
  }

  /**
   * 文化的配慮事項生成
   */
  generateCulturalNotes(culturalContext) {
    const notes = [];
    
    // 世代別配慮
    if (culturalContext.generation === 'gen_z') {
      notes.push('デジタルネイティブ向けの表現を使用');
    } else if (culturalContext.generation === 'boomer') {
      notes.push('伝統的な価値観を尊重した表現を使用');
    }
    
    // 職業別配慮
    if (culturalContext.profession === 'medical') {
      notes.push('医療倫理に配慮した慎重な表現を使用');
    }
    
    // 地域別配慮
    if (culturalContext.region === 'kyoto') {
      notes.push('京都特有の婉曲表現を考慮');
    }
    
    return notes;
  }

  /**
   * 適応信頼度計算
   */
  calculateAdaptationConfidence(expressions, culturalContext) {
    let confidence = 0.7; // 基準値
    
    // コンテキストの完全性
    if (culturalContext.generation && culturalContext.profession) {
      confidence += 0.1;
    }
    
    // 表現の多様性
    if (expressions.length > 5) {
      confidence += 0.1;
    }
    
    // フィルタリングの有無
    const filtered = expressions.filter(e => e.wasFiltered).length;
    if (filtered === 0) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }

  // ============ ヘルパーメソッド ============

  /**
   * 世代識別
   */
  identifyGeneration(age) {
    if (!age) return 'millennial'; // デフォルト
    
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    
    if (birthYear >= 1997 && birthYear <= 2012) return 'gen_z';
    if (birthYear >= 1981 && birthYear <= 1996) return 'millennial';
    if (birthYear >= 1965 && birthYear <= 1980) return 'gen_x';
    if (birthYear >= 1946 && birthYear <= 1964) return 'boomer';
    
    return 'millennial'; // デフォルト
  }

  /**
   * 職業識別
   */
  identifyProfession(occupation) {
    if (!occupation) return 'business'; // デフォルト
    
    const occupationLower = occupation.toLowerCase();
    
    if (occupationLower.includes('エンジニア') || occupationLower.includes('プログラマ')) {
      return 'tech';
    }
    if (occupationLower.includes('医') || occupationLower.includes('看護')) {
      return 'medical';
    }
    if (occupationLower.includes('教') || occupationLower.includes('先生')) {
      return 'education';
    }
    if (occupationLower.includes('デザイン') || occupationLower.includes('アート')) {
      return 'creative';
    }
    if (occupationLower.includes('営業') || occupationLower.includes('販売')) {
      return 'service';
    }
    
    return 'business';
  }

  /**
   * 地域識別
   */
  identifyRegion(location) {
    if (!location) return 'tokyo'; // デフォルト
    
    const locationLower = location.toLowerCase();
    
    if (locationLower.includes('東京') || locationLower.includes('tokyo')) {
      return 'tokyo';
    }
    if (locationLower.includes('大阪') || locationLower.includes('osaka')) {
      return 'osaka';
    }
    if (locationLower.includes('京都') || locationLower.includes('kyoto')) {
      return 'kyoto';
    }
    
    // 大都市以外は rural として扱う
    return 'rural';
  }

  /**
   * メタファーカテゴリ決定
   */
  determineMetaphorCategories(hexagram, culturalContext) {
    const categories = [];
    
    // 卦の性質に基づく基本カテゴリ
    if (hexagram.nature === 'creative' || hexagram.innovation_score > 70) {
      categories.push({ type: 'business', subtype: 'strategy' });
      categories.push({ type: 'arts', subtype: 'creation' });
    }
    
    if (hexagram.stability_score > 70) {
      categories.push({ type: 'nature', subtype: 'seasons' });
      categories.push({ type: 'daily', subtype: 'building' });
    }
    
    // 文化的コンテキストによる追加カテゴリ
    const genStyle = this.generationStyles[culturalContext.generation];
    if (genStyle && genStyle.preferredMetaphors) {
      genStyle.preferredMetaphors.forEach(pref => {
        if (!categories.find(c => c.type === pref)) {
          categories.push({ type: pref, subtype: Object.keys(this.metaphorBank[pref])[0] });
        }
      });
    }
    
    return categories;
  }

  /**
   * カテゴリからの選択
   */
  selectFromCategory(categoryMetaphors, hexagram, line) {
    const selected = [];
    
    // 各メタファーを評価
    categoryMetaphors.forEach(metaphor => {
      const relevance = this.calculateMetaphorRelevance(metaphor, hexagram, line);
      if (relevance > 0.6) {
        selected.push({
          expression: metaphor,
          type: 'nature', // カテゴリタイプを保持
          relevance: relevance,
          hexagramAlignment: hexagram.name_jp
        });
      }
    });
    
    // 関連性順でソート
    selected.sort((a, b) => b.relevance - a.relevance);
    
    return selected.slice(0, 3); // 上位3つを返す
  }

  /**
   * メタファー関連性計算
   */
  calculateMetaphorRelevance(metaphor, hexagram, line) {
    // 簡易的な関連性計算
    let relevance = 0.5;
    
    // キーワードマッチング
    if (hexagram.keywords) {
      hexagram.keywords.forEach(keyword => {
        if (metaphor.includes(keyword)) {
          relevance += 0.1;
        }
      });
    }
    
    // 爻との適合性
    if (line && line.キーワード) {
      line.キーワード.forEach(keyword => {
        if (metaphor.includes(keyword)) {
          relevance += 0.1;
        }
      });
    }
    
    return Math.min(relevance, 1.0);
  }

  /**
   * カジュアル化
   */
  casualizeExpression(expression) {
    // です・ます調をカジュアルに
    let casual = expression
      .replace(/です。/g, 'だよ。')
      .replace(/ます。/g, 'るよ。')
      .replace(/でしょう。/g, 'かもね。');
    
    return casual;
  }

  /**
   * フォーマル化
   */
  formalizeExpression(expression) {
    // カジュアル表現をフォーマルに
    let formal = expression
      .replace(/だよ。/g, 'です。')
      .replace(/るよ。/g, 'ます。')
      .replace(/かもね。/g, 'でしょう。');
    
    return formal;
  }

  /**
   * 絵文字選択
   */
  selectEmoji(type) {
    const emojiMap = {
      nature: '🌱',
      business: '📈',
      daily: '🏠',
      sports: '🏃',
      arts: '🎨'
    };
    
    return emojiMap[type] || '✨';
  }

  /**
   * デジタルリファレンス追加
   */
  addDigitalReference(metaphor) {
    const digitalRefs = {
      '成長': 'レベルアップ',
      '準備': 'ローディング',
      '完成': 'リリース',
      '改善': 'アップデート'
    };
    
    for (const [key, value] of Object.entries(digitalRefs)) {
      if (metaphor.expression.includes(key)) {
        return `${metaphor.expression}（${value}のように）`;
      }
    }
    
    return metaphor.expression;
  }

  /**
   * 専門用語組み込み
   */
  incorporateProfessionalTerm(expression, term, profession) {
    if (profession === 'tech') {
      return `${expression}（${term}のプロセスのように）`;
    } else if (profession === 'medical') {
      return `${expression}（${term}のアプローチで）`;
    }
    
    return `${expression}（${term}の観点から）`;
  }

  /**
   * 表現短縮
   */
  shortenExpression(expression) {
    // 長い表現を短くする
    if (expression.length > 20) {
      const parts = expression.split('、');
      return parts[0] + '。';
    }
    return expression;
  }

  /**
   * 敬語追加
   */
  addKeigo(expression) {
    return expression
      .replace(/する/g, 'いたします')
      .replace(/ある/g, 'ございます')
      .replace(/思う/g, '存じます');
  }

  /**
   * 表現簡略化
   */
  simplifyExpression(expression) {
    // 難しい漢字をひらがなに
    return expression
      .replace(/蓄積/g, 'たくわえ')
      .replace(/構築/g, 'つくり')
      .replace(/展開/g, 'ひろがり');
  }

  /**
   * 安全な代替表現取得
   */
  getSafeAlternative(taboo) {
    const alternatives = {
      '運命': '可能性',
      '宿命': '傾向',
      '決定的': '重要な',
      '絶対的': '強い',
      '必然的': '自然な'
    };
    
    return alternatives[taboo] || '傾向';
  }

  /**
   * 使用履歴記録
   */
  recordUsage(result) {
    this.usageHistory.push({
      timestamp: Date.now(),
      generation: result.metadata.generation,
      profession: result.metadata.profession,
      metaphorCount: result.adaptedMetaphors.length,
      confidence: result.confidence
    });
    
    // 履歴制限
    if (this.usageHistory.length > 100) {
      this.usageHistory.shift();
    }
  }

  /**
   * フォールバックメタファー生成
   */
  generateFallbackMetaphors(hexagramMapping) {
    console.warn('文化適応フォールバック使用');
    
    return {
      adaptedMetaphors: [
        {
          expression: '新しい段階への移行期です',
          type: 'general',
          relevance: 0.5
        },
        {
          expression: '慎重な判断が求められます',
          type: 'general',
          relevance: 0.5
        }
      ],
      expressionStyle: {
        tone: 'neutral',
        formality: 'moderate',
        complexity: 'simple'
      },
      culturalNotes: ['標準的な表現を使用'],
      confidence: 0.4
    };
  }

  /**
   * コンテキスト一貫性チェック
   */
  checkContextConsistency(context) {
    // 世代と職業の組み合わせの妥当性チェックなど
    return 0.8; // 簡易実装
  }

  /**
   * 各種レベル決定メソッド（簡易実装）
   */
  determineTone(context) { return context.generation === 'gen_z' ? 'casual' : 'moderate'; }
  determineFormalityLevel(context) { return context.formality || 'moderate'; }
  determineComplexityLevel(context) { return context.generation === 'gen_z' ? 'simple' : 'moderate'; }
  determineMetaphorDensity(context) { return 'balanced'; }
  generateStyleRecommendations(context) { return ['自然な表現を心がける', '押し付けがましくない提案']; }
  accelerateExpression(expr) { return expr.replace('ゆっくり', '素早く'); }
  decelerateExpression(expr) { return expr.replace('素早く', 'じっくり'); }
  addHumor(expr) { return expr + '（笑）'; }
}

// グローバル利用のためのエクスポート
window.CulturalAdaptationEngine = CulturalAdaptationEngine;