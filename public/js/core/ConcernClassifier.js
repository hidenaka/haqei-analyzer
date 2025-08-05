/**
 * 悩み分類器 - HAQEI Future Simulator
 * 
 * 目的：
 * - ユーザーの悩みを自動的に分類
 * - 最適な易経変化パターンの推奨
 * - 個人特性と状況を考慮した適応的分析
 * 
 * 分類軸：
 * - 緊急度（high/medium/low）
 * - 重要度（high/medium/low）
 * - 性質（relationship/growth/decision/anxiety/work/health/spiritual）
 * - 範囲（personal/family/work/social/universal）
 */

class ConcernClassifier {
  constructor() {
    console.log('🔍 悩み分類器初期化開始');
    
    // 分類用キーワード辞書
    this.keywordDictionary = this.initializeKeywordDictionary();
    
    // 感情分析パターン
    this.emotionalPatterns = this.initializeEmotionalPatterns();
    
    // 緊急度判定ルール
    this.urgencyRules = this.initializeUrgencyRules();
    
    // 重要度判定ルール
    this.importanceRules = this.initializeImportanceRules();
    
    console.log('✅ 悩み分類器初期化完了');
  }
  
  /**
   * メイン分類メソッド
   */
  async classifyConcern(inputText, emotionalAnalysis, contextualAnalysis) {
    console.log('🎯 悩み分類開始');
    
    try {
      // 前処理
      const normalizedText = this.normalizeText(inputText);
      
      // 各軸での分析
      const urgency = this.analyzeUrgency(normalizedText, emotionalAnalysis);
      const importance = this.analyzeImportance(normalizedText, contextualAnalysis);
      const nature = this.analyzeNature(normalizedText, emotionalAnalysis);
      const scope = this.analyzeScope(normalizedText, contextualAnalysis);
      
      // 分類の信頼度計算
      const confidence = this.calculateClassificationConfidence({
        urgency, importance, nature, scope
      });
      
      // 推奨パターンの生成
      const recommendedPatterns = this.generatePatternRecommendations({
        urgency, importance, nature, scope
      });
      
      const result = {
        urgency: {
          level: urgency.level,
          score: urgency.score,
          indicators: urgency.indicators
        },
        importance: {
          level: importance.level,
          score: importance.score,
          indicators: importance.indicators
        },
        nature: {
          primary: nature.primary,
          secondary: nature.secondary,
          confidence: nature.confidence
        },
        scope: {
          level: scope.level,
          breadth: scope.breadth,
          affectedAreas: scope.affectedAreas
        },
        recommendedPatterns,
        confidence,
        metadata: {
          textLength: inputText.length,
          analysisTimestamp: new Date().toISOString(),
          version: '1.0.0'
        }
      };
      
      console.log('✅ 悩み分類完了:', result);
      return result;
      
    } catch (error) {
      console.error('❌ 分類エラー:', error);
      return this.generateFallbackClassification(inputText);
    }
  }
  
