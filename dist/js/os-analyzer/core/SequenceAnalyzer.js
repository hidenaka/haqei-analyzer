/**
 * SequenceAnalyzer.js - 序卦伝（じょかでん）分析エンジン
 * 
 * 機能：
 * - 易経64卦の序卦伝による相互関係性分析
 * - Triple OSの相互作用パターン可視化
 * - 天地人三才による統合的解釈
 * - bunenjin哲学による複数人格間の関係性分析
 * 
 * 序卦伝とは：
 * 易経の64卦が一定の順序で配列される理由を説明する古典文献
 * 各卦の相互関係、変化の法則、成長の段階を示す
 * 
 * バージョン: v1.0.0-sequence-analysis
 * 作成日: 2025-08-05
 */

class SequenceAnalyzer {
  constructor() {
    this.version = "1.0.0-sequence-analysis";
    
    // 序卦伝の基本構造（64卦の配列順序）
    this.sequenceOrder = this.initializeSequenceOrder();
    
    // 天地人三才による分類
    this.threePowers = {
      heaven: [1, 14, 34, 11, 9, 5, 26, 43], // 天の卦
      earth: [2, 8, 16, 23, 20, 35, 12, 45],  // 地の卦  
      human: [3, 4, 6, 7, 13, 15, 17, 18]     // 人の卦（一部）
    };
    
    // 相互関係のタイプ
    this.relationshipTypes = {
      sequence: "順序関係", // 序卦伝の順序による関係
      complement: "相補関係", // 陰陽の補完関係
      opposition: "対立関係", // 相反する性質
      evolution: "発展関係", // 段階的発展
      transformation: "変化関係" // 相互変化
    };
    
    // 関係性強度の重み
    this.relationshipWeights = this.initializeRelationshipWeights();
    
    // 分析結果キャッシュ
    this.analysisCache = new Map();
    
    console.log("📜 SequenceAnalyzer initialized - Ancient sequence wisdom for modern analysis");
  }
  
  /**
   * Triple OS間の序卦伝関係性分析
   * 
   * @param {Object} engineHexagram - Engine OSの卦
   * @param {Object} interfaceHexagram - Interface OSの卦  
   * @param {Object} safeModeHexagram - SafeMode OSの卦
   * @returns {Object} 序卦伝関係性分析結果
   */
  analyzeTripleOSSequence(engineHexagram, interfaceHexagram, safeModeHexagram) {
    console.log("📜 Starting sequence analysis for Triple OS hexagrams");
    
    try {
      // Step 1: 各卦の序卦伝位置確認
      const positions = this.getSequencePositions(engineHexagram, interfaceHexagram, safeModeHexagram);
      
      // Step 2: 二卦間の関係性分析
      const pairRelations = this.analyzePairRelationships(engineHexagram, interfaceHexagram, safeModeHexagram);
      
      // Step 3: 三卦統合関係分析
      const tripleRelation = this.analyzeTripleRelationship(engineHexagram, interfaceHexagram, safeModeHexagram);
      
      // Step 4: 発展段階の特定
      const developmentStage = this.identifyDevelopmentStage(positions);
      
      // Step 5: 変化の方向性分析
      const transformationPath = this.analyzeTransformationPath(engineHexagram, interfaceHexagram, safeModeHexagram);
      
      // Step 6: 実用的洞察の生成
      const insights = this.generateSequenceInsights(
        positions, pairRelations, tripleRelation, developmentStage, transformationPath
      );
      
      const result = {
        timestamp: new Date().toISOString(),
        analyzerVersion: this.version,
        
        // 序卦伝位置情報
        positions: positions,
        
        // 二卦間関係
        pairRelations: pairRelations,
        
        // 三卦統合関係
        tripleRelation: tripleRelation,
        
        // 発展段階
        developmentStage: developmentStage,
        
        // 変化の道筋
        transformationPath: transformationPath,
        
        // 実用的洞察
        insights: insights,
        
        // 可視化データ
        visualization: this.generateVisualizationData(positions, pairRelations, tripleRelation)
      };
      
      // 結果をキャッシュ
      this.cacheAnalysis(engineHexagram, interfaceHexagram, safeModeHexagram, result);
      
      console.log("✅ Sequence analysis completed successfully");
      return result;
      
    } catch (error) {
      console.error("❌ Error in sequence analysis:", error);
      return this.generateFallbackAnalysis(engineHexagram, interfaceHexagram, safeModeHexagram);
    }
  }
  
