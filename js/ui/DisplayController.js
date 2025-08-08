/**
 * DisplayController v2.0
 * 質問表示システム用の統一表示制御クラス
 * 
 * 主要機能：
 * - Element visibility の完全制御
 * - CSS競合の検出・解決
 * - DOM状態の強制修正
 * - パフォーマンス最適化
 */

class DisplayController {
  constructor(options = {}) {
    this.container = options.container || document.body;
    this.debugMode = options.debugMode || false;
    this.autoFix = options.autoFix !== false;
    
    // 状態追跡
    this.managedElements = new WeakMap();
    this.conflictResolver = new CSSConflictResolver();
    
    // パフォーマンス追跡
    this.operationCount = 0;
    this.totalTime = 0;
    
    if (this.debugMode) {
      console.log('🎯 DisplayController v2.0 initialized');
    }
  }

  /**
   * 要素の表示状態を確実に保証
   */
  ensureElementVisible(element, options = {}) {
    const startTime = performance.now();
    
    try {
      const config = {
        forceDisplay: true,
        useImportant: true,
        clearConflicts: true,
        observeChanges: false,
        ...options
      };
      
      if (!element) {
        throw new Error('Element is required');
      }
      
      // 現在の状態を記録
      const initialState = this.getElementState(element);
      this.managedElements.set(element, {
        config,
        initialState,
        lastCheck: Date.now()
      });
      
      // Step 1: CSS競合を解決
      if (config.clearConflicts) {
        this.conflictResolver.resolveConflicts(element);
      }
      
      // Step 2: 強制的に表示状態を設定
      if (config.forceDisplay) {
        this.forceElementVisible(element, config.useImportant);
      }
      
      // Step 3: 親要素も確認
      this.ensureParentVisibility(element);
      
      // Step 4: 最終確認
      const finalState = this.getElementState(element);
      const success = finalState.isVisible;
      
      // Step 5: 変更監視を設定（オプション）
      if (config.observeChanges && success) {
        this.startObserving(element);
      }
      
      this.operationCount++;
      this.totalTime += performance.now() - startTime;
      
      if (this.debugMode) {
        console.log(`🎯 ensureElementVisible: ${success ? '成功' : '失敗'}`, {
          element: element.tagName,
          initialState,
          finalState,
          time: `${(performance.now() - startTime).toFixed(2)}ms`
        });
      }
      
      return success;
      
    } catch (error) {
      console.error('❌ DisplayController.ensureElementVisible failed:', error);
      return false;
    }
  }

  /**
   * 要素を強制的に表示状態にする
   */
  forceElementVisible(element, useImportant = true) {
    const priority = useImportant ? 'important' : '';
    
    // ホスト要素（Web Components用）
    if (element.style) {
      element.style.setProperty('display', 'block', priority);
      element.style.setProperty('visibility', 'visible', priority);
      element.style.setProperty('opacity', '1', priority);
      element.style.setProperty('position', 'relative', priority);
      element.style.setProperty('z-index', '10', priority);
    }
    
    // Shadow Root内の要素も確認
    if (element.shadowRoot) {
      const container = element.shadowRoot.querySelector('.question-container');
      if (container) {
        container.style.setProperty('display', 'block', priority);
        container.style.setProperty('visibility', 'visible', priority);
        container.style.setProperty('opacity', '1', priority);
      }
    }
    
    // 特殊なクラス設定
    element.classList.add('force-visible');
    element.classList.remove('hidden');
  }

  /**
   * 親要素の表示状態も確認
   */
  ensureParentVisibility(element) {
    let parent = element.parentElement;
    let depth = 0;
    const maxDepth = 10; // 無限ループ防止
    
    while (parent && depth < maxDepth) {
      const parentState = this.getElementState(parent);
      
      if (!parentState.isVisible) {
        if (this.debugMode) {
          console.log(`🔍 Parent not visible: ${parent.tagName}${parent.id ? '#' + parent.id : ''}${parent.className ? '.' + parent.className.split(' ')[0] : ''}`);
        }
        
        // 親要素も表示状態にする（ただしimportantは使わない）
        if (parent.style.display === 'none') {
          parent.style.display = 'block';
        }
        if (parent.style.visibility === 'hidden') {
          parent.style.visibility = 'visible';
        }
        if (parent.style.opacity === '0') {
          parent.style.opacity = '1';
        }
      }
      
      parent = parent.parentElement;
      depth++;
    }
  }

