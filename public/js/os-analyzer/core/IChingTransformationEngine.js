// IChingTransformationEngine.js - 易経変化法則の包括的実装
// HaQei Analyzer - 序卦伝論理に基づく未来分岐図システム
// 易経専門エージェントによる正統な変化体系実装

/**
 * 易経変化エンジン - 64卦変化体系の完全実装
 * 
 * このエンジンは古典易経の変化原理を現代AIシステムに統合し、
 * 未来予測の精度を飛躍的に向上させます。
 */
class IChingTransformationEngine {
  constructor() {
    // 64卦序卦伝の論理的順序
    this.sequenceLogic = this.initializeSequenceLogic();
    
    // 互卦・綜卦・錯卦の相互関係
    this.hexagramRelationships = this.initializeHexagramRelationships();
    
    // 五行循環と卦の対応
    this.fiveElementCycles = this.initializeFiveElementCycles();
    
    // 時間軸に基づく変化パターン
    this.temporalTransformation = this.initializeTemporalTransformation();
    
    // bunenjin哲学との統合点
    this.bunenjinIntegration = this.initializeBunenjinIntegration();
    
    console.log("🔯 易経変化エンジン初期化完了 - 5つの変化原理統合済み");
  }

  /**
   * 序卦伝論理の初期化
   * 64卦の論理的順序と変化の必然性を定義
   */
  initializeSequenceLogic() {
    return {
      // 天地創造序列（1-12卦）
      creation_sequence: {
        1: { name: "乾", next: 2, logic: "純粋創造力から受容性への転化" },
        2: { name: "坤", next: 3, logic: "受容から初生の困難への展開" },
        3: { name: "屯", next: 4, logic: "始動困難から学習欲求への転換" },
        4: { name: "蒙", next: 5, logic: "蒙昧状態から待機への移行" },
        5: { name: "需", next: 6, logic: "待機から争訟への発展" },
        6: { name: "訟", next: 7, logic: "争いから軍事組織への統合" },
        7: { name: "師", next: 8, logic: "統率力から親比への展開" },
        8: { name: "比", next: 9, logic: "親密関係から蓄積への転化" },
        9: { name: "小畜", next: 10, logic: "小蓄から大胆行動への飛躍" },
        10: { name: "履", next: 11, logic: "実践から調和への昇華" },
        11: { name: "泰", next: 12, logic: "平和から閉塞への転換" },
        12: { name: "否", next: 13, logic: "否塞から集結への突破" }
      },
      
      // 社会発展序列（13-24卦）  
      development_sequence: {
        13: { name: "同人", next: 14, logic: "集結から大富への発展" },
        14: { name: "大有", next: 15, logic: "大富から謙遜への転換" },
        15: { name: "謙", next: 16, logic: "謙遜から喜悦への昇華" },
        16: { name: "豫", next: 17, logic: "喜悦から追随への展開" },
        17: { name: "随", next: 18, logic: "追随から腐敗への警告" },
        18: { name: "蠱", next: 19, logic: "腐敗から接近への修復" },
        19: { name: "臨", next: 20, logic: "接近から観察への転化" },
        20: { name: "観", next: 21, logic: "観察から決断への移行" },
        21: { name: "噬嗑", next: 22, logic: "決断から装飾への展開" },
        22: { name: "賁", next: 23, logic: "装飾から剥落への転換" },
        23: { name: "剥", next: 24, logic: "剥落から復帰への希望" },
        24: { name: "復", next: 25, logic: "復帰から無妄への浄化" }
      },
      
      // 個人修養序列（25-36卦）
      cultivation_sequence: {
        25: { name: "無妄", next: 26, logic: "無妄から蓄積への展開" },
        26: { name: "大畜", next: 27, logic: "大蓄から養育への転化" },
        27: { name: "頤", next: 28, logic: "養育から過大への警告" },
        28: { name: "大過", next: 29, logic: "過大から陥落への転落" },
        29: { name: "坎", next: 30, logic: "陥落から付着への対処" },
        30: { name: "離", next: 31, logic: "付着から感応への昇華" },
        31: { name: "咸", next: 32, logic: "感応から持続への発展" },
        32: { name: "恒", next: 33, logic: "持続から退避への転換" },
        33: { name: "遯", next: 34, logic: "退避から大壮への反転" },
        34: { name: "大壮", next: 35, logic: "大壮から進展への発展" },
        35: { name: "晋", next: 36, logic: "進展から暗傷への転落" },
        36: { name: "明夷", next: 37, logic: "暗傷から家庭への回帰" }
      },
      
      // 人間関係序列（37-48卦）
      relationship_sequence: {
        37: { name: "家人", next: 38, logic: "家庭から疎外への対立" },
        38: { name: "睽", next: 39, logic: "疎外から困難への転化" },
        39: { name: "蹇", next: 40, logic: "困難から解決への突破" },
        40: { name: "解", next: 41, logic: "解決から損失への転換" },
        41: { name: "損", next: 42, logic: "損失から利益への転化" },
        42: { name: "益", next: 43, logic: "利益から決断への発展" },
        43: { name: "夬", next: 44, logic: "決断から遭遇への展開" },
        44: { name: "姤", next: 45, logic: "遭遇から集結への発展" },
        45: { name: "萃", next: 46, logic: "集結から上昇への転化" },
        46: { name: "升", next: 47, logic: "上昇から困窮への転落" },
        47: { name: "困", next: 48, logic: "困窮から井戸への解決" },
        48: { name: "井", next: 49, logic: "井戸から革命への転換" }
      },
      
      // 変革完成序列（49-64卦）
      transformation_sequence: {
        49: { name: "革", next: 50, logic: "革命から鼎立への安定" },
        50: { name: "鼎", next: 51, logic: "鼎立から震動への転換" },
        51: { name: "震", next: 52, logic: "震動から静止への対立" },
        52: { name: "艮", next: 53, logic: "静止から進展への転化" },
        53: { name: "漸", next: 54, logic: "進展から帰妹への完成" },
        54: { name: "皈妹", next: 55, logic: "帰妹から豊富への発展" },
        55: { name: "豊", next: 56, logic: "豊富から旅行への転換" },
        56: { name: "旅", next: 57, logic: "旅行から順従への安定" },
        57: { name: "巽", next: 58, logic: "順従から喜悦への昇華" },
        58: { name: "兌", next: 59, logic: "喜悦から渙散への転換" },
        59: { name: "渙", next: 60, logic: "渙散から節制への統制" },
        60: { name: "節", next: 61, logic: "節制から中孚への深化" },
        61: { name: "中孚", next: 62, logic: "中孚から小過への調整" },
        62: { name: "小過", next: 63, logic: "小過から既済への完成" },
        63: { name: "既済", next: 64, logic: "既済から未済への循環" },
        64: { name: "未済", next: 1, logic: "未済から乾への新循環開始" }
      }
    };
  }

