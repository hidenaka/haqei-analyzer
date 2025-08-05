/**
 * IChing_TripleOS_Bridge.js - I Ching易経とTriple OS統合ブリッジシステム
 * 
 * 機能：
 * - H384_DATABASE.jsとTripleOSAnalyzer.jsの橋渡し
 * - 384爻易経データベースによる深層心理分析統合
 * - 序卦伝（じょかでん）による相互関係性分析
 * - bunenjin哲学と易経の叡智の融合
 * 
 * バージョン: v1.0.0-iching-integration
 * 作成日: 2025-08-05
 */

class IChing_TripleOS_Bridge {
  constructor(h384Database) {
    this.version = "1.0.0-iching-integration";
    this.h384Database = h384Database;
    this.initialized = false;
    
    // Triple OSと易経の対応マッピング
    this.osHexagramMapping = {
      engine: {
        // Engine OS（価値観システム）関連卦
        primary: [1, 14, 43, 44], // 乾為天、火天大有、沢天夬、天風姤
        secondary: [9, 10, 13, 25], // 風天小畜、天沢履、天火同人、天雷無妄
        attributes: ["創造", "積極", "理想", "信念"]
      },
      interface: {
        // Interface OS（社会的システム）関連卦
        primary: [15, 31, 45, 49], // 地山謙、沢山咸、沢地萃、沢火革
        secondary: [16, 17, 19, 58], // 雷地豫、沢雷随、地沢臨、兌為沢
        attributes: ["調和", "適応", "表現", "関係"]
      },
      safeMode: {
        // SafeMode OS（防御システム）関連卦
        primary: [2, 7, 8, 39], // 坤為地、地水師、水地比、水山蹇
        secondary: [23, 24, 41, 52], // 山地剥、地雷復、山沢損、艮為山
        attributes: ["保護", "安定", "忍耐", "警戒"]
      }
    };
    
    // 序卦伝による関係性パターン
    this.sequencePatterns = this.initializeSequencePatterns();
    
    // 分析結果キャッシュ
    this.bridgeCache = new Map();
    
    console.log("🌉 IChing_TripleOS_Bridge initialized - connecting ancient wisdom with modern psychology");
  }
  
  /**
   * ブリッジシステム初期化
   */
  async initialize() {
    if (this.initialized) return true;
    
    try {
      if (!this.h384Database) {
        console.warn("⚠️ H384_DATABASE not provided, using fallback mappings");
        this.initialized = true;
        return true;
      }
      
      // H384データベース初期化
      await this.h384Database.initialize();
      
      // 序卦伝データの準備
      await this.prepareSequenceData();
      
      this.initialized = true;
      console.log("✅ IChing_TripleOS_Bridge fully initialized");
      return true;
      
    } catch (error) {
      console.error("❌ Failed to initialize IChing_TripleOS_Bridge:", error);
      this.initialized = true; // フォールバックモードで動作
      return false;
    }
  }
  
  /**
   * Triple OS分析結果をI Ching解釈に統合
   * 
   * @param {Object} tripleOSResult - TripleOSAnalyzerの分析結果
   * @returns {Object} I Ching統合分析結果
   */
  async integrateWithIChing(tripleOSResult) {
    await this.initialize();
    
    try {
      console.log("🔮 Starting I Ching integration with Triple OS analysis");
      
      // Step 1: 各OSに対応する卦の選定
      const hexagrams = await this.selectHexagramsForOS(tripleOSResult);
      
      // Step 2: 序卦伝による関係性分析
      const relationships = this.analyzeSequenceRelationships(hexagrams);
      
      // Step 3: 統合解釈の生成
      const interpretation = await this.generateIntegratedInterpretation(
        tripleOSResult, hexagrams, relationships
      );
      
      // Step 4: 実用的ガイダンスの生成
      const guidance = this.generateIChingGuidance(
        tripleOSResult, hexagrams, relationships
      );
      
      const result = {
        timestamp: new Date().toISOString(),
        bridgeVersion: this.version,
        
        // 選定された卦
        hexagrams: hexagrams,
        
        // 序卦伝関係性
        relationships: relationships,
        
        // 統合解釈
        interpretation: interpretation,
        
        // 実用ガイダンス
        guidance: guidance,
        
        // メタデータ
        metadata: {
          databaseAvailable: !!this.h384Database,
          analysisDepth: this.h384Database ? "full" : "basic",
          confidenceLevel: this.calculateConfidenceLevel(tripleOSResult)
        }
      };
      
      // 結果をキャッシュ
      this.cacheResult(tripleOSResult, result);
      
      console.log("✅ I Ching integration completed successfully");
      return result;
      
    } catch (error) {
      console.error("❌ Error in I Ching integration:", error);
      return this.generateFallbackIntegration(tripleOSResult);
    }
  }
  
