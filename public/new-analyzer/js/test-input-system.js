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
    console.log(
      "🔄 Converting answers to engine format:",
      Object.keys(rawAnswers)
    );
    const engineAnswers = [];

    // 価値観設問（Q1-Q24）を変換
    for (let i = 1; i <= 24; i++) {
      const questionKey = `Q${i}`;
      if (rawAnswers[questionKey]) {
        const questionData = this.getQuestionData("worldview", `q${i}`);
        const selectedOption = this.getOptionData(
          questionData,
          rawAnswers[questionKey]
        );

        if (selectedOption && selectedOption.scoring_tags) {
          engineAnswers.push({
            questionId: `q${i}`,
            selectedValue: rawAnswers[questionKey],
            scoring_tags: selectedOption.scoring_tags,
          });
        } else {
          console.warn(
            `⚠️ No scoring tags found for ${questionKey}: ${rawAnswers[questionKey]}`
          );
        }
      }
    }

    // シナリオ設問（Q25-Q30）を変換
    for (let i = 25; i <= 30; i++) {
      const innerKey = `Q${i}_内面`;
      const outerKey = `Q${i}_外面`;

      if (rawAnswers[innerKey] && rawAnswers[outerKey]) {
        const questionData = this.getQuestionData("scenario", `q${i}`);
        const innerOption = this.getOptionData(
          questionData,
          rawAnswers[innerKey],
          "inner"
        );
        const outerOption = this.getOptionData(
          questionData,
          rawAnswers[outerKey],
          "outer"
        );

        if (
          innerOption &&
          outerOption &&
          innerOption.scoring_tags &&
          outerOption.scoring_tags
        ) {
          engineAnswers.push({
            questionId: `q${i}`,
            innerChoice: {
              value: rawAnswers[innerKey],
              scoring_tags: innerOption.scoring_tags,
            },
            outerChoice: {
              value: rawAnswers[outerKey],
              scoring_tags: outerOption.scoring_tags,
            },
          });
        } else {
          console.warn(
            `⚠️ No scoring tags found for ${innerKey}/${outerKey}: ${rawAnswers[innerKey]}/${rawAnswers[outerKey]}`
          );
        }
      }
    }

    console.log(`✅ Converted ${engineAnswers.length} answers for engine`);
    return engineAnswers;
  }

  // 質問データを取得
  getQuestionData(type, questionId) {
    const questions =
      type === "worldview"
        ? this.questions.worldview
        : this.questions.scenarios;
    return questions.find((q) => q.id === questionId);
  }

  // オプションデータを取得
  getOptionData(questionData, value, choiceType = null) {
    if (!questionData || !questionData.options) return null;

    if (choiceType) {
      // シナリオ設問の場合
      const options = questionData.options[choiceType];
      return options ? options.find((opt) => opt.value === value) : null;
    } else {
      // 価値観設問の場合
      return questionData.options.find((opt) => opt.value === value);
    }
  }

  // 回答データ一括処理メソッド
  // 【修正1】processBatchAnswers メソッド - A/B/C/D/E形式に対応
  processBatchAnswers(rawText) {
    console.log("🔍 processBatchAnswers 開始", {
      textLength: rawText.length,
      preview: rawText.substring(0, 200),
    });

    try {
      const lines = rawText.split("\n");
      const participants = [];
      let currentParticipant = null;
      let currentSection = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        if (!trimmedLine) continue; // 空行をスキップ

        // 新しい参加者の開始を検出
        const isNewParticipantLine =
          trimmedLine.includes("【参加者情報】") ||
          trimmedLine.match(/^###\s*回答\d+\/\d+/);

        if (isNewParticipantLine) {
          // 前の参加者を保存
          if (currentParticipant && currentParticipant.info.name) {
            participants.push(currentParticipant);
            console.log(`✅ 参加者追加: ${currentParticipant.info.name}`);
          }

          // 新しい参加者を初期化
          currentParticipant = {
            info: {},
            worldviewAnswers: {},
            scenarioAnswers: {},
          };
          currentSection = "info";
          continue;
        }

        if (!currentParticipant) continue;

        // セクション切り替えの検出
        if (trimmedLine.includes("【第1部：価値観設問回答】")) {
          currentSection = "worldview";
          console.log("🔄 価値観設問セクションに切り替え");
          continue;
        }

        if (trimmedLine.includes("【第2部：シナリオ設問回答】")) {
          currentSection = "scenario";
          console.log("🔄 シナリオ設問セクションに切り替え");
          continue;
        }

        // 参加者情報の解析
        if (currentSection === "info" && trimmedLine.includes(":")) {
          const [key, ...valueParts] = trimmedLine.split(":");
          const value = valueParts.join(":").trim();

          if (value) {
            switch (key.trim()) {
              case "お名前":
                currentParticipant.info.name = value;
                break;
              case "年齢":
                currentParticipant.info.age = value.replace("歳", "");
                break;
              case "性別":
                currentParticipant.info.gender = value;
                break;
              case "職業":
                currentParticipant.info.occupation = value;
                break;
            }
            console.log(`📝 参加者情報設定: ${key.trim()} = ${value}`);
          }
        }

        // 価値観設問の解析（Q1-Q24）
        if (currentSection === "worldview" && trimmedLine.match(/^Q\d+:/)) {
          const [questionKey, letterAnswer] = trimmedLine
            .split(":")
            .map((s) => s.trim());
          if (questionKey && letterAnswer) {
            // A/B/C/D/E を実際の回答テキストに変換
            const convertedAnswer = this.convertLetterToAnswerText(
              questionKey,
              letterAnswer
            );
            if (convertedAnswer) {
              currentParticipant.worldviewAnswers[questionKey] =
                convertedAnswer;
              console.log(
                `📝 価値観回答: ${questionKey} = ${letterAnswer} -> ${convertedAnswer}`
              );
            } else {
              console.warn(
                `⚠️ 変換できない回答: ${questionKey} = ${letterAnswer}`
              );
            }
          }
        }

        // シナリオ設問の解析（Q25-Q30）
        if (
          currentSection === "scenario" &&
          trimmedLine.match(/^Q(2[5-9]|30)_/)
        ) {
          const [questionKey, letterAnswer] = trimmedLine
            .split(":")
            .map((s) => s.trim());
          if (questionKey && letterAnswer) {
            const convertedAnswer = this.convertLetterToAnswerText(
              questionKey,
              letterAnswer
            );
            if (convertedAnswer) {
              currentParticipant.scenarioAnswers[questionKey] = convertedAnswer;
              console.log(
                `📝 シナリオ回答: ${questionKey} = ${letterAnswer} -> ${convertedAnswer}`
              );
            } else {
              console.warn(
                `⚠️ 変換できない回答: ${questionKey} = ${letterAnswer}`
              );
            }
          }
        }
      }

      // 最後の参加者を追加
      if (currentParticipant && currentParticipant.info.name) {
        participants.push(currentParticipant);
        console.log(`✅ 最後の参加者追加: ${currentParticipant.info.name}`);
      }

      console.log(`✅ 解析完了: ${participants.length}人の参加者データ`);

      // 各参加者の回答数をチェック
      participants.forEach((participant) => {
        const worldviewCount = Object.keys(participant.worldviewAnswers).length;
        const scenarioCount = Object.keys(participant.scenarioAnswers).length;
        console.log(
          `📊 ${participant.info.name}: 価値観${worldviewCount}問, シナリオ${scenarioCount}問`
        );
      });

      return participants;
    } catch (error) {
      console.error("❌ processBatchAnswers エラー:", error);
      throw new Error(`回答データ解析エラー: ${error.message}`);
    }
  }

  // 【修正1】A/B/C/D/E を実際の回答テキストに変換するメソッド
  convertLetterToAnswerText(questionKey, letterAnswer) {
    console.log(`🔍 Converting: ${questionKey} = ${letterAnswer}`);
    try {
      if (!questionKey || !letterAnswer) {
        console.warn(
          `⚠️ 入力が無効: questionKey=${questionKey}, letterAnswer=${letterAnswer}`
        );
        return null;
      }
      if (!this.questions) {
        console.error(`❌ this.questionsが未定義です`);
        return null;
      }
      let questionId,
        questionData,
        choiceType = null;
      if (questionKey.match(/^Q([1-9]|1[0-9]|2[0-4])$/)) {
        questionId = questionKey.toLowerCase();
        try {
          questionData = this.getQuestionData("worldview", questionId);
        } catch (getError) {
          console.error(
            `❌ getQuestionDataエラー (worldview, ${questionId}):`,
            getError
          );
          return null;
        }
      } else if (questionKey.match(/^Q(2[5-9]|30)_/)) {
        const parts = questionKey.split("_");
        questionId = parts[0].toLowerCase();
        choiceType = parts[1] === "内面" ? "inner" : "outer";
        try {
          questionData = this.getQuestionData("scenario", questionId);
        } catch (getError) {
          console.error(
            `❌ getQuestionDataエラー (scenario, ${questionId}):`,
            getError
          );
          return null;
        }
      } else {
        console.warn(`⚠️ 未知の質問形式: ${questionKey}`);
        return null;
      }
      if (!questionData) {
        console.warn(`⚠️ 質問データが見つかりません: ${questionId}`);
        return null;
      }
      if (!questionData.options) {
        console.warn(`⚠️ 質問に選択肢がありません: ${questionId}`);
        return null;
      }
      const letterMap = {
        A: 0,
        B: 1,
        C: 2,
        D: 3,
        E: 4,
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        e: 4,
      };
      const optionIndex = letterMap[letterAnswer];
      if (optionIndex === undefined) {
        console.warn(`⚠️ 無効な選択肢: ${letterAnswer} (A-E のみ有効)`);
        return null;
      }
      let option;
      try {
        if (choiceType) {
          const options = questionData.options[choiceType];
          if (!options || !Array.isArray(options)) {
            console.warn(`⚠️ ${choiceType}選択肢が見つかりません`);
            return null;
          }
          if (optionIndex >= options.length) {
            console.warn(
              `⚠️ 選択肢インデックスが範囲外: ${optionIndex} >= ${options.length}`
            );
            return null;
          }
          option = options[optionIndex];
        } else {
          if (optionIndex >= questionData.options.length) {
            console.warn(
              `⚠️ 選択肢インデックスが範囲外: ${optionIndex} >= ${questionData.options.length}`
            );
            return null;
          }
          option = questionData.options[optionIndex];
        }
      } catch (optionError) {
        console.error(`❌ 選択肢取得エラー:`, optionError);
        return null;
      }
      // 【修正】option.textを返す
      if (option && option.text) {
        console.log(`  ✅ 変換成功: ${letterAnswer} -> "${option.text}"`);
        return option.text;
      } else {
        console.warn(
          `⚠️ 選択肢が見つかりません: ${questionKey}[${optionIndex}]`
        );
        return null;
      }
    } catch (error) {
      console.error(
        `❌ 回答変換エラー (${questionKey}:${letterAnswer}):`,
        error
      );
      return null;
    }
  }

  // 参加者データをシステム形式に変換
  convertToSystemFormat(participantData) {
    try {
      const info = participantData.info || {};
      const participant = {
        id: this.generateParticipantId(info.name || `no_name_${Date.now()}`),
        name: info.name || "名称未設定",
        age: (info.age || "").toString().replace("歳", ""),
        gender: info.gender || "",
        occupation: info.occupation || "",
      };
      const engineAnswers = [];
      // 価値観設問（Q1-Q24）
      Object.entries(participantData.worldviewAnswers || {}).forEach(
        ([questionKey, selectedText]) => {
          const questionId = questionKey.toLowerCase();
          const questionData = this.getQuestionData("worldview", questionId);
          // 【修正】textで検索
          const selectedOption =
            questionData &&
            questionData.options.find((opt) => opt.text === selectedText);
          console.log(
            `🔎 価値観設問: ${questionId}, 回答: ${selectedText}, 検索結果:`,
            selectedOption
          );
          if (selectedOption && selectedOption.scoring_tags) {
            engineAnswers.push({
              questionId: questionId,
              selectedValue: selectedOption.value, // エンジンにはvalueを渡す
              scoring_tags: selectedOption.scoring_tags,
            });
          } else {
            console.warn(
              `未知の価値観質問オプション: ${questionId} = ${selectedText}`
            );
          }
        }
      );
      // シナリオ設問（Q25-Q30）
      const scenarioGroups = {};
      Object.entries(participantData.scenarioAnswers || {}).forEach(
        ([questionKey, selectedText]) => {
          const match = questionKey.match(/^Q(\d+)_(内面|外面)$/);
          if (match) {
            const questionNum = parseInt(match[1]);
            const choiceType = match[2] === "内面" ? "inner" : "outer";
            if (!scenarioGroups[questionNum]) {
              scenarioGroups[questionNum] = {};
            }
            scenarioGroups[questionNum][choiceType] = selectedText;
          }
        }
      );
      Object.entries(scenarioGroups).forEach(([questionNum, choices]) => {
        if (choices.inner && choices.outer) {
          const questionId = `q${questionNum}`;
          const questionData = this.getQuestionData("scenario", questionId);
          // 【修正】textで検索
          const innerOption =
            questionData &&
            questionData.options.inner.find(
              (opt) => opt.text === choices.inner
            );
          const outerOption =
            questionData &&
            questionData.options.outer.find(
              (opt) => opt.text === choices.outer
            );
          console.log(
            `🔎 シナリオ設問: ${questionId}, inner: ${choices.inner}, outer: ${choices.outer}, innerOption:`,
            innerOption,
            "outerOption:",
            outerOption
          );
          if (
            innerOption &&
            outerOption &&
            innerOption.scoring_tags &&
            outerOption.scoring_tags
          ) {
            engineAnswers.push({
              questionId: questionId,
              innerChoice: {
                value: innerOption.value, // エンジンにはvalueを渡す
                scoring_tags: innerOption.scoring_tags,
              },
              outerChoice: {
                value: outerOption.value, // エンジンにはvalueを渡す
                scoring_tags: outerOption.scoring_tags,
              },
            });
          } else {
            console.warn(
              `未知のシナリオ質問オプション: ${questionId} inner=${choices.inner} outer=${choices.outer}`
            );
          }
        }
      });
      console.log(`🔄 Converted participant: ${participant.name}`, {
        participant,
        engineAnswersCount: engineAnswers.length,
        worldviewCount: Object.keys(participantData.worldviewAnswers).length,
        scenarioCount: Object.keys(participantData.scenarioAnswers).length,
      });
      return { participant, engineAnswers };
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

  // 【修正4】processBatchAndGenerate メソッドのエラーハンドリング強化
  async processBatchAndGenerate(rawAnswersText) {
    console.log("🎯 === processBatchAndGenerate開始 ===");
    console.log("📝 入力データ確認:", {
      hasText: !!rawAnswersText,
      textLength: rawAnswersText?.length,
      firstChars: rawAnswersText?.substring(0, 100),
    });
    console.log("📝 引数チェック:", {
      hasText: !!rawAnswersText,
      textLength: rawAnswersText?.length,
      textType: typeof rawAnswersText,
    });

    // 既存のコードの前に以下を追加
    if (!rawAnswersText || typeof rawAnswersText !== "string") {
      throw new Error("無効な入力テキストです");
    }

    // 既存のコード...
    console.log("✅ processBatchAndGenerate メソッドが呼び出されました");
    console.log(
      "📝 入力テキスト長:",
      rawAnswersText ? rawAnswersText.length : "null"
    );
    console.log(
      "📝 入力テキストプレビュー:",
      rawAnswersText ? rawAnswersText.substring(0, 500) : "null"
    );

    try {
      console.log("🔄 一括処理を開始...");

      // ローディング表示
      const progressDiv = document.getElementById("batch-progress");
      if (progressDiv) {
        progressDiv.innerHTML =
          '<div class="processing">📊 回答データを解析中...</div>';
      }

      // 1. 回答データを解析
      console.log("🔍 processBatchAnswersメソッド実行中...");
      const participantsData = this.processBatchAnswers(rawAnswersText);
      console.log(`📝 ${participantsData.length}人の回答データを解析しました`);

      if (participantsData.length === 0) {
        throw new Error(
          "回答データが正しく解析されませんでした。入力形式を確認してください。"
        );
      }

      if (progressDiv) {
        progressDiv.innerHTML =
          '<div class="processing">👥 参加者情報を登録中...</div>';
      }

      // 2. エンジン初期化
      console.log("🔍 DataManagerクラス確認:", typeof window.DataManager);
      console.log("🔍 TripleOSEngineクラス確認:", typeof window.TripleOSEngine);

      const dataManager = new window.DataManager();
      console.log("✅ DataManagerインスタンス作成完了");

      await dataManager.loadData();
      console.log("✅ データ読み込み完了");

      const engine = new window.TripleOSEngine(dataManager);
      console.log("✅ TripleOSEngineインスタンス作成完了");

      // 3. 各参加者の診断実行
      const processedCount = participantsData.length;
      let successCount = 0;
      let failCount = 0;
      const results = [];

      for (let i = 0; i < participantsData.length; i++) {
        const pData = participantsData[i];
        const pInfo = pData.info || {};

        try {
          if (progressDiv) {
            progressDiv.innerHTML = `<div class="processing">🔬 ${
              pInfo.name || `参加者${i + 1}`
            } の診断実行中... (${i + 1}/${processedCount})</div>`;
          }

          // データ変換
          const { participant, engineAnswers } =
            this.convertToSystemFormat(pData);

          // 参加者リストに追加
          if (
            this.participants.findIndex((p) => p.id === participant.id) === -1
          ) {
            this.participants.push(participant);
          }
          this.answersData[participant.id] = engineAnswers;

          // 診断実行
          console.log(
            `🔬 Engine input for ${participant.id}:`,
            engineAnswers.length,
            "answers"
          );
          const diagnosisResult = await engine.analyzeTripleOS(engineAnswers);
          console.log(
            `✅ Engine output for ${participant.id}:`,
            diagnosisResult ? "Success" : "Failed"
          );

          // 結果を保存
          this.diagnosisResults[participant.id] = {
            result: diagnosisResult,
            processedAt: new Date().toISOString(),
            participant: participant,
          };

          const resultText = this.generateUserText(participant.id, "detailed");
          results.push({ participant, resultText, success: true });

          successCount++;
          console.log(`✅ ${participant.name} の診断完了`);
        } catch (error) {
          console.error(
            `❌ ${pInfo.name || `参加者${i + 1}`} の処理エラー:`,
            error
          );

          // 🚨【重要】エラー処理を修正：失敗した関数を再呼び出ししない
          const failedParticipant = {
            id: this.generateParticipantId(
              pInfo.name || `failed_${Date.now()}`
            ),
            name: pInfo.name || "処理失敗参加者",
            ...pInfo,
          };
          if (
            this.participants.findIndex(
              (p) => p.id === failedParticipant.id
            ) === -1
          ) {
            this.participants.push(failedParticipant);
          }

          this.diagnosisResults[failedParticipant.id] = {
            error: error.message,
            processedAt: new Date().toISOString(),
            participant: failedParticipant,
          };

          results.push({
            participant: failedParticipant,
            error: error.message,
            success: false,
          });
          failCount++;
        }
      }

      // データ保存と表示更新
      console.log("💾 データ保存と表示更新を開始...");
      this.saveData();
      this.updateDisplay();
      this.updateResultsList();

      if (progressDiv) {
        progressDiv.innerHTML = `<div class="processing-complete">✅ 処理完了: 成功 ${successCount}人 / 失敗 ${failCount}人</div>`;
      }

      // 結果表示
      this.showBatchResults(results);

      return results;
    } catch (error) {
      console.error("❌ 一括処理エラー:", error);
      const progressDiv = document.getElementById("batch-progress");
      if (progressDiv)
        progressDiv.innerHTML = `<div class="progress-message error">❌ エラーが発生しました: ${error.message}</div>`;
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
            .map((result) => this.renderSingleResultItem(result))
            .join("")}
        </div>

        <div style="margin-top: 20px; text-align: center;">
          <button onclick="this.closest('div[style*=position: fixed]').remove()"
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
  renderSingleResultItem(result) {
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

    // 【修正】確認ダイアログを一時的にコメントアウトまたは自動的にtrueにする
    /*
    if (!confirm("一括処理を開始しますか？\n※ 既存のデータに追加されます")) {
      console.log("🚫 ユーザーが処理をキャンセルしました");
      return;
    }
    */
    // テスト用に確認を自動でOKにする
    console.log("✅ 確認ダイアログをスキップ（テストモード）");

    console.log("✅ ユーザー確認完了、処理を続行します");

    // 既存のコード続行...
    const progressElement = document.getElementById("batch-progress");
    if (progressElement) {
      progressElement.innerHTML =
        '<div class="progress-message">🔄 一括処理を開始しています...</div>';
      console.log("✅ 進捗表示要素を更新しました");
    } else {
      console.warn("⚠️ batch-progress要素が見つかりません");
    }

    // 残りの既存コード...
    // デバッグ: メソッド存在確認
    console.log(
      "🔍 processBatchAndGenerate method exists:",
      typeof this.processBatchAndGenerate
    );
    console.log(
      "🔍 About to call processBatchAndGenerate with text length:",
      rawText.length
    );

    // 【重要】try-catchでラップして同期エラーをキャッチ
    try {
      console.log("🚀 Calling processBatchAndGenerate...");

      // processBatchAndGenerateメソッドが存在するかチェック
      if (typeof this.processBatchAndGenerate !== "function") {
        throw new Error("processBatchAndGenerateメソッドが存在しません");
      }

      // Promiseを作成して監視
      console.log("🔍 Promise作成中...");
      const processingPromise = this.processBatchAndGenerate(rawText);
      console.log("🔍 Promise作成完了:", typeof processingPromise);

      // Promiseが正しく作成されているかチェック
      if (!processingPromise || typeof processingPromise.then !== "function") {
        throw new Error(
          "processBatchAndGenerateが正しいPromiseを返していません"
        );
      }

      console.log("🔍 Promise.thenを設定中...");

      processingPromise
        .then((results) => {
          console.log("✅ 一括処理完了:", results);

          // 結果表示を強制更新
          this.updateDisplay();
          this.updateResultsList();

          // 診断結果タブに自動切り替え
          showTab("results");

          // 成功メッセージ表示
          if (progressElement) {
            const successCount = results.filter((r) => r.success).length;
            const totalCount = results.length;
            progressElement.innerHTML = `<div class="progress-message success">✅ 一括処理が完了しました！ 成功: ${successCount}/${totalCount}人</div>`;
          }

          // デバッグ情報をコンソールに出力
          console.log(
            "🔍 処理後の診断結果:",
            Object.keys(this.diagnosisResults)
          );
          this.debugResults();
        })
        .catch((error) => {
          console.error("❌ 一括処理Promiseエラー:", error);
          console.error("❌ エラータイプ:", typeof error);
          console.error("❌ エラー名:", error.name);
          console.error("❌ エラーメッセージ:", error.message);
          console.error("❌ エラースタック:", error.stack);

          if (progressElement) {
            progressElement.innerHTML = `<div class="progress-message error">❌ エラーが発生しました: ${error.message}</div>`;
          }
          alert(`一括処理でエラーが発生しました: ${error.message}`);
        });

      console.log("✅ Promise監視設定完了");
    } catch (syncError) {
      console.error("❌ 同期エラー発生:", syncError);
      console.error("❌ 同期エラータイプ:", typeof syncError);
      console.error("❌ 同期エラー名:", syncError.name);
      console.error("❌ 同期エラーメッセージ:", syncError.message);
      console.error("❌ 同期エラースタック:", syncError.stack);

      if (progressElement) {
        progressElement.innerHTML = `<div class="progress-message error">❌ 初期化エラー: ${syncError.message}</div>`;
      }
      alert(`初期化エラーが発生しました: ${syncError.message}`);
    }

    console.log("🏁 startBatchProcessingメソッド完了");
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
      const dataManager = new window.DataManager();
      await dataManager.loadData();
      const engine = new window.TripleOSEngine(dataManager);

      let processed = 0;
      for (const [participantId, answers] of Object.entries(this.answersData)) {
        try {
          console.log(`🔬 Processing ${participantId}...`);

          const result = await engine.analyzeTripleOS(answers);

          // 結果の構造を確認してログ出力
          console.log(`✅ Result for ${participantId}:`, result);

          // 結果を適切な形式で保存
          this.diagnosisResults[participantId] = {
            result: result,
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
            errorDetails: error.stack,
            processedAt: new Date().toISOString(),
            participant: this.participants.find((p) => p.id === participantId),
          };
        }
      }

      // データ保存と表示更新
      this.saveData();
      this.updateResultsList();

      // 診断結果タブに自動切り替え
      showTab("results");

      alert(`診断完了！ ${processed}人の結果を生成しました`);
    } catch (error) {
      console.error("❌ Diagnosis execution failed:", error);
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

    // TripleOS結果かどうかを判定
    if (result.analysisType === "tripleOS") {
      return this.generateTripleOSText(participant, result, format);
    } else {
      // 従来の結果形式
      return this.generateLegacyText(participant, result, format);
    }
  }

  // TripleOS用テキスト生成
  generateTripleOSText(participant, result, format) {
    console.log("📝 generateTripleOSText開始:", {
      participant: participant.name,
      format,
      engineOS: {
        exists: !!result.engineOS,
        hasHexagramInfo: !!result.engineOS?.hexagramInfo,
        hasOsName: !!result.engineOS?.osName, // 追加
        hexagramInfoName: result.engineOS?.hexagramInfo?.name,
        osName: result.engineOS?.osName, // 追加
      },
    });

    if (format === "detailed") {
      // 【修正】エンジンOS名の取得方法を変更
      // result.engineOS.hexagramInfo?.name ではなく result.engineOS.osName を使用
      const engineOSName =
        result.engineOS?.osName || result.engineOS?.hexagramInfo?.name;
      const engineOSCatchphrase =
        result.engineOS?.catchphrase ||
        result.engineOS?.hexagramInfo?.catchphrase ||
        "";

      console.log("🔧 エンジンOS名取得:", {
        engineOS: !!result.engineOS,
        osName: result.engineOS?.osName,
        hexagramInfoName: result.engineOS?.hexagramInfo?.name,
        finalName: engineOSName,
        catchphrase: engineOSCatchphrase,
      });

      // インターフェースOSとセーフモードOSも同様に修正
      const interfaceOSName =
        result.interfaceOS?.hexagramInfo?.name || "データ取得エラー";
      const safeModeOSName =
        result.safeModeOS?.hexagramInfo?.name || "データ取得エラー";

      return `
🎯 ${participant.name}さんの HaQei 人格OS診断結果

【あなたの3層人格OS】

🔧 エンジンOS（核となる価値観）
「${engineOSName || "データ取得エラー"}」
${engineOSCatchphrase}

🖥️ インターフェースOS（外面的な行動）
「${interfaceOSName}」
マッチ度: ${Math.round(result.interfaceOS?.matchScore || 0)}%

🛡️ セーフモードOS（内面的な防御機制）
「${safeModeOSName}」
マッチ度: ${Math.round(result.safeModeOS?.matchScore || 0)}%

【人格一貫性スコア】
総合: ${Math.round((result.consistencyScore?.overall || 0) * 100)}%

【統合洞察】
${result.integration?.summary || "洞察を生成中..."}

${
  result.integration?.recommendations?.map((rec) => `💡 ${rec}`).join("\n") ||
  ""
}

━━━━━━━━━━━━━━━━━━━━━━━
この診断結果はいかがでしたか？
的中度や印象をお聞かせください 🙏
      `.trim();
    } else if (format === "summary") {
      // サマリー形式も同様に修正
      const engineOSName =
        result.engineOS?.osName ||
        result.engineOS?.hexagramInfo?.name ||
        "エラー";
      const interfaceOSName =
        result.interfaceOS?.hexagramInfo?.name || "エラー";
      const safeModeOSName = result.safeModeOS?.hexagramInfo?.name || "エラー";

      return `
🎯 ${participant.name}さんの人格OS診断

エンジンOS: 「${engineOSName}」
インターフェースOS: 「${interfaceOSName}」
セーフモードOS: 「${safeModeOSName}」

人格一貫性: ${Math.round((result.consistencyScore?.overall || 0) * 100)}%

${result.integration?.summary || ""}

#HaQeiAnalyzer #人格診断 #易経
      `.trim();
    } else {
      // 分析用データ形式も修正
      return JSON.stringify(
        {
          participantId: participant.id,
          participantName: participant.name,
          engineOS:
            result.engineOS?.osName || result.engineOS?.hexagramInfo?.name,
          interfaceOS: result.interfaceOS?.hexagramInfo?.name,
          safeModeOS: result.safeModeOS?.hexagramInfo?.name,
          consistencyScore: result.consistencyScore?.overall,
          processedAt: new Date().toISOString(),
        },
        null,
        2
      );
    }
  }

  // 従来形式用テキスト生成（フォールバック）
  // eslint-disable-next-line no-unused-vars
  generateLegacyText(participant, result, format) {
    return `
🎯 ${participant.name}さんの HaQei 診断結果

主要人格OS: 「${result.primaryOS?.hexagramInfo?.name || "データ取得エラー"}」
適合度: ${Math.round(result.primaryOS?.matchPercentage || 0)}%

${result.insights?.summary || "洞察を生成中..."}

━━━━━━━━━━━━━━━━━━━━━━━
この診断結果はいかがでしたか？
的中度や印象をお聞かせください 🙏
    `.trim();
  }

  generateDetailedText(participant, result) {
    return `
🎯 ${participant.name}さんの HaQei 人格OS診断結果

【あなたの3層人格OS】

🔧 エンジンOS（核となる価値観）
「${result.engineOS?.hexagramInfo?.name || "データ取得エラー"}」
${result.engineOS?.hexagramInfo?.catchphrase || ""}

🖥️ インターフェースOS（外面的な行動）
「${result.interfaceOS?.hexagramInfo?.name || "データ取得エラー"}」
マッチ度: ${Math.round(result.interfaceOS?.matchScore || 0)}%

🛡️ セーフモードOS（内面的な防御機制）
「${result.safeModeOS?.hexagramInfo?.name || "データ取得エラー"}」
マッチ度: ${Math.round(result.safeModeOS?.matchScore || 0)}%

【人格一貫性スコア】
総合: ${Math.round((result.consistencyScore?.overall || 0) * 100)}%

【統合洞察】
${result.integration?.summary || "洞察を生成中..."}

${
  result.integration?.recommendations?.map((rec) => `💡 ${rec}`).join("\n") ||
  ""
}

━━━━━━━━━━━━━━━━━━━━━━━
この診断結果はいかがでしたか？
的中度や印象をお聞かせください 🙏
        `.trim();
  }

  generateSummaryText(participant, result) {
    return `
🎯 ${participant.name}さんの人格OS診断

エンジンOS: 「${result.engineOS?.hexagramInfo?.name || "エラー"}」
インターフェースOS: 「${result.interfaceOS?.hexagramInfo?.name || "エラー"}」
セーフモードOS: 「${result.safeModeOS?.hexagramInfo?.name || "エラー"}」

人格一貫性: ${Math.round((result.consistencyScore?.overall || 0) * 100)}%

${result.integration?.summary || ""}

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
    if (!container) {
      console.warn("results-list container not found");
      return;
    }

    const results = Object.keys(this.diagnosisResults);
    console.log(`🔄 Updating results list with ${results.length} results`);

    // 結果サマリーも更新
    this.updateResultsSummary();

    if (results.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #9ca3af;">
          <p>診断結果がありません</p>
          <p>データ入力タブで回答を追加し、診断を実行してください</p>
        </div>
      `;
      return;
    }

    container.innerHTML = results
      .map((participantId) => {
        const data = this.diagnosisResults[participantId];
        const participant = data.participant || { name: participantId };
        const hasError = !!data.error;
        const hasResult = !!data.result;

        return `
        <div class="result-item" style="
          margin-bottom: 1rem; 
          padding: 1rem; 
          border: 1px solid ${
            hasError ? "#ef4444" : hasResult ? "#10b981" : "#6b7280"
          }; 
          border-radius: 8px;
          background: ${
            hasError
              ? "rgba(239, 68, 68, 0.1)"
              : hasResult
              ? "rgba(16, 185, 129, 0.1)"
              : "rgba(107, 114, 128, 0.1)"
          };
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <h4 style="margin: 0; color: ${
              hasError ? "#ef4444" : hasResult ? "#10b981" : "#e5e7eb"
            };">
              ${hasError ? "❌" : hasResult ? "✅" : "⚠️"} ${
          participant.name || participantId
        }
            </h4>
            <small style="color: #9ca3af;">
              ${
                data.processedAt
                  ? new Date(data.processedAt).toLocaleString("ja-JP")
                  : "未処理"
              }
            </small>
          </div>
          
          ${
            participant.age || participant.gender || participant.occupation
              ? `<p style="margin: 0.5rem 0; font-size: 0.9rem; color: #d1d5db;">
              ${participant.age ? participant.age + "歳" : ""} 
              ${participant.gender || ""} 
              ${participant.occupation || ""}
            </p>`
              : ""
          }
          
          ${
            hasError
              ? `<p style="color: #fca5a5; margin: 0.5rem 0;">エラー: ${data.error}</p>`
              : hasResult
              ? `<div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                   <button class="btn btn-primary" onclick="window.testSystem.showResultDetail('${participantId}')" style="font-size: 0.9rem; padding: 0.4rem 0.8rem;">
                     📄 詳細表示
                   </button>
                   <button class="btn btn-secondary" onclick="window.testSystem.copyResult('${participantId}')" style="font-size: 0.9rem; padding: 0.4rem 0.8rem;">
                     📋 コピー
                   </button>
                   <button class="btn btn-success" onclick="window.testSystem.sendResultToUser('${participantId}')" style="font-size: 0.9rem; padding: 0.4rem 0.8rem;">
                     📧 送信用
                   </button>
                 </div>`
              : `<p style="color: #9ca3af; margin: 0.5rem 0;">診断未実行</p>`
          }
        </div>
      `;
      })
      .join("");

    console.log(`✅ Results list updated with ${results.length} items`);
  }

  // 結果サマリーの更新
  updateResultsSummary() {
    const totalCount = Object.keys(this.diagnosisResults).length;
    const successCount = Object.values(this.diagnosisResults).filter(
      (d) => d.result && !d.error
    ).length;
    // eslint-disable-next-line no-unused-vars
    const errorCount = Object.values(this.diagnosisResults).filter(
      (d) => d.error
    ).length;

    // 平均一貫性スコア計算
    const consistencyScores = Object.values(this.diagnosisResults)
      .filter((d) => d.result && d.result.consistencyScore && !d.error)
      .map((d) => d.result.consistencyScore.overall || 0);
    const avgConsistency =
      consistencyScores.length > 0
        ? Math.round(
            (consistencyScores.reduce((a, b) => a + b, 0) /
              consistencyScores.length) *
              100
          )
        : 0;

    // サマリー要素を更新
    const elements = {
      "total-diagnosis-count": totalCount,
      "completion-rate":
        totalCount > 0
          ? Math.round((successCount / totalCount) * 100) + "%"
          : "0%",
      "avg-consistency-score": avgConsistency + "%",
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
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

  // デバッグ用: 診断結果の構造を確認
  debugResults() {
    console.log("🔍 Stored diagnosis results:", this.diagnosisResults);
    console.log("🔍 Participants:", this.participants);
    console.log("🔍 Answers data:", Object.keys(this.answersData));

    Object.keys(this.diagnosisResults).forEach((participantId) => {
      const data = this.diagnosisResults[participantId];
      console.log(`📊 ${participantId}:`, {
        hasResult: !!data.result,
        hasError: !!data.error,
        resultType: data.result?.analysisType,
        resultStructure: data.result ? Object.keys(data.result) : "none",
        participantData: data.participant,
        processedAt: data.processedAt,
      });

      if (data.result) {
        console.log(`  ↳ Result structure:`, {
          engineOS: !!data.result.engineOS,
          interfaceOS: !!data.result.interfaceOS,
          safeModeOS: !!data.result.safeModeOS,
          consistencyScore: !!data.result.consistencyScore,
          integration: !!data.result.integration,
        });
      }
    });

    // DOM要素の確認
    const resultsList = document.getElementById("results-list");
    console.log(`🔍 results-list element:`, {
      exists: !!resultsList,
      innerHTML: resultsList
        ? resultsList.innerHTML.substring(0, 100) + "..."
        : "N/A",
    });
  }

  // 強制的に結果表示を更新するデバッグメソッド
  forceUpdateResultsDisplay() {
    console.log("🔄 強制的に結果表示を更新中...");
    this.updateResultsList();
    this.updateDisplay();

    // タブが正しく表示されているかチェック
    const resultsTab = document.getElementById("results-tab");
    if (resultsTab) {
      console.log("📋 Results tab display:", resultsTab.style.display);
      console.log("📋 Results tab class:", resultsTab.className);
    }

    console.log("✅ 強制更新完了");
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

  // 【修正5】デバッグ用メソッド - 質問データの確認
  debugQuestionData() {
    console.log("🔍 質問データの確認:");

    // 価値観設問の確認
    console.log("📊 価値観設問:", this.questions.worldview.length, "問");
    this.questions.worldview.forEach((q, index) => {
      console.log(`  Q${index + 1} (${q.id}): ${q.options.length}選択肢`);
      q.options.forEach((opt, optIndex) => {
        console.log(`    ${String.fromCharCode(65 + optIndex)}: ${opt.value}`);
      });
    });

    // シナリオ設問の確認
    console.log("📊 シナリオ設問:", this.questions.scenarios.length, "問");
    this.questions.scenarios.forEach((q, index) => {
      console.log(`  Q${25 + index} (${q.id}):`);
      console.log(`    内面選択肢: ${q.options.inner.length}個`);
      q.options.inner.forEach((opt, optIndex) => {
        console.log(
          `      ${String.fromCharCode(65 + optIndex)}: ${opt.value}`
        );
      });
      console.log(`    外面選択肢: ${q.options.outer.length}個`);
      q.options.outer.forEach((opt, optIndex) => {
        console.log(
          `      ${String.fromCharCode(65 + optIndex)}: ${opt.value}`
        );
      });
    });
  }

  // 【追加】テスト用メソッド - 単一データでのテスト
  testSingleConversion() {
    console.log("🧪 === 単一データ変換テスト ===");

    const testData = {
      info: {
        name: "テストユーザー",
        age: "30",
        gender: "男性",
        occupation: "エンジニア",
      },
      worldviewAnswers: {
        Q1: "A", // これは変換前の状態
        Q2: "B",
      },
      scenarioAnswers: {
        Q25_内面: "A",
        Q25_外面: "B",
      },
    };

    // まず文字を実際の回答に変換
    Object.keys(testData.worldviewAnswers).forEach((key) => {
      const letter = testData.worldviewAnswers[key];
      const converted = this.convertLetterToAnswerText(key, letter);
      console.log(`${key}: ${letter} -> ${converted}`);
      if (converted) {
        testData.worldviewAnswers[key] = converted;
      }
    });

    Object.keys(testData.scenarioAnswers).forEach((key) => {
      const letter = testData.scenarioAnswers[key];
      const converted = this.convertLetterToAnswerText(key, letter);
      console.log(`${key}: ${letter} -> ${converted}`);
      if (converted) {
        testData.scenarioAnswers[key] = converted;
      }
    });

    // システム形式に変換
    try {
      const result = this.convertToSystemFormat(testData);
      console.log("✅ テスト変換成功:", result);
      return result;
    } catch (error) {
      console.error("❌ テスト変換失敗:", error);
      return null;
    }
  }

  // 【追加】システム診断メソッド - 問題を特定するための詳細診断
  diagnoseProblem() {
    console.log("🔍 === システム診断開始 ===");

    // 1. 基本的なシステム状態確認
    console.log("1. システム基本状態:");
    console.log("  - testSystem存在:", typeof window.testSystem);
    console.log("  - questions存在:", typeof this.questions);
    console.log("  - getQuestionData存在:", typeof this.getQuestionData);
    console.log(
      "  - convertLetterToAnswerText存在:",
      typeof this.convertLetterToAnswerText
    );

    // 2. 質問データの確認
    console.log("2. 質問データ:");
    try {
      if (this.questions) {
        console.log(
          "  - worldview配列:",
          Array.isArray(this.questions.worldview)
            ? this.questions.worldview.length + "個"
            : "not array"
        );
        console.log(
          "  - scenarios配列:",
          Array.isArray(this.questions.scenarios)
            ? this.questions.scenarios.length + "個"
            : "not array"
        );

        if (this.questions.worldview && this.questions.worldview.length > 0) {
          const first = this.questions.worldview[0];
          console.log("  - 最初の価値観設問:", {
            id: first.id,
            hasOptions: !!first.options,
            optionsLength: first.options?.length,
          });
        }

        if (this.questions.scenarios && this.questions.scenarios.length > 0) {
          const first = this.questions.scenarios[0];
          console.log("  - 最初のシナリオ設問:", {
            id: first.id,
            hasOptions: !!first.options,
            hasInner: !!first.options?.inner,
            hasOuter: !!first.options?.outer,
          });
        }
      } else {
        console.error("  ❌ this.questionsが未定義");
      }
    } catch (error) {
      console.error("  ❌ 質問データ確認エラー:", error);
    }

    // 3. 変換テスト
    console.log("3. 変換テスト:");

    // Q1のAテスト
    try {
      const q1Result = this.convertLetterToAnswerText("Q1", "A");
      console.log("  - Q1, A:", q1Result ? "成功" : "失敗");
    } catch (error) {
      console.error("  - Q1, A: エラー -", error.message);
    }

    // Q25のテスト
    try {
      const q25Result = this.convertLetterToAnswerText("Q25_内面", "A");
      console.log("  - Q25_内面, A:", q25Result ? "成功" : "失敗");
    } catch (error) {
      console.error("  - Q25_内面, A: エラー -", error.message);
    }

    // 4. getQuestionDataテスト
    console.log("4. getQuestionDataテスト:");
    try {
      const worldviewData = this.getQuestionData("worldview", "q1");
      console.log("  - worldview q1:", worldviewData ? "取得成功" : "取得失敗");

      const scenarioData = this.getQuestionData("scenario", "q25");
      console.log("  - scenario q25:", scenarioData ? "取得成功" : "取得失敗");
    } catch (error) {
      console.error("  - getQuestionDataエラー:", error);
    }

    console.log("🔍 === 診断完了 ===");
  }

  // デバッグ用: 確認なしで一括処理を実行
  async debugBatchProcessing() {
    console.log("🔧 デバッグモード: 確認なしで一括処理開始");

    const rawText = document.getElementById("batch-answers-input").value;
    if (!rawText.trim()) {
      console.error("❌ 入力テキストが空です");
      return;
    }

    console.log("🔧 デバッグ用一括処理実行中...");

    try {
      const results = await this.processBatchAndGenerate(rawText);
      console.log("✅ デバッグ処理完了:", results);
      return results;
    } catch (error) {
      console.error("❌ デバッグ処理エラー:", error);
      throw error;
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
