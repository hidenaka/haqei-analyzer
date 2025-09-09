/**
 * Enhanced H384 Data Extractor
 * Phase 2 Task 2.1: H384データ活用強化実装
 * 
 * @version 2.0.0
 * @date 2025-08-16
 */

class EnhancedH384DataExtractor {
  constructor() {
    this.dataCache = new Map();
    this.inferenceEngine = new H384InferenceEngine();
    this.qualityAnalyzer = new DataQualityAnalyzer();
    console.log('🔬 EnhancedH384DataExtractor initialized with advanced capabilities');
  }

  /**
   * 多次元データ抽出システム
   */
  extractMultiDimensionalData(hexagramIndex, lineIndex) {
    const cacheKey = `${hexagramIndex}-${lineIndex}`;
    
    if (this.dataCache.has(cacheKey)) {
      return this.dataCache.get(cacheKey);
    }

    const rawData = this.getRawH384Data(hexagramIndex, lineIndex);
    const enhancedData = this.enhanceDataWithInference(rawData, hexagramIndex, lineIndex);
    
    this.dataCache.set(cacheKey, enhancedData);
    return enhancedData;
  }

  /**
   * 生H384データ取得
   */
  getRawH384Data(hexagramIndex, lineIndex) {
    if (!window.H384_DATA) {
      console.warn('H384データベースが見つかりません');
      return null;
    }

    const lineNames = ['初九', '九二', '九三', '九四', '九五', '上九', 
                      '初六', '六二', '六三', '六四', '六五', '上六'];
    
    const data = window.H384_DATA.find(item => 
      item['卦番号'] === hexagramIndex && 
      lineNames.includes(item['爻']) &&
      this.getLinePosition(item['爻']) === lineIndex
    );

    return data || this.generateInferredData(hexagramIndex, lineIndex);
  }

  /**
   * 推論・補完エンジンでデータ強化
   */
  enhanceDataWithInference(rawData, hexagramIndex, lineIndex) {
    if (!rawData) {
      return this.generateInferredData(hexagramIndex, lineIndex);
    }

    // 基本データ品質分析
    const qualityMetrics = this.qualityAnalyzer.analyzeDataQuality(rawData);
    
    // 欠損データ補完
    const completedData = this.inferenceEngine.fillMissingData(rawData, hexagramIndex, lineIndex);
    
    // 多次元特徴抽出
    const multidimensionalFeatures = this.extractAdvancedFeatures(completedData);
    
    // 表現生成用メタデータ追加
    const expressionMetadata = this.generateExpressionMetadata(completedData, multidimensionalFeatures);

    return {
      ...completedData,
      _enhanced: true,
      _qualityScore: qualityMetrics.overallScore,
      _features: multidimensionalFeatures,
      _metadata: expressionMetadata,
      _inferenceLevel: qualityMetrics.inferenceLevel
    };
  }

  /**
   * 高度特徴抽出
   */
  extractAdvancedFeatures(data) {
    const keywords = data['キーワード'] || [];
    const score = data['S7_総合評価スコア'] || 50;
    const stance = data['S5_主体性推奨スタンス'] || '中立';
    const risk = data['S4_リスク'] || 0;
    const volatility = data['S6_変動性スコア'] || 50;

    return {
      // 感情特性分析
      emotionalProfile: this.analyzeEmotionalProfile(keywords, score),
      
      // 行動特性分析
      actionProfile: this.analyzeActionProfile(stance, risk, volatility),
      
      // 時間軸特性分析
      temporalProfile: this.analyzeTemporalProfile(data),
      
      // 社会性特性分析
      socialProfile: this.analyzeSocialProfile(keywords, data),
      
      // 創造性指標
      creativityIndex: this.calculateCreativityIndex(keywords, volatility),
      
      // 安定性指標
      stabilityIndex: this.calculateStabilityIndex(data),
      
      // 成長可能性指標
      growthPotential: this.calculateGrowthPotential(data)
    };
  }

