/**
 * Triple OS 人格システムデータベース v3.0
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

const HexagramHumanTraitsV3 = {
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
            // どんなエンジン？
            profile: {
                type: "革新追求エンジン",
                description: "常に『もっと良い方法はないか？』を追い求める",
                metaphor: "新しい技術やサービスを発見した時のような興奮で動く"
            },
            
            // いつもの状態
            normalState: {
                whatHappens: "頭の中で常に新しいアイデアや改善案が生まれている",
                example: "会議中も『この仕組み、根本から変えられないか』と考える",
                energyLevel: "🔋🔋🔋 (70%) - 常時アイデア生成中"
            },
            
            // やる気MAXの時
            superMode: {
                when: "困難な課題や、誰もが『不可能』と言う状況に直面した時",
                whatHappens: "全リソースを創造的解決に投入！ブレイクスルーモード",
                example: "予算削減でも品質向上を求められた時、全く新しいアプローチを生み出す",
                energyLevel: "🔋🔋🔋🔋🔋 (100%) - フルパワー稼働"
            },
            
            // 休憩中
            restMode: {
                whatHappens: "次のイノベーション機会を探索中",
                howToRest: "最新技術の記事を読む、新しいサービスを試す",
                note: "完全に休むことは苦手。何か考えていないと落ち着かない"
            },
            
            // エンジンのお手入れ方法
            maintenance: {
                whatYouNeed: "新しい挑戦、未踏領域への進出機会",
                howToCharge: "新規プロジェクトの立ち上げ、未知の分野への挑戦",
                warning: "ルーティンワークが続くとパフォーマンス低下",
                tip: "定期的に新しいチャレンジを設定しよう"
            }
        },
        
        // 🌐 人と接する時のモード
        asInterfaceOS: {
            // どんな接し方？
            profile: {
                type: "ビジョナリーリーダー型",
                description: "『こちらに向かおう』と明確な方向性を示すタイプ",
                metaphor: "スタートアップのCEOのようなリーダーシップスタイル"
            },
            
            // コミュニケーションスタイル
            howToTalk: {
                style: "ストレートかつビジョナリー",
                example: "『これをやるべき理由は○○、目指すゴールは△△』と明確に伝える",
                goodAt: "ビジョンの共有、モチベーション向上、方向性の提示",
                notGoodAt: "細かい調整、全員のペースに合わせること"
            },
            
            // 相性のいい環境
            bestEnvironment: {
                where: "革新と変化を重視する環境",
                example: "新規事業開発、R&D部門、起業、改革プロジェクト",
                withWho: "変化を恐れず、共に挑戦してくれる仲間",
                avoid: "官僚的で変化を嫌う組織"
            },
            
            // 人間関係のコツ
            relationshipTips: {
                strength: "人々を新しい未来へ導く力",
                weakness: "時に周囲を置き去りにしてしまう",
                advice: "定期的に立ち止まり、チームの声に耳を傾けよう"
            }
        },
        
        // 🛡️ ピンチの時の守り方
        asSafeModeOS: {
            // どんな守り方？
            profile: {
                type: "前進突破型",
                description: "困難に直面したら、より大胆に前進する",
                metaphor: "将棋で守りより攻めを選ぶような戦略"
            },
            
            // ストレスへの対処法
            stressResponse: {
                whatYouDo: "新しい突破口を見つけて状況を打開",
                example: "プロジェクトが停滞 → 全く新しいアプローチを開発",
                goodPoint: "前向きな問題解決、イノベーションの創出",
                badPoint: "時に問題の本質から目を逸らしてしまう"
            },
            
            // 緊急時の行動
            emergencyMode: {
                whatHappens: "独力で全てを解決しようとする",
                example: "チームが機能不全 → 『自分が全部やる』モード",
                recovery: "新プロジェクトの立ち上げで気分一新",
                timeToRecover: "2-3日（新しい目標を見つければ即回復）"
            },
            
            // 回復方法
            howToRecover: {
                bestWay: "全く新しい分野への挑戦",
                example: "仕事で挫折 → 別業界の勉強会に参加",
                environment: "自由度の高い環境、制約の少ない状況",
                support: "可能性を信じてくれる人、新しい視点をくれる人"
            }
        },
        
        // 3つのOSの関係
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
            // どんなエンジン？
            profile: {
                type: "育成支援エンジン",
                description: "他者の成長と組織の調和を原動力とする",
                metaphor: "植物を育てる庭師のような、じっくりと成果を育む姿勢"
            },
            
            // いつもの状態
            normalState: {
                whatHappens: "周囲の状況を観察し、必要なサポートを察知",
                example: "会議で発言しづらそうな人に気づき、発言機会を作る",
                energyLevel: "🔋🔋 (50%) - 省エネで持続的"
            },
            
            // やる気MAXの時
            superMode: {
                when: "チームが危機に直面、関係性が崩れそうな時",
                whatHappens: "全力でチームを支え、調和を取り戻す",
                example: "プロジェクトメンバー間の対立を調整し、チームを再結束",
                energyLevel: "🔋🔋🔋🔋 (90%) - 献身的サポートモード"
            },
            
            // 休憩中
            restMode: {
                whatHappens: "静かに充電、自己回復の時間",
                howToRest: "瞑想、読書、自然の中での散歩",
                note: "定期的な一人時間が必要不可欠"
            },
            
            // エンジンのお手入れ方法
            maintenance: {
                whatYouNeed: "感謝の言葉、成長の実感、調和の実現",
                howToCharge: "誰かの成長を見守る、チームの成功に貢献",
                warning: "自己犠牲が過ぎるとバーンアウトのリスク",
                tip: "他者を支えると同時に、自分のケアも忘れずに"
            }
        },
        
        // 🌐 人と接する時のモード
        asInterfaceOS: {
            // どんな接し方？
            profile: {
                type: "共感的ファシリテーター型",
                description: "全員の声を聞き、調和を生み出すタイプ",
                metaphor: "優れたカウンセラーやコーチのような存在"
            },
            
            // コミュニケーションスタイル
            howToTalk: {
                style: "傾聴と共感をベースにした双方向型",
                example: "『なるほど、その視点は重要ですね』と相手を認める",
                goodAt: "信頼関係構築、チームビルディング、対立調整",
                notGoodAt: "強い主張、即断即決、厳しい指摘"
            },
            
            // 相性のいい環境
            bestEnvironment: {
                where: "協調性と成長を重視する環境",
                example: "人材育成部門、カスタマーサポート、NPO、教育機関",
                withWho: "互いを尊重し合える仲間",
                avoid: "競争が激しく、個人主義的な環境"
            },
            
            // 人間関係のコツ
            relationshipTips: {
                strength: "誰からも信頼される安心感",
                weakness: "自己主張が弱く、意見が通りにくい",
                advice: "時には自分の意見も明確に。NOと言う勇気も大切"
            }
        },
        
        // 🛡️ ピンチの時の守り方
        asSafeModeOS: {
            // どんな守り方？
            profile: {
                type: "受容統合型",
                description: "すべてを受け止め、時間をかけて消化する",
                metaphor: "大地が雨を吸収するように、じっくりと処理"
            },
            
            // ストレスへの対処法
            stressResponse: {
                whatYouDo: "一旦すべてを受け入れ、ゆっくり整理",
                example: "批判を受けた → 感情を落ち着けてから建設的に振り返る",
                goodPoint: "冷静さを保ち、長期的視点で対処",
                badPoint: "ストレスを内に溜め込みすぎる傾向"
            },
            
            // 緊急時の行動
            emergencyMode: {
                whatHappens: "一時的な撤退と内省",
                example: "対人関係の疲労 → 距離を置いて回復を図る",
                recovery: "安全な環境でゆっくりと充電",
                timeToRecover: "1-2週間（じっくり時間をかけて）"
            },
            
            // 回復方法
            howToRecover: {
                bestWay: "自然との触れ合い、静寂な環境",
                example: "森林浴、温泉、ヨガ、瞑想",
                environment: "プレッシャーのない安心できる場所",
                support: "見守ってくれる理解者の存在"
            }
        },
        
        // 3つのOSの関係
        osBalance: {
            idealBalance: "支援40% : 共感35% : 自己保護25%",
            whenBalanced: "組織の要として、持続的な成長を支える存在",
            whenImbalanced: "自己犠牲による疲弊、または過度な引きこもり",
            tip: "支援→自己ケア→再び支援 の健全なサイクルを保とう"
        }
    },
    
    // ============================================
    // 58. 兌為澤 - エンターテイナー型
    // ============================================
    "兌為澤": {
        id: 58,
        symbol: "☱",
        element: "澤",
        nickname: "エンターテイナー",
        emoji: "🎉",
        
        // 🔥 心のエンジンとして動く時
        asEngineOS: {
            // どんなエンジン？
            profile: {
                type: "喜び創造エンジン",
                description: "人生を楽しみ、周囲も楽しませることが原動力",
                metaphor: "フェスティバルの企画者のような、場を盛り上げる才能"
            },
            
            // いつもの状態
            normalState: {
                whatHappens: "どうすればもっと楽しくなるか常に模索",
                example: "定例会議も『どうやったら活気づくか』を考える",
                energyLevel: "🔋🔋🔋 (60%) - 楽しさセンサー常時起動"
            },
            
            // やる気MAXの時
            superMode: {
                when: "場の雰囲気が重い、モチベーションが下がっている時",
                whatHappens: "プロのエンターテイナーモード発動",
                example: "プロジェクト失敗後の暗い雰囲気を、ユーモアと前向きさで転換",
                energyLevel: "🔋🔋🔋🔋🔋 (95%) - 最高のパフォーマンス"
            },
            
            // 休憩中
            restMode: {
                whatHappens: "次の楽しみを探索",
                howToRest: "エンタメコンテンツ鑑賞、新しい体験の発見",
                note: "退屈は最大の敵。常に刺激を求めている"
            },
            
            // エンジンのお手入れ方法
            maintenance: {
                whatYouNeed: "笑い、新鮮な刺激、ポジティブな交流",
                howToCharge: "イベント参加、新しい人との出会い、創造的活動",
                warning: "単調な作業や深刻な雰囲気が続くと消耗",
                tip: "日々の中に小さな楽しみを散りばめよう"
            }
        },
        
        // 🌐 人と接する時のモード
        asInterfaceOS: {
            // どんな接し方？
            profile: {
                type: "ムードメーカー型",
                description: "場を明るくし、人々を繋げる存在",
                metaphor: "優秀なイベントMCやパーティーホストのような役割"
            },
            
            // コミュニケーションスタイル
            howToTalk: {
                style: "明るく軽快、ユーモアを交えた会話",
                example: "『それ面白いね！もっと聞かせて』と相手を乗せる",
                goodAt: "アイスブレイク、ネットワーキング、場の活性化",
                notGoodAt: "深刻な相談、長時間の傾聴、重い話題"
            },
            
            // 相性のいい環境
            bestEnvironment: {
                where: "創造性と活気を重視する環境",
                example: "マーケティング、広報、イベント企画、クリエイティブ業界",
                withWho: "楽しむことを大切にする仲間",
                avoid: "形式的で堅苦しい環境"
            },
            
            // 人間関係のコツ
            relationshipTips: {
                strength: "誰とでもすぐに打ち解けられる社交性",
                weakness: "深い関係構築が苦手、表面的になりがち",
                advice: "時には真剣な話も。深い絆も大切にしよう"
            }
        },
        
        // 🛡️ ピンチの時の守り方
        asSafeModeOS: {
            // どんな守り方？
            profile: {
                type: "ポジティブ転換型",
                description: "ネガティブを楽しさで上書きする",
                metaphor: "コメディアンが失敗をネタにするような対処法"
            },
            
            // ストレスへの対処法
            stressResponse: {
                whatYouDo: "楽しい活動で気分転換",
                example: "プレゼン失敗 → 仲間と飲みに行って笑い話に",
                goodPoint: "素早い気持ちの切り替え、前向きな雰囲気作り",
                badPoint: "根本的な問題を見過ごすことがある"
            },
            
            // 緊急時の行動
            emergencyMode: {
                whatHappens: "無理にでも明るく振る舞う",
                example: "内心は不安 → でも『大丈夫、なんとかなる！』",
                recovery: "楽しいイベントや交流で充電",
                timeToRecover: "1-2日（楽しいことがあればすぐ回復）"
            },
            
            // 回復方法
            howToRecover: {
                bestWay: "社交的なイベントや楽しい活動",
                example: "パーティー、ライブ、旅行、新しい体験",
                environment: "活気があり刺激的な場所",
                support: "一緒に楽しんでくれる仲間"
            }
        },
        
        // 3つのOSの関係
        osBalance: {
            idealBalance: "楽しさ45% : 社交40% : ポジティブ思考15%",
            whenBalanced: "周囲を明るくしながら、自分も心から楽しめる",
            whenImbalanced: "深みのない関係、または無理な明るさで疲弊",
            tip: "楽しむ→深める→また楽しむ のバランスを意識しよう"
        }
    }
};

// ===============================================
// 使いやすい関数たち
// ===============================================

/**
 * あなたのOSの特徴を教えてくれる関数
 * @param {string|number} hexagram - 易卦の名前か番号
 * @param {string} osType - 'engine'（エンジン）, 'interface'（人との接し方）, 'safemode'（守り方）
 * @returns {Object} そのOSの詳しい情報
 */
