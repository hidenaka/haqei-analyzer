// ClassicalIChingStandards.js - 古典易経正統性基準データベース
// HaQei Analyzer - Classical I-Ching Orthodox Standards for Validation
// 易経専門家による古典易経の正統な基準定義

/**
 * 古典易経正統性基準データベース
 * 
 * このファイルは古典易経の正統な基準を定義し、
 * 現代的実装が伝統的な易経思想を正しく反映しているかを
 * 検証するための基準として機能します。
 */

class ClassicalIChingStandards {
  constructor() {
    this.initializeStandards();
  }

  initializeStandards() {
    console.log("🔯 Initializing Classical I-Ching Orthodox Standards...");
    
    // 基準データの初期化
    this.trigramStandards = this.defineTrigramStandards();
    this.hexagramStandards = this.defineHexagramStandards();
    this.lineStandards = this.defineLineStandards();
    this.relationshipStandards = this.defineRelationshipStandards();
    this.philosophicalStandards = this.definePhilosophicalStandards();
    
    console.log("✅ Classical I-Ching Standards initialized successfully");
  }

  // ========== 八卦の正統な基準定義 ==========
  
  defineTrigramStandards() {
    return {
      // 正統な八卦の属性定義（先天八卦・後天八卦両方含む）
      orthodoxTrigrams: {
        1: { // 乾 ☰
          name_jp: "乾",
          name_cn: "乾",
          symbol: "☰",
          nature: "天",
          quality: "剛健",
          element: "金", // 五行帰属
          family_position: "父", // 家族的役割
          direction_xiantian: "南", // 先天八卦方位
          direction_houtian: "西北", // 後天八卦方位
          season: "秋冬の境", 
          time: "戌亥", // 十二支対応
          virtue: "元亨利貞", // 四徳
          animal: "馬", // 象徴動物
          body_part: "首", // 身体部位
          color: "白", // 対応色
          yin_yang: "純陽" // 陰陽性質
        },
        2: { // 兌 ☱
          name_jp: "兌",
          name_cn: "兌",
          symbol: "☱",
          nature: "沢",
          quality: "和悦",
          element: "金",
          family_position: "少女",
          direction_xiantian: "東南",
          direction_houtian: "西",
          season: "秋",
          time: "酉",
          virtue: "正",
          animal: "羊",
          body_part: "口",
          color: "白",
          yin_yang: "少陰"
        },
        3: { // 離 ☲
          name_jp: "離",
          name_cn: "離",
          symbol: "☲",
          nature: "火",
          quality: "麗著",
          element: "火",
          family_position: "中女",
          direction_xiantian: "東",
          direction_houtian: "南",
          season: "夏",
          time: "午",
          virtue: "智",
          animal: "雉",
          body_part: "目",
          color: "赤",
          yin_yang: "中陰"
        },
        4: { // 震 ☳
          name_jp: "震",
          name_cn: "震",
          symbol: "☳",
          nature: "雷",
          quality: "奮進",
          element: "木",
          family_position: "長男",
          direction_xiantian: "東北",
          direction_houtian: "東",
          season: "春",
          time: "卯",
          virtue: "仁",
          animal: "龍",
          body_part: "足",
          color: "青",
          yin_yang: "少陽"
        },
        5: { // 巽 ☴
          name_jp: "巽",
          name_cn: "巽",
          symbol: "☴",
          nature: "風",
          quality: "巽順",
          element: "木",
          family_position: "長女",
          direction_xiantian: "西南",
          direction_houtian: "東南",
          season: "春夏の境",
          time: "辰巳",
          virtue: "順",
          animal: "鶏",
          body_part: "股",
          color: "青緑",
          yin_yang: "少陰"
        },
        6: { // 坎 ☵
          name_jp: "坎",
          name_cn: "坎",
          symbol: "☵",
          nature: "水",
          quality: "陷険",
          element: "水",
          family_position: "中男",
          direction_xiantian: "西",
          direction_houtian: "北",
          season: "冬",
          time: "子",
          virtue: "智険",
          animal: "豕",
          body_part: "耳",
          color: "黒",
          yin_yang: "中陽"
        },
        7: { // 艮 ☶
          name_jp: "艮",
          name_cn: "艮",
          symbol: "☶",
          nature: "山",
          quality: "止静",
          element: "土",
          family_position: "少男",
          direction_xiantian: "西北",
          direction_houtian: "東北",
          season: "冬春の境",
          time: "丑寅",
          virtue: "篤実",
          animal: "狗",
          body_part: "手",
          color: "黄",
          yin_yang: "少陽"
        },
        8: { // 坤 ☷
          name_jp: "坤",
          name_cn: "坤",
          symbol: "☷",
          nature: "地",
          quality: "柔順",
          element: "土",
          family_position: "母",
          direction_xiantian: "北",
          direction_houtian: "西南",
          season: "夏秋の境",
          time: "未申",
          virtue: "順承",
          animal: "牛",
          body_part: "腹",
          color: "黄",
          yin_yang: "純陰"
        }
      },

      // 正統な八卦相互関係
      orthodoxRelationships: {
        // 対立関係（先天八卦による）
        opposition: {
          "乾": "坤", // 天地の対立
          "坤": "乾",
          "震": "艮", // 雷山の対立  
          "艮": "震",
          "坎": "離", // 水火の対立
          "離": "坎", 
          "巽": "兌", // 風沢の対立
          "兌": "巽"
        },

        // 補完関係（後天八卦による）
        complement: {
          "乾": "巽", // 天風の補完（剛柔相済）
          "巽": "乾",
          "坤": "震", // 地雷の補完（静動相済）
          "震": "坤",
          "坎": "離", // 水火の補完（内外相照）
          "離": "坎",
          "艮": "兌", // 山沢の補完（止説相応）
          "兌": "艮"
        },

        // 相生関係（五行相生）
        mutual_generation: {
          "乾": "坎", // 金生水
          "兌": "坎", // 金生水
          "坎": "震", // 水生木
          "坎": "巽", // 水生木
          "震": "離", // 木生火
          "巽": "離", // 木生火
          "離": "坤", // 火生土
          "離": "艮", // 火生土
          "坤": "乾", // 土生金
          "艮": "兌"  // 土生金
        },

        // 相剋関係（五行相剋）
        mutual_restriction: {
          "乾": "震", // 金克木
          "兌": "巽", // 金克木
          "震": "坤", // 木克土
          "巽": "艮", // 木克土  
          "坤": "坎", // 土克水
          "艮": "坎", // 土克水
          "坎": "離", // 水克火
          "離": "乾", // 火克金
          "離": "兌"  // 火克金
        }
      }
    };
  }

