/**
 * DataManager - データ管理クラス
 * 質問データ、八卦データの読み込み、検証、キャッシュ機能を提供
 */
class DataManager {
  constructor() {
    this.data = {};
    this.loaded = false;
    this.loading = false;
    this.loadingErrors = [];
    this.cache = new Map();
    this.storageManager = null;
    
    // データカテゴリの定義
    this.DATA_CATEGORIES = {
      QUESTIONS: 'questions',
      TRIGRAMS: 'trigrams',
      SCORING: 'scoring',
      CONFIG: 'config'
    };
    
    // データソースの定義
    this.DATA_SOURCES = {
      QUESTIONS: 'js/data/questions.js',
      TRIGRAMS: 'embedded', // HTMLに埋め込まれたデータ
      CONFIG: 'embedded'
    };
    
    this.init();
  }

  /**
   * DataManagerを初期化
   */
  async init() {
    try {
      this.log('info', 'init', 'Initializing DataManager');
      
      // StorageManagerの初期化
      this.storageManager = new StorageManager('haqei_data_');
      
      // データの読み込み
      await this.loadAllData();
      
      this.loaded = true;
      this.log('info', 'init', 'DataManager initialized successfully');
      
    } catch (error) {
      this.handleError(error, 'initialization');
      throw error;
    }
  }

  /**
   * すべてのデータを読み込み
   * @returns {Promise<void>}
   */
  async loadAllData() {
    if (this.loading) {
      this.log('warn', 'loadAllData', 'Data loading already in progress');
      return;
    }
    
    this.loading = true;
    this.loadingErrors = [];
    
    try {
      this.log('info', 'loadAllData', 'Starting data loading');
      
      // 並行してデータを読み込み
      const loadPromises = [
        this.loadQuestions(),
        this.loadTrigramData(),
        this.loadScoringLogic(),
        this.loadConfiguration()
      ];
      
      await Promise.all(loadPromises);
      
      // データの整合性チェック
      this.validateLoadedData();
      
      this.log('info', 'loadAllData', 'All data loaded successfully', {
        categoriesLoaded: Object.keys(this.data).length,
        errorsCount: this.loadingErrors.length
      });
      
    } catch (error) {
      this.log('error', 'loadAllData', 'Failed to load data', error);
      throw error;
    } finally {
      this.loading = false;
    }
  }

  /**
   * 質問データを読み込み
   * @returns {Promise<void>}
   */
  async loadQuestions() {
    try {
      this.log('debug', 'loadQuestions', 'Loading questions data');
      
      // キャッシュから確認
      let questionsData = this.getFromCache(this.DATA_CATEGORIES.QUESTIONS);
      
      if (!questionsData) {
        // グローバル変数から読み込み（questions.jsが読み込まれている場合）
        if (window.QUICK_ANALYZER_QUESTIONS) {
          questionsData = window.QUICK_ANALYZER_QUESTIONS;
        } else {
          // フォールバック: 組み込みデータ
          questionsData = this.getDefaultQuestionsData();
        }
        
        // キャッシュに保存
        this.setCache(this.DATA_CATEGORIES.QUESTIONS, questionsData);
      }
      
      // データの検証
      this.validateQuestionsData(questionsData);
      
      this.data[this.DATA_CATEGORIES.QUESTIONS] = questionsData;
      this.log('debug', 'loadQuestions', 'Questions data loaded', {
        questionCount: questionsData.length
      });
      
    } catch (error) {
      this.loadingErrors.push({ category: 'questions', error });
      this.log('error', 'loadQuestions', 'Failed to load questions', error);
      
      // フォールバックデータを設定
      this.data[this.DATA_CATEGORIES.QUESTIONS] = this.getDefaultQuestionsData();
    }
  }

  /**
   * 八卦データを読み込み
   * @returns {Promise<void>}
   */
  async loadTrigramData() {
    try {
      this.log('debug', 'loadTrigramData', 'Loading trigram data');
      
      // キャッシュから確認
      let trigramData = this.getFromCache(this.DATA_CATEGORIES.TRIGRAMS);
      
      if (!trigramData) {
        trigramData = this.getDefaultTrigramData();
        this.setCache(this.DATA_CATEGORIES.TRIGRAMS, trigramData);
      }
      
      // データの検証
      this.validateTrigramData(trigramData);
      
      this.data[this.DATA_CATEGORIES.TRIGRAMS] = trigramData;
      this.log('debug', 'loadTrigramData', 'Trigram data loaded', {
        trigramCount: Object.keys(trigramData).length
      });
      
    } catch (error) {
      this.loadingErrors.push({ category: 'trigrams', error });
      this.log('error', 'loadTrigramData', 'Failed to load trigram data', error);
      
      // フォールバックデータを設定
      this.data[this.DATA_CATEGORIES.TRIGRAMS] = this.getDefaultTrigramData();
    }
  }

