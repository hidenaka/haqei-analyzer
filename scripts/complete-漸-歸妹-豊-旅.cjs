const fs = require('fs');
const path = require('path');

// データファイルのパス
const dataPath = path.join(__dirname, '../public/data/narratives_chain.v1.json');

// 既存データを読み込む
const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 次の4卦のナラティブを作成
const hexagrams = [
  { name: '風山漸', position: 53 },
  { name: '雷沢歸妹', position: 54 },
  { name: '雷火豊', position: 55 },
  { name: '火山旅', position: 56 }
];

const newNarratives = [];

// 風山漸（53）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、ゆっくりと着実に前進を始め、基礎を固めます。続いて、段階的に成長し、確実に高みへと登っていきます。最後に、時間をかけて築いた成果が実を結び、永続的な成功を実現します。突破口は、焦らない着実な歩みです。",
      tone: "story",
      suitability: "漸進的成長、着実な前進、段階的発展、永続的成功",
      caution: "進歩が遅くても焦らず、着実に進む",
      label: "JJJ",
      start: { hex: "風山漸", pos: line },
      final: { hex: "風山漸", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、正しい順序で物事を進め、手順を踏みます。続いて、その丁寧なプロセスが信頼を生み、協力を得られます。最後に、新たな段階へと進み、更なる発展を遂げます。突破口は、正しい手順の遵守です。",
      tone: "story",
      suitability: "正しい手順、信頼構築、協力獲得、段階的発展",
      caution: "形式にとらわれすぎず、実質も重視する",
      label: "JJH",
      start: { hex: "風山漸", pos: line },
      final: { hex: "風山漸", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、自然な成長のリズムに従い、無理なく発展します。続いて、環境との調和を保ちながら、着実に成長します。最後に、より深い成熟に到達し、完全な形を実現します。突破口は、自然の摂理に従うことです。",
      tone: "story",
      suitability: "自然な成長、調和的発展、成熟、完成",
      caution: "人為的な加速を避け、自然なペースを保つ",
      label: "JHJ",
      start: { hex: "風山漸", pos: line },
      final: { hex: "風山漸", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、長期的な計画を立て、段階的な目標を設定します。続いて、各段階を確実にクリアし、着実に前進します。最後に、計画通りに最終目標を達成し、大きな成功を収めます。突破口は、計画的な漸進です。",
      tone: "story",
      suitability: "長期計画、段階的目標、着実な達成、計画的成功",
      caution: "計画に固執せず、状況に応じて調整する",
      label: "JHH",
      start: { hex: "風山漸", pos: line },
      final: { hex: "風山漸", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しい漸進的アプローチを開発し、従来の方法を改善します。続いて、その革新的な方法が成果を上げ、注目されます。最後に、新たな成長モデルとして確立され、広く採用されます。突破口は、漸進の革新です。",
      tone: "story",
      suitability: "新手法開発、革新的漸進、成長モデル、広範な影響",
      caution: "新しさを追求しすぎて、基本を忘れない",
      label: "HJJ",
      start: { hex: "風山漸", pos: line },
      final: { hex: "風山漸", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、漸進の方法を見直し、より効率的な進め方を探ります。続いて、改善された方法で実践し、成果を確認します。最後に、再び最適化を図り、理想的な漸進を実現します。突破口は、漸進プロセスの最適化です。",
      tone: "story",
      suitability: "プロセス改善、効率化、最適化、理想的漸進",
      caution: "効率を追求しすぎて、着実さを失わない",
      label: "HJH",
      start: { hex: "風山漸", pos: line },
      final: { hex: "風山漸", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、一歩一歩確実に進み、小さな成功を積み重ねます。続いて、その積み重ねが大きな力となり、加速度的に成長します。最後に、着実な歩みが大きな成果となり、目標を達成します。突破口は、小さな一歩の積み重ねです。",
      tone: "story",
      suitability: "着実な積み重ね、複利効果、加速的成長、確実な成功",
      caution: "小さな成功に満足せず、大きな目標を見据える",
      label: "HHJ",
      start: { hex: "風山漸", pos: line },
      final: { hex: "風山漸", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、自分のペースを守り、無理なく進みます。続いて、そのペースが習慣となり、自然に継続できます。最後に、長年の継続が大きな成果となり、人生の財産となります。突破口は、自分らしいペースの維持です。",
      tone: "story",
      suitability: "マイペース、習慣化、長期継続、人生の財産",
      caution: "遅すぎて機会を逃さないよう注意する",
      label: "HHH",
      start: { hex: "風山漸", pos: line },
      final: { hex: "風山漸", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 雷沢歸妹（54）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、新しい関係や環境に飛び込み、未知の世界を体験します。続いて、その中で自分の役割を見出し、適応していきます。最後に、新たな居場所を確立し、充実した生活を送ります。突破口は、変化を恐れない勇気です。",
      tone: "story",
      suitability: "新環境適応、役割発見、居場所確立、新生活",
      caution: "衝動的になりすぎず、慎重さも保つ",
      label: "JJJ",
      start: { hex: "雷沢歸妹", pos: line },
      final: { hex: "雷沢歸妹", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、感情に従って行動し、情熱的に生きます。続いて、その経験から学び、感情と理性のバランスを取ります。最後に、新たな成熟した関係性を築き、深い満足を得ます。突破口は、感情の適切な表現です。",
      tone: "story",
      suitability: "情熱的行動、感情表現、バランス獲得、成熟した関係",
      caution: "感情に流されすぎず、理性も働かせる",
      label: "JJH",
      start: { hex: "雷沢歸妹", pos: line },
      final: { hex: "雷沢歸妹", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、若い衝動に従い、大胆な選択をします。続いて、現実と向き合い、調整を重ねます。最後に、経験を活かして、より良い選択ができるようになります。突破口は、若さの力と経験の融合です。",
      tone: "story",
      suitability: "大胆な選択、現実との対峙、経験活用、成長",
      caution: "無謀な選択により、取り返しのつかない失敗をしない",
      label: "JHJ",
      start: { hex: "雷沢歸妹", pos: line },
      final: { hex: "雷沢歸妹", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、強い意志で新たな道を選び、覚悟を決めます。続いて、その選択を貫き、困難を乗り越えます。最後に、選んだ道で成功を収め、充実した人生を実現します。突破口は、選択への確信です。",
      tone: "story",
      suitability: "意志的選択、覚悟、困難克服、人生の充実",
      caution: "頑固になりすぎず、必要な修正は行う",
      label: "JHH",
      start: { hex: "雷沢歸妹", pos: line },
      final: { hex: "雷沢歸妹", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、従来の枠を超えた関係性を模索し、新しい形を試みます。続いて、その革新的な関係が成功し、新たな可能性を開きます。最後に、時代の先駆けとなり、社会に変化をもたらします。突破口は、関係性の革新です。",
      tone: "story",
      suitability: "新しい関係性、革新的試み、社会変革、先駆者",
      caution: "革新性と社会性のバランスを保つ",
      label: "HJJ",
      start: { hex: "雷沢歸妹", pos: line },
      final: { hex: "雷沢歸妹", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、関係の在り方を見直し、より良い形を探ります。続いて、試行錯誤しながら、最適な関係を構築します。最後に、再び調整を加え、理想的な関係性を実現します。突破口は、関係性の継続的改善です。",
      tone: "story",
      suitability: "関係改善、試行錯誤、最適化、理想的関係",
      caution: "完璧を求めすぎて、現実を見失わない",
      label: "HJH",
      start: { hex: "雷沢歸妹", pos: line },
      final: { hex: "雷沢歸妹", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな変化から始め、徐々に新しい生活に慣れていきます。続いて、適応が進み、安定した関係を築きます。最後に、完全に新しい環境に溶け込み、幸せな生活を送ります。突破口は、段階的な適応です。",
      tone: "story",
      suitability: "段階的適応、安定構築、環境融合、幸せな生活",
      caution: "変化を急ぎすぎず、自然なペースを保つ",
      label: "HHJ",
      start: { hex: "雷沢歸妹", pos: line },
      final: { hex: "雷沢歸妹", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、自然な流れに任せて、新しい関係を受け入れます。続いて、その関係が熟成し、深い絆となります。最後に、運命的なつながりとして、永続的な関係を築きます。突破口は、自然な流れへの信頼です。",
      tone: "story",
      suitability: "自然な流れ、関係熟成、深い絆、運命的つながり",
      caution: "受動的になりすぎず、主体的な努力も続ける",
      label: "HHH",
      start: { hex: "雷沢歸妹", pos: line },
      final: { hex: "雷沢歸妹", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 雷火豊（55）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、豊かさが満ち溢れ、繁栄の絶頂を迎えます。続いて、その豊かさを維持し、更なる発展を図ります。最後に、永続的な繁栄を実現し、黄金時代を築きます。突破口は、豊かさの賢明な管理です。",
      tone: "story",
      suitability: "繁栄期、黄金時代、豊かさの維持、永続的成功",
      caution: "豊かさに溺れず、将来への備えも怠らない",
      label: "JJJ",
      start: { hex: "雷火豊", pos: line },
      final: { hex: "雷火豊", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、大いなる成功を収め、頂点に立ちます。続いて、その成功を基盤に、さらなる高みを目指します。最後に、新たな視点から価値を創造し、質的に異なる豊かさを実現します。突破口は、成功の上に築く新たな成功です。",
      tone: "story",
      suitability: "大成功、更なる高み、価値創造、質的豊かさ",
      caution: "驕りを避け、謙虚さを保つ",
      label: "JJH",
      start: { hex: "雷火豊", pos: line },
      final: { hex: "雷火豊", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、光輝く成功を実現し、周囲を照らします。続いて、その輝きを調整し、持続可能な形にします。最後に、より深い充実感を得て、真の豊かさを体験します。突破口は、外的成功と内的充実の統合です。",
      tone: "story",
      suitability: "輝かしい成功、持続可能性、内的充実、真の豊かさ",
      caution: "表面的な成功に満足せず、本質を追求する",
      label: "JHJ",
      start: { hex: "雷火豊", pos: line },
      final: { hex: "雷火豊", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、圧倒的な力で成功を掴み、頂点を極めます。続いて、その力を制御し、安定した繁栄を維持します。最後に、力と豊かさの完璧なバランスを実現し、理想的な状態を保ちます。突破口は、力の適切な使用です。",
      tone: "story",
      suitability: "圧倒的成功、力の制御、安定繁栄、理想状態",
      caution: "力に頼りすぎず、他の要素も大切にする",
      label: "JHH",
      start: { hex: "雷火豊", pos: line },
      final: { hex: "雷火豊", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しいタイプの豊かさを創造し、従来の概念を超えます。続いて、その革新的な豊かさが広まり、社会を変えます。最後に、新時代の豊かさのモデルとなり、多くの人々に影響を与えます。突破口は、豊かさの再定義です。",
      tone: "story",
      suitability: "新しい豊かさ、概念革新、社会変革、影響力",
      caution: "新しさに固執せず、普遍的価値も重視する",
      label: "HJJ",
      start: { hex: "雷火豊", pos: line },
      final: { hex: "雷火豊", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、豊かさの管理方法を見直し、より効果的な活用を図ります。続いて、最適化された方法で実践し、成果を最大化します。最後に、再び改善を加え、完璧な豊かさの運用を実現します。突破口は、豊かさの最適管理です。",
      tone: "story",
      suitability: "資源管理、活用最適化、成果最大化、完璧な運用",
      caution: "管理に囚われすぎず、楽しむことも忘れない",
      label: "HJH",
      start: { hex: "雷火豊", pos: line },
      final: { hex: "雷火豊", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな豊かさから始め、感謝の気持ちを持ちます。続いて、その豊かさが増大し、より大きな恵みを受けます。最後に、溢れる豊かさを手に入れ、多くの人々と分かち合います。突破口は、感謝による豊かさの増幅です。",
      tone: "story",
      suitability: "感謝の実践、豊かさの増大、恵みの享受、分かち合い",
      caution: "独占せず、適切に分配する",
      label: "HHJ",
      start: { hex: "雷火豊", pos: line },
      final: { hex: "雷火豊", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、物質的豊かさと精神的豊かさのバランスを取ります。続いて、両方が相乗効果を生み、全体的な充実を実現します。最後に、真の豊かさとは何かを理解し、幸福な人生を送ります。突破口は、多面的な豊かさの統合です。",
      tone: "story",
      suitability: "バランスの取れた豊かさ、全体的充実、真の幸福、統合的人生",
      caution: "一面的な豊かさに偏らない",
      label: "HHH",
      start: { hex: "雷火豊", pos: line },
      final: { hex: "雷火豊", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 火山旅（56）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、慣れ親しんだ場所を離れ、旅に出ます。続いて、新しい土地で様々な経験を積み、視野を広げます。最後に、豊かな経験を持って帰還し、成長した自分を実感します。突破口は、未知への一歩です。",
      tone: "story",
      suitability: "新しい旅立ち、経験拡大、視野拡張、成長",
      caution: "無計画にならず、基本的な準備は整える",
      label: "JJJ",
      start: { hex: "火山旅", pos: line },
      final: { hex: "火山旅", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、旅人として謙虚に振る舞い、現地の文化を尊重します。続いて、その姿勢が好意を生み、多くの助けを得ます。最後に、新たな視点を獲得し、世界観が広がります。突破口は、旅人の謙虚さです。",
      tone: "story",
      suitability: "文化理解、謙虚な態度、支援獲得、世界観拡大",
      caution: "自分を見失わず、アイデンティティを保つ",
      label: "JJH",
      start: { hex: "火山旅", pos: line },
      final: { hex: "火山旅", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、一人で旅立ち、自己と向き合います。続いて、孤独の中で内省を深め、自己理解を進めます。最後に、より成熟した自己を発見し、人生の意味を見出します。突破口は、旅がもたらす自己発見です。",
      tone: "story",
      suitability: "自己探求、内省、自己理解、人生の意味",
      caution: "孤立しすぎず、人との交流も大切にする",
      label: "JHJ",
      start: { hex: "火山旅", pos: line },
      final: { hex: "火山旅", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、目的を持って旅に出て、使命を果たします。続いて、その過程で予想外の発見をし、計画を超えた成果を得ます。最後に、旅の成功により、新たな可能性が開けます。突破口は、目的意識のある旅です。",
      tone: "story",
      suitability: "使命遂行、目的達成、予想外の発見、新可能性",
      caution: "目的に囚われすぎず、柔軟性も保つ",
      label: "JHH",
      start: { hex: "火山旅", pos: line },
      final: { hex: "火山旅", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、従来の旅の概念を超えた新しい形を試みます。続いて、その革新的な旅が成功し、新たなスタイルを確立します。最後に、多くの人々に影響を与え、旅の文化を変えます。突破口は、旅の革新です。",
      tone: "story",
      suitability: "新しい旅のスタイル、革新、文化変革、影響力",
      caution: "奇抜さを追求しすぎず、安全も重視する",
      label: "HJJ",
      start: { hex: "火山旅", pos: line },
      final: { hex: "火山旅", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、旅の方法を見直し、より充実した体験を求めます。続いて、改善された方法で旅をし、深い満足を得ます。最後に、再び工夫を加え、理想的な旅を実現します。突破口は、旅の質の向上です。",
      tone: "story",
      suitability: "旅の改善、充実体験、深い満足、理想的な旅",
      caution: "完璧を求めすぎて、自然な流れを妨げない",
      label: "HJH",
      start: { hex: "火山旅", pos: line },
      final: { hex: "火山旅", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、短い旅から始め、徐々に範囲を広げていきます。続いて、経験を積むことで、どこでも適応できる力を養います。最後に、世界中を自在に旅し、真の自由を獲得します。突破口は、段階的な旅の拡大です。",
      tone: "story",
      suitability: "段階的拡大、適応力向上、世界旅行、真の自由",
      caution: "根無し草にならず、帰る場所も大切にする",
      label: "HHJ",
      start: { hex: "火山旅", pos: line },
      final: { hex: "火山旅", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、人生を旅として捉え、変化を受け入れます。続いて、どこにいても自分らしく生き、充実した日々を送ります。最後に、旅と日常の境界が消え、すべてが豊かな体験となります。突破口は、人生そのものを旅とする視点です。",
      tone: "story",
      suitability: "人生観、変化受容、充実した生活、豊かな体験",
      caution: "浮ついた生活にならず、地に足をつける",
      label: "HHH",
      start: { hex: "火山旅", pos: line },
      final: { hex: "火山旅", pos: line },
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
    '風山漸': [0,0,1,0,1,1],   // 風山漸（53）巽上艮下
    '雷沢歸妹': [1,1,0,1,0,0], // 雷沢歸妹（54）震上兌下
    '雷火豊': [1,0,1,0,0,1],   // 雷火豊（55）震上離下
    '火山旅': [0,0,1,0,1,1]    // 火山旅（56）離上艮下
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