/**
 * Triple OS 人格システムデータベース v3.0 - Part 4 (25-32卦)
 * 
 * @author Claude Code
 * @date 2025-01-20
 * @version 3.0.0
 */

const HexagramHumanTraitsV3Part4 = {
    // ============================================
    // 25. 天雷無妄 - 純粋者型
    // ============================================
    "天雷無妄": {
        id: 25,
        symbol: "☳☰",
        element: "天雷",
        nickname: "純粋者",
        emoji: "💎",
        
        asEngineOS: {
            profile: {
                type: "純粋直感エンジン",
                description: "計算なしに心のままに動く",
                metaphor: "子供のような純粋な心"
            },
            normalState: {
                whatHappens: "素直に感じたままに行動",
                example: "『これがしたい』と思ったらすぐ行動",
                energyLevel: "🔋🔋🔋 (65%) - ピュアモード"
            },
            superMode: {
                when: "直感が強く働く時",
                whatHappens: "迷いなく本能に従う",
                example: "理屈抜きで正しい選択をする",
                energyLevel: "🔋🔋🔋🔋 (90%) - 直感全開"
            },
            restMode: {
                whatHappens: "無心になる",
                howToRest: "何も考えない時間",
                note: "頭を空っぽにする"
            },
            maintenance: {
                whatYouNeed: "素直でいられる環境",
                howToCharge: "純粋な喜びと感動",
                warning: "計算高くなると調子を崩す",
                tip: "初心を忘れずに"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "素直表現型",
                description: "思ったことをそのまま伝える",
                metaphor: "裏表のない正直者"
            },
            howToTalk: {
                style: "ストレートで飾らない",
                example: "『嬉しい』『悲しい』を素直に表現",
                goodAt: "信頼構築、真心の伝達",
                notGoodAt: "駆け引き、建前"
            },
            bestEnvironment: {
                where: "誠実さが評価される環境",
                example: "教育、福祉、カスタマーサービス",
                withWho: "裏表のない人々",
                avoid: "政治的な環境"
            },
            relationshipTips: {
                strength: "誰からも信頼される純粋さ",
                weakness: "騙されやすい",
                advice: "純粋さと賢さのバランスを"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "無垢防御型",
                description: "純粋さで悪意を跳ね返す",
                metaphor: "清らかな水が汚れを流すように"
            },
            stressResponse: {
                whatYouDo: "素直に助けを求める",
                example: "困った → 『助けて』と言える",
                goodPoint: "素直さが人を動かす",
                badPoint: "自力解決が苦手"
            },
            emergencyMode: {
                whatHappens: "子供のように泣く",
                example: "感情を素直に出して発散",
                recovery: "泣いたらスッキリ",
                timeToRecover: "1-2日（感情を出せば）"
            },
            howToRecover: {
                bestWay: "素直な感情表現",
                example: "泣く、笑う、怒る",
                environment: "感情を出せる安全な場所",
                support: "受け止めてくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "純粋45% : 素直35% : 直感20%",
            whenBalanced: "真心で人を動かす存在",
            whenImbalanced: "幼稚、または計算高い",
            tip: "感じる→表現→共感→また感じる"
        }
    },
    
    // ============================================
    // 26. 山天大畜 - 蓄積者型
    // ============================================
    "山天大畜": {
        id: 26,
        symbol: "☰☶",
        element: "山天",
        nickname: "大蓄積者",
        emoji: "🏦",
        
        asEngineOS: {
            profile: {
                type: "大容量蓄積エンジン",
                description: "知識と経験を大量に蓄える",
                metaphor: "巨大な図書館のような知識量"
            },
            normalState: {
                whatHappens: "常に情報と経験を収集",
                example: "あらゆる分野の知識を吸収",
                energyLevel: "🔋🔋🔋 (60%) - 蓄積モード"
            },
            superMode: {
                when: "蓄積した知識を活用する時",
                whatHappens: "膨大な知識から最適解を導く",
                example: "過去の全経験から答えを見つける",
                energyLevel: "🔋🔋🔋🔋 (85%) - 知識総動員"
            },
            restMode: {
                whatHappens: "知識の整理と体系化",
                howToRest: "データベース化、分類整理",
                note: "蓄積したものを整える"
            },
            maintenance: {
                whatYouNeed: "学習機会と実践の場",
                howToCharge: "新しい知識の獲得",
                warning: "知識の陳腐化に注意",
                tip: "アウトプットも忘れずに"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "知識提供型",
                description: "豊富な知識を共有するタイプ",
                metaphor: "歩く百科事典のような存在"
            },
            howToTalk: {
                style: "データと事例を交えた説明",
                example: "『過去の例では...』と経験を語る",
                goodAt: "教育、アドバイス、問題解決",
                notGoodAt: "感覚的な会話、即興"
            },
            bestEnvironment: {
                where: "知識が活きる環境",
                example: "研究、教育、コンサルティング",
                withWho: "学ぶ意欲のある人々",
                avoid: "経験を軽視する環境"
            },
            relationshipTips: {
                strength: "頼れる知識の宝庫",
                weakness: "理屈っぽく感じられる",
                advice: "知識より知恵を大切に"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "知識武装型",
                description: "知識と経験で問題を解決",
                metaphor: "過去の事例から答えを見つける"
            },
            stressResponse: {
                whatYouDo: "過去の経験から対処法を探す",
                example: "危機 → 『前にも似たことが...』",
                goodPoint: "経験に基づく確実な対処",
                badPoint: "前例のない事態に弱い"
            },
            emergencyMode: {
                whatHappens: "全知識を総動員",
                example: "あらゆる知識を使って解決",
                recovery: "新しい知識を得て回復",
                timeToRecover: "1-2週間（学習を通じて）"
            },
            howToRecover: {
                bestWay: "新しい学びを得る",
                example: "セミナー参加、本を読む",
                environment: "学習できる環境",
                support: "知識を共有できる仲間"
            }
        },
        
        osBalance: {
            idealBalance: "蓄積50% : 活用30% : 更新20%",
            whenBalanced: "組織の知恵袋として機能",
            whenImbalanced: "知識倒れ、または無知",
            tip: "蓄積→活用→検証→また蓄積"
        }
    },
    
    // ============================================
    // 27. 山雷頤 - 養生者型
    // ============================================
    "山雷頤": {
        id: 27,
        symbol: "☳☶",
        element: "山雷",
        nickname: "養生者",
        emoji: "🌿",
        
        asEngineOS: {
            profile: {
                type: "健康維持エンジン",
                description: "心身の健康を第一に考える",
                metaphor: "体調管理のプロフェッショナル"
            },
            normalState: {
                whatHappens: "健康的な生活リズムを維持",
                example: "規則正しい食事、運動、睡眠",
                energyLevel: "🔋🔋🔋 (60%) - 健康維持モード"
            },
            superMode: {
                when: "体調を整える必要がある時",
                whatHappens: "徹底的な健康管理",
                example: "デトックス、体質改善プログラム実施",
                energyLevel: "🔋🔋🔋🔋 (80%) - 養生モード"
            },
            restMode: {
                whatHappens: "完全なリラックス",
                howToRest: "温泉、マッサージ、瞑想",
                note: "心身を癒す"
            },
            maintenance: {
                whatYouNeed: "健康的な環境と習慣",
                howToCharge: "体調が良い時の充実感",
                warning: "健康に神経質になりすぎない",
                tip: "心の健康も大切に"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "健康アドバイザー型",
                description: "健康的な生活を促すタイプ",
                metaphor: "健康コーチのような存在"
            },
            howToTalk: {
                style: "健康を気遣う優しい言葉",
                example: "『体調はどう？無理しないで』",
                goodAt: "健康相談、生活指導",
                notGoodAt: "ハードな交渉、無理な要求"
            },
            bestEnvironment: {
                where: "健康が重視される環境",
                example: "医療、健康産業、ウェルネス",
                withWho: "健康意識の高い人々",
                avoid: "不健康な労働環境"
            },
            relationshipTips: {
                strength: "みんなの健康を守る",
                weakness: "口うるさく感じられる",
                advice: "押し付けにならないように"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "体調優先型",
                description: "健康を守ることを最優先",
                metaphor: "体が資本という考え方"
            },
            stressResponse: {
                whatYouDo: "まず体調を整える",
                example: "ストレス → 休息と栄養補給",
                goodPoint: "健康的な対処法",
                badPoint: "仕事が後回しになる"
            },
            emergencyMode: {
                whatHappens: "健康第一で撤退",
                example: "体調不良なら即休む",
                recovery: "体調回復と共に復帰",
                timeToRecover: "体調次第（1-3週間）"
            },
            howToRecover: {
                bestWay: "十分な休養と栄養",
                example: "睡眠、栄養、軽い運動",
                environment: "健康的な生活環境",
                support: "健康を理解してくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "健康40% : ケア35% : 活動25%",
            whenBalanced: "健康的で持続可能な活動",
            whenImbalanced: "健康オタク、または不健康",
            tip: "養生→活動→休息→また養生"
        }
    },
    
    // ============================================
    // 28. 澤風大過 - 挑戦者型
    // ============================================
    "澤風大過": {
        id: 28,
        symbol: "☴☱",
        element: "澤風",
        nickname: "大挑戦者",
        emoji: "🎯",
        
        asEngineOS: {
            profile: {
                type: "限界突破エンジン",
                description: "常に限界に挑戦する",
                metaphor: "エクストリームスポーツ選手のような冒険心"
            },
            normalState: {
                whatHappens: "常により高い目標を設定",
                example: "『もっとできるはず』と限界に挑戦",
                energyLevel: "🔋🔋🔋🔋 (75%) - チャレンジモード"
            },
            superMode: {
                when: "大きな挑戦の機会が来た時",
                whatHappens: "全てを賭けて挑戦",
                example: "人生を変える大勝負に出る",
                energyLevel: "🔋🔋🔋🔋🔋 (100%) - 限界突破"
            },
            restMode: {
                whatHappens: "次の挑戦を計画",
                howToRest: "戦略を練る、体力回復",
                note: "休んでも挑戦心は消えない"
            },
            maintenance: {
                whatYouNeed: "大きな挑戦と冒険",
                howToCharge: "限界突破の達成感",
                warning: "無謀になりすぎない",
                tip: "計算されたリスクを"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "挑発刺激型",
                description: "周りも限界に挑戦させる",
                metaphor: "熱血コーチのような情熱"
            },
            howToTalk: {
                style: "挑戦的で刺激的な言葉",
                example: "『もっとできる！限界を超えろ！』",
                goodAt: "モチベーション向上、限界突破",
                notGoodAt: "慎重な調整、リスク管理"
            },
            bestEnvironment: {
                where: "挑戦が推奨される環境",
                example: "スポーツ、ベンチャー、開拓事業",
                withWho: "挑戦心のある人々",
                avoid: "安全第一の環境"
            },
            relationshipTips: {
                strength: "みんなを高みに導く",
                weakness: "プレッシャーをかけすぎる",
                advice: "人それぞれのペースも尊重"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "賭け突破型",
                description: "大きな賭けで状況を変える",
                metaphor: "オールインのギャンブラー"
            },
            stressResponse: {
                whatYouDo: "より大きな挑戦で打開",
                example: "ピンチ → 『ここで勝負！』",
                goodPoint: "劇的な逆転の可能性",
                badPoint: "失敗すると全てを失う"
            },
            emergencyMode: {
                whatHappens: "全てを賭ける",
                example: "最後の大勝負に出る",
                recovery: "結果次第で天国か地獄",
                timeToRecover: "結果による（即〜数ヶ月）"
            },
            howToRecover: {
                bestWay: "新しい挑戦で気持ちを切り替え",
                example: "次の目標に向かって進む",
                environment: "挑戦できる環境",
                support: "リスクを理解してくれる仲間"
            }
        },
        
        osBalance: {
            idealBalance: "挑戦50% : 情熱30% : 計算20%",
            whenBalanced: "計算された大胆さで成功",
            whenImbalanced: "無謀、または臆病",
            tip: "挑戦→結果→学習→次の挑戦"
        }
    },
    
    // ============================================
    // 29. 坎為水 - 流動者型
    // ============================================
    "坎為水": {
        id: 29,
        symbol: "☵",
        element: "水",
        nickname: "流動者",
        emoji: "💧",
        
        asEngineOS: {
            profile: {
                type: "流動適応エンジン",
                description: "水のように形を変えて進む",
                metaphor: "川の流れのような柔軟性"
            },
            normalState: {
                whatHappens: "障害を避けて流れる",
                example: "抵抗の少ない道を自然に選ぶ",
                energyLevel: "🔋🔋 (50%) - 流動モード"
            },
            superMode: {
                when: "大きな障害に直面した時",
                whatHappens: "あらゆる隙間を見つけて流れる",
                example: "どんな困難も迂回して進む",
                energyLevel: "🔋🔋🔋🔋 (80%) - 浸透モード"
            },
            restMode: {
                whatHappens: "静かに留まる",
                howToRest: "瞑想、静寂、停滞",
                note: "流れを止めて充電"
            },
            maintenance: {
                whatYouNeed: "自由な流れと変化",
                howToCharge: "スムーズに流れる感覚",
                warning: "停滞すると濁る",
                tip: "常に流れ続けよう"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "柔軟対応型",
                description: "相手に合わせて形を変える",
                metaphor: "水のような適応力"
            },
            howToTalk: {
                style: "相手の器に合わせる",
                example: "硬い人には柔らかく、柔らかい人には形を",
                goodAt: "適応、調整、浸透",
                notGoodAt: "強い主張、固定的な立場"
            },
            bestEnvironment: {
                where: "流動的な環境",
                example: "変化の多い職場、フリーランス",
                withWho: "柔軟な人々",
                avoid: "硬直的な環境"
            },
            relationshipTips: {
                strength: "どんな人とも合わせられる",
                weakness: "主体性がないように見える",
                advice: "時には形を保つことも"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "流体回避型",
                description: "水のように逃げて守る",
                metaphor: "掴もうとすると逃げる水"
            },
            stressResponse: {
                whatYouDo: "形を変えて逃げる",
                example: "圧力 → すり抜けて回避",
                goodPoint: "直接対決を避ける",
                badPoint: "逃げ癖がつく"
            },
            emergencyMode: {
                whatHappens: "完全に流動化",
                example: "掴まえられない存在になる",
                recovery: "安全になったら形を取り戻す",
                timeToRecover: "1週間（流れ次第）"
            },
            howToRecover: {
                bestWay: "自然な流れに身を任せる",
                example: "時の流れ、自然のリズム",
                environment: "制約のない自由な空間",
                support: "流れを理解してくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "流動45% : 適応35% : 浸透20%",
            whenBalanced: "どんな環境でも生き抜く",
            whenImbalanced: "形を失う、または硬直",
            tip: "流れる→浸透→変化→また流れる"
        }
    },
    
    // ============================================
    // 30. 離為火 - 情熱者型
    // ============================================
    "離為火": {
        id: 30,
        symbol: "☲",
        element: "火",
        nickname: "情熱者",
        emoji: "🔥",
        
        asEngineOS: {
            profile: {
                type: "情熱燃焼エンジン",
                description: "燃えるような情熱で突き進む",
                metaphor: "永遠に燃え続ける炎"
            },
            normalState: {
                whatHappens: "常に何かに情熱を注ぐ",
                example: "仕事も趣味も全力投球",
                energyLevel: "🔋🔋🔋🔋 (75%) - 燃焼モード"
            },
            superMode: {
                when: "情熱の対象を見つけた時",
                whatHappens: "全身全霊で燃え上がる",
                example: "寝食を忘れて没頭",
                energyLevel: "🔋🔋🔋🔋🔋 (100%) - 完全燃焼"
            },
            restMode: {
                whatHappens: "次の燃料を探す",
                howToRest: "新しい刺激、インスピレーション",
                note: "完全に消えることはない"
            },
            maintenance: {
                whatYouNeed: "燃える対象と燃料",
                howToCharge: "情熱を注げる何か",
                warning: "燃え尽きに注意",
                tip: "適度に燃料補給を"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "熱血伝道型",
                description: "情熱を周りに伝染させる",
                metaphor: "炎のような感染力"
            },
            howToTalk: {
                style: "熱く語り、感動させる",
                example: "『これは素晴らしい！』と熱弁",
                goodAt: "感動、説得、巻き込み",
                notGoodAt: "冷静な分析、客観性"
            },
            bestEnvironment: {
                where: "情熱が評価される環境",
                example: "営業、プレゼン、エンタメ",
                withWho: "熱い心を持つ人々",
                avoid: "冷めた環境"
            },
            relationshipTips: {
                strength: "人を熱くさせる力",
                weakness: "暑苦しいと感じられる",
                advice: "相手の温度も考慮しよう"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "激情爆発型",
                description: "感情の炎で全てを燃やす",
                metaphor: "怒りの炎で敵を焼き尽くす"
            },
            stressResponse: {
                whatYouDo: "激しく燃えて発散",
                example: "怒り → 爆発的な感情表出",
                goodPoint: "溜め込まない",
                badPoint: "周りを巻き込む"
            },
            emergencyMode: {
                whatHappens: "全てを燃やし尽くす",
                example: "破壊的な情熱の爆発",
                recovery: "灰から再生",
                timeToRecover: "1-2週間（燃え尽きてから）"
            },
            howToRecover: {
                bestWay: "新しい情熱を見つける",
                example: "新しい目標、新しい恋",
                environment: "刺激的な環境",
                support: "情熱を共有できる仲間"
            }
        },
        
        osBalance: {
            idealBalance: "情熱50% : 伝染30% : 制御20%",
            whenBalanced: "周りを明るく照らす存在",
            whenImbalanced: "燃え尽き、または冷淡",
            tip: "燃える→照らす→補給→また燃える"
        }
    },
    
    // ============================================
    // 31. 澤山咸 - 感応者型
    // ============================================
    "澤山咸": {
        id: 31,
        symbol: "☶☱",
        element: "澤山",
        nickname: "感応者",
        emoji: "💫",
        
        asEngineOS: {
            profile: {
                type: "感応共鳴エンジン",
                description: "微細な変化を感じ取る",
                metaphor: "高感度センサーのような感受性"
            },
            normalState: {
                whatHappens: "周囲の変化を敏感に察知",
                example: "空気の変化、人の感情を瞬時に感じる",
                energyLevel: "🔋🔋🔋 (55%) - センサーモード"
            },
            superMode: {
                when: "重要な変化の予兆を感じた時",
                whatHappens: "全感覚を研ぎ澄ます",
                example: "危険や機会を事前に察知",
                energyLevel: "🔋🔋🔋🔋 (85%) - 超感覚モード"
            },
            restMode: {
                whatHappens: "感覚を遮断",
                howToRest: "静寂、暗闇、無刺激",
                note: "感覚の休息が必要"
            },
            maintenance: {
                whatYouNeed: "適度な刺激と休息",
                howToCharge: "新しい感覚体験",
                warning: "刺激過多に注意",
                tip: "感度調整を学ぼう"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "共感察知型",
                description: "相手の気持ちを瞬時に理解",
                metaphor: "心のレーダー"
            },
            howToTalk: {
                style: "相手の感情に寄り添う",
                example: "言葉にならない気持ちも理解",
                goodAt: "共感、察知、気配り",
                notGoodAt: "鈍感な人との会話"
            },
            bestEnvironment: {
                where: "繊細さが活きる環境",
                example: "カウンセリング、芸術、デザイン",
                withWho: "感受性豊かな人々",
                avoid: "鈍感な環境"
            },
            relationshipTips: {
                strength: "深い理解と共感",
                weakness: "感じすぎて疲れる",
                advice: "感じすぎない距離感も"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "感覚遮断型",
                description: "感じないことで守る",
                metaphor: "シャッターを下ろす"
            },
            stressResponse: {
                whatYouDo: "感覚を麻痺させる",
                example: "辛い → 何も感じないようにする",
                goodPoint: "一時的な保護",
                badPoint: "大切なことも感じなくなる"
            },
            emergencyMode: {
                whatHappens: "完全に感覚を閉じる",
                example: "心を閉ざして防御",
                recovery: "少しずつ感覚を開く",
                timeToRecover: "2-3週間（徐々に開放）"
            },
            howToRecover: {
                bestWay: "安全な環境で感覚を開く",
                example: "信頼できる人と少しずつ",
                environment: "穏やかで安全な場所",
                support: "優しく待ってくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "感応40% : 共感35% : 保護25%",
            whenBalanced: "繊細な感覚で周りを助ける",
            whenImbalanced: "過敏、または鈍感",
            tip: "感じる→理解→休息→また感じる"
        }
    },
    
    // ============================================
    // 32. 雷風恒 - 継続者型
    // ============================================
    "雷風恒": {
        id: 32,
        symbol: "☴☳",
        element: "雷風",
        nickname: "継続者",
        emoji: "♾️",
        
        asEngineOS: {
            profile: {
                type: "持続継続エンジン",
                description: "一度決めたら最後まで続ける",
                metaphor: "マラソンランナーのような持久力"
            },
            normalState: {
                whatHappens: "淡々と継続する",
                example: "毎日同じルーティンを確実にこなす",
                energyLevel: "🔋🔋🔋 (60%) - 持続モード"
            },
            superMode: {
                when: "長期戦が必要な時",
                whatHappens: "驚異的な持続力を発揮",
                example: "何年でも続けられる忍耐力",
                energyLevel: "🔋🔋🔋🔋 (80%) - 永続モード"
            },
            restMode: {
                whatHappens: "ペースを落として継続",
                howToRest: "スローペースで続ける",
                note: "完全に止まることはない"
            },
            maintenance: {
                whatYouNeed: "継続できる環境",
                howToCharge: "積み重ねの実感",
                warning: "マンネリに注意",
                tip: "小さな変化も取り入れて"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "一貫性型",
                description: "いつも同じ態度で接する",
                metaphor: "変わらない安心感"
            },
            howToTalk: {
                style: "一貫した態度と言動",
                example: "いつも同じトーンで安定",
                goodAt: "信頼構築、長期的関係",
                notGoodAt: "変化対応、即興"
            },
            bestEnvironment: {
                where: "安定と継続が評価される環境",
                example: "伝統産業、公務員、定型業務",
                withWho: "長期的視点の人々",
                avoid: "変化の激しい環境"
            },
            relationshipTips: {
                strength: "変わらない信頼感",
                weakness: "面白みに欠ける",
                advice: "時にはサプライズも"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "忍耐継続型",
                description: "耐えて続けることで乗り切る",
                metaphor: "嵐が過ぎるまで耐える木"
            },
            stressResponse: {
                whatYouDo: "じっと耐えて続ける",
                example: "辛くても淡々と継続",
                goodPoint: "着実な前進",
                badPoint: "無理をしすぎる"
            },
            emergencyMode: {
                whatHappens: "最小限の機能で継続",
                example: "省エネモードで続ける",
                recovery: "継続しながら回復",
                timeToRecover: "長期戦（数ヶ月）"
            },
            howToRecover: {
                bestWay: "ペースを保ちながら回復",
                example: "無理せず着実に",
                environment: "安定した環境",
                support: "長期的に支えてくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "継続45% : 安定35% : 忍耐20%",
            whenBalanced: "長期的な成功を実現",
            whenImbalanced: "停滞、または継続断念",
            tip: "続ける→成果→改善→また続ける"
        }
    }
};

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HexagramHumanTraitsV3Part4;
}