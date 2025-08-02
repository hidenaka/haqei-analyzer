/**
 * ユーザーテストシミュレーター
 * 
 * 目的：
 * - 100人分の多様な悩みテキストを生成
 * - 状況分析システムでの分析結果を収集
 * - 統計データの生成
 */

class UserTestSimulator {
  /**
   * コンストラクタ
   * 
   * 目的：
   * - テストケースの初期化
   * - カテゴリ別の悩みパターン定義
   * 
   * 処理内容：
   * 1. 悩みカテゴリの定義
   * 2. 各カテゴリのテンプレート作成
   * 3. 分析器の初期化
   */
  constructor() {
    // 悩みカテゴリと件数
    this.categories = {
      work_career: { name: '仕事・キャリア', count: 20 },
      relationships: { name: '人間関係', count: 20 },
      love_marriage: { name: '恋愛・結婚', count: 15 },
      health_mental: { name: '健康・メンタル', count: 15 },
      financial: { name: '金銭・経済', count: 10 },
      family_parenting: { name: '家族・子育て', count: 10 },
      learning_growth: { name: '学習・成長', count: 10 }
    };
    
    // 分析結果を格納
    this.results = [];
    
    // 分析器（実際の分析はシミュレーション）
    this.analyzer = null;
  }
  
  /**
   * 悩みテキストの生成
   * 
   * 目的：
   * - カテゴリに応じた現実的な悩みテキストを生成
   * 
   * 入力：
   * @param {string} category - 悩みカテゴリ
   * @param {number} index - インデックス番号
   * 
   * 処理内容：
   * 1. カテゴリ別のテンプレート選択
   * 2. バリエーション要素の追加
   * 3. 自然な文章生成
   * 
   * 出力：
   * @returns {string} 生成された悩みテキスト
   */
  generateWorryText(category, index) {
    const templates = {
      work_career: [
        `転職を考えています。今の会社で${5 + index}年働いていますが、成長を感じられません。新しい挑戦をしたいけど、安定を失うのが怖いです。`,
        `昇進の話がきました。責任は重くなりますが、やりがいもあります。ただ、${30 + index}歳で管理職は早すぎる気もして迷っています。`,
        `フリーランスになって${index % 3 + 1}年。収入は不安定ですが、自由な働き方に満足しています。でも将来が不安になることもあります。`,
        `AI技術の進歩で、自分の仕事がなくなるのではと不安です。新しいスキルを学ぶべきか、今の専門性を深めるべきか悩んでいます。`,
        `会社の業績が悪化し、リストラの噂があります。転職活動を始めるべきか、会社の回復を待つべきか判断に迷います。`
      ],
      relationships: [
        `職場の人間関係で悩んでいます。${index % 2 === 0 ? '上司' : '同僚'}との関係がぎくしゃくして、毎日が辛いです。`,
        `親友と${index % 5 + 1}年ぶりに喧嘩しました。些細なことが原因でしたが、お互い意地を張って連絡が取れません。`,
        `新しい環境で友達ができません。${20 + index}歳になって新しい友人を作るのは難しく感じます。`,
        `SNSでの人間関係に疲れました。リアルな付き合いとのバランスが取れず、どう距離を置けばいいか分かりません。`,
        `グループ内での立ち位置に悩んでいます。みんなと仲良くしたいけど、八方美人と思われるのも嫌です。`
      ],
      love_marriage: [
        `${index % 5 + 3}年付き合っている恋人がいますが、結婚の話が進みません。このまま待つべきか、別れを考えるべきか悩んでいます。`,
        `結婚${index % 10 + 1}年目。パートナーとの価値観の違いを感じることが増えました。子供のことを考えると離婚は避けたいです。`,
        `${25 + index}歳、恋人がいません。周りは次々と結婚していき、焦りを感じます。でも妥協はしたくありません。`,
        `遠距離恋愛を${index % 3 + 1}年続けています。お互い仕事があり、会える回数が減っています。このまま続けるべきでしょうか。`,
        `離婚を考えています。性格の不一致が原因ですが、経済的な不安もあり、決断できずにいます。`
      ],
      health_mental: [
        `最近、不眠が続いています。仕事のストレスが原因だと思いますが、${index % 4 + 2}ヶ月改善しません。`,
        `体重が${index % 10 + 5}kg増えました。ダイエットを始めても続かず、自己嫌悪に陥っています。`,
        `パニック障害と診断されて${index % 3 + 1}年。薬で症状は抑えられていますが、完治するか不安です。`,
        `慢性的な疲労感があります。病院では異常なしと言われましたが、毎日体がだるくて辛いです。`,
        `うつ病で休職中です。${index % 6 + 1}ヶ月経ちましたが、復職への不安が大きく、前に進めません。`
      ],
      financial: [
        `貯金が${index * 10}万円しかありません。${30 + index % 10}歳でこの額は少なすぎると感じ、将来が不安です。`,
        `投資で${index % 50 + 10}万円の損失を出しました。取り返そうとして、さらに損失が膨らんでいます。`,
        `借金が${index % 100 + 50}万円あります。返済は進んでいますが、生活が苦しく、心が折れそうです。`,
        `収入が月${15 + index % 10}万円。一人暮らしでギリギリの生活です。転職すべきか悩んでいます。`,
        `親の介護費用が重くのしかかっています。自分の老後資金も貯められず、不安ばかりが募ります。`
      ],
      family_parenting: [
        `${index % 5 + 1}歳の子供が言うことを聞きません。叱りすぎかもしれませんが、どう接すればいいか分かりません。`,
        `不妊治療を${index % 3 + 2}年続けています。精神的にも経済的にも限界を感じ始めています。`,
        `実家の親との関係で悩んでいます。過干渉で、${30 + index}歳になっても子供扱いされます。`,
        `義理の両親との同居がストレスです。価値観の違いが大きく、毎日が戦いのようです。`,
        `子供の進路で夫婦の意見が対立しています。教育方針の違いが表面化し、関係がギクシャクしています。`
      ],
      learning_growth: [
        `${25 + index}歳から新しい分野の勉強を始めました。周りは若い人ばかりで、ついていけるか不安です。`,
        `資格試験に${index % 3 + 1}回落ちました。才能がないのかもしれないと、自信を失っています。`,
        `プログラミングを独学で${index % 12 + 1}ヶ月勉強していますが、上達を感じられません。`,
        `英語学習が続きません。必要性は感じているのに、モチベーションが維持できないんです。`,
        `自己啓発セミナーに通い始めましたが、本当に効果があるのか疑問を感じ始めています。`
      ]
    };
    
    const categoryTemplates = templates[category];
    const template = categoryTemplates[index % categoryTemplates.length];
    
    // バリエーションを追加
    const variations = [
      '友人には相談しづらく、一人で抱え込んでいます。',
      '家族は心配してくれますが、本当の気持ちは言えません。',
      'このままでいいのか、毎日自問自答しています。',
      '決断しなければいけないのは分かっていますが、勇気が出ません。',
      '誰かに背中を押してもらいたい気持ちです。'
    ];
    
    const variation = variations[Math.floor(Math.random() * variations.length)];
    
    return `${template} ${variation}`;
  }
  
