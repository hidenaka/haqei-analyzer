// HexagramActionThemeCatalog.js - 64卦の核心的行動テーマカタログ
// 易経の正統な解釈に基づく抽象的行動定義

/**
 * 64卦の核心的行動テーマカタログ
 * 
 * 目的：
 * - 各卦の本質的テーマに基づく抽象的行動の定義
 * - 積極的・消極的・代替的行動パターンの整理
 * - os_analyzer + future_simulator統合のための基盤
 * 
 * 入力：
 * - hexagramNumber: 卦番号（1-64）
 * 
 * 処理内容：
 * 1. 卦の核心テーマの定義
 * 2. 3種類の行動パターン生成
 * 3. 変化傾向の設定
 * 
 * 出力：
 * - actionTheme: 行動テーマオブジェクト
 * 
 * 副作用：
 * - なし
 * 
 * 前提条件：
 * - ClassicalIChingStandardsとの整合性
 * 
 * エラー処理：
 * - 無効な卦番号：デフォルトテーマを返す
 */

class HexagramActionThemeCatalog {
  constructor() {
    this.initializeCatalog();
  }

  initializeCatalog() {
    console.log("🎯 Initializing Hexagram Action Theme Catalog...");
    
    // 64卦の行動テーマ定義
    this.actionThemes = this.defineActionThemes();
    
    // 行動タイプの定義
    this.actionTypes = {
      positive: "積極的行動（テーマに沿う）",
      negative: "消極的行動（テーマと逆）",
      alternative: "代替的行動（別の視点）"
    };
    
    // 変化傾向マトリックス
    this.transformationTendencies = this.buildTransformationTendencies();
    
    console.log("✅ Action Theme Catalog initialized with 64 hexagrams");
  }