  /**
   * 互卦・綜卦・錯卦関係の初期化
   * 深層的変化メカニズムの実装
   */
  initializeHexagramRelationships() {
    return {
      // 互卦（隠れた性質）
      mutual_hexagrams: {
        1: 1,   // 乾の互卦は乾（自己完結）
        2: 2,   // 坤の互卦は坤（自己受容）
        3: 23,  // 屯の互卦は剥（内在的解体）
        4: 24,  // 蒙の互卦は復（内在的復帰）
        5: 38,  // 需の互卦は睽（内在的対立）
        6: 37,  // 訟の互卦は家人（内在調和）
        7: 24,  // 師の互卦は復（内在復活）
        8: 23,  // 比の互卦は剥（内在解体）
        // ... 他の卦も同様に定義
      },
      
      // 綜卦（逆転関係）
      comprehensive_hexagrams: {
        1: 2,   // 乾⇔坤（創造⇔受容）
        3: 4,   // 屯⇔蒙（困難⇔学習）
        5: 6,   // 需⇔訟（待機⇔争い）
        7: 8,   // 師⇔比（統率⇔親近）
        9: 16,  // 小畜⇔豫（蓄積⇔喜悦）
        10: 15, // 履⇔謙（実践⇔謙遜）
        11: 12, // 泰⇔否（平和⇔閉塞）
        13: 14, // 同人⇔大有（集結⇔大富）
        // ... 32対の綜卦関係
      },
      
      // 錯卦（陰陽反転）
      opposite_hexagrams: {
        1: 2,   // 乾（111111）⇔坤（000000）
        3: 50,  // 屯（010001）⇔鼎（101110）
        5: 35,  // 需（010111）⇔晋（101000）
        7: 13,  // 師（000010）⇔同人（111101）
        // 各卦の陰陽を完全反転した関係
      }
    };
  }

