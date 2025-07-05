// ファイルパス: /netlify/functions/professional-ai.js (v4.0 戦略書構成案・実装版)
const { HAQEI_DATA } = require("../../assets/haqei_main_database.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// この関数はレポート表示に必要な補助データを生成するため、変更なし
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

// ★★★ AIへの指示（プロンプト）を新構成案に合わせて全面刷新 ★★★
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

  const prompt = `
あなたは、東洋哲学と心理学を統合した「HaQei」の最高専門家AIです。ユーザーの分析結果と状況を深く洞察し、これが「私のための戦略書だ」と感じられるような、希望に満ちた具体的なレポートを作成してください。

# 絶対的ルール
- **出力は必ず、以下のキーを持つJSONオブジェクトのみ**とします: \`{"introduction": "...", "dynamics_and_location": "...", "next_three_steps": "...", "for_simulator": "..."}\`
- 各キーの値は、HTMLのpタグやulタグで構成される文字列とします。見出しタグ(h1,h2,h3,h4)は**絶対に含めないでください**。
- 文章はプロフェッショナルかつ温かいトーンで記述し、強調したいキーワードは\`<strong>\`タグで囲んでください。
- ${
    hasContext
      ? "ユーザーの「課題」と「OSの力学」を具体的に結びつけて解説してください。"
      : "特定の課題入力がないため、OSの一般的なポテンシャルと力学に焦点を当てて解説してください。"
  }

# ユーザー情報
- プロファイル: MBTI(${userProfile.mbti}), エニアグラム(${
    userProfile.enneagram.join(", ") || "未入力"
  })
- 状況: ${
    hasContext
      ? `年代(${userContext.age}), 職業(${userContext.occupation}), 役割(${userContext.role}), 課題(${userContext.issue})`
      : "（特定の状況設定なし）"
  }

# 分析結果サマリー
- エンジンOS: ${os1.name_jp}
- インターフェースOS: ${os2.name_jp}
- セーフモードOS: ${os3.name_jp}

# 生成すべきJSONの各キーの内容

### 1. "introduction" (はじめに - あなただけの戦略書)
無料レポートでOSの『設計図』が明らかになったことを受け、このレポートがそのOSを使いこなすための具体的な『取扱説明書』と『実践戦略』であることを伝えてください。

### 2. "dynamics_and_location" (OS力学と現在地)
以下の3部構成で、ユーザーのエネルギーがどう使われているかを物語として解説してください。
1.  **強みの源泉:** なぜこのOS構成になったのか、ユーザーの性格(MBTI等)とOSのエネルギーを結びつけて解説。例：「あなたのMBTIが持つ〇〇という性質が、【卦名】のエネルギーと共鳴しています…」
2.  **OSの連携（現在の強み）:** 3つのOSがどう連携し、どのような強力な布陣となっているかを解説。
3.  **葛藤のパターン（課題の核心）:** その布陣だからこそ起こりやすい葛藤や、エネルギーの罠について優しく指摘。

### 3. "next_three_steps" (未来への羅針盤 - 次の三手)
ユーザーが明日から実践できる、非常に具体的で小さな行動を「三手」として提案してください。各アクションが、どのOS（エンジン/インターフェース/セーフモード）をどのように育てる、またはバランスを取るためのものかを明確に結びつけてください。

### 4. "for_simulator" (さらなる探求へ)
このレポートで得た戦略を手に、「未来分岐シミュレーター」を使うと、どのような気づきが得られるかを具体的に示唆し、次のツール利用へと自然に誘導してください。
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error or JSON Parse Error:", error);
    throw new Error("AIの応答形式が不正か、APIとの通信に失敗しました。");
  }
}

// ★★★ HTML組み立て関数を新構成案に合わせて全面刷新 ★★★
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

  // OSプロファイル項目を生成する内部関数
  const createOsProfileItem = (os, type, role, enhancedInfo) => {
    const color = getOsColor(os);
    return `<li class="p-4 bg-gray-900/50 rounded-lg border-l-4" style="border-color: ${color};">
              <strong style="color: ${color};">【${type}：<ruby>${enhancedInfo.name}<rt>${enhancedInfo.reading}</rt></ruby>】</strong><br>
              <span class="font-bold">${enhancedInfo.catchphrase}</span>
              <span class="os-role-text">${role}</span>
            </li>`;
  };

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

  const section2 = `<div class="report-block"><h3>2. OS力学と現在地 - あなたのエネルギーは今、どう使われているか</h3>${aiSectionsObject.dynamics_and_location}</div>`;

  const section3 = `<div class="report-block"><h3>3. 未来への羅針盤 - ポテンシャルを最大化する「次の三手」</h3>${aiSectionsObject.next_three_steps}</div>`;

  const section4 = `<div class="report-block"><h3>4. さらなる探求へ - 未来分岐シミュレーターの活用</h3>${aiSectionsObject.for_simulator}</div>`;

  return section0 + section1 + section2 + section3 + section4;
}
