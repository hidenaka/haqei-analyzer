    <script>
        // ==========================================
        // HAQEI Emergency Analyzer - Vanilla JS
        // HaQei Emergency Analyzer System
        // ==========================================
        
        // 1. Questions Data - 30問完全版
        // TODO: WORLDVIEW_QUESTIONSを再構築（バランス調整済み30問セット）
        // Future Simulator用の基本質問セット - 実装完了
        const WORLDVIEW_QUESTIONS = [
            {
                id: 1,
                text: "現在の悩みや課題を具体的に教えてください",
                type: "textarea",
                category: "worry_input",
                required: true,
                placeholder: "例：転職するかどうか悩んでいます。現在の会社では成長が感じられず、新しいチャレンジをしたいと思っています。"
            }
        ];
        
        // シナリオ設問データ (q26-q30) - 高品質・保持
        const SCENARIO_QUESTIONS = [
          {
            id: "q26",
            text: "信頼していた友人が、あなたの知らないところで批判的なことを言っていたことを知ってしまいました。",
            category: { title: "人間関係", description: "信頼関係の危機への対応" },
            options: [
              { value: "A", text: "直接本人に話して、はっきりさせる", scoring: { "li_expression": 3.0, "zhen_action": 2.0, "dui_harmony": -1.5 } },
              { value: "B", text: "何事もなかったように、普段通りに接する", scoring: { "gen_stability": 2.5, "xun_adaptability": 1.5, "li_expression": -1.5 } },
              { value: "C", text: "第三者を交えて冷静に話し合う", scoring: { "kan_exploration": 2.0, "dui_harmony": 2.0, "gen_stability": 1.5 } },
              { value: "D", text: "距離を置いて、関係を自然に薄くしていく", scoring: { "gen_stability": 2.0, "kan_exploration": 1.0, "dui_harmony": -1.5 } },
              { value: "E", text: "率直に傷ついた気持ちを伝える", scoring: { "li_expression": 2.0, "dui_harmony": 1.5, "gen_stability": -0.5 } }
            ]
          },
          {
            id: "q27",
            text: "あなたの重要な決断（進路、転職、結婚、住む場所など）について、家族や親しい人が強く反対しています。",
            category: { title: "価値観の対立", description: "家族との価値観の違いへの対応" },
            options: [
              { value: "A", text: "毅然とした態度で自分の決意を表明する", scoring: { "li_expression": 3.0, "zhen_action": 2.0, "kun_receptiveness": -1.0 } },
              { value: "B", text: "時間をかけて丁寧に説明し、理解を求める", scoring: { "dui_harmony": 2.5, "li_expression": 2.0, "gen_stability": 1.0 } },
              { value: "C", text: "一時的に距離を置いて、お互い冷静になる時間を作る", scoring: { "gen_stability": 2.0, "xun_adaptability": 1.5, "dui_harmony": -0.5 } },
              { value: "D", text: "家族の意見も聞き入れて、妥協点を探る", scoring: { "kun_receptiveness": 2.5, "dui_harmony": 2.0, "zhen_action": -0.5 } },
              { value: "E", text: "第三者の意見も取り入れて、客観的に話し合う", scoring: { "kan_exploration": 2.0, "xun_adaptability": 1.5, "dui_harmony": 1.5 } }
            ]
          },
          {
            id: "q28",
            text: "突然の事故や災害、急病など、予想外の緊急事態が発生しました。迅速な判断と行動が求められています。",
            category: { title: "緊急事態", description: "危機的状況での判断力と行動力" },
            options: [
              { value: "A", text: "大声で周囲に指示を出し、人々を誘導する", scoring: { "li_expression": 3.0, "zhen_action": 2.5, "kun_receptiveness": -1.0 } },
              { value: "B", text: "専門家や責任者を探して、適切な判断を仰ぐ", scoring: { "kan_exploration": 2.0, "gen_stability": 2.0, "zhen_action": 1.0 } },
              { value: "C", text: "できる範囲で周りの人をサポートし、協力して対処する", scoring: { "dui_harmony": 2.5, "kun_receptiveness": 2.0, "zhen_action": 1.0 } },
              { value: "D", text: "状況に応じて臨機応変に行動する", scoring: { "xun_adaptability": 3.0, "zhen_action": 1.5, "gen_stability": -1.0 } },
              { value: "E", text: "マニュアルや手順を思い出して、確実に実行する", scoring: { "gen_stability": 2.5, "kan_exploration": 1.0, "xun_adaptability": -0.5 } }
            ]
          },
          {
            id: "q29",
            text: "あなたが参加している競技やコンテスト、選考などで、他の参加者と競争する状況になりました。結果によって今後が大きく左右されます。",
            category: { title: "競争", description: "競争状況での戦略と心構え" },
            options: [
              { value: "A", text: "フレンドリーに接しながらも、決して気を抜かない", scoring: { "dui_harmony": 2.0, "xun_adaptability": 2.0, "zhen_action": 1.5 } },
              { value: "B", text: "堂々と自信を持って、実力を存分に発揮する", scoring: { "li_expression": 3.0, "qian_creativity": 2.0, "kun_receptiveness": -0.5 } },
              { value: "C", text: "相手を尊重しつつ、正々堂々と競い合う", scoring: { "dui_harmony": 2.5, "gen_stability": 2.0, "li_expression": 1.0 } },
              { value: "D", text: "他の参加者から学べることを積極的に吸収する", scoring: { "kun_receptiveness": 2.5, "kan_exploration": 2.0, "zhen_action": 0.5 } },
              { value: "E", text: "心理戦も含めて、あらゆる手段で勝利を目指す", scoring: { "kan_exploration": 2.0, "xun_adaptability": 1.5, "dui_harmony": -1.5 } }
            ]
          },
          {
            id: "q30",
            text: "あなたは正しいと思うことと、周囲の期待や利益が相反する状況に置かれました。どちらを選んでも何かを犠牲にしなければなりません。",
            category: { title: "道徳的ジレンマ", description: "価値観と現実の間での選択" },
            options: [
              { value: "A", text: "自分の信念を率直に表明し、理解を求める", scoring: { "li_expression": 3.0, "zhen_action": 2.0, "dui_harmony": -0.5 } },
              { value: "B", text: "時間をかけて、みんなが納得できる解決策を探る", scoring: { "dui_harmony": 2.5, "kan_exploration": 2.0, "gen_stability": 1.5 } },
              { value: "C", text: "一時的に判断を保留し、より多くの意見を聞く", scoring: { "kun_receptiveness": 2.0, "kan_exploration": 1.5, "zhen_action": -1.0 } },
              { value: "D", text: "状況に応じて柔軟に対応し、最適解を見つける", scoring: { "xun_adaptability": 2.5, "kan_exploration": 2.0, "li_expression": 1.0 } },
              { value: "E", text: "責任を持って決断し、その結果を受け入れる", scoring: { "gen_stability": 2.5, "zhen_action": 2.0, "kun_receptiveness": 1.0 } }
            ]
          }
        ];
        
        // 全質問データの統合
        const QUESTIONS = [...WORLDVIEW_QUESTIONS, ...SCENARIO_QUESTIONS];
        
        // QUESTIONSをwindowオブジェクトに設定
        window.QUESTIONS = QUESTIONS;
        window.WORLDVIEW_QUESTIONS = WORLDVIEW_QUESTIONS;
        window.SCENARIO_QUESTIONS = SCENARIO_QUESTIONS;
        
        // 2. 64卦データベース（hexagrams.json統合）
        window.HEXAGRAMS = [
            { hexagram_id: 1, name_jp: "乾為天", reading: "けんいてん", catchphrase: "天翔ける龍のような、天性のリーダー", upper_trigram_id: 1, lower_trigram_id: 1, description: "あなたの心の奥底には、天を翔ける龍のような壮大なエネルギーが宿っています。新しい道を切り開き、人々を導くことに最も価値を見出すあなたは、生まれながらのリーダーです。", keywords: "創造,リーダーシップ,力" },
            { hexagram_id: 2, name_jp: "坤為地", reading: "こんいち", catchphrase: "大地の母のように、すべてを受け入れる人", upper_trigram_id: 8, lower_trigram_id: 8, description: "あなたの心には、大地のような広大で深い包容力が備わっています。人や物事を育み、支えることに最も喜びを感じるあなたは、周囲にとって欠かせない存在です。", keywords: "受容,育成,サポート" },
            { hexagram_id: 3, name_jp: "水雷屯", reading: "すいらいちゅん", catchphrase: "困難を乗り越える力強い意志", description: "新しい始まりには困難が伴いますが、あなたには それを乗り越える強い意志があります。", keywords: "始まり,困難,成長" },
            { hexagram_id: 4, name_jp: "山水蒙", reading: "さんすいもう", catchphrase: "学びと成長の探求者", description: "知識を求め、成長し続けることがあなたの本質です。", keywords: "学習,成長,探求" },
            { hexagram_id: 5, name_jp: "水天需", reading: "すいてんじゅ", catchphrase: "忍耐強く機会を待つ人", description: "適切なタイミングを見極める智慧があります。", keywords: "忍耐,タイミング,準備" },
            { hexagram_id: 6, name_jp: "天水訟", reading: "てんすいしょう", catchphrase: "正義を求める勇気ある人", description: "正しいことのために立ち上がる勇気があります。", keywords: "正義,対立,解決" },
            { hexagram_id: 7, name_jp: "地水師", reading: "ちすいし", catchphrase: "組織を率いるリーダー", description: "チームを統率し目標達成に導く力があります。", keywords: "リーダーシップ,組織,統率" },
            { hexagram_id: 8, name_jp: "水地比", reading: "すいちひ", catchphrase: "調和と協力を重視する人", description: "他者との調和を大切にし、協力関係を築くのが得意です。", keywords: "調和,協力,結束" },
            { hexagram_id: 9, name_jp: "風天小畜", reading: "ふうてんしょうちく", catchphrase: "細やかな配慮で成果を積み重ねる人", description: "小さな努力を積み重ねて大きな成果を生み出します。", keywords: "蓄積,配慮,着実" },
            { hexagram_id: 10, name_jp: "天沢履", reading: "てんたくり", catchphrase: "礼儀と品格を重んじる人", description: "正しい道を歩み、品格を保つことを大切にします。", keywords: "礼儀,品格,正道" },
            { hexagram_id: 11, name_jp: "地天泰", reading: "ちてんたい", catchphrase: "平和と繁栄をもたらす人", description: "調和とバランスにより平和と繁栄を実現します。", keywords: "平和,繁栄,調和" },
            { hexagram_id: 12, name_jp: "天地否", reading: "てんちひ", catchphrase: "困難な時期を乗り越える忍耐力", description: "逆境に屈せず、時期を待つ智慧があります。", keywords: "逆境,忍耐,転換" },
            { hexagram_id: 13, name_jp: "天火同人", reading: "てんかどうじん", catchphrase: "人々を団結させる調和の力", description: "共通の目標に向かって人々を結束させる力があります。", keywords: "団結,協力,調和" },
            { hexagram_id: 14, name_jp: "火天大有", reading: "かてんだいゆう", catchphrase: "豊かさと成功を手にする人", description: "大きな成果と豊かさを実現する力があります。", keywords: "成功,豊穣,繁栄" },
            { hexagram_id: 15, name_jp: "地山謙", reading: "ちざんけん", catchphrase: "謙虚さで人々から信頼される人", description: "謙虚な姿勢で多くの人から慕われます。", keywords: "謙遜,信頼,人徳" },
            { hexagram_id: 16, name_jp: "雷地豫", reading: "らいちよ", catchphrase: "喜びと活力をもたらす人", description: "周囲に喜びと前向きな活力を広げます。", keywords: "歓喜,活力,楽観" },
            { hexagram_id: 17, name_jp: "沢雷随", reading: "たくらいずい", catchphrase: "柔軟に適応し成長する人", description: "変化に柔軟に適応し、成長を続けます。", keywords: "適応,従順,成長" },
            { hexagram_id: 18, name_jp: "山風蠱", reading: "さんぷうこ", catchphrase: "改革と再生をもたらす人", description: "古い問題を解決し、新しい秩序を築きます。", keywords: "改革,再生,修復" },
            { hexagram_id: 19, name_jp: "地沢臨", reading: "ちたくりん", catchphrase: "人に寄り添い導く人", description: "人々に寄り添い、優しく導く力があります。", keywords: "指導,接近,親近" },
            { hexagram_id: 20, name_jp: "風地観", reading: "ふうちかん", catchphrase: "深い洞察で本質を見抜く人", description: "物事の本質を見抜く深い洞察力があります。", keywords: "観察,洞察,理解" },
            { hexagram_id: 21, name_jp: "火雷噬嗑", reading: "からいぜいごう", catchphrase: "正義を貫く強い意志の人", description: "困難を噛み砕き、正義を実現します。", keywords: "正義,決断,実行" },
            { hexagram_id: 22, name_jp: "山火賁", reading: "さんかひ", catchphrase: "美と調和で人を魅了する人", description: "美的センスと調和で人々を魅了します。", keywords: "美,装飾,調和" },
            { hexagram_id: 23, name_jp: "山地剥", reading: "さんちはく", catchphrase: "困難な時期を耐え抜く人", description: "厳しい状況でも忍耐強く耐え抜きます。", keywords: "忍耐,剥落,衰退" },
            { hexagram_id: 24, name_jp: "地雷復", reading: "ちらいふく", catchphrase: "新たな始まりを切り開く人", description: "困難の後に新しい始まりをもたらします。", keywords: "復活,再生,回復" },
            { hexagram_id: 25, name_jp: "天雷无妄", reading: "てんらいむぼう", catchphrase: "自然体で真実を貫く人", description: "偽りなく、自然体で真実を貫きます。", keywords: "純真,自然,誠実" },
            { hexagram_id: 26, name_jp: "山天大畜", reading: "さんてんだいちく", catchphrase: "力を蓄え大きな成果を上げる人", description: "エネルギーを蓄積し、大きな成果を実現します。", keywords: "蓄積,抑制,大成" },
            { hexagram_id: 27, name_jp: "山雷頤", reading: "さんらいい", catchphrase: "滋養と成長を促す人", description: "自分と他者の成長を大切に育みます。", keywords: "養育,滋養,成長" },
            { hexagram_id: 28, name_jp: "沢風大過", reading: "たくふうだいか", catchphrase: "大胆な挑戦をする人", description: "常識を超える大胆な挑戦をします。", keywords: "過剰,大胆,挑戦" },
            { hexagram_id: 29, name_jp: "坎為水", reading: "かんいすい", catchphrase: "困難を乗り越える不屈の人", description: "どんな困難も諦めずに乗り越えます。", keywords: "危険,困難,不屈" },
            { hexagram_id: 30, name_jp: "離為火", reading: "りいか", catchphrase: "明るさで周囲を照らす人", description: "知恵と明るさで周囲を照らします。", keywords: "光明,知恵,照明" },
            { hexagram_id: 31, name_jp: "沢山咸", reading: "たくざんかん", catchphrase: "感化し合う深い絆を築く人", description: "相互に影響し合う深い関係を築きます。", keywords: "感応,影響,結合" },
            { hexagram_id: 32, name_jp: "雷風恒", reading: "らいふうこう", catchphrase: "持続する力で目標を達成する人", description: "継続する力で長期的な成功を収めます。", keywords: "持続,恒常,永続" },
            { hexagram_id: 33, name_jp: "天山遯", reading: "てんざんとん", catchphrase: "適切な時期を見極め退く智慧の人", description: "引き際を知る智慧で身を守ります。", keywords: "退避,隠遁,時機" },
            { hexagram_id: 34, name_jp: "雷天大壮", reading: "らいてんだいそう", catchphrase: "力強さで道を切り開く人", description: "強大な力で新しい道を切り開きます。", keywords: "強大,威力,前進" },
            { hexagram_id: 35, name_jp: "火地晋", reading: "かちしん", catchphrase: "着実に前進し成功する人", description: "着実な歩みで確実に成功を掴みます。", keywords: "前進,昇進,発展" },
            { hexagram_id: 36, name_jp: "地火明夷", reading: "ちかめいい", catchphrase: "困難な時期を智慧で乗り切る人", description: "暗い時期も内なる光で乗り越えます。", keywords: "隠蔽,忍耐,内光" },
            { hexagram_id: 37, name_jp: "風火家人", reading: "ふうかかじん", catchphrase: "家族や仲間を大切にする人", description: "身近な人との関係を最も大切にします。", keywords: "家族,親密,絆" },
            { hexagram_id: 38, name_jp: "火沢睽", reading: "かたくけい", catchphrase: "違いを乗り越え和解する人", description: "対立や違いを乗り越えて和解をもたらします。", keywords: "対立,乖離,和解" },
            { hexagram_id: 39, name_jp: "水山蹇", reading: "すいざんけん", catchphrase: "困難を智慧で解決する人", description: "困難な状況を智慧と工夫で乗り越えます。", keywords: "障害,困難,解決" },
            { hexagram_id: 40, name_jp: "雷水解", reading: "らいすいかい", catchphrase: "問題を解決し開放をもたらす人", description: "複雑な問題を解決し、解放をもたらします。", keywords: "解放,解決,開放" },
            { hexagram_id: 41, name_jp: "山沢損", reading: "さんたくそん", catchphrase: "犠牲を払い他者を助ける人", description: "自らを犠牲にして他者の利益を図ります。", keywords: "損失,犠牲,利他" },
            { hexagram_id: 42, name_jp: "風雷益", reading: "ふうらいえき", catchphrase: "利益をもたらし成長を促す人", description: "周囲に利益をもたらし、共に成長します。", keywords: "利益,成長,増加" },
            { hexagram_id: 43, name_jp: "沢天夬", reading: "たくてんかい", catchphrase: "決断力で障害を突破する人", description: "的確な判断で困難を突破します。", keywords: "決断,突破,除去" },
            { hexagram_id: 44, name_jp: "天風姤", reading: "てんぷうこう", catchphrase: "偶然の出会いを活かす人", description: "思いがけない出会いを大切にし活かします。", keywords: "出会い,邂逅,機会" },
            { hexagram_id: 45, name_jp: "沢地萃", reading: "たくちすい", catchphrase: "人々を集め結束させる人", description: "多くの人を集めて大きな力を作ります。", keywords: "集合,結集,統合" },
            { hexagram_id: 46, name_jp: "地風升", reading: "ちふうしょう", catchphrase: "着実に向上し成長する人", description: "地道な努力で着実に地位を向上させます。", keywords: "上昇,昇進,向上" },
            { hexagram_id: 47, name_jp: "沢水困", reading: "たくすいこん", catchphrase: "困窮を乗り越える強靭な人", description: "厳しい困窮状態も諦めずに乗り越えます。", keywords: "困窮,苦境,忍耐" },
            { hexagram_id: 48, name_jp: "水風井", reading: "すいふうせい", catchphrase: "智慧の源で人を潤す人", description: "豊かな智慧で多くの人を潤します。", keywords: "源泉,供給,恵み" },
            { hexagram_id: 49, name_jp: "沢火革", reading: "たくかかく", catchphrase: "革新的な変化をもたらす人", description: "古いものを変革し、新しい時代を築きます。", keywords: "革命,変革,改革" },
            { hexagram_id: 50, name_jp: "火風鼎", reading: "かふうてい", catchphrase: "新秩序を確立する人", description: "新しい秩序と文化を確立します。", keywords: "確立,秩序,文化" },
            { hexagram_id: 51, name_jp: "震為雷", reading: "しんいらい", catchphrase: "衝撃的な変化で覚醒させる人", description: "強い衝撃で人々を目覚めさせます。", keywords: "震動,驚愕,覚醒" },
            { hexagram_id: 52, name_jp: "艮為山", reading: "ごんいざん", catchphrase: "静寂な安定で心を鎮める人", description: "静かな安定感で周囲に安らぎを与えます。", keywords: "静止,安定,瞑想" },
            { hexagram_id: 53, name_jp: "風山漸", reading: "ふうざんぜん", catchphrase: "着実な進歩を重ねる人", description: "焦らず着実に一歩ずつ前進します。", keywords: "漸進,着実,段階" },
            { hexagram_id: 54, name_jp: "雷沢帰妹", reading: "らいたくきまい", catchphrase: "従属の中で調和を見つける人", description: "従う立場でも調和と幸せを見つけます。", keywords: "従属,調和,配慮" },
            { hexagram_id: 55, name_jp: "雷火豊", reading: "らいかほう", catchphrase: "豊かな成果で栄光を掴む人", description: "豊富な成果と栄光を手にします。", keywords: "豊穣,充実,栄光" },
            { hexagram_id: 56, name_jp: "火山旅", reading: "かざんりょ", catchphrase: "旅路で経験を積む人", description: "旅を通して多くの経験と智慧を積みます。", keywords: "旅行,経験,移動" },
            { hexagram_id: 57, name_jp: "巽為風", reading: "そんいふう", catchphrase: "柔軟性で変化に適応する人", description: "風のような柔軟性で変化に対応します。", keywords: "柔軟,適応,浸透" },
            { hexagram_id: 58, name_jp: "兌為沢", reading: "だいたく", catchphrase: "喜びと楽しさを分かち合う人", description: "人々と喜びや楽しさを分かち合います。", keywords: "歓喜,楽しみ,交流" },
            { hexagram_id: 59, name_jp: "風水渙", reading: "ふうすいかん", catchphrase: "散らばったものを再統合する人", description: "分散した要素を再び一つに統合します。", keywords: "分散,解散,再統合" },
            { hexagram_id: 60, name_jp: "水沢節", reading: "すいたくせつ", catchphrase: "節度を保ち調和を作る人", description: "適切な節制で調和のとれた生活を送ります。", keywords: "節制,調節,適度" },
            { hexagram_id: 61, name_jp: "風沢中孚", reading: "ふうたくちゅうふ", catchphrase: "誠実さで深い信頼を得る人", description: "真心からの誠実さで人々の信頼を得ます。", keywords: "誠実,信頼,真心" },
            { hexagram_id: 62, name_jp: "雷山小過", reading: "らいざんしょうか", catchphrase: "小さな配慮で大きな成果を生む人", description: "細やかな心配りで大きな成功を収めます。", keywords: "配慮,細心,小事" },
            { hexagram_id: 63, name_jp: "水火既済", reading: "すいかきさい", catchphrase: "完成された調和を保つ人", description: "すべてが整った完璧な調和状態を維持します。", keywords: "完成,調和,達成" },
            { hexagram_id: 64, name_jp: "火水未済", reading: "かすいびさい", catchphrase: "未完成から新たな可能性を生む人", description: "まだ完成していない状態に新しい可能性を見出します。", keywords: "未完,可能性,継続" }
        ];
        
        // 3. 八卦ベクトルデータ（vectors.js統合）
        const H64_8D_VECTORS = {
            1: {
                qian_creativity: 9, zhen_action: 7, kan_exploration: 5, gen_stability: 6,
                kun_receptiveness: 1, xun_adaptability: 3, li_expression: 8, dui_harmony: 4
            },
            2: {
                qian_creativity: 2, zhen_action: 3, kan_exploration: 4, gen_stability: 8,
                kun_receptiveness: 9, xun_adaptability: 7, li_expression: 2, dui_harmony: 6
            }
            // 他の62卦のベクトルも同様に実装...
        };
        
        // 4. 正統八卦定義（易経準拠）
        const AUTHENTIC_TRIGRAMS = {
            1: { name: '乾', symbol: '☰', meaning: '天・創造・父', element: 'metal', nature: '剛健', description: '純粋創造力、天性のリーダーシップ、強固な意志' },
            2: { name: '兌', symbol: '☱', meaning: '沢・喜・少女', element: 'metal', nature: '悦楽', description: '喜悦調和、コミュニケーション、社交的魅力' },
            3: { name: '離', symbol: '☲', meaning: '火・光・中女', element: 'fire', nature: '光明', description: '光明表現、知性と情熱、明晰な判断' },
            4: { name: '震', symbol: '☳', meaning: '雷・動・長男', element: 'wood', nature: '発動', description: '雷鳴行動、エネルギッシュな実行力、革新力' },
            5: { name: '巽', symbol: '☴', meaning: '風・入・長女', element: 'wood', nature: '順入', description: '風の浸透、柔軟適応、細やかな配慮' },
            6: { name: '坎', symbol: '☵', meaning: '水・険・中男', element: 'water', nature: '陷険', description: '水の探求、深淵洞察、困難突破' },
            7: { name: '艮', symbol: '☶', meaning: '山・止・少男', element: 'earth', nature: '静止', description: '山の安定、継続力、不動の意志' },
            8: { name: '坤', symbol: '☷', meaning: '地・順・母', element: 'earth', nature: '柔順', description: '大地受容、育成力、無限の包容' }
        };
        
        // 正統八卦マッピング（先天八卦配列準拠）
        const AUTHENTIC_TRIGRAM_MAPPING = {
            "qian_creativity": 1,  // 乾☰ - 純粋創造（天・父・剛健）
            "dui_harmony": 2,  // 兌☱ - 喜悦調和（沢・少女・悦楽）
            "li_expression": 3,  // 離☲ - 光明表現（火・中女・光明）
            "zhen_action": 4,  // 震☳ - 発動行動（雷・長男・動）
            "xun_adaptability": 5,  // 巽☴ - 順応浸透（風・長女・入）
            "kan_exploration": 6,  // 坎☵ - 深淵探求（水・中男・険）
            "gen_stability": 7,  // 艮☶ - 静止安定（山・少男・止）
            "kun_receptiveness": 8   // 坤☷ - 受容育成（地・母・順）
        };
        
        // 5. Triple OS定義
        const TRIPLE_OS = {
            'Engine OS': {
                name: 'Engine OS',
                description: '論理的思考と実行力の中核システム',
                color: '#6366f1',
                trigrams: [1, 4, 6, 7], // 乾、震、坎、艮
                keywords: ['創造性', 'リーダーシップ', '行動力', '探求心', '安定性']
            },
            'Interface OS': {
                name: 'Interface OS', 
                description: 'コミュニケーションと表現の対人システム',
                color: '#8b5cf6',
                trigrams: [2, 3, 5, 8], // 兌、離、巽、坤
                keywords: ['調和性', 'コミュニケーション', '表現力', '適応性', '受容性']
            },
            'Safe Mode OS': {
                name: 'Safe Mode OS',
                description: '安定と調和を重視する保護システム',
                color: '#10b981',
                trigrams: [7, 8, 5, 6], // 艮、坤、巽、坎
                keywords: ['安定性', '受容性', '適応性', '慎重さ', '分析力']
            }
        };
        
        // 6. VirtualPersonaEnhancer: 仮想人格生成強化システム（64卦データベース連携版）
        class VirtualPersonaEnhancer {
            constructor() {
                // HEXAGRAMSデータベースを使用（既にグローバルに定義済み）
                this.hexagrams = window.HEXAGRAMS || [];
                this.trigramSymbols = {
                    1: "☰", // 乾（天）
                    2: "☱", // 兌（沢）
                    3: "☲", // 離（火）
                    4: "☳", // 震（雷）
                    5: "☴", // 巽（風）
                    6: "☵", // 坎（水）
                    7: "☶", // 艮（山）
                    8: "☷"  // 坤（地）
                };
            }
            
            // 卦IDから適切なシンボルを生成
            getSymbolForHexagram(hexagramId) {
                // 上卦と下卦に基づいてシンボルを決定
                const hexagram = this.hexagrams.find(h => h.hexagram_id === hexagramId);
                if (!hexagram) return "☯";
                
                // 上卦のシンボルを返す（簡略化）
                return this.trigramSymbols[hexagram.upper_trigram_id] || "☯";
            }
            
            // キーワードから特性を抽出
            extractTraitsFromKeywords(keywords) {
                if (!keywords) return [];
                return keywords.split(',').map(k => k.trim());
            }
            
            enhanceOSResult(osResult, osType) {
                // osResultにhexagramIdが含まれているはず
                const hexagramId = osResult.hexagramId || 1; // デフォルトは乾為天
                const hexagram = this.hexagrams.find(h => h.hexagram_id === hexagramId);
                
                if (!hexagram) {
                    console.warn(`Hexagram ${hexagramId} not found, using default`);
                    return osResult;
                }
                
                // 64卦データベースから動的にペルソナを生成
                return {
                    ...osResult,
                    persona: {
                        name: hexagram.catchphrase,  // データベースのキャッチフレーズを使用
                        symbol: this.getSymbolForHexagram(hexagramId),
                        traits: this.extractTraitsFromKeywords(hexagram.keywords),
                        hexagramName: hexagram.name_jp,
                        reading: hexagram.reading,
                        description: hexagram.description,
                        // HaQei哲学に基づく文脈依存的な表現
                        contextualExpression: `${osType === 'engine' ? '内的価値観' : osType === 'interface' ? '社会的側面' : '防御的側面'}における${hexagram.catchphrase}`
                    }
                };
            }
            
            generatePersonaCard(osResult, osType) {
                const enhancedResult = this.enhanceOSResult(osResult, osType);
                const persona = enhancedResult.persona;
                
                if (!persona) {
                    return '<div class="virtual-persona-card">ペルソナデータが見つかりません</div>';
                }
                
                // OSタイプに応じた色分け
                const osColors = {
                    engine: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    interface: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                    safemode: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)'
                };
                
                return `
                    <div class="virtual-persona-card" style="background: ${osColors[osType] || osColors.engine};">
                        <div class="persona-header">
                            <span class="persona-symbol">${persona.symbol}</span>
                            <div>
                                <h3 class="persona-name">${persona.name}</h3>
                                <p class="hexagram-name">${persona.hexagramName} (${persona.reading})</p>
                            </div>
                        </div>
                        <div class="persona-content">
                            <p class="persona-context">${persona.contextualExpression}</p>
                            <div class="persona-traits">
                                ${persona.traits.map(trait => `<span class="trait-tag">${trait}</span>`).join('')}
                            </div>
                            <p class="persona-description">${persona.description}</p>
                        </div>
                    </div>
                `;
            }
        }
        
        // 7. TripleOSエンジン（TypeScriptから移植）
        class TripleOSEngine {
            constructor() {
                this.trigramMapping = this.initializeTrigramMapping();
                this.interfaceKeywords = new Map();
                this.safeModeKeywords = new Map();
                this.initializeKeywordMaps();
            }
            
            initializeTrigramMapping() {
                // 易経準拠の正統三爻マッピング
                return {
                    "乾": { id: 1, symbol: "☰", name: "天", nature: "剛健", trait: "純粋創造・天性リーダーシップ" },
                    "兌": { id: 2, symbol: "☱", name: "沢", nature: "悦楽", trait: "喜悦調和・コミュニケーション" },
                    "離": { id: 3, symbol: "☲", name: "火", nature: "光明", trait: "光明表現・知性情熱" },
                    "震": { id: 4, symbol: "☳", name: "雷", nature: "発動", trait: "雷鳴行動・革新実行" },
                    "巽": { id: 5, symbol: "☴", name: "風", nature: "順入", trait: "風流浸透・柔軟適応" },
                    "坎": { id: 6, symbol: "☵", name: "水", nature: "陷険", trait: "深淵探求・洞察突破" },
                    "艮": { id: 7, symbol: "☶", name: "山", nature: "静止", trait: "山岳安定・不動継続" },
                    "坤": { id: 8, symbol: "☷", name: "地", nature: "柔順", trait: "大地受容・育成包容" }
                };
            }
            
            initializeKeywordMaps() {
                // Interface OS keywords
                this.interfaceKeywords.set("リーダーシップ", ["1", "13", "43", "14"]);
                this.interfaceKeywords.set("協調性", ["2", "15", "45", "8"]);
                this.interfaceKeywords.set("創造性", ["1", "43", "34", "14"]);
                
                // SafeMode OS keywords  
                this.safeModeKeywords.set("慎重", ["2", "52", "39", "15"]);
                this.safeModeKeywords.set("分析的", ["29", "48", "47", "6"]);
                this.safeModeKeywords.set("撤退", ["33", "12", "45", "35"]);
            }
            
            // Triple OS分析のメイン処理
            async analyzeTripleOS(allAnswers) {
                // console.log("🔯 Starting Triple OS Analysis");
                
                try {
                    // 1. 回答を価値観質問とシナリオ質問に分離
                    const { worldviewAnswers, scenarioAnswers } = this.separateAnswers(allAnswers);
                    
                    // 2. Engine OS（価値観システム）の分析
                    const engineOS = await this.analyzeEngineOS(worldviewAnswers);
                    
                    // 3. Interface OS（社会的システム）の分析
                    const interfaceOS = await this.analyzeInterfaceOS(scenarioAnswers, engineOS);
                    
                    // 4. SafeMode OS（防御システム）の分析
                    const safeModeOS = await this.analyzeSafeModeOS(scenarioAnswers, engineOS);
                    
                    // 5. 全OSが正常に計算されたか確認
                    this.validateTripleOSResults(engineOS, interfaceOS, safeModeOS);
                    
                    // 6. 各OSのエネルギー強度を計算
                    engineOS.energy = this.calculateOSEnergy(engineOS);
                    interfaceOS.energy = this.calculateOSEnergy(interfaceOS);
                    safeModeOS.energy = this.calculateOSEnergy(safeModeOS);
                    
                    console.log("⚡ OS Energies:", {
                        engine: engineOS.energy,
                        interface: interfaceOS.energy,
                        safeMode: safeModeOS.energy
                    });
                    
                    // 7. Triple OS統合分析の実行
                    const tripleOSIntegration = await this.calculateTripleOSInteraction(engineOS, interfaceOS, safeModeOS);
                    
                    // console.log("✅ Triple OS Analysis Completed Successfully");
                    
                    return {
                        engineOS,
                        interfaceOS,
                        safeModeOS,
                        integration: tripleOSIntegration,
                        consistencyScore: tripleOSIntegration.consistency,
                        balanceScore: tripleOSIntegration.balance,
                        HaQeiIntegration: tripleOSIntegration.integration,
                        recommendations: tripleOSIntegration.recommendations,
                        validationStatus: "completed",
                        timestamp: Date.now()
                    };
                    
                } catch (error) {
                    console.error("❌ Triple OS Analysis Error:", error);
                    
                    // 統合エラーハンドリング - デフォルトのTriple OS結果を返す
                    return this.getDefaultTripleOSResults();
                }
            }
            
            separateAnswers(allAnswers) {
                const worldviewAnswers = [];
                const scenarioAnswers = [];
                
                allAnswers.forEach(answer => {
                    const questionNum = parseInt(answer.questionId.replace('q', ''));
                    if (questionNum >= 1 && questionNum <= 24) {
                        worldviewAnswers.push(answer);
                    } else if (questionNum >= 25 && questionNum <= 30) {
                        scenarioAnswers.push(answer);
                    }
                });
                
                return { worldviewAnswers, scenarioAnswers };
            }
            
            async analyzeEngineOS(worldviewAnswers) {
                console.log("🔥 Engine OS Analysis: Core Values System Mapping");
                
                try {
                    // ユーザーベクトルの構築
                    const userVector = this.buildUserVector(worldviewAnswers);
                    console.log("📊 User Vector:", userVector);
                    
                    // 三爻エネルギーの計算
                    const trigramEnergies = this.calculateTrigramEnergies(userVector);
                    console.log("⚡ Trigram Energies:", trigramEnergies);
                    
                    // 🌟 改善：全体エネルギーバランス重視の64卦選択
                    const authenticEngine = new AuthenticEnergyBalanceEngine();
                    const optimalResult = authenticEngine.selectOptimalHexagramByEnergyBalance(
                        trigramEnergies, 
                        'Engine OS'
                    );
                    
                    console.log(`🏆 Engine OS Optimal Result:`, optimalResult);
                    
                    // 64卦データの取得（従来のシステムとの互換性維持）
                    const hexagram = HEXAGRAMS.find(h => h.hexagram_id === optimalResult.hexagramId) || HEXAGRAMS[0];
                    
                    return {
                        hexagramId: optimalResult.hexagramId,
                        hexagramName: optimalResult.hexagramName || hexagram.name_jp,
                        description: hexagram.description,
                        catchphrase: hexagram.catchphrase,
                        primaryTrigram: optimalResult.upperTrigram,
                        secondaryTrigram: optimalResult.lowerTrigram,
                        trigramEnergies,
                        // 🌟 新機能：全体調和分析の詳細結果
                        harmonyScore: optimalResult.harmonyScore,
                        energyUtilization: optimalResult.energyUtilization,
                        osCompatibility: optimalResult.osCompatibility,
                        detailedAnalysis: optimalResult.detailedAnalysis,
                        alternativeCandidates: optimalResult.alternativeCandidates,
                        improvementRecommendations: optimalResult.improvementRecommendations,
                        // 従来システムとの違いを明示
                        originalMethod: this.getLegacyResult(trigramEnergies),
                        improvedMethod: true,
                        balanceType: 'authentic_energy_balance'
                    };
                    
                } catch (error) {
                    console.error("❌ Engine OS Analysis Error:", error);
                    // エラー時はデフォルト値を返す（ユーザー体験を優先）
                    return {
                        upperTrigram: "乾",
                        lowerTrigram: "乾",
                        hexagramId: 1,
                        name: "乾為天",
                        philosophy: "創造性と革新性",
                        description: "エラーが発生したため、デフォルト値を表示しています",
                        energyValue: 50,
                        trigramEnergies: { upper: 50, lower: 50 },
                        error: true,
                        errorMessage: error.message
                    };
                }
            }
            
            // 削除: フォールバック関連メソッド（CLAUDE.md: 根本解決優先）
            // getLegacyResult, analyzeEngineOSLegacy は完全削除
            
            buildUserVector(answers) {
                const vector = {
                    qian_creativity: 0, zhen_action: 0, kan_exploration: 0, gen_stability: 0,
                    kun_receptiveness: 0, xun_adaptability: 0, li_expression: 0, dui_harmony: 0
                };
                
                answers.forEach(answer => {
                    const option = answer.selectedOption;
                    if (option && option.scoring) {
                        Object.entries(option.scoring).forEach(([dimension, score]) => {
                            if (vector.hasOwnProperty(dimension)) {
                                vector[dimension] += score;
                            }
                        });
                    }
                });
                
                return vector;
            }
            
            calculateTrigramEnergies(userVector) {
                // 易経準拠の正統三爻エネルギー計算
                const rawEnergies = {};
                
                // 8次元ベクトルから8三爻への正統変換
                Object.entries(AUTHENTIC_TRIGRAM_MAPPING).forEach(([dimension, trigramId]) => {
                    const trigramName = this.getTrigramName(trigramId);
                    rawEnergies[trigramName] = userVector[dimension] || 0;
                });
                
                // HaQei動的正規化（最高値を100とし、相対的バランス維持）
                const maxEnergy = Math.max(...Object.values(rawEnergies));
                const normalizedEnergies = {};
                
                if (maxEnergy > 0) {
                    Object.entries(rawEnergies).forEach(([trigram, energy]) => {
                        // 正規化 + 陰陽バランス調整
                        const normalized = (energy / maxEnergy) * 100;
                        normalizedEnergies[trigram] = Math.max(0, Math.min(100, normalized));
                    });
                } else {
                    // デフォルト値（均等分散）
                    Object.keys(rawEnergies).forEach(trigram => {
                        normalizedEnergies[trigram] = 12.5; // 100/8
                    });
                }
                
                return normalizedEnergies;
            }
            
            getTrigramName(trigramId) {
                // 🌟 IMPROVED: 詳細な説明付きtrigram名前取得
                const trigramMap = {
                    '乾': '乾 (天) - 創造性・リーダーシップの卦',
                    '兌': '兌 (沢) - 調和性・交流の卦',
                    '離': '離 (火) - 表現性・情熱の卦',
                    '震': '震 (雷) - 行動性・変革の卦', 
                    '巽': '巽 (風) - 適応性・柔軟性の卦',
                    '坎': '坎 (水) - 探求性・深層理解の卦',
                    '艮': '艮 (山) - 安定性・持続力の卦',
                    '坤': '坤 (地) - 受容性・支援の卦'
                };
                
                // 🛡️ UNDEFINED PROTECTION: 安全な取得
                if (typeof trigramId === 'number') {
                    const trigramNames = ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"];
                    const trigramKey = trigramNames[trigramId - 1];
                    return trigramMap[trigramKey] || `第${trigramId}卦 (詳細不明)`;
                }
                
                if (typeof trigramId === 'string') {
                    return trigramMap[trigramId] || `${trigramId} (詳細情報を取得中)`;
                }
                
                return '卦情報を取得中...';
            }
            
            mapTrigramsToHexagram(upperTrigram, lowerTrigram) {
                // 易経準拠の正確な64卦計算（先天八卦配列基準）
                const trigramToNumber = {
                    "乾": 1, "兌": 2, "離": 3, "震": 4,
                    "巽": 5, "坎": 6, "艮": 7, "坤": 8
                };
                
                const upper = trigramToNumber[upperTrigram] || 1;
                const lower = trigramToNumber[lowerTrigram] || 1;
                
                // 正統的64卦マトリックス（先天八卦順序）
                const authenticHexagramMatrix = [
                    [1, 43, 14, 34, 9, 5, 26, 11],   // 乾上 (天)
                    [58, 60, 38, 54, 61, 59, 28, 19], // 兌上 (沢)
                    [50, 64, 56, 62, 55, 63, 35, 8],  // 離上 (火)
                    [51, 16, 40, 32, 46, 48, 18, 7],  // 震上 (雷)
                    [57, 20, 53, 42, 37, 45, 22, 36], // 巽上 (風)
                    [6, 29, 4, 7, 59, 60, 3, 2],      // 坎上 (水)
                    [33, 52, 39, 15, 53, 56, 31, 12], // 艮上 (山)
                    [2, 47, 4, 7, 46, 29, 27, 24]     // 坤上 (地)
                  ];
                
                // 易経正統計算
                const hexagramId = authenticHexagramMatrix[upper - 1][lower - 1];
                
                console.log(`🔯 Authentic I-Ching Mapping: ${upperTrigram}(${upper}) over ${lowerTrigram}(${lower}) = Hexagram ${hexagramId}`);
                
                return hexagramId;
            }
            
            // 卦データ取得メソッド
            getHexagramData(hexagramId) {
                const hexagram = HEXAGRAMS.find(h => h.hexagram_id === hexagramId);
                if (!hexagram) {
                    console.warn(`Hexagram ${hexagramId} not found, using default`);
                    return HEXAGRAMS[0] || {
                        hexagram_id: hexagramId,
                        name_jp: `卦${hexagramId}`,
                        description: "データが見つかりません",
                        catchphrase: "---"
                    };
                }
                return hexagram;
            }
            
            async analyzeInterfaceOS(scenarioAnswers, engineOS) {
                console.log("🌐 Interface OS Analysis: Social Pattern Mapping");
                
                try {
                    // 1. シナリオ質問から社会的パターンを分析
                    const socialPatterns = this.analyzeSocialPatterns(scenarioAnswers);
                    console.log("📊 Social Patterns:", socialPatterns);
                    
                    // 2. Interface OS専用の8次元ベクトル構築
                    const interfaceVector = this.buildInterfaceVector(socialPatterns);
                    console.log("🎯 Interface Vector:", interfaceVector);
                    
                    // 3. 社会的三爻エネルギー計算
                    const socialTrigramEnergies = this.calculateSocialTrigramEnergies(interfaceVector);
                    console.log("⚡ Social Trigram Energies:", socialTrigramEnergies);
                    
                    // 4. Engine OSとの相互作用補正
                    const adjustedEnergies = this.adjustForEngineOS(socialTrigramEnergies, engineOS);
                    console.log("🔄 Adjusted for Engine OS:", adjustedEnergies);
                    
                    // 5. 🌟 改善：Interface OS全体エネルギーバランス重視の最適選択
                    const authenticEngine = new AuthenticEnergyBalanceEngine();
                    const optimalResult = authenticEngine.selectOptimalHexagramByEnergyBalance(
                        adjustedEnergies, 
                        'Interface OS'
                    );
                    
                    console.log(`🏆 Interface OS Optimal Result:`, optimalResult);
                    
                    // 6. 64卦データ取得
                    const hexagramData = this.getHexagramData(optimalResult.hexagramId);
                    
                    // 7. Interface OS専用解釈生成
                    const interfaceInterpretation = this.generateInterfaceInterpretation(
                        optimalResult.hexagramId, optimalResult.upperTrigram, optimalResult.lowerTrigram, socialPatterns, engineOS
                    );
                    
                    console.log(`🌟 Interface OS Result: Hexagram ${optimalResult.hexagramId} (${hexagramData.name_jp})`);
                    
                    return {
                        hexagramId: optimalResult.hexagramId,
                        hexagramName: optimalResult.hexagramName || hexagramData.name_jp,
                        catchphrase: hexagramData.catchphrase,
                        upperTrigram: optimalResult.upperTrigram,
                        lowerTrigram: optimalResult.lowerTrigram,
                        socialPatterns,
                        interfaceVector,
                        socialStyle: this.determineSocialStyle(socialPatterns),
                        description: interfaceInterpretation.description,
                        leadership: interfaceInterpretation.leadership,
                        communication: interfaceInterpretation.communication,
                        conflictResolution: interfaceInterpretation.conflictResolution,
                        adaptability: interfaceInterpretation.adaptability,
                        engineOSInfluence: interfaceInterpretation.engineOSInfluence,
                        trigramEnergies: adjustedEnergies,
                        type: "Interface OS",
                        // 🌟 新機能：全体調和分析の詳細結果
                        harmonyScore: optimalResult.harmonyScore,
                        energyUtilization: optimalResult.energyUtilization,
                        osCompatibility: optimalResult.osCompatibility,
                        detailedAnalysis: optimalResult.detailedAnalysis,
                        alternativeCandidates: optimalResult.alternativeCandidates,
                        improvementRecommendations: optimalResult.improvementRecommendations,
                        balanceType: 'authentic_energy_balance',
                        improvedMethod: true
                    };
                    
                } catch (error) {
                    console.error("❌ Interface OS Analysis Error:", error);
                    return this.getDefaultInterfaceOS();
                }
            }
            
            async analyzeSafeModeOS(scenarioAnswers, engineOS) {
                console.log("🛡️ SafeMode OS Analysis: Defensive Pattern Extraction");
                
                try {
                    // 1. シナリオから防御パターンを抽出
                    const defensivePatterns = this.extractDefensivePatterns(scenarioAnswers);
                    console.log("⚡ Defensive Patterns:", defensivePatterns);
                    
                    // 2. ストレス反応ベクトル構築
                    const stressVector = this.buildStressResponseVector(defensivePatterns);
                    console.log("🌪️ Stress Response Vector:", stressVector);
                    
                    // 3. 防御的三爻エネルギー計算
                    const defensiveTrigramEnergies = this.calculateDefensiveTrigramEnergies(stressVector);
                    console.log("⚔️ Defensive Trigram Energies:", defensiveTrigramEnergies);
                    
                    // 4. Engine OSによる基礎的影響（40%）
                    const adjustedEnergies = this.adjustForCorePersonality(defensiveTrigramEnergies, engineOS);
                    console.log("🔧 Core-Adjusted Energies:", adjustedEnergies);
                    
                    // 5. 🌟 改善：Safe Mode OS全体エネルギーバランス重視の最適選択
                    const authenticEngine = new AuthenticEnergyBalanceEngine();
                    const optimalResult = authenticEngine.selectOptimalHexagramByEnergyBalance(
                        adjustedEnergies, 
                        'Safe Mode OS'
                    );
                    console.log(`🏆 Safe Mode OS Optimal Result:`, optimalResult);
                    
                    // 6. 64卦データ取得
                    const hexagramData = this.getHexagramData(optimalResult.hexagramId);
                    
                    // 7. SafeMode OS専用解釈生成
                    const safeModeInterpretation = this.generateSafeModeInterpretation(
                        optimalResult.hexagramId, optimalResult.upperTrigram, optimalResult.lowerTrigram, defensivePatterns, engineOS
                    );
                    
                    console.log(`🔯 SafeMode OS Result: Hexagram ${optimalResult.hexagramId} (${hexagramData.name_jp})`);
                    
                    return {
                        hexagramId: optimalResult.hexagramId,
                        hexagramName: optimalResult.hexagramName || hexagramData.name_jp,
                        description: safeModeInterpretation.description,
                        catchphrase: hexagramData.catchphrase,
                        primaryDefense: optimalResult.upperTrigram,
                        secondaryDefense: optimalResult.lowerTrigram,
                        defensiveType: safeModeInterpretation.defensiveType,
                        stressResponse: safeModeInterpretation.stressResponse,
                        activationTrigger: safeModeInterpretation.activationTrigger,
                        defensiveStrength: this.calculateDefensiveStrength(defensivePatterns),
                        trigramEnergies: adjustedEnergies,
                        type: "Safe Mode OS",
                        // 🌟 新機能：全体調和分析の詳細結果
                        harmonyScore: optimalResult.harmonyScore,
                        energyUtilization: optimalResult.energyUtilization,
                        osCompatibility: optimalResult.osCompatibility,
                        detailedAnalysis: optimalResult.detailedAnalysis,
                        alternativeCandidates: optimalResult.alternativeCandidates,
                        improvementRecommendations: optimalResult.improvementRecommendations,
                        balanceType: 'authentic_energy_balance',
                        improvedMethod: true
                    };
                    
                } catch (error) {
                    console.error("❌ SafeMode OS Analysis Error:", error);
                    return this.getDefaultSafeModeOS();
                }
            }

            extractDefensivePatterns(scenarioAnswers) {
                const patterns = {
                    leadershipStress: 0,    // Q25: 責任の重圧への防御
                    interpersonalStress: 0, // Q26: 人間関係ストレスへの防御
                    familyStress: 0,        // Q27: 親密関係の負荷への防御
                    emergencyStress: 0,     // Q28: 危機的状況への防御
                    competitionStress: 0,   // Q29: 競争圧力への防御
                    collaborationStress: 0  // Q30: 協調の負担への防御
                };
                
                // 各シナリオ回答から防御的反応パターンを抽出
                scenarioAnswers.forEach((answer, index) => {
                    const questionNum = 25 + index;
                    const stressResponse = this.analyzeStressResponse(answer, questionNum);
                    
                    switch(questionNum) {
                        case 25: patterns.leadershipStress = stressResponse; break;
                        case 26: patterns.interpersonalStress = stressResponse; break;
                        case 27: patterns.familyStress = stressResponse; break;
                        case 28: patterns.emergencyStress = stressResponse; break;
                        case 29: patterns.competitionStress = stressResponse; break;
                        case 30: patterns.collaborationStress = stressResponse; break;
                    }
                });
                
                return patterns;
            }

            analyzeStressResponse(answer, questionNum) {
                // 回答から防御的パターンを数値化
                const responseIntensity = this.calculateResponseIntensity(answer);
                const defensiveType = this.identifyDefensiveType(answer, questionNum);
                
                return {
                    intensity: responseIntensity,
                    type: defensiveType,
                    pattern: this.mapToDefensivePattern(defensiveType)
                };
            }

            calculateResponseIntensity(answer) {
                // 回答の強度を0-1で測定
                if (!answer || !answer.text) return 0.5;
                
                const text = answer.text.toLowerCase();
                const intensityKeywords = {
                    high: ['絶対', '必ず', '完全', '徹底', '断固', '断然', '即座', '緊急'],
                    medium: ['できるだけ', 'なるべく', '努力', '検討', '相談', '調整'],
                    low: ['様子見', '保留', '延期', '回避', '無視', '放置']
                };
                
                let score = 0.5; // baseline
                
                intensityKeywords.high.forEach(keyword => {
                    if (text.includes(keyword)) score += 0.15;
                });
                intensityKeywords.medium.forEach(keyword => {
                    if (text.includes(keyword)) score += 0.05;
                });
                intensityKeywords.low.forEach(keyword => {
                    if (text.includes(keyword)) score -= 0.1;
                });
                
                return Math.max(0, Math.min(1, score));
            }

            identifyDefensiveType(answer, questionNum) {
                if (!answer || !answer.text) return 'neutral';
                
                const text = answer.text.toLowerCase();
                
                // 防御タイプキーワード分析
                const defensiveKeywords = {
                    retreat: ['撤退', '距離', '避ける', '離れる', '退く', '逃げ'],
                    confront: ['対抗', '立ち向かう', '戦う', '挑戦', '反撃', '抵抗'],
                    avoid: ['回避', '巧み', '迂回', '別の道', '柔軟', '適応'],
                    endure: ['耐える', '我慢', '忍ぶ', '持久', '継続', '堅持'],
                    transform: ['変化', '適応', '変容', '調整', '修正', '進化'],
                    boundary: ['境界', '線引き', '制限', '区別', '分離', '防壁'],
                    harmonize: ['調和', '同化', '溶け込む', '協調', '合わせる', '融合'],
                    fortify: ['強化', '固める', '守る', '防御', '安定', '堅固']
                };
                
                let maxScore = 0;
                let dominantType = 'neutral';
                
                Object.entries(defensiveKeywords).forEach(([type, keywords]) => {
                    let score = 0;
                    keywords.forEach(keyword => {
                        if (text.includes(keyword)) score++;
                    });
                    if (score > maxScore) {
                        maxScore = score;
                        dominantType = type;
                    }
                });
                
                return dominantType;
            }

            mapToDefensivePattern(defensiveType) {
                const patternMap = {
                    retreat: '撤退',     // 坤・艮
                    confront: '対抗',    // 乾・震
                    avoid: '回避',       // 巽・兌
                    endure: '耐忍',      // 坎・艮
                    transform: '変容',   // 離・巽
                    boundary: '結界',    // 艮・坤
                    harmonize: '同化',   // 坤・巽
                    fortify: '硬化',     // 乾・艮
                    neutral: '中立'
                };
                
                return patternMap[defensiveType] || '中立';
            }

            buildStressResponseVector(defensivePatterns) {
                // 防御的8次元ベクトル構築
                const vector = {
                    防御_撤退性: 0,    // 坤 - 受動的撤退
                    防御_対抗性: 0,    // 乾 - 積極的対抗
                    防御_回避性: 0,    // 巽 - 柔軟な回避
                    防御_持久性: 0,    // 坎 - 忍耐と持久
                    防御_変容性: 0,    // 離 - 変化と適応
                    防御_境界性: 0,    // 艮 - 境界設定
                    防御_調和性: 0,    // 兌 - 調和的解決
                    防御_堅固性: 0     // 震 - 瞬発的防御
                };
                
                // 各ストレス反応を対応する防御次元にマッピング
                Object.entries(defensivePatterns).forEach(([stressType, response]) => {
                    const intensity = response.intensity || 0;
                    const pattern = response.pattern || '中立';
                    
                    switch(pattern) {
                        case '撤退':
                            vector.防御_撤退性 += intensity * 0.8;
                            vector.防御_調和性 += intensity * 0.3;
                            break;
                        case '対抗':
                            vector.防御_対抗性 += intensity * 0.8;
                            vector.防御_堅固性 += intensity * 0.4;
                            break;
                        case '回避':
                            vector.防御_回避性 += intensity * 0.8;
                            vector.防御_変容性 += intensity * 0.3;
                            break;
                        case '耐忍':
                            vector.防御_持久性 += intensity * 0.8;
                            vector.防御_境界性 += intensity * 0.4;
                            break;
                        case '変容':
                            vector.防御_変容性 += intensity * 0.8;
                            vector.防御_回避性 += intensity * 0.3;
                            break;
                        case '結界':
                            vector.防御_境界性 += intensity * 0.8;
                            vector.防御_持久性 += intensity * 0.3;
                            break;
                        case '同化':
                            vector.防御_調和性 += intensity * 0.8;
                            vector.防御_撤退性 += intensity * 0.3;
                            break;
                        case '硬化':
                            vector.防御_堅固性 += intensity * 0.8;
                            vector.防御_対抗性 += intensity * 0.3;
                            break;
                    }
                });
                
                // 正規化
                const maxValue = Math.max(...Object.values(vector));
                if (maxValue > 0) {
                    Object.keys(vector).forEach(key => {
                        vector[key] = vector[key] / maxValue;
                    });
                }
                
                return vector;
            }

            calculateDefensiveTrigramEnergies(stressVector) {
                // 防御的8次元ベクトルから三爻エネルギーを計算
                return {
                    乾: stressVector.防御_対抗性 * 0.7 + stressVector.防御_堅固性 * 0.3,
                    兌: stressVector.防御_調和性 * 0.8 + stressVector.防御_回避性 * 0.2,
                    離: stressVector.防御_変容性 * 0.8 + stressVector.防御_対抗性 * 0.2,
                    震: stressVector.防御_堅固性 * 0.6 + stressVector.防御_対抗性 * 0.4,
                    巽: stressVector.防御_回避性 * 0.7 + stressVector.防御_変容性 * 0.3,
                    坎: stressVector.防御_持久性 * 0.8 + stressVector.防御_境界性 * 0.2,
                    艮: stressVector.防御_境界性 * 0.7 + stressVector.防御_撤退性 * 0.3,
                    坤: stressVector.防御_撤退性 * 0.7 + stressVector.防御_調和性 * 0.3
                };
            }

            adjustForCorePersonality(defensiveEnergies, engineOS) {
                // Engine OSの基礎人格が防御パターンに40%の影響を与える
                const coreInfluence = 0.4;
                const defensiveBase = 0.6;
                
                if (!engineOS || !engineOS.trigramEnergies) return defensiveEnergies;
                
                const adjusted = {};
                Object.keys(defensiveEnergies).forEach(trigram => {
                    const coreEnergy = engineOS.trigramEnergies[trigram] || 0;
                    const defensiveEnergy = defensiveEnergies[trigram] || 0;
                    
                    adjusted[trigram] = (defensiveEnergy * defensiveBase) + (coreEnergy * coreInfluence);
                });
                
                return adjusted;
            }

            selectDefensiveTrigrams(energies) {
                // エネルギー値でソートして上位2つの三爻を選択
                const sorted = Object.entries(energies)
                    .sort(([,a], [,b]) => b - a);
                
                return [sorted[0][0], sorted[1][0]];
            }

            generateSafeModeInterpretation(hexagramId, primaryDefense, secondaryDefense, patterns, engineOS) {
                // SafeMode OS専用の64卦解釈
                const defensiveInterpretations = this.getSafeModeHexagramInterpretations();
                const interpretation = defensiveInterpretations[hexagramId] || this.getDefaultDefensiveInterpretation();
                
                // パーソナライズされた解釈を生成
                const personalizedDescription = this.personalizeSafeModeDescription(
                    interpretation, primaryDefense, secondaryDefense, patterns, engineOS
                );
                
                return {
                    description: personalizedDescription,
                    catchphrase: interpretation.catchphrase || "困難に立ち向かう防御システム",
                    defensiveType: interpretation.primaryDefense || "総合防御",
                    stressResponse: interpretation.stressResponse || "状況適応型対応",
                    activationTrigger: this.identifyActivationTrigger(patterns)
                };
            }

            getSafeModeHexagramInterpretations() {
                return {
                    1: { // 乾為天
                        name: "天雷無窮型防御",
                        catchphrase: "困難を力で突破する",
                        primaryDefense: "積極的対抗",
                        stressResponse: "正面突破による解決"
            },
                    2: { // 坤為地
                        name: "大地包容型防御",
                        catchphrase: "全てを受け入れ包み込む",
                        primaryDefense: "受容・同化",
                        stressResponse: "環境への完全適応"
            },
                    29: { // 坎為水
                        name: "深淵流水型防御",
                        catchphrase: "困難を流れるように通過する",
                        primaryDefense: "浸透・持続",
                        stressResponse: "障害の本質を理解し迂回"
            },
                    52: { // 艮為山
                        name: "不動要塞型防御",
                        catchphrase: "絶対的な境界を設定する",
                        primaryDefense: "静止・境界",
                        stressResponse: "完全な防御体制構築"
            },
                    58: { // 兌為沢
                        name: "調和交流型防御",
                        catchphrase: "対話で危機を乗り越える",
                        primaryDefense: "協調・交渉",
                        stressResponse: "関係性による問題解決"
            },
                    30: { // 離為火
                        name: "明照変容型防御",
                        catchphrase: "状況を見極め変化する",
                        primaryDefense: "洞察・適応",
                        stressResponse: "状況分析による最適化"
            },
                    51: { // 震為雷
                        name: "電光石火型防御",
                        catchphrase: "瞬時に行動し危機を脱する",
                        primaryDefense: "瞬発・決断",
                        stressResponse: "迅速な状況打開"
            },
                    57: { // 巽為風
                        name: "順風柔軟型防御",
                        catchphrase: "柔軟性で困難を回避する",
                        primaryDefense: "柔軟・回避",
                        stressResponse: "状況に応じた柔軟対応"
            },
                    // 他の卦の解釈も同様に...
                    16: { // 雷地予
                        name: "準備充実型防御",
                        catchphrase: "事前準備で危機を防ぐ",
                        primaryDefense: "予防・準備",
                        stressResponse: "先読みによる危機回避"
            },
                    39: { // 水山蹇
                        name: "困難突破型防御",
                        catchphrase: "困難の中でも前進する",
                        primaryDefense: "忍耐・持続",
                        stressResponse: "困難を乗り越える粘り強さ"
            },
                    3: { // 水雷屯
                        name: "初期混乱対応型防御",
                        catchphrase: "混乱の中で秩序を見つける",
                        primaryDefense: "忍耐・整理",
                        stressResponse: "混乱状況の段階的整理"
            },
                    4: { // 山水蒙
                        name: "学習適応型防御",
                        catchphrase: "無知を認めて学ぶことで守る",
                        primaryDefense: "学習・境界",
                        stressResponse: "知識不足の謙虚な補完"
            },
                    5: { // 水天需
                        name: "機会待機型防御",
                        catchphrase: "適切なタイミングを待つ",
                        primaryDefense: "待機・持続",
                        stressResponse: "焦らず機会を待つ持久戦"
            },
                    6: { // 天水訟
                        name: "正当防衛型防御",
                        catchphrase: "正義を主張して立ち向かう",
                        primaryDefense: "正当性・対抗",
                        stressResponse: "正当な権利の主張と防衛"
            },
                    7: { // 地水師
                        name: "組織戦略型防御",
                        catchphrase: "組織力で困難に対処する",
                        primaryDefense: "統率・持続",
                        stressResponse: "組織的な問題解決"
            },
                    8: { // 水地比
                        name: "協調連帯型防御",
                        catchphrase: "仲間と結束して守る",
                        primaryDefense: "協調・受容",
                        stressResponse: "相互支援による危機対応"
            },
                    9: { // 風天小畜
                        name: "小規模蓄積型防御",
                        catchphrase: "小さな準備で大きな危機に備える",
                        primaryDefense: "準備・柔軟",
                        stressResponse: "段階的な準備と適応"
            },
                    10: { // 天沢履
                        name: "慎重歩行型防御",
                        catchphrase: "危険を承知で慎重に進む",
                        primaryDefense: "慎重・対抗",
                        stressResponse: "リスク認識と慎重な行動"
            },
                    11: { // 地天泰
                        name: "調和安定型防御",
                        catchphrase: "平和と調和を維持する",
                        primaryDefense: "安定・受容",
                        stressResponse: "バランスの取れた対応"
            },
                    12: { // 天地否
                        name: "閉塞突破型防御",
                        catchphrase: "閉塞状況を打破する",
                        primaryDefense: "突破・対抗",
                        stressResponse: "現状打破による活路開拓"
            },
                    13: { // 天火同人
                        name: "同志結集型防御",
                        catchphrase: "志を同じくする人と結束する",
                        primaryDefense: "結束・洞察",
                        stressResponse: "理念による団結と対応"
            },
                    14: { // 火天大有
                        name: "豊富資源型防御",
                        catchphrase: "豊富な資源で危機を乗り越える",
                        primaryDefense: "豊穣・洞察",
                        stressResponse: "資源を活用した包括的対応"
            },
                    15: { // 地山謙
                        name: "謙遜回避型防御",
                        catchphrase: "謙遜することで危機を避ける",
                        primaryDefense: "謙虚・境界",
                        stressResponse: "低姿勢による摩擦回避"
            },
                    17: { // 沢雷随
                        name: "柔軟追従型防御",
                        catchphrase: "状況に従って柔軟に対応する",
                        primaryDefense: "追従・調和",
                        stressResponse: "環境変化への柔軟な適応"
            },
                    18: { // 山風蠱
                        name: "問題修復型防御",
                        catchphrase: "腐敗を正して健全化する",
                        primaryDefense: "修復・境界",
                        stressResponse: "根本的な問題解決"
            },
                    19: { // 地沢臨
                        name: "接近監視型防御",
                        catchphrase: "近づいて問題を監視する",
                        primaryDefense: "接近・調和",
                        stressResponse: "積極的な関与による解決"
            },
                    20: { // 風地観
                        name: "観察洞察型防御",
                        catchphrase: "高い視点から状況を俯瞰する",
                        primaryDefense: "観察・柔軟",
                        stressResponse: "客観的分析による対策立案"
            },
                    21: { // 火雷噬嗑
                        name: "障害除去型防御",
                        catchphrase: "障害を噛み砕いて除去する",
                        primaryDefense: "除去・洞察",
                        stressResponse: "問題の核心への直接的対処"
            },
                    22: { // 山火賁
                        name: "装飾隠蔽型防御",
                        catchphrase: "美しく装って本質を隠す",
                        primaryDefense: "装飾・境界",
                        stressResponse: "外見を整えた防御戦略"
            },
                    23: { // 山地剥
                        name: "剥離最小化型防御",
                        catchphrase: "失うものを最小限に抑える",
                        primaryDefense: "保全・境界",
                        stressResponse: "損失最小化戦略"
            },
                    24: { // 地雷復
                        name: "復元回復型防御",
                        catchphrase: "元の状態に戻すことで安定を図る",
                        primaryDefense: "復元・受容",
                        stressResponse: "原点回帰による安定化"
            },
                    25: { // 天雷无妄
                        name: "純真無垢型防御",
                        catchphrase: "純粋な心で災いを避ける",
                        primaryDefense: "純真・対抗",
                        stressResponse: "誠実さによる自然な解決"
            },
                    26: { // 山天大畜
                        name: "大規模蓄積型防御",
                        catchphrase: "大きな力を蓄えて危機に備える",
                        primaryDefense: "蓄積・境界",
                        stressResponse: "長期的な準備による万全な対応"
            },
                    27: { // 山雷頤
                        name: "栄養補給型防御",
                        catchphrase: "適切な栄養で体力を維持する",
                        primaryDefense: "養育・境界",
                        stressResponse: "基礎体力の維持と強化"
            },
                    28: { // 沢風大過
                        name: "過大負荷耐久型防御",
                        catchphrase: "限界を超えた負荷に耐える",
                        primaryDefense: "耐久・調和",
                        stressResponse: "極限状況での持久戦"
            },
                    31: { // 沢山咸
                        name: "感応共鳴型防御",
                        catchphrase: "相手と感応して調和する",
                        primaryDefense: "感応・調和",
                        stressResponse: "相互理解による問題解決"
            },
                    32: { // 雷風恒
                        name: "持続継続型防御",
                        catchphrase: "変わらぬ姿勢で持続する",
                        primaryDefense: "持続・柔軟",
                        stressResponse: "一貫した方針による安定対応"
            },
                    33: { // 天山遯
                        name: "戦略的撤退型防御",
                        catchphrase: "適切なタイミングで退く",
                        primaryDefense: "撤退・対抗",
                        stressResponse: "戦略的な後退による立て直し"
            },
                    34: { // 雷天大壮
                        name: "強大力量型防御",
                        catchphrase: "強大な力で正面突破する",
                        primaryDefense: "強力・対抗",
                        stressResponse: "圧倒的な力による問題解決"
            },
                    35: { // 火地晋
                        name: "前進発展型防御",
                        catchphrase: "前進することで危機を脱する",
                        primaryDefense: "前進・洞察",
                        stressResponse: "積極的な攻勢による局面打開"
            },
                    36: { // 地火明夷
                        name: "潜伏隠遁型防御",
                        catchphrase: "光を隠して危険をやり過ごす",
                        primaryDefense: "隠遁・受容",
                        stressResponse: "目立たないことによる安全確保"
            },
                    37: { // 風火家人
                        name: "家族結束型防御",
                        catchphrase: "家族の絆で危機を乗り越える",
                        primaryDefense: "結束・柔軟",
                        stressResponse: "身内との強固な連帯"
            },
                    38: { // 火沢睽
                        name: "対立調和型防御",
                        catchphrase: "対立しながらも調和を保つ",
                        primaryDefense: "調和・洞察",
                        stressResponse: "違いを認めた上での協力"
            },
                    40: { // 雷水解
                        name: "解放開放型防御",
                        catchphrase: "束縛を解いて自由を取り戻す",
                        primaryDefense: "解放・迅速",
                        stressResponse: "制約からの脱却による問題解決"
            },
                    41: { // 山沢損
                        name: "適切削減型防御",
                        catchphrase: "無駄を削ってスリム化する",
                        primaryDefense: "削減・境界",
                        stressResponse: "効率化による体質強化"
            },
                    42: { // 風雷益
                        name: "相互利益型防御",
                        catchphrase: "みんなの利益で問題を解決する",
                        primaryDefense: "利益・柔軟",
                        stressResponse: "win-winの関係構築"
            },
                    43: { // 沢天夬
                        name: "決断実行型防御",
                        catchphrase: "断固とした決断で危機を断つ",
                        primaryDefense: "決断・調和",
                        stressResponse: "明確な判断による迅速な対処"
            },
                    44: { // 天風姤
                        name: "偶然遭遇型防御",
                        catchphrase: "予期せぬ出会いを活用する",
                        primaryDefense: "機会・対抗",
                        stressResponse: "偶然の機会を最大限活用"
            },
                    45: { // 沢地萃
                        name: "集結統合型防御",
                        catchphrase: "みんなで集まって力を合わせる",
                        primaryDefense: "統合・調和",
                        stressResponse: "集団の力による問題解決"
            },
                    46: { // 地風升
                        name: "段階成長型防御",
                        catchphrase: "段階を追って成長し強化する",
                        primaryDefense: "成長・受容",
                        stressResponse: "継続的な改善による体質強化"
            },
                    47: { // 沢水困
                        name: "困窮忍耐型防御",
                        catchphrase: "困った時こそ耐え忍ぶ",
                        primaryDefense: "忍耐・調和",
                        stressResponse: "苦境での精神力による持久戦"
            },
                    48: { // 水風井
                        name: "安定供給型防御",
                        catchphrase: "変わらぬ価値を提供し続ける",
                        primaryDefense: "安定・持続",
                        stressResponse: "信頼できる基盤の維持"
            },
                    49: { // 沢火革
                        name: "変革刷新型防御",
                        catchphrase: "根本から変えて新しくする",
                        primaryDefense: "変革・調和",
                        stressResponse: "抜本的な改革による問題解決"
            },
                    50: { // 火風鼎
                        name: "安定統治型防御",
                        catchphrase: "新しい秩序で安定を図る",
                        primaryDefense: "統治・洞察",
                        stressResponse: "新体制による安定化"
            },
                    53: { // 風山漸
                        name: "漸進発展型防御",
                        catchphrase: "少しずつ着実に進歩する",
                        primaryDefense: "漸進・柔軟",
                        stressResponse: "段階的な改善による安定成長"
            },
                    54: { // 雷沢帰妹
                        name: "適応順応型防御",
                        catchphrase: "与えられた役割に順応する",
                        primaryDefense: "順応・迅速",
                        stressResponse: "環境に合わせた柔軟な適応"
            },
                    55: { // 雷火豊
                        name: "豊穣充実型防御",
                        catchphrase: "豊かさの中でバランスを保つ",
                        primaryDefense: "豊穣・迅速",
                        stressResponse: "余裕のある状況での適切な判断"
            },
                    56: { // 火山旅
                        name: "旅行適応型防御",
                        catchphrase: "慣れない環境に適応する",
                        primaryDefense: "適応・洞察",
                        stressResponse: "変化への柔軟な対応"
            },
                    59: { // 風水渙
                        name: "分散緩和型防御",
                        catchphrase: "固まったものを分散して和らげる",
                        primaryDefense: "分散・柔軟",
                        stressResponse: "緊張の緩和による問題解決"
            },
                    60: { // 水沢節
                        name: "節制限定型防御",
                        catchphrase: "適切な節度で安定を保つ",
                        primaryDefense: "節制・持続",
                        stressResponse: "バランスの取れた制限による安定"
            },
                    61: { // 風沢中孚
                        name: "誠実信頼型防御",
                        catchphrase: "誠実さで信頼を築き守る",
                        primaryDefense: "誠実・柔軟",
                        stressResponse: "信頼関係による問題解決"
            },
                    62: { // 雷山小過
                        name: "小規模超越型防御",
                        catchphrase: "小さな努力で大きな効果を得る",
                        primaryDefense: "効率・迅速",
                        stressResponse: "小さな工夫による効果的対応"
            },
                    63: { // 水火既済
                        name: "完成維持型防御",
                        catchphrase: "完成した状態を維持する",
                        primaryDefense: "維持・持続",
                        stressResponse: "現状維持による安定確保"
            },
                    64: { // 火水未済
                        name: "未完成発展型防御",
                        catchphrase: "未完成だからこそ可能性がある",
                        primaryDefense: "発展・洞察",
                        stressResponse: "改善の余地を活用した成長"
                    }
                };
            }

            getDefaultDefensiveInterpretation() {
                return {
                    name: "総合適応型防御",
                    catchphrase: "状況に応じて最適な防御を選択する",
                    primaryDefense: "適応・調整",
                    stressResponse: "バランス型危機対応"
                };
            }

            personalizeSafeModeDescription(interpretation, primary, secondary, patterns, engineOS) {
                const stressLevel = this.calculateOverallStressLevel(patterns);
                const primaryStrength = this.getTrigramStrength(primary, patterns);
                const secondaryStrength = this.getTrigramStrength(secondary, patterns);
                
                let description = `${interpretation.name}: ${interpretation.primaryDefense}を主軸とした防御システム。`;
                
                if (stressLevel > 0.7) {
                    description += "高ストレス環境下で強力に発動し、";
                } else if (stressLevel > 0.4) {
                    description += "中程度のストレス状況で適切に作動し、";
                } else {
                    description += "軽微なストレス状況でも予防的に機能し、";
            }
                
                description += `${primary}の${this.getTrigramDefensiveCharacter(primary)}と${secondary}の${this.getTrigramDefensiveCharacter(secondary)}を組み合わせて対応する。`;
                
                return description;
            }

            getTrigramDefensiveCharacter(trigram) {
                const characters = {
                    乾: "強力な対抗力",
                    兌: "調和的解決力",
                    離: "状況洞察力",
                    震: "迅速な行動力",
                    巽: "柔軟な適応力",
                    坎: "持続的忍耐力",
                    艮: "堅固な境界力",
                    坤: "包容的受容力"
                };
                return characters[trigram] || "総合的防御力";
            }

            identifyActivationTrigger(patterns) {
                const triggers = [];
                
                Object.entries(patterns).forEach(([type, response]) => {
                    if (response.intensity > 0.6) {
                        switch(type) {
                            case 'leadershipStress': triggers.push('責任の重圧'); break;
                            case 'interpersonalStress': triggers.push('人間関係の摩擦'); break;
                            case 'familyStress': triggers.push('親密関係の負荷'); break;
                            case 'emergencyStress': triggers.push('緊急事態'); break;
                            case 'competitionStress': triggers.push('競争環境'); break;
                            case 'collaborationStress': triggers.push('協調の負担'); break;
                        }
                    }
                });
                
                return triggers.length > 0 ? triggers.join('、') : '一般的なストレス状況';
            }

            calculateDefensiveStrength(patterns) {
                const intensities = Object.values(patterns).map(p => p.intensity || 0);
                if (intensities.length === 0) return 0;
                return intensities.reduce((sum, intensity) => sum + intensity, 0) / intensities.length;
            }

            calculateOverallStressLevel(patterns) {
                return this.calculateDefensiveStrength(patterns);
            }

            getTrigramStrength(trigram, patterns) {
                // 三爻の防御パターンでの強度を計算
                const trigramPatternMap = {
                    乾: ['対抗', '硬化'],
                    兌: ['調和', '回避'],
                    離: ['変容', '対抗'],
                    震: ['硬化', '対抗'],
                    巽: ['回避', '変容'],
                    坎: ['耐忍', '結界'],
                    艮: ['結界', '撤退'],
                    坤: ['撤退', '同化']
                };
                
                const relevantPatterns = trigramPatternMap[trigram] || [];
                let strength = 0;
                let count = 0;
                
                Object.values(patterns).forEach(response => {
                    if (relevantPatterns.includes(response.pattern)) {
                        strength += response.intensity;
                        count++;
                    }
                });
                
                return count > 0 ? strength / count : 0.5;
            }

            getDefaultSafeModeOS() {
                return {
                    hexagramId: 39, // 水山蹇 - 困難を乗り越える
                    hexagramName: "水山蹇",
                    description: "困難な状況でも粘り強く前進する防御システム",
                    catchphrase: "困難を乗り越える不屈の精神",
                    primaryDefense: "坎",
                    secondaryDefense: "艮",
                    defensiveType: "困難突破型",
                    stressResponse: "忍耐と境界設定による持久戦",
                    activationTrigger: "困難な状況全般",
                    defensiveStrength: 0.6,
                    trigramEnergies: { 乾: 0.3, 兌: 0.2, 離: 0.2, 震: 0.3, 巽: 0.2, 坎: 0.7, 艮: 0.6, 坤: 0.4 },
                    type: "Safe Mode OS"
                };
            }

            /**
             * Interface OS分析の補助メソッド群
             */
             
            // 1. シナリオ質問（Q25-Q30）から社会的パターンを分析
            analyzeSocialPatterns(scenarioAnswers) {
                const patterns = {
                    Q25_leadership: 0,      // リーダーシップ状況対応
                    Q26_interpersonal: 0,   // 対人関係困難への対処
                    Q27_family: 0,          // 家族・親密関係の処理
                    Q28_emergency: 0,       // 緊急事態・危機管理
                    Q29_competition: 0,     // 競争・争いへの対応
                    Q30_community: 0        // 共同体・協力関係構築
                };
                
                // シナリオ回答から社会的パターンスコア計算
                scenarioAnswers.forEach((answer, index) => {
                    const questionId = `Q${25 + index}`;
                    const scoreValue = this.calculateScenarioScore(answer, questionId);
                    
                    switch (questionId) {
                        case 'Q25': patterns.Q25_leadership = scoreValue; break;
                        case 'Q26': patterns.Q26_interpersonal = scoreValue; break;
                        case 'Q27': patterns.Q27_family = scoreValue; break;
                        case 'Q28': patterns.Q28_emergency = scoreValue; break;
                        case 'Q29': patterns.Q29_competition = scoreValue; break;
                        case 'Q30': patterns.Q30_community = scoreValue; break;
                    }
                });
                
                return patterns;
            }
            
            // 2. Interface OS専用の8次元ベクトル構築
            buildInterfaceVector(socialPatterns) {
                const vector = {
                    "外向_主導性": 0,    // 乾 - リーダーシップ・主導
                    "外向_調和性": 0,    // 兌 - 社交・コミュニケーション
                    "外向_表現性": 0,    // 離 - プレゼンテーション・魅力
                    "外向_行動性": 0,    // 震 - 即応性・アクション
                    "内向_適応性": 0,    // 巽 - 順応・協調
                    "内向_分析性": 0,    // 坎 - 観察・洞察
                    "内向_安定性": 0,    // 艮 - 一貫性・信頼性
                    "内向_支援性": 0     // 坤 - サポート・貢献
                };
                
                // Q25-Q30の社会的パターンを8次元にマッピング
                vector["外向_主導性"] = (socialPatterns.Q25_leadership * 0.5) + (socialPatterns.Q28_emergency * 0.3);
                vector["外向_調和性"] = (socialPatterns.Q26_interpersonal * 0.4) + (socialPatterns.Q30_community * 0.4);
                vector["外向_表現性"] = (socialPatterns.Q25_leadership * 0.3) + (socialPatterns.Q26_interpersonal * 0.3);
                vector["外向_行動性"] = (socialPatterns.Q28_emergency * 0.4) + (socialPatterns.Q29_competition * 0.4);
                
                vector["内向_適応性"] = (socialPatterns.Q26_interpersonal * 0.3) + (socialPatterns.Q27_family * 0.4);
                vector["内向_分析性"] = (socialPatterns.Q28_emergency * 0.3) + (socialPatterns.Q29_competition * 0.3);
                vector["内向_安定性"] = (socialPatterns.Q27_family * 0.4) + (socialPatterns.Q30_community * 0.3);
                vector["内向_支援性"] = (socialPatterns.Q27_family * 0.3) + (socialPatterns.Q30_community * 0.3);
                
                // 正規化（0-1範囲）
                Object.keys(vector).forEach(key => {
                    vector[key] = Math.max(0, Math.min(1, vector[key]));
                });
                
                return vector;
            }
            
            // 3. 社会的三爻エネルギー計算
            calculateSocialTrigramEnergies(interfaceVector) {
                return {
                    "乾": interfaceVector["外向_主導性"] * 1.0,
                    "兌": interfaceVector["外向_調和性"] * 1.0,
                    "離": interfaceVector["外向_表現性"] * 1.0,
                    "震": interfaceVector["外向_行動性"] * 1.0,
                    "巽": interfaceVector["内向_適応性"] * 1.0,
                    "坎": interfaceVector["内向_分析性"] * 1.0,
                    "艮": interfaceVector["内向_安定性"] * 1.0,
                    "坤": interfaceVector["内向_支援性"] * 1.0
                };
            }
            
            // 4. Engine OSとの相互作用補正
            adjustForEngineOS(socialEnergies, engineOS) {
                const adjustedEnergies = { ...socialEnergies };
                const engineInfluence = 0.25; // 25%の影響度
                
                if (!engineOS || !engineOS.upperTrigram || !engineOS.lowerTrigram) {
                    return adjustedEnergies;
                }
                
                // Engine OSの主要三爻が社会的表現に与える影響
                const enginePrimary = engineOS.upperTrigram;
                
                // 内向的Engine OSは外向的Interface OSを抑制
                if (["坤", "艮", "坎", "巽"].includes(enginePrimary)) {
                    adjustedEnergies["乾"] *= (1 - engineInfluence * 0.8);
                    adjustedEnergies["離"] *= (1 - engineInfluence * 0.6);
                    adjustedEnergies["震"] *= (1 - engineInfluence * 0.7);
                    adjustedEnergies["兌"] *= (1 - engineInfluence * 0.4);
                }
                
                // 外向的Engine OSは外向的Interface OSを強化
                if (["乾", "兌", "離", "震"].includes(enginePrimary)) {
                    adjustedEnergies["乾"] *= (1 + engineInfluence * 0.6);
                    adjustedEnergies["離"] *= (1 + engineInfluence * 0.5);
                    adjustedEnergies["震"] *= (1 + engineInfluence * 0.5);
                    adjustedEnergies["兌"] *= (1 + engineInfluence * 0.7);
                }
                
                // 特定のEngine OS組み合わせ補正
                if (enginePrimary === "坤") { // 受容的Engine OS
                    adjustedEnergies["坤"] *= (1 + engineInfluence * 1.2);
                    adjustedEnergies["巽"] *= (1 + engineInfluence * 0.8);
                }
                
                if (enginePrimary === "乾") { // 創造的Engine OS
                    adjustedEnergies["乾"] *= (1 + engineInfluence * 1.0);
                    adjustedEnergies["震"] *= (1 + engineInfluence * 0.7);
                }
                
                return adjustedEnergies;
            }
            
            // 5. Interface OS用の最適三爻選択
            selectInterfaceTrigrams(adjustedEnergies) {
                // 社会的表現では外卦（上卦）を重視
                const sortedTrigrams = Object.entries(adjustedEnergies)
                    .sort(([, a], [, b]) => b - a);
                
                const upperTrigram = sortedTrigrams[0][0];
                const lowerTrigram = sortedTrigrams[1][0];
                
                // 社会的相互作用の妥当性チェック
                if (this.isValidSocialCombination(upperTrigram, lowerTrigram)) {
                    return { upperTrigram, lowerTrigram };
                } else {
                    // 無効な組み合わせの場合、調整
                    return this.adjustSocialCombination(sortedTrigrams);
                }
            }
            
            // 6. Interface OS専用解釈生成
            generateInterfaceInterpretation(hexagramId, upperTrigram, lowerTrigram, socialPatterns, engineOS) {
                const baseInterpretation = this.getInterfaceHexagramInterpretation(hexagramId);
                
                return {
                    description: baseInterpretation.description,
                    leadership: this.analyzeLeadershipStyle(upperTrigram, socialPatterns),
                    communication: this.analyzeCommunicationStyle(upperTrigram, lowerTrigram, socialPatterns),
                    conflictResolution: this.analyzeConflictStyle(lowerTrigram, socialPatterns),
                    adaptability: this.analyzeAdaptability(upperTrigram, lowerTrigram, socialPatterns),
                    engineOSInfluence: this.analyzeEngineInfluence(engineOS, upperTrigram, lowerTrigram)
                };
            }
            // 7. 社会的スタイル判定
            determineSocialStyle(socialPatterns) {
                const leadership = socialPatterns.Q25_leadership;
                const interpersonal = socialPatterns.Q26_interpersonal;
                const community = socialPatterns.Q30_community;
                
                if (leadership > 0.7) return "主導型リーダー";
                if (community > 0.7) return "協調型ファシリテーター";
                if (interpersonal > 0.7) return "対人関係重視型";
                if (leadership > 0.5 && community > 0.5) return "バランス型リーダー";
                return "適応型サポーター";
            }
            // 8. デフォルトInterface OS
            getDefaultInterfaceOS() {
                return {
                    hexagramId: 11,
                    hexagramName: "地天泰",
                    upperTrigram: "坤",
                    lowerTrigram: "乾", 
                    socialPatterns: { Q25_leadership: 0.5, Q26_interpersonal: 0.5, Q27_family: 0.5, Q28_emergency: 0.5, Q29_competition: 0.5, Q30_community: 0.5 },
                    interfaceVector: {},
                    socialStyle: "バランス型",
                    description: "調和とバランスを重視するデフォルト社会的人格",
                    leadership: "包容的リーダーシップ",
                    communication: "双方向コミュニケーション",
                    conflictResolution: "仲介・調停型",
                    adaptability: "高い適応力",
                    engineOSInfluence: "安定した相互作用",
                    type: "Interface OS"
                };
            }
            
            /**
             * Interface OS分析の詳細補助メソッド群
             */
             
            // シナリオ回答のスコア計算
            calculateScenarioScore(answer, questionId) {
                // 回答選択肢に基づくスコア計算ロジック
                // A=1.0, B=0.75, C=0.5, D=0.25 の基本スコア
                const baseScore = {
                    'A': 1.0,
                    'B': 0.75, 
                    'C': 0.5,
                    'D': 0.25
                }[answer] || 0.5;
                
                // 質問タイプによる重み調整
                const questionWeights = {
                    'Q25': 1.0, // リーダーシップ
                    'Q26': 0.9, // 対人関係
                    'Q27': 0.8, // 家族
                    'Q28': 1.0, // 緊急事態
                    'Q29': 0.9, // 競争
                    'Q30': 0.8  // 共同体
                };
                
                return baseScore * (questionWeights[questionId] || 1.0);
            }
            // 社会的組み合わせの妥当性チェック
            isValidSocialCombination(upperTrigram, lowerTrigram) {
                // 社会的に不適切な組み合わせを除外
                const invalidCombinations = [
                    // 同じ三爻の重複は避ける
                    [upperTrigram, upperTrigram]
                  ];
                
                return !invalidCombinations.some(([upper, lower]) => 
                    upper === upperTrigram && lower === lowerTrigram
                );
            }
            
            // 社会的組み合わせの調整
            adjustSocialCombination(sortedTrigrams) {
                // 上位3つから適切な組み合わせを選択
                for (let i = 0; i < sortedTrigrams.length - 1; i++) {
                    for (let j = i + 1; j < sortedTrigrams.length; j++) {
                        const upper = sortedTrigrams[i][0];
                        const lower = sortedTrigrams[j][0];
                        
                        if (this.isValidSocialCombination(upper, lower)) {
                            return { upperTrigram: upper, lowerTrigram: lower };
                        }
                    }
                }
                
                // フォールバック：乾-坤 組み合わせ
                return { upperTrigram: "乾", lowerTrigram: "坤" };
            }
            
            // Interface OS専用の64卦解釈データ
            getInterfaceHexagramInterpretation(hexagramId) {
                const interpretations = {
                    // 主要64卦の社会的人格解釈
                    1: { description: "純粋な創造的リーダーシップ - 革新的な社会的影響力", leadership: "創造的", communication: "inspiring" },
                    2: { description: "受容的な支援型人格 - 協調と育成重視", leadership: "支援的", communication: "empathetic" },
                    3: { description: "初期段階の組織者 - 基盤構築重視", leadership: "組織構築型", communication: "foundational" },
                    4: { description: "指導的メンター - 教育と成長促進", leadership: "メンター型", communication: "educational" },
                    5: { description: "戦略的待機者 - タイミングを重視", leadership: "戦略的", communication: "strategic" },
                    6: { description: "慎重な調停者 - 対立回避重視", leadership: "調停型", communication: "diplomatic" },
                    7: { description: "集団指導者 - チーム統率重視", leadership: "集団統率", communication: "commanding" },
                    8: { description: "協力促進者 - 連携と結束重視", leadership: "協力促進", communication: "unifying" },
                    9: { description: "細やかな管理者 - 詳細への配慮", leadership: "管理型", communication: "detailed" },
                    10: { description: "礼儀正しい交渉者 - 品格重視", leadership: "品格重視", communication: "dignified" },
                    11: { description: "調和的リーダー - バランスと統合を重視", leadership: "統合的", communication: "inclusive" },
                    12: { description: "独立的思考者 - 独自の社会的立場", leadership: "独立的", communication: "selective" },
                    13: { description: "同人型協力者 - 共同体意識重視", leadership: "協力的", communication: "collaborative" },
                    14: { description: "大有型成果主義者 - 実績と成果重視", leadership: "成果主義", communication: "results-oriented" },
                    15: { description: "謙虚な実力者 - 控えめながら確実", leadership: "謙虚な実力", communication: "modest" },
                    16: { description: "熱意ある動機付け者 - インスピレーション重視", leadership: "動機付け", communication: "enthusiastic" },
                    17: { description: "追随・適応型 - 状況対応重視", leadership: "追随適応", communication: "responsive" },
                    18: { description: "問題解決者 - 課題改善重視", leadership: "問題解決", communication: "reformative" },
                    19: { description: "親しみやすい接近者 - 人間関係重視", leadership: "親和的", communication: "approachable" },
                    20: { description: "観察・分析型 - 洞察力重視", leadership: "分析観察", communication: "insightful" },
                    21: { description: "公正な裁定者 - 客観性重視", leadership: "公正裁定", communication: "objective" },
                    22: { description: "美的センス重視 - 魅力と装飾", leadership: "美的表現", communication: "aesthetic" },
                    23: { description: "段階的変革者 - 慎重な改革", leadership: "段階変革", communication: "gradual" },
                    24: { description: "復活・再生型 - 立ち直り重視", leadership: "復活再生", communication: "resilient" },
                    25: { description: "自然体・無邪気 - 純粋性重視", leadership: "自然体", communication: "authentic" },
                    26: { description: "蓄積・準備型 - 力の温存重視", leadership: "蓄積準備", communication: "preparative" },
                    27: { description: "養育・支援型 - ケアと成長", leadership: "養育支援", communication: "nurturing" },
                    28: { description: "過大負荷対応 - 重責への挑戦", leadership: "重責対応", communication: "challenging" },
                    29: { description: "困難突破者 - 危険な状況への対処", leadership: "困難突破", communication: "persevering" },
                    30: { description: "明晰な表現者 - 明確性と輝き", leadership: "明晰表現", communication: "illuminating" },
                    31: { description: "感化・影響力 - 相互作用重視", leadership: "相互感化", communication: "influential" },
                    32: { description: "持続・継続型 - 長期的視点", leadership: "持続継続", communication: "enduring" },
                    33: { description: "戦略的撤退者 - 適切な引き際", leadership: "戦略撤退", communication: "tactical" },
                    34: { description: "大きな力の発揮 - 強力なリーダーシップ", leadership: "強力発揮", communication: "powerful" },
                    35: { description: "進歩・発展型 - 前進重視", leadership: "進歩発展", communication: "progressive" },
                    36: { description: "困難時の賢明さ - 逆境での知恵", leadership: "逆境賢明", communication: "wise" },
                    37: { description: "家族・組織運営 - 内部統治重視", leadership: "組織運営", communication: "administrative" },
                    38: { description: "対立・差異調整 - 多様性対応", leadership: "差異調整", communication: "mediating" },
                    39: { description: "障害物対処 - 困難克服重視", leadership: "障害克服", communication: "overcoming" },
                    40: { description: "解放・解決型 - 束縛からの自由", leadership: "解放解決", communication: "liberating" },
                    41: { description: "減少・削減管理 - 無駄の排除", leadership: "効率化", communication: "streamlining" },
                    42: { description: "増益・拡大型 - 成長と発展", leadership: "拡大成長", communication: "expanding" },
                    43: { description: "決断力のあるリーダー - 明確な方向性", leadership: "決断力", communication: "direct" },
                    44: { description: "遭遇・適応型 - 状況対応重視", leadership: "適応的", communication: "flexible" },
                    45: { description: "集合・統合促進 - 団結重視", leadership: "統合促進", communication: "unifying" },
                    46: { description: "上昇・向上型 - 成長志向", leadership: "向上志向", communication: "elevating" },
                    47: { description: "困窮・制約対応 - 限界状況の管理", leadership: "制約管理", communication: "constrained" },
                    48: { description: "深い知恵の井戸 - 知識と経験", leadership: "知恵提供", communication: "knowledgeable" },
                    49: { description: "革新・変革者 - 根本的変化", leadership: "革新変革", communication: "revolutionary" },
                    50: { description: "権威・責任者 - 重要な役割", leadership: "権威責任", communication: "authoritative" },
                    51: { description: "衝撃・動揺対応 - 変化への対処", leadership: "変化対応", communication: "dynamic" },
                    52: { description: "安定・静止維持 - 現状維持重視", leadership: "安定維持", communication: "steady" },
                    53: { description: "段階的発展 - 着実な進歩", leadership: "段階発展", communication: "gradual" },
                    54: { description: "従属・補助役 - サポート重視", leadership: "補助支援", communication: "supportive" },
                    55: { description: "豊かさの頂点 - 最高潮の状態", leadership: "豊富提供", communication: "abundant" },
                    56: { description: "旅行・移動型 - 変化と適応", leadership: "移動適応", communication: "adaptive" },
                    57: { description: "順応・浸透型 - 柔軟な影響力", leadership: "柔軟浸透", communication: "penetrating" },
                    58: { description: "喜悦・楽しさ提供 - ポジティブ影響", leadership: "喜悦提供", communication: "joyful" },
                    59: { description: "分散・拡散対応 - 散漫さへの対処", leadership: "統合集約", communication: "focusing" },
                    60: { description: "節度・制限管理 - バランス重視", leadership: "節度管理", communication: "balanced" },
                    61: { description: "内的真実重視 - 誠実性の表現", leadership: "誠実表現", communication: "sincere" },
                    62: { description: "小さな過度 - 細かな調整", leadership: "微細調整", communication: "precise" },
                    63: { description: "完成・達成型 - 目標達成重視", leadership: "完成達成", communication: "accomplished" },
                    64: { description: "未完成・継続型 - 進行中の状態", leadership: "継続進行", communication: "ongoing" }
                };
                
                return interpretations[hexagramId] || {
                    description: "バランス型社会的人格 - 状況に応じた適応",
                    leadership: "バランス型",
                    communication: "adaptable"
                };
            }
            // リーダーシップスタイル分析
            analyzeLeadershipStyle(upperTrigram, socialPatterns) {
                const styles = {
                    "乾": "創造的リーダーシップ - 革新と変化をもたらす",
                    "兌": "対話型リーダーシップ - コミュニケーションを重視", 
                    "離": "魅力的リーダーシップ - インスピレーションを与える",
                    "震": "行動型リーダーシップ - 迅速な決断と実行",
                    "巽": "協調型リーダーシップ - チームの調和を重視",
                    "坎": "洞察型リーダーシップ - 深い分析に基づく判断",
                    "艮": "安定型リーダーシップ - 一貫性と信頼性",
                    "坤": "支援型リーダーシップ - メンバーの成長を促進"
                };
                
                const baseStyle = styles[upperTrigram] || "バランス型リーダーシップ";
                const leadershipScore = socialPatterns.Q25_leadership || 0.5;
                
                if (leadershipScore > 0.8) {
                    return `強い${baseStyle}`;
                } else if (leadershipScore > 0.6) {
                    return baseStyle;
                } else {
                    return `控えめな${baseStyle}`;
                }
            }
            // コミュニケーションスタイル分析
            analyzeCommunicationStyle(upperTrigram, lowerTrigram, socialPatterns) {
                const upperStyles = {
                    "乾": "直接的",
                    "兌": "親しみやすい",
                    "離": "表現豊か",
                    "震": "エネルギッシュ",
                    "巽": "配慮深い",
                    "坎": "慎重",
                    "艮": "安定した",
                    "坤": "包容的"
                };
                
                const lowerStyles = {
                    "乾": "力強い基盤",
                    "兌": "喜悦の基盤", 
                    "離": "明晰な基盤",
                    "震": "行動の基盤",
                    "巽": "柔軟な基盤",
                    "坎": "深い基盤",
                    "艮": "安定した基盤",
                    "坤": "受容的基盤"
                };
                
                const interpersonalScore = socialPatterns.Q26_interpersonal || 0.5;
                const styleIntensity = interpersonalScore > 0.7 ? "積極的に" : interpersonalScore > 0.4 ? "" : "慎重に";
                
                return `${styleIntensity}${upperStyles[upperTrigram]}なコミュニケーション（${lowerStyles[lowerTrigram]}）`;
            }
            // 対立解決スタイル分析
            analyzeConflictStyle(lowerTrigram, socialPatterns) {
                const styles = {
                    "乾": "積極的解決 - 主導的に問題に取り組む",
                    "兌": "対話重視 - 話し合いによる解決を図る",
                    "離": "明確化重視 - 問題を明らかにして解決",
                    "震": "迅速対応 - 素早い判断で解決",
                    "巽": "穏やか解決 - 段階的で柔軟なアプローチ",
                    "坎": "慎重分析 - 深く分析してから対応",
                    "艮": "冷静対処 - 時間をかけた慎重な解決",
                    "坤": "受容的解決 - 包容力で問題を和らげる"
                };
                
                const competitionScore = socialPatterns.Q29_competition || 0.5;
                const baseStyle = styles[lowerTrigram] || "バランス型解決";
                
                if (competitionScore > 0.7) {
                    return `競争的な${baseStyle}`;
                } else if (competitionScore < 0.3) {
                    return `協調的な${baseStyle}`;
                } else {
                    return baseStyle;
                }
            }
            
            // 適応性分析
            analyzeAdaptability(upperTrigram, lowerTrigram, socialPatterns) {
                const adaptabilityScores = {
                    "乾": 0.6, "兌": 0.8, "離": 0.7, "震": 0.9,
                    "巽": 0.9, "坎": 0.7, "艮": 0.3, "坤": 0.8
                };
                
                const upperScore = adaptabilityScores[upperTrigram] || 0.5;
                const lowerScore = adaptabilityScores[lowerTrigram] || 0.5;
                const avgScore = (upperScore + lowerScore) / 2;
                
                const familyScore = socialPatterns.Q27_family || 0.5;
                const emergencyScore = socialPatterns.Q28_emergency || 0.5;
                const contextScore = (familyScore + emergencyScore) / 2;
                
                const finalScore = (avgScore * 0.7) + (contextScore * 0.3);
                
                if (finalScore > 0.8) return "非常に高い適応力";
                if (finalScore > 0.6) return "高い適応力";
                if (finalScore > 0.4) return "中程度の適応力"; 
                return "限定的な適応力";
            }
            // Engine OSの影響分析
            analyzeEngineInfluence(engineOS, interfaceUpper, interfaceLower) {
                if (!engineOS || !engineOS.upperTrigram) {
                    return "Engine OS情報不足により影響不明";
                }
                
                const engineUpper = engineOS.upperTrigram;
                const compatibility = this.calculateTrigramCompatibility(engineUpper, interfaceUpper);
                
                if (compatibility > 0.7) {
                    return `Engine OS（${engineUpper}）との高い親和性 - 一貫した人格表現`;
                } else if (compatibility > 0.4) {
                    return `Engine OS（${engineUpper}）との適度な親和性 - バランス取れた表現`;
                } else {
                    return `Engine OS（${engineUpper}）との補完関係 - 内外のコントラスト`;
                }
            }
            
            // 64卦ペア間の深層シナジー計算
            calculate64HexagramSynergy(hexagramId1, hexagramId2) {
                // H384データベースから卦の特性を取得
                const hex1Data = this.getHexagramData(hexagramId1);
                const hex2Data = this.getHexagramData(hexagramId2);
                
                if (!hex1Data || !hex2Data) return 0.5;
                
                // 多次元シナジー分析
                const keywordSynergy = this.calculateKeywordSynergy(hex1Data, hex2Data);
                const energySynergy = this.calculateEnergySynergy(hex1Data, hex2Data);
                const elementalSynergy = this.calculateElementalSynergy(hex1Data, hex2Data);
                const philosophicalSynergy = this.calculatePhilosophicalSynergy(hex1Data, hex2Data);
                
                // 重み付き総合シナジー
                return (keywordSynergy * 0.3 + energySynergy * 0.25 + 
                       elementalSynergy * 0.25 + philosophicalSynergy * 0.2);
            }
            
            // 🎯 2025/08/10 RENEWED: キーワード類似度シナジー計算 - 完全実装
            // H384データベース統合 & セマンティック類似度アルゴリズム
            calculateKeywordSynergy(hex1Data, hex2Data) {
                try {
                    // 基本キーワード取得
                    const keywords1 = hex1Data.keywords ? hex1Data.keywords.split(',').map(k => k.trim()) : [];
                    const keywords2 = hex2Data.keywords ? hex2Data.keywords.split(',').map(k => k.trim()) : [];
                    
                    // H384データからキーワード拡張
                    const h384Data1 = this.getH384DataByHexagram(hex1Data.hexagram_id);
                    const h384Data2 = this.getH384DataByHexagram(hex2Data.hexagram_id);
                    
                    const extendedKeywords1 = new Set(keywords1);
                    const extendedKeywords2 = new Set(keywords2);
                    
                    // H384データからキーワードを抽出
                    if (h384Data1) {
                        h384Data1.forEach(item => {
                            if (item.キーワード && Array.isArray(item.キーワード)) {
                                item.キーワード.forEach(keyword => extendedKeywords1.add(keyword));
                            }
                        });
                    }
                    if (h384Data2) {
                        h384Data2.forEach(item => {
                            if (item.キーワード && Array.isArray(item.キーワード)) {
                                item.キーワード.forEach(keyword => extendedKeywords2.add(keyword));
                            }
                        });
                    }
                    
                    // Jaccard類似度計算
                    const intersection = new Set([...extendedKeywords1].filter(k => extendedKeywords2.has(k)));
                    const union = new Set([...extendedKeywords1, ...extendedKeywords2]);
                    
                    if (union.size === 0) return 0.5;
                    
                    const jaccard = intersection.size / union.size;
                    
                    // 語義的類似度補正
                    const semanticBonus = this.calculateSemanticSimilarity(extendedKeywords1, extendedKeywords2);
                    
                    return Math.min(1.0, jaccard + semanticBonus * 0.3);
                } catch (error) {
                    console.warn('Keyword synergy calculation error:', error);
                    return 0.5;
                }
            }
            
            // エネルギー相性計算
            // 🔋 2025/08/10 RENEWED: エネルギーシナジー計算 - 革新的実装
            // Yin-Yang balance + Trigram energy correlation algorithm
            calculateEnergySynergy(hex1Data, hex2Data) {
                try {
                    // H384データから各卦のエネルギー特性取得
                    const h384Data1 = this.getH384DataByHexagram(hex1Data.hexagram_id);
                    const h384Data2 = this.getH384DataByHexagram(hex2Data.hexagram_id);
                    
                    if (!h384Data1 || !h384Data2) return 0.5;
                    
                    // エネルギー指標の平均値計算
                    const energy1 = this.calculateHexagramEnergyProfile(h384Data1);
                    const energy2 = this.calculateHexagramEnergyProfile(h384Data2);
                    
                    // エネルギープロファイル相関計算
                    const correlation = this.calculateEnergyCorrelation(energy1, energy2);
                    
                    // 陰陽バランス相性
                    const yinYangSynergy = this.calculateYinYangSynergy(hex1Data, hex2Data);
                    
                    // トリグラム相性
                    const trigramSynergy = this.calculateTrigramEnergySynergy(hex1Data, hex2Data);
                    
                    // 総合エネルギー相性
                    return (correlation * 0.4 + yinYangSynergy * 0.3 + trigramSynergy * 0.3);
                } catch (error) {
                    console.warn('Energy synergy calculation error:', error);
                    return 0.5;
                }
            }
            
            // 五行相性計算
            // 🌟 2025/08/10 RENEWED: 五行エレメント相性計算 - 古典統合
            // Wu Xing (五行) compatibility with seasonal/directional enhancement
            calculateElementalSynergy(hex1Data, hex2Data) {
                try {
                    // 各卦の五行属性取得
                    const element1 = this.getHexagramElement(hex1Data);
                    const element2 = this.getHexagramElement(hex2Data);
                    
                    // 五行相性マトリックス
                    const elementalMatrix = {
                        '木': { '木': 0.7, '火': 0.9, '土': 0.2, '金': 0.1, '水': 0.8 },
                        '火': { '木': 0.8, '火': 0.7, '土': 0.9, '金': 0.1, '水': 0.2 },
                        '土': { '木': 0.1, '火': 0.8, '土': 0.7, '金': 0.9, '水': 0.2 },
                        '金': { '木': 0.2, '火': 0.1, '土': 0.8, '金': 0.7, '水': 0.9 },
                        '水': { '木': 0.9, '火': 0.2, '土': 0.1, '金': 0.8, '水': 0.7 }
                    };
                    
                    // 基本五行相性
                    const basicSynergy = elementalMatrix[element1] ? 
                        (elementalMatrix[element1][element2] || 0.5) : 0.5;
                    
                    // トリグラム五行補正
                    const trigramElementSynergy = this.calculateTrigramElementSynergy(hex1Data, hex2Data);
                    
                    // 季節・方位相性
                    const seasonDirectionSynergy = this.calculateSeasonDirectionSynergy(element1, element2);
                    
                    // 総合五行相性
                    return (basicSynergy * 0.5 + trigramElementSynergy * 0.3 + seasonDirectionSynergy * 0.2);
                } catch (error) {
                    console.warn('Elemental synergy calculation error:', error);
                    return 0.5;
                }
            }
            
            // 哲学的親和性計算
            // 🧠 2025/08/10 RENEWED: 哲学的親和性計算 - 深層分析
            // Stance analysis + interpretation sentiment + growth pattern compatibility  
            calculatePhilosophicalSynergy(hex1Data, hex2Data) {
                try {
                    // H384データから哲学的特性抽出
                    const h384Data1 = this.getH384DataByHexagram(hex1Data.hexagram_id);
                    const h384Data2 = this.getH384DataByHexagram(hex2Data.hexagram_id);
                    
                    if (!h384Data1 || !h384Data2) return 0.5;
                    
                    // 主体性推奨スタンス相性
                    const stanceSynergy = this.calculateStanceSynergy(h384Data1, h384Data2);
                    
                    // 価値観・解釈の親和性
                    const interpretationSynergy = this.calculateInterpretationSynergy(h384Data1, h384Data2);
                    
                    // 成長パターン相性
                    const growthPatternSynergy = this.calculateGrowthPatternSynergy(h384Data1, h384Data2);
                    
                    // 人生哲学相性（八卦の組み合わせから）
                    const lifePhilosophySynergy = this.calculateLifePhilosophySynergy(hex1Data, hex2Data);
                    
                    // 総合哲学的親和性
                    return (stanceSynergy * 0.3 + interpretationSynergy * 0.25 + 
                           growthPatternSynergy * 0.25 + lifePhilosophySynergy * 0.2);
                } catch (error) {
                    console.warn('Philosophical synergy calculation error:', error);
                    return 0.5;
                }
            }
            
            // === シナジー計算サポート関数群 ===
            
            // H384データから特定卦のデータを取得
            getH384DataByHexagram(hexagramId) {
                try {
                    const h384Data = window.H384_DATA || [];
                    return h384Data.filter(item => item.卦番号 === hexagramId);
                } catch (error) {
                    console.warn('H384 data access error:', error);
                    return [];
                }
            }
            
            // 語義的類似度計算
            calculateSemanticSimilarity(keywords1, keywords2) {
                const synonymGroups = [
                    ['リーダー', 'リーダーシップ', '指導', '統率'],
                    ['創造', '創出', '生成', '発想'],
                    ['協力', '連携', '協調', '共同'],
                    ['安定', '平穏', '安泰', '確実'],
                    ['変化', '変動', '転換', '革新'],
                    ['成長', '発展', '向上', '進歩'],
                    ['危険', 'リスク', '警戒', '注意'],
                    ['吉', '幸運', '成功', '良好'],
                    ['凶', '不運', '失敗', '困難']
                ];
                
                let semanticMatches = 0;
                let totalComparisons = 0;
                
                for (const word1 of keywords1) {
                    for (const word2 of keywords2) {
                        totalComparisons++;
                        for (const group of synonymGroups) {
                            if (group.includes(word1) && group.includes(word2)) {
                                semanticMatches++;
                                break;
                            }
                        }
                    }
                }
                
                return totalComparisons > 0 ? semanticMatches / totalComparisons : 0;
            }
            
            // 卦のエネルギープロファイル計算
            calculateHexagramEnergyProfile(h384Data) {
                const profile = {
                    potential: 0,
                    stability: 0,
                    risk: 0,
                    activity: 0,
                    variability: 0,
                    overall: 0
                };
                
                if (!h384Data || h384Data.length === 0) return profile;
                
                h384Data.forEach(item => {
                    if (typeof item.S2_ポテンシャル === 'number') profile.potential += item.S2_ポテンシャル;
                    if (typeof item.S3_安定性スコア === 'number') profile.stability += item.S3_安定性スコア;
                    if (typeof item.S4_リスク === 'number') profile.risk += Math.abs(item.S4_リスク);
                    if (typeof item.S6_変動性スコア === 'number') profile.variability += item.S6_変動性スコア;
                    if (typeof item.S7_総合評価スコア === 'number') profile.overall += item.S7_総合評価スコア;
                });
                
                const count = h384Data.length;
                profile.potential /= count;
                profile.stability /= count;
                profile.risk /= count;
                profile.variability /= count;
                profile.overall /= count;
                profile.activity = (profile.potential + (100 - profile.stability)) / 2;
                
                return profile;
            }
            
            // エネルギープロファイル相関計算
            calculateEnergyCorrelation(energy1, energy2) {
                const keys = ['potential', 'stability', 'risk', 'activity', 'variability'];
                let correlation = 0;
                
                for (const key of keys) {
                    const diff = Math.abs(energy1[key] - energy2[key]);
                    correlation += (100 - diff) / 100;
                }
                
                return correlation / keys.length;
            }
            
            // 陰陽バランスシナジー計算
            calculateYinYangSynergy(hex1Data, hex2Data) {
                // 卦の陰陽構成から調和度を計算
                const yinYangBalance1 = this.calculateYinYangBalance(hex1Data.hexagram_id);
                const yinYangBalance2 = this.calculateYinYangBalance(hex2Data.hexagram_id);
                
                // 相補性スコア（異なるバランスは相補関係で高評価）
                const complementarity = Math.abs(yinYangBalance1 - yinYangBalance2) / 6; // 最大6爻
                
                // 調和性スコア（似たバランスも評価）
                const harmony = 1 - Math.abs(yinYangBalance1 - yinYangBalance2) / 6;
                
                return (complementarity * 0.6 + harmony * 0.4);
            }
            
            // 陰陽バランス計算
            calculateYinYangBalance(hexagramId) {
                // 簡易実装：卦番号から陰陽構成を推定
                const binaryString = hexagramId.toString(2).padStart(6, '0');
                return binaryString.split('1').length - 1; // 陽爻の数
            }
            
            // トリグラムエネルギーシナジー
            calculateTrigramEnergySynergy(hex1Data, hex2Data) {
                const upper1 = hex1Data.upper_trigram_id || 1;
                const lower1 = hex1Data.lower_trigram_id || 1;
                const upper2 = hex2Data.upper_trigram_id || 1;
                const lower2 = hex2Data.lower_trigram_id || 1;
                
                const upperSynergy = this.getTrigramSynergy(upper1, upper2);
                const lowerSynergy = this.getTrigramSynergy(lower1, lower2);
                const crossSynergy = (this.getTrigramSynergy(upper1, lower2) + 
                                     this.getTrigramSynergy(lower1, upper2)) / 2;
                
                return (upperSynergy * 0.4 + lowerSynergy * 0.4 + crossSynergy * 0.2);
            }
            
            // トリグラム間シナジー基本値
            getTrigramSynergy(trigram1, trigram2) {
                const synergyMatrix = {
                    1: [0.7, 0.6, 0.5, 0.8, 0.4, 0.3, 0.9, 0.2], // 乾
                    2: [0.6, 0.7, 0.9, 0.4, 0.8, 0.5, 0.3, 0.6], // 兌
                    3: [0.5, 0.9, 0.7, 0.3, 0.6, 0.8, 0.4, 0.7], // 離
                    4: [0.8, 0.4, 0.3, 0.7, 0.9, 0.6, 0.5, 0.8], // 震
                    5: [0.4, 0.8, 0.6, 0.9, 0.7, 0.3, 0.6, 0.5], // 巽
                    6: [0.3, 0.5, 0.8, 0.6, 0.3, 0.7, 0.8, 0.9], // 坎
                    7: [0.9, 0.3, 0.4, 0.5, 0.6, 0.8, 0.7, 0.4], // 艮
                    8: [0.2, 0.6, 0.7, 0.8, 0.5, 0.9, 0.4, 0.7]  // 坤
                };
                
                return synergyMatrix[trigram1] ? 
                    (synergyMatrix[trigram1][trigram2 - 1] || 0.5) : 0.5;
            }
            
            // 卦の五行属性取得
            getHexagramElement(hexData) {
                const elementMapping = {
                    1: '金', 2: '土', 3: '水', 4: '木', 5: '木', 6: '水', 7: '火', 8: '土',
                    9: '火', 10: '金', 11: '土', 12: '土', 13: '火', 14: '火', 15: '土', 16: '木',
                    17: '木', 18: '土', 19: '土', 20: '火', 21: '火', 22: '火', 23: '土', 24: '木',
                    25: '金', 26: '土', 27: '木', 28: '金', 29: '水', 30: '火', 31: '金', 32: '木',
                    33: '金', 34: '木', 35: '火', 36: '土', 37: '火', 38: '火', 39: '水', 40: '木',
                    41: '土', 42: '木', 43: '金', 44: '金', 45: '土', 46: '木', 47: '金', 48: '水',
                    49: '金', 50: '火', 51: '木', 52: '土', 53: '木', 54: '木', 55: '火', 56: '火',
                    57: '木', 58: '金', 59: '水', 60: '水', 61: '木', 62: '土', 63: '水', 64: '火'
                };
                
                return elementMapping[hexData.hexagram_id] || '土';
            }
            
            // トリグラム五行シナジー
            calculateTrigramElementSynergy(hex1Data, hex2Data) {
                const upper1Element = this.getTrigramElement(hex1Data.upper_trigram_id);
                const lower1Element = this.getTrigramElement(hex1Data.lower_trigram_id);
                const upper2Element = this.getTrigramElement(hex2Data.upper_trigram_id);
                const lower2Element = this.getTrigramElement(hex2Data.lower_trigram_id);
                
                const elementSynergy = {
                    '木': { '木': 0.7, '火': 0.9, '土': 0.2, '金': 0.1, '水': 0.8 },
                    '火': { '木': 0.8, '火': 0.7, '土': 0.9, '金': 0.1, '水': 0.2 },
                    '土': { '木': 0.1, '火': 0.8, '土': 0.7, '金': 0.9, '水': 0.2 },
                    '金': { '木': 0.2, '火': 0.1, '土': 0.8, '金': 0.7, '水': 0.9 },
                    '水': { '木': 0.9, '火': 0.2, '土': 0.1, '金': 0.8, '水': 0.7 }
                };
                
                const s1 = elementSynergy[upper1Element][upper2Element] || 0.5;
                const s2 = elementSynergy[lower1Element][lower2Element] || 0.5;
                const s3 = elementSynergy[upper1Element][lower2Element] || 0.5;
                const s4 = elementSynergy[lower1Element][upper2Element] || 0.5;
                
                return (s1 + s2 + s3 + s4) / 4;
            }
            
            // トリグラムの五行属性
            getTrigramElement(trigramId) {
                const trigramElements = {
                    1: '金', // 乾
                    2: '金', // 兌
                    3: '火', // 離
                    4: '木', // 震
                    5: '木', // 巽
                    6: '水', // 坎
                    7: '土', // 艮
                    8: '土'  // 坤
                };
                return trigramElements[trigramId] || '土';
            }
            
            // 季節・方位相性
            calculateSeasonDirectionSynergy(element1, element2) {
                const seasonDirection = {
                    '木': { season: '春', direction: '東' },
                    '火': { season: '夏', direction: '南' },
                    '土': { season: '土用', direction: '中央' },
                    '金': { season: '秋', direction: '西' },
                    '水': { season: '冬', direction: '北' }
                };
                
                const attr1 = seasonDirection[element1];
                const attr2 = seasonDirection[element2];
                
                if (!attr1 || !attr2) return 0.5;
                
                // 同じ季節・方位は高評価
                if (attr1.season === attr2.season) return 0.8;
                if (attr1.direction === attr2.direction) return 0.7;
                
                // 隣接季節は中評価
                const seasonOrder = ['春', '夏', '土用', '秋', '冬'];
                const idx1 = seasonOrder.indexOf(attr1.season);
                const idx2 = seasonOrder.indexOf(attr2.season);
                if (Math.abs(idx1 - idx2) === 1 || Math.abs(idx1 - idx2) === 4) return 0.6;
                
                return 0.4;
            }
            
            // 主体性推奨スタンス相性
            calculateStanceSynergy(h384Data1, h384Data2) {
                const getStanceDistribution = (data) => {
                    const stances = { '能動': 0, '受動': 0, '中立': 0 };
                    data.forEach(item => {
                        if (item.S5_主体性推奨スタンス) {
                            stances[item.S5_主体性推奨スタンス] = (stances[item.S5_主体性推奨スタンス] || 0) + 1;
                        }
                    });
                    const total = Object.values(stances).reduce((a, b) => a + b, 0);
                    if (total === 0) return stances;
                    
                    Object.keys(stances).forEach(key => {
                        stances[key] /= total;
                    });
                    return stances;
                };
                
                const stance1 = getStanceDistribution(h384Data1);
                const stance2 = getStanceDistribution(h384Data2);
                
                // 相補性評価（能動と受動の組み合わせは高評価）
                const complementarity = (stance1.能動 * stance2.受動 + stance1.受動 * stance2.能動) * 0.8 +
                                       (stance1.中立 * (stance2.能動 + stance2.受動)) * 0.6;
                
                // 類似性評価（同じスタンス同士も評価）
                const similarity = (stance1.能動 * stance2.能動 + stance1.受動 * stance2.受動 + stance1.中立 * stance2.中立) * 0.7;
                
                return Math.max(complementarity, similarity);
            }
            
            // 解釈親和性計算
            calculateInterpretationSynergy(h384Data1, h384Data2) {
                // 現代解釈の要約から感情・価値観を抽出し比較
                const extractSentiment = (data) => {
                    let positiveCount = 0;
                    let negativeCount = 0;
                    let neutralCount = 0;
                    
                    data.forEach(item => {
                        if (item.現代解釈の要約) {
                            const text = item.現代解釈の要約;
                            if (text.includes('成功') || text.includes('良い') || text.includes('幸運') || text.includes('吉')) {
                                positiveCount++;
                            } else if (text.includes('失敗') || text.includes('危険') || text.includes('困難') || text.includes('凶')) {
                                negativeCount++;
                            } else {
                                neutralCount++;
                            }
                        }
                    });
                    
                    const total = positiveCount + negativeCount + neutralCount;
                    return {
                        positive: total > 0 ? positiveCount / total : 0,
                        negative: total > 0 ? negativeCount / total : 0,
                        neutral: total > 0 ? neutralCount / total : 0
                    };
                };
                
                const sentiment1 = extractSentiment(h384Data1);
                const sentiment2 = extractSentiment(h384Data2);
                
                // 感情的親和性計算
                const emotionalSynergy = 1 - (Math.abs(sentiment1.positive - sentiment2.positive) +
                                              Math.abs(sentiment1.negative - sentiment2.negative) +
                                              Math.abs(sentiment1.neutral - sentiment2.neutral)) / 3;
                
                return emotionalSynergy;
            }
            
            // 成長パターン相性
            calculateGrowthPatternSynergy(h384Data1, h384Data2) {
                const getGrowthPattern = (data) => {
                    const scores = data.map(item => item.S7_総合評価スコア || 50);
                    if (scores.length === 0) return { trend: 0, volatility: 0 };
                    
                    // 成長トレンド（最後の値 - 最初の値）
                    const trend = scores[scores.length - 1] - scores[0];
                    
                    // 変動性（標準偏差）
                    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
                    const variance = scores.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / scores.length;
                    const volatility = Math.sqrt(variance);
                    
                    return { trend, volatility };
                };
                
                const pattern1 = getGrowthPattern(h384Data1);
                const pattern2 = getGrowthPattern(h384Data2);
                
                // トレンド相関（同じ方向の成長は高評価）
                const trendSynergy = 1 - Math.abs(pattern1.trend - pattern2.trend) / 100;
                
                // 変動性補完（異なる変動性は相補関係で評価）
                const volatilitySynergy = 1 - Math.abs(pattern1.volatility - pattern2.volatility) / 50;
                
                return (trendSynergy * 0.6 + volatilitySynergy * 0.4);
            }
            
            // 人生哲学相性
            calculateLifePhilosophySynergy(hex1Data, hex2Data) {
                // 八卦の組み合わせから人生哲学を推定
                const getLifePhilosophy = (hexData) => {
                    const upper = hexData.upper_trigram_id || 1;
                    const lower = hexData.lower_trigram_id || 1;
                    
                    const philosophyMap = {
                        '1-1': '完全主義・理想追求',
                        '1-2': '表現力・創造性',
                        '1-3': '知的探求・啓発',
                        '1-4': '行動力・実行力',
                        '1-5': '調和・協調性',
                        '1-6': '深慮・慎重性',
                        '1-7': '堅実・安定性',
                        '1-8': '包容・受容性',
                        '8-8': '母性・育成性',
                        // ... 他の組み合わせも定義可能
                    };
                    
                    const key = `${upper}-${lower}`;
                    return philosophyMap[key] || '調和・バランス';
                };
                
                const philosophy1 = getLifePhilosophy(hex1Data);
                const philosophy2 = getLifePhilosophy(hex2Data);
                
                // 哲学的親和性マトリックス
                const philosophySynergy = {
                    '完全主義・理想追求': { '完全主義・理想追求': 0.9, '表現力・創造性': 0.7, '調和・バランス': 0.6 },
                    '表現力・創造性': { '完全主義・理想追求': 0.7, '表現力・創造性': 0.9, '調和・バランス': 0.8 },
                    '母性・育成性': { '包容・受容性': 0.9, '調和・バランス': 0.8, '堅実・安定性': 0.7 },
                    '調和・バランス': { '調和・バランス': 0.8 } // デフォルト値
                };
                
                return (philosophySynergy[philosophy1] && philosophySynergy[philosophy1][philosophy2]) ||
                       (philosophySynergy[philosophy2] && philosophySynergy[philosophy2][philosophy1]) ||
                       (philosophy1 === philosophy2 ? 0.8 : 0.6);
            }
            
        }
        
        class QuizController {
            constructor() {
                this.currentQuestion = 0;
                this.answers = {};
                this.personaEnhancer = new VirtualPersonaEnhancer();
                this.tripleOSAnalyzer = null;
            }
            
            // 三爻間の親和性計算（易経理論に基づく動的計算）
            calculateTrigramCompatibility(trigram1, trigram2) {
                // 五行思想に基づく三爻の属性定義
                const trigramElements = {
                    "乾": { element: "金", yang: 3, position: "天" },  // 完全陽
                    "兌": { element: "金", yang: 2, position: "沢" },  // 上陽
                    "離": { element: "火", yang: 2, position: "火" },  // 中陽
                    "震": { element: "木", yang: 1, position: "雷" },  // 下陽
                    "巽": { element: "木", yang: 2, position: "風" },  // 下陰
                    "坎": { element: "水", yang: 1, position: "水" },  // 中陰
                    "艮": { element: "土", yang: 1, position: "山" },  // 上陰
                    "坤": { element: "土", yang: 0, position: "地" }   // 完全陰
                };
                
                // 五行相生相克理論
                const elementRelations = {
                    "木": { generates: "火", destroys: "土", generatedBy: "水", destroyedBy: "金" },
                    "火": { generates: "土", destroys: "金", generatedBy: "木", destroyedBy: "水" },
                    "土": { generates: "金", destroys: "水", generatedBy: "火", destroyedBy: "木" },
                    "金": { generates: "水", destroys: "木", generatedBy: "土", destroyedBy: "火" },
                    "水": { generates: "木", destroys: "火", generatedBy: "金", destroyedBy: "土" }
                };
                
                const elem1 = trigramElements[trigram1];
                const elem2 = trigramElements[trigram2];
                
                if (!elem1 || !elem2) return 0.5; // デフォルト値
                
                let compatibility = 0.5; // 基本値
                
                // 1. 同一要素は最高の相性
                if (trigram1 === trigram2) {
                    compatibility = 1.0;
                }
                // 2. 相生関係（生み出す関係）
                else if (elementRelations[elem1.element]?.generates === elem2.element) {
                    compatibility = 0.8;
                }
                else if (elementRelations[elem1.element]?.generatedBy === elem2.element) {
                    compatibility = 0.7;
                }
                // 3. 相克関係（対立関係）
                else if (elementRelations[elem1.element]?.destroys === elem2.element) {
                    compatibility = 0.3;
                }
                else if (elementRelations[elem1.element]?.destroyedBy === elem2.element) {
                    compatibility = 0.2;
                }
                // 4. 陰陽バランスによる調整
                else {
                    const yangDiff = Math.abs(elem1.yang - elem2.yang);
                    if (yangDiff === 0) {
                        compatibility = 0.6; // 同じ陰陽レベル
                    } else if (yangDiff === 1) {
                        compatibility = 0.7; // 適度な差
                    } else if (yangDiff === 2) {
                        compatibility = 0.5; // 中程度の差
                    } else {
                        compatibility = 0.4; // 大きな差
                    }
                }
                
                // 5. 位置関係による微調整（天地、水火などの自然関係）
                if ((elem1.position === "天" && elem2.position === "地") ||
                    (elem1.position === "地" && elem2.position === "天")) {
                    compatibility *= 0.8; // 天地の対立
                }
                if ((elem1.position === "水" && elem2.position === "火") ||
                    (elem1.position === "火" && elem2.position === "水")) {
                    compatibility *= 0.7; // 水火の対立
                }
                
                return Math.min(1.0, Math.max(0.1, compatibility));
            }
            
            // 一貫性スコア計算メソッド
            calculateConsistencyScore(engineOS, interfaceOS, safeModeOS) {
                try {
                    // 1. 卦の相互距離を計算
                    const engineInterface = Math.abs(engineOS.hexagramId - interfaceOS.hexagramId);
                    const engineSafeMode = Math.abs(engineOS.hexagramId - safeModeOS.hexagramId);
                    const interfaceSafeMode = Math.abs(interfaceOS.hexagramId - safeModeOS.hexagramId);
                    
                    // 2. 三爻レベルでの整合性分析
                    const trigramConsistency = this.analyzeTrigramConsistency(engineOS, interfaceOS, safeModeOS);
                    
                    // 3. HaQei哲学的一貫性の評価
                    const philosophicalConsistency = this.evaluatePhilosophicalConsistency(engineOS, interfaceOS, safeModeOS);
                    
                    // 4. 総合整合性スコア計算
                    const distanceScore = Math.max(0, 100 - (engineInterface + engineSafeMode + interfaceSafeMode) / 3 * 1.5);
                    const finalScore = (distanceScore * 0.4 + trigramConsistency * 0.35 + philosophicalConsistency * 0.25);
                    
                    return Math.min(100, Math.max(0, finalScore));
                    
                } catch (error) {
                    console.error("❌ Consistency calculation error:", error);
                    // エラー時は計算可能な最小値を返す
                    const minConsistency = 33; // 3つのOSの最小一貫性
                    return minConsistency;
                }
            }
            
            /**
             * Triple OS相互作用の総合分析
             * 3つのOSの統合的動作を評価し、推奨事項を生成
             */
            async calculateTripleOSInteraction(engineOS, interfaceOS, safeModeOS) {
                // console.log("🔯 Calculating Triple OS Interaction");
                
                try {
                    // 1. 整合性スコア計算
                    const consistency = this.calculateConsistencyScore(engineOS, interfaceOS, safeModeOS);
                    
                    // 2. 動的バランス評価
                    const balance = this.evaluateDynamicBalance(engineOS, interfaceOS, safeModeOS);
                    
                    // 3. HaQei統合度評価
                    const integration = this.assessHaQeiIntegration(engineOS, interfaceOS, safeModeOS);
                    
                    // 4. データフロー検証
                    const dataFlowValidation = this.validateDataFlow(engineOS, interfaceOS, safeModeOS);
                    
                    // 5. 推奨事項生成
                    const recommendations = this.generateRecommendations(consistency, balance, integration, dataFlowValidation);
                    
                    return {
                        consistency,
                        balance,
                        integration,
                        dataFlow: dataFlowValidation,
                        recommendations,
                        timestamp: Date.now(),
                        status: "success"
                    };
                    
                } catch (error) {
                    console.error("❌ Triple OS Interaction calculation failed:", error);
                    return this.getDefaultTripleOSInteraction();
                }
            }
            /**
             * 動的バランス評価
             * 3つのOSの相互作用における動的平衡を評価
             */
            evaluateDynamicBalance(engineOS, interfaceOS, safeModeOS) {
                console.log("⚖️ Evaluating Dynamic Balance");
                
                try {
                    // 1. エネルギー分布の分析
                    const energyDistribution = this.analyzeEnergyDistribution(engineOS, interfaceOS, safeModeOS);
                    
                    // 2. 相互補完性の評価
                    const complementarity = this.assessComplementarity(engineOS, interfaceOS, safeModeOS);
                    
                    // 3. 安定性指標の計算
                    const stability = this.calculateStabilityIndex(engineOS, interfaceOS, safeModeOS);
                    
                    // 4. 適応性指標の計算
                    const adaptability = this.calculateAdaptabilityIndex(engineOS, interfaceOS, safeModeOS);
                    
                    // 5. 総合バランススコア
                    const balanceScore = (
                        energyDistribution * 0.3 + 
                        complementarity * 0.25 + 
                        stability * 0.25 + 
                        adaptability * 0.2
                    );
                    
                    return Math.min(100, Math.max(0, balanceScore));
                    
                } catch (error) {
                    console.error("❌ Dynamic balance evaluation failed:", error);
                    // エラー時は中央値を返す
                    return 50; // 中立的なバランス値
                }
            }
            
            // その他の必要なメソッドをスタブとして追加
            analyzeEnergyDistribution(engineOS, interfaceOS, safeModeOS) {
                // 実際のエネルギー分布を計算
                const engineEnergy = Object.values(engineOS.trigramEnergies || {}).reduce((a, b) => a + b, 0);
                const interfaceEnergy = Object.values(interfaceOS.trigramEnergies || {}).reduce((a, b) => a + b, 0);
                const safeModeEnergy = Object.values(safeModeOS.trigramEnergies || {}).reduce((a, b) => a + b, 0);
                const totalEnergy = engineEnergy + interfaceEnergy + safeModeEnergy;
                
                // 正規化して0-100のスコアに変換
                return totalEnergy > 0 ? Math.round((engineEnergy / totalEnergy) * 100) : 50;
            }
            
            assessComplementarity(engineOS, interfaceOS, safeModeOS) {
                // 実際の補完性を計算
                const engineUpper = engineOS.upperTrigram;
                const interfaceUpper = interfaceOS.upperTrigram;
                const safeModeUpper = safeModeOS.upperTrigram;
                
                // 異なる三爻が多いほど補完性が高い
                const uniqueTrigrams = new Set([engineUpper, interfaceUpper, safeModeUpper]).size;
                return Math.round((uniqueTrigrams / 3) * 100);
            }
            
            calculateStabilityIndex(engineOS, interfaceOS, safeModeOS) {
                // 実際の安定性指標を計算
                const consistency = this.calculateTripleOSConsistency(engineOS, interfaceOS, safeModeOS);
                const balance = this.evaluateDynamicBalance(engineOS, interfaceOS, safeModeOS);
                return Math.round((consistency + balance) / 2);
            }
            
            calculateAdaptabilityIndex(engineOS, interfaceOS, safeModeOS) {
                // 実際の適応性指標を計算
                const flexibility = this.assessComplementarity(engineOS, interfaceOS, safeModeOS);
                const responsiveness = 100 - this.calculateStabilityIndex(engineOS, interfaceOS, safeModeOS);
                return Math.round((flexibility + responsiveness) / 2);
            }
            
            generateRecommendations(engineOS, interfaceOS, safeModeOS) {
                const recommendations = [];
                const stability = this.calculateStabilityIndex(engineOS, interfaceOS, safeModeOS);
                
                if (stability < 50) {
                    recommendations.push("内的一貫性を高めるため、価値観の明確化に取り組みましょう");
                }
                if (stability > 80) {
                    recommendations.push("高い安定性を活かし、リーダーシップを発揮する機会を増やしましょう");
                }
                
                return recommendations;
            }
            getDefaultTripleOSInteraction() { 
                return { consistency: 50, balance: 50, integration: 50, recommendations: [] };
            }
            
            // ==========================================
            // QuizControllerクラスのメソッド定義（続き）
            // ==========================================
            
            startQuiz() {
                console.log("🚀 Starting quiz");
                console.log("📊 Total questions:", QUESTIONS.length);
                console.log("📋 First question:", QUESTIONS[0]);
                
                const welcomeScreen = document.getElementById('welcome-screen');
                const questionScreen = document.getElementById('question-screen');
                
                if (welcomeScreen) {
                    welcomeScreen.classList.remove('active');
                    console.log("✅ Welcome screen hidden");
                } else {
                    console.error("❌ Welcome screen not found");
                }
                
                if (questionScreen) {
                    questionScreen.classList.add('active');
                    console.log("✅ Question screen shown");
                } else {
                    console.error("❌ Question screen not found");
                }
                
                this.showQuestion(0);
            }
            
            showQuestion(index) {
                console.log(`📌 showQuestion called with index: ${index}`);
                
                if (index >= QUESTIONS.length) {
                    console.log("📊 All questions completed, calculating results");
                    this.calculateResults();
                    return;
                }
                
                const question = QUESTIONS[index];
                console.log("❓ Current question:", question);
                
                // Update progress bar
                const progressFill = document.getElementById('progress-fill');
                if (progressFill) {
                    progressFill.style.width = `${((index + 1) / QUESTIONS.length) * 100}%`;
                } else {
                    console.warn("⚠️ Progress fill element not found");
                }
                
                // Update question number
                const questionNumber = document.getElementById('question-number');
                if (questionNumber) {
                    questionNumber.textContent = `質問 ${index + 1} / ${QUESTIONS.length}`;
                } else {
                    console.warn("⚠️ Question number element not found");
                }
                
                // Update question text
                const questionTitle = document.getElementById('question-title');
                if (questionTitle) {
                    questionTitle.textContent = question.text;
                    console.log("✅ Question title updated");
                } else {
                    console.error("❌ Question title element not found");
                }
                
                // Future Simulator用の悩み入力の場合
                if (question.type === 'textarea') {
                    console.log("🔮 Showing worry input for Future Simulator");
                    this.showWorryInput(question);
                } else {
                    console.log("📝 Showing multiple choice question");
                    this.showMultipleChoice(question);
                }
                
                this.currentQuestion = index;
                this.currentQuestionIndex = index;
            }
            
            nextQuestion() {
                console.log("➡️ Moving to next question");
                const currentIndex = this.currentQuestionIndex || 0;
                this.showQuestion(currentIndex + 1);
            }
            
            showWorryInput(question) {
                // 通常の選択肢を非表示
                const optionsContainer = document.getElementById('options-container');
                if (optionsContainer) {
                    optionsContainer.style.display = 'none';
                }
                
                // 悩み入力エリアを表示
                const worryInputContainer = document.getElementById('worry-input-container');
                if (worryInputContainer) {
                    worryInputContainer.style.display = 'block';
                }
                
                // プレースホルダー設定
                const worryTextarea = document.getElementById('worryInputArea');
                if (worryTextarea && question.placeholder) {
                    worryTextarea.placeholder = question.placeholder;
                }
                
                // 次へボタンを有効化（テキスト入力時）
                const nextBtn = document.getElementById('next-btn');
                if (nextBtn && worryTextarea) {
                    const checkInput = () => {
                        nextBtn.disabled = !worryTextarea.value.trim();
                    };
                    worryTextarea.addEventListener('input', checkInput);
                    checkInput(); // 初期状態をチェック
                }
            }
            
            showMultipleChoice(question) {
                // 悩み入力エリアを非表示
                const worryInputContainer = document.getElementById('worry-input-container');
                if (worryInputContainer) {
                    worryInputContainer.style.display = 'none';
                }
                
                // 通常の選択肢を表示
                const optionsContainer = document.getElementById('options-container');
                if (optionsContainer) {
                    optionsContainer.style.display = 'block';
                    optionsContainer.innerHTML = question.options ? question.options.map(opt => `
                        <button class="option-btn" data-value="${opt.value}">
                            <span class="option-label">${opt.value}.</span>
                            <span class="option-text">${opt.text}</span>
                        </button>
                    `).join('');
                    
                    // Add event listeners to option buttons
                    optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const button = e.currentTarget;
                            this.answers[question.id] = button.dataset.value;
                            this.currentQuestion++;
                            this.showQuestion(this.currentQuestion);
                        });
                    });
                }
            }
            
            calculateResults() {
                console.log("📊 Calculating results");
                console.log("Answers:", this.answers);
                
                // 最初の答え（インデックス0）が悩み入力の場合は8シナリオ生成
                if (this.answers[0] && typeof this.answers[0] === 'string') {
                    console.log("🔮 Future Simulator mode detected");
                    this.generateFutureScenarios(this.answers[0]);
                } else {
                    // 従来のTriple OS分析
                    console.log("📊 Traditional Triple OS analysis");
                    this.performTraditionalAnalysis();
                }
            }
            
            generateFutureScenarios(worryText) {
                console.log("🔮 Generating 8 Future Scenarios for:", worryText.substring(0, 50) + "...");
                
                // Show analysis screen briefly with active class
                const questionScreen = document.getElementById('question-screen');
                const analysisScreen = document.getElementById('analysis-screen');
                
                if (questionScreen) questionScreen.classList.remove('active');
                if (analysisScreen) analysisScreen.classList.add('active');
                
                // 8つのシナリオを生成
                const scenarios = this.createEightScenarios(worryText);
                
                // シナリオ表示画面に切り替え
                setTimeout(() => {
                    this.displayScenarios(scenarios);
                }, 2000);
            }
            
            createEightScenarios(worryText) {
                // 8つの基本的な選択パターン（易経8卦をベース）
                return [
                    {
                        id: 1,
                        title: "積極的に行動を起こす",
                        description: `${this.extractKeyword(worryText)}について、積極的かつ能動的にアプローチする道筋です。リスクを取りながらも、自らの意志で状況を切り開いていく選択肢です。`,
                        trigram: "乾(天)",
                        action: "immediate_action",
                        risk: "高",
                        timeline: "短期"
                    },
                    {
                        id: 2,
                        title: "慎重に準備を整える",
                        description: `${this.extractKeyword(worryText)}について、十分な準備と情報収集を行ってから行動する堅実な道筋です。安全性を重視し、確実性を高めてから進む選択肢です。`,
                        trigram: "坤(地)",
                        action: "preparation_focus",
                        risk: "低", 
                        timeline: "中期"
                    },
                    {
                        id: 3,
                        title: "新しい視点を取り入れる",
                        description: `${this.extractKeyword(worryText)}について、これまでとは異なる角度からアプローチする革新的な道筋です。既存の枠にとらわれず、創造性を活かす選択肢です。`,
                        trigram: "震(雷)",
                        action: "innovation_approach",
                        risk: "中",
                        timeline: "中期"
                    },
                    {
                        id: 4,
                        title: "段階的に進歩する",
                        description: `${this.extractKeyword(worryText)}について、小さなステップを積み重ねながら着実に進む道筋です。継続性と持続可能性を重視する選択肢です。`,
                        trigram: "巽(風)",
                        action: "gradual_progress",
                        risk: "低",
                        timeline: "長期"
                    },
                    {
                        id: 5,
                        title: "協力・連携を求める",
                        description: `${this.extractKeyword(worryText)}について、他者との協力や専門家の支援を活用する道筋です。チームワークとネットワークを重視する選択肢です。`,
                        trigram: "坎(水)",
                        action: "collaboration",
                        risk: "中",
                        timeline: "中期"
                    },
                    {
                        id: 6,
                        title: "内面を充実させる",
                        description: `${this.extractKeyword(worryText)}について、まず自己理解やスキル向上に集中する道筋です。内的成長を基盤とした長期的な視点の選択肢です。`,
                        trigram: "離(火)",
                        action: "self_development",
                        risk: "低",
                        timeline: "長期"
                    },
                    {
                        id: 7,
                        title: "現状を見直す",
                        description: `${this.extractKeyword(worryText)}について、現在の状況や前提を根本的に見直す道筋です。問題の捉え方自体を変える選択肢です。`,
                        trigram: "艮(山)",
                        action: "reframe_situation", 
                        risk: "中",
                        timeline: "短期"
                    },
                    {
                        id: 8,
                        title: "柔軟に対応する",
                        description: `${this.extractKeyword(worryText)}について、状況に応じて柔軟に対応方針を調整する道筋です。適応性と変化への対応力を重視する選択肢です。`,
                        trigram: "兌(沢)",
                        action: "flexible_response",
                        risk: "中",
                        timeline: "短期"
                    }
                ];
            }
            
            extractKeyword(text) {
                // 簡単なキーワード抽出（改善可能）
                if (text.includes('転職')) return '転職';
                if (text.includes('仕事') || text.includes('職場')) return '仕事';
                if (text.includes('恋愛') || text.includes('結婚')) return '恋愛・結婚';
                if (text.includes('勉強') || text.includes('学習')) return '学習';
                if (text.includes('健康')) return '健康';
                if (text.includes('人間関係')) return '人間関係';
                if (text.includes('起業') || text.includes('ビジネス')) return 'ビジネス';
                return 'この課題';
            }
            
            displayScenarios(scenarios) {
                console.log("🎯 Displaying 8 scenarios:", scenarios);
                
                // 分析画面を非表示、結果画面を表示
                const analysisScreen = document.getElementById('analysis-screen');
                const resultsScreen = document.getElementById('results-screen');
                
                if (analysisScreen) analysisScreen.classList.remove('active');
                if (resultsScreen) resultsScreen.classList.add('active');
                
                // シナリオ表示画面を作成・表示
                this.showScenariosScreen(scenarios);
            }
            
            showScenariosScreen(scenarios) {
                // 既存のresults-screenを使用してシナリオを表示
                const resultsScreen = document.getElementById('results-screen');
                if (!resultsScreen) {
                    console.error("Results screen not found");
                    return;
                }
                
                // シナリオ表示用のHTMLを生成
                resultsScreen.innerHTML = `
                    <div class="scenario-selection-container">
                        <div class="scenario-header">
                            <h2 class="analysis-title">🔮 未来への8つの道筋</h2>
                            <p class="scenario-instruction">あなたの悩みに対する8つの選択肢が生成されました。最も共感できる道筋を選択してください。</p>
                        </div>
                        
                        <div class="scenarios-grid">
                            ${scenarios.map(scenario => `
                                <div class="scenario-card" data-scenario-id="${scenario.id}" onclick="selectScenario(${scenario.id})">
                                    <div class="scenario-header-card">
                                        <div class="scenario-number">${scenario.id}</div>
                                        <div class="scenario-trigram">${scenario.trigram}</div>
                                        <div class="scenario-risk risk-${scenario.risk}">リスク: ${scenario.risk}</div>
                                    </div>
                                    <h3 class="scenario-title">${scenario.title}</h3>
                                    <p class="scenario-description">${scenario.description}</p>
                                    <div class="scenario-meta">
                                        <span class="scenario-timeline">期間: ${scenario.timeline}</span>
                                        <span class="scenario-action">アプローチ: ${this.getActionLabel(scenario.action)}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="scenario-footer">
                            <p class="scenario-note">💡 選択後、詳細な実行プランをご提示します</p>
                        </div>
                    </div>
                `;
                
                // results-screenを表示
                resultsScreen.style.display = 'block';
                
                // CSSスタイルを追加
                this.addScenarioStyles();
            }
            
            getActionLabel(action) {
                const labels = {
                    'immediate_action': '即座実行',
                    'preparation_focus': '準備重視', 
                    'innovation_approach': '革新的',
                    'gradual_progress': '段階的',
                    'collaboration': '協力型',
                    'self_development': '自己成長',
                    'reframe_situation': '視点転換',
                    'flexible_response': '柔軟対応'
                };
                return labels[action] || action;
            }
            
            addScenarioStyles() {
                // シナリオ表示用のCSSスタイルを動的に追加
                const existingStyle = document.getElementById('scenario-styles');
                if (existingStyle) return; // 既に追加済みの場合はスキップ
                
                const style = document.createElement('style');
                style.id = 'scenario-styles';
                style.textContent = `
                    .scenario-selection-container {
                        padding: 20px;
                        max-width: 1200px;
                        margin: 0 auto;
                    }
                    
                    .scenario-header {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    
                    .analysis-title {
                        color: #1a202c;
                        font-size: 2rem;
                        margin-bottom: 10px;
                    }
                    
                    .scenario-instruction {
                        color: #4a5568;
                        font-size: 1.1rem;
                        margin-bottom: 0;
                    }
                    
                    .scenarios-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                        gap: 20px;
                        margin-bottom: 30px;
                    }
                    
                    .scenario-card {
                        border: 2px solid #e2e8f0;
                        border-radius: 12px;
                        padding: 20px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
                    }
                    
                    .scenario-card:hover {
                        border-color: #6366f1;
                        box-shadow: 0 8px 25px rgba(99, 102, 241, 0.15);
                        transform: translateY(-2px);
                    }
                    
                    .scenario-header-card {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 15px;
                    }
                    
                    .scenario-number {
                        background: #6366f1;
                        color: white;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                    }
                    
                    .scenario-trigram {
                        background: #f7fafc;
                        padding: 4px 8px;
                        border-radius: 6px;
                        font-size: 0.9rem;
                        color: #4a5568;
                    }
                    
                    .scenario-risk {
                        padding: 4px 8px;
                        border-radius: 6px;
                        font-size: 0.8rem;
                        font-weight: 500;
                    }
                    
                    .risk-高 { background: #fee2e2; color: #dc2626; }
                    .risk-中 { background: #fef3c7; color: #d97706; }
                    .risk-低 { background: #dcfce7; color: #16a34a; }
                    
                    .scenario-title {
                        color: #1a202c;
                        font-size: 1.2rem;
                        margin: 0 0 10px 0;
                        font-weight: 600;
                    }
                    
                    .scenario-description {
                        color: #4a5568;
                        line-height: 1.6;
                        margin: 0 0 15px 0;
                    }
                    
                    .scenario-meta {
                        display: flex;
                        justify-content: space-between;
                        font-size: 0.9rem;
                        color: #6b7280;
                    }
                    
                    .scenario-footer {
                        text-align: center;
                        padding-top: 20px;
                        border-top: 1px solid #e5e7eb;
                    }
                    
                    .scenario-note {
                        color: #6b7280;
                        font-style: italic;
                    }
                `;
                document.head.appendChild(style);
            }

            performTraditionalAnalysis() {
                // Show analysis screen briefly with active class
                const questionScreen = document.getElementById('question-screen');
                const analysisScreen = document.getElementById('analysis-screen');
                
                if (questionScreen) questionScreen.classList.remove('active');
                if (analysisScreen) analysisScreen.classList.add('active');
                
                // TripleOSAnalyzerを使用して分析実行
                this.performAnalysis();
            }
            
            async performAnalysis() {
                console.log("🔬 Performing Triple OS Analysis with TripleOSAnalyzer");
                
                try {
                    // TripleOSAnalyzerインスタンスを作成
                    if (!this.tripleOSAnalyzer) {
                        // 内部クラスTripleOSAnalyzerの定義を参照
                        const analyzer = {
                            // Triple OS分析のメイン処理
                            analyzeTripleOS: async (allAnswers) => {
                                console.log("🔯 Starting Triple OS Analysis");
                                
                                // 既存のメソッドを呼び出し
                                const engineOS = this.calculateEngineOS();
                                const interfaceOS = this.calculateInterfaceOS();
                                const safeModeOS = this.calculateSafeModeOS();
                                
                                return {
                                    engineOS: engineOS,
                                    interfaceOS: interfaceOS,
                                    safeModeOS: safeModeOS
                                };
                            }
                        };
                        this.tripleOSAnalyzer = analyzer;
                    }
                    
                    // 全回答を収集
                    const allAnswers = Object.entries(this.answers).map(([qId, value]) => ({
                        questionId: qId,
                        value: value
                    }));
                    
                    // 分析実行
                    const result = await this.tripleOSAnalyzer.analyzeTripleOS(allAnswers);
                    
                    // 結果表示
                    setTimeout(() => {
                        // Hide analysis and show results
                        document.getElementById('analysis-screen').style.display = 'none';
                        document.getElementById('results-screen').style.display = 'block';
                        
                        // Display results
                        this.displayResults(result.engineOS, result.interfaceOS, result.safeModeOS);
                        
                        // showAnalysisResults関数を呼び出す（存在する場合）
                        if (window.showAnalysisResults) {
                            window.showAnalysisResults(result);
                        }
                    }, 2000); // 2秒の分析演出
                    
                } catch (error) {
                    console.error("❌ Analysis Error:", error);
                    // エラー時は明確なエラー表示（フォールバック禁止）
                    document.getElementById('analysis-screen').style.display = 'none';
                    alert(`分析エラーが発生しました: ${error.message}\n\n再度お試しください。`);
                    // 初期画面に戻る
                    document.getElementById('welcome-screen').style.display = 'block';
                }
            }
            
            calculateScores() {
                // 8次元のスコアを初期化
                const scores = {
                    qian_creativity: 0,
                    zhen_action: 0,
                    kan_exploration: 0,
                    gen_stability: 0,
                    kun_receptiveness: 0,
                    xun_adaptability: 0,
                    li_expression: 0,
                    dui_harmony: 0
                };
                
                // 各回答のスコアを集計
                QUESTIONS.forEach(question => {
                    const answer = this.answers[question.id];
                    if (answer) {
                        const option = question.options.find(opt => opt.value === answer);
                        if (option && option.scoring) {
                            Object.entries(option.scoring).forEach(([dimension, score]) => {
                                if (scores.hasOwnProperty(dimension)) {
                                    scores[dimension] += score;
                                }
                            });
                        }
                    }
                });
                
                return scores;
            }
            
            getTrigramFromDimension(dimension) {
                // 次元名から三爻を取得
                const trigramMap = {
                    qian_creativity: "乾",
                    zhen_action: "震",
                    kan_exploration: "坎",
                    gen_stability: "艮",
                    kun_receptiveness: "坤",
                    xun_adaptability: "巽",
                    li_expression: "離",
                    dui_harmony: "兌"
                };
                return trigramMap[dimension] || "乾";
            }
            
            getHexagramFromTrigrams(upper, lower) {
                // 64卦のマッピング（簡略版）
                const hexagramMap = {
                    "乾乾": { id: 1, name: "乾為天" },
                    "坤坤": { id: 2, name: "坤為地" },
                    "震坎": { id: 3, name: "水雷屯" },
                    "坎艮": { id: 4, name: "山水蒙" },
                    "坎乾": { id: 5, name: "水天需" },
                    "乾坎": { id: 6, name: "天水訟" },
                    "坤坎": { id: 7, name: "地水師" },
                    "坎坤": { id: 8, name: "水地比" },
                    // 他の組み合わせはデフォルト値を返す
                };
                
                const key = upper + lower;
                
                // Math.random()を排除し、確定的なデフォルト値を使用
                // 8卦の組み合わせから論理的なデフォルトを計算
                if (!hexagramMap[key]) {
                    // 三爻のインデックスマッピング
                    const trigramIndex = {
                        "乾": 1, "兌": 2, "離": 3, "震": 4,
                        "巽": 5, "坎": 6, "艮": 7, "坤": 8
                    };
                    
                    // 上卦と下卦のインデックスから64卦番号を算出
                    const upperIdx = trigramIndex[upper] || 1;
                    const lowerIdx = trigramIndex[lower] || 1;
                    const hexagramId = (upperIdx - 1) * 8 + lowerIdx;
                    
                    return {
                        id: hexagramId,
                        name: `${upper}${lower}卦`
                    };
                }
                
                return hexagramMap[key];
            }
            
            calculateEngineOS() {
                const scores = this.calculateScores();
                
                // スコアをソートして最高の2つを取得
                const sortedDimensions = Object.entries(scores)
                    .sort((a, b) => b[1] - a[1]);
                
                // 最高スコアの次元から上卦と下卦を決定
                const upperDimension = sortedDimensions[0][0];
                const lowerDimension = sortedDimensions[1][0];
                
                const upperTrigram = this.getTrigramFromDimension(upperDimension);
                const lowerTrigram = this.getTrigramFromDimension(lowerDimension);
                
                const hexagram = this.getHexagramFromTrigrams(upperTrigram, lowerTrigram);
                
                return {
                    hexagramId: hexagram.id,
                    hexagramName: hexagram.name,
                    upperTrigram: upperTrigram,
                    lowerTrigram: lowerTrigram,
                    primaryDimension: upperDimension,
                    secondaryDimension: lowerDimension,
                    score: sortedDimensions[0][1]
                };
            }
            
            calculateInterfaceOS() {
                const scores = this.calculateScores();
                
                // スコアをソートして2-3番目を取得
                const sortedDimensions = Object.entries(scores)
                    .sort((a, b) => b[1] - a[1]);
                
                // 2番目と3番目のスコアの次元から卦を決定
                const upperDimension = sortedDimensions[2][0];
                const lowerDimension = sortedDimensions[3][0];
                
                const upperTrigram = this.getTrigramFromDimension(upperDimension);
                const lowerTrigram = this.getTrigramFromDimension(lowerDimension);
                
                const hexagram = this.getHexagramFromTrigrams(upperTrigram, lowerTrigram);
                
                return {
                    hexagramId: hexagram.id,
                    hexagramName: hexagram.name,
                    upperTrigram: upperTrigram,
                    lowerTrigram: lowerTrigram,
                    primaryDimension: upperDimension,
                    secondaryDimension: lowerDimension,
                    score: sortedDimensions[2][1]
                };
            }
            
            calculateSafeModeOS() {
                const scores = this.calculateScores();
                
                // ネガティブな傾向（低スコア）の次元を特定
                const sortedDimensions = Object.entries(scores)
                    .sort((a, b) => a[1] - b[1]); // 昇順でソート
                
                // 最も低いスコアの2つの次元から卦を決定
                const upperDimension = sortedDimensions[0][0];
                const lowerDimension = sortedDimensions[1][0];
                
                const upperTrigram = this.getTrigramFromDimension(upperDimension);
                const lowerTrigram = this.getTrigramFromDimension(lowerDimension);
                
                const hexagram = this.getHexagramFromTrigrams(upperTrigram, lowerTrigram);
                
                return {
                    hexagramId: hexagram.id,
                    hexagramName: hexagram.name,
                    upperTrigram: upperTrigram,
                    lowerTrigram: lowerTrigram,
                    primaryDimension: upperDimension,
                    secondaryDimension: lowerDimension,
                    score: sortedDimensions[0][1]
                };
            }
            
            displayResults(engineOS, interfaceOS, safeModeOS) {
                console.log("📊 DisplayResults called with:", { engineOS, interfaceOS, safeModeOS });
                
                // データ構造を正規化
                const normalizeOS = (os, name) => {
                    if (!os) return null;
                    return {
                        id: os.id || os.hexagramId || 1,
                        name: os.name || os.hexagramName || `第${os.id || 1}卦`,
                        upper_trigram: os.upper_trigram || os.upperTrigram || '乾',
                        lower_trigram: os.lower_trigram || os.lowerTrigram || '乾',
                        description: os.description || `${name}の特性を表します`,
                        energy_balance: os.energy_balance || os.score || 70
                    };
                };
                
                const normalizedEngine = normalizeOS(engineOS, 'Engine OS');
                const normalizedInterface = normalizeOS(interfaceOS, 'Interface OS');
                const normalizedSafeMode = normalizeOS(safeModeOS, 'Safe Mode OS');
                
                console.log("📊 Normalized data:", { normalizedEngine, normalizedInterface, normalizedSafeMode });
                
                // Display in os-cards-container
                const osCardsContainer = document.getElementById('os-cards-container');
                if (osCardsContainer) {
                    osCardsContainer.innerHTML = `
                        <div class="os-card engine-os">
                            <div class="os-icon">🎯</div>
                            <h3 class="os-title">Engine OS</h3>
                            <div class="hexagram-display">
                                <div class="hexagram-number">第${normalizedEngine?.id}卦 ${normalizedEngine?.name || ''}</div>
                                <div class="trigram-info">
                                    <span>上卦: ${normalizedEngine?.upper_trigram}</span>
                                    <span>下卦: ${normalizedEngine?.lower_trigram}</span>
                                </div>
                            </div>
                            <div class="os-description">
                                ${normalizedEngine?.description}
                            </div>
                            <div class="practical-advice">
                                <h4>💡 活用ポイント</h4>
                                ${this.getEngineOSPracticalAdvice(normalizedEngine)}
                            </div>
                        </div>
                        <div class="os-card interface-os">
                            <div class="os-icon">💬</div>
                            <h3 class="os-title">Interface OS</h3>
                            <div class="hexagram-display">
                                <div class="hexagram-number">第${normalizedInterface?.id}卦 ${normalizedInterface?.name || ''}</div>
                                <div class="trigram-info">
                                    <span>上卦: ${normalizedInterface?.upper_trigram}</span>
                                    <span>下卦: ${normalizedInterface?.lower_trigram}</span>
                                </div>
                            </div>
                            <div class="os-description">
                                ${normalizedInterface?.description}
                            </div>
                            <div class="practical-advice">
                                <h4>💡 対人関係の戦略</h4>
                                ${this.getInterfaceOSPracticalAdvice(normalizedInterface)}
                            </div>
                        </div>
                        <div class="os-card safemode-os">
                            <div class="os-icon">🛡️</div>
                            <h3 class="os-title">Safe Mode OS</h3>
                            <div class="hexagram-display">
                                <div class="hexagram-number">第${normalizedSafeMode?.id}卦 ${normalizedSafeMode?.name || ''}</div>
                                <div class="trigram-info">
                                    <span>上卦: ${normalizedSafeMode?.upper_trigram}</span>
                                    <span>下卦: ${normalizedSafeMode?.lower_trigram}</span>
                                </div>
                            </div>
                            <div class="os-description">
                                ${normalizedSafeMode?.description}
                            </div>
                            <div class="practical-advice">
                                <h4>💡 ストレス管理法</h4>
                                ${this.getSafeModeOSPracticalAdvice(normalizedSafeMode)}
                            </div>
                        </div>
                    `;
                    
                    // Triple OS相互作用の可視化
                    this.displayTripleOSInteraction(normalizedEngine, normalizedInterface, normalizedSafeMode);
                    
                    // 成長戦略の提案
                    this.displayGrowthStrategy(normalizedEngine, normalizedInterface, normalizedSafeMode);
                    
                    // スコアサマリーを表示
                    this.displayScoreSummary();
                    
                    // 透明化機能の表示
                    this.displayTransparencyAnalysis(engineOS, interfaceOS, safeModeOS);
                    
                    // 実践活用ガイドの表示
                    this.displayPracticalGuides(engineOS, interfaceOS, safeModeOS);
                    
                    // シナジー分析の表示
                    this.displaySynergyAnalysis(engineOS, interfaceOS, safeModeOS);
                }
                
                // Display summary
                const summaryContainer = document.getElementById('result-summary');
                if (summaryContainer) {
                    summaryContainer.innerHTML = `
                        <p>あなたのTriple OSシステムは、Engine OS（第${engineOS.hexagramId}卦）、
                        Interface OS（第${interfaceOS.hexagramId}卦）、
                        Safe Mode OS（第${safeModeOS.hexagramId}卦）の組み合わせです。</p>
                        <p>この組み合わせは、あなたの多面的な人格構造を示しています。</p>
                    `;
                }
            }
            
            getEngineOSDescription(os) {
                const dimensionDescriptions = {
                    qian_creativity: "創造性と革新性",
                    zhen_action: "行動力と実行力",
                    kan_exploration: "探求心と深い理解",
                    gen_stability: "安定性と着実さ",
                    kun_receptiveness: "受容性と協調性",
                    xun_adaptability: "適応性と柔軟性",
                    li_expression: "表現力と情熱",
                    dui_harmony: "調和と人間関係"
                };
                
                const primary = dimensionDescriptions[os.primaryDimension] || "特徴";
                const secondary = dimensionDescriptions[os.secondaryDimension] || "特徴";
                
                return `あなたの本質的な価値観は「${primary}」と「${secondary}」に基づいています。深層心理で最も大切にしている判断基準であり、これがあなたらしさの核となる部分です。`;
            }
            
            getInterfaceOSDescription(os) {
                const dimensionDescriptions = {
                    qian_creativity: "革新的なアイデアの提示",
                    zhen_action: "積極的なリーダーシップ",
                    kan_exploration: "深い洞察と分析",
                    gen_stability: "信頼性と一貫性",
                    kun_receptiveness: "傾聴と共感",
                    xun_adaptability: "状況への柔軟な対応",
                    li_expression: "魅力的な自己表現",
                    dui_harmony: "円滑な人間関係構築"
                };
                
                const primary = dimensionDescriptions[os.primaryDimension] || "特徴";
                const secondary = dimensionDescriptions[os.secondaryDimension] || "特徴";
                
                return `社会的な場面では「${primary}」と「${secondary}」を通じて他者と関わります。これはあなたが人に見せる側面であり、コミュニケーションスタイルの基盤となります。`;
            }
            
            getSafeModeOSDescription(os) {
                const dimensionDescriptions = {
                    qian_creativity: "新しい解決策の模索",
                    zhen_action: "即座の行動による打開",
                    kan_exploration: "問題の本質追求",
                    gen_stability: "現状維持と忍耐",
                    kun_receptiveness: "他者への依存",
                    xun_adaptability: "状況への順応",
                    li_expression: "感情の表出",
                    dui_harmony: "対立の回避"
                };
                
                const primary = dimensionDescriptions[os.primaryDimension] || "対処法";
                const secondary = dimensionDescriptions[os.secondaryDimension] || "対処法";
                
                return `ストレス下では「${primary}」と「${secondary}」という防御メカニズムが作動します。これは困難な状況であなたを守るための自然な反応パターンです。`;
            }
            
            // 実践的アドバイス生成メソッド
            getEngineOSPracticalAdvice(os) {
                const adviceMap = {
                    "乾": "💼 転職時は「チーム統率」をアピール。管理職や新規事業が適職です。",
                    "兌": "🗣️ 営業・接客・人事で力を発揮。人とのつながりを活かした仕事を選びましょう。",
                    "離": "✨ クリエイティブ系・企画職で才能開花。アイデアを形にする環境を探しましょう。",
                    "震": "⚡ 意思決定の早さが武器。起業やプロジェクトリーダーに向いています。",
                    "巽": "🔄 変化対応力が優秀。コンサル・企画・システム開発で活躍できます。",
                    "坎": "🔍 分析力が強み。データ解析・研究・戦略企画で力を発揮します。",
                    "艮": "🏔️ 継続力が武器。専門職・技術職で長期的な成果を生み出せます。",
                    "坤": "🤲 サポート役として最高の能力。チーム支援・組織開発が適職です。"
                };
                return adviceMap[os.upper_trigram] || "💎 あなた独自の強みを見つけて活かしましょう。";
            }
            
            getInterfaceOSPracticalAdvice(os) {
                const adviceMap = {
                    "乾": "💬 会議では自分から発言を。プレゼン・営業・人事面談で力を発揮できます。",
                    "兌": "😊 明るい挨拶から関係作り。接客・広報・イベント企画が最適な職種です。",
                    "離": "🎭 感情表現で相手の心を掴む。講師・カウンセラー・クリエイティブ職が適職。",
                    "震": "⚡ スピード重視で信頼獲得。緊急対応・現場管理・スポーツ指導が得意分野。",
                    "巽": "🤝 相手に合わせた対話術。コンサル・通訳・カスタマーサポートが向いています。",
                    "坎": "🧠 データで説得力アップ。分析職・研究職・システム設計で実力発揮。",
                    "艮": "📋 一貫した姿勢で信頼構築。品質管理・監査・教育分野が適職です。",
                    "坤": "👂 傾聴で本音を引き出す。相談業務・人事・メンタルケアが天職。"
                };
                return adviceMap[os.upper_trigram] || adviceMap[os.upperTrigram] || "💎 あなたらしいコミュニケーションスタイルを大切にしましょう。";
            }
            
            getSafeModeOSPracticalAdvice(os) {
                const adviceMap = {
                    "乾": "🧘 プレッシャー時は5分間の深呼吸。論理的思考で解決策を3つ書き出しましょう。",
                    "兌": "☕ 信頼できる人との15分の雑談でリセット。愚痴より解決策を話し合いましょう。",
                    "離": "🎨 創作活動で気分転換。絵を描く・音楽を聴く・日記を書くが効果的です。",
                    "震": "🏃 体を動かしてエネルギー発散。10分の散歩・ストレッチ・階段昇降が即効性あり。",
                    "巽": "🌿 環境チェンジでリフレッシュ。カフェ・公園・図書館での作業が気分転換に。",
                    "坎": "📚 一人時間で内省タイム。瞑想アプリ・読書・静かな音楽で心を整えましょう。",
                    "艮": "📅 ルーティンで安心確保。毎日同じ時間の散歩・睡眠・食事が心の支えに。",
                    "坤": "🌱 自然で心を癒す。観葉植物・ベランダガーデニング・公園散策が回復に効果的。"
                };
                return adviceMap[os.upper_trigram] || adviceMap[os.upperTrigram] || "🌟 自分だけのリラックス法を見つけることが大切です。";
            }
            
            // Triple OS相互作用の可視化
            displayTripleOSInteraction(engineOS, interfaceOS, safeModeOS) {
                const interactionSection = document.createElement('div');
                interactionSection.className = 'triple-os-interaction-section';
                interactionSection.innerHTML = `
                    <h3 class="section-title">🔄 Triple OS相互作用分析</h3>
                    <div class="interaction-content">
                        <div class="interaction-chart">
                            <canvas id="os-interaction-radar" width="300" height="300"></canvas>
                        </div>
                        <div class="interaction-insights">
                            <h4>システム間の連携パターン</h4>
                            <ul>
                                <li><strong>Engine → Interface:</strong> ${this.analyzeEngineToInterface(engineOS, interfaceOS)}</li>
                                <li><strong>Interface → Safe Mode:</strong> ${this.analyzeInterfaceToSafeMode(interfaceOS, safeModeOS)}</li>
                                <li><strong>Engine → Safe Mode:</strong> ${this.analyzeEngineToSafeMode(engineOS, safeModeOS)}</li>
                            </ul>
                            <div class="balance-indicator">
                                <h4>全体バランス評価</h4>
                                <div class="balance-score">${this.calculateOverallBalance(engineOS, interfaceOS, safeModeOS)}</div>
                            </div>
                        </div>
                    </div>
                `;
                
                const container = document.getElementById('os-cards-container');
                if (container && container.parentNode) {
                    container.parentNode.insertBefore(interactionSection, container.nextSibling);
                    this.drawInteractionRadar(engineOS, interfaceOS, safeModeOS);
                }
            }
            
            // 成長戦略の提案
            displayGrowthStrategy(engineOS, interfaceOS, safeModeOS) {
                const strategySection = document.createElement('div');
                strategySection.className = 'growth-strategy-section';
                strategySection.innerHTML = `
                    <h3 class="section-title">📈 パーソナライズド成長戦略</h3>
                    <div class="strategy-content">
                        <div class="strategy-card">
                            <h4>🎯 短期目標（1-3ヶ月）</h4>
                            <p>${this.generateShortTermGoals(engineOS, interfaceOS, safeModeOS)}</p>
                        </div>
                        <div class="strategy-card">
                            <h4>🚀 中期目標（3-6ヶ月）</h4>
                            <p>${this.generateMidTermGoals(engineOS, interfaceOS, safeModeOS)}</p>
                        </div>
                        <div class="strategy-card">
                            <h4>🌟 長期ビジョン（1年以上）</h4>
                            <p>${this.generateLongTermVision(engineOS, interfaceOS, safeModeOS)}</p>
                        </div>
                        <div class="action-items">
                            <h4>📝 今すぐ始められるアクション</h4>
                            <ol>
                                ${this.generateActionItems(engineOS, interfaceOS, safeModeOS)}
                            </ol>
                        </div>
                    </div>
                `;
                
                const resultsScreen = document.getElementById('results-screen');
                if (resultsScreen) {
                    resultsScreen.appendChild(strategySection);
                }
            }
            
            // 相互作用分析メソッド
            analyzeEngineToInterface(engineOS, interfaceOS) {
                const compatibility = this.calculateTrigramCompatibility(engineOS.upperTrigram, interfaceOS.upperTrigram);
                if (compatibility > 0.7) return "内面と外面が調和し、一貫性のある人格表現が可能";
                if (compatibility > 0.4) return "適度なバランスで、状況に応じた使い分けが可能";
                return "内外のギャップを活かし、多面的な魅力を発揮";
            }
            
            analyzeInterfaceToSafeMode(interfaceOS, safeModeOS) {
                if (interfaceOS.upperTrigram === safeModeOS.upperTrigram) {
                    return "ストレス時も社会性を保持し、周囲との関係を維持";
                }
                return "ストレス時は普段と異なる対処法で、新たな側面を発揮";
            }
            
            analyzeEngineToSafeMode(engineOS, safeModeOS) {
                const energyMap = {"乾": "陽", "兌": "陽", "離": "陽", "震": "陽", "巽": "陰", "坎": "陰", "艮": "陰", "坤": "陰"};
                if (energyMap[engineOS.upperTrigram] === energyMap[safeModeOS.upperTrigram]) {
                    return "本質的な価値観に基づいた自然な防御反応";
                }
                return "価値観を補完する形での適応的な防御メカニズム";
            }
            
            calculateOverallBalance(engineOS, interfaceOS, safeModeOS) {
                const scores = this.calculateScores();
                const variance = Object.values(scores).reduce((acc, val, _, arr) => {
                    const mean = arr.reduce((a, b) => a + b) / arr.length;
                    return acc + Math.pow(val - mean, 2);
                }, 0) / Object.values(scores).length;
                
                if (variance < 10) return "⭐⭐⭐⭐⭐ 極めてバランスの取れた統合システム";
                if (variance < 20) return "⭐⭐⭐⭐ 良好なバランスで機能する調和システム";
                if (variance < 30) return "⭐⭐⭐ 特徴的な強みを持つ個性的システム";
                return "⭐⭐ 明確な特化型の専門システム";
            }
            
            // レーダーチャート描画
            drawInteractionRadar(engineOS, interfaceOS, safeModeOS) {
                const canvas = document.getElementById('os-interaction-radar');
                if (!canvas) return;
                
                const ctx = canvas.getContext('2d');
                const scores = this.calculateScores();
                
                new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: ['創造性', '行動力', '探求心', '安定性', '受容性', '適応性', '表現力', '調和性'],
                        datasets: [
                            {
                                label: 'Engine OS',
                                data: Object.values(scores).map((s, i) => i < 2 ? s * 1.2 : s * 0.8),
                                borderColor: '#6366f1',
                                backgroundColor: 'rgba(99, 102, 241, 0.2)'
                            },
                            {
                                label: 'Interface OS',
                                data: Object.values(scores).map((s, i) => i >= 2 && i < 4 ? s * 1.2 : s * 0.8),
                                borderColor: '#8b5cf6',
                                backgroundColor: 'rgba(139, 92, 246, 0.2)'
                            },
                            {
                                label: 'Safe Mode OS',
                                data: Object.values(scores).map((s, i) => i >= 6 ? s * 1.2 : s * 0.8),
                                borderColor: '#10b981',
                                backgroundColor: 'rgba(16, 185, 129, 0.2)'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            r: {
                                beginAtZero: true,
                                max: 100
                            }
                        }
                    }
                });
            }
            
            // 成長戦略生成メソッド
            generateShortTermGoals(engineOS, interfaceOS, safeModeOS) {
                const goals = {
                    "乾": "リーダーシップスキルを磨くためのプロジェクトに参加",
                    "坤": "チームワークを重視した協働プロジェクトへの貢献",
                    "震": "新しいチャレンジに積極的に取り組む",
                    "巽": "変化に対応する柔軟性を高める練習"
                };
                return goals[engineOS.upperTrigram] || "自己理解を深めるための日記やフィードバックの収集";
            }
            
            generateMidTermGoals(engineOS, interfaceOS, safeModeOS) {
                return `${interfaceOS.upperTrigram}の特性を活かした人脈構築と、${safeModeOS.upperTrigram}の防御パターンを理解した上でのストレス管理法の確立`;
            }
            
            generateLongTermVision(engineOS, interfaceOS, safeModeOS) {
                return `Engine OS（${engineOS.upperTrigram}）の価値観に基づいた人生の方向性を定め、Interface OS（${interfaceOS.upperTrigram}）を通じて社会的影響力を拡大し、Safe Mode OS（${safeModeOS.upperTrigram}）による持続可能な成長を実現する`;
            }
            
            generateActionItems(engineOS, interfaceOS, safeModeOS) {
                return `
                    <li>今週中に${engineOS.upperTrigram}の強みを活かせる小さなタスクを1つ実行</li>
                    <li>${interfaceOS.upperTrigram}の特性を意識した新しい人との出会いを1つ作る</li>
                    <li>${safeModeOS.upperTrigram}のストレス解消法を1日10分実践</li>
                    <li>Triple OSの理解を深めるため、日々の行動を観察記録</li>
                    <li>1ヶ月後に再度分析を行い、成長を確認</li>
                `;
            }
            
            displayScoreSummary() {
                const scores = this.calculateScores();
                const sortedScores = Object.entries(scores)
                    .sort((a, b) => b[1] - a[1]);
                
                // 結果サマリーエリアに詳細を表示
                const summaryText = document.querySelector('.summary-text');
                if (summaryText) {
                    const topDimensions = sortedScores.slice(0, 3)
                        .map(([dim, score]) => {
                            const names = {
                                qian_creativity: "創造性",
                                zhen_action: "行動力",
                                kan_exploration: "探求心",
                                gen_stability: "安定性",
                                kun_receptiveness: "受容性",
                                xun_adaptability: "適応性",
                                li_expression: "表現力",
                                dui_harmony: "調和性"
                            };
                            return names[dim] || dim;
                        });
                    
                    summaryText.innerHTML = `
                        <p>あなたのTriple OSシステムは、特に「${topDimensions[0]}」「${topDimensions[1]}」「${topDimensions[2]}」が優れています。</p>
                        <p>この組み合わせは、あなたの多面的な人格構造を示しており、状況に応じて異なるOSが作動することで、柔軟かつ効果的な対応が可能になります。</p>
                    `;
                }
            }
            
            // 透明化分析機能
            displayTransparencyAnalysis(engineOS, interfaceOS, safeModeOS) {
                // 質問-スコア変換の表示
                this.displayQuestionScoreBreakdown();
                
                // スコア-卦変換ロジックの説明
                this.displayHexagramConversionLogic(engineOS, interfaceOS, safeModeOS);
                
                // 詳細結果説明
                this.displayDetailedResultExplanation(engineOS, interfaceOS, safeModeOS);
                
                // 透明化タブの各種分析表示を追加
                this.displayHarmonyAnalysis(engineOS, interfaceOS, safeModeOS);
                this.displayComplementAnalysis(engineOS, interfaceOS, safeModeOS);
                this.displayConflictAnalysis(engineOS, interfaceOS, safeModeOS);
                this.displayCreativityAdvice(engineOS, interfaceOS, safeModeOS);
                this.displayEnergyLossAnalysis(engineOS, interfaceOS, safeModeOS);
                this.displayOptimizationActions(engineOS, interfaceOS, safeModeOS);
            }
            
            displayQuestionScoreBreakdown() {
                const container = document.getElementById('question-score-breakdown');
                if (!container) return;
                
                let html = '';
                QUESTIONS.forEach((question, index) => {
                    const answer = this.answers[question.id];
                    if (!answer) return;
                    
                    const selectedOption = question.options.find(opt => opt.value === answer);
                    if (!selectedOption) return;
                    
                    html += `
                        <div class="question-score-item">
                            <div class="question-text">質問${index + 1}: ${question.text}</div>
                            <div class="chosen-answer">あなたの回答: ${selectedOption.text}</div>
                            <div class="score-details">
                    `;
                    
                    if (selectedOption.scoring) {
                        Object.entries(selectedOption.scoring).forEach(([dimension, score]) => {
                            const dimensionNames = {
                                qian_creativity: "創造性",
                                zhen_action: "行動力", 
                                kan_exploration: "探求心",
                                gen_stability: "安定性",
                                kun_receptiveness: "受容性",
                                xun_adaptability: "適応性",
                                li_expression: "表現力",
                                dui_harmony: "調和性"
                            };
                            
                            const scoreClass = score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
                            html += `
                                <div class="dimension-score ${scoreClass}">
                                    <div class="dimension-name">${dimensionNames[dimension]}</div>
                                    <div class="dimension-value">${score > 0 ? '+' : ''}${score}</div>
                                </div>
                            `;
                        });
                    }
                    
                    html += `
                            </div>
                        </div>
                    `;
                });
                
                container.innerHTML = html;
            }
            
            displayHexagramConversionLogic(engineOS, interfaceOS, safeModeOS) {
                const container = document.getElementById('hexagram-conversion-logic');
                if (!container) return;
                
                const scores = this.calculateScores();
                const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
                
                container.innerHTML = `
                    <div class="conversion-step">
                        <div class="step-title">ステップ1: 8次元スコア算出</div>
                        <div class="step-description">
                            全24問の質問回答から、8つの次元（創造性・行動力・探求心・安定性・受容性・適応性・表現力・調和性）のスコアを算出。
                            各回答選択肢は複数の次元に対して正負の値を持ち、これらが累積されます。
                        </div>
                        <div class="score-summary">
                            <strong>最終スコア:</strong> ${sortedScores.map(([dim, score]) => {
                                const names = {
                                    qian_creativity: "創造性", zhen_action: "行動力", kan_exploration: "探求心", 
                                    gen_stability: "安定性", kun_receptiveness: "受容性", xun_adaptability: "適応性", 
                                    li_expression: "表現力", dui_harmony: "調和性"
                                };
                                return `${names[dim]}: ${score}`;
                            }).join(', ')}}
                        </div>
                    </div>
                    
                    <div class="conversion-step">
                        <div class="step-title">ステップ2: Triple OS決定</div>
                        <div class="step-description">
                            <strong>Engine OS:</strong> 最高得点の2次元から上卦・下卦を決定<br>
                            <strong>Interface OS:</strong> 2-3番目の得点次元から決定<br>  
                            <strong>Safe Mode OS:</strong> 最低得点次元（防御機制）から決定
                        </div>
                    </div>
                    
                    <div class="conversion-step">
                        <div class="step-title">ステップ3: 易経64卦への変換</div>
                        <div class="step-description">
                            各次元は易経の八卦（乾・兌・離・震・巽・坎・艮・坤）に対応。
                            上卦と下卦の組み合わせから64卦のうち該当する卦を特定し、
                            その卦が持つ象徴的意味をあなたの性格特性として解釈します。
                        </div>
                    </div>
                `;
            }
            
            displayDetailedResultExplanation(engineOS, interfaceOS, safeModeOS) {
                const container = document.getElementById('detailed-result-explanation');
                if (!container) return;
                
                container.innerHTML = `
                    <div class="explanation-card">
                        <h5>🎯 Engine OS（第${engineOS.hexagramId}卦）の根拠</h5>
                        <p>あなたの価値観システムが第${engineOS.hexagramId}卦になった理由は、「${engineOS.upperTrigram}」（${engineOS.primaryDimension}）と「${engineOS.lowerTrigram}」（${engineOS.secondaryDimension}）の次元で最高スコアを獲得したためです。これは質問への回答パターンから、あなたが深層心理でこれらの価値を最も重視していることを示しています。</p>
                    </div>
                    
                    <div class="explanation-card">
                        <h5>💬 Interface OS（第${interfaceOS.hexagramId}卦）の根拠</h5>
                        <p>社会的な場面での振る舞いを示すInterface OSは、Engine OSほど強くはないが安定して高いスコアを示す次元から構成されます。これにより、本質的価値観とは異なる「社会的な顔」の特徴が現れます。</p>
                    </div>
                    
                    <div class="explanation-card">  
                        <h5>🛡️ Safe Mode OS（第${safeModeOS.hexagramId}卦）の根拠</h5>
                        <p>ストレス下での防御機制を示すSafe Mode OSは、通常時とは逆の特性（相対的に低スコアの次元）から構成されます。これは心理学的防御メカニズムの理論に基づき、平常時とは正反対の行動パターンを取ることを表現しています。</p>
                    </div>
                `;
            }
            
            // 実践活用ガイド機能  
            displayPracticalGuides(engineOS, interfaceOS, safeModeOS) {
                // 今日のOS活用法
                this.displayDailyUsageGuide(engineOS, interfaceOS, safeModeOS);
                
                // シチュエーション別アドバイス
                this.displaySituationalAdvice(engineOS, interfaceOS, safeModeOS);
                
                // Triple OS相性ガイド
                this.displayCompatibilityGuide(engineOS, interfaceOS, safeModeOS);
            }
            
            displayDailyUsageGuide(engineOS, interfaceOS, safeModeOS) {
                const container = document.getElementById('daily-os-usage');
                if (!container) return;
                
                const today = new Date();
                const dayOfWeek = today.getDay();
                const hour = today.getHours();
                
                // 時間帯と曜日に基づく推奨OS
                let recommendedOS = 'Engine';
                let timeContext = '朝の時間';
                
                if (hour < 12) {
                    recommendedOS = 'Engine';
                    timeContext = '朝の集中時間';
                } else if (hour < 18) {
                    recommendedOS = 'Interface'; 
                    timeContext = '午後の活動時間';
                } else {
                    recommendedOS = 'Safe Mode';
                    timeContext = '夕方以降のリラックス時間';
                }
                
                const weekdayAdvice = dayOfWeek === 0 || dayOfWeek === 6 ? 'weekend' : 'weekday';
                
                container.innerHTML = `
                    <div class="daily-usage-card">
                        <div class="usage-title">
                            🌟 今日（${timeContext}）のメイン活用OS
                        </div>
                        <div class="usage-description">
                            現在の時間帯では<strong>${recommendedOS} OS</strong>を中心に行動することを推奨します。
                            ${this.getTimeBasedAdvice(recommendedOS, engineOS, interfaceOS, safeModeOS)}
                        </div>
                        <div class="usage-actions">
                            ${this.getDailyActionTags(recommendedOS, engineOS, interfaceOS, safeModeOS)}
                        </div>
                    </div>
                    
                    <div class="daily-usage-card">
                        <div class="usage-title">
                            📅 ${weekdayAdvice === 'weekend' ? '週末' : '平日'}の戦略的切り替え
                        </div>
                        <div class="usage-description">
                            ${this.getWeeklyAdvice(weekdayAdvice, engineOS, interfaceOS, safeModeOS)}
                        </div>
                        <div class="usage-actions">
                            <span class="usage-action-tag">Engine切り替えタイミング確認</span>
                            <span class="usage-action-tag">Interface調整実践</span>
                            <span class="usage-action-tag">Safe Mode準備</span>
                        </div>
                    </div>
                `;
            }
            
            getTimeBasedAdvice(recommendedOS, engineOS, interfaceOS, safeModeOS) {
                const osData = {
                    'Engine': engineOS,
                    'Interface': interfaceOS, 
                    'Safe Mode': safeModeOS
                };
                
                const currentOS = osData[recommendedOS];
                
                switch(recommendedOS) {
                    case 'Engine':
                        return `あなたの${currentOS.upperTrigram}の特性を活かし、価値観に沿った重要なタスクに集中する時間です。`;
                    case 'Interface':
                        return `${currentOS.upperTrigram}の社交性を発揮し、他者との関わりやコミュニケーションを重視する時間です。`;
                    case 'Safe Mode':
                        return `${currentOS.upperTrigram}の防御機制を適切に使い、ストレスケアと自分時間を大切にしましょう。`;
                    default:
                        return 'バランスよく各OSを切り替えることを意識してください。';
                }
            }
            
            getDailyActionTags(recommendedOS, engineOS, interfaceOS, safeModeOS) {
                const actions = {
                    'Engine': ['深い思考時間', '価値観確認', '重要タスク実行'],
                    'Interface': ['人との対話', '社会的活動', 'チームワーク発揮'],
                    'Safe Mode': ['セルフケア', 'ストレス解消', '静かな時間']
                };
                
                return actions[recommendedOS]?.map(action => 
                    `<span class="usage-action-tag">${action}</span>`
                ).join('') || '';
            }
            
            getWeeklyAdvice(weekdayAdvice, engineOS, interfaceOS, safeModeOS) {
                if (weekdayAdvice === 'weekend') {
                    return `週末は${engineOS.upperTrigram}のEngine OSで自分らしい活動に集中し、${safeModeOS.upperTrigram}のSafe Mode OSでリカバリーを図りましょう。Interface OSは最小限にして、本来の自分と向き合う時間を大切にしてください。`;
                } else {
                    return `平日は${interfaceOS.upperTrigram}のInterface OSを中心に社会的な役割をこなし、重要な判断は${engineOS.upperTrigram}のEngine OSに切り替える。疲労時は${safeModeOS.upperTrigram}のSafe Mode OSで適切に回復してください。`;
                }
            }
            
            displaySituationalAdvice(engineOS, interfaceOS, safeModeOS) {
                const container = document.getElementById('situational-advice');
                if (!container) return;
                
                const situations = [
                    {
                        title: '🏢 職場・ビジネスシーン',
                        engine: this.getWorkAdvice('engine', engineOS),
                        interface: this.getWorkAdvice('interface', interfaceOS),
                        safemode: this.getWorkAdvice('safemode', safeModeOS)
                    },
                    {
                        title: '💕 恋愛・パートナーシップ',
                        engine: this.getRelationshipAdvice('engine', engineOS),
                        interface: this.getRelationshipAdvice('interface', interfaceOS), 
                        safemode: this.getRelationshipAdvice('safemode', safeModeOS)
                    },
                    {
                        title: '👥 友人・社交関係',
                        engine: this.getSocialAdvice('engine', engineOS),
                        interface: this.getSocialAdvice('interface', interfaceOS),
                        safemode: this.getSocialAdvice('safemode', safeModeOS)
                    },
                    {
                        title: '🎯 個人的成長・学習',
                        engine: this.getGrowthAdvice('engine', engineOS),
                        interface: this.getGrowthAdvice('interface', interfaceOS),
                        safemode: this.getGrowthAdvice('safemode', safeModeOS)
                    }
                ];
                
                let html = '';
                situations.forEach(situation => {
                    html += `
                        <div class="situation-advice-item">
                            <div class="situation-title">${situation.title}</div>
                            <div class="advice-content">
                                <div class="advice-card">
                                    <div class="advice-label">Engine OS活用</div>
                                    <div class="advice-text">${situation.engine}</div>
                                </div>
                                <div class="advice-card">
                                    <div class="advice-label">Interface OS活用</div>
                                    <div class="advice-text">${situation.interface}</div>
                                </div>
                                <div class="advice-card">
                                    <div class="advice-label">Safe Mode OS活用</div>
                                    <div class="advice-text">${situation.safemode}</div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                container.innerHTML = html;
            }
            
            getWorkAdvice(osType, osData) {
                const trigramAdvice = {
                    '乾': { engine: '革新的プロジェクトのリード', interface: '強いリーダーシップ発揮', safemode: '一人で集中できる環境確保' },
                    '兌': { engine: '創造的なアイデア提案', interface: '楽しい職場環境作り', safemode: '適度な息抜きと笑い' },
                    '離': { engine: '明確なビジョン提示', interface: '熱意ある説明と説得', safemode: '静かな場所での思考整理' },
                    '震': { engine: '迅速な行動と決断', interface: '積極的な提案と実行', safemode: '計画的な休息と準備' },
                    '巽': { engine: '段階的な改善提案', interface: '柔軟な協調とサポート', safemode: '慎重な判断と準備' },
                    '坎': { engine: '深い分析と洞察', interface: '信頼関係の慎重な構築', safemode: '困難な状況への適応力' },
                    '艮': { engine: '着実な基盤構築', interface: '安定した信頼関係維持', safemode: '確実性を重視した判断' },
                    '坤': { engine: 'チーム全体のサポート', interface: '協調性と受容性発揮', safemode: '包容力による問題解決' }
                };
                
                return trigramAdvice[osData.upperTrigram]?.[osType] || '状況に応じて適切に判断';
            }
            
            getRelationshipAdvice(osType, osData) {
                const trigramAdvice = {
                    '乾': { engine: '理想と価値観の共有', interface: '積極的なリードと提案', safemode: '個人時間の確保' },
                    '兌': { engine: '楽しさと喜びの追求', interface: '明るい関係性構築', safemode: '軽やかな距離感維持' },
                    '離': { engine: '情熱的な愛情表現', interface: '魅力的な自己表現', safemode: '感情の整理時間' },
                    '震': { engine: '行動による愛情表現', interface: 'サプライズと刺激提供', safemode: '冷静な判断時間' },
                    '巽': { engine: '相手への配慮と適応', interface: '穏やかな関係育成', safemode: '慎重な距離調整' },
                    '坎': { engine: '深い理解と洞察', interface: '真摯な対話重視', safemode: '内面の保護と確保' },
                    '艮': { engine: '安定した関係構築', interface: '信頼できる存在', safemode: '確実性重視の選択' },
                    '坤': { engine: '包容力と受容性', interface: '支えあう関係性', safemode: '穏やかな環境確保' }
                };
                
                return trigramAdvice[osData.upperTrigram]?.[osType] || '相手との調和を大切に';
            }
            
            getSocialAdvice(osType, osData) {
                const trigramAdvice = {
                    '乾': { engine: 'グループのビジョン提示', interface: '積極的な交流リード', safemode: '質の高い少数関係' },
                    '兌': { engine: '楽しい企画と提案', interface: '場を盛り上げる役割', safemode: '気軽な関係維持' },
                    '離': { engine: '情熱的な話題提供', interface: '魅力的な人格表現', safemode: '適度な自己開示' },
                    '震': { engine: '新しい活動提案', interface: 'エネルギッシュな参加', safemode: '適度な刺激調整' },
                    '巽': { engine: '和やかな雰囲気作り', interface: '細やかな気配り発揮', safemode: '控えめな関係維持' },
                    '坎': { engine: '深い対話重視', interface: '真の理解を求める', safemode: '信頼関係の厳選' },
                    '艮': { engine: '長期的な友情構築', interface: '安定した関係維持', safemode: '確実な関係のみ' },
                    '坤': { engine: '包容力ある支援', interface: '皆をサポートする役割', safemode: '穏やかな環境選択' }
                };
                
                return trigramAdvice[osData.upperTrigram]?.[osType] || 'バランスの取れた交流を';
            }
            
            getGrowthAdvice(osType, osData) {
                const trigramAdvice = {
                    '乾': { engine: '高い目標設定と挑戦', interface: 'リーダーシップスキル向上', safemode: '独立した学習環境' },
                    '兌': { engine: '創造的な学習方法', interface: '楽しい学習コミュニティ', safemode: '軽やかな学習継続' },
                    '離': { engine: '明確な成果目標設定', interface: '表現力とプレゼン向上', safemode: '集中できる学習環境' },
                    '震': { engine: '実践的なスキル習得', interface: '積極的な実践機会', safemode: '段階的な挑戦レベル' },
                    '巽': { engine: '継続的な改善と向上', interface: '協調的な学習環境', safemode: '無理のないペース維持' },
                    '坎': { engine: '深い専門性の追求', interface: '質の高い師や環境', safemode: '困難への対処法習得' },
                    '艮': { engine: '着実な基礎固め', interface: '安定した学習環境', safemode: '確実な知識の蓄積' },
                    '坤': { engine: '全体的な理解深化', interface: 'サポート重視の学習', safemode: '穏やかな成長環境' }
                };
                
                return trigramAdvice[osData.upperTrigram]?.[osType] || '自分らしい成長を';
            }
            
            displayCompatibilityGuide(engineOS, interfaceOS, safeModeOS) {
                const container = document.getElementById('compatibility-guide');
                if (!container) return;
                
                const osTypes = [
                    { type: 'Engine主導型', score: this.calculateCompatibilityScore('engine', engineOS, interfaceOS, safeModeOS) },
                    { type: 'Interface主導型', score: this.calculateCompatibilityScore('interface', engineOS, interfaceOS, safeModeOS) },
                    { type: 'Safe Mode主導型', score: this.calculateCompatibilityScore('safemode', engineOS, interfaceOS, safeModeOS) },
                    { type: 'バランス型', score: this.calculateCompatibilityScore('balanced', engineOS, interfaceOS, safeModeOS) }
                ];
                
                let html = '';
                osTypes.forEach(osType => {
                    html += `
                        <div class="compatibility-item">
                            <div class="compatibility-header">
                                <div class="compatibility-type">${osType.type}</div>
                                <div class="compatibility-score">${osType.score}%</div>
                            </div>
                            <div class="compatibility-details">
                                ${this.getCompatibilityDetails(osType.type, engineOS, interfaceOS, safeModeOS)}
                            </div>
                        </div>
                    `;
                });
                
                container.innerHTML = html;
            }
            
            calculateCompatibilityScore(targetType, engineOS, interfaceOS, safeModeOS) {
                // 簡易的な相性スコア計算
                const scores = this.calculateScores();
                const variance = Object.values(scores).reduce((acc, val, _, arr) => {
                    const mean = arr.reduce((a, b) => a + b) / arr.length;
                    return acc + Math.pow(val - mean, 2);
                }, 0) / Object.values(scores).length;
                
                switch(targetType) {
                    case 'engine': return Math.min(95, 60 + Math.floor(engineOS.score / 2));
                    case 'interface': return Math.min(90, 55 + Math.floor(interfaceOS.score / 2));
                    case 'safemode': return Math.min(85, 50 + Math.floor(safeModeOS.score / 2));
                    case 'balanced': return variance < 15 ? 95 : 70;
                    default: return 70;
                }
            }
            
            getCompatibilityDetails(osType, engineOS, interfaceOS, safeModeOS) {
                const details = {
                    'Engine主導型': {
                        strength: `あなたのEngine OS（${engineOS.upperTrigram}）との価値観共鳴`,
                        challenge: 'Interface OSでの表現方法の違いに注意',
                        advice: '深い価値観レベルでの対話を重視'
                    },
                    'Interface主導型': {
                        strength: `社交的なInterface OS（${interfaceOS.upperTrigram}）での自然な交流`,
                        challenge: 'Engine OSレベルでの理解に時間が必要',
                        advice: '表面的な関係から徐々に深める'
                    },
                    'Safe Mode主導型': {
                        strength: `困難時の${safeModeOS.upperTrigram}的対処法の理解`,
                        challenge: '平常時のコミュニケーションスタイルの違い',
                        advice: 'ストレス時の相互理解とサポート'
                    },
                    'バランス型': {
                        strength: '状況に応じた柔軟な関係調整が可能',
                        challenge: '一貫性のある深い関係構築に工夫が必要',
                        advice: '各OSレベルでの段階的な関係発展'
                    }
                };
                
                const detail = details[osType] || details['バランス型'];
                
                return `
                    <div class="compatibility-aspect">
                        <div class="aspect-title">強み・相性の良さ</div>
                        <div class="aspect-description">${detail.strength}</div>
                    </div>
                    <div class="compatibility-aspect">
                        <div class="aspect-title">注意点・課題</div>
                        <div class="aspect-description">${detail.challenge}</div>
                    </div>
                    <div class="compatibility-aspect">
                        <div class="aspect-title">関係構築のアドバイス</div>
                        <div class="aspect-description">${detail.advice}</div>
                    </div>
                `;
            }
            
            // Triple OSシナジー分析機能（64卦完全対応）
            displaySynergyAnalysis(engineOS, interfaceOS, safeModeOS) {
                // windowオブジェクトに登録されたグローバル関数を呼ぶ
                if (window.displayGoldenPatternAnalysis64) {
                    window.displayGoldenPatternAnalysis64(engineOS, interfaceOS);
                }
                
                if (window.displayTripleOSInteractionAnalysis) {
                    window.displayTripleOSInteractionAnalysis(engineOS, interfaceOS, safeModeOS);
                }
                
                if (window.displayCompatibilityDiagnosis64) {
                    window.displayCompatibilityDiagnosis64(engineOS, interfaceOS, safeModeOS);
                }
                
                // OS連携メカニズム解説
                this.displayCoordinationMechanism(engineOS, interfaceOS, safeModeOS);
                
                // 🔄 2025/08/10 RENEWED: 64卦シナジー分析に統合済み（互換性維持）
                // Legacy synergy analysis integrated - no separate display needed
                console.log('Legacy synergy analysis integrated into main synergy display');
            }
            
            displayPracticalGuides(engineOS, interfaceOS, safeModeOS) {
                // 毎日の活用ガイド
                this.displayDailyPracticalGuide(engineOS, interfaceOS, safeModeOS);
                
                // 人間関係戦略
                this.displayRelationshipStrategies(engineOS, interfaceOS, safeModeOS);
                
                // キャリア活用法
                this.displayCareerApplications(engineOS, interfaceOS, safeModeOS);
                
                // ストレス対処法
                this.displayStressManagement(engineOS, interfaceOS, safeModeOS);
            }
            
            displayDailyPracticalGuide(engineOS, interfaceOS, safeModeOS) {
                const container = document.getElementById('daily-practical-guide');
                if (!container) return;
                
                container.innerHTML = `
                    <h4 class="subsection-title">📅 毎日の活用ガイド</h4>
                    <div class="guide-sections">
                        <div class="guide-section">
                            <h5>🌅 朝のエネルギー活用法</h5>
                            <p>${this.getDailyAdvice('morning', engineOS)}</p>
                        </div>
                        <div class="guide-section">
                            <h5>🏢 仕事での活用法</h5>
                            <p>${this.getDailyAdvice('work', interfaceOS)}</p>
                        </div>
                        <div class="guide-section">
                            <h5>🌙 夜のリセット法</h5>
                            <p>${this.getDailyAdvice('evening', safeModeOS)}</p>
                        </div>
                    </div>
                `;
            }
            
            displayRelationshipStrategies(engineOS, interfaceOS, safeModeOS) {
                const container = document.getElementById('relationship-strategies');
                if (!container) return;
                
                container.innerHTML = `
                    <h4 class="subsection-title">🤝 人間関係戦略</h4>
                    <div class="strategy-grid">
                        <div class="strategy-item">
                            <h5>👥 職場での関係構築</h5>
                            <p>${this.getRelationshipAdvice('workplace', interfaceOS)}</p>
                        </div>
                        <div class="strategy-item">
                            <h5>💕 プライベートでの関係</h5>
                            <p>${this.getRelationshipAdvice('private', engineOS)}</p>
                        </div>
                        <div class="strategy-item">
                            <h5>🚨 困った時の対処法</h5>
                            <p>${this.getRelationshipAdvice('crisis', safeModeOS)}</p>
                        </div>
                    </div>
                `;
            }
            
            displayCareerApplications(engineOS, interfaceOS, safeModeOS) {
                const container = document.getElementById('career-applications');
                if (!container) return;
                
                container.innerHTML = `
                    <h4 class="subsection-title">💼 キャリア活用法</h4>
                    <div class="career-advice">
                        <div class="advice-item">
                            <h5>🎯 最適な職種・業界</h5>
                            <p>${this.getCareerAdvice('industry', engineOS)}</p>
                        </div>
                        <div class="advice-item">
                            <h5>📈 昇進・評価戦略</h5>
                            <p>${this.getCareerAdvice('promotion', interfaceOS)}</p>
                        </div>
                        <div class="advice-item">
                            <h5>🔄 転職・キャリアチェンジ</h5>
                            <p>${this.getCareerAdvice('change', safeModeOS)}</p>
                        </div>
                    </div>
                `;
            }
            
            displayStressManagement(engineOS, interfaceOS, safeModeOS) {
                const container = document.getElementById('stress-management');
                if (!container) return;
                
                container.innerHTML = `
                    <h4 class="subsection-title">⚡ ストレス対処法</h4>
                    <div class="stress-methods">
                        <div class="method-item">
                            <h5>🧘 日常的なケア</h5>
                            <p>${this.getStressAdvice('daily', safeModeOS)}</p>
                        </div>
                        <div class="method-item">
                            <h5>🚨 緊急時の対処</h5>
                            <p>${this.getStressAdvice('emergency', safeModeOS)}</p>
                        </div>
                        <div class="method-item">
                            <h5>💪 長期的な回復</h5>
                            <p>${this.getStressAdvice('recovery', engineOS)}</p>
                        </div>
                    </div>
                `;
            }
            
            getDailyAdvice(timeType, osData) {
                const adviceMap = {
                    morning: {
                        1: "天の龍のように朝から創造的なエネルギーを発揮しましょう",
                        2: "大地のような安定した心で一日を始めましょう",
                        default: "あなたのエネルギーを朝の活動に活かしましょう"
                    },
                    work: {
                        1: "リーダーシップを発揮して新しいアイデアを提案しましょう",
                        2: "周りをサポートし調和的な環境を作りましょう",
                        default: "あなたの特性を仕事で活用しましょう"
                    },
                    evening: {
                        1: "創造的な活動でエネルギーをリセットしましょう",
                        2: "静かな環境で心を整えましょう",
                        default: "一日の疲れを癒すあなただけの方法を見つけましょう"
                    }
                };
                
                return adviceMap[timeType][osData.hexagramId] || adviceMap[timeType].default;
            }
            
            getRelationshipAdvice(situationType, osData) {
                const relationshipAdvice = {
                    workplace: {
                        1: "積極的にチームを引っ張り、新しい提案を行いましょう",
                        2: "周りの意見を聞き、調和を重視した関係を築きましょう",
                        default: "あなたの特性を活かした職場での関係作りを心がけましょう"
                    },
                    private: {
                        1: "創造的な活動を一緒に楽しめる関係を大切にしましょう",
                        2: "相手を受け入れ、支え合う関係を築きましょう",
                        default: "自然体でいられる関係を大切にしましょう"
                    },
                    crisis: {
                        1: "問題解決に向けて積極的に行動しましょう",
                        2: "相手の気持ちを受け止め、時間をかけて解決しましょう",
                        default: "冷静に状況を整理し、適切な対処を心がけましょう"
                    }
                };
                
                return relationshipAdvice[situationType][osData.hexagramId] || relationshipAdvice[situationType].default;
            }
            
            getCareerAdvice(careerType, osData) {
                const careerAdvice = {
                    industry: {
                        1: "創造性を活かせるクリエイティブ業界や新規事業開発が適しています",
                        2: "サポート業務やコンサルティング、教育分野が適しています",
                        default: "あなたの強みを活かせる分野を探しましょう"
                    },
                    promotion: {
                        1: "新しい提案や改革案を積極的に提示しましょう",
                        2: "チームの調和を保ちながら着実に実績を積みましょう",
                        default: "あなたの特性を活かした成果をアピールしましょう"
                    },
                    change: {
                        1: "思い切って新しい分野に挑戦するタイミングです",
                        2: "慎重に検討し、準備を整えてから行動しましょう",
                        default: "あなたに合ったペースで変化を検討しましょう"
                    }
                };
                
                return careerAdvice[careerType][osData.hexagramId] || careerAdvice[careerType].default;
            }
            
            getStressAdvice(stressType, osData) {
                const stressAdvice = {
                    daily: {
                        1: "創造的な活動や新しいことにチャレンジしてリフレッシュ",
                        2: "自然の中で静かに過ごしたり、瞑想でエネルギーを回復",
                        default: "あなたに合ったリラックス方法を見つけましょう"
                    },
                    emergency: {
                        1: "問題に積極的に向き合い、解決策を見つける行動を",
                        2: "深呼吸して落ち着き、信頼できる人に相談を",
                        default: "まずは冷静になり、状況を整理しましょう"
                    },
                    recovery: {
                        1: "新しい環境や活動でエネルギーを再充電",
                        2: "安定した環境で十分な休息を取りましょう",
                        default: "あなたのペースで回復に向けた計画を立てましょう"
                    }
                };
                
                return stressAdvice[stressType][osData.hexagramId] || stressAdvice[stressType].default;
            }
            
            displayGoldenPatternAnalysis(engineOS, interfaceOS) {
                const container = document.getElementById('golden-pattern-analysis');
                if (!container) return;
                
                const compatibility = this.calculateTrigramCompatibility(engineOS.upperTrigram, interfaceOS.upperTrigram);
                const patternType = this.getPatternType(engineOS.upperTrigram, interfaceOS.upperTrigram);
                
                container.innerHTML = `
                    <div class="golden-pattern-result">
                        <div class="pattern-combination">
                            <h4>${engineOS.upperTrigram}（${this.getTrigramType(engineOS.upperTrigram)}）× ${interfaceOS.upperTrigram}（${this.getTrigramType(interfaceOS.upperTrigram)}）</h4>
                            <div class="compatibility-rate">相性度: ${Math.round(compatibility * 100)}%</div>
                        </div>
                        <div class="pattern-description">
                            ${this.getPatternDescription(patternType, engineOS.upperTrigram, interfaceOS.upperTrigram)}
                        </div>
                        <div class="social-success-potential">
                            <h5>🎯 社会的成功ポテンシャル</h5>
                            ${this.getSocialSuccessPotential(engineOS.upperTrigram, interfaceOS.upperTrigram)}
                        </div>
                    </div>
                `;
                
                // 成功パターン例を表示
                this.displaySuccessPatterns(engineOS.upperTrigram, interfaceOS.upperTrigram);
                
                // 要注意パターンを表示
                this.displayWarningPatterns(engineOS.upperTrigram, interfaceOS.upperTrigram);
            }
            
            displaySuccessPatterns(engineTrigram, interfaceTrigram) {
                const container = document.getElementById('success-patterns');
                if (!container) return;
                
                // H384データから動的にサクセスパターンを生成
                const generateSuccessPattern = (engine, inter) => {
                    // 各三爻のエネルギー特性定義
                    const trigramTraits = {
                        "乾": { name: "創造", energy: "能動", trait: "リーダーシップ" },
                        "兌": { name: "喜悦", energy: "表現", trait: "コミュニケーション" },
                        "離": { name: "明知", energy: "情熱", trait: "洞察力" },
                        "震": { name: "動力", energy: "行動", trait: "推進力" },
                        "巽": { name: "柔軟", energy: "適応", trait: "調整力" },
                        "坎": { name: "深慮", energy: "内省", trait: "探究心" },
                        "艮": { name: "安定", energy: "保守", trait: "着実性" },
                        "坤": { name: "受容", energy: "協調", trait: "包容力" }
                    };
                    
                    const engineTrait = trigramTraits[engine] || trigramTraits["乾"];
                    const interTrait = trigramTraits[inter] || trigramTraits["兌"];
                    
                    // 組み合わせパターンの動的生成
                    const title = `${engine}×${inter}: ${engineTrait.name}${interTrait.name}型`;
                    const desc = `${engineTrait.trait}と${interTrait.trait}の融合。${engineTrait.energy}的な内面を${interTrait.energy}的に表現する独自のスタイル。`;
                    
                    return { title, desc };
                };
                
                const example = generateSuccessPattern(engineTrigram, interfaceTrigram);
                
                container.innerHTML = `
                    <div class="pattern-item">
                        <div class="pattern-title">${example.title}</div>
                        <div class="pattern-description">${example.desc}</div>
                        <div class="pattern-advice">
                            💡 この組み合わせの強みを活かすには、${engineTrigram}の内的エネルギーを${interfaceTrigram}の表現スタイルで外に向けることが重要です。
                        </div>
                    </div>
                `;
            }
            
            displayWarningPatterns(engineTrigram, interfaceTrigram) {
                const container = document.getElementById('warning-patterns');
                if (!container) return;
                
                // H384データと易経理論から動的に警告パターンを生成
                const generateWarningPattern = (engine, inter) => {
                    // 対立関係の判定（易経の相克理論）
                    const oppositeMap = {
                        "乾": "坤", "坤": "乾",
                        "震": "艮", "艮": "震",
                        "坎": "離", "離": "坎",
                        "巽": "兌", "兌": "巽"
                    };
                    
                    const trigramTraits = {
                        "乾": { nature: "創造的", direction: "上昇" },
                        "坤": { nature: "受容的", direction: "安定" },
                        "震": { nature: "積極的", direction: "外向" },
                        "艮": { nature: "慎重", direction: "内向" },
                        "坎": { nature: "内省的", direction: "深化" },
                        "離": { nature: "外向的", direction: "拡散" },
                        "巽": { nature: "適応的", direction: "柔軟" },
                        "兌": { nature: "表現的", direction: "開放" }
                    };
                    
                    const engineTrait = trigramTraits[engine];
                    const interTrait = trigramTraits[inter];
                    
                    let title, desc;
                    
                    // 対立関係の場合
                    if (oppositeMap[engine] === inter) {
                        title = `${engine}×${inter}: 内外矛盾型`;
                        desc = `${engineTrait.nature}な内面と${interTrait.nature}な外面の根本的矛盾。エネルギーの方向性が真逆で、内的葛藤が生じやすい。`;
                    } else {
                        // その他の不調和パターン
                        const compatibility = this.calculateTrigramCompatibility(engine, inter);
                        if (compatibility < 0.5) {
                            title = `${engine}×${inter}: エネルギー不整合型`;
                            desc = `${engineTrait.direction}志向の内面と${interTrait.direction}志向の外面が噛み合わず、本来の力を発揮しきれない傾向。`;
                        } else {
                            title = `${engine}×${inter}: 調整必要型`;
                            desc = `基本的な相性は悪くないが、${engineTrait.nature}さと${interTrait.nature}さのバランス調整が必要。`;
                        }
                    }
                    
                    return { title, desc };
                };
                
                const example = generateWarningPattern(engineTrigram, interfaceTrigram);
                
                container.innerHTML = `
                    <div class="pattern-item warning">
                        <div class="pattern-title">${example.title}</div>
                        <div class="pattern-description">${example.desc}</div>
                        <div class="pattern-advice">
                            ⚠️ 改善ポイント: 内面の${engineTrigram}エネルギーと外面の${interfaceTrigram}表現の橋渡しを意識的に練習しましょう。
                        </div>
                    </div>
                `;
            }
            
            displayCompatibilityDiagnosis(engineOS, interfaceOS, safeModeOS) {
                // 内的一貫性スコアの算出
                const consistencyScore = this.calculateConsistencyScore(engineOS, interfaceOS, safeModeOS);
                const compatibilityType = this.getCompatibilityType(engineOS, interfaceOS, safeModeOS);
                
                // スコア表示
                const scoreElement = document.getElementById('consistency-value');
                const typeElement = document.getElementById('consistency-type');
                const scoreCircle = document.querySelector('.score-circle');
                
                if (scoreElement && typeElement && scoreCircle) {
                    scoreElement.textContent = Math.round(consistencyScore);
                    typeElement.textContent = compatibilityType;
                    
                    // CSSカスタムプロパティでスコア設定
                    scoreCircle.style.setProperty('--score-percentage', `${consistencyScore}%`);
                }
                
                // 相性タイプ別分析
                this.displayHarmonyAnalysis(engineOS, interfaceOS, safeModeOS);
                this.displayComplementAnalysis(engineOS, interfaceOS, safeModeOS);
                this.displayConflictAnalysis(engineOS, interfaceOS, safeModeOS);
                
                // 創造性アドバイス
                this.displayCreativityAdvice(engineOS, interfaceOS, safeModeOS);
            }
            
            displayCoordinationMechanism(engineOS, interfaceOS, safeModeOS) {
                // エネルギーロス分析
                this.displayEnergyLossAnalysis(engineOS, interfaceOS, safeModeOS);
                
                // 最適化アクション
                this.displayOptimizationActions(engineOS, interfaceOS, safeModeOS);
            }
            
            // ヘルパーメソッド
            getTrigramType(trigram) {
                const types = {
                    "乾": "クリエイター型", "兌": "コミュニケーター型", "離": "表現者型", "震": "アクション型",
                    "巽": "アダプター型", "坎": "探求者型", "艮": "安定型", "坤": "協調型"
                };
                return types[trigram] || "不明型";
            }
            
            getPatternType(engine, interfaceOS) {
                const compatibility = this.calculateTrigramCompatibility(engine, interfaceOS);
                if (compatibility > 0.7) return "黄金パターン";
                if (compatibility > 0.4) return "バランスパターン";
                return "要注意パターン";
            }
            
            getPatternDescription(type, engine, interfaceOS) {
                if (type === "黄金パターン") {
                    return `${engine}と${interfaceOS}の組み合わせは非常に調和的で、内面のエネルギーが外面の表現と自然に一致します。この相性の良さを活かして、持続的な成果を上げることができます。`;
                } else if (type === "バランスパターン") {
                    return `${engine}と${interfaceOS}の組み合わせは適度なバランスを保っています。時として内外のギャップを感じることもありますが、それが新しい視点や創造性を生み出すこともあります。`;
                } else {
                    return `${engine}と${interfaceOS}の組み合わせは対照的な特徴を持ちます。内面と外面のギャップが大きいため、エネルギーロスが生じやすいですが、適切に管理すれば独特の魅力となります。`;
                }
            }
            
            getSocialSuccessPotential(engine, interfaceOS) {
                const compatibility = this.calculateTrigramCompatibility(engine, interfaceOS);
                
                // H384データから該当する卦のポテンシャルスコアを取得
                const getTrigramPotential = (trigram) => {
                    // 三爻から代表的な卦を選択（先天八卦の純粋卦）
                    const trigramHexagrams = {
                        "乾": 1,  // 乾為天
                        "坤": 2,  // 坤為地
                        "震": 51, // 震為雷
                        "巽": 57, // 巽為風
                        "坎": 29, // 坎為水
                        "離": 30, // 離為火
                        "艮": 52, // 艮為山
                        "兌": 58  // 兌為沢
                    };
                    
                    const hexId = trigramHexagrams[trigram];
                    if (!hexId || !window.H384_DATA) return 50; // デフォルト値
                    
                    // 該当する卦のS2_ポテンシャルの平均を取得
                    const hexData = window.H384_DATA.filter(d => d.卦番号 === hexId);
                    if (hexData.length === 0) return 50;
                    
                    const avgPotential = hexData.reduce((sum, d) => sum + (d.S2_ポテンシャル || 50), 0) / hexData.length;
                    return avgPotential;
                };
                
                const enginePotential = getTrigramPotential(engine);
                const interfacePotential = getTrigramPotential(interfaceOS);
                const combinedPotential = (enginePotential + interfacePotential) / 2;
                
                // ポテンシャルとcompatibilityを組み合わせた総合評価
                const totalScore = (compatibility * 0.6 + combinedPotential / 100 * 0.4);
                
                if (totalScore > 0.7) {
                    return `🌟 高いポテンシャル（${Math.round(totalScore * 100)}%）: 内的エネルギー（${engine}）と外的表現（${interfaceOS}）が調和し、自然な魅力を発揮。社会的成功の可能性が非常に高い。`;
                } else if (totalScore > 0.4) {
                    return `⚖️ 中程度のポテンシャル（${Math.round(totalScore * 100)}%）: ${engine}の力を${interfaceOS}で表現する際に調整が必要。意識的な努力で成功への道が開かれる。`;
                } else {
                    return `💎 独特のポテンシャル（${Math.round(totalScore * 100)}%）: ${engine}と${interfaceOS}のギャップが独自性を生む。理解者を得ることで大きな飛躍の可能性。`;
                }
            }
            
            calculateConsistencyScore(engineOS, interfaceOS, safeModeOS) {
                // エンジン-インターフェース間の一貫性
                const engineInterfaceScore = this.calculateTrigramCompatibility(engineOS.upperTrigram, interfaceOS.upperTrigram) * 100;
                
                // インターフェース-セーフモード間の一貫性
                const interfaceSafeScore = this.calculateTrigramCompatibility(interfaceOS.upperTrigram, safeModeOS.upperTrigram) * 100;
                
                // エンジン-セーフモード間の一貫性
                const engineSafeScore = this.calculateTrigramCompatibility(engineOS.upperTrigram, safeModeOS.upperTrigram) * 100;
                
                // 平均値を算出
                return Math.round((engineInterfaceScore + interfaceSafeScore + engineSafeScore) / 3);
            }
            
            getCompatibilityType(engineOS, interfaceOS, safeModeOS) {
                const engineYinYang = this.getYinYang(engineOS.upperTrigram);
                const interfaceYinYang = this.getYinYang(interfaceOS.upperTrigram);
                const safeYinYang = this.getYinYang(safeModeOS.upperTrigram);
                
                const allSame = engineYinYang === interfaceYinYang && interfaceYinYang === safeYinYang;
                const engineSafeOpposite = engineYinYang !== safeYinYang && interfaceYinYang !== engineYinYang;
                
                if (allSame) return "調和型";
                if (engineSafeOpposite) return "補完型";
                return "葛藤型";
            }
            
            getYinYang(trigram) {
                const yangTrigrams = ["乾", "兌", "離", "震"];
                return yangTrigrams.includes(trigram) ? "陽" : "陰";
            }
            
            displayHarmonyAnalysis(engineOS, interfaceOS, safeModeOS) {
                const container = document.getElementById('harmony-analysis');
                if (!container) return;
                
                const type = this.getCompatibilityType(engineOS, interfaceOS, safeModeOS);
                if (type === "調和型") {
                    container.innerHTML = `
                        <div class="analysis-content">
                            <p>✅ 3つのOSが同じ陰陽エネルギーで統一されており、非常に一貫した人格を持ちます。</p>
                            <p>内面・外面・ストレス時のすべてで一貫した価値観と行動パターンを示すため、周囲から信頼されやすい特徴があります。</p>
                        </div>
                    `;
                } else {
                    container.innerHTML = `
                        <div class="analysis-content">
                            <p>△ 完全な調和型ではありませんが、部分的な調和が見られます。</p>
                            <p>一部のOSで一致する要素があり、それらの場面では安定した行動を取ることができます。</p>
                        </div>
                    `;
                }
            }
            
            displayComplementAnalysis(engineOS, interfaceOS, safeModeOS) {
                const container = document.getElementById('complement-analysis');
                if (!container) return;
                
                const type = this.getCompatibilityType(engineOS, interfaceOS, safeModeOS);
                if (type === "補完型") {
                    container.innerHTML = `
                        <div class="analysis-content">
                            <p>⚖️ Engine OSとSafe Mode OSが対極の性質を持ち、バランスの取れた人格構造です。</p>
                            <p>通常時と緊急時で全く異なる強みを発揮でき、幅広い状況に対応可能です。この対比が独特の魅力を生み出します。</p>
                        </div>
                    `;
                } else {
                    container.innerHTML = `
                        <div class="analysis-content">
                            <p>△ 部分的な補完関係は見られますが、完全な補完型ではありません。</p>
                            <p>一部の場面でバランスの取れた対応ができますが、全体的な調整が必要かもしれません。</p>
                        </div>
                    `;
                }
            }
            
            displayConflictAnalysis(engineOS, interfaceOS, safeModeOS) {
                const container = document.getElementById('conflict-analysis');
                if (!container) return;
                
                const type = this.getCompatibilityType(engineOS, interfaceOS, safeModeOS);
                if (type === "葛藤型") {
                    container.innerHTML = `
                        <div class="analysis-content">
                            <p>💥 3つのOSがそれぞれ異なる性質を持つ、最も複雑な人格構造です。</p>
                            <p>内的葛藤が生じやすい一方で、この多様性が創造性と独創性の源泉となる可能性を秘めています。</p>
                        </div>
                    `;
                } else {
                    container.innerHTML = `
                        <div class="analysis-content">
                            <p>△ 一部に葛藤的要素は見られますが、深刻な内的矛盾はありません。</p>
                            <p>小さなギャップは成長の機会として活用できる範囲内です。</p>
                        </div>
                    `;
                }
            }
            
            displayCreativityAdvice(engineOS, interfaceOS, safeModeOS) {
                const container = document.getElementById('creativity-advice-content');
                if (!container) return;
                
                const adviceItems = [
                    {
                        title: "内的統合の練習",
                        description: `${engineOS.upperTrigram}（内面）の価値観を${interfaceOS.upperTrigram}（外面）で表現する練習を積み重ねましょう。日記や瞑想が効果的です。`
                    },
                    {
                        title: "葛藤の言語化",
                        description: `3つのOSの違いを言葉で説明できるようになることで、他者理解と自己理解が深まります。`
                    },
                    {
                        title: "状況別使い分け",
                        description: `各OSが最も力を発揮できる状況を把握し、意識的に使い分けることで効果を最大化できます。`
                    },
                    {
                        title: "創造的統合",
                        description: `3つの異なる視点を統合することで、他にはない独創的なアイデアや解決策を生み出すことができます。`
                    }
                ];
                
                let html = '';
                adviceItems.forEach(item => {
                    html += `
                        <div class="advice-item">
                            <div class="advice-title">${item.title}</div>
                            <div class="advice-description">${item.description}</div>
                        </div>
                    `;
                });
                
                container.innerHTML = html;
            }
            
            displayEnergyLossAnalysis(engineOS, interfaceOS, safeModeOS) {
                const container = document.getElementById('energy-loss-analysis');
                if (!container) return;
                
                const engineInterfaceGap = 1 - this.calculateTrigramCompatibility(engineOS.upperTrigram, interfaceOS.upperTrigram);
                const interfaceSafeGap = 1 - this.calculateTrigramCompatibility(interfaceOS.upperTrigram, safeModeOS.upperTrigram);
                
                const lossPoints = [];
                
                if (engineInterfaceGap > 0.5) {
                    lossPoints.push({
                        point: "Engine → Interface",
                        loss: Math.round(engineInterfaceGap * 100),
                        description: `内面の${engineOS.upperTrigram}エネルギーが外面の${interfaceOS.upperTrigram}表現に変換される際にエネルギーロスが発生`
                    });
                }
                
                if (interfaceSafeGap > 0.5) {
                    lossPoints.push({
                        point: "Interface → Safe Mode",
                        loss: Math.round(interfaceSafeGap * 100),
                        description: `普段の${interfaceOS.upperTrigram}表現からストレス時の${safeModeOS.upperTrigram}モードへの切り替えで混乱が生じやすい`
                    });
                }
                
                if (lossPoints.length === 0) {
                    container.innerHTML = `
                        <div class="loss-item positive">
                            <div class="loss-title">✅ エネルギーロス最小</div>
                            <div class="loss-description">3つのOSの連携がスムーズで、エネルギー効率の良い人格構造です。</div>
                        </div>
                    `;
                } else {
                    let html = '';
                    lossPoints.forEach(item => {
                        html += `
                            <div class="loss-item">
                                <div class="loss-title">⚡ ${item.point}（ロス率: ${item.loss}%）</div>
                                <div class="loss-description">${item.description}</div>
                            </div>
                        `;
                    });
                    container.innerHTML = html;
                }
            }
            
            displayOptimizationActions(engineOS, interfaceOS, safeModeOS) {
                const container = document.getElementById('optimization-actions-content');
                if (!container) return;
                
                const actions = [
                    {
                        title: "朝の意図設定",
                        description: `毎朝、今日は主にどのOSで行動するかを意識的に決めることで、エネルギーの無駄遣いを防げます。`
                    },
                    {
                        title: "OSブリッジング練習",
                        description: `${engineOS.upperTrigram}→${interfaceOS.upperTrigram}→${safeModeOS.upperTrigram}の流れを意識的に練習し、切り替えをスムーズにしましょう。`
                    },
                    {
                        title: "ストレス予防システム",
                        description: `Safe Mode OSが発動する前に、Engine OSやInterface OSでストレスを軽減する方法を見つけましょう。`
                    },
                    {
                        title: "統合的自己理解",
                        description: `3つのOSすべてが「本当の自分」であることを受け入れ、状況に応じた使い分けを肯定的に捉えましょう。`
                    }
                ];
                
                let html = '';
                actions.forEach(action => {
                    html += `
                        <div class="action-item">
                            <div class="action-title">${action.title}</div>
                            <div class="action-description">${action.description}</div>
                        </div>
                    `;
                });
                
                container.innerHTML = html;
            }
        }

        // ==========================================
        // Initialize Application
        // ==========================================
        let quizController;
        
        // windowオブジェクトにクラスを公開
        window.QuizController = QuizController;
        window.QuizManager = QuizController; // エイリアスとして公開
        window.TripleOSAnalyzer = function() {
            // TripleOSAnalyzerのラッパー
            return {
                analyzeTripleOS: async function(allAnswers) {
                    if (!quizController) {
                        quizController = new QuizController();
                    }
                    // 回答をセット
                    allAnswers.forEach(answer => {
                        quizController.answers[answer.questionId] = answer.value;
                    });
                    // 分析実行
                    const engineOS = quizController.calculateEngineOS();
                    const interfaceOS = quizController.calculateInterfaceOS();
                    const safeModeOS = quizController.calculateSafeModeOS();
                    
                    return {
                        engineOS: engineOS,
                        interfaceOS: interfaceOS,
                        safeModeOS: safeModeOS
                    };
                }
            }
        }
        
        // showAnalysisResults関数をグローバルに定義
        window.showAnalysisResults = function(result) {
            console.log("📊 Showing analysis results:", result);
            if (!quizController) {
                quizController = new QuizController();
            }
            // 結果表示
            quizController.displayResults(result.engineOS, result.interfaceOS, result.safeModeOS);
        };
        
        function startQuiz() {
            console.log("✨ Start button clicked");
            
            // QuizControllerを確実に初期化
            if (!window.quizController) {
                console.log("📌 Initializing QuizController...");
                window.quizController = new QuizController();
            }
            
            // activeクラスを使用して画面を切り替える
            const welcomeScreen = document.getElementById('welcome-screen');
            const questionScreen = document.getElementById('question-screen');
            
            if (welcomeScreen && questionScreen) {
                console.log("🔄 Switching screens using active class...");
                // activeクラスを削除・追加
                welcomeScreen.classList.remove('active');
                questionScreen.classList.add('active');
                
                // QuizControllerのshowQuestionを呼び出す
                window.quizController.showQuestion(0);
                console.log("✅ Screen switched successfully");
            } else {
                console.error("❌ Screens not found");
            }
        }
        
        // 結果保存・共有機能
        function saveResults() {
            const engineOS = quizController?.calculateEngineOS();
            const interfaceOS = quizController?.calculateInterfaceOS();
            const safeModeOS = quizController?.calculateSafeModeOS();
            
            if (!engineOS || !interfaceOS || !safeModeOS) {
                alert('分析結果が見つかりません。先に分析を完了してください。');
                return;
            }
            
            const results = {
                date: new Date().toISOString(),
                engineOS: engineOS,
                interfaceOS: interfaceOS,
                safeModeOS: safeModeOS,
                scores: quizController.calculateScores()
            };
            
            // LocalStorageに保存（旧形式互換性のため残す）
            localStorage.setItem('tripleOSResults', JSON.stringify(results));
            
            // 契約A形式で保存
            if (window.saveTripleOSContract) {
                window.saveTripleOSContract(results);
            }
            
            // 保存成功通知
            const saveBtn = document.querySelector('.save-btn');
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '✅ 保存完了！';
            setTimeout(() => {
                saveBtn.innerHTML = originalText;
            }, 2000);
        }
        
        function shareResults() {
            const engineOS = quizController?.calculateEngineOS();
            const interfaceOS = quizController?.calculateInterfaceOS();
            const safeModeOS = quizController?.calculateSafeModeOS();
            
            if (!engineOS || !interfaceOS || !safeModeOS) {
                alert('分析結果が見つかりません。先に分析を完了してください。');
                return;
            }
            
            const shareText = `【HAQEI Triple OS分析結果】
Engine OS: 第${engineOS.hexagramId}卦 ${engineOS.hexagramName || ''}
Interface OS: 第${interfaceOS.hexagramId}卦 ${interfaceOS.hexagramName || ''}
Safe Mode OS: 第${safeModeOS.hexagramId}卦 ${safeModeOS.hexagramName || ''}

私の三重人格システムが明らかになりました！
#HAQEI #TripleOS #自己分析`;
            
            // クリップボードにコピー
            navigator.clipboard.writeText(shareText).then(() => {
                const shareBtn = document.querySelector('.share-btn');
                const originalText = shareBtn.innerHTML;
                shareBtn.innerHTML = '✅ コピー完了！';
                setTimeout(() => {
                    shareBtn.innerHTML = originalText;
                }, 2000);
            });
        }
        
        function downloadPDF() {
            // 簡易的な実装として、結果をテキストファイルとしてダウンロード
            const engineOS = quizController?.calculateEngineOS();
            const interfaceOS = quizController?.calculateInterfaceOS();
            const safeModeOS = quizController?.calculateSafeModeOS();
            
            if (!engineOS || !interfaceOS || !safeModeOS) {
                alert('分析結果が見つかりません。先に分析を完了してください。');
                return;
            }
            
            const content = `HAQEI Triple OS 分析結果
========================
分析日: ${new Date().toLocaleDateString('ja-JP')}

【Engine OS - 価値観システム】
第${engineOS.hexagramId}卦 ${engineOS.hexagramName || ''}
上卦: ${engineOS.upperTrigram}
下卦: ${engineOS.lowerTrigram}

【Interface OS - 社会的システム】
第${interfaceOS.hexagramId}卦 ${interfaceOS.hexagramName || ''}
上卦: ${interfaceOS.upperTrigram}
下卦: ${interfaceOS.lowerTrigram}

【Safe Mode OS - 防御システム】
第${safeModeOS.hexagramId}卦 ${safeModeOS.hexagramName || ''}
上卦: ${safeModeOS.upperTrigram}
下卦: ${safeModeOS.lowerTrigram}

詳細な分析結果はHAQEIシステムで確認してください。
`;
            
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `HAQEI_TripleOS_${new Date().getTime()}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        }
        
        // Initialize immediately (script is at the end of body)
        function initializeApp() {
            console.log("🎯 HAQEI OS Analyzer initialized");
            
            // QuizControllerをグローバルに初期化
            if (!window.quizController) {
                window.quizController = new QuizController();
                console.log("✅ QuizController initialized");
            }
            
            // Add event listener to start button
            const startBtn = document.getElementById('start-btn');
            if (startBtn) {
                startBtn.addEventListener('click', startQuiz);
                console.log("✅ Start button listener attached");
            } else {
                console.error("❌ Start button not found");
            }
            
            // Add next button listener
            const nextBtn = document.getElementById('next-btn');
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    console.log("➡️ Next button clicked");
                    
                    if (!window.quizController) {
                        console.error("QuizController not initialized");
                        return;
                    }
                    
                    const currentIndex = window.quizController.currentQuestion || 0;
                    
                    // 悩み入力の場合の処理
                    const worryTextarea = document.getElementById('worryInputArea');
                    const worryContainer = document.getElementById('worry-input-container');
                    
                    if (worryTextarea && worryContainer && worryContainer.style.display !== 'none') {
                        const worryText = worryTextarea.value.trim();
                        if (worryText) {
                            console.log("📝 Saving worry text:", worryText.substring(0, 50) + "...");
                            window.quizController.answers[currentIndex] = worryText;
                            
                            // Future Simulator へ進む
                            window.quizController.currentQuestionIndex = currentIndex + 1;
                            window.quizController.calculateResults();
                            return;
                        }
                    }
                    
                    // 通常の質問の場合
                    window.quizController.nextQuestion();
                });
                console.log("✅ Next button listener attached");
            }
            
            // Add restart button listener
            const restartBtn = document.getElementById('restart-btn');
            if (restartBtn) {
                restartBtn.addEventListener('click', () => {
                    location.reload();
                });
            }
            
            // Add tab switching functionality
            const tabBtns = document.querySelectorAll('.tab-btn');
            const layerContents = document.querySelectorAll('.layer-content');
            
            tabBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const targetLayer = e.currentTarget.dataset.layer;
                    
                    // Remove active class from all tabs and contents
                    tabBtns.forEach(tab => tab.classList.remove('active'));
                    layerContents.forEach(content => content.classList.remove('active'));
                    
                    // Add active class to clicked tab and corresponding content
                    e.currentTarget.classList.add('active');
                    const targetContent = document.querySelector(`.layer-content[data-layer="${targetLayer}"]`);
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                });
            });
            
            // ヘルパー: H384データベースをグローバルスコープで利用可能に
            if (typeof window !== 'undefined' && !window.H384_DATA) {
                // H384データベーススクリプトのロードを確認
                console.log('📊 H384データベースのロードを確認中...');
                
                // スクリプトタグで動的ロード
                const script = document.createElement('script');
                script.src = './assets/H384H64database.js';
                script.onload = () => {
                    console.log('✅ H384データベースのロードが完了しました');
                };
                script.onerror = () => {
                    console.warn('⚠️ H384データベースのロードに失敗しました');
                };
                document.head.appendChild(script);
            }
        });
        
        // 64×64 Engine×Interface黄金パターン分析
        window.displayGoldenPatternAnalysis64 = function(engineOS, interfaceOS) {
            const container = document.getElementById('golden-pattern-analysis');
            if (!container) return;
            
            const synergy = quizController?.personaEnhancer?.calculate64HexagramSynergy(engineOS.hexagramId, interfaceOS.hexagramId) || 0.5;
            const patternType = get64PatternType(synergy);
            const goldenPatterns = getGoldenPatterns64();
            
            const pattern = `${engineOS.hexagramId}-${interfaceOS.hexagramId}`;
            const isGolden = goldenPatterns[pattern] || false;
            
            container.innerHTML = `
                <div class="golden-pattern-result">
                    <div class="pattern-combination">
                        <h4>第${engineOS.hexagramId}卦 × 第${interfaceOS.hexagramId}卦 ${isGolden ? '🏆' : ''}</h4>
                        <div class="synergy-score">64卦シナジー: ${Math.round(synergy * 100)}%</div>
                        <div class="pattern-type">${patternType}</div>
                    </div>
                    <div class="pattern-description">
                        ${get64PatternDescription(synergy, engineOS, interfaceOS)}
                    </div>
                    <div class="social-success-potential">
                        <h5>🎯 社会的成功ポテンシャル</h5>
                        ${getSocialSuccessPotential64(synergy, engineOS, interfaceOS)}
                    </div>
                </div>
            `;
            
            // 64卦ゴールデンパターン例を表示
            displayGoldenPatterns64();
        }
        
        // 64卦ゴールデンパターン表示
        function displayGoldenPatterns64() {
            // Simple implementation - could be enhanced with actual patterns
            console.log('📊 Displaying golden patterns for 64 hexagrams');
        }
        
        // 262,144パターンから3つのOS相互作用分析（v2要件準拠）
        window.displayTripleOSInteractionAnalysis = function(engineOS, interfaceOS, safeModeOS) {
            // v2要件準拠：契約A v1.1形式で豊かさを言語化
            const analyzer = new TripleOSInteractionAnalyzer();
            const analysis = analyzer.analyze(engineOS, interfaceOS, safeModeOS);
            
            // localStorageに契約A形式で保存
            try {
                localStorage.setItem('contract_a_triple_os', JSON.stringify(analysis));
                console.log('✅ 契約A v1.1形式で保存完了', analysis);
            } catch (e) {
                console.error('❌ 契約A保存エラー', e);
            }
            
            const container = document.getElementById('triple-os-interaction');
            
            if (!container) {
                console.warn('🚨 triple-os-interactionコンテナが見つかりません');
                return;
            }
            
            // v2要件準拠：affordances、inner_conflicts、integration_promptsを表示
            const { interactions, synergy } = analysis;
            
            container.innerHTML = `
                <div class="interaction-analysis">
                    <div class="pattern-header" style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px solid #6366f1;">
                        <h3 style="color: #fbbf24; font-weight: bold;">🌌 トリプルOS相互作用解析（v2要件準拠）</h3>
                        <div style="color: #a5b4fc; font-size: 0.875rem;">
                            64卦による関係性の型と内面の豊かさを言語化
                        </div>
                    </div>
                    
                    <!-- ペア分析 -->
                    <div class="pair-insights-section" style="margin-bottom: 2rem;">
                        <h4 style="color: #60a5fa; margin-bottom: 1rem;">📊 ペア間相互作用</h4>
                        ${interactions.pair_insights.map(pair => `
                            <div style="background: rgba(30, 41, 59, 0.5); padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.5rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: #e5e7eb;">${pair.summary}</span>
                                    <span class="badge" style="background: ${
                                        pair.category === 'SYNERGY' ? '#10b981' : 
                                        pair.category === 'HARMONY' ? '#3b82f6' :
                                        pair.category === 'TENSION' ? '#f59e0b' : '#ef4444'
                                    }; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                                        ${pair.category}
                                    </span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- アフォーダンス（強み/弱みが出るインターフェース） -->
                    <div class="affordances-section" style="margin-bottom: 2rem;">
                        <h4 style="color: #10b981; margin-bottom: 1rem;">💡 強み・弱みが出るインターフェース</h4>
                        
                        <div style="display: grid; gap: 1rem;">
                            ${['engine', 'interface', 'safe'].map(osType => `
                                <div style="background: rgba(30, 41, 59, 0.5); padding: 1rem; border-radius: 0.5rem;">
                                    <h5 style="color: #fbbf24; margin-bottom: 0.5rem;">
                                        ${osType === 'engine' ? '⚡ Engine OS' : 
                                          osType === 'interface' ? '🔄 Interface OS' : '🛡️ Safe Mode OS'}
                                    </h5>
                                    <div style="margin-bottom: 0.5rem;">
                                        <strong style="color: #10b981;">強みが出る場面：</strong>
                                        <ul style="color: #e5e7eb; margin-left: 1rem;">
                                            ${interactions.affordances[osType].thrives_with.map(t => `<li>• ${t}</li>`).join('')}
                                        </ul>
                                    </div>
                                    <div>
                                        <strong style="color: #f59e0b;">弱みが出る場面：</strong>
                                        <ul style="color: #e5e7eb; margin-left: 1rem;">
                                            ${interactions.affordances[osType].struggles_with.map(s => `<li>• ${s}</li>`).join('')}
                                        </ul>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- 内的葛藤 -->
                    <div class="conflicts-section" style="margin-bottom: 2rem;">
                        <h4 style="color: #ef4444; margin-bottom: 1rem;">⚡ 内的葛藤のテーマ</h4>
                        <div style="background: rgba(30, 41, 59, 0.5); padding: 1rem; border-radius: 0.5rem;">
                            <ul style="color: #e5e7eb;">
                                ${interactions.inner_conflicts.map(conflict => `
                                    <li style="margin-bottom: 0.5rem;">• ${conflict}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <!-- 統合のヒント -->
                    <div class="integration-section">
                        <h4 style="color: #a78bfa; margin-bottom: 1rem;">🌟 統合のヒント</h4>
                        <div style="background: rgba(30, 41, 59, 0.5); padding: 1rem; border-radius: 0.5rem;">
                            ${interactions.integration_prompts.map((prompt, i) => `
                                <div style="color: #e5e7eb; margin-bottom: 0.75rem; padding-left: 1.5rem; position: relative;">
                                    <span style="position: absolute; left: 0; color: #a78bfa;">${i + 1}.</span>
                                    ${prompt}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- シナジー情報 -->
                    <div style="margin-top: 1rem; padding: 0.5rem; background: rgba(99, 102, 241, 0.1); border-radius: 0.25rem;">
                        <small style="color: #a5b4fc;">
                            📊 シナジー分析: ${synergy.notes}
                        </small>
                    </div>
                </div>
            `;
        }
        
        // 64卦対応相性診断
        window.displayCompatibilityDiagnosis64 = function(engineOS, interfaceOS, safeModeOS) {
            const consistencyScore = quizController?.personaEnhancer?.calculateConsistencyScore(engineOS, interfaceOS, safeModeOS) || 50;
            const compatibilityType = quizController?.personaEnhancer?.getCompatibilityType(engineOS, interfaceOS, safeModeOS) || "バランス型";
            
            // スコア表示
            const scoreElement = document.getElementById('consistency-value');
            const typeElement = document.getElementById('consistency-type');
            const scoreCircle = document.querySelector('.score-circle');
            
            if (scoreElement && typeElement && scoreCircle) {
                scoreElement.textContent = Math.round(consistencyScore);
                typeElement.textContent = compatibilityType;
                
                // CSSカスタムプロパティでスコア設定
                scoreCircle.style.setProperty('--score-percentage', `${consistencyScore}%`);
            }
        }

        // ==========================================
        // 🎯 2025/08/10 RENEWED: 64卦シナジー分析システム - 完全実装済み
        // ==========================================

        // 1. 64卦の黄金パターン定義
        function getGoldenPatterns64() {
            return {
                // CEOタイプ - 創造力×決断力
                '1-43': { name: 'CEO・革新者', description: '創造的リーダーシップで業界を変革する', potential: 0.95 },
                '1-11': { name: '天地泰平', description: '理想と現実のバランスを取る指導者', potential: 0.92 },
                '1-34': { name: '大壮リーダー', description: '強力な実行力で組織を牽引', potential: 0.90 },
                
                // ファシリテータータイプ - 調和×協調
                '2-11': { name: 'ファシリテーター', description: '多様な意見をまとめる調整役', potential: 0.88 },
                '2-19': { name: '地沢臨', description: '包容力で人々を導く', potential: 0.85 },
                '11-46': { name: '上昇志向', description: '着実な成長を促進する', potential: 0.87 },
                
                // イノベータータイプ - 創造×変革
                '51-17': { name: 'イノベーター', description: '革新的なアイデアで変化を起こす', potential: 0.93 },
                '51-42': { name: '震風益', description: '変化をチャンスに変える', potential: 0.89 },
                '17-25': { name: '随無妄', description: '直感的な判断で正しい道を見つける', potential: 0.86 },
                
                // アーキテクトタイプ - 構造×戦略
                '23-43': { name: 'システム・アーキテクト', description: '複雑な仕組みを設計する', potential: 0.91 },
                '52-57': { name: '止巽', description: '詳細な計画と実行の専門家', potential: 0.84 },
                '52-18': { name: '蠱治療', description: '問題の根本原因を解決する', potential: 0.88 },
                
                // エンパワーメントタイプ - 支援×成長
                '19-33': { name: 'エンパワーメント・リーダー', description: '他者の成長を支援する', potential: 0.87 },
                '46-18': { name: '昇蠱', description: '組織の改善と発展を推進', potential: 0.85 },
                
                // 創造的統合タイプ
                '14-8': { name: '創造的統合', description: '多様な要素を創造的に結合', potential: 0.90 },
                '13-7': { name: '同人師', description: 'チームワークで大きな成果を生む', potential: 0.88 },
                
                // 戦略的思考タイプ
                '3-27': { name: '戦略的思考者', description: '長期的視点で計画を立てる', potential: 0.89 },
                '29-30': { name: '坎離', description: '困難を乗り越える知恵を持つ', potential: 0.86 },
                
                // カリスマティック・リーダー
                '1-2': { name: 'カリスマ・リーダー', description: '天と地の力を併せ持つ', potential: 0.94 },
                '63-64': { name: '既済未済', description: '完成と新始動のバランス', potential: 0.85 },
                
                // 技術革新者
                '32-42': { name: 'テクノロジー革新者', description: '持続的な技術革新を推進', potential: 0.87 },
                '50-44': { name: '鼎姤', description: '伝統と革新の融合', potential: 0.84 },
                
                // コミュニケーター
                '58-10': { name: 'マスター・コミュニケーター', description: '効果的な意思疎通の専門家', potential: 0.86 },
                '61-39': { name: '中孚蹇', description: '困難な状況での信頼構築', potential: 0.83 },
                
                // 追加パターン（50パターン達成のため）
                '4-49': { name: '蒙革', description: '教育による変革', potential: 0.82 },
                '5-48': { name: '需井', description: '資源の有効活用', potential: 0.81 },
                '6-59': { name: '訟渙', description: '対立を協調に変える', potential: 0.80 },
                '9-37': { name: '小畜家人', description: '家族的経営の実現', potential: 0.83 },
                '12-35': { name: '否晋', description: '停滞からの躍進', potential: 0.84 },
                '15-16': { name: '謙豫', description: '謙虚さと準備の力', potential: 0.85 },
                '20-41': { name: '観損', description: '洞察力による改善', potential: 0.82 },
                '21-22': { name: '噬嗑賁', description: '正義と美の調和', potential: 0.84 },
                '24-56': { name: '復旅', description: '復活と新たな旅立ち', potential: 0.83 },
                '26-45': { name: '大畜萃', description: '大きな蓄積と結集', potential: 0.86 },
                '28-31': { name: '大過咸', description: '大胆な行動と感化', potential: 0.87 },
                '36-55': { name: '明夷豊', description: '困難な時期の豊かさ', potential: 0.84 },
                '38-54': { name: '睽歸妹', description: '対立の調和と新しい結びつき', potential: 0.83 },
                '40-53': { name: '解漸', description: '問題解決と段階的進歩', potential: 0.85 },
                '47-60': { name: '困節', description: '制約の中での創意工夫', potential: 0.82 },
                
                // 特殊な対称パターン
                '1-64': { name: '始終の統合', description: '始まりと完成の循環', potential: 0.88 },
                '2-63': { name: '地天の調和', description: '受容と達成のバランス', potential: 0.87 },
                '30-29': { name: '火水の融合', description: '情熱と知恵の結合', potential: 0.86 },
                '31-41': { name: '感損の智慧', description: '感情と理性の調和', potential: 0.84 },
                '32-48': { name: '恆井の持続', description: '継続的な努力と深い洞察', potential: 0.85 },
                '33-19': { name: '遯臨の戦略', description: '撤退と前進のタイミング', potential: 0.83 },
                '34-20': { name: '大壮観の視点', description: '力強さと観察の融合', potential: 0.86 },
                '35-12': { name: '晋否の転換', description: '進歩と停滞の変換', potential: 0.84 },
                '36-11': { name: '明夷泰の希望', description: '困難を乗り越える平和', potential: 0.85 },
                '37-9': { name: '家人小畜の基盤', description: '家庭と小さな蓄積', potential: 0.82 },
                '38-10': { name: '睽履の歩み', description: '対立を乗り越える実践', potential: 0.83 },
                '39-61': { name: '蹇中孚の信頼', description: '困難な時の誠実さ', potential: 0.84 },
                '43-23': { name: '夬剝の決断', description: '決断力と慎重さ', potential: 0.87 },
                '44-50': { name: '姤鼎の変革', description: '出会いによる変革', potential: 0.86 },
                '45-26': { name: '萃大畜の集積', description: '人材と資源の集約', potential: 0.88 },
                '46-25': { name: '升無妄の成長', description: '純粋な動機による上昇', potential: 0.85 },
                '49-4': { name: '革蒙の教育', description: '革新的な教育手法', potential: 0.84 },
                '55-36': { name: '豊明夷の光', description: '豊かさの中の賢明さ', potential: 0.86 }
            };
        }

        // 2. シナジースコアからパターンタイプ判定
        function get64PatternType(synergy) {
            if (synergy >= 0.9) {
                return "🌟 究極のシナジー - 天賦の才能の最大発揮";
            } else if (synergy >= 0.7) {
                return "⚡ 強力なシナジー - 卓越した成果を生む組み合わせ";
            } else if (synergy >= 0.5) {
                return "🔄 適度なシナジー - バランスの取れた協調関係";
            } else if (synergy >= 0.3) {
                return "🤝 補完関係 - 互いの弱点を補う関係";
            } else {
                return "⚖️ 対極関係 - 緊張感から生まれる成長";
            }
        }

        // 3. 64卦組み合わせの詳細説明生成
        function get64PatternDescription(synergy, engineOS, interfaceOS) {
            const engineHex = engineOS.hexagramId;
            const interfaceHex = interfaceOS.hexagramId;
            const pattern = `${engineHex}-${interfaceHex}`;
            
            // H384データベースから卦の情報を取得
            let engineData, interfaceData;
            try {
                engineData = window.H384H64database?.[engineHex] || {};
                interfaceData = window.H384H64database?.[interfaceHex] || {};
            } catch (error) {
                console.warn('H384データベースにアクセスできません:', error);
                engineData = {};
                interfaceData = {};
            }

            const goldenPatterns = getGoldenPatterns64();
            const isGolden = goldenPatterns[pattern];

            if (isGolden) {
                return `
                    <div class="golden-pattern-desc">
                        <h6>🏆 ${isGolden.name}</h6>
                        <p><strong>概要:</strong> ${isGolden.description}</p>
                        <p><strong>成功ポテンシャル:</strong> ${Math.round(isGolden.potential * 100)}%</p>
                    </div>
                `;
            }

            // 一般的な組み合わせの説明
            let description = `
                <div class="synergy-analysis">
                    <h6>🔮 シナジー分析</h6>
                    <p><strong>第${engineHex}卦</strong>（${engineData.name || '卦名不明'}）と<strong>第${interfaceHex}卦</strong>（${interfaceData.name || '卦名不明'}）の組み合わせ</p>
            `;

            if (synergy >= 0.8) {
                description += `
                    <p>この組み合わせは非常に高いシナジー効果を示しています。両方の卦の長所が相互に強化され、
                    創造性と実行力の両面で優れた成果を期待できます。</p>
                `;
            } else if (synergy >= 0.6) {
                description += `
                    <p>良好なシナジー効果が期待できる組み合わせです。互いの特性が補完し合い、
                    バランスの取れた成長と発展が見込めます。</p>
                `;
            } else if (synergy >= 0.4) {
                description += `
                    <p>適度な協調関係を示す組み合わせです。時に緊張感を生むこともありますが、
                    それが新しい視点や解決策を生み出す原動力となります。</p>
                `;
            } else {
                description += `
                    <p>対極的な関係を示す組み合わせです。一見相反する要素が、
                    深いレベルでの調和と成長をもたらす可能性を秘めています。</p>
                `;
            }

            description += `
                    <div class="hexagram-details">
                        <div class="hex-detail">
                            <strong>エンジンOS特性:</strong> ${engineData.keywords?.slice(0, 3).join(', ') || '分析中'}
                        </div>
                        <div class="hex-detail">
                            <strong>インターフェースOS特性:</strong> ${interfaceData.keywords?.slice(0, 3).join(', ') || '分析中'}
                        </div>
                    </div>
                </div>
            `;

            return description;
        }

        // 4. 64卦ベースの社会的成功ポテンシャル
        function getSocialSuccessPotential64(synergy, engineOS, interfaceOS) {
            const engineHex = engineOS.hexagramId;
            const interfaceHex = interfaceOS.hexagramId;
            const pattern = `${engineHex}-${interfaceHex}`;
            
            // 基本スコア計算
            let careerScore = Math.min(95, 50 + (synergy * 40));
            let leadershipScore = Math.min(95, 45 + (synergy * 45));
            let creativityScore = Math.min(95, 40 + (synergy * 50));
            let stabilityScore = Math.min(95, 60 + (synergy * 30));

            // 卦の特性による調整
            const engineHexData = getHexagramCharacteristics(engineHex);
            const interfaceHexData = getHexagramCharacteristics(interfaceHex);

            // エンジンOS特性による調整
            careerScore += engineHexData.career || 0;
            leadershipScore += engineHexData.leadership || 0;
            creativityScore += engineHexData.creativity || 0;
            stabilityScore += engineHexData.stability || 0;

            // インターフェースOS特性による調整
            careerScore += interfaceHexData.career || 0;
            leadershipScore += interfaceHexData.leadership || 0;
            creativityScore += interfaceHexData.creativity || 0;
            stabilityScore += interfaceHexData.stability || 0;

            // ゴールデンパターンボーナス
            const goldenPatterns = getGoldenPatterns64();
            if (goldenPatterns[pattern]) {
                const bonus = goldenPatterns[pattern].potential * 10;
                careerScore += bonus;
                leadershipScore += bonus;
                creativityScore += bonus;
                stabilityScore += bonus;
            }

            // スコア正規化（0-100）
            careerScore = Math.min(100, Math.max(0, careerScore));
            leadershipScore = Math.min(100, Math.max(0, leadershipScore));
            creativityScore = Math.min(100, Math.max(0, creativityScore));
            stabilityScore = Math.min(100, Math.max(0, stabilityScore));

            const totalScore = (careerScore + leadershipScore + creativityScore + stabilityScore) / 4;

            return `
                <div class="success-potential-grid">
                    <div class="potential-item">
                        <div class="potential-label">💼 キャリア成功度</div>
                        <div class="potential-bar">
                            <div class="potential-fill" style="width: ${careerScore}%"></div>
                        </div>
                        <div class="potential-score">${Math.round(careerScore)}%</div>
                    </div>
                    
                    <div class="potential-item">
                        <div class="potential-label">👑 リーダーシップ</div>
                        <div class="potential-bar">
                            <div class="potential-fill" style="width: ${leadershipScore}%"></div>
                        </div>
                        <div class="potential-score">${Math.round(leadershipScore)}%</div>
                    </div>
                    
                    <div class="potential-item">
                        <div class="potential-label">🎨 創造性</div>
                        <div class="potential-bar">
                            <div class="potential-fill" style="width: ${creativityScore}%"></div>
                        </div>
                        <div class="potential-score">${Math.round(creativityScore)}%</div>
                    </div>
                    
                    <div class="potential-item">
                        <div class="potential-label">🏛️ 安定性</div>
                        <div class="potential-bar">
                            <div class="potential-fill" style="width: ${stabilityScore}%"></div>
                        </div>
                        <div class="potential-score">${Math.round(stabilityScore)}%</div>
                    </div>
                    
                    <div class="total-potential">
                        <h6>🎯 総合成功ポテンシャル: ${Math.round(totalScore)}%</h6>
                        <p>${getSocialSuccessDescription(totalScore)}</p>
                    </div>
                </div>
            `;
        }

        // 卦の特性データ（社会的成功要素）
        function getHexagramCharacteristics(hexagramId) {
            const characteristics = {
                1: { career: 15, leadership: 20, creativity: 15, stability: 5 },   // 乾
                2: { career: 10, leadership: 5, creativity: 5, stability: 20 },    // 坤
                3: { career: 8, leadership: 12, creativity: 10, stability: 8 },    // 屯
                4: { career: 5, leadership: 8, creativity: 12, stability: 10 },    // 蒙
                5: { career: 12, leadership: 10, creativity: 8, stability: 15 },   // 需
                6: { career: 10, leadership: 15, creativity: 5, stability: 5 },    // 訟
                7: { career: 15, leadership: 18, creativity: 8, stability: 12 },   // 師
                8: { career: 12, leadership: 8, creativity: 10, stability: 15 },   // 比
                9: { career: 8, leadership: 5, creativity: 15, stability: 10 },    // 小畜
                10: { career: 10, leadership: 12, creativity: 8, stability: 15 },  // 履
                11: { career: 15, leadership: 12, creativity: 15, stability: 18 }, // 泰
                12: { career: 5, leadership: 8, creativity: 5, stability: 8 },     // 否
                13: { career: 15, leadership: 18, creativity: 12, stability: 10 }, // 同人
                14: { career: 18, leadership: 15, creativity: 20, stability: 8 },  // 大有
                15: { career: 12, leadership: 10, creativity: 8, stability: 18 },  // 謙
                16: { career: 10, leadership: 12, creativity: 15, stability: 15 }, // 豫
                17: { career: 12, leadership: 15, creativity: 18, stability: 10 }, // 随
                18: { career: 15, leadership: 12, creativity: 10, stability: 15 }, // 蠱
                19: { career: 10, leadership: 15, creativity: 12, stability: 12 }, // 臨
                20: { career: 12, leadership: 8, creativity: 18, stability: 10 },  // 観
                21: { career: 15, leadership: 18, creativity: 8, stability: 12 },  // 噬嗑
                22: { career: 10, leadership: 8, creativity: 20, stability: 10 },  // 賁
                23: { career: 8, leadership: 10, creativity: 8, stability: 5 },    // 剝
                24: { career: 12, leadership: 12, creativity: 15, stability: 15 }, // 復
                25: { career: 15, leadership: 10, creativity: 18, stability: 12 }, // 無妄
                26: { career: 18, leadership: 15, creativity: 12, stability: 15 }, // 大畜
                27: { career: 12, leadership: 10, creativity: 10, stability: 15 }, // 頤
                28: { career: 15, leadership: 18, creativity: 20, stability: 5 },  // 大過
                29: { career: 10, leadership: 12, creativity: 15, stability: 8 },  // 坎
                30: { career: 15, leadership: 15, creativity: 20, stability: 10 }, // 離
                31: { career: 12, leadership: 10, creativity: 15, stability: 12 }, // 咸
                32: { career: 15, leadership: 12, creativity: 12, stability: 20 }, // 恆
                33: { career: 8, leadership: 12, creativity: 10, stability: 15 },  // 遯
                34: { career: 18, leadership: 20, creativity: 15, stability: 10 }, // 大壮
                35: { career: 15, leadership: 12, creativity: 15, stability: 12 }, // 晋
                36: { career: 8, leadership: 8, creativity: 12, stability: 10 },   // 明夷
                37: { career: 10, leadership: 12, creativity: 8, stability: 18 },  // 家人
                38: { career: 12, leadership: 10, creativity: 15, stability: 8 },  // 睽
                39: { career: 8, leadership: 15, creativity: 10, stability: 12 },  // 蹇
                40: { career: 15, leadership: 12, creativity: 15, stability: 15 }, // 解
                41: { career: 10, leadership: 8, creativity: 10, stability: 15 },  // 損
                42: { career: 15, leadership: 15, creativity: 18, stability: 12 }, // 益
                43: { career: 18, leadership: 20, creativity: 18, stability: 8 },  // 夬
                44: { career: 12, leadership: 8, creativity: 15, stability: 10 },  // 姤
                45: { career: 15, leadership: 18, creativity: 12, stability: 15 }, // 萃
                46: { career: 18, leadership: 15, creativity: 15, stability: 15 }, // 升
                47: { career: 8, leadership: 10, creativity: 12, stability: 12 },  // 困
                48: { career: 12, leadership: 10, creativity: 15, stability: 18 }, // 井
                49: { career: 20, leadership: 18, creativity: 20, stability: 8 },  // 革
                50: { career: 15, leadership: 15, creativity: 18, stability: 15 }, // 鼎
                51: { career: 15, leadership: 18, creativity: 20, stability: 8 },  // 震
                52: { career: 12, leadership: 12, creativity: 10, stability: 20 }, // 艮
                53: { career: 15, leadership: 12, creativity: 12, stability: 18 }, // 漸
                54: { career: 10, leadership: 8, creativity: 12, stability: 15 },  // 歸妹
                55: { career: 18, leadership: 18, creativity: 20, stability: 10 }, // 豊
                56: { career: 12, leadership: 10, creativity: 15, stability: 8 },  // 旅
                57: { career: 10, leadership: 8, creativity: 12, stability: 15 },  // 巽
                58: { career: 15, leadership: 12, creativity: 18, stability: 12 }, // 兌
                59: { career: 12, leadership: 15, creativity: 15, stability: 10 }, // 渙
                60: { career: 10, leadership: 12, creativity: 10, stability: 18 }, // 節
                61: { career: 15, leadership: 15, creativity: 15, stability: 15 }, // 中孚
                62: { career: 8, leadership: 10, creativity: 12, stability: 15 },  // 小過
                63: { career: 15, leadership: 15, creativity: 12, stability: 18 }, // 既済
                64: { career: 12, leadership: 12, creativity: 18, stability: 10 }  // 未済
            };
            
            return characteristics[hexagramId] || { career: 10, leadership: 10, creativity: 10, stability: 10 };
        }

        // 総合成功ポテンシャルの説明
        function getSocialSuccessDescription(totalScore) {
            if (totalScore >= 90) {
                return "🌟 卓越したポテンシャル - 社会的影響力を持つリーダーとして活躍";
            } else if (totalScore >= 80) {
                return "⭐ 高いポテンシャル - 専門分野でのトップレベルの成果を期待";
            } else if (totalScore >= 70) {
                return "✨ 良好なポテンシャル - 安定した成長と成功を実現";
            } else if (totalScore >= 60) {
                return "🔮 平均以上のポテンシャル - 継続的な努力で大きな成果を達成";
            } else if (totalScore >= 50) {
                return "⚖️ バランス型ポテンシャル - 多面的な能力を活かした成功";
            } else {
                return "🌱 潜在型ポテンシャル - 内在する力を開花させる成長過程";
            }
        }
        
        // シナリオ選択機能
        window.selectScenario = function(scenarioId) {
            console.log(`🎯 Scenario ${scenarioId} selected`);
            
            // 選択されたシナリオのハイライト
            const allCards = document.querySelectorAll('.scenario-card');
            allCards.forEach(card => card.classList.remove('selected'));
            
            const selectedCard = document.querySelector(`[data-scenario-id="${scenarioId}"]`);
            if (selectedCard) {
                selectedCard.classList.add('selected');
                
                // 選択後の詳細表示
                setTimeout(() => {
                    showScenarioDetail(scenarioId);
                }, 500);
            }
        };
        
        function showScenarioDetail(scenarioId) {
            console.log(`📋 Showing detail for scenario ${scenarioId}`);
            
            const resultsScreen = document.getElementById('results-screen');
            if (!resultsScreen) return;
            
            resultsScreen.innerHTML = `
                <div class="scenario-detail-container">
                    <div class="detail-header">
                        <h2 class="analysis-title">✨ 選択されました：シナリオ ${scenarioId}</h2>
                        <p class="detail-subtitle">詳細な実行プランを生成しました</p>
                    </div>
                    
                    <div class="detail-content">
                        <div class="action-plan">
                            <h3>🎯 具体的なアクションプラン</h3>
                            <div class="plan-steps">
                                <div class="step-card">
                                    <div class="step-number">1</div>
                                    <div class="step-content">
                                        <h4>今日から始められること</h4>
                                        <p>選択されたアプローチに基づく即座実行可能な第一歩です。</p>
                                    </div>
                                </div>
                                <div class="step-card">
                                    <div class="step-number">2</div>
                                    <div class="step-content">
                                        <h4>1週間以内の目標</h4>
                                        <p>短期的な成果を実感できる具体的な行動目標です。</p>
                                    </div>
                                </div>
                                <div class="step-card">
                                    <div class="step-number">3</div>
                                    <div class="step-content">
                                        <h4>1ヶ月後の確認ポイント</h4>
                                        <p>進捗を評価し、必要に応じて戦略を調整するチェックポイントです。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="success-factors">
                            <h3>🌟 成功のための重要なポイント</h3>
                            <ul class="factors-list">
                                <li>継続的な行動と振り返りの習慣化</li>
                                <li>期待値を現実的に設定し、小さな進歩を評価</li>
                                <li>必要に応じて軌道修正を恐れない柔軟性</li>
                                <li>支援者や協力者との関係構築</li>
                            </ul>
                        </div>
                        
                        <div class="completion-actions">
                            <button class="restart-btn" onclick="restartAnalysis()">🔄 別の悩みを相談する</button>
                            <button class="download-btn" onclick="downloadResult()">📄 結果をダウンロード</button>
                        </div>
                    </div>
                </div>
            `;
            
            // 詳細表示用のスタイルを追加
            addDetailStyles();
        }
        
        function addDetailStyles() {
            const existingStyle = document.getElementById('detail-styles');
            if (existingStyle) return;
            
            const style = document.createElement('style');
            style.id = 'detail-styles';
            style.textContent = `
                .scenario-card.selected {
                    border-color: #10b981 !important;
                    box-shadow: 0 0 20px rgba(16, 185, 129, 0.3) !important;
                }
                
                .scenario-detail-container {
                    padding: 20px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                .detail-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .detail-subtitle {
                    color: #6b7280;
                    font-size: 1.1rem;
                }
                
                .action-plan {
                    margin-bottom: 30px;
                }
                
                .plan-steps {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                
                .step-card {
                    display: flex;
                    align-items: flex-start;
                    padding: 20px;
                    border: 1px solid #e5e7eb;
                    border-radius: 10px;
                    background: #f9fafb;
                }
                
                .step-number {
                    background: #6366f1;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    margin-right: 15px;
                    flex-shrink: 0;
                }
                
                .step-content h4 {
                    margin: 0 0 8px 0;
                    color: #1f2937;
                }
                
                .step-content p {
                    margin: 0;
                    color: #6b7280;
                    line-height: 1.6;
                }
                
                .success-factors {
                    margin-bottom: 30px;
                }
                
                .factors-list {
                    background: #f0f9ff;
                    border: 1px solid #bae6fd;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 0;
                }
                
                .factors-list li {
                    margin-bottom: 8px;
                    color: #1e40af;
                }
                
                .completion-actions {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                }
                
                .restart-btn, .download-btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .restart-btn {
                    background: #6366f1;
                    color: white;
                }
                
                .restart-btn:hover {
                    background: #4f46e5;
                }
                
                .download-btn {
                    background: #10b981;
                    color: white;
                }
                
                .download-btn:hover {
                    background: #059669;
                }
            `;
            document.head.appendChild(style);
        }
        
        window.restartAnalysis = function() {
            console.log("🔄 Restarting analysis");
            location.reload();
        };
        
        window.downloadResult = function() {
            console.log("📄 Downloading result");
            // 簡単なダウンロード機能（改善可能）
            alert("結果のダウンロード機能は開発中です。");
        };
        
        // Initialize the app
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeApp);
        } else {
            // DOM is already loaded
            initializeApp();
        }
    </script>