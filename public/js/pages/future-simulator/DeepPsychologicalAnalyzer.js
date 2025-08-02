/**
 * 深層心理パターン分析エンジン - 状況卦精度向上システム Phase 3
 * 
 * 目的：
 * - ユングの集合的無意識と易経シンボルの対応分析
 * - アーキタイプパターンによる普遍的心理構造の検出
 * - 個人的無意識と状況の共鳴分析
 * - 深層心理と表層意識の統合的理解
 * 
 * 入力：
 * - situationalContext: object - Phase 2からの仮想状況推定結果
 * - hexagramMapping: object - Phase 2.5からの易経マッピング結果
 * - userProfile: object - ユーザープロファイル情報
 * - analysisOptions: object - 分析設定オプション
 * 
 * 処理内容：
 * 1. アーキタイプパターン検出（影・アニマ/アニムス・自己等）
 * 2. 集合的無意識シンボル分析（易経卦象との対応）
 * 3. 個人的無意識の投影分析（状況への心理的投影）
 * 4. 心理的複合体（コンプレックス）の特定
 * 5. 個性化プロセスの段階評価
 * 6. 深層心理と状況の共鳴度分析
 * 
 * 出力：
 * - archetypeProfile: object - 検出されたアーキタイプパターン
 * - collectiveSymbols: object - 集合的無意識シンボル分析
 * - personalProjections: object - 個人的投影パターン
 * - psychologicalComplexes: Array - 特定された心理的複合体
 * - individuationStage: object - 個性化プロセス評価
 * - resonanceAnalysis: object - 深層心理と状況の共鳴分析
 * - deepInsights: Array - 深層心理的洞察
 * 
 * 副作用：
 * - 心理パターンの学習と蓄積
 * - アーキタイプ-易経対応データベースの更新
 * 
 * 前提条件：
 * - SituationalContextEngine の結果が利用可能
 * - HexagramMappingEngine の結果が利用可能
 * - ユング心理学の基本概念が実装されている
 * 
 * エラー処理：
 * - 各分析層での例外ハンドリング
 * - 心理学的解釈の妥当性検証
 * - プライバシー配慮によるデータ制限
 */
class DeepPsychologicalAnalyzer {
  constructor() {
    this.analysisHistory = [];
    this.archetypePatterns = new Map();
    this.confidenceThreshold = 0.65;
    
    // アーキタイプ定義
    this.archetypes = {
      shadow: {
        name: '影（Shadow）',
        characteristics: ['否定', '抑圧', '暗い', '隠された', '認めたくない'],
        hexagramAssociations: [29, 47, 48], // 坎為水、沢水困、水風井
        manifestations: ['投影', '否認', '批判', '恐れ']
      },
      anima: {
        name: 'アニマ（男性の中の女性性）',
        characteristics: ['感情', '直感', '受容', '柔らかさ', '内的'],
        hexagramAssociations: [2, 8, 19], // 坤為地、水地比、地沢臨
        manifestations: ['感受性', '創造性', '関係性']
      },
      animus: {
        name: 'アニムス（女性の中の男性性）',
        characteristics: ['論理', '行動', '決断', '強さ', '外的'],
        hexagramAssociations: [1, 7, 14], // 乾為天、地水師、火天大有
        manifestations: ['主張', '論理性', '独立性']
      },
      self: {
        name: '自己（Self）',
        characteristics: ['統合', '全体性', '中心', '調和', '完成'],
        hexagramAssociations: [63, 64, 11], // 水火既済、火水未済、地天泰
        manifestations: ['統合', '悟り', '全体性の実現']
      },
      persona: {
        name: 'ペルソナ（社会的仮面）',
        characteristics: ['社会的', '表面的', '役割', '適応', '外見'],
        hexagramAssociations: [13, 44, 33], // 天火同人、天風姤、天山遯
        manifestations: ['社会的役割', '外的適応', 'イメージ']
      },
      hero: {
        name: '英雄（Hero）',
        characteristics: ['勇気', '挑戦', '成長', '克服', '冒険'],
        hexagramAssociations: [3, 4, 7], // 水雷屯、山水蒙、地水師
        manifestations: ['挑戦', '成長', '自己実現']
      }
    };
    
    // 心理的複合体パターン
    this.complexPatterns = {
      inferiority: {
        indicators: ['できない', '劣って', '不十分', '価値がない'],
        compensations: ['優越', '完璧主義', '過度な努力'],
        healingDirection: 'self_acceptance'
      },
      authority: {
        indicators: ['権威', '支配', '従属', '反発'],
        compensations: ['反抗', '服従', '権力志向'],
        healingDirection: 'healthy_autonomy'
      },
      mother: {
        indicators: ['母', '養育', '保護', '依存'],
        compensations: ['過保護', '拒絶', '理想化'],
        healingDirection: 'nurturing_balance'
      },
      father: {
        indicators: ['父', '権威', '規律', '評価'],
        compensations: ['承認欲求', '反抗', '同一化'],
        healingDirection: 'inner_authority'
      }
    };
    
    // 個性化プロセスの段階
    this.individuationStages = {
      unconscious: {
        name: '無意識的同一性',
        characteristics: ['未分化', '集団的', '依存的'],
        challenges: ['自己認識の欠如', '投影']
      },
      confrontation: {
        name: '影との対決',
        characteristics: ['内的葛藤', '否定的側面の認識'],
        challenges: ['抵抗', '投影の撤回']
      },
      integration: {
        name: '対極の統合',
        characteristics: ['アニマ/アニムスの統合', 'バランス'],
        challenges: ['内的対話', '全体性への道']
      },
      realization: {
        name: '自己実現',
        characteristics: ['個性化', '全体性', '統合'],
        challenges: ['継続的成長', '社会との調和']
      }
    };
    
    // 統計データ
    this.statistics = {
      totalAnalyses: 0,
      archetypeDetections: new Map(),
      complexIdentifications: new Map(),
      averageResonance: 0
    };
  }

