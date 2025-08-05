/**
 * VirtualQuestionFlow Renderer Module
 * レンダリング処理とDOM操作を分離したモジュール
 */

class VirtualQuestionFlowRenderer {
  constructor(core) {
    this.core = core;
    this.gestureHandler = null;
    
    // タッチジェスチャーハンドラー初期化
    if (typeof TouchGestureHandler !== 'undefined') {
      this.gestureHandler = new TouchGestureHandler(core.container);
      this.gestureHandler.onSwipeLeft = () => core.goToNext();
      this.gestureHandler.onSwipeRight = () => core.goToPrevious();
      console.log('📱 Touch gesture handler initialized');
    }
  }
  
  /**
   * Web Component要素の作成と設定
   */
  async createWebComponentElement(question, questionIndex) {
    const questionElement = document.createElement('haqei-question');
    
    // 基本属性設定
    questionElement.dataset.questionId = question.id;
    questionElement.dataset.questionIndex = questionIndex;
    questionElement.setAttribute('data-question-id', question.id);
    questionElement.setAttribute('animated', '');
    
    // 設問データ設定
    if (questionElement.setQuestionData) {
      await questionElement.setQuestionData(question);
    }
    
    // イベントリスナー設定
    this.attachElementEventListeners(questionElement, question);
    
    // 初期状態設定
    this.setElementInitialState(questionElement);
    
    console.log(`🔧 Web Component element created: ${question.id}`);
    return questionElement;
  }
  
  /**
   * 要素のイベントリスナー設定
   */
  attachElementEventListeners(element, question) {
    // 回答変更イベント
    element.addEventListener('answerChange', (e) => {
      this.core.handleAnswerChange(e.detail);
    });
    
    // Web Component接続イベント
    element.addEventListener('connected', () => {
      console.log(`🔗 HaqeiQuestionElement connected: ${question.id}`);
      this.verifyElementDisplay(element);
    });
    
    // Web Component準備完了イベント
    element.addEventListener('ready', () => {
      console.log(`✅ HaqeiQuestionElement ready: ${question.id}`);
    });
  }
  
  /**
   * 要素の初期状態設定
   */
  setElementInitialState(element) {
    element.style.display = 'none';
    element.style.opacity = '0';
    element.style.visibility = 'hidden';
    element.style.position = 'relative';
    element.style.width = '100%';
    element.style.height = 'auto';
  }
  
  /**
   * 要素表示の確実な実行
   */
  ensureElementVisible(element) {
    // 基本表示設定
    element.style.display = 'block';
    element.style.opacity = '1';
    element.style.visibility = 'visible';
    element.style.position = 'relative';
    element.style.zIndex = '1';
    
    // アクセシビリティ設定
    element.setAttribute('aria-hidden', 'false');
    element.removeAttribute('tabindex');
    
    // アクティブクラス追加
    element.classList.add('active-question', 'visible');
    
    // Shadow DOM内部の表示確保
    this.ensureShadowDOMVisibility(element);
    
    console.log(`👁️ Element made visible: ${element.dataset.questionId}`);
  }
  
  /**
   * 要素非表示の確実な実行
   */
  ensureElementHidden(element) {
    // 非表示設定
    element.style.display = 'none';
    element.style.opacity = '0';
    element.style.visibility = 'hidden';
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.zIndex = '-999';
    
    // アクセシビリティ設定
    element.setAttribute('aria-hidden', 'true');
    element.setAttribute('tabindex', '-1');
    
    // アクティブクラス削除
    element.classList.remove('active-question', 'visible', 'show', 'display');
    
    console.log(`🙈 Element hidden: ${element.dataset.questionId}`);
  }
  
  /**
   * Shadow DOM内部の表示確保
   */
  ensureShadowDOMVisibility(element) {
    try {
      if (element.shadowRoot) {
        // メインコンテナの表示
        const shadowContent = element.shadowRoot.querySelector('.question-container');
        if (shadowContent) {
          shadowContent.style.display = 'block';
          shadowContent.style.opacity = '1';
          shadowContent.style.visibility = 'visible';
        }
        
        // 全設問アイテムの表示
        const questionItems = element.shadowRoot.querySelectorAll('.question-item');
        questionItems.forEach(item => {
          item.style.display = 'block';
          item.style.opacity = '1';
          item.style.visibility = 'visible';
        });
        
        console.log(`🌟 Shadow DOM visibility ensured`);
      }
    } catch (error) {
      console.warn('⚠️ Shadow DOM access failed:', error);
    }
  }
  
