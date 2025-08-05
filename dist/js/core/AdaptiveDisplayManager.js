/**
 * 適応的表示管理システム - HAQEI Future Simulator
 * 
 * 目的：
 * - ユーザーの特性に応じた最適な表示調整
 * - 易経経験レベルに基づく情報量調整
 * - 個人の性格特性に応じたプレゼンテーション
 * - bunenjin哲学の実践（分かれた演技）
 */

class AdaptiveDisplayManager {
  constructor() {
    console.log('🎨 適応的表示管理システム初期化開始');
    
    // ユーザープロファイルタイプ定義
    this.profileTypes = this.initializeProfileTypes();
    
    // 表示スタイル定義
    this.displayStyles = this.initializeDisplayStyles();
    
    // 複雑度レベル定義
    this.complexityLevels = this.initializeComplexityLevels();
    
    // bunenjin統合設定
    this.bunenjinSettings = this.initializeBunenjinSettings();
    
    console.log('✅ 適応的表示管理システム初期化完了');
  }
  
  /**
   * メイン表示生成メソッド
   */
  generateAdaptiveDisplay(analysisResult, userProfile, concernAnalysis) {
    console.log('🎯 適応的表示生成開始');
    
    try {
      // ユーザープロファイルの分析
      const profileAnalysis = this.analyzeUserProfile(userProfile);
      
      // 表示設定の決定
      const displaySettings = this.determineDisplaySettings(
        profileAnalysis,
        concernAnalysis,
        analysisResult
      );
      
      // 各パターンの表示生成
      const patternDisplays = this.generatePatternDisplays(
        analysisResult.patternAnalyses,
        displaySettings
      );
      
      // 統合表示の生成
      const integratedDisplay = this.generateIntegratedDisplay(
        analysisResult.integratedResult,
        displaySettings
      );
      
      // bunenjin哲学の実装
      const bunenjinIntegration = this.implementBunenjinPhilosophy(
        patternDisplays,
        integratedDisplay,
        displaySettings
      );
      
      const result = {
        displaySettings,
        patternDisplays,
        integratedDisplay,
        bunenjinIntegration,
        metadata: {
          generatedAt: new Date().toISOString(),
          profileType: profileAnalysis.primaryType,
          adaptationLevel: displaySettings.adaptationLevel
        }
      };
      
      console.log('✅ 適応的表示生成完了');
      return result;
      
    } catch (error) {
      console.error('❌ 表示生成エラー:', error);
      return this.generateFallbackDisplay(analysisResult);
    }
  }
  
  /**
   * ユーザープロファイル分析
   */
  analyzeUserProfile(userProfile) {
    if (!userProfile) {
      return this.getDefaultProfile();
    }
    
    // 易経経験レベルの判定
    const experienceLevel = this.determineExperienceLevel(userProfile);
    
    // 性格特性の分析
    const personalityType = this.determinePersonalityType(userProfile);
    
    // 学習スタイルの推定
    const learningStyle = this.determineLearningStyle(userProfile);
    
    // 緊急度への対応スタイル
    const urgencyStyle = this.determineUrgencyStyle(userProfile);
    
    return {
      primaryType: personalityType,
      experienceLevel,
      learningStyle,
      urgencyStyle,
      preferences: this.extractUserPreferences(userProfile)
    };
  }
  
  /**
   * 表示設定の決定
   */
  determineDisplaySettings(profileAnalysis, concernAnalysis, analysisResult) {
    const settings = {
      // 情報の深度レベル
      informationDepth: this.calculateInformationDepth(
        profileAnalysis.experienceLevel,
        concernAnalysis.confidence
      ),
      
      // 表示スタイル
      visualStyle: this.selectVisualStyle(
        profileAnalysis.personalityType,
        profileAnalysis.learningStyle
      ),
      
      // 言語複雑度
      languageComplexity: this.determineLanguageComplexity(
        profileAnalysis.experienceLevel
      ),
      
      // 緊急度表示
      urgencyIndication: this.determineUrgencyIndication(
        concernAnalysis.urgency,
        profileAnalysis.urgencyStyle
      ),
      
      // bunenjin統合レベル
      bunenjinLevel: this.determineBunenjinLevel(
        profileAnalysis.experienceLevel
      ),
      
      // 適応度
      adaptationLevel: this.calculateAdaptationLevel(
        profileAnalysis,
        concernAnalysis
      )
    };
    
    return settings;
  }
  
  /**
   * パターン別表示生成
   */
  generatePatternDisplays(patternAnalyses, displaySettings) {
    const displays = {};
    
    Object.entries(patternAnalyses).forEach(([patternKey, analysis]) => {
      try {
        displays[patternKey] = this.generateSinglePatternDisplay(
          analysis,
          patternKey,
          displaySettings
        );
      } catch (error) {
        console.warn(`⚠️ パターン表示生成エラー (${patternKey}):`, error);
        displays[patternKey] = this.generateErrorDisplay(patternKey, error);
      }
    });
    
    return displays;
  }
  
