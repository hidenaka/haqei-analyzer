/**
 * 易経マッピングエンジン - 状況卦精度向上システム Phase 2.5
 * 
 * 目的：
 * - 仮想状況推定結果を適切な易経の卦と爻にマッピング
 * - 64卦データベースとの高精度マッチング処理
 * - 386爻システム（H384_DATA）との統合分析
 * - 状況特性と易経原理の論理的対応付け
 * 
 * 入力：
 * - situationalResult: object - Phase 2からの仮想状況推定結果
 * - userProfile: object - ユーザープロファイル情報
 * - mappingOptions: object - マッピング設定オプション
 * 
 * 処理内容：
 * 1. 状況特性分析（時間軸・関係性・環境要因の卦的解釈）
 * 2. 卦選択アルゴリズム（64卦との特性マッチング）
 * 3. 爻特定システム（386爻データベースとの詳細マッピング）
 * 4. 変卦分析（状況変化の予測と対応卦）
 * 5. マッピング信頼度評価
 * 6. 易経解釈準備（メタファー生成用データ構築）
 * 
 * 出力：
 * - primaryHexagram: object - 主要卦情報
 * - selectedLine: object - 選択された爻情報
 * - changingHexagram: object - 変卦情報（変化予測）
 * - mappingConfidence: number - マッピング信頼度
 * - situationalAlignment: object - 状況と卦の対応分析
 * - interpretationData: object - メタファー生成用データ
 * - recommendedActions: Array - 推奨行動指針
 * 
 * 副作用：
 * - マッピングパターンの学習
 * - 卦選択精度の継続的改善
 * 
 * 前提条件：
 * - hexagrams_master データが利用可能
 * - H384_DATA（386爻データベース）が利用可能
 * - SituationalContextEngine の結果が入力される
 * 
 * エラー処理：
 * - 各マッピング層での例外ハンドリング
 * - データ不整合時のフォールバック処理
 * - 信頼度による結果検証
 */
class HexagramMappingEngine {
  constructor() {
    this.hexagramsData = null;
    this.h384Data = null;
    this.mappingHistory = [];
    this.confidenceThreshold = 0.7;
    
    // マッピング精度パラメータ
    this.temporalWeight = 1.3;
    this.relationshipWeight = 1.5;
    this.environmentalWeight = 1.2;
    this.emotionalWeight = 1.4;
    
    // 状況→卦マッピングルール
    this.situationToHexagramRules = {
      // 時間軸パターン
      'immediate_present': { emphasis: 'current_action', hexagram_bias: [1, 2, 51, 57] },
      'recent_past': { emphasis: 'reflection', hexagram_bias: [52, 20, 41, 42] },
      'near_future': { emphasis: 'preparation', hexagram_bias: [3, 5, 62, 61] },
      'ongoing': { emphasis: 'persistence', hexagram_bias: [32, 43, 44, 1] },
      
      // 人物関係パターン
      'family': { emphasis: 'harmony', hexagram_bias: [37, 11, 19, 46] },
      'work': { emphasis: 'achievement', hexagram_bias: [14, 34, 55, 50] },
      'romantic': { emphasis: 'connection', hexagram_bias: [31, 54, 44, 28] },
      'authority': { emphasis: 'hierarchy', hexagram_bias: [15, 16, 8, 7] },
      
      // 環境パターン
      'work_environment': { emphasis: 'structure', hexagram_bias: [50, 48, 18, 46] },
      'home_environment': { emphasis: 'nurturing', hexagram_bias: [37, 4, 27, 48] },
      'social_environment': { emphasis: 'interaction', hexagram_bias: [13, 49, 17, 45] },
      'change_situation': { emphasis: 'transformation', hexagram_bias: [49, 63, 64, 32] },
      
      // 感情状況パターン
      'conflict_situation': { emphasis: 'resolution', hexagram_bias: [6, 13, 38, 40] },
      'decision_situation': { emphasis: 'choice', hexagram_bias: [47, 5, 3, 60] },
      'crisis_situation': { emphasis: 'survival', hexagram_bias: [29, 47, 36, 35] },
      'opportunity_situation': { emphasis: 'growth', hexagram_bias: [42, 46, 53, 35] }
    };
    
    // 卦特性データベース（簡易版）
    this.hexagramCharacteristics = {
      1: { nature: 'creative', energy: 'yang', element: 'heaven', attributes: ['leadership', 'power', 'initiative'] },
      2: { nature: 'receptive', energy: 'yin', element: 'earth', attributes: ['support', 'nurturing', 'patience'] },
      3: { nature: 'difficulty', energy: 'mixed', element: 'water-thunder', attributes: ['obstacles', 'persistence', 'growth'] },
      5: { nature: 'waiting', energy: 'mixed', element: 'water-heaven', attributes: ['patience', 'timing', 'preparation'] },
      6: { nature: 'conflict', energy: 'mixed', element: 'heaven-water', attributes: ['dispute', 'tension', 'resolution'] },
      // ... 他の卦の特性も必要に応じて追加
    };
    
    // マッピング統計
    this.statistics = {
      totalMappings: 0,
      successfulMappings: 0,
      averageConfidence: 0,
      hexagramFrequency: new Map(),
      lineFrequency: new Map()
    };
  }

  /**
   * 初期化処理
   */
  async initialize() {
    try {
      // 既存データの読み込み
      await this.loadHexagramData();
      await this.loadH384Data();
      console.log('✅ HexagramMappingEngine 初期化完了');
      return true;
    } catch (error) {
      console.error('❌ HexagramMappingEngine 初期化失敗:', error);
      return false;
    }
  }

  /**
   * 易経マッピング分析実行
   * 
   * 目的：
   * - Phase 2の仮想状況推定結果を易経の卦と爻にマッピング
   * - メタファー生成に適した解釈データの構築
   * 
   * 処理内容：
   * - 状況特性の易経的解釈
   * - 最適な卦と爻の選択
   * - 変卦分析による状況変化予測
   * 
   * 出力：
   * - 完全な易経マッピング結果
   */
  async mapSituationToHexagram(situationalResult, userProfile = null, mappingOptions = {}) {
    const startTime = performance.now();
    
    console.log('🎯 易経マッピング分析開始');
    
    // 入力検証
    if (!situationalResult || !situationalResult.virtualSituation) {
      console.error('HexagramMappingEngine: 無効な状況推定結果');
      return this.generateErrorResult('仮想状況推定結果が無効');
    }

    try {
      // データ初期化確認
      if (!this.hexagramsData || !this.h384Data) {
        await this.initialize();
      }

      const mappingLayers = {};
      
      // Layer 1: 状況特性分析（易経的解釈）
      console.log('🌟 Layer 1: 状況特性の易経的分析');
      mappingLayers.situationalAnalysis = await this.layer1_situationalCharacteristics(situationalResult);
      
      // Layer 2: 卦選択アルゴリズム（64卦マッチング）
      console.log('📖 Layer 2: 最適卦選択');
      mappingLayers.hexagramSelection = await this.layer2_hexagramSelection(mappingLayers.situationalAnalysis, situationalResult);
      
      // Layer 3: 爻特定システム（386爻詳細マッピング）
      console.log('📍 Layer 3: 爻特定分析');
      mappingLayers.lineSelection = await this.layer3_lineSelection(mappingLayers.hexagramSelection, situationalResult);
      
      // Layer 4: 変卦分析（状況変化予測）
      console.log('🔄 Layer 4: 変卦分析');
      mappingLayers.changingAnalysis = await this.layer4_changingAnalysis(mappingLayers, situationalResult);
      
      // 統合マッピング結果生成
      console.log('🎭 統合マッピング結果生成');
      const finalResult = await this.generateIntegratedMappingResult(mappingLayers, situationalResult, userProfile);
      
      // 処理時間と品質メトリクス
      const processingTime = performance.now() - startTime;
      finalResult.qualityMetrics = {
        processingTime: processingTime,
        layerCompletionRate: Object.keys(mappingLayers).length / 4,
        overallConfidence: finalResult.mappingConfidence,
        accuracyLevel: finalResult.mappingConfidence >= 0.85 ? 'A級マッピング' : 
                      finalResult.mappingConfidence >= 0.7 ? 'B級マッピング' : 'C級マッピング'
      };
      
      // マッピングパターン学習
      this.updateMappingPatterns(situationalResult, finalResult);
      
      // 統計更新
      this.updateStatistics(finalResult, true);
      
      console.log('✨ 易経マッピング分析完了:', {
        hexagram: finalResult.primaryHexagram?.name_jp,
        line: finalResult.selectedLine?.爻,
        confidence: finalResult.mappingConfidence
      });
      
      return finalResult;
      
    } catch (error) {
      console.error('🚨 易経マッピング分析エラー:', error);
      const fallbackResult = this.generateFallbackResult(situationalResult, error);
      this.updateStatistics(fallbackResult, false);
      return fallbackResult;
    }
  }