  /**
   * 各OSに対応する卦の選定
   */
  async selectHexagramsForOS(tripleOSResult) {
    const hexagrams = {};
    
    for (const osType of ['engine', 'interface', 'safeMode']) {
      const osData = tripleOSResult[osType];
      const hexagram = await this.selectBestHexagram(osData, osType);
      hexagrams[osType] = hexagram;
    }
    
    return hexagrams;
  }
  
  /**
   * OSデータから最適な卦を選定
   */
  async selectBestHexagram(osData, osType) {
    const mapping = this.osHexagramMapping[osType];
    if (!mapping) {
      return this.getDefaultHexagram(osType);
    }
    
    // OS強度に基づいて卦を選択
    const strength = osData.strength || 0.5;
    const consistency = osData.scores?.consistency || 0.5;
    const integration = osData.scores?.integration || 0.5;
    
    // 総合スコアによる卦選択
    const totalScore = (strength + consistency + integration) / 3;
    
    let selectedHexagramId;
    if (totalScore > 0.75) {
      // 高スコア：主要卦から選択
      selectedHexagramId = mapping.primary[0];
    } else if (totalScore > 0.5) {
      // 中スコア：強度に応じて選択
      const index = Math.floor(strength * mapping.primary.length);
      selectedHexagramId = mapping.primary[Math.min(index, mapping.primary.length - 1)];
    } else {
      // 低スコア：副次卦から選択
      const index = Math.floor(strength * mapping.secondary.length);
      selectedHexagramId = mapping.secondary[Math.min(index, mapping.secondary.length - 1)];
    }
    
    return await this.buildHexagramObject(selectedHexagramId, osType);
  }
  
  /**
   * 卦オブジェクトの構築
   */
  async buildHexagramObject(hexagramId, osType) {
    const hexagram = {
      id: hexagramId,
      name: this.getHexagramName(hexagramId),
      chinese: this.getHexagramChinese(hexagramId),
      trigrams: this.getHexagramTrigrams(hexagramId),
      attributes: this.osHexagramMapping[osType]?.attributes || [],
      meaning: this.getHexagramMeaning(hexagramId),
      osType: osType
    };
    
    // H384データベースが利用可能な場合、詳細情報を追加
    if (this.h384Database && this.h384Database.initialized) {
      try {
        const detailedInfo = await this.h384Database.getHexagramDetails(hexagramId);
        if (detailedInfo) {
          hexagram.judgment = detailedInfo.judgment;
          hexagram.image = detailedInfo.image;
          hexagram.lines = detailedInfo.lines;
        }
      } catch (error) {
        console.warn(`⚠️ Could not load detailed info for hexagram ${hexagramId}:`, error);
      }
    }
    
    return hexagram;
  }
  
  /**
   * 序卦伝による関係性分析
   */
  analyzeSequenceRelationships(hexagrams) {
    const relationships = {
      engineInterface: this.analyzeHexagramPair(
        hexagrams.engine, hexagrams.interface, "engine-interface"
      ),
      engineSafeMode: this.analyzeHexagramPair(
        hexagrams.engine, hexagrams.safeMode, "engine-safemode"
      ),
      interfaceSafeMode: this.analyzeHexagramPair(
        hexagrams.interface, hexagrams.safeMode, "interface-safemode"
      ),
      overall: this.analyzeTripleRelationship(hexagrams)
    };
    
    return relationships;
  }
  
