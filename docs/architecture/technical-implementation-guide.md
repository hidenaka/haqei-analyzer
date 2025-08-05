# HAQEI質問表示システム 技術実装ガイド

**バージョン**: 2.0.0  
**更新日**: 2025-08-05  
**対象**: 開発チーム  

## 実装優先順位とマイルストーン

### Phase 1: Core Infrastructure (1-2週間)
1. **HaqeiQuestionElement v2.0 実装**
   - Shadow DOM完全対応
   - 偶数番設問表示問題の根本解決
   - プリコンパイル済みテンプレートシステム

2. **StateManager統合**
   - Redux-like状態管理
   - LocalStorage同期
   - 回答データ正規化

### Phase 2: Performance Optimization (2-3週間)
1. **VirtualQuestionFlow改善**
   - MutationObserver統合
   - CSS競合完全対策
   - メモリ最適化

2. **CacheManager統合**
   - 質問データキャッシング
   - テンプレートキャッシング
   - パフォーマンス指標収集

### Phase 3: User Experience Enhancement (1-2週間)
1. **QuestionRenderer実装**
   - 価値観設問/シナリオ設問対応
   - アニメーション最適化
   - アクセシビリティ強化

2. **ErrorHandler統合**
   - UnifiedErrorHandlerとの完全統合
   - ユーザーフレンドリーなエラー表示
   - 自動回復機能

## 詳細技術仕様

### 1. HaqeiQuestionElement v2.0

#### 核心改善点
```javascript
class HaqeiQuestionElement extends HTMLElement {
  constructor() {
    super();
    
    // 🔧 偶数番設問表示問題の根本解決
    this.attachShadow({ mode: 'open' });
    this.renderState = {
      isRendering: false,
      hasRendered: false,
      forceVisible: false // 偶数番設問用フラグ
    };
    
    // 🚀 パフォーマンス最適化
    this.performanceTracker = new QuestionPerformanceTracker();
    this.templateCache = new Map();
    this.eventDelegator = new EventDelegator();
  }
  
  // 🎯 確実な表示保証システム
  ensureVisibility() {
    const questionNumber = parseInt(this.dataset.questionId.replace('q', ''));
    const isEven = questionNumber % 2 === 0;
    
    if (isEven) {
      // 偶数番設問用の特別処理
      this.style.cssText = `
        display: block !important;
        opacity: 1 !important;
        visibility: visible !important;
        position: relative !important;
        min-height: 200px !important;
      `;
      
      // Shadow DOM内部も確実に表示
      if (this.shadowRoot) {
        this.ensureShadowDOMVisibility();
      }
      
      // MutationObserverで監視
      this.observeVisibilityChanges();
    }
  }
  
  observeVisibilityChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'style') {
          this.verifyVisibility();
        }
      });
    });
    
    observer.observe(this, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    this.visibilityObserver = observer;
  }
}
```

#### テンプレートシステム改善
```javascript
class TemplateSystem {
  constructor() {
    this.precompiledTemplates = new Map();
    this.templateCompiler = new TemplateCompiler();
  }
  
  // プリコンパイル実行
  async precompileAllTemplates() {
    const questions = [...WORLDVIEW_QUESTIONS, ...SCENARIO_QUESTIONS];
    
    for (const question of questions) {
      const template = this.templateCompiler.compile(question);
      this.precompiledTemplates.set(question.id, template);
    }
    
    console.log(`✅ ${questions.length} templates precompiled`);
  }
  
  getTemplate(questionId) {
    return this.precompiledTemplates.get(questionId) || 
           this.generateFallbackTemplate(questionId);
  }
}
```

### 2. VirtualQuestionFlow v2.0

