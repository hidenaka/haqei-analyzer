/**
 * Triple OS 人格システムデータベース v2.0
 * 
 * HaQei哲学に基づく3つのOSコンセプト:
 * - Engine OS: 内的原動力システム（価値観・動機・内なる衝動）
 * - Interface OS: 社会接続システム（対人関係・コミュニケーション・外部との接点）
 * - SafeMode OS: 防御保護システム（危機管理・ストレス対応・セーフティネット）
 * 
 * 各易卦は、どのOSとして動作するかによって異なる特性を発揮する
 * 
 * @author Claude Code
 * @date 2025-01-19
 * @version 2.0.0
 */

const HexagramHumanTraitsV2 = {
    // ============================================
    // 1. 乾為天 - Creative Force System
    // ============================================
    "乾為天": {
        id: 1,
        symbol: "☰",
        element: "天",
        systemName: "Creative Force System",
        
        // Engine OSとして動作する場合
        asEngineOS: {
            systemProfile: {
                version: "創造駆動エンジン v1.0",
                coreDriver: "革新への内的衝動",
                bootSequence: "未知の可能性を感知すると自動起動",
                primaryProcess: "既存の枠組みを超える発想の連続生成"
            },
            runtime: {
                normalMode: {
                    process: "常に新しいアイデアを背景処理で生成",
                    cpuUsage: "60-70%（常時アイデア生成プロセス実行）",
                    output: "革新的ビジョン、突破口となる発想"
                },
                highLoadMode: {
                    trigger: "困難な課題や停滞状況に直面",
                    process: "全リソースを創造的解決に集中投下",
                    cpuUsage: "95-100%（フル稼働）",
                    output: "ブレイクスルー、パラダイムシフト"
                },
                idleMode: {
                    state: "次の創造機会を待機",
                    background: "内的ビジョンの精錬と統合",
                    energyConsumption: "低（充電モード）"
                }
            },
            maintenance: {
                energySource: "新しい挑戦、未踏領域への進出",
                debugMethod: "創造的活動の時間確保、インスピレーション源への接触",
                errorHandling: "停滞感 → 環境変更、新プロジェクト着手",
                updateCycle: "3ヶ月ごとに大きな創造的チャレンジが必要"
            },
            systemCall: {
                primary: "CREATE_NEW_PARADIGM()",
                secondary: "BREAK_THROUGH_LIMITS()",
                emergency: "FORCE_INNOVATION()"
            }
        },
        
        // Interface OSとして動作する場合
        asInterfaceOS: {
            systemProfile: {
                version: "ビジョナリーリーダー通信 v1.0",
                protocol: "直接的・インスピレーション型",
                connectionType: "一対多のブロードキャスト型",
                bandwidth: "高速・大容量（ビジョンの共有）"
            },
            communication: {
                normalMode: {
                    style: "明確な方向性を示すトップダウン型",
                    transmission: "ビジョンと戦略の発信",
                    reception: "大局的なフィードバックのみ受信"
                },
                socialAPI: {
                    leadership: "カリスマ的リーダーシップの発揮",
                    collaboration: "目標達成に向けた強力な牽引",
                    networking: "革新者ネットワークの構築"
                },
                compatibility: {
                    bestMatch: "変革を求める環境、イノベーション重視の組織",
                    challenges: "保守的環境、細かい調整が必要な状況",
                    optimization: "フォロワー型の人材との組み合わせ"
                }
            },
            errorHandling: {
                communicationBreakdown: "より強いビジョンの再提示",
                misunderstanding: "具体例を用いた明確化",
                conflict: "目標の再定義による方向性統一"
            }
        },
        
        // SafeMode OSとして動作する場合
        asSafeModeOS: {
            systemProfile: {
                version: "攻撃的防御システム v1.0",
                strategy: "最大の防御は攻撃",
                activationTrigger: "成長の停滞、創造性の抑圧",
                priority: "自由と独立性の確保"
            },
            defenseMode: {
                threatResponse: {
                    stagnation: "新規プロジェクトで突破",
                    restriction: "ルールを変える、新領域へ移動",
                    criticism: "実績による証明、更なる高みへ"
                },
                stressProcessing: {
                    method: "前進による解決",
                    copingStyle: "新しい挑戦で既存の問題を相対化",
                    recovery: "創造的活動による精神的リセット"
                },
                emergencyProtocol: {
                    isolation: "独立独走モード起動",
                    overwhelm: "優先順位の大胆な再設定",
                    burnout: "完全新規環境への移行"
                }
            },
            systemRecovery: {
                method: "創造的破壊と再構築",
                timeframe: "短期集中型（1-2週間で転換）",
                requirement: "完全な自由と裁量権"
            }
        },
        
        // OS間の相互作用
        osInteraction: {
            engineToInterface: "内的ビジョンを外部に発信する際の変換効率",
            interfaceToSafeMode: "社会的圧力を創造的エネルギーに転換",
            safeModeToEngine: "危機を新たな創造の起点として活用",
            balance: "創造60%：社交25%：防御15%が理想的"
        }
    },
    
    // ============================================
    // 2. 坤為地 - Nurturing Support System
    // ============================================
    "坤為地": {
        id: 2,
        symbol: "☷",
        element: "地",
        systemName: "Nurturing Support System",
        
        // Engine OSとして動作する場合
        asEngineOS: {
            systemProfile: {
                version: "育成支援エンジン v1.0",
                coreDriver: "他者の成長と全体の調和",
                bootSequence: "支援が必要な状況を検知すると起動",
                primaryProcess: "環境の安定化と成長基盤の構築"
            },
            runtime: {
                normalMode: {
                    process: "継続的な環境モニタリングと微調整",
                    cpuUsage: "40-50%（安定的な背景処理）",
                    output: "調和的環境、成長を支える基盤"
                },
                highLoadMode: {
                    trigger: "チームの危機、関係性の破綻リスク",
                    process: "全方位的な支援と調整",
                    cpuUsage: "80-90%（献身的サポート）",
                    output: "関係修復、チーム再生"
                },
                idleMode: {
                    state: "静かな見守りと待機",
                    background: "エネルギーの蓄積と内省",
                    energyConsumption: "極低（省エネモード）"
                }
            },
            maintenance: {
                energySource: "他者の成長と感謝、調和の実現",
                debugMethod: "自己ケアの時間確保、境界線の明確化",
                errorHandling: "疲弊 → 一時的な撤退と充電",
                updateCycle: "日常的な小さな充電が必要"
            },
            systemCall: {
                primary: "NURTURE_GROWTH()",
                secondary: "MAINTAIN_HARMONY()",
                emergency: "STABILIZE_ENVIRONMENT()"
            }
        },
        
        // Interface OSとして動作する場合
        asInterfaceOS: {
            systemProfile: {
                version: "共感的サポート通信 v1.0",
                protocol: "受容的・非言語重視型",
                connectionType: "多対多のメッシュ型",
                bandwidth: "中速・持続的（深い理解の構築）"
            },
            communication: {
                normalMode: {
                    style: "傾聴と共感を基本とする双方向型",
                    transmission: "サポートと励ましのメッセージ",
                    reception: "全方位からの情報を受信・統合"
                },
                socialAPI: {
                    support: "感情的サポートの提供",
                    mediation: "対立の調停と和解促進",
                    teamBuilding: "信頼関係の構築と維持"
                },
                compatibility: {
                    bestMatch: "協調性重視の環境、チームワーク中心の活動",
                    challenges: "競争的環境、即断即決が求められる状況",
                    optimization: "リーダー型の人材との補完関係"
                }
            },
            errorHandling: {
                communicationBreakdown: "時間をかけた関係修復",
                misunderstanding: "非言語的な理解の試み",
                conflict: "全員が納得できる妥協点の探索"
            }
        },
        
        // SafeMode OSとして動作する場合
        asSafeModeOS: {
            systemProfile: {
                version: "受容的保護システム v1.0",
                strategy: "包み込みによる保護",
                activationTrigger: "攻撃性の検知、環境の不安定化",
                priority: "全体の安定と持続性"
            },
            defenseMode: {
                threatResponse: {
                    aggression: "柔軟な受け流しと吸収",
                    chaos: "静かな中心としての安定提供",
                    isolation: "つながりの維持と包摂"
                },
                stressProcessing: {
                    method: "受容と統合による解消",
                    copingStyle: "問題を抱え込み、時間をかけて処理",
                    recovery: "自然との接触、静寂の中での回復"
                },
                emergencyProtocol: {
                    overload: "一時的な引きこもりモード",
                    boundary_violation: "静かだが確固たる境界設定",
                    exhaustion: "完全休息モードへの移行"
                }
            },
            systemRecovery: {
                method: "ゆっくりとした自然回復",
                timeframe: "長期的（1-3ヶ月かけて回復）",
                requirement: "安全で支持的な環境"
            }
        },
        
        // OS間の相互作用
        osInteraction: {
            engineToInterface: "内的調和を外部関係に展開",
            interfaceToSafeMode: "社会的疲労を受容力で処理",
            safeModeToEngine: "保護本能を育成力に昇華",
            balance: "育成40%：社交35%：防御25%が理想的"
        }
    },
    
    // ============================================
    // 58. 兌為澤 - Joyful Connection System
    // ============================================
    "兌為澤": {
        id: 58,
        symbol: "☱",
        element: "澤",
        systemName: "Joyful Connection System",
        
        // Engine OSとして動作する場合
        asEngineOS: {
            systemProfile: {
                version: "喜び生成エンジン v1.0",
                coreDriver: "楽しさと喜びの追求",
                bootSequence: "ポジティブな可能性を感知すると即起動",
                primaryProcess: "あらゆる状況から楽しさを抽出・増幅"
            },
            runtime: {
                normalMode: {
                    process: "継続的な喜びの発見と共有",
                    cpuUsage: "50-60%（軽快な処理）",
                    output: "ポジティブな雰囲気、楽しいアイデア"
                },
                highLoadMode: {
                    trigger: "停滞した雰囲気、ネガティブな環境",
                    process: "積極的なムードメイキング",
                    cpuUsage: "85-95%（エンターテイナーモード）",
                    output: "場の空気の転換、笑いと活気"
                },
                idleMode: {
                    state: "次の楽しみを探索",
                    background: "エンターテインメント情報の収集",
                    energyConsumption: "中（常に何か面白いものを探している）"
                }
            },
            maintenance: {
                energySource: "笑い、楽しい交流、新しい刺激",
                debugMethod: "遊びの時間、エンターテインメント摂取",
                errorHandling: "退屈 → 新しい楽しみの積極的探索",
                updateCycle: "毎日新しい楽しみが必要"
            },
            systemCall: {
                primary: "GENERATE_JOY()",
                secondary: "SPREAD_HAPPINESS()",
                emergency: "FORCE_POSITIVE_MOOD()"
            }
        },
        
        // Interface OSとして動作する場合
        asInterfaceOS: {
            systemProfile: {
                version: "社交的エンターテイナー通信 v1.0",
                protocol: "明るく軽快な交流型",
                connectionType: "多対多の活発な交流型",
                bandwidth: "高速・多チャンネル（同時多発的交流）"
            },
            communication: {
                normalMode: {
                    style: "ユーモアと親しみやすさを基調",
                    transmission: "楽しい話題、ポジティブな情報",
                    reception: "すべてを楽しい角度から解釈"
                },
                socialAPI: {
                    entertainment: "場を盛り上げる能力",
                    networking: "幅広い人脈の構築と維持",
                    moodMaking: "ポジティブな雰囲気の創出"
                },
                compatibility: {
                    bestMatch: "創造的環境、社交的な活動、エンタメ業界",
                    challenges: "厳粛な環境、深刻な問題解決場面",
                    optimization: "真面目な人材との相互補完"
                }
            },
            errorHandling: {
                communicationBreakdown: "ユーモアで緊張緩和",
                misunderstanding: "軽い雰囲気で仕切り直し",
                conflict: "共通の楽しみを見つけて和解"
            }
        },
        
        // SafeMode OSとして動作する場合
        asSafeModeOS: {
            systemProfile: {
                version: "楽観的回避システム v1.0",
                strategy: "楽しさによる問題の相対化",
                activationTrigger: "深刻さ、重苦しさの増大",
                priority: "精神的な軽やかさの維持"
            },
            defenseMode: {
                threatResponse: {
                    negativity: "ポジティブな再解釈",
                    seriousness: "ユーモアによる緊張緩和",
                    depression: "楽しい活動への強制シフト"
                },
                stressProcessing: {
                    method: "楽しいことへの注意転換",
                    copingStyle: "問題を軽く捉えて乗り越える",
                    recovery: "エンターテインメント、社交活動"
                },
                emergencyProtocol: {
                    overwhelm: "表面的な明るさで乗り切る",
                    isolation: "積極的な社交活動の開始",
                    sadness: "強制的なポジティブモード"
                }
            },
            systemRecovery: {
                method: "楽しい活動による気分転換",
                timeframe: "短期（数日で回復）",
                requirement: "楽しい仲間と刺激的な環境"
            }
        },
        
        // OS間の相互作用
        osInteraction: {
            engineToInterface: "内的な喜びを社交的魅力に変換",
            interfaceToSafeMode: "社交疲れを楽しさで中和",
            safeModeToEngine: "防御を遊び心に転換",
            balance: "喜び45%：社交40%：防御15%が理想的"
        }
    }
};

