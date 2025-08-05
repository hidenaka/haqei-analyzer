// PersonalityActionHarmonizer.js - 人格特性と行動の調和エンジン
// Triple OSと行動選択の最適化

/**
 * 人格特性と行動の調和エンジン
 * 
 * 目的：
 * - Triple OS（価値観・社会的・防御）と行動の適合性分析
 * - 人格特性に基づく行動推奨の最適化
 * - 内的葛藤の検出と解決策の提示
 * 
 * 入力：
 * - personalityProfile: Triple OSスコアと詳細特性
 * - proposedAction: 検討中の行動
 * - contextualFactors: 状況要因
 * 
 * 処理内容：
 * 1. 人格特性の深層分析
 * 2. 行動との適合度計算
 * 3. 内的葛藤の検出
 * 4. 調和的行動の生成
 * 
 * 出力：
 * - harmonyScore: 調和度スコア
 * - conflicts: 検出された葛藤
 * - recommendations: 調和的行動提案
 * 
 * 副作用：
 * - ログ出力
 * - メトリクス記録
 * 
 * 前提条件：
 * - UnifiedTransformationEngineがロード済み
 * - YaoActionDefinitionEngineがロード済み
 * 
 * エラー処理：
 * - 無効な入力：デフォルト処理
 * - 計算エラー：フォールバック値
 */

class PersonalityActionHarmonizer {
  constructor() {
    this.initializeHarmonizer();
  }

  initializeHarmonizer() {
    console.log("🎭 Initializing Personality-Action Harmonizer...");
    
    // 依存関係の確認
    this.validateDependencies();
    
    // Triple OS特性の定義
    this.tripleOSCharacteristics = this.defineTripleOSCharacteristics();
    
    // 行動タイプの分類
    this.actionTypology = this.defineActionTypology();
    
    // 葛藤パターンの定義
    this.conflictPatterns = this.defineConflictPatterns();
    
    // 調和メトリクスの初期化
    this.harmonyMetrics = this.initializeHarmonyMetrics();
    
    console.log("✅ Personality-Action Harmonizer initialized successfully");
  }

  /**
   * 依存関係の確認
   */
  validateDependencies() {
    const dependencies = ['UnifiedTransformationEngine', 'YaoActionDefinitionEngine'];
    const missing = dependencies.filter(dep => 
      typeof window === "undefined" || !window[dep]
    );
    
    if (missing.length > 0) {
      console.warn(`⚠️ Missing dependencies: ${missing.join(', ')}`);
      console.log("Running in standalone mode");
    } else {
      this.transformationEngine = new window.UnifiedTransformationEngine();
      this.yaoEngine = new window.YaoActionDefinitionEngine();
    }
  }

  /**
   * Triple OS特性の定義
   */
  defineTripleOSCharacteristics() {
    return {
      engineOS: {
        name: "価値観OS（Engine OS）",
        core: "内的価値観と理想",
        strengths: [
          "明確な価値基準",
          "強い動機付け",
          "創造的思考",
          "独立的判断"
        ],
        weaknesses: [
          "社会的調和の軽視",
          "理想主義的傾向",
          "柔軟性の欠如",
          "孤立リスク"
        ],
        actionPreferences: {
          autonomous: 0.9,    // 自律的行動
          creative: 0.8,      // 創造的行動
          principled: 0.9,    // 原則的行動
          collaborative: 0.4, // 協調的行動
          conventional: 0.3,  // 慣習的行動
          defensive: 0.2      // 防御的行動
        },
        conflictTriggers: [
          "価値観の妥協要求",
          "外部からの統制",
          "意味の喪失",
          "創造性の制限"
        ]
      },
      
      interfaceOS: {
        name: "社会的OS（Interface OS）",
        core: "社会的調和と関係性",
        strengths: [
          "高い適応力",
          "人間関係構築",
          "協調性",
          "共感能力"
        ],
        weaknesses: [
          "自己主張の弱さ",
          "他者依存傾向",
          "一貫性の欠如",
          "本質の見失い"
        ],
        actionPreferences: {
          collaborative: 0.9,  // 協調的行動
          diplomatic: 0.8,     // 外交的行動
          adaptive: 0.9,       // 適応的行動
          conventional: 0.7,   // 慣習的行動
          autonomous: 0.3,     // 自律的行動
          confrontational: 0.2 // 対立的行動
        },
        conflictTriggers: [
          "社会的孤立",
          "関係性の破綻",
          "評価の低下",
          "調和の崩壊"
        ]
      },
      
      safeModeOS: {
        name: "防御OS（Safe Mode OS）",
        core: "安全確保と自己保護",
        strengths: [
          "リスク認識",
          "慎重な判断",
          "安定性維持",
          "防御力"
        ],
        weaknesses: [
          "過度な保守性",
          "成長の抑制",
          "機会の喪失",
          "恐怖支配"
        ],
        actionPreferences: {
          defensive: 0.9,      // 防御的行動
          cautious: 0.9,       // 慎重な行動
          conservative: 0.8,   // 保守的行動
          risk_averse: 0.9,    // リスク回避
          innovative: 0.2,     // 革新的行動
          aggressive: 0.1      // 攻撃的行動
        },
        conflictTriggers: [
          "安全の脅威",
          "予測不能な変化",
          "統制の喪失",
          "未知への曝露"
        ]
      }
    };
  }

