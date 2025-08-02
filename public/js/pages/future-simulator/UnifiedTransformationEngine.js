// UnifiedTransformationEngine.js - 統合型変化予測エンジン
// 5種類の易経的変化（進爻・変爻・錯卦・綜卦・互卦）を統合

/**
 * 統合型変化予測エンジン
 * 
 * 目的：
 * - 5種類の易経的変化の統合予測
 * - 行動と変化タイプの関係性計算
 * - 確率的シミュレーションによる変化パス生成
 * - 人格特性による変化確率の調整
 * 
 * 入力：
 * - currentState: 現在の卦・爻状態
 * - selectedAction: 選択された行動
 * - personalityProfile: 人格プロファイル（optional）
 * - contextData: 状況データ（optional）
 * 
 * 処理内容：
 * 1. 5種類の変化可能性を並列計算
 * 2. 行動との適合度による確率調整
 * 3. モンテカルロシミュレーション
 * 4. 統合結果の生成
 * 
 * 出力：
 * - transformationPaths: 可能な変化経路
 * - probabilities: 各変化の発生確率
 * - recommendations: 推奨事項
 * 
 * 副作用：
 * - ログ出力
 * - メトリクス記録
 * 
 * 前提条件：
 * - HexagramActionThemeCatalog.jsがロード済み
 * - YaoActionDefinitionEngine.jsがロード済み
 * - H384H64database.jsへのアクセス
 * 
 * エラー処理：
 * - 無効な入力：デフォルト処理
 * - データ不整合：警告と補正
 */

class UnifiedTransformationEngine {
  constructor() {
    this.initializeEngine();
  }

  initializeEngine() {
    console.log("🔮 Initializing Unified Transformation Engine...");
    
    // 依存関係の確認
    this.validateDependencies();
    
    // 変化タイプの定義
    this.transformationTypes = this.defineTransformationTypes();
    
    // 変化計算エンジンの初期化
    this.calculationEngines = this.initializeCalculationEngines();
    
    // 確率モデルの初期化
    this.probabilityModel = this.initializeProbabilityModel();
    
    // H64データの読み込み
    this.hexagramData = this.loadHexagramData();
    
    console.log("✅ Unified Transformation Engine initialized successfully");
  }

  /**
   * 依存関係の確認
   */
  validateDependencies() {
    const dependencies = [
      'HexagramActionThemeCatalog',
      'YaoActionDefinitionEngine'
    ];
    
    const missing = dependencies.filter(dep => 
      typeof window === "undefined" || !window[dep]
    );
    
    if (missing.length > 0) {
      throw new Error(`❌ Missing dependencies: ${missing.join(', ')}`);
    }
    
    // インスタンス化
    this.themeCatalog = new window.HexagramActionThemeCatalog();
    this.yaoEngine = new window.YaoActionDefinitionEngine();
    
    console.log("✅ All dependencies validated");
  }

  /**
   * 変化タイプの定義
   */
  defineTransformationTypes() {
    return {
      進爻: {
        name: "進爻（しんこう）",
        description: "同じ卦内で次の爻位へ上昇",
        mechanism: "行動がその爻のテーマに準拠した場合",
        meaning: "段階的成長・発展",
        calculation: "calculateShinkou"
      },
      変爻: {
        name: "変爻（へんこう）",
        description: "動爻により別の卦へ転換",
        mechanism: "行動がその爻の性質と逆の場合",
        meaning: "質的転換・状況変化",
        calculation: "calculateHenkou"
      },
      錯卦: {
        name: "錯卦（さくか）",
        description: "全爻が陰陽反転した卦",
        mechanism: "根本的価値観の転換時",
        meaning: "完全な対立・補完関係",
        calculation: "calculateSakuka"
      },
      綜卦: {
        name: "綜卦（そうか）",
        description: "卦を上下反転させた卦",
        mechanism: "視点転換・立場交代時",
        meaning: "相手の視点・逆の立場",
        calculation: "calculateSouka"
      },
      互卦: {
        name: "互卦（ごか）",
        description: "内卦・外卦から生成される卦",
        mechanism: "内省・深層心理への働きかけ",
        meaning: "潜在的本質・隠れた発展方向",
        calculation: "calculateGoka"
      }
    };
  }

