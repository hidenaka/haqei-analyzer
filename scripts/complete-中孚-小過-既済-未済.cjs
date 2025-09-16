const fs = require('fs');
const path = require('path');

// データファイルのパス
const dataPath = path.join(__dirname, '../public/data/narratives_chain.v1.json');

// 既存データを読み込む
const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 最後の4卦のナラティブを作成
const hexagrams = [
  { name: '風沢中孚', position: 61 },
  { name: '雷山小過', position: 62 },
  { name: '水火既済', position: 63 },
  { name: '火水未済', position: 64 }
];

const newNarratives = [];

// 風沢中孚（61）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、真心を込めて相手と向き合い、誠実な関係を築きます。続いて、その信頼関係が深まり、心が通い合うようになります。最後に、完全な信頼関係が確立され、揺るぎない絆となります。突破口は、真心の力です。",
      tone: "story",
      suitability: "信頼構築、誠実な関係、心の通い合い、揺るぎない絆",
      caution: "素直になりすぎて、騙されないよう注意する",
      label: "JJJ",
      start: { hex: "風沢中孚", pos: line },
      final: { hex: "風沢中孚", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、内なる真実に従い、正直に生きることを選びます。続いて、その誠実さが周囲に認められ、信頼を得ます。最後に、新たな視点から誠実さの価値を理解し、より深い信念を持ちます。突破口は、内なる真実への忠実さです。",
      tone: "story",
      suitability: "正直な生き方、信頼獲得、価値理解、深い信念",
      caution: "頑固にならず、他者の意見も聞く",
      label: "JJH",
      start: { hex: "風沢中孚", pos: line },
      final: { hex: "風沢中孚", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、心を開いて素直に交流し、偽りのない関係を作ります。続いて、現実的な課題にも誠実に対処し、信頼を深めます。最後に、より高い次元での信頼関係を築き、魂の交流を実現します。突破口は、素直さと誠実さの統合です。",
      tone: "story",
      suitability: "素直な交流、誠実な対処、深い信頼、魂の交流",
      caution: "理想的すぎず、現実的な対応も心がける",
      label: "JHJ",
      start: { hex: "風沢中孚", pos: line },
      final: { hex: "風沢中孚", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、強い信念を持って行動し、一貫性を保ちます。続いて、その一貫した姿勢が信頼を生み、影響力を持ちます。最後に、多くの人々の信頼を集め、大きな成果を実現します。突破口は、信念の一貫性です。",
      tone: "story",
      suitability: "強い信念、一貫性、影響力、大きな成果",
      caution: "独善的にならず、柔軟性も保つ",
      label: "JHH",
      start: { hex: "風沢中孚", pos: line },
      final: { hex: "風沢中孚", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しい形の信頼関係を構築し、従来の枠を超えます。続いて、その革新的な関係が成功し、新たなモデルとなります。最後に、信頼の新しいパラダイムを確立し、社会を変えます。突破口は、信頼関係の革新です。",
      tone: "story",
      suitability: "新しい信頼関係、革新的モデル、パラダイム確立、社会変革",
      caution: "実験的すぎて、基本的な信頼を損なわない",
      label: "HJJ",
      start: { hex: "風沢中孚", pos: line },
      final: { hex: "風沢中孚", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、信頼構築の方法を見直し、より効果的なアプローチを探ります。続いて、改善された方法で実践し、成果を確認します。最後に、再び最適化を図り、完璧な信頼関係を実現します。突破口は、信頼構築の継続的改善です。",
      tone: "story",
      suitability: "方法改善、効果的アプローチ、成果確認、継続的改善",
      caution: "技術的になりすぎず、心も大切にする",
      label: "HJH",
      start: { hex: "風沢中孚", pos: line },
      final: { hex: "風沢中孚", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな約束を守ることから始め、信頼を積み重ねます。続いて、その積み重ねが大きな信頼となり、強い絆を作ります。最後に、絶対的な信頼関係を確立し、永続的な関係を築きます。突破口は、小さな信頼の積み重ねです。",
      tone: "story",
      suitability: "信頼の積み重ね、強い絆、絶対的信頼、永続的関係",
      caution: "小さなことを軽視せず、丁寧に対応する",
      label: "HHJ",
      start: { hex: "風沢中孚", pos: line },
      final: { hex: "風沢中孚", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、自然な信頼関係を育み、無理のない形で深めます。続いて、時間と共に信頼が熟成し、揺るぎないものとなります。最後に、信頼が当たり前となり、安心して関係を維持できます。突破口は、自然な信頼の醸成です。",
      tone: "story",
      suitability: "自然な信頼、無理のない関係、熟成、安定維持",
      caution: "信頼に甘えず、努力を続ける",
      label: "HHH",
      start: { hex: "風沢中孚", pos: line },
      final: { hex: "風沢中孚", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 雷山小過（62）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、小さな行き過ぎに気づき、適切に調整します。続いて、細やかな配慮により、バランスを回復していきます。最後に、適度な状態を維持し、安定した成功を実現します。突破口は、小さな調整の重要性です。",
      tone: "story",
      suitability: "微調整、バランス回復、適度な状態、安定成功",
      caution: "過度に神経質にならず、大局も見る",
      label: "JJJ",
      start: { hex: "雷山小過", pos: line },
      final: { hex: "雷山小過", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、謙虚に自分の限界を認識し、無理をしません。続いて、身の丈に合った行動により、着実な成果を上げます。最後に、新たな視点から成功を定義し、真の満足を得ます。突破口は、身の丈を知る智慧です。",
      tone: "story",
      suitability: "謙虚な認識、身の丈の行動、着実な成果、真の満足",
      caution: "消極的になりすぎず、挑戦も続ける",
      label: "JJH",
      start: { hex: "雷山小過", pos: line },
      final: { hex: "雷山小過", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな特別さを大切にし、個性を育てます。続いて、その個性を適切に表現し、認められるようになります。最後に、より深い個性を発揮し、独自の価値を創造します。突破口は、小さな特別さの価値です。",
      tone: "story",
      suitability: "個性育成、適切な表現、独自価値、創造性",
      caution: "奇抜になりすぎず、調和も大切にする",
      label: "JHJ",
      start: { hex: "雷山小過", pos: line },
      final: { hex: "雷山小過", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、細部にこだわり、完璧を追求します。続いて、その丁寧な仕事が評価され、信頼を得ます。最後に、細部の積み重ねが大きな成功となり、理想を実現します。突破口は、細部への徹底的なこだわりです。",
      tone: "story",
      suitability: "細部へのこだわり、完璧追求、信頼獲得、理想実現",
      caution: "完璧主義に陥らず、実行も重視する",
      label: "JHH",
      start: { hex: "雷山小過", pos: line },
      final: { hex: "雷山小過", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな革新から始め、徐々に変化を起こします。続いて、その革新が積み重なり、大きな変革へとつながります。最後に、小さな一歩が世界を変える力となります。突破口は、小さな革新の大きな可能性です。",
      tone: "story",
      suitability: "小さな革新、漸進的変化、大きな変革、世界を変える力",
      caution: "小さいことを軽視せず、価値を見出す",
      label: "HJJ",
      start: { hex: "雷山小過", pos: line },
      final: { hex: "雷山小過", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな調整の方法を見直し、より精密にします。続いて、改善された方法で実践し、精度を高めます。最後に、再び微調整を加え、完璧な精度を実現します。突破口は、精密な調整技術です。",
      tone: "story",
      suitability: "精密調整、精度向上、微調整、完璧な精度",
      caution: "細かすぎて、全体を見失わない",
      label: "HJH",
      start: { hex: "雷山小過", pos: line },
      final: { hex: "雷山小過", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、日常の小さな改善から始め、コツコツと続けます。続いて、その積み重ねが習慣となり、自然に改善が進みます。最後に、小さな改善の総和が大きな成果となります。突破口は、継続的な小さな改善です。",
      tone: "story",
      suitability: "日常改善、習慣化、自然な向上、大きな成果",
      caution: "改善疲れを起こさず、休息も取る",
      label: "HHJ",
      start: { hex: "雷山小過", pos: line },
      final: { hex: "雷山小過", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さなことを大切にする心を養います。続いて、その心遣いが周囲に良い影響を与えます。最後に、小さな思いやりが大きな幸せを生み出します。突破口は、小さなことの中にある大きな価値です。",
      tone: "story",
      suitability: "思いやり、細やかな心遣い、良い影響、幸せの創出",
      caution: "些細なことに囚われすぎない",
      label: "HHH",
      start: { hex: "雷山小過", pos: line },
      final: { hex: "雷山小過", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 水火既済（63）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、すべての要素が適切に配置され、完成に近づきます。続いて、最後の仕上げを丁寧に行い、完璧な状態を実現します。最後に、完成の喜びを味わいながら、次なる目標を設定します。突破口は、完成を新たな始まりとすることです。",
      tone: "story",
      suitability: "完成、達成、完璧な状態、新たな始まり",
      caution: "完成に満足せず、維持と発展も考える",
      label: "JJJ",
      start: { hex: "水火既済", pos: line },
      final: { hex: "水火既済", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、目標を達成し、成功を実現します。続いて、その成功を維持しながら、更なる向上を図ります。最後に、新たな視点から成功を見直し、次の段階へ進みます。突破口は、成功の上に築く新たな成功です。",
      tone: "story",
      suitability: "目標達成、成功維持、継続的向上、次段階への移行",
      caution: "成功に安住せず、常に前進する",
      label: "JJH",
      start: { hex: "水火既済", pos: line },
      final: { hex: "水火既済", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、調和の取れた状態を実現し、平和を享受します。続いて、その平和を守りながら、内面を充実させます。最後に、より深い調和に到達し、真の完成を体験します。突破口は、外的完成と内的充実の統合です。",
      tone: "story",
      suitability: "調和実現、平和維持、内面充実、真の完成",
      caution: "平和に慣れすぎて、警戒を怠らない",
      label: "JHJ",
      start: { hex: "水火既済", pos: line },
      final: { hex: "水火既済", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、完璧な秩序を確立し、理想的な状態を作ります。続いて、その秩序を維持し、安定を保ちます。最後に、秩序の中から新たな創造が生まれ、発展します。突破口は、秩序と創造の両立です。",
      tone: "story",
      suitability: "秩序確立、理想状態、安定維持、創造的発展",
      caution: "硬直化せず、柔軟性も保つ",
      label: "JHH",
      start: { hex: "水火既済", pos: line },
      final: { hex: "水火既済", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既存の完成を超えた新しい完成形を追求します。続いて、革新的なアプローチで、より高い完成度を実現します。最後に、新たな完成の概念を確立し、パラダイムを変えます。突破口は、完成概念の革新です。",
      tone: "story",
      suitability: "新しい完成形、革新的アプローチ、高い完成度、パラダイム転換",
      caution: "革新に固執せず、基本も大切にする",
      label: "HJJ",
      start: { hex: "水火既済", pos: line },
      final: { hex: "水火既済", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、完成の基準を見直し、より高い目標を設定します。続いて、改善を重ね、完成度を高めます。最後に、再び調整を加え、究極の完成を実現します。突破口は、完成への飽くなき追求です。",
      tone: "story",
      suitability: "基準向上、完成度向上、継続的改善、究極の完成",
      caution: "完璧主義に陥らず、実用性も重視する",
      label: "HJH",
      start: { hex: "水火既済", pos: line },
      final: { hex: "水火既済", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな完成から始め、達成感を味わいます。続いて、より大きな完成を目指し、努力を重ねます。最後に、人生の大きな完成を実現し、充実感に包まれます。突破口は、段階的な完成の積み重ねです。",
      tone: "story",
      suitability: "段階的達成、達成感、大きな完成、人生の充実",
      caution: "小さな完成に満足せず、大きな目標も持つ",
      label: "HHJ",
      start: { hex: "水火既済", pos: line },
      final: { hex: "水火既済", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、完成と未完成の循環を理解し、流れを受け入れます。続いて、完成を楽しみながら、新たな挑戦も始めます。最後に、永遠の循環の中で、常に新鮮な気持ちを保ちます。突破口は、完成を終わりではなく始まりとすることです。",
      tone: "story",
      suitability: "循環理解、新たな挑戦、永続的成長、新鮮な気持ち",
      caution: "循環に流されず、各段階を大切にする",
      label: "HHH",
      start: { hex: "水火既済", pos: line },
      final: { hex: "水火既済", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 火水未済（64）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、未完成の状態を受け入れ、可能性として捉えます。続いて、一歩ずつ完成に向かって進み、形を整えていきます。最後に、新たな完成を実現し、そしてまた新たな未完成へと向かいます。突破口は、未完成の中にある無限の可能性です。",
      tone: "story",
      suitability: "可能性、進行中、形成過程、無限の循環",
      caution: "未完成を言い訳にせず、努力を続ける",
      label: "JJJ",
      start: { hex: "火水未済", pos: line },
      final: { hex: "火水未済", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、混沌とした状態から秩序を見出し始めます。続いて、徐々に形が整い、方向性が明確になります。最後に、新たな視点から未完成の美を発見し、プロセスを楽しめるようになります。突破口は、過程そのものの価値です。",
      tone: "story",
      suitability: "秩序形成、方向性確立、プロセスの美、過程の楽しみ",
      caution: "結果を急ぎすぎず、過程も大切にする",
      label: "JJH",
      start: { hex: "火水未済", pos: line },
      final: { hex: "火水未済", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、未知の領域に踏み出し、探求を始めます。続いて、試行錯誤しながら、道を切り開いていきます。最後に、より深い未知に到達し、永遠の探求者となります。突破口は、未知への飽くなき好奇心です。",
      tone: "story",
      suitability: "未知の探求、試行錯誤、道の開拓、永遠の探求",
      caution: "迷走しないよう、基本的な方向性は保つ",
      label: "JHJ",
      start: { hex: "火水未済", pos: line },
      final: { hex: "火水未済", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、大きな挑戦に直面し、困難を認識します。続いて、粘り強く取り組み、少しずつ前進します。最後に、不可能と思われたことを実現し、新たな地平を開きます。突破口は、諦めない精神力です。",
      tone: "story",
      suitability: "大挑戦、粘り強さ、不可能の実現、新地平開拓",
      caution: "無謀にならず、現実的な判断も行う",
      label: "JHH",
      start: { hex: "火水未済", pos: line },
      final: { hex: "火水未済", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、従来の完成概念を捨て、新しい価値観を模索します。続いて、未完成こそが創造の源泉であることを発見します。最後に、永遠の創造プロセスを楽しむ境地に到達します。突破口は、未完成の創造的価値です。",
      tone: "story",
      suitability: "価値観転換、創造の源泉、永遠の創造、プロセス重視",
      caution: "完成を否定せず、両方の価値を認める",
      label: "HJJ",
      start: { hex: "火水未済", pos: line },
      final: { hex: "火水未済", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、未完成への対処法を見直し、より建設的なアプローチを探ります。続いて、改善された方法で取り組み、進歩を実感します。最後に、再び調整を加え、最適な未完成との付き合い方を確立します。突破口は、未完成との建設的な関係です。",
      tone: "story",
      suitability: "建設的アプローチ、進歩実感、最適な対処、関係確立",
      caution: "方法論に囚われず、柔軟に対応する",
      label: "HJH",
      start: { hex: "火水未済", pos: line },
      final: { hex: "火水未済", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな前進から始め、一歩ずつ進みます。続いて、着実な歩みが距離となり、遠くまで到達します。最後に、終わりなき旅を楽しみながら、人生を充実させます。突破口は、一歩一歩の積み重ねです。",
      tone: "story",
      suitability: "着実な前進、長い道のり、終わりなき旅、充実した人生",
      caution: "ゴールに固執せず、旅そのものを楽しむ",
      label: "HHJ",
      start: { hex: "火水未済", pos: line },
      final: { hex: "火水未済", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、生成と消滅の永遠の循環を理解します。続いて、その流れの中で自分の役割を見出し、貢献します。最後に、無限の可能性と共に生き、永遠の今を楽しみます。突破口は、終わりなき始まりの認識です。",
      tone: "story",
      suitability: "永遠の循環、役割認識、無限の可能性、永遠の今",
      caution: "虚無的にならず、今を大切に生きる",
      label: "HHH",
      start: { hex: "火水未済", pos: line },
      final: { hex: "火水未済", pos: line },
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
    '風沢中孚': [1,1,0,0,1,1], // 風沢中孚（61）巽上兌下
    '雷山小過': [0,0,1,1,0,0], // 雷山小過（62）震上艮下
    '水火既済': [1,0,1,0,1,0], // 水火既済（63）坎上離下
    '火水未済': [0,1,0,1,0,1]  // 火水未済（64）離上坎下
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

console.log(`最後の4卦を完成させました: ${newNarratives.length}件
全64卦の作成が完了しました！`);