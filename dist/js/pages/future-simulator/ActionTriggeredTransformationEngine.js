// ActionTriggeredTransformationEngine.js - 行動トリガー型変化エンジン
// 特定の行動が特定の条件下で易経的変化を引き起こすメカニズム

/**
 * 行動トリガー型変化エンジン
 * 
 * 目的：
 * - 行動と変化条件のマッピング
 * - トリガー条件の評価
 * - 連鎖的変化の検出
 * - 変化の閾値管理
 * 
 * 入力：
 * - actionContext: 行動コンテキスト
 * - currentState: 現在の卦・爻状態
 * - historicalData: 過去の行動履歴
 * - environmentalFactors: 環境要因
 * 
 * 処理内容：
 * 1. トリガー条件の評価
 * 2. 変化の種類判定
 * 3. 連鎖反応の予測
 * 4. 変化タイミングの算出
 * 
 * 出力：
 * - triggeredTransformations: トリガーされた変化
 * - chainReactions: 連鎖反応
 * - timeline: 変化のタイムライン
 * 
 * 副作用：
 * - ログ出力
 * - イベント発火
 * 
 * 前提条件：
 * - UnifiedTransformationEngineがロード済み
 * - YaoActionDefinitionEngineがロード済み
 * 
 * エラー処理：
 * - 無効な条件：スキップ
 * - 計算エラー：フォールバック
 */

class ActionTriggeredTransformationEngine {
  constructor() {
    this.initializeEngine();
  }

