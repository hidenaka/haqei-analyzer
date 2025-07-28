// hexagram-dynamics-calculator.js - 八卦力学データ計算ユーティリティ
// HaQei Analyzer - Hexagram Dynamics Calculator

class HexagramDynamicsCalculator {
  constructor() {
    // 八つの基本三爻卦（八卦）の基本特性値定義
    this.trigramProperties = {
      1: { // 乾（天）
        innovation: 9, stability: 7, cooperation: 4, independence: 10, intuition: 6,
        resilience: 8, adaptability: 6, protection: 9, support_seeking: 2, introspection: 4
      },
      2: { // 兌（沢）
        innovation: 6, stability: 5, cooperation: 9, independence: 4, intuition: 8,
        resilience: 5, adaptability: 8, protection: 4, support_seeking: 8, introspection: 6
      },
      3: { // 離（火）
        innovation: 8, stability: 4, cooperation: 7, independence: 7, intuition: 9,
        resilience: 6, adaptability: 7, protection: 5, support_seeking: 6, introspection: 8
      },
      4: { // 震（雷）
        innovation: 8, stability: 3, cooperation: 5, independence: 8, intuition: 7,
        resilience: 7, adaptability: 9, protection: 6, support_seeking: 4, introspection: 5
      },
      5: { // 巽（風）
        innovation: 7, stability: 6, cooperation: 8, independence: 5, intuition: 8,
        resilience: 6, adaptability: 9, protection: 4, support_seeking: 7, introspection: 7
      },
      6: { // 坎（水）
        innovation: 6, stability: 8, cooperation: 6, independence: 6, intuition: 10,
        resilience: 9, adaptability: 6, protection: 8, support_seeking: 5, introspection: 9
      },
      7: { // 艮（山）
        innovation: 4, stability: 10, cooperation: 5, independence: 8, intuition: 6,
        resilience: 8, adaptability: 4, protection: 9, support_seeking: 3, introspection: 8
      },
      8: { // 坤（地）
        innovation: 3, stability: 9, cooperation: 10, independence: 2, intuition: 5,
        resilience: 7, adaptability: 8, protection: 6, support_seeking: 9, introspection: 6
      }
    };
  }

  // 六十四卦の力学スコアを計算 - Phase 3フォールバック統合版
  calculateHexagramDynamics(upperTrigramId, lowerTrigramId, fallbackContext = null) {
    const upper = this.trigramProperties[upperTrigramId];
    const lower = this.trigramProperties[lowerTrigramId];
    
    if (!upper || !lower) {
      console.warn(`⚠️ Invalid trigram IDs: upper=${upperTrigramId}, lower=${lowerTrigramId}`);
      
      // Phase 3: Enhanced fallback with context integration
      if (fallbackContext) {
        return this.generateContextualFallback(upperTrigramId, lowerTrigramId, fallbackContext);
      }
      
      return this.getZeroScores();
    }

    // 上卦70%、下卦30%の重み付けで計算（上卦がより影響力が強い）
    const upperWeight = 0.7;
    const lowerWeight = 0.3;

    // インターフェースOS用スコア計算
    const innovation_score = this.normalizeScore(
      upper.innovation * upperWeight + lower.innovation * lowerWeight
    );
    const stability_score = this.normalizeScore(
      upper.stability * upperWeight + lower.stability * lowerWeight
    );
    const cooperation_score = this.normalizeScore(
      upper.cooperation * upperWeight + lower.cooperation * lowerWeight
    );
    const independence_score = this.normalizeScore(
      upper.independence * upperWeight + lower.independence * lowerWeight
    );
    const intuition_score = this.normalizeScore(
      upper.intuition * upperWeight + lower.intuition * lowerWeight
    );

    // セーフモードOS用スコア計算
    const resilience_score = this.normalizeScore(
      upper.resilience * upperWeight + lower.resilience * lowerWeight
    );
    const adaptability_score = this.normalizeScore(
      upper.adaptability * upperWeight + lower.adaptability * lowerWeight
    );
    const protection_score = this.normalizeScore(
      upper.protection * upperWeight + lower.protection * lowerWeight
    );
    const support_seeking_score = this.normalizeScore(
      upper.support_seeking * upperWeight + lower.support_seeking * lowerWeight
    );
    const introspection_score = this.normalizeScore(
      upper.introspection * upperWeight + lower.introspection * lowerWeight
    );

    return {
      // インターフェースOS用
      innovation_score,
      stability_score,
      cooperation_score,
      independence_score,
      intuition_score,
      
      // セーフモードOS用
      resilience_score,
      adaptability_score,
      protection_score,
      support_seeking_score,
      introspection_score
    };
  }

