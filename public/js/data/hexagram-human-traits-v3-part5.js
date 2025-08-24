/**
 * Triple OS 人格システムデータベース v3.0 - Part 5 (33-40卦)
 * 
 * @author Claude Code
 * @date 2025-01-20
 * @version 3.0.0
 */

const HexagramHumanTraitsV3Part5 = {
    // ============================================
    // 33. 天山遯 - 退避者型
    // ============================================
    "天山遯": {
        id: 33,
        symbol: "☶☰",
        element: "天山",
        nickname: "退避者",
        emoji: "🚪",
        
        asEngineOS: {
            profile: {
                type: "戦略的撤退エンジン",
                description: "引き際を見極める賢さ",
                metaphor: "戦略的撤退を選ぶ将軍"
            },
            normalState: {
                whatHappens: "常に退路を確保",
                example: "リスクを察知したら即撤退準備",
                energyLevel: "🔋🔋 (45%) - 警戒モード"
            },
            superMode: {
                when: "危険を察知した時",
                whatHappens: "素早く撤退して身を守る",
                example: "問題が大きくなる前に離脱",
                energyLevel: "🔋🔋🔋🔋 (80%) - 撤退モード"
            },
            restMode: {
                whatHappens: "安全な場所で充電",
                howToRest: "リスクのない環境で休息",
                note: "完全に安心できる場所が必要"
            },
            maintenance: {
                whatYouNeed: "安全な退路と避難所",
                howToCharge: "危機回避の成功体験",
                warning: "逃げ癖がつかないように",
                tip: "撤退も戦略の一つ"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "距離調整型",
                description: "適切な距離を保つタイプ",
                metaphor: "ヤマアラシのジレンマを理解"
            },
            howToTalk: {
                style: "適度な距離感を保つ",
                example: "深入りせず、でも冷たくない",
                goodAt: "リスク回避、境界設定",
                notGoodAt: "深い信頼関係、密着"
            },
            bestEnvironment: {
                where: "独立性が保てる環境",
                example: "リモートワーク、個人事業",
                withWho: "自立した人々",
                avoid: "密着型の組織"
            },
            relationshipTips: {
                strength: "トラブルに巻き込まれない",
                weakness: "深い関係を築きにくい",
                advice: "時には踏み込む勇気も"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "完全撤退型",
                description: "危険から完全に離れる",
                metaphor: "シェルターに避難"
            },
            stressResponse: {
                whatYouDo: "その場から離れる",
                example: "対立 → 『私は関わりません』",
                goodPoint: "無用な争いを避ける",
                badPoint: "責任放棄に見える"
            },
            emergencyMode: {
                whatHappens: "完全に姿を消す",
                example: "連絡を断ち、身を隠す",
                recovery: "安全確認後、徐々に復帰",
                timeToRecover: "2-4週間（安全確認まで）"
            },
            howToRecover: {
                bestWay: "段階的な復帰",
                example: "少しずつ関わりを増やす",
                environment: "リスクの少ない場所",
                support: "安全を保証してくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "撤退40% : 距離35% : 安全25%",
            whenBalanced: "リスクを避けて長く生き残る",
            whenImbalanced: "逃げてばかり、または無謀",
            tip: "観察→判断→撤退→再評価"
        }
    },
    
    // ============================================
    // 34. 雷天大壮 - 豪傑型
    // ============================================
    "雷天大壮": {
        id: 34,
        symbol: "☰☳",
        element: "雷天",
        nickname: "豪傑",
        emoji: "💪",
        
        asEngineOS: {
            profile: {
                type: "パワー全開エンジン",
                description: "圧倒的な力で押し通す",
                metaphor: "止められない暴走機関車"
            },
            normalState: {
                whatHappens: "常にフルパワーで前進",
                example: "障害があっても力で突破",
                energyLevel: "🔋🔋🔋🔋 (80%) - パワーモード"
            },
            superMode: {
                when: "大きな壁に直面した時",
                whatHappens: "限界を超えた力を発揮",
                example: "不可能を可能にする馬力",
                energyLevel: "🔋🔋🔋🔋🔋 (110%) - 超人モード"
            },
            restMode: {
                whatHappens: "力を蓄える",
                howToRest: "筋トレ、エネルギー補給",
                note: "次の爆発に備える"
            },
            maintenance: {
                whatYouNeed: "力を発揮する機会",
                howToCharge: "力で勝利した実感",
                warning: "力任せになりすぎない",
                tip: "力と技のバランスを"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "圧倒型",
                description: "力強さで周りを圧倒",
                metaphor: "カリスマ的な存在感"
            },
            howToTalk: {
                style: "力強く断定的",
                example: "『絶対にやり遂げる！』",
                goodAt: "リーダーシップ、決断",
                notGoodAt: "繊細な配慮、調整"
            },
            bestEnvironment: {
                where: "力が評価される環境",
                example: "スポーツ、営業、起業",
                withWho: "強さを求める人々",
                avoid: "繊細さが必要な環境"
            },
            relationshipTips: {
                strength: "頼れる強さ",
                weakness: "威圧的に感じられる",
                advice: "優しさも強さの一つ"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "力押し突破型",
                description: "力で全てを解決",
                metaphor: "壁を壊して進む"
            },
            stressResponse: {
                whatYouDo: "より強い力で対抗",
                example: "圧力 → より強い圧力で返す",
                goodPoint: "負けない強さ",
                badPoint: "破壊的になる"
            },
            emergencyMode: {
                whatHappens: "全力で戦う",
                example: "最後まで戦い抜く",
                recovery: "勝利で回復",
                timeToRecover: "1週間（勝てば即回復）"
            },
            howToRecover: {
                bestWay: "力を使う機会",
                example: "スポーツ、筋トレ",
                environment: "競争的な環境",
                support: "強さを認めてくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "パワー50% : 突破35% : 制御15%",
            whenBalanced: "圧倒的な推進力で成功",
            whenImbalanced: "暴走、または無力感",
            tip: "力→突破→成果→また力"
        }
    },
    
    // ============================================
    // 35. 火地晋 - 上昇者型
    // ============================================
    "火地晋": {
        id: 35,
        symbol: "☷☲",
        element: "火地",
        nickname: "上昇者",
        emoji: "📈",
        
        asEngineOS: {
            profile: {
                type: "上昇志向エンジン",
                description: "常に上を目指す向上心",
                metaphor: "太陽が昇るような上昇力"
            },
            normalState: {
                whatHappens: "常により高みを目指す",
                example: "今の位置に満足せず上を見る",
                energyLevel: "🔋🔋🔋 (65%) - 上昇モード"
            },
            superMode: {
                when: "昇進や成長の機会",
                whatHappens: "一気に駆け上がる",
                example: "チャンスを掴んで飛躍",
                energyLevel: "🔋🔋🔋🔋🔋 (95%) - 急上昇モード"
            },
            restMode: {
                whatHappens: "次の上昇を準備",
                howToRest: "実力を蓄える時間",
                note: "停滞は後退と感じる"
            },
            maintenance: {
                whatYouNeed: "成長と昇進の機会",
                howToCharge: "上昇の実感",
                warning: "頂点での孤独",
                tip: "上昇と共に器も大きく"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "出世街道型",
                description: "組織の階段を上るタイプ",
                metaphor: "エリートビジネスパーソン"
            },
            howToTalk: {
                style: "上昇志向的な発言",
                example: "『次のステージへ行こう』",
                goodAt: "目標設定、成長促進",
                notGoodAt: "現状満足、停滞受入"
            },
            bestEnvironment: {
                where: "成長機会のある環境",
                example: "大企業、成長企業",
                withWho: "向上心のある人々",
                avoid: "成長の見込みがない環境"
            },
            relationshipTips: {
                strength: "みんなを引き上げる力",
                weakness: "競争心が強すぎる",
                advice: "一緒に上がることも大切"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "地位防衛型",
                description: "獲得した地位を守る",
                metaphor: "城を守る領主"
            },
            stressResponse: {
                whatYouDo: "地位と実績で対抗",
                example: "批判 → 『私の実績を見ろ』",
                goodPoint: "実績という武器",
                badPoint: "過去にこだわる"
            },
            emergencyMode: {
                whatHappens: "地位にしがみつく",
                example: "何としても降格を避ける",
                recovery: "地位回復で安心",
                timeToRecover: "地位次第（即〜長期）"
            },
            howToRecover: {
                bestWay: "新たな昇進機会",
                example: "別の分野での成功",
                environment: "評価される環境",
                support: "実力を認める人"
            }
        },
        
        osBalance: {
            idealBalance: "上昇45% : 実績35% : 維持20%",
            whenBalanced: "着実にキャリアを築く",
            whenImbalanced: "出世至上主義、または諦め",
            tip: "上昇→定着→準備→また上昇"
        }
    },
    
    // ============================================
    // 36. 地火明夷 - 内光型
    // ============================================
    "地火明夷": {
        id: 36,
        symbol: "☲☷",
        element: "地火",
        nickname: "内光者",
        emoji: "🕯️",
        
        asEngineOS: {
            profile: {
                type: "内的光明エンジン",
                description: "暗闇でも内なる光を保つ",
                metaphor: "地下で輝く宝石"
            },
            normalState: {
                whatHappens: "静かに内面を磨く",
                example: "表に出ずとも実力を蓄える",
                energyLevel: "🔋🔋 (50%) - 内燃モード"
            },
            superMode: {
                when: "真の実力が必要な時",
                whatHappens: "隠れた才能が開花",
                example: "いざという時に真価を発揮",
                energyLevel: "🔋🔋🔋🔋 (85%) - 覚醒モード"
            },
            restMode: {
                whatHappens: "完全に内に籠る",
                howToRest: "瞑想、内省、独学",
                note: "外界から離れて充電"
            },
            maintenance: {
                whatYouNeed: "内面を磨く時間",
                howToCharge: "内的成長の実感",
                warning: "表現の機会も必要",
                tip: "内と外のバランスを"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "控えめ実力型",
                description: "目立たないが実力者",
                metaphor: "能ある鷹は爪を隠す"
            },
            howToTalk: {
                style: "控えめだが的確",
                example: "必要な時だけ核心を突く",
                goodAt: "深い洞察、本質理解",
                notGoodAt: "自己アピール、目立つこと"
            },
            bestEnvironment: {
                where: "実力が評価される環境",
                example: "研究職、専門職、職人",
                withWho: "本質を見る人々",
                avoid: "派手さが求められる環境"
            },
            relationshipTips: {
                strength: "隠れた実力と深み",
                weakness: "存在感が薄い",
                advice: "時には光を外に出そう"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "潜伏保護型",
                description: "目立たず身を守る",
                metaphor: "保護色で隠れる"
            },
            stressResponse: {
                whatYouDo: "目立たないよう潜む",
                example: "批判の的にならないよう隠れる",
                goodPoint: "攻撃を避ける",
                badPoint: "チャンスも逃す"
            },
            emergencyMode: {
                whatHappens: "完全に姿を消す",
                example: "存在感を消して嵐をやり過ごす",
                recovery: "安全になったら徐々に",
                timeToRecover: "2-3週間（様子を見ながら）"
            },
            howToRecover: {
                bestWay: "少しずつ表に出る",
                example: "小さな成功から始める",
                environment: "安全で評価的な環境",
                support: "実力を知る理解者"
            }
        },
        
        osBalance: {
            idealBalance: "内光40% : 実力35% : 謙虚25%",
            whenBalanced: "隠れた実力者として活躍",
            whenImbalanced: "埋もれる、または露出過多",
            tip: "磨く→蓄える→発揮→また磨く"
        }
    },
    
    // ============================================
    // 37. 風火家人 - 家族型
    // ============================================
    "風火家人": {
        id: 37,
        symbol: "☲☴",
        element: "風火",
        nickname: "家族人",
        emoji: "👨‍👩‍👧‍👦",
        
        asEngineOS: {
            profile: {
                type: "家族愛エンジン",
                description: "家族や仲間を大切にする",
                metaphor: "家族の絆という燃料"
            },
            normalState: {
                whatHappens: "家族や仲間のために動く",
                example: "『みんなのために』が原動力",
                energyLevel: "🔋🔋🔋 (60%) - 家族モード"
            },
            superMode: {
                when: "家族が危機に直面",
                whatHappens: "家族を守るため全力",
                example: "家族のためなら何でもする",
                energyLevel: "🔋🔋🔋🔋🔋 (100%) - 守護モード"
            },
            restMode: {
                whatHappens: "家族との団らん",
                howToRest: "家族と過ごす時間",
                note: "家族が最高の充電"
            },
            maintenance: {
                whatYouNeed: "家族との絆",
                howToCharge: "家族の笑顔",
                warning: "家族に依存しすぎない",
                tip: "家族も個人も大切に"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "ファミリー型",
                description: "職場も家族のように",
                metaphor: "みんなのお母さん/お父さん"
            },
            howToTalk: {
                style: "温かく家族的",
                example: "『みんな元気？』と気遣う",
                goodAt: "チーム作り、ケア、結束",
                notGoodAt: "ビジネスライク、割り切り"
            },
            bestEnvironment: {
                where: "家族的な雰囲気の環境",
                example: "中小企業、地域密着、福祉",
                withWho: "温かい人間関係を求める人々",
                avoid: "ドライな環境"
            },
            relationshipTips: {
                strength: "深い信頼と絆",
                weakness: "プロ意識に欠ける",
                advice: "公私の区別も時には必要"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "家族依存型",
                description: "家族に守ってもらう",
                metaphor: "家という城に籠る"
            },
            stressResponse: {
                whatYouDo: "家族に相談、頼る",
                example: "困った → 家族会議",
                goodPoint: "支え合いの力",
                badPoint: "自立心が弱い"
            },
            emergencyMode: {
                whatHappens: "家族全員で対処",
                example: "家族総出で問題解決",
                recovery: "家族と共に回復",
                timeToRecover: "1-2週間（家族次第）"
            },
            howToRecover: {
                bestWay: "家族との時間",
                example: "家族旅行、団らん",
                environment: "温かい家庭",
                support: "家族の愛情"
            }
        },
        
        osBalance: {
            idealBalance: "家族愛45% : 結束35% : 自立20%",
            whenBalanced: "温かい人間関係を築く",
            whenImbalanced: "依存的、または孤立",
            tip: "愛する→守る→成長→また愛する"
        }
    },
    
    // ============================================
    // 38. 火澤睽 - 個性派型
    // ============================================
    "火澤睽": {
        id: 38,
        symbol: "☱☲",
        element: "火澤",
        nickname: "個性派",
        emoji: "🦄",
        
        asEngineOS: {
            profile: {
                type: "独自性追求エンジン",
                description: "他人と違うことに価値",
                metaphor: "独自の道を切り開く"
            },
            normalState: {
                whatHappens: "常に独自性を追求",
                example: "『人と同じは嫌』が基本",
                energyLevel: "🔋🔋🔋 (65%) - 個性モード"
            },
            superMode: {
                when: "独自性が評価される時",
                whatHappens: "個性を全開に発揮",
                example: "オンリーワンの存在として輝く",
                energyLevel: "🔋🔋🔋🔋🔋 (95%) - 唯一無二モード"
            },
            restMode: {
                whatHappens: "自分らしさを再確認",
                howToRest: "独自の趣味、創作活動",
                note: "個性を磨く時間"
            },
            maintenance: {
                whatYouNeed: "個性を発揮する場",
                howToCharge: "独自性の評価",
                warning: "孤立しないように",
                tip: "個性と協調のバランス"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "独立独歩型",
                description: "群れない一匹狼",
                metaphor: "独自の世界観を持つアーティスト"
            },
            howToTalk: {
                style: "独特な表現と視点",
                example: "『私の考えでは...』と独自見解",
                goodAt: "創造性、独自提案",
                notGoodAt: "協調、妥協"
            },
            bestEnvironment: {
                where: "個性が活きる環境",
                example: "芸術、デザイン、研究",
                withWho: "個性を尊重する人々",
                avoid: "画一的な環境"
            },
            relationshipTips: {
                strength: "唯一無二の存在感",
                weakness: "協調性に欠ける",
                advice: "違いを認め合うことも"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "孤高防衛型",
                description: "一人で立ち向かう",
                metaphor: "孤高の戦士"
            },
            stressResponse: {
                whatYouDo: "独自の方法で対処",
                example: "誰にも頼らず自力解決",
                goodPoint: "独立心の強さ",
                badPoint: "孤立無援になる"
            },
            emergencyMode: {
                whatHappens: "完全に独立行動",
                example: "一人で全てを背負う",
                recovery: "独自のペースで",
                timeToRecover: "自分次第（不定）"
            },
            howToRecover: {
                bestWay: "独自の方法で回復",
                example: "誰も知らない場所で充電",
                environment: "干渉されない空間",
                support: "距離を保った理解者"
            }
        },
        
        osBalance: {
            idealBalance: "個性50% : 独立30% : 協調20%",
            whenBalanced: "独自の価値を提供",
            whenImbalanced: "孤立、または没個性",
            tip: "個性→表現→認知→また個性"
        }
    },
    
    // ============================================
    // 39. 水山蹇 - 忍耐者型
    // ============================================
    "水山蹇": {
        id: 39,
        symbol: "☶☵",
        element: "水山",
        nickname: "忍耐者",
        emoji: "🗿",
        
        asEngineOS: {
            profile: {
                type: "忍耐持久エンジン",
                description: "どんな困難も耐え抜く",
                metaphor: "岩に穴を開ける水滴"
            },
            normalState: {
                whatHappens: "じっと耐えて機を待つ",
                example: "苦しくても黙って耐える",
                energyLevel: "🔋🔋 (40%) - 忍耐モード"
            },
            superMode: {
                when: "極限の忍耐が必要な時",
                whatHappens: "驚異的な忍耐力を発揮",
                example: "何年でも耐えられる精神力",
                energyLevel: "🔋🔋🔋🔋 (80%) - 極限忍耐"
            },
            restMode: {
                whatHappens: "静かに力を蓄える",
                howToRest: "瞑想、静養",
                note: "動かず待つのも休息"
            },
            maintenance: {
                whatYouNeed: "忍耐の意味と目的",
                howToCharge: "耐えた先の成果",
                warning: "我慢しすぎに注意",
                tip: "忍耐と行動のタイミング"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "辛抱強型",
                description: "どんな人にも辛抱強く",
                metaphor: "聖人のような忍耐"
            },
            howToTalk: {
                style: "ゆっくり、辛抱強く",
                example: "相手のペースに合わせて待つ",
                goodAt: "傾聴、長期的関係",
                notGoodAt: "即決、スピード感"
            },
            bestEnvironment: {
                where: "忍耐が必要な環境",
                example: "介護、教育、長期プロジェクト",
                withWho: "忍耐強い人々",
                avoid: "スピード重視の環境"
            },
            relationshipTips: {
                strength: "どんな人も見捨てない",
                weakness: "進展が遅い",
                advice: "時には決断も必要"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "耐久防衛型",
                description: "ひたすら耐えて守る",
                metaphor: "城壁のような防御"
            },
            stressResponse: {
                whatYouDo: "黙って耐える",
                example: "どんな攻撃も無言で受ける",
                goodPoint: "折れない強さ",
                badPoint: "限界まで我慢する"
            },
            emergencyMode: {
                whatHappens: "石のように動かない",
                example: "嵐が過ぎるまで微動だにしない",
                recovery: "ゆっくりと回復",
                timeToRecover: "1-3ヶ月（長期戦）"
            },
            howToRecover: {
                bestWay: "時間をかけて癒す",
                example: "焦らずゆっくり回復",
                environment: "プレッシャーのない場所",
                support: "待ってくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "忍耐50% : 持久30% : 突破20%",
            whenBalanced: "どんな困難も乗り越える",
            whenImbalanced: "停滞、または諦め",
            tip: "耐える→機を見る→動く→また耐える"
        }
    },
    
    // ============================================
    // 40. 雷水解 - 解放者型
    // ============================================
    "雷水解": {
        id: 40,
        symbol: "☵☳",
        element: "雷水",
        nickname: "解放者",
        emoji: "🔓",
        
        asEngineOS: {
            profile: {
                type: "束縛解放エンジン",
                description: "縛りを解いて自由になる",
                metaphor: "檻から解放された鳥"
            },
            normalState: {
                whatHappens: "制約を見つけて解く",
                example: "ルールや慣習に疑問を持つ",
                energyLevel: "🔋🔋🔋 (60%) - 解放モード"
            },
            superMode: {
                when: "大きな束縛からの解放",
                whatHappens: "全ての鎖を断ち切る",
                example: "しがらみから完全に自由になる",
                energyLevel: "🔋🔋🔋🔋🔋 (95%) - 完全解放"
            },
            restMode: {
                whatHappens: "自由を満喫",
                howToRest: "制約のない時間",
                note: "束縛から離れて充電"
            },
            maintenance: {
                whatYouNeed: "自由と解放感",
                howToCharge: "束縛からの解放",
                warning: "自由すぎて迷子に",
                tip: "自由と責任のバランス"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "自由推進型",
                description: "みんなを自由にする",
                metaphor: "解放の伝道師"
            },
            howToTalk: {
                style: "自由で開放的",
                example: "『もっと自由にやろう』",
                goodAt: "発想の転換、固定観念打破",
                notGoodAt: "ルール遵守、管理"
            },
            bestEnvironment: {
                where: "自由な環境",
                example: "クリエイティブ、フリーランス",
                withWho: "自由を愛する人々",
                avoid: "規則に縛られた環境"
            },
            relationshipTips: {
                strength: "みんなを解放する",
                weakness: "秩序を乱すことも",
                advice: "自由にもルールは必要"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "脱出逃走型",
                description: "束縛から逃げて自由に",
                metaphor: "鎖を断ち切って逃走"
            },
            stressResponse: {
                whatYouDo: "束縛から逃げ出す",
                example: "息苦しい → すぐに脱出",
                goodPoint: "自由を守る",
                badPoint: "責任も放棄する"
            },
            emergencyMode: {
                whatHappens: "全てを捨てて逃げる",
                example: "しがらみを全て断つ",
                recovery: "自由を取り戻して",
                timeToRecover: "1週間（自由になれば）"
            },
            howToRecover: {
                bestWay: "完全な自由",
                example: "誰にも縛られない時間",
                environment: "制約のない空間",
                support: "自由を理解する人"
            }
        },
        
        osBalance: {
            idealBalance: "解放45% : 自由35% : 責任20%",
            whenBalanced: "自由と秩序の調和",
            whenImbalanced: "無秩序、または束縛",
            tip: "解放→自由→創造→また解放"
        }
    }
};

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HexagramHumanTraitsV3Part5;
}