  /**
   * 序卦伝順序の初期化
   */
  initializeSequenceOrder() {
    // 易経64卦の序卦伝順序（王弼本準拠）
    return [
      1, 2,   // 乾坤 - 天地創造
      3, 4,   // 屯蒙 - 始動と蒙昧
      5, 6,   // 需訟 - 待機と争訟
      7, 8,   // 師比 - 統率と親比
      9, 10,  // 小畜履 - 小蓄と践履
      11, 12, // 泰否 - 通泰と閉塞
      13, 14, // 同人大有 - 協同と大有
      15, 16, // 謙豫 - 謙遜と豫楽
      17, 18, // 随蛊 - 追随と整頓
      19, 20, // 臨観 - 臨監と観察
      21, 22, // 噬嗑賁 - 刑罰と装飾
      23, 24, // 剥復 - 剥落と復帰
      25, 26, // 無妄大畜 - 無妄と大畜
      27, 28, // 頤大過 - 頤養と大過
      29, 30, // 坎離 - 水火既済
      31, 32, // 咸恒 - 感応と永続
      33, 34, // 遯大壮 - 退避と大壮
      35, 36, // 晋明夷 - 進昇と明傷
      37, 38, // 家人睽 - 家庭と乖離
      39, 40, // 蹇解 - 困難と解除
      41, 42, // 損益 - 損失と利益
      43, 44, // 夬姤 - 決断と遭遇
      45, 46, // 萃升 - 集合と上昇
      47, 48, // 困井 - 困窮と井戸
      49, 50, // 革鼎 - 変革と鼎立
      51, 52, // 震艮 - 震動と静止
      53, 54, // 漸帰妹 - 漸進と帰嫁
      55, 56, // 豊旅 - 豊盛と旅行
      57, 58, // 巽兌 - 謙遜と喜悦
      59, 60, // 渙節 - 渙散と節制
      61, 62, // 中孚小過 - 中孚と小過
      63, 64  // 既済未済 - 既済と未済
    ];
  }
  
  /**
   * 関係性重みの初期化
   */
  initializeRelationshipWeights() {
    return {
      adjacent: 1.0,      // 隣接する卦（最も強い関係）
      paired: 0.8,        // 対卦関係
      sameFamily: 0.6,    // 同じ卦群
      complement: 0.7,    // 相補関係
      opposition: 0.5,    // 対立関係
      distant: 0.2        // 遠い関係
    };
  }
  
  /**
   * 各卦の序卦伝位置取得
   */
  getSequencePositions(engineHex, interfaceHex, safeModeHex) {
    const enginePos = this.sequenceOrder.indexOf(engineHex.id);
    const interfacePos = this.sequenceOrder.indexOf(interfaceHex.id);
    const safeModePos = this.sequenceOrder.indexOf(safeModeHex.id);
    
    return {
      engine: {
        hexagram: engineHex,
        position: enginePos,
        stage: this.getSequenceStage(enginePos),
        meaning: this.getPositionMeaning(enginePos)
      },
      interface: {
        hexagram: interfaceHex,
        position: interfacePos,
        stage: this.getSequenceStage(interfacePos),
        meaning: this.getPositionMeaning(interfacePos)
      },
      safeMode: {
        hexagram: safeModeHex,
        position: safeModePos,
        stage: this.getSequenceStage(safeModePos),
        meaning: this.getPositionMeaning(safeModePos)
      }
    };
  }
  
