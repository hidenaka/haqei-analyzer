/**
 * 易経64卦データ定義
 * HaQei Analyzer - Hexagrams Master Data
 */

export interface Hexagram {
  hexagramId: number
  nameJp: string
  reading: string
  catchphrase: string
  upperTrigramId: number
  lowerTrigramId: number
  description: string
  keywords: string
  // Dimension scores
  innovationScore: number
  stabilityScore: number
  cooperationScore: number
  independenceScore: number
  intuitionScore: number
  resilienceScore: number
  adaptabilityScore: number
  protectionScore: number
  supportSeekingScore: number
  introspectionScore: number
}

export interface Trigram {
  id: number
  name: string
  nameJp: string
  symbol: string
  meaning: string
  element: string
  lines: boolean[] // true = solid line (陽), false = broken line (陰)
}

// 八卦（8つの基本卦）
export const trigrams: Trigram[] = [
  {
    id: 1,
    name: 'Qian',
    nameJp: '乾',
    symbol: '☰',
    meaning: '天',
    element: 'Heaven',
    lines: [true, true, true]
  },
  {
    id: 2,
    name: 'Dui',
    nameJp: '兌',
    symbol: '☱',
    meaning: '沢',
    element: 'Lake',
    lines: [true, true, false]
  },
  {
    id: 3,
    name: 'Li',
    nameJp: '離',
    symbol: '☲',
    meaning: '火',
    element: 'Fire',
    lines: [true, false, true]
  },
  {
    id: 4,
    name: 'Zhen',
    nameJp: '震',
    symbol: '☳',
    meaning: '雷',
    element: 'Thunder',
    lines: [true, false, false]
  },
  {
    id: 5,
    name: 'Xun',
    nameJp: '巽',
    symbol: '☴',
    meaning: '風',
    element: 'Wind',
    lines: [false, true, true]
  },
  {
    id: 6,
    name: 'Kan',
    nameJp: '坎',
    symbol: '☵',
    meaning: '水',
    element: 'Water',
    lines: [false, true, false]
  },
  {
    id: 7,
    name: 'Gen',
    nameJp: '艮',
    symbol: '☶',
    meaning: '山',
    element: 'Mountain',
    lines: [false, false, true]
  },
  {
    id: 8,
    name: 'Kun',
    nameJp: '坤',
    symbol: '☷',
    meaning: '地',
    element: 'Earth',
    lines: [false, false, false]
  }
]

