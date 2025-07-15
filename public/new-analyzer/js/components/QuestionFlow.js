// QuestionFlow.js - 質問フローUIコンポーネント（雛形）
// HaQei Analyzer - Question Flow Component
class QuestionFlow extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.currentQuestionIndex = 0; // 明示的に0に設定
    this.answers = [];
    this.questions = [];
    console.log(
      "🔧 QuestionFlow constructor: currentQuestionIndex =",
      this.currentQuestionIndex
    );
  }

  init() {
    this.loadQuestions();
    console.log(
      `🎯 QuestionFlow initialized with ${this.questions.length} questions`
    );
    console.log("🔧 Current question index:", this.currentQuestionIndex);
    super.init();
  }

  loadQuestions() {
    // 価値観設問を読み込み
    this.questions = WORLDVIEW_QUESTIONS || [];
    console.log("📝 Loaded questions:", this.questions.length);

    // 念の為、インデックスを再初期化
    this.currentQuestionIndex = 0;
    console.log("🔧 Reset currentQuestionIndex to:", this.currentQuestionIndex);
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

    console.log("📝 Rendering question:", question.id, question.text);

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

    // 既存の回答があれば選択状態を復元
    const existingAnswer = this.answers.find(
      (a) => a.questionId === question.id
    );
    if (existingAnswer) {
      const radio = questionDisplay.querySelector(
        `input[value="${existingAnswer.selectedValue}"]`
      );
      if (radio) {
        radio.checked = true;
        this.updateNavigationButtons();
      }
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

    // 回答を保存
    const answerIndex = this.answers.findIndex(
      (a) => a.questionId === question.id
    );
    const answer = {
      questionId: question.id,
      selectedValue: selectedValue,
      scoring_tags: scoringTags,
    };

    if (answerIndex >= 0) {
      this.answers[answerIndex] = answer;
    } else {
      this.answers.push(answer);
    }

    this.updateNavigationButtons();
    this.updateProgress();

    // 選択肢にアクティブスタイルを追加
    this.container.querySelectorAll(".option-label").forEach((label) => {
      label.classList.remove("selected");
    });
    radioElement.closest(".option-label").classList.add("selected");
  }

  updateNavigationButtons() {
    const prevBtn = this.container.querySelector("#prev-btn");
    const nextBtn = this.container.querySelector("#next-btn");

    if (prevBtn) {
      prevBtn.disabled = this.currentQuestionIndex === 0;
    }

    if (nextBtn) {
      const currentQuestion = this.questions[this.currentQuestionIndex];
      const hasAnswer = this.answers.some(
        (a) => a.questionId === currentQuestion.id
      );
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
    }
  }

  goToNext() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
      this.updateNavigationButtons();
      this.updateProgress();
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
      }
    } else {
      alert("すべての質問にお答えください。");
    }
  }
}
