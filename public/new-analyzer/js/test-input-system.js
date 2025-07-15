// TestInputSystem.js - 手動テスト用データ入力・管理システム

class TestInputSystem {
  constructor() {
    this.participants = [];
    this.answersData = {};
    this.diagnosisResults = {};
    this.feedbackData = {};
    this.questions = {
      worldview:
        typeof WORLDVIEW_QUESTIONS !== "undefined" ? WORLDVIEW_QUESTIONS : [],
      scenarios:
        typeof SCENARIO_QUESTIONS !== "undefined" ? SCENARIO_QUESTIONS : [],
    };
    this.init();
  }

  init() {
    this.loadSavedData();
    this.generateQuestionInputs();
    this.updateDisplay();
    console.log("🎯 Test Input System initialized");
  }

  // 対象者リスト解析
  parseParticipants() {
    const text = document.getElementById("participants-list").value;
    const lines = text.split("\n").filter((line) => line.trim());

    this.participants = lines.map((line, index) => {
      const parts = line.split(",").map((p) => p.trim());
      return {
        id: parts[0] || `user${String(index + 1).padStart(3, "0")}`,
        name: parts[1] || `ユーザー${index + 1}`,
        age: parts[2] || "",
        gender: parts[3] || "",
        occupation: parts[4] || "",
      };
    });

    this.updateParticipantSelects();
    this.updateInputProgress();
    this.saveData();

    alert(`${this.participants.length}人の対象者を登録しました`);
  }

  // 質問入力フォーム生成
  generateQuestionInputs() {
    // 価値観設問
    const worldviewContainer = document.getElementById("worldview-inputs");
    worldviewContainer.innerHTML = this.questions.worldview
      .map((q) => this.createQuestionInput(q, "worldview"))
      .join("");

    // シナリオ設問
    const scenarioContainer = document.getElementById("scenario-inputs");
    scenarioContainer.innerHTML = this.questions.scenarios
      .map((q) => this.createQuestionInput(q, "scenario"))
      .join("");
  }

  createQuestionInput(question, type) {
    if (type === "scenario") {
      return `
                <div class="question-input" data-question-id="${question.id}">
                    <h5>${question.id.toUpperCase()}: ${question.scenario}</h5>
                    
                    <div class="scenario-choice">
                        <label>内面選択 (${question.inner_q})</label>
                        <select class="inner-choice">
                            <option value="">選択してください</option>
                            ${question.options.inner
                              .map(
                                (opt) =>
                                  `<option value="${opt.value}">${opt.value}: ${opt.text}</option>`
                              )
                              .join("")}
                        </select>
                    </div>
                    
                    <div class="scenario-choice">
                        <label>外面選択 (${question.outer_q})</label>
                        <select class="outer-choice">
                            <option value="">選択してください</option>
                            ${question.options.outer
                              .map(
                                (opt) =>
                                  `<option value="${opt.value}">${opt.value}: ${opt.text}</option>`
                              )
                              .join("")}
                        </select>
                    </div>
                </div>
            `;
    } else {
      return `
                <div class="question-input" data-question-id="${question.id}">
                    <h5>${question.id.toUpperCase()}: ${question.text}</h5>
                    <select class="answer-select">
                        <option value="">選択してください</option>
                        ${question.options
                          .map(
                            (opt) =>
                              `<option value="${opt.value}">${opt.value}: ${opt.text}</option>`
                          )
                          .join("")}
                    </select>
                </div>
            `;
    }
  }

  // 現在の回答を保存
  saveCurrentAnswers() {
    const participantId = document.getElementById("current-participant").value;
    if (!participantId) {
      alert("対象者を選択してください");
      return;
    }

    const answers = this.collectCurrentAnswers();
    if (answers.length === 0) {
      alert("回答が入力されていません");
      return;
    }

    this.answersData[participantId] = answers;
    this.saveData();
    this.updateInputProgress();

    alert(`${participantId}の回答を保存しました（${answers.length}問）`);
    this.clearCurrentAnswers();
  }

