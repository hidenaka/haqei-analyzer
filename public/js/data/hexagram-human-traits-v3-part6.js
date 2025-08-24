/**
 * Triple OS 人格システムデータベース v3.0 - Part 6 (41-48卦)
 * 
 * @author Claude Code
 * @date 2025-01-20
 * @version 3.0.0
 */

const HexagramHumanTraitsV3Part6 = {
    // ============================================
    // 41. 山澤損 - 奉仕者型
    // ============================================
    "山澤損": {
        id: 41,
        symbol: "☱☶",
        element: "山澤",
        nickname: "奉仕者",
        emoji: "🤲",
        
        asEngineOS: {
            profile: {
                type: "自己犠牲エンジン",
                description: "他者のために自分を捧げる",
                metaphor: "ろうそくのように自分を燃やして照らす"
            },
            normalState: {
                whatHappens: "常に他者優先で考える",
                example: "自分より相手のニーズを優先",
                energyLevel: "🔋🔋 (45%) - 奉仕モード"
            },
            superMode: {
                when: "誰かが本当に助けを必要とする時",
                whatHappens: "全てを捧げて助ける",
                example: "自分を犠牲にしても相手を救う",
                energyLevel: "🔋🔋🔋🔋 (85%) - 献身モード"
            },
            restMode: {
                whatHappens: "静かに自分を回復",
                howToRest: "誰にも気を使わない時間",
                note: "与えすぎた分を取り戻す"
            },
            maintenance: {
                whatYouNeed: "感謝と意味の実感",
                howToCharge: "誰かの役に立った実感",
                warning: "自己犠牲しすぎない",
                tip: "自分も大切にしよう"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "献身的サポート型",
                description: "みんなのために尽くす",
                metaphor: "献身的なボランティア"
            },
            howToTalk: {
                style: "相手のために何ができるか",
                example: "『何かお手伝いできることは？』",
                goodAt: "サポート、奉仕、献身",
                notGoodAt: "自己主張、要求"
            },
            bestEnvironment: {
                where: "奉仕が評価される環境",
                example: "NPO、医療、福祉、ボランティア",
                withWho: "奉仕の心を持つ人々",
                avoid: "利己的な環境"
            },
            relationshipTips: {
                strength: "無償の愛と献身",
                weakness: "利用されやすい",
                advice: "与えると受け取るのバランス"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "自己消去型",
                description: "自分を消して他者を守る",
                metaphor: "身代わりになる"
            },
            stressResponse: {
                whatYouDo: "自分が悪者になって解決",
                example: "責任を全て引き受ける",
                goodPoint: "他者を守る",
                badPoint: "自分が傷つく"
            },
            emergencyMode: {
                whatHappens: "完全に自己犠牲",
                example: "全てを失っても他者を守る",
                recovery: "誰かの幸せを見て回復",
                timeToRecover: "2-4週間（意味を見出せば）"
            },
            howToRecover: {
                bestWay: "奉仕の意味を再確認",
                example: "助けた人の笑顔を見る",
                environment: "感謝される環境",
                support: "価値を認めてくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "奉仕40% : 献身35% : 自己愛25%",
            whenBalanced: "健全な奉仕で社会貢献",
            whenImbalanced: "燃え尽き、または利己的",
            tip: "与える→受け取る→回復→また与える"
        }
    },
    
    // ============================================
    // 42. 風雷益 - 増幅者型
    // ============================================
    "風雷益": {
        id: 42,
        symbol: "☳☴",
        element: "風雷",
        nickname: "増幅者",
        emoji: "📢",
        
        asEngineOS: {
            profile: {
                type: "価値増幅エンジン",
                description: "全てをより良く、より大きく",
                metaphor: "増幅器のような拡大力"
            },
            normalState: {
                whatHappens: "常に価値を増やそうとする",
                example: "1を10に、10を100にする発想",
                energyLevel: "🔋🔋🔋 (70%) - 増幅モード"
            },
            superMode: {
                when: "大きな成長機会がある時",
                whatHappens: "爆発的な価値創造",
                example: "小さな種を大樹に育てる",
                energyLevel: "🔋🔋🔋🔋🔋 (100%) - 倍増モード"
            },
            restMode: {
                whatHappens: "次の増幅対象を探す",
                howToRest: "可能性を見つける時間",
                note: "常に成長を考える"
            },
            maintenance: {
                whatYouNeed: "成長と拡大の機会",
                howToCharge: "増幅の成功体験",
                warning: "拡大しすぎに注意",
                tip: "質と量のバランスを"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "価値拡大型",
                description: "みんなの価値を増幅",
                metaphor: "みんなを成長させるコーチ"
            },
            howToTalk: {
                style: "可能性を広げる話し方",
                example: "『もっとできる！』と励ます",
                goodAt: "成長促進、可能性開発",
                notGoodAt: "現状維持、縮小"
            },
            bestEnvironment: {
                where: "成長志向の環境",
                example: "成長企業、教育、投資",
                withWho: "向上心のある人々",
                avoid: "停滞的な環境"
            },
            relationshipTips: {
                strength: "みんなを成長させる",
                weakness: "プレッシャーになる",
                advice: "休息も成長の一部"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "逆転増幅型",
                description: "ピンチをチャンスに変える",
                metaphor: "マイナスをプラスに転換"
            },
            stressResponse: {
                whatYouDo: "問題を成長機会に変える",
                example: "失敗 → 『学びのチャンス！』",
                goodPoint: "前向きな転換力",
                badPoint: "問題を軽視することも"
            },
            emergencyMode: {
                whatHappens: "危機を最大の機会に",
                example: "どん底から大逆転を狙う",
                recovery: "成長と共に回復",
                timeToRecover: "1-2週間（成長を実感すれば）"
            },
            howToRecover: {
                bestWay: "小さな成功を積み重ねる",
                example: "一つずつ改善して成長",
                environment: "成長できる環境",
                support: "成長を応援する人"
            }
        },
        
        osBalance: {
            idealBalance: "増幅45% : 成長35% : 安定20%",
            whenBalanced: "持続的な価値創造",
            whenImbalanced: "暴走、または停滞",
            tip: "増やす→安定→確認→また増やす"
        }
    },
    
    // ============================================
    // 43. 澤天夬 - 決断者型
    // ============================================
    "澤天夬": {
        id: 43,
        symbol: "☰☱",
        element: "澤天",
        nickname: "決定者",
        emoji: "⚔️",
        
        asEngineOS: {
            profile: {
                type: "決定実行エンジン",
                description: "迷わず決めて実行",
                metaphor: "斬れ味鋭い刀"
            },
            normalState: {
                whatHappens: "常に決断の準備",
                example: "選択肢を見たら即決定",
                energyLevel: "🔋🔋🔋 (70%) - 決定モード"
            },
            superMode: {
                when: "重大な決断の時",
                whatHappens: "断固たる決定",
                example: "全責任を負って大決断",
                energyLevel: "🔋🔋🔋🔋🔋 (100%) - 断行モード"
            },
            restMode: {
                whatHappens: "決断の結果を見守る",
                howToRest: "静観の時間",
                note: "次の決断に備える"
            },
            maintenance: {
                whatYouNeed: "決定権と責任",
                howToCharge: "決断の成功",
                warning: "独断的にならない",
                tip: "決断と相談のバランス"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "断定指示型",
                description: "明確な指示を出す",
                metaphor: "決断力のあるリーダー"
            },
            howToTalk: {
                style: "断定的で明確",
                example: "『これで決まり』と宣言",
                goodAt: "決定、指示、締結",
                notGoodAt: "相談、議論、迷い"
            },
            bestEnvironment: {
                where: "決断力が求められる環境",
                example: "経営、司法、緊急対応",
                withWho: "実行力のある人々",
                avoid: "合議制の環境"
            },
            relationshipTips: {
                strength: "迷いのない決定力",
                weakness: "独裁的に見える",
                advice: "みんなの意見も聞こう"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "切断防衛型",
                description: "問題を切り捨てて守る",
                metaphor: "不要なものを断つ"
            },
            stressResponse: {
                whatYouDo: "問題を切り捨てる",
                example: "困難 → 『これは切る』",
                goodPoint: "素早い問題解決",
                badPoint: "大切なものも切る"
            },
            emergencyMode: {
                whatHappens: "全てを断ち切る",
                example: "関係も仕事も断つ",
                recovery: "新しく始める",
                timeToRecover: "1週間（決断すれば即）"
            },
            howToRecover: {
                bestWay: "新しい決断",
                example: "次の目標を決める",
                environment: "決断できる環境",
                support: "決断を支持する人"
            }
        },
        
        osBalance: {
            idealBalance: "決断50% : 実行35% : 責任15%",
            whenBalanced: "的確な決断で前進",
            whenImbalanced: "独断、または優柔不断",
            tip: "決める→実行→評価→また決める"
        }
    },
    
    // ============================================
    // 44. 天風姤 - 出会い型
    // ============================================
    "天風姤": {
        id: 44,
        symbol: "☴☰",
        element: "天風",
        nickname: "出会い人",
        emoji: "🤝",
        
        asEngineOS: {
            profile: {
                type: "縁結びエンジン",
                description: "人と人、物と物を結ぶ",
                metaphor: "縁を紡ぐ織り手"
            },
            normalState: {
                whatHappens: "常に新しい出会いを求める",
                example: "人脈を広げ、繋げる",
                energyLevel: "🔋🔋🔋 (60%) - 縁結びモード"
            },
            superMode: {
                when: "運命的な出会いの時",
                whatHappens: "縁を最大限に活かす",
                example: "出会いから大きな価値を生む",
                energyLevel: "🔋🔋🔋🔋 (90%) - 運命モード"
            },
            restMode: {
                whatHappens: "既存の縁を深める",
                howToRest: "親しい人との時間",
                note: "新しい縁より深い縁"
            },
            maintenance: {
                whatYouNeed: "新しい出会いと縁",
                howToCharge: "素敵な出会い",
                warning: "縁に振り回されない",
                tip: "縁を大切に育てよう"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "人脈構築型",
                description: "広い人脈を作る",
                metaphor: "社交界の蝶"
            },
            howToTalk: {
                style: "誰とでもすぐ仲良く",
                example: "『はじめまして！』から親友に",
                goodAt: "人脈作り、紹介、仲介",
                notGoodAt: "深い関係、一対一"
            },
            bestEnvironment: {
                where: "人との出会いが多い環境",
                example: "営業、イベント、交流会",
                withWho: "社交的な人々",
                avoid: "閉鎖的な環境"
            },
            relationshipTips: {
                strength: "豊富な人脈",
                weakness: "表面的になりがち",
                advice: "量より質も大切に"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "縁切り型",
                description: "悪縁を断つ",
                metaphor: "必要な縁だけ残す"
            },
            stressResponse: {
                whatYouDo: "問題のある縁を切る",
                example: "トラブル → 関係を断つ",
                goodPoint: "悪縁から身を守る",
                badPoint: "孤立することも"
            },
            emergencyMode: {
                whatHappens: "全ての縁を見直す",
                example: "人間関係の大整理",
                recovery: "新しい縁で回復",
                timeToRecover: "2週間（新しい出会いで）"
            },
            howToRecover: {
                bestWay: "新しい出会い",
                example: "新しい環境、新しい人",
                environment: "出会いのある場所",
                support: "新しい仲間"
            }
        },
        
        osBalance: {
            idealBalance: "縁結び45% : 人脈35% : 選別20%",
            whenBalanced: "良縁に恵まれる",
            whenImbalanced: "悪縁、または孤立",
            tip: "出会う→繋げる→育てる→また出会う"
        }
    },
    
    // ============================================
    // 45. 澤地萃 - 集結者型
    // ============================================
    "澤地萃": {
        id: 45,
        symbol: "☷☱",
        element: "澤地",
        nickname: "集結者",
        emoji: "🎪",
        
        asEngineOS: {
            profile: {
                type: "集合統合エンジン",
                description: "バラバラなものを集めて一つに",
                metaphor: "磁石のような求心力"
            },
            normalState: {
                whatHappens: "人や物を集める",
                example: "自然と人が集まってくる",
                energyLevel: "🔋🔋🔋 (60%) - 集結モード"
            },
            superMode: {
                when: "大きな集結が必要な時",
                whatHappens: "強力な求心力を発揮",
                example: "大勢を一つにまとめる",
                energyLevel: "🔋🔋🔋🔋 (90%) - 統合モード"
            },
            restMode: {
                whatHappens: "集めたものを整理",
                howToRest: "整理整頓の時間",
                note: "次の集結に備える"
            },
            maintenance: {
                whatYouNeed: "集める対象と場",
                howToCharge: "集結の成功",
                warning: "集めすぎに注意",
                tip: "質も考えて集めよう"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "コミュニティ型",
                description: "みんなを集める",
                metaphor: "コミュニティマネージャー"
            },
            howToTalk: {
                style: "みんなを巻き込む",
                example: "『みんなで集まろう！』",
                goodAt: "イベント企画、集客、団結",
                notGoodAt: "個別対応、少人数"
            },
            bestEnvironment: {
                where: "集団活動の環境",
                example: "イベント、コミュニティ、団体",
                withWho: "集団行動が好きな人々",
                avoid: "個人主義的環境"
            },
            relationshipTips: {
                strength: "みんなをまとめる力",
                weakness: "個が見えなくなる",
                advice: "個人も大切にしよう"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "集団防衛型",
                description: "みんなで守る",
                metaphor: "群れで身を守る"
            },
            stressResponse: {
                whatYouDo: "仲間を集めて対処",
                example: "危機 → 全員集合",
                goodPoint: "集団の力",
                badPoint: "一人では弱い"
            },
            emergencyMode: {
                whatHappens: "全員で立ち向かう",
                example: "団結して危機を乗り越える",
                recovery: "みんなで回復",
                timeToRecover: "1週間（みんなと一緒なら）"
            },
            howToRecover: {
                bestWay: "みんなとの時間",
                example: "グループ活動、パーティー",
                environment: "にぎやかな環境",
                support: "たくさんの仲間"
            }
        },
        
        osBalance: {
            idealBalance: "集結45% : 統合35% : 個別20%",
            whenBalanced: "強力なコミュニティを作る",
            whenImbalanced: "烏合の衆、または分裂",
            tip: "集める→まとめる→活動→また集める"
        }
    },
    
    // ============================================
    // 46. 地風升 - 成長者型
    // ============================================
    "地風升": {
        id: 46,
        symbol: "☴☷",
        element: "地風",
        nickname: "成長者",
        emoji: "🌱",
        
        asEngineOS: {
            profile: {
                type: "着実成長エンジン",
                description: "一歩ずつ確実に成長",
                metaphor: "竹のようにまっすぐ伸びる"
            },
            normalState: {
                whatHappens: "毎日少しずつ成長",
                example: "昨日より今日、今日より明日",
                energyLevel: "🔋🔋🔋 (55%) - 成長モード"
            },
            superMode: {
                when: "成長の転機が来た時",
                whatHappens: "急成長を遂げる",
                example: "一気にレベルアップ",
                energyLevel: "🔋🔋🔋🔋 (85%) - 急成長モード"
            },
            restMode: {
                whatHappens: "根を張る時間",
                howToRest: "基礎を固める",
                note: "見えない成長も大切"
            },
            maintenance: {
                whatYouNeed: "成長の実感と環境",
                howToCharge: "成長の喜び",
                warning: "急ぎすぎない",
                tip: "着実な成長が最強"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "育成支援型",
                description: "みんなの成長を助ける",
                metaphor: "成長を見守る園丁"
            },
            howToTalk: {
                style: "成長を促す言葉",
                example: "『少しずつ良くなってる』",
                goodAt: "育成、教育、支援",
                notGoodAt: "即効性、短期決戦"
            },
            bestEnvironment: {
                where: "成長できる環境",
                example: "教育、人材育成、農業",
                withWho: "成長意欲のある人々",
                avoid: "即効性重視の環境"
            },
            relationshipTips: {
                strength: "着実な信頼構築",
                weakness: "スピード感に欠ける",
                advice: "時には飛躍も必要"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "退行防衛型",
                description: "基本に戻って守る",
                metaphor: "根っこに戻る"
            },
            stressResponse: {
                whatYouDo: "基礎から見直す",
                example: "問題 → 原点回帰",
                goodPoint: "確実な対処",
                badPoint: "時間がかかる"
            },
            emergencyMode: {
                whatHappens: "成長を一時停止",
                example: "守りに入って様子見",
                recovery: "少しずつ成長再開",
                timeToRecover: "2-3週間（ゆっくり）"
            },
            howToRecover: {
                bestWay: "小さな成長から",
                example: "できることから一つずつ",
                environment: "プレッシャーのない環境",
                support: "成長を見守る人"
            }
        },
        
        osBalance: {
            idealBalance: "成長40% : 支援35% : 基礎25%",
            whenBalanced: "着実に高みへ到達",
            whenImbalanced: "停滞、または無理な成長",
            tip: "成長→定着→次の成長"
        }
    },
    
    // ============================================
    // 47. 澤水困 - 克服者型
    // ============================================
    "澤水困": {
        id: 47,
        symbol: "☵☱",
        element: "澤水",
        nickname: "克服者",
        emoji: "🏔️",
        
        asEngineOS: {
            profile: {
                type: "困難克服エンジン",
                description: "困難があるほど燃える",
                metaphor: "逆境を糧にする"
            },
            normalState: {
                whatHappens: "困難を探して挑む",
                example: "楽な道より困難な道を選ぶ",
                energyLevel: "🔋🔋🔋 (65%) - 挑戦モード"
            },
            superMode: {
                when: "大きな困難に直面",
                whatHappens: "不屈の精神で立ち向かう",
                example: "絶体絶命から復活",
                energyLevel: "🔋🔋🔋🔋🔋 (95%) - 不屈モード"
            },
            restMode: {
                whatHappens: "次の困難に備える",
                howToRest: "力を蓄える時間",
                note: "困難がないと退屈"
            },
            maintenance: {
                whatYouNeed: "乗り越える価値のある困難",
                howToCharge: "困難克服の達成感",
                warning: "無理な困難は避ける",
                tip: "困難も選んで挑もう"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "困難共有型",
                description: "一緒に困難を乗り越える",
                metaphor: "戦友のような絆"
            },
            howToTalk: {
                style: "困難を共に乗り越えよう",
                example: "『一緒に頑張ろう』",
                goodAt: "団結、共闘、励まし",
                notGoodAt: "楽観的な話、軽い話題"
            },
            bestEnvironment: {
                where: "困難に立ち向かう環境",
                example: "災害支援、困難プロジェクト",
                withWho: "困難を恐れない人々",
                avoid: "安楽な環境"
            },
            relationshipTips: {
                strength: "困難を通じた深い絆",
                weakness: "平和な時に物足りない",
                advice: "日常も大切にしよう"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "困難直面型",
                description: "困難から逃げない",
                metaphor: "壁に正面からぶつかる"
            },
            stressResponse: {
                whatYouDo: "より大きな困難で忘れる",
                example: "問題A → より大きな問題Bに挑戦",
                goodPoint: "成長の機会",
                badPoint: "疲れ果てる"
            },
            emergencyMode: {
                whatHappens: "全力で困難と戦う",
                example: "最後まで諦めない",
                recovery: "克服して回復",
                timeToRecover: "困難次第（1週間〜数ヶ月）"
            },
            howToRecover: {
                bestWay: "困難を克服する",
                example: "問題を解決して前進",
                environment: "挑戦できる環境",
                support: "共に戦う仲間"
            }
        },
        
        osBalance: {
            idealBalance: "克服45% : 挑戦35% : 休息20%",
            whenBalanced: "どんな困難も乗り越える",
            whenImbalanced: "困難中毒、または逃避",
            tip: "挑む→克服→休息→また挑む"
        }
    },
    
    // ============================================
    // 48. 水風井 - 供給者型
    // ============================================
    "水風井": {
        id: 48,
        symbol: "☴☵",
        element: "水風",
        nickname: "供給者",
        emoji: "⛲",
        
        asEngineOS: {
            profile: {
                type: "資源供給エンジン",
                description: "尽きることなく与え続ける",
                metaphor: "枯れない井戸"
            },
            normalState: {
                whatHappens: "常に何かを提供",
                example: "知識、時間、資源を惜しみなく",
                energyLevel: "🔋🔋🔋 (60%) - 供給モード"
            },
            superMode: {
                when: "大きな需要がある時",
                whatHappens: "無限の供給力",
                example: "みんなのニーズを満たす",
                energyLevel: "🔋🔋🔋🔋 (85%) - 無限供給"
            },
            restMode: {
                whatHappens: "源泉を補充",
                howToRest: "自分の井戸を満たす",
                note: "与えるために蓄える"
            },
            maintenance: {
                whatYouNeed: "供給源の確保",
                howToCharge: "誰かの役に立つ喜び",
                warning: "枯渇しないように",
                tip: "源泉を大切に"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "提供者型",
                description: "みんなに必要なものを提供",
                metaphor: "みんなの頼れる供給源"
            },
            howToTalk: {
                style: "何が必要か聞く",
                example: "『何か必要なものある？』",
                goodAt: "提供、支援、供給",
                notGoodAt: "要求、交渉"
            },
            bestEnvironment: {
                where: "供給が必要な環境",
                example: "支援活動、サービス業、物流",
                withWho: "必要としてくれる人々",
                avoid: "与える機会がない環境"
            },
            relationshipTips: {
                strength: "頼れる存在",
                weakness: "与えすぎて枯れる",
                advice: "受け取ることも学ぼう"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "供給停止型",
                description: "供給を止めて守る",
                metaphor: "井戸に蓋をする"
            },
            stressResponse: {
                whatYouDo: "供給を制限",
                example: "要求過多 → 供給停止",
                goodPoint: "自己保護",
                badPoint: "信頼を失う"
            },
            emergencyMode: {
                whatHappens: "完全に供給停止",
                example: "井戸を閉じる",
                recovery: "少しずつ供給再開",
                timeToRecover: "2-3週間（補充が必要）"
            },
            howToRecover: {
                bestWay: "源泉を満たす",
                example: "自分のための時間",
                environment: "要求のない環境",
                support: "与えてくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "供給40% : 補充35% : 保護25%",
            whenBalanced: "枯れない供給源として機能",
            whenImbalanced: "枯渇、または出し惜しみ",
            tip: "与える→補充→確認→また与える"
        }
    }
};

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HexagramHumanTraitsV3Part6;
}