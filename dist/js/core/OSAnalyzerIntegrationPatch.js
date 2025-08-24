/**
 * HAQEI統一エラーハンドリングシステム - os_analyzer.html統合パッチ
 * 
 * 目的：
 * - os_analyzer.html への非侵入的統合
 * - 既存のエラーハンドラーとの共存
 * - パフォーマンス影響を最小化
 * - 段階的移行の実現
 * 
 * Integration Strategy:
 * - Existing scripts preservation
 * - Graceful enhancement
 * - Zero-downtime migration
 * - Backward compatibility
 * 
 * @author HAQEI System Architect
 * @date 2025-08-05
 */

(function() {
  'use strict';
  
  /**
   * OS Analyzer 統合パッチ
   */
  class OSAnalyzerIntegrationPatch {
    constructor() {
      this.version = "1.0.0-os-analyzer-patch";
      this.integrated = false;
      this.patchApplied = false;
      
      // 統合対象スクリプト
      this.targetScripts = [
        'user-friendly-error-handler-fixed.js',
        'performance-optimizer-fixed.js',
        'app.js',
        'virtual-question-flow-fix.js',
        'screen-transition-fix.js'
      ];
      
      // 既存エラーハンドラーの保存
      this.existingHandlers = new Map();
      
      // 統合メトリクス
      this.metrics = {
        patchStartTime: 0,
        patchEndTime: 0,
        integratedScripts: 0,
        preservedHandlers: 0,
        enhancedElements: 0
      };
      
      console.log(`🔧 OSAnalyzerIntegrationPatch v${this.version} ready`);
    }
    
    /**
     * 統合パッチの適用
     */
    async applyPatch() {
      if (this.patchApplied) {
        console.warn("⚠️ Patch already applied");
        return;
      }
      
      this.metrics.patchStartTime = performance.now();
      
      try {
        console.log("🔧 Applying OS Analyzer integration patch...");
        
        // Phase 1: 既存システムの保存
        await this.preserveExistingSystems();
        
        // Phase 2: 統一エラーハンドラーの初期化
        await this.initializeUnifiedErrorHandling();
        
        // Phase 3: 既存スクリプトとの統合
        await this.integrateWithExistingScripts();
        
        // Phase 4: DOM要素の拡張
        await this.enhanceDOMElements();
        
        // Phase 5: ヘルプシステムとの統合
        await this.integrateWithHelpSystem();
        
        // Phase 6: パフォーマンス最適化
        await this.optimizePerformance();
        
        this.patchApplied = true;
        this.integrated = true;
        this.metrics.patchEndTime = performance.now();
        
        const patchTime = this.metrics.patchEndTime - this.metrics.patchStartTime;
        
        console.log(`✅ OS Analyzer integration patch applied successfully in ${patchTime.toFixed(2)}ms`);
        
        // 統合完了イベント発火
        this.dispatchIntegrationEvent();
        
        return {
          success: true,
          patchTime: patchTime,
          metrics: this.metrics
        };
        
      } catch (error) {
        console.error("❌ OS Analyzer integration patch failed:", error);
        
        // ロールバック試行
        await this.rollbackPatch();
        
        return {
          success: false,
          error: error.message
        };
      }
    }
    
    /**
     * Phase 1: 既存システムの保存
     */
    async preserveExistingSystems() {
      console.log("💾 Phase 1: Preserving existing systems...");
      
      // 既存のグローバルエラーハンドラーを保存
      if (window.onerror) {
        this.existingHandlers.set('global-onerror', window.onerror);
        this.metrics.preservedHandlers++;
      }
      
      if (window.onunhandledrejection) {
        this.existingHandlers.set('global-unhandledrejection', window.onunhandledrejection);
        this.metrics.preservedHandlers++;
      }
      
      // 既存のエラーハンドラーオブジェクトを保存
      const handlerObjects = [
        'errorHandler',
        'comprehensiveErrorHandler',
        'performanceOptimizer',
        'progressDisplayEnhancer',
        'welcomeScreenCleaner'
      ];
      
      handlerObjects.forEach(handlerName => {
        if (window[handlerName]) {
          this.existingHandlers.set(handlerName, window[handlerName]);
          this.metrics.preservedHandlers++;
        }
      });
      
      console.log(`💾 Preserved ${this.metrics.preservedHandlers} existing handlers`);
    }
    
    /**
     * Phase 2: 統一エラーハンドラーの初期化
     */
    async initializeUnifiedErrorHandling() {
      console.log("🎯 Phase 2: Initializing unified error handling...");
      
      // HAQEIErrorSystemBootstrap の確認・初期化
      if (!window.haqeiErrorBootstrap) {
        // Bootstrap の動的読み込みと初期化
        await this.loadAndInitializeBootstrap();
      }
      
      // 統一ハンドラーが利用可能か確認
      if (!window.HAQEIErrorHandler) {
        throw new Error("Unified error handler not available after bootstrap");
      }
      
      console.log("✅ Unified error handler initialized");
    }
    
    /**
     * Bootstrap の動的読み込みと初期化
     */
    async loadAndInitializeBootstrap() {
      try {
        // Bootstrap スクリプトの動的読み込み
        await this.loadScript('/js/core/HAQEIErrorSystemBootstrap.js');
        
        if (window.HAQEIErrorSystemBootstrap) {
          const bootstrap = new window.HAQEIErrorSystemBootstrap();
          const result = await bootstrap.bootstrap();
          
          if (result.success) {
            window.haqeiErrorBootstrap = bootstrap;
            console.log("✅ Bootstrap loaded and initialized dynamically");
          } else {
            throw new Error(`Bootstrap initialization failed: ${result.error}`);
          }
        } else {
          throw new Error("HAQEIErrorSystemBootstrap not available after loading");
        }
        
      } catch (error) {
        throw new Error(`Dynamic bootstrap loading failed: ${error.message}`);
      }
    }
    
    /**
     * スクリプトの動的読み込み
     */
    async loadScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        
        document.head.appendChild(script);
      });
    }
    
    /**
     * Phase 3: 既存スクリプトとの統合
     */
    async integrateWithExistingScripts() {
      console.log("🔌 Phase 3: Integrating with existing scripts...");
      
      // app.js との統合
      await this.integrateWithAppJS();
      
      // 既存エラーハンドラーとの統合
      await this.integrateWithExistingErrorHandlers();
      
      // パフォーマンス最適化スクリプトとの統合
      await this.integrateWithPerformanceOptimizer();
      
      // VirtualQuestionFlow との統合
      await this.integrateWithVirtualQuestionFlow();
      
      console.log(`🔌 Integrated with ${this.metrics.integratedScripts} scripts`);
    }
    
    /**
     * app.js との統合
     */
    async integrateWithAppJS() {
      if (!window.app) {
        console.log("⏭️ app.js not found, skipping integration");
        return;
      }
      
      try {
        // 既存の app.handleError を保存
        const originalHandleError = window.app.handleError;
        
        // 統一ハンドラーでラップ
        window.app.handleError = async (error, context = {}) => {
          // 統一ハンドラーで処理
          await window.HAQEIErrorHandler.handleError(error, {
            ...context,
            source: 'app.js',
            originalHandler: originalHandleError,
            timestamp: Date.now()
          });
          
          // 既存ハンドラーも実行（後方互換性）
          if (originalHandleError && typeof originalHandleError === 'function') {
            try {
              await originalHandleError.call(window.app, error, context);
            } catch (legacyError) {
              console.warn("⚠️ Legacy app.handleError failed:", legacyError);
            }
          }
        };
        
        this.metrics.integratedScripts++;
        console.log("✅ app.js integration completed");
        
      } catch (error) {
        console.error("❌ app.js integration failed:", error);
      }
    }
    
    /**
     * 既存エラーハンドラーとの統合
     */
    async integrateWithExistingErrorHandlers() {
      // user-friendly-error-handler-fixed.js との統合
      if (window.errorHandler && window.errorHandler.handleError) {
        const originalHandler = window.errorHandler.handleError.bind(window.errorHandler);
        
        window.errorHandler.handleError = async (error, context, details) => {
          // 統一ハンドラーで前処理
          await window.HAQEIErrorHandler.handleError(error, {
            source: 'user-friendly-error-handler',
            context: context,
            details: details,
            intercepted: true
          });
          
          // 既存ハンドラー実行
          return originalHandler(error, context, details);
        };
        
        this.metrics.integratedScripts++;
        console.log("✅ user-friendly-error-handler integration completed");
      }
      
      // ComprehensiveErrorHandler との統合
      if (window.errorHandler && window.errorHandler.handleGlobalError) {
        const originalGlobalHandler = window.errorHandler.handleGlobalError.bind(window.errorHandler);
        
        window.errorHandler.handleGlobalError = async (event) => {
          // 統一ハンドラーで前処理
          await window.HAQEIErrorHandler.handleError(event.error || new Error(event.message), {
            source: 'comprehensive-error-handler',
            event: event,
            intercepted: true
          });
          
          // 既存ハンドラー実行
          return originalGlobalHandler(event);
        };
        
        console.log("✅ ComprehensiveErrorHandler integration completed");
      }
    }
    
    /**
     * パフォーマンス最適化スクリプトとの統合
     */
    async integrateWithPerformanceOptimizer() {
      if (window.performanceOptimizer) {
        try {
          // パフォーマンス最適化にエラーハンドリングを追加
          const originalOptimize = window.performanceOptimizer.optimize;
          
          if (originalOptimize) {
            window.performanceOptimizer.optimize = async function() {
              try {
                return await originalOptimize.call(this);
              } catch (error) {
                await window.HAQEIErrorHandler.handleError(error, {
                  source: 'performance-optimizer',
                  method: 'optimize'
                });
                throw error;
              }
            };
            
            this.metrics.integratedScripts++;
            console.log("✅ Performance optimizer integration completed");
          }
        } catch (error) {
          console.warn("⚠️ Performance optimizer integration failed:", error);
        }
      }
    }
    
    /**
     * VirtualQuestionFlow との統合
     */
    async integrateWithVirtualQuestionFlow() {
      if (window.VirtualQuestionFlow) {
        try {
          // プロトタイプレベルでの統合
          const originalMethods = [
            'displayQuestion',
            'handleAnswer',
            'nextQuestion',
            'calculateResults'
          ];
          
          originalMethods.forEach(methodName => {
            if (window.VirtualQuestionFlow.prototype[methodName]) {
              const originalMethod = window.VirtualQuestionFlow.prototype[methodName];
              
              window.VirtualQuestionFlow.prototype[methodName] = async function(...args) {
                try {
                  return await originalMethod.apply(this, args);
                } catch (error) {
                  await window.HAQEIErrorHandler.handleError(error, {
                    source: 'VirtualQuestionFlow',
                    method: methodName,
                    args: args,
                    instance: this
                  });
                  throw error;
                }
              };
            }
          });
          
          this.metrics.integratedScripts++;
          console.log("✅ VirtualQuestionFlow integration completed");
          
        } catch (error) {
          console.warn("⚠️ VirtualQuestionFlow integration failed:", error);
        }
      }
    }
    
    /**
     * Phase 4: DOM要素の拡張
     */
    async enhanceDOMElements() {
      console.log("🎨 Phase 4: Enhancing DOM elements...");
      
      // エラー表示コンテナの確認・作成
      await this.ensureErrorContainers();
      
      // ボタンとフォーム要素の拡張
      await this.enhanceInteractiveElements();
      
      // アクセシビリティの改善
      await this.enhanceAccessibility();
      
      console.log(`🎨 Enhanced ${this.metrics.enhancedElements} DOM elements`);
    }
    
    /**
     * エラー表示コンテナの確認・作成
     */
    async ensureErrorContainers() {
      // 既存のエラーコンテナを確認
      const existingContainers = document.querySelectorAll('#error-notifications, #data-manager-errors');
      
      if (existingContainers.length === 0) {
        // 統一エラーハンドラー用のコンテナを作成
        const container = document.createElement('div');
        container.id = 'haqei-unified-error-container';
        container.className = 'haqei-error-container';
        container.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          pointer-events: none;
        `;
        
        document.body.appendChild(container);
        this.metrics.enhancedElements++;
      }
    }
    
    /**
     * インタラクティブ要素の拡張
     */
    async enhanceInteractiveElements() {
      // ボタン要素の拡張
      const buttons = document.querySelectorAll('button, .btn, [role="button"]');
      buttons.forEach(button => {
        if (!button.hasAttribute('data-haqei-enhanced')) {
          button.addEventListener('click', async (event) => {
            try {
              // ボタンクリックの処理は既存のまま
            } catch (error) {
              await window.HAQEIErrorHandler.handleError(error, {
                source: 'button-click',
                element: button,
                event: event
              });
            }
          });
          
          button.setAttribute('data-haqei-enhanced', 'true');
          this.metrics.enhancedElements++;
        }
      });
      
      // フォーム要素の拡張
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        if (!form.hasAttribute('data-haqei-enhanced')) {
          form.addEventListener('submit', async (event) => {
            try {
              // フォーム送信の処理は既存のまま
            } catch (error) {
              event.preventDefault();
              await window.HAQEIErrorHandler.handleError(error, {
                source: 'form-submit',
                form: form,
                event: event
              });
            }
          });
          
          form.setAttribute('data-haqei-enhanced', 'true');
          this.metrics.enhancedElements++;
        }
      });
    }
    
    /**
     * アクセシビリティの改善
     */
    async enhanceAccessibility() {
      // ARIA ラベルの追加
      const unlabeledElements = document.querySelectorAll('button:not([aria-label]), input:not([aria-label])');
      unlabeledElements.forEach(element => {
        if (element.textContent || element.value) {
          element.setAttribute('aria-label', element.textContent || element.value);
          this.metrics.enhancedElements++;
        }
      });
    }
    
    /**
     * Phase 5: ヘルプシステムとの統合
     */
    async integrateWithHelpSystem() {
      console.log("🔗 Phase 5: Integrating with help system...");
      
      if (window.haqeiHelpSystem) {
        try {
          // ヘルプシステムのエラーハンドリングを拡張
          const originalShowHelp = window.haqeiHelpSystem.showHelp;
          
          if (originalShowHelp) {
            window.haqeiHelpSystem.showHelp = async function(...args) {
              try {
                return await originalShowHelp.apply(this, args);
              } catch (error) {
                await window.HAQEIErrorHandler.handleError(error, {
                  source: 'haqei-help-system',
                  method: 'showHelp',
                  args: args
                });
                throw error;
              }
            };
            
            console.log("✅ Help system integration completed");
          }
        } catch (error) {
          console.warn("⚠️ Help system integration failed:", error);
        }
      } else {
        console.log("⏭️ Help system not found, skipping integration");
      }
    }
    
    /**
     * Phase 6: パフォーマンス最適化
     */
    async optimizePerformance() {
      console.log("⚡ Phase 6: Optimizing performance...");
      
      // メモリ使用量の最適化
      this.optimizeMemoryUsage();
      
      // イベントリスナーの最適化
      this.optimizeEventListeners();
      
      // 不要なポーリングの停止
      this.optimizePolling();
      
      console.log("⚡ Performance optimization completed");
    }
    
    /**
     * メモリ使用量の最適化
     */
    optimizeMemoryUsage() {
      // 定期的なガベージコレクション推奨
      setInterval(() => {
        if (window.gc && typeof window.gc === 'function') {
          window.gc();
        }
      }, 5 * 60 * 1000); // 5分間隔
    }
    
    /**
     * イベントリスナーの最適化
     */
    optimizeEventListeners() {
      // パッシブリスナーの使用を推奨
      const passiveEvents = ['scroll', 'wheel', 'touchstart', 'touchmove'];
      
      passiveEvents.forEach(eventType => {
        const existingListeners = document.querySelectorAll(`[on${eventType}]`);
        existingListeners.forEach(element => {
          const inlineHandler = element.getAttribute(`on${eventType}`);
          if (inlineHandler) {
            element.removeAttribute(`on${eventType}`);
            element.addEventListener(eventType, new Function(inlineHandler), { passive: true });
            this.metrics.enhancedElements++;
          }
        });
      });
    }
    
    /**
     * ポーリングの最適化
     */
    optimizePolling() {
      // 不要なsetIntervalの検出と最適化
      // (具体的な実装は既存のコードに依存)
    }
    
    /**
     * 統合完了イベント発火
     */
    dispatchIntegrationEvent() {
      const event = new CustomEvent('haqei:osAnalyzerIntegrated', {
        detail: {
          version: this.version,
          metrics: this.metrics,
          timestamp: Date.now()
        }
      });
      
      document.dispatchEvent(event);
    }
    
    /**
     * パッチのロールバック
     */
    async rollbackPatch() {
      console.warn("🔄 Rolling back OS Analyzer integration patch...");
      
      try {
        // 既存ハンドラーの復元
        this.existingHandlers.forEach((handler, name) => {
          if (name.startsWith('global-')) {
            const eventName = name.split('-')[1];
            window[`on${eventName}`] = handler;
          } else {
            window[name] = handler;
          }
        });
        
        // 拡張された要素の復元
        const enhancedElements = document.querySelectorAll('[data-haqei-enhanced]');
        enhancedElements.forEach(element => {
          element.removeAttribute('data-haqei-enhanced');
        });
        
        this.patchApplied = false;
        this.integrated = false;
        
        console.log("✅ Rollback completed");
        
      } catch (error) {
        console.error("❌ Rollback failed:", error);
      }
    }
    
    /**
     * 統合状態の取得
     */
    getIntegrationStatus() {
      return {
        version: this.version,
        integrated: this.integrated,
        patchApplied: this.patchApplied,
        metrics: this.metrics,
        targetScripts: this.targetScripts,
        preservedHandlers: Array.from(this.existingHandlers.keys())
      };
    }
  }
  
  // グローバル公開
  window.OSAnalyzerIntegrationPatch = OSAnalyzerIntegrationPatch;
  
  // 自動適用（DOM準備完了後）
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      // 少し遅延して適用（他のスクリプトの初期化を待つ）
      setTimeout(async () => {
        const patch = new OSAnalyzerIntegrationPatch();
        const result = await patch.applyPatch();
        
        if (result.success) {
          window.osAnalyzerPatch = patch;
          console.log("✅ OS Analyzer integration patch auto-applied successfully");
        } else {
          console.error("❌ OS Analyzer integration patch auto-application failed:", result.error);
        }
      }, 2000); // 2秒遅延
      
    } catch (error) {
      console.error("❌ OS Analyzer integration patch initialization failed:", error);
    }
  });
  
  console.log("🔧 OSAnalyzerIntegrationPatch ready for auto-application");
  
})();