  /**
   * 序卦伝段階の取得
   */
  getSequenceStage(position) {
    if (position < 8) return "創生期";      // 1-8卦: 天地創造から基本形成
    if (position < 16) return "発展期";     // 9-16卦: 発展と充実
    if (position < 24) return "変革期";     // 17-24卦: 変化と調整
    if (position < 32) return "深化期";     // 25-32卦: 深化と洗練
    if (position < 40) return "展開期";     // 33-40卦: 展開と拡張
    if (position < 48) return "調整期";     // 41-48卦: 調整と統合
    if (position < 56) return "変容期";     // 49-56卦: 変容と革新
    return "完成期";                        // 57-64卦: 完成と循環
  }
  
  /**
   * 位置の意味取得
   */
  getPositionMeaning(position) {
    const meanings = [
      "創造の始まり", "受容の基盤", "困難な始動", "学びの時期",
      "忍耐と待機", "対立と争い", "統率の必要", "協調と親密",
      "小さな蓄積", "慎重な歩み", "開放と通達", "閉塞と内省",
      "協同の精神", "豊かな成果", "謙虚な姿勢", "喜びと準備",
      "柔軟な追随", "秩序の整備", "臨場と監督", "観察と洞察",
      "決断と刑罰", "美と装飾", "剥落と衰退", "復活と回復",
      "純真無垢", "大いなる蓄積", "養育と成長", "過度な負担",
      "危険と試練", "明知と照明", "感応と交流", "持続と恒常",
      "退避と隠遁", "大いなる力", "前進と昇進", "困難と暗闇",
      "家庭の和", "対立と乖離", "障害と困難", "解決と開放",
      "損失と犠牲", "利益と増大", "決断と切断", "偶然の出会い",
      "集合と統合", "上昇と発展", "困窮と行き詰まり", "生命の源",
      "変革と革新", "安定と確立", "震動と活動", "静止と瞑想",
      "漸進的発展", "女性の帰属", "豊かな頂点", "旅と流浪",
      "柔軟な浸透", "喜悦と交流", "散逸と分離", "節制と調整",
      "誠実と信頼", "小さな過ち", "完成と達成", "未完と可能性"
    ];
    
    return meanings[position] || "調和と発展";
  }
  
  /**
   * 二卦間関係性分析
   */
  analyzePairRelationships(engineHex, interfaceHex, safeModeHex) {
    return {
      engineInterface: this.analyzePairRelation(engineHex, interfaceHex, "Engine-Interface"),
      engineSafeMode: this.analyzePairRelation(engineHex, safeModeHex, "Engine-SafeMode"),
      interfaceSafeMode: this.analyzePairRelation(interfaceHex, safeModeHex, "Interface-SafeMode")
    };
  }
  
  /**
   * 単一二卦関係分析
   */
  analyzePairRelation(hex1, hex2, pairName) {
    const pos1 = this.sequenceOrder.indexOf(hex1.id);
    const pos2 = this.sequenceOrder.indexOf(hex2.id);
    const distance = Math.abs(pos1 - pos2);
    
    // 関係性タイプの判定
    let relationType = "distant";
    let relationshipStrength = 0.2;
    
    if (distance === 1) {
      relationType = "adjacent";
      relationshipStrength = 1.0;
    } else if (distance === 2) {
      relationType = "paired";  
      relationshipStrength = 0.8;
    } else if (distance <= 8) {
      relationType = "sameFamily";
      relationshipStrength = 0.6;
    } else if (this.isComplementary(hex1.id, hex2.id)) {
      relationType = "complement";
      relationshipStrength = 0.7;
    } else if (this.isOpposition(hex1.id, hex2.id)) {
      relationType = "opposition";
      relationshipStrength = 0.5;
    }
    
    return {
      pairName: pairName,
      hexagram1: { id: hex1.id, name: hex1.name, position: pos1 },
      hexagram2: { id: hex2.id, name: hex2.name, position: pos2 },
      distance: distance,
      relationType: relationType,
      relationName: this.relationshipTypes[relationType],
      strength: relationshipStrength,
      dynamics: this.analyzeDynamics(hex1, hex2, relationType),
      guidance: this.generatePairGuidance(hex1, hex2, relationType)
    };
  }
  