  initializeEngine() {
    console.log("⚡ Initializing Action-Triggered Transformation Engine...");
    
    // 依存関係の確認
    this.validateDependencies();
    
    // トリガー条件の定義
    this.triggerConditions = this.defineTriggerConditions();
    
    // 変化メカニズムの定義
    this.transformationMechanisms = this.defineTransformationMechanisms();
    
    // 連鎖反応パターンの定義
    this.chainReactionPatterns = this.defineChainReactionPatterns();
    
    // 環境要因の影響マップ
    this.environmentalInfluences = this.defineEnvironmentalInfluences();
    
    // 閾値システムの初期化
    this.thresholdSystem = this.initializeThresholdSystem();
    
    console.log("✅ Action-Triggered Transformation Engine initialized successfully");
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
    } else {
      this.transformationEngine = new window.UnifiedTransformationEngine();
      this.yaoEngine = new window.YaoActionDefinitionEngine();
    }
  }

  /**
   * トリガー条件の定義
   */
  defineTriggerConditions() {
    return {
      // 進爻トリガー条件
      進爻: {
        primary: {
          name: "テーマ一致行動",
          description: "現在の爻のテーマに完全に一致する行動",
          evaluate: (action, state, context) => {
            const yaoDef = this.getYaoDefinition(state);
            if (!yaoDef) return { triggered: false };
            
            const alignment = this.calculateThemeAlignment(action, yaoDef);
            return {
              triggered: alignment > 0.7,
              strength: alignment,
              confidence: 0.8
            };
          }
        },
        secondary: {
          name: "継続的努力",
          description: "同じ方向性の行動を3回以上継続",
          evaluate: (action, state, context) => {
            const history = context.actionHistory || [];
            const consistency = this.calculateActionConsistency(action, history);
            return {
              triggered: consistency.count >= 3 && consistency.alignment > 0.6,
              strength: consistency.alignment,
              confidence: 0.7
            };
          }
        },
        contextual: {
          name: "環境的支援",
          description: "環境要因が行動を強く支援",
          evaluate: (action, state, context) => {
            const support = this.calculateEnvironmentalSupport(action, context);
            return {
              triggered: support > 0.75,
              strength: support,
              confidence: 0.6
            };
          }
        }
      },
      
      // 変爻トリガー条件
      変爻: {
        primary: {
          name: "反対行動",
          description: "現在の爻の性質と正反対の行動",
          evaluate: (action, state, context) => {
            const yaoDef = this.getYaoDefinition(state);
            if (!yaoDef) return { triggered: false };
            
            const opposition = this.calculateOpposition(action, yaoDef);
            return {
              triggered: opposition > 0.7,
              strength: opposition,
              confidence: 0.8
            };
          }
        },
        secondary: {
          name: "危機的決断",
          description: "高ストレス下での決定的行動",
          evaluate: (action, state, context) => {
            const stress = context.stressLevel || 0;
            const decisiveness = this.assessDecisiveness(action);
            return {
              triggered: stress > 0.7 && decisiveness > 0.8,
              strength: stress * decisiveness,
              confidence: 0.75
            };
          }
        },
        contextual: {
          name: "転換点到達",
          description: "状況が自然な転換点に到達",
          evaluate: (action, state, context) => {
            const turning = this.detectTurningPoint(state, context);
            return {
              triggered: turning.detected && this.isTransformativeAction(action),
              strength: turning.intensity,
              confidence: 0.7
            };
          }
        }
      },
      
      // 錯卦トリガー条件
      錯卦: {
        primary: {
          name: "価値観逆転",
          description: "根本的な価値観の完全な逆転行動",
          evaluate: (action, state, context) => {
            const valueReversal = this.assessValueReversal(action, context);
            return {
              triggered: valueReversal > 0.8,
              strength: valueReversal,
              confidence: 0.6
            };
          }
        },
        secondary: {
          name: "極限状態",
          description: "極度のストレスや危機での反転行動",
          evaluate: (action, state, context) => {
            const extremity = this.calculateExtremity(context);
            const reversal = this.detectReversalPattern(action);
            return {
              triggered: extremity > 0.85 && reversal,
              strength: extremity,
              confidence: 0.5
            };
          }
        }
      },
      
      // 綜卦トリガー条件
      綜卦: {
        primary: {
          name: "視点転換",
          description: "他者の立場からの行動",
          evaluate: (action, state, context) => {
            const perspectiveShift = this.detectPerspectiveShift(action);
            return {
              triggered: perspectiveShift > 0.7,
              strength: perspectiveShift,
              confidence: 0.7
            };
          }
        },
        secondary: {
          name: "役割交換",
          description: "通常と逆の役割での行動",
          evaluate: (action, state, context) => {
            const roleReversal = this.assessRoleReversal(action, context);
            return {
              triggered: roleReversal > 0.75,
              strength: roleReversal,
              confidence: 0.65
            };
          }
        }
      },
      
      // 互卦トリガー条件
      互卦: {
        primary: {
          name: "内省的行動",
          description: "深い自己探求を伴う行動",
          evaluate: (action, state, context) => {
            const introspection = this.measureIntrospection(action);
            return {
              triggered: introspection > 0.8,
              strength: introspection,
              confidence: 0.6
            };
          }
        },
        secondary: {
          name: "潜在意識の発現",
          description: "無意識的パターンの表出",
          evaluate: (action, state, context) => {
            const unconscious = this.detectUnconsciousPattern(action, context);
            return {
              triggered: unconscious.detected,
              strength: unconscious.strength,
              confidence: 0.5
            };
          }
        }
      }
    };
  }

  /**
   * 変化メカニズムの定義
   */
  defineTransformationMechanisms() {
    return {
      // 単一トリガーメカニズム
      single: {
        name: "単一条件トリガー",
        description: "一つの強い条件で変化が発生",
        process: (triggers) => {
          const strongest = this.findStrongestTrigger(triggers);
          if (strongest && strongest.strength > 0.8) {
            return {
              type: strongest.transformationType,
              probability: strongest.strength * strongest.confidence,
              mechanism: "single_strong"
            };
          }
          return null;
        }
      },
      
      // 複合トリガーメカニズム
      compound: {
        name: "複合条件トリガー",
        description: "複数の条件が組み合わさって変化が発生",
        process: (triggers) => {
          const combinations = this.findTriggerCombinations(triggers);
          const strongest = combinations.sort((a, b) => 
            b.combinedStrength - a.combinedStrength
          )[0];
          
          if (strongest && strongest.combinedStrength > 0.7) {
            return {
              type: strongest.transformationType,
              probability: strongest.combinedStrength,
              mechanism: "compound",
              components: strongest.triggers
            };
          }
          return null;
        }
      },
      
      // 累積トリガーメカニズム
      cumulative: {
        name: "累積トリガー",
        description: "時間経過で蓄積された行動が変化を引き起こす",
        process: (triggers, history) => {
          const accumulation = this.calculateAccumulation(triggers, history);
          if (accumulation.total > this.thresholdSystem.cumulative) {
            return {
              type: accumulation.dominantType,
              probability: Math.min(accumulation.total / 2, 0.9),
              mechanism: "cumulative",
              accumulation: accumulation
            };
          }
          return null;
        }
      },
      
      // 共鳴トリガーメカニズム
      resonance: {
        name: "共鳴トリガー",
        description: "環境と行動が共鳴して変化が増幅",
        process: (triggers, context) => {
          const resonance = this.calculateResonance(triggers, context);
          if (resonance.amplitude > 0.75) {
            return {
              type: resonance.transformationType,
              probability: resonance.amplitude,
              mechanism: "resonance",
              frequency: resonance.frequency
            };
          }
          return null;
        }
      }
    };
  }

  /**
   * 連鎖反応パターンの定義
   */
  defineChainReactionPatterns() {
    return {
      // 順次連鎖
      sequential: {
        name: "順次連鎖",
        description: "一つの変化が次の変化を誘発",
        pattern: {
          進爻: { next: ["変爻"], probability: 0.3 },
          変爻: { next: ["錯卦", "綜卦"], probability: 0.4 },
          錯卦: { next: ["綜卦"], probability: 0.2 },
          綜卦: { next: ["互卦"], probability: 0.3 },
          互卦: { next: ["進爻"], probability: 0.2 }
        }
      },
      
      // 共振連鎖
      harmonic: {
        name: "共振連鎖",
        description: "同種の変化が連続して発生",
        pattern: {
          進爻: { same: 0.5, amplification: 1.2 },
          変爻: { same: 0.3, amplification: 1.1 },
          錯卦: { same: 0.1, amplification: 1.0 },
          綜卦: { same: 0.2, amplification: 1.1 },
          互卦: { same: 0.15, amplification: 1.05 }
        }
      },
      
      // 対立連鎖
      opposition: {
        name: "対立連鎖",
        description: "相反する変化が交互に発生",
        pattern: {
          進爻: { opposite: "変爻", tension: 0.6 },
          変爻: { opposite: "進爻", tension: 0.6 },
          錯卦: { opposite: "綜卦", tension: 0.7 },
          綜卦: { opposite: "錯卦", tension: 0.7 },
          互卦: { opposite: null, tension: 0.3 }
        }
      },
      
      // 収束連鎖
      convergence: {
        name: "収束連鎖",
        description: "複数の変化が一点に収束",
        pattern: {
          multiple: ["進爻", "変爻"],
          convergesTo: "互卦",
          threshold: 3,
          probability: 0.5
        }
      }
    };
  }

  /**
   * 環境要因の影響マップ
   */
  defineEnvironmentalInfluences() {
    return {
      // 時間的要因
      temporal: {
        morning: { 進爻: 1.2, 変爻: 0.8 },
        afternoon: { 進爻: 1.0, 変爻: 1.0 },
        evening: { 進爻: 0.8, 変爻: 1.2 },
        night: { 互卦: 1.3, 綜卦: 1.1 }
      },
      
      // 季節的要因
      seasonal: {
        spring: { 進爻: 1.3, 互卦: 1.1 },
        summer: { 変爻: 1.2, 錯卦: 1.1 },
        autumn: { 綜卦: 1.2, 変爻: 1.1 },
        winter: { 互卦: 1.3, 進爻: 0.9 }
      },
      
      // 社会的要因
      social: {
        solitary: { 互卦: 1.4, 進爻: 1.1 },
        smallGroup: { 綜卦: 1.3, 変爻: 1.1 },
        largeGroup: { 錯卦: 1.2, 変爻: 1.3 },
        public: { 変爻: 1.4, 錯卦: 1.3 }
      },
      
      // 感情的要因
      emotional: {
        calm: { 進爻: 1.2, 互卦: 1.1 },
        excited: { 変爻: 1.3, 錯卦: 1.2 },
        anxious: { 変爻: 1.4, 綜卦: 1.2 },
        contemplative: { 互卦: 1.5, 進爻: 1.1 }
      }
    };
  }

  /**
   * 閾値システムの初期化
   */
  initializeThresholdSystem() {
    return {
      // 基本閾値
      base: {
        進爻: 0.6,
        変爻: 0.65,
        錯卦: 0.8,
        綜卦: 0.7,
        互卦: 0.75
      },
      
      // 累積閾値
      cumulative: 1.5,
      
      // 連鎖閾値
      chain: 0.5,
      
      // 動的調整
      adjust: (type, context) => {
        let threshold = this.thresholdSystem.base[type];
        
        // ストレスレベルによる調整
        if (context.stressLevel > 0.7) {
          threshold *= 0.9; // 高ストレス時は変化しやすい
        }
        
        // 変化履歴による調整
        if (context.recentTransformations > 2) {
          threshold *= 1.2; // 最近変化が多い場合は閾値を上げる
        }
        
        return threshold;
      }
    };
  }

  /**
   * メイン評価メソッド：行動による変化のトリガー評価
   */
  evaluateActionTriggers(actionContext) {
    try {
      console.log("🎯 Evaluating action triggers...");
      
      const { action, currentState, history, environment } = actionContext;
      
      // 1. 全トリガー条件の評価
      const triggers = this.evaluateAllTriggers(action, currentState, actionContext);
      
      // 2. 環境要因の適用
      const adjustedTriggers = this.applyEnvironmentalInfluences(triggers, environment);
      
      // 3. 変化メカニズムの選択と適用
      const transformations = this.applyTransformationMechanisms(adjustedTriggers, history);
      
      // 4. 連鎖反応の予測
      const chainReactions = this.predictChainReactions(transformations, actionContext);
      
      // 5. タイムラインの生成
      const timeline = this.generateTransformationTimeline(transformations, chainReactions);
      
      // 6. 結果の統合
      const result = {
        triggeredTransformations: transformations,
        chainReactions: chainReactions,
        timeline: timeline,
        primaryTransformation: this.selectPrimaryTransformation(transformations),
        confidence: this.calculateOverallConfidence(transformations, chainReactions),
        metadata: {
          evaluatedAt: new Date().toISOString(),
          triggerCount: Object.keys(triggers).length,
          mechanismsApplied: transformations.map(t => t.mechanism),
          environmentalFactors: Object.keys(environment || {})
        }
      };
      
      console.log(`✅ Evaluation complete: ${transformations.length} transformations triggered`);
      return result;
      
    } catch (error) {
      console.error("❌ Error evaluating action triggers:", error);
      return this.generateErrorFallback(actionContext, error);
    }
  }

  /**
   * 全トリガー条件の評価
   */
  evaluateAllTriggers(action, currentState, context) {
    const triggers = {};
    
    for (const [transformationType, conditions] of Object.entries(this.triggerConditions)) {
      triggers[transformationType] = [];
      
      for (const [conditionName, condition] of Object.entries(conditions)) {
        const evaluation = condition.evaluate(action, currentState, context);
        
        if (evaluation.triggered) {
          triggers[transformationType].push({
            transformationType,
            conditionName,
            condition: condition.name,
            ...evaluation
          });
        }
      }
    }
    
    return triggers;
  }

  /**
   * 環境要因の適用
   */
  applyEnvironmentalInfluences(triggers, environment) {
    if (!environment) return triggers;
    
    const adjusted = JSON.parse(JSON.stringify(triggers)); // Deep copy
    
    // 各環境要因の影響を適用
    for (const [factorType, factorValue] of Object.entries(environment)) {
      const influences = this.environmentalInfluences[factorType];
      if (!influences || !influences[factorValue]) continue;
      
      const modifiers = influences[factorValue];
      
      for (const [transformationType, modifier] of Object.entries(modifiers)) {
        if (adjusted[transformationType]) {
          adjusted[transformationType].forEach(trigger => {
            trigger.strength *= modifier;
            trigger.environmentalBoost = modifier;
          });
        }
      }
    }
    
    return adjusted;
  }

  /**
   * 変化メカニズムの適用
   */
  applyTransformationMechanisms(triggers, history) {
    const transformations = [];
    
    // 各メカニズムを試行
    for (const [mechanismName, mechanism] of Object.entries(this.transformationMechanisms)) {
      const result = mechanism.process(triggers, history);
      
      if (result) {
        transformations.push({
          ...result,
          mechanismName,
          triggers: this.extractRelevantTriggers(triggers, result.type)
        });
      }
    }
    
    // 確率順でソート
    transformations.sort((a, b) => b.probability - a.probability);
    
    return transformations;
  }

  /**
   * 連鎖反応の予測
   */
  predictChainReactions(transformations, context) {
    const chains = [];
    
    for (const transformation of transformations) {
      // 各連鎖パターンをチェック
      for (const [patternName, pattern] of Object.entries(this.chainReactionPatterns)) {
        const chain = this.evaluateChainPattern(transformation, pattern, context);
        
        if (chain) {
          chains.push({
            trigger: transformation,
            pattern: patternName,
            chain: chain,
            probability: this.calculateChainProbability(transformation, chain)
          });
        }
      }
    }
    
    return chains;
  }

  /**
   * 変化タイムラインの生成
   */
  generateTransformationTimeline(transformations, chainReactions) {
    const timeline = [];
    let currentTime = 0;
    
    // 即時変化
    for (const transformation of transformations) {
      timeline.push({
        time: currentTime,
        type: "immediate",
        transformation: transformation,
        description: `${transformation.type}への即時変化`
      });
    }
    
    // 連鎖反応
    for (const chain of chainReactions) {
      currentTime += this.estimateChainDelay(chain);
      
      timeline.push({
        time: currentTime,
        type: "chain",
        transformation: chain.chain,
        trigger: chain.trigger,
        description: `${chain.pattern}による連鎖的${chain.chain.type}`
      });
    }
    
    // タイムラインをソート
    timeline.sort((a, b) => a.time - b.time);
    
    return timeline;
  }

  // =============== ヘルパーメソッド群 ===============

  /**
   * 爻定義の取得
   */
  getYaoDefinition(state) {
    if (this.yaoEngine) {
      return this.yaoEngine.getYaoActionDefinition(state.hexagram, state.yao);
    }
    return null;
  }

  /**
   * テーマ適合度の計算
   */
  calculateThemeAlignment(action, yaoDef) {
    if (!yaoDef || !yaoDef.actions) return 0;
    
    const shinAction = yaoDef.actions.shin.description;
    const keywords = this.extractKeywords(shinAction);
    const actionKeywords = this.extractKeywords(action);
    
    let matchScore = 0;
    for (const keyword of actionKeywords) {
      if (keywords.includes(keyword)) {
        matchScore += 1;
      }
    }
    
    return Math.min(matchScore / Math.max(keywords.length, 1), 1.0);
  }

  /**
   * 行動の一貫性計算
   */
  calculateActionConsistency(action, history) {
    if (!history || history.length === 0) {
      return { count: 0, alignment: 0 };
    }
    
    const recentActions = history.slice(-5);
    let consistentCount = 0;
    let totalAlignment = 0;
    
    for (const pastAction of recentActions) {
      const similarity = this.calculateActionSimilarity(action, pastAction);
      if (similarity > 0.6) {
        consistentCount++;
        totalAlignment += similarity;
      }
    }
    
    return {
      count: consistentCount,
      alignment: consistentCount > 0 ? totalAlignment / consistentCount : 0
    };
  }

  /**
   * 環境的支援の計算
   */
  calculateEnvironmentalSupport(action, context) {
    let support = 0.5; // ベースライン
    
    // 時間帯の影響
    if (context.timeOfDay === "morning" && action.includes("開始")) {
      support += 0.2;
    }
    
    // 社会的支援
    if (context.socialSupport > 0.7) {
      support += 0.15;
    }
    
    // リソースの可用性
    if (context.resourceAvailability > 0.8) {
      support += 0.15;
    }
    
    return Math.min(support, 1.0);
  }

  /**
   * 対立度の計算
   */
  calculateOpposition(action, yaoDef) {
    if (!yaoDef || !yaoDef.actions) return 0;
    
    const henAction = yaoDef.actions.hen.description;
    const oppositionKeywords = this.extractKeywords(henAction);
    const actionKeywords = this.extractKeywords(action);
    
    let oppositionScore = 0;
    for (const keyword of actionKeywords) {
      if (oppositionKeywords.includes(keyword)) {
        oppositionScore += 1;
      }
    }
    
    // 反対の意味を持つキーワードの検出
    const antonyms = this.detectAntonyms(actionKeywords, this.extractKeywords(yaoDef.actions.shin.description));
    oppositionScore += antonyms * 0.5;
    
    return Math.min(oppositionScore / Math.max(oppositionKeywords.length, 1), 1.0);
  }

  /**
   * 決断性の評価
   */
  assessDecisiveness(action) {
    const decisiveKeywords = ["決断", "決定", "断固", "明確に", "完全に", "徹底的に"];
    let score = 0;
    
    for (const keyword of decisiveKeywords) {
      if (action.includes(keyword)) {
        score += 0.2;
      }
    }
    
    return Math.min(score, 1.0);
  }

  /**
   * 転換点の検出
   */
  detectTurningPoint(state, context) {
    // 爻位による転換点
    const yaoTurningPoints = {
      3: 0.8, // 三爻は転換の位置
      6: 0.9  // 上爻は完成と新たな始まり
    };
    
    const yaoFactor = yaoTurningPoints[state.yao] || 0.3;
    
    // 文脈的要因
    const contextFactor = (context.stressLevel || 0) * 0.5 + 
                         (context.changeReadiness || 0) * 0.5;
    
    return {
      detected: yaoFactor + contextFactor > 0.8,
      intensity: (yaoFactor + contextFactor) / 2
    };
  }

  /**
   * 変革的行動の判定
   */
  isTransformativeAction(action) {
    const transformativeKeywords = ["変える", "転換", "革新", "打破", "脱却", "新たな"];
    
    for (const keyword of transformativeKeywords) {
      if (action.includes(keyword)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * 価値観逆転の評価
   */
  assessValueReversal(action, context) {
    if (!context.coreValues) return 0;
    
    const actionValues = this.extractValues(action);
    let reversalScore = 0;
    
    for (const coreValue of context.coreValues) {
      const opposite = this.getOppositeValue(coreValue);
      if (actionValues.includes(opposite)) {
        reversalScore += 0.3;
      }
    }
    
    return Math.min(reversalScore, 1.0);
  }

  /**
   * 極限状態の計算
   */
  calculateExtremity(context) {
    const factors = {
      stress: context.stressLevel || 0,
      urgency: context.urgency || 0,
      risk: context.riskLevel || 0,
      isolation: context.socialIsolation || 0
    };
    
    const weights = {
      stress: 0.3,
      urgency: 0.3,
      risk: 0.2,
      isolation: 0.2
    };
    
    let extremity = 0;
    for (const [factor, value] of Object.entries(factors)) {
      extremity += value * weights[factor];
    }
    
    return extremity;
  }

  /**
   * 視点転換の検出
   */
  detectPerspectiveShift(action) {
    const perspectiveKeywords = ["相手の立場", "他者の視点", "逆の立場", "もし自分が", "相手にとって"];
    let score = 0;
    
    for (const keyword of perspectiveKeywords) {
      if (action.includes(keyword)) {
        score += 0.25;
      }
    }
    
    return Math.min(score, 1.0);
  }

  /**
   * 内省レベルの測定
   */
  measureIntrospection(action) {
    const introspectiveKeywords = ["内省", "自己分析", "振り返り", "内面", "深層", "本質的"];
    let score = 0;
    
    for (const keyword of introspectiveKeywords) {
      if (action.includes(keyword)) {
        score += 0.2;
      }
    }
    
    // 行動の複雑性も考慮
    if (action.length > 50) {
      score += 0.1;
    }
    
    return Math.min(score, 1.0);
  }

  /**
   * 最強トリガーの検索
   */
  findStrongestTrigger(triggers) {
    let strongest = null;
    let maxStrength = 0;
    
    for (const [transformationType, typeTriggers] of Object.entries(triggers)) {
      for (const trigger of typeTriggers) {
        const score = trigger.strength * trigger.confidence;
        if (score > maxStrength) {
          maxStrength = score;
          strongest = { ...trigger, transformationType };
        }
      }
    }
    
    return strongest;
  }

  /**
   * トリガーの組み合わせ検索
   */
  findTriggerCombinations(triggers) {
    const combinations = [];
    const types = Object.keys(triggers);
    
    // 2つの組み合わせ
    for (let i = 0; i < types.length; i++) {
      for (let j = i + 1; j < types.length; j++) {
        const type1Triggers = triggers[types[i]];
        const type2Triggers = triggers[types[j]];
        
        if (type1Triggers.length > 0 && type2Triggers.length > 0) {
          combinations.push({
            transformationType: this.determineCombinedType(types[i], types[j]),
            triggers: [...type1Triggers, ...type2Triggers],
            combinedStrength: this.calculateCombinedStrength(type1Triggers, type2Triggers)
          });
        }
      }
    }
    
    return combinations;
  }

  /**
   * 累積の計算
   */
  calculateAccumulation(triggers, history) {
    const accumulation = {
      total: 0,
      byType: {},
      dominantType: null
    };
    
    // 現在のトリガー
    for (const [type, typeTriggers] of Object.entries(triggers)) {
      accumulation.byType[type] = typeTriggers.reduce((sum, t) => sum + t.strength, 0);
      accumulation.total += accumulation.byType[type];
    }
    
    // 履歴からの累積
    if (history && history.length > 0) {
      const recentHistory = history.slice(-10);
      for (const past of recentHistory) {
        if (past.transformation) {
          const type = past.transformation.type;
          accumulation.byType[type] = (accumulation.byType[type] || 0) + 0.3;
          accumulation.total += 0.3;
        }
      }
    }
    
    // 支配的なタイプの特定
    let maxAccumulation = 0;
    for (const [type, value] of Object.entries(accumulation.byType)) {
      if (value > maxAccumulation) {
        maxAccumulation = value;
        accumulation.dominantType = type;
      }
    }
    
    return accumulation;
  }

  /**
   * 共鳴の計算
   */
  calculateResonance(triggers, context) {
    // 環境と行動の周波数マッチング（簡易版）
    const environmentalFrequency = this.calculateEnvironmentalFrequency(context);
    const actionFrequency = this.calculateActionFrequency(triggers);
    
    const frequencyMatch = 1 - Math.abs(environmentalFrequency - actionFrequency);
    const amplitude = frequencyMatch * this.calculateTriggerIntensity(triggers);
    
    // 最も共鳴する変化タイプ
    let resonantType = null;
    let maxResonance = 0;
    
    for (const [type, typeTriggers] of Object.entries(triggers)) {
      if (typeTriggers.length > 0) {
        const typeResonance = typeTriggers[0].strength * frequencyMatch;
        if (typeResonance > maxResonance) {
          maxResonance = typeResonance;
          resonantType = type;
        }
      }
    }
    
    return {
      amplitude: amplitude,
      frequency: frequencyMatch,
      transformationType: resonantType
    };
  }

  /**
   * 連鎖パターンの評価
   */
  evaluateChainPattern(transformation, pattern, context) {
    if (pattern.pattern && pattern.pattern[transformation.type]) {
      const chainConfig = pattern.pattern[transformation.type];
      
      if (chainConfig.next) {
        // 順次連鎖
        const nextType = chainConfig.next[0];
        return {
          type: nextType,
          probability: chainConfig.probability * transformation.probability
        };
      } else if (chainConfig.same) {
        // 共振連鎖
        return {
          type: transformation.type,
          probability: chainConfig.same * transformation.probability,
          amplification: chainConfig.amplification
        };
      } else if (chainConfig.opposite) {
        // 対立連鎖
        return {
          type: chainConfig.opposite,
          probability: chainConfig.tension * transformation.probability
        };
      }
    }
    
    return null;
  }

  /**
   * 主要変化の選択
   */
  selectPrimaryTransformation(transformations) {
    if (transformations.length === 0) return null;
    
    // 確率が最も高いものを選択
    return transformations[0];
  }

  /**
   * 全体的な信頼度計算
   */
  calculateOverallConfidence(transformations, chainReactions) {
    if (transformations.length === 0) return 0;
    
    // 主要変化の信頼度
    const primaryConfidence = transformations[0].probability;
    
    // 連鎖反応による補強
    const chainBoost = chainReactions.length > 0 ? 0.1 : 0;
    
    return Math.min(primaryConfidence + chainBoost, 0.95);
  }

  /**
   * エラー時のフォールバック
   */
  generateErrorFallback(actionContext, error) {
    return {
      triggeredTransformations: [],
      chainReactions: [],
      timeline: [],
      primaryTransformation: null,
      confidence: 0,
      error: error.message,
      metadata: {
        evaluatedAt: new Date().toISOString(),
        errorOccurred: true
      }
    };
  }

  // ユーティリティメソッド
  extractKeywords(text) {
    if (!text) return [];
    return text.match(/[\u4e00-\u9faf]{2,}/g) || [];
  }
  
  calculateActionSimilarity(action1, action2) {
    const keywords1 = this.extractKeywords(action1);
    const keywords2 = this.extractKeywords(action2);
    
    const common = keywords1.filter(k => keywords2.includes(k));
    return common.length / Math.max(keywords1.length, keywords2.length, 1);
  }
  
  detectAntonyms(keywords1, keywords2) {
    // 簡易的な反意語検出
    const antonymPairs = [
      ["進む", "退く"],
      ["積極", "消極"],
      ["開始", "終了"],
      ["上昇", "下降"]
    ];
    
    let count = 0;
    for (const [word1, word2] of antonymPairs) {
      if ((keywords1.includes(word1) && keywords2.includes(word2)) ||
          (keywords1.includes(word2) && keywords2.includes(word1))) {
        count++;
      }
    }
    
    return count;
  }
  
  extractValues(action) {
    // 簡易的な価値観抽出
    const valueKeywords = {
      "成長": ["成長", "発展", "向上"],
      "安定": ["安定", "維持", "保守"],
      "自由": ["自由", "独立", "解放"],
      "調和": ["調和", "協調", "平和"]
    };
    
    const detectedValues = [];
    for (const [value, keywords] of Object.entries(valueKeywords)) {
      for (const keyword of keywords) {
        if (action.includes(keyword)) {
          detectedValues.push(value);
          break;
        }
      }
    }
    
    return detectedValues;
  }
  
  getOppositeValue(value) {
    const opposites = {
      "成長": "安定",
      "安定": "成長",
      "自由": "秩序",
      "調和": "独立"
    };
    
    return opposites[value] || null;
  }
  
  detectReversalPattern(action) {
    const reversalKeywords = ["逆転", "反転", "180度", "正反対", "真逆"];
    
    for (const keyword of reversalKeywords) {
      if (action.includes(keyword)) {
        return true;
      }
    }
    
    return false;
  }
  
  assessRoleReversal(action, context) {
    const roleKeywords = {
      leader: ["指導", "命令", "決定"],
      follower: ["従う", "支援", "補佐"],
      teacher: ["教える", "指導", "説明"],
      student: ["学ぶ", "質問", "理解"]
    };
    
    // 現在の役割を特定
    const currentRole = context.currentRole || "neutral";
    
    // 行動から推測される役割
    let inferredRole = "neutral";
    let maxMatch = 0;
    
    for (const [role, keywords] of Object.entries(roleKeywords)) {
      let matches = 0;
      for (const keyword of keywords) {
        if (action.includes(keyword)) {
          matches++;
        }
      }
      
      if (matches > maxMatch) {
        maxMatch = matches;
        inferredRole = role;
      }
    }
    
    // 役割の逆転度を計算
    const reversal = (currentRole !== inferredRole && currentRole !== "neutral") ? 0.8 : 0.2;
    
    return reversal;
  }
  
  detectUnconsciousPattern(action, context) {
    // パターンの繰り返しを検出
    const history = context.actionHistory || [];
    const pattern = this.findRepeatingPattern(history);
    
    if (pattern && this.matchesPattern(action, pattern)) {
      return {
        detected: true,
        strength: 0.7,
        pattern: pattern
      };
    }
    
    return {
      detected: false,
      strength: 0
    };
  }
  
  findRepeatingPattern(history) {
    // 簡易的なパターン検出
    if (history.length < 3) return null;
    
    const recent = history.slice(-5);
    const keywords = recent.map(a => this.extractKeywords(a.action || a));
    
    // 共通キーワードを探す
    const commonKeywords = keywords[0].filter(k => 
      keywords.every(kw => kw.includes(k))
    );
    
    return commonKeywords.length > 0 ? commonKeywords : null;
  }
  
  matchesPattern(action, pattern) {
    const actionKeywords = this.extractKeywords(action);
    
    for (const patternKeyword of pattern) {
      if (actionKeywords.includes(patternKeyword)) {
        return true;
      }
    }
    
    return false;
  }
  
  extractRelevantTriggers(triggers, transformationType) {
    return triggers[transformationType] || [];
  }
  
  determineCombinedType(type1, type2) {
    // 組み合わせによる変化タイプの決定
    const combinationMap = {
      "進爻_変爻": "互卦",
      "錯卦_綜卦": "変爻",
      "進爻_互卦": "進爻"
    };
    
    const key = `${type1}_${type2}`;
    return combinationMap[key] || type1;
  }
  
  calculateCombinedStrength(triggers1, triggers2) {
    const strength1 = Math.max(...triggers1.map(t => t.strength));
    const strength2 = Math.max(...triggers2.map(t => t.strength));
    
    return (strength1 + strength2) / 2 * 1.2; // 組み合わせボーナス
  }
  
  calculateEnvironmentalFrequency(context) {
    // 環境の変化頻度を数値化
    const changeRate = context.environmentalChangeRate || 0.5;
    const stress = context.stressLevel || 0.5;
    
    return (changeRate + stress) / 2;
  }
  
  calculateActionFrequency(triggers) {
    // 行動の強度から周波数を推定
    let totalIntensity = 0;
    let count = 0;
    
    for (const typeTriggers of Object.values(triggers)) {
      for (const trigger of typeTriggers) {
        totalIntensity += trigger.strength;
        count++;
      }
    }
    
    return count > 0 ? totalIntensity / count : 0.5;
  }
  
  calculateTriggerIntensity(triggers) {
    let maxIntensity = 0;
    
    for (const typeTriggers of Object.values(triggers)) {
      for (const trigger of typeTriggers) {
        maxIntensity = Math.max(maxIntensity, trigger.strength);
      }
    }
    
    return maxIntensity;
  }
  
  calculateChainProbability(transformation, chain) {
    return transformation.probability * chain.probability * 0.8;
  }
  
  estimateChainDelay(chain) {
    // 連鎖反応の遅延時間（日数）
    const delays = {
      sequential: 7,
      harmonic: 3,
      opposition: 5,
      convergence: 14
    };
    
    return delays[chain.pattern] || 7;
  }
}

// グローバル変数として登録
if (typeof window !== "undefined") {
  window.ActionTriggeredTransformationEngine = ActionTriggeredTransformationEngine;
  console.log("✅ Action-Triggered Transformation Engine loaded successfully");
}

// Node.js環境での使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = ActionTriggeredTransformationEngine;
}