  /**
   * 深層心理パターン分析実行
   * 
   * 目的：
   * - 状況に投影された深層心理パターンの検出
   * - 易経シンボルとの心理学的対応分析
   * 
   * 処理内容：
   * - 多層的な心理分析の実行
   * - アーキタイプと易経の統合
   * - 個性化プロセスの評価
   * 
   * 出力：
   * - 包括的な深層心理分析結果
   */
  async analyzeDeepPsychologicalPatterns(situationalContext, hexagramMapping, userProfile = null, analysisOptions = {}) {
    const startTime = performance.now();
    
    console.log('🧠 深層心理パターン分析開始');
    
    // 入力検証
    if (!situationalContext || !hexagramMapping) {
      console.error('DeepPsychologicalAnalyzer: 必要な入力データが不足');
      return this.generateErrorResult('入力データ不足');
    }

    try {
      const analysisLayers = {};
      
      // Layer 1: アーキタイプパターン検出
      console.log('👤 Layer 1: アーキタイプパターン検出');
      analysisLayers.archetypeDetection = await this.layer1_archetypeDetection(situationalContext, hexagramMapping);
      
      // Layer 2: 集合的無意識シンボル分析
      console.log('🌐 Layer 2: 集合的無意識シンボル分析');
      analysisLayers.collectiveSymbolAnalysis = await this.layer2_collectiveSymbolAnalysis(hexagramMapping, analysisLayers.archetypeDetection);
      
      // Layer 3: 個人的投影分析
      console.log('🔍 Layer 3: 個人的投影分析');
      analysisLayers.personalProjectionAnalysis = await this.layer3_personalProjectionAnalysis(situationalContext, analysisLayers.archetypeDetection);
      
      // Layer 4: 心理的複合体の特定
      console.log('💭 Layer 4: 心理的複合体の特定');
      analysisLayers.complexIdentification = await this.layer4_complexIdentification(situationalContext, analysisLayers);
      
      // Layer 5: 個性化プロセス評価
      console.log('🌟 Layer 5: 個性化プロセス評価');
      analysisLayers.individuationAssessment = await this.layer5_individuationAssessment(analysisLayers);
      
      // Layer 6: 深層心理と状況の共鳴分析
      console.log('🔮 Layer 6: 共鳴分析');
      analysisLayers.resonanceAnalysis = await this.layer6_resonanceAnalysis(analysisLayers, situationalContext, hexagramMapping);
      
      // 統合結果生成
      console.log('🎯 統合深層心理分析結果生成');
      const finalResult = await this.generateIntegratedAnalysisResult(analysisLayers, situationalContext, hexagramMapping, userProfile);
      
      // 処理時間と品質メトリクス
      const processingTime = performance.now() - startTime;
      finalResult.qualityMetrics = {
        processingTime: processingTime,
        layerCompletionRate: Object.keys(analysisLayers).length / 6,
        overallConfidence: finalResult.analysisConfidence,
        depthLevel: finalResult.analysisConfidence >= 0.8 ? '深層到達' : 
                   finalResult.analysisConfidence >= 0.6 ? '中層分析' : '表層分析'
      };
      
      // 学習データ更新
      this.updateLearningData(finalResult);
      
      // 統計更新
      this.updateStatistics(finalResult, true);
      
      console.log('✨ 深層心理パターン分析完了:', {
        dominantArchetype: finalResult.archetypeProfile?.dominant?.type,
        individuationStage: finalResult.individuationStage?.current,
        resonanceLevel: finalResult.resonanceAnalysis?.overallResonance
      });
      
      return finalResult;
      
    } catch (error) {
      console.error('🚨 深層心理パターン分析エラー:', error);
      const fallbackResult = this.generateFallbackResult(situationalContext, error);
      this.updateStatistics(fallbackResult, false);
      return fallbackResult;
    }
  }