  /**
   * 要素表示の検証
   */
  verifyElementDisplay(element) {
    const computedStyle = window.getComputedStyle(element);
    const isVisible = computedStyle.display !== 'none' && 
                     computedStyle.visibility !== 'hidden' && 
                     computedStyle.opacity !== '0';
    
    if (!isVisible) {
      console.warn(`⚠️ Element not properly visible: ${element.dataset.questionId}`);
      this.forceElementVisible(element);
    } else {
      console.log(`✅ Element visibility verified: ${element.dataset.questionId}`);
    }
    
    return isVisible;
  }
  
  /**
   * 要素の強制表示（最終手段）
   */
  forceElementVisible(element) {
    console.log(`💪 Force display applied: ${element.dataset.questionId}`);
    
    // 最高優先度で表示
    element.style.setProperty('display', 'block', 'important');
    element.style.setProperty('opacity', '1', 'important');
    element.style.setProperty('visibility', 'visible', 'important');
    element.style.setProperty('position', 'relative', 'important');
    element.style.setProperty('z-index', '999', 'important');
    
    // レイアウト問題の修正
    element.style.setProperty('min-height', '200px', 'important');
    element.style.setProperty('height', 'auto', 'important');
    element.style.setProperty('overflow', 'visible', 'important');
    
    // Shadow DOM内も強制表示
    if (element.shadowRoot) {
      const allElements = element.shadowRoot.querySelectorAll('*');
      allElements.forEach(el => {
        if (el.classList.contains('question-container') || 
            el.classList.contains('question-item')) {
          el.style.setProperty('display', 'block', 'important');
          el.style.setProperty('opacity', '1', 'important');
          el.style.setProperty('visibility', 'visible', 'important');
        }
      });
    }
  }
  
  /**
   * アニメーション付き遷移
   */
  animateTransition(fromElement, toElement, direction = 'next') {
    const duration = 300;
    const easing = 'cubic-bezier(0.4, 0.0, 0.2, 1)';
    
    if (fromElement) {
      fromElement.style.transition = `opacity ${duration}ms ${easing}`;
      fromElement.style.opacity = '0';
      
      setTimeout(() => {
        this.ensureElementHidden(fromElement);
      }, duration);
    }
    
    if (toElement) {
      toElement.style.opacity = '0';
      this.ensureElementVisible(toElement);
      
      requestAnimationFrame(() => {
        toElement.style.transition = `opacity ${duration}ms ${easing}`;
        toElement.style.opacity = '1';
      });
    }
    
    console.log(`🎭 Animated transition: ${direction}`);
  }
  
  /**
   * レスポンシブ調整
   */
  adjustForViewport() {
    const viewport = this.core.container.querySelector('#virtual-viewport');
    if (!viewport) return;
    
    const containerWidth = this.core.container.clientWidth;
    const isMobile = containerWidth < 768;
    
    // モバイル用調整
    if (isMobile) {
      viewport.classList.add('mobile-viewport');
      this.core.container.classList.add('mobile-container');
    } else {
      viewport.classList.remove('mobile-viewport');
      this.core.container.classList.remove('mobile-container');
    }
    
    console.log(`📱 Viewport adjusted for ${isMobile ? 'mobile' : 'desktop'}`);
  }
  
  /**
   * パフォーマンス監視付きレンダリング
   */
  async performanceAwareRender(renderFunction) {
    const startTime = performance.now();
    
    try {
      await renderFunction();
    } catch (error) {
      console.error('❌ Render error:', error);
      throw error;
    }
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (renderTime > 16) { // 60fps threshold
      console.warn(`⚠️ Slow render detected: ${renderTime.toFixed(2)}ms`);
    }
    
    return renderTime;
  }
  
  /**
   * DOM構造の検証
   */
  validateDOMStructure() {
    const viewport = this.core.container.querySelector('#virtual-viewport');
    if (!viewport) {
      console.error('❌ Virtual viewport not found');
      return false;
    }
    
    const children = viewport.children;
    console.log(`🏗️ Virtual viewport contains ${children.length} children`);
    
    let visibleCount = 0;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const isVisible = window.getComputedStyle(child).display !== 'none';
      if (isVisible) visibleCount++;
    }
    
    console.log(`👁️ ${visibleCount} elements are visible`);
    return true;
  }
  
  /**
   * クリーンアップ
   */
  destroy() {
    // タッチジェスチャーハンドラーの削除
    if (this.gestureHandler) {
      this.gestureHandler.destroy();
      this.gestureHandler = null;
    }
    
    console.log('🧹 VirtualQuestionFlow Renderer cleaned up');
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.VirtualQuestionFlowRenderer = VirtualQuestionFlowRenderer;
}