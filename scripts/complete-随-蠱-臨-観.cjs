const fs = require('fs');
const path = require('path');

// データファイルのパス
const dataPath = path.join(__dirname, '../public/data/narratives_chain.v1.json');

// 既存データを読み込む
const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 次の4卦のナラティブを作成
const hexagrams = [
  { name: '沢雷随', position: 17 },
  { name: '山風蠱', position: 18 },
  { name: '地沢臨', position: 19 },
  { name: '風地観', position: 20 }
];

const patterns = [
  { label: 'JJJ', description: '一貫深化' },
  { label: 'JJH', description: '二段深化→視点切替' },
  { label: 'JHJ', description: '深化→調整→深化' },
  { label: 'JHH', description: '深化→二段調整' },
  { label: 'HJJ', description: '調整→二段深化' },
  { label: 'HJH', description: '調整→深化→調整' },
  { label: 'HHJ', description: '二段調整→深化' },
  { label: 'HHH', description: '一貫調整' }
];

const newNarratives = [];

// 沢雷随（17）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、時代の流れを敏感に察知し、変化の兆しを見逃さずに捉えます。続いて、その流れに身を委ねながらも、自分の軸を保ち、適切に対応していきます。最後に、流れと一体となりながら、新たな価値を創造し、時代を共に作り上げていきます。突破口は、抵抗するのではなく、流れを活かして前進することです。",
      tone: "story",
      suitability: "市場変化への対応、トレンド把握、柔軟な戦略転換、時流適応",
      caution: "流されるだけでなく、主体性を保つ",
      label: "JJJ",
      start: { hex: "沢雷随", pos: line },
      final: { hex: "沢雷随", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、周囲の動きに注意を払い、重要な変化の信号を読み取ります。続いて、その変化に積極的に適応し、新しい環境での立ち位置を確立します。最後に、視点を転換し、単なる追随者から変化の先導者へと変わります。突破口は、受動的な適応から能動的な創造への転換です。",
      tone: "story",
      suitability: "リーダーシップ転換、フォロワーシップ、影響力構築、役割変更",
      caution: "盲目的な追従を避け、批判的思考を保つ",
      label: "JJH",
      start: { hex: "沢雷随", pos: line },
      final: { hex: "沢雷随", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、信頼できる人や組織との関係を構築し、協力体制を整えます。続いて、相互の利益を調整し、バランスの取れた関係を維持します。最後に、より深い信頼関係を築き、長期的なパートナーシップへと発展させます。突破口は、相手の立場を理解し、共に成長することです。",
      tone: "story",
      suitability: "パートナーシップ構築、協調関係、チームワーク、相互依存",
      caution: "依存関係に陥らず、健全な距離を保つ",
      label: "JHJ",
      start: { hex: "沢雷随", pos: line },
      final: { hex: "沢雷随", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、優れた指導者や師匠を見つけ、その教えに従います。続いて、学んだことを実践し、自分なりの理解を深めます。最後に、教えを自分のものとし、独自の道を歩み始めます。突破口は、素直に学ぶ姿勢と自立への意志の両立です。",
      tone: "story",
      suitability: "師弟関係、メンタリング、技能習得、伝統継承",
      caution: "盲信せず、自分で考える力を養う",
      label: "JHH",
      start: { hex: "沢雷随", pos: line },
      final: { hex: "沢雷随", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、固定観念を手放し、新しい可能性に心を開きます。続いて、異なる視点や価値観を積極的に取り入れ、視野を広げます。最後に、多様な要素を統合し、革新的な解決策を生み出します。突破口は、違いを恐れず、むしろ成長の機会として捉えることです。",
      tone: "story",
      suitability: "イノベーション、パラダイムシフト、多様性受容、創造的適応",
      caution: "自分の核心的価値観は見失わない",
      label: "HJJ",
      start: { hex: "沢雷随", pos: line },
      final: { hex: "沢雷随", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、現在の立場や方法を見直し、より適切な形を探ります。続いて、新しいアプローチを試み、その効果を検証します。最後に、再び調整を重ね、最適な形へと洗練させます。突破口は、変化を恐れず、常に改善を続ける姿勢です。",
      tone: "story",
      suitability: "プロセス改善、適応的管理、継続的最適化、アジャイル開発",
      caution: "変化のための変化にならないよう注意する",
      label: "HJH",
      start: { hex: "沢雷随", pos: line },
      final: { hex: "沢雷随", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな調整から始め、徐々に変化に慣れていきます。続いて、さらなる適応を重ね、柔軟性を高めます。最後に、大きな変革に踏み出し、質的な転換を実現します。突破口は、段階的な変化を通じて大きな変革への準備を整えることです。",
      tone: "story",
      suitability: "段階的改革、漸進的変化、リスク管理、慎重な転換",
      caution: "変化の速度が遅すぎて機会を逃さない",
      label: "HHJ",
      start: { hex: "沢雷随", pos: line },
      final: { hex: "沢雷随", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、環境の変化に対して柔軟に対応し、適応力を高めます。続いて、変化のパターンを理解し、予測能力を向上させます。最後に、変化を先取りし、主体的に環境を形成していきます。突破口は、反応的対応から予測的対応への進化です。",
      tone: "story",
      suitability: "環境適応、危機管理、レジリエンス構築、変化対応力",
      caution: "過度な変化により本質を見失わない",
      label: "HHH",
      start: { hex: "沢雷随", pos: line },
      final: { hex: "沢雷随", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 山風蠱（18）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、長年放置されてきた問題の本質を見極め、改革の必要性を認識します。続いて、腐敗した部分を取り除き、健全な要素を再生させていきます。最後に、新しい秩序を確立し、持続可能な体制を構築します。突破口は、問題を直視し、根本的な改革に取り組む勇気です。",
      tone: "story",
      suitability: "組織改革、腐敗除去、システム再構築、根本的改善",
      caution: "性急な改革により混乱を引き起こさない",
      label: "JJJ",
      start: { hex: "山風蠱", pos: line },
      final: { hex: "山風蠱", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、問題の症状を詳細に分析し、原因を特定します。続いて、段階的に改善策を実施し、効果を確認しながら進めます。最後に、新たな視点から全体を見直し、予防策を講じます。突破口は、対症療法から根治療法への転換です。",
      tone: "story",
      suitability: "問題解決、品質改善、不具合修正、システム改良",
      caution: "表面的な解決に満足せず、根本原因を追求する",
      label: "JJH",
      start: { hex: "山風蠱", pos: line },
      final: { hex: "山風蠱", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、過去の遺産や伝統の中から価値あるものを見出します。続いて、現代的な文脈で再解釈し、新たな意味を付与します。最後に、古いものと新しいものを融合させ、革新的な価値を創造します。突破口は、破壊ではなく再生という視点です。",
      tone: "story",
      suitability: "伝統革新、文化再生、遺産活用、温故知新",
      caution: "伝統の本質を損なわないよう配慮する",
      label: "JHJ",
      start: { hex: "山風蠱", pos: line },
      final: { hex: "山風蠱", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、組織や家族の負の遺産と向き合い、その影響を理解します。続いて、過去の過ちから学び、同じ失敗を繰り返さない仕組みを作ります。最後に、新しい価値観と規範を確立し、健全な文化を育てます。突破口は、過去を否定するのではなく、教訓として活かすことです。",
      tone: "story",
      suitability: "世代交代、組織文化改革、家族問題解決、歴史的清算",
      caution: "過去への執着や恨みに囚われない",
      label: "JHH",
      start: { hex: "山風蠱", pos: line },
      final: { hex: "山風蠱", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、停滞していた状況に新しい風を吹き込み、活性化を図ります。続いて、エネルギーが循環し始め、生命力が回復していきます。最後に、持続的な成長と発展の基盤が確立されます。突破口は、小さな変化が大きな流れを生み出すことです。",
      tone: "story",
      suitability: "事業再生、組織活性化、モチベーション回復、イノベーション",
      caution: "急激な変化による反発や抵抗に注意する",
      label: "HJJ",
      start: { hex: "山風蠱", pos: line },
      final: { hex: "山風蠱", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、問題の複雑さを認識し、多面的なアプローチを検討します。続いて、試行錯誤を重ねながら最適な解決策を探ります。最後に、再び全体を見直し、統合的な改善を実現します。突破口は、一つの正解にこだわらない柔軟な思考です。",
      tone: "story",
      suitability: "複雑問題解決、システム思考、統合的アプローチ、全体最適化",
      caution: "複雑さに圧倒されず、着実に前進する",
      label: "HJH",
      start: { hex: "山風蠱", pos: line },
      final: { hex: "山風蠱", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、現状の問題点を整理し、優先順位をつけます。続いて、段階的に改善を進め、小さな成功を積み重ねます。最後に、蓄積された改善が質的な変化をもたらし、大きな成果となります。突破口は、着実な積み重ねが変革につながることです。",
      tone: "story",
      suitability: "継続的改善、カイゼン、品質向上、プロセス最適化",
      caution: "完璧主義に陥らず、実行を重視する",
      label: "HHJ",
      start: { hex: "山風蠱", pos: line },
      final: { hex: "山風蠱", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、腐敗や停滞の予兆を早期に発見する仕組みを作ります。続いて、定期的なメンテナンスと改善を行い、問題の芽を摘みます。最後に、自浄作用が働く健全な体制を確立します。突破口は、問題が大きくなる前に対処することです。",
      tone: "story",
      suitability: "予防保全、リスク管理、品質管理、組織健全性",
      caution: "過度な管理により創造性を損なわない",
      label: "HHH",
      start: { hex: "山風蠱", pos: line },
      final: { hex: "山風蠱", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 地沢臨（19）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、新たな局面に臨む準備を整え、心身を整えます。続いて、積極的に前進し、好機を確実に捉えていきます。最後に、勢いに乗って大きな成果を実現し、新しい段階へと到達します。突破口は、準備と実行のタイミングを見極めることです。",
      tone: "story",
      suitability: "新規事業立ち上げ、市場参入、チャンス活用、積極展開",
      caution: "勢いに任せすぎず、リスク管理を怠らない",
      label: "JJJ",
      start: { hex: "地沢臨", pos: line },
      final: { hex: "地沢臨", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、慎重に状況を観察し、参入のタイミングを計ります。続いて、確信を持って行動に移し、着実に前進します。最後に、新たな視点から全体を俯瞰し、次なる展開を準備します。突破口は、慎重さと大胆さのバランスです。",
      tone: "story",
      suitability: "戦略的参入、計画的実行、段階的拡大、リスク計算",
      caution: "機会を逃さないよう、決断の遅れに注意する",
      label: "JJH",
      start: { hex: "地沢臨", pos: line },
      final: { hex: "地沢臨", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、現場に直接赴き、実情を肌で感じ取ります。続いて、得られた情報を整理し、戦略を調整します。最後に、再び現場に戻り、実践を通じて成果を上げます。突破口は、理論と実践の往復による深い理解です。",
      tone: "story",
      suitability: "現場主義、実地調査、体験学習、実践重視",
      caution: "現場に埋没せず、全体像も把握する",
      label: "JHJ",
      start: { hex: "地沢臨", pos: line },
      final: { hex: "地沢臨", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、リーダーシップを発揮し、方向性を明確に示します。続いて、チームを組織し、役割分担を最適化します。最後に、全体の調和を図りながら、目標達成へと導きます。突破口は、個々の力を結集させる統率力です。",
      tone: "story",
      suitability: "リーダーシップ発揮、チーム統率、プロジェクト管理、組織運営",
      caution: "独断専行を避け、メンバーの意見も尊重する",
      label: "JHH",
      start: { hex: "地沢臨", pos: line },
      final: { hex: "地沢臨", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既存の枠組みを超えて、新しい領域に踏み出します。続いて、未知の環境で学び、適応能力を高めます。最後に、開拓した領域で確固たる地位を築きます。突破口は、未知への恐れを好奇心に変えることです。",
      tone: "story",
      suitability: "新市場開拓、イノベーション、冒険的事業、先駆的取り組み",
      caution: "無謀な挑戦にならないよう、準備を怠らない",
      label: "HJJ",
      start: { hex: "地沢臨", pos: line },
      final: { hex: "地沢臨", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、アプローチ方法を見直し、より効果的な手段を探ります。続いて、新しい方法を実践し、その効果を検証します。最後に、再び微調整を加え、最適な形へと洗練させます。突破口は、柔軟な発想と継続的な改善です。",
      tone: "story",
      suitability: "方法論改善、アプローチ最適化、戦術調整、実験的取り組み",
      caution: "基本を疎かにせず、着実に実行する",
      label: "HJH",
      start: { hex: "地沢臨", pos: line },
      final: { hex: "地沢臨", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、状況に応じて臨機応変に対応し、柔軟性を発揮します。続いて、経験を積み重ね、対応力を向上させます。最後に、蓄積された経験が質的な飛躍をもたらし、mastery に到達します。突破口は、失敗を恐れない実践的学習です。",
      tone: "story",
      suitability: "スキル習得、経験蓄積、臨機応変、実戦力向上",
      caution: "基本原則を忘れず、応用力を養う",
      label: "HHJ",
      start: { hex: "地沢臨", pos: line },
      final: { hex: "地沢臨", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、様々な状況に対応できる準備を整えます。続いて、実際の場面で適切に判断し、行動します。最後に、経験から学び、次回への準備を充実させます。突破口は、準備と実践の継続的なサイクルです。",
      tone: "story",
      suitability: "総合力向上、万能性追求、適応力強化、継続的成長",
      caution: "器用貧乏にならず、強みも育てる",
      label: "HHH",
      start: { hex: "地沢臨", pos: line },
      final: { hex: "地沢臨", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 風地観（20）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、静かに観察し、状況の全体像を把握します。続いて、細部に注目し、隠れたパターンや関係性を発見していきます。最後に、深い洞察に到達し、本質的な理解を獲得します。突破口は、先入観を排して純粋に観ることです。",
      tone: "story",
      suitability: "市場調査、トレンド分析、状況把握、戦略立案",
      caution: "観察に終始せず、適切なタイミングで行動に移す",
      label: "JJJ",
      start: { hex: "風地観", pos: line },
      final: { hex: "風地観", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、表面的な現象を観察し、データを収集します。続いて、そのデータを分析し、背後にある構造を理解します。最後に、新たな視点から全体を見直し、予測モデルを構築します。突破口は、観察から洞察への質的転換です。",
      tone: "story",
      suitability: "データ分析、パターン認識、予測モデル構築、インサイト発見",
      caution: "データに溺れず、直感も大切にする",
      label: "JJH",
      start: { hex: "風地観", pos: line },
      final: { hex: "風地観", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、自己を内省し、自分の立ち位置を確認します。続いて、外部環境との関係性を調整し、バランスを取ります。最後に、より深い自己理解に基づいて、新たな視座を獲得します。突破口は、内観と外観の統合です。",
      tone: "story",
      suitability: "自己分析、内省、瞑想、意識向上",
      caution: "内向きになりすぎず、外界との接点を保つ",
      label: "JHJ",
      start: { hex: "風地観", pos: line },
      final: { hex: "風地観", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、高い視点から全体を俯瞰し、大局を把握します。続いて、各要素の関係性を整理し、システムとして理解します。最後に、最適な介入ポイントを特定し、効果的な戦略を立案します。突破口は、部分最適から全体最適への視点移動です。",
      tone: "story",
      suitability: "戦略企画、システム設計、全体最適化、長期計画",
      caution: "理想論に陥らず、実現可能性も考慮する",
      label: "JHH",
      start: { hex: "風地観", pos: line },
      final: { hex: "風地観", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、異なる視点や立場から物事を見る練習をします。続いて、多角的な理解が深まり、偏見が解消されていきます。最後に、統合的な視野を獲得し、包括的な判断ができるようになります。突破口は、自分の視点の限界を認識することです。",
      tone: "story",
      suitability: "多様性理解、視点転換、偏見克服、包括的思考",
      caution: "相対主義に陥らず、自分の軸も保つ",
      label: "HJJ",
      start: { hex: "風地観", pos: line },
      final: { hex: "風地観", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、観察方法を見直し、より精密な手法を導入します。続いて、新しい観察技術を習得し、情報の質を高めます。最後に、観察システム全体を最適化し、継続的な改善を図ります。突破口は、観察の質が判断の質を決めることの理解です。",
      tone: "story",
      suitability: "観察技術向上、モニタリング改善、品質管理、精度向上",
      caution: "技術に頼りすぎず、人間の感覚も活用する",
      label: "HJH",
      start: { hex: "風地観", pos: line },
      final: { hex: "風地観", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、日常的な観察習慣を身につけ、気づきの感度を高めます。続いて、観察記録を蓄積し、パターンを発見します。最後に、蓄積された観察が質的な洞察をもたらし、直感力が磨かれます。突破口は、継続的な観察が深い理解につながることです。",
      tone: "story",
      suitability: "習慣形成、継続的学習、洞察力向上、直感開発",
      caution: "観察疲れを起こさず、適度な休息も取る",
      label: "HHJ",
      start: { hex: "風地観", pos: line },
      final: { hex: "風地観", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、観察対象との適切な距離を保ち、客観性を確保します。続いて、感情的な反応を抑え、冷静な分析を心がけます。最後に、バランスの取れた判断力を養い、公正な評価ができるようになります。突破口は、感情と理性の適切なバランスです。",
      tone: "story",
      suitability: "評価判断、審査、批評、公正性確保",
      caution: "冷淡になりすぎず、共感力も保つ",
      label: "HHH",
      start: { hex: "風地観", pos: line },
      final: { hex: "風地観", pos: line },
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
    '沢雷随': [1,0,0,1,1,0],   // 沢雷随（17）兌上震下
    '山風蠱': [0,1,1,0,0,1],   // 山風蠱（18）艮上巽下  
    '地沢臨': [0,0,0,0,1,1],   // 地沢臨（19）坤上兌下
    '風地観': [1,1,0,0,0,0]    // 風地観（20）巽上坤下
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