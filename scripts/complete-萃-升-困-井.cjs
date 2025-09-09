const fs = require('fs');
const path = require('path');

// データファイルのパス
const dataPath = path.join(__dirname, '../public/data/narratives_chain.v1.json');

// 既存データを読み込む
const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 次の4卦のナラティブを作成
const hexagrams = [
  { name: '沢地萃', position: 45 },
  { name: '地風升', position: 46 },
  { name: '沢水困', position: 47 },
  { name: '水風井', position: 48 }
];

const newNarratives = [];

// 沢地萃（45）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、共通の目的のもとに人々が集まり始めます。続いて、協力体制が整い、大きな力となっていきます。最後に、集団の力で偉大な成果を実現し、歴史に名を残します。突破口は、個の力を超えた集団の力です。",
      tone: "story",
      suitability: "集団形成、チームビルディング、協力体制、大規模プロジェクト",
      caution: "群衆心理に流されず、個人の判断力も保つ",
      label: "JJJ",
      start: { hex: "沢地萃", pos: line },
      final: { hex: "沢地萃", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、志を同じくする仲間を見つけ、結束を固めます。続いて、組織を拡大し、影響力を増していきます。最後に、新たな視点から組織を再編し、より効果的な集団となります。突破口は、質の高い集まりの形成です。",
      tone: "story",
      suitability: "組織拡大、影響力向上、ネットワーク構築、コミュニティ形成",
      caution: "量的拡大に偏らず、質も重視する",
      label: "JJH",
      start: { hex: "沢地萃", pos: line },
      final: { hex: "沢地萃", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、人々の心を一つにまとめ、共通のビジョンを掲げます。続いて、実践を通じて結束を強め、信頼関係を築きます。最後に、より深い一体感を実現し、強固な集団となります。突破口は、心の結束です。",
      tone: "story",
      suitability: "ビジョン共有、結束強化、信頼構築、一体感醸成",
      caution: "同調圧力を避け、多様性も尊重する",
      label: "JHJ",
      start: { hex: "沢地萃", pos: line },
      final: { hex: "沢地萃", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、カリスマ的リーダーシップで人々を引きつけます。続いて、組織を効率的に運営し、成果を上げます。最後に、持続可能な体制を確立し、長期的な繁栄を実現します。突破口は、求心力のあるリーダーシップです。",
      tone: "story",
      suitability: "リーダーシップ、組織運営、カリスマ性、持続的繁栄",
      caution: "個人崇拝に陥らず、組織の健全性を保つ",
      label: "JHH",
      start: { hex: "沢地萃", pos: line },
      final: { hex: "沢地萃", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しい形の集まりを創造し、従来の枠を超えます。続いて、その革新性が注目を集め、多くの人を惹きつけます。最後に、新時代のコミュニティモデルとなり、社会を変革します。突破口は、革新的な集団の形です。",
      tone: "story",
      suitability: "新しいコミュニティ、革新的組織、社会変革、パラダイムシフト",
      caution: "実験的すぎて現実離れしない",
      label: "HJJ",
      start: { hex: "沢地萃", pos: line },
      final: { hex: "沢地萃", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、集団のあり方を見直し、より良い形を模索します。続いて、メンバーの役割を最適化し、効率を高めます。最後に、再び全体を調整し、理想的な集団を実現します。突破口は、集団の継続的最適化です。",
      tone: "story",
      suitability: "組織改革、役割最適化、効率向上、理想的組織",
      caution: "機械的にならず、人間性も大切にする",
      label: "HJH",
      start: { hex: "沢地萃", pos: line },
      final: { hex: "沢地萃", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな集まりから始め、徐々に規模を拡大します。続いて、組織が成長し、影響力が増大していきます。最後に、大きなムーブメントとなり、社会に変化をもたらします。突破口は、草の根からの成長です。",
      tone: "story",
      suitability: "草の根運動、段階的成長、ムーブメント、社会変化",
      caution: "拡大を急ぎすぎず、基盤を固める",
      label: "HHJ",
      start: { hex: "沢地萃", pos: line },
      final: { hex: "沢地萃", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、自然な形で人が集まり、有機的な関係を築きます。続いて、緩やかなつながりを保ちながら、協力します。最後に、柔軟で適応的な集団として、持続的に発展します。突破口は、自然発生的な集まりの力です。",
      tone: "story",
      suitability: "有機的組織、緩やかなネットワーク、自然な協力、持続的発展",
      caution: "組織化を急がず、自然な流れを大切にする",
      label: "HHH",
      start: { hex: "沢地萃", pos: line },
      final: { hex: "沢地萃", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 地風升（46）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、地道な努力を重ね、着実に上昇を始めます。続いて、その努力が実を結び、確実に高みへと登っていきます。最後に、頂点に到達し、努力が報われる喜びを味わいます。突破口は、一歩一歩の着実な前進です。",
      tone: "story",
      suitability: "着実な成長、地道な努力、段階的上昇、目標達成",
      caution: "急ぎすぎて基礎を疎かにしない",
      label: "JJJ",
      start: { hex: "地風升", pos: line },
      final: { hex: "地風升", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、謙虚な姿勢で学び、実力を蓄えます。続いて、その実力が認められ、昇進の機会を得ます。最後に、新たな立場から全体を見渡し、更なる成長を目指します。突破口は、謙虚さと実力の両立です。",
      tone: "story",
      suitability: "実力向上、昇進、キャリアアップ、謙虚な成長",
      caution: "驕らず、常に学ぶ姿勢を保つ",
      label: "JJH",
      start: { hex: "地風升", pos: line },
      final: { hex: "地風升", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、内面を磨き、人格を高めます。続いて、その成長が外面にも現れ、周囲から尊敬されます。最後に、より高い精神性に到達し、人々を導く存在となります。突破口は、内面からの成長です。",
      tone: "story",
      suitability: "人格向上、精神的成長、内面の充実、指導者への道",
      caution: "精神論に偏らず、現実的な成果も重視する",
      label: "JHJ",
      start: { hex: "地風升", pos: line },
      final: { hex: "地風升", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、明確な目標を設定し、計画的に上昇を図ります。続いて、マイルストーンを達成しながら、着実に前進します。最後に、計画通りに頂点に到達し、次なる目標を設定します。突破口は、計画的な上昇戦略です。",
      tone: "story",
      suitability: "計画的成長、目標管理、戦略的上昇、継続的発展",
      caution: "計画に固執せず、柔軟に修正する",
      label: "JHH",
      start: { hex: "地風升", pos: line },
      final: { hex: "地風升", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既存の上昇パターンを打ち破り、新しい道を切り開きます。続いて、革新的な方法で急速に上昇し、注目を集めます。最後に、新たな高みに到達し、後続の道を示します。突破口は、常識を超えた上昇法です。",
      tone: "story",
      suitability: "革新的成長、急速上昇、ブレークスルー、先駆的成功",
      caution: "基盤が脆弱にならないよう注意する",
      label: "HJJ",
      start: { hex: "地風升", pos: line },
      final: { hex: "地風升", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、上昇の方法を見直し、より効率的な道を探ります。続いて、最適化された方法で上昇し、エネルギーを節約します。最後に、再び改善を加え、理想的な上昇を実現します。突破口は、効率的な上昇の追求です。",
      tone: "story",
      suitability: "効率的成長、最適化、エネルギー管理、スマートな上昇",
      caution: "効率ばかり追求せず、確実性も重視する",
      label: "HJH",
      start: { hex: "地風升", pos: line },
      final: { hex: "地風升", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな一歩から始め、確実に高度を上げます。続いて、着実な積み重ねが大きな上昇となります。最後に、気づけば高い位置に到達し、広い視野を獲得します。突破口は、小さな積み重ねの力です。",
      tone: "story",
      suitability: "漸進的成長、着実な積み重ね、長期的上昇、確実な成功",
      caution: "進歩の遅さに焦らない",
      label: "HHJ",
      start: { hex: "地風升", pos: line },
      final: { hex: "地風升", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、自然な成長リズムを見つけ、無理なく上昇します。続いて、そのリズムを保ちながら、持続的に成長します。最後に、自然体で高みに到達し、安定した成功を維持します。突破口は、自然な成長の法則です。",
      tone: "story",
      suitability: "自然な成長、持続可能な上昇、安定的発展、無理のない成功",
      caution: "成長速度が遅くても焦らない",
      label: "HHH",
      start: { hex: "地風升", pos: line },
      final: { hex: "地風升", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 沢水困（47）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、困窮した状況に陥り、身動きが取れなくなります。続いて、その中でも希望を失わず、解決策を模索します。最後に、困難を乗り越え、より強くなって復活します。突破口は、絶望しない精神力です。",
      tone: "story",
      suitability: "困難克服、窮地脱出、精神力、復活",
      caution: "自暴自棄にならず、冷静さを保つ",
      label: "JJJ",
      start: { hex: "沢水困", pos: line },
      final: { hex: "沢水困", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、資源が枯渇し、厳しい状況に直面します。続いて、限られた資源を最大限活用し、生き延びます。最後に、新たな資源を発見し、困窮から脱出します。突破口は、創意工夫による資源活用です。",
      tone: "story",
      suitability: "資源管理、サバイバル、創意工夫、新資源発見",
      caution: "諦めが早くならず、可能性を探り続ける",
      label: "JJH",
      start: { hex: "沢水困", pos: line },
      final: { hex: "沢水困", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、孤立無援の状態に置かれ、試練に直面します。続いて、自己の内なる力を発見し、自立します。最後に、より深い自己理解に到達し、真の強さを獲得します。突破口は、困窮が与える内的成長です。",
      tone: "story",
      suitability: "自立、内的強さ、自己発見、精神的成長",
      caution: "孤立を選ばず、必要な助けは求める",
      label: "JHJ",
      start: { hex: "沢水困", pos: line },
      final: { hex: "沢水困", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、極限状態に追い込まれ、真価が問われます。続いて、潜在能力を発揮し、不可能を可能にします。最後に、困難を完全に克服し、伝説的な成功を収めます。突破口は、極限が引き出す潜在力です。",
      tone: "story",
      suitability: "極限突破、潜在能力、不可能への挑戦、伝説的成功",
      caution: "無理をしすぎて心身を壊さない",
      label: "JHH",
      start: { hex: "沢水困", pos: line },
      final: { hex: "沢水困", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、従来の方法では脱出できない困窮に直面します。続いて、創造的な発想で新たな道を見出します。最後に、革新的な解決により、困窮を機会に変えます。突破口は、逆境での創造性です。",
      tone: "story",
      suitability: "創造的解決、イノベーション、逆転の発想、機会創出",
      caution: "現実離れした解決策に頼らない",
      label: "HJJ",
      start: { hex: "沢水困", pos: line },
      final: { hex: "沢水困", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、困窮への対処法を見直し、より効果的な方法を探ります。続いて、改善された方法で対処し、状況を緩和します。最後に、再び最適化を図り、困窮を最小化します。突破口は、困窮管理の継続的改善です。",
      tone: "story",
      suitability: "危機管理、対処法改善、状況緩和、リスク最小化",
      caution: "対症療法に終わらず、根本解決も目指す",
      label: "HJH",
      start: { hex: "沢水困", pos: line },
      final: { hex: "沢水困", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな困難から対処し、経験を積みます。続いて、より大きな困窮にも対応できる力を養います。最後に、どんな困難も恐れない境地に到達します。突破口は、段階的な困難対処能力の向上です。",
      tone: "story",
      suitability: "段階的成長、経験蓄積、対処能力向上、困難への免疫",
      caution: "困難を求めすぎず、平穏も大切にする",
      label: "HHJ",
      start: { hex: "沢水困", pos: line },
      final: { hex: "沢水困", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、困窮を人生の一部として受け入れます。続いて、困難と共存しながら、日々を過ごします。最後に、困窮が気にならない境地に到達し、心の平安を得ます。突破口は、困窮との和解です。",
      tone: "story",
      suitability: "受容、共存、心の平安、超越的視点",
      caution: "諦観に陥らず、改善努力は続ける",
      label: "HHH",
      start: { hex: "沢水困", pos: line },
      final: { hex: "沢水困", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 水風井（48）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、深い井戸を掘り、清らかな水源を見つけます。続いて、その水を汲み上げ、多くの人々に分け与えます。最後に、枯れることのない恵みの源となり、永続的な価値を提供します。突破口は、深く掘ることで得られる本質的価値です。",
      tone: "story",
      suitability: "本質追求、価値創造、永続的貢献、深い知恵",
      caution: "深さばかり追求せず、実用性も考慮する",
      label: "JJJ",
      start: { hex: "水風井", pos: line },
      final: { hex: "水風井", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既存の井戸を整備し、水質を改善します。続いて、アクセスを良くし、より多くの人が利用できるようにします。最後に、新たな活用法を見出し、井戸の価値を最大化します。突破口は、既存資源の価値向上です。",
      tone: "story",
      suitability: "資源活用、改善、アクセシビリティ、価値最大化",
      caution: "改良に夢中になり、本来の良さを損なわない",
      label: "JJH",
      start: { hex: "水風井", pos: line },
      final: { hex: "水風井", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、内なる泉を発見し、自己の源泉に触れます。続いて、その泉から湧き出る知恵や創造性を活用します。最後に、より深い源泉に到達し、無尽蔵の豊かさを実現します。突破口は、内なる無限の可能性です。",
      tone: "story",
      suitability: "内的資源、創造性、自己発見、無限の可能性",
      caution: "内向きになりすぎず、外部とも交流する",
      label: "JHJ",
      start: { hex: "水風井", pos: line },
      final: { hex: "水風井", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、共同で井戸を管理し、公平に水を分配します。続いて、井戸を中心としたコミュニティが形成されます。最後に、持続可能な共同体として、長期的に繁栄します。突破口は、共有資源の賢明な管理です。",
      tone: "story",
      suitability: "共同管理、コミュニティ、公平性、持続可能性",
      caution: "独占や不公平が生じないよう注意する",
      label: "JHH",
      start: { hex: "水風井", pos: line },
      final: { hex: "水風井", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しいタイプの井戸を開発し、従来の限界を超えます。続いて、その革新的な方法が広まり、多くの地域で採用されます。最後に、水問題の根本的解決に貢献し、社会を変革します。突破口は、革新的な資源開発です。",
      tone: "story",
      suitability: "技術革新、問題解決、社会貢献、パラダイムシフト",
      caution: "技術に頼りすぎず、自然との調和も保つ",
      label: "HJJ",
      start: { hex: "水風井", pos: line },
      final: { hex: "水風井", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、井戸の維持管理方法を見直し、効率化を図ります。続いて、定期的なメンテナンスで、常に良質な水を確保します。最後に、再び改善を加え、完璧な井戸システムを構築します。突破口は、継続的な品質管理です。",
      tone: "story",
      suitability: "品質管理、メンテナンス、効率化、システム構築",
      caution: "管理に固執せず、自然な流れも大切にする",
      label: "HJH",
      start: { hex: "水風井", pos: line },
      final: { hex: "水風井", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな井戸から始め、徐々に深く掘り進めます。続いて、豊富な水脈に到達し、安定した水源を確保します。最後に、その井戸が地域の生命線となり、多くの人々を支えます。突破口は、着実な深化による確実な成果です。",
      tone: "story",
      suitability: "段階的深化、着実な開発、地域貢献、生命線構築",
      caution: "深さを追求しすぎて、実用性を失わない",
      label: "HHJ",
      start: { hex: "水風井", pos: line },
      final: { hex: "水風井", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、井戸の水が自然に湧き出ることを理解します。続いて、その自然な流れを妨げず、適切に活用します。最後に、井戸と人々の調和が実現し、豊かな生活が営まれます。突破口は、自然との共生です。",
      tone: "story",
      suitability: "自然との調和、持続可能な利用、共生、豊かな生活",
      caution: "過度な採取により、枯渇させない",
      label: "HHH",
      start: { hex: "水風井", pos: line },
      final: { hex: "水風井", pos: line },
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
    '沢地萃': [0,0,0,0,1,0],   // 沢地萃（45）兌上坤下
    '地風升': [0,1,1,0,0,0],   // 地風升（46）坤上巽下
    '沢水困': [0,1,0,1,1,0],   // 沢水困（47）兌上坎下
    '水風井': [0,1,1,0,1,0]    // 水風井（48）坎上巽下
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