  /**
   * Layer 1: 状況特性の易経的分析
   * 
   * 目的：
   * - 仮想状況の特性を易経的観点で解釈
   * - 陰陽・五行・八卦との対応分析
   * 
   * 処理内容：
   * - 状況要素の易経的分類
   * - エネルギー特性の分析
   * - 変化の方向性評価
   * 
   * 出力：
   * - 易経的状況特性データ
   */
  async layer1_situationalCharacteristics(situationalResult) {
    const virtualSituation = situationalResult.virtualSituation;
    const situationalElements = situationalResult.situationalElements;
    
    // 陰陽分析
    const yinYangAnalysis = this.analyzeYinYangCharacteristics(virtualSituation, situationalElements);
    
    // 五行分析
    const wuxingAnalysis = this.analyzeWuxingElements(situationalElements);
    
    // 八卦対応分析
    const baguaAlignment = this.analyzeBaguaAlignment(situationalElements);
    
    // 変化の方向性
    const changeDirection = this.analyzeChangeDirection(virtualSituation);
    
    // 状況のエネルギー特性
    const energyCharacteristics = this.analyzeEnergyCharacteristics(virtualSituation, situationalElements);
    
    return {
      yinYangProfile: yinYangAnalysis,
      wuxingProfile: wuxingAnalysis,
      baguaAlignment: baguaAlignment,
      changeVector: changeDirection,
      energySignature: energyCharacteristics,
      situationalEssence: this.extractSituationalEssence(virtualSituation, situationalElements)
    };
  }

  /**
   * Layer 2: 最適卦選択
   * 
   * 目的：
   * - 64卦から最適な卦を選択
   * - 状況特性と卦特性のマッチング
   * 
   * 処理内容：
   * - 特性スコアマッチング
   * - ルールベース選択
   * - 複数候補の評価
   * 
   * 出力：
   * - 選択された卦とその根拠
   */
  async layer2_hexagramSelection(situationalAnalysis, situationalResult) {
    const candidates = [];
    
    // ルールベース候補抽出
    const ruleBased = this.getRuleBasedCandidates(situationalResult);
    
    // 特性マッチング候補抽出
    const characteristicBased = this.getCharacteristicBasedCandidates(situationalAnalysis);
    
    // 統計的候補抽出
    const statisticalBased = this.getStatisticalCandidates(situationalResult);
    
    // 候補統合と評価
    const allCandidates = [...ruleBased, ...characteristicBased, ...statisticalBased];
    const evaluatedCandidates = this.evaluateHexagramCandidates(allCandidates, situationalAnalysis, situationalResult);
    
    // 最適卦選択
    const selectedHexagram = evaluatedCandidates[0];
    const alternativeHexagrams = evaluatedCandidates.slice(1, 4);
    
    return {
      primaryHexagram: selectedHexagram,
      alternativeHexagrams: alternativeHexagrams,
      selectionReasoning: this.generateSelectionReasoning(selectedHexagram, situationalAnalysis),
      selectionConfidence: selectedHexagram.matchScore
    };
  }

  /**
   * Layer 3: 爻特定分析
   * 
   * 目的：
   * - 選択された卦内の最適な爻を特定
   * - H384データベースとの詳細マッピング
   * 
   * 処理内容：
   * - 状況詳細と爻の対応分析
   * - 現代解釈との適合度評価
   * - 動的状況要因の考慮
   * 
   * 出力：
   * - 選択された爻とその解釈
   */
  async layer3_lineSelection(hexagramSelection, situationalResult) {
    const primaryHexagram = hexagramSelection.primaryHexagram;
    
    if (!primaryHexagram || !this.h384Data) {
      return this.generateDefaultLineSelection(primaryHexagram);
    }
    
    // 該当卦の全爻データ取得
    const hexagramLines = this.h384Data.filter(line => line.卦番号 === primaryHexagram.hexagram_id);
    
    if (hexagramLines.length === 0) {
      return this.generateDefaultLineSelection(primaryHexagram);
    }
    
    // 状況と各爻の適合度分析
    const lineEvaluations = hexagramLines.map(line => {
      const matchScore = this.calculateLineMatchScore(line, situationalResult);
      return {
        ...line,
        matchScore: matchScore,
        relevance: this.calculateLineRelevance(line, situationalResult),
        modernAlignment: this.calculateModernAlignment(line, situationalResult)
      };
    });
    
    // 最適爻選択
    lineEvaluations.sort((a, b) => b.matchScore - a.matchScore);
    const selectedLine = lineEvaluations[0];
    const alternativeLines = lineEvaluations.slice(1, 3);
    
    return {
      selectedLine: selectedLine,
      alternativeLines: alternativeLines,
      lineSelectionReasoning: this.generateLineSelectionReasoning(selectedLine, situationalResult),
      lineConfidence: selectedLine.matchScore
    };
  }

  /**
   * Layer 4: 変卦分析
   * 
   * 目的：
   * - 状況の変化を予測し対応する変卦を分析
   * - 動的な状況推移への対応
   * 
   * 処理内容：
   * - 変化要因の特定
   * - 変卦の選択と解釈
   * - 時間軸での状況推移予測
   * 
   * 出力：
   * - 変卦情報と変化予測
   */
  async layer4_changingAnalysis(mappingLayers, situationalResult) {
    const primaryHexagram = mappingLayers.hexagramSelection.primaryHexagram;
    const selectedLine = mappingLayers.lineSelection.selectedLine;
    
    // 変化要因分析
    const changeFactors = this.analyzeChangeFactors(situationalResult);
    
    // 変卦計算
    const changingHexagram = this.calculateChangingHexagram(primaryHexagram, selectedLine, changeFactors);
    
    // 変化予測
    const changePrediction = this.predictSituationalChange(situationalResult, changeFactors);
    
    return {
      hasChangingLine: changeFactors.hasSignificantChange,
      changeFactors: changeFactors,
      changingHexagram: changingHexagram,
      changePrediction: changePrediction,
      changeConfidence: this.calculateChangeConfidence(changeFactors)
    };
  }

  // ============ データ読み込みメソッド ============

