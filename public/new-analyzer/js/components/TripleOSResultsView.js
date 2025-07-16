// TripleOSResultsView.js - 3層OS分析結果表示コンポーネント
// HaQei Analyzer - Triple OS Results View Component

class TripleOSResultsView extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.analysisResult = null;
  }

  get defaultOptions() {
    return {
      ...super.defaultOptions,
      onExploreMore: null,
      onRetakeTest: null,
      onGenerateReport: null,
      showAnimation: true,
    };
  }

  // 分析結果データを設定
  setData(analysisResult) {
    this.analysisResult = analysisResult;
    console.log("🎯 TripleOSResultsView: Data set", analysisResult);
  }

  render() {
    if (!this.analysisResult) {
      this.container.innerHTML = `
        <div class="error">
          分析結果が見つかりません。
        </div>
      `;
      return;
    }

    const { engineOS, interfaceOS, safeModeOS, consistencyScore, integration } =
      this.analysisResult;

    this.container.innerHTML = `
      <div class="triple-os-results-container">
        <div class="results-header">
          <h1 class="results-title animate-fade-in">🎯 3層人格OS分析結果</h1>
          <p class="results-subtitle animate-fade-in animate-delay-200">
            あなたの人格を3つの層で分析しました
          </p>
        </div>

        <div class="consistency-score-section animate-fade-in animate-delay-400">
          <div class="consistency-card">
            <h3 class="consistency-title">人格一貫性スコア</h3>
            <div class="consistency-score">
              <div class="score-circle">
                <div class="score-value">${Math.round(
                  consistencyScore.overall * 100
                )}%</div>
                <div class="score-label">総合一貫性</div>
              </div>
              <div class="score-breakdown">
                <div class="score-item">
                  <span class="score-name">エンジン ↔ インターフェース</span>
                  <span class="score-bar">
                    <span class="score-fill" style="width: ${
                      consistencyScore.engineInterface * 100
                    }%"></span>
                  </span>
                  <span class="score-percent">${Math.round(
                    consistencyScore.engineInterface * 100
                  )}%</span>
                </div>
                <div class="score-item">
                  <span class="score-name">エンジン ↔ セーフモード</span>
                  <span class="score-bar">
                    <span class="score-fill" style="width: ${
                      consistencyScore.engineSafeMode * 100
                    }%"></span>
                  </span>
                  <span class="score-percent">${Math.round(
                    consistencyScore.engineSafeMode * 100
                  )}%</span>
                </div>
                <div class="score-item">
                  <span class="score-name">インターフェース ↔ セーフモード</span>
                  <span class="score-bar">
                    <span class="score-fill" style="width: ${
                      consistencyScore.interfaceSafeMode * 100
                    }%"></span>
                  </span>
                  <span class="score-percent">${Math.round(
                    consistencyScore.interfaceSafeMode * 100
                  )}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="os-cards-section animate-fade-in animate-delay-600">
          <div class="os-cards-grid">
            ${this.renderOSCard(
              engineOS,
              "engine",
              "🔧",
              "エンジンOS",
              "核となる価値観・動機"
            )}
            ${this.renderOSCard(
              interfaceOS,
              "interface",
              "🖥️",
              "インターフェースOS",
              "外面的な行動パターン"
            )}
            ${this.renderOSCard(
              safeModeOS,
              "safemode",
              "🛡️",
              "セーフモードOS",
              "内面的な防御機制"
            )}
          </div>
        </div>

        <div class="integration-insights-section animate-fade-in animate-delay-800">
          <div class="integration-card">
            <h3 class="integration-title">統合洞察</h3>
            <div class="integration-content">
              <div class="insight-summary">
                <h4>全体的な分析</h4>
                <p>${integration.summary}</p>
              </div>
              
              <div class="insight-details">
                <div class="insight-item">
                  <strong>エンジンOS:</strong> ${integration.engineInsight}
                </div>
                <div class="insight-item">
                  <strong>インターフェースOS:</strong> ${
                    integration.interfaceInsight
                  }
                </div>
                <div class="insight-item">
                  <strong>セーフモードOS:</strong> ${
                    integration.safeModeInsight
                  }
                </div>
                <div class="insight-item">
                  <strong>一貫性:</strong> ${integration.consistencyInsight}
                </div>
              </div>

              <div class="recommendations">
                <h4>推奨事項</h4>
                <ul>
                  ${integration.recommendations
                    .map((rec) => `<li>${rec}</li>`)
                    .join("")}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="results-actions animate-fade-in animate-delay-1000">
          <button id="explore-more-btn" class="btn btn-lg">
            📊 詳細分析を見る
          </button>
          <button id="generate-report-btn" class="btn btn-secondary">
            📄 レポート生成
          </button>
          <button id="retake-test-btn" class="btn btn-secondary">
            🔄 再診断
          </button>
        </div>
      </div>
    `;

    this.bindEvents();
    this.startAnimations();
  }

  // OSカードをレンダリング
  renderOSCard(osData, type, icon, title, description) {
    const strengthDisplay = this.getStrengthDisplay(osData, type);
    const cardClass = `os-card os-card-${type}`;

    return `
      <div class="${cardClass}">
        <div class="os-card-header">
          <div class="os-icon">${icon}</div>
          <div class="os-info">
            <h3 class="os-title">${title}</h3>
            <p class="os-description">${description}</p>
          </div>
        </div>
        
        <div class="os-card-content">
          <div class="hexagram-display">
            <div class="hexagram-name">${osData.hexagramInfo.name}</div>
            <div class="hexagram-reading">${
              osData.hexagramInfo.reading || ""
            }</div>
          </div>
          
          ${strengthDisplay}
          
          <div class="os-details">
            ${this.renderOSDetails(osData, type)}
          </div>
        </div>
      </div>
    `;
  }

  // 強度表示を取得
  getStrengthDisplay(osData, type) {
    if (type === "engine") {
      const strength = osData.strength || 0;
      return `
        <div class="strength-display">
          <div class="strength-label">エンジン強度</div>
          <div class="strength-bar">
            <div class="strength-fill" style="width: ${strength * 100}%"></div>
          </div>
          <div class="strength-value">${Math.round(strength * 100)}%</div>
        </div>
      `;
    } else {
      const score = osData.matchScore || 0;
      return `
        <div class="match-score-display">
          <div class="match-label">マッチスコア</div>
          <div class="match-value">${Math.round(score)}%</div>
        </div>
      `;
    }
  }

  // OS詳細をレンダリング
  renderOSDetails(osData, type) {
    switch (type) {
      case "engine":
        return this.renderEngineDetails(osData);
      case "interface":
        return this.renderInterfaceDetails(osData);
      case "safemode":
        return this.renderSafeModeDetails(osData);
      default:
        return "";
    }
  }

  // エンジンOS詳細
  renderEngineDetails(engineOS) {
    // dominantTrigramsの防御的取得
    let topTrigrams = [];
    let errorMsg = "";
    if (
      !engineOS ||
      !engineOS.dominantTrigrams ||
      !Array.isArray(engineOS.dominantTrigrams)
    ) {
      errorMsg =
        '<div class="trigram-error" style="color:#ff6b6b">dominantTrigrams未生成エラー</div>';
      // フォールバック用ダミーデータ
      topTrigrams = [
        { id: 1, name: "乾", energy: 0 },
        { id: 2, name: "兌", energy: 0 },
        { id: 3, name: "離", energy: 0 },
      ];
    } else if (engineOS.dominantTrigrams.length === 0) {
      errorMsg =
        '<div class="trigram-error" style="color:#ff6b6b">dominantTrigrams空配列エラー</div>';
      topTrigrams = [
        { id: 1, name: "乾", energy: 0 },
        { id: 2, name: "兌", energy: 0 },
        { id: 3, name: "離", energy: 0 },
      ];
    } else {
      // 配列の各要素が有効なオブジェクトかチェック
      const validTrigrams = engineOS.dominantTrigrams.filter(
        (trigram) => trigram && typeof trigram === "object" && trigram.name
      );
      if (validTrigrams.length === 0) {
        errorMsg =
          '<div class="trigram-error" style="color:#ff6b6b">dominantTrigrams不正データエラー</div>';
        topTrigrams = [
          { id: 1, name: "乾", energy: 0 },
          { id: 2, name: "兌", energy: 0 },
          { id: 3, name: "離", energy: 0 },
        ];
      } else {
        topTrigrams = validTrigrams.slice(0, 3);
      }
    }

    return `
      <div class="engine-details">
        <h5>主要な八卦エネルギー</h5>
        ${errorMsg}
        <div class="trigram-composition">
          構成八卦: ${this.getTrigramComposition(engineOS)}
        </div>
        <div class="trigram-list">
          ${topTrigrams
            .map(
              (trigram, index) => `
            <div class="trigram-item">
              <span class="trigram-rank">${index + 1}位</span>
              <span class="trigram-name">${trigram.name}</span>
              <span class="trigram-energy">${
                trigram.energy !== undefined ? trigram.energy.toFixed(1) : "0.0"
              }</span>
            </div>
          `
            )
            .join("")}
        </div>
        <div class="vector-summary">
          <h6>8次元プロファイル</h6>
          <div class="dimension-chips">
            ${Object.entries(engineOS.userVector || {})
              .sort(([, a], [, b]) => b - a)
              .slice(0, 4)
              .map(
                ([key, value]) => `
                <span class="dimension-chip">
                  ${key.split("_")[1]}: ${value.toFixed(1)}
                </span>
              `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  // 🔧 trigramComposition安全取得メソッド
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

  // 🔧 八卦名取得ヘルパー
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

  // インターフェースOS詳細
  renderInterfaceDetails(interfaceOS) {
    const matches = interfaceOS.keywordMatches || [];

    return `
      <div class="interface-details">
        <h5>外面行動パターン</h5>
        <div class="keyword-matches">
          ${matches
            .slice(0, 5)
            .map(
              (match) => `
            <span class="keyword-tag">${match}</span>
          `
            )
            .join("")}
        </div>
        
        <div class="choice-summary">
          <h6>選択傾向</h6>
          <p>外面的な行動において、${
            interfaceOS.hexagramInfo.name
          }の特徴が強く現れています。</p>
        </div>
      </div>
    `;
  }

  // セーフモードOS詳細
  renderSafeModeDetails(safeModeOS) {
    const matches = safeModeOS.lineMatches || [];

    return `
      <div class="safemode-details">
        <h5>内面防御機制</h5>
        <div class="line-matches">
          ${matches
            .slice(0, 5)
            .map(
              (match) => `
            <span class="line-tag">${match}</span>
          `
            )
            .join("")}
        </div>
        
        <div class="defense-summary">
          <h6>防御パターン</h6>
          <p>ストレスや困難な状況において、${
            safeModeOS.hexagramInfo.name
          }の防御機制が作動します。</p>
        </div>
      </div>
    `;
  }

  // イベントバインド
  bindEvents() {
    const exploreBtn = this.container.querySelector("#explore-more-btn");
    const reportBtn = this.container.querySelector("#generate-report-btn");
    const retakeBtn = this.container.querySelector("#retake-test-btn");

    if (exploreBtn) {
      exploreBtn.addEventListener("click", () => {
        if (this.options.onExploreMore) {
          this.options.onExploreMore(this.analysisResult);
        }
      });
    }

    if (reportBtn) {
      reportBtn.addEventListener("click", () => {
        if (this.options.onGenerateReport) {
          this.options.onGenerateReport(this.analysisResult);
        }
      });
    }

    if (retakeBtn) {
      retakeBtn.addEventListener("click", () => {
        if (this.options.onRetakeTest) {
          this.options.onRetakeTest();
        }
      });
    }
  }

  // アニメーション開始
  startAnimations() {
    if (!this.options.showAnimation) return;

    // 一貫性スコアのアニメーション
    setTimeout(() => {
      this.animateConsistencyScore();
    }, 1000);

    // OSカードのアニメーション
    setTimeout(() => {
      this.animateOSCards();
    }, 1500);
  }

  // 一貫性スコアアニメーション
  animateConsistencyScore() {
    const scoreCircle = this.container.querySelector(".score-circle");
    const scoreFills = this.container.querySelectorAll(".score-fill");

    if (scoreCircle) {
      scoreCircle.classList.add("animate-pulse");
    }

    scoreFills.forEach((fill, index) => {
      setTimeout(() => {
        fill.style.transition = "width 1s ease-out";
        fill.style.width = fill.style.width; // トリガー
      }, index * 200);
    });
  }

  // OSカードアニメーション
  animateOSCards() {
    const cards = this.container.querySelectorAll(".os-card");

    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("animate-scale-in");
      }, index * 300);
    });
  }

  // 表示
  show() {
    super.show();
    this.render();
  }

  // 非表示
  hide() {
    return super.hide();
  }

  // HaQei診断テキスト生成（詳細フォーマット対応）
  generateTripleOSText(participant, result, format) {
    console.log("📝 generateTripleOSText開始:", {
      participant: participant.name,
      format,
      resultStructure: result ? Object.keys(result) : "none",
    });

    if (format === "detailed") {
      // 【修正1】データ参照の一貫性を確保
      const engineOS = result.engineOS;
      const interfaceOS = result.interfaceOS;
      const safeModeOS = result.safeModeOS;

      // 各OSのデータが正しく存在するかチェック
      if (
        !engineOS?.hexagramInfo ||
        !interfaceOS?.hexagramInfo ||
        !safeModeOS?.hexagramInfo
      ) {
        console.error("❌ OSデータが不完全です", {
          engineOS: !!engineOS?.hexagramInfo,
          interfaceOS: !!interfaceOS?.hexagramInfo,
          safeModeOS: !!safeModeOS?.hexagramInfo,
        });
        return this.generateErrorResult(participant);
      }

      // 【修正2】各OSの詳細情報を安全に取得
      const engineOSDetails = this.getOSDetails(engineOS, "engine");
      const interfaceOSDetails = this.getOSDetails(interfaceOS, "interface");
      const safeModeOSDetails = this.getOSDetails(safeModeOS, "safemode");

      // 【修正3】統合洞察を生成
      const integration = this.generateIntegratedInsights(
        engineOS,
        interfaceOS,
        safeModeOS,
        result.consistencyScore
      );

      return `
🎯 ${participant.name}様の HaQei 人格OS診断結果

═══════════════════════════════════════════
【あなたの3層人格OS】
═══════════════════════════════════════════

🔧 **エンジンOS（根源的な力）**
【${engineOSDetails.name}】
💥 「${engineOSDetails.catchphrase}」

🎯 **人格の核心**
${engineOSDetails.coreDescription}

🔧 **戦略的役割**
${engineOSDetails.strategicRole}

🚀 **このOSを攻めに使うと？**
${engineOSDetails.offensiveStrategy}

🛡️ **このOSが守りに入ると？**
${engineOSDetails.defensivePattern}

🔧 **暴走時のデバッグ方法**
⚠️ 症状: ${engineOSDetails.symptom}
💊 対処法: ${engineOSDetails.solution}

🎯 **今週のクエスト**
${engineOSDetails.weeklyQuests}

─────────────────────────────

🖥️ **インターフェースOS（表の顔）**
【${interfaceOSDetails.name}】
「${interfaceOSDetails.catchphrase}」

${interfaceOSDetails.description}

─────────────────────────────

🛡️ **セーフモードOS（内なる顔）**
【${safeModeOSDetails.name}】
「${safeModeOSDetails.catchphrase}」

${safeModeOSDetails.description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【人格一貫性スコア】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${Math.round((result.consistencyScore?.overall || 0) * 100)}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【統合洞察＆アクションプラン】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧠 **あなたの人格構造の全体像**
${integration.overallStructure}

⚡ **エネルギーの流れと相互作用**
${integration.energyFlow}

🎯 **人格の一貫性と成長のヒント**
${integration.growthHints}

🌟 **今月のパーソナル・クエスト**
${integration.personalQuests}

💡 **基本的な心構え**
${integration.basicMindset}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ **診断完了日時**: ${new Date().toLocaleString("ja-JP")}
🎯 **HaQei Analyzer v1.0**

この診断結果はいかがでしたか？
ぜひあなたの率直なフィードバックをお聞かせください 🙏
      `.trim();
    }

    // 他のフォーマット（summary, data）の処理...
    return this.generateSummaryFormat(participant, result);
  }

  // 【新規追加】OSの詳細情報を安全に取得するメソッド
  getOSDetails(osData, osType) {
    try {
      const hexagramInfo = osData.hexagramInfo;
      if (!hexagramInfo) {
        throw new Error(`${osType} OSのhexagramInfoが見つかりません`);
      }

      // 基本情報の取得
      const name = hexagramInfo.name || hexagramInfo.name_jp || "名称不明";
      const catchphrase = hexagramInfo.catchphrase || "特徴を分析中...";

      // 【重要】同じ卦IDから一貫してデータを取得
      const hexagramId = osData.hexagramId || hexagramInfo.hexagram_id;
      const detailedInfo = this.getDetailedHexagramInfo(hexagramId);

      return {
        name: name,
        catchphrase: catchphrase,
        coreDescription: detailedInfo.coreDescription,
        strategicRole: detailedInfo.strategicRole,
        offensiveStrategy: detailedInfo.offensiveStrategy,
        defensivePattern: detailedInfo.defensivePattern,
        symptom: detailedInfo.symptom,
        solution: detailedInfo.solution,
        weeklyQuests: detailedInfo.weeklyQuests,
        description: detailedInfo.description,
      };
    } catch (error) {
      console.error(`❌ ${osType} OSの詳細取得エラー:`, error);
      return this.getFallbackOSDetails();
    }
  }

  // 【新規追加】詳細な64卦情報を取得（データの一貫性を保証）
  getDetailedHexagramInfo(hexagramId) {
    // ここで実際の64卦データベースから詳細情報を取得
    // 現在は仮のデータを返す
    const hexagramDetails = {
      1: {
        // 乾為天
        coreDescription:
          "あなたの心の奥底には、天空を駆ける龍のような、創造と革新への強烈な衝動が宿っています。",
        strategicRole:
          "• 新しいプロジェクトの立ち上げリーダー\n• 革新的なアイデアの提案者\n• 組織変革の推進者",
        offensiveStrategy:
          "あなたの創造的エネルギーを、新しい価値を生み出す『イノベーションエンジン』として活用しましょう。",
        defensivePattern:
          "プライドが高くなりすぎて、他者の意見を聞き入れなくなる『独裁者モード』。",
        symptom: "周囲の意見を聞かず、自分の考えだけで突き進んでしまう。",
        solution:
          "定期的に信頼できる人から率直なフィードバックを求め、謙虚さを保つよう心がけましょう。",
        weeklyQuests:
          "1. 今週は必ず3人以上の人に意見を求めてから決断する\n2. 自分のアイデアに対する反対意見を積極的に聞く時間を作る",
        description: "天の龍のような創造的エネルギーに満ちた存在です。",
      },
      50: {
        // 火風鼎
        coreDescription:
          "あなたは、革命の後の混乱を収め、新たな文化や秩序を安定させる、三本足の鼎（かなえ）のような存在です。",
        strategicRole:
          "• 組織の安定化リーダー\n• 新しい文化の創造者\n• 多様性を活かすマネージャー",
        offensiveStrategy:
          "あなたの『まとめる力』を、多様な才能を統合して新しい価値を生み出す『シナジー創造エンジン』として活用しましょう。",
        defensivePattern:
          "完璧を求めすぎて、決断が遅くなる『優柔不断モード』。",
        symptom:
          "あらゆる意見を取り入れようとして、結果的に方向性が定まらなくなる。",
        solution:
          "『80点で前に進む』勇気を持ち、完璧を目指すより実行を重視しましょう。",
        weeklyQuests:
          "1. 今週は『これで十分』と言える基準を事前に決めて行動する\n2. チームメンバーの得意分野を活かした役割分担を明確にする",
        description: "新たな安定を築き上げる、懐の深いまとめ役です。",
      },
      // 他の64卦のデータも同様に定義...
    };

    return hexagramDetails[hexagramId] || this.getFallbackHexagramDetails();
  }

  // 【新規追加】統合洞察を生成
  generateIntegratedInsights(
    engineOS,
    interfaceOS,
    safeModeOS,
    consistencyScore
  ) {
    const overallScore = (consistencyScore?.overall || 0) * 100;

    return {
      overallStructure: `あなたは「${engineOS.hexagramInfo.name}」を核として、「${interfaceOS.hexagramInfo.name}」で世界と関わり、「${safeModeOS.hexagramInfo.name}」で自分を守る多層構造を持っています。`,

      energyFlow: this.analyzeEnergyFlow(engineOS, interfaceOS, safeModeOS),

      growthHints:
        overallScore >= 70
          ? "あなたの3つのOSは高い一貫性を示しており、内面と外面が調和した安定した人格構造です。この一貫性を活かし、自分らしさを大切にしながら成長を続けてください。"
          : "あなたの3つのOSには多様性があり、複雑で多面的な人格の特徴を示しています。この複雑さを理解し、場面に応じて適切なOSを使い分けることで、大きな可能性が開花します。",

      personalQuests: this.generatePersonalQuests(
        engineOS,
        interfaceOS,
        safeModeOS
      ),

      basicMindset: `• 自分の3つのOSの特性を理解し、それぞれの強みを活かす\n• 内面と外面のバランスを意識し、無理をしすぎない\n• 困った時は、自分の『セーフモードOS』を活用する\n• 一貫性スコア${Math.round(
        overallScore
      )}%を参考に、自分の複雑さを受け入れる`,
    };
  }

  // エネルギーフローを分析
  analyzeEnergyFlow(engineOS, interfaceOS, safeModeOS) {
    // 五行の相性などを考慮した分析ロジック
    return `エンジンOS「${engineOS.hexagramInfo.name}」の内なるエネルギーが、インターフェースOS「${interfaceOS.hexagramInfo.name}」を通じて外部に表現され、困難な時にはセーフモードOS「${safeModeOS.hexagramInfo.name}」が働いて自分を守ります。`;
  }

  // パーソナルクエストを生成
  generatePersonalQuests(engineOS, interfaceOS, safeModeOS) {
    return `以下から興味のあるものを選んで取り組んでみてください：

1. エンジンOS「${engineOS.hexagramInfo.name}」の特性を活かした新しい挑戦を始める
2. インターフェースOS「${interfaceOS.hexagramInfo.name}」の特徴を意識した人間関係の構築
3. セーフモードOS「${safeModeOS.hexagramInfo.name}」を理解し、ストレス対処法を見直す
4. 3つのOSのバランスを保つための日々の習慣を作る`;
  }

  // エラー時のフォールバック
  generateErrorResult(participant) {
    return `
🎯 ${participant.name}様の診断結果

申し訳ございません。診断データの処理中にエラーが発生いたしました。
システムを確認いたしますので、少々お待ちください。

診断エンジンの状態を確認し、改めて結果をお送りいたします。
    `.trim();
  }

  // フォールバックOSDetails
  getFallbackOSDetails() {
    return {
      name: "データ取得エラー",
      catchphrase: "詳細情報を取得中...",
      coreDescription:
        "申し訳ございません。データの取得中にエラーが発生しました。",
      strategicRole: "• システムを確認中です",
      offensiveStrategy: "データを再取得しています。",
      defensivePattern: "エラーが発生しています。",
      symptom: "データ不整合",
      solution: "システム管理者にご連絡ください。",
      weeklyQuests: "データ修復をお待ちください。",
      description: "データ取得エラーが発生しています。",
    };
  }

  // フォールバック64卦詳細
  getFallbackHexagramDetails() {
    return {
      coreDescription: "詳細情報を取得中です。",
      strategicRole: "• データを確認中",
      offensiveStrategy: "情報を取得しています。",
      defensivePattern: "データ確認中。",
      symptom: "情報取得中",
      solution: "少々お待ちください。",
      weeklyQuests: "データ取得をお待ちください。",
      description: "詳細情報を準備中です。",
    };
  }
}