  /**
   * 三卦統合関係分析
   */
  analyzeTripleRelationship(engineHex, interfaceHex, safeModeHex) {
    const positions = [
      this.sequenceOrder.indexOf(engineHex.id),
      this.sequenceOrder.indexOf(interfaceHex.id),
      this.sequenceOrder.indexOf(safeModeHex.id)
    ].sort((a, b) => a - b);
    
    const span = positions[2] - positions[0];
    const balance = this.calculateTripleBalance(positions);
    const integration = this.calculateTripleIntegration(engineHex, interfaceHex, safeModeHex);
    
    return {
      positions: positions,
      span: span,
      balance: balance,
      integration: integration,
      pattern: this.identifyTriplePattern(positions),
      harmony: this.calculateTripleHarmony(engineHex, interfaceHex, safeModeHex),
      development: this.assessTripleDevelopment(positions),
      guidance: this.generateTripleGuidance(engineHex, interfaceHex, safeModeHex, balance)
    };
  }
  
  /**
   * 発展段階の特定
   */
  identifyDevelopmentStage(positions) {
    const stages = [
      positions.engine.stage,
      positions.interface.stage, 
      positions.safeMode.stage
    ];
    
    const avgPosition = (
      positions.engine.position + 
      positions.interface.position + 
      positions.safeMode.position
    ) / 3;
    
    return {
      individualStages: stages,
      overallStage: this.getSequenceStage(Math.floor(avgPosition)),
      dominantStage: this.findDominantStage(stages),
      stageBalance: this.calculateStageBalance(stages),
      developmentGuidance: this.generateDevelopmentGuidance(stages, avgPosition)
    };
  }
  
  /**
   * 変化の方向性分析
   */
  analyzeTransformationPath(engineHex, interfaceHex, safeModeHex) {
    const currentState = this.assessCurrentState(engineHex, interfaceHex, safeModeHex);
    const potentialPaths = this.identifyTransformationPaths(engineHex, interfaceHex, safeModeHex);
    const recommendedPath = this.selectOptimalPath(potentialPaths);
    
    return {
      currentState: currentState,
      potentialPaths: potentialPaths,
      recommendedPath: recommendedPath,
      transformationGuidance: this.generateTransformationGuidance(recommendedPath),
      timeframe: this.estimateTransformationTimeframe(currentState, recommendedPath)
    };
  }
  
  /**
   * 序卦伝洞察の生成
   */
  generateSequenceInsights(positions, pairRelations, tripleRelation, developmentStage, transformationPath) {
    return {
      overview: this.generateOverviewInsight(tripleRelation, developmentStage),
      
      osRelationships: {
        engineInterface: this.generateRelationshipInsight(pairRelations.engineInterface),
        engineSafeMode: this.generateRelationshipInsight(pairRelations.engineSafeMode),
        interfaceSafeMode: this.generateRelationshipInsight(pairRelations.interfaceSafeMode)
      },
      
      developmentInsights: this.generateDevelopmentInsights(developmentStage),
      transformationInsights: this.generateTransformationInsights(transformationPath),
      
      practicalGuidance: this.generatePracticalGuidance(
        positions, pairRelations, tripleRelation, developmentStage
      ),
      
      ancientWisdom: this.generateAncientWisdom(positions, tripleRelation)
    };
  }
  