  /**
   * Layer 1: アーキタイプパターン検出
   */
  async layer1_archetypeDetection(situationalContext, hexagramMapping) {
    const detectedArchetypes = [];
    
    // 各アーキタイプのスコア計算
    for (const [archetypeKey, archetype] of Object.entries(this.archetypes)) {
      const score = this.calculateArchetypeScore(archetypeKey, archetype, situationalContext, hexagramMapping);
      
      if (score > 0.3) {
        detectedArchetypes.push({
          type: archetypeKey,
          name: archetype.name,
          score: score,
          manifestations: this.detectManifestations(archetype, situationalContext),
          hexagramAlignment: this.checkHexagramAlignment(archetype, hexagramMapping)
        });
      }
    }
    
    // スコア順でソート
    detectedArchetypes.sort((a, b) => b.score - a.score);
    
    return {
      detectedArchetypes: detectedArchetypes,
      dominant: detectedArchetypes[0] || null,
      secondary: detectedArchetypes.slice(1, 3),
      archetypeComplexity: detectedArchetypes.length,
      balanceAnalysis: this.analyzeArchetypeBalance(detectedArchetypes)
    };
  }

  /**
   * Layer 2: 集合的無意識シンボル分析
   */
  async layer2_collectiveSymbolAnalysis(hexagramMapping, archetypeDetection) {
    const hexagram = hexagramMapping.primaryHexagram;
    const selectedLine = hexagramMapping.selectedLine;
    
    return {
      hexagramSymbolism: this.analyzeHexagramSymbolism(hexagram),
      lineSymbolism: this.analyzeLineSymbolism(selectedLine),
      archetypeHexagramCorrespondence: this.analyzeArchetypeHexagramCorrespondence(archetypeDetection, hexagram),
      collectiveThemes: this.extractCollectiveThemes(hexagram, archetypeDetection),
      universalPatterns: this.identifyUniversalPatterns(hexagram)
    };
  }

  /**
   * Layer 3: 個人的投影分析
   */
  async layer3_personalProjectionAnalysis(situationalContext, archetypeDetection) {
    const projections = [];
    
    // 影の投影分析
    if (archetypeDetection.detectedArchetypes.some(a => a.type === 'shadow')) {
      projections.push(this.analyzeShadowProjection(situationalContext));
    }
    
    // アニマ/アニムスの投影分析
    const animaAnimus = archetypeDetection.detectedArchetypes.find(a => 
      a.type === 'anima' || a.type === 'animus'
    );
    if (animaAnimus) {
      projections.push(this.analyzeAnimaAnimusProjection(situationalContext, animaAnimus.type));
    }
    
    // ペルソナの投影分析
    if (archetypeDetection.detectedArchetypes.some(a => a.type === 'persona')) {
      projections.push(this.analyzePersonaProjection(situationalContext));
    }
    
    return {
      projections: projections,
      projectionIntensity: this.calculateProjectionIntensity(projections),
      withdrawalPotential: this.assessWithdrawalPotential(projections),
      integrationOpportunities: this.identifyIntegrationOpportunities(projections)
    };
  }

