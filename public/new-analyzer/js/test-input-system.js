// TestInputSystem.js - 手動テスト用データ入力・管理システム

// グローバル変数として参照（import文は使用しない）

class TestInputSystem {
  constructor() {
    this.participants = [];
    this.answersData = {};
    this.diagnosisResults = {};
    this.feedbackData = {};
    this.questions = {
      worldview:
        typeof window.WORLDVIEW_QUESTIONS !== "undefined"
          ? window.WORLDVIEW_QUESTIONS
          : [],
      scenarios:
        typeof window.SCENARIO_QUESTIONS !== "undefined"
          ? window.SCENARIO_QUESTIONS
          : [],
    };

    // 必要なクラスの存在チェック
    if (typeof window.DataManager === "undefined") {
      console.error("❌ DataManagerクラスが見つかりません");
      alert(
        "DataManagerクラスが読み込まれていません。ページを再読み込みしてください。"
      );
      return;
    }

    if (typeof window.TripleOSEngine === "undefined") {
      console.error("❌ TripleOSEngineクラスが見つかりません");
      alert(
        "TripleOSEngineクラスが読み込まれていません。ページを再読み込みしてください。"
      );
      return;
    }

    console.log("✅ 必要なクラスが読み込まれています");
    this.init();
  }

  init() {
    this.loadSavedData();
    this.generateQuestionInputs();
    this.updateParticipantSelects();
    this.updateInputProgress();
    this.updateResultsList(); // 追加
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

  // クリップボードから貼り付け
  async pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        document.getElementById("participants-list").value = text;
        alert("クリップボードから貼り付けました");
      } else {
        alert("クリップボードにテキストがありません");
      }
    } catch (error) {
      console.error("クリップボード読み取りエラー:", error);
      alert(
        "クリップボードへのアクセスが拒否されました。手動で貼り付けてください。"
      );
    }
  }

  // 対象者リストクリア
  clearParticipantsList() {
    if (confirm("対象者リストをクリアしますか？")) {
      document.getElementById("participants-list").value = "";
    }
  }

  // 回答書式をクリップボードから貼り付け
  async pasteAnswersFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        document.getElementById("answers-format-input").value = text;
        alert("回答書式をクリップボードから貼り付けました");
      } else {
        alert("クリップボードにテキストがありません");
      }
    } catch (error) {
      console.error("クリップボード読み取りエラー:", error);
      alert(
        "クリップボードへのアクセスが拒否されました。手動で貼り付けてください。"
      );
    }
  }

  // 一括処理用のクリップボードから貼り付け
  async pasteBatchAnswersFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        document.getElementById("batch-answers-input").value = text;
        alert("回答データをクリップボードから貼り付けました");
      } else {
        alert("クリップボードにテキストがありません");
      }
    } catch (error) {
      console.error("クリップボード読み取りエラー:", error);
      alert(
        "クリップボードへのアクセスが拒否されました。手動で貼り付けてください。"
      );
    }
  }

  // 回答書式を解析してフォームに反映
  parseAnswersFormat() {
    const text = document.getElementById("answers-format-input").value;
    if (!text.trim()) {
      alert("回答データを入力してください");
      return;
    }

    try {
      const answers = this.parseMultipleAnswers(text);
      if (answers.length === 0) {
        alert("有効な回答データが見つかりませんでした");
        return;
      }

      // 各回答を処理
      answers.forEach((answerData, index) => {
        const participantId = `user${String(index + 1).padStart(3, "0")}`;

        // 参加者情報を保存
        this.participants.push({
          id: participantId,
          name: answerData.participantInfo.name,
          age: answerData.participantInfo.age,
          gender: answerData.participantInfo.gender,
          occupation: answerData.participantInfo.occupation,
        });

        // 回答データを保存
        this.answersData[participantId] = answerData.answers;
      });

      this.saveData();
      this.updateDisplay();

      alert(`${answers.length}人分の回答データを解析・保存しました！`);
    } catch (error) {
      console.error("回答解析エラー:", error);
      alert("回答データの解析中にエラーが発生しました: " + error.message);
    }
  }

  // 複数回答の解析
  parseMultipleAnswers(text) {
    const answers = [];

    // 回答セクションを分割（### 回答X/10 で区切る）
    const sections = text.split(/### 回答\d+\/\d+/);

    sections.forEach((section, index) => {
      if (index === 0) return; // 最初の空セクションをスキップ

      try {
        const answerData = this.parseSingleAnswer(section);
        if (answerData) {
          answers.push(answerData);
        }
      } catch (error) {
        console.warn(`回答${index}の解析でエラー:`, error);
      }
    });

    return answers;
  }

  // 単一回答の解析
  parseSingleAnswer(text) {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);

    // 参加者情報を抽出
    const participantInfo = this.extractParticipantInfo(lines);
    if (!participantInfo) {
      return null;
    }

    // 回答データを抽出
    const answers = this.extractAnswers(lines);
    if (!answers) {
      return null;
    }

    return {
      participantInfo,
      answers,
    };
  }

  // 参加者情報の抽出
  extractParticipantInfo(lines) {
    const participantInfo = {};
    let inParticipantSection = false;

    for (const line of lines) {
      if (line.includes("【参加者情報】")) {
        inParticipantSection = true;
        continue;
      }

      if (line.includes("【第1部：価値観設問回答】")) {
        break;
      }

      if (inParticipantSection && line.includes(":")) {
        const [key, value] = line.split(":").map((s) => s.trim());
        switch (key) {
          case "お名前":
            participantInfo.name = value;
            break;
          case "年齢":
            participantInfo.age = value.replace("歳", "");
            break;
          case "性別":
            participantInfo.gender = value;
            break;
          case "職業":
            participantInfo.occupation = value;
            break;
        }
      }
    }

    // 必須項目のチェック
    if (
      !participantInfo.name ||
      !participantInfo.age ||
      !participantInfo.gender ||
      !participantInfo.occupation
    ) {
      return null;
    }

    return participantInfo;
  }

  // 回答データの抽出
  extractAnswers(lines) {
    const answers = {};
    let inWorldviewSection = false;
    let inScenarioSection = false;

    for (const line of lines) {
      if (line.includes("【第1部：価値観設問回答】")) {
        inWorldviewSection = true;
        inScenarioSection = false;
        continue;
      }

      if (line.includes("【第2部：シナリオ設問回答】")) {
        inWorldviewSection = false;
        inScenarioSection = true;
        continue;
      }

      if (line.includes("---")) {
        break;
      }

      if (inWorldviewSection && line.includes(":")) {
        const [question, answer] = line.split(":").map((s) => s.trim());
        if (question.startsWith("Q") && answer) {
          answers[question] = answer;
        }
      }

      if (inScenarioSection && line.includes(":")) {
        const [question, answer] = line.split(":").map((s) => s.trim());
        if (question.startsWith("Q") && answer) {
          answers[question] = answer;
        }
      }
    }

    // 最低限の回答があるかチェック
    const worldviewCount = Object.keys(answers).filter((k) =>
      k.match(/^Q[1-9]$|^Q1[0-9]$|^Q2[0-4]$/)
    ).length;
    const scenarioCount = Object.keys(answers).filter((k) =>
      k.match(/^Q2[5-9]_|^Q30_/)
    ).length;

    if (worldviewCount < 20 || scenarioCount < 10) {
      return null;
    }

    return answers;
  }

  // 回答データをエンジン用形式に変換
  convertAnswersToEngineFormat(rawAnswers) {
    const engineAnswers = {};

    // 価値観設問（Q1-Q24）を変換
    for (let i = 1; i <= 24; i++) {
      const questionKey = `Q${i}`;
      if (rawAnswers[questionKey]) {
        engineAnswers[`q${i}`] = rawAnswers[questionKey];
      }
    }

    // シナリオ設問（Q25-Q30）を変換
    for (let i = 25; i <= 30; i++) {
      const innerKey = `Q${i}_内面`;
      const outerKey = `Q${i}_外面`;

      if (rawAnswers[innerKey] && rawAnswers[outerKey]) {
        engineAnswers[`q${i}`] = {
          inner: rawAnswers[innerKey],
          outer: rawAnswers[outerKey],
        };
      }
    }

    return engineAnswers;
  }

  // 回答データ一括処理メソッド
  processBatchAnswers(rawText) {
    try {
      // 改行で分割して回答ブロックを抽出
      const lines = rawText.split("\n");
      const participants = [];
      let currentParticipant = null;
      let currentSection = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // 新しい参加者の開始を検出
        if (line.includes("【参加者情報】")) {
          if (currentParticipant) {
            participants.push(currentParticipant);
          }
          currentParticipant = {
            info: {},
            worldviewAnswers: {},
            scenarioAnswers: {},
          };
          currentSection = "info";
          continue;
        }

        // セクション切り替えを検出
        if (line.includes("【第1部：価値観設問回答】")) {
          currentSection = "worldview";
          continue;
        }

        if (line.includes("【第2部：シナリオ設問回答】")) {
          currentSection = "scenario";
          continue;
        }

        // 参加者情報の解析
        if (currentSection === "info" && line.includes(":")) {
          const [key, value] = line.split(":").map((s) => s.trim());
          if (key === "お名前") currentParticipant.info.name = value;
          if (key === "年齢") currentParticipant.info.age = value;
          if (key === "性別") currentParticipant.info.gender = value;
          if (key === "職業") currentParticipant.info.occupation = value;
        }

        // 価値観設問回答の解析
        if (currentSection === "worldview" && line.match(/^Q\d+:/)) {
          const [question, answer] = line.split(":").map((s) => s.trim());
          currentParticipant.worldviewAnswers[question] = answer;
        }

        // シナリオ設問回答の解析
        if (currentSection === "scenario" && line.match(/^Q\d+_/)) {
          const [question, answer] = line.split(":").map((s) => s.trim());
          currentParticipant.scenarioAnswers[question] = answer;
        }
      }

      // 最後の参加者を追加
      if (currentParticipant) {
        participants.push(currentParticipant);
      }

      return participants;
    } catch (error) {
      console.error("回答データ解析エラー:", error);
      throw new Error("回答データの解析に失敗しました: " + error.message);
    }
  }

  // 参加者データをシステム形式に変換
  convertToSystemFormat(participantData) {
    try {
      // 参加者情報を登録
      const participant = {
        id: this.generateParticipantId(participantData.info.name),
        name: participantData.info.name,
        age: participantData.info.age,
        gender: participantData.info.gender,
        occupation: participantData.info.occupation,
      };

      // 回答データを変換（既存の形式に合わせる）
      const answers = {};

      // 価値観設問の変換
      Object.entries(participantData.worldviewAnswers).forEach(
        ([questionKey, selectedValue]) => {
          answers[questionKey] = selectedValue;
        }
      );

      // シナリオ設問の変換
      Object.entries(participantData.scenarioAnswers).forEach(
        ([questionKey, selectedValue]) => {
          answers[questionKey] = selectedValue;
        }
      );

      return { participant, answers };
    } catch (error) {
      console.error("データ変換エラー:", error);
      throw new Error("データ変換に失敗しました: " + error.message);
    }
  }

  // 参加者ID生成
  generateParticipantId(name) {
    // 名前から簡単なIDを生成
    const nameId = name.replace(/\s+/g, "").toLowerCase();
    const timestamp = Date.now().toString().slice(-4);
    return `${nameId}_${timestamp}`;
  }

  // 一括処理実行メソッド
  async processBatchAndGenerate(rawAnswersText) {
    try {
      console.log("🔄 一括処理を開始...");

      // ローディング表示
      const progressDiv = document.getElementById("batch-progress");
      if (progressDiv) {
        progressDiv.innerHTML =
          '<div class="processing">📊 回答データを解析中...</div>';
      }

      // 1. 回答データを解析
      const participantsData = this.processBatchAnswers(rawAnswersText);
      console.log(`📝 ${participantsData.length}人の回答データを解析しました`);

      if (progressDiv) {
        progressDiv.innerHTML =
          '<div class="processing">👥 参加者情報を登録中...</div>';
      }

      // 2. 参加者とデータを登録
      const processedCount = participantsData.length;
      let successCount = 0;
      let failCount = 0;
      const results = [];

      for (let i = 0; i < participantsData.length; i++) {
        try {
          if (progressDiv) {
            progressDiv.innerHTML = `<div class="processing">🔬 診断実行中... (${
              i + 1
            }/${processedCount})</div>`;
          }

          // データ変換
          const { participant, answers } = this.convertToSystemFormat(
            participantsData[i]
          );

          // システムに登録
          this.participants.push(participant);
          this.answersData[participant.id] = answers;

          // 診断実行
          const dataManager = new window.DataManager();
          await dataManager.loadData();
          const engine = new window.TripleOSEngine(dataManager);

          const engineAnswers = this.convertAnswersToEngineFormat(answers);
          const diagnosisResult = await engine.analyzeTripleOS(engineAnswers);

          this.diagnosisResults[participant.id] = {
            result: diagnosisResult,
            processedAt: new Date().toISOString(),
            participant: participant,
          };

          // 結果テキスト生成
          const resultText = this.generateProductionLevelText(participant.id);

          results.push({
            participant,
            resultText,
            success: true,
          });

          successCount++;
          console.log(`✅ ${participant.name} の診断完了`);
        } catch (error) {
          console.error(
            `❌ ${participantsData[i].info.name} の処理エラー:`,
            error
          );
          results.push({
            participant: participantsData[i].info,
            error: error.message,
            success: false,
          });
          failCount++;
        }
      }

      // データ保存
      this.saveData();
      this.updateDisplay();

      if (progressDiv) {
        progressDiv.innerHTML = `
          <div class="processing-complete">
            ✅ 処理完了: 成功 ${successCount}人 / 失敗 ${failCount}人
          </div>
        `;
      }

      // 結果表示
      this.showBatchResults(results);

      return results;
    } catch (error) {
      console.error("❌ 一括処理エラー:", error);
      alert("一括処理中にエラーが発生しました: " + error.message);
      throw error;
    }
  }

  // 一括結果表示
  showBatchResults(results) {
    const modalContent = `
      <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; max-width: 90vw; max-height: 90vh; overflow-y: auto; color: white;">
        <h3>📊 一括処理結果 (${results.length}人)</h3>

        <div style="margin: 20px 0;">
          <button onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'"
                  style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
            📋 全員の結果をまとめてコピー
          </button>
          <textarea readonly style="display: none; width: 100%; height: 200px; margin-top: 10px; background: #1a1a1a; color: #e1e1e1; border: 1px solid #444; padding: 10px; font-family: monospace; font-size: 0.8rem;">${this.generateAllResultsText(
            results
          )}</textarea>
        </div>

        <div class="results-list">
          ${results
            .map((result, index) => this.renderSingleResultItem(result, index))
            .join("")}
        </div>

        <div style="margin-top: 20px; text-align: center;">
          <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()"
                  style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
            閉じる
          </button>
        </div>
      </div>
    `;

    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.9); z-index: 1000;
      display: flex; align-items: center; justify-content: center;
    `;
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
  }

  // 個別結果アイテムのレンダリング
  renderSingleResultItem(result, index) {
    if (!result.success) {
      return `
        <div style="border: 1px solid #ef4444; border-radius: 4px; margin: 10px 0; padding: 15px; background: #2a1a1a;">
          <h4 style="color: #ef4444; margin: 0 0 10px 0;">❌ ${result.participant.name} - 処理失敗</h4>
          <p style="color: #fca5a5; margin: 0;">エラー: ${result.error}</p>
        </div>
      `;
    }

    return `
      <div style="border: 1px solid #10b981; border-radius: 4px; margin: 10px 0; padding: 15px; background: #1a2a1a;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h4 style="color: #10b981; margin: 0;">✅ ${
            result.participant.name
          }</h4>
          <div>
            <button onclick="navigator.clipboard.writeText(this.getAttribute('data-result')); alert('📋 ${
              result.participant.name
            }の結果をコピーしました！')"
                    data-result="${result.resultText.replace(/"/g, "&quot;")}"
                    style="background: #6366f1; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin: 0 2px; font-size: 0.8rem;">
              📋 コピー
            </button>
            <button onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'"
                    style="background: #8b5cf6; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin: 0 2px; font-size: 0.8rem;">
              👁️ プレビュー
            </button>
            <div style="display: none; margin-top: 10px; max-height: 200px; overflow-y: auto; background: #1a1a1a; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 0.7rem; white-space: pre-wrap;">${
              result.resultText
            }</div>
          </div>
        </div>
        <p style="color: #d1d5db; margin: 0; font-size: 0.9rem;">
          ${result.participant.age} / ${result.participant.gender} / ${
      result.participant.occupation
    }
        </p>
      </div>
    `;
  }

  // 全結果統合テキスト生成
  generateAllResultsText(results) {
    return results
      .filter((r) => r.success)
      .map(
        (r) => `