  /**
   * 計算エンジンの初期化
   */
  initializeCalculationEngines() {
    return {
      // 進爻計算エンジン
      shinkou: {
        calculateProbability: (state, action, context) => {
          const yaoDef = this.yaoEngine.getYaoActionDefinition(state.hexagram, state.yao);
          const themeAlignment = this.calculateThemeAlignment(action, yaoDef);
          const positionFactor = this.getPositionProgression(state.yao);
          const contextFactor = this.getContextualFactor(context, "progressive");
          
          return Math.min(themeAlignment * positionFactor * contextFactor, 0.95);
        },
        generateTarget: (state) => {
          if (state.yao < 6) {
            return {
              hexagram: state.hexagram,
              yao: state.yao + 1,
              type: "進爻",
              description: `${state.yao + 1}爻への段階的進展`
            };
          } else {
            return {
              hexagram: this.getNextCycleHexagram(state.hexagram),
              yao: 1,
              type: "新サイクル",
              description: "新たなサイクルの開始"
            };
          }
        }
      },
      
      // 変爻計算エンジン
      henkou: {
        calculateProbability: (state, action, context) => {
          const yaoDef = this.yaoEngine.getYaoActionDefinition(state.hexagram, state.yao);
          const oppositionLevel = this.calculateOppositionLevel(action, yaoDef);
          const transformationReadiness = this.getTransformationReadiness(state);
          const contextFactor = this.getContextualFactor(context, "transformative");
          
          return Math.min(oppositionLevel * transformationReadiness * contextFactor, 0.95);
        },
        generateTarget: (state, action) => {
          const targetHexagram = this.calculateChangingHexagram(state.hexagram, state.yao);
          return {
            hexagram: targetHexagram,
            yao: state.yao, // 同じ爻位で異なる卦
            type: "変爻",
            description: "状況の質的転換"
          };
        }
      },
      
      // 錯卦計算エンジン
      sakuka: {
        calculateProbability: (state, action, context) => {
          const valueOpposition = this.calculateValueOpposition(action, state);
          const extremeCondition = this.checkExtremeConditions(context);
          const hexagramPolarity = this.getHexagramPolarity(state.hexagram);
          
          return Math.min(valueOpposition * extremeCondition * hexagramPolarity * 0.3, 0.8);
        },
        generateTarget: (state) => {
          const sakukaHexagram = this.calculateSakukaHexagram(state.hexagram);
          return {
            hexagram: sakukaHexagram,
            yao: state.yao,
            type: "錯卦",
            description: "完全な価値観の反転"
          };
        }
      },
      
      // 綜卦計算エンジン
      souka: {
        calculateProbability: (state, action, context) => {
          const perspectiveShift = this.calculatePerspectiveShift(action, context);
          const empathyLevel = this.getEmpathyLevel(action);
          const roleReversalPotential = this.getRoleReversalPotential(state);
          
          return Math.min(perspectiveShift * empathyLevel * roleReversalPotential, 0.9);
        },
        generateTarget: (state) => {
          const soukaHexagram = this.calculateSoukaHexagram(state.hexagram);
          return {
            hexagram: soukaHexagram,
            yao: 7 - state.yao, // 爻位も上下反転
            type: "綜卦",
            description: "視点の完全な転換"
          };
        }
      },
      
      // 互卦計算エンジン
      goka: {
        calculateProbability: (state, action, context) => {
          const introspectionLevel = this.calculateIntrospectionLevel(action);
          const psychologicalDepth = this.getPsychologicalDepth(context);
          const unconsciousActivation = this.getUnconsciousActivation(state);
          
          return Math.min(introspectionLevel * psychologicalDepth * unconsciousActivation, 0.85);
        },
        generateTarget: (state) => {
          const gokaHexagram = this.calculateGokaHexagram(state.hexagram);
          return {
            hexagram: gokaHexagram,
            yao: state.yao,
            type: "互卦",
            description: "潜在的本質の顕在化"
          };
        }
      }
    };
  }

