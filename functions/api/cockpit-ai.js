// /functions/api/cockpit-ai.js

import { GoogleGenerativeAI } from "@google/generative-ai";

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
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini API呼び出しエラー:", error);
    throw new Error(`AIとの通信に失敗しました: ${error.message}`);
  }
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { os1, os2, os3, worry } = await request.json();

    if (!os1 || !os2 || !os3) {
      throw new Error(
        "必要なデータ（OS情報）がフロントエンドから送信されませんでした。"
      );
    }

    const prompt = `
      あなたは、東洋哲学と心理学を統合した「HaQei」の専門家AIです。
      ユーザーの人格は、優劣のない複数のOSの集合体として捉えます。以下のOSプロファイルと課題を深く洞察し、それぞれのOSが持つ「強み」と「注意点」を、ユーザーの課題解決という文脈で具体的に解説してください。

      # ユーザーのOSプロファイル
      - 🔥エンジンOS（根源的な動機・エネルギー）: ${os1.name_jp} (${
      os1.keywords
    })
      - 🎭インターフェースOS（社会的な武器・実行ツール）: ${os2.name_jp} (${
      os2.keywords
    })
      - 🛡️セーフモードOS（心の安全基地・回復力）: ${os3.name_jp} (${
      os3.keywords
    })

      # ユーザーが抱える課題
      「${worry || "特になし"}」

      # 生成すべきJSONの構造と各キーの内容
      {
        "engine_os_analysis": {
          "nickname": "（エンジンOSの特性を表現するキャッチーなニックネーム）",
          "explanation": "（3つのOSの連携を一つの物語として解説）",
          "strength": "（エンジンOSの強みを、課題解決の文脈で解説）",
          "caution": "（エンジンOSの注意点を、課題解決の文脈で解説）"
        },
        "interface_os_analysis": {
          "strength": "（インターフェースOSの強みを、課題解決の文脈で解説）",
          "caution": "（インターフェースOSの注意点を、課題解決の文脈で解説）"
        },
        "safe_mode_os_analysis": {
          "strength": "（セーフモードOSの強みを、課題解決の文脈で解説）",
          "caution": "（セーフモードOSの注意点を、課題解決の文脈で解説）"
        }
      }

      # 各キーの生成指示
      - "engine_os_analysis"内の"nickname"と"explanation"は、3つのOS全体の連携を分析した上で生成してください。
      - 各解説は、提示された課題に100%沿った、具体的で実行可能なアドバイスにしてください。
      - OS間に優劣があるような表現は絶対に避け、それぞれがあなたにとって不可欠な「異なる側面」として描いてください。「チーム」という言葉は使わないでください。
      - ユーザーに寄り添い、希望を与えるような、力強くも優しいトーンで記述してください。
      - 必ず指示されたJSON形式で出力してください。説明文などの余計なテキストは一切含めないでください。
    `;

    const aiResponse = await callGenerativeAI(prompt, env);

    return new Response(JSON.stringify({ success: true, data: aiResponse }), {
      headers: { "Content-Type": "application/json; charset=utf-8" },
      status: 200,
    });
  } catch (error) {
    console.error("Function Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        status: 500,
      }
    );
  }
}
