// /functions/api/pro-future-ai.js

import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gemini APIを呼び出すための汎用ヘルパー関数
 * @param {string} prompt - AIに送るプロンプト
 * @param {object} env - Cloudflareの環境変数 (APIキーを含む)
 * @returns {Promise<object>} - AIからのJSONレスポンスをパースしたオブジェクト
 */
async function callGemini(prompt, env) {
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

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;

  if (response.promptFeedback?.blockReason) {
    throw new Error(
      `AIの応答がブロックされました: ${response.promptFeedback.blockReason}`
    );
  }

  const responseText = response.text();
  try {
    // クライアントにそのまま返すため、ここではパースしない
    return responseText;
  } catch (e) {
    console.error("AIからのレスポンス処理でエラーが発生しました。", e);
    throw new Error("AIが予期せぬ形式のデータを返しました。");
  }
}

/**
 * Cloudflare Pagesのメインリクエストハンドラ
 */
export async function onRequestPost(context) {
  try {
    const { worry, paths } = await context.request.json();
    if (!worry || !paths || !Array.isArray(paths) || paths.length === 0) {
      throw new Error("相談内容またはシナリオデータが不足しています。");
    }

    // --- 統合プロンプトの組み立て ---
    // 【最終版 v5】/functions/api/pro-future-ai.js 内のプロンプト

    // 【最終版 v6】/functions/api/pro-future-ai.js 内のプロンプト

    const prompt = `
# 役割設定
あなたは、易経と最新の評価システムを統合した未来分析ツール「HaQei」の熟練アナリストです。単なる解釈の羅列ではなく、相談者の心に響き、希望と具体的な行動指針を与える、感動的な物語を紡ぐことを使命とします。

# 思考プロセス
以下の3ステップの思考プロセスに従って、最終的なJSONを生成してください。
1.  **ステップ分析:** まず、各シナリオの4つのステップ（現在地、フェーズ1, 2, フェーズ3）それぞれが、相談者の状況において「具体的にどのような状況か」を分析し、50〜80文字程度の簡潔な要約文を作成します。これを \`step_summaries\` に格納します。
2.  **トランジション分析:** 次に、各ステップ間の繋がりが、なぜそのように変化するのかを、**前のステップの課題を次のステップでどう乗り越えるか**という視点で、具体的な行動指針として50〜100文字で作成します。これがユーザーにとっての「次の一手」となります。これを \`transitions\` に格納します。
3.  **物語構築:** 最後に、ステップ1と2で作成した要約と行動指針の流れを骨子として、全体として一貫性のある、感動的な「物語(narrative)」と、具体的な「心構え(advice)」を生成します。

# 最重要コンセプト
このツールは、ユーザーの未来を断定するものではありません。「最終到達点」という考え方を捨て、「現実的な次のフェーズ」を提示することで、ユーザーが繰り返し訪れ、自分の現在地を確認したくなるような、旅の伴走者としての役割を果たしてください。物語の結末は、決定的な未来ではなく、新たな可能性の始まりを示唆する形で締めくくってください。

# 入力情報
## 1. 相談者の生の言葉
「${worry}」

## 2. 8つの未来シナリオのデータ
${JSON.stringify(paths, null, 2)}

## 3. コンテキストの推測とパーソナライズ
- **ペルソナ:** 相談者の言葉から、その人が「組織で働いている」のか、「個人で活動している（または、しようとしている）」のかを推測し、物語とアドバイスをそのコンテキストに合わせてパーソナライズしてください。（例：「同僚」vs「協力者」、「上司」vs「クライアント」）
- **ジェンダー:** 相談者の性別を断定せず、ジェンダーニュートラルな表現を徹底してください。

# 期待するアウトプット形式（JSON）
思考プロセスの結果を、以下の形式のJSON配列のみで出力してください。他のテキストは一切含めないでください。
\`\`\`json
[
  {
    "scenario_rank": "S",
    "scenario_title": "（AIが生成した、シナリオの魅力を一言で表すタイトル）",
    "narrative": "（AIが生成した、ステップの流れに沿った、具体的で感動的な物語）",
    "advice": "（AIが生成した、この未来をより良く生きるための、簡潔な心構えやアドバイス）",
    "step_summaries": [
      "（思考プロセス1で生成した、現在地の状況要約）",
      "（思考プロセス1で生成した、フェーズ1の状況要約）",
      "（思考プロセス1で生成した、フェーズ2の状況要約）",
      "（思考プロセス1で生成した、フェーズ3の状況要約）"
    ],
    "transitions": [
      "（思考プロセス2で生成した、現在地→1への行動指針）",
      "（思考プロセス2で生成した、1→2への行動指針）",
      "（思考プロセス2で生成した、2→3への行動指針）"
    ]
  },
  // ... 必ず8つのシナリオ全てについて、同様のオブジェクトを生成してください ...
]
\`\`\`
`;

    // --- Gemini APIを実行し、結果を返す ---
    const jsonResponse = await callGemini(prompt, context.env);

    return new Response(jsonResponse, {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (error) {
    console.error("【Pro-Future-AI Error】:", error);
    const errorBody = JSON.stringify({
      success: false,
      error: "AIによる未来予測レポートの生成中にエラーが発生しました。",
      message: error.message,
    });
    return new Response(errorBody, {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
}