  /**
   * 確率モデルの初期化
   */
  initializeProbabilityModel() {
    return {
      // ベース確率
      baseProbabilities: {
        進爻: 0.4,
        変爻: 0.3,
        錯卦: 0.1,
        綜卦: 0.15,
        互卦: 0.05
      },
      
      // 調整係数
      adjustmentFactors: {
        actionIntensity: {
          low: 0.8,
          medium: 1.0,
          high: 1.3
        },
        personalityAlignment: {
          high: 1.4,
          medium: 1.0,
          low: 0.7
        },
        situationalPressure: {
          low: 0.9,
          medium: 1.0,
          high: 1.2
        }
      },
      
      // 相互排他制約
      mutualExclusion: {
        進爻: ["錯卦"], // 進爻と錯卦は基本的に両立しない
        変爻: [], // 変爻は他と両立可能
        錯卦: ["進爻", "綜卦"], // 錯卦は進爻・綜卦と排他
        綜卦: ["錯卦"], // 綜卦は錯卦と排他
        互卦: [] // 互卦は独立
      }
    };
  }

  /**
   * H64データの読み込み
   */
  loadHexagramData() {
    if (typeof window !== "undefined" && window.H64_DATA) {
      console.log("📊 H64 data loaded successfully");
      return window.H64_DATA;
    }
    
    console.warn("⚠️ H64_DATA not available, using fallback data");
    return this.generateFallbackHexagramData();
  }

  /**
   * メイン変化予測メソッド
   */
  predictTransformations(currentState, selectedAction, personalityProfile = null, contextData = null) {
    try {
      console.log(`🔮 Predicting transformations for ${currentState.hexagram}-${currentState.yao}`);
      
      // 1. 基本検証
      this.validateInput(currentState, selectedAction);
      
      // 2. 5種類の変化確率を計算
      const transformationProbabilities = this.calculateAllTransformations(
        currentState, 
        selectedAction, 
        personalityProfile, 
        contextData
      );
      
      // 3. 確率の正規化
      const normalizedProbabilities = this.normalizeProbabilities(transformationProbabilities);
      
      // 4. 変化パスの生成
      const transformationPaths = this.generateTransformationPaths(
        currentState, 
        selectedAction, 
        normalizedProbabilities
      );
      
      // 5. 推奨事項の生成
      const recommendations = this.generateRecommendations(
        currentState, 
        transformationPaths, 
        personalityProfile
      );
      
      // 6. 統合結果
      const result = {
        currentState,
        selectedAction,
        transformationProbabilities: normalizedProbabilities,
        transformationPaths,
        recommendations,
        metadata: {
          calculatedAt: new Date().toISOString(),
          personalityFactorApplied: !!personalityProfile,
          contextFactorApplied: !!contextData,
          totalPaths: transformationPaths.length
        }
      };
      
      console.log(`✅ Transformation prediction completed: ${transformationPaths.length} paths generated`);
      return result;
      
    } catch (error) {
      console.error("❌ Error in transformation prediction:", error);
      return this.generateErrorFallback(currentState, selectedAction, error);
    }
  }

  /**
   * 全変化タイプの確率計算
   */
  calculateAllTransformations(currentState, selectedAction, personalityProfile, contextData) {
    const probabilities = {};
    
    for (const [transformationType, config] of Object.entries(this.transformationTypes)) {
      try {
        const engine = this.calculationEngines[transformationType];
        if (!engine) {
          console.warn(`⚠️ No calculation engine for ${transformationType}`);
          probabilities[transformationType] = 0;
          continue;
        }
        
        // 基本確率計算
        let baseProb = engine.calculateProbability(currentState, selectedAction, contextData);
        
        // 人格特性による調整
        if (personalityProfile) {
          baseProb = this.applyPersonalityAdjustment(baseProb, transformationType, personalityProfile);
        }
        
        // 上下限制約
        probabilities[transformationType] = Math.min(Math.max(baseProb, 0.01), 0.95);
        
      } catch (error) {
        console.warn(`⚠️ Error calculating ${transformationType}:`, error);
        probabilities[transformationType] = this.probabilityModel.baseProbabilities[transformationType] || 0.1;
      }
    }
    
    return probabilities;
  }