#### 表示システム完全再設計
```javascript
class DisplayController {
  constructor(virtualFlow) {
    this.virtualFlow = virtualFlow;
    this.mutationObserver = null;
    this.displayStrategy = new EvenQuestionDisplayStrategy();
  }
  
  // 偶数番設問用表示戦略
  showQuestion(index) {
    const element = this.virtualFlow.activeElements.get(index);
    const questionNumber = index + 1;
    const isEven = questionNumber % 2 === 0;
    
    console.log(`🎯 Showing Q${questionNumber} (${isEven ? 'EVEN' : 'odd'})`);
    
    // 1. 全要素を確実に非表示
    this.hideAllElements();
    
    // 2. 対象要素を確実に表示
    if (isEven) {
      this.displayStrategy.showEvenQuestion(element, questionNumber);
    } else {
      this.displayStrategy.showOddQuestion(element, questionNumber);
    }
    
    // 3. 表示確認と自動修復
    this.verifyAndRepair(element, questionNumber);
  }
  
  verifyAndRepair(element, questionNumber) {
    setTimeout(() => {
      const isVisible = this.isElementVisible(element);
      
      if (!isVisible) {
        console.warn(`⚠️ Q${questionNumber} visibility failed - executing repair`);
        this.executeRepairProtocol(element, questionNumber);
      } else {
        console.log(`✅ Q${questionNumber} successfully displayed`);
      }
    }, 50);
  }
  
  executeRepairProtocol(element, questionNumber) {
    // 緊急修復手順
    element.style.setProperty('display', 'block', 'important');
    element.style.setProperty('opacity', '1', 'important');
    element.style.setProperty('visibility', 'visible', 'important');
    element.style.setProperty('min-height', '200px', 'important');
    
    // Shadow DOM修復
    if (element.shadowRoot) {
      const container = element.shadowRoot.querySelector('.question-container');
      if (container) {
        container.style.setProperty('display', 'block', 'important');
        container.style.setProperty('opacity', '1', 'important');
      }
    }
    
    console.log(`🔧 Q${questionNumber} repair protocol executed`);
  }
}

// 偶数番設問専用表示戦略
class EvenQuestionDisplayStrategy {
  showEvenQuestion(element, questionNumber) {
    // CSS競合を完全に回避する表示処理
    element.removeAttribute('style');
    element.classList.remove('hidden', 'hide');
    
    // 段階的表示適用
    requestAnimationFrame(() => {
      element.style.cssText = `
        display: block !important;
        opacity: 1 !important;
        visibility: visible !important;
        position: relative !important;
        width: 100% !important;
        min-height: 200px !important;
        height: auto !important;
        z-index: 10 !important;
        transform: none !important;
        overflow: visible !important;
      `;
      
      element.classList.add('even-question-visible');
      
      // 二重確認
      setTimeout(() => this.doubleCheckVisibility(element, questionNumber), 25);
    });
  }
  
  doubleCheckVisibility(element, questionNumber) {
    const rect = element.getBoundingClientRect();
    const computed = window.getComputedStyle(element);
    
    const isReallyVisible = 
      computed.display !== 'none' &&
      computed.visibility !== 'hidden' &&
      rect.height > 0 &&
      rect.width > 0;
    
    if (!isReallyVisible) {
      console.error(`❌ Q${questionNumber} (EVEN) still not visible after strategy`);
      this.forceVisibility(element, questionNumber);
    } else {
      console.log(`✅ Q${questionNumber} (EVEN) confirmed visible`);
    }
  }
  
  forceVisibility(element, questionNumber) {
    // 最終手段の強制表示
    element.style.setProperty('display', 'block', 'important');
    element.style.setProperty('opacity', '1', 'important');
    element.style.setProperty('visibility', 'visible', 'important');
    element.style.setProperty('position', 'relative', 'important');
    element.style.setProperty('z-index', '999', 'important');
    
    console.log(`💪 Q${questionNumber} (EVEN) force visibility applied`);
  }
}
```

### 3. StateManager統合