  // ========== 64卦の正統な基準定義 ==========
  
  defineHexagramStandards() {
    return {
      // 正統な64卦の陰陽バランス検証基準
      yinYangBalance: {
        // 純卦（同じ八卦の重複）
        pure_hexagrams: [1, 2, 29, 30, 51, 52, 57, 58],
        
        // 完全対立卦（錯卦関係）
        complete_opposition: {
          1: 2,   // 乾⇔坤
          3: 50,  // 屯⇔鼎
          11: 12, // 泰⇔否
          63: 64  // 既済⇔未済
        },

        // 上下対称卦（綜卦＝自身）
        symmetric_hexagrams: [1, 2, 11, 12, 27, 28, 29, 30, 61, 62],

        // 序卦伝による正統な配列順序
        sequence_pairs: [
          [1, 2],   // 乾坤
          [3, 4],   // 屯蒙
          [5, 6],   // 需訟
          [7, 8],   // 師比
          [9, 10],  // 小畜履
          [11, 12], // 泰否
          [13, 14], // 同人大有
          [15, 16], // 謙豫
          [17, 18], // 随蠱
          [19, 20], // 臨観
          [21, 22], // 噬嗑賁
          [23, 24], // 剝復
          [25, 26], // 无妄大畜
          [27, 28], // 頤大過
          [29, 30], // 坎離
          [31, 32], // 咸恒
          [33, 34], // 遯大壮
          [35, 36], // 晋明夷
          [37, 38], // 家人睽
          [39, 40], // 蹇解
          [41, 42], // 損益
          [43, 44], // 夬姤
          [45, 46], // 萃升
          [47, 48], // 困井
          [49, 50], // 革鼎
          [51, 52], // 震艮
          [53, 54], // 漸帰妹
          [55, 56], // 豊旅
          [57, 58], // 巽兌
          [59, 60], // 渙節
          [61, 62], // 中孚小過
          [63, 64]  // 既済未済
        ]
      },

      // 十二消息卦の正統な季節対応
      twelve_sovereign_hexagrams: {
        "復": { month: 11, season: "冬至", meaning: "一陽来復" },
        "臨": { month: 12, season: "小寒", meaning: "二陽生" },
        "泰": { month: 1, season: "立春", meaning: "三陽開泰" },
        "大壮": { month: 2, season: "春分", meaning: "四陽盛" },
        "夬": { month: 3, season: "清明", meaning: "五陽決" },
        "乾": { month: 4, season: "立夏", meaning: "純陽至" },
        "姤": { month: 5, season: "夏至", meaning: "一陰始" },
        "遯": { month: 6, season: "小暑", meaning: "二陰長" },
        "否": { month: 7, season: "立秋", meaning: "三陰塞" },
        "観": { month: 8, season: "秋分", meaning: "四陰観" },
        "剝": { month: 9, season: "寒露", meaning: "五陰剝" },
        "坤": { month: 10, season: "立冬", meaning: "純陰極" }
      }
    };
  }

