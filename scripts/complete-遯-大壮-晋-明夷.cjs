const fs = require('fs');
const path = require('path');

// データファイルのパス
const dataPath = path.join(__dirname, '../public/data/narratives_chain.v1.json');

// 既存データを読み込む
const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 次の4卦のナラティブを作成
const hexagrams = [
  { name: '天山遯', position: 33 },
  { name: '雷天大壮', position: 34 },
  { name: '火地晋', position: 35 },
  { name: '地火明夷', position: 36 }
];

const newNarratives = [];

// 天山遯（33）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、状況の変化を察知し、退く時期であることを理解します。続いて、計画的に撤退を進め、損失を最小限に抑えます。最後に、安全な場所で体勢を立て直し、次の機会に備えます。突破口は、退くことも前進の一形態と理解することです。",
      tone: "story",
      suitability: "戦略的撤退、タイミング判断、リスク回避、体勢立て直し",
      caution: "逃げ癖にならず、必要な時は立ち向かう",
      label: "JJJ",
      start: { hex: "天山遯", pos: line },
      final: { hex: "天山遯", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、世俗から離れ、静かな環境で自己と向き合います。続いて、内省を深め、本質的な価値を見出していきます。最後に、新たな視点を獲得し、より高い次元から物事を見られるようになります。突破口は、距離を置くことで得られる客観性です。",
      tone: "story",
      suitability: "内省、瞑想、隠遁、精神的成長",
      caution: "現実逃避にならず、社会との接点も保つ",
      label: "JJH",
      start: { hex: "天山遯", pos: line },
      final: { hex: "天山遯", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、賢明に身を引き、無用な争いを避けます。続いて、適切な距離を保ちながら、状況を観察します。最後に、時機を見て再び行動し、より良い結果を得ます。突破口は、引き際の美学です。",
      tone: "story",
      suitability: "紛争回避、距離調整、観察期間、機会待機",
      caution: "消極的になりすぎず、チャンスは逃さない",
      label: "JHJ",
      start: { hex: "天山遯", pos: line },
      final: { hex: "天山遯", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、高い理想を保ちながら、現実との折り合いをつけます。続いて、妥協せずに済む環境を選び、そこで活動します。最後に、理想的な条件が整い、本来の力を発揮できるようになります。突破口は、環境を選ぶ智慧です。",
      tone: "story",
      suitability: "環境選択、条件整備、理想追求、適材適所",
      caution: "理想主義に陥らず、現実的な判断もする",
      label: "JHH",
      start: { hex: "天山遯", pos: line },
      final: { hex: "天山遯", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既存の枠組みから離れ、自由な立場を獲得します。続いて、その自由を活かして創造的な活動を展開します。最後に、独立した存在として、新たな価値を生み出します。突破口は、束縛からの解放です。",
      tone: "story",
      suitability: "独立、自由職業、クリエイティブ、新規開拓",
      caution: "孤立しすぎず、必要な協力関係は維持する",
      label: "HJJ",
      start: { hex: "天山遯", pos: line },
      final: { hex: "天山遯", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、関わり方を見直し、適切な距離感を模索します。続いて、新しい関係性を構築し、より健全な形を実現します。最後に、再び調整を加え、最適なバランスを見出します。突破口は、依存と自立のバランスです。",
      tone: "story",
      suitability: "関係調整、境界設定、健全な距離、バランス関係",
      caution: "冷たくなりすぎず、温かさも保つ",
      label: "HJH",
      start: { hex: "天山遯", pos: line },
      final: { hex: "天山遯", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな撤退から始め、リスク管理の経験を積みます。続いて、より大きな判断において、適切な退き時を見極められるようになります。最後に、進退自在の境地に到達し、どんな状況でも最適な選択ができます。突破口は、柔軟な判断力です。",
      tone: "story",
      suitability: "判断力向上、リスク管理、戦略的思考、柔軟性",
      caution: "優柔不断にならず、決断は明確に行う",
      label: "HHJ",
      start: { hex: "天山遯", pos: line },
      final: { hex: "天山遯", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、執着を手放し、自由な心境を獲得します。続いて、去るものは追わず、来るものは拒まずの姿勢を保ちます。最後に、無執着の境地で、真の自由を実現します。突破口は、手放すことで得られる軽やかさです。",
      tone: "story",
      suitability: "執着解放、精神的自由、無執着、超越的視点",
      caution: "無関心にならず、必要な責任は果たす",
      label: "HHH",
      start: { hex: "天山遯", pos: line },
      final: { hex: "天山遯", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 雷天大壮（34）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、力が充実し、大きな行動を起こす準備が整います。続いて、その力を発揮し、障害を突破していきます。最後に、壮大な成果を実現し、新たな地平を切り開きます。突破口は、力を正しく使う智慧です。",
      tone: "story",
      suitability: "大胆な行動、力の発揮、突破力、大規模展開",
      caution: "力に頼りすぎず、知恵も併用する",
      label: "JJJ",
      start: { hex: "雷天大壮", pos: line },
      final: { hex: "雷天大壮", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、内なる力を育て、実力を充実させます。続いて、その力を適切に制御し、効果的に活用します。最後に、新たな視点から力の使い方を見直し、より洗練された形で発揮します。突破口は、力の質的向上です。",
      tone: "story",
      suitability: "実力向上、パワーコントロール、効果的活用、洗練された力",
      caution: "暴力的にならず、建設的に使う",
      label: "JJH",
      start: { hex: "雷天大壮", pos: line },
      final: { hex: "雷天大壮", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、強大な意志力を持って目標に向かいます。続いて、現実的な制約を考慮し、戦略を調整します。最後に、より強い決意で前進し、目標を達成します。突破口は、意志と現実の統合です。",
      tone: "story",
      suitability: "意志力、目標達成、戦略的推進、強い決意",
      caution: "独善的にならず、周囲の意見も聞く",
      label: "JHJ",
      start: { hex: "雷天大壮", pos: line },
      final: { hex: "雷天大壮", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、圧倒的な力で主導権を握り、流れを作ります。続いて、その勢いを維持しながら、方向を調整します。最後に、安定した優位性を確立し、持続的な成功を実現します。突破口は、勢いと制御のバランスです。",
      tone: "story",
      suitability: "主導権確保、勢力拡大、優位性確立、市場制覇",
      caution: "傲慢にならず、謙虚さも保つ",
      label: "JHH",
      start: { hex: "雷天大壮", pos: line },
      final: { hex: "雷天大壮", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新たな力の源泉を発見し、可能性を広げます。続いて、その力を開発し、従来の限界を超えていきます。最後に、革新的な力の使い方で、画期的な成果を実現します。突破口は、未知の力の開拓です。",
      tone: "story",
      suitability: "潜在能力開発、新しい力、革新的アプローチ、限界突破",
      caution: "実験的すぎて危険を冒さない",
      label: "HJJ",
      start: { hex: "雷天大壮", pos: line },
      final: { hex: "雷天大壮", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、力の使い方を見直し、より効率的な方法を探ります。続いて、改善された方法で実践し、成果を確認します。最後に、再び最適化を図り、最大の効果を発揮します。突破口は、力の効率的活用です。",
      tone: "story",
      suitability: "効率化、最適化、パフォーマンス向上、省エネルギー",
      caution: "効率ばかり追求せず、力強さも大切にする",
      label: "HJH",
      start: { hex: "雷天大壮", pos: line },
      final: { hex: "雷天大壮", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな力から始め、徐々に強化していきます。続いて、力の蓄積が臨界点を超え、大きな力となります。最後に、その力で大きな変革を実現し、歴史に名を残します。突破口は、継続的な強化による質的変化です。",
      tone: "story",
      suitability: "段階的強化、力の蓄積、大器晩成、歴史的偉業",
      caution: "焦らず、着実に力を養う",
      label: "HHJ",
      start: { hex: "雷天大壮", pos: line },
      final: { hex: "雷天大壮", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、力を適切に配分し、バランスの取れた使い方をします。続いて、状況に応じて力の強弱を調整し、最適な対応をします。最後に、力の自在な操作が可能となり、どんな状況でも対処できます。突破口は、力の柔軟な運用です。",
      tone: "story",
      suitability: "バランス力、適応力、柔軟な対応、全方位的強さ",
      caution: "中途半端にならず、必要な時は全力を出す",
      label: "HHH",
      start: { hex: "雷天大壮", pos: line },
      final: { hex: "雷天大壮", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 火地晋（35）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、才能が認められ、昇進の機会が訪れます。続いて、実力を発揮し、期待以上の成果を上げていきます。最後に、更なる高みへと昇り、輝かしい地位を獲得します。突破口は、機会を確実に掴む実行力です。",
      tone: "story",
      suitability: "昇進、出世、キャリアアップ、社会的成功",
      caution: "地位に溺れず、初心を忘れない",
      label: "JJJ",
      start: { hex: "火地晋", pos: line },
      final: { hex: "火地晋", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、着実な努力により、徐々に評価を高めていきます。続いて、信頼を積み重ね、重要な役割を任されるようになります。最後に、新たな視野から全体を見渡し、より大きな貢献を果たします。突破口は、地道な努力の積み重ねです。",
      tone: "story",
      suitability: "信頼構築、段階的成長、責任拡大、影響力向上",
      caution: "急ぎすぎず、一歩一歩確実に進む",
      label: "JJH",
      start: { hex: "火地晋", pos: line },
      final: { hex: "火地晋", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、明るい未来を描き、前向きに進み始めます。続いて、現実的な課題に対処しながら、希望を保ちます。最後に、より明確なビジョンを持って、目標に向かって邁進します。突破口は、楽観性と現実性のバランスです。",
      tone: "story",
      suitability: "ポジティブ思考、希望的前進、ビジョン実現、明るい展望",
      caution: "楽観的すぎず、リスクも考慮する",
      label: "JHJ",
      start: { hex: "火地晋", pos: line },
      final: { hex: "火地晋", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、太陽のように周囲を明るく照らし、良い影響を与えます。続いて、その光がさらに広がり、多くの人々を導きます。最後に、指導者として確固たる地位を築き、持続的な影響力を発揮します。突破口は、与える喜びの発見です。",
      tone: "story",
      suitability: "リーダーシップ、影響力拡大、指導者育成、光明正大",
      caution: "独善的にならず、他者の意見も尊重する",
      label: "JHH",
      start: { hex: "火地晋", pos: line },
      final: { hex: "火地晋", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しい分野に進出し、未知の可能性を探ります。続いて、その分野で成功を収め、先駆者となります。最後に、さらなる新天地を開拓し、革新的な成果を上げます。突破口は、未踏の地への勇気ある一歩です。",
      tone: "story",
      suitability: "新規開拓、先駆者、イノベーション、フロンティア精神",
      caution: "冒険的になりすぎず、基盤も固める",
      label: "HJJ",
      start: { hex: "火地晋", pos: line },
      final: { hex: "火地晋", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、前進の方法を見直し、より効果的な戦略を立てます。続いて、その戦略を実行し、成果を確認します。最後に、再び調整を加え、最適な前進方法を確立します。突破口は、戦略的な前進です。",
      tone: "story",
      suitability: "戦略的前進、計画的成長、効果的推進、最適化",
      caution: "計画に縛られず、柔軟に対応する",
      label: "HJH",
      start: { hex: "火地晋", pos: line },
      final: { hex: "火地晋", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな前進から始め、成功体験を積み重ねます。続いて、自信をつけながら、より大きな挑戦に取り組みます。最後に、大きな飛躍を実現し、目標を達成します。突破口は、小さな成功の積み重ねです。",
      tone: "story",
      suitability: "段階的成長、自信構築、着実な前進、目標達成",
      caution: "小さな成功に満足せず、大きな目標を見据える",
      label: "HHJ",
      start: { hex: "火地晋", pos: line },
      final: { hex: "火地晋", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、バランスの取れた成長を心がけ、全方位的に発展します。続いて、各分野での成功が相乗効果を生み、総合力が向上します。最後に、調和の取れた成功を実現し、持続可能な繁栄を築きます。突破口は、偏りのない成長です。",
      tone: "story",
      suitability: "総合的成長、バランス発展、全方位成功、持続的繁栄",
      caution: "器用貧乏にならず、強みも活かす",
      label: "HHH",
      start: { hex: "火地晋", pos: line },
      final: { hex: "火地晋", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 地火明夷（36）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、暗闇の中でも希望を失わず、内なる光を保ちます。続いて、困難な状況下で知恵を働かせ、生き延びる道を見出します。最後に、暗闇を抜け出し、より強い光を放つようになります。突破口は、最も暗い時でも光を信じることです。",
      tone: "story",
      suitability: "逆境克服、希望維持、困難突破、内的強さ",
      caution: "絶望に陥らず、可能性を探り続ける",
      label: "JJJ",
      start: { hex: "地火明夷", pos: line },
      final: { hex: "地火明夷", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、表面的には従順を装いながら、内心の信念を守ります。続いて、機会を待ちながら力を蓄え、準備を進めます。最後に、新たな視点から状況を理解し、賢明な行動を取ります。突破口は、外柔内剛の処世術です。",
      tone: "story",
      suitability: "韜晦、忍耐、戦略的待機、内的自由",
      caution: "偽りが習慣にならないよう注意する",
      label: "JJH",
      start: { hex: "地火明夷", pos: line },
      final: { hex: "地火明夷", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、困難な環境に身を置きながらも、学びの機会として捉えます。続いて、試練を通じて成長し、強靭な精神力を養います。最後に、より深い理解に到達し、どんな状況でも対処できる力を獲得します。突破口は、苦難を成長の糧とすることです。",
      tone: "story",
      suitability: "試練を通じた成長、精神力強化、深い学び、魂の鍛錬",
      caution: "苦行主義に陥らず、適度な休息も取る",
      label: "JHJ",
      start: { hex: "地火明夷", pos: line },
      final: { hex: "地火明夷", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、光が遮られた状況を受け入れ、現実を直視します。続いて、限られた条件の中で最善を尽くし、小さな成果を積み重ねます。最後に、状況が改善され、努力が報われる時が来ます。突破口は、諦めない粘り強さです。",
      tone: "story",
      suitability: "粘り強さ、地道な努力、現実対処、長期忍耐",
      caution: "受動的になりすぎず、能動的な努力も続ける",
      label: "JHH",
      start: { hex: "地火明夷", pos: line },
      final: { hex: "地火明夷", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既存の方法では突破できない暗闇に直面します。続いて、創造的な発想で新たな光源を見出します。最後に、その光が広がり、周囲の暗闇も照らすようになります。突破口は、暗闇の中での創造性です。",
      tone: "story",
      suitability: "創造的解決、革新的突破、新たな希望、光の創出",
      caution: "現実離れした解決策に頼らない",
      label: "HJJ",
      start: { hex: "地火明夷", pos: line },
      final: { hex: "地火明夷", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、暗闇への対処法を見直し、より効果的な方法を探ります。続いて、新しいアプローチで実践し、改善を確認します。最後に、再び調整を加え、最適な生存戦略を確立します。突破口は、適応的な対処法です。",
      tone: "story",
      suitability: "適応戦略、サバイバル、柔軟な対処、生存術",
      caution: "妥協しすぎて本質を見失わない",
      label: "HJH",
      start: { hex: "地火明夷", pos: line },
      final: { hex: "地火明夷", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな光を大切に守り、消えないように育てます。続いて、その光が徐々に強くなり、周囲を照らし始めます。最後に、完全な光明を取り戻し、新たな時代を迎えます。突破口は、小さな希望を守り抜くことです。",
      tone: "story",
      suitability: "希望の保持、段階的回復、光の復活、新時代への移行",
      caution: "性急に光を求めず、時を待つ",
      label: "HHJ",
      start: { hex: "地火明夷", pos: line },
      final: { hex: "地火明夷", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、暗闇と光の両方を理解し、その循環を受け入れます。続いて、どちらの状況でも平静を保ち、適切に対応します。最後に、光と闇を超越した境地に到達し、真の自由を獲得します。突破口は、二元性を超えることです。",
      tone: "story",
      suitability: "超越的視点、陰陽の理解、精神的自由、悟りの境地",
      caution: "現実から遊離せず、実生活も大切にする",
      label: "HHH",
      start: { hex: "地火明夷", pos: line },
      final: { hex: "地火明夷", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 既存データと新しいナラティブを結合（オブジェクト形式）
const updatedData = { ...existingData };

// 新しいナラティブをオブジェクトに追加
newNarratives.forEach(narrative => {
  const key = `${narrative.start.hex} ${getLineName(narrative.start.hex, narrative.start.pos)} | ${narrative.label}`;
  updatedData[key] = narrative;
});

// 爻の名前を取得する関数
function getLineName(hexName, pos) {
  const names = ['初', '二', '三', '四', '五', '上'];
  
  // 各卦の爻の陰陽を定義（1=陽、0=陰）
  const hexLines = {
    '天山遯': [1,1,1,1,0,0],   // 天山遯（33）乾上艮下
    '雷天大壮': [0,0,1,1,1,1], // 雷天大壮（34）震上乾下
    '火地晋': [0,0,0,1,0,1],   // 火地晋（35）離上坤下
    '地火明夷': [1,0,1,0,0,0]  // 地火明夷（36）坤上離下
  };
  
  const lines = hexLines[hexName];
  const isYang = lines[pos - 1] === 1;
  const type = isYang ? '九' : '六';
  
  if (pos === 1) return '初' + type;
  if (pos === 6) return '上' + type;
  return names[pos - 1] + type;
}

// ファイルに書き込む
fs.writeFileSync(dataPath, JSON.stringify(updatedData, null, 2), 'utf8');

console.log(`4卦を完成させました: ${newNarratives.length}件`);