/**
 * 適応的易経エンジン - HAQEI Future Simulator核心システム
 * 
 * 目的：
 * - ユーザーの悩みに応じた最適な易経変化パターンの選択
 * - 64卦システムと序卦伝論理の完全実装
 * - bunenjin哲学に基づく多視点解釈の提供
 * 
 * 機能：
 * - 悩みの自動分類と適応的パターン選択
 * - 7つの変化パターンの統合実装
 * - ユーザー特性に応じた表示調整
 * - 易経正統性の保証
 */

class AdaptiveIChingEngine {
  constructor() {
    console.log('🔯 適応的易経エンジン初期化開始');
    
    this.transformationEngine = null; // 既存のIChingTransformationEngineを活用
    this.concernClassifier = new ConcernClassifier();
    this.displayManager = new AdaptiveDisplayManager();
    this.sequenceLogic = new SequenceLogic();
    this.classicalStandards = new ClassicalIChingStandards();
    
    // 7つの変化パターンの定義
    this.transformationPatterns = {
      line_progression: {
        name: '進（爻の推移）',
        description: '時間経過による自然な発展',
        applicability: ['growth', 'process', 'gradual_change'],
        urgency: 'low_to_medium',
        complexity: 'simple'
      },
      line_change: {
        name: '変（爻変）', 
        description: '条件による急激な変化',
        applicability: ['decision', 'turning_point', 'immediate_change'],
        urgency: 'medium_to_high',
        complexity: 'medium'
      },
      hexagram_change: {
        name: '卦変（本卦→之卦）',
        description: '現状から理想への完全変化',
        applicability: ['transformation', 'major_change', 'goal_achievement'],
        urgency: 'high',
        complexity: 'high'
      },
      mutual_hexagram: {
        name: '互卦（隠れた本質）',
        description: '潜在的性質や隠れた影響',
        applicability: ['hidden_factors', 'unconscious', 'deep_analysis'],
        urgency: 'low',
        complexity: 'high'
      },
      reversed_hexagram: {
        name: '綜卦（視点転換）',
        description: '180度異なる視点からの解釈',
        applicability: ['relationship', 'conflict', 'perspective_shift'],
        urgency: 'medium',
        complexity: 'medium'
      },
      opposite_hexagram: {
        name: '錯卦（完全対立）',
        description: 'すべて反転した極端なアプローチ',
        applicability: ['extreme_situation', 'radical_change', 'opposition'],
        urgency: 'high',
        complexity: 'high'
      },
      sequence_logic: {
        name: '序卦伝（系列関係）',
        description: '64卦の自然順序による長期的流れ',
        applicability: ['life_journey', 'long_term_process', 'spiritual_growth'],
        urgency: 'low',
        complexity: 'very_high'
      }
    };
    
    this.initializeAsync();
  }
  
  async initializeAsync() {
    try {
      // 既存のTransformationEngineとの統合
      if (window.IChingTransformationEngine) {
        this.transformationEngine = new window.IChingTransformationEngine();
        console.log('✅ IChingTransformationEngine統合完了');
      }
      
      // 序卦伝論理の初期化
      await this.sequenceLogic.initialize();
      
      console.log('✅ 適応的易経エンジン初期化完了');
    } catch (error) {
      console.error('❌ 初期化エラー:', error);
    }
  }
  
  /**
   * メイン分析実行 - 悩みに適応した易経分析
   */
  async performAdaptiveAnalysis(concern, userProfile = null) {
    console.log('🎯 適応的易経分析開始');
    
    try {
      // Step 1: 悩みの分類
      const concernAnalysis = await this.concernClassifier.classifyConcern(
        concern.text,
        concern.emotionalContext,
        concern.contextualAnalysis
      );
      
      console.log('📊 悩み分類結果:', concernAnalysis);
      
      // Step 2: 基本卦の決定
      const primaryHexagram = this.determinePrimaryHexagram(
        concern,
        concernAnalysis
      );
      
      // Step 3: 適用パターンの選択
      const selectedPatterns = this.selectOptimalPatterns(
        concernAnalysis,
        userProfile
      );
      
      console.log('🔄 選択されたパターン:', selectedPatterns);
      
      // Step 4: 各パターンの分析実行
      const patternAnalyses = await this.executePatternAnalyses(
        primaryHexagram,
        selectedPatterns,
        concernAnalysis
      );
      
      // Step 5: 統合結果の生成
      const integratedResult = this.generateIntegratedResult(
        primaryHexagram,
        patternAnalyses,
        concernAnalysis,
        userProfile
      );
      
      // Step 6: 適応的表示の生成
      const adaptiveDisplay = this.displayManager.generateAdaptiveDisplay(
        integratedResult,
        userProfile,
        concernAnalysis
      );
      
      return {
        primaryHexagram,
        concernAnalysis,
        patternAnalyses,
        integratedResult,
        adaptiveDisplay,
        metadata: {
          analysisType: 'adaptive_iching',
          timestamp: new Date().toISOString(),
          selectedPatterns: selectedPatterns.map(p => p.name)
        }
      };
      
    } catch (error) {
      console.error('❌ 適応的分析エラー:', error);
      return this.generateFallbackResult(concern, error);
    }
  }
  