  /**
   * Layer 4: 心理的複合体の特定
   */
  async layer4_complexIdentification(situationalContext, analysisLayers) {
    const identifiedComplexes = [];
    
    // 各複合体パターンのチェック
    for (const [complexType, pattern] of Object.entries(this.complexPatterns)) {
      const presence = this.detectComplexPresence(complexType, pattern, situationalContext);
      
      if (presence.score > 0.4) {
        identifiedComplexes.push({
          type: complexType,
          score: presence.score,
          indicators: presence.indicators,
          compensations: presence.compensations,
          healingDirection: pattern.healingDirection,
          archetypeConnection: this.findArchetypeComplexConnection(complexType, analysisLayers.archetypeDetection)
        });
      }
    }
    
    return {
      identifiedComplexes: identifiedComplexes,
      dominantComplex: identifiedComplexes[0] || null,
      complexInteractions: this.analyzeComplexInteractions(identifiedComplexes),
      therapeuticInsights: this.generateTherapeuticInsights(identifiedComplexes)
    };
  }

  /**
   * Layer 5: 個性化プロセス評価
   */
  async layer5_individuationAssessment(analysisLayers) {
    const archetypeProfile = analysisLayers.archetypeDetection;
    const projections = analysisLayers.personalProjectionAnalysis;
    const complexes = analysisLayers.complexIdentification;
    
    // 現在の個性化段階の判定
    const currentStage = this.determineIndividuationStage(archetypeProfile, projections, complexes);
    
    // 進展の障害と機会
    const progressAnalysis = this.analyzeIndividuationProgress(currentStage, analysisLayers);
    
    return {
      currentStage: currentStage.stage,
      stageDetails: this.individuationStages[currentStage.stage],
      progressIndicators: progressAnalysis.indicators,
      obstacles: progressAnalysis.obstacles,
      opportunities: progressAnalysis.opportunities,
      nextStepGuidance: this.generateNextStepGuidance(currentStage, progressAnalysis)
    };
  }

  /**
   * Layer 6: 深層心理と状況の共鳴分析
   */
  async layer6_resonanceAnalysis(analysisLayers, situationalContext, hexagramMapping) {
    // 各層の共鳴度計算
    const archetypeResonance = this.calculateArchetypeResonance(
      analysisLayers.archetypeDetection,
      hexagramMapping
    );
    
    const symbolResonance = this.calculateSymbolResonance(
      analysisLayers.collectiveSymbolAnalysis,
      situationalContext
    );
    
    const complexResonance = this.calculateComplexResonance(
      analysisLayers.complexIdentification,
      situationalContext
    );
    
    // 総合共鳴度
    const overallResonance = (archetypeResonance + symbolResonance + complexResonance) / 3;
    
    return {
      archetypeResonance: archetypeResonance,
      symbolResonance: symbolResonance,
      complexResonance: complexResonance,
      overallResonance: overallResonance,
      resonancePattern: this.identifyResonancePattern(analysisLayers),
      synchronicities: this.detectSynchronicities(analysisLayers, hexagramMapping),
      deepInsights: this.generateDeepInsights(analysisLayers, overallResonance)
    };
  }

  // ============ ヘルパーメソッド群 ============

  /**
   * アーキタイプスコア計算
   */
  calculateArchetypeScore(archetypeKey, archetype, situationalContext, hexagramMapping) {
    let score = 0;
    
    // キーワードマッチング
    const text = situationalContext.virtualSituation?.situationCore || '';
    archetype.characteristics.forEach(characteristic => {
      if (text.includes(characteristic)) {
        score += 0.2;
      }
    });
    
    // 易経との対応
    const hexagramId = hexagramMapping.primaryHexagram?.hexagram_id;
    if (hexagramId && archetype.hexagramAssociations.includes(hexagramId)) {
      score += 0.3;
    }
    
    // 状況の複雑性による調整
    if (situationalContext.virtualSituation?.complexityLevel === 'complex') {
      if (archetypeKey === 'shadow' || archetypeKey === 'self') {
        score += 0.1;
      }
    }
    
    return Math.min(score, 1.0);
  }

