// iching_relationships.js - 易経的対立・補完関係の定義
// 易経専門家による正統な八卦相互関係の実装

/**
 * 易経の正統な対立関係（先天八卦・後天八卦に基づく）
 * 天地、水火、雷山、風沢の四対立
 */
const OPPOSING_RELATIONSHIPS = {
  "乾_創造性": "坤_受容性", // 天地・創造⇔受容・父母・純陽純陰
  "坤_受容性": "乾_創造性", 
  "震_行動性": "艮_安定性", // 雷山・動⇔静・長男⇔少男
  "艮_安定性": "震_行動性",
  "坎_探求性": "離_表現性", // 水火・内⇔外・中男⇔中女  
  "離_表現性": "坎_探求性",
  "巽_適応性": "兌_調和性", // 風沢・順⇔悦・長女⇔少女
  "兌_調和性": "巽_適応性"
};

/**
 * 易経の補完関係
 * 五行相生循環と陰陽調和に基づく
 */
const COMPLEMENTARY_RELATIONSHIPS = {
  // 五行相生循環（金→水→木→火→土→金）
  creation_cycle: [
    "乾_創造性", // 金
    "坎_探求性", // 水
    "震_行動性", // 木
    "離_表現性", // 火
    "坤_受容性", // 土
    "艮_安定性", // 土（蓄積）
    "兌_調和性", // 金（精錬）
    "巽_適応性"  // 木（循環）
  ],
  
  // 陰陽調和関係
  yin_yang_harmony: {
    "乾_創造性": "巽_適応性", // 剛健⇔柔順
    "巽_適応性": "乾_創造性",
    "坤_受容性": "震_行動性", // 順従⇔発動  
    "震_行動性": "坤_受容性",
    "坎_探求性": "離_表現性", // 陷⇔麗（内在と外在）
    "離_表現性": "坎_探求性",
    "艮_安定性": "兌_調和性", // 止⇔説（静止と活動）
    "兌_調和性": "艮_安定性"
  },

  // 序卦伝に基づく連続関係
  sequential_flow: {
    "乾_創造性": ["坎_探求性", "震_行動性"], // 創造→探求→行動
    "坎_探求性": ["艮_安定性", "巽_適応性"], // 探求→安定→適応
    "震_行動性": ["離_表現性", "坤_受容性"], // 行動→表現→受容
    "離_表現性": ["坤_受容性", "兌_調和性"], // 表現→受容→調和
    "坤_受容性": ["艮_安定性", "兌_調和性"], // 受容→安定→調和
    "艮_安定性": ["兌_調和性", "乾_創造性"], // 安定→調和→創造
    "兌_調和性": ["乾_創造性", "巽_適応性"], // 調和→創造→適応
    "巽_適応性": ["乾_創造性", "坎_探求性"]  // 適応→創造→探求
  }
};

/**
 * 易経の正統な状況卦定義
 * 64卦の象意に基づくシナリオ対応
 */
const SITUATIONAL_HEXAGRAMS = {
  q25: { 
    name: "沢水困", 
    number: 47, 
    meaning: "プレッシャー・困難", 
    象意: "沢が水の下にあり、水が枯渇する困難な状況",
    爻辞_relevance: "困窮の中での対処方法" 
  },
  q26: { 
    name: "風天小畜", 
    number: 9, 
    meaning: "裏切り・信頼の亀裂", 
    象意: "風が天を制止する、小さな力で大きな流れを阻む",
    爻辞_relevance: "微細な変化への対応" 
  },
  q27: { 
    name: "火山旅", 
    number: 56, 
    meaning: "家族との対立・離散", 
    象意: "山の上の火、一時的で不安定な状況",
    爻辞_relevance: "離散状況での行動指針" 
  },
  q28: { 
    name: "水雷屯", 
    number: 3, 
    meaning: "緊急事態・始動困難", 
    象意: "雷が水中にあり、動きが困難な状況",
    爻辞_relevance: "初動期の混乱への対処" 
  },
  q29: { 
    name: "地水師", 
    number: 7, 
    meaning: "競争・争い", 
    象意: "地の下に水あり、統率と戦略が必要",
    爻辞_relevance: "競争状況での戦略的思考" 
  },
  q30: { 
    name: "水風井", 
    number: 48, 
    meaning: "義理と人情・共同体恩恵", 
    象意: "風が水を汲み上げる、相互扶助の象徴",
    爻辞_relevance: "道徳的判断での共同体配慮" 
  }
};

