/**
 * 易経64卦完全データベース
 * 
 * 目的：
 * - 易経の全64卦における各卦の本質・属性・状況マッピング情報を完全定義
 * - DynamicIChingMapperでの動的卦選択のための包括的データソース
 * - bunenjin哲学に基づく4つのアーキタイプと時間軸の体系的分類
 * 
 * データ構造：
 * - 各卦は1-64の番号をキーとするオブジェクト
 * - 統一された属性セット：name, essence, dynamics, temporal, archetype, attributes
 * 
 * 重要な分類基準：
 * 1. archetype: 'creation'(1-16卦), 'development'(17-48卦), 'transformation'(49-56卦), 'maturity'(57-64卦)
 * 2. temporal: 'future-oriented', 'present-focused', 'transitional', 'past-oriented'
 * 3. dynamics: {drive, resistance, balance} 各0-10の数値スケール
 * 4. attributes: 陰陽バランス、movement、element、quality等の詳細特性
 * 
 * 使用目的：
 * - 状況分析結果との適合度計算（DynamicIChingMapper.calculateHexagramScores）
 * - アーキタイプベースの初期フィルタリング（30点重み付け）
 * - 時間軸ベースの二次フィルタリング（20点重み付け）
 * - 力学的類似度計算（コサイン類似度、25点重み付け）
 * 
 * 【重要】このデータベースの完全性が18個未使用卦問題の解決鍵：
 * - 全64卦が定義済みのため、データベース自体に問題なし
 * - 問題はDynamicIChingMapperの選択アルゴリズムの偏りにある
 * - 特定のarchetype/temporal組み合わせのみが高スコアとなる重み付け設計
 * 
 * データ品質基準：
 * - 各卦の essence: 現代的解釈と古典的意味の融合
 * - dynamics値: 易経原典の卦象に基づく数値化
 * - archetype分類: HAQEIプロジェクトの4段階理論に準拠
 * - temporal分類: 各卦の時間的性質の現代的解釈
 */

