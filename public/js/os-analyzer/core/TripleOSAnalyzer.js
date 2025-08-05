/**
 * TripleOSAnalyzer.js - bunenjin哲学に基づくTriple OS Architecture分析エンジン
 * 
 * 機能：
 * - 30問設問回答からTriple OS特性を抽出・分析
 * - Engine OS（価値観システム）/ Interface OS（社会的システム）/ SafeMode OS（防御システム）
 * - I Ching易経統合による深層心理分析
 * - bunenjin（分人）哲学による複数人格調和表現
 * 
 * バージョン: v2.0.0-triple-os-integration
 * 作成日: 2025-08-05
 */

class TripleOSAnalyzer {
  constructor(h384Database = null) {
    this.version = "2.0.0-triple-os-integration";
    this.h384Database = h384Database;
    
    // Triple OSの基本構成
    this.osDefinitions = {
      engine: {
        name: "Engine OS",
        description: "核となる価値観・重要な判断基準・本質的動機",
        keywords: ["価値観", "信念", "本質", "核心", "動機", "原動力"],
        color: "#ff6b6b", // 情熱の赤
        element: "火", // 五行説：火
        trigram: "離" // 八卦：離（火）
      },
      interface: {
        name: "Interface OS", 
        description: "他者に見せる自分・社会的表現・適応機能",
        keywords: ["社会性", "表現", "適応", "コミュニケーション", "外面", "関係"],
        color: "#4ecdc4", // 調和の青緑
        element: "木", // 五行説：木
        trigram: "巽" // 八卦：巽（風）
      },
      safeMode: {
        name: "SafeMode OS",
        description: "内なる防御機制・ストレス対処・安全確保",
        keywords: ["防御", "安全", "保護", "ストレス", "不安", "回避"],
        color: "#ffd93d", // 守護の黄
        element: "土", // 五行説：土
        trigram: "坤" // 八卦：坤（地）
      }
    };
    
    // 設問分類マッピング（30問を各OSに分類）
    this.questionMapping = this.initializeQuestionMapping();
    
    // bunenjin哲学による分析パラメータ
    this.bunenjinParameters = {
      harmony: 0, // 3つのOS間の調和度（0-1）
      integration: 0, // 統合レベル（0-1）
      flexibility: 0, // 柔軟性指数（0-1）
      authenticity: 0 // 真正性指数（0-1）
    };
    
    // 分析結果キャッシュ
    this.analysisCache = new Map();
    
    console.log("🎭 TripleOSAnalyzer v2.0 initialized with bunenjin philosophy");
  }
  
  /**
   * 30問設問の各OS分類マッピング初期化
   */
  initializeQuestionMapping() {
    return {
      // Engine OS関連設問（価値観・動機系）
      engine: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28], // 10問
      
      // Interface OS関連設問（社会性・表現系）  
      interface: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29], // 10問
      