  /**
   * 分析結果のシミュレーション
   * 
   * 目的：
   * - 悩みテキストから予想される分析結果を生成
   * 
   * 入力：
   * @param {string} text - 悩みテキスト
   * @param {string} category - カテゴリ
   * 
   * 処理内容：
   * 1. テキストの特徴抽出
   * 2. アーキタイプ判定
   * 3. 適切な卦の選択
   * 
   * 出力：
   * @returns {Object} シミュレートされた分析結果
   */
  simulateAnalysis(text, category) {
    // テキストから特徴を抽出
    const features = {
      hasConflict: text.includes('迷') || text.includes('悩') || text.includes('不安'),
      hasChange: text.includes('転職') || text.includes('離婚') || text.includes('新し'),
      hasGrowth: text.includes('成長') || text.includes('学') || text.includes('挑戦'),
      hasStagnation: text.includes('続か') || text.includes('限界') || text.includes('疲れ')
    };
    
    // アーキタイプ判定
    let archetype = 'development'; // デフォルト
    if (features.hasChange && features.hasConflict) {
      archetype = 'transformation';
    } else if (features.hasGrowth && !features.hasStagnation) {
      archetype = 'creation';
    } else if (features.hasStagnation) {
      archetype = 'maturity';
    }
    
    // カテゴリとアーキタイプから適切な卦を選択
    const hexagramMapping = {
      work_career: {
        creation: [3, 4, 16, 42], // 屯、蒙、豫、益
        development: [5, 9, 26, 46], // 需、小畜、大畜、升
        transformation: [49, 50, 18, 33], // 革、鼎、蠱、遯
        maturity: [63, 64, 23, 12] // 既済、未済、剥、否
      },
      relationships: {
        creation: [8, 13, 31, 37], // 比、同人、咸、家人
        development: [11, 19, 20, 58], // 泰、臨、観、兌
        transformation: [38, 6, 47, 39], // 睽、訟、困、蹇
        maturity: [41, 60, 61, 15] // 損、節、中孚、謙
      },
      love_marriage: {
        creation: [31, 32, 44, 1], // 咸、恒、姤、乾
        development: [11, 37, 53, 54], // 泰、家人、漸、帰妹
        transformation: [38, 6, 21, 43], // 睽、訟、噬嗑、夬
        maturity: [41, 28, 47, 2] // 損、大過、困、坤
      },
      health_mental: {
        creation: [27, 24, 25, 51], // 頤、復、无妄、震
        development: [48, 57, 30, 22], // 井、巽、離、賁
        transformation: [29, 39, 47, 18], // 坎、蹇、困、蠱
        maturity: [52, 15, 36, 2] // 艮、謙、明夷、坤
      },
      financial: {
        creation: [14, 1, 34, 43], // 大有、乾、大壮、夬
        development: [5, 9, 11, 42], // 需、小畜、泰、益
        transformation: [49, 21, 35, 10], // 革、噬嗑、晋、履
        maturity: [41, 60, 48, 2] // 損、節、井、坤
      },
      family_parenting: {
        creation: [37, 8, 19, 61], // 家人、比、臨、中孚
        development: [11, 15, 42, 53], // 泰、謙、益、漸
        transformation: [18, 38, 6, 17], // 蠱、睽、訟、随
        maturity: [41, 23, 4, 52] // 損、剥、蒙、艮
      },
      learning_growth: {
        creation: [3, 4, 24, 42], // 屯、蒙、復、益
        development: [46, 53, 57, 48], // 升、漸、巽、井
        transformation: [49, 50, 18, 17], // 革、鼎、蠱、随
        maturity: [63, 64, 22, 52] // 既済、未済、賁、艮
      }
    };
    
    // 適切な卦を選択
    const possibleHexagrams = hexagramMapping[category][archetype];
    const selectedHexagram = possibleHexagrams[Math.floor(Math.random() * possibleHexagrams.length)];
    
    // 信頼度スコア（0.6-0.9の範囲でランダム）
    const confidence = 0.6 + Math.random() * 0.3;
    
    return {
      archetype: archetype,
      hexagram: selectedHexagram,
      confidence: confidence,
      features: features
    };
  }
  