  /**
   * 感情特性分析
   */
  analyzeEmotionalProfile(keywords, score) {
    const positiveKeywords = ['吉', 'チャンス', '発展', '成功', '協力', '安定'];
    const negativeKeywords = ['凶', '危険', 'リスク', '困難', '停滞', '混乱'];
    const neutralKeywords = ['変化', '調整', '準備', '学習', '待機', '選択'];

    const positive = keywords.filter(k => positiveKeywords.some(pk => k.includes(pk))).length;
    const negative = keywords.filter(k => negativeKeywords.some(nk => k.includes(nk))).length;
    const neutral = keywords.filter(k => neutralKeywords.some(nu => k.includes(nu))).length;

    return {
      positivity: Math.min(100, (positive * 20) + (score > 60 ? 20 : 0)),
      negativity: Math.min(100, (negative * 20) + (score < 40 ? 20 : 0)),
      neutrality: Math.min(100, (neutral * 15) + (score >= 40 && score <= 60 ? 30 : 0)),
      emotionalStability: 100 - Math.abs(positive - negative) * 10
    };
  }

  /**
   * 行動特性分析
   */
  analyzeActionProfile(stance, risk, volatility) {
    const activeScore = stance === '能動' ? 80 : stance === '受動' ? 20 : 50;
    const riskTolerance = Math.max(0, 50 + risk);
    const adaptability = Math.min(100, volatility + 10);

    return {
      proactivity: activeScore,
      riskTolerance: riskTolerance,
      adaptability: adaptability,
      decisiveness: Math.min(100, activeScore + (100 - Math.abs(risk)) / 2)
    };
  }

  /**
   * 時間軸特性分析
   */
  analyzeTemporalProfile(data) {
    const keywords = data['キーワード'] || [];
    const shortTermKeywords = ['チャンス', '危機', '変化', 'タイミング'];
    const longTermKeywords = ['学習', '基礎', '安定', '持続', '発展'];
    const immediateKeywords = ['危険', '緊急', '即座', '今'];

    return {
      shortTermFocus: keywords.filter(k => shortTermKeywords.some(st => k.includes(st))).length * 25,
      longTermFocus: keywords.filter(k => longTermKeywords.some(lt => k.includes(lt))).length * 25,
      immediateFocus: keywords.filter(k => immediateKeywords.some(im => k.includes(im))).length * 25,
      timeBalance: 50 // 基準値
    };
  }

  /**
   * 社会性特性分析
   */
  analyzeSocialProfile(keywords, data) {
    const cooperationKeywords = ['協力', 'チーム', '組織', 'パートナー', '仲間'];
    const leadershipKeywords = ['リーダー', '指導', '統率', '決断', '責任'];
    const independenceKeywords = ['独立', '自律', '個人', '単独', '自分'];

    const cooperation = keywords.filter(k => cooperationKeywords.some(ck => k.includes(ck))).length;
    const leadership = keywords.filter(k => leadershipKeywords.some(lk => k.includes(lk))).length;
    const independence = keywords.filter(k => independenceKeywords.some(ik => k.includes(ik))).length;

    return {
      cooperation: Math.min(100, cooperation * 30 + 20),
      leadership: Math.min(100, leadership * 30 + 20),
      independence: Math.min(100, independence * 30 + 20),
      socialAdaptability: Math.min(100, (cooperation + leadership) * 15 + 40)
    };
  }

  /**
   * 創造性指標計算
   */
  calculateCreativityIndex(keywords, volatility) {
    const creativeKeywords = ['変化', '新しい', '創造', '革新', '発想', '挑戦'];
    const creativeCount = keywords.filter(k => creativeKeywords.some(ck => k.includes(ck))).length;
    
    return Math.min(100, (creativeCount * 20) + (volatility * 0.3) + 10);
  }

