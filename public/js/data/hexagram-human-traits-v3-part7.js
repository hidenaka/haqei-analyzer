/**
 * Triple OS 人格システムデータベース v3.0 - Part 7 (49-56卦)
 * 
 * @author Claude Code
 * @date 2025-01-20
 * @version 3.0.0
 */

const HexagramHumanTraitsV3Part7 = {
    // ============================================
    // 49. 澤火革 - 革命者型
    // ============================================
    "澤火革": {
        id: 49,
        symbol: "☲☱",
        element: "澤火",
        nickname: "革命者",
        emoji: "🔥",
        
        asEngineOS: {
            profile: {
                type: "変革革命エンジン",
                description: "古いものを壊し新しいものを作る",
                metaphor: "革命の炎を燃やす"
            },
            normalState: {
                whatHappens: "常に変革の種を探す",
                example: "『これは変えるべきだ』と感じる",
                energyLevel: "🔋🔋🔋 (70%) - 革命準備"
            },
            superMode: {
                when: "大きな変革の時が来た時",
                whatHappens: "既存の体制を覆す",
                example: "組織や社会に革命を起こす",
                energyLevel: "🔋🔋🔋🔋🔋 (100%) - 革命実行"
            },
            restMode: {
                whatHappens: "次の革命を計画",
                howToRest: "新しいビジョンを描く",
                note: "静かに革命の準備"
            },
            maintenance: {
                whatYouNeed: "変革すべき対象",
                howToCharge: "革命の成功",
                warning: "破壊だけにならない",
                tip: "創造的な破壊を"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "変革促進型",
                description: "みんなに変化を促す",
                metaphor: "革命のリーダー"
            },
            howToTalk: {
                style: "熱く変革を語る",
                example: "『今こそ変わる時だ！』",
                goodAt: "変革促進、意識改革",
                notGoodAt: "現状維持、妥協"
            },
            bestEnvironment: {
                where: "変革が必要な環境",
                example: "改革プロジェクト、社会運動",
                withWho: "変化を求める人々",
                avoid: "保守的な環境"
            },
            relationshipTips: {
                strength: "変化を起こす力",
                weakness: "過激に見られる",
                advice: "段階的な変化も考慮"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "全面改革型",
                description: "全てを変えて守る",
                metaphor: "焼き畑農業のような再生"
            },
            stressResponse: {
                whatYouDo: "根本から変える",
                example: "問題 → システム全体を変革",
                goodPoint: "根本的解決",
                badPoint: "リスクが大きい"
            },
            emergencyMode: {
                whatHappens: "革命的行動",
                example: "既存の全てを否定",
                recovery: "新体制の確立",
                timeToRecover: "1-3ヶ月（変革完了まで）"
            },
            howToRecover: {
                bestWay: "新しいシステムの構築",
                example: "ゼロから作り直す",
                environment: "変化を許容する環境",
                support: "革命を共にする仲間"
            }
        },
        
        osBalance: {
            idealBalance: "革命45% : 創造35% : 安定20%",
            whenBalanced: "建設的な変革を実現",
            whenImbalanced: "破壊的、または停滞",
            tip: "壊す→創る→定着→また変革"
        }
    },
    
    // ============================================
    // 50. 火風鼎 - 創造者型
    // ============================================
    "火風鼎": {
        id: 50,
        symbol: "☴☲",
        element: "火風",
        nickname: "創造者",
        emoji: "🎨",
        
        asEngineOS: {
            profile: {
                type: "創造変容エンジン",
                description: "素材を組み合わせて新しいものを創る",
                metaphor: "錬金術師のような創造力"
            },
            normalState: {
                whatHappens: "常に何かを創造している",
                example: "異なるものを組み合わせて新しい価値",
                energyLevel: "🔋🔋🔋 (65%) - 創造モード"
            },
            superMode: {
                when: "創造のインスピレーション",
                whatHappens: "天才的な創造力を発揮",
                example: "誰も思いつかないものを生み出す",
                energyLevel: "🔋🔋🔋🔋🔋 (95%) - 天才モード"
            },
            restMode: {
                whatHappens: "素材を集める",
                howToRest: "インプットの時間",
                note: "創造の準備期間"
            },
            maintenance: {
                whatYouNeed: "創造の自由と素材",
                howToCharge: "創造の喜び",
                warning: "完成させることも大切",
                tip: "創造と完成のバランス"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "クリエイター型",
                description: "創造的な関わり方",
                metaphor: "アーティストのような感性"
            },
            howToTalk: {
                style: "創造的で独特な表現",
                example: "『こんなのどう？』と新しい提案",
                goodAt: "創造的提案、発想転換",
                notGoodAt: "定型的対応、ルーティン"
            },
            bestEnvironment: {
                where: "創造性が評価される環境",
                example: "クリエイティブ業界、研究開発",
                withWho: "創造的な人々",
                avoid: "型にはまった環境"
            },
            relationshipTips: {
                strength: "新しい価値を生む",
                weakness: "現実離れすることも",
                advice: "実現可能性も考慮"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "創造逃避型",
                description: "創造の世界に逃げ込む",
                metaphor: "芸術に没頭して現実逃避"
            },
            stressResponse: {
                whatYouDo: "創造活動に逃げる",
                example: "問題 → 創作に没頭",
                goodPoint: "創造的昇華",
                badPoint: "現実から目を背ける"
            },
            emergencyMode: {
                whatHappens: "創造の世界に籠る",
                example: "現実を忘れて創作",
                recovery: "作品完成で満足",
                timeToRecover: "作品次第（数日〜数ヶ月）"
            },
            howToRecover: {
                bestWay: "創造活動を通じて",
                example: "作品を作り上げる",
                environment: "創作できる環境",
                support: "創造を理解する人"
            }
        },
        
        osBalance: {
            idealBalance: "創造50% : 実現30% : 休息20%",
            whenBalanced: "価値ある作品を生み出す",
            whenImbalanced: "未完成の山、または枯渇",
            tip: "創る→完成→休む→また創る"
        }
    },
    
    // ============================================
    // 51. 震為雷 - 衝撃者型
    // ============================================
    "震為雷": {
        id: 51,
        symbol: "☳",
        element: "雷",
        nickname: "衝撃者",
        emoji: "⚡",
        
        asEngineOS: {
            profile: {
                type: "衝撃起動エンジン",
                description: "雷のような瞬発力で動く",
                metaphor: "稲妻のような瞬間的パワー"
            },
            normalState: {
                whatHappens: "エネルギーを蓄積",
                example: "静かにパワーをチャージ",
                energyLevel: "🔋🔋 (50%) - 充電中"
            },
            superMode: {
                when: "爆発的な力が必要な時",
                whatHappens: "雷のような衝撃を与える",
                example: "一瞬で状況を変える",
                energyLevel: "🔋🔋🔋🔋🔋 (100%) - 放電！"
            },
            restMode: {
                whatHappens: "完全に静止",
                howToRest: "エネルギー温存",
                note: "次の雷に備える"
            },
            maintenance: {
                whatYouNeed: "放電の機会",
                howToCharge: "静電気のように蓄積",
                warning: "暴発に注意",
                tip: "適切なタイミングで放電"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "インパクト型",
                description: "強烈な印象を与える",
                metaphor: "忘れられない衝撃"
            },
            howToTalk: {
                style: "短く強烈なメッセージ",
                example: "一言で核心を突く",
                goodAt: "インパクト、記憶に残る",
                notGoodAt: "長い会話、穏やかな交流"
            },
            bestEnvironment: {
                where: "瞬発力が必要な環境",
                example: "緊急対応、スポーツ、プレゼン",
                withWho: "スピード感のある人々",
                avoid: "ゆったりした環境"
            },
            relationshipTips: {
                strength: "忘れられない存在",
                weakness: "威圧的に感じられる",
                advice: "時には穏やかさも"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "電撃反撃型",
                description: "雷で反撃する",
                metaphor: "触れたら感電"
            },
            stressResponse: {
                whatYouDo: "瞬間的に爆発",
                example: "攻撃 → 即座に雷撃",
                goodPoint: "強力な防御",
                badPoint: "周囲も巻き込む"
            },
            emergencyMode: {
                whatHappens: "全エネルギー放出",
                example: "最大出力で反撃",
                recovery: "放電後は充電必要",
                timeToRecover: "1週間（再充電）"
            },
            howToRecover: {
                bestWay: "静かに充電",
                example: "一人で静養",
                environment: "刺激の少ない場所",
                support: "そっとしておいてくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "衝撃45% : 蓄積35% : 制御20%",
            whenBalanced: "適切なタイミングで力を発揮",
            whenImbalanced: "暴発、または不発",
            tip: "蓄積→放電→休息→また蓄積"
        }
    },
    
    // ============================================
    // 52. 艮為山 - 不動者型
    // ============================================
    "艮為山": {
        id: 52,
        symbol: "☶",
        element: "山",
        nickname: "不動者",
        emoji: "⛰️",
        
        asEngineOS: {
            profile: {
                type: "不動安定エンジン",
                description: "山のように動じない",
                metaphor: "何があっても揺るがない山"
            },
            normalState: {
                whatHappens: "どっしりと構える",
                example: "周りが騒いでも動じない",
                energyLevel: "🔋🔋🔋 (60%) - 安定稼働"
            },
            superMode: {
                when: "絶対的な安定が必要な時",
                whatHappens: "完全に不動の構え",
                example: "嵐の中でも微動だにしない",
                energyLevel: "🔋🔋🔋🔋 (80%) - 完全不動"
            },
            restMode: {
                whatHappens: "もともと動かない",
                howToRest: "そのまま",
                note: "常に休息状態"
            },
            maintenance: {
                whatYouNeed: "動かない自由",
                howToCharge: "静寂と安定",
                warning: "固まりすぎに注意",
                tip: "時には動くことも"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "安定供給型",
                description: "いつも同じ安心感",
                metaphor: "頼れる山のような存在"
            },
            howToTalk: {
                style: "落ち着いた一定のトーン",
                example: "いつも同じペースで話す",
                goodAt: "安心感、信頼性、一貫性",
                notGoodAt: "変化、柔軟性、即応"
            },
            bestEnvironment: {
                where: "安定が求められる環境",
                example: "守衛、管理、基幹業務",
                withWho: "落ち着いた人々",
                avoid: "変化の激しい環境"
            },
            relationshipTips: {
                strength: "絶対的な安心感",
                weakness: "つまらないと思われる",
                advice: "たまには変化も見せよう"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "完全停止型",
                description: "動かないことで守る",
                metaphor: "岩になる"
            },
            stressResponse: {
                whatYouDo: "完全に動きを止める",
                example: "何を言われても無反応",
                goodPoint: "攻撃を受け流す",
                badPoint: "機会も逃す"
            },
            emergencyMode: {
                whatHappens: "石化する",
                example: "完全に反応を止める",
                recovery: "時間が解決",
                timeToRecover: "1ヶ月以上（ゆっくり）"
            },
            howToRecover: {
                bestWay: "自然に任せる",
                example: "時の流れに任せる",
                environment: "変化のない環境",
                support: "待ってくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "不動50% : 安定35% : 柔軟15%",
            whenBalanced: "組織の礎として機能",
            whenImbalanced: "化石化、または不安定",
            tip: "守る→維持→時々動く→また守る"
        }
    },
    
    // ============================================
    // 53. 風山漸 - 段階者型
    // ============================================
    "風山漸": {
        id: 53,
        symbol: "☶☴",
        element: "風山",
        nickname: "段階者",
        emoji: "📊",
        
        asEngineOS: {
            profile: {
                type: "段階進化エンジン",
                description: "一段ずつ確実に上る",
                metaphor: "階段を一歩ずつ上る"
            },
            normalState: {
                whatHappens: "計画的に段階を踏む",
                example: "手順通りに進める",
                energyLevel: "🔋🔋🔋 (55%) - 段階モード"
            },
            superMode: {
                when: "重要な段階に達した時",
                whatHappens: "次のレベルへ進化",
                example: "準備完了で次のステージへ",
                energyLevel: "🔋🔋🔋🔋 (80%) - レベルアップ"
            },
            restMode: {
                whatHappens: "現在の段階を固める",
                howToRest: "今のレベルを定着",
                note: "次の段階への準備"
            },
            maintenance: {
                whatYouNeed: "明確な段階と目標",
                howToCharge: "段階クリアの達成感",
                warning: "飛び級は危険",
                tip: "一歩ずつ確実に"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "段階的指導型",
                description: "レベルに合わせて導く",
                metaphor: "段階的に教える先生"
            },
            howToTalk: {
                style: "相手のレベルに合わせる",
                example: "『まずはここから始めよう』",
                goodAt: "段階的指導、計画立案",
                notGoodAt: "飛躍的発想、即興"
            },
            bestEnvironment: {
                where: "段階的成長の環境",
                example: "教育、トレーニング、昇進制度",
                withWho: "着実に成長する人々",
                avoid: "急成長を求める環境"
            },
            relationshipTips: {
                strength: "着実な信頼構築",
                weakness: "遅いと感じられる",
                advice: "時には飛躍も必要"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "段階後退型",
                description: "一段ずつ下がって守る",
                metaphor: "安全な段階まで戻る"
            },
            stressResponse: {
                whatYouDo: "前の段階に戻る",
                example: "難しい → 基本に戻る",
                goodPoint: "確実な対処",
                badPoint: "後退と見られる"
            },
            emergencyMode: {
                whatHappens: "最初の段階まで戻る",
                example: "原点回帰",
                recovery: "また一歩ずつ",
                timeToRecover: "段階次第（数週間〜数ヶ月）"
            },
            howToRecover: {
                bestWay: "一段ずつ上り直す",
                example: "基礎から積み上げる",
                environment: "段階的成長が許される環境",
                support: "プロセスを理解する人"
            }
        },
        
        osBalance: {
            idealBalance: "段階45% : 着実35% : 柔軟20%",
            whenBalanced: "確実に目標に到達",
            whenImbalanced: "停滞、または飛躍失敗",
            tip: "計画→実行→確認→次の段階"
        }
    },
    
    // ============================================
    // 54. 雷澤帰妹 - 調和者型
    // ============================================
    "雷澤帰妹": {
        id: 54,
        symbol: "☱☳",
        element: "雷澤",
        nickname: "調和者",
        emoji: "💑",
        
        asEngineOS: {
            profile: {
                type: "関係調和エンジン",
                description: "人と人を調和させる",
                metaphor: "縁結びの神様"
            },
            normalState: {
                whatHappens: "関係性を調整",
                example: "人と人の間を取り持つ",
                energyLevel: "🔋🔋🔋 (60%) - 調和モード"
            },
            superMode: {
                when: "関係修復が必要な時",
                whatHappens: "完璧な調和を作る",
                example: "対立を解消し、絆を深める",
                energyLevel: "🔋🔋🔋🔋 (85%) - 調停モード"
            },
            restMode: {
                whatHappens: "自分の関係を見直す",
                howToRest: "内省と関係整理",
                note: "自分との調和も大切"
            },
            maintenance: {
                whatYouNeed: "調和する対象",
                howToCharge: "関係改善の成功",
                warning: "おせっかいに注意",
                tip: "押し付けない調和を"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "仲介調停型",
                description: "みんなの間を取り持つ",
                metaphor: "優れた仲人"
            },
            howToTalk: {
                style: "双方の立場を理解",
                example: "『お互いの気持ちはわかる』",
                goodAt: "仲介、調停、関係構築",
                notGoodAt: "対立、競争、個人プレー"
            },
            bestEnvironment: {
                where: "調和が必要な環境",
                example: "人事、カウンセリング、外交",
                withWho: "協調的な人々",
                avoid: "競争的な環境"
            },
            relationshipTips: {
                strength: "みんなを繋げる力",
                weakness: "八方美人に見える",
                advice: "自分の立場も大切に"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "関係依存型",
                description: "関係性で身を守る",
                metaphor: "人間関係の盾"
            },
            stressResponse: {
                whatYouDo: "誰かに頼る",
                example: "困った → 人間関係で解決",
                goodPoint: "支援を得やすい",
                badPoint: "自立性に欠ける"
            },
            emergencyMode: {
                whatHappens: "全ての関係を動員",
                example: "みんなに助けを求める",
                recovery: "関係修復と共に",
                timeToRecover: "2週間（関係次第）"
            },
            howToRecover: {
                bestWay: "関係性の再構築",
                example: "信頼関係を取り戻す",
                environment: "支援的な環境",
                support: "理解ある仲間"
            }
        },
        
        osBalance: {
            idealBalance: "調和45% : 仲介30% : 自立25%",
            whenBalanced: "関係の要として機能",
            whenImbalanced: "依存的、または孤立",
            tip: "繋ぐ→調和→成長→また繋ぐ"
        }
    },
    
    // ============================================
    // 55. 雷火豊 - 豊穣者型
    // ============================================
    "雷火豊": {
        id: 55,
        symbol: "☲☳",
        element: "雷火",
        nickname: "豊穣者",
        emoji: "🌾",
        
        asEngineOS: {
            profile: {
                type: "豊穣生産エンジン",
                description: "豊かさを生み出し続ける",
                metaphor: "実り豊かな大地"
            },
            normalState: {
                whatHappens: "常に何かを生産",
                example: "アイデア、成果を量産",
                energyLevel: "🔋🔋🔋🔋 (75%) - 生産モード"
            },
            superMode: {
                when: "大豊作の時期",
                whatHappens: "爆発的な生産性",
                example: "通常の10倍の成果",
                energyLevel: "🔋🔋🔋🔋🔋 (100%) - 豊作モード"
            },
            restMode: {
                whatHappens: "次の豊作の準備",
                howToRest: "種まきと土作り",
                note: "休耕も必要"
            },
            maintenance: {
                whatYouNeed: "豊かな環境と資源",
                howToCharge: "収穫の喜び",
                warning: "豊作貧乏に注意",
                tip: "質も量も大切に"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "豊かさ分配型",
                description: "みんなに豊かさを分ける",
                metaphor: "豊作を分かち合う"
            },
            howToTalk: {
                style: "豊かで寛大な態度",
                example: "『みんなで分かち合おう』",
                goodAt: "共有、分配、豊かさの創出",
                notGoodAt: "節約、制限、厳格さ"
            },
            bestEnvironment: {
                where: "豊かさが評価される環境",
                example: "生産業、農業、クリエイティブ",
                withWho: "豊かさを求める人々",
                avoid: "欠乏的な環境"
            },
            relationshipTips: {
                strength: "みんなを豊かにする",
                weakness: "浪費的に見える",
                advice: "持続可能な豊かさを"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "蓄積防衛型",
                description: "豊かさで守る",
                metaphor: "備蓄で乗り切る"
            },
            stressResponse: {
                whatYouDo: "蓄えを使って対処",
                example: "危機 → 備蓄で解決",
                goodPoint: "余裕がある",
                badPoint: "依存的になる"
            },
            emergencyMode: {
                whatHappens: "全資源を投入",
                example: "持てる全てで対処",
                recovery: "また蓄積から",
                timeToRecover: "収穫サイクル次第"
            },
            howToRecover: {
                bestWay: "新たな豊作",
                example: "次の収穫を待つ",
                environment: "豊かな環境",
                support: "分かち合える仲間"
            }
        },
        
        osBalance: {
            idealBalance: "生産45% : 分配35% : 蓄積20%",
            whenBalanced: "持続的な豊かさを実現",
            whenImbalanced: "枯渇、または過剰",
            tip: "生産→分配→蓄積→また生産"
        }
    },
    
    // ============================================
    // 56. 火山旅 - 旅人型
    // ============================================
    "火山旅": {
        id: 56,
        symbol: "☶☲",
        element: "火山",
        nickname: "旅人",
        emoji: "🎒",
        
        asEngineOS: {
            profile: {
                type: "探索冒険エンジン",
                description: "新しい世界を探し続ける",
                metaphor: "永遠の旅人"
            },
            normalState: {
                whatHappens: "次の目的地を探す",
                example: "『次はどこへ行こう』",
                energyLevel: "🔋🔋🔋 (60%) - 探索モード"
            },
            superMode: {
                when: "新しい世界を発見",
                whatHappens: "冒険心全開",
                example: "未知の領域へ飛び込む",
                energyLevel: "🔋🔋🔋🔋🔋 (95%) - 冒険モード"
            },
            restMode: {
                whatHappens: "一時的な滞在",
                howToRest: "宿での休息",
                note: "また旅立つために"
            },
            maintenance: {
                whatYouNeed: "新しい目的地",
                howToCharge: "旅の感動",
                warning: "根無し草にならない",
                tip: "時には定住も"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "自由交流型",
                description: "どこでも誰とでも",
                metaphor: "世界を渡る自由人"
            },
            howToTalk: {
                style: "開放的で自由な会話",
                example: "『世界は広いよ』",
                goodAt: "新しい視点、柔軟性",
                notGoodAt: "定着、深い関係"
            },
            bestEnvironment: {
                where: "自由な環境",
                example: "旅行業、国際関係、フリーランス",
                withWho: "自由を愛する人々",
                avoid: "束縛的な環境"
            },
            relationshipTips: {
                strength: "新しい風を運ぶ",
                weakness: "定着しない",
                advice: "大切な場所も作ろう"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "逃走流浪型",
                description: "旅立つことで守る",
                metaphor: "問題から旅立つ"
            },
            stressResponse: {
                whatYouDo: "その場を離れる",
                example: "問題 → 旅に出る",
                goodPoint: "新しい視点を得る",
                badPoint: "問題から逃げる"
            },
            emergencyMode: {
                whatHappens: "完全に旅立つ",
                example: "全てを捨てて旅へ",
                recovery: "新天地で再起",
                timeToRecover: "旅の期間次第"
            },
            howToRecover: {
                bestWay: "新しい場所で",
                example: "旅先での出会い",
                environment: "新しい環境",
                support: "旅の仲間"
            }
        },
        
        osBalance: {
            idealBalance: "探索45% : 自由35% : 帰属20%",
            whenBalanced: "世界を広げる存在",
            whenImbalanced: "根無し草、または停滞",
            tip: "旅立つ→発見→帰る→また旅立つ"
        }
    }
};

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HexagramHumanTraitsV3Part7;
}