  /**
   * 二卦間の関係分析
   */
  analyzeHexagramPair(hex1, hex2, pairType) {
    const idDiff = Math.abs(hex1.id - hex2.id);
    const pattern = this.getSequencePattern(hex1.id, hex2.id);
    
    return {
      type: pairType,
      hexagram1: { id: hex1.id, name: hex1.name },
      hexagram2: { id: hex2.id, name: hex2.name },
      pattern: pattern,
      tension: this.calculateTension(hex1, hex2),
      harmony: this.calculateHarmony(hex1, hex2),
      guidance: this.generatePairGuidance(hex1, hex2, pattern)
    };
  }
  
  /**
   * 三卦の全体関係分析
   */
  analyzeTripleRelationship(hexagrams) {
    const { engine, interface, safeMode } = hexagrams;
    
    // 三卦の統合パターン分析
    const integrationLevel = this.calculateTripleIntegration(engine, interface, safeMode);
    const dominantElement = this.findDominantElement(engine, interface, safeMode);
    const balanceState = this.assessTripleBalance(engine, interface, safeMode);
    
    return {
      integrationLevel: integrationLevel,
      dominantElement: dominantElement,
      balanceState: balanceState,
      overallGuidance: this.generateTripleGuidance(engine, interface, safeMode),
      transformationPotential: this.assessTransformationPotential(engine, interface, safeMode)
    };
  }
  
  /**
   * 統合解釈の生成
   */
  async generateIntegratedInterpretation(tripleOSResult, hexagrams, relationships) {
    const interpretation = {
      overview: this.generateOverview(tripleOSResult, hexagrams),
      osAnalysis: this.generateOSAnalysis(tripleOSResult, hexagrams),
      ichingInsights: this.generateIChingInsights(hexagrams, relationships),
      integration: this.generateIntegrationInsights(tripleOSResult, hexagrams, relationships)
    };
    
    return interpretation;
  }
  
  /**
   * 概要生成
   */
  generateOverview(tripleOSResult, hexagrams) {
    const engineHex = hexagrams.engine;
    const interfaceHex = hexagrams.interface;
    const safeModeHex = hexagrams.safeMode;
    
    return {
      summary: `あなたの人格は、${engineHex.name}（${engineHex.meaning}）を核とする価値観、${interfaceHex.name}（${interfaceHex.meaning}）で表現される社会性、${safeModeHex.name}（${safeModeHex.meaning}）による防御機制で構成されています。`,
      
      bunenjinPerspective: `bunenjin哲学の観点から、これらの三つの「分人」は互いに独立しながらも調和を保ち、状況に応じて適切に表れることで、あなたの豊かな人格を形成しています。`,
      
      ichingWisdom: `易経の叡智によれば、これらの卦の組み合わせは「${this.getTripleHexagramMeaning(engineHex, interfaceHex, safeModeHex)}」を示しており、バランスの取れた成長と発展への道を示唆しています。`
    };
  }
  
  /**
   * OS分析生成
   */
  generateOSAnalysis(tripleOSResult, hexagrams) {
    return {
      engine: {
        osStrength: tripleOSResult.engine.strength,
        hexagram: hexagrams.engine.name,
        meaning: hexagrams.engine.meaning,
        guidance: `${hexagrams.engine.name}の力により、あなたの核となる価値観は「${hexagrams.engine.meaning}」として表れています。この価値観を大切にしながら行動することで、真の自分らしさを発揮できるでしょう。`
      },
      
      interface: {
        osStrength: tripleOSResult.interface.strength,
        hexagram: hexagrams.interface.name,
        meaning: hexagrams.interface.meaning,
        guidance: `${hexagrams.interface.name}が示すように、あなたの社会的表現は「${hexagrams.interface.meaning}」の性質を持っています。この特性を活かして、他者との関係を築いていくことができます。`
      },
      
      safeMode: {
        osStrength: tripleOSResult.safeMode.strength,
        hexagram: hexagrams.safeMode.name,
        meaning: hexagrams.safeMode.meaning,
        guidance: `${hexagrams.safeMode.name}に表れるように、あなたの防御システムは「${hexagrams.safeMode.meaning}」によって機能しています。適切な自己保護により、安心して成長することができます。`
      }
    };
  }
  
