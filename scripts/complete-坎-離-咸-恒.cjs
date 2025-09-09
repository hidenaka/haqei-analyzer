const fs = require('fs');
const path = require('path');

// データファイルのパス
const dataPath = path.join(__dirname, '../public/data/narratives_chain.v1.json');

// 既存データを読み込む
const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 次の4卦のナラティブを作成
const hexagrams = [
  { name: '坎為水', position: 29 },
  { name: '離為火', position: 30 },
  { name: '沢山咸', position: 31 },
  { name: '雷風恒', position: 32 }
];

const newNarratives = [];

// 坎為水（29）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、困難な状況に陥っても、冷静さを保ち、脱出の道を探ります。続いて、危険を回避しながら慎重に前進し、徐々に状況を改善していきます。最後に、困難を乗り越えた経験が強さとなり、どんな逆境にも対処できる力を獲得します。突破口は、危険を恐れず、かつ軽視もしない姿勢です。",
      tone: "story",
      suitability: "危機管理、困難克服、リスク対応、逆境突破",
      caution: "無謀な行動を避け、慎重に判断する",
      label: "JJJ",
      start: { hex: "坎為水", pos: line },
      final: { hex: "坎為水", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、水のように柔軟に形を変え、障害を回避します。続いて、流れに乗りながら目的地へ向かい、着実に前進します。最後に、新たな視点から道を見出し、より効率的なルートを発見します。突破口は、硬直せず流動的に対応することです。",
      tone: "story",
      suitability: "柔軟対応、適応力、流動的思考、障害回避",
      caution: "流されるだけでなく、方向性を保つ",
      label: "JJH",
      start: { hex: "坎為水", pos: line },
      final: { hex: "坎為水", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、深い淵に沈み、底を経験します。続いて、浮上するための力を蓄え、上昇の機会を待ちます。最後に、再び深みに潜り、より深い理解と洞察を得ます。突破口は、深さを恐れず探求する勇気です。",
      tone: "story",
      suitability: "深層探求、内省、本質理解、精神的深化",
      caution: "深みにはまりすぎて抜け出せなくならない",
      label: "JHJ",
      start: { hex: "坎為水", pos: line },
      final: { hex: "坎為水", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、危険を察知し、適切な防御策を講じます。続いて、リスクを管理しながら、必要な行動を取ります。最後に、安全システムを確立し、持続的な安定を実現します。突破口は、危険と安全のバランス管理です。",
      tone: "story",
      suitability: "リスク管理、安全確保、防災対策、危機予防",
      caution: "過度に保守的にならず、必要なリスクは取る",
      label: "JHH",
      start: { hex: "坎為水", pos: line },
      final: { hex: "坎為水", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既存の方法では突破できない困難に直面します。続いて、創造的な発想で新たな道を切り開きます。最後に、その成功体験を基に、さらなる困難にも挑戦します。突破口は、常識にとらわれない柔軟な発想です。",
      tone: "story",
      suitability: "創造的問題解決、イノベーション、ブレークスルー、新規開拓",
      caution: "奇抜すぎて実現不可能にならないよう注意",
      label: "HJJ",
      start: { hex: "坎為水", pos: line },
      final: { hex: "坎為水", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、危険な状況を慎重に分析し、対策を立てます。続いて、実践を通じて対応力を高めます。最後に、再び状況を見直し、より洗練された対処法を確立します。突破口は、経験から学ぶ適応力です。",
      tone: "story",
      suitability: "スキル向上、経験学習、対応力強化、実践的成長",
      caution: "理論だけでなく、実践も重視する",
      label: "HJH",
      start: { hex: "坎為水", pos: line },
      final: { hex: "坎為水", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな困難から対処し、経験を積みます。続いて、徐々に大きな課題に取り組み、能力を拡張します。最後に、どんな困難にも動じない強靭な精神力を獲得します。突破口は、段階的な成長による確実な進歩です。",
      tone: "story",
      suitability: "段階的成長、スキルビルディング、耐性構築、着実な進歩",
      caution: "慢心せず、常に警戒心を保つ",
      label: "HHJ",
      start: { hex: "坎為水", pos: line },
      final: { hex: "坎為水", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、水の性質を理解し、その流れに逆らわない生き方を学びます。続いて、柔軟性と適応力を身につけ、どんな環境でも生き抜く力を養います。最後に、水のような自然体で、困難を困難と感じない境地に到達します。突破口は、抵抗しない強さです。",
      tone: "story",
      suitability: "自然体、無理のない生き方、適応的生存、レジリエンス",
      caution: "受動的になりすぎず、主体性も保つ",
      label: "HHH",
      start: { hex: "坎為水", pos: line },
      final: { hex: "坎為水", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 離為火（30）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、内なる情熱に火がつき、明確な目標が見えてきます。続いて、その炎を燃やし続け、周囲を照らし導いていきます。最後に、光明が広がり、多くの人々に希望と勇気を与える存在となります。突破口は、情熱を持続させる燃料の確保です。",
      tone: "story",
      suitability: "情熱的取り組み、啓発活動、リーダーシップ、インスピレーション",
      caution: "燃え尽きないよう、適度な休息も取る",
      label: "JJJ",
      start: { hex: "離為火", pos: line },
      final: { hex: "離為火", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな火種から始まり、徐々に炎を大きくしていきます。続いて、安定した燃焼を維持し、持続的な光を放ちます。最後に、新たな視点から火の使い方を見直し、より効果的な活用法を見出します。突破口は、激しさと持続性のバランスです。",
      tone: "story",
      suitability: "持続的成長、安定的発展、エネルギー管理、長期的情熱",
      caution: "急激な燃焼により早期に燃え尽きない",
      label: "JJH",
      start: { hex: "離為火", pos: line },
      final: { hex: "離為火", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、明晰な意識で物事を見通し、本質を理解します。続いて、その理解を実践に移し、具体的な成果を生み出します。最後に、より深い洞察に到達し、智慧の光を放つようになります。突破口は、知識を智慧へと昇華させることです。",
      tone: "story",
      suitability: "洞察力向上、明晰性、知的探求、智慧の獲得",
      caution: "理論に偏らず、実践も重視する",
      label: "JHJ",
      start: { hex: "離為火", pos: line },
      final: { hex: "離為火", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、強い輝きを放ち、注目を集めます。続いて、その光を適切に調整し、眩しすぎない程度に保ちます。最後に、安定した光源として、継続的に周囲を照らし続けます。突破口は、派手さより実用性を重視することです。",
      tone: "story",
      suitability: "プレゼンス、影響力、ブランディング、存在感",
      caution: "目立ちすぎて反感を買わない",
      label: "JHH",
      start: { hex: "離為火", pos: line },
      final: { hex: "離為火", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しい光の当て方を試み、隠れていたものを明らかにします。続いて、その発見を基に革新的なアイデアを生み出します。最後に、創造の炎が燃え上がり、画期的な成果を実現します。突破口は、既存の枠を超えた発想です。",
      tone: "story",
      suitability: "創造性、イノベーション、新発見、革新的思考",
      caution: "独創性を追求しすぎて、実用性を失わない",
      label: "HJJ",
      start: { hex: "離為火", pos: line },
      final: { hex: "離為火", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、光の強さを調整し、状況に応じた照らし方を工夫します。続いて、効果的な照明により、物事の本質を浮かび上がらせます。最後に、再び調整を加え、最適な明るさを実現します。突破口は、適切な光量の見極めです。",
      tone: "story",
      suitability: "状況対応、柔軟な表現、適応的コミュニケーション、調整力",
      caution: "優柔不断にならず、必要な時は強く照らす",
      label: "HJH",
      start: { hex: "離為火", pos: line },
      final: { hex: "離為火", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな光から始め、徐々に明るさを増していきます。続いて、安定した光を維持し、信頼できる光源となります。最後に、大きな輝きを放ち、広範囲を照らすようになります。突破口は、着実な成長による確実な発展です。",
      tone: "story",
      suitability: "段階的成長、信頼構築、着実な発展、影響力拡大",
      caution: "急ぎすぎて基盤を疎かにしない",
      label: "HHJ",
      start: { hex: "離為火", pos: line },
      final: { hex: "離為火", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、内なる光を育て、自己の輝きを高めます。続いて、その光で他者を照らし、共に成長していきます。最後に、光の連鎖が生まれ、世界がより明るくなっていきます。突破口は、与えることで増える光の性質です。",
      tone: "story",
      suitability: "自己成長、他者支援、相互啓発、ポジティブな連鎖",
      caution: "自己犠牲にならず、自分の光も保つ",
      label: "HHH",
      start: { hex: "離為火", pos: line },
      final: { hex: "離為火", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 沢山咸（31）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、心が動き、相手への関心が芽生えます。続いて、感応が深まり、互いに惹かれ合う関係が形成されていきます。最後に、深い結びつきが生まれ、一体感のある関係性が確立されます。突破口は、素直な感情表現です。",
      tone: "story",
      suitability: "恋愛、パートナーシップ、感情的結びつき、親密な関係",
      caution: "感情に流されすぎず、理性も保つ",
      label: "JJJ",
      start: { hex: "沢山咸", pos: line },
      final: { hex: "沢山咸", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、微細な感覚を研ぎ澄まし、相手の気持ちを察知します。続いて、共感を深め、心の通い合いを実現します。最後に、新たなレベルの理解に到達し、言葉を超えた交流が可能になります。突破口は、感受性の向上です。",
      tone: "story",
      suitability: "共感力、感受性、直感的理解、非言語コミュニケーション",
      caution: "過敏になりすぎて疲れない",
      label: "JJH",
      start: { hex: "沢山咸", pos: line },
      final: { hex: "沢山咸", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、感動する心を大切にし、純粋な喜びを味わいます。続いて、日常の中で感動を見出し、生活を豊かにします。最後に、より深い感動を求め、人生の意味を見出していきます。突破口は、感動する心を失わないことです。",
      tone: "story",
      suitability: "感性豊か、芸術的感受性、情緒的豊かさ、人生の喜び",
      caution: "感傷的になりすぎず、前向きさを保つ",
      label: "JHJ",
      start: { hex: "沢山咸", pos: line },
      final: { hex: "沢山咸", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、強い感応により、運命的な出会いを経験します。続いて、その関係を大切に育て、絆を深めていきます。最後に、安定した関係性を築き、永続的なパートナーシップを実現します。突破口は、一期一会の精神です。",
      tone: "story",
      suitability: "運命的出会い、ソウルメイト、深い絆、永続的関係",
      caution: "理想化しすぎず、現実も直視する",
      label: "JHH",
      start: { hex: "沢山咸", pos: line },
      final: { hex: "沢山咸", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しい感覚や感情を体験し、世界が広がります。続いて、その体験を深め、人生が豊かになっていきます。最後に、感性が研ぎ澄まされ、微細な美しさも感じ取れるようになります。突破口は、新しい体験への開放性です。",
      tone: "story",
      suitability: "新体験、感性開発、美的感覚、人生の豊かさ",
      caution: "刺激を求めすぎて、本質を見失わない",
      label: "HJJ",
      start: { hex: "沢山咸", pos: line },
      final: { hex: "沢山咸", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、感情表現の方法を見直し、より適切な伝え方を模索します。続いて、相手の反応を見ながら、コミュニケーションを深めます。最後に、再び調整を加え、最適な関係性を築きます。突破口は、相手に合わせた感情表現です。",
      tone: "story",
      suitability: "感情調整、関係改善、コミュニケーション向上、相互理解",
      caution: "自分を偽らず、素直さも大切にする",
      label: "HJH",
      start: { hex: "沢山咸", pos: line },
      final: { hex: "沢山咸", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな感動から始め、感受性を養います。続いて、感動の積み重ねが心を豊かにし、人格を形成していきます。最後に、深い感性が身につき、人生全体が感動に満ちたものになります。突破口は、日常の中の小さな感動を大切にすることです。",
      tone: "story",
      suitability: "感性教育、情操教育、人格形成、心の成長",
      caution: "理性とのバランスを保つ",
      label: "HHJ",
      start: { hex: "沢山咸", pos: line },
      final: { hex: "沢山咸", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、感情の波を受け入れ、自然に任せます。続いて、感情と上手に付き合い、コントロールできるようになります。最後に、感情が安定し、穏やかな心境を保てるようになります。突破口は、感情を敵視せず友とすることです。",
      tone: "story",
      suitability: "感情管理、心の安定、情緒的成熟、内的平和",
      caution: "感情を抑圧せず、健全に表現する",
      label: "HHH",
      start: { hex: "沢山咸", pos: line },
      final: { hex: "沢山咸", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 雷風恒（32）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、変わらない価値を見出し、それを守り続ける決意を固めます。続いて、時の試練に耐え、一貫性を保ちながら前進します。最後に、永続的な価値が認められ、時代を超えた存在となります。突破口は、変化の中で不変を保つ意志です。",
      tone: "story",
      suitability: "永続性、一貫性、伝統継承、持続可能性",
      caution: "頑固になりすぎず、必要な変化は受け入れる",
      label: "JJJ",
      start: { hex: "雷風恒", pos: line },
      final: { hex: "雷風恒", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、日々の実践を積み重ね、習慣として定着させます。続いて、その継続が力となり、着実な成果を生み出します。最後に、新たな視点から継続の意味を理解し、より高い次元での恒常性を実現します。突破口は、小さな継続が大きな変化を生むことです。",
      tone: "story",
      suitability: "習慣形成、継続力、地道な努力、長期的成果",
      caution: "マンネリ化を避け、改善も続ける",
      label: "JJH",
      start: { hex: "雷風恒", pos: line },
      final: { hex: "雷風恒", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、恒常的な原理を理解し、それに基づいて行動します。続いて、状況に応じて表現を調整しながら、本質を保ちます。最後に、より深い恒常性に到達し、変化と不変の調和を実現します。突破口は、柔軟性のある恒常性です。",
      tone: "story",
      suitability: "原則と応用、本質保持、適応的一貫性、dynamic stability",
      caution: "原理主義に陥らず、現実的に対応する",
      label: "JHJ",
      start: { hex: "雷風恒", pos: line },
      final: { hex: "雷風恒", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、長期的なビジョンを持ち、それに向かって着実に進みます。続いて、計画を実行し、milestone を達成していきます。最後に、ビジョンが現実となり、持続的な成功を実現します。突破口は、遠大な目標と日々の実践の結合です。",
      tone: "story",
      suitability: "長期計画、ビジョン実現、戦略的持続、目標達成",
      caution: "計画に固執せず、必要な修正は行う",
      label: "JHH",
      start: { hex: "雷風恒", pos: line },
      final: { hex: "雷風恒", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しい持続可能な仕組みを構築し、実験を始めます。続いて、その仕組みが機能し、安定的な成果を生み出します。最後に、さらなる改良を加え、完璧なシステムへと進化させます。突破口は、革新的な持続モデルの創造です。",
      tone: "story",
      suitability: "システム構築、持続可能モデル、イノベーション、新たな恒常性",
      caution: "新しさを追求しすぎて、安定性を損なわない",
      label: "HJJ",
      start: { hex: "雷風恒", pos: line },
      final: { hex: "雷風恒", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、継続方法を見直し、より効率的な形を探ります。続いて、改善された方法で実践し、成果を確認します。最後に、再び最適化を図り、理想的な継続システムを確立します。突破口は、継続自体の継続的改善です。",
      tone: "story",
      suitability: "プロセス改善、効率化、最適化、継続的改良",
      caution: "改善に夢中になり、継続を忘れない",
      label: "HJH",
      start: { hex: "雷風恒", pos: line },
      final: { hex: "雷風恒", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな約束を守ることから始め、信頼を築きます。続いて、より大きな責任を引き受け、それを果たしていきます。最後に、絶対的な信頼を獲得し、恒常的な関係性を確立します。突破口は、小さな約束の積み重ねです。",
      tone: "story",
      suitability: "信頼構築、責任遂行、約束履行、関係性維持",
      caution: "無理な約束をせず、実行可能な範囲で行う",
      label: "HHJ",
      start: { hex: "雷風恒", pos: line },
      final: { hex: "雷風恒", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、日常のリズムを整え、安定した生活を送ります。続いて、そのリズムが自然となり、無理なく継続できるようになります。最後に、恒常性が第二の天性となり、effortless な持続を実現します。突破口は、自然なリズムの発見です。",
      tone: "story",
      suitability: "生活リズム、ルーティン、自然な継続、持続的健康",
      caution: "機械的にならず、人間らしさも保つ",
      label: "HHH",
      start: { hex: "雷風恒", pos: line },
      final: { hex: "雷風恒", pos: line },
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
    '坎為水': [0,1,0,0,1,0],   // 坎為水（29）坎上坎下
    '離為火': [1,0,1,1,0,1],   // 離為火（30）離上離下
    '沢山咸': [0,0,1,1,1,0],   // 沢山咸（31）兌上艮下
    '雷風恒': [0,1,1,1,1,0]    // 雷風恒（32）震上巽下
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