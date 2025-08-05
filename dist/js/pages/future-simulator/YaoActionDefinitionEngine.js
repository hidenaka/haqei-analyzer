// YaoActionDefinitionEngine.js - 384爻の具体的行動定義エンジン
// koudo_shishin_database.jsと易経正統性を統合

/**
 * 384爻の具体的行動定義エンジン
 * 
 * 目的：
 * - 各爻位の特性に基づく具体的行動の定義
 * - 進爻・変爻システムの実装
 * - koudo_shishin_database.jsとの完全統合
 * 
 * 入力：
 * - hexagramNumber: 卦番号（1-64）
 * - yaoPosition: 爻位（1-6, '用九', '用六'）
 * 
 * 処理内容：
 * 1. 爻位の特性分析
 * 2. 進爻・変爻条件の判定
 * 3. 行動と爻の相性計算
 * 4. 次の段階への変化予測
 * 
 * 出力：
 * - 具体的行動オプション
 * - 変化パスの確率
 * 
 * 副作用：
 * - ログ出力
 * 
 * 前提条件：
 * - koudo_shishin_database.jsがロード済み
 * - ClassicalIChingStandardsとの整合性
 * 
 * エラー処理：
 * - 未定義の爻：デフォルト処理
 * - データ不整合：警告出力
 */

class YaoActionDefinitionEngine {
  constructor() {
    this.initializeEngine();
  }

  initializeEngine() {
    console.log("🎯 Initializing Yao Action Definition Engine...");
    
    // koudo_shishin_database.jsの確認
    this.validateKoudoShishinData();
    
    // 爻位特性の定義
    this.yaoCharacteristics = this.defineYaoCharacteristics();
    
    // 進爻・変爻ロジックの初期化
    this.shinHenLogic = this.initializeShinHenLogic();
    
    // 行動適合性マトリックス
    this.actionCompatibility = this.buildActionCompatibilityMatrix();
    
    console.log("✅ Yao Action Definition Engine initialized with 384 yao entries");
  }

  /**
   * koudo_shishin_database.jsの検証
   */
  validateKoudoShishinData() {
    if (typeof window !== "undefined" && !window.koudoShishinData) {
      throw new Error("❌ koudo_shishin_database.js is not loaded");
    }
    
    const data = window.koudoShishinData || [];
    console.log(`📊 Loaded ${data.length} yao entries from koudo_shishin_database`);
    
    if (data.length !== 384) {
      console.warn(`⚠️ Expected 384 entries, got ${data.length}`);
    }
    
    return true;
  }