  /**
   * I Ching洞察生成
   */
  generateIChingInsights(hexagrams, relationships) {
    return {
      ancientWisdom: "易経の古い叡智によれば、人の心は常に変化し、状況に応じて異なる側面を表します。",
      
      hexagramWisdom: [
        `${hexagrams.engine.name}: ${this.getHexagramWisdom(hexagrams.engine.id)}`,
        `${hexagrams.interface.name}: ${this.getHexagramWisdom(hexagrams.interface.id)}`,
        `${hexagrams.safeMode.name}: ${this.getHexagramWisdom(hexagrams.safeMode.id)}`
      ],
      
      relationshipDynamics: relationships.overall.overallGuidance,
      
      transformationPath: this.generateTransformationPath(hexagrams, relationships)
    };
  }
  
  /**
   * 統合洞察生成
   */
  generateIntegrationInsights(tripleOSResult, hexagrams, relationships) {
    const harmonyLevel = tripleOSResult.bunenjin?.harmony || 0.5;
    
    return {
      currentState: harmonyLevel > 0.7 ? "高度な統合状態" : 
                   harmonyLevel > 0.5 ? "バランスの取れた状態" : "調整が必要な状態",
                   
      integrationAdvice: this.generateIntegrationAdvice(harmonyLevel, relationships),
      
      developmentPath: this.generateDevelopmentPath(tripleOSResult, hexagrams),
      
      practicalSteps: this.generatePracticalSteps(tripleOSResult, hexagrams, relationships)
    };
  }
  
  // ===== ユーティリティメソッド =====
  
  /**
   * 序卦伝パターン初期化
   */
  initializeSequencePatterns() {
    return {
      adjacent: "連続した関係 - 自然な流れ",
      opposite: "対立した関係 - 補完と緊張",
      complement: "補完的関係 - 相互支援",
      transform: "変化の関係 - 成長と発展"
    };
  }
  
  /**
   * 序卦伝データ準備
   */
  async prepareSequenceData() {
    // H384データベースから序卦伝データを読み込み
    // 実装は簡略化
  }
  
  /**
   * 信頼度レベル計算
   */
  calculateConfidenceLevel(tripleOSResult) {
    const harmonyLevel = tripleOSResult.bunenjin?.harmony || 0.5;
    const integrationLevel = tripleOSResult.bunenjin?.integration || 0.5;
    
    return (harmonyLevel + integrationLevel) / 2;
  }
  
  /**
   * デフォルト卦取得
   */
  getDefaultHexagram(osType) {
    const defaults = {
      engine: { id: 1, name: "乾為天", meaning: "創造と積極性" },
      interface: { id: 15, name: "地山謙", meaning: "謙虚と調和" },
      safeMode: { id: 2, name: "坤為地", meaning: "受容と安定" }
    };
    
    return defaults[osType] || defaults.engine;
  }
  
  /**
   * 卦名取得
   */
  getHexagramName(id) {
    const names = {
      1: "乾為天", 2: "坤為地", 7: "地水師", 8: "水地比", 9: "風天小畜", 10: "天沢履",
      13: "天火同人", 14: "火天大有", 15: "地山謙", 16: "雷地豫", 17: "沢雷随", 19: "地沢臨",
      23: "山地剥", 24: "地雷復", 25: "天雷無妄", 31: "沢山咸", 39: "水山蹇", 41: "山沢損",
      43: "沢天夬", 44: "天風姤", 45: "沢地萃", 49: "沢火革", 52: "艮為山", 58: "兌為沢"
    };
    return names[id] || `第${id}卦`;
  }
  
