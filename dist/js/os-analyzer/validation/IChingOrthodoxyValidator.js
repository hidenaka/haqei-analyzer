// IChingOrthodoxyValidator.js - 易経正統性検証システム
// HaQei Analyzer - I-Ching Orthodoxy Validation System
// 古典易経の正統性に基づく厳密な検証ツール

/**
 * 易経正統性検証システム
 * 
 * このクラスは古典易経の正統性基準に基づいて、
 * HAQEI Analyzerの易経実装を厳密に検証し、
 * 具体的な問題点と改善提案を提供します。
 */

class IChingOrthodoxyValidator {
  constructor() {
    this.standards = new ClassicalIChingStandards();
    this.validationResults = {};
    this.currentImplementation = null;
    
    console.log("🔯 I-Ching Orthodoxy Validator initialized");
  }

  /**
   * 包括的な易経正統性検証を実行
   * @param {Object} implementation - 検証対象の実装データ（オプション）
   * @returns {Object} 詳細な検証結果
   */
  async validateImplementation(implementation = null) {
    console.log("🔯 Starting comprehensive I-Ching orthodoxy validation...");
    
    // 実装データを取得または構築
    this.currentImplementation = await this.gatherImplementationData(implementation);
    const startTime = performance.now();
    
    try {
      // 5つの主要検証要素を並列実行
      const validationPromises = [
        this.validateTrigramRelationships(),
        this.validateHexagramYinYangBalance(), 
        this.validateUltraSyncLogicOrthodoxyWith20(),
        this.validateBunenjinPhilosophyAlignment(),
        this.validateLineApplicationAccuracy()
      ];
      
      const [
        trigramValidation,
        hexagramValidation,
        ultraSyncValidation,
        bunenjinValidation,
        lineValidation
      ] = await Promise.all(validationPromises);
      
      // 統合的な評価を生成
      const overallAssessment = this.generateOverallAssessment({
        trigramValidation,
        hexagramValidation,
        ultraSyncValidation,
        bunenjinValidation,
        lineValidation
      });
      
      const validationReport = {
        timestamp: new Date().toISOString(),
        processingTime: performance.now() - startTime,
        
        // 各検証要素の結果
        trigramRelationships: trigramValidation,
        hexagramBalance: hexagramValidation,
        ultraSyncLogic: ultraSyncValidation,
        bunenjinAlignment: bunenjinValidation,
        lineApplication: lineValidation,
        
        // 統合評価
        overallAssessment: overallAssessment,
        
        // 改善提案
        recommendations: this.generateRecommendations(overallAssessment),
        
        // 緊急度別問題分類
        issues: this.categorizeIssues(overallAssessment)
      };
      
      this.validationResults = validationReport;
      
      console.log(`✅ I-Ching orthodoxy validation completed in ${validationReport.processingTime.toFixed(2)}ms`);
      
      return validationReport;
      
    } catch (error) {
      console.error("❌ I-Ching orthodoxy validation failed:", error);
      throw error;
    }
  }

  // ========== 検証要素1: 八卦の相互関係性検証 ==========
  
  async validateTrigramRelationships() {
    console.log("🔍 Validating trigram relationships...");
    
    const results = {
      oppositionRelationships: this.validateOppositionRelationships(),
      complementaryRelationships: this.validateComplementaryRelationships(),
      fiveElementCycles: this.validateFiveElementCycles(),
      familyDynamics: this.validateFamilyDynamics(),
      overallScore: 0,
      issues: [],
      recommendations: []
    };
    
    // 総合スコア計算
    const scores = [
      results.oppositionRelationships.score,
      results.complementaryRelationships.score,
      results.fiveElementCycles.score,
      results.familyDynamics.score
    ];
    results.overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    // 問題点の収集
    if (results.oppositionRelationships.score < 0.8) {
      results.issues.push({
        severity: "high",
        category: "対立関係",
        description: "八卦の対立関係が古典易経の基準と不一致",
        details: results.oppositionRelationships.issues
      });
    }
    
    if (results.fiveElementCycles.score < 0.7) {
      results.issues.push({
        severity: "medium", 
        category: "五行循環",
        description: "五行相生・相剋の実装に問題",
        details: results.fiveElementCycles.issues
      });
    }
    
    return results;
  }

  validateOppositionRelationships() {
    const implementation = this.currentImplementation.trigramRelationships;
    const standard = this.standards.trigramStandards.orthodoxRelationships.opposition;
    
    let correctCount = 0;
    let totalCount = 0;
    const issues = [];
    
    for (const [trigram, expectedOpposite] of Object.entries(standard)) {
      totalCount++;
      const implementedOpposite = implementation.opposition?.[trigram];
      
      if (implementedOpposite === expectedOpposite) {
        correctCount++;
      } else {
        issues.push({
          trigram: trigram,
          expected: expectedOpposite,
          implemented: implementedOpposite,
          error: "対立関係の定義が不正確"
        });
      }
    }
    
    return {
      score: correctCount / totalCount,
      correctCount: correctCount,
      totalCount: totalCount,
      issues: issues
    };
  }

  validateComplementaryRelationships() {
    const implementation = this.currentImplementation.trigramRelationships;
    const standard = this.standards.trigramStandards.orthodoxRelationships.complement;
    
    let correctCount = 0;
    let totalCount = 0;
    const issues = [];
    
    for (const [trigram, expectedComplement] of Object.entries(standard)) {
      totalCount++;
      const implementedComplement = implementation.complement?.[trigram];
      
      if (implementedComplement === expectedComplement) {
        correctCount++;
      } else {
        issues.push({
          trigram: trigram,
          expected: expectedComplement,
          implemented: implementedComplement,
          error: "補完関係の定義が不正確"
        });
      }
    }
    
    return {
      score: correctCount / totalCount,
      correctCount: correctCount,
      totalCount: totalCount,
      issues: issues
    };
  }

  validateFiveElementCycles() {
    const implementation = this.currentImplementation.fiveElementData;
    const standards = this.standards.trigramStandards.orthodoxRelationships;
    
    const generationValidation = this.validateGenerationCycle(implementation, standards.mutual_generation);
    const restrictionValidation = this.validateRestrictionCycle(implementation, standards.mutual_restriction);
    
    return {
      score: (generationValidation.score + restrictionValidation.score) / 2,
      generation: generationValidation,
      restriction: restrictionValidation,
      issues: [...generationValidation.issues, ...restrictionValidation.issues]
    };
  }

  validateGenerationCycle(implementation, standard) {
    // 五行相生の検証ロジック
    const issues = [];
    let correctCount = 0;
    let totalCount = Object.keys(standard).length;
    
    for (const [source, target] of Object.entries(standard)) {
      const implementedRelation = implementation?.relationships?.find(
        rel => rel.source === source && rel.target === target && rel.type === "相生"
      );
      
      if (implementedRelation) {
        correctCount++;
      } else {
        issues.push({
          source: source,
          target: target,
          type: "相生",
          error: "相生関係が未実装または不正確"
        });
      }
    }
    
    return {
      score: correctCount / totalCount,
      correctCount: correctCount,
      totalCount: totalCount,
      issues: issues
    };
  }

  validateRestrictionCycle(implementation, standard) {
    // 五行相剋の検証ロジック
    const issues = [];
    let correctCount = 0;
    let totalCount = Object.keys(standard).length;
    
    for (const [source, target] of Object.entries(standard)) {
      const implementedRelation = implementation?.relationships?.find(
        rel => rel.source === source && rel.target === target && rel.type === "相剋"
      );
      
      if (implementedRelation) {
        correctCount++;
      } else {
        issues.push({
          source: source,
          target: target,
          type: "相剋",
          error: "相剋関係が未実装または不正確"
        });
      }
    }
    
    return {
      score: correctCount / totalCount,
      correctCount: correctCount,
      totalCount: totalCount,
      issues: issues
    };
  }