  /**
   * 兆候の検出
   */
  detectManifestations(archetype, situationalContext) {
    const manifestations = [];
    const narrative = situationalContext.virtualSituation?.narrativeStructure?.situationSetup || '';
    
    archetype.manifestations.forEach(manifestation => {
      // 簡易的なキーワードベース検出
      if (narrative.toLowerCase().includes(manifestation)) {
        manifestations.push(manifestation);
      }
    });
    
    return manifestations;
  }

  /**
   * 易経アライメントチェック
   */
  checkHexagramAlignment(archetype, hexagramMapping) {
    const hexagramId = hexagramMapping.primaryHexagram?.hexagram_id;
    return archetype.hexagramAssociations.includes(hexagramId) ? 'strong' : 'weak';
  }

  /**
   * アーキタイプバランス分析
   */
  analyzeArchetypeBalance(detectedArchetypes) {
    const hasOpposites = detectedArchetypes.some(a => a.type === 'shadow') && 
                        detectedArchetypes.some(a => a.type === 'persona');
    
    const hasSelfArchetype = detectedArchetypes.some(a => a.type === 'self');
    
    return {
      balanced: hasOpposites && hasSelfArchetype,
      dominantPole: detectedArchetypes[0]?.type || 'none',
      integrationLevel: hasSelfArchetype ? 'high' : hasOpposites ? 'medium' : 'low'
    };
  }

  /**
   * 複合体存在検出
   */
  detectComplexPresence(complexType, pattern, situationalContext) {
    let score = 0;
    const matchedIndicators = [];
    const matchedCompensations = [];
    
    const text = (situationalContext.virtualSituation?.situationCore || '').toLowerCase();
    
    // 指標の検出
    pattern.indicators.forEach(indicator => {
      if (text.includes(indicator)) {
        score += 0.3;
        matchedIndicators.push(indicator);
      }
    });
    
    // 補償行動の検出
    pattern.compensations.forEach(compensation => {
      if (text.includes(compensation)) {
        score += 0.2;
        matchedCompensations.push(compensation);
      }
    });
    
    return {
      score: Math.min(score, 1.0),
      indicators: matchedIndicators,
      compensations: matchedCompensations
    };
  }

  /**
   * 個性化段階の決定
   */
  determineIndividuationStage(archetypeProfile, projections, complexes) {
    let stageScores = {
      unconscious: 0,
      confrontation: 0,
      integration: 0,
      realization: 0
    };
    
    // アーキタイププロファイルによる評価
    if (!archetypeProfile.dominant) {
      stageScores.unconscious += 3;
    } else if (archetypeProfile.dominant.type === 'shadow') {
      stageScores.confrontation += 3;
    } else if (archetypeProfile.balanceAnalysis.balanced) {
      stageScores.integration += 3;
    } else if (archetypeProfile.dominant.type === 'self') {
      stageScores.realization += 3;
    }
    
    // 投影の強度による調整
    if (projections.projectionIntensity > 0.7) {
      stageScores.unconscious += 2;
    } else if (projections.withdrawalPotential > 0.5) {
      stageScores.confrontation += 2;
    }
    
    // 複合体の存在による調整
    if (complexes.identifiedComplexes.length > 2) {
      stageScores.confrontation += 1;
    }
    
    // 最高スコアの段階を選択
    const currentStage = Object.entries(stageScores)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    return {
      stage: currentStage,
      confidence: stageScores[currentStage] / 5
    };
  }

  /**
   * 統合分析結果生成
   */
  async generateIntegratedAnalysisResult(analysisLayers, situationalContext, hexagramMapping, userProfile) {
    return {
      archetypeProfile: analysisLayers.archetypeDetection,
      collectiveSymbols: analysisLayers.collectiveSymbolAnalysis,
      personalProjections: analysisLayers.personalProjectionAnalysis,
      psychologicalComplexes: analysisLayers.complexIdentification.identifiedComplexes,
      individuationStage: analysisLayers.individuationAssessment,
      resonanceAnalysis: analysisLayers.resonanceAnalysis,
      deepInsights: analysisLayers.resonanceAnalysis.deepInsights,
      analysisConfidence: this.calculateOverallConfidence(analysisLayers),
      psychologicalGuidance: this.generatePsychologicalGuidance(analysisLayers),
      integrationPath: this.suggestIntegrationPath(analysisLayers)
    };
  }