  /**
   * 64卦の行動テーマ定義
   */
  defineActionThemes() {
    return {
      1: { // 乾為天
        name: "乾為天",
        theme: "創造・開拓",
        coreEssence: "天の如く力強く、創造的に前進する",
        abstractActions: {
          positive: {
            label: "積極的に創造する",
            description: "新しいものを生み出し、先頭に立って道を開く",
            tendency: "リーダーシップの発揮"
          },
          negative: {
            label: "創造を控える",
            description: "既存の枠組みに留まり、新しい挑戦を避ける",
            tendency: "保守的な姿勢"
          },
          alternative: {
            label: "既存の枠組みを活用する",
            description: "創造よりも改良に焦点を当て、着実に前進する",
            tendency: "現実的な発展"
          }
        },
        transformationTendency: {
          進爻: "創造力の段階的成熟",
          変爻: "受容への転換可能性",
          錯卦: "完全な受動性への反転",
          綜卦: "創造される側の視点",
          互卦: "内なる葛藤の顕在化"
        }
      },
      
      2: { // 坤為地
        name: "坤為地",
        theme: "受容・順応",
        coreEssence: "大地の如く全てを受け入れ、育む",
        abstractActions: {
          positive: {
            label: "全てを受け入れる",
            description: "来るものを拒まず、柔軟に対応する",
            tendency: "包容力の発揮"
          },
          negative: {
            label: "選択的に受容する",
            description: "必要なものだけを受け入れ、他を拒む",
            tendency: "防御的な姿勢"
          },
          alternative: {
            label: "能動的に環境を変える",
            description: "受け入れるだけでなく、環境に働きかける",
            tendency: "積極的な調整"
          }
        },
        transformationTendency: {
          進爻: "受容力の深化",
          変爻: "能動性への転換",
          錯卦: "完全な創造性への反転",
          綜卦: "与える側の視点",
          互卦: "内なる強さの発見"
        }
      },
      
      3: { // 水雷屯
        name: "水雷屯",
        theme: "始動・困難",
        coreEssence: "生まれたばかりの困難を乗り越える",
        abstractActions: {
          positive: {
            label: "困難に立ち向かう",
            description: "初期の障害を恐れず、勇気を持って前進",
            tendency: "挑戦的な姿勢"
          },
          negative: {
            label: "困難を避ける",
            description: "障害を前に立ち止まり、機会を待つ",
            tendency: "慎重な姿勢"
          },
          alternative: {
            label: "協力者を探す",
            description: "一人で立ち向かわず、支援を求める",
            tendency: "協調的な解決"
          }
        },
        transformationTendency: {
          進爻: "困難克服の段階的進展",
          変爻: "安定への転換",
          錯卦: "完全な安定への反転",
          綜卦: "支援する側の視点",
          互卦: "内なる可能性の発見"
        }
      },
      
      4: { // 山水蒙
        name: "山水蒙",
        theme: "無知・学習",
        coreEssence: "霧に包まれた状態から知恵を求める",
        abstractActions: {
          positive: {
            label: "積極的に学ぶ",
            description: "無知を認め、謙虚に教えを求める",
            tendency: "向学心の発揮"
          },
          negative: {
            label: "学びを拒む",
            description: "現状の知識に満足し、新しい学びを避ける",
            tendency: "固執的な姿勢"
          },
          alternative: {
            label: "経験から学ぶ",
            description: "教えよりも実践を通じて理解を深める",
            tendency: "体験的な成長"
          }
        },
        transformationTendency: {
          進爻: "理解の段階的深化",
          変爻: "教える側への転換",
          錯卦: "完全な明晰への反転",
          綜卦: "教育者の視点",
          互卦: "内なる知恵の発見"
        }
      },
      
      5: { // 水天需
        name: "水天需",
        theme: "待機・準備",
        coreEssence: "雨を待つように、時機の到来を待つ",
        abstractActions: {
          positive: {
            label: "忍耐強く待つ",
            description: "焦らず時機を見極め、準備を整える",
            tendency: "戦略的忍耐"
          },
          negative: {
            label: "待たずに行動する",
            description: "待機を放棄し、即座に動き出す",
            tendency: "性急な行動"
          },
          alternative: {
            label: "準備しながら機会を探る",
            description: "待つだけでなく、積極的に状況を把握",
            tendency: "能動的待機"
          }
        },
        transformationTendency: {
          進爻: "待機の質的向上",
          変爻: "即座の行動への転換",
          錯卦: "性急さへの反転",
          綜卦: "待たせる側の視点",
          互卦: "内なる焦りと確信"
        }
      },
      
      6: { // 天水訟
        name: "天水訟",
        theme: "争い・対立",
        coreEssence: "正義を求めて争うが、和解を模索する",
        abstractActions: {
          positive: {
            label: "正当性を主張する",
            description: "自分の立場を明確にし、正義を求める",
            tendency: "主張的な姿勢"
          },
          negative: {
            label: "争いを避ける",
            description: "対立を回避し、妥協点を探る",
            tendency: "回避的な姿勢"
          },
          alternative: {
            label: "仲裁者を求める",
            description: "第三者の判断に委ね、公正な解決を図る",
            tendency: "中立的な解決"
          }
        },
        transformationTendency: {
          進爻: "対立の段階的解決",
          変爻: "和解への転換",
          錯卦: "完全な調和への反転",
          綜卦: "相手側の正義",
          互卦: "内なる葛藤の本質"
        }
      },
      
      7: { // 地水師
        name: "地水師",
        theme: "統率・組織",
        coreEssence: "規律ある集団を率いて目標を達成する",
        abstractActions: {
          positive: {
            label: "積極的に統率する",
            description: "リーダーシップを発揮し、組織を導く",
            tendency: "指導的な姿勢"
          },
          negative: {
            label: "統率を避ける",
            description: "責任を回避し、指揮を他に委ねる",
            tendency: "従属的な姿勢"
          },
          alternative: {
            label: "協調的に運営する",
            description: "独裁ではなく、合議制で進める",
            tendency: "民主的な運営"
          }
        },
        transformationTendency: {
          進爻: "統率力の成熟",
          変爻: "個人行動への転換",
          錯卦: "完全な無秩序への反転",
          綜卦: "統率される側の視点",
          互卦: "内なる規律の確立"
        }
      },
      
      8: { // 水地比
        name: "水地比",
        theme: "親和・協調",
        coreEssence: "水が地に親しむように、人々と協力する",
        abstractActions: {
          positive: {
            label: "積極的に親しむ",
            description: "心を開いて人々と繋がり、協力関係を築く",
            tendency: "親和的な姿勢"
          },
          negative: {
            label: "距離を保つ",
            description: "深い関わりを避け、独立性を維持",
            tendency: "独立的な姿勢"
          },
          alternative: {
            label: "選択的に協力する",
            description: "全てではなく、重要な関係に集中",
            tendency: "戦略的な協調"
          }
        },
        transformationTendency: {
          進爻: "親和性の深化",
          変爻: "独立への転換",
          錯卦: "完全な孤立への反転",
          綜卦: "協力を求める側の視点",
          互卦: "内なる信頼の構築"
        }
      },
      
      9: { // 風天小畜
        name: "風天小畜",
        theme: "抑制・蓄積",
        coreEssence: "小さな力で大きな流れを制御する",
        abstractActions: {
          positive: {
            label: "柔らかく制御する",
            description: "強制ではなく、穏やかに影響を与える",
            tendency: "柔軟な制御"
          },
          negative: {
            label: "制御を放棄する",
            description: "流れに任せ、介入を避ける",
            tendency: "放任的な姿勢"
          },
          alternative: {
            label: "部分的に調整する",
            description: "全体ではなく、重要な部分のみ制御",
            tendency: "選択的な介入"
          }
        },
        transformationTendency: {
          進爻: "制御力の向上",
          変爻: "解放への転換",
          錯卦: "完全な放任への反転",
          綜卦: "制御される側の視点",
          互卦: "内なる調整力"
        }
      },
      
      10: { // 天沢履
        name: "天沢履",
        theme: "礼節・慎重",
        coreEssence: "虎の尾を踏むような危険でも礼を守る",
        abstractActions: {
          positive: {
            label: "礼節を守って進む",
            description: "危険でも正しい作法で慎重に行動",
            tendency: "礼儀正しい行動"
          },
          negative: {
            label: "礼節を無視する",
            description: "形式を気にせず、直接的に行動",
            tendency: "無遠慮な行動"
          },
          alternative: {
            label: "状況に応じて調整",
            description: "礼節と実利のバランスを取る",
            tendency: "柔軟な対応"
          }
        },
        transformationTendency: {
          進爻: "礼節の洗練",
          変爻: "自由な行動への転換",
          錯卦: "完全な無礼への反転",
          綜卦: "礼を受ける側の視点",
          互卦: "内なる品格の確立"
        }
      },
      
      11: { // 地天泰
        name: "地天泰",
        theme: "調和・繁栄",
        coreEssence: "天地が交わり、万物が栄える理想状態",
        abstractActions: {
          positive: {
            label: "調和を維持する",
            description: "バランスを保ち、繁栄を継続させる",
            tendency: "維持的な姿勢"
          },
          negative: {
            label: "変革を促す",
            description: "現状に満足せず、さらなる変化を求める",
            tendency: "革新的な姿勢"
          },
          alternative: {
            label: "バランスを調整する",
            description: "完璧を求めず、適度な調和を保つ",
            tendency: "現実的な調整"
          }
        },
        transformationTendency: {
          進爻: "調和の深化",
          変爻: "不調和への転換",
          錯卦: "完全な混乱への反転",
          綜卦: "異なる調和の形",
          互卦: "内なる不安定要素"
        }
      },
      
      12: { // 天地否
        name: "天地否",
        theme: "閉塞・停滞",
        coreEssence: "天地が交わらず、万物が滞る困難期",
        abstractActions: {
          positive: {
            label: "現状を受け入れる",
            description: "閉塞を認め、内面を充実させる",
            tendency: "受容的な姿勢"
          },
          negative: {
            label: "突破を試みる",
            description: "閉塞を打ち破ろうと積極的に動く",
            tendency: "反抗的な姿勢"
          },
          alternative: {
            label: "迂回路を探す",
            description: "正面突破ではなく、別の道を模索",
            tendency: "創造的な回避"
          }
        },
        transformationTendency: {
          進爻: "閉塞の段階的解消",
          変爻: "開通への転換",
          錯卦: "完全な開放への反転",
          綜卦: "閉塞の別の見方",
          互卦: "内なる可能性"
        }
      },
      
      13: { // 天火同人
        name: "天火同人",
        theme: "協同・公平",
        coreEssence: "志を同じくする人々と公平に協力する",
        abstractActions: {
          positive: {
            label: "公平に協力する",
            description: "私心を捨て、共通の目的のために働く",
            tendency: "公平な協調"
          },
          negative: {
            label: "協力を拒む",
            description: "個人の利益を優先し、協力を避ける",
            tendency: "利己的な姿勢"
          },
          alternative: {
            label: "条件付きで協力",
            description: "完全ではなく、条件を設けて協力",
            tendency: "戦略的な協調"
          }
        },
        transformationTendency: {
          進爻: "協力の深化",
          変爻: "対立への転換",
          錯卦: "完全な分裂への反転",
          綜卦: "協力される側の視点",
          互卦: "内なる連帯感"
        }
      },
      
      14: { // 火天大有
        name: "火天大有",
        theme: "豊富・所有",
        coreEssence: "大いなる富と力を正しく所有し活用する",
        abstractActions: {
          positive: {
            label: "豊かさを分かち合う",
            description: "所有する富や力を社会のために活用",
            tendency: "利他的な活用"
          },
          negative: {
            label: "豊かさを独占する",
            description: "富や力を私的に蓄積し、共有しない",
            tendency: "独占的な姿勢"
          },
          alternative: {
            label: "戦略的に配分する",
            description: "全てではなく、効果的に富を配分",
            tendency: "計画的な活用"
          }
        },
        transformationTendency: {
          進爻: "豊かさの拡大",
          変爻: "欠乏への転換",
          錯卦: "完全な貧困への反転",
          綜卦: "富を求める側の視点",
          互卦: "内なる価値観"
        }
      },
      
      15: { // 地山謙
        name: "地山謙",
        theme: "謙虚・謙遜",
        coreEssence: "高い山が地の下にある謙虚な姿勢",
        abstractActions: {
          positive: {
            label: "謙虚に振る舞う",
            description: "能力を持ちながらも驕らず、低姿勢を保つ",
            tendency: "謙遜の美徳"
          },
          negative: {
            label: "自己主張する",
            description: "謙虚さを捨て、積極的に前に出る",
            tendency: "自己顕示"
          },
          alternative: {
            label: "適度に表現する",
            description: "過度な謙遜を避け、適切に自己表現",
            tendency: "バランスの取れた態度"
          }
        },
        transformationTendency: {
          進爻: "謙虚さの深化",
          変爻: "傲慢への転換",
          錯卦: "完全な傲慢への反転",
          綜卦: "謙虚を評価する側の視点",
          互卦: "内なる自信"
        }
      },
      
      16: { // 雷地豫
        name: "雷地豫",
        theme: "喜び・準備",
        coreEssence: "雷が地上に轟くような喜びと活気",
        abstractActions: {
          positive: {
            label: "喜びを表現する",
            description: "積極的に楽しみ、周囲に活気を与える",
            tendency: "楽観的な行動"
          },
          negative: {
            label: "喜びを抑制する",
            description: "感情を抑え、冷静さを保つ",
            tendency: "抑制的な姿勢"
          },
          alternative: {
            label: "適度に楽しむ",
            description: "過度にならず、節度ある喜びを持つ",
            tendency: "節度ある楽しみ"
          }
        },
        transformationTendency: {
          進爻: "喜びの成熟",
          変爻: "悲しみへの転換",
          錯卦: "完全な憂鬱への反転",
          綜卦: "喜びを与える側の視点",
          互卦: "内なる充実感"
        }
      },
      
      17: { // 沢雷随
        name: "沢雷随",
        theme: "随従・適応",
        coreEssence: "時勢に従い、柔軟に適応する",
        abstractActions: {
          positive: {
            label: "流れに従う",
            description: "状況を受け入れ、柔軟に対応する",
            tendency: "適応的な行動"
          },
          negative: {
            label: "流れに逆らう",
            description: "現状に抵抗し、独自の道を行く",
            tendency: "反抗的な姿勢"
          },
          alternative: {
            label: "選択的に従う",
            description: "全てではなく、重要な部分のみ従う",
            tendency: "主体的な適応"
          }
        },
        transformationTendency: {
          進爻: "適応力の向上",
          変爻: "主導への転換",
          錯卦: "完全な独立への反転",
          綜卦: "導く側の視点",
          互卦: "内なる判断力"
        }
      },
      
      18: { // 山風蠱
        name: "山風蠱",
        theme: "腐敗・改革",
        coreEssence: "腐敗した状況を認識し、改革する",
        abstractActions: {
          positive: {
            label: "積極的に改革する",
            description: "問題を直視し、根本から改善を図る",
            tendency: "改革的な行動"
          },
          negative: {
            label: "現状を維持する",
            description: "問題を見て見ぬふりをし、変化を避ける",
            tendency: "保守的な姿勢"
          },
          alternative: {
            label: "段階的に改善する",
            description: "急激ではなく、徐々に改革を進める",
            tendency: "漸進的な改革"
          }
        },
        transformationTendency: {
          進爻: "改革の進展",
          変爻: "安定への転換",
          錯卦: "完全な健全化への反転",
          綜卦: "改革される側の視点",
          互卦: "内なる浄化力"
        }
      },
      
      19: { // 地沢臨
        name: "地沢臨",
        theme: "臨機・接近",
        coreEssence: "上位者が下位者に臨み、導く",
        abstractActions: {
          positive: {
            label: "積極的に導く",
            description: "責任を持って人々を指導する",
            tendency: "指導的な行動"
          },
          negative: {
            label: "距離を置く",
            description: "関与を避け、人々から離れる",
            tendency: "回避的な姿勢"
          },
          alternative: {
            label: "共に歩む",
            description: "上から導くのではなく、共に進む",
            tendency: "協働的な指導"
          }
        },
        transformationTendency: {
          進爻: "指導力の成熟",
          変爻: "観察への転換",
          錯卦: "完全な隔離への反転",
          綜卦: "導かれる側の視点",
          互卦: "内なる威厳"
        }
      },
      
      20: { // 風地観
        name: "風地観",
        theme: "観察・洞察",
        coreEssence: "高い視点から全体を観察し、洞察する",
        abstractActions: {
          positive: {
            label: "深く観察する",
            description: "表面ではなく、本質を見極める",
            tendency: "洞察的な観察"
          },
          negative: {
            label: "観察を避ける",
            description: "見ることを避け、関心を持たない",
            tendency: "無関心な姿勢"
          },
          alternative: {
            label: "参与観察する",
            description: "外から見るだけでなく、中に入って観察",
            tendency: "体験的な理解"
          }
        },
        transformationTendency: {
          進爻: "洞察力の深化",
          変爻: "行動への転換",
          錯卦: "完全な盲目への反転",
          綜卦: "観察される側の視点",
          互卦: "内なる直感力"
        }
      },
      
      21: { // 火雷噬嗑
        name: "火雷噬嗑",
        theme: "断罪・決断",
        coreEssence: "障害を噛み砕き、断固として進む",
        abstractActions: {
          positive: {
            label: "断固として決断する",
            description: "躊躇せず、明確な判断を下す",
            tendency: "決断的な行動"
          },
          negative: {
            label: "決断を保留する",
            description: "判断を避け、曖昧な状態を維持",
            tendency: "優柔不断"
          },
          alternative: {
            label: "慎重に検討する",
            description: "即断ではなく、十分に検討してから決断",
            tendency: "熟慮型の判断"
          }
        },
        transformationTendency: {
          進爻: "決断力の向上",
          変爻: "寛容への転換",
          錯卦: "完全な優柔不断への反転",
          綜卦: "裁かれる側の視点",
          互卦: "内なる正義感"
        }
      },
      
      22: { // 山火賁
        name: "山火賁",
        theme: "装飾・文化",
        coreEssence: "内面の美を外面に表現する",
        abstractActions: {
          positive: {
            label: "美しく装飾する",
            description: "内面の価値を適切に表現する",
            tendency: "文化的な表現"
          },
          negative: {
            label: "装飾を排除する",
            description: "飾りを捨て、素朴さを追求",
            tendency: "簡素な姿勢"
          },
          alternative: {
            label: "本質を重視する",
            description: "装飾と本質のバランスを取る",
            tendency: "調和的な表現"
          }
        },
        transformationTendency: {
          進爻: "文化的洗練",
          変爻: "素朴への転換",
          錯卦: "完全な無装飾への反転",
          綜卦: "鑑賞する側の視点",
          互卦: "内なる美意識"
        }
      },
      
      23: { // 山地剥
        name: "山地剥",
        theme: "崩壊・剥落",
        coreEssence: "古いものが剥がれ落ち、新生を待つ",
        abstractActions: {
          positive: {
            label: "自然な崩壊を受け入れる",
            description: "終わりを認め、新しい始まりに備える",
            tendency: "受容的な態度"
          },
          negative: {
            label: "崩壊を防ごうとする",
            description: "終わりに抵抗し、現状維持を図る",
            tendency: "抵抗的な姿勢"
          },
          alternative: {
            label: "選択的に手放す",
            description: "全てではなく、不要な部分のみ手放す",
            tendency: "戦略的な整理"
          }
        },
        transformationTendency: {
          進爻: "崩壊の進行",
          変爻: "再生への転換",
          錯卦: "完全な再生への反転",
          綜卦: "崩壊を見守る側の視点",
          互卦: "内なる再生の種"
        }
      },
      
      24: { // 地雷復
        name: "地雷復",
        theme: "回復・復活",
        coreEssence: "一陽来復、新たな生命力が芽生える",
        abstractActions: {
          positive: {
            label: "積極的に回復を図る",
            description: "新しい始まりを歓迎し、活力を取り戻す",
            tendency: "再生的な行動"
          },
          negative: {
            label: "自然回復を待つ",
            description: "積極的な行動を控え、時の流れに任せる",
            tendency: "受動的な回復"
          },
          alternative: {
            label: "新しい形での再生",
            description: "元に戻すのではなく、新たな形を創造",
            tendency: "創造的な再生"
          }
        },
        transformationTendency: {
          進爻: "回復の進展",
          変爻: "停滞への転換",
          錯卦: "完全な終焉への反転",
          綜卦: "回復を支援する側の視点",
          互卦: "内なる生命力"
        }
      },
      
      25: { // 天雷无妄
        name: "天雷无妄",
        theme: "純真・無為",
        coreEssence: "作為なく自然に従い、純粋に行動する",
        abstractActions: {
          positive: {
            label: "自然に従う",
            description: "作為を捨て、天の意志に従う",
            tendency: "無為自然"
          },
          negative: {
            label: "計画的に行動する",
            description: "自然に任せず、意図的に動く",
            tendency: "作為的な行動"
          },
          alternative: {
            label: "直感と理性の調和",
            description: "自然さと計画性のバランスを取る",
            tendency: "調和的な行動"
          }
        },
        transformationTendency: {
          進爻: "純粋性の深化",
          変爻: "作為への転換",
          錯卦: "完全な計算への反転",
          綜卦: "純真を評価する側の視点",
          互卦: "内なる純粋性"
        }
      },
      
      26: { // 山天大畜
        name: "山天大畜",
        theme: "蓄積・抑制",
        coreEssence: "大きな力を蓄え、適切に制御する",
        abstractActions: {
          positive: {
            label: "力を蓄積する",
            description: "エネルギーを貯め、大きな成果に備える",
            tendency: "蓄積的な行動"
          },
          negative: {
            label: "力を解放する",
            description: "蓄積を避け、即座に力を使う",
            tendency: "即時的な行動"
          },
          alternative: {
            label: "段階的に活用する",
            description: "全てを貯めず、適度に力を使う",
            tendency: "計画的な活用"
          }
        },
        transformationTendency: {
          進爻: "蓄積の増大",
          変爻: "解放への転換",
          錯卦: "完全な消耗への反転",
          綜卦: "蓄積を求める側の視点",
          互卦: "内なる潜在力"
        }
      },
      
      27: { // 山雷頤
        name: "山雷頤",
        theme: "養育・栄養",
        coreEssence: "口を慎み、正しく養い育てる",
        abstractActions: {
          positive: {
            label: "丁寧に養育する",
            description: "言葉と行動を慎み、適切に育む",
            tendency: "養育的な行動"
          },
          negative: {
            label: "養育を怠る",
            description: "責任を放棄し、成長を妨げる",
            tendency: "放任的な姿勢"
          },
          alternative: {
            label: "自立を促す",
            description: "過保護を避け、自立を支援",
            tendency: "自立支援型"
          }
        },
        transformationTendency: {
          進爻: "養育力の向上",
          変爻: "自立への転換",
          錯卦: "完全な放任への反転",
          綜卦: "養われる側の視点",
          互卦: "内なる育成力"
        }
      },
      
      28: { // 沢風大過
        name: "沢風大過",
        theme: "過剰・限界",
        coreEssence: "限界を超えた状況で、大胆に行動する",
        abstractActions: {
          positive: {
            label: "限界に挑戦する",
            description: "危険を承知で、大胆な行動を取る",
            tendency: "挑戦的な行動"
          },
          negative: {
            label: "限界を避ける",
            description: "無理をせず、安全圏に留まる",
            tendency: "保守的な姿勢"
          },
          alternative: {
            label: "限界を見極める",
            description: "無謀ではなく、計算されたリスクを取る",
            tendency: "戦略的な挑戦"
          }
        },
        transformationTendency: {
          進爻: "限界への接近",
          変爻: "安定への転換",
          錯卦: "完全な安定への反転",
          綜卦: "限界を支える側の視点",
          互卦: "内なる強靭性"
        }
      },
      
      29: { // 坎為水
        name: "坎為水",
        theme: "険難・誠実",
        coreEssence: "重なる困難の中、誠実さを保つ",
        abstractActions: {
          positive: {
            label: "誠実に立ち向かう",
            description: "困難から逃げず、真摯に対処する",
            tendency: "誠実な対応"
          },
          negative: {
            label: "困難を回避する",
            description: "リスクを避け、安全な道を選ぶ",
            tendency: "回避的な姿勢"
          },
          alternative: {
            label: "困難を活用する",
            description: "逆境を成長の機会として捉える",
            tendency: "積極的な学習"
          }
        },
        transformationTendency: {
          進爻: "困難の深化と克服",
          変爻: "安楽への転換",
          錯卦: "完全な安楽への反転",
          綜卦: "困難を与える側の視点",
          互卦: "内なる誠実さ"
        }
      },
      
      30: { // 離為火
        name: "離為火",
        theme: "明智・付着",
        coreEssence: "明るい知恵で物事を照らし出す",
        abstractActions: {
          positive: {
            label: "明るく照らす",
            description: "知恵と洞察で真実を明らかにする",
            tendency: "啓発的な行動"
          },
          negative: {
            label: "光を消す",
            description: "真実を隠し、曖昧さを保つ",
            tendency: "隠蔽的な姿勢"
          },
          alternative: {
            label: "適度に照らす",
            description: "全てを明かさず、必要な部分のみ照らす",
            tendency: "選択的な開示"
          }
        },
        transformationTendency: {
          進爻: "明智の深化",
          変爻: "暗闇への転換",
          錯卦: "完全な暗闇への反転",
          綜卦: "照らされる側の視点",
          互卦: "内なる輝き"
        }
      },
      
      31: { // 沢山咸
        name: "沢山咸",
        theme: "感応・共鳴",
        coreEssence: "心が通じ合い、自然に感応する",
        abstractActions: {
          positive: {
            label: "積極的に感応する",
            description: "心を開いて、相手と深く繋がる",
            tendency: "共感的な行動"
          },
          negative: {
            label: "感応を抑制する",
            description: "感情を抑え、距離を保つ",
            tendency: "抑制的な姿勢"
          },
          alternative: {
            label: "選択的に共鳴する",
            description: "全てではなく、重要な関係のみ深める",
            tendency: "選択的な感応"
          }
        },
        transformationTendency: {
          進爻: "感応の深化",
          変爻: "無感動への転換",
          錯卦: "完全な無感動への反転",
          綜卦: "感応される側の体験",
          互卦: "内なる共感力"
        }
      },
      
      32: { // 雷風恒
        name: "雷風恒",
        theme: "恒常・持続",
        coreEssence: "変わらぬ道を守り、永続性を保つ",
        abstractActions: {
          positive: {
            label: "一貫性を保つ",
            description: "ぶれることなく、同じ道を進む",
            tendency: "持続的な行動"
          },
          negative: {
            label: "変化を求める",
            description: "一貫性を捨て、新しい道を探る",
            tendency: "変化志向"
          },
          alternative: {
            label: "柔軟に調整する",
            description: "基本は守りつつ、状況に応じて微調整",
            tendency: "適応的な持続"
          }
        },
        transformationTendency: {
          進爻: "持続性の強化",
          変爻: "変化への転換",
          錯卦: "完全な変動への反転",
          綜卦: "持続を求める側の視点",
          互卦: "内なる不変性"
        }
      },
      
      33: { // 天山遯
        name: "天山遯",
        theme: "退避・隠遁",
        coreEssence: "時を見て退き、力を温存する",
        abstractActions: {
          positive: {
            label: "賢明に退く",
            description: "無理な戦いを避け、戦略的に撤退",
            tendency: "戦略的撤退"
          },
          negative: {
            label: "退くことを拒む",
            description: "最後まで留まり、戦い続ける",
            tendency: "固執的な姿勢"
          },
          alternative: {
            label: "部分的に退く",
            description: "全面撤退ではなく、段階的に距離を取る",
            tendency: "段階的撤退"
          }
        },
        transformationTendency: {
          進爻: "退避の完成",
          変爻: "前進への転換",
          錯卦: "完全な前進への反転",
          綜卦: "追う側の視点",
          互卦: "内なる静寂"
        }
      },
      
      34: { // 雷天大壮
        name: "雷天大壮",
        theme: "強大・勢力",
        coreEssence: "力が充実し、大いに前進する",
        abstractActions: {
          positive: {
            label: "力強く前進する",
            description: "勢いを活かして積極的に進む",
            tendency: "積極的前進"
          },
          negative: {
            label: "力を抑制する",
            description: "勢いを控え、慎重に行動",
            tendency: "抑制的な姿勢"
          },
          alternative: {
            label: "力を調整する",
            description: "全力ではなく、状況に応じて力を配分",
            tendency: "計画的な力の使用"
          }
        },
        transformationTendency: {
          進爻: "力の増大",
          変爻: "弱体化への転換",
          錯卦: "完全な無力への反転",
          綜卦: "力に押される側の視点",
          互卦: "内なる真の力"
        }
      },
      
      35: { // 火地晋
        name: "火地晋",
        theme: "進展・昇進",
        coreEssence: "明るい知恵で着実に上昇する",
        abstractActions: {
          positive: {
            label: "着実に昇進する",
            description: "一歩一歩確実に上を目指す",
            tendency: "堅実な上昇"
          },
          negative: {
            label: "昇進を避ける",
            description: "現在の位置に満足し、上を目指さない",
            tendency: "現状維持"
          },
          alternative: {
            label: "横への展開を図る",
            description: "上ではなく、横に活動を広げる",
            tendency: "水平的発展"
          }
        },
        transformationTendency: {
          進爻: "昇進の加速",
          変爻: "下降への転換",
          錯卦: "完全な下降への反転",
          綜卦: "昇進させる側の視点",
          互卦: "内なる向上心"
        }
      },
      
      36: { // 地火明夷
        name: "地火明夷",
        theme: "暗黒・隠忍",
        coreEssence: "明るさを内に秘め、暗闇に耐える",
        abstractActions: {
          positive: {
            label: "内に光を保つ",
            description: "外は暗くとも、内なる明るさを守る",
            tendency: "内的維持"
          },
          negative: {
            label: "光を完全に消す",
            description: "希望を捨て、暗闇に同化する",
            tendency: "諦念的姿勢"
          },
          alternative: {
            label: "微かな光を灯す",
            description: "完全には隠さず、小さな希望を示す",
            tendency: "希望の維持"
          }
        },
        transformationTendency: {
          進爻: "忍耐の深化",
          変爻: "光明への転換",
          錯卦: "完全な光明への反転",
          綜卦: "暗闇を作る側の視点",
          互卦: "内なる不滅の光"
        }
      },
      
      37: { // 風火家人
        name: "風火家人",
        theme: "家庭・秩序",
        coreEssence: "家庭の秩序を正しく保つ",
        abstractActions: {
          positive: {
            label: "家庭を大切にする",
            description: "家族の絆を深め、秩序を維持",
            tendency: "家庭重視"
          },
          negative: {
            label: "家庭から離れる",
            description: "家族より個人や仕事を優先",
            tendency: "個人主義"
          },
          alternative: {
            label: "バランスを取る",
            description: "家庭と外の活動を両立させる",
            tendency: "調和的生活"
          }
        },
        transformationTendency: {
          進爻: "家庭の安定化",
          変爻: "分離への転換",
          錯卦: "完全な分離への反転",
          綜卦: "家庭に迎えられる側の視点",
          互卦: "内なる帰属意識"
        }
      },
      
      38: { // 火沢睽
        name: "火沢睽",
        theme: "乖離・対立",
        coreEssence: "離れ離れでも、根本では繋がる",
        abstractActions: {
          positive: {
            label: "違いを認める",
            description: "対立を受け入れ、多様性を尊重",
            tendency: "多様性の受容"
          },
          negative: {
            label: "統一を強制する",
            description: "違いを否定し、画一化を図る",
            tendency: "画一化志向"
          },
          alternative: {
            label: "共通点を探す",
            description: "違いの中にも共通項を見出す",
            tendency: "統合的アプローチ"
          }
        },
        transformationTendency: {
          進爻: "対立の深化と理解",
          変爻: "統合への転換",
          錯卦: "完全な統一への反転",
          綜卦: "対立する相手の視点",
          互卦: "内なる統一性"
        }
      },
      
      39: { // 水山蹇
        name: "水山蹇",
        theme: "困難・障害",
        coreEssence: "進退窮まる中で、正しい道を探る",
        abstractActions: {
          positive: {
            label: "困難に立ち向かう",
            description: "障害を恐れず、解決策を模索",
            tendency: "問題解決志向"
          },
          negative: {
            label: "困難を避ける",
            description: "障害を前に撤退し、別の道を探す",
            tendency: "回避的行動"
          },
          alternative: {
            label: "助けを求める",
            description: "一人で解決せず、協力を仰ぐ",
            tendency: "協力的解決"
          }
        },
        transformationTendency: {
          進爻: "困難の段階的克服",
          変爻: "円滑への転換",
          錯卦: "完全な円滑への反転",
          綜卦: "困難を与える側の視点",
          互卦: "内なる解決力"
        }
      },
      
      40: { // 雷水解
        name: "雷水解",
        theme: "解放・解決",
        coreEssence: "束縛から解放され、自由を得る",
        abstractActions: {
          positive: {
            label: "積極的に解放する",
            description: "束縛を断ち切り、自由を追求",
            tendency: "解放的行動"
          },
          negative: {
            label: "束縛に留まる",
            description: "安全な束縛を選び、自由を恐れる",
            tendency: "依存的姿勢"
          },
          alternative: {
            label: "段階的に解放する",
            description: "急激ではなく、徐々に自由を獲得",
            tendency: "漸進的解放"
          }
        },
        transformationTendency: {
          進爻: "解放の完成",
          変爻: "束縛への転換",
          錯卦: "完全な束縛への反転",
          綜卦: "解放する側の視点",
          互卦: "内なる自由"
        }
      },
      
      41: { // 山沢損
        name: "山沢損",
        theme: "減少・節制",
        coreEssence: "適切に減らすことで、本質を得る",
        abstractActions: {
          positive: {
            label: "積極的に削減する",
            description: "不要なものを削ぎ落とし、本質に集中",
            tendency: "断捨離的行動"
          },
          negative: {
            label: "現状を維持する",
            description: "何も手放さず、全てを保持",
            tendency: "保持的姿勢"
          },
          alternative: {
            label: "質的転換を図る",
            description: "量を減らして質を高める",
            tendency: "質的向上"
          }
        },
        transformationTendency: {
          進爻: "節制の深化",
          変爻: "増大への転換",
          錯卦: "完全な増大への反転",
          綜卦: "損失を与える側の視点",
          互卦: "内なる充実"
        }
      },
      
      42: { // 風雷益
        name: "風雷益",
        theme: "増益・発展",
        coreEssence: "上下が協力し、共に栄える",
        abstractActions: {
          positive: {
            label: "積極的に増やす",
            description: "資源を投入し、成長を促進",
            tendency: "拡大志向"
          },
          negative: {
            label: "増加を抑制する",
            description: "成長を控え、現状を保つ",
            tendency: "抑制的姿勢"
          },
          alternative: {
            label: "質的向上を図る",
            description: "量より質の向上に注力",
            tendency: "質的成長"
          }
        },
        transformationTendency: {
          進爻: "増益の加速",
          変爻: "減少への転換",
          錯卦: "完全な減少への反転",
          綜卦: "与えられる側の視点",
          互卦: "内なる豊かさ"
        }
      },
      
      43: { // 沢天夬
        name: "沢天夬",
        theme: "決断・排除",
        coreEssence: "断固として悪を取り除く",
        abstractActions: {
          positive: {
            label: "断固として決断する",
            description: "迷わず悪を排除し、正義を貫く",
            tendency: "決断的行動"
          },
          negative: {
            label: "決断を避ける",
            description: "曖昧な状態を保ち、決定を延期",
            tendency: "優柔不断"
          },
          alternative: {
            label: "対話で解決する",
            description: "排除ではなく、話し合いで解決",
            tendency: "対話的解決"
          }
        },
        transformationTendency: {
          進爻: "決断の徹底",
          変爻: "受容への転換",
          錯卦: "完全な受容への反転",
          綜卦: "排除される側の視点",
          互卦: "内なる決断力"
        }
      },
      
      44: { // 天風姤
        name: "天風姤",
        theme: "遭遇・誘惑",
        coreEssence: "予期せぬ出会いがもたらす変化",
        abstractActions: {
          positive: {
            label: "出会いを受け入れる",
            description: "新たな出会いを歓迎し、変化を受容",
            tendency: "開放的姿勢"
          },
          negative: {
            label: "出会いを拒む",
            description: "新たな関係を避け、現状維持",
            tendency: "閉鎖的姿勢"
          },
          alternative: {
            label: "慎重に見極める",
            description: "出会いの質を見極めて対応",
            tendency: "選択的受容"
          }
        },
        transformationTendency: {
          進爻: "関係の深化",
          変爻: "孤立への転換",
          錯卦: "完全な孤立への反転",
          綜卦: "出会う相手の視点",
          互卦: "内なる開放性"
        }
      },
      
      45: { // 沢地萃
        name: "沢地萃",
        theme: "集合・団結",
        coreEssence: "人々が集まり、大きな力となる",
        abstractActions: {
          positive: {
            label: "積極的に集める",
            description: "人や資源を集め、大きな力を作る",
            tendency: "集約的行動"
          },
          negative: {
            label: "分散させる",
            description: "集中を避け、分散状態を保つ",
            tendency: "分散的姿勢"
          },
          alternative: {
            label: "選択的に集める",
            description: "質を重視して厳選して集める",
            tendency: "選択的集約"
          }
        },
        transformationTendency: {
          進爻: "集合の拡大",
          変爻: "分散への転換",
          錯卦: "完全な分散への反転",
          綜卦: "集められる側の視点",
          互卦: "内なる求心力"
        }
      },
      
      46: { // 地風升
        name: "地風升",
        theme: "上昇・成長",
        coreEssence: "地中から徐々に成長し、上昇する",
        abstractActions: {
          positive: {
            label: "着実に成長する",
            description: "一歩一歩確実に上を目指す",
            tendency: "持続的成長"
          },
          negative: {
            label: "成長を止める",
            description: "現状に満足し、上昇を求めない",
            tendency: "停滞的姿勢"
          },
          alternative: {
            label: "急速に飛躍する",
            description: "段階を飛ばして一気に上昇",
            tendency: "飛躍的成長"
          }
        },
        transformationTendency: {
          進爻: "上昇の加速",
          変爻: "下降への転換",
          錯卦: "完全な下降への反転",
          綜卦: "成長を見守る側の視点",
          互卦: "内なる成長力"
        }
      },
      
      47: { // 沢水困
        name: "沢水困",
        theme: "困窮・試練",
        coreEssence: "極度の困難の中で、真価が問われる",
        abstractActions: {
          positive: {
            label: "困難を耐え抜く",
            description: "苦境に耐え、内面を充実させる",
            tendency: "忍耐的姿勢"
          },
          negative: {
            label: "困難から逃げる",
            description: "苦境を避け、安易な道を選ぶ",
            tendency: "逃避的行動"
          },
          alternative: {
            label: "創造的に打開する",
            description: "従来と違う方法で困難を克服",
            tendency: "創造的解決"
          }
        },
        transformationTendency: {
          進爻: "困窮の深化と転機",
          変爻: "豊かさへの転換",
          錯卦: "完全な豊かさへの反転",
          綜卦: "困窮させる側の視点",
          互卦: "内なる不屈の精神"
        }
      },
      
      48: { // 水風井
        name: "水風井",
        theme: "滋養・公益",
        coreEssence: "尽きることのない恵みを与え続ける",
        abstractActions: {
          positive: {
            label: "恵みを与え続ける",
            description: "無私の心で人々に利益を提供",
            tendency: "利他的行動"
          },
          negative: {
            label: "恵みを独占する",
            description: "利益を私的に保持し、共有しない",
            tendency: "利己的姿勢"
          },
          alternative: {
            label: "必要に応じて配分",
            description: "全てではなく、必要な人に適切に配分",
            tendency: "効率的配分"
          }
        },
        transformationTendency: {
          進爻: "公益性の深化",
          変爻: "枯渇への転換",
          錯卦: "完全な枯渇への反転",
          綜卦: "恵みを受ける側の視点",
          互卦: "内なる豊かな源泉"
        }
      },
      
      49: { // 沢火革
        name: "沢火革",
        theme: "変革・革新",
        coreEssence: "古いものを改め、新しい時代を作る",
        abstractActions: {
          positive: {
            label: "大胆に変革する",
            description: "既存の枠組みを打破し、新しい形を作る",
            tendency: "革新的行動"
          },
          negative: {
            label: "変革を延期する",
            description: "現状維持を選び、変化を避ける",
            tendency: "保守的姿勢"
          },
          alternative: {
            label: "段階的に変化する",
            description: "急激ではなく、徐々に改革を進める",
            tendency: "漸進的改革"
          }
        },
        transformationTendency: {
          進爻: "変革の進展",
          変爻: "安定への転換",
          錯卦: "完全な保守への反転",
          綜卦: "変革される側の視点",
          互卦: "内なる変革の必然性"
        }
      },
      
      50: { // 火風鼎
        name: "火風鼎",
        theme: "器・文化",
        coreEssence: "新しい器を作り、文化を育む",
        abstractActions: {
          positive: {
            label: "新しい器を作る",
            description: "新たな枠組みや文化を創造",
            tendency: "創造的構築"
          },
          negative: {
            label: "古い器に固執する",
            description: "既存の枠組みを守り、変化を拒む",
            tendency: "伝統固守"
          },
          alternative: {
            label: "器を改良する",
            description: "新旧を融合させて発展させる",
            tendency: "改良的発展"
          }
        },
        transformationTendency: {
          進爻: "器の完成と文化の成熟",
          変爻: "破壊への転換",
          錯卦: "完全な破壊への反転",
          綜卦: "器を使う側の視点",
          互卦: "内なる創造性"
        }
      },
      
      51: { // 震為雷
        name: "震為雷",
        theme: "震動・覚醒",
        coreEssence: "雷鳴のような衝撃が覚醒をもたらす",
        abstractActions: {
          positive: {
            label: "衝撃を受け入れる",
            description: "変化の衝撃を恐れず、覚醒の機会とする",
            tendency: "受容的覚醒"
          },
          negative: {
            label: "衝撃を避ける",
            description: "安定を求め、変化を拒否",
            tendency: "安定志向"
          },
          alternative: {
            label: "衝撃を緩和する",
            description: "急激な変化を和らげながら適応",
            tendency: "緩衝的適応"
          }
        },
        transformationTendency: {
          進爻: "震動の増幅",
          変爻: "静寂への転換",
          錯卦: "完全な静寂への反転",
          綜卦: "震動を与える側の視点",
          互卦: "内なる動的エネルギー"
        }
      },
      
      52: { // 艮為山
        name: "艮為山",
        theme: "静止・瞑想",
        coreEssence: "山のように動かず、内面を見つめる",
        abstractActions: {
          positive: {
            label: "完全に静止する",
            description: "一切の動きを止め、深い瞑想に入る",
            tendency: "完全な静止"
          },
          negative: {
            label: "動き続ける",
            description: "静止を拒み、常に活動を続ける",
            tendency: "継続的活動"
          },
          alternative: {
            label: "動中の静を保つ",
            description: "活動しながらも内的静寂を維持",
            tendency: "動静一如"
          }
        },
        transformationTendency: {
          進爻: "静止の深化",
          変爻: "活動への転換",
          錯卦: "完全な活動への反転",
          綜卦: "静止を見る側の視点",
          互卦: "内なる不動心"
        }
      },
      
      53: { // 風山漸
        name: "風山漸",
        theme: "漸進・段階",
        coreEssence: "雁が段階的に飛ぶように、着実に進む",
        abstractActions: {
          positive: {
            label: "段階的に進む",
            description: "焦らず一歩一歩確実に前進",
            tendency: "着実な前進"
          },
          negative: {
            label: "急速に進む",
            description: "段階を飛ばして一気に進む",
            tendency: "性急な前進"
          },
          alternative: {
            label: "状況に応じて速度調整",
            description: "時に早く、時にゆっくりと進む",
            tendency: "柔軟な進行"
          }
        },
        transformationTendency: {
          進爻: "進展の加速",
          変爻: "停滞への転換",
          錯卦: "完全な停滞への反転",
          綜卦: "進展を待つ側の視点",
          互卦: "内なる着実さ"
        }
      },
      
      54: { // 雷沢帰妹
        name: "雷沢帰妹",
        theme: "従属・適応",
        coreEssence: "新しい環境に従属し、適応する",
        abstractActions: {
          positive: {
            label: "環境に適応する",
            description: "新しい立場を受け入れ、順応する",
            tendency: "適応的行動"
          },
          negative: {
            label: "適応を拒否する",
            description: "新しい環境を拒み、独立を保つ",
            tendency: "独立的姿勢"
          },
          alternative: {
            label: "部分的に適応する",
            description: "必要な部分のみ適応し、本質は保つ",
            tendency: "選択的適応"
          }
        },
        transformationTendency: {
          進爻: "適応の深化",
          変爻: "独立への転換",
          錯卦: "完全な独立への反転",
          綜卦: "迎える側の視点",
          互卦: "内なる自己"
        }
      },
      
      55: { // 雷火豊
        name: "雷火豊",
        theme: "豊満・絶頂",
        coreEssence: "豊かさの絶頂で、次の変化に備える",
        abstractActions: {
          positive: {
            label: "豊かさを享受する",
            description: "絶頂期を認識し、十分に味わう",
            tendency: "享受的姿勢"
          },
          negative: {
            label: "豊かさを警戒する",
            description: "絶頂を恐れ、自ら制限する",
            tendency: "自制的姿勢"
          },
          alternative: {
            label: "次に備える",
            description: "豊かさの中で、将来の準備をする",
            tendency: "準備的行動"
          }
        },
        transformationTendency: {
          進爻: "豊かさの極致",
          変爻: "衰退への転換",
          錯卦: "完全な貧困への反転",
          綜卦: "豊かさを与える側の視点",
          互卦: "内なる満足感"
        }
      },
      
      56: { // 火山旅
        name: "火山旅",
        theme: "旅・流浪",
        coreEssence: "定住せず、常に移動し続ける",
        abstractActions: {
          positive: {
            label: "旅を続ける",
            description: "一所に留まらず、常に移動する",
            tendency: "遊牧的生活"
          },
          negative: {
            label: "定住を求める",
            description: "旅を終え、安定した場所を探す",
            tendency: "定住志向"
          },
          alternative: {
            label: "一時的に滞在する",
            description: "完全な定住でも流浪でもない中間",
            tendency: "半定住的生活"
          }
        },
        transformationTendency: {
          進爻: "旅の継続と発展",
          変爻: "定住への転換",
          錯卦: "完全な定住への反転",
          綜卦: "旅人を迎える側の視点",
          互卦: "内なる自由"
        }
      },
      
      57: { // 巽為風
        name: "巽為風",
        theme: "従順・浸透",
        coreEssence: "風のように柔軟に入り込み、浸透する",
        abstractActions: {
          positive: {
            label: "柔軟に浸透する",
            description: "抵抗せず、自然に入り込んでいく",
            tendency: "浸透的行動"
          },
          negative: {
            label: "浸透を拒む",
            description: "硬直的で、柔軟性を欠く",
            tendency: "硬直的姿勢"
          },
          alternative: {
            label: "選択的に浸透する",
            description: "重要な部分にのみ入り込む",
            tendency: "戦略的浸透"
          }
        },
        transformationTendency: {
          進爻: "浸透の深化",
          変爻: "硬直への転換",
          錯卦: "完全な硬直への反転",
          綜卦: "浸透される側の視点",
          互卦: "内なる柔軟性"
        }
      },
      
      58: { // 兌為沢
        name: "兌為沢",
        theme: "悦楽・交流",
        coreEssence: "喜びを分かち合い、人々と交流する",
        abstractActions: {
          positive: {
            label: "喜びを分かつ",
            description: "積極的に楽しみ、他者と共有",
            tendency: "社交的行動"
          },
          negative: {
            label: "喜びを独占する",
            description: "楽しみを一人占めし、共有しない",
            tendency: "独占的姿勢"
          },
          alternative: {
            label: "節度ある交流",
            description: "過度にならず、適度に楽しむ",
            tendency: "節制的交流"
          }
        },
        transformationTendency: {
          進爻: "悦楽の深化",
          変爻: "苦悩への転換",
          錯卦: "完全な苦悩への反転",
          綜卦: "楽しませる側の視点",
          互卦: "内なる喜び"
        }
      },
      
      59: { // 風水渙
        name: "風水渙",
        theme: "離散・流動",
        coreEssence: "固まったものを解きほぐし、流動させる",
        abstractActions: {
          positive: {
            label: "積極的に解散する",
            description: "固定観念を解き、新しい流れを作る",
            tendency: "解散的行動"
          },
          negative: {
            label: "結束を保つ",
            description: "離散を防ぎ、団結を維持",
            tendency: "結束的姿勢"
          },
          alternative: {
            label: "部分的に流動化",
            description: "全てではなく、必要な部分のみ流動化",
            tendency: "選択的流動"
          }
        },
        transformationTendency: {
          進爻: "離散の進行",
          変爻: "結束への転換",
          錯卦: "完全な結束への反転",
          綜卦: "離散させる側の視点",
          互卦: "内なる流動性"
        }
      },
      
      60: { // 水沢節
        name: "水沢節",
        theme: "節度・制限",
        coreEssence: "適切な節度を保ち、限度を守る",
        abstractActions: {
          positive: {
            label: "節度を守る",
            description: "適切な制限を設け、それを守る",
            tendency: "節制的行動"
          },
          negative: {
            label: "制限を破る",
            description: "節度を無視し、限界を超える",
            tendency: "放縦的姿勢"
          },
          alternative: {
            label: "柔軟に調整する",
            description: "状況に応じて節度を調整",
            tendency: "適応的節制"
          }
        },
        transformationTendency: {
          進爻: "節制の強化",
          変爻: "放縦への転換",
          錯卦: "完全な放縦への反転",
          綜卦: "節度を求める側の視点",
          互卦: "内なる自制心"
        }
      },
      
      61: { // 風沢中孚
        name: "風沢中孚",
        theme: "信頼・誠実",
        coreEssence: "内なる誠実さが外に現れ、信頼を得る",
        abstractActions: {
          positive: {
            label: "誠実を貫く",
            description: "一貫した誠実さで信頼を築く",
            tendency: "誠実な行動"
          },
          negative: {
            label: "疑いを持つ",
            description: "信頼を避け、懐疑的に振る舞う",
            tendency: "懐疑的姿勢"
          },
          alternative: {
            label: "検証しながら信頼",
            description: "盲信せず、確認しながら信頼構築",
            tendency: "慎重な信頼"
          }
        },
        transformationTendency: {
          進爻: "信頼の深化",
          変爻: "不信への転換",
          錯卦: "完全な不信への反転",
          綜卦: "信頼される側の視点",
          互卦: "内なる真実"
        }
      },
      
      62: { // 雷山小過
        name: "雷山小過",
        theme: "小過・慎重",
        coreEssence: "小さく過ぎることで、大過を避ける",
        abstractActions: {
          positive: {
            label: "慎重に行動する",
            description: "小さな過ちを恐れず、慎重に進む",
            tendency: "慎重な前進"
          },
          negative: {
            label: "大胆に行動する",
            description: "慎重さを捨て、思い切って動く",
            tendency: "大胆な行動"
          },
          alternative: {
            label: "状況判断する",
            description: "時に慎重、時に大胆に行動",
            tendency: "状況適応的"
          }
        },
        transformationTendency: {
          進爻: "慎重さの増大",
          変爻: "大胆への転換",
          錯卦: "完全な大胆への反転",
          綜卦: "慎重さを求める側の視点",
          互卦: "内なるバランス感覚"
        }
      },
      
      63: { // 水火既済
        name: "水火既済",
        theme: "完成・成就",
        coreEssence: "全てが完成し、調和が保たれる",
        abstractActions: {
          positive: {
            label: "完成を維持する",
            description: "達成した状態を保持し、安定させる",
            tendency: "維持的行動"
          },
          negative: {
            label: "次の段階へ進む",
            description: "完成に満足せず、新たな挑戦へ",
            tendency: "発展的姿勢"
          },
          alternative: {
            label: "完成を見直す",
            description: "達成を検証し、改善点を探る",
            tendency: "改善的アプローチ"
          }
        },
        transformationTendency: {
          進爻: "完成の円熟",
          変爻: "未完への転換",
          錯卦: "完全な未完への反転",
          綜卦: "完成を待つ側の視点",
          互卦: "内なる未完成要素"
        }
      },
      
      64: { // 火水未済
        name: "火水未済",
        theme: "未完・継続",
        coreEssence: "永遠に完成せず、常に進化し続ける",
        abstractActions: {
          positive: {
            label: "完成を目指す",
            description: "未完を認識し、完成に向けて努力",
            tendency: "完成志向"
          },
          negative: {
            label: "未完を受け入れる",
            description: "完成を求めず、過程を楽しむ",
            tendency: "過程重視"
          },
          alternative: {
            label: "新たな定義をする",
            description: "完成の概念自体を再定義する",
            tendency: "概念的転換"
          }
        },
        transformationTendency: {
          進爻: "未完の深化",
          変爻: "完成への転換",
          錯卦: "完全な完成への反転",
          綜卦: "未完を見る側の視点",
          互卦: "内なる完成の萌芽"
        }
      }
    };
  }

