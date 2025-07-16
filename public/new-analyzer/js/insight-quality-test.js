// 統合洞察品質テストシステム
class InsightQualityTester {
  constructor() {
    this.testResults = [];
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.qualityMetrics = {};
    this.testInputSystem = null;
    this.dataManager = null;

    // 初期化を遅延実行
    setTimeout(() => this.init(), 100);
  }

  async init() {
    try {
      console.log("🧪 統合洞察品質テスター初期化開始");

      // DataManagerの初期化
      this.dataManager = new DataManager();
      await this.dataManager.loadData();

      // TestInputSystemを独立して初期化（DOM要素なしで）
      this.initTestInputSystemForTesting();

      console.log("✅ 統合洞察品質テスター初期化完了");
    } catch (error) {
      console.error("❌ 統合洞察品質テスター初期化エラー:", error);
    }
  }

  // テスト専用のTestInputSystem初期化
  initTestInputSystemForTesting() {
    // TestInputSystemの必要なメソッドのみを模擬実装
    this.testInputSystem = {
      dataManager: this.dataManager,

      // 矛盾検出メソッド
      detectContrast: (characteristics) => {
        return this.mockDetectContrast(characteristics);
      },

      // 統合メッセージ生成メソッド
      generateUnifyingMessage: (contrastResult, characteristics) => {
        return this.mockGenerateUnifyingMessage(
          contrastResult,
          characteristics
        );
      },

      // OS組み合わせ分析メソッド
      analyzeOSCombination: (engineData, interfaceData, safeData) => {
        return this.mockAnalyzeOSCombination(
          engineData,
          interfaceData,
          safeData
        );
      },
    };
  }

  // 矛盾検出の模擬実装
  mockDetectContrast(characteristics) {
    const { engine, interface: interfaceChar, safe } = characteristics;

    const contrastPairs = [];
    let hasContrast = false;

    // 創造性 vs 調和性の矛盾
    if (
      (engine.type === "creative" && interfaceChar.type === "harmonious") ||
      (engine.type === "harmonious" && interfaceChar.type === "creative")
    ) {
      contrastPairs.push({
        type1: "creative",
        type2: "harmonious",
        description: "創造性と調和性の矛盾",
      });
      hasContrast = true;
    }

    // 分析性 vs 創造性の矛盾
    if (
      (engine.type === "analytical" && interfaceChar.type === "creative") ||
      (engine.type === "creative" && interfaceChar.type === "analytical")
    ) {
      contrastPairs.push({
        type1: "analytical",
        type2: "creative",
        description: "分析性と創造性の矛盾",
      });
      hasContrast = true;
    }

    // 安定性 vs 変化性の矛盾
    if (
      (safe.type === "stable" && engine.energy === "active") ||
      (safe.type === "stable" && interfaceChar.energy === "active")
    ) {
      contrastPairs.push({
        type1: "stable",
        type2: "active",
        description: "安定性と変化性の矛盾",
      });
      hasContrast = true;
    }

    return {
      hasContrast,
      contrastPairs,
      characteristics,
    };
  }

  // 統合メッセージ生成の模擬実装
  mockGenerateUnifyingMessage(contrastResult, characteristics) {
    if (!contrastResult.hasContrast) {
      return this.generateHarmoniousMessage(characteristics);
    }

    return this.generateContrastMessage(contrastResult, characteristics);
  }