  /**
   * 可視化データの生成
   */
  generateVisualizationData(positions, pairRelations, tripleRelation) {
    return {
      sequenceChart: this.generateSequenceChart(positions),
      relationshipNetwork: this.generateRelationshipNetwork(pairRelations),
      harmonyRadar: this.generateHarmonyRadar(tripleRelation),
      transformationFlow: this.generateTransformationFlow(tripleRelation)
    };
  }
  
  // ===== ヘルパーメソッド =====
  
  /**
   * 相補関係の判定
   */
  isComplementary(id1, id2) {
    // 相補関係のペア（簡略版）
    const complementPairs = [
      [1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11, 12],
      [13, 14], [15, 16], [17, 18], [19, 20], [21, 22], [23, 24],
      [25, 26], [27, 28], [29, 30], [31, 32], [33, 34], [35, 36],
      [37, 38], [39, 40], [41, 42], [43, 44], [45, 46], [47, 48],
      [49, 50], [51, 52], [53, 54], [55, 56], [57, 58], [59, 60],
      [61, 62], [63, 64]
    ];
    
    return complementPairs.some(pair => 
      (pair[0] === id1 && pair[1] === id2) || 
      (pair[0] === id2 && pair[1] === id1)
    );
  }
  
  /**
   * 対立関係の判定
   */
  isOpposition(id1, id2) {
    // 対立関係の判定（簡略版）
    const oppositionDistance = 32; // 序卦伝で対極にある卦
    return Math.abs(id1 - id2) >= oppositionDistance;
  }
  
  /**
   * 動力学の分析
   */
  analyzeDynamics(hex1, hex2, relationType) {
    const dynamics = {
      energy: this.calculatePairEnergy(hex1, hex2),
      flow: this.determinePairFlow(hex1, hex2),
      stability: this.assessPairStability(hex1, hex2, relationType)
    };
    
    return dynamics;
  }
  
  /**
   * 三卦バランス計算
   */
  calculateTripleBalance(positions) {
    const mean = positions.reduce((sum, pos) => sum + pos, 0) / positions.length;
    const variance = positions.reduce((sum, pos) => sum + Math.pow(pos - mean, 2), 0) / positions.length;
    
    return Math.max(0, 1 - variance / 1000); // 正規化
  }
  
  /**
   * 三卦統合度計算
   */
  calculateTripleIntegration(engineHex, interfaceHex, safeModeHex) {
    // 三卦の八卦構成要素の共通性から統合度を計算
    const engineTrigrams = engineHex.trigrams || [];
    const interfaceTrigrams = interfaceHex.trigrams || [];
    const safeModeTrigrams = safeModeHex.trigrams || [];
    
    const allTrigrams = [...engineTrigrams, ...interfaceTrigrams, ...safeModeTrigrams];
    const uniqueTrigrams = [...new Set(allTrigrams)];
    
    // 共通要素が多いほど統合度が高い
    return 1 - (uniqueTrigrams.length / allTrigrams.length);
  }
  
  /**
   * 三卦調和度計算
   */
  calculateTripleHarmony(engineHex, interfaceHex, safeModeHex) {
    const ids = [engineHex.id, interfaceHex.id, safeModeHex.id];
    const distances = [
      Math.abs(ids[0] - ids[1]),
      Math.abs(ids[0] - ids[2]),
      Math.abs(ids[1] - ids[2])
    ];
    
    const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
    return Math.max(0, 1 - avgDistance / 64); // 正規化
  }
  
  /**
   * 支配的段階の特定
   */
  findDominantStage(stages) {
    const stageCount = {};
    stages.forEach(stage => {
      stageCount[stage] = (stageCount[stage] || 0) + 1;
    });
    
    return Object.keys(stageCount).reduce((dominant, stage) => 
      stageCount[stage] > stageCount[dominant] ? stage : dominant
    );
  }
  
  /**
   * 段階バランス計算
   */
  calculateStageBalance(stages) {
    const uniqueStages = [...new Set(stages)];
    return uniqueStages.length / stages.length; // 多様性指数
  }
  