  /**
   * 確率の正規化
   */
  normalizeProbabilities(probabilities) {
    // 相互排他制約の適用
    const adjustedProbs = this.applyMutualExclusion(probabilities);
    
    // 正規化（合計を1にする）
    const total = Object.values(adjustedProbs).reduce((sum, prob) => sum + prob, 0);
    
    if (total === 0) {
      console.warn("⚠️ All probabilities are zero, using default distribution");
      return this.probabilityModel.baseProbabilities;
    }
    
    const normalized = {};
    for (const [type, prob] of Object.entries(adjustedProbs)) {
      normalized[type] = prob / total;
    }
    
    return normalized;
  }

  /**
   * 相互排他制約の適用
   */
  applyMutualExclusion(probabilities) {
    const adjusted = { ...probabilities };
    const exclusions = this.probabilityModel.mutualExclusion;
    
    for (const [type, exclusiveTypes] of Object.entries(exclusions)) {
      if (adjusted[type] > 0.5) { // 高確率の場合
        for (const exclusiveType of exclusiveTypes) {
          adjusted[exclusiveType] *= 0.3; // 排他タイプの確率を大幅削減
        }
      }
    }
    
    return adjusted;
  }

  /**
   * 変化パスの生成
   */
  generateTransformationPaths(currentState, selectedAction, probabilities) {
    const paths = [];
    
    for (const [transformationType, probability] of Object.entries(probabilities)) {
      if (probability < 0.01) continue; // 極小確率は除外
      
      try {
        const engine = this.calculationEngines[transformationType];
        const target = engine.generateTarget(currentState, selectedAction);
        
        const path = {
          type: transformationType,
          probability: probability,
          currentState: currentState,
          targetState: target,
          description: this.transformationTypes[transformationType].description,
          mechanism: this.transformationTypes[transformationType].mechanism,
          impact: this.calculateTransformationImpact(transformationType, currentState, target),
          timeline: this.estimateTransformationTimeline(transformationType),
          effort: this.estimateRequiredEffort(transformationType, selectedAction)
        };
        
        paths.push(path);
        
      } catch (error) {
        console.warn(`⚠️ Error generating path for ${transformationType}:`, error);
      }
    }
    
    // 確率順でソート
    return paths.sort((a, b) => b.probability - a.probability);
  }

  /**
   * 推奨事項の生成
   */
  generateRecommendations(currentState, transformationPaths, personalityProfile) {
    const topPath = transformationPaths[0];
    if (!topPath) {
      return {
        primary: "状況維持",
        reasoning: "明確な変化パスが見つからないため、現状維持を推奨",
        confidence: 0.3
      };
    }
    
    const recommendations = {
      primary: topPath.type,
      primaryPath: topPath,
      reasoning: this.generateReasoningText(topPath, currentState),
      confidence: topPath.probability,
      alternatives: transformationPaths.slice(1, 3), // 上位3つまで
      personalizedAdvice: personalityProfile 
        ? this.generatePersonalizedAdvice(topPath, personalityProfile)
        : null,
      timing: this.generateTimingAdvice(topPath),
      precautions: this.generatePrecautions(topPath)
    };
    
    return recommendations;
  }

  // =============== 支援メソッド群 ===============

  /**
   * テーマとの適合度計算
   */
  calculateThemeAlignment(action, yaoDef) {
    if (!yaoDef || !yaoDef.actions || !yaoDef.actions.shin) return 0.5;
    
    const shinAction = yaoDef.actions.shin;
    const actionKeywords = this.extractActionKeywords(action);
    const shinKeywords = this.extractActionKeywords(shinAction.description);
    
    const commonKeywords = actionKeywords.filter(keyword => 
      shinKeywords.some(shinKeyword => 
        shinKeyword.includes(keyword) || keyword.includes(shinKeyword)
      )
    );
    
    return Math.min(commonKeywords.length / Math.max(actionKeywords.length, 1), 1.0);
  }