  /**
   * スコアリングロジックを読み込み
   * @returns {Promise<void>}
   */
  async loadScoringLogic() {
    try {
      this.log('debug', 'loadScoringLogic', 'Loading scoring logic');
      
      const scoringLogic = this.getDefaultScoringLogic();
      this.data[this.DATA_CATEGORIES.SCORING] = scoringLogic;
      
      this.log('debug', 'loadScoringLogic', 'Scoring logic loaded');
      
    } catch (error) {
      this.loadingErrors.push({ category: 'scoring', error });
      this.log('error', 'loadScoringLogic', 'Failed to load scoring logic', error);
    }
  }

  /**
   * 設定データを読み込み
   * @returns {Promise<void>}
   */
  async loadConfiguration() {
    try {
      this.log('debug', 'loadConfiguration', 'Loading configuration');
      
      const config = this.getDefaultConfiguration();
      this.data[this.DATA_CATEGORIES.CONFIG] = config;
      
      this.log('debug', 'loadConfiguration', 'Configuration loaded');
      
    } catch (error) {
      this.loadingErrors.push({ category: 'config', error });
      this.log('error', 'loadConfiguration', 'Failed to load configuration', error);
    }
  }

  /**
   * デフォルト質問データを取得
   * @returns {Array}
   */
  getDefaultQuestionsData() {
    return [
      {
        id: "q1",
        text: "困難な課題に直面した時、あなたはまず...",
        type: "single_choice",
        category: "approach",
        options: [
          {
            value: "A",
            text: "行動計画を立て、戦略的に進む",
            scoring: {
              trigrams: [1, 7], // 乾、艮
              weight: 1
            }
          },
          {
            value: "B",
            text: "直感を信じ、まず行動してみる",
            scoring: {
              trigrams: [4, 6], // 震、坎
              weight: 1
            }
          }
        ]
      },
      {
        id: "q2",
        text: "チームで何かを成し遂げた時、より喜びを感じるのは...",
        type: "single_choice",
        category: "motivation",
        options: [
          {
            value: "A",
            text: "目標を達成した「達成感」そのもの",
            scoring: {
              trigrams: [1, 3], // 乾、離
              weight: 1
            }
          },
          {
            value: "B",
            text: "仲間と喜びを分かち合う「一体感」",
            scoring: {
              trigrams: [2, 8], // 兌、坤
              weight: 1
            }
          }
        ]
      },
      {
        id: "q3",
        text: "初めて会う人が多い場では...",
        type: "single_choice",
        category: "social",
        options: [
          {
            value: "A",
            text: "自分の知識や個性を発揮し、注目されたい",
            scoring: {
              trigrams: [3, 4], // 離、震
              weight: 1
            }
          },
          {
            value: "B",
            text: "全体の調和を考え、聞き役に徹することが多い",
            scoring: {
              trigrams: [8, 5], // 坤、巽
              weight: 1
            }
          }
        ]
      },
      {
        id: "q4",
        text: "休日の過ごし方として、より好むのは...",
        type: "single_choice",
        category: "lifestyle",
        options: [
          {
            value: "A",
            text: "新しい情報やスキルを学ぶ、知的な時間",
            scoring: {
              trigrams: [6, 3], // 坎、離
              weight: 1
            }
          },
          {
            value: "B",
            text: "家でゆっくりと休み、エネルギーを充電する時間",
            scoring: {
              trigrams: [7, 8], // 艮、坤
              weight: 1
            }
          }
        ]
      },
      {
        id: "q5",
        text: "物事を進める上で、あなたがより重視するのは...",
        type: "single_choice",
        category: "approach",
        options: [
          {
            value: "A",
            text: "物事の隅々まで把握し、丁寧に事を進める「浸透力」",
            scoring: {
              trigrams: [5, 2], // 巽、兌
              weight: 1
            }
          },
          {
            value: "B",
            text: "一度決めたことを、最後までやり遂げる「継続力」",
            scoring: {
              trigrams: [7, 1], // 艮、乾
              weight: 1
            }
          }
        ]
      }
    ];
  }

