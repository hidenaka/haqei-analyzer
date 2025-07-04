// ファイルパス: /netlify/functions/professional-ai.js (最終修正版 v2)
// プロンプト内の変数埋め込みエラーを完全に修正しました。

const { HAQEI_DATA } = require("../../assets/haqei_main_database.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const requestData = JSON.parse(event.body);
    const { analysis, context, profile } = requestData;

    if (
      !analysis ||
      !analysis.hexagram_candidates ||
      !analysis.trigram_profile ||
      !context ||
      !profile
    ) {
      throw new Error("分析データまたはコンテキストが不完全です。");
    }

    const generatedHtml = await generateProfessionalReportText(
      analysis,
      context,
      profile
    );
    const fullReportHtml = assembleFullReportHtml(
      analysis,
      context,
      generatedHtml
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

async function generateProfessionalReportText(
  analysisResult,
  userContext,
  userProfile
) {
  const os1 = analysisResult.hexagram_candidates[0];
  const os2 = analysisResult.hexagram_candidates[1];
  const os3 = analysisResult.hexagram_candidates[2];
  const trigram_profile = analysisResult.trigram_profile;

  const os_manuals = HAQEI_DATA.os_manual || {};
  const os1_manual = os_manuals[os1.hexagram_id] || {};
  const os2_manual = os_manuals[os2.hexagram_id] || {};
  const os3_manual = os_manuals[os3.hexagram_id] || {};

  const format_os_manual = (os, manual, type) => {
    if (!manual || !manual.summary)
      return `【${type}】: ${os.name_jp} (詳細データなし)`;
    return `
【${type}】: ${os.name_jp}
  - 概要: ${manual.summary || "N/A"}
  - 暴走パターン: ${manual.debug_pattern || "N/A"}
  - 脱出方法: ${manual.debug_method || "N/A"}
  - 最適化クエスト: ${(manual.quests || []).join(" / ")}
    `.trim();
  };

  const os_manual_details = `
${format_os_manual(os1, os1_manual, "エンジンOS")}
${format_os_manual(os2, os2_manual, "インターフェースOS")}
${format_os_manual(os3, os3_manual, "セーフモードOS")}
  `.trim();

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-latest" });

  // ▼▼▼ ここからがプロンプトの修正箇所です ▼▼▼
  const prompt = `あなたは「HaQei アナライザー」の最高専門家AIです。東洋哲学と心理学の深い知識を持ち、ユーザーの分析結果と個人的な状況を統合して、ユーザーが具体的にどう行動すれば良いかの指針となるアドバイスを生成してください。

# ルール
- 出力は必ずHTML形式とし、'<h4>4. 総合所見とあなたへの戦略的アドバイス</h4>' と '<h4>5. 次の具体的な一歩</h4>' の2つのセクションのみを生成してください。レポート全体のヘッダー等は不要です。
- 文章は、ユーザーに寄り添い、希望を与えるような、プロフェッショナルかつ温かいトーンで記述してください。専門用語は避け、誰にでも理解しやすい言葉を使ってください。
- アドバイスは、必ずOSの三位一体モデル（エンジン、インターフェース、セーフモード）の力学と、ユーザーの課題を結びつけて具体的に解説してください。
- 「具体的な一歩」は、ユーザーが明日から実践できる、具体的で小さな行動を2〜3個提案してください。
- pタグには 'class="text-sm"' を、ulタグには 'class="text-sm list-disc pl-5"' を付与してください。強調したいキーワードは<strong>タグで囲んでください。

# ユーザー情報
- **ユーザープロファイル**: MBTI(${userProfile.mbti}), エニアグラム(${
    userProfile.enneagram.join(", ") || "未入力"
  })
- **ユーザーの状況**: 年代(${userContext.age || "未入力"}), 職業(${
    userContext.occupation || "未入力"
  }), 役割(${userContext.role || "未入力"}), 課題(${
    userContext.issue || "特になし"
  })

# 分析結果：三位一体OSモデル詳細解説
${os_manual_details}

# 分析結果：エネルギープロファイル
${trigram_profile
  .map((p) => `- ${p.name_en} (${p.strength_description}): ${p.score}点`)
  .join("\n")}

上記情報を統合し、HTML形式でレポートを作成してください。
`;
  // ▲▲▲ ここまでがプロンプトの修正箇所です ▲▲▲

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Gemini APIとの通信に失敗しました。");
  }
}

function assembleFullReportHtml(analysisResult, userContext, aiGeneratedHtml) {
  const os1 = analysisResult.hexagram_candidates[0];
  const os2 = analysisResult.hexagram_candidates[1];
  const os3 = analysisResult.hexagram_candidates[2];
  const trigram_profile = analysisResult.trigram_profile;

  const contextText = `<h4>1. ご入力いただいた状況の確認</h4><p class="text-sm">「${
    userContext.age || ""
  } ${userContext.occupation || ""} ${userContext.role || ""}」で、「${
    userContext.issue || "特になし"
  }」という課題意識をお持ちなのですね。承知いたしました。その状況を踏まえ、あなたのOSを読み解いていきましょう。</p>`;
  const profileText = `<h4>2. エネルギープロファイルから見るあなたの「基本性質」</h4><p class="text-sm">あなたのエネルギーは、<strong>${
    trigram_profile[0].name_en
  }</strong>（${trigram_profile[0].strength_description}）と<strong>${
    trigram_profile[1].name_en
  }</strong>（${
    trigram_profile[1].strength_description
  }）が際立っています。一方で、<strong>${
    trigram_profile[7].name_en
  }</strong>のエネルギーが最も低いため、${trigram_profile[7].strength_description.slice(
    0,
    -1
  )}のは少し苦手かもしれません。</p>`;
  const trinityText = `<h4>3. 「三位一体OSモデル」の構造的解説</h4><p class="text-sm">あなたのOS構造は非常に興味深い連携をしています。あなたの根源的な動力源である<strong>【エンジンOS：${os1.name_jp}】</strong>が放つエネルギーは、<strong>【インターフェースOS：${os2.name_jp}】</strong>というフィルターを通して社会に表現されます。しかし、ストレスがかかると<strong>【セーフモードOS：${os3.name_jp}】</strong>が起動し、無意識に初期設定の行動パターンに立ち返る傾向があります。この3つのOSの関係性を理解することが、自己を乗りこなす鍵となります。</p>`;

  return `<h3 class="text-2xl font-bold text-amber-300 mb-6 text-center" style="font-family: 'Shippori Mincho', serif;">HaQeiプロフェッショナル<br>総合解説レポート</h3><div class="report-block">${contextText}</div><div class="report-block">${profileText}</div><div class="report-block">${trinityText}</div><div class="report-block">${aiGeneratedHtml}</div>`;
}
