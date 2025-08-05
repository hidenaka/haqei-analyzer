/**
 * 状況分析システム用エラーハンドラー
 * 
 * 目的：
 * - 状況分析システム全体で発生するエラーを統一的に処理
 * - ユーザーフレンドリーなエラーメッセージの提供
 * - エラーログの記録と分析
 */

class SituationAnalysisErrorHandler {
  constructor() {
    // エラーログの保存（最大100件）
    this.errorLog = [];
    this.maxLogSize = 100;
    
    // エラータイプの定義
    this.errorTypes = {
      INITIALIZATION: 'initialization',
      INPUT_VALIDATION: 'input_validation',
      ANALYSIS: 'analysis',
      MAPPING: 'mapping',
      RENDERING: 'rendering',
      NETWORK: 'network',
      UNKNOWN: 'unknown'
    };
    
    // エラーメッセージテンプレート
    this.errorMessages = {
      [this.errorTypes.INITIALIZATION]: {
        title: 'システム初期化エラー',
        userMessage: 'システムの起動に失敗しました。ページを再読み込みしてください。',
        action: 'reload'
      },
      [this.errorTypes.INPUT_VALIDATION]: {
        title: '入力エラー',
        userMessage: '入力内容に問題があります。確認してください。',
        action: 'retry'
      },
      [this.errorTypes.ANALYSIS]: {
        title: '分析エラー',
        userMessage: 'テキストの分析中にエラーが発生しました。別の表現でお試しください。',
        action: 'modify'
      },
      [this.errorTypes.MAPPING]: {
        title: 'マッピングエラー',
        userMessage: '易経との対応付けに失敗しました。もう一度お試しください。',
        action: 'retry'
      },
      [this.errorTypes.RENDERING]: {
        title: '表示エラー',
        userMessage: '結果の表示中にエラーが発生しました。',
        action: 'refresh'
      },
      [this.errorTypes.NETWORK]: {
        title: 'ネットワークエラー',
        userMessage: 'ネットワーク接続に問題があります。接続を確認してください。',
        action: 'check_network'
      },
      [this.errorTypes.UNKNOWN]: {
        title: '予期しないエラー',
        userMessage: '予期しないエラーが発生しました。開発者に報告してください。',
        action: 'report'
      }
    };
  }
  
  /**
   * エラーを処理する
   * 
   * 目的：
   * - 発生したエラーを適切に分類・記録・処理する
   * 
   * 入力：
   * @param {Error} error - 発生したエラーオブジェクト
   * @param {string} context - エラーが発生したコンテキスト（関数名など）
   * @param {Object} additionalData - 追加のデバッグ情報
   * 
   * 処理内容：
   * 1. エラータイプを判定
   * 2. エラーログに記録
   * 3. ユーザー向けメッセージを生成
   * 4. 開発者向けログを出力
   * 
   * 出力：
   * @returns {Object} エラー処理結果（type, message, action, details）
   * 
   * 副作用：
   * - コンソールへのエラー出力
   * - エラーログへの記録
   */
  handleError(error, context = '', additionalData = {}) {
    const errorType = this.classifyError(error, context);
    const timestamp = new Date().toISOString();
    
    // エラーログに記録
    this.logError({
      timestamp,
      type: errorType,
      message: error.message,
      stack: error.stack,
      context,
      additionalData
    });
    
    // 開発者向けログ
    console.error(`[${timestamp}] ${context}:`, error);
    if (Object.keys(additionalData).length > 0) {
      console.error('Additional data:', additionalData);
    }
    
    // ユーザー向けレスポンスを生成
    const errorTemplate = this.errorMessages[errorType];
    return {
      type: errorType,
      title: errorTemplate.title,
      message: errorTemplate.userMessage,
      action: errorTemplate.action,
      details: {
        originalError: error.message,
        context,
        timestamp
      }
    };
  }
  