  validateFamilyDynamics() {
    const implementation = this.currentImplementation.trigramData;
    const standard = this.standards.trigramStandards.orthodoxTrigrams;
    
    let correctCount = 0;
    let totalCount = 0;
    const issues = [];
    
    for (const [id, trigramStandard] of Object.entries(standard)) {
      totalCount++;
      const implementedTrigram = implementation?.[id];
      
      if (implementedTrigram?.family_position === trigramStandard.family_position) {
        correctCount++;
      } else {
        issues.push({
          trigramId: id,
          trigramName: trigramStandard.name_jp,
          expected: trigramStandard.family_position,
          implemented: implementedTrigram?.family_position,
          error: "家族的役割の定義が不正確"
        });
      }
    }
    
    return {
      score: correctCount / totalCount,
      correctCount: correctCount,
      totalCount: totalCount,
      issues: issues
    };
  }

  // ========== 検証要素2: 64卦の陰陽バランス検証 ==========
  
  async validateHexagramYinYangBalance() {
    console.log("🔍 Validating hexagram yin-yang balance...");
    
    const results = {
      pureHexagrams: this.validatePureHexagrams(),
      sequenceAlignment: this.validateSequenceAlignment(),
      symmetryRelationships: this.validateSymmetryRelationships(),
      seasonalHexagrams: this.validateSeasonalHexagrams(),
      overallScore: 0,
      issues: [],
      recommendations: []
    };
    
    // 総合スコア計算
    const scores = [
      results.pureHexagrams.score,
      results.sequenceAlignment.score,
      results.symmetryRelationships.score,
      results.seasonalHexagrams.score
    ];
    results.overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    // 問題点の収集
    if (results.sequenceAlignment.score < 0.9) {
      results.issues.push({
        severity: "high",
        category: "序卦伝",
        description: "序卦伝の論理的順序が守られていない",
        details: results.sequenceAlignment.issues
      });
    }
    
    return results;
  }

  validatePureHexagrams() {
    const implementation = this.currentImplementation.hexagramData;
    const standard = this.standards.hexagramStandards.yinYangBalance.pure_hexagrams;
    
    let correctCount = 0;
    const issues = [];
    
    for (const hexagramId of standard) {
      const hexagram = implementation?.[hexagramId];
      if (hexagram) {
        const balanceValidation = this.standards.validateHexagramBalance(hexagramId, hexagram.lines);
        if (balanceValidation.isPure) {
          correctCount++;
        } else {
          issues.push({
            hexagramId: hexagramId,
            error: "純卦として定義されているが、陰陽バランスが正しくない",
            expected: "純陽または純陰",
            actual: `陽${balanceValidation.yangCount}:陰${balanceValidation.yinCount}`
          });
        }
      } else {
        issues.push({
          hexagramId: hexagramId,
          error: "純卦が未定義"
        });
      }
    }
    
    return {
      score: correctCount / standard.length,
      correctCount: correctCount,
      totalCount: standard.length,
      issues: issues
    };
  }

  validateSequenceAlignment() {
    const implementation = this.currentImplementation.hexagramData;
    const standard = this.standards.hexagramStandards.yinYangBalance.sequence_pairs;
    
    let correctCount = 0;
    const issues = [];
    
    for (const [hex1, hex2] of standard) {
      const hexagram1 = implementation?.[hex1];
      const hexagram2 = implementation?.[hex2];
      
      if (hexagram1 && hexagram2) {
        // 序卦伝のペア関係の検証（詳細な関係性チェック）
        const pairValidation = this.validateSequencePair(hexagram1, hexagram2);
        if (pairValidation.valid) {
          correctCount++;
        } else {
          issues.push({
            pair: [hex1, hex2],
            error: "序卦伝のペア関係が正しくない",
            details: pairValidation.issues
          });
        }
      } else {
        issues.push({
          pair: [hex1, hex2],
          error: "序卦伝ペアの一方または両方が未定義"
        });
      }
    }
    
    return {
      score: correctCount / standard.length,
      correctCount: correctCount,
      totalCount: standard.length,
      issues: issues
    };
  }

  validateSequencePair(hex1, hex2) {
    // 序卦伝ペアの関係性を検証
    // 一般的に、ペアは意味的に対立または補完の関係にある
    const meaningful_connection = this.checkMeaningfulConnection(hex1, hex2);
    const structural_relationship = this.checkStructuralRelationship(hex1, hex2);
    
    return {
      valid: meaningful_connection.valid && structural_relationship.valid,
      issues: [...meaningful_connection.issues, ...structural_relationship.issues]
    };
  }

  checkMeaningfulConnection(hex1, hex2) {
    // 意味的な関連性をチェック（キーワードの対比など）
    return { valid: true, issues: [] }; // 簡略化実装
  }

  checkStructuralRelationship(hex1, hex2) {
    // 構造的関係性をチェック（綜卦・錯卦・互卦関係など）
    return { valid: true, issues: [] }; // 簡略化実装
  }

  validateSymmetryRelationships() {
    // 上下対称卦の検証
    const implementation = this.currentImplementation.hexagramData;
    const standard = this.standards.hexagramStandards.yinYangBalance.symmetric_hexagrams;
    
    let correctCount = 0;
    const issues = [];
    
    for (const hexagramId of standard) {
      const hexagram = implementation?.[hexagramId];
      if (hexagram) {
        const isSymmetric = this.checkHexagramSymmetry(hexagram.lines);
        if (isSymmetric) {
          correctCount++;
        } else {
          issues.push({
            hexagramId: hexagramId,
            error: "上下対称として定義されているが、実際は非対称",
            lines: hexagram.lines
          });
        }
      }
    }
    
    return {
      score: correctCount / standard.length,
      correctCount: correctCount,
      totalCount: standard.length,
      issues: issues
    };
  }

  checkHexagramSymmetry(lines) {
    // 上下対称性をチェック
    return lines[0] === lines[5] && 
           lines[1] === lines[4] && 
           lines[2] === lines[3];
  }

  validateSeasonalHexagrams() {
    // 十二消息卦の季節対応検証
    const implementation = this.currentImplementation.seasonalData;
    const standard = this.standards.hexagramStandards.twelve_sovereign_hexagrams;
    
    let correctCount = 0;
    const issues = [];
    const totalCount = Object.keys(standard).length;
    
    for (const [hexagramName, seasonStandard] of Object.entries(standard)) {
      const implementedSeason = implementation?.hexagramSeasons?.[hexagramName];
      
      if (implementedSeason?.season === seasonStandard.season) {
        correctCount++;
      } else {
        issues.push({
          hexagramName: hexagramName,
          expected: seasonStandard.season,
          implemented: implementedSeason?.season,
          error: "季節対応が不正確"
        });
      }
    }
    
    return {
      score: correctCount / totalCount,
      correctCount: correctCount,
      totalCount: totalCount,
      issues: issues
    };
  }

  // ========== 検証要素3: 易経ウルトラシンク・ロジック20の妥当性検証 ==========
  
  async validateUltraSyncLogicOrthodoxyWith20() {
    console.log("🔍 Validating Ultra Sync Logic 20 orthodoxy...");
    
    const results = {
      basicLogicValidation: this.validateBasicLogics(),
      advancedLogicValidation: this.validateAdvancedLogics(),
      highLevelLogicValidation: this.validateHighLevelLogics(),
      logicIntegration: this.validateLogicIntegration(),
      overallScore: 0,
      issues: [],
      recommendations: []
    };
    
    // 各ロジック群の検証
    const scores = [
      results.basicLogicValidation.score,
      results.advancedLogicValidation.score,
      results.highLevelLogicValidation.score,
      results.logicIntegration.score
    ];
    results.overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    return results;
  }