  /**
   * 全体信頼度計算
   */
  calculateOverallConfidence(analysisLayers) {
    const archetypeConfidence = analysisLayers.archetypeDetection.dominant ? 
      analysisLayers.archetypeDetection.dominant.score : 0.3;
    const resonance = analysisLayers.resonanceAnalysis.overallResonance;
    
    return (archetypeConfidence + resonance) / 2;
  }

  /**
   * 心理的ガイダンス生成
   */
  generatePsychologicalGuidance(analysisLayers) {
    const guidance = [];
    
    // 影の統合に関するガイダンス
    if (analysisLayers.archetypeDetection.detectedArchetypes.some(a => a.type === 'shadow')) {
      guidance.push({
        type: 'shadow_integration',
        message: '否定的に見える側面にも価値があることを認識し、受け入れることが成長への道です。'
      });
    }
    
    // 個性化プロセスのガイダンス
    const stage = analysisLayers.individuationAssessment.currentStage;
    guidance.push({
      type: 'individuation',
      message: analysisLayers.individuationAssessment.nextStepGuidance
    });
    
    return guidance;
  }

  /**
   * 統合パス提案
   */
  suggestIntegrationPath(analysisLayers) {
    const currentStage = analysisLayers.individuationAssessment.currentStage;
    const obstacles = analysisLayers.individuationAssessment.obstacles;
    
    return {
      currentPosition: currentStage,
      nextMilestone: this.getNextMilestone(currentStage),
      practicalSteps: this.generatePracticalSteps(obstacles),
      timeframe: 'ongoing_process'
    };
  }

  // 簡易実装メソッド群
  analyzeHexagramSymbolism(hexagram) { 
    return { 
      symbol: hexagram?.name_jp || '不明',
      meaning: '変化と成長の象徴'
    }; 
  }
  
  analyzeLineSymbolism(line) { 
    return { 
      position: line?.爻 || '不明',
      significance: '現在の立ち位置'
    }; 
  }
  
  analyzeArchetypeHexagramCorrespondence(archetypeDetection, hexagram) {
    return {
      alignment: 'moderate',
      resonance: 0.7
    };
  }
  
  extractCollectiveThemes(hexagram, archetypeDetection) {
    return ['変容', '成長', '統合'];
  }
  
  identifyUniversalPatterns(hexagram) {
    return ['陰陽の調和', '循環的成長'];
  }
  
  analyzeShadowProjection(situationalContext) {
    return {
      type: 'shadow',
      content: '認めたくない自己の側面',
      intensity: 0.6
    };
  }
  
  analyzeAnimaAnimusProjection(situationalContext, type) {
    return {
      type: type,
      content: type === 'anima' ? '内なる女性性' : '内なる男性性',
      intensity: 0.5
    };
  }
  
  analyzePersonaProjection(situationalContext) {
    return {
      type: 'persona',
      content: '社会的役割への同一化',
      intensity: 0.4
    };
  }
  
  calculateProjectionIntensity(projections) {
    if (projections.length === 0) return 0;
    return projections.reduce((sum, p) => sum + p.intensity, 0) / projections.length;
  }
  
  assessWithdrawalPotential(projections) {
    return projections.some(p => p.type === 'shadow') ? 0.7 : 0.3;
  }
  
  identifyIntegrationOpportunities(projections) {
    return projections.map(p => ({
      projection: p.type,
      opportunity: `${p.type}の認識と受容`
    }));
  }
  
  findArchetypeComplexConnection(complexType, archetypeDetection) {
    // 簡易的な対応関係
    const connections = {
      inferiority: 'shadow',
      authority: 'father',
      mother: 'anima',
      father: 'animus'
    };
    return connections[complexType] || 'none';
  }
  
  analyzeComplexInteractions(complexes) {
    return {
      conflicting: complexes.length > 1,
      reinforcing: complexes.some(c => c.type === 'authority') && complexes.some(c => c.type === 'father')
    };
  }
  
  generateTherapeuticInsights(complexes) {
    return complexes.map(c => ({
      complex: c.type,
      insight: `${c.healingDirection}への方向付けが重要です`
    }));
  }
  