  /**
   * 卦の中国名取得
   */
  getHexagramChinese(id) {
    const chinese = {
      1: "乾", 2: "坤", 7: "師", 8: "比", 9: "小畜", 10: "履",
      13: "同人", 14: "大有", 15: "謙", 16: "豫", 17: "随", 19: "臨",
      23: "剥", 24: "復", 25: "無妄", 31: "咸", 39: "蹇", 41: "損",
      43: "夬", 44: "姤", 45: "萃", 49: "革", 52: "艮", 58: "兌"
    };
    return chinese[id] || `${id}`;
  }
  
  /**
   * 卦の意味取得
   */
  getHexagramMeaning(id) {
    const meanings = {
      1: "創造と積極性", 2: "受容と安定", 7: "統率と組織", 8: "協調と親密",
      9: "小さな蓄積", 10: "礼儀と行動", 13: "協同と団結", 14: "豊かさと成功",
      15: "謙虚と調和", 16: "喜びと豫備", 17: "従順と追随", 19: "指導と監督",
      23: "剥落と衰退", 24: "復帰と回復", 25: "無邪気と自然", 31: "感応と結合",
      39: "困難と阻害", 41: "損失と減少", 43: "決断と突破", 44: "遭遇と出会い",
      45: "集合と統合", 49: "変革と革新", 52: "静止と安定", 58: "喜悦と交流"
    };
    return meanings[id] || "調和と発展";
  }
  
  /**
   * 卦の八卦構成取得
   */
  getHexagramTrigrams(id) {
    const trigrams = {
      1: ["乾", "乾"], 2: ["坤", "坤"], 7: ["坤", "坎"], 8: ["坎", "坤"],
      9: ["巽", "乾"], 10: ["兌", "乾"], 13: ["離", "乾"], 14: ["乾", "離"],
      15: ["坤", "艮"], 16: ["震", "坤"], 17: ["兌", "震"], 19: ["坤", "兌"],
      23: ["山地剥"], 24: ["地雷復"], 25: ["震", "乾"], 31: ["兌", "艮"],
      39: ["坎", "艮"], 41: ["艮", "兌"], 43: ["兌", "乾"], 44: ["乾", "巽"],
      45: ["兌", "坤"], 49: ["兌", "離"], 52: ["艮", "艮"], 58: ["兌", "兌"]
    };
    return trigrams[id] || ["乾", "坤"];
  }
  
  /**
   * フォールバック統合結果生成
   */
  generateFallbackIntegration(tripleOSResult) {
    return {
      timestamp: new Date().toISOString(),
      bridgeVersion: this.version,
      fallback: true,
      message: "I Ching統合システムが利用できないため、基本的な分析を提供します",
      basicGuidance: [
        "あなたの三つのOS（Engine、Interface、SafeMode）はそれぞれ独自の特性を持っています",
        "これらのバランスを取ることで、より統合された人格を築くことができます",
        "状況に応じて適切なOSを使い分けることが重要です"
      ]
    };
  }
  
  /**
   * 統計情報取得
   */
  getStats() {
    return {
      version: this.version,
      initialized: this.initialized,
      databaseAvailable: !!this.h384Database,
      cacheSize: this.bridgeCache.size,
      supportedHexagrams: Object.keys(this.osHexagramMapping).length * 8 // 概算
    };
  }
  
  // ===== プライベートヘルパーメソッド =====
  
  calculateTension(hex1, hex2) {
    // 簡略化された緊張度計算
    return Math.abs(hex1.id - hex2.id) / 64;
  }
  
  calculateHarmony(hex1, hex2) {
    // 簡略化された調和度計算
    return Math.max(0, 1 - this.calculateTension(hex1, hex2));
  }
  
  getSequencePattern(id1, id2) {
    const diff = Math.abs(id1 - id2);
    if (diff <= 1) return "adjacent";
    if (diff >= 32) return "opposite"; 
    if (diff <= 8) return "complement";
    return "transform";
  }
  
