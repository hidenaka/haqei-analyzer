// ファイルパス: /netlify/functions/professional-ai.js (リクエスト分割・並行実行版 v7.0)
const { HAQEI_DATA } = require("../../assets/haqei_main_database.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ★★★ ここからが変更箇所です ★★★

// AIへのリクエストを並行実行するためのヘルパー関数
async function callGenerativeAI(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const generationConfig = { response_mime_type: "application/json" };
  const safetySettings = [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_ONLY_HIGH",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_ONLY_HIGH",
    },
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig,
    safetySettings,
  });

  return JSON.parse(result.response.text());
}

// レポートの前半部分を生成するプロンプトを作成・実行
function generatePart1(commonPromptData) {
  const prompt = `
    ${commonPromptData.header}

    # 生成すべきJSONの構造と各キーの内容
    \`\`\`json
    {
      "introduction": "<p>...</p>",
      "diagnosis_rationale": "<p>...</p><ul><li>...</li></ul>",
      "dynamics_and_location": "<p>...</p>"
    }
    \`\`\`
    ## 各キーの詳細な生成指示
    ### "introduction" (0. はじめに - あなただけの戦略書)
    ユーザーの状況と課題を踏まえ、このレポートがその人だけのOS設計図を基にした、具体的な『取扱説明書』と『実践戦略』であることを伝えてください。

    ### "diagnosis_rationale" (1.5. あなたのOSが導き出された根拠)
    【根拠の超高解像度化】なぜこのOS構成になったのか、論理の橋を架けてください。ユーザーの性格（MBTI、エニアグラム、ストレングスファインダー）の各特性が、3つのOSとどのように結びついているのかを具体的に解説してください。

    ### "dynamics_and_location" (2. OS力学と現在地)
    ユーザーのエネルギーがどう使われているかを物語として解説してください。3つのOSがどう連携し強みとなっているか、そしてその強みゆえに生じる葛藤や課題を指摘してください。
  `;
  return callGenerativeAI(prompt);
}

// レポートの後半部分を生成するプロンプトを作成・実行
function generatePart2(commonPromptData) {
  const prompt = `
    ${commonPromptData.header}
    # 生成すべきJSONの構造と各キーの内容
    \`\`\`json
    {
      "next_three_steps": [
        { "what": "...", "how": ["...", "..."] }
      ],
      "defensive_strategy": {
        "scenarios": [
          { "stress_scenario": "...", "mental_defense": "...", "recovery_action": "..." }
        ]
      },
      "for_simulator": "<p>...</p>"
    }
    \`\`\`
    ## 各キーの詳細な生成指示
    ### "next_three_steps" (3. 未来への羅針盤 - ポテンシャルを最大化する「次の三手」)
    【アクションの戦術レベル化】ユーザーが明日から実践できる、非常に具体的な行動を「三手」として提案してください。各手について、まず'what'に「何をすべきか」を定義し、次に'how'にそのアクションを「どう実行するか」について、ユーザーのエンジンOS「${commonPromptData.os1_name}」とインターフェースOS「${commonPromptData.os2_name}」の特性を活かした具体的なアイデアや企画案を2〜3個提示してください。

    ### "defensive_strategy" (3.5. 守りの戦略 - ネガティブシナリオへの備え)
    【リスク対応戦略の実装】ユーザーの課題「${commonPromptData.issue}」で想定される具体的なストレスを2〜3個リストアップしてください。それぞれのシナリオに対して、ユーザーのセーフモードOS「${commonPromptData.os3_name}」の特性を活かした具体的な「心の守り方('mental_defense')」と「回復アクション('recovery_action')」を防衛戦略として提示してください。

    ### "for_simulator" (4. 未来への思考実験)
    提示した「次の三手」を【実行した場合の3ヶ月後】と【実行しなかった場合の3ヶ月後】を想像させ、それぞれの未来でユーザーの課題がどう変化している可能性があるか、具体的に記述してください。
  `;
  return callGenerativeAI(prompt);
}