  /**
   * 最適パターンの選択
   */
  selectOptimalPatterns(concernAnalysis, userProfile) {
    const patterns = [];
    const { urgency, importance, nature, scope } = concernAnalysis;
    
    // 緊急度・重要度マトリックスによる基本選択
    if (urgency === 'high' && importance === 'high') {
      patterns.push(
        this.transformationPatterns.hexagram_change,
        this.transformationPatterns.line_change
      );
    } else if (urgency === 'low' && importance === 'high') {
      patterns.push(
        this.transformationPatterns.sequence_logic,
        this.transformationPatterns.line_progression
      );
    } else if (urgency === 'high' && importance === 'low') {
      patterns.push(
        this.transformationPatterns.line_change,
        this.transformationPatterns.opposite_hexagram
      );
    } else {
      patterns.push(
        this.transformationPatterns.mutual_hexagram,
        this.transformationPatterns.line_progression
      );
    }
    
    // 悩みの性質による追加選択
    if (nature === 'relationship') {
      patterns.push(this.transformationPatterns.reversed_hexagram);
    }
    if (nature === 'anxiety' || nature === 'confusion') {
      patterns.push(this.transformationPatterns.mutual_hexagram);
    }
    if (nature === 'decision') {
      patterns.push(
        this.transformationPatterns.hexagram_change,
        this.transformationPatterns.opposite_hexagram
      );
    }
    
    // ユーザープロファイルによる調整
    if (userProfile) {
      if (userProfile.experienceLevel === 'beginner') {
        // 初心者には理解しやすいパターンを優先
        return patterns.filter(p => p.complexity !== 'very_high').slice(0, 2);
      } else if (userProfile.experienceLevel === 'advanced') {
        // 上級者には全パターンを提供
        return [...new Set(patterns)]; // 重複除去
      }
    }
    
    // デフォルト: 複雑度を考慮して3パターンまで
    return [...new Set(patterns)]
      .sort((a, b) => this.getComplexityScore(a) - this.getComplexityScore(b))
      .slice(0, 3);
  }
  
  /**
   * パターン分析の実行
   */
  async executePatternAnalyses(primaryHexagram, selectedPatterns, concernAnalysis) {
    const analyses = {};
    
    for (const pattern of selectedPatterns) {
      try {
        switch (pattern.name) {
          case '進（爻の推移）':
            analyses.line_progression = await this.analyzeLineProgression(
              primaryHexagram, concernAnalysis
            );
            break;
            
          case '変（爻変）':
            analyses.line_change = await this.analyzeLineChange(
              primaryHexagram, concernAnalysis
            );
            break;
            
          case '卦変（本卦→之卦）':
            analyses.hexagram_change = await this.analyzeHexagramChange(
              primaryHexagram, concernAnalysis
            );
            break;
            
          case '互卦（隠れた本質）':
            analyses.mutual_hexagram = await this.analyzeMutualHexagram(
              primaryHexagram, concernAnalysis
            );
            break;
            
          case '綜卦（視点転換）':
            analyses.reversed_hexagram = await this.analyzeReversedHexagram(
              primaryHexagram, concernAnalysis
            );
            break;
            
          case '錯卦（完全対立）':
            analyses.opposite_hexagram = await this.analyzeOppositeHexagram(
              primaryHexagram, concernAnalysis
            );
            break;
            
          case '序卦伝（系列関係）':
            analyses.sequence_logic = await this.analyzeSequenceLogic(
              primaryHexagram, concernAnalysis
            );
            break;
        }
      } catch (error) {
        console.warn(`⚠️ パターン分析エラー (${pattern.name}):`, error);
        analyses[this.getPatternKey(pattern)] = {
          error: true,
          message: `${pattern.name}の分析でエラーが発生しました`
        };
      }
    }
    
    return analyses;
  }
  
