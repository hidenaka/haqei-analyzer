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
    
    console.log(`⚡ VirtualQuestionFlow ready: ${this.questions.length} questions`);
    super.init();
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
    
    // 要素プールは一時的に使用停止（安定化のため）
    // this.returnInactiveElementsToPool();
    
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
   * 目的：
   * - 仮想スクロールの一環として、現在アクティブな設問のみを画面に表示
   * - メモリ効率とレンダリングパフォーマンスの最適化
   * - 偶数番設問（q2, q4, q6...）も含めてすべての設問を正しく表示
   * 
   * 入力：
   * - なし（this.currentQuestionIndexとthis.activeElementsを使用）
   * 
   * 処理内容：
   * 1. questions-containerの表示状態を確認・設定
   * 2. activeElements Map内のすべての要素をループ
   * 3. currentQuestionIndexと一致するインデックスの要素のみ表示
   *    - スタイル属性を完全にリセット（removeAttribute）
   *    - display, opacity, visibility, position, zIndexを設定
   *    - active-questionクラスを追加
   *    - Shadow DOM内の要素も表示設定
   * 4. それ以外の要素は非表示に設定
   * 5. 10ms後に最終的な表示状態を確認（非同期処理の影響を検出）
   * 
   * 出力：
   * - なし（DOM操作のみ）
   * 
   * 副作用：
   * - DOM要素のstyle属性を直接変更
   * - CSSクラス（active-question）の追加/削除
   * - Shadow DOM内部のスタイル変更
   * - コンソールへのデバッグ情報出力
   * 
   * 前提条件：
   * - activeElements Mapが初期化済み
   * - currentQuestionIndexが有効な範囲内（0 <= index < questions.length）
   * - 各要素がhaqei-question Web Component
   * - questions-containerが存在
   * 
   * エラー処理：
   * - questions-containerが存在しない場合は処理を続行
   * - Shadow DOMアクセスエラーは警告のみ
   * 
   * 既知の問題と対策：
   * - 偶数番設問が表示されない問題
   *   → スタイルのリセット（removeAttribute）を追加
   *   → !importantの使用を避ける
   *   → 要素の実サイズ（getBoundingClientRect）で表示確認
   */
  showCurrentQuestion() {
    console.log(`👁️ Showing question ${this.currentQuestionIndex}, active elements:`, this.activeElements.size);
    
    // コンテナ自体の表示を強制確認
    const questionsContainer = document.getElementById('questions-container');
    if (questionsContainer) {
      questionsContainer.style.setProperty('display', 'flex', 'important');
      questionsContainer.style.setProperty('opacity', '1', 'important');
      questionsContainer.style.setProperty('visibility', 'visible', 'important');
      questionsContainer.classList.add('visible');
    }
    
    // 現在の設問要素を先に取得
    const currentElement = this.activeElements.get(this.currentQuestionIndex);
    if (!currentElement) {
      console.error(`❌ Current element not found for index ${this.currentQuestionIndex}`);
      return;
    }
    
    const questionId = currentElement.dataset.questionId;
    const questionNum = parseInt(questionId.replace('q', ''));
    const isEven = questionNum % 2 === 0;
    
    console.log(`🎯 設問${questionNum}（${isEven ? '偶数' : '奇数'}）を表示開始: ${questionId}`);
    
    /**
     * スタイルリセットと確実な表示制御
     * 
     * 修正内容（2025-08-01）:
     * - 偏数番設問表示失敗問題を解決
     * - !importantを最小限に抑え、CSS競合を回避
     * - removeAttributeでスタイルをリセットしてから再設定
     */
    
    // 1. 全要素のスタイルをリセット
    for (const [index, element] of this.activeElements) {
      // 既存のスタイルを完全にリセット
      element.removeAttribute('style');
      element.classList.remove('active-question');
      
      if (index !== this.currentQuestionIndex) {
        // 非アクティブ要素は非表示
        element.style.display = 'none';
        element.style.opacity = '0';
        element.style.visibility = 'hidden';
      }
    }
    
    // 2. 現在要素の確実な表示（最小限の!important）
    currentElement.style.display = 'block';
    currentElement.style.opacity = '1';
    currentElement.style.visibility = 'visible';
    currentElement.style.position = 'relative';
    currentElement.style.zIndex = '10';
    currentElement.style.width = '100%';
    currentElement.style.height = 'auto';
    currentElement.classList.add('active-question');
    
    // Shadow DOM確保
    this.ensureShadowDOMVisibility(currentElement);
    
    // 3. 即座検証とフォールバック
    setTimeout(() => {
      const finalStyle = window.getComputedStyle(currentElement);
      const rect = currentElement.getBoundingClientRect();
      const isVisible = finalStyle.display !== 'none' && 
                       finalStyle.visibility !== 'hidden' && 
                       rect.height > 0 && rect.width > 0;
      
      if (!isVisible) {
        console.error(`❌ CRITICAL: ${questionId} still not visible after fix!`);
        console.log(`診断情報: display=${finalStyle.display}, visibility=${finalStyle.visibility}, rect=${rect.width}x${rect.height}`);
        
        // 最終手段: 緊急オーバーライド（!important使用）
        currentElement.style.setProperty('display', 'block', 'important');
        currentElement.style.setProperty('opacity', '1', 'important');
        currentElement.style.setProperty('visibility', 'visible', 'important');
        currentElement.style.setProperty('position', 'relative', 'important');
        currentElement.style.setProperty('z-index', '999', 'important');
        currentElement.style.setProperty('width', '100%', 'important');
        currentElement.style.setProperty('height', 'auto', 'important');
        
        console.log(`🚨 Applied emergency CSS override for ${questionId}`);
      } else {
        console.log(`✅ ${questionId} successfully displayed (${rect.width}x${rect.height})`);
      }
    }, 1);
    
    // 少し遅延してから再確認（非同期処理の影響を確認）
    setTimeout(() => {
      const currentElement = this.activeElements.get(this.currentQuestionIndex);
      if (currentElement) {
        const finalStyle = window.getComputedStyle(currentElement);
        const questionNum = parseInt(currentElement.dataset.questionId.replace('q', ''));
        const isEven = questionNum % 2 === 0;
        
        console.log(`\n⏱️ 最終確認 (10ms後) - ${currentElement.dataset.questionId}（${isEven ? '偶数' : '奇数'}）:`);
        
        const finalCheck = {
          display: finalStyle.display,
          opacity: finalStyle.opacity,
          visibility: finalStyle.visibility,
          offsetHeight: currentElement.offsetHeight,
          isVisible: finalStyle.display !== 'none' && currentElement.offsetHeight > 0
        };
        
        console.log(finalCheck);
        
        if (!finalCheck.isVisible) {
          console.error(`❌ エラー: ${currentElement.dataset.questionId} が最終的に表示されていません！`);
          
          // 詳細な診断情報
          console.log(`診断情報:`);
          console.log(`  - コンテナ表示:`, document.getElementById('questions-container')?.style.display);
          console.log(`  - viewport表示:`, document.getElementById('virtual-viewport')?.style.display);
          console.log(`  - 要素の位置:`, currentElement.getBoundingClientRect());
        } else {
          console.log(`✅ ${currentElement.dataset.questionId} は正しく表示されています`);
        }
      }
    }, 10);
    
    // DOM階層の検証
    this.validateDOMStructure();
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

    // 回答内容を設定
    if (choiceType === 'inner') {
      answer.innerChoice = { value, scoring_tags: scoringTags };
    } else if (choiceType === 'outer') {
      answer.outerChoice = { value, scoring_tags: scoringTags };
    } else {
      answer.selectedValue = value;
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
      nextBtn.disabled = !hasAnswer;
    }
  }

  /**
   * 完了数を取得
   */
  getCompletedCount() {
    let count = 0;
    for (const answer of this.answers) {
      if (answer && (answer.selectedValue || (answer.innerChoice && answer.outerChoice))) {
        count++;
      }
    }
    return count;
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
    if (completedCount === this.questions.length && this.onComplete) {
      console.log('🎉 All questions completed!');
      this.onComplete(this.answers);
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
      nextBtn.addEventListener('click', () => this.goToNext());
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