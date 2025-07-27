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
    if (this.questions.length === 0) {
      this.container.innerHTML =
        '<div class="error">設問データが読み込めませんでした。</div>';
      return;
    }

    // 現在の質問番号を確実に計算
    const currentQuestionNum = this.currentQuestionIndex + 1;
    const totalQuestions = this.questions.length;
    const progressPercentage = (currentQuestionNum / totalQuestions) * 100;
    const completedQuestions = this.answers.filter(answer => {
      if (!answer) return false;
      return answer.selectedValue || (answer.innerChoice && answer.outerChoice);
    }).length;
    
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
      // 既存のイベントリスナーを削除してから新しいものを追加
      const newPrevBtn = prevBtn.cloneNode(true);
      prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
      newPrevBtn.addEventListener("click", () => this.goToPrevious());
    }

    if (nextBtn) {
      // 既存のイベントリスナーを削除してから新しいものを追加
      const newNextBtn = nextBtn.cloneNode(true);
      nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
      newNextBtn.addEventListener("click", () => this.goToNext());
    }
  }

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

      console.log(
        `🔧 Processing answer for question ${question.id}, value: ${selectedValue}, choiceType: ${choiceType}`
      );

      // シナリオ設問かどうかを判定
      const isScenario =
        question.scenario && question.inner_q && question.outer_q;

      // 🔧 修正: より堅牢な回答検索と作成ロジック
      let answerIndex = this.answers.findIndex((a) => {
        // 厳密な一致と型変換による一致の両方をチェック
        return (
          a.questionId === question.id ||
          String(a.questionId) === String(question.id)
        );
      });

      let answer;
      if (answerIndex >= 0) {
        // 既存の回答を取得
        answer = this.answers[answerIndex];
        console.log(
          `🔧 Found existing answer at index ${answerIndex} for question ${question.id}`
        );
      } else {
        // 新しい回答を作成
        answer = {
          questionId: question.id,
          timestamp: new Date().toISOString(),
        };

        // 🔧 修正: 配列に追加する前にインデックスを確定
        answerIndex = this.answers.length;
        this.answers.push(answer);
        console.log(
          `🔧 Created new answer at index ${answerIndex} for question ${question.id}`
        );
      }

      // 🔧 修正: 回答データの更新処理を改善
      if (isScenario) {
        // シナリオ設問の場合：inner/outerを個別に保存
        if (choiceType === "inner") {
          answer.innerChoice = {
            value: selectedValue,
            scoring_tags: scoringTags,
          };
          console.log(
            `💭 Inner choice saved for ${question.id}:`,
            answer.innerChoice
          );
        } else if (choiceType === "outer") {
          answer.outerChoice = {
            value: selectedValue,
            scoring_tags: scoringTags,
          };
          console.log(
            `👥 Outer choice saved for ${question.id}:`,
            answer.outerChoice
          );
        } else {
          console.error(
            "❌ Invalid choice type for scenario question:",
            choiceType
          );
          return;
        }
      } else {
        // 通常の価値観設問の場合
        answer.selectedValue = selectedValue;
        answer.scoring_tags = scoringTags;
        console.log(`📝 Answer saved for ${question.id}:`, answer);
      }

      // 🔧 修正: 回答配列の更新を確実に実行
      this.answers[answerIndex] = answer;

      // 🔧 デバッグ: 回答配列の状態を確認
      console.log(`🔧 Answer array after update:`, {
        totalAnswers: this.answers.length,
        currentAnswerIndex: answerIndex,
        questionId: question.id,
        answerIds: this.answers.map((a) => a.questionId),
      });

      // ストレージに保存
      if (this.storageManager) {
        try {
          this.storageManager.saveAnswers(this.answers);
          console.log(
            `💾 Answers saved to storage: ${this.answers.length} answers`
          );
        } catch (storageError) {
          console.error("❌ Failed to save answers to storage:", storageError);
          console.warn(
            "⚠️ 回答の保存に失敗しました。ページを閉じる前に再度回答を確認してください。"
          );
        }
      }

      this.updateNavigationButtons();
      this.updateProgress();

      // 選択肢にアクティブスタイルを追加（アニメーション付き）
      const choiceSection = choiceType
        ? radioElement.closest(".choice-section")
        : radioElement.closest(".question-item");

      if (choiceSection) {
        choiceSection.querySelectorAll(".option-label").forEach((label) => {
          label.classList.remove("selected");
        });
        const selectedLabel = radioElement.closest(".option-label");
        selectedLabel.classList.add("selected");
        
        // リップル効果
        const ripple = selectedLabel.querySelector('.option-ripple');
        if (ripple) {
          ripple.style.animation = 'none';
          setTimeout(() => {
            ripple.style.animation = 'ripple 0.6s ease-out';
          }, 10);
        }
        
        // ハプティックフィードバック（対応デバイスのみ）
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    } catch (error) {
      console.error("❌ Critical error in handleAnswerChange:", error);
      alert(
        "回答の保存中にエラーが発生しました。ページを再読み込みして再度お試しください。"
      );
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
      const currentAnswer = this.findAnswerByQuestionId(currentQuestion.id);

      // シナリオ設問かどうかを判定
      const isScenario =
        currentQuestion.scenario &&
        currentQuestion.inner_q &&
        currentQuestion.outer_q;

      let hasAnswer = false;
      if (isScenario) {
        // シナリオ設問の場合：inner/outerの両方が選択されている必要がある
        hasAnswer =
          currentAnswer &&
          currentAnswer.innerChoice &&
          currentAnswer.outerChoice;
      } else {
        // 通常設問の場合：selectedValueが存在する必要がある
        hasAnswer = currentAnswer && currentAnswer.selectedValue;
      }

      nextBtn.disabled = !hasAnswer;

      // 進捗状況に応じたメッセージとアイコンの更新
      const btnText = nextBtn.querySelector('.btn-text');
      const btnIcon = nextBtn.querySelector('.btn-icon');
      
      if (this.currentQuestionIndex === this.questions.length - 1) {
        if (btnText) btnText.textContent = "分析開始";
        if (btnIcon) btnIcon.textContent = "🚀";
        nextBtn.classList.add("btn-success");
        
        // 完了時の達成感演出
        if (hasAnswer) {
          this.showCompletionCelebration();
        }
      } else {
        if (btnText) btnText.textContent = "次の質問";
        if (btnIcon) btnIcon.textContent = "→";
        nextBtn.classList.remove("btn-success");
      }
      
      // 回答済みボタンのフィードバック
      if (hasAnswer && !nextBtn.classList.contains('answered')) {
        nextBtn.classList.add('answered');
        this.showAnswerFeedback();
      }
    }
    
    // プログレス更新時の達成感演出
    this.updateProgressWithCelebration();
  }

  showCompletionCelebration() {
    // 完了時の視覚的フィードバック
    const questionHeader = this.container.querySelector('.question-header');
    if (questionHeader && !questionHeader.classList.contains('celebration')) {
      questionHeader.classList.add('celebration');
      
      // 3秒後にクラスを削除
      setTimeout(() => {
        questionHeader.classList.remove('celebration');
      }, 3000);
    }
  }

  showAnswerFeedback() {
    // 回答時の即座なフィードバック
    const completedCount = this.container.querySelector('.completed-count');
    if (completedCount) {
      const currentCount = parseInt(completedCount.textContent) || 0;
      const newCount = this.answers.filter(answer => {
        if (!answer) return false;
        return answer.selectedValue || (answer.innerChoice && answer.outerChoice);
      }).length;
      
      if (newCount > currentCount) {
        completedCount.style.animation = 'none';
        setTimeout(() => {
          completedCount.textContent = newCount;
          completedCount.style.animation = 'countUp 0.5s ease-out';
        }, 10);
      }
    }
  }

  updateProgressWithCelebration() {
    const answeredCount = this.answers.filter(answer => {
      if (!answer) return false;
      return answer.selectedValue || (answer.innerChoice && answer.outerChoice);
    }).length;
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
      this.bindNavigationEvents();
      this.updateNavigationButtons();
      this.updateProgress();

      // 進行状況をストレージに保存
      if (this.storageManager) {
        this.storageManager.saveProgress({
          currentQuestionIndex: this.currentQuestionIndex,
          totalQuestions: this.questions.length,
          completedQuestions: this.answers.length,
        });
      }
    }
  }

  goToNext() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
      this.bindNavigationEvents();
      this.updateNavigationButtons();
      this.updateProgress();

      // 進行状況をストレージに保存
      if (this.storageManager) {
        this.storageManager.saveProgress({
          currentQuestionIndex: this.currentQuestionIndex,
          totalQuestions: this.questions.length,
          completedQuestions: this.answers.length,
        });
      }
    } else {
      // 最後の質問 - 分析開始
      this.completeQuestions();
    }
  }

  completeQuestions() {
    try {
      console.log("🔍 Starting question completion check...");

      // 全質問に対する回答完了チェック
      const allQuestionsAnswered = this.checkAllQuestionsAnswered();

      if (allQuestionsAnswered.isComplete) {
        console.log("✅ All questions completed:", this.answers);
        console.log("📊 Final completion stats:", {
          totalQuestions: allQuestionsAnswered.debugInfo.totalQuestions,
          totalAnswers: allQuestionsAnswered.debugInfo.totalAnswers,
        });

        if (this.options.onComplete) {
          this.options.onComplete(this.answers);
        } else {
          // デフォルトの処理: グローバル関数を呼び出し
          if (typeof proceedToAnalysis === "function") {
            proceedToAnalysis(this.answers);
          } else {
            console.warn("⚠️ No completion handler found");
            alert("完了処理が見つかりません。ページを再読み込みしてください。");
          }
        }
      } else {
        console.warn(
          "⚠️ 未完了の質問があります:",
          allQuestionsAnswered.missing
        );

        // より詳細なエラーメッセージを生成
        const missingCount = allQuestionsAnswered.missing.length;
        const scenarioMissing = allQuestionsAnswered.missing.filter(
          (m) => m.includes("内面") || m.includes("外面")
        ).length;
        const regularMissing = missingCount - scenarioMissing;

        let errorMessage = `すべての質問にお答えください。\n`;
        if (regularMissing > 0) {
          errorMessage += `未回答の質問: ${regularMissing}問\n`;
        }
        if (scenarioMissing > 0) {
          errorMessage += `未完了のシナリオ質問: ${Math.ceil(
            scenarioMissing / 2
          )}問\n`;
        }
        errorMessage += `\n詳細は開発者コンソールをご確認ください。`;

        alert(errorMessage);
      }
    } catch (error) {
      console.error("❌ Error during question completion:", error);
      alert(
        "質問完了チェック中にエラーが発生しました。ページを再読み込みして再度お試しください。"
      );
    }
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
