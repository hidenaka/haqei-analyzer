/**
 * Quick Analyzer 質問データ
 * 5つの質問による八卦診断のための質問定義
 */

window.QUICK_ANALYZER_QUESTIONS = [
  {
    id: "q1",
    text: "困難な課題に直面した時、あなたはまず...",
    type: "single_choice",
    category: "approach",
    weight: 1.0,
    description: "問題解決アプローチの特定",
    options: [
      {
        value: "A",
        text: "行動計画を立て、戦略的に進む",
        description: "計画的で戦略的なアプローチを好む",
        scoring: {
          trigrams: [1, 7], // 乾（創造的リーダーシップ）、艮（堅実な継続力）
          weight: 1.0,
          reasoning: "戦略的思考と継続力を重視する特性"
        }
      },
      {
        value: "B", 
        text: "直感を信じ、まず行動してみる",
        description: "直感的で行動重視のアプローチを好む",
        scoring: {
          trigrams: [4, 6], // 震（行動力）、坎（探求心）
          weight: 1.0,
          reasoning: "直感的行動力と探求心を重視する特性"
        }
      }
    ],
    metadata: {
      difficulty: "easy",
      estimatedTime: 10,
      tags: ["approach", "strategy", "decision-making"],
      version: "1.0"
    }
  },
  
  {
    id: "q2",
    text: "チームで何かを成し遂げた時、より喜びを感じるのは...",
    type: "single_choice",
    category: "motivation",
    weight: 1.0,
    description: "動機と価値観の特定",
    options: [
      {
        value: "A",
        text: "目標を達成した「達成感」そのもの",
        description: "成果と達成を重視する価値観",
        scoring: {
          trigrams: [1, 3], // 乾（目標達成）、離（情熱と知性）
          weight: 1.0,
          reasoning: "達成欲求と情熱的な取り組みを重視する特性"
        }
      },
      {
        value: "B",
        text: "仲間と喜びを分かち合う「一体感」",
        description: "協調性と人間関係を重視する価値観",
        scoring: {
          trigrams: [2, 8], // 兌（コミュニケーション）、坤（受容と協調）
          weight: 1.0,
          reasoning: "コミュニケーションと協調性を重視する特性"
        }
      }
    ],
    metadata: {
      difficulty: "medium",
      estimatedTime: 15,
      tags: ["motivation", "values", "teamwork"],
      version: "1.0"
    }
  },
  
  {
    id: "q3",
    text: "初めて会う人が多い場では...",
    type: "single_choice",
    category: "social",
    weight: 1.0,
    description: "社交性とコミュニケーションスタイルの特定",
    options: [
      {
        value: "A",
        text: "自分の知識や個性を発揮し、注目されたい",
        description: "外向的で自己表現を重視するスタイル",
        scoring: {
          trigrams: [3, 4], // 離（表現力）、震（エネルギッシュな存在感）
          weight: 1.0,
          reasoning: "表現力とエネルギッシュな行動力を重視する特性"
        }
      },
      {
        value: "B",
        text: "全体の調和を考え、聞き役に徹することが多い",
        description: "内向的で調和を重視するスタイル",
        scoring: {
          trigrams: [8, 5], // 坤（受容力）、巽（調整能力）
          weight: 1.0,
          reasoning: "受容力と調整能力を重視する特性"
        }
      }
    ],
    metadata: {
      difficulty: "easy",
      estimatedTime: 12,
      tags: ["social", "communication", "personality"],
      version: "1.0"
    }
  },
  
  {
    id: "q4",
    text: "休日の過ごし方として、より好むのは...",
    type: "single_choice",
    category: "lifestyle",
    weight: 1.0,
    description: "ライフスタイルと学習志向の特定",
    options: [
      {
        value: "A",
        text: "新しい情報やスキルを学ぶ、知的な時間",
        description: "学習と成長を重視するライフスタイル",
        scoring: {
          trigrams: [6, 3], // 坎（探求心）、離（知性と学習）
          weight: 1.0,
          reasoning: "探求心と知的好奇心を重視する特性"
        }
      },
      {
        value: "B",
        text: "家でゆっくりと休み、エネルギーを充電する時間",
        description: "安定と回復を重視するライフスタイル",
        scoring: {
          trigrams: [7, 8], // 艮（安定性）、坤（受容と静寂）
          weight: 1.0,
          reasoning: "安定性と内的充電を重視する特性"
        }
      }
    ],
    metadata: {
      difficulty: "easy",
      estimatedTime: 10,
      tags: ["lifestyle", "learning", "energy"],
      version: "1.0"
    }
  },
  
  {
    id: "q5",
    text: "物事を進める上で、あなたがより重視するのは...",
    type: "single_choice",
    category: "approach",
    weight: 1.0,
    description: "作業スタイルと価値観の特定",
    options: [
      {
        value: "A",
        text: "物事の隅々まで把握し、丁寧に事を進める「浸透力」",
        description: "細やかで丁寧なアプローチを重視",
        scoring: {
          trigrams: [5, 2], // 巽（きめ細かい浸透力）、兌（コミュニケーション力）
          weight: 1.0,
          reasoning: "細やかな配慮とコミュニケーション力を重視する特性"
        }
      },
      {
        value: "B",
        text: "一度決めたことを、最後までやり遂げる「継続力」",
        description: "継続性と一貫性を重視するアプローチ",
        scoring: {
          trigrams: [7, 1], // 艮（継続力）、乾（一貫したリーダーシップ）
          weight: 1.0,
          reasoning: "継続力と一貫したリーダーシップを重視する特性"
        }
      }
    ],
    metadata: {
      difficulty: "medium",
      estimatedTime: 15,
      tags: ["approach", "persistence", "attention-to-detail"],
      version: "1.0"
    }
  }
];

