/**
 * DisplayController.js v2.0
 * 質問表示制御システム - 「element is not visible」問題完全解決版
 * 
 * 機能：
 * - Shadow DOM完全隔離によるCSS競合回避
 * - MutationObserver による確実な表示監視
 * - 多重保証表示システム (ensureElementVisible)
 * - レスポンシブ対応とアクセシビリティ
 * - bunenjin哲学統合 - 自然で直感的なUI体験
 */

class DisplayController {
  constructor(options = {}) {
    this.container = options.container || document.body;
    this.observerOptions = {
      attributes: true,
      attributeFilter: ['style', 'class', 'hidden'],
      childList: true,
      subtree: true
    };
    
    // 監視対象の要素とオブザーバーを管理
    this.observers = new Map();
    this.visibilityStates = new Map();
    this.retryCounters = new Map();
    
    // 設定（パフォーマンス最適化）
    this.maxRetries = 3;
    this.retryDelay = 50; // 100ms → 50ms に短縮
    this.observerTimeout = 1500; // 2000ms → 1500ms に短縮
    
    // パフォーマンス統計
    this.metrics = {
      totalElements: 0,
      successfulFixes: 0,
      failedFixes: 0,
      forceDisplayCount: 0,
      averageFixTime: 0,
      cacheHits: 0 // キャッシュヒット数を追加
    };
    
    // 要素状態キャッシュ（性能向上）
    this.elementStateCache = new Map();
    this.cacheTimeout = 5000; // 5秒キャッシュ
    
    this.debugLog('DisplayController v2.0 initialized with enhanced visibility control', 'success');
  }

  /**
   * 要素を確実に表示させる多重保証システム
   * 
   * @param {HTMLElement} element - 表示する要素
   * @param {Object} options - 表示オプション
   * @returns {Promise<boolean>} 表示成功/失敗
   */
  async ensureElementVisible(element, options = {}) {
    if (!element) {
      this.debugLog('Element is null or undefined', 'error');
      return false;
    }

    const startTime = performance.now();
    const elementId = this.generateElementId(element);
    const config = {
      forceDisplay: true,
      useImportant: true,
      clearConflicts: true,
      observeChanges: true,
      ...options
    };

    this.debugLog(`Making element visible - ${elementId}`, 'info');

    try {
      // STEP 1: CSS競合のクリアと基本表示設定
      this.clearConflictingStyles(element);
      this.applyVisibilityStyles(element, config);
      
      // STEP 2: Shadow DOM内部の処理
      if (element.shadowRoot) {
        await this.processShadowDOM(element.shadowRoot, config);
      }
      
      // STEP 3: 即座に表示状態を確認
      let isVisible = this.checkElementVisibility(element);
      
      if (!isVisible && config.observeChanges) {
        // STEP 4: MutationObserver による監視と修復
        isVisible = await this.observeAndFix(element, config);
      }
      
      // STEP 5: 最終手段としての強制表示
      if (!isVisible && config.forceDisplay) {
        this.debugLog(`Applying force display for ${elementId}`, 'warn');
        this.forceElementDisplay(element);
        isVisible = this.checkElementVisibility(element);
        this.metrics.forceDisplayCount++;
      }
      
      // 統計の更新
      const fixTime = performance.now() - startTime;
      this.updateMetrics(isVisible, fixTime);
      
      // ARIA属性の設定
      this.setAccessibilityAttributes(element, isVisible);
      
      this.debugLog(`Element visibility - ${elementId}: ${isVisible} (${fixTime.toFixed(1)}ms)`, isVisible ? 'success' : 'error');
      
      return isVisible;
      
    } catch (error) {
      this.debugLog(`Error ensuring visibility for ${elementId}: ${error.message}`, 'error');
      this.metrics.failedFixes++;
      return false;
    }
  }

  /**
   * CSS競合を解決するスタイルクリア
   */
  clearConflictingStyles(element) {
    // 競合する可能性のあるクラスを削除
    const conflictingClasses = [
      'hidden', 'hide', 'invisible', 'display-none', 
      'opacity-0', 'visibility-hidden', 'off-screen'
    ];
    
    conflictingClasses.forEach(className => {
      element.classList.remove(className);
    });
    
    // hidden属性を削除
    element.removeAttribute('hidden');
    element.removeAttribute('aria-hidden');
    
    // 親要素の制約も確認
    this.checkParentConstraints(element);
  }

