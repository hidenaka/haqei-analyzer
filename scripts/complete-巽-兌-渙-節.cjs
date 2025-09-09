const fs = require('fs');
const path = require('path');

// データファイルのパス
const dataPath = path.join(__dirname, '../public/data/narratives_chain.v1.json');

// 既存データを読み込む
const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 次の4卦のナラティブを作成
const hexagrams = [
  { name: '巽為風', position: 57 },
  { name: '兌為沢', position: 58 },
  { name: '風水渙', position: 59 },
  { name: '水沢節', position: 60 }
];

const newNarratives = [];

// 巽為風（57）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、風のように柔軟に状況に入り込み、細部まで浸透していきます。続いて、その柔らかな力で徐々に変化をもたらし、抵抗なく目的を達成します。最後に、自然な流れとして定着し、持続的な影響を与え続けます。突破口は、柔軟な浸透力です。",
      tone: "story",
      suitability: "柔軟な対応、浸透力、穏やかな変化、持続的影響",
      caution: "優柔不断にならず、必要な時は決断する",
      label: "JJJ",
      start: { hex: "巽為風", pos: line },
      final: { hex: "巽為風", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、謙虚に従い、指示や助言を素直に受け入れます。続いて、その従順さが信頼を生み、より重要な役割を任されます。最後に、新たな視点から自立し、自らが導く立場となります。突破口は、従うことから学ぶ智慧です。",
      tone: "story",
      suitability: "素直な学び、信頼獲得、成長、リーダーシップへの道",
      caution: "盲従せず、自分の判断力も養う",
      label: "JJH",
      start: { hex: "巽為風", pos: line },
      final: { hex: "巽為風", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、風のように自在に動き、あらゆる隙間に入り込みます。続いて、状況に応じて形を変え、最適な対応をします。最後に、より深い理解に基づいて、本質的な変化を実現します。突破口は、無形の力の活用です。",
      tone: "story",
      suitability: "適応力、柔軟性、本質的変化、無形の影響力",
      caution: "形がないことで、存在感が薄くならない",
      label: "JHJ",
      start: { hex: "巽為風", pos: line },
      final: { hex: "巽為風", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、繰り返し働きかけ、少しずつ浸透させていきます。続いて、その継続的な努力が実を結び、確実な成果を上げます。最後に、完全に浸透し、根本的な変化を実現します。突破口は、継続的な働きかけの力です。",
      tone: "story",
      suitability: "継続的努力、着実な浸透、根本的変化、確実な成果",
      caution: "しつこくなりすぎて、反発を招かない",
      label: "JHH",
      start: { hex: "巽為風", pos: line },
      final: { hex: "巽為風", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しい風を吹かせ、停滞した空気を一新します。続いて、その新鮮な風が活力を生み、創造的な変化をもたらします。最後に、革新的な流れが定着し、新時代を切り開きます。突破口は、新しい風の創造です。",
      tone: "story",
      suitability: "革新、活性化、創造的変化、新時代開拓",
      caution: "急激な変化により、混乱を生じさせない",
      label: "HJJ",
      start: { hex: "巽為風", pos: line },
      final: { hex: "巽為風", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、風の吹き方を調整し、より効果的な影響を与えます。続いて、状況に応じて強弱を変え、最適な結果を得ます。最後に、再び微調整を加え、完璧な風の流れを作ります。突破口は、風の制御技術です。",
      tone: "story",
      suitability: "影響力調整、最適化、微調整、完璧な制御",
      caution: "制御しすぎて、自然さを失わない",
      label: "HJH",
      start: { hex: "巽為風", pos: line },
      final: { hex: "巽為風", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、そよ風から始め、穏やかに働きかけます。続いて、徐々に風を強め、影響力を拡大していきます。最後に、強風となって大きな変化を起こし、世界を変えます。突破口は、小さな風から大きな変化への成長です。",
      tone: "story",
      suitability: "段階的影響、影響力拡大、大変革、世界を変える力",
      caution: "破壊的にならず、建設的な変化を目指す",
      label: "HHJ",
      start: { hex: "巽為風", pos: line },
      final: { hex: "巽為風", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、自然な風の流れを理解し、それに従います。続いて、風と一体となり、effortlessに動きます。最後に、風そのものとなり、自在に世界を巡ります。突破口は、風との完全な一体化です。",
      tone: "story",
      suitability: "自然との調和、effortless action、自在性、完全な自由",
      caution: "現実から遊離せず、地に足をつける",
      label: "HHH",
      start: { hex: "巽為風", pos: line },
      final: { hex: "巽為風", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 兌為沢（58）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、純粋な喜びが湧き上がり、心が軽やかになります。続いて、その喜びを他者と分かち合い、幸せが広がっていきます。最後に、深い満足感と充実感に包まれ、人生の豊かさを実感します。突破口は、喜びの共有です。",
      tone: "story",
      suitability: "喜びの体験、幸せの共有、充実感、人生の豊かさ",
      caution: "表面的な楽しさに終わらず、深い喜びを追求する",
      label: "JJJ",
      start: { hex: "兌為沢", pos: line },
      final: { hex: "兌為沢", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、明るく朗らかな態度で人々と接し、好感を得ます。続いて、その親しみやすさが信頼関係を生み、深い絆を築きます。最後に、新たなレベルの交流を実現し、豊かな人間関係を享受します。突破口は、明るさがもたらす人間関係です。",
      tone: "story",
      suitability: "親しみやすさ、信頼構築、深い絆、豊かな関係",
      caution: "軽薄にならず、誠実さも保つ",
      label: "JJH",
      start: { hex: "兌為沢", pos: line },
      final: { hex: "兌為沢", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、心を開いて素直に交流し、真の対話を始めます。続いて、相互理解を深め、心の通い合いを実現します。最後に、より深い次元での共感を得て、魂のつながりを感じます。突破口は、開かれた心の交流です。",
      tone: "story",
      suitability: "素直な交流、相互理解、心の通い合い、魂のつながり",
      caution: "無防備になりすぎず、適切な境界も保つ",
      label: "JHJ",
      start: { hex: "兌為沢", pos: line },
      final: { hex: "兌為沢", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、説得力のある言葉で人々を魅了し、支持を集めます。続いて、その影響力を建設的に使い、良い変化をもたらします。最後に、多くの人々に喜びを与え、社会に貢献します。突破口は、言葉の力の善用です。",
      tone: "story",
      suitability: "説得力、影響力、建設的変化、社会貢献",
      caution: "言葉巧みに操作せず、真心を込める",
      label: "JHH",
      start: { hex: "兌為沢", pos: line },
      final: { hex: "兌為沢", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しい形の喜びを創造し、従来の楽しみ方を超えます。続いて、その革新的な喜びが広まり、多くの人を魅了します。最後に、新時代の幸せのモデルとなり、文化を変えます。突破口は、喜びの革新です。",
      tone: "story",
      suitability: "新しい喜び、革新的楽しみ、文化変革、時代創造",
      caution: "刺激的すぎて、本質的な喜びを見失わない",
      label: "HJJ",
      start: { hex: "兌為沢", pos: line },
      final: { hex: "兌為沢", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、喜びの表現方法を見直し、より適切な形を探ります。続いて、状況に応じて表現を調整し、最適な効果を得ます。最後に、再び改善を加え、完璧な喜びの表現を実現します。突破口は、喜びの表現の最適化です。",
      tone: "story",
      suitability: "表現改善、効果的コミュニケーション、最適化、完璧な表現",
      caution: "技巧に走りすぎず、自然な感情も大切にする",
      label: "HJH",
      start: { hex: "兌為沢", pos: line },
      final: { hex: "兌為沢", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな喜びから始め、日々の幸せを大切にします。続いて、その積み重ねが大きな幸福感となり、人生が充実します。最後に、溢れる喜びに包まれ、至福の境地に到達します。突破口は、日常の小さな喜びの積み重ねです。",
      tone: "story",
      suitability: "日常の幸せ、幸福の積み重ね、人生の充実、至福",
      caution: "快楽主義に陥らず、節度を保つ",
      label: "HHJ",
      start: { hex: "兌為沢", pos: line },
      final: { hex: "兌為沢", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、喜びと悲しみの両方を受け入れ、感情の全体性を理解します。続いて、すべての感情を人生の彩りとして味わいます。最後に、深い平安と共に、真の喜びを実現します。突破口は、感情の統合による成熟です。",
      tone: "story",
      suitability: "感情の統合、人生の味わい、深い平安、真の喜び",
      caution: "感情に振り回されず、中心を保つ",
      label: "HHH",
      start: { hex: "兌為沢", pos: line },
      final: { hex: "兌為沢", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 風水渙（59）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、凝り固まった状態が解きほぐされ、流動性が回復します。続いて、散らばったものが自然に再編成され、新しい秩序が生まれます。最後に、より柔軟で適応的な状態を実現し、変化に強い体質となります。突破口は、固執からの解放です。",
      tone: "story",
      suitability: "硬直打破、流動性回復、再編成、柔軟な体質",
      caution: "散漫になりすぎず、必要な統一性は保つ",
      label: "JJJ",
      start: { hex: "風水渙", pos: line },
      final: { hex: "風水渙", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、閉塞感を打破し、新鮮な空気を取り入れます。続いて、停滞していたエネルギーが流れ始め、活性化します。最後に、新たな視点から全体を見直し、革新的な展開を実現します。突破口は、停滞の打破です。",
      tone: "story",
      suitability: "閉塞打破、エネルギー活性化、革新的展開、新しい流れ",
      caution: "破壊的にならず、建設的な分散を心がける",
      label: "JJH",
      start: { hex: "風水渙", pos: line },
      final: { hex: "風水渙", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、執着を手放し、自由な状態を作ります。続いて、その自由さが創造性を生み、新しい可能性が開けます。最後に、より高い次元での統合を実現し、真の自由を獲得します。突破口は、執着からの解放による創造性です。",
      tone: "story",
      suitability: "執着解放、創造性、新可能性、真の自由",
      caution: "無秩序にならず、必要な規律は維持する",
      label: "JHJ",
      start: { hex: "風水渙", pos: line },
      final: { hex: "風水渙", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、集中していた力を分散させ、リスクを軽減します。続いて、分散された要素がそれぞれ成長し、多様な成果を生みます。最後に、それらを緩やかに統合し、豊かな全体を形成します。突破口は、分散による多様性の創出です。",
      tone: "story",
      suitability: "リスク分散、多様化、個別成長、緩やかな統合",
      caution: "分散しすぎて、力が弱まらないよう注意する",
      label: "JHH",
      start: { hex: "風水渙", pos: line },
      final: { hex: "風水渙", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既存の枠組みを解体し、新しい可能性を探ります。続いて、自由な発想で革新的な構造を創造します。最後に、それが新たなパラダイムとなり、時代を変えます。突破口は、解体と創造のサイクルです。",
      tone: "story",
      suitability: "枠組み解体、革新的創造、パラダイムシフト、時代変革",
      caution: "破壊が目的化せず、建設的な結果を目指す",
      label: "HJJ",
      start: { hex: "風水渙", pos: line },
      final: { hex: "風水渙", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、分散の方法を見直し、より効果的な形を探ります。続いて、最適化された分散により、効率を高めます。最後に、再び調整を加え、理想的な分散と統合のバランスを実現します。突破口は、分散の戦略的管理です。",
      tone: "story",
      suitability: "戦略的分散、効率向上、バランス調整、最適管理",
      caution: "管理しすぎて、自然な流れを妨げない",
      label: "HJH",
      start: { hex: "風水渙", pos: line },
      final: { hex: "風水渙", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな解放から始め、徐々に自由度を高めます。続いて、その自由が創造性を生み、新しい価値を創出します。最後に、完全な自由を実現し、無限の可能性を手に入れます。突破口は、段階的な解放による成長です。",
      tone: "story",
      suitability: "段階的解放、自由度向上、価値創出、無限の可能性",
      caution: "自由になりすぎて、責任を忘れない",
      label: "HHJ",
      start: { hex: "風水渙", pos: line },
      final: { hex: "風水渙", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、自然な分散と集合のリズムを理解します。続いて、そのリズムに従い、無理なく変化します。最後に、分散と統合の完璧な調和を実現し、生命力に満ちた状態を保ちます。突破口は、自然のリズムとの同調です。",
      tone: "story",
      suitability: "自然なリズム、無理のない変化、完璧な調和、生命力",
      caution: "流れに任せすぎず、意志も持つ",
      label: "HHH",
      start: { hex: "風水渙", pos: line },
      final: { hex: "風水渙", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 水沢節（60）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、適切な節度を設け、バランスの取れた生活を始めます。続いて、その節制が習慣となり、健全な成長を実現します。最後に、節度ある生き方が実を結び、持続可能な成功を達成します。突破口は、節度による持続性です。",
      tone: "story",
      suitability: "節度ある生活、健全な成長、持続可能性、長期的成功",
      caution: "厳格すぎず、適度な柔軟性も保つ",
      label: "JJJ",
      start: { hex: "水沢節", pos: line },
      final: { hex: "水沢節", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、限られた資源を賢明に配分し、効率を最大化します。続いて、その効率的な運用が成果を生み、余裕が生まれます。最後に、新たな視点から節約の意味を理解し、真の豊かさを実現します。突破口は、制限の中での創造性です。",
      tone: "story",
      suitability: "資源管理、効率最大化、創造的節約、真の豊かさ",
      caution: "ケチにならず、必要な投資は行う",
      label: "JJH",
      start: { hex: "水沢節", pos: line },
      final: { hex: "水沢節", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、自己を律し、規律正しい生活を送ります。続いて、その自律が内面の強さとなり、困難に打ち勝つ力を生みます。最後に、より高い次元での自己制御を実現し、真の自由を獲得します。突破口は、自律による自由の獲得です。",
      tone: "story",
      suitability: "自己規律、内面の強さ、困難克服、真の自由",
      caution: "自己に厳しすぎず、自分を許すことも大切にする",
      label: "JHJ",
      start: { hex: "水沢節", pos: line },
      final: { hex: "水沢節", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、明確な境界を設定し、秩序を確立します。続いて、その秩序の中で効率的に活動し、成果を上げます。最後に、完璧なシステムを構築し、理想的な運営を実現します。突破口は、適切な境界設定です。",
      tone: "story",
      suitability: "境界設定、秩序確立、効率的運営、システム構築",
      caution: "硬直的にならず、状況に応じて調整する",
      label: "JHH",
      start: { hex: "水沢節", pos: line },
      final: { hex: "水沢節", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しい節制の形を開発し、従来の概念を超えます。続いて、その革新的な方法が効果を上げ、注目されます。最後に、新時代の節度モデルとなり、文化を変えます。突破口は、節制の革新です。",
      tone: "story",
      suitability: "新しい節制、革新的方法、文化変革、時代創造",
      caution: "新しさを追求しすぎて、本質を見失わない",
      label: "HJJ",
      start: { hex: "水沢節", pos: line },
      final: { hex: "水沢節", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、節度の基準を見直し、より適切な形を探ります。続いて、調整された基準で実践し、効果を確認します。最後に、再び最適化を図り、完璧な節度を実現します。突破口は、節度の継続的改善です。",
      tone: "story",
      suitability: "基準見直し、適切な調整、効果検証、継続的改善",
      caution: "基準にとらわれすぎず、柔軟性も保つ",
      label: "HJH",
      start: { hex: "水沢節", pos: line },
      final: { hex: "水沢節", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな節制から始め、徐々に習慣化していきます。続いて、その積み重ねが大きな変化となり、人生が改善されます。最後に、節度ある生き方が完全に身につき、理想的な人生を実現します。突破口は、小さな節制の積み重ねです。",
      tone: "story",
      suitability: "習慣形成、段階的改善、人生改善、理想の実現",
      caution: "完璧主義に陥らず、無理のない範囲で実践する",
      label: "HHJ",
      start: { hex: "水沢節", pos: line },
      final: { hex: "水沢節", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、自然な節度を見出し、無理のない形で実践します。続いて、その自然な節制が心地よくなり、継続できます。最後に、節度が第二の天性となり、effortlessに維持されます。突破口は、自然な節度の発見です。",
      tone: "story",
      suitability: "自然な節度、無理のない実践、心地よい継続、effortless",
      caution: "緩くなりすぎず、必要な規律は保つ",
      label: "HHH",
      start: { hex: "水沢節", pos: line },
      final: { hex: "水沢節", pos: line },
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
    '巽為風': [0,1,1,0,1,1],   // 巽為風（57）巽上巽下
    '兌為沢': [0,1,1,1,1,0],   // 兌為沢（58）兌上兌下
    '風水渙': [0,1,0,0,1,1],   // 風水渙（59）巽上坎下
    '水沢節': [1,1,0,0,1,0]    // 水沢節（60）坎上兌下
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