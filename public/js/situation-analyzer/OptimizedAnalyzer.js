/**
 * Web Worker最適化された状況分析システム
 * 
 * 目的：
 * - UIスレッドをブロックしない非同期分析
 * - プログレッシブな結果表示
 * - 高いレスポンシビリティの実現
 */

class OptimizedSituationAnalyzer {
  /**
   * コンストラクタ
   * 
   * 目的：
   * - Web Workerの初期化
   * - イベントハンドラーの設定
   * - 保留中のリクエスト管理の準備
   * 
   * 処理内容：
   * 1. Workerインスタンスの作成
   * 2. メッセージハンドラーの設定
   * 3. 初期化待機の設定
   * 
   * 副作用：
   * - Worker起動
   * - イベントリスナー登録
   * 
   * エラー処理：
   * - Worker作成失敗時はフォールバックモードへ
   */
  constructor() {
    this.worker = null;
    this.workerReady = false;
    this.pendingRequests = new Map();
    this.progressCallbacks = new Map();
    this.requestCounter = 0;
    
    // エラーハンドラー
    this.errorHandler = window.situationAnalysisErrorHandler || 
                       new (window.SituationAnalysisErrorHandler || class { handleError() {} })();
    
    // フォールバックアナライザー（Worker使用不可時）
    this.fallbackAnalyzer = null;
    
    // Workerの初期化
    this.initializeWorker();
  }
  
  /**
   * Workerの初期化
   * 
   * 目的：
   * - Web Workerインスタンスの作成と設定
   * 
   * 処理内容：
   * 1. Worker作成試行
   * 2. メッセージハンドラー設定
   * 3. エラーハンドラー設定
   * 4. 初期化メッセージ送信
   * 
   * 副作用：
   * - this.workerの設定
   * - イベントリスナー登録
   * 
   * エラー処理：
   * - Worker作成失敗時はフォールバックモード設定
   */
  initializeWorker() {
    try {
      this.worker = new Worker('./public/js/situation-analyzer/analyzer-worker.js');
      
      // メッセージハンドラー
      this.worker.addEventListener('message', (event) => {
        this.handleWorkerMessage(event);
      });
      
      // エラーハンドラー
      this.worker.addEventListener('error', (error) => {
        this.handleWorkerError(error);
      });
      
      // 初期化メッセージ送信
      this.worker.postMessage({ type: 'initialize' });
      
    } catch (error) {
      console.error('Worker作成エラー:', error);
      this.setupFallbackMode();
    }
  }
  
  /**
   * Workerメッセージハンドラー
   * 
   * 目的：
   * - Workerからのメッセージを適切に処理
   * 
   * 入力：
   * @param {MessageEvent} event - Workerからのメッセージイベント
   * 
   * 処理内容：
   * 1. メッセージタイプの判定
   * 2. 対応するハンドラーの呼び出し
   * 3. 保留中のリクエストの解決
   * 
   * 副作用：
   * - Promiseの解決/拒否
   * - プログレスコールバックの呼び出し
   */
  handleWorkerMessage(event) {
    const { type, requestId, ...data } = event.data;
    
    switch (type) {
      case 'initialized':
        this.handleInitialized(data);
        break;
        
      case 'progress':
        this.handleProgress(requestId, data);
        break;
        
      case 'result':
        this.handleResult(requestId, data);
        break;
        
      case 'error':
        this.handleError(requestId, data);
        break;
        
      case 'pong':
        // ヘルスチェック応答
        console.log('Worker is alive');
        break;
    }
  }
  
  /**
   * Worker初期化完了ハンドラー
   */
  handleInitialized(data) {
    if (data.success) {
      this.workerReady = true;
      console.log('Worker初期化完了');
    } else {
      console.error('Worker初期化失敗:', data.error);
      this.setupFallbackMode();
    }
  }
  
  /**
   * プログレス更新ハンドラー
   */
  handleProgress(requestId, data) {
    const callback = this.progressCallbacks.get(requestId);
    if (callback) {
      callback(data.progress, data.phase);
    }
  }
  
  /**
   * 結果受信ハンドラー
   */
  handleResult(requestId, data) {
    const request = this.pendingRequests.get(requestId);
    if (request) {
      request.resolve(data.result);
      this.pendingRequests.delete(requestId);
      this.progressCallbacks.delete(requestId);
    }
  }
  
  /**
   * エラーハンドラー
   */
  handleError(requestId, data) {
    const request = this.pendingRequests.get(requestId);
    if (request) {
      const errorInfo = this.errorHandler.handleError(
        new Error(data.error.message),
        `Worker.${data.error.phase || 'unknown'}`,
        { requestId, stack: data.error.stack }
      );
      
      request.reject(errorInfo);
      this.pendingRequests.delete(requestId);
      this.progressCallbacks.delete(requestId);
    }
  }
  
  /**
   * Workerエラーハンドラー
   */
  handleWorkerError(error) {
    console.error('Worker error:', error);
    this.errorHandler.handleError(
      error,
      'OptimizedAnalyzer.worker',
      { filename: error.filename, lineno: error.lineno }
    );
    
    // すべての保留中のリクエストを拒否
    this.pendingRequests.forEach((request, requestId) => {
      request.reject(new Error('Worker crashed'));
    });
    this.pendingRequests.clear();
    this.progressCallbacks.clear();
    
    // フォールバックモードへ
    this.setupFallbackMode();
  }
  
