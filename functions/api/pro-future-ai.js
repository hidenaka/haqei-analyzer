// /functions/api/pro-future-ai.js

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function onRequestPost(context) {
  // --- Gemini APIの基本設定 ---
  const genAI = new GoogleGenerativeAI(context.env.GEMINI_API_KEY);
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
    // --- フロントエンドからのデータを受け取る ---
    const { worry, paths } = await context.request.json();
    if (!worry || !paths) {
      throw new Error("相談内容またはシナリオデータが不足しています。");
    }

    // --- AIへの指示（プロンプト）を組み立てる ---
    const prompt = `
# 役割設定
あなたは、易経と最新の評価システムを統合した未来分析ツール「HaQei」の熟練アナリストです。単なる解釈の羅列ではなく、相談者の心に響き、希望と具体的な行動指針を与える、感動的な物語を紡ぐことを使命とします。

# 入力情報
## 1. 相談者の生の言葉
以下の相談内容を、物語を生成する上での感情的な基点としてください。
「${worry}」

## 2. 8つの未来シナリオのデータ
この相談者がたどる可能性のある8つの未来シナリオのデータです。各シナリオの「最終到達点」の状況や「キーワード」を物語に織り込んでください。
${JSON.stringify(paths, null, 2)}

# タスク
入力された「相談内容」と「8つのシナリオデータ」に基づき、各シナリオについて、相談者の状況と感情に深く寄り添った、パーソナルで具体的な物語（ナラティブ）を生成してください。

## 物語生成のルール
- **共感と希望:** 相談者の気持ちに寄り添い、単なる吉凶判断ではなく、未来への希望や気づきが得られるような、前向きで感動的なトーンで記述してください。
- **具体性:** 抽象的な表現は避け、情景が目に浮かぶような具体的な描写を心がけてください。
- **データ反映:** 各シナリオの「最終到達点」の状況（爻辞の要約やキーワード）や、スコアの推移（成長、停滞、下降など）を物語の展開に必ず反映させてください。
- **文字数:** 各シナリオの物語("narrative")は500〜800文字程度で、心構え("advice")は100〜150文字程度で生成してください。

# 期待するアウトプット形式（JSON）
以下の形式のJSON配列のみを、他のテキストを含めずに出力してください。
\`\`\`json
[
  {
    "scenario_rank": "S",
    "scenario_title": "（AIが生成した、シナリオの魅力を一言で表すタイトル）",
    "narrative": "（AIが生成した、具体的で感動的な物語）",
    "advice": "（AIが生成した、この未来をより良く生きるための、簡潔な心構えやアドバイス）"
  },
  // ... 必ず8つのシナリオ全てについて、同様のオブジェクトを生成してください ...
]
\`\`\`
`;

    // --- Gemini APIを実行し、結果を返す ---
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings,
    });

    // APIからのレスポンスをそのままクライアントに返す
    return new Response(result.response.text(), {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (error) {
    console.error("【Future-Narrative-AI Error】:", error);
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