  /**
   * 安定性指標計算
   */
  calculateStabilityIndex(data) {
    const stabilityScore = data['S3_安定性スコア'] || 50;
    const risk = Math.abs(data['S4_リスク'] || 0);
    const volatility = data['S6_変動性スコア'] || 50;

    return Math.max(0, stabilityScore - (risk * 0.5) - (volatility * 0.3));
  }

  /**
   * 成長可能性指標計算
   */
  calculateGrowthPotential(data) {
    const potential = data['S2_ポテンシャル'] || 50;
    const baseScore = data['S1_基本スコア'] || 50;
    const volatility = data['S6_変動性スコア'] || 50;

    return Math.min(100, (potential * 0.5) + (baseScore * 0.3) + (volatility * 0.2));
  }

  /**
   * 表現生成用メタデータ生成
   */
  generateExpressionMetadata(data, features) {
    return {
      // 表現トーン推奨
      recommendedTone: this.determineRecommendedTone(features),
      
      // 強調すべき要素
      emphasisPoints: this.identifyEmphasisPoints(data, features),
      
      // 注意点
      cautionAreas: this.identifyCautionAreas(data, features),
      
      // 表現優先度
      expressionPriority: this.calculateExpressionPriority(data, features),
      
      // HaQei統合度
      haqeiIntegrationLevel: this.calculateHaqeiIntegrationLevel(data, features)
    };
  }

  /**
   * 推奨トーン決定
   */
  determineRecommendedTone(features) {
    const emotional = features.emotionalProfile;
    const action = features.actionProfile;

    if (emotional.positivity > 70) return 'optimistic';
    if (emotional.negativity > 70) return 'cautious';
    if (action.proactivity > 70) return 'dynamic';
    if (features.stabilityIndex > 70) return 'stable';
    return 'balanced';
  }

  /**
   * 強調ポイント特定
   */
  identifyEmphasisPoints(data, features) {
    const points = [];
    
    if (features.growthPotential > 70) points.push('成長可能性');
    if (features.stabilityIndex > 70) points.push('安定性');
    if (features.creativityIndex > 70) points.push('創造性');
    if (features.socialProfile.cooperation > 70) points.push('協力性');
    if (features.actionProfile.proactivity > 70) points.push('主体性');

    return points.length > 0 ? points : ['バランス'];
  }

  /**
   * 注意領域特定
   */
  identifyCautionAreas(data, features) {
    const areas = [];
    
    if (features.actionProfile.riskTolerance < 30) areas.push('リスク管理');
    if (features.stabilityIndex < 30) areas.push('安定性確保');
    if (features.emotionalProfile.emotionalStability < 50) areas.push('感情制御');
    if (features.socialProfile.socialAdaptability < 40) areas.push('社会適応');

    return areas;
  }

  /**
   * 表現優先度計算
   */
  calculateExpressionPriority(data, features) {
    const score = data['S7_総合評価スコア'] || 50;
    const complexity = Object.values(features).reduce((sum, f) => 
      sum + (typeof f === 'object' ? Object.keys(f).length : 1), 0
    );

    return {
      score: Math.min(100, score + complexity),
      level: score > 70 ? 'high' : score > 40 ? 'medium' : 'low'
    };
  }

  /**
   * HaQei統合レベル計算
   */
  calculateHaqeiIntegrationLevel(data, features) {
    // データ完整性
    const completeness = this.calculateDataCompleteness(data);
    
    // 特徴豊富度
    const featureRichness = this.calculateFeatureRichness(features);
    
    // 表現適合度
    const expressionFitness = this.calculateExpressionFitness(data, features);

    const overallLevel = (completeness + featureRichness + expressionFitness) / 3;

    return {
      level: overallLevel,
      grade: overallLevel > 80 ? 'A' : overallLevel > 60 ? 'B' : overallLevel > 40 ? 'C' : 'D',
      readiness: overallLevel > 70
    };
  }

  /**
   * 補助メソッド群
   */
  getLinePosition(lineName) {
    const positions = {
      '初九': 0, '初六': 0,
      '九二': 1, '六二': 1,
      '九三': 2, '六三': 2,
      '九四': 3, '六四': 3,
      '九五': 4, '六五': 4,
      '上九': 5, '上六': 5
    };
    return positions[lineName] || 0;
  }