  /**
   * 現在状態の評価
   */
  assessCurrentState(engineHex, interfaceHex, safeModeHex) {
    const totalEnergy = engineHex.id + interfaceHex.id + safeModeHex.id;
    const balance = this.calculateTripleBalance([engineHex.id, interfaceHex.id, safeModeHex.id]);
    const harmony = this.calculateTripleHarmony(engineHex, interfaceHex, safeModeHex);
    
    return {
      energy: totalEnergy / 192, // 正規化 (3 * 64 = 192)
      balance: balance,
      harmony: harmony,
      stability: (balance + harmony) / 2,
      description: this.describeCurrentState(balance, harmony)
    };
  }
  
  /**
   * 変化パスの特定
   */
  identifyTransformationPaths(engineHex, interfaceHex, safeModeHex) {
    // 各OSの潜在的変化方向を分析
    const paths = [];
    
    // Engine OS変化パス
    paths.push({
      target: "engine",
      direction: this.getTransformationDirection(engineHex),
      potential: this.assessTransformationPotential(engineHex)
    });
    
    // Interface OS変化パス
    paths.push({
      target: "interface", 
      direction: this.getTransformationDirection(interfaceHex),
      potential: this.assessTransformationPotential(interfaceHex)
    });
    
    // SafeMode OS変化パス
    paths.push({
      target: "safeMode",
      direction: this.getTransformationDirection(safeModeHex),
      potential: this.assessTransformationPotential(safeModeHex)
    });
    
    return paths;
  }
  
  /**
   * 最適パスの選択
   */
  selectOptimalPath(potentialPaths) {
    return potentialPaths.reduce((optimal, path) => 
      path.potential > optimal.potential ? path : optimal
    );
  }
  
  // ===== 洞察生成メソッド =====
  
  generateOverviewInsight(tripleRelation, developmentStage) {
    return `あなたの三つのOSは序卦伝において「${developmentStage.overallStage}」の段階にあり、全体的な調和度は${(tripleRelation.harmony * 100).toFixed(0)}%です。`;
  }
  
  generateRelationshipInsight(pairRelation) {
    return `${pairRelation.pairName}の関係は「${pairRelation.relationName}」であり、関係強度は${(pairRelation.strength * 100).toFixed(0)}%です。`;
  }
  
  generateDevelopmentInsights(developmentStage) {
    return [
      `現在の発展段階: ${developmentStage.overallStage}`,
      `支配的段階: ${developmentStage.dominantStage}`,
      `段階バランス: ${(developmentStage.stageBalance * 100).toFixed(0)}%`
    ];
  }
  
  generateTransformationInsights(transformationPath) {
    return [
      `変化の方向性: ${transformationPath.recommendedPath.direction}`,
      `変化の対象: ${transformationPath.recommendedPath.target} OS`,
      `変化の可能性: ${(transformationPath.recommendedPath.potential * 100).toFixed(0)}%`
    ];
  }
  
  generatePracticalGuidance(positions, pairRelations, tripleRelation, developmentStage) {
    return [
      `Engine OS（${positions.engine.hexagram.name}）: ${positions.engine.meaning}を活かしましょう`,
      `Interface OS（${positions.interface.hexagram.name}）: ${positions.interface.meaning}により関係を築きましょう`,
      `SafeMode OS（${positions.safeMode.hexagram.name}）: ${positions.safeMode.meaning}で自分を守りましょう`,
      `全体的には${developmentStage.overallStage}として、${tripleRelation.development}に注力することが重要です`
    ];
  }
  
  generateAncientWisdom(positions, tripleRelation) {
    return [
      "序卦伝曰く「天地定まりて万物生ず」- 三つのOSの調和により真の自分が現れます",
      "易は変化の学問 - 現状に留まらず成長し続けることが大切です",
      "中庸の道 - 極端に偏らず、バランスを保つことで安定した発展が可能です"
    ];
  }
  
  // ===== 可視化データ生成メソッド =====
  
