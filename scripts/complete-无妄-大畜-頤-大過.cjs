const fs = require('fs');
const path = require('path');

// データファイルのパス
const dataPath = path.join(__dirname, '../public/data/narratives_chain.v1.json');

// 既存データを読み込む
const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 次の4卦のナラティブを作成
const hexagrams = [
  { name: '天雷无妄', position: 25 },
  { name: '山天大畜', position: 26 },
  { name: '山雷頤', position: 27 },
  { name: '沢風大過', position: 28 }
];

const newNarratives = [];

// 天雷无妄（25）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、純粋な動機から行動を始め、私心なく物事に取り組みます。続いて、その誠実さが周囲に伝わり、信頼関係が自然に形成されていきます。最後に、無心の行動が予想外の良い結果をもたらし、本来の目的を超えた成果を実現します。突破口は、結果への執着を手放すことです。",
      tone: "story",
      suitability: "純粋な動機での行動、誠実な取り組み、自然体での活動、無我の実践",
      caution: "無計画にならず、基本的な準備は怠らない",
      label: "JJJ",
      start: { hex: "天雷无妄", pos: line },
      final: { hex: "天雷无妄", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、期待や計算を捨てて、今この瞬間に集中します。続いて、自然な流れに任せることで、物事がスムーズに進展していきます。最後に、新たな視点から振り返ると、最善の道を歩んでいたことに気づきます。突破口は、コントロールを手放す勇気です。",
      tone: "story",
      suitability: "直感的行動、フロー状態、自然な展開、セレンディピティ",
      caution: "無責任にならず、結果には責任を持つ",
      label: "JJH",
      start: { hex: "天雷无妄", pos: line },
      final: { hex: "天雷无妄", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、素直な心で状況を受け入れ、ありのままを見つめます。続いて、現実と理想のギャップを調整しながら、自然体を保ちます。最後に、より深い無心の境地に到達し、真の自由を獲得します。突破口は、あるがままを受け入れる覚悟です。",
      tone: "story",
      suitability: "自己受容、現実直視、マインドフルネス、精神的自由",
      caution: "現実逃避と無心を混同しない",
      label: "JHJ",
      start: { hex: "天雷无妄", pos: line },
      final: { hex: "天雷无妄", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、純粋な好奇心から探求を始め、知識欲に従って進みます。続いて、学んだことを実践し、体験を通じて理解を深めます。最後に、知識を体系化し、他者と共有する喜びを見出します。突破口は、学ぶこと自体を目的とすることです。",
      tone: "story",
      suitability: "純粋な学習、研究活動、知的探求、教育活動",
      caution: "実用性も考慮し、知識の活用も図る",
      label: "JHH",
      start: { hex: "天雷无妄", pos: line },
      final: { hex: "天雷无妄", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既成概念を手放し、白紙の状態から始めます。続いて、新鮮な視点で物事を見ることで、隠れていた可能性を発見します。最後に、創造的な発想が実を結び、革新的な成果を生み出します。突破口は、初心者の心を保つことです。",
      tone: "story",
      suitability: "創造的思考、イノベーション、新規発想、ブレークスルー",
      caution: "基本的な知識や経験も活かす",
      label: "HJJ",
      start: { hex: "天雷无妄", pos: line },
      final: { hex: "天雷无妄", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、意図的な無為を実践し、力まない状態を作ります。続いて、自然な成り行きの中で最適な行動が生まれます。最後に、再び意識を手放し、より高い次元の無心に到達します。突破口は、努力と無努力の paradox を理解することです。",
      tone: "story",
      suitability: "無為自然、タオイズム的実践、effortless action、流れに乗る",
      caution: "怠惰と無為を混同しない",
      label: "HJH",
      start: { hex: "天雷无妄", pos: line },
      final: { hex: "天雷无妄", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな偶然や直感を大切にし、その声に従います。続いて、経験を積むことで直感の精度が高まります。最後に、理性を超えた知恵が働き、最善の選択ができるようになります。突破口は、内なる声を信頼することです。",
      tone: "story",
      suitability: "直感力開発、内的智慧、スピリチュアル成長、高次の判断",
      caution: "論理的思考も併用し、バランスを保つ",
      label: "HHJ",
      start: { hex: "天雷无妄", pos: line },
      final: { hex: "天雷无妄", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、日常の中で無心を実践し、平常心を養います。続いて、どんな状況でも動じない心の安定を獲得します。最後に、無心が自然な状態となり、effortless な生き方が実現します。突破口は、特別を求めず普通を極めることです。",
      tone: "story",
      suitability: "日常実践、平常心、精神安定、自然体の生活",
      caution: "感情を抑圧せず、自然に表現する",
      label: "HHH",
      start: { hex: "天雷无妄", pos: line },
      final: { hex: "天雷无妄", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 山天大畜（26）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、大きな志を抱き、長期的な視野で準備を始めます。続いて、着実に力を蓄え、実力を充実させていきます。最後に、蓄積された力が臨界点を超え、大きな成果として結実します。突破口は、焦らず時を待つ忍耐力です。",
      tone: "story",
      suitability: "長期投資、能力開発、資源蓄積、大器晩成",
      caution: "蓄えるばかりでなく、適切な時期に活用する",
      label: "JJJ",
      start: { hex: "山天大畜", pos: line },
      final: { hex: "山天大畜", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、知識と経験を体系的に蓄積し、専門性を高めます。続いて、その蓄積が質的な変化をもたらし、expert レベルに到達します。最後に、新たな視点から知識を再構築し、独自の理論や方法論を確立します。突破口は、量から質への転換点を見極めることです。",
      tone: "story",
      suitability: "専門性確立、知識体系化、エキスパート育成、理論構築",
      caution: "知識の独占を避け、適切に共有する",
      label: "JJH",
      start: { hex: "山天大畜", pos: line },
      final: { hex: "山天大畜", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、伝統や古典から学び、先人の知恵を吸収します。続いて、現代的な文脈で再解釈し、実践に活かします。最後に、新旧の知識を統合し、次世代に継承する体系を作ります。突破口は、温故知新の精神です。",
      tone: "story",
      suitability: "伝統継承、古典研究、知識継承、文化保存",
      caution: "古いものに固執せず、革新も取り入れる",
      label: "JHJ",
      start: { hex: "山天大畜", pos: line },
      final: { hex: "山天大畜", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、大きなビジョンを描き、実現への道筋を設計します。続いて、必要な資源を計画的に集め、基盤を固めます。最後に、準備が整った段階で一気に実行し、大きな成功を収めます。突破口は、壮大な構想と緻密な準備の両立です。",
      tone: "story",
      suitability: "大規模プロジェクト、戦略的準備、リソース管理、ビジョン実現",
      caution: "理想が大きすぎて実現不可能にならないよう注意",
      label: "JHH",
      start: { hex: "山天大畜", pos: line },
      final: { hex: "山天大畜", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既存の枠を超えた大きな可能性を見出します。続いて、その実現に向けて革新的な方法で資源を集めます。最後に、蓄積された力で breakthrough を起こし、新たな地平を開きます。突破口は、常識を超えた発想力です。",
      tone: "story",
      suitability: "スケールアップ、exponential growth、破壊的イノベーション、大躍進",
      caution: "リスク管理を怠らず、着実に進める",
      label: "HJJ",
      start: { hex: "山天大畜", pos: line },
      final: { hex: "山天大畜", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、蓄積方法を見直し、より効率的なシステムを構築します。続いて、質の高い蓄積を実現し、価値を最大化します。最後に、蓄積と活用のバランスを最適化し、持続的な成長を実現します。突破口は、ストックとフローの最適配分です。",
      tone: "story",
      suitability: "資産運用、ポートフォリオ管理、効率最適化、バランス経営",
      caution: "過度な最適化により柔軟性を失わない",
      label: "HJH",
      start: { hex: "山天大畜", pos: line },
      final: { hex: "山天大畜", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな蓄積から始め、複利効果を活かします。続いて、蓄積の習慣が定着し、自然に富が増えていきます。最後に、量的蓄積が質的変化をもたらし、大きな資産となります。突破口は、時間を味方につける長期思考です。",
      tone: "story",
      suitability: "習慣形成、複利思考、長期投資、漸進的成長",
      caution: "短期的な誘惑に負けない意志力を保つ",
      label: "HHJ",
      start: { hex: "山天大畜", pos: line },
      final: { hex: "山天大畜", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、多様な分野での蓄積を進め、総合力を高めます。続いて、各分野の知識が相互に作用し、シナジーを生みます。最後に、統合された wisdom として、深い洞察力を獲得します。突破口は、専門性と総合性の融合です。",
      tone: "story",
      suitability: "総合力向上、学際的研究、ポリマス、ルネサンス的人材",
      caution: "広く浅くならず、核となる専門性も保つ",
      label: "HHH",
      start: { hex: "山天大畜", pos: line },
      final: { hex: "山天大畜", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 山雷頤（27）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、自己の養生に注意を向け、心身の健康を整えます。続いて、他者を養う力を身につけ、周囲に良い影響を与えていきます。最後に、養うことと養われることの循環が生まれ、豊かな関係性が築かれます。突破口は、自己と他者の養生のバランスです。",
      tone: "story",
      suitability: "健康管理、育成、ケア、養育、メンタリング",
      caution: "過保護にならず、自立も促す",
      label: "JJJ",
      start: { hex: "山雷頤", pos: line },
      final: { hex: "山雷頤", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、適切な栄養を取り入れ、基礎体力を向上させます。続いて、精神的な糧も求め、知識と経験を吸収します。最後に、新たな視点から養生の意味を理解し、ホリスティックな健康を実現します。突破口は、身体と精神の統合的なケアです。",
      tone: "story",
      suitability: "ウェルビーイング、統合的健康、ライフスタイル改善、全人的成長",
      caution: "極端な健康法に走らず、バランスを保つ",
      label: "JJH",
      start: { hex: "山雷頤", pos: line },
      final: { hex: "山雷頤", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、言葉に気をつけ、適切なコミュニケーションを心がけます。続いて、行動を調整し、周囲との調和を図ります。最後に、より深い次元で他者と繋がり、真の理解と支援を実現します。突破口は、言葉と行動の一致です。",
      tone: "story",
      suitability: "コミュニケーション改善、関係構築、信頼形成、相互支援",
      caution: "自己主張と傾聴のバランスを取る",
      label: "JHJ",
      start: { hex: "山雷頤", pos: line },
      final: { hex: "山雷頤", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、与えることの喜びを知り、積極的に貢献します。続いて、与え方を工夫し、相手のニーズに合わせた支援を行います。最後に、持続可能な支援体制を構築し、長期的な関係を築きます。突破口は、一方的でない相互的な関係性です。",
      tone: "story",
      suitability: "社会貢献、ボランティア、支援活動、コミュニティサービス",
      caution: "燃え尽きないよう、自己ケアも忘れない",
      label: "JHH",
      start: { hex: "山雷頤", pos: line },
      final: { hex: "山雷頤", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しい養生法や育成方法を試み、効果を検証します。続いて、成功した方法を発展させ、より大きな成果を上げます。最後に、革新的なケアシステムを確立し、多くの人々に恩恵をもたらします。突破口は、伝統と革新の融合です。",
      tone: "story",
      suitability: "革新的ケア、新しい教育法、先進的養生、システム改革",
      caution: "実験的すぎて安全性を損なわない",
      label: "HJJ",
      start: { hex: "山雷頤", pos: line },
      final: { hex: "山雷頤", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、養う側と養われる側の役割を見直し、より良い関係を模索します。続いて、相互依存から相互成長へと関係性を深化させます。最後に、再び役割を調整し、最適な形を見出します。突破口は、固定的な役割からの解放です。",
      tone: "story",
      suitability: "役割転換、相互成長、パートナーシップ、共生関係",
      caution: "責任の所在を曖昧にしない",
      label: "HJH",
      start: { hex: "山雷頤", pos: line },
      final: { hex: "山雷頤", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、日常の小さな養生から始め、習慣として定着させます。続いて、その積み重ねが体質改善をもたらし、根本的な健康を実現します。最後に、健康が当たり前となり、活力に満ちた生活を送れるようになります。突破口は、継続の力です。",
      tone: "story",
      suitability: "習慣改善、体質改善、予防医学、持続的健康",
      caution: "結果を急がず、長期的視点を保つ",
      label: "HHJ",
      start: { hex: "山雷頤", pos: line },
      final: { hex: "山雷頤", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、食事、運動、休息のバランスを整えます。続いて、精神的な養生も加え、全体的な調和を図ります。最後に、自然なリズムで生活し、無理のない健康を維持します。突破口は、過不足のない中庸の実践です。",
      tone: "story",
      suitability: "バランス生活、自然療法、東洋医学的養生、持続可能な健康",
      caution: "ストイックになりすぎず、楽しみも大切にする",
      label: "HHH",
      start: { hex: "山雷頤", pos: line },
      final: { hex: "山雷頤", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 沢風大過（28）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、限界を超えた挑戦に直面し、非常手段の必要性を認識します。続いて、大胆な決断と行動により、不可能を可能に変えていきます。最後に、極限状況を突破し、新たな次元へと到達します。突破口は、常識を超えた勇気ある行動です。",
      tone: "story",
      suitability: "危機突破、革命的変化、限界突破、非常事態対応",
      caution: "無謀と勇気を混同せず、計算されたリスクを取る",
      label: "JJJ",
      start: { hex: "沢風大過", pos: line },
      final: { hex: "沢風大過", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、過度な負荷に耐えながら、強靭な精神力を養います。続いて、その経験が自信となり、より大きな挑戦に立ち向かう力となります。最後に、新たな視点から振り返ると、成長の糧となっていたことに気づきます。突破口は、苦難を成長の機会として捉えることです。",
      tone: "story",
      suitability: "試練克服、精神力強化、レジリエンス構築、極限体験",
      caution: "過度なストレスにより心身を壊さない",
      label: "JJH",
      start: { hex: "沢風大過", pos: line },
      final: { hex: "沢風大過", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、通常の方法では解決できない問題に直面します。続いて、バランスを取りながら極端な措置を実施します。最後に、より深い理解に基づいて、根本的な解決を実現します。突破口は、極端と中庸の弁証法的統合です。",
      tone: "story",
      suitability: "特殊対応、例外処理、緊急措置、radical solution",
      caution: "一時的な解決に終わらせず、恒久対策も考える",
      label: "JHJ",
      start: { hex: "沢風大過", pos: line },
      final: { hex: "沢風大過", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、大きな責任を引き受け、重圧に耐えます。続いて、その重責を果たすための体制を整え、支援を得ます。最後に、責任を分散し、持続可能な形に移行します。突破口は、個人の限界を認識し、組織の力を活用することです。",
      tone: "story",
      suitability: "重責遂行、リーダーシップ、責任分担、組織力活用",
      caution: "一人で抱え込まず、適切に委譲する",
      label: "JHH",
      start: { hex: "沢風大過", pos: line },
      final: { hex: "沢風大過", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既存の限界を打ち破る必要性を認識します。続いて、革新的な方法で breakthrough を実現します。最後に、その成功を基に、さらなる限界突破を続けます。突破口は、不可能という概念を捨てることです。",
      tone: "story",
      suitability: "イノベーション、paradigm shift、限界超越、革命的進歩",
      caution: "現実離れせず、実現可能性も考慮する",
      label: "HJJ",
      start: { hex: "沢風大過", pos: line },
      final: { hex: "沢風大過", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、過度な状態を調整し、バランスを取り戻そうとします。続いて、極端さの中にある価値を見出し、活かします。最後に、再び調整を加え、持続可能な形を見出します。突破口は、極端さを創造的に活用することです。",
      tone: "story",
      suitability: "バランス回復、極端の活用、創造的調整、dynamic equilibrium",
      caution: "中途半端にならず、必要な極端さは保つ",
      label: "HJH",
      start: { hex: "沢風大過", pos: line },
      final: { hex: "沢風大過", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな無理から始め、徐々に耐性を高めます。続いて、段階的に負荷を増やし、能力を拡張していきます。最後に、かつての限界を軽々と超えられるようになります。突破口は、段階的な成長による着実な進化です。",
      tone: "story",
      suitability: "段階的成長、能力拡張、トレーニング、progressive overload",
      caution: "オーバートレーニングに注意し、回復も重視する",
      label: "HHJ",
      start: { hex: "沢風大過", pos: line },
      final: { hex: "沢風大過", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、過度な状態を管理する術を身につけます。続いて、極限状況でも冷静さを保てるようになります。最後に、どんな状況でも最適な判断ができる境地に到達します。突破口は、極限を日常として扱える精神力です。",
      tone: "story",
      suitability: "危機管理能力、ストレス耐性、極限対応力、mental toughness",
      caution: "感覚を麻痺させず、適切な警戒心を保つ",
      label: "HHH",
      start: { hex: "沢風大過", pos: line },
      final: { hex: "沢風大過", pos: line },
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
    '天雷无妄': [1,1,1,0,0,1], // 天雷无妄（25）乾上震下
    '山天大畜': [1,1,1,0,0,1], // 山天大畜（26）艮上乾下
    '山雷頤': [1,0,0,0,0,1],   // 山雷頤（27）艮上震下
    '沢風大過': [0,1,1,1,1,0]  // 沢風大過（28）兌上巽下
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