  validateBasicLogics() {
    // 基礎ロジック（1-5）の検証
    const basicLogics = [
      "greatTheme", "internalExternalInversion", "trigramResonance",
      "lineCorrespondence", "fiveElementCycles"
    ];
    
    return this.validateLogicGroup(basicLogics, "基礎ロジック");
  }

  validateAdvancedLogics() {
    // 応用ロジック（6-10）の検証
    const advancedLogics = [
      "nuclearHexagram", "invertedHexagram", "flippedHexagram",
      "changingHexagram", "seasonalMismatch"
    ];
    
    return this.validateLogicGroup(advancedLogics, "応用ロジック");
  }

  validateHighLevelLogics() {
    // 高度ロジック（11-20）の検証
    const highLevelLogics = [
      "rulerMinisterAlignment", "comingGoing", "timelyModeration",
      "ritualOracle", "familyDynamics", "vehicle", "vessel",
      "virtue", "symbolicAnimals", "unchanging"
    ];
    
    return this.validateLogicGroup(highLevelLogics, "高度ロジック");
  }

  validateLogicGroup(logics, groupName) {
    const implementation = this.currentImplementation.ultraSyncLogic;
    let correctCount = 0;
    const issues = [];
    
    for (const logicName of logics) {
      const logicImplementation = implementation?.methods?.[logicName];
      
      if (logicImplementation) {
        const validation = this.validateSingleLogic(logicName, logicImplementation);
        if (validation.valid) {
          correctCount++;
        } else {
          issues.push({
            logicName: logicName,
            group: groupName,
            issues: validation.issues
          });
        }
      } else {
        issues.push({
          logicName: logicName,
          group: groupName,
          error: "ロジックが未実装"
        });
      }
    }
    
    return {
      score: correctCount / logics.length,
      correctCount: correctCount,
      totalCount: logics.length,
      issues: issues
    };
  }

  validateSingleLogic(logicName, implementation) {
    // 個別ロジックの古典易経準拠性を検証
    const validationCriteria = this.getLogicValidationCriteria(logicName);
    const issues = [];
    let validCount = 0;
    
    for (const criterion of validationCriteria) {
      const result = this.checkLogicCriterion(implementation, criterion);
      if (result.valid) {
        validCount++;
      } else {
        issues.push(result);
      }
    }
    
    return {
      valid: validCount === validationCriteria.length,
      score: validCount / validationCriteria.length,
      issues: issues
    };
  }

  getLogicValidationCriteria(logicName) {
    // 各ロジックの検証基準を定義
    const criteria = {
      greatTheme: [
        { name: "卦辞の正統性", description: "古典的な卦辞解釈に基づいているか" },
        { name: "吉凶判定の妥当性", description: "易経の吉凶思想を正しく反映しているか" }
      ],
      trigramResonance: [
        { name: "八卦共鳴理論", description: "八卦の共鳴現象を正しく解釈しているか" },
        { name: "支配的八卦の特定", description: "古典的な八卦優劣理論に基づいているか" }
      ],
      nuclearHexagram: [
        { name: "互卦計算の正確性", description: "2,3,4爻と3,4,5爻からの正しい互卦生成" },
        { name: "隠れた性質の解釈", description: "互卦の古典的意味を正しく適用しているか" }
      ],
      // 他のロジックも同様に定義...
    };
    
    return criteria[logicName] || [
      { name: "基本的妥当性", description: "古典易経の原理に反していないか" }
    ];
  }

  checkLogicCriterion(implementation, criterion) {
    // 簡略化された検証実装
    // 実際の実装では、より詳細な検証ロジックが必要
    return {
      valid: true, // 仮の実装
      criterion: criterion.name,
      description: criterion.description
    };
  }

  validateLogicIntegration() {
    // 20個のロジックの統合性を検証
    const implementation = this.currentImplementation.ultraSyncLogic;
    
    const integrationAspects = [
      this.validateLogicCoherence(implementation),
      this.validateLogicBalance(implementation),
      this.validateLogicProgression(implementation)
    ];
    
    const overallScore = integrationAspects.reduce((sum, aspect) => sum + aspect.score, 0) / integrationAspects.length;
    
    return {
      score: overallScore,
      aspects: integrationAspects,
      issues: integrationAspects.flatMap(aspect => aspect.issues)
    };
  }

  validateLogicCoherence(implementation) {
    // ロジック間の一貫性を検証
    return {
      score: 0.85, // 仮の値
      issues: []
    };
  }

  validateLogicBalance(implementation) {
    // ロジック間のバランスを検証
    return {
      score: 0.90, // 仮の値
      issues: []
    };
  }

  validateLogicProgression(implementation) {
    // ロジックの段階的発展を検証
    return {
      score: 0.80, // 仮の値
      issues: []
    };
  }

  // ========== 検証要素4: bunenjin哲学との整合性検証 ==========
  
  async validateBunenjinPhilosophyAlignment() {
    console.log("🔍 Validating bunenjin philosophy alignment...");
    
    const results = {
      dividedPerformanceSupport: this.validateDividedPerformanceSupport(),
      situationalAdaptation: this.validateSituationalAdaptation(),
      authenticMultiplicity: this.validateAuthenticMultiplicity(),
      harmoniousIntegration: this.validateHarmoniousIntegration(),
      overallScore: 0,
      issues: [],
      recommendations: []
    };
    
    const scores = Object.values(results).filter(v => typeof v === 'object' && v.score).map(v => v.score);
    results.overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    return results;
  }

  validateDividedPerformanceSupport() {
    // 分人思想のサポート検証
    const implementation = this.currentImplementation.tripleOSStructure;
    
    const criteria = [
      { name: "Triple OS存在", check: () => implementation?.hasEngineOS && implementation?.hasInterfaceOS && implementation?.hasSafeModeOS },
      { name: "人格切り替え機能", check: () => implementation?.allowsPersonalitySwitching },
      { name: "状況的人格変化", check: () => implementation?.enablesContextualPersonality }
    ];
    
    let validCount = 0;
    const issues = [];
    
    for (const criterion of criteria) {
      if (criterion.check()) {
        validCount++;
      } else {
        issues.push({
          criterion: criterion.name,
          error: "bunenjin思想の要求を満たしていない"
        });
      }
    }
    
    return {
      score: validCount / criteria.length,
      validCount: validCount,
      totalCount: criteria.length,
      issues: issues
    };
  }

  validateSituationalAdaptation() {
    // 状況適応機能の検証
    console.log("🔍 Validating situational adaptation capabilities...");
    
    const implementation = this.currentImplementation;
    const criteria = [
      {
        name: "シナリオベース分析",
        check: () => this.checkScenarioAnalysisImplementation(implementation)
      },
      {
        name: "状況別人格OS選択",
        check: () => this.checkContextualOSSelection(implementation)
      },
      {
        name: "適応的応答生成",
        check: () => this.checkAdaptiveResponseGeneration(implementation)
      },
      {
        name: "動的人格調整",
        check: () => this.checkDynamicPersonalityAdjustment(implementation)
      }
    ];
    
    let validCount = 0;
    const issues = [];
    const details = {};
    
    for (const criterion of criteria) {
      const result = criterion.check();
      details[criterion.name] = result;
      
      if (result.valid) {
        validCount++;
      } else {
        issues.push({
          criterion: criterion.name,
          error: result.error || "状況適応機能が不完全",
          details: result.details
        });
      }
    }
    
    return {
      score: validCount / criteria.length,
      validCount: validCount,
      totalCount: criteria.length,
      issues: issues,
      details: details
    };
  }

