/**
 * キーワードデータベース拡張エンジン
 * SNS投稿パターンを既存のキーワードデータベースに統合
 */

class KeywordExpansionEngine {
  constructor() {
    this.snsPatterns = window.SNS_WORRY_PATTERNS || SNS_WORRY_PATTERNS;
    this.emotionExpressions = window.EMOTION_EXPRESSIONS || EMOTION_EXPRESSIONS;
    this.contextMapping = window.WORRY_CONTEXT_MAPPING || WORRY_CONTEXT_MAPPING;
    this.expandedDatabase = {};
  }

  /**
   * SNSパターンを卦に自動マッピング
   */
  mapSNSPatternsToHexagrams() {
    const mappingRules = {
      // 仕事・キャリア系
      1: ['work_career.burnout', 'work_career.career_anxiety'], // 乾為天 - リーダーシップ・天命
      3: ['work_career.career_anxiety', 'education_career.career_path'], // 水雷屯 - 新しい始まり
      5: ['financial.financial_planning', 'work_career.workplace_relationships'], // 水天需 - 待つ時
      6: ['work_career.workplace_relationships', 'relationships.social_anxiety'], // 天水訟 - 争い
      14: ['work_career.career_anxiety', 'financial.income_anxiety'], // 火天大有 - 大きな成功
      
      // 人間関係系
      8: ['relationships.family', 'relationships.friendship'], // 水地比 - 親しみ
      13: ['relationships.friendship', 'work_career.workplace_relationships'], // 天火同人 - 仲間
      31: ['love_marriage.relationship_issues', 'love_marriage.single_anxiety'], // 沢山咸 - 感応
      37: ['love_marriage.marriage_problems', 'parenting_family.child_rearing'], // 風火家人 - 家族
      
      // メンタルヘルス系
      29: ['mental_health.depression_anxiety', 'mental_health.stress_burnout'], // 坎為水 - 困難
      47: ['mental_health.depression_anxiety', 'mental_health.self_esteem'], // 沢水困 - 困窮
      58: ['mental_health.self_esteem', 'relationships.social_anxiety'], // 兌為沢 - 喜び
      
      // 成長・学習系
      4: ['education_career.study_problems', 'education_career.school_life'], // 山水蒙 - 蒙昧
      26: ['work_career.career_anxiety', 'education_career.career_path'], // 山天大畜 - 大きな蓄積
      42: ['self_identity.life_purpose', 'education_career.career_path'], // 風雷益 - 増益
      46: ['work_career.career_anxiety', 'self_identity.life_purpose'], // 地風升 - 上昇
      
      // 家族・介護系
      18: ['parenting_family.pregnancy_childbirth', 'elderly_care.parent_care'], // 山風蠱 - 腐敗を正す
      37: ['parenting_family.child_rearing', 'relationships.family'], // 風火家人 - 家族
      41: ['elderly_care.parent_care', 'financial.money_problems'], // 山沢損 - 損失
      53: ['parenting_family.work_life_balance', 'elderly_care.own_aging'], // 風山漸 - 漸進
      
      // 健康・身体系
      27: ['health_body.physical_health', 'health_body.body_image'], // 山雷頤 - 養う
      48: ['health_body.mental_physical_connection', 'mental_health.depression_anxiety'], // 水風井 - 井戸
      62: ['health_body.body_image', 'self_identity.age_related'], // 雷山小過 - 小さな過ち
      
      // 金銭系
      5: ['financial.money_problems', 'financial.financial_planning'], // 水天需
      14: ['financial.income_anxiety', 'work_career.burnout'], // 火天大有
      48: ['financial.money_problems', 'financial.income_anxiety'], // 水風井
      50: ['financial.financial_planning', 'work_career.career_anxiety'], // 火風鼎
    };

    return mappingRules;
  }

  /**
   * 感情表現を組み込んだ拡張キーワード生成
   */
  generateEmotionalKeywords(baseKeywords, emotionType = 'moderate') {
    const expandedKeywords = [];
    const intensity = this.emotionExpressions.intensity[emotionType] || [];
    const temporal = this.emotionExpressions.temporal.continuous;
    const colloquial = this.emotionExpressions.colloquial.endings;

    baseKeywords.forEach(keyword => {
      // 基本キーワード
      expandedKeywords.push(keyword);
      
      // 強度を加えたバリエーション
      intensity.forEach(intensifier => {
        expandedKeywords.push(`${intensifier}${keyword}`);
      });
      
      // 時間表現を加えたバリエーション
      temporal.forEach(time => {
        expandedKeywords.push(`${time}${keyword}`);
      });
      
      // 口語的な語尾
      colloquial.forEach(ending => {
        expandedKeywords.push(`${keyword}${ending}`);
      });
    });

    return [...new Set(expandedKeywords)]; // 重複削除
  }