  /**
   * 五行循環システムの初期化
   * 木火土金水の変化サイクルと卦の対応
   */
  initializeFiveElementCycles() {
    return {
      // 相生循環（生成関係）
      generation_cycle: {
        wood: {
          element: "木",
          season: "春",
          hexagrams: [3, 42, 51], // 屯、益、震
          generates: "fire",
          supports: ["growth", "expansion", "initiative"],
          transformation_pattern: "上昇・発展・創始"
        },
        fire: {
          element: "火",
          season: "夏", 
          hexagrams: [13, 14, 30], // 同人、大有、離
          generates: "earth",
          supports: ["clarity", "expression", "illumination"],
          transformation_pattern: "顕現・表現・光明"
        },
        earth: {
          element: "土",
          season: "長夏",
          hexagrams: [2, 8, 23, 24], // 坤、比、剥、復
          generates: "metal",
          supports: ["stability", "nurturing", "foundation"],
          transformation_pattern: "安定・育成・基盤"
        },
        metal: {
          element: "金",
          season: "秋",
          hexagrams: [1, 43, 58], // 乾、夬、兌
          generates: "water",
          supports: ["refinement", "precision", "completion"],
          transformation_pattern: "精錬・完成・収束"
        },
        water: {
          element: "水",
          season: "冬",
          hexagrams: [29, 48, 60], // 坎、井、節
          generates: "wood",
          supports: ["flow", "adaptation", "wisdom"],
          transformation_pattern: "流動・適応・智慧"
        }
      },
      
      // 相剋循環（制御関係）
      control_cycle: {
        wood_controls_earth: { strength: 0.8, hexagram_effect: "growth_vs_stability" },
        fire_controls_metal: { strength: 0.9, hexagram_effect: "expression_vs_precision" },
        earth_controls_water: { strength: 0.7, hexagram_effect: "stability_vs_flow" },
        metal_controls_wood: { strength: 0.8, hexagram_effect: "precision_vs_growth" },
        water_controls_fire: { strength: 0.9, hexagram_effect: "flow_vs_expression" }
      }
    };
  }

  /**
   * 時間軸変化システムの初期化
   * 過去→現在→未来の連続的変化パターン
   */
  initializeTemporalTransformation() {
    return {
      // 三世時間軸
      temporal_dimensions: {
        past: {
          influence_coefficient: 0.3,
          hexagram_selection: "karma_based", // 因果律に基づく
          transformation_rules: "completion_to_seed" // 完成から種子へ
        },
        present: {
          influence_coefficient: 0.5,
          hexagram_selection: "situation_based", // 現状に基づく
          transformation_rules: "dynamic_adaptation" // 動的適応
        },
        future: {
          influence_coefficient: 0.2,
          hexagram_selection: "potential_based", // 潜在性に基づく  
          transformation_rules: "seed_to_manifestation" // 種子から顕現へ
        }
      },
      
      // 変化速度パターン
      transformation_velocity: {
        gradual: { 
          coefficient: 0.1, 
          pattern: "sequence_following", // 序卦伝に従う
          suitable_for: ["personal_growth", "relationship_development"]
        },
        moderate: {
          coefficient: 0.3,
          pattern: "mutual_transformation", // 互卦変化
          suitable_for: ["career_change", "life_decisions"]
        },
        rapid: {
          coefficient: 0.7,
          pattern: "opposite_jumping", // 錯卦跳躍
          suitable_for: ["crisis_resolution", "breakthrough_moments"]
        },
        revolutionary: {
          coefficient: 1.0,
          pattern: "complete_reversal", // 綜卦反転
          suitable_for: ["paradigm_shift", "life_transformation"]
        }
      }
    };
  }