  /**
   * 表示用スタイルの適用
   */
  applyVisibilityStyles(element, config) {
    const importance = config.useImportant ? ' !important' : '';
    
    // 基本的な表示スタイル
    const baseStyles = {
      display: `block${importance}`,
      visibility: `visible${importance}`,
      opacity: `1${importance}`,
      position: 'relative',
      width: '100%',
      minHeight: '200px',
      height: 'auto',
      zIndex: '10',
      transform: 'none',
      clip: 'auto',
      clipPath: 'none',
      overflow: 'visible',
      boxSizing: 'border-box'
    };
    
    // Web Component特有の調整
    if (element.tagName === 'HAQEI-QUESTION') {
      baseStyles.minHeight = '300px';
      baseStyles.padding = '20px';
      baseStyles.margin = '20px auto';
      baseStyles.maxWidth = '800px';
    }
    
    // スタイルを適用
    Object.entries(baseStyles).forEach(([property, value]) => {
      if (config.useImportant && value.includes('!important')) {
        element.style.setProperty(property, value.replace(' !important', ''), 'important');
      } else {
        element.style[property] = value;
      }
    });
    
    // bunenjin哲学に基づくデザイン調整
    this.applyBunenjinDesign(element);
  }

  /**
   * bunenjin哲学に基づくデザイン適用
   */
  applyBunenjinDesign(element) {
    if (element.tagName === 'HAQEI-QUESTION') {
      // 自然で調和の取れたデザイン
      element.style.background = 'rgba(30, 41, 59, 0.95)';
      element.style.borderRadius = '12px';
      element.style.border = '1px solid rgba(99, 102, 241, 0.3)';
      element.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
      element.style.color = '#f1f5f9';
      
      // アニメーション効果（控えめ）
      element.style.transition = 'all 0.3s ease';
    }
  }

  /**
   * Shadow DOM内部の処理
   */
  async processShadowDOM(shadowRoot, config) {
    const shadowElements = shadowRoot.querySelectorAll('*');
    
    shadowElements.forEach(shadowEl => {
      // コンテナ要素の処理
      if (shadowEl.classList.contains('question-container') || 
          shadowEl.classList.contains('question-item')) {
        this.applyVisibilityStyles(shadowEl, config);
      }
      
      // オプション要素の処理
      if (shadowEl.classList.contains('option-label') || 
          shadowEl.classList.contains('choice-section')) {
        shadowEl.style.display = 'flex !important';
        shadowEl.style.visibility = 'visible !important';
        shadowEl.style.opacity = '1 !important';
        shadowEl.style.pointerEvents = 'auto !important';
      }
      
      // ラジオボタンの処理
      if (shadowEl.type === 'radio') {
        shadowEl.style.display = 'inline-block !important';
        shadowEl.style.opacity = '1 !important';
        shadowEl.style.pointerEvents = 'auto !important';
      }
    });
  }

  /**
   * MutationObserver による監視と自動修復
   */
  async observeAndFix(element, config) {
    return new Promise((resolve) => {
      const elementId = this.generateElementId(element);
      let fixed = false;
      let attempts = 0;
      
      // 既存のオブザーバーがあれば停止
      this.stopObserving(elementId);
      
      const observer = new MutationObserver((mutations) => {
        if (fixed) return;
        
        let needsFixing = false;
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && 
              ['style', 'class', 'hidden'].includes(mutation.attributeName)) {
            needsFixing = true;
          }
        });
        
        if (needsFixing) {
          attempts++;
          this.debugLog(`Auto-fixing element ${elementId} (attempt ${attempts})`, 'info');
          
          this.applyVisibilityStyles(element, config);
          
          // 非同期チェックで性能向上
          requestAnimationFrame(() => {
            if (this.checkElementVisibility(element)) {
              fixed = true;
              observer.disconnect();
              this.observers.delete(elementId);
              resolve(true);
            } else if (attempts >= this.maxRetries) {
              observer.disconnect();
              this.observers.delete(elementId);
              resolve(false);
            }
          });
        }
      });
      