  /**
   * 変化傾向マトリックスの構築
   */
  buildTransformationTendencies() {
    return {
      actionCompatibility: {
        // 行動タイプと変化タイプの相性
        positive: {
          進爻: 0.8,   // テーマに沿う行動は進爻しやすい
          変爻: 0.2,   // テーマに沿っても時に変爻
          錯卦: 0.1,   // 稀に完全反転
          綜卦: 0.3,   // 視点転換の可能性
          互卦: 0.4    // 内省の可能性
        },
        negative: {
          進爻: 0.2,   // テーマと逆でも進むことがある
          変爻: 0.7,   // テーマと逆なら変爻しやすい
          錯卦: 0.5,   // 反転の可能性高い
          綜卦: 0.4,   // 視点転換の可能性
          互卦: 0.3    // 内省の可能性
        },
        alternative: {
          進爻: 0.5,   // 代替的行動は中庸
          変爻: 0.5,   // 変化も中庸
          錯卦: 0.2,   // 反転は少ない
          綜卦: 0.6,   // 視点転換しやすい
          互卦: 0.5    // 内省も中庸
        }
      }
    };
  }

  /**
   * 卦番号から行動テーマを取得
   */
  getActionTheme(hexagramNumber) {
    const theme = this.actionThemes[hexagramNumber];
    if (!theme) {
      console.warn(`⚠️ 未定義の卦番号: ${hexagramNumber}`);
      return this.getDefaultTheme();
    }
    return theme;
  }