  /**
   * デフォルト八卦データを取得
   * @returns {Object}
   */
  getDefaultTrigramData() {
    return {
      1: {
        id: 1,
        name: "乾",
        avatarName: "天翔ける龍",
        element: "天",
        nature: "創造",
        description: "あなたは、理想を掲げ、人々を力強く牽引していく天性のリーダーとしての側面を持っています。その圧倒的なエネルギーは、困難な状況でも道を切り開く力となります。",
        characteristics: [
          "強力なリーダーシップ",
          "創造的なビジョン",
          "困難を突破する力",
          "高い理想と志"
        ],
        insights: {
          strengths: [
            "組織を牽引する天性のリーダーシップ",
            "困難な状況を打開する創造力",
            "高い目標に向かう継続力"
          ],
          challenges: [
            "完璧主義による自他への厳しさ",
            "独断専行になりがちな傾向",
            "細かい作業への苦手意識"
          ],
          recommendations: [
            "チームメンバーの意見にも耳を傾ける",
            "適度な休息を取り、燃え尽きを防ぐ",
            "完璧より進歩を重視する"
          ]
        }
      },
      2: {
        id: 2,
        name: "兌",
        avatarName: "喜びの沢",
        element: "沢",
        nature: "喜悦",
        description: "あなたは、楽しいコミュニケーションを通じて、人と人を繋ぎ、場を和ませる潤滑油のような側面を持っています。あなたの周りには、自然と笑顔と活気が生まれます。",
        characteristics: [
          "優れたコミュニケーション能力",
          "場を和ませる存在感",
          "人を楽しませる才能",
          "ポジティブな影響力"
        ],
        insights: {
          strengths: [
            "自然なコミュニケーション能力",
            "チームの雰囲気を明るくする力",
            "人の心を開く親しみやすさ"
          ],
          challenges: [
            "深刻な話題への苦手意識",
            "表面的な関係に留まりがち",
            "自分の感情を抑えてしまう傾向"
          ],
          recommendations: [
            "時には真剣な議論にも参加する",
            "自分の本音も大切に表現する",
            "一対一の深い関係も築く"
          ]
        }
      },
      3: {
        id: 3,
        name: "離",
        avatarName: "情熱の火",
        element: "火",
        nature: "明知",
        description: "あなたは、物事の本質を照らし出す知性と、人々を魅了する華やかさを持っています。その情熱的なエネルギーは、芸術的な創造や自己表現において輝きを放ちます。",
        characteristics: [
          "洞察力と分析力",
          "華やかな表現力",
          "情熱的な取り組み",
          "美的センス"
        ],
        insights: {
          strengths: [
            "物事の本質を見抜く洞察力",
            "人を惹きつける表現力",
            "情熱的な取り組み姿勢"
          ],
          challenges: [
            "感情的になりやすい傾向",
            "批判に対する敏感さ",
            "一貫性を保つ難しさ"
          ],
          recommendations: [
            "冷静な判断を心がける",
            "建設的な批判を受け入れる",
            "長期的な視点を持つ"
          ]
        }
      },
      4: {
        id: 4,
        name: "震",
        avatarName: "行動の雷",
        element: "雷",
        nature: "動始",
        description: "あなたは、停滞した状況を打ち破る、エネルギッシュな行動力を持っています。その瞬発力と決断力は、新しいことを始める際の強力なエンジンとなります。",
        characteristics: [
          "迅速な行動力",
          "変化への適応力",
          "新しい挑戦への意欲",
          "エネルギッシュな存在感"
        ],
        insights: {
          strengths: [
            "迅速な判断と行動力",
            "変化に対する柔軟性",
            "新しい取り組みへの積極性"
          ],
          challenges: [
            "計画性の不足",
            "継続性への課題",
            "衝動的な判断をしがち"
          ],
          recommendations: [
            "行動前に少し立ち止まって考える",
            "長期的な計画も立てる",
            "他人の意見も参考にする"
          ]
        }
      },
      5: {
        id: 5,
        name: "巽",
        avatarName: "しなやかな風",
        element: "風",
        nature: "入",
        description: "あなたは、相手の心に寄り添い、隅々まで意思を浸透させる調整能力に長けています。その穏やかで柔軟な影響力は、対立を和らげ、物事を円滑に進めます。",
        characteristics: [
          "優れた調整能力",
          "きめ細かい配慮",
          "柔軟な対応力",
          "穏やかな影響力"
        ],
        insights: {
          strengths: [
            "細やかな気配りと調整力",
            "柔軟で適応性の高い対応",
            "人間関係を円滑にする能力"
          ],
          challenges: [
            "自己主張の弱さ",
            "優柔不断になりがち",
            "ストレスを溜めやすい"
          ],
          recommendations: [
            "自分の意見もしっかり伝える",
            "決断する勇気を持つ",
            "適度にストレスを発散する"
          ]
        }
      },
      6: {
        id: 6,
        name: "坎",
        avatarName: "探求の水",
        element: "水",
        nature: "陥",
        description: "あなたは、困難な状況でも動じず、物事の本質を粘り強く探求する精神的な強さを持っています。その深い洞察力は、他の人が見過ごすような真実を見つけ出します。",
        characteristics: [
          "深い探求心",
          "粘り強い継続力",
          "困難への耐性",
          "本質を見抜く力"
        ],
        insights: {
          strengths: [
            "深く考え抜く思考力",
            "困難にめげない精神力",
            "本質を見抜く洞察力"
          ],
          challenges: [
            "悲観的になりがち",
            "一人で抱え込む傾向",
            "変化への慎重すぎる姿勢"
          ],
          recommendations: [
            "ポジティブな面にも目を向ける",
            "周囲のサポートを受け入れる",
            "時には冒険も必要"
          ]
        }
      },
      7: {
        id: 7,
        name: "艮",
        avatarName: "不動の山",
        element: "山",
        nature: "止",
        description: "あなたは、何事にも動じない、どっしりとした安定感を持っています。一度決めたことを着実に継続する力は、長期的なプロジェクトを成功に導く大きな武器です。",
        characteristics: [
          "安定した継続力",
          "堅実な判断力",
          "責任感の強さ",
          "信頼できる存在感"
        ],
        insights: {
          strengths: [
            "一貫した継続力と責任感",
            "安定した判断力",
            "信頼できる人格"
          ],
          challenges: [
            "変化への抵抗感",
            "融通の利かなさ",
            "新しいアイデアへの慎重さ"
          ],
          recommendations: [
            "新しい視点も取り入れる",
            "柔軟性を意識する",
            "時には冒険も必要"
          ]
        }
      },
      8: {
        id: 8,
        name: "坤",
        avatarName: "受容の大地",
        element: "地",
        nature: "順",
        description: "あなたは、すべてを受け入れ、育む大地のようなどこまでも深い包容力を持っています。その献身的なサポート能力は、組織やチームにとって不可欠な土台となります。",
        characteristics: [
          "深い包容力",
          "献身的なサポート力",
          "安定した支援能力",
          "調和を重視する姿勢"
        ],
        insights: {
          strengths: [
            "他者を包み込む包容力",
            "献身的なサポート能力",
            "チームの調和を保つ力"
          ],
          challenges: [
            "自己犠牲になりがち",
            "主体性の不足",
            "自分の意見を抑えがち"
          ],
          recommendations: [
            "自分の意見も大切にする",
            "時には主導権を取る",
            "自分のための時間も作る"
          ]
        }
      }
    };
  }