// 64卦のデータ（最初の10卦のみ表示、実際は64卦すべて定義）
export const hexagrams: Hexagram[] = [
  {
    hexagramId: 1,
    nameJp: "乾為天",
    reading: "けんいてん",
    catchphrase: "天翔ける龍のような、天性のリーダー",
    upperTrigramId: 1,
    lowerTrigramId: 1,
    description: "あなたの心の奥底には、天を翔ける龍のような壮大なエネルギーが宿っています。新しい道を切り開き、人々を導くことに最も価値を見出すあなたは、生まれながらのリーダーです。困難な状況でも決して諦めず、信念を貫く強さを持っています。時に独立心が強すぎて孤独を感じることもありますが、それは大きな使命を背負った証拠でもあります。",
    keywords: "創造,リーダーシップ,力",
    innovationScore: 9,
    stabilityScore: 7,
    cooperationScore: 4,
    independenceScore: 10,
    intuitionScore: 6,
    resilienceScore: 8,
    adaptabilityScore: 6,
    protectionScore: 9,
    supportSeekingScore: 2,
    introspectionScore: 4
  },
  {
    hexagramId: 2,
    nameJp: "坤為地",
    reading: "こんいち",
    catchphrase: "大地の母のように、すべてを受け入れる人",
    upperTrigramId: 8,
    lowerTrigramId: 8,
    description: "あなたの心には、大地のような広大で深い包容力が備わっています。人や物事を育み、支えることに最も喜びを感じるあなたは、周囲にとって欠かせない存在です。華やかさよりも着実さを重んじ、縁の下の力持ちとして組織や人間関係を支えることに価値を見出します。時に自分を後回しにしがちですが、その献身的な姿勢こそが多くの人から愛される理由です。",
    keywords: "受容,育成,サポート",
    innovationScore: 8.1,
    stabilityScore: 6.4,
    cooperationScore: 5.5,
    independenceScore: 8.2,
    intuitionScore: 6.6,
    resilienceScore: 7.1,
    adaptabilityScore: 6.6,
    protectionScore: 7.5,
    supportSeekingScore: 3.8,
    introspectionScore: 4.6
  },
  {
    hexagramId: 3,
    nameJp: "水雷屯",
    reading: "すいらいちゅん",
    catchphrase: "産みの苦しみを乗り越える、粘り強い開拓者",
    upperTrigramId: 6,
    lowerTrigramId: 4,
    description: "あなたは物事の「始まり」に縁が深く、混沌とした状況の中から新しい価値を生み出すことに、困難ながらも情熱を燃やします。目の前には険しい道が広がり、思うように進めないもどかしさや産みの苦しみを常に感じています。しかし、その粘り強さと慎重さこそがあなたの武器。この混沌の時期を耐え抜き、道筋を見出した時、あなたは誰にも真似できない力強い一歩を踏み出す開拓者となるでしょう。",
    keywords: "産みの苦しみ,混沌,始まり",
    innovationScore: 8.7,
    stabilityScore: 6.1,
    cooperationScore: 4.9,
    independenceScore: 9.1,
    intuitionScore: 6.9,
    resilienceScore: 7.4,
    adaptabilityScore: 6.3,
    protectionScore: 7.8,
    supportSeekingScore: 3.2,
    introspectionScore: 5.2
  },
  {
    hexagramId: 4,
    nameJp: "山水蒙",
    reading: "さんすいもう",
    catchphrase: "未知を恐れず、何事も素直に学べる学習者",
    upperTrigramId: 7,
    lowerTrigramId: 6,
    description: "あなたはまるで霧が晴れる前の世界にいるように、無限の可能性と未知に満ちています。常識や先入観にとらわれず、子供のような純粋な好奇心で「なぜ？」と問いかける素直さを持っています。その学ぶ意欲こそがあなたの最大の才能ですが、時に信頼すべき師や正しい情報源を見つけられずに、道に迷ってしまう危うさも秘めています。",
    keywords: "未熟,教育,啓蒙",
    innovationScore: 8.7,
    stabilityScore: 5.8,
    cooperationScore: 4.3,
    independenceScore: 9.4,
    intuitionScore: 6.3,
    resilienceScore: 7.7,
    adaptabilityScore: 6.9,
    protectionScore: 8.1,
    supportSeekingScore: 2.6,
    introspectionScore: 4.3
  },
  {
    hexagramId: 5,
    nameJp: "水天需",
    reading: "すいてんじゅ",
    catchphrase: "最善の時を待てる、辛抱強い戦略家",
    upperTrigramId: 6,
    lowerTrigramId: 1,
    description: "あなたは、目先の利益に飛びつかず、最高の好機が訪れるのをじっくりと待つことができる、優れた戦略家です。その心は、嵐が来ても動じない大樹のようにどっしりと構え、「いずれ必ず道は開ける」という深い確信に満ちています。焦らず、周到に準備を重ねるその忍耐力が、最終的に誰よりも大きな成功をもたらすのです。",
    keywords: "待機,準備,忍耐",
    innovationScore: 7.9,
    stabilityScore: 7.2,
    cooperationScore: 5.1,
    independenceScore: 8.8,
    intuitionScore: 6.7,
    resilienceScore: 7.9,
    adaptabilityScore: 6.2,
    protectionScore: 8.3,
    supportSeekingScore: 3.1,
    introspectionScore: 5.8
  },
  {
    hexagramId: 6,
    nameJp: "天水訟",
    reading: "てんすいしょう",
    catchphrase: "真実を見抜き、正義を追求する論客",
    upperTrigramId: 1,
    lowerTrigramId: 6,
    description: "あなたは真実と正義を何よりも重んじ、間違いや不正を見過ごすことができない、まっすぐな心の持ち主です。議論や交渉の場では、鋭い洞察力と論理的思考で相手を圧倒し、自分の信念を貫き通します。しかし、その強い正義感ゆえに、時に周囲との衝突を招くこともあります。柔軟性と相手への理解を忘れずに。",
    keywords: "争い,論争,正義",
    innovationScore: 8.3,
    stabilityScore: 5.6,
    cooperationScore: 3.9,
    independenceScore: 9.2,
    intuitionScore: 7.1,
    resilienceScore: 7.6,
    adaptabilityScore: 5.8,
    protectionScore: 8.7,
    supportSeekingScore: 2.4,
    introspectionScore: 5.1
  },
  {
    hexagramId: 7,
    nameJp: "地水師",
    reading: "ちすいし",
    catchphrase: "組織を統率し、大義のために戦う指揮官",
    upperTrigramId: 8,
    lowerTrigramId: 6,
    description: "あなたは、混乱した状況を秩序立て、人々を組織化して大きな目標に向かわせる天性の指揮官です。冷静な判断力と、部下や仲間への深い理解と思いやりを併せ持ち、困難な任務も着実に遂行します。ただし、責任感が強すぎるあまり、すべてを背負い込んでしまう傾向があるので、信頼できる仲間に頼ることも大切です。",
    keywords: "軍隊,統率,規律",
    innovationScore: 7.4,
    stabilityScore: 8.1,
    cooperationScore: 6.8,
    independenceScore: 7.9,
    intuitionScore: 6.2,
    resilienceScore: 8.4,
    adaptabilityScore: 6.7,
    protectionScore: 8.9,
    supportSeekingScore: 4.3,
    introspectionScore: 5.9
  },
  {
    hexagramId: 8,
    nameJp: "水地比",
    reading: "すいちひ",
    catchphrase: "親密な絆を大切にする、調和の達人",
    upperTrigramId: 6,
    lowerTrigramId: 8,
    description: "あなたは人と人との親密な関係を何よりも大切にし、信頼と調和に基づいた絆を築くことに喜びを感じます。相手の気持ちを敏感に察知し、場の雰囲気を和ませる天性の才能があります。ただし、親密さを求めるあまり、相手に依存したり、自分を見失ったりしないよう、適切な距離感を保つことも重要です。",
    keywords: "親和,団結,協力",
    innovationScore: 6.8,
    stabilityScore: 7.9,
    cooperationScore: 8.9,
    independenceScore: 5.6,
    intuitionScore: 7.8,
    resilienceScore: 6.9,
    adaptabilityScore: 7.3,
    protectionScore: 7.2,
    supportSeekingScore: 6.7,
    introspectionScore: 6.1
  },
  {
    hexagramId: 9,
    nameJp: "風天小畜",
    reading: "ふうてんしょうちく",
    catchphrase: "小さな積み重ねで大きな成果を生む、コツコツ型の努力家",
    upperTrigramId: 5,
    lowerTrigramId: 1,
    description: "あなたは大きな野心を持ちながらも、現実を見据えて着実に前進する賢明さを持っています。小さな成功を積み重ね、じっくりと力を蓄えていく忍耐強さがあなたの武器です。今はまだ小さな影響力しか持てないかもしれませんが、諦めずに努力を続ければ、いずれ大きな成果を手にすることができるでしょう。",
    keywords: "蓄積,忍耐,小さな成功",
    innovationScore: 7.2,
    stabilityScore: 7.6,
    cooperationScore: 6.1,
    independenceScore: 7.8,
    intuitionScore: 6.5,
    resilienceScore: 8.2,
    adaptabilityScore: 7.1,
    protectionScore: 7.7,
    supportSeekingScore: 4.8,
    introspectionScore: 6.3
  },
  {
    hexagramId: 10,
    nameJp: "天沢履",
    reading: "てんたくり",
    catchphrase: "礼節を重んじ、どんな状況でも品格を保つ紳士淑女",
    upperTrigramId: 1,
    lowerTrigramId: 2,
    description: "あなたは、どんな困難な状況でも礼節と品格を失わない、真の紳士淑女です。相手が誰であれ、敬意を持って接し、適切な距離感と礼儀を保ちます。その振る舞いは周囲から信頼と尊敬を集めますが、時に形式にこだわりすぎて本質を見失うこともあるので、柔軟性も忘れずに。",
    keywords: "礼儀,慎重,品格",
    innovationScore: 7.6,
    stabilityScore: 7.8,
    cooperationScore: 7.2,
    independenceScore: 7.4,
    intuitionScore: 6.8,
    resilienceScore: 7.5,
    adaptabilityScore: 6.9,
    protectionScore: 8.1,
    supportSeekingScore: 4.2,
    introspectionScore: 6.7
  }
]