  /**
   * エラーを分類する
   * 
   * 目的：
   * - エラーの内容からエラータイプを判定する
   * 
   * 入力：
   * @param {Error} error - エラーオブジェクト
   * @param {string} context - エラーが発生したコンテキスト
   * 
   * 処理内容：
   * 1. エラーメッセージとコンテキストからパターンマッチング
   * 2. 特定のエラークラスの判定
   * 3. デフォルトタイプの返却
   * 
   * 出力：
   * @returns {string} エラータイプ
   */
  classifyError(error, context) {
    const message = error.message.toLowerCase();
    
    // 初期化エラー
    if (context.includes('initialize') || message.includes('constructor')) {
      return this.errorTypes.INITIALIZATION;
    }
    
    // 入力検証エラー
    if (context.includes('validate') || message.includes('invalid input')) {
      return this.errorTypes.INPUT_VALIDATION;
    }
    
    // 分析エラー
    if (context.includes('analyze') || context.includes('classifier')) {
      return this.errorTypes.ANALYSIS;
    }
    
    // マッピングエラー
    if (context.includes('mapping') || context.includes('hexagram')) {
      return this.errorTypes.MAPPING;
    }
    
    // 表示エラー
    if (context.includes('render') || context.includes('display')) {
      return this.errorTypes.RENDERING;
    }
    
    // ネットワークエラー
    if (error.name === 'NetworkError' || message.includes('fetch')) {
      return this.errorTypes.NETWORK;
    }
    
    // その他
    return this.errorTypes.UNKNOWN;
  }
  
  /**
   * エラーをログに記録する
   * 
   * 目的：
   * - エラー情報を内部ログに保存する
   * 
   * 入力：
   * @param {Object} errorInfo - エラー情報オブジェクト
   * 
   * 処理内容：
   * 1. ログ配列に追加
   * 2. 最大サイズを超えた場合は古いログを削除
   * 3. localStorageへの保存（オプション）
   * 
   * 副作用：
   * - this.errorLogの更新
   * - localStorageへの書き込み（エラー時は無視）
   */
  logError(errorInfo) {
    this.errorLog.push(errorInfo);
    
    // 最大サイズを超えたら古いログを削除
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }
    
    // localStorageに保存（エラーが発生しても無視）
    try {
      localStorage.setItem('situationAnalysis_errorLog', 
        JSON.stringify(this.errorLog.slice(-10))); // 最新10件のみ保存
    } catch (e) {
      // localStorage使用不可の場合は無視
    }
  }
  
  /**
   * エラーログを取得する
   * 
   * 目的：
   * - 保存されているエラーログを取得する
   * 
   * 入力：
   * @param {number} limit - 取得する最大件数（デフォルト: 10）
   * 
   * 出力：
   * @returns {Array} エラーログの配列
   */
  getErrorLog(limit = 10) {
    return this.errorLog.slice(-limit);
  }
  
  /**
   * エラーログをクリアする
   * 
   * 目的：
   * - 保存されているエラーログを削除する
   * 
   * 副作用：
   * - this.errorLogのクリア
   * - localStorageからの削除
   */
  clearErrorLog() {
    this.errorLog = [];
    try {
      localStorage.removeItem('situationAnalysis_errorLog');
    } catch (e) {
      // localStorage使用不可の場合は無視
    }
  }
  
  /**
   * リトライ可能なエラーかどうかを判定する
   * 
   * 目的：
   * - エラータイプからリトライ可能かどうかを判定する
   * 
   * 入力：
   * @param {string} errorType - エラータイプ
   * 
   * 出力：
   * @returns {boolean} リトライ可能な場合true
   */
  isRetryable(errorType) {
    const retryableTypes = [
      this.errorTypes.ANALYSIS,
      this.errorTypes.MAPPING,
      this.errorTypes.NETWORK
    ];
    
    return retryableTypes.includes(errorType);
  }
  
  /**
   * エラー統計を取得する
   * 
   * 目的：
   * - エラーログから統計情報を生成する
   * 
   * 処理内容：
   * 1. エラータイプ別の集計
   * 2. 時間帯別の集計
   * 3. コンテキスト別の集計
   * 
   * 出力：
   * @returns {Object} エラー統計情報
   */
  getErrorStatistics() {
    const stats = {
      total: this.errorLog.length,
      byType: {},
      byContext: {},
      recentErrors: this.errorLog.slice(-5)
    };
    
    // タイプ別集計
    Object.values(this.errorTypes).forEach(type => {
      stats.byType[type] = 0;
    });
    
    // ログを集計
    this.errorLog.forEach(error => {
      // タイプ別
      if (stats.byType[error.type] !== undefined) {
        stats.byType[error.type]++;
      }
      
      // コンテキスト別
      if (!stats.byContext[error.context]) {
        stats.byContext[error.context] = 0;
      }
      stats.byContext[error.context]++;
    });
    
    return stats;
  }
}

// シングルトンインスタンスのエクスポート
const errorHandler = new SituationAnalysisErrorHandler();

// エクスポート
if (typeof window !== 'undefined') {
  window.SituationAnalysisErrorHandler = SituationAnalysisErrorHandler;
  window.situationAnalysisErrorHandler = errorHandler;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SituationAnalysisErrorHandler, errorHandler };
}