async function generateProfessionalReportSections(
  analysisResult,
  userContext,
  userProfile
) {
  const os1 = analysisResult.hexagram_candidates[0];
  const os2 = analysisResult.hexagram_candidates[1];
  const os3 = analysisResult.hexagram_candidates[2];

  const hasStrengths =
    userProfile.strengthsFinder && userProfile.strengthsFinder.length > 0;

  // 全てのプロンプトで共通して使用するヘッダー情報
  const commonPromptHeader = `
    あなたは、東洋哲学と心理学を統合した「HaQei」の最高専門家AIです。ユーザーの分析結果と状況を深く洞察し、これが「私のための戦略書だ」と実感できる、論理的で希望に満ちた具体的なレポートを作成してください。

    # 絶対的ルール
    - 出力は必ず、指示された構造のJSONオブジェクトのみとします。JSON以外のテキストは一切含めないでください。
    - 各キーの値に含まれるHTMLは、p, ul, li, strong, brタグのみ使用可能です。見出しタグ(h1,h2,h3,h4)は絶対に含めないでください。

    # ユーザー情報
    - ユーザー名: ${userContext.name || "利用者"}様
    - プロファイル: MBTI(${userProfile.mbti}), エニアグラム(${
    userProfile.enneagram.join(", ") || "未入力"
  })${
    hasStrengths
      ? `, ストレングスファインダーTOP5(${userProfile.strengthsFinder.join(
          ", "
        )})`
      : ""
  }
    - 状況: 年代(${userContext.age}), 職業(${userContext.occupation}), 役割(${
    userContext.role
  }), 課題(${userContext.issue})

    # 分析結果サマリー
    - エンジンOS: ${os1.name_jp}
    - インターフェースOS: ${os2.name_jp}
    - セーフモードOS: ${os3.name_jp}
  `;

  const commonPromptData = {
    header: commonPromptHeader,
    issue: userContext.issue,
    os1_name: os1.name_jp,
    os2_name: os2.name_jp,
    os3_name: os3.name_jp,
  };

  try {
    // 2つのリクエストを並行して実行し、両方の完了を待つ
    const [part1Result, part2Result] = await Promise.all([
      generatePart1(commonPromptData),
      generatePart2(commonPromptData),
    ]);

    // 2つの結果を一つのオブジェクトに結合して返す
    return { ...part1Result, ...part2Result };
  } catch (error) {
    console.error("【!!!】Gemini API Error:", error);
    throw new Error(
      "AIとの通信中にエラーが発生しました。時間をおいて再度お試しください。"
    );
  }
}

// ★★★ ここまでが変更箇所です ★★★

// レポート表示に必要な補助データを生成する関数 (変更なし)
function generateReportImprovements(userProfile, db) {
  const getHexagramById = (id) =>
    db.hexagrams_master.find((h) => h.hexagram_id === id);
  const getEnhancedInfoForOS = (osId) => {
    const osData = getHexagramById(osId);
    if (!osData) return { name: "不明", reading: "", catchphrase: "" };
    return {
      name: osData.name_jp,
      reading: osData.reading,
      catchphrase: osData.catchphrase || "キャッチコピー未設定",
    };
  };
  return {
    engine: getEnhancedInfoForOS(userProfile.engineOsId),
    interface: getEnhancedInfoForOS(userProfile.interfaceOsId),
    safe_mode: getEnhancedInfoForOS(userProfile.safeModeOsId),
  };
}

// メインのハンドラ関数 (変更なし)
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const requestData = JSON.parse(event.body);
    const { analysis, context, profile } = requestData;
    if (!analysis || !context || !profile) {
      throw new Error("分析データまたはコンテキストが不完全です。");
    }

    const aiSectionsObject = await generateProfessionalReportSections(
      analysis,
      context,
      profile
    );
    const fullReportHtml = assembleFullReportHtml(
      analysis,
      context,
      profile,
      aiSectionsObject
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ success: true, report: fullReportHtml }),
    };
  } catch (error) {
    console.error("Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "AIレポートの生成中にエラーが発生しました: " + error.message,
      }),
    };
  }
};