window.getMyOSInfo = function(hexagram, osType) {
    const idMap = {
        1: "乾為天",
        2: "坤為地", 
        58: "兌為澤"
    };
    
    let hexagramName = typeof hexagram === 'number' ? idMap[hexagram] : hexagram;
    const data = HexagramHumanTraitsV3[hexagramName];
    
    if (!data) {
        return {
            error: "このデータはまだ準備中です",
            available: "現在は乾為天(1)、坤為地(2)、兌為澤(58)が利用可能"
        };
    }
    
    const osTypeMap = {
        'engine': 'asEngineOS',
        'interface': 'asInterfaceOS',
        'safemode': 'asSafeModeOS',
        'safe': 'asSafeModeOS'
    };
    
    const osKey = osTypeMap[osType?.toLowerCase()];
    if (!osKey) {
        return {
            error: "OSタイプは 'engine', 'interface', 'safemode' のいずれかを指定してください"
        };
    }
    
    return {
        name: hexagramName,
        nickname: data.nickname,
        emoji: data.emoji,
        osType: osType,
        data: data[osKey],
        balance: data.osBalance
    };
};

/**
 * あなたの3つのOSから、総合的な性格を分析する関数
 * @param {Object} myOS - {engine: 番号, interface: 番号, safeMode: 番号}
 * @returns {Object} あなたの総合プロファイル
 */