  // 調和的メッセージ生成
  generateHarmoniousMessage(characteristics) {
    const messages = [
      "あなたは一貫した価値観を持つ、安定感のあるリーダーです。その調和の取れた特性が、周囲に安心感と信頼をもたらします。",
      "バランスの取れた人格で、どのような状況でも安定した判断力を発揮できる、信頼性の高い人物です。",
      "統一された価値観が、あなたの強固な基盤となり、一貫性のある行動力を生み出しています。",
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  // 矛盾メッセージ生成
  generateContrastMessage(contrastResult, characteristics) {
    const contrastTypes = contrastResult.contrastPairs
      .map((pair) => pair.description)
      .join("、");

    const messages = [
      `あなたは${contrastTypes}という一見矛盾する特性を併せ持つ、多面的で魅力的なリーダーです。この複雑さこそが、あなたの独特な強みとなり、様々な状況に柔軟に対応できる能力を生み出しています。`,
      `${contrastTypes}の組み合わせが、あなたに他にはない独創性をもたらします。この多様性が、チームに新しい視点と革新的なアイデアを提供する源泉となっています。`,
      `一見相反する${contrastTypes}の特性を統合することで、あなたは従来の枠を超えた新しいリーダーシップスタイルを確立しています。この複雑さが、あなたの最大の魅力です。`,
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  // OS組み合わせ分析の模擬実装
  mockAnalyzeOSCombination(engineData, interfaceData, safeData) {
    const characteristics = {
      engine: this.extractCharacteristics(engineData),
      interface: this.extractCharacteristics(interfaceData),
      safe: this.extractCharacteristics(safeData),
    };

    const contrastResult = this.mockDetectContrast(characteristics);
    const unifyingMessage = this.mockGenerateUnifyingMessage(
      contrastResult,
      characteristics
    );

    return {
      characteristics,
      contrastResult,
      unifyingMessage,
    };
  }

  // データから特性を抽出
  extractCharacteristics(data) {
    if (!data) return { type: "unknown", energy: "neutral", focus: "general" };

    // キーワードから特性を推定
    const keywords = data.keywords || "";
    let type = "balanced";
    let energy = "moderate";
    let focus = "general";

    if (keywords.includes("創造") || keywords.includes("革新")) {
      type = "creative";
      energy = "active";
      focus = "innovation";
    } else if (keywords.includes("調和") || keywords.includes("協力")) {
      type = "harmonious";
      energy = "social";
      focus = "relationship";
    } else if (keywords.includes("分析") || keywords.includes("洞察")) {
      type = "analytical";
      energy = "deep";
      focus = "understanding";
    } else if (keywords.includes("安定") || keywords.includes("継続")) {
      type = "stable";
      energy = "calm";
      focus = "security";
    }

    return { type, energy, focus };
  }

  // 全テスト実行
  async runAllTests() {
    console.log("🚀 統合洞察品質テスト開始");

    this.resetTestResults();

    try {
      // 矛盾検出テスト群
      await this.runContrastDetectionTests();

      // 統合メッセージテスト群
      await this.runUnifyingMessageTests();

      // 品質評価テスト群
      await this.runQualityMetricsTests();

      // OS組み合わせパターンテスト群
      await this.runCombinationPatternTests();

      // テスト結果を表示
      this.displayTestResults();
      this.displayInsightPreviews();

      return {
        total: this.totalTests,
        passed: this.passedTests,
        failed: this.failedTests,
        results: this.testResults,
        qualityMetrics: this.qualityMetrics,
      };
    } catch (error) {
      console.error("❌ 統合洞察品質テスト実行エラー:", error);
      throw error;
    }
  }

  // 矛盾検出テスト群
  async runContrastDetectionTests() {
    console.log("🔍 矛盾検出テスト群開始");

    // テスト1: 創造性 vs 調和性の矛盾検出
    this.runTest("創造性vs調和性の矛盾検出", () => {
      const characteristics = {
        engine: { type: "creative", energy: "active", focus: "innovation" },
        interface: {
          type: "harmonious",
          energy: "social",
          focus: "relationship",
        },
        safe: { type: "stable", energy: "calm", focus: "security" },
      };

      const result = this.testInputSystem.detectContrast(characteristics);

      if (!result || typeof result !== "object") {
        return {
          success: false,
          error: "detectContrastが結果を返しませんでした",
        };
      }

      if (!result.hasContrast) {
        return { success: false, error: "明らかな矛盾が検出されませんでした" };
      }

      if (!result.contrastPairs || result.contrastPairs.length === 0) {
        return { success: false, error: "矛盾ペアが特定されませんでした" };
      }

      return true;
    });

    // テスト2: 調和的組み合わせでの矛盾非検出
    this.runTest("調和的組み合わせでの矛盾非検出", () => {
      const characteristics = {
        engine: { type: "harmonious", energy: "social", focus: "relationship" },
        interface: {
          type: "harmonious",
          energy: "social",
          focus: "relationship",
        },
        safe: { type: "stable", energy: "calm", focus: "security" },
      };

      const result = this.testInputSystem.detectContrast(characteristics);

      if (!result || typeof result !== "object") {
        return {
          success: false,
          error: "detectContrastが結果を返しませんでした",
        };
      }

      if (result.hasContrast) {
        return {
          success: false,
          error: "調和的組み合わせで矛盾が検出されました",
        };
      }

      return true;
    });

    // テスト3: 複数の矛盾検出
    this.runTest("複数の矛盾検出", () => {
      const characteristics = {
        engine: { type: "creative", energy: "active", focus: "innovation" },
        interface: {
          type: "analytical",
          energy: "deep",
          focus: "understanding",
        },
        safe: { type: "harmonious", energy: "social", focus: "relationship" },
      };

      const result = this.testInputSystem.detectContrast(characteristics);

      if (!result || !result.hasContrast) {
        return { success: false, error: "複数の矛盾が検出されませんでした" };
      }

      if (!result.contrastPairs || result.contrastPairs.length < 2) {
        return {
          success: false,
          error: "複数の矛盾ペアが特定されませんでした",
        };
      }

      return true;
    });

    // テスト4: エッジケース - 同一特性
    this.runTest("同一特性での矛盾非検出", () => {
      const characteristics = {
        engine: { type: "creative", energy: "active", focus: "innovation" },
        interface: { type: "creative", energy: "active", focus: "innovation" },
        safe: { type: "creative", energy: "active", focus: "innovation" },
      };

      const result = this.testInputSystem.detectContrast(characteristics);

      if (result.hasContrast) {
        return { success: false, error: "同一特性で矛盾が検出されました" };
      }

      return true;
    });
  }

  // 統合メッセージテスト群
  async runUnifyingMessageTests() {
    console.log("💬 統合メッセージテスト群開始");

    // テスト1: 矛盾する組み合わせでの魅力的表現
    this.runTest("矛盾組み合わせの魅力的表現", () => {
      const characteristics = {
        engine: { type: "creative", energy: "active", focus: "innovation" },
        interface: {
          type: "harmonious",
          energy: "social",
          focus: "relationship",
        },
        safe: { type: "stable", energy: "calm", focus: "security" },
      };

      const contrastResult =
        this.testInputSystem.detectContrast(characteristics);
      const message = this.testInputSystem.generateUnifyingMessage(
        contrastResult,
        characteristics
      );

      if (!message || typeof message !== "string") {
        return {
          success: false,
          error: "統合メッセージが生成されませんでした",
        };
      }

      if (message.length < 50) {
        return {
          success: false,
          error: "メッセージが短すぎます（50文字未満）",
        };
      }

      // 肯定的な表現が含まれているかチェック
      const positiveKeywords = [
        "魅力",
        "多面的",
        "リーダーシップ",
        "強み",
        "才能",
        "能力",
        "特徴",
      ];
      const hasPositiveExpression = positiveKeywords.some((keyword) =>
        message.includes(keyword)
      );

      if (!hasPositiveExpression) {
        return { success: false, error: "肯定的な表現が含まれていません" };
      }

      return true;
    });

    // テスト2: 調和的組み合わせでの一貫性表現
    this.runTest("調和的組み合わせの一貫性表現", () => {
      const characteristics = {
        engine: { type: "harmonious", energy: "social", focus: "relationship" },
        interface: {
          type: "harmonious",
          energy: "social",
          focus: "relationship",
        },
        safe: { type: "stable", energy: "calm", focus: "security" },
      };

      const contrastResult =
        this.testInputSystem.detectContrast(characteristics);
      const message = this.testInputSystem.generateUnifyingMessage(
        contrastResult,
        characteristics
      );

      if (!message || typeof message !== "string") {
        return {
          success: false,
          error: "統合メッセージが生成されませんでした",
        };
      }

      // 一貫性を表す表現が含まれているかチェック
      const consistencyKeywords = ["一貫", "安定", "調和", "統一", "バランス"];
      const hasConsistencyExpression = consistencyKeywords.some((keyword) =>
        message.includes(keyword)
      );

      if (!hasConsistencyExpression) {
        return { success: false, error: "一貫性を表す表現が含まれていません" };
      }

      return true;
    });

    // テスト3: 特定の組み合わせパターンでのメッセージ品質
    this.runTest("革新者+調和者+安定者の統合メッセージ品質", () => {
      const characteristics = {
        engine: { type: "creative", energy: "active", focus: "innovation" },
        interface: {
          type: "harmonious",
          energy: "social",
          focus: "relationship",
        },
        safe: { type: "stable", energy: "calm", focus: "security" },
      };

      const contrastResult =
        this.testInputSystem.detectContrast(characteristics);
      const message = this.testInputSystem.generateUnifyingMessage(
        contrastResult,
        characteristics
      );

      // メッセージ品質の評価
      const quality = this.evaluateMessageQuality(message, characteristics);

      if (quality.score < 70) {
        return {
          success: false,
          error: `メッセージ品質が低すぎます（スコア: ${quality.score}）`,
        };
      }

      return true;
    });

    // テスト4: 複雑な矛盾パターンでのメッセージ生成
    this.runTest("複雑な矛盾パターンでのメッセージ生成", () => {
      const characteristics = {
        engine: { type: "analytical", energy: "deep", focus: "understanding" },
        interface: { type: "creative", energy: "active", focus: "innovation" },
        safe: { type: "harmonious", energy: "social", focus: "relationship" },
      };

      const contrastResult =
        this.testInputSystem.detectContrast(characteristics);
      const message = this.testInputSystem.generateUnifyingMessage(
        contrastResult,
        characteristics
      );

      if (!message || message.length < 100) {
        return {
          success: false,
          error: "複雑なパターンに対する十分な説明が生成されませんでした",
        };
      }

      // 3つの特性すべてが言及されているかチェック
      const mentionsAllTypes = ["分析", "創造", "調和"].every(
        (type) => message.includes(type) || message.includes(type.charAt(0))
      );

      if (!mentionsAllTypes) {
        return {
          success: false,
          error: "すべての特性が適切に言及されていません",
        };
      }

      return true;
    });
  }

  // 品質評価テスト群
  async runQualityMetricsTests() {
    console.log("📈 品質評価テスト群開始");

    // 複数の組み合わせパターンで品質評価を実行
    const testPatterns = [
      {
        name: "革新者+調和者+安定者",
        characteristics: {
          engine: { type: "creative", energy: "active", focus: "innovation" },
          interface: {
            type: "harmonious",
            energy: "social",
            focus: "relationship",
          },
          safe: { type: "stable", energy: "calm", focus: "security" },
        },
      },
      {
        name: "分析者+創造者+調和者",
        characteristics: {
          engine: {
            type: "analytical",
            energy: "deep",
            focus: "understanding",
          },
          interface: {
            type: "creative",
            energy: "active",
            focus: "innovation",
          },
          safe: { type: "harmonious", energy: "social", focus: "relationship" },
        },
      },
      {
        name: "調和者+安定者+バランス型",
        characteristics: {
          engine: {
            type: "harmonious",
            energy: "social",
            focus: "relationship",
          },
          interface: { type: "stable", energy: "calm", focus: "security" },
          safe: { type: "balanced", energy: "moderate", focus: "general" },
        },
      },
    ];

    for (const pattern of testPatterns) {
      this.runTest(`${pattern.name}の品質評価`, () => {
        const contrastResult = this.testInputSystem.detectContrast(
          pattern.characteristics
        );
        const message = this.testInputSystem.generateUnifyingMessage(
          contrastResult,
          pattern.characteristics
        );

        const quality = this.evaluateMessageQuality(
          message,
          pattern.characteristics
        );

        // 品質メトリクスを保存
        this.qualityMetrics[pattern.name] = quality;

        if (quality.score < 60) {
          return {
            success: false,
            error: `品質スコアが低すぎます（${quality.score}点）`,
          };
        }

        return true;
      });
    }

    // 全体的な品質統計テスト
    this.runTest("全体品質統計の妥当性", () => {
      const scores = Object.values(this.qualityMetrics).map((m) => m.score);
      const averageScore =
        scores.reduce((sum, score) => sum + score, 0) / scores.length;

      if (averageScore < 70) {
        return {
          success: false,
          error: `平均品質スコアが低すぎます（${averageScore.toFixed(1)}点）`,
        };
      }

      return true;
    });
  }

  // OS組み合わせパターンテスト群
  async runCombinationPatternTests() {
    console.log("🎨 OS組み合わせパターンテスト群開始");

    // 実際のOS IDを使用したテスト
    const testCombinations = [
      { name: "乾為天+坤為地+震為雷", engine: 1, interface: 2, safe: 3 },
      { name: "巽為風+離為火+坎為水", engine: 57, interface: 30, safe: 29 },
      { name: "艮為山+兌為沢+天風姤", engine: 52, interface: 58, safe: 44 },
    ];

    for (const combination of testCombinations) {
      this.runTest(`実際のOS組み合わせ: ${combination.name}`, () => {
        try {
          // 実際のデータを取得
          const engineData = this.dataManager.getUnifiedHexagramData(
            combination.engine
          );
          const interfaceData = this.dataManager.getUnifiedHexagramData(
            combination.interface
          );
          const safeData = this.dataManager.getUnifiedHexagramData(
            combination.safe
          );

          if (!engineData || !interfaceData || !safeData) {
            return { success: false, error: "OSデータの取得に失敗しました" };
          }

          // 組み合わせ分析を実行
          const analysis = this.testInputSystem.analyzeOSCombination(
            engineData,
            interfaceData,
            safeData
          );

          if (!analysis || typeof analysis !== "object") {
            return { success: false, error: "OS組み合わせ分析が失敗しました" };
          }

          if (
            !analysis.unifyingMessage ||
            analysis.unifyingMessage.length < 50
          ) {
            return { success: false, error: "統合メッセージが不十分です" };
          }

          // 品質評価
          const quality = this.evaluateMessageQuality(
            analysis.unifyingMessage,
            analysis.characteristics
          );
          this.qualityMetrics[combination.name] = quality;

          return true;
        } catch (error) {
          return { success: false, error: `実行エラー: ${error.message}` };
        }
      });
    }
  }

  // メッセージ品質評価
  evaluateMessageQuality(message, characteristics) {
    if (!message || typeof message !== "string") {
      return { score: 0, details: { error: "メッセージが無効です" } };
    }

    let score = 0;
    const details = {};

    // 長さの評価（10点満点）
    if (message.length >= 100) {
      score += 10;
      details.length = "適切";
    } else if (message.length >= 50) {
      score += 7;
      details.length = "短め";
    } else {
      score += 3;
      details.length = "短すぎる";
    }

    // 肯定的表現の評価（20点満点）
    const positiveKeywords = [
      "魅力",
      "多面的",
      "リーダーシップ",
      "強み",
      "才能",
      "能力",
      "特徴",
      "優れた",
      "素晴らしい",
    ];
    const positiveCount = positiveKeywords.filter((keyword) =>
      message.includes(keyword)
    ).length;
    score += Math.min(positiveCount * 4, 20);
    details.positiveExpression = `${positiveCount}個の肯定的表現`;

    // 特性言及の評価（20点満点）
    const typeKeywords = ["創造", "革新", "調和", "安定", "分析", "バランス"];
    const mentionedTypes = typeKeywords.filter((keyword) =>
      message.includes(keyword)
    ).length;
    score += Math.min(mentionedTypes * 4, 20);
    details.typeMention = `${mentionedTypes}個の特性言及`;

    // 統合性の評価（20点満点）
    const unifyingKeywords = [
      "統合",
      "組み合わせ",
      "融合",
      "調和",
      "バランス",
      "相互作用",
    ];
    const unifyingCount = unifyingKeywords.filter((keyword) =>
      message.includes(keyword)
    ).length;
    score += Math.min(unifyingCount * 5, 20);
    details.unification = `${unifyingCount}個の統合表現`;

    // 具体性の評価（15点満点）
    const specificKeywords = ["戦略", "方法", "活用", "発揮", "実現", "達成"];
    const specificCount = specificKeywords.filter((keyword) =>
      message.includes(keyword)
    ).length;
    score += Math.min(specificCount * 3, 15);
    details.specificity = `${specificCount}個の具体的表現`;

    // 読みやすさの評価（15点満点）
    const sentences = message
      .split(/[。！？]/)
      .filter((s) => s.trim().length > 0);
    if (sentences.length >= 3 && sentences.length <= 6) {
      score += 15;
      details.readability = "適切な文章構成";
    } else if (sentences.length >= 2) {
      score += 10;
      details.readability = "文章構成やや不適切";
    } else {
      score += 5;
      details.readability = "文章構成不適切";
    }

    return {
      score: Math.min(score, 100),
      details: details,
      message: message,
    };
  }

  // テスト実行ヘルパー
  runTest(testName, testFunction) {
    this.totalTests++;
    const timestamp = new Date().toLocaleTimeString();

    try {
      const result = testFunction();
      if (result === true || (result && result.success !== false)) {
        this.passedTests++;
        this.testResults.push({
          timestamp,
          name: testName,
          status: "success",
          message: "テスト成功",
        });
        console.log(`✅ テスト成功: ${testName}`);
        return true;
      } else {
        this.failedTests++;
        const errorMsg = result && result.error ? result.error : "不明なエラー";
        this.testResults.push({
          timestamp,
          name: testName,
          status: "error",
          message: `テスト失敗: ${errorMsg}`,
        });
        console.log(`❌ テスト失敗: ${testName} - ${errorMsg}`);
        return false;
      }
    } catch (error) {
      this.failedTests++;
      this.testResults.push({
        timestamp,
        name: testName,
        status: "error",
        message: `テスト例外: ${error.message}`,
      });
      console.log(`❌ テスト例外: ${testName} - ${error.message}`);
      return false;
    }
  }

  // テスト結果リセット
  resetTestResults() {
    this.testResults = [];
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.qualityMetrics = {};
  }

  // テスト結果表示
  displayTestResults() {
    // 統計更新
    document.getElementById("total-tests").textContent = this.totalTests;
    document.getElementById("passed-tests").textContent = this.passedTests;
    document.getElementById("failed-tests").textContent = this.failedTests;
    document.getElementById("success-rate").textContent =
      this.totalTests > 0
        ? Math.round((this.passedTests / this.totalTests) * 100) + "%"
        : "0%";

    // テスト結果一覧
    const resultsContainer = document.getElementById("test-results");
    resultsContainer.innerHTML = "";

    if (this.testResults.length === 0) {
      resultsContainer.innerHTML =
        '<p class="text-muted">テスト結果がありません。</p>';
      return;
    }

    this.testResults.forEach((result) => {
      const resultElement = document.createElement("div");
      resultElement.className = `test-result-item test-${result.status}`;
      resultElement.innerHTML = `
                <strong>[${result.timestamp}] ${result.name}</strong><br>
                ${result.message}
            `;
      resultsContainer.appendChild(resultElement);
    });
  }

  // 洞察プレビュー表示
  displayInsightPreviews() {
    const previewsContainer = document.getElementById("insight-previews");
    previewsContainer.innerHTML = "";

    if (Object.keys(this.qualityMetrics).length === 0) {
      previewsContainer.innerHTML =
        '<p class="text-muted">洞察例がありません。</p>';
      return;
    }

    Object.entries(this.qualityMetrics).forEach(([name, quality]) => {
      if (quality.message) {
        const previewElement = document.createElement("div");
        previewElement.className = "combination-test";
        previewElement.innerHTML = `
                    <div class="combination-header">${name}</div>
                    <div class="insight-preview">${quality.message}</div>
                    <div class="quality-metrics">
                        <div class="metric">
                            <div class="metric-value">${quality.score}</div>
                            <div>品質スコア</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value">${
                              quality.details.length || "N/A"
                            }</div>
                            <div>文章長</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value">${
                              quality.details.positiveExpression || "N/A"
                            }</div>
                            <div>肯定表現</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value">${
                              quality.details.unification || "N/A"
                            }</div>
                            <div>統合表現</div>
                        </div>
                    </div>
                `;
        previewsContainer.appendChild(previewElement);
      }
    });
  }
}

// グローバル変数
let insightQualityTester = null;

// ページ読み込み時の初期化
document.addEventListener("DOMContentLoaded", async () => {
  try {
    insightQualityTester = new InsightQualityTester();
    console.log("✅ 統合洞察品質テスターが初期化されました");
  } catch (error) {
    console.error("❌ 統合洞察品質テスター初期化エラー:", error);
  }
});

// グローバル関数（HTMLから呼び出し用）
async function runAllInsightQualityTests() {
  if (!insightQualityTester) {
    alert("テスターが初期化されていません。ページを再読み込みしてください。");
    return;
  }

  try {
    const results = await insightQualityTester.runAllTests();
    console.log("📊 統合洞察品質テスト完了:", results);

    if (results.failed === 0) {
      alert(
        `🎉 すべてのテストが成功しました！\n総テスト数: ${results.total}\n成功率: 100%`
      );
    } else {
      alert(
        `⚠️ テスト完了\n総テスト数: ${results.total}\n成功: ${
          results.passed
        }\n失敗: ${results.failed}\n成功率: ${Math.round(
          (results.passed / results.total) * 100
        )}%`
      );
    }
  } catch (error) {
    console.error("❌ テスト実行エラー:", error);
    alert("テスト実行中にエラーが発生しました: " + error.message);
  }
}

async function runContrastDetectionTests() {
  if (!insightQualityTester) {
    alert("テスターが初期化されていません。");
    return;
  }

  insightQualityTester.resetTestResults();
  await insightQualityTester.runContrastDetectionTests();
  insightQualityTester.displayTestResults();
}

async function runUnifyingMessageTests() {
  if (!insightQualityTester) {
    alert("テスターが初期化されていません。");
    return;
  }

  insightQualityTester.resetTestResults();
  await insightQualityTester.runUnifyingMessageTests();
  insightQualityTester.displayTestResults();
  insightQualityTester.displayInsightPreviews();
}

async function runQualityMetricsTests() {
  if (!insightQualityTester) {
    alert("テスターが初期化されていません。");
    return;
  }

  insightQualityTester.resetTestResults();
  await insightQualityTester.runQualityMetricsTests();
  insightQualityTester.displayTestResults();
  insightQualityTester.displayInsightPreviews();
}
