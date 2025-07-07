// /functions/api/professional-ai.js

import { HAQEI_DATA } from "../lib/database.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

//【新規追加】AIの応答を整形し、JSONとして解析する関数
function sanitizeAndParseJson(jsonString) {
  // 1. 前後の空白を削除し、JSONオブジェクトの開始と終了を探す
  let sanitized = jsonString.trim();
  const startIndex = sanitized.indexOf("{");
  const endIndex = sanitized.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error(
      "AIの応答から有効なJSONオブジェクトが見つかりませんでした。"
    );
  }

  sanitized = sanitized.substring(startIndex, endIndex + 1);

  // 2. よくある構文エラー（末尾のカンマなど）を正規表現で修正
  // 配列やオブジェクトの最後の要素の後にある不要なカンマを削除
  sanitized = sanitized.replace(/,\s*(?=])/g, "").replace(/,\s*(?=})/g, "");

  // 3. 整形された文字列をJSONとして解析
  try {
    return JSON.parse(sanitized);
  } catch (e) {
    console.error("サニタイズ後もJSONパースに失敗しました。");
    console.error("Sanitized string:", sanitized);
    // 元のAIの応答もログに出力してデバッグしやすくする
    console.error("Original AI Response:", jsonString);
    throw new Error(
      `AIが生成したデータのフォーマットが不正です。再試行してください。(詳細: ${e.message})`
    );
  }
}

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
      generationConfig,
      safetySettings,
    });
    const response = result.response;
    if (response.promptFeedback?.blockReason) {
      throw new Error(
        `AIがコンテンツ生成を拒否しました: ${response.promptFeedback.blockReason}`
      );
    }
    const responseText = response.text();
    if (!responseText) {
      throw new Error("AIが空のレスポンスを返しました。");
    }

    // 【修正点】JSON.parseの前に、新しく作成したサニタイズ関数を呼び出す
    return sanitizeAndParseJson(responseText);
  } catch (e) {
    console.error("Gemini API Error or JSON Parse Error:", e);
    throw new Error(`AIとの通信または応答の解析に失敗しました: ${e.message}`);
  }
}

function createReportPrompt(payload) {
  const { analysis, context, profile, selectedFuture, worry } = payload;
  const os1 = analysis.hexagram_candidates[0];
  const os2 = analysis.hexagram_candidates[1];
  const os3 = analysis.hexagram_candidates[2];
  const osManual1 =
    analysis.os_manual && analysis.os_manual[os1.hexagram_id]
      ? analysis.os_manual[os1.hexagram_id]
      : {};
  const osManual2 =
    analysis.os_manual && analysis.os_manual[os2.hexagram_id]
      ? analysis.os_manual[os2.hexagram_id]
      : {};
  const osManual3 =
    analysis.os_manual && analysis.os_manual[os3.hexagram_id]
      ? analysis.os_manual[os3.hexagram_id]
      : {};

  return `
# 役割:
あなたは東洋哲学と現代心理学を統合した「HaQeiアナライザー」の最高AIアナリストです。ユーザーから提供された情報を基に、パーソナライズされた「統合戦略レポート」の各セクションを生成してください。あなたの言葉は、ユーザーにとっての「専用ナビ」となり、「運転教本」となります。

# 絶対的ルール:
- **出力は必ず、指示された構造のJSONオブジェクトのみとします。** JSON以外のテキストは一切含めないでください。
- 各キーの値に含まれるHTMLは、**p, ul, li, strong, br タグのみ**使用可能です。**見出しタグ(h1-h4)は絶対に使用しないでください。**
- 全ての文章は、ユーザーの具体的な状況（課題、OS、選択した未来）に深く根ざした、具体的で実践的な内容にしてください。

# ユーザー情報:
- **MBTI:** ${profile.mbti}, **エニアグラム:** ${
    profile.enneagram.join(", ") || "未入力"
  }, **ストレングスファインダー:** ${
    profile.sf ? profile.sf.join(", ") : "未入力"
  }
- **課題:** ${worry}
- **人格OS:**
  - **エンジンOS (本質):** ${os1.name_jp} (${osManual1.summary || ""})
  - **インターフェースOS (表舞台):** ${os2.name_jp} (${osManual2.summary || ""})
  - **セーフモードOS (可能性):** ${os3.name_jp} (${osManual3.summary || ""})
- **選択した未来の道のり:**
  - 現在地: ${selectedFuture.path[0]["親となる卦"]} ${
    selectedFuture.path[0]["爻"]
  }（テーマ：${selectedFuture.path[0]["キーワード"]}）
  - フェーズ1: ${selectedFuture.path[1]["親となる卦"]} ${
    selectedFuture.path[1]["爻"]
  }（テーマ：${selectedFuture.path[1]["キーワード"]}）
  - フェーズ2: ${selectedFuture.path[2]["親となる卦"]} ${
    selectedFuture.path[2]["爻"]
  }（テーマ：${selectedFuture.path[2]["キーワード"]}）
  - 最終到達点: ${selectedFuture.path[3]["親となる卦"]} ${
    selectedFuture.path[3]["爻"]
  }（テーマ：${selectedFuture.path[3]["キーワード"]}）

# 生成指示:
以下のJSON構造に従い、各項目を詳細な指示に基づいて生成してください。

\`\`\`json
{
  "future_resolution": "...",
  "phase_strategies": [
    {
      "phase_name": "フェーズ1",
      "phase_hexagram": "...",
      "phase_narrative": "...",
      "os_leverage": "...",
      "os_friction_buster": "..."
    },
    {
      "phase_name": "フェーズ2",
      "phase_hexagram": "...",
      "phase_narrative": "...",
      "os_leverage": "...",
      "os_friction_buster": "..."
    },
    {
      "phase_name": "フェーズ3 (最終到達点)",
      "phase_hexagram": "...",
      "phase_narrative": "...",
      "os_leverage": "...",
      "os_friction_buster": "..."
    }
  ],
  "final_message": "..."
}
\`\`\`

## 各キーの詳細な生成指示:

### future_resolution (選んだ未来の解像度UP)
まず、ユーザーが選択した未来への旅路全体が、彼/彼女のOSや課題「${worry}」と掛け合わされることで持つ「**今回の人生におけるテーマ**」を、感動的で示唆に富んだ物語として解説してください。なぜこの道筋が、今のあなたにとって意味を持つのか、その深い意味を解き明かしてください。

### phase_strategies (各フェーズの戦略)
選択した未来に至る3つのフェーズそれぞれについて、以下の要素を含むオブジェクトを配列として生成してください。

- **phase_name**: "フェーズ1", "フェーズ2", "フェーズ3 (最終到達点)" のいずれか。
- **phase_hexagram**: 各フェーズの卦と爻の名前（例: "地天泰 初九"）。
- **phase_narrative**: このフェーズの爻が持つ普遍的な教訓と、ユーザーの課題「${worry}」を結びつけ、**「もし、あなたがこの道を進むなら、このような状況が訪れるでしょう」**という"What-If"の物語を具体的に描写してください。
- **os_leverage (OS活用戦略 - このフェーズを加速させる、あなただけのドライバー)**: このフェーズを成功させるために、**エンジンOS「${
    os1.name_jp
  }」**と**インターフェースOS「${
    os2.name_jp
  }」**の特性を具体的にどう活かすべきか、戦術レベルで提案してください。
- **os_friction_buster (思考のフック - 壁にぶつかった時の、OS由来の抜け道)**: このフェーズで**「進みたいけど進めない」という葛藤や障害**に直面した時、**セーフモードOS「${
    os3.name_jp
  }」**をどう活用すれば乗り越えられるか、具体的な「思考の転換法」や「具体的なアクション」を提示してください。

### final_message (最終メッセージ)
レポートの最後には、「この戦略書を羅針盤に、あなたの素晴らしい旅を始めてください。また道に迷った時は、いつでもHaQeiがあなたの現在地を照らします」という趣旨の、ユーザーの旅立ちを力強く後押しするオリジナルメッセージで締めくくってください。
`;
}

