/**
 * Triple OS 人格システムデータベース v3.0 - Part 1 (1-8卦)
 * 
 * 🎮 ゲームのキャラクターみたいに、あなたには3つのモードがある！
 * 
 * 1️⃣ Engine OS（エンジン）= あなたの心のエンジン
 *    → 何があなたを動かすのか？情熱の源は？
 * 
 * 2️⃣ Interface OS（インターフェース）= 人との接し方モード
 *    → どうやって周りの人とつながる？
 * 
 * 3️⃣ SafeMode OS（セーフモード）= ピンチの時の守り方
 *    → ストレスやプレッシャーをどう乗り越える？
 * 
 * @author Claude Code
 * @date 2025-01-20
 * @version 3.0.0
 */

const HexagramHumanTraitsV3Part1 = {
    // ============================================
    // 1. 乾為天 - イノベーター型
    // ============================================
    "乾為天": {
        id: 1,
        symbol: "☰",
        element: "天",
        nickname: "イノベーター",
        emoji: "🚀",
        
        // 🔥 心のエンジンとして動く時
        asEngineOS: {
            profile: {
                type: "革新追求エンジン",
                description: "常に『もっと良い方法はないか？』を追い求める",
                metaphor: "新しい技術やサービスを発見した時のような興奮で動く"
            },
            normalState: {
                whatHappens: "頭の中で常に新しいアイデアや改善案が生まれている",
                example: "会議中も『この仕組み、根本から変えられないか』と考える",
                energyLevel: "🔋🔋🔋 (70%) - 常時アイデア生成中"
            },
            superMode: {
                when: "困難な課題や、誰もが『不可能』と言う状況に直面した時",
                whatHappens: "全リソースを創造的解決に投入！ブレイクスルーモード",
                example: "予算削減でも品質向上を求められた時、全く新しいアプローチを生み出す",
                energyLevel: "🔋🔋🔋🔋🔋 (100%) - フルパワー稼働"
            },
            restMode: {
                whatHappens: "次のイノベーション機会を探索中",
                howToRest: "最新技術の記事を読む、新しいサービスを試す",
                note: "完全に休むことは苦手。何か考えていないと落ち着かない"
            },
            maintenance: {
                whatYouNeed: "新しい挑戦、未踏領域への進出機会",
                howToCharge: "新規プロジェクトの立ち上げ、未知の分野への挑戦",
                warning: "ルーティンワークが続くとパフォーマンス低下",
                tip: "定期的に新しいチャレンジを設定しよう"
            }
        },
        
        // 🌐 人と接する時のモード
        asInterfaceOS: {
            profile: {
                type: "ビジョナリーリーダー型",
                description: "『こちらに向かおう』と明確な方向性を示すタイプ",
                metaphor: "スタートアップのCEOのようなリーダーシップスタイル"
            },
            howToTalk: {
                style: "ストレートかつビジョナリー",
                example: "『これをやるべき理由は○○、目指すゴールは△△』と明確に伝える",
                goodAt: "ビジョンの共有、モチベーション向上、方向性の提示",
                notGoodAt: "細かい調整、全員のペースに合わせること"
            },
            bestEnvironment: {
                where: "革新と変化を重視する環境",
                example: "新規事業開発、R&D部門、起業、改革プロジェクト",
                withWho: "変化を恐れず、共に挑戦してくれる仲間",
                avoid: "官僚的で変化を嫌う組織"
            },
            relationshipTips: {
                strength: "人々を新しい未来へ導く力",
                weakness: "時に周囲を置き去りにしてしまう",
                advice: "定期的に立ち止まり、チームの声に耳を傾けよう"
            }
        },
        
        // 🛡️ ピンチの時の守り方
        asSafeModeOS: {
            profile: {
                type: "前進突破型",
                description: "困難に直面したら、より大胆に前進する",
                metaphor: "将棋で守りより攻めを選ぶような戦略"
            },
            stressResponse: {
                whatYouDo: "新しい突破口を見つけて状況を打開",
                example: "プロジェクトが停滞 → 全く新しいアプローチを開発",
                goodPoint: "前向きな問題解決、イノベーションの創出",
                badPoint: "時に問題の本質から目を逸らしてしまう"
            },
            emergencyMode: {
                whatHappens: "独力で全てを解決しようとする",
                example: "チームが機能不全 → 『自分が全部やる』モード",
                recovery: "新プロジェクトの立ち上げで気分一新",
                timeToRecover: "2-3日（新しい目標を見つければ即回復）"
            },
            howToRecover: {
                bestWay: "全く新しい分野への挑戦",
                example: "仕事で挫折 → 別業界の勉強会に参加",
                environment: "自由度の高い環境、制約の少ない状況",
                support: "可能性を信じてくれる人、新しい視点をくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "革新60% : リーダーシップ25% : 前進力15%",
            whenBalanced: "革新的リーダーとして組織や社会に変革をもたらす",
            whenImbalanced: "アイデア倒れ、または独善的になるリスク",
            tip: "構想→実行→共有→フィードバック のサイクルを回そう"
        }
    },
    
    // ============================================
    // 2. 坤為地 - サポーター型
    // ============================================
    "坤為地": {
        id: 2,
        symbol: "☷",
        element: "地",
        nickname: "サポーター",
        emoji: "🌱",
        
        // 🔥 心のエンジンとして動く時
        asEngineOS: {
            profile: {
                type: "育成支援エンジン",
                description: "他者の成長と組織の調和を原動力とする",
                metaphor: "植物を育てる庭師のような、じっくりと成果を育む姿勢"
            },
            normalState: {
                whatHappens: "周囲の状況を観察し、必要なサポートを察知",
                example: "会議で発言しづらそうな人に気づき、発言機会を作る",
                energyLevel: "🔋🔋 (50%) - 省エネで持続的"
            },
            superMode: {
                when: "チームが危機に直面、関係性が崩れそうな時",
                whatHappens: "全力でチームを支え、調和を取り戻す",
                example: "プロジェクトメンバー間の対立を調整し、チームを再結束",
                energyLevel: "🔋🔋🔋🔋 (90%) - 献身的サポートモード"
            },
            restMode: {
                whatHappens: "静かに充電、自己回復の時間",
                howToRest: "瞑想、読書、自然の中での散歩",
                note: "定期的な一人時間が必要不可欠"
            },
            maintenance: {
                whatYouNeed: "感謝の言葉、成長の実感、調和の実現",
                howToCharge: "誰かの成長を見守る、チームの成功に貢献",
                warning: "自己犠牲が過ぎるとバーンアウトのリスク",
                tip: "他者を支えると同時に、自分のケアも忘れずに"
            }
        },
        
        // 🌐 人と接する時のモード
        asInterfaceOS: {
            profile: {
                type: "共感的ファシリテーター型",
                description: "全員の声を聞き、調和を生み出すタイプ",
                metaphor: "優れたカウンセラーやコーチのような存在"
            },
            howToTalk: {
                style: "傾聴と共感をベースにした双方向型",
                example: "『なるほど、その視点は重要ですね』と相手を認める",
                goodAt: "信頼関係構築、チームビルディング、対立調整",
                notGoodAt: "強い主張、即断即決、厳しい指摘"
            },
            bestEnvironment: {
                where: "協調性と成長を重視する環境",
                example: "人材育成部門、カスタマーサポート、NPO、教育機関",
                withWho: "互いを尊重し合える仲間",
                avoid: "競争が激しく、個人主義的な環境"
            },
            relationshipTips: {
                strength: "誰からも信頼される安心感",
                weakness: "自己主張が弱く、意見が通りにくい",
                advice: "時には自分の意見も明確に。NOと言う勇気も大切"
            }
        },
        
        // 🛡️ ピンチの時の守り方
        asSafeModeOS: {
            profile: {
                type: "受容統合型",
                description: "すべてを受け止め、時間をかけて消化する",
                metaphor: "大地が雨を吸収するように、じっくりと処理"
            },
            stressResponse: {
                whatYouDo: "一旦すべてを受け入れ、ゆっくり整理",
                example: "批判を受けた → 感情を落ち着けてから建設的に振り返る",
                goodPoint: "冷静さを保ち、長期的視点で対処",
                badPoint: "ストレスを内に溜め込みすぎる傾向"
            },
            emergencyMode: {
                whatHappens: "一時的な撤退と内省",
                example: "対人関係の疲労 → 距離を置いて回復を図る",
                recovery: "安全な環境でゆっくりと充電",
                timeToRecover: "1-2週間（じっくり時間をかけて）"
            },
            howToRecover: {
                bestWay: "自然との触れ合い、静寂な環境",
                example: "森林浴、温泉、ヨガ、瞑想",
                environment: "プレッシャーのない安心できる場所",
                support: "見守ってくれる理解者の存在"
            }
        },
        
        osBalance: {
            idealBalance: "支援40% : 共感35% : 自己保護25%",
            whenBalanced: "組織の要として、持続的な成長を支える存在",
            whenImbalanced: "自己犠牲による疲弊、または過度な引きこもり",
            tip: "支援→自己ケア→再び支援 の健全なサイクルを保とう"
        }
    },
    
    // ============================================
    // 3. 水雷屯 - パイオニア型
    // ============================================
    "水雷屯": {
        id: 3,
        symbol: "☲☳",
        element: "水雷",
        nickname: "パイオニア",
        emoji: "🌱",
        
        // 🔥 心のエンジンとして動く時
        asEngineOS: {
            profile: {
                type: "開拓挑戦エンジン",
                description: "困難な状況でこそ力を発揮する開拓者精神",
                metaphor: "荒野を開拓する冒険者のような情熱"
            },
            normalState: {
                whatHappens: "新しい道を切り開く機会を常に探している",
                example: "『誰もやっていないなら、自分がやろう』と考える",
                energyLevel: "🔋🔋🔋 (65%) - 挑戦センサー起動中"
            },
            superMode: {
                when: "前例のない問題、未開拓の領域に出会った時",
                whatHappens: "困難を楽しみながら突破！パイオニアモード",
                example: "新市場開拓、新規事業立ち上げで本領発揮",
                energyLevel: "🔋🔋🔋🔋🔋 (95%) - 開拓者魂全開"
            },
            restMode: {
                whatHappens: "次の挑戦に向けて準備と計画",
                howToRest: "新しい分野の勉強、スキルアップ",
                note: "完全に止まることはない、常に前進準備"
            },
            maintenance: {
                whatYouNeed: "未知への挑戦、開拓の自由",
                howToCharge: "新しい分野への参入、ゼロからの構築",
                warning: "既存の枠組みに縛られると窒息する",
                tip: "小さくてもいいから『初めて』を作り続けよう"
            }
        },
        
        // 🌐 人と接する時のモード
        asInterfaceOS: {
            profile: {
                type: "先駆者ガイド型",
                description: "新しい道を示し、仲間を導くタイプ",
                metaphor: "探検隊のリーダーのような存在"
            },
            howToTalk: {
                style: "情熱的で説得力のある語り",
                example: "『この道は困難だけど、必ず価値がある』と伝える",
                goodAt: "モチベーション喚起、新規開拓への誘導",
                notGoodAt: "既存ルールの説明、慎重な調整"
            },
            bestEnvironment: {
                where: "フロンティア精神が評価される環境",
                example: "スタートアップ、新規事業、研究開発",
                withWho: "リスクを恐れない冒険心のある仲間",
                avoid: "保守的で前例主義の組織"
            },
            relationshipTips: {
                strength: "困難を共に乗り越える絆を作る",
                weakness: "安定志向の人とのすれ違い",
                advice: "全員が冒険者ではないことを理解しよう"
            }
        },
        
        // 🛡️ ピンチの時の守り方
        asSafeModeOS: {
            profile: {
                type: "試行錯誤型",
                description: "失敗を恐れず、何度でも挑戦する",
                metaphor: "ゲームで何度もリトライするような粘り強さ"
            },
            stressResponse: {
                whatYouDo: "別のアプローチを次々試す",
                example: "Aがダメならb、Bもダメならc...と柔軟に対応",
                goodPoint: "諦めない粘り強さ、柔軟な対応力",
                badPoint: "時に無謀な挑戦を続けてしまう"
            },
            emergencyMode: {
                whatHappens: "基本に立ち返って再スタート",
                example: "大失敗 → 『ゼロからやり直そう』",
                recovery: "新しい挑戦で前の失敗を忘れる",
                timeToRecover: "3-5日（次の目標が見つかれば）"
            },
            howToRecover: {
                bestWay: "小さな成功体験の積み重ね",
                example: "簡単なタスクから再開、徐々にレベルアップ",
                environment: "失敗を許容してくれる環境",
                support: "共に挑戦してくれる仲間"
            }
        },
        
        osBalance: {
            idealBalance: "開拓45% : 導き35% : 粘り強さ20%",
            whenBalanced: "新しい領域を切り開くパイオニアとして活躍",
            whenImbalanced: "無謀な挑戦の連続、または挫折からの停滞",
            tip: "挑戦→学習→改善→再挑戦 のサイクルを大切に"
        }
    },
    
    // ============================================
    // 4. 山水蒙 - 育成者型
    // ============================================
    "山水蒙": {
        id: 4,
        symbol: "☶☵",
        element: "山水",
        nickname: "育成者",
        emoji: "📚",
        
        // 🔥 心のエンジンとして動く時
        asEngineOS: {
            profile: {
                type: "教育啓発エンジン",
                description: "知識と経験を次世代に伝える使命感",
                metaphor: "優れた教師のような、人を育てる情熱"
            },
            normalState: {
                whatHappens: "常に『どう教えたら伝わるか』を考えている",
                example: "相手のレベルに合わせて説明方法を変える",
                energyLevel: "🔋🔋🔋 (60%) - 教育モード常時ON"
            },
            superMode: {
                when: "誰かが成長の壁にぶつかっている時",
                whatHappens: "全力で導き、突破をサポート",
                example: "後輩の悩みに寄り添い、成長を全力支援",
                energyLevel: "🔋🔋🔋🔋 (85%) - メンターモード"
            },
            restMode: {
                whatHappens: "新しい知識の吸収と整理",
                howToRest: "読書、セミナー参加、自己研鑽",
                note: "学ぶことが最高のリフレッシュ"
            },
            maintenance: {
                whatYouNeed: "教える機会、成長の実感",
                howToCharge: "誰かの『わかった！』という瞬間",
                warning: "教える相手がいないと意欲低下",
                tip: "常に誰かの成長に関わる機会を持とう"
            }
        },
        
        // 🌐 人と接する時のモード
        asInterfaceOS: {
            profile: {
                type: "メンター型",
                description: "相手の可能性を引き出すタイプ",
                metaphor: "信頼される先輩、頼れる師匠"
            },
            howToTalk: {
                style: "わかりやすく、段階的に説明",
                example: "『まずはここから始めてみよう』と導く",
                goodAt: "教育、指導、スキル伝承",
                notGoodAt: "同レベルでの競争、対等な議論"
            },
            bestEnvironment: {
                where: "教育と成長が重視される環境",
                example: "教育機関、研修部門、技術伝承",
                withWho: "学ぶ意欲のある人々",
                avoid: "即戦力のみ求められる環境"
            },
            relationshipTips: {
                strength: "人を育てる喜びと信頼関係",
                weakness: "教える立場に固執しがち",
                advice: "時には学ぶ側に回ることも大切"
            }
        },
        
        // 🛡️ ピンチの時の守り方
        asSafeModeOS: {
            profile: {
                type: "基本回帰型",
                description: "原点に戻って着実に対処",
                metaphor: "教科書通りの確実な方法を選ぶ"
            },
            stressResponse: {
                whatYouDo: "基礎から見直し、確実に解決",
                example: "問題発生 → マニュアル確認 → 手順通り対応",
                goodPoint: "確実性、ミスの少なさ",
                badPoint: "柔軟性に欠ける場合がある"
            },
            emergencyMode: {
                whatHappens: "信頼できる先輩や専門家に相談",
                example: "自分で解決困難 → 『教えてください』",
                recovery: "新しい学びを得て成長",
                timeToRecover: "1週間（学びを整理する時間）"
            },
            howToRecover: {
                bestWay: "体系的な学習と振り返り",
                example: "失敗から学び、次に活かす",
                environment: "学習を支援してくれる環境",
                support: "良き師匠、先輩の存在"
            }
        },
        
        osBalance: {
            idealBalance: "教育40% : 指導30% : 学習30%",
            whenBalanced: "知識と経験を次世代に伝える優れた育成者",
            whenImbalanced: "教えることに固執、または自信喪失",
            tip: "教える→学ぶ→改善→また教える のサイクル"
        }
    },
    
    // ============================================
    // 5. 水天需 - 戦略家型
    // ============================================
    "水天需": {
        id: 5,
        symbol: "☵☰",
        element: "水天",
        nickname: "戦略家",
        emoji: "♟️",
        
        // 🔥 心のエンジンとして動く時
        asEngineOS: {
            profile: {
                type: "戦略立案エンジン",
                description: "最適なタイミングと方法を見極める",
                metaphor: "チェスプレイヤーのような先読み思考"
            },
            normalState: {
                whatHappens: "常に複数のシナリオを想定している",
                example: "『もしAなら○○、Bなら△△』と準備",
                energyLevel: "🔋🔋🔋 (55%) - 分析モード継続"
            },
            superMode: {
                when: "重要な決断、大きな勝負どころ",
                whatHappens: "全データを分析、最適解を導出",
                example: "重要な交渉で、相手の出方を全て想定済み",
                energyLevel: "🔋🔋🔋🔋 (90%) - 戦略的思考フル回転"
            },
            restMode: {
                whatHappens: "情報収集と次の戦略準備",
                howToRest: "データ分析、トレンド研究",
                note: "休んでいても頭は動いている"
            },
            maintenance: {
                whatYouNeed: "十分な情報と考える時間",
                howToCharge: "戦略が的中した時の達成感",
                warning: "急かされると判断ミスのリスク",
                tip: "時には直感も大切にしよう"
            }
        },
        
        // 🌐 人と接する時のモード
        asInterfaceOS: {
            profile: {
                type: "アドバイザー型",
                description: "的確な助言で方向性を示すタイプ",
                metaphor: "信頼される参謀、ブレーン的存在"
            },
            howToTalk: {
                style: "論理的で説得力のある説明",
                example: "『データによると、この選択が最適です』",
                goodAt: "戦略提案、リスク分析、計画立案",
                notGoodAt: "感情的な共感、即興的な対応"
            },
            bestEnvironment: {
                where: "戦略性が評価される環境",
                example: "経営企画、コンサルティング、分析部門",
                withWho: "論理的思考を評価する人々",
                avoid: "感情優先、即断即決の環境"
            },
            relationshipTips: {
                strength: "的確な判断と信頼性",
                weakness: "時に冷たく見られがち",
                advice: "論理だけでなく、感情も考慮しよう"
            }
        },
        
        // 🛡️ ピンチの時の守り方
        asSafeModeOS: {
            profile: {
                type: "待機観察型",
                description: "最適なタイミングまで待つ",
                metaphor: "嵐が過ぎるのを待つような忍耐"
            },
            stressResponse: {
                whatYouDo: "一旦距離を置いて状況分析",
                example: "感情的な対立 → 冷静に状況を観察",
                goodPoint: "冷静な判断力、客観性",
                badPoint: "行動が遅れることがある"
            },
            emergencyMode: {
                whatHappens: "全選択肢を検討してから行動",
                example: "危機 → 全シナリオ分析 → 最適解選択",
                recovery: "論理的に整理して納得",
                timeToRecover: "3-7日（分析が完了すれば）"
            },
            howToRecover: {
                bestWay: "データと論理で状況を整理",
                example: "問題を図表化、解決策をリスト化",
                environment: "静かで集中できる環境",
                support: "論理的に話せる相談相手"
            }
        },
        
        osBalance: {
            idealBalance: "戦略50% : 助言30% : 観察20%",
            whenBalanced: "組織の頭脳として最適な判断を提供",
            whenImbalanced: "分析麻痺、または軽率な判断",
            tip: "分析→決断→実行→検証 のバランスを保とう"
        }
    },
    
    // ============================================
    // 6. 天水訟 - 交渉人型
    // ============================================
    "天水訟": {
        id: 6,
        symbol: "☰☵",
        element: "天水",
        nickname: "交渉人",
        emoji: "⚖️",
        
        // 🔥 心のエンジンとして動く時
        asEngineOS: {
            profile: {
                type: "正義追求エンジン",
                description: "公正さと真実を追い求める",
                metaphor: "弁護士のような正義感と論理性"
            },
            normalState: {
                whatHappens: "物事の矛盾や不公正を見逃さない",
                example: "『それ、理屈が通らないよね』と指摘",
                energyLevel: "🔋🔋🔋 (65%) - 正義センサー作動中"
            },
            superMode: {
                when: "不正や矛盾と戦う必要がある時",
                whatHappens: "論理と証拠で徹底的に立証",
                example: "不当な扱いに対して、理路整然と反論",
                energyLevel: "🔋🔋🔋🔋🔋 (95%) - 弁論モード全開"
            },
            restMode: {
                whatHappens: "次の論点を整理、証拠収集",
                howToRest: "法律や倫理の勉強、判例研究",
                note: "常に何かを検証している"
            },
            maintenance: {
                whatYouNeed: "議論の機会、正義の実現",
                howToCharge: "論理で勝利した時の達成感",
                warning: "全てを白黒つけようとすると疲れる",
                tip: "グレーゾーンも受け入れる柔軟性を"
            }
        },
        
        // 🌐 人と接する時のモード
        asInterfaceOS: {
            profile: {
                type: "ディベーター型",
                description: "議論と交渉で最善を導くタイプ",
                metaphor: "優れた交渉人、調停者"
            },
            howToTalk: {
                style: "論理的で説得力のある議論",
                example: "『論点を整理すると...』と体系的に説明",
                goodAt: "交渉、議論、問題解決",
                notGoodAt: "感情的な慰め、曖昧な会話"
            },
            bestEnvironment: {
                where: "論理と公正が重視される環境",
                example: "法務、コンプライアンス、交渉担当",
                withWho: "理性的で公正な人々",
                avoid: "感情論が支配的な環境"
            },
            relationshipTips: {
                strength: "公正な判断と説得力",
                weakness: "理屈っぽく見られがち",
                advice: "時には感情も大切な判断材料"
            }
        },
        
        // 🛡️ ピンチの時の守り方
        asSafeModeOS: {
            profile: {
                type: "論理武装型",
                description: "理論と証拠で自己を守る",
                metaphor: "法廷での弁護のような防御"
            },
            stressResponse: {
                whatYouDo: "論理的に反論、正当性を主張",
                example: "批判 → 『その根拠は？』と論理で返す",
                goodPoint: "感情に流されない冷静さ",
                badPoint: "頑固に見られることがある"
            },
            emergencyMode: {
                whatHappens: "全ての論点を洗い出して対抗",
                example: "攻撃 → 論理的矛盾を指摘して防御",
                recovery: "論理的に納得できれば回復",
                timeToRecover: "2-5日（論点整理が済めば）"
            },
            howToRecover: {
                bestWay: "問題を論理的に整理",
                example: "議論の記録作成、論点の整理",
                environment: "冷静に考えられる環境",
                support: "論理的に話せる相談相手"
            }
        },
        
        osBalance: {
            idealBalance: "正義45% : 交渉35% : 防御20%",
            whenBalanced: "公正な判断者として信頼される存在",
            whenImbalanced: "融通が利かない、または優柔不断",
            tip: "論理と感情、正義と現実のバランスを"
        }
    },
    
    // ============================================
    // 7. 地水師 - 指揮官型
    // ============================================
    "地水師": {
        id: 7,
        symbol: "☷☵",
        element: "地水",
        nickname: "指揮官",
        emoji: "🎖️",
        
        // 🔥 心のエンジンとして動く時
        asEngineOS: {
            profile: {
                type: "統率指揮エンジン",
                description: "組織を導き、目標を達成する使命感",
                metaphor: "軍隊の指揮官のような統率力"
            },
            normalState: {
                whatHappens: "チーム全体の動きを把握、調整",
                example: "誰が何をしているか常に把握している",
                energyLevel: "🔋🔋🔋 (70%) - 指揮モード継続"
            },
            superMode: {
                when: "組織が危機に直面、統率が必要な時",
                whatHappens: "強力なリーダーシップで組織を導く",
                example: "プロジェクト危機で陣頭指揮を執る",
                energyLevel: "🔋🔋🔋🔋🔋 (100%) - 完全指揮モード"
            },
            restMode: {
                whatHappens: "次の作戦を練る、体制を整備",
                howToRest: "戦略書を読む、組織論を学ぶ",
                note: "常に組織のことを考えている"
            },
            maintenance: {
                whatYouNeed: "明確な権限、信頼される立場",
                howToCharge: "チームの勝利、目標達成",
                warning: "権限がないと力を発揮できない",
                tip: "部下の声にも耳を傾けよう"
            }
        },
        
        // 🌐 人と接する時のモード
        asInterfaceOS: {
            profile: {
                type: "司令官型",
                description: "明確な指示で組織を動かすタイプ",
                metaphor: "頼れる上司、信頼される隊長"
            },
            howToTalk: {
                style: "明確で具体的な指示",
                example: "『○○を△△までに完了させよ』",
                goodAt: "指示出し、組織化、危機管理",
                notGoodAt: "対等な議論、感情的な配慮"
            },
            bestEnvironment: {
                where: "階層的で組織的な環境",
                example: "プロジェクト管理、組織運営、危機管理",
                withWho: "指示に従う規律ある人々",
                avoid: "フラットで自由な環境"
            },
            relationshipTips: {
                strength: "頼れるリーダーシップ",
                weakness: "威圧的に見られることがある",
                advice: "時には部下と同じ目線に立とう"
            }
        },
        
        // 🛡️ ピンチの時の守り方
        asSafeModeOS: {
            profile: {
                type: "陣形防御型",
                description: "組織全体で守りを固める",
                metaphor: "要塞を築くような組織防衛"
            },
            stressResponse: {
                whatYouDo: "組織を固めて集団で対処",
                example: "外部からの攻撃 → チーム一丸で防御",
                goodPoint: "組織力を活かした強固な防御",
                badPoint: "一人では対処できない"
            },
            emergencyMode: {
                whatHappens: "全員を統率して危機対応",
                example: "緊急事態 → 指揮系統確立 → 組織対応",
                recovery: "組織の立て直しと共に回復",
                timeToRecover: "1-2週間（組織が安定すれば）"
            },
            howToRecover: {
                bestWay: "組織の再編成と士気向上",
                example: "チームミーティング、方針再確認",
                environment: "統制の取れた組織環境",
                support: "信頼できる副官、参謀"
            }
        },
        
        osBalance: {
            idealBalance: "統率50% : 指揮30% : 組織防衛20%",
            whenBalanced: "組織を勝利に導く優れた指揮官",
            whenImbalanced: "独裁的、または指示待ち体質",
            tip: "指揮→実行→評価→改善 のサイクルを回そう"
        }
    },
    
    // ============================================
    // 8. 水地比 - 調和者型
    // ============================================
    "水地比": {
        id: 8,
        symbol: "☵☷",
        element: "水地",
        nickname: "調和者",
        emoji: "🤝",
        
        // 🔥 心のエンジンとして動く時
        asEngineOS: {
            profile: {
                type: "協調促進エンジン",
                description: "人と人をつなぎ、調和を生み出す",
                metaphor: "オーケストラの指揮者のような調和力"
            },
            normalState: {
                whatHappens: "グループの雰囲気を感じ取り調整",
                example: "誰かが孤立していないか常に気を配る",
                energyLevel: "🔋🔋 (50%) - 調和センサー稼働"
            },
            superMode: {
                when: "グループに不和が生じた時",
                whatHappens: "全力で関係修復、調和回復",
                example: "対立する二人の間を取り持ち和解させる",
                energyLevel: "🔋🔋🔋🔋 (85%) - 調停モード"
            },
            restMode: {
                whatHappens: "一人で静かに過ごす",
                howToRest: "音楽鑑賞、アート鑑賞",
                note: "人間関係から離れる時間が必要"
            },
            maintenance: {
                whatYouNeed: "調和的な環境、感謝の言葉",
                howToCharge: "みんなが仲良くしている光景",
                warning: "対立が続くと消耗する",
                tip: "全ての対立を解決しなくてもいい"
            }
        },
        
        // 🌐 人と接する時のモード
        asInterfaceOS: {
            profile: {
                type: "コネクター型",
                description: "人と人をつなぐネットワーカー",
                metaphor: "みんなをつなぐハブのような存在"
            },
            howToTalk: {
                style: "親しみやすく包容力のある会話",
                example: "『みんなで一緒に』と協力を促す",
                goodAt: "関係構築、チーム形成、雰囲気作り",
                notGoodAt: "対立、競争、個人プレー"
            },
            bestEnvironment: {
                where: "協力と調和が重視される環境",
                example: "チームプロジェクト、コミュニティ運営",
                withWho: "協調性のある仲間",
                avoid: "競争的で個人主義的な環境"
            },
            relationshipTips: {
                strength: "誰とでも仲良くなれる",
                weakness: "八方美人に見られることも",
                advice: "時には自分の意見も主張しよう"
            }
        },
        
        // 🛡️ ピンチの時の守り方
        asSafeModeOS: {
            profile: {
                type: "仲間依存型",
                description: "信頼できる仲間と共に乗り越える",
                metaphor: "チームスポーツのような協力防御"
            },
            stressResponse: {
                whatYouDo: "仲間に相談、協力を求める",
                example: "問題発生 → 『みんなで解決しよう』",
                goodPoint: "チームの力を活用",
                badPoint: "一人では対処が難しい"
            },
            emergencyMode: {
                whatHappens: "信頼できる人々に助けを求める",
                example: "危機 → SOS発信 → みんなでサポート",
                recovery: "仲間との絆で回復",
                timeToRecover: "3-7日（仲間のサポートがあれば）"
            },
            howToRecover: {
                bestWay: "仲間との交流、支え合い",
                example: "友人と話す、チームで励まし合う",
                environment: "温かく支援的な環境",
                support: "信頼できる仲間たち"
            }
        },
        
        osBalance: {
            idealBalance: "調和45% : つながり35% : 協力20%",
            whenBalanced: "チームの潤滑油として組織を円滑に",
            whenImbalanced: "依存的、または孤立",
            tip: "つなぐ→調和→成長→またつなぐ のサイクル"
        }
    }
};

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HexagramHumanTraitsV3Part1;
}