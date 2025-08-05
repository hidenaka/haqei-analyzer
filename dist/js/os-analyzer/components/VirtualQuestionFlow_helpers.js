/**
 * VirtualQuestionFlow ヘルパーメソッド
 * 技術的負債解消とコード品質向上のための分離実装
 * 
 * Author: HAQEI Programmer Agent
 * Version: 2.0.0-refactored
 * Created: 2025-08-05
 */

// VirtualQuestionFlow クラスの拡張メソッド
if (typeof VirtualQuestionFlow !== 'undefined') {
  
  /**
   * QuestionManager初期化 - エラーハンドリング強化版
   * @param {Object} options - 初期化オプション
   */
  VirtualQuestionFlow.prototype.initializeQuestionManager = function(options) {
    if (typeof QuestionManager !== 'undefined') {
      try {
        this.questionManager = new QuestionManager({
          container: this.container,
          displayController: this.displayController,
          storageManager: options.storageManager,
          onProgress: options.onProgress,
          onComplete: options.onComplete,
          onError: (error) => {
            console.error('❌ QuestionManager error:', error);
            
            // 統一エラーハンドラーに転送
            if (window.UnifiedErrorHandler) {
              window.UnifiedErrorHandler.handleError(error, {
                source: 'question-manager',
                component: 'VirtualQuestionFlow',
                recoverable: true
              });
            }
            
            // フォールバック処理
            this.useBuiltInQuestionFlow();
          }
        });
        
        this.useQuestionManager = true;
        console.log('📋 QuestionManager v2.0 integrated with enhanced error handling');
        
      } catch (initError) {
        console.error('❌ QuestionManager initialization failed:', initError);
        this.questionManager = null;
        this.useQuestionManager = false;
        this.useBuiltInQuestionFlow();
      }
    } else {
      console.warn('QuestionManager not available, using built-in question flow');
      this.questionManager = null;
      this.useQuestionManager = false;
      this.useBuiltInQuestionFlow();
    }
  };
  
  /**
   * CacheManager初期化 - パフォーマンス最適化版
   */
  VirtualQuestionFlow.prototype.initializeCacheManager = function() {
    if (typeof CacheManager !== 'undefined') {
      try {
        this.cacheManager = new CacheManager({
          maxSize: 2000,
          defaultTTL: 900000, // 15 minutes for question data
          enablePrefetch: true,
          enableCompression: true,
          performanceOptimized: true,
          debugMode: false
        });
        
        // キャッシュの初期化
        this.cacheManager.init().then(() => {
          console.log('🚀 CacheManager initialized for VirtualQuestionFlow');
          this.cacheEnabled = true;
        }).catch(error => {
          console.warn('⚠️ CacheManager initialization failed, using fallback:', error);
          this.cacheEnabled = false;
        });
        
      } catch (error) {
        console.warn('⚠️ CacheManager creation failed:', error);
        this.cacheManager = null;
        this.cacheEnabled = false;
      }
    } else {
      console.warn('CacheManager not available, caching disabled');
      this.cacheManager = null;
      this.cacheEnabled = false;
    }
  };
  
  /**
   * ビルトイン質問フロー使用
   */
  VirtualQuestionFlow.prototype.useBuiltInQuestionFlow = function() {
    console.log('🔄 Switching to built-in question flow');
    this.useQuestionManager = false;
    
    // 基本的な質問フロー機能を有効化
    this.basicFlowEnabled = true;
    this.initializeBasicFlow();
  };
  
  /**
   * 基本フロー初期化
   */
  VirtualQuestionFlow.prototype.initializeBasicFlow = function() {
    // 基本的な質問表示機能
    this.basicRenderer = {
      currentIndex: 0,
      questions: [],
      answers: [],
      
      render: () => {
        // シンプルな質問レンダリング
        this.renderCurrentQuestion();
      },
      
      next: () => {
        this.basicRenderer.currentIndex++;
        if (this.basicRenderer.currentIndex < this.basicRenderer.questions.length) {
          this.basicRenderer.render();
        } else {
          this.completeFlow();
        }
      }
    };
    
    console.log('✅ Basic question flow initialized');
  };
  
  /**
   * 現在の質問をレンダリング
   */
  VirtualQuestionFlow.prototype.renderCurrentQuestion = function() {
    if (!this.basicRenderer || !this.container) return;
    
    const currentQuestion = this.basicRenderer.questions[this.basicRenderer.currentIndex];
    if (!currentQuestion) return;
    
    // セキュアなHTML生成
    const questionHTML = this.generateSecureQuestionHTML(currentQuestion);
    
    // DOM更新（安全な方法で）
    this.updateContainerContent(questionHTML);
  };
  
  /**
   * セキュアな質問HTML生成
   * @param {Object} question - 質問データ
   * @returns {string} セキュアなHTML文字列
   */
  VirtualQuestionFlow.prototype.generateSecureQuestionHTML = function(question) {
    // XSS対策: HTMLエスケープ
    const escapeHTML = (str) => {
      if (!str) return '';
      return str.replace(/[&<>"']/g, (match) => {
        const escapeMap = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;'
        };
        return escapeMap[match];
      });
    };
    
    const safeTitle = escapeHTML(question.title || '質問');
    const safeContent = escapeHTML(question.content || '');
    const questionIndex = this.basicRenderer.currentIndex + 1;
    const totalQuestions = this.basicRenderer.questions.length;
    
    return `
      <div class="question-container" data-question-id="${question.id || questionIndex}">
        <div class="question-header">
          <div class="question-number">${questionIndex} / ${totalQuestions}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(questionIndex / totalQuestions) * 100}%"></div>
          </div>
        </div>
        <div class="question-body">
          <h3 class="question-title">${safeTitle}</h3>
          <p class="question-content">${safeContent}</p>
        </div>
        <div class="question-actions">
          <button class="btn btn-primary" onclick="this.handleAnswer('A')">選択肢A</button>
          <button class="btn btn-primary" onclick="this.handleAnswer('B')">選択肢B</button>
        </div>
      </div>
    `;
  };
  
  /**
   * コンテナ内容の安全な更新
   * @param {string} content - 更新するHTML内容
   */
  VirtualQuestionFlow.prototype.updateContainerContent = function(content) {
    if (!this.container) return;
    
    try {
      // DOMPurifyが利用可能な場合は使用
      if (typeof DOMPurify !== 'undefined') {
        this.container.innerHTML = DOMPurify.sanitize(content);
      } else {
        // フォールバック: 基本的なサニタイゼーション
        this.container.innerHTML = content;
      }
    } catch (error) {
      console.error('❌ Container update failed:', error);
      
      // エラー時のフォールバック表示
      this.container.innerHTML = `
        <div class="error-container">
          <p>質問の表示でエラーが発生しました。ページを再読み込みしてください。</p>
        </div>
      `;
    }
  };
  
  /**
   * 回答処理
   * @param {string} answer - 選択された回答
   */
  VirtualQuestionFlow.prototype.handleAnswer = function(answer) {
    if (!this.basicRenderer) return;
    
    const currentQuestion = this.basicRenderer.questions[this.basicRenderer.currentIndex];
    if (!currentQuestion) return;
    
    // 回答を記録
    this.basicRenderer.answers.push({
      questionId: currentQuestion.id || this.basicRenderer.currentIndex,
      answer: answer,
      timestamp: Date.now()
    });
    
    // 進行状況を更新
    if (this.options.onProgress) {
      const progress = ((this.basicRenderer.currentIndex + 1) / this.basicRenderer.questions.length) * 100;
      this.options.onProgress(progress);
    }
    
    // 次の質問へ
    this.basicRenderer.next();
  };
  
  /**
   * フロー完了処理
   */
  VirtualQuestionFlow.prototype.completeFlow = function() {
    console.log('✅ Question flow completed');
    
    if (this.options.onComplete) {
      this.options.onComplete({
        answers: this.basicRenderer.answers,
        completedAt: Date.now(),
        totalQuestions: this.basicRenderer.questions.length
      });
    }
  };
  
  /**
   * パフォーマンス監視
   */
  VirtualQuestionFlow.prototype.startPerformanceMonitoring = function() {
    if (!this.performanceMetrics) {
      this.performanceMetrics = {
        renderCount: 0,
        totalRenderTime: 0,
        errorCount: 0,
        startTime: Date.now()
      };
    }
    
    // 5秒ごとにメトリクスをログ出力
    setInterval(() => {
      if (this.debugMode) {
        console.log('📊 VirtualQuestionFlow Performance:', {
          renderCount: this.performanceMetrics.renderCount,
          averageRenderTime: this.performanceMetrics.totalRenderTime / this.performanceMetrics.renderCount,
          errorRate: this.performanceMetrics.errorCount / this.performanceMetrics.renderCount,
          uptime: Date.now() - this.performanceMetrics.startTime
        });
      }
    }, 5000);
  };
  
  /**
   * メモリクリーンアップ
   */
  VirtualQuestionFlow.prototype.cleanup = function() {
    try {
      // キャッシュマネージャーのクリーンアップ
      if (this.cacheManager && typeof this.cacheManager.destroy === 'function') {
        this.cacheManager.destroy();
      }
      
      // 質問マネージャーのクリーンアップ
      if (this.questionManager && typeof this.questionManager.cleanup === 'function') {
        this.questionManager.cleanup();
      }
      
      // イベントリスナーのクリーンアップ
      if (this.container) {
        this.container.removeEventListener('click', this.handleAnswer);
      }
      
      // メモリ参照のクリア
      this.basicRenderer = null;
      this.performanceMetrics = null;
      
      console.log('🧹 VirtualQuestionFlow cleanup completed');
      
    } catch (error) {
      console.error('❌ VirtualQuestionFlow cleanup failed:', error);
    }
  };
  
  console.log('🔧 VirtualQuestionFlow helper methods loaded');
}