  /**
   * 緊急度分析
   */
  analyzeUrgency(text, emotionalAnalysis) {
    let urgencyScore = 0;
    const indicators = [];
    
    // 時間的切迫感の検出
    const timeKeywords = ['急ぎ', '今すぐ', '至急', '緊急', 'すぐに', '明日', '今日', '締切'];
    timeKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        urgencyScore += 0.3;
        indicators.push(`時間的切迫: ${keyword}`);
      }
    });
    
    // 危機的状況の検出
    const crisisKeywords = ['危険', '危機', '倒産', '破綻', '病気', '事故', '離婚', '失職'];
    crisisKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        urgencyScore += 0.4;
        indicators.push(`危機的状況: ${keyword}`);
      }
    });
    
    // 感情的切迫感
    if (emotionalAnalysis && emotionalAnalysis.intensity > 0.7) {
      urgencyScore += 0.2;
      indicators.push(`高い感情的強度: ${emotionalAnalysis.intensity}`);
    }
    
    // 否定的感情の強さ
    if (emotionalAnalysis && emotionalAnalysis.primary === 'negative') {
      urgencyScore += 0.1;
      indicators.push('否定的感情');
    }
    
    // レベル判定
    let level;
    if (urgencyScore >= 0.7) level = 'high';
    else if (urgencyScore >= 0.4) level = 'medium';
    else level = 'low';
    
    return {
      level,
      score: Math.min(urgencyScore, 1.0),
      indicators
    };
  }
  
  /**
   * 重要度分析
   */
  analyzeImportance(text, contextualAnalysis) {
    let importanceScore = 0;
    const indicators = [];
    
    // 人生の重要領域への影響
    const lifeAreas = {
      health: ['健康', '病気', '体調', '医者', '治療'],
      relationship: ['結婚', '離婚', '恋愛', '友人', '家族', '人間関係'],
      career: ['仕事', '転職', '昇進', '会社', '職場', 'キャリア'],
      finance: ['お金', '借金', '投資', '貯金', '収入', '支出'],
      education: ['学校', '受験', '勉強', '資格', '教育'],
      spiritual: ['人生', '生きがい', '価値観', '哲学', '宗教']
    };
    
    Object.entries(lifeAreas).forEach(([area, keywords]) => {
      keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          importanceScore += 0.15;
          indicators.push(`重要領域(${area}): ${keyword}`);
        }
      });
    });
    
    // 長期的影響の検出
    const longTermKeywords = ['将来', '未来', '一生', '人生', '永続的', '長期的'];
    longTermKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        importanceScore += 0.2;
        indicators.push(`長期的影響: ${keyword}`);
      }
    });
    
    // 他者への影響
    const othersKeywords = ['家族', '子供', '部下', 'チーム', '会社', '社会'];
    othersKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        importanceScore += 0.1;
        indicators.push(`他者への影響: ${keyword}`);
      }
    });
    
    // 文脈分析からの重要度
    if (contextualAnalysis && contextualAnalysis.confidence > 0.6) {
      importanceScore += 0.1;
      indicators.push('高い文脈信頼度');
    }
    
    // レベル判定
    let level;
    if (importanceScore >= 0.6) level = 'high';
    else if (importanceScore >= 0.3) level = 'medium';
    else level = 'low';
    
    return {
      level,
      score: Math.min(importanceScore, 1.0),
      indicators
    };
  }
  
  /**
   * 性質分析
   */
  analyzeNature(text, emotionalAnalysis) {
    const natureScores = {
      relationship: 0,
      growth: 0,
      decision: 0,
      anxiety: 0,
      work: 0,
      health: 0,
      spiritual: 0
    };
    
    // 人間関係
    const relationshipKeywords = ['関係', '相手', '友人', '恋人', '夫婦', '親子', '同僚', 'コミュニケーション'];
    relationshipKeywords.forEach(keyword => {
      if (text.includes(keyword)) natureScores.relationship += 0.2;
    });
    
    // 成長・学習
    const growthKeywords = ['成長', '学習', '向上', '発展', 'スキル', '能力', '経験'];
    growthKeywords.forEach(keyword => {
      if (text.includes(keyword)) natureScores.growth += 0.2;
    });
    
    // 決断・選択
    const decisionKeywords = ['選択', '決断', '決める', '選ぶ', '判断', 'どちら', '迷い'];
    decisionKeywords.forEach(keyword => {
      if (text.includes(keyword)) natureScores.decision += 0.25;
    });
    
    // 不安・心配
    const anxietyKeywords = ['不安', '心配', '恐れ', '怖い', '緊張', 'ストレス'];
    anxietyKeywords.forEach(keyword => {
      if (text.includes(keyword)) natureScores.anxiety += 0.2;
    });
    
    // 仕事・キャリア
    const workKeywords = ['仕事', '職場', '会社', '転職', '昇進', 'プロジェクト'];
    workKeywords.forEach(keyword => {
      if (text.includes(keyword)) natureScores.work += 0.2;
    });
    
    // 健康
    const healthKeywords = ['健康', '病気', '体調', '医者', '症状', '治療'];
    healthKeywords.forEach(keyword => {
      if (text.includes(keyword)) natureScores.health += 0.25;
    });
    
    // 精神的・霊的
    const spiritualKeywords = ['人生', '意味', '価値観', '哲学', '宗教', '魂', '精神'];
    spiritualKeywords.forEach(keyword => {
      if (text.includes(keyword)) natureScores.spiritual += 0.2;
    });
    
    // 感情分析からの補完
    if (emotionalAnalysis) {
      if (emotionalAnalysis.primary === 'anxiety') {
        natureScores.anxiety += 0.3;
      }
      if (emotionalAnalysis.primary === 'confusion') {
        natureScores.decision += 0.2;
      }
    }
    
    // 最高スコアと次点を特定
    const sortedNatures = Object.entries(natureScores)
      .sort(([,a], [,b]) => b - a);
    
    const primary = sortedNatures[0][0];
    const secondary = sortedNatures[1][0];
    const confidence = sortedNatures[0][1];
    
    return {
      primary,
      secondary,
      confidence: Math.min(confidence, 1.0),
      allScores: natureScores
    };
  }
  
  /**
   * 範囲分析
   */
  analyzeScope(text, contextualAnalysis) {
    let scopeScore = 0;
    const affectedAreas = [];
    
    // 個人レベル
    const personalKeywords = ['自分', '私', '個人的', '内面', '心'];
    personalKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        scopeScore = Math.max(scopeScore, 1);
        affectedAreas.push('個人');
      }
    });
    
    // 家族レベル
    const familyKeywords = ['家族', '両親', '子供', '兄弟', '姉妹', '配偶者'];
    familyKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        scopeScore = Math.max(scopeScore, 2);
        affectedAreas.push('家族');
      }
    });
    
    // 職場レベル
    const workKeywords = ['職場', '会社', '同僚', '部下', '上司', 'チーム'];
    workKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        scopeScore = Math.max(scopeScore, 3);
        affectedAreas.push('職場');
      }
    });
    
    // 社会レベル
    const socialKeywords = ['社会', '地域', 'コミュニティ', '世間', '社会貢献'];
    socialKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        scopeScore = Math.max(scopeScore, 4);
        affectedAreas.push('社会');
      }
    });
    
    // 普遍レベル
    const universalKeywords = ['人類', '世界', '地球', '宇宙', '普遍的', '全人類'];
    universalKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        scopeScore = Math.max(scopeScore, 5);
        affectedAreas.push('普遍');
      }
    });
    
    // レベル判定
    const levels = ['', 'personal', 'family', 'work', 'social', 'universal'];
    const level = levels[scopeScore] || 'personal';
    
    return {
      level,
      breadth: scopeScore,
      affectedAreas: [...new Set(affectedAreas)]
    };
  }
  
  /**
   * パターン推奨生成
   */
  generatePatternRecommendations({urgency, importance, nature, scope}) {
    const recommendations = [];
    
    // 緊急度・重要度マトリックス
    if (urgency.level === 'high' && importance.level === 'high') {
      recommendations.push({
        pattern: 'hexagram_change',
        priority: 1,
        reason: '緊急かつ重要な問題には根本的変化が必要'
      });
      recommendations.push({
        pattern: 'line_change',
        priority: 2,
        reason: '具体的な変化ポイントの特定'
      });
    }
    
    if (urgency.level === 'low' && importance.level === 'high') {
      recommendations.push({
        pattern: 'sequence_logic',
        priority: 1,
        reason: '重要だが急がない問題には長期的視点が有効'
      });
      recommendations.push({
        pattern: 'line_progression',
        priority: 2,
        reason: '段階的な発展プロセスの理解'
      });
    }
    
    if (urgency.level === 'high' && importance.level === 'low') {
      recommendations.push({
        pattern: 'opposite_hexagram',
        priority: 1,
        reason: '急を要するが重要でない問題には極端なアプローチも検討'
      });
    }
    
    // 性質による推奨
    switch (nature.primary) {
      case 'relationship':
        recommendations.push({
          pattern: 'reversed_hexagram',
          priority: 1,
          reason: '人間関係の問題には相手の視点理解が重要'
        });
        break;
        
      case 'anxiety':
        recommendations.push({
          pattern: 'mutual_hexagram',
          priority: 1,
          reason: '不安の根源には隠れた要因の理解が必要'
        });
        break;
        
      case 'decision':
        recommendations.push({
          pattern: 'hexagram_change',
          priority: 1,
          reason: '重要な決断には未来の状態を明確に見る必要がある'
        });
        recommendations.push({
          pattern: 'opposite_hexagram',
          priority: 2,
          reason: '対極的選択肢の検討も重要'
        });
        break;
        
      case 'spiritual':
        recommendations.push({
          pattern: 'sequence_logic',
          priority: 1,
          reason: '精神的問題には人生全体の流れの理解が重要'
        });
        break;
    }
    
    // 範囲による調整
    if (scope.level === 'universal' || scope.level === 'social') {
      recommendations.push({
        pattern: 'sequence_logic',
        priority: 1,
        reason: '広範囲な影響を持つ問題には大局的視点が必要'
      });
    }
    
    // 重複除去と優先度調整
    const uniqueRecommendations = this.deduplicateRecommendations(recommendations);
    
    return uniqueRecommendations.slice(0, 4); // 最大4パターンまで
  }
  
  /**
   * 分類信頼度計算
   */
  calculateClassificationConfidence({urgency, importance, nature, scope}) {
    const factors = [
      urgency.score,
      importance.score,
      nature.confidence,
      scope.breadth / 5
    ];
    
    const averageScore = factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
    const consistency = this.calculateConsistency(factors);
    
    return Math.min(averageScore * consistency, 1.0);
  }
  
  // ===== ヘルパーメソッド =====
  
  normalizeText(text) {
    return text
      .toLowerCase()
      .replace(/[！？。、]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  calculateConsistency(scores) {
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    return Math.max(0.5, 1 - Math.sqrt(variance));
  }
  
  deduplicateRecommendations(recommendations) {
    const seen = new Set();
    return recommendations.filter(rec => {
      if (seen.has(rec.pattern)) return false;
      seen.add(rec.pattern);
      return true;
    }).sort((a, b) => a.priority - b.priority);
  }
  
  generateFallbackClassification(inputText) {
    return {
      urgency: { level: 'medium', score: 0.5, indicators: ['フォールバック分類'] },
      importance: { level: 'medium', score: 0.5, indicators: ['フォールバック分類'] },
      nature: { primary: 'general', secondary: 'anxiety', confidence: 0.3 },
      scope: { level: 'personal', breadth: 1, affectedAreas: ['個人'] },
      recommendedPatterns: [
        { pattern: 'line_progression', priority: 1, reason: 'デフォルト推奨' },
        { pattern: 'mutual_hexagram', priority: 2, reason: 'デフォルト推奨' }
      ],
      confidence: 0.3,
      metadata: {
        textLength: inputText.length,
        analysisTimestamp: new Date().toISOString(),
        version: '1.0.0',
        fallback: true
      }
    };
  }
  
  // 初期化メソッド群
  initializeKeywordDictionary() {
    return {
      // 実装は長いため省略、実際の実装では詳細な辞書を定義
    };
  }
  
  initializeEmotionalPatterns() {
    return {
      // 感情パターンの定義
    };
  }
  
  initializeUrgencyRules() {
    return {
      // 緊急度判定ルール
    };
  }
  
  initializeImportanceRules() {
    return {
      // 重要度判定ルール
    };
  }
}

// グローバルスコープに登録
if (typeof window !== 'undefined') {
  window.ConcernClassifier = ConcernClassifier;
}