  // ========== 爻辞の正統な基準定義 ==========
  
  defineLineStandards() {
    return {
      // 六爻の正統な位置的意味
      line_positions: {
        1: { // 初爻
          position_name: "初爻",
          meaning: "始まり・基礎",
          character: "潜龍勿用", // 乾卦初九の象徴
          social_position: "庶民",
          advice: "慎重に準備し、時機を待つ",
          yin_yang_preference: "位が奇数なので陽爻が正"
        },
        2: { // 二爻
          position_name: "二爻", 
          meaning: "発展・臣位",
          character: "見龍在田", // 乾卦九二の象徴
          social_position: "臣下・補佐",
          advice: "協力と連携を重視する",
          yin_yang_preference: "位が偶数なので陰爻が正"
        },
        3: { // 三爻
          position_name: "三爻",
          meaning: "転換・進退",
          character: "君子終日乾乾", // 乾卦九三の象徴
          social_position: "中間管理職",
          advice: "注意深く判断し、過度な行動は慎む",
          yin_yang_preference: "位が奇数なので陽爻が正"
        },
        4: { // 四爻
          position_name: "四爻",
          meaning: "進展・近臣",
          character: "或躍在淵", // 乾卦九四の象徴
          social_position: "側近・重臣",
          advice: "責任を持ってリーダーを支える",
          yin_yang_preference: "位が偶数なので陰爻が正"
        },
        5: { // 五爻
          position_name: "五爻",
          meaning: "成熟・君位",
          character: "飛龍在天", // 乾卦九五の象徴
          social_position: "君主・リーダー",
          advice: "高い徳性と決断力で導く",
          yin_yang_preference: "位が奇数なので陽爻が正"
        },
        6: { // 上爻
          position_name: "上爻",
          meaning: "完成・退隠",
          character: "亢龍有悔", // 乾卦上九の象徴
          social_position: "長老・賢者",
          advice: "謙虚さを保ち、次世代に道を譲る",
          yin_yang_preference: "位が偶数なので陰爻が正"
        }
      },

      // 爻位の正統な関係性
      line_relationships: {
        // 応の関係（初応四、二応五、三応上）
        correspondence: [
          [1, 4], [2, 5], [3, 6]
        ],
        
        // 比の関係（隣接爻位）
        adjacency: [
          [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]
        ],

        // 中の位（二爻・五爻は中正の位）
        central_positions: [2, 5],

        // 正の位（奇数位に陽爻、偶数位に陰爻が正位）
        correct_positions: {
          yang_positions: [1, 3, 5], // 陽爻が正しい位置
          yin_positions: [2, 4, 6]   // 陰爻が正しい位置
        }
      }
    };
  }