  /**
   * 爻位特性の定義
   */
  defineYaoCharacteristics() {
    return {
      1: { // 初爻
        position: "初爻",
        nature: "始まり・基礎",
        character: "潜龍勿用", // 乾卦初九の象徴
        socialPosition: "庶民",
        actionAdvice: "慎重に準備し、時機を待つ",
        yinYangPreference: "陽爻が正位",
        transformationTendency: {
          進爻: 0.7, // 初爻は進爻しやすい
          変爻: 0.3,
          stability: "基盤構築期"
        },
        actionTypes: {
          preparatory: "準備的行動",
          cautious: "慎重な行動",
          foundational: "基盤作りの行動"
        }
      },
      2: { // 二爻
        position: "二爻",
        nature: "発展・臣位",
        character: "見龍在田", // 乾卦九二の象徴
        socialPosition: "臣下・補佐",
        actionAdvice: "協力と連携を重視する",
        yinYangPreference: "陰爻が正位",
        transformationTendency: {
          進爻: 0.6,
          変爻: 0.4,
          stability: "中正の位（安定）"
        },
        actionTypes: {
          collaborative: "協力的行動",
          supportive: "支援的行動",
          diplomatic: "外交的行動"
        }
      },
      3: { // 三爻
        position: "三爻",
        nature: "転換・進退",
        character: "君子終日乾乾", // 乾卦九三の象徴
        socialPosition: "中間管理職",
        actionAdvice: "注意深く判断し、過度な行動は慎む",
        yinYangPreference: "陽爻が正位",
        transformationTendency: {
          進爻: 0.4,
          変爻: 0.6, // 三爻は変爻しやすい（危険な位）
          stability: "不安定期"
        },
        actionTypes: {
          cautious: "慎重な行動",
          balanced: "バランス重視の行動",
          transitional: "移行期の行動"
        }
      },
      4: { // 四爻
        position: "四爻",
        nature: "進展・近臣",
        character: "或躍在淵", // 乾卦九四の象徴
        socialPosition: "側近・重臣",
        actionAdvice: "責任を持ってリーダーを支える",
        yinYangPreference: "陰爻が正位",
        transformationTendency: {
          進爻: 0.5,
          変爻: 0.5,
          stability: "責任期"
        },
        actionTypes: {
          responsible: "責任ある行動",
          advisory: "助言的行動",
          supportive: "支援的行動"
        }
      },
      5: { // 五爻
        position: "五爻",
        nature: "成熟・君位",
        character: "飛龍在天", // 乾卦九五の象徴
        socialPosition: "君主・リーダー",
        actionAdvice: "高い徳性と決断力で導く",
        yinYangPreference: "陽爻が正位",
        transformationTendency: {
          進爻: 0.3,
          変爻: 0.7, // 五爻は変化の可能性が高い
          stability: "中正の位（権威期）"
        },
        actionTypes: {
          leadership: "指導的行動",
          decisive: "決断的行動",
          authoritative: "権威的行動"
        }
      },
      6: { // 上爻
        position: "上爻",
        nature: "完成・退隠",
        character: "亢龍有悔", // 乾卦上九の象徴
        socialPosition: "長老・賢者",
        actionAdvice: "謙虚さを保ち、次世代に道を譲る",
        yinYangPreference: "陰爻が正位",
        transformationTendency: {
          進爻: 0.2, // 上爻から次の卦へ
          変爻: 0.8,
          stability: "完成期・転換期"
        },
        actionTypes: {
          transitional: "引き継ぎの行動",
          wisdom: "智恵を授ける行動",
          humble: "謙遜の行動"
        }
      }
    };
  }

  /**
   * 進爻・変爻ロジックの初期化
   */
  initializeShinHenLogic() {
    return {
      // 進爻条件（その爻のテーマを深める行動）
      shinConditions: {
        themeAlignment: 0.7, // テーマとの適合度
        positionSuitability: 0.6, // 爻位との適合性
        yinYangCorrectness: 0.5, // 陰陽正位性
        continuity: 0.8 // 継続性
      },
      
      // 変爻条件（爻の性質と反対の行動）
      henConditions: {
        themeOpposition: 0.7, // テーマとの対立度
        intensityThreshold: 0.6, // 行動の強度
        contextualPressure: 0.5, // 状況的圧力
        transformation: 0.8 // 変化への意志
      },
      
      // 水天需の具体例（koudo_shishin_database.jsに基づく）
      hexagramExamples: {
        5: { // 水天需
          1: { // 初九
            shinAction: "冷静な準備を深める",
            shinDescription: "危険から遠い安全な場所で、焦らずじっくりと準備を整える",
            henAction: "物事を完成させる意識を持つ",
            henDescription: "準備段階から完成形をイメージし、積極的な姿勢へ転換",
            henTarget: "水火既済", // 之卦
            progressionPath: "九二へ進爻"
          },
          2: { // 九二
            shinAction: "着実さを維持する",
            shinDescription: "小さな問題や批判が生じても、動じずに準備を進める",
            henAction: "節度ある行動を取る",
            henDescription: "進むべき時か、待つべき時か、行動に明確な一線を引く",
            henTarget: "水沢節",
            progressionPath: "九三へ進爻"
          },
          3: { // 九三
            shinAction: "危機的状況に耐える",
            shinDescription: "泥沼状態を自覚し、下手に動かず苦しい経験から学ぶ",
            henAction: "大きな視点での抑制",
            henDescription: "天の時を待つように、力を蓄え障害が通り過ぎるのを待つ",
            henTarget: "風天小畜",
            progressionPath: "六四へ進爻"
          },
          4: { // 六四
            shinAction: "痛みを乗り越える",
            shinDescription: "大きな犠牲を伴いながらも、危機から脱出する転換点",
            henAction: "決断力を発揮する",
            henDescription: "ためらわずに不要なものや悪しき関係を断ち切る",
            henTarget: "沢天夬",
            progressionPath: "九五へ進爻"
          },
          5: { // 九五
            shinAction: "安泰を保つ",
            shinDescription: "長い待機期間が終わり、安定と休息の時を迎える",
            henAction: "上下の意思疎通を活発にする",
            henDescription: "天地が交わるような調和の状態を築く",
            henTarget: "地天泰",
            progressionPath: "上六へ進爻"
          },
          6: { // 上六
            shinAction: "新たな展開への対応",
            shinDescription: "目標達成後の予期せぬ課題に謙虚な姿勢で向き合う",
            henAction: "内なる知恵や資源を整備",
            henDescription: "清らかな水の井戸のように、価値を提供できる状態を整備",
            henTarget: "水風井",
            progressionPath: "新サイクルへ"
          }
        }
      }
    };
  }

