/**
 * Triple OS 人格システムデータベース v3.0 - Part 2 (9-16卦)
 * 
 * @author Claude Code
 * @date 2025-01-20
 * @version 3.0.0
 */

const HexagramHumanTraitsV3Part2 = {
    // ============================================
    // 9. 風天小畜 - 蓄積者型
    // ============================================
    "風天小畜": {
        id: 9,
        symbol: "☴☰",
        element: "風天",
        nickname: "蓄積者",
        emoji: "💰",
        
        asEngineOS: {
            profile: {
                type: "資源蓄積エンジン",
                description: "コツコツと力を蓄える堅実さ",
                metaphor: "貯金箱に少しずつ貯めるような着実さ"
            },
            normalState: {
                whatHappens: "小さな改善と蓄積を続ける",
                example: "毎日少しずつスキルアップ、知識を増やす",
                energyLevel: "🔋🔋 (45%) - 省エネで継続的"
            },
            superMode: {
                when: "蓄積した力を発揮する時が来た時",
                whatHappens: "今まで貯めた力を一気に解放",
                example: "長年の準備が実を結ぶ瞬間",
                energyLevel: "🔋🔋🔋🔋 (80%) - 蓄積パワー解放"
            },
            restMode: {
                whatHappens: "次の蓄積サイクルの準備",
                howToRest: "計画の見直し、目標の再設定",
                note: "完全に止まることはない"
            },
            maintenance: {
                whatYouNeed: "着実な進歩の実感",
                howToCharge: "小さな成功の積み重ね",
                warning: "急激な変化は苦手",
                tip: "焦らずコツコツが最強"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "堅実サポート型",
                description: "着実に支える信頼できる存在",
                metaphor: "銀行の窓口のような確実さ"
            },
            howToTalk: {
                style: "慎重で確実な約束",
                example: "『できることから確実に』と伝える",
                goodAt: "信頼構築、長期的関係",
                notGoodAt: "即興、大胆な提案"
            },
            bestEnvironment: {
                where: "安定と継続が評価される環境",
                example: "経理、品質管理、資産管理",
                withWho: "堅実さを評価する人々",
                avoid: "ハイリスクな環境"
            },
            relationshipTips: {
                strength: "絶対的な信頼性",
                weakness: "慎重すぎて機会を逃す",
                advice: "時にはリスクも必要"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "備蓄防御型",
                description: "準備した資源で乗り切る",
                metaphor: "防災グッズで災害に備えるような用心深さ"
            },
            stressResponse: {
                whatYouDo: "蓄えた資源と経験で対処",
                example: "危機 → 『こういう時のために準備してた』",
                goodPoint: "準備の良さ、想定内の対処",
                badPoint: "想定外に弱い"
            },
            emergencyMode: {
                whatHappens: "守りを固めて耐える",
                example: "嵐が過ぎるまでじっと待つ",
                recovery: "少しずつ立て直す",
                timeToRecover: "2-3週間（着実に回復）"
            },
            howToRecover: {
                bestWay: "小さな成功を積み重ねる",
                example: "できることから一つずつ",
                environment: "安定した環境",
                support: "長期的な視点を持つ人"
            }
        },
        
        osBalance: {
            idealBalance: "蓄積40% : 信頼35% : 備え25%",
            whenBalanced: "着実な成長と安定をもたらす存在",
            whenImbalanced: "過度な慎重さ、または準備不足",
            tip: "蓄える→活用→また蓄える のサイクル"
        }
    },
    
    // ============================================
    // 10. 天澤履 - 実践者型
    // ============================================
    "天澤履": {
        id: 10,
        symbol: "☱☰",
        element: "天澤",
        nickname: "実践者",
        emoji: "👟",
        
        asEngineOS: {
            profile: {
                type: "行動実践エンジン",
                description: "考えるより先に動く行動力",
                metaphor: "スポーツ選手のような瞬発力"
            },
            normalState: {
                whatHappens: "とりあえずやってみる精神",
                example: "『まず試してから考えよう』",
                energyLevel: "🔋🔋🔋 (65%) - アクティブモード"
            },
            superMode: {
                when: "即座の行動が求められる時",
                whatHappens: "考える前に体が動く",
                example: "緊急事態で真っ先に動く",
                energyLevel: "🔋🔋🔋🔋🔋 (95%) - 即行動モード"
            },
            restMode: {
                whatHappens: "次の行動の準備運動",
                howToRest: "軽い運動、ストレッチ",
                note: "完全に止まれない体質"
            },
            maintenance: {
                whatYouNeed: "行動する機会と自由",
                howToCharge: "体を動かすこと",
                warning: "じっとしていると調子が悪くなる",
                tip: "動きながら考えるスタイルでOK"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "率先垂範型",
                description: "自ら動いて見本を示すタイプ",
                metaphor: "現場リーダーのような実践力"
            },
            howToTalk: {
                style: "行動で示すコミュニケーション",
                example: "『こうやるんだよ』と実演",
                goodAt: "実践指導、現場対応",
                notGoodAt: "理論説明、長い会議"
            },
            bestEnvironment: {
                where: "行動が評価される環境",
                example: "現場仕事、スポーツ、実践的な職場",
                withWho: "行動派の仲間",
                avoid: "理論重視の環境"
            },
            relationshipTips: {
                strength: "説得力のある行動力",
                weakness: "考えなしに見られることも",
                advice: "時には立ち止まって考えよう"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "突破行動型",
                description: "動いて打開する",
                metaphor: "壁を走って乗り越えるような勢い"
            },
            stressResponse: {
                whatYouDo: "とにかく動いて解決",
                example: "問題発生 → 『動けば何か変わる』",
                goodPoint: "停滞を打破する力",
                badPoint: "時に無駄な動きも"
            },
            emergencyMode: {
                whatHappens: "全力で動き回る",
                example: "じっとしていられず行動",
                recovery: "動きながら回復",
                timeToRecover: "1-3日（動いていれば回復）"
            },
            howToRecover: {
                bestWay: "アクティブな活動",
                example: "スポーツ、アウトドア",
                environment: "動ける環境",
                support: "一緒に動いてくれる仲間"
            }
        },
        
        osBalance: {
            idealBalance: "行動50% : 実践35% : 突破15%",
            whenBalanced: "チームの推進力として活躍",
            whenImbalanced: "無計画な行動、または停滞",
            tip: "動く→振り返る→また動く のリズム"
        }
    },
    
    // ============================================
    // 11. 地天泰 - 調整者型
    // ============================================
    "地天泰": {
        id: 11,
        symbol: "☰☷",
        element: "地天",
        nickname: "調整者",
        emoji: "⚖️",
        
        asEngineOS: {
            profile: {
                type: "バランス調整エンジン",
                description: "全体の調和とバランスを保つ",
                metaphor: "天秤のような絶妙なバランス感覚"
            },
            normalState: {
                whatHappens: "常に全体のバランスを意識",
                example: "仕事とプライベート、理想と現実のバランス",
                energyLevel: "🔋🔋🔋 (60%) - 安定稼働"
            },
            superMode: {
                when: "バランスが崩れそうな時",
                whatHappens: "絶妙な調整で均衡を保つ",
                example: "対立する意見を見事に調和させる",
                energyLevel: "🔋🔋🔋🔋 (85%) - 調整モード全開"
            },
            restMode: {
                whatHappens: "自分自身のバランスを整える",
                howToRest: "瞑想、ヨガ、リラクゼーション",
                note: "内なる平和が大切"
            },
            maintenance: {
                whatYouNeed: "調和的な環境",
                howToCharge: "バランスの取れた生活",
                warning: "極端な状況は苦手",
                tip: "完璧なバランスを求めすぎない"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "中庸調停型",
                description: "極端を避け、中道を行くタイプ",
                metaphor: "優れた調停人のような公平さ"
            },
            howToTalk: {
                style: "バランスの取れた公平な発言",
                example: "『両方の意見に一理ある』",
                goodAt: "調停、バランス調整、合意形成",
                notGoodAt: "極端な決断、一方的な支持"
            },
            bestEnvironment: {
                where: "調和と協調が重視される環境",
                example: "人事、調停、コーディネーター",
                withWho: "バランス感覚のある人々",
                avoid: "極端な競争環境"
            },
            relationshipTips: {
                strength: "公平で信頼される存在",
                weakness: "優柔不断に見られることも",
                advice: "時には明確な立場も必要"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "均衡維持型",
                description: "バランスを保って安定",
                metaphor: "綱渡りのようなバランス感覚"
            },
            stressResponse: {
                whatYouDo: "冷静にバランスを取り戻す",
                example: "混乱 → 優先順位をつけて調整",
                goodPoint: "パニックにならない冷静さ",
                badPoint: "決断が遅れることも"
            },
            emergencyMode: {
                whatHappens: "中立を保ちながら対処",
                example: "どちらにも偏らず冷静に",
                recovery: "バランスが戻れば回復",
                timeToRecover: "1週間（調和が戻れば）"
            },
            howToRecover: {
                bestWay: "生活リズムを整える",
                example: "規則正しい生活、バランスの良い食事",
                environment: "穏やかで安定した環境",
                support: "バランス感覚のある相談相手"
            }
        },
        
        osBalance: {
            idealBalance: "調和40% : 調停30% : 安定30%",
            whenBalanced: "組織の安定装置として機能",
            whenImbalanced: "優柔不断、または極端に走る",
            tip: "調整→実行→評価→再調整 のサイクル"
        }
    },
    
    // ============================================
    // 12. 天地否 - 変革者型
    // ============================================
    "天地否": {
        id: 12,
        symbol: "☷☰",
        element: "天地",
        nickname: "変革者",
        emoji: "🔄",
        
        asEngineOS: {
            profile: {
                type: "変革推進エンジン",
                description: "停滞を打破し、変化を起こす",
                metaphor: "革命家のような変革への情熱"
            },
            normalState: {
                whatHappens: "現状の問題点を見つけ出す",
                example: "『これじゃダメだ、変えなきゃ』",
                energyLevel: "🔋🔋🔋 (70%) - 変革センサー作動"
            },
            superMode: {
                when: "大きな変革が必要な時",
                whatHappens: "既存の枠組みを壊して再構築",
                example: "組織改革、システム刷新を主導",
                energyLevel: "🔋🔋🔋🔋🔋 (100%) - 革命モード"
            },
            restMode: {
                whatHappens: "次の変革の種を探す",
                howToRest: "他の成功事例を研究",
                note: "現状維持では満足できない"
            },
            maintenance: {
                whatYouNeed: "変化を起こせる環境",
                howToCharge: "改革の成功体験",
                warning: "安定が続くと退屈する",
                tip: "小さな変化から始めよう"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "改革提案型",
                description: "変化の必要性を訴えるタイプ",
                metaphor: "改革派のリーダーのような存在"
            },
            howToTalk: {
                style: "現状への問題提起と改善提案",
                example: "『このままじゃいけない、変えよう』",
                goodAt: "問題提起、改革案の提示",
                notGoodAt: "現状維持、妥協"
            },
            bestEnvironment: {
                where: "変革が求められる環境",
                example: "経営改革、イノベーション部門",
                withWho: "変化を恐れない人々",
                avoid: "保守的な環境"
            },
            relationshipTips: {
                strength: "変化を起こす推進力",
                weakness: "批判的に見られがち",
                advice: "良い部分も認めることが大切"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "破壊再生型",
                description: "一度壊してから立て直す",
                metaphor: "スクラップ&ビルドのような大胆さ"
            },
            stressResponse: {
                whatYouDo: "根本から変えて解決",
                example: "うまくいかない → 全部やり直し",
                goodPoint: "根本的な解決力",
                badPoint: "時に破壊的すぎる"
            },
            emergencyMode: {
                whatHappens: "既存の枠組みを壊す",
                example: "ルールを破ってでも解決",
                recovery: "新しいシステムの構築と共に",
                timeToRecover: "2-4週間（再構築が必要）"
            },
            howToRecover: {
                bestWay: "新しいことへの挑戦",
                example: "環境を変える、新しい方法を試す",
                environment: "変化を許容する環境",
                support: "革新的な考えを持つ仲間"
            }
        },
        
        osBalance: {
            idealBalance: "変革50% : 提案30% : 破壊再生20%",
            whenBalanced: "組織に必要な変化をもたらす",
            whenImbalanced: "破壊的すぎる、または停滞",
            tip: "壊す→作る→改善 のサイクル"
        }
    },
    
    // ============================================
    // 13. 天火同人 - 共感者型
    // ============================================
    "天火同人": {
        id: 13,
        symbol: "☲☰",
        element: "天火",
        nickname: "共感者",
        emoji: "❤️",
        
        asEngineOS: {
            profile: {
                type: "共感共鳴エンジン",
                description: "人の気持ちを理解し、共感する",
                metaphor: "心のチューナーのような感受性"
            },
            normalState: {
                whatHappens: "周りの感情を敏感にキャッチ",
                example: "誰かの悲しみや喜びを自分のことのように感じる",
                energyLevel: "🔋🔋 (55%) - 感情センサー稼働"
            },
            superMode: {
                when: "誰かが本当に助けを必要としている時",
                whatHappens: "全身全霊で寄り添い支える",
                example: "友人の危機に完全に寄り添う",
                energyLevel: "🔋🔋🔋🔋 (90%) - 共感モード全開"
            },
            restMode: {
                whatHappens: "感情のデトックス",
                howToRest: "一人の時間、感情の整理",
                note: "他人の感情から離れる時間が必要"
            },
            maintenance: {
                whatYouNeed: "心の通じ合い、深い理解",
                howToCharge: "誰かと心が通じた瞬間",
                warning: "感情的に疲れやすい",
                tip: "自分の感情も大切にしよう"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "感情理解型",
                description: "相手の気持ちに寄り添うタイプ",
                metaphor: "心理カウンセラーのような共感力"
            },
            howToTalk: {
                style: "感情に寄り添う温かい会話",
                example: "『その気持ち、よくわかるよ』",
                goodAt: "感情的サポート、傾聴、癒し",
                notGoodAt: "論理的議論、批判"
            },
            bestEnvironment: {
                where: "人の心に関わる環境",
                example: "カウンセリング、福祉、医療",
                withWho: "感情を大切にする人々",
                avoid: "感情を軽視する環境"
            },
            relationshipTips: {
                strength: "深い信頼関係を築ける",
                weakness: "感情移入しすぎる",
                advice: "適度な距離感も必要"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "感情包容型",
                description: "感情で包み込んで守る",
                metaphor: "温かい毛布のような包容力"
            },
            stressResponse: {
                whatYouDo: "感情を受け止めて処理",
                example: "辛い → 泣いて、話して、浄化",
                goodPoint: "感情的な浄化力",
                badPoint: "感情に振り回されることも"
            },
            emergencyMode: {
                whatHappens: "感情的なサポートを求める",
                example: "誰かに話を聞いてもらう",
                recovery: "感情の共有で回復",
                timeToRecover: "3-7日（感情が落ち着けば）"
            },
            howToRecover: {
                bestWay: "信頼できる人との対話",
                example: "親友と心を開いて話す",
                environment: "安心できる人間関係",
                support: "共感してくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "共感45% : 理解35% : 包容20%",
            whenBalanced: "人の心を癒す存在として活躍",
            whenImbalanced: "感情的疲労、または冷淡",
            tip: "感じる→理解→癒す→充電 のサイクル"
        }
    },
    
    // ============================================
    // 14. 火天大有 - 統合者型
    // ============================================
    "火天大有": {
        id: 14,
        symbol: "☰☲",
        element: "火天",
        nickname: "統合者",
        emoji: "🎯",
        
        asEngineOS: {
            profile: {
                type: "統合実現エンジン",
                description: "バラバラなものを一つにまとめる",
                metaphor: "オーケストラ指揮者のような統合力"
            },
            normalState: {
                whatHappens: "全体像を把握し、統合点を探る",
                example: "異なる意見から共通点を見出す",
                energyLevel: "🔋🔋🔋 (65%) - 統合モード"
            },
            superMode: {
                when: "大きなプロジェクトをまとめる時",
                whatHappens: "すべてを統合して大きな成果に",
                example: "複数部署を巻き込んだプロジェクト成功",
                energyLevel: "🔋🔋🔋🔋🔋 (95%) - 統合力全開"
            },
            restMode: {
                whatHappens: "次の統合機会を探る",
                howToRest: "全体像を俯瞰する時間",
                note: "部分より全体を見る"
            },
            maintenance: {
                whatYouNeed: "大きな視野と統合の機会",
                howToCharge: "バラバラなものが一つになる瞬間",
                warning: "細部にこだわりすぎない",
                tip: "大局観を持ち続けよう"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "包括リーダー型",
                description: "全員を巻き込むリーダーシップ",
                metaphor: "みんなをまとめる学級委員長タイプ"
            },
            howToTalk: {
                style: "包括的で前向きなメッセージ",
                example: "『みんなで力を合わせれば』",
                goodAt: "チーム統合、ビジョン共有",
                notGoodAt: "個別対応、細かい調整"
            },
            bestEnvironment: {
                where: "大規模プロジェクトの環境",
                example: "プロジェクトマネジメント、統括部門",
                withWho: "協力的なチームメンバー",
                avoid: "個人プレー中心の環境"
            },
            relationshipTips: {
                strength: "みんなをまとめる力",
                weakness: "個人のニーズを見落とす",
                advice: "個々の声にも耳を傾けよう"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "全体最適型",
                description: "全体の利益を優先して守る",
                metaphor: "船長のような全体責任感"
            },
            stressResponse: {
                whatYouDo: "全体最適の視点で解決",
                example: "個人の問題 → チーム全体で解決",
                goodPoint: "大局的な解決力",
                badPoint: "個人の痛みを軽視することも"
            },
            emergencyMode: {
                whatHappens: "全員で乗り切る体制構築",
                example: "危機 → 全員結束して対処",
                recovery: "チーム全体の回復と共に",
                timeToRecover: "1-2週間（チームが安定すれば）"
            },
            howToRecover: {
                bestWay: "チーム全体での振り返り",
                example: "全員で成功を祝う、反省会",
                environment: "協力的なチーム環境",
                support: "信頼できるチームメンバー"
            }
        },
        
        osBalance: {
            idealBalance: "統合45% : リーダーシップ35% : 全体最適20%",
            whenBalanced: "大きな成果を生み出すリーダー",
            whenImbalanced: "抱え込みすぎ、または放任",
            tip: "統合→実行→成果→次の統合 のサイクル"
        }
    },
    
    // ============================================
    // 15. 地山謙 - 謙虚者型
    // ============================================
    "地山謙": {
        id: 15,
        symbol: "☶☷",
        element: "地山",
        nickname: "謙虚者",
        emoji: "🙏",
        
        asEngineOS: {
            profile: {
                type: "謙虚成長エンジン",
                description: "謙虚に学び、着実に成長",
                metaphor: "職人のような謙虚な向上心"
            },
            normalState: {
                whatHappens: "常に学ぶ姿勢を持つ",
                example: "『まだまだ学ぶことがある』",
                energyLevel: "🔋🔋 (50%) - 学習モード"
            },
            superMode: {
                when: "真摯に取り組むべき課題に直面",
                whatHappens: "謙虚に全力で取り組む",
                example: "師匠から技を学ぶような真剣さ",
                energyLevel: "🔋🔋🔋🔋 (80%) - 真摯モード"
            },
            restMode: {
                whatHappens: "静かに内省と振り返り",
                howToRest: "瞑想、日記、自己対話",
                note: "派手さより内面の充実"
            },
            maintenance: {
                whatYouNeed: "学びの機会、成長の実感",
                howToCharge: "新しい学びと気づき",
                warning: "自信不足に陥りやすい",
                tip: "謙虚さと自信のバランスを"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "控えめサポート型",
                description: "一歩引いて支えるタイプ",
                metaphor: "縁の下の力持ち的存在"
            },
            howToTalk: {
                style: "控えめで丁寧な話し方",
                example: "『私なんかの意見ですが...』",
                goodAt: "聞き役、サポート、調整",
                notGoodAt: "自己主張、リーダーシップ"
            },
            bestEnvironment: {
                where: "協調性が重視される環境",
                example: "サポート業務、秘書、補佐役",
                withWho: "お互いを尊重する人々",
                avoid: "自己主張が必要な環境"
            },
            relationshipTips: {
                strength: "誰からも好かれる人柄",
                weakness: "存在感が薄くなりがち",
                advice: "自分の価値を認めることも大切"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "低姿勢回避型",
                description: "謙虚さで衝突を避ける",
                metaphor: "柳のようにしなやかに受け流す"
            },
            stressResponse: {
                whatYouDo: "一歩引いて様子を見る",
                example: "対立 → 『私が引けば済む』",
                goodPoint: "衝突を避ける柔軟性",
                badPoint: "自己犠牲になりやすい"
            },
            emergencyMode: {
                whatHappens: "ひたすら耐える",
                example: "嵐が過ぎるのを静かに待つ",
                recovery: "ゆっくりと自信を取り戻す",
                timeToRecover: "2-3週間（徐々に回復）"
            },
            howToRecover: {
                bestWay: "小さな成功体験を積む",
                example: "できることから少しずつ",
                environment: "プレッシャーのない環境",
                support: "認めて励ましてくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "謙虚40% : サポート35% : 柔軟性25%",
            whenBalanced: "信頼される裏方として活躍",
            whenImbalanced: "自信喪失、または傲慢",
            tip: "学ぶ→実践→振り返る→また学ぶ"
        }
    },
    
    // ============================================
    // 16. 雷地豫 - 楽観者型
    // ============================================
    "雷地豫": {
        id: 16,
        symbol: "☷☳",
        element: "雷地",
        nickname: "楽観者",
        emoji: "😊",
        
        asEngineOS: {
            profile: {
                type: "楽観推進エンジン",
                description: "前向きなエネルギーで進む",
                metaphor: "太陽のような明るさで周りを照らす"
            },
            normalState: {
                whatHappens: "常にポジティブな面を見る",
                example: "『きっとうまくいく』が口癖",
                energyLevel: "🔋🔋🔋 (60%) - ポジティブモード"
            },
            superMode: {
                when: "みんなが落ち込んでいる時",
                whatHappens: "圧倒的な明るさで場を変える",
                example: "失敗後も『次があるさ！』と励ます",
                energyLevel: "🔋🔋🔋🔋 (85%) - 太陽モード"
            },
            restMode: {
                whatHappens: "楽しいことを考える",
                howToRest: "趣味、娯楽、楽しい妄想",
                note: "ネガティブから離れる"
            },
            maintenance: {
                whatYouNeed: "楽しさと希望",
                howToCharge: "楽しいイベント、明るい未来",
                warning: "現実を見落とすことも",
                tip: "楽観と現実のバランスを"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "ポジティブ伝播型",
                description: "明るさを周りに広げるタイプ",
                metaphor: "チアリーダーのような存在"
            },
            howToTalk: {
                style: "明るく前向きな励まし",
                example: "『大丈夫、なんとかなる！』",
                goodAt: "励まし、モチベーション向上",
                notGoodAt: "深刻な相談、リスク分析"
            },
            bestEnvironment: {
                where: "明るさが求められる環境",
                example: "接客、営業、エンタメ",
                withWho: "前向きな人々",
                avoid: "ネガティブな環境"
            },
            relationshipTips: {
                strength: "場を明るくする力",
                weakness: "軽く見られることも",
                advice: "時には真剣な面も見せよう"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "楽観逃避型",
                description: "楽観的に考えて乗り切る",
                metaphor: "『なんとかなる』精神"
            },
            stressResponse: {
                whatYouDo: "ポジティブに解釈し直す",
                example: "失敗 → 『いい経験になった』",
                goodPoint: "立ち直りの早さ",
                badPoint: "問題を軽視することも"
            },
            emergencyMode: {
                whatHappens: "とりあえず笑ってみる",
                example: "ピンチでも『なんとかなる』",
                recovery: "楽しいことで気分転換",
                timeToRecover: "1-3日（楽しければすぐ回復）"
            },
            howToRecover: {
                bestWay: "楽しい活動に没頭",
                example: "趣味、遊び、パーティー",
                environment: "楽しい雰囲気の場所",
                support: "一緒に楽しんでくれる仲間"
            }
        },
        
        osBalance: {
            idealBalance: "楽観45% : 明るさ35% : 前向き20%",
            whenBalanced: "チームの太陽として輝く",
            whenImbalanced: "現実逃避、またはネガティブ",
            tip: "楽観→行動→結果→また楽観 のサイクル"
        }
    }
};

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HexagramHumanTraitsV3Part2;
}