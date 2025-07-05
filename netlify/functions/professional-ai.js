// ファイルパス: /netlify/functions/professional-ai.js (v5.0 最終改善版)
const { HAQEI_DATA } = require("../../assets/haqei_main_database.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

// ★★★ AIへの指示（プロンプト）を3つの改善要件に基づき全面改訂 ★★★
async function generateProfessionalReportSections(
  analysisResult,
  userContext,
  userProfile
) {
  const os1 = analysisResult.hexagram_candidates[0];
  const os2 = analysisResult.hexagram_candidates[1];
  const os3 = analysisResult.hexagram_candidates[2];
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  const hasContext =
    userContext.issue &&
    userContext.issue.trim() &&
    userContext.issue !== "特になし";
  const hasStrengths =
    userProfile.strengthsFinder && userProfile.strengthsFinder.length > 0;

  const prompt = `
あなたは、東洋哲学と心理学を統合した「HaQei」の最高専門家AIです。ユーザーの分析結果と状況を深く洞察し、これが「私のための戦略書だ」と実感できる、論理的で希望に満ちた具体的なレポートを作成してください。

# 絶対的ルール
- **出力は必ず、以下のキーを持つJSONオブジェクトのみ**とします: \`{"introduction": "...", "diagnosis_rationale": "...", "dynamics_and_location": "...", "next_three_steps": "...", "for_simulator": "..."}\`
- 各キーの値は、HTMLのpタグやul/liタグで構成される文字列とします。見出しタグ(h1,h2,h3,h4)は**絶対に含めないでください**。
- 文章はプロフェッショナルかつ温かいトーンで記述し、強調したいキーワードは\`<strong>\`タグで囲んでください。
- ユーザーの個人的な課題（${
    userContext.issue
  }）に寄り添い、レポート全体を通して、その解決の糸口となるように記述してください。

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

# 生成すべきJSONの各キーの内容

### "introduction" (0. はじめに - あなただけの戦略書)
ユーザーの状況と課題を踏まえ、このレポートがその人だけのOS設計図を基にした、具体的な『取扱説明書』と『実践戦略』であることを伝えてください。

### "diagnosis_rationale" (1.5. あなたのOSが導き出された根拠)
**【最重要】** なぜこのOS構成になったのか、論理の橋を架けてください。ユーザーの性格（MBTI、エニアグラム、ストレングスファインダー）の各特性が、3つのOS（エンジン、インターフェース、セーフモード）とどのように結びついているのかを具体的に解説してください。
例：「あなたのMBTIである**INFP**の持つ『内なる情熱』は、無から有を生み出す【エンジンOS：${
    os1.name_jp
  }】のエネルギーと強く共鳴します。また、ストレングスファインダーの**『資質名』**は、社会的な振る舞いを司る【インターフェースOS：${
    os2.name_jp
  }】の〇〇という性質に現れています。」

### "dynamics_and_location" (2. OS力学と現在地)
以下の3部構成で、ユーザーのエネルギーがどう使われているかを物語として解説してください。
1.  **OSの連携（現在の強み）:** 3つのOSがどう連携し、ユーザーの状況（役割や課題）において、どのような強力な布陣となっているかを解説。
2.  **葛藤のパターン（課題の核心）:** その強力な布陣だからこそ起こりやすい葛藤やエネルギーの罠を、ユーザーの課題（${
    userContext.issue
  }）と関連付けながら優しく指摘。

### "next_three_steps" (3. 未来への羅針盤 - 次の三手)
ユーザーが明日から実践できる、非常に具体的で小さな行動を「三手」として提案してください。各アクションが、どのOSをどのように育てる、またはバランスを取るためのものかを明確に結びつけてください。

### "for_simulator" (4. 未来への思考実験)
**【重要】** 抽象的な機能紹介ではなく、その場でできる思考実験を提供してください。提示した「次の三手」を【実行した場合の3ヶ月後】と【実行しなかった場合の3ヶ月後】を想像させ、それぞれの未来でユーザーの課題（${
    userContext.issue
  }）がどう変化している可能性があるか、具体的に記述してください。これにより、行動の重要性をリアルに感じさせ、次の一歩を力強く後押しします。
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    // 応答テキストからJSON部分を安全に抽出
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AIの応答が有効なJSON形式ではありません。");
    }
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Gemini API Error or JSON Parse Error:", error);
    throw new Error("AIの応答形式が不正か、APIとの通信に失敗しました。");
  }
}

// ★★★ HTML組み立て関数を3つの改善要件に基づき全面改訂 ★★★
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

  // --- 【要件2：個別化の明示】パーソナライズ宣言ブロックの生成 ---
  const personalizationHeader = `
    <div class="p-4 bg-gray-700/50 rounded-lg mb-10 border-l-4 border-indigo-400">
      <h3 class="font-bold text-lg text-indigo-300">
        この戦略書は、${userContext.name || "利用者"}様のために作成されました
      </h3>
      <p class="text-sm text-gray-400 mt-2">
        以下の入力情報に基づき、あなたのポテンシャルを最大化するための戦略をAIが生成しました。
      </p>
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

  // --- レポートセクションの組み立て ---
  const section0 = `<div class="report-block"><h3>0. はじめに - あなただけの戦略書</h3>${aiSectionsObject.introduction}</div>`;
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

  // --- 【要件1：透明性の担保】診断の根拠セクションの生成 ---
  const section1_5 = `<div class="report-block"><h3>1.5. あなたのOSが導き出された根拠 - なぜ、この設計図なのか？</h3>${aiSectionsObject.diagnosis_rationale}</div>`;

  const section2 = `<div class="report-block"><h3>2. OS力学と現在地 - あなたのエネルギーは今、どう使われているか</h3>${aiSectionsObject.dynamics_and_location}</div>`;
  const section3 = `<div class="report-block"><h3>3. 未来への羅針盤 - ポテンシャルを最大化する「次の三手」</h3>${aiSectionsObject.next_three_steps}</div>`;

  // --- 【要件3：具体的な次の行動】思考実験セクションの生成 ---
  const section4 = `<div class="report-block"><h3>4. 未来への思考実験 - あなたの決断が創る未来</h3>${aiSectionsObject.for_simulator}</div>`;

  // --- 全セクションを結合して最終的なHTMLを返す ---
  return (
    personalizationHeader +
    section0 +
    section1 +
    section1_5 +
    section2 +
    section3 +
    section4
  );
}
