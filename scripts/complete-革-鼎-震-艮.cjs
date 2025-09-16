const fs = require('fs');
const path = require('path');

// データファイルのパス
const dataPath = path.join(__dirname, '../public/data/narratives_chain.v1.json');

// 既存データを読み込む
const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 次の4卦のナラティブを作成
const hexagrams = [
  { name: '沢火革', position: 49 },
  { name: '火風鼎', position: 50 },
  { name: '震為雷', position: 51 },
  { name: '艮為山', position: 52 }
];

const newNarratives = [];

// 沢火革（49）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、変革の必要性を認識し、改革の準備を始めます。続いて、古いものを捨て、新しいものを取り入れていきます。最後に、完全な変革を実現し、新たな時代を切り開きます。突破口は、変化を恐れない勇気です。",
      tone: "story",
      suitability: "革命、変革、改革、パラダイムシフト",
      caution: "急激すぎる変化により混乱を招かない",
      label: "JJJ",
      start: { hex: "沢火革", pos: line },
      final: { hex: "沢火革", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既存システムの問題点を明確にし、改革案を立案します。続いて、段階的に変革を実施し、効果を確認します。最後に、新たな視点から全体を見直し、更なる革新を進めます。突破口は、計画的な変革プロセスです。",
      tone: "story",
      suitability: "システム改革、段階的変革、計画的革新、継続的改善",
      caution: "理想に走りすぎず、現実的に進める",
      label: "JJH",
      start: { hex: "沢火革", pos: line },
      final: { hex: "沢火革", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、内なる変革から始め、自己を革新します。続いて、その変化が周囲に影響を与え、環境も変わり始めます。最後に、より深い次元での変革を実現し、本質的な転換を遂げます。突破口は、内から外への変革の波及です。",
      tone: "story",
      suitability: "自己変革、内的革新、影響力、本質的転換",
      caution: "自己変革に夢中になり、周囲を置き去りにしない",
      label: "JHJ",
      start: { hex: "沢火革", pos: line },
      final: { hex: "沢火革", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、革命的なビジョンを掲げ、人々を鼓舞します。続いて、その理想を実現するため、組織的に行動します。最後に、社会全体を変革し、歴史に名を残します。突破口は、ビジョンの力です。",
      tone: "story",
      suitability: "社会変革、ビジョン実現、歴史的転換、革命的成果",
      caution: "理想主義に陥らず、実現可能性も考慮する",
      label: "JHH",
      start: { hex: "沢火革", pos: line },
      final: { hex: "沢火革", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、従来の常識を疑い、新しい可能性を探ります。続いて、破壊的イノベーションにより、市場を一変させます。最後に、新たな秩序を確立し、時代の先導者となります。突破口は、創造的破壊の実践です。",
      tone: "story",
      suitability: "破壊的イノベーション、市場変革、新秩序確立、時代創造",
      caution: "破壊が目的化しないよう注意する",
      label: "HJJ",
      start: { hex: "沢火革", pos: line },
      final: { hex: "沢火革", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、変革の方法を見直し、より効果的なアプローチを探ります。続いて、改善された方法で変革を進め、抵抗を最小化します。最後に、再び調整を加え、スムーズな変革を実現します。突破口は、変革プロセスの最適化です。",
      tone: "story",
      suitability: "変革管理、プロセス改善、抵抗軽減、スムーズな移行",
      caution: "プロセスに固執せず、結果も重視する",
      label: "HJH",
      start: { hex: "沢火革", pos: line },
      final: { hex: "沢火革", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな変化から始め、徐々に変革を広げていきます。続いて、成功体験を積み重ね、変革への抵抗を減らします。最後に、大きな変革を実現し、全体が生まれ変わります。突破口は、段階的変革による確実な成功です。",
      tone: "story",
      suitability: "段階的変革、漸進的改革、抵抗管理、確実な転換",
      caution: "変化が遅すぎて機会を逃さない",
      label: "HHJ",
      start: { hex: "沢火革", pos: line },
      final: { hex: "沢火革", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、変化を自然な流れとして受け入れます。続いて、その流れに乗りながら、適切に対応します。最後に、変化と安定のバランスを保ち、持続的な発展を実現します。突破口は、変化との調和です。",
      tone: "story",
      suitability: "変化適応、流動的対応、バランス維持、持続的発展",
      caution: "流されるだけでなく、主体性も保つ",
      label: "HHH",
      start: { hex: "沢火革", pos: line },
      final: { hex: "沢火革", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 火風鼎（50）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、新しい器を用意し、変革の成果を受け入れる準備をします。続いて、その器に価値あるものを満たし、育てていきます。最後に、豊かな実りを得て、多くの人々に恩恵をもたらします。突破口は、新しい価値を育む器の創造です。",
      tone: "story",
      suitability: "新体制構築、価値創造、育成、豊かな成果",
      caution: "器ばかり立派で中身が伴わないことを避ける",
      label: "JJJ",
      start: { hex: "火風鼎", pos: line },
      final: { hex: "火風鼎", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、古い鼎を修復し、新たな用途に活用します。続いて、伝統と革新を融合させ、独自の価値を創造します。最後に、新たな文化として定着し、後世に継承されます。突破口は、温故知新の実践です。",
      tone: "story",
      suitability: "伝統活用、文化創造、継承と革新、価値再生",
      caution: "形式にとらわれず、本質を重視する",
      label: "JJH",
      start: { hex: "火風鼎", pos: line },
      final: { hex: "火風鼎", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、神聖な儀式として物事を始め、敬意を持って取り組みます。続いて、日常の実践を通じて、その価値を体現します。最後に、より高い次元での統合を実現し、精神的な充実を得ます。突破口は、日常と神聖の統合です。",
      tone: "story",
      suitability: "儀式的開始、価値体現、精神性、高次の統合",
      caution: "形式主義に陥らず、実質も伴わせる",
      label: "JHJ",
      start: { hex: "火風鼎", pos: line },
      final: { hex: "火風鼎", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、豊かな資源を集め、大きな事業の準備をします。続いて、それらを効果的に活用し、価値を生み出します。最後に、持続可能な仕組みを確立し、永続的な繁栄を実現します。突破口は、資源の賢明な活用です。",
      tone: "story",
      suitability: "資源活用、大事業、価値創出、持続的繁栄",
      caution: "贅沢に流れず、本来の目的を忘れない",
      label: "JHH",
      start: { hex: "火風鼎", pos: line },
      final: { hex: "火風鼎", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しい容器、新しい方法で価値を創造します。続いて、その革新性が認められ、広く採用されます。最後に、新たなスタンダードとなり、時代を変えます。突破口は、形式の革新による内容の革新です。",
      tone: "story",
      suitability: "形式革新、新スタンダード、時代変革、価値革命",
      caution: "新しさだけを追求せず、実用性も考慮する",
      label: "HJJ",
      start: { hex: "火風鼎", pos: line },
      final: { hex: "火風鼎", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、器の使い方を見直し、より効果的な活用法を探ります。続いて、改善された方法で実践し、成果を確認します。最後に、再び最適化を図り、理想的な活用を実現します。突破口は、器の可能性を最大限に引き出すことです。",
      tone: "story",
      suitability: "活用法改善、効果的実践、最適化、可能性最大化",
      caution: "技巧に走りすぎず、素朴さも大切にする",
      label: "HJH",
      start: { hex: "火風鼎", pos: line },
      final: { hex: "火風鼎", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな器から始め、丁寧に価値を育てます。続いて、その成功を基に、より大きな器へと発展させます。最後に、壮大な器となり、社会全体に貢献します。突破口は、小から大への着実な成長です。",
      tone: "story",
      suitability: "段階的成長、着実な発展、社会貢献、スケールアップ",
      caution: "拡大を急ぎすぎて質を落とさない",
      label: "HHJ",
      start: { hex: "火風鼎", pos: line },
      final: { hex: "火風鼎", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、器と中身の調和を重視し、バランスを整えます。続いて、自然な形で価値が熟成し、豊かさが増します。最後に、完璧な調和が実現し、理想的な状態を維持します。突破口は、形と内容の完全な一致です。",
      tone: "story",
      suitability: "調和実現、バランス、自然な熟成、理想状態",
      caution: "完璧を求めすぎて、実行が遅れない",
      label: "HHH",
      start: { hex: "火風鼎", pos: line },
      final: { hex: "火風鼎", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 震為雷（51）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、突然の衝撃により、現状が激しく揺さぶられます。続いて、その動揺を乗り越え、新たな行動を起こします。最後に、震動が収まり、より強固な基盤を確立します。突破口は、衝撃を成長の契機とすることです。",
      tone: "story",
      suitability: "衝撃的変化、覚醒、行動開始、基盤強化",
      caution: "パニックに陥らず、冷静さを保つ",
      label: "JJJ",
      start: { hex: "震為雷", pos: line },
      final: { hex: "震為雷", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、雷鳴のような警告を受け、危機感を持ちます。続いて、迅速に対応し、被害を最小限に抑えます。最後に、新たな視点から教訓を得て、防災体制を強化します。突破口は、警告を真摯に受け止めることです。",
      tone: "story",
      suitability: "危機対応、警告認識、迅速行動、防災強化",
      caution: "過剰反応せず、適切に対処する",
      label: "JJH",
      start: { hex: "震為雷", pos: line },
      final: { hex: "震為雷", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、内なる衝動により、行動を起こす決意をします。続いて、その勢いを調整しながら、着実に前進します。最後に、より大きな推進力を得て、目標を達成します。突破口は、内なる雷鳴に従うことです。",
      tone: "story",
      suitability: "内的衝動、決意、推進力、目標達成",
      caution: "衝動的になりすぎず、計画性も持つ",
      label: "JHJ",
      start: { hex: "震為雷", pos: line },
      final: { hex: "震為雷", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、強烈なエネルギーを発し、周囲を動かします。続いて、その影響力を管理し、建設的に活用します。最後に、持続的な動力源となり、継続的な成果を生み出します。突破口は、爆発的エネルギーの制御です。",
      tone: "story",
      suitability: "影響力発揮、エネルギー管理、動力源、継続的成果",
      caution: "エネルギーの暴走を防ぐ",
      label: "JHH",
      start: { hex: "震為雷", pos: line },
      final: { hex: "震為雷", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、革新的な衝撃により、既存の枠組みを打ち破ります。続いて、その破壊から新たな創造が生まれます。最後に、画期的な成果を実現し、時代を変えます。突破口は、破壊的創造の実践です。",
      tone: "story",
      suitability: "革新的衝撃、破壊的創造、画期的成果、時代変革",
      caution: "破壊が目的にならないよう注意する",
      label: "HJJ",
      start: { hex: "震為雷", pos: line },
      final: { hex: "震為雷", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、震動への対処法を見直し、より効果的な方法を探ります。続いて、改善された方法で対応し、影響を最小化します。最後に、再び最適化を図り、震動を力に変えます。突破口は、震動エネルギーの有効活用です。",
      tone: "story",
      suitability: "対処法改善、影響最小化、エネルギー転換、有効活用",
      caution: "技術に頼りすぎず、基本も大切にする",
      label: "HJH",
      start: { hex: "震為雷", pos: line },
      final: { hex: "震為雷", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな振動から始め、徐々に大きな動きへと発展させます。続いて、リズムを掴み、効率的に力を発揮します。最後に、大きな震動を起こし、世界を変える力となります。突破口は、小さな始まりから大きな変化への成長です。",
      tone: "story",
      suitability: "段階的発展、リズム確立、効率的力、世界変革",
      caution: "急激な拡大により制御を失わない",
      label: "HHJ",
      start: { hex: "震為雷", pos: line },
      final: { hex: "震為雷", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、自然な震動のリズムを理解し、それに同調します。続いて、そのリズムを活かして、効果的に行動します。最後に、震動と静寂のバランスを保ち、調和の取れた状態を実現します。突破口は、動と静の調和です。",
      tone: "story",
      suitability: "リズム理解、同調、効果的行動、動静調和",
      caution: "リズムに縛られず、柔軟性も保つ",
      label: "HHH",
      start: { hex: "震為雷", pos: line },
      final: { hex: "震為雷", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 艮為山（52）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、動きを止めて静止し、現状を深く観察します。続いて、その静寂の中で内省を深め、本質を理解します。最後に、不動の境地に到達し、どんな状況でも動じない強さを獲得します。突破口は、止まることで見えてくる真実です。",
      tone: "story",
      suitability: "静止、内省、本質理解、不動心",
      caution: "停滞と静止を混同しない",
      label: "JJJ",
      start: { hex: "艮為山", pos: line },
      final: { hex: "艮為山", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、適切なタイミングで行動を止め、状況を見極めます。続いて、冷静な判断により、最善の選択をします。最後に、新たな視点から再スタートを切り、より良い結果を得ます。突破口は、止まる勇気です。",
      tone: "story",
      suitability: "タイミング判断、冷静な選択、再スタート、最善の結果",
      caution: "止まりすぎて機会を逃さない",
      label: "JJH",
      start: { hex: "艮為山", pos: line },
      final: { hex: "艮為山", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、山のように堂々と構え、揺るぎない姿勢を保ちます。続いて、その安定感が周囲に安心を与え、信頼を集めます。最後に、より深い安定を実現し、永続的な基盤を築きます。突破口は、内なる山の確立です。",
      tone: "story",
      suitability: "安定性、信頼構築、堅固な基盤、永続性",
      caution: "頑固になりすぎず、必要な柔軟性は保つ",
      label: "JHJ",
      start: { hex: "艮為山", pos: line },
      final: { hex: "艮為山", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、確固たる意志を持って、動かざること山の如しの境地を保ちます。続いて、その不動の姿勢が大きな成果を生みます。最後に、揺るぎない成功を確立し、歴史に名を刻みます。突破口は、不動の意志の力です。",
      tone: "story",
      suitability: "強固な意志、不動の姿勢、大成功、歴史的偉業",
      caution: "柔軟性を完全に失わない",
      label: "JHH",
      start: { hex: "艮為山", pos: line },
      final: { hex: "艮為山", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しい形の安定を追求し、従来の固定観念を超えます。続いて、動的平衡という革新的な安定を実現します。最後に、変化の中での不変という高次の境地に到達します。突破口は、動中の静の発見です。",
      tone: "story",
      suitability: "動的平衡、革新的安定、高次の不変、新しい安定概念",
      caution: "理論に偏らず、実践も重視する",
      label: "HJJ",
      start: { hex: "艮為山", pos: line },
      final: { hex: "艮為山", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、止まり方を見直し、より効果的な静止を探ります。続いて、改善された方法で実践し、成果を確認します。最後に、再び調整を加え、完璧な静と動のバランスを実現します。突破口は、静止の質の向上です。",
      tone: "story",
      suitability: "静止法改善、効果的実践、バランス調整、質的向上",
      caution: "形式にとらわれず、本質を追求する",
      label: "HJH",
      start: { hex: "艮為山", pos: line },
      final: { hex: "艮為山", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな停止から始め、止まることの価値を学びます。続いて、より長い静止を保ち、深い洞察を得ます。最後に、完全な静寂の中で、究極の智慧に到達します。突破口は、段階的な静寂の深化です。",
      tone: "story",
      suitability: "段階的学習、洞察獲得、智慧到達、静寂の深化",
      caution: "世俗から離れすぎない",
      label: "HHJ",
      start: { hex: "艮為山", pos: line },
      final: { hex: "艮為山", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、自然な静止のリズムを見つけ、それに従います。続いて、動と静の自然な交替を体得します。最後に、すべての動きの中に静けさを、静けさの中に動きを見出します。突破口は、動静一如の境地です。",
      tone: "story",
      suitability: "自然なリズム、動静の調和、一如の境地、円熟",
      caution: "理想論に終わらず、日常に活かす",
      label: "HHH",
      start: { hex: "艮為山", pos: line },
      final: { hex: "艮為山", pos: line },
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
    '沢火革': [1,0,1,1,1,0],   // 沢火革（49）兌上離下
    '火風鼎': [1,1,1,0,1,1],   // 火風鼎（50）離上巽下
    '震為雷': [0,0,1,0,0,1],   // 震為雷（51）震上震下
    '艮為山': [1,0,0,1,0,0]    // 艮為山（52）艮上艮下
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