  generatePairGuidance(hex1, hex2, pattern) {
    return `${hex1.name}と${hex2.name}の関係は「${pattern}」のパターンを示しています。`;
  }
  
  calculateTripleIntegration(engine, interface, safeMode) {
    // 三卦の統合レベル計算（簡略版）
    const avgId = (engine.id + interface.id + safeMode.id) / 3;
    const variance = Math.pow(engine.id - avgId, 2) + Math.pow(interface.id - avgId, 2) + Math.pow(safeMode.id - avgId, 2);
    return Math.max(0, 1 - variance / 1000);
  }
  
  findDominantElement(engine, interface, safeMode) {
    // 支配的要素の特定（簡略版）
    const maxId = Math.max(engine.id, interface.id, safeMode.id);
    if (engine.id === maxId) return "Engine OS";
    if (interface.id === maxId) return "Interface OS";
    return "SafeMode OS";
  }
  
  assessTripleBalance(engine, interface, safeMode) {
    const integration = this.calculateTripleIntegration(engine, interface, safeMode);
    if (integration > 0.8) return "高度にバランス";
    if (integration > 0.6) return "バランス良好";
    if (integration > 0.4) return "調整中";
    return "アンバランス";
  }
  
  generateTripleGuidance(engine, interface, safeMode) {
    return `${engine.name}、${interface.name}、${safeMode.name}の三つの卦が示すように、バランスの取れた人格発達が可能です。`;
  }
  
  assessTransformationPotential(engine, interface, safeMode) {
    // 変化の可能性評価（簡略版）
    const totalEnergy = (engine.id + interface.id + safeMode.id) / 3;
    return totalEnergy > 32 ? "高い変化の可能性" : "安定的な発展";
  }
  
  getTripleHexagramMeaning(engine, interface, safeMode) {
    return `${engine.meaning}、${interface.meaning}、${safeMode.meaning}の調和`;
  }
  
  getHexagramWisdom(id) {
    // 各卦の叡智（簡略版）
    const wisdom = {
      1: "天の創造力を活かし、積極的に行動しましょう",
      2: "地の受容力により、忍耐強く成長しましょう", 
      15: "謙虚さこそが真の強さを生み出します"
    };
    return wisdom[id] || "調和と発展を心がけましょう";
  }
  
  generateTransformationPath(hexagrams, relationships) {
    return "三つのOSの調和により、継続的な成長と発展が可能です";
  }
  
  generateIntegrationAdvice(harmonyLevel, relationships) {
    if (harmonyLevel > 0.7) {
      return "現在の高い統合レベルを維持しつつ、更なる発展を目指しましょう";
    } else {
      return "OSの間の調和を図ることで、より統合された状態に向かうことができます";
    }
  }
  
  generateDevelopmentPath(tripleOSResult, hexagrams) {
    return [
      "各OSの特性を理解し、受け入れる",
      "状況に応じて適切なOSを使い分ける",
      "三つのOSの調和を意識する"
    ];
  }
  
  generatePracticalSteps(tripleOSResult, hexagrams, relationships) {
    return [
      `Engine OS（${hexagrams.engine.name}）: 価値観を明確にし、それに基づいて行動する`,
      `Interface OS（${hexagrams.interface.name}）: 他者との関係を大切にし、適切に表現する`,
      `SafeMode OS（${hexagrams.safeMode.name}）: 適切な自己保護により、安心して成長する`
    ];
  }
  
  cacheResult(tripleOSResult, result) {
    // 結果キャッシュ（実装簡略化）
    const cacheKey = JSON.stringify(tripleOSResult).substring(0, 64);
    this.bridgeCache.set(cacheKey, {
      result: result,
      timestamp: Date.now()
    });
  }
}

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.IChing_TripleOS_Bridge = IChing_TripleOS_Bridge;
  console.log('✅ IChing_TripleOS_Bridge loaded - ancient wisdom meets modern analysis');
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IChing_TripleOS_Bridge;
}