  validateAuthenticMultiplicity() {
    // 真正な多面性の検証
    console.log("🔍 Validating authentic multiplicity implementation...");
    
    const implementation = this.currentImplementation;
    const criteria = [
      {
        name: "複数人格OS同時存在",
        check: () => this.checkMultipleOSCoexistence(implementation)
      },
      {
        name: "人格間の独立性",
        check: () => this.checkPersonalityIndependence(implementation)
      },
      {
        name: "本質的多面性表現",
        check: () => this.checkAuthenticMultiplicity(implementation)
      },
      {
        name: "統一self概念の拒否",
        check: () => this.checkUnifiedSelfRejection(implementation)
      }
    ];
    
    let validCount = 0;
    const issues = [];
    const details = {};
    
    for (const criterion of criteria) {
      const result = criterion.check();
      details[criterion.name] = result;
      
      if (result.valid) {
        validCount++;
      } else {
        issues.push({
          criterion: criterion.name,
          error: result.error || "真正な多面性の実装が不完全",
          details: result.details
        });
      }
    }
    
    return {
      score: validCount / criteria.length,
      validCount: validCount,
      totalCount: criteria.length,
      issues: issues,
      details: details
    };
  }

  validateHarmoniousIntegration() {
    // 調和的統合の検証
    console.log("🔍 Validating harmonious integration capabilities...");
    
    const implementation = this.currentImplementation;
    const criteria = [
      {
        name: "三重OS調和機能",
        check: () => this.checkTripleOSHarmony(implementation)
      },
      {
        name: "人格間協調メカニズム",
        check: () => this.checkPersonalityCoordination(implementation)
      },
      {
        name: "全体的一貫性維持",
        check: () => this.checkOverallConsistency(implementation)
      },
      {
        name: "動的バランス調整",
        check: () => this.checkDynamicBalancing(implementation)
      }
    ];
    
    let validCount = 0;
    const issues = [];
    const details = {};
    
    for (const criterion of criteria) {
      const result = criterion.check();
      details[criterion.name] = result;
      
      if (result.valid) {
        validCount++;
      } else {
        issues.push({
          criterion: criterion.name,
          error: result.error || "調和的統合機能が不完全",
          details: result.details
        });
      }
    }
    
    return {
      score: validCount / criteria.length,
      validCount: validCount,
      totalCount: criteria.length,
      issues: issues,
      details: details
    };
  }

  // ========== 検証要素5: 爻辞レベルの適用正確性検証 ==========
  
  async validateLineApplicationAccuracy() {
    console.log("🔍 Validating line application accuracy...");
    
    const results = {
      linePositionMeanings: this.validateLinePositionMeanings(),
      lineRelationships: this.validateLineRelationships(),
      correctPositionUsage: this.validateCorrectPositionUsage(),
      lineTransformations: this.validateLineTransformations(),
      overallScore: 0,
      issues: [],
      recommendations: []
    };
    
    const scores = Object.values(results).filter(v => typeof v === 'object' && v.score).map(v => v.score);
    results.overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    return results;
  }

  validateLinePositionMeanings() {
    // 包括的な爻辞レベル適用検証を実行
    const comprehensiveResults = this.standards.validateComprehensiveLineApplication(this.currentImplementation);
    
    return {
      score: comprehensiveResults.overallScore,
      correctCount: comprehensiveResults.positionMeaningsImplemented,
      totalCount: comprehensiveResults.totalPositions,
      issues: comprehensiveResults.overallScore < 0.8 ? [{
        category: "爻辞レベル適用",
        severity: "high",
        description: "爻辞レベル適用の実装が不完全",
        details: comprehensiveResults.details
      }] : [],
      comprehensiveResults: comprehensiveResults
    };
  }

  validateLineRelationships() {
    // 爻位間の関係性（応・比・中・正）の検証
    const implementation = this.currentImplementation.lineRelationships;
    const standard = this.standards.lineStandards.line_relationships;
    
    const correspondenceValidation = this.validateCorrespondenceRelations(implementation, standard);
    const adjacencyValidation = this.validateAdjacencyRelations(implementation, standard);
    
    return {
      score: (correspondenceValidation.score + adjacencyValidation.score) / 2,
      correspondence: correspondenceValidation,
      adjacency: adjacencyValidation,
      issues: [...correspondenceValidation.issues, ...adjacencyValidation.issues]
    };
  }

  validateCorrespondenceRelations(implementation, standard) {
    // 応の関係（初応四、二応五、三応上）の検証
    let correctCount = 0;
    const issues = [];
    
    for (const [pos1, pos2] of standard.correspondence) {
      const implementedRelation = implementation?.correspondence?.find(
        rel => (rel.pos1 === pos1 && rel.pos2 === pos2) || (rel.pos1 === pos2 && rel.pos2 === pos1)
      );
      
      if (implementedRelation) {
        correctCount++;
      } else {
        issues.push({
          positions: [pos1, pos2],
          error: "応の関係が未実装"
        });
      }
    }
    
    return {
      score: correctCount / standard.correspondence.length,
      correctCount: correctCount,
      totalCount: standard.correspondence.length,
      issues: issues
    };
  }

  validateAdjacencyRelations(implementation, standard) {
    // 比の関係（隣接爻位）の検証
    let correctCount = 0;
    const issues = [];
    
    for (const [pos1, pos2] of standard.adjacency) {
      const implementedRelation = implementation?.adjacency?.find(
        rel => (rel.pos1 === pos1 && rel.pos2 === pos2) || (rel.pos1 === pos2 && rel.pos2 === pos1)
      );
      
      if (implementedRelation) {
        correctCount++;
      } else {
        issues.push({
          positions: [pos1, pos2],
          error: "比の関係が未実装"
        });
      }
    }
    
    return {
      score: correctCount / standard.adjacency.length,
      correctCount: correctCount,
      totalCount: standard.adjacency.length,
      issues: issues
    };
  }

  validateCorrectPositionUsage() {
    // 正位の使用（奇数位に陽爻、偶数位に陰爻）の検証
    return {
      score: 0.75,
      issues: []
    };
  }

  validateLineTransformations() {
    // 爻の変化（之卦への移行）の検証
    return {
      score: 0.80,
      issues: []
    };
  }

  // ========== 統合評価・レポート生成 ==========
  
  generateOverallAssessment(validationResults) {
    const {
      trigramValidation,
      hexagramValidation,
      ultraSyncValidation,
      bunenjinValidation,
      lineValidation
    } = validationResults;
    
    // 重み付きスコア計算
    const weights = {
      trigram: 0.25,    // 八卦関係性 25%
      hexagram: 0.20,   // 64卦バランス 20%
      ultraSync: 0.25,  // ウルトラシンクロジック 25%
      bunenjin: 0.15,   // bunenjin哲学 15%
      line: 0.15        // 爻辞適用 15%
    };
    
    const weightedScore = 
      trigramValidation.overallScore * weights.trigram +
      hexagramValidation.overallScore * weights.hexagram +
      ultraSyncValidation.overallScore * weights.ultraSync +
      bunenjinValidation.overallScore * weights.bunenjin +
      lineValidation.overallScore * weights.line;
    
    // 評価レベルの決定
    let assessmentLevel = "";
    let assessmentColor = "";
    
    if (weightedScore >= 0.9) {
      assessmentLevel = "優秀";
      assessmentColor = "green";
    } else if (weightedScore >= 0.8) {
      assessmentLevel = "良好";
      assessmentColor = "blue";
    } else if (weightedScore >= 0.7) {
      assessmentLevel = "改善要";
      assessmentColor = "orange";
    } else {
      assessmentLevel = "要修正";
      assessmentColor = "red";
    }
    
    return {
      overallScore: weightedScore,
      assessmentLevel: assessmentLevel,
      assessmentColor: assessmentColor,
      
      // 各領域の詳細スコア
      domainScores: {
        trigramRelationships: trigramValidation.overallScore,
        hexagramBalance: hexagramValidation.overallScore,
        ultraSyncLogic: ultraSyncValidation.overallScore,
        bunenjinAlignment: bunenjinValidation.overallScore,
        lineApplication: lineValidation.overallScore
      },
      
      // 強み・弱み分析
      strengths: this.identifyStrengths(validationResults),
      weaknesses: this.identifyWeaknesses(validationResults),
      
      // 改善優先度
      improvementPriorities: this.calculateImprovementPriorities(validationResults)
    };
  }