      // SafeMode OS関連設問（防御・安全系）
      safeMode: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30] // 10問
    };
  }
  
  /**
   * メイン分析実行 - 30問回答からTriple OS分析
   * 
   * @param {Array} answers - 30問の回答データ
   * @returns {Object} Triple OS分析結果
   */
  async analyzeTripleOS(answers) {
    console.log("🔄 Starting Triple OS analysis for", answers.length, "answers");
    
    try {
      // Step 1: 基本データ検証
      const validation = this.validateAnswers(answers);
      if (!validation.isValid) {
        throw new Error(`Invalid answers data: ${validation.errors.join(', ')}`);
      }
      
      // Step 2: 各OS特性の抽出
      const engineOS = await this.extractEngineOS(answers);
      const interfaceOS = await this.extractInterfaceOS(answers);
      const safeModeOS = await this.extractSafeModeOS(answers);
      
      // Step 3: bunenjin哲学による調和度計算
      const harmony = this.calculateHarmony(engineOS, interfaceOS, safeModeOS);
      
      // Step 4: I Ching統合分析（H384_DATABASEが利用可能な場合）
      const ichingAnalysis = await this.integrateIChing(engineOS, interfaceOS, safeModeOS);
      
      // Step 5: 統合結果の生成
      const result = {
        timestamp: new Date().toISOString(),
        version: this.version,
        analysisType: "triple_os_bunenjin",
        
        // 各OS分析結果
        engine: engineOS,
        interface: interfaceOS,
        safeMode: safeModeOS,
        
        // bunenjin哲学パラメータ
        bunenjin: {
          harmony: harmony.overall,
          integration: harmony.integration,
          flexibility: harmony.flexibility,
          authenticity: harmony.authenticity,
          tension: harmony.tension
        },
        
        // I Ching統合結果
        iching: ichingAnalysis,
        
        // 実用的アドバイス
        guidance: this.generateGuidance(engineOS, interfaceOS, safeModeOS, harmony)
      };
      
      // 結果をキャッシュ
      this.cacheAnalysis(answers, result);
      
      console.log("✅ Triple OS analysis completed successfully");
      return result;
      
    } catch (error) {
      console.error("❌ Error in Triple OS analysis:", error);
      throw error;
    }
  }
  
  /**
   * Engine OS（価値観システム）特性抽出
   */
  async extractEngineOS(answers) {
    const engineQuestions = this.questionMapping.engine;
    const engineAnswers = answers.filter((answer, index) => 
      engineQuestions.includes(index + 1)
    );
    
    const scores = this.calculateOSScores(engineAnswers, "engine");
    
    return {
      name: "Engine OS",
      description: "核となる価値観・重要な判断基準",
      scores: scores,
      strength: scores.overall,
      dominantTraits: this.identifyDominantTraits(engineAnswers, "engine"),
      keywords: this.extractKeywords(engineAnswers, "engine"),
      color: this.osDefinitions.engine.color,
      element: this.osDefinitions.engine.element
    };
  }
  
  /**
   * Interface OS（社会的システム）特性抽出
   */
  async extractInterfaceOS(answers) {
    const interfaceQuestions = this.questionMapping.interface;
    const interfaceAnswers = answers.filter((answer, index) => 
      interfaceQuestions.includes(index + 1)
    );
    
    const scores = this.calculateOSScores(interfaceAnswers, "interface");
    
    return {
      name: "Interface OS",
      description: "他者に見せる自分・社会的表現",
      scores: scores,
      strength: scores.overall,
      dominantTraits: this.identifyDominantTraits(interfaceAnswers, "interface"),
      keywords: this.extractKeywords(interfaceAnswers, "interface"),
      color: this.osDefinitions.interface.color,
      element: this.osDefinitions.interface.element
    };
  }
  
  /**
   * SafeMode OS（防御システム）特性抽出
   */
  async extractSafeModeOS(answers) {
    const safeModeQuestions = this.questionMapping.safeMode;
    const safeModeAnswers = answers.filter((answer, index) => 
      safeModeQuestions.includes(index + 1)
    );
    
    const scores = this.calculateOSScores(safeModeAnswers, "safeMode");
    
    return {
      name: "SafeMode OS",
      description: "内なる防御機制・ストレス対処",
      scores: scores,
      strength: scores.overall,
      dominantTraits: this.identifyDominantTraits(safeModeAnswers, "safeMode"),
      keywords: this.extractKeywords(safeModeAnswers, "safeMode"),
      color: this.osDefinitions.safeMode.color,
      element: this.osDefinitions.safeMode.element
    };
  }
  
  /**
   * OSスコア計算
   */
  calculateOSScores(answers, osType) {
    const scores = {
      strength: 0,     // 強度
      consistency: 0,  // 一貫性
      flexibility: 0,  // 柔軟性
      integration: 0,  // 統合度
      overall: 0       // 総合スコア
    };
    
    if (!answers || answers.length === 0) {
      return scores;
    }
    
    // 回答の強度計算（選択肢の強さに基づく）
    const strengthValues = answers.map(answer => this.getAnswerStrength(answer));
    scores.strength = strengthValues.reduce((sum, val) => sum + val, 0) / strengthValues.length;
    
    // 一貫性計算（回答のばらつきから）
    const variance = this.calculateVariance(strengthValues);
    scores.consistency = Math.max(0, 1 - variance);
    
    // 柔軟性計算（異なる選択肢の使用率から）
    const uniqueChoices = new Set(answers.map(a => a.selectedValue)).size;
    scores.flexibility = Math.min(1, uniqueChoices / answers.length);
    
    // 統合度計算（OSの定義との一致度）
    scores.integration = this.calculateIntegrationScore(answers, osType);
    
    // 総合スコア
    scores.overall = (scores.strength + scores.consistency + scores.flexibility + scores.integration) / 4;
    
    return scores;
  }
  
  /**
   * 回答の強度を取得（A=1.0, B=0.75, C=0.5, D=0.25）
   */
  getAnswerStrength(answer) {
    const strengthMap = { 'A': 1.0, 'B': 0.75, 'C': 0.5, 'D': 0.25 };
    return strengthMap[answer.selectedValue] || 0.5;
  }
  
  /**
   * 分散計算
   */
  calculateVariance(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }
  
  /**
   * 統合度スコア計算
   */
  calculateIntegrationScore(answers, osType) {
    // OSタイプに応じた期待値との一致度を計算
    const expectedPattern = this.getExpectedPattern(osType);
    const actualPattern = answers.map(a => this.getAnswerStrength(a));
    
    // パターンマッチング計算
    let matchScore = 0;
    for (let i = 0; i < Math.min(expectedPattern.length, actualPattern.length); i++) {
      const diff = Math.abs(expectedPattern[i] - actualPattern[i]);
      matchScore += Math.max(0, 1 - diff);
    }
    
    return matchScore / Math.max(expectedPattern.length, actualPattern.length);
  }
  
  /**
   * OSタイプ別期待パターン取得
   */
  getExpectedPattern(osType) {
    const patterns = {
      engine: [0.8, 0.9, 0.7, 0.8, 0.75, 0.85, 0.8, 0.9, 0.7, 0.8], // 強い価値観
      interface: [0.6, 0.7, 0.8, 0.6, 0.75, 0.7, 0.6, 0.8, 0.7, 0.6], // 適応的
      safeMode: [0.5, 0.4, 0.6, 0.5, 0.45, 0.5, 0.4, 0.6, 0.5, 0.4]  // 保守的
    };
    
    return patterns[osType] || [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
  }
  
  /**
   * 支配的特性の特定
   */
  identifyDominantTraits(answers, osType) {
    const traits = [];
    const definition = this.osDefinitions[osType];
    
    // 強い回答（A, B選択）が多い特性を抽出
    const strongAnswers = answers.filter(a => ['A', 'B'].includes(a.selectedValue));
    const traitStrength = strongAnswers.length / answers.length;
    
    if (traitStrength > 0.7) {
      traits.push("強固な" + definition.description);
    } else if (traitStrength > 0.5) {
      traits.push("安定した" + definition.description);
    } else {
      traits.push("柔軟な" + definition.description);
    }
    
    return traits;
  }
  
  /**
   * キーワード抽出
   */
  extractKeywords(answers, osType) {
    const definition = this.osDefinitions[osType];
    const strength = answers.filter(a => ['A', 'B'].includes(a.selectedValue)).length / answers.length;
    
    // 強度に応じてキーワードを選択
    if (strength > 0.7) {
      return definition.keywords.slice(0, 3); // 上位3つ
    } else if (strength > 0.5) {
      return definition.keywords.slice(0, 2); // 上位2つ
    } else {
      return [definition.keywords[0]]; // 1つ
    }
  }
  
  /**
   * bunenjin哲学による調和度計算
   */
  calculateHarmony(engineOS, interfaceOS, safeModeOS) {
    // 各OSの強度差による緊張度計算
    const strengths = [engineOS.strength, interfaceOS.strength, safeModeOS.strength];
    const maxStrength = Math.max(...strengths);
    const minStrength = Math.min(...strengths);
    const tension = maxStrength - minStrength;
    
    // 調和度（緊張が少ないほど高い）
    const harmony = Math.max(0, 1 - tension);
    
    // 統合レベル（各OSの統合度の平均）
    const integration = (
      engineOS.scores.integration + 
      interfaceOS.scores.integration + 
      safeModeOS.scores.integration
    ) / 3;
    
    // 柔軟性（各OSの柔軟性の平均）
    const flexibility = (
      engineOS.scores.flexibility + 
      interfaceOS.scores.flexibility + 
      safeModeOS.scores.flexibility
    ) / 3;
    
    // 真正性（一貫性の平均）
    const authenticity = (
      engineOS.scores.consistency + 
      interfaceOS.scores.consistency + 
      safeModeOS.scores.consistency
    ) / 3;
    
    return {
      overall: harmony,
      integration: integration,
      flexibility: flexibility,
      authenticity: authenticity,
      tension: tension
    };
  }
  
  /**
   * I Ching統合分析
   */
  async integrateIChing(engineOS, interfaceOS, safeModeOS) {
    if (!this.h384Database) {
      console.warn("⚠️ H384_DATABASE not available, skipping I Ching integration");
      return this.generateFallbackIChing();
    }
    
    try {
      await this.h384Database.initialize();
      
      // 各OSから適切な卦を選択
      const engineHexagram = this.selectHexagramForOS(engineOS, "engine");
      const interfaceHexagram = this.selectHexagramForOS(interfaceOS, "interface");
      const safeModeHexagram = this.selectHexagramForOS(safeModeOS, "safeMode");
      
      // 序卦伝による関係性分析
      const relationships = this.analyzeHexagramRelationships(
        engineHexagram, interfaceHexagram, safeModeHexagram
      );
      
      return {
        enabled: true,
        hexagrams: {
          engine: engineHexagram,
          interface: interfaceHexagram,
          safeMode: safeModeHexagram
        },
        relationships: relationships,
        interpretation: this.generateIChingiInterpretation(
          engineHexagram, interfaceHexagram, safeModeHexagram, relationships
        )
      };
      
    } catch (error) {
      console.error("❌ Error in I Ching integration:", error);
      return this.generateFallbackIChing();
    }
  }
  
  /**
   * OSに適した卦の選択
   */
  selectHexagramForOS(osData, osType) {
    // OSの強度と特性に基づいて卦を選択
    const strength = osData.strength;
    
    const hexagramMappings = {
      engine: strength > 0.7 ? 1 : strength > 0.5 ? 14 : 8,  // 乾、大有、比
      interface: strength > 0.7 ? 15 : strength > 0.5 ? 31 : 57, // 謙、咸、巽
      safeMode: strength > 0.7 ? 2 : strength > 0.5 ? 7 : 39    // 坤、師、蹇
    };
    
    const hexagramId = hexagramMappings[osType] || 1;
    
    return {
      id: hexagramId,
      name: this.getHexagramName(hexagramId),
      trigrams: this.getHexagramTrigrams(hexagramId),
      meaning: this.getHexagramMeaning(hexagramId)
    };
  }
  
  /**
   * 卦名取得（簡略版）
   */
  getHexagramName(id) {
    const names = {
      1: "乾為天", 2: "坤為地", 7: "地水師", 8: "水地比",
      14: "火天大有", 15: "地山謙", 31: "沢山咸", 39: "水山蹇", 57: "巽為風"
    };
    return names[id] || "未知";
  }
  
  /**
   * 卦の構成八卦取得
   */
  getHexagramTrigrams(id) {
    const trigrams = {
      1: ["乾", "乾"], 2: ["坤", "坤"], 7: ["坤", "坎"], 8: ["坎", "坤"],
      14: ["乾", "離"], 15: ["坤", "艮"], 31: ["艮", "兌"], 39: ["坎", "艮"], 57: ["巽", "巽"]
    };
    return trigrams[id] || ["乾", "坤"];
  }
  
  /**
   * 卦の意味取得
   */
  getHexagramMeaning(id) {
    const meanings = {
      1: "創造性と積極性", 2: "受容性と忍耐", 7: "組織と統率", 8: "協調と親密",
      14: "豊かさと繁栄", 15: "謙虚と調和", 31: "感応と結合", 39: "困難と忍耐", 57: "柔軟と浸透"
    };
    return meanings[id] || "調和と発展";
  }
  
  /**
   * 卦の関係性分析
   */
  analyzeHexagramRelationships(engine, interface, safeMode) {
    return {
      engineInterface: this.calculateHexagramRelation(engine, interface),
      engineSafeMode: this.calculateHexagramRelation(engine, safeMode),
      interfaceSafeMode: this.calculateHexagramRelation(interface, safeMode),
      overall: "三つの卦が調和的な関係を示しています"
    };
  }
  
  /**
   * 二卦間の関係計算
   */
  calculateHexagramRelation(hex1, hex2) {
    // 簡略化された関係性計算
    const idDiff = Math.abs(hex1.id - hex2.id);
    
    if (idDiff <= 2) {
      return { relation: "調和", description: "二つの側面が調和しています" };
    } else if (idDiff <= 5) {
      return { relation: "補完", description: "互いに補完し合う関係です" };
    } else {
      return { relation: "緊張", description: "創造的な緊張関係にあります" };
    }
  }
  
  /**
   * I Ching解釈生成
   */
  generateIChingiInterpretation(engine, interface, safeMode, relationships) {
    return {
      overview: `あなたの人格は${engine.name}（${engine.meaning}）を核とし、${interface.name}（${interface.meaning}）で表現され、${safeMode.name}（${safeMode.meaning}）で守られています。`,
      
      guidance: [
        `Engine OS（${engine.name}）: ${engine.meaning}の力を活かしましょう`,
        `Interface OS（${interface.name}）: ${interface.meaning}を通じて他者との関係を築きましょう`,
        `SafeMode OS（${safeMode.name}）: ${safeMode.meaning}により自分を守りつつ成長しましょう`
      ],
      
      integration: relationships.overall
    };
  }
  
  /**
   * フォールバックI Ching分析
   */
  generateFallbackIChing() {
    return {
      enabled: false,
      reason: "I Ching database not available",
      message: "易経データベースが利用できないため、基本的な分析を提供します"
    };
  }
  
  /**
   * 実用的ガイダンス生成
   */
  generateGuidance(engineOS, interfaceOS, safeModeOS, harmony) {
    const guidance = [];
    
    // 調和度に基づいたアドバイス
    if (harmony.overall > 0.8) {
      guidance.push("🌟 三つのOSが非常に調和しています。この状態を維持しつつ、更なる成長を目指しましょう。");
    } else if (harmony.overall > 0.6) {
      guidance.push("⚖️ 全体的にバランスが取れています。時々見直しをして調和を保ちましょう。");
    } else {
      guidance.push("🔄 OSの間に緊張があります。各OSの声に耳を傾け、調和を図りましょう。");
    }
    
    // 各OSの強度に基づいたアドバイス
    const strongest = this.findStrongestOS(engineOS, interfaceOS, safeModeOS);
    const weakest = this.findWeakestOS(engineOS, interfaceOS, safeModeOS);
    
    guidance.push(`💪 ${strongest.name}が最も強く表れています。この力を活かしつつ、他のOSも育てていきましょう。`);
    guidance.push(`🌱 ${weakest.name}を強化することで、より統合された人格を築けるでしょう。`);
    
    return guidance;
  }
  
  /**
   * 最強OSの特定
   */
  findStrongestOS(engineOS, interfaceOS, safeModeOS) {
    const oss = [engineOS, interfaceOS, safeModeOS];
    return oss.reduce((strongest, current) => 
      current.strength > strongest.strength ? current : strongest
    );
  }
  
  /**
   * 最弱OSの特定
   */
  findWeakestOS(engineOS, interfaceOS, safeModeOS) {
    const oss = [engineOS, interfaceOS, safeModeOS];
    return oss.reduce((weakest, current) => 
      current.strength < weakest.strength ? current : weakest
    );
  }
  
  /**
   * 回答データ検証
   */
  validateAnswers(answers) {
    const errors = [];
    
    if (!Array.isArray(answers)) {
      errors.push("Answers must be an array");
      return { isValid: false, errors };
    }
    
    if (answers.length !== 30) {
      errors.push(`Expected 30 answers, got ${answers.length}`);
    }
    
    // 必須フィールドチェック
    answers.forEach((answer, index) => {
      if (!answer.questionId) {
        errors.push(`Answer ${index + 1} missing questionId`);
      }
      if (!answer.selectedValue) {
        errors.push(`Answer ${index + 1} missing selectedValue`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
  
  /**
   * 分析結果のキャッシュ
   */
  cacheAnalysis(answers, result) {
    const cacheKey = this.generateCacheKey(answers);
    this.analysisCache.set(cacheKey, {
      result: result,
      timestamp: Date.now()
    });
    
    // キャッシュサイズ制限（最大100件）
    if (this.analysisCache.size > 100) {
      const oldestKey = this.analysisCache.keys().next().value;
      this.analysisCache.delete(oldestKey);
    }
  }
  
  /**
   * キャッシュキー生成
   */
  generateCacheKey(answers) {
    const answerString = answers.map(a => 
      `${a.questionId}:${a.selectedValue}`
    ).join(',');
    
    return btoa(answerString).substring(0, 32); // Base64エンコード + 短縮
  }
  
  /**
   * 統計情報取得
   */
  getStats() {
    return {
      version: this.version,
      cacheSize: this.analysisCache.size,
      supportedQuestions: 30,
      osTypes: Object.keys(this.osDefinitions),
      ichingIntegration: !!this.h384Database
    };
  }
}

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.TripleOSAnalyzer = TripleOSAnalyzer;
  console.log('✅ TripleOSAnalyzer v2.0 loaded with bunenjin philosophy');
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TripleOSAnalyzer;
}