  /**
   * 行動タイプの分類
   */
  defineActionTypology() {
    return {
      // 主要行動カテゴリー
      categories: {
        progressive: {
          name: "前進的行動",
          description: "成長と発展を目指す行動",
          subTypes: ["learning", "exploring", "creating", "expanding"],
          osAlignment: {
            engineOS: 0.8,
            interfaceOS: 0.5,
            safeModeOS: 0.2
          }
        },
        
        transformative: {
          name: "変革的行動",
          description: "現状を大きく変える行動",
          subTypes: ["disrupting", "innovating", "revolutionizing", "breaking"],
          osAlignment: {
            engineOS: 0.9,
            interfaceOS: 0.3,
            safeModeOS: 0.1
          }
        },
        
        collaborative: {
          name: "協調的行動",
          description: "他者との調和を重視する行動",
          subTypes: ["cooperating", "supporting", "mediating", "harmonizing"],
          osAlignment: {
            engineOS: 0.4,
            interfaceOS: 0.9,
            safeModeOS: 0.5
          }
        },
        
        defensive: {
          name: "防御的行動",
          description: "リスクを避け安全を確保する行動",
          subTypes: ["protecting", "avoiding", "conserving", "stabilizing"],
          osAlignment: {
            engineOS: 0.2,
            interfaceOS: 0.5,
            safeModeOS: 0.9
          }
        },
        
        adaptive: {
          name: "適応的行動",
          description: "状況に応じて柔軟に対応する行動",
          subTypes: ["adjusting", "accommodating", "flexing", "responding"],
          osAlignment: {
            engineOS: 0.5,
            interfaceOS: 0.8,
            safeModeOS: 0.6
          }
        },
        
        assertive: {
          name: "主張的行動",
          description: "自己の意志を明確に表現する行動",
          subTypes: ["leading", "deciding", "declaring", "commanding"],
          osAlignment: {
            engineOS: 0.8,
            interfaceOS: 0.4,
            safeModeOS: 0.3
          }
        }
      },
      
      // 行動の強度レベル
      intensityLevels: {
        passive: 0.2,
        moderate: 0.5,
        active: 0.8,
        extreme: 1.0
      }
    };
  }

  /**
   * 葛藤パターンの定義
   */
  defineConflictPatterns() {
    return {
      // OS間の典型的葛藤
      interOSConflicts: {
        engineVsInterface: {
          name: "価値観 vs 社会的調和",
          description: "個人の価値観と社会的期待の対立",
          symptoms: [
            "自己表現の抑圧",
            "社会的疎外感",
            "アイデンティティの混乱",
            "ストレスの蓄積"
          ],
          resolution: {
            strategy: "統合的アプローチ",
            actions: [
              "価値観を社会的文脈で表現",
              "同じ価値観を持つコミュニティ探し",
              "段階的な自己開示",
              "創造的な妥協点の発見"
            ]
          }
        },
        
        engineVsSafeMode: {
          name: "理想 vs 安全",
          description: "成長欲求と安全欲求の対立",
          symptoms: [
            "行動の躊躇",
            "機会損失への後悔",
            "内的緊張",
            "決断の遅延"
          ],
          resolution: {
            strategy: "リスク管理型アプローチ",
            actions: [
              "段階的なリスクテイク",
              "安全網の構築",
              "小さな実験から開始",
              "成功体験の蓄積"
            ]
          }
        },
        
        interfaceVsSafeMode: {
          name: "社交 vs 防御",
          description: "関係構築と自己防御の対立",
          symptoms: [
            "表面的な関係",
            "信頼構築の困難",
            "孤独感",
            "防御的態度"
          ],
          resolution: {
            strategy: "選択的開放アプローチ",
            actions: [
              "信頼できる少数との深い関係",
              "段階的な自己開示",
              "境界線の明確化",
              "安全な環境での練習"
            ]
          }
        }
      },
      
      // 葛藤の強度分類
      severityLevels: {
        mild: {
          threshold: 0.3,
          impact: "一時的な不快感",
          intervention: "自己調整可能"
        },
        moderate: {
          threshold: 0.6,
          impact: "持続的なストレス",
          intervention: "積極的対処必要"
        },
        severe: {
          threshold: 0.8,
          impact: "機能不全リスク",
          intervention: "専門的支援推奨"
        }
      }
    };
  }