  calculateDataCompleteness(data) {
    const requiredFields = ['卦名', 'キーワード', '現代解釈の要約', 'S7_総合評価スコア'];
    const availableFields = requiredFields.filter(field => data[field] != null);
    return (availableFields.length / requiredFields.length) * 100;
  }

  calculateFeatureRichness(features) {
    const totalFeatures = Object.keys(features).length;
    return Math.min(100, totalFeatures * 10);
  }

  calculateExpressionFitness(data, features) {
    const hasKeywords = (data['キーワード'] || []).length > 0;
    const hasInterpretation = !!(data['現代解釈の要約']);
    const hasScore = !!(data['S7_総合評価スコア']);
    
    return (hasKeywords ? 40 : 0) + (hasInterpretation ? 40 : 0) + (hasScore ? 20 : 0);
  }

  /**
   * 推論データ生成（フォールバック）
   */
  generateInferredData(hexagramIndex, lineIndex) {
    console.log(`🔮 推論データ生成: 卦${hexagramIndex} 爻${lineIndex}`);
    
    return {
      '卦番号': hexagramIndex,
      '卦名': `推論卦${hexagramIndex}`,
      '爻': `推論爻${lineIndex + 1}`,
      'キーワード': this.inferenceEngine.generateInferredKeywords(hexagramIndex, lineIndex),
      '現代解釈の要約': this.inferenceEngine.generateInferredInterpretation(hexagramIndex, lineIndex),
      'S7_総合評価スコア': this.inferenceEngine.generateInferredScore(hexagramIndex, lineIndex),
      'S5_主体性推奨スタンス': this.inferenceEngine.generateInferredStance(hexagramIndex, lineIndex),
      _inferred: true,
      _confidence: 0.7
    };
  }
}

/**
 * H384推論エンジン
 */
class H384InferenceEngine {
  constructor() {
    this.patterns = this.initializePatterns();
  }

  initializePatterns() {
    return {
      hexagramPatterns: {
        1: { theme: '創造', energy: 'high', stability: 'medium' },
        2: { theme: '受容', energy: 'low', stability: 'high' },
        3: { theme: '始動', energy: 'medium', stability: 'low' },
        4: { theme: '学習', energy: 'low', stability: 'medium' },
        5: { theme: '待機', energy: 'medium', stability: 'high' },
        6: { theme: '争い', energy: 'high', stability: 'low' },
        7: { theme: '組織', energy: 'high', stability: 'medium' },
        8: { theme: '協力', energy: 'medium', stability: 'high' }
      },
      linePatterns: {
        0: { position: '初期', tendency: '慎重' },
        1: { position: '発展', tendency: '積極' },
        2: { position: '転換', tendency: '注意' },
        3: { position: '重要', tendency: '決断' },
        4: { position: '頂点', tendency: '統制' },
        5: { position: '完了', tendency: '謙虚' }
      }
    };
  }

  fillMissingData(data, hexagramIndex, lineIndex) {
    const result = { ...data };
    
    if (!result['キーワード']) {
      result['キーワード'] = this.generateInferredKeywords(hexagramIndex, lineIndex);
    }
    
    if (!result['現代解釈の要約']) {
      result['現代解釈の要約'] = this.generateInferredInterpretation(hexagramIndex, lineIndex);
    }
    
    if (!result['S7_総合評価スコア']) {
      result['S7_総合評価スコア'] = this.generateInferredScore(hexagramIndex, lineIndex);
    }

    return result;
  }

  generateInferredKeywords(hexagramIndex, lineIndex) {
    const hexPattern = this.patterns.hexagramPatterns[hexagramIndex] || this.patterns.hexagramPatterns[1];
    const linePattern = this.patterns.linePatterns[lineIndex] || this.patterns.linePatterns[0];
    
    const baseKeywords = [hexPattern.theme, linePattern.tendency, '調整'];
    return baseKeywords;
  }

