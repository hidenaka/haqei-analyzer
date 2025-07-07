import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AIの応答テキストからJSON部分のみを安全に抽出する関数
 * @param {string} rawText - AIからの生の応答テキスト
 * @returns {string} - 抽出されたJSON文字列
 */
function extractJson(rawText) {
  if (!rawText) return null;

  // ```json ... ``` で囲まれた部分を探す
  const match = rawText.match(/```json\s*([\s\S]*?)\s*```/);
  if (match && match[1]) {
    return match[1].trim();
  }

  // もし上記パターンにマッチしない場合、波括弧で始まる最初のJSONオブジェクトを探す
  const firstBrace = rawText.indexOf("{");
  const lastBrace = rawText.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return rawText.substring(firstBrace, lastBrace + 1).trim();
  }

  // どうしても見つからない場合は、元のテキストをそのまま返す（パース時にエラーになる可能性あり）
  return rawText.trim();
}

/**
 * AIとの通信を行うヘルパー関数
 * @param {string} prompt - AIに送信するプロンプト
 * @param {object} env - Cloudflareの環境変数
 * @returns {Promise<object>} - AIが生成したJSONオブジェクト
 */
async function callGenerativeAI(prompt, env) {
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
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

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig, // ← この行を追加
      safetySettings, // ← この行も追加
    });

    const response = result.response;

    if (response.promptFeedback?.blockReason) {
      throw new Error(
        `AIがコンテンツ生成を拒否しました: ${response.promptFeedback.blockReason}`
      );
    }

    // responseText以降の処理は変更なし...
    const responseText = response.text();
    if (!responseText) {
      throw new Error("AIからの応答が空です。");
    }
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini API Error or JSON Parse Error:", error);
    throw new Error("AIとの通信、または応答の解析に失敗しました。");
  }
}

/**
 * Cloudflare Pages Functionsのメインハンドラ
 * @param {object} requestContext - リクエストコンテキスト
 */
export async function onRequestPost(requestContext) {
  const { request, env } = requestContext;

  try {
    const requestData = await request.json();
    // ここでのチェックはペイロードのキー名で行う
    if (!requestData.analysis || !requestData.context || !requestData.profile) {
      return new Response(
        JSON.stringify({
          title: "データ不足エラー",
          analysis_text:
            "<p>フロントエンドから送信された分析データが不完全です。お手数ですが、OS分析からやり直してください。</p>",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        }
      );
    }

    const { analysis, context, profile } = requestData;

    const os1 = analysis.hexagram_candidates[0];
    const os2 = analysis.hexagram_candidates[1];
    const os3 = analysis.hexagram_candidates[2];

    const hasStrengths = profile?.sf && profile.sf.length > 0;

    const profileItems = [];
    if (profile?.mbti) profileItems.push(`MBTI(${profile.mbti})`);
    if (profile?.enneagram?.length > 0)
      profileItems.push(`エニアグラム(${profile.enneagram.join(", ")})`);
    if (hasStrengths)
      profileItems.push(
        `ストレングスファインダーTOP5(${profile.sf.join(", ")})`
      );
    const profileLine = `- プロファイル: ${
      profileItems.join(", ") || "未入力"
    }`;

    const contextParts = [];
    if (context?.age) contextParts.push(`年代(${context.age})`);
    if (context?.occupation) contextParts.push(`職業(${context.occupation})`);
    if (context?.role) contextParts.push(`役割(${context.role})`);
    if (context?.issue) contextParts.push(`課題(${context.issue})`);
    const situationLine =
      contextParts.length > 0
        ? `- 状況: ${contextParts.join(", ")}`
        : "- 状況: 全体的な自己理解";

    const prompt = `
      あなたは、東洋哲学と心理学を統合した「HaQei」の最高専門家AIです。
      # 絶対的ルール
      - ユーザーの3つの人格OSの連携を分析し、「ニックネーム（タイトル）」と「統合的な強みの解説」を生成します。
      - 出力は必ず、指示された構造のJSONオブジェクトのみとします。前後に\`\`\`jsonや\`\`\`などの余分な文字列は絶対につけないでください。
      - 出力するJSONのキーは "title" と "analysis_text" のみです。
      - "analysis_text" の中身は、<p>タグで囲まれたHTMLテキストのみ使用可能です。

      # ユーザー情報
      - ユーザー名: ${context?.name || "利用者"}様
      ${profileLine}
      ${situationLine}
      # 分析結果サマリー
      - エンジンOS: ${os1.name_jp}
      - インターフェースOS: ${os2.name_jp}
      - セーフモードOS: ${os3.name_jp}

      # 生成すべきJSON
      {
        "title": "（ここに生成したニックネーム/タイトル）",
        "analysis_text": "<p>（ここに生成した統合的な強みの解説）</p>"
      }
    `;

    const aiResult = await callGenerativeAI(prompt, env);

    return new Response(JSON.stringify(aiResult), {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (error) {
    console.error("Function Error:", error);
    return new Response(
      JSON.stringify({
        title: "サーバーエラー",
        analysis_text: `<p>サーバー内部で予期せぬエラーが発生しました。(${error.message})</p>`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }
    );
  }
}