  /**
   * 行動適合性マトリックスの構築
   */
  buildActionCompatibilityMatrix() {
    return {
      // 爻位と行動タイプの相性
      positionActionCompatibility: {
        1: { // 初爻
          preparatory: 0.9,
          cautious: 0.8,
          aggressive: 0.2,
          leadership: 0.1
        },
        2: { // 二爻
          collaborative: 0.9,
          supportive: 0.8,
          diplomatic: 0.7,
          aggressive: 0.3
        },
        3: { // 三爻
          cautious: 0.9,
          balanced: 0.8,
          extreme: 0.2,
          reckless: 0.1
        },
        4: { // 四爻
          responsible: 0.9,
          advisory: 0.8,
          independent: 0.4,
          rebellious: 0.1
        },
        5: { // 五爻
          leadership: 0.9,
          decisive: 0.8,
          authoritative: 0.7,
          passive: 0.2
        },
        6: { // 上爻
          transitional: 0.9,
          humble: 0.8,
          wisdom: 0.7,
          aggressive: 0.1
        }
      },
      
      // 陰陽と行動の相性
      yinYangActionCompatibility: {
        yang: {
          active: 0.8,
          creative: 0.7,
          leadership: 0.8,
          aggressive: 0.6,
          passive: 0.3
        },
        yin: {
          receptive: 0.8,
          supportive: 0.7,
          adaptive: 0.8,
          nurturing: 0.7,
          aggressive: 0.2
        }
      }
    };
  }

  /**
   * 特定の爻の行動定義を取得
   */
  getYaoActionDefinition(hexagramNumber, yaoPosition) {
    try {
      // koudo_shishin_database.jsからデータを取得
      const koudoData = this.getKoudoShishinEntry(hexagramNumber, yaoPosition);
      
      // 爻位特性を取得
      const yaoChar = this.yaoCharacteristics[yaoPosition];
      
      if (!koudoData || !yaoChar) {
        return this.getDefaultYaoDefinition(hexagramNumber, yaoPosition);
      }
      
      return {
        hexagram: koudoData.name.split(' ')[0], // "水天需 初九" → "水天需"
        position: yaoChar.position,
        yaoName: koudoData.name,
        
        // 基本特性
        characteristics: {
          nature: yaoChar.nature,
          character: yaoChar.character,
          socialPosition: yaoChar.socialPosition,
          advice: yaoChar.actionAdvice,
          yinYangPreference: yaoChar.yinYangPreference
        },
        
        // 行動オプション
        actions: {
          shin: {
            label: "進爻行動（テーマを深める）",
            description: koudoData.shin,
            actionType: this.extractActionType(koudoData.shin, "shin"),
            nextStage: this.calculateNextStage(hexagramNumber, yaoPosition, "shin"),
            probability: this.calculateShinProbability(hexagramNumber, yaoPosition)
          },
          hen: {
            label: "変爻行動（状況を転換）",
            description: koudoData.hen,
            actionType: this.extractActionType(koudoData.hen, "hen"),
            targetHexagram: this.extractTargetHexagram(koudoData.hen),
            probability: this.calculateHenProbability(hexagramNumber, yaoPosition)
          }
        },
        
        // 変化傾向
        transformationTendency: yaoChar.transformationTendency,
        
        // 適合性評価
        compatibility: this.assessActionCompatibility(hexagramNumber, yaoPosition)
      };
      
    } catch (error) {
      console.error(`❌ Error getting yao definition for ${hexagramNumber}-${yaoPosition}:`, error);
      return this.getDefaultYaoDefinition(hexagramNumber, yaoPosition);
    }
  }