  /**
   * 単一パターンの表示生成
   */
  generateSinglePatternDisplay(analysis, patternKey, displaySettings) {
    const patternConfig = this.getPatternDisplayConfig(patternKey);
    
    let display = {
      title: this.generatePatternTitle(analysis, patternConfig, displaySettings),
      content: this.generatePatternContent(analysis, patternConfig, displaySettings),
      visualization: this.generatePatternVisualization(analysis, patternConfig, displaySettings),
      actionItems: this.generatePatternActionItems(analysis, displaySettings),
      confidence: analysis.confidence || 0.5
    };
    
    // 経験レベルに応じた調整
    if (displaySettings.experienceLevel === 'beginner') {
      display = this.simplifyForBeginner(display);
    } else if (displaySettings.experienceLevel === 'advanced') {
      display = this.enhanceForAdvanced(display, analysis);
    }
    
    // 緊急度に応じた調整
    if (displaySettings.urgencyIndication === 'high') {
      display = this.emphasizeUrgency(display);
    }
    
    return display;
  }
  
  /**
   * 統合表示の生成
   */
  generateIntegratedDisplay(integratedResult, displaySettings) {
    return {
      summary: this.generateSummaryDisplay(integratedResult, displaySettings),
      recommendations: this.generateRecommendationDisplay(integratedResult, displaySettings),
      timeline: this.generateTimelineDisplay(integratedResult, displaySettings),
      warnings: this.generateWarningDisplay(integratedResult, displaySettings),
      opportunities: this.generateOpportunityDisplay(integratedResult, displaySettings)
    };
  }
  
  /**
   * bunenjin哲学の実装
   */
  implementBunenjinPhilosophy(patternDisplays, integratedDisplay, displaySettings) {
    // 「分かれた演技」の実装
    const dividedPerformance = this.createDividedPerformance(
      patternDisplays,
      displaySettings
    );
    
    // 複数視点の同時提示
    const multipleViews = this.createMultipleViews(
      patternDisplays,
      displaySettings
    );
    
    // 矛盾の許容と統合
    const paradoxIntegration = this.createParadoxIntegration(
      patternDisplays,
      integratedDisplay,
      displaySettings
    );
    
    // Triple OSの視点分離
    const tripleOSViews = this.createTripleOSViews(
      patternDisplays,
      displaySettings
    );
    
    return {
      dividedPerformance,
      multipleViews,
      paradoxIntegration,
      tripleOSViews,
      philosophicalNote: this.generatePhilosophicalNote(displaySettings)
    };
  }
  
  /**
   * 分かれた演技の実装
   */
  createDividedPerformance(patternDisplays, displaySettings) {
    const performances = [];
    
    // 各パターンを独立した「演技」として提示
    Object.entries(patternDisplays).forEach(([key, display]) => {
      performances.push({
        role: this.getPatternRole(key),
        perspective: display.title,
        performance: display.content,
        authenticity: display.confidence,
        allowUserChoice: true
      });
    });
    
    return {
      concept: "各視点は独立した「演技」として提示されます。どの演技を受け入れるかはあなたの選択です。",
      performances,
      instruction: "複数の演技を同時に受け入れることで、より豊かな理解が得られます。",
      bunenjinNote: "分かれた演技こそが、真実への多様なアプローチを可能にします。"
    };
  }
  
  /**
   * 複数視点の同時提示
   */
  createMultipleViews(patternDisplays, displaySettings) {
    const views = {};
    
    // 相対する視点のペアリング
    if (patternDisplays.reversed_hexagram && patternDisplays.hexagram_change) {
      views.perspectiveContrast = {
        current: patternDisplays.hexagram_change,
        alternative: patternDisplays.reversed_hexagram,
        synthesis: "両方の視点を同時に保持することで、より完全な理解が可能になります。"
      };
    }
    
    // 隠れた側面と表面の対比
    if (patternDisplays.mutual_hexagram && patternDisplays.line_progression) {
      views.surfaceDepthContrast = {
        surface: patternDisplays.line_progression,
        depth: patternDisplays.mutual_hexagram,
        integration: "表面的な流れと深層の動きを同時に理解することが重要です。"
      };
    }
    
    return views;
  }
  
  /**
   * 矛盾統合の実装
   */
  createParadoxIntegration(patternDisplays, integratedDisplay, displaySettings) {
    const paradoxes = this.identifyParadoxes(patternDisplays);
    
    return {
      identifiedParadoxes: paradoxes,
      integrationApproach: "矛盾は排除するものではなく、より高次の理解への扉です。",
      practicalAdvice: "相反する指導を同時に心に留め、状況に応じて適切な面を発現させてください。",
      bunenjinWisdom: "対立する真実の共存こそが、人間存在の本質です。"
    };
  }
  