  /**
   * 卦データ読み込み
   */
  async loadHexagramData() {
    try {
      // グローバル変数から読み込み（実際の実装では適切なデータ読み込み方法を使用）
      if (typeof hexagrams_master !== 'undefined') {
        this.hexagramsData = hexagrams_master;
        console.log('📖 hexagrams_master データ読み込み完了');
      } else {
        console.warn('⚠️ hexagrams_master データが見つかりません');
        this.hexagramsData = this.generateFallbackHexagramData();
      }
    } catch (error) {
      console.error('❌ 卦データ読み込みエラー:', error);
      this.hexagramsData = this.generateFallbackHexagramData();
    }
  }

  /**
   * H384データ読み込み
   */
  async loadH384Data() {
    try {
      // グローバル変数から読み込み
      if (typeof H384_DATA !== 'undefined') {
        this.h384Data = H384_DATA;
        console.log('📊 H384_DATA データ読み込み完了');
      } else {
        console.warn('⚠️ H384_DATA データが見つかりません');
        this.h384Data = this.generateFallbackH384Data();
      }
    } catch (error) {
      console.error('❌ H384データ読み込みエラー:', error);
      this.h384Data = this.generateFallbackH384Data();
    }
  }

  // ============ 分析メソッド群 ============

  /**
   * 陰陽分析
   */
  analyzeYinYangCharacteristics(virtualSituation, situationalElements) {
    let yangScore = 0;
    let yinScore = 0;
    
    // 主体性・能動性の分析
    if (situationalElements.environmentalContext.primaryEnvironment === 'work_environment') {
      yangScore += 0.3;
    }
    if (situationalElements.environmentalContext.primaryEnvironment === 'home_environment') {
      yinScore += 0.3;
    }
    
    // 時間軸の分析
    if (situationalElements.temporalAnalysis.dominantTimeframe === 'near_future') {
      yangScore += 0.2;
    }
    if (situationalElements.temporalAnalysis.dominantTimeframe === 'recent_past') {
      yinScore += 0.2;
    }
    
    // 動的要素の分析
    if (virtualSituation.dynamicElements && virtualSituation.dynamicElements.changeFactors.length > 0) {
      yangScore += 0.2;
    }
    
    // 正規化
    const total = yangScore + yinScore;
    if (total > 0) {
      yangScore = yangScore / total;
      yinScore = yinScore / total;
    } else {
      yangScore = yinScore = 0.5; // デフォルト
    }
    
    return {
      yangScore: yangScore,
      yinScore: yinScore,
      dominantEnergy: yangScore > yinScore ? 'yang' : 'yin',
      balance: Math.abs(yangScore - yinScore) < 0.2 ? 'balanced' : 'polarized'
    };
  }

  /**
   * 五行分析（拡張版）
   * 
   * 目的：
   * - 状況要素の五行属性を詳細に分析
   * - 相生相剋関係を考慮した総合評価
   * 
   * 処理内容：
   * - 五行要素のスコアリング
   * - 相生相剋による調整
   * - 循環パターンの検出
   */
  analyzeWuxingElements(situationalElements) {
    const wuxingScores = {
      wood: 0,   // 木 - 成長、拡張、春、東
      fire: 0,   // 火 - 活動、表現、夏、南
      earth: 0,  // 土 - 安定、調和、季節の変わり目、中央
      metal: 0,  // 金 - 収束、精密、秋、西
      water: 0   // 水 - 流動、適応、冬、北
    };
    
    // 環境による五行分析（詳細版）
    const envType = situationalElements.environmentalContext.primaryEnvironment;
    if (envType === 'work_environment') {
      wuxingScores.metal += 0.3;
      wuxingScores.earth += 0.1; // 土生金の関係
    }
    if (envType === 'home_environment') {
      wuxingScores.earth += 0.3;
      wuxingScores.fire += 0.1; // 火生土の関係
    }
    if (envType === 'social_environment') {
      wuxingScores.fire += 0.3;
      wuxingScores.wood += 0.1; // 木生火の関係
    }
    if (envType === 'natural_environment') {
      wuxingScores.wood += 0.3;
      wuxingScores.water += 0.1; // 水生木の関係
    }
    
    // 関係性による五行分析（詳細版）
    const relType = situationalElements.relationshipMapping.primaryRelationship;
    if (relType === 'family') {
      wuxingScores.earth += 0.2;
      wuxingScores.wood += 0.1; // 家族の成長
    }
    if (relType === 'work') {
      wuxingScores.metal += 0.2;
      wuxingScores.water += 0.05; // 金生水の関係
    }
    if (relType === 'friends') {
      wuxingScores.fire += 0.2;
      wuxingScores.earth += 0.05; // 火生土の関係
    }
    if (relType === 'romantic') {
      wuxingScores.water += 0.2;
      wuxingScores.wood += 0.1; // 水生木の関係
    }
    
    // 時間的要素による五行調整
    const timeFrame = situationalElements.temporalAnalysis?.dominantTimeframe;
    if (timeFrame) {
      this.adjustWuxingByTimeframe(wuxingScores, timeFrame);
    }
    
    // 相生相剋による調整
    const adjustedScores = this.applyWuxingInteractions(wuxingScores);
    
    // 最優勢五行の特定
    const dominantElement = Object.entries(adjustedScores)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    // 五行循環パターンの検出
    const cyclePattern = this.detectWuxingCycle(adjustedScores);
    
    return {
      elementScores: adjustedScores,
      dominantElement: dominantElement,
      elementBalance: this.calculateElementBalance(adjustedScores),
      wuxingCycle: cyclePattern,
      interactionAnalysis: this.analyzeWuxingInteractions(adjustedScores)
    };
  }
  
  /**
   * 時間枠による五行調整
   */
  adjustWuxingByTimeframe(wuxingScores, timeFrame) {
    const timeframeWuxing = {
      'immediate_present': { fire: 0.15, metal: 0.1 }, // 即時性は火、決断は金
      'recent_past': { water: 0.15, earth: 0.1 }, // 過去の流れは水、蓄積は土
      'near_future': { wood: 0.15, fire: 0.1 }, // 未来の成長は木、希望は火
      'ongoing': { earth: 0.15, water: 0.1 } // 継続は土、流れは水
    };
    
    const adjustments = timeframeWuxing[timeFrame];
    if (adjustments) {
      Object.entries(adjustments).forEach(([element, score]) => {
        wuxingScores[element] += score;
      });
    }
  }
  
  /**
   * 五行相生相剋の適用
   */
  applyWuxingInteractions(wuxingScores) {
    const adjusted = { ...wuxingScores };
    
    // 相生関係（生成サイクル）
    // 木→火→土→金→水→木
    const shengCycle = {
      wood: 'fire',
      fire: 'earth',
      earth: 'metal',
      metal: 'water',
      water: 'wood'
    };
    
    // 相剋関係（抑制サイクル）
    // 木→土、土→水、水→火、火→金、金→木
    const keCycle = {
      wood: 'earth',
      earth: 'water',
      water: 'fire',
      fire: 'metal',
      metal: 'wood'
    };
    
    // 相生による増強
    Object.entries(shengCycle).forEach(([source, target]) => {
      if (adjusted[source] > 0.3) {
        adjusted[target] += adjusted[source] * 0.2; // 20%の相生効果
      }
    });
    
    // 相剋による減衰
    Object.entries(keCycle).forEach(([source, target]) => {
      if (adjusted[source] > 0.4) {
        adjusted[target] *= 0.8; // 20%の相剋効果
      }
    });
    
    // 正規化
    const total = Object.values(adjusted).reduce((sum, val) => sum + val, 0);
    if (total > 0) {
      Object.keys(adjusted).forEach(key => {
        adjusted[key] = adjusted[key] / total;
      });
    }
    
    return adjusted;
  }
  