  /**
   * デフォルトスコアリングロジックを取得
   * @returns {Object}
   */
  getDefaultScoringLogic() {
    return {
      q1: { A: [1, 7], B: [4, 6] },
      q2: { A: [1, 3], B: [2, 8] },
      q3: { A: [3, 4], B: [8, 5] },
      q4: { A: [6, 3], B: [7, 8] },
      q5: { A: [5, 2], B: [7, 1] }
    };
  }

  /**
   * デフォルト設定を取得
   * @returns {Object}
   */
  getDefaultConfiguration() {
    return {
      analysis: {
        enableChart: true,
        chartType: 'radar',
        showDetailedInsights: true,
        confidenceThreshold: 0.7
      },
      ui: {
        animationDuration: 300,
        showProgress: true,
        enableKeyboardNavigation: true
      },
      storage: {
        autoSave: true,
        encryptData: false,
        retentionDays: 30
      }
    };
  }

  /**
   * 質問データを検証
   * @param {Array} questionsData - 質問データ
   */
  validateQuestionsData(questionsData) {
    if (!Array.isArray(questionsData)) {
      throw new Error('Questions data must be an array');
    }
    
    questionsData.forEach((question, index) => {
      if (!question.id || !question.text || !question.options) {
        throw new Error(`Invalid question structure at index ${index}`);
      }
      
      if (!Array.isArray(question.options) || question.options.length < 2) {
        throw new Error(`Question ${question.id} must have at least 2 options`);
      }
      
      question.options.forEach((option, optionIndex) => {
        if (!option.value || !option.text) {
          throw new Error(`Invalid option structure in question ${question.id} at index ${optionIndex}`);
        }
      });
    });
  }