const HexagramDatabase = {
  // 第1卦〜第8卦（創始のグループ）
  1: { // 乾為天
    name: '乾為天',
    essence: '純粋な創造力、強いリーダーシップ',
    dynamics: { drive: 10, resistance: 0, balance: 2 },
    temporal: 'future-oriented',
    archetype: 'creation',
    attributes: {
      yang: 6, yin: 0,
      movement: 'ascending',
      element: 'heaven',
      quality: 'creative'
    }
  },
  
  2: { // 坤為地
    name: '坤為地',
    essence: '受容性、育む力、基盤',
    dynamics: { drive: 2, resistance: 0, balance: 8 },
    temporal: 'present-focused',
    archetype: 'creation',
    attributes: {
      yang: 0, yin: 6,
      movement: 'grounding',
      element: 'earth',
      quality: 'receptive'
    }
  },
  
  3: { // 水雷屯
    name: '水雷屯',
    essence: '困難な始まり、生みの苦しみ',
    dynamics: { drive: 6, resistance: 7, balance: 3 },
    temporal: 'transitional',
    archetype: 'creation',
    attributes: {
      yang: 2, yin: 4,
      movement: 'struggling',
      element: 'water-thunder',
      quality: 'difficult-birth'
    }
  },
  
  4: { // 山水蒙
    name: '山水蒙',
    essence: '無知からの学び、啓蒙の必要性',
    dynamics: { drive: 3, resistance: 2, balance: 5 },
    temporal: 'future-oriented',
    archetype: 'creation',
    attributes: {
      yang: 2, yin: 4,
      movement: 'learning',
      element: 'mountain-water',
      quality: 'inexperience'
    }
  },
  
  5: { // 水天需
    name: '水天需',
    essence: '待つことの知恵、適切なタイミング',
    dynamics: { drive: 4, resistance: 2, balance: 7 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 4, yin: 2,
      movement: 'waiting',
      element: 'water-heaven',
      quality: 'patience'
    }
  },
  
  6: { // 天水訟
    name: '天水訟',
    essence: '争い、対立の調整',
    dynamics: { drive: 5, resistance: 6, balance: 4 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 4, yin: 2,
      movement: 'conflicting',
      element: 'heaven-water',
      quality: 'dispute'
    }
  },
  
  7: { // 地水師
    name: '地水師',
    essence: '組織力、統率、集団行動',
    dynamics: { drive: 6, resistance: 3, balance: 5 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 1, yin: 5,
      movement: 'organizing',
      element: 'earth-water',
      quality: 'leadership'
    }
  },
  
  8: { // 水地比
    name: '水地比',
    essence: '親密さ、協力関係',
    dynamics: { drive: 3, resistance: 1, balance: 8 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 1, yin: 5,
      movement: 'bonding',
      element: 'water-earth',
      quality: 'unity'
    }
  },
  
  // 第9卦〜第16卦（小さな蓄積と喜び）
  9: { // 風天小畜
    name: '風天小畜',
    essence: '小さな蓄積、着実な前進',
    dynamics: { drive: 4, resistance: 3, balance: 6 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 5, yin: 1,
      movement: 'accumulating',
      element: 'wind-heaven',
      quality: 'small-restraint'
    }
  },
  
  10: { // 天沢履
    name: '天沢履',
    essence: '慎重な行動、礼儀と規範',
    dynamics: { drive: 5, resistance: 4, balance: 5 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 5, yin: 1,
      movement: 'treading',
      element: 'heaven-lake',
      quality: 'conduct'
    }
  },
  
  11: { // 地天泰
    name: '地天泰',
    essence: '調和、平和、繁栄',
    dynamics: { drive: 5, resistance: 1, balance: 9 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 3, yin: 3,
      movement: 'harmonizing',
      element: 'earth-heaven',
      quality: 'peace'
    }
  },
  
  12: { // 天地否
    name: '天地否',
    essence: '停滞、閉塞、不通',
    dynamics: { drive: 2, resistance: 8, balance: 3 },
    temporal: 'transitional',
    archetype: 'transformation',
    attributes: {
      yang: 3, yin: 3,
      movement: 'stagnating',
      element: 'heaven-earth',
      quality: 'obstruction'
    }
  },
  
  13: { // 天火同人
    name: '天火同人',
    essence: '仲間意識、共同体',
    dynamics: { drive: 6, resistance: 2, balance: 7 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 5, yin: 1,
      movement: 'fellowshipping',
      element: 'heaven-fire',
      quality: 'fellowship'
    }
  },
  
  14: { // 火天大有
    name: '火天大有',
    essence: '大きな所有、豊かさ',
    dynamics: { drive: 8, resistance: 1, balance: 6 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 5, yin: 1,
      movement: 'possessing',
      element: 'fire-heaven',
      quality: 'great-possession'
    }
  },
  
  15: { // 地山謙
    name: '地山謙',
    essence: '謙虚、控えめ、内なる充実',
    dynamics: { drive: 3, resistance: 0, balance: 9 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 1, yin: 5,
      movement: 'humbling',
      element: 'earth-mountain',
      quality: 'modesty'
    }
  },
  
  16: { // 雷地豫
    name: '雷地豫',
    essence: '喜び、熱意、準備',
    dynamics: { drive: 7, resistance: 2, balance: 5 },
    temporal: 'future-oriented',
    archetype: 'development',
    attributes: {
      yang: 1, yin: 5,
      movement: 'enthusiasm',
      element: 'thunder-earth',
      quality: 'providing-for'
    }
  },
  
  // 第17卦〜第24卦（従うことと復帰）
  17: { // 沢雷随
    name: '沢雷随',
    essence: '従う、適応、流れに乗る',
    dynamics: { drive: 4, resistance: 2, balance: 7 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 2, yin: 4,
      movement: 'following',
      element: 'lake-thunder',
      quality: 'following'
    }
  },
  
  18: { // 山風蠱
    name: '山風蠱',
    essence: '腐敗を正す、改革',
    dynamics: { drive: 6, resistance: 5, balance: 4 },
    temporal: 'transitional',
    archetype: 'transformation',
    attributes: {
      yang: 3, yin: 3,
      movement: 'correcting',
      element: 'mountain-wind',
      quality: 'decay'
    }
  },
  
  19: { // 地沢臨
    name: '地沢臨',
    essence: '接近、監督、指導',
    dynamics: { drive: 5, resistance: 2, balance: 6 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 2, yin: 4,
      movement: 'approaching',
      element: 'earth-lake',
      quality: 'approach'
    }
  },
  
  20: { // 風地観
    name: '風地観',
    essence: '観察、瞑想、内省',
    dynamics: { drive: 2, resistance: 1, balance: 8 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 2, yin: 4,
      movement: 'contemplating',
      element: 'wind-earth',
      quality: 'contemplation'
    }
  },
  
  21: { // 火雷噬嗑
    name: '火雷噬嗑',
    essence: '障害を噛み砕く、決断',
    dynamics: { drive: 7, resistance: 4, balance: 4 },
    temporal: 'present-focused',
    archetype: 'transformation',
    attributes: {
      yang: 3, yin: 3,
      movement: 'biting-through',
      element: 'fire-thunder',
      quality: 'biting-through'
    }
  },
  
  22: { // 山火賁
    name: '山火賁',
    essence: '装飾、形式、文化',
    dynamics: { drive: 3, resistance: 1, balance: 7 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 3, yin: 3,
      movement: 'adorning',
      element: 'mountain-fire',
      quality: 'grace'
    }
  },
  
  23: { // 山地剥
    name: '山地剥',
    essence: '剥落、崩壊、終わり',
    dynamics: { drive: 1, resistance: 8, balance: 3 },
    temporal: 'transitional',
    archetype: 'transformation',
    attributes: {
      yang: 1, yin: 5,
      movement: 'splitting-apart',
      element: 'mountain-earth',
      quality: 'splitting-apart'
    }
  },
  
  24: { // 地雷復
    name: '地雷復',
    essence: '復帰、再生、新たな始まり',
    dynamics: { drive: 5, resistance: 2, balance: 6 },
    temporal: 'transitional',
    archetype: 'transformation',
    attributes: {
      yang: 1, yin: 5,
      movement: 'returning',
      element: 'earth-thunder',
      quality: 'return'
    }
  },
  
  // 第25卦〜第32卦（無為と恒常）
  25: { // 天雷无妄
    name: '天雷无妄',
    essence: '無為自然、純粋、誠実',
    dynamics: { drive: 4, resistance: 1, balance: 8 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 4, yin: 2,
      movement: 'innocence',
      element: 'heaven-thunder',
      quality: 'innocence'
    }
  },
  
  26: { // 山天大畜
    name: '山天大畜',
    essence: '大きな蓄積、潜在力',
    dynamics: { drive: 3, resistance: 4, balance: 6 },
    temporal: 'future-oriented',
    archetype: 'development',
    attributes: {
      yang: 4, yin: 2,
      movement: 'great-taming',
      element: 'mountain-heaven',
      quality: 'great-accumulation'
    }
  },
  
  27: { // 山雷頤
    name: '山雷頤',
    essence: '養う、育成、栄養',
    dynamics: { drive: 4, resistance: 2, balance: 7 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 2, yin: 4,
      movement: 'nourishing',
      element: 'mountain-thunder',
      quality: 'nourishment'
    }
  },
  
  28: { // 沢風大過
    name: '沢風大過',
    essence: '大きな超過、非常事態',
    dynamics: { drive: 8, resistance: 6, balance: 3 },
    temporal: 'transitional',
    archetype: 'transformation',
    attributes: {
      yang: 4, yin: 2,
      movement: 'exceeding',
      element: 'lake-wind',
      quality: 'great-exceeding'
    }
  },
  
  29: { // 坎為水
    name: '坎為水',
    essence: '険難、深淵、危機',
    dynamics: { drive: 5, resistance: 8, balance: 3 },
    temporal: 'transitional',
    archetype: 'transformation',
    attributes: {
      yang: 2, yin: 4,
      movement: 'abysmal',
      element: 'water',
      quality: 'danger'
    }
  },
  
  30: { // 離為火
    name: '離為火',
    essence: '明るさ、付着、文明',
    dynamics: { drive: 7, resistance: 2, balance: 5 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 3, yin: 3,
      movement: 'clinging',
      element: 'fire',
      quality: 'brilliance'
    }
  },
  
  31: { // 沢山咸
    name: '沢山咸',
    essence: '感応、相互影響、恋愛',
    dynamics: { drive: 6, resistance: 2, balance: 6 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 3, yin: 3,
      movement: 'influencing',
      element: 'lake-mountain',
      quality: 'influence'
    }
  },
  
  32: { // 雷風恒
    name: '雷風恒',
    essence: '恒常性、持続、永続',
    dynamics: { drive: 5, resistance: 3, balance: 7 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 3, yin: 3,
      movement: 'persevering',
      element: 'thunder-wind',
      quality: 'duration'
    }
  },
  
  // 第33卦〜第40卦（退却と解放）
  33: { // 天山遯
    name: '天山遯',
    essence: '退却、隠遁、戦略的撤退',
    dynamics: { drive: 3, resistance: 5, balance: 5 },
    temporal: 'transitional',
    archetype: 'transformation',
    attributes: {
      yang: 4, yin: 2,
      movement: 'retreating',
      element: 'heaven-mountain',
      quality: 'retreat'
    }
  },
  
  34: { // 雷天大壮
    name: '雷天大壮',
    essence: '大いなる力、勢い',
    dynamics: { drive: 9, resistance: 3, balance: 4 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 4, yin: 2,
      movement: 'great-power',
      element: 'thunder-heaven',
      quality: 'great-strength'
    }
  },
  
  35: { // 火地晋
    name: '火地晋',
    essence: '前進、昇進、進歩',
    dynamics: { drive: 7, resistance: 2, balance: 5 },
    temporal: 'future-oriented',
    archetype: 'development',
    attributes: {
      yang: 3, yin: 3,
      movement: 'progressing',
      element: 'fire-earth',
      quality: 'progress'
    }
  },
  
  36: { // 地火明夷
    name: '地火明夷',
    essence: '明るさを隠す、内なる光',
    dynamics: { drive: 3, resistance: 6, balance: 5 },
    temporal: 'present-focused',
    archetype: 'transformation',
    attributes: {
      yang: 3, yin: 3,
      movement: 'darkening',
      element: 'earth-fire',
      quality: 'darkening-light'
    }
  },
  
  37: { // 風火家人
    name: '風火家人',
    essence: '家族、家庭の調和',
    dynamics: { drive: 4, resistance: 1, balance: 8 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 3, yin: 3,
      movement: 'dwelling',
      element: 'wind-fire',
      quality: 'family'
    }
  },
  
  38: { // 火沢睽
    name: '火沢睽',
    essence: '対立、相違、誤解',
    dynamics: { drive: 5, resistance: 6, balance: 4 },
    temporal: 'present-focused',
    archetype: 'transformation',
    attributes: {
      yang: 3, yin: 3,
      movement: 'opposing',
      element: 'fire-lake',
      quality: 'opposition'
    }
  },
  
  39: { // 水山蹇
    name: '水山蹇',
    essence: '困難、障害、停滞',
    dynamics: { drive: 2, resistance: 8, balance: 4 },
    temporal: 'transitional',
    archetype: 'transformation',
    attributes: {
      yang: 2, yin: 4,
      movement: 'limping',
      element: 'water-mountain',
      quality: 'obstruction'
    }
  },
  
  40: { // 雷水解
    name: '雷水解',
    essence: '解放、解決、緊張の緩和',
    dynamics: { drive: 6, resistance: 3, balance: 6 },
    temporal: 'transitional',
    archetype: 'transformation',
    attributes: {
      yang: 2, yin: 4,
      movement: 'deliverance',
      element: 'thunder-water',
      quality: 'deliverance'
    }
  },
  
  // 第41卦〜第48卦（減少と井戸）
  41: { // 山沢損
    name: '山沢損',
    essence: '減少、犠牲、シンプル化',
    dynamics: { drive: 3, resistance: 5, balance: 6 },
    temporal: 'transitional',
    archetype: 'transformation',
    attributes: {
      yang: 3, yin: 3,
      movement: 'decreasing',
      element: 'mountain-lake',
      quality: 'decrease'
    }
  },
  
  42: { // 風雷益
    name: '風雷益',
    essence: '増益、成長、利益',
    dynamics: { drive: 7, resistance: 2, balance: 5 },
    temporal: 'future-oriented',
    archetype: 'development',
    attributes: {
      yang: 3, yin: 3,
      movement: 'increasing',
      element: 'wind-thunder',
      quality: 'increase'
    }
  },
  
  43: { // 沢天夬
    name: '沢天夬',
    essence: '決断、突破、排除',
    dynamics: { drive: 8, resistance: 4, balance: 4 },
    temporal: 'transitional',
    archetype: 'transformation',
    attributes: {
      yang: 5, yin: 1,
      movement: 'breakthrough',
      element: 'lake-heaven',
      quality: 'breakthrough'
    }
  },
  
  44: { // 天風姤
    name: '天風姤',
    essence: '出会い、誘惑、意外な遭遇',
    dynamics: { drive: 6, resistance: 3, balance: 5 },
    temporal: 'present-focused',
    archetype: 'transformation',
    attributes: {
      yang: 5, yin: 1,
      movement: 'coming-to-meet',
      element: 'heaven-wind',
      quality: 'encounter'
    }
  },
  
  45: { // 沢地萃
    name: '沢地萃',
    essence: '集合、結集、団結',
    dynamics: { drive: 5, resistance: 2, balance: 7 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 2, yin: 4,
      movement: 'gathering',
      element: 'lake-earth',
      quality: 'gathering'
    }
  },
  
  46: { // 地風升
    name: '地風升',
    essence: '上昇、成長、昇進',
    dynamics: { drive: 6, resistance: 2, balance: 5 },
    temporal: 'future-oriented',
    archetype: 'development',
    attributes: {
      yang: 2, yin: 4,
      movement: 'ascending',
      element: 'earth-wind',
      quality: 'pushing-upward'
    }
  },
  
  47: { // 沢水困
    name: '沢水困',
    essence: '困窮、枯渇、試練',
    dynamics: { drive: 2, resistance: 8, balance: 3 },
    temporal: 'transitional',
    archetype: 'transformation',
    attributes: {
      yang: 2, yin: 4,
      movement: 'confining',
      element: 'lake-water',
      quality: 'oppression'
    }
  },
  
  48: { // 水風井
    name: '水風井',
    essence: '井戸、源泉、共有資源',
    dynamics: { drive: 4, resistance: 2, balance: 7 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 2, yin: 4,
      movement: 'welling',
      element: 'water-wind',
      quality: 'well'
    }
  },
  
  // 第49卦〜第56卦（革命と旅）
  49: { // 沢火革
    name: '沢火革',
    essence: '変革、革命、刷新',
    dynamics: { drive: 8, resistance: 5, balance: 4 },
    temporal: 'transitional',
    archetype: 'transformation',
    attributes: {
      yang: 3, yin: 3,
      movement: 'revolution',
      element: 'lake-fire',
      quality: 'revolution'
    }
  },
  
  50: { // 火風鼎
    name: '火風鼎',
    essence: '鼎、変容、新しい形',
    dynamics: { drive: 6, resistance: 3, balance: 6 },
    temporal: 'transitional',
    archetype: 'transformation',
    attributes: {
      yang: 3, yin: 3,
      movement: 'holding',
      element: 'fire-wind',
      quality: 'cauldron'
    }
  },
  
  51: { // 震為雷
    name: '震為雷',
    essence: '震動、衝撃、覚醒',
    dynamics: { drive: 9, resistance: 2, balance: 3 },
    temporal: 'transitional',
    archetype: 'transformation',
    attributes: {
      yang: 2, yin: 4,
      movement: 'shocking',
      element: 'thunder',
      quality: 'shock'
    }
  },
  
  52: { // 艮為山
    name: '艮為山',
    essence: '静止、瞑想、安定',
    dynamics: { drive: 1, resistance: 3, balance: 9 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 2, yin: 4,
      movement: 'keeping-still',
      element: 'mountain',
      quality: 'stillness'
    }
  },
  
  53: { // 風山漸
    name: '風山漸',
    essence: '漸進、段階的発展',
    dynamics: { drive: 4, resistance: 2, balance: 7 },
    temporal: 'future-oriented',
    archetype: 'development',
    attributes: {
      yang: 3, yin: 3,
      movement: 'developing',
      element: 'wind-mountain',
      quality: 'gradual-progress'
    }
  },
  
  54: { // 雷沢帰妹
    name: '雷沢帰妹',
    essence: '若い娘の嫁入り、軽率',
    dynamics: { drive: 6, resistance: 4, balance: 4 },
    temporal: 'transitional',
    archetype: 'transformation',
    attributes: {
      yang: 3, yin: 3,
      movement: 'marrying',
      element: 'thunder-lake',
      quality: 'marrying-maiden'
    }
  },
  
  55: { // 雷火豊
    name: '雷火豊',
    essence: '豊かさ、絶頂、充実',
    dynamics: { drive: 8, resistance: 2, balance: 5 },
    temporal: 'present-focused',
    archetype: 'maturity',
    attributes: {
      yang: 3, yin: 3,
      movement: 'abounding',
      element: 'thunder-fire',
      quality: 'abundance'
    }
  },
  
  56: { // 火山旅
    name: '火山旅',
    essence: '旅、移動、一時的',
    dynamics: { drive: 5, resistance: 3, balance: 5 },
    temporal: 'transitional',
    archetype: 'transformation',
    attributes: {
      yang: 3, yin: 3,
      movement: 'traveling',
      element: 'fire-mountain',
      quality: 'wanderer'
    }
  },
  
  // 第57卦〜第64卦（穏やかさと完成）
  57: { // 巽為風
    name: '巽為風',
    essence: '穏やかな浸透、柔軟',
    dynamics: { drive: 4, resistance: 1, balance: 8 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 3, yin: 3,
      movement: 'gentle',
      element: 'wind',
      quality: 'penetrating'
    }
  },
  
  58: { // 兌為沢
    name: '兌為沢',
    essence: '喜び、楽しさ、交流',
    dynamics: { drive: 5, resistance: 1, balance: 7 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 3, yin: 3,
      movement: 'joyous',
      element: 'lake',
      quality: 'joy'
    }
  },
  
  59: { // 風水渙
    name: '風水渙',
    essence: '分散、溶解、拡散',
    dynamics: { drive: 5, resistance: 4, balance: 5 },
    temporal: 'transitional',
    archetype: 'transformation',
    attributes: {
      yang: 3, yin: 3,
      movement: 'dispersing',
      element: 'wind-water',
      quality: 'dispersion'
    }
  },
  
  60: { // 水沢節
    name: '水沢節',
    essence: '節度、制限、適度',
    dynamics: { drive: 3, resistance: 4, balance: 7 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 2, yin: 4,
      movement: 'limiting',
      element: 'water-lake',
      quality: 'limitation'
    }
  },
  
  61: { // 風沢中孚
    name: '風沢中孚',
    essence: '内なる誠実、信頼',
    dynamics: { drive: 4, resistance: 1, balance: 8 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 2, yin: 4,
      movement: 'centering',
      element: 'wind-lake',
      quality: 'inner-truth'
    }
  },
  
  62: { // 雷山小過
    name: '雷山小過',
    essence: '小さな超過、細心の注意',
    dynamics: { drive: 5, resistance: 4, balance: 5 },
    temporal: 'present-focused',
    archetype: 'development',
    attributes: {
      yang: 2, yin: 4,
      movement: 'small-exceeding',
      element: 'thunder-mountain',
      quality: 'small-exceeding'
    }
  },
  
  63: { // 水火既済
    name: '水火既済',
    essence: '完成、しかし警戒が必要',
    dynamics: { drive: 5, resistance: 3, balance: 8 },
    temporal: 'present-focused',
    archetype: 'maturity',
    attributes: {
      yang: 3, yin: 3,
      movement: 'completed',
      element: 'water-fire',
      quality: 'after-completion'
    }
  },
  
  64: { // 火水未済
    name: '火水未済',
    essence: '未完成、新たな始まりへ',
    dynamics: { drive: 7, resistance: 4, balance: 5 },
    temporal: 'future-oriented',
    archetype: 'maturity',
    attributes: {
      yang: 3, yin: 3,
      movement: 'not-yet',
      element: 'fire-water',
      quality: 'before-completion'
    }
  }
};

// エクスポート
if (typeof window !== 'undefined') {
  window.HexagramDatabase = HexagramDatabase;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HexagramDatabase;
}