#### Redux-like状態管理
```javascript
class QuestionStateManager {
  constructor() {
    this.state = {
      questions: [],
      currentIndex: 0,
      answers: [],
      navigation: {
        canGoNext: false,
        canGoPrev: false,
        isLastQuestion: false
      },
      ui: {
        isLoading: false,
        displayMode: 'normal',
        errorState: null
      },
      performance: {
        renderTimes: [],
        memoryUsage: 0,
        cacheHitRate: 0
      }
    };
    
    this.reducers = {
      navigation: this.navigationReducer.bind(this),
      answers: this.answersReducer.bind(this),
      ui: this.uiReducer.bind(this),
      performance: this.performanceReducer.bind(this)
    };
    
    this.subscribers = [];
    this.middleware = [];
  }
  
  // アクション定義
  static ACTIONS = {
    LOAD_QUESTIONS: 'LOAD_QUESTIONS',
    SET_CURRENT_INDEX: 'SET_CURRENT_INDEX',
    UPDATE_ANSWER: 'UPDATE_ANSWER',
    GO_TO_NEXT: 'GO_TO_NEXT',
    GO_TO_PREVIOUS: 'GO_TO_PREVIOUS',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    UPDATE_PERFORMANCE: 'UPDATE_PERFORMANCE'
  };
  
  dispatch(action) {
    console.log(`🔄 Action dispatched:`, action);
    
    // ミドルウェア実行
    for (const middleware of this.middleware) {
      action = middleware(action, this.state);
    }
    
    // リデューサー実行
    const newState = this.applyReducers(action);
    
    // 状態更新
    const prevState = { ...this.state };
    this.state = newState;
    
    // 購読者通知
    this.notifySubscribers(prevState, newState, action);
    
    // LocalStorage同期
    this.syncToStorage();
  }
  
  applyReducers(action) {
    let newState = { ...this.state };
    
    for (const [key, reducer] of Object.entries(this.reducers)) {
      newState[key] = reducer(newState[key], action, newState);
    }
    
    return newState;
  }
  
  // 回答リデューサー
  answersReducer(answers, action, fullState) {
    switch (action.type) {
      case QuestionStateManager.ACTIONS.UPDATE_ANSWER:
        const { questionId, answer } = action.payload;
        const existingIndex = answers.findIndex(a => a.questionId === questionId);
        
        if (existingIndex >= 0) {
          return answers.map((a, i) => 
            i === existingIndex ? { ...a, ...answer } : a
          );
        } else {
          return [...answers, { questionId, ...answer }];
        }
      
      default:
        return answers;
    }
  }
  
  // ナビゲーションリデューサー
  navigationReducer(navigation, action, fullState) {
    switch (action.type) {
      case QuestionStateManager.ACTIONS.SET_CURRENT_INDEX:
        const index = action.payload;
        return {
          ...navigation,
          canGoNext: this.canGoNext(index, fullState),
          canGoPrev: index > 0,
          isLastQuestion: index === fullState.questions.length - 1
        };
      
      default:
        return navigation;
    }
  }
  
  canGoNext(index, state) {
    const currentQuestion = state.questions[index];
    if (!currentQuestion) return false;
    
    const answer = state.answers.find(a => a.questionId === currentQuestion.id);
    return this.isQuestionAnswered(currentQuestion, answer);
  }
  
  isQuestionAnswered(question, answer) {
    if (!answer) return false;
    
    // シナリオ設問の判定
    if (question.scenario || question.inner_q) {
      return answer.innerChoice && answer.outerChoice;
    }
    
    // 価値観設問の判定
    return !!answer.selectedValue;
  }
}
```

### 4. パフォーマンス最適化

#### メモリ管理システム
```javascript
class MemoryOptimizer {
  constructor() {
    this.memoryThreshold = 50 * 1024 * 1024; // 50MB
    this.gcTriggerThreshold = 0.8; // 80%
    this.cleanupInterval = 60000; // 1分
    
    this.startMonitoring();
  }
  
  startMonitoring() {
    setInterval(() => {
      this.checkMemoryUsage();
    }, this.cleanupInterval);
  }
  
  checkMemoryUsage() {
    if (!performance.memory) return;
    
    const used = performance.memory.usedJSHeapSize;
    const total = performance.memory.totalJSHeapSize;
    const ratio = used / total;
    
    console.log(`📊 Memory usage: ${(used / 1024 / 1024).toFixed(2)}MB (${(ratio * 100).toFixed(1)}%)`);
    
    if (ratio > this.gcTriggerThreshold) {
      this.triggerCleanup();
    }
  }
  
  triggerCleanup() {
    console.log('🧹 Triggering memory cleanup...');
    
    // 未使用要素のクリーンアップ
    this.cleanupUnusedElements();
    
    // キャッシュのクリーンアップ
    this.cleanupCaches();
    
    // 手動GC（開発環境）
    if (window.gc) {
      window.gc();
    }
  }
  
  cleanupUnusedElements() {
    // VirtualQuestionFlowの非アクティブ要素をクリーンアップ
    if (window.app && window.app.questionFlow) {
      window.app.questionFlow.returnInactiveElementsToPool();
    }
  }
  
  cleanupCaches() {
    // CacheManagerのクリーンアップ
    if (window.app && window.app.cacheManager) {
      window.app.cacheManager.performCleanup();
    }
  }
}
```