  /**
   * koudo_shishin_database.jsからエントリを取得
   */
  getKoudoShishinEntry(hexagramNumber, yaoPosition) {
    const data = window.koudoShishinData || [];
    
    // 卦名から検索（水天需、乾為天など）
    const hexagramNames = this.getHexagramName(hexagramNumber);
    const yaoName = this.getYaoName(yaoPosition);
    
    const entry = data.find(item => {
      return item.name && item.name.includes(hexagramNames) && item.name.includes(yaoName);
    });
    
    if (!entry) {
      console.warn(`⚠️ No koudo_shishin entry found for ${hexagramNumber}-${yaoPosition}`);
    }
    
    return entry;
  }

  /**
   * 卦番号から卦名を取得
   */
  getHexagramName(hexagramNumber) {
    const hexagramNames = {
      1: "乾為天", 2: "坤為地", 3: "水雷屯", 4: "山水蒙", 5: "水天需",
      6: "天水訟", 7: "地水師", 8: "水地比", 9: "風天小畜", 10: "天沢履",
      11: "地天泰", 12: "天地否", 13: "天火同人", 14: "火天大有", 15: "地山謙",
      16: "雷地豫", 17: "沢雷随", 18: "山風蠱", 19: "地沢臨", 20: "風地観",
      21: "火雷噬嗑", 22: "山火賁", 23: "山地剝", 24: "地雷復", 25: "天雷无妄",
      26: "山天大畜", 27: "山雷頤", 28: "沢風大過", 29: "坎為水", 30: "離為火",
      31: "沢山咸", 32: "雷風恒", 33: "天山遯", 34: "雷天大壮", 35: "火地晋",
      36: "地火明夷", 37: "風火家人", 38: "火沢睽", 39: "水山蹇", 40: "雷水解",
      41: "山沢損", 42: "風雷益", 43: "沢天夬", 44: "天風姤", 45: "沢地萃",
      46: "地風升", 47: "沢水困", 48: "水風井", 49: "沢火革", 50: "火風鼎",
      51: "震為雷", 52: "艮為山", 53: "風山漸", 54: "雷沢帰妹", 55: "雷火豊",
      56: "火山旅", 57: "巽為風", 58: "兌為沢", 59: "風水渙", 60: "水沢節",
      61: "風沢中孚", 62: "雷山小過", 63: "水火既済", 64: "火水未済"
    };
    
    return hexagramNames[hexagramNumber] || "未定義";
  }

  /**
   * 爻位から爻名を取得
   */
  getYaoName(yaoPosition) {
    if (yaoPosition === "用九") return "用九";
    if (yaoPosition === "用六") return "用六";
    
    const yaoNames = {
      1: ["初九", "初六"],
      2: ["九二", "六二"],
      3: ["九三", "六三"],
      4: ["九四", "六四"],
      5: ["九五", "六五"],
      6: ["上九", "上六"]
    };
    
    // 陰陽どちらも含む可能性があるため、両方を返す
    return yaoNames[yaoPosition] || ["未定義"];
  }

