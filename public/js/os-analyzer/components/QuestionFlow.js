// QuestionFlow.js - 質問フローUIコンポーネント
// HaQei Analyzer - Question Flow Component

class QuestionFlow extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.questions = [];
    this.storageManager = options.storageManager || null;
    this.changeEventBound = false; // イベント重複防止フラグ
    
    // パフォーマンス最適化のためのキャッシュ
    this.cachedElements = new Map();
    this.completedCountCache = 0;
    this.lastUpdateTime = 0;
    this.debounceTimer = null;
    this.updateQueue = [];
    
    console.log(
      "🔧 QuestionFlow constructor: currentQuestionIndex =",
      this.currentQuestionIndex
    );
  }

  init() {
    this.loadQuestions();
    this.loadPreviousAnswers();
    console.log(
      `🎯 QuestionFlow initialized with ${this.questions.length} questions`
    );
    console.log("🔧 Current question index:", this.currentQuestionIndex);
    super.init();
    this.render();
    this.bindEvents();
  }

  loadQuestions() {
    // 価値観設問とシナリオ設問を読み込み
    if (typeof WORLDVIEW_QUESTIONS === "undefined") {
      console.error("❌ WORLDVIEW_QUESTIONS is not defined");
      this.questions = [];
      return;
    }

    if (typeof SCENARIO_QUESTIONS === "undefined") {
      console.error("❌ SCENARIO_QUESTIONS is not defined");
      this.questions = WORLDVIEW_QUESTIONS || [];
      return;
    }

    // 価値観設問 + シナリオ設問を結合
    this.questions = [...WORLDVIEW_QUESTIONS, ...SCENARIO_QUESTIONS];
    console.log("📝 Loaded questions:", this.questions.length);
    console.log("📝 Worldview questions:", WORLDVIEW_QUESTIONS.length);
    console.log("📝 Scenario questions:", SCENARIO_QUESTIONS.length);

    // 念の為、インデックスを再初期化
    this.currentQuestionIndex = 0;
    console.log("🔧 Reset currentQuestionIndex to:", this.currentQuestionIndex);
  }

  // 以前の回答を読み込み
  loadPreviousAnswers() {
    if (this.storageManager) {
      const savedAnswers = this.storageManager.getAnswers();
      const savedProgress = this.storageManager.getProgress();

      if (savedAnswers && savedAnswers.length > 0) {
        this.answers = savedAnswers;
        console.log("📋 Loaded previous answers:", this.answers.length);
      }

      if (savedProgress) {
        this.currentQuestionIndex = savedProgress.currentQuestionIndex || 0;
        console.log("🔄 Restored progress:", this.currentQuestionIndex);
      }
    }
  }

  get defaultOptions() {
    return {
      ...super.defaultOptions,
      onProgress: null,
      onComplete: null,
    };
  }

  render() {
    // 🚀 最適化: レンダリング時にキャッシュをクリア
    this.clearElementCache();
    
    if (this.questions.length === 0) {
      this.container.innerHTML =
        '<div class="error">設問データが読み込めませんでした。</div>';
      return;
    }

    // 現在の質問番号を確実に計算
    const currentQuestionNum = this.currentQuestionIndex + 1;
    const totalQuestions = this.questions.length;
    const progressPercentage = (currentQuestionNum / totalQuestions) * 100;
    const completedQuestions = this.getCompletedCountOptimized();
    
    // 質問タイプを判定（価値観 vs シナリオ）
    const isValueQuestion = this.currentQuestionIndex < (typeof WORLDVIEW_QUESTIONS !== 'undefined' ? WORLDVIEW_QUESTIONS.length : 15);
    const questionType = isValueQuestion ? '価値観質問' : 'シナリオ質問';
    const questionIcon = isValueQuestion ? '💭' : '🎭';

    console.log(
      `📊 Rendering: Question ${currentQuestionNum} of ${totalQuestions}`
    );

    this.container.innerHTML = `
      <div class="question-flow-container">
        <div class="question-header">
          <div class="progress-section">
            <div class="progress-info">
              <div class="question-counter">
                <span class="current-question">${currentQuestionNum}</span>
                <span class="total-questions">/ ${totalQuestions}</span>
              </div>
              <div class="question-type-indicator">
                <span class="type-icon">${questionIcon}</span>
                <span class="type-text">${questionType}</span>
              </div>
            </div>
            <div class="progress-visual">
              <div class="progress-bar-container">
                <div class="progress-bar-track"></div>
                <div class="progress-bar-fill" style="width: ${progressPercentage}%"></div>
                <div class="progress-milestone" style="left: ${(15 / totalQuestions) * 100}%" title="価値観質問完了"></div>
              </div>
              <div class="completion-stats">
                <span class="completed-count">${completedQuestions}</span>
                <span class="completed-label">問完了</span>
              </div>
            </div>
          </div>
        </div>

        <div class="question-content">
          <div id="question-display" class="question-display-animated">
            <!-- 質問がここに表示される -->
          </div>
        </div>

        <div class="question-navigation">
          <button id="prev-btn" class="btn btn-secondary btn-touch-friendly" ${
            this.currentQuestionIndex === 0 ? "disabled" : ""
          }>
            <span class="btn-icon">←</span>
            <span class="btn-text">前の質問</span>
          </button>
          <div class="navigation-progress">
            <div class="nav-dots">
              ${Array.from({length: Math.min(totalQuestions, 10)}, (_, i) => {
                const questionIndex = Math.floor((i / 9) * (totalQuestions - 1));
                const isCompleted = this.answers.some(a => a && a.questionId === this.questions[questionIndex]?.id);
                const isCurrent = questionIndex === this.currentQuestionIndex;
                return `<div class="nav-dot ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}"></div>`;
              }).join('')}
            </div>
          </div>
          <button id="next-btn" class="btn btn-primary btn-touch-friendly" disabled>
            <span class="btn-text">次の質問</span>
            <span class="btn-icon">→</span>
          </button>
        </div>
      </div>
    `;

    this.renderCurrentQuestion();
    this.addProgressAnimations();
  }

  renderCurrentQuestion() {
    console.log(
      `🎯 Rendering current question. Index: ${this.currentQuestionIndex}, Total: ${this.questions.length}`
    );

    const question = this.questions[this.currentQuestionIndex];
    const questionDisplay = this.container.querySelector("#question-display");

    if (!question) {
      console.error(
        "❌ Question not found at index:",
        this.currentQuestionIndex
      );
      return;
    }

    // answersが未定義または配列でなければ初期化
    if (!Array.isArray(this.answers)) {
      console.warn("⚠️ this.answersが未定義または配列でないため初期化します");
      this.answers = [];
    }

    console.log(
      "📝 Rendering question:",
      question.id,
      question.text || question.scenario
    );

    // フェードアウト -> レンダリング -> フェードイン
    questionDisplay.style.opacity = '0';
    
    setTimeout(() => {
      this.renderQuestionContent(question, questionDisplay);
      questionDisplay.style.opacity = '1';
    }, 150);
  }

  renderQuestionContent(question, questionDisplay) {
    // シナリオ設問かどうかを判定
    const isScenario =
      question.scenario && question.inner_q && question.outer_q;

    if (isScenario) {
      // シナリオ設問の場合：inner/outer選択肢を表示
      questionDisplay.innerHTML = `
        <div class="question-item scenario-question slide-in">
          <div class="scenario-context">
            <div class="scenario-icon">🎭</div>
            <h3 class="scenario-title">状況設定</h3>
            <p class="scenario-text">${question.scenario}</p>
          </div>
          
          <div class="scenario-choices">
            <div class="choice-section inner-choice">
              <div class="choice-header">
                <span class="choice-icon">💭</span>
                <h4 class="choice-title">${question.inner_q}</h4>
              </div>
              <div class="question-options">
                ${question.options.inner
                  .map(
                    (option, index) => `
                  <label class="option-label" style="animation-delay: ${index * 0.1}s">
                    <input type="radio" name="inner-${question.id}" value="${
                      option.value
                    }" 
                           data-scoring='${JSON.stringify(option.scoring_tags)}'
                           data-choice-type="inner">
                    <div class="option-content">
                      <div class="option-indicator"></div>
                      <span class="option-text">${option.text}</span>
                    </div>
                  </label>
                `
                  )
                  .join("")}
              </div>
            </div>
            
            <div class="choice-section outer-choice">
              <div class="choice-header">
                <span class="choice-icon">👥</span>
                <h4 class="choice-title">${question.outer_q}</h4>
              </div>
              <div class="question-options">
                ${question.options.outer
                  .map(
                    (option, index) => `
                  <label class="option-label" style="animation-delay: ${(index + question.options.inner.length) * 0.1}s">
                    <input type="radio" name="outer-${question.id}" value="${
                      option.value
                    }" 
                           data-scoring='${JSON.stringify(option.scoring_tags)}'
                           data-choice-type="outer">
                    <div class="option-content">
                      <div class="option-indicator"></div>
                      <span class="option-text">${option.text}</span>
                    </div>
                  </label>
                `
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      // 通常の価値観設問の場合
      questionDisplay.innerHTML = `
        <div class="question-item value-question slide-in">
          <div class="question-header">
            <div class="question-icon">💭</div>
            <h3 class="question-title">${question.text}</h3>
          </div>
          <div class="question-options">
            ${question.options
              .map(
                (option, index) => `
              <label class="option-label" style="animation-delay: ${index * 0.1}s">
                <input type="radio" name="question-${question.id}" value="${
                  option.value
                }" 
                       data-scoring='${JSON.stringify(option.scoring_tags)}'>
                <div class="option-content">
                  <div class="option-indicator"></div>
                  <span class="option-text">${option.text}</span>
                  <div class="option-ripple"></div>
                </div>
              </label>
            `
              )
              .join("")}
          </div>
        </div>
      `;
    }

    // 既存の回答があれば選択状態を復元
    this.restoreExistingAnswers(question, isScenario);
  }

  addProgressAnimations() {
    // プログレスバーのアニメーション
    const progressFill = this.container.querySelector('.progress-bar-fill');
    if (progressFill) {
      progressFill.style.transition = 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    // 質問カードのエントランスアニメーション
    const questionDisplay = this.container.querySelector('#question-display');
    if (questionDisplay) {
      questionDisplay.style.transition = 'opacity 0.3s ease-in-out';
    }

    // ナビゲーションドットのアニメーション
    const navDots = this.container.querySelectorAll('.nav-dot');
    navDots.forEach((dot, index) => {
      dot.style.animationDelay = `${index * 0.05}s`;
    });
  }

  // 既存回答の復元
  restoreExistingAnswers(question, isScenario) {
    const existingAnswer = this.findAnswerByQuestionId(question.id);

    if (existingAnswer) {
      if (isScenario) {
        // シナリオ設問の場合：inner/outerを個別に復元
        if (existingAnswer.innerChoice) {
          const innerRadio = this.container.querySelector(
            `input[name="inner-${question.id}"][value="${existingAnswer.innerChoice.value}"]`
          );
          if (innerRadio) {
            innerRadio.checked = true;
          }
        }

        if (existingAnswer.outerChoice) {
          const outerRadio = this.container.querySelector(
            `input[name="outer-${question.id}"][value="${existingAnswer.outerChoice.value}"]`
          );
          if (outerRadio) {
            outerRadio.checked = true;
          }
        }
      } else {
        // 通常設問の場合
        const radio = this.container.querySelector(
          `input[value="${existingAnswer.selectedValue}"]`
        );
        if (radio) {
          radio.checked = true;
        }
      }

      this.updateNavigationButtons();
    }
  }

  bindEvents() {
    // 選択肢変更イベント（一度だけ設定）
    if (!this.changeEventBound) {
      this.container.addEventListener("change", (e) => {
        if (e.target.type === "radio") {
          this.handleAnswerChange(e.target);
        }
      });
      this.changeEventBound = true;
      console.log("🔧 Change event bound once");
    }

    // ナビゲーションボタン（毎回設定し直す）
    this.bindNavigationEvents();
  }

  bindNavigationEvents() {
    const prevBtn = this.container.querySelector("#prev-btn");
    const nextBtn = this.container.querySelector("#next-btn");

    if (prevBtn) {
      // 直接イベントリスナーを設定（クローン方式を廃止）
      prevBtn.onclick = null; // 既存イベントをクリア
      prevBtn.onclick = (e) => {
        e.preventDefault();
        this.goToPrevious();
      };
      console.log("🔧 Previous button event bound");
    }

    if (nextBtn) {
      // 直接イベントリスナーを設定（クローン方式を廃止）
      nextBtn.onclick = null; // 既存イベントをクリア
      nextBtn.onclick = (e) => {
        e.preventDefault();
        this.goToNext();
      };
      console.log("🔧 Next button event bound");
    }
  }

  // 🚀 パフォーマンス最適化版 handleAnswerChange
  handleAnswerChange(radioElement) {
    try {
      const question = this.questions[this.currentQuestionIndex];
      if (!question) {
        console.error(
          "❌ handleAnswerChange: questionが見つかりません",
          this.currentQuestionIndex,
          this.questions
        );
        return;
      }

      const selectedValue = radioElement.value;
      const scoringTags = JSON.parse(radioElement.dataset.scoring || "[]");
      const choiceType = radioElement.dataset.choiceType; // inner/outer/undefined

      // 入力データの検証
      if (!selectedValue) {
        console.error("❌ Invalid answer data: selectedValue is required");
        return;
      }

      // 🚀 最適化: デバウンス処理でDOM更新を制御
      this.debouncedUpdate(() => {
        this.processAnswerUpdate(question, selectedValue, scoringTags, choiceType, radioElement);
      });

    } catch (error) {
      console.error("❌ Critical error in handleAnswerChange:", error);
      alert(
        "回答の保存中にエラーが発生しました。ページを再読み込みして再度お試しください。"
      );
    }
  }

  // 🚀 修正版: デバウンス処理付きの更新メソッド（26問目以降は即座実行）
  debouncedUpdate(callback) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    // 即座にUIフィードバックを提供
    this.showImmediateUIFeedback();
    
    // 26問目以降（シナリオ質問）は即座に実行してパフォーマンスを改善
    const isScenarioPhase = this.currentQuestionIndex >= 15; // 価値観15問 + シナリオ開始
    const delay = isScenarioPhase ? 0 : 50;
    
    console.log(`🚀 debouncedUpdate: index=${this.currentQuestionIndex}, isScenario=${isScenarioPhase}, delay=${delay}ms`);
    
    // 実際の処理を実行
    this.debounceTimer = setTimeout(() => {
      callback();
      this.debounceTimer = null;
    }, delay);
  }

  // 🚀 新規: 即座のUIフィードバック
  showImmediateUIFeedback() {
    // 視覚的フィードバックを即座に提供
    const progressFill = this.getCachedElement('.progress-bar-fill');
    if (progressFill) {
      progressFill.style.transition = 'width 0.2s ease-out';
    }
  }

  // 🚀 新規: 最適化された回答処理メソッド
  processAnswerUpdate(question, selectedValue, scoringTags, choiceType, radioElement) {
    console.log(
      `🔧 Processing answer for question ${question.id}, value: ${selectedValue}, choiceType: ${choiceType}`
    );

    // シナリオ設問かどうかを判定
    const isScenario = question.scenario && question.inner_q && question.outer_q;

    // 🚀 最適化: 既存回答検索をキャッシュ活用
    let answerIndex = this.findAnswerIndexOptimized(question.id);
    let answer;

    if (answerIndex >= 0) {
      answer = this.answers[answerIndex];
    } else {
      answer = {
        questionId: question.id,
        timestamp: new Date().toISOString(),
      };
      answerIndex = this.answers.length;
      this.answers.push(answer);
    }

    // 回答データの更新
    if (isScenario) {
      if (choiceType === "inner") {
        answer.innerChoice = {
          value: selectedValue,
          scoring_tags: scoringTags,
        };
      } else if (choiceType === "outer") {
        answer.outerChoice = {
          value: selectedValue,
          scoring_tags: scoringTags,
        };
      } else {
        console.error("❌ Invalid choice type for scenario question:", choiceType);
        return;
      }
    } else {
      answer.selectedValue = selectedValue;
      answer.scoring_tags = scoringTags;
    }

    this.answers[answerIndex] = answer;

    // 🚀 最適化: ストレージ保存を非同期化
    this.saveAnswersAsync();

    // 🚀 最適化: バッチでUI更新
    this.batchUIUpdate(radioElement, choiceType);
  }

  // 🚀 新規: 最適化された回答検索
  findAnswerIndexOptimized(questionId) {
    // 🚀 最適化: 逆順検索（最新の回答が後ろにあることが多いため）
    for (let i = this.answers.length - 1; i >= 0; i--) {
      const answer = this.answers[i];
      if (answer.questionId === questionId || String(answer.questionId) === String(questionId)) {
        return i;
      }
    }
    return -1;
  }

  // 🚀 新規: 非同期ストレージ保存
  saveAnswersAsync() {
    if (this.storageManager) {
      // requestIdleCallbackを使用して、ブラウザの空き時間に保存
      const saveOperation = () => {
        try {
          this.storageManager.saveAnswers(this.answers);
          console.log(`💾 Answers saved to storage: ${this.answers.length} answers`);
        } catch (storageError) {
          console.error("❌ Failed to save answers to storage:", storageError);
        }
      };

      if (window.requestIdleCallback) {
        window.requestIdleCallback(saveOperation, { timeout: 1000 });
      } else {
        setTimeout(saveOperation, 0);
      }
    }
  }

  // 🚀 新規: バッチUI更新
  batchUIUpdate(radioElement, choiceType) {
    // 🚀 最適化: requestAnimationFrameを使用してUI更新をバッチ化
    if (!this.pendingUIUpdate) {
      this.pendingUIUpdate = true;
      requestAnimationFrame(() => {
        this.updateNavigationButtonsOptimized();
        this.updateProgressOptimized();
        this.updateVisualFeedback(radioElement, choiceType);
        this.pendingUIUpdate = false;
      });
    }
  }

  // 🚀 新規: キャッシュ活用のDOM要素取得
  getCachedElement(selector) {
    if (!this.cachedElements.has(selector)) {
      const element = this.container.querySelector(selector);
      this.cachedElements.set(selector, element);
    }
    return this.cachedElements.get(selector);
  }

  // 🚀 新規: キャッシュクリア
  clearElementCache() {
    this.cachedElements.clear();
  }

  // 🚀 新規: 視覚的フィードバック最適化
  updateVisualFeedback(radioElement, choiceType) {
    const choiceSection = choiceType
      ? radioElement.closest(".choice-section")
      : radioElement.closest(".question-item");

    if (choiceSection) {
      // 🚀 最適化: classList操作をバッチ化
      const labels = choiceSection.querySelectorAll(".option-label");
      labels.forEach(label => label.classList.remove("selected"));
      
      const selectedLabel = radioElement.closest(".option-label");
      selectedLabel.classList.add("selected");
      
      // リップル効果（最適化版）
      const ripple = selectedLabel.querySelector('.option-ripple');
      if (ripple) {
        ripple.style.animation = 'none';
        ripple.offsetHeight; // 強制リフロー（最小限）
        ripple.style.animation = 'ripple 0.6s ease-out';
      }
      
      // ハプティックフィードバック
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  }

  // 🚀 最適化版: ナビゲーションボタン更新
  updateNavigationButtonsOptimized() {
    const prevBtn = this.getCachedElement("#prev-btn");
    const nextBtn = this.getCachedElement("#next-btn");

    if (prevBtn) {
      prevBtn.disabled = this.currentQuestionIndex === 0;
    }

    if (nextBtn) {
      const currentQuestion = this.questions[this.currentQuestionIndex];
      const hasAnswer = this.checkCurrentQuestionAnswered(currentQuestion);

      nextBtn.disabled = !hasAnswer;

      // 🚀 最適化: DOM更新を最小限に
      this.updateButtonStateOptimized(nextBtn, hasAnswer);
    }
    
    // プログレス更新時の達成感演出（最適化版）
    this.updateProgressWithCelebrationOptimized();
  }

  // 🚀 新規: 現在の質問の回答状態を効率的にチェック
  checkCurrentQuestionAnswered(currentQuestion) {
    const currentAnswer = this.findAnswerByQuestionIdOptimized(currentQuestion.id);
    
    // シナリオ設問かどうかを判定
    const isScenario = currentQuestion.scenario && currentQuestion.inner_q && currentQuestion.outer_q;

    if (isScenario) {
      return currentAnswer && currentAnswer.innerChoice && currentAnswer.outerChoice;
    } else {
      return currentAnswer && currentAnswer.selectedValue;
    }
  }

  // 🚀 修正版: 最適化されたボタン状態更新
  updateButtonStateOptimized(nextBtn, hasAnswer) {
    const btnText = nextBtn.querySelector('.btn-text');
    const btnIcon = nextBtn.querySelector('.btn-icon');
    const isLastQuestion = this.currentQuestionIndex === this.questions.length - 1;
    
    console.log(`🔧 updateButtonStateOptimized: index=${this.currentQuestionIndex}, total=${this.questions.length}, isLast=${isLastQuestion}`);
    
    // 🚀 最適化: 変更が必要な場合のみDOM更新
    if (isLastQuestion) {
      console.log("🎯 最終質問です - 分析開始ボタンに変更");
      if (btnText && btnText.textContent !== "分析開始") {
        btnText.textContent = "分析開始";
      }
      if (btnIcon && btnIcon.textContent !== "🚀") {
        btnIcon.textContent = "🚀";
      }
      if (!nextBtn.classList.contains("btn-success")) {
        nextBtn.classList.add("btn-success");
        nextBtn.classList.remove("btn-primary");
      }
      
      if (hasAnswer) {
        this.showCompletionCelebrationOptimized();
      }
    } else {
      console.log("📋 通常の質問です - 次の質問ボタンを維持");
      if (btnText && btnText.textContent !== "次の質問") {
        btnText.textContent = "次の質問";
      }
      if (btnIcon && btnIcon.textContent !== "→") {
        btnIcon.textContent = "→";
      }
      if (nextBtn.classList.contains("btn-success")) {
        nextBtn.classList.remove("btn-success");
        nextBtn.classList.add("btn-primary");
      }
    }
    
    // 回答済みボタンのフィードバック（最適化版）
    if (hasAnswer && !nextBtn.classList.contains('answered')) {
      nextBtn.classList.add('answered');
      this.showAnswerFeedbackOptimized();
    }
  }

  // 🚀 新規: 最適化された完了チェック
  findAnswerByQuestionIdOptimized(questionId) {
    // キャッシュを活用した高速検索
    const cacheKey = `answer_${questionId}`;
    if (this.cachedElements.has(cacheKey)) {
      return this.cachedElements.get(cacheKey);
    }

    const answer = this.findAnswerIndexOptimized(questionId);
    if (answer >= 0) {
      const result = this.answers[answer];
      this.cachedElements.set(cacheKey, result);
      return result;
    }
    return null;
  }

  // 🚀 最適化版: 従来メソッドの互換性維持
  updateNavigationButtons() {
    this.updateNavigationButtonsOptimized();
  }

  // 🚀 最適化版: 完了お祝い表示
  showCompletionCelebrationOptimized() {
    const questionHeader = this.getCachedElement('.question-header');
    if (questionHeader && !questionHeader.classList.contains('celebration')) {
      questionHeader.classList.add('celebration');
      
      setTimeout(() => {
        questionHeader.classList.remove('celebration');
      }, 3000);
    }
  }

  // 🚀 互換性維持
  showCompletionCelebration() {
    this.showCompletionCelebrationOptimized();
  }

  // 🚀 最適化版: 回答フィードバック
  showAnswerFeedbackOptimized() {
    const completedCount = this.getCachedElement('.completed-count');
    if (completedCount) {
      const currentCount = parseInt(completedCount.textContent) || 0;
      const newCount = this.getCompletedCountOptimized();
      
      if (newCount !== currentCount) {
        this.updateCompletedCountOptimized(completedCount, newCount);
      }
    }
  }

  // 🚀 互換性維持
  showAnswerFeedback() {
    this.showAnswerFeedbackOptimized();
  }

  // 🚀 最適化版: プログレス達成感演出
  updateProgressWithCelebrationOptimized() {
    const answeredCount = this.getCompletedCountOptimized();
    const totalQuestions = this.questions.length;
    
    // マイルストーン到達の確認（25%, 50%, 75%, 100%）
    const milestones = [
      Math.floor(totalQuestions * 0.25),
      Math.floor(totalQuestions * 0.5),
      Math.floor(totalQuestions * 0.75),
      totalQuestions
    ];
    
    const reachedMilestone = milestones.find(milestone => 
      answeredCount === milestone && 
      !this.reachedMilestones?.includes(milestone)
    );
    
    if (reachedMilestone) {
      if (!this.reachedMilestones) this.reachedMilestones = [];
      this.reachedMilestones.push(reachedMilestone);
      this.showMilestoneReached(reachedMilestone, totalQuestions);
    }
  }

  // 🚀 互換性維持
  updateProgressWithCelebration() {
    this.updateProgressWithCelebrationOptimized();
  }

  showMilestoneReached(milestone, total) {
    const percentage = Math.round((milestone / total) * 100);
    const messages = {
      25: { text: "順調に進んでいます！", icon: "🌟" },
      50: { text: "半分完了しました！", icon: "⭐" },
      75: { text: "もう少しで完了です！", icon: "🚀" },
      100: { text: "すべて完了しました！", icon: "🎉" }
    };
    
    const message = messages[percentage] || { text: `${percentage}%完了！`, icon: "✨" };
    
    // トースト通知的な表示
    this.showToastMessage(`${message.icon} ${message.text}`);
  }

  showToastMessage(text) {
    // 既存のトーストがあれば削除
    const existingToast = document.querySelector('.progress-toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'progress-toast';
    toast.textContent = text;
    
    // プログレス表示エリアに追加
    const progressSection = this.container.querySelector('.progress-section');
    if (progressSection) {
      progressSection.appendChild(toast);
      
      // アニメーション付きで表示
      setTimeout(() => toast.classList.add('show'), 10);
      
      // 3秒後に削除
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  }

  // 🚀 最適化版: プログレス更新
  updateProgressOptimized() {
    const now = Date.now();
    
    // 🚀 最適化: 頻繁な更新を制限（60FPS以下）
    if (now - this.lastUpdateTime < 16) {
      return;
    }
    this.lastUpdateTime = now;

    const progressFill = this.getCachedElement(".progress-bar-fill");
    const currentNum = this.getCachedElement(".current-question");
    const totalNum = this.getCachedElement(".total-questions");
    const completedCount = this.getCachedElement('.completed-count');

    // 現在の質問番号を確実に計算
    const currentQuestionNum = this.currentQuestionIndex + 1;
    const totalQuestions = this.questions.length;
    const progressPercentage = (currentQuestionNum / totalQuestions) * 100;
    
    // 🚀 最適化: 完了数をキャッシュ活用で計算
    const actualCompletedCount = this.getCompletedCountOptimized();

    // 🚀 最適化: 変更が必要な場合のみDOM更新
    if (currentNum && currentNum.textContent !== currentQuestionNum.toString()) {
      currentNum.textContent = currentQuestionNum;
    }
    
    if (totalNum && totalNum.textContent !== `/ ${totalQuestions}`) {
      totalNum.textContent = `/ ${totalQuestions}`;
    }
    
    // 完了数の更新（最適化版）
    if (completedCount) {
      const currentDisplayed = parseInt(completedCount.textContent) || 0;
      if (actualCompletedCount !== currentDisplayed) {
        this.updateCompletedCountOptimized(completedCount, actualCompletedCount);
      }
    }

    if (progressFill) {
      const currentWidth = progressFill.style.width;
      const targetWidth = `${progressPercentage}%`;
      if (currentWidth !== targetWidth) {
        progressFill.style.width = targetWidth;
      }
    }

    // nav-dotの状態を更新（最適化版）
    this.updateNavigationDotsOptimized();
    
    // プログレスコールバック
    if (this.options.onProgress) {
      const answeredProgress = (actualCompletedCount / totalQuestions) * 100;
      this.options.onProgress(answeredProgress);
    }
  }

  // 🚀 新規: 最適化された完了数計算
  getCompletedCountOptimized() {
    // キャッシュが有効かチェック
    const currentTime = Date.now();
    if (this.completedCountCacheTime && (currentTime - this.completedCountCacheTime) < 100) {
      return this.completedCountCache;
    }

    // 完了数を計算
    let count = 0;
    for (let i = 0; i < this.answers.length; i++) {
      const answer = this.answers[i];
      if (answer && (answer.selectedValue || (answer.innerChoice && answer.outerChoice))) {
        count++;
      }
    }

    // キャッシュを更新
    this.completedCountCache = count;
    this.completedCountCacheTime = currentTime;
    
    return count;
  }

  // 🚀 新規: 最適化された完了数表示更新
  updateCompletedCountOptimized(element, newCount) {
    // requestAnimationFrameを使用してスムーズなアニメーション
    element.style.animation = 'none';
    element.offsetHeight; // 強制リフロー
    element.textContent = newCount;
    element.style.animation = 'countUp 0.3s ease-out';
  }

  // 🚀 最適化版: 従来メソッドの互換性維持
  updateProgress() {
    this.updateProgressOptimized();
  }
  
  // 🚀 最適化版: ナビゲーションドット更新
  updateNavigationDotsOptimized() {
    const navDots = this.container.querySelectorAll('.nav-dot');
    const totalDots = Math.min(this.questions.length, 10);
    
    // 🚀 最適化: 完了状態をキャッシュから取得
    const completedQuestions = this.getCompletedCountOptimized();
    
    navDots.forEach((dot, index) => {
      const questionIndex = Math.floor((index / (totalDots - 1)) * (this.questions.length - 1));
      
      // 🚀 最適化: キャッシュ活用で完了状態チェック
      const isCompleted = this.findAnswerByQuestionIdOptimized(this.questions[questionIndex]?.id) !== null;
      const isCurrent = questionIndex === this.currentQuestionIndex;
      
      // 🚀 最適化: 変更が必要な場合のみクラス更新
      const expectedClass = `nav-dot ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`;
      if (dot.className !== expectedClass) {
        dot.className = expectedClass;
      }
    });
  }

  // 🚀 互換性維持
  updateNavigationDots() {
    this.updateNavigationDotsOptimized();
  }

  goToPrevious() {
    console.log(`🔙 goToPrevious: from ${this.currentQuestionIndex} to ${this.currentQuestionIndex - 1}`);
    
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      
      // 🚀 最適化: キャッシュをクリアして再レンダリング
      this.clearElementCache();
      
      this.renderCurrentQuestion();
      this.bindNavigationEvents();
      this.updateNavigationButtons();
      this.updateProgress();

      // 進行状況をストレージに保存
      if (this.storageManager) {
        const completedCount = this.getCompletedQuestionsCount();
        this.storageManager.saveProgress({
          currentQuestionIndex: this.currentQuestionIndex,
          totalQuestions: this.questions.length,
          completedQuestions: completedCount,
        });
      }
      
      console.log(`✅ goToPrevious completed: now at index ${this.currentQuestionIndex}`);
    } else {
      console.log("⚠️ goToPrevious: already at first question");
    }
  }

  goToNext() {
    const isLastQuestion = this.currentQuestionIndex === this.questions.length - 1;
    console.log(`🔜 goToNext: from ${this.currentQuestionIndex}, isLast=${isLastQuestion}`);
    
    if (!isLastQuestion) {
      this.currentQuestionIndex++;
      
      // 🚀 最適化: キャッシュをクリアして再レンダリング
      this.clearElementCache();
      
      this.renderCurrentQuestion();
      this.bindNavigationEvents();
      this.updateNavigationButtons();
      this.updateProgress();

      // 進行状況をストレージに保存
      if (this.storageManager) {
        const completedCount = this.getCompletedQuestionsCount();
        this.storageManager.saveProgress({
          currentQuestionIndex: this.currentQuestionIndex,
          totalQuestions: this.questions.length,
          completedQuestions: completedCount,
        });
      }
      
      console.log(`✅ goToNext completed: now at index ${this.currentQuestionIndex}`);
    } else {
      // 最後の質問 - 分析開始
      console.log("🎯 最終質問です - 分析を開始します");
      this.completeQuestions();
    }
  }

  // 🚀 最適化版: 質問完了処理
  completeQuestions() {
    try {
      console.log("🔍 Starting optimized question completion check...");

      // 🚀 最適化: 非同期処理で完了チェック
      this.showLoadingState();
      
      // 🚀 最適化: Web Workerまたは非同期チェックで処理
      setTimeout(() => {
        this.performCompletionCheckAsync();
      }, 100); // UI更新を先に行ってからチェック実行

    } catch (error) {
      console.error("❌ Error during question completion:", error);
      this.hideLoadingState();
      alert(
        "質問完了チェック中にエラーが発生しました。ページを再読み込みして再度お試しください。"
      );
    }
  }

  // 🚀 新規: ローディング状態表示
  showLoadingState() {
    const nextBtn = this.getCachedElement("#next-btn");
    if (nextBtn) {
      const btnText = nextBtn.querySelector('.btn-text');
      const btnIcon = nextBtn.querySelector('.btn-icon');
      
      if (btnText) {
        btnText.dataset.originalText = btnText.textContent;
        btnText.textContent = "分析中...";
      }
      if (btnIcon) {
        btnIcon.dataset.originalIcon = btnIcon.textContent;
        btnIcon.textContent = "⚡";
      }
      
      nextBtn.disabled = true;
      nextBtn.classList.add('loading');
    }
  }

  // 🚀 新規: ローディング状態解除
  hideLoadingState() {
    const nextBtn = this.getCachedElement("#next-btn");
    if (nextBtn) {
      const btnText = nextBtn.querySelector('.btn-text');
      const btnIcon = nextBtn.querySelector('.btn-icon');
      
      if (btnText && btnText.dataset.originalText) {
        btnText.textContent = btnText.dataset.originalText;
        delete btnText.dataset.originalText;
      }
      if (btnIcon && btnIcon.dataset.originalIcon) {
        btnIcon.textContent = btnIcon.dataset.originalIcon;
        delete btnIcon.dataset.originalIcon;
      }
      
      nextBtn.disabled = false;
      nextBtn.classList.remove('loading');
    }
  }

  // 🚀 新規: 非同期完了チェック
  async performCompletionCheckAsync() {
    try {
      // 🚀 最適化: 軽量な完了チェック
      const completionResult = await this.checkAllQuestionsAnsweredOptimized();

      if (completionResult.isComplete) {
        console.log("✅ All questions completed:", this.answers.length, "answers");
        
        // 🚀 最適化: 成功時の即座フィードバック
        this.showSuccessAnimation();
        
        // 分析処理を非同期で開始
        await this.proceedToAnalysisAsync();
        
      } else {
        this.hideLoadingState();
        this.showIncompleteQuestionsError(completionResult.missing);
      }
    } catch (error) {
      console.error("❌ Error during async completion check:", error);
      this.hideLoadingState();
      alert("完了チェックでエラーが発生しました。再度お試しください。");
    }
  }

  // 🚀 新規: 最適化された完了チェック
  async checkAllQuestionsAnsweredOptimized() {
    return new Promise((resolve) => {
      // 🚀 最適化: requestIdleCallbackを使用して負荷を分散
      const performCheck = () => {
        const missing = [];
        let checkedCount = 0;
        
        for (let i = 0; i < this.questions.length; i++) {
          const question = this.questions[i];
          const answer = this.findAnswerByQuestionIdOptimized(question.id);
          
          if (!this.validateQuestionCompletionOptimized(question, answer)) {
            missing.push(`${question.id}: 未完了`);
          }
          
          checkedCount++;
          
          // 🚀 最適化: バッチ処理で負荷分散
          if (checkedCount % 5 === 0) {
            // 5問ごとにイベントループに制御を戻す
            setTimeout(() => {
              if (checkedCount < this.questions.length) {
                return; // 続行
              }
              resolve({
                isComplete: missing.length === 0,
                missing: missing,
                totalChecked: checkedCount
              });
            }, 0);
            return;
          }
        }
        
        resolve({
          isComplete: missing.length === 0,
          missing: missing,
          totalChecked: checkedCount
        });
      };

      if (window.requestIdleCallback) {
        requestIdleCallback(performCheck, { timeout: 2000 });
      } else {
        setTimeout(performCheck, 0);
      }
    });
  }

  // 🚀 新規: 最適化された質問完了検証
  validateQuestionCompletionOptimized(question, answer) {
    if (!answer) return false;

    const isScenario = question.scenario && question.inner_q && question.outer_q;
    
    if (isScenario) {
      return answer.innerChoice && answer.outerChoice && 
             answer.innerChoice.value && answer.outerChoice.value;
    } else {
      return answer.selectedValue;
    }
  }

  // 🚀 新規: 成功アニメーション
  showSuccessAnimation() {
    const questionHeader = this.getCachedElement('.question-header');
    if (questionHeader) {
      questionHeader.classList.add('completion-success');
      setTimeout(() => {
        questionHeader.classList.remove('completion-success');
      }, 2000);
    }
  }

  // 🚀 新規: 非同期分析開始
  async proceedToAnalysisAsync() {
    try {
      if (this.options.onComplete) {
        // 🚀 最適化: コールバックを非同期実行
        setTimeout(() => {
          this.options.onComplete(this.answers);
        }, 500); // UIアニメーションの完了を待つ
      } else {
        // デフォルトの処理: グローバル関数を非同期呼び出し
        if (typeof proceedToAnalysis === "function") {
          setTimeout(() => {
            proceedToAnalysis(this.answers);
          }, 500);
        } else {
          console.warn("⚠️ No completion handler found");
          this.hideLoadingState();
          alert("完了処理が見つかりません。ページを再読み込みしてください。");
        }
      }
    } catch (error) {
      console.error("❌ Error proceeding to analysis:", error);
      this.hideLoadingState();
      alert("分析開始でエラーが発生しました。再度お試しください。");
    }
  }

  // 🚀 新規: 未完了質問エラー表示
  showIncompleteQuestionsError(missing) {
    const missingCount = missing.length;
    const scenarioMissing = missing.filter(
      (m) => m.includes("内面") || m.includes("外面")
    ).length;
    const regularMissing = missingCount - scenarioMissing;

    let errorMessage = `すべての質問にお答えください。\n`;
    if (regularMissing > 0) {
      errorMessage += `未回答の質問: ${regularMissing}問\n`;
    }
    if (scenarioMissing > 0) {
      errorMessage += `未完了のシナリオ質問: ${Math.ceil(scenarioMissing / 2)}問\n`;
    }
    
    alert(errorMessage);
  }

  // 質問IDによる回答検索（堅牢な検索ロジック）
  findAnswerByQuestionId(questionId) {
    // より堅牢な検索ロジック
    const answer = this.answers.find((a) => {
      // 厳密な一致チェック
      if (a.questionId === questionId) return true;

      // 型変換による一致チェック（文字列 vs 数値等）
      if (String(a.questionId) === String(questionId)) return true;

      return false;
    });

    if (!answer) {
      console.warn(`⚠️ No answer found for question ${questionId}`);
      console.warn(
        "Available answer IDs:",
        this.answers.map((a) => a.questionId)
      );
    }

    return answer;
  }

  // 個別質問の完了状態検証
  validateQuestionCompletion(question, answer) {
    if (!answer) {
      return {
        isComplete: false,
        reason: `${question.id}: 回答なし`,
      };
    }

    // シナリオ質問の場合
    const isScenario =
      question.scenario && question.inner_q && question.outer_q;
    if (isScenario) {
      if (!answer.innerChoice) {
        return {
          isComplete: false,
          reason: `${question.id}: 内面選択肢未回答`,
        };
      }
      if (!answer.outerChoice) {
        return {
          isComplete: false,
          reason: `${question.id}: 外面選択肢未回答`,
        };
      }

      // 選択肢の値も確認
      if (!answer.innerChoice.value) {
        return {
          isComplete: false,
          reason: `${question.id}: 内面選択肢の値が空`,
        };
      }
      if (!answer.outerChoice.value) {
        return {
          isComplete: false,
          reason: `${question.id}: 外面選択肢の値が空`,
        };
      }
    } else {
      // 通常質問の場合
      if (!answer.selectedValue) {
        return {
          isComplete: false,
          reason: `${question.id}: 選択肢未回答`,
        };
      }
    }

    return {
      isComplete: true,
      reason: null,
    };
  }

  // 全質問の回答完了チェック（強化版）
  checkAllQuestionsAnswered() {
    const missing = [];
    const debugInfo = {
      totalQuestions: this.questions.length,
      totalAnswers: this.answers.length,
      questionIds: this.questions.map((q) => q.id),
      answerIds: this.answers.map((a) => a.questionId),
      missingDetails: [],
    };

    for (let i = 0; i < this.questions.length; i++) {
      const question = this.questions[i];
      const answer = this.findAnswerByQuestionId(question.id);

      const validationResult = this.validateQuestionCompletion(
        question,
        answer
      );

      if (!validationResult.isComplete) {
        missing.push(validationResult.reason);
        debugInfo.missingDetails.push({
          questionId: question.id,
          reason: validationResult.reason,
          answerFound: !!answer,
          answerData: answer ? this.sanitizeAnswerForDebug(answer) : null,
        });
      }
    }

    // デバッグ情報の出力
    if (missing.length > 0) {
      this.logCompletionDebugInfo(debugInfo);
    }

    return {
      isComplete: missing.length === 0,
      missing: missing,
      debugInfo: debugInfo,
    };
  }

  // デバッグ情報のログ出力
  logCompletionDebugInfo(debugInfo) {
    console.group("🔍 Question Completion Debug Info");
    console.log("📊 Summary:", {
      totalQuestions: debugInfo.totalQuestions,
      totalAnswers: debugInfo.totalAnswers,
      missingCount: debugInfo.missingDetails.length,
    });

    console.log("📝 Question IDs:", debugInfo.questionIds);
    console.log("💾 Answer IDs:", debugInfo.answerIds);

    if (debugInfo.missingDetails.length > 0) {
      console.group("❌ Missing Details");
      debugInfo.missingDetails.forEach((detail) => {
        console.log(`${detail.questionId}:`, detail);
      });
      console.groupEnd();
    }

    console.groupEnd();
  }

  // 🚀 最適化版: 完了した質問数を正確にカウント
  getCompletedQuestionsCount() {
    return this.getCompletedCountOptimized();
  }

  // デバッグ用に回答データをサニタイズ
  sanitizeAnswerForDebug(answer) {
    return {
      questionId: answer.questionId,
      hasSelectedValue: !!answer.selectedValue,
      hasInnerChoice: !!answer.innerChoice,
      hasOuterChoice: !!answer.outerChoice,
      innerChoiceValue: answer.innerChoice ? answer.innerChoice.value : null,
      outerChoiceValue: answer.outerChoice ? answer.outerChoice.value : null,
      selectedValue: answer.selectedValue,
    };
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== "undefined") {
  window.QuestionFlow = QuestionFlow;
}