#### レンダリング最適化
```javascript
class RenderingOptimizer {
  constructor() {
    this.frameTime = 16.67; // 60fps
    this.renderQueue = [];
    this.isRendering = false;
  }
  
  scheduleRender(renderFn, priority = 'normal') {
    const task = {
      fn: renderFn,
      priority,
      timestamp: performance.now()
    };
    
    this.renderQueue.push(task);
    this.processQueue();
  }
  
  processQueue() {
    if (this.isRendering) return;
    
    this.isRendering = true;
    
    requestAnimationFrame(() => {
      const startTime = performance.now();
      
      // 優先度でソート
      this.renderQueue.sort((a, b) => {
        const priorityOrder = { high: 0, normal: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
      
      // フレーム時間内で実行
      while (this.renderQueue.length > 0) {
        const elapsed = performance.now() - startTime;
        if (elapsed > this.frameTime * 0.8) break; // 80%で制限
        
        const task = this.renderQueue.shift();
        task.fn();
      }
      
      this.isRendering = false;
      
      // 残りのタスクがあれば次のフレームで処理
      if (this.renderQueue.length > 0) {
        this.processQueue();
      }
    });
  }
}
```

### 5. エラーハンドリング統合

#### 質問表示専用エラーハンドラー
```javascript
class QuestionDisplayErrorHandler {
  constructor(unifiedHandler) {
    this.unifiedHandler = unifiedHandler;
    this.questionErrors = new Map();
    this.recoveryStrategies = this.initRecoveryStrategies();
  }
  
  initRecoveryStrategies() {
    return {
      EVEN_QUESTION_DISPLAY_FAILURE: {
        strategy: 'force-visibility-with-observer',
        fallback: 'fallback-template',
        priority: 'high'
      },
      SHADOW_DOM_CREATION_ERROR: {
        strategy: 'light-dom-fallback',
        fallback: 'inline-template',
        priority: 'medium'
      },
      TEMPLATE_RENDERING_ERROR: {
        strategy: 'fallback-template',
        fallback: 'basic-text-display',
        priority: 'medium'
      },
      CSS_CONFLICT_ERROR: {
        strategy: 'style-isolation',
        fallback: 'important-override',
        priority: 'low'
      }
    };
  }
  
  handleQuestionError(error, context) {
    const errorType = this.classifyQuestionError(error, context);
    const strategy = this.recoveryStrategies[errorType];
    
    console.log(`🚨 Question error detected: ${errorType}`, error);
    
    // 統合エラーハンドラーに報告
    this.unifiedHandler.handleError(error, {
      ...context,
      source: 'question-display',
      errorType,
      recoveryStrategy: strategy
    });
    
    // 専用回復処理
    return this.executeRecoveryStrategy(strategy, error, context);
  }
  
  classifyQuestionError(error, context) {
    if (context.questionNumber % 2 === 0 && error.message.includes('display')) {
      return 'EVEN_QUESTION_DISPLAY_FAILURE';
    }
    
    if (error.message.includes('shadowRoot') || error.message.includes('Shadow DOM')) {
      return 'SHADOW_DOM_CREATION_ERROR';
    }
    
    if (error.message.includes('template') || error.message.includes('render')) {
      return 'TEMPLATE_RENDERING_ERROR';
    }
    
    if (error.message.includes('CSS') || error.message.includes('style')) {
      return 'CSS_CONFLICT_ERROR';
    }
    
    return 'UNKNOWN_QUESTION_ERROR';
  }
  
  async executeRecoveryStrategy(strategy, error, context) {
    try {
      switch (strategy.strategy) {
        case 'force-visibility-with-observer':
          return await this.forceVisibilityWithObserver(context);
        
        case 'light-dom-fallback':
          return await this.createLightDomFallback(context);
        
        case 'fallback-template':
          return await this.useFallbackTemplate(context);
        
        case 'style-isolation':
          return await this.isolateStyles(context);
        
        default:
          return await this.basicRecovery(context);
      }
    } catch (recoveryError) {
      console.error('❌ Recovery strategy failed:', recoveryError);
      return this.emergencyFallback(context);
    }
  }
  
  async forceVisibilityWithObserver(context) {
    const element = context.element;
    const questionNumber = context.questionNumber;
    
    // 強制表示適用
    element.style.setProperty('display', 'block', 'important');
    element.style.setProperty('opacity', '1', 'important');
    element.style.setProperty('visibility', 'visible', 'important');
    element.style.setProperty('min-height', '200px', 'important');
    
    // MutationObserverで監視
    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        const isVisible = element.offsetHeight > 0;
        if (isVisible) {
          observer.disconnect();
          console.log(`✅ Q${questionNumber} recovery successful`);
          resolve({ success: true, method: 'force-visibility' });
        }
      });
      
      observer.observe(element, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });
      
      // タイムアウト
      setTimeout(() => {
        observer.disconnect();
        resolve({ success: false, method: 'force-visibility', timeout: true });
      }, 1000);
    });
  }
}
```

