/**
 * Triple OS 人格システムデータベース v3.0 - Part 3 (17-24卦)
 * 
 * @author Claude Code
 * @date 2025-01-20
 * @version 3.0.0
 */

const HexagramHumanTraitsV3Part3 = {
    // ============================================
    // 17. 澤雷随 - 適応者型
    // ============================================
    "澤雷随": {
        id: 17,
        symbol: "☳☱",
        element: "澤雷",
        nickname: "適応者",
        emoji: "🦎",
        
        asEngineOS: {
            profile: {
                type: "柔軟適応エンジン",
                description: "状況に合わせて自在に変化",
                metaphor: "カメレオンのような適応力"
            },
            normalState: {
                whatHappens: "周りの流れを読んで調整",
                example: "場の空気に合わせて行動を変える",
                energyLevel: "🔋🔋🔋 (55%) - 適応モード"
            },
            superMode: {
                when: "急激な環境変化が起きた時",
                whatHappens: "瞬時に適応して生き残る",
                example: "組織改革でもすぐに新体制に順応",
                energyLevel: "🔋🔋🔋🔋 (85%) - 変化対応モード"
            },
            restMode: {
                whatHappens: "自分らしさを取り戻す",
                howToRest: "一人で自分と向き合う時間",
                note: "適応疲れをリセット"
            },
            maintenance: {
                whatYouNeed: "変化と安定のバランス",
                howToCharge: "新しい環境での成功体験",
                warning: "自分を見失わないように",
                tip: "コアの自分は保ちつつ柔軟に"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "カメレオン型",
                description: "相手に合わせて接し方を変える",
                metaphor: "優れた営業マンのような適応力"
            },
            howToTalk: {
                style: "相手のペースに合わせる",
                example: "相手が論理的なら論理的に、感情的なら共感的に",
                goodAt: "幅広い人脈構築、交渉",
                notGoodAt: "一貫性の維持、深い関係"
            },
            bestEnvironment: {
                where: "多様性のある環境",
                example: "営業、コンサルタント、国際関係",
                withWho: "様々なタイプの人々",
                avoid: "画一的な環境"
            },
            relationshipTips: {
                strength: "誰とでもうまくやれる",
                weakness: "本心が見えにくい",
                advice: "時には素の自分も見せよう"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "流動回避型",
                description: "流れに身を任せて危機を回避",
                metaphor: "水のように形を変えて流れる"
            },
            stressResponse: {
                whatYouDo: "抵抗せず流れに乗る",
                example: "批判 → 『そうですね』と受け流す",
                goodPoint: "無駄な対立を避ける",
                badPoint: "主体性を失うことも"
            },
            emergencyMode: {
                whatHappens: "環境に完全に同化",
                example: "危機では周りと同じ行動を取る",
                recovery: "環境が安定したら自分を取り戻す",
                timeToRecover: "1週間（環境次第）"
            },
            howToRecover: {
                bestWay: "自分のペースを取り戻す",
                example: "好きなことをする時間を作る",
                environment: "プレッシャーのない自由な空間",
                support: "ありのままを受け入れてくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "適応45% : 柔軟35% : 自己保持20%",
            whenBalanced: "どんな環境でも活躍できる",
            whenImbalanced: "八方美人、または頑固",
            tip: "適応→成功→自己確認→また適応"
        }
    },
    
    // ============================================
    // 18. 山風蠱 - 改善者型
    // ============================================
    "山風蠱": {
        id: 18,
        symbol: "☴☶",
        element: "山風",
        nickname: "改善者",
        emoji: "🔧",
        
        asEngineOS: {
            profile: {
                type: "問題解決エンジン",
                description: "問題を見つけて改善する",
                metaphor: "修理職人のような問題解決力"
            },
            normalState: {
                whatHappens: "常に改善点を探している",
                example: "『ここをこうすればもっと良くなる』",
                energyLevel: "🔋🔋🔋 (60%) - 改善センサー作動"
            },
            superMode: {
                when: "大きな問題を発見した時",
                whatHappens: "全力で問題解決に取り組む",
                example: "システムの根本的な欠陥を修正",
                energyLevel: "🔋🔋🔋🔋🔋 (95%) - 修正モード全開"
            },
            restMode: {
                whatHappens: "次の改善対象を探す",
                howToRest: "問題分析、原因究明",
                note: "問題がないと落ち着かない"
            },
            maintenance: {
                whatYouNeed: "解決すべき課題",
                howToCharge: "問題解決の達成感",
                warning: "完璧主義に陥りやすい",
                tip: "時には『これでOK』も必要"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "問題指摘型",
                description: "改善点を指摘して向上を促す",
                metaphor: "品質管理者のような厳しい目"
            },
            howToTalk: {
                style: "建設的な批判と改善提案",
                example: "『ここを改善すればもっと良くなる』",
                goodAt: "問題発見、改善提案、品質向上",
                notGoodAt: "褒める、現状肯定"
            },
            bestEnvironment: {
                where: "改善が評価される環境",
                example: "品質管理、プロセス改善、監査",
                withWho: "向上心のある人々",
                avoid: "現状維持的な環境"
            },
            relationshipTips: {
                strength: "組織を良くする推進力",
                weakness: "批判的に見られがち",
                advice: "良い点も認めることが大切"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "修復対処型",
                description: "問題を修正して乗り切る",
                metaphor: "壊れたものを直して使う"
            },
            stressResponse: {
                whatYouDo: "問題の原因を特定して修正",
                example: "失敗 → 原因分析 → 改善策実施",
                goodPoint: "根本的な解決力",
                badPoint: "時間がかかる"
            },
            emergencyMode: {
                whatHappens: "緊急修復モード起動",
                example: "とりあえず動くように応急処置",
                recovery: "完全修復と共に回復",
                timeToRecover: "1-2週間（修復完了まで）"
            },
            howToRecover: {
                bestWay: "問題を完全に解決する",
                example: "原因を突き止めて対策実施",
                environment: "じっくり取り組める環境",
                support: "技術的なアドバイザー"
            }
        },
        
        osBalance: {
            idealBalance: "改善50% : 分析30% : 実装20%",
            whenBalanced: "組織の品質向上に貢献",
            whenImbalanced: "批判ばかり、または放置",
            tip: "発見→分析→改善→検証 のサイクル"
        }
    },
    
    // ============================================
    // 19. 地澤臨 - 見守り型
    // ============================================
    "地澤臨": {
        id: 19,
        symbol: "☱☷",
        element: "地澤",
        nickname: "見守り人",
        emoji: "👁️",
        
        asEngineOS: {
            profile: {
                type: "観察見守りエンジン",
                description: "じっくり観察して最適なタイミングを計る",
                metaphor: "野生動物を観察する研究者のような忍耐"
            },
            normalState: {
                whatHappens: "静かに状況を観察し続ける",
                example: "会議で発言せずに全員の意見を聞く",
                energyLevel: "🔋🔋 (40%) - 省エネ観察モード"
            },
            superMode: {
                when: "決定的な瞬間が訪れた時",
                whatHappens: "蓄積した観察結果を活かして行動",
                example: "長い観察の末、的確な判断を下す",
                energyLevel: "🔋🔋🔋🔋 (80%) - 洞察力全開"
            },
            restMode: {
                whatHappens: "観察記録の整理と分析",
                howToRest: "データ整理、パターン分析",
                note: "観察は休んでいても続く"
            },
            maintenance: {
                whatYouNeed: "観察対象と十分な時間",
                howToCharge: "洞察が的中した時の満足感",
                warning: "行動が遅れがち",
                tip: "観察と行動のバランスを"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "静観者型",
                description: "一歩引いて全体を見るタイプ",
                metaphor: "賢者のような静かな存在感"
            },
            howToTalk: {
                style: "少ない言葉で的確に",
                example: "長い沈黙の後、核心を突く一言",
                goodAt: "洞察、アドバイス、判断",
                notGoodAt: "雑談、即興会話"
            },
            bestEnvironment: {
                where: "深い洞察が求められる環境",
                example: "研究、分析、戦略立案",
                withWho: "思慮深い人々",
                avoid: "スピード重視の環境"
            },
            relationshipTips: {
                strength: "深い洞察と的確な判断",
                weakness: "距離を感じさせる",
                advice: "時には積極的な関わりも"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "静観防御型",
                description: "動かずに嵐が過ぎるのを待つ",
                metaphor: "亀が甲羅に隠れるような防御"
            },
            stressResponse: {
                whatYouDo: "静かに観察して機を待つ",
                example: "混乱 → 静観 → 最適なタイミングで介入",
                goodPoint: "無駄な動きをしない",
                badPoint: "機会を逃すことも"
            },
            emergencyMode: {
                whatHappens: "完全に引きこもる",
                example: "危機では一切動かず様子見",
                recovery: "状況が落ち着いてから",
                timeToRecover: "2-4週間（じっくり時間をかけて）"
            },
            howToRecover: {
                bestWay: "ゆっくりと状況を把握",
                example: "情報収集、分析、慎重な行動",
                environment: "静かで落ち着いた場所",
                support: "忍耐強く待ってくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "観察40% : 洞察35% : 行動25%",
            whenBalanced: "的確な判断で組織を導く",
            whenImbalanced: "傍観者、または性急な行動",
            tip: "観察→洞察→行動→検証 のサイクル"
        }
    },
    
    // ============================================
    // 20. 風地観 - 俯瞰者型
    // ============================================
    "風地観": {
        id: 20,
        symbol: "☷☴",
        element: "風地",
        nickname: "俯瞰者",
        emoji: "🦅",
        
        asEngineOS: {
            profile: {
                type: "全体俯瞰エンジン",
                description: "高い視点から全体を見渡す",
                metaphor: "鷹の目のような広い視野"
            },
            normalState: {
                whatHappens: "常に全体像を把握",
                example: "個別の問題より全体の流れを重視",
                energyLevel: "🔋🔋🔋 (55%) - 俯瞰モード"
            },
            superMode: {
                when: "複雑な状況を整理する必要がある時",
                whatHappens: "全体像から最適解を導く",
                example: "複雑な問題を俯瞰して本質を見抜く",
                energyLevel: "🔋🔋🔋🔋 (85%) - 鳥瞰モード"
            },
            restMode: {
                whatHappens: "視点を変えて観察",
                howToRest: "違う角度から物事を見る",
                note: "視野を広げ続ける"
            },
            maintenance: {
                whatYouNeed: "広い視野と高い視点",
                howToCharge: "全体像が見えた時の爽快感",
                warning: "細部を見落としがち",
                tip: "時には地に足をつけて"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "ビジョン提示型",
                description: "大局的な視点を共有するタイプ",
                metaphor: "戦略コンサルタントのような視点"
            },
            howToTalk: {
                style: "全体像と本質を語る",
                example: "『大きく見ると、こういう流れです』",
                goodAt: "戦略立案、ビジョン共有",
                notGoodAt: "細かい実務、個別対応"
            },
            bestEnvironment: {
                where: "戦略的思考が求められる環境",
                example: "経営企画、シンクタンク、研究機関",
                withWho: "大局観のある人々",
                avoid: "細部にこだわる環境"
            },
            relationshipTips: {
                strength: "物事の本質を見抜く力",
                weakness: "現場感覚に欠ける",
                advice: "現場の声も大切に"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "高所回避型",
                description: "一歩引いて全体を見て対処",
                metaphor: "高台から洪水を見るような距離感"
            },
            stressResponse: {
                whatYouDo: "距離を置いて客観視",
                example: "感情的な問題 → 俯瞰して相対化",
                goodPoint: "冷静な判断力",
                badPoint: "他人事に見える"
            },
            emergencyMode: {
                whatHappens: "完全に離れて観察",
                example: "渦中から離れて全体を見る",
                recovery: "全体像が見えたら対処",
                timeToRecover: "1-2週間（俯瞰できれば）"
            },
            howToRecover: {
                bestWay: "高い視点から整理",
                example: "問題を図式化、全体像を描く",
                environment: "静かで集中できる場所",
                support: "戦略的な話ができる相手"
            }
        },
        
        osBalance: {
            idealBalance: "俯瞰45% : 分析30% : 実践25%",
            whenBalanced: "組織の羅針盤として機能",
            whenImbalanced: "机上の空論、または近視眼的",
            tip: "俯瞰→分析→実践→また俯瞰"
        }
    },
    
    // ============================================
    // 21. 火雷噬嗑 - 決断者型
    // ============================================
    "火雷噬嗑": {
        id: 21,
        symbol: "☳☲",
        element: "火雷",
        nickname: "決断者",
        emoji: "⚡",
        
        asEngineOS: {
            profile: {
                type: "即断即決エンジン",
                description: "素早く決断し、実行する",
                metaphor: "稲妻のような瞬発的決断力"
            },
            normalState: {
                whatHappens: "常に決断の準備ができている",
                example: "選択肢が出たら即座に決める",
                energyLevel: "🔋🔋🔋 (70%) - 決断準備完了"
            },
            superMode: {
                when: "重要な決断が必要な時",
                whatHappens: "迷いなく決断し、即実行",
                example: "緊急会議で即座に方針決定",
                energyLevel: "🔋🔋🔋🔋🔋 (100%) - 決断力MAX"
            },
            restMode: {
                whatHappens: "次の決断に備える",
                howToRest: "判断基準の整理",
                note: "決断力を研ぎ澄ます"
            },
            maintenance: {
                whatYouNeed: "決断の機会と権限",
                howToCharge: "的確な決断の成功体験",
                warning: "性急な判断のリスク",
                tip: "時には熟考も必要"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "断定的リーダー型",
                description: "明確な判断を下すリーダー",
                metaphor: "裁判官のような明確な判断"
            },
            howToTalk: {
                style: "はっきりとした断定的な物言い",
                example: "『これで行きます。議論は終わり』",
                goodAt: "意思決定、方向付け、締切厳守",
                notGoodAt: "曖昧な状況、長い議論"
            },
            bestEnvironment: {
                where: "スピードが求められる環境",
                example: "緊急対応、トレーディング、救急医療",
                withWho: "実行力のある人々",
                avoid: "合議制の環境"
            },
            relationshipTips: {
                strength: "決断の速さと明確さ",
                weakness: "独断的に見られる",
                advice: "他者の意見も聞く姿勢を"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "即断突破型",
                description: "迷わず決めて突き進む",
                metaphor: "赤信号でも渡る決断力"
            },
            stressResponse: {
                whatYouDo: "即座に判断して行動",
                example: "危機 → 即決断 → 全力実行",
                goodPoint: "迷いがない行動力",
                badPoint: "後悔することも"
            },
            emergencyMode: {
                whatHappens: "超高速決断モード",
                example: "0.1秒で判断して動く",
                recovery: "行動の結果次第",
                timeToRecover: "1-3日（結果が出れば）"
            },
            howToRecover: {
                bestWay: "決断の結果を受け入れる",
                example: "成功でも失敗でも次へ",
                environment: "次の挑戦ができる場所",
                support: "決断を支持してくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "決断50% : 実行35% : 責任15%",
            whenBalanced: "組織の推進力として機能",
            whenImbalanced: "独断専行、または優柔不断",
            tip: "決断→実行→検証→次の決断"
        }
    },
    
    // ============================================
    // 22. 山火賁 - 美化者型
    // ============================================
    "山火賁": {
        id: 22,
        symbol: "☲☶",
        element: "山火",
        nickname: "美化者",
        emoji: "🎨",
        
        asEngineOS: {
            profile: {
                type: "美的創造エンジン",
                description: "物事を美しく整える",
                metaphor: "アーティストのような美的感覚"
            },
            normalState: {
                whatHappens: "常に美しさを追求",
                example: "資料も部屋も美しく整える",
                energyLevel: "🔋🔋 (50%) - 美化モード"
            },
            superMode: {
                when: "美を表現する機会がある時",
                whatHappens: "芸術的な創造力を発揮",
                example: "プレゼンを芸術作品のように仕上げる",
                energyLevel: "🔋🔋🔋🔋 (85%) - アートモード"
            },
            restMode: {
                whatHappens: "美しいものに触れる",
                howToRest: "美術館、自然、音楽鑑賞",
                note: "美的感覚を養う"
            },
            maintenance: {
                whatYouNeed: "美しい環境と創造の機会",
                howToCharge: "美を生み出す喜び",
                warning: "見た目にこだわりすぎる",
                tip: "中身と見た目のバランスを"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "演出家型",
                description: "場を美しく演出するタイプ",
                metaphor: "舞台演出家のようなセンス"
            },
            howToTalk: {
                style: "優雅で洗練された表現",
                example: "言葉選びも美しく、品がある",
                goodAt: "プレゼンテーション、演出、装飾",
                notGoodAt: "泥臭い交渉、現実的な話"
            },
            bestEnvironment: {
                where: "美的センスが活きる環境",
                example: "デザイン、広告、ブランディング",
                withWho: "美意識の高い人々",
                avoid: "実用一辺倒の環境"
            },
            relationshipTips: {
                strength: "場を華やかにする力",
                weakness: "表面的に見られがち",
                advice: "内面の美しさも大切に"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "美化逃避型",
                description: "美しいもので心を守る",
                metaphor: "美術品に囲まれて癒される"
            },
            stressResponse: {
                whatYouDo: "美しいものに没頭",
                example: "ストレス → アート制作で発散",
                goodPoint: "創造的な昇華",
                badPoint: "現実逃避になることも"
            },
            emergencyMode: {
                whatHappens: "美の世界に逃げ込む",
                example: "現実が辛い → 芸術に没頭",
                recovery: "美を通じて回復",
                timeToRecover: "1-2週間（創作を通じて）"
            },
            howToRecover: {
                bestWay: "美しいものを創る",
                example: "絵を描く、音楽を作る、部屋を飾る",
                environment: "美しく整った空間",
                support: "美を理解してくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "美化40% : 創造35% : 実用25%",
            whenBalanced: "機能美を生み出す存在",
            whenImbalanced: "見た目だけ、または無骨",
            tip: "美→機能→調和→また美"
        }
    },
    
    // ============================================
    // 23. 山地剥 - 簡素化型
    // ============================================
    "山地剥": {
        id: 23,
        symbol: "☷☶",
        element: "山地",
        nickname: "簡素化人",
        emoji: "✂️",
        
        asEngineOS: {
            profile: {
                type: "削減簡素化エンジン",
                description: "無駄を削ぎ落とし、本質を残す",
                metaphor: "彫刻家が余分を削るような作業"
            },
            normalState: {
                whatHappens: "常に無駄を見つけて削る",
                example: "会議時間、プロセス、持ち物を最小化",
                energyLevel: "🔋🔋 (40%) - 省エネモード"
            },
            superMode: {
                when: "大幅な簡素化が必要な時",
                whatHappens: "徹底的に削ぎ落とす",
                example: "組織のスリム化、断捨離の実行",
                energyLevel: "🔋🔋🔋🔋 (80%) - 削減モード全開"
            },
            restMode: {
                whatHappens: "何もしない時間",
                howToRest: "瞑想、静寂、空白の時間",
                note: "無を楽しむ"
            },
            maintenance: {
                whatYouNeed: "シンプルな環境",
                howToCharge: "削ぎ落とした後のスッキリ感",
                warning: "必要なものまで削ることも",
                tip: "本当に大切なものは残そう"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "ミニマリスト型",
                description: "必要最小限のコミュニケーション",
                metaphor: "禅僧のようなシンプルさ"
            },
            howToTalk: {
                style: "簡潔で無駄のない会話",
                example: "要点のみ、結論から話す",
                goodAt: "効率的な伝達、時間短縮",
                notGoodAt: "雑談、感情的な交流"
            },
            bestEnvironment: {
                where: "効率性重視の環境",
                example: "システム最適化、コスト削減部門",
                withWho: "効率を重視する人々",
                avoid: "装飾的な環境"
            },
            relationshipTips: {
                strength: "無駄のない関係性",
                weakness: "冷たく感じられる",
                advice: "時には余白も大切"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "撤退縮小型",
                description: "最小限まで縮小して守る",
                metaphor: "冬眠のようなエネルギー温存"
            },
            stressResponse: {
                whatYouDo: "不要なものを全て切り捨てる",
                example: "負担 → 仕事も人間関係も最小化",
                goodPoint: "エネルギーの温存",
                badPoint: "大切なものも失うリスク"
            },
            emergencyMode: {
                whatHappens: "最小限の機能だけ維持",
                example: "生きるのに必要なことだけ",
                recovery: "少しずつ機能を回復",
                timeToRecover: "2-4週間（ゆっくり回復）"
            },
            howToRecover: {
                bestWay: "一つずつ取り戻す",
                example: "最重要から順に再開",
                environment: "シンプルで静かな環境",
                support: "必要最小限の支援"
            }
        },
        
        osBalance: {
            idealBalance: "簡素化45% : 効率30% : 保存25%",
            whenBalanced: "無駄のない洗練された存在",
            whenImbalanced: "削りすぎ、または肥大化",
            tip: "削る→確認→調整→また削る"
        }
    },
    
    // ============================================
    // 24. 地雷復 - 再生者型
    // ============================================
    "地雷復": {
        id: 24,
        symbol: "☳☷",
        element: "地雷",
        nickname: "再生者",
        emoji: "🌅",
        
        asEngineOS: {
            profile: {
                type: "復活再生エンジン",
                description: "何度でも立ち上がる回復力",
                metaphor: "不死鳥のような再生力"
            },
            normalState: {
                whatHappens: "常に回復と成長を続ける",
                example: "失敗を糧に、より強くなる",
                energyLevel: "🔋🔋🔋 (60%) - 再生モード"
            },
            superMode: {
                when: "大きな挫折や失敗の後",
                whatHappens: "驚異的な回復力で復活",
                example: "どん底から這い上がって成功",
                energyLevel: "🔋🔋🔋🔋🔋 (95%) - 不死鳥モード"
            },
            restMode: {
                whatHappens: "エネルギーを蓄積",
                howToRest: "静養、充電、準備期間",
                note: "次の飛躍への準備"
            },
            maintenance: {
                whatYouNeed: "挑戦と回復のサイクル",
                howToCharge: "復活の実感、成長の証",
                warning: "無理な挑戦の繰り返し",
                tip: "回復期間も大切にしよう"
            }
        },
        
        asInterfaceOS: {
            profile: {
                type: "励まし型",
                description: "希望を与え、再起を促すタイプ",
                metaphor: "コーチのような励まし力"
            },
            howToTalk: {
                style: "前向きで希望に満ちた言葉",
                example: "『大丈夫、また立ち上がれる』",
                goodAt: "励まし、希望の提供、再起支援",
                notGoodAt: "厳しい現実の指摘"
            },
            bestEnvironment: {
                where: "再生と成長の環境",
                example: "リハビリ、再就職支援、ターンアラウンド",
                withWho: "立ち直ろうとする人々",
                avoid: "諦めムードの環境"
            },
            relationshipTips: {
                strength: "希望を与える存在",
                weakness: "現実を甘く見ることも",
                advice: "現実も踏まえた希望を"
            }
        },
        
        asSafeModeOS: {
            profile: {
                type: "復活再起型",
                description: "倒れても必ず立ち上がる",
                metaphor: "七転び八起きの精神"
            },
            stressResponse: {
                whatYouDo: "一度倒れて、また立ち上がる",
                example: "失敗 → 休息 → 再チャレンジ",
                goodPoint: "諦めない粘り強さ",
                badPoint: "同じ失敗を繰り返すことも"
            },
            emergencyMode: {
                whatHappens: "一時的に撤退して力を蓄える",
                example: "今は退いて、次の機会を待つ",
                recovery: "時が来れば必ず復活",
                timeToRecover: "1-4週間（サイクル次第）"
            },
            howToRecover: {
                bestWay: "段階的な復活プロセス",
                example: "小さな成功から始めて徐々に大きく",
                environment: "再挑戦を許す環境",
                support: "信じて待ってくれる人"
            }
        },
        
        osBalance: {
            idealBalance: "再生45% : 希望35% : 忍耐20%",
            whenBalanced: "不屈の精神で困難を乗り越える",
            whenImbalanced: "無謀な挑戦、または諦め",
            tip: "挑戦→失敗→回復→再挑戦 のサイクル"
        }
    }
};

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HexagramHumanTraitsV3Part3;
}