  // ========== 相互関係の正統な基準定義 ==========
  
  defineRelationshipStandards() {
    return {
      // 正統な変化の法則
      transformation_laws: {
        // 錯卦（全爻反転）の法則
        inversion_law: "陰陽が完全に反転した錯卦は、原卦と補完的関係にある",
        
        // 綜卦（上下反転）の法則  
        reversal_law: "上下を反転した綜卦は、相手の視点・立場を表す",
        
        // 互卦（2,3,4爻→下卦、3,4,5爻→上卦）の法則
        nuclear_law: "内面の隠れた性質や潜在的発展方向を示す",
        
        // 之卦（変爻による変化）の法則
        changing_law: "現在から未来への移行プロセスを示す"
      },

      // 五行関係の正統な解釈
      five_element_dynamics: {
        generation_cycle: ["木", "火", "土", "金", "水"], // 相生循環
        restriction_cycle: ["木", "土", "水", "火", "金"], // 相剋循環
        
        // 相生関係の意味
        generation_meanings: {
          "木→火": "情熱の燃焼、創造的発展",
          "火→土": "成果の定着、安定化",
          "土→金": "価値の精錬、純化",
          "金→水": "智慧の流動、柔軟性",
          "水→木": "成長の栄養、発展"
        },
        
        // 相剋関係の意味
        restriction_meanings: {
          "木→土": "変化による安定の動揺",
          "土→水": "形式による自由の制限", 
          "水→火": "冷静による情熱の抑制",
          "火→金": "情熱による理性の溶解",
          "金→木": "規律による成長の制御"
        }
      }
    };
  }

  // ========== 哲学的基準の定義 ==========
  
  definePhilosophicalStandards() {
    return {
      // bunenjin哲学との整合性基準
      bunenjin_compatibility: {
        core_principles: {
          "divided_performance": "一人の人間が複数の人格を使い分ける思想",
          "situational_adaptation": "状況に応じて最適な人格を選択する智慧",
          "authentic_multiplicity": "多面性こそが人間の真の姿という認識",
          "harmonious_integration": "複数人格の調和的統合を目指す"
        },
        
        iching_alignment: {
          "yin_yang_balance": "陰陽のバランスが分人思想の基礎",
          "trigram_roles": "八卦が異なる人格的側面を表現",
          "hexagram_combinations": "64卦が状況的人格変化を示す",
          "line_dynamics": "爻の変化が人格の動的変化を表現"
        }
      },

      // 易経の根本思想
      fundamental_philosophy: {
        core_concepts: {
          "change": "万物流転、変化こそが宇宙の法則",
          "balance": "陰陽の動的平衡による調和",
          "resonance": "感応の法則、共鳴による相互作用",
          "timing": "時中の思想、適時適切な行動",
          "virtue": "徳による治世、内的品格の重要性"
        },
        
        practical_wisdom: {
          "divination_purpose": "吉凶判断ではなく、行動指針の獲得",
          "self_cultivation": "占いを通じた自己理解と成長",
          "decision_making": "複雑な状況での最適解の発見",
          "relationship_harmony": "人間関係の調和的発展"
        }
      },

      // 現代的解釈の妥当性基準
      modern_interpretation_standards: {
        acceptable_adaptations: [
          "心理学的解釈の導入",
          "ビジネス応用への展開", 
          "デジタル技術との融合",
          "多文化的理解の促進"
        ],
        
        unacceptable_deviations: [
          "基本的陰陽思想の否定",
          "八卦の恣意的な再定義",
          "序卦伝の論理的順序の無視",
          "商業的利益のための歪曲"
        ]
      }
    };
  }

  // ========== 検証支援メソッド ==========
  
