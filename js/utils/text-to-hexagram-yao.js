/**
 * Text to Hexagram + Yao (爻) Analyzer
 * テキストから状況の卦と爻位置を判定
 * 
 * CLAUDE.md準拠：指示されたことだけを実装
 */

window.TextToHexagramYao = {
  
  /**
   * テキストから卦と爻を判定
   * @param {string} text - ユーザー入力テキスト
   * @returns {object} { hexagramId: 番号, yaoPosition: 1-6 }
   */
  analyze(text) {
    // 1. 基本的な卦の判定
    const hexagramId = this.determineHexagram(text);
    
    // 2. 爻位置の判定（1-6）
    const yaoPosition = this.determineYaoPosition(text);
    
    return {
      hexagramId: hexagramId,
      yaoPosition: yaoPosition,
      description: this.getDescription(hexagramId, yaoPosition)
    };
  },
  
  /**
   * テキストから卦を判定
   */
  determineHexagram(text) {
    // テキストの特徴から64卦のいずれかを選択
    let score = {};
    
    // 感情・状況パターンによる卦の判定
    if (/始まり|スタート|新しい/.test(text)) {
      score[3] = (score[3] || 0) + 10; // 水雷屯 - 始まりの困難
    }
    if (/困難|苦労|大変/.test(text)) {
      score[47] = (score[47] || 0) + 8; // 沢水困 - 困窮
      score[39] = (score[39] || 0) + 8; // 水山蹇 - 困難
    }
    if (/待つ|待機|タイミング/.test(text)) {
      score[5] = (score[5] || 0) + 10; // 水天需 - 待機
    }
    if (/争い|対立|喧嘩/.test(text)) {
      score[6] = (score[6] || 0) + 10; // 天水訟 - 訴訟
    }
    if (/協力|チーム|仲間/.test(text)) {
      score[8] = (score[8] || 0) + 10; // 水地比 - 親密
    }
    if (/成長|発展|上昇/.test(text)) {
      score[46] = (score[46] || 0) + 10; // 地風升 - 上昇
    }
    if (/変化|変革|改革/.test(text)) {
      score[49] = (score[49] || 0) + 10; // 沢火革 - 改革
    }
    if (/完成|達成|成功/.test(text)) {
      score[63] = (score[63] || 0) + 10; // 水火既済 - 完成
    }
    if (/未完成|途中|継続/.test(text)) {
      score[64] = (score[64] || 0) + 10; // 火水未済 - 未完成
    }
    
    // 感情分析による追加スコア
    if (/不安|心配|怖/.test(text)) {
      score[29] = (score[29] || 0) + 5; // 坎為水 - 困難・危険
    }
    if (/喜び|嬉しい|楽しい/.test(text)) {
      score[58] = (score[58] || 0) + 5; // 兌為沢 - 喜び
    }
    if (/怒り|イライラ|むかつく/.test(text)) {
      score[51] = (score[51] || 0) + 5; // 震為雷 - 衝撃
    }
    if (/静か|落ち着|平穏/.test(text)) {
      score[52] = (score[52] || 0) + 5; // 艮為山 - 静止
    }
    
    // 最高スコアの卦を選択（デフォルトは1:乾為天）
    const hexagramId = Object.keys(score).length > 0
      ? parseInt(Object.entries(score).sort(([,a], [,b]) => b - a)[0][0])
      : 1;
    
    return hexagramId;
  },
  
  /**
   * テキストから爻位置を判定（1-6）
   */
  determineYaoPosition(text) {
    // 爻位置判定のロジック
    let yaoScore = {
      1: 0, // 初爻：始まり、基礎
      2: 0, // 二爻：内面、準備
      3: 0, // 三爻：困難、転換点
      4: 0, // 四爻：外部との接触
      5: 0, // 五爻：中心、リーダー
      6: 0  // 上爻：極限、終わり
    };
    
    // 時間的位置による判定
    if (/始め|初め|最初|スタート/.test(text)) {
      yaoScore[1] += 10;
    }
    if (/準備|計画|内部|自分/.test(text)) {
      yaoScore[2] += 8;
    }
    if (/困難|苦労|転換|岐路/.test(text)) {
      yaoScore[3] += 10;
    }
    if (/他人|外部|社会|関係/.test(text)) {
      yaoScore[4] += 8;
    }
    if (/中心|リーダー|責任|決断/.test(text)) {
      yaoScore[5] += 10;
    }
    if (/終わり|極限|完了|限界/.test(text)) {
      yaoScore[6] += 10;
    }
    
    // 発展段階による判定
    if (/初心者|新人|未経験/.test(text)) {
      yaoScore[1] += 5;
      yaoScore[2] += 3;
    }
    if (/中堅|経験者|実務/.test(text)) {
      yaoScore[3] += 3;
      yaoScore[4] += 5;
    }
    if (/ベテラン|専門家|指導/.test(text)) {
      yaoScore[5] += 5;
      yaoScore[6] += 3;
    }
    
    // 緊急度による判定
    if (/緊急|今すぐ|至急/.test(text)) {
      yaoScore[3] += 3; // 危機的状況
      yaoScore[4] += 2; // 外部対応必要
    }
    if (/ゆっくり|じっくり|長期/.test(text)) {
      yaoScore[2] += 3; // 準備段階
      yaoScore[5] += 2; // 安定期
    }
    
    // 感情の強度による微調整
    const emotionalIntensity = this.calculateEmotionalIntensity(text);
    if (emotionalIntensity > 0.7) {
      yaoScore[3] += 2; // 感情的に不安定
      yaoScore[6] += 1; // 極端な状態
    } else if (emotionalIntensity < 0.3) {
      yaoScore[2] += 2; // 内省的
      yaoScore[5] += 1; // 安定的
    }
    
    // 最高スコアの爻位置を選択
    const yaoPosition = parseInt(
      Object.entries(yaoScore)
        .sort(([,a], [,b]) => b - a)[0][0]
    );
    
    return yaoPosition;
  },
  
  /**
   * 感情強度を計算（0-1）
   */
  calculateEmotionalIntensity(text) {
    let intensity = 0;
    
    // 強い感情表現
    const strongEmotions = /！！|。。。|www|超|めっちゃ|すごく|とても|非常に/g;
    const matches = text.match(strongEmotions);
    if (matches) {
      intensity += matches.length * 0.15;
    }
    
    // 感情語彙
    if (/大好き|大嫌い|最高|最悪/.test(text)) intensity += 0.3;
    if (/好き|嫌い|良い|悪い/.test(text)) intensity += 0.15;
    
    // 疑問・不安
    if (/どうしよう|どうすれば|なぜ/.test(text)) intensity += 0.2;
    
    return Math.min(intensity, 1.0);
  },
  
  /**
   * 卦と爻の説明を生成
   */
  getDescription(hexagramId, yaoPosition) {
    const yaoMeanings = {
      1: "初爻：物事の始まり、基礎を築く時期",
      2: "二爻：内なる充実、準備と蓄積の時期",
      3: "三爻：困難と転機、重要な岐路に立つ時期",
      4: "四爻：外界との接触、社会的活動の時期",
      5: "五爻：中心的立場、リーダーシップを発揮する時期",
      6: "上爻：物事の極限、終結と新たな始まりの時期"
    };
    
    return {
      hexagram: `卦${hexagramId}`,
      yao: yaoMeanings[yaoPosition],
      position: `第${yaoPosition}爻`,
      stage: this.getStageDescription(yaoPosition)
    };
  },
  
  /**
   * 爻位置による段階説明
   */
  getStageDescription(yaoPosition) {
    const stages = {
      1: "潜龍（潜んでいる龍）- まだ時期尚早",
      2: "見龍（現れる龍）- 準備が整い始める",
      3: "君子終日乾乾（終日努力）- 努力と警戒が必要",
      4: "或躍在淵（淵で躍る）- 進退を考慮すべき時",
      5: "飛龍在天（天を飛ぶ龍）- 最良の時期",
      6: "亢龍有悔（高ぶる龍）- 行き過ぎに注意"
    };
    
    return stages[yaoPosition];
  }
};

// 初期化
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ TextToHexagramYao loaded - 卦と爻の判定システム');
  });
}