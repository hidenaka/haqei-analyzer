/**
 * HexagramDynamicMapper.js
 * 易経64卦動的マッピングシステム
 * 
 * 目的:
 * - 人格状態と易経64卦の動的な対応関係を計算
 * - bunenjin哲学と易経思想の統合的実装
 * - Triple OS Architectureと易経の変化哲学の融合
 * - 時間的変化を考慮した卦の遷移システム
 * 
 * 処理内容:
 * 1. 現在の人格状態から最適な卦の算出
 * 2. OS間の相互作用による卦の変化予測
 * 3. 時系列での卦の遷移パターン分析
 * 4. 象意と現実状況の動的マッピング
 * 
 * 前提条件:
 * - 易経64卦の基本データベース
 * - Triple OS Architectureの状態データ
 * - bunenjin哲学に基づく変化理論
 * 
 * 副作用:
 * - 卦の遷移履歴の記録
 * - 象意解釈の動的生成
 * - 変化パターンの学習と蓄積
 */

class HexagramDynamicMapper {
  constructor(hexagramData) {
    this.hexagramData = hexagramData || {};
    this.currentMapping = null;
    this.transitionHistory = [];
    this.dynamicWeights = {
      essence: 0.4,     // 本質的自己の重み
      social: 0.35,     // 社会的自己の重み
      defense: 0.25     // 防衛的自己の重み
    };
    
    // 易経の基本構造
    this.trigrams = {
      '111': { name: '乾', element: 'heaven', nature: 'creative', energy: 'yang' },
      '110': { name: '兌', element: 'lake', nature: 'joyful', energy: 'yang' },
      '101': { name: '離', element: 'fire', nature: 'clinging', energy: 'yang' },
      '100': { name: '震', element: 'thunder', nature: 'arousing', energy: 'yang' },
      '011': { name: '巽', element: 'wind', nature: 'gentle', energy: 'yin' },
      '010': { name: '坎', element: 'water', nature: 'abysmal', energy: 'yin' },
      '001': { name: '艮', element: 'mountain', nature: 'keeping_still', energy: 'yin' },
      '000': { name: '坤', element: 'earth', nature: 'receptive', energy: 'yin' }
    };
    
    // 変化パターンの定義
    this.changePatterns = {
      gradual: { rate: 0.1, stability: 0.8 },
      sudden: { rate: 0.7, stability: 0.2 },
      cyclical: { rate: 0.3, stability: 0.6 },
      transformative: { rate: 0.9, stability: 0.1 }
    };
    
    console.log('🔮 HexagramDynamicMapper initialized - 易経動的マッピングシステム');
  }

  /**
   * 現在の人格状態から最適な卦を動的に算出
   * 
   * 目的:
   * - Triple OSの状態を易経の卦に変換
   * - 複雑な人格特性を64卦の象意で表現
   * - 動的な状態変化を反映した卦の選択
   * 
   * @param {Object} personaState - 人格状態データ
   * @param {Object} contextualFactors - 文脈的要因
   * @returns {Object} 動的マッピング結果
   */
  async calculateDynamicHexagram(personaState, contextualFactors = {}) {
    try {
      console.log('🎯 Calculating dynamic hexagram mapping...');
      
      const mapping = {
        timestamp: new Date().toISOString(),
        inputState: personaState,
        context: contextualFactors,
        calculations: {},
        result: {}
      };
      
      // Phase 1: OS状態から三爻の組み合わせを計算
      const trigramMapping = this.calculateTrigramMapping(personaState);
      mapping.calculations.trigramMapping = trigramMapping;
      
      // Phase 2: 上卦・下卦の決定
      const upperTrigram = this.calculateUpperTrigram(personaState, contextualFactors);
      const lowerTrigram = this.calculateLowerTrigram(personaState, contextualFactors);
      
      mapping.calculations.upperTrigram = upperTrigram;
      mapping.calculations.lowerTrigram = lowerTrigram;
      
      // Phase 3: 64卦の特定
      const hexagramNumber = this.determineHexagramNumber(upperTrigram, lowerTrigram);
      const hexagramInfo = this.getHexagramInfo(hexagramNumber);
      
      mapping.result.hexagramNumber = hexagramNumber;
      mapping.result.hexagramInfo = hexagramInfo;
      mapping.result.upperTrigram = upperTrigram;
      mapping.result.lowerTrigram = lowerTrigram;
      
      // Phase 4: 動的象意の生成
      const dynamicSymbolism = await this.generateDynamicSymbolism(
        hexagramInfo, 
        personaState, 
        contextualFactors
      );
      mapping.result.dynamicSymbolism = dynamicSymbolism;
      
      // Phase 5: 変化の予測
      const changeProjection = this.projectHexagramChanges(mapping, personaState);
      mapping.result.changeProjection = changeProjection;
      
      // Phase 6: 履歴への記録
      this.recordMapping(mapping);
      this.currentMapping = mapping;
      
      console.log('✅ Dynamic hexagram calculated:', {
        hexagram: hexagramNumber,
        name: hexagramInfo.name,
        symbolism: dynamicSymbolism.primaryTheme
      });
      
      return mapping;
      
    } catch (error) {
      console.error('❌ Dynamic hexagram calculation failed:', error);
      return this.createFallbackMapping(personaState, error);
    }
  }