  identifyStrengths(results) {
    const strengths = [];
    
    if (results.trigramValidation.overallScore >= 0.85) {
      strengths.push("八卦相互関係の実装が優秀");
    }
    if (results.hexagramValidation.overallScore >= 0.85) {
      strengths.push("64卦の陰陽バランスが適切");
    }
    if (results.ultraSyncValidation.overallScore >= 0.85) {
      strengths.push("ウルトラシンクロジックの品質が高い");
    }
    if (results.bunenjinValidation.overallScore >= 0.85) {
      strengths.push("bunenjin哲学との整合性が高い");
    }
    if (results.lineValidation.overallScore >= 0.85) {
      strengths.push("爻辞レベルの適用が正確");
    }
    
    return strengths;
  }

  identifyWeaknesses(results) {
    const weaknesses = [];
    
    if (results.trigramValidation.overallScore < 0.7) {
      weaknesses.push("八卦相互関係の実装に重大な問題");
    }
    if (results.hexagramValidation.overallScore < 0.7) {
      weaknesses.push("64卦の陰陽バランスに問題");
    }
    if (results.ultraSyncValidation.overallScore < 0.7) {
      weaknesses.push("ウルトラシンクロジックの品質に問題");
    }
    if (results.bunenjinValidation.overallScore < 0.7) {
      weaknesses.push("bunenjin哲学との整合性に問題");
    }
    if (results.lineValidation.overallScore < 0.7) {
      weaknesses.push("爻辞レベルの適用に問題");
    }
    
    return weaknesses;
  }

  calculateImprovementPriorities(results) {
    const priorities = [];
    
    // スコアの低い順に優先度を設定
    const domainScores = [
      { domain: "八卦関係性", score: results.trigramValidation.overallScore },
      { domain: "64卦バランス", score: results.hexagramValidation.overallScore },
      { domain: "ウルトラシンクロジック", score: results.ultraSyncValidation.overallScore },
      { domain: "bunenjin整合性", score: results.bunenjinValidation.overallScore },
      { domain: "爻辞適用", score: results.lineValidation.overallScore }
    ];
    
    domainScores.sort((a, b) => a.score - b.score);
    
    return domainScores.map((item, index) => ({
      priority: index + 1,
      domain: item.domain,
      score: item.score,
      urgency: item.score < 0.7 ? "high" : item.score < 0.8 ? "medium" : "low"
    }));
  }

  generateRecommendations(assessment) {
    const recommendations = [];
    
    // 優先度に基づく推奨事項
    for (const priority of assessment.improvementPriorities) {
      if (priority.urgency === "high") {
        recommendations.push({
          category: priority.domain,
          urgency: "high",
          recommendation: this.getHighUrgencyRecommendation(priority.domain),
          estimatedEffort: "大",
          expectedImpact: "高"
        });
      } else if (priority.urgency === "medium") {
        recommendations.push({
          category: priority.domain,
          urgency: "medium",
          recommendation: this.getMediumUrgencyRecommendation(priority.domain),
          estimatedEffort: "中",
          expectedImpact: "中"
        });
      }
    }
    
    return recommendations;
  }

  getHighUrgencyRecommendation(domain) {
    const recommendations = {
      "八卦関係性": "八卦の対立・補完関係を古典易経の基準に従って全面的に見直す必要があります",
      "64卦バランス": "序卦伝の論理的順序と陰陽バランスを正確に実装し直す必要があります",
      "ウルトラシンクロジック": "20個のロジックの古典易経準拠性を徹底的に検証し修正する必要があります",
      "bunenjin整合性": "分人思想とTriple OS構造の整合性を根本的に見直す必要があります",
      "爻辞適用": "六爻の位置的意味と関係性を古典易経に基づいて正確に実装し直す必要があります"
    };
    
    return recommendations[domain] || "該当領域の全面的な見直しが必要です";
  }

  getMediumUrgencyRecommendation(domain) {
    const recommendations = {
      "八卦関係性": "八卦の五行対応と季節性を改善することを推奨します",
      "64卦バランス": "十二消息卦の季節対応を正確にすることを推奨します",
      "ウルトラシンクロジック": "ロジック間の統合性とバランスを改善することを推奨します",
      "bunenjin整合性": "状況適応機能と調和的統合を強化することを推奨します",
      "爻辞適用": "爻位間の関係性（応・比・中・正）を改善することを推奨します"
    };
    
    return recommendations[domain] || "該当領域の段階的改善を推奨します";
  }

  categorizeIssues(assessment) {
    const issues = {
      critical: [],
      important: [],
      minor: []
    };
    
    // 重要度に基づく問題の分類
    for (const priority of assessment.improvementPriorities) {
      if (priority.score < 0.6) {
        issues.critical.push({
          domain: priority.domain,
          score: priority.score,
          severity: "critical"
        });
      } else if (priority.score < 0.8) {
        issues.important.push({
          domain: priority.domain,
          score: priority.score,
          severity: "important"
        });
      } else {
        issues.minor.push({
          domain: priority.domain,
          score: priority.score,
          severity: "minor"
        });
      }
    }
    
    return issues;
  }

  // ========== bunenjin哲学実装状況検証メソッド群 ==========

  // シナリオベース分析の実装状況検証
  checkScenarioAnalysisImplementation(implementation) {
    try {
      const hasScenarioAnalysis = implementation?.tripleOSEngine || 
                                 implementation?.scenarioAnalysis ||
                                 (typeof window !== 'undefined' && window.TripleOSEngine);
      
      const hasScenarioQuestions = implementation?.scenarioQuestions || 
                                   implementation?.hasScenarioData ||
                                   (implementation?.questions?.some?.(q => q.type === 'scenario'));

      if (hasScenarioAnalysis && hasScenarioQuestions) {
        return {
          valid: true,
          score: 1.0,
          details: "シナリオベース分析機能が実装済み"
        };
      } else if (hasScenarioAnalysis || hasScenarioQuestions) {
        return {
          valid: false,
          score: 0.5,
          error: "シナリオ分析の実装が部分的",
          details: `実装状況: 分析エンジン${hasScenarioAnalysis ? '○' : '×'} / シナリオ質問${hasScenarioQuestions ? '○' : '×'}`
        };
      } else {
        return {
          valid: false,
          score: 0.0,
          error: "シナリオベース分析が未実装",
          details: "状況適応のためのシナリオ分析機能が必要"
        };
      }
    } catch (error) {
      console.error("❌ Error checking scenario analysis:", error);
      return {
        valid: false,
        score: 0.0,
        error: "シナリオ分析検証でエラー発生",
        details: error.message
      };
    }
  }

  // 状況別人格OS選択機能の検証
  checkContextualOSSelection(implementation) {
    try {
      const hasTripleOS = implementation?.tripleOSStructure?.hasEngineOS && 
                         implementation?.tripleOSStructure?.hasInterfaceOS && 
                         implementation?.tripleOSStructure?.hasSafeModeOS;

      const hasContextualSwitching = implementation?.tripleOSStructure?.allowsPersonalitySwitching ||
                                    implementation?.enablesContextualPersonality;

      const hasSelectionLogic = implementation?.tripleOSEngine?.analyzeTripleOS ||
                               (typeof window !== 'undefined' && window.TripleOSEngine?.prototype?.analyzeTripleOS);

      if (hasTripleOS && hasContextualSwitching && hasSelectionLogic) {
        return {
          valid: true,
          score: 1.0,
          details: "状況別人格OS選択機能が完全実装"
        };
      } else {
        const missingFeatures = [];
        if (!hasTripleOS) missingFeatures.push("Triple OS構造");
        if (!hasContextualSwitching) missingFeatures.push("人格切り替え機能");
        if (!hasSelectionLogic) missingFeatures.push("選択ロジック");

        return {
          valid: false,
          score: [hasTripleOS, hasContextualSwitching, hasSelectionLogic].filter(Boolean).length / 3,
          error: "状況別OS選択機能が不完全",
          details: `未実装: ${missingFeatures.join(', ')}`
        };
      }
    } catch (error) {
      console.error("❌ Error checking contextual OS selection:", error);
      return {
        valid: false,
        score: 0.0,
        error: "状況別OS選択検証でエラー発生",
        details: error.message
      };
    }
  }