  generateInferredInterpretation(hexagramIndex, lineIndex) {
    const hexPattern = this.patterns.hexagramPatterns[hexagramIndex] || this.patterns.hexagramPatterns[1];
    const linePattern = this.patterns.linePatterns[lineIndex] || this.patterns.linePatterns[0];
    
    return `${linePattern.position}段階での${hexPattern.theme}に関する状況。${linePattern.tendency}な対応が推奨されます。`;
  }

  generateInferredScore(hexagramIndex, lineIndex) {
    const hexPattern = this.patterns.hexagramPatterns[hexagramIndex] || this.patterns.hexagramPatterns[1];
    const linePattern = this.patterns.linePatterns[lineIndex] || this.patterns.linePatterns[0];
    
    let baseScore = 50;
    
    if (hexPattern.energy === 'high') baseScore += 10;
    if (hexPattern.stability === 'high') baseScore += 10;
    if (lineIndex === 1 || lineIndex === 4) baseScore += 5; // 良いポジション
    
    return Math.min(100, Math.max(0, baseScore + Math.floor(Math.random() * 20) - 10));
  }

  generateInferredStance(hexagramIndex, lineIndex) {
    const hexPattern = this.patterns.hexagramPatterns[hexagramIndex] || this.patterns.hexagramPatterns[1];
    
    if (hexPattern.energy === 'high') return '能動';
    if (hexPattern.energy === 'low') return '受動';
    return '中立';
  }
}

/**
 * データ品質分析器
 */
class DataQualityAnalyzer {
  analyzeDataQuality(data) {
    const completeness = this.calculateCompleteness(data);
    const consistency = this.calculateConsistency(data);
    const accuracy = this.calculateAccuracy(data);
    
    const overallScore = (completeness + consistency + accuracy) / 3;
    
    return {
      completeness,
      consistency,
      accuracy,
      overallScore,
      inferenceLevel: overallScore < 70 ? 'high' : overallScore < 90 ? 'medium' : 'low',
      qualityGrade: overallScore > 90 ? 'A' : overallScore > 80 ? 'B' : overallScore > 70 ? 'C' : 'D'
    };
  }

  calculateCompleteness(data) {
    const expectedFields = ['卦名', 'キーワード', '現代解釈の要約', 'S7_総合評価スコア', 'S5_主体性推奨スタンス'];
    const presentFields = expectedFields.filter(field => data[field] != null && data[field] !== '');
    return (presentFields.length / expectedFields.length) * 100;
  }

  calculateConsistency(data) {
    let score = 100;
    
    // スコア値の妥当性
    const totalScore = data['S7_総合評価スコア'];
    if (totalScore && (totalScore < 0 || totalScore > 100)) score -= 20;
    
    // キーワードと解釈の整合性
    const keywords = data['キーワード'] || [];
    const interpretation = data['現代解釈の要約'] || '';
    if (keywords.length > 0 && interpretation && !this.checkKeywordInterpretationAlignment(keywords, interpretation)) {
      score -= 15;
    }
    
    return Math.max(0, score);
  }

  calculateAccuracy(data) {
    // 基本的な妥当性チェック
    let score = 100;
    
    if (data['S7_総合評価スコア'] && (isNaN(data['S7_総合評価スコア']) || data['S7_総合評価スコア'] < 0)) {
      score -= 30;
    }
    
    if (data['S5_主体性推奨スタンス'] && !['能動', '受動', '中立'].includes(data['S5_主体性推奨スタンス'])) {
      score -= 20;
    }
    
    return Math.max(0, score);
  }

  checkKeywordInterpretationAlignment(keywords, interpretation) {
    // 簡易的な整合性チェック
    return keywords.some(keyword => interpretation.includes(keyword)) || interpretation.length > 10;
  }
}

// グローバルに公開
window.EnhancedH384DataExtractor = EnhancedH384DataExtractor;