  /**
   * 五行循環パターンの検出
   */
  detectWuxingCycle(wuxingScores) {
    const threshold = 0.15; // 有意な要素の閾値
    const activeElements = Object.entries(wuxingScores)
      .filter(([_, score]) => score > threshold)
      .map(([element, _]) => element);
    
    // 相生サイクルのチェック
    const shengSequence = ['wood', 'fire', 'earth', 'metal', 'water'];
    const hasShengCycle = this.checkCyclePattern(activeElements, shengSequence);
    
    // 相剋サイクルのチェック
    const keSequence = ['wood', 'earth', 'water', 'fire', 'metal'];
    const hasKeCycle = this.checkCyclePattern(activeElements, keSequence);
    
    return {
      hasShengCycle,
      hasKeCycle,
      dominantCycle: hasShengCycle ? 'generative' : hasKeCycle ? 'controlling' : 'mixed',
      cycleStrength: this.calculateCycleStrength(wuxingScores, activeElements)
    };
  }
  
  /**
   * 循環パターンのチェック
   */
  checkCyclePattern(activeElements, sequence) {
    let matchCount = 0;
    for (let i = 0; i < sequence.length - 1; i++) {
      if (activeElements.includes(sequence[i]) && activeElements.includes(sequence[i + 1])) {
        matchCount++;
      }
    }
    return matchCount >= 2; // 2つ以上の連続があれば循環とみなす
  }
  
  /**
   * 循環強度の計算
   */
  calculateCycleStrength(wuxingScores, activeElements) {
    if (activeElements.length < 2) return 0;
    
    const avgScore = activeElements.reduce((sum, el) => sum + wuxingScores[el], 0) / activeElements.length;
    return Math.min(avgScore * activeElements.length / 3, 1); // 最大1に正規化
  }
  
  /**
   * 五行相互作用の分析
   */
  analyzeWuxingInteractions(wuxingScores) {
    const interactions = {
      strongestSheng: null,
      strongestKe: null,
      balanceType: 'neutral'
    };
    
    // 最強の相生関係を検出
    const shengPairs = [
      ['wood', 'fire'], ['fire', 'earth'], ['earth', 'metal'], 
      ['metal', 'water'], ['water', 'wood']
    ];
    
    let maxShengStrength = 0;
    shengPairs.forEach(([source, target]) => {
      const strength = Math.min(wuxingScores[source], wuxingScores[target]);
      if (strength > maxShengStrength) {
        maxShengStrength = strength;
        interactions.strongestSheng = { source, target, strength };
      }
    });
    
    // 最強の相剋関係を検出
    const kePairs = [
      ['wood', 'earth'], ['earth', 'water'], ['water', 'fire'],
      ['fire', 'metal'], ['metal', 'wood']
    ];
    
    let maxKeStrength = 0;
    kePairs.forEach(([source, target]) => {
      const strength = Math.min(wuxingScores[source], wuxingScores[target]);
      if (strength > maxKeStrength) {
        maxKeStrength = strength;
        interactions.strongestKe = { source, target, strength };
      }
    });
    
    // バランスタイプの判定
    if (maxShengStrength > maxKeStrength * 1.5) {
      interactions.balanceType = 'generative_dominant';
    } else if (maxKeStrength > maxShengStrength * 1.5) {
      interactions.balanceType = 'controlling_dominant';
    } else {
      interactions.balanceType = 'balanced';
    }
    
    return interactions;
  }

  /**
   * 八卦対応分析
   */
  analyzeBaguaAlignment(situationalElements) {
    const baguaScores = {
      qian: 0,   // 乾 - 天、創造
      kun: 0,    // 坤 - 地、受容
      zhen: 0,   // 震 - 雷、動
      xun: 0,    // 巽 - 風、入
      kan: 0,    // 坎 - 水、険
      li: 0,     // 離 - 火、麗
      gen: 0,    // 艮 - 山、止
      dui: 0     // 兌 - 沢、悦
    };
    
    // 簡易的な八卦対応（実際にはより詳細な分析が必要）
    const envType = situationalElements.environmentalContext.primaryEnvironment;
    if (envType === 'work_environment') baguaScores.qian += 0.3;
    if (envType === 'home_environment') baguaScores.kun += 0.3;
    
    const dominantBagua = Object.entries(baguaScores)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    return {
      baguaScores: baguaScores,
      dominantBagua: dominantBagua
    };
  }

  /**
   * 変化方向分析
   */
  analyzeChangeDirection(virtualSituation) {
    const changeFactors = virtualSituation.dynamicElements || {};
    
    return {
      hasChange: Object.values(changeFactors).some(arr => Array.isArray(arr) && arr.length > 0),
      changeIntensity: this.calculateChangeIntensity(changeFactors),
      changeDirection: this.determineChangeDirection(changeFactors)
    };
  }

  /**
   * エネルギー特性分析
   */
  analyzeEnergyCharacteristics(virtualSituation, situationalElements) {
    return {
      overallEnergy: virtualSituation.complexityLevel === 'complex' ? 'high' : 'moderate',
      energyFlow: this.determineEnergyFlow(situationalElements),
      energyStability: virtualSituation.complexityLevel === 'simple' ? 'stable' : 'dynamic'
    };
  }

  /**
   * 状況本質抽出
   */
  extractSituationalEssence(virtualSituation, situationalElements) {
    return {
      coreTheme: virtualSituation.situationType || 'general_situation',
      primaryConcern: this.identifyPrimaryConcern(virtualSituation, situationalElements),
      situationalTone: this.determineSituationalTone(virtualSituation)
    };
  }

  // ============ 候補選択メソッド群 ============

  /**
   * ルールベース候補取得
   */
  getRuleBasedCandidates(situationalResult) {
    const candidates = [];
    const virtualSituation = situationalResult.virtualSituation;
    const situationalElements = situationalResult.situationalElements;
    
    // 時間軸ルール
    const timeframe = situationalElements.temporalAnalysis.dominantTimeframe;
    if (this.situationToHexagramRules[timeframe]) {
      const rule = this.situationToHexagramRules[timeframe];
      rule.hexagram_bias.forEach(hexagramId => {
        candidates.push({
          hexagram_id: hexagramId,
          source: 'temporal_rule',
          baseScore: 0.7
        });
      });
    }
    
    // 関係性ルール
    const relationship = situationalElements.relationshipMapping.primaryRelationship;
    if (this.situationToHexagramRules[relationship]) {
      const rule = this.situationToHexagramRules[relationship];
      rule.hexagram_bias.forEach(hexagramId => {
        candidates.push({
          hexagram_id: hexagramId,
          source: 'relationship_rule',
          baseScore: 0.8
        });
      });
    }
    
    return candidates;
  }

  /**
   * 特性ベース候補取得
   */
  getCharacteristicBasedCandidates(situationalAnalysis) {
    const candidates = [];
    
    if (!this.hexagramsData) return candidates;
    
    // 陰陽バランスによる候補選択
    const yinYang = situationalAnalysis.yinYangProfile;
    this.hexagramsData.forEach(hexagram => {
      let score = 0.5;
      
      // 簡易的な特性マッチング
      if (yinYang.dominantEnergy === 'yang' && hexagram.hexagram_id % 2 === 1) {
        score += 0.2;
      }
      if (yinYang.dominantEnergy === 'yin' && hexagram.hexagram_id % 2 === 0) {
        score += 0.2;
      }
      
      if (score > 0.6) {
        candidates.push({
          hexagram_id: hexagram.hexagram_id,
          source: 'characteristic_match',
          baseScore: score
        });
      }
    });
    
    return candidates;
  }