  /**
   * 八卦データを検証
   * @param {Object} trigramData - 八卦データ
   */
  validateTrigramData(trigramData) {
    if (!trigramData || typeof trigramData !== 'object') {
      throw new Error('Trigram data must be an object');
    }
    
    for (let i = 1; i <= 8; i++) {
      const trigram = trigramData[i];
      if (!trigram || !trigram.name || !trigram.avatarName || !trigram.description) {
        throw new Error(`Invalid trigram data for ID ${i}`);
      }
    }
  }

  /**
   * 読み込み済みデータの整合性を検証
   */
  validateLoadedData() {
    const requiredCategories = [
      this.DATA_CATEGORIES.QUESTIONS,
      this.DATA_CATEGORIES.TRIGRAMS,
      this.DATA_CATEGORIES.SCORING,
      this.DATA_CATEGORIES.CONFIG
    ];
    
    const missingCategories = requiredCategories.filter(category => !this.data[category]);
    
    if (missingCategories.length > 0) {
      throw new Error(`Missing data categories: ${missingCategories.join(', ')}`);
    }
    
    this.log('debug', 'validateLoadedData', 'Data integrity validation passed');
  }

  /**
   * キャッシュからデータを取得
   * @param {string} key - キー
   * @returns {*}
   */
  getFromCache(key) {
    return this.cache.get(key);
  }

  /**
   * キャッシュにデータを設定
   * @param {string} key - キー
   * @param {*} data - データ
   */
  setCache(key, data) {
    this.cache.set(key, data);
  }

  /**
   * 質問データを取得
   * @returns {Array}
   */
  getQuestions() {
    return this.data[this.DATA_CATEGORIES.QUESTIONS] || [];
  }

  /**
   * 特定の質問を取得
   * @param {string} questionId - 質問ID
   * @returns {Object|null}
   */
  getQuestion(questionId) {
    const questions = this.getQuestions();
    return questions.find(q => q.id === questionId) || null;
  }

  /**
   * 八卦データを取得
   * @returns {Object}
   */
  getTrigrams() {
    return this.data[this.DATA_CATEGORIES.TRIGRAMS] || {};
  }

  /**
   * 特定の八卦を取得
   * @param {number} trigramId - 八卦ID
   * @returns {Object|null}
   */
  getTrigram(trigramId) {
    const trigrams = this.getTrigrams();
    return trigrams[trigramId] || null;
  }

  /**
   * スコアリングロジックを取得
   * @returns {Object}
   */
  getScoringLogic() {
    return this.data[this.DATA_CATEGORIES.SCORING] || {};
  }

  /**
   * 設定を取得
   * @returns {Object}
   */
  getConfiguration() {
    return this.data[this.DATA_CATEGORIES.CONFIG] || {};
  }

  /**
   * 特定の設定値を取得
   * @param {string} path - 設定パス（例: 'analysis.enableChart'）
   * @param {*} defaultValue - デフォルト値
   * @returns {*}
   */
  getConfigValue(path, defaultValue = null) {
    const config = this.getConfiguration();
    const keys = path.split('.');
    let value = config;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }
    
    return value;
  }

  /**
   * データが読み込み済みかチェック
   * @returns {boolean}
   */
  isLoaded() {
    return this.loaded;
  }

  /**
   * 読み込み中かチェック
   * @returns {boolean}
   */
  isLoading() {
    return this.loading;
  }

  /**
   * 読み込みエラーを取得
   * @returns {Array}
   */
  getLoadingErrors() {
    return [...this.loadingErrors];
  }

  /**
   * データを再読み込み
   * @returns {Promise<void>}
   */
  async reload() {
    this.loaded = false;
    this.cache.clear();
    await this.loadAllData();
  }

  /**
   * エラーハンドリング
   * @param {Error} error - エラーオブジェクト
   * @param {string} context - コンテキスト
   */
  handleError(error, context) {
    this.log('error', 'handleError', `Error in ${context}`, error);
    
    // ErrorHandlerが利用可能な場合は通知
    if (window.ErrorHandler && typeof window.ErrorHandler.dataError === 'function') {
      window.ErrorHandler.dataError(error.message, { context });
    }
  }

  /**
   * ログ出力
   * @param {string} level - ログレベル
   * @param {string} method - メソッド名
   * @param {string} message - メッセージ
   * @param {*} data - データ
   */
  log(level, method, message, data = null) {
    const logData = {
      component: 'DataManager',
      method,
      message,
      timestamp: new Date().toISOString(),
      ...(data && { data })
    };
    
    console[level](`[DataManager] ${message}`, logData);
  }
}

// グローバルに公開
window.DataManager = DataManager;