  /**
   * 特定の卦に対してSNSパターンを適用
   */
  expandHexagramKeywords(hexagramNumber, existingData) {
    const mappingRules = this.mapSNSPatternsToHexagrams();
    const patterns = mappingRules[hexagramNumber] || [];
    
    const expandedPositive = [...(existingData.positive_keywords || [])];
    const expandedNegative = [...(existingData.negative_keywords || [])];
    
    patterns.forEach(patternPath => {
      const [category, subcategory] = patternPath.split('.');
      const snsKeywords = this.snsPatterns[category]?.[subcategory] || [];
      
      // SNSパターンを感情的に分類
      snsKeywords.forEach(phrase => {
        if (this.isPositivePhrase(phrase)) {
          expandedPositive.push(this.phraseToKeywords(phrase));
        } else {
          expandedNegative.push(this.phraseToKeywords(phrase));
        }
      });
    });
    
    return {
      positive_keywords: this.deduplicateKeywordArrays(expandedPositive),
      negative_keywords: this.deduplicateKeywordArrays(expandedNegative)
    };
  }

  /**
   * フレーズがポジティブかネガティブか判定
   */
  isPositivePhrase(phrase) {
    const negativeIndicators = [
      'つらい', '苦しい', '嫌', '無理', 'できない', '失敗',
      '不安', '怖い', '悲しい', '困る', 'ダメ', '最悪'
    ];
    
    return !negativeIndicators.some(indicator => phrase.includes(indicator));
  }

  /**
   * SNSフレーズをキーワード配列に変換
   */
  phraseToKeywords(phrase) {
    // 長いフレーズを意味のある単位に分解
    const keywords = [];
    
    // そのままのフレーズ
    keywords.push(phrase);
    
    // 助詞で分割してキーワード抽出
    const particles = ['が', 'を', 'に', 'で', 'から', 'まで', 'の', 'は'];
    let segments = [phrase];
    
    particles.forEach(particle => {
      const newSegments = [];
      segments.forEach(segment => {
        const parts = segment.split(particle);
        newSegments.push(...parts.filter(p => p.length > 2));
      });
      segments = newSegments;
    });
    
    keywords.push(...segments);
    
    // 動詞の原形抽出（簡易版）
    const verbEndings = ['する', 'ない', 'たい', 'れる', 'られる'];
    segments.forEach(segment => {
      verbEndings.forEach(ending => {
        if (segment.endsWith(ending)) {
          keywords.push(segment.slice(0, -ending.length));
        }
      });
    });
    
    return keywords.filter(k => k.length > 1);
  }

  /**
   * キーワード配列の重複を削除
   */
  deduplicateKeywordArrays(keywordArrays) {
    const seen = new Set();
    const result = [];
    
    keywordArrays.forEach(array => {
      if (Array.isArray(array)) {
        const uniqueArray = array.filter(keyword => {
          if (!seen.has(keyword)) {
            seen.add(keyword);
            return true;
          }
          return false;
        });
        if (uniqueArray.length > 0) {
          result.push(uniqueArray);
        }
      }
    });
    
    return result;
  }

  /**
   * 全体的な拡張処理
   */
  expandAllHexagrams(originalDatabase) {
    const expanded = {};
    
    // 各卦に対して拡張処理を実行
    Object.keys(originalDatabase).forEach(hexNum => {
      const original = originalDatabase[hexNum];
      const expandedData = this.expandHexagramKeywords(parseInt(hexNum), original);
      
      // 感情表現の追加
      expandedData.positive_keywords = expandedData.positive_keywords.map(keywordArray => {
        if (Array.isArray(keywordArray)) {
          return this.generateEmotionalKeywords(keywordArray, 'moderate');
        }
        return keywordArray;
      });
      
      expandedData.negative_keywords = expandedData.negative_keywords.map(keywordArray => {
        if (Array.isArray(keywordArray)) {
          return this.generateEmotionalKeywords(keywordArray, 'high');
        }
        return keywordArray;
      });
      
      expanded[hexNum] = expandedData;
    });
    
    return expanded;
  }

  /**
   * 統計情報の生成
   */
  generateStatistics(expandedDatabase) {
    let totalKeywords = 0;
    let hexagramStats = {};
    
    Object.keys(expandedDatabase).forEach(hexNum => {
      const data = expandedDatabase[hexNum];
      let hexKeywordCount = 0;
      
      ['positive_keywords', 'negative_keywords'].forEach(type => {
        if (data[type]) {
          data[type].forEach(array => {
            if (Array.isArray(array)) {
              hexKeywordCount += array.length;
            }
          });
        }
      });
      
      hexagramStats[hexNum] = hexKeywordCount;
      totalKeywords += hexKeywordCount;
    });
    
    return {
      totalKeywords,
      averagePerHexagram: Math.round(totalKeywords / Object.keys(expandedDatabase).length),
      hexagramStats,
      coverage: {
        work: Object.keys(this.snsPatterns.work_career).length,
        love: Object.keys(this.snsPatterns.love_marriage).length,
        mental: Object.keys(this.snsPatterns.mental_health).length,
        relationships: Object.keys(this.snsPatterns.relationships).length,
        financial: Object.keys(this.snsPatterns.financial).length,
        health: Object.keys(this.snsPatterns.health_body).length,
        education: Object.keys(this.snsPatterns.education_career).length,
        identity: Object.keys(this.snsPatterns.self_identity).length,
        parenting: Object.keys(this.snsPatterns.parenting_family).length,
        elderly: Object.keys(this.snsPatterns.elderly_care).length
      }
    };
  }
}

// エクスポート
if (typeof window !== 'undefined') {
  window.KeywordExpansionEngine = KeywordExpansionEngine;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = KeywordExpansionEngine;
}