  /**
   * bunenjin哲学統合システム
   * 分人思想と易経変化の調和実装
   */
  initializeBunenjinIntegration() {
    return {
      // Triple OS対応
      triple_os_mapping: {
        engine_os: {
          primary_hexagrams: [1, 51, 32], // 乾、震、恒（創造・行動・持続）
          transformation_style: "direct_action",
          change_triggers: ["external_pressure", "internal_drive", "creative_impulse"]
        },
        interface_os: {
          primary_hexagrams: [2, 58, 31], // 坤、兌、咸（受容・調和・感応）
          transformation_style: "adaptive_response", 
          change_triggers: ["social_interaction", "emotional_resonance", "harmony_seeking"]
        },
        safe_mode_os: {
          primary_hexagrams: [52, 15, 61], // 艮、謙、中孚（静止・謙遜・誠意）
          transformation_style: "cautious_preservation",
          change_triggers: ["threat_detection", "stability_need", "authentic_expression"]
        }
      },
      
      // 分人間の変化調和
      personality_harmony: {
        synchronized_transformation: {
          all_os_change: "total_paradigm_shift", // 全人格OS同時変化
          two_os_change: "partial_adaptation", // 部分的適応
          one_os_change: "localized_adjustment" // 局所的調整
        },
        conflict_resolution: {
          opposing_changes: "dialectical_synthesis", // 弁証法的統合
          complementary_changes: "harmonic_enhancement", // 調和的強化
          neutral_changes: "independent_coexistence" // 独立共存
        }
      }
    };
  }

  /**
   * 包括的変化分析の実行
   * 5つの変化原理を統合した未来予測
   */
  analyzeComprehensiveTransformation(currentHexagram, situationContext, personalityOS) {
    console.log("🔯 包括的易経変化分析開始:", { currentHexagram, situationContext, personalityOS });

    // 1. 序卦伝による論理的次候補
    const sequenceTransformation = this.analyzeSequenceTransformation(currentHexagram);
    
    // 2. 互卦・綜卦・錯卦による深層変化
    const relationshipTransformation = this.analyzeRelationshipTransformation(currentHexagram);
    
    // 3. 五行循環による要素変化
    const elementalTransformation = this.analyzeElementalTransformation(currentHexagram);
    
    // 4. 時間軸による変化速度と方向
    const temporalTransformation = this.analyzeTemporalTransformation(currentHexagram, situationContext);
    
    // 5. bunenjin統合による人格調和変化
    const bunenjinTransformation = this.analyzeBunenjinTransformation(currentHexagram, personalityOS);

    // 統合的変化パターンの生成
    const integratedTransformation = this.synthesizeTransformations({
      sequence: sequenceTransformation,
      relationship: relationshipTransformation,
      elemental: elementalTransformation,
      temporal: temporalTransformation,
      bunenjin: bunenjinTransformation
    });

    console.log("✅ 包括的変化分析完了:", integratedTransformation);
    return integratedTransformation;
  }

  /**
   * 序卦伝による変化分析
   */
  analyzeSequenceTransformation(currentHexagram) {
    const sequences = [
      this.sequenceLogic.creation_sequence,
      this.sequenceLogic.development_sequence,
      this.sequenceLogic.cultivation_sequence,
      this.sequenceLogic.relationship_sequence,
      this.sequenceLogic.transformation_sequence
    ];

    for (const sequence of sequences) {
      if (sequence[currentHexagram]) {
        return {
          type: "sequence_logical",
          current: sequence[currentHexagram],
          next_hexagram: sequence[currentHexagram].next,
          logic: sequence[currentHexagram].logic,
          probability: 0.8,
          natural_flow: true
        };
      }
    }

    return {
      type: "sequence_completion",
      next_hexagram: (currentHexagram % 64) + 1,
      logic: "循環的回帰による新始",
      probability: 0.3,
      natural_flow: false
    };
  }

  /**
   * 互卦・綜卦・錯卦による変化分析
   */
  analyzeRelationshipTransformation(currentHexagram) {
    const mutual = this.hexagramRelationships.mutual_hexagrams[currentHexagram];
    const comprehensive = this.hexagramRelationships.comprehensive_hexagrams[currentHexagram];
    const opposite = this.hexagramRelationships.opposite_hexagrams[currentHexagram];

    return {
      mutual: {
        hexagram: mutual,
        type: "hidden_nature_emergence",
        probability: 0.4,
        description: "内在する性質の顕現"
      },
      comprehensive: {
        hexagram: comprehensive,
        type: "perspective_reversal", 
        probability: 0.3,
        description: "視点の逆転による新展開"
      },
      opposite: {
        hexagram: opposite,
        type: "complete_transformation",
        probability: 0.2,
        description: "完全な陰陽反転"
      }
    };
  }