  /**
   * 100人分のテストを実行
   * 
   * 目的：
   * - 全カテゴリで100人分の悩みを生成し分析
   * 
   * 処理内容：
   * 1. カテゴリごとに指定件数の悩みを生成
   * 2. 各悩みを分析
   * 3. 結果を収集
   * 
   * 出力：
   * @returns {Array} 100件の分析結果
   */
  runFullTest() {
    let userId = 1;
    
    Object.entries(this.categories).forEach(([categoryKey, categoryInfo]) => {
      for (let i = 0; i < categoryInfo.count; i++) {
        const worryText = this.generateWorryText(categoryKey, i);
        const analysis = this.simulateAnalysis(worryText, categoryKey);
        
        this.results.push({
          userId: userId++,
          category: categoryInfo.name,
          categoryKey: categoryKey,
          worryText: worryText,
          analysis: analysis,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    return this.results;
  }
  
  /**
   * 統計情報の生成
   * 
   * 目的：
   * - テスト結果から統計情報を抽出
   * 
   * 処理内容：
   * 1. カテゴリ別集計
   * 2. アーキタイプ分布
   * 3. 卦の頻度分析
   * 
   * 出力：
   * @returns {Object} 統計情報
   */
  generateStatistics() {
    const stats = {
      total: this.results.length,
      byCategory: {},
      byArchetype: {
        creation: 0,
        development: 0,
        transformation: 0,
        maturity: 0
      },
      hexagramFrequency: {},
      averageConfidence: 0
    };
    
    // カテゴリ別集計の初期化
    Object.values(this.categories).forEach(cat => {
      stats.byCategory[cat.name] = {
        count: 0,
        archetypes: {
          creation: 0,
          development: 0,
          transformation: 0,
          maturity: 0
        },
        averageConfidence: 0
      };
    });
    
    // 集計処理
    let totalConfidence = 0;
    
    this.results.forEach(result => {
      // カテゴリ別
      const catStats = stats.byCategory[result.category];
      catStats.count++;
      catStats.archetypes[result.analysis.archetype]++;
      catStats.averageConfidence += result.analysis.confidence;
      
      // 全体のアーキタイプ
      stats.byArchetype[result.analysis.archetype]++;
      
      // 卦の頻度
      const hex = result.analysis.hexagram;
      stats.hexagramFrequency[hex] = (stats.hexagramFrequency[hex] || 0) + 1;
      
      // 信頼度
      totalConfidence += result.analysis.confidence;
    });
    
    // 平均値計算
    stats.averageConfidence = totalConfidence / stats.total;
    
    Object.entries(stats.byCategory).forEach(([cat, data]) => {
      data.averageConfidence = data.averageConfidence / data.count;
    });
    
    // 最頻出の卦トップ10
    stats.topHexagrams = Object.entries(stats.hexagramFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([hex, count]) => ({
        hexagram: parseInt(hex),
        count: count,
        percentage: (count / stats.total * 100).toFixed(1)
      }));
    
    return stats;
  }
}

// エクスポート
if (typeof window !== 'undefined') {
  window.UserTestSimulator = UserTestSimulator;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = UserTestSimulator;
}