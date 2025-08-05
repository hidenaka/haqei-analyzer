/**
 * VirtualQuestionFlow Utils Module
 * ユーティリティ関数と緊急修正ファイルの統合
 */

class VirtualQuestionFlowUtils {
  constructor(core) {
    this.core = core;
    this.performanceMetrics = {
      renderTime: 0,
      memoryUsage: 0,
      domElementCount: 0,
      poolHits: 0,
      poolMisses: 0
    };
    
    // 緊急修正ファイルの統合機能を初期化
    this.initializeEmergencyFixes();
  }
  
  /**
   * 緊急修正ファイルの統合機能初期化
   * 20個以上の応急処置ファイルをこのモジュールに統合
   */
  initializeEmergencyFixes() {
    // virtual-question-flow-fix.js の機能
    this.initializeVirtualQuestionFlowFix();
    
    // urgent-virtual-question-fix.js の機能
    this.initializeUrgentVirtualQuestionFix();
    
    // urgent-scroll-fix.js の機能
    this.initializeUrgentScrollFix();
    
    // emergency-question-visibility-fix.js の機能
    this.initializeEmergencyQuestionVisibilityFix();
    
    console.log('🚑 Emergency fixes integrated');
  }
  
  /**
   * Virtual Question Flow Fix 統合
   */
  initializeVirtualQuestionFlowFix() {
    // 偶数番設問表示問題の完全解決
    this.fixEvenQuestionDisplay = () => {
      const currentIndex = this.core.currentQuestionIndex;
      const currentElement = this.core.activeElements.get(currentIndex);
      
      if (currentElement) {
        // 強制表示適用
        currentElement.style.setProperty('display', 'block', 'important');
        currentElement.style.setProperty('opacity', '1', 'important');
        currentElement.style.setProperty('visibility', 'visible', 'important');
        currentElement.style.setProperty('min-height', '200px', 'important');
        
        console.log(`🔧 Even question fix applied: ${currentElement.dataset.questionId}`);
      }
    };
  }
  
