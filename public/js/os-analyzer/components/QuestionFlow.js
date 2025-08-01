// QuestionFlow.js - 質問フローUIコンポーネント
// HaQei Analyzer - Question Flow Component

class QuestionFlow extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.currentQuestionIndex = 0;
    this.answers = []; // 必ず配列として初期化
    this.questions = [];
    this.storageManager = options.storageManager || null;
    this.changeEventBound = false; // イベント重複防止フラグ
    
    // 軽量化されたキャッシュ
    this.completedCountCache = 0;
    this.completedCountCacheTime = 0;
    
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
    // answers配列の初期化を保証
    if (!Array.isArray(this.answers)) {
      this.answers = [];
    }
    
    if (this.storageManager) {
      const savedAnswers = this.storageManager.getAnswers();
      const savedProgress = this.storageManager.getProgress();

      if (savedAnswers && Array.isArray(savedAnswers) && savedAnswers.length > 0) {
        this.answers = savedAnswers;
        console.log("📋 Loaded previous answers:", this.answers.length);
      } else {
        this.answers = [];
        console.log("📋 No previous answers found, initialized empty array");
      }

      if (savedProgress) {
        this.currentQuestionIndex = savedProgress.currentQuestionIndex || 0;
        console.log("🔄 Restored progress:", this.currentQuestionIndex);
      }
    } else {
      this.answers = [];
      console.log("📋 No storageManager, initialized empty answers array");
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
      // 軽量化: キャッシュクリア不要
    
    if (this.questions.length === 0) {
      this.container.innerHTML =
        '<div class="error">設問データが読み込めませんでした。</div>';
      return;
    }

    // 現在の質問番号を確実に計算
    const currentQuestionNum = this.currentQuestionIndex + 1;
    const totalQuestions = this.questions.length;
    const progressPercentage = (currentQuestionNum / totalQuestions) * 100;
    const completedQuestions = this.getCompletedCount();
    
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

    // アニメーション設定（ナビドット削除のため、他のアニメーション要素のみ対象）
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

  // 軽量化版 handleAnswerChange
  handleAnswerChange(radioElement) {
    try {
      const question = this.questions[this.currentQuestionIndex];
      if (!question) {
        console.error("❌ Question not found", this.currentQuestionIndex);
        return;
      }

      const selectedValue = radioElement.value;
      const scoringTags = JSON.parse(radioElement.dataset.scoring || "[]");
      const choiceType = radioElement.dataset.choiceType;

      if (!selectedValue) {
        console.error("❌ Invalid selectedValue");
        return;
      }

      // 直接処理（デバウンス削除）
      this.processAnswerUpdate(question, selectedValue, scoringTags, choiceType, radioElement);

    } catch (error) {
      console.error("❌ Error in handleAnswerChange:", error);
      alert("回答の保存中にエラーが発生しました。");
    }
  }


  // 軽量化版 processAnswerUpdate
  processAnswerUpdate(question, selectedValue, scoringTags, choiceType, radioElement) {
    const isScenario = question.scenario && question.inner_q && question.outer_q;
    let answerIndex = this.findAnswerIndex(question.id);
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
      }
    } else {
      answer.selectedValue = selectedValue;
      answer.scoring_tags = scoringTags;
    }

    this.answers[answerIndex] = answer;

    // 直接ストレージ保存
    if (this.storageManager) {
      this.storageManager.saveAnswers(this.answers);
    }

    // UI更新
    this.updateNavigationButtons();
    this.updateProgress();
    this.updateVisualFeedback(radioElement, choiceType);
  }

  // シンプルな回答検索
  findAnswerIndex(questionId) {
    for (let i = 0; i < this.answers.length; i++) {
      if (this.answers[i].questionId === questionId) {
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

  // 軽量化版 updateVisualFeedback
  updateVisualFeedback(radioElement, choiceType) {
    const choiceSection = choiceType
      ? radioElement.closest(".choice-section")
      : radioElement.closest(".question-item");

    if (choiceSection) {
      const labels = choiceSection.querySelectorAll(".option-label");
      labels.forEach(label => label.classList.remove("selected"));
      
      const selectedLabel = radioElement.closest(".option-label");
      selectedLabel.classList.add("selected");
      
      // シンプルなフィードバック
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    }
  }

  // 軽量化版 updateNavigationButtons
  updateNavigationButtons() {
    const prevBtn = this.container.querySelector("#prev-btn");
    const nextBtn = this.container.querySelector("#next-btn");

    if (prevBtn) {
      prevBtn.disabled = this.currentQuestionIndex === 0;
    }

    if (nextBtn) {
      const currentQuestion = this.questions[this.currentQuestionIndex];
      const hasAnswer = this.checkCurrentQuestionAnswered(currentQuestion);
      nextBtn.disabled = !hasAnswer;

      // ボタン状態更新
      this.updateButtonState(nextBtn, hasAnswer);
    }
  }

  // 軽量化版 checkCurrentQuestionAnswered
  checkCurrentQuestionAnswered(currentQuestion) {
    const currentAnswer = this.findAnswerByQuestionId(currentQuestion.id);
    const isScenario = currentQuestion.scenario && currentQuestion.inner_q && currentQuestion.outer_q;

    if (isScenario) {
      return currentAnswer && currentAnswer.innerChoice && currentAnswer.outerChoice;
    } else {
      return currentAnswer && currentAnswer.selectedValue;
    }
  }

  // 軽量化版 updateButtonState
  updateButtonState(nextBtn, hasAnswer) {
    const btnText = nextBtn.querySelector('.btn-text');
    const btnIcon = nextBtn.querySelector('.btn-icon');
    const isLastQuestion = this.currentQuestionIndex === this.questions.length - 1;
    
    if (isLastQuestion) {
      if (btnText) btnText.textContent = "分析開始";
      if (btnIcon) btnIcon.textContent = "🚀";
      nextBtn.classList.add("btn-success");
      nextBtn.classList.remove("btn-primary");
    } else {
      if (btnText) btnText.textContent = "次の質問";
      if (btnIcon) btnIcon.textContent = "→";
      nextBtn.classList.remove("btn-success");
      nextBtn.classList.add("btn-primary");
    }
  }




  
  // 軽量化版 updateProgress
  updateProgress() {
    const progressFill = this.container.querySelector(".progress-bar-fill");
    const currentNum = this.container.querySelector(".current-question");
    const totalNum = this.container.querySelector(".total-questions");
    const completedCount = this.container.querySelector('.completed-count');

    const currentQuestionNum = this.currentQuestionIndex + 1;
    const totalQuestions = this.questions.length;
    const progressPercentage = (currentQuestionNum / totalQuestions) * 100;
    const actualCompletedCount = this.getCompletedCount();

    if (currentNum) currentNum.textContent = currentQuestionNum;
    if (totalNum) totalNum.textContent = `/ ${totalQuestions}`;
    if (completedCount) completedCount.textContent = actualCompletedCount;
    if (progressFill) progressFill.style.width = `${progressPercentage}%`;

    // プログレスコールバック
    if (this.options.onProgress) {
      const answeredProgress = (actualCompletedCount / totalQuestions) * 100;
      this.options.onProgress(answeredProgress);
    }
  }

  // 軽量化版 getCompletedCount
  getCompletedCount() {
    let count = 0;
    for (let i = 0; i < this.answers.length; i++) {
      const answer = this.answers[i];
      if (answer && (answer.selectedValue || (answer.innerChoice && answer.outerChoice))) {
        count++;
      }
    }
    return count;
  }


  goToPrevious() {
    console.log(`🔙 goToPrevious: from ${this.currentQuestionIndex} to ${this.currentQuestionIndex - 1}`);
    
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      
      // 軽量化: キャッシュクリア不要
      
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
      
      // 軽量化: キャッシュクリア不要
      
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

  // 軽量化版 completeQuestions
  completeQuestions() {
    try {
      console.log("🔍 Starting question completion check...");
      
      // 簡素なローディング表示
      this.showLoadingState();
      
      // 直接チェック実行
      const completionResult = this.checkAllQuestionsAnswered();
      
      if (completionResult.isComplete) {
        console.log("✅ All questions completed:", this.answers.length, "answers");
        this.proceedToAnalysis();
      } else {
        console.log("❌ Questions incomplete:", completionResult.missing);
        this.hideLoadingState();
        this.showIncompleteQuestionsError(completionResult.missing);
      }
    } catch (error) {
      console.error("❌ Error during question completion:", error);
      this.hideLoadingState();
      alert("質問完了チェック中にエラーが発生しました。");
    }
  }

  // 軽量化版 showLoadingState
  showLoadingState() {
    const nextBtn = this.container.querySelector("#next-btn");
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

  // 軽量化版 hideLoadingState
  hideLoadingState() {
    const nextBtn = this.container.querySelector("#next-btn");
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

  // 軽量化版 proceedToAnalysis
  proceedToAnalysis() {
    try {
      console.log("🚀 proceedToAnalysis: Starting analysis transition");
      
      if (this.options.onComplete) {
        console.log("📞 Calling options.onComplete with", this.answers.length, "answers");
        this.options.onComplete(this.answers);
      } else if (typeof proceedToAnalysis === "function") {
        console.log("📞 Calling global proceedToAnalysis with", this.answers.length, "answers");
        proceedToAnalysis(this.answers);
      } else {
        console.warn("⚠️ No completion handler found");
        this.hideLoadingState();
        alert("完了処理が見つかりません。");
      }
    } catch (error) {
      console.error("❌ Error proceeding to analysis:", error);
      this.hideLoadingState();
      alert("分析開始でエラーが発生しました。");
    }
  }


  // 軽量化版 showIncompleteQuestionsError
  showIncompleteQuestionsError(missing) {
    const missingCount = missing.length;
    alert(`すべての質問にお答えください。\n未完了の質問: ${missingCount}問`);
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

  // 軽量化版 getCompletedQuestionsCount
  getCompletedQuestionsCount() {
    return this.getCompletedCount();
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
