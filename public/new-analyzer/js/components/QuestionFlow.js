// QuestionFlow.js - 質問フローUIコンポーネント（雛形）
// HaQei Analyzer - Question Flow Component
class QuestionFlow extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.currentQuestionIndex = 0; // 明示的に0に設定
    this.answers = [];
    this.questions = [];
    this.storageManager = options.storageManager || null;
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
    if (typeof WORLDVIEW_QUESTIONS === 'undefined') {
      console.error('❌ WORLDVIEW_QUESTIONS is not defined');
      this.questions = [];
      return;
    }
    
    if (typeof SCENARIO_QUESTIONS === 'undefined') {
      console.error('❌ SCENARIO_QUESTIONS is not defined');
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
    if (this.questions.length === 0) {
      this.container.innerHTML =
        '<div class="error">設問データが読み込めませんでした。</div>';
      return;
    }

    // 現在の質問番号を確実に計算
    const currentQuestionNum = this.currentQuestionIndex + 1;
    const totalQuestions = this.questions.length;
    const progressPercentage = (currentQuestionNum / totalQuestions) * 100;

    console.log(
      `📊 Rendering: Question ${currentQuestionNum} of ${totalQuestions}`
    );

    this.container.innerHTML = `
      <div class="question-flow-container">
        <div class="question-header">
          <div class="progress-info">
            <span class="current-question">${currentQuestionNum}</span>
            <span class="total-questions">/ ${totalQuestions}</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${progressPercentage}%"></div>
          </div>
        </div>

        <div class="question-content">
          <div id="question-display">
            <!-- 質問がここに表示される -->
          </div>
        </div>

        <div class="question-navigation">
          <button id="prev-btn" class="btn btn-secondary" ${
            this.currentQuestionIndex === 0 ? "disabled" : ""
          }>
            前の質問
          </button>
          <button id="next-btn" class="btn btn-primary" disabled>
            次の質問
          </button>
        </div>
      </div>
    `;

    this.renderCurrentQuestion();
    this.bindEvents();
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

    console.log("📝 Rendering question:", question.id, question.text || question.scenario);

    // シナリオ設問かどうかを判定
    const isScenario = question.scenario && question.inner_q && question.outer_q;

    if (isScenario) {
      // シナリオ設問の場合：inner/outer選択肢を表示
      questionDisplay.innerHTML = `
        <div class="question-item scenario-question">
          <div class="scenario-context">
            <h3 class="scenario-title">状況設定</h3>
            <p class="scenario-text">${question.scenario}</p>
          </div>
          
          <div class="scenario-choices">
            <div class="choice-section inner-choice">
              <h4 class="choice-title">${question.inner_q}</h4>
              <div class="question-options">
                ${question.options.inner
                  .map(
                    (option) => `
                  <label class="option-label">
                    <input type="radio" name="inner-${question.id}" value="${
                      option.value
                    }" 
                           data-scoring='${JSON.stringify(option.scoring_tags)}'
                           data-choice-type="inner">
                    <div class="option-content">
                      <span class="option-text">${option.text}</span>
                    </div>
                  </label>
                `
                  )
                  .join("")}
              </div>
            </div>
            
            <div class="choice-section outer-choice">
              <h4 class="choice-title">${question.outer_q}</h4>
              <div class="question-options">
                ${question.options.outer
                  .map(
                    (option) => `
                  <label class="option-label">
                    <input type="radio" name="outer-${question.id}" value="${
                      option.value
                    }" 
                           data-scoring='${JSON.stringify(option.scoring_tags)}'
                           data-choice-type="outer">
                    <div class="option-content">
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
        <div class="question-item">
          <h3 class="question-title">${question.text}</h3>
          <div class="question-options">
            ${question.options
              .map(
                (option) => `
              <label class="option-label">
                <input type="radio" name="question-${question.id}" value="${
                  option.value
                }" 
                       data-scoring='${JSON.stringify(option.scoring_tags)}'>
                <div class="option-content">
                  <span class="option-text">${option.text}</span>
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

  // 既存回答の復元
  restoreExistingAnswers(question, isScenario) {
    const existingAnswer = this.answers.find(
      (a) => a.questionId === question.id
    );
    
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
    // 選択肢変更イベント
    this.container.addEventListener("change", (e) => {
      if (e.target.type === "radio") {
        this.handleAnswerChange(e.target);
      }
    });

    // ナビゲーションボタン
    const prevBtn = this.container.querySelector("#prev-btn");
    const nextBtn = this.container.querySelector("#next-btn");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => this.goToPrevious());
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.goToNext());
    }
  }

  handleAnswerChange(radioElement) {
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
    const scoringTags = JSON.parse(radioElement.dataset.scoring);
    const choiceType = radioElement.dataset.choiceType; // inner/outer/undefined

    // シナリオ設問かどうかを判定
    const isScenario = question.scenario && question.inner_q && question.outer_q;

    // 既存の回答を取得または作成
    let answerIndex = this.answers.findIndex(
      (a) => a.questionId === question.id
    );
    
    let answer;
    if (answerIndex >= 0) {
      answer = this.answers[answerIndex];
    } else {
      answer = { questionId: question.id };
      this.answers.push(answer);
      answerIndex = this.answers.length - 1;
    }

    if (isScenario) {
      // シナリオ設問の場合：inner/outerを個別に保存
      if (choiceType === 'inner') {
        answer.innerChoice = {
          value: selectedValue,
          scoring_tags: scoringTags
        };
        console.log(`💭 Inner choice saved for ${question.id}:`, answer.innerChoice);
      } else if (choiceType === 'outer') {
        answer.outerChoice = {
          value: selectedValue,
          scoring_tags: scoringTags
        };
        console.log(`👥 Outer choice saved for ${question.id}:`, answer.outerChoice);
      }
    } else {
      // 通常の価値観設問の場合
      answer.selectedValue = selectedValue;
      answer.scoring_tags = scoringTags;
      console.log(`📝 Answer saved for ${question.id}:`, answer);
    }

    // 回答を更新
    this.answers[answerIndex] = answer;

    // ストレージに保存
    if (this.storageManager) {
      this.storageManager.saveAnswers(this.answers);
    }

    this.updateNavigationButtons();
    this.updateProgress();

    // 選択肢にアクティブスタイルを追加
    const choiceSection = choiceType ? 
      radioElement.closest('.choice-section') : 
      radioElement.closest('.question-item');
    
    if (choiceSection) {
      choiceSection.querySelectorAll(".option-label").forEach((label) => {
        label.classList.remove("selected");
      });
      radioElement.closest(".option-label").classList.add("selected");
    }
  }

  updateNavigationButtons() {
    const prevBtn = this.container.querySelector("#prev-btn");
    const nextBtn = this.container.querySelector("#next-btn");

    if (prevBtn) {
      prevBtn.disabled = this.currentQuestionIndex === 0;
    }

    if (nextBtn) {
      const currentQuestion = this.questions[this.currentQuestionIndex];
      const currentAnswer = this.answers.find(
        (a) => a.questionId === currentQuestion.id
      );
      
      // シナリオ設問かどうかを判定
      const isScenario = currentQuestion.scenario && currentQuestion.inner_q && currentQuestion.outer_q;
      
      let hasAnswer = false;
      if (isScenario) {
        // シナリオ設問の場合：inner/outerの両方が選択されている必要がある
        hasAnswer = currentAnswer && 
                   currentAnswer.innerChoice && 
                   currentAnswer.outerChoice;
      } else {
        // 通常設問の場合：selectedValueが存在する必要がある
        hasAnswer = currentAnswer && currentAnswer.selectedValue;
      }
      
      nextBtn.disabled = !hasAnswer;

      // 最後の質問の場合はボタンテキストを変更
      if (this.currentQuestionIndex === this.questions.length - 1) {
        nextBtn.textContent = "分析開始";
        nextBtn.classList.add("btn-success");
      } else {
        nextBtn.textContent = "次の質問";
        nextBtn.classList.remove("btn-success");
      }
    }
  }

  updateProgress() {
    const progressFill = this.container.querySelector(".progress-bar-fill");
    const currentNum = this.container.querySelector(".current-question");
    const totalNum = this.container.querySelector(".total-questions");

    // 現在の質問番号を確実に計算
    const currentQuestionNum = this.currentQuestionIndex + 1;
    const totalQuestions = this.questions.length;
    const progressPercentage = (currentQuestionNum / totalQuestions) * 100;

    console.log(
      `📊 Progress update: ${currentQuestionNum}/${totalQuestions} (${progressPercentage.toFixed(
        1
      )}%)`
    );

    if (progressFill) {
      progressFill.style.width = `${progressPercentage}%`;
    }

    if (currentNum) {
      currentNum.textContent = currentQuestionNum;
    }

    if (totalNum) {
      totalNum.textContent = `/ ${totalQuestions}`;
    }

    // プログレスコールバック
    if (this.options.onProgress) {
      const answeredCount = this.answers.length;
      const answeredProgress = (answeredCount / totalQuestions) * 100;
      this.options.onProgress(answeredProgress);
    }
  }

  goToPrevious() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
      this.updateNavigationButtons();
      this.updateProgress();
      
      // 進行状況をストレージに保存
      if (this.storageManager) {
        this.storageManager.saveProgress({
          currentQuestionIndex: this.currentQuestionIndex,
          totalQuestions: this.questions.length,
          completedQuestions: this.answers.length
        });
      }
    }
  }

  goToNext() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
      this.updateNavigationButtons();
      this.updateProgress();
      
      // 進行状況をストレージに保存
      if (this.storageManager) {
        this.storageManager.saveProgress({
          currentQuestionIndex: this.currentQuestionIndex,
          totalQuestions: this.questions.length,
          completedQuestions: this.answers.length
        });
      }
    } else {
      // 最後の質問 - 分析開始
      this.completeQuestions();
    }
  }

  completeQuestions() {
    if (this.answers.length === this.questions.length) {
      console.log("✅ All questions completed:", this.answers);

      if (this.options.onComplete) {
        this.options.onComplete(this.answers);
      } else {
        // デフォルトの処理: グローバル関数を呼び出し
        if (typeof proceedToAnalysis === 'function') {
          proceedToAnalysis(this.answers);
        } else {
          console.warn('⚠️ No completion handler found');
        }
      }
    } else {
      const unansweredQuestions = this.questions.length - this.answers.length;
      alert(`すべての質問にお答えください。未回答: ${unansweredQuestions}問`);
    }
  }
}