// HTML組み立て関数 (変更なし)
function assembleFullReportHtml(
  analysisResult,
  userContext,
  userProfile,
  aiSectionsObject
) {
  const enhancedOsInfo = generateReportImprovements(
    {
      mbti: userProfile.mbti,
      engineOsId: analysisResult.hexagram_candidates[0].hexagram_id,
      interfaceOsId: analysisResult.hexagram_candidates[1].hexagram_id,
      safeModeOsId: analysisResult.hexagram_candidates[2].hexagram_id,
    },
    HAQEI_DATA
  );

  const os1 = analysisResult.hexagram_candidates[0];
  const os2 = analysisResult.hexagram_candidates[1];
  const os3 = analysisResult.hexagram_candidates[2];

  const trigram_colors = {
    1: "#F9FAFB",
    2: "#70D6FF",
    3: "#F87171",
    4: "#FACC15",
    5: "#4ADE80",
    6: "#3B82F6",
    7: "#F97316",
    8: "#A16207",
  };
  const getOsColor = (hexagram) =>
    trigram_colors[hexagram.upper_trigram_id] || "#6b7280";

  const createOsProfileItem = (os, type, role, enhancedInfo) => {
    const color = getOsColor(os);
    return `<li class="p-4 bg-gray-900/50 rounded-lg border-l-4" style="border-color: ${color};">
              <strong style="color: ${color};">【${type}：<ruby>${enhancedInfo.name}<rt>${enhancedInfo.reading}</rt></ruby>】</strong><br>
              <span class="font-bold">${enhancedInfo.catchphrase}</span>
              <span class="os-role-text">${role}</span>
            </li>`;
  };

  const personalizationHeader = `<div class="p-4 bg-gray-700/50 rounded-lg mb-10 border-l-4 border-indigo-400">
      <h3 class="font-bold text-lg text-indigo-300">この戦略書は、${
        userContext.name || "利用者"
      }様のために作成されました</h3>
      <p class="text-sm text-gray-400 mt-2">以下の入力情報に基づき、あなたのポテンシャルを最大化するための戦略をAIが生成しました。</p>
      <ul class="text-sm list-disc list-inside mt-3 space-y-1 text-gray-300">
        ${
          userContext.age
            ? `<li><strong>年代:</strong> ${userContext.age}</li>`
            : ""
        }
        ${
          userContext.occupation
            ? `<li><strong>職業:</strong> ${userContext.occupation}</li>`
            : ""
        }
        ${
          userContext.role
            ? `<li><strong>役割:</strong> ${userContext.role}</li>`
            : ""
        }
        ${
          userContext.issue
            ? `<li><strong>最も関心のある課題:</strong> ${userContext.issue}</li>`
            : ""
        }
      </ul>
    </div>`;

  const section0 = `<div class="report-block"><h3>0. はじめに - あなただけの戦略書</h3>${
    aiSectionsObject.introduction || ""
  }</div>`;
  const section1 = `<div class="report-block"><h3>1. OSアーキテクチャ・プロファイル - あなたの才能の源泉</h3>
    <ul class="list-none space-y-3 mt-4">
      ${createOsProfileItem(
        os1,
        "エンジンOS",
        "これがあなたのモチベーションの源泉であり、あなたを内側から突き動かす「譲れない価値観」です。",
        enhancedOsInfo.engine
      )}
      ${createOsProfileItem(
        os2,
        "インターフェースOS",
        "これがあなたの社会的な武器であり、人と関わる際の「得意なスタイル」です。",
        enhancedOsInfo.interface
      )}
      ${createOsProfileItem(
        os3,
        "セーフモードOS",
        "これがあなたの心の安全基地であり、ストレスを感じた時の「自己回復パターン」です。",
        enhancedOsInfo.safe_mode
      )}
    </ul>
  </div>`;
  const section1_5 = `<div class="report-block"><h3>1.5. あなたのOSが導き出された根拠 - なぜ、この設計図なのか？</h3>${
    aiSectionsObject.diagnosis_rationale || ""
  }</div>`;
  const section2 = `<div class="report-block"><h3>2. OS力学と現在地 - あなたのエネルギーは今、どう使われているか</h3>${
    aiSectionsObject.dynamics_and_location || ""
  }</div>`;
  const section3_moves = (aiSectionsObject.next_three_steps || [])
    .map(
      (step) => `
    <div class="step-item mt-6">
      <p class="what-title font-bold text-lg text-cyan-300">${
        step.what || ""
      }</p>
      <ul class="list-disc list-inside mt-2 space-y-2 pl-4">
        ${(step.how || []).map((h) => `<li>${h || ""}</li>`).join("")}
      </ul>
    </div>
  `
    )
    .join("");
  const section3 = `<div class="report-block"><h3>3. 未来への羅針盤 - ポテンシャルを最大化する「次の三手」</h3>${section3_moves}</div>`;
  const section3_5_scenarios = (
    aiSectionsObject.defensive_strategy?.scenarios || []
  )
    .map(
      (s) => `
    <div class="scenario-item mt-6 p-4 bg-gray-900/50 rounded-lg">
      <p class="stress-scenario-title font-bold text-red-300">想定ストレス： ${
        s.stress_scenario || ""
      }</p>
      <div class="mt-3">
        <p class="font-semibold text-gray-300">心の守り方:</p>
        <div class="text-gray-400 pl-4">${s.mental_defense || ""}</div>
      </div>
      <div class="mt-3">
        <p class="font-semibold text-gray-300">回復アクション:</p>
        <div class="text-gray-400 pl-4">${s.recovery_action || ""}</div>
      </div>
    </div>
  `
    )
    .join("");
  const section3_5 = section3_5_scenarios
    ? `<div class="report-block"><h3>3.5. 守りの戦略 - ネガティブシナリオへの備え</h3>${section3_5_scenarios}</div>`
    : "";
  const section4 = `<div class="report-block"><h3>4. 未来への思考実験 - あなたの決断が創る未来</h3>${
    aiSectionsObject.for_simulator || ""
  }</div>`;

  return (
    personalizationHeader +
    section0 +
    section1 +
    section1_5 +
    section2 +
    section3 +
    section3_5 +
    section4
  );
}