  /**
   * 爻の推移分析
   */
  async analyzeLineProgression(hexagram, concernAnalysis) {
    // 現在の爻から次段階への自然な発展を分析
    const currentLine = this.determineCurrentLine(hexagram, concernAnalysis);
    const nextLine = currentLine < 6 ? currentLine + 1 : 1;
    
    const progression = {
      current: {
        line: currentLine,
        meaning: this.getLineMeaning(hexagram, currentLine),
        stage: this.getLifeStage(currentLine)
      },
      next: {
        line: nextLine,
        meaning: this.getLineMeaning(hexagram, nextLine),
        stage: this.getLifeStage(nextLine)
      },
      process: {
        duration: this.estimateTransitionDuration(currentLine, nextLine),
        requirements: this.getTransitionRequirements(currentLine, nextLine),
        obstacles: this.getTransitionObstacles(currentLine, nextLine)
      }
    };
    
    return {
      type: 'line_progression',
      result: progression,
      guidance: this.generateProgressionGuidance(progression),
      confidence: 0.8
    };
  }
  
  /**
   * 卦変分析（本卦→之卦）
   */
  async analyzeHexagramChange(hexagram, concernAnalysis) {
    // 変爻を決定し、理想状態への変化を分析
    const changingLines = this.determineChangingLines(hexagram, concernAnalysis);
    const targetHexagram = this.calculateTargetHexagram(hexagram, changingLines);
    
    const change = {
      current: {
        hexagram: hexagram,
        name: this.getHexagramName(hexagram),
        situation: this.analyzeCurrentSituation(hexagram, concernAnalysis)
      },
      target: {
        hexagram: targetHexagram,
        name: this.getHexagramName(targetHexagram),
        potential: this.analyzeTargetPotential(targetHexagram, concernAnalysis)
      },
      transformation: {
        changingLines: changingLines,
        catalyst: this.identifyTransformationCatalyst(changingLines),
        process: this.describeTransformationProcess(hexagram, targetHexagram),
        timeframe: this.estimateTransformationTime(changingLines.length)
      }
    };
    
    return {
      type: 'hexagram_change',
      result: change,
      guidance: this.generateTransformationGuidance(change),
      confidence: 0.9
    };
  }
  
  /**
   * 互卦分析（隠れた本質）
   */
  async analyzeMutualHexagram(hexagram, concernAnalysis) {
    if (!this.transformationEngine) {
      throw new Error('TransformationEngine未初期化');
    }
    
    const mutualHexagram = this.transformationEngine.calculateMutualHexagram(hexagram);
    
    const mutual = {
      original: {
        hexagram: hexagram,
        name: this.getHexagramName(hexagram),
        surfaceLevel: this.analyzeSurfaceLevel(hexagram, concernAnalysis)
      },
      hidden: {
        hexagram: mutualHexagram,
        name: this.getHexagramName(mutualHexagram),
        deepLevel: this.analyzeDeepLevel(mutualHexagram, concernAnalysis)
      },
      revelation: {
        hiddenFactors: this.identifyHiddenFactors(mutualHexagram, concernAnalysis),
        unconsciousInfluences: this.analyzeUnconsciousInfluences(mutualHexagram),
        potentialAwakening: this.describePotentialAwakening(hexagram, mutualHexagram)
      }
    };
    
    return {
      type: 'mutual_hexagram',
      result: mutual,
      guidance: this.generateMutualGuidance(mutual),
      confidence: 0.7
    };
  }
  
  /**
   * 綜卦分析（視点転換）
   */
  async analyzeReversedHexagram(hexagram, concernAnalysis) {
    if (!this.transformationEngine) {
      throw new Error('TransformationEngine未初期化');
    }
    
    const reversedHexagram = this.transformationEngine.calculateReversedHexagram(hexagram);
    
    const reversal = {
      yourPerspective: {
        hexagram: hexagram,
        name: this.getHexagramName(hexagram),
        viewpoint: this.analyzeCurrentViewpoint(hexagram, concernAnalysis)
      },
      otherPerspective: {
        hexagram: reversedHexagram,
        name: this.getHexagramName(reversedHexagram),
        viewpoint: this.analyzeAlternativeViewpoint(reversedHexagram, concernAnalysis)
      },
      synthesis: {
        commonGround: this.findCommonGround(hexagram, reversedHexagram),
        complementarity: this.analyzeComplementarity(hexagram, reversedHexagram),
        integrationPath: this.suggestIntegrationPath(hexagram, reversedHexagram)
      }
    };
    
    return {
      type: 'reversed_hexagram',
      result: reversal,
      guidance: this.generateReversalGuidance(reversal),
      confidence: 0.8
    };
  }
  
