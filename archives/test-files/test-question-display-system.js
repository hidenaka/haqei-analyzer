/**
 * 質問表示システム統合テストスクリプト
 * DisplayController + HaqeiQuestionElementV2 の動作確認
 * 
 * 使用方法：
 * 1. ブラウザの開発者コンソールで実行
 * 2. testQuestionDisplaySystem() を呼び出し
 * 3. 自動的に全ての機能をテスト
 */

class QuestionDisplaySystemTester {
  constructor() {
    this.testResults = {
      total: 0,
      passed: 0,
      failed: 0,
      errors: [],
      details: []
    };
    
    this.testStartTime = 0;
    this.displayController = null;
  }

  /**
   * 完全テストスイートを実行
   */
  async runCompleteTest() {
    console.log('🧪 ===== 質問表示システム統合テスト開始 =====');
    this.testStartTime = performance.now();
    
    try {
      // 1. 環境チェック
      await this.testEnvironment();
      
      // 2. DisplayController テスト
      await this.testDisplayController();
      
      // 3. HaqeiQuestionElementV2 テスト
      await this.testHaqeiQuestionElementV2();
      
      // 4. CSS競合解決テスト
      await this.testCSSConflictResolution();
      
      // 5. Shadow DOM テスト
      await this.testShadowDOMFunctionality();
      
      // 6. レスポンシブ対応テスト
      await this.testResponsiveDesign();
      
      // 7. アクセシビリティテスト
      await this.testAccessibility();
      
      // 8. パフォーマンステスト
      await this.testPerformance();
      
      // 9. エラーハンドリングテスト
      await this.testErrorHandling();
      
      // 10. 統合シナリオテスト
      await this.testIntegrationScenarios();
      
    } catch (error) {
      this.recordError('Complete Test Suite', error);
    }
    
    this.printResults();
    return this.testResults;
  }

  /**
   * 環境チェック
   */
  async testEnvironment() {
    console.log('🔍 環境チェック開始...');
    
    await this.runTest('DisplayController availability', () => {
      if (typeof DisplayController === 'undefined') {
        throw new Error('DisplayController not loaded');
      }
      return true;
    });
    
    await this.runTest('HaqeiQuestionElementV2 availability', () => {
      if (typeof HaqeiQuestionElementV2 === 'undefined') {
        throw new Error('HaqeiQuestionElementV2 not loaded');
      }
      return true;
    });
    
    await this.runTest('Web Components support', () => {
      if (typeof customElements === 'undefined') {
        throw new Error('Web Components not supported');
      }
      return true;
    });
    
    await this.runTest('Shadow DOM support', () => {
      const testElement = document.createElement('div');
      if (!testElement.attachShadow) {
        throw new Error('Shadow DOM not supported');
      }
      return true;
    });
    
    await this.runTest('CSS custom properties support', () => {
      if (!CSS.supports('color', 'var(--test)')) {
        throw new Error('CSS custom properties not supported');
      }
      return true;
    });
  }

  /**
   * DisplayController テスト
   */
  async testDisplayController() {
    console.log('🎯 DisplayController テスト開始...');
    
    await this.runTest('DisplayController instantiation', () => {
      this.displayController = new DisplayController();
      return this.displayController instanceof DisplayController;
    });
    
    await this.runTest('DisplayController basic visibility', async () => {
      const testElement = document.createElement('div');
      testElement.style.display = 'none';
      document.body.appendChild(testElement);
      
      const success = await this.displayController.ensureElementVisible(testElement);
      
      document.body.removeChild(testElement);
      return success;
    });
    
    await this.runTest('DisplayController metrics tracking', () => {
      const metrics = this.displayController.getMetrics();
      return metrics && typeof metrics.totalElements === 'number';
    });
    
    await this.runTest('DisplayController cleanup', () => {
      const initialObservers = this.displayController.observers.size;
      this.displayController.stopAllObservers();
      return this.displayController.observers.size === 0;
    });
  }

