/**
 * Situational Context Engine - HaQei Philosophy Implementation
 * Triple OS Architecture: Context Layer Component
 * 
 * 状況コンテキストエンジン
 * - 環境的文脈理解
 * - HaQei哲学による状況認識
 * - 動的文脈適応システム
 */

console.log('🎭 SituationalContextEngine Loading...');

window.SituationalContextEngine = {
  // Triple OS Architecture準拠の初期化
  init() {
    console.log('🔧 SituationalContextEngine initializing...');
    this.setupTripleOS();
    this.initializeContextFrameworks();
    this.loadSituationalMappings();
    console.log('✅ SituationalContextEngine initialized successfully');
  },

  // Triple OS Architecture セットアップ
  setupTripleOS() {
    // Engine OS (Core Context Logic)
    this.engineOS = {
      name: 'Situational Context Engine OS',
      version: '1.0.0',
      philosophy: 'haqei-situational',
      
      async analyzeSituationalContext(input, previousContext = {}) {
        try {
          const situationRecognition = this.recognizeSituation(input);
          const contextMapping = await this.mapSituationalContext(situationRecognition, previousContext);
          const environmentalFactors = this.analyzeEnvironmentalFactors(input, contextMapping);
          const stakeholderAnalysis = this.analyzeStakeholders(input, contextMapping);
          const dynamicFactors = this.analyzeDynamicFactors(input, contextMapping);
          const adaptationStrategies = this.generateAdaptationStrategies(contextMapping, dynamicFactors);
          
          return {
            input: input,
            situation: situationRecognition,
            context: contextMapping,
            environmental: environmentalFactors,
            stakeholders: stakeholderAnalysis,
            dynamics: dynamicFactors,
            adaptations: adaptationStrategies,
            metadata: {
              contextComplexity: this.calculateContextComplexity(contextMapping),
              adaptationPotential: this.calculateAdaptationPotential(adaptationStrategies),
              situationalStability: this.assessSituationalStability(dynamicFactors),
              philosophy: 'haqei-situational'
            }
          };
          
        } catch (error) {
          console.warn('⚠️ Situational context analysis error:', error);
          return this.createFallbackContext(input);
        }
      },
      
      recognizeSituation(input) {
        const situationTypes = this.identifySituationTypes(input);
        const urgencyLevel = this.assessUrgencyLevel(input);
        const complexity = this.assessSituationComplexity(input);
        const scope = this.determineSituationScope(input);
        const nature = this.analyzeSituationNature(input);
        
        return {
          types: situationTypes,
          urgency: urgencyLevel,
          complexity: complexity,
          scope: scope,
          nature: nature,
          primaryType: this.determinePrimarySituationType(situationTypes),
          confidence: this.calculateRecognitionConfidence(situationTypes)
        };
      },
      
      identifySituationTypes(input) {
        const situationPatterns = {
          decision: /決める|選ぶ|判断|決断|方針|選択/,
          problem: /問題|困難|課題|トラブル|悩み|障害/,
          opportunity: /チャンス|機会|可能性|好機|タイミング/,
          relationship: /人間関係|友人|家族|同僚|チーム|パートナー/,
          career: /仕事|転職|昇進|キャリア|職業|会社/,
          health: /健康|体調|病気|治療|医療|ケア/,
          learning: /学習|勉強|教育|スキル|知識|成長/,
          finance: /お金|金融|投資|収入|支出|経済/,
          creative: /創作|芸術|デザイン|アイデア|表現|クリエイティブ/,
          communication: /コミュニケーション|会話|伝達|相談|対話/,
          conflict: /対立|争い|衝突|緊張|摩擦|対抗/,
          change: /変化|変更|転換|移行|改革|革新/
        };
        
        const detectedTypes = [];
        Object.entries(situationPatterns).forEach(([type, pattern]) => {
          if (pattern.test(input)) {
            detectedTypes.push({
              type: type,
              confidence: this.calculatePatternConfidence(pattern, input),
              relevance: this.assessTypeRelevance(type, input)
            });
          }
        });
        
        return detectedTypes.sort((a, b) => b.confidence - a.confidence);
      },
      
      assessUrgencyLevel(input) {
        const urgencyIndicators = {
          high: /緊急|急ぎ|すぐに|今すぐ|至急|危険|クリティカル/,
          medium: /早め|近いうち|そろそろ|なるべく|できれば/,
          low: /いつか|将来|時間があるとき|余裕があるとき/
        };
        
        for (const [level, pattern] of Object.entries(urgencyIndicators)) {
          if (pattern.test(input)) {
            return {
              level: level,
              confidence: this.calculatePatternConfidence(pattern, input),
              indicators: this.extractUrgencyIndicators(input, pattern)
            };
          }
        }
        
        return {
          level: 'medium',
          confidence: 0.5,
          indicators: []
        };
      },
      
      assessSituationComplexity(input) {
        let complexity = 0.5; // 基準値
        
        // 語彙の多様性
        const uniqueWords = new Set(input.split(/\s+/)).size;
        const totalWords = input.split(/\s+/).length;
        const vocabulary = uniqueWords / totalWords;
        complexity += vocabulary * 0.3;
        
        // 複数のドメインの言及
        const domains = this.identifyDomains(input);
        complexity += domains.length * 0.1;
        
        // 関係者の多さ
        const stakeholders = this.identifyStakeholders(input);
        complexity += stakeholders.length * 0.05;
        
        // 時間的複雑さ
        const timeframes = this.identifyTimeframes(input);
        complexity += timeframes.length * 0.1;
        
        return Math.min(complexity, 1.0);
      },
      
      determineSituationScope(input) {
        const scopeIndicators = {
          personal: /自分|私|個人的|プライベート|一人で/,
          interpersonal: /相手|パートナー|友人|家族|恋人/,
          group: /チーム|グループ|仲間|みんな|集団/,
          organizational: /会社|組織|部署|職場|企業/,
          societal: /社会|地域|コミュニティ|世間|公共/,
          global: /世界|グローバル|国際|全体|普遍/
        };
        
        const detectedScopes = [];
        Object.entries(scopeIndicators).forEach(([scope, pattern]) => {
          if (pattern.test(input)) {
            detectedScopes.push({
              scope: scope,
              strength: this.calculatePatternStrength(pattern, input)
            });
          }
        });
        
        return detectedScopes.length > 0 ? detectedScopes : [{ scope: 'personal', strength: 0.5 }];
      },
      
      analyzeSituationNature(input) {
        const naturePatterns = {
          analytical: /分析|検討|調査|研究|データ|情報/,
          creative: /創造|アイデア|発想|イノベーション|デザイン/,
          emotional: /感情|気持ち|心|愛|不安|喜び|悲しみ/,
          practical: /実践|実行|行動|実際|具体的|現実/,
          strategic: /戦略|計画|方針|長期|目標|ビジョン/,
          tactical: /戦術|手法|方法|短期|即効|テクニック/,
          philosophical: /哲学|価値観|信念|人生|意味|本質/
        };
        
        const detectedNatures = [];
        Object.entries(naturePatterns).forEach(([nature, pattern]) => {
          if (pattern.test(input)) {
            detectedNatures.push({
              nature: nature,
              strength: this.calculatePatternStrength(pattern, input),
              relevance: this.assessNatureRelevance(nature, input)
            });
          }
        });
        
        return detectedNatures.sort((a, b) => b.strength - a.strength);
      },
      
      async mapSituationalContext(situationRecognition, previousContext) {
        const baseContext = {
          situation: situationRecognition,
          previous: previousContext,
          timestamp: new Date().toISOString()
        };
        
        // 状況特化コンテキストマッピング
        const contextMap = await this.createSituationalContextMap(situationRecognition);
        
        // 継続性とのリンク
        const continuity = this.analyzeContinuity(baseContext, previousContext);
        
        // 文脈的制約
        const constraints = this.identifyContextualConstraints(situationRecognition);
        
        // 機会と可能性
        const opportunities = this.identifyContextualOpportunities(situationRecognition);
        
        return {
          base: baseContext,
          map: contextMap,
          continuity: continuity,
          constraints: constraints,
          opportunities: opportunities,
          coherence: this.calculateContextualCoherence(contextMap, continuity)
        };
      },
      
      analyzeEnvironmentalFactors(input, contextMapping) {
        const factors = {
          physical: this.analyzePhysicalEnvironment(input),
          social: this.analyzeSocialEnvironment(input),
          cultural: this.analyzeCulturalEnvironment(input),
          economic: this.analyzeEconomicEnvironment(input),
          technological: this.analyzeTechnologicalEnvironment(input),
          temporal: this.analyzeTemporalEnvironment(input)
        };
        
        const interactions = this.analyzeFactorInteractions(factors);
        const influences = this.assessEnvironmentalInfluences(factors, contextMapping);
        
        return {
          factors: factors,
          interactions: interactions,
          influences: influences,
          dominantFactors: this.identifyDominantFactors(factors),
          stability: this.assessEnvironmentalStability(factors)
        };
      },
      
      analyzeStakeholders(input, contextMapping) {
        const stakeholders = this.identifyStakeholders(input);
        const roles = this.analyzeStakeholderRoles(stakeholders, contextMapping);
        const relationships = this.mapStakeholderRelationships(stakeholders, input);
        const influences = this.assessStakeholderInfluences(stakeholders, contextMapping);
        const dynamics = this.analyzeStakeholderDynamics(stakeholders, relationships);
        
        return {
          stakeholders: stakeholders,
          roles: roles,
          relationships: relationships,
          influences: influences,
          dynamics: dynamics,
          keyStakeholders: this.identifyKeyStakeholders(stakeholders, influences),
          alignment: this.assessStakeholderAlignment(stakeholders, relationships)
        };
      },
      
      analyzeDynamicFactors(input, contextMapping) {
        const trends = this.identifyTrends(input, contextMapping);
        const pressures = this.identifyPressures(input, contextMapping);
        const changes = this.identifyChanges(input, contextMapping);
        const momentum = this.assessMomentum(input, contextMapping);
        const volatility = this.assessVolatility(trends, pressures, changes);
        
        return {
          trends: trends,
          pressures: pressures,
          changes: changes,
          momentum: momentum,
          volatility: volatility,
          predictability: this.assessPredictability(trends, volatility),
          adaptationRequired: this.assessAdaptationRequirement(changes, volatility)
        };
      },
      
      generateAdaptationStrategies(contextMapping, dynamicFactors) {
        const strategies = [];
        
        // 変化対応戦略
        if (dynamicFactors.volatility > 0.6) {
          strategies.push(...this.generateVolatilityStrategies(dynamicFactors));
        }
        
        // 安定性維持戦略
        if (dynamicFactors.volatility < 0.4) {
          strategies.push(...this.generateStabilityStrategies(dynamicFactors));
        }
        
        // 機会活用戦略
        if (contextMapping.opportunities.length > 0) {
          strategies.push(...this.generateOpportunityStrategies(contextMapping.opportunities));
        }
        
        // 制約対処戦略
        if (contextMapping.constraints.length > 0) {
          strategies.push(...this.generateConstraintStrategies(contextMapping.constraints));
        }
        
        // HaQei哲学的統合戦略
        strategies.push(...this.generateHaQeiIntegrationStrategies(contextMapping, dynamicFactors));
        
        return this.prioritizeStrategies(strategies);
      }
    };

    // Interface OS (Context Presentation Layer)
    this.interfaceOS = {
      name: 'Situational Context Interface OS',
      
      formatContextResult(result) {
        return {
          overview: this.createContextOverview(result),
          situation: this.formatSituation(result.situation),
          context: this.formatContext(result.context),
          environmental: this.formatEnvironmentalFactors(result.environmental),
          stakeholders: this.formatStakeholders(result.stakeholders),
          dynamics: this.formatDynamics(result.dynamics),
          adaptations: this.formatAdaptations(result.adaptations),
          insights: this.generateContextualInsights(result),
          visualizations: this.generateVisualizationSpecs(result),
          philosophy: result.metadata.philosophy
        };
      },
      
      createContextOverview(result) {
        return {
          title: 'HaQei状況コンテキスト分析',
          summary: {
            situationType: result.situation.primaryType,
            urgency: result.situation.urgency.level,
            complexity: this.formatComplexity(result.situation.complexity),
            scope: result.situation.scope[0]?.scope || 'unknown'
          },
          keyInsights: this.extractKeyInsights(result),
          urgentActions: this.extractUrgentActions(result.adaptations),
          contextualTheme: this.deriveContextualTheme(result)
        };
      },
      
      formatSituation(situation) {
        return {
          primary: this.formatSituationType(situation.primaryType),
          types: situation.types.map(type => ({
            name: this.formatSituationType(type.type),
            confidence: this.formatPercentage(type.confidence),
            relevance: this.formatPercentage(type.relevance)
          })),
          urgency: {
            level: this.formatUrgencyLevel(situation.urgency.level),
            indicators: situation.urgency.indicators
          },
          complexity: this.formatComplexity(situation.complexity),
          scope: situation.scope.map(s => ({
            name: this.formatScopeType(s.scope),
            strength: this.formatPercentage(s.strength)
          })),
          nature: situation.nature.map(n => ({
            name: this.formatNatureType(n.nature),
            strength: this.formatPercentage(n.strength)
          }))
        };
      }
    };

    // Safe Mode OS (Fallback Layer)
    this.safeMode = {
      name: 'Situational Context Safe Mode OS',
      active: false,
      
      activate() {
        console.log('🛡️ SituationalContextEngine Safe Mode activated');
        this.active = true;
        
        return {
          basicContextAnalysis: true,
          advancedFeatures: false,
          philosophy: 'haqei-safe'
        };
      },
      
      performBasicSituationalAnalysis(input) {
        const basicSituation = {
          type: this.identifyBasicSituationType(input),
          urgency: this.assessBasicUrgency(input),
          complexity: this.estimateBasicComplexity(input),
          scope: 'personal'
        };
        
        return {
          input: input,
          situation: basicSituation,
          insights: [`基本的な状況分析: ${basicSituation.type}として認識`],
          metadata: {
            contextComplexity: basicSituation.complexity,
            adaptationPotential: 0.5,
            situationalStability: 0.5,
            philosophy: 'haqei-safe'
          }
        };
      }
    };
  },

  // 初期化メソッド群
  initializeContextFrameworks() {
    this.contextFrameworks = {
      situationType: this.createSituationTypeFramework(),
      urgency: this.createUrgencyFramework(),
      scope: this.createScopeFramework(),
      nature: this.createNatureFramework(),
      adaptation: this.createAdaptationFramework()
    };
  },

  createSituationTypeFramework() {
    return {
      categories: [
        'decision', 'problem', 'opportunity', 'relationship',
        'career', 'health', 'learning', 'finance',
        'creative', 'communication', 'conflict', 'change'
      ],
      hierarchies: {
        'problem': ['technical', 'interpersonal', 'strategic'],
        'decision': ['binary', 'multiple', 'strategic'],
        'opportunity': ['immediate', 'strategic', 'creative']
      }
    };
  },

  loadSituationalMappings() {
    this.situationalMappings = {
      contexts: this.loadContextMappings(),
      adaptations: this.loadAdaptationMappings(),
      strategies: this.loadStrategyMappings()
    };
  },

  // 分析メソッド群
  identifyStakeholders(input) {
    const stakeholderPatterns = [
      /私|自分|個人/,
      /家族|両親|兄弟|姉妹|子供/,
      /友人|友達|仲間|知人/,
      /恋人|パートナー|配偶者/,
      /上司|部下|同僚|チーム/,
      /顧客|クライアント|お客様/,
      /専門家|医者|弁護士|コンサルタント/
    ];
    
    const stakeholders = [];
    stakeholderPatterns.forEach((pattern, index) => {
      if (pattern.test(input)) {
        stakeholders.push({
          type: this.getStakeholderType(index),
          relevance: this.calculateStakeholderRelevance(input, pattern)
        });
      }
    });
    
    return stakeholders;
  },

  getStakeholderType(index) {
    const types = [
      'self', 'family', 'friends', 'partner',
      'colleagues', 'clients', 'experts'
    ];
    return types[index] || 'unknown';
  },

  calculatePatternConfidence(pattern, input) {
    const matches = input.match(pattern);
    if (!matches) return 0;
    
    const matchCount = matches.length;
    const inputLength = input.length;
    const confidence = Math.min(matchCount / (inputLength / 100), 1.0);
    
    return confidence;
  },

  calculatePatternStrength(pattern, input) {
    const confidence = this.calculatePatternConfidence(pattern, input);
    const contextualRelevance = this.assessContextualRelevance(pattern, input);
    
    return (confidence + contextualRelevance) / 2;
  },

  assessContextualRelevance(pattern, input) {
    // パターンが文脈的にどの程度関連性があるかを評価
    const surroundingContext = this.extractSurroundingContext(pattern, input);
    const semanticRelevance = this.calculateSemanticRelevance(surroundingContext);
    
    return semanticRelevance;
  },

  generateHaQeiIntegrationStrategies(contextMapping, dynamicFactors) {
    const strategies = [];
    
    // 調和戦略（HaQei Philosophy）
    strategies.push({
      type: 'harmony',
      description: '状況の異なる要素間の調和を図る',
      actions: ['対立要素の統合', '異なる視点の受容', 'バランスの模索'],
      priority: 'high',
      philosophy: 'haqei-harmony'
    });
    
    // 変容戦略（HaQei Philosophy）
    strategies.push({
      type: 'transformation',
      description: '状況を通じた成長と変容を促進',
      actions: ['学習機会の活用', '視野の拡張', '価値観の深化'],
      priority: 'medium',
      philosophy: 'haqei-transformation'
    });
    
    // 統合戦略（HaQei Philosophy）
    strategies.push({
      type: 'integration',
      description: '分散した要素の統合的理解',
      actions: ['全体像の把握', '関連性の発見', '本質の洞察'],
      priority: 'medium',
      philosophy: 'haqei-integration'
    });
    
    return strategies;
  },

  // 公開API
  async analyzeSituationalContext(input, previousContext = {}) {
    if (!this.engineOS) {
      await this.init();
    }
    
    try {
      if (this.safeMode.active) {
        return this.safeMode.performBasicSituationalAnalysis(input);
      }
      
      const result = await this.engineOS.analyzeSituationalContext(input, previousContext);
      return this.interfaceOS.formatContextResult(result);
      
    } catch (error) {
      console.error('❌ Situational context analysis failed:', error);
      this.safeMode.activate();
      return this.safeMode.performBasicSituationalAnalysis(input);
    }
  },

  getContextCapabilities() {
    const capabilities = ['basic_situation_recognition', 'urgency_assessment'];
    
    if (this.contextFrameworks) {
      capabilities.push('advanced_situation_analysis', 'stakeholder_analysis', 'environmental_analysis');
    }
    
    if (this.situationalMappings) {
      capabilities.push('adaptation_strategies', 'haqei_integration', 'context_synthesis');
    }
    
    if (!this.safeMode.active) {
      capabilities.push('dynamic_adaptation', 'complex_context_mapping', 'philosophical_integration');
    }
    
    return capabilities;
  }
};

// 自動初期化
document.addEventListener('DOMContentLoaded', () => {
  window.SituationalContextEngine.init();
});

console.log('✅ SituationalContextEngine loaded successfully with HaQei Philosophy');