  /**
   * 要素の表示状態を取得
   */
  getElementState(element) {
    if (!element) return { isVisible: false, reason: 'Element not found' };
    
    const computedStyle = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    const state = {
      isVisible: true,
      issues: [],
      display: computedStyle.display,
      visibility: computedStyle.visibility,
      opacity: computedStyle.opacity,
      position: computedStyle.position,
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left
    };
    
    // 表示状態をチェック
    if (computedStyle.display === 'none') {
      state.isVisible = false;
      state.issues.push('display: none');
    }
    
    if (computedStyle.visibility === 'hidden') {
      state.isVisible = false;
      state.issues.push('visibility: hidden');
    }
    
    if (computedStyle.opacity === '0') {
      state.isVisible = false;
      state.issues.push('opacity: 0');
    }
    
    if (rect.width === 0 || rect.height === 0) {
      state.isVisible = false;
      state.issues.push('zero dimensions');
    }
    
    if (rect.top < -rect.height || rect.top > window.innerHeight) {
      state.issues.push('outside viewport');
    }
    
    return state;
  }

  /**
   * 要素の変更を監視
   */
  startObserving(element) {
    if (!window.MutationObserver) return;
    
    const observer = new MutationObserver((mutations) => {
      let needsRecheck = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'style' || 
             mutation.attributeName === 'class')) {
          needsRecheck = true;
        }
      });
      
      if (needsRecheck) {
        setTimeout(() => {
          this.ensureElementVisible(element);
        }, 100);
      }
    });
    
    observer.observe(element, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    // クリーンアップ用に observer を保存
    const managedData = this.managedElements.get(element);
    if (managedData) {
      managedData.observer = observer;
    }
  }

  /**
   * パフォーマンス統計を取得
   */
  getStats() {
    return {
      operationCount: this.operationCount,
      totalTime: this.totalTime,
      averageTime: this.operationCount > 0 ? this.totalTime / this.operationCount : 0,
      managedElementsCount: this.managedElements.size || 0
    };
  }

  /**
   * クリーンアップ
   */
  destroy() {
    // MutationObserver のクリーンアップ
    for (const [element, data] of this.managedElements.entries()) {
      if (data.observer) {
        data.observer.disconnect();
      }
    }
    
    if (this.debugMode) {
      console.log('🎯 DisplayController destroyed', this.getStats());
    }
  }
}

/**
 * CSS競合解決クラス
 */
class CSSConflictResolver {
  constructor() {
    this.knownConflicts = [
      'display: none !important',
      'visibility: hidden !important',
      'opacity: 0 !important',
      'height: 0px',
      'width: 0px',
      'overflow: hidden'
    ];
  }

  async resolveConflicts(element) {
    try {
      // スタイルシートから競合するルールを検出
      const conflicts = this.detectConflicts(element);
      
      if (conflicts.length > 0) {
        console.log(`🔧 CSS conflicts detected for ${element.tagName}:`, conflicts);
        
        // 一時的に無効化（実際の実装では、より慎重な方法を使用）
        this.overrideConflicts(element, conflicts);
      }
      
      return conflicts.length === 0;
      
    } catch (error) {
      console.error('❌ CSSConflictResolver.resolveConflicts failed:', error);
      return false;
    }
  }

  detectConflicts(element) {
    const conflicts = [];
    const computedStyle = window.getComputedStyle(element);
    
    // 問題のあるスタイルを検出
    if (computedStyle.display === 'none') {
      conflicts.push('display: none');
    }
    
    if (computedStyle.visibility === 'hidden') {
      conflicts.push('visibility: hidden');
    }
    
    if (computedStyle.opacity === '0') {
      conflicts.push('opacity: 0');
    }
    
    return conflicts;
  }

  overrideConflicts(element, conflicts) {
    // 強制的にスタイルを上書き
    conflicts.forEach(conflict => {
      if (conflict.includes('display')) {
        element.style.setProperty('display', 'block', 'important');
      }
      if (conflict.includes('visibility')) {
        element.style.setProperty('visibility', 'visible', 'important');
      }
      if (conflict.includes('opacity')) {
        element.style.setProperty('opacity', '1', 'important');
      }
    });
  }
}

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.DisplayController = DisplayController;
  window.CSSConflictResolver = CSSConflictResolver;
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DisplayController, CSSConflictResolver };
}