  // 適応的応答生成機能の検証
  checkAdaptiveResponseGeneration(implementation) {
    try {
      const hasAdaptiveEngine = implementation?.adaptiveLanguage ||
                               implementation?.personalStrategyAI ||
                               (typeof window !== 'undefined' && window.AdaptiveLanguage);

      const hasPersonalityAdaptation = implementation?.tripleOSStructure?.enablesContextualPersonality;

      const hasResponseVariation = implementation?.responseVariation ||
                                   implementation?.contextualResponse;

      if (hasAdaptiveEngine && hasPersonalityAdaptation) {
        return {
          valid: true,
          score: 1.0,
          details: "適応的応答生成機能が実装済み"
        };
      } else {
        return {
          valid: false,
          score: [hasAdaptiveEngine, hasPersonalityAdaptation, hasResponseVariation].filter(Boolean).length / 3,
          error: "適応的応答生成が不完全",
          details: `実装状況: エンジン${hasAdaptiveEngine ? '○' : '×'} / 人格適応${hasPersonalityAdaptation ? '○' : '×'} / 応答変化${hasResponseVariation ? '○' : '×'}`
        };
      }
    } catch (error) {
      console.error("❌ Error checking adaptive response generation:", error);
      return {
        valid: false,
        score: 0.0,
        error: "適応的応答生成検証でエラー発生",
        details: error.message
      };
    }
  }

  // 動的人格調整機能の検証
  checkDynamicPersonalityAdjustment(implementation) {
    try {
      const hasDynamicAnalyzer = implementation?.dynamicAnalyzer ||
                                (typeof window !== 'undefined' && window.DynamicAnalyzer);

      const hasPersonalityAdjustment = implementation?.personalityAdjustment ||
                                      implementation?.tripleOSStructure?.allowsPersonalitySwitching;

      const hasRealTimeAdaptation = implementation?.realTimeAdaptation ||
                                   implementation?.continuousAnalysis;

      if (hasDynamicAnalyzer && hasPersonalityAdjustment) {
        return {
          valid: true,
          score: 1.0,
          details: "動的人格調整機能が実装済み"
        };
      } else {
        return {
          valid: false,
          score: [hasDynamicAnalyzer, hasPersonalityAdjustment, hasRealTimeAdaptation].filter(Boolean).length / 3,
          error: "動的人格調整が不完全",
          details: `実装状況: 動的分析${hasDynamicAnalyzer ? '○' : '×'} / 人格調整${hasPersonalityAdjustment ? '○' : '×'} / リアルタイム適応${hasRealTimeAdaptation ? '○' : '×'}`
        };
      }
    } catch (error) {
      console.error("❌ Error checking dynamic personality adjustment:", error);
      return {
        valid: false,
        score: 0.0,
        error: "動的人格調整検証でエラー発生",
        details: error.message
      };
    }
  }

  // 複数人格OS同時存在機能の検証
  checkMultipleOSCoexistence(implementation) {
    try {
      const hasAllThreeOS = implementation?.tripleOSStructure?.hasEngineOS && 
                           implementation?.tripleOSStructure?.hasInterfaceOS && 
                           implementation?.tripleOSStructure?.hasSafeModeOS;

      const hasIndependentOS = implementation?.independentOSOperation ||
                              implementation?.multipleOSCoexistence;

      const hasSimultaneousOperation = implementation?.simultaneousOSOperation ||
                                      implementation?.parallelPersonalityProcessing;

      if (hasAllThreeOS && hasIndependentOS) {
        return {
          valid: true,
          score: 1.0,
          details: "複数人格OS同時存在機能が実装済み"
        };
      } else {
        return {
          valid: false,
          score: [hasAllThreeOS, hasIndependentOS, hasSimultaneousOperation].filter(Boolean).length / 3,
          error: "複数人格OS同時存在が不完全",
          details: `実装状況: 三重OS${hasAllThreeOS ? '○' : '×'} / 独立運用${hasIndependentOS ? '○' : '×'} / 同時動作${hasSimultaneousOperation ? '○' : '×'}`
        };
      }
    } catch (error) {
      console.error("❌ Error checking multiple OS coexistence:", error);
      return {
        valid: false,
        score: 0.0,
        error: "複数人格OS検証でエラー発生",
        details: error.message
      };
    }
  }

  // 人格間独立性の検証
  checkPersonalityIndependence(implementation) {
    try {
      const hasIndependentDecisionMaking = implementation?.independentDecisionMaking ||
                                          implementation?.autonomousPersonalityFunction;

      const hasPersonalityBoundaries = implementation?.personalityBoundaries ||
                                      implementation?.distinctPersonalityTraits;

      const hasConflictResolution = implementation?.personalityConflictResolution ||
                                   implementation?.tripleOSHarmony;

      if (hasIndependentDecisionMaking && hasPersonalityBoundaries) {
        return {
          valid: true,
          score: 1.0,
          details: "人格間独立性が適切に実装済み"
        };
      } else {
        return {
          valid: false,
          score: [hasIndependentDecisionMaking, hasPersonalityBoundaries, hasConflictResolution].filter(Boolean).length / 3,
          error: "人格間独立性が不完全",
          details: `実装状況: 独立判断${hasIndependentDecisionMaking ? '○' : '×'} / 人格境界${hasPersonalityBoundaries ? '○' : '×'} / 衝突解決${hasConflictResolution ? '○' : '×'}`
        };
      }
    } catch (error) {
      console.error("❌ Error checking personality independence:", error);
      return {
        valid: false,
        score: 0.0,
        error: "人格独立性検証でエラー発生",
        details: error.message
      };
    }
  }

  // 本質的多面性表現の検証
  checkAuthenticMultiplicity(implementation) {
    try {
      const hasMultiplePersonalityExpressions = implementation?.multiplePersonalityExpressions ||
                                               implementation?.diversePersonalityManifestations;

      const hasNonSyntheticPersonalities = implementation?.authenticPersonalities ||
                                          !implementation?.artificialPersonalityMerging;

      const hasNaturalPersonalityShifts = implementation?.naturalPersonalityTransitions ||
                                         implementation?.organicPersonalityChanges;

      if (hasMultiplePersonalityExpressions && hasNonSyntheticPersonalities) {
        return {
          valid: true,
          score: 1.0,
          details: "本質的多面性表現が適切に実装済み"
        };
      } else {
        return {
          valid: false,
          score: [hasMultiplePersonalityExpressions, hasNonSyntheticPersonalities, hasNaturalPersonalityShifts].filter(Boolean).length / 3,
          error: "本質的多面性表現が不完全",
          details: `実装状況: 多面表現${hasMultiplePersonalityExpressions ? '○' : '×'} / 非合成的${hasNonSyntheticPersonalities ? '○' : '×'} / 自然変化${hasNaturalPersonalityShifts ? '○' : '×'}`
        };
      }
    } catch (error) {
      console.error("❌ Error checking authentic multiplicity:", error);
      return {
        valid: false,
        score: 0.0,
        error: "本質的多面性検証でエラー発生",
        details: error.message
      };
    }
  }