window.getMyPersonality = function(myOS) {
    const engine = window.getMyOSInfo(myOS.engine, 'engine');
    const interface_ = window.getMyOSInfo(myOS.interface, 'interface');
    const safeMode = window.getMyOSInfo(myOS.safeMode, 'safemode');
    
    if (engine.error || interface_.error || safeMode.error) {
        return {
            error: "OSの情報が不足しています。入力を確認してください。"
        };
    }
    
    return {
        // あなたはこんな人
        summary: `${engine.emoji} ${engine.nickname}の原動力を持ち、` +
                `${interface_.emoji} ${interface_.nickname}として人と関わり、` +
                `${safeMode.emoji} ${safeMode.nickname}の守り方をする人`,
        
        // 詳しい説明
        detail: {
            innerWorld: `内面では${engine.data.profile.description}`,
            socialLife: `社会では${interface_.data.profile.description}`,
            defense: `危機の際は${safeMode.data.profile.description}`
        },
        
        // 日常での行動パターン
        dailyLife: {
            normalDay: `普段は${engine.data.normalState.whatHappens}`,
            withPeople: `人と接する時は${interface_.data.howToTalk.style}`,
            underPressure: `プレッシャーを感じたら${safeMode.data.stressResponse.whatYouDo}`
        },
        
        // 成長のためのアドバイス
        advice: {
            strength: "あなたの強み：" +
                     `${engine.data.profile.type}による推進力、` +
                     `${interface_.data.profile.type}の対人スキル、` +
                     `${safeMode.data.profile.type}の回復力`,
            
            improvement: "さらなる成長のために：" +
                        `${engine.data.maintenance.tip} ` +
                        `${interface_.data.relationshipTips.advice} ` +
                        `${safeMode.data.howToRecover.support}が重要`,
            
            balance: "理想的なバランス：" +
                    "内的動機、社会的調和、自己保護のすべてを大切に"
        }
    };
};

// 簡単な使い方ガイド
window.howToUseThis = function() {
    console.log(`
🎮 Triple OS システムの使い方

1. まず、あなたの3つのOSを選択
   - Engine OS: あなたの原動力は？
   - Interface OS: どう人と関わる？
   - SafeMode OS: どう自分を守る？

2. 分析関数を実行
   
   // 例：Engine=乾為天(1)、Interface=兌為澤(58)、SafeMode=坤為地(2)
   const myProfile = getMyPersonality({
       engine: 1,
       interface: 58,
       safeMode: 2
   });
   
   console.log(myProfile.summary);
   console.log(myProfile.advice);

3. 各OSの詳細を確認
   
   const engineInfo = getMyOSInfo(1, 'engine');
   console.log(engineInfo.data.profile);

あなたの「取扱説明書」として活用してください！🌟
    `);
};

// グローバル公開
window.HexagramHumanTraitsV3 = HexagramHumanTraitsV3;

// 起動メッセージ
console.log('🎮 Triple OS v3.0 が起動しました');
console.log('💡 使い方：howToUseThis() を実行してください');
console.log('📝 利用可能な易卦：乾為天(1)、坤為地(2)、兌為澤(58)');