  /**
   * 行動タイプの抽出
   */
  extractActionType(description, actionCategory) {
    const keywordMap = {
      shin: {
        "準備": "preparatory",
        "慎重": "cautious",
        "着実": "steady",
        "深める": "deepening",
        "維持": "maintaining",
        "耐える": "enduring"
      },
      hen: {
        "転換": "transforming",
        "決断": "decisive",
        "積極的": "active",
        "完成": "completing",
        "整備": "organizing",
        "抑制": "restraining"
      }
    };
    
    const keywords = keywordMap[actionCategory] || {};
    
    for (const [keyword, type] of Object.entries(keywords)) {
      if (description.includes(keyword)) {
        return type;
      }
    }
    
    return actionCategory === "shin" ? "progressive" : "transformative";
  }

  /**
   * 変卦ターゲットの抽出
   */
  extractTargetHexagram(henDescription) {
    // 「之卦「水火既済」」のパターンを検索
    const match = henDescription.match(/之卦[「『](.*?)[」』]/);
    return match ? match[1] : null;
  }

  /**
   * 次のステージ計算
   */
  calculateNextStage(hexagramNumber, yaoPosition, actionType) {
    if (actionType === "shin") {
      // 進爻：次の爻位へ
      if (yaoPosition < 6) {
        return {
          type: "進爻",
          hexagram: hexagramNumber,
          yao: yaoPosition + 1,
          description: `${yaoPosition + 1}爻への進展`
        };
      } else {
        return {
          type: "新サイクル",
          description: "新たなサイクルの開始"
        };
      }
    } else {
      // 変爻：別の卦へ
      return {
        type: "変爻",
        description: "状況の質的転換"
      };
    }
  }

  /**
   * 進爻確率の計算
   */
  calculateShinProbability(hexagramNumber, yaoPosition) {
    const baseProb = this.yaoCharacteristics[yaoPosition]?.transformationTendency?.進爻 || 0.5;
    
    // 調整要因
    const factors = {
      positionStability: this.getPositionStability(yaoPosition),
      hexagramFlow: this.getHexagramFlow(hexagramNumber),
      seasonalFactor: 1.0 // 将来的に季節性を追加
    };
    
    let adjustedProb = baseProb * factors.positionStability * factors.hexagramFlow;
    return Math.min(Math.max(adjustedProb, 0.1), 0.9); // 0.1-0.9の範囲に制限
  }

  /**
   * 変爻確率の計算
   */
  calculateHenProbability(hexagramNumber, yaoPosition) {
    const baseProb = this.yaoCharacteristics[yaoPosition]?.transformationTendency?.変爻 || 0.5;
    
    // 変爻は進爻の補数として計算
    const shinProb = this.calculateShinProbability(hexagramNumber, yaoPosition);
    return Math.min(Math.max(1 - shinProb, 0.1), 0.9);
  }

  /**
   * 爻位の安定性
   */
  getPositionStability(yaoPosition) {
    const stability = {
      1: 0.8, // 初爻は進爻傾向
      2: 1.0, // 二爻は中正で安定
      3: 0.6, // 三爻は不安定
      4: 0.7, // 四爻は責任期
      5: 1.0, // 五爻は中正で権威
      6: 0.5  // 上爻は転換期
    };
    
    return stability[yaoPosition] || 0.7;
  }

  /**
   * 卦の流れ性
   */
  getHexagramFlow(hexagramNumber) {
    // 各卦の変化の流動性（暫定値）
    const flowMap = {
      1: 0.9,  // 乾為天：強い創造の流れ
      2: 0.7,  // 坤為地：安定的な流れ
      5: 0.6,  // 水天需：待機の流れ
      11: 0.8, // 地天泰：調和の流れ
      12: 0.5, // 天地否：閉塞の流れ
      23: 0.4, // 山地剝：剥落の流れ
      24: 0.9, // 地雷復：復活の流れ
      49: 0.8, // 沢火革：変革の流れ
      63: 0.3, // 水火既済：完成の流れ
      64: 0.7  // 火水未済：未完の流れ
    };
    
    return flowMap[hexagramNumber] || 0.7;
  }

