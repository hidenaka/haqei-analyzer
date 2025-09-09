const fs = require('fs');
const path = require('path');

// データファイルのパス
const dataPath = path.join(__dirname, '../public/data/narratives_chain.v1.json');

// 既存データを読み込む
const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 次の4卦のナラティブを作成
const hexagrams = [
  { name: '火雷噬嗑', position: 21 },
  { name: '山火賁', position: 22 },
  { name: '山地剥', position: 23 },
  { name: '地雷復', position: 24 }
];

const newNarratives = [];

// 火雷噬嗑（21）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、障害となっている要素を明確に特定し、除去の必要性を認識します。続いて、断固とした決断により障害を取り除き、道を切り開いていきます。最後に、クリアな状態で本来の目的に向かって前進し、成果を実現します。突破口は、躊躇せずに必要な決断を下すことです。",
      tone: "story",
      suitability: "障害除去、問題解決、決断実行、法的対処",
      caution: "過度に攻撃的にならず、必要最小限の措置に留める",
      label: "JJJ",
      start: { hex: "火雷噬嗑", pos: line },
      final: { hex: "火雷噬嗑", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、問題の核心を噛み砕いて理解し、解決への道筋を見出します。続いて、粘り強く取り組み、一つずつ障害を克服していきます。最後に、新たな視点から全体を見直し、根本的な解決策を実施します。突破口は、表面的な対処から本質的な解決への移行です。",
      tone: "story",
      suitability: "紛争解決、調停、交渉、利害調整",
      caution: "感情的にならず、公正な立場を保つ",
      label: "JJH",
      start: { hex: "火雷噬嗑", pos: line },
      final: { hex: "火雷噬嗑", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、明確な基準とルールを設定し、公正な判断の基盤を作ります。続いて、実際の運用を通じて基準を調整し、より適切な形に改善します。最後に、確立された秩序のもとで、持続的な発展を実現します。突破口は、公正さと実効性のバランスです。",
      tone: "story",
      suitability: "規則制定、ガバナンス、コンプライアンス、秩序確立",
      caution: "硬直的にならず、柔軟性も保つ",
      label: "JHJ",
      start: { hex: "火雷噬嗑", pos: line },
      final: { hex: "火雷噬嗑", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、強い意志を持って困難な課題に取り組み、突破口を開きます。続いて、成功体験を基に方法論を確立し、効率化を図ります。最後に、システム化された解決プロセスを構築し、再現性を高めます。突破口は、個人の力を組織の力へと昇華させることです。",
      tone: "story",
      suitability: "困難克服、ブレークスルー、革新的解決、チャレンジ",
      caution: "無理な突破により疲弊しない",
      label: "JHH",
      start: { hex: "火雷噬嗑", pos: line },
      final: { hex: "火雷噬嗑", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既存の方法では解決できない問題に直面し、新たなアプローチを模索します。続いて、創造的な発想により画期的な解決策を見出します。最後に、その成功を基盤にさらなる革新を重ねていきます。突破口は、常識にとらわれない柔軟な思考です。",
      tone: "story",
      suitability: "イノベーション、破壊的創造、パラダイムシフト、革新",
      caution: "革新のための革新にならないよう注意する",
      label: "HJJ",
      start: { hex: "火雷噬嗑", pos: line },
      final: { hex: "火雷噬嗑", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、対立する要素を調整し、妥協点を探ります。続いて、双方が納得できる解決策を実施し、関係を改善します。最後に、再び調整を重ね、より安定した関係を構築します。突破口は、対立を協力へと転換する知恵です。",
      tone: "story",
      suitability: "和解、調停、関係修復、バランス調整",
      caution: "妥協が弱腰と見られないよう配慮する",
      label: "HJH",
      start: { hex: "火雷噬嗑", pos: line },
      final: { hex: "火雷噬嗑", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな問題から解決し、成功体験を積み重ねます。続いて、徐々に難度を上げ、解決能力を向上させます。最後に、大きな障害に対しても自信を持って対処できるようになります。突破口は、段階的な成長による確実な力の獲得です。",
      tone: "story",
      suitability: "スキル向上、段階的解決、能力開発、自信構築",
      caution: "小さな成功に満足せず、大きな目標を見失わない",
      label: "HHJ",
      start: { hex: "火雷噬嗑", pos: line },
      final: { hex: "火雷噬嗑", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、問題解決のプロセスを標準化し、効率を高めます。続いて、継続的な改善により手法を洗練させます。最後に、あらゆる問題に対応できる柔軟なシステムを確立します。突破口は、経験を知識として体系化することです。",
      tone: "story",
      suitability: "プロセス改善、標準化、ナレッジマネジメント、組織学習",
      caution: "マニュアル化により創造性を失わない",
      label: "HHH",
      start: { hex: "火雷噬嗑", pos: line },
      final: { hex: "火雷噬嗑", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 山火賁（22）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、内面の美しさを磨き、本質的な価値を高めます。続いて、その内面の輝きが外面にも現れ、全体的な調和が生まれます。最後に、洗練された美が完成し、人々を魅了する存在となります。突破口は、表面的な装飾より本質的な美を追求することです。",
      tone: "story",
      suitability: "ブランディング、イメージ向上、文化創造、美的追求",
      caution: "見かけ倒しにならず、実質も伴わせる",
      label: "JJJ",
      start: { hex: "山火賁", pos: line },
      final: { hex: "山火賁", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、素材の良さを活かし、最小限の装飾で美しさを表現します。続いて、細部にこだわり、全体の完成度を高めていきます。最後に、新たな美意識を提案し、価値観の転換をもたらします。突破口は、引き算の美学による本質の際立たせです。",
      tone: "story",
      suitability: "デザイン、プレゼンテーション、コミュニケーション改善、演出",
      caution: "過度な簡素化により魅力を失わない",
      label: "JJH",
      start: { hex: "山火賁", pos: line },
      final: { hex: "山火賁", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、伝統的な美の形式を学び、基礎を固めます。続いて、現代的な要素を取り入れ、新旧の融合を図ります。最後に、独自のスタイルを確立し、新たな美の基準を創造します。突破口は、伝統と革新の創造的な統合です。",
      tone: "story",
      suitability: "文化継承、スタイル確立、アイデンティティ形成、独自性追求",
      caution: "奇をてらいすぎず、普遍的な美も大切にする",
      label: "JHJ",
      start: { hex: "山火賁", pos: line },
      final: { hex: "山火賁", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、明確なコンセプトを打ち出し、方向性を定めます。続いて、そのコンセプトを具現化し、統一感のある表現を実現します。最後に、細部まで完璧に仕上げ、完成度の高い作品とします。突破口は、一貫性のあるビジョンの実現です。",
      tone: "story",
      suitability: "作品制作、プロダクト開発、空間デザイン、総合演出",
      caution: "完璧主義に陥らず、適度なところで完成とする",
      label: "JHH",
      start: { hex: "山火賁", pos: line },
      final: { hex: "山火賁", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既存の美の概念を問い直し、新たな可能性を探ります。続いて、実験的な表現を通じて、美の境界を拡張していきます。最後に、革新的な美意識が認められ、新たなトレンドを生み出します。突破口は、常識にとらわれない自由な発想です。",
      tone: "story",
      suitability: "アート、前衛的表現、トレンドセッティング、価値創造",
      caution: "独りよがりにならず、共感も得られるよう工夫する",
      label: "HJJ",
      start: { hex: "山火賁", pos: line },
      final: { hex: "山火賁", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、表現方法を見直し、より効果的な伝え方を模索します。続いて、受け手の反応を観察し、表現を洗練させます。最後に、再び全体を調整し、最適なバランスを実現します。突破口は、送り手と受け手の共鳴です。",
      tone: "story",
      suitability: "コミュニケーションデザイン、UX改善、顧客体験、共感創出",
      caution: "技巧に走りすぎず、真心も込める",
      label: "HJH",
      start: { hex: "山火賁", pos: line },
      final: { hex: "山火賁", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、日常の中に美を見出し、生活を豊かにします。続いて、美意識を高め、より繊細な感性を養います。最後に、美的センスが身につき、自然に美しいものを創造できるようになります。突破口は、美を特別なものではなく日常とすることです。",
      tone: "story",
      suitability: "ライフスタイル、日常の美化、感性教育、文化的素養",
      caution: "形式美にとらわれず、心の美しさも大切にする",
      label: "HHJ",
      start: { hex: "山火賁", pos: line },
      final: { hex: "山火賁", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、調和とバランスを重視し、穏やかな美を追求します。続いて、細やかな配慮により、全体の品格を高めます。最後に、時を経ても色褪せない普遍的な美を実現します。突破口は、派手さより品格を重視することです。",
      tone: "story",
      suitability: "品格向上、格調高い表現、クラシックスタイル、永続的価値",
      caution: "地味になりすぎず、適度な華やかさも加える",
      label: "HHH",
      start: { hex: "山火賁", pos: line },
      final: { hex: "山火賁", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 山地剥（23）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、衰退の兆候を察知し、崩壊の危険性を認識します。続いて、守るべきものを明確にし、防御態勢を整えます。最後に、最小限の損失で危機を乗り切り、再生への道を準備します。突破口は、無理な抵抗より戦略的撤退の選択です。",
      tone: "story",
      suitability: "リスク管理、危機対応、撤退戦略、損失最小化",
      caution: "諦めが早すぎず、可能性は最後まで探る",
      label: "JJJ",
      start: { hex: "山地剥", pos: line },
      final: { hex: "山地剥", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、表面的な繁栄の裏にある脆弱性を見抜きます。続いて、崩壊が始まる前に対策を講じ、被害を最小限に抑えます。最後に、新たな視点から再構築の計画を立て、次なる成長への準備を整えます。突破口は、破壊を創造の機会として捉えることです。",
      tone: "story",
      suitability: "事業撤退、組織解体、システム更新、creative destruction",
      caution: "性急な判断により回復の芽を摘まない",
      label: "JJH",
      start: { hex: "山地剥", pos: line },
      final: { hex: "山地剥", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、古いものが剥がれ落ちることを受け入れ、執着を手放します。続いて、本当に必要なものだけを残し、身軽になります。最後に、新しい土台の上に、より強固な構造を築き始めます。突破口は、喪失を浄化と再生の過程として理解することです。",
      tone: "story",
      suitability: "断捨離、リストラクチャリング、本質回帰、ミニマリズム",
      caution: "必要なものまで捨てないよう慎重に判断する",
      label: "JHJ",
      start: { hex: "山地剥", pos: line },
      final: { hex: "山地剥", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、崩壊のプロセスを管理し、秩序ある撤退を実行します。続いて、残された資源を効率的に活用し、次への準備を進めます。最後に、教訓を活かした新しい計画を立案し、実行に移します。突破口は、終わりを新たな始まりとして設計することです。",
      tone: "story",
      suitability: "計画的縮小、ソフトランディング、段階的移行、再編成",
      caution: "撤退が敗北にならないよう、次の一手を準備する",
      label: "JHH",
      start: { hex: "山地剥", pos: line },
      final: { hex: "山地剥", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既存のシステムの限界を認識し、根本的な変革の必要性を理解します。続いて、創造的破壊を通じて、新しい可能性を開きます。最後に、革新的な構造が形成され、次世代のシステムが誕生します。突破口は、破壊を恐れない勇気です。",
      tone: "story",
      suitability: "イノベーション、ディスラプション、paradigm shift、革命的変化",
      caution: "破壊が目的化しないよう、建設的な側面も重視する",
      label: "HJJ",
      start: { hex: "山地剥", pos: line },
      final: { hex: "山地剥", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、崩壊の速度を調整し、ソフトランディングを図ります。続いて、部分的な再生を試み、可能性を探ります。最後に、再び調整を加え、持続可能な形を見出します。突破口は、完全な崩壊を避ける巧みな管理です。",
      tone: "story",
      suitability: "危機管理、ダメージコントロール、段階的回復、緩やかな転換",
      caution: "延命が苦痛を長引かせないよう判断する",
      label: "HJH",
      start: { hex: "山地剥", pos: line },
      final: { hex: "山地剥", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな損失を受け入れ、大きな崩壊を防ぎます。続いて、残された強みを活かし、局地的な成功を積み重ねます。最後に、蓄積された小さな成功が、全体的な回復へとつながります。突破口は、部分的な犠牲による全体の保全です。",
      tone: "story",
      suitability: "選択と集中、資源の再配分、優先順位付け、戦略的撤退",
      caution: "小さな成功に満足せず、大局を見失わない",
      label: "HHJ",
      start: { hex: "山地剥", pos: line },
      final: { hex: "山地剥", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、崩壊のサイクルを理解し、自然な流れとして受け入れます。続いて、崩壊の中にある成長の種を見出し、育てます。最後に、新旧の循環が調和し、持続的な発展の基盤が整います。突破口は、破壊と創造のサイクルを味方につけることです。",
      tone: "story",
      suitability: "循環型思考、サステナビリティ、レジリエンス、自然との調和",
      caution: "諦観に陥らず、積極的な関与も続ける",
      label: "HHH",
      start: { hex: "山地剥", pos: line },
      final: { hex: "山地剥", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 地雷復（24）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、底を打った状況から、わずかな回復の兆しを見出します。続いて、その小さな芽を大切に育て、徐々に力を取り戻していきます。最後に、完全な復活を遂げ、以前より強い状態へと成長します。突破口は、最初の一歩を踏み出す勇気です。",
      tone: "story",
      suitability: "再起、復活、リカバリー、セカンドチャンス",
      caution: "性急な回復を求めず、着実に進む",
      label: "JJJ",
      start: { hex: "地雷復", pos: line },
      final: { hex: "地雷復", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、失敗や挫折から立ち直り、新たなスタートを切ります。続いて、過去の経験を活かし、より賢明な選択をしていきます。最後に、新しい視点から人生を見直し、意味深い成功を実現します。突破口は、失敗を成長の糧とする姿勢です。",
      tone: "story",
      suitability: "再チャレンジ、経験活用、成長機会、レジリエンス構築",
      caution: "過去のトラウマに囚われず、前を向く",
      label: "JJH",
      start: { hex: "地雷復", pos: line },
      final: { hex: "地雷復", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、原点に立ち返り、初心を思い出します。続いて、基本を見直し、土台を固め直します。最後に、新たな決意のもと、より高い目標に向かって再出発します。突破口は、初心忘るべからずの精神です。",
      tone: "story",
      suitability: "初心回帰、基本復習、リセット、新規一転",
      caution: "過去の成功体験に頼りすぎない",
      label: "JHJ",
      start: { hex: "地雷復", pos: line },
      final: { hex: "地雷復", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、エネルギーを回復し、活力を取り戻します。続いて、計画を練り直し、より現実的な目標を設定します。最後に、持続可能なペースで着実に前進し、安定した成長を実現します。突破口は、無理のない自然な回復プロセスです。",
      tone: "story",
      suitability: "体力回復、メンタルヘルス、持続可能な成長、ワークライフバランス",
      caution: "回復を急ぎすぎて再び疲弊しない",
      label: "JHH",
      start: { hex: "地雷復", pos: line },
      final: { hex: "地雷復", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しい環境や条件を受け入れ、適応を始めます。続いて、変化した状況の中で新たな可能性を発見します。最後に、予想以上の成果を上げ、転機を成功へと変えます。突破口は、変化を機会として捉える柔軟性です。",
      tone: "story",
      suitability: "環境適応、転機活用、新天地開拓、キャリアチェンジ",
      caution: "新しさに浮かれず、地に足をつける",
      label: "HJJ",
      start: { hex: "地雷復", pos: line },
      final: { hex: "地雷復", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、回復の方法を見直し、より効果的なアプローチを採用します。続いて、部分的な成功を確認し、自信を取り戻します。最後に、全体的な調整を加え、完全な回復を実現します。突破口は、段階的かつ戦略的な回復計画です。",
      tone: "story",
      suitability: "リハビリテーション、段階的回復、システム復旧、組織再建",
      caution: "部分的成功に満足せず、全体的回復を目指す",
      label: "HJH",
      start: { hex: "地雷復", pos: line },
      final: { hex: "地雷復", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな改善から始め、徐々に勢いをつけていきます。続いて、改善の積み重ねが相乗効果を生み、加速度的に回復します。最後に、完全な復活を遂げ、新たな高みへと到達します。突破口は、小さな一歩の積み重ねが大きな変化を生むことです。",
      tone: "story",
      suitability: "漸進的改善、スモールステップ、習慣形成、継続的成長",
      caution: "進歩が遅くても諦めない",
      label: "HHJ",
      start: { hex: "地雷復", pos: line },
      final: { hex: "地雷復", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、サイクルとしての復活を理解し、自然な流れに身を委ねます。続いて、春の訪れのように、生命力が自然に回復していきます。最後に、新たな成長期を迎え、豊かな実りへと向かいます。突破口は、自然の摂理に従った無理のない回復です。",
      tone: "story",
      suitability: "自然回復、季節的変化、サイクル理解、循環型成長",
      caution: "受動的になりすぎず、能動的な努力も続ける",
      label: "HHH",
      start: { hex: "地雷復", pos: line },
      final: { hex: "地雷復", pos: line },
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
    '火雷噬嗑': [1,0,1,1,0,1], // 火雷噬嗑（21）離上震下
    '山火賁': [1,0,1,0,0,1],   // 山火賁（22）艮上離下
    '山地剥': [0,0,0,0,0,1],   // 山地剥（23）艮上坤下
    '地雷復': [1,0,0,0,0,0]    // 地雷復（24）坤上震下
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