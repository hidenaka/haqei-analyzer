const fs = require('fs');
const path = require('path');

// データファイルのパス
const dataPath = path.join(__dirname, '../public/data/narratives_chain.v1.json');

// 既存データを読み込む
const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 次の4卦のナラティブを作成
const hexagrams = [
  { name: '山沢損', position: 41 },
  { name: '風雷益', position: 42 },
  { name: '沢天夬', position: 43 },
  { name: '天風姤', position: 44 }
];

const newNarratives = [];

// 山沢損（41）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、必要な犠牲を払い、より大きな目的のために尽くします。続いて、その献身が認められ、信頼と尊敬を得ていきます。最後に、損して得取る真理を体現し、真の豊かさを獲得します。突破口は、目先の利益を超えた大局観です。",
      tone: "story",
      suitability: "自己犠牲、献身、長期投資、利他的行動",
      caution: "過度な犠牲により自己を失わない",
      label: "JJJ",
      start: { hex: "山沢損", pos: line },
      final: { hex: "山沢損", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、不要なものを削ぎ落とし、本質を明確にします。続いて、シンプルな形で効率を高め、無駄を省きます。最後に、新たな視点から価値を再定義し、質的な向上を実現します。突破口は、less is moreの実践です。",
      tone: "story",
      suitability: "断捨離、効率化、本質追求、ミニマリズム",
      caution: "必要なものまで削らないよう注意する",
      label: "JJH",
      start: { hex: "山沢損", pos: line },
      final: { hex: "山沢損", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、自己の欲望を抑え、他者のために行動します。続いて、その行為が周囲に良い影響を与え、関係が改善します。最後に、より深い満足感を得て、精神的な充実を実現します。突破口は、与えることの喜びの発見です。",
      tone: "story",
      suitability: "奉仕精神、社会貢献、無私の行動、精神的充実",
      caution: "自己犠牲が美徳と思い込まない",
      label: "JHJ",
      start: { hex: "山沢損", pos: line },
      final: { hex: "山沢損", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、短期的な損失を受け入れ、長期的な利益を追求します。続いて、戦略的な投資が実を結び始めます。最後に、計画通りの成果を得て、賢明な判断が証明されます。突破口は、時間軸を伸ばした思考です。",
      tone: "story",
      suitability: "戦略的投資、長期計画、遅延満足、賢明な判断",
      caution: "投資が投機にならないよう管理する",
      label: "JHH",
      start: { hex: "山沢損", pos: line },
      final: { hex: "山沢損", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、従来の価値観を手放し、新しい視点を獲得します。続いて、その転換が創造的な発想を生み、革新をもたらします。最後に、失ったもの以上の価値を創造し、大きな成功を収めます。突破口は、喪失を変革の機会とすることです。",
      tone: "story",
      suitability: "価値転換、創造的破壊、イノベーション、paradigm shift",
      caution: "破壊が目的化しないよう注意する",
      label: "HJJ",
      start: { hex: "山沢損", pos: line },
      final: { hex: "山沢損", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、損失の管理方法を見直し、より効果的な対処を探ります。続いて、リスクとリターンのバランスを最適化します。最後に、再び調整を加え、持続可能な損益管理を確立します。突破口は、損失の戦略的活用です。",
      tone: "story",
      suitability: "リスク管理、損益最適化、バランス調整、戦略的判断",
      caution: "計算に頼りすぎず、直感も大切にする",
      label: "HJH",
      start: { hex: "山沢損", pos: line },
      final: { hex: "山沢損", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな節約から始め、無駄を省く習慣を身につけます。続いて、その積み重ねが大きな節約となり、資源が蓄積されます。最後に、蓄えた資源で大きな投資が可能となり、飛躍的な成長を実現します。突破口は、小さな損の回避が大きな得につながることです。",
      tone: "story",
      suitability: "節約、資源管理、習慣形成、蓄積型成長",
      caution: "ケチにならず、必要な投資は行う",
      label: "HHJ",
      start: { hex: "山沢損", pos: line },
      final: { hex: "山沢損", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、得失を超えた視点を獲得し、執着から解放されます。続いて、自然な流れに任せ、必要な時に必要なだけ使います。最後に、損得を超越した境地で、真の自由を実現します。突破口は、損得勘定からの解放です。",
      tone: "story",
      suitability: "超越的視点、無執着、自然体、精神的自由",
      caution: "現実的な責任は果たす",
      label: "HHH",
      start: { hex: "山沢損", pos: line },
      final: { hex: "山沢損", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 風雷益（42）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、良い機会に恵まれ、利益を得る準備が整います。続いて、その恩恵を最大限に活用し、成長と発展を遂げます。最後に、得た利益を他者と分かち合い、全体の繁栄に貢献します。突破口は、利益の循環的活用です。",
      tone: "story",
      suitability: "利益獲得、成長機会、恩恵活用、繁栄実現",
      caution: "独占せず、適切に分配する",
      label: "JJJ",
      start: { hex: "風雷益", pos: line },
      final: { hex: "風雷益", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな改善から利益を生み出し、基盤を固めます。続いて、その成功を拡大し、より大きな利益を獲得します。最後に、新たな視点から価値創造の方法を見出し、持続的な成長を実現します。突破口は、継続的な価値創造です。",
      tone: "story",
      suitability: "継続的改善、価値創造、スケールアップ、持続的成長",
      caution: "成長速度を無理に上げない",
      label: "JJH",
      start: { hex: "風雷益", pos: line },
      final: { hex: "風雷益", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、相互利益の関係を構築し、win-winを実現します。続いて、協力関係を深め、シナジー効果を生み出します。最後に、より大きな共同利益を創出し、全員が豊かになります。突破口は、競争から協創への転換です。",
      tone: "story",
      suitability: "相互利益、協力関係、シナジー、共同繁栄",
      caution: "自己の利益も適切に確保する",
      label: "JHJ",
      start: { hex: "風雷益", pos: line },
      final: { hex: "風雷益", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、大きなチャンスを掴み、飛躍的な成長を実現します。続いて、その勢いを維持しながら、基盤を強化します。最後に、安定した優位性を確立し、持続的な利益を享受します。突破口は、機会を最大限に活かすことです。",
      tone: "story",
      suitability: "大躍進、急成長、チャンス活用、優位性確立",
      caution: "急成長による歪みに注意する",
      label: "JHH",
      start: { hex: "風雷益", pos: line },
      final: { hex: "風雷益", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しい価値の源泉を発見し、未開拓の利益を見出します。続いて、その可能性を開発し、革新的な成果を上げます。最後に、さらなる価値創造を続け、継続的なイノベーションを実現します。突破口は、常に新しい価値を探求することです。",
      tone: "story",
      suitability: "価値発見、イノベーション、新規開拓、革新的成長",
      caution: "基本的な価値も大切にする",
      label: "HJJ",
      start: { hex: "風雷益", pos: line },
      final: { hex: "風雷益", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、利益獲得の方法を見直し、より効率的な手段を探ります。続いて、最適化された方法で実践し、成果を確認します。最後に、再び改善を加え、最大の利益を実現します。突破口は、利益最大化の継続的追求です。",
      tone: "story",
      suitability: "効率最適化、利益最大化、プロセス改善、継続的向上",
      caution: "効率ばかり追求せず、質も重視する",
      label: "HJH",
      start: { hex: "風雷益", pos: line },
      final: { hex: "風雷益", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな利益から始め、着実に積み上げていきます。続いて、複利効果が働き、加速度的に成長します。最後に、大きな富を築き、経済的自由を実現します。突破口は、時間を味方につける複利思考です。",
      tone: "story",
      suitability: "着実な蓄積、複利効果、長期投資、富の構築",
      caution: "短期的な誘惑に負けない",
      label: "HHJ",
      start: { hex: "風雷益", pos: line },
      final: { hex: "風雷益", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、物質的利益と精神的充実のバランスを取ります。続いて、両方が相乗効果を生み、全体的な豊かさが増します。最後に、真の豊かさを実現し、幸福な人生を送ります。突破口は、多面的な豊かさの追求です。",
      tone: "story",
      suitability: "総合的豊かさ、バランス成長、幸福追求、全人的発展",
      caution: "一面的な成功に偏らない",
      label: "HHH",
      start: { hex: "風雷益", pos: line },
      final: { hex: "風雷益", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 沢天夬（43）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、決断の時が来たことを認識し、覚悟を決めます。続いて、断固とした行動により、状況を一変させます。最後に、決断の正しさが証明され、新たな道が開けます。突破口は、迷いを断ち切る勇気です。",
      tone: "story",
      suitability: "重要決断、決定的行動、転換点、ブレークスルー",
      caution: "独断的にならず、必要な相談はする",
      label: "JJJ",
      start: { hex: "沢天夬", pos: line },
      final: { hex: "沢天夬", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、問題の核心を見極め、解決の方向を定めます。続いて、明確な判断基準に基づいて決定を下します。最後に、新たな視点から結果を評価し、次の決断に活かします。突破口は、明晰な判断力です。",
      tone: "story",
      suitability: "的確な判断、問題解決、意思決定、評価と改善",
      caution: "完璧を求めすぎて決断を遅らせない",
      label: "JJH",
      start: { hex: "沢天夬", pos: line },
      final: { hex: "沢天夬", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、不正や悪を見過ごさず、正義を貫く決意をします。続いて、現実的な対処を考え、実行可能な方法を選びます。最後に、より高い次元で正義を実現し、公正な環境を作ります。突破口は、正義と現実の両立です。",
      tone: "story",
      suitability: "正義の実現、不正撲滅、公正確保、倫理的行動",
      caution: "独善的な正義感に陥らない",
      label: "JHJ",
      start: { hex: "沢天夬", pos: line },
      final: { hex: "沢天夬", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、強いリーダーシップを発揮し、方向性を示します。続いて、チームを統率し、目標に向かって導きます。最後に、決定的な成果を上げ、リーダーとしての評価を確立します。突破口は、決断力のあるリーダーシップです。",
      tone: "story",
      suitability: "リーダーシップ、統率力、目標達成、成果実現",
      caution: "独裁的にならず、メンバーの意見も聞く",
      label: "JHH",
      start: { hex: "沢天夬", pos: line },
      final: { hex: "沢天夬", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既存の枠組みを打ち破る必要性を認識します。続いて、革新的な決断により、新しい可能性を開きます。最後に、その成功が新たなスタンダードとなり、時代を変えます。突破口は、常識を超える決断力です。",
      tone: "story",
      suitability: "革新的決断、パラダイムシフト、時代を変える、先駆的行動",
      caution: "革新性と実現可能性のバランスを取る",
      label: "HJJ",
      start: { hex: "沢天夬", pos: line },
      final: { hex: "沢天夬", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、決断プロセスを見直し、より効果的な方法を探ります。続いて、改善された方法で決断し、結果を検証します。最後に、再び最適化を図り、決断の質を高めます。突破口は、決断力の継続的向上です。",
      tone: "story",
      suitability: "意思決定改善、プロセス最適化、決断力向上、継続的改良",
      caution: "分析麻痺に陥らず、行動する",
      label: "HJH",
      start: { hex: "沢天夬", pos: line },
      final: { hex: "沢天夬", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな決断から始め、決断力を養います。続いて、より重要な決断に取り組み、経験を積みます。最後に、大きな決断も恐れず、自信を持って判断できるようになります。突破口は、段階的な決断力の強化です。",
      tone: "story",
      suitability: "決断力養成、段階的成長、自信構築、判断力向上",
      caution: "慢心せず、慎重さも保つ",
      label: "HHJ",
      start: { hex: "沢天夬", pos: line },
      final: { hex: "沢天夬", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、直感と理性のバランスを取りながら決断します。続いて、経験を重ねることで、判断の精度が向上します。最後に、瞬時に最適な決断ができる境地に到達します。突破口は、統合的な判断力です。",
      tone: "story",
      suitability: "バランス判断、直感と理性、経験知、瞬間的判断",
      caution: "過信せず、必要な検討は行う",
      label: "HHH",
      start: { hex: "沢天夬", pos: line },
      final: { hex: "沢天夬", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 天風姤（44）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、予期せぬ出会いが訪れ、新たな可能性が開けます。続いて、その縁を大切に育て、関係を深めていきます。最後に、運命的な結びつきとなり、人生を豊かにします。突破口は、偶然を必然に変える力です。",
      tone: "story",
      suitability: "運命的出会い、縁の活用、関係構築、人生の転機",
      caution: "出会いに依存せず、自立性も保つ",
      label: "JJJ",
      start: { hex: "天風姤", pos: line },
      final: { hex: "天風姤", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、思いがけない機会に遭遇し、チャンスを認識します。続いて、その機会を活かすため、迅速に行動します。最後に、新たな展開から更なる可能性を見出し、成長を続けます。突破口は、機会を逃さない機敏さです。",
      tone: "story",
      suitability: "チャンス活用、機会認識、迅速な行動、可能性拡大",
      caution: "慎重さを忘れず、リスクも評価する",
      label: "JJH",
      start: { hex: "天風姤", pos: line },
      final: { hex: "天風姤", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、異質なものとの遭遇により、視野が広がります。続いて、その刺激を受け入れ、自己を成長させます。最後に、より豊かな人間性を獲得し、新たな自分になります。突破口は、違いを成長の糧とすることです。",
      tone: "story",
      suitability: "異文化交流、新体験、自己成長、視野拡大",
      caution: "自分を見失わず、軸を保つ",
      label: "JHJ",
      start: { hex: "天風姤", pos: line },
      final: { hex: "天風姤", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、強い引力により、避けられない出会いを経験します。続いて、その関係を管理し、適切な距離を保ちます。最後に、健全な関係を確立し、互いに成長します。突破口は、引力と自制のバランスです。",
      tone: "story",
      suitability: "強い縁、関係管理、適切な距離、相互成長",
      caution: "執着や依存に陥らない",
      label: "JHH",
      start: { hex: "天風姤", pos: line },
      final: { hex: "天風姤", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、新しいタイプの出会いを求め、積極的に行動します。続いて、その出会いから革新的なアイデアを得ます。最後に、創造的な成果を生み出し、新たな価値を創出します。突破口は、出会いの創造的活用です。",
      tone: "story",
      suitability: "新しい出会い、創造的刺激、イノベーション、価値創出",
      caution: "出会いの量より質を重視する",
      label: "HJJ",
      start: { hex: "天風姤", pos: line },
      final: { hex: "天風姤", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、出会いの質を見極め、選択的に関係を築きます。続いて、価値ある関係を深め、ネットワークを構築します。最後に、再び関係を整理し、最適な人間関係を維持します。突破口は、出会いの戦略的管理です。",
      tone: "story",
      suitability: "人脈構築、関係選択、ネットワーク、戦略的関係",
      caution: "打算的になりすぎず、真心も大切にする",
      label: "HJH",
      start: { hex: "天風姤", pos: line },
      final: { hex: "天風姤", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、日常の小さな出会いを大切にし、縁を育てます。続いて、その積み重ねが豊かな人間関係となります。最後に、多くの縁に支えられ、充実した人生を送ります。突破口は、一期一会の精神です。",
      tone: "story",
      suitability: "日常の縁、人間関係、縁の大切さ、充実した人生",
      caution: "表面的な付き合いに終わらせない",
      label: "HHJ",
      start: { hex: "天風姤", pos: line },
      final: { hex: "天風姤", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、縁の不思議さを理解し、出会いを大切にします。続いて、自然な流れで関係が発展し、深まっていきます。最後に、縁に導かれた人生の豊かさを実感します。突破口は、縁を信じる心です。",
      tone: "story",
      suitability: "縁の理解、自然な関係、運命的つながり、人生の豊かさ",
      caution: "運命論に陥らず、努力も続ける",
      label: "HHH",
      start: { hex: "天風姤", pos: line },
      final: { hex: "天風姤", pos: line },
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
    '山沢損': [1,1,0,0,0,1],   // 山沢損（41）艮上兌下
    '風雷益': [1,0,0,0,1,1],   // 風雷益（42）巽上震下
    '沢天夬': [1,1,1,1,1,0],   // 沢天夬（43）兌上乾下
    '天風姤': [1,1,1,1,1,0]    // 天風姤（44）乾上巽下
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