  /**
   * Triple OSビューの作成
   */
  createTripleOSViews(patternDisplays, displaySettings) {
    return {
      engineOS: {
        focus: "内的変化と個人的成長",
        relevantPatterns: this.filterPatternsForEngineOS(patternDisplays),
        message: "あなたの内なる力に焦点を当てましょう"
      },
      interfaceOS: {
        focus: "他者との関係性と相互作用",
        relevantPatterns: this.filterPatternsForInterfaceOS(patternDisplays),
        message: "周囲との調和を重視しましょう"
      },
      safeModeOS: {
        focus: "リスク回避と安定性の確保",
        relevantPatterns: this.filterPatternsForSafeModeOS(patternDisplays),
        message: "慎重なアプローチを心がけましょう"
      }
    };
  }
  
  // ===== 表示調整メソッド群 =====
  
  /**
   * 初心者向け簡略化
   */
  simplifyForBeginner(display) {
    return {
      ...display,
      title: this.simplifyLanguage(display.title),
      content: this.extractEssentials(display.content),
      technicalTerms: this.addGlossary(display.content),
      beginnerNote: "易経の基本的な考え方に基づいています"
    };
  }
  
  /**
   * 上級者向け拡張
   */
  enhanceForAdvanced(display, analysis) {
    return {
      ...display,
      classicalReferences: this.addClassicalReferences(analysis),
      philosophicalDepth: this.addPhilosophicalDepth(analysis),
      historicalContext: this.addHistoricalContext(analysis),
      advancedNote: "古典的解釈と現代的応用の統合"
    };
  }
  
  /**
   * 緊急度の強調
   */
  emphasizeUrgency(display) {
    return {
      ...display,
      urgencyIndicator: "🚨 緊急性が高い状況です",
      prioritizedActions: this.prioritizeActions(display.actionItems),
      timeframe: this.addTimeframe(display),
      urgentNote: "迅速な対応が推奨されます"
    };
  }
  
  // ===== ヘルパーメソッド群 =====
  
  getDefaultProfile() {
    return {
      experienceLevel: 'beginner',
      personalityType: 'balanced',
      learningStyle: 'visual',
      urgencyStyle: 'moderate'
    };
  }
  
  determineExperienceLevel(profile) {
    // プロファイルから経験レベルを判定
    if (profile.ichingExperience) {
      if (profile.ichingExperience > 5) return 'advanced';
      if (profile.ichingExperience > 1) return 'intermediate';
    }
    return 'beginner';
  }
  
  determinePersonalityType(profile) {
    // Myers-Briggs的な分類
    if (profile.personalityType) return profile.personalityType;
    
    // デフォルト推定
    return 'intuitive'; // intuitive, analytical, emotional, practical
  }
  
  determineLearningStyle(profile) {
    if (profile.learningStyle) return profile.learningStyle;
    return 'visual'; // visual, auditory, kinesthetic, reading
  }
  
  generateFallbackDisplay(analysisResult) {
    return {
      displaySettings: {
        informationDepth: 'medium',
        visualStyle: 'balanced',
        languageComplexity: 'simple',
        urgencyIndication: 'medium',
        adaptationLevel: 'basic'
      },
      patternDisplays: {
        fallback: {
          title: "基本的な易経の指導",
          content: "現在の状況を静かに観察し、内なる知恵に耳を傾けてください。",
          actionItems: ["現状を受け入れる", "内省の時間を作る"],
          confidence: 0.5
        }
      },
      integratedDisplay: {
        summary: "システムエラーにより基本的な指導のみ提供します。"
      },
      bunenjinIntegration: {
        philosophicalNote: "困難な状況も学びの機会です。"
      },
      metadata: {
        fallback: true,
        generatedAt: new Date().toISOString()
      }
    };
  }
  
  // 初期化メソッド群
  initializeProfileTypes() {
    return {
      beginner: { depth: 1, complexity: 'simple' },
      intermediate: { depth: 2, complexity: 'medium' },
      advanced: { depth: 3, complexity: 'high' }
    };
  }
  
  initializeDisplayStyles() {
    return {
      visual: { graphics: true, charts: true, symbols: true },
      textual: { detailed: true, explanations: true },
      minimal: { concise: true, essentials: true }
    };
  }
  
  initializeComplexityLevels() {
    return {
      simple: { vocabulary: 'basic', concepts: 'fundamental' },
      medium: { vocabulary: 'intermediate', concepts: 'detailed' },
      high: { vocabulary: 'advanced', concepts: 'comprehensive' }
    };
  }
  
  initializeBunenjinSettings() {
    return {
      enableDividedPerformance: true,
      enableMultipleViews: true,
      enableParadoxIntegration: true,
      enableTripleOSViews: true
    };
  }
}

// グローバルスコープに登録
if (typeof window !== 'undefined') {
  window.AdaptiveDisplayManager = AdaptiveDisplayManager;
}