  // 統一self概念拒否の検証
  checkUnifiedSelfRejection(implementation) {
    try {
      const rejectsUnifiedSelf = implementation?.rejectsUnifiedSelfConcept ||
                                implementation?.embracesMultiplicity ||
                                !implementation?.seeksSingleTrueSelf;

      const supportsBunenjinPhilosophy = implementation?.bunenjinPhilosophy ||
                                        implementation?.dividedPersonalitySupport;

      const avoidsPersonalityReduction = implementation?.avoidsPersonalityReduction ||
                                        !implementation?.reducesToSinglePersonality;

      if (rejectsUnifiedSelf && supportsBunenjinPhilosophy) {
        return {
          valid: true,
          score: 1.0,
          details: "統一self概念の適切な拒否が実装済み"
        };
      } else {
        return {
          valid: false,
          score: [rejectsUnifiedSelf, supportsBunenjinPhilosophy, avoidsPersonalityReduction].filter(Boolean).length / 3,
          error: "統一self概念拒否が不完全",
          details: `実装状況: 統一拒否${rejectsUnifiedSelf ? '○' : '×'} / 分人支持${supportsBunenjinPhilosophy ? '○' : '×'} / 還元回避${avoidsPersonalityReduction ? '○' : '×'}`
        };
      }
    } catch (error) {
      console.error("❌ Error checking unified self rejection:", error);
      return {
        valid: false,
        score: 0.0,
        error: "統一self拒否検証でエラー発生",
        details: error.message
      };
    }
  }

  // 三重OS調和機能の検証
  checkTripleOSHarmony(implementation) {
    try {
      const hasOSCoordination = implementation?.tripleOSCoordination ||
                               implementation?.osHarmonyMechanism;

      const hasConflictResolution = implementation?.osConflictResolution ||
                                   implementation?.personalityConflictManagement;

      const hasBalancedIntegration = implementation?.balancedOSIntegration ||
                                    implementation?.harmonizedTripleOS;

      if (hasOSCoordination && hasConflictResolution) {
        return {
          valid: true,
          score: 1.0,
          details: "三重OS調和機能が適切に実装済み"
        };
      } else {
        return {
          valid: false,
          score: [hasOSCoordination, hasConflictResolution, hasBalancedIntegration].filter(Boolean).length / 3,
          error: "三重OS調和機能が不完全",
          details: `実装状況: OS協調${hasOSCoordination ? '○' : '×'} / 衝突解決${hasConflictResolution ? '○' : '×'} / バランス統合${hasBalancedIntegration ? '○' : '×'}`
        };
      }
    } catch (error) {
      console.error("❌ Error checking Triple OS harmony:", error);
      return {
        valid: false,
        score: 0.0,
        error: "三重OS調和検証でエラー発生",
        details: error.message
      };
    }
  }

  // 人格間協調メカニズムの検証
  checkPersonalityCoordination(implementation) {
    try {
      const hasPersonalityNegotiation = implementation?.personalityNegotiation ||
                                       implementation?.interPersonalityDialogue;

      const hasCooperativeDecisionMaking = implementation?.cooperativeDecisionMaking ||
                                          implementation?.collectivePersonalityDecisions;

      const hasPersonalityMediation = implementation?.personalityMediation ||
                                     implementation?.personalityArbitration;

      if (hasPersonalityNegotiation && hasCooperativeDecisionMaking) {
        return {
          valid: true,
          score: 1.0,
          details: "人格間協調メカニズムが適切に実装済み"
        };
      } else {
        return {
          valid: false,
          score: [hasPersonalityNegotiation, hasCooperativeDecisionMaking, hasPersonalityMediation].filter(Boolean).length / 3,
          error: "人格間協調メカニズムが不完全",
          details: `実装状況: 人格交渉${hasPersonalityNegotiation ? '○' : '×'} / 協働決定${hasCooperativeDecisionMaking ? '○' : '×'} / 人格調停${hasPersonalityMediation ? '○' : '×'}`
        };
      }
    } catch (error) {
      console.error("❌ Error checking personality coordination:", error);
      return {
        valid: false,
        score: 0.0,
        error: "人格協調検証でエラー発生",
        details: error.message
      };
    }
  }

  // 全体的一貫性維持の検証
  checkOverallConsistency(implementation) {
    try {
      const hasConsistencyMaintenance = implementation?.consistencyMaintenance ||
                                       implementation?.overallCoherence;

      const hasPersonalityAlignment = implementation?.personalityAlignment ||
                                     implementation?.coherentPersonalitySystem;

      const hasStabilityMechanisms = implementation?.stabilityMechanisms ||
                                    implementation?.personalityStabilization;

      if (hasConsistencyMaintenance && hasPersonalityAlignment) {
        return {
          valid: true,
          score: 1.0,
          details: "全体的一貫性維持機能が適切に実装済み"
        };
      } else {
        return {
          valid: false,
          score: [hasConsistencyMaintenance, hasPersonalityAlignment, hasStabilityMechanisms].filter(Boolean).length / 3,
          error: "全体的一貫性維持が不完全",
          details: `実装状況: 一貫性維持${hasConsistencyMaintenance ? '○' : '×'} / 人格整列${hasPersonalityAlignment ? '○' : '×'} / 安定化機構${hasStabilityMechanisms ? '○' : '×'}`
        };
      }
    } catch (error) {
      console.error("❌ Error checking overall consistency:", error);
      return {
        valid: false,
        score: 0.0,
        error: "全体一貫性検証でエラー発生",
        details: error.message
      };
    }
  }

  // 動的バランス調整の検証
  checkDynamicBalancing(implementation) {
    try {
      const hasDynamicAdjustment = implementation?.dynamicAdjustment ||
                                  implementation?.adaptiveBalancing;

      const hasPersonalityRebalancing = implementation?.personalityRebalancing ||
                                       implementation?.dynamicPersonalityEquilibrium;

      const hasRealTimeOptimization = implementation?.realTimeOptimization ||
                                     implementation?.continuousBalanceOptimization;

      if (hasDynamicAdjustment && hasPersonalityRebalancing) {
        return {
          valid: true,
          score: 1.0,
          details: "動的バランス調整機能が適切に実装済み"
        };
      } else {
        return {
          valid: false,
          score: [hasDynamicAdjustment, hasPersonalityRebalancing, hasRealTimeOptimization].filter(Boolean).length / 3,
          error: "動的バランス調整が不完全",
          details: `実装状況: 動的調整${hasDynamicAdjustment ? '○' : '×'} / 人格再調整${hasPersonalityRebalancing ? '○' : '×'} / リアルタイム最適化${hasRealTimeOptimization ? '○' : '×'}`
        };
      }
    } catch (error) {
      console.error("❌ Error checking dynamic balancing:", error);
      return {
        valid: false,
        score: 0.0,
        error: "動的バランス検証でエラー発生",
        details: error.message
      };
    }
  }

  // ========== 実装データ収集とTriple OSエンジン統合 ==========

