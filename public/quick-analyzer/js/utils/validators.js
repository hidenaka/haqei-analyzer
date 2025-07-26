/**
 * Validation Utilities
 * バリデーション関連のユーティリティ関数
 */

window.ValidationUtils = {
  /**
   * 必須チェック
   * @param {*} value - チェックする値
   * @returns {boolean}
   */
  required(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  },

  /**
   * 数値チェック
   * @param {*} value - チェックする値
   * @returns {boolean}
   */
  isNumber(value) {
    return !isNaN(Number(value)) && isFinite(Number(value));
  },

  /**
   * 整数チェック
   * @param {*} value - チェックする値
   * @returns {boolean}
   */
  isInteger(value) {
    return Number.isInteger(Number(value));
  },

  /**
   * 範囲チェック
   * @param {number} value - チェックする値
   * @param {number} min - 最小値
   * @param {number} max - 最大値
   * @returns {boolean}
   */
  inRange(value, min, max) {
    const num = Number(value);
    return num >= min && num <= max;
  },

  /**
   * 文字列長チェック
   * @param {string} value - チェックする文字列
   * @param {number} min - 最小文字数
   * @param {number} max - 最大文字数
   * @returns {boolean}
   */
  stringLength(value, min = 0, max = Infinity) {
    if (typeof value !== 'string') return false;
    return value.length >= min && value.length <= max;
  },

  /**
   * 配列チェック
   * @param {*} value - チェックする値
   * @param {number} minLength - 最小要素数
   * @returns {boolean}
   */
  isArray(value, minLength = 0) {
    return Array.isArray(value) && value.length >= minLength;
  },

  /**
   * オブジェクトチェック
   * @param {*} value - チェックする値
   * @param {Array} requiredKeys - 必須キー配列
   * @returns {boolean}
   */
  isObject(value, requiredKeys = []) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return false;
    }
    
    return requiredKeys.every(key => key in value);
  },

  /**
   * 回答データの検証
   * @param {Object} answers - 回答データ
   * @param {Array} questions - 質問配列
   * @returns {Object}
   */
  validateAnswers(answers, questions) {
    const result = {
      isValid: true,
      errors: [],
      warnings: []
    };

    if (!this.isObject(answers)) {
      result.isValid = false;
      result.errors.push('回答データが不正です');
      return result;
    }

    if (!this.isArray(questions, 1)) {
      result.isValid = false;
      result.errors.push('質問データが不正です');
      return result;
    }

    // 各質問の回答チェック
    questions.forEach(question => {
      const answer = answers[question.id];
      
      if (!this.required(answer)) {
        result.isValid = false;
        result.errors.push(`質問「${question.id}」が未回答です`);
        return;
      }

      // 有効な選択肢かチェック
      const validOptions = question.options.map(opt => opt.value);
      if (!validOptions.includes(answer)) {
        result.isValid = false;
        result.errors.push(`質問「${question.id}」の回答が無効です`);
      }
    });

    return result;
  },

  /**
   * 質問データの検証
   * @param {Array} questions - 質問配列
   * @returns {Object}
   */
  validateQuestions(questions) {
    const result = {
      isValid: true,
      errors: [],
      warnings: []
    };

    if (!this.isArray(questions, 1)) {
      result.isValid = false;
      result.errors.push('質問データは配列である必要があります');
      return result;
    }

    questions.forEach((question, index) => {
      // 必須フィールドのチェック
      const requiredFields = ['id', 'text', 'options'];
      const missingFields = requiredFields.filter(field => !this.required(question[field]));
      
      if (missingFields.length > 0) {
        result.isValid = false;
        result.errors.push(`質問${index + 1}: 必須フィールドが不足 (${missingFields.join(', ')})`);
      }

      // オプションの検証
      if (question.options) {
        if (!this.isArray(question.options, 2)) {
          result.isValid = false;
          result.errors.push(`質問${index + 1}: 選択肢は2つ以上必要です`);
        } else {
          question.options.forEach((option, optIndex) => {
            if (!this.isObject(option, ['value', 'text'])) {
              result.isValid = false;
              result.errors.push(`質問${index + 1}の選択肢${optIndex + 1}: 必須フィールドが不足`);
            }
          });
        }
      }
    });

    return result;
  },

  /**
   * 八卦データの検証
   * @param {Object} trigrams - 八卦データ
   * @returns {Object}
   */
  validateTrigrams(trigrams) {
    const result = {
      isValid: true,
      errors: [],
      warnings: []
    };

    if (!this.isObject(trigrams)) {
      result.isValid = false;
      result.errors.push('八卦データはオブジェクトである必要があります');
      return result;
    }

    // 1-8の八卦がすべて存在するかチェック
    for (let i = 1; i <= 8; i++) {
      const trigram = trigrams[i];
      
      if (!trigram) {
        result.isValid = false;
        result.errors.push(`八卦${i}のデータが存在しません`);
        continue;
      }

      const requiredFields = ['id', 'name', 'avatarName', 'description'];
      const missingFields = requiredFields.filter(field => !this.required(trigram[field]));
      
      if (missingFields.length > 0) {
        result.isValid = false;
        result.errors.push(`八卦${i}: 必須フィールドが不足 (${missingFields.join(', ')})`);
      }

      // IDの整合性チェック
      if (trigram.id !== i) {
        result.warnings.push(`八卦${i}: IDが不整合です (expected: ${i}, actual: ${trigram.id})`);
      }
    }

    return result;
  },

  /**
   * スコアデータの検証
   * @param {Object} scores - スコアデータ
   * @returns {Object}
   */
  validateScores(scores) {
    const result = {
      isValid: true,
      errors: [],
      warnings: []
    };

    if (!this.isObject(scores)) {
      result.isValid = false;
      result.errors.push('スコアデータはオブジェクトである必要があります');
      return result;
    }

    // 1-8の八卦スコアがすべて存在するかチェック
    for (let i = 1; i <= 8; i++) {
      const score = scores[i];
      
      if (score === undefined || score === null) {
        result.isValid = false;
        result.errors.push(`八卦${i}のスコアが存在しません`);
        continue;
      }

      if (!this.isNumber(score)) {
        result.isValid = false;
        result.errors.push(`八卦${i}のスコアが数値ではありません`);
        continue;
      }

      if (!this.inRange(score, 0, 1)) {
        result.warnings.push(`八卦${i}のスコアが0-1の範囲外です (${score})`);
      }
    }

    return result;
  },

  /**
   * エラーメッセージのフォーマット
   * @param {Object} validationResult - バリデーション結果
   * @returns {string}
   */
  formatErrors(validationResult) {
    const messages = [];
    
    if (validationResult.errors.length > 0) {
      messages.push('エラー:');
      messages.push(...validationResult.errors.map(error => `- ${error}`));
    }
    
    if (validationResult.warnings.length > 0) {
      messages.push('警告:');
      messages.push(...validationResult.warnings.map(warning => `- ${warning}`));
    }
    
    return messages.join('\n');
  }
};