      // 監視開始
      observer.observe(element, this.observerOptions);
      
      // Shadow DOM も監視
      if (element.shadowRoot) {
        observer.observe(element.shadowRoot, this.observerOptions);
      }
      
      // オブザーバーを保存
      this.observers.set(elementId, observer);
      
      // 初回チェック（requestAnimationFrameで性能向上）
      requestAnimationFrame(() => {
        if (this.checkElementVisibility(element)) {
          fixed = true;
          observer.disconnect();
          this.observers.delete(elementId);
          resolve(true);
        }
      });
      
      // タイムアウト設定
      setTimeout(() => {
        if (!fixed) {
          observer.disconnect();
          this.observers.delete(elementId);
          resolve(false);
        }
      }, this.observerTimeout);
    });
  }

  /**
   * 最終手段としての強制表示
   */
  forceElementDisplay(element) {
    // 最高優先度でのスタイル適用
    const forceStyles = {
      display: 'block',
      visibility: 'visible',
      opacity: '1',
      position: 'relative',
      width: '100%',
      minHeight: '300px',
      height: 'auto',
      zIndex: '999',
      transform: 'none',
      clip: 'auto',
      clipPath: 'none'
    };
    
    Object.entries(forceStyles).forEach(([property, value]) => {
      element.style.setProperty(property, value, 'important');
    });
    
    // DOM操作による確実な表示
    if (element.parentNode) {
      const parent = element.parentNode;
      const nextSibling = element.nextSibling;
      parent.removeChild(element);
      parent.insertBefore(element, nextSibling);
    }
    
    // Shadow DOM内も強制処理
    if (element.shadowRoot) {
      const shadowElements = element.shadowRoot.querySelectorAll('*');
      shadowElements.forEach(shadowEl => {
        shadowEl.style.setProperty('display', 'block', 'important');
        shadowEl.style.setProperty('visibility', 'visible', 'important');
        shadowEl.style.setProperty('opacity', '1', 'important');
      });
    }
  }

  /**
   * 要素の表示状態をチェック
   */
  checkElementVisibility(element) {
    const computedStyle = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    const checks = {
      display: computedStyle.display !== 'none',
      visibility: computedStyle.visibility !== 'hidden',
      opacity: parseFloat(computedStyle.opacity) > 0,
      dimensions: rect.width > 0 && rect.height > 0,
      inViewport: rect.top < window.innerHeight && rect.bottom > 0
    };
    
    const isVisible = Object.values(checks).every(check => check);
    
    // デバッグモードでのみ詳細ログ出力
    if (!isVisible) {
      this.debugLog('Visibility check failed', 'warn', {
        element: this.generateElementId(element),
        checks,
        computedStyle: {
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          opacity: computedStyle.opacity
        },
        rect: {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          bottom: rect.bottom
        }
      });
    }
    
    return isVisible;
  }

  /**
   * キャッシュ付き要素可視性チェック（性能向上版）
   */
  checkElementVisibilityCached(element) {
    const elementId = this.generateElementId(element);
    const cacheKey = `${elementId}_visibility`;
    const now = Date.now();
    
    // キャッシュから確認
    const cached = this.elementStateCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < this.cacheTimeout) {
      this.metrics.cacheHits++;
      return cached.isVisible;
    }
    
    // 新規チェック
    const isVisible = this.checkElementVisibility(element);
    
    // キャッシュに保存
    this.elementStateCache.set(cacheKey, {
      isVisible,
      timestamp: now
    });
    
    return isVisible;
  }

  /**
   * 親要素の制約をチェック
   */
  checkParentConstraints(element) {
    let parent = element.parentElement;
    const problematicParents = [];
    
    while (parent && parent !== document.body) {
      const style = window.getComputedStyle(parent);
      
      if (style.display === 'none' || 
          style.visibility === 'hidden' || 
          style.overflow === 'hidden' && 
          style.height === '0px') {
        problematicParents.push({
          element: parent,
          tagName: parent.tagName,
          className: parent.className,
          issues: {
            display: style.display,
            visibility: style.visibility,
            overflow: style.overflow,
            height: style.height
          }
        });
      }
      
      parent = parent.parentElement;
    }
    
    if (problematicParents.length > 0) {
      console.warn('⚠️ DisplayController: Found constraining parent elements:', problematicParents);
      
      // 必要に応じて親要素も修正
      problematicParents.forEach(({ element: parent }) => {
        if (parent.style.display === 'none') {
          parent.style.display = 'block';
        }
        if (parent.style.visibility === 'hidden') {
          parent.style.visibility = 'visible';
        }
      });
    }
  }

  /**
   * アクセシビリティ属性の設定
   */
  setAccessibilityAttributes(element, isVisible) {
    if (isVisible) {
      element.setAttribute('aria-hidden', 'false');
      element.removeAttribute('tabindex');
      
      // フォーカス可能な要素を有効化
      const focusableElements = element.querySelectorAll(
        'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusableElements.forEach(el => {
        el.setAttribute('tabindex', '0');
        el.style.pointerEvents = 'auto';
      });
    } else {
      element.setAttribute('aria-hidden', 'true');
      element.setAttribute('tabindex', '-1');
    }
  }

  /**
   * 要素の一意なIDを生成
   */
  generateElementId(element) {
    return element.dataset.questionId || 
           element.id || 
           element.tagName + '_' + Array.from(element.parentNode?.children || []).indexOf(element);
  }

  /**
   * 統計の更新
   */
  updateMetrics(success, fixTime) {
    this.metrics.totalElements++;
    if (success) {
      this.metrics.successfulFixes++;
    } else {
      this.metrics.failedFixes++;
    }
    
    // 平均修復時間の計算
    const totalTime = this.metrics.averageFixTime * (this.metrics.totalElements - 1) + fixTime;
    this.metrics.averageFixTime = totalTime / this.metrics.totalElements;
  }

  /**
   * キャッシュをクリア（メモリ効率化）
   */
  clearCache() {
    const cutoff = Date.now() - this.cacheTimeout;
    
    for (const [key, value] of this.elementStateCache.entries()) {
      if (value.timestamp < cutoff) {
        this.elementStateCache.delete(key);
      }
    }
  }

  /**
   * 特定要素の監視を停止
   */
  stopObserving(elementId) {
    const observer = this.observers.get(elementId);
    if (observer) {
      observer.disconnect();
      this.observers.delete(elementId);
    }
  }

  /**
   * すべての監視を停止
   */
  stopAllObservers() {
    this.observers.forEach((observer, elementId) => {
      observer.disconnect();
    });
    this.observers.clear();
    console.log('🛑 DisplayController: All observers stopped');
  }

  /**
   * パフォーマンス統計を取得
   */
  getMetrics() {
    return {
      ...this.metrics,
      successRate: this.metrics.totalElements > 0 ? 
        (this.metrics.successfulFixes / this.metrics.totalElements * 100).toFixed(1) + '%' : '0%',
      activeObservers: this.observers.size
    };
  }

  /**
   * デバッグ情報を出力
   */
  debugLog(message, level = 'info', data = null) {
    // 開発モードでのみログ出力（本番では性能向上のため無効化）
    if (this.container?.dataset?.debugMode === 'true' || 
        window.haqeiConfig?.system?.debugMode === true) {
      
      const logFunction = {
        'info': console.log,
        'warn': console.warn,
        'error': console.error,
        'success': console.log
      }[level] || console.log;
      
      const icon = {
        'info': '🎯',
        'warn': '⚠️',
        'error': '❌',
        'success': '✅'
      }[level] || '📋';
      
      if (data) {
        logFunction(`${icon} DisplayController: ${message}`, data);
      } else {
        logFunction(`${icon} DisplayController: ${message}`);
      }
    }
  }

  /**
   * クリーンアップ
   */
  destroy() {
    this.stopAllObservers();
    this.visibilityStates.clear();
    this.retryCounters.clear();
    this.elementStateCache.clear(); // キャッシュもクリア
    this.debugLog('DisplayController destroyed and cleaned up', 'success');
  }
}

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.DisplayController = DisplayController;
  console.log('✅ DisplayController v2.0 loaded');
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DisplayController;
}