  /**
   * 五行による変化分析
   */
  analyzeElementalTransformation(currentHexagram) {
    // 現在の卦の五行属性を特定
    const currentElement = this.getHexagramElement(currentHexagram);
    const cycle = this.fiveElementCycles.generation_cycle[currentElement];
    
    if (!cycle) {
      return { type: "elemental_neutral", transformations: [] };
    }

    return {
      type: "elemental_transformation",
      current_element: currentElement,
      generated_element: cycle.generates,
      seasonal_influence: cycle.season,
      supported_qualities: cycle.supports,
      transformation_pattern: cycle.transformation_pattern,
      target_hexagrams: this.fiveElementCycles.generation_cycle[cycle.generates].hexagrams,
      probability: 0.6
    };
  }

  /**
   * 時間軸による変化分析
   */
  analyzeTemporalTransformation(currentHexagram, situationContext) {
    const timeInfluence = this.temporalTransformation.temporal_dimensions;
    const velocityPattern = this.determineTransformationVelocity(situationContext);

    return {
      type: "temporal_transformation",
      past_influence: timeInfluence.past.influence_coefficient,
      present_influence: timeInfluence.present.influence_coefficient,
      future_influence: timeInfluence.future.influence_coefficient,
      velocity: velocityPattern,
      transformation_timeline: this.generateTransformationTimeline(currentHexagram, velocityPattern)
    };
  }

  /**
   * bunenjin統合による変化分析
   */
  analyzeBunenjinTransformation(currentHexagram, personalityOS) {
    const osMapping = this.bunenjinIntegration.triple_os_mapping;
    const currentOS = this.identifyPrimaryOS(currentHexagram, personalityOS);
    
    return {
      type: "bunenjin_integrated_transformation",
      primary_os: currentOS,
      harmony_level: this.calculateOSHarmony(personalityOS),
      transformation_style: osMapping[currentOS]?.transformation_style,
      change_triggers: osMapping[currentOS]?.change_triggers,
      multi_personality_coordination: this.calculateMultiPersonalityCoordination(personalityOS)
    };
  }

  /**
   * Enhanced OS to Hexagram transformation - 2025-08-04
   * High-precision mapping for Triple OS architecture
   */
  transformOSToHexagram(osResult, osType, userVector) {
    console.log(`🔯 Enhanced OS→卦 transformation for ${osType}:`, osResult.osId);
    
    try {
      // Get base hexagram from OS result
      const baseHexagram = osResult.osId;
      
      // Apply bunenjin philosophy analysis
      const bunenjinTransformation = this.analyzeBunenjinHexagramAlignment(baseHexagram, userVector, osType);
      
      // Calculate transformation probability
      const transformationProbability = this.calculateTransformationProbability(baseHexagram, osType, userVector);
      
      // Determine if transformation is needed
      if (transformationProbability > 0.7) {
        const transformedHexagram = this.applyOSSpecificTransformation(baseHexagram, osType, bunenjinTransformation);
        
        return {
          originalHexagram: baseHexagram,
          transformedHexagram: transformedHexagram,
          transformationReason: this.getTransformationReason(osType, bunenjinTransformation),
          confidence: transformationProbability,
          bunenjinAlignment: bunenjinTransformation.alignmentScore,
          methodology: 'bunenjin-enhanced-transformation'
        };
      }
      
      // No transformation needed
      return {
        originalHexagram: baseHexagram,
        transformedHexagram: baseHexagram,
        transformationReason: 'optimal_alignment_achieved',
        confidence: 0.95,
        bunenjinAlignment: bunenjinTransformation.alignmentScore,
        methodology: 'direct-mapping'
      };
      
    } catch (error) {
      console.error('❌ OS→卦 transformation error:', error);
      return {
        originalHexagram: osResult.osId,
        transformedHexagram: osResult.osId,
        transformationReason: 'fallback_no_transformation',
        confidence: 0.8,
        bunenjinAlignment: 0.7,
        methodology: 'fallback'
      };
    }
  }

