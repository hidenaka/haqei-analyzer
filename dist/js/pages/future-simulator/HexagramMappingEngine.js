/**
 * Hexagram Mapping Engine - HaQei Philosophy Implementation
 * Triple OS Architecture: I Ching Integration Layer
 * 
 * 卦象マッピングエンジン
 * - 易経64卦システム統合
 * - HaQei哲学による卦象解釈
 * - 動的卦象変換システム
 */

console.log('☯️ HexagramMappingEngine Loading...');

window.HexagramMappingEngine = {
  // Triple OS Architecture準拠の初期化
  init() {
    console.log('🔧 HexagramMappingEngine initializing...');
    this.setupTripleOS();
    this.initializeHexagramDatabase();
    this.loadTrigramMappings();
    console.log('✅ HexagramMappingEngine initialized successfully');
  },

  // Triple OS Architecture セットアップ
  setupTripleOS() {
    // Engine OS (Core Hexagram Logic)
    this.engineOS = {
      name: 'Hexagram Mapping Engine OS',
      version: '1.0.0',
      philosophy: 'haqei-iching',
      
      async mapToHexagram(input, context = {}) {
        try {
          const textualAnalysis = this.analyzeTextForHexagram(input);
          const contextualMapping = await this.mapContextToTrigrams(textualAnalysis, context);
          const hexagramConstruction = this.constructHexagram(contextualMapping);
          const hexagramInterpretation = await this.interpretHexagram(hexagramConstruction, context);
          const changeAnalysis = this.analyzeChanges(hexagramConstruction, hexagramInterpretation);
          const wisdom = this.extractWisdom(hexagramInterpretation, changeAnalysis);
          
          return {
            input: input,
            analysis: textualAnalysis,
            mapping: contextualMapping,
            hexagram: hexagramConstruction,
            interpretation: hexagramInterpretation,
            changes: changeAnalysis,
            wisdom: wisdom,
            metadata: {
              mappingConfidence: this.calculateMappingConfidence(contextualMapping),
              interpretationDepth: this.calculateInterpretationDepth(hexagramInterpretation),
              wisdomRelevance: this.calculateWisdomRelevance(wisdom, input),
              philosophy: 'haqei-iching'
            }
          };
          
        } catch (error) {
          console.warn('⚠️ Hexagram mapping error:', error);
          return this.createFallbackHexagram(input);
        }
      },
      
      analyzeTextForHexagram(input) {
        const elements = this.identifyElementalQualities(input);
        const forces = this.identifyForces(input);
        const directions = this.identifyDirections(input);
        const qualities = this.identifyQualities(input);
        const relationships = this.identifyRelationships(input);
        const temporality = this.identifyTemporality(input);
        
        return {
          elements: elements,
          forces: forces,
          directions: directions,
          qualities: qualities,
          relationships: relationships,
          temporality: temporality,
          dominantThemes: this.extractDominantThemes(elements, forces, directions, qualities)
        };
      },
      
      identifyElementalQualities(input) {
        const elementalPatterns = {
          earth: {
            pattern: /安定|基盤|基礎|土台|支える|堅実|実用|物質|現実/,
            qualities: ['stability', 'foundation', 'practicality', 'nurturing']
          },
          water: {
            pattern: /流れ|変化|適応|柔軟|深い|感情|直感|流動|浸透/,
            qualities: ['flow', 'adaptability', 'depth', 'intuition']
          },
          fire: {
            pattern: /情熱|エネルギー|明るい|活動|創造|変革|光|熱|積極/,
            qualities: ['passion', 'energy', 'illumination', 'transformation']
          },
          air: {
            pattern: /思考|コミュニケーション|軽やか|自由|知性|移動|風|呼吸/,
            qualities: ['thought', 'communication', 'freedom', 'intellect']
          },
          wood: {
            pattern: /成長|発展|拡張|生命力|春|若い|新しい|芽/,
            qualities: ['growth', 'expansion', 'vitality', 'renewal']
          },
          metal: {
            pattern: /精密|厳格|収束|秋|熟成|完成|鋭い|切る/,
            qualities: ['precision', 'discipline', 'refinement', 'completion']
          }
        };
        
        const detectedElements = [];
        Object.entries(elementalPatterns).forEach(([element, config]) => {
          if (config.pattern.test(input)) {
            detectedElements.push({
              element: element,
              strength: this.calculateElementalStrength(config.pattern, input),
              qualities: config.qualities
            });
          }
        });
        
        return detectedElements.sort((a, b) => b.strength - a.strength);
      },
      
      identifyForces(input) {
        const forcePatterns = {
          yang: {
            pattern: /積極|能動|外向|明るい|強い|上昇|進む|攻撃|創造|男性/,
            intensity: this.calculateYangIntensity(input)
          },
          yin: {
            pattern: /受動|内向|暗い|柔らかい|下降|待つ|守る|受容|女性|静か/,
            intensity: this.calculateYinIntensity(input)
          }
        };
        
        const detectedForces = [];
        Object.entries(forcePatterns).forEach(([force, config]) => {
          if (config.pattern.test(input)) {
            detectedForces.push({
              force: force,
              intensity: config.intensity,
              manifestations: this.extractForceManifestations(config.pattern, input)
            });
          }
        });
        
        return detectedForces;
      },
      
      identifyDirections(input) {
        const directionPatterns = {
          ascending: /上昇|向上|成長|発展|昇進|進歩|高い|上がる/,
          descending: /下降|沈下|減少|衰退|落ちる|下がる|低い/,
          expanding: /拡大|広がる|増大|発散|外へ|大きく|広く/,
          contracting: /収縮|狭まる|減少|収束|内へ|小さく|狭く/,
          forward: /前進|進む|未来|将来|先へ|次へ|前向き/,
          backward: /後退|戻る|過去|以前|後ろへ|昔へ|振り返る/
        };
        
        const detectedDirections = [];
        Object.entries(directionPatterns).forEach(([direction, pattern]) => {
          if (pattern.test(input)) {
            detectedDirections.push({
              direction: direction,
              strength: this.calculateDirectionalStrength(pattern, input),
              implications: this.deriveDirectionalImplications(direction)
            });
          }
        });
        
        return detectedDirections;
      },
      
      identifyQualities(input) {
        const qualityPatterns = {
          creative: /創造|新しい|革新|アイデア|発明|独創|オリジナル/,
          receptive: /受容|包容|理解|共感|聞く|受け入れる|優しい/,
          dynamic: /動的|活動|エネルギッシュ|活発|積極|躍動/,
          stable: /安定|不変|持続|継続|一定|変わらない|堅固/,
          harmonious: /調和|バランス|平衡|協調|統合|融合/,
          conflicted: /対立|矛盾|葛藤|衝突|分裂|混乱|不調和/
        };
        
        const detectedQualities = [];
        Object.entries(qualityPatterns).forEach(([quality, pattern]) => {
          if (pattern.test(input)) {
            detectedQualities.push({
              quality: quality,
              intensity: this.calculateQualityIntensity(pattern, input),
              context: this.extractQualityContext(pattern, input)
            });
          }
        });
        
        return detectedQualities;
      },
      
      async mapContextToTrigrams(analysis, context) {
        const upperTrigram = this.determineUpperTrigram(analysis, context);
        const lowerTrigram = this.determineLowerTrigram(analysis, context);
        
        const trigramInteraction = this.analyzeTrigramInteraction(upperTrigram, lowerTrigram);
        const cosmicAlignment = this.assessCosmicAlignment(upperTrigram, lowerTrigram);
        
        return {
          upper: upperTrigram,
          lower: lowerTrigram,
          interaction: trigramInteraction,
          alignment: cosmicAlignment,
          stability: this.calculateTrigramStability(upperTrigram, lowerTrigram),
          potential: this.assessTransformationPotential(upperTrigram, lowerTrigram)
        };
      },
      
      determineUpperTrigram(analysis, context) {
        // 上卦は外部的・未来的・天的要素を反映
        const candidates = [];
        
        // 元素的分析から
        if (analysis.elements.length > 0) {
          const primaryElement = analysis.elements[0];
          candidates.push(...this.getTrigramsForElement(primaryElement.element, 'upper'));
        }
        
        // 方向性分析から
        if (analysis.directions.length > 0) {
          const primaryDirection = analysis.directions[0];
          candidates.push(...this.getTrigramsForDirection(primaryDirection.direction, 'upper'));
        }
        
        // 質的分析から
        if (analysis.qualities.length > 0) {
          const primaryQuality = analysis.qualities[0];
          candidates.push(...this.getTrigramsForQuality(primaryQuality.quality, 'upper'));
        }
        
        return this.selectOptimalTrigram(candidates, 'upper');
      },
      
      determineLowerTrigram(analysis, context) {
        // 下卦は内部的・現在的・地的要素を反映
        const candidates = [];
        
        // 元素的分析から（2番目以降）
        if (analysis.elements.length > 1) {
          const secondaryElement = analysis.elements[1];
          candidates.push(...this.getTrigramsForElement(secondaryElement.element, 'lower'));
        }
        
        // 関係性分析から
        if (analysis.relationships.length > 0) {
          const primaryRelation = analysis.relationships[0];
          candidates.push(...this.getTrigramsForRelationship(primaryRelation, 'lower'));
        }
        
        // 力の分析から
        if (analysis.forces.length > 0) {
          const primaryForce = analysis.forces[0];
          candidates.push(...this.getTrigramsForForce(primaryForce.force, 'lower'));
        }
        
        return this.selectOptimalTrigram(candidates, 'lower');
      },
      
      constructHexagram(contextualMapping) {
        const upperTrigram = contextualMapping.upper;
        const lowerTrigram = contextualMapping.lower;
        
        const hexagramNumber = this.getHexagramNumber(upperTrigram.name, lowerTrigram.name);
        const hexagramName = this.getHexagramName(hexagramNumber);
        const hexagramStructure = this.getHexagramStructure(hexagramNumber);
        
        return {
          number: hexagramNumber,
          name: hexagramName,
          chinese: this.getHexagramChinese(hexagramNumber),
          structure: hexagramStructure,
          upperTrigram: upperTrigram,
          lowerTrigram: lowerTrigram,
          lines: this.generateHexagramLines(hexagramStructure),
          changingLines: this.identifyChangingLines(contextualMapping)
        };
      },
      
      async interpretHexagram(hexagramConstruction, context) {
        const basicInterpretation = this.getBasicInterpretation(hexagramConstruction.number);
        const contextualInterpretation = await this.generateContextualInterpretation(hexagramConstruction, context);
        const lineInterpretations = this.interpretLines(hexagramConstruction.lines, hexagramConstruction.changingLines);
        const trigramInterplay = this.interpretTrigramInterplay(hexagramConstruction.upperTrigram, hexagramConstruction.lowerTrigram);
        
        return {
          basic: basicInterpretation,
          contextual: contextualInterpretation,
          lines: lineInterpretations,
          trigrams: trigramInterplay,
          timing: this.interpretTiming(hexagramConstruction),
          guidance: this.generateGuidance(hexagramConstruction, context),
          philosophy: this.extractPhilosophicalMeaning(hexagramConstruction)
        };
      },
      
      analyzeChanges(hexagramConstruction, interpretation) {
        const changingLines = hexagramConstruction.changingLines;
        const futureHexagram = this.calculateFutureHexagram(hexagramConstruction, changingLines);
        const transformation = this.analyzeTransformation(hexagramConstruction, futureHexagram);
        const transitionGuidance = this.generateTransitionGuidance(transformation);
        
        return {
          present: hexagramConstruction,
          future: futureHexagram,
          transformation: transformation,
          guidance: transitionGuidance,
          timing: this.assessTransitionTiming(transformation),
          challenges: this.identifyTransitionChallenges(transformation),
          opportunities: this.identifyTransitionOpportunities(transformation)
        };
      },
      
      extractWisdom(interpretation, changeAnalysis) {
        const traditionalWisdom = this.extractTraditionalWisdom(interpretation.basic);
        const contextualWisdom = this.extractContextualWisdom(interpretation.contextual);
        const transformationalWisdom = this.extractTransformationalWisdom(changeAnalysis);
        const haqeiWisdom = this.generateHaQeiWisdom(interpretation, changeAnalysis);
        
        return {
          traditional: traditionalWisdom,
          contextual: contextualWisdom,
          transformational: transformationalWisdom,
          haqei: haqeiWisdom,
          synthesis: this.synthesizeWisdom(traditionalWisdom, contextualWisdom, transformationalWisdom, haqeiWisdom),
          applicability: this.assessWisdomApplicability(interpretation, changeAnalysis)
        };
      }
    };

    // Interface OS (I Ching Presentation Layer)
    this.interfaceOS = {
      name: 'Hexagram Mapping Interface OS',
      
      formatMappingResult(result) {
        return {
          overview: this.createHexagramOverview(result),
          hexagram: this.formatHexagram(result.hexagram),
          interpretation: this.formatInterpretation(result.interpretation),
          changes: this.formatChanges(result.changes),
          wisdom: this.formatWisdom(result.wisdom),
          guidance: this.generatePracticalGuidance(result),
          visualizations: this.generateVisualizationSpecs(result),
          philosophy: result.metadata.philosophy
        };
      },
      
      createHexagramOverview(result) {
        return {
          title: `${result.hexagram.name} (${result.hexagram.chinese})`,
          number: result.hexagram.number,
          essence: this.extractHexagramEssence(result.interpretation),
          keyMessage: this.extractKeyMessage(result.wisdom),
          actionGuidance: this.extractActionGuidance(result.interpretation.guidance),
          timing: this.formatTiming(result.interpretation.timing),
          confidence: this.formatPercentage(result.metadata.mappingConfidence)
        };
      },
      
      formatHexagram(hexagram) {
        return {
          structure: this.formatHexagramStructure(hexagram.structure),
          trigrams: {
            upper: this.formatTrigram(hexagram.upperTrigram),
            lower: this.formatTrigram(hexagram.lowerTrigram)
          },
          lines: hexagram.lines.map((line, index) => ({
            position: index + 1,
            type: line.type,
            changing: hexagram.changingLines.includes(index),
            meaning: this.getLineMeaning(line, index)
          })),
          symbolism: this.extractHexagramSymbolism(hexagram)
        };
      },
      
      generateVisualizationSpecs(result) {
        return {
          hexagramDiagram: this.createHexagramDiagramSpec(result.hexagram),
          trigramWheel: this.createTrigramWheelSpec(result.hexagram),
          changeTransition: this.createChangeTransitionSpec(result.changes),
          wisdomMandala: this.createWisdomMandalaSpec(result.wisdom),
          guidanceCompass: this.createGuidanceCompassSpec(result.interpretation.guidance)
        };
      }
    };

    // Safe Mode OS (Simple I Ching Layer)
    this.safeMode = {
      name: 'Hexagram Mapping Safe Mode OS',
      active: false,
      
      activate() {
        console.log('🛡️ HexagramMappingEngine Safe Mode activated');
        this.active = true;
        
        return {
          basicHexagramMapping: true,
          advancedFeatures: false,
          philosophy: 'haqei-safe'
        };
      },
      
      performBasicHexagramMapping(input) {
        const randomHexagram = this.generateRandomHexagram();
        const basicInterpretation = this.getBasicHexagramMeaning(randomHexagram);
        
        return {
          input: input,
          hexagram: {
            number: randomHexagram,
            name: this.getSimpleHexagramName(randomHexagram),
            structure: this.getSimpleHexagramStructure(randomHexagram)
          },
          interpretation: {
            basic: basicInterpretation,
            guidance: '現在の状況を静かに観察し、自然な流れに従うことをお勧めします。'
          },
          wisdom: {
            essence: '易経は変化の書です。すべては流れており、適切な時に適切な行動を取ることが重要です。'
          },
          metadata: {
            mappingConfidence: 0.5,
            interpretationDepth: 0.3,
            wisdomRelevance: 0.4,
            philosophy: 'haqei-safe'
          }
        };
      }
    };
  },

  // 初期化メソッド群
  initializeHexagramDatabase() {
    this.hexagramDatabase = {
      hexagrams: this.loadHexagramData(),
      trigrams: this.loadTrigramData(),
      lines: this.loadLineData(),
      interpretations: this.loadInterpretationData()
    };
  },

  loadHexagramData() {
    return {
      1: { name: '乾', chinese: '乾為天', element: 'heaven', quality: 'creative' },
      2: { name: '坤', chinese: '坤為地', element: 'earth', quality: 'receptive' },
      3: { name: '屯', chinese: '水雷屯', element: 'thunder', quality: 'difficulty' },
      4: { name: '蒙', chinese: '山水蒙', element: 'mountain', quality: 'youthful' },
      5: { name: '需', chinese: '水天需', element: 'water', quality: 'waiting' },
      6: { name: '訟', chinese: '天水訟', element: 'heaven', quality: 'conflict' },
      7: { name: '師', chinese: '地水師', element: 'earth', quality: 'army' },
      8: { name: '比', chinese: '水地比', element: 'water', quality: 'union' }
      // ... 64卦の完全なデータベース
    };
  },

  loadTrigramData() {
    return {
      'qian': { name: '乾', element: 'heaven', qualities: ['strong', 'creative', 'active'] },
      'kun': { name: '坤', element: 'earth', qualities: ['receptive', 'gentle', 'yielding'] },
      'zhen': { name: '震', element: 'thunder', qualities: ['arousing', 'movement', 'initiative'] },
      'xun': { name: '巽', element: 'wind', qualities: ['gentle', 'penetrating', 'flexible'] },
      'kan': { name: '坎', element: 'water', qualities: ['dangerous', 'deep', 'flowing'] },
      'li': { name: '離', element: 'fire', qualities: ['clinging', 'bright', 'beautiful'] },
      'gen': { name: '艮', element: 'mountain', qualities: ['keeping-still', 'meditation', 'boundaries'] },
      'dui': { name: '兌', element: 'lake', qualities: ['joyous', 'serene', 'pleasing'] }
    };
  },

  // 分析メソッド群
  getTrigramsForElement(element, position) {
    const elementTrigramMap = {
      earth: position === 'upper' ? ['gen', 'kun'] : ['kun', 'gen'],
      water: position === 'upper' ? ['kan', 'dui'] : ['kan', 'dui'],
      fire: position === 'upper' ? ['li', 'qian'] : ['li', 'zhen'],
      air: position === 'upper' ? ['xun', 'dui'] : ['xun', 'qian'],
      wood: position === 'upper' ? ['zhen', 'xun'] : ['zhen', 'xun'],
      metal: position === 'upper' ? ['qian', 'dui'] : ['dui', 'qian']
    };
    
    return elementTrigramMap[element] || ['kun'];
  },

  selectOptimalTrigram(candidates, position) {
    if (candidates.length === 0) {
      return { name: 'kun', confidence: 0.3 }; // デフォルト
    }
    
    // 候補の中から最適な三爻を選択
    const scored = candidates.map(trigram => ({
      trigram: trigram,
      score: this.scoreTrigramCandidate(trigram, position)
    }));
    
    scored.sort((a, b) => b.score - a.score);
    
    return {
      name: scored[0].trigram,
      confidence: scored[0].score,
      alternatives: scored.slice(1, 3).map(s => s.trigram)
    };
  },

  getHexagramNumber(upperTrigram, lowerTrigram) {
    const trigramToNumber = {
      'qian': 1, 'dui': 2, 'li': 3, 'zhen': 4,
      'xun': 5, 'kan': 6, 'gen': 7, 'kun': 8
    };
    
    const upper = trigramToNumber[upperTrigram] || 8;
    const lower = trigramToNumber[lowerTrigram] || 8;
    
    // 簡易的な卦番号計算（実際はより複雑な対応表が必要）
    return ((upper - 1) * 8 + lower);
  },

  generateHaQeiWisdom(interpretation, changeAnalysis) {
    const wisdom = [];
    
    // HaQei哲学的洞察
    wisdom.push({
      principle: '調和の追求',
      insight: '対立する要素の中に調和の可能性を見出すことで、より深い理解と成長が得られる',
      application: '現在の状況で対立している要素を特定し、それらを統合する方法を探る'
    });
    
    wisdom.push({
      principle: '変化の受容',
      insight: '変化は成長の機会であり、抵抗するのではなく、流れに沿って適応することが重要',
      application: '変化を恐れず、その中に含まれる学習と発展の機会を積極的に活用する'
    });
    
    wisdom.push({
      principle: '統合的理解',
      insight: '部分的な見方を超えて、全体的な文脈の中で状況を理解することで真の知恵が得られる',
      application: '現在の問題を孤立して見るのではなく、より大きな人生の流れの中で位置づける'
    });
    
    return wisdom;
  },

  // 公開API
  async mapToHexagram(input, context = {}) {
    if (!this.engineOS) {
      await this.init();
    }
    
    try {
      if (this.safeMode.active) {
        return this.safeMode.performBasicHexagramMapping(input);
      }
      
      const result = await this.engineOS.mapToHexagram(input, context);
      return this.interfaceOS.formatMappingResult(result);
      
    } catch (error) {
      console.error('❌ Hexagram mapping failed:', error);
      this.safeMode.activate();
      return this.safeMode.performBasicHexagramMapping(input);
    }
  },

  getHexagramCapabilities() {
    const capabilities = ['basic_hexagram_generation', 'simple_interpretation'];
    
    if (this.hexagramDatabase) {
      capabilities.push('advanced_mapping', 'trigram_analysis', 'line_interpretation');
    }
    
    if (!this.safeMode.active) {
      capabilities.push('contextual_interpretation', 'change_analysis', 'haqei_wisdom');
    }
    
    return capabilities;
  }
};

// 自動初期化
document.addEventListener('DOMContentLoaded', () => {
  window.HexagramMappingEngine.init();
});

console.log('✅ HexagramMappingEngine loaded successfully with HaQei Philosophy');