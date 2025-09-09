const fs = require('fs');
const path = require('path');

// データファイルのパス
const dataPath = path.join(__dirname, '../public/data/narratives_chain.v1.json');

// 既存データを読み込む
const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 次の4卦のナラティブを作成
const hexagrams = [
  { name: '風火家人', position: 37 },
  { name: '火沢睽', position: 38 },
  { name: '水山蹇', position: 39 },
  { name: '雷水解', position: 40 }
];

const newNarratives = [];

// 風火家人（37）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、家族の和を大切にし、互いを思いやる関係を築きます。続いて、それぞれの役割を尊重し、協力して家庭を運営していきます。最後に、温かい家庭が実現し、幸福な日々を送れるようになります。突破口は、家族愛の実践です。",
      tone: "story",
      suitability: "家族関係、家庭円満、役割分担、温かい関係",
      caution: "過干渉にならず、個人の自由も尊重する",
      label: "JJJ",
      start: { hex: "風火家人", pos: line },
      final: { hex: "風火家人", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、家庭内のルールを整え、秩序ある生活を送ります。続いて、規律と愛情のバランスを取りながら、健全な環境を作ります。最後に、新たな視点から家族関係を見直し、より成熟した関係を築きます。突破口は、規律と愛情の両立です。",
      tone: "story",
      suitability: "家庭教育、しつけ、規律、健全な成長環境",
      caution: "厳格すぎず、柔軟性も保つ",
      label: "JJH",
      start: { hex: "風火家人", pos: line },
      final: { hex: "風火家人", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、家族の伝統や価値観を大切に守ります。続いて、現代的な要素も取り入れながら、家風を発展させます。最後に、次世代に継承すべき価値を確立し、家族の絆を強めます。突破口は、伝統と革新の調和です。",
      tone: "story",
      suitability: "家風継承、価値観共有、世代間交流、文化伝承",
      caution: "古い慣習に固執せず、時代に合わせて更新する",
      label: "JHJ",
      start: { hex: "風火家人", pos: line },
      final: { hex: "風火家人", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、家族全員が協力して共通の目標に向かいます。続いて、それぞれの強みを活かし、効率的に家事を分担します。最後に、完璧なチームワークが実現し、理想的な家庭運営ができるようになります。突破口は、家族の団結力です。",
      tone: "story",
      suitability: "家族協力、チームワーク、効率的運営、共同目標",
      caution: "役割に縛られすぎず、柔軟に対応する",
      label: "JHH",
      start: { hex: "風火家人", pos: line },
      final: { hex: "風火家人", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しい家族の形を模索し、従来の枠組みを超えます。続いて、多様な家族観を受け入れ、より包括的な関係を築きます。最後に、革新的な家族モデルが確立され、新時代の家庭像を示します。突破口は、固定観念からの解放です。",
      tone: "story",
      suitability: "新しい家族形態、多様性受容、現代的家族、価値観の更新",
      caution: "基本的な家族愛は失わない",
      label: "HJJ",
      start: { hex: "風火家人", pos: line },
      final: { hex: "風火家人", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、家族関係を見直し、より健全な距離感を探ります。続いて、個人と家族のバランスを取りながら、成長していきます。最後に、再び関係を調整し、最適な家族の形を見出します。突破口は、依存と自立のバランスです。",
      tone: "story",
      suitability: "関係調整、適切な距離、個人と家族、健全な境界",
      caution: "疎遠になりすぎず、つながりは保つ",
      label: "HJH",
      start: { hex: "風火家人", pos: line },
      final: { hex: "風火家人", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、日常の小さな思いやりから始め、愛情を表現します。続いて、その積み重ねが信頼関係を深め、家族の絆を強めます。最後に、深い愛情に満ちた家庭が実現し、真の幸福を得ます。突破口は、日々の小さな愛の実践です。",
      tone: "story",
      suitability: "日常的愛情表現、信頼構築、絆の深化、幸福な家庭",
      caution: "愛情の押し付けにならないよう配慮する",
      label: "HHJ",
      start: { hex: "風火家人", pos: line },
      final: { hex: "風火家人", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、家族それぞれの個性を認め、多様性を受け入れます。続いて、違いを尊重しながら、調和を保ちます。最後に、個性豊かな家族が一つにまとまり、豊かな家庭文化を創造します。突破口は、違いを豊かさとして捉えることです。",
      tone: "story",
      suitability: "個性尊重、多様性、調和、豊かな家庭文化",
      caution: "まとまりを失わず、共通の価値も大切にする",
      label: "HHH",
      start: { hex: "風火家人", pos: line },
      final: { hex: "風火家人", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 火沢睽（38）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、意見の相違や対立が生じ、関係に亀裂が入ります。続いて、その違いを理解しようと努力し、対話を重ねます。最後に、違いを超えて新たな理解に到達し、より深い関係を築きます。突破口は、対立を成長の機会とすることです。",
      tone: "story",
      suitability: "対立解消、相互理解、関係修復、違いの克服",
      caution: "対立を深刻化させず、建設的に対処する",
      label: "JJJ",
      start: { hex: "火沢睽", pos: line },
      final: { hex: "火沢睽", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、異なる価値観や立場の存在を認識します。続いて、その多様性を受け入れ、共存の道を探ります。最後に、新たな視点から全体を見直し、創造的な統合を実現します。突破口は、違いを豊かさとして活かすことです。",
      tone: "story",
      suitability: "多様性受容、価値観調整、共存共栄、創造的統合",
      caution: "相対主義に陥らず、共通の基盤も見出す",
      label: "JJH",
      start: { hex: "火沢睽", pos: line },
      final: { hex: "火沢睽", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、孤立した状況に置かれ、疎外感を味わいます。続いて、自己と向き合い、内的な強さを養います。最後に、新たな関係性を構築し、より本質的なつながりを得ます。突破口は、孤独を自己発見の機会とすることです。",
      tone: "story",
      suitability: "自己探求、独立心、内的成長、新たな関係構築",
      caution: "孤立を選ばず、必要な関係は維持する",
      label: "JHJ",
      start: { hex: "火沢睽", pos: line },
      final: { hex: "火沢睽", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、矛盾や葛藤を抱えながらも、前に進みます。続いて、その矛盾を統合する方法を見出し、実践します。最後に、対立を超えた高次の調和を実現し、新たな次元に到達します。突破口は、矛盾を創造的に統合することです。",
      tone: "story",
      suitability: "矛盾統合、葛藤解決、弁証法的発展、高次の調和",
      caution: "安易な妥協に走らず、本質的な解決を目指す",
      label: "JHH",
      start: { hex: "火沢睽", pos: line },
      final: { hex: "火沢睽", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既存の関係性から離れ、新しい可能性を探ります。続いて、異質な要素と出会い、刺激を受けます。最後に、その経験を活かして革新的な関係性を構築します。突破口は、異質性との創造的な出会いです。",
      tone: "story",
      suitability: "新しい出会い、異文化交流、革新的関係、創造的刺激",
      caution: "根無し草にならず、基盤は保つ",
      label: "HJJ",
      start: { hex: "火沢睽", pos: line },
      final: { hex: "火沢睽", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、関係性のあり方を見直し、新しい形を模索します。続いて、試行錯誤しながら、より良い関係を築きます。最後に、再び調整を加え、最適な距離感を見出します。突破口は、関係性の柔軟な再定義です。",
      tone: "story",
      suitability: "関係再構築、距離感調整、新しい関係性、柔軟な対応",
      caution: "流動的になりすぎず、安定性も重視する",
      label: "HJH",
      start: { hex: "火沢睽", pos: line },
      final: { hex: "火沢睽", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな違和感から始まり、徐々に疎遠になっていきます。続いて、その距離を受け入れ、自立した関係を築きます。最後に、適切な距離感での新たな関係が成立し、健全な形で再会します。突破口は、距離があるからこそ可能な関係性です。",
      tone: "story",
      suitability: "自立的関係、健全な距離、成熟した関係、新たな絆",
      caution: "冷たくなりすぎず、温かさは保つ",
      label: "HHJ",
      start: { hex: "火沢睽", pos: line },
      final: { hex: "火沢睽", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、対立や相違を自然なものとして受け入れます。続いて、その中で自分の立場を保ちながら、相手も尊重します。最後に、対立と調和が共存する成熟した関係を実現します。突破口は、違いを前提とした共存です。",
      tone: "story",
      suitability: "成熟した関係、違いの受容、共存、相互尊重",
      caution: "無関心にならず、必要な関わりは持つ",
      label: "HHH",
      start: { hex: "火沢睽", pos: line },
      final: { hex: "火沢睽", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 水山蹇（39）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、困難な障害に直面し、前進が阻まれます。続いて、障害を乗り越える方法を模索し、知恵を絞ります。最後に、困難を克服し、より強くなって前進します。突破口は、障害を成長の機会として捉えることです。",
      tone: "story",
      suitability: "困難克服、障害突破、問題解決、試練の克服",
      caution: "無理な突破を試みず、適切な方法を選ぶ",
      label: "JJJ",
      start: { hex: "水山蹇", pos: line },
      final: { hex: "水山蹇", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、歩みは遅くとも、着実に前進します。続いて、忍耐強く努力を続け、少しずつ状況を改善します。最後に、新たな視点から道を見出し、より効率的な方法を発見します。突破口は、諦めない粘り強さです。",
      tone: "story",
      suitability: "忍耐力、地道な努力、着実な前進、長期的取り組み",
      caution: "進歩が遅くても焦らない",
      label: "JJH",
      start: { hex: "水山蹇", pos: line },
      final: { hex: "水山蹇", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、困難に立ち向かう覚悟を決め、準備を整えます。続いて、実際に挑戦し、経験を積みます。最後に、より深い理解と共に、困難を乗り越える力を獲得します。突破口は、困難から逃げない勇気です。",
      tone: "story",
      suitability: "勇気ある挑戦、経験蓄積、能力向上、成長機会",
      caution: "無謀にならず、計画的に進める",
      label: "JHJ",
      start: { hex: "水山蹇", pos: line },
      final: { hex: "水山蹇", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、大きな困難に直面し、一人では解決できないことを認識します。続いて、助けを求め、協力者を得ます。最後に、チームワークで困難を克服し、共に成功を分かち合います。突破口は、素直に助けを求めることです。",
      tone: "story",
      suitability: "協力要請、チームワーク、相互支援、共同克服",
      caution: "依存的にならず、自助努力も続ける",
      label: "JHH",
      start: { hex: "水山蹇", pos: line },
      final: { hex: "水山蹇", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、従来の方法では越えられない障害に直面します。続いて、創造的な発想で新たな道を切り開きます。最後に、その成功が新しいスタンダードとなり、多くの人を助けます。突破口は、常識を超えた発想力です。",
      tone: "story",
      suitability: "創造的解決、イノベーション、新しい道、パラダイムシフト",
      caution: "奇抜すぎて実現不可能にならない",
      label: "HJJ",
      start: { hex: "水山蹇", pos: line },
      final: { hex: "水山蹇", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、困難への対処法を見直し、より効果的な方法を探ります。続いて、新しいアプローチを実践し、成果を確認します。最後に、再び改善を加え、最適な解決策を確立します。突破口は、継続的な改善です。",
      tone: "story",
      suitability: "方法改善、アプローチ最適化、効率向上、継続的改良",
      caution: "完璧を求めすぎず、実行を重視する",
      label: "HJH",
      start: { hex: "水山蹇", pos: line },
      final: { hex: "水山蹇", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな困難から対処し、自信をつけます。続いて、徐々に大きな課題に取り組み、能力を高めます。最後に、どんな困難も恐れない強さを獲得し、人生の達人となります。突破口は、段階的な成長です。",
      tone: "story",
      suitability: "段階的成長、自信構築、能力開発、mastery",
      caution: "慢心せず、謙虚さを保つ",
      label: "HHJ",
      start: { hex: "水山蹇", pos: line },
      final: { hex: "水山蹇", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、困難を人生の一部として受け入れます。続いて、困難と上手に付き合い、それを糧にして成長します。最後に、困難が訪れても動じない、不動の心を獲得します。突破口は、困難との共生です。",
      tone: "story",
      suitability: "レジリエンス、適応力、精神的強さ、人生哲学",
      caution: "諦観に陥らず、改善努力は続ける",
      label: "HHH",
      start: { hex: "水山蹇", pos: line },
      final: { hex: "水山蹇", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 雷水解（40）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、こじれた問題が解きほぐされ、解決の糸口が見えてきます。続いて、障害が取り除かれ、物事がスムーズに進むようになります。最後に、完全な解放感と共に、新たな自由を獲得します。突破口は、縛りからの解放です。",
      tone: "story",
      suitability: "問題解決、解放、自由獲得、障害除去",
      caution: "解放感に浮かれず、次の準備も怠らない",
      label: "JJJ",
      start: { hex: "雷水解", pos: line },
      final: { hex: "雷水解", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、緊張状態が緩和され、リラックスできるようになります。続いて、心身の疲れが癒され、エネルギーが回復します。最後に、新たな視点から状況を見直し、より良い方向へ進み始めます。突破口は、緊張からの解放です。",
      tone: "story",
      suitability: "ストレス解消、リラックス、回復、リフレッシュ",
      caution: "気を緩めすぎず、適度な緊張感は保つ",
      label: "JJH",
      start: { hex: "雷水解", pos: line },
      final: { hex: "雷水解", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、誤解が解け、真実が明らかになります。続いて、コミュニケーションが改善され、理解が深まります。最後に、より深い次元での和解が成立し、新たな関係が始まります。突破口は、誤解を解く対話です。",
      tone: "story",
      suitability: "誤解解消、和解、関係改善、相互理解",
      caution: "表面的な和解に終わらせず、本質的な解決を図る",
      label: "JHJ",
      start: { hex: "雷水解", pos: line },
      final: { hex: "雷水解", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、複雑に絡まった問題を一つずつ解きほぐします。続いて、体系的に整理し、解決策を実行します。最後に、すべてが解決され、クリアな状態を実現します。突破口は、段階的な問題解決です。",
      tone: "story",
      suitability: "複雑問題解決、体系的整理、段階的解決、完全解決",
      caution: "性急に解決しようとせず、着実に進める",
      label: "JHH",
      start: { hex: "雷水解", pos: line },
      final: { hex: "雷水解", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しい解決方法を発見し、画期的な突破口を開きます。続いて、その方法を応用し、多くの問題を解決します。最後に、革新的な解決システムが確立され、恒久的な解決を実現します。突破口は、創造的な解決法です。",
      tone: "story",
      suitability: "革新的解決、ブレークスルー、新手法、システム化",
      caution: "新しさに固執せず、実効性を重視する",
      label: "HJJ",
      start: { hex: "雷水解", pos: line },
      final: { hex: "雷水解", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、解決プロセスを見直し、より効率的な方法を探ります。続いて、改善された方法で実践し、効果を確認します。最後に、再び最適化を図り、理想的な解決システムを構築します。突破口は、解決力の継続的向上です。",
      tone: "story",
      suitability: "プロセス改善、効率化、最適化、システム構築",
      caution: "形式にとらわれず、実質的な解決を目指す",
      label: "HJH",
      start: { hex: "雷水解", pos: line },
      final: { hex: "雷水解", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな問題から解決し、成功体験を積みます。続いて、より大きな問題に取り組み、解決能力を高めます。最後に、どんな問題も解決できる力を獲得し、問題解決のエキスパートとなります。突破口は、経験の蓄積です。",
      tone: "story",
      suitability: "スキル向上、経験蓄積、問題解決力、エキスパート",
      caution: "過信せず、新しい問題にも謙虚に対処する",
      label: "HHJ",
      start: { hex: "雷水解", pos: line },
      final: { hex: "雷水解", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、問題が自然に解消される時を待ちます。続いて、無理なく解決が進み、調和が回復します。最後に、すべてが自然な流れの中で解決し、平和な状態が訪れます。突破口は、自然の摂理に従うことです。",
      tone: "story",
      suitability: "自然解決、時間的解決、調和回復、平和的解決",
      caution: "受動的になりすぎず、必要な行動は取る",
      label: "HHH",
      start: { hex: "雷水解", pos: line },
      final: { hex: "雷水解", pos: line },
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
    '風火家人': [1,0,1,0,1,1],   // 風火家人（37）巽上離下
    '火沢睽': [1,1,0,1,0,1],     // 火沢睽（38）離上兌下
    '水山蹇': [0,1,0,1,0,0],     // 水山蹇（39）坎上艮下
    '雷水解': [0,1,0,0,1,0]      // 雷水解（40）震上坎下
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