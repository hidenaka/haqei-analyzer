/**
 * MicroDataManager.js
 * 設問データ読み込み専用の超軽量データマネージャー
 * Critical Path最適化: 10KB以下で設問表示に必要な機能のみ
 */

class MicroDataManager {
  constructor() {
    this.loaded = false;
    this.questions = [];
    this.questionIndex = new Map();
  }

  /**
   * 設問データの読み込み（高速版）
   */
  async loadQuestions() {
    try {
      // グローバルから設問データを取得
      if (typeof WORLDVIEW_QUESTIONS !== 'undefined' && typeof SCENARIO_QUESTIONS !== 'undefined') {
        this.questions = [...WORLDVIEW_QUESTIONS, ...SCENARIO_QUESTIONS];
        this.buildQuestionIndex();
        this.loaded = true;
        
        console.log(`⚡ Questions loaded: ${this.questions.length} questions`);
        return true;
      }
      
      // フォールバック: 最小限の設問を生成
      this.questions = this.generateMinimalQuestions();
      this.buildQuestionIndex();
      this.loaded = true;
      
      console.warn('⚠️ Using fallback questions');
      return true;
      
    } catch (error) {
      console.error('❌ Question load failed:', error);
      this.questions = this.generateMinimalQuestions();
      this.buildQuestionIndex();
      this.loaded = false;
      return false;
    }
  }

  /**
   * 設問インデックスの構築
   */
  buildQuestionIndex() {
    this.questionIndex.clear();
    this.questions.forEach((question, index) => {
      if (question.id) {
        this.questionIndex.set(question.id, { question, index });
      }
    });
  }

  /**
   * 設問IDから設問データを取得
   */
  getQuestionById(questionId) {
    const indexed = this.questionIndex.get(questionId);
    return indexed ? indexed.question : null;
  }

  /**
   * 全設問データを取得
   */
  getAllQuestions() {
    return this.questions;
  }

  /**
   * 設問数を取得
   */
  getQuestionCount() {
    return this.questions.length;
  }

  /**
   * 価値観設問を取得
   */
  getWorldviewQuestions() {
    return this.questions.filter(q => q.type === 'worldview' || !q.scenario);
  }

  /**
   * シナリオ設問を取得
   */
  getScenarioQuestions() {
    return this.questions.filter(q => q.type === 'scenario' || q.scenario);
  }

  /**
   * データ読み込み状況を取得
   */
  getLoadStatus() {
    return {
      loaded: this.loaded,
      questionCount: this.questions.length,
      worldviewCount: this.getWorldviewQuestions().length,
      scenarioCount: this.getScenarioQuestions().length
    };
  }

  /**
   * 最小限のフォールバック設問を生成
   */
  generateMinimalQuestions() {
    return [
      {
        id: 'q1',
        type: 'worldview',
        title: '価値観設問1',
        question: 'あなたの価値観を表す選択肢を選んでください',
        options: [
          {
            id: 'A',
            text: '選択肢A',
            scoring_tags: [{ key: '乾_創造性', value: 3.0 }]
          },
          {
            id: 'B', 
            text: '選択肢B',
            scoring_tags: [{ key: '坤_受容性', value: 3.0 }]
          }
        ]
      },
      {
        id: 'q2',
        type: 'worldview',
        title: '価値観設問2',
        question: 'もう一つの価値観について選択してください',
        options: [
          {
            id: 'A',
            text: '選択肢A',
            scoring_tags: [{ key: '震_行動性', value: 3.0 }]
          },
          {
            id: 'B',
            text: '選択肢B', 
            scoring_tags: [{ key: '巽_柔軟性', value: 3.0 }]
          }
        ]
      },
      {
        id: 'q3',
        type: 'scenario',
        title: 'シナリオ設問1',
        scenario: '重要な決断をする場面です',
        question: 'どのように行動しますか？',
        options: [
          {
            id: 'A',
            text: '慎重に検討する',
            scoring_tags: [{ key: '艮_安定性', value: 3.0 }]
          },
          {
            id: 'B',
            text: '直感で決める',
            scoring_tags: [{ key: '離_直感性', value: 3.0 }]
          }
        ]
      }
    ];
  }

  /**
   * 基本的なデータ統計を取得
   */
  getBasicStats() {
    return {
      loaded: this.loaded,
      questionCount: this.questions.length,
      hasWorldview: this.getWorldviewQuestions().length > 0,
      hasScenario: this.getScenarioQuestions().length > 0,
      indexSize: this.questionIndex.size
    };
  }

  /**
   * データの検証
   */
  validateData() {
    const errors = [];
    
    if (this.questions.length === 0) {
      errors.push('No questions loaded');
    }
    
    this.questions.forEach((question, index) => {
      if (!question.id) {
        errors.push(`Question ${index} missing ID`);
      }
      if (!question.options || question.options.length === 0) {
        errors.push(`Question ${question.id || index} has no options`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * クリーンアップ
   */
  cleanup() {
    this.questionIndex.clear();
    this.questions = [];
    this.loaded = false;
  }
}

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.MicroDataManager = MicroDataManager;
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MicroDataManager;
}