  /**
   * フォールバックモードの設定
   * 
   * 目的：
   * - Worker使用不可時の代替処理設定
   * 
   * 処理内容：
   * 1. 通常のアナライザーインスタンス作成
   * 2. フラグ設定
   * 
   * 副作用：
   * - this.fallbackAnalyzerの設定
   */
  setupFallbackMode() {
    console.warn('Workerが使用できません。フォールバックモードで動作します。');
    this.workerReady = false;
    
    // 動的インポート（循環参照回避）
    if (window.UltraSituationAnalyzer) {
      this.fallbackAnalyzer = new window.UltraSituationAnalyzer();
    }
  }
  
  /**
   * テキスト分析（プログレッシブ版）
   * 
   * 目的：
   * - 非同期でテキストを分析し、進捗を報告
   * 
   * 入力：
   * @param {string} text - 分析対象テキスト
   * @param {Function} progressCallback - 進捗コールバック
   * @param {Object} options - 分析オプション
   * 
   * 処理内容：
   * 1. Worker使用可能性チェック
   * 2. リクエストID生成
   * 3. Workerへのメッセージ送信
   * 4. Promise返却
   * 
   * 出力：
   * @returns {Promise<Object>} 分析結果
   * 
   * エラー処理：
   * - Worker不可時はフォールバック使用
   * - タイムアウト処理
   */
  async analyzeWithProgress(text, progressCallback = null, options = {}) {
    // 入力検証
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid input text');
    }
    
    // Workerが使用可能でない場合はフォールバック
    if (!this.workerReady || !this.worker) {
      if (this.fallbackAnalyzer) {
        // プログレスコールバックのシミュレーション
        if (progressCallback) {
          progressCallback(0, 'starting');
          setTimeout(() => progressCallback(50, 'analyzing'), 100);
          setTimeout(() => progressCallback(100, 'complete'), 200);
        }
        return this.fallbackAnalyzer.analyze(text, options);
      } else {
        throw new Error('分析システムが利用できません');
      }
    }
    
    // リクエストID生成
    const requestId = `req_${++this.requestCounter}_${Date.now()}`;
    
    // プログレスコールバック登録
    if (progressCallback) {
      this.progressCallbacks.set(requestId, progressCallback);
    }
    
    // Promiseを作成して保留リクエストに追加
    return new Promise((resolve, reject) => {
      // タイムアウト設定（30秒）
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        this.progressCallbacks.delete(requestId);
        reject(new Error('分析がタイムアウトしました'));
      }, 30000);
      
      // リクエスト保存
      this.pendingRequests.set(requestId, {
        resolve: (result) => {
          clearTimeout(timeout);
          resolve(result);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        }
      });
      
      // Workerに分析要求送信
      this.worker.postMessage({
        type: 'analyze',
        data: {
          text,
          requestId,
          options
        }
      });
    });
  }
  
  /**
   * 簡易分析メソッド（プログレスなし）
   * 
   * 目的：
   * - 従来のAPIとの互換性維持
   * 
   * 入力：
   * @param {string} text - 分析対象テキスト
   * @param {Object} options - 分析オプション
   * 
   * 出力：
   * @returns {Promise<Object>} 分析結果
   */
  async analyze(text, options = {}) {
    return this.analyzeWithProgress(text, null, options);
  }
  
  /**
   * ヘルスチェック
   * 
   * 目的：
   * - Workerの生存確認
   * 
   * 出力：
   * @returns {Promise<boolean>} Worker生存状態
   */
  async checkHealth() {
    if (!this.worker || !this.workerReady) {
      return false;
    }
    
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(false), 1000);
      
      const messageHandler = (event) => {
        if (event.data.type === 'pong') {
          clearTimeout(timeout);
          this.worker.removeEventListener('message', messageHandler);
          resolve(true);
        }
      };
      
      this.worker.addEventListener('message', messageHandler);
      this.worker.postMessage({ type: 'ping' });
    });
  }
  
  /**
   * リソースクリーンアップ
   * 
   * 目的：
   * - Workerの終了とリソース解放
   * 
   * 副作用：
   * - Worker終了
   * - 保留中リクエストのキャンセル
   */
  destroy() {
    if (this.worker) {
      // 保留中のリクエストをすべて拒否
      this.pendingRequests.forEach((request) => {
        request.reject(new Error('Analyzer destroyed'));
      });
      
      this.pendingRequests.clear();
      this.progressCallbacks.clear();
      
      // Worker終了
      this.worker.terminate();
      this.worker = null;
      this.workerReady = false;
    }
    
    if (this.fallbackAnalyzer) {
      this.fallbackAnalyzer = null;
    }
  }
}

// エクスポート
if (typeof window !== 'undefined') {
  window.OptimizedSituationAnalyzer = OptimizedSituationAnalyzer;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = OptimizedSituationAnalyzer;
}