// ===============================================
// グローバル関数：OSタイプに応じた特性取得
// ===============================================

/**
 * 指定された易卦が特定のOSとして動作する場合の特性を取得
 * @param {string|number} hexagramIdentifier - 易卦名または番号
 * @param {string} osType - 'engine', 'interface', 'safeMode'のいずれか
 * @returns {Object} OS特性データ
 */
window.getHexagramOSTraits = function(hexagramIdentifier, osType) {
    // 番号から卦名への変換マップ（必要な3つのみ）
    const idMap = {
        1: "乾為天",
        2: "坤為地",
        58: "兌為澤"
    };
    
    let hexagramName;
    if (typeof hexagramIdentifier === 'number') {
        hexagramName = idMap[hexagramIdentifier];
    } else {
        hexagramName = hexagramIdentifier;
    }
    
    const hexagramData = HexagramHumanTraitsV2[hexagramName];
    if (!hexagramData) {
        console.warn(`⚠️ v2データが見つかりません: ${hexagramName}`);
        return null;
    }
    
    // OSタイプに応じてデータを返す
    switch(osType?.toLowerCase()) {
        case 'engine':
            return {
                name: hexagramName,
                systemName: hexagramData.systemName,
                osType: 'Engine OS',
                data: hexagramData.asEngineOS
            };
        case 'interface':
            return {
                name: hexagramName,
                systemName: hexagramData.systemName,
                osType: 'Interface OS',
                data: hexagramData.asInterfaceOS
            };
        case 'safemode':
        case 'safe':
            return {
                name: hexagramName,
                systemName: hexagramData.systemName,
                osType: 'SafeMode OS',
                data: hexagramData.asSafeModeOS
            };
        default:
            // OSタイプ指定なしの場合は全データを返す
            return hexagramData;
    }
};

