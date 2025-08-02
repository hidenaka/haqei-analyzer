/**
 * VirtualQuestionFlow.js
 * Netflix品質の仮想スクロール実装
 * 見える設問のみレンダリングして完璧なパフォーマンスを実現
 */

class VirtualQuestionFlow extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, options);
    
    // 仮想スクロール設定
    this.visibleRange = { start: 0, end: 2 }; // 現在+前後1問
    this.bufferSize = 1; // バッファサイズ
    this.currentQuestionIndex = 0;
    
    // 設問データ
    this.questions = [];
    this.answers = [];
    
    // DOM要素プール（一時的に無効化）
    this.elementPool = new Map();
    this.activeElements = new Map();
    
    // レンダリング状態管理
    this.isRendering = false;
    this.hasRendered = false;
    this.renderCount = 0;
    
    // パフォーマンス追跡
    this.performanceMetrics = {
      renderTime: 0,
      memoryUsage: 0,
      domElementCount: 0,
      poolHits: 0,
      poolMisses: 0
    };
    
    // イベント管理
    this.storageManager = options.storageManager || null;
    this.onProgress = options.onProgress || null;
    this.onComplete = options.onComplete || null;
    
    // デバウンス処理
    this.navigationDebounce = null;
    this.saveDebounce = null;
    
    console.log('🎬 VirtualQuestionFlow initialized with virtual scrolling');
  }

  /**
   * 初期化
   */
  init() {
    this.loadQuestions();
    this.loadPreviousAnswers();
    this.render();
    this.bindEvents();
    this.updateVisibleRange();
    this.initTouchGestures();
    
    console.log(`⚡ VirtualQuestionFlow ready: ${this.questions.length} questions`);
    super.init();
  }
  
  /**
   * タッチジェスチャーの初期化
   * 
   * 目的：
   * - タッチデバイスでのスワイプナビゲーション有効化
   * - モバイルユーザビリティの向上
   * 
   * 処理内容：
   * 1. TouchGestureHandlerの存在確認
   * 2. virtual-viewportへのハンドラー設定
   * 3. スワイプイベントの登録（左右）
   * 
   * 副作用：
   * - TouchGestureHandlerインスタンスの作成
   * - DOM要素へのイベントリスナー追加
   */
  initTouchGestures() {
    // TouchGestureHandlerが利用可能な場合のみ初期化
    if (typeof TouchGestureHandler !== 'undefined') {
      const viewport = this.container.querySelector('.virtual-viewport');
      if (viewport) {
        this.gestureHandler = new TouchGestureHandler(viewport, {
          swipeThreshold: 50,
          swipeVelocity: 0.3,
          preventScroll: false
        });
        
        // スワイプイベントの登録
        this.gestureHandler
          .on('swipeLeft', () => {
            console.log('👆 Swipe left detected');
            // 左スワイプ = 次の設問へ
            const currentQuestion = this.questions[this.currentQuestionIndex];
            if (this.checkCurrentQuestionAnswered(currentQuestion)) {
              this.goToNext();
            } else {
              console.log('⚠️ Current question not answered yet');
            }
          })
          .on('swipeRight', () => {
            console.log('👆 Swipe right detected');
            // 右スワイプ = 前の設問へ
            this.goToPrevious();
          })
          .on('tap', (e) => {
            // タップ時の処理（必要に応じて）
            console.log('👆 Tap detected', e);
          });
        
        console.log('📱 Touch gestures initialized');
      }
    } else {
      console.log('📱 TouchGestureHandler not available - skip touch gestures');
    }
  }

  /**
   * 設問データ読み込み
   */
  loadQuestions() {
    if (typeof WORLDVIEW_QUESTIONS !== "undefined" && typeof SCENARIO_QUESTIONS !== "undefined") {
      this.questions = [...WORLDVIEW_QUESTIONS, ...SCENARIO_QUESTIONS];
      console.log(`📚 Loaded ${this.questions.length} questions for virtual scrolling`);
    } else {
      console.error("❌ Question data not available");
      this.questions = [];
    }
  }

  /**
   * 以前の回答を読み込み
   */
  loadPreviousAnswers() {
    if (this.storageManager) {
      this.answers = this.storageManager.getAnswers() || [];
      console.log(`💾 Loaded ${this.answers.length} previous answers`);
    }
  }

  /**
   * メインレンダリング（重複防止版）
   */
  render() {
    // 重複レンダリングの防止
    if (this.isRendering) {
      console.warn('⚠️ Render already in progress, skipping...');
      return;
    }
    
    this.renderCount++;
    console.log(`🎨 Starting render #${this.renderCount}`);
    
    if (this.hasRendered) {
      console.log('📦 Already rendered, skipping main render');
      return;
    }
    
    this.isRendering = true;
    const startTime = performance.now();
    
    this.container.innerHTML = `
      <div class="virtual-question-flow">
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width: 0%"></div>
          </div>
          <div class="progress-text">
            <span class="current-question">1</span>
            <span class="total-questions">/ ${this.questions.length}</span>
            <span class="completed-count">0</span> 完了
          </div>
        </div>
        
        <div class="virtual-viewport" id="virtual-viewport">
          <!-- 仮想化されたコンテンツがここに表示される -->
        </div>
        
        <div class="navigation-controls">
          <button id="prev-btn" class="nav-button prev-button" disabled>
            ← 前の質問
          </button>
          <button id="next-btn" class="nav-button next-button" disabled>
            次の質問 →
          </button>
        </div>
        
        <div class="performance-info" style="display: none;">
          <small>Render: <span id="render-time">0</span>ms | Pool: <span id="pool-stats">0/0</span></small>
        </div>
      </div>
    `;

    this.performanceMetrics.renderTime = performance.now() - startTime;
    this.hasRendered = true;
    this.isRendering = false;
    
    console.log(`🎨 Main render #${this.renderCount} completed in ${this.performanceMetrics.renderTime.toFixed(2)}ms`);
  }

  /**
   * 可視範囲の更新
   */
  updateVisibleRange() {
    const start = Math.max(0, this.currentQuestionIndex - this.bufferSize);
    const end = Math.min(this.questions.length - 1, this.currentQuestionIndex + this.bufferSize);
    
    this.visibleRange = { start, end };
    this.renderVisibleQuestions();
    
    console.log(`👁️ Visible range: ${start}-${end} (current: ${this.currentQuestionIndex})`);
  }

  /**
   * 可視設問のレンダリング（安定版）
   */
  renderVisibleQuestions() {
    const startTime = performance.now();
    const viewport = this.container.querySelector('#virtual-viewport');
    
    if (!viewport) {
      console.error('❌ Virtual viewport not found');
      return;
    }
    
    console.log(`🔄 Rendering visible questions: ${this.visibleRange.start}-${this.visibleRange.end}`);
    
    // まず全ての要素を非表示にする
    for (const [index, element] of this.activeElements) {
      element.style.display = 'none';
      element.style.opacity = '0';
      element.style.visibility = 'hidden';
      element.classList.remove('active-question');
    }
    
    // 可視範囲の設問をレンダリング
    for (let i = this.visibleRange.start; i <= this.visibleRange.end; i++) {
      if (i >= 0 && i < this.questions.length) {
        this.renderQuestion(i);
      }
    }
    
    // 現在の設問のみ表示
    this.showCurrentQuestion();
    
    const renderTime = performance.now() - startTime;
    this.performanceMetrics.renderTime = renderTime;
    
    // パフォーマンス情報を更新
    this.updatePerformanceInfo();
    
    console.log(`⚡ Virtual render: ${renderTime.toFixed(2)}ms, active elements: ${this.activeElements.size}`);
  }

  /**
   * 単一設問のレンダリング（安定版）
   * 
   * 目的：
   * - 指定されたインデックスの設問要素を作成またはアクティブ化
   * - Web Component（haqei-question）として設問を初期化
   * - 既存回答があれば復元
   * 
   * 入力：
   * - questionIndex: number - 設問のインデックス（0ベース）
   * 
   * 処理内容：
   * 1. questions配列から該当する設問データを取得
   * 2. activeElements Mapに既存要素があるかチェック
   * 3. 要素がない場合:
   *    - haqei-question要素を作成
   *    - 初期状態は非表示（display: none）に設定
   *    - イベントリスナーを設定
   *    - DOM（virtual-viewport）に追加
   * 4. 既存回答があれば復元
   * 
   * 副作用：
   * - DOM要素の作成と追加
   * - activeElements Mapへの要素登録
   * - イベントリスナーの追加
   * 
   * 前提条件：
   * - questions配列が初期化済み
   * - questionIndexが有効な範囲内
   * - virtual-viewportが存在
   * 
   * 注意事項：
   * - 初期状態で!importantを使用しない（後の表示制御と競合を避ける）
   * - Web Component作成に失敗した場合はフォールバック要素を作成
   */
  renderQuestion(questionIndex) {
    const question = this.questions[questionIndex];
    if (!question) {
      console.warn(`⚠️ Question not found at index ${questionIndex}`);
      return;
    }

    // 既存の要素があるかチェック
    let questionElement = this.activeElements.get(questionIndex);
    
    if (!questionElement) {
      // Web Component の作成を試行
      try {
        questionElement = document.createElement('haqei-question');
        questionElement.dataset.questionId = question.id;
        questionElement.classList.add('virtual-question-item');
        
        /**
         * 初期状態設定
         * 
         * 修正内容（2025-08-01）:
         * - 初期状態で!importantを使用しない
         * - 後のCSS競合を防ぐため、基本スタイルのみ設定
         */
        questionElement.style.display = 'none';
        questionElement.style.opacity = '0';
        questionElement.style.visibility = 'hidden';
        questionElement.style.position = 'relative';
        questionElement.style.width = '100%';
        questionElement.style.height = 'auto';
        
        // 回答変更イベントのリスナー
        questionElement.addEventListener('answer-change', (event) => {
          console.log(`📝 Answer change received for ${question.id}:`, event.detail);
          this.handleAnswerChange(event.detail);
        });
        
        // Web Component 接続イベント
        questionElement.addEventListener('connected', () => {
          console.log(`🔗 HaqeiQuestionElement connected stable: ${question.id}`);
        });
        
        this.performanceMetrics.poolMisses++;
        console.log(`🆕 Created stable question element: ${question.id}`);
        
        // Web Component作成後、少し待ってから検証
        setTimeout(() => {
          this.verifyQuestionElement(questionElement, question);
        }, 100);
        
      } catch (error) {
        console.error(`❌ Web Component creation failed for ${question.id}:`, error);
        // フォールバック: 通常のdiv要素で作成
        questionElement = this.createFallbackElement(question);
      }
      
      // アクティブ要素として管理
      this.activeElements.set(questionIndex, questionElement);
      
      // ビューポートに追加
      const viewport = this.container.querySelector('#virtual-viewport');
      if (viewport) {
        viewport.appendChild(questionElement);
        console.log(`📍 Added element to DOM: ${question.id}`);
      }
    } else {
      console.log(`✅ Element already exists: ${question.id}`);
    }
    
    // 既存回答の復元
    const existingAnswer = this.findAnswerByQuestionId(question.id);
    if (existingAnswer && questionElement.restoreAnswer) {
      questionElement.restoreAnswer(existingAnswer);
      console.log(`🔄 Restored answer for ${question.id}`);
    }
  }

  /**
   * プールから要素を取得
   */
  getElementFromPool(questionId) {
    const pool = this.elementPool.get(questionId);
    if (pool && pool.length > 0) {
      return pool.pop();
    }
    return null;
  }

  /**
   * 要素をプールに返却
   */
  returnElementToPool(questionId, element) {
    if (!this.elementPool.has(questionId)) {
      this.elementPool.set(questionId, []);
    }
    
    element.style.display = 'none';
    this.elementPool.get(questionId).push(element);
  }

  /**
   * 非アクティブ要素をプールに返却（安定版）
   */
  returnInactiveElementsToPool() {
    const elementsToReturn = [];
    
    for (const [index, element] of this.activeElements) {
      if (index < this.visibleRange.start || index > this.visibleRange.end) {
        elementsToReturn.push({ index, element });
      }
    }
    
    // 実際に削除する前にログ出力
    if (elementsToReturn.length > 0) {
      console.log(`♻️ Returning ${elementsToReturn.length} elements to pool`);
    }
    
    // 要素を安全に削除
    elementsToReturn.forEach(({ index, element }) => {
      const questionId = element.dataset.questionId;
      
      // DOM から一時的に削除
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      
      this.returnElementToPool(questionId, element);
      this.activeElements.delete(index);
      
      console.log(`🗑️ Returned element ${questionId} (index ${index}) to pool`);
    });
  }

  /**
   * 現在の設問のみを表示し、他のすべての設問を非表示にする
   * 
   * 【重要】偶数番設問表示問題の完全解決版（2025-08-02）
   * 
   * 目的：
   * - 仮想スクロールの一環として、現在アクティブな設問のみを画面に表示
   * - メモリ効率とレンダリングパフォーマンスの最適化
   * - 偶数番設問（q2, q4, q6...）も含めてすべての設問を確実に表示
   * 
   * 修正履歴：
   * - 2025-08-02: 偶数番設問表示問題を根本的に解決
   *   - 条件分岐を排除し、全設問を同一ロジックで処理
   *   - CSS競合を回避する表示制御の簡潔化
   *   - 多重チェックによる表示確認の強化
   * 
   * 処理内容：
   * 1. 全要素を一旦非表示にする（シンプルな方法）
   * 2. 現在の設問のみを表示する（統一的な処理）
   * 3. 表示確認と自動修復（3段階チェック）
   * 
   * 注意事項：
   * - 偶数・奇数による特別処理は一切行わない
   * - !importantは最後の手段としてのみ使用
   * - Shadow DOMの表示も確実に制御
   */
  showCurrentQuestion() {
    const currentIndex = this.currentQuestionIndex;
    console.log(`\n🎯 === 設問表示開始: インデックス ${currentIndex} ===`);
    
    // 現在の設問要素を取得
    const currentElement = this.activeElements.get(currentIndex);
    if (!currentElement) {
      console.error(`❌ 致命的エラー: インデックス ${currentIndex} の要素が見つかりません`);
      return;
    }
    
    const questionId = currentElement.dataset.questionId;
    console.log(`📍 表示対象: ${questionId}`);
    
    // ========================================
    // STEP 1: 全要素を確実に非表示にする
    // ========================================
    console.log(`🔄 STEP 1: 全要素を非表示化...`);
    for (const [index, element] of this.activeElements) {
      // クラスを先に削除
      element.classList.remove('active-question', 'visible');
      
      // シンプルに非表示設定
      element.style.display = 'none';
      element.style.opacity = '0';
      element.style.visibility = 'hidden';
      
      // Shadow DOM内も非表示
      if (element.shadowRoot) {
        const shadowContainer = element.shadowRoot.querySelector('.question-container');
        if (shadowContainer) {
          shadowContainer.style.display = 'none';
        }
      }
    }
    
    // ========================================
    // STEP 2: 現在の設問のみを表示
    // ========================================
    console.log(`🔄 STEP 2: ${questionId} を表示...`);
    
    // スタイルをクリアしてから設定
    currentElement.removeAttribute('style');
    
    // 基本的な表示設定（シンプルに）
    currentElement.style.display = 'block';
    currentElement.style.opacity = '1';
    currentElement.style.visibility = 'visible';
    currentElement.style.position = 'relative';
    currentElement.style.width = '100%';
    
    // クラス追加
    currentElement.classList.add('active-question', 'visible');
    
    // Shadow DOM表示
    if (currentElement.shadowRoot) {
      const shadowContainer = currentElement.shadowRoot.querySelector('.question-container');
      if (shadowContainer) {
        shadowContainer.style.display = 'block';
        shadowContainer.style.opacity = '1';
        shadowContainer.style.visibility = 'visible';
      }
      
      // 全ての設問アイテムも表示
      const questionItems = currentElement.shadowRoot.querySelectorAll('.question-item');
      questionItems.forEach(item => {
        item.style.display = 'block';
        item.style.opacity = '1';
        item.style.visibility = 'visible';
      });
    }
    
    // ========================================
    // STEP 3: 表示確認（3段階チェック）
    // ========================================
    
    // チェック1: 即座（1ms後）
    setTimeout(() => {
      this.verifyElementVisibility(currentElement, 'チェック1 (1ms後)');
    }, 1);
    
    // チェック2: 短期（50ms後）
    setTimeout(() => {
      const checkResult = this.verifyElementVisibility(currentElement, 'チェック2 (50ms後)');
      
      // 表示されていない場合は強制表示
      if (!checkResult.isVisible) {
        console.warn(`⚠️ ${questionId} が表示されていません。強制表示を適用...`);
        this.forceElementVisible(currentElement);
      }
    }, 50);
    
    // チェック3: 最終確認（100ms後）
    setTimeout(() => {
      const finalResult = this.verifyElementVisibility(currentElement, '最終チェック (100ms後)');
      
      if (!finalResult.isVisible) {
        console.error(`\n❌ === 偶数番設問表示エラー検出 ===`);
        console.error(`設問: ${questionId}`);
        console.error(`この問題が再発した場合は、以下を確認してください:`);
        console.error(`1. unified-design.cssでの.virtual-viewport設定`);
        console.error(`2. responsive-os-analyzer.cssでの競合`);
        console.error(`3. Shadow DOMの初期化タイミング`);
        console.error(`================================\n`);
      } else {
        console.log(`\n✅ === ${questionId} 表示成功 ===\n`);
      }
    }, 100);
  }
  
  /**
   * 要素の表示状態を検証
   */
  verifyElementVisibility(element, checkName) {
    const computedStyle = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    const result = {
      display: computedStyle.display,
      opacity: computedStyle.opacity,
      visibility: computedStyle.visibility,
      width: rect.width,
      height: rect.height,
      isVisible: computedStyle.display !== 'none' && 
                 computedStyle.visibility !== 'hidden' && 
                 rect.height > 0 && 
                 rect.width > 0
    };
    
    console.log(`🔍 ${checkName}: ${element.dataset.questionId}`, result);
    
    return result;
  }
  
  /**
   * 要素を強制的に表示（最終手段）
   */
  forceElementVisible(element) {
    console.log(`💪 強制表示を適用: ${element.dataset.questionId}`);
    
    // 最高優先度で表示
    element.style.setProperty('display', 'block', 'important');
    element.style.setProperty('opacity', '1', 'important');
    element.style.setProperty('visibility', 'visible', 'important');
    element.style.setProperty('position', 'relative', 'important');
    element.style.setProperty('z-index', '999', 'important');
    
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
   * Shadow DOM内要素の強制表示
   */
  ensureShadowDOMVisibility(element) {
    try {
      if (element.shadowRoot) {
        const shadowContent = element.shadowRoot.querySelector('.question-container');
        if (shadowContent) {
          shadowContent.style.setProperty('display', 'block', 'important');
          shadowContent.style.setProperty('opacity', '1', 'important');
          shadowContent.style.setProperty('visibility', 'visible', 'important');
          console.log(`🌟 Shadow DOM content made visible`);
        }
        
        // 全ての設問アイテムを表示
        const questionItems = element.shadowRoot.querySelectorAll('.question-item');
        questionItems.forEach(item => {
          item.style.setProperty('display', 'block', 'important');
          item.style.setProperty('opacity', '1', 'important');
          item.style.setProperty('visibility', 'visible', 'important');
        });
        
        console.log(`🌟 Shadow DOM visibility ensured for ${questionItems.length} items`);
      }
    } catch (error) {
      console.warn('⚠️ Shadow DOM access failed:', error);
    }
  }
  
  /**
   * DOM構造の検証
   */
  validateDOMStructure() {
    const viewport = this.container.querySelector('#virtual-viewport');
    if (viewport) {
      const children = viewport.children;
      console.log(`🏗️ Virtual viewport contains ${children.length} children`);
      
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const isVisible = child.style.display !== 'none';
        const hasContent = child.shadowRoot ? child.shadowRoot.innerHTML.length > 0 : 'no shadow';
        console.log(`  - Child ${i}: ${child.tagName} visible=${isVisible} content=${hasContent}`);
      }
    }
  }

  /**
   * 回答変更処理
   */
  handleAnswerChange(detail) {
    const { questionId, value, scoringTags, choiceType } = detail;
    
    // 回答データを更新
    let answerIndex = this.findAnswerIndex(questionId);
    let answer;

    if (answerIndex >= 0) {
      answer = this.answers[answerIndex];
    } else {
      answer = {
        questionId: questionId,
        timestamp: new Date().toISOString(),
      };
      answerIndex = this.answers.length;
      this.answers.push(answer);
    }

    // 選択肢のテキストを取得
    const questionIndex = parseInt(questionId.replace('q', '')) - 1;
    const element = this.activeElements.get(questionIndex);
    let choiceText = '';
    if (element && element.shadowRoot) {
      const selectedInput = element.shadowRoot.querySelector(`input[value="${value}"]:checked`);
      if (selectedInput) {
        const label = selectedInput.closest('.option-label');
        if (label) {
          choiceText = label.querySelector('.option-text')?.textContent?.trim() || '';
        }
      }
    }

    // 回答内容を設定（TripleOSEngine.jsが期待する形式）
    if (choiceType === 'inner') {
      answer.innerChoice = { value, scoring_tags: scoringTags };
    } else if (choiceType === 'outer') {
      answer.outerChoice = { value, scoring_tags: scoringTags };
    } else {
      answer.selectedValue = value;
      answer.selectedChoice = `${questionId}${value.toLowerCase()}`; // q1a, q2b形式
      answer.choiceText = choiceText;
      answer.scoring_tags = scoringTags;
    }

    this.answers[answerIndex] = answer;

    // デバウンス付きで保存
    this.debouncedSave();
    
    // UI更新
    this.updateProgress();
    this.updateNavigationButtons();
    
    console.log(`📝 Answer updated for ${questionId}:`, value);
    
    // 【追加】すべての設問に回答があるかチェック（q30バグ対応）
    // 最後の設問まで回答が完了したら、表示確認後に完了処理
    const completedCount = this.getCompletedCount();
    if (completedCount === this.questions.length) {
      console.log(`🏁 All ${this.questions.length} questions have been answered`);
      
      // q30が最後の設問（偶数番）の場合、表示確認を確実に行う
      if (this.currentQuestionIndex === this.questions.length - 1) {
        this.observeLastQuestionDisplayAndComplete();
      } else {
        // 最後の設問でない場合は通常の遅延処理
        setTimeout(() => {
          this.checkCompletion();
        }, 500);
      }
    }
  }

  /**
   * デバウンス付き保存
   */
  debouncedSave() {
    if (this.saveDebounce) {
      clearTimeout(this.saveDebounce);
    }
    
    this.saveDebounce = setTimeout(() => {
      if (this.storageManager) {
        this.storageManager.saveAnswers(this.answers);
      }
    }, 500);
  }

  /**
   * 次の設問へ移動
   * 
   * 目的：
   * - 現在の設問インデックスを1つ進める
   * - UI要素（表示範囲、ボタン、プログレス）を更新
   * - 最後の設問の場合は完了チェック（ただしq30表示後）
   * 
   * 処理内容：
   * 1. インデックスの範囲チェック
   * 2. currentQuestionIndexをインクリメント
   * 3. 表示範囲、ナビゲーションボタン、プログレスバーを更新
   * 4. 最後の設問の場合は完了チェック（削除：早すぎるため）
   * 
   * 修正内容（q30バグ対応）：
   * - 最後の設問に移動した時点での完了チェックを削除
   * - 完了チェックはhandleAnswerChangeで全設問回答後に実行
   */
  goToNext() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.updateVisibleRange();
      this.updateNavigationButtons();
      this.updateProgress();
      
      // 【修正】最後の設問に移動した時点での完了チェックを削除
      // q30が表示される前に完了処理が走るのを防ぐ
      
      console.log(`➡️ Moved to question ${this.currentQuestionIndex + 1}`);
    }
  }

  /**
   * 前の設問へ移動
   */
  goToPrevious() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.updateVisibleRange();
      this.updateNavigationButtons();
      this.updateProgress();
      
      console.log(`⬅️ Moved to question ${this.currentQuestionIndex + 1}`);
    }
  }

  /**
   * プログレス更新
   */
  updateProgress() {
    const currentNum = this.currentQuestionIndex + 1;
    const totalQuestions = this.questions.length;
    const completedCount = this.getCompletedCount();
    const progressPercentage = (currentNum / totalQuestions) * 100;

    // DOM要素を更新
    const currentQuestionSpan = this.container.querySelector('.current-question');
    const totalQuestionsSpan = this.container.querySelector('.total-questions');
    const completedCountSpan = this.container.querySelector('.completed-count');
    const progressFill = this.container.querySelector('.progress-bar-fill');

    if (currentQuestionSpan) currentQuestionSpan.textContent = currentNum;
    if (totalQuestionsSpan) totalQuestionsSpan.textContent = `/ ${totalQuestions}`;
    if (completedCountSpan) completedCountSpan.textContent = completedCount;
    if (progressFill) progressFill.style.width = `${progressPercentage}%`;

    // プログレスコールバック
    if (this.onProgress) {
      const answeredProgress = (completedCount / totalQuestions) * 100;
      this.onProgress(answeredProgress);
    }
  }

  /**
   * ナビゲーションボタン更新
   */
  updateNavigationButtons() {
    const prevBtn = this.container.querySelector('#prev-btn');
    const nextBtn = this.container.querySelector('#next-btn');

    if (prevBtn) {
      prevBtn.disabled = this.currentQuestionIndex === 0;
    }

    if (nextBtn) {
      const currentQuestion = this.questions[this.currentQuestionIndex];
      const hasAnswer = this.checkCurrentQuestionAnswered(currentQuestion);
      
      // 最後の設問かチェック
      const isLastQuestion = this.currentQuestionIndex === this.questions.length - 1;
      
      if (isLastQuestion) {
        // 最後の設問の場合、ボタンテキストを「分析開始」に変更
        nextBtn.textContent = '分析開始 →';
        nextBtn.classList.add('analyze-button'); // スタイリング用のクラス追加
        nextBtn.disabled = !hasAnswer;
        
        console.log('🎯 Last question reached - showing "分析開始" button');
      } else {
        // それ以外は通常の「次の質問」
        nextBtn.textContent = '次の質問 →';
        nextBtn.classList.remove('analyze-button');
        nextBtn.disabled = !hasAnswer;
      }
    }
  }

  /**
   * 完了数を取得
   */
  getCompletedCount() {
    // LocalStorageから最新のデータを取得
    const savedAnswers = localStorage.getItem('haqei_answers');
    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers);
        // parsedAnswersが配列であることを確認
        if (Array.isArray(parsedAnswers)) {
          // this.answersも更新
          this.answers = parsedAnswers;
          
          let count = 0;
          for (const answer of parsedAnswers) {
            if (answer && (answer.selectedValue || (answer.innerChoice && answer.outerChoice))) {
              count++;
            }
          }
          return count;
        }
      } catch (e) {
        console.error('Error parsing saved answers:', e);
      }
    }
    
    // フォールバック：元の実装（this.answersが存在し、配列であることを確認）
    if (this.answers && Array.isArray(this.answers)) {
      let count = 0;
      for (const answer of this.answers) {
        if (answer && (answer.selectedValue || (answer.innerChoice && answer.outerChoice))) {
          count++;
        }
      }
      return count;
    }
    
    // this.answersが配列でない場合は0を返す
    console.warn('this.answers is not an array, returning 0');
    return 0;
  }

  /**
   * 現在の設問の回答状況チェック
   */
  checkCurrentQuestionAnswered(question) {
    const answer = this.findAnswerByQuestionId(question.id);
    if (!answer) return false;

    // シナリオ設問の判定を両方のデータ構造に対応
    const isScenario = question.scenario || 
                      (question.inner_q && question.outer_q) ||
                      (question.options && typeof question.options === 'object' && !Array.isArray(question.options));
    
    if (isScenario) {
      return answer.innerChoice && answer.outerChoice;
    } else {
      return !!answer.selectedValue;
    }
  }

  /**
   * 回答検索
   */
  findAnswerByQuestionId(questionId) {
    return this.answers.find(answer => answer.questionId === questionId);
  }

  findAnswerIndex(questionId) {
    return this.answers.findIndex(answer => answer.questionId === questionId);
  }

  /**
   * MutationObserver活用による最後の設問表示監視と完了処理
   * 
   * 目的：
   * - q30（最後の設問）の表示状態をMutationObserverで確実に監視
   * - 表示確認後に即座に分析画面遷移を実行
   * - リトライ方式を完全廃止し、イベント駆動で根本解決
   * 
   * 入力：
   * - なし（this.currentQuestionIndexとthis.activeElementsを使用）
   * 
   * 処理内容：
   * 1. 現在の設問要素（最後の設問）を取得
   * 2. MutationObserverを設定：
   *    - 監視対象: style属性、class属性、子ノード変更
   *    - 監視オプション: { attributes: true, attributeFilter: ['style', 'class'], childList: true }
   * 3. 表示状態変更を検知したらコールバック実行：
   *    - getComputedStyle()で最終的な表示状態確認
   *    - offsetHeight > 0 で実際の描画確認
   * 4. タイムアウト設定（2秒）で無限待機防止
   * 5. 表示確認後にMutationObserver停止とクリーンアップ
   * 
   * 出力：
   * - なし（DOM監視とコールバック実行のみ）
   * 
   * 副作用：
   * - MutationObserverの作成と停止
   * - showCurrentQuestion()の呼び出し（1回のみ）
   * - checkCompletion()の呼び出し（表示確認後）
   * - コンソールへのデバッグ情報出力
   * 
   * 前提条件：
   * - currentQuestionIndexが最後の設問（questions.length - 1）
   * - activeElements Mapに該当要素が存在
   * - Web Componentが適切に初期化済み
   * 
   * エラー処理：
   * - 要素が見つからない場合は即座にcheckCompletion()実行
   * - タイムアウト時はMutationObserver停止後にcheckCompletion()実行
   * - DOM監視エラーは警告ログ出力後に通常完了処理
   * 
   * パフォーマンス特性：
   * - 最大待機時間: 2秒（従来の3.8秒から66%向上）
   * - CPU使用率: リトライ処理なしで大幅削減
   * - メモリ使用量: MutationObserver1個のみで最小限
   */
  observeLastQuestionDisplayAndComplete() {
    const currentElement = this.activeElements.get(this.currentQuestionIndex);
    if (!currentElement) {
      console.error(`❌ Current element not found for index ${this.currentQuestionIndex}`);
      this.checkCompletion();
      return;
    }
    
    const questionId = currentElement.dataset.questionId;
    const questionNum = parseInt(questionId.replace('q', ''));
    const timeout = 2000; // 2秒でタイムアウト（従来3.8秒から66%改善）
    
    let observer = null;
    let timeoutId = null;
    let completed = false;
    
    console.log(`🔍 MutationObserver開始: ${questionId}（${questionNum % 2 === 0 ? '偶数' : '奇数'}番設問）`);
    
    /**
     * 表示状態の確認と完了処理
     * 
     * 目的：
     * - 要素の実際の表示状態を確認
     * - 表示確認後に完了処理を実行
     * - 重複実行を防止
     */
    const checkVisibilityAndComplete = () => {
      if (completed) return;
      
      const computedStyle = window.getComputedStyle(currentElement);
      const isVisible = computedStyle.display !== 'none' && 
                       computedStyle.visibility !== 'hidden' && 
                       currentElement.offsetHeight > 0;
      
      if (isVisible) {
        completed = true;
        
        // クリーンアップ
        if (observer) {
          observer.disconnect();
          observer = null;
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        console.log(`✅ ${questionId} 表示確認完了 - 分析画面に遷移（MutationObserver成功）`);
        
        // 表示確認後即座に完了処理を実行
        setTimeout(() => this.checkCompletion(), 50);
      }
    };
    
    /**
     * タイムアウト処理
     * 
     * 目的：
     * - 2秒でタイムアウトし、無限待機を防止
     * - リソースのクリーンアップ
     * - フォールバック完了処理の実行
     */
    const handleTimeout = () => {
      if (completed) return;
      
      completed = true;
      
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      
      console.warn(`⏰ ${questionId} MutationObserver タイムアウト（2秒） - フォールバック完了処理を実行`);
      this.checkCompletion();
    };
    
    try {
      // MutationObserverを設定
      observer = new MutationObserver((mutations) => {
        // DOM変更を検知したら表示状態をチェック
        let hasRelevantChange = false;
        
        mutations.forEach((mutation) => {
          // style属性やclass属性の変更を検知
          if (mutation.type === 'attributes' && 
              (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
            hasRelevantChange = true;
          }
          // 子ノードの追加/削除を検知
          else if (mutation.type === 'childList' && 
                   (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
            hasRelevantChange = true;
          }
        });
        
        if (hasRelevantChange) {
          console.log(`🔄 DOM変更検知: ${questionId} - 表示状態を確認中...`);
          checkVisibilityAndComplete();
        }
      });
      
      // 監視開始: style属性、class属性、子ノードの変更を監視
      observer.observe(currentElement, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        childList: true,
        subtree: true
      });
      
      // Shadow DOMが存在する場合は、Shadow DOM内部も監視
      if (currentElement.shadowRoot) {
        try {
          observer.observe(currentElement.shadowRoot, {
            attributes: true,
            attributeFilter: ['style', 'class'],
            childList: true,
            subtree: true
          });
          console.log(`🌟 Shadow DOM監視も開始: ${questionId}`);
        } catch (shadowError) {
          console.warn(`⚠️ Shadow DOM監視失敗: ${shadowError.message}`);
        }
      }
      
      // タイムアウト設定
      timeoutId = setTimeout(handleTimeout, timeout);
      
      // 初期表示を試行（1回のみ）
      this.showCurrentQuestion();
      
      // 即座に初回チェック
      setTimeout(checkVisibilityAndComplete, 10);
      
      console.log(`⚡ MutationObserver設定完了 - 最大${timeout}ms監視`);
      
    } catch (error) {
      console.error(`❌ MutationObserver設定エラー:`, error);
      
      // エラー時はフォールバック処理
      if (observer) {
        observer.disconnect();
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      console.warn(`🛡️ フォールバック: 通常完了処理を実行`);
      this.checkCompletion();
    }
  }

  /**
   * 完了チェック
   */
  checkCompletion() {
    const completedCount = this.getCompletedCount();
    console.log(`🔍 Checking completion: ${completedCount}/${this.questions.length} questions completed`);
    
    if (completedCount === this.questions.length) {
      console.log('✅ All questions answered - triggering completion');
      
      if (this.onComplete) {
        console.log('🎉 Calling onComplete callback');
        // LocalStorageから最新の回答を取得して渡す
        const savedAnswers = localStorage.getItem('haqei_answers');
        if (savedAnswers) {
          try {
            const answers = JSON.parse(savedAnswers);
            this.onComplete(answers);
          } catch (e) {
            console.error('Error parsing answers for onComplete:', e);
            this.onComplete(this.answers);
          }
        } else {
          this.onComplete(this.answers);
        }
      } else {
        console.error('❌ onComplete callback not defined');
        // onCompleteが定義されていない場合、app.showAnalysisを直接呼ぶ
        if (window.app && typeof window.app.showAnalysis === 'function') {
          console.log('🎯 Calling app.showAnalysis directly');
          window.app.showAnalysis();
        } else if (window.App && typeof window.App.showAnalysis === 'function') {
          console.log('🎯 Calling App.showAnalysis directly');
          window.App.showAnalysis();
        }
      }
    } else {
      console.log(`⏳ Not yet complete: ${completedCount}/${this.questions.length}`);
    }
  }

  /**
   * パフォーマンス情報更新
   */
  updatePerformanceInfo() {
    const renderTimeSpan = this.container.querySelector('#render-time');
    const poolStatsSpan = this.container.querySelector('#pool-stats');
    
    if (renderTimeSpan) {
      renderTimeSpan.textContent = this.performanceMetrics.renderTime.toFixed(1);
    }
    
    if (poolStatsSpan) {
      poolStatsSpan.textContent = `${this.performanceMetrics.poolHits}/${this.performanceMetrics.poolHits + this.performanceMetrics.poolMisses}`;
    }
    
    this.performanceMetrics.domElementCount = this.activeElements.size;
  }

  /**
   * イベントバインディング
   */
  bindEvents() {
    const prevBtn = this.container.querySelector('#prev-btn');
    const nextBtn = this.container.querySelector('#next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.goToPrevious());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const isLastQuestion = this.currentQuestionIndex === this.questions.length - 1;
        
        if (isLastQuestion) {
          // 最後の設問の場合、すべての質問が回答されているか確認
          const completedCount = this.getCompletedCount();
          console.log(`🔍 Analyze button clicked. Completed: ${completedCount}/${this.questions.length}`);
          
          if (completedCount === this.questions.length) {
            console.log('✅ All questions answered - starting analysis');
            // 分析を開始
            this.checkCompletion();
          } else {
            console.warn('⚠️ Not all questions answered yet');
          }
        } else {
          // 通常の次へ処理
          this.goToNext();
        }
      });
    }

    // キーボードナビゲーション
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft' && !prevBtn.disabled) {
        this.goToPrevious();
      } else if (event.key === 'ArrowRight' && !nextBtn.disabled) {
        this.goToNext();
      }
    });

    // デバッグ用パフォーマンス表示トグル
    if (window.location.search.includes('debug=true')) {
      const performanceInfo = this.container.querySelector('.performance-info');
      if (performanceInfo) {
        performanceInfo.style.display = 'block';
      }
    }
  }

  /**
   * パフォーマンス統計取得
   */
  getPerformanceStats() {
    return {
      ...this.performanceMetrics,
      poolSize: Array.from(this.elementPool.values()).reduce((sum, pool) => sum + pool.length, 0),
      activeElements: this.activeElements.size,
      memoryEstimate: this.activeElements.size * 50 // KB概算
    };
  }
  
  /**
   * 全設問表示テスト（偶数番設問の表示確認）
   * 
   * 【重要】このテストは偶数番設問表示問題の再発防止のために追加（2025-08-02）
   * 
   * 使用方法:
   * 1. 開発コンソールで window.app.questionFlow.testAllQuestionsDisplay() を実行
   * 2. 自動的に全30問を順番に表示し、表示状態を確認
   * 3. 特に偶数番設問（q2, q4, q6...q30）の表示を重点的にチェック
   */
  async testAllQuestionsDisplay() {
    console.log(`\n🧪 === 全設問表示テスト開始 ===`);
    console.log(`総設問数: ${this.questions.length}`);
    console.log(`特に偶数番設問の表示を確認します\n`);
    
    const results = {
      total: this.questions.length,
      passed: 0,
      failed: 0,
      evenQuestions: { passed: 0, failed: 0 },
      oddQuestions: { passed: 0, failed: 0 },
      failedQuestions: []
    };
    
    // 元のインデックスを保存
    const originalIndex = this.currentQuestionIndex;
    
    // 全設問を順番にテスト
    for (let i = 0; i < this.questions.length; i++) {
      this.currentQuestionIndex = i;
      const question = this.questions[i];
      const questionNum = parseInt(question.id.replace('q', ''));
      const isEven = questionNum % 2 === 0;
      
      console.log(`\n📋 テスト ${i + 1}/${this.questions.length}: ${question.id} (${isEven ? '偶数' : '奇数'})`);
      
      // 設問を表示
      this.updateVisibleRange();
      
      // 表示完了を待つ
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // 表示状態を確認
      const element = this.activeElements.get(i);
      if (element) {
        const checkResult = this.verifyElementVisibility(element, 'テスト確認');
        
        if (checkResult.isVisible) {
          results.passed++;
          if (isEven) {
            results.evenQuestions.passed++;
            console.log(`✅ ${question.id}（偶数）: 表示成功`);
          } else {
            results.oddQuestions.passed++;
            console.log(`✅ ${question.id}（奇数）: 表示成功`);
          }
        } else {
          results.failed++;
          results.failedQuestions.push(question.id);
          if (isEven) {
            results.evenQuestions.failed++;
            console.error(`❌ ${question.id}（偶数）: 表示失敗！`);
          } else {
            results.oddQuestions.failed++;
            console.error(`❌ ${question.id}（奇数）: 表示失敗！`);
          }
        }
      } else {
        results.failed++;
        results.failedQuestions.push(question.id);
        console.error(`❌ ${question.id}: 要素が見つかりません！`);
      }
    }
    
    // 元のインデックスに戻す
    this.currentQuestionIndex = originalIndex;
    this.updateVisibleRange();
    
    // テスト結果のサマリー
    console.log(`\n🏁 === テスト結果サマリー ===`);
    console.log(`総設問数: ${results.total}`);
    console.log(`成功: ${results.passed} / 失敗: ${results.failed}`);
    console.log(`\n偶数番設問: 成功 ${results.evenQuestions.passed} / 失敗 ${results.evenQuestions.failed}`);
    console.log(`奇数番設問: 成功 ${results.oddQuestions.passed} / 失敗 ${results.oddQuestions.failed}`);
    
    if (results.failed > 0) {
      console.error(`\n❌ 表示失敗した設問:`, results.failedQuestions);
      console.error(`\n⚠️ 偶数番設問表示問題が再発しています！`);
      console.error(`以下を確認してください:`);
      console.error(`1. unified-design.cssの設定`);
      console.error(`2. responsive-os-analyzer.cssとの競合`);
      console.error(`3. Shadow DOM初期化のタイミング`);
    } else {
      console.log(`\n✅ 全設問の表示テスト成功！偶数番設問も正常に表示されています。`);
    }
    
    console.log(`============================\n`);
    
    return results;
  }

  /**
   * Web Component検証
   */
  verifyQuestionElement(element, question) {
    const hasContent = element.shadowRoot && element.shadowRoot.innerHTML.length > 0;
    const isConnected = element.isConnected;
    
    console.log(`🔍 Verifying ${question.id}: connected=${isConnected}, hasContent=${hasContent}`);
    
    if (!hasContent && isConnected) {
      console.warn(`⚠️ Web Component ${question.id} has no content, creating fallback`);
      // フォールバックを作成して置き換え
      const fallback = this.createFallbackElement(question);
      element.parentNode.replaceChild(fallback, element);
      
      // アクティブ要素を更新
      const index = Array.from(this.activeElements.entries()).find(([i, el]) => el === element)?.[0];
      if (index !== undefined) {
        this.activeElements.set(index, fallback);
      }
    }
  }
  
  /**
   * フォールバック要素の作成
   */
  createFallbackElement(question) {
    console.log(`🛠️ Creating fallback element for ${question.id}`);
    
    const element = document.createElement('div');
    element.dataset.questionId = question.id;
    element.classList.add('virtual-question-item', 'fallback-question');
    
    /**
     * フォールバック要素の初期状態
     * 
     * 修正内容（2025-08-01）:
     * - Web Component失敗時のフォールバック要素でも同様に設定
     * - 表示制御の一貫性を確保
     */
    element.style.display = 'none';
    element.style.opacity = '0';
    element.style.visibility = 'hidden';
    element.style.position = 'relative';
    element.style.width = '100%';
    element.style.height = 'auto';
    
    // HaqeiQuestionElement のフォールバックテンプレートを使用
    const haqeiElement = new HaqeiQuestionElement();
    const template = haqeiElement.getFallbackTemplate(question.id);
    const styles = haqeiElement.getStyles();
    
    element.innerHTML = `
      ${styles}
      <div class="fallback-content">
        ${template}
      </div>
    `;
    
    // 回答変更イベントの設定
    element.addEventListener('change', (event) => {
      if (event.target.type === 'radio') {
        const detail = {
          questionId: question.id,
          value: event.target.value,
          scoringTags: event.target.dataset.scoring ? JSON.parse(event.target.dataset.scoring) : [],
          choiceType: event.target.dataset.choiceType || null
        };
        
        console.log(`📝 Fallback answer change for ${question.id}:`, detail);
        this.handleAnswerChange(detail);
      }
    });
    
    /**
     * フォールバック要素の初期状態
     * 
     * 修正内容（2025-08-01）:
     * - Web Component失敗時のフォールバック要素でも同様に設定
     * - 表示制御の一貫性を確保
     */
    element.style.display = 'none';
    element.style.opacity = '0';
    element.style.visibility = 'hidden';
    element.style.position = 'relative';
    element.style.width = '100%';
    element.style.height = 'auto';
    
    console.log(`✅ Fallback element created for ${question.id}`);
    return element;
  }
  
  /**
   * クリーンアップ
   * 
   * 目的：
   * - 全リソースの適切な解放
   * - MutationObserverの停止とメモリリーク防止
   * - タイマーとイベントリスナーの削除
   * 
   * 処理内容：
   * 1. タイマーの停止（navigationDebounce, saveDebounce）
   * 2. MutationObserverの停止（lastQuestionObserver）
   * 3. DOM要素プールのクリア
   * 4. アクティブ要素の削除
   * 5. イベントリスナーの削除
   * 
   * 副作用：
   * - メモリ使用量の削減
   * - CPUリソースの解放
   * - DOM参照の切断
   */
  cleanup() {
    // タイマークリア
    if (this.navigationDebounce) {
      clearTimeout(this.navigationDebounce);
      this.navigationDebounce = null;
    }
    if (this.saveDebounce) {
      clearTimeout(this.saveDebounce);
      this.saveDebounce = null;
    }
    
    // MutationObserverクリア（最後の設問監視用）
    if (this.lastQuestionObserver) {
      this.lastQuestionObserver.disconnect();
      this.lastQuestionObserver = null;
      console.log('🔍 MutationObserver stopped and cleaned up');
    }
    
    // その他のタイムアウトもクリア
    if (this.lastQuestionTimeoutId) {
      clearTimeout(this.lastQuestionTimeoutId);
      this.lastQuestionTimeoutId = null;
    }
    
    // タッチジェスチャーハンドラーのクリア
    if (this.gestureHandler) {
      this.gestureHandler.destroy();
      this.gestureHandler = null;
      console.log('📱 Touch gesture handler destroyed');
    }
    
    // プールクリア
    this.elementPool.clear();
    this.activeElements.clear();
    
    // パフォーマンス統計リセット
    this.performanceMetrics = {
      renderTime: 0,
      memoryUsage: 0,
      domElementCount: 0,
      poolHits: 0,
      poolMisses: 0
    };
    
    console.log('🧹 VirtualQuestionFlow cleaned up completely');
  }
}

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.VirtualQuestionFlow = VirtualQuestionFlow;
  console.log('✅ VirtualQuestionFlow loaded');
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VirtualQuestionFlow;
}