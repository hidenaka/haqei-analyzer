// QuestionFlow.js - 質問フローUIコンポーネント（完全版）
// HaQei Analyzer - Question Flow Component with Completion Fix
class QuestionFlow extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.currentQuestionIndex = 0; // 明示的に0に設定
    this.answers = [];
    this.questions = [];
    this.storageManager = options.storageManager || null;
    this.changeEventBound = false; // 選択肢変更イベントのバインディング状態を追跡
    console.log(
      "QuestionFlow constructor: currentQuestionIndex =",
      this.currentQuestionIndex
    );
  }

  init() {
    this.loadQuestions();
    this.loadPreviousAnswers();
    
    // 安全性チェック: currentQuestionIndexが有効な範囲内にあることを確認
    if (this.currentQuestionIndex < 0 || this.currentQuestionIndex >= this.questions.length) {
      console.warn(`Invalid currentQuestionIndex (${this.currentQuestionIndex}), resetting to 0`);
      this.currentQuestionIndex = 0;
    }
    
    console.log(
      `QuestionFlow initialized with ${this.questions.length} questions`
    );
    console.log("Current question index:", this.currentQuestionIndex);
    console.log("Current question:", this.questions[this.currentQuestionIndex]?.id);
    
    super.init();
    this.render();
    // bindEvents()はrender()内で呼ばれるため、ここでは不要
  }

  loadQuestions() {
    // 価値観設問とシナリオ設問を読み込み
    if (typeof WORLDVIEW_QUESTIONS === "undefined") {
      console.error("WORLDVIEW_QUESTIONS is not defined");
      this.questions = [];
      return;
    }

    if (typeof SCENARIO_QUESTIONS === "undefined") {
      console.error("SCENARIO_QUESTIONS is not defined");
      this.questions = WORLDVIEW_QUESTIONS || [];
      return;
    }

    // 価値観設問 + シナリオ設問を結合
    this.questions = [...WORLDVIEW_QUESTIONS, ...SCENARIO_QUESTIONS];
    console.log("Loaded questions:", this.questions.length);
    console.log("Worldview questions:", WORLDVIEW_QUESTIONS.length);
    console.log("Scenario questions:", SCENARIO_QUESTIONS.length);

    // 念の為、インデックスを再初期化
    this.currentQuestionIndex = 0;
    console.log("Reset currentQuestionIndex to:", this.currentQuestionIndex);
  }

  // 以前の回答を読み込み
  loadPreviousAnswers() {
    if (this.storageManager) {
      const savedAnswers = this.storageManager.getAnswers();
      const savedProgress = this.storageManager.getProgress();

      if (savedAnswers && savedAnswers.length > 0) {
        this.answers = savedAnswers;
        console.log("Loaded previous answers:", this.answers.length);
      }

      if (savedProgress) {
        const restoredIndex = savedProgress.currentQuestionIndex || 0;
        
        // インデックスが有効な範囲内かチェック
        if (restoredIndex >= 0 && restoredIndex < this.questions.length) {
          this.currentQuestionIndex = restoredIndex;
          console.log("Restored progress:", this.currentQuestionIndex);
        } else {
          console.warn(`Invalid restored index ${restoredIndex}, using 0`);
          this.currentQuestionIndex = 0;
        }
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
      `Rendering: Question ${currentQuestionNum} of ${totalQuestions}`
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
    const questionNumber = this.currentQuestionIndex + 1;
    const isEven = questionNumber % 2 === 0;
    
    console.log(
      `Rendering current question. Index: ${this.currentQuestionIndex}, Total: ${this.questions.length}`
    );
    console.log(`Question Number: ${questionNumber} ${isEven ? '(EVEN)' : '(ODD)'}`);

    const question = this.questions[this.currentQuestionIndex];
    let questionDisplay = this.container.querySelector("#question-display");

    if (!question) {
      console.error(
        "Question not found at index:",
        this.currentQuestionIndex
      );
      console.error("Available questions:", this.questions.map(q => q.id));
      console.error("Total questions loaded:", this.questions.length);
      return;
    }
    
    console.log(`Rendering question: ${question.id} - "${question.text || question.scenario}"`);
    console.log(`Question type: ${question.scenario ? 'Scenario' : 'Regular'}`);
    
    if (!questionDisplay) {
      console.error("Question display container not found!");
      console.error("Container innerHTML:", this.container.innerHTML);
      
      // 強制的にcontainerを再作成
      console.warn("Attempting to recreate question display container...");
      const newDisplay = document.createElement('div');
      newDisplay.id = 'question-display';
      this.container.appendChild(newDisplay);
      
      // 新しく作成したコンテナを使用
      questionDisplay = this.container.querySelector("#question-display");
      if (!questionDisplay) {
        console.error("Failed to create question display container!");
        return;
      }
    }

    // answersが未定義または配列でなければ初期化
    if (!Array.isArray(this.answers)) {
      console.warn("this.answersが未定義または配列でないため初期化します");
      this.answers = [];
    }

    console.log(
      "Rendering question:",
      question.id,
      question.text || question.scenario
    );

    // シナリオ設問かどうかを判定
    const isScenario =
      question.scenario && question.inner_q && question.outer_q;

    if (isScenario) {
      // シナリオ設問の場合：inner/outer選択肢を表示
      console.log(`🏗️ Rendering scenario question ${question.id}`);
      console.log(`   Inner options: ${question.options.inner ? question.options.inner.length : 0}`);
      console.log(`   Outer options: ${question.options.outer ? question.options.outer.length : 0}`);
      
      // 選択肢データの検証
      if (!question.options.inner || !question.options.outer) {
        console.error(`❌ Missing options for scenario question ${question.id}`);
        console.error(`   Inner options:`, question.options.inner);
        console.error(`   Outer options:`, question.options.outer);
      }
      
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
      
      console.log(`✅ Scenario question ${question.id} HTML generated`);
      console.log(`   HTML length: ${questionDisplay.innerHTML.length} chars`);
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
    
    // レンダリング成功をログ出力
    const contentLength = questionDisplay.innerHTML.length;
    console.log(`✅ Question ${questionNumber} rendered successfully. Content length: ${contentLength} chars`);
    
    if (contentLength === 0) {
      console.error(`❌ PROBLEM: Question ${questionNumber} has no content after rendering!`);
    }
  }

  // 既存回答の復元（強化版）
  restoreExistingAnswers(question, isScenario) {
    const existingAnswer = this.findAnswerByQuestionId(question.id);
    
    console.log(`🔄 既存回答を復元: ${question.id}`);
    console.log(`   既存回答データ:`, existingAnswer);

    if (existingAnswer) {
      if (isScenario) {
        // シナリオ設問の場合：inner/outerを個別に復元
        console.log(`   シナリオ質問の復元開始`);
        
        if (existingAnswer.innerChoice && existingAnswer.innerChoice.value) {
          const innerRadio = this.container.querySelector(
            `input[name="inner-${question.id}"][value="${existingAnswer.innerChoice.value}"]`
          );
          if (innerRadio) {
            innerRadio.checked = true;
            console.log(`   ✅ Inner choice 復元: ${existingAnswer.innerChoice.value}`);
          } else {
            console.warn(`   ❌ Inner radio not found for value: ${existingAnswer.innerChoice.value}`);
          }
        }

        if (existingAnswer.outerChoice && existingAnswer.outerChoice.value) {
          const outerRadio = this.container.querySelector(
            `input[name="outer-${question.id}"][value="${existingAnswer.outerChoice.value}"]`
          );
          if (outerRadio) {
            outerRadio.checked = true;
            console.log(`   ✅ Outer choice 復元: ${existingAnswer.outerChoice.value}`);
          } else {
            console.warn(`   ❌ Outer radio not found for value: ${existingAnswer.outerChoice.value}`);
          }
        }
      } else {
        // 通常設問の場合
        const radio = this.container.querySelector(
          `input[value="${existingAnswer.selectedValue}"]`
        );
        if (radio) {
          radio.checked = true;
          console.log(`   ✅ Regular choice 復元: ${existingAnswer.selectedValue}`);
        } else {
          console.warn(`   ❌ Regular radio not found for value: ${existingAnswer.selectedValue}`);
        }
      }

      this.updateNavigationButtons();
    } else {
      console.log(`   既存回答なし`);
    }
  }

  bindEvents() {
    // 選択肢変更イベント（一度だけ設定）
    if (!this.changeEventBound) {
      this.container.addEventListener("change", (e) => {
        if (e.target.type === "radio") {
          console.log(`🎯 Radio change detected:`, {
            name: e.target.name,
            value: e.target.value,
            choiceType: e.target.dataset.choiceType
          });
          
          // わずかな遅延を入れてDOM更新を確実にする
          setTimeout(() => {
            this.handleAnswerChange(e.target);
          }, 10);
        }
      });
      this.changeEventBound = true;
      console.log("Change event bound");
    }

    // ナビゲーションボタン（毎回設定し直す）
    this.bindNavigationEvents();
  }

  bindNavigationEvents() {
    const prevBtn = this.container.querySelector("#prev-btn");
    const nextBtn = this.container.querySelector("#next-btn");

    if (prevBtn) {
      // 既存のイベントリスナーを削除してから新しいものを追加
      prevBtn.replaceWith(prevBtn.cloneNode(true));
      const newPrevBtn = this.container.querySelector("#prev-btn");
      newPrevBtn.addEventListener("click", () => {
        console.log("Previous button clicked");
        this.goToPrevious();
      });
    }

    if (nextBtn) {
      // 既存のイベントリスナーを削除してから新しいものを追加
      nextBtn.replaceWith(nextBtn.cloneNode(true));
      const newNextBtn = this.container.querySelector("#next-btn");
      newNextBtn.addEventListener("click", () => {
        console.log("Next button clicked");
        this.goToNext();
      });
    }
    
    console.log("Navigation events bound successfully");
  }

  handleAnswerChange(radioElement) {
    try {
      const question = this.questions[this.currentQuestionIndex];
      if (!question) {
        console.error(
          "handleAnswerChange: questionが見つかりません",
          this.currentQuestionIndex,
          this.questions
        );
        return;
      }

      const selectedValue = radioElement.value;
      const scoringTags = JSON.parse(radioElement.dataset.scoring);
      const choiceType = radioElement.dataset.choiceType; // inner/outer/undefined

      // 入力データの検証
      if (!selectedValue) {
        console.error("Invalid answer data: selectedValue is required");
        return;
      }

      // シナリオ設問かどうかを判定
      const isScenario =
        question.scenario && question.inner_q && question.outer_q;

      // 既存の回答を取得または作成
      let answerIndex = this.answers.findIndex(
        (a) => a.questionId === question.id
      );

      let answer;
      if (answerIndex >= 0) {
        answer = this.answers[answerIndex];
        console.log(`Found existing answer for ${question.id}:`, answer);
      } else {
        answer = { 
          questionId: question.id,
          timestamp: new Date().toISOString()
        };
        this.answers.push(answer);
        answerIndex = this.answers.length - 1;
        console.log(`Created new answer for ${question.id}:`, answer);
      }

      if (isScenario) {
        // シナリオ設問の場合：inner/outerを個別に保存
        console.log(`Processing scenario question ${question.id}, choiceType: ${choiceType}`);
        
        console.log(`🔄 シナリオ質問 ${question.id} の選択保存 - タイプ: ${choiceType}`);
        console.log(`   保存前の回答状態:`, {
          hasInner: !!(answer.innerChoice && answer.innerChoice.value),
          hasOuter: !!(answer.outerChoice && answer.outerChoice.value)
        });
        
        if (choiceType === "inner") {
          answer.innerChoice = {
            value: selectedValue,
            scoring_tags: scoringTags,
          };
          console.log(
            `✅ Inner choice saved for ${question.id}:`,
            answer.innerChoice
          );
        } else if (choiceType === "outer") {
          answer.outerChoice = {
            value: selectedValue,
            scoring_tags: scoringTags,
          };
          console.log(
            `✅ Outer choice saved for ${question.id}:`,
            answer.outerChoice
          );
        } else {
          console.error("❌ Invalid choice type for scenario question:", choiceType);
          console.error("Radio element:", radioElement);
          console.error("Radio element dataset:", radioElement.dataset);
          return;
        }
        
        // 保存後の状態をチェック
        const hasInner = answer.innerChoice && answer.innerChoice.value;
        const hasOuter = answer.outerChoice && answer.outerChoice.value;
        console.log(`保存後のシナリオ質問状態:`);
        console.log(`   内面: ${hasInner ? '✅' : '❌'} ${hasInner ? answer.innerChoice.value : '未選択'}`);
        console.log(`   外面: ${hasOuter ? '✅' : '❌'} ${hasOuter ? answer.outerChoice.value : '未選択'}`);
        console.log(`Current answer state:`, answer);
      } else {
        // 通常の価値観設問の場合
        answer.selectedValue = selectedValue;
        answer.scoring_tags = scoringTags;
        console.log(`Answer saved for ${question.id}:`, answer);
      }

      // 回答データの検証
      try {
        if (!this.validateAnswerData(answer)) {
          console.error("❌ Answer validation failed for:", answer);
          console.error("Question:", question);
          console.error("Is scenario:", isScenario);
          
          // シナリオ質問の場合、現在の全回答データを表示
          if (isScenario) {
            console.error("📋 Current answers for this question ID:");
            const relatedAnswers = this.answers.filter(a => a.questionId === question.id);
            relatedAnswers.forEach((a, index) => {
              console.error(`   Answer ${index + 1}:`, a);
            });
          }
          
          // 検証に失敗しても処理は継続（ユーザビリティのため）
        }
      } catch (validationError) {
        console.error("Answer validation error:", validationError);
        // 検証エラーでも処理は継続
      }

      // 回答を更新（シナリオ質問の場合は既存オブジェクトを維持）
      this.answers[answerIndex] = answer;
      
      // シナリオ質問の場合は回答状態を再度確認
      if (isScenario) {
        const finalAnswer = this.answers[answerIndex];
        console.log(`🔎 最終回答確認 ${question.id}:`, finalAnswer);
        console.log(`   内面: ${finalAnswer.innerChoice ? finalAnswer.innerChoice.value : '未選択'}`);
        console.log(`   外面: ${finalAnswer.outerChoice ? finalAnswer.outerChoice.value : '未選択'}`);
      }

      // ストレージに保存
      if (this.storageManager) {
        try {
          this.storageManager.saveAnswers(this.answers);
          console.log(`💾 ストレージ保存完了: ${this.answers.length}回答`);
        } catch (storageError) {
          console.error("Failed to save answers to storage:", storageError);
          // ストレージエラーは表示してユーザーに知らせる
          console.warn("回答の保存に失敗しました。ページを閉じる前に再度回答を確認してください。");
        }
      }

      this.updateNavigationButtons();
      this.updateProgress();

      // 選択肢にアクティブスタイルを追加
      const choiceSection = choiceType
        ? radioElement.closest(".choice-section")
        : radioElement.closest(".question-item");

      if (choiceSection) {
        choiceSection.querySelectorAll(".option-label").forEach((label) => {
          label.classList.remove("selected");
        });
        radioElement.closest(".option-label").classList.add("selected");
      }

    } catch (error) {
      console.error("Critical error in handleAnswerChange:", error);
      alert("回答の保存中にエラーが発生しました。ページを再読み込みして再度お試しください。");
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
      
      // デバッグ情報を追加
      console.log(`Navigation button state: hasAnswer=${hasAnswer}, nextBtn.disabled=${nextBtn.disabled}`);

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
      `Progress update: ${currentQuestionNum}/${totalQuestions} (${progressPercentage.toFixed(
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
    const oldIndex = this.currentQuestionIndex;
    
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      
      // デバッグログ: 質問遷移の確認
      console.log(`Navigation: Q${oldIndex + 1} → Q${this.currentQuestionIndex + 1}`);
      console.log(`Moving to question: ${this.questions[this.currentQuestionIndex]?.id}`);
      
      this.renderCurrentQuestion();
      this.updateNavigationButtons();
      this.bindNavigationEvents(); // ナビゲーションイベントを再バインド
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
    const oldIndex = this.currentQuestionIndex;
    
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      
      // デバッグログ: 質問遷移の確認
      console.log(`Navigation: Q${oldIndex + 1} → Q${this.currentQuestionIndex + 1}`);
      console.log(`Moving to question: ${this.questions[this.currentQuestionIndex]?.id}`);
      
      this.renderCurrentQuestion();
      this.updateNavigationButtons();
      this.bindNavigationEvents(); // ナビゲーションイベントを再バインド
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
      console.log("Reached final question, completing...");
      this.completeQuestions();
    }
  }

  completeQuestions() {
    try {
      console.log("Starting question completion check...");
      
      // 回答データを分析用に準備
      this.prepareAnswersForAnalysis();
      
      // データ整合性チェック
      const integrityCheck = this.performDataIntegrityCheck();
      if (integrityCheck.hasIssues) {
        console.warn("Data integrity issues found before completion check");
      }

      // 全質問に対する回答完了チェック
      const allQuestionsAnswered = this.checkAllQuestionsAnswered();

      if (allQuestionsAnswered.isComplete) {
        console.log("All questions completed:", this.answers);
        console.log("Final completion stats:", {
          totalQuestions: allQuestionsAnswered.debugInfo.totalQuestions,
          totalAnswers: allQuestionsAnswered.debugInfo.totalAnswers,
          integrityIssues: integrityCheck.issues.length
        });

        if (this.options.onComplete) {
          // 準備された回答データと元の回答データの両方を渡す
          this.options.onComplete({
            originalAnswers: this.answers,
            preparedAnswers: this.preparedAnswers || this.answers
          });
        } else {
          // デフォルトの処理: グローバル関数を呼び出し
          if (typeof proceedToAnalysis === "function") {
            proceedToAnalysis({
              originalAnswers: this.answers,
              preparedAnswers: this.preparedAnswers || this.answers
            });
          } else {
            console.warn("No completion handler found");
            alert("完了処理が見つかりません。ページを再読み込みしてください。");
          }
        }
      } else {
        console.warn("未完了の質問があります:", allQuestionsAnswered.missing);
        
        // より詳細なエラーメッセージを生成
        const missingCount = allQuestionsAnswered.missing.length;
        const scenarioMissing = allQuestionsAnswered.missing.filter(m => m.includes('内面') || m.includes('外面')).length;
        const regularMissing = missingCount - scenarioMissing;
        
        let errorMessage = `すべての質問にお答えください。\n`;
        if (regularMissing > 0) {
          errorMessage += `未回答の質問: ${regularMissing}問\n`;
        }
        if (scenarioMissing > 0) {
          errorMessage += `未完了のシナリオ質問: ${Math.ceil(scenarioMissing / 2)}問\n`;
        }
        errorMessage += `\n詳細は開発者コンソールをご確認ください。`;
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error during question completion:", error);
      alert("質問完了チェック中にエラーが発生しました。ページを再読み込みして再度お試しください。");
    }
  }

  // 分析用の回答データ準備
  prepareAnswersForAnalysis() {
    console.log("Preparing answers for analysis...");
    
    let preparedAnswers = [];
    
    this.answers.forEach((answer, index) => {
      const question = this.questions.find(q => q.id === answer.questionId);
      if (!question) {
        console.warn(`Question not found for answer: ${answer.questionId}`);
        return;
      }
      
      const isScenario = question.scenario && question.inner_q && question.outer_q;
      
      if (isScenario) {
        // シナリオ質問の場合、inner/outerの回答を個別の回答として分析用に変換
        if (answer.innerChoice && answer.innerChoice.value) {
          preparedAnswers.push({
            questionId: answer.questionId + "_inner",
            selectedValue: answer.innerChoice.value,
            scoring_tags: answer.innerChoice.scoring_tags || [],
            originalQuestionId: answer.questionId,
            choiceType: "inner"
          });
        } else {
          console.warn(`Missing inner choice for scenario question: ${answer.questionId}`);
        }
        
        if (answer.outerChoice && answer.outerChoice.value) {
          preparedAnswers.push({
            questionId: answer.questionId + "_outer",
            selectedValue: answer.outerChoice.value,
            scoring_tags: answer.outerChoice.scoring_tags || [],
            originalQuestionId: answer.questionId,
            choiceType: "outer"
          });
        } else {
          console.warn(`Missing outer choice for scenario question: ${answer.questionId}`);
        }
      } else {
        // 通常の質問の場合
        if (answer.selectedValue) {
          preparedAnswers.push({
            questionId: answer.questionId,
            selectedValue: answer.selectedValue,
            scoring_tags: answer.scoring_tags || [],
            choiceType: "single"
          });
        } else {
          console.warn(`Missing selected value for question: ${answer.questionId}`);
        }
      }
    });
    
    console.log(`Prepared ${preparedAnswers.length} answers for analysis`);
    console.log("Prepared answers:", preparedAnswers);
    
    // 分析用の回答データを保存
    this.preparedAnswers = preparedAnswers;
    
    return preparedAnswers;
  }

  // 回答データの検証（寛容版）
  validateAnswerData(answer) {
    if (!answer.questionId) {
      throw new Error('Answer missing questionId');
    }

    // 質問IDに対応する質問を検索
    const question = this.questions.find(q => q.id === answer.questionId);
    if (!question) {
      console.warn(`Question not found for answer with ID: ${answer.questionId}`);
      return false;
    }

    // シナリオ質問の検証
    const isScenario = question.scenario && question.inner_q && question.outer_q;
    if (isScenario) {
      console.log(`🔍 Validating scenario question ${answer.questionId}:`);
      console.log(`   Has innerChoice: ${!!answer.innerChoice}`);
      console.log(`   Has outerChoice: ${!!answer.outerChoice}`);
      
      if (answer.innerChoice) {
        console.log(`   Inner choice value: ${answer.innerChoice.value}`);
      }
      if (answer.outerChoice) {
        console.log(`   Outer choice value: ${answer.outerChoice.value}`);
      }
      
      // シナリオ質問の寛容的検証（部分的回答を許可）
      const hasInnerChoice = answer.innerChoice && answer.innerChoice.value;
      const hasOuterChoice = answer.outerChoice && answer.outerChoice.value;
      
      if (!hasInnerChoice && !hasOuterChoice) {
        console.warn(`❌ No choices selected for scenario question ${answer.questionId}`);
        return false;
      }
      
      // 片方のみ選択されている場合は警告しつつも有効として処理
      if (!hasInnerChoice || !hasOuterChoice) {
        console.warn(`⚠️ Partial scenario answer for ${answer.questionId} - 部分的回答を許可`);
        console.warn(`   Missing innerChoice: ${!hasInnerChoice}`);
        console.warn(`   Missing outerChoice: ${!hasOuterChoice}`);
        // 検証は成功として継続（ユーザビリティを優先）
      }
    } else {
      // 通常質問の検証
      if (!answer.selectedValue) {
        console.warn(`Missing selectedValue for ${answer.questionId}`);
        return false;
      }
    }

    return true;
  }

  // 質問IDによる回答検索（堅牢な検索ロジック）
  findAnswerByQuestionId(questionId) {
    // より堅牢な検索ロジック
    const answer = this.answers.find(a => {
      // 厳密な一致チェック
      if (a.questionId === questionId) return true;

      // 型変換による一致チェック（文字列 vs 数値等）
      if (String(a.questionId) === String(questionId)) return true;

      return false;
    });

    if (!answer) {
      console.warn(`No answer found for question ${questionId}`);
      console.warn('Available answer IDs:', this.answers.map(a => a.questionId));
    }

    return answer;
  }

  // 個別質問の完了状態検証
  validateQuestionCompletion(question, answer) {
    if (!answer) {
      return {
        isComplete: false,
        reason: `${question.id}: 回答なし`
      };
    }

    // シナリオ質問の場合
    const isScenario = question.scenario && question.inner_q && question.outer_q;
    if (isScenario) {
      if (!answer.innerChoice) {
        return {
          isComplete: false,
          reason: `${question.id}: 内面選択肢未回答`
        };
      }
      if (!answer.outerChoice) {
        return {
          isComplete: false,
          reason: `${question.id}: 外面選択肢未回答`
        };
      }
      
      // 選択肢の値も確認
      if (!answer.innerChoice.value) {
        return {
          isComplete: false,
          reason: `${question.id}: 内面選択肢の値が空`
        };
      }
      if (!answer.outerChoice.value) {
        return {
          isComplete: false,
          reason: `${question.id}: 外面選択肢の値が空`
        };
      }
    } else {
      // 通常質問の場合
      if (!answer.selectedValue) {
        return {
          isComplete: false,
          reason: `${question.id}: 選択肢未回答`
        };
      }
    }

    return {
      isComplete: true,
      reason: null
    };
  }

  // デバッグ情報のログ出力
  logCompletionDebugInfo(debugInfo) {
    console.group('Question Completion Debug Info');
    console.log('Summary:', {
      totalQuestions: debugInfo.totalQuestions,
      totalAnswers: debugInfo.totalAnswers,
      missingCount: debugInfo.missingDetails.length
    });

    console.log('Question IDs:', debugInfo.questionIds);
    console.log('Answer IDs:', debugInfo.answerIds);

    if (debugInfo.missingDetails.length > 0) {
      console.group('Missing Details');
      debugInfo.missingDetails.forEach(detail => {
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
      selectedValue: answer.selectedValue
    };
  }

  // 全質問の回答完了チェック（強化版）
  checkAllQuestionsAnswered() {
    const missing = [];
    const debugInfo = {
      totalQuestions: this.questions.length,
      totalAnswers: this.answers.length,
      questionIds: this.questions.map(q => q.id),
      answerIds: this.answers.map(a => a.questionId),
      missingDetails: []
    };

    for (let i = 0; i < this.questions.length; i++) {
      const question = this.questions[i];
      const answer = this.findAnswerByQuestionId(question.id);

      const validationResult = this.validateQuestionCompletion(question, answer);

      if (!validationResult.isComplete) {
        missing.push(validationResult.reason);
        debugInfo.missingDetails.push({
          questionId: question.id,
          reason: validationResult.reason,
          answerFound: !!answer,
          answerData: answer ? this.sanitizeAnswerForDebug(answer) : null
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
      debugInfo: debugInfo
    };
  }

  // データ整合性チェック
  performDataIntegrityCheck() {
    const issues = [];

    // 重複回答のチェック
    const answerIds = this.answers.map(a => a.questionId);
    const duplicates = answerIds.filter((id, index) => answerIds.indexOf(id) !== index);
    if (duplicates.length > 0) {
      issues.push(`Duplicate answers found: ${duplicates.join(', ')}`);
    }

    // 孤立回答のチェック（対応する質問が存在しない回答）
    const questionIds = this.questions.map(q => q.id);
    const orphanAnswers = this.answers.filter(a => !questionIds.includes(a.questionId));
    if (orphanAnswers.length > 0) {
      issues.push(`Orphan answers found: ${orphanAnswers.map(a => a.questionId).join(', ')}`);
    }

    // 不完全なシナリオ回答のチェック
    const incompleteScenarios = this.answers.filter(a => {
      const question = this.questions.find(q => q.id === a.questionId);
      if (question && question.scenario) {
        return !a.innerChoice || !a.outerChoice;
      }
      return false;
    });

    if (incompleteScenarios.length > 0) {
      issues.push(`Incomplete scenario answers: ${incompleteScenarios.map(a => a.questionId).join(', ')}`);
    }

    // 空の回答値のチェック
    const emptyAnswers = this.answers.filter(a => {
      const question = this.questions.find(q => q.id === a.questionId);
      if (question) {
        const isScenario = question.scenario && question.inner_q && question.outer_q;
        if (isScenario) {
          return (!a.innerChoice || !a.innerChoice.value) || (!a.outerChoice || !a.outerChoice.value);
        } else {
          return !a.selectedValue;
        }
      }
      return false;
    });

    if (emptyAnswers.length > 0) {
      issues.push(`Empty answer values found: ${emptyAnswers.map(a => a.questionId).join(', ')}`);
    }

    if (issues.length > 0) {
      console.group('Data Integrity Issues Found');
      issues.forEach(issue => console.warn(issue));
      console.groupEnd();
    }

    return {
      hasIssues: issues.length > 0,
      issues: issues
    };
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== "undefined") {
  window.QuestionFlow = QuestionFlow;
}