  /**
   * HaqeiQuestionElementV2 テスト
   */
  async testHaqeiQuestionElementV2() {
    console.log('🔧 HaqeiQuestionElementV2 テスト開始...');
    
    await this.runTest('Web Component registration', () => {
      return customElements.get('haqei-question-v2') === HaqeiQuestionElementV2;
    });
    
    await this.runTest('Element creation and initialization', async () => {
      const element = document.createElement('haqei-question-v2');
      element.dataset.questionId = 'test-q1';
      
      // テスト用の質問データを設定
      window.WORLDVIEW_QUESTIONS = window.WORLDVIEW_QUESTIONS || [{
        id: 'test-q1',
        title: 'テスト質問',
        options: [
          { id: 'a', text: '選択肢A', scoring_tags: [] },
          { id: 'b', text: '選択肢B', scoring_tags: [] }
        ]
      }];
      
      document.body.appendChild(element);
      
      // 初期化を待機
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const hasContent = element.shadowRoot && element.shadowRoot.innerHTML.length > 0;
      
      document.body.removeChild(element);
      return hasContent;
    });
    
    await this.runTest('Shadow DOM content generation', async () => {
      const element = document.createElement('haqei-question-v2');
      element.dataset.questionId = 'test-q1';
      document.body.appendChild(element);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const shadowContent = element.shadowRoot.querySelector('.question-container');
      const hasOptions = element.shadowRoot.querySelectorAll('.option-label').length > 0;
      
      document.body.removeChild(element);
      return shadowContent && hasOptions;
    });
    
    await this.runTest('Event handling', async () => {
      const element = document.createElement('haqei-question-v2');
      element.dataset.questionId = 'test-q1';
      document.body.appendChild(element);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let eventFired = false;
      element.addEventListener('answer-change', () => {
        eventFired = true;
      });
      
      const radio = element.shadowRoot.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      document.body.removeChild(element);
      return eventFired;
    });
  }

  /**
   * CSS競合解決テスト
   */
  async testCSSConflictResolution() {
    console.log('🎨 CSS競合解決テスト開始...');
    
    await this.runTest('Display override test', async () => {
      const element = document.createElement('haqei-question-v2');
      element.dataset.questionId = 'test-q1';
      element.style.display = 'none'; // 意図的に非表示
      document.body.appendChild(element);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const computedStyle = window.getComputedStyle(element);
      const isVisible = computedStyle.display !== 'none';
      
      document.body.removeChild(element);
      return isVisible;
    });
    
    await this.runTest('Visibility override test', async () => {
      const element = document.createElement('haqei-question-v2');
      element.dataset.questionId = 'test-q1';
      element.style.visibility = 'hidden'; // 意図的に非表示
      document.body.appendChild(element);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const computedStyle = window.getComputedStyle(element);
      const isVisible = computedStyle.visibility !== 'hidden';
      
      document.body.removeChild(element);
      return isVisible;
    });
    
    await this.runTest('Opacity override test', async () => {
      const element = document.createElement('haqei-question-v2');
      element.dataset.questionId = 'test-q1';
      element.style.opacity = '0'; // 意図的に透明
      document.body.appendChild(element);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const computedStyle = window.getComputedStyle(element);
      const isVisible = parseFloat(computedStyle.opacity) > 0;
      
      document.body.removeChild(element);
      return isVisible;
    });
  }

  /**
   * Shadow DOM機能テスト
   */
  async testShadowDOMFunctionality() {
    console.log('🌟 Shadow DOM 機能テスト開始...');
    
    await this.runTest('Shadow DOM creation', async () => {
      const element = document.createElement('haqei-question-v2');
      element.dataset.questionId = 'test-q1';
      document.body.appendChild(element);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const hasShadowRoot = !!element.shadowRoot;
      
      document.body.removeChild(element);
      return hasShadowRoot;
    });
    
    await this.runTest('Shadow DOM style isolation', async () => {
      const element = document.createElement('haqei-question-v2');
      element.dataset.questionId = 'test-q1';
      document.body.appendChild(element);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const shadowStyles = element.shadowRoot.querySelector('style');
      const hasIsolatedStyles = shadowStyles && shadowStyles.textContent.includes(':host');
      
      document.body.removeChild(element);
      return hasIsolatedStyles;
    });
    
    await this.runTest('Shadow DOM content accessibility', async () => {
      const element = document.createElement('haqei-question-v2');
      element.dataset.questionId = 'test-q1';
      document.body.appendChild(element);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const radioButtons = element.shadowRoot.querySelectorAll('input[type="radio"]');
      const hasRadioButtons = radioButtons.length > 0;
      
      document.body.removeChild(element);
      return hasRadioButtons;
    });
  }