  collectCurrentAnswers() {
    const answers = [];

    // 価値観設問の回答収集
    document
      .querySelectorAll("#worldview-inputs .question-input")
      .forEach((div) => {
        const questionId = div.dataset.questionId;
        const selectedValue = div.querySelector(".answer-select").value;

        if (selectedValue) {
          const question = this.questions.worldview.find(
            (q) => q.id === questionId
          );
          const option = question.options.find(
            (opt) => opt.value === selectedValue
          );

          answers.push({
            questionId,
            selectedValue,
            scoring_tags: option.scoring_tags,
          });
        }
      });

    // シナリオ設問の回答収集
    document
      .querySelectorAll("#scenario-inputs .question-input")
      .forEach((div) => {
        const questionId = div.dataset.questionId;
        const innerValue = div.querySelector(".inner-choice").value;
        const outerValue = div.querySelector(".outer-choice").value;

        if (innerValue && outerValue) {
          const question = this.questions.scenarios.find(
            (q) => q.id === questionId
          );
          const innerOption = question.options.inner.find(
            (opt) => opt.value === innerValue
          );
          const outerOption = question.options.outer.find(
            (opt) => opt.value === outerValue
          );

          answers.push({
            questionId,
            innerChoice: {
              value: innerValue,
              scoring_tags: innerOption.scoring_tags,
            },
            outerChoice: {
              value: outerValue,
              scoring_tags: outerOption.scoring_tags,
            },
          });
        }
      });

    return answers;
  }

  // 全員の診断実行
  async executeAllDiagnosis(event) {
    const completedCount = Object.keys(this.answersData).length;
    if (completedCount === 0) {
      alert("回答データがありません");
      return;
    }

    if (!confirm(`${completedCount}人分の診断を実行しますか？`)) {
      return;
    }

    const button = event.target;
    button.disabled = true;
    button.textContent = "🔬 診断実行中...";

    try {
      // 既存のエンジンを使用
      const dataManager = new DataManager();
      await dataManager.loadData();
      const engine = new TripleOSEngine(dataManager);

      let processed = 0;
      for (const [participantId, answers] of Object.entries(this.answersData)) {
        try {
          const result = await engine.analyzeTripleOS(answers);
          this.diagnosisResults[participantId] = {
            result,
            processedAt: new Date().toISOString(),
            participant: this.participants.find((p) => p.id === participantId),
          };
          processed++;

          // プログレス更新
          button.textContent = `🔬 診断中... (${processed}/${completedCount})`;
        } catch (error) {
          console.error(`❌ Error processing ${participantId}:`, error);
          this.diagnosisResults[participantId] = {
            error: error.message,
            processedAt: new Date().toISOString(),
            participant: this.participants.find((p) => p.id === participantId),
          };
        }
      }

      this.saveData();
      this.updateResultsList();

      alert(`診断完了！ ${processed}人の結果を生成しました`);
    } catch (error) {
      console.error("❌ Diagnosis execution failed:", error);
      alert("診断実行中にエラーが発生しました: " + error.message);
    } finally {
      button.disabled = false;
      button.textContent = "🔬 全員の診断実行";
    }
  }

  // 診断結果をユーザー向けテキストに変換
  generateUserText(participantId, format = "detailed") {
    const data = this.diagnosisResults[participantId];
    if (!data || !data.result) return "エラー: 診断結果が見つかりません";

    const result = data.result;
    const participant = data.participant;

    if (format === "detailed") {
      return this.generateDetailedText(participant, result);
    } else if (format === "summary") {
      return this.generateSummaryText(participant, result);
    } else {
      return this.generateAnalysisData(participant, result);
    }
  }