  /**
   * 調和メトリクスの初期化
   */
  initializeHarmonyMetrics() {
    return {
      // 調和度の計算要素
      components: {
        osAlignment: 0.3,        // OS適合度の重み
        conflictLevel: 0.25,     // 葛藤レベルの重み
        authenticity: 0.25,      // 真正性の重み
        sustainability: 0.2      // 持続可能性の重み
      },
      
      // 調和度の閾値
      thresholds: {
        excellent: 0.8,   // 優秀な調和
        good: 0.6,        // 良好な調和
        acceptable: 0.4,  // 許容可能
        poor: 0.2         // 要改善
      },
      
      // 時間的要因
      temporalFactors: {
        immediate: 1.0,    // 即時的影響
        shortTerm: 0.8,    // 短期的影響
        mediumTerm: 0.6,   // 中期的影響
        longTerm: 0.4      // 長期的影響
      }
    };
  }

  /**
   * メイン分析メソッド：人格と行動の調和度分析
   */
  analyzeHarmony(personalityProfile, proposedAction, contextualFactors = {}) {
    try {
      console.log("🔍 Analyzing personality-action harmony...");
      
      // 1. 入力検証
      this.validateInputs(personalityProfile, proposedAction);
      
      // 2. 行動タイプの分類
      const actionType = this.classifyAction(proposedAction);
      
      // 3. OS適合度の計算
      const osAlignment = this.calculateOSAlignment(personalityProfile, actionType);
      
      // 4. 葛藤の検出
      const conflicts = this.detectConflicts(personalityProfile, actionType, contextualFactors);
      
      // 5. 真正性の評価
      const authenticity = this.assessAuthenticity(personalityProfile, proposedAction);
      
      // 6. 持続可能性の評価
      const sustainability = this.assessSustainability(personalityProfile, actionType, contextualFactors);
      
      // 7. 総合調和度の計算
      const harmonyScore = this.calculateHarmonyScore({
        osAlignment,
        conflicts,
        authenticity,
        sustainability
      });
      
      // 8. 調和的行動の生成
      const harmonizedActions = this.generateHarmonizedActions(
        personalityProfile,
        proposedAction,
        harmonyScore,
        conflicts
      );
      
      // 9. 推奨事項の作成
      const recommendations = this.createRecommendations(
        harmonyScore,
        conflicts,
        harmonizedActions,
        contextualFactors
      );
      
      // 10. 結果の統合
      const result = {
        proposedAction,
        actionType,
        harmonyScore,
        osAlignment,
        conflicts,
        authenticity,
        sustainability,
        harmonizedActions,
        recommendations,
        metadata: {
          analyzedAt: new Date().toISOString(),
          contextFactorsApplied: Object.keys(contextualFactors).length > 0
        }
      };
      
      console.log(`✅ Harmony analysis completed: Score ${harmonyScore.overall.toFixed(2)}`);
      return result;
      
    } catch (error) {
      console.error("❌ Error in harmony analysis:", error);
      return this.generateErrorFallback(personalityProfile, proposedAction, error);
    }
  }

  /**
   * 行動タイプの分類
   */
  classifyAction(proposedAction) {
    const actionText = proposedAction.toLowerCase();
    const categories = this.actionTypology.categories;
    
    let bestMatch = null;
    let highestScore = 0;
    
    // キーワードマッチングによる分類
    for (const [category, config] of Object.entries(categories)) {
      let score = 0;
      
      // サブタイプとのマッチング
      for (const subType of config.subTypes) {
        if (actionText.includes(subType)) {
          score += 0.5;
        }
      }
      
      // カテゴリー名とのマッチング
      if (actionText.includes(category)) {
        score += 0.3;
      }
      
      // 説明文との類似度（簡易版）
      const keywords = config.description.split(/\s+/);
      for (const keyword of keywords) {
        if (actionText.includes(keyword)) {
          score += 0.1;
        }
      }
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = category;
      }
    }
    
    // デフォルトは適応的行動
    const finalCategory = bestMatch || "adaptive";
    