  analyzeIndividuationProgress(currentStage, analysisLayers) {
    return {
      indicators: ['自己認識の深まり', '投影の認識'],
      obstacles: ['複合体の未解決', '影の否認'],
      opportunities: ['統合への準備', '成長の可能性']
    };
  }
  
  generateNextStepGuidance(currentStage, progressAnalysis) {
    const guidanceMap = {
      unconscious: '自己の内面を観察し、感情や反応パターンに気づくことから始めましょう。',
      confrontation: '否定的な側面も含めて、自己の全体性を受け入れる勇気を持ちましょう。',
      integration: '対立する要素を統合し、より大きな全体性へと向かいましょう。',
      realization: '獲得した智慧を日常生活で実践し、他者への貢献へとつなげましょう。'
    };
    return guidanceMap[currentStage.stage] || '内なる声に耳を傾けてください。';
  }
  
  calculateArchetypeResonance(archetypeDetection, hexagramMapping) {
    if (!archetypeDetection.dominant) return 0.3;
    return archetypeDetection.dominant.hexagramAlignment === 'strong' ? 0.8 : 0.5;
  }
  
  calculateSymbolResonance(symbolAnalysis, situationalContext) {
    return 0.7; // 簡易実装
  }
  
  calculateComplexResonance(complexIdentification, situationalContext) {
    return complexIdentification.identifiedComplexes.length > 0 ? 0.6 : 0.3;
  }
  
  identifyResonancePattern(analysisLayers) {
    return {
      pattern: 'synchronistic',
      strength: 'moderate'
    };
  }
  
  detectSynchronicities(analysisLayers, hexagramMapping) {
    return [{
      type: 'archetype_hexagram',
      description: 'アーキタイプと易経の象徴的一致'
    }];
  }
  
  generateDeepInsights(analysisLayers, overallResonance) {
    const insights = [];
    
    if (overallResonance > 0.7) {
      insights.push('深層心理と状況が強く共鳴しており、重要な気づきの機会です。');
    }
    
    if (analysisLayers.archetypeDetection.balanceAnalysis.balanced) {
      insights.push('対立する要素の統合が進んでおり、全体性への道を歩んでいます。');
    }
    
    return insights;
  }
  
  getNextMilestone(currentStage) {
    const milestones = {
      unconscious: 'confrontation',
      confrontation: 'integration',
      integration: 'realization',
      realization: 'continued_growth'
    };
    return milestones[currentStage] || 'self_discovery';
  }
  
  generatePracticalSteps(obstacles) {
    return [
      '日記や夢の記録による自己観察',
      '瞑想や内省の実践',
      '創造的活動による無意識の表現'
    ];
  }
  
  updateLearningData(result) {
    const key = result.archetypeProfile?.dominant?.type || 'unknown';
    if (!this.archetypePatterns.has(key)) {
      this.archetypePatterns.set(key, []);
    }
    this.archetypePatterns.get(key).push({
      timestamp: Date.now(),
      resonance: result.resonanceAnalysis?.overallResonance || 0
    });
  }
  
  updateStatistics(result, success) {
    this.statistics.totalAnalyses++;
    if (success && result.archetypeProfile?.dominant) {
      const archetype = result.archetypeProfile.dominant.type;
      this.statistics.archetypeDetections.set(
        archetype,
        (this.statistics.archetypeDetections.get(archetype) || 0) + 1
      );
    }
  }
  
  generateErrorResult(errorMessage) {
    return {
      error: errorMessage,
      analysisConfidence: 0,
      archetypeProfile: null,
      qualityMetrics: {
        depthLevel: 'エラー'
      }
    };
  }
  
  generateFallbackResult(situationalContext, error) {
    console.warn('深層心理分析フォールバック実行:', error.message);
    return {
      archetypeProfile: {
        dominant: { type: 'self', name: '自己', score: 0.5 },
        detectedArchetypes: []
      },
      analysisConfidence: 0.4,
      deepInsights: ['内なる智慧に従って進んでください'],
      fallback: true,
      error: error.message
    };
  }
}

// グローバル利用のためのエクスポート
window.DeepPsychologicalAnalyzer = DeepPsychologicalAnalyzer;