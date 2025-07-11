// HaQei Project Main Database File v4.1 - Complete Edition

export const HAQEI_DATA = {
  // --- 基本データ ---
  trigrams_master: [
    {
      trigram_id: 1,
      name_jp: "乾",
      name_en: "天",
      element: "金",
      strength_description:
        "理想を掲げ、人々を牽引する天性のリーダーシップと、困難を乗り越える実行力。",
    },
    {
      trigram_id: 2,
      name_jp: "兌",
      name_en: "沢",
      element: "金",
      strength_description:
        "喜びや楽しみを通じて人と繋がり、場を和ませるコミュニケーション能力と表現力。",
    },
    {
      trigram_id: 3,
      name_jp: "離",
      name_en: "火",
      element: "火",
      strength_description:
        "物事の本質を照らし出す知性と、芸術的なセンスや情熱。人を惹きつける華やかさ。",
    },
    {
      trigram_id: 4,
      name_jp: "震",
      name_en: "雷",
      element: "木",
      strength_description:
        "若々しいエネルギーで、停滞した状況を打ち破る行動力と決断力。人を奮い立たせる力。",
    },
    {
      trigram_id: 5,
      name_jp: "巽",
      name_en: "風",
      element: "木",
      strength_description:
        "相手の心に寄り添い、隅々まで意思を浸透させる共感力と調整能力。しなやかな影響力。",
    },
    {
      trigram_id: 6,
      name_jp: "坎",
      name_en: "水",
      element: "水",
      strength_description:
        "困難な状況でも本質を探求し続ける精神的な強さと、深い洞察力。粘り強さ。",
    },
    {
      trigram_id: 7,
      name_jp: "艮",
      name_en: "山",
      element: "土",
      strength_description:
        "何事にも動じない不動の精神と、物事をじっくりと内省し、継続する力。安定感。",
    },
    {
      trigram_id: 8,
      name_jp: "坤",
      name_en: "地",
      element: "土",
      strength_description:
        "すべてを受け入れ、育む大地の包容力と、縁の下で組織を支える献身的なサポート能力。",
    },
  ],
  element_relationships: [
    {
      source_element: "木",
      target_element: "火",
      relationship_type: "相生",
      metaphor_text:
        "{source}が持つ木のエネルギーは、{target}が持つ火の炎を燃え上がらせます。",
    },
    {
      source_element: "火",
      target_element: "土",
      relationship_type: "相生",
      metaphor_text:
        "{source}が持つ火のエネルギーは、{target}が持つ土の大地を温め、育みます。",
    },
    {
      source_element: "土",
      target_element: "金",
      relationship_type: "相生",
      metaphor_text:
        "{source}が持つ土のエネルギーは、{target}から金という貴い鉱石を産み出します。",
    },
    {
      source_element: "金",
      target_element: "水",
      relationship_type: "相生",
      metaphor_text:
        "{source}が持つ金のエネルギーの表面には、{target}という清らかな水滴が生まれます。",
    },
    {
      source_element: "水",
      target_element: "木",
      relationship_type: "相生",
      metaphor_text:
        "{source}が持つ水のエネルギーは、{target}という若木を育む、生命の源です。",
    },
    {
      source_element: "木",
      target_element: "土",
      relationship_type: "相剋",
      metaphor_text:
        "{source}が持つ木のエネルギーは、{target}が持つ土の養分を吸い上げ、その力を抑制します。",
    },
    {
      source_element: "土",
      target_element: "水",
      relationship_type: "相剋",
      metaphor_text:
        "{source}が持つ土のエネルギーは、{target}が持つ水の流れを堰き止め、その自由を奪います。",
    },
    {
      source_element: "水",
      target_element: "火",
      relationship_type: "相剋",
      metaphor_text:
        "{source}が持つ水のエネルギーは、{target}が持つ火の炎を消し止め、その輝きを失わせます。",
    },
    {
      source_element: "火",
      target_element: "金",
      relationship_type: "相剋",
      metaphor_text:
        "{source}が持つ火のエネルギーは、{target}が持つ金の金属を溶かし、その形を変えてしまいます。",
    },
    {
      source_element: "金",
      target_element: "木",
      relationship_type: "相剋",
      metaphor_text:
        "{source}が持つ金のエネルギーは、{target}が持つ木の若木を切り倒す斧にもなります。",
    },
  ],
  hexagrams_master: [
    {
      hexagram_id: 1,
      name_jp: "乾為天",
      reading: "けんいてん",
      catchphrase: "天翔ける龍のような、天性のリーダー",
      upper_trigram_id: 1,
      lower_trigram_id: 1,
      description:
        "積極的、エネルギッシュ、プライドが高い、自己中心的、正義感が強い",
      keywords: "創造,リーダーシップ,力",
    },
    {
      hexagram_id: 2,
      name_jp: "坤為地",
      reading: "こんいち",
      catchphrase: "大地の母のように、すべてを受け入れる人",
      upper_trigram_id: 8,
      lower_trigram_id: 8,
      description: "穏やか、従順、勤勉、受動的、包容力がある、縁の下の力持ち",
      keywords: "受容,育成,サポート",
    },
    {
      hexagram_id: 3,
      name_jp: "水雷屯",
      reading: "すいらいちゅん",
      catchphrase: "産みの苦しみを乗り越える、粘り強い開拓者",
      upper_trigram_id: 6,
      lower_trigram_id: 4,
      description: "悩みやすい、慎重、粘り強い、内向的、苦労性",
      keywords: "産みの苦しみ,混沌,始まり",
    },
    {
      hexagram_id: 4,
      name_jp: "山水蒙",
      reading: "さんすいもう",
      catchphrase: "未知を恐れず、何事も素直に学べる学習者",
      upper_trigram_id: 7,
      lower_trigram_id: 6,
      description: "未熟、子供っぽい、無邪気、教えを請うことに抵抗がない",
      keywords: "未熟,教育,啓蒙",
    },
    {
      hexagram_id: 5,
      name_jp: "水天需",
      reading: "すいてんじゅ",
      catchphrase: "最善の時を待てる、辛抱強い戦略家",
      upper_trigram_id: 6,
      lower_trigram_id: 1,
      description: "どっしりしている、焦らない、いずれ良くなると信じている",
      keywords: "待機,準備,忍耐",
    },
    {
      hexagram_id: 6,
      name_jp: "天水訟",
      reading: "てんすいしょう",
      catchphrase: "信念を貫き、正義を問う論客",
      upper_trigram_id: 1,
      lower_trigram_id: 6,
      description: "理屈っぽい、負けず嫌い、争いごとを好む、正義感が強い",
      keywords: "争い,対立,訴訟",
    },
    {
      hexagram_id: 7,
      name_jp: "地水師",
      reading: "ちすいし",
      catchphrase: "規律と統率力で、組織を導く司令官",
      upper_trigram_id: 8,
      lower_trigram_id: 6,
      description: "厳格、規律を重んじる、目的意識が強い、大衆心理を読む",
      keywords: "組織,規律,リーダーシップ",
    },
    {
      hexagram_id: 8,
      name_jp: "水地比",
      reading: "すいちひ",
      catchphrase: "心で繋がり、人を支えるサポーター",
      upper_trigram_id: 6,
      lower_trigram_id: 8,
      description: "社交的、情が深い、誰とでも仲良くなれる、リーダーを支える",
      keywords: "協力,親密,結束",
    },
    {
      hexagram_id: 9,
      name_jp: "風天小畜",
      reading: "ふうてんしょうちく",
      catchphrase: "小さな努力を積み重ねる、堅実な実務家",
      upper_trigram_id: 5,
      lower_trigram_id: 1,
      description: "控えめ、真面目、コツコツ努力する、少し頼りない印象",
      keywords: "小さな蓄積,一時的な停滞",
    },
    {
      hexagram_id: 10,
      name_jp: "天澤履",
      reading: "てんたくり",
      catchphrase: "礼節をわきまえ、慎重に進むチャレンジャー",
      upper_trigram_id: 1,
      lower_trigram_id: 2,
      description: "謙虚、真面目、目上を敬う、慎重に行動する",
      keywords: "礼儀,慎重,危険回避",
    },
    {
      hexagram_id: 11,
      name_jp: "地天泰",
      reading: "ちてんたい",
      catchphrase: "異なる要素を調和させる、平和を愛する調整役",
      upper_trigram_id: 8,
      lower_trigram_id: 1,
      description: "穏やか、社交的、誰とでもうまくやれる、包容力がある",
      keywords: "平和,繁栄,調和",
    },
    {
      hexagram_id: 12,
      name_jp: "天地否",
      reading: "てんちひ",
      catchphrase: "自分の内なる世界を、深く追求する思想家",
      upper_trigram_id: 1,
      lower_trigram_id: 8,
      description: "内向的、非社交的、頑固、人を寄せ付けない雰囲気",
      keywords: "閉塞,不調和,停滞",
    },
    {
      hexagram_id: 13,
      name_jp: "天火同人",
      reading: "てんかどうじん",
      catchphrase: "公平な理念で、人々を団結させるまとめ役",
      upper_trigram_id: 1,
      lower_trigram_id: 3,
      description: "社交的、誰とでも分け隔てなく接する、オープンな性格",
      keywords: "協力,大同団結,公正",
    },
    {
      hexagram_id: 14,
      name_jp: "火天大有",
      reading: "かてんたいゆう",
      catchphrase: "太陽のように、寛大さで人を照らすリーダー",
      upper_trigram_id: 3,
      lower_trigram_id: 1,
      description: "明るく、寛大、おおらか、多くの人に慕われる",
      keywords: "大いなる所有,繁栄,公正な分配",
    },
    {
      hexagram_id: 15,
      name_jp: "地山謙",
      reading: "ちさんけん",
      catchphrase: "実力があっても、常に謙虚でいられる人格者",
      upper_trigram_id: 8,
      lower_trigram_id: 7,
      description: "腰が低い、実力があるのにひけらかさない、誰からも好かれる",
      keywords: "謙虚,有能,持続",
    },
    {
      hexagram_id: 16,
      name_jp: "雷地豫",
      reading: "らいちよ",
      catchphrase: "周到な準備で、人を楽しませるエンターテイナー",
      upper_trigram_id: 4,
      lower_trigram_id: 8,
      description:
        "用意周到、楽観的、音楽や楽しいことが好き、人を喜ばせるのが好き",
      keywords: "喜び,準備,油断",
    },
    {
      hexagram_id: 17,
      name_jp: "沢雷随",
      reading: "たくらいずい",
      catchphrase: "変化の波に乗りこなす、柔軟なフォロワー",
      upper_trigram_id: 2,
      lower_trigram_id: 4,
      description: "素直、社交的、人に合わせるのが上手、軽率な面も",
      keywords: "追随,変化への適応",
    },
    {
      hexagram_id: 18,
      name_jp: "山風蠱",
      reading: "さんぷうこ",
      catchphrase: "根本原因を立て直す、情熱的な改革者",
      upper_trigram_id: 7,
      lower_trigram_id: 5,
      description:
        "責任感が強い、困難に立ち向かう、厳しい、物事を根本から立て直したい",
      keywords: "腐敗の立て直し,改革",
    },
    {
      hexagram_id: 19,
      name_jp: "地沢臨",
      reading: "ちたくりん",
      catchphrase: "人を育て導く、面倒見のいいリーダー",
      upper_trigram_id: 8,
      lower_trigram_id: 2,
      description: "明るく、おおらか、親分肌・姉御肌、人を育てるのが好き",
      keywords: "成長,接近,リーダーシップ",
    },
    {
      hexagram_id: 20,
      name_jp: "風地観",
      reading: "ふうちかん",
      catchphrase: "物事の本質を見抜く、静かな観察者",
      upper_trigram_id: 5,
      lower_trigram_id: 8,
      description: "静か、思慮深い、物事の本質を見抜く、精神性が高い",
      keywords: "観察,洞察,自己反省",
    },
    {
      hexagram_id: 21,
      name_jp: "火雷噬嗑",
      reading: "からいぜいごう",
      catchphrase: "障害を噛み砕き、断固として進む実行者",
      upper_trigram_id: 3,
      lower_trigram_id: 4,
      description: "歯に衣着せぬ、情熱的、正義感が強い、怒りっぽい",
      keywords: "困難の排除,公正な裁き",
    },
    {
      hexagram_id: 22,
      name_jp: "山火賁",
      reading: "さんかひ",
      catchphrase: "本質を美しく彩る、天性のアーティスト",
      upper_trigram_id: 7,
      lower_trigram_id: 3,
      description: "おしゃれ、外面を気にする、優雅、見栄っ張り",
      keywords: "飾り,美しさ,調和",
    },
    {
      hexagram_id: 23,
      name_jp: "山地剝",
      reading: "さんちはく",
      catchphrase: "古いものを手放し、本質を見出す変革者",
      upper_trigram_id: 7,
      lower_trigram_id: 8,
      description: "保守的、現状にしがみつく、衰運にある",
      keywords: "衰退,崩壊,変化の時",
    },
    {
      hexagram_id: 24,
      name_jp: "地雷復",
      reading: "ちらいふく",
      catchphrase: "失敗を次に活かす、しなやかな挑戦者",
      upper_trigram_id: 8,
      lower_trigram_id: 4,
      description: "前向き、失敗を恐れない、素直、根本に戻って考える",
      keywords: "回復,回帰,新たな始まり",
    },
    {
      hexagram_id: 25,
      name_jp: "天雷无妄",
      reading: "てんらいむぼう",
      catchphrase: "自然体で、あるがままを受け入れる楽天家",
      upper_trigram_id: 1,
      lower_trigram_id: 4,
      description: "天真爛漫、正直、裏表がない、自然のまま",
      keywords: "無垢,自然体,予期せぬ災難",
    },
    {
      hexagram_id: 26,
      name_jp: "山天大畜",
      reading: "さんてんたいちく",
      catchphrase: "内に力を蓄え、好機を待つ大器晩成の人",
      upper_trigram_id: 7,
      lower_trigram_id: 1,
      description:
        "どっしりと構えている、思慮深い、忍耐強い、内面に大きなエネルギーを秘めている",
      keywords: "大いなる蓄積,才能の開花",
    },
    {
      hexagram_id: 27,
      name_jp: "山雷頤",
      reading: "さんらいい",
      catchphrase: "言葉と時間をかけて、物事を育む専門家",
      upper_trigram_id: 7,
      lower_trigram_id: 4,
      description:
        "おっとりしている、自分のペースを大事にする、食いしん坊、言葉を慎む",
      keywords: "養う,口,正しい食と情報",
    },
    {
      hexagram_id: 28,
      name_jp: "澤風大過",
      reading: "たくふうたいか",
      catchphrase: "常識の枠を超える、大胆なゲームチェンジャー",
      upper_trigram_id: 2,
      lower_trigram_id: 5,
      description: "型破り、大胆不敵、やりすぎてしまう、責任感が強い",
      keywords: "異常事態,危機,覚悟",
    },
    {
      hexagram_id: 29,
      name_jp: "坎為水",
      reading: "かんいすい",
      catchphrase: "困難の渦中で、真理を見出す不屈の探求者",
      upper_trigram_id: 6,
      lower_trigram_id: 6,
      description: "苦労性、内省的、悩みやすい、粘り強い、真理を求める",
      keywords: "困難,危険,陥る",
    },
    {
      hexagram_id: 30,
      name_jp: "離為火",
      reading: "りいか",
      catchphrase: "情熱と知性で、人を惹きつける華やかなスター",
      upper_trigram_id: 3,
      lower_trigram_id: 3,
      description: "明るく華やか、感情の起伏が激しい、知的、プライドが高い",
      keywords: "輝き,依存,明智",
    },
    {
      hexagram_id: 31,
      name_jp: "沢山咸",
      reading: "たくざんかん",
      catchphrase: "理屈抜きに、心で感じ取れる共感者",
      upper_trigram_id: 2,
      lower_trigram_id: 7,
      description: "感受性が豊か、デリケート、ロマンチスト、影響されやすい",
      keywords: "感応,共感,相互作用",
    },
    {
      hexagram_id: 32,
      name_jp: "雷風恒",
      reading: "らいふうこう",
      catchphrase: "決めた道を、着実に歩み続ける継続者",
      upper_trigram_id: 4,
      lower_trigram_id: 5,
      description: "地道、真面目、一度決めたことはやり通す、変化を嫌う",
      keywords: "持続,恒久,安定",
    },
    {
      hexagram_id: 33,
      name_jp: "天山遯",
      reading: "てんざんとん",
      catchphrase: "賢明な距離感を保つ、クールな戦略家",
      upper_trigram_id: 1,
      lower_trigram_id: 7,
      description: "賢い、逃げ上手、深入りしない、冷静",
      keywords: "撤退,身を引く,自己防衛",
    },
    {
      hexagram_id: 34,
      name_jp: "雷天大壮",
      reading: "らいてんたいそう",
      catchphrase: "目標に向かって、力強く進むチャレンジャー",
      upper_trigram_id: 4,
      lower_trigram_id: 1,
      description: "血気盛ん、猪突猛進、エネルギッシュ、正義感が強い",
      keywords: "大いなる勢い,力強い前進",
    },
    {
      hexagram_id: 35,
      name_jp: "火地晋",
      reading: "かちしん",
      catchphrase: "周りを明るく照らし、前進を促すプロモーター",
      upper_trigram_id: 3,
      lower_trigram_id: 8,
      description: "明るい、前向き、目標に向かって進む、人に認められたい",
      keywords: "進展,昇進,光明",
    },
    {
      hexagram_id: 36,
      name_jp: "地火明夷",
      reading: "ちかめいい",
      catchphrase: "逆境にあっても、希望を失わない芯の強い人",
      upper_trigram_id: 8,
      lower_trigram_id: 3,
      description: "苦労性、用心深い、本心を明かさない、内に強い意志を持つ",
      keywords: "光明の隠蔽,困難,忍耐",
    },
    {
      hexagram_id: 37,
      name_jp: "風火家人",
      reading: "ふうかかじん",
      catchphrase: "自分の居場所を、大切に守り育てる人",
      upper_trigram_id: 5,
      lower_trigram_id: 3,
      description: "真面目、規律正しい、情愛深い、内向き",
      keywords: "家族,秩序,内部統制",
    },
    {
      hexagram_id: 38,
      name_jp: "火沢睽",
      reading: "かたくけい",
      catchphrase: "あえて人と違う道を行く、個性的な独創家",
      upper_trigram_id: 3,
      lower_trigram_id: 2,
      description: "あまのじゃく、反骨精神が旺盛、人と同じことを嫌う、疑り深い",
      keywords: "対立,不和,相互理解の困難",
    },
    {
      hexagram_id: 39,
      name_jp: "水山蹇",
      reading: "すいざんけん",
      catchphrase: "困難な状況を、知恵と工夫で乗り越える策士",
      upper_trigram_id: 6,
      lower_trigram_id: 7,
      description: "苦労性、悩みが多い、進退窮まる、助けを求めるのが上手",
      keywords: "困難,足踏み,立ち往生",
    },
    {
      hexagram_id: 40,
      name_jp: "雷水解",
      reading: "らいすいかい",
      catchphrase: "問題をスピーディに解決する、決断力のある人",
      upper_trigram_id: 4,
      lower_trigram_id: 6,
      description: "さっぱりしている、過去にこだわらない、行動が早い、寛大",
      keywords: "解決,解放,新たな始まり",
    },
    {
      hexagram_id: 41,
      name_jp: "山沢損",
      reading: "さんたくそん",
      catchphrase: "人のために自分を役立てる、誠実な貢献者",
      upper_trigram_id: 7,
      lower_trigram_id: 2,
      description: "控えめ、我慢強い、自分のことを後回しにする",
      keywords: "損失,削減,自己犠牲",
    },
    {
      hexagram_id: 42,
      name_jp: "風雷益",
      reading: "ふうらいえき",
      catchphrase: "善意の循環を生み出す、心優しいサポーター",
      upper_trigram_id: 5,
      lower_trigram_id: 4,
      description: "親切、行動的、自己犠牲をいとわない、前向き",
      keywords: "増益,貢献,成長",
    },
    {
      hexagram_id: 43,
      name_jp: "沢天夬",
      reading: "たくてんかい",
      catchphrase: "ためらわずに決断し、道を拓く突破役",
      upper_trigram_id: 2,
      lower_trigram_id: 1,
      description: "大胆不敵、決断が速い、白黒はっきりさせたい、短気な面も",
      keywords: "決断,決行,突破",
    },
    {
      hexagram_id: 44,
      name_jp: "天風姤",
      reading: "てんぷうこう",
      catchphrase: "偶然の出会いをチャンスに変える、天性のネットワーカー",
      upper_trigram_id: 1,
      lower_trigram_id: 5,
      description: "魅力的、積極的、油断しやすい、移り気",
      keywords: "予期せぬ出会い,影響力",
    },
    {
      hexagram_id: 45,
      name_jp: "沢地萃",
      reading: "たくちすい",
      catchphrase: "人と喜びが集まる場を創る、中心人物",
      upper_trigram_id: 2,
      lower_trigram_id: 8,
      description: "明るい、社交的、お祭り好き、リーダーシップがある",
      keywords: "結集,結束,喜び",
    },
    {
      hexagram_id: 46,
      name_jp: "地風升",
      reading: "ちふうしょう",
      catchphrase: "地道な努力で、着実に成長できる人",
      upper_trigram_id: 8,
      lower_trigram_id: 5,
      description: "謙虚、真面目、努力家、目上を敬う",
      keywords: "上昇,成長,着実な進歩",
    },
    {
      hexagram_id: 47,
      name_jp: "沢水困",
      reading: "たくすいこん",
      catchphrase: "苦しい状況でも、自分を見失わない哲学者",
      upper_trigram_id: 2,
      lower_trigram_id: 6,
      description: "苦労性、悲観的、口が重い、内に強い意志を秘めている",
      keywords: "困窮,逆境,忍耐",
    },
    {
      hexagram_id: 48,
      name_jp: "水風井",
      reading: "すいふうせい",
      catchphrase: "誰にでも公平に尽くせる、縁の下の力持ち",
      upper_trigram_id: 6,
      lower_trigram_id: 5,
      description: "穏やか、縁の下の力持ち、誰にでも公平、地味",
      keywords: "供給,安定,継続的改善",
    },
    {
      hexagram_id: 49,
      name_jp: "沢火革",
      reading: "たくかかく",
      catchphrase: "古い常識を刷新する、情熱を持った改革者",
      upper_trigram_id: 2,
      lower_trigram_id: 3,
      description: "ラディカル、現状に満足しない、理想主義者",
      keywords: "改革,変革,革命",
    },
    {
      hexagram_id: 50,
      name_jp: "火風鼎",
      reading: "かふうてい",
      catchphrase: "新たな安定を築き上げる、懐の深いまとめ役",
      upper_trigram_id: 3,
      lower_trigram_id: 5,
      description: "どっしりしている、人を受け入れる、三方よしの精神を持つ",
      keywords: "形成,安定,文化の確立",
    },
    {
      hexagram_id: 51,
      name_jp: "震為雷",
      reading: "しんいらい",
      catchphrase: "変化をチャンスに変える、瞬発力のある行動派",
      upper_trigram_id: 4,
      lower_trigram_id: 4,
      description: "活発、エネルギッシュ、驚きやすい、短気、声が大きい",
      keywords: "衝撃,覚醒,急変",
    },
    {
      hexagram_id: 52,
      name_jp: "艮為山",
      reading: "ごんいさん",
      catchphrase: "動じない自己を確立した、静かな求道者",
      upper_trigram_id: 7,
      lower_trigram_id: 7,
      description: "冷静沈着、動じない、無口、頑固、自分の世界を持つ",
      keywords: "静止,休息,自己抑制",
    },
    {
      hexagram_id: 53,
      name_jp: "風山漸",
      reading: "ふうざんぜん",
      catchphrase: "物事を一歩ずつ、着実に進める誠実な人",
      upper_trigram_id: 5,
      lower_trigram_id: 7,
      description: "真面目、慎重、一歩一歩進む、時間をかける",
      keywords: "漸進,着実な成長,婚姻",
    },
    {
      hexagram_id: 54,
      name_jp: "雷沢帰妹",
      reading: "らいたくきまい",
      catchphrase: "自分の情熱に正直に生きる、純粋な情熱家",
      upper_trigram_id: 4,
      lower_trigram_id: 2,
      description: "情熱的、衝動的、後先を考えない、わがまま",
      keywords: "不自然な関係,秩序の乱れ",
    },
    {
      hexagram_id: 55,
      name_jp: "雷火豊",
      reading: "らいかほう",
      catchphrase: "豊かさを創り出し、分かち合うカリスマ",
      upper_trigram_id: 4,
      lower_trigram_id: 3,
      description: "明るく、派手好き、エネルギッシュ、自信家",
      keywords: "繁栄の極み,豊かさ,光明",
    },
    {
      hexagram_id: 56,
      name_jp: "火山旅",
      reading: "かざんりょ",
      catchphrase: "一箇所に留まらない、自由な旅人",
      upper_trigram_id: 3,
      lower_trigram_id: 7,
      description: "孤独を好む、根無し草、慎み深い、常にアウェイな感覚",
      keywords: "旅,変化,異郷での適応",
    },
    {
      hexagram_id: 57,
      name_jp: "巽為風",
      reading: "そんいふう",
      catchphrase: "隅々まで心配りができる、しなやかな調整役",
      upper_trigram_id: 5,
      lower_trigram_id: 5,
      description: "穏やか、優柔不断、人に合わせるのがうまい、社交的",
      keywords: "浸透,影響,柔軟性",
    },
    {
      hexagram_id: 58,
      name_jp: "兌為沢",
      reading: "だいたく",
      catchphrase: "人と話すこと、喜ばせることが好きなエンターテイナー",
      upper_trigram_id: 2,
      lower_trigram_id: 2,
      description: "明るい、おしゃべり好き、楽しいことが好き、愛嬌がある",
      keywords: "喜び,コミュニケーション",
    },
    {
      hexagram_id: 59,
      name_jp: "風水渙",
      reading: "ふうすいかん",
      catchphrase: "心の壁を溶かし、風通しを良くする調整役",
      upper_trigram_id: 5,
      lower_trigram_id: 6,
      description: "大局的な視点を持つ、私心がない、人々をまとめるのが上手",
      keywords: "困難の解消,分散",
    },
    {
      hexagram_id: 60,
      name_jp: "水沢節",
      reading: "すいたくせつ",
      catchphrase: "自分を律し、節度を保つことができる人",
      upper_trigram_id: 6,
      lower_trigram_id: 2,
      description: "ケジメを大事にする、自己管理ができる、真面目、少し窮屈",
      keywords: "節度,規律,抑制",
    },
    {
      hexagram_id: 61,
      name_jp: "風沢中孚",
      reading: "ふうたくちゅうふ",
      catchphrase: "誠実さで、人の心を動かすことができる人",
      upper_trigram_id: 5,
      lower_trigram_id: 2,
      description: "裏表がない、正直、素直、誠意がある",
      keywords: "真心,信頼,共感",
    },
    {
      hexagram_id: 62,
      name_jp: "雷山小過",
      reading: "らいざんしょうか",
      catchphrase: "謙虚すぎるほどに、丁寧さを重んじる人",
      upper_trigram_id: 4,
      lower_trigram_id: 7,
      description: "控えめ、臆病、石橋を叩いて渡る、自分に自信がない",
      keywords: "少し行き過ぎ,異常事態",
    },
    {
      hexagram_id: 63,
      name_jp: "水火既済",
      reading: "すいかきせい",
      catchphrase: "完璧なバランスを求める、秩序の番人",
      upper_trigram_id: 6,
      lower_trigram_id: 3,
      description: "整然としている、完璧主義、安定を好む、保守的",
      keywords: "完成,調和,維持",
    },
    {
      hexagram_id: 64,
      name_jp: "火水未済",
      reading: "かすいびせい",
      catchphrase: "未完成の中に、無限の可能性を見出す探求者",
      upper_trigram_id: 3,
      lower_trigram_id: 6,
      description: "慎重、思慮深い、混乱の中でも希望を失わない",
      keywords: "未完成,継続,希望",
    },
  ],
  // --- 性格分析マッピングデータ ---
  mbti_map: [
    {
      mbti_type: "INTJ",
      scores: [
        { trigram_id: 1, score: 5 },
        { trigram_id: 2, score: 3 },
        { trigram_id: 3, score: 4 },
        { trigram_id: 4, score: 2 },
        { trigram_id: 5, score: 1 },
        { trigram_id: 6, score: 3 },
        { trigram_id: 7, score: 2 },
        { trigram_id: 8, score: 1 },
      ],
    },
    {
      mbti_type: "INTP",
      scores: [
        { trigram_id: 1, score: 1 },
        { trigram_id: 2, score: 2 },
        { trigram_id: 3, score: 2 },
        { trigram_id: 4, score: 1 },
        { trigram_id: 5, score: 4 },
        { trigram_id: 6, score: 3 },
        { trigram_id: 7, score: 5 },
        { trigram_id: 8, score: 1 },
      ],
    },
    {
      mbti_type: "ENTJ",
      scores: [
        { trigram_id: 1, score: 5 },
        { trigram_id: 2, score: 1 },
        { trigram_id: 3, score: 2 },
        { trigram_id: 4, score: 5 },
        { trigram_id: 5, score: 2 },
        { trigram_id: 6, score: 2 },
        { trigram_id: 7, score: 1 },
        { trigram_id: 8, score: 1 },
      ],
    },
    {
      mbti_type: "ENTP",
      scores: [
        { trigram_id: 1, score: 2 },
        { trigram_id: 2, score: 3 },
        { trigram_id: 3, score: 3 },
        { trigram_id: 4, score: 2 },
        { trigram_id: 5, score: 5 },
        { trigram_id: 6, score: 2 },
        { trigram_id: 7, score: 3 },
        { trigram_id: 8, score: 1 },
      ],
    },
    {
      mbti_type: "INFJ",
      scores: [
        { trigram_id: 1, score: 4 },
        { trigram_id: 2, score: 4 },
        { trigram_id: 3, score: 2 },
        { trigram_id: 4, score: 1 },
        { trigram_id: 5, score: 4 },
        { trigram_id: 6, score: 3 },
        { trigram_id: 7, score: 2 },
        { trigram_id: 8, score: 1 },
      ],
    },
    {
      mbti_type: "INFP",
      scores: [
        { trigram_id: 1, score: 1 },
        { trigram_id: 2, score: 5 },
        { trigram_id: 3, score: 5 },
        { trigram_id: 4, score: 1 },
        { trigram_id: 5, score: 4 },
        { trigram_id: 6, score: 2 },
        { trigram_id: 7, score: 2 },
        { trigram_id: 8, score: 1 },
      ],
    },
    {
      mbti_type: "ENFJ",
      scores: [
        { trigram_id: 1, score: 3 },
        { trigram_id: 2, score: 5 },
        { trigram_id: 3, score: 3 },
        { trigram_id: 4, score: 2 },
        { trigram_id: 5, score: 5 },
        { trigram_id: 6, score: 2 },
        { trigram_id: 7, score: 1 },
        { trigram_id: 8, score: 1 },
      ],
    },
    {
      mbti_type: "ENFP",
      scores: [
        { trigram_id: 1, score: 2 },
        { trigram_id: 2, score: 4 },
        { trigram_id: 3, score: 5 },
        { trigram_id: 4, score: 2 },
        { trigram_id: 5, score: 5 },
        { trigram_id: 6, score: 1 },
        { trigram_id: 7, score: 1 },
        { trigram_id: 8, score: 1 },
      ],
    },
    {
      mbti_type: "ISTJ",
      scores: [
        { trigram_id: 1, score: 3 },
        { trigram_id: 2, score: 1 },
        { trigram_id: 3, score: 2 },
        { trigram_id: 4, score: 2 },
        { trigram_id: 5, score: 1 },
        { trigram_id: 6, score: 2 },
        { trigram_id: 7, score: 5 },
        { trigram_id: 8, score: 5 },
      ],
    },
    {
      mbti_type: "ISFJ",
      scores: [
        { trigram_id: 1, score: 1 },
        { trigram_id: 2, score: 4 },
        { trigram_id: 3, score: 2 },
        { trigram_id: 4, score: 1 },
        { trigram_id: 5, score: 3 },
        { trigram_id: 6, score: 2 },
        { trigram_id: 7, score: 4 },
        { trigram_id: 8, score: 5 },
      ],
    },
    {
      mbti_type: "ESTJ",
      scores: [
        { trigram_id: 1, score: 4 },
        { trigram_id: 2, score: 1 },
        { trigram_id: 3, score: 1 },
        { trigram_id: 4, score: 5 },
        { trigram_id: 5, score: 2 },
        { trigram_id: 6, score: 1 },
        { trigram_id: 7, score: 3 },
        { trigram_id: 8, score: 4 },
      ],
    },
    {
      mbti_type: "ESFJ",
      scores: [
        { trigram_id: 1, score: 1 },
        { trigram_id: 2, score: 5 },
        { trigram_id: 3, score: 2 },
        { trigram_id: 4, score: 2 },
        { trigram_id: 5, score: 4 },
        { trigram_id: 6, score: 1 },
        { trigram_id: 7, score: 2 },
        { trigram_id: 8, score: 4 },
      ],
    },
    {
      mbti_type: "ISTP",
      scores: [
        { trigram_id: 1, score: 2 },
        { trigram_id: 2, score: 2 },
        { trigram_id: 3, score: 1 },
        { trigram_id: 4, score: 2 },
        { trigram_id: 5, score: 2 },
        { trigram_id: 6, score: 4 },
        { trigram_id: 7, score: 5 },
        { trigram_id: 8, score: 3 },
      ],
    },
    {
      mbti_type: "ISFP",
      scores: [
        { trigram_id: 1, score: 1 },
        { trigram_id: 2, score: 5 },
        { trigram_id: 3, score: 5 },
        { trigram_id: 4, score: 2 },
        { trigram_id: 5, score: 2 },
        { trigram_id: 6, score: 2 },
        { trigram_id: 7, score: 1 },
        { trigram_id: 8, score: 3 },
      ],
    },
    {
      mbti_type: "ESTP",
      scores: [
        { trigram_id: 1, score: 2 },
        { trigram_id: 2, score: 3 },
        { trigram_id: 3, score: 1 },
        { trigram_id: 4, score: 5 },
        { trigram_id: 5, score: 2 },
        { trigram_id: 6, score: 2 },
        { trigram_id: 7, score: 3 },
        { trigram_id: 8, score: 5 },
      ],
    },
    {
      mbti_type: "ESFP",
      scores: [
        { trigram_id: 1, score: 1 },
        { trigram_id: 2, score: 4 },
        { trigram_id: 3, score: 5 },
        { trigram_id: 4, score: 4 },
        { trigram_id: 5, score: 2 },
        { trigram_id: 6, score: 1 },
        { trigram_id: 7, score: 1 },
        { trigram_id: 8, score: 5 },
      ],
    },
  ],
  mbti_nicknames: [
    { type: "ISTJ", nickname: "管理者" },
    { type: "ISFJ", nickname: "擁護者" },
    { type: "INFJ", nickname: "提唱者" },
    { type: "INTJ", nickname: "建築家" },
    { type: "ISTP", nickname: "巨匠" },
    { type: "ISFP", nickname: "冒険家" },
    { type: "INFP", nickname: "仲介者" },
    { type: "INTP", nickname: "論理学者" },
    { type: "ESTP", nickname: "起業家" },
    { type: "ESFP", nickname: "エンターテイナー" },
    { type: "ENFP", nickname: "広報運動家" },
    { type: "ENTP", nickname: "討論者" },
    { type: "ESTJ", nickname: "幹部" },
    { type: "ESFJ", nickname: "領事官" },
    { type: "ENFJ", nickname: "主人公" },
    { type: "ENTJ", nickname: "指揮官" },
  ],
  enneagram_map: [
    {
      enneagram_type: "1",
      nickname: "改革する人",
      scores: [
        { trigram_id: 7, score: 2.5 },
        { trigram_id: 4, score: 1.5 },
        { trigram_id: 1, score: 1 },
      ],
    },
    {
      enneagram_type: "2",
      nickname: "助ける人",
      scores: [
        { trigram_id: 8, score: 2 },
        { trigram_id: 2, score: 1.5 },
        { trigram_id: 3, score: 1 },
        { trigram_id: 5, score: 0.5 },
      ],
    },
    {
      enneagram_type: "3",
      nickname: "達成する人",
      scores: [
        { trigram_id: 3, score: 2.5 },
        { trigram_id: 4, score: 1.5 },
        { trigram_id: 5, score: 1 },
      ],
    },
    {
      enneagram_type: "4",
      nickname: "個性的な人",
      scores: [
        { trigram_id: 3, score: 2 },
        { trigram_id: 6, score: 2 },
        { trigram_id: 7, score: 1 },
      ],
    },
    {
      enneagram_type: "5",
      nickname: "調べる人",
      scores: [
        { trigram_id: 7, score: 2.5 },
        { trigram_id: 6, score: 1.5 },
        { trigram_id: 1, score: 1 },
      ],
    },
    {
      enneagram_type: "6",
      nickname: "忠実な人",
      scores: [
        { trigram_id: 8, score: 2 },
        { trigram_id: 7, score: 1.5 },
        { trigram_id: 6, score: 1.5 },
      ],
    },
    {
      enneagram_type: "7",
      nickname: "熱中する人",
      scores: [
        { trigram_id: 5, score: 2.5 },
        { trigram_id: 2, score: 1.5 },
        { trigram_id: 3, score: 1 },
      ],
    },
    {
      enneagram_type: "8",
      nickname: "挑戦する人",
      scores: [
        { trigram_id: 4, score: 2.5 },
        { trigram_id: 1, score: 1.5 },
        { trigram_id: 8, score: 1 },
      ],
    },
    {
      enneagram_type: "9",
      nickname: "平和を好む人",
      scores: [
        { trigram_id: 8, score: 2.5 },
        { trigram_id: 5, score: 1.5 },
        { trigram_id: 2, score: 1 },
      ],
    },
  ],
  strengthsfinder_map: [
    {
      strength_finder_talent: "達成欲",
      domain: "実行力",
      scores: [
        { trigram_id: 4, score: 2 },
        { trigram_id: 3, score: 0.5 },
        { trigram_id: 7, score: 0.5 },
      ],
    },
    {
      strength_finder_talent: "アレンジ",
      domain: "実行力",
      scores: [
        { trigram_id: 5, score: 1.5 },
        { trigram_id: 8, score: 1 },
        { trigram_id: 2, score: 0.5 },
      ],
    },
    {
      strength_finder_talent: "信念",
      domain: "実行力",
      scores: [
        { trigram_id: 7, score: 2.5 },
        { trigram_id: 1, score: 0.5 },
      ],
    },
    {
      strength_finder_talent: "公平性",
      domain: "実行力",
      scores: [
        { trigram_id: 7, score: 2 },
        { trigram_id: 1, score: 1 },
      ],
    },
    {
      strength_finder_talent: "慎重さ",
      domain: "実行力",
      scores: [
        { trigram_id: 6, score: 2 },
        { trigram_id: 7, score: 1 },
      ],
    },
    {
      strength_finder_talent: "規律性",
      domain: "実行力",
      scores: [
        { trigram_id: 7, score: 2.5 },
        { trigram_id: 8, score: 0.5 },
      ],
    },
    {
      strength_finder_talent: "責任感",
      domain: "実行力",
      scores: [
        { trigram_id: 8, score: 2.5 },
        { trigram_id: 7, score: 0.5 },
      ],
    },
    {
      strength_finder_talent: "回復志向",
      domain: "実行力",
      scores: [
        { trigram_id: 6, score: 1.5 },
        { trigram_id: 4, score: 1 },
        { trigram_id: 2, score: 0.5 },
      ],
    },
    {
      strength_finder_talent: "目標志向",
      domain: "実行力",
      scores: [
        { trigram_id: 1, score: 1.5 },
        { trigram_id: 4, score: 1.5 },
      ],
    },
    {
      strength_finder_talent: "活発性",
      domain: "影響力",
      scores: [
        { trigram_id: 4, score: 2.5 },
        { trigram_id: 3, score: 0.5 },
      ],
    },
    {
      strength_finder_talent: "指令性",
      domain: "影響力",
      scores: [
        { trigram_id: 1, score: 1.5 },
        { trigram_id: 4, score: 1.5 },
      ],
    },
    {
      strength_finder_talent: "コミュニケーション",
      domain: "影響力",
      scores: [
        { trigram_id: 5, score: 1.5 },
        { trigram_id: 2, score: 1 },
        { trigram_id: 3, score: 0.5 },
      ],
    },
    {
      strength_finder_talent: "競争性",
      domain: "影響力",
      scores: [
        { trigram_id: 4, score: 1.5 },
        { trigram_id: 3, score: 1.5 },
      ],
    },
    {
      strength_finder_talent: "最上志向",
      domain: "影響力",
      scores: [
        { trigram_id: 3, score: 1.5 },
        { trigram_id: 2, score: 1 },
        { trigram_id: 1, score: 0.5 },
      ],
    },
    {
      strength_finder_talent: "自己確信",
      domain: "影響力",
      scores: [
        { trigram_id: 1, score: 2 },
        { trigram_id: 7, score: 1 },
      ],
    },
    {
      strength_finder_talent: "自我",
      domain: "影響力",
      scores: [
        { trigram_id: 3, score: 2 },
        { trigram_id: 1, score: 1 },
      ],
    },
    {
      strength_finder_talent: "社交性",
      domain: "影響力",
      scores: [
        { trigram_id: 3, score: 1.5 },
        { trigram_id: 2, score: 1.5 },
      ],
    },
    {
      strength_finder_talent: "適応性",
      domain: "人間関係構築力",
      scores: [
        { trigram_id: 6, score: 1.5 },
        { trigram_id: 5, score: 1.5 },
      ],
    },
    {
      strength_finder_talent: "運命思考",
      domain: "人間関係構築力",
      scores: [
        { trigram_id: 8, score: 1.5 },
        { trigram_id: 5, score: 1 },
        { trigram_id: 6, score: 0.5 },
      ],
    },
    {
      strength_finder_talent: "成長促進",
      domain: "人間関係構築力",
      scores: [
        { trigram_id: 8, score: 1.5 },
        { trigram_id: 3, score: 1 },
        { trigram_id: 2, score: 0.5 },
      ],
    },
    {
      strength_finder_talent: "調和性",
      domain: "人間関係構築力",
      scores: [
        { trigram_id: 8, score: 1.5 },
        { trigram_id: 2, score: 1.5 },
      ],
    },
    {
      strength_finder_talent: "包含",
      domain: "人間関係構築力",
      scores: [
        { trigram_id: 8, score: 2 },
        { trigram_id: 2, score: 1 },
      ],
    },
    {
      strength_finder_talent: "共感性",
      domain: "人間関係構築力",
      scores: [
        { trigram_id: 2, score: 1.5 },
        { trigram_id: 6, score: 1.5 },
      ],
    },
    {
      strength_finder_talent: "親密性",
      domain: "人間関係構築力",
      scores: [
        { trigram_id: 6, score: 1.5 },
        { trigram_id: 8, score: 1.5 },
      ],
    },
    {
      strength_finder_talent: "ポジティブ",
      domain: "人間関係構築力",
      scores: [
        { trigram_id: 3, score: 1.5 },
        { trigram_id: 2, score: 1.5 },
      ],
    },
    {
      strength_finder_talent: "個別化",
      domain: "人間関係構築力",
      scores: [
        { trigram_id: 3, score: 1 },
        { trigram_id: 6, score: 1 },
        { trigram_id: 2, score: 1 },
      ],
    },
    {
      strength_finder_talent: "分析思考",
      domain: "戦略的思考力",
      scores: [
        { trigram_id: 6, score: 1.5 },
        { trigram_id: 7, score: 1.5 },
      ],
    },
    {
      strength_finder_talent: "原点思考",
      domain: "戦略的思考力",
      scores: [
        { trigram_id: 8, score: 1.5 },
        { trigram_id: 7, score: 1.5 },
      ],
    },
    {
      strength_finder_talent: "未来志向",
      domain: "戦略的思考力",
      scores: [
        { trigram_id: 1, score: 1.5 },
        { trigram_id: 5, score: 1 },
        { trigram_id: 3, score: 0.5 },
      ],
    },
    {
      strength_finder_talent: "着想",
      domain: "戦略的思考力",
      scores: [
        { trigram_id: 5, score: 2 },
        { trigram_id: 3, score: 1 },
      ],
    },
    {
      strength_finder_talent: "収集心",
      domain: "戦略的思考力",
      scores: [
        { trigram_id: 8, score: 1.5 },
        { trigram_id: 7, score: 1.5 },
      ],
    },
    {
      strength_finder_talent: "内省",
      domain: "戦略的思考力",
      scores: [
        { trigram_id: 6, score: 2 },
        { trigram_id: 7, score: 1 },
      ],
    },
    {
      strength_finder_talent: "学習欲",
      domain: "戦略的思考力",
      scores: [
        { trigram_id: 6, score: 1.5 },
        { trigram_id: 7, score: 1.5 },
      ],
    },
    {
      strength_finder_talent: "戦略性",
      domain: "戦略的思考力",
      scores: [
        { trigram_id: 1, score: 1.5 },
        { trigram_id: 6, score: 1 },
        { trigram_id: 5, score: 0.5 },
      ],
    },
  ],

  // --- 人格os用性格分析マッピングデータ ---
  keyword_map: {
    乾為天: ["創造・革新", "リーダーシップ", "実行・達成", "父性・厳格"],
    坤為地: [
      "共感・受容",
      "育成・支援",
      "持続・安定",
      "調和・平和",
      "母性・慈愛",
    ],
    水雷屯: ["創造・革新", "挑戦・困難", "戦略・計画", "困難・停滞"],
    山水蒙: ["知性・学習", "育成・支援", "困難・停滞"],
    水天需: ["内省・静観", "持続・安定", "戦略・計画"],
    天水訟: ["葛藤・矛盾", "正義・改善", "困難・停滞"],
    地水師: [
      "リーダーシップ",
      "構造化・秩序",
      "奉仕・貢献",
      "権威・支配",
      "追従・服従",
    ],
    水地比: ["調和・平和", "社交性・人脈", "奉仕・貢献"],
    風天小畜: ["困難・停滞", "持続・安定", "受動・待機"],
    天澤履: ["挑戦・困難", "構造化・秩序", "慎重さ"],
    地天泰: ["調和・平和", "成長・発展", "共感・受容"],
    天地否: ["困難・停滞", "内省・静観"],
    天火同人: ["社交性・人脈", "リーダーシップ", "奉仕・貢献"],
    火天大有: ["実行・達成", "リーダーシップ", "成長・発展", "富・豊かさ"],
    地山謙: ["奉仕・貢献", "調和・平和", "内省・静観", "分配・贈与"],
    雷地豫: ["調和・平和", "表現・伝達", "成長・発展"],
    沢雷随: ["追従・服従", "調和・平和", "変動・転換"],
    山風蠱: ["困難・停滞", "正義・改善", "自己変容・脱皮"],
    地沢臨: ["リーダーシップ", "成長・発展", "育成・支援", "母性・慈愛"],
    風地観: ["内省・静観", "先見・大局観", "直感・感性"],
    火雷噬嗑: ["正義・改善", "困難・停滞", "権威・支配"],
    山火賁: ["美的感覚・洗練", "表現・伝達", "本質・真実"],
    山地剝: ["困難・停滞", "自己変容・脱皮", "本質・真実", "損失・浪費"],
    地雷復: ["始動・萌芽", "循環・継続", "内省・静観"],
    天雷无妄: ["本質・真実", "直感・感性", "受動・待機"],
    山天大畜: ["持続・安定", "育成・支援", "富・豊かさ"],
    山雷頤: ["育成・支援", "内省・静観", "持続・安定"],
    澤風大過: ["困難・停滞", "挑戦・困難", "変動・転換", "特殊・異端"],
    坎為水: ["困難・停滞", "内省・静観", "本質・真実", "分析・探求"],
    離為火: ["知性・学習", "表現・伝達", "美的感覚・洗練", "依存・付着"],
    沢山咸: ["共感・受容", "感情・情熱", "直感・感性", "始動・萌芽"],
    雷風恒: ["循環・継続", "持続・安定", "調和・平和"],
    天山遯: ["内省・静観", "戦略・計画", "困難・停滞"],
    雷天大壮: ["実行・達成", "権威・支配", "挑戦・困難", "富・豊かさ"],
    火地晋: ["成長・発展", "表現・伝達", "リーダーシップ", "奉仕・貢献"],
    地火明夷: ["困難・停滞", "内省・静観", "秘密・潜在"],
    風火家人: ["家族・家庭", "構造化・秩序", "父性・厳格", "母性・慈愛"],
    火沢睽: ["葛藤・矛盾", "困難・停滞"],
    水山蹇: ["困難・停滞", "内省・静観", "戦略・計画"],
    雷水解: ["困難・停滞", "実行・達成", "正義・改善"],
    山沢損: ["損失・浪費", "自己変容・脱皮", "奉仕・貢献", "分配・贈与"],
    風雷益: [
      "成長・発展",
      "奉仕・貢献",
      "知性・学習",
      "富・豊かさ",
      "分配・贈与",
    ],
    沢天夬: ["リーダーシップ", "実行・達成", "変動・転換", "権威・支配"],
    天風姤: ["変動・転換", "直感・感性", "秘密・潜在", "葛藤・矛盾"],
    沢地萃: ["社交性・人脈", "リーダーシップ", "奉仕・貢献", "追従・服従"],
    地風升: ["成長・発展", "持続・安定", "育成・支援"],
    沢水困: ["困難・停滞", "内省・静観", "本質・真実"],
    水風井: ["奉仕・貢献", "持続・安定", "本質・真実", "循環・継続"],
    沢火革: ["変動・転換", "創造・革新", "リーダーシップ"],
    火風鼎: ["構造化・秩序", "育成・支援", "奉仕・貢献"],
    震為雷: ["変動・転換", "挑戦・困難", "実行・達成"],
    艮為山: ["内省・静観", "困難・停滞", "持続・安定", "受動・待機"],
    風山漸: ["成長・発展", "持続・安定", "構造化・秩序", "家族・家庭"],
    雷沢帰妹: ["困難・停滞", "構造化・秩序", "感情・情熱", "家族・家庭"],
    雷火豊: ["完成・集大成", "リーダーシップ", "成長・発展"],
    火山旅: [
      "内省・静観",
      "困難・停滞",
      "葛藤・矛盾",
      "放浪・自由",
      "特殊・異端",
    ],
    巽為風: ["内省・静観", "表現・伝達", "追従・服従"],
    兌為沢: ["調和・平和", "表現・伝達", "社交性・人脈"],
    風水渙: ["リーダーシップ", "表現・伝達", "困難・停滞"],
    水沢節: ["構造化・秩序", "内省・静観", "持続・安定"],
    風沢中孚: ["本質・真実", "共感・受容", "正義・改善"],
    雷山小過: ["内省・静観", "構造化・秩序", "損失・浪費", "正義・改善"],
    水火既済: ["完成・集大成", "構造化・秩序", "困難・停滞"],
    火水未済: ["始動・萌芽", "変動・転換", "挑戦・困難"],
    INTP: [
      "分析・探求",
      "内省・静観",
      "創造・革新",
      "特殊・異端",
      "困難・停滞",
    ],
    ENTJ: ["リーダーシップ", "実行・達成", "戦略・計画", "権威・支配"],
    INFP: [
      "内省・静観",
      "共感・受容",
      "感情・情熱",
      "正義・改善",
      "自己変容・脱皮",
    ],
    ESTP: ["実行・達成", "挑戦・困難", "戦略・計画", "変動・転換"],
    ISTJ: ["実行・達成", "持続・安定", "正義・改善", "構造化・秩序"],
    ENFP: ["創造・革新", "感情・情熱", "表現・伝達", "リーダーシップ"],
    ISTP: ["実行・達成", "分析・探求", "挑戦・困難", "放浪・自由"],
    ESFJ: [
      "育成・支援",
      "奉仕・貢献",
      "社交性・人脈",
      "調和・平和",
      "家族・家庭",
    ],
    ISFJ: [
      "育成・支援",
      "奉仕・貢献",
      "持続・安定",
      "共感・受容",
      "家族・家庭",
    ],
    ESTJ: [
      "リーダーシップ",
      "実行・達成",
      "構造化・秩序",
      "正義・改善",
      "権威・支配",
    ],
    ISFP: ["美的感覚・洗練", "創造・革新", "感情・情熱", "挑戦・困難"],
    ENTP: ["知性・学習", "挑戦・困難", "創造・革新", "葛藤・矛盾"],
    INFJ: [
      "先見・大局観",
      "奉仕・貢献",
      "正義・改善",
      "本質・真実",
      "直感・感性",
    ],
    ENFJ: ["リーダーシップ", "育成・支援", "社交性・人脈", "奉仕・貢献"],
    ESFP: [
      "表現・伝達",
      "社交性・人脈",
      "挑戦・困難",
      "美的感覚・洗練",
      "依存・付着",
    ],
    INTJ: [
      "戦略・計画",
      "分析・探求",
      "先見・大局観",
      "構造化・秩序",
      "秘密・潜在",
    ],
  },
  // --- 人格os用性格分析マッピングデータ ---
  line_keyword_map: {
    "乾為天 初九": ["内省・静観", "困難・停滞", "秘密・潜在", "受動・待機"],
    "乾為天 九二": ["成長・発展", "育成・支援", "奉仕・貢献", "始動・萌芽"],
    "乾為天 九三": ["実行・達成", "挑戦・困難", "内省・静観", "持続・安定"],
    "乾為天 九四": ["変動・転換", "挑戦・困難", "戦略・計画"],
    "乾為天 九五": [
      "リーダーシップ",
      "実行・達成",
      "完成・集大成",
      "富・豊かさ",
    ],
    "乾為天 上九": ["損失・浪費", "困難・停滞", "葛藤・矛盾"],
    "坤為地 初六": ["始動・萌芽", "困難・停滞", "先見・大局観"],
    "坤為地 六二": ["本質・真実", "持続・安定", "成長・発展", "母性・慈愛"],
    "坤為地 六三": ["秘密・潜在", "内省・静観", "持続・安定"],
    "坤為地 六四": ["秘密・潜在", "受動・待機", "慎重さ"],
    "坤為地 六五": ["母性・慈愛", "奉仕・貢献", "富・豊かさ", "調和・平和"],
    "坤為地 上六": ["葛藤・矛盾", "挑戦・困難", "損失・浪費"],
    "水雷屯 初九": ["困難・停滞", "戦略・計画", "持続・安定"],
    "水雷屯 六二": ["困難・停滞", "葛藤・矛盾", "変動・転換"],
    "水雷屯 六三": ["挑戦・困難", "損失・浪費", "戦略・計画"],
    "水雷屯 六四": ["奉仕・貢献", "交渉・取引", "葛藤・矛盾"],
    "水雷屯 九五": ["富・豊かさ", "分配・贈与", "困難・停滞"],
    "水雷屯 上六": ["困難・停滞", "損失・浪費", "感情・情熱"],
    "山水蒙 初六": ["知性・学習", "構造化・秩序", "始動・萌芽"],
    "山水蒙 九二": ["育成・支援", "母性・慈愛", "共感・受容"],
    "山水蒙 六三": ["葛藤・矛盾", "損失・浪費", "自己変容・脱皮"],
    "山水蒙 六四": ["困難・停滞", "知性・学習", "孤立"],
    "山水蒙 六五": ["追従・服従", "知性・学習", "本質・真実"],
    "山水蒙 上九": ["権威・支配", "正義・改善", "父性・厳格"],
    "水天需 初九": ["受動・待機", "持続・安定", "内省・静観"],
    "水天需 九二": ["受動・待機", "葛藤・矛盾", "内省・静観"],
    "水天需 九三": ["受動・待機", "困難・停滞", "挑戦・困難"],
    "水天需 六四": ["困難・停滞", "自己変容・脱皮", "挑戦・困難"],
    "水天需 九五": ["富・豊かさ", "調和・平和", "完成・集大成"],
    "水天需 上六": ["困難・停滞", "変動・転換", "受動・待機"],
    "天水訟 初六": ["葛藤・矛盾", "内省・静観", "戦略・計画"],
    "天水訟 九二": ["困難・停滞", "損失・浪費", "受動・待機"],
    "天水訟 六三": ["持続・安定", "受動・待機", "富・豊かさ"],
    "天水訟 九四": ["自己変容・脱皮", "戦略・計画", "持続・安定"],
    "天水訟 九五": ["正義・改善", "リーダーシップ", "権威・支配"],
    "天水訟 上九": ["権威・支配", "損失・浪費", "変動・転換"],
    "地水師 初六": ["構造化・秩序", "始動・萌芽", "実行・達成"],
    "地水師 九二": ["リーダーシップ", "権威・支配", "調和・平和"],
    "地水師 六三": ["損失・浪費", "困難・停滞", "リーダーシップ"],
    "地水師 六四": ["戦略・計画", "受動・待機", "内省・静観"],
    "地水師 六五": ["正義・改善", "権威・支配", "実行・達成"],
    "地水師 上六": ["完成・集大成", "分配・贈与", "構造化・秩序"],
    "水地比 初六": ["本質・真実", "始動・萌芽", "共感・受容"],
    "水地比 六二": ["内省・静観", "本質・真実", "追従・服従"],
    "水地比 六三": ["葛藤・矛盾", "損失・浪費", "社交性・人脈"],
    "水地比 六四": ["社交性・人脈", "追従・服従", "奉仕・貢献"],
    "水地比 九五": ["リーダーシップ", "分配・贈与", "表現・伝達"],
    "水地比 上六": ["困難・停滞", "始動・萌芽", "葛藤・矛盾"],
    "風天小畜 初九": ["自己変容・脱皮", "正義・改善", "内省・静観"],
    "風天小畜 九二": ["追従・服従", "困難・停滞", "調和・平和"],
    "風天小畜 九三": ["葛藤・矛盾", "困難・停滞", "家族・家庭"],
    "風天小畜 六四": ["本質・真実", "困難・停滞", "自己変容・脱皮"],
    "風天小畜 九五": ["富・豊かさ", "調和・平和", "奉仕・貢献"],
    "風天小畜 上九": ["完成・集大成", "持続・安定", "富・豊かさ"],
    "天澤履 初九": ["本質・真実", "実行・達成", "始動・萌芽"],
    "天澤履 九二": ["内省・静観", "持続・安定", "調和・平和"],
    "天澤履 六三": ["困難・停滞", "挑戦・困難", "権威・支配"],
    "天澤履 九四": ["挑戦・困難", "戦略・計画", "権威・支配"],
    "天澤履 九五": ["リーダーシップ", "実行・達成", "正義・改善"],
    "天澤履 上九": ["完成・集大成", "内省・静観", "先見・大局観"],
    "地天泰 初九": ["始動・萌芽", "成長・発展", "社交性・人脈"],
    "地天泰 九二": ["共感・受容", "母性・慈愛", "リーダーシップ"],
    "地天泰 九三": ["変動・転換", "持続・安定", "挑戦・困難"],
    "地天泰 六四": ["追従・服従", "社交性・人脈", "奉仕・貢献"],
    "地天泰 六五": ["富・豊かさ", "調和・平和", "完成・集大成"],
    "地天泰 上六": ["損失・浪費", "困難・停滞", "変動・転換"],
    "天地否 初六": ["困難・停滞", "追従・服従", "社交性・人脈"],
    "天地否 六二": ["困難・停滞", "奉仕・貢献", "受動・待機"],
    "天地否 六三": ["困難・停滞", "秘密・潜在", "内省・静観"],
    "天地否 九四": ["実行・達成", "リーダーシップ", "始動・萌芽"],
    "天地否 九五": ["変動・転換", "戦略・計画", "リーダーシップ"],
    "天地否 上九": ["完成・集大成", "変動・転換", "創造・革新"],
    "天火同人 初九": ["始動・萌芽", "社交性・人脈", "調和・平和"],
    "天火同人 六二": ["特殊・異端", "葛藤・矛盾", "損失・浪費"],
    "天火同人 九三": ["秘密・潜在", "戦略・計画", "葛藤・矛盾"],
    "天火同人 九四": ["挑戦・困難", "自己変容・脱皮", "葛藤・矛盾"],
    "天火同人 九五": ["葛藤・矛盾", "完成・集大成", "リーダーシップ"],
    "天火同人 上九": ["完成・集大成", "調和・平和", "内省・静観"],
    "火天大有 初九": ["内省・静観", "困難・停滞", "自己変容・脱皮"],
    "火天大有 九二": ["富・豊かさ", "実行・達成", "戦略・計画"],
    "火天大有 九三": ["奉仕・貢献", "権威・支配", "分配・贈与"],
    "火天大有 九四": ["内省・静観", "本質・真実", "自己変容・脱皮"],
    "火天大有 六五": ["共感・受容", "調和・平和", "本質・真実"],
    "火天大有 上九": ["富・豊かさ", "完成・集大成", "直感・感性"],
    "地山謙 初六": ["内省・静観", "本質・真実", "始動・萌芽"],
    "地山謙 六二": ["表現・伝達", "本質・真実", "調和・平和"],
    "地山謙 九三": ["実行・達成", "奉仕・貢献", "持続・安定"],
    "地山謙 六四": ["分配・贈与", "実行・達成", "表現・伝達"],
    "地山謙 六五": ["分配・贈与", "奉仕・貢献", "調和・平和"],
    "地山謙 上六": ["リーダーシップ", "正義・改善", "権威・支配"],
    "雷地豫 初六": ["損失・浪費", "感情・情熱", "表現・伝達"],
    "雷地豫 六二": ["持続・安定", "内省・静観", "本質・真実"],
    "雷地豫 六三": ["受動・待機", "損失・浪費", "追従・服従"],
    "雷地豫 九四": ["リーダーシップ", "社交性・人脈", "創造・革新"],
    "雷地豫 六五": ["困難・停滞", "持続・安定", "内省・静観"],
    "雷地豫 上六": ["自己変容・脱皮", "変動・転換", "損失・浪費"],
    "沢雷随 初九": ["変動・転換", "リーダーシップ", "正義・改善"],
    "沢雷随 六二": ["損失・浪費", "追従・服従", "特殊・異端"],
    "沢雷随 六三": ["自己変容・脱皮", "追従・服従", "本質・真実"],
    "沢雷随 九四": ["権威・支配", "富・豊かさ", "損失・浪費"],
    "沢雷随 九五": ["本質・真実", "リーダーシップ", "調和・平和"],
    "沢雷随 上六": ["完成・集大成", "追従・服従", "秘密・潜在"],
    "山風蠱 初六": ["父性・厳格", "正義・改善", "始動・萌芽"],
    "山風蠱 九二": ["母性・慈愛", "正義・改善", "内省・静観"],
    "山風蠱 九三": ["父性・厳格", "正義・改善", "実行・達成"],
    "山風蠱 六四": ["父性・厳格", "困難・停滞", "損失・浪費"],
    "山風蠱 六五": ["父性・厳格", "正義・改善", "リーダーシップ"],
    "山風蠱 上九": ["特殊・異端", "奉仕・貢献", "完成・集大成"],
    "地沢臨 初九": ["リーダーシップ", "共感・受容", "始動・萌芽"],
    "地沢臨 九二": ["リーダーシップ", "共感・受容", "実行・達成"],
    "地沢臨 六三": ["損失・浪費", "感情・情熱", "リーダーシップ"],
    "地沢臨 六四": ["追従・服従", "奉仕・貢献", "実行・達成"],
    "地沢臨 六五": ["知性・学習", "リーダーシップ", "権威・支配"],
    "地沢臨 上六": ["母性・慈愛", "奉仕・貢献", "完成・集大成"],
    "風地観 初六": ["内省・静観", "知性・学習", "未熟"],
    "風地観 六二": ["内省・静観", "秘密・潜在", "特殊・異端"],
    "風地観 六三": ["自己変容・脱皮", "内省・静観", "戦略・計画"],
    "風地観 六四": ["社交性・人脈", "奉仕・貢献", "権威・支配"],
    "風地観 九五": ["リーダーシップ", "内省・静観", "自己変容・脱皮"],
    "風地観 上九": ["内省・静観", "先見・大局観", "完成・集大成"],
    "火雷噬嗑 初九": ["正義・改善", "始動・萌芽", "困難・停滞"],
    "火雷噬嗑 六二": ["正義・改善", "実行・達成", "困難・停滞"],
    "火雷噬嗑 六三": ["葛藤・矛盾", "困難・停滞", "挑戦・困難"],
    "火雷噬嗑 九四": ["挑戦・困難", "実行・達成", "富・豊かさ"],
    "火雷噬嗑 六五": ["正義・改善", "戦略・計画", "富・豊かさ"],
    "火雷噬嗑 上九": ["損失・浪費", "困難・停滞", "完成・集大成"],
    "山火賁 初九": ["美的感覚・洗練", "本質・真実", "始動・萌芽"],
    "山火賁 六二": ["美的感覚・洗練", "追従・服従", "依存・付着"],
    "山火賁 九三": ["美的感覚・洗練", "富・豊かさ", "持続・安定"],
    "山火賁 六四": ["本質・真実", "自己変容・脱皮", "特殊・異端"],
    "山火賁 六五": ["美的感覚・洗練", "富・豊かさ", "奉仕・貢献"],
    "山火賁 上九": ["本質・真実", "完成・集大成", "美的感覚・洗練"],
    "山地剝 初六": ["損失・浪費", "困難・停滞", "始動・萌芽"],
    "山地剝 六二": ["損失・浪費", "困難・停滞", "変動・転換"],
    "山地剝 六三": ["自己変容・脱皮", "特殊・異端", "追従・服従"],
    "山地剝 六四": ["損失・浪費", "困難・停滞", "危機"],
    "山地剝 六五": ["構造化・秩序", "追従・服従", "母性・慈愛"],
    "山地剝 上九": ["富・豊かさ", "創造・革新", "秘密・潜在"],
    "地雷復 初九": ["自己変容・脱皮", "始動・萌芽", "正義・改善"],
    "地雷復 六二": ["自己変容・脱皮", "追従・服従", "調和・平和"],
    "地雷復 六三": ["変動・転換", "葛藤・矛盾", "挑戦・困難"],
    "地雷復 六四": ["特殊・異端", "自己変容・脱皮", "本質・真実"],
    "地雷復 六五": ["自己変容・脱皮", "内省・静観", "本質・真実"],
    "地雷復 上六": ["損失・浪費", "困難・停滞", "葛藤・矛盾"],
    "天雷无妄 初九": ["本質・真実", "始動・萌芽", "実行・達成"],
    "天雷无妄 六二": ["受動・待機", "本質・真実", "富・豊かさ"],
    "天雷无妄 六三": ["損失・浪費", "困難・停滞", "変動・転換"],
    "天雷无妄 九四": ["本質・真実", "持続・安定", "実行・達成"],
    "天雷无妄 九五": ["困難・停滞", "自己変容・脱皮", "本質・真実"],
    "天雷无妄 上九": ["困難・停滞", "損失・浪費", "実行・達成"],
    "山天大畜 初九": ["困難・停滞", "挑戦・困難", "受動・待機"],
    "山天大畜 九二": ["困難・停滞", "葛藤・矛盾", "受動・待機"],
    "山天大畜 九三": ["実行・達成", "挑戦・困難", "戦略・計画"],
    "山天大畜 六四": ["始動・萌芽", "構造化・秩序", "父性・厳格"],
    "山天大畜 六五": ["権威・支配", "正義・改善", "富・豊かさ"],
    "山天大畜 上九": ["完成・集大成", "実行・達成", "リーダーシップ"],
    "山雷頤 初九": ["損失・浪費", "特殊・異端", "葛藤・矛盾"],
    "山雷頤 六二": ["損失・浪費", "追従・服従", "困難・停滞"],
    "山雷頤 六三": ["損失・浪費", "実行・達成", "自己変容・脱皮"],
    "山雷頤 六四": ["富・豊かさ", "権威・支配", "挑戦・困難"],
    "山雷頤 六五": ["リーダーシップ", "奉仕・貢献", "受動・待機"],
    "山雷頤 上九": ["リーダーシップ", "富・豊かさ", "完成・集大成"],
    "澤風大過 初六": ["慎重さ", "構造化・秩序", "始動・萌芽"],
    "澤風大過 九二": ["創造・革新", "成長・発展", "家族・家庭"],
    "澤風大過 九三": ["困難・停滞", "損失・浪費", "権威・支配"],
    "澤風大過 九四": ["リーダーシップ", "構造化・秩序", "富・豊かさ"],
    "澤風大過 九五": ["創造・革新", "美的感覚・洗練", "家族・家庭"],
    "澤風大過 上六": ["損失・浪費", "困難・停滞", "挑戦・困難"],
    "坎為水 初六": ["困難・停滞", "始動・萌芽", "内省・静観"],
    "坎為水 九二": ["挑戦・困難", "知性・学習", "自己変容・脱皮"],
    "坎為水 六三": ["困難・停滞", "受動・待機", "葛藤・矛盾"],
    "坎為水 六四": ["本質・真実", "交渉・取引", "調和・平和"],
    "坎為水 九五": ["成長・発展", "実行・達成", "自己変容・脱皮"],
    "坎為水 上六": ["困難・停滞", "損失・浪費", "完成・集大成"],
    "離為火 初九": ["始動・萌芽", "内省・静観", "構造化・秩序"],
    "離為火 六二": ["中庸", "調和・平和", "美的感覚・洗練"],
    "離為火 九三": ["変動・転換", "感情・情熱", "表現・伝達"],
    "離為火 九四": ["変動・転換", "創造・革新", "損失・浪費"],
    "離為火 六五": ["自己変容・脱皮", "リーダーシップ", "感情・情熱"],
    "離為火 上九": ["権威・支配", "正義・改善", "実行・達成"],
    "沢山咸 初六": ["始動・萌芽", "感情・情熱", "未熟"],
    "沢山咸 六二": ["受動・待機", "内省・静観", "困難・停滞"],
    "沢山咸 九三": ["追従・服従", "実行・達成", "損失・浪費"],
    "沢山咸 九四": ["本質・真実", "リーダーシップ", "感情・情熱"],
    "沢山咸 九五": ["内省・静観", "リーダーシップ", "自己変容・脱皮"],
    "沢山咸 上六": ["表現・伝達", "社交性・人脈", "損失・浪費"],
    "雷風恒 初六": ["始動・萌芽", "挑戦・困難", "損失・浪費"],
    "雷風恒 九二": ["自己変容・脱皮", "持続・安定", "内省・静観"],
    "雷風恒 九三": ["葛藤・矛盾", "損失・浪費", "変動・転換"],
    "雷風恒 九四": ["戦略・計画", "損失・浪費", "自己変容・脱皮"],
    "雷風恒 六五": ["持続・安定", "本質・真実", "追従・服従"],
    "雷風恒 上六": ["変動・転換", "実行・達成", "困難・停滞"],
    "天山遯 初六": ["困難・停滞", "損失・浪費", "変動・転換"],
    "天山遯 六二": ["持続・安定", "追従・服従", "秘密・潜在"],
    "天山遯 九三": ["葛藤・矛盾", "困難・停滞", "家族・家庭"],
    "天山遯 九四": ["自己変容・脱皮", "実行・達成", "リーダーシップ"],
    "天山遯 九五": ["美的感覚・洗練", "調和・平和", "内省・静観"],
    "天山遯 上九": ["完成・集大成", "放浪・自由", "特殊・異端"],
    "雷天大壮 初九": ["始動・萌芽", "挑戦・困難", "損失・浪費"],
    "雷天大壮 九二": ["持続・安定", "正義・改善", "内省・静観"],
    "雷天大壮 九三": ["権威・支配", "損失・浪費", "葛藤・矛盾"],
    "雷天大壮 九四": ["実行・達成", "自己変容・脱皮", "成長・発展"],
    "雷天大壮 六五": ["損失・浪費", "困難・停滞", "受動・待機"],
    "雷天大壮 上六": ["困難・停滞", "葛藤・矛盾", "完成・集大成"],
    "火地晋 初六": ["困難・停滞", "始動・萌芽", "内省・静観"],
    "火地晋 六二": ["困難・停滞", "葛藤・矛盾", "母性・慈愛"],
    "火地晋 六三": ["共感・受容", "調和・平和", "追従・服従"],
    "火地晋 九四": ["困難・停滞", "秘密・潜在", "損失・浪費"],
    "火地晋 六五": ["リーダーシップ", "富・豊かさ", "奉仕・貢献"],
    "火地晋 上九": ["権威・支配", "正義・改善", "実行・達成"],
    "地火明夷 初九": ["困難・停滞", "戦略・計画", "父性・厳格"],
    "地火明夷 六二": ["困難・停滞", "受動・待機", "戦略・計画"],
    "地火明夷 九三": ["実行・達成", "リーダーシップ", "正義・改善"],
    "地火明夷 六四": ["秘密・潜在", "内省・静観", "自己変容・脱皮"],
    "地火明夷 六五": ["秘密・潜在", "特殊・異端", "持続・安定"],
    "地火明夷 上六": ["損失・浪費", "完成・集大成", "困難・停滞"],
    "風火家人 初九": ["家族・家庭", "構造化・秩序", "始動・萌芽"],
    "風火家人 六二": ["家族・家庭", "母性・慈愛", "奉仕・貢献"],
    "風火家人 九三": ["父性・厳格", "葛藤・矛盾", "感情・情熱"],
    "風火家人 六四": ["家族・家庭", "富・豊かさ", "母性・慈愛"],
    "風火家人 九五": ["リーダーシップ", "父性・厳格", "家族・家庭"],
    "風火家人 上九": ["権威・支配", "父性・厳格", "完成・集大成"],
    "火沢睽 初九": ["自己変容・脱皮", "内省・静観", "調和・平和"],
    "火沢睽 九二": ["交渉・取引", "調和・平和", "秘密・潜在"],
    "火沢睽 六三": ["困難・停滞", "損失・浪費", "葛藤・矛盾"],
    "火沢睽 九四": ["孤立", "特殊・異端", "調和・平和"],
    "火沢睽 六五": ["自己変容・脱皮", "調和・平和", "奉仕・貢献"],
    "火沢睽 上九": ["孤立", "特殊・異端", "葛藤・矛盾"],
    "水山蹇 初六": ["困難・停滞", "内省・静観", "成長・発展"],
    "水山蹇 六二": ["困難・停滞", "追従・服従", "奉仕・貢献"],
    "水山蹇 九三": ["困難・停滞", "家族・家庭", "調和・平和"],
    "水山蹇 六四": ["困難・停滞", "社交性・人脈", "奉仕・貢献"],
    "水山蹇 九五": ["困難・停滞", "リーダーシップ", "奉仕・貢献"],
    "水山蹇 上六": ["困難・停滞", "完成・集大成", "リーダーシップ"],
    "雷水解 初六": ["始動・萌芽", "自己変容・脱皮", "調和・平和"],
    "雷水解 九二": ["正義・改善", "実行・達成", "富・豊かさ"],
    "雷水解 六三": ["損失・浪費", "困難・停滞", "葛藤・矛盾"],
    "雷水解 九四": ["自己変容・脱皮", "社交性・人脈", "信頼"],
    "雷水解 六五": ["リーダーシップ", "自己変容・脱皮", "信頼"],
    "雷水解 上六": ["権威・支配", "実行・達成", "完成・集大成"],
    "山沢損 初九": ["奉仕・貢献", "実行・達成", "自己変容・脱皮"],
    "山沢損 九二": ["奉仕・貢献", "持続・安定", "正義・改善"],
    "山沢損 六三": ["葛藤・矛盾", "社交性・人脈", "自己変容・脱皮"],
    "山沢損 六四": ["自己変容・脱皮", "成長・発展", "調和・平和"],
    "山沢損 六五": ["富・豊かさ", "直感・感性", "受動・待機"],
    "山沢損 上九": ["富・豊かさ", "リーダーシップ", "奉仕・貢献"],
    "風雷益 初九": ["始動・萌芽", "実行・達成", "成長・発展"],
    "風雷益 六二": ["富・豊かさ", "直感・感性", "受動・待機"],
    "風雷益 六三": ["困難・停滞", "奉仕・貢献", "自己変容・脱皮"],
    "風雷益 六四": ["リーダーシップ", "奉仕・貢献", "交渉・取引"],
    "風雷益 九五": ["リーダーシップ", "母性・慈愛", "分配・贈与"],
    "風雷益 上九": ["損失・浪費", "権威・支配", "葛藤・矛盾"],
    "沢天夬 初九": ["始動・萌芽", "挑戦・困難", "損失・浪費"],
    "沢天夬 九二": ["内省・静観", "戦略・計画", "困難・停滞"],
    "沢天夬 九三": ["実行・達成", "孤立", "葛藤・矛盾"],
    "沢天夬 九四": ["困難・停滞", "葛藤・矛盾", "自己変容・脱皮"],
    "沢天夬 九五": ["リーダーシップ", "実行・達成", "自己変容・脱皮"],
    "沢天夬 上六": ["完成・集大成", "損失・浪費", "困難・停滞"],
    "天風姤 初六": ["受動・待機", "困難・停滞", "構造化・秩序"],
    "天風姤 九二": ["秘密・潜在", "富・豊かさ", "分配・贈与"],
    "天風姤 九三": ["困難・停滞", "葛藤・矛盾", "挑戦・困難"],
    "天風姤 九四": ["損失・浪費", "孤立", "葛藤・矛盾"],
    "天風姤 九五": ["秘密・潜在", "美的感覚・洗練", "リーダーシップ"],
    "天風姤 上九": ["孤立", "特殊・異端", "完成・集大成"],
    "沢地萃 初六": ["始動・萌芽", "葛藤・矛盾", "社交性・人脈"],
    "沢地萃 六二": ["追従・服従", "直感・感性", "奉仕・貢献"],
    "沢地萃 六三": ["葛藤・矛盾", "孤立", "社交性・人脈"],
    "沢地萃 九四": ["リーダーシップ", "権威・支配", "実行・達成"],
    "沢地萃 九五": ["リーダーシップ", "本質・真実", "奉仕・貢献"],
    "沢地萃 上六": ["損失・浪費", "感情・情熱", "奉仕・貢献"],
    "地風升 初六": ["始動・萌芽", "成長・発展", "追従・服従"],
    "地風升 九二": ["本質・真実", "奉仕・貢献", "成長・発展"],
    "地風升 九三": ["実行・達成", "成長・発展", "富・豊かさ"],
    "地風升 六四": ["リーダーシップ", "奉仕・貢献", "循環・継続"],
    "地風升 六五": ["持続・安定", "成長・発展", "リーダーシップ"],
    "地風升 上六": ["困難・停滞", "内省・静観", "損失・浪費"],
    "沢水困 初六": ["困難・停滞", "内省・静観", "秘密・潜在"],
    "沢水困 九二": ["困難・停滞", "富・豊かさ", "奉仕・貢献"],
    "沢水困 六三": ["困難・停滞", "葛藤・矛盾", "損失・浪費"],
    "沢水困 九四": ["困難・停滞", "追従・服従", "戦略・計画"],
    "沢水困 九五": ["困難・停滞", "権威・支配", "自己変容・脱皮"],
    "沢水困 上六": ["困難・停滞", "自己変容・脱皮", "変動・転換"],
    "水風井 初六": ["損失・浪費", "困難・停滞", "本質・真実"],
    "水風井 九二": ["損失・浪費", "秘密・潜在", "特殊・異端"],
    "水風井 九三": ["秘密・潜在", "損失・浪費", "美的感覚・洗練"],
    "水風井 六四": ["自己変容・脱皮", "構造化・秩序", "奉仕・貢献"],
    "水風井 九五": ["本質・真実", "富・豊かさ", "リーダーシップ"],
    "水風井 上六": ["完成・集大成", "富・豊かさ", "分配・贈与"],
    "沢火革 初九": ["持続・安定", "構造化・秩序", "受動・待機"],
    "沢火革 六二": ["変動・転換", "実行・達成", "正義・改善"],
    "沢火革 九三": ["交渉・取引", "戦略・計画", "困難・停滞"],
    "沢火革 九四": ["リーダーシップ", "自己変容・脱皮", "信頼"],
    "沢火革 九五": ["リーダーシップ", "創造・革新", "美的感覚・洗練"],
    "沢火革 上六": ["自己変容・脱皮", "美的感覚・洗練", "調和・平和"],
    "火風鼎 初九": ["自己変容・脱皮", "正義・改善", "始動・萌芽"],
    "火風鼎 九二": ["富・豊かさ", "本質・真実", "内省・静観"],
    "火風鼎 九三": ["困難・停滞", "変動・転換", "損失・浪費"],
    "火風鼎 九四": ["損失・浪費", "困難・停滞", "権威・支配"],
    "火風鼎 六五": ["富・豊かさ", "本質・真実", "リーダーシップ"],
    "火風鼎 上九": ["完成・集大成", "富・豊かさ", "権威・支配"],
    "震為雷 初九": ["始動・萌芽", "変動・転換", "内省・静観"],
    "震為雷 六二": ["困難・停滞", "損失・浪費", "戦略・計画"],
    "震為雷 六三": ["変動・転換", "自己変容・脱皮", "実行・達成"],
    "震為雷 九四": ["困難・停滞", "損失・浪費", "葛藤・矛盾"],
    "震為雷 六五": ["困難・停滞", "実行・達成", "挑戦・困難"],
    "震為雷 上六": ["困難・停滞", "内省・静観", "葛藤・矛盾"],
    "艮為山 初六": ["始動・萌芽", "内省・静観", "本質・真実"],
    "艮為山 六二": ["困難・停滞", "追従・服従", "葛藤・矛盾"],
    "艮為山 九三": ["困難・停滞", "権威・支配", "危機"],
    "艮為山 六四": ["内省・静観", "自己変容・脱皮", "調和・平和"],
    "艮為山 六五": ["表現・伝達", "構造化・秩序", "内省・静観"],
    "艮為山 上九": ["完成・集大成", "富・豊かさ", "持続・安定"],
    "風山漸 初六": ["始動・萌芽", "内省・静観", "困難・停滞"],
    "風山漸 六二": ["成長・発展", "調和・平和", "富・豊かさ"],
    "風山漸 九三": ["挑戦・困難", "損失・浪費", "家族・家庭"],
    "風山漸 六四": ["自己変容・脱皮", "戦略・計画", "適応性"],
    "風山漸 九五": ["完成・集大成", "リーダーシップ", "母性・慈愛"],
    "風山漸 上九": ["完成・集大成", "美的感覚・洗練", "奉仕・貢献"],
    "雷沢帰妹 初九": ["追従・服従", "困難・停滞", "家族・家庭"],
    "雷沢帰妹 九二": ["特殊・異端", "秘密・潜在", "持続・安定"],
    "雷沢帰妹 六三": ["自己変容・脱皮", "受動・待機", "追従・服従"],
    "雷沢帰妹 九四": ["戦略・計画", "受動・待機", "持続・安定"],
    "雷沢帰妹 六五": ["富・豊かさ", "美的感覚・洗練", "本質・真実"],
    "雷沢帰妹 上六": ["損失・浪費", "困難・停滞", "奉仕・貢献"],
    "雷火豊 初九": ["始動・萌芽", "調和・平和", "成長・発展"],
    "雷火豊 六二": ["秘密・潜在", "葛藤・矛盾", "内省・静観"],
    "雷火豊 九三": ["損失・浪費", "困難・停滞", "実行・達成"],
    "雷火豊 九四": ["秘密・潜在", "リーダーシップ", "調和・平和"],
    "雷火豊 六五": ["リーダーシップ", "美的感覚・洗練", "富・豊かさ"],
    "雷火豊 上六": ["孤立", "損失・浪費", "完成・集大成"],
    "火山旅 初六": ["困難・停滞", "損失・浪費", "始動・萌芽"],
    "火山旅 六二": ["調和・平和", "富・豊かさ", "追従・服従"],
    "火山旅 九三": ["損失・浪費", "葛藤・矛盾", "挑戦・困難"],
    "火山旅 九四": ["戦略・計画", "内省・静観", "富・豊かさ"],
    "火山旅 六五": ["奉仕・貢献", "リーダーシップ", "美的感覚・洗練"],
    "火山旅 上九": ["損失・浪費", "完成・集大成", "困難・停滞"],
    "巽為風 初六": ["葛藤・矛盾", "戦略・計画", "内省・静観"],
    "巽為風 九二": ["秘密・潜在", "追従・服従", "分析・探求"],
    "巽為風 九三": ["葛藤・矛盾", "損失・浪費", "内省・静観"],
    "巽為風 六四": ["実行・達成", "富・豊かさ", "戦略・計画"],
    "巽為風 九五": ["リーダーシップ", "自己変容・脱皮", "完成・集大成"],
    "巽為風 上九": ["損失・浪費", "困難・停滞", "秘密・潜在"],
    "兌為沢 初九": ["調和・平和", "始動・萌芽", "共感・受容"],
    "兌為沢 九二": ["本質・真実", "信頼", "調和・平和"],
    "兌為沢 六三": ["損失・浪費", "追従・服従", "社交性・人脈"],
    "兌為沢 九四": ["交渉・取引", "葛藤・矛盾", "自己変容・脱皮"],
    "兌為沢 九五": ["困難・停滞", "信頼", "リーダーシップ"],
    "兌為沢 上六": ["リーダーシップ", "表現・伝達", "変動・転換"],
    "風水渙 初六": ["始動・萌芽", "育成・支援", "実行・達成"],
    "風水渙 九二": ["自己変容・脱皮", "挑戦・困難", "内省・静観"],
    "風水渙 六三": ["自己変容・脱皮", "奉仕・貢献", "本質・真実"],
    "風水渙 六四": ["リーダーシップ", "創造・革新", "奉仕・貢献"],
    "風水渙 九五": ["リーダーシップ", "権威・支配", "分配・贈与"],
    "風水渙 上六": ["困難・停滞", "自己変容・脱皮", "完成・集大成"],
    "水沢節 初六": ["受動・待機", "内省・静観", "始動・萌芽"],
    "水沢節 九二": ["受動・待機", "困難・停滞", "損失・浪費"],
    "水沢節 六三": ["損失・浪費", "感情・情熱", "葛藤・矛盾"],
    "水沢節 六四": ["受動・待機", "調和・平和", "持続・安定"],
    "水沢節 九五": ["リーダーシップ", "美的感覚・洗練", "富・豊かさ"],
    "水沢節 上六": ["困難・停滞", "父性・厳格", "損失・浪費"],
    "風沢中孚 初九": ["内省・静観", "戦略・計画", "調和・平和"],
    "風沢中孚 九二": ["秘密・潜在", "本質・真実", "調和・平和"],
    "風沢中孚 六三": ["葛藤・矛盾", "変動・転換", "困難・停滞"],
    "風沢中孚 六四": ["追従・服従", "構造化・秩序", "自己変容・脱皮"],
    "風沢中孚 九五": ["リーダーシップ", "信頼", "調和・平和"],
    "風沢中孚 上九": ["表現・伝達", "損失・浪費", "完成・集大成"],
    "雷山小過 初六": ["始動・萌芽", "損失・浪費", "挑戦・困難"],
    "雷山小過 六二": ["追従・服従", "構造化・秩序", "調和・平和"],
    "雷山小過 九三": ["困難・停滞", "戦略・計画", "内省・静観"],
    "雷山小過 九四": ["実行・達成", "慎重さ", "調和・平和"],
    "雷山小過 六五": ["秘密・潜在", "困難・停滞", "受動・待機"],
    "雷山小過 上六": ["損失・浪費", "葛藤・矛盾", "完成・集大成"],
    "水火既済 初九": ["始動・萌芽", "困難・停滞", "内省・静観"],
    "水火既済 六二": ["損失・浪費", "秘密・潜在", "受動・待機"],
    "水火既済 九三": ["実行・達成", "挑戦・困難", "権威・支配"],
    "水火既済 六四": ["困難・停滞", "内省・静観", "秘密・潜在"],
    "水火既済 六五": ["富・豊かさ", "奉仕・貢献", "本質・真実"],
    "水火既済 上六": ["困難・停滞", "損失・浪費", "完成・集大成"],
    "火水未済 初六": ["始動・萌芽", "困難・停滞", "損失・浪費"],
    "火水未済 九二": ["持続・安定", "内省・静観", "戦略・計画"],
    "火水未済 六三": ["実行・達成", "挑戦・困難", "リーダーシップ"],
    "火水未済 九四": ["実行・達成", "リーダーシップ", "富・豊かさ"],
    "火水未済 六五": ["リーダーシップ", "本質・真実", "完成・集大成"],
    "火水未済 上九": ["完成・集大成", "富・豊かさ", "損失・浪費"],
  },

  // --- 後方互換性 & 詳細データ ---
  384: [
    {
      爻名: "乾為天 初九",
      通し番号: 1,
      卦番号: 1,
      爻: "初九",
      爻辞: "潜龍勿用（せんりゅう もちいるなかれ）意味：龍はまだ淵に潜んでいる。軽々しく動くべきではない。",
      現代解釈の要約:
        "才能や力を秘めているが、まだ時機ではない。軽率な行動を避け、力を蓄え、学ぶべき準備期間。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "待機, 準備",
      親となる卦: "乾為天",
      キーワードタグ:
        "ポテンシャル, 基礎固め, 学習, 待機, 時機尚早, 未熟, 準備, 潜龍",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 50.0,
      論理キーワードタグ:
        "状況:潜伏期, 状況:黎明期, 力学:協力者なし, アクション:準備, アクション:現状維持",
    },
    {
      爻名: "乾為天 九二",
      通し番号: 2,
      卦番号: 1,
      爻: "九二",
      爻辞: "見龍在田、利見大人（けんりゅう でんにあり、たいじんにあうによろし）意味：龍が地上に現れた。優れた指導者に会うと良い。",
      現代解釈の要約:
        "才能が認められ始める段階。優れた師や協力者に出会い、教えを乞うことで、道が開ける。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "成長, 出会い",
      親となる卦: "乾為天",
      キーワードタグ:
        "チャンス到来, 公の場, 出会い, 協力者, 師, 師事, 成長, 見龍, 認められる",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 65.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 60.0,
      論理キーワードタグ:
        "状況:安定期, 状況:組織戦, 力学:協力者なし, アクション:専門家相談",
    },
    {
      爻名: "乾為天 九三",
      通し番号: 3,
      卦番号: 1,
      爻: "九三",
      爻辞: "君子終日乾乾、夕惕若、厲无咎（くんし しゅうじつけんけん、ゆうべにてきじゃくたり、あやうけれどもとがなし）意味：君子は一日中努力し、夜も警戒する。危ういが咎めはない。",
      現代解釈の要約:
        "重要な立場に進み、多忙を極める。常に努力と警戒を怠らなければ、危険な状況でも乗り越えられる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "努力, 警戒",
      親となる卦: "乾為天",
      キーワードタグ:
        "リスクあり, 内省, 努力, 危険, 君子, 問題なし, 多忙, 慎重, 警戒, 責任",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 70.0,
      S5_主体性: "能動",
      S6_変動性スコア: 60.0,
      S7_総合評価スコア: 24.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者なし, 心理:警戒",
    },
    {
      爻名: "乾為天 九四",
      通し番号: 4,
      卦番号: 1,
      爻: "九四",
      爻辞: "或躍在淵、无咎（あるいはおどってふちにあり、とがなし）意味：あるいは淵から躍り出ようとする。咎めはない。",
      現代解釈の要約:
        "天に昇るか、淵に留まるか、飛躍のチャンスを前にした決断の時。慎重に状況を見極めるべき段階。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "決断, 飛躍",
      親となる卦: "乾為天",
      キーワードタグ: "タイミング, チャンス, 問題なし, 決断, 淵, 迷い, 飛躍",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 68.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者なし, 心理:慎重",
    },
    {
      爻名: "乾為天 九五",
      通し番号: 5,
      卦番号: 1,
      爻: "九五",
      爻辞: "飛龍在天、利見大人（ひりゅう てんにあり、たいじんにあうによろし）意味：龍が天を飛んでいる。優れた指導者に会うと良い。",
      現代解釈の要約:
        "才能が完全に開花し、最高の地位でその力を発揮している絶頂期。リーダーシップの極致。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "成功, リーダー",
      親となる卦: "乾為天",
      キーワードタグ:
        "リーダー, リーダーシップ, 公明正大, 出会い, 天命, 師事, 影響力, 成功, 絶頂期, 飛龍",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 70.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 66.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者なし, アクション:専門家相談",
    },
    {
      爻名: "乾為天 上九",
      通し番号: 6,
      卦番号: 1,
      爻: "上九",
      爻辞: "亢龍有悔こうりゅう くいあり）意味：天高く昇りつめた龍は、後悔することになる。",
      現代解釈の要約:
        "行き過ぎた力や地位。傲慢になり、下ることを知らないため、やがて孤立し、失敗や後悔を招く。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "慢心, 衰退",
      親となる卦: "乾為天",
      キーワードタグ:
        "亢龍, 傲慢, 引き際, 後悔, 慢心, 行き過ぎ, 衰退, 頂点のリスク",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 26.0,
      論理キーワードタグ:
        "状況:終極期, 状況:衰退期, 力学:協力者なし, 心理:内省",
    },
    {
      爻名: "乾為天 用九",
      通し番号: 7,
      卦番号: 1,
      爻: "用九",
      爻辞: "見群龍无首、吉（ぐんりゅうをみるに、くびなし、きち）意味：多くの龍が現れるが、頭を立てない。吉。",
      現代解釈の要約:
        "多くの有能な者が、特定のリーダーに依存せず、それぞれが自律的に協力し合う、理想的な組織の状態。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "協力, 自律",
      親となる卦: "乾為天",
      キーワードタグ: "協力, 吉, 自律",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 25.0,
      S5_主体性: "中立",
      S6_変動性スコア: 40.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ: "",
    },
    {
      爻名: "坤為地 初六",
      通し番号: 8,
      卦番号: 2,
      爻: "初六",
      爻辞: "履霜堅氷至 （りそうけんひょういたる） 意味：霜を踏む。堅い氷がやってくる。",
      現代解釈の要約:
        "小さな兆候から将来の大きな困難を予見し、備えるべき時期。問題の芽を見過ごすと、後に大きな災いとなるという警告。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "予兆, 警戒, 準備",
      親となる卦: "坤為地",
      キーワードタグ: "予兆, 初霜, 始まりの注意, 慎重, 準備, 警戒",
      S1_基本スコア: 33.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 36.0,
      論理キーワードタグ: "状況:困窮状態, 状況:黎明期, 力学:協力者なし",
    },
    {
      爻名: "坤為地 六二",
      通し番号: 9,
      卦番号: 2,
      爻: "六二",
      爻辞: "直方大、不習无不利 （ちょくほうだい、ならわずしてふりなきなし） 意味：素直で、まっすぐで、大きい。慣れなくても利益にならないことはない。",
      現代解釈の要約:
        "誠実、正直、公平という基本原則を貫く時。その普遍的な徳により、どんな状況でも自然と良い結果に繋がる、非常に安定した状態。",
      パターンの分類: "大勝ちパターン",
      キーワード: "誠実, 公正, 安定",
      点数: 2.0,
      親となる卦: "坤為地",
      キーワードタグ: "公正, 受容性, 大地の徳, 安定, 無私, 自然体, 誠実",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 58.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者なし",
    },
    {
      爻名: "坤為地 六三",
      通し番号: 10,
      卦番号: 2,
      爻: "六三",
      爻辞: "含章可貞、或従王事、无成有終 （しょうをふくみ、ていなるべし。あるいは王事に従い、なすことなくしておわりあり） 意味：才能を内に秘め、王の事業に従っても、手柄を立てなくても最終的には良い結果となる。",
      現代解釈の要約:
        "優れた能力をひけらかさず、縁の下の力持ちとして貢献する。個人の功績よりも組織全体の成功を優先する、控えめだが重要な役割。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "謙虚, 貢献, 補佐",
      親となる卦: "坤為地",
      キーワードタグ: "内面の美徳, 才能を隠す, 時期を待つ, 補佐, 謙虚, 貢献",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 20.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者なし, 心理:正道堅持",
    },
    {
      爻名: "坤為地 六四",
      通し番号: 11,
      卦番号: 2,
      爻: "六四",
      爻辞: "括嚢、无咎无誉 （かつのう、むきゅうむよ） 意味：袋の口を縛る。咎められることも誉められることもない。",
      現代解釈の要約:
        "不安定な時期や複雑な状況で、安易な発言や行動を控え、戦略的に沈黙を守る。リスクを回避するための自己保全の時。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "静観, 自己防衛, 沈黙",
      親となる卦: "坤為地",
      キーワードタグ:
        "口を閉ざす, 問題なし, 安全第一, 沈黙, 自己防衛, 隠遁, 静観",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者なし",
    },
    {
      爻名: "坤為地 六五",
      通し番号: 12,
      卦番号: 2,
      爻: "六五",
      爻辞: "黄裳元吉 （こうしょうげんきち） 意味：黄色い下衣（日常着）を着ている。大いに吉。",
      現代解釈の要約:
        "最高の地位にありながらも、派手さを好まず、質素で実直な態度を保つ。内面の充実と謙虚さが、最高の幸運を招く。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "謙虚, 質実剛健, 徳",
      親となる卦: "坤為地",
      キーワードタグ:
        "中庸の徳, 元吉, 吉, 徳, 最高の補佐役, 謙虚, 質実剛健, 黄裳",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 45.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 52.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者なし, 心理:謙虚",
    },
    {
      爻名: "坤為地 上六",
      通し番号: 13,
      卦番号: 2,
      爻: "上六",
      爻辞: "龍戦于野、其血玄黄 （りゅうせんうや、そのちげんこう） 意味：龍が野で戦う。その血は黒く黄色い。",
      現代解釈の要約:
        "陰の受容性が極まり、陽と対立して、収拾のつかない混乱と争いが生じる。双方ともに大きなダメージを受ける消耗戦。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "対立, 混乱, 共倒れ",
      親となる卦: "坤為地",
      キーワードタグ:
        "両者敗北, 争い, 共倒れ, 対立, 混乱, 限界突破, 陰の極み, 龍戦",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 35.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 28.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "坤為地 用六",
      通し番号: 14,
      卦番号: 2,
      爻: "用六",
      爻辞: "利永貞 （りえいてい） 意味：永く正しくしているのが良い。",
      現代解釈の要約:
        "陰の徳の理想形。常に従順で、正しい道を地道に守り続けることで、長期的な利益と安定を得る。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "持続, 堅実, 忍耐",
      親となる卦: "坤為地",
      キーワードタグ: "堅実, 忍耐, 持続",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 25.0,
      S5_主体性: "中立",
      S6_変動性スコア: 40.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ: "",
    },
    {
      爻名: "水雷屯 初九",
      通し番号: 15,
      卦番号: 3,
      爻: "初九",
      爻辞: "磐桓、利居貞、利建侯 （ばんかん、ていにおるによろし、こうをたつるによろし） 意味：岩が塞がり進めない。留まり、正しくして、協力者を立てるのが良い。",
      現代解釈の要約:
        "物事の始まりで、障害があり進めない。軽率に動かず、その場で正しく耐えながら、将来のための仲間や支援者を見つけるべき時。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "待機, 準備, 協力者",
      親となる卦: "水雷屯",
      キーワードタグ: "協力者, 待機, 準備",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 65.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 52.0,
      論理キーワードタグ:
        "状況:黎明期, 力学:下剋上リスク, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "水雷屯 六二",
      通し番号: 16,
      卦番号: 3,
      爻: "六二",
      爻辞: "屯如、邅如、乗馬班如。…十年乃字 （ちゅんじょ、てんじょ、じょうばはんじょ。…じゅうねんにしてすなわちじす） 意味：悩み、ためらい、馬も進まない。…10年待ってようやく嫁ぐ。",
      現代解釈の要約:
        "困難が続き、進むも退くもできない状況。求婚者が現れてもすぐには応じず、長く正しさを守り抜けば、最終的には良い結果となる。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "停滞, 忍耐, 困難",
      親となる卦: "水雷屯",
      キーワードタグ: "停滞, 困難, 忍耐",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 70.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:安定期, 状況:産みの苦しみ, 力学:協力者あり",
    },
    {
      爻名: "水雷屯 六三",
      通し番号: 17,
      卦番号: 3,
      爻: "六三",
      爻辞: "即鹿无虞、惟入于林中。…不如舎、往吝 （しかにつくにしぐなし、ただりんちゅうにいる。…しくにはあらず、ゆけばりん） 意味：案内人なしに鹿を追えば、ただ林の中で迷うだけだ。諦めるのが良い。進めば恥をかく。",
      現代解釈の要約:
        "案内人（指導者）もなしに、ただ利益（鹿）だけを追って進むと、道に迷い、行き詰まる。無謀な前進はやめ、一旦立ち止まるべき時。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "無謀, 計画不足, 撤退",
      親となる卦: "水雷屯",
      キーワードタグ: "撤退, 無謀, 計画不足",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 65.0,
      S5_主体性: "受動",
      S6_変動性スコア: 60.0,
      S7_総合評価スコア: 16.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者なし",
    },
    {
      爻名: "水雷屯 六四",
      通し番号: 18,
      卦番号: 3,
      爻: "六四",
      爻辞: "乗馬班如、求婚媾。往吉、无不利 （じょうばはんじょ、こんいんをもとむ。ゆけばきち、ふりなきなし） 意味：馬も進まないが、結婚を求める。進めば吉であり、悪いことは何もない。",
      現代解釈の要約:
        "困難な状況だが、身分の合った協力者を求め、共に進むなら、万事うまくいく。困難を打開するには、正しいパートナーシップが鍵となる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "協力, パートナー, 打開",
      親となる卦: "水雷屯",
      キーワードタグ: "パートナー, 協力, 吉, 打開",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 64.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:変革期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "水雷屯 九五",
      通し番号: 19,
      卦番号: 3,
      爻: "九五",
      爻辞: "屯其膏。小貞吉、大貞凶 （そのこうにとんす。しょうていきち、だいていきょう） 意味：恩恵を施すのに苦労する。小さなことなら正しくして吉だが、大きなことでは正しくしても凶。",
      現代解釈の要約:
        "高い地位にいるが、その恩恵を広く施すことができない。自分の周りの小さな範囲で物事を行うなら良いが、大きな事業を行おうとすると失敗する。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "器量不足, 限定的成功",
      親となる卦: "水雷屯",
      キーワードタグ: "凶, 吉, 器量不足, 限定的成功",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 75.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 24.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ:
        "状況:産みの苦しみ, 状況:絶頂期, 力学:下剋上リスク, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "水雷屯 上六",
      通し番号: 20,
      卦番号: 3,
      爻: "上六",
      爻辞: "乗馬班如、泣血漣如 （じょうばはんじょ、きゅうけつれんじょ） 意味：馬も進まず、血の涙を流す。",
      現代解釈の要約:
        "産みの苦しみが極まり、どうにもならない状況。助けもなく、ただ嘆き悲しむしかない。完全な行き詰まり。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "絶望, 行き詰まり",
      親となる卦: "水雷屯",
      キーワードタグ: "絶望, 行き詰まり",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 24.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "山水蒙 初六",
      通し番号: 21,
      卦番号: 4,
      爻: "初六",
      爻辞: "発蒙。利用刑人。用脱桎梏。以往吝。 （はつもう。けいじんをもちうるによろし。しっこくをときもちう。もってゆけばりん。） 意味：蒙昧を開く。刑罰で正し、足枷を外すのが良い。そのまま進むと恥。",
      現代解釈の要約:
        "学びの始まり。時には厳しく規律を持って指導し、悪癖（桎梏）を断ち切らせる必要がある。しかし、厳しさだけに頼ると、後で問題が生じる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "教育, 規律, 始まり",
      親となる卦: "山水蒙",
      キーワードタグ: "始まり, 教育, 規律",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 35.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "山水蒙 九二",
      通し番号: 22,
      卦番号: 4,
      爻: "九二",
      爻辞: "包蒙。吉。納婦吉。子克家。 （ほうもう。きち。ふをいれるきち。こよくいえをおさむ。） 意味：蒙昧な者を包容する。吉。妻を迎えれば吉。子が家を治められる。",
      現代解釈の要約:
        "未熟な者を寛大な心で包み込み、忍耐強く指導する理想的な教育者の姿。その結果、教えを受けた者は大いに成長し、組織や家庭は安泰となる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "師, 包容力, 育成",
      親となる卦: "山水蒙",
      キーワードタグ: "包容力, 吉, 師, 育成",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 70.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 58.0,
      論理キーワードタグ:
        "状況:安定期, 力学:下剋上リスク, 力学:協力者あり, 心理:忍耐",
    },
    {
      爻名: "山水蒙 六三",
      通し番号: 23,
      卦番号: 4,
      爻: "六三",
      爻辞: "勿用取女。見金夫。不有躬。无攸利。 （じょをとるをもちうるなかれ。きんぷをみる。みをたもたず。りするところなし。） 意味：その女を妻にしてはならない。金持ちの男を見ると自分を見失う。何の利益もない。",
      現代解釈の要約:
        "学びの途中で、楽な道や表面的な魅力（金夫）に惹かれ、本来の目的を見失う危険性。不適切な師や情報源に安易に追随すれば、何も得られない。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "誘惑, 虚飾, 選択ミス",
      親となる卦: "山水蒙",
      キーワードタグ: "虚飾, 誘惑, 選択ミス",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ:
        "状況:移行期, 状況:組織戦, 力学:協力者あり, アクション:現状維持",
    },
    {
      爻名: "山水蒙 六四",
      通し番号: 24,
      卦番号: 4,
      爻: "六四",
      爻辞: "困蒙。吝。 （こんもう。りん。） 意味：蒙昧な状態に閉じこもる。恥ずかしいことだ。",
      現代解釈の要約:
        "未熟であるにもかかわらず、学ぶことを放棄し、自分の殻に閉じこもっている状態。助言を拒み、孤立することで、成長の機会を完全に失う。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "停滞, 孤立, 無知",
      親となる卦: "山水蒙",
      キーワードタグ: "停滞, 孤立, 無知",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 36.0,
      論理キーワードタグ: "状況:困窮状態, 状況:変革期, 力学:協力者なし",
    },
    {
      爻名: "山水蒙 六五",
      通し番号: 25,
      卦番号: 4,
      爻: "六五",
      爻辞: "童蒙。吉。 （どうもう。きち。） 意味：素直な子ども（のように学ぶ）。吉。",
      現代解釈の要約:
        "純粋で素直な心で、謙虚に教えを受け入れる理想的な学習者の姿。この「知を求める素直さ」そのものが、大きな幸運を呼び込む。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "素直さ, 謙虚, 学び",
      親となる卦: "山水蒙",
      キーワードタグ: "吉, 学び, 素直さ, 謙虚",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 12.0,
      S7_総合評価スコア: 72.0,
      論理キーワードタグ:
        "状況:絶頂期, 力学:協力者あり, 力学:順当な力関係, 心理:謙虚",
    },
    {
      爻名: "山水蒙 上九",
      通し番号: 26,
      卦番号: 4,
      爻: "上九",
      爻辞: "撃蒙。不利為寇。利禦寇。 （げきもう。こうとなるにふり。こうをふせぐによろし。） 意味：蒙昧な者を撃つ。賊となるのは良くない。賊を防ぐのが良い。",
      現代解釈の要約:
        "長く蒙昧な状態が続く場合、厳しい態度で強制的に覚醒させる必要がある。ただし、それは相手を破壊するためではなく、蒙昧さがもたらす害を防ぐための、最終手段であるべき。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "最終手段, 覚醒, 規律",
      親となる卦: "山水蒙",
      キーワードタグ: "最終手段, 規律, 覚醒",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 65.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "水天需 初九",
      通し番号: 27,
      卦番号: 5,
      爻: "初九",
      爻辞: "需于郊。利用恒。无咎。 （じゅうこうにあり。つねをもちうるによろし。とがなし。） 意味：郊外で待つ。常に変わらぬ心でいるのが良い。咎めはない。",
      現代解釈の要約:
        "危険から遠い安全な場所で、焦らずじっくりと準備を整える段階。冷静に状況を観察し、自己の信念を保てば、問題なく過ごせる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "待機, 準備, 慎重",
      親となる卦: "水天需",
      キーワードタグ: "問題なし, 待機, 慎重, 準備",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 65.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 40.0,
      S7_総合評価スコア: 66.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者あり, アクション:準備",
    },
    {
      爻名: "水天需 九二",
      通し番号: 28,
      卦番号: 5,
      爻: "九二",
      爻辞: "需于沙。小有言。終吉。 （じゅうさにあリ。すこしげんあり。おわりにきち。） 意味：砂地で待つ。少し言葉があるが、最終的には吉。",
      現代解釈の要約:
        "危険に少し近づき、小さな問題や批判（小有言）が生じる時期。しかし、それに惑わされず、着実に準備を進めれば、良い結果に繋がる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "忍耐, 雑音, 漸進",
      親となる卦: "水天需",
      キーワードタグ: "吉, 忍耐, 漸進, 雑音",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者なし, アクション:準備",
    },
    {
      爻名: "水天需 九三",
      通し番号: 29,
      卦番号: 5,
      爻: "九三",
      爻辞: "需于泥。致寇至。 （じゅうでいにあり。こうをいたすにいたる。） 意味：泥沼で待つ。賊を引き寄せる。",
      現代解釈の要約:
        "危険な状況に深入りし、身動きが取れない泥沼の状態。準備不足や判断ミスが、外部からの攻撃やさらなるトラブルを引き寄せる。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "危機, 泥沼, 危険",
      親となる卦: "水天需",
      キーワードタグ: "危機, 危険, 泥沼",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 75.0,
      S5_主体性: "受動",
      S6_変動性スコア: 76.0,
      S7_総合評価スコア: 28.0,
      論理キーワードタグ:
        "状況:移行期, 力学:下剋上リスク, 力学:協力者あり, アクション:準備",
    },
    {
      爻名: "水天需 六四",
      通し番号: 30,
      卦番号: 5,
      爻: "六四",
      爻辞: "需于血。出自穴。 （じゅうけつにあり。あなよりいず。） 意味：血の中で待つ。穴から脱出する。",
      現代解釈の要約:
        "生死を分けるような極限の危機的状況。大きな犠牲や痛みを伴うが、それを乗り越え、危機から脱出することができる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "危機脱出, 犠牲, 転換点",
      親となる卦: "水天需",
      キーワードタグ: "危機脱出, 犠牲, 転換点",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 60.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "水天需 九五",
      通し番号: 31,
      卦番号: 5,
      爻: "九五",
      爻辞: "需于酒食。貞吉。 （じゅうしゅしょくにあり。ていきち。） 意味：酒や食事を楽しみながら待つ。正しくしていれば吉。",
      現代解釈の要約:
        "長い待機期間が終わり、状況が安定する。本格的な行動の前に、休息を取り、英気を養う時期。油断せず正しい姿勢を保てば安泰。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "安定, 休息, 祝賀",
      親となる卦: "水天需",
      キーワードタグ: "休息, 吉, 安定, 祝賀",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 48.0,
      論理キーワードタグ:
        "状況:絶頂期, 力学:下剋上リスク, 力学:協力者なし, 心理:正道堅持",
    },
    {
      爻名: "水天需 上六",
      通し番号: 32,
      卦番号: 5,
      爻: "上六",
      爻辞: "入于穴。有不速之客三人至。敬之終吉。 （あなにいる。はやからざるのきゃくさんにんいたるあり。これをけいすとおわりにきち。） 意味：穴に入る（危機を脱する）。招かれざる客が三人来る。敬って接すれば最終的に吉。",
      現代解釈の要約:
        "危機から完全に脱し、目標を達成した段階。しかし、予期せぬ新たな課題や協力者が現れる。謙虚な姿勢で対応すれば、更なる成功に繋がる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "完了, 新展開, 敬意",
      親となる卦: "水天需",
      キーワードタグ: "吉, 完了, 敬意, 新展開",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり, 心理:謙虚",
    },
    {
      爻名: "天水訟 初六",
      通し番号: 33,
      卦番号: 6,
      爻: "初六",
      爻辞: "不永所事。小有言。終吉。 （しょじをながくせず。すこしげんあり。おわりにきち。） 意味：争いを長引かせない。少し口論はあるが、最終的には吉。",
      現代解釈の要約:
        "争いの初期段階。問題を長引かせず、早期に解決することが重要。小さな摩擦はあっても、迅速な対話で対処すれば、良い結果に繋がる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "早期解決, 対話, 口論",
      親となる卦: "天水訟",
      キーワードタグ: "口論, 吉, 対話, 早期解決",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "天水訟 九二",
      通し番号: 34,
      卦番号: 6,
      爻: "九二",
      爻辞: "不克訟。帰而逋其邑人三百戸。无眚。 （しょうにかつことあたわず。かえりてそのゆうじんさんびゃっこににぐ。わざわいなし。） 意味：争いに勝てない。郷里に帰り、三百戸の民と難を避ける。災いはない。",
      現代解釈の要約:
        "自分に不利な争いからは、潔く身を引くべき時。目先の勝敗より、大切な共同体を守ることを優先する、賢明な撤退。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "撤退, 守り, 損失回避",
      親となる卦: "天水訟",
      キーワードタグ: "守り, 損失回避, 撤退",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ:
        "状況:安定期, 状況:対立構造, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "天水訟 六三",
      通し番号: 35,
      卦番号: 6,
      爻: "六三",
      爻辞: "食旧徳。貞厲。終吉。 （きゅうとくをくらう。ていあやうし。おわりにきち。） 意味：昔の徳で食いつなぐ。正しくしていれば危ういが、最終的には吉。",
      現代解釈の要約:
        "現在の困難を、過去の実績や信頼（旧徳）でなんとか乗り切っている状態。現状維持で精一杯だが、正しく耐え忍べば、破綻は免れる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "過去の実績, 現状維持, 忍耐",
      親となる卦: "天水訟",
      キーワードタグ: "リスクあり, 吉, 忍耐, 現状維持, 過去の実績",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 60.0,
      S5_主体性: "受動",
      S6_変動性スコア: 28.0,
      S7_総合評価スコア: 34.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:移行期, 力学:協力者あり, 力学:順当な力関係, 心理:正道堅持",
    },
    {
      爻名: "天水訟 九四",
      通し番号: 36,
      卦番号: 6,
      爻: "九四",
      爻辞: "不克訟。復即命。渝安貞。吉。 （しょうにかつことあたわず。めいにふくしてかえる。やすんじてかわるはていにきち。） 意味：争いに勝てない。天命に従って引き返す。心を変え、安んじて正しくしていれば吉。",
      現代解釈の要約:
        "争いの不利を悟り、自ら積極的に譲歩する決断。プライドに固執せず、方針を柔軟に転換することで、状況が好転し、安定を取り戻せる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "方針転換, 譲歩, 柔軟性",
      親となる卦: "天水訟",
      キーワードタグ: "吉, 方針転換, 柔軟性, 譲歩",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 58.0,
      論理キーワードタグ:
        "状況:変革期, 状況:対立構造, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "天水訟 九五",
      通し番号: 37,
      卦番号: 6,
      爻: "九五",
      爻辞: "訟元吉。 （しょうげんきち。） 意味：争いの結果、大いに吉。",
      現代解釈の要約:
        "争いが、正義に基づいた公平な判断によって解決される。自身の正当性が認められ、信頼を確立できる、最高の解決。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "公正な裁き, 勝利, 正義",
      親となる卦: "天水訟",
      キーワードタグ: "公正な裁き, 勝利, 吉, 正義",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 62.0,
      論理キーワードタグ: "状況:対立構造, 状況:絶頂期, 力学:協力者なし",
    },
    {
      爻名: "天水訟 上九",
      通し番号: 38,
      卦番号: 6,
      爻: "上九",
      爻辞: "或錫之鞶帯。終朝三褫之。 （あるいはこれにはんたいをたまう。しゅうちょうこれをみたびうばう。） 意味：あるいは（争いに勝って）高位の帯を賜るが、一日のうちに三度もそれを剥奪される。",
      現代解釈の要約:
        "行き過ぎた争いや、不当な手段で勝利した者の末路。一時的に名誉を得ても、すぐに失い、社会的な信用を完全に失う、最悪の結末。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "虚飾の勝利, 権威失墜, 破滅",
      親となる卦: "天水訟",
      キーワードタグ: "権威失墜, 破滅, 虚飾の勝利",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "地水師 初六",
      通し番号: 39,
      卦番号: 7,
      爻: "初六",
      爻辞: "師出以律。否臧凶。 （しをいずすにりつをもってす。しからずんばぞうにしてきょう。） 意味：軍隊は規律をもって出陣する。そうでなければ凶。",
      現代解釈の要約:
        "組織やプロジェクトの始動には、明確なルールと規律が不可欠。規律が曖昧なら、どんなに良い目的でも必ず失敗する、という根本原則。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "規律, 秩序, 準備",
      親となる卦: "地水師",
      キーワードタグ: "凶, 準備, 秩序, 規律",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ:
        "状況:停滞期, 状況:組織戦, 状況:黎明期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "地水師 九二",
      通し番号: 40,
      卦番号: 7,
      爻: "九二",
      爻辞: "在師中。吉。无咎。王三錫命。 （しにあってちゅうす。きち。とがなし。おうみたびめいをたまう。） 意味：軍隊の中央にいる。吉。咎めなし。王は三度も命を賜る。",
      現代解釈の要約:
        "組織の中核を担う、実力と人望を兼ね備えた理想的な現場リーダー。トップからの信頼も厚く、大きな権限を委ねられ、組織を勝利に導く。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "リーダーシップ, 信頼, 中核",
      親となる卦: "地水師",
      キーワードタグ: "リーダーシップ, 中核, 信頼, 吉, 問題なし",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 70.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 58.0,
      論理キーワードタグ:
        "状況:安定期, 状況:組織戦, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "地水師 六三",
      通し番号: 41,
      卦番号: 7,
      爻: "六三",
      爻辞: "師或載尸。凶。 （しあるいはしかばねをのす。きょう。） 意味：軍隊が死体を運ぶ。凶。",
      現代解釈の要約:
        "組織内に無能な人物や、やる気のない者（尸＝しかばね）が重要な地位にいる。組織が腐敗し、機能不全に陥っている、極めて危険な状態。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "無能, 腐敗, 混乱",
      親となる卦: "地水師",
      キーワードタグ: "凶, 混乱, 無能, 腐敗",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 75.0,
      S5_主体性: "受動",
      S6_変動性スコア: 60.0,
      S7_総合評価スコア: 12.0,
      論理キーワードタグ: "状況:移行期, 状況:組織戦, 力学:協力者なし",
    },
    {
      爻名: "地水師 六四",
      通し番号: 42,
      卦番号: 7,
      爻: "六四",
      爻辞: "師左次。无咎。 （しさていす。とがなし。） 意味：軍隊は左側に退く。咎めはない。",
      現代解釈の要約:
        "状況が不利な場合、無理に戦わずに一時的に撤退し、態勢を立て直す賢明な判断。これは敗北ではなく、損失を避けるための戦略的行動。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "撤退, 再編, 守り",
      親となる卦: "地水師",
      キーワードタグ: "再編, 問題なし, 守り, 撤退",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ: "状況:変革期, 状況:組織戦, 力学:協力者なし",
    },
    {
      爻名: "地水師 六五",
      通し番号: 43,
      卦番号: 7,
      爻: "六五",
      爻辞: "田有禽。利執言。…長子帥師。弟子輿尸。貞凶。 （でんにきんあり。げんをとるによろし。…ちょうししをひきう。ていししかばねをのす。ていきょう。） 意味：田に獲物がいる。…長男が軍を率いるべきで、末っ子が率いれば死体を運ぶ。正しくても凶。",
      現代解釈の要約:
        "解決すべき課題（禽）は明確だが、リーダーの人選が極めて重要。有能な者（長子）を任命すれば成功するが、不適任な者（弟子）に任せれば必ず失敗する。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "人材配置, 適材適所, 判断ミス",
      親となる卦: "地水師",
      キーワードタグ: "人材配置, 凶, 判断ミス, 適材適所",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 70.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 8.0,
      S7_総合評価スコア: 64.0,
      論理キーワードタグ:
        "状況:組織戦, 状況:絶頂期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "地水師 上六",
      通し番号: 44,
      卦番号: 7,
      爻: "上六",
      爻辞: "大君有命。開国承家。小人勿用。 （たいくんめいあり。くにをひらきいえをうく。しょうじんもちうるなかれ。） 意味：最高の君主が命を下す。国を開き家を継がせる。小人を用いてはならない。",
      現代解釈の要約:
        "戦いが終わり、目標を達成した後の論功行賞。功績のあった者に正当な報酬を与え、新しい秩序を築く。ただし、不正な者（小人）を登用すれば、再び乱れる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "勝利, 論功行賞, 新秩序",
      親となる卦: "地水師",
      キーワードタグ: "勝利, 新秩序, 論功行賞",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 24.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし, アクション:現状維持",
    },
    {
      爻名: "水地比 初六",
      通し番号: 45,
      卦番号: 8,
      爻: "初六",
      爻辞: "有孚比之。无咎。有孚盈缶。終来有他。吉。 （ゆうふこれにひす。とがなし。ゆうふかんをみたす。おわりにきたりてたあり。きち。） 意味：真心をもって親しむ。咎めなし。真心が甕に満ちれば、やがて他者も来る。吉。",
      現代解釈の要約:
        "関係構築の始まり。まず自分から真心を示すことで、信頼の土台を築く。その誠実さが、やがて多くの協力者を引き寄せる、良いスタート。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "真心, 信頼, 始まり",
      親となる卦: "水地比",
      キーワードタグ: "信頼, 吉, 問題なし, 始まり, 真心",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 36.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者なし",
    },
    {
      爻名: "水地比 六二",
      通し番号: 46,
      卦番号: 8,
      爻: "六二",
      爻辞: "比之自内。貞吉。 （これにひするうちよりす。ていきち。） 意味：内側から親しむ。正しくしていれば吉。",
      現代解釈の要約:
        "組織やチームの内部において、心からの揺るぎない結束が形成されている理想的な状態。共通の価値観に基づいた、本質的な協力関係。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "結束, 本質, 信頼関係",
      親となる卦: "水地比",
      キーワードタグ: "信頼関係, 吉, 本質, 結束",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 8.0,
      S7_総合評価スコア: 70.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "水地比 六三",
      通し番号: 47,
      卦番号: 8,
      爻: "六三",
      爻辞: "比之匪人。 （これにひするひとにあらず。） 意味：正しくない者と親しむ。（凶）",
      現代解釈の要約:
        "不正な目的を持つ者や、信頼できない人物と安易に協力関係を結ぶこと。誤ったパートナーシップが、大きな問題や損失を招く。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "悪縁, 判断ミス, 危険",
      親となる卦: "水地比",
      キーワードタグ: "凶, 判断ミス, 危険, 悪縁",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 75.0,
      S5_主体性: "受動",
      S6_変動性スコア: 60.0,
      S7_総合評価スコア: 12.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者なし",
    },
    {
      爻名: "水地比 六四",
      通し番号: 48,
      卦番号: 8,
      爻: "六四",
      爻辞: "外比于賢。貞吉。 （そとにけんをひす。ていきち。） 意味：外部の賢者と親しむ。正しくしていれば吉。",
      現代解釈の要約:
        "組織の枠を超え、外部の専門家や優れた組織と協力関係を築く。外部の知恵を積極的に取り入れることで、自らの成長に繋がる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "外部連携, 協力, 専門家",
      親となる卦: "水地比",
      キーワードタグ: "協力, 吉, 外部連携, 専門家",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ:
        "状況:変革期, 力学:協力者なし, 力学:順当な力関係, 心理:正道堅持",
    },
    {
      爻名: "水地比 九五",
      通し番号: 49,
      卦番号: 8,
      爻: "九五",
      爻辞: "顕比。王用三駆。…吉。 （ひをあらわす。おうもってさんくをもちう。…きち。） 意味：親しみを公にする。王は三方から狩りをする。…吉。（※解釈テキストでは「比之王」）",
      現代解釈の要約:
        "組織のトップが、周囲からの厚い信頼を得て、強いリーダーシップを発揮している状態。明確な目標の下、全員が協力し、咎められることがない。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "リーダーシップ, 求心力, 目標達成",
      親となる卦: "水地比",
      キーワードタグ: "リーダーシップ, 吉, 求心力, 目標達成",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 75.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 64.0,
      論理キーワードタグ: "状況:絶頂期, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "水地比 上六",
      通し番号: 50,
      卦番号: 8,
      爻: "上六",
      爻辞: "比之无首。凶。 （これにひするにくびなし。きょう。） 意味：先頭のない親密さ。凶。",
      現代解釈の要約:
        "誰がリーダーか、何が目標か不明確なまま、ただ馴れ合いで集まっている状態。統制が取れず、無秩序な集団は、やがて混乱し、崩壊する。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "無秩序, 混乱, 目的喪失",
      親となる卦: "水地比",
      キーワードタグ: "凶, 混乱, 無秩序, 目的喪失",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 75.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 16.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "風天小畜 初九",
      通し番号: 51,
      卦番号: 9,
      爻: "初九",
      爻辞: "復自道。何其咎。吉。 （みちよりかえる。なんぞそのとがあらん。きち。） 意味：（正しい）道へ引き返す。何の咎めがあろうか。吉。",
      現代解釈の要約:
        "計画の初期段階で、誤りに気づき、速やかに正しい道へと軌道修正する。その勇気ある決断は、後の問題を未然に防ぐ、素晴らしい一手。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "軌道修正, 早期発見, 原点回帰",
      親となる卦: "風天小畜",
      キーワードタグ: "原点回帰, 吉, 早期発見, 軌道修正",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 40.0,
      S7_総合評価スコア: 62.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者あり",
    },
    {
      爻名: "風天小畜 九二",
      通し番号: 52,
      卦番号: 9,
      爻: "九二",
      爻辞: "牽復。吉。 （ひかれてかえる。きち。） 意味：（正しい道へ）引き戻される。吉。",
      現代解釈の要約:
        "離反しそうな仲間や、誤った方向に進むパートナーを、説得して引き戻す。あるいは、自分が他者の助言を受け入れ、正しい道に戻る。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "協力者, 説得, 関係修復",
      親となる卦: "風天小畜",
      キーワードタグ: "協力者, 吉, 説得, 関係修復",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者なし",
    },
    {
      爻名: "風天小畜 九三",
      通し番号: 53,
      卦番号: 9,
      爻: "九三",
      爻辞: "輿脱輻。夫妻反目。 （よだつふく。ふうさいはんもくす。） 意味：車輪の輻（や）が外れる。夫婦が仲違いする。",
      現代解釈の要約:
        "組織やチーム内部に深刻な不和が生じ、協力体制が崩壊する。連携が完全に機能不全に陥り、プロジェクトが停滞する、最悪の状況。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "内部分裂, 不和, 機能不全",
      親となる卦: "風天小畜",
      キーワードタグ: "不和, 内部分裂, 機能不全",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 20.0,
      S4_リスク: 75.0,
      S5_主体性: "能動",
      S6_変動性スコア: 76.0,
      S7_総合評価スコア: 16.0,
      論理キーワードタグ: "状況:移行期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "風天小畜 六四",
      通し番号: 54,
      卦番号: 9,
      爻: "六四",
      爻辞: "有孚。血去惕出。无咎。 （まことあり。ちさりおそれいず。とがなし。） 意味：真心がある。血が去り、恐れがなくなる。咎めはない。",
      現代解釈の要約:
        "困難な状況でも、私心を捨て、真心と誠実さで問題に立ち向かう。その結果、危機（血）を乗り越え、不安（惕）が解消される。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "誠実, 危機克服, 信頼",
      親となる卦: "風天小畜",
      キーワードタグ: "信頼, 危機克服, 問題なし, 誠実",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 60.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:変革期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "風天小畜 九五",
      通し番号: 55,
      卦番号: 9,
      爻: "九五",
      爻辞: "有孚攣如。富以其鄰。 （まことありれんじょ。そのとなりをもってとむ。） 意味：真心があり、連なり固く結びつく。隣人とともに富む。",
      現代解釈の要約:
        "困難を乗り越え、組織やチーム内に、揺るぎない信頼と結束が形成されている。自分たちだけでなく、周囲の協力者と共に繁栄する共存共栄の理想形。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "結束, 共存共栄, パートナーシップ",
      親となる卦: "風天小畜",
      キーワードタグ: "パートナーシップ, 共存共栄, 結束",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 62.0,
      論理キーワードタグ: "状況:困窮状態, 状況:絶頂期, 力学:協力者なし",
    },
    {
      爻名: "風天小畜 上九",
      通し番号: 56,
      卦番号: 9,
      爻: "上九",
      爻辞: "既雨既處。…君子征凶。 （すでにあめふりすでにおる。…くんしゆけばきょう。） 意味：すでに雨が降り、止んでいる。…君子が進むと凶。",
      現代解釈の要約:
        "長い準備期間が終わり、目標が達成された状態。しかし、物事はピークに達しており、これ以上無理に進もうとすると、かえって失敗を招く。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "完了, 頂点, 油断, 引き際",
      親となる卦: "風天小畜",
      キーワードタグ: "凶, 完了, 引き際, 油断, 頂点",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 75.0,
      S5_主体性: "能動",
      S6_変動性スコア: 68.0,
      S7_総合評価スコア: 18.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし, アクション:準備",
    },
    {
      爻名: "天澤履 初九",
      通し番号: 57,
      卦番号: 10,
      爻: "初九",
      爻辞: "素履。往无咎。 （そり。ゆけばとがなし。） 意味：質素な履き物で踏み行く。進んで咎めなし。",
      現代解釈の要約:
        "新しい環境に入る際、見栄を張らず、基本に忠実で誠実な態度で臨む。その謙虚な姿勢で進めば、問題なく事を始められる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "謙虚, 誠実, 基礎",
      親となる卦: "天澤履",
      キーワードタグ: "問題なし, 基礎, 誠実, 謙虚",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 46.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者なし, 心理:謙虚",
    },
    {
      爻名: "天澤履 九二",
      通し番号: 58,
      卦番号: 10,
      爻: "九二",
      爻辞: "履道坦坦。幽人貞吉。 （みちをふむことたんたん。ゆうじんていきち。） 意味：平坦な道を踏み行く。隠者のように正しくしていれば吉。",
      現代解釈の要約:
        "争いや競争から離れ、穏やかで平坦な道を、正しく着実に歩んでいる状態。華やかさはないが、心穏やかで、非常に安定した幸運。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "平穏, 安定, 正道",
      親となる卦: "天澤履",
      キーワードタグ: "吉, 安定, 平穏, 正道",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ:
        "状況:安定期, 力学:下剋上リスク, 力学:協力者なし, 心理:正道堅持",
    },
    {
      爻名: "天澤履 六三",
      通し番号: 59,
      卦番号: 10,
      爻: "六三",
      爻辞: "眇能視。跛能履。履虎尾。咥人。凶。 （びょうよくみ。はよくふむ。とらのおをふむ。ひとをかむ。きょう。） 意味：片目が見え、足が不自由なのに、虎の尾を踏む。人に噛まれる。凶。",
      現代解釈の要約:
        "自身の能力不足を顧みず、過信して無謀な行動に出る。危険を軽視した結果、取り返しのつかない失敗や損害を被る、最悪の状況。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "過信, 無謀, 破滅",
      親となる卦: "天澤履",
      キーワードタグ: "凶, 無謀, 破滅, 過信",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 65.0,
      S5_主体性: "受動",
      S6_変動性スコア: 40.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "天澤履 九四",
      通し番号: 60,
      卦番号: 10,
      爻: "九四",
      爻辞: "履虎尾。愬愬。終吉。 （とらのおをふむ。さくさく。おわりにきち。） 意味：虎の尾を踏む。恐る恐る警戒する。最終的には吉。",
      現代解釈の要約:
        "避けられない危険な状況に直面するが、極度の警戒心と、細心の注意を払って慎重に行動することで、最終的にその難局を乗り切ることができる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "慎重, 危機管理, 警戒",
      親となる卦: "天澤履",
      キーワードタグ: "危機管理, 吉, 慎重, 警戒",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者なし, 心理:慎重",
    },
    {
      爻名: "天澤履 九五",
      通し番号: 61,
      卦番号: 10,
      爻: "九五",
      爻辞: "夬履。貞厲。 （かいり。ていあやうし。） 意味：決断して踏み行う。正しくしていれば危うい。（※解釈テキストでは「无咎」）",
      現代解釈の要約:
        "厳しい状況の中で、リーダーとして重大な意思決定を下す時。その道は正しくても、常に危険が伴う。強い意志と覚悟が試される。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "決断, 責任, 試練",
      親となる卦: "天澤履",
      キーワードタグ: "リスクあり, 問題なし, 決断, 試練, 責任",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 50.0,
      S5_主体性: "能動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者なし, 心理:正道堅持",
    },
    {
      爻名: "天澤履 上九",
      通し番号: 62,
      卦番号: 10,
      爻: "上九",
      爻辞: "視履考祥。其旋元吉。 （りをみ、しょうをこうがう。そのめぐりげんきち。） 意味：自分の行動を振り返り、吉凶をよく考える。その反省によって大いに吉となる。",
      現代解釈の要約:
        "全てのプロセスが終わった後、これまでの行動を深く振り返り、成功と失敗の原因を徹底的に検証する。その経験からの学びが、最高の幸運を招く。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "反省, 洞察, 完成",
      親となる卦: "天澤履",
      キーワードタグ: "凶, 反省, 吉, 完成, 洞察",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 34.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "地天泰 初九",
      通し番号: 63,
      卦番号: 11,
      爻: "初九",
      爻辞: "抜茅茹。以其彙。征吉。 （ぼうをぬくにじょのごとし。そのたぐいをもってす。ゆけばきち。） 意味：茅を抜くと根が繋がっている。仲間と共に進めば吉。",
      現代解釈の要約:
        "良いプロジェクトの始まり。中心人物の行動に、多くの協力者が自然と連なり、良い影響が広がる。最高のスタートであり、大いに吉。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "連携, 波及効果, 始まり",
      親となる卦: "地天泰",
      キーワードタグ: "吉, 始まり, 波及効果, 連携",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 62.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者あり",
    },
    {
      爻名: "地天泰 九二",
      通し番号: 64,
      卦番号: 11,
      爻: "九二",
      爻辞: "包荒。用渉大川。不遐遺。朋亡。得尚于中行。 （こうをつつむ。たいせんをわたるをもちう。かをとどめず。ほうほろぶ。ちゅうこうにたっとばるるをえる。） 意味：荒れ地をも包み込む。大河を渡る。遠きも忘れず。朋党は滅ぶ。中庸の道で尊敬される。",
      現代解釈の要約:
        "リーダーが、広い心で多様な人々を受け入れる包容力を示す。偏りのない公平な姿勢が、派閥を超えた真の信頼を生み、困難な事業も成し遂げられる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "包容力, 公平性, リーダーシップ",
      親となる卦: "地天泰",
      キーワードタグ: "リーダーシップ, 公平性, 包容力",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 70.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 72.0,
      論理キーワードタグ: "状況:困窮状態, 状況:安定期, 力学:協力者あり",
    },
    {
      爻名: "地天泰 九三",
      通し番号: 65,
      卦番号: 11,
      爻: "九三",
      爻辞: "无平不陂。无往不復。艱貞无咎。… （たいらにしてへいだらざるはなし。ゆきてかえらざるはなし。かんにしてていなればとがなし。…） 意味：平らで坂にならない道はない。行って戻らないものはない。困難に耐え正しくすれば咎めなし。",
      現代解釈の要約:
        "泰平の世にも、必ず変化の兆しや困難は訪れる。現状に慢心せず、常に危機意識を持ち、来るべき変化に備えるべきという警告。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "変化の兆し, 危機意識, 忍耐",
      親となる卦: "地天泰",
      キーワードタグ: "危機意識, 問題なし, 変化の兆し, 忍耐",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:移行期, 力学:下剋上リスク, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "地天泰 六四",
      通し番号: 66,
      卦番号: 11,
      爻: "六四",
      爻辞: "翩翩。不富以其隣。不戒以孚。 （へんぺん。とまずしてそのとなりをもってす。いましめずしてまことをもってす。） 意味：ひらひらと舞い降りる。富を誇示せず隣人と共に。警戒心なく真心で交わる。",
      現代解釈の要約:
        "平和な状況下で、上位者が謙虚に下位者と交流し、信頼に基づいて協力する。警戒心なく、オープンに連携することで、さらなる発展が生まれる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "交流, 謙虚, 信頼",
      親となる卦: "地天泰",
      キーワードタグ: "交流, 信頼, 謙虚",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者あり, 心理:謙虚",
    },
    {
      爻名: "地天泰 六五",
      通し番号: 67,
      卦番号: 11,
      爻: "六五",
      爻辞: "帝乙帰妹。以祉元吉。 （ていいつそのいもうとをとつがす。もってさいわいをしげんきち。） 意味：帝乙が妹を嫁がせる。それによって大いに幸せになる。大いに吉。",
      現代解釈の要約:
        "リーダー（帝乙）が、下位者（妹）を尊重し、結びつくことで、組織や社会全体が最高の調和と繁栄を享受する、理想的な状態。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "調和, 繁栄, 理想的関係",
      親となる卦: "地天泰",
      キーワードタグ: "吉, 理想的関係, 繁栄, 調和",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 68.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者あり",
    },
    {
      爻名: "地天泰 上六",
      通し番号: 68,
      卦番号: 11,
      爻: "上六",
      爻辞: "城復于隍。勿用師。…兇。 （しろこうにかえる。しをもちうるなかれ。…きょう。） 意味：城壁が堀に崩れ落ちる。軍を用いるな。…凶。",
      現代解釈の要約:
        "平和と繁栄が極まり、衰退が始まる。平和に慣れすぎ、危機への対応が遅れ、これまで築き上げた秩序や安定が崩壊する。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "衰退, 崩壊, 時代の終わり",
      親となる卦: "地天泰",
      キーワードタグ: "凶, 崩壊, 時代の終わり, 衰退",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 65.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ:
        "状況:終極期, 状況:組織戦, 力学:協力者あり, アクション:現状維持",
    },
    {
      爻名: "天地否 初六",
      通し番号: 69,
      卦番号: 12,
      爻: "初六",
      爻辞: "抜茅茹。以其彙。貞吉。亨。 （ぼうをぬくにじょのごとし。そのたぐいをもってす。ていきち。とおる。） 意味：茅を抜くと根が繋がっている。仲間と共に進めば吉。亨る。",
      現代解釈の要約:
        "閉塞の始まり。しかし、問題の根源を特定し、志を同じくする仲間と協力して早期に対処すれば、この閉塞を打ち破ることができる、という希望の兆し。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "協力, 団結, 打開策",
      親となる卦: "天地否",
      キーワードタグ: "協力, 吉, 団結, 打開策",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 28.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "天地否 六二",
      通し番号: 70,
      卦番号: 12,
      爻: "六二",
      爻辞: "包承。小人吉。大人否亨。 （ほうしょう。しょうじんきち。たいじんひにしてとおらず。） 意味：包み受け入れる。小人には吉。大人には閉塞して亨らない。",
      現代解釈の要約:
        "現状維持のために、不正や不合理な要求を受け入れてしまう。責任のない者（小人）はやり過ごせるが、リーダー（大人）がこの道を選ぶと、事態は好転せず、失敗に繋がる。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "迎合, 現状維持, 妥協",
      親となる卦: "天地否",
      キーワードタグ: "吉, 妥協, 現状維持, 迎合",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 65.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 74.0,
      論理キーワードタグ: "状況:停滞期, 状況:安定期, 力学:協力者あり",
    },
    {
      爻名: "天地否 六三",
      通し番号: 71,
      卦番号: 12,
      爻: "六三",
      爻辞: "包羞。 （ほうしゅう。） 意味：恥を包み隠す。",
      現代解釈の要約:
        "自身の過ちや組織の不都合な事実を隠蔽しようとする状態。問題から目を背け、責任を回避するその姿勢が、さらなる孤立と信頼の喪失を招く。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "隠蔽, 責任回避, 不誠実",
      親となる卦: "天地否",
      キーワードタグ: "不誠実, 責任回避, 隠蔽",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 40.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "天地否 九四",
      通し番号: 72,
      卦番号: 12,
      爻: "九四",
      爻辞: "有命。无咎。疇離祉。 （めいあり。とがなし。ちゅうしをうる。） 意味：天命がある。咎めはない。仲間と共に幸せを得る。",
      現代解釈の要約:
        "閉塞状態を打開するための「天命」が下り、変革が始まる。この決断は正しく、咎められない。共に困難を乗り越えようとする仲間が現れ、事態が好転し始める。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "変革, 決断, リーダーシップ",
      親となる卦: "天地否",
      キーワードタグ: "リーダーシップ, 問題なし, 変革, 決断",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 58.0,
      論理キーワードタグ: "状況:困窮状態, 状況:変革期, 力学:協力者あり",
    },
    {
      爻名: "天地否 九五",
      通し番号: 73,
      卦番号: 12,
      爻: "九五",
      爻辞: "休否。大人吉。其亡其亡。繋于苞桑。 （ひをやすむ。たいじんきち。「そのほろびんそのほろびん」と、ほうそうにつなぐ。） 意味：閉塞が休止する。大人には吉。「滅びるぞ」と常に警戒し、桑の株に繋ぐように安定を保つ。",
      現代解釈の要約:
        "長い閉塞が終わり、安定を取り戻し始める。しかし、リーダーは決して油断せず、常に危機意識を持ち、得られた平和を強固なものにする努力を続ける。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "回復, 安定化, 危機意識",
      親となる卦: "天地否",
      キーワードタグ: "危機意識, 吉, 回復, 安定化",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 85.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 8.0,
      S7_総合評価スコア: 82.0,
      論理キーワードタグ: "状況:停滞期, 状況:絶頂期, 力学:協力者あり",
    },
    {
      爻名: "天地否 上九",
      通し番号: 74,
      卦番号: 12,
      爻: "上九",
      爻辞: "傾否。先否後喜。 （ひをかたむく。さきにひにしてのちによろこびあり。） 意味：閉塞が傾く（終わる）。初めは閉塞だが、後には喜ぶ。",
      現代解釈の要約:
        "閉塞状態が極限に達し、ついに状況が大きく反転する。最も暗い時期が過ぎれば、必ず夜明けが来るという希望。苦難を乗り越えた結果、大きな喜びがもたらされる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "大逆転, 再生, 希望",
      親となる卦: "天地否",
      キーワードタグ: "再生, 大逆転, 希望",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ: "状況:停滞期, 状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "天火同人 初九",
      通し番号: 75,
      卦番号: 13,
      爻: "初九",
      爻辞: "同人于門。无咎。 （どうじんをもんにす。とがなし。） 意味：門の所で人々と志を同じくする。咎めはない。",
      現代解釈の要約:
        "新しい協力関係の始まり。特定のグループに限定せず、広く門戸を開いて協力を呼びかける。その開かれた姿勢自体が正しく、咎められない。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "オープン, 公平性, 始まり",
      親となる卦: "天火同人",
      キーワードタグ: "オープン, 公平性, 問題なし, 始まり",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 68.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ: "状況:黎明期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "天火同人 六二",
      通し番号: 76,
      卦番号: 13,
      爻: "六二",
      爻辞: "同人于宗。吝。 （どうじんをそうにす。りん。） 意味：宗族（血縁者）とだけ志を同じくする。恥ずかしいことだ。",
      現代解釈の要約:
        "協力関係が、血縁や学閥など、排他的な内輪だけのものに留まっている状態。公平性を欠き、全体の利益を損なうため、いずれ恥をかくことになる。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "排他的, 派閥, 内向き",
      親となる卦: "天火同人",
      キーワードタグ: "内向き, 排他的, 派閥",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 84.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 12.0,
      S7_総合評価スコア: 70.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "天火同人 九三",
      通し番号: 77,
      卦番号: 13,
      爻: "九三",
      爻辞: "伏戎于莽。升其高陵。三歳不興。 （ふくじゅうをもうにす。そのこうりょうにのぼる。さんさいおこらず。） 意味：草むらに兵を隠し、高台から見張る。三年間も事が起こらない。",
      現代解釈の要約:
        "協力関係にあるはずが、互いに疑心暗鬼になり、水面下で対立している。不信感が根深く、物事が長期間にわたって停滞する、最悪の膠着状態。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "不信感, 停滞, 疑心暗鬼",
      親となる卦: "天火同人",
      キーワードタグ: "不信感, 停滞, 疑心暗鬼",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 72.0,
      S7_総合評価スコア: 30.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者なし",
    },
    {
      爻名: "天火同人 九四",
      通し番号: 78,
      卦番号: 13,
      爻: "九四",
      爻辞: "乗其墉。弗克攻。吉。 （そのよう（城壁）にのる。うつことあたわず。きち。） 意味：城壁に登るが、攻め入ることはしない。吉。",
      現代解釈の要約:
        "対立関係において、相手を攻撃できる状況にあっても、力ずくで問題を解決しようとしない。争いを避けるその賢明な判断が、結果的に吉となる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "自制, 争いの回避, 賢明な判断",
      親となる卦: "天火同人",
      キーワードタグ: "争いの回避, 吉, 自制, 賢明な判断",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者なし",
    },
    {
      爻名: "天火同人 九五",
      通し番号: 79,
      卦番号: 13,
      爻: "九五",
      爻辞: "同人先号咷而後笑。大師克相遇。 （どうじんさきにごうとうしてのちにわらう。たいしかちてあいあう。） 意味：初めは泣き叫ぶが、後で笑う。大軍が互いに出会う。",
      現代解釈の要約:
        "深刻な対立や困難を乗り越え、最終的に真の和解と協力関係を築く。深い苦しみの後に、最高の喜びと結束が訪れる、劇的な大逆転。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "和解, 苦難の克服, 団結",
      親となる卦: "天火同人",
      キーワードタグ: "和解, 団結, 苦難の克服",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 75.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 78.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:組織戦, 状況:絶頂期, 力学:協力者あり",
    },
    {
      爻名: "天火同人 上九",
      通し番号: 80,
      卦番号: 13,
      爻: "上九",
      爻辞: "同人于郊。无悔。 （どうじんをこうにす。くいなし。） 意味：郊外で人々と志を同じくする。悔いはない。",
      現代解釈の要約:
        "激しい協力や対立の段階が終わり、中心から一歩離れた場所で、ゆるやかな連携を保っている状態。大きな成果はないが、平穏で悔いのない結末。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "完了, 距離感, 平穏",
      親となる卦: "天火同人",
      キーワードタグ: "完了, 平穏, 距離感",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 22.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし, 心理:内省",
    },
    {
      爻名: "火天大有 初九",
      通し番号: 81,
      卦番号: 14,
      爻: "初九",
      爻辞: "无交害。匪咎。艱則无咎。 （がいとまじわるなし。とがにあらず。なやむとすなわちとがなし。） 意味：害と交わらない。咎めではない。困難を思えば咎めなし。",
      現代解釈の要約:
        "成功の初期段階。不適切な関係を避け、常に公正さを保つ。成功しても、困難な時の気持ちを忘れず、慎重に行動すれば問題ない。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "公平性, 慎重, 始まり",
      親となる卦: "火天大有",
      キーワードタグ: "公平性, 問題なし, 始まり, 慎重",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 46.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:黎明期, 力学:協力者なし, 心理:慎重",
    },
    {
      爻名: "火天大有 九二",
      通し番号: 82,
      卦番号: 14,
      爻: "九二",
      爻辞: "大車以載。有攸往。无咎。 （たいしゃもってのす。ゆくところあり。とがなし。） 意味：大きな車で物を積む。行くところがあれば、咎めなし。",
      現代解釈の要約:
        "多くの富や資源を有効に活用できる能力と器がある。それらを社会貢献など、正当な目的のために用いれば、咎められることはない。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "能力, 資源, 実行力",
      親となる卦: "火天大有",
      キーワードタグ: "問題なし, 実行力, 能力, 資源",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 70.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 72.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者あり",
    },
    {
      爻名: "火天大有 九三",
      通し番号: 83,
      卦番号: 14,
      爻: "九三",
      爻辞: "公用亨于天子。小人弗克。 （こうもっててんしにきょうす。しょうじんはかつことあたわず。） 意味：公が天子に献上する。小人にはできない。",
      現代解釈の要約:
        "得られた富や成功を私物化せず、社会全体や公のために捧げる。私利私欲のない、高潔な人物だけができる、徳の高い行動。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "公共の利益, 社会貢献, 無私",
      親となる卦: "火天大有",
      キーワードタグ: "公共の利益, 無私, 社会貢献",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 60.0,
      S7_総合評価スコア: 34.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者なし",
    },
    {
      爻名: "火天大有 九四",
      通し番号: 84,
      卦番号: 14,
      爻: "九四",
      爻辞: "匪其彭。无咎。 （そのほうにあらず。とがなし。） 意味：その勢いを盛んにしない。咎めはない。",
      現代解釈の要約:
        "大きな成功を収めても、その力や富を誇示せず、謙虚な姿勢を保つ。慢心せず、自らを律することで、咎めを避けることができる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "謙虚, 自己抑制, 慢心の回避",
      親となる卦: "火天大有",
      キーワードタグ: "問題なし, 慢心の回避, 自己抑制, 謙虚",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 28.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 72.0,
      S7_総合評価スコア: 28.0,
      論理キーワードタグ:
        "状況:変革期, 力学:下剋上リスク, 力学:協力者なし, 心理:謙虚",
    },
    {
      爻名: "火天大有 六五",
      通し番号: 85,
      卦番号: 14,
      爻: "六五",
      爻辞: "厥孚交如。威如。吉。 （そのまことこうじょ。いじょ。きち。） 意味：その真心が交わる。威厳がある。吉。",
      現代解釈の要約:
        "リーダーが真心をもって人々と接し、普遍的な信頼を得ている。親しみやすさの中にも、尊敬されるに足る威厳があり、物事は順調に進む。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "信頼, 誠実, リーダーシップ",
      親となる卦: "火天大有",
      キーワードタグ: "リーダーシップ, 信頼, 吉, 誠実",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 12.0,
      S7_総合評価スコア: 72.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "火天大有 上九",
      通し番号: 86,
      卦番号: 14,
      爻: "上九",
      爻辞: "自天祐之。吉无不利。 （てんよりこれをたすく。きちにしてりせざるなし。） 意味：天がこれを助ける。吉にして、利益にならないことはない。",
      現代解釈の要約:
        "繁栄と徳が極まり、もはや人間的な努力を超えて、天からの助けや幸運を得られる、最高の状態。何をしても、全てがうまくいく。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "天佑, 究極の成功, 徳",
      親となる卦: "火天大有",
      キーワードタグ: "吉, 天佑, 徳, 究極の成功",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 30.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "地山謙 初六",
      通し番号: 87,
      卦番号: 15,
      爻: "初六",
      爻辞: "謙謙君子。用渉大川。吉。 （けんけんくんし。たいせんをわたるをもちう。きち。） 意味：謙虚にまた謙虚な君子。大河を渡るのに用いる。吉。",
      現代解釈の要約:
        "新しいことを始める際、極めて謙虚な姿勢で臨む。その謙虚さが周囲の信頼を呼び、どんな困難な課題（大川）でも乗り越えることができる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "謙虚, 始まり, 困難克服",
      親となる卦: "地山謙",
      キーワードタグ: "吉, 困難克服, 始まり, 謙虚",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 36.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:黎明期, 力学:協力者なし, 心理:謙虚",
    },
    {
      爻名: "地山謙 六二",
      通し番号: 88,
      卦番号: 15,
      爻: "六二",
      爻辞: "鳴謙。貞吉。 （めいけん。ていきち。） 意味：謙虚さが（鳴り響くように）表れる。正しくしていれば吉。",
      現代解釈の要約:
        "内面の謙虚さが、言葉や行動に自然とにじみ出て、周囲から高く評価される。その真価が認められ、物事は順調に進む。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "評判, 信頼, 誠実",
      親となる卦: "地山謙",
      キーワードタグ: "信頼, 吉, 評判, 誠実",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 72.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 12.0,
      S7_総合評価スコア: 58.0,
      論理キーワードタグ:
        "状況:安定期, 力学:協力者なし, 力学:順当な力関係, 心理:正道堅持, 心理:謙虚",
    },
    {
      爻名: "地山謙 九三",
      通し番号: 89,
      卦番号: 15,
      爻: "九三",
      爻辞: "労謙君子。有終吉。 （ろうけんくんし。おわりありてきち。） 意味：努力しながらも謙虚な君子。最終的には吉。",
      現代解釈の要約:
        "多大な功績を上げながらも、決して驕ることなく、謙虚な姿勢を保ち続ける。その努力と謙虚さは、必ず最高の結末を迎える。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "努力, 功績, 有終の美",
      親となる卦: "地山謙",
      キーワードタグ: "功績, 努力, 吉, 有終の美",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 64.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ:
        "状況:移行期, 力学:下剋上リスク, 力学:協力者あり, 心理:謙虚",
    },
    {
      爻名: "地山謙 六四",
      通し番号: 90,
      卦番号: 15,
      爻: "六四",
      爻辞: "无不利。撝謙。 （ふりなきなし。けんをふるう。） 意味：不利なことはない。（謙虚さを）発揮すれば。",
      現代解釈の要約:
        "どんな状況においても、謙虚な姿勢を保つことで、あらゆる不利な状況を避け、乗り越えることができる。謙虚さそのものが最強の武器となる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "万能, 柔軟性, 利益",
      親となる卦: "地山謙",
      キーワードタグ: "万能, 利益, 柔軟性",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 35.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者なし, 心理:謙虚",
    },
    {
      爻名: "地山謙 六五",
      通し番号: 91,
      卦番号: 15,
      爻: "六五",
      爻辞: "不富以其鄰。利用侵伐。无不利。 （とまずしてそのとなりをもってす。しんばつをもちうるによろし。ふりなきなし。） 意味：富を誇示せず隣人と共にある。侵伐に用いるのが良い。不利なことはない。",
      現代解釈の要約:
        "高い地位にありながらも、その権威をひけらかさず、常に周囲と共にある。その謙虚さがあるからこそ、いざという時には断固たる行動が取れ、成功する。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "リーダーシップ, 公正, 決断",
      親となる卦: "地山謙",
      キーワードタグ: "リーダーシップ, 公正, 決断",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者なし, 心理:謙虚",
    },
    {
      爻名: "地山謙 上六",
      通し番号: 92,
      卦番号: 15,
      爻: "上六",
      爻辞: "鳴謙。利用行師。征邑国。 （めいけん。しをおこなうをもちうるによろし。ゆうこくをせいす。） 意味：謙虚さが鳴り響く。軍隊を動かすのが良い。自分の国を討伐する。",
      現代解釈の要約:
        "謙虚さの評判が確立しているため、内部改革など、痛みを伴う厳しい決断を下しても、周囲の理解と協力を得て、成功させることができる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "権威, 改革, 信頼",
      親となる卦: "地山謙",
      キーワードタグ: "信頼, 改革, 権威",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ:
        "状況:変革期, 状況:終極期, 状況:組織戦, 力学:協力者あり, 心理:謙虚",
    },
    {
      爻名: "雷地豫 初六",
      通し番号: 93,
      卦番号: 16,
      爻: "初六",
      爻辞: "鳴豫。凶。 （めいよ。きょう。） 意味：喜びを公言する。凶。",
      現代解釈の要約:
        "まだ準備が整っていない初期段階で、成功を公言したり、派手に喜びを表したりする。その軽率さと油断が、必ず失敗を招く。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "時期尚早, 軽率, 油断",
      親となる卦: "雷地豫",
      キーワードタグ: "凶, 時期尚早, 油断, 軽率",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 40.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者あり, アクション:準備",
    },
    {
      爻名: "雷地豫 六二",
      通し番号: 94,
      卦番号: 16,
      爻: "六二",
      爻辞: "介于石。不終日。貞吉。 （かいをいしにす。ひをおわらず。ていきち。） 意味：岩のように堅固に守る。一日も待たない。正しくしていれば吉。",
      現代解釈の要約:
        "周囲が喜びや活気に浮かれる中で、一人冷静さを保ち、岩のように堅固な信念を守る。問題の兆候を察知し、迅速に対処することで、良い結果を得る。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "堅実, 冷静, 迅速な対応",
      親となる卦: "雷地豫",
      キーワードタグ: "冷静, 吉, 堅実, 迅速な対応",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 54.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者なし, 心理:正道堅持",
    },
    {
      爻名: "雷地豫 六三",
      通し番号: 95,
      卦番号: 16,
      爻: "六三",
      爻辞: "盱豫。悔。遅有悔。 （くよ。くいあり。おくるればくいあり。） 意味：仰ぎ見て喜ぶ。悔いる。遅れれば悔いがある。",
      現代解釈の要約:
        "自分の判断を持たず、他者の成功や喜びに安易に追従する。主体性のないその態度は、行動のタイミングを逃し、後悔することに繋がる。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "追従, 主体性の欠如, 後悔",
      親となる卦: "雷地豫",
      キーワードタグ: "主体性の欠如, 後悔, 追従",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 65.0,
      S5_主体性: "受動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 20.0,
      論理キーワードタグ:
        "状況:移行期, 力学:協力者なし, 力学:順当な力関係, 心理:内省",
    },
    {
      爻名: "雷地豫 九四",
      通し番号: 96,
      卦番号: 16,
      爻: "九四",
      爻辞: "由豫。大有得。勿疑。朋盍簪。 （ゆうよ。おおいにうるところあり。うたがうなかれ。ほうかんざしをあわす。） 意味：喜びの源となる。大いに得るものがある。疑うな。仲間が集まる。",
      現代解釈の要約:
        "リーダーとして、自らが喜びや活気の中心となり、周囲を導く。その行動力とビジョンが、多くの協力者を引き寄せ、大きな成果を上げる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "リーダーシップ, 求心力, 成果",
      親となる卦: "雷地豫",
      キーワードタグ: "リーダーシップ, 成果, 求心力",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 60.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ: "状況:変革期, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "雷地豫 六五",
      通し番号: 97,
      卦番号: 16,
      爻: "六五",
      爻辞: "貞疾。恒不死。 （ていしつ。つねにしせず。） 意味：正しくしていれば病気になる。しかし常に死なない。（※解釈テキストでは凶）",
      現代解釈の要約:
        "表面的な安定や安楽に浸り、変化を拒む状態。それは慢性的な病のように、組織や個人をじわじわと蝕んでいく。すぐには破綻しないが、危険な状態。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "慢心, 現状維持, 隠れた問題",
      親となる卦: "雷地豫",
      キーワードタグ: "凶, 慢心, 現状維持, 隠れた問題",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 45.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者なし, 心理:正道堅持",
    },
    {
      爻名: "雷地豫 上六",
      通し番号: 98,
      卦番号: 16,
      爻: "上六",
      爻辞: "冥豫。成有渝。无咎。 （めいよ。なりてかわることあり。とがなし。） 意味：盲目的な喜び。成果があっても変化する。咎めはない。",
      現代解釈の要約:
        "喜びや享楽に溺れ、現実が見えなくなっている状態。いずれその宴は終わり、状況は変化する。しかし、その過ちに気づき、反省すれば、咎めはない。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "享楽, 終焉, 反省",
      親となる卦: "雷地豫",
      キーワードタグ: "享楽, 反省, 問題なし, 終焉",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 24.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "沢雷随 初九",
      通し番号: 99,
      卦番号: 17,
      爻: "初九",
      爻辞: "官有渝。貞吉。出門交有功。 （かんいかわることあり。ていきち。もんをいでてまじわればこうあり。） 意味：役職や方針に変化がある。正しくしていれば吉。門を出て交流すれば功績がある。",
      現代解釈の要約:
        "時代の変化の兆しをいち早く察知する。自分の殻に閉じこもらず、積極的に外部と交流し、情報収集を行うことで、変化の波に乗り、成功を収めることができる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "変化への対応, 交流, 積極性",
      親となる卦: "沢雷随",
      キーワードタグ: "交流, 吉, 変化への対応, 積極性",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 68.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ:
        "状況:黎明期, 力学:下剋上リスク, 力学:協力者なし, 心理:正道堅持",
    },
    {
      爻名: "沢雷随 六二",
      通し番号: 100,
      卦番号: 17,
      爻: "六二",
      爻辞: "繋小子。失丈夫。 （しょうしにかかる。じょうぶをうしなう。） 意味：子供に執着し、立派な者を失う。",
      現代解釈の要約:
        "変化の中で、取るに足らないことや、目先の未熟な利益（小子）に固執した結果、本当に価値のあるものや、尊敬すべきパートナー（丈夫）を失う、という判断の誤り。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "判断ミス, 優先順位, 損失",
      親となる卦: "沢雷随",
      キーワードタグ: "優先順位, 判断ミス, 損失",
      S1_基本スコア: 33.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 70.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者あり",
    },
    {
      爻名: "沢雷随 六三",
      通し番号: 101,
      卦番号: 17,
      爻: "六三",
      爻辞: "繋丈夫。失小子。随有求得。… （じょうぶにかかる。しょうしをうしなう。…したがいて、もとめてうるところあり。） 意味：立派な者に執着し、子供を失う。追随すれば求めるものを得られる。",
      現代解釈の要約:
        "些細なこと（小子）を捨ててでも、真に価値のある指導者や、正しい理念（丈夫）に追随する賢明な選択。これにより、最終的に求める成果を得られる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "賢明な選択, 本質, 指導者",
      親となる卦: "沢雷随",
      キーワードタグ: "指導者, 本質, 賢明な選択",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 24.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "沢雷随 九四",
      通し番号: 102,
      卦番号: 17,
      爻: "九四",
      爻辞: "随有獲。貞凶。有孚在道。以明。何咎。 （したがいてうるところあり。ていはきょう。まことありてみちにあれば、もってあきらかにす。なんのとがあらん。） 意味：追随して得るものがあるが、正しくなければ凶。道に真心があれば、咎めはない。",
      現代解釈の要約:
        "追随することで利益を得るが、その動機が不純であったり、私利私欲であったりすると、後に大きな災いを招く。常に誠実さと公正さが問われる、危険な成功。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "危険な成功, 動機, 公正さ",
      親となる卦: "沢雷随",
      キーワードタグ: "公正さ, 凶, 動機, 危険な成功",
      S1_基本スコア: 33.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 34.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者なし, 心理:正道堅持",
    },
    {
      爻名: "沢雷随 九五",
      通し番号: 103,
      卦番号: 17,
      爻: "九五",
      爻辞: "孚于嘉。吉。 （かにまことあり。きち。） 意味：素晴らしいものに真心をもって追随する。吉。",
      現代解釈の要約:
        "特定の人物や利益ではなく、正義や美徳といった、普遍的で素晴らしい理念（嘉）に、真心をもって従う。最高の追随の形であり、大いに吉。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "理念, 誠実, 美徳",
      親となる卦: "沢雷随",
      キーワードタグ: "吉, 理念, 美徳, 誠実",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 75.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 64.0,
      論理キーワードタグ: "状況:絶頂期, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "沢雷随 上六",
      通し番号: 104,
      卦番号: 17,
      爻: "上六",
      爻辞: "拘繋之。乃従維之。… （こうけいし。すなわちしたがいこれをひく。…） 意味：引き止められ、繋がれる。それに従い、さらに縛られる。",
      現代解釈の要約:
        "変化を拒否し、過去の成功体験や古い慣習に固執する。あるいは、特定の人物に盲目的に従い続け、主体性を失い、完全に行き詰まってしまう。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "盲従, 固執, 行き詰まり",
      親となる卦: "沢雷随",
      キーワードタグ: "固執, 盲従, 行き詰まり",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 24.0,
      論理キーワードタグ: "状況:停滞期, 状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "山風蠱 初六",
      通し番号: 105,
      卦番号: 18,
      爻: "初六",
      爻辞: "幹父之蠱。有子。考无咎。厲終吉。 （ちちのこをただす。こあり。こうにとがなし。あやうけれど、おわりにきち。） 意味：父の腐敗を正す。子がいれば、父に咎はない。危ういが最終的には吉。",
      現代解釈の要約:
        "腐敗や問題が発生した初期段階。先代や過去の問題を、責任感を持って引き受け、解決に乗り出す。困難で危うい任務だが、その志と行動は正しく、最終的には良い結果に繋がる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "問題解決, 責任感, 改革の始まり",
      親となる卦: "山風蠱",
      キーワードタグ:
        "リスクあり, 吉, 問題なし, 問題解決, 改革の始まり, 責任感",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 50.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 34.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:黎明期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "山風蠱 九二",
      通し番号: 106,
      卦番号: 18,
      爻: "九二",
      爻辞: "幹母之蠱。不可貞。 （ははのこをただす。ていなるべからず。） 意味：母の腐敗を正す。固く守りすぎてはいけない。",
      現代解釈の要約:
        "感情的、あるいは構造的に根深い問題に対処する。力ずくで厳しく改革しようとすると、かえって反発を招き、失敗する。柔軟で、穏健なアプローチが必要とされる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "柔軟性, 感情的な問題, 慎重",
      親となる卦: "山風蠱",
      キーワードタグ: "感情的な問題, 慎重, 柔軟性",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 70.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 8.0,
      S7_総合評価スコア: 72.0,
      論理キーワードタグ:
        "状況:変革期, 状況:安定期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "山風蠱 九三",
      通し番号: 107,
      卦番号: 18,
      爻: "九三",
      爻辞: "幹父之蠱。小有悔。无大咎。 （ちちのこをただす。すこしくいあり。おおきなとがなし。） 意味：父の腐敗を正す。少し悔いがあるが、大きな咎めはない。",
      現代解釈の要約:
        "問題解決のために、少し性急すぎたり、やり方が強引すぎたりする。そのため、多少の後悔や小さな失敗は伴うが、改革自体は前に進み、致命的な問題にはならない。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "やり過ぎ, 小さな失敗, 軌道修正",
      親となる卦: "山風蠱",
      キーワードタグ: "やり過ぎ, 小さな失敗, 軌道修正",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 20.0,
      S4_リスク: 85.0,
      S5_主体性: "能動",
      S6_変動性スコア: 76.0,
      S7_総合評価スコア: 12.0,
      論理キーワードタグ:
        "状況:変革期, 状況:移行期, 力学:下剋上リスク, 力学:協力者なし, 心理:内省",
    },
    {
      爻名: "山風蠱 六四",
      通し番号: 108,
      卦番号: 18,
      爻: "六四",
      爻辞: "裕父之蠱。往見吝。 （ちちのこをゆるやかにす。ゆけばりんをみる。） 意味：父の腐敗を寛大に見過ごす。そのまま行けば恥を見る。",
      現代解釈の要約:
        "解決すべき問題を見て見ぬふりをし、放置する。現状維持を選び、改革を怠ることで、いずれ状況はさらに悪化し、大きな恥をかくことになる。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "問題の放置, 怠慢, 悪化",
      親となる卦: "山風蠱",
      キーワードタグ: "問題の放置, 怠慢, 悪化",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 36.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者なし",
    },
    {
      爻名: "山風蠱 六五",
      通し番号: 109,
      卦番号: 18,
      爻: "六五",
      爻辞: "幹父之蠱。用誉。 （ちちのこをただす。もってほまれあり。） 意味：父の腐敗を正す。名誉を得る。",
      現代解釈の要約:
        "困難な改革を見事に成し遂げ、組織や家を立て直す。その能力と功績が高く評価され、周囲から大きな名誉と尊敬を得る、理想的な問題解決。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "見事な解決, 功績, 名誉",
      親となる卦: "山風蠱",
      キーワードタグ: "功績, 名誉, 見事な解決",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 12.0,
      S7_総合評価スコア: 72.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:変革期, 状況:絶頂期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "山風蠱 上九",
      通し番号: 110,
      卦番号: 18,
      爻: "上九",
      爻辞: "不事王侯。高尚其事。 （おうこうにつかえず。そのことをこうしょうにす。） 意味：王侯に仕えず、自らの事を高尚にする。",
      現代解釈の要約:
        "全ての問題を解決し、その功績によって得られる地位や名誉に固執しない。俗世間から一歩退き、自らの精神性を高めるという、最も高潔な境地。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "超越, 隠遁, 精神的充実",
      親となる卦: "山風蠱",
      キーワードタグ: "精神的充実, 超越, 隠遁",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 26.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "地沢臨 初九",
      通し番号: 111,
      卦番号: 19,
      爻: "初九",
      爻辞: "咸臨。貞吉。 （かんりん。ていきち。） 意味：（皆で）感じ合って臨む。正しくしていれば吉。",
      現代解釈の要約:
        "物事の始まりにおいて、関係者全員が心を一つにし、誠実な気持ちで協力し合う。その公正な姿勢とチームワークが、幸先の良いスタートを切らせる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "協力, 始まり, 誠実",
      親となる卦: "地沢臨",
      キーワードタグ: "協力, 吉, 始まり, 誠実",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 28.0,
      S7_総合評価スコア: 62.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "地沢臨 九二",
      通し番号: 112,
      卦番号: 19,
      爻: "九二",
      爻辞: "咸臨。吉无不利。 （かんりん。きちにしてふりなきなし。） 意味：（皆で）感じ合って臨む。吉であり、利益にならないことは何もない。",
      現代解釈の要約:
        "協力関係がさらに深まり、信頼が完全に確立されている。何をやってもうまくいく、絶好調の時期。勢いがあり、大きな成果が期待できる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "絶好調, 成功, チームワーク",
      親となる卦: "地沢臨",
      キーワードタグ: "チームワーク, 吉, 成功, 絶好調",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 80.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 62.0,
      論理キーワードタグ: "状況:安定期, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "地沢臨 六三",
      通し番号: 113,
      卦番号: 19,
      爻: "六三",
      爻辞: "甘臨。无攸利。既憂之。无咎。 （かんりん。りするところなし。すでにこれをうれう。とがなし。） 意味：甘い言葉で臨む。利するところがない。すでにこれを憂えれば、咎めなし。",
      現代解釈の要約:
        "実力を伴わない甘い言葉や、安易な迎合で人に臨もうとする。そのやり方では良い結果は得られないが、その過ちに気づき、反省すれば、大きな問題には至らない。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "甘い言葉, 不誠実, 軌道修正",
      親となる卦: "地沢臨",
      キーワードタグ: "不誠実, 問題なし, 甘い言葉, 軌道修正",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 35.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 60.0,
      S7_総合評価スコア: 24.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者なし",
    },
    {
      爻名: "地沢臨 六四",
      通し番号: 114,
      卦番号: 19,
      爻: "六四",
      爻辞: "至臨。无咎。 （しりん。とがなし。） 意味：至り臨む。咎められることはない。",
      現代解釈の要約:
        "私心なく、誠実な態度で物事や人に対応する。その公正な姿勢が評価され、スムーズに事が進み、咎められることがない、安定した状態。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "誠実, 協調性, 信頼",
      親となる卦: "地沢臨",
      キーワードタグ: "信頼, 協調性, 問題なし, 誠実",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者あり",
    },
    {
      爻名: "地沢臨 六五",
      通し番号: 115,
      卦番号: 19,
      爻: "六五",
      爻辞: "知臨。大君之宜。吉。 （ちりん。たいくんのぎ。きち。） 意味：知恵をもって臨む。偉大な君主の徳である。吉。",
      現代解釈の要約:
        "リーダーが、力だけでなく、深い知恵と洞察力をもって組織や人々を導く。その賢明なリーダーシップは、周囲から尊敬され、大きな成功をもたらす。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "賢明なリーダー, 知恵, 徳",
      親となる卦: "地沢臨",
      キーワードタグ: "吉, 徳, 知恵, 賢明なリーダー",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 68.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者あり",
    },
    {
      爻名: "地沢臨 上六",
      通し番号: 116,
      卦番号: 19,
      爻: "上六",
      爻辞: "敦臨。吉无咎。 （とんりん。きちにしてとがなし。） 意味：篤く臨む。吉にして咎められることはない。",
      現代解釈の要約:
        "全てを成し遂げた後も、誠実で手厚い態度で人々と接する。引退した賢者が、後進を温かく見守るような、徳の高い状態。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "寛大, 貢献, メンター",
      親となる卦: "地沢臨",
      キーワードタグ: "メンター, 吉, 問題なし, 寛大, 貢献",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 24.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "風地観 初六",
      通し番号: 117,
      卦番号: 20,
      爻: "初六",
      爻辞: "童観。小人无咎。君子吝。 （どうかん。しょうじんはとがなし。くんしはりん。） 意味：子供のように見る。小人には咎はないが、君子には恥。",
      現代解釈の要約:
        "物事を表面的なレベルでしか見ることができず、本質を理解できない未熟な視点。責任ある立場の者がこの状態にあるのは、恥ずべきこと。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "未熟, 表面的な視点, 視野の狭さ",
      親となる卦: "風地観",
      キーワードタグ: "問題なし, 未熟, 表面的な視点, 視野の狭さ",
      S1_基本スコア: 33.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者なし",
    },
    {
      爻名: "風地観 六二",
      通し番号: 118,
      卦番号: 20,
      爻: "六二",
      爻辞: "闚観。利女貞。 （きかん。じょのていによろし。） 意味：門の隙間から覗き見る。女性が正しくしていれば良い。",
      現代解釈の要約:
        "外部から、あるいは限定された情報源からしか物事を観察できていない状態。全体像を把握できていないため、重要な判断を下すには不十分。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "限定的な視野, 外部からの観察, 情報不足",
      親となる卦: "風地観",
      キーワードタグ: "外部からの観察, 情報不足, 限定的な視野",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 65.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 8.0,
      S7_総合評価スコア: 74.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "風地観 六三",
      通し番号: 119,
      卦番号: 20,
      爻: "六三",
      爻辞: "観我生。進退。 （わがせいをみる。しんたい。） 意味：自分の生き様を見る。進むか退くか。",
      現代解釈の要約:
        "これまでの自分の行動や現在の状況を客観的に見つめ直し、このまま進むべきか、方針転換すべきかの、重大な決断を迫られている自己反省の時。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "自己分析, 内省, 決断の時",
      親となる卦: "風地観",
      キーワードタグ: "内省, 決断の時, 自己分析",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 36.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者あり",
    },
    {
      爻名: "風地観 六四",
      通し番号: 120,
      卦番号: 20,
      爻: "六四",
      爻辞: "観国之光。利用賓于王。 （くにのひかりをみる。おうにひんたるをもちうるによろし。） 意味：その国の光を見る。王の賓客となるのが良い。",
      現代解釈の要約:
        "優れた組織や成功事例（国之光）を観察し、そこから学ぶ段階。その姿勢や能力が認められ、影響力を持つ人物（王）から招かれ、活躍の機会を得る。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "学習, ベンチマーキング, 抜擢",
      親となる卦: "風地観",
      キーワードタグ: "ベンチマーキング, 学習, 抜擢",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 35.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 48.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "風地観 九五",
      通し番号: 121,
      卦番号: 20,
      爻: "九五",
      爻辞: "観我生。君子无咎。 （わがせいをみる。くんしはとがなし。） 意味：（君主が）自らの生き様を見せる。君子であれば咎められない。（※解釈テキストでは「観其生」）",
      現代解釈の要約:
        "リーダーの行動や言動が、常に周囲から厳しく観察されている。公正で模範となる振る舞いを続けることで、衆からの信頼を得て、咎められることがない。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "リーダーシップ, 模範, 透明性",
      親となる卦: "風地観",
      キーワードタグ: "リーダーシップ, 問題なし, 模範, 透明性",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 75.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 78.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者あり",
    },
    {
      爻名: "風地観 上九",
      通し番号: 122,
      卦番号: 20,
      爻: "上九",
      爻辞: "観其生。君子无咎。 （そのせいをみる。くんしはとがなし。） 意味：（己の）生き様を見る。君子であれば咎められない。",
      現代解釈の要約:
        "外的な現象だけでなく、自身の存在意義や人生の目的といった、内面の真実を深く洞察する、最も高次の観察。精神的に成熟し、自己と世界が調和した境地。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "洞察, 精神的成熟, 哲学",
      親となる卦: "風地観",
      キーワードタグ: "哲学, 問題なし, 洞察, 精神的成熟",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "火雷噬嗑 初九",
      通し番号: 123,
      卦番号: 21,
      爻: "初九",
      爻辞: "屨校滅趾。无咎。 （くこうめつし。とがなし。） 意味：足枷で足の指を隠す。咎めはない。",
      現代解釈の要約:
        "問題がまだ小さいうちに、軽い注意や警告で、その芽を摘み取る。早期に正しく対処することで、大きな問題への発展を防ぐ、賢明な一手。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "早期是正, 規律, 未然防止",
      親となる卦: "火雷噬嗑",
      キーワードタグ: "問題なし, 早期是正, 未然防止, 規律",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 48.0,
      論理キーワードタグ: "状況:黎明期, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "火雷噬嗑 六二",
      通し番号: 124,
      卦番号: 21,
      爻: "六二",
      爻辞: "噬膚滅鼻。无咎。 （ぜいふめつび。とがなし。） 意味：皮を噛んで鼻まで傷つける。咎めはない。",
      現代解釈の要約:
        "比較的簡単な問題を解決するが、少しやり方が厳しすぎる。多少の行き過ぎはあっても、問題自体は解決されるため、大きな咎めはない。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "やり過ぎ, 強引, 問題解決",
      親となる卦: "火雷噬嗑",
      キーワードタグ: "やり過ぎ, 問題なし, 問題解決, 強引",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 72.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 24.0,
      S7_総合評価スコア: 58.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "火雷噬嗑 六三",
      通し番号: 125,
      卦番号: 21,
      爻: "六三",
      爻辞: "噬腊肉。遇毒。小吝。无咎。 （ぜいろうにく。どくにあう。しょうりん。とがなし。） 意味：干し肉を噛む。毒に遭う。少し悔いがあるが、咎めはない。",
      現代解釈の要約:
        "複雑で困難な問題に直面し、解決の過程で予期せぬ反発や困難（毒）に遭う。完璧な解決とはいかず、多少の後悔は残るが、何とか乗り切れる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "困難な問題, 抵抗, 忍耐",
      親となる卦: "火雷噬嗑",
      キーワードタグ: "問題なし, 困難な問題, 忍耐, 抵抗",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 20.0,
      S4_リスク: 85.0,
      S5_主体性: "能動",
      S6_変動性スコア: 76.0,
      S7_総合評価スコア: 12.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:移行期, 力学:下剋上リスク, 力学:協力者なし, 心理:内省",
    },
    {
      爻名: "火雷噬嗑 九四",
      通し番号: 126,
      卦番号: 21,
      爻: "九四",
      爻辞: "噬乾胏。得金矢。利艱貞。吉。 （ぜいかんし。きんしをう。かんにしてていなるによろし。きち。） 意味：骨付きの干し肉を噛む。金の矢を得る。困難だが正しくして吉。",
      現代解釈の要約:
        "最も困難で根深い問題に、強力な権限や決定的な手段（金矢）を用いて立ち向かう。正義を貫けば、この最大の難関を突破し、成功を収めることができる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "難関突破, 権威, 決断",
      親となる卦: "火雷噬嗑",
      キーワードタグ: "吉, 権威, 決断, 難関突破",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 60.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:変革期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "火雷噬嗑 六五",
      通し番号: 127,
      卦番号: 21,
      爻: "六五",
      爻辞: "噬乾肉。得黄金。貞厲无咎。 （ぜいかんにく。おうごんをう。ていあやうけれどもとがなし。） 意味：干し肉を噛む。黄金を得る。正しくしていれば危ういが、咎めなし。",
      現代解釈の要約:
        "問題の核心に到達し、それを解決することで、大きな価値（黄金）を得る。成功は目前だが、まだ危険な状況。慎重さを保てば、咎められることはない。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "核心, 成果, 警戒",
      親となる卦: "火雷噬嗑",
      キーワードタグ: "リスクあり, 問題なし, 成果, 核心, 警戒",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 45.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 50.0,
      S5_主体性: "受動",
      S6_変動性スコア: 12.0,
      S7_総合評価スコア: 50.0,
      論理キーワードタグ:
        "状況:絶頂期, 力学:協力者なし, 力学:順当な力関係, 心理:慎重, 心理:正道堅持",
    },
    {
      爻名: "火雷噬嗑 上九",
      通し番号: 128,
      卦番号: 21,
      爻: "上九",
      爻辞: "何校滅耳。凶。 （かこうめつじ。きょう。） 意味：首枷をはめられ、耳まで隠れる。凶。",
      現代解釈の要約:
        "警告を無視し、道理に反した者が、最終的に厳しい裁きを受ける。もはや弁明の余地もなく、完全に孤立し、破滅する、最悪の結末。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "懲罰, 破滅, 孤立",
      親となる卦: "火雷噬嗑",
      キーワードタグ: "凶, 孤立, 懲罰, 破滅",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 75.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 18.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "山火賁 初九",
      通し番号: 129,
      卦番号: 22,
      爻: "初九",
      爻辞: "賁其趾。舎車而徒。 （そのしをかざる。くるまをすててとす。） 意味：その足元を飾る。車を捨てて徒歩で行く。",
      現代解釈の要約:
        "新しいことの始まり。派手な手段（車）に頼らず、まずは足元（基礎）を固め、地道な努力（徒歩）から始める。その誠実な姿勢が、咎めなき良いスタートを切らせる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "基礎固め, 謙虚, 誠実",
      親となる卦: "山火賁",
      キーワードタグ: "基礎固め, 誠実, 謙虚",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 68.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ: "状況:黎明期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "山火賁 六二",
      通し番号: 130,
      卦番号: 22,
      爻: "六二",
      爻辞: "賁其鬚。 （そのしゅをかざる。） 意味：そのヒゲを飾る。",
      現代解釈の要約:
        "自分の功績を主張せず、上位者（あご）を引き立てる補佐役（ヒゲ）に徹する。全体の調和を重んじる、従順で正しい在り方。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "補佐役, 協調性, 縁の下の力持ち",
      親となる卦: "山火賁",
      キーワードタグ: "協調性, 縁の下の力持ち, 補佐役",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 54.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者なし",
    },
    {
      爻名: "山火賁 九三",
      通し番号: 131,
      卦番号: 22,
      爻: "九三",
      爻辞: "賁如濡如。永貞吉。 （ひじょじゅじょ。えいていきち。） 意味：飾りが濡れているようだ。永遠に正しければ吉。",
      現代解釈の要約:
        "見せかけの華やかさに溺れ、実質が伴わない危うい状態。しかし、その中でも誠実さや正しい道（永貞）を保ち続ければ、最終的には吉となる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "虚飾, 見せかけ, 本質の維持",
      親となる卦: "山火賁",
      キーワードタグ: "吉, 本質の維持, 虚飾, 見せかけ",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 28.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ:
        "状況:移行期, 力学:協力者あり, 力学:順当な力関係, 心理:正道堅持",
    },
    {
      爻名: "山火賁 六四",
      通し番号: 132,
      卦番号: 22,
      爻: "六四",
      爻辞: "賁如皤如。白馬翰如。匪寇婚媾。 （ひじょはくじょ。はくばかんじょ。こうにあらずこんこう。） 意味：飾りが白く質素。白馬が飛ぶように来る。賊ではなく、縁組である。",
      現代解釈の要約:
        "派手な装飾を捨て、質素で誠実な態度（白賁）で臨む。その純粋さが、疑いを晴らし、真の協力者（婚媾）を引き寄せる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "シンプル, 誠実, 信頼",
      親となる卦: "山火賁",
      キーワードタグ: "シンプル, 信頼, 誠実",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 28.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 84.0,
      S7_総合評価スコア: 24.0,
      論理キーワードタグ: "状況:変革期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "山火賁 六五",
      通し番号: 133,
      卦番号: 22,
      爻: "六五",
      爻辞: "賁于丘園。束帛戔戔。吝。終吉。 （きゅうえんにかざる。そくはくせんせん。りん。おわりにきち。） 意味：丘や庭園で飾る。贈り物の絹はわずか。恥ずかしいが、最終的には吉。",
      現代解釈の要約:
        "物質的な豊かさ（束帛）よりも、精神的な豊かさや、賢者との交流（丘園）を重んじる。見栄を捨て、本質を追求することで、最終的に大きな幸運を得る。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "質素, 精神的豊かさ, 本質主義",
      親となる卦: "山火賁",
      キーワードタグ: "吉, 本質主義, 精神的豊かさ, 質素",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 45.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 24.0,
      S7_総合評価スコア: 52.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "山火賁 上九",
      通し番号: 134,
      卦番号: 22,
      爻: "上九",
      爻辞: "白賁。无咎。 （はくひ。とがなし。） 意味：白く飾る（飾らない）。咎められることはない。",
      現代解釈の要約:
        "全ての飾りを削ぎ落とし、本質そのもので勝負する、飾りの究極の形。内面の徳や実力が完成されており、もはや飾りを必要としない、最高の状態。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "完成, 本質, シンプル, 洗練",
      親となる卦: "山火賁",
      キーワードタグ: "シンプル, 問題なし, 完成, 本質, 洗練",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "山地剝 初六",
      通し番号: 135,
      卦番号: 23,
      爻: "初六",
      爻辞: "剝牀以足。蔑貞凶。 （はくしょういそく。ていをめっすればきょう。） 意味：寝台の足元が剥がれる。正しくても凶。",
      現代解釈の要約:
        "衰退の始まり。組織やシステムの土台から、問題が生じ始めている。この流れに逆らって正論を主張しても、聞き入れられず、事態は悪化する。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "衰退の始まり, 崩壊の兆し, 基礎の揺らぎ",
      親となる卦: "山地剝",
      キーワードタグ: "凶, 基礎の揺らぎ, 崩壊の兆し, 衰退の始まり",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 40.0,
      S7_総合評価スコア: 28.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者なし, 心理:正道堅持",
    },
    {
      爻名: "山地剝 六二",
      通し番号: 136,
      卦番号: 23,
      爻: "六二",
      爻辞: "剝牀以辨。蔑貞凶。 （はくしょういべん。ていをめっすればきょう。） 意味：寝台の縁まで剥がれる。正しくても凶。",
      現代解釈の要約:
        "問題がさらに進行し、より明確に表面化してくる。状況はさらに悪化しており、正しい行動を取ろうとしても、結果に繋がりにくい、厳しい状態。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "問題の進行, 悪化, 危機",
      親となる卦: "山地剝",
      キーワードタグ: "凶, 危機, 問題の進行, 悪化",
      S1_基本スコア: 33.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 46.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者なし, 心理:正道堅持",
    },
    {
      爻名: "山地剝 六三",
      通し番号: 137,
      卦番号: 23,
      爻: "六三",
      爻辞: "剝之无咎。 （これをはくす。とがなし。） 意味：（自ら）剥がれ去る。咎められることはない。",
      現代解釈の要約:
        "状況の悪化が避けられないと悟り、抵抗するのをやめ、自らその状況や組織から身を引く。賢明な撤退であり、これ以上の咎めを免れる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "撤退, 距離を置く, 損失回避",
      親となる卦: "山地剝",
      キーワードタグ: "問題なし, 損失回避, 撤退, 距離を置く",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 36.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者あり",
    },
    {
      爻名: "山地剝 六四",
      通し番号: 138,
      卦番号: 23,
      爻: "六四",
      爻辞: "剝牀以膚。凶。 （はくしょういふ。きょう。） 意味：寝台の表面（皮）まで剥がれる。凶。",
      現代解釈の要約:
        "問題が、もはや隠し通せない核心部分にまで及び、危機が目前に迫っている。地位や財産など、自身にとって極めて重要なものを失う、非常に危険な状況。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "危機的状況, 深刻化, 痛みを伴う損失",
      親となる卦: "山地剝",
      キーワードタグ: "凶, 危機的状況, 深刻化, 痛みを伴う損失",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者なし",
    },
    {
      爻名: "山地剝 六五",
      通し番号: 139,
      卦番号: 23,
      爻: "六五",
      爻辞: "貫魚。以宮人寵。无不利。 （うおをつらぬく。きゅうじんのちょうをもってす。ふりなきなし。） 意味：魚が連なるように（衆を率いる）。宮人が寵愛を受けるように。不利なことはない。",
      現代解釈の要約:
        "崩壊寸前の状況下で、唯一残った陽のリーダーが、残された人々（陰）を巧みに統率し、秩序を保つ。その賢明なリーダーシップにより、最悪の事態を回避する。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "リーダーシップ, 危機管理, 結束",
      親となる卦: "山地剝",
      キーワードタグ: "リーダーシップ, 危機管理, 結束",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 24.0,
      S7_総合評価スコア: 60.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "山地剝 上九",
      通し番号: 140,
      卦番号: 23,
      爻: "上九",
      爻辞: "碩果不食。君子得輿。小人剝廬。 （せきかしょくせず。くんしはよをう。しょうじんはろをはくす。） 意味：大きな果実が残される。君子は輿を得る。小人は家を失う。",
      現代解釈の要約:
        "全てが剥がれ落ちた後、次世代への希望の種（碩果）だけが残る。正しく耐え抜いた賢者（君子）は人々の支持を得て再生し、悪しき者（小人）は全てを失う。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "再生, 希望, 新たな始まり, 因果応報",
      親となる卦: "山地剝",
      キーワードタグ: "再生, 因果応報, 希望, 新たな始まり",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "地雷復 初九",
      通し番号: 141,
      卦番号: 24,
      爻: "初九",
      爻辞: "不遠復。无祇悔。元吉。 （とおからずかえる。くいにいたるなし。げんきち。） 意味：遠くに行かないうちに引き返す。悔いることはない。大いに吉。",
      現代解釈の要約:
        "過ちに気づき、問題がまだ小さいうちに、すぐに正しい道へと引き返す。その迅速な軌道修正は、最高の幸運を招き、悔いを残さない。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "早期修正, 軌道修正, 原点回帰",
      親となる卦: "地雷復",
      キーワードタグ: "原点回帰, 吉, 早期修正, 軌道修正",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ:
        "状況:黎明期, 力学:下剋上リスク, 力学:協力者あり, 心理:内省",
    },
    {
      爻名: "地雷復 六二",
      通し番号: 142,
      卦番号: 24,
      爻: "六二",
      爻辞: "休復。吉。 （きゅうふく。きち。） 意味：安らかに回復する。吉。",
      現代解釈の要約:
        "周囲の善良な人々（初九の陽爻）に導かれ、無理せず、穏やかに正しい道へと回復していく。周囲との調和の中で、安らかに立ち直れる吉の時。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "穏やかな回復, 協力, 支援",
      親となる卦: "地雷復",
      キーワードタグ: "協力, 吉, 支援, 穏やかな回復",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 54.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者なし",
    },
    {
      爻名: "地雷復 六三",
      通し番号: 143,
      卦番号: 24,
      爻: "六三",
      爻辞: "頻復。厲无咎。 （ひんぷく。あやうけれどとがなし。） 意味：繰り返し回復する。危ういが咎められることはない。",
      現代解釈の要約:
        "悪癖や間違いを直そうとするが、何度も挫折を繰り返してしまう。不安定で危うい状況だが、それでも回復しようと努力し続ける限り、大きな咎めはない。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "不安定, 挫折, 粘り強さ",
      親となる卦: "地雷復",
      キーワードタグ: "リスクあり, 不安定, 問題なし, 挫折, 粘り強さ",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 70.0,
      S5_主体性: "受動",
      S6_変動性スコア: 60.0,
      S7_総合評価スコア: 14.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者なし",
    },
    {
      爻名: "地雷復 六四",
      通し番号: 144,
      卦番号: 24,
      爻: "六四",
      爻辞: "中行独復。 （ちゅうこうどくふく。） 意味：（周りから離れ）中道を行き、一人で回復する。",
      現代解釈の要約:
        "周囲がまだ過ちの中にいても、それに流されず、ただ一人、正しい道に戻ろうと努力する。孤独だが、その信念に基づいた行動は尊い。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "孤独な努力, 信念, 自律",
      親となる卦: "地雷復",
      キーワードタグ: "信念, 孤独な努力, 自律",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者あり",
    },
    {
      爻名: "地雷復 六五",
      通し番号: 145,
      卦番号: 24,
      爻: "六五",
      爻辞: "敦復。无悔。 （とんぷく。くいなし。） 意味：篤く回復する。悔やむことはない。",
      現代解釈の要約:
        "表面的な改善ではなく、心から深く反省し、誠実に、そして根本的に自己を改める。その篤い姿勢が、一切の悔いを残さない、完璧な回復をもたらす。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "誠実な反省, 根本的改善, 信頼回復",
      親となる卦: "地雷復",
      キーワードタグ: "信頼回復, 根本的改善, 誠実な反省",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 45.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 48.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者なし, 心理:内省",
    },
    {
      爻名: "地雷復 上六",
      通し番号: 146,
      卦番号: 24,
      爻: "上六",
      爻辞: "迷復。凶。…十年不克征。 （めいふく。きょう。…じゅうねんかつことあたわず。） 意味：回復に迷う。凶。…十年も征伐に勝てない。",
      現代解釈の要約:
        "回復すべきチャンスがあったにもかかわらず、迷い、過ちを改めなかった者の末路。状況はさらに悪化し、長期にわたって再起不能なほどの、深刻な災いを招く。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "機会損失, 破滅, 長期停滞",
      親となる卦: "地雷復",
      キーワードタグ: "凶, 機会損失, 破滅, 長期停滞",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 75.0,
      S5_主体性: "能動",
      S6_変動性スコア: 68.0,
      S7_総合評価スコア: 16.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "天雷无妄 初九",
      通し番号: 147,
      卦番号: 25,
      爻: "初九",
      爻辞: "无妄行。吉。 （むもうにしてゆく。きち。） 意味：偽りなく行動する。吉。",
      現代解釈の要約:
        "物事の始まりにおいて、私心や邪念なく、純粋で誠実な心で行動する。その正しい出発は、自ずと良い結果を引き寄せる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "純粋, 誠実, 始まり",
      親となる卦: "天雷无妄",
      キーワードタグ: "吉, 始まり, 純粋, 誠実",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 62.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者あり",
    },
    {
      爻名: "天雷无妄 六二",
      通し番号: 148,
      卦番号: 25,
      爻: "六二",
      爻辞: "不耕獲。不菑畬。則利有攸往。 （たがやさずしてえず。さいせずしてよならず。すなわちゆくところあるによろし。） 意味：耕さずに収穫せず、開墾せずに畑にしない。そうすれば進むのに利がある。",
      現代解釈の要約:
        "結果を焦り、労力に見合わない成果を求めない。自然の摂理に従い、地道な努力を積み重ねる。その分相応な姿勢が、着実な成功に繋がる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "自然体, 無欲, 分相応",
      親となる卦: "天雷无妄",
      キーワードタグ: "分相応, 無欲, 自然体",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 80.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 76.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者あり",
    },
    {
      爻名: "天雷无妄 六三",
      通し番号: 149,
      卦番号: 25,
      爻: "六三",
      爻辞: "无妄之災。或繫之牛。行人之得。邑人之災。 （むもうのさい。あるいはこれをつなぐうし。こうじんのうる。ゆうじんのわざわい。） 意味：予期せぬ災難。繋いでいた牛を旅人が連れ去り、村人が災難に遭う。",
      現代解釈の要約:
        "自分に非がないにもかかわらず、予期せぬトラブルや災難に巻き込まれる。理不尽な状況に直面し、損失を被る、避けがたい不運。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "予期せぬ災難, 理不尽, 巻き込まれ",
      親となる卦: "天雷无妄",
      キーワードタグ: "予期せぬ災難, 巻き込まれ, 理不尽",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 20.0,
      S4_リスク: 75.0,
      S5_主体性: "能動",
      S6_変動性スコア: 76.0,
      S7_総合評価スコア: 16.0,
      論理キーワードタグ: "状況:移行期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "天雷无妄 九四",
      通し番号: 150,
      卦番号: 25,
      爻: "九四",
      爻辞: "可貞。无咎。 （ていにすべし。とがなし。） 意味：正しくしていればよい。咎められることはない。",
      現代解釈の要約:
        "予期せぬ災難や困難な状況に直面しても、動揺せず、自身の倫理観や原則を固く守り続ける。その誠実な姿勢が、最終的に咎めを免れさせる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "忍耐, 信念, 誠実",
      親となる卦: "天雷无妄",
      キーワードタグ: "信念, 問題なし, 忍耐, 誠実",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:変革期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "天雷无妄 九五",
      通し番号: 151,
      卦番号: 25,
      爻: "九五",
      爻辞: "无妄之疾。勿薬有喜。 （むもうのやまい。くすりをもちうるなかれよろこびあり。） 意味：予期せぬ病。薬を用いなくても喜びがある。",
      現代解釈の要約:
        "根拠のない批判や疑いをかけられる（予期せぬ病）。しかし、焦って弁解（薬）せず、自然に任せていれば、やがて真実が明らかになり、喜びが訪れる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "静観, 自然な解決, 信頼",
      親となる卦: "天雷无妄",
      キーワードタグ: "信頼, 自然な解決, 静観",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 12.0,
      S7_総合評価スコア: 72.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "天雷无妄 上九",
      通し番号: 152,
      卦番号: 25,
      爻: "上九",
      爻辞: "无妄行。有眚。无攸利。 （むもうにしてゆく。わざわいあり。りするところなし。） 意味：偽りなく行動するが（度を越す）。災いがある。利益はない。",
      現代解釈の要約:
        "自分の行動が正しいと信じ込むあまり、状況を顧みず、度を越した行動に出てしまう。善意から出た行動であっても、やり過ぎはかえって災難を招く。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "行き過ぎ, 軽率, 無謀",
      親となる卦: "天雷无妄",
      キーワードタグ: "無謀, 行き過ぎ, 軽率",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 68.0,
      S7_総合評価スコア: 30.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "山天大畜 初九",
      通し番号: 153,
      卦番号: 26,
      爻: "初九",
      爻辞: "有厲。利已。 （あやうきあり。やむによろし。） 意味：危険がある。止まるのが良い。（※ご提示の解釈テキストと異なるため古典解釈を優先）",
      現代解釈の要約:
        "力を蓄え始める初期段階。まだ前進するには危険が伴うため、無理に行動せず、その場で止まり、状況を見極めるべき時。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "待機, 抑制, 危険回避",
      親となる卦: "山天大畜",
      キーワードタグ: "リスクあり, 危険回避, 待機, 抑制",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 70.0,
      S5_主体性: "能動",
      S6_変動性スコア: 68.0,
      S7_総合評価スコア: 30.0,
      論理キーワードタグ: "状況:黎明期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "山天大畜 九二",
      通し番号: 154,
      卦番号: 26,
      爻: "九二",
      爻辞: "輿説輹。 （よだつふく。） 意味：車の車軸が外れる。",
      現代解釈の要約:
        "力を蓄えるプロセスに、内部的な問題や対立が生じ、計画が頓挫しかけている状態。このままでは、せっかくの蓄積が無駄になる危険性がある。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "停滞, 機能不全, 障害",
      親となる卦: "山天大畜",
      キーワードタグ: "停滞, 機能不全, 障害",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 70.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者あり",
    },
    {
      爻名: "山天大畜 九三",
      通し番号: 155,
      卦番号: 26,
      爻: "九三",
      爻辞: "良馬逐。利艱貞。…利有攸往。 （りょうばおう。かんにしてていなるによろし。…ゆくところあるによろし。） 意味：良い馬が互いに追いかける。困難だが正しければ良い。…行くところに利益がある。",
      現代解釈の要約:
        "蓄えた力が発揮され始め、良い競争相手と共に成長していく。困難は伴うが、正しい姿勢で臨めば、大きな目標に向かって前進できる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "才能開花, 前進, 訓練",
      親となる卦: "山天大畜",
      キーワードタグ: "前進, 才能開花, 訓練",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 28.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:移行期, 力学:協力者あり, 力学:順当な力関係, 心理:正道堅持",
    },
    {
      爻名: "山天大畜 六四",
      通し番号: 156,
      卦番号: 26,
      爻: "六四",
      爻辞: "童牛之牿。元吉。 （どうぎゅうのこく。げんきち。） 意味：若い牛に角をはめて、人を傷つけないようにする。大いに吉。",
      現代解釈の要約:
        "未熟だが強力な才能や力が暴走しないよう、適切な指導や制約を与える。その賢明なリスクマネジメントが、将来の大きな成功を保証する。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "教育, 育成, リスク管理",
      親となる卦: "山天大畜",
      キーワードタグ: "リスク管理, 吉, 教育, 育成",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者なし",
    },
    {
      爻名: "山天大畜 六五",
      通し番号: 157,
      卦番号: 26,
      爻: "六五",
      爻辞: "豶豕之牙。吉。 （ふんしのきば。きち。） 意味：牙を抜かれた豚。吉。",
      現代解釈の要約:
        "危険で強力な力（牙のある豚）を、その危険性を取り除くことで、安全で有益な力へと変える。困難な要素を巧みにコントロールし、味方につける。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "制御, 問題解決, 無力化",
      親となる卦: "山天大畜",
      キーワードタグ: "制御, 吉, 問題解決, 無力化",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 75.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 78.0,
      論理キーワードタグ: "状況:困窮状態, 状況:絶頂期, 力学:協力者あり",
    },
    {
      爻名: "山天大畜 上九",
      通し番号: 158,
      卦番号: 26,
      爻: "上九",
      爻辞: "何天之衢。亨。 （てんのきをいかんぞする。とおる。） 意味：天の道を遮るものが何もない。願いが亨る。",
      現代解釈の要約:
        "長い蓄積の期間が終わり、その力が完全に解放される時。もはや何の障害もなく、物事はスムーズに進み、大いなる成功を収める。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "完成, 成功, 解放, 繁栄",
      親となる卦: "山天大畜",
      キーワードタグ: "完成, 成功, 繁栄, 解放",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 65.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 46.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "山雷頤 初九",
      通し番号: 159,
      卦番号: 27,
      爻: "初九",
      爻辞: "舎爾霊亀。観我朶頤。凶。 （じのれいきをすて、わがたいをみる。きょう。） 意味：自分の霊亀を捨て、私が口を動かすのを見る。凶。",
      現代解釈の要約:
        "自身の内なる才能や本質（霊亀）を磨くことを放棄し、他人の成功や魅力を、ただ羨んでいる状態。自立心を失った依存的な姿勢は、破滅を招く。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "依存, 嫉妬, 本質軽視",
      親となる卦: "山雷頤",
      キーワードタグ: "依存, 凶, 嫉妬, 本質軽視",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 68.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ: "状況:黎明期, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "山雷頤 六二",
      通し番号: 160,
      卦番号: 27,
      爻: "六二",
      爻辞: "顛頤。拂経于丘。頤征凶。 （てんい。けいをかにおく。いせいきょう。） 意味：逆さまに養う。丘に背き、養いを求めに行けば凶。",
      現代解釈の要約:
        "基本や原則から外れた、不適切な方法で自らを養おうとする。栄養の偏った食事や、質の悪い情報摂取など、間違った努力はかえって害となる。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "間違った方法, 原則違反, 努力の無駄",
      親となる卦: "山雷頤",
      キーワードタグ: "凶, 努力の無駄, 原則違反, 間違った方法",
      S1_基本スコア: 33.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 46.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者なし",
    },
    {
      爻名: "山雷頤 六三",
      通し番号: 161,
      卦番号: 27,
      爻: "六三",
      爻辞: "弗頤。貞凶。十年勿用。无攸利。 （ふつい。ていはきょう。じゅうねんもちうるなかれ。りするところなし。） 意味：養わない。正しくても凶。十年も役に立たない。利益はない。",
      現代解釈の要約:
        "自分を養う努力そのものを放棄し、自堕落な状態に陥る。その頑固な姿勢を続ければ、長期的に見て致命的な結果を招く。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "怠惰, 自堕落, 長期停滞",
      親となる卦: "山雷頤",
      キーワードタグ: "凶, 怠惰, 自堕落, 長期停滞",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 65.0,
      S5_主体性: "受動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ:
        "状況:移行期, 力学:協力者あり, アクション:現状維持, 心理:正道堅持",
    },
    {
      爻名: "山雷頤 六四",
      通し番号: 162,
      卦番号: 27,
      爻: "六四",
      爻辞: "顛頤。吉。虎視眈眈。其欲逐逐。无咎。 （てんい。きち。こしたんたん。そのよくちくちく。とがなし。） 意味：逆さまに養う。吉。虎のように鋭く見て、その欲求が止まらない。咎めなし。",
      現代解釈の要約:
        "下位者が、上位者から知識や支援を、貪欲なまでに求め、吸収する。その強い学習意欲と正しい師を選ぶ姿勢が、大きな成長をもたらす。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "探求心, 貪欲な学習, メンター",
      親となる卦: "山雷頤",
      キーワードタグ: "メンター, 吉, 問題なし, 探求心, 貪欲な学習",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ: "状況:変革期, 状況:組織戦, 力学:協力者あり",
    },
    {
      爻名: "山雷頤 六五",
      通し番号: 163,
      卦番号: 27,
      爻: "六五",
      爻辞: "拂経。居貞吉。不可渉大川。 （けいにそむく。ていにいればきち。たいせんをわたるべからず。） 意味：常道に反するが、正しくしていれば吉。大河は渡れない。",
      現代解釈の要約:
        "困難な状況で、大きな挑戦（大河を渡る）は避けるべき時。無理に行動せず、自分の基本原則を守り、内面を養うことに集中すれば、安定を保てる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "守り, 内面の充実, 待機",
      親となる卦: "山雷頤",
      キーワードタグ: "内面の充実, 吉, 守り, 待機",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 45.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 12.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:絶頂期, 力学:協力者なし, 力学:順当な力関係, 心理:正道堅持",
    },
    {
      爻名: "山雷頤 上九",
      通し番号: 164,
      卦番号: 27,
      爻: "上九",
      爻辞: "由頤。厲吉。大君之由也。 （いによる。あやうけれどきち。たいくんのよるところなり。） 意味：（最高の）養いを行う。危ういが吉。偉大な君主のあり方だ。",
      現代解釈の要約:
        "自己の利益を超え、社会全体を養い、貢献する、高潔なリーダーの姿。その道は多くの困難や犠牲（厲）を伴うが、最高の価値を生み出す。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "社会貢献, リーダーシップ, 自己犠牲",
      親となる卦: "山雷頤",
      キーワードタグ: "リスクあり, リーダーシップ, 吉, 社会貢献, 自己犠牲",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 60.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 36.0,
      論理キーワードタグ: "状況:困窮状態, 状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "澤風大過 初六",
      通し番号: 165,
      卦番号: 28,
      爻: "初六",
      爻辞: "藉用白茅。无咎。 （はくぼうをもちいてしく。とがなし。） 意味：白い茅を敷いて物を置く。咎めはない。",
      現代解釈の要約:
        "危機や異常事態の初期段階。軽率な行動を絶対的に避け、極めて慎重に、そして厳粛な態度で準備を進める。その姿勢であれば、咎めは生じない。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "慎重, 準備, 危機管理",
      親となる卦: "澤風大過",
      キーワードタグ: "危機管理, 問題なし, 慎重, 準備",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ:
        "状況:黎明期, 力学:協力者あり, 力学:順当な力関係, アクション:準備, 心理:慎重",
    },
    {
      爻名: "澤風大過 九二",
      通し番号: 166,
      卦番号: 28,
      爻: "九二",
      爻辞: "枯楊生稊。老夫得其女妻。无不利。 （こようていをしょうず。ろうふそのじょきょうをう。ふりなきなし。） 意味：枯れたヤナギに芽が出る。老いた男が若い妻を得る。不利なことはない。",
      現代解釈の要約:
        "絶望的な状況から、奇跡的に再生の兆しが見える。常識では考えられないような、異質なものの結合が、意外な活力を生み出し、事態を好転させる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "再生, 希望, 奇跡",
      親となる卦: "澤風大過",
      キーワードタグ: "再生, 奇跡, 希望",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 65.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 60.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者なし",
    },
    {
      爻名: "澤風大過 九三",
      通し番号: 167,
      卦番号: 28,
      爻: "九三",
      爻辞: "棟撓。凶。 （とうぎょう。きょう。） 意味：棟木がたわむ。凶。",
      現代解釈の要約:
        "組織やプロジェクトの構造的な欠陥が露呈し、全体が重みに耐えきれず、崩壊寸前となっている状態。根本的な対策を講じなければ、破綻は免れない。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "崩壊寸前, 構造的欠陥, 限界",
      親となる卦: "澤風大過",
      キーワードタグ: "凶, 崩壊寸前, 構造的欠陥, 限界",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 38.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者あり",
    },
    {
      爻名: "澤風大過 九四",
      通し番号: 168,
      卦番号: 28,
      爻: "九四",
      爻辞: "棟隆。吉。有他。吝。 （とうりゅう。きち。たあればりん。） 意味：棟木が盛り上がる。吉。他に頼れば恥。",
      現代解釈の要約:
        "組織の危機に対し、中心的なリーダーがその重責に耐え、自力で状況を立て直そうと奮闘する。その責任感と粘り強さが、良い結果を生む。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "奮闘, 危機対応, 責任感",
      親となる卦: "澤風大過",
      キーワードタグ: "危機対応, 吉, 奮闘, 責任感",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 54.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者あり",
    },
    {
      爻名: "澤風大過 九五",
      通し番号: 169,
      卦番号: 28,
      爻: "九五",
      爻辞: "枯楊生華。老婦得其士夫。无咎无誉。 （こようはなをしょうず。ろうふそのしふをう。むきゅうむよ。） 意味：枯れたヤナギに花が咲く。老いた女性が若い夫を得る。咎も誉もない。",
      現代解釈の要約:
        "衰退の極みから、奇跡的とも言えるような新しい価値や才能（華）が生まれる。常識を覆すその変化は、まだ世間には理解されにくいが、咎められることはない。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "奇跡的再生, 常識外, 変化",
      親となる卦: "澤風大過",
      キーワードタグ: "問題なし, 変化, 奇跡的再生, 常識外",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 48.0,
      論理キーワードタグ: "状況:絶頂期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "澤風大過 上六",
      通し番号: 170,
      卦番号: 28,
      爻: "上六",
      爻辞: "過渉滅頂。凶。无咎。 （かせつめっちょう。きょう。とがなし。） 意味：無理に川を渡って頭まで水に浸かる。凶。しかし咎めはない。",
      現代解釈の要約:
        "危機的状況を救うため、自らの破滅を覚悟の上で、無謀な自己犠牲的行動に出る。個人としては凶だが、その行動が高潔な目的のためであれば、非難されることはない。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "自己犠牲, 無謀, 破滅, 殉職",
      親となる卦: "澤風大過",
      キーワードタグ: "凶, 問題なし, 殉職, 無謀, 破滅, 自己犠牲",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 65.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "坎為水 初六",
      通し番号: 171,
      卦番号: 29,
      爻: "初六",
      爻辞: "習坎。入于坎窞。凶。 （しゅうかん。かんたんにいる。きょう。） 意味：困難を習う。陥穽の底に入り込む。凶。",
      現代解釈の要約:
        "困難の始まり。経験不足や情報不足から、問題の深みにはまりやすい。軽率な行動は、さらに状況を悪化させ、深刻な事態を招く。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "困難の始まり, 経験不足, 泥沼",
      親となる卦: "坎為水",
      キーワードタグ: "凶, 困難の始まり, 泥沼, 経験不足",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:黎明期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "坎為水 九二",
      通し番号: 172,
      卦番号: 29,
      爻: "九二",
      爻辞: "坎有険。求小得。 （かんにけんあり。すこしうるをもとむ。） 意味：困難の中に険しさがある。少しの利益を求める。",
      現代解釈の要約:
        "困難の渦中にあり、完全な解決は望めない。高望みせず、一時的な回避や、達成可能な小さな成果を得ることに集中し、なんとか状況を凌ぐべき時。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "生存戦略, 現実的目標, 一時しのぎ",
      親となる卦: "坎為水",
      キーワードタグ: "一時しのぎ, 現実的目標, 生存戦略",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 65.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 46.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:安定期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "坎為水 六三",
      通し番号: 173,
      卦番号: 29,
      爻: "六三",
      爻辞: "来之坎坎。険且枕。入于坎窞。勿用。 （らいしかんかん。けんかつまくらす。かんたんにいる。もちうるなかれ。） 意味：来るのも行くのも困難。険しく、しかも枕となる。陥穽の底に入る。用いるな。",
      現代解釈の要約:
        "困難が次々と押し寄せ、進むも退くもできない八方塞がりの状態。心身ともに疲弊し、下手に動くとさらに深みにはまるため、行動を停止すべき。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "進退両難, 八方塞がり, 停滞",
      親となる卦: "坎為水",
      キーワードタグ: "停滞, 八方塞がり, 進退両難",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 20.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:移行期, 力学:協力者なし, アクション:現状維持",
    },
    {
      爻名: "坎為水 六四",
      通し番号: 174,
      卦番号: 29,
      爻: "六四",
      爻辞: "樽酒簋貳。用缶。納約自牖。终无咎。 （そんしゅきい。かんをもちう。やくをまどよりいる。おわりにとがなし。） 意味：酒樽と二杯の穀物。粗末な器を用いる。窓から約束を受け入れる。最終的に咎めなし。",
      現代解釈の要約:
        "困難な状況下で、見栄や形式を捨て、質素でも誠実な交流を通じて信頼関係を築く。その真心が、やがて危機を乗り越える助けとなる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "誠実, 信頼関係, コミュニケーション",
      親となる卦: "坎為水",
      キーワードタグ: "コミュニケーション, 信頼関係, 問題なし, 誠実",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:変革期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "坎為水 九五",
      通し番号: 175,
      卦番号: 29,
      爻: "九五",
      爻辞: "坎不盈。祇既平。无咎。 （かんいまだみず。もとすでにたいらかなり。とがなし。） 意味：困難が満ちない。満ちたと思ったが、すでに平らになっている。咎めなし。",
      現代解釈の要約:
        "最も深い困難の段階を乗り越え、状況が回復に向かい始める。最悪の事態は脱し、希望の光が見えてくるが、まだ油断はできない。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "危機脱出, 回復の兆し, 安定化",
      親となる卦: "坎為水",
      キーワードタグ: "危機脱出, 問題なし, 回復の兆し, 安定化",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 48.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:絶頂期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "坎為水 上六",
      通し番号: 176,
      卦番号: 29,
      爻: "上六",
      爻辞: "係用徽纆。置于叢棘。三歳不得。凶。 （けいようきばく。そうきょくにおく。さんさいえず。きょう。） 意味：太い縄で縛り、いばらの茂みに置く。三年間も出られない。凶。",
      現代解釈の要約:
        "困難から抜け出す機会を逃し、あるいは過ちを改めなかった結果、完全に行き詰まる。長期にわたって身動きが取れず、再起不能なほどの苦境に陥る。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "孤立, 拘束, 長期停滞",
      親となる卦: "坎為水",
      キーワードタグ: "凶, 孤立, 拘束, 長期停滞",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 75.0,
      S5_主体性: "受動",
      S6_変動性スコア: 68.0,
      S7_総合評価スコア: 16.0,
      論理キーワードタグ: "状況:困窮状態, 状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "離為火 初九",
      通し番号: 177,
      卦番号: 30,
      爻: "初九",
      爻辞: "履錯然。敬之。无咎。 （りさくぜん。これをけいす。とがなし。） 意味：足元が乱れている。慎重にすれば咎めはない。",
      現代解釈の要約:
        "新しい活動の始まり。まだ足元が固まっておらず、状況が錯綜している。焦って派手に動かず、謙虚さと敬意をもって慎重に進めば、問題は避けられる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "混乱, 慎重, 始まり",
      親となる卦: "離為火",
      キーワードタグ: "問題なし, 始まり, 慎重, 混乱",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 68.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ:
        "状況:黎明期, 力学:下剋上リスク, 力学:協力者なし, 心理:慎重, 心理:謙虚",
    },
    {
      爻名: "離為火 六二",
      通し番号: 178,
      卦番号: 30,
      爻: "六二",
      爻辞: "黄離。元吉。 （こうり。げんきち。） 意味：黄色い輝き。大いに吉。",
      現代解釈の要約:
        "派手さや過剰さに走らず、中庸で、内実の伴った輝きを放っている。その誠実さや安定感が、最高の幸運を引き寄せる、理想的な状態。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "中庸, 安定, 質実剛健",
      親となる卦: "離為火",
      キーワードタグ: "中庸, 吉, 安定, 質実剛健",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 72.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 24.0,
      S7_総合評価スコア: 58.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "離為火 九三",
      通し番号: 179,
      卦番号: 30,
      爻: "九三",
      爻辞: "日昃之離。不鼓缶而歌。則大耋之嗟。凶。 （じっそくのり。ふをたたきてうたわざれば、すなわちだいてつのなげきあらん。きょう。） 意味：日が傾いた時の輝き。缶を叩き歌わなければ、老人の嘆きとなる。凶。",
      現代解釈の要約:
        "成功の絶頂期を過ぎ、衰退の兆しが見え始めた状態。現状に満足して活気を維持する努力を怠ると、後悔先に立たず、破滅的な状況を招く。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "衰退, 慢心, 危機意識の欠如",
      親となる卦: "離為火",
      キーワードタグ: "凶, 危機意識の欠如, 慢心, 衰退",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 75.0,
      S5_主体性: "能動",
      S6_変動性スコア: 60.0,
      S7_総合評価スコア: 22.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者なし, 心理:内省",
    },
    {
      爻名: "離為火 九四",
      通し番号: 180,
      卦番号: 30,
      爻: "九四",
      爻辞: "突如其来如。焚如死如棄如。 （とつじょそのきたるじょ。ふんじょしじょきじょ。） 意味：突然やって来る。燃えるように、死ぬように、捨てられるように。",
      現代解釈の要約:
        "予期せぬトラブルや不祥事、急な環境変化など、突発的で、抵抗しようのない災難に直面する。全てが燃え尽きるかのような、極めて危険な状況。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "突発的な災難, 破壊, 危機",
      親となる卦: "離為火",
      キーワードタグ: "危機, 破壊, 突発的な災難",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 28.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 72.0,
      S7_総合評価スコア: 28.0,
      論理キーワードタグ: "状況:変革期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "離為火 六五",
      通し番号: 181,
      卦番号: 30,
      爻: "六五",
      爻辞: "出涕沱若。戚嗟若。吉。 （しゅつていたじゃく。せきさじゃく。きち。） 意味：涙がとめどなく流れ、悲しみ嘆く。吉。",
      現代解釈の要約:
        "過去の過ちや損失に対し、深く悲しみ、心から反省する。その真摯な自己反省が、精神的な浄化に繋がり、新たな出発を可能にする、回復への道。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "反省, 悲嘆, 再出発",
      親となる卦: "離為火",
      キーワードタグ: "再出発, 反省, 吉, 悲嘆",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 45.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "離為火 上九",
      通し番号: 182,
      卦番号: 30,
      爻: "上九",
      爻辞: "王用出征。有嘉。折首獲匪其醜。无咎。 （おうもってしゅっせいす。かあり。くびをおりそのしゅうにあらざるをう。とがなし。） 意味：王が出征する。良いことがある。首謀者を討ち、醜くない者は捕らえる。咎めはない。",
      現代解釈の要約:
        "組織や社会の根本的な悪に対し、リーダーが断固たる決断を下し、これを排除する。ただし、公正な裁きを行い、無関係な者を巻き込まないことで、咎めなく問題を解決できる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "決断, 正義の実行, 問題解決",
      親となる卦: "離為火",
      キーワードタグ: "問題なし, 問題解決, 正義の実行, 決断",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 68.0,
      S7_総合評価スコア: 26.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "沢山咸 初六",
      通し番号: 183,
      卦番号: 31,
      爻: "初六",
      爻辞: "咸其拇。 （そのぼにかんず。） 意味：その足の親指が感応する。",
      現代解釈の要約:
        "物事の始まりにおける、ごくわずかな心の動きや、潜在的な影響。まだ具体的な行動には至らないが、何かの兆しを感じ取る最初の段階。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "兆し, 始まり, 潜在的",
      親となる卦: "沢山咸",
      キーワードタグ: "兆し, 始まり, 潜在的",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 40.0,
      S7_総合評価スコア: 62.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者あり",
    },
    {
      爻名: "沢山咸 六二",
      通し番号: 184,
      卦番号: 31,
      爻: "六二",
      爻辞: "咸其腓。凶。居吉。 （そのひにかんず。きょう。おればきち。） 意味：そのふくらはぎが感応する。凶。その場にとどまれば吉。",
      現代解釈の要約:
        "行動したいという衝動に駆られるが、まだ時期尚早。焦って軽率に動くと、反発を招き失敗する。じっと待つのが賢明であるという警告。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "衝動, 軽率, 忍耐",
      親となる卦: "沢山咸",
      キーワードタグ: "凶, 吉, 忍耐, 衝動, 軽率",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 70.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 65.0,
      S5_主体性: "受動",
      S6_変動性スコア: 24.0,
      S7_総合評価スコア: 50.0,
      論理キーワードタグ: "状況:安定期, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "沢山咸 九三",
      通し番号: 185,
      卦番号: 31,
      爻: "九三",
      爻辞: "咸其股。執其随。往吝。 （そのこにかんず。そのずいをとり、ゆけばりん。） 意味：その股が感応する。その追随するものを捉える。進めば恥ずかしい。",
      現代解釈の要約:
        "感情的な動揺が激しく、自分の考えなく他者に追随してしまう。本来の目的を見失い、主体性のない行動は、いずれ恥をかく結果となる。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "感情的, 執着, 主体性の欠如",
      親となる卦: "沢山咸",
      キーワードタグ: "主体性の欠如, 執着, 感情的",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者あり",
    },
    {
      爻名: "沢山咸 九四",
      通し番号: 186,
      卦番号: 31,
      爻: "九四",
      爻辞: "貞吉悔亡。憧憧往来。朋従爾思。 （ていきちにしてくいほろぶ。どうどうとしておうらいす。ともなんじのおもいにしたがう。） 意味：正しくして吉、悔いはない。人が憧れて行き来する。仲間があなたの考えに従う。",
      現代解釈の要約:
        "誠実で正しい姿勢が、周囲からの真の信頼と共感を呼ぶ。多くの人々がそのビジョンに惹きつけられ、自発的に協力者が集まってくる、理想的な状態。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "信頼, リーダーシップ, 共感",
      親となる卦: "沢山咸",
      キーワードタグ: "リーダーシップ, 信頼, 共感, 吉",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 52.0,
      論理キーワードタグ:
        "状況:変革期, 力学:協力者あり, 心理:内省, 心理:正道堅持",
    },
    {
      爻名: "沢山咸 九五",
      通し番号: 187,
      卦番号: 31,
      爻: "九五",
      爻辞: "咸其脢。无悔。 （そのばいにかんず。くいなし。） 意味：その背中（心の中心）が感応する。悔いはない。",
      現代解釈の要約:
        "表面的な言葉ではなく、相手の心の奥深くにある真意を理解し、共感し合う。見返りを求めない、純粋で揺るぎない信頼関係が築かれている。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "信念, 決断, 迷いのなさ",
      親となる卦: "沢山咸",
      キーワードタグ: "信念, 決断, 迷いのなさ",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 12.0,
      S7_総合評価スコア: 68.0,
      論理キーワードタグ:
        "状況:絶頂期, 力学:協力者あり, 力学:順当な力関係, 心理:内省",
    },
    {
      爻名: "沢山咸 上六",
      通し番号: 188,
      卦番号: 31,
      爻: "上六",
      爻辞: "咸其輔頬舌。 （そのほきょうぜつにかんず。） 意味：そのあご・頬・舌が感応する。",
      現代解釈の要約:
        "行動や真心が伴わず、口先だけの巧みな言葉で、相手の気を引こうとする。中身のない、表面的なコミュニケーションは、結局誰の心にも響かない。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "口先だけ, 軽薄, 表面的な",
      親となる卦: "沢山咸",
      キーワードタグ: "口先だけ, 表面的な, 軽薄",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "雷風恒 初六",
      通し番号: 189,
      卦番号: 32,
      爻: "初六",
      爻辞: "浚恒。貞凶。无攸利。 （しゅんこう。ていはきょう。りするところなし。） 意味：深く持続を求める。正しくても凶。利益はない。",
      現代解釈の要約:
        "物事の始まりで、性急に永遠や完璧な結果を求める。その焦りが、かえって深みにはまり、失敗を招く。準備不足のまま、長期的な関係や計画に踏み込むことの危険性。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "時期尚早, 焦り, 固執",
      親となる卦: "雷風恒",
      キーワードタグ: "凶, 固執, 時期尚早, 焦り",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 65.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ:
        "状況:黎明期, 力学:下剋上リスク, 力学:協力者あり, アクション:準備, 心理:正道堅持",
    },
    {
      爻名: "雷風恒 九二",
      通し番号: 190,
      卦番号: 32,
      爻: "九二",
      爻辞: "悔亡。 （くいほろぶ。） 意味：悔いがなくなる。",
      現代解釈の要約:
        "状況の変化に適応しつつ、自己の核となる部分をしっかりと持続させている、バランスの取れた理想的な状態。過去の過ちや後悔が解消され、安定している。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "安定, 中庸, 悔いの解消",
      親となる卦: "雷風恒",
      キーワードタグ: "中庸, 安定, 悔いの解消",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 66.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者あり, 心理:内省",
    },
    {
      爻名: "雷風恒 九三",
      通し番号: 191,
      卦番号: 32,
      爻: "九三",
      爻辞: "不恒其徳。或承之羞。貞厲。 （そのとくをつねにせず。あるいはこれがおもねるをうく。ていりん。） 意味：その徳を持続できない。あるいは恥を負う。正しくしても恥ずかしい。（※解釈テキストでは「貞厲」）",
      現代解釈の要約:
        "行動や方針に一貫性がなく、その場しのぎでコロコロと変わる。その信頼性のなさが、周囲からの信用を失い、恥をかく原因となる。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "一貫性の欠如, 信用失墜, 不誠実",
      親となる卦: "雷風恒",
      キーワードタグ: "リスクあり, 一貫性の欠如, 不誠実, 信用失墜",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 60.0,
      S5_主体性: "受動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 30.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "雷風恒 九四",
      通し番号: 192,
      卦番号: 32,
      爻: "九四",
      爻辞: "田无禽。 （でんにきんなし。） 意味：田に鳥獣がいない。",
      現代解釈の要約:
        "努力の方向性や場所が間違っている。獲物がいない場所で狩りをするように、目的を見失ったまま、無意味な努力を惰性で続けている状態。何の成果も得られない。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "無駄な努力, 目的喪失, 空回り",
      親となる卦: "雷風恒",
      キーワードタグ: "無駄な努力, 目的喪失, 空回り",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 60.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "雷風恒 六五",
      通し番号: 193,
      卦番号: 32,
      爻: "六五",
      爻辞: "恒其徳。貞。婦人吉。夫子凶。 （そのとくをつねにす。てい。ふじんはきち。ふうしはきょう。） 意味：その徳を持続する。正しい。妻には吉。夫には凶。",
      現代解釈の要約:
        "自分の徳目を守り続ける。この「守り」の姿勢は、従う立場（婦人）であれば吉だが、自ら動くべきリーダー（夫子）がこの状態にあると、好機を逃し、凶となる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "役割認識, 守りの姿勢, 柔軟性",
      親となる卦: "雷風恒",
      キーワードタグ: "凶, 吉, 守りの姿勢, 役割認識, 柔軟性",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 75.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 8.0,
      S7_総合評価スコア: 70.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "雷風恒 上六",
      通し番号: 194,
      卦番号: 32,
      爻: "上六",
      爻辞: "振恒。凶。 （しんこう。きょう。） 意味：振動して持続する。凶。",
      現代解釈の要約:
        "落ち着きがなく、常に動き回っているだけで、一貫した方針がない。その場当たり的な行動を「変化への対応」と勘違いし、結局は何も成し遂げられず、破綻する。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "落ち着きのなさ, 混乱, 破綻",
      親となる卦: "雷風恒",
      キーワードタグ: "凶, 混乱, 破綻, 落ち着きのなさ",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 34.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "天山遯 初六",
      通し番号: 195,
      卦番号: 33,
      爻: "初六",
      爻辞: "遯尾。厲。勿用有攸往。 （とんび。あやうし。ゆくところあるをもちうるなかれ。） 意味：退くのに尻尾にいる。危うい。進んではいけない。",
      現代解釈の要約:
        "撤退のタイミングを逃し、後手に回っている危険な状態。問題の渦中に巻き込まれかけており、この段階で無理に進むのは絶対に避けるべき。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "撤退の遅れ, 危険, 後手",
      親となる卦: "天山遯",
      キーワードタグ: "リスクあり, 危険, 後手, 撤退の遅れ",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 50.0,
      S5_主体性: "受動",
      S6_変動性スコア: 40.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者なし, アクション:現状維持",
    },
    {
      爻名: "天山遯 六二",
      通し番号: 196,
      卦番号: 33,
      爻: "六二",
      爻辞: "執之用黄牛之革。莫之勝説。 （これをとるにこうぎゅうのかわをもちう。これをとくにかつものなし。） 意味：これを留めるのに黄牛の革を用いる。誰も引き離せない。",
      現代解釈の要約:
        "物理的に退けない状況で、自らの信念や原則を、丈夫な革のように固く守り抜く。外部の圧力や誘惑に屈しない、内なる強固な意志。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "信念, 忍耐, 堅持",
      親となる卦: "天山遯",
      キーワードタグ: "信念, 堅持, 忍耐",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 70.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 72.0,
      論理キーワードタグ: "状況:変革期, 状況:安定期, 力学:協力者あり",
    },
    {
      爻名: "天山遯 九三",
      通し番号: 197,
      卦番号: 33,
      爻: "九三",
      爻辞: "係遯。有疾厲。畜臣妾吉。 （けいとん。やまいありてあやうし。しんしょうをやしなうはきち。） 意味：引き止められて退く。病のように危うい。家来や妾を蓄えるのは吉。",
      現代解釈の要約:
        "退こうとしても、未練やしがらみに引き止められ、完全に離れられない中途半端な状態。この精神的な葛藤は病のように危ういが、部下を育て、力を蓄えるのは良い。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "しがらみ, 葛藤, 中途半端",
      親となる卦: "天山遯",
      キーワードタグ: "しがらみ, リスクあり, 中途半端, 吉, 葛藤",
      S1_基本スコア: 33.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 60.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者あり",
    },
    {
      爻名: "天山遯 九四",
      通し番号: 198,
      卦番号: 33,
      爻: "九四",
      爻辞: "好遯。君子吉。小人否。 （こうとん。くんしはきち。しょうじんはひ。） 意味：好んで退く。君子は吉。小人はそうはいかない。",
      現代解釈の要約:
        "状況が悪化する前に、将来の危険を予見し、自らの意思で賢明に身を引く。目先の利益に囚われない、優れたリーダー（君子）だけができる最善の判断。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "賢明な判断, 戦略的撤退, 先見の明",
      親となる卦: "天山遯",
      キーワードタグ: "先見の明, 吉, 戦略的撤退, 賢明な判断",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 28.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 72.0,
      S7_総合評価スコア: 28.0,
      論理キーワードタグ:
        "状況:停滞期, 状況:変革期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "天山遯 九五",
      通し番号: 199,
      卦番号: 33,
      爻: "九五",
      爻辞: "嘉遯。貞吉。 （かとん。ていきち。） 意味：素晴らしい撤退。正しくしていれば吉。",
      現代解釈の要約:
        "自身の名誉や利益に固執せず、全体の利益のために、潔く、そして美しく身を引く。その高潔な行動は、周囲から称賛され、模範となる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "模範, 潔さ, 平和的移行",
      親となる卦: "天山遯",
      キーワードタグ: "吉, 平和的移行, 模範, 潔さ",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 8.0,
      S7_総合評価スコア: 68.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "天山遯 上九",
      通し番号: 200,
      卦番号: 33,
      爻: "上九",
      爻辞: "肥遯。无不利。 （ひとん。ふりなきなし。） 意味：ゆったりと隠遁する。不利なことはない。",
      現代解釈の要約:
        "社会的な役割や義務から完全に解放され、悠々自適に暮らす、究極の隠遁。世俗的な価値観を超越し、精神的に満たされた自由な境地。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "超越, 自由, 隠遁",
      親となる卦: "天山遯",
      キーワードタグ: "自由, 超越, 隠遁",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "雷天大壮 初九",
      通し番号: 201,
      卦番号: 34,
      爻: "初九",
      爻辞: "壮于趾。征凶。有孚。 （そうをしにす。ゆけばきょう。まことあり。） 意味：足の指に力がみなぎる。進めば凶。しかし真心はある。",
      現代解釈の要約:
        "意欲に満ちているが、まだ準備不足の初期段階。勢いだけで性急に行動すると、必ず失敗する。軽率な突進への強い警告。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "時期尚早, 軽率, 勇み足",
      親となる卦: "雷天大壮",
      キーワードタグ: "凶, 勇み足, 時期尚早, 軽率",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 75.0,
      S5_主体性: "能動",
      S6_変動性スコア: 80.0,
      S7_総合評価スコア: 24.0,
      論理キーワードタグ:
        "状況:黎明期, 力学:下剋上リスク, 力学:協力者なし, アクション:準備",
    },
    {
      爻名: "雷天大壮 九二",
      通し番号: 202,
      卦番号: 34,
      爻: "九二",
      爻辞: "貞吉。 （ていきち。） 意味：正しくしていれば吉。",
      現代解釈の要約:
        "勢いがある中で、その力を暴走させず、常に公正で正しい道筋を守る。そのバランス感覚と誠実さが、最高の幸運を引き寄せる、理想的な状態。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "中庸, 公正, 安定成長",
      親となる卦: "雷天大壮",
      キーワードタグ: "中庸, 公正, 吉, 安定成長",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 8.0,
      S7_総合評価スコア: 70.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "雷天大壮 九三",
      通し番号: 203,
      卦番号: 34,
      爻: "九三",
      爻辞: "小人用壮。君子用罔。…羝羊触藩。羸其角。 （しょうじんはそうをもちう。くんしはもうをもちう。…ていようはんをふみ、そのつのをくるしむ。） 意味：小人は勢いを用いるが、君子は用いない。…牡羊が垣根に突進し、角を絡ませる。",
      現代解釈の要約:
        "未熟な者が、その力を過信して、無謀で強引な行動に出る。その結果、身動きが取れなくなり、自らを窮地に追い込む、愚かな暴走。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "暴走, 無謀, 自滅",
      親となる卦: "雷天大壮",
      キーワードタグ: "暴走, 無謀, 自滅",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 40.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "雷天大壮 九四",
      通し番号: 204,
      卦番号: 34,
      爻: "九四",
      爻辞: "貞吉。悔亡。藩決不羸。… （ていきち。くいほろぶ。はんひらけてくるしまず。…） 意味：正しくしていれば吉。悔いがなくなる。垣根が開いて絡まらない。",
      現代解釈の要約:
        "これまでの無謀な行動を改め、正しい道に戻ることで、困難な状況から脱却できる。過去の過ちや後悔が解消される、回復の兆し。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "困難の克服, 悔いの解消, 軌道修正",
      親となる卦: "雷天大壮",
      キーワードタグ: "吉, 困難の克服, 悔いの解消, 軌道修正",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 38.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:変革期, 力学:協力者なし, 心理:内省, 心理:正道堅持",
    },
    {
      爻名: "雷天大壮 六五",
      通し番号: 205,
      卦番号: 34,
      爻: "六五",
      爻辞: "喪羊于易。无悔。 （ようをいにおいてうしなう。くいなし。） 意味：安易に羊を失う。悔いることはない。",
      現代解釈の要約:
        "勢いがある時こそ、小さな利益や、ささいな争いに固執しない。大局を見て、不要なものを手放すその余裕と判断力が、悔いのない結果を生む。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "大局観, 余裕, 賢明な判断",
      親となる卦: "雷天大壮",
      キーワードタグ: "余裕, 大局観, 賢明な判断",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 75.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 8.0,
      S7_総合評価スコア: 74.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者あり, 心理:内省",
    },
    {
      爻名: "雷天大壮 上六",
      通し番号: 206,
      卦番号: 34,
      爻: "上六",
      爻辞: "羝羊触藩。不能退。不能遂。无攸利。艱則吉。 （ていようはんをふみ、しりぞくことあたわず、すすむことあたわず。りするところなし。なやむとすなわちきち。） 意味：牡羊が垣根に突進し、退くも進むもできない。利益はない。困難であれば吉。",
      現代解釈の要約:
        "勢いに任せた暴走の極み。進むことも退くこともできない、完全な行き詰まり状態。しかし、その極限の困難を自覚し、深く反省すれば、再生の道も残されている。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "行き詰まり, 膠着状態, 孤立",
      親となる卦: "雷天大壮",
      キーワードタグ: "吉, 孤立, 膠着状態, 行き詰まり",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 65.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 46.0,
      論理キーワードタグ: "状況:困窮状態, 状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "火地晋 初六",
      通し番号: 207,
      卦番号: 35,
      爻: "初六",
      爻辞: "晋如摧如。貞吉。 （しんじょさいじょ。ていきち。） 意味：進もうとしては、挫けそうになる。正しくしていれば吉。",
      現代解釈の要約:
        "物事の始まりで、抵抗や障害に遭い、自信が揺らぐ。しかし、焦らず、正しい道を信じて地道な努力を続ければ、必ず乗り越えられる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "始まりの困難, 障害, 忍耐",
      親となる卦: "火地晋",
      キーワードタグ: "吉, 始まりの困難, 忍耐, 障害",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 28.0,
      S7_総合評価スコア: 52.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "火地晋 六二",
      通し番号: 208,
      卦番号: 35,
      爻: "六二",
      爻辞: "晋如愁如。貞吉。受茲介福于其祖母。 （しんじょしゅうじょ。ていきち。このたいふくをそのそぼにうく。） 意味：進もうとしては憂いがある。正しくしていれば吉。祖母から大きな福を受ける。",
      現代解釈の要約:
        "進展の中にも、将来への不安や懸念を抱く時期。しかし、誠実さを保っていれば、経験豊富な支援者（祖母）からの助けを得て、状況は好転する。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "不安, 支援者, 恩恵",
      親となる卦: "火地晋",
      キーワードタグ: "不安, 吉, 恩恵, 支援者",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 54.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者なし, 心理:正道堅持",
    },
    {
      爻名: "火地晋 六三",
      通し番号: 209,
      卦番号: 35,
      爻: "六三",
      爻辞: "衆允。悔亡。 （しゅういんす。くいほろぶ。） 意味：多くの人が同意する。悔いがなくなる。",
      現代解釈の要約:
        "自分の行動や提案が、多くの人々から賛同と支持を得られる。これまでの苦労が報われ、過去の失敗や後悔が完全に解消される、最高の状態。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "大衆の支持, 合意形成, 信頼",
      親となる卦: "火地晋",
      キーワードタグ: "信頼, 合意形成, 大衆の支持",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 40.0,
      S7_総合評価スコア: 36.0,
      論理キーワードタグ:
        "状況:移行期, 力学:協力者あり, 力学:順当な力関係, 心理:内省",
    },
    {
      爻名: "火地晋 九四",
      通し番号: 210,
      卦番号: 35,
      爻: "九四",
      爻辞: "晋如鼫鼠。貞厲。 （しんじょせきそのごとし。ていあやうし。） 意味：ネズミのように進む。正しくても危うい。（※解釈テキストでは「晋如鼜如」）",
      現代解釈の要約:
        "（解釈テキストに基づき）物事が急速に発展し、大きな注目を集める。勢いがあるが、暴走の危険も伴う。正しい方向性を保つことができれば吉。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "急速な進展, 飛躍, 勢い",
      親となる卦: "火地晋",
      キーワードタグ: "リスクあり, 勢い, 吉, 急速な進展, 飛躍",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 60.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 38.0,
      論理キーワードタグ:
        "状況:変革期, 力学:下剋上リスク, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "火地晋 六五",
      通し番号: 211,
      卦番号: 35,
      爻: "六五",
      爻辞: "悔亡。…得尚于中行。 （くいほろぶ。…ちゅうこうにたっとばるるをえる。） 意味：悔いがなくなる。…中庸の道によって高く評価される。",
      現代解釈の要約:
        "キャリアの頂点に立ち、過去の苦労が報われる。公平で偏りのないリーダーシップを発揮することで、内外から高い評価と信頼を得る。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "リーダーシップ, 中庸, 功績, 名声",
      親となる卦: "火地晋",
      キーワードタグ: "リーダーシップ, 中庸, 功績, 名声",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 45.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 24.0,
      S7_総合評価スコア: 52.0,
      論理キーワードタグ:
        "状況:絶頂期, 力学:協力者なし, 力学:順当な力関係, 心理:内省",
    },
    {
      爻名: "火地晋 上九",
      通し番号: 212,
      卦番号: 35,
      爻: "上九",
      爻辞: "晋其角。…貞吝。 （そのつのをすすむ。…ていはりん。） 意味：その角で進む。…正しくすれば恥ずかしい。",
      現代解釈の要約:
        "成功の勢いに乗り、自分の能力を過信して、強引な手段や自己中心的な行動に出る。一時的に目的を達成できても、そのやり方は周囲の反発を招き、長期的には孤立や恥をかく原因となる。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "行き過ぎ, 強引, 孤立",
      親となる卦: "火地晋",
      キーワードタグ: "孤立, 強引, 行き過ぎ",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 38.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "地火明夷 初九",
      通し番号: 213,
      卦番号: 36,
      爻: "初九",
      爻辞: "明夷于飛。垂其翼。… （めいいひにあり。そのつばさをたる。…） 意味：光明が飛び去る。翼を垂れる（隠す）。",
      現代解釈の要約:
        "危険の兆候をいち早く察知し、その影響が及ぶ前に、賢明に身を引く。自分の能力を隠し、目立たないようにして、災いを未然に回避する。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "危機察知, 賢明な撤退, 自己防衛",
      親となる卦: "地火明夷",
      キーワードタグ: "危機察知, 自己防衛, 賢明な撤退",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 48.0,
      論理キーワードタグ: "状況:黎明期, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "地火明夷 六二",
      通し番号: 214,
      卦番号: 36,
      爻: "六二",
      爻辞: "明夷于左股。用拯馬壮。吉。 （めいいひだりのこにあり。じょうばをもちいてすくう。きち。） 意味：光明が左股を傷つける。強い馬で救う。吉。",
      現代解釈の要約:
        "危険な状況に巻き込まれ、負傷するなどの苦痛を伴う。しかし、信頼できる強力な支援者（強い馬）を得ることで、その困難を乗り越えることができる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "負傷, 支援者, 危機克服",
      親となる卦: "地火明夷",
      キーワードタグ: "危機克服, 吉, 支援者, 負傷",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 72.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 24.0,
      S7_総合評価スコア: 58.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:安定期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "地火明夷 九三",
      通し番号: 215,
      卦番号: 36,
      爻: "九三",
      爻辞: "明夷于南狩。得其大首。不可疾貞。 （めいいなんしゅにあり。そのたいしゅをう。はやくしてていなるべからず。） 意味：光明を隠し南へ狩りに行く。その大将の首を得る。急いで正してはいけない。",
      現代解釈の要約:
        "危険な状況下で、自らの真の意図を隠し、戦略的に行動する。その知恵によって、問題の根源である首謀者（大首）を討ち取り、大きな成功を収める。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "戦略, 根本解決, 忍耐",
      親となる卦: "地火明夷",
      キーワードタグ: "忍耐, 戦略, 根本解決",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ:
        "状況:移行期, 力学:下剋上リスク, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "地火明夷 六四",
      通し番号: 216,
      卦番号: 36,
      爻: "六四",
      爻辞: "入于左腹。獲明夷之心。于出門庭。 （ひだりのはらにいる。めいいのこころをう。もんていをいず。） 意味：（敵の）左腹に入り込む。光明を隠す者の心を得て、門を出ていく。",
      現代解釈の要約:
        "敵陣の懐深くに潜入し、相手の真意や弱点を突き止める。目的を達成したら、速やかにその危険な場所から脱出するという、諜報活動の成功。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "潜入, 諜報, 情報収集",
      親となる卦: "地火明夷",
      キーワードタグ: "情報収集, 潜入, 諜報",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者あり",
    },
    {
      爻名: "地火明夷 六五",
      通し番号: 217,
      卦番号: 36,
      爻: "六五",
      爻辞: "箕子之明夷。利貞。 （きしのめいい。ていによろし。） 意味：箕子のように光明を隠す。正しくしていればよい。",
      現代解釈の要約:
        "有能な賢者が、暴君の下で、あえて愚かなふりをして、自身の才能を隠し、災いを避ける。無理に抵抗せず、時が来るまで耐え忍ぶ、究極の自己防衛。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "忍耐, 韜晦, 生存戦略",
      親となる卦: "地火明夷",
      キーワードタグ: "忍耐, 生存戦略, 韜晦",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者なし, 心理:正道堅持",
    },
    {
      爻名: "地火明夷 上六",
      通し番号: 218,
      卦番号: 36,
      爻: "上六",
      爻辞: "不明晦。初登于天。後入于地。 （めいならずくらし。はじめはてんにのぼり、のちにはちにいる。） 意味：光なく暗い。初めは天に昇るが、後には地に落ちる。",
      現代解釈の要約:
        "闇の支配者そのものの末路。一時は最高の権力を手にするが、その悪行ゆえに、最終的には完全に失墜し、破滅する。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "独裁者の末路, 破滅, 因果応報",
      親となる卦: "地火明夷",
      キーワードタグ: "因果応報, 独裁者の末路, 破滅",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "風火家人 初九",
      通し番号: 219,
      卦番号: 37,
      爻: "初九",
      爻辞: "閑有家。悔亡。 （かんゆうか。くいほろぶ。） 意味：家を厳しく守る。悔いは消える。",
      現代解釈の要約:
        "組織や家庭の始まりにおいて、まず明確で厳格なルールを設定する。その事前の取り決めが、後の不正や混乱を防ぎ、悔いをなくす。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "規律, 秩序, 基礎固め",
      親となる卦: "風火家人",
      キーワードタグ: "基礎固め, 秩序, 規律",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者なし, 心理:内省",
    },
    {
      爻名: "風火家人 六二",
      通し番号: 220,
      卦番号: 37,
      爻: "六二",
      爻辞: "无攸遂。在内貞吉。 （ゆうになすことなし。ないにありてていきち。） 意味：外に求めるものはない。内を正しくしていれば吉。",
      現代解釈の要約:
        "外部への拡大や目立つ活動よりも、まずは内部の体制を固め、組織や家庭の基盤を充実させることに専念する。その堅実さが吉となる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "内部の充実, 自己管理, 守り",
      親となる卦: "風火家人",
      キーワードタグ: "内部の充実, 吉, 守り, 自己管理",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 70.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 24.0,
      S7_総合評価スコア: 58.0,
      論理キーワードタグ:
        "状況:安定期, 力学:下剋上リスク, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "風火家人 九三",
      通し番号: 221,
      卦番号: 37,
      爻: "九三",
      爻辞: "家人嗃嗃。悔厲吉。婦子嘻嘻。終吝。 （かじんこうこう。かいれいきち。ふしきき。おわりにはじ。） 意味：家族が厳しすぎて怒り合う。悔いるが危うくも吉。妻や子が和んで笑うようでは、結局は恥。",
      現代解釈の要約:
        "規律が厳しすぎて内部で反発が起きる。しかし、甘やかして規律が緩むよりは、厳格さを保つ方が、危うさはあっても最終的には吉となる。バランスの難しさ。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "バランス, 厳格さ, 規律",
      親となる卦: "風火家人",
      キーワードタグ: "バランス, リスクあり, 厳格さ, 吉, 規律",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 70.0,
      S5_主体性: "受動",
      S6_変動性スコア: 40.0,
      S7_総合評価スコア: 30.0,
      論理キーワードタグ:
        "状況:移行期, 力学:協力者あり, 力学:順当な力関係, 心理:内省",
    },
    {
      爻名: "風火家人 六四",
      通し番号: 222,
      卦番号: 37,
      爻: "六四",
      爻辞: "富家。大吉。 （ふか。たいきち。） 意味：家を豊かにする。大いに吉。",
      現代解釈の要約:
        "組織や家庭の内部が、物質的にも精神的にも豊かで、非常に良い状態。メンバーがそれぞれの役割を果たし、組織全体が繁栄している。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "繁栄, 豊かさ, 安定",
      親となる卦: "風火家人",
      キーワードタグ: "吉, 安定, 繁栄, 豊かさ",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 28.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 72.0,
      S7_総合評価スコア: 28.0,
      論理キーワードタグ: "状況:変革期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "風火家人 九五",
      通し番号: 223,
      卦番号: 37,
      爻: "九五",
      爻辞: "王假有家。勿恤。吉。 （おうかくゆうか。うれうることなかれ。きち。） 意味：王が家を正しく治める。心配することはない。吉。",
      現代解釈の要約:
        "リーダーが、公正で模範的な行動を通じて、組織を効果的に統治している。その徳により組織全体が安定し、心配のいらない理想的な状態。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "理想のリーダー, 信頼, 安心感",
      親となる卦: "風火家人",
      キーワードタグ: "信頼, 吉, 安心感, 理想のリーダー",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 12.0,
      S7_総合評価スコア: 72.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "風火家人 上九",
      通し番号: 224,
      卦番号: 37,
      爻: "上九",
      爻辞: "有孚威如。終吉。 （まことありいじょ。おわりにきち。） 意味：真心があり、威厳があるように。最終的には吉。",
      現代解釈の要約:
        "長年の努力と実績、そして真心によって、揺るぎない権威が確立された状態。厳しさの中にも温かさがあり、人々が自発的に従う、完成されたリーダーシップ。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "権威, 威厳, 信頼, 完成",
      親となる卦: "風火家人",
      キーワードタグ: "信頼, 吉, 威厳, 完成, 権威",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "火沢睽 初九",
      通し番号: 225,
      卦番号: 38,
      爻: "初九",
      爻辞: "悔亡。喪馬勿逐。自復。 （くいほろぶ。うまをうしなうもおうなかれ。おのずからかえる。） 意味：悔いは消える。馬を失っても追いかけない。自然に戻ってくる。",
      現代解釈の要約:
        "対立の初期段階。些細な行き違いや損失があっても、感情的に相手を追い詰めず、冷静に対処する。誠実な態度でいれば、誤解は自然と解ける。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "早期解決, 冷静な対応, 自制",
      親となる卦: "火沢睽",
      キーワードタグ: "冷静な対応, 早期解決, 自制",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ:
        "状況:黎明期, 力学:下剋上リスク, 力学:協力者あり, 心理:内省",
    },
    {
      爻名: "火沢睽 九二",
      通し番号: 226,
      卦番号: 38,
      爻: "九二",
      爻辞: "遇主于巷。无咎。 （しゅをこうにあう。とがなし。） 意味：巷（ちまた）で主君に出会う。咎めはない。",
      現代解釈の要約:
        "周囲が対立している中で、偶然、あるいは意外な場所で、真に理解し合える協力者やリーダーに出会う。この出会いが、状況を好転させるきっかけとなる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "理解者, 協力者, 偶然の出会い",
      親となる卦: "火沢睽",
      キーワードタグ: "偶然の出会い, 協力者, 問題なし, 理解者",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 84.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 24.0,
      S7_総合評価スコア: 74.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "火沢睽 六三",
      通し番号: 227,
      卦番号: 38,
      爻: "六三",
      爻辞: "見輿曳。其牛掣。其人天且劓。无初有終。 （よをひくをみる。そのうしせいせらる。そのひとてんしかつげいせらる。はじめなきも、おわりあり。） 意味：車が牛を引きずり、旅人は天罰で鼻を切られる。初めはないが終わりはある。",
      現代解釈の要約:
        "組織内で深刻な不調和が生じ、互いに足を引っ張り合う。痛みを伴う抜本的な調整が必要となる、非常に困難な状況。しかし、それを乗り越えれば、最終的には良い結果に繋がる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "内部分裂, 深刻な不和, 試練",
      親となる卦: "火沢睽",
      キーワードタグ: "内部分裂, 深刻な不和, 試練",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 20.0,
      S4_リスク: 75.0,
      S5_主体性: "能動",
      S6_変動性スコア: 76.0,
      S7_総合評価スコア: 16.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:移行期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "火沢睽 九四",
      通し番号: 228,
      卦番号: 38,
      爻: "九四",
      爻辞: "睽孤。遇元夫。交孚。厲无咎。 （けいこ。げんぷにあう。こうしんす。あやうけれどもとがなし。） 意味：対立し孤立する。偉大な男に出会い、真心が通じ合う。危ういが咎めなし。",
      現代解釈の要約:
        "対立の中で深く孤立するが、自分を真に理解してくれる器の大きな人物と出会う。誠実な対話によって、危うい状況を打開し、咎めを免れる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "孤立, 真の理解者, 信頼関係",
      親となる卦: "火沢睽",
      キーワードタグ: "リスクあり, 信頼関係, 問題なし, 孤立, 真の理解者",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 40.0,
      S5_主体性: "受動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 54.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "火沢睽 六五",
      通し番号: 229,
      卦番号: 38,
      爻: "六五",
      爻辞: "悔亡。厥宗噬膚。往何咎。 （くいほろぶ。そのそうふをかむ。ゆけばなんのとがあらん。） 意味：悔いは消える。その一族が肉を噛む（親密になる）。進んで何の咎めがあろうか。",
      現代解釈の要約:
        "長く続いた対立や誤解が完全に解消され、関係が回復する。分裂していた人々が再び固く団結し、本音で語り合える、最高の和解の状態。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "和解, 団結, 関係修復",
      親となる卦: "火沢睽",
      キーワードタグ: "和解, 団結, 関係修復",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 75.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 74.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者あり, 心理:内省",
    },
    {
      爻名: "火沢睽 上九",
      通し番号: 230,
      卦番号: 38,
      爻: "上九",
      爻辞: "睽孤。見豕負塗。載鬼一車。…往遇雨則吉。 （けいこ。しにどをおうをみる。おにをのせることいっしゃ。…ゆきてあめにあえばすなわちきち。） 意味：対立し孤立する。豚が泥を背負い、鬼が車に満載されているのを見る。…進んで雨に遭えば吉。",
      現代解釈の要約:
        "対立が極まり、周囲の全てが敵に見えるほど、極度に孤立し、疑心暗鬼に陥っている。しかし、状況が好転する機会（雨）が訪れる可能性も残されている。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "疑心暗鬼, 敵意, 孤立",
      親となる卦: "火沢睽",
      キーワードタグ: "吉, 孤立, 敵意, 疑心暗鬼",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 26.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "水山蹇 初六",
      通し番号: 231,
      卦番号: 39,
      爻: "初六",
      爻辞: "往蹇来誉。 （ゆけばけん、きたればほまれ。） 意味：進めば困難だが、退けば誉められる。",
      現代解釈の要約:
        "困難の初期段階。これ以上進むことの不利をいち早く察知し、潔く撤退する。その賢明な判断が、結果的に損失を避け、周囲からの評価を得る。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "賢明な判断, 撤退, 損失回避",
      親となる卦: "水山蹇",
      キーワードタグ: "損失回避, 撤退, 賢明な判断",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:黎明期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "水山蹇 六二",
      通し番号: 232,
      卦番号: 39,
      爻: "六二",
      爻辞: "王臣蹇蹇。非躬之故。 （おうしんけんけん。みのためならず。） 意味：王の臣下が足踏みする。自分自身のせいではない。",
      現代解釈の要約:
        "忠実に任務を果たそうとしても、外部要因や不可抗力によって、物事が進まない。個人の責任ではないため、耐え忍び、時を待つしかない状況。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "不可抗力, 忍耐, 外部要因",
      親となる卦: "水山蹇",
      キーワードタグ: "不可抗力, 外部要因, 忍耐",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 70.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 58.0,
      論理キーワードタグ: "状況:安定期, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "水山蹇 九三",
      通し番号: 233,
      卦番号: 39,
      爻: "九三",
      爻辞: "往蹇来反。 （ゆけばけん、きたればはんす。） 意味：進めば困難、戻っても（同じ困難に）戻るだけ。",
      現代解釈の要約:
        "進むも退くも地獄という、八方塞がりの最も苦しい状況。どう行動しても裏目に出る可能性が高く、下手に動くとさらに事態が悪化する。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "進退両難, 八方塞がり, 行き詰まり",
      親となる卦: "水山蹇",
      キーワードタグ: "八方塞がり, 行き詰まり, 進退両難",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 36.0,
      論理キーワードタグ: "状況:困窮状態, 状況:移行期, 力学:協力者あり",
    },
    {
      爻名: "水山蹇 六四",
      通し番号: 234,
      卦番号: 39,
      爻: "六四",
      爻辞: "往蹇来連。 （ゆけばけん、きたればつらなる。） 意味：進めば困難、戻れば連なり合う。",
      現代解釈の要約:
        "独力で困難を打開できない時。内向きに閉じこもるのではなく、戻って仲間と連携し、協力体制を築くことで、初めて解決の道が開ける。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "協力, 連携, 支援者",
      親となる卦: "水山蹇",
      キーワードタグ: "協力, 支援者, 連携",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ: "状況:困窮状態, 状況:変革期, 力学:協力者なし",
    },
    {
      爻名: "水山蹇 九五",
      通し番号: 235,
      卦番号: 39,
      爻: "九五",
      爻辞: "大蹇朋来。 （たいけんにともきたる。） 意味：大いなる困難だが、友が来る。（吉）",
      現代解釈の要約:
        "最も深刻な困難の最中に、真に信頼できる友人や協力者（朋）が現れ、助けとなる。絶望的な状況に、希望の光が差し込む、劇的な好転。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "救済, 友情, 支援, 危機脱出",
      親となる卦: "水山蹇",
      キーワードタグ: "危機脱出, 友情, 吉, 支援, 救済",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 12.0,
      S7_総合評価スコア: 72.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:絶頂期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "水山蹇 上六",
      通し番号: 236,
      卦番号: 39,
      爻: "上六",
      爻辞: "往蹇来碩。吉。利見大人。 （ゆけばけん、きたればせき。きち。たいじんにみるによろし。） 意味：進めば困難、戻れば大いなるもの。吉。目上の人に会うのがよい。",
      現代解釈の要約:
        "長い困難の時期を耐え抜き、その経験を通じて、大きな成果や人間的な成長（碩）を得る。その徳が認められ、新たな活躍の道が開ける。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "苦難の克服, 精神的成長, 大成",
      親となる卦: "水山蹇",
      キーワードタグ: "出会い, 吉, 大成, 師事, 精神的成長, 苦難の克服",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 65.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 46.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:終極期, 力学:協力者あり, アクション:専門家相談",
    },
    {
      爻名: "雷水解 初六",
      通し番号: 237,
      卦番号: 40,
      爻: "初六",
      爻辞: "无咎。 （とがなし。） 意味：咎められない。",
      現代解釈の要約:
        "困難な状況から抜け出すための、最初の正しい一歩。まだ大きな成果はないが、問題解決に向けたその行動自体は正しく、咎められない。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "第一歩, 解決の始まり, 積極性",
      親となる卦: "雷水解",
      キーワードタグ: "問題なし, 積極性, 第一歩, 解決の始まり",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 48.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:黎明期, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "雷水解 九二",
      通し番号: 238,
      卦番号: 40,
      爻: "九二",
      爻辞: "田獲三狐。得黄矢。貞吉。 （でんにさんこをう。こうしをう。ていきち。） 意味：田で三匹の狐を捕らえる。黄色の矢を得る。正しくしていれば吉。",
      現代解釈の要約:
        "解決すべき具体的な問題（狐）を、公正な手段（黄矢）を用いて、的確かつ徹底的に排除する。その断固たる行動が、大きな成功を収める。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "問題の排除, 断固たる行動, 正義",
      親となる卦: "雷水解",
      キーワードタグ: "吉, 問題の排除, 断固たる行動, 正義",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 8.0,
      S7_総合評価スコア: 70.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "雷水解 六三",
      通し番号: 239,
      卦番号: 40,
      爻: "六三",
      爻辞: "負且乗。致寇至。貞凶。 （おいてかつのる。こうをいたすにいたる。ていはきょう。） 意味：荷物を背負い、かつ車に乗る。賊を招き寄せる。正しくても凶。",
      現代解釈の要約:
        "問題解決の過程で、自分の能力を過信し、分不相応な地位や振る舞いをする。その油断や傲慢さが、新たなトラブルや敵（寇）を引き寄せてしまう。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "傲慢, 油断, 身の程知らず",
      親となる卦: "雷水解",
      キーワードタグ: "傲慢, 凶, 油断, 身の程知らず",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 85.0,
      S5_主体性: "受動",
      S6_変動性スコア: 60.0,
      S7_総合評価スコア: 8.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者なし, 心理:正道堅持",
    },
    {
      爻名: "雷水解 九四",
      通し番号: 240,
      卦番号: 40,
      爻: "九四",
      爻辞: "解而拇。朋至斯孚。 （そのぼをとき、ともいたりてまこととす。） 意味：足の親指を解き放つ。友が来て、真心がある。",
      現代解釈の要約:
        "自分の足かせとなっていた、不適切な仲間や、古いしがらみ（拇）を断ち切る。その結果、本当に信頼できる仲間（朋）が現れ、協力関係が築ける。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "悪縁を断つ, 決断, 信頼関係",
      親となる卦: "雷水解",
      キーワードタグ: "信頼関係, 悪縁を断つ, 決断",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 60.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "雷水解 六五",
      通し番号: 241,
      卦番号: 40,
      爻: "六五",
      爻辞: "君子維解。吉。有孚于小人。 （くんしただ解くことあり。きち。しょうじんにまことあり。） 意味：君子が解決する。吉。小人にも真心が伝わる。",
      現代解釈の要約:
        "リーダーが、賢明な判断と行動によって、困難な問題を解決に導く。その公正なやり方は、部下や大衆からも信頼され、組織全体に平和が戻る。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "リーダーシップ, 問題解決, 信頼獲得",
      親となる卦: "雷水解",
      キーワードタグ: "リーダーシップ, 信頼獲得, 吉, 問題解決",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 75.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 64.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:絶頂期, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "雷水解 上六",
      通し番号: 242,
      卦番号: 40,
      爻: "上六",
      爻辞: "公用射隼于高墉之上。獲之无不利。 （こうもってはやぶさをこうようのうえにいる。これをえてふりなきなし。） 意味：公が高い城壁の上の隼を射る。これを得れば不利なことはない。",
      現代解釈の要約:
        "組織や社会に潜む、根深い悪の元凶（隼）を、権威ある者（公）が断固として排除する。これにより、全ての問題が最終的に解決され、完全な安寧が訪れる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "根本解決, 最終的な勝利, 決断",
      親となる卦: "雷水解",
      キーワードタグ: "凶, 最終的な勝利, 根本解決, 決断",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 35.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 28.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "山沢損 初九",
      通し番号: 243,
      卦番号: 41,
      爻: "初九",
      爻辞: "已事遄往。无咎。酌損之。 （ことをやみとくゆく。とがなし。これをくみてそんす。） 意味：事をやめて速やかに行く。咎めなし。減らすことを量り定める。",
      現代解釈の要約:
        "損失の兆候をいち早く察知し、迅速に対処する。無駄なものを減らすべきだと判断したら、躊躇なく行動に移す。その早期決断が、被害を最小限に抑える。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "早期決断, 迅速な対応, 損失削減",
      親となる卦: "山沢損",
      キーワードタグ: "問題なし, 損失削減, 早期決断, 迅速な対応",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 40.0,
      S7_総合評価スコア: 62.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者あり",
    },
    {
      爻名: "山沢損 九二",
      通し番号: 244,
      卦番号: 41,
      爻: "九二",
      爻辞: "利貞。征凶。弗損益之。 （ていによろし。ゆけばきょう。そんせずしてこれをえきす。） 意味：正しくして良い。進めば凶。損なうことなく益する。（※解釈テキストでは「貞吉。无咎」）",
      現代解釈の要約:
        "見せかけの飾りや無駄をなくすことで、実質的な価値や本質を強化する。コストをかけずに、あるいは損をすることなく、全体をより効率的に、より健全にすること。理想的な「損」。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "効率化, 合理化, 無駄の排除",
      親となる卦: "山沢損",
      キーワードタグ: "凶, 効率化, 合理化, 吉, 問題なし, 無駄の排除",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 80.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 54.0,
      論理キーワードタグ:
        "状況:安定期, 力学:下剋上リスク, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "山沢損 六三",
      通し番号: 245,
      卦番号: 41,
      爻: "六三",
      爻辞: "三人行則損一人。一人行則得其友。 （さんにんゆけばすなわちいちにんをそんす。いちにんゆけばすなわちそのともをう。） 意味：三人で行けば一人を損なう。一人で行けばその友を得る。",
      現代解釈の要約:
        "組織やチーム内の不和要素を、痛みを伴いながらも切り離す決断。不適切な関係を断ち切ることで、本当に価値ある協力者や仲間を得られる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "痛みを伴う決断, 再構築, 関係の整理",
      親となる卦: "山沢損",
      キーワードタグ: "再構築, 痛みを伴う決断, 関係の整理",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 36.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者あり",
    },
    {
      爻名: "山沢損 六四",
      通し番号: 246,
      卦番号: 41,
      爻: "六四",
      爻辞: "損其疾。使遄有喜。无咎。 （そのしつをそんす。はやからしめてよろこびあらしむ。とがなし。） 意味：その病を減らす。速やかに喜びがあるようにする。咎めなし。",
      現代解釈の要約:
        "組織や個人に蔓延する悪癖や非効率（病）を、その根本から取り除く。痛みを伴うが、迅速な治療が、早期の良い結果（喜び）に繋がる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "根本治療, 自己改革, 問題解決",
      親となる卦: "山沢損",
      キーワードタグ: "問題なし, 問題解決, 根本治療, 自己改革",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者あり",
    },
    {
      爻名: "山沢損 六五",
      通し番号: 247,
      卦番号: 41,
      爻: "六五",
      爻辞: "或益之。十朋之亀弗克違。元吉。 （あるいはこれをえきす。じっぽうのきもよくたがわず。げんきち。） 意味：あるいはこれを益する。十朋の亀も背けない。大いに吉。",
      現代解釈の要約:
        "これまでの自己犠牲的な努力や、賢明な削減が報われ、外部から大きな助けや予期せぬ利益がもたらされる。その徳により、最高の幸運を得る。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "恩恵, 報われる努力, 信頼",
      親となる卦: "山沢損",
      キーワードタグ: "信頼, 吉, 報われる努力, 恩恵",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 12.0,
      S7_総合評価スコア: 72.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "山沢損 上九",
      通し番号: 248,
      卦番号: 41,
      爻: "上九",
      爻辞: "弗損益之。无咎。貞吉。…得臣无家。 （そんせずしてこれをえきす。とがなし。ていきち。…しんをえていえなし。） 意味：損なうことなく益する。咎めなし。正しくして吉。…家を持たない臣を得る。",
      現代解釈の要約:
        "究極の無私な貢献。自分の利益を損なうことなく、相手や全体に最大限の利益をもたらす。その高潔な姿勢が、私利私欲のない、真に忠実な協力者を引き寄せる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "無私な貢献, 大義, 普遍的価値",
      親となる卦: "山沢損",
      キーワードタグ: "吉, 問題なし, 大義, 普遍的価値, 無私な貢献",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "風雷益 初九",
      通し番号: 249,
      卦番号: 42,
      爻: "初九",
      爻辞: "利用為大作。元吉。无咎。 （もってたいさくをなすによろし。げんきち。とがなし。） 意味：大いなる事業を行うのに良い。大いに吉。咎めなし。",
      現代解釈の要約:
        "利益を増やす初期段階。社会貢献など、より大きな目的のための事業に、大胆かつ意欲的に乗り出す。その志が正しければ、最高の幸運を得られる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "大事業, 積極性, 社会貢献",
      親となる卦: "風雷益",
      キーワードタグ: "吉, 問題なし, 大事業, 社会貢献, 積極性",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 65.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 52.0,
      論理キーワードタグ: "状況:黎明期, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "風雷益 六二",
      通し番号: 250,
      卦番号: 42,
      爻: "六二",
      爻辞: "或益之。十朋之亀弗克違。永貞吉。 （あるいはこれをえきす。じっぽうのきもよくたがわず。えいていきち。） 意味：あるいはこれを益する。十朋の亀も背けない。永く正しければ吉。",
      現代解釈の要約:
        "自身の行動だけでなく、予期せぬ形で外部から大きな助けや利益がもたらされる。これまでの誠実な行いが報われ、揺るぎない信頼となっている状態。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "恩恵, 信頼, 予期せぬ幸運",
      親となる卦: "風雷益",
      キーワードタグ: "予期せぬ幸運, 信頼, 吉, 恩恵",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 8.0,
      S7_総合評価スコア: 70.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "風雷益 六三",
      通し番号: 251,
      卦番号: 42,
      爻: "六三",
      爻辞: "益之用凶事。无咎。有孚中行。… （これをえきするにきょうじをもちう。とがなし。まことありてちゅうこうす。…） 意味：凶事を利用して益する。咎めなし。真心をもって中庸を行く。",
      現代解釈の要約:
        "困難な状況や不幸な出来事（凶事）を、逆にチャンスとして活かし、利益に転換する。誠実さと公正さをもって対処すれば、咎められることはない。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "危機をチャンスに, 逆転の発想, 誠実",
      親となる卦: "風雷益",
      キーワードタグ: "凶, 危機をチャンスに, 問題なし, 誠実, 逆転の発想",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 65.0,
      S5_主体性: "受動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ: "状況:困窮状態, 状況:移行期, 力学:協力者あり",
    },
    {
      爻名: "風雷益 六四",
      通し番号: 252,
      卦番号: 42,
      爻: "六四",
      爻辞: "中行告公。従。利用為依遷国。 （ちゅうこうしてこうにつぐ。したがう。もってくにをうつすによろし。） 意味：中庸を行い公に報告する。従う。国を移す（大きな変革）のに用いるのが良い。",
      現代解釈の要約:
        "組織の中核として、公正な立場で上層部（公）に進言し、信頼を得る。その提言が、組織全体をより良くするための、大きな改革へと繋がっていく。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "橋渡し, 信頼, 改革",
      親となる卦: "風雷益",
      キーワードタグ: "信頼, 改革, 橋渡し",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 64.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "風雷益 九五",
      通し番号: 253,
      卦番号: 42,
      爻: "九五",
      爻辞: "有孚恵心。勿問。元吉。… （まことありてけいしんあり。とうなかれ。げんきち。…） 意味：真心と恵み深い心がある。問う必要はない。大いに吉。",
      現代解釈の要約:
        "リーダーが、見返りを求めず、心からの思いやり（恵心）で、人々や社会に恩恵を与える。その無私の精神が、最高の幸運を引き寄せる、理想的な状態。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "無私な貢献, 恵み深い心, リーダーシップ",
      親となる卦: "風雷益",
      キーワードタグ: "リーダーシップ, 吉, 恵み深い心, 無私な貢献",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 75.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 78.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者あり",
    },
    {
      爻名: "風雷益 上九",
      通し番号: 254,
      卦番号: 42,
      爻: "上九",
      爻辞: "莫益之。或撃之。立心勿恒。凶。 （これをえきするものなし。あるいはこれをうつ。こころをたつることつねなるなかれ。きょう。） 意味：これを益する者がいない。あるいはこれを撃つ者もいる。心を常に保てない。凶。",
      現代解釈の要約:
        "利益を独り占めしようと、強欲で自己中心的な行動に走る。その結果、誰からも助けられず、逆に周囲から非難され、攻撃されて破滅する。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "強欲, 独り善がり, 孤立, 破滅",
      親となる卦: "風雷益",
      キーワードタグ: "凶, 孤立, 強欲, 独り善がり, 破滅",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 34.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "沢天夬 初九",
      通し番号: 255,
      卦番号: 43,
      爻: "初九",
      爻辞: "壮于前趾。不勝為咎。… （そうをぜんしにす。かたずんばとがとなる。…） 意味：足の指に力がみなぎる。勝てなければ咎めとなる。",
      現代解釈の要約:
        "意欲に満ちているが、まだ準備不足の初期段階。この状態で性急に大きな行動を起こしても、力及ばず失敗し、咎めを受ける危険性が高い。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "勇み足, 準備不足, 軽率",
      親となる卦: "沢天夬",
      キーワードタグ: "勇み足, 準備不足, 軽率",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 46.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者なし, アクション:準備",
    },
    {
      爻名: "沢天夬 九二",
      通し番号: 256,
      卦番号: 43,
      爻: "九二",
      爻辞: "惕号。莫夜有戎。勿恤。 （てきごう。ばくやにじゅうあり。うれうることなかれ。） 意味：恐れ、叫ぶ。夜中に戦争があるかのように警戒する。心配することはない。",
      現代解釈の要約:
        "状況が進む中で、潜在的なリスクや困難の兆候を敏感に察知する。常に警戒心を保ち、備えを怠らなければ、大きな問題には至らない。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "警戒, 危機管理, 備え",
      親となる卦: "沢天夬",
      キーワードタグ: "備え, 危機管理, 警戒",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ: "状況:困窮状態, 状況:安定期, 力学:協力者なし",
    },
    {
      爻名: "沢天夬 九三",
      通し番号: 257,
      卦番号: 43,
      爻: "九三",
      爻辞: "壮于頄。有凶。君子夬夬。…无咎。 （そうをきゅうにす。きょうあり。くんしかいかい。…とがなし。） 意味：頬骨に力がみなぎる（強引）。凶。君子は断固として決断する。…咎めはない。",
      現代解釈の要約:
        "独断的、強引な態度で物事を推し進めると、凶となる。しかし、君子が孤立を覚悟の上で、正しい決断を断行するならば、最終的に咎めはない。非常に困難な選択。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "決断, 孤立, 覚悟, 困難な選択",
      親となる卦: "沢天夬",
      キーワードタグ: "凶, 問題なし, 困難な選択, 孤立, 決断, 覚悟",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 38.0,
      論理キーワードタグ: "状況:困窮状態, 状況:移行期, 力学:協力者あり",
    },
    {
      爻名: "沢天夬 九四",
      通し番号: 258,
      卦番号: 43,
      爻: "九四",
      爻辞: "臀无膚。其行次且。…聞言不信。 （でんにふなし。そのゆきじしょ。…げんをきくもじんぜず。） 意味：尻に皮膚がない（落ち着かない）。その行動はためらう。…言葉を聞いても信じない。",
      現代解釈の要約:
        "重要な決断を迫られているにもかかわらず、優柔不断で行動に移せない。周囲の忠告にも耳を貸さず、疑心暗鬼に陥り、機会を逃してしまう。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "優柔不断, 停滞, 頑固",
      親となる卦: "沢天夬",
      キーワードタグ: "停滞, 優柔不断, 頑固",
      S1_基本スコア: 33.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 68.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者なし",
    },
    {
      爻名: "沢天夬 九五",
      通し番号: 259,
      卦番号: 43,
      爻: "九五",
      爻辞: "莧陸夬夬。中行无咎。 （けんりくかいかい。ちゅうこうなればとがなし。） 意味：ヒユを抜き去るように決断する。中庸を行けば咎めなし。（※解釈テキストでは「中行无咎」が中心）",
      現代解釈の要約:
        "最高の立場にあるリーダーが、極端に走らず、中庸の精神に基づいて公平かつ適切な決断を下す。その賢明な判断が、組織を正しく導き、咎められることがない。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "賢明な判断, リーダーシップ, 中庸",
      親となる卦: "沢天夬",
      キーワードタグ: "リーダーシップ, 中庸, 問題なし, 賢明な判断",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 48.0,
      論理キーワードタグ: "状況:絶頂期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "沢天夬 上六",
      通し番号: 260,
      卦番号: 43,
      爻: "上六",
      爻辞: "无号。終有凶。 （ごうなし。おわりにきょうあり。） 意味：叫び声もない。最終的に凶。",
      現代解釈の要約:
        "打ち破られるべき、最後の障害そのもの。あるいは、無謀な決断を下した者の末路。もはや助けもなく、抵抗する声さえ上げられず、完全に破滅する。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "破滅, 終焉, 孤立無援",
      親となる卦: "沢天夬",
      キーワードタグ: "凶, 孤立無援, 破滅, 終焉",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 65.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "天風姤 初六",
      通し番号: 261,
      卦番号: 44,
      爻: "初六",
      爻辞: "繋于金柅。貞吉。… （きんじにつながる。ていきち。…） 意味：金のくさびに繋ぎ止める。正しくしていれば吉。",
      現代解釈の要約:
        "予期せぬ出会いや誘いに対し、すぐに飛びつかない。強い意志（金のくさび）で自らを律し、軽率な行動を避ける。その慎重さが、不必要なリスクを回避し、吉となる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "自制, 慎重, 危険回避",
      親となる卦: "天風姤",
      キーワードタグ: "危険回避, 吉, 慎重, 自制",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ:
        "状況:黎明期, 力学:協力者あり, 力学:順当な力関係, 心理:慎重, 心理:正道堅持",
    },
    {
      爻名: "天風姤 九二",
      通し番号: 262,
      卦番号: 44,
      爻: "九二",
      爻辞: "包有魚。无咎。不利賓。 （ほうにうおあり。とがなし。ひんにはふり。） 意味：包みに魚がある。咎めなし。客としてもてなすのは良くない。",
      現代解釈の要約:
        "価値ある出会いやチャンス（魚）に恵まれるが、まだそれを公にすべきではない。静かにその価値を認識し、慎重に関係を進めれば、咎めはない。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "潜在的な好機, 秘匿, 静観",
      親となる卦: "天風姤",
      キーワードタグ: "問題なし, 潜在的な好機, 秘匿, 静観",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 65.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 60.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者なし, 心理:慎重",
    },
    {
      爻名: "天風姤 九三",
      通し番号: 263,
      卦番号: 44,
      爻: "九三",
      爻辞: "臀无膚。其行次且。厲无大咎。 （でんにふなし。そのゆきじしょ。あやういも、おおきなとがなし。） 意味：尻に皮膚がない（落ち着かない）。その行動はためらう。危ういが大きな咎めはない。",
      現代解釈の要約:
        "予期せぬ状況に、心が定まらず、進むべきか退くべきか迷っている。その中途半端な姿勢は危ういが、まだ決定的な過ちを犯していないため、致命傷には至らない。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "優柔不断, 葛藤, 不安定",
      親となる卦: "天風姤",
      キーワードタグ: "リスクあり, 不安定, 優柔不断, 葛藤",
      S1_基本スコア: 33.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 70.0,
      S5_主体性: "能動",
      S6_変動性スコア: 72.0,
      S7_総合評価スコア: 24.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者なし",
    },
    {
      爻名: "天風姤 九四",
      通し番号: 264,
      卦番号: 44,
      爻: "九四",
      爻辞: "包无魚。凶。 （ほうにうおなし。きょう。） 意味：包みに魚がない。凶。（※解釈テキストでは「起凶」）",
      現代解釈の要約:
        "絶好の機会があったにもかかわらず、それを見逃したり、活かせなかったりした結果、何も得られない。周囲との連携を怠り、孤立したことによる失敗。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "機会損失, 孤立, 失敗",
      親となる卦: "天風姤",
      キーワードタグ: "凶, 失敗, 孤立, 機会損失",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 50.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者あり",
    },
    {
      爻名: "天風姤 九五",
      通し番号: 265,
      卦番号: 44,
      爻: "九五",
      爻辞: "以杞包瓜。含章。有隕自天。 （きをもってうりをくるむ。しょうをふくむ。てんよりおつることあり。） 意味：杞の葉で瓜を包む。内に美徳を包む。天から落ちてくる。（吉）",
      現代解釈の要約:
        "見た目は目立たないが、内面に大きな価値（瓜）を持つ存在を見出し、それを大切に育む。その高潔な姿勢が、やがて天からの恵みのような、予期せぬ幸運を引き寄せる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "才能の発掘, 育成, 恩恵",
      親となる卦: "天風姤",
      キーワードタグ:
        "内面の美徳, 吉, 恩恵, 才能の発掘, 才能を隠す, 時期を待つ, 育成, 貢献",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 62.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者なし",
    },
    {
      爻名: "天風姤 上九",
      通し番号: 266,
      卦番号: 44,
      爻: "上九",
      爻辞: "姤其角。吝。无咎。 （そのつのにあう。りん。とがなし。） 意味：その角で出会う。恥ずかしいが、咎めはない。",
      現代解釈の要約:
        "自分の力を過信し、傲慢な態度（角）で人と接する。そのため、誰からも相手にされず、孤立してしまう。恥ずべき状態だが、もはや誰にも影響を与えないため、大きな咎めはない。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "傲慢, 孤立, 対立",
      親となる卦: "天風姤",
      キーワードタグ: "傲慢, 問題なし, 孤立, 対立",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 68.0,
      S7_総合評価スコア: 22.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "沢地萃 初六",
      通し番号: 267,
      卦番号: 45,
      爻: "初六",
      爻辞: "有孚不尽。乃乱乃萃。…一握為笑。…往无咎。 （まことありてつきず。すなわちみだれすなわちあつまる。…いちあくにしてわらいとなる。…ゆけばとがなし。） 意味：真心が尽くしきれない。乱れては集まる。…一握りで笑いとなる。…行けば咎めなし。",
      現代解釈の要約:
        "人々を集める初期段階。まだ信頼が不十分で混乱も生じるが、主催者側に真心があれば、やがて不安は解消され、笑顔で協力し合える関係が築ける。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "始まりの混乱, 信頼構築, 誠実",
      親となる卦: "沢地萃",
      キーワードタグ: "信頼構築, 問題なし, 始まりの混乱, 誠実",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 40.0,
      S7_総合評価スコア: 52.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者あり",
    },
    {
      爻名: "沢地萃 六二",
      通し番号: 268,
      卦番号: 45,
      爻: "六二",
      爻辞: "引吉。无咎。孚乃利用礜。 （ひけばきち。とがなし。まことあればすなわちやくをもちうるによろし。） 意味：引き寄せられて吉。咎めなし。真心があれば、小さな供え物でも用いられる。",
      現代解釈の要約:
        "優れたリーダーや、正しい目的の集まりに、自然な形で引き寄せられる。その流れに従うことで、幸運を得られる、理想的な参加の形。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "導き, 幸運, 参加",
      親となる卦: "沢地萃",
      キーワードタグ: "参加, 吉, 問題なし, 導き, 幸運",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 65.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 74.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者あり",
    },
    {
      爻名: "沢地萃 六三",
      通し番号: 269,
      卦番号: 45,
      爻: "六三",
      爻辞: "萃如嗟如。无攸利。往无咎。小吝。 （すいじょさじょ。りするところなし。ゆけばとがなし。しょうりん。） 意味：集まってもため息をつくばかり。利益がない。進めば咎はないが、少し恥ずかしい。",
      現代解釈の要約:
        "人は集まったものの、目的が曖昧だったり、疎外感を感じたりして、不満やため息が漏れる。このまま停滞すれば無益だが、自ら行動を起こせば、状況は打開できる。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "疎外感, 停滞, 不満",
      親となる卦: "沢地萃",
      キーワードタグ: "不満, 停滞, 問題なし, 疎外感",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 35.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 65.0,
      S5_主体性: "受動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 24.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "沢地萃 九四",
      通し番号: 270,
      卦番号: 45,
      爻: "九四",
      爻辞: "大吉。无咎。 （だいきち。とがなし。） 意味：大いに吉。咎められることはない。",
      現代解釈の要約:
        "組織やチームの中心人物として、人々をまとめ、大きな成果を上げる。結束力も信頼関係も最高潮に達しており、何をやってもうまくいく、絶好調の時。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "最高の結束, 大成功, リーダーシップ",
      親となる卦: "沢地萃",
      キーワードタグ: "リーダーシップ, 吉, 問題なし, 大成功, 最高の結束",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 58.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者あり",
    },
    {
      爻名: "沢地萃 九五",
      通し番号: 271,
      卦番号: 45,
      爻: "九五",
      爻辞: "萃有位。无咎。弗孚。元永貞。悔亡。 （すいにくらいあり。とがなし。まこととせられず。げんえいていなれば、くいほろぶ。） 意味：集まりの中に位がある。咎めなし。信頼されなくても、根本から長く正しくしていれば、悔いは消える。",
      現代解釈の要約:
        "リーダーとして、最初は完全な信頼を得られていないかもしれない。しかし、感情に流されず、常に公正な原則を貫き通すことで、最終的に人々からの信頼を勝ち取り、悔いをなくすことができる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "公正なリーダー, 信頼回復, 忍耐",
      親となる卦: "沢地萃",
      キーワードタグ: "信頼回復, 公正なリーダー, 問題なし, 忍耐",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 75.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 24.0,
      S7_総合評価スコア: 60.0,
      論理キーワードタグ:
        "状況:絶頂期, 力学:下剋上リスク, 力学:協力者あり, 心理:内省, 心理:正道堅持",
    },
    {
      爻名: "沢地萃 上六",
      通し番号: 272,
      卦番号: 45,
      爻: "上六",
      爻辞: "齎咨涕洟。无咎。 （せいしてい。とがなし。） 意味：嘆き悲しみ、涙を流す。咎められることはない。（※解釈テキストでは「啼噓」）",
      現代解釈の要約:
        "賑やかだった集まりやプロジェクトが終わりを迎え、別れを惜しんで涙する。これは失敗ではなく、充実した時間の終わりを示す自然な感情であり、咎められることではない。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "終焉, 別れ, 感情の解放",
      親となる卦: "沢地萃",
      キーワードタグ: "別れ, 問題なし, 感情の解放, 終焉",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 24.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "地風升 初六",
      通し番号: 273,
      卦番号: 46,
      爻: "初六",
      爻辞: "允升。大吉。 （いんしょう。だいきち。） 意味：信じられて昇る。大いに吉。（※解釈テキストでは「升于階」）",
      現代解釈の要約:
        "物事の始まりにおいて、一歩一歩、階段を上るように地道な努力を積み重ねる。その着実なスタートが、周囲の信頼を呼び、最高の幸運に繋がる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "始まり, 基礎固め, 着実な努力",
      親となる卦: "地風升",
      キーワードタグ: "吉, 基礎固め, 始まり, 着実な努力",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "地風升 九二",
      通し番号: 274,
      卦番号: 46,
      爻: "九二",
      爻辞: "孚乃利用礜。无咎。 （まことあればすなわちやくをもちうるによろし。とがなし。） 意味：真心があれば、小さな供え物でも用いられる。咎めなし。",
      現代解釈の要約:
        "自分の能力を誇示せず、真心と誠実さをもって物事に取り組む。その姿勢が評価され、能力を活かす機会が与えられ、咎めなく物事が進む。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "誠実, 信頼, 地道な努力",
      親となる卦: "地風升",
      キーワードタグ: "信頼, 問題なし, 地道な努力, 誠実",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 80.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 76.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者あり",
    },
    {
      爻名: "地風升 九三",
      通し番号: 275,
      卦番号: 46,
      爻: "九三",
      爻辞: "升虚邑。 （きょゆうにのぼる。） 意味：空っぽの町に昇る。",
      現代解釈の要約:
        "実質が伴わないまま、外見だけを拡大しようとする。計画性のないまま、ただ上を目指すと、やがて行き詰まり、虚しい結果に終わる。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "虚飾, 実質不足, 空回り",
      親となる卦: "地風升",
      キーワードタグ: "実質不足, 空回り, 虚飾",
      S1_基本スコア: 33.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 76.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ: "状況:移行期, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "地風升 六四",
      通し番号: 276,
      卦番号: 46,
      爻: "六四",
      爻辞: "王用亨于岐山。吉无咎。 （おうもってきざんにきょうす。きちにしてとがなし。） 意味：王が岐山で祭りを行うのに用いる。吉にして咎めなし。",
      現代解釈の要約:
        "地道な努力と実績が、組織のトップや影響力のある人物（王）に認められ、重要な役割に抜擢される。大きな成果を上げるチャンス。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "抜擢, 承認, 功績",
      親となる卦: "地風升",
      キーワードタグ: "功績, 吉, 問題なし, 承認, 抜擢",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 35.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者なし",
    },
    {
      爻名: "地風升 六五",
      通し番号: 277,
      卦番号: 46,
      爻: "六五",
      爻辞: "貞吉。升階。 （ていきち。かいにのぼる。） 意味：正しくして吉。階段を昇る。（※解釈テキストでは「貞升」）",
      現代解釈の要約:
        "倫理的に正しい方法で、着実に昇進や成功を収めている、安定した成長期。物事が順調に進み、確固たる地位を築くことができる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "安定成長, 正道, 継続",
      親となる卦: "地風升",
      キーワードタグ: "吉, 安定成長, 正道, 継続",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 68.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "地風升 上六",
      通し番号: 278,
      卦番号: 46,
      爻: "上六",
      爻辞: "冥升。利于不息之貞。 （めいしょう。ふそくのていによろし。） 意味：盲目的に昇る。休むことなく正しくしていれば良い。（※解釈テキストでは「不利不恒貞」）",
      現代解釈の要約:
        "成功の極みで、もはや周りが見えず、盲目的に上だけを目指している危険な状態。現状維持なら良いが、これ以上無理に進むと、転落の危険がある。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "行き過ぎ, 慢心, 暴走",
      親となる卦: "地風升",
      キーワードタグ: "慢心, 暴走, 行き過ぎ",
      S1_基本スコア: 33.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "沢水困 初六",
      通し番号: 279,
      卦番号: 47,
      爻: "初六",
      爻辞: "臀困于株木。入于幽谷。三歳不覿。 （とんこんうしゅぼく。ゆうこくにいる。さんさいみず。） 意味：尻が切り株に困る。幽谷に入る。三年間も会えない。",
      現代解釈の要約:
        "困難の始まり。些細な問題が、長期的な停滞と孤立を招く。初期段階での誤った対処や放置が、深い困窮へと繋がることを示す。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "行き詰まり, 孤立, 長期停滞",
      親となる卦: "沢水困",
      キーワードタグ: "孤立, 行き詰まり, 長期停滞",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:黎明期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "沢水困 九二",
      通し番号: 280,
      卦番号: 47,
      爻: "九二",
      爻辞: "困于酒食。朱黻方来。利用享祀。征凶。无咎。 （こんうしゅくしょく。しゅふつまさにきたる。もってきょうしをなすによろし。ゆけばきょう。とがなし。） 意味：酒食に困る。赤い祭服の者が来る。祭祀に用いるのが良い。進めば凶。咎めなし。",
      現代解釈の要約:
        "物質的に困窮し、表面的な誘惑に惹かれやすい。しかし、それに頼らず、内なる精神性や誠実さを保ち、無理に進まなければ、咎めを免れる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "忍耐, 精神性, 誘惑への抵抗",
      親となる卦: "沢水困",
      キーワードタグ: "凶, 問題なし, 忍耐, 精神性, 誘惑への抵抗",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 65.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 75.0,
      S5_主体性: "能動",
      S6_変動性スコア: 60.0,
      S7_総合評価スコア: 38.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:安定期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "沢水困 六三",
      通し番号: 281,
      卦番号: 47,
      爻: "六三",
      爻辞: "困于石。拠于蒺藜。…不见其妻。凶。 （こんうせき。しつりによる。…そのさいをみず。きょう。） 意味：石に困る。イバラの上にいる。…妻に会えない。凶。",
      現代解釈の要約:
        "進退両難の極み。物理的にも精神的にも、全く身動きが取れず、がんじがらめの状態。信頼できる支えも失い、孤立無援に陥る。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "進退両難, 孤立無援, 絶望",
      親となる卦: "沢水困",
      キーワードタグ: "凶, 孤立無援, 絶望, 進退両難",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 75.0,
      S5_主体性: "受動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 16.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:移行期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "沢水困 九四",
      通し番号: 282,
      卦番号: 47,
      爻: "九四",
      爻辞: "来徐徐。困于金車。吝。有終。 （きたることじょじょ。きんしゃにくるしむ。りん。おわりあり。） 意味：ゆっくりとやって来る。金の車に困る。恥ずかしいが、終わりはある。",
      現代解釈の要約:
        "困難から抜け出すプロセスは非常に遅い。その過程で、新たな制約や課題に直面し、恥ずかしい思いもするが、粘り強く続ければ、最終的には良い結末を迎えられる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "忍耐, 慎重, 粘り強さ",
      親となる卦: "沢水困",
      キーワードタグ: "忍耐, 慎重, 粘り強さ",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 54.0,
      論理キーワードタグ: "状況:困窮状態, 状況:変革期, 力学:協力者あり",
    },
    {
      爻名: "沢水困 九五",
      通し番号: 283,
      卦番号: 47,
      爻: "九五",
      爻辞: "劓刖。困于赤紱。乃徐有説。利用祭祀。 （げいげつ。せきふつにくるしむ。すなわちじょじょにときあり。もってさいしをなすによろし。） 意味：鼻と足を切られる。赤い祭服の者に困る。徐々に解放される。祭祀に用いるのが良い。",
      現代解釈の要約:
        "問題解決のため、極度の犠牲や苦痛を強いられる。しかし、その最大の苦難を乗り越えることで、精神的に浄化され、状況は解放へと向かう。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "犠牲, 解放, 苦難の克服",
      親となる卦: "沢水困",
      キーワードタグ: "犠牲, 苦難の克服, 解放",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 70.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 52.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:絶頂期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "沢水困 上六",
      通し番号: 284,
      卦番号: 47,
      爻: "上六",
      爻辞: "困于葛藟。于臲卼。…悔有悔。征吉。 （こんうかつるい。げつごつにあり。…くいありてくいす。ゆけばきち。） 意味：クズのつるに絡まって困る。不安定だ。…悔い改めれば、進んで吉。",
      現代解釈の要約:
        "長い困窮の時期が終わり、解放され始める。まだ不安定で、過去のしがらみは残るが、これまでの経験を教訓とし、慎重に未来へ進めば、良い結果に繋がる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "反省, 軌道修正, 再出発",
      親となる卦: "沢水困",
      キーワードタグ: "再出発, 反省, 吉, 軌道修正",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 20.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:終極期, 力学:協力者なし, 心理:内省, 心理:慎重",
    },
    {
      爻名: "水風井 初六",
      通し番号: 285,
      卦番号: 48,
      爻: "初六",
      爻辞: "井泥不食。旧井无禽。 （せいれいしょくせず。きゅうせいきんなし。） 意味：井戸の泥水は飲めない。古い井戸には鳥も来ない。",
      現代解釈の要約:
        "組織やシステムが、手入れを怠ったために完全に機能不全に陥っている。誰からも見向きもされない、価値を失った状態。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "機能不全, 放置, 価値の喪失",
      親となる卦: "水風井",
      キーワードタグ: "価値の喪失, 放置, 機能不全",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "水風井 九二",
      通し番号: 286,
      卦番号: 48,
      爻: "九二",
      爻辞: "井谷射鮒。甕敝漏。 （せいこくしゃふ。おうやぶれてもる。） 意味：井戸の底でフナを射る。甕が破れて水が漏れる。",
      現代解釈の要約:
        "供給能力が不足し、提供できるものの質も低い。さらに、方法が非効率なため、貴重な資源や労力を無駄にしている状態。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "非効率, 資源不足, 無駄な努力",
      親となる卦: "水風井",
      キーワードタグ: "無駄な努力, 資源不足, 非効率",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者なし",
    },
    {
      爻名: "水風井 九三",
      通し番号: 287,
      卦番号: 48,
      爻: "九三",
      爻辞: "井渫不食。為我心惻。…可用汲。… （せいせつしょくせず。わがこころをいたましむ。…もってくむべし。…） 意味：井戸を清掃しても飲めない。心が痛む。…汲むことはできるのに。",
      現代解釈の要約:
        "問題を改善し、質の高いものを提供できる状態にはなったが、それが誰にも活用されず、機会損失となっている。非常にもどかしい状況。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "機会損失, 未活用, リーダーシップの不在",
      親となる卦: "水風井",
      キーワードタグ: "リーダーシップの不在, 未活用, 機会損失",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 64.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ: "状況:移行期, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "水風井 六四",
      通し番号: 288,
      卦番号: 48,
      爻: "六四",
      爻辞: "井甃。无咎。 （せいしゅう。とがなし。） 意味：井戸をレンガで整備する。咎められることはない。",
      現代解釈の要約:
        "供給システムやサービスの基盤を、より堅固で安定したものにするための、着実な改善を行っている。この地道な努力は正しく、咎められない。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "基盤強化, メンテナンス, 改善",
      親となる卦: "水風井",
      キーワードタグ: "メンテナンス, 問題なし, 基盤強化, 改善",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "水風井 九五",
      通し番号: 289,
      卦番号: 48,
      爻: "九五",
      爻辞: "井冽寒泉。食。 （せいれつかんせん。しょくす。） 意味：井戸の水が清らかで冷たい。飲める。",
      現代解釈の要約:
        "安定して、非常に質の高い製品やサービスを提供できている、理想的な状態。その恩恵は広く人々に行き渡り、喜ばれている。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "最高品質, 安定供給, 理想的な状態",
      親となる卦: "水風井",
      キーワードタグ: "安定供給, 最高品質, 理想的な状態",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 48.0,
      論理キーワードタグ: "状況:絶頂期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "水風井 上六",
      通し番号: 290,
      卦番号: 48,
      爻: "上六",
      爻辞: "井収勿幕。有孚元吉。 （せいおさめてまくするなかれ。まことあればげんきち。） 意味：井戸を汲み、蓋をしない。真心があれば大いに吉。",
      現代解釈の要約:
        "井戸の水を独り占めせず、常に開かれた状態で、必要な人々に広く恩恵を提供し続ける。その無私の貢献精神が、最高の幸運を招く。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "無私な貢献, 共有, 公共の利益",
      親となる卦: "水風井",
      キーワードタグ: "公共の利益, 共有, 吉, 無私な貢献",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "沢火革 初九",
      通し番号: 291,
      卦番号: 49,
      爻: "初九",
      爻辞: "鞏用黄牛之革。 （きょうにこうぎゅうのかわをもちう。） 意味：黄牛の革で固く縛りつける。",
      現代解釈の要約:
        "変革の必要性を感じても、まだ準備が不十分な初期段階。軽率な行動を厳しく律し、機が熟すのを待つべき時。今は動かず、足元を固める。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "抑制, 準備, 時機を待つ",
      親となる卦: "沢火革",
      キーワードタグ: "抑制, 時機を待つ, 準備",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 80.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ:
        "状況:変革期, 状況:黎明期, 力学:下剋上リスク, 力学:協力者なし, アクション:準備",
    },
    {
      爻名: "沢火革 六二",
      通し番号: 292,
      卦番号: 49,
      爻: "六二",
      爻辞: "巳日乃革之。征吉。无咎。 （きじつすなわちこれをあらたむ。ゆけばきち。とがなし。） 意味：適切な日が来て、これを革める。進んで吉。咎めなし。",
      現代解釈の要約:
        "準備が整い、機運が熟した最高のタイミングで、変革に着手する。多くの支持を得て、計画はスムーズに進展し、大きな成功を収める。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "絶好の機会, 実行, 成功",
      親となる卦: "沢火革",
      キーワードタグ: "吉, 問題なし, 実行, 成功, 絶好の機会",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 84.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 24.0,
      S7_総合評価スコア: 74.0,
      論理キーワードタグ:
        "状況:変革期, 状況:安定期, 力学:協力者あり, 力学:順当な力関係, アクション:準備",
    },
    {
      爻名: "沢火革 九三",
      通し番号: 293,
      卦番号: 49,
      爻: "九三",
      爻辞: "征凶。貞厲。革言三就。有孚。 （ゆけばきょう。ていあやうし。かくげんさんにつく。まことあり。） 意味：進めば凶。正しくても危うい。変革の言葉を三度熟考すれば、真心がある。",
      現代解釈の要約:
        "状況判断を誤り、焦って性急に変革を進めようとすると、大きな失敗や混乱を招く。独断専行は絶対に避けるべき、最悪のタイミング。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "時期尚早, 独断専行, 失敗",
      親となる卦: "沢火革",
      キーワードタグ: "リスクあり, 凶, 失敗, 時期尚早, 独断専行",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 80.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ:
        "状況:変革期, 状況:移行期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "沢火革 九四",
      通し番号: 294,
      卦番号: 49,
      爻: "九四",
      爻辞: "悔亡。有孚。改命吉。 （くいほろぶ。まことあり。めいをあらたむるはきち。） 意味：悔いがなくなる。真心がある。命令（方針）を改めれば吉。",
      現代解釈の要約:
        "これまでの困難を乗り越え、変革が軌道に乗る。旧来のやり方を、新しい効果的な方針に転換することで、過去の後悔が消え、成功を確実にする。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "改革成功, 信頼回復, 新体制",
      親となる卦: "沢火革",
      キーワードタグ: "信頼回復, 吉, 改革成功, 新体制",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 38.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:変革期, 力学:協力者なし, 心理:内省",
    },
    {
      爻名: "沢火革 九五",
      通し番号: 295,
      卦番号: 49,
      爻: "九五",
      爻辞: "大人虎変。未占有孚。 （たいじんこへんす。いまだうらなわずしてまことあり。） 意味：大人が虎のように変わる。占うまでもなく真心がある。",
      現代解釈の要約:
        "リーダーが自ら率先して、虎の模様のように鮮やかに、劇的な自己変革を遂げる。その姿が周囲の模範となり、絶対的な信頼を得る、理想的なリーダーシップ。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "カリスマ, リーダーシップ, 劇的な変化",
      親となる卦: "沢火革",
      キーワードタグ: "カリスマ, リーダーシップ, 劇的な変化",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 85.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 68.0,
      論理キーワードタグ:
        "状況:変革期, 状況:絶頂期, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "沢火革 上六",
      通し番号: 296,
      卦番号: 49,
      爻: "上六",
      爻辞: "君子豹変。小人革面。征凶。居貞吉。 （くんしひょうへんす。しょうじんめんをあらたむ。ゆけばきょう。ていにいればきち。） 意味：君子は豹のように変わる。小人は態度を変える。進めば凶。留まれば吉。",
      現代解釈の要約:
        "大規模な改革が一段落した後の段階。再び性急な変化を求めず、改革の成果を定着させ、維持することに注力すべき時。現状維持が吉となる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "安定化, 仕上げ, 現状維持",
      親となる卦: "沢火革",
      キーワードタグ: "仕上げ, 凶, 吉, 安定化, 現状維持",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 65.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ:
        "状況:変革期, 状況:終極期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "火風鼎 初六",
      通し番号: 297,
      卦番号: 50,
      爻: "初六",
      爻辞: "鼎顛趾。利出否。得妾以其子。无咎。 （ていてんし。ひをいだすによろし。しょうをそのこをもってう。とがなし。） 意味：鼎がひっくり返る。悪いものを出すのが良い。妾を娶りその子を得る。咎めなし。",
      現代解釈の要約:
        "組織や計画の立ち上げ期。基盤が不安定で、まず古い悪い要素を排除する必要がある。時には非正規な手段も必要だが、目的が正しければ咎められない。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "基盤の不安定さ, 問題の排除, 始まり",
      親となる卦: "火風鼎",
      キーワードタグ: "問題なし, 問題の排除, 基盤の不安定さ, 始まり",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 60.0,
      論理キーワードタグ:
        "状況:停滞期, 状況:黎明期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "火風鼎 九二",
      通し番号: 298,
      卦番号: 50,
      爻: "九二",
      爻辞: "鼎有実。我仇有疾。不我能即。吉。 （ていにじつあり。わがあだにやまいあり。われにつくことあたわず。きち。） 意味：鼎に実がある。我が敵に病がある。私を害せない。吉。",
      現代解釈の要約:
        "組織やプロジェクトに、技術や人材といった本質的な内容（実）が充実している状態。その実力により、競合相手を寄せ付けず、安定した地位を築ける。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "実力, 内容の充実, 競争力",
      親となる卦: "火風鼎",
      キーワードタグ: "内容の充実, 吉, 実力, 競争力",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 70.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 72.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者あり",
    },
    {
      爻名: "火風鼎 九三",
      通し番号: 299,
      卦番号: 50,
      爻: "九三",
      爻辞: "鼎耳革。其行塞。…終吉。 （ていじかく。そのこうふさがる。…おわりにきち。） 意味：鼎の耳が取れる。その行動は行き詰まる。…最終的には吉。",
      現代解釈の要約:
        "外部との連携やコミュニケーションがうまくいかず、一時的に孤立し、物事が停滞する。しかし、内部の問題を改善すれば、最終的には良い結果に繋がる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "コミュニケーション不全, 停滞, 内部改革",
      親となる卦: "火風鼎",
      キーワードタグ: "コミュニケーション不全, 停滞, 内部改革, 吉",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 72.0,
      S7_総合評価スコア: 30.0,
      論理キーワードタグ: "状況:変革期, 状況:移行期, 力学:協力者なし",
    },
    {
      爻名: "火風鼎 九四",
      通し番号: 300,
      卦番号: 50,
      爻: "九四",
      爻辞: "鼎折足。覆公餗。其形渥。凶。 （ていせっそく。こうしょくをおおう。そのかたちあく。きょう。） 意味：鼎の足が折れる。公のご馳走をひっくり返す。その様は醜い。凶。",
      現代解釈の要約:
        "組織の根幹を支える重要な人材や資金、技術（足）が破綻する。全体が崩壊し、これまでの成果を全て台無しにする、取り返しのつかない大失敗。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "崩壊, 大失敗, 責任問題",
      親となる卦: "火風鼎",
      キーワードタグ: "凶, 大失敗, 崩壊, 責任問題",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 60.0,
      S7_総合評価スコア: 36.0,
      論理キーワードタグ: "状況:変革期, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "火風鼎 六五",
      通し番号: 301,
      卦番号: 50,
      爻: "六五",
      爻辞: "鼎黄耳金鉉。利貞。 （ていこうじきんげん。ていによろし。） 意味：鼎に黄色い耳と金のつる。正しくして良い。（※解釈テキストでは「鼎黄耳。亨。貞吉」）",
      現代解釈の要約:
        "リーダーが公正で偏りのない態度（黄）で人々をまとめ、深い信頼（耳）を得ている。組織全体が健全に機能し、持続的な発展が見込める理想的な状態。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "賢明なリーダー, 公正, 信頼",
      親となる卦: "火風鼎",
      キーワードタグ: "信頼, 公正, 吉, 賢明なリーダー",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 70.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 0.0,
      S7_総合評価スコア: 76.0,
      論理キーワードタグ:
        "状況:絶頂期, 力学:協力者あり, 力学:順当な力関係, 心理:正道堅持",
    },
    {
      爻名: "火風鼎 上九",
      通し番号: 302,
      卦番号: 50,
      爻: "上九",
      爻辞: "鼎玉鉉。大吉。无不利。 （ていぎょくげん。だいきち。ふりなきなし。） 意味：鼎に玉のつる。大いに吉。不利なことはない。",
      現代解釈の要約:
        "組織やプロジェクトが最高の状態で完成し、その存在そのものが、宝石（玉）のように普遍的で、精神的な価値を持つに至る。究極の成功。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "究極の完成, 普遍的価値, 栄誉",
      親となる卦: "火風鼎",
      キーワードタグ: "吉, 普遍的価値, 栄誉, 究極の完成",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 30.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "震為雷 初九",
      通し番号: 303,
      卦番号: 51,
      爻: "初九",
      爻辞: "震来虩虩。後笑言哑哑。吉。 （しんきたりてげきげき。のちにしょうげんああ。きち。） 意味：雷が来ておびえる。後にはにこやかに談笑する。吉。",
      現代解釈の要約:
        "予期せぬ衝撃に最初は混乱し、怯える。しかし、冷静に対処し、乗り越えることで、最終的には安心感と自信を得て、笑い話にできる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "衝撃, 冷静な対応, 克服",
      親となる卦: "震為雷",
      キーワードタグ: "克服, 冷静な対応, 吉, 衝撃",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 68.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ: "状況:黎明期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "震為雷 六二",
      通し番号: 304,
      卦番号: 51,
      爻: "六二",
      爻辞: "震来厲。億喪貝。躋于九陵。勿逐。七日得。 （しんきたりてあやうし。おくそうかい。きゅうりゅうにのぼる。おうなかれ。しちじつう。） 意味：雷が来て危うい。財産を失う。高い丘に登る。追うな。七日で取り戻せる。",
      現代解釈の要約:
        "衝撃的な出来事によって、大きな損害を被る。しかし、焦って損失を取り戻そうとせず、冷静に安全な場所で待機すれば、いずれ回復できる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "損失, 忍耐, 危機",
      親となる卦: "震為雷",
      キーワードタグ: "リスクあり, 危機, 忍耐, 損失",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 50.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 48.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者なし",
    },
    {
      爻名: "震為雷 六三",
      通し番号: 305,
      卦番号: 51,
      爻: "六三",
      爻辞: "震蘇蘇。震行无眚。 （しんそそ。しんとしてゆけばわざわいなし。） 意味：雷が来て恐れおののく。震えながらも行動すれば災いはない。",
      現代解釈の要約:
        "極度の恐怖や不安に囚われ、行動をためらってしまう。しかし、その恐れを乗り越え、勇気を出して一歩踏み出せば、災いを避けることができる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "覚醒, 行動力, 危機対応",
      親となる卦: "震為雷",
      キーワードタグ: "危機対応, 行動力, 覚醒",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 64.0,
      S7_総合評価スコア: 24.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "震為雷 九四",
      通し番号: 306,
      卦番号: 51,
      爻: "九四",
      爻辞: "震遂泥。 （しんついでい。） 意味：雷が泥沼に落ちる。",
      現代解釈の要約:
        "衝撃的な出来事の後、混乱した状況から抜け出せず、身動きが取れない泥沼の状態に陥る。エネルギーが空転し、何の進展もない。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "泥沼, 停滞, 無力",
      親となる卦: "震為雷",
      キーワードタグ: "停滞, 泥沼, 無力",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 28.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 72.0,
      S7_総合評価スコア: 28.0,
      論理キーワードタグ: "状況:変革期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "震為雷 六五",
      通し番号: 307,
      卦番号: 51,
      爻: "六五",
      爻辞: "震往来厲。億无喪。有事。 （しんおうらいあやうし。おくそうなし。ことあり。） 意味：雷が行き来して危うい。億万を失わない。仕事がある。（※解釈テキストでは「中心勿動」）",
      現代解釈の要約:
        "困難な状況が続くが、その中でこそ、内面的な平静と堅固な意志を保つ。外部の混乱に惑わされず、冷静に対処することで、危機を乗り越える。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "不動心, 精神力, 困難の継続",
      親となる卦: "震為雷",
      キーワードタグ: "リスクあり, 不動心, 困難の継続, 精神力",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 45.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 50.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 46.0,
      論理キーワードタグ: "状況:困窮状態, 状況:絶頂期, 力学:協力者なし",
    },
    {
      爻名: "震為雷 上六",
      通し番号: 308,
      卦番号: 51,
      爻: "上六",
      爻辞: "震索索。視矍矍。征凶。… （しんさくさく。しきょくきょく。ゆけばきょう。…） 意味：雷が来て疲弊する。目は驚いて落ち着かない。進めば凶。",
      現代解釈の要約:
        "長く続いた衝撃や混乱が終わりつつあるが、心身ともに極度に疲弊している。この状態で焦って新たな行動に移ると、かえって失敗を招く。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "疲弊, 消耗, 休息が必要",
      親となる卦: "震為雷",
      キーワードタグ: "休息が必要, 凶, 消耗, 疲弊",
      S1_基本スコア: 33.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 75.0,
      S5_主体性: "能動",
      S6_変動性スコア: 68.0,
      S7_総合評価スコア: 16.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "艮為山 初六",
      通し番号: 309,
      卦番号: 52,
      爻: "初六",
      爻辞: "艮其趾。无咎。利永貞。 （そのしをげんす。とがなし。えいていによろし。） 意味：その足の指で止まる。咎めなし。永く正しくしていればよい。",
      現代解釈の要約:
        "物事の始まり。焦って行動せず、まず足元で一旦立ち止まる。その慎重な第一歩が、後の過ちを防ぎ、咎められない良いスタートとなる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "慎重, 始まり, 自己抑制",
      親となる卦: "艮為山",
      キーワードタグ: "問題なし, 始まり, 慎重, 自己抑制",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 36.0,
      論理キーワードタグ:
        "状況:黎明期, 力学:下剋上リスク, 力学:協力者なし, 心理:慎重, 心理:正道堅持",
    },
    {
      爻名: "艮為山 六二",
      通し番号: 310,
      卦番号: 52,
      爻: "六二",
      爻辞: "艮其腓。不拯其随。其心不快。 （そのひをげんす。そのずいをすくわず。そのこころふかい。） 意味：そのふくらはぎで止まる。その追随するものを救えない。その心は不快。",
      現代解釈の要約:
        "行動を止めようとするが、意志が弱く、周囲に引きずられて完全に止まることができない。思うように自己を律せず、内心で不満を感じる状態。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "葛藤, 不完全, 不満",
      親となる卦: "艮為山",
      キーワードタグ: "不完全, 不満, 葛藤",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 54.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者なし",
    },
    {
      爻名: "艮為山 九三",
      通し番号: 311,
      卦番号: 52,
      爻: "九三",
      爻辞: "艮其限。列其夤。厲薰心。 （そのげんをげんす。そのいんをれつす。あやうくこころをやく。） 意味：その限界で止まる。背骨が裂けるように。危うく心が焼け付く。",
      現代解釈の要約:
        "自己抑制が極限に達し、精神的、物理的な限界を感じる。無理な我慢によって心身が疲弊し、感情が爆発する危険性もある、非常に苦しい状態。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "限界, 苦痛, 危険",
      親となる卦: "艮為山",
      キーワードタグ: "リスクあり, 危険, 苦痛, 限界",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 70.0,
      S5_主体性: "受動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 18.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "艮為山 六四",
      通し番号: 312,
      卦番号: 52,
      爻: "六四",
      爻辞: "艮其身。无咎。 （そのみをげんす。とがなし。） 意味：その身全体で止まる。咎めはない。",
      現代解釈の要約:
        "外部の誘惑や内なる感情に流されず、自分の全身（行動、思考、感情）を完全に抑制し、静止する。無益な争いから身を守る、賢明な状態。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "自己制御, 冷静, 内省",
      親となる卦: "艮為山",
      キーワードタグ: "内省, 冷静, 問題なし, 自己制御",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 28.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 72.0,
      S7_総合評価スコア: 28.0,
      論理キーワードタグ: "状況:変革期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "艮為山 六五",
      通し番号: 313,
      卦番号: 52,
      爻: "六五",
      爻辞: "艮其輔。言有序。悔亡。 （そのほをげんす。げんにじょあり。くいほろぶ。） 意味：その顎（言葉）で止まる。言葉に秩序がある。悔いがなくなる。",
      現代解釈の要約:
        "不用意な発言や無益な議論を避け、言葉を慎重に選ぶ。その冷静で的確な言葉遣いが、周囲からの信頼を得て、後悔のない結果を生む。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "言葉の抑制, 信頼, 慎重な発言",
      親となる卦: "艮為山",
      キーワードタグ: "信頼, 慎重な発言, 言葉の抑制",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 45.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 48.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者なし, 心理:内省, 心理:慎重",
    },
    {
      爻名: "艮為山 上九",
      通し番号: 314,
      卦番号: 52,
      爻: "上九",
      爻辞: "敦艮。吉。 （とんげん。きち。） 意味：篤く止まる。吉。",
      現代解釈の要約:
        "外部の状況に全く左右されず、完全に心穏やかで、精神的に充実した最高の静止状態。世俗的な欲望を超越した、究極の境地。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "精神的充実, 完成, 泰然自若",
      親となる卦: "艮為山",
      キーワードタグ: "吉, 完成, 泰然自若, 精神的充実",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 24.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "風山漸 初六",
      通し番号: 315,
      卦番号: 53,
      爻: "初六",
      爻辞: "鴻漸于干。小子厲。有言。无咎。 （こうぜんうかん。しょうしあやうし。げんあり。とがなし。） 意味：鴻が水辺に進む。若者は危ういが、言葉があれば咎めなし。",
      現代解釈の要約:
        "物事の始まり。まず安全な場所で足場を固める。未熟な者は危険だが、指導者の適切な助言があれば、問題なくスタートを切れる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "始まり, 慎重, 指導",
      親となる卦: "風山漸",
      キーワードタグ: "リスクあり, 問題なし, 始まり, 慎重, 指導",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 50.0,
      S5_主体性: "能動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者なし",
    },
    {
      爻名: "風山漸 六二",
      通し番号: 316,
      卦番号: 53,
      爻: "六二",
      爻辞: "鴻漸于磐。飲食衎衎。吉。 （こうぜんうばん。いんしょくかんかん。きち。） 意味：鴻が磐石に進む。飲食して楽しむ。吉。",
      現代解釈の要約:
        "初期の準備が実を結び、強固で安定した基盤を築き上げた状態。仲間と共に成果を分かち合い、喜びを享受できる、非常に幸運な時期。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "安定, 基盤確立, 共有",
      親となる卦: "風山漸",
      キーワードタグ: "共有, 吉, 基盤確立, 安定",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 70.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 58.0,
      論理キーワードタグ:
        "状況:安定期, 力学:下剋上リスク, 力学:協力者あり, アクション:準備",
    },
    {
      爻名: "風山漸 九三",
      通し番号: 317,
      卦番号: 53,
      爻: "九三",
      爻辞: "鴻漸于陸。夫征不復。婦孕不育。凶。… （こうぜんうりく。おっとゆきてふくせず。ふはらみていくせず。きょう。…） 意味：鴻が陸地に進む。夫は出かけて戻らず、妻は妊娠しても育てられない。凶。",
      現代解釈の要約:
        "順調な中で、自分の能力を過信し、危険で不適切な場所へ進んでしまう。その無謀な行動が、取り返しのつかない失敗や、将来の破綻を招く。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "無謀, 危険な選択, 破綻",
      親となる卦: "風山漸",
      キーワードタグ: "凶, 危険な選択, 無謀, 破綻",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 75.0,
      S5_主体性: "能動",
      S6_変動性スコア: 64.0,
      S7_総合評価スコア: 16.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "風山漸 六四",
      通し番号: 318,
      卦番号: 53,
      爻: "六四",
      爻辞: "鴻漸于木。或得其桷。无咎。 （こうぜんうぼく。あるいはそのかくをう。とがなし。） 意味：鴻が木に進む。あるいは平らな枝を得る。咎めはない。",
      現代解釈の要約:
        "一時的な調整期間を経て、より安全で安定した場所へ移る。次の大きな飛躍に備え、適切な足場を確保する、賢明な判断。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "準備期間, 足場固め, 賢明な判断",
      親となる卦: "風山漸",
      キーワードタグ: "問題なし, 準備期間, 賢明な判断, 足場固め",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 28.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 72.0,
      S7_総合評価スコア: 28.0,
      論理キーワードタグ: "状況:変革期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "風山漸 九五",
      通し番号: 319,
      卦番号: 53,
      爻: "九五",
      爻辞: "鴻漸于陵。婦三歳不孕。終莫之勝。吉。 （こうぜんうりょう。ふさんさいはらまず。おわりにこれにかつものなし。きち。） 意味：鴻が丘に進む。妻は三年間妊娠しない。最終的には打ち勝つ。吉。",
      現代解釈の要約:
        "最高の地位に到達するが、そこでは一時的に成果が出ない、忍耐の時期が伴う。しかし、その試練を乗り越えれば、最終的に誰もが認める勝利を収める。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "試練, 忍耐, 最終的な勝利",
      親となる卦: "風山漸",
      キーワードタグ: "吉, 忍耐, 最終的な勝利, 試練",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 68.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者あり, 心理:忍耐",
    },
    {
      爻名: "風山漸 上九",
      通し番号: 320,
      卦番号: 53,
      爻: "上九",
      爻辞: "鴻漸于逵。其羽可用為儀。吉。 （こうぜんうき。そのはねもってぎとなすべし。きち。） 意味：鴻が天空に昇る。その羽は儀式に用いることができる。吉。",
      現代解釈の要約:
        "長年の努力が完全に実を結び、目標が達成される。その功績や生き様が、広く社会の模範となり、尊敬を集める、最高の完成形。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "完成, 模範, 栄誉",
      親となる卦: "風山漸",
      キーワードタグ: "吉, 完成, 栄誉, 模範",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 24.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "雷沢帰妹 初九",
      通し番号: 321,
      卦番号: 54,
      爻: "初九",
      爻辞: "帰妹以娣。跛能履。征吉。 （きまいしていをもってす。はよくふむ。ゆけばきち。） 意味：妹を副妻として嫁がせる。足が不自由でも歩ける。進んで吉。",
      現代解釈の要約:
        "正統ではない、少し無理のある形でのスタート。不完全な状況でも、それをわきまえた上で、慎重に進めば、当面の目的は達成できる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "不完全なスタート, 次善の策, 前進",
      親となる卦: "雷沢帰妹",
      キーワードタグ: "不完全なスタート, 前進, 吉, 次善の策",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 64.0,
      S7_総合評価スコア: 36.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者なし, 心理:慎重",
    },
    {
      爻名: "雷沢帰妹 九二",
      通し番号: 322,
      卦番号: 54,
      爻: "九二",
      爻辞: "眇能視。利幽人之貞。 （びょうよくみる。ゆうじんのていによろし。） 意味：片目でも物を見る。隠遁者の正しさが良い。",
      現代解釈の要約:
        "限られた情報しかなく、全体を見通せていない状態。この状況で下手に動くよりは、静かに自分の本分を守り、状況を静観する方が賢明である。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "自己認識, 静観, 慎重",
      親となる卦: "雷沢帰妹",
      キーワードタグ: "慎重, 自己認識, 静観",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 65.0,
      S3_安定性スコア: 84.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 0.0,
      S7_総合評価スコア: 78.0,
      論理キーワードタグ:
        "状況:安定期, 力学:協力者あり, 力学:順当な力関係, 心理:正道堅持",
    },
    {
      爻名: "雷沢帰妹 六三",
      通し番号: 323,
      卦番号: 54,
      爻: "六三",
      爻辞: "帰妹以須。反帰以娣。 （きまいじしゅをもってす。かえりてていをもってかえる。） 意味：（無理に）待たせて嫁がせる。戻って副妻を伴う。",
      現代解釈の要約:
        "軽はずみな約束や行動が原因で、関係がこじれ、混乱している。当初の計画が頓挫し、不適切な妥協や、さらなる混乱を招く修正を余儀なくされる。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "低い評価, 停滞, 不満",
      親となる卦: "雷沢帰妹",
      キーワードタグ: "不満, 低い評価, 停滞",
      S1_基本スコア: 33.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 20.0,
      S4_リスク: 75.0,
      S5_主体性: "受動",
      S6_変動性スコア: 76.0,
      S7_総合評価スコア: 16.0,
      論理キーワードタグ: "状況:移行期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "雷沢帰妹 九四",
      通し番号: 324,
      卦番号: 54,
      爻: "九四",
      爻辞: "帰妹愆期。遅帰有時。 （きまいきをあやまる。おくれてかえるにときあり。） 意味：嫁ぐ時期を誤る。遅れて嫁ぐ時がある。（※解釈テキストでは「帰妹牖」）",
      現代解釈の要約:
        "正式なルートではなく、水面下で関係性を進める。物事がスムーズに進まず時間はかかるが、焦らず慎重に進めれば、大きな問題にはならない。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "非公式ルート, 時間がかかる, 忍耐",
      親となる卦: "雷沢帰妹",
      キーワードタグ: "忍耐, 時間がかかる, 非公式ルート",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ:
        "状況:変革期, 力学:協力者なし, 力学:順当な力関係, 心理:慎重",
    },
    {
      爻名: "雷沢帰妹 六五",
      通し番号: 325,
      卦番号: 54,
      爻: "六五",
      爻辞: "帝乙帰妹。其君之袂。不如其娣之袂良。… （ていいつきまい。そのくんのたもと、そのていのたもとのよきにしかず。…） 意味：帝乙が妹を嫁がせる。その君主の袖は、副妻の袖ほど良くない。",
      現代解釈の要約:
        "高い地位にあるリーダーが、外見的な華やかさや地位にこだわりすぎ、内面的な実質や誠実さを軽んじてしまう。その結果、かえって失敗を招く危険性。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "虚飾, 本質軽視, 判断ミス",
      親となる卦: "雷沢帰妹",
      キーワードタグ: "判断ミス, 本質軽視, 虚飾",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 75.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 78.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者あり",
    },
    {
      爻名: "雷沢帰妹 上六",
      通し番号: 326,
      卦番号: 54,
      爻: "上六",
      爻辞: "女承筐无實。士刲羊无血。 （じょきょうをうけてじつなし。しようをえぐりてちなし。） 意味：女は籠を受けるが中身はなく、士は羊を裂くが血が出ない。（※解釈テキストでは「无實」）",
      現代解釈の要約:
        "中身や本質が伴わない、見せかけだけの関係性や行動の末路。最終的に全てが破綻し、何の価値も生み出さない、空虚な結末。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "空虚, 破綻, 無意味",
      親となる卦: "雷沢帰妹",
      キーワードタグ: "無意味, 破綻, 空虚",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 68.0,
      S7_総合評価スコア: 26.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "雷火豊 初九",
      通し番号: 327,
      卦番号: 55,
      爻: "初九",
      爻辞: "遇其配主。雖旬无咎。往有尚。 （そのはいしゅにあう。じゅんといえどもとがなし。ゆけばたっとばるることあり。） 意味：その良き相手に出会う。十日（対等）でも咎めなし。進めば賞賛される。",
      現代解釈の要約:
        "繁栄の始まりにおいて、能力と志を同じくする、最高のパートナーと出会う。迅速に協力関係を築き、共に行動することで、大きな成功と賞賛を得られる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "パートナーシップ, 最高の出会い, 始まり",
      親となる卦: "雷火豊",
      キーワードタグ: "パートナーシップ, 問題なし, 始まり, 最高の出会い",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 80.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ: "状況:黎明期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "雷火豊 六二",
      通し番号: 328,
      卦番号: 55,
      爻: "六二",
      爻辞: "豊其蔀。日中見斗。…有孚発若吉。 （ほうきほう。にっちゅうにとをみる。…まことあればひらけばきち。） 意味：その覆いが豊か。真昼に北斗七星が見える。…真心があれば発して吉。",
      現代解釈の要約:
        "表面上は豊かだが、問題が隠蔽され、真実が見えにくい不透明な状況。周囲から疑われるが、真心をもって誠実に対応し、情報を開示すれば、事態は好転する。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "不透明さ, 疑念, 誠実, 問題解決",
      親となる卦: "雷火豊",
      キーワードタグ: "不透明さ, 吉, 問題解決, 疑念, 誠実",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 72.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 24.0,
      S7_総合評価スコア: 58.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "雷火豊 九三",
      通し番号: 329,
      卦番号: 55,
      爻: "九三",
      爻辞: "豊其沛。日中見昧。折其右肱。无咎。 （ほうきはい。にっちゅうにまいをみる。そのゆうこうをおる。とがなし。） 意味：その覆いが大きい。真昼に暗闇を見る。その右腕を折る。咎めなし。",
      現代解釈の要約:
        "繁栄の陰で、問題や不正を隠そうとした結果、組織の重要な人材や機能（右腕）を損なう。痛みを伴うが、膿を出すことで、これ以上の咎めは免れる。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "犠牲, 損失, 危機管理",
      親となる卦: "雷火豊",
      キーワードタグ: "危機管理, 問題なし, 損失, 犠牲",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 46.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者あり",
    },
    {
      爻名: "雷火豊 九四",
      通し番号: 330,
      卦番号: 55,
      爻: "九四",
      爻辞: "豊其蔀。日中見斗。遇其夷主。吉。 （ほうきほう。にっちゅうにとをみる。そのいしゅにあう。きち。） 意味：その覆いが豊か。真昼に北斗七星を見る。その平等な主君に出会う。吉。",
      現代解釈の要約:
        "不透明で混乱した状況の中で、公正な視点を持つ、信頼できるリーダーや協力者（夷主）と出会う。その助けによって、問題解決の糸口が見つかり、状況は好転する。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "協力者, 賢明な判断, 混乱の収束",
      親となる卦: "雷火豊",
      キーワードタグ: "協力者, 吉, 混乱の収束, 賢明な判断",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 28.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 84.0,
      S7_総合評価スコア: 28.0,
      論理キーワードタグ: "状況:変革期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "雷火豊 六五",
      通し番号: 331,
      卦番号: 55,
      爻: "六五",
      爻辞: "来章。有慶誉。吉。 （しょうをきたす。けいよあり。きち。） 意味：文が来る。慶びと誉れがある。吉。",
      現代解釈の要約:
        "これまでの努力が実を結び、最高の繁栄と名声（慶誉）を得る。その成果は広く社会に認められ、文化的な価値を持つまでに輝く、理想的な成功。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "最高の栄誉, 名声, 成功",
      親となる卦: "雷火豊",
      キーワードタグ: "吉, 名声, 成功, 最高の栄誉",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 45.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 52.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者なし",
    },
    {
      爻名: "雷火豊 上六",
      通し番号: 332,
      卦番号: 55,
      爻: "上六",
      爻辞: "豊其屋。蔀其家。窺其戸。闃其无人。…凶。 （そのおくをゆたかにす。そのいえをおおう。そのこをうかがう。げきとしてひとなし。…きょう。） 意味：その家を豊かにする。その家を覆う。戸を覗いても誰もいない。…凶。",
      現代解釈の要約:
        "成功のあまり、外部との交流を断ち、内側に閉じこもる。表面的な華やかさだけが残り、内部は空虚になり、完全に孤立してしまう、繁栄の末の破滅。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "孤立, 虚飾, 破滅",
      親となる卦: "雷火豊",
      キーワードタグ: "凶, 孤立, 破滅, 虚飾",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 65.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "火山旅 初六",
      通し番号: 333,
      卦番号: 56,
      爻: "初六",
      爻辞: "旅瑣瑣。斯其所取災。 （りょささ。これそのわざわいをところ。） 意味：旅人が細々としている。そのために災いを招く。",
      現代解釈の要約:
        "旅の始まりで、些細なことばかりに心を奪われ、大局的な視点を持てない。その卑屈で余裕のない態度が、かえってトラブルを引き寄せる。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "些細なこと, 視野の狭さ, 災い",
      親となる卦: "火山旅",
      キーワードタグ: "些細なこと, 災い, 視野の狭さ",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 40.0,
      S7_総合評価スコア: 52.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者あり",
    },
    {
      爻名: "火山旅 六二",
      通し番号: 334,
      卦番号: 56,
      爻: "六二",
      爻辞: "旅即次。懐其資。得童僕貞。 （りょにしてつきにつく。そのしをいだく。どうぼくをえててい。） 意味：旅で宿に着く。懐に資金がある。忠実な若い召使いを得る。",
      現代解釈の要約:
        "旅の途中で、一時的に安全な場所を見つけ、必要な資源も確保できている。さらに、信頼できる協力者も得られる、恵まれた安定期。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "休息, 安定, 協力者",
      親となる卦: "火山旅",
      キーワードタグ: "休息, 協力者, 安定",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 72.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 12.0,
      S7_総合評価スコア: 58.0,
      論理キーワードタグ:
        "状況:安定期, 力学:協力者なし, 力学:順当な力関係, 心理:正道堅持",
    },
    {
      爻名: "火山旅 九三",
      通し番号: 335,
      卦番号: 56,
      爻: "九三",
      爻辞: "旅焚其次。喪其童僕貞。厲。 （りょそのつきをやき、そのどうぼくのていをうしなう。あやうし。） 意味：旅人がその宿を燃やす。忠実な召使いを失う。危うい。",
      現代解釈の要約:
        "旅のストレスや傲慢さから、感情的に行動し、自らの居場所や、せっかく築いた信頼関係を破壊してしまう。自滅的な行動であり、非常に危険。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "自滅, 傲慢, 信頼喪失",
      親となる卦: "火山旅",
      キーワードタグ: "リスクあり, 信頼喪失, 傲慢, 自滅",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 70.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 24.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者なし, 心理:正道堅持",
    },
    {
      爻名: "火山旅 九四",
      通し番号: 336,
      卦番号: 56,
      爻: "九四",
      爻辞: "旅于処。得其資斧。我心不快。 （りょしょにあり。そのしふをう。わがこころふかい。） 意味：旅人が仮の宿にいる。その財産と武器を得る。私の心は不快だ。",
      現代解釈の要約:
        "ある程度の安定と必要な資源は確保できたが、そこは真の安住の地ではない。心が満たされず、常に不安や不満を抱えている、中途半端な状態。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "仮の宿, 不満, 精神的葛藤",
      親となる卦: "火山旅",
      キーワードタグ: "不満, 仮の宿, 精神的葛藤",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 60.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ: "状況:変革期, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "火山旅 六五",
      通し番号: 337,
      卦番号: 56,
      爻: "六五",
      爻辞: "射雉一矢亡。終以誉命。 （いをいていっしをうしなう。おわりにもってほまれとめいをう。） 意味：雉を射て一本の矢で仕留める。最終的に誉れと使命を得る。",
      現代解釈の要約:
        "旅の途中で、その優れた能力を発揮し、見事な成果を上げる。その実力が認められ、周囲から高い評価と、新たな役割や地位を与えられる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "実力発揮, 成功, 名声, 抜擢",
      親となる卦: "火山旅",
      キーワードタグ: "名声, 実力発揮, 成功, 抜擢",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 45.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 24.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "火山旅 上九",
      通し番号: 338,
      卦番号: 56,
      爻: "上九",
      爻辞: "鳥焚其巣。旅人先笑後号咷。…凶。 （とりそのすをやき、りょじんさきにわらいのちにごうとうす。…きょう。） 意味：鳥がその巣を燃やす。旅人は初め笑い、後で泣き叫ぶ。…凶。",
      現代解釈の要約:
        "旅の成功に油断し、軽率な行動を取った結果、帰るべき場所や、築き上げてきた基盤を全て失う。最初は楽観していても、やがて絶望に変わる、悲劇的な結末。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "油断, 喪失, 破滅",
      親となる卦: "火山旅",
      キーワードタグ: "凶, 喪失, 油断, 破滅",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 75.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 18.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "巽為風 初六",
      通し番号: 339,
      卦番号: 57,
      爻: "初六",
      爻辞: "進退。利武人之貞。 （しんたい。ぶじんのていによろし。） 意味：進んだり退いたりする。武人の正しさが良い。",
      現代解釈の要約:
        "新しい状況で、どう行動すべきか迷い、進むか退くか決めかねている。この優柔不断な状態では、強い意志（武人）を持つことが、道を切り開く鍵となる。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "優柔不断, 迷い, 始まり",
      親となる卦: "巽為風",
      キーワードタグ: "優柔不断, 始まり, 迷い",
      S1_基本スコア: 33.0,
      S2_ポテンシャル: 35.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ:
        "状況:黎明期, 力学:協力者なし, 力学:順当な力関係, 心理:正道堅持",
    },
    {
      爻名: "巽為風 九二",
      通し番号: 340,
      卦番号: 57,
      爻: "九二",
      爻辞: "巽在牀下。用史巫紛若。吉无咎。 （そんざいしょうか。しふをもちうことふんじょ。きちにしてとがなし。） 意味：風が寝台の下にいる。史巫を多く用いる。吉で咎めなし。",
      現代解釈の要約:
        "問題が水面下で進行し、状況が錯綜している。専門家（史巫）の意見を広く求めることで、問題の本質を明らかにし、正しく対処できる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "隠れた問題, 専門家, 情報収集",
      親となる卦: "巽為風",
      キーワードタグ: "吉, 問題なし, 専門家, 情報収集, 隠れた問題",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 56.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者なし",
    },
    {
      爻名: "巽為風 九三",
      通し番号: 341,
      卦番号: 57,
      爻: "九三",
      爻辞: "頻巽。吝。 （ひんそん。りん。） 意味：繰り返し従う（優柔不断）。恥ずかしいことだ。",
      現代解釈の要約:
        "柔軟であろうとするあまり、自分の意見が定まらず、方針がコロコロと変わる。その優柔不断さが、周囲からの信頼を失い、恥をかく原因となる。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "一貫性の欠如, 信頼喪失, 決断力不足",
      親となる卦: "巽為風",
      キーワードタグ: "一貫性の欠如, 信頼喪失, 決断力不足",
      S1_基本スコア: 33.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 20.0,
      S4_リスク: 85.0,
      S5_主体性: "能動",
      S6_変動性スコア: 76.0,
      S7_総合評価スコア: 12.0,
      論理キーワードタグ: "状況:移行期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "巽為風 六四",
      通し番号: 342,
      卦番号: 57,
      爻: "六四",
      爻辞: "悔亡。田獲三品。 （くいほろぶ。でんにさんぴんをう。） 意味：悔いがなくなる。狩りで三種類の獲物を得る。",
      現代解釈の要約:
        "これまでの努力が実を結び、過去の後悔が消える。自身の能力を様々な分野で発揮し、同時に複数の大きな成果を得られる、絶好調の時期。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "大成功, 成果, 多角化",
      親となる卦: "巽為風",
      キーワードタグ: "多角化, 大成功, 成果",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ:
        "状況:変革期, 力学:協力者なし, 力学:順当な力関係, 心理:内省",
    },
    {
      爻名: "巽為風 九五",
      通し番号: 343,
      卦番号: 57,
      爻: "九五",
      爻辞: "貞吉。悔亡。无不利。…先庚三日、後庚三日。 （ていきち。くいほろぶ。ふりなきなし。…こうにさきだつことみっか、こうにおくれることみっか。） 意味：正しくして吉。悔いなし。不利なことはない。…庚の三日前、三日後に（慎重に準備する）。",
      現代解釈の要約:
        "最高の立場にあるリーダーが、公正な姿勢で組織を導く。大きな変革（庚）の際には、入念な準備と事後処理を行うことで、万事を成功させる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "賢明なリーダー, 周到な準備, 成功",
      親となる卦: "巽為風",
      キーワードタグ: "吉, 周到な準備, 成功, 賢明なリーダー",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 70.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 62.0,
      論理キーワードタグ:
        "状況:変革期, 状況:絶頂期, 力学:協力者なし, アクション:準備, 心理:内省, 心理:慎重, 心理:正道堅持",
    },
    {
      爻名: "巽為風 上九",
      通し番号: 344,
      卦番号: 57,
      爻: "上九",
      爻辞: "巽在牀下。喪其資斧。貞凶。 （そんざいしょうか。そのしふをうしなう。ていはきょう。） 意味：風が寝台の下にいる。その財産と武器を失う。正しくても凶。",
      現代解釈の要約:
        "謙虚さや従順さが行き過ぎて、自分の意見や能力を全く主張できなくなる。その結果、主体性や持てる力（資斧）を全て失い、破滅に至る。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "主体性の喪失, 機能不全, 破滅",
      親となる卦: "巽為風",
      キーワードタグ: "主体性の喪失, 凶, 機能不全, 破滅",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 24.0,
      S4_リスク: 75.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 18.0,
      論理キーワードタグ:
        "状況:終極期, 力学:協力者なし, 心理:正道堅持, 心理:謙虚",
    },
    {
      爻名: "兌為沢 初九",
      通し番号: 345,
      卦番号: 58,
      爻: "初九",
      爻辞: "和兌。吉。 （わえつ。きち。） 意味：和やかに喜ぶ。吉。",
      現代解釈の要約:
        "新しい関係の始まり。激しい感情ではなく、穏やかで調和のとれた喜びを感じる。心からの満足感があり、良好なスタートを切れる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "調和, 穏やか, 満足感",
      親となる卦: "兌為沢",
      キーワードタグ: "吉, 満足感, 穏やか, 調和",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 46.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者なし",
    },
    {
      爻名: "兌為沢 九二",
      通し番号: 346,
      卦番号: 58,
      爻: "九二",
      爻辞: "孚兌。吉。悔亡。 （ふえつ。きち。くいほろぶ。） 意味：真心をもって喜ぶ。吉。悔いは消える。",
      現代解釈の要約:
        "偽りのない、真心からの喜びや共感。その誠実さが相手に伝わり、深い信頼関係が築かれ、過去の誤解や後悔も解消される、最高の状態。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "誠実, 信頼, 共感",
      親となる卦: "兌為沢",
      キーワードタグ: "信頼, 共感, 吉, 誠実",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 38.0,
      論理キーワードタグ:
        "状況:安定期, 力学:下剋上リスク, 力学:協力者なし, 心理:内省",
    },
    {
      爻名: "兌為沢 六三",
      通し番号: 347,
      卦番号: 58,
      爻: "六三",
      爻辞: "来兌。凶。 （らいえつ。きょう。） 意味：（外から）やって来る喜び。凶。",
      現代解釈の要約:
        "自分の内から湧き出る喜びではなく、外部からの安易な快楽や、無責任な誘惑に流される。その軽薄な行動が、かえって災いを招く。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "軽薄, 誘惑, 表面的な喜び",
      親となる卦: "兌為沢",
      キーワードタグ: "凶, 表面的な喜び, 誘惑, 軽薄",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 75.0,
      S5_主体性: "受動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 16.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "兌為沢 九四",
      通し番号: 348,
      卦番号: 58,
      爻: "九四",
      爻辞: "商兌未寧。介疾有喜。 （しょうえついまだやすからず。かいしつありてよろこびあり。） 意味：喜びを熟慮して、まだ安定しない。病を断ち切って喜びがある。",
      現代解釈の要約:
        "喜びの中にも、まだ解決すべき問題や不安（病）を抱えている。しかし、その問題点を断固として断ち切る決断をすれば、真の喜びを得ることができる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "決断, 悪縁を断つ, 問題解決",
      親となる卦: "兌為沢",
      キーワードタグ: "問題解決, 悪縁を断つ, 決断",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者なし",
    },
    {
      爻名: "兌為沢 九五",
      通し番号: 349,
      卦番号: 58,
      爻: "九五",
      爻辞: "孚于剥。厲。 （はくにまことあり。あやうし。） 意味：剥がれ落ちる者に真心を持つ。危うい。",
      現代解釈の要約:
        "信頼すべきでない、不正な者や、衰退している組織を、真心から信じてしまう。その見当違いの信頼が、自分自身を非常に危険な状況に陥れる。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "判断ミス, 信頼の誤り, 危険",
      親となる卦: "兌為沢",
      キーワードタグ: "リスクあり, 信頼の誤り, 判断ミス, 危険",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 70.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ: "状況:絶頂期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "兌為沢 上六",
      通し番号: 350,
      卦番号: 58,
      爻: "上六",
      爻辞: "引兌。 （いんえつ。） 意味：（不適切な喜びに）引き込まれる。（凶）",
      現代解釈の要約:
        "節度を失い、快楽や享楽に溺れてしまう最終段階。言葉巧みに、あるいは自ら進んで、不誠実で中身のない喜びに引き込まれ、破滅する。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "享楽, 節度のなさ, 自滅",
      親となる卦: "兌為沢",
      キーワードタグ: "享楽, 凶, 節度のなさ, 自滅",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 75.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 16.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者なし",
    },
    {
      爻名: "風水渙 初六",
      通し番号: 351,
      卦番号: 59,
      爻: "初六",
      爻辞: "用拯馬壮。吉。 （じょうばをもちいてすくう。きち。） 意味：強い馬を用いて助け出す。吉。",
      現代解釈の要約:
        "困難や停滞の初期段階で、強力なサポートやリソース（強い馬）を動員し、迅速に問題解決にあたる。その的確な初動が、良い結果をもたらす。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "迅速な対応, 危機管理, 支援",
      親となる卦: "風水渙",
      キーワードタグ: "危機管理, 吉, 支援, 迅速な対応",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:黎明期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "風水渙 九二",
      通し番号: 352,
      卦番号: 59,
      爻: "九二",
      爻辞: "渙奔其机。悔亡。 （かんそのきにはしる。くいほろぶ。） 意味：散り散りになって、その机（安全な場所）に走り寄る。悔いは消える。",
      現代解釈の要約:
        "混乱や困難の最中に、いち早く安全な場所や頼れる支援（机）を見つけ出し、そこに駆け込む。危機を回避し、過去の後悔が解消される。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "安定の確保, 危機回避, 悔いの解消",
      親となる卦: "風水渙",
      キーワードタグ: "危機回避, 安定の確保, 悔いの解消",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 20.0,
      S7_総合評価スコア: 52.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:安定期, 力学:協力者なし, 心理:内省",
    },
    {
      爻名: "風水渙 六三",
      通し番号: 353,
      卦番号: 59,
      爻: "六三",
      爻辞: "渙其躬。无悔。 （そのきゅうをかんす。くいなし。） 意味：その身（私心）を散らす。悔いはない。",
      現代解釈の要約:
        "組織や全体の利益のために、自分のエゴや私的な欲望を捨てて、問題解決に貢献する。その無私な姿勢が、後悔のない、素晴らしい結果を生む。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "無私, 貢献, 大義",
      親となる卦: "風水渙",
      キーワードタグ: "大義, 無私, 貢献",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 75.0,
      S5_主体性: "能動",
      S6_変動性スコア: 64.0,
      S7_総合評価スコア: 28.0,
      論理キーワードタグ:
        "状況:移行期, 力学:下剋上リスク, 力学:協力者あり, 心理:内省",
    },
    {
      爻名: "風水渙 六四",
      通し番号: 354,
      卦番号: 59,
      爻: "六四",
      爻辞: "渙其群。元吉。渙有丘。匪夷所思。 （そのぐんをかんす。げんきち。かんにしておかあり。いの思うところにあらず。） 意味：その群れを散らす。大いに吉。散らばったものが丘のように集まる。常人には考えられないこと。",
      現代解釈の要約:
        "組織の硬直化を解消するため、あえて既存の派閥やグループを解体する。その大胆な改革が、予期せぬ形で、より強固な新しい結束を生み出す。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "抜本的改革, 組織再編, 大同団結",
      親となる卦: "風水渙",
      キーワードタグ: "吉, 大同団結, 抜本的改革, 組織再編",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "風水渙 九五",
      通し番号: 355,
      卦番号: 59,
      爻: "九五",
      爻辞: "渙汗其大号。渙王居。无咎。 （かんかんそのだいごう。かんおうきょ。とがなし。） 意味：汗のように大号令が広がる。王の居場所が散る。咎めなし。",
      現代解釈の要約:
        "リーダーが、私心なく、公正な目的のために大規模な改革の指示を出す。古い権威や既得権益を解消するその行動は、正しく、咎められることはない。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "リーダーシップ, 大改革, 決断",
      親となる卦: "風水渙",
      キーワードタグ: "リーダーシップ, 問題なし, 大改革, 決断",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 55.0,
      S5_主体性: "受動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 48.0,
      論理キーワードタグ:
        "状況:変革期, 状況:絶頂期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "風水渙 上九",
      通し番号: 356,
      卦番号: 59,
      爻: "上九",
      爻辞: "渙其血。去逖出。无咎。 （そのけつをかんす。さかりていず。とがなし。） 意味：その血を散らす。遠く離れて出る。咎めはない。",
      現代解釈の要約:
        "深刻な危険（血）が及ぶ前に、その状況や場所から賢明に身を引き、遠くへ離れる。危機を未然に回避する、正しい自己防衛。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "危険回避, 撤退, 自己防衛",
      親となる卦: "風水渙",
      キーワードタグ: "危険回避, 問題なし, 撤退, 自己防衛",
      S1_基本スコア: 67.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "水沢節 初九",
      通し番号: 357,
      卦番号: 60,
      爻: "初九",
      爻辞: "不出戸庭。无咎。 （こていをいでず。とがなし。） 意味：戸口から外へ出ない。咎めはない。",
      現代解釈の要約:
        "新しいことを始める際、焦って行動せず、まずは自分の内側（戸庭）で準備を整える。その慎重な自己抑制が、後の過ちを防ぎ、咎められない。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "自己抑制, 準備, 慎重",
      親となる卦: "水沢節",
      キーワードタグ: "問題なし, 慎重, 準備, 自己抑制",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 25.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ:
        "状況:黎明期, 力学:協力者なし, 力学:順当な力関係, アクション:準備, 心理:慎重",
    },
    {
      爻名: "水沢節 九二",
      通し番号: 358,
      卦番号: 60,
      爻: "九二",
      爻辞: "不出門庭。凶。 （もんていをいでず。きょう。） 意味：門から外へ出ない。凶。",
      現代解釈の要約:
        "節度が行き過ぎ、行動が極端に消極的になる。外部との交流を完全に断ち、自分の殻に閉じこもることで、重要な機会を逃し、事態は悪化する。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "過度な抑制, 孤立, 機会損失",
      親となる卦: "水沢節",
      キーワードタグ: "凶, 孤立, 機会損失, 過度な抑制",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 75.0,
      S5_主体性: "能動",
      S6_変動性スコア: 60.0,
      S7_総合評価スコア: 34.0,
      論理キーワードタグ: "状況:安定期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "水沢節 六三",
      通し番号: 359,
      卦番号: 60,
      爻: "六三",
      爻辞: "不節若。則嗟若。无咎。 （せっせざるがごとし。すなわちさするがごとし。とがなし。） 意味：節度がないようだ。そのため嘆く。咎めはない。（※解釈テキストでは「節之弗亨」）",
      現代解釈の要約:
        "規律が厳しすぎる、あるいは緩すぎるなど、節度のあり方に問題があり、不満や嘆きが生じている。しかし、その問題に気づき、反省しているため、大きな咎めには至らない。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "不適切な規律, 不満, 反発",
      親となる卦: "水沢節",
      キーワードタグ: "不満, 不適切な規律, 反発, 問題なし",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者あり",
    },
    {
      爻名: "水沢節 六四",
      通し番号: 360,
      卦番号: 60,
      爻: "六四",
      爻辞: "安節。亨。 （あんせつ。とおる。） 意味：安らかな節度。亨る。",
      現代解釈の要約:
        "無理がなく、自然で、誰もが納得できるような適切な規律が保たれている。その心地よい節度によって、物事はスムーズに進み、成功する。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "心地よい規律, 調和, 成功",
      親となる卦: "水沢節",
      キーワードタグ: "心地よい規律, 成功, 調和",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 35.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 48.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "水沢節 九五",
      通し番号: 361,
      卦番号: 60,
      爻: "九五",
      爻辞: "甘節。吉。往有尚。 （かんせつ。きち。ゆけばたっとばるることあり。） 意味：甘美な節度。吉。進んで賞賛される。",
      現代解釈の要約:
        "リーダーが、人々が喜んで従うような、賢明で思いやりのある規律を設ける。その優れたリーダーシップが、周囲からの支持と賞賛を集め、物事を成功に導く。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "賢明なリーダー, 信頼, 支持",
      親となる卦: "水沢節",
      キーワードタグ: "信頼, 吉, 支持, 賢明なリーダー",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 62.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者なし",
    },
    {
      爻名: "水沢節 上六",
      通し番号: 362,
      卦番号: 60,
      爻: "上六",
      爻辞: "苦節。貞凶。悔亡。 （くせつ。ていはきょう。くいほろぶ。） 意味：苦しい節度。正しくても凶。悔いは消える。",
      現代解釈の要約:
        "節度や規律が極限に達し、それが苦痛となっている。無理な自己犠牲や、過剰な制約を続けると、心身が破綻する。その苦しみを通じて学ぶことで、後悔はなくなるが、状態としては凶。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "過剰な制約, 苦痛, 破綻",
      親となる卦: "水沢節",
      キーワードタグ: "凶, 破綻, 苦痛, 過剰な制約",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 75.0,
      S5_主体性: "能動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 30.0,
      論理キーワードタグ:
        "状況:終極期, 力学:協力者あり, 心理:内省, 心理:正道堅持",
    },
    {
      爻名: "風沢中孚 初九",
      通し番号: 363,
      卦番号: 61,
      爻: "初九",
      爻辞: "虞吉。有他不燕。 （ぐきち。たあればやすからず。） 意味：備えあれば吉。他に心があれば、安らかではない。（※解釈テキストでは「輿説輹」）",
      現代解釈の要約:
        "（解釈テキストに基づき）関係の始まりで、まだ信頼関係が不十分な、不安定な状態。軽率に行動すれば危険であり、まずは自分自身の心を落ち着かせ、信頼の土台作りに専念すべき時。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "不安定, 不安, 信頼不足",
      親となる卦: "風沢中孚",
      キーワードタグ: "不安, 不安定, 信頼不足, 吉",
      S1_基本スコア: 42.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 25.0,
      S5_主体性: "能動",
      S6_変動性スコア: 28.0,
      S7_総合評価スコア: 62.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者あり",
    },
    {
      爻名: "風沢中孚 九二",
      通し番号: 364,
      卦番号: 61,
      爻: "九二",
      爻辞: "鳴鶴在陰。其子和之。我有好爵。吾与爾靡之。 （めいかくかげにあり。そのここれにわす。われにこうしゃくあり。われなんじとこれをともにせん。） 意味：鶴が陰で鳴き、子がこれに和す。良い酒がある。共に分かち合おう。",
      現代解釈の要約:
        "自分の徳を誇示せずとも、その真心は自然と周囲に伝わり、共感を呼ぶ。同じ志を持つ者が集い、喜びを分かち合う、最高の信頼関係。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "共感, 誠実, 自然な影響力",
      親となる卦: "風沢中孚",
      キーワードタグ: "共感, 自然な影響力, 誠実",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ: "状況:安定期, 力学:下剋上リスク, 力学:協力者なし",
    },
    {
      爻名: "風沢中孚 六三",
      通し番号: 365,
      卦番号: 61,
      爻: "六三",
      爻辞: "得敵。或鼓或罷。或泣或歌。 （てきをう。あるいはこしあるいはやむ。あるいはなきあるいはうたう。） 意味：敵を得る。あるいは鼓を打ち、あるいはやめ、あるいは泣き、あるいは歌う。",
      現代解釈の要約:
        "信頼関係が不十分な中で、軽率な行動をとった結果、対立関係を生んでしまう。感情的に不安定になり、一貫性のない行動で、状況を混乱させる。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "不安定な関係, 感情の揺れ, 一貫性の欠如",
      親となる卦: "風沢中孚",
      キーワードタグ: "一貫性の欠如, 不安定な関係, 感情の揺れ",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 36.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者あり",
    },
    {
      爻名: "風沢中孚 六四",
      通し番号: 366,
      卦番号: 61,
      爻: "六四",
      爻辞: "月幾望。馬匹亡。无咎。 （つきぼうにちかし。ばひつほろぶ。とがなし。） 意味：月はほとんど満月だ。馬を失う。咎めはない。",
      現代解釈の要約:
        "信頼関係がほぼ完成に近づいている（月幾望）。より本質的な関係のために、些細なことや過去のしがらみ（馬匹）を捨てる必要があっても、それは咎められない。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "選択と集中, 犠牲, 向上",
      親となる卦: "風沢中孚",
      キーワードタグ: "向上, 問題なし, 犠牲, 選択と集中",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 60.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "風沢中孚 九五",
      通し番号: 367,
      卦番号: 61,
      爻: "九五",
      爻辞: "有孚攣如。无咎。 （まことありてれんじょたり。とがなし。） 意味：真心があり、固く結びつく。咎めはない。",
      現代解釈の要約:
        "リーダーが真心をもって人々を導き、組織やチームが、揺るぎない信頼関係で固く結びついている最高の状態。物事はスムーズに進み、咎められることがない。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "結束, 信頼, リーダーシップ",
      親となる卦: "風沢中孚",
      キーワードタグ: "リーダーシップ, 信頼, 問題なし, 結束",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 35.0,
      S5_主体性: "能動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 62.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者なし",
    },
    {
      爻名: "風沢中孚 上九",
      通し番号: 368,
      卦番号: 61,
      爻: "上九",
      爻辞: "翰音登于天。貞凶。 （かんおんてんにのぼる。ていはきょう。） 意味：鳥の鳴き声だけが天に昇る。正しくても凶。",
      現代解釈の要約:
        "行動や真心が伴わず、口先だけの言葉や理論だけが空しく響き渡っている。その空虚さは誰の心にも届かず、信頼を失い、破滅を招く。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "口先だけ, 空虚, 虚飾",
      親となる卦: "風沢中孚",
      キーワードタグ: "凶, 口先だけ, 空虚, 虚飾",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 34.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "雷山小過 初六",
      通し番号: 369,
      卦番号: 62,
      爻: "初六",
      爻辞: "飛鳥以凶。 （ひちょうもってきょう。） 意味：飛んでいる鳥は凶となる。",
      現代解釈の要約:
        "状況をわきまえず、分不相応に、あるいは軽率に、目立つ行動を取ってしまう。その突出した行動が、かえって災いを招く、という強い警告。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "軽率, 分不相応, 突出",
      親となる卦: "雷山小過",
      キーワードタグ: "凶, 分不相応, 突出, 軽率",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 52.0,
      S4_リスク: 45.0,
      S5_主体性: "受動",
      S6_変動性スコア: 40.0,
      S7_総合評価スコア: 44.0,
      論理キーワードタグ: "状況:黎明期, 力学:協力者あり",
    },
    {
      爻名: "雷山小過 六二",
      通し番号: 370,
      卦番号: 62,
      爻: "六二",
      爻辞: "過其祖。遇其妣。…不及其君。遇其臣。无咎。 （そのそをすぎ、そのひにあう。…そのきみにおよばず、そのしんにあう。とがなし。） 意味：祖父を通り過ぎ、祖母に会う。…君主に会わず、臣下に会う。咎めなし。（※解釈テキストでは「弗過弗及」）",
      現代解釈の要約:
        "どんな状況でも、過度な行動も不足した行動もなく、常にバランスの取れた中庸の道を選ぶ。派手さはないが、堅実な姿勢が、最高の幸運を招く。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "中庸, バランス, 堅実",
      親となる卦: "雷山小過",
      キーワードタグ: "バランス, 中庸, 問題なし, 堅実",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 72.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 24.0,
      S7_総合評価スコア: 58.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者なし, 力学:順当な力関係",
    },
    {
      爻名: "雷山小過 九三",
      通し番号: 371,
      卦番号: 62,
      爻: "九三",
      爻辞: "弗過防之。従或戕之。凶。 （すぎずしてこれをふせぐ。したがえばあるいはこれをそこなう。きょう。） 意味：行き過ぎないように防ぐ。従う者が、あるいはこれを傷つける。凶。",
      現代解釈の要約:
        "失敗を恐れるあまり、過度に慎重になりすぎる。その過剰な警戒心が、かえって周囲の行動を阻害したり、不信感を生んだりして、悪い結果を招く。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "過剰な警戒, 不信感, 裏目",
      親となる卦: "雷山小過",
      キーワードタグ: "不信感, 凶, 裏目, 過剰な警戒",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 38.0,
      論理キーワードタグ: "状況:移行期, 力学:協力者あり, 心理:慎重",
    },
    {
      爻名: "雷山小過 九四",
      通し番号: 372,
      卦番号: 62,
      爻: "九四",
      爻辞: "无咎。弗過遇之。往厲必戒。… （とがなし。すぎずしてこれにあう。ゆけばあやうきもかならずいましむ。…） 意味：咎めはない。行き過ぎずに出会う。進めば危ういが必ず戒める。",
      現代解釈の要約:
        "困難な状況に直面しても、冷静さを保ち、軽率な行動を避ける。常に自らを律し、警戒心を保つことで、大きな問題（咎め）は生じない。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "慎重, 危機管理, 警戒",
      親となる卦: "雷山小過",
      キーワードタグ: "リスクあり, 危機管理, 問題なし, 慎重, 警戒",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 60.0,
      S5_主体性: "能動",
      S6_変動性スコア: 72.0,
      S7_総合評価スコア: 38.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:変革期, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "雷山小過 六五",
      通し番号: 373,
      卦番号: 62,
      爻: "六五",
      爻辞: "密雲不雨。…公弋取彼在穴。 （みつうんあめふらず。…こうよくもってかのあなにあるをとる。） 意味：密雲が立ちこめるが雨は降らない。…公が穴にいる鳥獣を射取る。",
      現代解釈の要約:
        "準備は整っているが、あと一歩のところで成果が出ない、もどかしい状況。リーダーが、隠れた問題点や才能を見抜き、的確な指示を出すことで、初めて事態が打開される。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "停滞, 機会損失, リーダーシップ",
      親となる卦: "雷山小過",
      キーワードタグ: "リーダーシップ, 停滞, 機会損失",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 45.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 52.0,
      論理キーワードタグ: "状況:絶頂期, 力学:協力者なし, アクション:準備",
    },
    {
      爻名: "雷山小過 上六",
      通し番号: 374,
      卦番号: 62,
      爻: "上六",
      爻辞: "弗遇過之。飛鳥離之。凶。是謂災眚。 （あわずしてこれをすぐ。ひちょうこれをはなる。きょう。これをさいがいという。） 意味：会わずに行き過ぎる。飛ぶ鳥がこれを見離す。凶。これを災いという。",
      現代解釈の要約:
        "謙虚さや慎重さが行き過ぎて、行動すべき時に行動できず、絶好の機会を逃してしまう。その消極性が、結果的に最悪の事態（災眚）を招く。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "消極的, 機会損失, 失敗",
      親となる卦: "雷山小過",
      キーワードタグ: "凶, 失敗, 機会損失, 消極的",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 65.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 32.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり, 心理:慎重, 心理:謙虚",
    },
    {
      爻名: "水火既済 初九",
      通し番号: 375,
      卦番号: 63,
      爻: "初九",
      爻辞: "曳其輪。濡其尾。无咎。 （そのりんをひく。そのおをぬらす。とがなし。） 意味：その車輪を引きずる。その尾を濡らす。咎めはない。",
      現代解釈の要約:
        "完成直後の段階。勢いに任せて突進せず、あえてブレーキをかけるように、極めて慎重に行動する。その注意深さが、咎めなき安定を保つ。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "慎重, 抑制, 始まり",
      親となる卦: "水火既済",
      キーワードタグ: "問題なし, 始まり, 慎重, 抑制",
      S1_基本スコア: 58.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 48.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 56.0,
      S7_総合評価スコア: 48.0,
      論理キーワードタグ:
        "状況:黎明期, 力学:下剋上リスク, 力学:協力者あり, 心理:慎重",
    },
    {
      爻名: "水火既済 六二",
      通し番号: 376,
      卦番号: 63,
      爻: "六二",
      爻辞: "婦喪其茀。勿逐。七日得。 （ふそのふつをうしなう。おうなかれ。しちじつう。） 意味：婦人が飾りを失う。追うな。七日で取り戻せる。",
      現代解釈の要約:
        "安定した状況で、些細な問題や小さな損失が発生する。しかし、焦って追い求めず、冷静に時を待てば、自然と回復する。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "忍耐, 冷静な対応, 小さな問題",
      親となる卦: "水火既済",
      キーワードタグ: "冷静な対応, 小さな問題, 忍耐",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 84.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 12.0,
      S7_総合評価スコア: 74.0,
      論理キーワードタグ: "状況:安定期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "水火既済 九三",
      通し番号: 377,
      卦番号: 63,
      爻: "九三",
      爻辞: "高宗伐鬼方。三年克之。小人勿用。 （こうそうきほうをうつ。さんねんにしてこれにかつ。しょうじんもちうるなかれ。） 意味：高宗が鬼方を討伐する。三年かけて勝利する。小人を用いてはならない。",
      現代解釈の要約:
        "完成したかに見えた状況の裏で、根深い問題が再燃する。解決には、長期的な努力と、正しい人材の登用が必要となる、困難な戦いの時期。",
      パターンの分類: "停滞・中立パターン",
      点数: 0.0,
      キーワード: "長期的な困難, 試練, 粘り強さ",
      親となる卦: "水火既済",
      キーワードタグ: "粘り強さ, 試練, 長期的な困難",
      S1_基本スコア: 50.0,
      S2_ポテンシャル: 65.0,
      S3_安定性スコア: 32.0,
      S4_リスク: 65.0,
      S5_主体性: "受動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 36.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:移行期, 力学:下剋上リスク, 力学:協力者あり, アクション:現状維持",
    },
    {
      爻名: "水火既済 六四",
      通し番号: 378,
      卦番号: 63,
      爻: "六四",
      爻辞: "繻有衣袽。終日戒。 （じゅにいじょあり。しゅうじついましむ。） 意味：破れた衣服にボロをあてる。一日中警戒する。",
      現代解釈の要約:
        "表面上は安定していても、常に危機意識を持ち、将来起こりうるリスクに備えて、地道な補修や改善を怠らない。その警戒心が、安定を持続させる。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "危機管理, 警戒, 継続的改善",
      親となる卦: "水火既済",
      キーワードタグ: "危機管理, 継続的改善, 警戒",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 68.0,
      S4_リスク: 25.0,
      S5_主体性: "受動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 60.0,
      論理キーワードタグ: "状況:変革期, 力学:協力者あり, 力学:順当な力関係",
    },
    {
      爻名: "水火既済 六五",
      通し番号: 379,
      卦番号: 63,
      爻: "六五",
      爻辞: "東鄰殺牛。不如西鄰之禴祭、実受其福。 （とうりんうしをころす。せいりんのやくさい、じつにそのふくをくるるにしかず。） 意味：東隣が牛で祭るより、西隣の質素な祭りの方が、福を受ける。",
      現代解釈の要約:
        "成功を祝う際、派手な祝宴や見せかけの豪華さよりも、質素でも真心がこもった感謝や共有の方が、真の幸福をもたらす。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "誠実, 本質, 質素",
      親となる卦: "水火既済",
      キーワードタグ: "本質, 誠実, 質素",
      S1_基本スコア: 100.0,
      S2_ポテンシャル: 75.0,
      S3_安定性スコア: 64.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 36.0,
      S7_総合評価スコア: 64.0,
      論理キーワードタグ: "状況:絶頂期, 力学:下剋上リスク, 力学:協力者あり",
    },
    {
      爻名: "水火既済 上六",
      通し番号: 380,
      卦番号: 63,
      爻: "上六",
      爻辞: "濡其首。厲。 （そのこうべをぬらす。あやうし。） 意味：その頭まで水に浸かる。危うい。（※解釈テキストでは凶）",
      現代解釈の要約:
        "完成の極みで、完全に油断しきっている状態。成功体験に溺れ、変化に対応できず、転落する。慢心がもたらす、最悪の結末。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "油断, 慢心, 転落",
      親となる卦: "水火既済",
      キーワードタグ: "リスクあり, 凶, 慢心, 油断, 転落",
      S1_基本スコア: 17.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 80.0,
      S5_主体性: "受動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 26.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
    {
      爻名: "火水未済 初六",
      通し番号: 381,
      卦番号: 64,
      爻: "初六",
      爻辞: "濡其尾。吝。 （そのおをぬらす。りん。） 意味：その尾を濡らす。恥ずかしいことだ。",
      現代解釈の要約:
        "物事の始まりで、経験が浅く、慎重さに欠けた行動で、些細な失敗をしてしまう。その未熟さが露呈し、少し恥ずかしい思いをする。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "軽率, 始まりの失敗, 未熟",
      親となる卦: "火水未済",
      キーワードタグ: "始まりの失敗, 未熟, 軽率",
      S1_基本スコア: 33.0,
      S2_ポテンシャル: 40.0,
      S3_安定性スコア: 60.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 32.0,
      S7_総合評価スコア: 52.0,
      論理キーワードタグ:
        "状況:黎明期, 力学:協力者あり, 力学:順当な力関係, 心理:慎重",
    },
    {
      爻名: "火水未済 九二",
      通し番号: 382,
      卦番号: 64,
      爻: "九二",
      爻辞: "曳其輪。貞吉。 （そのりんをひく。ていきち。） 意味：その車輪を引きずる。正しくしていれば吉。",
      現代解釈の要約:
        "計画が期待通りに進まず、停滞している。しかし、この困難な状況で焦らず、冷静に、そして着実に物事を進めるその姿勢が、最終的な成功を呼ぶ。",
      パターンの分類: "勝ちパターン",
      点数: 1.0,
      キーワード: "忍耐, 自制, 慎重",
      親となる卦: "火水未済",
      キーワードタグ: "吉, 忍耐, 慎重, 自制",
      S1_基本スコア: 75.0,
      S2_ポテンシャル: 70.0,
      S3_安定性スコア: 56.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 24.0,
      S7_総合評価スコア: 58.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:安定期, 力学:下剋上リスク, 力学:協力者あり, 心理:正道堅持",
    },
    {
      爻名: "火水未済 六三",
      通し番号: 383,
      卦番号: 64,
      爻: "六三",
      爻辞: "未済征凶。利涉大川。 （いまだすまざるにゆけばきょう。たいせんをわたるによろし。） 意味：未完成なまま進めば凶。大河を渡るのがよい。",
      現代解釈の要約:
        "準備が不十分なまま、無謀な行動や危険な挑戦をすると、大きな失敗を招く。まずは一旦立ち止まり、十分な準備を整えることが不可欠。",
      パターンの分類: "破滅パターン",
      点数: -2.0,
      キーワード: "準備不足, 無謀, 失敗",
      親となる卦: "火水未済",
      キーワードタグ: "凶, 失敗, 準備不足, 無謀",
      S1_基本スコア: 8.0,
      S2_ポテンシャル: 50.0,
      S3_安定性スコア: 44.0,
      S4_リスク: 65.0,
      S5_主体性: "能動",
      S6_変動性スコア: 52.0,
      S7_総合評価スコア: 36.0,
      論理キーワードタグ:
        "状況:移行期, 力学:協力者あり, 力学:順当な力関係, アクション:準備",
    },
    {
      爻名: "火水未済 九四",
      通し番号: 384,
      卦番号: 64,
      爻: "九四",
      爻辞: "貞吉。悔亡。震用伐鬼方。三年有賞于大国。 （ていきち。くいほろぶ。しんもってきほうをうつ。さんねんにしてたいこくによろこびあり。） 意味：正しくして吉。悔いはなくなる。雷を用いて鬼方を討伐する。三年後に大国から賞を得る。",
      現代解釈の要約:
        "長い困難や未解決の問題に対し、強い意志と断固たる行動力で立ち向かう。時間がかかっても、粘り強く努力を続ければ、必ずやそれを克服し、大きな成果と評価を得られる。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "困難の克服, 長期的な努力, 勝利",
      親となる卦: "火水未済",
      キーワードタグ: "勝利, 吉, 困難の克服, 長期的な努力",
      S1_基本スコア: 83.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 40.0,
      S4_リスク: 55.0,
      S5_主体性: "能動",
      S6_変動性スコア: 48.0,
      S7_総合評価スコア: 40.0,
      論理キーワードタグ:
        "状況:困窮状態, 状況:変革期, 力学:下剋上リスク, 力学:協力者あり, 心理:内省, 心理:正道堅持",
    },
    {
      爻名: "火水未済 六五",
      通し番号: 385,
      卦番号: 64,
      爻: "六五",
      爻辞: "貞吉。无悔。君子之光。有孚。吉。 （ていきち。くいなし。くんしのひかり。まことあり。きち。） 意味：正しくして吉。悔いはない。君子の光。真心がある。吉。",
      現代解釈の要約:
        "物事がほぼ完成に近づき、理想的な状態となる。リーダーがその徳と能力で周囲を照らし、揺るぎない信頼と支持を得て、最高の幸運を掴む。",
      パターンの分類: "大勝ちパターン",
      点数: 2.0,
      キーワード: "理想のリーダー, 徳, 信頼, 完成間近",
      親となる卦: "火水未済",
      キーワードタグ: "信頼, 吉, 完成間近, 徳, 理想のリーダー",
      S1_基本スコア: 92.0,
      S2_ポテンシャル: 60.0,
      S3_安定性スコア: 76.0,
      S4_リスク: 35.0,
      S5_主体性: "受動",
      S6_変動性スコア: 0.0,
      S7_総合評価スコア: 68.0,
      論理キーワードタグ:
        "状況:絶頂期, 力学:協力者あり, 力学:順当な力関係, 心理:内省, 心理:正道堅持",
    },
    {
      爻名: "火水未済 上九",
      通し番号: 386,
      卦番号: 64,
      爻: "上九",
      爻辞: "有孚于飲酒。无咎。濡其首。… （いんしゅにまことあり。とがなし。そのこうべをぬらす。…） 意味：真心をもって酒を飲む。咎めなし。その頭まで濡らす。",
      現代解釈の要約:
        "目標が達成され、仲間とその喜びを分かち合う。しかし、その喜びに溺れ、節度を失うと（頭まで濡らす）、油断から新たな失敗を招く危険性がある。",
      パターンの分類: "やや破滅パターン",
      点数: -1.0,
      キーワード: "油断, 慢心, 節度のなさ",
      親となる卦: "火水未済",
      キーワードタグ: "問題なし, 慢心, 油断, 節度のなさ",
      S1_基本スコア: 25.0,
      S2_ポテンシャル: 55.0,
      S3_安定性スコア: 36.0,
      S4_リスク: 45.0,
      S5_主体性: "能動",
      S6_変動性スコア: 44.0,
      S7_総合評価スコア: 42.0,
      論理キーワードタグ: "状況:終極期, 力学:協力者あり",
    },
  ],
  H64_DATA: [
    {
      卦番号: 1,
      名前: "乾為天",
      初爻変: 44,
      二爻変: 13,
      三爻変: 10,
      四爻変: 9,
      五爻変: 14,
      上爻変: 43,
      saku_id: 2,
      sou_id: 1,
      go_id: 1,
    },
    {
      卦番号: 2,
      名前: "坤為地",
      初爻変: 24,
      二爻変: 7,
      三爻変: 15,
      四爻変: 16,
      五爻変: 8,
      上爻変: 23,
      saku_id: 1,
      sou_id: 2,
      go_id: 2,
    },
    {
      卦番号: 3,
      名前: "水雷屯",
      初爻変: 8,
      二爻変: 60,
      三爻変: 63,
      四爻変: 42,
      五爻変: 24,
      上爻変: 17,
      saku_id: 38,
      sou_id: 4,
      go_id: 24,
    },
    {
      卦番号: 4,
      名前: "山水蒙",
      初爻変: 41,
      二爻変: 23,
      三爻変: 18,
      四爻変: 59,
      五爻変: 7,
      上爻変: 64,
      saku_id: 37,
      sou_id: 3,
      go_id: 23,
    },
    {
      卦番号: 5,
      名前: "水天需",
      初爻変: 63,
      二爻変: 60,
      三爻変: 9,
      四爻変: 43,
      五爻変: 11,
      上爻変: 48,
      saku_id: 36,
      sou_id: 6,
      go_id: 38,
    },
    {
      卦番号: 6,
      名前: "天水訟",
      初爻変: 36,
      二爻変: 10,
      三爻変: 12,
      四爻変: 44,
      五爻変: 59,
      上爻変: 47,
      saku_id: 35,
      sou_id: 5,
      go_id: 37,
    },
    {
      卦番号: 7,
      名前: "地水師",
      初爻変: 19,
      二爻変: 2,
      三爻変: 46,
      四爻変: 40,
      五爻変: 29,
      上爻変: 4,
      saku_id: 8,
      sou_id: 8,
      go_id: 24,
    },
    {
      卦番号: 8,
      名前: "水地比",
      初爻変: 3,
      二爻変: 29,
      三爻変: 39,
      四爻変: 45,
      五爻変: 2,
      上爻変: 20,
      saku_id: 7,
      sou_id: 7,
      go_id: 23,
    },
    {
      卦番号: 9,
      名前: "風天小畜",
      初爻変: 10,
      二爻変: 16,
      三爻変: 57,
      四爻変: 37,
      五爻変: 61,
      上爻変: 1,
      saku_id: 26,
      sou_id: 10,
      go_id: 38,
    },
    {
      卦番号: 10,
      名前: "天沢履",
      初爻変: 9,
      二爻変: 15,
      三爻変: 6,
      四爻変: 25,
      五爻変: 1,
      上爻変: 61,
      saku_id: 15,
      sou_id: 9,
      go_id: 37,
    },
    {
      卦番号: 11,
      名前: "地天泰",
      初爻変: 12,
      二爻変: 46,
      三爻変: 36,
      四爻変: 19,
      五爻変: 34,
      上爻変: 5,
      saku_id: 12,
      sou_id: 12,
      go_id: 54,
    },
    {
      卦番号: 12,
      名前: "天地否",
      初爻変: 11,
      二爻変: 25,
      三爻変: 6,
      四爻変: 33,
      五爻変: 20,
      上爻変: 35,
      saku_id: 11,
      sou_id: 11,
      go_id: 53,
    },
    {
      卦番号: 13,
      名前: "天火同人",
      初爻変: 14,
      二爻変: 7,
      三爻変: 37,
      四爻変: 30,
      五爻変: 33,
      上爻変: 49,
      saku_id: 14,
      sou_id: 13,
      go_id: 44,
    },
    {
      卦番号: 14,
      名前: "火天大有",
      初爻変: 13,
      二爻変: 8,
      三爻変: 50,
      四爻変: 30,
      五爻変: 38,
      上爻変: 26,
      saku_id: 13,
      sou_id: 14,
      go_id: 43,
    },
    {
      卦番号: 15,
      名前: "地山謙",
      初爻変: 16,
      二爻変: 10,
      三爻変: 39,
      四爻変: 52,
      五爻変: 2,
      上爻変: 62,
      saku_id: 56,
      sou_id: 16,
      go_id: 40,
    },
    {
      卦番号: 16,
      名前: "雷地豫",
      初爻変: 15,
      二爻変: 9,
      三爻変: 51,
      四爻変: 40,
      五爻変: 62,
      上爻変: 2,
      saku_id: 55,
      sou_id: 15,
      go_id: 39,
    },
    {
      卦番号: 17,
      名前: "沢雷随",
      初爻変: 18,
      二爻変: 18,
      三爻変: 3,
      四爻変: 51,
      五爻変: 25,
      上爻変: 45,
      saku_id: 18,
      sou_id: 18,
      go_id: 27,
    },
    {
      卦番号: 18,
      名前: "山風蠱",
      初爻変: 17,
      二爻変: 17,
      三爻変: 50,
      四爻変: 57,
      五爻変: 46,
      上爻変: 26,
      saku_id: 17,
      sou_id: 17,
      go_id: 28,
    },
    {
      卦番号: 19,
      名前: "地沢臨",
      初爻変: 20,
      二爻変: 33,
      三爻変: 7,
      四爻変: 24,
      五爻変: 11,
      上爻変: 54,
      saku_id: 20,
      sou_id: 20,
      go_id: 24,
    },
    {
      卦番号: 20,
      名前: "風地観",
      初爻変: 19,
      二爻変: 34,
      三爻変: 12,
      四爻変: 23,
      五爻変: 8,
      上爻変: 42,
      saku_id: 19,
      sou_id: 19,
      go_id: 23,
    },
    {
      卦番号: 21,
      名前: "火雷噬嗑",
      初爻変: 22,
      二爻変: 48,
      三爻変: 27,
      四爻変: 25,
      五爻変: 51,
      上爻変: 35,
      saku_id: 22,
      sou_id: 22,
      go_id: 39,
    },
    {
      卦番号: 22,
      名前: "山火賁",
      初爻変: 21,
      二爻変: 47,
      三爻変: 30,
      四爻変: 37,
      五爻変: 52,
      上爻変: 26,
      saku_id: 21,
      sou_id: 21,
      go_id: 40,
    },
    {
      卦番号: 23,
      名前: "山地剝",
      初爻変: 24,
      二爻変: 43,
      三爻変: 27,
      四爻変: 4,
      五爻変: 52,
      上爻変: 35,
      saku_id: 24,
      sou_id: 24,
      go_id: 2,
    },
    {
      卦番号: 24,
      名前: "地雷復",
      初爻変: 2,
      二爻変: 36,
      三爻変: 19,
      四爻変: 21,
      五爻変: 17,
      上爻変: 25,
      saku_id: 23,
      sou_id: 23,
      go_id: 2,
    },
    {
      卦番号: 25,
      名前: "天雷无妄",
      初爻変: 26,
      二爻変: 46,
      三爻変: 42,
      四爻変: 21,
      五爻変: 17,
      上爻変: 12,
      saku_id: 46,
      sou_id: 26,
      go_id: 28,
    },
    {
      卦番号: 26,
      名前: "山天大畜",
      初爻変: 25,
      二爻変: 45,
      三爻変: 14,
      四爻変: 9,
      五爻変: 11,
      上爻変: 18,
      saku_id: 45,
      sou_id: 25,
      go_id: 27,
    },
    {
      卦番号: 27,
      名前: "山雷頤",
      初爻変: 28,
      二爻変: 27,
      三爻変: 21,
      四爻変: 42,
      五爻変: 24,
      上爻変: 23,
      saku_id: 28,
      sou_id: 28,
      go_id: 2,
    },
    {
      卦番号: 28,
      名前: "澤風大過",
      初爻変: 27,
      二爻変: 28,
      三爻変: 48,
      四爻変: 32,
      五爻変: 47,
      上爻変: 43,
      saku_id: 27,
      sou_id: 27,
      go_id: 1,
    },
    {
      卦番号: 29,
      名前: "坎為水",
      初爻変: 29,
      二爻変: 30,
      三爻変: 60,
      四爻変: 8,
      五爻変: 48,
      上爻変: 47,
      saku_id: 30,
      sou_id: 29,
      go_id: 29,
    },
    {
      卦番号: 30,
      名前: "離為火",
      初爻変: 30,
      二爻変: 29,
      三爻変: 22,
      四爻変: 13,
      五爻変: 55,
      上爻変: 56,
      saku_id: 29,
      sou_id: 30,
      go_id: 30,
    },
    {
      卦番号: 31,
      名前: "沢山咸",
      初爻変: 32,
      二爻変: 41,
      三爻変: 39,
      四爻変: 62,
      五爻変: 33,
      上爻変: 49,
      saku_id: 32,
      sou_id: 32,
      go_id: 44,
    },
    {
      卦番号: 32,
      名前: "雷風恒",
      初爻変: 31,
      二爻変: 42,
      三爻変: 46,
      四爻変: 28,
      五爻変: 50,
      上爻変: 34,
      saku_id: 31,
      sou_id: 31,
      go_id: 43,
    },
    {
      卦番号: 33,
      名前: "天山遯",
      初爻変: 34,
      二爻変: 19,
      三爻変: 53,
      四爻変: 56,
      五爻変: 31,
      上爻変: 13,
      saku_id: 34,
      sou_id: 34,
      go_id: 44,
    },
    {
      卦番号: 34,
      名前: "雷天大壮",
      初爻変: 33,
      二爻変: 20,
      三爻変: 11,
      四爻変: 43,
      五爻変: 16,
      上爻変: 14,
      saku_id: 33,
      sou_id: 33,
      go_id: 43,
    },
    {
      卦番号: 35,
      名前: "火地晋",
      初爻変: 36,
      二爻変: 5,
      三爻変: 23,
      四爻変: 12,
      五爻変: 16,
      上爻変: 21,
      saku_id: 36,
      sou_id: 36,
      go_id: 63,
    },
    {
      卦番号: 36,
      名前: "地火明夷",
      初爻変: 35,
      二爻変: 6,
      三爻変: 55,
      四爻変: 63,
      五爻変: 22,
      上爻変: 15,
      saku_id: 35,
      sou_id: 35,
      go_id: 64,
    },
    {
      卦番号: 37,
      名前: "風火家人",
      初爻変: 38,
      二爻変: 40,
      三爻変: 13,
      四爻変: 22,
      五爻変: 63,
      上爻変: 53,
      saku_id: 38,
      sou_id: 38,
      go_id: 61,
    },
    {
      卦番号: 38,
      名前: "火沢睽",
      初爻変: 37,
      二爻変: 39,
      三爻変: 41,
      四爻変: 10,
      五爻変: 54,
      上爻変: 64,
      saku_id: 37,
      sou_id: 37,
      go_id: 62,
    },
    {
      卦番号: 39,
      名前: "水山蹇",
      初爻変: 40,
      二爻変: 38,
      三爻変: 31,
      四爻変: 15,
      五爻変: 53,
      上爻変: 63,
      saku_id: 40,
      sou_id: 40,
      go_id: 63,
    },
    {
      卦番号: 40,
      名前: "雷水解",
      初爻変: 39,
      二爻変: 37,
      三爻変: 7,
      四爻変: 47,
      五爻変: 16,
      上爻変: 54,
      saku_id: 39,
      sou_id: 39,
      go_id: 64,
    },
    {
      卦番号: 41,
      名前: "山沢損",
      初爻変: 42,
      二爻変: 31,
      三爻変: 61,
      四爻変: 60,
      五爻変: 19,
      上爻変: 4,
      saku_id: 42,
      sou_id: 42,
      go_id: 62,
    },
    {
      卦番号: 42,
      名前: "風雷益",
      初爻変: 41,
      二爻変: 32,
      三爻変: 25,
      四爻変: 27,
      五爻変: 3,
      上爻変: 20,
      saku_id: 41,
      sou_id: 41,
      go_id: 61,
    },
    {
      卦番号: 43,
      名前: "沢天夬",
      初爻変: 44,
      二爻変: 23,
      三爻変: 5,
      四爻変: 34,
      五爻変: 1,
      上爻変: 28,
      saku_id: 24,
      sou_id: 44,
      go_id: 1,
    },
    {
      卦番号: 44,
      名前: "天風姤",
      初爻変: 43,
      二爻変: 24,
      三爻変: 57,
      四爻変: 50,
      五爻変: 28,
      上爻変: 1,
      saku_id: 23,
      sou_id: 43,
      go_id: 1,
    },
    {
      卦番号: 45,
      名前: "沢地萃",
      初爻変: 46,
      二爻変: 26,
      三爻変: 8,
      四爻変: 16,
      五爻変: 12,
      上爻変: 17,
      saku_id: 25,
      sou_id: 46,
      go_id: 53,
    },
    {
      卦番号: 46,
      名前: "地風升",
      初爻変: 45,
      二爻変: 25,
      三爻変: 32,
      四爻変: 48,
      五爻変: 18,
      上爻変: 11,
      saku_id: 26,
      sou_id: 45,
      go_id: 54,
    },
    {
      卦番号: 47,
      名前: "沢水困",
      初爻変: 48,
      二爻変: 22,
      三爻変: 29,
      四爻変: 40,
      五爻変: 6,
      上爻変: 58,
      saku_id: 48,
      sou_id: 48,
      go_id: 37,
    },
    {
      卦番号: 48,
      名前: "水風井",
      初爻変: 47,
      二爻変: 21,
      三爻変: 28,
      四爻変: 46,
      五爻変: 57,
      上爻変: 5,
      saku_id: 47,
      sou_id: 47,
      go_id: 38,
    },
    {
      卦番号: 49,
      名前: "沢火革",
      初爻変: 50,
      二爻変: 4,
      三爻変: 63,
      四爻変: 55,
      五爻変: 13,
      上爻変: 31,
      saku_id: 50,
      sou_id: 50,
      go_id: 61,
    },
    {
      卦番号: 50,
      名前: "火風鼎",
      初爻変: 49,
      二爻変: 3,
      三爻変: 18,
      四爻変: 44,
      五爻変: 32,
      上爻変: 14,
      saku_id: 49,
      sou_id: 49,
      go_id: 62,
    },
    {
      卦番号: 51,
      名前: "震為雷",
      初爻変: 52,
      二爻変: 57,
      三爻変: 24,
      四爻変: 17,
      五爻変: 21,
      上爻変: 16,
      saku_id: 52,
      sou_id: 51,
      go_id: 52,
    },
    {
      卦番号: 52,
      名前: "艮為山",
      初爻変: 51,
      二爻変: 58,
      三爻変: 22,
      四爻変: 18,
      五爻変: 23,
      上爻変: 56,
      saku_id: 51,
      sou_id: 52,
      go_id: 51,
    },
    {
      卦番号: 53,
      名前: "風山漸",
      初爻変: 54,
      二爻変: 54,
      三爻変: 33,
      四爻変: 52,
      五爻変: 39,
      上爻変: 37,
      saku_id: 54,
      sou_id: 54,
      go_id: 40,
    },
    {
      卦番号: 54,
      名前: "雷沢帰妹",
      初爻変: 53,
      二爻変: 53,
      三爻変: 19,
      四爻変: 58,
      五爻変: 38,
      上爻変: 40,
      saku_id: 53,
      sou_id: 53,
      go_id: 39,
    },
    {
      卦番号: 55,
      名前: "雷火豊",
      初爻変: 56,
      二爻変: 59,
      三爻変: 36,
      四爻変: 49,
      五爻変: 30,
      上爻変: 62,
      saku_id: 56,
      sou_id: 56,
      go_id: 64,
    },
    {
      卦番号: 56,
      名前: "火山旅",
      初爻変: 55,
      二爻変: 60,
      三爻変: 30,
      四爻変: 50,
      五爻変: 35,
      上爻変: 52,
      saku_id: 55,
      sou_id: 55,
      go_id: 63,
    },
    {
      卦番号: 57,
      名前: "巽為風",
      初爻変: 58,
      二爻変: 51,
      三爻変: 44,
      四爻変: 18,
      五爻変: 48,
      上爻変: 9,
      saku_id: 58,
      sou_id: 57,
      go_id: 57,
    },
    {
      卦番号: 58,
      名前: "兌為沢",
      初爻変: 57,
      二爻変: 52,
      三爻変: 60,
      四爻変: 47,
      五爻変: 17,
      上爻変: 10,
      saku_id: 57,
      sou_id: 58,
      go_id: 58,
    },
    {
      卦番号: 59,
      名前: "風水渙",
      初爻変: 60,
      二爻変: 55,
      三爻変: 6,
      四爻変: 4,
      五爻変: 29,
      上爻変: 61,
      saku_id: 60,
      sou_id: 60,
      go_id: 40,
    },
    {
      卦番号: 60,
      名前: "水沢節",
      初爻変: 59,
      二爻変: 56,
      三爻変: 58,
      四爻変: 19,
      五爻変: 61,
      上爻変: 29,
      saku_id: 59,
      sou_id: 59,
      go_id: 39,
    },
    {
      卦番号: 61,
      名前: "風沢中孚",
      初爻変: 62,
      二爻変: 62,
      三爻変: 10,
      四爻変: 41,
      五爻変: 60,
      上爻変: 59,
      saku_id: 62,
      sou_id: 62,
      go_id: 27,
    },
    {
      卦番号: 62,
      名前: "雷山小過",
      初爻変: 61,
      二爻変: 61,
      三爻変: 15,
      四爻変: 31,
      五爻変: 56,
      上爻変: 55,
      saku_id: 61,
      sou_id: 61,
      go_id: 28,
    },
    {
      卦番号: 63,
      名前: "水火既済",
      初爻変: 63,
      二爻変: 62,
      三爻変: 49,
      四爻変: 36,
      五爻変: 37,
      上爻変: 64,
      saku_id: 64,
      sou_id: 64,
      go_id: 30,
    },
    {
      卦番号: 64,
      名前: "火水未済",
      初爻変: 64,
      二爻変: 62,
      三爻変: 63,
      四爻変: 49,
      五爻変: 37,
      上爻変: 63,
      saku_id: 63,
      sou_id: 63,
      go_id: 29,
    },
  ],
  os_manual: {
    1: {
      name: "乾為天",
      summary:
        "純粋な創造エネルギーと、理想を追求する推進力を持つOS。すべての物事を始めるための、強力な始動エンジン。",
      strategic_roles: [
        "0→1を生み出す創業者",
        "ビジョナリー・リーダー",
        "プロジェクトの絶対的推進力",
        "コンセプト・クリエイター",
      ],
      defensive_use:
        "理想を追求するあまり、他者の意見を「雑音」として排除してしまう、『裸の王様』という落とし穴。その強すぎるエネルギーは、正しさを求めるほどに人を遠ざけ、孤立を招きます。",
      proactive_use:
        "その圧倒的な推進力を、個人の『突破力』から、チームを導く『北極星』へと転換します。自らが道を切り拓くのではなく、その輝くビジョンで人々が進むべき方向を指し示し、自発的な力を引き出すのです。",
      debug_pattern:
        "自分の正しさを疑わず、他者の意見を一切聞かなくなる。計画が完璧でないと気が済まず、周囲に過度なプレッシャーを与え、孤立する。",
      debug_method:
        "意図的に『思考の空白』を作ることが特効薬。具体的な成果を求めず、ただ散歩する、音楽を聴くなど、目的のない行動がシステムのオーバーヒートを防ぎ、ループ状態から解放します。",
      quests: [
        "今週、自分の意見と正反対の意見を持つ人の話を、評価や反論をせずに『データ』として最後までインプットしてみる。",
        "タスクリストの中の一つを、あえて他者に権限移譲してみる。そのプロセスと結果を、客観的に観察する。",
      ],
    },
    2: {
      name: "坤為地",
      summary:
        "あらゆる情報や人材を受け入れ、安定した基盤の上で育成するOS。献身的なサポート能力と、物事を着実に実行する力を持つ。",
      strategic_roles: [
        "最高のNo.2（右腕）",
        "組織の土台を支える人事・総務責任者",
        "コミュニティ・プラットフォーム",
        "才能を育てるインキュベーター",
      ],
      defensive_use:
        "他者の要求や期待を無制限に受け入れ、自分自身の領域を見失ってしまう、『聖母のジレンマ』。その優しさが、結果的に自分自身をすり減らし、行動を停止させてしまいます。",
      proactive_use:
        "その無限の受容力を、『何でも受け入れる』スポンジから、『最高のものを育てる』豊穣の大地へと転換します。あなたが意図的に才能やプロジェクトに『土壌』を提供することで、周囲は安心して根を張り、大きな実りを生み出します。",
      debug_pattern:
        "他者の要求をすべて受け入れてしまい、自分のキャパシティを超えて疲弊する。断ることができず、不満を溜め込み、最終的に無気力になる。",
      debug_method:
        "物理的に『自分のための領域』を確保することが重要。自分のデスクを整える、一人の時間をスケジュールに組み込むなど、他者に侵害されないリソースを確保することで、健全なバッファ管理の感覚を取り戻せます。",
      quests: [
        "今週、誰かからの小さな依頼に対し、一度「対応可否を検討するため、少しお時間をください」と返答してみる。",
        "自分の欲求（例：食べたいもの、やりたいこと）を基準に、一日のタスクを一つだけ実行してみる。",
      ],
    },
    3: {
      name: "水雷屯",
      summary:
        "混沌とした状況の中から、粘り強い思考力で課題を発見し、新たな可能性を生み出すOS。新規事業や未知の領域で真価を発揮する。",
      strategic_roles: [
        "0→1の新規事業立ち上げ担当者",
        "混沌から秩序を生み出すプロジェクトマネージャー",
        "不確実性を乗り越える開拓者",
        "R&D（研究開発）担当者",
      ],
      defensive_use:
        "解決策が見えない不安から、思考の迷宮に囚われ、行動できなくなる『思考停止の沼』。完璧な答えを探すほど、深い悩みにはまり込んでしまいます。",
      proactive_use:
        "その混沌と向き合う力を、『0→1の設計力』へと転換します。『なぜ進めないのか』という問いを武器に、混沌の中から課題の『本質（イシュー）』を特定し、名前をつける。その瞬間、漠然とした悩みは、解決可能なプロジェクトへと変わります。",
      debug_pattern:
        "思考の沼に沈み、誰にも相談できず孤立する。完璧な計画を立てようとして不安が大きくなり、最初の一歩が永遠に踏み出せなくなる。",
      debug_method:
        "思考を強制的に中断し、身体を動かすこと。「雷」の行動エネルギーで「水」の思考の淀みを打ち破るイメージです。5分間の散歩やストレッチが、思考のループを断ち切るための有効な割り込み処理となります。",
      quests: [
        "結論の出ない悩み事を15分だけ考え、タイマーが鳴ったら強制的に中断し、5分間だけ部屋の掃除をする。",
        "計画が10%しか進んでいなくても、その進捗と現状の課題を信頼できる人に情報共有してみる。",
      ],
    },
    4: {
      name: "山水蒙",
      summary:
        "未知の世界や新しい情報に対し、先入観なく素直に吸収できるOS。学習能力と、物事の本質を掴むポテンシャルが高い。",
      strategic_roles: [
        "優秀な弟子・見習い",
        "新規分野の学習者",
        "情報を素直に受け取るリサーチャー",
        "常識にとらわれないアイデアパーソン",
      ],
      defensive_use:
        "信頼できる指導者や明確なマニュアルがないと、何をすべきか分からなくなり、行動を停止してしまいます。これは、霧の中で道に迷い、立ち往生している状態です。",
      proactive_use:
        "その『無知の知』を、最強の武器へと転換します。常識や既存のルールにとらわれず、子供のように『なぜ？』と問い続けることで、誰も気づかなかった問題の本質や、全く新しいアイデアを発見する『イノセント・クエスチョナー』として機能します。",
      debug_pattern:
        "「教えてくれる人」がいないと何もできない状態に陥る。楽な道や耳障りの良い情報に流され、本質的な学びから逃避する。",
      debug_method:
        "「教わる」から「試す」へモードを切り替えることです。得た知識を一つでも使い、小さな失敗（デバッグ）を経験することが、自立（スタンドアロン）への最大の近道です。",
      quests: [
        "今週学んだことを、誰かに教えるつもりで自分の言葉でドキュメントにまとめてみる。",
        "誰かに質問する前に、まず自分で調べ、「ここまで分かったのですが、この点についてご意見をいただけますか」と前置きをつけて質問する。",
      ],
    },
    5: {
      name: "水天需",
      summary:
        "好機をじっくりと待つことができる、忍耐力と大局観を持つOS。焦らず準備を進める戦略性に長けるが、好機を逃すリスクもある。",
      strategic_roles: [
        "長期戦略家",
        "投資家",
        "周到な準備を行うプロジェクトマネージャー",
        "粘り強いネゴシエーター",
      ],
      defensive_use:
        "『まだその時ではない』という言葉を盾に、リスクを恐れるあまり、行動を起こすことを永遠に先延ばしにします。完璧な準備に固執し、変化の激しい状況で絶好のチャンスを逃す『永久待機モード』に入ります。",
      proactive_use:
        "その『待つ』機能を、意図的な『戦略的待機』へと転換します。ただ待つのではなく、『いつまでに、何が、どうなったら動く』という明確な実行トリガーを設定します。嵐が過ぎるのを待つだけでなく、最高の風が吹く瞬間を狙う、優れた『タイミング・ハンター』として機能します。",
      debug_pattern:
        "準備が完璧でないと不安になり、行動を起こせなくなる。「まだその時ではない」と言い訳をし、永遠に待ち続けてしまう。",
      debug_method:
        "「待つ」という行動に、具体的な期限と目的を設定すること。「いつまでに」「何を」待つのかを明確にすることで、無限の待機ループから脱出できます。",
      quests: [
        "待っているプロジェクトについて、「もし明日、強制的に開始するなら、まず何をするか？」を3つ書き出してみる。",
        "完璧でなくても、準備が6割できた段階で、リスクの少ない一部分だけでもテスト実行（トライアル）させてみる。",
      ],
    },
    6: {
      name: "天水訟",
      summary:
        "正義感が強く、論理的な議論で白黒つけたがるOS。真実を追求し、問題を明確にする力があるが、人間関係で不必要な対立を生みやすい。",
      strategic_roles: [
        "弁護士・検事などの法務担当",
        "ディベーター",
        "内部監査役",
        "原則を重んじる批評家",
      ],
      defensive_use:
        "自分の正しさを証明することに固執し、相手を『論破』しようとします。勝ち負けが全てとなり、本来の目的を見失い、人間関係を破壊することも厭わない『孤高の論客』と化します。",
      proactive_use:
        "その『白黒つけたがる』エネルギーを、個人への攻撃ではなく、『問題の構造』そのものに向けます。対立を、より良いルールやシステムを構築するための『健全な議論』へと昇華させる、優れた『アーキテクト』や『ルールメイカー』として機能します。",
      debug_pattern:
        "自分の正しさを証明するために、相手を徹底的に論破しようとする。勝ち負けに固執し、本来の目的や人間関係を破壊してしまう。",
      debug_method:
        "対立のエネルギーを「人」ではなく「問題」に向けること。「この問題を解決するために、私たちはどう協力できるか？」という協力フレームに、相手を招待する意識を持つことが有効です。",
      quests: [
        "議論が白熱しそうになったら、一度「あなたの視点では、そう見えるのですね」と相手の視点を認める言葉を挟んでみる。",
        "自分の主張を文章に書き出し、一晩寝かせてから「目的達成のために、最も効果的な伝え方は何か？」という視点で推敲する。",
      ],
    },
    7: {
      name: "地水師",
      summary:
        "人々をまとめ、大きな目標に向かって導く統率力を持つOS。規律と大義を重んじるが、時に冷徹で非情なリーダーになる危険性も秘めている。",
      strategic_roles: [
        "軍隊の司令官",
        "大規模プロジェクトのリーダー",
        "組織の規律を守るマネージャー",
        "CEO・COO",
      ],
      defensive_use:
        "目的達成のためなら、個人の感情や事情といった『非効率な要素』を切り捨てる、冷徹な指揮官になります。規律で人を縛り、組織は活力を失い、ただの駒の集まりと化す危険があります。",
      proactive_use:
        "その『統率力』を、人々を従わせるためではなく、『人々が安心して能力を発揮できる土台を築く』ために使います。明確な規律（地）と、その下で流れる自由な心理的安全性（水）を両立させることで、最強の『組織設計者』として機能します。",
      debug_pattern:
        "目的達成のためなら、個人の感情や犠牲を厭わなくなる。ルールで人を縛り付け、組織が活力を失い、ただの駒の集まりになってしまう。",
      debug_method:
        "集団の「規律」ではなく、構成員一人ひとりの「インセンティブ（動機）」に焦点を当てること。メンバーの個人的な目標や関心事に耳を傾ける時間が、冷徹な仮面を外し、真の求心力を生みます。",
      quests: [
        "今週、チームメンバーの一人と仕事以外の雑談を5分間してみる。",
        "目標達成のプロセスにおいて、効率的ではないが「チームの士気が上がる方法」を一つだけ取り入れてみる。",
      ],
    },
    8: {
      name: "水地比",
      summary:
        "誰とでも親しくなれる、社交性と協調性のOS。人々を繋ぎ、助け合うことを喜びとするが、時に馴れ合いに流され、本来の目的を見失う。",
      strategic_roles: [
        "コミュニティ・ビルダー",
        "優れたネットワーカー",
        "顧客との深い関係を築く営業担当",
        "組織の潤滑油となる調整役",
      ],
      defensive_use:
        "人に嫌われることを極度に恐れるあまり、誰にでもいい顔をしてしまいます。派閥や内輪の論理に縛られ、より大きな目的のための、痛みを伴う『正しい決断』から逃避する傾向があります。",
      proactive_use:
        "その『親しみやすさ』を、意図的な『戦略的ネットワーキング』へと転換します。ただ仲良くなるのではなく、人と人とを繋ぎ、新しい価値を生み出す『触媒』となります。あなたの存在が、予期せぬコラボレーションを生み出す、強力な『ハブ・パーソン』として機能します。",
      debug_pattern:
        "人に嫌われることを恐れるあまり、誰にでもいい顔をしてしまう。派閥や内輪の論理に縛られ、より大きな視点での決断ができなくなる。",
      debug_method:
        "「親しさ（人間関係）」と「目的（タスク）」を切り離して考えること。今の行動が「ただ仲良くするため」なのか「共通の目的のため」なのかを自問する習慣が、進むべき道を示します。",
      quests: [
        "チームやグループの目標を、改めて自分の言葉で書き出し、現在の行動がそれに沿っているか確認する。",
        "あえて一人で過ごす時間を設け、他者との関係から離れて自分の本心と向き合う。",
      ],
    },
    9: {
      name: "風天小畜",
      summary:
        "大きな力が、目に見えない障害によって、少しだけ留められているOS。粘り強く、地道な努力で状況を打開する力を持つ。",
      strategic_roles: [
        "堅実な実務家",
        "リスクマネージャー",
        "粘り強い調整役",
        "品質保証（QA）担当者",
      ],
      defensive_use:
        "『どうせうまくいかない』と、小さな障害を言い訳にして、行動そのものを諦めてしまう『思考のブレーキ』。本来の力を発揮できず、不完全燃焼な状態に陥ります。",
      proactive_use:
        "その『障害を察知する』能力を、意図的な『リスクヘッジ機能』へと転換します。進む前に小さな問題点を洗い出し、一つずつ丁寧に対処していくことで、プロジェクト全体の失敗確率を劇的に下げる、優れた『品質保証（QA）のプロ』として機能します。",
      debug_pattern:
        "小さな障害や邪魔によって、完全に動きが止められてしまう。無力感に苛まれ、どうせ無理だと諦めて、努力を放棄してしまう。",
      debug_method:
        "「今は我慢の時」と割り切り、エネルギーの浪費を止めます。「進む」のではなく、「蓄える」ことに意識を集中させ、次の追い風を待つのが有効です。",
      quests: [
        "うまくいかないと感じたら、無理に進めず、関連する本を読んだり情報を集めたりする時間に切り替える。",
        "自分の最終目標を改めて確認し、今の停滞がその目標達成のプロセスの一部であることを認識する。",
      ],
    },
    10: {
      name: "天沢履",
      summary:
        "虎の尾を踏むような危険な状況でも、礼儀と慎重さで乗り切るOS。高いリスク管理能力と、緊張感のある場での対人スキルを持つ。",
      strategic_roles: [
        "危機管理のスペシャリスト",
        "礼節を重んじる交渉人（ディプロマット）",
        "コンプライアンス責任者",
        "重要な式典の進行役",
      ],
      defensive_use:
        "リスクを過大評価し、過剰なまでに慎重になるあまり、一歩も動けなくなる『過剰防衛モード』。ルールや前例がないと行動できず、絶好のチャンスを目の前にして見送ってしまいます。",
      proactive_use:
        "その『危険を察知する』能力を、緊張感の高い場面でこそ活きる『精密なプロトコル実行機能』に転換します。複雑な手順や、失敗の許されない重要な局面において、寸分の狂いもなく物事を遂行する、信頼性の高い『究極の現場監督』として機能します。",
      debug_pattern:
        "前例やルールがないと一歩も動けなくなる。リスクを恐れるあまり、絶好のチャンスを目の前にしても見送ってしまう。",
      debug_method:
        "「虎の尾を踏む」覚悟を決めること。安全な場所から出て、管理された小さなリスクを取る経験が、行動範囲を広げる鍵となります。",
      quests: [
        "今週、少しだけ自分の「コンフォートゾーン」を超える挑戦を一つしてみる。（例：会議で最初に発言する）",
        "自分が「危ない」と感じる行動について、何が具体的に危険なのかを3つ書き出し、対策を考える。",
      ],
    },
    11: {
      name: "地天泰",
      summary:
        "天地の気が交わるように、すべてがスムーズに流れ、安定と繁栄を享受する調和のOS。誰とでも良好な関係を築き、場を安定させる。",
      strategic_roles: [
        "組織開発コンサルタント",
        "優れたファシリテーター",
        "平和を創る調停者（メディエーター）",
        "心理的安全性の醸成者",
      ],
      defensive_use:
        "現状の平和と安定に満足し、『このままでいい』と変化を拒絶してしまう『現状維持バイアス』。問題の兆候から目をそらし、来るべき危機への備えを怠ってしまいます。",
      proactive_use:
        "その『調和を生み出す』力を、組織の『心理的安全性プラットフォーム』として意図的に構築します。誰もが安心して意見を言え、自由に才能を発揮できる環境をデザインすることで、組織のポテンシャルを最大化する『最高の場作り職人』として機能します。",
      debug_pattern:
        "「まあ、大丈夫だろう」と問題を先送りする。現状維持が最善だと考え、変化を促す意見を「波風を立てるもの」として退けてしまう。",
      debug_method:
        "あえて「最悪のシナリオ」を考えてみること。今の平和が崩れるとしたら、何が原因になるかを想像する訓練が、危機管理能力を呼び覚まします。",
      quests: [
        "今の仕事や人間関係について、「もし来月これがなくなるとしたら？」と仮定して、自分の感情や行動をシミュレーションしてみる。",
        "チームの誰かに「何か困っていることや、改善すべき点はない？」と具体的に聞いてみる。",
      ],
    },
    12: {
      name: "天地否",
      summary:
        "何をしても通じない、完全な閉塞感の中で、じっと耐え、本質を見極めるOS。他者と距離を置き、内なる世界を深く追求する力を持つ。",
      strategic_roles: [
        "孤高の研究者",
        "時代を待つ思想家",
        "内省するアーティスト",
        "デタッチメント（離脱）の達人",
      ],
      defensive_use:
        "世の中や他者への不信感から、心を固く閉ざし、あらゆる交流を拒絶する『完全シャットダウンモード』。『どうせ分かってもらえない』と諦め、自分の世界に引きこもり、社会的な孤立を深めます。",
      proactive_use:
        "その『外部と交わらない』特性を、深い内省と思索のための『精神の実験室』へと転換します。外部のノイズを完全に遮断することで、独自の哲学や革新的なアイデアを、誰にも邪魔されずに育て上げる『孤高の思想家』として、時代があなたに追いつくのを待ちます。",
      debug_pattern:
        "世の中や他者に対する不満と諦めが募り、心を閉ざしてしまう。「どうせ誰も理解してくれない」と、あらゆるコミュニケーションを拒絶する。",
      debug_method:
        "外との「接点」を意図的に作ること。挨拶をする、メールに一言感謝を添えるなど、どんなに小さなことでも、閉塞した空気に風穴を開ける一歩になります。",
      quests: [
        "一日一回、コンビニの店員さんなどに「ありがとう」と声に出して伝えてみる。",
        "自分の好きなことや専門分野について、SNSやブログで匿名で発信してみる。",
      ],
    },
    13: {
      name: "天火同人",
      summary:
        "公平無私な精神で、多くの人々と協力関係を築くことができるOS。オープンなコミュニケーションを好み、共通の理想のために人々を団結させる。",
      strategic_roles: [
        "オープンイノベーションの推進者",
        "NPO・社団法人の設立者",
        "派閥を超えて人をまとめるリーダー",
        "理念採用の責任者",
      ],
      defensive_use:
        "『みんな仲良く』という理想に固執するあまり、現実にある対立や不和から目を背けてしまいます。問題を放置した結果、水面下で不信感が募り、組織が機能不全に陥る『表面的な平和』を招きます。",
      proactive_use:
        "その『理想を掲げる』力を、多様な人々を惹きつける『共通の物語』を紡ぐために使います。利害関係の異なるメンバーを、一つの大きな目的の下に団結させる、優れた『ストーリーテラー』として機能します。",
      debug_pattern:
        "「みんな仲良く」という理想に固執するあまり、見て見ぬふりをする。水面下で燻る不和や対立を放置し、結果的に組織が機能不全に陥る。",
      debug_method:
        "「同」の中に潜む「異」を直視する勇気を持つこと。全員が完全に同じ意見である必要はないと認め、健全な対立を恐れない姿勢が、真の結束を生みます。",
      quests: [
        "チームの会議で、あえて少数意見や反対意見を代弁する役割を担ってみる。",
        "共通の目標を確認するだけでなく、「その目標達成における懸念点」を全員で出し合ってみる。",
      ],
    },
    14: {
      name: "火天大有",
      summary:
        "太陽のように明るく、多くのものを所有し、人々に与えることができる寛大なOS。その豊かさが慢心や傲慢に繋がる危険性も内包する。",
      strategic_roles: [
        "成功した企業のオーナー",
        "寛大なパトロン・投資家",
        "人望あるコミュニティリーダー",
        "社会貢献（CSR）担当責任者",
      ],
      defensive_use:
        "自分の成功や能力を誇示し、無意識のうちに他者を見下す『傲慢な王様』になります。与えることの喜びに酔いしれ、相手の真のニーズや、支えてくれている人々への感謝を見失います。",
      proactive_use:
        "その『所有する』力を、社会の富を循環させる『ハブ機能』へと転換します。自分の富や才能を『天からの預かりもの』と捉え、それを公正に分配し、新たな才能に投資する、賢明な『資産管理者』として機能します。",
      debug_pattern:
        "自分の成功や能力を誇示し、無意識のうちに他者を見下してしまう。与えることの喜びに酔いしれ、相手の真のニーズが見えなくなる。",
      debug_method:
        "「所有」から「預託」へ意識を切り替えること。自分の富や才能は「天から一時的に預かっているもの」と考え、その管理責任を意識することで、謙虚さを取り戻せます。",
      quests: [
        "今週、自分の成功体験を語るのではなく、誰かの成功を心から賞賛し、その要因を尋ねてみる。",
        "匿名で寄付をするなど、誰にも知られずに「与える」という行為を体験してみる。",
      ],
    },
    15: {
      name: "地山謙",
      summary:
        "実力（山）を内に秘め、態度はどこまでも低い（地）。その謙虚さゆえに、誰からも愛され、尊敬される人のあり方を体現するOS。",
      strategic_roles: [
        "人徳あるリーダー",
        "実力と謙虚さを兼ね備えた専門家",
        "優れたメンター・相談役",
        "敵を作らない交渉人",
      ],
      defensive_use:
        "『私なんて』が口癖になり、称賛や責任ある立場を頑なに拒否する『過剰な謙遜モード』。自分の価値を過小評価し、かえって周囲に気を遣わせたり、成長の機会を逃したりします。",
      proactive_use:
        "その『謙虚さ』を、他者の素晴らしい才能や意見を見つけ出し、光を当てるための『最強のサーチライト』へと転換します。自分を下げるのではなく、他者を上げることで、あなたは誰よりも信頼される、最高のサポーターであり、チームの潤滑油という、不可欠な存在になります。",
      debug_pattern:
        "「私なんて」が口癖になり、称賛や責任ある立場を頑なに拒否する。自分の意見を言わなくなり、結果的に周囲に面倒をかけてしまうことがある。",
      debug_method:
        "「謙遜」と「卑下」は違うと認識すること。自分の功績や能力を、事実として客観的に認める訓練が必要です。",
      quests: [
        "誰かに褒められたら、「ありがとうございます」とだけ言って、笑顔で受け止める練習をする。",
        "会議や議論の場で、一度は必ず「私の意見としては」と前置きして、自分の考えを表明してみる。",
      ],
    },
    16: {
      name: "雷地豫",
      summary:
        "喜びと楽しみを原動力に、人々を巻き込み、物事を進めることができるOS。計画性に優れるが、その楽しさが油断や準備不足に繋がることもある。",
      strategic_roles: [
        "イベントプロデューサー",
        "ムードメーカー",
        "エンターテイナー",
        "プロジェクトのキックオフ担当",
      ],
      defensive_use:
        "楽しい計画を立てるだけで満足してしまい、地味で退屈な実行段階を疎かにする『計画倒れ』の状態。楽観的になりすぎ、潜在的なリスクや障害を完全に見落としてしまいます。",
      proactive_use:
        "その『人々を喜ばせる』才能を、プロジェクト全体の『モチベーション設計』へと応用します。目標達成までの道のりに、意図的に『小さなご褒美』や『楽しいイベント』を組み込むことで、チームの士気を維持し、困難なタスクを乗り越える『最高の演出家』として機能します。",
      debug_pattern:
        "楽しい計画を立てるだけで満足してしまい、地味で退屈な実行段階を疎かにする。楽観的になりすぎ、潜在的なリスクを完全に見落とす。",
      debug_method:
        "計画の中に、あえて「面倒なこと」「地味な作業」の時間を組み込むこと。喜び（雷）のエネルギーを、着実な大地（地）のエネルギーで支える意識が重要。",
      quests: [
        "計画を立てる際に、「起こりうる最悪のトラブル3つとその対策」を必ずセットで考える。",
        "楽しいイベントの後に、必ず「片付けと振り返りの時間」を設ける。",
      ],
    },
    17: {
      name: "沢雷随",
      summary:
        "時代の変化や他者の意見に、喜びをもって柔軟に「ついていく」ことができるOS。優れた適応力を持つが、主体性を失いやすい側面もある。",
      strategic_roles: [
        "トレンドフォロワー",
        "優れたナンバー２・部下",
        "柔軟なアダプター",
        "流行の仕掛け人（フォロワーの心理を理解しているため）",
      ],
      defensive_use:
        "自分の意見や価値観を見失い、強いリーダーや流行に無思考で追従してしまう『思考停止のイエスマン』状態。その場では楽ですが、長期的には主体性を失い、利用されるだけの存在になります。",
      proactive_use:
        "その『流れを読む』能力を、意図的な『戦略的アジャイル機能』へと転換します。時代の変化や市場のトレンドをいち早く察知し、組織や自分自身を柔軟に適合させていく『優れたサーファー』のように、変化の波を乗りこなす力として発揮します。",
      debug_pattern:
        "自分の頭で考えなくなり、強いリーダーや流行に盲目的に追従する。「みんながそう言っているから」が判断基準になり、自分の本心を見失う。",
      debug_method:
        "流れに「随う」前に、一瞬立ち止まって「なぜ？」と自問する癖をつけること。自分の価値観という「錨」を下ろすことで、流されずに済みます。",
      quests: [
        "多数派の意見に賛同する前に、あえてその意見のデメリットやリスクを3つ考えてみる。",
        "今、自分が従っている人や情報について、「もしこれらが無かったら、自分はどう判断するか？」を想像してみる。",
      ],
    },
    18: {
      name: "山風蠱",
      summary:
        "放置されて腐敗した問題を、根本から立て直す強い意志と責任感を持つOS。改革への情熱が強すぎて、周囲との軋轢を生むことがある。",
      strategic_roles: [
        "事業再生コンサルタント",
        "組織改革の担当者",
        "負の遺産を清算する人",
        "問題解決のスペシャリスト",
      ],
      defensive_use:
        "問題の根源を断つことに固執し、人の感情や既存の秩序を無視した、強引で破壊的な改革を進めてしまう『暴走する正義』。正しいことをしているはずが、かえって周囲の反発を招き、孤立します。",
      proactive_use:
        "その『問題を根絶する』力を、腐敗したシステムを健全化する『ターンアラウンド・マネジメント機能』へと転換します。痛みを伴う改革の必要性を、風のように浸透する丁寧な対話で伝え、人々を巻き込みながら、山のように揺るぎない覚悟で事を成し遂げます。",
      debug_pattern:
        "問題の根源を断つことに固執し、人の感情や既存の秩序を無視した、強引で破壊的な改革を進めてしまう。正義感から、他者を断罪し始める。",
      debug_method:
        "改革（山）の前に、丁寧なコミュニケーション（風）を意識すること。なぜ改革が必要なのかを粘り強く説明し、人々の心を動かすことが、無用な抵抗を減らします。",
      quests: [
        "改革案を提示する前に、その改革によって不利益を被る可能性のある人の話を、一対一で聞いてみる。",
        "「壊す」ことだけでなく、「新しく創る」ことのビジョンを具体的に語る。",
      ],
    },
    19: {
      name: "地沢臨",
      summary:
        "親分肌・姉御肌で、大らかなリーダーシップで人々に臨むOS。人々を育成し、成長させる力があるが、時に甘やかしすぎて、規律が緩むことがある。",
      strategic_roles: [
        "育成担当マネージャー",
        "親分肌のリーダー",
        "コミュニティのまとめ役",
        "面倒見の良い先輩",
      ],
      defensive_use:
        "人に好かれたい、慕われたいという気持ちが強すぎるあまり、部下や後輩を甘やかし、規律を緩めてしまう『過保護なボス』。短期的には人気を得ますが、長期的には組織の成長を阻害し、誰も成長させられません。",
      proactive_use:
        "その『人々を惹きつける』力を、相手のポテンシャルを最大限に引き出す『才能開発エンジン』として活用します。大地のような大らかさと、沢のような喜びをもって相手に接し、成長の機会を与えることで、自発的な成長を促す『最高のメンター』として機能します。",
      debug_pattern:
        "情に流されて、公正な判断ができなくなる。言うべきことを言えず、問題のあるメンバーを放置した結果、全体の士気が下がってしまう。",
      debug_method:
        "「慈愛（地）」と「規律（沢の緊張感）」のバランスを取ること。優しさの中に、一本筋の通った厳しさを持つことが、真のリーダーシップに繋がります。",
      quests: [
        "今週、誰か一人に対して、感謝や評価だけでなく、改善を期待する点を具体的に伝えてみる。",
        "チームや家族のルールを一つだけ設定し、自らが率先してそれを守る姿を見せる。",
      ],
    },
    20: {
      name: "風地観",
      summary:
        "物事の表面ではなく、その奥にある本質を静かに観察する洞察力のOS。しかし、観察に徹するあまり、行動のタイミングを逃し、傍観者で終わることがある。",
      strategic_roles: [
        "市場アナリスト",
        "経営コンサルタント",
        "客観的な批評家",
        "自己分析の達人",
      ],
      defensive_use:
        "分析や批評に終始し、自らは行動を起こさない『安全地帯のコメンテーター』。『まだ情報が足りない』『本質が見えない』と言い訳をし、行動しないことを正当化し、現実から乖離していきます。",
      proactive_use:
        "その『本質を見抜く』能力を、未来を予測し、戦略を立てる『インサイト・エンジン』へと転換します。物事の表面（地）に流れる見えない風（風）を読むように、データや事象から誰も気づかないパターンや兆候を抽出し、次の打ち手を導き出す『優れた予報官』として機能します。",
      debug_pattern:
        "批評や分析ばかりで、自らは決して行動しようとしない。「まだ情報が足りない」「本質が見えない」と言い、行動しないことを正当化する。",
      debug_method:
        "「観察（観）」したことから得た「仮説」を、一つでもいいので「実行」してみること。不完全なままでの行動が、机上の空論からあなたを解放します。",
      quests: [
        "観察して気づいたことを、評価や結論ではなく、「〜という可能性があるかもしれません」という仮説の形で誰かに話してみる。",
        "一週間、ニュースやSNSを見る時間を半分にし、空いた時間で何かを「作る」活動（料理、文章、工作など）をする。",
      ],
    },
    21: {
      name: "火雷噬嗑",
      summary:
        "行く手を阻む障害を、断固たる決意で噛み砕き、排除する力強いOS。正義感が強く、問題解決能力に長けるが、そのやり方は時に強引すぎることがある。",
      strategic_roles: [
        "トラブルシューター",
        "不正を追及する監査役",
        "改革の実行部隊",
        "強い交渉人",
      ],
      defensive_use:
        "あらゆる物事を『障害』と見なし、力ずくで排除しようとする『破壊的解決モード』。対話や交渉を省略し、短期的な解決に飛びつくあまり、より大きな問題や人間関係の亀裂を引き起こします。",
      proactive_use:
        "その『障害排除』機能を、より外科手術的な『精密な問題除去システム』へと転換します。問題を感情的に『噛み砕く』のではなく、知性（火）のメスで問題の核心だけを正確に切り取り、行動（雷）によって迅速に実行します。",
      debug_pattern:
        "あらゆる物事を「障害」と見なし、力ずくで排除しようとする。対話や交渉を省略し、短絡的な解決策に飛びつき、より大きな問題を引き起こす。",
      debug_method:
        "「噛み砕く（噬嗑）」前に、一度「飲み込む」プロセスを挟むこと。問題の背景や相手の事情を、まず情報として受け止め、理解しようと努めることが、より賢明な解決策に繋がります。",
      quests: [
        "問題を発見した時、すぐに解決策を考えるのではなく、「なぜこの問題が起きたのか？」という原因を5回掘り下げてみる。",
        "誰かに反対意見を言われた時、即座に反論せず、一度「なるほど、そういう考え方もありますね」と受け止める。",
      ],
    },
    22: {
      name: "山火賁",
      summary:
        "物事を美しく飾り、調和の取れた形に整える美的感覚のOS。洗練された振る舞いをするが、時に外面にこだわりすぎ、本質を見失うことがある。",
      strategic_roles: [
        "クリエイティブ・ディレクター",
        "広報・PR担当者",
        "デザイナー",
        "プレゼンテーションの達人",
      ],
      defensive_use:
        "中身が伴っていないのに、見栄や体裁を保つことに必死になる『張りぼて症候群』。他者からの評価を過剰に気にし、自分らしさや本質的な価値を見失ってしまいます。",
      proactive_use:
        "その『装飾』能力を、物事の『本質的な価値を最大化する』ための戦略的ブランディング機能へと転換します。ただ美しく見せるだけでなく、なぜこのデザインなのか、なぜこの言葉を選ぶのか、その背景にある哲学（山）を知性（火）で語ることで、人々の深い共感を呼びます。",
      debug_pattern:
        "中身が伴っていないのに、見栄や体裁を保つことに必死になる。他者からの評価を過剰に気にし、自分らしさを失ってしまう。",
      debug_method:
        "すべての「飾り」を剥ぎ取った、素の自分を肯定すること。誰も見ていない場所で、自分が本当に心地よいと感じる服装や過ごし方をすることが、内なる自信を回復させます。",
      quests: [
        "今週、一日だけ「誰にも評価されない」をテーマに服装や行動を選んで過ごしてみる。",
        "自分の仕事や成果物について、「もしデザイン的要素を一切使えなかったら、何で価値を伝えるか？」を考えてみる。",
      ],
    },
    23: {
      name: "山地剝",
      summary:
        "古いものが剥がれ落ち、時代の終わりと変化の必要性を示すOS。本質を見極め、不要なものを手放すことができるが、衰退のエネルギーに飲まれがち。",
      strategic_roles: [
        "事業整理・リストラの専門家",
        "ミニマリスト",
        "時代の変化を読むトレンドアナリスト",
        "終活アドバイザー",
      ],
      defensive_use:
        "あらゆる物事の『終わりの側面』ばかりに目が行き、希望を失ってしまう『衰退モード』。変化の必要性を感じながらも、崩れゆく過去の栄光にしがみつき、しがみつくものさえも失ってしまいます。",
      proactive_use:
        "その『剥ぎ落とす』機能を、次の時代のために『本質だけを残す』ための戦略的デトックス機能へと転換します。何が失われるかを嘆くのではなく、何が『残る』のか、その最後の種子（碩果）を見極めることで、あなたは未来への投資家となります。",
      debug_pattern:
        "あらゆる物事の「終わりの側面」ばかりに目が行き、希望を失う。変化の必要性を感じながらも、崩れゆく現状にしがみつき、しがみつくものも失う。",
      debug_method:
        "剥がれ落ちたものの中に、唯一残る「種子」を見つけ出すこと。全てを失うように見えても、次代に繋がる本質的な価値が何かを探す視点が、希望を生みます。",
      quests: [
        "最近「終わった」と感じることについて、そこから得られた教訓や感謝できることを3つ書き出す。",
        "物理的に、クローゼットや本棚から、一年以上使っていないものを3つ手放してみる。",
      ],
    },
    24: {
      name: "地雷復",
      summary:
        "一度道を踏み外しても、再び正しい道に立ち返ることができる回復と再生のOS。失敗を恐れず、素直に反省できるが、同じ過ちを繰り返す傾向もある。",
      strategic_roles: [
        "失敗から学ぶリサーチャー",
        "再挑戦する起業家",
        "軌道修正のプロフェッショナル",
        "反省と改善を促すコーチ",
      ],
      defensive_use:
        "反省はするものの、行動が伴わず、『またやってしまった』という自己嫌悪のループに陥る『反省だけモード』。回復への意志が弱く、安易な道へとすぐに流されてしまいます。",
      proactive_use:
        "その『回復力』を、意図的な『ピボット機能』へと転換します。失敗を単なる過ちと捉えず、より良い方向へ進むための『貴重なデータ』と見なします。その学習サイクルを高速で回すことで、誰よりも早く最適な道を見つけ出す『アジャイルな探求者』として機能します。",
      debug_pattern:
        "反省はするものの、行動が伴わず、「またやってしまった」という自己嫌悪のループに陥る。回復への意志が弱く、安易な道へとすぐに流されてしまう。",
      debug_method:
        "「立ち返る（復）」ための、具体的な「道標」を設定すること。目標とする人物や、守るべきルールを明確に意識することで、進むべき方向がブレなくなります。",
      quests: [
        "自分が尊敬する人物なら、この状況でどう行動するかを想像し、その通りに行動してみる。",
        "「これだけは絶対にやらない」というルールを一つだけ決め、一週間守り通してみる。",
      ],
    },
    25: {
      name: "天雷无妄",
      summary:
        "作為や私心なく、自然体でいることを良しとするOS。誠実で裏表がないが、それ故に予期せぬ災難に巻き込まれやすい側面も持つ。",
      strategic_roles: [
        "誠実さが武器の営業担当",
        "純粋なアーティスト",
        "裏表のないリーダー",
        "自然体のインフルエンサー",
      ],
      defensive_use:
        "『あるがまま』を過信し、無計画・無防備に行動してしまう『無邪気な冒険家』モード。その純粋さが、予期せぬトラブルや、悪意ある他者からの攻撃を招き寄せてしまうことがあります。",
      proactive_use:
        "その『作為のない誠実さ』を、意図的な『信頼構築エンジン』へと転換します。小手先のテクニックを使わず、ありのままの自分でいることが、かえって人々の深い信頼と共感を呼び、長期的な関係を築く最強の戦略となります。",
      debug_pattern:
        "「あるがまま」を行き過ぎて、無防備・無計画になる。状況を顧みない無邪気な行動が、周囲に迷惑をかけたり、自身を危険に晒したりする。",
      debug_method:
        "「天の理」と「人の理」の両方を尊重すること。純粋な心を保ちつつも、社会的なルールや現実的なリスク管理の必要性を学ぶことが、身を守る知恵となります。",
      quests: [
        "何か新しいことを始める前に、その行動がもたらす可能性のあるポジティブな結果とネガティブな結果を、3つずつ予測してみる。",
        "自分の「善意」が、相手にとっては「おせっかい」になっていないか、客観的に振り返ってみる。",
      ],
    },
    26: {
      name: "山天大畜",
      summary:
        "内に大きなエネルギーや知識を蓄え、その解放の時を待つOS。忍耐強く、どっしりと構えているが、時にその力を持て余し、内的な葛藤を抱える。",
      strategic_roles: [
        "高度な専門知識を持つ研究者",
        "人材育成のエキスパート",
        "長期投資家",
        "大器晩成型の実力者",
      ],
      defensive_use:
        "知識やスキルを『蓄える』こと自体が目的化し、アウトプットを恐れる『知識のコレクター』。インプット過多で行動に移せず、宝の持ち腐れとなってしまいます。",
      proactive_use:
        "その『蓄積する』力を、後進を育成し、組織の知的資産を形成する『ナレッジ・マネジメントシステム』へと転換します。個人の学びを組織の力に変え、大きな価値を生み出す『知のダム』として機能します。",
      debug_pattern:
        "蓄えることに満足してしまい、アウトプットの機会を逃す。自分の能力を過信し、いざという時に、蓄えた力を効果的に使うことができない。",
      debug_method:
        "蓄えたものを、少しずつ「試す」こと。インプットとアウトプットの小さなサイクルを回し始めることが、力を飼い慣らす訓練になります。",
      quests: [
        "学んだ知識やスキルを、ごく一部でもいいので、実際の仕事や趣味で使ってみる。",
        "自分の持っている知識を、全くの初心者に説明するつもりで、図や文章にまとめてみる。",
      ],
    },
    27: {
      name: "山雷頤",
      summary:
        "自分自身と他者を、物質的・精神的に「養う」ことをテーマとするOS。言葉を慎み、本質的な栄養を求めるが、時に自分の殻に閉じこもりがちになる。",
      strategic_roles: [
        "栄養士・料理人",
        "情報リテラシーの専門家",
        "カウンセラー",
        "言論を慎むコメンテーター",
      ],
      defensive_use:
        "言葉や情報、食事など、自分に『取り入れる』ものの質に無頓着になり、心身のバランスを崩す『自己管理不全モード』。間違った栄養摂取が、パフォーマンスの低下や混乱を招きます。",
      proactive_use:
        "その『養う』機能を、自分だけでなく他者にも向けます。相手にとって本当に『栄養』となる言葉や情報を選んで与えることで、人々を健全に成長させる優れた『教育者』や『メンター』として機能します。",
      debug_pattern:
        "インプット過多になり、行動を伴わない評論家になる。言葉の正しさに固執し、他者の感情を無視した発言で、人間関係を損なう。",
      debug_method:
        "「口（頤）」を動かすだけでなく、「手足（行動）」を動かすこと。養った知識やエネルギーを、誰かのために具体的に使う経験が、あなたを現実世界に繋ぎ止めます。",
      quests: [
        "一週間、ゴシップや批判的なニュースに触れる時間を意識的に減らしてみる。",
        "誰かのために、見返りを求めずに、自分の時間やスキルを5分だけ使ってみる。（例：同僚の仕事を手伝う）",
      ],
    },
    28: {
      name: "澤風大過",
      summary:
        "常識の枠を超えた、並外れた行動力と責任感を持つOS。異常事態や危機において真価を発揮するが、平時では「やりすぎ」になりがち。",
      strategic_roles: [
        "危機管理コンサルタント",
        "特殊部隊の隊長",
        "常識を覆すイノベーター",
        "限界に挑むアスリート",
      ],
      defensive_use:
        "常に限界ギリギリの状況を求め、平時でも過剰な負荷をかけ続ける『アドレナリン・ジャンキー』。自分だけでなく、周囲をも燃え尽きさせ、最終的に構造そのものを破壊してしまいます。",
      proactive_use:
        "その『常識を超える』力を、絶体絶命の危機を乗り越えるための『最終兵器』として戦略的に活用します。誰もが諦めるような状況でこそ、常識外れの発想と覚悟が、不可能を可能にする『ゲームチェンジャー』として機能します。",
      debug_pattern:
        "常に限界に挑戦しようとし、自分にも他人にも過剰な負荷をかけ続ける。普通の物事では満足できず、わざと困難な状況を作り出してしまう。",
      debug_method:
        "「大過（大きな通り過ぎ）」のエネルギーを、日常の「小過（小さな通り過ぎ）」に分散させること。全てのことに120%で臨むのではなく、力の抜きどころを覚えるのが課題です。",
      quests: [
        "今日一日、「80%の力でやる」と決めて、仕事や家事に取り組んでみる。",
        "あえて何も生み出さない、完全に「無駄」な時間を30分作って過ごしてみる。",
      ],
    },
    29: {
      name: "坎為水",
      summary:
        "困難や危険の真っ只中で、その本質を学ぶ探求者のOS。精神的にタフで、物事の真理を見抜く力があるが、常に悩みや苦労が付きまとう。",
      strategic_roles: [
        "リスクアナリスト",
        "探偵・調査員",
        "不屈の探求者",
        "精神的な指導者（グル）",
      ],
      defensive_use:
        "困難な状況に慣れすぎてしまい、無意識にさらなる困難を引き寄せてしまう『トラブル hấp dẫn 体質』。悩みがないと不安になり、平穏な状態を自ら壊してしまうことがあります。",
      proactive_use:
        "その『困難に習う』機能を、複雑な問題の『本質を見抜く洞察力』へと転換します。危険の渦中で冷静さを保ち、物事の真理を探求することで、他の誰にも見えない解決策を見つけ出す、優れた『問題解決のプロフェッショナル』として機能します。",
      debug_pattern:
        "次から次へと問題を探し出し、自ら困難な状況に飛び込んでしまう。「悩みがないと不安」という状態に陥り、平穏な日常を楽しむことができない。",
      debug_method:
        "「水」の流れに身を任せつつも、岸辺に上がって休む時間を意識的に作ること。困難を乗り越えることだけでなく、その経験から何を学んだかを言語化することが、成長に繋がります。",
      quests: [
        "今抱えている悩み事を一つ、「これは自分を成長させるための訓練だ」と捉え直してみる。",
        "困難な状況について、事実と感情を分けて紙に書き出してみる。",
      ],
    },
    30: {
      name: "離為火",
      summary:
        "知性と情熱の炎で、周囲を明るく照らすOS。華やかで注目を集めるが、その輝きは他者（燃料）に依存しており、一人では燃え続けられない脆さも持つ。",
      strategic_roles: [
        "学者・研究者",
        "インフルエンサー",
        "ブランド・マネージャー",
        "カリスマ性のあるプレゼンター",
      ],
      defensive_use:
        "常に他者からの注目や承認（燃料）を求め、それが得られないと不安になる『承認欲求モンスター』。自分の輝きが、他者の評価に依存しているため、精神的に非常に脆くなります。",
      proactive_use:
        "その『照らし出す』力を、組織やプロジェクトの進むべき道を明確にする『知性の灯台』として活用します。複雑な状況を明快に分析・言語化し、人々が進むべき方向を照らすことで、なくてはならない『羅針盤』の役割を果たします。",
      debug_pattern:
        "常に他者からの注目や承認を求めるようになる。承認が得られないと、感情的に不安定になったり、さらに過剰に自分をアピールしたりする。",
      debug_method:
        "他者に依存する「付着（離）」のエネルギーから、自立して燃える「自灯明」へと意識を転換すること。自分の内側から湧き上がる情熱の源泉を見つけることが重要。",
      quests: [
        "誰にも見せる予定のない、自分のためだけの創作活動（文章、絵、音楽など）をしてみる。",
        "SNSの「いいね」の数を見ずに投稿してみる、あるいは一日デジタルデトックスをする。",
      ],
    },
    31: {
      name: "沢山咸",
      summary:
        "言葉にならない空気や感情を敏感に感じ取る、共感と思春期のOS。直感的でデリケートだが、その感受性の鋭さが、感情的な不安定さの原因にもなる。",
      strategic_roles: [
        "恋愛カウンセラー",
        "感受性の鋭いアーティスト",
        "共感を呼ぶマーケター",
        "直感的なネゴシエーター",
      ],
      defensive_use:
        "他者の感情に過剰に同調してしまい、自分の感情との境界線が曖昧になる『共感過多モード』。相手の機嫌に振り回され、精神的に疲弊し、主体的な判断ができなくなります。",
      proactive_use:
        "その『感じ取る』能力を、言葉にならないニーズや、市場の微細な変化を察知する『高感度センサー』へと転換します。理屈では説明できない『何か』を捉え、時代を先取りするインスピレーションを得る『トレンドセッター』として機能します。",
      debug_pattern:
        "他者の感情に影響されすぎて、自分の感情との区別がつかなくなる。相手の機嫌に振り回され、常に不安で、精神的に疲弊してしまう。",
      debug_method:
        "「感じる（咸）」ことと、「行動する」ことの間に、意図的に「思考する」というワンクッションを置くこと。感じたことを客観的な言葉に直す作業が、感情の波に飲まれないための防波堤になります。",
      quests: [
        "誰かの言動で心がざわついた時、その場で反応せず、「なぜ私は今、そう感じたのだろう？」と自分に問いかける。",
        "自分の今の気持ちを、天気（快晴、曇り、嵐など）に例えて表現してみる。",
      ],
    },
    32: {
      name: "雷風恒",
      summary:
        "一度決めたことを、地道に長く続けることができる持続性のOS。安定感と信頼性があるが、変化を嫌い、新しい物事に対応するのが苦手な面がある。",
      strategic_roles: [
        "ブランド・マネージャー",
        "品質管理責任者",
        "誠実なパートナー",
        "習慣化のプロ",
      ],
      defensive_use:
        "『いつも通り』に固執し、非効率だと分かっていても、やり方を変えられない『伝統墨守モード』。変化を『悪』とみなし、新しい提案を拒絶することで、組織の成長を停滞させます。",
      proactive_use:
        "その『継続する』力を、ブランドの価値や組織文化を維持・発展させる『ガーディアン（守護者）』機能へと転換します。核となる理念（恒）は変えずに、時代に合わせてやり方（雷・風）を柔軟に変化させることで、真に持続可能なシステムを築きます。",
      debug_pattern:
        "「いつも通り」に固執し、非効率的だとわかっていても、やり方を変えようとしない。新しい提案に対して、理由なく拒否反応を示してしまう。",
      debug_method:
        "「恒（恒常性）」とは「不変」ではないと知ること。核となる理念は変えずに、時代や状況に合わせてやり方を「変化」させ続けることが、真の持続力に繋がります。",
      quests: [
        "毎日やっている習慣（通勤ルートなど）を、今週一度だけ、あえて違うやり方で試してみる。",
        "自分の仕事や活動の「目的」と「手段」を書き出し、目的を達成するための別の手段がないか考えてみる。",
      ],
    },
    33: {
      name: "天山遯",
      summary:
        "深入りせず、最適なタイミングで引くことができる戦略的撤退のOS。冷静で賢明な判断ができるが、他者と深く関わることを避ける傾向がある。",
      strategic_roles: [
        "戦略的撤退の専門家",
        "リスクマネジメントの達人",
        "賢明な隠者",
        "ミニマリスト",
      ],
      defensive_use:
        "あらゆる人間関係や問題を『面倒なこと』と捉え、深く関わる前に逃げ出してしまう『関係リセット症候群』。結果的に誰とも深い信頼関係を築けず、表面的な付き合いばかりになり、本質的な孤独を感じます。",
      proactive_use:
        "その『危険を察知し、距離を置く』能力を、無駄な争いやエネルギーの消耗を避けるための『戦略的デタッチメント機能』へと転換します。感情的に深入りせず、大局的な視点から最適な距離を保つことで、常に冷静な判断を下せる『孤高の戦略家』として機能します。",
      debug_pattern:
        "あらゆる物事を「面倒なこと」と捉え、関わる前に逃げ出してしまう。人間関係が表面的になり、真の信頼関係を築けず、結果的に孤立する。",
      debug_method:
        "「逃げる（遯）」のではなく、「距離を取る」という意識を持つこと。全てをシャットアウトするのではなく、自分が快適でいられる適切な距離を見つけるゲームだと捉えます。",
      quests: [
        "気が進まない誘いに対して、断りの理由を誠実に伝え、代替案を一つ提案してみる。",
        "今週、一人の相手と、いつもより5分だけ長く対話し、一歩だけ深い質問をしてみる。",
      ],
    },
    34: {
      name: "雷天大壮",
      summary:
        "正義と理想のために、力強く前進するエネルギーに満ちたOS。エネルギッシュで実行力があるが、その力が暴走し、無謀な行動に出ることがある。",
      strategic_roles: [
        "エネルギッシュな実行部隊",
        "プロジェクトの突破役（アタッカー）",
        "情熱的なチャレンジャー",
        "正義感の強いリーダー",
      ],
      defensive_use:
        "有り余るエネルギーと自信から、状況を顧みずに突き進んでしまう『暴走する猪』。周囲の忠告に耳を貸さず、力で物事を解決しようとした結果、手痛い失敗を招き、自滅します。",
      proactive_use:
        "その『圧倒的なパワー』を、停滞した状況を打ち破るための『ロケットブースター』として戦略的に活用します。ただし、そのエネルギーを正しく導くための『天の理』（大局観・道理）をナビゲーターとすることで、その力は単なる破壊ではなく、創造的な前進力となります。",
      debug_pattern:
        "勢いだけで、後先を考えずに突進する。自分の力を過信し、周囲の忠告に耳を貸さず、結果的に自滅的な失敗を招く。",
      debug_method:
        "行動（雷）の前に、一度立ち止まり、天の理（天）、つまり大局的な視点や道理に合っているかを確認すること。パワーだけでなく、戦略を持つことが暴走を防ぎます。",
      quests: [
        "何かを「やるぞ！」と決めた時、実行する前に、その目的と手順、そして考えられるリスクを3つ書き出す。",
        "自分の主張を押し通すのではなく、相手に「どう思うか？」と質問し、判断材料を増やす。",
      ],
    },
    35: {
      name: "火地晋",
      summary:
        "太陽が地を昇るように、着実に前進し、周囲に認められていくOS。明るく社交的だが、他者からの評価を気にしすぎるあまり、自分を見失うことがある。",
      strategic_roles: [
        "出世街道を歩むエリート",
        "人当たりの良いプロモーター",
        "認められることを喜ぶパフォーマー",
        "ポジティブなムードメーカー",
      ],
      defensive_use:
        "他者からの承認や評価を過剰に求める『承認欲求の奴隷』になります。称賛されるためなら、自分を偽ったり、実力以上の自分を演じたりします。常に他者と比較し、嫉妬や焦燥感に駆られます。",
      proactive_use:
        "その『前進し、認められたい』という欲求を、チーム全体の士気を高めるための『ポジティブ・エンジン』へと転換します。自らが太陽のように明るく振る舞い、他者の良い点を見つけて称賛することで、組織全体に前向きなエネルギーを伝播させる『最高の広報担当』として機能します。",
      debug_pattern:
        "承認欲求が暴走し、認められるためなら、実力以上の自分を演じたり、不誠実な行動を取ったりする。常に他者と比較し、嫉妬や焦燥感に駆られる。",
      debug_method:
        "評価（火）の基盤となる、自分自身の大地（地）を固めること。他者からの評価ではなく、自分が何を積み重ねてきたかという「事実」に自信を持つことが、承認欲求から解放される鍵です。",
      quests: [
        "今週達成したことを、大小にかかわらず3つ書き出し、自分で自分を褒める。",
        "SNSなどで他者の華やかな成功を見ても、「これは自分の物語ではない」と意識的に切り離す練習をする。",
      ],
    },
    36: {
      name: "地火明夷",
      summary:
        "才能や正しさを内に秘め、困難な状況を耐え忍ぶことができるOS。用心深く、戦略的だが、悲観的になり、心を閉ざしてしまう傾向がある。",
      strategic_roles: [
        "逆境を耐える戦略家",
        "不遇の天才",
        "内部告発の準備者",
        "潜入捜査官（スパイ）",
      ],
      defensive_use:
        "理不尽な状況への絶望から、心を固く閉ざし、誰にも本心を見せない『鉄仮面モード』。『どうせ誰も理解してくれない』と全ての可能性を諦め、才能を腐らせてしまいます。",
      proactive_use:
        "その『才能を隠す』能力を、意図的な『ステルス機能』へと転換します。今は正義が通じない暗黒時代だと割り切り、あえて無能なふりをしながら、水面下で着実に力を蓄え、情報を収集します。時が来た時に全てを覆すための、最もインテリジェントな生存戦略です。",
      debug_pattern:
        "極度の不信感に陥り、誰も信じられなくなる。「どうせ自分は理解されない」と諦め、自分の能力を全く発揮せずに、チャンスを待ち続ける。",
      debug_method:
        "心の中の小さな光（火）を、完全に消さないこと。信頼できる一人にだけ本音を話す、好きなことに没頭するなど、心の灯火を守るための安全基地を確保します。",
      quests: [
        "自分の才能や考えを、匿名で発信できる場所に、少しだけアウトプットしてみる。",
        "どんなに絶望的な状況でも、「それでも感謝できること」を一日一つ見つけて記録する。",
      ],
    },
    37: {
      name: "風火家人",
      summary:
        "家庭や組織といった「内側」の秩序と調和を重んじるOS。情愛深く、真面目だが、内向きになりすぎて、外部の変化に対応するのが遅れがち。",
      strategic_roles: [
        "コミュニティの守護者",
        "組織文化の醸成担当",
        "ルールと秩序を重んじるマネージャー",
        "家庭を大切にする大黒柱",
      ],
      defensive_use:
        "身内びいきが激しくなり、外部の人間に対して排他的になる『タコツボ化現象』。『うちのやり方』に固執し、新しい価値観や方法論を一切受け入れず、組織の成長を停滞させます。",
      proactive_use:
        "その『内部を固める』力を、外部の脅威から組織を守るための『強力な城壁』として機能させます。明確なルール（火）と、柔軟なコミュニケーション（風）によって、盤石なチームワークを築き、どんな困難にも揺るがない『安全な家』を創り上げます。",
      debug_pattern:
        "身内びいきが激しくなり、外部の人間に対して排他的になる。「うちのやり方」に固執し、新しい価値観や方法論を一切受け入れなくなる。",
      debug_method:
        "家（内）の中に、外の「風」を入れること。意識的に外部の人と交流する機会を持ったり、全く違う分野の情報をインプットしたりすることが、停滞を防ぎます。",
      quests: [
        "今週、これまで話したことのない部署の人や、違うコミュニティの人とランチに行ってみる。",
        "家族やチームの「当たり前」になっているルールについて、「なぜこのルールは必要なのか？」を問い直してみる。",
      ],
    },
    38: {
      name: "火沢睽",
      summary:
        "鋭い知性で物事の「違い」を見抜き、独自の視点を持つOS。反骨精神が旺盛だが、その性質が不必要な対立や孤立を生む原因にもなる。",
      strategic_roles: [
        "異端の批評家",
        "カウンターカルチャーの旗手",
        "あえて逆張りする戦略家",
        "優れたデバッガー（問題発見者）",
      ],
      defensive_use:
        "反論のための反論をするようになり、常に誰かと対立していないと気が済まない『永遠の反抗期』。人を信じることができず、疑心暗鬼の塊になり、自ら孤立を招きます。",
      proactive_use:
        "その『違いを見抜く』鋭い知性を、誰も気づかないシステムの欠陥や、思考の盲点を発見するための『デバッグ機能』へと転換します。皆が同じ方向を向いている時こそ、あなたの『なぜ？』が、組織を大きな過ちから救うのです。",
      debug_pattern:
        "反論のための反論をするようになり、常に誰かと対立していないと気が済まなくなる。人を信じることができず、疑心暗鬼の塊になる。",
      debug_method:
        "「違うこと」と「敵対すること」は違うと理解すること。相手との違いを、新たな視点を与えてくれる「ギフト」として捉え直す訓練が必要です。",
      quests: [
        "議論の場で、あえて相手の意見を擁護する立場で発言してみる。",
        "自分と全く違う趣味や価値観を持つ人のドキュメンタリーや本に触れてみる。",
      ],
    },
    39: {
      name: "水山蹇",
      summary:
        "進むに行き詰まり、困難の中で立ち往生しているOS。苦労が多く、悩みやすいが、この経験が深い人間的成長と問題解決能力を育む。",
      strategic_roles: [
        "粘り強い交渉人",
        "困難なプロジェクトの解決屋",
        "逆境でこそ燃える挑戦者",
        "他者の痛みがわかるカウンセラー",
      ],
      defensive_use:
        "『どうせ何をやっても無駄だ』という無力感に囚われ、思考と行動を完全に停止させてしまう『フリーズモード』。一人で問題を抱え込み、助けを求めることすら諦めてしまいます。",
      proactive_use:
        "その『行き詰まり』を、安易な道を退け、最善の道筋を発見するための『高度なフィルタリング機能』へと転換します。進めないのは、その道が間違っているから。困難（水）を前に止まる（山）ことで、あなたは無駄な行動を避け、仲間と協力する道を選び取れるのです。",
      debug_pattern:
        "「どうせ何をやっても無駄だ」という無力感に囚われ、完全に思考停止・行動停止に陥る。一人で問題を抱え込み、助けを求めることすら諦める。",
      debug_method:
        "「進む」のではなく、「戻って仲間と合流する」という選択肢を思い出すこと。一人で越えられない山（蹇）も、協力者がいれば乗り越えられると信じます。",
      quests: [
        "今抱えている一番大きな問題を、信頼できる人に「ただ聞いてもらうだけ」でいいので話してみる。",
        "問題解決から一旦離れ、全く関係のないことで、小さな成功体験（例：料理をレシピ通りに作る）を積む。",
      ],
    },
    40: {
      name: "雷水解",
      summary:
        "凍てついた困難な状況を、行動の雷で打ち破り、解放へと導くOS。決断力があり、さっぱりしているが、時に過去の反省を疎かにする傾向がある。",
      strategic_roles: [
        "問題解決のスペシャリスト",
        "緊張を緩和するムードメーカー",
        "過去を許し、未来へ向かう改革者",
        "解放と自由の象徴",
      ],
      defensive_use:
        "問題を解決すること自体が目的化し、次から次へと『解決すべき問題』を探し始める『トラブルハンター』。根本的な原因を解決せず、対症療法を繰り返すため、同じような問題が再発します。",
      proactive_use:
        "その『問題を解きほぐす』能力を、複雑に絡み合った人間関係や、組織のしがらみを解消するための『デトックス機能』として活用します。春の雷（雷）が冬の氷（水）を溶かすように、停滞した状況に活気を取り戻し、新たな始まりを告げます。",
      debug_pattern:
        "問題を解決すること自体が目的化し、次から次へと問題を探し始める。根本的な原因を解決せず、対症療法を繰り返してしまう。",
      debug_method:
        "問題が「解けた」後、なぜその問題が起きたのかを振り返る時間を設けること。氷が溶けた後の水溜まりを、静かに眺めるような時間が必要です。",
      quests: [
        "解決した問題について、その原因と再発防止策を3行でまとめて記録する。",
        "何もない、平穏な一日を「最高の状態」として意識的に味わってみる。",
      ],
    },
    41: {
      name: "山沢損",
      summary:
        "自分を損なって他者を益することができる、自己犠牲と抑制のOS。我慢強いが、自分の感情や欲求を無視し続け、心身のバランスを崩すことがある。",
      strategic_roles: [
        "コストカッター",
        "ミニマリスト",
        "断捨離のコンサルタント",
        "誠実な自己犠牲者",
      ],
      defensive_use:
        "他者のために自分を犠牲にすることが常態化し、自分の感情や欲求を無視し続ける『自己犠牲スパイラル』。周囲からは感謝されず、都合よく利用されるだけの存在になり、心身を消耗します。",
      proactive_use:
        "その『損なう』力を、意図的に『選択と集中』のための戦略へと転換します。無駄なタスクや人間関係を『損切り』することで、最も重要な一点にリソースを集中投下する。これは、未来の大きな利益（益）のための、高度な『戦略的投資機能』です。",
      debug_pattern:
        "自己犠牲が常態化し、自分が何をしたいのか、何を感じているのか分からなくなる。周囲からは感謝されず、利用されるだけの存在になってしまう。",
      debug_method:
        "「損する」前に、まず自分の「器」を満たすこと。自分を大切にし、欲求を満たすことは、他者を助けるためのエネルギー補充なのだと許可すること。",
      quests: [
        "今週、他者のためではなく、100%自分のためだけに使う時間と予算を確保し、実行する。",
        "誰かに何かを頼まれた時、それを引き受けることで自分が何を「損なう」のか（時間、労力など）を一度考えてみる。",
      ],
    },
    42: {
      name: "風雷益",
      summary:
        "他者を益し、社会に貢献することで、結果的に自分も豊かになるOS。行動的で前向きだが、時に自分のキャパシティを超えて他者に与えすぎることがある。",
      strategic_roles: [
        "社会貢献家（フィランソロピスト）",
        "優れたメンター",
        "Win-Winを創造する事業開発者",
        "エンジェル投資家",
      ],
      defensive_use:
        "『与えなければならない』という強迫観念に駆られ、相手の状況を無視してお節介な善意を押し付けてしまう『ありがた迷惑モード』。良かれと思ってしたことが、かえって相手の自立を妨げ、関係を損ないます。",
      proactive_use:
        "その『他者を益する』力を、善意の好循環を生み出す『エコシステム・エンジン』として活用します。風のように素早く善い行いをし、雷のように人々を奮い立たせる。あなたの行動が起爆剤となり、社会全体に利益の連鎖反応を引き起こします。",
      debug_pattern:
        "「与えなければならない」という強迫観念に駆られる。相手のニーズを無視して、お節介な善意を押し付けてしまい、かえって関係を損なう。",
      debug_method:
        "「与える（益す）」ことと、「受け取る」ことのバランスを取ること。他者の助けや厚意を、感謝して受け取る訓練が必要です。",
      quests: [
        "今週、誰かに助けを求め、その助けを素直に受け入れてみる。",
        "自分の善意が、本当に相手のためになっているか、一度立ち止まって考えてみる。",
      ],
    },
    43: {
      name: "沢天夬",
      summary:
        "曖昧な状況に決断を下し、物事を突破する力を持つOS。大胆でリーダーシップがあるが、その決断が強引で、反発を招くこともある。",
      strategic_roles: [
        "改革の断行者",
        "不正を断つコンプライアンス責任者",
        "決断力のあるリーダー",
        "突破役（アタッカー）",
      ],
      defensive_use:
        "白黒つけたがるあまり、まだ熟していない問題にまで無理やり結論を出そうとする『拙速な断罪者』。反対意見を『悪』とみなし、対話の可能性を一切排除するため、多くの敵を作り、組織に亀裂を生みます。",
      proactive_use:
        "その『決断力』を、長年放置されてきた組織の悪弊や、プロジェクトのボトルネックを排除するための『最終決裁機能』として発揮します。危険を伴いますが、その勇気ある決断が、全体の停滞を打ち破り、新たなステージへの扉を開きます。",
      debug_pattern:
        "白黒つけたがるあまり、まだ熟していない問題にまで、無理やり結論を出そうとする。反対意見を「悪」とみなし、徹底的に排除しようとする。",
      debug_method:
        "決断（夬）の前に、十分な情報開示と対話（沢の象徴）を行うこと。トップダウンで決めるのではなく、関係者を巻き込み、納得感を醸成するプロセスが重要。",
      quests: [
        "何かを決断する前に、関係者に「この件について懸念点はありますか？」と意見を求める場を設ける。",
        "自分の決断が100%正しいとは限らない、という可能性を常に心の片隅に置いておく。",
      ],
    },
    44: {
      name: "天風姤",
      summary:
        "予期せぬ出会いやチャンスに巡り合う、強い影響力と魅力を持つOS。しかし、その偶然の出会いが、時に計画を乱し、思わぬ危険を招くことがある。",
      strategic_roles: [
        "天性のネットワーカー",
        "トレンドの初期発見者",
        "カリスマ的なインフルエンサー",
        "M&Aの専門家",
      ],
      defensive_use:
        "その魅力を無自覚に振りまき、無責任で軽率な関係を広げすぎてしまう『危険な遭遇モード』。次々と新しい刺激を求め、一つの物事をやり遂げることができず、計画性なく漂流します。",
      proactive_use:
        "その『偶然を引き寄せる』力を、意図的な『セレンディピティ・エンジン』へと転換します。予期せぬ出会いや情報を、新たなビジネスチャンスやイノベーションの種として捉え、結びつける。あなたの存在が、組織に予測不能な幸運をもたらす『触媒』となります。",
      debug_pattern:
        "魅力に任せて、無責任で軽率な関係を広げすぎてしまう。次々と新しい刺激を求め、一つの物事をやり遂げることができなくなる。",
      debug_method:
        "出会ったものを「吟味する」というフィルタを持つこと。全ての出会いが自分にとってプラスとは限らないと理解し、受け入れるものと断るものを冷静に選択します。",
      quests: [
        "新しい誘いや頼まれごとに対して、即答せずに「一晩考えさせてください」と返事をする。",
        "今、自分が関わっている人やプロジェクトをリストアップし、本当に大切なものに優先順位をつける。",
      ],
    },
    45: {
      name: "沢地萃",
      summary:
        "人々が自然と集まってくる、喜びと求心力のOS。社交的でイベント好きだが、集まること自体が目的化し、生産性を失うことがある。",
      strategic_roles: [
        "コミュニティ・オーガナイザー",
        "イベントプロデューサー",
        "求心力のあるリーダー",
        "資金調達（ファンドレイザー）のプロ",
      ],
      defensive_use:
        "人が集まることや、祭りのような高揚感自体が目的化し、本来の目標を見失う『お祭り騒ぎ症候群』。内輪の楽しさを優先し、地味で重要な実務や、外部の変化への対応を疎かにします。",
      proactive_use:
        "その『人を集める』能力を、共通の目的を達成するための『リソース結集システム』として活用します。人、モノ、金、情報といった多様なリソースを、喜び（沢）をもって一箇所に集め、大きなプロジェクトを動かすための強力な『プラットフォーム』を構築します。",
      debug_pattern:
        "お祭りのような高揚感を常に求め、地味で退屈な日常業務を疎かにする。内輪の楽しさを優先し、外部の意見や変化に対して排他的になる。",
      debug_method:
        "集まった人々と「何を成し遂げるのか」という共通の目的（地）を再確認すること。楽しい交流（沢）のエネルギーを、具体的な成果に結びつける意識が求められます。",
      quests: [
        "飲み会やイベントの場で、楽しい話だけでなく、今後の目標や課題についても少しだけ話す時間を作る。",
        "チームの目標達成のために、今の人間関係や集まりがどう貢献しているかを客観的に評価してみる。",
      ],
    },
    46: {
      name: "地風升",
      summary:
        "地道な努力を積み重ね、着実に成長し、昇っていくことができるOS。謙虚で真面目だが、時に要領が悪く、遠回りをしてしまうことがある。",
      strategic_roles: [
        "着実に成果を出す努力家",
        "後輩を育成するメンター",
        "大器晩成型のエキスパート",
        "品質改善（カイゼン）の担当者",
      ],
      defensive_use:
        "ただがむしゃらに努力するだけで、その方向性が正しいかを疑わない『思考停止の努力家』。より効率的な方法があっても、一度始めたやり方に固執し、多くの時間と労力を無駄にしてしまいます。",
      proactive_use:
        "その『着実に成長する』力を、再現性のある『人材育成プログラム』へと転換します。自分の成功体験を、誰でも段階的に（升）成長できるようなフレームワークに落とし込み、組織全体のレベルアップに貢献する『マニュアル作成の達人』として機能します。",
      debug_pattern:
        "ただがむしゃらに努力するだけで、その方向性が正しいのかを疑わない。より効率的な方法があっても、一度始めたやり方に固執してしまう。",
      debug_method:
        "自分の努力（地）を、客観的な視点（風）で俯瞰すること。定期的に立ち止まり、専門家の意見を聞いたり、他者のやり方を参考にしたりすることで、軌道修正が可能になります。",
      quests: [
        "今やっている作業について、「もっと楽に、賢くやる方法はないか？」をテーマに、30分間ブレインストーミングする。",
        "自分の分野で成功している人のやり方を、一つ真似てみる。",
      ],
    },
    47: {
      name: "沢水困",
      summary:
        "深刻な困窮や逆境の中で、内面的な強さが試されるOS。精神的に鍛えられるが、希望を失い、悲観主義に陥りやすい傾向がある。",
      strategic_roles: [
        "逆境に強い哲学者",
        "不屈の精神を持つサバイバー",
        "本質を見抜くコンサルタント",
        "デバッグの専門家",
      ],
      defensive_use:
        "『どうせ何をやってもダメだ』という無力感と自己否定に囚われ、あらゆる行動意欲を失う『完全シャットダウンモード』。外部とのコミュニケーションを断絶し、苦しい状況の中でただ一人、耐え忍ぶことしかできなくなります。",
      proactive_use:
        "その『困窮』を、物事の『本質的な課題』を発見するための究極の『デバッグ・モード』として活用します。全ての装飾や言い訳が剥ぎ落とされた極限状況でこそ、問題の本当の核心が見えてきます。その洞察力が、組織に最も価値のある気づきをもたらします。",
      debug_pattern:
        "「自分は何をやってもダメだ」という自己否定に陥り、あらゆる行動の意欲を失う。口数が減り、他者とのコミュニケーションを完全に断絶する。",
      debug_method:
        "どんな小さなことでもいいので、「喜び（沢）」の感覚を取り戻すこと。美味しいものを食べる、好きな音楽を聴くなど、五感が喜ぶ体験が、淀んだ水（困）に光を差し込みます。",
      quests: [
        "今日一日の中で、自分が「少しでも楽しい」「心地よい」と感じた瞬間を3つ記録する。",
        "自分の苦境を、ユーモアを交えて誰かに話してみる。笑いに変えることで、客観視できるようになる。",
      ],
    },
    48: {
      name: "水風井",
      summary:
        "井戸のように、変わることなく、人々に価値を提供し続けるOS。安定感があり、公平だが、自己変革やイノベーションが苦手な面がある。",
      strategic_roles: [
        "インフラを支えるエンジニア",
        "安定した価値を提供する老舗ブランド",
        "普遍的な知識を教える教師",
        "組織のバックボーン",
      ],
      defensive_use:
        "『昔からこうだから』と、変化を頑なに拒絶する『レガシー・システム』。周囲のニーズが変わっているのに気づかず、時代遅れの価値を提供し続け、誰からも必要とされなくなります。",
      proactive_use:
        "その『不変の価値』を、組織の理念や文化の根幹となる『共有ライブラリ』として機能させます。時代が変わっても決して揺るがない普遍的な価値観（井戸）を提示し続けることで、メンバーがいつでも立ち返れる『精神的な支柱』となります。",
      debug_pattern:
        "「昔からこうだから」と、変化を頑なに拒む。周囲のニーズが変わっているのに気づかず、時代遅れの価値を提供し続け、誰からも求められなくなる。",
      debug_method:
        "井戸の「水質調査」を定期的に行うこと。つまり、自分の提供している価値が、今も本当に求められているのかを、謙虚に市場や他者に問いかける必要があります。",
      quests: [
        "自分の仕事やサービスについて、顧客や関係者に「改善してほしい点はありますか？」と直接フィードバックを求める。",
        "全く違う業界のビジネスモデルを学び、自分の活動に応用できないか考えてみる。",
      ],
    },
    49: {
      name: "沢火革",
      summary:
        "古い体制や常識を打ち破り、全く新しいものへと変革するOS。理想に燃え、大胆な行動ができるが、その過程で多くのものを破壊し、反発を招く。",
      strategic_roles: [
        "革命家",
        "破壊的イノベーター",
        "事業再生の専門家",
        "常識を覆すゲームチェンジャー",
      ],
      defensive_use:
        "改革のための改革に陥り、ただ『壊すこと』自体に快感を覚えてしまう『破壊中毒モード』。理想を追い求めるあまり、現実的な着地点を見失い、周囲を不要な混乱に陥れます。",
      proactive_use:
        "その『常識を覆す』力を、古いシステムや淀んだ空気を刷新するための『リブート・エンジン』として活用します。革命（革）のビジョンだけでなく、革命後の新しい秩序（火）を具体的に示すことで、人々はあなたの変革に希望を見出し、ついてきます。",
      debug_pattern:
        "改革のための改革に陥り、ただ壊すこと自体に快感を覚えてしまう。理想を追い求めるあまり、現実的な着地点を見失い、周囲を混乱に陥れる。",
      debug_method:
        "革命（革）のビジョンだけでなく、革命後の「新しい秩序（火）」を具体的に示すこと。壊した後に何を創るのかを明確に語ることで、人々はあなたについてきます。",
      quests: [
        "自分の改革案について、そのメリットだけでなく、考えられるデメリットと、それによって迷惑をかける人をリストアップする。",
        "反対派のリーダーと一対一で対話し、相手の懸念や恐れを徹底的にヒアリングする。",
      ],
    },
    50: {
      name: "火風鼎",
      summary:
        "新しい文化や安定した組織を、じっくりと時間をかけて作り上げるOS。三方よしの精神を重んじ、協力体制を築くのが得意だが、動きが遅くなりがち。",
      strategic_roles: [
        "組織文化の醸成者",
        "コミュニティ・ビルダー",
        "安定したシステムの設計者",
        "賢明な統治者",
      ],
      defensive_use:
        "安定を求めるあまり、ルールのためのルールを作り、組織が官僚的で硬直化してしまう『形式主義の罠』。合意形成に時間をかけすぎ、外部の急速な変化に対応できなくなります。",
      proactive_use:
        "その『安定した器を創る』能力を、多様な才能が安心して能力を発揮できる『共有プラットフォーム』として構築します。鼎が三本の足で安定するように、明確な理念、公正なルール、そして温かいコミュニケーションの三本柱で、揺るぎない組織文化を育みます。",
      debug_pattern:
        "関係者の合意形成に時間をかけすぎ、ビジネスチャンスを逃す。組織が安定するあまり、内向きになり、官僚的で風通しの悪い組織になってしまう。",
      debug_method:
        "安定した鼎（かなえ）の足元で、常に新しい「火」を燃やし続けること。定期的に新しいメンバーを入れたり、外部の刺激を取り入れたりする仕組みが、組織の硬直化を防ぎます。",
      quests: [
        "会議で、あえて全員の意見が一致する前に、「このあたりで一度、仮決定として進めましょう」と提案してみる。",
        "自分のチームや組織の「暗黙のルール」を書き出し、それが本当に必要かを見直してみる。",
      ],
    },
    51: {
      name: "震為雷",
      summary:
        "雷のように、衝撃的な出来事をきっかけに行動を起こし、人々を覚醒させるOS。エネルギッシュで機動力があるが、行動が衝動的で、計画性に欠けることがある。",
      strategic_roles: [
        "切り込み隊長",
        "新プロジェクトの始動役（キックオフ担当）",
        "停滞を打破する起爆剤",
        "サプライズの演出家",
      ],
      defensive_use:
        "常に刺激を求め、平穏な状態に耐えられなくなる『衝撃依存モード』。深く考えずに行動し、周囲を驚かせ、混乱させること自体が目的になってしまいます。",
      proactive_use:
        "その『覚醒させる』エネルギーを、停滞した議論やマンネリ化した組織に活を入れるための『電気ショック機能』として戦略的に使います。あなたの行動や発言が、人々の眠っていた情熱や問題意識を呼び覚ます、ポジティブな『モーニングコール』となります。",
      debug_pattern:
        "常に刺激を求め、平穏な状態に耐えられなくなる。深く考えずに行動し、周囲を驚かせ、混乱させること自体が目的になってしまう。",
      debug_method:
        "行動（雷）の後に、必ず「振り返り（内省）」の時間を設けること。自分の起こした衝撃が、周囲にどのような影響を与えたかを冷静に分析することで、衝動は経験へと変わります。",
      quests: [
        "何か大きなアクションを起こした翌日に、その結果と反省点を3つだけメモする。",
        "「驚かせる」のではなく、「喜ばせる」にはどうすれば良いか、という視点で次のアクションを計画してみる。",
      ],
    },
    52: {
      name: "艮為山",
      summary:
        "山の如く動じない、内省と静止のエネルギーを持つOS。深い思慮と冷静な判断力を持ちますが、時に行動をためらい、好機を逃すことがあります。",
      strategic_roles: [
        "思慮深い哲学者",
        "冷静な判断を下す審判役",
        "瞑想家",
        "情報を遮断するデジタルミニマリスト",
      ],
      defensive_use:
        "思考の無限ループにはまり込み、行動や決断を完全に停止させてしまう『分析麻痺（アナリシス・パラリシス）』。あらゆるリスクを想定しすぎて身動きが取れなくなり、他者との関わりを断絶します。",
      proactive_use:
        "その『静止』する力を、情報過多の現代における『戦略的ノイズキャンセリング機能』へと転換します。外部の雑音を意図的に遮断し、内省に集中することで、物事の本質を見極め、最も重要な一点にリソースを集中させる、賢明な『ミニマリスト戦略家』として機能します。",
      debug_pattern:
        "思考の無限ループに陥り、行動や決断を完全に停止させてしまう。あらゆるリスクを想定しすぎて身動きが取れなくなり、他者との関わりを断絶します。",
      debug_method:
        "『思考』から『五感』へ意識を強制的に切り替えることがデバッグの鍵です。熱いお茶をゆっくり味わう、好きな音楽に没頭する、土や植物に触れるなど、身体感覚を取り戻すことで思考のループから抜け出せます。",
      quests: [
        "結論の出ない悩み事を、一つだけ紙に書き出して、一旦「保留」と決めて脇に置く。",
        "計画が6割固まった段階で、まず誰かに話してみる、あるいは最初の小さな一歩だけ踏み出してみる。",
      ],
    },
    53: {
      name: "風山漸",
      summary:
        "物事を順序立てて、一歩一歩着実に進めることができるOS。真面目で信頼性があるが、急な変化への対応が遅く、時間がかかりすぎるのが弱点。",
      strategic_roles: [
        "着実なプロジェクトマネージャー",
        "マニュアル作成の達人",
        "信頼できる教育者",
        "長期的な関係を築くパートナー",
      ],
      defensive_use:
        "手続きや前例に固執するあまり、本来の目的を見失う『マニュアル絶対主義』。完璧な準備をしようとするあまり、いつまで経ってもスタートラインに立てず、絶好の機会を逃してしまいます。",
      proactive_use:
        "その『順序立てて進める』能力を、複雑なプロジェクトを誰にでも実行可能な『再現性のあるプロセス』へと落とし込むために活用します。あなたの着実なプロセス設計が、チーム全体の生産性を向上させ、大きな失敗を防ぐ『信頼性の守護者』となります。",
      debug_pattern:
        "手続きや前例に固執し、本来の目的を見失う。完璧な準備をしようとするあまり、いつまで経ってもスタートラインに立てない。",
      debug_method:
        "「漸（ぜん）」進のプロセスの中に、意図的に「遊び」や「実験」の要素を取り入れること。決められたルートから少しだけ外れてみる経験が、柔軟性を育てます。",
      quests: [
        "プロジェクトの計画を立てる際に、「もし納期が半分になったら、何を捨てるか？」を考えてみる。",
        "いつもと違う通勤ルートを通る、ランチの店を変えるなど、日常に小さな変化を取り入れる。",
      ],
    },
    54: {
      name: "雷沢帰妹",
      summary:
        "情熱や衝動に従って、常識的な順序を無視してでも関係性を築こうとするOS。人間的な魅力にあふれるが、その関係は不安定で、長続きしない傾向がある。",
      strategic_roles: [
        "情熱的なアーティスト",
        "衝動的な恋愛家",
        "ルールに縛られない自由人",
        "ニッチな分野の開拓者",
      ],
      defensive_use:
        "刹那的な喜びに溺れ、長期的な視点を完全に欠いた無責任な行動に走る『快楽主義者の罠』。その場の感情で全てを決め、人間関係やプロジェクトを常に不安定な状態に置きます。",
      proactive_use:
        "その『常識にとらわれない』エネルギーを、既存のルールが通用しない『未開拓領域への挑戦』に活用します。正式な手順を踏めない状況でこそ、あなたの情熱と衝動が、誰も通ったことのない道を切り開く『ファーストペンギン』としての力を発揮します。",
      debug_pattern:
        "刹那的な喜びに溺れ、将来のことを考えない無責任な行動に走る。感情の起伏が激しく、人間関係で常にトラブルを起こしてしまう。",
      debug_method:
        "関係性の「始まり（雷の衝動）」だけでなく、「終わり（結末）」を想像してみること。今の行動が、1年後にどのような結果をもたらすかを冷静に考える視点が、暴走にブレーキをかけます。",
      quests: [
        "何かを「欲しい」「したい」と感じた時、24時間待ってから、まだ同じ気持ちかを確認するルールを作る。",
        "自分が本当に望んでいる長期的な関係性（仕事、パートナーシップなど）の理想像を具体的に書き出してみる。",
      ],
    },
    55: {
      name: "雷火豊",
      summary:
        "花火のように、華やかで豊かなエネルギーで、物事を成功の頂点へと導くOS。自信にあふれ、人を惹きつけるが、その繁栄は永続しないことを忘れがち。",
      strategic_roles: [
        "ヒットメーカー",
        "絶頂期の経営者",
        "カリスマ的なパフォーマー",
        "盛大なイベントの主催者",
      ],
      defensive_use:
        "成功の絶頂で有頂天になり、永遠にこの状態が続くと錯覚してしまう『栄光への慢心』。その輝きに目がくらみ、やがて来る衰退の兆候から目を背け、備えを怠ります。",
      proactive_use:
        "その『豊かさを創出する』力を、一過性の『花火』で終わらせず、持続的な『祭り』へと転換します。成功の要因を冷静に分析し、その光（火）とエネルギー（雷）を次の世代やプロジェクトに分配することで、あなたは『文化の創造主』として記憶されます。",
      debug_pattern:
        "成功の絶頂で有頂天になり、慢心する。自分の力を過信し、派手な振る舞いを続け、やがて来る衰退の兆候から目を背ける。",
      debug_method:
        "「豊かさ（豊）」の真っ只中で、あえて「日没（離の陰り）」を意識すること。パーティーの後片付けをするように、成功の後の処理や、次の展開への準備を怠らないことが重要。",
      quests: [
        "プロジェクトが成功した時、祝杯をあげるだけでなく、「今回の成功の要因と、次の課題」をチームで話し合う。",
        "自分の成功を支えてくれた人たちに、改めて感謝の気持ちを伝える。",
      ],
    },
    56: {
      name: "火山旅",
      summary:
        "一つの場所に留まらず、常にアウェイな環境で自分を試す旅人のOS。適応力が高く、謙虚だが、心から安らげる居場所がなく、孤独を感じやすい。",
      strategic_roles: [
        "海外特派員・駐在員",
        "フリーランスの専門家",
        "孤独を愛する旅人",
        "環境適応のプロ",
      ],
      defensive_use:
        "どこにいても『所詮ここは仮の宿』と心を閉ざし、深く人と関わろうとしない『永遠の異邦人』。孤独感が強まり、皮肉屋になったり、突然全てを捨てて去ったりすることで、安住の地を得られません。",
      proactive_use:
        "その『アウェイで戦う』能力を、未知の環境や新しい市場を開拓する『先遣隊』として活用します。特定の組織や場所に固執しない身軽さと、謙虚に状況を学ぶ姿勢が、誰よりも早く新しい環境に適応し、成果を上げる力になります。",
      debug_pattern:
        "どこにいても「所詮ここは仮の宿」と心を閉ざし、深く人と関わろうとしない。人間関係が表面的になり、真の信頼関係を築けず、結果的に孤立する。",
      debug_method:
        "旅（旅）の途中で、意識的に「根を下ろす」体験をすること。行きつけのカフェを作る、地域の活動に参加するなど、一時的でも「ホーム」と呼べる場所を持つことが、孤独感を和らげます。",
      quests: [
        "今住んでいる場所や、職場の好きなところを3つ見つけて、誰かに話してみる。",
        "旅先や出張先で、現地の人が集まる食堂や市場に行ってみる。",
      ],
    },
    57: {
      name: "巽為風",
      summary:
        "風のように、しなやかに、隅々まで浸透していくことができるOS。謙虚で社交的だが、自分の意見がなく、周囲に流されやすいという弱点がある。",
      strategic_roles: [
        "優れたネゴシエーター",
        "人心を掴むマーケター",
        "柔軟な調整役",
        "カウンセラー",
      ],
      defensive_use:
        "八方美人になり、誰に対しても良い顔をしようとして、結局誰の信頼も得られない『優柔不断スパイラル』。決断を迫られると、風のように姿を消したり、他人の意見に丸乗りしたりします。",
      proactive_use:
        "その『浸透する』力を、人の心を動かし、物事を円滑に進めるための『潤滑油』として戦略的に活用します。強引な命令ではなく、丁寧なコミュニケーションと共感によって、気づかれないうちに相手の意思決定に影響を与える『インフルエンサー』として機能します。",
      debug_pattern:
        "自分の意見がなく、周囲に流されやすい。決断を迫られると、姿を消したり、他人の意見に丸乗りしたりする。",
      debug_method:
        "風（巽）としての自分の「使命」を明確にすること。「何を伝えるために」「どこに浸透したいのか」という軸を持つことで、ただ流されるだけの存在から脱却できます。",
      quests: [
        "会議で人の意見に賛成する時、「なぜなら〜」と、自分の言葉で理由を付け加える。",
        "自分が「これだけは譲れない」と思う価値観を一つだけ決め、それに関連する行動を取る。",
      ],
    },
    58: {
      name: "兌為沢",
      summary:
        "喜びや楽しみを通じて、人々と和やかに交流するOS。愛嬌があり、コミュニケーション能力に長けるが、時に快楽に溺れ、軽薄になることがある。",
      strategic_roles: [
        "ムードメーカー",
        "エンターテイナー",
        "優れたプレゼンター",
        "喜びを分かち合うコミュニティリーダー",
      ],
      defensive_use:
        "表面的な楽しさばかりを追い求め、深みのある人間関係や、地道な努力を避けてしまう『快楽主義の罠』。口先だけで行動が伴わず、軽薄な人間だという信頼を失います。",
      proactive_use:
        "その『喜ばせる』能力を、チームの士気を高め、円滑なコミュニケーションを促進する『エンゲージメント向上エンジン』として活用します。あなたの明るさとユーモアが、組織の風通しを良くし、創造的なアイデアが生まれやすい環境を創り出します。",
      debug_pattern:
        "表面的な楽しさばかりを追い求め、深みのある人間関係や、地道な努力を避けるようになる。口先だけで、行動が伴わず、信頼を失う。",
      debug_method:
        "「喜び（兌）」の源泉を、外部の刺激から、自分の内側に見出すこと。誰かと一緒でなくても、一人で静かに感じられる喜びや満足感を探すことが、精神的な成長に繋がります。",
      quests: [
        "一日、誰とも話さずに、自分が「楽しい」「心地よい」と感じることをして過ごしてみる。",
        "会話の中で、相手を笑わせることだけでなく、「相手の話を深く聞く」ことに集中してみる。",
      ],
    },
    59: {
      name: "風水渙",
      summary:
        "淀んだ状況や、凝り固まった人間関係を、風のように吹き散らし、解消するOS。大局的な視点を持ち、私心がありませんが、時に無責任だと見られることがある。",
      strategic_roles: [
        "組織改革のコンサルタント",
        "対立の仲裁者",
        "しがらみを断つファシリテーター",
        "リブランディングの専門家",
      ],
      defensive_use:
        "問題を解決するのではなく、ただ『無かったこと』にしてしまう『問題先送りモード』。面倒な人間関係や組織から、何の責任も取らずに離脱しようとし、根本的な解決から逃げ続けます。",
      proactive_use:
        "その『霧散させる』力を、硬直化した組織や、膠着した人間関係の『しがらみ』を解消するための『リセットボタン』として戦略的に使用します。一度すべてをリセットし、まっさらな状態から新しい秩序を再構築する『アーキテクト』の役割を果たします。",
      debug_pattern:
        "問題を解決するのではなく、ただ「無かったこと」にしてしまう。面倒な人間関係や組織から、何の責任も取らずに離脱しようとする。",
      debug_method:
        "「散らす（渙）」だけでなく、散らした後に「集める」ことまで責任を持つこと。問題をリセットした後、どのような新しい秩序を創るのかというビジョンを示すことが重要。",
      quests: [
        "何かを「やめる」と決断した時、関係者に対して、その理由と今後の代替案を誠実に説明する。",
        "バラバラになったチームや組織を、もう一度まとめるための共通の目標を提案してみる。",
      ],
    },
    60: {
      name: "水沢節",
      summary:
        "物事に適切な「けじめ」をつけ、自己管理ができる節度のOS。真面目で信頼できるが、その規律が厳しすぎて、自分や他人を追い詰めることがある。",
      strategic_roles: [
        "優れた予算管理者",
        "ルールブックの作成者",
        "自己管理の達人（タイムマネジメント等）",
        "リスクマネージャー",
      ],
      defensive_use:
        "あらゆることをルールで縛り付け、少しでも逸脱することを許さない『完璧主義の看守』。柔軟性を完全に失い、融通の利かない堅物だと思われ、自分も他人も息苦しくさせてしまいます。",
      proactive_use:
        "その『制限する』能力を、限りあるリソース（時間、金、集中力）を最大化するための『リソース配分最適化システム』へと転換します。無駄を省き、守るべき一線（節度）を引くことで、プロジェクトを破綻から守る『賢明な管理者』として機能します。",
      debug_pattern:
        "あらゆることをルールで縛り付け、少しでも逸脱することを許せなくなる。柔軟性を失い、融通の利かない堅物だと思われ、人から敬遠される。",
      debug_method:
        "「節度」とは、単なる禁止ではなく、「楽しむためのルール」であると捉え直すこと。決められた範囲の中で、いかに創造性を発揮できるか、というゲーム感覚が、窮屈さから解放します。",
      quests: [
        "自分が決めているルールを一つ、今週だけあえて破ってみて、何が起こるか観察する。",
        "「〜してはいけない」ではなく、「〜する時は、〜しても良い」という許可のルールを作ってみる。",
      ],
    },
    61: {
      name: "風沢中孚",
      summary:
        "真心と誠実さで、他者と深い信頼関係を築くことができるOS。裏表がなく、純粋だが、その誠実さが、時に人を信じすぎる危うさにも繋がる。",
      strategic_roles: [
        "誠実なリーダー",
        "信頼を基盤とする交渉人",
        "ブランドエバンジェリスト",
        "心の通うカウンセラー",
      ],
      defensive_use:
        "『自分は誠実なのだから、相手もそうあるべきだ』と、他者にも同じレベルの誠実さを強要する『誠実さの押し売り』。理想が高すぎるあまり、現実の人間関係に失望し、裏切られると極端な人間不信に陥ります。",
      proactive_use:
        "その『真心』を、テクニックを超えた究極のコミュニケーションツール、『信頼のOS』として機能させます。あなたの偽りのない言葉と行動が、人々の心を動かし、強固な信頼関係を築くことで、どんな困難な状況でも協力を引き出すことができます。",
      debug_pattern:
        "「自分は誠実なのだから、相手もそうあるべきだ」と、他者にも同じレベルの誠実さを強要する。騙されたり、裏切られたりすると、極端な人間不信に陥る。",
      debug_method:
        "「真心（孚）」と「現実」の間に、健全な境界線を引くこと。相手を信じることと、客観的な事実を確認することは両立すると理解することが、あなたを守ります。",
      quests: [
        "誰かを信じて何かを任せる時、同時に「もしうまくいかなかった場合のプランB」も考えておく。",
        "相手の言葉だけでなく、「行動」が伴っているかどうかを冷静に観察する癖をつける。",
      ],
    },
    62: {
      name: "雷山小過",
      summary:
        "大きな目標よりも、目の前の小さなことを、少しだけ度を過ごすくらい丁寧にこなすOS。慎重で謙虚だが、大胆な行動が苦手。",
      strategic_roles: [
        "細やかな配慮ができる秘書",
        "品質管理のスペシャリスト",
        "謙虚なナンバー２",
        "儀礼・式典の専門家",
      ],
      defensive_use:
        "失敗を恐れるあまり、石橋を叩きすぎて壊してしまう『過剰配慮モード』。本来の目的よりも、些細なミスをしないこと自体が目的化し、大胆な行動が全く取れなくなります。",
      proactive_use:
        "その『少しだけ度を過ごす』丁寧さを、絶対に失敗が許されない『クリティカルな局面での実行機能』として活用します。細部への徹底的なこだわりと配慮が、プロジェクトの成否を分ける場面で、あなたの真価を発揮させます。",
      debug_pattern:
        "失敗を恐れるあまり、石橋を叩きすぎて壊してしまう。本来の目的よりも、些細なミスをしないこと自体が目的化し、大胆な行動が全く取れなくなる。",
      debug_method:
        "「少しだけ過ぎる（小過）」エネルギーを、ポジティブな方向に使うこと。他者への配慮ではなく、自分へのご褒美や、仕事のクオリティを「少しだけ」上げる方向で、その丁寧さを発揮します。",
      quests: [
        "資料作成などで、「もうこれで十分」と思った後、さらに5分だけ時間を使って、より良くするための改善を一つ加える。",
        "あえて「70点の完成度で、一度提出（共有）してみる」という挑戦をする。",
      ],
    },
    63: {
      name: "水火既済",
      summary:
        "物事を完璧な形で完成させ、秩序と安定を維持することができるOS。しかし、完成した状態に固執し、次の変化に対応するのが遅れるという弱点を持つ。",
      strategic_roles: [
        "保守・運用管理者",
        "品質保証（QA）の責任者",
        "完成されたシステムの番人",
        "安定期のマネージャー",
      ],
      defensive_use:
        "『せっかく完成したのに』と、あらゆる変化や改善提案を拒絶する『完成形への固執』。過去の成功体験に縛られ、新しい時代の流れに対応できず、システムは静かに陳腐化していきます。",
      proactive_use:
        "その『完成させる』能力を、次の変化に備えるための『継続的改善（カイゼン）プロセス』へと転換します。『完成』をゴールではなく、新たなスタートラインと捉え、常に潜在的なリスクや改善点を探し続けることで、持続的な安定を築く『守護者』となります。",
      debug_pattern:
        "「せっかく完成したのに」と、あらゆる変化を拒絶する。過去の成功体験に縛られ、新しいやり方や価値観を受け入れられなくなる。",
      debug_method:
        "「完成（既済）」は「終わり」ではなく、「次の未済（みせい）の始まり」であると認識すること。安定を維持しつつも、常に次の改善点やリスクを探す視点が、あなたを時代の変化から取り残されるのを防ぎます。",
      quests: [
        "完成したプロジェクトや製品について、あえて「改善できる点」を3つ書き出してみる。",
        "自分の専門分野について、最新の動向や新しいツールを調べる時間を、週に30分設ける。",
      ],
    },
    64: {
      name: "火水未済",
      summary:
        "物事がまだ完成していない、混乱と可能性が入り混じったOS。慎重に状況を見極め、困難を乗り越えることで、大きな成功を掴むポテンシャルを秘めている。",
      strategic_roles: [
        "R&D部門のリーダー",
        "新規事業の開拓者",
        "混乱を乗りこなすチャレンジャー",
        "可能性の探求者",
      ],
      defensive_use:
        "混乱した状況に耐えきれず、準備不足のまま無謀な挑戦に出て、失敗を繰り返す『見切り発車シンドローム』。あるいは、『まだ完成しない』と言い訳をし、永遠に物事を先延ばしにします。",
      proactive_use:
        "その『未完成』な状況を、無限の可能性が眠る『実験場』として活用します。失敗を恐れず、様々な試行錯誤（プロトタイピング）を繰り返す中で、誰も想像しなかった革新的な解決策や、次世代のスタンダードを生み出す『発明家』として機能します。",
      debug_pattern:
        "混乱した状況に耐えきれず、準備不足のまま無謀な挑戦に出て、失敗する。あるいは、「まだ完成しない」と言い訳をし、永遠に物事を先延ばしにする。",
      debug_method:
        "「未済（未完成）」の状態そのものを楽しむこと。ゴールに到達することだけが目的ではなく、試行錯誤のプロセス自体が学びであり、価値なのだと捉え直すことが、焦りからあなたを解放します。",
      quests: [
        "うまくいっていないプロジェクトについて、「この失敗から学べることは何か？」を書き出してみる。",
        "完璧なゴールを目指すのではなく、「今できる、次の一歩」だけを考えて実行してみる。",
      ],
    },
  },
  TRIGRAM_INTERACTIONS: {
    // 1:乾(天), 2:兌(沢), 3:離(火), 4:震(雷), 5:巽(風), 6:坎(水), 7:艮(山), 8:坤(地)
    1: {
      // 乾（天）がベースの場合
      1: {
        synergy:
          "理想と行動力が完全に一致し、圧倒的な推進力を生む。プロジェクトや組織をゼロから立ち上げる、最強の創業者となる。",
        conflict:
          "他者の意見を全く聞かなくなる『裸の王様』状態に陥る危険がある。その強すぎるエネルギーは、時に独裁的な暴走となり、孤立を招く。",
      },
      2: {
        synergy:
          "高い理想（天）を、喜びに満ちた言葉（沢）で語り、人々を魅了するカリスマ性を発揮する。",
        conflict:
          "理想論や楽しい会話だけで満足してしまい、地道な実行（行動）が伴わない『口先だけ』だと思われることがある。",
      },
      3: {
        synergy:
          "理想（天）と知性（火）が結びつき、明確なビジョンと、それを実現するためのシャープな戦略を生み出す。",
        conflict:
          "互いのプライド（天・火）がぶつかり合い、どちらが正しいかで理論闘争に陥る。時に現実離れした完璧主義に陥る。",
      },
      4: {
        synergy:
          "理想（天）を行動（雷）に移す、圧倒的な突破力が生まれる。停滞した状況を打ち破る、最高の切り込み隊長となる。",
        conflict:
          "計画性を欠いたまま、勢いだけで突っ走ってしまう。その無謀な行動は、大きな失敗や混乱を招く危険性をはらむ。",
      },
      5: {
        synergy:
          "高い理想（天）を、風のようにしなやかなコミュニケーション（巽）で組織の隅々まで浸透させることができる。",
        conflict:
          "理想の実現を急ぐあまり、相手の柔軟な姿勢を『優柔不断』だと感じ、苛立ってしまうことがある。",
      },
      6: {
        synergy:
          "困難な状況（水）においても、決して理想（天）を失わず、粘り強く本質を探求し続ける精神的な強さを発揮する。",
        conflict:
          "高い理想と厳しい現実のギャップに深く悩み、精神的な泥沼（水）にはまり込み、行動不能に陥ることがある。",
      },
      7: {
        synergy:
          "高い理想（天）を、山のように動じない精神力で支え、長期的な視点で、揺るぎない信念として確立する。",
        conflict:
          "理想に固執するあまり、変化を拒絶する頑固な『山』となり、時代の流れから取り残されることがある。",
      },
      8: {
        synergy:
          "理想（天）と現実（地）の間に、見事なバランスが生まれる。描いたビジョンを着実に形にする、最高の実行力を発揮する。",
        conflict:
          "理想の追求が、現実的な制約や周囲のペース（地）によって鈍化し、大きなフラストレーションを溜め込む。",
      },
    },
    2: {
      // 兌（沢）がベースの場合
      1: {
        synergy:
          "楽しい交流（沢）の中から、人々の心を一つにする高い理想（天）や目標が生まれる、最高のチームビルディング。",
        conflict:
          "楽しさを優先するあまり、リーダーが求める厳しさやストイックさについていけず、関係が長続きしないことがある。",
      },
      2: {
        synergy:
          "喜びと楽しさに満ちた、極めて良好で円滑なコミュニケーションを生み出す。最高のムードメーカーとなる。",
        conflict:
          "常に楽しい会話や刺激を求め、本質的な議論や地道な作業から逃避してしまう。表面的な関係に終始しやすい。",
      },
      3: {
        synergy:
          "知的なユーモア（火）と、人を楽しませる会話力（沢）が組み合わさり、場の雰囲気を華やかに盛り上げる。",
        conflict:
          "互いのプライドがぶつかり、会話が自慢話や皮肉の応酬になりがち。相手を言い負かすことに快感を覚えてしまう。",
      },
      4: {
        synergy:
          "楽しい場の勢い（沢）を、具体的な行動（雷）へと繋げる。イベントや企画の優れた発起人となる。",
        conflict:
          "その場のノリと勢いだけで行動し、後先を考えない。無責任な行動が、後で大きな問題を引き起こすことがある。",
      },
      5: {
        synergy:
          "相手の心に寄り添う共感力（巽）と、場を和ませる会話力（沢）が合わさり、誰とでも円滑な関係を築ける。",
        conflict:
          "互いに気を遣いすぎて、本音を言えないまま物事が進展しない。NOと言えないことで、問題を先送りにしてしまう。",
      },
      6: {
        synergy:
          "困難で重い雰囲気（水）の中でも、持ち前の明るさ（沢）とユーモアで、場の空気を和ませ、前向きな雰囲気を作る。",
        conflict:
          "問題の深刻さから目をそらし、楽観視しすぎる。根本的な解決を避け、その場しのぎの楽しさでごまかそうとする。",
      },
      7: {
        synergy:
          "動じない相手（山）との間に、適切な距離感を保ちつつ、節度ある楽しい関係を築くことができる。",
        conflict:
          "相手の思慮深さや静かな態度を『ノリが悪い』『面白くない』と感じ、一方的にコミュニケーションを諦めてしまう。",
      },
      8: {
        synergy:
          "大地のような安心感のある場（坤）で、人々が心から楽しめる（沢）最高のコミュニティを育む。",
        conflict:
          "受容的な相手に対し、一方的に自分の話ばかりをしてしまう。相手のエネルギーを無意識に奪っていることがある。",
      },
    },
    3: {
      // 離（火）がベースの場合
      1: {
        synergy:
          "知的な分析力（火）が、リーダーのビジョン（天）を補強し、より現実的で実行可能な戦略へと昇華させる。",
        conflict:
          "リーダーの掲げる抽象的な理想（天）を、自らの知性（火）で論破・分析しすぎ、行動のブレーキとなってしまう。",
      },
      2: {
        synergy:
          "知的な会話（火）の中に、華やかさと喜び（沢）が生まれ、人々を惹きつける、非常に魅力的なコミュニケーション能力を発揮する。",
        conflict:
          "会話が表面的な装飾や見栄の張り合いになり、中身が伴わない。互いの知性を、相手を楽しませるためだけに使ってしまう。",
      },
      3: {
        synergy:
          "互いの知性（火）を尊重し、高度で刺激的な知的探求が行われる。最高の知的なパートナーとなる。",
        conflict:
          "互いのプライド（火）がぶつかり、自分の見識を誇示し合うだけの不毛な議論になる。相手の欠点を指摘し合う。",
      },
      4: {
        synergy:
          "知的な分析（火）に基づいた、迅速で効果的なアクションプラン（雷）が生まれる。戦略と実行が見事に噛み合う。",
        conflict:
          "行動（雷）の前に分析（火）しすぎ、スピード感を失う。あるいは分析を省略し、情熱（火）と衝動（雷）だけで動いて失敗する。",
      },
      5: {
        synergy:
          "知的な戦略（火）を、風のようにしなやかなコミュニケーション（巽）で、組織の隅々まで丁寧に浸透させることができる。",
        conflict:
          "論理の正しさ（火）を優先するあまり、人の感情に寄り添う（巽）コミュニケーションを軽視し、反発を招く。",
      },
      6: {
        synergy:
          "困難で複雑な問題（水）の構造を、知性の光（火）で照らし、その本質を解き明かす、優れた問題解決能力を発揮する。",
        conflict:
          "問題の深刻さや、他者の悩み（水）に直面し、情熱の炎（火）が消え、無気力に陥ることがある。",
      },
      7: {
        synergy:
          "物事の本質を、動じない精神力（山）で深く見つめ（火）、長期的な視点から真理を探究する、賢者のような洞察力を得る。",
        conflict:
          "内省（山）に時間をかけすぎ、せっかくの知的なひらめき（火）を行動や表現に移す機会を逃してしまう。",
      },
      8: {
        synergy:
          "現実的な土台（坤）に基づいた、地に足のついた知的な分析（火）が可能になる。机上の空論ではない、実用的な戦略を立てられる。",
        conflict:
          "現実的な制約（坤）に縛られ、知性が本来持つ、自由な発想や情熱（火）を失ってしまう。",
      },
    },
    4: {
      // 震（雷）がベースの場合
      1: {
        synergy:
          "リーダーの掲げた理想（天）を、誰よりも早く実行（雷）に移す、最高の切り込み隊長になる。",
        conflict:
          "理想を深く理解する前に、衝動的に行動（雷）し、リーダーの意図とずれてしまう、ただの暴れん坊になる危険性。",
      },
      2: {
        synergy:
          "行動（雷）することで、場に喜びと活気（沢）をもたらす、最高のムードメーカーになる。",
        conflict:
          "楽しい勢い（沢）だけで行動（雷）し、他者への配慮を欠いた、自己中心的な振る舞いになる。",
      },
      3: {
        synergy:
          "情熱的なアイデア（火）を、すぐさま形にする行動力（雷）が生まれる。スピード感のあるプロジェクト推進力。",
        conflict:
          "知的な分析（火）を省略し、衝動的な行動（雷）だけで突っ走り、大きな失敗を招きやすい。",
      },
      4: {
        synergy:
          "行動と行動が重なり、圧倒的な推進力とスピード感を生み出す。誰も止められない、変革の原動力となる。",
        conflict:
          "計画性が皆無になり、周囲を巻き込む大混乱を引き起こす。エネルギーの無駄遣いに終わりやすい。",
      },
      5: {
        synergy:
          "行動（雷）の前に、一度立ち止まって周囲の状況をよく見る（巽）、バランスの取れた動きが可能になる。",
        conflict:
          "行動の勢いが、相手の慎重さ（巽）によって削がれ、フラストレーションを感じる。前に進めないもどかしさ。",
      },
      6: {
        synergy:
          "困難な状況（水）を、持ち前のエネルギー（雷）で強引に突破する力が生まれる。",
        conflict:
          "危険（水）を顧みずに行動（雷）し、無謀な挑戦で自滅する危険性がある。",
      },
      7: {
        synergy:
          "行動（雷）の前に、一度立ち止まって熟考する（山）、思慮深い動きが可能になる。猪突猛進を防ぐ。",
        conflict:
          "行動の勢いが、相手の静止力（山）によって完全に止められ、動けなくなる。葛藤の末にエネルギーを消耗する。",
      },
      8: {
        synergy:
          "大地のような安定した基盤（坤）の上で、安心して行動力（雷）を発揮できる。現実的な行動計画が立てられる。",
        conflict:
          "行動のエネルギーが、相手の受容性（坤）に全て吸収され、空回りしてしまう。手応えのなさに虚しさを感じる。",
      },
    },
    5: {
      // 巽（風）がベースの場合
      1: {
        synergy:
          "リーダーの理想や方針（天）を、組織の隅々まで浸透（巽）させる、優れた調整役になる。",
        conflict:
          "リーダーの力が強すぎると、自分の意見を言えず、ただの御用聞きになってしまう。主体性を失う。",
      },
      2: {
        synergy:
          "相手の気持ちを汲み取りながら（巽）、円滑で楽しい（沢）コミュニケーションを築く、最高の聞き上手となる。",
        conflict:
          "互いに本音を言えず、表面的な会話に終始し、物事が決まらない。楽しかったが、何も進まなかったという結果に。",
      },
      3: {
        synergy:
          "相手の感情に配慮（巽）しつつ、知的な内容（火）を分かりやすく伝えることができる、優れた教育者やプレゼンターになる。",
        conflict:
          "論理的な正しさ（火）よりも、その場の空気を優先（巽）し、本質的な議論や言うべきことを避けてしまう。",
      },
      4: {
        synergy:
          "相手の意図を汲み取り（巽）、行動（雷）を先回りしてサポートする、優れた補佐役になる。",
        conflict:
          "相手の行動の勢い（雷）に巻き込まれ、自分のペースを失ってしまう。相手に振り回され、疲弊する。",
      },
      5: {
        synergy:
          "互いの意図を察し合い、言葉にしなくても分かり合える、円熟した関係を築く。最高のチームワークを発揮する。",
        conflict:
          "互いに遠慮しすぎ、何も決断できないまま、時間だけが過ぎていく。誰も責任を取りたがらない。",
      },
      6: {
        synergy:
          "困難な状況にある相手の心（水）に、そっと寄り添い（巽）、精神的な支えとなる、優れたカウンセラーになる。",
        conflict:
          "相手のネガティブな感情（水）に引きずられ、自分まで思考停止に陥る。共感しすぎて、客観的な判断ができなくなる。",
      },
      7: {
        synergy:
          "相手との適切な距離感を保ちながら（山）、穏やかで安定した（巽）関係を築くことができる。",
        conflict:
          "相手の不動の態度（山）に、これ以上踏み込めないと感じ、深い関係を諦めてしまう。関係が進展しない。",
      },
      8: {
        synergy:
          "相手の受容的な姿勢（坤）に安心して、心を開いて（巽）コミュニケーションが取れる。何を言っても受け入れてもらえる安心感。",
        conflict:
          "相手が何も言ってくれないため、本当に理解してくれているか不安になる。自分の意見が空中に消えるような虚しさ。",
      },
    },
    6: {
      // 坎（水）がベースの場合
      1: {
        synergy:
          "リーダーの理想（天）の裏にある、潜在的なリスクや困難（水）を見つけ出し、警告する、優れた参謀役となる。",
        conflict:
          "ネガティブな側面ばかりを指摘し、リーダーのやる気や、チーム全体の士気を削いでしまう。",
      },
      2: {
        synergy:
          "困難な状況（水）でも、持ち前のユーモアや喜び（沢）を忘れず、精神的な強さを保つことができる。",
        conflict:
          "不謹慎だと誤解されたり、問題の深刻さから目をそらしているだけだと見なされたりする。",
      },
      3: {
        synergy:
          "困難で複雑な問題（水）の構造を、知性の光（火）で照らし、その本質を解き明かす、優れた問題解決能力を発揮する。",
        conflict:
          "分析に没頭するあまり、現実的な行動を起こすエネルギーを失ってしまう。評論家で終わる危険性。",
      },
      4: {
        synergy:
          "困難な状況（水）を打開するための、具体的な一歩を力強く踏み出す（雷）ことができる。",
        conflict:
          "困難の大きさ（水）に、行動する前から圧倒され、無力感に陥る。どうせ無理だと諦めてしまう。",
      },
      5: {
        synergy:
          "困難な状況にある他者の心（水）に、そっと寄り添い（巽）、粘り強く解決策を探る、優れたカウンセラーや交渉人となる。",
        conflict:
          "優柔不断な態度（巽）が、困難な状況（水）をさらに悪化させてしまうことがある。決断を先延ばしにする。",
      },
      6: {
        synergy:
          "困難と苦労を共有し、乗り越えることで、誰にも壊せない強固な信頼関係を築く。戦友のような絆。",
        conflict:
          "互いに傷を舐め合い、ネガティブな感情のループから抜け出せなくなる。共依存に陥る危険性。",
      },
      7: {
        synergy:
          "困難な状況（水）でも、山のように動じずに本質を見極め、解決の時を待つことができる、賢者のような忍耐力。",
        conflict:
          "ただ問題を静観するだけで、何も行動を起こさない『傍観者』になる。内省が自己満足で終わってしまう。",
      },
      8: {
        synergy:
          "困難な状況（水）を、周囲のサポート（坤）を得ながら、着実に乗り越えていくことができる。",
        conflict:
          "他者に依存し、自ら困難に立ち向かう精神力を失ってしまう。助けてもらうことが当たり前になる。",
      },
    },
    7: {
      // 艮（山）がベースの場合
      1: {
        synergy:
          "リーダーの暴走（天）を、冷静な判断（山）で押しとどめ、大きな失敗を防ぐ、優れたブレーキ役となる。",
        conflict:
          "リーダーの決断を全て否定し、プロジェクトを停滞させる『抵抗勢力』になる。変化を極端に嫌う。",
      },
      2: {
        synergy:
          "楽しい会話（沢）の中に、適切なブレーキ（山）をかけることで、軽薄になるのを防ぎ、品位を保つ。",
        conflict:
          "場の空気を『止めてしまう』存在として、敬遠されることがある。楽しむことに罪悪感を抱きがち。",
      },
      3: {
        synergy:
          "知的な探求（火）に、動じない精神的な土台（山）を与え、一過性ではない、深い思索を可能にする。",
        conflict:
          "理論（火）ばかりで、行動（山が止める）を伴わない『頭でっかち』な評論家になる。",
      },
      4: {
        synergy:
          "衝動的な行動（雷）を、一旦『停止（山）』させ、冷静に考え直す機会を与える。暴走を防ぐ安全装置。",
        conflict:
          "相手の行動力を完全に削いでしまい、何も生み出せない状況を作る。石橋を叩いて壊す。",
      },
      5: {
        synergy:
          "柔軟なコミュニケーション（巽）と、動じない信念（山）の、バランスの取れた、信頼される関係を築く。",
        conflict:
          "相手の優柔不断さ（巽）に、沈黙（山）で応じ、関係が自然消滅する。歩み寄りをしない。",
      },
      6: {
        synergy:
          "困難な状況（水）でも、山のように動じずに耐え、精神的な安定を保つことができる。最高の忍耐力。",
        conflict:
          "ただ耐えるだけで、問題解決のための具体的な行動を起こさない。困難に慣れすぎてしまう。",
      },
      7: {
        synergy:
          "互いに干渉せず、静かで穏やかな、独立した関係を築く。精神的な安定と自己完結。",
        conflict:
          "コミュニケーションが完全に停止し、互いに何を考えているか分からなくなる。孤立を深める。",
      },
      8: {
        synergy:
          "相手の受容的な姿勢（坤）に、安心して自分のペース（山）でじっくりと物事を進めることができる。",
        conflict:
          "相手の優しさに甘え、本来自分がやるべきことまで、相手に委ねてしまう。極端なスローペースになる。",
      },
    },
    8: {
      // 坤（地）がベースの場合
      1: {
        synergy:
          "リーダーのビジョン（天）を、現実的な形で完璧にサポート（坤）し、具現化する、最高のNo.2となる。",
        conflict:
          "リーダーの力が強すぎると、完全に言いなりになってしまう『イエスマン』になる。自分の意見を失う。",
      },
      2: {
        synergy:
          "安心できる場の提供（坤）と、楽しいコミュニケーション（沢）が組み合わさり、最高のコミュニティが生まれる。",
        conflict:
          "馴れ合いの関係になり、目的意識のない、ただの仲良しグループで終わる。規律が緩みすぎる。",
      },
      3: {
        synergy:
          "知的なアイデア（火）を、現実的な視点（坤）で評価し、地に足のついた計画にする。アイデアを実現可能な形にする力。",
        conflict:
          "相手の情熱や斬新なアイデアを、現実論で否定し、やる気を削いでしまう。『できない理由』を探しがち。",
      },
      4: {
        synergy:
          "行動的なアイデア（雷）を、着実な実行力（坤）で支え、形にする。情熱と実行力の理想的な組み合わせ。",
        conflict:
          "相手のスピード感（雷）についていけず、行動のブレーキになってしまう。変化を恐れてしまう。",
      },
      5: {
        synergy:
          "柔軟なサポート（巽）と、受容的な姿勢（坤）が組み合わさり、相手が安心して能力を発揮できる最高の環境を提供する。",
        conflict:
          "互いに遠慮し、受け身になることで、物事が全く前に進まない。決断が先延ばしにされる。",
      },
      6: {
        synergy:
          "困難な状況にある相手（水）を、母のような優しさ（坤）で受け止め、精神的な安全基地となる。",
        conflict:
          "相手の苦しみを全て受け止め、自分まで共倒れになってしまう。境界線が引けなくなる。",
      },
      7: {
        synergy:
          "互いに干渉しすぎず、安定した（山）、落ち着いた（坤）関係を築く。安心感の塊。",
        conflict:
          "変化のない、退屈な関係に陥りやすい。刺激や成長が少なくなる。",
      },
      8: {
        synergy:
          "現実的で、安定した基盤（坤）を築き、物事を着実（坤）に育む。最高の安定性と持続力。",
        conflict:
          "変化を極端に嫌い、新しい物事への対応が全くできなくなる。現状維持が絶対目的になる。",
      },
    },
  },

  action_plans: {
    1: {
      2: "あなたの対話力（沢）を使い、会議でファシリテーター役を務め、多様な意見を引き出しまとめてみましょう。「場を支配する」のではなく「場を喜ばせる」リーダーシップが、あなたらしい天の力の使い方です。",
      3: "あなたの情熱（火）をビジョンに変え、チームやプロジェクトが目指すべき未来を熱く語ってみましょう。論理だけでなく、感情に訴えかけることが人々を動かす原動力になります。",
      4: "あなたの行動力（雷）を「まず自分が動く」という形で発揮してみましょう。他者を動かす前に、自らが率先して動く背中を見せることが、最もシンプルで強力なリーダーシップです。",
      5: "あなたの浸透力（風）を使い、組織のビジョンや目標を、丁寧な対話を通じて隅々まで浸透させましょう。トップダウンの命令ではなく、共感を広げることがあなたらしいやり方です。",
      6: "あなたの探求心（水）を活かし、困難なプロジェクトの「真の問題」を特定し、解決策を提示してみましょう。複雑な状況を乗りこなす知性が、あなたのリーダーシップの源泉となります。",
      7: "あなたの洞察力（山）を使い、チームの未来像（ビジョン）を静かに考え、言語化して提示してみましょう。動的なリーダーシップだけでなく、静的な思慮深さもまた、人を導く大きな力です。",
      8: "あなたの受容力（坤）を活かし、メンバー一人ひとりの意見や能力を受け止め、それを活かす「場」を作ることに専念しましょう。サーバント・リーダーシップがあなたの才能を輝かせます。",
    },
    2: {
      1: "あなたのリーダーシップ（天）を使い、チームの成功を祝う「場」を企画してみましょう。ただ楽しむだけでなく、皆の功績を称え、喜びを分かち合う文化を創り出すことが、あなたらしい対話力の使い方です。",
      3: "あなたの知性（火）を使い、複雑な問題を分かりやすく解説するプレゼンテーションや勉強会を開いてみましょう。知的な喜びを分かち合うことが、質の高いコミュニケーションを生み出します。",
      4: "あなたの行動力（雷）を使い、停滞している会議や人間関係に、あえてユーモアや遊び心のある発言を投げかけてみましょう。場を動かす「起爆剤」としての対話力を発揮できます。",
      5: "あなたの共感力（風）を使い、1対1の対話の時間を設け、相手の話を深く聞いてみましょう。情報を伝えるだけでなく、相手の心に寄り添うコミュニケーションが、あなたの武器になります。",
      6: "あなたの探求心（水）を使い、対立する意見の裏にある、両者の「本音」や「恐れ」を探ってみましょう。表面的な言葉ではなく、深層心理を読み解く対話が、問題解決の鍵を握ります。",
      7: "あなたの不動の精神（山）を使い、感情的な議論が白熱した際に、冷静に場を収める仲裁役を担ってみましょう。動じない姿勢が、人々に安心感と信頼を与えます。",
      8: "あなたの受容力（坤）を使い、チームの誰よりも聞き上手になることを目指しましょう。ただ聞くだけで、相手は自ら答えを見つけ出し、あなたは最高の支援者として評価されます。",
    },
    3: {
      1: "あなたの創造力（天）を使い、既存の知識を組み合わせ、全く新しい独自の理論やアイデアを構築してみましょう。その知的な成果が、あなたの情熱の新たな源泉となります。",
      2: "あなたの表現力（沢）を使い、自分が情熱を注いでいることを、ブログやSNS、プレゼンで発信してみましょう。人に伝えることで、自分の知識はより体系化され、情熱はさらに燃え上がります。",
      4: "あなたの行動力（雷）を使い、情熱を感じる分野に、まず飛び込んでみましょう。知的な理解は後からで構いません。体験から得る「生きた知性」が、あなたを輝かせます。",
      5: "あなたの共感力（風）を使い、自分が学んだ知識が「誰の役に立つか」を考えてみましょう。他者への貢献を意識することで、あなたの知性は単なる知識から「智慧」へと昇華します。",
      6: "あなたの探求心（水）を使い、一つのテーマをとことん掘り下げてみましょう。表面的な理解で終わらせず、困難な専門書に挑戦するなど、知性の深さを追求することが、揺るぎない自信に繋がります。",
      7: "あなたの探求心（山）を使い、一つの分野の「歴史」や「哲学」を学んでみましょう。知識の背景にある思想や文脈を理解することで、あなたの知性は深みを増し、情熱は静かに燃え続けます。",
      8: "あなたの育成力（坤）を使い、自分が持つ知識や情熱を、後輩や初心者に教え、育ててみましょう。人に教えることは、最も効果的な学習方法の一つです。",
    },
    4: {
      1: "あなたのリーダーシップ（天）を使い、新しいプロジェクトの「キックオフミーティング」を主催してみましょう。ビジョンを示し、人々のエネルギーを一つの方向に向けることで、あなた自身も行動せざるを得ない状況を作り出せます。",
      2: "あなたの表現力（沢）を使い、「やります！」と宣言してみましょう。言葉にすることで、行動へのコミットメントが生まれ、やらざるを得ない良いプレッシャーがかかります。",
      3: "あなたの知性（火）を使い、行動計画を詳細に分析するのではなく、「最初の三歩」だけを具体的に計画してみましょう。完璧な計画よりも、不完全でも素早い一歩が、状況を動かします。",
      5: "あなたの共感力（風）を使い、「誰かと一緒ならできそう」な仲間を探してみましょう。一人で始めるのが億劫でも、誰かとの約束があれば、行動へのハードルはぐっと下がります。",
      6: "あなたの探求心（水）を使い、行動できない原因となっている「心の奥の恐れ」は何かを探ってみましょう。失敗への恐れ、批判への恐れなど、困難の正体を見極めることが、行動への第一歩です。",
      7: "あなたの不動の精神（山）を使い、「動かない」という選択を意識的に行ってみましょう。行動しない自分を責めるのではなく、「今はエネルギーを蓄える時期だ」と決めることで、無駄な焦りから解放され、次の行動へのエネルギーが溜まります。",
      8: "あなたの受容力（坤）を使い、他者のプロジェクトをサポートすることから始めてみましょう。他者の行動を支援する経験を通じて、行動の起こし方やリズムを、安全な形で学ぶことができます。",
    },
    5: {
      1: "あなたのリーダーシップ（天）を使い、ビジョンを語るだけでなく、「なぜそのビジョンが大切なのか」という背景にある想いや物語を語ってみましょう。論理（天）と感情（風）が結びついた時、メッセージは人々の心に深く浸透します。",
      2: "あなたの対話力（沢）を使い、自分の意見を言う時間を半分にして、相手への質問の時間を2倍にしてみましょう。相手を理解しようとする姿勢そのものが、最高の共感力を育みます。",
      3: "あなたの知性（火）を使い、相手の感情や状況を、小説の登場人物を分析するように客観的に観察・描写してみましょう。感情移入しすぎず、冷静に相手を理解する訓練になります。",
      4: "あなたの行動力（雷）を使い、誰かのために、言葉だけでなく、具体的な行動でサポートを示してみましょう。小さな手伝いや差し入れなど、行動で示す共感が、信頼関係を築きます。",
      6: "あなたの探求心（水）を使い、相手がなぜそう感じるのか、その発言の裏にある価値観や経験は何かを、探偵のように探ってみましょう。表面的な言葉の奥にある「本音」に寄り添うことが、真の共感です。",
      7: "あなたの不動の精神（山）を使い、相手が感情的になっている時も、ただ黙って、静かにそばにいてあげましょう。あなたの動じない存在が、相手にとっての安全な「山の避難所」となります。",
      8: "あなたの受容力（坤）を使い、相手の意見を評価・判断せず、ただ「そうなんですね」「そう感じているのですね」とオウム返しで受け止める練習をしましょう。これが共感の第一歩です。",
    },
    6: {
      1: "あなたの創造力（天）を使い、困難な状況を「壮大な物語の序章」と捉え直してみましょう。この困難を乗り越えた先にどんな未来が待っているか、英雄になったつもりでビジョンを描くことで、困難は希望に変わります。",
      2: "あなたの表現力（沢）を使い、今抱えている困難を一つの「物語」や人に語る「面白エピソード」に昇華させてみましょう。困難を客観視し、その中にあるドラマ性を「楽しむ」視点に変換することで、創造的に乗りこなすことができます。",
      3: "あなたの情熱（火）を、困難の根本原因を解明する「知的な探求」に向けてみましょう。なぜこの問題は解決しないのか？その構造的な欠陥は何か？知的好奇心が、困難に立ち向かうエネルギーになります。",
      4: "あなたの行動力（雷）を使い、巨大な困難を、今日できる「5分で終わるタスク」に分解してみましょう。大きな壁を前に動けなくなるのではなく、小さな一歩を確実に踏み出すことが、沼から抜け出す唯一の方法です。",
      5: "あなたの共感力（風）を使い、同じような困難を経験した人の話を聞いたり、本を読んだりしてみましょう。自分だけではないと知ることが、孤独な探求の旅の支えとなります。",
      7: "あなたの探求心（山）を活かし、「困難」というテーマについて歴史や心理学から深く学んでみましょう。困難を一般化・抽象化することで、個人的な悩みから客観的な研究対象へと変化させ、冷静に対処する道筋が見えてきます。",
      8: "あなたの受容力（坤）を使い、「今は困難な時期である」という事実を、ただ静かに受け入れてみましょう。無理に解決しようともがくのをやめ、大地に根を下ろすように、状況を受け入れる覚悟が、新たな力を与えてくれます。",
    },
    7: {
      1: "あなたの創造力（天）を使い、壮大なビジョンを考えた後、あえてそれを「一週間寝かせる」というルールを設けてみましょう。時間を置くことで、アイデアはより深く、地に足のついたものに熟成されます。",
      2: "あなたの対話力（沢）を使い、人と話す時間と同じくらい、「一人で静かに振り返る時間」をスケジュールに組み込みましょう。インプットとアウトプットのバランスが、あなたの思考を深めます。",
      3: "あなたの情熱（火）の炎を、外部に向けるだけでなく、内なる洞察を深めるための「内なるランプ」として使ってみましょう。自分の感情がなぜそう動くのかを、静かに観察します。",
      4: "あなたの行動力（雷）を使い、「何もしない」ということを積極的に計画し、実行してみましょう。スケジュール帳に「内省」と書き込み、他の予定と同じようにそれを守ることが、静止する力を育てます。",
      5: "あなたの共感力（風）を、他者だけでなく、自分自身の内なる声に向ける練習をしましょう。静かな時間を作り、「今、本当はどう感じている？」と自分に問いかける習慣が、探求心を育てます。",
      6: "あなたの探求心（水）を、外の世界だけでなく、自分の内面に向けてみましょう。なぜ自分はこのパターンを繰り返すのか？過去の経験が今の自分にどう影響しているのか？自己という最も深い謎を探求します。",
      8: "あなたの受容力（坤）を使い、ただ情報を受け入れるだけでなく、その情報が自分の中でどう消化され、根付いていくかを、時間をかけて観察しましょう。すぐに結論を出さない「待つ力」が、探求心を深めます。",
    },
    8: {
      1: "あなたのリーダーシップ（天）を、指示や命令ではなく、「場作り」のために使ってみましょう。メンバーが安心して意見を言え、能力を発揮できる「土壌」を整えることが、あなたらしい育成の形です。",
      2: "あなたの表現力（沢）を、自分の話をするためでなく、相手の素晴らしい点を「言語化して伝える」ために使ってみましょう。具体的な賞賛の言葉が、相手の成長を力強く後押しします。",
      3: "あなたの知性（火）を使い、相手の潜在能力や可能性を分析し、それを本人にフィードバックしてみましょう。「あなたにはこういう才能がある」という客観的な指摘が、相手の自己認識を助けます。",
      4: "あなたの行動力（雷）を使い、誰かが困っている時に、すぐに手伝う（行動する）のではなく、まず「何か手伝えることはありますか？」と相手の意志を尊重する一言を挟んでみましょう。",
      5: "あなたの共感力（風）を使い、相手の成長を願う気持ちを、直接的な言葉で伝えてみましょう。「応援しています」「期待しています」という言葉が、相手の心を育む栄養になります。",
      6: "あなたの探求心（水）を使い、相手を育てる上での「困難」や「課題」から逃げずに向き合いましょう。なぜこの人は伸び悩んでいるのか、その本質的な原因を探求することが、真の育成に繋がります。",
      7: "あなたの不動の精神（山）を使い、相手が失敗したり、成長が停滞したりしても、どっしりと構えて信じ、待ち続けてあげましょう。あなたの変わらない存在が、相手にとっての最大の安全基地となります。",
    },
  },
  // ▼▼▼【重要】ここに bible オブジェクトを追加する必要があります ▼▼▼
  bible: {
    // 彖伝（たんでん）：卦全体のテーマ解説
    tuan_den: {
      1: {
        title: "乾為天（けんいてん） - 天龍、飛翔の時",
        summary:
          "圧倒的なリーダーシップと創造エネルギーの塊。すべての物事の始まりを司る「最強の父性」の象徴。",
        points: [
          "万物はこれに頼ってその存在を始める",
          "時に応じて六頭の龍に乗り、天を治める",
        ],
        haqei_interpretation:
          "これは、強力なリーダーやベンチャー企業の創業者などが持つ純粋なエネルギーを表します。あなたの人生において、新しいプロジェクトを立ち上げたり、未知の分野に挑戦したりする時の高揚感そのものです。「龍」はあなたのポテンシャルの段階を示しています。初めは水中に潜み（潜龍）、やがて地上に現れ（見龍）、ついには天を飛翔します（飛龍）。しかし、昇り詰めると傲慢になり、後悔する危険（亢龍）もはらんでいます。この卦の時は、自分の内から湧き上がるエネルギーを信じ、力強く前進することがテーマです。ただし、その力が暴走しないよう、常に謙虚さと正しさ（貞）を忘れないことが成功の鍵となります。",
      },
      2: {
        title: "坤為地（こんいち） - 大地、すべてを受け入れる器",
        summary:
          "すべてを受け入れ、育み、支える「偉大なる母性」の象徴。優れたサポーターであり、全ての土台となる存在。",
        points: [
          "万物はこれに頼ってその生命を生み出される",
          "先走れば道に迷うが、後に従えば主となるべきものを得て利益がある",
        ],
        haqei_interpretation:
          "これは、ナンバー2や人事部長、あるいは優秀な秘書や母親などが持つ受容力と育成力を表します。自らが先頭に立つのではなく、リーダーや組織全体を支え、そのポテンシャルを最大限に引き出すことに喜びを見出します。無理に自分から動こうとすると道に迷いますが、信頼できるリーダーや理念に「従う」ことで、真価を発揮します。「西南に仲間を得る」とは、同じサポートタイプの仲間と協力すること。「東北に仲間を失う」とは、乾為天のようなリーダータイプと出会い、その人を支えることで新たなステージに進むことを意味します。あなたの安定したサポートが、チームに最高のパフォーマンスをもたらす時です。",
      },
      3: {
        title: "水雷屯（すいらいちゅん） - 混沌、産みの苦しみの時",
        summary:
          "新しいことを始める時の「産みの苦しみ」。混沌としていて、前に進みたくても進めない、もどかしい状況。",
        points: [
          "剛（陽）と柔（陰）が初めて交わって、産みの苦しみが生まれる",
          "険しい状況（水）の中で動こう（雷）としている",
        ],
        haqei_interpretation:
          "これはまさにスタートアップ企業の黎明期や、新規事業の立ち上げそのものです。目の前には「水」という険しい困難や課題が横たわっていますが、内には「雷」という行動への衝動や情熱があります。このアンバランスさこそが「屯」の本質。進みたいのに進めない、アイデアはあるのにお金がない、といった葛藤に満ちています。重要なのは、焦って闇雲に動かないこと。今は産みの苦しみを耐え、協力者（侯を建て）を探し、正しい道筋（貞）を見定めるべき時。この混沌とした時期を乗り越えれば、必ず道は開けます。",
      },
      4: {
        title: "山水蒙（さんすいもう） - 啓蒙、学ぶ者の時",
        summary:
          "濃い霧の中で道がわからない「無知な状態」。教育や学びを通じて、視界を晴らしていくプロセス。",
        points: [
          "険しさの前で止まっている状態が『蒙（無知）』",
          "私が未熟な者に教えを乞うのではなく、未熟な者が私に教えを乞う",
        ],
        haqei_interpretation:
          "これは、新入社員や、新しい分野の学習を始めた人の状態です。目の前の「水」（険しい課題）に対して、どう動けばいいかわからず、「山」（動かない）のように立ち止まってしまっています。この卦の時に最も重要なのは、「教えを乞う」という素直な姿勢です。プライドは捨て、自分が「蒙（無知）」であることを認め、メンターや先生に積極的に質問することが、成長への最短ルートです。ただし、何度も同じことを聞いたり、学ぶ姿勢がなかったりすると、「真理を冒涜する」と見なされ、誰も教えてくれなくなります。真摯な探求心こそが、あなたの霧を晴らす光となります。",
      },
      5: {
        title: "水天需（すいてんじゅ） - 「待つ力」こそ最強の戦略",
        summary:
          "焦らず、騒がず、自信を持って最高のタイミングを待つ「攻めの待機」の時。",
        points: [
          "目の前に険しい困難（水）があるが、内面は剛健（天）であるため、その困難に陥ることはない",
          "大きな川を渡るのに良い」とは、進んで功績を上げられるということ。",
        ],
        haqei_interpretation:
          "これは、困難なプロジェクトや交渉事を前に、むやみに動かず、じっくりと準備を整えている状態です。重要なのは、ただ怯えて待っているのではない点。「内面は剛健（天）」なので、心の中では「必ずうまくいく」という自信と計画を持っています。この「待つ」という戦略的判断が、最終的に大きな成果（大川を渡る）に繋がります。今は慌てず、情報収集、スキルアップ、人脈作りなど、来るべき時に備えて完璧な準備を整えるべき時です。",
      },
      6: {
        title: "天水訟（てんすいしょう） - 「正しさ」を巡る対立",
        summary:
          "正義感や理想（天）が、険しい現実や感情（水）とぶつかり合う「対立」の時。",
        points: [
          "険しい相手に対して剛健に臨むのが『訟（争い）』の形",
          "争い事は最後までやり遂げるべきではない",
        ],
        haqei_interpretation:
          "ビジネスにおける交渉、訴訟、あるいは社内での意見の対立などを象徴します。あなたは自分の正しさを信じていますが、相手もまた険しい覚悟を持っています。この卦が教えるのは、「勝つこと」が必ずしも最善ではないということです。最後まで相手を打ち負かそうとすれば、たとえ勝っても大きな傷を負い、人間関係は破綻します（最後まで争えば凶）。賢明なのは、中立的な第三者（大人）に仲介を頼んだり、争いの淵に陥る前に引き返したりすること。白黒つけることよりも、大局的な利益を考えるべき時です。",
      },
      7: {
        title: "地水師（ちすいし） - 組織を率いるリーダーの時",
        summary:
          "明確な目的のために、多くの人々（地）を率いて困難（水）に立ち向かう「組織戦」の時。",
        points: [
          "多くの民衆を正義によって率いることができれば、王となることができる",
          "険しい状況の中を順当に進んでいる",
        ],
        haqei_interpretation:
          "これは、プロジェクトチームや会社組織を率いるリーダーのあり方を示します。ただの人の集まりではなく、「師（軍隊）」として機能するには、「貞（正義）」、つまり大義名分と明確な規律が不可欠です。中心となるリーダー（九二の陽爻）がしっかりしていれば、たとえ困難な状況でも人々はついてきます。個人的な感情ではなく、組織全体の目的のために、時に非情な決断も求められる、まさにリーダーシップが試される時です。",
      },
      8: {
        title: "水地比（すいちひ） - 親密な協力関係を築く",
        summary: "水が大地に染み込むように、自然で親密な協力関係が生まれる時。",
        points: [
          "『比』とは、助けることであり、下の者が上の者に順い従う形",
          "ためらっていた者が来て凶」とは、その道が行き詰まっているからだ。",
        ],
        haqei_interpretation:
          "これは、信頼できるパートナーやチームとの出会いを象徴します。トップダウンの命令ではなく、中心人物（九五の陽爻）の徳に引かれて、人々が自然と集まり、助け合う関係です。重要なのは、真心（孚）。表面的な付き合いではなく、心からの信頼関係を築くことが求められます。逆に、疑いやためらいを持ってこの輪に入ろうとしても、うまくいきません。信頼をベースにした、心地よいチームワークが生まれる時です。",
      },
      9: {
        title: "風天小畜（ふうてんしょうちく） - 小さな障害、待機の時",
        summary:
          "大きな力が、小さな障害によって一時的に止められている「焦れったい停滞期」。",
        points: [
          "柔（陰）が適切な位を得て、上下の剛（陽）がそれに応じている",
          "密雲あれど雨は降らない",
        ],
        haqei_interpretation:
          "あなたの中には、天に昇る龍のような大きなエネルギー（天）があります。しかし、今はまだ優しい風（風）に阻まれて、前進できません。これは、大きなプロジェクトが些細な問題でストップしたり、天候不順で計画が遅れたりする状況に似ています。「密雲あれど雨は降らない」の言葉通り、状況は好転しそうで、なかなかしない。しかし、これは悪いことばかりではなく、力を蓄え、計画を練り直すための「小さな充電期間（小畜）」です。無理に進もうとせず、この時を活かして準備を整えるのが賢明です。",
      },
      10: {
        title: "天沢履（てんたくり） - 礼儀をもって危険を回避する",
        summary:
          "虎の尾を踏むような危険な状況でも、礼儀と慎重さで乗り切る「危機管理術」。",
        points: [
          "喜ばしい心（沢）で剛健なもの（天）に応じている",
          "虎の尾を踏んでも、その人に噛みつかないで、物事は通る",
        ],
        haqei_interpretation:
          "目上の人や、気難しいクライアント（天）と、喜びや楽しみ（沢）をもって接するという、高度な対人スキルを表します。相手は非常にパワフルで危険（虎）ですが、こちらが礼儀を尽くし、慎重に行動すれば、なぜか可愛がられ、うまくいくという不思議な状況です。これは、単なるゴマすりではありません。相手への敬意と、自分の立ち位置をわきまえた上での、洗練されたコミュニケーション戦略です。このスキルがあれば、どんなに緊張感のある場面でも、道を切り開くことができます。",
      },
      11: {
        title: "地天泰（ちてんたい） - 理想的な平和と安定",
        summary:
          "天と地が交わるように、すべてがスムーズに流れ、安定と繁栄を享受する最高の状態。",
        points: [
          "天と地が交わって万物が通じ合う",
          "理想のリーダーの道が伸び、未熟な人の道が消えていく",
        ],
        haqei_interpretation:
          "組織の風通しが最高に良い状態です。天（上司・経営層）の意図がスムーズに地（現場・部下）に伝わり、現場の声もまた天に届く。この理想的なコミュニケーションが、組織全体のポテンシャルを最大限に引き出し、物事が自然と良い方向に進んでいきます。公私ともに人間関係は良好で、心は安らか。まさに「泰平」の時ですが、この状態が永遠ではないことも、この卦は示唆しています。",
      },
      12: {
        title: "天地否（てんちひ） - コミュニケーション断絶の閉塞感",
        summary: "天と地が交わらない、何をしても通じない「完全な閉塞状態」。",
        points: [
          "天と地が交わらず、万物が通じ合わない",
          "未熟な人の道が伸び、理想のリーダーの道が消えていく",
        ],
        haqei_interpretation:
          "地天泰とは真逆で、組織のコミュニケーションが完全に断絶した状態。経営層（天）と現場（地）が互いに不信感を抱き、情報が全く流通していません。正しい意見は無視され、私利私欲や保身がまかり通る、最悪の職場環境です。この時に無理に行動しても、エネルギーの無駄です。今は「何をしても通じない時期」と割り切り、嵐が過ぎ去るのを静かに待つのが賢明な戦略となります。",
      },
      13: {
        title: "天火同人（てんかどうじん） - 公平な協力関係",
        summary:
          "身内びいきなく、オープンで公平な志のもとに人々が集う「理想のチーム」。",
        points: [
          "文明（火）と剛健（天）の徳を併せ持ち、中正の徳を保ちながら応じ合う",
          "ただ理想のリーダーだけが、天下の人々の心を一つに通じさせることができる",
        ],
        haqei_interpretation:
          "血縁や地縁、学閥といった閉じたコミュニティではなく、共通の目的や理念（文明）のために、能力ある者（剛健）が自然と集まる状態。スタートアップやNPOなど、新しい価値を創造する組織の理想形です。成功の鍵は、リーダーが私心なく、公平であること。特定の誰かをえこひいきせず、オープンな場で議論を尽くすことで、多様なメンバーの心が一つになります。",
      },
      14: {
        title: "火天大有（かてんたいゆう） - 豊かさと公正な分配",
        summary:
          "多くのものを所有し、それを正しく使うことで、さらなる繁栄を生む「賢明な富豪」。",
        points: [
          "柔（陰）の爻が尊い位におり、上下の剛（陽）の爻がこれに応じている",
          "天の時に応じて行動する",
        ],
        haqei_interpretation:
          "唯一の柔爻（リーダー）が、多くの剛爻（才能、富、部下）を従えている形。これは、優れたCEOやリーダーが、多くのリソースを効果的に活用している姿です。ただ所有するだけでなく、「天の時に応じて」、つまり社会のニーズや天命に従ってその富や力を使うことで、物事は大いに通ります。私利私欲に走らず、公正な分配を行うことで、そのリーダーシップは盤石なものとなります。",
      },
      15: {
        title: "地山謙（ちざんけん） - 実るほど頭を垂れる稲穂、最強の謙虚さ",
        summary:
          "実力（山）を内に秘め、態度はどこまでも低い（地）。その謙虚さゆえに、誰からも愛され、尊敬される人のあり方。",
        points: [
          "天の道は満ち足りたものを損なって謙虚なものに与え、人の道は満ち溢れたものを憎んで謙虚なものを好む",
          "尊い位にあっても光り輝き、低い位にあっても誰もそれを超えることはできない",
        ],
        haqei_interpretation:
          "これは、人格的に完成されたリーダーや、深い知恵を持つ専門家の姿です。高い山のように実績やプライドを持ちながら、その態度は大地のように低く、誰に対しても謙虚です。面白いのは、易経が「謙虚さは最強の生存戦略である」と断言している点です。天も人も鬼神さえも、満ち足りて傲慢なものを嫌い、謙虚な者に味方する、と説きます。この卦の時は、自分の功績を誇るのではなく、むしろ他者を立て、教えを乞う姿勢が、逆にあなたの評価を極限まで高めます。争いを避け、人からの助けを自然に引き出す、究極の徳と言うべき状態です。",
      },
      16: {
        title: "雷地豫（らいちよ） - 準備万端で迎える「お祭り」",
        summary:
          "周到な準備（地）の上で、情熱（雷）をもって人々を動かす。楽しさが人を動かすリーダーシップ。",
        points: [
          "下の者の順意（地）にしたがって動く（雷）のが『予』",
          "優れた人物が順調に動くから、刑罰は明確になり民は心服する",
        ],
        haqei_interpretation:
          "唯一のリーダー（陽爻）が、多くの民衆（陰爻）の支持を得て、物事を始める形。これは、大規模なイベントやプロジェクトのローンチに似ています。成功の鍵は、民意（地）をよく汲み取り、周到に準備した上で、人々を動かす情熱（雷）を示すことです。「予」という字は「あらかじめ」の他に「楽しみ」の意味も持ちます。人々は、リーダーが示す楽しそうなビジョンに惹かれてついてくるのです。ただし、楽しさに浮かれて油断（豫）すると失敗する、という二面性も持っています。",
      },
      17: {
        title: "沢雷随（たくらいずい） - 変化の波に乗るサーファー",
        summary:
          "時代の変化や優れたリーダーに、喜びをもって柔軟に「ついていく」力。",
        points: [
          "剛（陽）がやって来て柔（陰）の下にへりくだり、動いて（雷）喜ぶ（沢）",
          "天下の万物が時に随うということだ",
        ],
        haqei_interpretation:
          "この卦は、変化の激しい現代において非常に重要なOSです。「雷」という新しい動きや変化に対し、「沢」という喜びの心でしなやかに従う姿を現します。これは、旧来のやり方に固執せず、新しいテクノロジーや優れたリーダーの方針を積極的に取り入れる能力です。重要なのは、いやいや従うのではなく、その変化を「面白がって」受け入れている点。このポジティブな姿勢が、時代の波を乗りこなし、結果的に成功を掴む原動力となります。ただし、自分の軸を見失い、何にでも流される「思考停止のイエスマン」にならないよう注意が必要です。",
      },
      18: {
        title: "山風蠱（さんぷうこ） - 組織の腐敗を断つ改革者",
        summary:
          "長年放置されてきた組織の「病」を、根本から立て直す強い意志と責任感。",
        points: [
          "巽（風）の性質で止まって（山）いるのが『蠱（物事が腐敗する）』の形である",
          "『蠱』は、これを正すことで天下が治まるからだ",
        ],
        haqei_interpretation:
          "器（山）の中のものが、風通しが悪く（風）、長い間放置された結果、腐って虫が湧いた（蠱）という、かなりショッキングなイメージです。これは、組織内の悪習、先代から引き継いだ負の遺産、あるいは個人の慢性的な悪癖などを象徴します。この問題解決は、大変な労力と覚悟（大きな川を渡る）を伴います。しかし、この卦の時は、見て見ぬふりをせず、ドラスティックな改革に手をつけるべきです。その断固たる行動が、最終的に組織や個人を再生させます。",
      },
      19: {
        title: "地沢臨（ちたくりん） - 人々を育てる親分肌のリーダー",
        summary:
          "大らかな心で人々に臨み、その成長を喜ぶ、親分肌・姉御肌のリーダーシップ。",
        points: [
          "剛（陽）の気が少しずつ伸びていく時",
          "喜んで（沢）順（地）に従い、中心の剛（陽）に応じている",
        ],
        haqei_interpretation:
          "陽のエネルギー（リーダーシップ）が、下から力強く伸びていく成長期です。大地（地）のような大らかさと、沢（沢）のような喜びをもって人々に接することで、自然と信頼と支持が集まります。特に、部下や後輩の育成に最適なOSと言えます。あなたの指導のもとで、人々は安心して能力を伸ばしていくでしょう。「八月になると凶」という言葉は、この陽の勢いも永遠ではないという戒め。良い時だからこそ、油断せず、公正さを保つことが大切です。",
      },
      20: {
        title: "風地観（ふうちかん） - 本質を見抜く静かな観察者",
        summary:
          "風のように高い視点から、地上を静かに「観察」し、本質を見抜くアナリスト。",
        points: [
          "中正の徳をもって天下を観る",
          "下の者が上の徳に感化されて、自らを観るようになる",
        ],
        haqei_interpretation:
          "風が地上を吹き渡り、ありのままの姿を明らかにするように、高い視点から物事を冷静に観察する時。これは、市場調査、競合分析、あるいは自分自身の内面を深く見つめる自己分析に最適な状態です。ただ「見る」だけでなく、そこから普遍的な法則（神の道）を見出し、それを人々に示すことで、あなたは優れた指導者となります。すぐに行動するのではなく、まずじっくりと観て、本質は何かを見極めることが求められます。",
      },
      21: {
        title: "火雷噬嗑（からいぜいごう） - 障害物を噛み砕く断固たる実行力",
        summary: "行く手を阻む障害を、知性とパワーで「噛み砕き」解決する力。",
        points: [
          "口の中に物がある形、これを『噬嗑（噛み砕く）』と言う",
          "動いて（雷）明らか（火）になる",
        ],
        haqei_interpretation:
          "口の中にある邪魔なもの（障害）を、雷のような強いパワー（下顎）と、火のような知性・分析力（上顎）で、ガブリと噛み砕くイメージです。これは、法的な問題や、組織内の抵抗勢力など、明確な障害物を断固として取り除く力を象徴します。やり方が強引になりすぎることもありますが、問題を放置せず、正義をもって解決する強い意志と実行力がテーマとなる時です。",
      },
      22: {
        title: "山火賁（さんかひ） - 本質を美しく見せるデザインの力",
        summary: "中身の良さを、洗練された「飾り」によって最大限に輝かせる力。",
        points: [
          "文明（火）にして止まる（山）のは、人の文様（人文）である",
          "人文を観て天下を教化し完成させる",
        ],
        haqei_interpretation:
          "どっしりとした山（実体・本質）の麓を、美しい炎（文明・知性）が飾っている形。これは、優れた製品を美しいデザインでラッピングしたり、素晴らしい理念を感動的なプレゼンテーションで伝えたりすることです。「賁」は、ただ着飾るのではなく、中身の価値を最大限に引き出すための「意味のある飾り」を指します。あなたの持つ素晴らしい才能や商品を、どうすればもっと魅力的に見せられるか、デザインやブランディングを考えるのに最適な時です。",
      },
      23: {
        title: "山地剥（さんちかく） - 終わりと再生のための破壊",
        summary: "古いものが土台から崩れ落ちていく、避けられない「終焉」の時。",
        points: [
          "『剥』とは、剥ぎ落とすことである",
          "理想のリーダーが消長盈虚（満ち欠け）の理を尊ぶのは、それが天の運行の法則だからである",
        ],
        haqei_interpretation:
          "一枚だけ残った陽爻（旧体制・リーダー）が、下の陰の勢力によって、ベッドの足元から一枚一枚剥がされていくような、厳しい衰退期です。時代の変化、事業の終焉など、もはや抗えない大きな流れの中にいます。この時に重要なのは、流れに逆らってエネルギーを消耗することではありません。全てが剥がれ落ちた後に唯一残る、次の時代に繋がる「種子（碩果）」は何かを冷静に見極め、未来に備えるべき時です。",
      },
      24: {
        title: "地雷復（ちらいふく） - 長い冬が明け、光が還る",
        summary:
          "暗闇の底から、再び一筋の光が還ってくる「再生」と「回復」の始まり。",
        points: [
          "剛（陽）が還ってくる",
          "その道を繰り返し、七日で還ってくるのは、天の運行の法則",
        ],
        haqei_interpretation:
          "陰が極まった暗闇の大地（地）から、一点の陽光（雷）が生まれ、再び春が巡ってくる。これは「冬至」を象徴し、大失敗や長いスランプからの回復を示します。この卦の時は、焦って何かをする必要はありません。物事は自然と善い方向へ向かい始めます。ただ、その善への回復（復）の流れに乗り、二度と同じ過ちを繰り返さないと心に決めることが大切です。自然のサイクルを信じ、静かに力を蓄えましょう。",
      },
      25: {
        title: "天雷无妄（てんらいむもう） - 自然体こそが最強の戦略",
        summary: "計算や下心のない、「自然体の誠実さ」が問われる時。",
        points: [
          "大いに物事が通り、正しい道にかなっているのは、天の命だからである",
          "天の命が助けなければ、どうして進むことができようか",
        ],
        haqei_interpretation:
          "「无妄」とは偽りがないこと。天の法則（天）に従い、自然に動く（雷）姿です。これは、何かを意図したり、作為的に動いたりするのではなく、ただ誠実であること、あるがままでいることが求められる状態です。この純粋さゆえに、時に予期せぬ災難に巻き込まれることもありますが、それでも天を信じて誠実を貫けば、最終的に道は開けます。小手先のテクニックが通用しない、あなたの人間性そのものが試される時です。",
      },
      26: {
        title: "山天大畜（さんてんたいちく） - 巨大な知のダムを築く",
        summary: "才能・知識・徳を、内面に「大きく蓄える」インプット特化期間。",
        points: [
          "剛健で誠実な徳が光り輝き、日に日にその徳を新たにしている",
          "よく剛健なものを止め、大いなる正しさを保っている",
        ],
        haqei_interpretation:
          "天の偉大なエネルギー（剛健）を、どっしりとした山が受け止めている形。これは、単なる知識の丸暗記ではなく、人格や徳性も含めて、内面に大きく力を蓄えている状態です。資格取得のための猛勉強や、専門スキルを磨く修行期間などがこれにあたります。すぐに結果を出す（アウトプットする）のではなく、質の高いインプットに集中するべき時。この期間に蓄えた巨大な知のダムが、あなたの揺るぎない実力となり、将来の大きな成功の基盤となります。",
      },
      27: {
        title: "山雷頤（さんらいい） - 心と体を養う食生活",
        summary: "正しいものを口にし、心と体を「養う」セルフケアの重要性。",
        points: [
          "『頤（やしなう）』は正しければ吉",
          "その人が何を養っているかを観ることだ",
        ],
        haqei_interpretation:
          "上顎（山）と下顎（雷）が口の形を作っています。これは、「何を口にするか」がテーマ。文字通りの食事だけでなく、どんな情報に触れ（インプット）、どんな言葉を発するか（アウトプット）も含まれます。ジャンクフードやゴシップ、人を傷つける言葉は、自分自身を内側から蝕みます。心身ともに、質の良い「栄養」を摂ることがテーマとなる時です。",
      },
      28: {
        title: "沢風大過（たくふうたいか） - 常識を超えた覚悟で危機を突破する",
        summary:
          "屋台骨がしなるほどの「異常事態」と、それを乗り越える並外れた覚悟。",
        points: [
          "『大過』とは、大いなるもの（陽）が過ぎていることである",
          "棟木がたわむとは、根本と末端が弱いからだ",
        ],
        haqei_interpretation:
          "陽の力が強すぎて、屋台骨（棟木）がミシミシと音を立ててたわんでいる、まさに危機的状況です。これは、組織の倒産の危機、個人のキャパシティを大幅に超える仕事量などを象徴します。平常時のルールや常識は通用しません。この危機を乗り越えるには、常識を超えた大胆な発想や、並外れた覚悟（大過）が必要です。非常に困難ですが、乗り越えた先には大きな成長が約束されています。",
      },
      29: {
        title: "坎為水（かんいすい） - 困難の只中で学ぶ",
        summary: "困難や悩みに「どっぷり浸かり」、その中で本質を学ぶ試練の時。",
        points: [
          "『習坎』とは、険しいことが重なっていることだ",
          "険しい道を行っても、その誠実さを失わない",
        ],
        haqei_interpretation:
          "険しい谷（水）が二つも重なり、どこにも逃げ場がありません。悩みや困難が次々と襲ってくる、精神的に非常に苦しい時期です。しかし、この卦の重要なメッセージは、「困難から逃げるな、困難に習え」ということです。何度も苦しい経験をするうちに、水に慣れるように、困難を乗りこなす知恵と精神力が身につきます。人生における、避けては通れない「学びの期間」なのです。",
      },
      30: {
        title: "離為火（りいか） - 輝くための「付着先」を見極める",
        summary:
          "知性と情熱の「炎」が燃え盛るが、何かに依存しなければ消えてしまう輝き。",
        points: [
          "『離』とは、付着することである",
          "重なる明るさが正しいものに付着することで、天下を教化し完成させる",
        ],
        haqei_interpretation:
          "炎（火）が薪に「付着」して燃えるように、何か優れたもの（人、組織、理念）にくっつくことで、あなたの知性や情熱が輝く時です。あなた自身が光源ではなく、あくまでリフレクター（反射板）としての役割を果たします。そのため、依存先を失うと輝きも失うという脆さを持っています。誰を師と仰ぎ、どのコミュニティに属するか。その「付着先」を正しく見極めることが何よりも重要になります。",
      },
      31: {
        title: "沢山咸（たくざんかん） - 理屈抜きの共感力",
        summary: "若い男女が惹かれ合うような、理屈抜きの純粋な「感応」。",
        points: [
          "『咸』とは、感じ合うことである",
          "男が女の下にへりくだっている",
        ],
        haqei_interpretation:
          "若い男性（山）が若い女性（沢）に惹かれ、心を尽くす姿。恋愛の始まりや、理屈を超えた直感的なインスピレーションを象徴します。ビジネスシーンでは、損得勘定ではなく「この人と仕事がしたい」「このプロジェクトは面白そうだ」という純粋な気持ちが、物事を動かす原動力になります。心を空にして、感じるままに行動することが吉と出ます。",
      },
      32: {
        title: "雷風恒（らいふうこう） - 「継続は力なり」を地で行く",
        summary: "一つのことを地道に「長く続ける」ことで得られる信頼と安定。",
        points: [
          "『恒』とは、久しいということだ",
          "天地の道は、恒久的で止むことがない",
        ],
        haqei_interpretation:
          "夫（雷）と妻（風）がそれぞれの役割を果たし、家庭が長く続く姿。これは、結婚生活や、長年のパートナーシップ、あるいは日々のルーティンワークを象徴します。派手さや刺激はありませんが、「継続は力なり」を地で行く卦です。新しいことに手を出すよりも、今あるものを大切に育み、改善し続けることが求められます。ただし、変化を嫌うあまり、頑固にならないよう注意が必要です。",
      },
      33: {
        title: "天山遯（てんざんとん） - 賢者の戦略的撤退",
        summary: "戦略的に「逃げるが勝ち」を実践する、賢い撤退術。",
        points: [
          "『遯（のがれる）』とは、うまく逃れることで物事が通るということだ",
          "時勢と共に行動している",
        ],
        haqei_interpretation:
          "陰の勢力が伸びてきたため、陽の君子が、世俗から身を引いて山に隠れる（遯）姿。これは、不利な状況から、賢明に距離を置くことを意味します。これは敗走ではありません。次のチャンスを待つための戦略的撤退です。深入りして消耗する前に、あっさりと身を引くことで、無用なダメージを防ぎ、力を温存できます。",
      },
      34: {
        title: "雷天大壮（らいてんたいそう） - 暴走注意のパワフルな前進",
        summary:
          "溢れるエネルギーで力強く前進するが、暴走の危険もはらむ「若々しいパワー」。",
        points: [
          "『大壮』とは、大いなるもの（陽）が盛んであることだ",
          "剛（陽）の力で動く（雷）",
        ],
        haqei_interpretation:
          "陽のエネルギーが下から突き上げ、非常に勢いがある状態。若々しいパワーと実行力に満ち溢れています。しかし、その力はまだ粗削りで、後先を考えずに暴走する危険も。牡羊が垣根に突進して角を絡ませるように、使い方を誤ると自滅しかねません。この有り余るエネルギーを、正しい方向に導く冷静さがテーマです。",
      },
      35: {
        title: "火地晋（かちしん） - スムーズな出世街道",
        summary: "太陽が昇るように、順調に「出世」していく幸運な時。",
        points: [
          "『晋』とは、進むことである。明るい太陽（火）が地上（地）に昇る形",
          "賢君に用いられて、たくさんの馬を賜り、一日に三度も接見される",
        ],
        haqei_interpretation:
          "自分の能力が認められ、トントン拍子に昇進・進展していく幸運な時です。周囲からの支持も得やすく、物事は順調に進みます。この卦の時は、積極的に前に出て、自分の能力をアピールすることで、さらに運気が上昇します。ただし、調子に乗りすぎないよう注意も必要です。",
      },
      36: {
        title: "地火明夷（ちかめいい） - 暗黒時代を耐え忍ぶ知恵",
        summary: "才能を隠し、理不尽な状況を「耐え忍ぶ」ための処世術。",
        points: [
          "明るさ（火）が地中（地）に入るのが『明夷（明智が傷つけられる）』",
          "内なる困難の中で、よくその志を正しく保った",
        ],
        haqei_interpretation:
          "明るい知性（火）が、大地（地）の下に隠れている状態。これは、理不尽な上司の下で働いたり、自分の正しい意見が全く通らない逆境の時です。この時に正論を吐いても、潰されるだけ。今は「能ある鷹は爪を隠す」時と割り切り、あえて愚かなふりをして、心の中の光を消さずに耐え忍ぶことが最善の策となります。",
      },
      37: {
        title: "風火家人（ふうかかじん） - 組織の内部を固める",
        summary: "「家庭」や組織の内部秩序を固め、足元を安定させる時。",
        points: [
          "女が内側でその位を正しくし、男が外側でその位を正しくする",
          "家が正しくなって、天下は定まる",
        ],
        haqei_interpretation:
          "組織や家庭において、それぞれのメンバーが自分の役割を正しく果たすことで、全体の調和が保たれている状態。風（長女）は外からの情報を伝え、火（次女）は内を明るく照らします。この卦の時は、外に拡大するよりも、まず足元である「内部のルールや人間関係」をしっかりと固めることが、将来の発展の礎となります。",
      },
      38: {
        title: "火沢睽（かたくけい） - 対立から学ぶ",
        summary: "互いに「そっぽを向いている」対立と不和の状態。",
        points: [
          "『睽（そむく）』とは、火は動いて上に昇り、沢は動いて下に降ることである",
          "天地は互いに背き合っているようで、その働きは同じである",
        ],
        haqei_interpretation:
          "火は上へ、沢は下へ。同じ場所にいても、向いている方向が真逆で、心が通じ合わない状態。姉妹喧嘩や、部門間の対立などを象徴します。しかし、「睽」には「よく見る」という意味もあります。対立しているからこそ、相手のことを深く観察し、違いを理解する機会にもなり得ます。小さなことであれば、この対立から新たな発見が生まれる可能性もあります。",
      },
      39: {
        title: "水山蹇（すいざんけん） - 八方塞がりからの脱出法",
        summary: "前は川、後は山、の「八方塞がり」状態。",
        points: [
          "『蹇（なやむ）』とは、困難である。険しい谷（水）が目の前にある",
          "険しさを見て止まることができるのは、知恵があるということだ",
        ],
        haqei_interpretation:
          "前進しようにも険しい川（水）があり、後退しようにも険しい山（山）がそびえる、まさに八方塞がりの困難な状況。この時に重要なのは、闇雲にもがくのを「止める（山）」知恵です。独力で解決しようとせず、信頼できる仲間や専門家（大人）に助けを求めることで、初めて道が開けます。",
      },
      40: {
        title: "雷水解（らいすいかい） - 問題解決の時",
        summary: "氷が解けるように、困難が「解決」に向かう解放の時。",
        points: [
          "『解（とける）』とは、険しい状況（水）から動いて（雷）抜け出すことである",
          "天地が解け合って雷雨が起こり、果実や草木が皆、芽を吹き出す",
        ],
        haqei_interpretation:
          "長く続いた問題や緊張状態（水）に、春の雷（雷）が轟き、氷が解け始めるイメージ。困難な状況がようやく解決に向かい、物事が再び動き出す解放の時です。問題が解決したら、「速やかに行動に移す（早くすると吉）」ことが、この好機を最大限に活かす鍵となります。",
      },
      41: {
        title: "山沢損（さんたくそん） - 「損して得取れ」の精神",
        summary:
          "目先の利益を捨て、未来のために投資する「損して得取れ」の精神。",
        points: [
          "『損』とは、下（の者）を損なって上（の者）を益すること",
          "剛（陽）を損ない柔（陰）を益するのも、時による",
        ],
        haqei_interpretation:
          "山の下にある沢の水を汲んで、山の木々を潤すイメージ。これは、目先の利益（下の沢）を損なってでも、将来の大きな成長（上の山）のために投資することを意味します。自分の時間やお金を、他者のためや、自己投資のために使うことで、結果的に大きなリターンを得られる時です。",
      },
      42: {
        title: "風雷益（ふうらいえき） - 社会貢献で豊かになる",
        summary: "社会貢献によって、自分も他人も「豊かになる」理想的な好循環。",
        points: [
          "『益』とは、上（の者）を損なって下（の者）を益することであり、民は限りなく喜ぶ",
          "天が恵みを施し、地が万物を生み出す",
        ],
        haqei_interpretation:
          "「損」とは逆に、リーダー（上）が自分の財産や時間を、部下や社会（下）のために使うこと。その善い行い（風）が、行動力（雷）となって、社会全体に利益をもたらし、巡り巡って自分も豊かになるという、理想的な好循環を表します。積極的に社会貢献やボランティア活動を行うのに最適な時です。",
      },
      43: {
        title: "沢天夬（たくてんかい） - 断固たる決断の時",
        summary: "悪しきものを排除するための、「断固たる決断」。",
        points: [
          "『夬』とは、決断することである。剛（陽）が柔（陰）を決断し、排除すること",
          "徳を施すことを尊ぶのが良い",
        ],
        haqei_interpretation:
          "五つの陽が、一番上に残った一つの陰を排除しようとしている形。これは、組織内の問題児や、自分の悪習など、これ以上放置できない問題を、強い意志で断ち切ることを意味します。痛みを伴う決断ですが、ここで決行しなければ、全体の未来がありません。ただし、力だけに頼らず、徳をもって行うことが重要です。",
      },
      44: {
        title: "天風姤（てんぷうこう） - 予期せぬ出会いと誘惑",
        summary: "予期せぬ出会いと、そこに忍び寄る「小さな誘惑」。",
        points: [
          "『姤』とは、遇うことである。柔（陰）が剛（陽）に遇う",
          "妻をめとるのに用いてはならない",
        ],
        haqei_interpretation:
          "五人の男性（陽）の中に、一人の魅力的な女性（陰）が突然現れた形。これは、予期せぬチャンスや、魅力的な誘惑との出会いを象徴します。しかし、この出会いは長続きせず（長く共にいることはできない）、軽々しく乗ると、思わぬトラブルに巻き込まれる危険性も。慎重な対応が求められる時です。",
      },
      45: {
        title: "沢地萃（たくちすい） - 人が集まる喜び",
        summary: "人々が自然と「集まる」喜びと活気。",
        points: [
          "『萃』とは、集まることである",
          "順（地）に従って喜び（沢）、中心の剛（陽）に応じている",
        ],
        haqei_interpretation:
          "沢に水が集まるように、人々が自然と集まり、活気に満ちている状態。これは、成功したイベントや、求心力のあるコミュニティなどを象徴します。人が集まること自体に喜びがありますが、その目的を見失い、ただの馴れ合いにならないように注意が必要です。",
      },
      46: {
        title: "地風升（ちふうしょう） - 着実なステップアップ",
        summary: "地道な努力が実り、着実に「昇っていく」時。",
        points: [
          "『升』とは、柔（陰）が時に乗じて昇っていくことである",
          "巽（風）に従って順（地）であり、中心の剛（陽）に応じている",
        ],
        haqei_interpretation:
          "地中の種（地）が、風に導かれて、まっすぐに上へ伸びていく姿。これは、地道な努力が認められ、昇進やステップアップを果たす時です。派手さはありませんが、一歩一歩、着実に積み重ねてきたことが、確実な成果に繋がります。謙虚な姿勢と、周囲への感謝を忘れずに。",
      },
      47: {
        title: "沢水困（たくすいこん） - 困窮しても希望を失わない",
        summary: "沢の水が干上がり、どうにもならない「困窮」状態。",
        points: [
          "『困』とは、剛（陽）が（陰に）覆われていることである",
          "険しい状況（水）にあっても喜んで（沢）いる",
        ],
        haqei_interpretation:
          "沢（喜び、言葉）の水が、下の険しい谷（水）にすべて流れ落ちてしまい、干上がってしまった状態。これは、資金繰りの悪化や、アイデアの枯渇、話しても誰にも通じないといった、深刻な困窮状態を示します。しかし、理想のリーダーはこの状況でも希望を失わず、内なる喜びを見出します。苦しい中でも、ユーモアや精神性を失わないことが、この時を乗り切る鍵です。",
      },
      48: {
        title: "水風井（すいふうせい） - 変わらない価値の提供",
        summary: "変わることなく価値を提供する「井戸」の精神。",
        points: [
          "『井戸』は人々を養って尽きることがない",
          "村を改めても、井戸は改めない",
        ],
        haqei_interpretation:
          "井戸が、誰にでも公平に、そして絶えることなく水を提供するように、普遍的な価値を安定して供給し続けることの重要性を示します。これは、インフラ事業や、ベーシックなサービス、あるいは個人の変わらない誠実さなどを象徴します。常にメンテナンス（井戸浚え）を怠らず、その質を保つことが求められます。",
      },
      49: {
        title: "沢火革（たくかかく） - 革命とイノベーション",
        summary: "古い皮を脱ぎ捨てる「革命・イノベーション」の時。",
        points: [
          "『革』とは、水と火が互いにその力を消し合い…これを『革（あらたまる）』と言う",
          "天地が改まって四季が完成する",
        ],
        haqei_interpretation:
          "まさに革命やイノベーションの時。水と火が相殺しあうように、古い秩序が壊れ、全く新しいものが生まれる、ダイナミックな変化です。ビジネスモデルの変革、会社のリストラクチャリング、あるいは人生の大きな方向転換など、痛みを伴いますが、避けては通れない変革の時です。",
      },
      50: {
        title: "火風鼎（かふうてい） - 新たな文化を育む器",
        summary: "文化や組織を育む、安定した「器」。",
        points: [
          "『鼎（かなえ）』は、物の象徴である",
          "優れた人物は煮炊きして上帝に捧げ、また大いに煮炊きして優れた人物や賢人を養う",
        ],
        haqei_interpretation:
          "三本足の器「鼎」が象徴するように、安定した組織や文化の基盤を表します。革命（革）の後に来る、新しい秩序を定着させる段階です。ここでは、人を育て、文化を醸成し、皆でその恩恵を分かち合うことがテーマ。短期的な成果よりも、長期的な安定と共有財産を築くことが求められます。",
      },
      51: {
        title: "震為雷（しんいらい） - 衝撃による覚醒",
        summary: "突然の「雷」に驚き、覚醒する時。",
        points: [
          "『雷がやって来て人々が恐れおののく』とは、恐れることで福を招くからだ",
          "『雷鳴が百里を驚かす』とは、遠くの者を驚かせ、近くの者を恐れさせる",
        ],
        haqei_interpretation:
          "予期せぬ出来事、衝撃的なニュース、あるいは突然のひらめき。雷が二つ重なるこの卦は、現状を揺るがすショックな出来事を象徴します。人々は驚き、恐れますが、この衝撃こそが、マンネリや停滞を打破し、人々を覚醒させるきっかけ（福）となります。変化を恐れず、これを機に行動を起こすべき時です。",
      },
      52: {
        title: "艮為山（ごんいさん） - 「動かない」という選択",
        summary: "山のように「動かない」ことで、本質を見極める。",
        points: [
          "『艮』とは、止まることである",
          "止まるべき時に止まり、行くべき時に行く",
        ],
        haqei_interpretation:
          "山が二つ重なり、「止まる」「動かない」ことを徹底する時。これは、単なる停滞ではなく、自分の本分から外れた行動や、無駄な思考を意識的に停止させる、高度な自己コントロールです。情報を遮断し、内省に集中することで、自分の本当の立ち位置や、進むべき道が、かえって明確に見えてきます。",
      },
      53: {
        title: "風山漸（ふうざんぜん） - ゆっくり着実な前進",
        summary: "一歩一歩、順序正しく「ゆっくり進む」こと。",
        points: [
          "『漸（ぜん）』が進むとは、女性が嫁いで吉であるということだ",
          "止まって（山）巽（風）に従うのは、動いても行き詰まることがないからである",
        ],
        haqei_interpretation:
          "鳥が少しずつ巣に近づくように、物事を焦らず、順序立てて、着実に進めることの重要性を示します。特に、結婚や長期的なプロジェクトなど、時間をかけて信頼関係を築くべき事柄に適しています。急がば回れの精神で、プロセスを省略せずに丁寧に進めることで、最終的に確実な成功を収めることができます。",
      },
      54: {
        title: "雷沢帰妹（らいたくきまい） - 順序無視の暴走",
        summary: "情熱に任せた「順序無視のスタート」。",
        points: [
          "喜んで（沢）動く（雷）。これが妹を嫁がせることの所以である",
          "『進めば凶』とは、位が正しくないからだ",
        ],
        haqei_interpretation:
          "若い男性（雷）と若い女性（沢）が、情熱の赴くままに、正式な手続きを踏まずに結ばれる形。これは、勢いや感情に任せて、無計画に物事を始めてしまうことへの警告です。一見、華やかで楽しそうですが、順序が正しくないため、その関係は長続きせず、後で必ず問題が生じます。",
      },
      55: {
        title: "雷火豊（らいかほう） - 豊かさのピークと影",
        summary: "真昼の太陽のような「豊かさのピーク」。",
        points: [
          "『豊』とは、盛大であるということだ",
          "太陽が中天に達すれば傾き、月が満ちれば欠ける",
        ],
        haqei_interpretation:
          "明るい太陽（火）と、それをさらに活気づける雷（動）が組み合わさり、物事が豊かさの頂点に達した状態。花火が一番大きく開いた瞬間です。最高の時ですが、この卦は同時に「満つれば欠ける」という物事の真理も示しています。この繁栄に有頂天にならず、次の展開に備える冷静さが求められます。",
      },
      56: {
        title: "火山旅（かざんりょ） - アウェイでの生き方",
        summary: "故郷を離れ、アウェイで生きる「旅人」の心得。",
        points: [
          "『旅は、少しだけ物事が通る』とは、柔（陰）が中心にあって外におり、剛（陽）に順っているからだ",
          "止まって（山）明るさ（火）に付着している",
        ],
        haqei_interpretation:
          "知的な火（文明）が、慣れない土地（山）の上を旅している姿。出張や転職、引っ越しなど、アウェイな環境にいる時の心得を示します。この時は、でしゃばらず、謙虚に、その土地のルールに従うことが大切です。心から安らげる場所はありませんが、その孤独と緊張感が、あなたを人間的に成長させてくれます。",
      },
      57: {
        title: "巽為風（そんいふう） - 謙虚な浸透力",
        summary: "風のように、謙虚に、隅々まで「浸透する」力。",
        points: [
          "重なる巽（風）によって、命令を繰り返し申す",
          "柔（陰）が皆、剛（陽）に順っている",
        ],
        haqei_interpretation:
          "風が隙間に入り込むように、丁寧なコミュニケーションと謙虚な姿勢で、自分の意図を周囲に浸透させていく様を表します。強引な命令ではなく、繰り返し、粘り強く説得することで、人々は自然とあなたに従うようになります。ただし、自分の意見がなく、ただ周囲に流されるだけの「八方美人」にならないよう注意が必要です。",
      },
      58: {
        title: "兌為沢（だいたく） - 喜びのコミュニケーション",
        summary: "心からの「喜び」と楽しいコミュニケーション。",
        points: [
          "『兌』とは、喜ぶことである",
          "喜んで困難に立ち向かえば、民はその死をも忘れる",
        ],
        haqei_interpretation:
          "沢が二つ重なり、人々が集まって楽しくおしゃべりしている様子。これは、喜びや楽しみが、最高のモチベーションになることを示しています。会議やプロジェクトも、この「兌」の精神を取り入れ、楽しく進めることで、人々は自発的に協力し、困難さえも乗り越えていけます。",
      },
      59: {
        title: "風水渙（ふうすいかん） - しがらみの解消",
        summary: "淀んだ空気を「吹き散らす」リセットと解放。",
        points: [
          "『渙（ちる）』は物事が通る",
          "剛（陽）がやって来て行き詰まらず",
        ],
        haqei_interpretation:
          "凍りついた水（困難）の上に、暖かい春風が吹き、氷が解けて散っていくイメージ。これは、組織内の派閥や、個人の中のこだわり、古いしがらみなどを、一旦リセットして解消することを意味します。問題をバラバラにすることで、新たな可能性が生まれます。",
      },
      60: {
        title: "水沢節（すいたくせつ） - 賢明な自己管理",
        summary: "物事に「けじめ」をつける、賢明な自己管理。",
        points: [
          "『節』は物事が通る",
          "節度をもって制度を作り、財産を損なわず、民を害さない",
        ],
        haqei_interpretation:
          "沢の水をせき止める堰（せき）のように、物事に適切な節度（ルール、けじめ）を設けることの重要性を示します。これは、欲望のままに行動するのではなく、時間やお金、エネルギーを賢く管理することです。節度は窮屈なものではなく、むしろ無駄な浪費を防ぎ、物事をスムーズに進めるための知恵なのです。",
      },
      61: {
        title: "風沢中孚（ふうたくちゅうふ） - 真心はすべてを動かす",
        summary: "損得を超えた「真心」が、すべてを動かす。",
        points: [
          "『中孚』とは、柔（陰）が内側におり、剛（陽）が中心を得ている",
          "誠実さが豚や魚にまで及ぶ",
        ],
        haqei_interpretation:
          "鶏が卵を温めるように、内なる真心（孚）を大切に育む姿。これは、テクニックや駆け引きではなく、ただひたすら誠実であることで、人や物事、さらには動物さえも動かすことができる、という深遠な信頼の形を示します。小手先の嘘やごまかしが一切通用しない、本質が問われる時です。",
      },
      62: {
        title: "雷山小過（らいざんしょうか） - 謙虚すぎるくらいの慎重さ",
        summary: "少しだけ「やりすぎる」くらいの慎重さと謙虚さ。",
        points: [
          "『小過』とは、小さいもの（陰）が少し過ぎていることで物事が通る",
          "上に昇るべきではなく、下にいるべきだ",
        ],
        haqei_interpretation:
          "鳥が低く飛ぶように、大きな目標を掲げるのではなく、謙虚に、そして少しだけ度を過ごすくらい丁寧に、物事を進めるべき時。例えば、挨拶をする時も、いつもより少しだけ深くお辞儀をするようなイメージです。目立つ行動は凶。控えめすぎるくらいの姿勢が、かえって良い結果を生みます。",
      },
      63: {
        title: "水火既済（すいかきせい） - 完成と油断",
        summary: "すべてが整った「完成」と、その直後に始まる崩壊の兆し。",
        points: [
          "『既済（すでにわたる）』が通るのは、小さいことにおいて通る",
          "終わりに止まれば乱れる",
        ],
        haqei_interpretation:
          "水（下）と火（上）が、あるべき場所に収まり、すべてが完璧に整った「完成形」です。プロジェクトが無事に完了し、秩序が保たれている状態。しかし、この卦は「完成した瞬間から、崩壊は始まる」という厳しい真理も示しています。完成したことに安住し、油断すると、すぐに状況は乱れてしまいます。",
      },
      64: {
        title: "火水未済（かすいびせい） - 未完成という希望",
        summary: "まだ完成していない「可能性」と、最後の挑戦。",
        points: [
          "『未済（いまだわたらず）』は物事が通る",
          "『子狐がほとんど渡りきる』とは、まだ危険な中心から抜け出していないからだ",
        ],
        haqei_interpretation:
          "「既済」とは逆に、火（上にあるべき）が下に、水（下にあるべき）が上にあり、物事がまだ未完成で、混乱している状態。しかし、これは「終わり」ではなく、「完成へのプロセス」であり、希望と可能性に満ちています。子狐が川を渡りきる寸前で尾を濡らすように、最後の最後まで気を抜かずに挑戦を続けることが、成功への鍵となります。",
      },
    },
    // 小象伝（しょうしょうでん）：各爻の行動の理由
    sho_den: {
      1: {
        title: "ステージ1：まだ潜んでいる龍のように、力を蓄える時。",
        reason:
          "今はまだ、あなたが持つ強大な潜在能力を、世に示すべき時ではないからです。ここで重要なのは、自ら道を切り開く力強い本質を自覚しつつも、外には出さずに潜伏し、エネルギーを蓄えることです。",
      },
      2: {
        title: "ステージ2：龍が地上に現れ、認められる。",
        reason:
          "あなたが持つ潜在能力が、ついに適切な活躍の場を得て、その存在が公に認められたからです。この段階で、同じ志を持つ優れた師の助言を求めることで、あなたの道はさらに大きく開かれます。",
      },
      3: {
        title: "ステージ3：努力と警戒を怠らない、試練の時。",
        reason:
          "物語の前半における最後の段階であり、後半への移行期という不安定なポジションにいるからです。責任が重く、常に危険が伴うため、昼は勤勉に努力し、夜も警戒を怠らない姿勢が、この危機的な状況を乗り切る唯一の方法なのです。",
      },
      4: {
        title: "ステージ4：決断の前に、決断を保留する。",
        reason:
          "飛躍か転落か、運命の岐路に立たされているからです。トップリーダーの道も、あるいは淵に落ちる道も、あなたの力量と判断次第です。ここで軽率に行動せず、最適なタイミングを見極める必要があります。",
      },
      5: {
        title: "ステージ5：天を飛ぶ龍のように、最高の地位に。",
        reason:
          "あなたが組織や物事の最高責任者のポジションにあり、その影響力が最大化しているからです。あなたの存在そのものが規範となり、優れたリーダーシップで人々を導くことが、このステージでの天命となります。",
      },
      6: {
        title: "ステージ6：頂点を極め、行き過ぎて後悔に繋がりやすい。",
        reason:
          "これ以上昇る場所がない「行き過ぎた」状態に到達してしまったからです。どんなものでも、器が満ち溢れてしまえば、その状態を長く保つことはできない、という自然の法則が働きます。",
      },
      7: {
        title: "特別ステージ：リーダーのいない群れの龍（理想形）",
        reason:
          "ここでは、個々のリーダーシップを超越し、全ての要素が完全に調和した理想的な状態が示されています。全てのメンバーが自律的に機能し、中央集権的な支配者を必要としない究極の協働体制が実現します。",
      },
      8: {
        title: "ステージ1：小さな兆候は、やがて大きな問題に繋がるという警告。",
        reason:
          "物事を収縮・下降させるエネルギーが、「霜」という最初の具体的な形となって現れた段階だからです。この小さな兆候はやがて、無視できない大きな流れ（堅氷）へと繋がっていきます。",
      },
      9: {
        title: "ステージ2：大地の徳で、全てが好転する。",
        reason:
          "飾らないありのままの姿でいることで、周囲に安心感を与え、その徳が自然に外に現れる状態だからです。この段階では、何をしても裏目に出ることはなく、すべてが順調に進みます。",
      },
      10: {
        title: "ステージ3：才能を内に秘め、時を待つ。",
        reason:
          "優れた能力を持ちながらも、それを自ら誇示することなく、組織のために尽くしているからです。その謙虚な姿勢が、最終的に大きな成功と評価をもたらすことになります。",
      },
      11: {
        title: "ステージ4：警戒し、門を固く閉ざす。",
        reason:
          "これから起こりうる災いを事前に察知し、自らを守るために慎重に行動しているからです。ここでは、沈黙を守り、事を荒立てないことが、あなたを災いから遠ざける唯一の方法です。",
      },
      12: {
        title: "ステージ5：黄色い裳（もすそ）、最高の幸運。",
        reason:
          "謙虚さと中庸の徳を象徴する「黄色い衣服」を、内面の徳として身につけている状態だからです。その抑制の効いた美徳が、言葉なくして最大の賞賛と幸運を引き寄せます。",
      },
      13: {
        title: "ステージ6：陰陽が争い、血が流れる。",
        reason:
          "本来の柔順な領域を超えて、力強い存在と対等に争おうとしているからです。その行き過ぎた自己主張が、破壊的な闘争を引き起こし、両者が深く傷つくという悲劇的な結果を招きます。",
      },
      14: {
        title: "特別ステージ：永遠の正しさ、大いなる安定。",
        reason:
          "ここでは、陰の徳が持つ「永遠の正しさ」という究極の境地が示されています。この状態に至ることで、あなたの存在そのものが、揺るぐことのない大地のような安定の基盤となります。",
      },
      15: {
        title: "ステージ1：困難な始まり、助けを求める。",
        reason:
          "物事を生み出す最初の段階にあり、その困難さから抜け出せずにいるからです。この状況を打破するには、自分一人の力に固執せず、信頼できる仲間や組織に助けを求める姿勢が不可欠です。",
      },
      16: {
        title: "ステージ2：困難の中、進めず待つ。",
        reason:
          "進むことも退くこともできないジレンマの中にいるからです。予期せぬ誘い（女性からの求婚）も、この困難な状況がもたらす複雑さの表れです。今は耐え、好機を待ちましょう。",
      },
      17: {
        title: "ステージ3：狩りに出て獲物がない。",
        reason:
          "経験豊富な案内人なしに、未知の領域に踏み込んでしまっているからです。独力でやみくもに進んでも、徒労に終わるだけです。一度引き返し、専門家の助けを借りるべきです。",
      },
      18: {
        title: "ステージ4：協力者を得て、困難を乗り越える。",
        reason:
          "困難な状況を打開するために、複数の協力者と力を合わせようとしているからです。まだ足並みは揃っていませんが（馬がバラバラ）、この協力を目指す行動自体が正しい道です。",
      },
      19: {
        title: "ステージ5：困難の極み、涙が流れる。",
        reason:
          "最大の困難に直面し、その苦しみから涙を流しているからです。しかし、この涙は単なる悲嘆ではありません。この極限状況を乗り越えた時、あなたは大きな恵みと成長を手にします。",
      },
      20: {
        title: "ステージ6：血の涙が流れる、最悪の状況。",
        reason:
          "救いのない完全な困難の中にあり、もはや打つ手がない状態だからです。この段階では、積極的な行動はさらなる悲劇を生むだけです。状況を受け入れ、耐え忍ぶことしかできません。",
      },
      21: {
        title: "ステージ1：刑罰を受け、学ぶ時。",
        reason:
          "物語の始まりにおいて、自身の未熟さから足枷をはめられるような小さな罰を受けているからです。この初期段階での懲らしめは、将来の大きな過ちを防ぐための重要な学びとなります。",
      },
      22: {
        title: "ステージ2：師の教えを受け、成長する。",
        reason:
          "師となる人物からの指導を素直に受け入れ、自らの未熟さを克服しようとしているからです。この謙虚な学びの姿勢が、あなたを着実に成長させます。",
      },
      23: {
        title: "ステージ3：人の道に反した行動。",
        reason:
          "自らの立場や役割を忘れ、人の道に反するような行動を取ってしまっているからです。このままでは、誰からの助けも得られず、孤立を深めることになります。",
      },
      24: {
        title: "ステージ4：困難な教育、孤立する。",
        reason:
          "困難な状況に陥り、周囲から孤立しているからです。この苦しい経験は、あなたに重要な教訓を与えますが、その価値を理解してくれる人はまだいません。今は耐える時です。",
      },
      25: {
        title: "ステージ5：素直な子供のような心。",
        reason:
          "師からの教えを純粋な心で受け入れ、完全に信頼している状態だからです。この素直さこそが、学びの効果を最大化し、あなたを飛躍的な成長へと導きます。",
      },
      26: {
        title: "ステージ6：やり過ぎた教育は、反発を招く。",
        reason:
          "相手のためを思うあまり、厳しすぎる指導を行ってしまっているからです。その過剰な干渉は、相手の自立心を奪い、反発を招くだけです。手綱を緩める必要があります。",
      },
      27: {
        title: "ステージ1：待つべき時。",
        reason:
          "まだ行動を起こすべき適切なタイミングではないからです。今は焦らず、郊外で待つように、静かに状況を見守り、エネルギーを蓄えることが最善の策です。",
      },
      28: {
        title: "ステージ2：非難の中でも、心を平穏に保つ。",
        reason:
          "砂地で待つように、多少の非難や困難が伴う状況にあるからです。しかし、あなたの心は平穏であり、その小さな雑音に動揺することはありません。最終的に良い結果がもたらされます。",
      },
      29: {
        title: "ステージ3：泥中で待ち、敵の襲来を招く。",
        reason:
          "不用意に敵に近づきすぎたため、反撃を招いてしまう危険な状況だからです。自ら招いた危機であり、この経験から慎重さの重要性を学ぶ必要があります。",
      },
      30: {
        title: "ステージ4：血の中から脱出する。",
        reason:
          "一度はまった深い困難（血の穴）から、自力で脱出しようとしているからです。この段階では、まだ完全な安全は確保できていませんが、危機を脱する力は十分にあります。",
      },
      31: {
        title: "ステージ5：酒食を楽しみ、待つ。",
        reason:
          "危機を乗り越え、心からの安らぎと楽しみを取り戻しているからです。この安定した状態で正しくあり続ければ、最終的に大きな幸運が訪れます。",
      },
      32: {
        title: "ステージ6：招かれざる客、予期せぬ危機。",
        reason:
          "完全に安心しきっているところに、予期せぬ闖入者が現れ、状況が一変するからです。最後まで敬意と慎重さを失わないことが、安定を維持する秘訣です。",
      },
      33: {
        title: "ステージ1：訴訟は避けるべき。",
        reason:
          "争いごとに関わろうとしていますが、それは長引くばかりで益のないことだからです。たとえ多少の不満があっても、早い段階で和解することが、結果的に最善の選択となります。",
      },
      34: {
        title: "ステージ2：力及ばず、退却する。",
        reason:
          "相手との圧倒的な力の差を認識し、正面からの争いを避けて退却しているからです。この戦略的な撤退は、無駄な損害を防ぎ、再起の機会をうかがうための賢明な判断です。",
      },
      35: {
        title: "ステージ3：古い徳を守り、安泰。",
        reason:
          "今は争いを避け、過去から受け継いできた徳や立場を守り、静かにしている段階だからです。積極的に新しいものを求めるのではなく、今あるものを大切にすることが、あなたを危険から遠ざけ、最終的に幸運を呼び込みます。",
      },
      36: {
        title: "ステージ4：敗北を認め、運命に従う。",
        reason:
          "もはや争いに勝てないことを悟り、自らの運命を受け入れて引き返しているからです。この敗北を認める勇気が、心の平穏を取り戻し、新たな道を開くきっかけとなります。",
      },
      37: {
        title: "ステージ5：最高の訴訟、大吉。",
        reason:
          "公平で徳の高い仲裁者に判断を委ねたことで、最高の解決を得るからです。自らの正しさに固執せず、第三者の判断を受け入れることで、誰もが納得する結果がもたらされます。",
      },
      38: {
        title: "ステージ6：ベルトを奪われる、不安定な結末。",
        reason:
          "一度は争いに勝利したものの、その地位がまだ盤石ではないことを示しています。手に入れたものを一日に三度も奪われるように、その立場は常に不安定であり、気の休まる時がありません。",
      },
      39: {
        title: "ステージ1：規律が乱れ、凶事を招く。",
        reason:
          "組織の規律を守れず、その緩んだ態度が全ての始まりだからです。この最初の規律違反が、やがて組織全体を巻き込む大きな凶事へと発展していきます。",
      },
      40: {
        title: "ステージ2：リーダーとして、規律を正す。",
        reason:
          "組織の中心として、乱れた規律を正すという重要な役割を担っているからです。その権威ある行動が、組織の崩壊を防ぎ、安定を取り戻します。",
      },
      41: {
        title: "ステージ3：規律の欠如、自己嫌悪。",
        reason:
          "自らを律することができず、そのだらしなさに自己嫌悪を感じているからです。この内面的な規律の欠如が、外部からの軽蔑や非難を招く原因となります。",
      },
      42: {
        title: "ステージ4：規律正しい退却、問題なし。",
        reason:
          "困難な状況から退却する際に、規律を保ち、整然と行動しているからです。たとえ敗走であっても、その統率の取れた姿勢に、非難されるべき点はありません。",
      },
      43: {
        title: "ステージ5：規律あるリーダー、人望を集める。",
        reason:
          "規律と正義の中心にあり、その徳によって人々を感化しているからです。あなたの存在が、人々が自然に従うリーダーシップの理想像を示しています。",
      },
      44: {
        title: "ステージ6：王が規律をもって、功績を称える。",
        reason:
          "組織の創設者として、功績のあった者たちに恩賞を与え、その労をねぎらっているからです。この公平な論功行賞が、組織の結束をさらに強固なものにします。",
      },
      45: {
        title: "ステージ1：誠実さが、混乱を招く。",
        reason:
          "誠実であるがゆえに、相手との関係性に混乱を招いてしまっているからです。今は関係が入り乱れ、あなたの誠意が正しく伝わらない状況です。一度距離を置く必要があります。",
      },
      46: {
        title: "ステージ2：誠実なリーダー、幸運を引き寄せる。",
        reason:
          "誠実さをもって中心的な役割を果たしているからです。その純粋な心が、幸運な出来事（仲間との出会い）を自然に引き寄せ、物事を良い方向へと導きます。",
      },
      47: {
        title: "ステージ3：誠実さを失い、凶事を招く。",
        reason:
          "本来の誠実さを見失い、外部からの誘惑に負けてしまっているからです。伴侶を失うように、あなたは最も大切なものを失い、その結果、凶事を招くことになります。",
      },
      48: {
        title: "ステージ4：誠実さによる決断、安泰。",
        reason:
          "迷いを断ち切り、誠実な道を選ぶことで、安泰を得るからです。月が満月になろうとするように、物事は自然と良い方向へ向かいます。この決断に間違いはありません。",
      },
      49: {
        title: "ステージ5：絶対的な誠実さ、人望。",
        reason:
          "絶対的な誠実さで、周囲のあらゆるものを引きつけているからです。その魅力は、まるで王が宮殿にいるかのように、人々を自然に集わせ、安心感を与えます。",
      },
      50: {
        title: "ステージ6：誠実さの欠如、凶。",
        reason:
          "誠実さを最後まで貫き通すことができず、言葉だけが上滑りしているからです。その不誠実な態度は、最終的に凶事を招きます。今は言葉よりも行動が求められます。",
      },
      51: {
        title: "ステージ1：自らの道に戻り、幸運を得る。",
        reason:
          "一度は進むべき道から外れましたが、自らの力で正しい道へと引き返しているからです。その自己修正能力は、過ちを認める勇気の証であり、非難されるどころか幸運を引き寄せます。",
      },
      52: {
        title: "ステージ2：仲間と共に、道に戻る。",
        reason:
          "同じように道に迷った仲間を、自らの正しい道へと引き入れているからです。その強制力のない誠実な誘いが、共に良い結果へと向かうための最も自然な形となります。",
      },
      53: {
        title: "ステージ3：不和と対立、計画が頓挫する。",
        reason:
          "組織内部で深刻な対立が生じ、車輪が外れるように、物事が完全に停止してしまっているからです。今は前進しようとするよりも、まず内部の問題を解決することが先決です。",
      },
      54: {
        title: "ステージ4：誠実さで、危機を脱する。",
        reason:
          "誠実な心で恐れを克服し、信頼を得ることで、目前の危機を回避できるからです。血を流すような深刻な事態から遠ざかり、心の平穏を取り戻すことができます。",
      },
      55: {
        title: "ステージ5：富を分かち合い、人望を集める。",
        reason:
          "自らの富や成功を独占せず、周囲の仲間と分かち合う豊かさを持っているからです。その利他的な姿勢が、あなたを真のリーダーとして輝かせ、人々からの信頼を不動のものにします。",
      },
      56: {
        title: "ステージ6：目標を達成し、雨が降る。",
        reason:
          "目標が達成され、緊張から解放された安堵の状態にいるからです。しかし、月が満ちれば欠けるように、完成は同時に新たな変化の始まりでもあります。油断せず、次の展開に備える慎重さが必要です。",
      },
      57: {
        title: "ステージ1：礼儀正しく、足元を踏む。",
        reason:
          "危険な相手（虎）のすぐ後ろにいますが、礼儀正しく慎重な態度を保っているため、問題は起こらないからです。自分の立場をわきまえ、謙虚に行動することが、今は身を守る最善の策です。",
      },
      58: {
        title: "ステージ2：平坦な道を、安らかに進む。",
        reason:
          "俗世から離れた隠者のように、心穏やかに自らの道を歩んでいるからです。その落ち着いた姿勢と精神的な充足が、何事もなく安泰な日々をもたらしています。",
      },
      59: {
        title: "ステージ3：片目で見て、足を引きずる危険な状態。",
        reason:
          "能力が不十分であるにも関わらず、無理に前進しようとしているため、非常に危険な状態だからです。その無謀な行動は、虎に尾を踏まれるように、必ず手痛い反撃を招くことになります。",
      },
      60: {
        title: "ステージ4：虎の尾を踏むも、幸運が訪れる。",
        reason:
          "非常に危険な状況にありながらも、その慎重で誠実な人柄が、かえって幸運を引き寄せているからです。最終的には、あなたの願いは成就します。",
      },
      61: {
        title: "ステージ5：危険な決断、しかし道は正しい。",
        reason:
          "非常に危険な決断を迫られていますが、その道が道理に適っていることを、あなたは確信しているからです。この覚悟ある決断が、最終的に状況を好転させます。",
      },
      62: {
        title: "ステージ6：これまでの道を振り返り、未来を占う。",
        reason:
          "これまでの全ての経験を振り返り、自らの行いが正しかったかを内省している段階だからです。その深い自己分析が、未来の吉凶を見通すための重要な指針となります。",
      },
      63: {
        title: "ステージ1：仲間と共に、新たな始まり。",
        reason:
          "新しいプロジェクトや関係性が、同じ志を持つ仲間たちと共に始まる素晴らしい段階だからです。その繋がりは、まるで根で結ばれた茅のように強固であり、共に行動することで、大きな成功が約束されています。",
      },
      64: {
        title: "ステージ2：中庸の徳、大いなる川を渡る。",
        reason:
          "偏見や私情にとらわれず、常に中立で公平な視点を保っているからです。そのバランス感覚が、仲間をまとめ、大きな目標（大河を渡る）を達成するための推進力となります。",
      },
      65: {
        title: "ステージ3：平穏は去り、困難が訪れる。",
        reason:
          "これまでの順調な状況が一変し、平穏が困難へと転じる過渡期にあるからです。どんなに安定した状況も、永遠には続かないという自然の摂理を、あなたは今まさに経験しています。",
      },
      66: {
        title: "ステージ4：誠実さで、下の者と心を通わせる。",
        reason:
          "驕ることなく、誠実な心で下の者たちと向き合っているからです。その謙虚な姿勢が、身分の違いを超えた信頼関係を築き、組織全体に一体感をもたらします。",
      },
      67: {
        title: "ステージ5：最高の婚姻、大いなる幸運。",
        reason:
          "最高の立場にある者が、謙虚に下の者と結ばれるという、理想的なパートナーシップが成立したからです。この身分違いの婚姻が、国全体に大きな幸運と安定をもたらします。",
      },
      68: {
        title: "ステージ6：城壁が崩れ落ちる、警告の時。",
        reason:
          "これまでの幸運な状況が終わりを告げ、城壁が堀に崩れ落ちるように、衰退が始まったからです。もはや積極的な行動は裏目に出ます。運命を受け入れ、静かに時を待つしかありません。",
      },
      69: {
        title: "ステージ1：自らの力で、仲間を助ける。",
        reason:
          "仲間が困難な状況にあるのを見て、自らの力で助け出そうとしているからです。しかし、あなたの力だけでは不十分であり、その行動は無駄に終わる可能性があります。今は自分の力を過信すべきではありません。",
      },
      70: {
        title: "ステージ2：馬を助け、力を尽くす。",
        reason:
          "自分自身の力だけでは限界があることを悟り、仲間（馬）の助けを借りて、状況の好転に全力を尽くしているからです。この協力的な姿勢が、最終的に良い結果をもたらします。",
      },
      71: {
        title: "ステージ3：敵の罠、警戒が必要。",
        reason:
          "目の前に獲物がいるように見えますが、それは敵が仕掛けた罠だからです。ここで欲を出すと、茂みに隠れた敵の兵士たちに囲まれ、深刻な事態に陥ります。慎重な判断が必要です。",
      },
      72: {
        title: "ステージ4：仲間との協力、問題なし。",
        reason:
          "同じ目的を持つ仲間と力を合わせることで、困難な状況を乗り越えようとしているからです。その協力関係は本物であり、共に進むことで、非難されることは何もありません。",
      },
      73: {
        title: "ステージ5：仲間を信頼し、大きな獲物を逃す。",
        reason:
          "仲間を信頼し、大きな獲物を追う役割を任せましたが、結果的にそれを逃してしまうからです。しかし、その信頼に基づいた行動自体に間違いはなく、最終的に問題とはなりません。",
      },
      74: {
        title: "ステージ6：天に昇る、大きな成功。",
        reason:
          "これまでの全ての努力が報われ、公の場で大きな成功を収める段階だからです。それはまるで、天に昇るように輝かしく、誰からも賞賛される成果です。",
      },
      75: {
        title: "ステージ1：野原での共同作業、問題なし。",
        reason:
          "身分や立場の違いを超えて、多くの人々とオープンな場で協力し合っているからです。その公平で開かれた姿勢が、物事をスムーズに進ませ、非難されることはありません。",
      },
      76: {
        title: "ステージ2：派閥を作らず、中立を保つ。",
        reason:
          "徒党を組むことなく、常に中立的な立場を保っているからです。その公平な態度は、一部からは非難されるかもしれませんが、長い目で見れば最も賢明な選択です。",
      },
      77: {
        title: "ステージ3：敵の罠、3年勝てず。",
        reason:
          "茂みに兵を伏せるように、相手を打ち破る機会をうかがっていますが、敵もまた強大であり、3年間は勝利できないことを示唆しています。短期的な勝利に固執せず、長期的な視点を持つことが重要です。",
      },
      78: {
        title: "ステージ4：城壁を攻めるも、攻めきれず。",
        reason:
          "勝利を目前にしながらも、あと一歩のところで攻めきれずにいる、もどかしい状況だからです。これは、あなたの力が及ばないのではなく、まだ天の時が来ていないことを示しています。",
      },
      79: {
        title: "ステージ5：涙の後の笑い、ついに勝利。",
        reason:
          "多くの困難と苦しみを乗り越え、涙を流すほどの経験を経て、ついに大きな勝利を手にするからです。この勝利は、これまでの全ての苦労が報われる、感動的な瞬間です。",
      },
      80: {
        title: "ステージ6：郊外での再会、祝福。",
        reason:
          "一度は敵対した者たちが、戦いを終えて郊外で再会し、互いを認め合っているからです。この和解と祝福の光景は、物語の美しい結末を示しています。",
      },
      81: {
        title: "ステージ1：飾らないこと、最も美しい。",
        reason:
          "多くのものが不足している質素な状況ですが、その飾らないありのままの姿にこそ、真の美しさが宿っているからです。物質的な豊かさではなく、精神的な充足がこのステージのテーマです。",
      },
      82: {
        title: "ステージ2：わずかな捧げもの、誠意が伝わる。",
        reason:
          "捧げものはわずかですが、そこに込められた誠意は本物だからです。財産の多寡ではなく、心のあり方が重要であることを、このステージは教えています。",
      },
      83: {
        title: "ステージ3：神聖な儀式、問題なし。",
        reason:
          "天地自然の恵みに対して、最高の敬意と感謝を捧げるという、神聖な儀式を行っているからです。その敬虔な心で行動する限り、咎められることはありません。",
      },
      84: {
        title: "ステージ4：誠実さによる援助、幸運。",
        reason:
          "下の立場にある者が、上の立場の者の危機を誠実な心で助けるからです。その身分を超えた信頼関係が、両者に幸運をもたらし、物事を良い方向へ導きます。",
      },
      85: {
        title: "ステージ5：誠実なリーダーシップ、人望。",
        reason:
          "誠実で豊かな徳を持ちながらも、驕ることなく、人々を導いているからです。その謙虚で力強いリーダーシップが、人々からの絶大な信頼と人望を集めています。",
      },
      86: {
        title: "ステージ6：天の助け、大いなる幸運。",
        reason:
          "これまでの全ての行いが天に認められ、大いなる助けと幸運がもたらされる、最高の段階だからです。あなたの徳が、自然の摂理と完全に一致したことを示しています。",
      },
      87: {
        title: "ステージ3：労苦と謙遜、最後には報われる。",
        reason:
          "大きな功績を上げながらも、その労を一切誇示せず、謙虚な姿勢を貫いているからです。その誠実な働きぶりを、人々も天も見過ごすことはありません。今は苦労が多くとも、最後には必ず大きな幸運がもたらされます。",
      },
      88: {
        title: "ステージ4：自分の役割を果たし、問題なし。",
        reason:
          "自らの能力や立場を正しく認識し、その役割を適切に果たしているからです。その自己認識の正しさが、あなたを過ちから遠ざけ、非難されることのない安定した状況をもたらします。",
      },
      89: {
        title: "ステージ5：富を誇示せず、隣人と分かち合う。",
        reason:
          "豊かでありながらも、それを誇示することなく、むしろ周囲の人々と分かち合おうとしているからです。その謙虚で利他的な姿勢が、真の人望を集め、侵略者からも身を守ります。",
      },
      90: {
        title: "ステージ6：謙虚さの表明、軍隊を動かす。",
        reason:
          "謙虚さという徳を、今度は自国や自分の街を守るという、積極的な行動へと転換しているからです。その正義に基づいた断固たる姿勢は、軍隊を動かすほどの正当性を持っています。",
      },
      91: {
        title: "ステージ1：喜びの表明、幸運。",
        reason:
          "指導者として、人々が安心して楽しめる状況を自ら作り出しているからです。その喜びを分かち合う姿勢が、組織全体に活気をもたらし、幸運を引き寄せます。",
      },
      92: {
        title: "ステージ2：岩のように固い意志。",
        reason:
          "外部からの誘惑や快楽に対して、岩のように固い意志で自らを律しているからです。その自己制御能力は、一日も経たないうちに、良い結果となって現れます。",
      },
      93: {
        title: "ステージ3：媚びへつらう喜び、凶。",
        reason:
          "本来の自分を見失い、他者に媚びへつらうことで、偽りの喜びを得ようとしているからです。その卑屈な態度は、必ず凶事を招きます。",
      },
      94: {
        title: "ステージ4：喜びを計算し、安泰を得る。",
        reason:
          "どの喜びを追求し、どの喜びを捨てるべきかを冷静に計算し、決断しているからです。その理性的な判断力が、心の病（憂い）を取り除き、安泰な状態をもたらします。",
      },
      95: {
        title: "ステージ5：敵からの分離、危険が迫る。",
        reason:
          "あなたのすぐ近くに、信頼できない危険な人物がいるからです。その腐敗した要素を放置すれば、いずれあなた自身に危険が及ぶことになります。すぐに関係を断つべきです。",
      },
      96: {
        title: "ステージ6：引き込まれる喜び。",
        reason:
          "他者の喜びや楽しげな雰囲気に、自然と引き込まれていく状態だからです。この段階では、自らが主導するのではなく、周囲の流れに身を任せることが、最も自然な選択となります。",
      },
      97: {
        title: "ステージ5：病が長引くも、死なず。",
        reason:
          "喜びや楽しみに溺れるという病が、長期間続いている状態だからです。その不健全な状態は、あなたを蝕んでいますが、まだ生命を失うほどの致命的な状況には至っていません。",
      },
      98: {
        title: "ステージ6：暗闇の中で、意識を改める。",
        reason:
          "喜びの祭りが終わり、暗闇の中でようやく間違いに気づいた段階だからです。もしこの段階で意識を改め、生き方を変えるならば、大きな過ちには至りません。",
      },
      99: {
        title: "ステージ1：状況の変化に、柔軟に対応する。",
        reason:
          "これまで準拠してきた基準やルールが、根本から変化する状況にあるからです。古い常識に固執せず、門を出て新しい人々と交わることで、この変化の波に乗り、成功を収めることができます。",
      },
      100: {
        title: "ステージ2：目先の利益に囚われ、大切なものを失う。",
        reason:
          "目先の小さな利益（子供）に心を奪われ、本来付き従うべき大きな存在（大人）を見失っているからです。短期的な誘惑に負けると、長期的に見てより価値のあるものを失うことになります。",
      },
      101: {
        title: "ステージ3：大きな流れに従い、小さなものを捨てる。",
        reason:
          "より大きな目的（大人）に従うために、これまでの小さな繋がり（子供）から離れる決断を迫られているからです。この決断は、あなたがより高い次元の目標に向かうために不可欠なプロセスです。",
      },
      102: {
        title: "ステージ4：誠意がなくても、付き従う者がいれば利益がある。",
        reason:
          "あなたの下にいる者たちが、たとえ不誠実な動機であっても、あなたに従うことで利益を得る状況だからです。その結果、あなたの立場は強化されますが、その関係性の本質を見極める必要があります。",
      },
      103: {
        title: "ステージ5：優れたものを信じ、従う。",
        reason:
          "優れた人物や理念（嘉）の価値を心から信じ、それに誠実に従っているからです。その純粋な信頼が、あなた自身を徳の高い存在へと引き上げ、幸運をもたらします。",
      },
      104: {
        title: "ステージ6：雁字搦めの状態、王も認める。",
        reason:
          "複雑な人間関係や状況に深く縛りつけられ、もはや自分一人の力では抜け出せない状態だからです。その誠実さを最高指導者である王も認めており、この状況を打開するための儀式を行うでしょう。",
      },
      105: {
        title: "ステージ1：腐敗の始まり、意識を改める。",
        reason:
          "長い間放置されてきた問題が、腐敗の始まりとして表面化してきた段階だからです。父が遺した問題を子が解決するように、過去の惰性を断ち切り、意識を根本から改める強い意志が求められます。",
      },
      106: {
        title: "ステージ2：過去の腐敗、力ではなく柔軟さで正す。",
        reason:
          "過去の世代が遺した問題（母の蠱）を、力で矯正するのではなく、柔軟なアプローチで解決しようとしているからです。強硬な手段は反発を招くだけであり、中庸の徳を保つことが重要です。",
      },
      107: {
        title: "ステージ3：性急な改革、小さな後悔。",
        reason:
          "過去の問題を性急に改革しようとするあまり、多少のやり過ぎが生じてしまっているからです。その積極性は評価できますが、小さな後悔や反省は避けられません。しかし、大きな問題には至りません。",
      },
      108: {
        title: "ステージ4：腐敗の放置、大きな過ち。",
        reason:
          "対処すべき問題を放置し、その腐敗が手のつけられない状態になっているからです。この怠慢は、あなたの評価を著しく下げ、大きな後悔に繋がります。",
      },
      109: {
        title: "ステージ5：徳による改革、称賛を得る。",
        reason:
          "力ではなく、徳と名誉をもって、過去から続く問題を根本的に解決しているからです。その優れた手腕は、父の跡を継ぐ子のように、周囲から大きな称賛と評価を得ることになります。",
      },
      110: {
        title: "ステージ6：世俗を超越し、高潔に生きる。",
        reason:
          "もはや世俗的な事柄には関わらず、自らの精神性を高めることに専念している、孤高の聖人の段階だからです。王侯に仕えるのではなく、自らの道を高潔に歩むことを選択しています。",
      },
      111: {
        title: "ステージ1：慈愛に満ちたリーダーシップの始まり。",
        reason:
          "慈愛に満ちた心で、人々や物事に接し始める段階だからです。その影響力はまだ限定的ですが、その姿勢そのものが正しく、幸운な結果をもたらします。",
      },
      112: {
        title: "ステージ2：慈愛と責任感、大いなる幸運。",
        reason:
          "慈愛の心と、自らの責任を全うする強い意志が組み合わさっている、理想的な状態だからです。そのバランスの取れたリーダーシップが、天からの助けをも引き寄せ、大いなる幸運に繋がります。",
      },
      113: {
        title: "ステージ3：甘い顔をするリーダー、後悔する。",
        reason:
          "リーダーとしての厳しさを欠き、単に甘い顔をしてしまうことで、長期的な問題の種を蒔いているからです。その場限りの優しさは、いずれ後悔する結果を招きます。",
      },
      114: {
        title: "ステージ4：公平な姿勢、問題なし。",
        reason:
          "私情を挟まず、誰に対しても公平な態度で接しているからです。その公正な姿勢が、あなたの周りに健全な秩序をもたらし、咎められることはありません。",
      },
      115: {
        title: "ステージ5：王の徳、心配は不要。",
        reason:
          "王のような絶対的なリーダーが、慈愛に満ちた徳で全てを包み込んでいるからです。その太陽のような存在の前では、病が癒えるように、いかなる心配事も自然と消え去っていきます。",
      },
      116: {
        title: "ステージ6：慈愛の徳が、内側から現れる。",
        reason:
          "慈愛に満ちた徳が、もはや意識せずとも、あなたの内側から自然に溢れ出している状態だからです。その豊かな人間性が、周囲の人々を深く感化します。",
      },
      117: {
        title: "ステージ1：子供の視点、問題なし。",
        reason:
          "まだ物事の全体像が見えていない、子供のような視点を持っているからです。その無邪気さや未熟さは、この初期段階においては、咎められるべきものではありません。",
      },
      118: {
        title: "ステージ2：閉ざされた視点、凶事を招く。",
        reason:
          "扉の隙間から覗くように、非常に偏った、閉鎖的な視点でしか物事を捉えられていないからです。その歪んだ認識が、凶事を招く直接的な原因となります。",
      },
      119: {
        title: "ステージ3：自分自身の状況が見えていない。",
        reason:
          "周囲の状況は観察できていますが、肝心な自分自身の姿や立場が見えていない状態だからです。その客観性の欠如が、あなたの判断を誤らせ、自らの足元をすくわれるような致命的な失敗に繋がります。",
      },
      120: {
        title: "ステージ4：公の立場から、状況を観察する。",
        reason:
          "国の光を見るように、個人的な視点ではなく、公の、より高い立場から物事を観察しているからです。その広い視野が、国全体の利益に繋がるような有益な洞察をもたらします。",
      },
      121: {
        title: "ステージ5：自己の内省、問題なし。",
        reason:
          "他者の動向ではなく、自分自身の人生や内面を深く見つめ直しているからです。その内省的な姿勢は、徳の高い人物の行いとして、非難されるべきものではありません。",
      },
      122: {
        title: "ステージ6：他者の人生を観察し、内省する。",
        reason:
          "自分自身だけでなく、広く人々の生き様を観察し、そこから普遍的な教訓を学んでいる、賢者の段階だからです。その深い洞察が、あなたに咎めのない安らかな境地をもたらします。",
      },
      123: {
        title: "ステージ1：障害物を噛み砕く、問題なし。",
        reason:
          "物語の始まりにおいて、行く手を阻む小さな障害物を、力強く噛み砕いている段階だからです。この初期段階での積極的な問題解決は、今後の道を切り開く上で、咎められることはありません。",
      },
      124: {
        title: "ステージ2：柔らかな問題、しかし深く刺さる。",
        reason:
          "肉のように柔らかな問題に深く鼻先を突っ込んでしまい、抜け出せなくなっているからです。一見簡単そうに見える問題ほど、慎重な対処が必要であることを、このステージは教えています。",
      },
      125: {
        title: "ステージ3：古い問題、毒にあたる。",
        reason:
          "過去から残された塩漬けの干し肉のように、古くて質の悪い問題に手を出してしまっているからです。それは僅かな毒を含んでおり、小さな問題を引き起こしますが、大きな咎めはありません。",
      },
      126: {
        title: "ステージ4：困難な問題を解決し、利益を得る。",
        reason:
          "骨付きの干し肉を噛み砕くように、非常に困難で硬い問題に取り組んでいるからです。この困難な仕事を着実にやり遂げることで、あなたは金銭的な利益と、問題を解決するための鋭い知恵（金の矢）の両方を手にします。",
      },
      127: {
        title: "ステージ5：乾いた黄金、危険を認識する。",
        reason:
          "黄金のように価値はあるものの、非常に硬く、扱いづらい問題に取り組んでいるからです。この問題は、正しくあり続けることで利益を得られますが、同時に危険も伴うことを常に認識しておく必要があります。",
      },
      128: {
        title: "ステージ6：罰を受け、耳が聞こえなくなる。",
        reason:
          "これまでの全ての行いの結果として、首枷をはめられるほどの大きな罰を受けているからです。その罰の重さによって、あなたは耳が聞こえなくなるほど、反省し、内面を見つめ直すことを余儀なくされます。",
      },
      129: {
        title: "ステージ1：飾るべきか、飾らざるべきか。",
        reason:
          "自らの足元を飾るべきか、それとも乗り物（車）を捨てて歩むべきか、という選択を迫られているからです。これは、外面的な体裁を整えるか、内面的な実質を重んじるか、という生き方の根本的な問いです。",
      },
      130: {
        title: "ステージ2：あごひげを飾り、上の存在に従う。",
        reason:
          "自分の力だけで進むのではなく、あごひげを整えるように、自らを補佐的な立場に置き、上の存在と共に行動しているからです。この協調的な姿勢が、物事をスムーズに進めます。",
      },
      131: {
        title: "ステージ3：濡れ輝く、永遠の幸運。",
        reason:
          "飾り立てた姿が、雨に濡れて艶やかに輝いているように、あなたの魅力や徳が最高の状態で発揮されているからです。この潤いに満ちた状態を保ち続ければ、永遠の幸運が約束されます。",
      },
      132: {
        title: "ステージ4：質素な姿、疑念の後の喜び。",
        reason:
          "白い馬が飛んでくるように、質素でありながらも誠実な求婚者が現れる状況だからです。最初は疑念を抱くかもしれませんが、最終的には誠実なパートナーシップを結ぶことになります。",
      },
      133: {
        title: "ステージ5：質素な贈り物、しかし心は豊か。",
        reason:
          "丘の上の庭園のように質素な場所にありますが、そこからの贈り物は、心がこもっているため、非常に価値が高いからです。物質的な乏しさは、精神的な豊かさによって補われ、最終的に幸運を得ます。",
      },
      134: {
        title: "ステージ6：飾らないこと、究極の美。",
        reason:
          "全ての装飾を取り払い、飾らないありのままの姿に至った、究極の境地だからです。この本質的な美しさの前では、いかなる言葉も不要となります。",
      },
      135: {
        title: "ステージ1：土台が崩れ始める、危険な兆候。",
        reason:
          "寝台の足が剥ぎ取られるように、物事の土台が静かに崩れ始めている段階です。まだ直接的な被害はありませんが、この危険な兆候を放置すれば、やがて全体が崩壊します。",
      },
      136: {
        title: "ステージ2：寝台の本体を剥ぎ落とされる。",
        reason:
          "危機が進行し、土台だけでなく、物事の本体そのものが侵食され始めているからです。共に助け合う仲間がいないために孤立し、さらに危機的な状況に陥っています。",
      },
      137: {
        title: "ステージ3：仲間から離れ、難を逃れる。",
        reason:
          "このステージでは、崩壊を進める集団の論理から離反することが求められるからです。不健全な仲間との関係を断ち切ることで、あなたは唯一残ったリーダーと繋がり、崩壊を免れることができます。",
      },
      138: {
        title: "ステージ4：肌にまで及ぶ、差し迫った危機。",
        reason:
          "これまであなたを守っていた土台が完全に剥ぎ落とされ、その身一つで危機に直接晒されているからです。もはや言い訳は通用せず、問題はあなたの肌身に直接突きつけられています。",
      },
      139: {
        title: "ステージ5：魚の群れを率いるように、危機を乗り越える。",
        reason:
          "宮中の女官を率いる魚のように、危険な状況下でリーダーシップを発揮しているからです。下の者たちからの寵愛を受け、一致団結することで、この困難な状況を乗り越えることができます。",
      },
      140: {
        title: "ステージ6：大きな果実、究極の結末。",
        reason:
          "全ての陰が剥ぎ落とされ、一つの陽が大きな果実として残る、物語の結末だからです。未熟な者にとっては災いでも、徳の高い人にとっては、これまでの全ての困難が報われる最高の成果となります。",
      },
      141: {
        title: "ステージ1：すぐに引き返す、過ちを改める。",
        reason:
          "道からわずかに外れた初期段階で、自ら過ちに気づき、すぐに引き返すことができるからです。この迅速な自己修正が、大きな失敗を未然に防ぎ、あなたの徳の高さを証明します。",
      },
      142: {
        title: "ステージ2：静かに立ち返り、幸運を得る。",
        reason:
          "自らの意思で、華々しくなく、静かに善の道へ立ち返ることを選択したからです。誰かに強制されるのではなく、自発的に善を選ぶその姿勢が、周囲からの深い信頼と幸運に繋がります。",
      },
      143: {
        title: "ステージ3：頻繁に過ちを繰り返す、危うい状態。",
        reason:
          "過ちと反省を何度も繰り返している、非常に不安定な状態だからです。その一貫性のない態度は、あなた自身の信頼を損ない、恥をかく結果を招きます。根本的な自己変革が必要です。",
      },
      144: {
        title: "ステージ4：一人だけ、正しい道を行く。",
        reason:
          "周囲の者たちが皆、道を誤っている中で、あなた一人だけが正しい道を歩んでいるからです。その孤高の姿勢は、困難を伴いますが、最終的に咎められることはありません。",
      },
      145: {
        title: "ステージ5：力強く立ち返り、後悔なし。",
        reason:
          "リーダーとして、力強く、そして堂々と正しい道に立ち返ることを宣言しているからです。その迷いのない決断力が、過去の過ちを完全に清算し、後悔の念を消し去ります。",
      },
      146: {
        title: "ステージ6：道を誤り、大きな災いを招く。",
        reason:
          "道を間違えているにも関わらず、軍隊を動かすように、その誤った道を進み続けているからです。その頑なな態度は、最終的に国主をも巻き込む、大きな災いを引き起こします。",
      },
      147: {
        title: "ステージ1：無心で進めば、幸運が訪れる。",
        reason:
          "純粋で無心な状態で物事を始める、素晴らしい段階だからです。この時点では、計算や私心を挟まず、自然な衝動に従って進むことで、最良の結果がもたらされます。",
      },
      148: {
        title: "ステージ2：見返りを期待せず、行動する。",
        reason:
          "まだ収穫の時期ではありませんが、あなたは目の前の仕事に誠実に取り組んでいます。行動の結果に一喜一憂せず、ただ黙々と徳を積むその姿勢が、未来の大きな実りへと繋がります。",
      },
      149: {
        title: "ステージ3：予期せぬ災難、しかし誰のせいでもない。",
        reason:
          "あなたが何も悪いことをしていないにも関わらず、通りすがりの牛が繋がれるように、不可抗力的な災難に巻き込まれているからです。これはあなたの責任ではありません。状況を受け入れ、時が過ぎるのを待つのが賢明です。",
      },
      150: {
        title: "ステージ4：正しい道、問題なし。",
        reason:
          "あなたが正しい道を着実に歩んでおり、その信念に一切の揺らぎがないからです。その確固たる姿勢を保ち続ける限り、咎められることは何もありません。",
      },
      151: {
        title: "ステージ5：予期せぬ病、薬は不要。",
        reason:
          "予期せぬ小さな問題（病）が発生しますが、それは薬に頼るまでもなく、自然に快方へ向かうからです。これは、あなたが本来持っている自己治癒力や問題解決能力を信頼すべきだというメッセージです。",
      },
      152: {
        title: "ステージ6：行き過ぎた行動、災いを招く。",
        reason:
          "状況がもはやこれまで通りではないことに気づかず、無邪気に行動し続けているからです。その無自覚な前進が、かえって身を滅ぼす災いを招くことになります。立ち止まるべき時です。",
      },
      153: {
        title: "ステージ1：危険を前に、進むのを止める。",
        reason:
          "行く手に明らかな危険（山）を察知し、自らの意志で前진を止めているからです。その理性的な自制心が、あなたを大きな災いから守り、将来の飛躍のためのエネルギーを蓄えさせます。",
      },
      154: {
        title: "ステージ2：車軸を外し、強制的に止まる。",
        reason:
          "自らの意志だけでは前進したいという誘惑を断ち切れないため、車軸を外すように、物理的に進めない状況を自ら作り出しているからです。この強制的な停止が、あなたの安全を確保します。",
      },
      155: {
        title: "ステージ3：名馬のように、従う者を導く。",
        reason:
          "優れたリーダーが、統率の取れたチーム（馬の群れ）を率いて、一致団結して目標に向かっているからです。その力強い前進は、日々の鍛錬と正しい目標設定の賜物です。",
      },
      156: {
        title: "ステージ4：幼い牛の角に枷をはめる。",
        reason:
          "まだ未熟でコントロール不能な力（幼い牛の角）が暴走しないよう、早期に適切な制限（枷）を設けているからです。この賢明な予防措置が、将来の大きな災いを未然に防ぎます。",
      },
      157: {
        title: "ステージ5：去勢された豚の牙、幸運。",
        reason:
          "最も危険で攻撃的な力（牙）を、去勢するように、根本から無力化しているからです。その徹底したリスク管理能力が、あなたに大きな幸運をもたらします。",
      },
      158: {
        title: "ステージ6：天の道、大いなる成功。",
        reason:
          "これまでの全ての努力と自制が天に認められ、何の障害もなく、天の道そのものを進んでいるような、究極の境地に至ったからです。その姿は、誰にも妨げられることのない大いなる成功の象徴です。",
      },
      159: {
        title: "ステージ1：自分を捨て、他者のために。",
        reason:
          "自分自身の利益やプライドを捨て、他者や全体の利益のために、心と体を捧げているからです。その自己犠牲の精神が、あなたの人間的な器を大きく広げます。",
      },
      160: {
        title: "ステージ2：自分の立場をわきまえず、凶。",
        reason:
          "自分自身の立場（腹）をわきまえず、本来は指導者の領域である顔（上）にまで口出ししようとしているからです。その越権行為は、必ず凶事を招きます。",
      },
      161: {
        title: "ステージ3：養うべきでないものを養い、凶。",
        reason:
          "本来の目的や道を忘れ、養うべきでないもの（不健全な欲望や関係）にエネルギーを注いでいるからです。その間違った選択を続ける限り、あなたは3年間、何も得ることができません。",
      },
      162: {
        title: "ステージ4：獲物を狙う虎、問題なし。",
        reason:
          "獲物を狙ってじっと見下ろす虎のように、注意深く、そして力強く、養うべき対象を見守っているからです。その鋭い視線と集中力が、あなたを咎めのない安定した状態へと導きます。",
      },
      163: {
        title: "ステージ5：他者の助けを借り、事を成す。",
        reason:
          "自分一人の力では大きな事を成し遂げられないことを自覚し、優れた他者の助けを借りているからです。しかし、その助けに依存しすぎると、いずれ限界が訪れます。最終的には自立が必要です。",
      },
      164: {
        title: "ステージ6：全ての者を養う、大いなる責任。",
        reason:
          "全ての者を養うという、非常に大きな責任と危険を伴う立場にいるからです。この重責を自覚し、慎重に行動することで、最終的に大きな幸運がもたらされます。",
      },
      165: {
        title: "ステージ1：足元の土台を固める。",
        reason:
          "大きな目標（大過）を前に、まずは自分の足元にある土台を慎重に固めているからです。白い茅を敷くように、丁寧で敬虔な準備が、これからの困難な道を支える基盤となります。",
      },
      166: {
        title: "ステージ2：古いものとの再生。",
        reason:
          "枯れた楊が新しい芽を出すように、一度は終わった、あるいは年老いた関係性から、予期せぬ新しい可能性が生まれているからです。この意外な組み合わせが、あなたに利益をもたらします。",
      },
      167: {
        title: "ステージ3：棟木がたわむ、限界状態。",
        reason:
          "屋根を支える最も重要な柱（棟木）が、重さに耐えきれずにたわんでいる、限界的な状況だからです。このままでは、建物全体が崩壊する危険があります。",
      },
      168: {
        title: "ステージ4：棟木が補強され、安定する。",
        reason:
          "限界だった棟木が、下の者からの適切なサポートによって補強され、安定を取り戻したからです。この上下の協力関係が、組織全体の危機を救い、恥をかくことを防ぎます。",
      },
      169: {
        title: "ステージ5：枯れた木に花が咲く。",
        reason:
          "枯れた楊に花が咲くように、もはや可能性がないと思われていた状況から、美しい成果が生まれているからです。しかし、その花は一時的なものであり、長続きはしません。",
      },
      170: {
        title: "ステージ6：危険を顧みず、人々を救う。",
        reason:
          "自分自身の危険を顧みず、人々を救うために無謀な行動に出ているからです。その行為は自らを滅ぼすほどの危険を伴いますが、その自己犠牲の精神に、非難されるべき点はありません。",
      },
      171: {
        title: "ステージ1：困難に慣れ、さらに深い困難へ。",
        reason:
          "困難な状況に慣れてしまい、無自覚にさらに深い危険へと足を踏み入れているからです。危険に対する感性が麻痺しており、このままでは抜け出すことができなくなります。",
      },
      172: {
        title: "ステージ2：困難の中で、わずかな救いを求める。",
        reason:
          "次から次へと困難が襲ってくる中で、わずかな救い（小さな円盤）を必死に求めているからです。しかし、今はまだ本格的な解決には至らず、小さな成功を得るに留まります。",
      },
      173: {
        title: "ステージ3：進退窮まり、八方塞がり。",
        reason:
          "前も後ろも、そして横も、全てが困難な壁で塞がれ、完全な八方塞がりの状態に陥っているからです。今は下手に動かず、ただその場で救助を待つしかありません。",
      },
      174: {
        title: "ステージ4：協力し合い、困難を乗り切る。",
        reason:
          "樽と甕という簡素な道具を使い、仲間と協力し合うことで、困難な状況をなんとか乗り切ろうとしているからです。その質素で誠実な協力関係が、最終的にあなたを災いから守ります。",
      },
      175: {
        title: "ステージ5：困難の中心、水が満ち始める。",
        reason:
          "困難の真っ只中にいますが、水が満ちて平らになるように、状況はこれ以上悪化せず、安定に向かい始めているからです。この中心点を乗り越えれば、問題は解決へと向かいます。",
      },
      176: {
        title: "ステージ6：縛られ、茨の道を行く。",
        reason:
          "黒い縄で縛られ、茨の茂みの中に囚われているように、自由を完全に失い、身動きが取れない状態だからです。3年間はこの苦しい状況が続きますが、最終的に道を見失うことはありません。",
      },
      177: {
        title: "ステージ1：始まりの輝き、しかし闇に落ちる。",
        reason:
          "朝日が昇るように、物事が華々しく始まったものの、すぐに日食のようにその輝きが失われてしまうからです。最初の勢いに幻惑されず、現実を冷静に見つめる必要があります。",
      },
      178: {
        title: "ステージ2：大きな光、リーダーの出現。",
        reason:
          "日中の太陽のように、強い光があなたの足元を照らしているからです。この状況は、信頼できる強力なリーダーや協力者が現れることを示唆しています。疑念を捨て、その導きに従うべきです。",
      },
      179: {
        title: "ステージ3：夕暮れの光、老いの嘆き。",
        reason:
          "夕日のように、勢いが衰え、終わりが近づいている状況だからです。大きな器を叩いて歌うのは、過ぎ去った栄光を嘆く老人の姿であり、新たな創造は期待できません。",
      },
      180: {
        title: "ステージ4：突然の輝き、しかしすぐに消える。",
        reason:
          "突然現れた強い光によって、これまで隠されていた問題が照らし出されているからです。その輝きは長続きせず、すぐに闇に帰します。一時的な勢いに惑わされてはいけません。",
      },
      181: {
        title: "ステージ5：涙の後の輝き、大いなる幸運。",
        reason:
          "深い悲しみや憂いを乗り越え、涙の後に、ようやく本来の輝きを取り戻したからです。その経験によって人間的な深みを増したあなたの姿が、周囲に感化を与え、大いなる幸運を引き寄せます。",
      },
      182: {
        title: "ステージ6：輝きを失い、自滅する。",
        reason:
          "本来の輝きを完全に失い、自ら定めた規律（家）を焼き払うように、自滅的な行動を取っているからです。その態度は、リーダーとしての資格を完全に失わせるものです。",
      },
      183: {
        title: "ステージ1：足の指への感応。",
        reason:
          "物事の始まりにおいて、足の親指に微かな感応（心の動き）を感じ取っている段階だからです。その初期衝動はまだ弱く、具体的な行動に移すにはエネルギーが不足しています。",
      },
      184: {
        title: "ステージ2：ふくらはぎへの感応、凶。",
        reason:
          "ふくらはぎに感応が起こり、衝動的に動き出したいという欲求に駆られているからです。しかし、この段階で動くのは尚早であり、凶事を招きます。じっと待つことが求められます。",
      },
      185: {
        title: "ステージ3：太ももへの感応、進むのは凶。",
        reason:
          "太ももに感応が起こり、衝動的に前進したいという強い欲求に駆られていますが、それはあなたを誤った道へと導くからです。その衝動に従うのではなく、本来従うべきリーダーと共に行動すべきです。",
      },
      186: {
        title: "ステージ4：後悔なき感応、幸運。",
        reason:
          "あなたの心が誠実であり、その思いが一点の曇りもなく相手に伝わっているからです。その純粋な心の交流は、後悔の念を生じさせず、友人たちもあなたの思いに従います。",
      },
      187: {
        title: "ステージ5：背中への感応、後悔なし。",
        reason:
          "感応が、もはや心や感情といったレベルではなく、背中の肉という、意志の及ばない領域で起こっているからです。それは理屈を超えた深い繋がりであり、後悔の余地はありません。",
      },
      188: {
        title: "ステージ6：口先だけの感応。",
        reason:
          "感応が、もはや心からのものではなく、口先だけの浅いレベルに落ちてしまっているからです。その薄っぺらな言葉は、誰の心にも響かず、何の力も持ちません。",
      },
      189: {
        title: "ステージ1：永遠を求める、性急な心。",
        reason:
          "物事の始まりから、あまりにも性急に、永遠で不変の関係性を求めているからです。その深い欲求は、長期的には良い結果をもたらしますが、短期的には焦りを生み、問題を引き起こします。",
      },
      190: {
        title: "ステージ2：後悔が消える。",
        reason:
          "これまでの性急さや過ちを深く反省し、その結果として後悔の念が完全に消え去ったからです。この心の平穏が、あなたを再び正しい道へと導きます。",
      },
      191: {
        title: "ステージ3：徳が安定せず、恥をかく。",
        reason:
          "あなたの徳がまだ安定しておらず、その時々の感情や状況によって態度が揺らいでしまうからです。その一貫性のない振る舞いが、外部からの不信を招き、恥をかく原因となります。",
      },
      192: {
        title: "ステージ4：いるべき場所に、獲物がいない。",
        reason:
          "あなたが長年、いるべきではない場所（狩り場）に留まり続けていたからです。そこには、あなたが求めるべき成果（獲物）は、もはや存在しません。環境を変えるべき時です。",
      },
      193: {
        title: "ステージ5：婦徳、夫にとっては凶。",
        reason:
          "妻が自らの徳（婦徳）に従って行動していますが、その貞淑さが、夫にとっては束縛となり、自由な活動を妨げているからです。どちらが正しいという訳ではなく、立場の違いが葛藤を生んでいます。",
      },
      194: {
        title: "ステージ6：動揺し続け、凶。",
        reason:
          "組織や物事の最も上の立場にありながら、精神的な動揺を続け、落ち着きがないからです。そのリーダーの不安定さが、組織全体に悪影響を及ぼし、凶事を招きます。",
      },
      195: {
        title: "ステージ1：逃げ遅れる、危険な状況。",
        reason:
          "退却すべき状況であるにも関わらず、最後尾にいて逃げ遅れている、非常に危険な状態だからです。この段階で無理に進もうとすれば、必ず災難に巻き込まれます。今は動かず、嵐が過ぎ去るのを待つべきです。",
      },
      196: {
        title: "ステージ2：黄色い革紐、固い決意。",
        reason:
          "退きたくても退けない状況に対し、黄色い革紐のように、固く、そして柔軟な意志で耐え忍んでいるからです。その強い精神力によって、あなたはこの困難な状況から離れることができずにいます。",
      },
      197: {
        title: "ステージ3：部下や家族への未練、危険な退却。",
        reason:
          "退却すべき時に、部下や家族といった、しがらみへの未練によって、迅速な決断ができないでいるからです。その感情的な執着が、あなたを危険な状況に留まらせ、病のような災いを招きます。",
      },
      198: {
        title: "ステージ4：善なる退却、しかし部下は救えず。",
        reason:
          "下の者たちへの執着を断ち切り、自らが善き道へと退くことを決断したからです。その決断は君子としては正しいですが、残念ながら、あなたに従ってこられるのは同じ君子だけで、下の者たちを救うことはできません。",
      },
      199: {
        title: "ステージ5：美しい退却、問題なし。",
        reason:
          "退却のタイミングと方法が完璧であり、その去り際が非常に美しいからです。その模範的な退き方によって、あなたは誰からも非難されることなく、正しい道を守り抜くことができます。",
      },
      200: {
        title: "ステージ6：余裕ある退却、何事も上手くいく。",
        reason:
          "もはや何物にも囚われることなく、心に余裕を持って悠々と退いている、賢者の境地だからです。その執着のない心境が、何事も上手くいくという、最高の状態をもたらしています。",
      },
      201: {
        title: "ステージ1：足の指への力、進みすぎは凶。",
        reason:
          "力の使い方がまだ足の指レベルであり、勢い余って前進しすぎようとしているからです。その未熟な力の使い方は、無謀な行動に繋がり、必ず失敗を招きます。今は慎重になるべきです。",
      },
      202: {
        title: "ステージ2：ふくらはぎの力、幸運。",
        reason:
          "ふくらはぎに力がみなぎり、前進するための準備が整った状態だからです。その力強い勢いと正しい判断力が組み合わさり、幸運な結果を引き寄せます。",
      },
      203: {
        title: "ステージ3：腰の力、危険な状態。",
        reason:
          "腰にまで力が入り、もはや後戻りできないほど、深く前進してしまっている危険な状態だからです。その力強い前進は、羊が垣根に角を突き刺して動けなくなるように、あなたを身動きの取れないジレンマに陥らせます。",
      },
      204: {
        title: "ステージ4：垣根が破れ、力が解放される。",
        reason:
          "あなたを閉じ込めていた障害（垣根）が破れ、抑えつけられていた強大なエネルギーが解放されたからです。その力は、大きな車を動かすほどのパワーを持ち、もはや誰にも止めることはできません。",
      },
      205: {
        title: "ステージ5：力を失い、後悔なし。",
        reason:
          "隣国の羊を易々と失うように、あれほど強大だった力を、いとも簡単に手放しているからです。その力への執着のなさが、あなたに心の平穏をもたらし、後悔することはありません。",
      },
      206: {
        title: "ステージ6：角で突き進み、行き詰まる。",
        reason:
          "力を失ったにも関わらず、過去の成功体験に囚われ、なおも力で進もうとしているからです。その頑なな態度は、羊が角で進もうとして行き詰まるように、あなたを完全な手詰まり状態に陥らせます。",
      },
      207: {
        title: "ステージ1：進み出て、すぐに行き詰まる。",
        reason:
          "昇進しようと進み出たものの、すぐに障害にぶつかり、進むことを妨げられているからです。この段階では、まだ周囲の信頼を得られておらず、あなたの前進を快く思わない力が働いています。",
      },
      208: {
        title: "ステージ2：進めない悲しみ、しかし幸運。",
        reason:
          "思うように進めないことに、あなたは深い悲しみや憂いを感じています。しかし、その停滞が、かえってあなたに大きな幸運（祖母からの祝福）をもたらすという、逆説的な状況です。",
      },
      209: {
        title: "ステージ3：皆の信頼を得て、進む。",
        reason:
          "これまでの誠実な働きが認められ、周囲の全ての者から信頼を得て、満場一致で前進を許されたからです。もはやあなたの行く手を阻むものは何もありません。",
      },
      210: {
        title: "ステージ4：ネズミのように進む、危険な状態。",
        reason:
          "日中のネズミのように、本来いるべきでない場所で、こそこそと不正な手段で前進しようとしているからです。その行いは非常に危険であり、いずれ必ず露見し、厳しい罰を受けることになります。",
      },
      211: {
        title: "ステージ5：損得を考えず、あるがままに進む。",
        reason:
          "物事が上手くいくか、いかないか、といった損得勘定を一切手放しているからです。その執着のない、あるがままの姿勢が、かえって物事を好転させ、幸運を引き寄せます。",
      },
      212: {
        title: "ステージ6：角を使って進む、袋小路。",
        reason:
          "もはや袋小路に入っており、角を使って無理やり道を開こうとしている、非常に苦しい状況だからです。その攻撃的な姿勢は、自分自身や身内を律するためだけなら許されますが、それ以外では凶となります。",
      },
      213: {
        title: "ステージ1：傷ついた翼、苦難の旅の始まり。",
        reason:
          "旅の始まりにおいて、早くも翼を傷つけられ、思うように飛べない苦しい状況だからです。その苦難は、三日間食事もできないほどの厳しいものとなります。それでも進むべき道があるならば、行く先々で非難や中傷を受けることを覚悟しなければなりません。",
      },
      214: {
        title: "ステージ2：左股を負傷、しかし馬で救われる。",
        reason:
          "計画の土台となる部分に、予期せぬ弱点が見つかり、自力で進むことが困難な状況です。しかし、力強い協力者（馬）の出現によって、あなたはその危機を乗り越えることができます。今は他者の助けを素直に受け入れるべきです。",
      },
      215: {
        title: "ステージ3：南で狩り、敵の頭を得る。",
        reason:
          "困難な状況の主原因である「敵の頭」を、南での狩りのように、的確な戦略で打ち破ったからです。あまりに性急な解決は避けるべきですが、この問題解決は正しい行動です。",
      },
      216: {
        title: "ステージ4：敵の懐へ、静かに入る。",
        reason:
          "敵の懐に潜り込み、相手の腹の中を探るように、静かに情報を収集しているからです。その慎重で知的なアプローチによって、あなたは敵の弱点を見つけ出し、最終的に勝利します。",
      },
      217: {
        title: "ステージ5：才能を隠し、賞賛を得る。",
        reason:
          "最初に非難されながらも、最終的にはその才能が認められ、大きな賞賛と利益を得るからです。その逆転劇は、あなたの隠された徳と実力が本物であることの証明です。",
      },
      218: {
        title: "ステージ6：天に昇り、地に落ちる。",
        reason:
          "最初は天に昇るほどの成功を収めますが、やがてその輝きを失い、地に落ちるという、極端な盛衰の物語だからです。これは、道理に反したやり方で得た成功が、決して長続きしないことを示しています。",
      },
      219: {
        title: "ステージ1：規律を守り、家庭の基盤を築く。",
        reason:
          "家庭という共同体の始まりにおいて、まず厳格な規律を設けることで、その後の混乱を防いでいるからです。この最初のルール作りが、家族の安定した未来の基盤となります。",
      },
      220: {
        title: "ステージ2：主婦として、食事の準備をする。",
        reason:
          "家庭の中心で、主婦のように、家族の食事の準備をするという、自らの役割に専念しているからです。その地道で献身的な働きが、家族の心と体を養い、幸運をもたらします。",
      },
      221: {
        title: "ステージ3：厳しすぎる、しかし後悔の後に幸運。",
        reason:
          "家族を思うあまり、その態度が厳しすぎて、反発や嘆きを招いている状況だからです。しかし、その厳しさが最終的に家族のためになると理解されれば、後悔は幸運へと転じます。",
      },
      222: {
        title: "ステージ4：家庭を豊かにする、大いなる幸運。",
        reason:
          "家族の富を管理し、それを大きく豊かにするという、重要な役割を果たしているからです。その優れた管理能力が、家庭に大いなる幸運と繁栄をもたらします。",
      },
      223: {
        title: "ステージ5：王のように、愛で家族を包む。",
        reason:
          "王が家族に接するように、威厳と愛情をもって、家族全体を一つにまとめているからです。その存在自体が、家族にとっての安心と誇りの源泉となっています。",
      },
      224: {
        title: "ステージ6：威厳ある終わり、幸運。",
        reason:
          "物語の終わりにおいて、自分自身を厳しく律し、威厳に満ちた姿を示しているからです。その最後まで揺るがない自己規律が、周囲からの尊敬を集め、有終の美を飾ります。",
      },
      225: {
        title: "ステージ1：後悔が消える、最初の出会い。",
        reason:
          "これまでの過ちや後悔が、新しい出会いによって完全に消え去る段階だからです。たとえ相手が問題（疲れた馬）を抱えていても、その出会い自体が、あなたを過去の呪縛から解放します。",
      },
      226: {
        title: "ステージ2：路地裏での出会い、問題なし。",
        reason:
          "本来出会うはずのない、路地裏のような場所で、偶然にも会うべき相手と出会っているからです。その予期せぬ出会いは、運命的なものであり、咎められることはありません。",
      },
      227: {
        title: "ステージ3：進めない、絶体絶命。",
        reason:
          "行く手を阻まれ、さらに後ろから攻撃されるという、進退窮まった絶体絶命の状況だからです。この苦しい経験を通じて、あなたは人間の狡猾さと、状況判断の重要性を学ぶことになります。",
      },
      228: {
        title: "ステージ4：孤立の中、誠実な仲間と出会う。",
        reason:
          "周囲から孤立し、困難な状況にありますが、そこで唯一、誠実で信頼できる仲間と出会うからです。その特別な出会いが、あなたを危機から救い出し、共に道を切り開く力となります。",
      },
      229: {
        title: "ステージ5：大きな口、後悔が消える。",
        reason:
          "仲間が大きな口を開けて笑うように、これまでの全ての誤解や対立が解け、心からの和解が訪れたからです。その喜びの瞬間が、過去の後悔をすべて消し去ります。",
      },
      230: {
        title: "ステージ6：すれ違い、互いに見えず。",
        reason:
          "互いに背を向け、相手の姿が見えていない、完全なすれ違いの状態だからです。最初は誤解から鬼や牛車に見えますが、やがてその誤解は解け、真のパートナーシップへと向かいます。",
      },
      231: {
        title: "ステージ1：進めない、その場で待つ。",
        reason:
          "行く先に困難（蹇）があるため、賢明にも前進を止め、その場で状況が好転するのを待っているからです。この冷静な判断が、あなたを無用な災いから遠ざけます。",
      },
      232: {
        title: "ステージ2：主君のための苦難、私心はない。",
        reason:
          "あなたが直面している困難は、自分自身の利益のためではなく、公の目的や主君のために身を捧げている結果だからです。その無私な姿勢は、すぐには理解されないかもしれませんが、最終的には必ず評価されます。",
      },
      233: {
        title: "ステージ3：内に引き返し、家族を頼る。",
        reason:
          "外部で困難に直面し、自分の内側、つまり家庭や信頼できる仲間の元へと引き返してきているからです。その最も身近な存在が、今のあなたを喜びで迎え入れ、支えてくれます。",
      },
      234: {
        title: "ステージ4：仲間と協力し、困難に立ち向かう。",
        reason:
          "自らの力だけでは乗り越えられない困難に対し、信頼できる仲間と連携し、共に立ち向かっているからです。この協力体制こそが、今のあなたにとって唯一の正しい道です。",
      },
      235: {
        title: "ステージ5：最大の困難、しかし助けが来る。",
        reason:
          "最大の困難の真っ只中にいますが、そこには必ず助けとなる友人や協力者が現れるからです。今は一人で抱え込まず、周囲の助けを素直に受け入れることが重要です。",
      },
      236: {
        title: "ステージ6：困難から脱し、大きな成功を得る。",
        reason:
          "これまでの全ての困難な状況から完全に脱出し、大きな成功を収める段階だからです。その達成は、あなたを指導者として仰ぐ人々にとっても、良い影響を与えます。",
      },
      237: {
        title: "ステージ1：危険なき解放、問題なし。",
        reason:
          "困難な状況が解決に向かい始めた、最初の段階だからです。まだ完全な解放ではありませんが、この時点で咎められるべき点は何もありません。",
      },
      238: {
        title: "ステージ2：三匹の狐を仕留め、矢を得る。",
        reason:
          "問題の解決において、不正や媚びへつらいといった、三匹の狐のような邪な要素を的確に排除したからです。その正しい行いによって、あなたはまっすぐな道（金の矢）と、それに伴う評価を得ます。",
      },
      239: {
        title: "ステージ3：荷物を背負い、乗り物に乗る、盗人を招く。",
        reason:
          "身分不相応な振る舞いをしているため、盗人から狙われるという危険な状況を自ら招いているからです。荷物を背負いながら乗り物に乗るように、その矛盾した行動が、あなたの脇の甘さを示しています。",
      },
      240: {
        title: "ステージ4：仲間との決別、解放。",
        reason:
          "あなたを束縛していた不誠実な仲間（親指）との関係を、自らの意志で断ち切るからです。その決別によって、あなたは真の友人を得て、自由な解放感を味わうことになります。",
      },
      241: {
        title: "ステージ5：自らを解き放つ、幸運。",
        reason:
          "成熟した人間として、自らを縛る内面的な葛藤や固定観念から、自分自身を解き放つことができるからです。その精神的な自由が、下の者たちからの信頼を集め、幸運な状況をもたらします。",
      },
      242: {
        title: "ステージ6：公の場で、悪を射抜く。",
        reason:
          "高い城壁の上から、悪の象徴である鷹を射抜くように、公の立場で、断固として不正を正しているからです。その正義の実行は、全ての面において、利益と賞賛をもたらします。",
      },
      243: {
        title: "ステージ1：事を終え、速やかに行く。",
        reason:
          "自分自身のやるべきことを一旦終え、下の者を助けるために速やかに行動しているからです。しかし、助ける際には、相手の状況をよく考慮し、どの程度まで援助（損）すべきかを慎重に判断する必要があります。",
      },
      244: {
        title: "ステージ2：自分を損ぜず、相手を助ける。",
        reason:
          "自分自身が正しい道（貞）を固く守ることで、下の者を助けるという状況だからです。この段階では、自分を犠牲にすることなく、その正しい姿勢そのもので、相手に良い影響を与えることができます。",
      },
      245: {
        title: "ステージ3：三人が行けば、一人が減る。",
        reason:
          "三人で行動すると、必ず内部に対立や不和が生まれ、一人が去っていくという人間関係の力学が働いているからです。逆に、一人で行動すれば、信頼できる一人の友を得ることができます。",
      },
      246: {
        title: "ステージ4：自分の欠点を、他者に治してもらう。",
        reason:
          "自分自身の欠点（病）を認め、それを信頼できる他者に速やかに治してもらうからです。その素直さと迅速な行動が、より大きな問題に発展するのを防ぎ、喜びをもたらします。",
      },
      247: {
        title: "ステージ5：大きな助けを得て、幸運を得る。",
        reason:
          "まるで大きな亀の甲羅のように、非常に価値のある、抗うことのできないほどの大きな助けを得るからです。これは天からの恵みであり、素直に受け入れることで、大いなる幸運がもたらされます。",
      },
      248: {
        title: "ステージ6：自分を損せず、他者に益する。",
        reason:
          "もはや自分自身を損なうことなく、その存在自体が、下の者たちや世の中全体に利益を与えている、理想的な段階だからです。その行いは、大きな家を得るように、確固たる基盤と人望を築きます。",
      },
      249: {
        title: "ステージ1：大きな事を始める、絶好の機会。",
        reason:
          "物事を始めるにあたって、非常に良い機会に恵まれているからです。大きな事業や計画に着手すれば、それは大いに成功し、咎められることはありません。ためらう理由はありません。",
      },
      250: {
        title: "ステージ2：二重の助け、抗えない幸運。",
        reason:
          "まるで二重の亀の甲羅のように、抗うことのできない、絶対的な天の助けを得ているからです。その強大な幸運は、王の儀式に用いられるほど、公に認められた確かなものです。",
      },
      251: {
        title: "ステージ3：凶事から助けを得る。",
        reason:
          "本来であれば不運であるはずの凶事から、かえって助けや利益を得るという、逆説的な状況だからです。その誠実な人柄が、災いをも福へと転じる不思議な力を発揮します。",
      },
      252: {
        title: "ステージ4：中心的な役割、移転の提案。",
        reason:
          "組織の中心的な役割を担っており、その公平な判断が、下の者たちから絶対的な信頼を得ているからです。都を移すような大きな提案も、あなたの口から出れば、人々は喜んで従います。",
      },
      253: {
        title: "ステージ5：誠実さが、人々の心を掴む。",
        reason:
          "誠実な心で、人々に恵みを与えようとしているからです。その見返りを求めない真心が、人々の心を掴み、あなたに幸運をもたらします。何かを問いかける必要すらありません。",
      },
      254: {
        title: "ステージ6：誰にも利益を与えず、孤立する。",
        reason:
          "誰の利益にもならない行動を取り続け、周囲から孤立してしまっているからです。その利己的な態度は、人々からの反発を招き、最終的には攻撃されるという凶事を引き起こします。",
      },
      255: {
        title: "ステージ1：叫び声をあげる、しかし凶。",
        reason:
          "決断の時が来たことを、大声で叫んで周囲に知らせていますが、そのやり方が性急で力任せだからです。その強引な態度は、下の者たちに危険をもたらし、凶事を招きます。",
      },
      256: {
        title: "ステージ2：武装して警戒する、心配は不要。",
        reason:
          "不測の事態に備え、常に武装して警戒を怠らないでいるからです。その周到な準備と危機管理能力があれば、たとえ不意の出来事があっても、心配する必要はありません。",
      },
      257: {
        title: "ステージ3：顔を打たれる、危険な状況。",
        reason:
          "下の者たちの力強い抵抗にあい、まるで顔を打たれるような、屈辱的で危険な状況にあるからです。あなたの力はまだ弱く、このままでは凶事を避けられません。",
      },
      258: {
        title: "ステージ4：聞く耳を持たず、自滅する。",
        reason:
          "忠告に全く耳を貸さず、自分の意見に固執しているため、自滅の道を歩んでいるからです。その頑なな態度は、まるで臀部に皮膚病ができて歩けないように、あなたを行き詰まらせます。",
      },
      259: {
        title: "ステージ5：雑草を抜くように、断固たる決断。",
        reason:
          "決断すべき時が来ており、まるで生命力の強い雑草を抜き去るように、断固として、しかし中庸の徳を保ちながら行動しているからです。そのバランスの取れた決断力に、咎められる点はありません。",
      },
      260: {
        title: "ステージ6：声なくして、滅びる。",
        reason:
          "もはや助けを求める声すら上げられず、なすすべなく滅びゆく、最終段階だからです。これは、これまでの全ての行いが招いた、必然的な結末です。",
      },
      261: {
        title: "ステージ1：鉄の車輪を止める。",
        reason:
          "強大な力を持つ存在（金属の車）が暴走しないよう、その初期段階で、うまく制止しているからです。その慎重で貞淑な態度が、大きな災いを未然に防ぎます。",
      },
      262: {
        title: "ステージ2：陰と陽の出会い、幸運。",
        reason:
          "柔順な陰の力と、力強い陽の力が、予期せずして出会う、幸運な段階だからです。この出会いは、あなたに利益をもたらし、全ての面で良い結果へと向かいます。",
      },
      263: {
        title: "ステージ3：豚のように、欲望のままに行動する。",
        reason:
          "貪欲な豚のように、欲望のままに行動しているため、周囲からの信頼を失っているからです。その抑制の効かない態度は、結局、大きな獲物（成功）を逃すことになります。",
      },
      264: {
        title: "ステージ4：大きな袋、問題も賞賛もない。",
        reason:
          "大きな袋の口を固く縛るように、自らの才能や意見を完全に内に秘め、沈黙を守っているからです。その態度は、賞賛もされませんが、同時に災いを招くこともありません。",
      },
      265: {
        title: "ステージ5：柳の葉で瓜を包む。",
        reason:
          "柳の葉で瓜を包むように、自らの美しい徳を内に秘め、決して外に誇示しないからです。その奥ゆかしい美徳は、いずれ天からの光が当たり、認められる時が来ます。",
      },
      266: {
        title: "ステージ6：天からの恩恵、大いなる幸運。",
        reason:
          "これまでの全ての行いが天に認められ、大きな恩恵がもたらされる、最高の段階だからです。その幸運は、まるで濡れた衣服が乾くように、自然で疑う余地のないものです。",
      },
      267: {
        title: "ステージ1：誠実な心、しかし空回り。",
        reason:
          "誠実な心で集まろうとしていますが、中心となるべきリーダーが不在のため、そのエネルギーが空回りしているからです。その善意は本物ですが、今は混乱を招くだけです。",
      },
      268: {
        title: "ステージ2：引かれる力、幸運。",
        reason:
          "特別な儀式や努力をしなくても、中心にある誠実な力に、自然と引き寄せられていく幸運な段階だからです。その見えない力に導かれるままに行動すれば、間違いありません。",
      },
      269: {
        title: "ステージ3：集まりたいのに、集まれない。",
        reason:
          "集まりたいという意志はあるものの、周囲に適切な仲間がおらず、ため息をついている状況だからです。無理に集まろうとしても利益はありません。今は一人で進むべき時です。",
      },
      270: {
        title: "ステージ4：リーダーとして、大いに幸運。",
        reason:
          "組織や集団のリーダーとして、その役割を完璧に果たしているため、大いなる幸運がもたらされるからです。あなたの存在が、集団全体を正しい方向へと導いています。",
      },
      271: {
        title: "ステージ5：人望はあるが、まだ信頼は盤石ではない。",
        reason:
          "あなたの高い地位（元）には人々が集まっていますが、その動機は様々であり、まだ心からの信頼関係は築けていないからです。ここで自らの行いを反省し、徳を高めれば、後悔は消え去ります。",
      },
      272: {
        title: "ステージ6：涙と鼻水、嘆き悲しむ。",
        reason:
          "集団から孤立し、誰からも理解されず、嘆き悲しんでいる状況だからです。しかし、その深い自己反省と痛みの経験が、最終的にあなたを咎めのない境地へと導きます。",
      },
      273: {
        title: "ステージ1：誠実さがあれば、登り始められる。",
        reason:
          "木を登るように、物事を一から始める段階ですが、そこには誠実な信頼関係があるからです。その信頼こそが、これから先の困難な道のりを登っていくための、唯一の頼りとなります。",
      },
      274: {
        title: "ステージ2：小さな捧げもの、誠実さが伝わる。",
        reason:
          "夏祭りの小さな捧げもののように、物質的には僅かですが、そこに込められた誠実な心は本物だからです。その真心が、神や人々を動かし、咎めのない状況をもたらします。",
      },
      275: {
        title: "ステージ3：何もない町を、登っていく。",
        reason:
          "誰もいない空っぽの町を登っていくように、何の障害もなく、スムーズに進んでいける状況だからです。そのあまりの順調さに、かえって不安を覚える必要はありません。",
      },
      276: {
        title: "ステージ4：王として、最高の儀式を執り行う。",
        reason:
          "王が岐山で神々を祀るように、公の立場で、最高の敬意と誠実さをもって儀式を執り行っているからです。その敬虔な行いが、国全体に幸運と繁栄をもたらします。",
      },
      277: {
        title: "ステージ5：着実に登り、幸運を得る。",
        reason:
          "焦ることなく、一歩一歩、着実に階段を登っているからです。その堅実な歩みが、最終的に大きな成功と幸運をもたらすことを、あなたは確信しています。",
      },
      278: {
        title: "ステージ6：暗闇の中を登る、利益はない。",
        reason:
          "もはや周りが見えない暗闇の中を、ただひたすら登り続けているからです。その盲目的な前進は、利益をもたらすことはなく、いずれ限界が訪れます。立ち止まり、光を探すべきです。",
      },
      279: {
        title: "ステージ1：井戸の底の泥、誰も飲まない。",
        reason:
          "井戸の底に溜まった泥水のように、あなたの価値や才能が、まだ誰にも認識されていない段階だからです。古い鳥たちが見向きもしないように、今は誰からも相手にされません。",
      },
      280: {
        title: "ステージ2：井戸の修理、しかし水は漏れる。",
        reason:
          "井戸の欠点を修理しようとしていますが、甕が壊れているため、水が漏れてしまっている状況です。その努力はまだ不完全であり、あなたの価値は正しく評価されません。",
      },
      281: {
        title: "ステージ3：清らかな井戸、しかし使われず。",
        reason:
          "井戸は清らかに整備されたにも関わらず、誰もその水を使おうとしない、非常にもどかしい状況だからです。あなたの価値が正しく評価されないことに、人々は心を痛めています。",
      },
      282: {
        title: "ステージ4：井戸の改修、問題なし。",
        reason:
          "井戸の内側を石で塗り固めるように、あなた自身の内面的な価値や実力を、着実に高めている段階だからです。その見えない努力に、咎められる点は何もありません。",
      },
      283: {
        title: "ステージ5：清らかな泉、人々が飲む。",
        reason:
          "井戸の中心から、冷たく清らかな泉が湧き出ているからです。その本質的な価値が、多くの人々に認められ、その恩恵を皆が享受しています。",
      },
      284: {
        title: "ステージ6：井戸は完成し、人々が集う。",
        reason:
          "井戸が完全に整備され、その蓋を開けて、誰でも自由に使える状態になっているからです。その開かれた姿勢と、尽きることのない価値の提供が、関わる全ての人に大いなる幸運と繁栄をもたらします。",
      },
      285: {
        title: "ステージ1：革命の時ではない。",
        reason:
          "革命を起こすには、まだ時期尚早であり、あなたの力も不足しているからです。黄色い牛の革で固く縛られているように、今は衝動的な行動を抑え、その場で待つことが求められます。",
      },
      286: {
        title: "ステージ2：革命の時来たる、問題なし。",
        reason:
          "革命を起こすべき完璧なタイミングが訪れ、あなたが行動を起こすのを、天が後押ししているからです。その正義に基づいた行動は、必ず成功し、咎められることはありません。",
      },
      287: {
        title: "ステージ3：性急な革命は、三度退けられる。",
        reason:
          "機が熟していないにも関わらず、性急に革命の議論を進めすぎているからです。その言葉は三度も退けられるように、まだ人々の支持を得られていません。今は慎重に時を待つべきです。",
      },
      288: {
        title: "ステージ4：後悔が消え、信頼を得る。",
        reason:
          "これまでの性急さや過ちへの後悔が完全に消え、確固たる信念を持って天命を改める段階に至ったからです。その迷いのない姿が、人々からの絶対的な信頼を勝ち取ります。",
      },
      289: {
        title: "ステージ5：虎のように、鮮やかな変革。",
        reason:
          "虎の皮の模様が季節ごとに鮮やかに変わるように、誰の目にも明らかな、美しく力強い変革を成し遂げるからです。その見事な手腕は、占うまでもなく、輝かしい未来を約束しています。",
      },
      290: {
        title: "ステージ6：豹変、しかし道は正しい。",
        reason:
          "豹の皮の模様のように、細やかで地味な改革を、下の者たちと共に行っているからです。その変化は、虎のような華やかさはありませんが、人として正しい道であり、誰にでも理解されるものです。",
      },
      339: {
        title: "ステージ1：進退に迷う、規律に従う。",
        reason:
          "決断力に迷い、進むべきか退くべきか決めかねている状態だからです。リーダーシップを発揮するには、まだ力不足。このような時は、自分一人の判断で動くのは危険です。軍隊のように規律正しく、信頼できるリーダーの指示に素直に従うことが、最も安全で確実な結果を生みます。",
      },
      340: {
        title: "ステージ2：人の下に伏し、学ぶ時。",
        reason:
          "神社の巫女や歴史家のように、優れた人物や先人の知恵の下に、謙虚に身を置いているからです。その学びの姿勢が、あなたの乱れた心を整え、幸運を引き寄せます。",
      },
      341: {
        title: "ステージ3：頻繁に迷い、道を見失う。",
        reason:
          "何度も方針を変え、そのたびに迷いが生じているため、本来進むべき道を見失っているからです。その一貫性のない態度は、あなた自身の信頼を損ない、恥をかく結果を招きます。",
      },
      342: {
        title: "ステージ4：後悔が消え、三種の獲物を得る。",
        reason:
          "これまでの迷いや後悔が完全に消え、狩りで三種類もの獲物を得るように、公私にわたって大きな成果を上げる段階に至ったからです。その活躍は、誰の目にも明らかです。",
      },
      343: {
        title: "ステージ5：始まりは悪いが、終わりは良い。",
        reason:
          "物事の始まり（最初の3日間）は混乱し、困難が伴いますが、その後の3日間で状況を整理し、見事に修正していくからです。その粘り強い改善能力が、最終的に後悔のない幸運な結果をもたらします。",
      },
      344: {
        title: "ステージ6：人の下に伏し、全てを失う。",
        reason:
          "謙虚であるべき時に、その限度を超えて、卑屈になりすぎているからです。その行き過ぎた自己卑下が、あなたの資産と、正しい判断力（貞）の両方を失わせる原因となります。",
      },
      345: {
        title: "ステージ1：心からの喜び、コミュニケーション。",
        reason:
          "心から湧き上がる純粋な喜びを感じ、それを周囲と分かち合っている、素晴らしい始まりの段階だからです。その裏表のない明るさが、自然と人々を引き寄せ、物事を円滑に進めます。",
      },
      346: {
        title: "ステージ2：誠実さがもたらす、真の喜び。",
        reason:
          "見せかけの喜びではなく、誠実な心に基づいた、真の喜びを感じているからです。その偽りのない姿勢が、後悔の念を消し去り、あなたに心の平穏をもたらします。",
      },
      347: {
        title: "ステージ3：下から来る喜び、凶。",
        reason:
          "本来は自分が与えるべき喜びを、下の者から与えられるのを待っている、受動的な状態だからです。その姿勢は、リーダーとしての役割を放棄しており、凶事を招きます。",
      },
      348: {
        title: "ステージ4：喜びを計算し、安泰を得る。",
        reason:
          "どの喜びを追求し、どの喜びを捨てるべきかを冷静に計算し、決断しているからです。その理性的な判断力が、心の病（憂い）を取り除き、安泰な状態をもたらします。",
      },
      349: {
        title: "ステージ5：敵を信じる、危険な状態。",
        reason:
          "あなたのすぐ近くにいる、腐敗した危険な存在を、誤って信頼してしまっているからです。その人物を放置すれば、いずれあなた自身に危険が及ぶことになります。すぐに関係を断つべきです。",
      },
      350: {
        title: "ステージ6：引き込まれる喜び。",
        reason:
          "他者の喜びや楽しげな雰囲気に、自然と引き込まれていく状態だからです。この段階では、自らが主導するのではなく、周囲の流れに身を任せることが、最も自然な選択となります。",
      },
      351: {
        title: "ステージ1：風で吹き散る、始まりの混乱。",
        reason:
          "霧が風で吹き散らされるように、閉塞した状況が解消に向かい始めた段階です。この好機を活かすには、力強い協力者（馬）の助けを借りることが、最も有効な手段となります。",
      },
      352: {
        title: "ステージ2：霧の中、机の下に隠れる。",
        reason:
          "霧が晴れていく中で、机の下に隠れるように、まだ疑心暗鬼になり、臆病になっているからです。信頼できる巫女のように、物事の本質を見通す者の助けを借りることで、その恐れは消え去ります。",
      },
      353: {
        title: "ステージ3：自らの体を吹き散らす。",
        reason:
          "自分自身の利益や体裁といった「我」を、風で吹き散らすように、手放しているからです。その無私な姿勢が、後悔のない、晴れやかな心境をもたらします。",
      },
      354: {
        title: "ステージ4：仲間との壁を取り払う。",
        reason:
          "仲間との間にある垣根や壁を取り払い、完全な和解を成し遂げたからです。その開かれた姿勢は、常人には真似のできない、非常に優れた行いです。",
      },
      355: {
        title: "ステージ5：汗を吹き散らす、王の決断。",
        reason:
          "王が大号令を発するように、あるいは汗を吹き散らすように、大きな決断を下し、組織全体にその意思を浸透させているからです。その決断は、組織の危機を救い、安泰をもたらします。",
      },
      356: {
        title: "ステージ6：血のりから遠ざかる。",
        reason:
          "血が飛び散るような危険な場所から、速やかに遠ざかり、身の安全を確保しているからです。その賢明な危機回避能力が、あなたを災いから守り、咎めのない状況を保ちます。",
      },
      357: {
        title: "ステージ1：戸口で立ち止まる、危険。",
        reason:
          "まだ行動を開始すべき時ではないのに、戸口でうろうろしている、非常に危険な状態だからです。その場所は、内と外の境界であり、最も災いを招きやすいポジションです。",
      },
      358: {
        title: "ステージ2：門の中で待つ、凶。",
        reason:
          "門の内側で、好機が訪れるのをただ待っているだけの、受動的な状態だからです。その消極的な姿勢では、好機を逃し、最終的に凶事を招きます。",
      },
      359: {
        title: "ステージ3：足を引き裂かれる、屈辱。",
        reason:
          "自分の力量をわきまえず、分不相応な行動を取った結果、足を引き裂かれるような屈辱を味わっているからです。この段階では、あなたを助けてくれる主役は現れません。",
      },
      360: {
        title: "ステージ4：樽酒と食器、しかし素朴に。",
        reason:
          "樽酒や食器といった豪華なものを用いていますが、その使い方は非常に質素で、誠実だからです。その謙虚な姿勢が、最終的に咎めのない結果をもたらします。",
      },
      361: {
        title: "ステージ5：美しい節度、幸運。",
        reason:
          "心地よい節度を保ち、その中で楽しみを見出している、理想的な状態だからです。そのバランスの取れた生き方が、あなたの立場を向上させ、幸運を引き寄せます。",
      },
      362: {
        title: "ステージ6：苦しい節度、しかし続ければ凶。",
        reason:
          "あまりにも厳しすぎる節度を自らに課し、その苦しみに耐えている状況だからです。そのストイックな姿勢は、短期的には評価されますが、長期的に続ければ、必ず心身を害し、凶事を招きます。",
      },
      363: {
        title: "ステージ1：心の中の誠実さ、まだ伝わらず。",
        reason:
          "あなたの心の中には、相手を思う誠実さがありますが、それがまだ行動として現れていない段階だからです。その内なる誠実さを信じ、静かに時を待てば、いずれ状況は好転します。",
      },
      364: {
        title: "ステージ2：鶴が鳴き、子が和す。",
        reason:
          "親鶴が鳴けば子鶴が応えるように、あなたの誠実な呼びかけに、信頼できる仲間が応えてくれるからです。その深い精神的な繋がりが、物質的な豊かさ（美酒）を分かち合う喜びを生み出します。",
      },
      365: {
        title: "ステージ3：敵を得て、一喜一憂する。",
        reason:
          "好敵手を得て、戦いの中で一喜一憂している、非常に不安定な状態だからです。ある時は太鼓を打ち鳴らして喜び、ある時は悲嘆に暮れて泣き叫ぶように、あなたの心は大きく揺れ動いています。",
      },
      366: {
        title: "ステージ4：月が満ちる、仲間は消える。",
        reason:
          "月が満月になろうとする完璧な直前の状態にあり、あなたは満ち足りています。しかし、その完成を前にして、これまで頼りにしてきた仲間（馬匹）は、その役目を終えて去っていきます。",
      },
      367: {
        title: "ステージ5：敵を帯で繋ぐ、強い信頼。",
        reason:
          "かつて敵対していた者たちを、まるで帯で繋ぐように、強い信頼関係で結びつけているからです。その度量の大きさと誠実さが、対立を調和へと導き、咎めのない状況を生み出します。",
      },
      368: {
        title: "ステージ6：鶏が天に昇る、言葉だけの実りなき状態。",
        reason:
          "鶏が天に昇ろうとするように、実力を伴わないまま、言葉だけで虚勢を張っているからです。そのあり得ない行動は、口先だけのリーダーシップの末路であり、凶事を招きます。",
      },
      369: {
        title: "ステージ1：小さな過ち、しかし許される。",
        reason:
          "物事の始まりにおいて、少しだけ度を過ごしてしまっている状態です。しかし、その過ちはまだ小さく、大きな問題には発展しないため、咎められることはありません。",
      },
      370: {
        title: "ステージ2：太陽が隠れる、日食。",
        reason:
          "日中の太陽が、日食によって隠されてしまうように、あなたのリーダーシップや影響力が、予期せぬ出来事によって一時的に失われるからです。その暗闇の中で、あなたは無力さを感じます。",
      },
      371: {
        title: "ステージ3：小さな器を叩いて歌う、老いの嘆き。",
        reason:
          "小さな土鍋を叩いて歌う老人のように、過去の栄光を嘆き、老いを受け入れられないでいるからです。その姿勢からは、もはや新しいものは生まれず、大きな凶事を招くだけです。",
      },
      372: {
        title: "ステージ4：分厚い覆い、賢者の知恵。",
        reason:
          "分厚い覆いによって、本来の輝きが隠されている状態です。しかし、日中に北斗七星を見るように、その暗闇の中でこそ、あなたは特別な知恵や仲間を見つけ出すことができます。",
      },
      373: {
        title: "ステージ5：下の者を引き立て、幸運を得る。",
        reason:
          "下の立場にいる、才能ある若者を積極的に引き立て、その輝きを世に示しているからです。その度量の大きいリーダーシップが、あなた自身にも慶びと幸運をもたらします。",
      },
      374: {
        title: "ステージ6：天からの隔絶、自己を見つめる時。",
        reason:
          "自分の家に天からの客人を招き入れず、3年間も顔を合わせないように、外界から完全に隔絶しているからです。その孤独な状態は、あなたに深い自己との対話を促し、内面を見つめ直させます。",
      },
      375: {
        title: "ステージ1：先走る勢い、しかし問題なし。",
        reason:
          "物事を始めたばかりの勢いで、つい先走ってしまう状況です。車輪を引くように前進しても、まだ足元が固まっていないため、尻尾が濡れるような小さな失敗は避けられません。しかし、この失敗を恐れず進むことが大切です。",
      },
      376: {
        title: "ステージ2：車輪の蓋をなくす、追うのは無駄。",
        reason:
          "大切なもの（車輪の蓋）を失いましたが、それに気づいていない状況です。七日も経てば、それは自然にあなたの元へ戻ってきます。今は焦って探し回る必要はありません。",
      },
      377: {
        title: "ステージ3：高宗、鬼方を討つ。",
        reason:
          "偉大な王である高宗が、3年という長い歳月をかけて、強大な敵である鬼方を討伐するように、非常に困難で時間のかかる大事業に取り組んでいるからです。未熟な者には任せられません。",
      },
      378: {
        title: "ステージ4：みすぼらしい衣服、しかし終日警戒。",
        reason:
          "豪華な衣服が、みすぼらしいボロ着になるほど、困難な状況が続いているからです。しかし、あなたは油断することなく、一日中警戒を続けています。その慎重な姿勢に、咎めはありません。",
      },
      379: {
        title: "ステージ5：隣人の祭祀、質素だが誠実。",
        reason:
          "隣人が牛を屠って盛大に行う祭祀よりも、あなたが質素に行う祭祀の方が、かえって多くの福を受け取るからです。それは、あなたの儀式に、より深い誠実さが込められているからです。",
      },
      380: {
        title: "ステージ6：頭を濡らす、信頼を失う。",
        reason:
          "勝利の祝杯で、酒に酔い、頭まで濡らしてしまっているからです。その気の緩みと節度のなさが、これまでの全ての信頼を失わせる原因となります。",
      },
      381: {
        title: "ステージ1：足を濡らす、まだ進める。",
        reason:
          "川を渡り始めたばかりで、まだ足首が濡れる程度の浅い段階だからです。その若さゆえの無謀さや未熟さは、この時点ではまだ大きな問題とはなりません。",
      },
      382: {
        title: "ステージ2：ふくらはぎを濡らす、幸運。",
        reason:
          "川の深みが、ふくらはぎに達するまで進んできましたが、そこは流れが穏やかで安全な場所だからです。あなたの望むことは、この安定した状況の中で、滞りなく叶えられます。",
      },
      383: {
        title: "ステージ3：腰まで濡れる、危機が迫る。",
        reason:
          "川の流れが腰にまで達し、危険がすぐそこに迫っている、非常に危うい状況だからです。この段階では、もはや自分一人の力で進むことはできません。",
      },
      384: {
        title: "ステージ4：乾いた場所へ、仲間との協力。",
        reason:
          "一度は濡れて困難な状況に陥りましたが、信頼できる仲間と協力することで、再び乾いた場所へと戻ってきたからです。その友情と協力関係が、あなたを危機から救います。",
      },
      385: {
        title: "ステージ5：丘を越える、問題なし。",
        reason:
          "目の前の丘を越え、困難な状況から完全に脱出した、安定した段階だからです。その姿は、まるで太陽が中天に輝くように、一点の曇りもなく、咎められることはありません。",
      },
      386: {
        title: "ステージ6：勝利の祝杯、しかし油断は禁物。",
        reason:
          "未完成の物語を渡り切り、仲間と共に勝利の祝杯をあげている、喜ばしい状況だからです。しかし、ここで飲み過ぎて頭まで濡らすように、度を越した気の緩みは、これまでの全ての信頼を失う原因となります。節度を保つことが最後の試練です。",
      },
    },
    // 大象伝（たいしょうでん）：自然の象徴から学ぶ基本戦略
    tai_sho_den: {
      1: "【象徴】宇宙（天）が、休むことなく力強く動き続けている風景。\n【戦略】この姿に倣い、常に自己研鑽に励み、成長のために努力し続ける。",
      2: "【象徴】大地が、その厚みですべてのものを静かに受け止め、支えている風景。\n【戦略】その厚い徳を見習い、どんな人や物事も受け入れる度量を持ち、その存在を支える。",
      3: "【象徴】嵐の前の、雲（水）と雷が入り乱れてエネルギーが渦巻いている風景。\n【戦略】この混沌とした状況から、物事の筋道（経綸）を解きほぐし、新たな秩序や計画を立て直す。",
      4: "【象徴】山の麓から、こんこんと泉（水）が湧き出ている風景。\n【戦略】湧き出る泉のように、果敢に行動を起こすことで、自分の徳を養い育てる。",
      5: "【象徴】雲が天の上まで昇り、雨が降るのを待っている風景。\n【戦略】焦らず、時が来るまでは飲食を楽しむように、心安らかに待つ。",
      6: "【象徴】天は上へ、水は下へと、互いに背を向けて進む対立の風景。\n【戦略】争いごとは、常に最初の計画段階を慎重に考慮することで、未然に防ぐ。",
      7: "【象徴】大地の中に、見えない水脈が豊かに広がっている風景。\n【戦略】人々を受け入れ、組織（衆）を養い育てることで、大きな力を動かす。",
      8: "【象徴】大地の上に、水が寄り添うように広がっている風景。\n【戦略】かつての王がそうしたように、多くのコミュニティ（万国）を認め、そのリーダーたち（諸侯）と親しく交わる。",
      9: "【象徴】天上を風が吹き渡り、まだ雲（雨）にはならない風景。\n【戦略】すぐに結果を求めず、学問や芸術などの内面的な徳（文徳）を磨き、自分を美しくする。",
      10: "【象徴】天の下に、人々が喜ぶ沢がある、安定した風景。\n【戦略】社会の上下関係や役割分担（上下）を明確にし、人々の心を安定させる。",
      11: "【象徴】天の気と地の気が活発に交わる、最高の調和の風景。\n【戦略】自然の法則をうまく活用し、その恵みが人々に適切に行き渡るようマネジメントする。",
      12: "【象徴】天と地が交わらず、すべてが停滞している閉塞の風景。\n【戦略】自分の徳を磨いて災難を避け、与えられた給料（禄）で驕り高ぶるようなことはしない。",
      13: "【象徴】天も火も、同じく上へ向かう性質を持つ風景。\n【戦略】同じ性質を持つ仲間と、そうでない者を客観的に分類し、物事の違いを明確にする。",
      14: "【象徴】太陽（火）が中天に輝き、すべてを照らしている風景。\n【戦略】悪しきものを抑え、善きものを称揚し、天の意思に従う。",
      15: "【象徴】高い山が、大地より低い位置にある（見える）という謙虚な風景。\n【戦略】富める所から取り、貧しい所へ分け与え、社会全体のバランスを取る。",
      16: "【象徴】春になり、地中から雷（生命力）が奮い起こる喜びの風景。\n【戦略】音楽などでその喜びを表現し、神や祖先に感謝を捧げる。",
      17: "【象徴】沢の中に雷のエネルギーが収まっている、休息の風景。\n【戦略】日が暮れたら仕事をやめ、仲間と宴を開いて休息する。",
      18: "【象徴】山の下を風が吹き、物が淀んで腐敗する風景。\n【戦略】人々の気力を奮い立たせ、自らの徳を養い直すことで、淀んだ空気を一新する。",
      19: "【象徴】大地が沢に臨むように、人々の上に立つ風景。\n【戦略】人々を教え導く思いに際限なく、民衆を受け入れ守る心も無限であるべきだ。",
      20: "【象徴】風が地上を隈なく吹き渡り、すべてを観察する風景。\n【戦略】現場を視察し、人々の暮らしぶりをよく観て、実情に合った教育や制度を設ける。",
      21: "【象徴】雷（威力）と稲妻（明智）が合わさり、障害を噛み砕く風景。\n【戦略】罰則を明確にし、法律を分かりやすくすることで、社会の秩序を保つ。",
      22: "【象徴】山の麓を火が照らし、物事が美しく明らかになる風景。\n【戦略】政治はオープンにするが、人の運命を左右する裁判は慎重に行い、軽々しく断を下さない。",
      23: "【象徴】高い山が、大地に浸食され、剥がれ落ちていく風景。\n【戦略】上の者は、下の者の生活が不安定にならないよう、その待遇を厚くし、住まいを安定させる。",
      24: "【象徴】冬至のように、地中に生命力（雷）が回復し始める風景。\n【戦略】無理に活動せず、門を閉じて静かに休養し、エネルギーの回復に専念する。",
      25: "【象徴】天の下で雷が鳴り響き、万物が自然のままに活動する風景。\n【戦略】季節の運行に合わせて、万物が最も良く育つように手助けする。",
      26: "【象徴】山の中に、天のエネルギーが大きく蓄えられている風景。\n【戦略】過去の賢者の言葉や行いを多く学び、それを自分自身の徳として蓄積する。",
      27: "【象徴】上顎（山）と下顎（雷）が合わさった「口」の風景。\n【戦略】口に入れるものと、口から出すもの、つまり飲食と発言を慎み、自己を正しく養う。",
      28: "【象徴】沢の水が溢れ、風で木が倒れるような異常事態の風景。\n【戦略】一人で立っても信念を曲げず、世間から離れても悩み苦しまない、強い精神を持つ。",
      29: "【象徴】水が次から次へと流れ来て、険しい場所を越えていく風景。\n【戦略】良い行いを常に続け、教えるべきことは繰り返し教え、困難に慣れさせる。",
      30: "【象徴】太陽（火）と月（火）のように、二つの明かりが重なり合う風景。\n【戦略】先人の明智を受け継ぎ、その光で世の中の隅々までを照らし続ける。",
      31: "【象徴】山の上に沢があり、そのくぼみが水を受け入れる風景。\n【戦略】心を空っぽにし、先入観なく相手を受け入れることで、真の感応が生まれる。",
      32: "【象徴】激しく動く雷と、常に入り込む風が共存する風景。\n【戦略】一度定めた自分の立場や方針を、軽々しく変えない。",
      33: "【象徴】天の下に山がそびえ、俗世間から距離を置いている風景。\n【戦略】レベルの低い相手からは距離を置く。それは憎しみからではなく、厳然とした態度として示す。",
      34: "【象徴】雷が天上で鳴り響く、エネルギーが最高潮の風景。\n【戦略】勢いがある時こそ、決して礼儀に反するような行動はしない。",
      35: "【象徴】太陽（火）が地平線から昇り、地上を照らし始める風景。\n【戦略】自分から進んで、自らが持つ素晴らしい徳を世の中に明らかにする。",
      36: "【象徴】明るい太陽（火）が地中に沈み、光が隠された風景。\n【戦略】大衆を相手にする時は、あえて知恵を隠す（愚かなふりをする）ことで、かえって本質を見失わない。",
      37: "【象徴】家庭内で、火（感情）から風（言葉）が生まれる風景。\n【戦略】言葉には中身があり、行動には一貫性があるように心がける。",
      38: "【象徴】火は上へ、沢は下へと、性質がそむき合う風景。\n【戦略】周りと協調しながらも、自分独自の意見や立場は失わない。",
      39: "【象徴】山の上に水があり、進むに行き詰まる困難な風景。\n【戦略】外に進めない困難な時は、自分の内面に立ち返り、徳を修めることに専念する。",
      40: "【象徴】雷と雨が作用し、凍てついたものが解けていく風景。\n【戦略】人の過ちを赦し、罪を寛大に扱うことで、緊張を緩和させる。",
      41: "【象徴】山の下にある沢の水が、土に吸い取られて損なわれる風景。\n【戦略】カッとなる怒りを抑え、尽きることのない欲望を塞き止める。",
      42: "【象徴】風と雷が互いに力を強め合い、利益をもたらす風景。\n【戦略】良い手本を見ればすぐに見習い、自分の過ちに気づけばすぐに改める。",
      43: "【象徴】沢の水が蒸発し、天にまで昇る決壊の風景。\n【戦略】自分が得た恩恵（禄）は下の者に施し、徳を独り占めしない。",
      44: "【象徴】天の下を、風が隅々まで吹き渡る風景。\n【戦略】君主として、命令を出し、それを国の隅々まで告げ知らせる。",
      45: "【象徴】沢の水が、大地の上に集まってくる風景。\n【戦略】人々が集まる時こそ、武器を整備し、予期せぬ出来事に備える。",
      46: "【象徴】大地の中から、木がまっすぐ上に成長していく風景。\n【戦略】徳に従い、小さな努力を積み重ねて、大きく成長する。",
      47: "【象徴】沢から水がなくなり、干上がって困窮している風景。\n【戦略】困窮した時こそ、命を懸けてでも自分の志を最後まで遂げようとする。",
      48: "【象徴】釣瓶で井戸の水を汲み上げる風景。\n【戦略】人々の苦労をねぎらい、互いに助け合うよう奨励する。",
      49: "【象徴】沢の水が火を消し、火が沢の水を蒸発させる革命の風景。\n【戦略】暦（カレンダー）を制定し、人々が行動すべき時を明らかにする。",
      50: "【象徴】薪（木）の上で火が燃え、鼎で食物を煮る安定の風景。\n【戦略】自分の地位や役目を正しく認識し、天から与えられた使命を固く守る。",
      51: "【象徴】雷が繰り返し鳴り響き、人々が恐れおののく風景。\n【戦略】天の警告を恐れ、常に自分を戒め、行いを省みる。",
      52: "【象徴】山が二つ重なり、どっしりと動かない風景。\n【戦略】何を思うにせよ、自分の立場や本分を決して逸脱しない。",
      53: "【象徴】山の上に木が少しずつ順序立てて育っていく風景。\n【戦略】自らの徳を磨き、その影響力で世の中の風俗を善導する。",
      54: "【象徴】若い少女（沢）の上に、激しい男（雷）がいる不安定な風景。\n【戦略】物事が長く続けば、その終わりには必ず弊害が生じることを知っておく。",
      55: "【象徴】雷の威厳と稲妻の明智が共に至る、盛大な風景。\n【戦略】訴訟を正しく裁断し、刑罰を厳正に行う。",
      56: "【象徴】山の上で火が燃える、不安定な旅先の風景。\n【戦略】刑罰は慎重に判断し、しかし一度決めたら訴訟を引き延ばしたりはしない。",
      57: "【象徴】風が風に従うように、命令が隅々まで浸透していく風景。\n【戦略】重要な命令は繰り返し伝え、物事を着実に実行させる。",
      58: "【象徴】沢が連なり、水が交流する喜びの風景。\n【戦略】友人たちと共に集い、学問を論じ、互いに学び合う。",
      59: "【象徴】風が水面を吹き、淀みを霧散させる風景。\n【戦略】神を祀り、宗廟を建てることで、人々の心を一つにまとめる。",
      60: "【象徴】沢の上に水があり、満杯になれば溢れる、節度の風景。\n【戦略】物事の適切な基準（数度）を定め、何が徳のある行いかを議論する。",
      61: "【象徴】沢の上に風が吹き、その真心が水面に影響を与える風景。\n【戦略】訴訟は慎重に審議し、死罪はできるだけ寛大な措置をとる。",
      62: "【象徴】山の上に雷鳴が轟く、非日常的な風景。\n【戦略】行動は恭しく、葬儀は悲しみを深く、生活は倹約をと、何事も「少しだけ度を過ごす」くらいが丁度良い。",
      63: "【象徴】水が火の上にあり、安定している完成の風景。\n【戦略】物事が完成した時こそ、将来起こりうる災いを考え、あらかじめ防ぐ。",
      64: "【象徴】火が水の上にあり、まだ安定しない未完成の風景。\n【戦略】物事の違いを慎重に見極め、それぞれが最もふさわしい場所（方）に収まるように配慮する。",
    },
    // 雑卦伝（ざっかでん）：二つの卦の対比による本質解説
    zatsu_ka_den: {
      1: {
        pair_id: 2,
        pair_name: "坤為地",
        contrast_theme: "剛と柔",
        explanation:
          "乾為天は、トップダウンで物事を進める「剛」のリーダーシップです。坤為地は、すべてを受け入れ支える「柔」のフォロワーシップです。",
      },
      2: {
        pair_id: 1,
        pair_name: "乾為天",
        contrast_theme: "剛と柔",
        explanation:
          "乾為天は、トップダウンで物事を進める「剛」のリーダーシップです。坤為地は、すべてを受け入れ支える「柔」のフォロワーシップです。",
      },
      3: {
        pair_id: 4,
        pair_name: "山水蒙",
        contrast_theme: "スタートアップと新入社員",
        explanation:
          "水雷屯は、産みの苦しみの中にいるが、その存在は「見えている」スタートアップのような状態です。山水蒙は、知識が「雑然」としていて未熟ですが、やがてその本性が明らかになる新入社員のような状態です。",
      },
      4: {
        pair_id: 3,
        pair_name: "水雷屯",
        contrast_theme: "スタートアップと新入社員",
        explanation:
          "水雷屯は、産みの苦しみの中にいるが、その存在は「見えている」スタートアップのような状態です。山水蒙は、知識が「雑然」としていて未熟ですが、やがてその本性が明らかになる新入社員のような状態です。",
      },
      5: {
        pair_id: 6,
        pair_name: "天水訟",
        contrast_theme: "待つ知恵と争いの衝動",
        explanation:
          "水天需は、食を求め、好機を「待つ」という知恵の状態です。天水訟は、飲食や資源を巡って必ず起こる「争い」の衝動です。",
      },
      6: {
        pair_id: 5,
        pair_name: "水天需",
        contrast_theme: "争いの衝動と待つ知恵",
        explanation:
          "天水訟は、飲食や資源を巡って必ず起こる「争い」の衝動です。水天需は、食を求め、好機を「待つ」という知恵の状態です。",
      },
      7: {
        pair_id: 8,
        pair_name: "水地比",
        contrast_theme: "ストレスと喜び",
        explanation:
          "地水師は、組織として戦う「憂いやストレス」を伴う状況です。水地比は、気の合う仲間と親しむ「楽しい」時間です。",
      },
      8: {
        pair_id: 7,
        pair_name: "地水師",
        contrast_theme: "喜びとストレス",
        explanation:
          "水地比は、気の合う仲間と親しむ「楽しい」時間です。地水師は、組織として戦う「憂いやストレス」を伴う状況です。",
      },
      9: {
        pair_id: 10,
        pair_name: "天沢履",
        contrast_theme: "少しの蓄えと、止まらない実践",
        explanation:
          "風天小畜は、何かに邪魔をされて、まだ力が「寡ない（少ない）」、少ししか蓄えられない状態です。天沢履は、礼儀作法に則って常に正しく行動し続ける、「一つの所に処（とど）まらない」プロセスそのものです。",
      },
      10: {
        pair_id: 9,
        pair_name: "風天小畜",
        contrast_theme: "止まらない実践と、少しの蓄え",
        explanation:
          "天沢履は、礼儀作法に則って常に正しく行動し続ける、「一つの所に処（とど）まらない」プロセスそのものです。風天小畜は、何かに邪魔をされて、まだ力が「寡ない（少ない）」、少ししか蓄えられない状態です。",
      },
      11: {
        pair_id: 12,
        pair_name: "天地否",
        contrast_theme: "天国と地獄",
        explanation:
          "地天泰は、物事がスムーズに通る最高の状態です。天地否は、完全に停滞した最悪の状態で、両者は正反対のエネルギーです。",
      },
      12: {
        pair_id: 11,
        pair_name: "地天泰",
        contrast_theme: "地獄と天国",
        explanation:
          "地天泰は、物事がスムーズに通る最高の状態です。天地否は、完全に停滞した最悪の状態で、両者は正反対のエネルギーです。",
      },
      13: {
        pair_id: 14,
        pair_name: "火天大有",
        contrast_theme: "プロセスと結果",
        explanation:
          "天火同人は、目的のために人と「親しくなっていくプロセス」そのものです。火天大有は、多くの富や人材が「集まった結果」の状態です。",
      },
      14: {
        pair_id: 13,
        pair_name: "天火同人",
        contrast_theme: "結果とプロセス",
        explanation:
          "火天大有は、多くの富や人材が「集まった結果」の状態です。天火同人は、目的のために人と「親しくなっていくプロセス」そのものです。",
      },
      15: {
        pair_id: 16,
        pair_name: "雷地豫",
        contrast_theme: "謙虚さと怠慢",
        explanation:
          "地山謙の徳を持つ人は、余計なものがなく身が「軽やか」です。雷地予の喜びだけに浸っていると、人は「怠惰」になりがちです。",
      },
      16: {
        pair_id: 15,
        pair_name: "地山謙",
        contrast_theme: "怠慢と謙虚さ",
        explanation:
          "地山謙の徳を持つ人は、余計なものがなく身が「軽やか」です。雷地予の喜びだけに浸っていると、人は「怠惰」になりがちです。",
      },
      17: {
        pair_id: 18,
        pair_name: "山風蠱",
        contrast_theme: "喜びと腐敗",
        explanation:
          "沢雷随は人や物事に喜んで従うことです。山風蠱は事がなくて腐敗することです。（この解説はプロジェクトの文脈に合わせて調整の余地があります）",
      },
      18: {
        pair_id: 17,
        pair_name: "沢雷随",
        contrast_theme: "腐敗と喜び",
        explanation:
          "沢雷随は人や物事に喜んで従うことです。山風蠱は事がなくて腐敗することです。（この解説はプロジェクトの文脈に合わせて調整の余地があります）",
      },
      19: {
        pair_id: 20,
        pair_name: "風地観",
        contrast_theme: "与えるリーダーと求めるリーダー",
        explanation:
          "地沢臨は、人々の上に立ち、影響力を「与える」カリスマリーダーのあり方です。風地観は、人々を観察し、そこから何かを学び「求める」賢者タイプのリーダーのあり方です。",
      },
      20: {
        pair_id: 19,
        pair_name: "地沢臨",
        contrast_theme: "求めるリーダーと与えるリーダー",
        explanation:
          "地沢臨は、人々の上に立ち、影響力を「与える」カリスマリーダーのあり方です。風地観は、人々を観察し、そこから何かを学び「求める」賢者タイプのリーダーのあり方です。",
      },
      21: {
        pair_id: 22,
        pair_name: "山火賁",
        contrast_theme: "本質と装飾",
        explanation:
          "火雷噬嗑は、障害物を「食う」ように、物事の本質をむき出しにすることです。山火賁は、本質（色のないもの）を「美しく飾る」ことです。",
      },
      22: {
        pair_id: 21,
        pair_name: "火雷噬嗑",
        contrast_theme: "装飾と本質",
        explanation:
          "火雷噬嗑は、障害物を「食う」ように、物事の本質をむき出しにすることです。山火賁は、本質（色のないもの）を「美しく飾る」ことです。",
      },
      23: {
        pair_id: 24,
        pair_name: "地雷復",
        contrast_theme: "終わりと始まり",
        explanation:
          "山地剝は物事が剥がれ落ちていく「終わり」を示します。地雷復はそこから再び物事が「還って来る」始まりの時です。",
      },
      24: {
        pair_id: 23,
        pair_name: "山地剝",
        contrast_theme: "始まりと終わり",
        explanation:
          "山地剝は物事が剥がれ落ちていく「終わり」を示します。地雷復はそこから再び物事が「還って来る」始まりの時です。",
      },
      25: {
        pair_id: 26,
        pair_name: "山天大畜",
        contrast_theme: "災いと時",
        explanation:
          "天雷无妄は自然体でいることで時に「災い」を招きます。山天大畜は「時」を知って行動する賢明さです。",
      },
      26: {
        pair_id: 25,
        pair_name: "天雷无妄",
        contrast_theme: "時と災い",
        explanation:
          "天雷无妄は自然体でいることで時に「災い」を招きます。山天大畜は「時」を知って行動する賢明さです。",
      },
      27: {
        pair_id: 28,
        pair_name: "沢風大過",
        contrast_theme: "健康と不摂生",
        explanation:
          "山雷頤は、心身を「正しく養う」健康的な状態です。沢風大過は、そのバランスが崩れ、無理がたたった「顛覆（ひっくり返る）」状態です。",
      },
      28: {
        pair_id: 27,
        pair_name: "山雷頤",
        contrast_theme: "不摂生と健康",
        explanation:
          "山雷頤は、心身を「正しく養う」健康的な状態です。沢風大過は、そのバランスが崩れ、無理がたたった「顛覆（ひっくり返る）」状態です。",
      },
      29: {
        pair_id: 30,
        pair_name: "離為火",
        contrast_theme: "悩みと知性",
        explanation:
          "坎為水は、困難に「陥り」悩んでいる状態です。離為火は、知性の光で物事を照らし、他者に影響を「与えている（麗つく）」状態です。",
      },
      30: {
        pair_id: 29,
        pair_name: "坎為水",
        contrast_theme: "知性と悩み",
        explanation:
          "坎為水は、困難に「陥り」悩んでいる状態です。離為火は、知性の光で物事を照らし、他者に影響を「与えている（麗つく）」状態です。",
      },
      31: {
        pair_id: 32,
        pair_name: "雷風恒",
        contrast_theme: "瞬間と継続",
        explanation:
          "沢山咸は、若者が恋に落ちるような「速やか」で瞬間的な感応です。雷風恒は、夫婦のように「久しい」継続的な関係です。",
      },
      32: {
        pair_id: 31,
        pair_name: "沢山咸",
        contrast_theme: "継続と瞬間",
        explanation:
          "沢山咸は、若者が恋に落ちるような「速やか」で瞬間的な感応です。雷風恒は、夫婦のように「久しい」継続的な関係です。",
      },
      33: {
        pair_id: 34,
        pair_name: "雷天大壮",
        contrast_theme: "撤退と前進",
        explanation:
          "天山遯は、戦略的に「退く」ことです。雷天大壮は、力強く「前進する」ことです。",
      },
      34: {
        pair_id: 33,
        pair_name: "天山遯",
        contrast_theme: "前進と撤退",
        explanation:
          "天山遯は、戦略的に「退く」ことです。雷天大壮は、力強く「前進する」ことです。",
      },
      35: {
        pair_id: 36,
        pair_name: "地火明夷",
        contrast_theme: "昼と夜",
        explanation:
          "火地晋は、昼間のごとく物事が明らかになることです。地火明夷は、夜のように光明が傷つけられることです。",
      },
      36: {
        pair_id: 35,
        pair_name: "火地晋",
        contrast_theme: "夜と昼",
        explanation:
          "火地晋は、昼間のごとく物事が明らかになることです。地火明夷は、夜のように光明が傷つけられることです。",
      },
      37: {
        pair_id: 38,
        pair_name: "火沢睽",
        contrast_theme: "内と外",
        explanation:
          "風火家人は、家庭や組織など「内側」の秩序を重んじる状態です。火沢睽は、心が「外」を向き、互いにそむき合っている状態です。",
      },
      38: {
        pair_id: 37,
        pair_name: "風火家人",
        contrast_theme: "外と内",
        explanation:
          "風火家人は、家庭や組織など「内側」の秩序を重んじる状態です。火沢睽は、心が「外」を向き、互いにそむき合っている状態です。",
      },
      39: {
        pair_id: 40,
        pair_name: "雷水解",
        contrast_theme: "停滞と前進",
        explanation:
          "水山蹇は、足踏みをして進めない「困難」な状態です。雷水解は、問題が「緩み」、物事が解決に向かう状態です。",
      },
      40: {
        pair_id: 39,
        pair_name: "水山蹇",
        contrast_theme: "前進と停滞",
        explanation:
          "水山蹇は、足踏みをして進めない「困難」な状態です。雷水解は、問題が「緩み」、物事が解決に向かう状態です。",
      },
      41: {
        pair_id: 42,
        pair_name: "風雷益",
        contrast_theme: "衰退と隆盛の始まり",
        explanation:
          "山沢損も風雷益も、現状を変化させ、新たな盛衰のサイクルを開始させるスイッチです。（損は衰えの始まり、益は盛りの始まり）",
      },
      42: {
        pair_id: 41,
        pair_name: "山沢損",
        contrast_theme: "隆盛と衰退の始まり",
        explanation:
          "山沢損も風雷益も、現状を変化させ、新たな盛衰のサイクルを開始させるスイッチです。（損は衰えの始まり、益は盛りの始まり）",
      },
      43: {
        pair_id: 44,
        pair_name: "天風姤",
        contrast_theme: "決別と出会い",
        explanation:
          "沢天夬は、陽が陰を「決断し断ち切る」ことです。天風姤は、陰が陽に「出会う」ことです。",
      },
      44: {
        pair_id: 43,
        pair_name: "沢天夬",
        contrast_theme: "出会いと決別",
        explanation:
          "沢天夬は、陽が陰を「決断し断ち切る」ことです。天風姤は、陰が陽に「出会う」ことです。",
      },
      45: {
        pair_id: 46,
        pair_name: "地風升",
        contrast_theme: "集合と上昇",
        explanation:
          "沢地萃は、人々が「集まる」ことです。地風升は、集まったものが「上に昇る」ことです。",
      },
      46: {
        pair_id: 45,
        pair_name: "沢地萃",
        contrast_theme: "上昇と集合",
        explanation:
          "沢地萃は、人々が「集まる」ことです。地風升は、集まったものが「上に昇る」ことです。",
      },
      47: {
        pair_id: 48,
        pair_name: "水風井",
        contrast_theme: "相互作用と自己完結",
        explanation:
          "沢水困は、互いに作用しあって「困窮する」ことです。水風井は、他に頼らず、自己の徳によって「自らを養う」ことです。",
      },
      48: {
        pair_id: 47,
        pair_name: "沢水困",
        contrast_theme: "自己完結と相互作用",
        explanation:
          "沢水困は、互いに作用しあって「困窮する」ことです。水風井は、他に頼らず、自己の徳によって「自らを養う」ことです。",
      },
      49: {
        pair_id: 50,
        pair_name: "火風鼎",
        contrast_theme: "破壊と創造",
        explanation:
          "沢火革は、古いシステムをスクラップ＆ビルドで「刷新する」ことです。火風鼎は、革命の後に「新しい文化や組織を安定させる」器そのものです。",
      },
      50: {
        pair_id: 49,
        pair_name: "沢火革",
        contrast_theme: "創造と破壊",
        explanation:
          "沢火革は、古いシステムをスクラップ＆ビルドで「刷新する」ことです。火風鼎は、革命の後に「新しい文化や組織を安定させる」器そのものです。",
      },
      51: {
        pair_id: 52,
        pair_name: "艮為山",
        contrast_theme: "アクションとストップ",
        explanation:
          "震為雷は、雷のように物事を「始める」アクションです。艮為山は、山のように動かず、物事を「止める」ストッパーです。",
      },
      52: {
        pair_id: 51,
        pair_name: "震為雷",
        contrast_theme: "ストップとアクション",
        explanation:
          "震為雷は、雷のように物事を「始める」アクションです。艮為山は、山のように動かず、物事を「止める」ストッパーです。",
      },
      53: {
        pair_id: 54,
        pair_name: "雷沢帰妹",
        contrast_theme: "プロセスと結果",
        explanation:
          "風山漸は、女性が嫁ぐ（帰）ために、男性の正式なアプローチを「待つ」という順序・プロセスです。雷沢帰妹は、順序を無視してでも、女性が嫁ぐ（終）という結果を急ぐ状態です。",
      },
      54: {
        pair_id: 53,
        pair_name: "風山漸",
        contrast_theme: "結果とプロセス",
        explanation:
          "風山漸は、女性が嫁ぐ（帰）ために、男性の正式なアプローチを「待つ」という順序・プロセスです。雷沢帰妹は、順序を無視してでも、女性が嫁ぐ（終）という結果を急ぐ状態です。",
      },
      55: {
        pair_id: 56,
        pair_name: "火山旅",
        contrast_theme: "多忙と孤独",
        explanation:
          "雷火豊は、成功の極みで、かえって予期せぬ「事故や用事が多い」状態です。火山旅は、頼れる人が少ない「孤独」な状態です。",
      },
      56: {
        pair_id: 55,
        pair_name: "雷火豊",
        contrast_theme: "孤独と多忙",
        explanation:
          "雷火豊は、成功の極みで、かえって予期せぬ「事故や用事が多い」状態です。火山旅は、頼れる人が少ない「孤独」な状態です。",
      },
      57: {
        pair_id: 58,
        pair_name: "兌為沢",
        contrast_theme: "水面下と表舞台",
        explanation:
          "巽為風は、風のように人に伏し従い、水面下で「浸透していく」ことです。兌為沢は、喜びや意見をオープンに「表現し現れる」ことです。",
      },
      58: {
        pair_id: 57,
        pair_name: "巽為風",
        contrast_theme: "表舞台と水面下",
        explanation:
          "巽為風は、風のように人に伏し従い、水面下で「浸透していく」ことです。兌為沢は、喜びや意見をオープンに「表現し現れる」ことです。",
      },
      59: {
        pair_id: 60,
        pair_name: "水沢節",
        contrast_theme: "拡散と集約",
        explanation:
          "風水渙は、淀んだエネルギーを霧のように「解き散らす」ことです。水沢節は、規律によってエネルギーが外に漏れないよう「引き締める」ことです。",
      },
      60: {
        pair_id: 59,
        pair_name: "風水渙",
        contrast_theme: "集約と拡散",
        explanation:
          "風水渙は、淀んだエネルギーを霧のように「解き散らす」ことです。水沢節は、規律によってエネルギーが外に漏れないよう「引き締める」ことです。",
      },
      61: {
        pair_id: 62,
        pair_name: "雷山小過",
        contrast_theme: "真心とやり過ぎ",
        explanation:
          "風沢中孚は、行動の根底にある偽りのない「真心」そのものです。雷山小過は、誠実さのあまり「少しやり過ぎる」ほどの丁寧さです。",
      },
      62: {
        pair_id: 61,
        pair_name: "風沢中孚",
        contrast_theme: "やり過ぎと真心",
        explanation:
          "風沢中孚は、行動の根底にある偽りのない「真心」そのものです。雷山小過は、誠実さのあまり「少しやり過ぎる」ほどの丁寧さです。",
      },
      63: {
        pair_id: 64,
        pair_name: "火水未済",
        contrast_theme: "完成と未完",
        explanation:
          "水火既済は、すべてが整った「完成」の状態です。火水未済は、まだ物事が完成せず、挑戦の途上にある「未完」の状態です。",
      },
      64: {
        pair_id: 63,
        pair_name: "水火既済",
        contrast_theme: "未完と完成",
        explanation:
          "水火既済は、すべてが整った「完成」の状態です。火水未済は、まだ物事が完成せず、挑戦の途上にある「未完」の状態です。",
      },
    },
    // 序卦伝（じょかでん）：64卦のストーリー
    jo_ka_den: {
      1: {
        from_prev: null,
        to_next: {
          next_id: 2,
          next_name: "坤為地",
          explanation:
            "すべての物語は、創造のエネルギーである天（乾）と、それを受け入れる大地（坤）から始まります。",
        },
      },
      2: {
        from_prev: {
          prev_id: 1,
          prev_name: "乾為天",
          explanation:
            "すべての物語は、創造のエネルギーである天（乾）と、それを受け入れる大地（坤）から始まります。",
        },
        to_next: {
          next_id: 3,
          next_name: "水雷屯",
          explanation:
            "天地があって初めて万物が生まれますが、その始まりは混沌とした産みの苦しみ（屯）に満ちています。",
        },
      },
      3: {
        from_prev: {
          prev_id: 2,
          prev_name: "坤為地",
          explanation:
            "天地があって初めて万物が生まれますが、その始まりは混沌とした産みの苦しみ（屯）に満ちています。",
        },
        to_next: {
          next_id: 4,
          next_name: "山水蒙",
          explanation:
            "生まれたばかりのものは、まだ何も知らない幼く蒙昧（もうまい）な状態（蒙）です。",
        },
      },
      4: {
        from_prev: {
          prev_id: 3,
          prev_name: "水雷屯",
          explanation:
            "生まれたばかりのものは、まだ何も知らない幼く蒙昧（もうまい）な状態（蒙）です。",
        },
        to_next: {
          next_id: 5,
          next_name: "水天需",
          explanation: "幼いものを養うには、まず飲食（需）が必要です。",
        },
      },
      5: {
        from_prev: {
          prev_id: 4,
          prev_name: "山水蒙",
          explanation: "幼いものを養うには、まず飲食（需）が必要です。",
        },
        to_next: {
          next_id: 6,
          next_name: "天水訟",
          explanation: "飲食を巡っては、必ず争い（訟）が起こります。",
        },
      },
      6: {
        from_prev: {
          prev_id: 5,
          prev_name: "水天需",
          explanation: "飲食を巡っては、必ず争い（訟）が起こります。",
        },
        to_next: {
          next_id: 7,
          next_name: "地水師",
          explanation: "争いが起これば、必ず多くの人々（師）が立ち上がります。",
        },
      },
      7: {
        from_prev: {
          prev_id: 6,
          prev_name: "天水訟",
          explanation: "争いが起これば、必ず多くの人々（師）が立ち上がります。",
        },
        to_next: {
          next_id: 8,
          next_name: "水地比",
          explanation:
            "多くの人々が集まれば、自然と親しみ合う関係（比）が生まれます。",
        },
      },
      8: {
        from_prev: {
          prev_id: 7,
          prev_name: "地水師",
          explanation:
            "多くの人々が集まれば、自然と親しみ合う関係（比）が生まれます。",
        },
        to_next: {
          next_id: 9,
          next_name: "風天小畜",
          explanation:
            "人々が親しみ合うだけでは、まだ大きな力にはなりません。少しだけ蓄える（小畜）段階が必要です。",
        },
      },
      9: {
        from_prev: {
          prev_id: 8,
          prev_name: "水地比",
          explanation:
            "人々が親しみ合うだけでは、まだ大きな力にはなりません。少しだけ蓄える（小畜）段階が必要です。",
        },
        to_next: {
          next_id: 10,
          next_name: "天沢履",
          explanation: "蓄えるものがあれば、礼儀作法（履）が生まれます。",
        },
      },
      10: {
        from_prev: {
          prev_id: 9,
          prev_name: "風天小畜",
          explanation: "蓄えるものがあれば、礼儀作法（履）が生まれます。",
        },
        to_next: {
          next_id: 11,
          next_name: "地天泰",
          explanation: "礼儀作法が確立して初めて、物事が安泰（泰）になります。",
        },
      },
      11: {
        from_prev: {
          prev_id: 10,
          prev_name: "天沢履",
          explanation: "礼儀作法が確立して初めて、物事が安泰（泰）になります。",
        },
        to_next: {
          next_id: 12,
          next_name: "天地否",
          explanation:
            "しかし、安泰な状態は永遠には続かず、いずれ停滞し、閉塞（否）します。",
        },
      },
      12: {
        from_prev: {
          prev_id: 11,
          prev_name: "地天泰",
          explanation:
            "しかし、安泰な状態は永遠には続かず、いずれ停滞し、閉塞（否）します。",
        },
        to_next: {
          next_id: 13,
          next_name: "天火同人",
          explanation:
            "ただ閉塞したままでは終われません。必ず人と協力し、同調する（同人）ことで、道は開けます。",
        },
      },
      13: {
        from_prev: {
          prev_id: 12,
          prev_name: "天地否",
          explanation:
            "ただ閉塞したままでは終われません。必ず人と協力し、同調する（同人）ことで、道は開けます。",
        },
        to_next: {
          next_id: 14,
          next_name: "火天大有",
          explanation:
            "人と協力することで、多くのものを所有する（大有）段階に至ります。",
        },
      },
      14: {
        from_prev: {
          prev_id: 13,
          prev_name: "天火同人",
          explanation:
            "人と協力することで、多くのものを所有する（大有）段階に至ります。",
        },
        to_next: {
          next_id: 15,
          next_name: "地山謙",
          explanation:
            "多くのものを所有すれば、必ず驕りが生まれます。だからこそ謙虚さ（謙）が必要になります。",
        },
      },
      15: {
        from_prev: {
          prev_id: 14,
          prev_name: "火天大有",
          explanation:
            "多くのものを所有すれば、必ず驕りが生まれます。だからこそ謙虚さ（謙）が必要になります。",
        },
        to_next: {
          next_id: 16,
          next_name: "雷地豫",
          explanation: "謙虚でいれば、必ず喜ばしいこと（豫）が起こります。",
        },
      },
      16: {
        from_prev: {
          prev_id: 15,
          prev_name: "地山謙",
          explanation: "謙虚でいれば、必ず喜ばしいこと（豫）が起こります。",
        },
        to_next: {
          next_id: 17,
          next_name: "沢雷随",
          explanation: "喜びがあれば、人は必ずそれに従い（随）、ついてきます。",
        },
      },
      17: {
        from_prev: {
          prev_id: 16,
          prev_name: "雷地豫",
          explanation: "喜びがあれば、人は必ずそれに従い（随）、ついてきます。",
        },
        to_next: {
          next_id: 18,
          next_name: "山風蠱",
          explanation:
            "しかし、ただ喜んで従うだけでは、いずれ物事は腐敗し、弊害（蠱）が生じます。",
        },
      },
      18: {
        from_prev: {
          prev_id: 17,
          prev_name: "沢雷随",
          explanation:
            "しかし、ただ喜んで従うだけでは、いずれ物事は腐敗し、弊害（蠱）が生じます。",
        },
        to_next: {
          next_id: 19,
          next_name: "地沢臨",
          explanation:
            "弊害を取り除くという大きな事業（蠱）を成し遂げた後、人々の上に立つ（臨）ことができます。",
        },
      },
      19: {
        from_prev: {
          prev_id: 18,
          prev_name: "山風蠱",
          explanation:
            "弊害を取り除くという大きな事業（蠱）を成し遂げた後、人々の上に立つ（臨）ことができます。",
        },
        to_next: {
          next_id: 20,
          next_name: "風地観",
          explanation:
            "人々の上に立てば、今度は人々をよく観察する（観）必要があります。",
        },
      },
      20: {
        from_prev: {
          prev_id: 19,
          prev_name: "地沢臨",
          explanation:
            "人々の上に立てば、今度は人々をよく観察する（観）必要があります。",
        },
        to_next: {
          next_id: 21,
          next_name: "火雷噬嗑",
          explanation:
            "観察すれば、物事の間に障害物があるのが見えます。それを取り除くために、噛み砕く（噬嗑）力が必要になります。",
        },
      },
      21: {
        from_prev: {
          prev_id: 20,
          prev_name: "風地観",
          explanation:
            "観察すれば、物事の間に障害物があるのが見えます。それを取り除くために、噛み砕く（噬嗑）力が必要になります。",
        },
        to_next: {
          next_id: 22,
          next_name: "山火賁",
          explanation:
            "ただ障害を取り除くだけでは味気ない。文化的な装飾（賁）が必要です。",
        },
      },
      22: {
        from_prev: {
          prev_id: 21,
          prev_name: "火雷噬嗑",
          explanation:
            "ただ障害を取り除くだけでは味気ない。文化的な装飾（賁）が必要です。",
        },
        to_next: {
          next_id: 23,
          next_name: "山地剝",
          explanation:
            "しかし、装飾が極まれば、やがて本質が剥がれ落ちていく（剝）時が来ます。",
        },
      },
      23: {
        from_prev: {
          prev_id: 22,
          prev_name: "山火賁",
          explanation:
            "しかし、装飾が極まれば、やがて本質が剥がれ落ちていく（剝）時が来ます。",
        },
        to_next: {
          next_id: 24,
          next_name: "地雷復",
          explanation:
            "物事は剥がれ落ちて終わりではありません。一番下まで落ちれば、再び回復（復）します。",
        },
      },
      24: {
        from_prev: {
          prev_id: 23,
          prev_name: "山地剝",
          explanation:
            "物事は剥がれ落ちて終わりではありません。一番下まで落ちれば、再び回復（復）します。",
        },
        to_next: {
          next_id: 25,
          next_name: "天雷无妄",
          explanation: "回復すれば、偽りのない自然な状態（无妄）になります。",
        },
      },
      25: {
        from_prev: {
          prev_id: 24,
          prev_name: "地雷復",
          explanation: "回復すれば、偽りのない自然な状態（无妄）になります。",
        },
        to_next: {
          next_id: 26,
          next_name: "山天大畜",
          explanation: "自然体でいれば、大きく蓄える（大畜）ことができます。",
        },
      },
      26: {
        from_prev: {
          prev_id: 25,
          prev_name: "天雷无妄",
          explanation: "自然体でいれば、大きく蓄える（大畜）ことができます。",
        },
        to_next: {
          next_id: 27,
          next_name: "山雷頤",
          explanation:
            "大きく蓄えたら、今度はそれを正しく養う（頤）ことが必要です。",
        },
      },
      27: {
        from_prev: {
          prev_id: 26,
          prev_name: "山天大畜",
          explanation:
            "大きく蓄えたら、今度はそれを正しく養う（頤）ことが必要です。",
        },
        to_next: {
          next_id: 28,
          next_name: "沢風大過",
          explanation:
            "しかし、養うことなしには、必ず度を過ごす（大過）ことになります。",
        },
      },
      28: {
        from_prev: {
          prev_id: 27,
          prev_name: "山雷頤",
          explanation:
            "しかし、養うことなしには、必ず度を過ごす（大過）ことになります。",
        },
        to_next: {
          next_id: 29,
          next_name: "坎為水",
          explanation: "度を過ごせば、必ず困難な穴に陥り（坎）、悩みます。",
        },
      },
      29: {
        from_prev: {
          prev_id: 28,
          prev_name: "沢風大過",
          explanation: "度を過ごせば、必ず困難な穴に陥り（坎）、悩みます。",
        },
        to_next: {
          next_id: 30,
          next_name: "離為火",
          explanation:
            "困難から脱出するには、知性の光で物事を明らかにする（離）必要があります。",
        },
      },
      30: {
        from_prev: {
          prev_id: 29,
          prev_name: "坎為水",
          explanation:
            "困難から脱出するには、知性の光で物事を明らかにする（離）必要があります。",
        },
        to_next: {
          next_id: 31,
          next_name: "沢山咸",
          explanation:
            "こうして、再び天地、そして男女（咸）の物語へと繋がっていきます。",
        },
      },
      31: {
        from_prev: {
          prev_id: 30,
          prev_name: "離為火",
          explanation:
            "こうして、再び天地、そして男女（咸）の物語へと繋がっていきます。",
        },
        to_next: {
          next_id: 32,
          next_name: "雷風恒",
          explanation:
            "男女の関係が生まれれば、それはやがて夫婦となり、恒久（恒）なものとなります。",
        },
      },
      32: {
        from_prev: {
          prev_id: 31,
          prev_name: "沢山咸",
          explanation:
            "男女の関係が生まれれば、それはやがて夫婦となり、恒久（恒）なものとなります。",
        },
        to_next: {
          next_id: 33,
          next_name: "天山遯",
          explanation:
            "恒久なものも、いつまでも同じ場所にはいられません。時には退き（遯）、距離を置くことも必要です。",
        },
      },
      33: {
        from_prev: {
          prev_id: 32,
          prev_name: "雷風恒",
          explanation:
            "恒久なものも、いつまでも同じ場所にはいられません。時には退き（遯）、距離を置くことも必要です。",
        },
        to_next: {
          next_id: 34,
          next_name: "雷天大壮",
          explanation:
            "しかし、ただ退いているだけでは事は成らず、力強い前進（大壮）が必要になります。",
        },
      },
      34: {
        from_prev: {
          prev_id: 33,
          prev_name: "天山遯",
          explanation:
            "しかし、ただ退いているだけでは事は成らず、力強い前進（大壮）が必要になります。",
        },
        to_next: {
          next_id: 35,
          next_name: "火地晋",
          explanation: "力強く前進すれば、その勢いで進み（晋）、出世します。",
        },
      },
      35: {
        from_prev: {
          prev_id: 34,
          prev_name: "雷天大壮",
          explanation: "力強く前進すれば、その勢いで進み（晋）、出世します。",
        },
        to_next: {
          next_id: 36,
          next_name: "地火明夷",
          explanation:
            "しかし、進み続ければ、必ずその光明は傷つけられる（明夷）時が来ます。",
        },
      },
      36: {
        from_prev: {
          prev_id: 35,
          prev_name: "火地晋",
          explanation:
            "しかし、進み続ければ、必ずその光明は傷つけられる（明夷）時が来ます。",
        },
        to_next: {
          next_id: 37,
          next_name: "風火家人",
          explanation: "外で傷つけられた者は、必ず自分の家（家人）に帰ります。",
        },
      },
      37: {
        from_prev: {
          prev_id: 36,
          prev_name: "地火明夷",
          explanation: "外で傷つけられた者は、必ず自分の家（家人）に帰ります。",
        },
        to_next: {
          next_id: 38,
          next_name: "火沢睽",
          explanation:
            "しかし、家の道が行き詰まると、互いにそむき合う（睽）ようになります。",
        },
      },
      38: {
        from_prev: {
          prev_id: 37,
          prev_name: "風火家人",
          explanation:
            "しかし、家の道が行き詰まると、互いにそむき合う（睽）ようになります。",
        },
        to_next: {
          next_id: 39,
          next_name: "水山蹇",
          explanation:
            "互いにそむき合えば、必ず進むに悩む（蹇）ことになります。",
        },
      },
      39: {
        from_prev: {
          prev_id: 38,
          prev_name: "火沢睽",
          explanation:
            "互いにそむき合えば、必ず進むに悩む（蹇）ことになります。",
        },
        to_next: {
          next_id: 40,
          next_name: "雷水解",
          explanation:
            "悩み続けることはできません。必ず問題は解決し、緩んでいく（解）のです。",
        },
      },
      40: {
        from_prev: {
          prev_id: 39,
          prev_name: "水山蹇",
          explanation:
            "悩み続けることはできません。必ず問題は解決し、緩んでいく（解）のです。",
        },
        to_next: {
          next_id: 41,
          next_name: "山沢損",
          explanation: "緩めば、必ず何かを損なう（損）ことになります。",
        },
      },
      41: {
        from_prev: {
          prev_id: 40,
          prev_name: "雷水解",
          explanation: "緩めば、必ず何かを損なう（損）ことになります。",
        },
        to_next: {
          next_id: 42,
          next_name: "風雷益",
          explanation:
            "損ない続ければ、必ずいつかはそれを益する（益）時が来ます。",
        },
      },
      42: {
        from_prev: {
          prev_id: 41,
          prev_name: "山沢損",
          explanation:
            "損ない続ければ、必ずいつかはそれを益する（益）時が来ます。",
        },
        to_next: {
          next_id: 43,
          next_name: "沢天夬",
          explanation:
            "益し続ければ、必ず器は満ち溢れ、決壊する（夬）時が来ます。",
        },
      },
      43: {
        from_prev: {
          prev_id: 42,
          prev_name: "風雷益",
          explanation:
            "益し続ければ、必ず器は満ち溢れ、決壊する（夬）時が来ます。",
        },
        to_next: {
          next_id: 44,
          next_name: "天風姤",
          explanation: "決壊の後には、必ず新たな出会い（姤）があります。",
        },
      },
      44: {
        from_prev: {
          prev_id: 43,
          prev_name: "沢天夬",
          explanation: "決壊の後には、必ず新たな出会い（姤）があります。",
        },
        to_next: {
          next_id: 45,
          next_name: "沢地萃",
          explanation: "出会ったものは、必ず集まり（萃）ます。",
        },
      },
      45: {
        from_prev: {
          prev_id: 44,
          prev_name: "天風姤",
          explanation: "出会ったものは、必ず集まり（萃）ます。",
        },
        to_next: {
          next_id: 46,
          next_name: "地風升",
          explanation: "集まったものは、やがて上へ昇って（升）いきます。",
        },
      },
      46: {
        from_prev: {
          prev_id: 45,
          prev_name: "沢地萃",
          explanation: "集まったものは、やがて上へ昇って（升）いきます。",
        },
        to_next: {
          next_id: 47,
          next_name: "沢水困",
          explanation: "しかし、昇り続ければ、必ず困窮（困）する時が来ます。",
        },
      },
      47: {
        from_prev: {
          prev_id: 46,
          prev_name: "地風升",
          explanation: "しかし、昇り続ければ、必ず困窮（困）する時が来ます。",
        },
        to_next: {
          next_id: 48,
          next_name: "水風井",
          explanation:
            "上にいて困窮した者は、必ず下にある井戸（井）に戻ってきます。",
        },
      },
      48: {
        from_prev: {
          prev_id: 47,
          prev_name: "沢水困",
          explanation:
            "上にいて困窮した者は、必ず下にある井戸（井）に戻ってきます。",
        },
        to_next: {
          next_id: 49,
          next_name: "沢火革",
          explanation: "井戸の古いしきたりは、やがて変革（革）されます。",
        },
      },
      49: {
        from_prev: {
          prev_id: 48,
          prev_name: "水風井",
          explanation: "井戸の古いしきたりは、やがて変革（革）されます。",
        },
        to_next: {
          next_id: 50,
          next_name: "火風鼎",
          explanation:
            "物を変革するのに、鼎（かなえ）ほど適したものはありません。",
        },
      },
      50: {
        from_prev: {
          prev_id: 49,
          prev_name: "沢火革",
          explanation:
            "物を変革するのに、鼎（かなえ）ほど適したものはありません。",
        },
        to_next: {
          next_id: 51,
          next_name: "震為雷",
          explanation: "鼎を受け継ぐのは、家の長男（震）です。",
        },
      },
      51: {
        from_prev: {
          prev_id: 50,
          prev_name: "火風鼎",
          explanation: "鼎を受け継ぐのは、家の長男（震）です。",
        },
        to_next: {
          next_id: 52,
          next_name: "艮為山",
          explanation:
            "動き続ける（震）ことはできません。時には止まる（艮）ことも必要です。",
        },
      },
      52: {
        from_prev: {
          prev_id: 51,
          prev_name: "震為雷",
          explanation:
            "動き続ける（震）ことはできません。時には止まる（艮）ことも必要です。",
        },
        to_next: {
          next_id: 53,
          next_name: "風山漸",
          explanation:
            "ただ止まっているだけでは終わりません。物事は少しずつ、順を追って進んで（漸）いきます。",
        },
      },
      53: {
        from_prev: {
          prev_id: 52,
          prev_name: "艮為山",
          explanation:
            "ただ止まっているだけでは終わりません。物事は少しずつ、順を追って進んで（漸）いきます。",
        },
        to_next: {
          next_id: 54,
          next_name: "雷沢帰妹",
          explanation: "進んでいけば、必ず嫁ぐべき場所（帰妹）があります。",
        },
      },
      54: {
        from_prev: {
          prev_id: 53,
          prev_name: "風山漸",
          explanation: "進んでいけば、必ず嫁ぐべき場所（帰妹）があります。",
        },
        to_next: {
          next_id: 55,
          next_name: "雷火豊",
          explanation: "嫁ぎ先で成功すれば、必ず盛大（豊）になります。",
        },
      },
      55: {
        from_prev: {
          prev_id: 54,
          prev_name: "雷沢帰妹",
          explanation: "嫁ぎ先で成功すれば、必ず盛大（豊）になります。",
        },
        to_next: {
          next_id: 56,
          next_name: "火山旅",
          explanation:
            "盛大さが極まれば、必ずその居場所を失い、旅人（旅）となります。",
        },
      },
      56: {
        from_prev: {
          prev_id: 55,
          prev_name: "雷火豊",
          explanation:
            "盛大さが極まれば、必ずその居場所を失い、旅人（旅）となります。",
        },
        to_next: {
          next_id: 57,
          next_name: "巽為風",
          explanation:
            "旅人は、受け入れてくれる場所がなく、風（巽）のように人に従うしかありません。",
        },
      },
      57: {
        from_prev: {
          prev_id: 56,
          prev_name: "火山旅",
          explanation:
            "旅人は、受け入れてくれる場所がなく、風（巽）のように人に従うしかありません。",
        },
        to_next: {
          next_id: 58,
          next_name: "兌為沢",
          explanation: "人に従えば、必ず喜ばしいこと（兌）が起こります。",
        },
      },
      58: {
        from_prev: {
          prev_id: 57,
          prev_name: "巽為風",
          explanation: "人に従えば、必ず喜ばしいこと（兌）が起こります。",
        },
        to_next: {
          next_id: 59,
          next_name: "風水渙",
          explanation:
            "喜んでいれば、やがてその集まりは散り（渙）、離れていきます。",
        },
      },
      59: {
        from_prev: {
          prev_id: 58,
          prev_name: "兌為沢",
          explanation:
            "喜んでいれば、やがてその集まりは散り（渙）、離れていきます。",
        },
        to_next: {
          next_id: 60,
          next_name: "水沢節",
          explanation: "物が散り離れるのを防ぐには、節度（節）が必要です。",
        },
      },
      60: {
        from_prev: {
          prev_id: 59,
          prev_name: "風水渙",
          explanation: "物が散り離れるのを防ぐには、節度（節）が必要です。",
        },
        to_next: {
          next_id: 61,
          next_name: "風沢中孚",
          explanation: "節度を守れば、人々から信頼（中孚）されます。",
        },
      },
      61: {
        from_prev: {
          prev_id: 60,
          prev_name: "水沢節",
          explanation: "節度を守れば、人々から信頼（中孚）されます。",
        },
        to_next: {
          next_id: 62,
          next_name: "雷山小過",
          explanation:
            "信頼されると、時には少し度を過ごす（小過）ことも許されます。",
        },
      },
      62: {
        from_prev: {
          prev_id: 61,
          prev_name: "風沢中孚",
          explanation:
            "信頼されると、時には少し度を過ごす（小過）ことも許されます。",
        },
        to_next: {
          next_id: 63,
          next_name: "水火既済",
          explanation:
            "度を過ごした者は、必ず物事を正しく整え、完成させる（既済）必要があります。",
        },
      },
      63: {
        from_prev: {
          prev_id: 62,
          prev_name: "雷山小過",
          explanation:
            "度を過ごした者は、必ず物事を正しく整え、完成させる（既済）必要があります。",
        },
        to_next: {
          next_id: 64,
          next_name: "火水未済",
          explanation:
            "しかし、物事は完全に窮まることはありません。全ての完成は、次なる未完成（未済）の始まりであり、物語は永遠に続いていくのです。",
        },
      },
      64: {
        from_prev: {
          prev_id: 63,
          prev_name: "水火既済",
          explanation:
            "しかし、物事は完全に窮まることはありません。全ての完成は、次なる未完成（未済）の始まりであり、物語は永遠に続いていくのです。",
        },
        to_next: null,
      },
    },
  },
};
// os_manualデータベースに追加する新しいフィールドのデータ
export const os_manual_extensions:[
  // ---【最終改訂版】 No.1 ~ 8 ---
  1: {
    keyword_short: "創造／先導力",
    archetype_icon: "🐉",
    micro_examples: "□ 新規プロジェクトの立ち上げで燃える;□ ルーティンワークで才能が枯れる;□ 常にトップを目指している"
  },
  2: {
    keyword_short: "受容／大地の包容",
    archetype_icon: "🌍",
    micro_examples: "□ 人を支える役割で輝く;□ 縁の下の力持ちが天職;□ 決断を迫られると固まる"
  },
  3: {
    keyword_short: "挑戦／発芽エネルギー",
    archetype_icon: "🌱",
    micro_examples: "□ 0→1の立ち上げが得意;□ 混乱の中から好機を見出す;□ 計画段階で悩みすぎる"
  },
  4: {
    keyword_short: "学習／学び旺盛",
    archetype_icon: "🎓",
    micro_examples: "□ 新しい知識を学ぶのが好き;□ 常識を「なぜ？」と疑う;□ 指導者なしでは動けないことがある"
  },
  5: {
    keyword_short: "待機／忍耐",
    archetype_icon: "⌛",
    micro_examples: "□ 焦らず最高のタイミングを待てる;□ 長期的な計画を立てるのが得意;□ 行動するまでに時間がかかりすぎる"
  },
  6: {
    keyword_short: "正義／白黒はっきり",
    archetype_icon: "⚖️",
    micro_examples: "□ 曖昧なことを嫌い、議論で明確にする;□ 揉め事の仲裁役になることがある;□ 時に対立を恐れない"
  },
  7: {
    keyword_short: "統率力／組織戦略",
    archetype_icon: "🏰",
    micro_examples: "□ 大人数を率いて目標達成するのが得意;□ 規律やルールを重んじる;□ 個人の感情より全体の利益を優先する"
  },
  8: {
    keyword_short: "協力／ネットワーキング",
    archetype_icon: "🤝",
    micro_examples: "□ 人と人を繋ぎ、輪を広げるのが好き;□ 誰とでも親しくなれる;□ 無目的な集まりは苦手な一面も"
  },
  // --- 【新規作成】 No.9 ~ 16 ---
  9: {
    keyword_short: "抑制／堅実な前進",
    archetype_icon: "🚧",
    micro_examples: "□ 大きな成功より、小さな失敗を避ける;□ 派手さはないが、粘り強く物事を進める;□ 準備が完璧でないと行動できない"
  },
  10: {
    keyword_short: "慎重／危機管理",
    archetype_icon: "🧐",
    micro_examples: "□ 緊張感のある場面でこそ冷静でいられる;□ ルールや礼儀を非常に重んじる;□ リスクを恐れるあまり、チャンスを逃しがち"
  },
  11: {
    keyword_short: "調和／平和の創造",
    archetype_icon: "🕊️",
    micro_examples: "□ チームの心理的安全性を高めるのが得意;□ 対立を好みまず、調整役を買って出る;□ 問題の先送りをしがちな一面も"
  },
  12: {
    keyword_short: "閉塞／内なる探求",
    archetype_icon: "🚪",
    micro_examples: "□ 他人に理解されなくても、自分の世界を追求する;□ 孤独な環境でこそ、思索が深まる;□ 社交的な場や集団行動が極端に苦手"
  },
  13: {
    keyword_short: "団結／オープンマインド",
    archetype_icon: "🌐",
    micro_examples: "□ 公平な理念を掲げ、多様な人々をまとめる;□ 派閥や身内びいきを嫌う;□ 理想を語るが、現実とのギャップに苦しむ"
  },
  14: {
    keyword_short: "所有／寛大な分配",
    archetype_icon: "👑",
    micro_examples: "□ 多くのものを所有し、それを人に与えることに喜びを感じる;□ リーダーとして、気前よく振る舞う;□ 自分の成功に驕りやすい側面も"
  },
  15: {
    keyword_short: "謙虚／隠れた実力",
    archetype_icon: "🌾",
    micro_examples: "□ 実力があるのに、決して自慢しない;□ 常に他者を立て、自分は一歩引いている;□ 自己評価が低すぎることがある"
  },
  16: {
    keyword_short: "享楽／周到な準備",
    archetype_icon: "🎉",
    micro_examples: "□ 人々を楽しませるイベントを企画するのが得意;□ 計画を立てるだけでワクワクする;□ 実行段階の地味な作業は苦手"
  }
};
// os_manualデータベースに追加する新しいフィールドのデータ
const os_manual_extensions = {
  // ... (No.1〜16は前回提示したもの) ...
  17: {
    keyword_short: "追随／柔軟な適応",
    archetype_icon: "🏄‍♂️",
    micro_examples: "□ 時代の流れやトレンドに素早く乗るのが得意;□ 信頼するリーダーに、とことんついていく;□ 自分の意見をコロコロ変えてしまうことがある"
  },
  18: {
    keyword_short: "改革／根本治療",
    archetype_icon: "🛠️",
    micro_examples: "□ 古いルールや、淀んだ空気を刷新したくなる;□ 問題の根本原因を、徹底的に追求する;□ 時にやり方が強引だと言われる"
  },
  19: {
    keyword_short: "育成／親分肌",
    archetype_icon: "👨‍🏫",
    micro_examples: "□ 人の才能を見つけ、育てることに喜びを感じる;□ チームを家族のようにまとめ、面倒見が良い;□ 相手を甘やかしすぎてしまうことがある"
  },
  20: {
    keyword_short: "観察／本質の洞察",
    archetype_icon: "🦉",
    micro_examples: "□ 行動する前に、まず状況をじっくり観察する;□ 物事の裏側や、人の本音を見抜くのが得意;□ 評論家で終わり、行動に移せないことがある"
  },
  21: {
    keyword_short: "障害排除／断固たる実行",
    archetype_icon: "💥",
    micro_examples: "□ 行く手を阻む障害は、断固として噛み砕く;□ 曖昧な問題を、白黒はっきりさせるのが得意;□ 正義感が強いあまり、敵を作りやすい"
  },
  22: {
    keyword_short: "装飾／美的センス",
    archetype_icon: "🎨",
    micro_examples: "□ 物事の本質を、美しく魅力的に見せるのが得意;□ プレゼン資料や服装など、見た目にこだわる;□ 中身よりも外面を気にしすぎてしまう"
  },
  23: {
    keyword_short: "手放す／終わりの始まり",
    archetype_icon: "🍂",
    micro_examples: "□ 不要なものを捨て、本質だけを残そうとする;□ 時代の終わりや、潮時を敏感に察知する;□ 悲観的になり、希望を失いやすい側面も"
  },
  24: {
    keyword_short: "回復／再挑戦",
    archetype_icon: "🔄",
    micro_examples: "□ 失敗しても、それをバネに再挑戦できる;□「またやればいい」と、気持ちの切り替えが早い;□ 同じ過ちを繰り返しがちな一面も"
  }
};
// os_manualデータベースに追加する新しいフィールドのデータ
const os_manual_extensions = {
  // ... (No.1〜24は前回までの内容) ...
  25: {
    keyword_short: "自然体／誠実",
    archetype_icon: "🏞️",
    micro_examples: "□ 計算や下心なく、ありのままで人と接する;□ 正攻法を好み、駆け引きは苦手;□ 時に、その純粋さが災いを招く"
  },
  26: {
    keyword_short: "蓄積／大器晩成",
    archetype_icon: "🏦",
    micro_examples: "□ すぐに結果を出さず、じっくり力を蓄える;□ 知識や徳を、内面に溜め込むのが好き;□ アウトプットを求められるとプレッシャーを感じる"
  },
  27: {
    keyword_short: "養う／自己管理",
    archetype_icon: "🍽️",
    micro_examples: "□ 口に入れるもの（食事、情報）に気を配る;□ 自分の心身を、時間をかけて育むのが得意;□ 不摂生な人や、無駄話が苦手"
  },
  28: {
    keyword_short: "異常事態／限界突破",
    archetype_icon: "💥",
    micro_examples: "□ 平時よりも、危機的状況でこそ真価を発揮する;□ 常識を超えた大胆な行動を取ることがある;□ 自分や他人に過剰な負荷をかけがち"
  },
  29: {
    keyword_short: "困難／探求",
    archetype_icon: "🌊",
    micro_examples: "□ 困難な状況に、あえて飛び込んで本質を学ぶ;□ 悩み、苦しむ経験が、自分を成長させると知っている;□ 平穏な状態が続くと、物足りなさを感じる"
  },
  30: {
    keyword_short: "知性／華やかさ",
    archetype_icon: "🔥",
    micro_examples: "□ 知性やセンスで、物事を鮮やかに照らし出す;□ 人から注目され、賞賛されることに喜びを感じる;□ 一人でいると、輝きを失いやすい"
  },
  31: {
    keyword_short: "共感／フィーリング",
    archetype_icon: "💞",
    micro_examples: "□ 理屈よりも、その場の空気や直感を信じる;□ 人の感情に、敏感に反応してしまう;□ 言葉にならない感覚を、大切にする"
  },
  32: {
    keyword_short: "継続／安定",
    archetype_icon: "🕰️",
    micro_examples: "□ 一度決めたことを、地道に長く続けるのが得意;□ 変化を嫌い、いつも通りであることを好む;□ ルールや習慣が、心の安定に繋がる"
  }
};
// os_manualデータベースに追加する新しいフィールドのデータ
const os_manual_extensions = {
  // ... (No.1〜32は前回までの内容) ...
  33: {
    keyword_short: "戦略的撤退／距離感",
    archetype_icon: "🏃‍♂️",
    micro_examples: "□ 不利な状況からは、賢明に身を引く;□ 深入りせず、常に適切な距離感を保つ;□ 面倒な人間関係をリセットしがち"
  },
  34: {
    keyword_short: "力強い前進／突破力",
    archetype_icon: "🐗",
    micro_examples: "□ 目標に向かって、エネルギッシュに突き進む;□ 正義感が強く、不正を許さない;□ 時に、そのパワーが暴走し、無謀になる"
  },
  35: {
    keyword_short: "進展／認められたい",
    archetype_icon: "☀️",
    micro_examples: "□ 明るく、社交的で、人から評価されるのが好き;□ 着実にステップアップし、成功への道を歩む;□ 他者からの承認を気にしすぎる側面も"
  },
  36: {
    keyword_short: "忍耐／才能を隠す",
    archetype_icon: "🎭",
    micro_examples: "□ 理不尽な状況でも、本心を隠して耐え忍ぶ;□ 才能があるのに、あえて無能なふりをする;□ 悲観的になり、心を閉ざしやすい"
  },
  37: {
    keyword_short: "家庭・組織／内側の秩序",
    archetype_icon: "家",
    micro_examples: "□ チームや家族など、内側の調和を最も大切にする;□ ルールや役割分担を重んじる;□ 身内びいきになり、排他的になることがある"
  },
  38: {
    keyword_short: "対立／独自性",
    archetype_icon: "↔️",
    micro_examples: "□ 人と違う視点を持ち、あえて逆張りすることがある;□ 議論が好きで、物事の矛盾を鋭く見抜く;□ 常に誰かと対立し、孤立しやすい"
  },
  39: {
    keyword_short: "行き詰まり／困難",
    archetype_icon: "🧗",
    micro_examples: "□ 進むも退くもできない、八方塞がりの状況に陥りやすい;□ 困難の中で、知恵と工夫で道を探す;□ 一人で抱え込み、助けを求めるのが苦手"
  },
  40: {
    keyword_short: "解決／解放",
    archetype_icon: "🔓",
    micro_examples: "□ 凍てついた問題を、行動力で一気に解決するのが得意;□ 過去にこだわらず、さっぱりしている;□ 問題解決後に、反省を疎かにする傾向も"
  }
};
// os_manualデータベースに追加する新しいフィールドのデータ
const os_manual_extensions = {
  // ... (No.1〜40は前回までの内容) ...
  41: {
    keyword_short: "戦略的削減／損して得取れ",
    archetype_icon: "🔪",
    micro_examples: "□ 無駄なものを切り捨て、本質に集中する;□ 今は損でも、未来のための投資と考える;□ 時に、自分を犠牲にしすぎることがある"
  },
  42: {
    keyword_short: "貢献／Win-Win",
    archetype_icon: "📈",
    micro_examples: "□ 他者を助けることで、自分も豊かになる;□ 善意の輪を広げることに喜びを感じる;□ お節介だと思われないか、少し心配"
  },
  43: {
    keyword_short: "決断／ブレークスルー",
    archetype_icon: "⚡️",
    micro_examples: "□ 曖昧な状況に、断固たる決断を下す;□ 悪しき前例や、不要なものを排除する;□ やり方が強引で、敵を作りやすい"
  },
  44: {
    keyword_short: "偶然の出会い／影響力",
    archetype_icon: "✨",
    micro_examples: "□ 予期せぬ出会いが、チャンスを運んでくる;□ なぜか人に影響を与えてしまうことがある;□ 軽率な関係に陥りやすい危険性も"
  },
  45: {
    keyword_short: "結束／コミュニティ",
    archetype_icon: "🙌",
    micro_examples: "□ 人々が自然と集まる「場」を作るのが得意;□ チームや組織の、求心力となる;□ 楽しむことが目的化し、本来の目標を忘れがち"
  },
  46: {
    keyword_short: "着実な成長／ステップアップ",
    archetype_icon: "🌳",
    micro_examples: "□ 地道な努力を、コツコツ積み重ねられる;□ 一歩一歩、段階的に成長していくのが好き;□ 効率の悪いやり方に固執してしまうことがある"
  },
  47: {
    keyword_short: "逆境／本質探求",
    archetype_icon: "🧘",
    micro_examples: "□ 苦しい状況でこそ、物事の本質が見える;□ 精神的にタフで、簡単には希望を失わない;□ 悲観的になり、心を閉ざしやすい側面も"
  },
  48: {
    keyword_short: "安定供給／インフラ",
    archetype_icon: "⛲️",
    micro_examples: "□ 井戸のように、変わらない価値を提供し続ける;□ 縁の下の力持ちとして、組織を支える;□ 時代の変化に対応するのが苦手"
  }
};// os_manualデータベースに追加する新しいフィールドのデータ
const os_manual_extensions = {
  // ... (No.1〜48は前回までの内容) ...
  49: {
    keyword_short: "革命／システムチェンジ",
    archetype_icon: "💥",
    micro_examples: "□ 古い常識や体制を、根本から変革する;□ 破壊を恐れず、理想の世界を創造する;□ その過程で、多くの反発や抵抗に遭う"
  },
  50: {
    keyword_short: "安定した器／文化醸成",
    archetype_icon: "🏺",
    micro_examples: "□ 新しい組織や文化を、じっくりと育む;□ 三方よしの精神で、協力体制を築く;□ 短期的な成果を出すのは苦手"
  },
  51: {
    keyword_short: "衝撃／行動開始",
    archetype_icon: "⚡️",
    micro_examples: "□ 衝撃的な出来事をきっかけに、行動を起こす;□ 停滞した空気を、一瞬で動かす起爆剤になる;□ 行動が衝動的で、計画性に欠けることがある"
  },
  52: {
    keyword_short: "静止／内省",
    archetype_icon: "🏔️",
    micro_examples: "□ 動くべき時が来るまで、山のように動かない;□ 外部の情報を遮断し、内なる声に耳を澄ます;□ 行動を起こすのが、極端に遅くなりがち"
  },
  53: {
    keyword_short: "着実な前進／順序",
    archetype_icon: "🪜",
    micro_examples: "□ 物事を正しい順序で、一歩一歩進めるのが得意;□ プロセスを重視し、大きな失敗をしない;□ 急な変更や、ショートカットが苦手"
  },
  54: {
    keyword_short: "衝動的な関係／情熱",
    archetype_icon: "❤️‍🔥",
    micro_examples: "□ 理屈よりも、情熱やフィーリングで行動する;□ 常識的な順序を無視して、関係を築こうとする;□ その関係は、長続きしないことが多い"
  },
  55: {
    keyword_short: "豊かさの極み／絶頂期",
    archetype_icon: "🎆",
    micro_examples: "□ 物事を成功の頂点へと導き、華やかな豊かさを手にする;□ 自信にあふれ、多くの人々を惹きつける;□ 絶頂期が永遠ではないことを、忘れがち"
  },
  56: {
    keyword_short: "旅人／アウェイな環境",
    archetype_icon: "🚶‍♂️",
    micro_examples: "□ 一つの場所に留まらず、常に新しい環境に身を置く;□ 高い適応力で、どんな場所でも生きていける;□ 心から安らげる居場所がなく、孤独を感じやすい"
  }
};
// os_manualデータベースに追加する新しいフィールドのデータ
const os_manual_extensions = {
  // ... (No.1〜56は前回までの内容) ...
  57: {
    keyword_short: "浸透／柔軟な影響力",
    archetype_icon: "🍃",
    micro_examples: "□ 強引な説得より、丁寧な根回しが得意;□ 相手の心に、いつの間にか入り込んでいる;□ 決断を迫られると、風のように姿を消しがち"
  },
  58: {
    keyword_short: "喜悦／コミュニケーション",
    archetype_icon: "😊",
    micro_examples: "□ 人と楽しくおしゃべりする時間が一番の充電;□ 場のムードメーカーになることが多い;□ 深い話や、地道な作業は少し苦手"
  },
  59: {
    keyword_short: "離散／リセット",
    archetype_icon: "💨",
    micro_examples: "□ 淀んだ空気や、古いしがらみを解消したくなる;□ 問題をリセットし、ゼロから再構築するのが得意;□ 時に無責任だと思われやすい"
  },
  60: {
    keyword_short: "節度／自己管理",
    archetype_icon: "⚖️",
    micro_examples: "□ ルールや予算を、きっちり守るのが得意;□ 自分を律することで、心の安定を保つ;□ 融通が利かない、堅物だと言われることも"
  },
  61: {
    keyword_short: "真心／誠実",
    archetype_icon: "🤍",
    micro_examples: "□ 駆け引きや嘘が苦手で、常に誠実でありたい;□ 心からの言葉が、人の心を動かすと信じている;□ 人を信じすぎて、騙されやすい危うさも"
  },
  62: {
    keyword_short: "謙虚／細やかな配慮",
    archetype_icon: "🙏",
    micro_examples: "□ 大きな成功より、小さなことを丁寧に行う;□ 常に謙虚で、目立つことを避ける傾向がある;□ 大胆な決断や、リスクを取るのが苦手"
  },
  63: {
    keyword_short: "完成／秩序の維持",
    archetype_icon: "✅",
    micro_examples: "□ 物事を完璧な形で完成させるのが得意;□ 安定した状態を、維持管理することに長ける;□ 変化を嫌い、新しいやり方を拒絶しがち"
  },
  64: {
    keyword_short: "未完成／可能性の探求",
    archetype_icon: "🌀",
    micro_examples: "□ 混乱の中から、新しい可能性を見出すのが好き;□ 失敗を恐れず、様々な試行錯誤を繰り返す;□ 物事をなかなか完成させられない側面も"
  }
};
export const haqei_potential_scores = [
  // 0番目はダミー
  0,
  // 1. 乾為天 (6爻 + 用九)
  3, 2, 4, 3, 1, 5, 2,
  // 2. 坤為地 (6爻 + 用六)
  3, 1, 2, 3, 2, 5, 1,
  // 3. 水雷屯
  4, 4, 5, 2, 4, 5,
  // 4. 山水蒙
  4, 2, 4, 4, 2, 3,
  // 5. 水天需
  3, 3, 4, 4, 2, 5,
  // 6. 天水訟
  4, 4, 3, 4, 2, 5,
  // 7. 地水師
  4, 2, 5, 4, 4, 2,
  // 8. 水地比
  2, 2, 4, 3, 1, 5,
  // 9. 風天小畜
  3, 3, 4, 2, 2, 5,
  // 10. 天沢履
  2, 2, 4, 3, 4, 1,
  // 11. 地天泰
  2, 2, 3, 2, 2, 5,
  // 12. 天地否
  3, 3, 3, 2, 2, 5,
  // 13. 天火同人
  2, 3, 5, 4, 3, 2,
  // 14. 火天大有
  3, 2, 2, 3, 2, 1,
  // 15. 地山謙
  2, 2, 1, 2, 3, 4,
  // 16. 雷地豫
  4, 3, 4, 2, 4, 5,
  // 17. 沢雷随
  3, 4, 4, 2, 2, 5,
  // 18. 山風蠱
  4, 3, 3, 4, 2, 1,
  // 19. 地沢臨
  3, 3, 4, 2, 2, 2,
  // 20. 風地観
  3, 3, 3, 2, 2, 1,
  // 21. 火雷噬嗑
  4, 4, 4, 3, 3, 5,
  // 22. 山火賁
  3, 2, 2, 3, 3, 1,
  // 23. 山地剥
  4, 4, 3, 4, 2, 5,
  // 24. 地雷復
  3, 2, 4, 2, 3, 5,
  // 25. 天雷无妄
  3, 2, 4, 3, 4, 5,
  // 26. 山天大畜
  4, 4, 2, 2, 3, 1,
  // 27. 山雷頤
  4, 4, 5, 3, 3, 2,
  // 28. 沢風大過
  3, 3, 4, 2, 3, 5,
  // 29. 坎為水
  5, 4, 5, 3, 4, 5,
  // 30. 離為火
  3, 2, 4, 5, 4, 3,
  // 31. 沢山咸
  3, 4, 3, 2, 4, 2,
  // 32. 雷風恒
  4, 3, 4, 4, 3, 5,
  // 33. 天山遯
  4, 3, 4, 2, 2, 1,
  // 34. 雷天大壮
  4, 3, 4, 2, 3, 5,
  // 35. 火地晋
  3, 3, 2, 4, 3, 4,
  // 36. 地火明夷
  4, 4, 3, 3, 2, 5,
  // 37. 風火家人
  3, 2, 4, 2, 2, 3,
  // 38. 火沢睽
  3, 3, 4, 4, 3, 2,
  // 39. 水山蹇
  5, 5, 5, 3, 4, 2,
  // 40. 雷水解
  3, 2, 4, 3, 2, 3,
  // 41. 山沢損
  3, 3, 4, 3, 2, 1,
  // 42. 風雷益
  2, 3, 4, 2, 2, 5,
  // 43. 沢天夬
  5, 3, 4, 4, 3, 4,
  // 44. 天風姤
  4, 3, 4, 4, 3, 5,
  // 45. 沢地萃
  3, 3, 4, 2, 2, 4,
  // 46. 地風升
  2, 2, 2, 3, 3, 4,
  // 47. 沢水困
  5, 4, 5, 4, 4, 5,
  // 48. 水風井
  4, 4, 4, 2, 2, 1,
  // 49. 沢火革
  4, 3, 4, 2, 2, 3,
  // 50. 火風鼎
  3, 3, 4, 5, 2, 2,
  // 51. 震為雷
  3, 4, 3, 4, 4, 4,
  // 52. 艮為山
  3, 4, 5, 3, 3, 2,
  // 53. 風山漸
  3, 2, 4, 3, 2, 1,
  // 54. 雷沢帰妹
  4, 3, 4, 4, 4, 5,
  // 55. 雷火豊
  3, 3, 4, 3, 2, 5,
  // 56. 火山旅
  4, 3, 5, 4, 4, 5,
  // 57. 巽為風
  3, 3, 5, 4, 3, 4,
  // 58. 兌為沢
  2, 2, 4, 3, 3, 3,
  // 59. 風水渙
  3, 3, 3, 2, 3, 4,
  // 60. 水沢節
  4, 4, 5, 2, 2, 4,
  // 61. 風沢中孚
  2, 2, 4, 3, 2, 5,
  // 62. 雷山小過
  4, 4, 5, 3, 4, 5,
  // 63. 水火既済
  3, 3, 5, 4, 3, 5,
  // 64. 火水未済
  4, 3, 5, 2, 2, 4,
];
export const haqeiMainDatabase = [
  {
    卦番号: 1,
    卦名: "乾為天",
    綜卦: 1,
    錯卦: 2,
    "綜卦との関係性（裏の視点）":
      "視点を変えても同じ。絶対的な力は、どこから見ても変わらない。",
    "錯卦との関係性（対極の世界）":
      "坤為地（受容）と対。創造する力（乾）は、それを受け止める大地（坤）があって初めて意味を持つ。",
    互卦: 1,
    互卦との関係性:
      "本卦の内情や隠れた本質を示す互卦も乾為天となります。これは外面の力強さだけでなく、内面や物事のプロセスにおいても一切の陰りや迷いがなく、純粋で剛健なエネルギーが一貫していることを意味します。",
    初爻変: 44,
    初爻変との関係性:
      "全てが陽である乾の初爻（一番下）が陰に変わることで、完璧な陽の世界に初めて一つの陰が侵入した形となります。これは予期せぬ出会い（邂逅）や小さな問題の発生を象徴し、この最初の変化への対処が全体の動向を左右する重要な分岐点となります。",
    二爻変: 13,
    二爻変との関係性:
      "中心的な役割を担う二爻が陰に変わることで、広大な天の下に太陽が輝くように、志を同じくする者（同人）が分け隔てなく集い協力する様を表します。公明正大な態度で人と交われば、大きな事業も可能となる協調の時です。",
    三爻変: 10,
    三爻変との関係性:
      "天と人の境である三爻が陰に変わり、まるで虎の尾を踏むような危険な状況を招くことを暗示します。行動や言動が天の威光に触れ、緊張が走る時です。礼儀作法を固く守り、慎重に行動することでかろうじて難を逃れられます。",
    四爻変: 9,
    四爻変との関係性:
      "天の上を風が吹き渡るものの、まだ雨を降らせるほどの力がない状態です。大きな目的を成そうとしても、一つの陰の力に妨げられ物事が少し滞る（小畜）ことを示します。焦らずに力を蓄え、時機を待つべき準備期間です。",
    五爻変: 14,
    五爻変との関係性:
      "君主の位である五爻が柔和な陰に変わることで、下の全ての陽が喜んで従い、天の中天に太陽が輝く最高の状態となります。富、権力、名声などあらゆるものを「大いに有する」大成功の時であり、謙虚さがおおらかさが天の助けを呼びます。",
    上爻変: 43,
    上爻変との関係性:
      "一番上に残った一つの陰（悪弊・小人）を、下から突き上げてきた五つの陽が決然と排除しようとする「決断」の時です。沢が天にまで達し決壊寸前の象徴であり、悪を公にして断固たる処置が必要ですが、強引な手段は自らを危うくする危険もはらんでいます。",
    "アーキタイプ（原型）": "圧倒的リーダー, 創業者, カリスマ",
    現代解釈の要約: "陽のエネルギーが極まり、力強く前進する時。",
    出た時の気持ち:
      "やる気に満ち溢れ、自信があるが、時に傲慢になったり、孤立感を覚えたりする",
    どうすればいい:
      "独断専行を避け、周囲の意見に耳を傾ける。目的を明確にし、長期的な視点を持つ",
    相談すべき人:
      "優れたサポーター、客観的な視点を持つ参謀、自分を戒めてくれる友人",
  },
  {
    卦番号: 2,
    卦名: "坤為地",
    綜卦: 2,
    錯卦: 1,
    "綜卦との関係性（裏の視点）":
      "視点を変えても同じ。全てを受け入れる受容性は、どこから見ても揺るがない。",
    "錯卦との関係性（対極の世界）":
      "乾為天（創造）と対。受容し育む力は、創造のエネルギーがあって初めて意味を持つ。",
    互卦: 2,
    互卦との関係性:
      "内も外も全てが陰で構成され、どこまでも純粋な受容性と育成のエネルギーに満ちていることを示します。",
    初爻変: 24,
    初爻変との関係性:
      "陰が極まり、大地の下から初めて一つの陽が戻ってくる「一陽来復」の形。全ての物事の回復と希望の始まりを象徴します。",
    二爻変: 7,
    二爻変との関係性:
      "広大な大地（坤）の中心に唯一の陽爻が現れ、多くの陰爻（民衆）を率いる将軍の象（師は軍隊）。困難な状況でリーダーシップが求められます。",
    三爻変: 15,
    三爻変との関係性:
      "地の下に高い山が隠れる形。内に高い能力（山）を秘めながら、外には柔順さ（地）を示す「謙虚」の極致。最高の美徳とされます。",
    四爻変: 16,
    四爻変との関係性:
      "地上に春の雷が鳴り響き、万物が活動を始める形。喜び（豫）と楽しみを表しますが、備えや準備を怠ってはならないと戒めます。",
    五爻変: 8,
    五爻変との関係性:
      "地上の水が自然に集まり潤すように、中心の王（五爻）に人々が親しみ、従い、助け合う（比）形。親密な協力関係が鍵となります。",
    上爻変: 23,
    上爻変との関係性:
      "高い山が根本から剥がれ落ちる寸前の形。一つの陽が多くの陰に侵食され、地位や財産、人間関係などが崩壊する危機を示唆します。",
    "アーキタイプ（原型）": "優れたサポーター, 母, 大地, 縁の下の力持ち",
    現代解釈の要約: "リーダーを支え、物事を育む基盤の役割。",
    出た時の気持ち:
      "穏やかで、受容的。安心感があるが、時に主体性のなさや、優柔不断さを感じる",
    どうすればいい:
      "自分の意見を明確にしつつ、相手を尊重する。育てる対象や、守るべきものを明確にする",
    相談すべき人:
      "創造的なリーダー、決断力のあるパートナー、自分を導いてくれる師",
  },
  {
    卦番号: 3,
    卦名: "水雷屯",
    綜卦: 4,
    錯卦: 50,
    "綜卦との関係性（裏の視点）":
      "山水蒙（未熟）と対。「産みの苦しみ」の裏には、常に「学びと成長の必要性」がある。",
    "錯卦との関係性（対極の世界）":
      "火風鼎（安定）と対。混沌とした始まりの対極には、全てが形をなした安定状態がある。",
    互卦: 23,
    互卦との関係性:
      "内側には山が剥がれ落ちるような崩壊（山地剥）の危険をはらんでいます。物事の始まりの苦しみの中に、深刻な問題が隠れていることを示します。",
    初爻変: 8,
    初爻変との関係性:
      "産みの苦しみ（屯）の始まりですが、人々と親しみ助け合う（比）ことで、最初の困難を乗り越えることができます。",
    二爻変: 60,
    二爻変との関係性:
      "困難な状況で前に進めない時、水が沢でせき止められるように、今は節度を守り、分相応に振る舞うことが求められます。",
    三爻変: 63,
    三爻変との関係性:
      "鹿を追って森の奥深くへ入るように、案内役がいても道に迷う危険な状況。一度は整った（既済）ように見えても、深追いは禁物です。",
    四爻変: 42,
    四爻変との関係性:
      "困難な状況で助けを求めた時、大きな助け（益）が得られる時。積極的に援助を求めることで道が開けます。",
    五爻変: 24,
    五爻変との関係性:
      "苦しみの中で徳を施しても、その恩恵はまだ小さく限定的です。しかし、陰が極まって陽が復する時であり、希望はあります。",
    上爻変: 17,
    上爻変との関係性:
      "困難の極みで身動きが取れず、血の涙を流すほどの苦境。今は無理に行動せず、時を待つしかありません。",
    "アーキタイプ（原型）": "スタートアップ, 新規事業, 人生の転換期",
    現代解釈の要約: "新しい物事が生まれようとする、始まりの困難な時期。",
    出た時の気持ち:
      "不安と希望が入り混じる。期待感と同時に、産みの苦しみや混乱を感じる",
    どうすればいい:
      "焦らず、まず計画を練り直す。信頼できる協力者や専門家の助けを求める",
    相談すべき人:
      "経験豊富なメンター、同じ苦しみを乗り越えた先輩、信頼できるパートナー",
  },
  {
    卦番号: 4,
    卦名: "山水蒙",
    綜卦: 3,
    錯卦: 49,
    "綜卦との関係性（裏の視点）":
      "水雷屯（産みの苦しみ）と対。「未熟で先が見えない」状況は、まさに「産みの苦しみ」そのものである。",
    "錯卦との関係性（対極の世界）":
      "沢火革（革命）と対。蒙昧（蒙）を打破するには、古い自分を根本から変える「革命」が必要。",
    互卦: 24,
    互卦との関係性:
      "蒙昧（蒙）で先が見えない状態の内側には、陽が復してくる回復の兆し（地雷復）が隠されています。啓発されれば道は開けます。",
    初爻変: 41,
    初爻変との関係性:
      "蒙昧な状態を啓発するために、時には厳しい体罰（損）も必要であるという古い教え。教育における厳しさを示唆します。",
    二爻変: 23,
    二爻変との関係性:
      "無知な子供や盗賊と一緒に行動すると、家を破壊する（山地剥）ような結果を招くという警告。付き合う相手を選ぶ重要性を示します。",
    三爻変: 18,
    三爻変との関係性:
      "ただ無知な者を包容するだけでは、物事は腐敗（蠱）してしまう。甘やかすことの弊害を警告します。",
    四爻変: 59,
    四爻変との関係性:
      "濃い霧（蒙）が風によって吹き払われる（風水渙）ように、蒙昧な状態が解消され、物事が明らかになる時です。",
    五爻変: 7,
    五爻変との関係性:
      "蒙昧な状態を正すためには、軍隊（師）を動かすような厳しい規律とリーダーシップが必要になることを示します。",
    上爻変: 64,
    上爻変との関係性:
      "蒙昧さを打ち破る攻撃は、相手を完全に打ち負かす（既済）のではなく、将来の禍根を断つ（未済）程度に留めるべきであると示します。",
    "アーキタイプ（原型）": "教育, 人材育成, 新入社員, 学生",
    現代解釈の要約: "未熟な状態から、正しい指導を得て成長する過程。",
    出た時の気持ち:
      "好奇心と同時に、何が正しいかわからない混乱や、自分の未熟さへの不安を感じる",
    どうすればいい:
      "謙虚に教えを請う。信頼できる情報源や指導者を見極める。基礎から学ぶ",
    相談すべき人: "優れた指導者、専門家、誠実な友人",
  },
  {
    卦番号: 5,
    卦名: "水天需",
    綜卦: 6,
    錯卦: 38,
    "綜卦との関係性（裏の視点）":
      "天水訟（争い）と対。困難を前に「待つ」ことの裏側には、常に「争い」の危険性が潜んでいる。",
    "錯卦との関係性（対極の世界）":
      "火沢睽（対立）と対。好機を待つ協調的な姿勢の対極は、互いに背き合う不和の状態。",
    互卦: 38,
    互卦との関係性:
      "内側には火と沢が反目し合う「不和（睽）」の状態が隠されています。待つべき時であっても、内情は一致団結していないことを示します。",
    初爻変: 63,
    初爻変との関係性:
      "郊外で待てば、恒常心を失わない限り災いはない。一度は完成（既済）を見るように、落ち着いて待てば状況は安定します。",
    二爻変: 60,
    二爻変との関係性:
      "砂地で待つ時。多少の非難はあるが、最終的には吉。沢で水が止まるように、節度を守って待てば良い結果を得られます。",
    三爻変: 9,
    三爻変との関係性:
      "泥の中で待てば、敵を招き寄せる。焦って動けば、力が及ばず（小畜）事態は悪化します。",
    四爻変: 43,
    四爻変との関係性:
      "酒食の中で待つ時。今は飲食を楽しみながら待つしかないが、いずれ決断（夬）の時が来ます。",
    五爻変: 11,
    五爻変との関係性:
      "穴蔵で待つ時。招かれざる三人の客が来るが、敬意を払えば吉。苦しい状況でも、泰平（泰）の時が来ることを信じて待つべきです。",
    上爻変: 48,
    上爻変との関係性:
      "穴蔵に入り込んでしまった最悪の状況。助けは来ず、万事休す。井戸に落ちたように、自力での脱出は困難です。",
    "アーキタイプ（原型）": "戦略的待機, 計画準備期間, 嵐の前の静けさ",
    現代解釈の要約: "困難を前に、焦らず、時機が来るのを待つべき時。",
    出た時の気持ち:
      "忍耐強く、冷静だが、内面では焦りや不安を抱えている。好機を逃すことへの恐れ",
    どうすればいい:
      "ただ待つのではなく、情報収集や自己鍛錬など、今できる準備を進める。感情的にならない",
    相談すべき人: "客観的なアドバイザー、戦略家",
  },
  {
    卦番号: 6,
    卦名: "天水訟",
    綜卦: 5,
    錯卦: 37,
    "綜卦との関係性（裏の視点）":
      "水天需（待つ）と対。「争い」が起きている時は、無理に進めず、賢明に「待つ」ことが求められる。",
    "錯卦との関係性（対極の世界）":
      "風火家人（家庭の秩序）と対。外部との争いの対極には、内なる秩序と和合がある。",
    互卦: 37,
    互卦との関係性:
      "内側には家庭内の調和（家人）を求める気持ちが隠されています。争い事（訟）の裏には、身近な人々との秩序を回復したい思いがあります。",
    初爻変: 36,
    初爻変との関係性:
      "争い事を長引かせるべきではない。早々に引き上げれば吉。深入りすれば、明知が地に隠れる（明夷）ように傷を負います。",
    二爻変: 10,
    二爻変との関係性:
      "争いに勝てないと悟り、逃げ帰っても三百戸の領民を失うことはない。虎の尾を踏む（履）ような危険を冒すよりはましです。",
    三爻変: 12,
    三爻変との関係性:
      "古い徳を守って静かにしていれば吉。自分の立場を守ることに専念すれば、閉塞（否）した状況でも安泰です。",
    四爻変: 44,
    四爻変との関係性:
      "争い事をやめて天命に復し、静かにしていれば吉。不意の出会い（姤）のように、新たな展開が訪れる可能性があります。",
    五爻変: 59,
    五爻変との関係性:
      "争訟に勝ち、大きな帯（官位）を授けられても、一日に三度も奪われる。名誉は水の泡（渙）のように消えやすいことを示します。",
    上爻変: 47,
    上爻変との関係性:
      "たとえ争訟に勝って官位を得ても、やがては取り上げられる。沢の水が涸れる（困）ように、その栄誉は長続きしません。",
    "アーキタイプ（原型）": "訴訟, 交渉, 派閥争い, ライバル関係",
    現代解釈の要約:
      "異なる意見や利害が衝突する。冷静な対処と、時には争いを避ける知恵が問われる。",
    出た時の気持ち:
      "闘争心、緊張感。正義感に燃える一方、感情的になり、疲弊し、孤独を感じやすい",
    どうすればいい:
      "感情的にならず、客観的な事実に基づいて議論する。時には、争いを避ける、あるいは第三者の仲介を求める",
    相談すべき人: "公平な第三者、調停者、利害関係のない友人",
  },
  {
    卦番号: 7,
    卦名: "地水師",
    綜卦: 8,
    錯卦: 13,
    "綜卦との関係性（裏の視点）":
      "水地比（親密）と対。「軍隊（師）」という公的な集団の裏には、個人的な親密さがある。",
    "錯卦との関係性（対極の世界）":
      "天火同人（大同団結）と対。規律による組織（師）の対極は、共通の理念による協力関係。",
    互卦: 24,
    互卦との関係性:
      "軍隊（師）の内側には、一陽来復のエネルギーが満ちています。大義名分があれば、兵士の士気は高まることを示します。",
    初爻変: 19,
    初爻変との関係性:
      "軍隊（師）は規律が第一。規律が乱れれば凶。規律正しい軍隊は、人々が喜んで臨む（臨）ような頼もしさがあります。",
    二爻変: 2,
    二爻変との関係性:
      "王が三度も功績を称えるが、小人は用いるな。兵を率いる将軍は、母なる大地（坤）のような徳を持つ者がふさわしい。",
    三爻変: 46,
    三爻変との関係性:
      "軍隊が左に陣を敷けば問題ない。退却は昇進（升）への道。時には戦略的撤退も必要です。",
    四爻変: 40,
    四爻変との関係性:
      "田に獲物がいる。捕らえるのが有利。罪はない。戦場で手柄を立てる好機（解）が到来したことを示します。",
    五爻変: 29,
    五爻変との関係性:
      "大君に天命あり。国を開き家を継がせるが、小人は用いるな。たとえ困難（坎）な戦でも、大義があれば天は味方します。",
    上爻変: 4,
    上爻変との関係性:
      "軍隊を引き上げる時。功績のある大物は賞し、ない者は罰する。恩賞と懲罰を明確にすることが、蒙昧（蒙）な民を導く道です。",
    "アーキタイプ（原型）": "組織運営, プロジェクトチーム, 軍隊",
    現代解釈の要約:
      "共通の目的のために集団を組織し、統率する。正しい指導力が不可欠。",
    出た時の気持ち:
      "責任感、使命感。全体を動かす高揚感と同時に、メンバーへの配慮や、規律維持のプレッシャーを感じる",
    どうすればいい:
      "明確な目標とルールを設定する。公平な評価と、適切なコミュニケーションを心がける",
    相談すべき人: "信頼できる副官、人事の専門家、組織コンサルタント",
  },
  {
    卦番号: 8,
    卦名: "水地比",
    綜卦: 7,
    錯卦: 14,
    "綜卦との関係性（裏の視点）":
      "地水師（組織）と対。個人的な「親密さ（比）」が行き過ぎると、それを律する「組織（師）」が必要になる。",
    "錯卦との関係性（対極の世界）":
      "火天大有（大いなる所有）と対。人々が親しく集まることの対極は、一人のリーダーが全てを所有し、分配する状態。",
    互卦: 23,
    互卦との関係性:
      "親しむ（比）ことの内側には、山が剥げ落ちるような崩壊（山地剥）の危険が隠されています。馴れ合いは組織を腐敗させることを示します。",
    初爻変: 3,
    初爻変との関係性:
      "誠実な心で人と親しめば問題ない。誠実さは、産みの苦しみ（屯）を乗り越える力となります。",
    二爻変: 29,
    二爻変との関係性:
      "内側から誠実な心で人と親しむ時。困難（坎）な状況でも、真心からの交際は道を開きます。",
    三爻変: 39,
    三爻変との関係性:
      "外からの人とも誠実に親しむ時。たとえ目の前に険しい山（蹇）があっても、協力者を得て進むことができます。",
    四爻変: 45,
    四爻変との関係性:
      "賢明な王は三方向から狩りをさせ、前の獲物は逃がす。人々が集う（萃）時には、寛大な心で臨むべきです。",
    五爻変: 2,
    五爻変との関係性:
      "王の威光を広く示すように、公明正大に人と親しむべき。その姿は、万物を育む大地（坤）のようです。",
    上爻変: 20,
    上爻変との関係性:
      "指導者としての器がないまま人と親しもうとしても、誰もついてこない。人々をよく観察し（観）、自らを省みるべきです。",
    "アーキタイプ（原型）":
      "チームビルディング, パートナーシップ, コミュニティ",
    現代解釈の要約:
      "人々が互いに親しみ、協力し合うことで、大きな力を生み出す。",
    出た時の気持ち:
      "連帯感、安心感、所属する喜び。しかし、馴れ合いによる緊張感の欠如や、同調圧力を感じることもある",
    どうすればいい:
      "中心となる目的やリーダーを明確にする。誠実でオープンなコミュニケーションを保つ",
    相談すべき人: "求心力のあるリーダー、ファシリテーター",
  },
  {
    卦番号: 9,
    卦名: "風天小畜",
    綜卦: 10,
    錯卦: 62,
    "綜卦との関係性（裏の視点）":
      "天澤履（慎重）と対。力が「抑制」されている（小畜）からこそ、慎重に事を運ぶ（履）必要がある。",
    "錯卦との関係性（対極の世界）":
      "雷山小過（異常事態）と対。小さな抑制（小畜）の対極は、バランスを欠いた大きな異常事態。",
    互卦: 38,
    互卦との関係性:
      "内側には火と沢が反目し合う不和（睽）の状態をはらんでいます。力が少ししか蓄えられない（小畜）のは、内部の意見対立が原因であることを示唆します。",
    初爻変: 10,
    初爻変との関係性:
      "自分の本来の道に復帰すれば問題ありません。分不相応なことをせず、自分が踏むべき道（履）に戻ることが賢明です。",
    二爻変: 16,
    二爻変との関係性:
      "引かれるようにして元の道に戻るのは吉。無理に進むより、周囲に同調して戻るほうが喜び（豫）につながります。",
    三爻変: 57,
    三爻変との関係性:
      "夫婦が反目し合うように、内部対立が激化します。車輪が外れて進めないように、物事が停滞し、迷い（巽）が生じます。",
    四爻変: 37,
    四爻変との関係性:
      "誠実な心があれば、血を流すような危惧は去り、恐れはなくなります。家庭内（家人）のように誠意をもって接すれば、対立は解消されます。",
    五爻変: 61,
    五爻変との関係性:
      "誠実な真心（中孚）で繋がることで、周囲と共に豊かになれます。中心人物の誠意が、組織を一つにまとめます。",
    上爻変: 1,
    上爻変との関係性:
      "ついに雨が降り、物事が落ち着きます。成果は達成されましたが、これ以上進もうとすれば（乾）、逆に危険です。成果を守るべき時です。",
    "アーキタイプ（原型）": "一時的な停滞, 準備期間, スキルアップ",
    現代解釈の要約:
      "大きな力が、目に見えない障害によって、少しだけ留められている。時を待つ準備期間。",
    出た時の気持ち:
      "焦り、もどかしさ。前に進みたいのに進めないフラストレーションを感じる",
    どうすればいい:
      "焦らず、今は力を蓄える時期と割り切る。スキルアップや、内部の結束を固めることに注力する",
    相談すべき人: "経験豊富なメンター、精神的な支えとなる友人",
  },
  {
    卦番号: 10,
    卦名: "天澤履",
    綜卦: 9,
    錯卦: 61,
    "綜卦との関係性（裏の視点）":
      "風天小畜（抑制）と対。「慎重に進む」べき状況の裏には、常に何らかの障害や抑制が潜んでいる。",
    "錯卦との関係性（対極の世界）":
      "風沢中孚（真心）と対。外面的な礼儀（履）で危険を回避することの対極は、内面的な真心で心を通わせること。",
    互卦: 37,
    互卦との関係性:
      "内側には風と火が協力し合う家庭（家人）の象があります。危険な道を履む中でも、内部の結束や秩序が支えとなっていることを示します。",
    初爻変: 9,
    初爻変との関係性:
      "素直で純朴な行いなら、進んでも問題ありません。しかし、まだ力は小さく（小畜）、大きな成果は望めません。",
    二爻変: 15,
    二爻変との関係性:
      "目の見えない人がかろうじて見え、足の不自由な人がかろうじて歩ける。謙虚（謙）な姿勢で自分の分を守れば、何とかやっていけます。",
    三爻変: 6,
    三爻変との関係性:
      "武人が君主になるような、分不相応な行い。強い意志で進んでも、最後は争い事（訟）となり、危険です。",
    四爻変: 25,
    四爻変との関係性:
      "決然と進めば危険が伴います。しかし、それは天の災い（天雷无妄）ではなく、自ら招いたものです。",
    五爻変: 1,
    五爻変との関係性:
      "これまでの行いを振り返り、その吉凶をよく観察する時。もし完璧（乾）であれば、大いなる吉です。",
    上爻変: 61,
    上爻変との関係性:
      "これまでの行いを振り返り、その吉凶をよく観察する時。誠実な真心（中孚）に満ちていれば、大いなる吉です。",
    "アーキタイプ（原型）": "上位者との関係, リスク管理, マナー・規範",
    現代解釈の要約:
      "虎の尾を踏むような危険な状況。正しい態度と慎重さで災いを避ける。",
    出た時の気持ち:
      "緊張感、恐怖心。失敗への恐れ。しかし、それを乗り越えようとする慎重さと責任感も生まれる",
    どうすればいい:
      "礼儀とルールを徹底的に守る。相手への敬意を忘れず、常に慎重に行動する",
    相談すべき人: "信頼できる上司、法務・コンプライアンスの専門家",
  },
  {
    卦番号: 11,
    卦名: "地天泰",
    綜卦: 12,
    錯卦: 12,
    "綜卦との関係性（裏の視点）":
      "天地否（閉塞）と対。「平和（泰）」の裏側には、常に「閉塞（否）」の危機があるという表裏一体の関係。",
    "錯卦との関係性（対極の世界）":
      "天地否（閉塞）と対。調和の対極は不和。陰陽が正しく交わるか否かで、世界のあり方が決まる。",
    互卦: 54,
    互卦との関係性:
      "内側には少女（沢）が長男（雷）に嫁ぐ、順序の正しくない結婚（帰妹）の象があります。泰平の世にも、不正規な関係や秩序の乱れが隠れていることを示します。",
    初爻変: 12,
    初爻変との関係性:
      "茅の根を引き抜くように、仲間と共に進めば吉。泰平の世が終わり、閉塞（否）した状況に立ち向かう時は、団結が力となります。",
    二爻変: 46,
    二爻変との関係性:
      "不平等を包容し、中庸の道を行えば、大きな福を得られます。泰平の世においては、寛容さがさらなる発展（升）に繋がります。",
    三爻変: 36,
    三爻変との関係性:
      "終わりがないものはない。艱難の中で正道を守れば問題ありません。泰平の世が明知が傷つけられる（明夷）時へと転換しても、道を守れば大丈夫です。",
    四爻変: 19,
    四爻変との関係性:
      "帝乙が妹を嫁がせる。最高の幸福であり、大吉。泰平の世にあって、人々の上に臨む（臨）にふさわしい、めでたい出来事です。",
    五爻変: 34,
    五爻変との関係性:
      "城壁が土に還る。争いは避け、内部の充実に努めるべき。泰平の世の終わりに、力（大壮）を誇示するのではなく、静かに時を待つべきです。",
    上爻変: 5,
    上爻変との関係性:
      "城壁が土に還る。武力を用いれば凶。静かに天命を待つ（需）ことで、自滅を避けられます。",
    "アーキタイプ（原型）": "理想的な組織, 平和な時代, 心身の調和",
    現代解釈の要約:
      "天地の気が交わる、万物が調和した理想的な状態。しかし、その先に変化の兆しあり。",
    出た時の気持ち:
      "安心感、幸福感、安定。しかし、この平和が永遠に続かないことへの、漠然とした不安も感じうる",
    どうすればいい:
      "慢心せず、常に変化の兆しに注意を払う。周囲とのコミュニケーションを怠らない",
    相談すべき人: "客観的な視点を持つアドバイザー、未来志向の戦略家",
  },
  {
    卦番号: 12,
    卦名: "天地否",
    綜卦: 11,
    錯卦: 11,
    "綜卦との関係性（裏の視点）":
      "地天泰（平和）と対。「閉塞（否）」を耐え抜いた先には、必ず「平和（泰）」が待っている。",
    "錯卦との関係性（対極の世界）":
      "地天泰（平和）と対。不和の対極は調和。この困難は、調和を取り戻すための試練である。",
    互卦: 53,
    互卦との関係性:
      "内側には木が山の上で漸進的に成長する（風山漸）象があります。閉塞した状況でも、内では着実な進歩や成長の可能性があります。",
    初爻変: 11,
    初爻変との関係性:
      "茅の根を引き抜くように、仲間と共に進めば吉。閉塞（否）した状況を打ち破り、泰平（泰）の世を招くには、団結が必要です。",
    二爻変: 25,
    二爻変との関係性:
      "小人を包容し、君子は正道を守れば吉。閉塞した状況では、私心なく（无妄）耐え忍ぶことが、やがて道を開きます。",
    三爻変: 6,
    三爻変との関係性:
      "恥を包み隠す時。天命に従い、静かにしていれば、争い事（訟）を避け、幸福を得られます。",
    四爻変: 33,
    四爻変との関係性:
      "君子にとっての吉。小人は閉塞する。賢者はこの機に世間から逃れ（遯）、身の安全を図ります。",
    五爻変: 20,
    五爻変との関係性:
      "閉塞した状況が、今まさに終わろうとしています。よく状況を観察し（観）、行動の時を待つべきです。",
    上爻変: 35,
    上爻変との関係性:
      "ついに閉塞状態は終わります。これまで苦しんだ分、大きな喜び（晋）が待っています。",
    "アーキタイプ（原型）": "組織の機能不全, 社会の分断, 行き詰まり",
    現代解釈の要約:
      "天地が交わらず、物事が停滞する困難な時期。しかし、その極みに反転の兆しあり。",
    出た時の気持ち:
      "無力感、閉塞感、孤独。怒りや不満を感じるが、それを表現することも難しい",
    どうすればいい:
      "無理に行動せず、内なる力を養い、時を待つ。自分を客観的に見つめ直し、協力者を探す",
    相談すべき人: "利害関係のない第三者、同じ苦しみを分かち合える仲間",
  },
  {
    卦番号: 13,
    卦名: "天火同人",
    綜卦: 14,
    錯卦: 7,
    "綜卦との関係性（裏の視点）":
      "火天大有（大いなる所有）と対。「同志との団結」が、やがて「大いなる所有」へと繋がっていく。",
    "錯卦との関係性（対極の世界）":
      "地水師（組織）と対。理念で集う水平な協力関係（同人）の対極は、規律で動く垂直な組織。",
    互卦: 44,
    互卦との関係性:
      "内側には一つの陰が五つの陽と出会う（天風姤）象が隠されています。人々と協調する（同人）中にも、不純な動機や予期せぬ出会いの可能性があります。",
    初爻変: 14,
    初爻変との関係性:
      "門を出て人々と交われば問題ありません。広く公平に交わることで、大きな所有（大有）に繋がります。",
    二爻変: 7,
    二爻変との関係性:
      "一族だけで固まるのは、後悔の元。広く公平に交わるべき時に徒党を組むと、軍隊（師）を動かすような争いになります。",
    三爻変: 37,
    三爻変との関係性:
      "兵を草むらに伏せ、高い丘に登るが、三年間は戦えない。家庭内（家人）のように仲間意識が強すぎると、かえって動けなくなります。",
    四爻変: 30,
    四爻変との関係性:
      "乗り越えられない壁はない。誠の心で団結すれば、火（離）のように困難を焼き尽くし、必ず成功します。",
    五爻変: 33,
    五爻変との関係性:
      "郊外で人々が会同する。最初は泣き叫ぶが、後には笑う。一度は衝突し逃げ出し（遯）ても、最後は和解できます。",
    上爻変: 49,
    上爻変との関係性:
      "郊外で人々が会同し、後悔はない。志を同じくする者が集まれば、旧弊を改める革命（革）も成し遂げられます。",
    "アーキタイプ（原型）": "オープンイノベーション, プロジェクトチーム, NPO",
    現代解釈の要約:
      "志を同じくする人々が、私心を捨て、公正な目的のために協力し合う。",
    出た時の気持ち:
      "連帯感、高揚感。理想を共有する喜び。しかし、理想と現実のギャップや、意見の対立に直面することもある",
    どうすればいい:
      "公明正大な目的を掲げる。多様な意見を尊重し、対話を通じて信頼関係を築く",
    相談すべき人: "多様な背景を持つ人々、ビジョナリー",
  },
  {
    卦番号: 14,
    卦名: "火天大有",
    綜卦: 13,
    錯卦: 8,
    "綜卦との関係性（裏の視点）":
      "天火同人（同志）と対。「大いなる所有」を維持するには、「同志との団結」という精神的な基盤が必要。",
    "錯卦との関係性（対極の世界）":
      "水地比（親密）と対。頂点から全体を所有する（大有）対極は、個々が親しく集まること。",
    互卦: 43,
    互卦との関係性:
      "内側には一つの陰を五つの陽が決断する（沢天夬）象が隠されています。大きな所有（大有）は、時に不正を断ち切る強い決断力を必要とします。",
    初爻変: 13,
    初爻変との関係性:
      "有害なものと交わらなければ問題ありません。大きな富を得た時は、悪人との交わり（同人）を断つべきです。",
    二爻変: 8,
    二爻変との関係性:
      "大きな車で荷を運ぶ。進んでも問題ない。多くの人々と親しみ助け合う（比）ことで、富はさらに増大します。",
    三爻変: 50,
    三爻変との関係性:
      "公が天子に貢物を献上する。小人にはできないこと。大きな富を持つ者は、鼎を献上するように、社会に貢献する責任があります。",
    四爻変: 30,
    四爻変との関係性:
      "誠実さを交わし、威厳があれば吉。富によって驕らず、明知（離）と誠実さで人と接するべきです。",
    五爻変: 38,
    五爻変との関係性:
      "天の助けがあり、大吉。誠実であれば、たとえ不和（睽）の状態にあっても、天佑神助によって万事うまくいきます。",
    上爻変: 26,
    上爻変との関係性:
      "天の助けがあり、大吉。天からの福を、山のように大きく蓄える（大畜）ことができます。",
    "アーキタイプ（原型）": "絶頂期の企業, 成功者, 社会貢献(CSR)",
    現代解釈の要約:
      "繁栄が極まり、その光が広く行き渡る。得た富や力を正しく管理し、社会に還元する。",
    出た時の気持ち:
      "達成感、万能感。しかし、同時に失うことへの恐れや、驕りへの警戒心も生まれる",
    どうすればいい:
      "謙虚さと感謝の気持ちを忘れない。得たものを独占せず、公正に分配する。社会への貢献を考える",
    相談すべき人: "信頼できる資産管理者、慈善活動家、自分を戒めてくれる友人",
  },
  {
    卦番号: 15,
    卦名: "地山謙",
    綜卦: 16,
    錯卦: 52,
    "綜卦との関係性（裏の視点）":
      "雷地豫（喜び）と対。「謙虚」であるからこそ、慢心することなく、真の「喜び」を享受できる。",
    "錯卦との関係性（対極の世界）":
      "艮為山（静止）と対。社会の中で積極的に振る舞う謙虚さ（謙）の対極は、独り静かに止まること。",
    互卦: 40,
    互卦との関係性:
      "内側には雷と雨で困難が解ける（雷水解）象があります。謙虚さの裏には、問題を解決し、和解へと導く力が秘められています。",
    初爻変: 16,
    初爻変との関係性:
      "謙虚さに、さらに謙虚さを加えれば、大きな川を渡るのも吉。謙虚な姿勢は、喜び（豫）をもって受け入れられます。",
    二爻変: 10,
    二爻変との関係性:
      "謙虚さが鳴り響く。正しくあれば吉。その徳が広く知れ渡り、危険な道（履）も安全に進めます。",
    三爻変: 39,
    三爻変との関係性:
      "労苦をいとわない謙虚さ。問題ない。どんな困難（蹇）な状況でも、謙虚な努力は報われます。",
    四爻変: 52,
    四爻変との関係性:
      "富める者が、その富を分け与える。問題ない。山（艮）のように動じず、私欲なく富を分配するのは謙虚さの現れです。",
    五爻変: 2,
    五爻変との関係性:
      "近隣の国を征伐する。道に適っていれば問題ない。大地（坤）のような謙虚さも、時には不正を正す断固たる行動を必要とします。",
    上爻変: 62,
    上爻変との関係性:
      "謙虚さが鳴り響く。軍隊を動かすのは良い。ただし自分の町や国を正す場合に限る。少しやり過ぎる（小過）くらいの断固さが必要な時もあります。",
    "アーキタイプ（原型）": "優れたリーダー, 謙虚な実力者, 名君",
    現代解釈の要約:
      "能力がありながらも、自らへりくだる。その謙虚さが、持続的な成功と信頼をもたらす。",
    出た時の気持ち:
      "誇らしさと同時に、驕りや慢心への恐れ。他者からの期待に応えなければというプレッシャー",
    どうすればいい:
      "常に学び続ける姿勢を忘れない。他者の意見に耳を傾け、自分から頭を下げる",
    相談すべき人: "自分に厳しい意見を言ってくれる人、異分野の専門家",
  },
  {
    卦番号: 16,
    卦名: "雷地豫",
    綜卦: 15,
    錯卦: 51,
    "綜卦との関係性（裏の視点）":
      "地山謙（謙虚）と対。「喜び」の裏側には、常に慢心を戒める「謙虚」さが必要である。",
    "錯卦との関係性（対極の世界）":
      "震為雷（衝撃）と対。準備された計画的な喜び（豫）の対極は、予期せぬ突然の衝撃。",
    互卦: 39,
    互卦との関係性:
      "内側には水と山による困難（蹇）が潜んでいます。喜び楽しむ（豫）ことの裏には、常に艱難辛苦が隠れていることを忘れてはなりません。",
    初爻変: 15,
    初爻変との関係性:
      "権力者に媚びへつらって喜ぶのは、凶。その姿勢は日が暮れるまで続かない。真の謙虚（謙）さからくる喜びではありません。",
    二爻変: 9,
    二爻変との関係性:
      "石のように固く、日が暮れるまで待つこともない。正しくあれば吉。目先の喜びに惑わされず、信念を貫けば、力が小さくても（小畜）道は開けます。",
    三爻変: 51,
    三爻変との関係性:
      "見上げて喜び、後悔が残る。ぐずぐずしていると後悔する。雷（震）のように、好機を逃さず素早く行動すべきです。",
    四爻変: 40,
    四爻変との関係性:
      "病気が長く続いているが、死ぬことはない。喜び楽しむ（豫）中で慢心し病気になっても、根本的な問題は解決（解）に向かいます。",
    五爻変: 62,
    五爻変との関係性:
      "暗闇の中で喜びを得る。それでもなお変化しなければ、少しやり過ぎ（小過）だが問題はない。",
    上爻変: 2,
    上爻変との関係性:
      "すっかり慢心しきって喜んでいるが、変化すれば問題ない。その心は大地（坤）のように、本来の柔順さに戻るべきです。",
    "アーキタイプ（原型）": "イベント, 祝賀ムード, エンターテインメント",
    現代解釈の要約:
      "準備が整った上での喜びや安楽。しかし、その楽しみに溺れることへの警告。",
    出た時の気持ち:
      "喜び、解放感、安堵。しかし、楽しみが永遠に続かないことへの寂しさや、次の活動への漠然とした不安",
    どうすればいい:
      "心から楽しむ。しかし、同時に次への準備や、現状維持のための危機管理も怠らない",
    相談すべき人: "一緒に喜んでくれる仲間、冷静な計画者",
  },
  {
    卦番号: 17,
    卦名: "沢雷随",
    綜卦: 18,
    錯卦: 40,
    "綜卦との関係性（裏の視点）":
      "山風蠱（腐敗）と対。「腐敗」した状況があるからこそ、誰に「従う」べきかが問われる。",
    "錯卦との関係性（対極の世界）":
      "雷水解（解決）と対。既存の秩序に「従う」ことの対極は、困難な状況から「解放」されること。",
    互卦: 53,
    互卦との関係性:
      "内側には物事が徐々に進展する（風山漸）象が隠されています。人に従う（随）ことは、短期的な損得ではなく、結果的に着実な進歩に繋がることを示唆します。",
    初爻変: 18,
    初爻変との関係性:
      "役職や考えが変わる時。古いもの（蠱）を改める変化の始まりです。固執せず流れに従えば、新しい道が開けます。",
    二爻変: 18,
    二爻変との関係性:
      "目先の利益や未熟な意見（小さい子）に従うと、本当に大切なもの（大きい人）を失います。従う相手を見極める重要性を示し、安易な追随は腐敗（蠱）を招きます。",
    三爻変: 3,
    三爻変との関係性:
      "確固たる指導者や大義に従えば、多少の犠牲を払っても求めるものを得られます。産みの苦しみ（屯）を乗り越えるには、信じるべきものに従う覚悟が必要です。",
    四爻変: 51,
    四爻変との関係性:
      "人や時勢に従うことで収穫（震は動く・得る）がありますが、その動機が正しくなければ凶。誠実な心で従うことが信頼に繋がります。",
    五爻変: 25,
    五爻変との関係性:
      "優れた人物や理念に誠意を尽くせば吉。真心から信じ従うことで、自然な成り行き（无妄）として良い結果がもたらされます。",
    上爻変: 45,
    上爻変との関係性:
      "最高の誠意を尽くして従うことで、その徳が天に通じます。人々が集い敬う（萃）ほどの中心人物となり、事を成し遂げられます。",
    "アーキタイプ（原型）": "トレンドへの対応, フォロワーシップ, 時代の変化",
    現代解釈の要約:
      "時代の流れや他者の動きをよく見て、柔軟に対応する。ただし、盲従は危険。",
    出た時の気持ち:
      "好奇心、期待感。しかし、自分の価値観とのズレや、変化への追随についていけない焦りも感じる",
    どうすればいい:
      "盲従せず、本質を見極める。自分が従うべき人や理念を、慎重に選択する",
    相談すべき人: "その分野のインフルエンサー、経験豊富な先輩",
  },
  {
    卦番号: 18,
    卦名: "山風蠱",
    綜卦: 17,
    錯卦: 39,
    "綜卦との関係性（裏の視点）":
      "沢雷随（従う）と対。「腐敗」を立て直すには、旧弊に従わず、新しいリーダーに従う必要がある。",
    "錯卦との関係性（対極の世界）":
      "水山蹇（困難）と対。内部が「腐敗」している状況の対極は、外部からの障害によって「足踏み」させられる状況。",
    互卦: 54,
    互卦との関係性:
      "内側には順序の正しくない関係（雷沢帰妹）が隠されています。物事が腐敗しきった（蠱）原因が、内側の不適切な秩序や関係性にあることを示唆します。",
    初爻変: 17,
    初爻変との関係性:
      "父が腐敗させた事柄を、子が正す時。先代の過ちを正すことで、危険はなくなり、最終的には吉。新しい流れに従う（随）べきです。",
    二爻変: 17,
    二爻変との関係性:
      "母が腐敗させた事柄を、子が正す時。ただし、断固として正道を守るべきで、中途半端は許されません。甘えを捨てて流れ（随）を変えるべきです。",
    三爻変: 50,
    三爻変との関係性:
      "父が腐敗させた事柄を正す。多少の後悔はあるが、大きな過ちにはならない。腐敗を正し、鼎の足を入れ替えるように組織を刷新します。",
    四爻変: 57,
    四爻変との関係性:
      "父が腐敗させた事柄を、子が継いで称賛される。腐敗の原因を根本から絶ち、新しい風（巽）を吹き込むことで名声を得ます。",
    五爻変: 46,
    五爻変との関係性:
      "父祖の腐敗を正すのではなく、高尚な道に進む。世俗的な事柄から離れ、精神的な向上（升）を目指すことで道が開けます。",
    上爻変: 26,
    上爻変との関係性:
      "役人にならず、自分の徳を高めることに専念する。腐敗した世俗から離れ、天の徳を大きく蓄える（大畜）ことで、真の価値が生まれます。",
    "アーキタイプ（原型）": "事業再生, 組織改革, 負の遺産の清算",
    現代解釈の要約:
      "親や先代から引き継いだ問題や、長年の腐敗に、断固として立ち向かう時。",
    出た時の気持ち:
      "使命感、責任感。しかし、痛みを伴う改革への抵抗や、解決の困難さに、時に無力感を感じる",
    どうすればいい:
      "問題を直視し、感情的にならず、根本的な解決を目指す。痛みを恐れない覚悟を持つ",
    相談すべき人: "改革のパートナー、コンサルタント、利害関係のない第三者",
  },
  {
    卦番号: 19,
    卦名: "地沢臨",
    綜卦: 20,
    錯卦: 24,
    "綜卦との関係性（裏の視点）":
      "風地観（観察）と対。民衆に「臨む」リーダーは、常に民衆から「観察」される立場にある。",
    "錯卦との関係性（対極の世界）":
      "地雷復（回復）と対。陽気が伸びていく「成長期」の対極は、陰が極まり、陽気がようやく「回復」し始める時期。",
    互卦: 24,
    互卦との関係性:
      "内側には一陽来復のエネルギーが隠されています。人々の上に臨む（臨）時、その根底には物事を回復させようとする強い意志があります。",
    初爻変: 20,
    初爻変との関係性:
      "仲間と共に臨めば吉。正しい道であれば問題ありません。広く人々を観察し（観）、志を同じくする者と協力すべきです。",
    二爻変: 33,
    二爻変との関係性:
      "甘い言葉で臨むのはよくない。誠実さがなければ、人は離れていきます。賢者は危険を察知し、世から逃れます（遯）。",
    三爻変: 7,
    三爻変との関係性:
      "柔順な態度で臨む。問題ない。威圧的ではなく、人々を包み込むようなリーダーシップ（師）が求められます。",
    四爻変: 24,
    四爻変との関係性:
      "全てを包容し、臨む。問題ない。王者にふさわしい態度。陰が極まり陽が復する（復）ように、寛容さが人々の心を掴みます。",
    五爻変: 11,
    五爻変との関係性:
      "知恵をもって臨む。大君にふさわしい道で吉。その聡明な統治は、やがて泰平（泰）の世をもたらします。",
    上爻変: 54,
    上爻変との関係性:
      "誠実さをもって臨めば吉。問題ない。誠意ある態度は、たとえ順序が正しくない状況（帰妹）であっても、最終的には良い結果に導きます。",
    "アーキタイプ（原型）": "リーダーシップ, 教育, 成長期, 春",
    現代解釈の要約:
      "物事が大いに発展・成長する幸運期。リーダーが民に臨み、導く。",
    出た時の気持ち:
      "責任感、高揚感。育てる喜び。しかし、自分のやり方が正しいかという不安や、成長のプレッシャーも感じる",
    どうすればいい:
      "威圧せず、知恵と誠実さをもって導く。相手の成長を信じ、待つ姿勢も重要",
    相談すべき人: "優れた教育者、経験豊富なリーダー",
  },
  {
    卦番号: 20,
    卦名: "風地観",
    綜卦: 19,
    錯卦: 23,
    "綜卦との関係性（裏の視点）":
      "地沢臨（臨む）と対。人々を正しく「観察」することが、正しく「臨む」ための前提条件となる。",
    "錯卦との関係性（対極の世界）":
      "山地剝（崩壊）と対。物事の本質を冷静に「観察」することの対極は、状況が見えず、全てが「崩壊」していく状態。",
    互卦: 23,
    互卦との関係性:
      "内側には物事が剥がれ落ちる（山地剥）危機が潜んでいます。人々を観察する（観）のは、内なる崩壊の兆しに気づいているからです。",
    初爻変: 19,
    初爻変との関係性:
      "子供のような未熟な見方。小人には問題ないが、君子には恥。大所高所からではなく、眼前の状況に臨む（臨）だけの視野の狭さを示します。",
    二爻変: 34,
    二爻変との関係性:
      "門の隙間から窺う。女性が固く正道を守るのに良い。視野は狭いが、自分の分を守るにはよく、力（大壮）を蓄える時です。",
    三爻変: 12,
    三爻変との関係性:
      "自らのこれまでの行いを観察し、進むべきか退くべきかを決める時。状況は閉塞（否）しており、冷静な自己分析が不可欠です。",
    四爻変: 23,
    四爻変との関係性:
      "その国の光、すなわち優れた文化や人材を観察する時。賓客として遇されるのが良い。崩壊（剥）寸前の国にも、学ぶべき点があります。",
    五爻変: 8,
    五爻変との関係性:
      "自分自身を深く観察する時。進んでも退いても問題ない。自己の内面と向き合い、人々とどう親しむ（比）べきかを見つめ直します。",
    上爻変: 42,
    上爻変との関係性:
      "その人の生き方を観察する時。君子であれば問題ない。人々の模範となる生き方は、社会に利益（益）をもたらします。",
    "アーキタイプ（原型）": "市場調査, 自己分析, 現状把握",
    現代解釈の要約:
      "物事を注意深く観察し、本質を見抜く。他者を見るだけでなく、自己を省みる時。",
    出た時の気持ち:
      "冷静、客観的。しかし、情報を集めるだけで行動に移せないもどかしさや、自分の欠点と向き合う辛さを感じる",
    どうすればいい:
      "感情を排し、客観的に分析する。多様な視点を取り入れ、自分を省みる",
    相談すべき人: "データアナリスト、客観的な意見をくれる友人、コーチ",
  },
  {
    卦番号: 21,
    卦名: "火雷噬嗑",
    綜卦: 22,
    錯卦: 27,
    "綜卦との関係性（裏の視点）":
      "山火賁（飾り）と対。障害を「噛み砕く」実質的な行動の裏には、物事を美しく見せる「飾り」の知恵がある。",
    "錯卦との関係性（対極の世界）":
      "山雷頤（養う）と対。障害を断固として「排除」することの対極は、慈しみ「養う」こと。硬と軟の対比。",
    互卦: 39,
    互卦との関係性:
      "内側には険しい困難（水山蹇）が隠されています。障害物を噛み砕く（噬嗑）力は、内なる艱難を乗り越えるために必要とされます。",
    初爻変: 22,
    初爻変との関係性:
      "足枷をはめられ、足先が見えなくなる。軽い罰であり、大きな過ちにはならない。問題の初期段階で、見た目（賁）を飾る余裕はありません。",
    二爻変: 48,
    二爻変との関係性:
      "肉に鼻まで潜り込ませる。軽い罰。問題に深入りしすぎて、まるで井戸（井）に落ちたように身動きが取れなくなります。",
    三爻変: 27,
    三爻変との関係性:
      "干し肉を噛むが、毒にあたる。少し恥をかくが、大きな過ちではない。養う（頤）べきでないものに手を出した警告です。",
    四爻変: 25,
    四爻変との関係性:
      "乾いた肉を噛み、金色の矢を得る。困難の中で正道を守れば、予期せぬ利（无妄の福）を得ます。",
    五爻変: 51,
    五爻変との関係性:
      "金の矢を背負い、堅い骨を噛む。困難だが正道を守れば吉。雷（震）のような衝撃的な困難も、覚悟を決めれば乗り越えられます。",
    上爻変: 35,
    上爻変との関係性:
      "耳たぶを失うほど、言うことを聞かない。凶。警告を無視し続けた結果、物事が進展（晋）するどころか、大きな罰を受けます。",
    "アーキタイプ（原型）": "問題解決, 不正追及, 法と秩序",
    現代解釈の要約:
      "間に挟まった障害物や不正を「噛み砕き」、断固たる態度で問題を解決する。",
    出た時の気持ち:
      "正義感、怒り。障害を取り除きたいという強い意志。しかし、やり過ぎによる反発や、対立の激化を恐れる",
    どうすればいい:
      "感情的にならず、公正な裁きと根本解決を目指す。証拠に基づき、冷静に対処する",
    相談すべき人: "弁護士、監査役、公平な第三者",
  },
  {
    卦番号: 22,
    卦名: "山火賁",
    綜卦: 21,
    錯卦: 28,
    "綜卦との関係性（裏の視点）":
      "火雷噬嗑（噛み砕く）と対。物事を美しく「飾る」ことの裏には、本質を損なう障害を「噛み砕く」という厳しい側面がある。",
    "錯卦との関係性（対極の世界）":
      "澤風大過（危機）と対。物事を美しく「飾る」余裕のある状態の対極は、組織の存亡に関わる「危機」に瀕している状態。",
    互卦: 40,
    互卦との関係性:
      "内側には困難が雪解け水のように解消される（雷水解）象があります。物事を飾る（賁）のは、内面の困難が解決に向かっているからです。",
    初爻変: 21,
    初爻変との関係性:
      "自分の足で歩くことを飾る。車を捨てて歩く。虚飾を捨て、障害物を噛み砕く（噬嗑）ように、実質を取るべきです。",
    二爻変: 47,
    二爻変との関係性:
      "自分のひげを飾る。他人の装飾に頼らず、自立すべきです。虚飾に頼れば、沢の水が涸れる（困）ように、困窮します。",
    三爻変: 30,
    三爻変との関係性:
      "濡れて輝くように飾る。永遠に正しければ吉。その美しさは、火（離）のように内面から輝き出るものでなければなりません。",
    四爻変: 37,
    四爻変との関係性:
      "粗末な贈り物だが、心はこもっている。白馬が駆けるように、飾り気はなくても、家族（家人）のような真心が大切です。",
    五爻変: 52,
    五爻変との関係性:
      "白いだけの飾り。問題はない。全ての装飾を削ぎ落とし、山（艮）のように動じない、質実剛健な本質に還ります。",
    上爻変: 26,
    上爻変との関係性:
      "白いだけの飾り。究極的には吉。全ての虚飾を捨て、天の徳を大きく蓄える（大畜）ことが、最高の飾りとなります。",
    "アーキタイプ（原型）": "ブランディング, デザイン, プレゼンテーション",
    現代解釈の要約:
      "表面的な美しさ（形式）と、その内にある本質との調和が問われる。",
    出た時の気持ち:
      "創造性、美的センスを発揮する喜び。しかし、本質が伴っていないことへの不安や、見せかけだけだと思われることへの恐れ",
    どうすればいい:
      "表面的な美しさに溺れず、内面の充実を伴わせる。形式と実質の調和を考える",
    相談すべき人: "クリエイティブディレクター、デザイナー、誠実な批評家",
  },
  {
    卦番号: 23,
    卦名: "山地剝",
    綜卦: 24,
    錯卦: 20,
    "綜卦との関係性（裏の視点）":
      "地雷復（回復）と対。「崩壊」が極まるからこそ、次の「回復」の兆しが生まれる。陰極まれば陽となる、循環の関係。",
    "錯卦との関係性（対極の世界）":
      "風地観（観察）と対。物事が「崩壊」していく状況の対極は、全てを冷静に「観察」し、本質を見抜いている状態。",
    互卦: 2,
    互卦との関係性:
      "内側には全てが陰の坤為地が潜んでいます。物事が剥げ落ちる（剥）のは、受容性（坤）が行き過ぎ、陰の力に全てが侵食されてしまった結果です。",
    初爻変: 24,
    初爻変との関係性:
      "ベッドの脚が剥げ落ちる。正道を失い、凶。崩壊の始まりは、一陽来復（復）の兆しを失わせます。",
    二爻変: 43,
    二爻変との関係性:
      "ベッドの枠が剥げ落ちる。正道を失い、凶。さらに崩壊は進み、決断（夬）を迫られますが、時すでに遅しです。",
    三爻変: 27,
    三爻変との関係性:
      "仲間を失う。問題ない。周囲が剥げ落ちていく中で、自分を養う（頤）ことに専念し、孤立しても道を守ります。",
    四爻変: 4,
    四爻変との関係性:
      "魚の群れが、宮中の女官の寵愛を受けるように通過する。問題ない。崩壊の中にも、蒙昧（蒙）な者が時流に乗って利を得ることはあります。",
    五爻変: 52,
    五爻変との関係性:
      "大きな果実が、まだ食べられずに残っている。君子は乗り物を得、小人は家を失う。最後の陽（果実）が残り、君子には再起の機会（艮）が、小人には破滅が訪れます。",
    上爻変: 35,
    上爻変との関係性:
      "大きな果実が、まだ食べられずに残っている。君子は乗り物を得、小人は家を失う。最後の陽は、夜明けの光（晋）のように、次代への希望となります。",
    "アーキタイプ（原型）": "時代の終わり, 衰退期, 組織解体",
    現代解釈の要約:
      "物事が下から徐々に剥がれ落ち、衰退していく。しかし、その先に再生の兆しあり。",
    出た時の気持ち:
      "喪失感、無力感、恐怖。変化に抵抗できないことへの諦め。しかし、その先に再生があるという希望も",
    どうすればいい:
      "無理な抵抗を避け、現状を受け入れる。次に備えて、守るべきもの（再生の種）を明確にする",
    相談すべき人:
      "事業再生の専門家、キャリアコンサルタント、精神的な支えとなる仲間",
  },
  {
    卦番号: 24,
    卦名: "地雷復",
    綜卦: 23,
    錯卦: 19,
    "綜卦との関係性（裏の視点）":
      "山地剝（崩壊）と対。命が「回復」する前には、必ず古いものが「崩壊」する段階があることを示す。",
    "錯卦との関係性（対極の世界）":
      "地沢臨（成長）と対。どん底から「回復」する時期の対極は、勢いよく「成長」していく幸運期。",
    互卦: 2,
    互卦との関係性:
      "内側は全てが陰の坤為地です。一陽来復の力は、母なる大地（坤）のエネルギーを源として生まれます。",
    初爻変: 2,
    初爻変との関係性:
      "遠くまで行かずに復帰する。後悔はない。大吉。道に迷ってもすぐに引き返すことで、大地の安定（坤）を取り戻します。",
    二爻変: 36,
    二爻変との関係性:
      "満足して復帰すれば吉。その徳は、明知を地に隠す（明夷）賢者のように、内面に輝きます。",
    三爻変: 19,
    三爻変との関係性:
      "頻繁に復帰する。危ういが、問題はない。何度も道を踏み外しそうになるが、その都度立ち返ることで、人々の上に臨む（臨）徳を保ちます。",
    四爻変: 21,
    四爻変との関係性:
      "仲間と復帰の道を歩む。一人だけ正しい道を行く。障害を噛み砕き（噬嗑）、孤独でも正道を進みます。",
    五爻変: 17,
    五爻変との関係性:
      "篤く信じて復帰する。吉。誠実な心で正しい流れに従う（随）ことで、道が開けます。",
    上爻変: 25,
    上爻変との関係性:
      "道に迷って復帰する。凶。天災や人災がある。復帰の時機を誤ると、予期せぬ災い（无妄）を招きます。",
    "アーキタイプ（原型）": "V字回復, 再生, 再出発, 冬至",
    現代解釈の要約:
      "困難の底から、陽の気が一つ戻り、希望の光が見え始める再起の時。",
    出た時の気持ち:
      "希望、安堵、新しい始まりへの期待感。しかし、また失敗するかもしれないという不安も伴う",
    どうすればいい:
      "焦らず、原点に立ち返る。誠実な努力を地道に積み重ね、信頼を回復する",
    相談すべき人: "同じ失敗を乗り越えた先輩、支援者、応援してくれるファン",
  },
  {
    卦番号: 25,
    卦名: "天雷无妄",
    綜卦: 26,
    錯卦: 44,
    "綜卦との関係性（裏の視点）":
      "山天大畜（大いに蓄える）と対。自然体で無心な状態（无妄）の裏側には、意図的に力を蓄える戦略がある。",
    "錯卦との関係性（対極の世界）":
      "天風姤（出会い）と対。自らの内なる真実に従うことの対極は、外部からの予期せぬ出会いに対応すること。",
    互卦: 53,
    互卦との関係性:
      "内側には物事が徐々に進展する（風山漸）象が隠されています。自然の成り行き（无妄）に従うことは、一見遠回りのようでも着実な進歩に繋がることを示します。",
    初爻変: 26,
    初爻変との関係性:
      "私心なく、あるがままに進めば吉。自然体で行動することで、天の徳を大きく蓄える（大畜）ことができます。",
    二爻変: 46,
    二爻変との関係性:
      "耕さずして収穫し、開墾せずして畑を得る。目先の利益を考えず自然に任せることで、かえって昇進（升）するような思わぬ利を得ます。",
    三爻変: 42,
    三爻変との関係性:
      "思いがけない災難。繋いでいた牛を、通りすがりの人が盗んでいった。自然に任せても理不尽な災いが起こりますが、それは他人の利益（益）となっている側面もあります。",
    四爻変: 21,
    四爻変との関係性:
      "正道を守り続ければ、問題はありません。たとえ災難があっても、障害を噛み砕く（噬嗑）ように乗り越えれば、道は開けます。",
    五爻変: 17,
    五爻変との関係性:
      "思いがけない病。薬も使わないのに、自然に治って喜ぶ。無理に対処しようとせず、時の流れに従う（随）ことで快方に向かいます。",
    上爻変: 12,
    上爻変との関係性:
      "行き過ぎれば災いがあります。自然の成り行きに任せるのも度を越せば、かえって物事が閉塞（否）する状況を招きます。",
    "アーキタイプ（原型）": "自然体, 誠実, 理不尽な災難",
    現代解釈の要約:
      "偽りのない誠実な行動が基本。しかし、時に避けられない不運に見舞われることも。",
    出た時の気持ち:
      "混乱、不公平感、怒り。なぜ自分だけが、という無力感。しかし、その中でも誠実さを保とうとする意志",
    どうすればいい:
      "感情的にならず、状況を客観的に把握する。私心なく、自然体でいることで、道が開けるのを待つ",
    相談すべき人: "信頼できる友人、カウンセラー、法的な専門家",
  },
  {
    卦番号: 26,
    卦名: "山天大畜",
    綜卦: 25,
    錯卦: 41,
    "綜卦との関係性（裏の視点）":
      "天雷无妄（自然体）と対。力を「大いに蓄える」意図的な行動の裏には、無心で自然体な状態がある。",
    "錯卦との関係性（対極の世界）":
      "山沢損（損なう）と対。「大いに蓄える」ことの対極は、自らを「損なう」ことで全体を益すること。",
    互卦: 54,
    互卦との関係性:
      "内側には順序の正しくない関係（雷沢帰妹）が隠されています。大きな力を蓄える（大畜）中でも、内情には不正規な問題が潜んでいる可能性を示唆します。",
    初爻変: 25,
    初爻変との関係性:
      "危険がある。中止するのが良い。無理に進もうとすれば、予期せぬ災い（无妄）を招きます。今は力を蓄える時です。",
    二爻変: 45,
    二爻変との関係性:
      "車の車軸が外れる。無理に進めない。人々が集う（萃）ことで力が分散し、かえって前進できなくなる状態です。",
    三爻変: 14,
    三爻変との関係性:
      "良馬が疾走する。困難な中でも正道を守れば吉。その力は大きな富（大有）を生み出す原動力となります。",
    四爻変: 9,
    四爻変との関係性:
      "去勢した牡牛の角に横木を当てて、角が人を傷つけないようにする。大吉。力が強すぎると（小畜とは逆）、それを抑える工夫が必要です。",
    五爻変: 11,
    五爻変との関係性:
      "去勢した豚の牙。吉。強大な牙を抜くことで、かえって泰平（泰）の世がもたらされます。力を適切にコントロールすることの重要性を示します。",
    上爻変: 18,
    上爻変との関係性:
      "天の大通りを進むように、障害なく進める。亨る。蓄えた力が頂点に達し、腐敗（蠱）した世の中を正すほどの力を発揮します。",
    "アーキタイプ（原型）": "人材育成, 研究開発, 自己投資",
    現代解釈の要約:
      "力を内に蓄え、知識や能力を養い、来るべき時に備える、戦略的な準備期間。",
    出た時の気持ち:
      "期待感、成長への喜び。しかし、すぐに結果が出ないことへの焦りや、投資が正しいかという不安",
    どうすればいい:
      "短期的な成果を求めない。明確なビジョンを持ち、適切な抑制と指導の下で、着実に育む",
    相談すべき人: "優れた指導者、投資家、長期的な視点を持つパートナー",
  },
  {
    卦番号: 27,
    卦名: "山雷頤",
    綜卦: 28,
    錯卦: 21,
    "綜卦との関係性（裏の視点）":
      "澤風大過（異常事態）と対。正しく「養う」ことの裏側には、組織が崩壊寸前の「異常事態」がある。",
    "錯卦との関係性（対極の世界）":
      "火雷噬嗑（噛み砕く）と対。慈しみ「養う」ことの対極は、障害を断固として「排除」すること。",
    互卦: 2,
    互卦との関係性:
      "内側は全てが陰の坤為地です。物を養い育てる（頤）力は、全ての生命を育む母なる大地（坤）のエネルギーに基づいています。",
    初爻変: 28,
    初爻変との関係性:
      "自分の霊的な亀を捨てて、私の口を羨ましそうに見ている。凶。本質を忘れ、目先の欲望に走れば、度が過ぎた（大過）災いを招きます。",
    二爻変: 27,
    二爻変との関係性:
      "道理に背いて養いを求める。凶。十年経っても役立たず。正しい方法で養わなければ（頤）、その努力は実りません。",
    三爻変: 21,
    三爻変との関係性:
      "道理に背いて養いを求める。凶。虎が獲物を狙うように貪欲な姿。その姿勢は、障害を噛み砕く（噬嗑）どころか、自らを滅ぼします。",
    四爻変: 42,
    四爻変との関係性:
      "虎が獲物を狙うように、天下を養う。問題ない。大きな視野で万民の利益（益）を考えるなら、その姿勢は養いの道に適っています。",
    五爻変: 24,
    五爻変との関係性:
      "その人のおかげで養われる。吉。大きな川を渡るのも良い。陰が極まり陽が復する（復）ように、人の助けで道が開けます。",
    上爻変: 23,
    上爻変との関係性:
      "その人のおかげで養われる。危ういが吉。大きな川を渡るのも良い。ただし、その養いは、山が剥げ落ちる（剥）ような危うさを伴います。",
    "アーキタイプ（原型）": "健康管理, 情報リテラシー, 教育",
    現代解釈の要約:
      "何を「口にするか」（食事、情報、言葉）の質と節度が、その人の運命を左右する。",
    出た時の気持ち:
      "自己管理への意識。しかし、情報過多による混乱や、自制心が続かないことへの自己嫌悪",
    どうすればいい:
      "質と節度を保つ。自分にとって本当に必要なもの（食事、情報、言葉）を見極める",
    相談すべき人: "専門家（医師、栄養士など）、信頼できる情報源、メンター",
  },
  {
    卦番号: 28,
    卦名: "澤風大過",
    綜卦: 27,
    錯卦: 22,
    "綜卦との関係性（裏の視点）":
      "山雷頤（養う）と対。「異常事態」に陥っている時は、まず自らを正しく「養い」、立て直す必要がある。",
    "錯卦との関係性（対極の世界）":
      "山火賁（飾り）と対。組織の構造が崩壊寸前の「危機」の対極は、表面を美しく「飾る」余裕のある状態。",
    互卦: 1,
    互卦との関係性:
      "内側は全てが陽の乾為天です。大きなものが過ぎる（大過）のは、内に秘めたエネルギー（乾）が強大すぎるためです。",
    初爻変: 27,
    初爻変との関係性:
      "祭壇の敷物に、白い茅を用いる。問題ない。度が過ぎた状況では、物を養う（頤）ように、丁寧すぎるほどの慎重さが必要です。",
    二爻変: 28,
    二爻変との関係性:
      "枯れ木に若芽が出る。老夫が若い妻を得る。問題ない。度が過ぎた（大過）状況でも、意外な組み合わせから新しい可能性が生まれます。",
    三爻変: 48,
    三爻変との関係性:
      "棟木が下にたわむ。凶。ただし、他に助けがあれば問題ない。組織の要が重圧に耐えきれないが、井戸（井）から水を汲むように、助けがあれば持ちこたえます。",
    四爻変: 32,
    四爻変との関係性:
      "棟木が上に盛り上がる。吉。他に助けがあれば、恥をかく。度が過ぎた状況でも、柱がしっかりしていれば（恒）、持ち直すことができます。",
    五爻変: 47,
    五爻変との関係性:
      "枯れ柳に花が咲く。老女が若い夫を得る。問題も名誉もない。あり得ないような状況でも、困窮（困）の中にかすかな希望があります。",
    上爻変: 43,
    上爻変との関係性:
      "水の中を渡ろうとして、額まで水に浸かる。凶。問題はある。無謀な行動は、決壊（夬）を招き、破滅に至ります。",
    "アーキタイプ（原型）": "経営危機, 構造的欠陥, 極限状態",
    現代解釈の要約:
      "棟木がたわむような、常軌を逸した危機的状況。抜本的な対応が求められる。",
    出た時の気持ち:
      "危機感、プレッシャー、恐怖。しかし、これを乗り越えなければという強い覚悟も生まれる",
    どうすればいい:
      "常識にとらわれず、抜本的な対策と、覚悟ある決断を下す。時には非常の手段も厭わない",
    相談すべき人:
      "危機管理の専門家、信頼できる右腕、同じ危機を乗り越えた経営者",
  },
  {
    卦番号: 29,
    卦名: "坎為水",
    綜卦: 29,
    錯卦: 30,
    "綜卦との関係性（裏の視点）":
      "視点を変えても同じ。危険や困難は、どこから見ても変わらない。",
    "錯卦との関係性（対極の世界）":
      "離為火（光明）と対。暗く危険な「困難」の対極は、明るく物事が明らかな「光明」。",
    互卦: 27,
    互卦との関係性:
      "内側には物を養う（山雷頤）象があります。困難（坎）の只中においても、生きるための営みや養いは続けられています。",
    初爻変: 29,
    初爻変との関係性:
      "穴の中に、さらに穴がある。危険な穴に落ち込む。凶。困難（坎）が重なり、抜け出すことが非常に難しい状態です。",
    二爻変: 30,
    二爻変との関係性:
      "穴の中に危険がある。求めるものは少ししか得られない。困難（坎）の中で、わずかな光明（離）を求めるのが精一杯です。",
    三爻変: 60,
    三爻変との関係性:
      "壁を作ったり取り壊したりする。臣下を縛る縄。三年間は何も得られない。困難から脱しようともがいても、節度（節）を失えば、かえって不自由に陥ります。",
    四爻変: 8,
    四爻変との関係性:
      "杯に入れた酒と、食べ物を盛った器一つ。質素な供え物で十分。困難な時は、人々と親しむ（比）のに、真心があれば贅沢は不要です。",
    五爻変: 48,
    五爻変との関係性:
      "穴はまだ満ちていない。丘のような状態。問題ない。困難な状況はまだ頂点に達しておらず、井戸（井）のように、まだ汲み上げる余地があります。",
    上爻変: 47,
    上爻変との関係性:
      "黒と赤の縄で縛られ、茨の中に置かれる。三年間は何も得られない。困難の極みであり、沢の水が涸れる（困）ように、完全に手詰まりの状態です。",
    "アーキタイプ（原型）": "深刻な危機, 困難, 試練, 忍耐",
    現代解釈の要約:
      "危険が幾重にも重なる、非常に厳しい状況。知恵と信頼、忍耐が試される。",
    出た時の気持ち:
      "絶望感、疲弊、孤独。しかし、その中で生き抜こうとする意志や、希望を求める気持ち",
    どうすればいい:
      "焦らず、知恵を働かせる。信頼できる助けを求め、内なる誠実さを失わない",
    相談すべき人: "信頼できる友人、専門家、同じ苦境にいる仲間",
  },
  {
    卦番号: 30,
    卦名: "離為火",
    綜卦: 30,
    錯卦: 29,
    "綜卦との関係性（裏の視点）":
      "視点を変えても同じ。知性や文明の「輝き」は、普遍的な価値を持つ。",
    "錯卦との関係性（対極の世界）":
      "坎為水（困難）と対。物事が明らかな「光明」の対極は、先が見えない「困難」な状況。",
    互卦: 28,
    互卦との関係性:
      "内側には大きなものが過ぎる（沢風大過）象があります。燃え盛る火（離）の激しさは、常軌を逸したエネルギーを内包していることを示します。",
    初爻変: 30,
    初爻変との関係性:
      "足跡が乱れている。慎めば問題ない。火（離）のように物事が明らかになる時、行動が乱れがちですが、自重すれば大丈夫です。",
    二爻変: 29,
    二爻変との関係性:
      "黄色い火。大吉。中庸の徳を守ることで、燃え盛る知性が最も輝き、困難（坎）を照らし出します。",
    三爻変: 22,
    三爻変との関係性:
      "日が傾く時の火。ため息をつかなければ、老人の歌。そうでなければ凶。燃え盛る勢いにも翳りが見え始め、終末をどう飾る（賁）かが問われます。",
    四爻変: 13,
    四爻変との関係性:
      "突然やってきて、燃え上がり、死に、捨てられる。悲嘆の声。激しく燃え上がったものは、人々と協調（同人）することなく、孤立して燃え尽きます。",
    五爻変: 55,
    五爻変との関係性:
      "王が出陣する。手柄を立て、首領を討ち取るが、従う者は問わない。吉。火の勢いが雷鳴を伴う豊（豊）かさとなり、大きな功績を上げます。",
    上爻変: 56,
    上爻変との関係性:
      "王が出陣する。嘉賞される。首領を討ち、従う者は捕虜としない。火が山を焼く旅（旅）のように、その威光は遠くまで及びます。",
    "アーキタイプ（原型）": "情報発信, 自己表現, ブランディング",
    現代解釈の要約:
      "物事が明るく輝き注目を集めるが、その輝きが何に依存しているか、本質を見抜く知恵が問われる。",
    出た時の気持ち:
      "高揚感、自己肯定感。しかし、その輝きが何に依存しているかを見失うことへの不安や、批判への恐れ",
    どうすればいい:
      "表面的な輝きに惑わされない。冷静な知性と洞察力を保ち、本質を見失わない",
    相談すべき人: "優れた批評家、ブランディングの専門家、信頼できる友人",
  },
  {
    卦番号: 31,
    卦名: "沢山咸",
    綜卦: 32,
    錯卦: 32,
    "綜卦との関係性（裏の視点）":
      "雷風恒（持続）と対。若々しい男女の自然な「感応」の裏には、その関係を「持続」させるという課題がある。",
    "錯卦との関係性（対極の世界）":
      "雷風恒（持続）と対。一瞬の「感応」の対極は、永く「持続」する関係性。始まりと継続の対。",
    互卦: 44,
    互卦との関係性:
      "内側には予期せぬ出会い（天風姤）の象があります。男女の感応（咸）は、しばしば偶然の出会いから始まります。",
    初爻変: 32,
    初爻変との関係性:
      "足の親指が感応する。まだ影響は小さく、長くは続かない（恒）。",
    二爻変: 41,
    二爻変との関係性:
      "ふくらはぎが感応する。凶。家にいれば吉。足が勝手に動き出すのは、身を損なう（損）元です。",
    三爻変: 39,
    三爻変との関係性:
      "太ももが感応する。進めば恥をかく。人に従って動く時であり、自分から動けば困難（蹇）に陥ります。",
    四爻変: 62,
    四爻変との関係性:
      "正しくあれば吉。後悔は消える。心が定まらず動揺するが、私欲なく感応すれば、少しやりすぎる（小過）くらいでも問題ありません。",
    五爻変: 33,
    五爻変との関係性:
      "うなじが感応する。後悔はない。口先だけの感応であり、心は世間から逃れて（遯）います。",
    上爻変: 49,
    上爻変との関係性:
      "あご、頬、舌が感応する。口先だけで人を動かそうとする。その言葉は旧弊を改める革命（革）の力にはなりません。",
    "アーキタイプ（原型）": "共感, 影響力, コミュニケーション",
    現代解釈の要約: "強制ではなく、自然な引き合いや共感によって心が通じ合う。",
    出た時の気持ち:
      "ときめき、期待感。しかし、相手に受け入れられるかという不安や、関係が長続きするかという恐れ",
    どうすればいい:
      "表面的な言葉でなく、深い共感と誠実さで接する。無心で感じ合い、相手を受け入れる",
    相談すべき人: "感受性の豊かな人、良き聞き手",
  },
  {
    卦番号: 32,
    卦名: "雷風恒",
    綜卦: 31,
    錯卦: 31,
    "綜卦との関係性（裏の視点）":
      "沢山咸（感応）と対。夫婦のように「持続」する関係性の裏には、出会った頃の新鮮な「感応」がある。",
    "錯卦との関係性（対極の世界）":
      "沢山咸（感応）と対。永く「持続」する関係性の対極は、出会ったばかりの新鮮な「感応」。",
    互卦: 43,
    互卦との関係性:
      "内側には決断（沢天夬）の象があります。物事を恒久に続けるためには、時に不要なものを切り捨てる強い決断力が必要です。",
    初爻変: 31,
    初爻変との関係性:
      "深く恒久を求める。正しくても凶。問題がある。初めから完璧な恒久を求めすぎると、感応（咸）すら得られません。",
    二爻変: 42,
    二爻変との関係性:
      "後悔は消える。恒久の徳は、自分に利益（益）をもたらすだけでなく、人にも分け与えることで完成します。",
    三爻変: 46,
    三爻変との関係性:
      "その徳を恒常的に保てない。恥を受ける。気分次第で態度を変えれば、昇進（升）はおろか、信用を失います。",
    四爻変: 28,
    四爻変との関係性:
      "田に獲物がいない。恒久の道においては、自分の役割（風）と相手の役割（雷）を混同すると、度が過ぎた（大過）失敗を招きます。",
    五爻変: 50,
    五爻変との関係性:
      "恒久の徳を激しく求める。凶。女性には良いが、男性には良くない。激しい感情は、安定した器（鼎）をひっくり返してしまいます。",
    上爻変: 34,
    上爻変との関係性:
      "恒久の徳を激しく動かす。凶。恒常であるべきものを揺り動かせば、たとえ大きな力（大壮）があっても、破綻を招きます。",
    "アーキタイプ（原型）": "持続可能性, ブランド, 安定した関係",
    現代解釈の要約:
      "変化の中で、変わらない原則を守り、物事を安定的に持続させることの重要性。",
    出た時の気持ち:
      "安定感、安心感。しかし、変化への対応が遅れることへの恐れや、マンネリ感",
    どうすればいい:
      "変化に適応しつつ、核となる原則を守る。習慣を見直し、改善を続ける",
    相談すべき人: "長期的な視点を持つパートナー、保守管理の専門家",
  },
  {
    卦番号: 33,
    卦名: "天山遯",
    綜卦: 34,
    錯卦: 53,
    "綜卦との関係性（裏の視点）":
      "雷天大壮（力強い前進）と対。「退く」ことの裏側には、常に「前進」する力が存在している。",
    "錯卦との関係性（対極の世界）":
      "風山漸（着実な前進）と対。世俗から賢明に「退く」ことの対極は、社会の中で着実に段階を上ること。",
    互卦: 44,
    互卦との関係性:
      "内側には一つの陰が五つの陽と出会う（天風姤）象が隠されています。賢者が世間から逃れる（遯）のは、陰の力（小人）が勢いを増してきたのを、出会い頭に察知したからです。",
    初爻変: 34,
    初爻変との関係性:
      "逃げ遅れれば危険です。進んではいけません。退くべき時に進むのは、自分の力を過信（大壮）している者の過ちです。",
    二爻変: 19,
    二爻変との関係性:
      "黄色い牛の革で固く縛られるように、しがらみに縛られて動けません。しかし、その固い意志は、人々が仰ぎ見る（臨）ほどのものです。",
    三爻変: 53,
    三爻変との関係性:
      "しがらみに縛られて逃げるのは、病気になりそうで危険です。まずは足元を固め、徐々に（漸）退く準備をすべきです。",
    四爻変: 56,
    四爻変との関係性:
      "君子は潔く退くので吉ですが、小人は執着を捨てられないので凶。賢者は退くべき時を知り、旅（旅）に出るように身軽に去ります。",
    五爻変: 31,
    五爻変との関係性:
      "見事に退くので、正しくあれば吉。その美しい引き際は、人々の心を打ち、感応（咸）させ、賞賛を浴びます。",
    上爻変: 13,
    上爻変との関係性:
      "ゆったりと余裕をもって退くので、問題ありません。完全に世間から離れ、志を同じくする者（同人）と心穏やかに過ごす、理想的な隠遁です。",
    "アーキタイプ（原型）": "戦略的撤退, リスク回避, 自己防衛",
    現代解釈の要約:
      "不利な状況から賢明に身を引き、無理に抵抗せず、自らを守る知恵。",
    出た時の気持ち:
      "敗北感、悔しさ。しかし、これ以上の損失を避けるための、冷静な判断も生まれる",
    どうすればいい:
      "感情的にならず、無益な争いを避ける。客観的なデータに基づき、戦略的に身を引く",
    相談すべき人: "戦略コンサルタント、信頼できるアドバイザー",
  },
  {
    卦番号: 34,
    卦名: "雷天大壮",
    綜卦: 33,
    錯卦: 54,
    "綜卦との関係性（裏の視点）":
      "天山遯（撤退）と対。「力強い前進」の裏側には、常に「賢明な撤退」という選択肢がある。",
    "錯卦との関係性（対極の世界）":
      "雷沢帰妹（不自然な結合）と対。正々堂々とした「力強い前進」の対極は、秩序の乱れた不健全な状態。",
    互卦: 43,
    互卦との関係性:
      "内側には一つの陰を五つの陽が決断する（沢天夬）象が隠されています。盛大な力（大壮）は、時に不要なものを切り捨てる強い決断力に基づいています。",
    初爻変: 33,
    初爻変との関係性:
      "つま先で進もうとする。進めば凶。確信がある。勢いだけの前進は、退く（遯）べき事態を招きます。",
    二爻変: 20,
    二爻変との関係性:
      "正しくあれば吉。盛大な力の内にあっても、驕らず状況をよく観察する（観）ことで、安泰を得られます。",
    三爻変: 11,
    三爻変との関係性:
      "小人は力を使い、君子は網を使う。勢いに任せて進めば、羊が垣根に角を刺して動けなくなる。力を賢く使えば泰平（泰）の道が開けます。",
    四爻変: 43,
    四爻変との関係性:
      "羊が垣根に角を刺して動けなくなり、後悔は消える。力の過信が招いた失敗から学び、決断（夬）を新たにします。",
    五爻変: 16,
    五爻変との関係性:
      "羊をたやすく失う。後悔はない。盛大な力に驕り、備え（豫）を怠ったために、たやすく足元をすくわれます。",
    上爻変: 14,
    上爻変との関係性:
      "羊が垣根に角を刺して動けなくなり、退くも進むもできない。艱難辛苦すれば吉。力の暴走は、大きな所有（大有）すら失いかねない状況を招きます。",
    "アーキタイプ（原型）": "積極的な行動, 成長戦略, リーダーシップ",
    現代解釈の要約:
      "陽のエネルギーが満ち溢れ、力強く前進する。ただし、暴走への警告も含む。",
    出た時の気持ち:
      "高揚感、万能感。しかし、勢い余って暴走することへの恐れや、周囲への配慮が欠けること",
    どうすればいい:
      "驕らず、公正さを保つ。力強い行動と、それを律する知恵を両立させる",
    相談すべき人: "自分を客観的に見てくれる参謀、倫理観の強い人",
  },
  {
    卦番号: 35,
    卦名: "火地晋",
    綜卦: 36,
    錯卦: 56,
    "綜卦との関係性（裏の視点）":
      "地火明夷（光明が傷つく）と対。太陽が昇るような「進展」の裏には、それが沈む「衰退」の時がある。",
    "錯卦との関係性（対極の世界）":
      "火山旅（旅）と対。安定した基盤の上での「進展」の対極は、安住の地がない「旅」の不安定さ。",
    互卦: 39,
    互卦との関係性:
      "内側には水と山の困難（水山蹇）が隠されています。日の出のように物事が進展する（晋）時も、内にはまだ解決すべき困難が残っています。",
    初爻変: 36,
    初爻変との関係性:
      "進もうとしても、押し戻される。正しくあれば吉。福を受けられないが、心配はない。進展の初めは、明知が地に隠れる（明夷）ように、妨害に遭います。",
    二爻変: 5,
    二爻変との関係性:
      "進もうとしても、押し戻される。正しくあれば吉。大きな福を母から受ける。進展を焦らず、時を待つ（需）ことで、大きな恵みを得られます。",
    三爻変: 23,
    三爻変との関係性:
      "人々が信頼を寄せる。後悔は消える。その進徳は、山が剥げ落ちる（剥）ような状況をも好転させる信頼を集めます。",
    四爻変: 12,
    四爻変との関係性:
      "ネズミのように進む。正しくても危うい。閉塞（否）した状況を打破しようとする焦りは、危険を招きます。",
    五爻変: 16,
    五爻変との関係性:
      "進むも退くも、患うことはない。失うことを心配するな。王母から福を授かる。喜び（豫）をもって進めば、天佑を得られます。",
    上爻変: 21,
    上爻変との関係性:
      "角を使って進む。自分の町を正す場合にのみ良い。危ういが吉。問題ない。強引な進展は、障害を噛み砕く（噬嗑）ように、内部の改革にのみ有効です。",
    "アーキタイプ（原型）": "昇進, 成長, 才能開花",
    現代解釈の要約:
      "大地から太陽が昇るように、物事が順調に進み、発展していく幸運期。",
    出た時の気持ち:
      "達成感、喜び、自信。しかし、慢心や、次のステージへのプレッシャーも感じる",
    どうすればいい:
      "周囲への感謝を忘れず、謙虚さを保つ。現状に満足せず、努力を継続する",
    相談すべき人: "メンター、コーチ、次の目標を示してくれる人",
  },
  {
    卦番号: 36,
    卦名: "地火明夷",
    綜卦: 35,
    錯卦: 55,
    "綜卦との関係性（裏の視点）":
      "火地晋（進展）と対。「光明が傷つく」暗黒時代の裏には、再び太陽が昇る「進展」の希望がある。",
    "錯卦との関係性（対極の世界）":
      "雷火豊（繁栄の極み）と対。「光明が隠される」困難な状況の対極は、全てが輝く「繁栄の極み」。",
    互卦: 40,
    互卦との関係性:
      "内側には困難が雪解けのように解消される（雷水解）象があります。明知が傷つけられる（明夷）苦難は、次なる問題解決への序章です。",
    初爻変: 35,
    初爻変との関係性:
      "明知が傷つけられ、左の翼を垂れて飛ぶ。君子は三日間食事をしない。困難の始まりは、進む（晋）べき道を一時的に見失わせます。",
    二爻変: 6,
    二爻変との関係性:
      "明知が傷つけられ、左の太ももを負傷する。壮健な馬で救われる。吉。危機的状況でも、争訟（訟）に強い助けを得て、難を逃れます。",
    三爻変: 55,
    三爻変との関係性:
      "南へ狩りに行き、その首領を得る。急いで正すことはできない。暗黒の時代でも、豊（豊）かな成果を上げることはできますが、根本的な解決は困難です。",
    四爻変: 63,
    四爻変との関係性:
      "箕子の場合。正道を守り通すことはできない。明知を隠し、一度は完成された（既済）秩序に従うふりをして、難を逃れました。",
    五爻変: 22,
    五爻変との関係性:
      "光明が完全に地中に入り込む。初めは天に昇り、後には地に入る。見事に傷つき、その姿を飾る（賁）ことで、後世に名を残します。",
    上爻変: 15,
    上爻変との関係性:
      "光明が完全に地中に入り込む。家の奥まで照らしたが、国や家を失う。その徳は謙虚（謙）に過ぎ、世を救うことはできませんでした。",
    "アーキタイプ（原型）": "不遇な時期, 忍耐, 自己防衛",
    現代解釈の要約:
      "正義が迫害され、光明が隠される暗黒時代。知恵をもって身を守り、耐え忍ぶ。",
    出た時の気持ち:
      "悔しさ、無力感、怒り。しかし、その中で希望を失わず、耐え忍ぶ強い意志",
    どうすればいい:
      "無理に抵抗せず、知恵をもって身を守る。内なる光を保ち、時が来るのを待つ",
    相談すべき人: "同じ苦しみを分かち合える仲間、歴史や古典",
  },
  {
    卦番号: 37,
    卦名: "風火家人",
    綜卦: 38,
    錯卦: 48,
    "綜卦との関係性（裏の視点）":
      "火沢睽（対立）と対。「内なる和合」の裏側には、常に「外部との対立」の可能性が潜んでいる。",
    "錯卦との関係性（対極の世界）":
      "水風井（公共の井戸）と対。閉じた「家庭」という組織の対極は、誰でも利用できる「公共」の場。",
    互卦: 64,
    互卦との関係性:
      "内側には物事が未完成（火水未済）である象が隠されています。家庭の秩序（家人）が保たれていても、社会的にはまだ課題が山積しています。",
    初爻変: 38,
    初爻変との関係性:
      "家の中に堅固な決まりを作る。後悔は消える。家庭内の不和（睽）を防ぐには、まずルールを定めることが重要です。",
    二爻変: 40,
    二爻変との関係性:
      "主婦としての仕事に専念する。正しくあれば吉。家事を疎かにすれば、家庭内の問題は解決（解）しません。",
    三爻変: 13,
    三爻変との関係性:
      "家族に対して厳しくしすぎると、後悔が残るが吉。女性や子供がふざけすぎても、最終的には良い。厳しさと寛容さのバランスが、人々を協調（同人）させます。",
    四爻変: 22,
    四爻変との関係性:
      "王が家に来る。心配ない。吉。一家の主の徳が高ければ、その家は自然と飾られ（賁）、高貴な客を迎えることになります。",
    五爻変: 63,
    五爻変との関係性:
      "誠実さと威厳があれば、究極的には吉。その徳は、完成された（既済）秩序のように、家庭を安定させます。",
    上爻変: 53,
    上爻変との関係性:
      "誠実さと威厳があれば、究極的には吉。その徳は、木が山で育つように、徐々に（漸）家庭を繁栄させます。",
    "アーキタイプ（原型）": "家族, 組織, 内部統制, チームワーク",
    現代解釈の要約:
      "家庭や組織の内なる秩序を確立し、和合を保つことが、全体の安定の基盤となる。",
    出た時の気持ち:
      "安心感、安定感。しかし、ルールが厳しすぎることへの息苦しさや、役割への不満も",
    どうすればいい:
      "明確な役割分担と、信頼に基づく温かいコミュニケーション。厳しさと寛容さのバランス",
    相談すべき人: "人事の専門家、経験豊富なリーダー",
  },
  {
    卦番号: 38,
    卦名: "火沢睽",
    綜卦: 37,
    錯卦: 47,
    "綜卦との関係性（裏の視点）":
      "風火家人（内なる和合）と対。「対立」している時は、まず「内なる秩序」を回復することが求められる。",
    "錯卦との関係性（対極の世界）":
      "沢水困（困窮）と対。互いに反発し合う「対立」の対極は、身動きが取れないほどの「困窮」。",
    互卦: 63,
    互卦との関係性:
      "内側には火と水が調和し、完成された（水火既済）象があります。反目し合う（睽）外面とは裏腹に、内には和解へのポテンシャルが秘められています。",
    初爻変: 37,
    初爻変との関係性:
      "後悔は消える。馬を失っても追いかけるな。自ずと帰ってくる。悪人を見ても近づくな。不和の始まりは、家庭（家人）のように静観すべきです。",
    二爻変: 39,
    二爻変との関係性:
      "主君と路地で出会う。問題ない。反目し合う中でも、偶然の出会いが困難（蹇）を乗り越えるきっかけになります。",
    三爻変: 41,
    三爻変との関係性:
      "車は引かれ、牛は留まる。額に焼き印を入れられ、鼻をそがれる。始めと終わりが良くない。不和が極まると、互いに足を引っ張り合い、身を損ない（損）ます。",
    四爻変: 10,
    四爻変との関係性:
      "後悔は消える。仲間が皮を噛みちぎるように協力してくれる。進めば問題ない。不和の中でも、信頼できる協力者がいれば、危険な道（履）も進めます。",
    五爻変: 54,
    五爻変との関係性:
      "後悔は消える。主君が矢を射る。路地で出会うが、問題ない。不和な相手（帰妹）とも、誠意をもって向き合えば和解できます。",
    上爻変: 64,
    上爻変との関係性:
      "豚が泥を背負い、多くの悪霊を車に乗せている。最初は弓を引くが、やがて弓を置く。敵意は、やがて未完成（未済）なりの和解に至ります。",
    "アーキタイプ（原型）": "対立, 不和, コミュニケーションの困難",
    現代解釈の要約:
      "火は上へ、沢は下へ。心が通じ合わず、対立する。しかし、その先に和解の道を探る。",
    出た時の気持ち:
      "怒り、不信感、孤独。しかし、その中でも和解の道を探そうとする理性",
    どうすればいい:
      "感情的にならず、冷静に状況を判断する。共通の目的や、妥協点を探る対話を試みる",
    相談すべき人: "調停者、カウンセラー、利害関係のない第三者",
  },
  {
    卦番号: 39,
    卦名: "水山蹇",
    綜卦: 40,
    錯卦: 49,
    "綜卦との関係性（裏の視点）":
      "雷水解（解決）と対。「足踏み」する困難な状況の裏には、必ずそれが「解決」する時が待っている。",
    "錯卦との関係性（対極の世界）":
      "沢火革（革命）と対。外部からの障害によって「進めない」状況の対極は、内部から古いものを破壊して進む「革命」。",
    互卦: 64,
    互卦との関係性:
      "内側には物事が未完成（火水未済）である象が隠されています。目の前の困難（蹇）は、まだ成し遂げられていない大きな目的の一部です。",
    初爻変: 40,
    初爻変との関係性:
      "進めば困難、来れば称賛される。困難な状況から退き、問題を解決（解）する時です。",
    二爻変: 38,
    二爻変との関係性:
      "王の臣下が、困難に次ぐ困難に陥る。それは自分のせいではない。不和（睽）な人間関係が、自分とは関係なく困難を招きます。",
    三爻変: 31,
    三爻変との関係性:
      "進めば困難、戻って仲間と感応（咸）する。無理に進まず、内輪の協力に頼るべきです。",
    四爻変: 15,
    四爻変との関係性:
      "進めば困難、来れば仲間と助け合う。謙虚（謙）な姿勢で助けを求めれば、道は開けます。",
    五爻変: 53,
    五爻変との関係性:
      "大きな困難。友人が来る。困難の極みに、助けが徐々に（漸）現れます。",
    上爻変: 63,
    上爻変との関係性:
      "進めば困難、来れば大きな功績。吉。大人に会うのが良い。困難を乗り越えれば、物事は完成（既済）し、大きな評価を得ます。",
    "アーキタイプ（原型）": "行き詰まり, 障害, 進退両難",
    現代解釈の要約:
      "進むも退くも困難な、進退両難の状況。無理に進まず、助けを求める知恵が問われる。",
    出た時の気持ち: "絶望感、焦り、無力感。どうにもならないという諦め",
    どうすればいい:
      "焦って無理に進まない。信頼できる助けを求め、内省し、状況が変化するのを待つ",
    相談すべき人: "経験豊富なメンター、信頼できる友人、専門家",
  },
  {
    卦番号: 40,
    卦名: "雷水解",
    綜卦: 39,
    錯卦: 50,
    "綜卦との関係性（裏の視点）":
      "水山蹇（足踏み）と対。困難が「解決」する前には、必ず「足踏み」する苦しい時期がある。",
    "錯卦との関係性（対極の世界）":
      "火風鼎（安定・形成）と対。困難を「解決」し、解放されることの対極は、全てが「安定」し、確立された状態。",
    互卦: 63,
    互卦との関係性:
      "内側には物事が完成（水火既済）した象が隠されています。困難が解ける（解）時というのは、すでに問題解決の道筋が内的に整っている状態です。",
    初爻変: 39,
    初爻変との関係性:
      "問題ない。困難（蹇）な状況から解放され、平穏を取り戻します。",
    二爻変: 37,
    二爻変との関係性:
      "田で三匹の狐を捕まえ、黄色の矢を得る。正しくあれば吉。困難が解け、家庭（家人）に害をなす悪を取り除き、富貴を得ます。",
    三爻変: 7,
    三爻変との関係性:
      "荷物を背負いながら、立派な車に乗る。盗賊を招く。分不相応な振る舞いは、軍隊（師）を動かすような争いの元になります。",
    四爻変: 47,
    四爻変との関係性:
      "自分の親指を解き放つように、仲間から信頼される。しがらみから解放され、困窮（困）した仲間を救うことができます。",
    五爻変: 16,
    五爻変との関係性:
      "身分の高い人が、城壁の上の鷹を射止める。全て良い。困難が解け、権力者は喜び（豫）をもって障害を取り除きます。",
    上爻変: 54,
    上爻変との関係性:
      "公が、城壁の上の鷹を射止める。全て良い。困難が解け、その功績は、不正規な関係（帰妹）をも正当化するほどのものです。",
    "アーキタイプ（原型）": "問題解決, 解放, 和解",
    現代解釈の要約:
      "冬の氷が解けるように、困難や障害が解消され、物事が好転し、自由と安堵が訪れる。",
    出た時の気持ち: "安堵感、解放感、喜び。新たな始まりへの希望",
    どうすればいい:
      "迅速かつ賢明に行動する。過去を許し、再発防止策を講じ、未来へ目を向ける",
    相談すべき人: "弁護士、コンサルタント、ファシリテーター",
  },
  {
    卦番号: 41,
    卦名: "山沢損",
    綜卦: 42,
    錯卦: 26,
    "綜卦との関係性（裏の視点）":
      "風雷益（増益）と対。「損なう」ことの裏には、それによって誰かが「益する」という関係がある。",
    "錯卦との関係性（対極の世界）":
      "山天大畜（大いに蓄える）と対。戦略的に「減らす」ことの対極は、意図的に「蓄える」こと。",
    互卦: 24,
    互卦との関係性:
      "内側には一陽来復のエネルギー（地雷復）が隠されています。何かを損ない、減らすことは、新しいものを生み出すための前向きな準備であることを示唆します。",
    初爻変: 42,
    初爻変との関係性:
      "自分の用事を終えたらすぐに行く。問題ないが、どれだけ損なうべきか考えること。自分の身を損なうことは、やがて社会の利益（益）となって返ってきます。",
    二爻変: 31,
    二爻変との関係性:
      "正しくあれば問題ありませんが、進めば凶。自分を損なわずに、相手に利益を与えることはできません。無理に進まず、相手の感応（咸）を待つべきです。",
    三爻変: 61,
    三爻変との関係性:
      "三人で行けば一人が減り、一人で行けば誠実な友を得る。集団から離れる（損なう）ことで、かえって本当の信頼関係（中孚）を築けることがあります。",
    四爻変: 60,
    四爻変との関係性:
      "自分の病（欠点）を減らせば、すぐに喜びがあります。問題ありません。自分の悪い部分を損なうことで、節度（節）ある健全な喜びが手に入ります。",
    五爻変: 19,
    五爻変との関係性:
      "ある人が、十朋の価値がある高価な亀でこれを増やす。断れないほどの大吉。大きな犠牲（損）が、人々の上に立つ（臨）ほどの大きな利益をもたらします。",
    上爻変: 4,
    上爻変との関係性:
      "自分を損なうことなく、相手に利益を与える。問題なく、正しければ吉。進むのが良い。人を養い、家臣を得る。究極の損は、蒙昧（蒙）な人々を啓発し社会に貢献することです。",
    "アーキタイプ（原型）": "コスト削減, 断捨離, 損して得取れ",
    現代解釈の要約:
      "「損して得取れ」。一時的な損失や削減が、長期的にはより大きな利益や健全化に繋がる。",
    出た時の気持ち:
      "喪失感、痛み。しかし、それによって本質が強化されることへの期待感",
    どうすればいい:
      "感情に流されず、目的を明確にして削減する。無駄を見極め、本質を強化する",
    相談すべき人: "経営コンサルタント、ファイナンシャルプランナー",
  },
  {
    卦番号: 42,
    卦名: "風雷益",
    綜卦: 41,
    錯卦: 25,
    "綜卦との関係性（裏の視点）":
      "山沢損（損なう）と対。他者を「益する」ためには、しばしば自分を「損なう」覚悟が必要となる。",
    "錯卦との関係性（対極の世界）":
      "天雷无妄（自然体）と対。意図的に他者を「益する」ことの対極は、無心で自然体な行動。",
    互卦: 23,
    互卦との関係性:
      "内側には物事が剥げ落ちる（山地剥）象が隠されています。利益（益）を追求するあまり、足元が崩れるような危険が潜んでいることを示唆します。",
    初爻変: 41,
    初爻変との関係性:
      "大きな事業を行うのに良い。大吉。問題ない。利益を得る時、その一部を社会のために損なう（損）覚悟があれば、大事業は成功します。",
    二爻変: 32,
    二爻変との関係性:
      "ある人が、十朋の価値がある高価な亀でこれを増やす。断れない。永遠に正しければ吉。王が上帝を祀れば吉。恒久（恒）的な利益は天意に適った行いから生まれます。",
    三爻変: 25,
    三爻変との関係性:
      "凶事に利益を用いる。問題ない。誠実であれば、中庸の道を行き、公に認められる。誠実な利益は、予期せぬ災難（无妄）さえも乗り越える力になります。",
    四爻変: 27,
    四爻変との関係性:
      "中庸の道を行き、公に認められれば、国を遷すことにも従う。利益を得るだけでなく、天下を養う（頤）という高い視点を持つべきです。",
    五爻変: 3,
    五爻変との関係性:
      "誠意と恵みの心があれば、問題ない。大吉。誠実であれば、我が徳となる。利益を独占せず、産みの苦しみ（屯）にある人々にも分け与えるべきです。",
    上爻変: 20,
    上爻変との関係性:
      "誰にも利益を与えない。ある人がこれを撃つ。心を恒に保たなければ凶。利益を独占すれば、人々から非難され、よく観察（観）された上で攻撃されます。",
    "アーキタイプ（原型）": "社会貢献(CSR), 人材育成, Win-Win",
    現代解釈の要約:
      "他者に利益を与え、全体として成長していく。与えることで、より多くを得る。",
    出た時の気持ち:
      "貢献する喜び、充実感。しかし、自己犠牲が過ぎることへの懸念や、偽善だと思われることへの恐れ",
    どうすればいい:
      "与えることで多くを得る、という視点を持つ。無私な貢献と、賢明な投資のバランス",
    相談すべき人: "NPO/NGO関係者、教育者、社会起業家",
  },
  {
    卦番号: 43,
    卦名: "沢天夬",
    綜卦: 44,
    錯卦: 15,
    "綜卦との関係性（裏の視点）":
      "天風姤（出会い）と対。悪しきものを「決断」して排除する裏側で、新たな出会いが生まれる。",
    "錯卦との関係性（対極の世界）":
      "地山謙（謙虚）と対。力強く障害を「打ち破る」ことの対極は、自らへりくだる「謙虚」さ。",
    互卦: 1,
    互卦との関係性:
      "内側は全てが陽の乾為天です。決断（夬）の力は、内に秘めた純粋で力強いエネルギー（乾）から生まれます。",
    初爻変: 44,
    初爻変との関係性:
      "つま先で進もうとする。勝てなければ恥をかく。準備不足での決断は、予期せぬ出会い（姤）に敗れるようなものです。",
    二爻変: 23,
    二爻変との関係性:
      "驚き、叫ぶ。夕暮れに軍隊が来るが、心配ない。決断を迫られ動揺しても、それは山が剥げ落ちる（剥）ほどの危機ではありません。",
    三爻変: 5,
    三爻変との関係性:
      "頬骨に力が入る。凶。君子が毅然と一人で行き、雨に遭う。濡れるが怒りはない。問題ない。意地を張った決断は、時を待つ（需）べき状況を悪化させます。",
    四爻変: 34,
    四爻変との関係性:
      "尻に肉がなく、歩きにくい。羊のように引かれていけば後悔は消える。聞いても信じない。決断力がなく、盛大な力（大壮）にただ流されていきます。",
    五爻変: 1,
    五爻変との関係性:
      "決断すべき小人がいない。進めば問題ない。悪が全て去った理想的な状態（乾）であり、決断の必要すらありません。",
    上爻変: 28,
    上爻変との関係性:
      "声もなく叫ぶ。究極的には凶。決断の時機を逸し、声なき叫びを上げるのは、大きな過ち（大過）です。",
    "アーキタイプ（原型）": "決断, 改革, 突破",
    現代解釈の要約:
      "最後の障害を打ち破る時。大胆な決断と、勇気ある行動が求められる。",
    出た時の気持ち:
      "高揚感、責任感。しかし、決断がもたらすリスクや、反対派からの抵抗への恐れ",
    どうすればいい:
      "独断を避け、情報を集め、公正さを保つ。覚悟をもって、勇気ある行動を取る",
    相談すべき人: "信頼できる参謀、法務アドバイザー",
  },
  {
    卦番号: 44,
    卦名: "天風姤",
    綜卦: 43,
    錯卦: 16,
    "綜卦との関係性（裏の視点）":
      "沢天夬（決断）と対。予期せぬ「出会い」は、それを受け入れるか、排除するかの「決断」を迫る。",
    "錯卦との関係性（対極の世界）":
      "雷地豫（準備された喜び）と対。予期せぬ「出会い」の対極は、準備された計画的な楽しみ。",
    互卦: 1,
    互卦との関係性:
      "内側は全てが陽の乾為天です。偶然の出会い（姤）は、純粋なエネルギー（乾）の世界に初めて生じた変化であり、その影響は計り知れません。",
    初爻変: 43,
    初爻変との関係性:
      "金の車止めに繋ぐ。正しくあれば吉。進めば凶事を見る。痩せた豚でも暴れる。出会った陰の力を、決断（夬）をもって制御すべきです。",
    二爻変: 24,
    二爻変との関係性:
      "厨房に魚がいない。問題ない。出会った陰の力はまだ小さく、一陽来復（復）のエネルギーを損なうほどではありません。",
    三爻変: 57,
    三爻変との関係性:
      "尻に肉がなく、歩きにくい。危ういが、大きな過ちではない。出会った陰の力に心が揺れ動き、迷い（巽）が生じています。",
    四爻変: 50,
    四爻変との関係性:
      "瓜を杞の葉で包む。徳が内に秘められていれば、天から福が降ってくる。出会った陰の力を、鼎で煮るように包容し、昇華させます。",
    五爻変: 28,
    五爻変との関係性:
      "角で出会う。恥ずかしいが、問題ない。高慢な態度で出会うと、度が過ぎた（大過）恥をかきます。",
    上爻変: 1,
    上爻変との関係性:
      "角で出会う。恥ずかしいが、究極的には問題ない。出会った陰の力を最後まで制し、純粋な世界（乾）を守り抜きます。",
    "アーキタイプ（原型）": "偶然の出会い, 影響力, 誘惑",
    現代解釈の要約:
      "偶然の出会いが、大きな影響をもたらし始める。チャンスとリスクが混在する。",
    出た時の気持ち:
      "好奇心、ときめき。しかし、その出会いがもたらすリスクや、本質を見失うことへの恐れ",
    どうすればいい:
      "表面に惑わされず、冷静に相手や状況を判断する。慎重に行動し、自分を見失わない",
    相談すべき人: "信頼できる友人、メンター",
  },
  {
    卦番号: 45,
    卦名: "沢地萃",
    綜卦: 46,
    錯卦: 28,
    "綜卦との関係性（裏の視点）":
      "地風升（上昇）と対。人々が「集まる」ことで、物事が「上昇」していくエネルギーが生まれる。",
    "錯卦との関係性（対極の世界）":
      "澤風大過（危機）と対。人々が喜んで「結束」している状態の対極は、組織が崩壊寸前の「危機」。",
    互卦: 53,
    互卦との関係性:
      "内側には物事が徐々に進展する（風山漸）象が隠されています。人々が集う（萃）のは、地道な努力が実を結び、徐々に評価されてきた結果です。",
    初爻変: 46,
    初爻変との関係性:
      "誠実だが最後まで貫けない。ある時は乱れ、ある時は集まる。握り拳を差し出せば、笑いに変わる。心配ない。進めば問題ない。集まっても混乱するが、誠意があれば昇進（升）します。",
    二爻変: 26,
    二爻変との関係性:
      "集まろうとしても、ため息をつく。問題ない。進めば恥はかかない。大きな力を蓄える（大畜）ためには、安易な集会に与しないことも必要です。",
    三爻変: 8,
    三爻変との関係性:
      "集まっても、ため息をつく。問題ない。進めば恥はかかない。心から親しめない（比）集まりであれば、無理に参加する必要はありません。",
    四爻変: 16,
    四爻変との関係性:
      "集まっても、誰もその地位を認めない。正しくあれば後悔は消える。喜び（豫）のない集まりでは、誰も中心人物を認めません。",
    五爻変: 12,
    五爻変との関係性:
      "ため息をつき、涙を流す。問題ない。集まった人々が、閉塞（否）した現状を共に嘆いています。",
    上爻変: 17,
    上爻変との関係性:
      "ため息をつき、鼻水をたらす。問題ない。指導者なき集まりで、ただ時の流れに従う（随）しかなく、嘆いている状態です。",
    "アーキタイプ（原型）": "イベント, コミュニティ, チームビルディング",
    現代解釈の要約:
      "人々や資源が一箇所に集まり、喜びをもって結束することで、大きな力を生み出す。",
    出た時の気持ち:
      "一体感、喜び、高揚感。しかし、リーダーシップの不在による混乱や、同調圧力への懸念",
    どうすればいい:
      "明確な目的と、信頼に基づくリーダーシップで、衆をまとめる。個々の意見も尊重する",
    相談すべき人: "イベントプランナー、コミュニティマネージャー",
  },
  {
    卦番号: 46,
    卦名: "地風升",
    綜卦: 45,
    錯卦: 27,
    "綜卦との関係性（裏の視点）":
      "沢地萃（集まる）と対。着実に「上昇」していくことで、その人や組織の周りに人が「集まる」。",
    "錯卦との関係性（対極の世界）":
      "山雷頤（養う）と対。外へ向かって「成長」することの対極は、内なる自分を「養う」こと。",
    互卦: 54,
    互卦との関係性:
      "内側には順序の正しくない関係（雷沢帰妹）が隠されています。昇進（升）の裏には、不正規な手段や人間関係が隠れている場合があります。",
    初爻変: 45,
    初爻変との関係性:
      "信頼を得て昇進する。大吉。人々が集い（萃）、その中心となることで、昇進の道が開けます。",
    二爻変: 25,
    二爻変との関係性:
      "誠実であれば、夏の祭祀を行うのも良い。吉。私心なく（无妄）務めることで、昇進の機会が与えられます。",
    三爻変: 32,
    三爻変との関係性:
      "王が岐山で祭祀を行う。吉。問題ない。恒常的（恒）な徳が認められ、昇進します。",
    四爻変: 48,
    四爻変との関係性:
      "正しくあれば吉。階段を昇る。井戸（井）から水を汲み上げるように、着実な努力が昇進に繋がります。",
    五爻変: 18,
    五爻変との関係性:
      "昇進し続ける。問題ない。休まずに昇る。腐敗（蠱）した状況を改革しながら、昇進し続けます。",
    上爻変: 11,
    上爻変との関係性:
      "暗闇の中で昇進する。休まないことが良い。夜道を昇るように、人が見ていない所での努力が、やがて泰平（泰）の世に繋がります。",
    "アーキタイプ（原型）": "成長, 昇進, 段階的進歩",
    現代解釈の要約:
      "大地から木が育つように、地道な努力を通じて、着実に高みを目指していく。",
    出た時の気持ち:
      "達成感、自己肯定感。しかし、次のステージへのプレッシャーや、現状維持への誘惑",
    どうすればいい:
      "焦らず、基礎を固め、地道な努力を積み重ねる。目標を明確にし、学習を続ける",
    相談すべき人: "メンター、コーチ、キャリアコンサルタント",
  },
  {
    卦番号: 47,
    卦名: "沢水困",
    綜卦: 48,
    錯卦: 38,
    "綜卦との関係性（裏の視点）":
      "水風井（井戸）と対。「困窮」して全てが枯渇している状況の裏には、潤いを与える「井戸」がある。",
    "錯卦との関係性（対極の世界）":
      "火沢睽（対立）と対。身動きが取れず、エネルギーが枯渇した「困窮」の対極は、エネルギーが過剰で、互いに反発し合う「対立」。",
    互卦: 37,
    互卦との関係性:
      "内側には家庭（風火家人）の象があります。困窮（困）した状況を支えているのは、家族のような身近な人々の絆です。",
    初爻変: 48,
    初爻変との関係性:
      "切り株に尻を乗せて困る。暗い谷間に入る。三年間は姿を見せない。困窮の始まりは、井戸（井）の底のように暗く、出口が見えません。",
    二爻変: 22,
    二爻変との関係性:
      "酒食に困る。赤い祭服の役人が来る。祭祀を行うのが良い。進めば凶。困窮しても、見せかけを飾る（賁）のではなく、祈りを捧げるべきです。",
    三爻変: 29,
    三爻変との関係性:
      "石に困り、茨に寄りかかる。家に入っても、妻の姿は見えない。凶。困難（坎）が重なり、安らぎの場所さえ失います。",
    四爻変: 40,
    四爻変との関係性:
      "ゆっくりと来る。金の車に乗るが、恥をかく。問題はない。困難は解決（解）に向かいますが、性急な行動は恥を招きます。",
    五爻変: 6,
    五爻変との関係性:
      "鼻切り、足切りの刑に遭う。赤い祭服の者に困しめられる。ゆっくりと喜びが来る。争訟（訟）に巻き込まれ、ひどい目に遭います。",
    上爻変: 58,
    上爻変との関係性:
      "蔓草に困しめられる。危ういと言うが、動けば後悔する。後悔があるなら、進むのが吉。困窮しても、喜悦（兌）の心で動けば、道は開けます。",
    "アーキタイプ（原型）": "逆境, 困難, 忍耐, 危機",
    現代解釈の要約:
      "内外ともに困難が重なり、八方塞がり。困難の中で、本質を守る知恵が試される。",
    出た時の気持ち:
      "苦痛、無力感、孤独。しかし、その中で本質を守り抜こうとする強い意志",
    どうすればいい:
      "焦らず、希望を捨てない。信頼できる助けを求め、内なる誠実さを保つ",
    相談すべき人: "同じ逆境を乗り越えた人、カウンセラー、信頼できる友人",
  },
  {
    卦番号: 48,
    卦名: "水風井",
    綜卦: 47,
    錯卦: 37,
    "綜卦との関係性（裏の視点）":
      "沢水困（困窮）と対。人々に安定した恩恵を与える「井戸」の裏には、それが枯渇する「困窮」の危機が常にある。",
    "錯卦との関係性（対極の世界）":
      "風火家人（家庭）と対。誰でも利用できる「公共の井戸」の対極は、閉じた「家庭」という組織。",
    互卦: 38,
    互卦との関係性:
      "内側には火と沢が反目し合う（火沢睽）象があります。井戸（井）のように変わらない恵みも、一皮むけば内部対立を抱えていることがあります。",
    初爻変: 47,
    初爻変との関係性:
      "井戸の泥を食べる。古い井戸には鳥も来ない。困窮（困）の極みであり、枯れた井戸からは何も得られません。",
    二爻変: 21,
    二爻変との関係性:
      "井戸の底をさらうが、壊れた瓶のように誰も使わない。障害を噛み砕こう（噬嗑）としても、その努力は誰にも評価されません。",
    三爻変: 28,
    三爻変との関係性:
      "井戸を整備しても、誰も使わない。人の心が痛む。惜しいことだ。王が聡明であれば、共に福を受けられる。度が過ぎた（大過）不信感が、井戸を使えなくしています。",
    四爻変: 46,
    四爻変との関係性:
      "井戸が整備され、冷たい泉が飲める。井戸のように徳を積めば、地位は昇進（升）します。",
    五爻変: 57,
    五爻変との関係性:
      "井戸の釣瓶が、縄も瓶も壊れていない。大吉。信頼できる。風（巽）のように、何度も繰り返し汲み上げられる、信頼できる井戸です。",
    上爻変: 5,
    上爻変との関係性:
      "井戸の口が覆われていない。誠実さがあれば、大吉。いつでも誰でも使える開かれた井戸は、人々が待ち望む（需）恵みです。",
    "アーキタイプ（原型）": "インフラ, 安定供給, 地域貢献",
    現代解釈の要約:
      "井戸のように、人々に安定した恩恵をもたらし、そのために不断の努力が求められる。",
    出た時の気持ち:
      "安定感、使命感。しかし、改善を怠ることへの危機感や、縁の下の力持ちであることへの不満",
    どうすればいい:
      "継続的な改善とメンテナンスを怠らない。広く分かち合う、公共の精神を持つ",
    相談すべき人: "インフラエンジニア、保守管理者、NPO職員",
  },
  {
    卦番号: 49,
    卦名: "沢火革",
    綜卦: 38,
    錯卦: 40,
    "綜卦との関係性（裏の視点）":
      "火沢睽（対立）と対。「革命」の前には、しばしば深刻な「対立」が存在する。",
    "錯卦との関係性（対極の世界）":
      "雷水解（解決）と対。古いものを破壊する「革命」の対極は、困難が自然に解けていく「解決」。",
    互卦: 44,
    互卦との関係性:
      "内側には予期せぬ出会い（天風姤）の象が隠されています。革命（革）の動きは、しばしば偶然の出来事や新たな勢力との出会いから始まります。",
    初爻変: 50,
    初爻変との関係性:
      "黄色い牛の革で固く縛るように、軽率な行動はできません。革命の初期は、鼎の足を固めるように、まず足元を慎重に固めるべきです。",
    二爻変: 4,
    二爻変との関係性:
      "機が熟したその日になってから、これを改革します。進めば吉。機を待って実行すれば、蒙昧（蒙）な状態を啓発できます。",
    三爻変: 63,
    三爻変との関係性:
      "進めば凶。正しくても危うい。改革の言葉が三度なされて、ようやく信じられます。焦らず、物事が整う（既済）のを待つように慎重に進めるべきです。",
    四爻変: 55,
    四爻変との関係性:
      "後悔は消え、人々が信じて従います。天命を改める時です。吉。その改革は、雷鳴と共に豊かな（豊）成果をもたらします。",
    五爻変: 13,
    五爻変との関係性:
      "大人が虎のように模様を鮮やかに変える。占うまでもなく、人々は信じます。リーダーの自己変革に、人々は協調（同人）して従います。",
    上爻変: 31,
    上爻変との関係性:
      "君子は豹のように模様を変え、小人は顔つきを変えるだけ。進めば凶。家にいれば吉。表面的な改革は失敗します。真の改革は人々の心を感応（咸）させなければなりません。",
    "アーキタイプ（原型）": "革命, 変革, 抜本的改革",
    現代解釈の要約:
      "古いものを根本から変え、新しいものを創り出す。タイミングと覚悟が重要。",
    出た時の気持ち:
      "使命感、高揚感。しかし、変化への抵抗や、破壊を伴うことへの痛みや恐れ",
    どうすればいい:
      "目的を明確にし、適切なタイミングを見計らう。人々の信頼を得て、覚悟をもって断行する",
    相談すべき人: "革命家、改革派リーダー、コンサルタント",
  },
  {
    卦番号: 50,
    卦名: "火風鼎",
    綜卦: 37,
    錯卦: 3,
    "綜卦との関係性（裏の視点）":
      "風火家人（家庭）と対。公的な器である「鼎」の裏には、私的な「家庭」の秩序がある。",
    "錯卦との関係性（対極の世界）":
      "水雷屯（産みの苦しみ）と対。全てが「安定」した状態の対極は、混沌とした「始まり」。",
    互卦: 43,
    互卦との関係性:
      "内側には不要なものを決断する（沢天夬）象が隠されています。安定した器である鼎も、時には古いものを捨て、中身を入れ替える決断が必要です。",
    初爻変: 49,
    初爻変との関係性:
      "鼎の足が逆さになる。悪いものを出すのに良い。まず旧弊を洗い出す（革）ことが、新しいものを煮るための第一歩です。",
    二爻変: 3,
    二爻変との関係性:
      "鼎に中身がある。我が敵に病があるが、私を討つことはできない。吉。鼎が安定していれば、産みの苦しみ（屯）のような外部の混乱に影響されません。",
    三爻変: 18,
    三爻変との関係性:
      "鼎の耳の形が変わる。その働きが滞る。美味しい雉の料理も食べられない。凶。鼎の重要な部分が壊れれば、腐敗（蠱）したものを正すこともできません。",
    四爻変: 44,
    四爻変との関係性:
      "鼎の足が折れる。公の料理をひっくり返し、体裁を損なう。凶。鼎の足が折れるのは、予期せぬ出会い（姤）による災難です。",
    五爻変: 32,
    五爻変との関係性:
      "鼎に、黄色い耳と金の環が付く。正しければ良い。鼎の価値は、恒久（恒）的に使える堅牢さと信頼性によって高まります。",
    上爻変: 14,
    上爻変との関係性:
      "鼎に、玉の環が付く。大吉。問題ない。鼎が最高の装飾を施されるように、その徳と機能は、大きな所有（大有）の象徴となります。",
    "アーキタイプ（原型）": "組織構築, 安定, 文化形成",
    現代解釈の要約:
      "組織や文化が、鼎のように安定した形を取り、その価値が確立される。",
    出た時の気持ち: "安定感、達成感。しかし、官僚主義や硬直化への懸念",
    どうすればいい:
      "各要素が連携し、本質を養い、社会に貢献する。明確な理念と、それを体現するシステムを作る",
    相談すべき人: "創業者、人事責任者、組織開発コンサルタント",
  },
  {
    卦番号: 51,
    卦名: "震為雷",
    綜卦: 51,
    錯卦: 57,
    "綜卦との関係性（裏の視点）":
      "視点を変えても同じ。「衝撃」は、どこから見ても変わらない衝撃である。",
    "錯卦との関係性（対極の世界）":
      "巽為風（柔軟な影響）と対。突発的で力強い「衝撃」の対極は、穏やかで浸透する「影響」。",
    互卦: 39,
    互卦との関係性:
      "内側には険しい困難（水山蹇）が隠されています。雷（震）のような衝撃的な出来事は、しばしば困難な状況から生まれます。",
    初爻変: 52,
    初爻変との関係性:
      "雷が轟く時、恐れおののくが、後には笑い声が上がる。吉。衝撃的な出来事も、山（艮）のように動じず受け止めれば、福に転じます。",
    二爻変: 57,
    二爻変との関係性:
      "雷が来て危うい。億万の富を失い、九つの丘に登る。追いかけるな。七日もすれば得られる。衝撃で富を失っても、風（巽）のようにしなやかに時を待てば、回復します。",
    三爻変: 24,
    三爻変との関係性:
      "雷が鳴り、呆然とする。雷に従って動けば、災いはない。衝撃的な状況でも、一陽来復（復）のエネルギーに従えば、道を踏み誤りません。",
    四爻変: 17,
    四爻変との関係性:
      "雷が鳴り、泥沼に落ち込む。進退窮まる。しかし、状況に従う（随）ことで、泥沼から抜け出すことができます。",
    五爻変: 21,
    五爻変との関係性:
      "雷が来て、危険がある。億万の富を失うことはないが、やるべきことがある。衝撃的な困難は、噛み砕くべき障害（噬嗑）です。",
    上爻変: 16,
    上爻変との関係性:
      "雷が鳴り、不安げに周りを見回す。進めば凶。雷のせいで心が乱れている。喜び（豫）に浮かれず、慎重になるべきです。",
    "アーキタイプ（原型）": "衝撃, 急変, 危機管理",
    現代解釈の要約:
      "予期せぬ衝撃的な出来事。その中で冷静さを保ち、迅速に行動することが問われる。",
    出た時の気持ち:
      "驚き、恐怖、混乱。しかし、これを乗り越えようとする覚醒や、 adrenaline rush",
    どうすればいい:
      "恐怖に囚われず、迅速かつ冷静に行動する。情報を正確に把握し、最優先事項を決定する",
    相談すべき人: "危機管理の専門家、経験豊富なリーダー",
  },
  {
    卦番号: 52,
    卦名: "艮為山",
    綜卦: 52,
    錯卦: 15,
    "綜卦との関係性（裏の視点）":
      "視点を変えても同じ。「静止」は、どこから見ても変わらない静止である。",
    "錯卦との関係性（対極の世界）":
      "地山謙（謙虚）と対。独り静かに「止まる」ことの対極は、社会の中で他者と関わる「謙虚」さ。",
    互卦: 40,
    互卦との関係性:
      "内側には困難が雪解けのように解消される（雷水解）象があります。山のように動かない（艮）のは、内なる問題がすでに解決されているからです。",
    初爻変: 51,
    初爻変との関係性:
      "足の指で止まる。問題ない。永遠に正しければ良い。動き（震）を最小限に留め、静止することが肝要です。",
    二爻変: 58,
    二爻変との関係性:
      "ふくらはぎで止まる。その者を救えない。その心は穏やかでない。止まるべき時に止まれず、喜び（兌）に引かれて動けば、人を救うことはできません。",
    三爻変: 22,
    三爻変との関係性:
      "腰で止まる。背骨が裂ける。危うい。心が燻る。体の中心で無理に止まると、内面を飾る（賁）余裕もなく、身を滅ぼします。",
    四爻変: 18,
    四爻変との関係性:
      "体で止まる。問題ない。全身の動きを止めることで、腐敗（蠱）した状況から距離を置きます。",
    五爻変: 23,
    五爻変との関係性:
      "あごで止まる。言葉に秩序がある。後悔は消える。口を慎み、言葉を止めることで、剥げ落ちる（剥）ような災いを防ぎます。",
    上爻変: 56,
    上爻変との関係性:
      "篤く止まる。吉。山の如き静止を極めれば、旅（旅）の終わりも安泰です。",
    "アーキタイプ（原型）": "静止, 休息, 自己抑制",
    現代解釈の要約:
      "無理に進まず、一旦立ち止まり、内省し、力を蓄えることの重要性。",
    出た時の気持ち:
      "静けさ、落ち着き。しかし、行動できないことへの焦りや、停滞していることへの不安",
    どうすればいい:
      "無為な停滞を避ける。目的を持った休息と内省を行い、次の行動へのエネルギーを蓄える",
    相談すべき人: "コーチ、カウンセラー、瞑想指導者",
  },
  {
    卦番号: 53,
    卦名: "風山漸",
    綜卦: 54,
    錯卦: 56,
    互卦: 64,
    初爻変: 54,
    二爻変: 54,
    三爻変: 33,
    四爻変: 52,
    五爻変: 39,
    上爻変: 37,
    "綜卦との関係性（裏の視点）":
      "雷沢帰妹（不自然な結合）と対。正しい順序で「着実に進む」ことの裏側は、順序を無視した混乱。",
    "錯卦との関係性（対極の世界）":
      "天山遯（撤退）と対。社会の中で段階的に「進む」ことの対極は、世俗から「退く」こと。",
    互卦との関係性:
      "内側には物事が未完成（火水未済）である象が隠されています。物事が徐々に進展する（漸）のは、まだ完成に至っていないからです。",
    初爻変との関係性:
      "水辺に徐々に進む。子供が危うい。言葉はあるが、問題ない。進展の初めは、順序を間違え（帰妹）、危うさを伴います。",
    二爻変との関係性:
      "岩の上に徐々に進む。飲食を楽しみ、和らぐ。吉。進展が安定し、順序が正しくない関係（帰妹）でも、宴を楽しむ余裕が生まれます。",
    三爻変との関係性:
      "陸地に徐々に進む。夫は征って帰らず、妻は妊娠するが育てられない。凶。盗賊を防ぐのに良い。進むべきでない時に進めば、世から逃れる（遯）べき事態を招きます。",
    四爻変との関係性:
      "木の上に徐々に進む。その止まるべき枝を得る。問題ない。進展の過程で、山（艮）のように安住できる場所を見つけます。",
    五爻変との関係性:
      "雲の中に徐々に進む。その羽は、儀式の舞の道具として用いられる。吉。進展の極みは、困難（蹇）を乗り越え、天にまで達します。",
    上爻変との関係性:
      "雲の中に徐々に進む。その羽は、儀式の舞の道具として用いられる。吉。その進徳は、家庭（家人）の誉れとなります。",
    "アーキタイプ（原型）": "着実な成長, 段階的進歩, 婚姻",
    現代解釈の要約:
      "焦らず、段階を踏んで、物事をゆっくりと、しかし確実に進めることの価値。",
    出た時の気持ち:
      "安定感、将来への期待。しかし、プロセスが遅いことへのもどかしさ",
    どうすればいい:
      "焦らず、段階を踏む。正しい順序とプロセスを尊重することが、確実な成功に繋がる",
    相談すべき人: "プロジェクトマネージャー、経験豊富な先輩",
  },
  {
    卦番号: 54,
    卦名: "雷沢帰妹",
    綜卦: 53,
    錯卦: 55,
    互卦: 63,
    初爻変: 53,
    二爻変: 53,
    三爻変: 19,
    四爻変: 58,
    五爻変: 38,
    上爻変: 40,
    "綜卦との関係性（裏の視点）":
      "風山漸（着実な前進）と対。「不自然な結合」の裏側には、本来あるべき「正しい順序」がある。",
    "錯卦との関係性（対極の世界）":
      "雷天大壮（大いなる力）と対。秩序が乱れた「不健全な状態」の対極は、正々堂々とした「力強い状態」。",
    互卦との関係性:
      "内側には物事が完成（水火既済）した象があります。順序の正しくない結婚（帰妹）も、一度成立すれば、完成された形として扱われます。",
    初爻変との関係性:
      "妹が嫁ぐが、側室としてである。足の不自由な人が歩ける。征けば吉。不正規な始まりでも、徐々に（漸）進めば道は開けます。",
    二爻変との関係性:
      "目の見えない人が見える。隠者のように固く正道を守るのに良い。不遇な状況でも、徐々に（漸）本質が見えるようになります。",
    三爻変との関係性:
      "妹が嫁ぐが、身分の低い召使いとしてである。一度は妾として嫁ぐ。不遇な立場でも、人々の上に臨む（臨）時が来るかもしれません。",
    四爻変との関係性:
      "嫁入りを遅らせる。遅れても、良い時期がある。喜び（兌）の時を待つことで、より良い縁を得られます。",
    五爻変との関係性:
      "帝乙が妹を嫁がせる。正室の袖の方が、側室の袖よりも立派である。月が満月になれば吉。不和（睽）な力関係も、時が満ちれば逆転します。",
    上爻変との関係性:
      "かごには実がなく、羊を刺しても血が出ない。問題ない。不正規な関係の結末は、困難が解ける（解）ように、虚しいものです。",
    "アーキタイプ（原型）": "不適切な関係, 時期尚早, 混乱",
    現代解釈の要約:
      "本来の順序から外れた、時期尚早な行動や、不適切な関係がもたらす混乱。",
    出た時の気持ち:
      "興奮、魅力。しかし、その関係が正しくないことへの罪悪感や、将来への不安",
    どうすればいい:
      "感情に流されず、倫理観を保つ。本質を見極め、長期的な視点で、正しい調和を目指す",
    相談すべき人: "信頼できる友人、メンター、カウンセラー",
  },
  {
    卦番号: 55,
    卦名: "雷火豊",
    綜卦: 56,
    錯卦: 54,
    互卦: 28,
    初爻変: 56,
    二爻変: 59,
    三爻変: 36,
    四爻変: 49,
    五爻変: 30,
    上爻変: 62,
    "綜卦との関係性（裏の視点）":
      "火山旅（旅）と対。「繁栄の極み」にある状態の裏側は、安住の地がない「旅人」の孤独。",
    "錯卦との関係性（対極の世界）":
      "地火明夷（光明の隠蔽）と対。全てが輝く「繁栄」の対極は、光が地に隠れる「暗黒時代」。",
    互卦との関係性:
      "内側には大きなものが過ぎる（沢風大過）象があります。盛大で豊か（豊）な状態は、一歩間違えば常軌を逸した（大過）事態に陥る危険をはらんでいます。",
    初爻変との関係性:
      "その配偶者に会う。十日間は問題ない。進めば、尊敬されることがある。豊かな時に、よきパートナー（旅の仲間）と出会います。",
    二爻変との関係性:
      "その日覆いが大きい。日中に北斗七星が見える。進めば、疑われ病気になる。誠実であれば通じる。豊かさに目がくらみ、物事の本質が散漫（渙）になります。",
    三爻変との関係性:
      "その旗指物が大きい。日中に暗い星が見える。右腕を折る。問題ない。豊かさの頂点で、明知が傷つけられる（明夷）ような災難に見舞われます。",
    四爻変との関係性:
      "その日覆いが来る。日中に北斗七星が見える。吉なる主君に会う。吉。暗雲が去り、旧弊を改める（革）賢明なリーダーに出会います。",
    五爻変との関係性:
      "美しい模様が来る。祝福と名誉がある。吉。その豊かさは、火（離）のように内面から輝き出る才知と文明に基づいています。",
    上爻変との関係性:
      "その家を豊かにし、家族を覆い、門を覗けば、ひっそりとして人がいない。三年間姿を見ない。凶。物質的な豊かさだけを求めると、少しやり過ぎて（小過）、孤立を招きます。",
    "アーキタイプ（原型）": "繁栄の頂点, 豊かさ, 慢心への警告",
    現代解釈の要約:
      "物事が最高潮に達した、豊かな状態。しかし、その光の裏にある陰りへの警告。",
    出た時の気持ち:
      "達成感、万能感、幸福。しかし、この状態が永遠ではないことへの恐れや、慢心への警戒",
    どうすればいい:
      "公正な分配を心がける。常に変化の兆しに警戒し、次のステージへの準備を怠らない",
    相談すべき人: "資産管理者、信頼できるアドバイザー",
  },
  {
    卦番号: 56,
    卦名: "火山旅",
    綜卦: 55,
    錯卦: 53,
    互卦: 27,
    初爻変: 55,
    二爻変: 60,
    三爻変: 30,
    四爻変: 50,
    五爻変: 35,
    上爻変: 52,
    "綜卦との関係性（裏の視点）":
      "雷火豊（繁栄）と対。安住の地がない「旅人」の状況の裏には、全てが満ち足りた「繁栄」がある。",
    "錯卦との関係性（対極の世界）":
      "火地晋（進展）と対。不安定な「旅」の対極は、安定した基盤の上での順調な「進展」。",
    互卦との関係性:
      "内側には大きなものが過ぎる（沢風大過）象があります。旅（旅）という不安定な状態は、常に常軌を逸した（大過）危険と隣り合わせです。",
    初爻変との関係性:
      "旅人がこせこせしている。これが災いを招く。旅の始まりに、些細なことにこだわると、豊かな（豊）はずの旅路が台無しになります。",
    二爻変との関係性:
      "旅人が宿屋に泊まる。懐に資金を抱き、若い召使いを得る。正道を守る。旅の途中で、節度（節）を守り、安全な場所を確保します。",
    三爻変との関係性:
      "旅人が宿屋を焼く。その召使いを失う。危うい。旅先での怒り（離）は、全てを失う原因になります。",
    四爻変との関係性:
      "旅人が仮の宿に泊まる。その資金と斧を得る。私の心は穏やかでない。旅先で利益を得ても、その心は鼎で煮られるように落ち着きません。",
    五爻変との関係性:
      "雉を射て、一本の矢を失う。究極的には、称賛と官位を得る。旅先での小さな損失が、やがては日の出（晋）のような大きな成功に繋がります。",
    上爻変との関係性:
      "鳥がその巣を焼かれる。旅人が初めは笑い、後には泣き叫ぶ。牛をたやすく失う。凶。旅の終わりに、山（艮）のように安住できるはずの場所を失います。",
    "アーキタイプ（原型）": "変化, 適応, 孤独, 異郷",
    現代解釈の要約:
      "慣れない環境での、孤独で不安定な状況。慎重さと適応能力が試される。",
    出た時の気持ち:
      "不安、孤独感、不安定さ。しかし、新しい環境への好奇心や、自己の成長への期待",
    どうすればいい:
      "慎重さと礼儀を忘れず、目的を見失わない。自分を律し、小さな成功体験を積み重ねる",
    相談すべき人: "同じ経験を持つ先輩、現地の協力者、コーチ",
  },
  {
    卦番号: 57,
    卦名: "巽為風",
    綜卦: 57,
    錯卦: 52,
    互卦: 38,
    初爻変: 58,
    二爻変: 51,
    三爻変: 44,
    四爻変: 18,
    五爻変: 48,
    上爻変: 9,
    "綜卦との関係性（裏の視点）":
      "視点を変えても同じ。柔軟な影響力は、どこから見ても変わらない。",
    "錯卦との関係性（対極の世界）":
      "震為雷（衝撃）と対。繰り返し浸透していく「柔軟な影響」の対極は、一度きりの「突発的な衝撃」。",
    互卦との関係性:
      "内側には火と沢が反目し合う（火沢睽）象が隠されています。風のように従順な（巽）姿勢の裏には、実は内心の不和や葛藤が隠されていることを示します。",
    初爻変との関係性:
      "進むべきか退くべきか、武人のように決然とすべき。迷い（巽）の初めには、ただ喜悦（兌）に流されるのではなく、毅然とした態度が必要です。",
    二爻変との関係性:
      "祭壇の下で、多くの専門家の意見を用いるのが良い。吉。見えない場所で人の意見をよく聞くことで、雷（震）のような天啓を得られます。",
    三爻変との関係性:
      "頻繁に人の意見に従うばかりでは、恥をかきます。自分の意見がなく、人に従うばかりでは、予期せぬ不覚（姤）を取ります。",
    四爻変との関係性:
      "後悔は消えます。田で三種類の獲物を得るような大きな功績を上げるでしょう。その功績は、腐敗（蠱）した状況を正すほどのものです。",
    五爻変との関係性:
      "正しくあれば吉。後悔は消え、全てが良いでしょう。風のように柔軟に、井戸（井）のように根本から物事を改めることで、状況は好転します。",
    上爻変との関係性:
      "祭壇の下に伏し、旅費と武器を失う。正しくても凶。従順すぎた結果、わずかな力も蓄えられず（小畜）、全てを失います。",
    "アーキタイプ（原型）": "影響力, 柔軟性, 浸透, 優柔不断",
    現代解釈の要約:
      "風のように、目に見えないが、確実に物事の奥深くまで入り込み、影響を与える。",
    出た時の気持ち:
      "有能感、自信。しかし、自分の意見がない「優柔不断」だと思われることへの恐れ",
    どうすればいい:
      "独断を避け、謙虚に、そして間接的な力で物事を動かす。人の意見をよく聞き、根回しをする",
    相談すべき人: "交渉人、ファシリテーター、コンサルタント",
  },
  {
    卦番号: 58,
    卦名: "兌為沢",
    綜卦: 58,
    錯卦: 51,
    互卦: 37,
    初爻変: 57,
    二爻変: 52,
    三爻変: 60,
    四爻変: 47,
    五爻変: 17,
    上爻変: 10,
    "綜卦との関係性（裏の視点）":
      "視点を変えても同じ。「喜び」は、どこから見ても変わらない喜びである。",
    "錯卦との関係性（対極の世界）":
      "艮為山（静止）と対。人と和やかに語り合う「喜び」の対極は、山のように動かず「沈黙」すること。",
    互卦との関係性:
      "内側には風と火による家庭（風火家人）の象があります。喜び（兌）は、家庭のような和やかな人間関係から生まれることを示唆します。",
    初爻変との関係性:
      "和やかな喜び。吉。その喜びは、風（巽）のように周囲に広まっていきます。",
    二爻変との関係性:
      "誠実な喜び。吉。後悔は消える。山（艮）のように動じない、真心からの喜びは、後悔を残しません。",
    三爻変との関係性:
      "来るのを待つ喜び。凶。相手から喜びが来るのを待っているだけでは、節度（節）を失い、良い結果になりません。",
    四爻変との関係性:
      "不純なもの（商）を喜ぶが、まだ安泰ではない。危険から離れれば、喜びがある。不健全な喜びは、困窮（困）を招きます。",
    五爻変との関係性:
      "引き込むような喜び。よこしまな道に引きずり込もうとする喜びです。時の流れ（随）に身を任せる前に、その誘いが正しいか見極めるべきです。",
    上爻変との関係性:
      "引き出すような喜び。まだ定まっていない。危険な道（履）の先にある喜びであり、油断は禁物です。",
    "アーキタイプ（原型）": "喜び, コミュニケーション, 共感",
    現代解釈の要約:
      "人々が喜びを分かち合う。しかし、口先だけの軽薄な喜びへの警告も含む。",
    出た時の気持ち:
      "楽しさ、喜び、解放感。しかし、口先だけの軽薄な関係になることへの懸念",
    どうすればいい:
      "軽薄な言動を避け、真心をもって交流する。相手の話をよく聞き、共感する",
    相談すべき人: "ファシリテーター、カウンセラー、友人",
  },
  {
    卦番号: 59,
    卦名: "風水渙",
    綜卦: 60,
    錯卦: 62,
    互卦: 27,
    初爻変: 60,
    二爻変: 55,
    三爻変: 6,
    四爻変: 4,
    五爻変: 29,
    上爻変: 61,
    "綜卦との関係性（裏の視点）":
      "水風井（井戸）と対。困難を「散らす」ことの裏側には、安定した供給源である「井戸」の存在がある。",
    "錯卦との関係性（対極の世界）":
      "雷火豊（繁栄）と対。物事が散り散りになる「離散」の対極は、全てが集まり満ち溢れる「繁栄」。",
    互卦との関係性:
      "内側には物を養う（山雷頤）象があります。物が散り散りになる（渙）のは、人々を養うための再分配や、新しい秩序を作るための過程である場合があります。",
    初爻変との関係性:
      "馬を助けて、盛んにする。吉。混乱（渙）した状況を収拾するには、まず足元を助け、節度（節）を取り戻すことが重要です。",
    二爻変との関係性:
      "散り散りになる時に、自分の机に向かって走る。後悔は消える。混乱の中でも、自分の本分や豊か（豊）な基盤に立ち返れば、道を見失いません。",
    三爻変との関係性:
      "自分の体を散らす。後悔はない。私利私欲を捨てて尽くすことで、争い事（訟）を避けることができます。",
    四爻変との関係性:
      "その群れを散らす。大吉。丘のように大きなものを散らす。常人には考えつかないこと。蒙昧（蒙）な群衆を解き放ち、新しい秩序を作ります。",
    五爻変との関係性:
      "汗をかくように、大声で叫ぶように、その危機を知らせる。王のいる所を散らす。問題ない。困難（坎）な状況を、大声で知らせて危険から遠ざけます。",
    上爻変との関係性:
      "その血を散らし、遠くへ去り、声を出して難を逃れる。問題ない。自らを犠牲にして（血を散らし）、誠（中孚）をもって人々を救います。",
    "アーキタイプ（原型）": "困難の解消, 分散, 再生",
    現代解釈の要約:
      "固まった困難や停滞を「散らし」、新しい流れを生み出す、問題解決の卦。",
    出た時の気持ち:
      "希望、解放感。しかし、一度壊れたものを再建する困難さや、痛みを伴うことへの覚悟",
    どうすればいい:
      "私心を捨て、大胆な発想と行動で、新しい流れを生み出す。過去のしがらみを断ち切る",
    相談すべき人: "改革派リーダー、コンサルタント、起業家",
  },
  {
    卦番号: 60,
    卦名: "水沢節",
    綜卦: 59,
    錯卦: 61,
    互卦: 27,
    初爻変: 59,
    二爻変: 56,
    三爻変: 58,
    四爻変: 19,
    五爻変: 61,
    上爻変: 29,
    "綜卦との関係性（裏の視点）":
      "風沢中孚（真心）と対。外面的な「節度」やルールの裏側には、内面的な「真心」がなければならない。",
    "錯卦との関係性（対極の世界）":
      "火山旅（不安定な旅）と対。ルールの中で行動を「制限」することの対極は、定住せずに行き先も定めない「不安定な旅」。",
    互卦との関係性:
      "内側には物を養う（山雷頤）象があります。節度（節）とは、限りある資源を賢く使い、養い育てるための知恵です。",
    初爻変との関係性:
      "門や庭から出ない。問題ない。節度を守るべき時に出歩けば、物事が散漫（渙）になります。",
    二爻変との関係性:
      "門から出ない。凶。時機を逸する。節度を守るべきでない時に閉じこもっていると、旅（旅）に出る好機を失います。",
    三爻変との関係性:
      "節度を守らない者は、ため息をつくことになる。問題ない。節度を失い、快楽（兌）に溺れれば、後悔することになります。",
    四爻変との関係性:
      "安心して節度を守る。亨る。人々の上に立つ（臨）者は、自らが模範となって節度を守るべきです。",
    五爻変との関係性:
      "甘い節度。正しくあれば吉。進めば恥をかく。心地よいだけの節度は、真心（中孚）に欠け、長続きしません。",
    上爻変との関係性:
      "苦しい節度。正しくても凶。後悔は消える。厳しすぎる節度は、人々を困難（坎）に陥れ、かえって後悔を残します。",
    "アーキタイプ（原型）": "節度, 規律, 抑制, バランス",
    現代解釈の要約:
      "物事の行き過ぎを防ぐための、適切な制限の重要性。バランスが鍵。",
    出た時の気持ち:
      "安定感、自己管理できている感覚。しかし、過剰な制約による息苦しさや、楽しめないことへの不満",
    どうすればいい:
      "過剰や不足を避け、常に適切なバランスを保つ。目的を明確にし、守るべきルールを決める",
    相談すべき人: "コーチ、トレーナー、信頼できる上司",
  },
  {
    卦番号: 61,
    卦名: "風沢中孚",
    綜卦: 62,
    錯卦: 60,
    互卦: 28,
    初爻変: 62,
    二爻変: 62,
    三爻変: 10,
    四爻変: 41,
    五爻変: 60,
    上爻変: 59,
    "綜卦との関係性（裏の視点）":
      "雷山小過（異常事態）と対。「真心」による調和の裏側には、それが崩れる「異常事態」の危機がある。",
    "錯卦との関係性（対極の世界）":
      "雷山小過（小さな過ち）と対。真心を尽くす「誠実」の対極は、実体が伴わない「少しの行き過ぎ」。",
    互卦との関係性:
      "内側には物を養う（山雷頤）象があります。誠実さ（中孚）とは、相手を心から養い、育もうとする気持ちの現れです。",
    初爻変との関係性:
      "誠実さを計る。他に心があれば乱れる。真心が安定しないと、少しやり過ぎる（小過）くらいの失敗を招きます。",
    二爻変との関係性:
      "鶴が木陰で鳴き、その子がこれに和す。私によい杯がある。お前と共にこれを尽くそう。誠実さは、少し離れていても（小過）、必ず相手に伝わります。",
    三爻変との関係性:
      "敵を得て、ある時は太鼓を打ち、ある時はやめ、ある時は泣き、ある時は歌う。誠実さが乱れ、危険な道（履）に迷い込んでいます。",
    四爻変との関係性:
      "月が満月になろうとする。馬の片方がいなくなる。問題ない。誠実であれば、何かを損なう（損）ことがあっても、いずれ満たされます。",
    五爻変との関係性:
      "鶏を持っている。正しくても危うい。誠実そうに見えても、その行動が節度（節）を欠いていれば、危険が伴います。",
    上爻変との関係性:
      "鶏が天に昇る。正しくても凶。誠実さが現実離れしていると、その力は散漫（渙）になり、実を結びません。",
    "アーキタイプ（原型）": "真心, 信頼, 共感",
    現代解釈の要約:
      "偽りのない誠実な心が、人々の信頼を得て、物事を成し遂げる。",
    出た時の気持ち:
      "信頼されている安心感、一体感。しかし、その真心が相手に伝わらないことへの悲しさや、裏切られることへの恐れ",
    どうすればいい:
      "表面的なものではなく、心からの誠実さで人と接する。言行を一致させ、約束を守る",
    相談すべき人: "信頼できるパートナー、家族、親友",
  },
  {
    卦番号: 62,
    卦名: "雷山小過",
    綜卦: 61,
    錯卦: 59,
    互卦: 27,
    初爻変: 61,
    二爻変: 61,
    三爻変: 15,
    四爻変: 31,
    五爻変: 56,
    上爻変: 55,
    "綜卦との関係性（裏の視点）":
      "風沢中孚（真心）と対。「異常事態」の裏側には、本来あるべき「真心」による調和がある。",
    "錯卦との関係性（対極の世界）":
      "風沢中孚（誠実）と対。少しの「行き過ぎ」や「小さな過ち」の対極は、内面から溢れる「誠実」さ。",
    互卦との関係性:
      "内側には大きなものが過ぎる（沢風大過）象があります。少しやり過ぎる（小過）ことと、常軌を逸する（大過）ことは、表裏一体です。",
    初爻変との関係性:
      "鳥が飛んで、凶を招く。少しやり過ぎるくらいなら良いが、度を越して誠実さ（中孚）を失えば、災いを招きます。",
    二爻変との関係性:
      "祖母に会い、臣下に会わない。君主を通り過ぎ、その臣下に会う。問題ない。少しやり過ぎても、真心（中孚）があれば、道理にかなった行動と見なされます。",
    三爻変との関係性:
      "防備を固めなければ、後ろからこれを討たれるかもしれない。凶。少しの油断（小過）が、謙虚（謙）さを失わせ、足元をすくわれる原因になります。",
    四爻変との関係性:
      "穴の中で出会う。問題ない。少しやり過ぎても、相手に感応（咸）させることができます。",
    五爻変との関係性:
      "雲が行くが、雨は降らない。西の郊外から来る。公が、かの穴にいる者を射止める。少しやり過ぎるくらいの行動が、旅（旅）の途中で成果をもたらします。",
    上爻変との関係性:
      "雲に会い、雨は降らない。西の郊外から来る。鳥が飛んでいくのを網で捕らえる。少しやり過ぎた結果、豊かな（豊）はずの獲物を逃してしまいます。",
    "アーキタイプ（原型）": "異常事態, 危機, バランス",
    現代解釈の要約:
      "バランスを欠いた危機的状況。大きな行動は慎み、細やかな配慮が求められる。",
    出た時の気持ち: "焦り、不安、危機感。しかし、まだ取り返しがつくという認識",
    どうすればいい:
      "大きな行動は慎む。細やかな配慮と謙虚な姿勢を保ち、状況を悪化させないことに集中する",
    相談すべき人: "リスクマネージャー、客観的なアドバイザー",
  },
  {
    卦番号: 63,
    卦名: "水火既済",
    綜卦: 64,
    錯卦: 64,
    互卦: 64,
    初爻変: 64,
    二爻変: 64,
    三爻変: 49,
    四爻変: 36,
    五爻変: 37,
    上爻変: 39,
    "綜卦との関係性（裏の視点）":
      "火水未済（未完成）と対。全ての物事は、「完成」すれば、必ず「未完成」へと反転していく。",
    "錯卦との関係性（対極の世界）":
      "火水未済（未完成）と対。全てが整った「完成」の対極は、秩序がなく、まだ何も定まらない「未完成」。",
    互卦との関係性:
      "内側には物事が未完成（火水未済）である象が隠されています。物事が完成（既済）したように見えても、次なる未完成の段階がすでに始まっています。",
    初爻変との関係性:
      "その車輪を引き、その尾を濡らす。問題ない。完成の直後、勢い余って進むと、未完成（未済）の状態に逆戻りします。",
    二爻変との関係性:
      "婦人がその髪飾りを失う。追いかけるな。七日もすれば得られる。完成した状態を守ろうと焦ると、かえって大切なものを失います。未完成（未済）の時を待つべきです。",
    三爻変との関係性:
      "高宗が鬼方国を討伐し、三年かかってこれに勝った。小人は用いるな。大きな完成のためには、長期的な改革（革）の視点が必要です。",
    四爻変との関係性:
      "東の隣人が牛を殺して祭祀を行うも、西の隣人の質素な祭祀ほどの福を受けられない。完成したからと油断すれば、明知が傷つけられる（明夷）時よりも悪い結果になります。",
    五爻変との関係性:
      "東の隣人が牛を殺して祭祀を行うも、西の隣人の質素な祭祀ほどの福を受けられない。完成を祝うに、豪華さより家庭（家人）的な真心が大切です。",
    上爻変との関係性:
      "頭を濡らす。危うい。完成したと油断し、さらに進もうとすると、困難（蹇）な状況に陥ります。",
    "アーキタイプ（原型）": "完成, 調和, 維持",
    現代解釈の要約:
      "物事が完璧に完成した状態。しかし、その完成をいかに維持し、油断しないかが問われる。",
    出た時の気持ち:
      "達成感、安堵感。しかし、この状態を維持することの難しさや、次の衰退への警戒",
    どうすればいい:
      "完成後の乱れを警戒する。慢心せず、常に改善を続け、次の変化に備える",
    相談すべき人: "保守管理者、品質管理者",
  },
  {
    卦番号: 64,
    卦名: "火水未済",
    綜卦: 63,
    錯卦: 63,
    互卦: 63,
    初爻変: 63,
    二爻変: 63,
    三爻変: 4,
    四爻変: 6,
    五爻変: 40,
    上爻変: 38,
    "綜卦との関係性（裏の視点）":
      "水火既済（完成）と対。「未完成」の先には、常に「完成」という目標がある。",
    "錯卦との関係性（対極の世界）":
      "水火既済（完成）と対。全てが混沌とした「未完成」の対極は、全てのものが定位置にある「完成」。",
    互卦との関係性:
      "内側には物事が完成（水火既済）した象があります。物事が未完成（未済）なのは、内なる完成へのエネルギーを原動力としているからです。",
    初爻変との関係性:
      "その尾を濡らす。恥ずかしい。未完成のまま川を渡ろうとすれば、完成（既済）を目前にして失敗します。",
    二爻変との関係性:
      "その車輪を引く。正しくあれば吉。未完成の状況で進むのを止めれば、完成（既済）への道を守れます。",
    三爻変との関係性:
      "未だ済まず。進めば凶。大きな川を渡るのが良い。未完成な状況で進むのは、蒙昧（蒙）な者の行いです。",
    四爻変との関係性:
      "正しくあれば吉。後悔は消える。震の武力で鬼方国を討伐し、三年で大手柄を立て、大きな国を賞として与えられる。未完成を完成させるには、争訟（訟）を乗り越える力が必要です。",
    五爻変との関係性:
      "誠実さがあれば、酒を飲んでいても問題ない。未完成な状況でも、信じて待てば、困難は解消（解）されます。",
    上爻変との関係性:
      "誠実さがあり、酒を飲む。問題ない。頭を濡らす。誠実さがあるが、度を過ごしている。未完成の状況で羽目を外しすぎると、不和（睽）を招き、恥をかきます。",
    "アーキタイプ（原型）": "未完成, 継続, 希望, 循環",
    現代解釈の要約:
      "物事がまだ完成していない状態。終わりは新たな始まりであり、希望と継続的な努力がテーマ。",
    出た時の気持ち:
      "期待と不安が入り混じる。可能性を感じるが、同時に何から手をつけていいかわからない混乱",
    どうすればいい:
      "焦らず、一つずつ物事を整理する。慎重に計画を立て、小さな一歩から始める",
    相談すべき人: "プロジェクトマネージャー、メンター",
  },
];

// ▼▼▼【v19.2 修正】Node.js環境でも読み込めるように追記 ▼▼▼
if (typeof module !== "undefined" && module.exports) {
  module.exports = { HAQEI_DATA };
}