  generateSequenceChart(positions) {
    return {
      type: "line",
      data: {
        labels: ["Engine OS", "Interface OS", "SafeMode OS"],
        datasets: [{
          label: "序卦伝位置",
          data: [positions.engine.position, positions.interface.position, positions.safeMode.position],
          borderColor: "#4ecdc4",
          backgroundColor: "rgba(78, 205, 196, 0.1)"
        }]
      }
    };
  }
  
  generateRelationshipNetwork(pairRelations) {
    return {
      nodes: [
        { id: "engine", name: "Engine OS", color: "#ff6b6b" },
        { id: "interface", name: "Interface OS", color: "#4ecdc4" },
        { id: "safeMode", name: "SafeMode OS", color: "#ffd93d" }
      ],
      edges: [
        { 
          from: "engine", 
          to: "interface", 
          strength: pairRelations.engineInterface.strength,
          type: pairRelations.engineInterface.relationType 
        },
        { 
          from: "engine", 
          to: "safeMode", 
          strength: pairRelations.engineSafeMode.strength,
          type: pairRelations.engineSafeMode.relationType 
        },
        { 
          from: "interface", 
          to: "safeMode", 
          strength: pairRelations.interfaceSafeMode.strength,
          type: pairRelations.interfaceSafeMode.relationType 
        }
      ]
    };
  }
  
  generateHarmonyRadar(tripleRelation) {
    return {
      type: "radar",
      data: {
        labels: ["統合度", "調和度", "バランス", "安定性", "発展性"],
        datasets: [{
          label: "Triple OS Harmony",
          data: [
            tripleRelation.integration * 100,
            tripleRelation.harmony * 100,
            tripleRelation.balance * 100,
            (tripleRelation.integration + tripleRelation.harmony) / 2 * 100,
            tripleRelation.span / 64 * 100
          ],
          backgroundColor: "rgba(78, 205, 196, 0.2)",
          borderColor: "#4ecdc4"
        }]
      }
    };
  }
  
  generateTransformationFlow(tripleRelation) {
    return {
      type: "flow",
      stages: [
        { name: "現在状態", value: tripleRelation.harmony },
        { name: "調整期", value: tripleRelation.balance },
        { name: "統合期", value: tripleRelation.integration },
        { name: "発展期", value: tripleRelation.development }
      ]
    };
  }
  
  // ===== フォールバック・ユーティリティ =====
  
  generateFallbackAnalysis(engineHex, interfaceHex, safeModeHex) {
    return {
      timestamp: new Date().toISOString(),
      analyzerVersion: this.version,
      fallback: true,
      message: "序卦伝分析でエラーが発生しました。基本的な関係性分析を提供します。",
      basicAnalysis: {
        hexagrams: [engineHex.name, interfaceHex.name, safeModeHex.name],
        guidance: "三つの卦の調和を意識し、バランスの取れた人格発達を目指しましょう。"
      }
    };
  }
  
  cacheAnalysis(engineHex, interfaceHex, safeModeHex, result) {
    const cacheKey = `${engineHex.id}-${interfaceHex.id}-${safeModeHex.id}`;
    this.analysisCache.set(cacheKey, {
      result: result,
      timestamp: Date.now()
    });
  }
  
  getStats() {
    return {
      version: this.version,
      cacheSize: this.analysisCache.size,
      supportedHexagrams: 64,
      relationshipTypes: Object.keys(this.relationshipTypes).length
    };
  }
  
  // ===== プライベートヘルパーメソッド =====
  
  calculatePairEnergy(hex1, hex2) {
    return (hex1.id + hex2.id) / 128; // 正規化
  }
  
  determinePairFlow(hex1, hex2) {
    return hex1.id > hex2.id ? "descending" : "ascending";
  }
  
  assessPairStability(hex1, hex2, relationType) {
    const baseStability = this.relationshipWeights[relationType] || 0.5;
    const idStability = 1 - Math.abs(hex1.id - hex2.id) / 64;
    return (baseStability + idStability) / 2;
  }
  
