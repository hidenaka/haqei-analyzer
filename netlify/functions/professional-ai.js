// ファイルパス: /netlify/functions/professional-ai.js (v2.0 改善版)
const { HAQEI_DATA } = require("../../assets/haqei_main_database.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// APIキーを環境変数から取得
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

    // AIに本文の生成を依頼
    const aiGeneratedHtml = await generateProfessionalReportText(
      analysis,
      context,
      profile
    );

    // 静的パーツとAI生成パーツを結合して最終的なHTMLを生成
    const fullReportHtml = assembleFullReportHtml(
      analysis,
      context,
      aiGeneratedHtml
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
    const quests =
      manual.quests && Array.isArray(manual.quests)
        ? manual.quests.join(" / ")
        : "N/A";
    return `【${type}】: ${os.name_jp} - 概要: ${
      manual.summary || "N/A"
    }, 暴走パターン: ${manual.debug_pattern || "N/A"}, 脱出方法: ${
      manual.debug_method || "N/A"
    }, 最適化クエスト: ${quests}`;
  };

  const os_manual_details = `${format_os_manual(
    os1,
    os1_manual,
    "エンジンOS"
  )}\n${format_os_manual(
    os2,
    os2_manual,
    "インターフェースOS"
  )}\n${format_os_manual(os3, os3_manual, "セーフモードOS")}`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  // ★★★ プロンプトを修正 ★★★
  const prompt = `あなたは「HaQei アナライザー」の最高専門家AIです。東洋哲学と心理学の深い知識を持ち、ユーザーの分析結果と個人的な状況を統合して、ユーザーが具体的にどう行動すれば良いかの指針となるアドバイスを生成してください。

# 絶対的ルール
- **出力は必ずHTMLの断片のみ**とします。\`<h4>\`タグやその他の見出しタグは**一切含めず**、\`<p class="text-sm">\` や \`<ul>\` タグから始まるコンテンツ部分のみを生成してください。
- 生成する内容は、「4. 総合所見とあなたへの戦略的アドバイス」と「5. 次の具体的な一歩」の2つのセクションの**本文に相当する部分だけ**です。
- 文章は、ユーザーに寄り添い、希望を与えるような、プロフェッショナルかつ温かいトーンで記述してください。専門用語は避け、誰にでも理解しやすい言葉を使ってください。
- アドバイスは、必ずOSの三位一体モデル（エンジン、インターフェース、セーフモード）の力学と、ユーザーの課題を結びつけて具体的に解説してください。
- 「具体的な一歩」は、ユーザーが明日から実践できる、具体的で小さな行動を2〜3個提案してください。
- 強調したいキーワードは\`<strong>\`タグで囲んでください。
- リストは\`<ul class="text-sm list-disc pl-5"><li>リスト項目</li></ul>\`の形式を使用してください。

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

上記情報を統合し、指定されたルールに従って、HTMLの断片を生成してください。`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Gemini APIとの通信に失敗しました。詳細: " + error.message);
  }
}

// ★★★ HTML組み立て関数を修正 ★★★
function assembleFullReportHtml(analysisResult, userContext, aiGeneratedHtml) {
  const os1 = analysisResult.hexagram_candidates[0];
  const os2 = analysisResult.hexagram_candidates[1];
  const os3 = analysisResult.hexagram_candidates[2];
  const trigram_profile = analysisResult.trigram_profile;

  // 静的なHTMLパーツをここで定義
  const header = `<h3 class="text-2xl font-bold text-indigo-300 mb-6 text-center" style="font-family: 'Shippori Mincho', serif;">HaQeiプロフェッショナル<br>総合解説レポート</h3>`;
  const contextText = `<div class="report-block"><h4>1. ご入力いただいた状況の確認</h4><p class="text-sm">「${
    userContext.age || ""
  } ${userContext.occupation || ""} ${userContext.role || ""}」で、「${
    userContext.issue || "特になし"
  }」という課題意識をお持ちなのですね。承知いたしました。その状況を踏まえ、あなたのOSを読み解いていきましょう。</p></div>`;
  const profileText = `<div class="report-block"><h4>2. エネルギープロファイルから見るあなたの「基本性質」</h4><p class="text-sm">あなたのエネルギーは、<strong>${
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
  )}のは少し苦手かもしれません。</p></div>`;
  const trinityText = `<div class="report-block"><h4>3. 「三位一体OSモデル」の構造的解説</h4><p class="text-sm">あなたのOS構造は非常に興味深い連携をしています。あなたの根源的な動力源である<strong>【エンジンOS：${os1.name_jp}】</strong>が放つエネルギーは、<strong>【インターフェースOS：${os2.name_jp}】</strong>というフィルターを通して社会に表現されます。しかし、ストレスがかかると<strong>【セーフモードOS：${os3.name_jp}】</strong>が起動し、無意識に初期設定の行動パターンに立ち返る傾向があります。この3つのOSの関係性を理解することが、自己を乗りこなす鍵となります。</p></div>`;

  // AIが生成したHTMLを、静的な見出しの下に配置
  const aiSection = `<div class="report-block"><h4>4. 総合所見とあなたへの戦略的アドバイス</h4>${
    aiGeneratedHtml.split("<h4>5. 次の具体的な一歩</h4>")[0] || ""
  }<h4>5. 次の具体的な一歩</h4>${
    aiGeneratedHtml.split("<h4>5. 次の具体的な一歩</h4>")[1] || ""
  }</div>`;

  return header + contextText + profileText + trinityText + aiSection;
}