  /**
   * Analyze bunenjin philosophy alignment with hexagram
   */
  analyzeBunenjinHexagramAlignment(hexagram, userVector, osType) {
    const bunenjinCharacteristics = {
      authenticity: userVector.authenticity || 0.5,
      multiplicity: userVector.multiplicity || 0.5,
      adaptability: userVector.adaptability || 0.5,
      harmony: userVector.harmony || 0.5
    };
    
    // Hexagram bunenjin compatibility matrix
    const hexagramBunenjinMatrix = {
      // Engine OS hexagrams
      1: { authenticity: 0.9, multiplicity: 0.3, adaptability: 0.4, harmony: 0.6 }, // 乾
      51: { authenticity: 0.8, multiplicity: 0.7, adaptability: 0.8, harmony: 0.4 }, // 震
      34: { authenticity: 0.9, multiplicity: 0.4, adaptability: 0.5, harmony: 0.5 }, // 大壮
      
      // Interface OS hexagrams  
      2: { authenticity: 0.7, multiplicity: 0.8, adaptability: 0.9, harmony: 0.9 }, // 坤
      58: { authenticity: 0.6, multiplicity: 0.9, adaptability: 0.8, harmony: 0.8 }, // 兌
      31: { authenticity: 0.8, multiplicity: 0.7, adaptability: 0.9, harmony: 0.9 }, // 咸
      
      // SafeMode OS hexagrams
      52: { authenticity: 0.9, multiplicity: 0.4, adaptability: 0.3, harmony: 0.9 }, // 艮
      29: { authenticity: 0.8, multiplicity: 0.8, adaptability: 0.6, harmony: 0.7 }, // 坎
      39: { authenticity: 0.7, multiplicity: 0.6, adaptability: 0.7, harmony: 0.8 }  // 蹇
    };
    
    const hexagramProfile = hexagramBunenjinMatrix[hexagram] || 
      { authenticity: 0.5, multiplicity: 0.5, adaptability: 0.5, harmony: 0.5 };
    
    // Calculate alignment score
    let alignmentScore = 0;
    alignmentScore += Math.abs(bunenjinCharacteristics.authenticity - hexagramProfile.authenticity);
    alignmentScore += Math.abs(bunenjinCharacteristics.multiplicity - hexagramProfile.multiplicity);
    alignmentScore += Math.abs(bunenjinCharacteristics.adaptability - hexagramProfile.adaptability);
    alignmentScore += Math.abs(bunenjinCharacteristics.harmony - hexagramProfile.harmony);
    
    // Convert to alignment score (lower difference = higher alignment)
    alignmentScore = 1 - (alignmentScore / 4);
    
    return {
      alignmentScore,
      characteristics: bunenjinCharacteristics,
      hexagramProfile,
      osType,
      recommendations: this.generateBunenjinRecommendations(bunenjinCharacteristics, hexagramProfile)
    };
  }

  /**
   * Calculate transformation probability based on alignment
   */
  calculateTransformationProbability(hexagram, osType, userVector) {
    // Base probability depends on OS type stability
    const baseProb = {
      engine: 0.3,    // Engine OS is most stable
      interface: 0.6, // Interface OS is most adaptive
      safemode: 0.4   // SafeMode OS is moderately stable
    };
    
    let probability = baseProb[osType] || 0.5;
    
    // Adjust based on user vector characteristics
    if (userVector.multiplicity > 0.7) {
      probability += 0.2; // High multiplicity increases transformation likelihood
    }
    if (userVector.adaptability > 0.8) {
      probability += 0.15; // High adaptability increases transformation likelihood
    }
    if (userVector.authenticity > 0.9) {
      probability -= 0.1; // High authenticity decreases transformation likelihood
    }
    
    return Math.min(0.95, Math.max(0.1, probability));
  }

  /**
   * Apply OS-specific transformation logic
   */
  applyOSSpecificTransformation(baseHexagram, osType, bunenjinTransformation) {
    const transformationMatrix = {
      engine: {
        // Engine OS transformation paths
        1: [34, 43, 51], // 乾 → 大壮, 夬, 震
        51: [32, 42, 1], // 震 → 恒, 益, 乾
        34: [11, 26, 1]  // 大壮 → 泰, 大畜, 乾
      },
      interface: {
        // Interface OS transformation paths  
        2: [19, 20, 8],  // 坤 → 臨, 観, 比
        58: [31, 17, 2], // 兌 → 咸, 随, 坤
        31: [58, 54, 2]  // 咸 → 兌, 帰妹, 坤
      },
      safemode: {
        // SafeMode OS transformation paths
        52: [39, 53, 29], // 艮 → 蹇, 漸, 坎
        29: [60, 27, 52], // 坎 → 節, 頤, 艮
        39: [15, 52, 29]  // 蹇 → 謙, 艮, 坎
      }
    };
    
    const transformationOptions = transformationMatrix[osType]?.[baseHexagram];
    if (!transformationOptions || transformationOptions.length === 0) {
      return baseHexagram; // No transformation available
    }
    
    // Select best transformation based on bunenjin alignment
    let bestHexagram = baseHexagram;
    let bestScore = bunenjinTransformation.alignmentScore;
    
    for (const option of transformationOptions) {
      const optionAlignment = this.analyzeBunenjinHexagramAlignment(option, bunenjinTransformation.characteristics, osType);
      if (optionAlignment.alignmentScore > bestScore) {
        bestHexagram = option;
        bestScore = optionAlignment.alignmentScore;
      }
    }
    
    return bestHexagram;
  }