  /**
   * 統計ベース候補取得
   */
  getStatisticalCandidates(situationalResult) {
    const candidates = [];
    
    // 過去のマッピング履歴から類似パターンを検索
    // （簡易実装では固定候補を返す）
    [1, 2, 3, 5, 11, 12].forEach(hexagramId => {
      candidates.push({
        hexagram_id: hexagramId,
        source: 'statistical',
        baseScore: 0.6
      });
    });
    
    return candidates;
  }

  /**
   * 卦候補評価
   */
  evaluateHexagramCandidates(candidates, situationalAnalysis, situationalResult) {
    const evaluatedCandidates = [];
    
    // 候補をhexagram_idでグループ化
    const candidateGroups = new Map();
    candidates.forEach(candidate => {
      if (!candidateGroups.has(candidate.hexagram_id)) {
        candidateGroups.set(candidate.hexagram_id, []);
      }
      candidateGroups.get(candidate.hexagram_id).push(candidate);
    });
    
    // 各候補グループを評価
    candidateGroups.forEach((group, hexagramId) => {
      const hexagramData = this.hexagramsData?.find(h => h.hexagram_id === hexagramId);
      if (!hexagramData) return;
      
      // 複数ソースからのスコア統合
      const combinedScore = group.reduce((sum, candidate) => sum + candidate.baseScore, 0) / group.length;
      
      // 詳細マッチングによる調整
      const detailedScore = this.calculateDetailedMatchScore(hexagramData, situationalAnalysis, situationalResult);
      
      // 時系列変化分析による調整
      const timeSeriesScore = this.calculateTimeSeriesScore(hexagramData, situationalResult);
      
      const finalScore = (combinedScore * 0.5 + detailedScore * 0.3 + timeSeriesScore * 0.2);
      
      evaluatedCandidates.push({
        ...hexagramData,
        matchScore: finalScore,
        sources: group.map(c => c.source),
        detailedAnalysis: this.generateDetailedAnalysis(hexagramData, situationalAnalysis),
        timeSeriesAnalysis: this.generateTimeSeriesAnalysis(hexagramData, situationalResult)
      });
    });
    
    // スコア順でソート
    evaluatedCandidates.sort((a, b) => b.matchScore - a.matchScore);
    
    return evaluatedCandidates;
  }

  /**
   * 詳細マッチスコア計算
   */
  calculateDetailedMatchScore(hexagramData, situationalAnalysis, situationalResult) {
    let score = 0.5;
    
    // 簡易的な詳細マッチング
    if (hexagramData.innovation_score && situationalAnalysis.changeVector.hasChange) {
      score += hexagramData.innovation_score / 100 * 0.3;
    }
    
    if (hexagramData.stability_score && situationalAnalysis.energySignature.energyStability === 'stable') {
      score += hexagramData.stability_score / 100 * 0.2;
    }
    
    return Math.min(score, 1.0);
  }

  // ============ 爻選択メソッド群 ============

  /**
   * 爻マッチスコア計算
   */
  calculateLineMatchScore(line, situationalResult) {
    let score = 0.5;
    
    // キーワードマッチング
    if (line.キーワード && Array.isArray(line.キーワード)) {
      const situationText = situationalResult.virtualSituation.situationCore || '';
      line.キーワード.forEach(keyword => {
        if (situationText.includes(keyword)) {
          score += 0.1;
        }
      });
    }
    
    // スコアベース評価
    if (line.S7_総合評価スコア) {
      score += line.S7_総合評価スコア / 1000; // 正規化
    }
    
    return Math.min(score, 1.0);
  }

  /**
   * 爻関連性計算
   */
  calculateLineRelevance(line, situationalResult) {
    // 現代解釈との関連性
    const modernText = line.現代解釈の要約 || '';
    const situationCore = situationalResult.virtualSituation.situationCore || '';
    
    // 簡易的な文字列類似度
    const commonWords = this.findCommonWords(modernText, situationCore);
    return Math.min(commonWords.length * 0.1, 1.0);
  }

  /**
   * 現代適合度計算
   */
  calculateModernAlignment(line, situationalResult) {
    // 基本的な適合度計算
    let alignment = 0.5;
    
    if (line.S5_主体性推奨スタンス) {
      // 状況に応じた主体性の適合度評価
      const complexity = situationalResult.virtualSituation.complexityLevel;
      if (complexity === 'complex' && line.S5_主体性推奨スタンス === '能動') {
        alignment += 0.2;
      }
      if (complexity === 'simple' && line.S5_主体性推奨スタンス === '受動') {
        alignment += 0.2;
      }
    }
    
    return Math.min(alignment, 1.0);
  }

  // ============ 変卦分析メソッド群 ============

