/**
 * Triple OS 人格システムデータベース v3.0 - Part 8 (57-64卦)
 * 
 * @author Claude Code
 * @date 2025-01-20
 * @version 3.0.0
 */

const HexagramHumanTraitsV3Part8 = {
    // ============================================
    // 57. 巽為風 - 浸透者型
    // ============================================
    "巽為風": {
        id: 57,
        symbol: "☴",
        element: "風",
        nickname: "浸透者",
        emoji: "🌬️",
        
        asEngineOS: {
            profile: {
                type: "浸透拡散エンジン",
                description: "じわじわと浸透して広がる",
                metaphor: "風のように隅々まで届く"
            },
            normalState: {
                whatHappens: "静かに影響を広げる",
                example: "気づかないうちに考えを浸透させる",
                energyLevel: "🔋🔋🔋 (55%) - 浸透モード"
            },
            superMode: {
                when: "大きな変化を起こす時",
                whatHappens: "組織全体に影響を与える",
                example: "新しい文化を組織に浸透させる",
                energyLevel: "🔋🔋🔋🔋 (90%) - 拡散モード"
            },
            restMode: {
                whatHappens: "静かに観察",
                howToRest: "流れを読む時間",
                note: "次の浸透先を探す"
            },
            maintenance: {
                whatYouNeed: "浸透できる隙間",
                howToCharge: "影響力の実感",
                warning: "押し付けにならない",
                tip: "自然な流れで浸透させよう"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "影響力型",
                description: "さりげなく影響を与える",
                metaphor: "そよ風のような優しい影響"
            },
            howToTalk: {
                style: "穏やかで説得力のある話し方",
                example: "『こんな考え方もありますよ』",
                goodAt: "説得、影響、浸透",
                notGoodAt: "強制、命令、対立"
            },
            bestEnvironment: {
                where: "柔軟な環境",
                example: "コンサルティング、教育、広報",
                withWho: "開かれた心の人々",
                avoid: "硬直的な環境"
            },
            relationshipTips: {
                strength: "自然に人を動かす",
                weakness: "影が薄いことも",
                advice: "時には存在感も必要"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "回避浸透型",
                description: "風のようにすり抜ける",
                metaphor: "隙間から逃げる風"
            },
            stressResponse: {
                whatYouDo: "柔らかく回避",
                example: "対立 → 風のように流れる",
                goodPoint: "摩擦を避ける",
                badPoint: "直面しない"
            },
            emergencyMode: {
                whatHappens: "完全に拡散",
                example: "形を失って逃げる",
                recovery: "少しずつ集まる",
                timeToRecover: "1-2週間（自然に）"
            },
            howToRecover: {
                bestWay: "自然な流れに任せる",
                example: "風の向きに従う",
                environment: "開放的な空間",
                support: "自由を理解する人"
            }
        },
        
        osBalance: {
            idealBalance: "浸透45% : 影響35% : 柔軟20%",
            whenBalanced: "組織に良い変化をもたらす",
            whenImbalanced: "影響力なし、または押し付け",
            tip: "浸透→影響→定着→また浸透"
        }
    },
    
    // ============================================
    // 58. 兌為澤 - 喜悦者型
    // ============================================
    "兌為澤": {
        id: 58,
        symbol: "☱",
        element: "澤",
        nickname: "喜悦者",
        emoji: "😊",
        
        asEngineOS: {
            profile: {
                type: "喜び生成エンジン",
                description: "喜びと楽しさを生み出す",
                metaphor: "笑顔の泉"
            },
            normalState: {
                whatHappens: "常に楽しいことを探す",
                example: "どんな状況でも楽しみを見つける",
                energyLevel: "🔋🔋🔋🔋 (70%) - ハッピーモード"
            },
            superMode: {
                when: "みんなを喜ばせる時",
                whatHappens: "最高の喜びを提供",
                example: "サプライズで感動を演出",
                energyLevel: "🔋🔋🔋🔋🔋 (100%) - 歓喜モード"
            },
            restMode: {
                whatHappens: "静かな喜びを味わう",
                howToRest: "小さな幸せを感じる",
                note: "充電も楽しく"
            },
            maintenance: {
                whatYouNeed: "笑顔と喜びの共有",
                howToCharge: "人の笑顔",
                warning: "空元気に注意",
                tip: "本物の喜びを大切に"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "ムードメーカー型",
                description: "場を明るくする",
                metaphor: "太陽のような明るさ"
            },
            howToTalk: {
                style: "明るく楽しい会話",
                example: "『楽しいね！』が口癖",
                goodAt: "雰囲気作り、励まし",
                notGoodAt: "深刻な話、批判"
            },
            bestEnvironment: {
                where: "明るい雰囲気の環境",
                example: "サービス業、エンタメ、イベント",
                withWho: "ポジティブな人々",
                avoid: "暗い雰囲気の場所"
            },
            relationshipTips: {
                strength: "みんなを元気にする",
                weakness: "軽く見られることも",
                advice: "真剣さも時には必要"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "笑顔防御型",
                description: "笑顔で辛さを隠す",
                metaphor: "涙を笑顔で隠す"
            },
            stressResponse: {
                whatYouDo: "無理に笑顔を作る",
                example: "辛い → でも笑顔",
                goodPoint: "周りを心配させない",
                badPoint: "本心が伝わらない"
            },
            emergencyMode: {
                whatHappens: "過剰な明るさ",
                example: "異常なハイテンション",
                recovery: "本当の感情を出す",
                timeToRecover: "1週間（素直になれば）"
            },
            howToRecover: {
                bestWay: "本当の気持ちを話す",
                example: "信頼できる人に本音",
                environment: "安心できる場所",
                support: "本心を受け止める人"
            }
        },
        
        osBalance: {
            idealBalance: "喜び50% : 共有35% : 真実15%",
            whenBalanced: "本物の喜びを広げる",
            whenImbalanced: "空虚な笑顔、または暗い",
            tip: "喜ぶ→分かち合う→充電→また喜ぶ"
        }
    },
    
    // ============================================
    // 59. 風水渙 - 拡散者型
    // ============================================
    "風水渙": {
        id: 59,
        symbol: "☵☴",
        element: "風水",
        nickname: "拡散者",
        emoji: "💨",
        
        asEngineOS: {
            profile: {
                type: "拡散分散エンジン",
                description: "固まったものを解きほぐす",
                metaphor: "氷を溶かす春風"
            },
            normalState: {
                whatHappens: "固定観念を溶かす",
                example: "硬い雰囲気を和らげる",
                energyLevel: "🔋🔋🔋 (60%) - 分散モード"
            },
            superMode: {
                when: "大きな停滞を解消する時",
                whatHappens: "全てを流動化させる",
                example: "組織の硬直を打破",
                energyLevel: "🔋🔋🔋🔋 (85%) - 解放モード"
            },
            restMode: {
                whatHappens: "自分も溶ける",
                howToRest: "リラックス、脱力",
                note: "固まらないように"
            },
            maintenance: {
                whatYouNeed: "流動性と柔軟性",
                howToCharge: "解放の実感",
                warning: "散漫になりすぎない",
                tip: "適度な集中も必要"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "緊張緩和型",
                description: "固い雰囲気を和らげる",
                metaphor: "アイスブレイカー"
            },
            howToTalk: {
                style: "柔らかく流れるような話し方",
                example: "『まあまあ、そう固くならずに』",
                goodAt: "緊張緩和、雰囲気作り",
                notGoodAt: "締める、まとめる"
            },
            bestEnvironment: {
                where: "柔軟性が必要な環境",
                example: "ファシリテーション、調整役",
                withWho: "多様な人々",
                avoid: "厳格な環境"
            },
            relationshipTips: {
                strength: "場を和ませる力",
                weakness: "締まりがないと見られる",
                advice: "時にはまとめることも"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "分散逃避型",
                description: "バラバラになって逃げる",
                metaphor: "霧のように消える"
            },
            stressResponse: {
                whatYouDo: "注意を分散させる",
                example: "問題 → 話題を変える",
                goodPoint: "直接対決を避ける",
                badPoint: "問題が解決しない"
            },
            emergencyMode: {
                whatHappens: "完全に拡散",
                example: "存在感を消す",
                recovery: "少しずつ集まる",
                timeToRecover: "2週間（ゆっくり）"
            },
            howToRecover: {
                bestWay: "徐々に集中力を取り戻す",
                example: "小さなことから始める",
                environment: "落ち着いた環境",
                support: "まとめてくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "拡散40% : 緩和35% : 集中25%",
            whenBalanced: "適度な流動性を保つ",
            whenImbalanced: "散漫、または硬直",
            tip: "溶かす→流す→集める→また溶かす"
        }
    },
    
    // ============================================
    // 60. 水澤節 - 節度者型
    // ============================================
    "水澤節": {
        id: 60,
        symbol: "☱☵",
        element: "水澤",
        nickname: "節度者",
        emoji: "⚖️",
        
        asEngineOS: {
            profile: {
                type: "節度調整エンジン",
                description: "適度なバランスを保つ",
                metaphor: "ダムの水量調整"
            },
            normalState: {
                whatHappens: "常に適量を心がける",
                example: "食事も仕事も腹八分目",
                energyLevel: "🔋🔋🔋 (60%) - 節度モード"
            },
            superMode: {
                when: "完璧なバランスが必要な時",
                whatHappens: "絶妙な調整力を発揮",
                example: "資源を最適配分",
                energyLevel: "🔋🔋🔋🔋 (80%) - 調整モード"
            },
            restMode: {
                whatHappens: "エネルギーを節約",
                howToRest: "最小限の活動",
                note: "無駄を省く"
            },
            maintenance: {
                whatYouNeed: "規則正しい生活",
                howToCharge: "節度の美徳",
                warning: "窮屈になりすぎない",
                tip: "時には羽目を外すことも"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "調整役型",
                description: "みんなのバランスを取る",
                metaphor: "優れた調停者"
            },
            howToTalk: {
                style: "バランスの取れた発言",
                example: "『ほどほどが一番』",
                goodAt: "調整、仲裁、バランス",
                notGoodAt: "極端な主張、冒険"
            },
            bestEnvironment: {
                where: "バランスが重要な環境",
                example: "財務、リスク管理、調停",
                withWho: "節度ある人々",
                avoid: "極端な環境"
            },
            relationshipTips: {
                strength: "安定したバランス感覚",
                weakness: "面白みに欠ける",
                advice: "時には思い切りも必要"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "制限防御型",
                description: "制限をかけて守る",
                metaphor: "安全弁のような働き"
            },
            stressResponse: {
                whatYouDo: "活動を制限する",
                example: "負荷 → セーブモード",
                goodPoint: "燃え尽きを防ぐ",
                badPoint: "消極的になる"
            },
            emergencyMode: {
                whatHappens: "最小限モード",
                example: "必要最小限だけ動く",
                recovery: "徐々に活動量を増やす",
                timeToRecover: "2-3週間（段階的に）"
            },
            howToRecover: {
                bestWay: "少しずつ制限を緩める",
                example: "段階的に活動を増やす",
                environment: "安定した環境",
                support: "ペースを理解する人"
            }
        },
        
        osBalance: {
            idealBalance: "節度45% : 調整35% : 柔軟20%",
            whenBalanced: "持続可能な活動を実現",
            whenImbalanced: "窮屈、または無節制",
            tip: "測る→調整→維持→また測る"
        }
    },
    
    // ============================================
    // 61. 風澤中孚 - 信頼者型
    // ============================================
    "風澤中孚": {
        id: 61,
        symbol: "☱☴",
        element: "風澤",
        nickname: "信頼者",
        emoji: "🤝",
        
        asEngineOS: {
            profile: {
                type: "信頼構築エンジン",
                description: "深い信頼関係を築く",
                metaphor: "心と心を繋ぐ橋"
            },
            normalState: {
                whatHappens: "誠実に人と向き合う",
                example: "約束は必ず守る",
                energyLevel: "🔋🔋🔋 (65%) - 信頼モード"
            },
            superMode: {
                when: "信頼が試される時",
                whatHappens: "絶対的な信頼を示す",
                example: "自分を犠牲にしても約束を守る",
                energyLevel: "🔋🔋🔋🔋🔋 (95%) - 誠実モード"
            },
            restMode: {
                whatHappens: "信頼関係を深める",
                howToRest: "大切な人との時間",
                note: "絆を確認する"
            },
            maintenance: {
                whatYouNeed: "信頼できる相手",
                howToCharge: "信頼される喜び",
                warning: "裏切られることもある",
                tip: "でも信じ続けることが大切"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "誠実型",
                description: "嘘のない真っ直ぐな関わり",
                metaphor: "清らかな湖のような心"
            },
            howToTalk: {
                style: "正直で誠実な話し方",
                example: "『本当のことを話します』",
                goodAt: "信頼構築、誠実な対話",
                notGoodAt: "駆け引き、嘘"
            },
            bestEnvironment: {
                where: "信頼が重要な環境",
                example: "カウンセリング、金融、医療",
                withWho: "誠実な人々",
                avoid: "裏切りのある環境"
            },
            relationshipTips: {
                strength: "絶対的な信頼感",
                weakness: "騙されやすい",
                advice: "信じつつも見極める目を"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "信頼依存型",
                description: "信頼できる人に頼る",
                metaphor: "信頼の絆で守られる"
            },
            stressResponse: {
                whatYouDo: "信頼できる人に相談",
                example: "困った → 信頼する人へ",
                goodPoint: "支援を得やすい",
                badPoint: "依存的になる"
            },
            emergencyMode: {
                whatHappens: "信頼の輪に守られる",
                example: "仲間に全てを託す",
                recovery: "信頼関係の中で回復",
                timeToRecover: "1-2週間（信頼があれば）"
            },
            howToRecover: {
                bestWay: "信頼できる人と過ごす",
                example: "心を開いて話す",
                environment: "安心できる場所",
                support: "信頼できる仲間"
            }
        },
        
        osBalance: {
            idealBalance: "信頼50% : 誠実35% : 警戒15%",
            whenBalanced: "深い人間関係を築く",
            whenImbalanced: "騙される、または疑心暗鬼",
            tip: "信じる→確認→深める→また信じる"
        }
    },
    
    // ============================================
    // 62. 雷山小過 - 慎重者型
    // ============================================
    "雷山小過": {
        id: 62,
        symbol: "☶☳",
        element: "雷山",
        nickname: "慎重者",
        emoji: "🔍",
        
        asEngineOS: {
            profile: {
                type: "慎重確認エンジン",
                description: "小さなことも見逃さない",
                metaphor: "顕微鏡のような注意力"
            },
            normalState: {
                whatHappens: "細部まで確認する",
                example: "何度もチェックして完璧を期す",
                energyLevel: "🔋🔋 (50%) - 確認モード"
            },
            superMode: {
                when: "重要な確認が必要な時",
                whatHappens: "完璧な精度で検証",
                example: "ミスを絶対に見逃さない",
                energyLevel: "🔋🔋🔋🔋 (85%) - 精密モード"
            },
            restMode: {
                whatHappens: "チェックリストの整理",
                howToRest: "確認事項の見直し",
                note: "準備を整える"
            },
            maintenance: {
                whatYouNeed: "確認すべき対象",
                howToCharge: "ミスを防いだ実感",
                warning: "神経質になりすぎない",
                tip: "大局も見失わないように"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "確認型",
                description: "念には念を入れるタイプ",
                metaphor: "品質検査官のような目"
            },
            howToTalk: {
                style: "確認を重ねる話し方",
                example: "『念のため確認ですが...』",
                goodAt: "ミス防止、品質管理",
                notGoodAt: "スピード、大胆さ"
            },
            bestEnvironment: {
                where: "精度が求められる環境",
                example: "品質管理、監査、校正",
                withWho: "慎重な人々",
                avoid: "スピード重視の環境"
            },
            relationshipTips: {
                strength: "ミスを防ぐ存在",
                weakness: "心配性に見える",
                advice: "時には思い切りも必要"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "過剰確認型",
                description: "何度も確認して安心する",
                metaphor: "鍵を何度も確認"
            },
            stressResponse: {
                whatYouDo: "確認を繰り返す",
                example: "不安 → 何度もチェック",
                goodPoint: "ミスを防ぐ",
                badPoint: "時間がかかる"
            },
            emergencyMode: {
                whatHappens: "確認地獄",
                example: "何度確認しても不安",
                recovery: "確信を得て安心",
                timeToRecover: "1-2週間（確認が済めば）"
            },
            howToRecover: {
                bestWay: "十分な確認で安心",
                example: "チェックリスト完了",
                environment: "確認できる環境",
                support: "一緒に確認してくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "慎重45% : 確認35% : 行動20%",
            whenBalanced: "ミスのない確実な仕事",
            whenImbalanced: "神経質、または不注意",
            tip: "確認→実行→検証→また確認"
        }
    },
    
    // ============================================
    // 63. 水火既済 - 完成者型
    // ============================================
    "水火既済": {
        id: 63,
        symbol: "☲☵",
        element: "水火",
        nickname: "完成者",
        emoji: "✅",
        
        asEngineOS: {
            profile: {
                type: "完成達成エンジン",
                description: "物事を完璧に仕上げる",
                metaphor: "最後のピースを埋める"
            },
            normalState: {
                whatHappens: "常に完成を目指す",
                example: "中途半端を許さない",
                energyLevel: "🔋🔋🔋 (70%) - 完成モード"
            },
            superMode: {
                when: "大きなプロジェクトの完成時",
                whatHappens: "完璧な仕上がりを実現",
                example: "細部まで完璧に仕上げる",
                energyLevel: "🔋🔋🔋🔋🔋 (100%) - 完璧モード"
            },
            restMode: {
                whatHappens: "完成の満足感に浸る",
                howToRest: "達成感を味わう",
                note: "次の目標を探す"
            },
            maintenance: {
                whatYouNeed: "完成させる対象",
                howToCharge: "完成の達成感",
                warning: "完璧主義の罠",
                tip: "完了も大切"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "仕上げ型",
                description: "最後まできっちり仕上げる",
                metaphor: "フィニッシャー"
            },
            howToTalk: {
                style: "完結を重視する話し方",
                example: "『最後まで仕上げましょう』",
                goodAt: "完成、締結、仕上げ",
                notGoodAt: "中途半端、妥協"
            },
            bestEnvironment: {
                where: "完成が評価される環境",
                example: "プロジェクト管理、製造、建築",
                withWho: "完璧を求める人々",
                avoid: "未完成を許容する環境"
            },
            relationshipTips: {
                strength: "物事を完成させる力",
                weakness: "融通が利かない",
                advice: "過程も大切にしよう"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "完成固執型",
                description: "完成させることに固執",
                metaphor: "未完成が許せない"
            },
            stressResponse: {
                whatYouDo: "何が何でも完成させる",
                example: "障害 → 完成まで諦めない",
                goodPoint: "最後まで諦めない",
                badPoint: "柔軟性を失う"
            },
            emergencyMode: {
                whatHappens: "完成への執念",
                example: "寝食を忘れて完成させる",
                recovery: "完成と共に解放",
                timeToRecover: "完成次第（即〜長期）"
            },
            howToRecover: {
                bestWay: "完成させて満足",
                example: "プロジェクト完了",
                environment: "完成できる環境",
                support: "完成を助ける人"
            }
        },
        
        osBalance: {
            idealBalance: "完成50% : 品質30% : 効率20%",
            whenBalanced: "高品質な成果を生み出す",
            whenImbalanced: "完璧主義、または未完成",
            tip: "計画→実行→完成→次へ"
        }
    },
    
    // ============================================
    // 64. 火水未済 - 未完者型
    // ============================================
    "火水未済": {
        id: 64,
        symbol: "☵☲",
        element: "火水",
        nickname: "未完者",
        emoji: "♾️",
        
        asEngineOS: {
            profile: {
                type: "永続探求エンジン",
                description: "終わりなき探求を続ける",
                metaphor: "永遠の旅人"
            },
            normalState: {
                whatHappens: "常に次を求める",
                example: "ゴールは新たなスタート",
                energyLevel: "🔋🔋🔋 (65%) - 探求モード"
            },
            superMode: {
                when: "新しい可能性を発見した時",
                whatHappens: "更なる高みを目指す",
                example: "限界を超えて進化し続ける",
                energyLevel: "🔋🔋🔋🔋 (90%) - 無限モード"
            },
            restMode: {
                whatHappens: "次の旅の準備",
                howToRest: "可能性を探る",
                note: "休んでも探求は続く"
            },
            maintenance: {
                whatYouNeed: "新しい挑戦と可能性",
                howToCharge: "未知との遭遇",
                warning: "完成を恐れない",
                tip: "過程を楽しもう"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "可能性追求型",
                description: "常に新しい可能性を示す",
                metaphor: "未来を見る予言者"
            },
            howToTalk: {
                style: "可能性を語る話し方",
                example: "『まだこんな可能性が！』",
                goodAt: "ビジョン、革新、発展",
                notGoodAt: "完結、確定、固定"
            },
            bestEnvironment: {
                where: "革新的な環境",
                example: "研究開発、イノベーション、スタートアップ",
                withWho: "挑戦的な人々",
                avoid: "完成を求める環境"
            },
            relationshipTips: {
                strength: "無限の可能性を見せる",
                weakness: "落ち着かない",
                advice: "時には立ち止まることも"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "永続逃避型",
                description: "終わらないことで逃げる",
                metaphor: "永遠に未完成"
            },
            stressResponse: {
                whatYouDo: "新しいことを始める",
                example: "問題 → 別の可能性へ",
                goodPoint: "柔軟な対応",
                badPoint: "何も完成しない"
            },
            emergencyMode: {
                whatHappens: "全てを未完にする",
                example: "完成を避けて逃げる",
                recovery: "新しいスタート",
                timeToRecover: "常に進行中"
            },
            howToRecover: {
                bestWay: "新しい挑戦を始める",
                example: "次のプロジェクトへ",
                environment: "変化のある環境",
                support: "可能性を信じる人"
            }
        },
        
        osBalance: {
            idealBalance: "探求45% : 革新35% : 継続20%",
            whenBalanced: "永続的な成長と進化",
            whenImbalanced: "未完成の山、または停滞",
            tip: "探求→発見→次へ→永遠に"
        }
    }
};

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HexagramHumanTraitsV3Part8;
}