═══════════════════════════════════════════
${r.participant.name}さん用の送信テキスト
═══════════════════════════════════════════

${r.resultText}

═══════════════════════════════════════════
      `
      )
      .join("\n");
  }

  // UI用の一括処理開始関数
  startBatchProcessing() {
    console.log("🚀 一括処理開始");

    const rawText = document.getElementById("batch-answers-input").value;
    console.log("入力テキスト:", rawText.substring(0, 200) + "...");

    if (!rawText.trim()) {
      alert("回答データを入力してください");
      return;
    }

    if (!confirm("一括処理を開始しますか？\n※ 既存のデータに追加されます")) {
      return;
    }

    console.log("一括処理実行中...");

    // 進捗表示を初期化
    const progressElement = document.getElementById("batch-progress");
    if (progressElement) {
      progressElement.innerHTML =
        '<div class="progress-message">🔄 一括処理を開始しています...</div>';
    }

    this.processBatchAndGenerate(rawText)
      .then((results) => {
        console.log("一括処理完了:", results);
        if (progressElement) {
          progressElement.innerHTML =
            '<div class="progress-message success">✅ 一括処理が完了しました！</div>';
        }
      })
      .catch((error) => {
        console.error("一括処理エラー:", error);
        if (progressElement) {
          progressElement.innerHTML = `<div class="progress-message error">❌ エラーが発生しました: ${error.message}</div>`;
        }
        alert(`一括処理でエラーが発生しました: ${error.message}`);
      });
  }

  // 参加者情報を更新
  updateParticipantInfo(participantInfo) {
    const select = document.getElementById("current-participant");

    // 既存の参加者を検索
    const existingParticipant = this.participants.find(
      (p) =>
        p.name === participantInfo.name ||
        p.name.includes(participantInfo.name) ||
        participantInfo.name.includes(p.name)
    );

    if (existingParticipant) {
      select.value = existingParticipant.id;
    } else {
      // 新しい参加者として追加
      const newId = `user${String(this.participants.length + 1).padStart(
        3,
        "0"
      )}`;
      const newParticipant = {
        id: newId,
        name: participantInfo.name,
        age: participantInfo.age,
        gender: participantInfo.gender,
        occupation: participantInfo.occupation,
      };

      this.participants.push(newParticipant);
      this.updateParticipantSelects();
      select.value = newId;
    }
  }

  // 価値観設問の入力フィールドを更新
  updateWorldviewInputs(answers) {
    Object.entries(answers).forEach(([questionId, answer]) => {
      const input = document.querySelector(
        `#worldview-inputs [data-question-id="${questionId}"] .answer-select`
      );
      if (input) {
        input.value = answer;
      }
    });
  }

  // シナリオ設問の入力フィールドを更新
  updateScenarioInputs(answers) {
    Object.entries(answers).forEach(([questionId, questionAnswers]) => {
      if (questionAnswers.inner) {
        const innerInput = document.querySelector(
          `#scenario-inputs [data-question-id="${questionId}"] .inner-choice`
        );
        if (innerInput) {
          innerInput.value = questionAnswers.inner;
        }
      }
      if (questionAnswers.outer) {
        const outerInput = document.querySelector(
          `#scenario-inputs [data-question-id="${questionId}"] .outer-choice`
        );
        if (outerInput) {
          outerInput.value = questionAnswers.outer;
        }
      }
    });
  }

  // 回答書式をクリア
  clearAnswersFormat() {
    if (confirm("回答書式をクリアしますか？")) {
      document.getElementById("answers-format-input").value = "";
    }
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

  // 一括診断実行
  async executeAllDiagnosis(event) {
    if (this.participants.length === 0) {
      alert("対象者が登録されていません");
      return;
    }

    const button = event.target;
    button.disabled = true;
    button.textContent = "🔬 診断実行中...";

    try {
      const dataManager = new window.DataManager();
      await dataManager.loadData();
      const engine = new window.TripleOSEngine(dataManager);

      let completedCount = 0;
      const totalCount = this.participants.length;

      for (const participant of this.participants) {
        try {
          if (this.answersData[participant.id]) {
            const rawAnswers = this.answersData[participant.id];
            const answers = this.convertAnswersToEngineFormat(rawAnswers);
            const result = await engine.analyzeTripleOS(answers);

            this.diagnosisResults[participant.id] = {
              result,
              processedAt: new Date().toISOString(),
              participant: participant,
            };

            completedCount++;
            this.updateDiagnosisProgress(completedCount, totalCount);
          }
        } catch (error) {
          console.error(`❌ Error processing ${participant.id}:`, error);
        }
      }

      this.saveData();
      this.updateDisplay();
      alert(
        `診断完了！ ${completedCount}/${totalCount} 人の診断が完了しました`
      );
    } catch (error) {
      console.error("❌ Diagnosis execution error:", error);
      alert("診断実行中にエラーが発生しました: " + error.message);
    } finally {
      button.disabled = false;
      button.textContent = "🔬 全員の診断実行";
    }
  }

  // 診断進捗表示
  updateDiagnosisProgress(completed, total) {
    const progressContainer = document.getElementById(
      "single-diagnosis-status"
    );
    if (progressContainer) {
      const percentage = Math.round((completed / total) * 100);
      progressContainer.innerHTML = `
        <div class="progress-info">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="progress-text">${completed}/${total} 完了 (${percentage}%)</div>
        </div>
      `;
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
  // 参加者セレクトの更新
  updateParticipantSelects() {
    const selects = ["current-participant", "feedback-participant"];

    selects.forEach((selectId) => {
      const select = document.getElementById(selectId);
      if (!select) return;

      // 既存のオプションをクリア（最初のオプション以外）
      while (select.children.length > 1) {
        select.removeChild(select.lastChild);
      }

      // 参加者を追加
      this.participants.forEach((participant) => {
        const option = document.createElement("option");
        option.value = participant.id;
        option.textContent = `${participant.id} - ${participant.name}`;
        select.appendChild(option);
      });
    });
  }

  // 個別診断ボタン状態更新
  updateSingleDiagnosisButtons(participantId) {
    const hasAnswers = participantId && this.answersData[participantId];
    const hasResult = participantId && this.diagnosisResults[participantId];

    const diagnosisBtn = document.getElementById("single-diagnosis-btn");
    const showResultBtn = document.getElementById("show-single-result-btn");
    const copyResultBtn = document.getElementById("copy-single-result-btn");

    if (diagnosisBtn) {
      diagnosisBtn.disabled = !hasAnswers;
      diagnosisBtn.textContent = hasAnswers
        ? "🔬 この人の診断実行"
        : "🔬 回答データが必要";
    }

    if (showResultBtn) {
      showResultBtn.disabled = !hasResult;
      showResultBtn.textContent = hasResult ? "📄 結果表示" : "📄 診断結果なし";
    }

    if (copyResultBtn) {
      copyResultBtn.disabled = !hasResult;
      copyResultBtn.textContent = hasResult
        ? "📋 結果コピー"
        : "📋 診断結果なし";
    }
  }

  // 結果表示ボタン状態更新
  updateResultViewButtons(participantId) {
    const hasResult = participantId && this.diagnosisResults[participantId];

    const viewButtons = document.querySelectorAll(".result-actions .btn");
    viewButtons.forEach((btn) => {
      btn.disabled = !hasResult;
    });

    // プレビューエリアをクリア
    const previewContainer = document.getElementById("single-result-preview");
    if (previewContainer) {
      previewContainer.innerHTML = hasResult
        ? ""
        : "<p>診断結果を選択してください</p>";
    }
  }

  // 入力進捗の更新
  updateInputProgress() {
    const container = document.getElementById("input-progress");
    if (!container) return;

    const totalParticipants = this.participants.length;
    const completedAnswers = Object.keys(this.answersData).length;
    const completedDiagnosis = Object.keys(this.diagnosisResults).length;

    container.innerHTML = `
      <div class="progress-indicator">
        <h4>📊 進捗状況</h4>
        <p>参加者登録: ${totalParticipants}人</p>
        <p>回答完了: ${completedAnswers}人</p>
        <p>診断完了: ${completedDiagnosis}人</p>
        ${
          totalParticipants > 0
            ? `<div style="margin-top: 10px;">
            <div style="background: #f0f0f0; height: 10px; border-radius: 5px; overflow: hidden;">
              <div style="background: #4CAF50; height: 100%; width: ${
                (completedAnswers / totalParticipants) * 100
              }%; transition: width 0.3s;"></div>
            </div>
            <small>回答進捗: ${Math.round(
              (completedAnswers / totalParticipants) * 100
            )}%</small>
          </div>`
            : ""
        }
      </div>
    `;
  }

  // 結果一覧の更新
  updateResultsList() {
    const container = document.getElementById("results-list");
    if (!container) return;

    const results = Object.keys(this.diagnosisResults);
    if (results.length === 0) {
      container.innerHTML = "<p>診断結果がありません</p>";
      return;
    }

    container.innerHTML = results
      .map((participantId) => {
        const data = this.diagnosisResults[participantId];
        const participant = data.participant;
        const hasError = !!data.error;

        return `
        <div class="result-item" style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #ccc; border-radius: 8px;">
          <h4>${participant?.name || participantId}</h4>
          ${
            hasError
              ? `<p style="color: red;">エラー: ${data.error}</p>`
              : `<p>処理完了 - ${data.processedAt}</p>
             <button class="btn" onclick="window.testSystem.showResultDetail('${participantId}')">
               📄 結果を表示
             </button>
             <button class="btn btn-secondary" onclick="window.testSystem.copyResult('${participantId}')">
               📋 コピー
             </button>`
          }
        </div>
      `;
      })
      .join("");
  }

  updateFeedbackSummary() {
    const summaryContainer = document.getElementById("feedback-summary");
    if (!summaryContainer) return;

    const feedbackEntries = Object.values(this.feedbackData);
    if (feedbackEntries.length === 0) {
      summaryContainer.innerHTML = "<p>フィードバックデータがありません。</p>";
      return;
    }

    const averageAccuracy = this.calculateAverage(feedbackEntries, "accuracy");
    const averageSatisfaction = this.calculateAverage(
      feedbackEntries,
      "satisfaction"
    );

    summaryContainer.innerHTML = `
        <div class="feedback-summary-stats">
            <div class="stat-item">
                <span class="stat-label">総回答数:</span>
                <span class="stat-value">${feedbackEntries.length}人</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">平均的中度:</span>
                <span class="stat-value">${averageAccuracy.toFixed(
                  1
                )}/5.0</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">平均満足度:</span>
                <span class="stat-value">${averageSatisfaction.toFixed(
                  1
                )}/5.0</span>
            </div>
        </div>
    `;
  }

  // ヘルパーメソッド
  calculateAverage(array, property) {
    const values = array
      .map((item) => item[property])
      .filter((val) => typeof val === "number");
    return values.length > 0
      ? values.reduce((sum, val) => sum + val, 0) / values.length
      : 0;
  }

  calculateDistribution(array, property) {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    array.forEach((item) => {
      const value = item[property];
      if (typeof value === "number" && value >= 1 && value <= 5) {
        distribution[value]++;
      }
    });
    return distribution;
  }

  analyzeImpressions(feedbackEntries) {
    const impressions = {};
    feedbackEntries.forEach((entry) => {
      entry.impressive.forEach((impression) => {
        impressions[impression] = (impressions[impression] || 0) + 1;
      });
    });
    return Object.entries(impressions)
      .sort(([, a], [, b]) => b - a)
      .map(([impression, count]) => ({ impression, count }));
  }

  identifyLowAccuracyCases(feedbackEntries) {
    return feedbackEntries
      .filter((entry) => entry.accuracy <= 2)
      .map((entry) => ({
        participantId: entry.participantId,
        accuracy: entry.accuracy,
        comments: entry.comments,
      }));
  }

  generateRecommendations(feedbackEntries) {
    const recommendations = [];
    const averageAccuracy = this.calculateAverage(feedbackEntries, "accuracy");

    if (averageAccuracy < 3.0) {
      recommendations.push(
        "的中度が低いため、質問項目の見直しを検討してください"
      );
    }
    if (averageAccuracy < 2.5) {
      recommendations.push("アルゴリズムの根本的な改善が必要です");
    }

    return recommendations;
  }

  // 結果表示・コピー機能
  viewResult(participantId) {
    const data = this.diagnosisResults[participantId];
    if (!data || !data.result) {
      alert("結果が見つかりません");
      return;
    }

    const text = this.generateUserText(participantId, "detailed");
    alert(text);
  }

  // 結果詳細表示
  showResultDetail(participantId) {
    const data = this.diagnosisResults[participantId];
    if (!data || !data.result) {
      alert("結果データが見つかりません");
      return;
    }

    const userText = this.generateUserText(participantId, "detailed");

    // モーダルまたは新しいウィンドウで表示
    const popup = window.open(
      "",
      "_blank",
      "width=800,height=600,scrollbars=yes"
    );
    popup.document.write(`
      <html>
        <head><title>${data.participant.name}さんの診断結果</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
          <pre style="white-space: pre-wrap; word-wrap: break-word;">${userText}</pre>
        </body>
      </html>
    `);
    popup.document.close();
  }

  // 結果をクリップボードにコピー
  copyResult(participantId) {
    const userText = this.generateUserText(participantId, "detailed");

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(userText)
        .then(() => {
          alert("結果をクリップボードにコピーしました！");
        })
        .catch((err) => {
          console.error("コピーに失敗:", err);
          this.fallbackCopyText(userText);
        });
    } else {
      this.fallbackCopyText(userText);
    }
  }

  // フォールバック用コピー機能
  fallbackCopyText(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("結果をクリップボードにコピーしました！");
  }

  copyResultsForSharing() {
    const format = document.getElementById("output-format").value;
    const results = Object.keys(this.diagnosisResults)
      .map((participantId) => this.generateUserText(participantId, format))
      .join("\n\n---\n\n");

    navigator.clipboard
      .writeText(results)
      .then(() => {
        alert("全結果をクリップボードにコピーしました");
      })
      .catch(() => {
        alert("コピーに失敗しました");
      });
  }

  generateDebugReport() {
    const report = {
      timestamp: new Date().toISOString(),
      participants: this.participants,
      answersData: this.answersData,
      diagnosisResults: this.diagnosisResults,
      feedbackData: this.feedbackData,
      analysis: this.generateAnalysisReport(),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `haqei_debug_report_${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  clearCurrentAnswers() {
    if (confirm("現在の回答をクリアしますか？")) {
      document
        .querySelectorAll("#worldview-inputs .answer-select")
        .forEach((select) => {
          select.value = "";
        });
      document
        .querySelectorAll(
          "#scenario-inputs .inner-choice, #scenario-inputs .outer-choice"
        )
        .forEach((select) => {
          select.value = "";
        });
    }
  }

  // 一人用診断実行機能
  async executeSingleDiagnosis(participantId) {
    try {
      if (!this.answersData[participantId]) {
        alert("この参加者の回答データが見つかりません");
        return;
      }

      const button = event.target;
      button.disabled = true;
      button.textContent = "🔬 診断中...";

      // 既存のエンジンを使用
      const dataManager = new window.DataManager();
      await dataManager.loadData();
      const engine = new window.TripleOSEngine(dataManager);

      const rawAnswers = this.answersData[participantId];
      const answers = this.convertAnswersToEngineFormat(rawAnswers);
      const result = await engine.analyzeTripleOS(answers);

      this.diagnosisResults[participantId] = {
        result,
        processedAt: new Date().toISOString(),
        participant: this.participants.find((p) => p.id === participantId),
      };

      this.saveData();

      // 結果テキストを即座に表示
      this.showSingleResult(participantId);

      alert(`${participantId}の診断が完了しました！`);
    } catch (error) {
      console.error(`❌ Error processing ${participantId}:`, error);
      alert("診断実行中にエラーが発生しました: " + error.message);
    } finally {
      const button = event.target;
      if (button) {
        button.disabled = false;
        button.textContent = "🔬 診断実行";
      }
    }
  }

  // 本番と同じ結果テキスト生成
  generateProductionLevelText(participantId) {
    const data = this.diagnosisResults[participantId];
    if (!data || !data.result) return "エラー: 診断結果が見つかりません";

    const result = data.result;
    const participant = data.participant;

    return `
🎯 ${participant.name}さんの人格OS診断結果

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【あなたの3層人格OS】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 **エンジンOS（核となる価値観・動機）**
「${result.engineOS.hexagramInfo.name}」
${result.engineOS.hexagramInfo.catchphrase || ""}

${result.engineOS.hexagramInfo.description || ""}

構成八卦: ${this.getTrigramComposition(result.engineOS)}
エンジン強度: ${Math.round((result.engineOS.strength || 0.8) * 100)}%

🖥️ **インターフェースOS（外面的な行動パターン）**
「${result.interfaceOS.hexagramInfo.name}」
マッチ度: ${Math.round(result.interfaceOS.matchScore)}%

${result.interfaceOS.hexagramInfo.description || ""}

あなたは外向きには${
      result.interfaceOS.hexagramInfo.name
    }的な振る舞いを示します。

🛡️ **セーフモードOS（内面的な防御機制）**
「${result.safeModeOS.hexagramInfo.name}」
マッチ度: ${Math.round(result.safeModeOS.matchScore)}%

${result.safeModeOS.hexagramInfo.description || ""}

ストレス時や困難な状況では、${
      result.safeModeOS.hexagramInfo.name
    }の防御パターンが発動します。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【人格一貫性分析】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 **総合一貫性スコア: ${Math.round(result.consistencyScore.overall * 100)}%**

🔧↔🖥️ エンジン⇔インターフェース: ${Math.round(
      result.consistencyScore.engineInterface * 100
    )}%
🔧↔🛡️ エンジン⇔セーフモード: ${Math.round(
      result.consistencyScore.engineSafeMode * 100
    )}%
🖥️↔🛡️ インターフェース⇔セーフモード: ${Math.round(
      result.consistencyScore.interfaceSafeMode * 100
    )}%

${this.generateConsistencyInsight(result.consistencyScore)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【統合的洞察】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${result.integration.summary}

💡 **エンジンOSの特徴**
${result.integration.engineInsight}

💡 **インターフェースOSの特徴**
${result.integration.interfaceInsight}

💡 **セーフモードOSの特徴**
${result.integration.safeModeInsight}

💡 **一貫性について**
${result.integration.consistencyInsight}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【あなたへの推奨事項】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${result.integration.recommendations
  .map((rec, index) => `${index + 1}. ${rec}`)
  .join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【8次元バランス概要】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${this.generate8DimensionSummary(result.engineOS.userVector)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ **診断完了日時**: ${new Date(data.processedAt).toLocaleString("ja-JP")}
🎯 **HaQei Analyzer v1.0** - 古代の叡智と現代のテクノロジーの融合

この診断結果はいかがでしたか？
ぜひあなたの率直なフィードバックをお聞かせください 🙏
        `.trim();
  }

  // 8次元バランス要約生成
  generate8DimensionSummary(userVector) {
    const dimensions = [
      { key: "乾_創造性", name: "創造性", icon: "🌟" },
      { key: "震_行動性", name: "行動性", icon: "⚡" },
      { key: "坎_探求性", name: "探求性", icon: "🔍" },
      { key: "艮_安定性", name: "安定性", icon: "🗻" },
      { key: "坤_受容性", name: "受容性", icon: "🌍" },
      { key: "巽_適応性", name: "適応性", icon: "🌊" },
      { key: "離_表現性", name: "表現性", icon: "🔥" },
      { key: "兌_調和性", name: "調和性", icon: "☯️" },
    ];

    // スコア順にソート
    const sortedDimensions = dimensions
      .map((dim) => ({
        ...dim,
        score: userVector[dim.key] || 0,
      }))
      .sort((a, b) => b.score - a.score);

    const top3 = sortedDimensions.slice(0, 3);
    const bottom2 = sortedDimensions.slice(-2);

    return `
🌟 **強い特徴 (上位3次元)**
${top3
  .map(
    (dim, index) =>
      `${index + 1}. ${dim.icon} ${dim.name}: ${dim.score.toFixed(
        1
      )} - ${this.getDimensionDescription(dim.key, dim.score)}`
  )
  .join("\n")}

🌱 **成長の余地 (下位2次元)**
${bottom2
  .map(
    (dim) =>
      `• ${dim.icon} ${dim.name}: ${dim.score.toFixed(
        1
      )} - 意識的に伸ばすことで、よりバランスの取れた人格へ`
  )
  .join("\n")}
        `.trim();
  }

  // 一貫性洞察生成
  generateConsistencyInsight(consistencyScore) {
    const overall = consistencyScore.overall;

    if (overall >= 0.8) {
      return "あなたの3層OSは非常に高い一貫性を示しており、内面と外面が調和した安定した人格構造を持っています。";
    } else if (overall >= 0.6) {
      return "あなたの3層OSは適度な一貫性を保ちながらも、状況に応じた柔軟性を持った人格構造です。";
    } else if (overall >= 0.4) {
      return "あなたの3層OSにはある程度の多様性があり、複雑で多面的な人格の特徴を示しています。";
    } else {
      return "あなたの3層OSは非常に多様で複雑な構造を持ち、状況に応じて大きく異なる面を見せる人格です。";
    }
  }

  // 次元説明生成（簡略版）
  getDimensionDescription(dimensionKey, score) {
    const descriptions = {
      乾_創造性:
        score >= 2
          ? "新しいアイデアを生み出す力が強い"
          : "安定した方法を好む傾向",
      震_行動性:
        score >= 2
          ? "エネルギッシュで行動力がある"
          : "慎重に考えてから動く傾向",
      坎_探求性:
        score >= 2 ? "物事の本質を深く追求する" : "実用的な知識を重視する傾向",
      艮_安定性:
        score >= 2 ? "継続性と着実さを重視する" : "変化を好む動的な傾向",
      坤_受容性:
        score >= 2 ? "他者を受け入れ支援する力が強い" : "独立性を重視する傾向",
      巽_適応性:
        score >= 2
          ? "状況に応じて柔軟に対応できる"
          : "一貫した方針を重視する傾向",
      離_表現性:
        score >= 2
          ? "自己表現力が高く影響力がある"
          : "控えめで静かな影響力を持つ傾向",
      兌_調和性:
        score >= 2
          ? "人との調和を重視し喜びを分かち合う"
          : "個人の価値観を重視する傾向",
    };

    return descriptions[dimensionKey] || "バランスの取れた特徴";
  }

  // 単一結果表示機能
  showSingleResult(participantId) {
    const resultText = this.generateProductionLevelText(participantId);

    // モーダルまたは新しいタブで結果を表示
    const resultWindow = window.open(
      "",
      "_blank",
      "width=800,height=600,scrollbars=yes"
    );
    resultWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${participantId} の診断結果</title>
                <style>
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
                        line-height: 1.6; 
                        padding: 20px; 
                        background: #1a1a1a; 
                        color: #e1e1e1; 
                    }
                    pre { 
                        white-space: pre-wrap; 
                        font-family: inherit;
                        background: #2a2a2a;
                        padding: 20px;
                        border-radius: 8px;
                        border-left: 4px solid #6366f1;
                    }
                    .actions {
                        margin: 20px 0;
                        text-align: center;
                    }
                    button {
                        background: #6366f1;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                        margin: 0 10px;
                    }
                    button:hover { background: #5856eb; }
                </style>
            </head>
            <body>
                <div class="actions">
                    <button onclick="navigator.clipboard.writeText(document.querySelector('pre').textContent)">
                        📋 結果をコピー
                    </button>
                    <button onclick="window.print()">🖨️ 印刷</button>
                    <button onclick="window.close()">✖️ 閉じる</button>
                </div>
                <pre>${resultText}</pre>
            </body>
            </html>
        `);
    resultWindow.document.close();
  }

  // 構成八卦取得（安全版）
  getTrigramComposition(osData) {
    if (osData.trigramComposition) {
      return osData.trigramComposition;
    }
    if (osData.hexagramInfo) {
      const upperTrigram = this.getTrigramName(
        osData.hexagramInfo.upper_trigram_id
      );
      const lowerTrigram = this.getTrigramName(
        osData.hexagramInfo.lower_trigram_id
      );
      return `${upperTrigram} + ${lowerTrigram}`;
    }
    return "乾 + 乾";
  }

  // 八卦名取得
  getTrigramName(trigramId) {
    const trigramNames = {
      1: "乾",
      2: "兌",
      3: "離",
      4: "震",
      5: "巽",
      6: "坎",
      7: "艮",
      8: "坤",
    };
    return trigramNames[trigramId] || "乾";
  }

  // 個別結果コピー機能
  copySingleResult(participantId) {
    const resultText = this.generateProductionLevelText(participantId);
    navigator.clipboard
      .writeText(resultText)
      .then(() => {
        alert("結果をクリップボードにコピーしました");
      })
      .catch(() => {
        alert("コピーに失敗しました");
      });
  }

  // 簡易結果生成
  generateQuickResult(participantId) {
    const data = this.diagnosisResults[participantId];
    if (!data || !data.result) {
      alert("診断結果が見つかりません");
      return;
    }

    const result = data.result;
    const participant = data.participant;

    const quickText = `
🎯 ${participant.name}さんの簡易診断結果

🔧 エンジンOS: ${result.engineOS.hexagramInfo.name}
🖥️ インターフェースOS: ${result.interfaceOS.hexagramInfo.name}
🛡️ セーフモードOS: ${result.safeModeOS.hexagramInfo.name}

一貫性スコア: ${Math.round(result.consistencyScore.overall * 100)}%

${result.integration.summary}
        `.trim();

    const previewContainer = document.getElementById("single-result-preview");
    if (previewContainer) {
      previewContainer.innerHTML = `<pre>${quickText}</pre>`;
    }
  }

  // ユーザー送信用テキスト生成
  sendResultToUser(participantId) {
    const resultText = this.generateProductionLevelText(participantId);
    const userText = `
${resultText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【フィードバックのお願い】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

この診断結果について、以下の点をお聞かせください：

1. 的中度（1-5）: 
2. 満足度（1-5）: 
3. 印象に残った内容: 
4. 具体的なコメント: 

ご協力をお願いいたします 🙏
        `.trim();

    navigator.clipboard
      .writeText(userText)
      .then(() => {
        alert("ユーザー送信用テキストをクリップボードにコピーしました");
      })
      .catch(() => {
        alert("コピーに失敗しました");
      });
  }
  // ... その他のUI更新メソッド

  // 表示更新
  updateDisplay() {
    this.updateParticipantSelects();
    this.updateInputProgress();
    this.updateResultsList();
    this.updateFeedbackSummary();

    // 個別診断ボタン状態を更新
    const singleDiagnosisSelect = document.getElementById(
      "single-diagnosis-participant"
    );
    if (singleDiagnosisSelect) {
      this.updateSingleDiagnosisButtons(singleDiagnosisSelect.value);
    }

    // 結果表示ボタン状態を更新
    const viewResultSelect = document.getElementById("view-result-participant");
    if (viewResultSelect) {
      this.updateResultViewButtons(viewResultSelect.value);
    }

    // 診断ステータス表示を初期化
    const diagnosisStatus = document.getElementById("single-diagnosis-status");
    if (diagnosisStatus && !diagnosisStatus.innerHTML.trim()) {
      diagnosisStatus.innerHTML =
        '<div class="diagnosis-status empty">診断対象者を選択して診断を実行してください</div>';
    }
  }

  setupEventListeners() {
    // タブ切り替え
    document.querySelectorAll(".tab").forEach((button) => {
      button.addEventListener("click", (e) => {
        const tabName = e.target
          .getAttribute("onclick")
          .match(/showTab\('([^']+)'\)/)?.[1];
        if (tabName) {
          this.switchTab(tabName);
        }
      });
    });

    // 参加者選択変更
    const participantSelect = document.getElementById("participant-select");
    if (participantSelect) {
      participantSelect.addEventListener("change", (e) => {
        this.selectParticipant(e.target.value);
      });
    }

    // 個別診断対象者選択変更
    const singleDiagnosisSelect = document.getElementById(
      "single-diagnosis-participant"
    );
    if (singleDiagnosisSelect) {
      singleDiagnosisSelect.addEventListener("change", (e) => {
        this.updateSingleDiagnosisButtons(e.target.value);
      });
    }

    // 結果表示対象者選択変更
    const viewResultSelect = document.getElementById("view-result-participant");
    if (viewResultSelect) {
      viewResultSelect.addEventListener("change", (e) => {
        this.updateResultViewButtons(e.target.value);
      });
    }
  }

  // タブ切り替え機能
  switchTab(tabName) {
    // すべてのタブコンテンツを非表示
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.style.display = "none";
    });

    // すべてのタブボタンからアクティブクラスを削除
    document.querySelectorAll(".tab").forEach((button) => {
      button.classList.remove("active");
    });

    // 指定されたタブを表示
    const targetContent = document.getElementById(`${tabName}-tab`);
    if (targetContent) {
      targetContent.style.display = "block";
    }

    // 指定されたタブボタンをアクティブに
    const targetButton = document.querySelector(
      `[onclick="showTab('${tabName}')"]`
    );
    if (targetButton) {
      targetButton.classList.add("active");
    }

    // タブ固有の更新処理
    switch (tabName) {
      case "input":
        this.updateParticipantSelects();
        this.updateInputProgress();
        break;
      case "results":
        this.updateResultsList();
        break;
      case "feedback":
        this.updateFeedbackSummary();
        break;
      case "analysis":
        // 分析タブの更新処理
        break;
    }
  }

  // 参加者選択処理
  selectParticipant(participantId) {
    if (!participantId) return;

    this.currentParticipantId = participantId;

    // 既存の回答データがあれば表示
    if (this.answersData[participantId]) {
      const answers = this.answersData[participantId];
      this.updateWorldviewInputs(answers);
      this.updateScenarioInputs(answers);
    } else {
      // 回答データがない場合はクリア
      this.clearCurrentAnswers();
    }
  }
}

// タブ切り替え（クラスメソッドとして実装済みのため削除）

// システム初期化
document.addEventListener("DOMContentLoaded", () => {
  window.testSystem = new TestInputSystem();
});

// タブ切り替え機能（HTMLから呼び出される）
// eslint-disable-next-line no-unused-vars
function showTab(tabName) {
  // 全てのタブコンテンツを非表示
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  // 全てのタブボタンを非アクティブ
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // 指定されたタブを表示
  const targetTab = document.getElementById(`${tabName}-tab`);
  if (targetTab) {
    targetTab.classList.add("active");
  }

  // 対応するタブボタンをアクティブ
  const tabButtons = document.querySelectorAll(".tab");
  const tabNames = ["input", "results", "feedback", "analysis"];
  const index = tabNames.indexOf(tabName);

  if (index >= 0 && tabButtons[index]) {
    tabButtons[index].classList.add("active");
  }
}