  generateDetailedText(participant, result) {
    return `
🎯 ${participant.name}さんの HaQei 人格OS診断結果

【あなたの3層人格OS】

🔧 エンジンOS（核となる価値観）
「${result.engineOS.hexagramInfo.name}」
${result.engineOS.hexagramInfo.catchphrase || ""}

🖥️ インターフェースOS（外面的な行動）
「${result.interfaceOS.hexagramInfo.name}」
マッチ度: ${Math.round(result.interfaceOS.matchScore)}%

🛡️ セーフモードOS（内面的な防御機制）
「${result.safeModeOS.hexagramInfo.name}」
マッチ度: ${Math.round(result.safeModeOS.matchScore)}%

【人格一貫性スコア】
総合: ${Math.round(result.consistencyScore.overall * 100)}%

【統合洞察】
${result.integration.summary}

${result.integration.recommendations.map((rec) => `💡 ${rec}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━
この診断結果はいかがでしたか？
的中度や印象をお聞かせください 🙏
        `.trim();
  }

  generateSummaryText(participant, result) {
    return `
🎯 ${participant.name}さんの人格OS診断

エンジンOS: 「${result.engineOS.hexagramInfo.name}」
インターフェースOS: 「${result.interfaceOS.hexagramInfo.name}」
セーフモードOS: 「${result.safeModeOS.hexagramInfo.name}」

人格一貫性: ${Math.round(result.consistencyScore.overall * 100)}%

${result.integration.summary}

#HaQeiAnalyzer #人格診断 #易経
        `.trim();
  }

  // フィードバック保存
  saveFeedback() {
    const participantId = document.getElementById("feedback-participant").value;
    if (!participantId) {
      alert("対象者を選択してください");
      return;
    }

    const feedback = {
      participantId,
      accuracy: parseInt(document.getElementById("accuracy-rating").value),
      satisfaction: parseInt(
        document.getElementById("satisfaction-rating").value
      ),
      impressive: Array.from(
        document.querySelectorAll(".checkbox-group input:checked")
      ).map((cb) => cb.value),
      comments: document.getElementById("user-comments").value.trim(),
      recordedAt: new Date().toISOString(),
    };

    this.feedbackData[participantId] = feedback;
    this.saveData();
    this.updateFeedbackSummary();

    // フォームクリア
    document.getElementById("accuracy-rating").value = "";
    document.getElementById("satisfaction-rating").value = "";
    document
      .querySelectorAll(".checkbox-group input")
      .forEach((cb) => (cb.checked = false));
    document.getElementById("user-comments").value = "";

    alert("フィードバックを保存しました");
  }

  // 分析・検証
  generateAnalysisReport() {
    const feedbackEntries = Object.values(this.feedbackData);
    if (feedbackEntries.length === 0) {
      alert("フィードバックデータがありません");
      return;
    }

    const analysis = {
      totalResponses: feedbackEntries.length,
      averageAccuracy: this.calculateAverage(feedbackEntries, "accuracy"),
      averageSatisfaction: this.calculateAverage(
        feedbackEntries,
        "satisfaction"
      ),
      accuracyDistribution: this.calculateDistribution(
        feedbackEntries,
        "accuracy"
      ),
      satisfactionDistribution: this.calculateDistribution(
        feedbackEntries,
        "satisfaction"
      ),
      commonImpressions: this.analyzeImpressions(feedbackEntries),
      lowAccuracyCases: this.identifyLowAccuracyCases(feedbackEntries),
      recommendations: this.generateRecommendations(feedbackEntries),
    };

    return analysis;
  }

  // データ永続化
  saveData() {
    const data = {
      participants: this.participants,
      answersData: this.answersData,
      diagnosisResults: this.diagnosisResults,
      feedbackData: this.feedbackData,
      lastSaved: new Date().toISOString(),
    };

    localStorage.setItem("haqei_test_input_data", JSON.stringify(data));
  }

  loadSavedData() {
    const saved = localStorage.getItem("haqei_test_input_data");
    if (saved) {
      const data = JSON.parse(saved);
      this.participants = data.participants || [];
      this.answersData = data.answersData || {};
      this.diagnosisResults = data.diagnosisResults || {};
      this.feedbackData = data.feedbackData || {};
    }
  }

  // エクスポート機能
  exportAllResults() {
    const format = document.getElementById("output-format").value;
    const results = {};

    Object.keys(this.diagnosisResults).forEach((participantId) => {
      results[participantId] = this.generateUserText(participantId, format);
    });

    const exportData = {
      format,
      results,
      exportedAt: new Date().toISOString(),
      totalCount: Object.keys(results).length,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `haqei_test_results_${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // UI更新メソッド群
  updateParticipantSelects() {
    /* 実装 */
  }
  updateInputProgress() {
    /* 実装 */
  }
  updateResultsList() {
    /* 実装 */
  }
  updateFeedbackSummary() {
    /* 実装 */
  }
  // ... その他のUI更新メソッド
}

// タブ切り替え
function showTab(tabName) {
  // 実装
}

// システム初期化
document.addEventListener("DOMContentLoaded", () => {
  window.testSystem = new TestInputSystem();
});