    return {
      category: finalCategory,
      confidence: Math.min(highestScore, 1.0),
      characteristics: categories[finalCategory],
      intensity: this.estimateActionIntensity(proposedAction)
    };
  }

  /**
   * 行動強度の推定
   */
  estimateActionIntensity(action) {
    const intensityKeywords = {
      extreme: ["完全に", "徹底的に", "断固として", "絶対に"],
      active: ["積極的に", "主体的に", "強く", "明確に"],
      moderate: ["適度に", "バランスよく", "穏やかに", "段階的に"],
      passive: ["慎重に", "控えめに", "ゆっくり", "様子を見ながら"]
    };
    
    for (const [level, keywords] of Object.entries(intensityKeywords)) {
      for (const keyword of keywords) {
        if (action.includes(keyword)) {
          return this.actionTypology.intensityLevels[level];
        }
      }
    }
    
    return this.actionTypology.intensityLevels.moderate;
  }

  /**
   * OS適合度の計算
   */
  calculateOSAlignment(personalityProfile, actionType) {
    const osScores = personalityProfile.tripleOS || {
      engineOS: 0.33,
      interfaceOS: 0.33,
      safeModeOS: 0.34
    };
    
    const actionAlignment = actionType.characteristics.osAlignment;
    
    // 各OSとの適合度を計算
    const alignments = {};
    let totalAlignment = 0;
    
    for (const [os, weight] of Object.entries(osScores)) {
      const alignment = actionAlignment[os] || 0.5;
      alignments[os] = {
        weight: weight,
        alignment: alignment,
        score: weight * alignment
      };
      totalAlignment += weight * alignment;
    }
    
    return {
      overall: totalAlignment,
      byOS: alignments,
      dominantOS: this.identifyDominantOS(osScores),
      actionFit: this.evaluateActionFit(totalAlignment)
    };
  }

  /**
   * 支配的OSの特定
   */
  identifyDominantOS(osScores) {
    let dominant = null;
    let highestScore = 0;
    
    for (const [os, score] of Object.entries(osScores)) {
      if (score > highestScore) {
        highestScore = score;
        dominant = os;
      }
    }
    
    return {
      os: dominant,
      score: highestScore,
      characteristics: this.tripleOSCharacteristics[dominant]
    };
  }

  /**
   * 行動適合度の評価
   */
  evaluateActionFit(alignmentScore) {
    if (alignmentScore >= 0.8) return "excellent";
    if (alignmentScore >= 0.6) return "good";
    if (alignmentScore >= 0.4) return "moderate";
    if (alignmentScore >= 0.2) return "poor";
    return "very_poor";
  }

  /**
   * 葛藤の検出
   */
  detectConflicts(personalityProfile, actionType, contextualFactors) {
    const conflicts = [];
    const osScores = personalityProfile.tripleOS;
    
    // OS間の葛藤をチェック
    for (const [conflictType, config] of Object.entries(this.conflictPatterns.interOSConflicts)) {
      const severity = this.calculateConflictSeverity(
        osScores,
        actionType,
        conflictType,
        contextualFactors
      );
      
      if (severity > 0.3) { // 軽度以上の葛藤
        conflicts.push({
          type: conflictType,
          name: config.name,
          description: config.description,
          severity: severity,
          severityLevel: this.categorizeSeverity(severity),
          symptoms: this.identifyActiveSymptoms(config.symptoms, severity),
          resolution: config.resolution,
          impact: this.estimateConflictImpact(severity, contextualFactors)
        });
      }
    }
    
    // 葛藤を重要度順にソート
    conflicts.sort((a, b) => b.severity - a.severity);
    
    return {
      detected: conflicts.length > 0,
      count: conflicts.length,
      conflicts: conflicts,
      overallSeverity: this.calculateOverallConflictSeverity(conflicts),
      primaryConflict: conflicts[0] || null
    };
  }

  /**
   * 葛藤の深刻度計算
   */
  calculateConflictSeverity(osScores, actionType, conflictType, contextualFactors) {
    // 葛藤タイプに基づいて関連するOSを特定
    const conflictOSMap = {
      engineVsInterface: ["engineOS", "interfaceOS"],
      engineVsSafeMode: ["engineOS", "safeModeOS"],
      interfaceVsSafeMode: ["interfaceOS", "safeModeOS"]
    };
    
    const relevantOS = conflictOSMap[conflictType];
    if (!relevantOS) return 0;
    
    // 両OSが高い場合に葛藤が生じる
    const os1Score = osScores[relevantOS[0]] || 0;
    const os2Score = osScores[relevantOS[1]] || 0;
    
    // 葛藤の基本強度
    let severity = Math.min(os1Score, os2Score) * 2; // 両方が高いほど葛藤も強い
    
    // 行動タイプによる調整
    const actionAlignment = actionType.characteristics.osAlignment;
    const alignmentDiff = Math.abs(
      actionAlignment[relevantOS[0]] - actionAlignment[relevantOS[1]]
    );
    severity *= (1 + alignmentDiff * 0.5);
    
    // 文脈要因による調整
    if (contextualFactors.stressLevel) {
      severity *= (1 + contextualFactors.stressLevel * 0.3);
    }
    
    return Math.min(severity, 1.0);
  }

  /**
   * 真正性の評価
   */
  assessAuthenticity(personalityProfile, proposedAction) {
    // 個人の価値観との一致度を評価
    const coreValues = personalityProfile.coreValues || [];
    const actionAlignment = this.calculateValueAlignment(coreValues, proposedAction);
    
    // 過去の行動パターンとの一貫性
    const consistency = personalityProfile.behaviorHistory 
      ? this.calculateBehaviorConsistency(personalityProfile.behaviorHistory, proposedAction)
      : 0.7; // デフォルト値
    
    // 内発的動機の強さ
    const intrinsicMotivation = this.assessIntrinsicMotivation(proposedAction);
    
    // 総合的な真正性スコア
    const authenticityScore = (actionAlignment * 0.4 + consistency * 0.3 + intrinsicMotivation * 0.3);
    
    return {
      score: authenticityScore,
      components: {
        valueAlignment: actionAlignment,
        behaviorConsistency: consistency,
        intrinsicMotivation: intrinsicMotivation
      },
      assessment: this.categorizeAuthenticity(authenticityScore)
    };
  }

  /**
   * 持続可能性の評価
   */
  assessSustainability(personalityProfile, actionType, contextualFactors) {
    // エネルギー消費の評価
    const energyCost = this.calculateEnergyCost(actionType, personalityProfile);
    
    // 長期的な心理的影響
    const psychologicalImpact = this.assessPsychologicalImpact(actionType, personalityProfile);
    
    // 社会的サポートの有無
    const socialSupport = contextualFactors.socialSupport || 0.5;
    
    // リソースの可用性
    const resourceAvailability = contextualFactors.resources || 0.7;
    
    // 総合的な持続可能性スコア
    const sustainabilityScore = (
      (1 - energyCost) * 0.3 +
      (1 - psychologicalImpact.negativeImpact) * 0.3 +
      socialSupport * 0.2 +
      resourceAvailability * 0.2
    );
    
    return {
      score: sustainabilityScore,
      factors: {
        energyCost,
        psychologicalImpact,
        socialSupport,
        resourceAvailability
      },
      timeline: this.estimateSustainabilityTimeline(sustainabilityScore),
      risks: this.identifySustainabilityRisks(sustainabilityScore, energyCost)
    };
  }

  /**
   * 総合調和度の計算
   */
  calculateHarmonyScore(components) {
    const weights = this.harmonyMetrics.components;
    
    // 各要素のスコアを重み付け
    const weightedScores = {
      osAlignment: components.osAlignment.overall * weights.osAlignment,
      conflictLevel: (1 - components.conflicts.overallSeverity) * weights.conflictLevel,
      authenticity: components.authenticity.score * weights.authenticity,
      sustainability: components.sustainability.score * weights.sustainability
    };
    
    // 総合スコア
    const overall = Object.values(weightedScores).reduce((sum, score) => sum + score, 0);
    
    // 調和度カテゴリーの判定
    const category = this.categorizeHarmonyLevel(overall);
    
    return {
      overall,
      components: weightedScores,
      category,
      interpretation: this.interpretHarmonyScore(overall, category)
    };
  }

  /**
   * 調和的行動の生成
   */
  generateHarmonizedActions(personalityProfile, originalAction, harmonyScore, conflicts) {
    const harmonizedActions = [];
    
    // 1. 原案の微調整
    const adjusted = this.adjustActionForHarmony(originalAction, personalityProfile, harmonyScore);
    if (adjusted) {
      harmonizedActions.push({
        type: "adjusted",
        action: adjusted,
        description: "原案を人格特性に合わせて調整",
        harmonyImprovement: 0.1
      });
    }
    
    // 2. 葛藤解決のための代替案
    if (conflicts.detected) {
      const conflictResolutions = this.generateConflictResolutions(
        conflicts.primaryConflict,
        personalityProfile,
        originalAction
      );
      harmonizedActions.push(...conflictResolutions);
    }
    
    // 3. OS統合型アプローチ
    const integrated = this.generateIntegratedApproach(personalityProfile, originalAction);
    if (integrated) {
      harmonizedActions.push({
        type: "integrated",
        action: integrated,
        description: "Triple OSを統合的に活用",
        harmonyImprovement: 0.3
      });
    }
    
    // 4. 段階的アプローチ
    const phased = this.generatePhasedApproach(originalAction, personalityProfile);
    if (phased) {
      harmonizedActions.push({
        type: "phased",
        action: phased,
        description: "段階的に実行して葛藤を最小化",
        harmonyImprovement: 0.2
      });
    }
    
    // ハーモニースコアで並べ替え
    return harmonizedActions.sort((a, b) => 
      b.harmonyImprovement - a.harmonyImprovement
    );
  }

  /**
   * 推奨事項の作成
   */
  createRecommendations(harmonyScore, conflicts, harmonizedActions, contextualFactors) {
    const recommendations = {
      summary: this.generateSummaryRecommendation(harmonyScore),
      primaryRecommendation: null,
      alternativeApproaches: [],
      warnings: [],
      supportStrategies: []
    };
    
    // 主要推奨事項
    if (harmonyScore.overall >= 0.7) {
      recommendations.primaryRecommendation = {
        action: "提案された行動を実行",
        reasoning: "人格特性との高い調和度",
        confidence: harmonyScore.overall
      };
    } else if (harmonizedActions.length > 0) {
      recommendations.primaryRecommendation = {
        action: harmonizedActions[0].action,
        reasoning: "調和度を改善した代替案",
        confidence: Math.min(harmonyScore.overall + harmonizedActions[0].harmonyImprovement, 0.95)
      };
    } else {
      recommendations.primaryRecommendation = {
        action: "行動の再検討を推奨",
        reasoning: "人格特性との調和度が低い",
        confidence: 0.3
      };
    }
    
    // 代替アプローチ
    recommendations.alternativeApproaches = harmonizedActions.slice(0, 3);
    
    // 警告事項
    if (conflicts.detected) {
      recommendations.warnings = conflicts.conflicts.map(conflict => ({
        issue: conflict.name,
        severity: conflict.severityLevel,
        impact: conflict.impact,
        mitigation: conflict.resolution.actions[0]
      }));
    }
    
    // サポート戦略
    recommendations.supportStrategies = this.generateSupportStrategies(
      harmonyScore,
      conflicts,
      contextualFactors
    );
    
    return recommendations;
  }

  // =============== ヘルパーメソッド群 ===============

  /**
   * 入力検証
   */
  validateInputs(personalityProfile, proposedAction) {
    if (!personalityProfile || !personalityProfile.tripleOS) {
      throw new Error("Invalid personality profile: must include tripleOS scores");
    }
    
    if (!proposedAction || typeof proposedAction !== 'string') {
      throw new Error("Invalid proposed action: must be a non-empty string");
    }
    
    // Triple OSスコアの正規化チェック
    const osSum = Object.values(personalityProfile.tripleOS).reduce((sum, val) => sum + val, 0);
    if (Math.abs(osSum - 1.0) > 0.01) {
      console.warn("Triple OS scores do not sum to 1.0, normalizing...");
      this.normalizeTripleOS(personalityProfile.tripleOS);
    }
  }

  /**
   * Triple OSスコアの正規化
   */
  normalizeTripleOS(tripleOS) {
    const sum = Object.values(tripleOS).reduce((s, v) => s + v, 0);
    for (const os in tripleOS) {
      tripleOS[os] = tripleOS[os] / sum;
    }
  }

  /**
   * 価値観との一致度計算
   */
  calculateValueAlignment(coreValues, action) {
    if (!coreValues || coreValues.length === 0) return 0.7;
    
    let alignmentScore = 0;
    for (const value of coreValues) {
      if (action.toLowerCase().includes(value.toLowerCase())) {
        alignmentScore += 1;
      }
    }
    
    return Math.min(alignmentScore / coreValues.length, 1.0);
  }

  /**
   * 行動の一貫性計算
   */
  calculateBehaviorConsistency(history, proposedAction) {
    if (!history || history.length === 0) return 0.7;
    
    // 簡易的な類似度計算
    let consistencyScore = 0;
    const recentActions = history.slice(-5); // 直近5つの行動
    
    for (const pastAction of recentActions) {
      const similarity = this.calculateActionSimilarity(pastAction, proposedAction);
      consistencyScore += similarity;
    }
    
    return consistencyScore / recentActions.length;
  }

  /**
   * 行動の類似度計算
   */
  calculateActionSimilarity(action1, action2) {
    // 簡易的な単語ベースの類似度
    const words1 = action1.toLowerCase().split(/\s+/);
    const words2 = action2.toLowerCase().split(/\s+/);
    
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  /**
   * 内発的動機の評価
   */
  assessIntrinsicMotivation(action) {
    const intrinsicKeywords = ["したい", "楽しみ", "興味", "情熱", "夢", "目標"];
    const extrinsicKeywords = ["しなければ", "べき", "期待", "要求", "義務"];
    
    let intrinsicScore = 0;
    let extrinsicScore = 0;
    
    for (const keyword of intrinsicKeywords) {
      if (action.includes(keyword)) intrinsicScore++;
    }
    
    for (const keyword of extrinsicKeywords) {
      if (action.includes(keyword)) extrinsicScore++;
    }
    
    if (intrinsicScore + extrinsicScore === 0) return 0.6;
    
    return intrinsicScore / (intrinsicScore + extrinsicScore);
  }

  /**
   * エネルギーコストの計算
   */
  calculateEnergyCost(actionType, personalityProfile) {
    const baseIntensity = actionType.intensity;
    const osAlignment = actionType.characteristics.osAlignment;
    const dominantOS = this.identifyDominantOS(personalityProfile.tripleOS);
    
    // 支配的OSとの不一致はエネルギーコストを増加
    const alignmentCost = 1 - osAlignment[dominantOS.os];
    
    return baseIntensity * (1 + alignmentCost * 0.5);
  }

  /**
   * 心理的影響の評価
   */
  assessPsychologicalImpact(actionType, personalityProfile) {
    const osScores = personalityProfile.tripleOS;
    const actionAlignment = actionType.characteristics.osAlignment;
    
    let positiveImpact = 0;
    let negativeImpact = 0;
    
    for (const [os, score] of Object.entries(osScores)) {
      const alignment = actionAlignment[os] || 0.5;
      if (alignment > 0.6) {
        positiveImpact += score * alignment;
      } else if (alignment < 0.4) {
        negativeImpact += score * (1 - alignment);
      }
    }
    
    return {
      positiveImpact: Math.min(positiveImpact, 1.0),
      negativeImpact: Math.min(negativeImpact, 1.0),
      netImpact: positiveImpact - negativeImpact
    };
  }

  /**
   * 葛藤解決案の生成
   */
  generateConflictResolutions(primaryConflict, personalityProfile, originalAction) {
    if (!primaryConflict) return [];
    
    const resolutions = [];
    const strategies = primaryConflict.resolution.actions;
    
    for (const strategy of strategies.slice(0, 2)) { // 上位2つの戦略
      const adapted = this.adaptStrategyToAction(strategy, originalAction);
      resolutions.push({
        type: "conflict_resolution",
        action: adapted,
        description: `${primaryConflict.name}の葛藤を解決`,
        harmonyImprovement: 0.2,
        targetConflict: primaryConflict.type
      });
    }
    
    return resolutions;
  }

  /**
   * 戦略の行動への適応
   */
  adaptStrategyToAction(strategy, originalAction) {
    // 戦略を具体的な行動に変換
    const adaptations = {
      "価値観を社会的文脈で表現": `${originalAction}を、周囲の理解を得ながら実行`,
      "同じ価値観を持つコミュニティ探し": `${originalAction}に共感する仲間と共に行動`,
      "段階的な自己開示": `${originalAction}を小さなステップから開始`,
      "創造的な妥協点の発見": `${originalAction}を柔軟にアレンジして実行`,
      "段階的なリスクテイク": `${originalAction}をリスクを抑えて段階的に実施`,
      "安全網の構築": `${originalAction}の前に十分な準備とサポート体制を整備`,
      "小さな実験から開始": `${originalAction}の小規模版から試行`,
      "成功体験の蓄積": `${originalAction}の成功要素を積み重ねながら進行`
    };
    
    return adaptations[strategy] || `${strategy}を考慮して${originalAction}`;
  }

  /**
   * 統合的アプローチの生成
   */
  generateIntegratedApproach(personalityProfile, originalAction) {
    const osScores = personalityProfile.tripleOS;
    
    // 各OSの強みを活かしたアプローチ
    let integrated = originalAction;
    
    if (osScores.engineOS > 0.3) {
      integrated = `価値観に基づいて${integrated}`;
    }
    
    if (osScores.interfaceOS > 0.3) {
      integrated = `周囲と調和しながら${integrated}`;
    }
    
    if (osScores.safeModeOS > 0.3) {
      integrated = `リスクを管理しつつ${integrated}`;
    }
    
    return integrated;
  }

  /**
   * 段階的アプローチの生成
   */
  generatePhasedApproach(originalAction, personalityProfile) {
    return {
      phase1: `${originalAction}の準備と計画`,
      phase2: `小規模な試行実施`,
      phase3: `フィードバックに基づく調整`,
      phase4: `本格的な${originalAction}の実行`,
      timeline: "2-4週間での段階的実施"
    };
  }

  /**
   * サポート戦略の生成
   */
  generateSupportStrategies(harmonyScore, conflicts, contextualFactors) {
    const strategies = [];
    
    // 調和度に基づくサポート
    if (harmonyScore.overall < 0.6) {
      strategies.push({
        type: "self_reflection",
        description: "行動前の自己内省時間の確保",
        importance: "high"
      });
    }
    
    // 葛藤に基づくサポート
    if (conflicts.detected) {
      strategies.push({
        type: "conflict_management",
        description: "定期的な葛藤チェックと調整",
        importance: "high"
      });
    }
    
    // 文脈要因に基づくサポート
    if (contextualFactors.stressLevel > 0.7) {
      strategies.push({
        type: "stress_management",
        description: "ストレス管理技法の活用",
        importance: "medium"
      });
    }
    
    // 基本的なサポート
    strategies.push({
      type: "progress_monitoring",
      description: "実行状況の定期的なモニタリング",
      importance: "medium"
    });
    
    return strategies;
  }

  /**
   * カテゴリー化関数群
   */
  
  categorizeSeverity(severity) {
    for (const [level, config] of Object.entries(this.conflictPatterns.severityLevels)) {
      if (severity >= config.threshold) {
        return level;
      }
    }
    return "mild";
  }

  categorizeAuthenticity(score) {
    if (score >= 0.8) return "highly_authentic";
    if (score >= 0.6) return "authentic";
    if (score >= 0.4) return "moderately_authentic";
    if (score >= 0.2) return "low_authenticity";
    return "inauthentic";
  }

  categorizeHarmonyLevel(score) {
    for (const [level, threshold] of Object.entries(this.harmonyMetrics.thresholds)) {
      if (score >= threshold) {
        return level;
      }
    }
    return "poor";
  }

  /**
   * その他のヘルパーメソッド
   */
  
  identifyActiveSymptoms(symptoms, severity) {
    const activeCount = Math.ceil(symptoms.length * severity);
    return symptoms.slice(0, activeCount);
  }

  estimateConflictImpact(severity, contextualFactors) {
    const baseImpact = {
      performance: severity * 0.3,
      wellbeing: severity * 0.4,
      relationships: severity * 0.3
    };
    
    // 文脈要因による調整
    if (contextualFactors.deadline) {
      baseImpact.performance *= 1.5;
    }
    
    return baseImpact;
  }

  calculateOverallConflictSeverity(conflicts) {
    if (conflicts.length === 0) return 0;
    
    // 最も深刻な葛藤と平均を組み合わせ
    const maxSeverity = Math.max(...conflicts.map(c => c.severity));
    const avgSeverity = conflicts.reduce((sum, c) => sum + c.severity, 0) / conflicts.length;
    
    return maxSeverity * 0.7 + avgSeverity * 0.3;
  }

  estimateSustainabilityTimeline(score) {
    if (score >= 0.8) return "長期的に持続可能（6ヶ月以上）";
    if (score >= 0.6) return "中期的に持続可能（3-6ヶ月）";
    if (score >= 0.4) return "短期的に持続可能（1-3ヶ月）";
    return "持続困難（1ヶ月未満）";
  }

  identifySustainabilityRisks(score, energyCost) {
    const risks = [];
    
    if (score < 0.4) {
      risks.push("燃え尽きリスク");
    }
    
    if (energyCost > 0.7) {
      risks.push("エネルギー枯渇リスク");
    }
    
    return risks;
  }

  interpretHarmonyScore(score, category) {
    const interpretations = {
      excellent: "人格特性と行動が非常に良く調和しています",
      good: "概ね調和が取れており、実行に適しています",
      acceptable: "一定の調整により実行可能です",
      poor: "大幅な見直しまたは代替案の検討が必要です"
    };
    
    return interpretations[category] || "調和度の評価が必要です";
  }

  generateSummaryRecommendation(harmonyScore) {
    const category = harmonyScore.category;
    const score = harmonyScore.overall;
    
    return {
      level: category,
      score: score,
      message: this.interpretHarmonyScore(score, category),
      actionability: score >= 0.4 ? "実行可能" : "要検討"
    };
  }

  adjustActionForHarmony(action, personalityProfile, harmonyScore) {
    if (harmonyScore.overall >= 0.7) return null; // 調整不要
    
    // 簡易的な調整提案
    const dominantOS = this.identifyDominantOS(personalityProfile.tripleOS);
    
    switch (dominantOS.os) {
      case "engineOS":
        return `自分の価値観を明確にしながら${action}`;
      case "interfaceOS":
        return `周囲との調和を保ちながら${action}`;
      case "safeModeOS":
        return `安全性を確保しながら慎重に${action}`;
      default:
        return action;
    }
  }

  /**
   * エラー時のフォールバック
   */
  generateErrorFallback(personalityProfile, proposedAction, error) {
    return {
      proposedAction,
      error: error.message,
      harmonyScore: {
        overall: 0.5,
        category: "uncertain",
        interpretation: "分析エラーのため評価不能"
      },
      recommendations: {
        summary: {
          level: "error",
          message: "エラーが発生したため、慎重な検討を推奨"
        },
        primaryRecommendation: {
          action: "専門家への相談を推奨",
          reasoning: "システムエラーのため自動分析不能",
          confidence: 0.1
        }
      }
    };
  }
}

// グローバル変数として登録
if (typeof window !== "undefined") {
  window.PersonalityActionHarmonizer = PersonalityActionHarmonizer;
  console.log("✅ Personality-Action Harmonizer loaded successfully");
}

// Node.js環境での使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = PersonalityActionHarmonizer;
}