  /**
   * 八卦の正統性を検証
   */
  validateTrigram(trigramData) {
    const standard = this.trigramStandards.orthodoxTrigrams[trigramData.id];
    if (!standard) return { valid: false, error: "未定義の八卦ID" };
    
    const validations = {
      name: trigramData.name === standard.name_jp,
      element: trigramData.element === standard.element,
      family: trigramData.family_position === standard.family_position,
      nature: trigramData.nature === standard.nature
    };
    
    return {
      valid: Object.values(validations).every(v => v),
      details: validations,
      standard: standard
    };
  }

  /**
   * 64卦の陰陽バランスを検証
   */
  validateHexagramBalance(hexagramId, lines) {
    const yinCount = lines.filter(line => line === 0).length;
    const yangCount = lines.filter(line => line === 1).length;
    
    // 完全な偏りは特殊卦（乾・坤）のみ許可
    const isPureHexagram = this.hexagramStandards.yinYangBalance.pure_hexagrams.includes(hexagramId);
    const hasBalance = yinCount > 0 && yangCount > 0;
    
    return {
      valid: isPureHexagram || hasBalance,
      yinCount: yinCount,
      yangCount: yangCount,
      isPure: isPureHexagram,
      balanceRatio: yangCount / (yinCount + yangCount)
    };
  }

  /**
   * 爻辞の位置適用を検証
   */
  validateLineApplication(position, lineValue, context) {
    const standard = this.lineStandards.line_positions[position];
    if (!standard) return { valid: false, error: "無効な爻位" };
    
    // 正位かどうかの判定
    const isCorrectPosition = 
      (position % 2 === 1 && lineValue === 1) || // 奇数位に陽爻
      (position % 2 === 0 && lineValue === 0);   // 偶数位に陰爻
    
    return {
      valid: true,
      isCorrectPosition: isCorrectPosition,
      positionMeaning: standard.meaning,
      advice: standard.advice,
      socialPosition: standard.social_position
    };
  }

  /**
   * bunenjin哲学との整合性を検証
   */
  validateBunenjinAlignment(implementation) {
    const standards = this.philosophicalStandards.bunenjin_compatibility;
    
    const alignmentChecks = {
      supportsDividedPerformance: this.checkDividedPerformanceSupport(implementation),
      maintainsYinYangBalance: this.checkYinYangBalance(implementation),
      respectsTrigramRoles: this.checkTrigramRoleRespect(implementation),
      enablesSituationalAdaptation: this.checkSituationalAdaptation(implementation)
    };
    
    return {
      valid: Object.values(alignmentChecks).every(check => check.valid),
      details: alignmentChecks,
      overallScore: this.calculateAlignmentScore(alignmentChecks)
    };
  }

  // ========== 内部ヘルパーメソッド ==========
  
  checkDividedPerformanceSupport(implementation) {
    // Triple OS構造の存在確認
    return {
      valid: implementation.hasTripleOS && implementation.allowsPersonalitySwitching,
      details: "bunenjin哲学の分人思想をサポートしているか"
    };
  }

  checkYinYangBalance(implementation) {
    // 陰陽バランスの維持確認
    return {
      valid: implementation.respectsYinYangPrinciples,
      details: "陰陽の基本原理を尊重しているか"
    };
  }

  checkTrigramRoleRespect(implementation) {
    // 八卦の役割的解釈の正確性確認
    return {
      valid: implementation.usesOrthodoxTrigramMeanings,
      details: "八卦の伝統的意味を正しく使用しているか"
    };
  }

  checkSituationalAdaptation(implementation) {
    // 状況適応機能の存在確認
    return {
      valid: implementation.enablesContextualPersonality,
      details: "状況に応じた人格適応をサポートしているか"
    };
  }

  calculateAlignmentScore(checks) {
    const validCount = Object.values(checks).filter(check => check.valid).length;
    return validCount / Object.keys(checks).length;
  }
}

// グローバル変数として登録
if (typeof window !== "undefined") {
  window.ClassicalIChingStandards = ClassicalIChingStandards;
  console.log("✅ Classical I-Ching Standards loaded successfully");
}

// Node.js環境での使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = ClassicalIChingStandards;
}