  /**
   * Triple OSから三爻マッピングを計算
   * 
   * @param {Object} personaState - 人格状態
   * @returns {Object} 三爻マッピング結果
   */
  calculateTrigramMapping(personaState) {
    const osActivations = {
      essence: personaState.essence?.activation || 0.5,
      social: personaState.social?.activation || 0.5,
      defense: personaState.defense?.activation || 0.5
    };
    
    const osInfluences = {
      essence: personaState.essence?.influence || 0.33,
      social: personaState.social?.influence || 0.33,
      defense: personaState.defense?.influence || 0.34
    };
    
    // 重み付けされた活性度の計算
    const weightedActivations = {
      essence: osActivations.essence * this.dynamicWeights.essence,
      social: osActivations.social * this.dynamicWeights.social,
      defense: osActivations.defense * this.dynamicWeights.defense
    };
    
    return {
      osActivations: osActivations,
      osInfluences: osInfluences,
      weightedActivations: weightedActivations,
      dominantOS: this.findDominantOS(weightedActivations),
      balanceIndex: this.calculateBalanceIndex(weightedActivations),
      yangYinBalance: this.calculateYangYinBalance(weightedActivations)
    };
  }

  /**
   * 上卦（外卦）の計算
   * 
   * @param {Object} personaState - 人格状態
   * @param {Object} contextualFactors - 文脈的要因
   * @returns {Object} 上卦情報
   */
  calculateUpperTrigram(personaState, contextualFactors) {
    // 上卦は主に外的表現・社会的側面・未来志向を表す
    const socialWeight = (personaState.social?.activation || 0.5) * 0.6;
    const essenceWeight = (personaState.essence?.activation || 0.5) * 0.3;
    const defenseWeight = (personaState.defense?.activation || 0.5) * 0.1;
    
    const compositeValue = socialWeight + essenceWeight + defenseWeight;
    const contextualAdjustment = this.getContextualAdjustment(contextualFactors, 'external');
    
    const adjustedValue = Math.max(0, Math.min(1, compositeValue + contextualAdjustment));
    const trigramBinary = this.valueToTrigramBinary(adjustedValue, 'upper');
    
    return {
      binary: trigramBinary,
      info: this.trigrams[trigramBinary],
      calculationValue: adjustedValue,
      weights: { social: socialWeight, essence: essenceWeight, defense: defenseWeight },
      contextualAdjustment: contextualAdjustment
    };
  }

  /**
   * 下卦（内卦）の計算
   * 
   * @param {Object} personaState - 人格状態  
   * @param {Object} contextualFactors - 文脈的要因
   * @returns {Object} 下卦情報
   */
  calculateLowerTrigram(personaState, contextualFactors) {
    // 下卦は主に内的本質・個人的側面・現在の状態を表す
    const essenceWeight = (personaState.essence?.activation || 0.5) * 0.5;
    const defenseWeight = (personaState.defense?.activation || 0.5) * 0.3;
    const socialWeight = (personaState.social?.activation || 0.5) * 0.2;
    
    const compositeValue = essenceWeight + defenseWeight + socialWeight;
    const contextualAdjustment = this.getContextualAdjustment(contextualFactors, 'internal');
    
    const adjustedValue = Math.max(0, Math.min(1, compositeValue + contextualAdjustment));
    const trigramBinary = this.valueToTrigramBinary(adjustedValue, 'lower');
    
    return {
      binary: trigramBinary,
      info: this.trigrams[trigramBinary],
      calculationValue: adjustedValue,
      weights: { essence: essenceWeight, defense: defenseWeight, social: socialWeight },
      contextualAdjustment: contextualAdjustment
    };
  }