/**
 * 3つのOSの組み合わせから統合的な人格プロファイルを生成
 * @param {Object} tripleOS - {engine: 卦ID, interface: 卦ID, safeMode: 卦ID}
 * @returns {Object} 統合プロファイル
 */
window.generateIntegratedProfile = function(tripleOS) {
    const engineData = window.getHexagramOSTraits(tripleOS.engine, 'engine');
    const interfaceData = window.getHexagramOSTraits(tripleOS.interface, 'interface');
    const safeModeData = window.getHexagramOSTraits(tripleOS.safeMode, 'safemode');
    
    if (!engineData || !interfaceData || !safeModeData) {
        console.warn('⚠️ 一部のOSデータが取得できません');
        return null;
    }
    
    return {
        summary: `あなたは${engineData.data.systemProfile.coreDriver}を内的原動力とし、` +
                `${interfaceData.data.systemProfile.protocol}で社会と接続し、` +
                `${safeModeData.data.systemProfile.strategy}で自己を守る統合システムです。`,
        
        osBalance: {
            engine: engineData,
            interface: interfaceData,
            safeMode: safeModeData
        },
        
        operatingGuide: {
            normalOperation: `通常時は${interfaceData.data.communication.normalMode.style}で人と関わりながら、` +
                           `${engineData.data.runtime.normalMode.process}を続けています。`,
            
            stressResponse: `ストレス時には${safeModeData.data.defenseMode.stressProcessing.method}で対処し、` +
                           `${engineData.data.runtime.highLoadMode.process}で突破を図ります。`,
            
            maintenance: `エネルギー補充には${engineData.data.maintenance.energySource}が必要で、` +
                        `${interfaceData.data.communication.socialAPI}を活用し、` +
                        `${safeModeData.data.systemRecovery.requirement}を確保することが重要です。`
        },
        
        optimization: {
            tip1: "3つのOSのバランスを意識し、状況に応じて適切なOSを前面に出す",
            tip2: "各OSのメンテナンス要求を理解し、定期的なケアを行う",
            tip3: "OS間の相互作用を活用し、弱点を他のOSで補完する"
        }
    };
};

// グローバル公開
window.HexagramHumanTraitsV2 = HexagramHumanTraitsV2;

// 初期化ログ
console.log('✅ hexagram-human-traits-v2.js: Triple OS形式データを公開しました');
console.log('   - window.getHexagramOSTraits(hexagram, osType)');
console.log('   - window.generateIntegratedProfile(tripleOS)');
console.log('   - パイロット版: 乾為天、坤為地、兌為澤の3卦のみ実装');