  // スコアを0-10の範囲に正規化（小数点1位まで）
  normalizeScore(rawScore) {
    const normalized = Math.max(0, Math.min(10, rawScore));
    return Math.round(normalized * 10) / 10;
  }

  // ゼロスコアを返す（エラー時のフォールバック）
  getZeroScores() {
    return {
      innovation_score: 0.0,
      stability_score: 0.0,
      cooperation_score: 0.0,
      independence_score: 0.0,
      intuition_score: 0.0,
      resilience_score: 0.0,
      adaptability_score: 0.0,
      protection_score: 0.0,
      support_seeking_score: 0.0,
      introspection_score: 0.0
    };
  }

  // 全64卦の力学データを一括生成
  generateAllHexagramDynamics() {
    const allDynamics = {};
    
    // 8つの三爻卦の組み合わせで64卦を生成
    for (let upper = 1; upper <= 8; upper++) {
      for (let lower = 1; lower <= 8; lower++) {
        const hexagramId = (upper - 1) * 8 + lower;
        allDynamics[hexagramId] = this.calculateHexagramDynamics(upper, lower);
      }
    }
    
    return allDynamics;
  }

  // 特定の卦の力学データを取得
  getHexagramDynamics(hexagramId) {
    // 卦番号から上卦・下卦IDを逆算
    const upperTrigramId = Math.ceil(hexagramId / 8);
    const lowerTrigramId = ((hexagramId - 1) % 8) + 1;
    
    return this.calculateHexagramDynamics(upperTrigramId, lowerTrigramId);
  }

  // デバッグ用：計算結果を表示
  logCalculationDetails(hexagramId) {
    const upperTrigramId = Math.ceil(hexagramId / 8);
    const lowerTrigramId = ((hexagramId - 1) % 8) + 8;
    const dynamics = this.getHexagramDynamics(hexagramId);
    
    console.log(`🔬 Hexagram ${hexagramId} Dynamics:`, {
      upperTrigram: upperTrigramId,
      lowerTrigram: lowerTrigramId,
      dynamics
    });
    
    return dynamics;
  }

  // Phase 3: コンテキスト統合フォールバック生成
  generateContextualFallback(upperTrigramId, lowerTrigramId, context) {
    console.log(`🔧 [HexagramDynamics] コンテキスト統合フォールバック生成中 (${upperTrigramId}-${lowerTrigramId})`);
    
    // os_analyzer分析結果から推定
    if (context.userVector) {
      const fallbackScores = {};
      const userVector = context.userVector;
      
      // ユーザーベクトルから各次元のスコアを推定
      Object.keys(this.getZeroScores()).forEach(dimension => {
        // ユーザーベクトルに対応する次元があれば使用
        const userValue = userVector[dimension] || userVector[`dimension_${dimension}`];
        if (userValue !== undefined) {
          fallbackScores[dimension] = Math.round(userValue * 10);
        } else {
          // trigram IDから基本値を推定
          fallbackScores[dimension] = this.estimateFromTrigramId(upperTrigramId, lowerTrigramId, dimension);
        }
      });
      
      console.log(`✅ [HexagramDynamics] ユーザーベクトル統合フォールバック完了`);
      return fallbackScores;
    }
    
    // bunenjin統合フォールバック
    if (context.bunenjin_integrated) {
      return this.generateBunenjinIntegratedFallback(upperTrigramId, lowerTrigramId);
    }
    
    // 基本推定フォールバック
    return this.generateEstimatedFallback(upperTrigramId, lowerTrigramId);
  }

