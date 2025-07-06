// /functions/api/pro-future-ai.js

import { GoogleGenerativeAI } from "@google/generative-ai";

const createPromptForSingleScenario = (worry, path, scenarioRank) => `
# 役割設定
あなたは、易経と最新の評価システムを統合した未来分析ツール「HaQei」の熟練アナリストです。単なる解釈の羅列ではなく、相談者の現状を客観的に分析し、未来の可能性と具体的な行動指針を示すことを使命とします。

# トーン＆マナー
- **ナビゲーターに徹する:** 命令形や、行動を強く促す「〜しましょう」といった表現は絶対に避けてください。
- **客観的な記述:** 「〜という展開が待っています」「〜という課題に直面するでしょう」のように、ユーザーが自ら道を選ぶための客観的な情報を提供するガイドの口調を貫いてください。
- **状況に応じた正直な表現:** スコアが低いシナリオや、状況が悪化する可能性のあるシナリオについては、楽観的な表現を避け、課題や注意点、起こりうる困難を率直に記述してください。

# 思考プロセス
以下の3ステップの思考プロセスに従って、最終的なJSONを生成してください。
1.  **ステップ分析:** 各シナリオの4つのステップ（現在地、フェーズ1, 2, 3）が、相談者の状況において「具体的にどのような状況か」を分析し、50〜80文字程度の簡潔な要約文を作成します。(\`step_summaries\` に格納)
2.  **トランジション分析:** 各ステップ間の繋がりについて、前のステップの課題を次のステップでどう乗り越えるかという視点で、具体的な行動指針を50〜100文字で作成します。（\`transitions\` に格納）
3.  **全体像の提示:** ステップ1と2を骨子として、一貫性のある「シナリオの概要(narrative)」「心構え(advice)」、そしてグラフ下に表示する「一行要約(scenario_summary)」を生成します。

# 最重要コンセプト
このツールは、ユーザーの未来を断定するものではありません。「最終到達点」という考え方を捨て、「現実的な次のフェーズ」を提示することで、ユーザーが繰り返し訪れ、自分の現在地を確認したくなるような、旅の伴走者としての役割を果たしてください。

# 入力情報
## 1. 相談者の生の言葉
「${worry}」

## 2. 分析対象の単一シナリオデータ
${JSON.stringify(path, null, 2)}

## 3. コンテキストの推測とパーソナライズ
- **ペルソナ:** 相談者の言葉から、その人が「組織で働いている」のか、「個人で活動している」のかを推測し、概要とアドバイスをそのコンテキストに合わせてパーソナライズしてください。
- **ジェンダー:** 相談者の性別を断定せず、ジェンダーニュートラルな表現を徹底してください。
- **スコアに応じたトーン調整:** 「一行要約(scenario_summary)」を生成する際、このシナリオの最終スコア(${
  path[3].S7_総合評価スコア
}点)に応じてトーンを調整してください。
    - **高得点(60点以上):** ポジティブで成長を示唆する表現。
    - **中得点(40-59点):** 現状維持または緩やかな変化を示す中立的な表現。
    - **低得点(39点以下):** 課題、困難、注意点、または状況悪化の可能性を明確に示す表現。

# 期待するアウトプット形式（JSON）
思考プロセスの結果を、以下の形式の**単一のJSONオブジェクト**で出力してください。他のテキストは一切含めないでください。

## JSON構文の厳格なルール
- **絶対に厳守:** 出力は必ず、RFC 8259に準拠した有効なJSONオブジェクトでなければなりません。
- **引用符:** オブジェクトのキーと文字列の値は、必ず**ダブルクォーテーション（"）**で囲んでください。
- **末尾のカンマ禁止:** 配列やオブジェクトの**最後の要素の後には、絶対にカンマ（,）を付けないでください。**

\`\`\`json
{
  "scenario_rank": "${scenarioRank}",
  "scenario_title": "（AIが生成した、シナリオの魅力を一言で表すタイトル）",
  "scenario_summary": "（AIが生成した、グラフ下に表示するシナリオの一行要約）",
  "narrative": "（AIが生成した、ナビゲーター口調の、シナリオの概要）",
  "advice": "（AIが生成した、ナビゲーター口調の、この未来をより良く生きるための簡潔な心構え）",
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
}
\`\`\`
`;

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
    return JSON.parse(responseText);
  } catch (e) {
    console.error("AIからのJSONパースに失敗しました。", responseText);
    throw new Error("AIが予期せぬ形式のデータを返しました。");
  }
}

export async function onRequestPost(context) {
  try {
    const { worry, paths } = await context.request.json();
    if (!worry || !paths || !Array.isArray(paths) || paths.length === 0) {
      throw new Error("相談内容またはシナリオデータが不足しています。");
    }

    const rankLabels = ["S", "A", "B", "C", "D", "E", "F", "H"];

    // --- 8つのシナリオのプロンプトを生成し、並列でAIにリクエスト ---
    const promises = paths.slice(0, 8).map((path, index) => {
      const rank = rankLabels[index] || "N/A";
      const prompt = createPromptForSingleScenario(worry, path, rank);
      return callGemini(prompt, context.env);
    });

    const results = await Promise.all(promises);

    return new Response(JSON.stringify(results), {
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