  /**
   * レスポンシブ対応テスト
   */
  async testResponsiveDesign() {
    console.log('📱 レスポンシブ対応テスト開始...');
    
    await this.runTest('Mobile viewport handling', async () => {
      // ビューポートをモバイルサイズに変更
      const originalWidth = window.innerWidth;
      
      // モバイルサイズをシミュレート
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });
      
      const element = document.createElement('haqei-question-v2');
      element.dataset.questionId = 'test-q1';
      document.body.appendChild(element);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const computedStyle = window.getComputedStyle(element);
      const isMobileOptimized = parseFloat(computedStyle.maxWidth) <= 400;
      
      // 元のサイズに戻す
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalWidth
      });
      
      document.body.removeChild(element);
      return isMobileOptimized;
    });
    
    await this.runTest('Touch target size', async () => {
      const element = document.createElement('haqei-question-v2');
      element.dataset.questionId = 'test-q1';
      document.body.appendChild(element);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const optionLabels = element.shadowRoot.querySelectorAll('.option-label');
      let minTouchTarget = true;
      
      optionLabels.forEach(label => {
        const rect = label.getBoundingClientRect();
        if (rect.height < 44) { // 44px is minimum touch target size
          minTouchTarget = false;
        }
      });
      
      document.body.removeChild(element);
      return minTouchTarget;
    });
  }

  /**
   * アクセシビリティテスト
   */
  async testAccessibility() {
    console.log('♿ アクセシビリティテスト開始...');
    
    await this.runTest('ARIA attributes', async () => {
      const element = document.createElement('haqei-question-v2');
      element.dataset.questionId = 'test-q1';
      document.body.appendChild(element);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const hasRole = element.getAttribute('role') === 'group';
      const hasAriaLabel = element.hasAttribute('aria-label');
      
      document.body.removeChild(element);
      return hasRole && hasAriaLabel;
    });
    
    await this.runTest('Keyboard navigation', async () => {
      const element = document.createElement('haqei-question-v2');
      element.dataset.questionId = 'test-q1';
      document.body.appendChild(element);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const focusableElements = element.shadowRoot.querySelectorAll('[tabindex="0"]');
      const hasFocusableElements = focusableElements.length > 0;
      
      document.body.removeChild(element);
      return hasFocusableElements;
    });
    
    await this.runTest('Screen reader support', async () => {
      const element = document.createElement('haqei-question-v2');
      element.dataset.questionId = 'test-q1';
      document.body.appendChild(element);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const radioButtons = element.shadowRoot.querySelectorAll('input[type="radio"]');
      let hasProperLabels = true;
      
      radioButtons.forEach(radio => {
        const label = radio.closest('.option-label');
        if (!label || !label.getAttribute('aria-label')) {
          hasProperLabels = false;
        }
      });
      
      document.body.removeChild(element);
      return hasProperLabels;
    });
  }

  /**
   * パフォーマンステスト
   */
  async testPerformance() {
    console.log('⚡ パフォーマンステスト開始...');
    
    await this.runTest('Rendering performance', async () => {
      const startTime = performance.now();
      
      const elements = [];
      for (let i = 0; i < 10; i++) {
        const element = document.createElement('haqei-question-v2');
        element.dataset.questionId = `test-q${i}`;
        document.body.appendChild(element);
        elements.push(element);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // クリーンアップ
      elements.forEach(el => document.body.removeChild(el));
      
      // 10個の要素を500ms以内でレンダリングできるか
      return renderTime < 500;
    });
    
    await this.runTest('Memory usage', async () => {
      const element = document.createElement('haqei-question-v2');
      element.dataset.questionId = 'test-q1';
      document.body.appendChild(element);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const performanceInfo = element.getPerformanceInfo();
      const hasMetrics = performanceInfo && typeof performanceInfo.renderCount === 'number';
      
      document.body.removeChild(element);
      return hasMetrics;
    });
  }

  /**
   * エラーハンドリングテスト
   */
  async testErrorHandling() {
    console.log('🛡️ エラーハンドリングテスト開始...');
    
    await this.runTest('Invalid question ID handling', async () => {
      const element = document.createElement('haqei-question-v2');
      element.dataset.questionId = 'invalid-question-id';
      document.body.appendChild(element);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const errorContent = element.shadowRoot.querySelector('.error-question');
      const hasErrorHandling = !!errorContent;
      
      document.body.removeChild(element);
      return hasErrorHandling;
    });
    
    await this.runTest('Missing question data handling', async () => {
      // 質問データを一時的に削除
      const originalData = window.WORLDVIEW_QUESTIONS;
      window.WORLDVIEW_QUESTIONS = [];
      
      const element = document.createElement('haqei-question-v2');
      element.dataset.questionId = 'test-q1';
      document.body.appendChild(element);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const errorContent = element.shadowRoot.querySelector('.error-question');
      const hasErrorHandling = !!errorContent;
      
      // データを復元
      window.WORLDVIEW_QUESTIONS = originalData;
      document.body.removeChild(element);
      
      return hasErrorHandling;
    });
  }

  /**
   * 統合シナリオテスト
   */
  async testIntegrationScenarios() {
    console.log('🔄 統合シナリオテスト開始...');
    
    await this.runTest('Multiple questions display', async () => {
      const elements = [];
      
      for (let i = 1; i <= 5; i++) {
        const element = document.createElement('haqei-question-v2');
        element.dataset.questionId = `test-q${i}`;
        document.body.appendChild(element);
        elements.push(element);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let allVisible = true;
      elements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
          allVisible = false;
        }
      });
      
      // クリーンアップ
      elements.forEach(el => document.body.removeChild(el));
      
      return allVisible;
    });
    
    await this.runTest('Answer restoration', async () => {
      const element = document.createElement('haqei-question-v2');
      element.dataset.questionId = 'test-q1';
      document.body.appendChild(element);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 模擬回答データで復元テスト
      const mockAnswer = {
        selectedValue: 'a',
        questionId: 'test-q1'
      };
      
      element.restoreAnswer(mockAnswer);
      
      const checkedRadio = element.shadowRoot.querySelector('input[type="radio"]:checked');
      const answerRestored = checkedRadio && checkedRadio.value === 'a';
      
      document.body.removeChild(element);
      return answerRestored;
    });
  }

  /**
   * 個別テストの実行
   */
  async runTest(testName, testFunction) {
    this.testResults.total++;
    
    try {
      const result = await testFunction();
      
      if (result) {
        this.testResults.passed++;
        this.testResults.details.push({
          name: testName,
          status: 'PASSED',
          message: 'Test completed successfully'
        });
        console.log(`✅ ${testName}: PASSED`);
      } else {
        this.testResults.failed++;
        this.testResults.details.push({
          name: testName,
          status: 'FAILED',
          message: 'Test returned false'
        });
        console.warn(`❌ ${testName}: FAILED`);
      }
    } catch (error) {
      this.recordError(testName, error);
    }
  }

  /**
   * エラーの記録
   */
  recordError(testName, error) {
    this.testResults.failed++;
    this.testResults.errors.push({
      test: testName,
      error: error.message,
      stack: error.stack
    });
    this.testResults.details.push({
      name: testName,
      status: 'ERROR',
      message: error.message
    });
    console.error(`💥 ${testName}: ERROR - ${error.message}`);
  }

  /**
   * テスト結果の出力
   */
  printResults() {
    const totalTime = performance.now() - this.testStartTime;
    const successRate = ((this.testResults.passed / this.testResults.total) * 100).toFixed(1);
    
    console.log('\n🏁 ===== テスト結果サマリー =====');
    console.log(`実行時間: ${totalTime.toFixed(1)}ms`);
    console.log(`総テスト数: ${this.testResults.total}`);
    console.log(`✅ 成功: ${this.testResults.passed}`);
    console.log(`❌ 失敗: ${this.testResults.failed}`);
    console.log(`🎯 成功率: ${successRate}%`);
    
    if (this.testResults.errors.length > 0) {
      console.log('\n💥 エラー詳細:');
      this.testResults.errors.forEach(error => {
        console.error(`- ${error.test}: ${error.error}`);
      });
    }
    
    if (this.testResults.failed === 0) {
      console.log('\n🎉 全テスト成功！質問表示システムは正常に動作しています。');
    } else {
      console.log('\n⚠️ 一部のテストが失敗しました。詳細を確認してください。');
    }
    
    console.log('================================\n');
  }

  /**
   * デバッグモードの切り替え
   */
  enableDebugMode() {
    document.body.classList.add('debug-mode');
    console.log('🐛 デバッグモードを有効にしました');
  }

  disableDebugMode() {
    document.body.classList.remove('debug-mode');
    console.log('🐛 デバッグモードを無効にしました');
  }
}

// グローバル関数として公開
window.testQuestionDisplaySystem = async function() {
  const tester = new QuestionDisplaySystemTester();
  return await tester.runCompleteTest();
};

window.enableQuestionDebugMode = function() {
  const tester = new QuestionDisplaySystemTester();
  tester.enableDebugMode();
};

window.disableQuestionDebugMode = function() {
  const tester = new QuestionDisplaySystemTester();
  tester.disableDebugMode();
};

console.log('🧪 質問表示システムテスト準備完了');
console.log('テスト実行: testQuestionDisplaySystem()');
console.log('デバッグモード: enableQuestionDebugMode() / disableQuestionDebugMode()');

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.QuestionDisplaySystemTester = QuestionDisplaySystemTester;
}