/**
 * 爻辞レベル定義（6段階）
 * 易経の爻の位置に基づく行動・判断レベル
 */
const KOUI_LEVELS = {
  1: { name: "初爻", meaning: "始まり・基礎段階", character: "慎重さと準備" },
  2: { name: "二爻", meaning: "発展・協力段階", character: "他者との連携" },
  3: { name: "三爻", meaning: "転換・危険段階", character: "注意深い判断" },
  4: { name: "四爻", meaning: "進展・責任段階", character: "リーダーシップ" },
  5: { name: "五爻", meaning: "成熟・統率段階", character: "高い徳性と決断力" },
  6: { name: "上爻", meaning: "完成・変化段階", character: "謙虚さと次への準備" }
};

/**
 * 対立・補完効果の計算関数
 */
function calculateOpposingEffect(baseScore, targetDimension, intensity = 1.0) {
  // 対立関係の場合、相手の次元を減少させる
  return baseScore * -0.3 * intensity;
}

function calculateComplementaryEffect(baseScore, targetDimension, type = "harmony") {
  // 補完関係の場合、相手の次元を増加させる
  const multiplier = type === "harmony" ? 0.2 : 0.15;
  return baseScore * multiplier;
}

/**
 * 状況卦による修正係数の取得
 */
function getSituationalModifier(hexagramName, dimension) {
  // 状況卦に基づく各次元への修正係数
  const modifiers = {
    "沢水困": {
      "震_行動性": 1.2, // 困難時の行動力重視
      "艮_安定性": 1.3, // 安定性への希求
      "兌_調和性": 0.8  // 調和より生存重視
    },
    "風天小畜": {
      "坎_探求性": 1.2, // 真相究明の重要性
      "兌_調和性": 0.7, // 関係性の不安定
      "巽_適応性": 1.1  // 状況への適応
    },
    "火山旅": {
      "離_表現性": 1.1, // 自己主張の必要性
      "坤_受容性": 0.8, // 受容の困難
      "震_行動性": 1.2  // 積極的行動の必要
    },
    "水雷屯": {
      "震_行動性": 1.3, // 緊急時の行動力
      "坎_探求性": 1.1, // 状況分析の重要性
      "艮_安定性": 0.9  // 安定より行動重視
    },
    "地水師": {
      "離_表現性": 1.2, // 競争での自己表現
      "震_行動性": 1.3, // 積極性の重要性
      "兌_調和性": 0.8  // 競争状況での調和困難
    },
    "水風井": {
      "坤_受容性": 1.2, // 他者配慮の重要性
      "兌_調和性": 1.3, // 調和の価値
      "乾_創造性": 0.9  // 個人創造より共同体重視
    }
  };

  return modifiers[hexagramName]?.[dimension] || 1.0;
}

// グローバル変数として登録
if (typeof window !== "undefined") {
  window.OPPOSING_RELATIONSHIPS = OPPOSING_RELATIONSHIPS;
  window.COMPLEMENTARY_RELATIONSHIPS = COMPLEMENTARY_RELATIONSHIPS;
  window.SITUATIONAL_HEXAGRAMS = SITUATIONAL_HEXAGRAMS;
  window.KOUI_LEVELS = KOUI_LEVELS;
  window.calculateOpposingEffect = calculateOpposingEffect;
  window.calculateComplementaryEffect = calculateComplementaryEffect;
  window.getSituationalModifier = getSituationalModifier;
  
  console.log("✅ I-Ching relationships data loaded:", {
    opposingPairs: Object.keys(OPPOSING_RELATIONSHIPS).length / 2,
    complementaryTypes: Object.keys(COMPLEMENTARY_RELATIONSHIPS).length,
    situationalHexagrams: Object.keys(SITUATIONAL_HEXAGRAMS).length,
    kouiLevels: Object.keys(KOUI_LEVELS).length
  });
}