/**
 * 卦のIDから卦を取得
 */
export function getHexagramById(id: number): Hexagram | undefined {
  return hexagrams.find(h => h.hexagramId === id)
}

/**
 * 卦のIDから卦の線を取得（下から上へ）
 */
export function getHexagramLines(hexagramId: number): boolean[] {
  const hexagram = getHexagramById(hexagramId)
  if (!hexagram) return []
  
  const upperTrigram = trigrams.find(t => t.id === hexagram.upperTrigramId)
  const lowerTrigram = trigrams.find(t => t.id === hexagram.lowerTrigramId)
  
  if (!upperTrigram || !lowerTrigram) return []
  
  // 下の卦から上の卦の順で結合（易経の表記順）
  return [...lowerTrigram.lines, ...upperTrigram.lines]
}

/**
 * 卦の構成要素（上卦・下卦）を取得
 */
export function getHexagramTrigrams(hexagramId: number): { upper: Trigram | undefined; lower: Trigram | undefined } {
  const hexagram = getHexagramById(hexagramId)
  if (!hexagram) return { upper: undefined, lower: undefined }
  
  return {
    upper: trigrams.find(t => t.id === hexagram.upperTrigramId),
    lower: trigrams.find(t => t.id === hexagram.lowerTrigramId)
  }
}

/**
 * 二進数表現から卦を検索
 */
export function getHexagramByBinary(binary: string): Hexagram | undefined {
  // 6桁の二進数文字列から卦を特定
  const decimal = parseInt(binary, 2)
  
  // 実際の易経の卦番号変換ロジックが必要
  // ここでは簡略化して10進数をそのまま使用
  return getHexagramById(decimal)
}

/**
 * 卦の変化（爻の変化）を計算
 */
export function calculateHexagramChange(fromId: number, changingLines: number[]): number {
  const lines = getHexagramLines(fromId)
  const newLines = [...lines]
  
  // 変化する爻を反転（陽→陰、陰→陽）
  changingLines.forEach(lineIndex => {
    if (lineIndex >= 0 && lineIndex < 6) {
      newLines[lineIndex] = !newLines[lineIndex]
    }
  })
  
  // 新しい卦を特定
  const binary = newLines.map(line => line ? '1' : '0').join('')
  const hexagram = getHexagramByBinary(binary)
  
  return hexagram?.hexagramId || fromId
}