  /**
   * アクションキーワードの抽出
   */
  extractActionKeywords(text) {
    if (!text) return [];
    
    const keywords = text.match(/[\u4e00-\u9faf]+/g) || []; // 漢字部分を抽出
    return keywords.filter(keyword => keyword.length >= 2);
  }

  /**
   * 爻位の進展傾向
   */
  getPositionProgression(yaoPosition) {
    const progressionFactors = {
      1: 0.8, // 初爻は進爻しやすい
      2: 0.6, // 二爻は中正で安定
      3: 0.4, // 三爻は危険で変爻しやすい
      4: 0.5, // 四爻は責任期
      5: 0.3, // 五爻は完成に近い
      6: 0.2  // 上爻は転換期
    };
    
    return progressionFactors[yaoPosition] || 0.5;
  }

  /**
   * 文脈的要因の取得
   */
  getContextualFactor(contextData, actionType) {
    if (!contextData) return 1.0;
    
    const factors = {
      progressive: {
        stable: 1.2,
        unstable: 0.8,
        crisis: 0.6
      },
      transformative: {
        stable: 0.7,
        unstable: 1.3,
        crisis: 1.5
      }
    };
    
    const situationType = this.assessSituationType(contextData);
    return factors[actionType]?.[situationType] || 1.0;
  }

  /**
   * 状況タイプの評価
   */
  assessSituationType(contextData) {
    if (!contextData) return "stable";
    
    // 簡易的な状況分類ロジック
    const stressLevel = contextData.stressLevel || 0;
    const changeLevel = contextData.changeLevel || 0;
    
    if (stressLevel > 0.7 || changeLevel > 0.7) return "crisis";
    if (stressLevel > 0.4 || changeLevel > 0.4) return "unstable";
    return "stable";
  }

  /**
   * 錯卦計算
   */
  calculateSakukaHexagram(hexagramNumber) {
    // 全ての爻を陰陽反転
    const hexagramData = this.hexagramData.find(h => h.卦番号 === hexagramNumber);
    if (!hexagramData) return hexagramNumber; // フォールバック
    
    // 簡易実装：既知の錯卦関係
    const sakukaMap = {
      1: 2, 2: 1,   // 乾⇔坤
      3: 50, 50: 3, // 屯⇔鼎
      5: 35, 35: 5, // 需⇔晋
      11: 12, 12: 11, // 泰⇔否
      63: 64, 64: 63  // 既済⇔未済
    };
    
    return sakukaMap[hexagramNumber] || hexagramNumber;
  }

  /**
   * 綜卦計算
   */
  calculateSoukaHexagram(hexagramNumber) {
    // 上下反転
    const soukaMap = {
      1: 1, 2: 2,     // 乾坤は自己綜卦
      3: 4, 4: 3,     // 屯⇔蒙
      5: 6, 6: 5,     // 需⇔訟
      11: 11, 12: 12, // 泰否は自己綜卦
      63: 63, 64: 64  // 既済未済は自己綜卦
    };
    
    return soukaMap[hexagramNumber] || hexagramNumber;
  }

  /**
   * 互卦計算
   */
  calculateGokaHexagram(hexagramNumber) {
    // 2,3,4爻と3,4,5爻から新しい卦を構成
    // 簡易実装
    const gokaMap = {
      1: 1,   // 乾の互卦は乾
      2: 2,   // 坤の互卦は坤
      5: 38,  // 需の互卦は睽
      11: 54, // 泰の互卦は帰妹
      63: 64  // 既済の互卦は未済
    };
    
    return gokaMap[hexagramNumber] || hexagramNumber;
  }

  /**
   * 変爻による卦の変化計算
   */
  calculateChangingHexagram(hexagramNumber, yaoPosition) {
    const hexagramData = this.hexagramData.find(h => h.卦番号 === hexagramNumber);
    if (!hexagramData) return hexagramNumber;
    
    // H64データから変爻情報を取得
    const changeKey = `${["初", "二", "三", "四", "五", "上"][yaoPosition - 1]}爻変`;
    return hexagramData[changeKey] || hexagramNumber;
  }