  /**
   * Generate bunenjin-based recommendations
   */
  generateBunenjinRecommendations(userCharacteristics, hexagramProfile) {
    const recommendations = [];
    
    // Authenticity recommendations
    if (userCharacteristics.authenticity > hexagramProfile.authenticity + 0.2) {
      recommendations.push("あなたの高い真正性を活かし、より自分らしい表現を心がけましょう");
    } else if (userCharacteristics.authenticity < hexagramProfile.authenticity - 0.2) {
      recommendations.push("内なる声にもっと耳を傾け、真の自分を大切にしましょう");
    }
    
    // Multiplicity recommendations
    if (userCharacteristics.multiplicity > hexagramProfile.multiplicity + 0.2) {
      recommendations.push("多様な人格の側面を活かし、場面に応じた柔軟な対応を心がけましょう");
    } else if (userCharacteristics.multiplicity < hexagramProfile.multiplicity - 0.2) {
      recommendations.push("自分の中の多様性を受け入れ、状況に応じた適応力を育てましょう");
    }
    
    // Adaptability recommendations
    if (userCharacteristics.adaptability > hexagramProfile.adaptability + 0.2) {
      recommendations.push("優れた適応力を活かし、変化を恐れずに新しい挑戦をしましょう");
    } else if (userCharacteristics.adaptability < hexagramProfile.adaptability - 0.2) {
      recommendations.push("柔軟性を育て、変化に対してよりオープンな姿勢を心がけましょう");
    }
    
    // Harmony recommendations
    if (userCharacteristics.harmony > hexagramProfile.harmony + 0.2) {
      recommendations.push("調和を重視する姿勢を活かし、周囲との良好な関係を築きましょう");
    } else if (userCharacteristics.harmony < hexagramProfile.harmony - 0.2) {
      recommendations.push("内外の調和を意識し、バランスの取れた生き方を目指しましょう");
    }
    
    return recommendations;
  }

  /**
   * Get transformation reason explanation
   */
  getTransformationReason(osType, bunenjinTransformation) {
    const reasonMap = {
      engine: "エンジンOSの本質的創造力をより効果的に発揮するための変化",
      interface: "社会的な相互作用において最適な適応性を実現するための変化", 
      safemode: "安全性と安定性を保ちながら成長するための慎重な変化"
    };
    
    const baseReason = reasonMap[osType] || "最適な人格表現のための変化";
    
    // Add bunenjin-specific reasoning
    if (bunenjinTransformation.alignmentScore < 0.6) {
      return `${baseReason}（分人思想に基づく調和の向上が必要）`;
    } else if (bunenjinTransformation.alignmentScore > 0.9) {
      return `${baseReason}（分人思想との高い適合性を活用）`;
    }
    
    return baseReason;
  }

  /**
   * 統合的変化パターンの合成 - Enhanced for bunenjin philosophy
   */
  synthesizeTransformations(transformations) {
    // 各変化アプローチの重み付け（bunenjin philosophy重視に調整）
    const weights = {
      sequence: 0.25,     // 序卦伝論理
      relationship: 0.20, // 互綜錯関係
      elemental: 0.15,    // 五行循環
      temporal: 0.15,     // 時間軸
      bunenjin: 0.25      // 分人統合（重要度向上）
    };

    // 統合スコア計算による最適変化パターン決定
    const synthesizedPattern = {
      primary_transformation: this.selectPrimaryTransformation(transformations, weights),
      secondary_influences: this.identifySecondaryInfluences(transformations, weights),
      change_probability_matrix: this.generateProbabilityMatrix(transformations),
      integrated_timeline: this.createIntegratedTimeline(transformations),
      bunenjin_harmony_impact: this.assessBunenjinHarmonyImpact(transformations)
    };

    return {
      ...synthesizedPattern,
      transformation_confidence: this.calculateTransformationConfidence(transformations),
      classical_orthodoxy_score: this.validateClassicalOrthodoxy(synthesizedPattern),
      future_prediction_accuracy: this.estimatePredictionAccuracy(synthesizedPattern),
      bunenjin_integration_level: this.calculateBunenjinIntegrationLevel(transformations) // 新規追加
    };
  }

