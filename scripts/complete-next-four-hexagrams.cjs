const fs = require('fs');
const path = require('path');

// データファイルのパス
const dataPath = path.join(__dirname, '../public/data/narratives_chain.v1.json');

// 既存データを読み込む
const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 次の4卦のナラティブを作成
const hexagrams = [
  { name: '同人', position: 13 },
  { name: '大有', position: 14 },
  { name: '謙', position: 15 },
  { name: '豫', position: 16 }
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

// 天火同人（13）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、共通の理想に向かって人々が集まり始め、互いの違いを認識しながらも協力の基盤を探ります。続いて、立場や背景の異なる者同士が本音で語り合い、真の理解と信頼を築いていきます。最後に、一体感が生まれ、個人の力を超えた集団の知恵と力が発揮されるようになります。突破口は、違いを否定せず、むしろ多様性を強みとして活かす姿勢です。",
      tone: "story",
      suitability: "チーム形成期、新規プロジェクト立ち上げ、異分野連携、組織統合時",
      caution: "表面的な合意に留まらず、本質的な相互理解を重視する",
      label: "JJJ",
      start: { hex: "天火同人", pos: line },
      final: { hex: "天火同人", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、個別に活動していた人々が共通の目的を発見し、協力の可能性を模索し始めます。続いて、実際に協働することで互いの強みと弱みを理解し、補完関係を築きます。最後に、新たな視点から全体を見直し、より効果的な協力体制を確立します。突破口は、個人の利益を超えた共通善への献身です。",
      tone: "story",
      suitability: "利害調整、パートナーシップ構築、アライアンス形成、共同事業",
      caution: "個人の貢献を適切に評価し、公平性を保つ",
      label: "JJH",
      start: { hex: "天火同人", pos: line },
      final: { hex: "天火同人", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、志を同じくする仲間と出会い、初期の熱意と情熱で結束します。続いて、現実的な課題に直面し、理想と現実のギャップを調整する必要が生じます。最後に、より深い理解と成熟した関係性を築き、持続可能な協力体制を確立します。突破口は、困難を共に乗り越える経験を通じた絆の深化です。",
      tone: "story",
      suitability: "長期プロジェクト、組織改革、コミュニティ形成、社会運動",
      caution: "初期の熱意に依存せず、持続可能な仕組みを構築する",
      label: "JHJ",
      start: { hex: "天火同人", pos: line },
      final: { hex: "天火同人", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、強いリーダーシップのもとで人々が結集し、明確な方向性を共有します。続いて、各メンバーの役割を調整し、効率的な分業体制を整えます。最後に、さらなる最適化を図り、チーム全体のパフォーマンスを向上させます。突破口は、個人の成長とチームの発展を同時に実現することです。",
      tone: "story",
      suitability: "組織運営、プロジェクト管理、業務改善、チームビルディング",
      caution: "効率性を追求しすぎて人間関係を軽視しない",
      label: "JHH",
      start: { hex: "天火同人", pos: line },
      final: { hex: "天火同人", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、異なる価値観や文化を持つ人々との出会いから、自分の枠組みを見直します。続いて、対話と交流を深めることで相互理解が進み、新たな可能性が開かれます。最後に、多様性を力に変え、革新的な成果を生み出すようになります。突破口は、違いを恐れず、むしろ学びの機会として捉えることです。",
      tone: "story",
      suitability: "国際協力、異文化交流、イノベーション創出、ダイバーシティ推進",
      caution: "性急な統一を避け、多様性を尊重する",
      label: "HJJ",
      start: { hex: "天火同人", pos: line },
      final: { hex: "天火同人", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既存の枠組みを超えた協力の必要性を認識し、新たな連携を模索します。続いて、実験的な取り組みを通じて最適な協力形態を探求します。最後に、再び調整を重ね、柔軟で適応力のある協力体制を確立します。突破口は、固定観念にとらわれない創造的な発想です。",
      tone: "story",
      suitability: "新規事業開発、研究開発、社会実験、変革的取り組み",
      caution: "実験的要素と安定性のバランスを保つ",
      label: "HJH",
      start: { hex: "天火同人", pos: line },
      final: { hex: "天火同人", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、現状の協力体制の問題点を洗い出し、改善の方向性を定めます。続いて、段階的に調整を重ね、より効果的な協力の形を模索します。最後に、根本的な改革を実施し、質的に異なるレベルの協力を実現します。突破口は、小さな改善の積み重ねが大きな変革につながることの認識です。",
      tone: "story",
      suitability: "組織改革、システム改善、品質向上、継続的改善",
      caution: "改革疲れを避け、メンバーのモチベーションを維持する",
      label: "HHJ",
      start: { hex: "天火同人", pos: line },
      final: { hex: "天火同人", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、協力関係の基本的な見直しから始め、より公平で持続可能な形を探ります。続いて、コミュニケーションの質を高め、相互理解を深めます。最後に、全体の調和を重視しながら、各人が最大限に力を発揮できる環境を整えます。突破口は、競争から協創への意識転換です。",
      tone: "story",
      suitability: "組織文化改革、チーム再編、関係性の再構築、コミュニティ活性化",
      caution: "理想論に陥らず、現実的な解決策を追求する",
      label: "HHH",
      start: { hex: "天火同人", pos: line },
      final: { hex: "天火同人", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 火天大有（14）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、豊かさの種が芽生え、可能性に満ちた状況が展開し始めます。続いて、資源が集まり、才能が開花し、成功への道筋が明確になっていきます。最後に、大いなる成果が実現し、その恩恵が広く共有されるようになります。突破口は、独占ではなく分かち合いの精神で豊かさを循環させることです。",
      tone: "story",
      suitability: "事業拡大期、収穫期、成功の共有、繁栄の実現",
      caution: "驕りを避け、謙虚さを保ちながら成功を享受する",
      label: "JJJ",
      start: { hex: "火天大有", pos: line },
      final: { hex: "火天大有", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな成功から始まり、その成功を基盤により大きな挑戦に取り組みます。続いて、資源と機会が増大し、影響力が拡大していきます。最後に、新たな視点から豊かさの意味を再定義し、質的に異なる価値を創造します。突破口は、物質的豊かさを精神的豊かさへと昇華させることです。",
      tone: "story",
      suitability: "成長戦略、価値創造、ビジョン実現、社会的インパクト",
      caution: "量的拡大だけでなく、質的向上も重視する",
      label: "JJH",
      start: { hex: "火天大有", pos: line },
      final: { hex: "火天大有", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、恵まれた環境を最大限に活用し、急速な成長を遂げます。続いて、成長の持続可能性を検討し、バランスの取れた発展を目指します。最後に、再び飛躍的な成長の機会を捉え、より高い次元での成功を実現します。突破口は、成功に安住せず、常に次なる高みを目指す姿勢です。",
      tone: "story",
      suitability: "段階的成長、持続可能な発展、長期的繁栄、世代を超えた継承",
      caution: "急激な成長による歪みに注意し、基盤を固める",
      label: "JHJ",
      start: { hex: "火天大有", pos: line },
      final: { hex: "火天大有", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、大きな成功を収め、豊富な資源を手に入れます。続いて、その資源の最適な配分と活用方法を検討します。最後に、さらなる効率化と最適化を図り、持続可能な豊かさを確立します。突破口は、豊かさを維持するための賢明な管理と運用です。",
      tone: "story",
      suitability: "資産管理、資源配分、組織運営、富の保全",
      caution: "豊かさに溺れず、将来への備えを怠らない",
      label: "JHH",
      start: { hex: "火天大有", pos: line },
      final: { hex: "火天大有", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既存の成功モデルを見直し、新たな可能性を探ります。続いて、革新的なアプローチで飛躍的な成長を実現します。最後に、その成果を基盤にさらなる拡大と発展を遂げます。突破口は、過去の成功に囚われない柔軟な発想です。",
      tone: "story",
      suitability: "イノベーション、パラダイムシフト、新市場開拓、破壊的創造",
      caution: "革新性と安定性のバランスを保つ",
      label: "HJJ",
      start: { hex: "火天大有", pos: line },
      final: { hex: "火天大有", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、豊かさの分配方法を見直し、より公平な仕組みを構築します。続いて、共有された豊かさが新たな価値を生み出し始めます。最後に、再び分配の最適化を図り、全体の幸福度を最大化します。突破口は、利他的な姿勢が結果的に自己の豊かさにつながることの理解です。",
      tone: "story",
      suitability: "社会貢献、CSR活動、共有経済、コミュニティ発展",
      caution: "理想と現実のバランスを保ち、実行可能な施策を選ぶ",
      label: "HJH",
      start: { hex: "火天大有", pos: line },
      final: { hex: "火天大有", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、現在の豊かさの質を問い直し、真の価値を見極めます。続いて、価値観の転換を図り、新たな豊かさの定義を確立します。最後に、その新しい価値観に基づいて飛躍的な成長を遂げます。突破口は、物質的豊かさから精神的充実への価値転換です。",
      tone: "story",
      suitability: "価値観の転換、ライフスタイル革新、社会変革、新時代への適応",
      caution: "急激な変化による混乱を避け、段階的に移行する",
      label: "HHJ",
      start: { hex: "火天大有", pos: line },
      final: { hex: "火天大有", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、豊かさの持続可能性を検証し、長期的視野での計画を立てます。続いて、環境や社会との調和を重視した発展モデルを構築します。最後に、次世代への継承を意識した体制を整えます。突破口は、一時的な利益より永続的な価値を重視することです。",
      tone: "story",
      suitability: "持続可能経営、環境配慮、世代継承、長期投資",
      caution: "短期的な犠牲を恐れず、長期的視野を保つ",
      label: "HHH",
      start: { hex: "火天大有", pos: line },
      final: { hex: "火天大有", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 地山謙（15）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、自己の限界を認識し、謙虚な姿勢で学びの道に入ります。続いて、他者の知恵と経験から学び、自己の成長の糧とします。最後に、深い謙虚さが真の強さとなり、周囲からの信頼と尊敬を集めるようになります。突破口は、謙虚さが弱さではなく、成長への最短経路であることの理解です。",
      tone: "story",
      suitability: "学習期、師事、自己研鑽、人格形成",
      caution: "卑屈にならず、健全な自己肯定感を保つ",
      label: "JJJ",
      start: { hex: "地山謙", pos: line },
      final: { hex: "地山謙", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、成功体験を振り返り、それが多くの人々の支えによるものだと認識します。続いて、感謝の気持ちを行動で示し、恩返しの機会を探ります。最後に、新たな視点から自己の役割を見直し、より大きな貢献を目指します。突破口は、個人の成功を社会への貢献へと転換することです。",
      tone: "story",
      suitability: "リーダーシップ開発、社会貢献、恩返し、影響力の行使",
      caution: "偽りの謙虚さを避け、真摯な姿勢を保つ",
      label: "JJH",
      start: { hex: "地山謙", pos: line },
      final: { hex: "地山謙", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、静かに内省し、自己の本質と向き合います。続いて、日常の実践を通じて謙虚さを体現し、行動で示します。最後に、より深い精神性に到達し、無我の境地へと近づいていきます。突破口は、自我を超えた大いなる存在との一体感です。",
      tone: "story",
      suitability: "精神修養、瞑想実践、人格陶冶、悟りへの道",
      caution: "現実離れせず、地に足をつけた実践を心がける",
      label: "JHJ",
      start: { hex: "地山謙", pos: line },
      final: { hex: "地山謙", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、高い地位や評価を得ながらも、謙虚な姿勢を保ちます。続いて、その姿勢が周囲に良い影響を与え、組織文化を変えていきます。最後に、謙虚さを制度化し、持続可能な仕組みとして定着させます。突破口は、権力と謙虚さの両立が可能であることの実証です。",
      tone: "story",
      suitability: "組織改革、リーダーシップ、企業文化、制度設計",
      caution: "形式的な謙虚さに陥らず、本質を重視する",
      label: "JHH",
      start: { hex: "地山謙", pos: line },
      final: { hex: "地山謙", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、過去の失敗や挫折から学び、謙虚さの重要性を認識します。続いて、その教訓を活かして着実な成長を遂げます。最後に、さらなる高みへと到達し、成功の中でも謙虚さを保ち続けます。突破口は、失敗を恥じず、成長の機会として捉えることです。",
      tone: "story",
      suitability: "再起、復活、セカンドチャンス、経験の活用",
      caution: "過去に囚われず、前向きな姿勢を保つ",
      label: "HJJ",
      start: { hex: "地山謙", pos: line },
      final: { hex: "地山謙", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、既存の価値観や成功体験を一旦脇に置き、初心に戻ります。続いて、新たな学びと成長の機会を得て、視野を広げます。最後に、再び基本に立ち返り、本質的な価値を見出します。突破口は、常に学ぶ姿勢を持ち続けることです。",
      tone: "story",
      suitability: "キャリアチェンジ、新分野挑戦、生涯学習、自己革新",
      caution: "プライドを捨てきれない部分と向き合う",
      label: "HJH",
      start: { hex: "地山謙", pos: line },
      final: { hex: "地山謙", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、社会的な評価や地位を手放し、本当に大切なものを見極めます。続いて、シンプルな生き方を実践し、本質的な豊かさを発見します。最後に、その境地から新たな価値創造を始め、社会に貢献します。突破口は、手放すことで得られる真の自由です。",
      tone: "story",
      suitability: "価値観の転換、ミニマリズム、本質追求、精神的豊かさ",
      caution: "極端な禁欲主義に陥らず、バランスを保つ",
      label: "HHJ",
      start: { hex: "地山謙", pos: line },
      final: { hex: "地山謙", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、日常の小さな実践から謙虚さを身につけていきます。続いて、その積み重ねが習慣となり、人格の一部となります。最後に、自然体で謙虚さを体現できるようになり、周囲に良い影響を与えます。突破口は、謙虚さを特別なものではなく、日常の在り方とすることです。",
      tone: "story",
      suitability: "日常実践、習慣形成、人格形成、継続的成長",
      caution: "完璧を求めず、失敗を恐れない",
      label: "HHH",
      start: { hex: "地山謙", pos: line },
      final: { hex: "地山謙", pos: line },
      updated_at: new Date().toISOString()
    }
  );
}

// 雷地豫（16）
for (let line = 1; line <= 6; line++) {
  newNarratives.push(
    {
      chain_long: "まず、喜びの予感が心に宿り、希望に満ちた未来への期待が高まります。続いて、その期待が現実の行動へと変換され、積極的な取り組みが始まります。最後に、喜びが実現し、その喜びが周囲にも伝播していきます。突破口は、喜びを原動力として困難を乗り越えることです。",
      tone: "story",
      suitability: "新規プロジェクト開始、祝祭、モチベーション向上、チーム活性化",
      caution: "楽観的過ぎず、現実的な計画も忘れない",
      label: "JJJ",
      start: { hex: "雷地豫", pos: line },
      final: { hex: "雷地豫", pos: line + 3 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、小さな成功体験から喜びを感じ、自信を深めていきます。続いて、その自信が大きな挑戦への勇気となり、積極的な行動を生み出します。最後に、新たな視点から喜びの意味を再定義し、より深い満足感を得ます。突破口は、外的な成功より内的な充実感を重視することです。",
      tone: "story",
      suitability: "自己実現、目標達成、成長実感、内的動機づけ",
      caution: "一時的な高揚感に流されず、持続可能な喜びを追求する",
      label: "JJH",
      start: { hex: "雷地豫", pos: line },
      final: { hex: "雷地豫", pos: ((line + 3) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、純粋な喜びと情熱から行動を起こし、周囲を巻き込んでいきます。続いて、現実的な課題に直面し、喜びを維持しながら調整を図ります。最後に、成熟した喜びへと昇華し、持続的な幸福を実現します。突破口は、困難の中でも喜びを見出す能力です。",
      tone: "story",
      suitability: "情熱的な取り組み、創造活動、芸術表現、イノベーション",
      caution: "感情に振り回されず、理性的な判断も保つ",
      label: "JHJ",
      start: { hex: "雷地豫", pos: line },
      final: { hex: "雷地豫", pos: ((line + 2) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、大きな喜びと達成感を味わい、その余韻に浸ります。続いて、その喜びを長続きさせるための工夫を凝らします。最後に、喜びの質を高め、より洗練された楽しみ方を発見します。突破口は、単純な快楽から深い満足感への移行です。",
      tone: "story",
      suitability: "成功の味わい方、余暇の充実、文化的活動、趣味の深化",
      caution: "享楽に溺れず、節度を保つ",
      label: "JHH",
      start: { hex: "雷地豫", pos: line },
      final: { hex: "雷地豫", pos: ((line + 1) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、日常の中に埋もれていた喜びを再発見し、感謝の気持ちを新たにします。続いて、その感謝が行動を変え、より積極的な生き方へと導きます。最後に、喜びが日常化し、安定した幸福感を維持できるようになります。突破口は、当たり前の中に特別を見出すことです。",
      tone: "story",
      suitability: "日常の充実、感謝の実践、ポジティブ思考、幸福度向上",
      caution: "現実逃避にならないよう、問題とも向き合う",
      label: "HJJ",
      start: { hex: "雷地豫", pos: line },
      final: { hex: "雷地豫", pos: ((line + 4) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、喜びの表現方法を見直し、より適切な形を探ります。続いて、内なる喜びを育て、外部環境に左右されない幸福を築きます。最後に、再び表現方法を洗練させ、周囲と喜びを分かち合います。突破口は、喜びの共有が喜びを倍増させることです。",
      tone: "story",
      suitability: "コミュニケーション改善、関係性向上、チーム融和、祝福の共有",
      caution: "他者の感情にも配慮し、押し付けがましくならない",
      label: "HJH",
      start: { hex: "雷地豫", pos: line },
      final: { hex: "雷地豫", pos: ((line + 5) % 6) + 1 },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、過度な期待や興奮を抑え、冷静さを取り戻します。続いて、現実的な視点から状況を見直し、着実な準備を進めます。最後に、準備が整った段階で本当の喜びが訪れ、期待以上の成果を得ます。突破口は、待つことの価値を理解することです。",
      tone: "story",
      suitability: "長期プロジェクト、忍耐が必要な局面、遅延満足、計画的実行",
      caution: "慎重になりすぎて機会を逃さない",
      label: "HHJ",
      start: { hex: "雷地豫", pos: line },
      final: { hex: "雷地豫", pos: line },
      updated_at: new Date().toISOString()
    },
    {
      chain_long: "まず、喜びと悲しみのバランスを理解し、感情の全体性を受け入れます。続いて、あらゆる感情を人生の豊かさとして捉え直します。最後に、感情に振り回されない安定した境地に到達します。突破口は、喜びも悲しみも人生の一部として受容することです。",
      tone: "story",
      suitability: "感情管理、メンタルヘルス、人生観の確立、精神的成熟",
      caution: "感情を抑圧せず、健全に表現する",
      label: "HHH",
      start: { hex: "雷地豫", pos: line },
      final: { hex: "雷地豫", pos: line },
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
    '天火同人': [1,1,1,0,1,1], // 天火同人（13）乾上離下
    '火天大有': [1,0,1,1,1,1], // 火天大有（14）離上乾下
    '地山謙': [0,0,0,0,0,1],   // 地山謙（15）坤上艮下
    '雷地豫': [0,0,0,1,0,0]    // 雷地豫（16）震上坤下
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