  /**
   * デフォルトテーマ
   */
  getDefaultTheme() {
    return {
      name: "未定義",
      theme: "変化・成長",
      coreEssence: "状況に応じて変化し、成長する",
      abstractActions: {
        positive: {
          label: "積極的に行動する",
          description: "前向きに状況に対処する",
          tendency: "能動的姿勢"
        },
        negative: {
          label: "慎重に行動する",
          description: "リスクを避けて慎重に対処",
          tendency: "受動的姿勢"
        },
        alternative: {
          label: "状況を見極める",
          description: "様子を見ながら適切に対応",
          tendency: "適応的姿勢"
        }
      },
      transformationTendency: {
        進爻: "段階的進展",
        変爻: "質的転換",
        錯卦: "完全な反転",
        綜卦: "視点の転換",
        互卦: "内在性の発見"
      }
    };
  }

  /**
   * 行動タイプと変化タイプの相性を取得
   */
  getTransformationProbability(actionType, transformationType) {
    const compatibility = this.transformationTendencies.actionCompatibility[actionType];
    if (!compatibility) return 0.3; // デフォルト値
    
    return compatibility[transformationType] || 0.3;
  }

  /**
   * 卦の核心テーマに基づく行動生成（Gemini API用）
   */
  generateContextualActions(hexagramNumber, situationContext) {
    const theme = this.getActionTheme(hexagramNumber);
    
    return {
      hexagram: theme.name,
      coreTheme: theme.theme,
      essence: theme.coreEssence,
      abstractActions: theme.abstractActions,
      contextualHint: situationContext,
      generationPrompt: `
        Based on the hexagram "${theme.name}" with theme "${theme.theme}",
        and considering the situation: "${situationContext}",
        generate specific action options that maintain the abstract nature
        but are relevant to the context.
      `
    };
  }
}

// グローバル変数として登録
if (typeof window !== "undefined") {
  window.HexagramActionThemeCatalog = HexagramActionThemeCatalog;
  console.log("✅ Hexagram Action Theme Catalog loaded successfully");
}

// Node.js環境での使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = HexagramActionThemeCatalog;
}