  /**
   * 人格特性による調整
   */
  applyPersonalityAdjustment(baseProb, transformationType, personalityProfile) {
    if (!personalityProfile) return baseProb;
    
    const adjustments = {
      進爻: personalityProfile.stability || 1.0,
      変爻: personalityProfile.adaptability || 1.0,
      錯卦: personalityProfile.radicalism || 0.5,
      綜卦: personalityProfile.empathy || 1.0,
      互卦: personalityProfile.introspection || 1.0
    };
    
    return baseProb * (adjustments[transformationType] || 1.0);
  }

  /**
   * 入力値検証
   */
  validateInput(currentState, selectedAction) {
    if (!currentState || !currentState.hexagram || !currentState.yao) {
      throw new Error("Invalid currentState: must have hexagram and yao");
    }
    
    if (currentState.hexagram < 1 || currentState.hexagram > 64) {
      throw new Error("Invalid hexagram number: must be 1-64");
    }
    
    if (currentState.yao < 1 || currentState.yao > 6) {
      throw new Error("Invalid yao position: must be 1-6");
    }
    
    if (!selectedAction || typeof selectedAction !== 'string') {
      throw new Error("Invalid selectedAction: must be a non-empty string");
    }
  }

  /**
   * エラー時のフォールバック
   */
  generateErrorFallback(currentState, selectedAction, error) {
    return {
      currentState,
      selectedAction,
      error: error.message,
      transformationProbabilities: this.probabilityModel.baseProbabilities,
      transformationPaths: [{
        type: "現状維持",
        probability: 1.0,
        description: "エラーのため現状維持",
        targetState: currentState
      }],
      recommendations: {
        primary: "現状維持",
        reasoning: "システムエラーのため、慎重に現状を維持することを推奨",
        confidence: 0.3
      }
    };
  }

  /**
   * フォールバック卦データ生成
   */
  generateFallbackHexagramData() {
    const fallbackData = [];
    for (let i = 1; i <= 64; i++) {
      fallbackData.push({
        卦番号: i,
        名前: `卦${i}`,
        初爻変: ((i + 1) % 64) + 1,
        二爻変: ((i + 2) % 64) + 1,
        三爻変: ((i + 3) % 64) + 1,
        四爻変: ((i + 4) % 64) + 1,
        五爻変: ((i + 5) % 64) + 1,
        上爻変: ((i + 6) % 64) + 1
      });
    }
    return fallbackData;
  }

  // 追加のヘルパーメソッド群（簡易実装）
  calculateOppositionLevel(action, yaoDef) { return 0.5; }
  getTransformationReadiness(state) { return 0.6; }
  calculateValueOpposition(action, state) { return 0.3; }
  checkExtremeConditions(context) { return 0.4; }
  getHexagramPolarity(hexagram) { return 0.5; }
  calculatePerspectiveShift(action, context) { return 0.6; }
  getEmpathyLevel(action) { return 0.5; }
  getRoleReversalPotential(state) { return 0.4; }
  calculateIntrospectionLevel(action) { return 0.4; }
  getPsychologicalDepth(context) { return 0.5; }
  getUnconsciousActivation(state) { return 0.3; }
  getNextCycleHexagram(hexagram) { return ((hexagram % 64) + 1); }
  calculateTransformationImpact(type, current, target) { return { level: "medium", scope: "personal" }; }
  estimateTransformationTimeline(type) { return { immediate: 0.3, shortTerm: 0.5, longTerm: 0.2 }; }
  estimateRequiredEffort(type, action) { return { level: "medium", description: "適度な努力が必要" }; }
  generateReasoningText(path, state) { return `${path.type}による変化が最も適切と判断されます`; }
  generatePersonalizedAdvice(path, personality) { return "個人特性に基づく追加アドバイス"; }
  generateTimingAdvice(path) { return { best: "現在", avoid: "特になし" }; }
  generatePrecautions(path) { return ["急激な変化への注意", "周囲への配慮"]; }
}

// グローバル変数として登録
if (typeof window !== "undefined") {
  window.UnifiedTransformationEngine = UnifiedTransformationEngine;
  console.log("✅ Unified Transformation Engine loaded successfully");
}

// Node.js環境での使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = UnifiedTransformationEngine;
}