  identifyTriplePattern(positions) {
    const span = positions[2] - positions[0];
    if (span < 16) return "凝縮型";
    if (span < 32) return "展開型";
    return "広域型";
  }
  
  assessTripleDevelopment(positions) {
    const avgPos = positions.reduce((sum, pos) => sum + pos, 0) / positions.length;
    if (avgPos < 16) return "形成期の発展";
    if (avgPos < 32) return "成長期の発展";
    if (avgPos < 48) return "成熟期の発展";
    return "完成期の発展";
  }
  
  generateTripleGuidance(engineHex, interfaceHex, safeModeHex, balance) {
    if (balance > 0.8) {
      return "三つのOSが高度にバランスを保っています。現状を維持しつつ更なる発展を目指しましょう。";
    } else if (balance > 0.6) {
      return "OSのバランスは良好です。時々調整を行いながら成長を続けましょう。";
    } else {
      return "OSの間にアンバランスがあります。調和を図ることでより統合された状態に導かれるでしょう。";
    }
  }
  
  generateDevelopmentGuidance(stages, avgPosition) {
    const currentStage = this.getSequenceStage(Math.floor(avgPosition));
    return `現在の${currentStage}において、着実な発展を心がけましょう。`;
  }
  
  generateTransformationGuidance(recommendedPath) {
    return `${recommendedPath.target} OSの${recommendedPath.direction}に向かう変化が最も有効でしょう。`;
  }
  
  estimateTransformationTimeframe(currentState, recommendedPath) {
    const complexity = 1 - currentState.stability;
    const potential = recommendedPath.potential;
    
    if (complexity < 0.3 && potential > 0.7) return "短期（数週間）";
    if (complexity < 0.6 && potential > 0.5) return "中期（数ヶ月）";
    return "長期（半年以上）";
  }
  
  describeCurrentState(balance, harmony) {
    if (balance > 0.8 && harmony > 0.8) return "高度に調和した安定状態";
    if (balance > 0.6 && harmony > 0.6) return "バランスの取れた成長状態";
    if (balance > 0.4 || harmony > 0.4) return "調整が必要な発展状態";
    return "変革が求められる状態";
  }
  
  getTransformationDirection(hexagram) {
    const pos = this.sequenceOrder.indexOf(hexagram.id);
    if (pos < 16) return "発展への方向";
    if (pos < 32) return "深化への方向";
    if (pos < 48) return "統合への方向";
    return "完成への方向";
  }
  
  assessTransformationPotential(hexagram) {
    const pos = this.sequenceOrder.indexOf(hexagram.id);
    // 序卦伝の中程（変化の可能性が高い）ほど高い値
    return 1 - Math.abs(pos - 32) / 32;
  }
  
  generatePairGuidance(hex1, hex2, relationType) {
    const guidanceMap = {
      adjacent: `${hex1.name}と${hex2.name}は密接な関係にあります。この自然な流れを活かしましょう。`,
      paired: `${hex1.name}と${hex2.name}は相補的な関係です。互いの特性を尊重し合いましょう。`,
      sameFamily: `${hex1.name}と${hex2.name}は同じ性質を持ちます。共通点を活かして協力しましょう。`,
      complement: `${hex1.name}と${hex2.name}は補完し合います。バランスを保つことが重要です。`,
      opposition: `${hex1.name}と${hex2.name}は対照的です。この緊張関係から学びを得ましょう。`,
      distant: `${hex1.name}と${hex2.name}は異なる分野です。多様性を受け入れ統合を図りましょう。`
    };
            
    return guidanceMap[relationType] || "調和を心がけましょう。";
  }
}

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.SequenceAnalyzer = SequenceAnalyzer;
  console.log('✅ SequenceAnalyzer loaded - Ancient sequence wisdom activated');
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SequenceAnalyzer;
}