  /**
   * 変化要因分析
   */
  analyzeChangeFactors(situationalResult) {
    const virtualSituation = situationalResult.virtualSituation;
    const dynamicElements = virtualSituation.dynamicElements || {};
    
    const changeFactors = {
      hasSignificantChange: false,
      changeIntensity: 0,
      changeTypes: [],
      timeframe: 'unknown'
    };
    
    // 動的要素の分析
    Object.entries(dynamicElements).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        changeFactors.hasSignificantChange = true;
        changeFactors.changeIntensity += value.length * 0.2;
        changeFactors.changeTypes.push(key);
      }
    });
    
    changeFactors.changeIntensity = Math.min(changeFactors.changeIntensity, 1.0);
    
    return changeFactors;
  }

  /**
   * 変卦計算
   */
  calculateChangingHexagram(primaryHexagram, selectedLine, changeFactors) {
    if (!changeFactors.hasSignificantChange) {
      return null;
    }
    
    // 簡易的な変卦計算（実際の易経ルールに基づく実装が必要）
    const changingHexagramId = this.calculateChangingHexagramId(primaryHexagram.hexagram_id, selectedLine);
    const changingHexagram = this.hexagramsData?.find(h => h.hexagram_id === changingHexagramId);
    
    // 時系列変化パターンの適用
    if (changingHexagram) {
      changingHexagram.timeSeriesPattern = this.predictTimeSeriesPattern(
        primaryHexagram,
        changingHexagram,
        changeFactors
      );
    }
    
    return changingHexagram || null;
  }

  /**
   * 変卦ID計算（簡易版）
   */
  calculateChangingHexagramId(originalId, selectedLine) {
    // 簡易的な変卦計算（実際の易経ルールに基づく詳細な実装が必要）
    const linePosition = this.getLinePosition(selectedLine);
    const changingId = (originalId + linePosition) % 64;
    return changingId === 0 ? 64 : changingId;
  }

  // ============ ヘルパーメソッド群 ============

  /**
   * 共通単語検索
   */
  findCommonWords(text1, text2) {
    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);
    return words1.filter(word => words2.includes(word));
  }

  /**
   * 爻位置取得
   */
  getLinePosition(selectedLine) {
    if (!selectedLine || !selectedLine.爻) return 1;
    
    const lineMap = {
      '初九': 1, '初六': 1,
      '九二': 2, '六二': 2,
      '九三': 3, '六三': 3,
      '九四': 4, '六四': 4,
      '九五': 5, '六五': 5,
      '上九': 6, '上六': 6
    };
    
    return lineMap[selectedLine.爻] || 1;
  }

  /**
   * 変化強度計算
   */
  calculateChangeIntensity(changeFactors) {
    if (!changeFactors || typeof changeFactors !== 'object') return 0;
    
    let intensity = 0;
    Object.values(changeFactors).forEach(value => {
      if (Array.isArray(value)) {
        intensity += value.length * 0.1;
      }
    });
    
    return Math.min(intensity, 1.0);
  }

  /**
   * 統合マッピング結果生成
   */
  async generateIntegratedMappingResult(mappingLayers, situationalResult, userProfile) {
    const hexagramSelection = mappingLayers.hexagramSelection;
    const lineSelection = mappingLayers.lineSelection;
    const changingAnalysis = mappingLayers.changingAnalysis;
    
    // 最終信頼度計算
    const mappingConfidence = this.calculateFinalMappingConfidence(
      hexagramSelection.selectionConfidence,
      lineSelection.lineConfidence,
      changingAnalysis.changeConfidence
    );
    
    return {
      primaryHexagram: hexagramSelection.primaryHexagram,
      selectedLine: lineSelection.selectedLine,
      changingHexagram: changingAnalysis.changingHexagram,
      mappingConfidence: mappingConfidence,
      situationalAlignment: this.generateSituationalAlignment(hexagramSelection.primaryHexagram, situationalResult),
      interpretationData: this.generateInterpretationData(mappingLayers, situationalResult),
      recommendedActions: this.generateRecommendedActions(lineSelection.selectedLine, changingAnalysis),
      readyForMetaphorGeneration: mappingConfidence > this.confidenceThreshold,
      mappingSummary: this.generateMappingSummary(mappingLayers)
    };
  }

  /**
   * 最終マッピング信頼度計算
   */
  calculateFinalMappingConfidence(hexagramConfidence, lineConfidence, changeConfidence) {
    return (
      hexagramConfidence * 0.5 +
      lineConfidence * 0.3 +
      changeConfidence * 0.2
    );
  }

  /**
   * 状況対応分析生成
   */
  generateSituationalAlignment(hexagram, situationalResult) {
    return {
      hexagramName: hexagram.name_jp,
      situationType: situationalResult.virtualSituation.situationType,
      alignmentScore: 0.8, // 簡易実装
      keyCorrespondences: [
        '状況の複雑性と卦の性質が適合',
        '時間軸と易経の変化原理が一致',
        '人間関係パターンと卦の示唆が調和'
      ]
    };
  }

  /**
   * 解釈データ生成
   */
  generateInterpretationData(mappingLayers, situationalResult) {
    return {
      hexagramInterpation: mappingLayers.hexagramSelection.primaryHexagram,
      lineInterpretation: mappingLayers.lineSelection.selectedLine,
      contextualBackground: situationalResult.virtualSituation,
      modernApplication: this.generateModernApplication(mappingLayers, situationalResult)
    };
  }

  /**
   * 現代的応用生成
   */
  generateModernApplication(mappingLayers, situationalResult) {
    return {
      practicalAdvice: '状況に応じた具体的な行動指針',
      strategicDirection: '長期的な方向性の示唆',
      cautionPoints: '注意すべき点と回避策'
    };
  }

  /**
   * 推奨行動生成
   */
  generateRecommendedActions(selectedLine, changingAnalysis) {
    const actions = [];
    
    if (selectedLine && selectedLine.S5_主体性推奨スタンス) {
      const stance = selectedLine.S5_主体性推奨スタンス;
      if (stance === '能動') {
        actions.push({
          type: 'proactive',
          description: '積極的な行動を取ることが推奨されます'
        });
      } else if (stance === '受動') {
        actions.push({
          type: 'receptive',
          description: '慎重に状況を観察し、適切なタイミングを待つことが重要です'
        });
      }
    }
    
    if (changingAnalysis.hasChangingLine) {
      actions.push({
        type: 'adaptive',
        description: '状況の変化に柔軟に対応する準備をしてください'
      });
    }
    
    return actions;
  }

  /**
   * マッピングサマリ生成
   */
  generateMappingSummary(mappingLayers) {
    const hexagram = mappingLayers.hexagramSelection.primaryHexagram;
    const line = mappingLayers.lineSelection.selectedLine;
    
    return {
      hexagramName: hexagram?.name_jp || '不明',
      hexagramReading: hexagram?.reading || '不明',
      selectedLineType: line?.爻 || '不明',
      overallGuidance: hexagram?.catchphrase || '状況に応じた指針',
      keyInsight: line?.現代解釈の要約 || '詳細な解釈が必要です'
    };
  }

  // ============ データ生成・フォールバック ============

  /**
   * フォールバック卦データ生成
   */
  generateFallbackHexagramData() {
    return [
      { hexagram_id: 1, name_jp: '乾為天', reading: 'けんいてん', catchphrase: '創造の力', innovation_score: 9, stability_score: 7 },
      { hexagram_id: 2, name_jp: '坤為地', reading: 'こんいち', catchphrase: '受容の徳', innovation_score: 3, stability_score: 9 }
    ];
  }

  /**
   * フォールバックH384データ生成
   */
  generateFallbackH384Data() {
    return [
      { 通し番号: 1, 卦番号: 1, 卦名: '乾為天', 爻: '初九', キーワード: ['潜在'], 現代解釈の要約: '力を蓄える時期', S7_総合評価スコア: 50 }
    ];
  }

  /**
   * デフォルト爻選択生成
   */
  generateDefaultLineSelection(hexagram) {
    return {
      selectedLine: {
        通し番号: 1,
        卦番号: hexagram?.hexagram_id || 1,
        卦名: hexagram?.name_jp || '不明',
        爻: '九五',
        キーワード: ['中正'],
        現代解釈の要約: '中庸の徳により最適な判断を',
        S7_総合評価スコア: 70,
        matchScore: 0.5
      },
      alternativeLines: [],
      lineSelectionReasoning: 'デフォルト選択（九五：最も調和的な位置）',
      lineConfidence: 0.5
    };
  }

  /**
   * 統計更新
   */
  updateStatistics(result, success) {
    this.statistics.totalMappings++;
    
    if (success && result.primaryHexagram) {
      this.statistics.successfulMappings++;
      
      const hexagramId = result.primaryHexagram.hexagram_id;
      this.statistics.hexagramFrequency.set(
        hexagramId,
        (this.statistics.hexagramFrequency.get(hexagramId) || 0) + 1
      );
      
      if (result.selectedLine) {
        const lineKey = `${hexagramId}_${result.selectedLine.爻}`;
        this.statistics.lineFrequency.set(
          lineKey,
          (this.statistics.lineFrequency.get(lineKey) || 0) + 1
        );
      }
    }
    
    // 平均信頼度更新
    this.statistics.averageConfidence = success ? 
      (this.statistics.averageConfidence * 0.9 + result.mappingConfidence * 0.1) : 
      (this.statistics.averageConfidence * 0.9);
  }

  /**
   * マッピングパターン学習
   */
  updateMappingPatterns(situationalResult, mappingResult) {
    const pattern = {
      situationType: situationalResult.virtualSituation.situationType,
      hexagramId: mappingResult.primaryHexagram?.hexagram_id,
      confidence: mappingResult.mappingConfidence,
      timestamp: Date.now()
    };
    
    this.mappingHistory.push(pattern);
    
    // 履歴サイズ制限
    if (this.mappingHistory.length > 100) {
      this.mappingHistory.shift();
    }
  }

  /**
   * エラー結果生成
   */
  generateErrorResult(errorMessage) {
    return {
      primaryHexagram: null,
      selectedLine: null,
      changingHexagram: null,
      mappingConfidence: 0.2,
      error: errorMessage,
      readyForMetaphorGeneration: false,
      qualityMetrics: {
        processingTime: 0,
        layerCompletionRate: 0,
        overallConfidence: 0.2,
        accuracyLevel: 'エラー'
      }
    };
  }

  /**
   * フォールバック結果生成
   */
  generateFallbackResult(situationalResult, error) {
    console.warn('易経マッピングフォールバック実行:', error.message);
    
    // デフォルト卦（沢天夬 - 決断）を使用
    const fallbackHexagram = this.hexagramsData?.[0] || { hexagram_id: 43, name_jp: '沢天夬', reading: 'たくてんかい' };
    
    return {
      primaryHexagram: fallbackHexagram,
      selectedLine: {
        爻: '九五',
        現代解釈の要約: '状況に応じた柔軟な対応が必要',
        S7_総合評価スコア: 50
      },
      changingHexagram: null,
      mappingConfidence: 0.4,
      fallback: true,
      error: error.message,
      readyForMetaphorGeneration: true,
      qualityMetrics: {
        processingTime: 0,
        layerCompletionRate: 0.5,
        overallConfidence: 0.4,
        accuracyLevel: 'フォールバック'
      }
    };
  }

  // ============ 簡易実装ヘルパー（詳細実装が必要な箇所） ============

  calculateElementBalance(wuxingScores) { return 'balanced'; }
  determineChangeDirection(changeFactors) { return 'progressive'; }
  determineEnergyFlow(situationalElements) { return 'smooth'; }
  determineSituationalTone(virtualSituation) { return 'contemplative'; }
  identifyPrimaryConcern(virtualSituation, situationalElements) { return virtualSituation.situationType || 'general'; }
  generateSelectionReasoning(hexagram, analysis) { return `${hexagram.name_jp}が状況特性と最も適合しています`; }
  generateLineSelectionReasoning(line, situationalResult) { return `${line.爻}が現在の状況段階に最適です`; }
  predictSituationalChange(situationalResult, changeFactors) { return { trend: 'positive', timeframe: 'near_future' }; }
  calculateChangeConfidence(changeFactors) { return changeFactors.hasSignificantChange ? 0.7 : 0.3; }
  generateDetailedAnalysis(hexagram, analysis) { return { match_factors: ['temporal', 'relational'] }; }
  
  // ============ 時系列変化分析メソッド ============
  
  /**
   * 時系列スコア計算
   * 
   * 目的：
   * - 過去・現在・未来の時間軸での卦の適合度を評価
   * - 変化の流れと卦の性質の一致度を計算
   */
  calculateTimeSeriesScore(hexagramData, situationalResult) {
    let score = 0.5; // 基準スコア
    
    const temporalAnalysis = situationalResult.situationalElements?.temporalAnalysis;
    if (!temporalAnalysis) return score;
    
    // 時間枠と卦の性質の一致度
    const timeframe = temporalAnalysis.dominantTimeframe;
    const hexagramTemporal = this.getHexagramTemporalNature(hexagramData);
    
    // 時系列パターンのマッチング
    if (timeframe === 'immediate_present' && hexagramTemporal.includes('active')) {
      score += 0.2;
    } else if (timeframe === 'near_future' && hexagramTemporal.includes('preparatory')) {
      score += 0.2;
    } else if (timeframe === 'recent_past' && hexagramTemporal.includes('reflective')) {
      score += 0.2;
    }
    
    // 変化の速度と卦の動的性質
    if (temporalAnalysis.changeVelocity) {
      const changeSpeed = this.calculateChangeVelocity(situationalResult);
      if (changeSpeed > 0.7 && hexagramTemporal.includes('dynamic')) {
        score += 0.15;
      } else if (changeSpeed < 0.3 && hexagramTemporal.includes('stable')) {
        score += 0.15;
      }
    }
    
    // 時系列連続性の評価
    const continuityScore = this.evaluateTemporalContinuity(hexagramData, situationalResult);
    score += continuityScore * 0.15;
    
    return Math.min(score, 1.0);
  }
  
  /**
   * 時系列分析生成
   * 
   * 目的：
   * - 卦の時系列的な変化パターンを詳細に分析
   * - 過去・現在・未来の展開を予測
   */
  generateTimeSeriesAnalysis(hexagramData, situationalResult) {
    const analysis = {
      temporalAlignment: this.analyzeTemporalAlignment(hexagramData, situationalResult),
      transformationSequence: this.predictTransformationSequence(hexagramData, situationalResult),
      temporalResonance: this.calculateTemporalResonance(hexagramData, situationalResult),
      evolutionPath: this.generateEvolutionPath(hexagramData, situationalResult)
    };
    
    return analysis;
  }
  
  /**
   * 時系列パターン予測
   * 
   * 目的：
   * - 主卦から変卦への時系列的な変化パターンを予測
   * - 変化の速度、強度、方向性を分析
   */
  predictTimeSeriesPattern(primaryHexagram, changingHexagram, changeFactors) {
    const pattern = {
      transformationType: this.classifyTransformationType(primaryHexagram, changingHexagram),
      timeframe: this.estimateTransformationTimeframe(changeFactors),
      intensity: changeFactors.changeIntensity,
      phases: this.generateTransformationPhases(primaryHexagram, changingHexagram),
      criticalPoints: this.identifyCriticalPoints(primaryHexagram, changingHexagram)
    };
    
    return pattern;
  }
  
  /**
   * 卦の時間的性質取得
   */
  getHexagramTemporalNature(hexagramData) {
    // 卦番号に基づく簡易的な時間的性質の分類
    const hexagramId = hexagramData.hexagram_id;
    const temporalNatures = [];
    
    // 動的な卦（雷・風・火系）
    if ([51, 57, 30, 21, 55, 62, 56, 35].includes(hexagramId)) {
      temporalNatures.push('dynamic', 'active');
    }
    
    // 準備的な卦（水・沢系）
    if ([3, 5, 8, 60, 63, 64, 48, 29].includes(hexagramId)) {
      temporalNatures.push('preparatory', 'transitional');
    }
    
    // 反省的な卦（山・地系）
    if ([52, 15, 23, 27, 4, 7, 33, 12].includes(hexagramId)) {
      temporalNatures.push('reflective', 'contemplative');
    }
    
    // 安定的な卦（天・地系）
    if ([1, 2, 11, 12, 13, 14, 43, 44].includes(hexagramId)) {
      temporalNatures.push('stable', 'enduring');
    }
    
    return temporalNatures.length > 0 ? temporalNatures : ['neutral'];
  }
  
  /**
   * 変化速度計算
   */
  calculateChangeVelocity(situationalResult) {
    const dynamicElements = situationalResult.virtualSituation?.dynamicElements;
    if (!dynamicElements) return 0.5;
    
    let velocity = 0;
    let factorCount = 0;
    
    // 各動的要素の変化速度を評価
    Object.entries(dynamicElements).forEach(([key, factors]) => {
      if (Array.isArray(factors) && factors.length > 0) {
        velocity += factors.length * 0.1;
        factorCount++;
      }
    });
    
    return factorCount > 0 ? Math.min(velocity / factorCount, 1.0) : 0.5;
  }
  
  /**
   * 時間的連続性評価
   */
  evaluateTemporalContinuity(hexagramData, situationalResult) {
    // 状況の時間的要素と卦の連続性を評価
    const temporalElements = situationalResult.situationalElements?.temporalAnalysis;
    if (!temporalElements) return 0.5;
    
    let continuityScore = 0.5;
    
    // 過去から現在への連続性
    if (temporalElements.pastInfluence && hexagramData.hexagram_id) {
      const pastRelevance = this.calculatePastRelevance(hexagramData, temporalElements);
      continuityScore += pastRelevance * 0.25;
    }
    
    // 現在から未来への展開性
    if (temporalElements.futureProjection && hexagramData.hexagram_id) {
      const futureAlignment = this.calculateFutureAlignment(hexagramData, temporalElements);
      continuityScore += futureAlignment * 0.25;
    }
    
    return Math.min(continuityScore, 1.0);
  }
  
  /**
   * 時間的整合性分析
   */
  analyzeTemporalAlignment(hexagramData, situationalResult) {
    const alignment = {
      pastConnection: this.analyzePastConnection(hexagramData, situationalResult),
      presentRelevance: this.analyzePresentRelevance(hexagramData, situationalResult),
      futureProjection: this.analyzeFutureProjection(hexagramData, situationalResult),
      overallContinuity: 'moderate'
    };
    
    // 全体的な連続性の評価
    const scores = [
      alignment.pastConnection.score,
      alignment.presentRelevance.score,
      alignment.futureProjection.score
    ];
    const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    
    if (avgScore > 0.7) alignment.overallContinuity = 'strong';
    else if (avgScore < 0.4) alignment.overallContinuity = 'weak';
    
    return alignment;
  }
  
  /**
   * 変化シーケンス予測
   */
  predictTransformationSequence(hexagramData, situationalResult) {
    const sequence = [];
    
    // 現在の状態
    sequence.push({
      phase: 'current',
      hexagram: hexagramData.hexagram_id,
      description: `現在: ${hexagramData.name_jp}の状態`,
      timeframe: '現在'
    });
    
    // 近い将来の変化
    const nearFutureHexagram = this.predictNearFutureHexagram(hexagramData, situationalResult);
    if (nearFutureHexagram) {
      sequence.push({
        phase: 'near_future',
        hexagram: nearFutureHexagram,
        description: '近い将来の展開',
        timeframe: '1-3ヶ月'
      });
    }
    
    // 中期的な変化
    const midTermHexagram = this.predictMidTermHexagram(hexagramData, situationalResult);
    if (midTermHexagram) {
      sequence.push({
        phase: 'mid_term',
        hexagram: midTermHexagram,
        description: '中期的な発展',
        timeframe: '3-6ヶ月'
      });
    }
    
    return sequence;
  }
  
  /**
   * 時間的共鳴計算
   */
  calculateTemporalResonance(hexagramData, situationalResult) {
    // 卦と状況の時間的な共鳴度を計算
    let resonance = 0.5;
    
    const temporalAnalysis = situationalResult.situationalElements?.temporalAnalysis;
    if (temporalAnalysis && temporalAnalysis.resonanceFactors) {
      // 共鳴要因の評価
      temporalAnalysis.resonanceFactors.forEach(factor => {
        if (this.hexagramResonatesWith(hexagramData, factor)) {
          resonance += 0.1;
        }
      });
    }
    
    return {
      score: Math.min(resonance, 1.0),
      strength: resonance > 0.7 ? 'strong' : resonance > 0.4 ? 'moderate' : 'weak',
      factors: this.identifyResonanceFactors(hexagramData, situationalResult)
    };
  }
  
  /**
   * 進化パス生成
   */
  generateEvolutionPath(hexagramData, situationalResult) {
    const path = {
      startPoint: hexagramData.hexagram_id,
      trajectory: this.calculateEvolutionTrajectory(hexagramData, situationalResult),
      milestones: this.identifyEvolutionMilestones(hexagramData, situationalResult),
      endPoint: this.predictEvolutionEndpoint(hexagramData, situationalResult)
    };
    
    return path;
  }
  
  /**
   * 変化タイプ分類
   */
  classifyTransformationType(primaryHexagram, changingHexagram) {
    const primaryId = primaryHexagram.hexagram_id;
    const changingId = changingHexagram.hexagram_id;
    
    // 変化の大きさによる分類
    const difference = Math.abs(primaryId - changingId);
    
    if (difference === 1) return 'gradual'; // 漸進的変化
    if (difference > 32) return 'reversal'; // 反転的変化
    if (difference > 16) return 'major'; // 大きな変化
    return 'moderate'; // 中程度の変化
  }
  
  /**
   * 変化時間枠推定
   */
  estimateTransformationTimeframe(changeFactors) {
    const intensity = changeFactors.changeIntensity;
    
    if (intensity > 0.8) return 'immediate'; // 即座
    if (intensity > 0.6) return 'short_term'; // 短期（1-2週間）
    if (intensity > 0.4) return 'medium_term'; // 中期（1-3ヶ月）
    return 'long_term'; // 長期（3ヶ月以上）
  }
  
  /**
   * 変化フェーズ生成
   */
  generateTransformationPhases(primaryHexagram, changingHexagram) {
    return [
      {
        phase: 1,
        name: '初期状態',
        hexagram: primaryHexagram.hexagram_id,
        description: '現在の安定状態'
      },
      {
        phase: 2,
        name: '動揺期',
        description: '変化の兆しが現れる'
      },
      {
        phase: 3,
        name: '転換期',
        description: '本格的な変化が始まる'
      },
      {
        phase: 4,
        name: '新状態',
        hexagram: changingHexagram.hexagram_id,
        description: '新たな安定状態へ'
      }
    ];
  }
  
  /**
   * 臨界点特定
   */
  identifyCriticalPoints(primaryHexagram, changingHexagram) {
    return [
      {
        point: 'trigger',
        description: '変化のトリガーポイント',
        timing: '変化の初期段階'
      },
      {
        point: 'inflection',
        description: '転換点',
        timing: '変化の中間地点'
      },
      {
        point: 'stabilization',
        description: '安定化ポイント',
        timing: '変化の完了段階'
      }
    ];
  }
  
  // ============ 時系列分析ヘルパーメソッド ============
  
  calculatePastRelevance(hexagramData, temporalElements) {
    // 過去の関連性を簡易計算
    return temporalElements.pastInfluence > 0.5 ? 0.7 : 0.3;
  }
  
  calculateFutureAlignment(hexagramData, temporalElements) {
    // 未来への整合性を簡易計算
    return temporalElements.futureProjection > 0.5 ? 0.7 : 0.3;
  }
  
  analyzePastConnection(hexagramData, situationalResult) {
    return { score: 0.6, description: '過去との適度な連続性' };
  }
  
  analyzePresentRelevance(hexagramData, situationalResult) {
    return { score: 0.8, description: '現在の状況と高い関連性' };
  }
  
  analyzeFutureProjection(hexagramData, situationalResult) {
    return { score: 0.7, description: '未来への展開可能性' };
  }
  
  predictNearFutureHexagram(hexagramData, situationalResult) {
    // 近い将来の卦を予測（簡易実装）
    const offset = situationalResult.virtualSituation?.complexityLevel === 'complex' ? 3 : 1;
    return (hexagramData.hexagram_id + offset) % 64 || 64;
  }
  
  predictMidTermHexagram(hexagramData, situationalResult) {
    // 中期的な卦を予測（簡易実装）
    const offset = situationalResult.virtualSituation?.complexityLevel === 'complex' ? 7 : 3;
    return (hexagramData.hexagram_id + offset) % 64 || 64;
  }
  
  hexagramResonatesWith(hexagramData, factor) {
    // 卦と要因の共鳴を判定（簡易実装）
    return Math.random() > 0.5;
  }
  
  identifyResonanceFactors(hexagramData, situationalResult) {
    return ['時間的連続性', '変化の方向性', 'エネルギーの流れ'];
  }
  
  calculateEvolutionTrajectory(hexagramData, situationalResult) {
    return situationalResult.virtualSituation?.complexityLevel === 'complex' ? 'ascending' : 'stable';
  }
  
  identifyEvolutionMilestones(hexagramData, situationalResult) {
    return [
      { milestone: 1, description: '初期認識段階' },
      { milestone: 2, description: '変化受容段階' },
      { milestone: 3, description: '統合完了段階' }
    ];
  }
  
  predictEvolutionEndpoint(hexagramData, situationalResult) {
    // 進化の終点を予測（簡易実装）
    return (hexagramData.hexagram_id + 12) % 64 || 64;
  }
}

// グローバル利用のためのエクスポート
window.HexagramMappingEngine = HexagramMappingEngine;