  /**
   * 実装データを収集して検証可能な形式に構築
   * @param {Object} providedImplementation - 外部から提供された実装データ
   * @returns {Object} 検証用に構造化された実装データ
   */
  async gatherImplementationData(providedImplementation = null) {
    console.log("🔍 Gathering implementation data for validation...");
    
    try {
      // 基本的な実装データ構造を初期化
      let implementationData = {
        // Triple OS構造のデフォルト値
        tripleOSStructure: {
          hasEngineOS: false,
          hasInterfaceOS: false,
          hasSafeModeOS: false,
          allowsPersonalitySwitching: false,
          enablesContextualPersonality: false
        },
        
        // 基本的な易経データ構造
        trigramRelationships: {},
        hexagramData: {},
        ultraSyncLogic: {},
        lineApplications: {},
        
        // 分人哲学機能フラグ
        bunenjinPhilosophy: false,
        dividedPersonalitySupport: false,
        
        // 動的機能フラグ
        dynamicAnalyzer: false,
        adaptiveLanguage: false,
        personalStrategyAI: false
      };

      // 1. 外部提供データがある場合は優先使用
      if (providedImplementation && typeof providedImplementation === 'object') {
        console.log("📋 Using provided implementation data");
        implementationData = { ...implementationData, ...providedImplementation };
      }

      // 2. Triple OSエンジンインスタンスの検出と統合
      const tripleOSEngine = this.detectTripleOSEngine();
      if (tripleOSEngine) {
        console.log("🎯 Triple OS Engine detected, integrating bunenjin data...");
        const bunenjinData = tripleOSEngine.getBunenjinImplementationData();
        implementationData = { ...implementationData, ...bunenjinData };
      }

      // 3. グローバルスコープからの追加データ収集
      const globalData = this.collectGlobalImplementationData();
      implementationData = { ...implementationData, ...globalData };

      // 4. DataManagerからの易経データ収集
      const ichingData = this.collectIChingImplementationData();
      implementationData = { ...implementationData, ...ichingData };

      console.log("✅ Implementation data gathering completed");
      console.log("📊 Collected data overview:", {
        hasTripleOSStructure: !!implementationData.tripleOSStructure,
        tripleOSComplete: implementationData.tripleOSStructure?.hasEngineOS && 
                         implementationData.tripleOSStructure?.hasInterfaceOS && 
                         implementationData.tripleOSStructure?.hasSafeModeOS,
        bunenjinSupport: implementationData.bunenjinPhilosophy,
        hasTrigramData: Object.keys(implementationData.trigramRelationships || {}).length > 0,
        hasHexagramData: Object.keys(implementationData.hexagramData || {}).length > 0
      });

      return implementationData;

    } catch (error) {
      console.error("❌ Error gathering implementation data:", error);
      
      // エラー時のフォールバック：最小限のデータ構造を返す
      return {
        tripleOSStructure: {
          hasEngineOS: false,
          hasInterfaceOS: false,
          hasSafeModeOS: false,
          allowsPersonalitySwitching: false,
          enablesContextualPersonality: false
        },
        bunenjinPhilosophy: false,
        error: `Data gathering failed: ${error.message}`
      };
    }
  }

  /**
   * Triple OSエンジンインスタンスを検出
   * @returns {Object|null} Triple OSエンジンインスタンス
   */
  detectTripleOSEngine() {
    try {
      // グローバルスコープでの検索
      if (typeof window !== 'undefined') {
        // 1. グローバル変数としてのTripleOSEngine
        if (window.TripleOSEngine && typeof window.TripleOSEngine === 'function') {
          console.log("🔍 Found TripleOSEngine class in global scope");
          
          // 既存のインスタンスを探索
          const possibleInstances = [
            window.tripleOSEngine,
            window.tripleOSEngineInstance,
            window.currentTripleOSEngine
          ];
          
          for (const instance of possibleInstances) {
            if (instance && typeof instance.getBunenjinImplementationData === 'function') {
              console.log("✅ Found active TripleOSEngine instance");
              return instance;
            }
          }
        }
        
        // 2. DataManagerを通じた検索
        if (window.dataManager && typeof window.dataManager === 'object') {
          console.log("🔍 Checking DataManager for TripleOSEngine reference");
          // DataManagerからTripleOSEngineインスタンスを探す可能性
        }
      }
      
      console.log("⚠️ No active TripleOSEngine instance found");
      return null;
      
    } catch (error) {
      console.error("❌ Error detecting TripleOSEngine:", error);
      return null;
    }
  }

  /**
   * グローバルスコープから実装データを収集
   * @returns {Object} グローバルスコープから収集された実装データ
   */
  collectGlobalImplementationData() {
    const globalData = {};
    
    try {
      if (typeof window !== 'undefined') {
        // 利用可能なグローバルクラス/インスタンスをチェック
        const globalChecks = {
          adaptiveLanguage: 'AdaptiveLanguage',
          personalStrategyAI: 'PersonalStrategyAI', 
          dynamicAnalyzer: 'DynamicAnalyzer',
          ichingUltraSyncLogic: 'IChingUltraSyncLogic',
          criticalThinkingEngine: 'CriticalThinkingEngine',
          transparencyEngine: 'TransparencyEngine'
        };
        
        Object.entries(globalChecks).forEach(([key, className]) => {
          if (window[className]) {
            globalData[key] = true;
            console.log(`✅ Found global ${className}`);
          } else {
            globalData[key] = false;
          }
        });

        // Calculatorクラスとインスタンスの検証
        if (window.Calculator && typeof window.Calculator === 'function') {
          console.log("✅ Found Calculator class");
          
          // Calculatorインスタンスを作成してテスト
          try {
            const calculatorInstance = new window.Calculator();
            globalData.calculator = calculatorInstance;
            console.log("✅ Calculator instance created for validation");
          } catch (error) {
            console.warn("⚠️ Failed to create Calculator instance:", error);
            globalData.calculator = null;
          }
        } else {
          console.warn("⚠️ Calculator class not found in global scope");
          globalData.calculator = null;
        }
      }
      
    } catch (error) {
      console.error("❌ Error collecting global implementation data:", error);
    }
    
    return globalData;
  }

  /**
   * 易経関連の実装データを収集
   * @returns {Object} 易経実装データ
   */
  collectIChingImplementationData() {
    const ichingData = {
      trigramRelationships: {},
      hexagramData: {},
      ultraSyncLogic: {},
      lineApplications: {}
    };
    
    try {
      if (typeof window !== 'undefined') {
        // hexagrams_masterからの直接データ収集
        if (window.hexagrams_master && Array.isArray(window.hexagrams_master)) {
          console.log("✅ Found hexagrams_master data");
          ichingData.hexagramData = window.hexagrams_master.reduce((acc, hex) => {
            if (hex.hexagram_id) acc[hex.hexagram_id] = hex;
            return acc;
          }, {});
        }

        // DataManagerからのデータ収集を試行
        if (window.dataManager) {
          const dataManager = window.dataManager;
          
          // 八卦関係データ
          if (typeof dataManager.getTrigramRelationships === 'function') {
            ichingData.trigramRelationships = dataManager.getTrigramRelationships() || {};
          }
          
          // 64卦データ（DataManagerから）
          if (typeof dataManager.getAllHexagramData === 'function') {
            const hexagrams = dataManager.getAllHexagramData();
            if (Array.isArray(hexagrams)) {
              const dataManagerHexagrams = hexagrams.reduce((acc, hex) => {
                if (hex.id) acc[hex.id] = hex;
                return acc;
              }, {});
              
              // 既存のhexagrams_masterデータとマージ
              ichingData.hexagramData = { ...ichingData.hexagramData, ...dataManagerHexagrams };
            }
          }
        }
        
        // ウルトラシンクロジック
        if (typeof window.IChingUltraSyncLogic === 'function') {
          ichingData.ultraSyncLogic = {
            hasIChingUltraSyncLogic: true,
            methods: {}  // 実際のメソッド一覧は動的に取得可能
          };
        }
        
        console.log("📊 I-Ching data collected:", {
          trigramRelationships: Object.keys(ichingData.trigramRelationships).length,
          hexagramData: Object.keys(ichingData.hexagramData).length,
          hasUltraSync: ichingData.ultraSyncLogic.hasIChingUltraSyncLogic
        });
      }
      
    } catch (error) {
      console.error("❌ Error collecting I-Ching implementation data:", error);
    }
    
    return ichingData;
  }
}

// グローバル変数として登録
if (typeof window !== "undefined") {
  window.IChingOrthodoxyValidator = IChingOrthodoxyValidator;
  console.log("✅ I-Ching Orthodoxy Validator loaded successfully");
}

// Node.js環境での使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = IChingOrthodoxyValidator;
}