// 質問データの検証
(function validateQuestionsData() {
  const questions = window.QUICK_ANALYZER_QUESTIONS;
  
  if (!Array.isArray(questions)) {
    console.error('QUICK_ANALYZER_QUESTIONS must be an array');
    return;
  }
  
  questions.forEach((question, index) => {
    // 必須フィールドのチェック
    const requiredFields = ['id', 'text', 'type', 'category', 'options'];
    const missingFields = requiredFields.filter(field => !question[field]);
    
    if (missingFields.length > 0) {
      console.error(`Question at index ${index} missing required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    // オプションの検証
    if (!Array.isArray(question.options) || question.options.length < 2) {
      console.error(`Question ${question.id} must have at least 2 options`);
      return;
    }
    
    question.options.forEach((option, optionIndex) => {
      const requiredOptionFields = ['value', 'text', 'scoring'];
      const missingOptionFields = requiredOptionFields.filter(field => !option[field]);
      
      if (missingOptionFields.length > 0) {
        console.error(`Option at index ${optionIndex} in question ${question.id} missing required fields: ${missingOptionFields.join(', ')}`);
        return;
      }
      
      // スコアリング情報の検証
      const scoring = option.scoring;
      if (!scoring.trigrams || !Array.isArray(scoring.trigrams) || scoring.trigrams.length === 0) {
        console.error(`Invalid scoring.trigrams in question ${question.id}, option ${option.value}`);
        return;
      }
      
      // 八卦IDの範囲チェック（1-8）
      const invalidTrigrams = scoring.trigrams.filter(id => !Number.isInteger(id) || id < 1 || id > 8);
      if (invalidTrigrams.length > 0) {
        console.error(`Invalid trigram IDs in question ${question.id}, option ${option.value}: ${invalidTrigrams.join(', ')}`);
        return;
      }
    });
  });
  
  console.log('✅ Questions data validation completed successfully');
  console.log(`📊 Loaded ${questions.length} questions for Quick Analyzer`);
})();

// 質問統計の生成
(function generateQuestionStats() {
  const questions = window.QUICK_ANALYZER_QUESTIONS;
  const stats = {
    totalQuestions: questions.length,
    categoriesCount: {},
    trigramsCoverage: {},
    estimatedTotalTime: 0,
    difficultyDistribution: {}
  };
  
  questions.forEach(question => {
    // カテゴリー統計
    stats.categoriesCount[question.category] = (stats.categoriesCount[question.category] || 0) + 1;
    
    // 推定時間統計
    if (question.metadata?.estimatedTime) {
      stats.estimatedTotalTime += question.metadata.estimatedTime;
    }
    
    // 難易度統計
    const difficulty = question.metadata?.difficulty || 'unknown';
    stats.difficultyDistribution[difficulty] = (stats.difficultyDistribution[difficulty] || 0) + 1;
    
    // 八卦カバレッジ統計
    question.options.forEach(option => {
      option.scoring.trigrams.forEach(trigramId => {
        stats.trigramsCoverage[trigramId] = (stats.trigramsCoverage[trigramId] || 0) + 1;
      });
    });
  });
  
  // グローバルに統計を公開
  window.QUICK_ANALYZER_STATS = stats;
  
  console.log('📈 Questions statistics generated:', stats);
})();