  /**
   * 数値を三爻の二進表現に変換
   * 
   * @param {number} value - 0-1の数値
   * @param {string} position - 'upper' または 'lower'
   * @returns {string} 三爻の二進表現
   */
  valueToTrigramBinary(value, position) {
    // 0-1の値を8段階（000-111）に変換
    const step = 1 / 8;
    const index = Math.min(7, Math.floor(value / step));
    
    // 位置に応じた微調整（上卦は外向き、下卦は内向きの特性を反映）
    let adjustedIndex = index;
    if (position === 'upper') {
      // 上卦は陽の性質を強調（より積極的・外向的）
      adjustedIndex = Math.min(7, index + (value > 0.6 ? 1 : 0));
    } else {
      // 下卦は陰の性質を尊重（より内向的・慎重）
      adjustedIndex = Math.max(0, index - (value < 0.4 ? 1 : 0));
    }
    
    return adjustedIndex.toString(2).padStart(3, '0');
  }

  /**
   * 上卦・下卦から64卦番号を決定
   * 
   * @param {Object} upperTrigram - 上卦情報
   * @param {Object} lowerTrigram - 下卦情報
   * @returns {number} 64卦番号
   */
  determineHexagramNumber(upperTrigram, lowerTrigram) {
    const trigramOrder = ['111', '110', '101', '100', '011', '010', '001', '000'];
    
    const upperIndex = trigramOrder.indexOf(upperTrigram.binary);
    const lowerIndex = trigramOrder.indexOf(lowerTrigram.binary);
    
    // 64卦マトリクスでの位置計算
    const hexagramNumber = upperIndex * 8 + lowerIndex + 1;
    
    return hexagramNumber;
  }