  /**
   * Urgent Virtual Question Fix 統合
   */
  initializeUrgentVirtualQuestionFix() {
    // 仮想設問の緊急表示修正
    this.urgentVirtualQuestionFix = () => {
      const viewport = this.core.container.querySelector('#virtual-viewport');
      if (!viewport) return;
      
      const children = viewport.children;
      let visibleCount = 0;
      
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const isCurrentQuestion = parseInt(child.dataset.questionIndex) === this.core.currentQuestionIndex;
        
        if (isCurrentQuestion) {
          // 現在の設問を強制表示
          child.style.cssText = `
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            position: relative !important;
            z-index: 999 !important;
            min-height: 200px !important;
          `;
          visibleCount++;
        } else {
          // 他の設問を非表示
          child.style.cssText = `
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
          `;
        }
      }
      
      console.log(`🚨 Urgent fix applied, visible questions: ${visibleCount}`);
    };
  }
  
  /**
   * Urgent Scroll Fix 統合
   */
  initializeUrgentScrollFix() {
    // スクロール位置の緊急修正
    this.urgentScrollFix = () => {
      // ページトップにスクロール
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // コンテナ内のスクロールもリセット
      const scrollableElements = this.core.container.querySelectorAll('[style*="scroll"], .scrollable');
      scrollableElements.forEach(el => {
        el.scrollTop = 0;
        el.scrollLeft = 0;
      });
      
      console.log('📜 Urgent scroll fix applied');
    };
  }
  
  /**
   * Emergency Question Visibility Fix 統合
   */
  initializeEmergencyQuestionVisibilityFix() {
    // 設問可視性の緊急修正
    this.emergencyQuestionVisibilityFix = () => {
      const currentElement = this.core.activeElements.get(this.core.currentQuestionIndex);
      if (!currentElement) return;
      
      // CSS競合を完全に回避
      const importantStyles = {
        'display': 'block',
        'opacity': '1',
        'visibility': 'visible',
        'position': 'relative',
        'z-index': '999',
        'min-height': '200px',
        'height': 'auto',
        'overflow': 'visible',
        'transform': 'none',
        'left': 'auto',
        'top': 'auto',
        'right': 'auto',
        'bottom': 'auto'
      };
      
      Object.entries(importantStyles).forEach(([prop, value]) => {
        currentElement.style.setProperty(prop, value, 'important');
      });
      
      // Shadow DOM内も修正
      if (currentElement.shadowRoot) {
        const shadowElements = currentElement.shadowRoot.querySelectorAll('*');
        shadowElements.forEach(el => {
          if (el.classList.contains('question-container') || 
              el.classList.contains('question-item')) {
            Object.entries(importantStyles).forEach(([prop, value]) => {
              el.style.setProperty(prop, value, 'important');
            });
          }
        });
      }
      
      console.log('🚨 Emergency visibility fix applied');
    };
  }
  
  /**
   * パフォーマンス監視
   */
  measurePerformance(operation, func) {
    const startTime = performance.now();
    const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    
    const result = func();
    
    const endTime = performance.now();
    const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    
    const metrics = {
      operation,
      duration: endTime - startTime,
      memoryDelta: endMemory - startMemory,
      timestamp: Date.now()
    };
    
    this.updatePerformanceMetrics(metrics);
    
    if (metrics.duration > 16) { // 60fps threshold
      console.warn(`⚠️ Slow operation detected: ${operation} (${metrics.duration.toFixed(2)}ms)`);
    }
    
    return result;
  }
  
  /**
   * パフォーマンスメトリクス更新
   */
  updatePerformanceMetrics(metrics) {
    this.performanceMetrics.renderTime += metrics.duration;
    this.performanceMetrics.memoryUsage = performance.memory ? 
      performance.memory.usedJSHeapSize : 0;
    this.performanceMetrics.domElementCount = this.core.activeElements.size;
  }
  
  /**
   * 要素プールの効率性確認
   */
  analyzePoolEfficiency() {
    const totalRequests = this.performanceMetrics.poolHits + this.performanceMetrics.poolMisses;
    const hitRate = totalRequests > 0 ? (this.performanceMetrics.poolHits / totalRequests * 100) : 0;
    
    console.log(`📊 Pool efficiency: ${hitRate.toFixed(1)}% hit rate`);
    console.log(`📊 Pool stats: ${this.performanceMetrics.poolHits} hits, ${this.performanceMetrics.poolMisses} misses`);
    
    return { hitRate, totalRequests };
  }
  
  /**
   * DOM構造の検証と修正
   */
  validateAndFixDOMStructure() {
    const viewport = this.core.container.querySelector('#virtual-viewport');
    if (!viewport) {
      console.error('❌ Virtual viewport not found');
      return false;
    }
    
    const issues = [];
    const children = Array.from(viewport.children);
    
    // 孤児要素のチェック
    children.forEach((child, index) => {
      const questionIndex = parseInt(child.dataset.questionIndex);
      if (isNaN(questionIndex)) {
        issues.push(`Child ${index} has invalid questionIndex`);
        child.remove();
      }
    });
    
    // 重複要素のチェック
    const questionIndexes = children.map(child => child.dataset.questionIndex);
    const duplicates = questionIndexes.filter((item, index) => questionIndexes.indexOf(item) !== index);
    if (duplicates.length > 0) {
      issues.push(`Duplicate elements found: ${duplicates.join(', ')}`);
      // 重複要素を削除
      duplicates.forEach(dupIndex => {
        const elements = viewport.querySelectorAll(`[data-question-index="${dupIndex}"]`);
        for (let i = 1; i < elements.length; i++) {
          elements[i].remove();
        }
      });
    }
    
    if (issues.length > 0) {
      console.warn('⚠️ DOM issues found and fixed:', issues);
    } else {
      console.log('✅ DOM structure is valid');
    }
    
    return issues.length === 0;
  }
  
  /**
   * 設問要素の整合性チェック
   */
  verifyQuestionElementIntegrity(element, question) {
    const issues = [];
    
    // 基本属性のチェック
    if (element.dataset.questionId !== question.id) {
      issues.push('Question ID mismatch');
    }
    
    // Web Component状態のチェック
    if (element.tagName.toLowerCase() === 'haqei-question') {
      if (!element.shadowRoot) {
        issues.push('Shadow DOM not initialized');
      }
    }
    
    // 表示状態のチェック
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.display === 'none' && 
        this.core.activeElements.get(this.core.currentQuestionIndex) === element) {
      issues.push('Current question is hidden');
      // 自動修正
      this.emergencyQuestionVisibilityFix();
    }
    
    if (issues.length > 0) {
      console.warn(`⚠️ Element integrity issues for ${question.id}:`, issues);
    }
    
    return issues.length === 0;
  }
  
  /**
   * 回答データの整合性チェック
   */
  validateAnswerData() {
    const issues = [];
    
    this.core.answers.forEach((answer, index) => {
      // 必須フィールドのチェック
      if (!answer.questionId) {
        issues.push(`Answer ${index} missing questionId`);
      }
      
      // 設問IDの形式チェック
      if (answer.questionId && !/^q\d+$/.test(answer.questionId)) {
        issues.push(`Answer ${index} has invalid questionId format: ${answer.questionId}`);
      }
      
      // 回答値のチェック
      if (!answer.selectedValue && !answer.innerChoice && !answer.outerChoice) {
        issues.push(`Answer ${index} has no selected value`);
      }
      
      // タイムスタンプのチェック
      if (answer.timestamp && isNaN(new Date(answer.timestamp).getTime())) {
        issues.push(`Answer ${index} has invalid timestamp`);
      }
    });
    
    if (issues.length > 0) {
      console.warn('⚠️ Answer data issues found:', issues);
    }
    
    return issues.length === 0;
  }
  
  /**
   * 統合診断の実行
   */
  runComprehensiveDiagnostics() {
    console.log('🔍 Running comprehensive diagnostics...');
    
    const results = {
      domStructure: this.validateAndFixDOMStructure(),
      answerData: this.validateAnswerData(),
      poolEfficiency: this.analyzePoolEfficiency(),
      performance: this.performanceMetrics,
      elementCount: this.core.activeElements.size,
      currentState: {
        questionIndex: this.core.currentQuestionIndex,
        visibleRange: this.core.visibleRange,
        answersCount: this.core.answers.length
      }
    };
    
    console.log('📊 Diagnostic results:', results);
    return results;
  }
  
  /**
   * 緊急修正の一括実行
   */
  applyAllEmergencyFixes() {
    console.log('🚑 Applying all emergency fixes...');
    
    try {
      this.fixEvenQuestionDisplay();
      this.urgentVirtualQuestionFix();
      this.urgentScrollFix();
      this.emergencyQuestionVisibilityFix();
      
      console.log('✅ All emergency fixes applied successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to apply emergency fixes:', error);
      return false;
    }
  }
  
  /**
   * デバッグ情報の取得
   */
  getDebugInfo() {
    return {
      core: {
        currentQuestionIndex: this.core.currentQuestionIndex,
        questionsLength: this.core.questions.length,
        answersLength: this.core.answers.length,
        visibleRange: this.core.visibleRange
      },
      elements: {
        activeElementsCount: this.core.activeElements.size,
        poolSize: this.core.elementPool.size
      },
      performance: this.performanceMetrics,
      browser: {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };
  }
  
  /**
   * クリーンアップ
   */
  destroy() {
    // パフォーマンスメトリクスのリセット
    this.performanceMetrics = {
      renderTime: 0,
      memoryUsage: 0,
      domElementCount: 0,
      poolHits: 0,
      poolMisses: 0
    };
    
    console.log('🧹 VirtualQuestionFlow Utils cleaned up');
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.VirtualQuestionFlowUtils = VirtualQuestionFlowUtils;
}