  /**
   * 序卦伝分析（系列関係）
   */
  async analyzeSequenceLogic(hexagram, concernAnalysis) {
    const sequence = this.sequenceLogic.getHexagramSequence(hexagram);
    
    const sequentialAnalysis = {
      currentPosition: {
        hexagram: hexagram,
        name: this.getHexagramName(hexagram),
        sequenceNumber: sequence.position,
        lifePhase: sequence.lifePhase
      },
      previousStage: sequence.previous ? {
        hexagram: sequence.previous.hexagram,
        name: this.getHexagramName(sequence.previous.hexagram),
        lessonLearned: sequence.previous.lesson
      } : null,
      nextStage: sequence.next ? {
        hexagram: sequence.next.hexagram,
        name: this.getHexagramName(sequence.next.hexagram),
        upcomingChallenge: sequence.next.challenge
      } : null,
      overallJourney: {
        theme: sequence.overallTheme,
        progress: sequence.progressPercentage,
        remainingPath: sequence.remainingChallenges
      }
    };
    
    return {
      type: 'sequence_logic',
      result: sequentialAnalysis,
      guidance: this.generateSequenceGuidance(sequentialAnalysis),
      confidence: 0.85
    };
  }
  
  /**
   * 統合結果の生成
   */
  generateIntegratedResult(primaryHexagram, patternAnalyses, concernAnalysis, userProfile) {
    // 各パターンの結果を統合し、最も適切な指導を生成
    const weights = this.calculatePatternWeights(patternAnalyses, concernAnalysis);
    const integratedGuidance = this.synthesizeGuidance(patternAnalyses, weights);
    
    return {
      primaryMessage: integratedGuidance.primary,
      actionSteps: integratedGuidance.actions,
      timeframe: integratedGuidance.timeframe,
      cautions: integratedGuidance.cautions,
      opportunities: integratedGuidance.opportunities,
      overallConfidence: this.calculateOverallConfidence(patternAnalyses, weights),
      bunenjinIntegration: this.integrateBunenjinPhilosophy(integratedGuidance)
    };
  }
  
  /**
   * bunenjin哲学の統合
   */
  integrateBunenjinPhilosophy(guidance) {
    return {
      multipleViews: {
        description: "複数の視点を同時に保持することで、より豊かな理解を得られます",
        perspectives: guidance.perspectives || []
      },
      dividedPerformance: {
        description: "矛盾する解釈も同時に受け入れることで、新たな洞察が生まれます",
        paradoxes: guidance.paradoxes || []
      },
      tripleOSIntegration: {
        engineOS: "内的な変化と成長に焦点を当てる視点",
        interfaceOS: "他者との関係性と相互作用を重視する視点", 
        safeModeOS: "リスクを避け、安定性を保つ防御的視点"
      }
    };
  }
  
  // ===== ヘルパーメソッド群 =====
  
  getComplexityScore(pattern) {
    const scores = {
      'simple': 1,
      'medium': 2, 
      'high': 3,
      'very_high': 4
    };
    return scores[pattern.complexity] || 2;
  }
  
  getPatternKey(pattern) {
    const keyMap = {
      '進（爻の推移）': 'line_progression',
      '変（爻変）': 'line_change',
      '卦変（本卦→之卦）': 'hexagram_change',
      '互卦（隠れた本質）': 'mutual_hexagram',
      '綜卦（視点転換）': 'reversed_hexagram',
      '錯卦（完全対立）': 'opposite_hexagram',
      '序卦伝（系列関係）': 'sequence_logic'
    };
    return keyMap[pattern.name] || 'unknown';
  }
  
  generateFallbackResult(concern, error) {
    return {
      primaryHexagram: 1, // 乾為天（創造的力）をデフォルトに
      concernAnalysis: {
        urgency: 'medium',
        importance: 'medium',
        nature: 'general',
        scope: 'personal'
      },
      patternAnalyses: {
        fallback: {
          type: 'fallback',
          result: { message: '基本的な指導を提供します' },
          guidance: '現在の状況を静かに観察し、内なる声に耳を傾けてください。',
          confidence: 0.5
        }
      },
      integratedResult: {
        primaryMessage: 'システムエラーが発生しましたが、基本的な易経の知恵をお伝えします。',
        actionSteps: ['現状を受け入れる', '内省の時間を作る', '次の行動を慎重に考える'],
        timeframe: '不明',
        overallConfidence: 0.3
      },
      metadata: {
        error: true,
        errorMessage: error.message,
        fallbackMode: true
      }
    };
  }
}

// グローバルスコープに登録
if (typeof window !== 'undefined') {
  window.AdaptiveIChingEngine = AdaptiveIChingEngine;
}