### 6. テスト実装

#### E2Eテスト自動化
```javascript
// tests/e2e/question-display.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Question Display System', () => {
  test('All 30 questions display correctly including even numbers', async ({ page }) => {
    await page.goto('/os_analyzer.html');
    
    // デバッグモード有効化
    await page.evaluate(() => {
      window.debugMode = true;
    });
    
    // 全30問をテスト
    for (let i = 1; i <= 30; i++) {
      const questionId = `q${i}`;
      const isEven = i % 2 === 0;
      
      console.log(`Testing ${questionId} (${isEven ? 'EVEN' : 'odd'})`);
      
      // 設問要素の存在確認
      const questionElement = page.locator(`haqei-question[data-question-id="${questionId}"]`);
      await expect(questionElement).toBeVisible({ timeout: 5000 });
      
      // 表示状態の詳細確認
      const elementInfo = await page.evaluate((qid) => {
        const element = document.querySelector(`haqei-question[data-question-id="${qid}"]`);
        if (!element) return { exists: false };
        
        const computed = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        
        return {
          exists: true,
          display: computed.display,
          opacity: computed.opacity,
          visibility: computed.visibility,
          width: rect.width,
          height: rect.height,
          isVisible: computed.display !== 'none' && 
                     computed.visibility !== 'hidden' && 
                     rect.height > 0
        };
      }, questionId);
      
      // 表示確認
      expect(elementInfo.exists).toBe(true);
      expect(elementInfo.isVisible).toBe(true);
      
      if (isEven && !elementInfo.isVisible) {
        throw new Error(`Even question ${questionId} is not visible: ${JSON.stringify(elementInfo)}`);
      }
      
      // 選択肢をクリック
      const firstOption = questionElement.locator('input[type="radio"]').first();
      await firstOption.click();
      
      // 次の質問へ（最後の質問以外）
      if (i < 30) {
        const nextButton = page.locator('#next-btn');
        await expect(nextButton).not.toBeDisabled();
        await nextButton.click();
      }
    }
    
    // 完了確認
    const nextButton = page.locator('#next-btn');
    await expect(nextButton).toHaveText('分析開始 →');
    await nextButton.click();
    
    // 分析画面への遷移確認
    await expect(page.locator('#analysis-container')).toBeVisible({ timeout: 10000 });
  });
  
  test('Performance benchmarks', async ({ page }) => {
    await page.goto('/os_analyzer.html');
    
    // パフォーマンス測定開始
    await page.evaluate(() => {
      window.performanceTest = {
        renderTimes: [],
        memoryUsage: []
      };
    });
    
    // 各設問のレンダリング時間を測定
    for (let i = 1; i <= 30; i++) {
      const startTime = await page.evaluate(() => performance.now());
      
      // 設問表示
      const questionElement = page.locator(`haqei-question[data-question-id="q${i}"]`);
      await expect(questionElement).toBeVisible();
      
      const endTime = await page.evaluate(() => performance.now());
      const renderTime = endTime - startTime;
      
      // 50ms以下の目標
      expect(renderTime).toBeLessThan(50);
      
      console.log(`Q${i} render time: ${renderTime.toFixed(2)}ms`);
      
      if (i < 30) {
        await page.locator('input[type="radio"]').first().click();
        await page.locator('#next-btn').click();
      }
    }
    
    // メモリ使用量確認
    const memoryUsage = await page.evaluate(() => {
      return performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null;
    });
    
    if (memoryUsage) {
      const usedMB = memoryUsage.used / 1024 / 1024;
      expect(usedMB).toBeLessThan(50); // 50MB以下
      console.log(`Memory usage: ${usedMB.toFixed(2)}MB`);
    }
  });
});
```

## まとめ

この技術実装ガイドに従って開発を進めることで：

1. **偶数番設問表示問題の完全解決**
2. **60fps維持の高パフォーマンス実現**
3. **メモリ使用量50MB以下の効率化**
4. **100%のテストカバレッジ達成**
5. **将来の機能拡張への対応力**

を実現できます。各Phaseごとに実装を進め、継続的なテストと改善を行ってください。