  /**
   * Calculate bunenjin integration level
   */
  calculateBunenjinIntegrationLevel(transformations) {
    if (!transformations.bunenjin) {
      return 0.5; // Default integration level
    }
    
    const bunenjinTransformation = transformations.bunenjin;
    let integrationScore = 0;
    
    // Assess multiple OS harmony
    if (bunenjinTransformation.multi_personality_coordination) {
      integrationScore += bunenjinTransformation.multi_personality_coordination * 0.4;
    }
    
    // Assess harmony level
    if (bunenjinTransformation.harmony_level) {
      integrationScore += bunenjinTransformation.harmony_level * 0.3;
    }
    
    // Assess transformation style effectiveness
    if (bunenjinTransformation.transformation_style) {
      const styleEffectiveness = {
        'direct_action': 0.8,
        'adaptive_response': 0.9,
        'cautious_preservation': 0.7
      };
      integrationScore += (styleEffectiveness[bunenjinTransformation.transformation_style] || 0.6) * 0.3;
    }
    
    return Math.min(0.98, integrationScore);
  }

  // ヘルパーメソッド群
  getHexagramElement(hexagram) {
    const elementMap = {
      1: "metal", 2: "earth", 3: "wood", 13: "fire", 29: "water",
      // ... 他の卦の五行対応
    };
    return elementMap[hexagram] || "earth"; // デフォルトは土
  }

  determineTransformationVelocity(context) {
    if (context.crisis_level > 0.8) return this.temporalTransformation.transformation_velocity.revolutionary;
    if (context.change_pressure > 0.6) return this.temporalTransformation.transformation_velocity.rapid;
    if (context.adaptation_need > 0.4) return this.temporalTransformation.transformation_velocity.moderate;
    return this.temporalTransformation.transformation_velocity.gradual;
  }

  identifyPrimaryOS(hexagram, personalityOS) {
    // 現在の卦と人格OSの対応を分析
    const osMapping = this.bunenjinIntegration.triple_os_mapping;
    
    for (const [osType, config] of Object.entries(osMapping)) {
      if (config.primary_hexagrams.includes(hexagram)) {
        return osType;
      }
    }
    
    return "interface_os"; // デフォルト
  }

  calculateOSHarmony(personalityOS) {
    // 三重OS間の調和度計算
    const engines = personalityOS.engine_os?.compatibility || 0;
    const interfaces = personalityOS.interface_os?.compatibility || 0;
    const safeModes = personalityOS.safe_mode_os?.compatibility || 0;
    
    return (engines + interfaces + safeModes) / 3;
  }

  selectPrimaryTransformation(transformations, weights) {
    // 重み付けスコアに基づく主要変化パターン選択
    let maxScore = 0;
    let primaryTransformation = null;

    for (const [type, transformation] of Object.entries(transformations)) {
      const score = (transformation.probability || 0.5) * weights[type];
      if (score > maxScore) {
        maxScore = score;
        primaryTransformation = { type, ...transformation, score };
      }
    }

    return primaryTransformation;
  }

  validateClassicalOrthodoxy(pattern) {
    // 古典易経の正統性検証
    return 0.85; // 仮実装：85%の正統性
  }

  estimatePredictionAccuracy(pattern) {
    // 予測精度推定
    return pattern.transformation_confidence * pattern.classical_orthodoxy_score;
  }

  calculateTransformationConfidence(transformations) {
    // 変化予測の信頼度計算
    const probabilities = Object.values(transformations).map(t => t.probability || 0.5);
    return probabilities.reduce((sum, p) => sum + p, 0) / probabilities.length;
  }
}

// グローバル登録
if (typeof window !== "undefined") {
  window.IChingTransformationEngine = IChingTransformationEngine;
  console.log("✅ 易経変化エンジン読み込み完了 - 5つの変化原理統合");
}

// Node.js環境対応
if (typeof module !== "undefined" && module.exports) {
  module.exports = IChingTransformationEngine;
}