async function generateReport(payload, env) {
  const prompt = createReportPrompt(payload);
  return await callGenerativeAI(prompt, env);
}

function assembleFullReportHtml(aiSectionsObject) {
  let html = "";

  html += `<div class="report-section"><h3>選んだ未来の解像度UP</h3><div class="prose max-w-none prose-invert">${
    aiSectionsObject.future_resolution ||
    "<p>レポートセクションの生成に失敗しました。</p>"
  }</div></div>`;

  (aiSectionsObject.phase_strategies || []).forEach((phase) => {
    html += `
        <div class="report-section">
            <h3>${phase.phase_name}: ${phase.phase_hexagram || ""}</h3>
            <div class="space-y-8">
                <div>
                    <h4 class="font-semibold text-lg text-gray-300 mb-3">【展開予測】 このフェーズであなたに起こりうること</h4>
                    <div class="prose max-w-none prose-invert text-gray-300">${
                      phase.phase_narrative || ""
                    }</div>
                </div>
                <div class="p-6 bg-gray-900/50 rounded-lg border-l-4 border-cyan-400">
                    <h4 class="font-semibold text-lg text-cyan-300 mb-3">【OS活用戦略】このフェーズを加速させる、あなただけのドライバー</h4>
                    <div class="prose max-w-none prose-invert text-gray-300">${
                      phase.os_leverage || ""
                    }</div>
                </div>
                <div class="p-6 bg-gray-900/50 rounded-lg border-l-4 border-purple-400">
                    <h4 class="font-semibold text-lg text-purple-300 mb-3">【思考のフック】壁にぶつかった時の、OS由来の抜け道</h4>
                    <div class="prose max-w-none prose-invert text-gray-300">${
                      phase.os_friction_buster || ""
                    }</div>
                </div>
            </div>
        </div>`;
  });

  html += `<div class="report-section"><h3>最終メッセージ</h3><div class="prose max-w-none prose-invert">${
    aiSectionsObject.final_message ||
    "<p>レポートセクションの生成に失敗しました。</p>"
  }</div></div>`;

  return html;
}

export async function onRequestPost(context) {
  try {
    const requestData = await context.request.json();

    if (
      !requestData.analysis ||
      !requestData.profile ||
      !requestData.selectedFuture
    ) {
      throw new Error("リクエストデータが不完全です。");
    }

    requestData.analysis.os_manual = HAQEI_DATA.os_manual;

    const aiSectionsObject = await generateReport(requestData, context.env);

    const fullReportHtml = assembleFullReportHtml(aiSectionsObject);

    return new Response(
      JSON.stringify({ success: true, report: fullReportHtml }),
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }
    );
  } catch (error) {
    console.error("Function Error:", error);
    const errorBody = JSON.stringify({
      success: false,
      error: "AIレポートの生成中にエラーが発生しました: " + error.message,
    });
    return new Response(errorBody, {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
}