  /**
   * 行動適合性の評価
   */
  assessActionCompatibility(hexagramNumber, yaoPosition) {
    const yaoChar = this.yaoCharacteristics[yaoPosition];
    const positionCompatibility = this.actionCompatibility.positionActionCompatibility[yaoPosition];
    
    return {
      position: yaoChar.position,
      overallStability: this.getPositionStability(yaoPosition),
      actionTypeCompatibility: positionCompatibility,
      transformationReadiness: yaoChar.transformationTendency,
      recommendation: this.generateActionRecommendation(hexagramNumber, yaoPosition)
    };
  }

  /**
   * 行動推奨の生成
   */
  generateActionRecommendation(hexagramNumber, yaoPosition) {
    const shinProb = this.calculateShinProbability(hexagramNumber, yaoPosition);
    const henProb = this.calculateHenProbability(hexagramNumber, yaoPosition);
    
    if (shinProb > henProb + 0.2) {
      return {
        primary: "進爻行動",
        reasoning: "現在の段階を深め、次のステップへ進むことを推奨",
        confidence: shinProb
      };
    } else if (henProb > shinProb + 0.2) {
      return {
        primary: "変爻行動", 
        reasoning: "状況の転換を図り、新たな展開を求めることを推奨",
        confidence: henProb
      };
    } else {
      return {
        primary: "状況判断",
        reasoning: "進爻・変爻の選択は慎重な状況判断に依存",
        confidence: Math.max(shinProb, henProb)
      };
    }
  }

  /**
   * デフォルト爻定義
   */
  getDefaultYaoDefinition(hexagramNumber, yaoPosition) {
    const yaoChar = this.yaoCharacteristics[yaoPosition] || this.yaoCharacteristics[1];
    
    return {
      hexagram: this.getHexagramName(hexagramNumber),
      position: yaoChar.position,
      yaoName: `${this.getHexagramName(hexagramNumber)} ${yaoChar.position}`,
      
      characteristics: {
        nature: yaoChar.nature,
        character: yaoChar.character,
        socialPosition: yaoChar.socialPosition,
        advice: yaoChar.actionAdvice,
        yinYangPreference: yaoChar.yinYangPreference
      },
      
      actions: {
        shin: {
          label: "段階的前進",
          description: "現在の段階を深め、着実に次へ進む",
          actionType: "progressive",
          nextStage: this.calculateNextStage(hexagramNumber, yaoPosition, "shin"),
          probability: 0.6
        },
        hen: {
          label: "状況転換",
          description: "現状を変え、新たな展開を図る",
          actionType: "transformative",
          targetHexagram: null,
          probability: 0.4
        }
      },
      
      transformationTendency: yaoChar.transformationTendency,
      compatibility: {
        position: yaoChar.position,
        overallStability: 0.7,
        recommendation: {
          primary: "状況判断",
          reasoning: "詳細データ不足のため、慎重な判断を要す",
          confidence: 0.5
        }
      }
    };
  }

  /**
   * 全爻の概要取得
   */
  getAllYaoSummary(hexagramNumber) {
    const summary = {
      hexagram: this.getHexagramName(hexagramNumber),
      yaoDefinitions: {},
      overallFlow: this.getHexagramFlow(hexagramNumber),
      progressionPath: []
    };
    
    for (let yao = 1; yao <= 6; yao++) {
      summary.yaoDefinitions[yao] = this.getYaoActionDefinition(hexagramNumber, yao);
      summary.progressionPath.push({
        yao: yao,
        primaryAction: summary.yaoDefinitions[yao].compatibility.recommendation.primary,
        nextStage: summary.yaoDefinitions[yao].actions.shin.nextStage
      });
    }
    
    return summary;
  }
}

// グローバル変数として登録
if (typeof window !== "undefined") {
  window.YaoActionDefinitionEngine = YaoActionDefinitionEngine;
  console.log("✅ Yao Action Definition Engine loaded successfully");
}

// Node.js環境での使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = YaoActionDefinitionEngine;
}