  // trigram IDから次元値を推定
  estimateFromTrigramId(upperTrigramId, lowerTrigramId, dimension) {
    const baseEstimates = {
      1: { innovation: 8, stability: 6, cooperation: 4, independence: 9, intuition: 6, resilience: 8, adaptability: 6, protection: 8, support_seeking: 3, introspection: 5 },
      2: { innovation: 6, stability: 5, cooperation: 9, independence: 4, intuition: 8, resilience: 5, adaptability: 8, protection: 4, support_seeking: 8, introspection: 6 },
      3: { innovation: 8, stability: 4, cooperation: 7, independence: 7, intuition: 9, resilience: 6, adaptability: 7, protection: 5, support_seeking: 6, introspection: 8 },
      4: { innovation: 8, stability: 3, cooperation: 5, independence: 8, intuition: 7, resilience: 7, adaptability: 9, protection: 6, support_seeking: 4, introspection: 5 },
      5: { innovation: 7, stability: 6, cooperation: 8, independence: 5, intuition: 8, resilience: 6, adaptability: 9, protection: 4, support_seeking: 7, introspection: 7 },
      6: { innovation: 6, stability: 8, cooperation: 6, independence: 6, intuition: 10, resilience: 9, adaptability: 6, protection: 8, support_seeking: 5, introspection: 9 },
      7: { innovation: 4, stability: 10, cooperation: 5, independence: 8, intuition: 6, resilience: 8, adaptability: 4, protection: 9, support_seeking: 3, introspection: 8 },
      8: { innovation: 3, stability: 9, cooperation: 10, independence: 2, intuition: 5, resilience: 7, adaptability: 8, protection: 6, support_seeking: 9, introspection: 6 }
    };
    
    const upperEst = baseEstimates[upperTrigramId] || {};
    const lowerEst = baseEstimates[lowerTrigramId] || {};
    
    return Math.round((upperEst[dimension] || 5) * 0.7 + (lowerEst[dimension] || 5) * 0.3);
  }

  // bunenjin統合フォールバック
  generateBunenjinIntegratedFallback(upperTrigramId, lowerTrigramId) {
    console.log(`🔧 [HexagramDynamics] bunenjin統合フォールバック生成中`);
    
    // bunenjin哲学に基づく調整値
    const bunenjinAdjustment = {
      innovation: 0.2, // 分人思想は革新的
      adaptability: 0.3, // 状況適応が核心
      cooperation: 0.15, // 複数の自己との協調
      introspection: 0.25 // 自己観察が重要
    };
    
    const baseScores = this.generateEstimatedFallback(upperTrigramId, lowerTrigramId);
    
    // bunenjin調整を適用
    Object.keys(bunenjinAdjustment).forEach(dimension => {
      if (baseScores[dimension] !== undefined) {
        const adjustment = bunenjinAdjustment[dimension];
        baseScores[dimension] = Math.min(10, Math.round(baseScores[dimension] * (1 + adjustment)));
      }
    });
    
    return baseScores;
  }

  // 基本推定フォールバック
  generateEstimatedFallback(upperTrigramId, lowerTrigramId) {
    const fallbackScores = {};
    const dimensions = Object.keys(this.getZeroScores());
    
    dimensions.forEach(dimension => {
      fallbackScores[dimension] = this.estimateFromTrigramId(upperTrigramId, lowerTrigramId, dimension);
    });
    
    return fallbackScores;
  }

  // ゼロスコアの取得（エラー時のフォールバック）
  getZeroScores() {
    return {
      innovation: 0,
      stability: 0,
      cooperation: 0,
      independence: 0,
      intuition: 0,
      resilience: 0,
      adaptability: 0,
      protection: 0,
      support_seeking: 0,
      introspection: 0
    };
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== 'undefined') {
  window.HexagramDynamicsCalculator = HexagramDynamicsCalculator;
}

// Node.js環境での利用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HexagramDynamicsCalculator;
}