  /**
   * 卦番号から卦情報を取得
   * 
   * @param {number} hexagramNumber - 卦番号
   * @returns {Object} 卦情報
   */
  getHexagramInfo(hexagramNumber) {
    // 基本的な64卦情報（簡略版）
    const basicHexagrams = {
      1: { name: '乾', reading: 'qián', meaning: '創作', nature: 'creative_heaven' },
      2: { name: '坤', reading: 'kūn', meaning: '従順', nature: 'receptive_earth' },
      3: { name: '屯', reading: 'zhūn', meaning: '初心', nature: 'difficulty_beginning' },
      4: { name: '蒙', reading: 'méng', meaning: '学習', nature: 'youthful_folly' },
      5: { name: '需', reading: 'xū', meaning: '待機', nature: 'waiting' },
      6: { name: '訟', reading: 'sòng', meaning: '争い', nature: 'conflict' },
      7: { name: '師', reading: 'shī', meaning: '組織', nature: 'army' },
      8: { name: '比', reading: 'bǐ', meaning: '親和', nature: 'holding_together' }
      // ... 他の56卦は省略（実際の実装では全64卦を含める）
    };
    
    const hexagram = basicHexagrams[hexagramNumber] || {
      name: '未定義',
      reading: 'unknown', 
      meaning: '未知',
      nature: 'undefined'
    };
    
    return {
      number: hexagramNumber,
      ...hexagram,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 動的象意の生成
   * 
   * @param {Object} hexagramInfo - 卦情報
   * @param {Object} personaState - 人格状態
   * @param {Object} contextualFactors - 文脈的要因
   * @returns {Object} 動的象意
   */
  async generateDynamicSymbolism(hexagramInfo, personaState, contextualFactors) {
    const symbolism = {
      primaryTheme: this.generatePrimaryTheme(hexagramInfo, personaState),
      personalInterpretation: this.generatePersonalInterpretation(hexagramInfo, personaState),
      situationalGuidance: this.generateSituationalGuidance(hexagramInfo, contextualFactors),
      changeIndications: this.generateChangeIndications(hexagramInfo, personaState),
      practicalApplications: this.generatePracticalApplications(hexagramInfo, personaState)
    };
    
    return symbolism;
  }

  /**
   * 卦の変化予測
   * 
   * @param {Object} currentMapping - 現在のマッピング
   * @param {Object} personaState - 人格状態
   * @returns {Object} 変化予測
   */
  projectHexagramChanges(currentMapping, personaState) {
    const projection = {
      currentStability: this.calculateCurrentStability(personaState),
      changePattern: this.identifyChangePattern(currentMapping),
      probableTransitions: this.calculateProbableTransitions(currentMapping),
      timeframe: this.estimateChangeTimeframe(currentMapping),
      triggeringFactors: this.identifyTriggeringFactors(personaState)
    };
    
    return projection;
  }

  /**
   * ヘルパーメソッド群
   */
  findDominantOS(weightedActivations) {
    return Object.entries(weightedActivations)
      .sort(([,a], [,b]) => b - a)[0][0];
  }

  calculateBalanceIndex(weightedActivations) {
    const values = Object.values(weightedActivations);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return 1 - Math.sqrt(variance); // 0-1, 1が最もバランス良い
  }

  calculateYangYinBalance(weightedActivations) {
    const yangElements = weightedActivations.essence * 0.8 + weightedActivations.social * 0.6;
    const yinElements = weightedActivations.defense * 0.8 + weightedActivations.social * 0.4;
    
    const total = yangElements + yinElements;
    return {
      yang: yangElements / total,
      yin: yinElements / total,
      balance: Math.min(yangElements, yinElements) / Math.max(yangElements, yinElements)
    };
  }

  getContextualAdjustment(contextualFactors, type) {
    if (!contextualFactors) return 0;
    
    let adjustment = 0;
    
    if (contextualFactors.stress) {
      adjustment += type === 'external' ? 0.1 : -0.1;
    }
    
    if (contextualFactors.creativity) {
      adjustment += type === 'internal' ? 0.15 : 0.05;
    }
    
    if (contextualFactors.social_pressure) {
      adjustment += type === 'external' ? 0.2 : -0.05;
    }
    
    return Math.max(-0.3, Math.min(0.3, adjustment));
  }

  generatePrimaryTheme(hexagramInfo, personaState) {
    const themes = {
      'creative_heaven': '創造的な力と可能性の展開',
      'receptive_earth': '受容性と育成の智慧',
      'difficulty_beginning': '新たな始まりでの困難と成長',
      'youthful_folly': '学習と発見の過程',
      'waiting': '適切な時機を待つ智慧',
      'conflict': '内的対立と調和への道',
      'army': '組織力と統制の必要性',
      'holding_together': '結束と協力の価値'
    };
    
    return themes[hexagramInfo.nature] || `${hexagramInfo.name}の智慧による人格の調和`;
  }

  generatePersonalInterpretation(hexagramInfo, personaState) {
    const dominantOS = this.findDominantOS({
      essence: personaState.essence?.activation || 0.5,
      social: personaState.social?.activation || 0.5,
      defense: personaState.defense?.activation || 0.5
    });
    
    const interpretations = {
      essence: `${hexagramInfo.name}は、本質的な価値観と創造性の発展を示唆しています。`,
      social: `${hexagramInfo.name}は、人間関係と社会的調和における成長を意味します。`,
      defense: `${hexagramInfo.name}は、慎重な判断と安定性の重要性を教えています。`
    };
    
    return interpretations[dominantOS] || `${hexagramInfo.name}は、バランスの取れた発展を示しています。`;
  }

  generateSituationalGuidance(hexagramInfo, contextualFactors) {
    return `現在の状況において、${hexagramInfo.name}の象意は適応と調和を促しています。`;
  }

  generateChangeIndications(hexagramInfo, personaState) {
    return [
      `${hexagramInfo.name}による変化の兆し`,
      '内的バランスの調整期',
      '新たな可能性への開花'
    ];
  }

  generatePracticalApplications(hexagramInfo, personaState) {
    return [
      '日常での意識的な選択',
      '人間関係での調和の実践',
      '長期的視点での計画立案'
    ];
  }

  calculateCurrentStability(personaState) {
    const stabilities = [
      personaState.essence?.stability || 0.8,
      personaState.social?.stability || 0.8,
      personaState.defense?.stability || 0.8
    ];
    
    return stabilities.reduce((a, b) => a + b, 0) / stabilities.length;
  }

  identifyChangePattern(currentMapping) {
    // 前回のマッピングとの比較による変化パターンの特定
    if (this.transitionHistory.length === 0) {
      return this.changePatterns.gradual;
    }
    
    const lastMapping = this.transitionHistory[this.transitionHistory.length - 1];
    const hexagramDifference = Math.abs(
      currentMapping.result.hexagramNumber - lastMapping.result.hexagramNumber
    );
    
    if (hexagramDifference > 30) return this.changePatterns.transformative;
    if (hexagramDifference > 15) return this.changePatterns.sudden;
    if (hexagramDifference > 5) return this.changePatterns.cyclical;
    return this.changePatterns.gradual;
  }

  calculateProbableTransitions(currentMapping) {
    const currentHexagram = currentMapping.result.hexagramNumber;
    const adjacentHexagrams = this.calculateAdjacentHexagrams(currentHexagram);
    
    return adjacentHexagrams.map(hexNum => ({
      hexagramNumber: hexNum,
      hexagramInfo: this.getHexagramInfo(hexNum),
      probability: this.calculateTransitionProbability(currentHexagram, hexNum)
    }));
  }

  calculateAdjacentHexagrams(hexagramNumber) {
    // 简化版：周辺の卦を算出
    const adjacent = [];
    for (let i = -2; i <= 2; i++) {
      if (i !== 0) {
        const adjNum = hexagramNumber + i;
        if (adjNum >= 1 && adjNum <= 64) {
          adjacent.push(adjNum);
        }
      }
    }
    return adjacent;
  }

  calculateTransitionProbability(fromHexagram, toHexagram) {
    const distance = Math.abs(toHexagram - fromHexagram);
    return Math.max(0.1, 1 - (distance / 32)); // 距離に基づく確率
  }

  estimateChangeTimeframe(currentMapping) {
    const stability = this.calculateCurrentStability(currentMapping.inputState);
    const changePattern = this.identifyChangePattern(currentMapping);
    
    const baseTimeframe = {
      gradual: { min: 30, max: 90 }, // 日
      sudden: { min: 1, max: 7 },
      cyclical: { min: 14, max: 30 },
      transformative: { min: 3, max: 21 }
    };
    
    const pattern = baseTimeframe[changePattern.rate > 0.5 ? 'sudden' : 'gradual'];
    const stabilityAdjustment = stability * 0.5;
    
    return {
      min: Math.round(pattern.min * (1 + stabilityAdjustment)),
      max: Math.round(pattern.max * (1 + stabilityAdjustment)),
      unit: 'days'
    };
  }

  identifyTriggeringFactors(personaState) {
    const factors = [];
    
    if ((personaState.essence?.activation || 0.5) > 0.8) {
      factors.push('創造的エネルギーの高まり');
    }
    
    if ((personaState.social?.activation || 0.5) > 0.8) {
      factors.push('社会的関与の増加');
    }
    
    if ((personaState.defense?.activation || 0.5) > 0.8) {
      factors.push('防衛的意識の強化');
    }
    
    return factors.length > 0 ? factors : ['内的バランスの自然な調整'];
  }

  recordMapping(mapping) {
    this.transitionHistory.push({
      timestamp: mapping.timestamp,
      hexagramNumber: mapping.result.hexagramNumber,
      result: mapping.result
    });
    
    // 履歴サイズ制限
    if (this.transitionHistory.length > 50) {
      this.transitionHistory.shift();
    }
  }

  createFallbackMapping(personaState, error) {
    return {
      timestamp: new Date().toISOString(),
      inputState: personaState,
      error: error.message,
      fallback: true,
      result: {
        hexagramNumber: 1, // 乾為天（創造的な力）をデフォルト
        hexagramInfo: this.getHexagramInfo(1),
        dynamicSymbolism: {
          primaryTheme: '創造的可能性への開放',
          personalInterpretation: 'エラーが発生しましたが、新たな始まりの機会として捉えることができます。'
        }
      }
    };
  }

  /**
   * 公開API：現在のマッピング取得
   */
  getCurrentMapping() {
    return this.currentMapping;
  }

  /**
   * 公開API：遷移履歴取得
   */
  getTransitionHistory() {
    return [...this.transitionHistory];
  }

  /**
   * 公開API：特定の卦情報取得
   */
  getHexagramDetails(hexagramNumber) {
    return this.getHexagramInfo(hexagramNumber);
  }
}

// グローバル登録
if (typeof window !== 'undefined') {
  window.HexagramDynamicMapper = HexagramDynamicMapper;
}

console.log('🔮 HexagramDynamicMapper loaded - 易経64卦動的マッピングシステム');