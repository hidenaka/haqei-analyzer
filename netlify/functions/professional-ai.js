// ファイルパス: /netlify/functions/professional-ai.js (v3.5 最終修正版)
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

    const aiSectionsObject = await generateProfessionalReportSections(
      analysis,
      context,
      profile
    );
    const fullReportHtml = assembleFullReportHtml(
      analysis,
      context,
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

async function generateProfessionalReportSections(
  analysisResult,
  userContext,
  userProfile
) {
  const os1 = analysisResult.hexagram_candidates[0];
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  const hasContext =
    userContext.issue &&
    userContext.issue.trim() &&
    userContext.issue !== "特になし";

  const prompt = `あなたは「HaQei アナライザー」の最高専門家AIです。東洋哲学と心理学の叡智を統合した「HaQei アナライザー」の最高専門家AIです。ユーザーの分析結果と個人的な状況を深く洞察し、ユーザーが「これは私のための戦略書だ」と感じ、次の一歩を踏み出したくなるような、希望に満ちた具体的なレポートを作成してください。

# 絶対的ルール
- **出力は必ず、以下のキーを持つJSONオブジェクトのみ**とします: \`{"dynamics": "...", "overview": "...", "action": "...", "next_steps": "..."}\`
- 各キーの値は、HTMLのpタグやulタグで構成される文字列とします。
- hタグなどの見出しタグは**一切含めないでください**。
- 文章は、ユーザーに深く寄り添い、希望と具体的な気づきを与える、プロフェッショナルかつ温かいトーンで記述してください。
- ${
    hasContext
      ? "ユーザーの「課題」と「OSの力学」を具体的に結びつけて解説してください。"
      : "特定の課題入力がないため、OSの一般的なポテンシャルと力学に焦点を当てて解説してください。"
  }
- 強調したいキーワードは\`<strong>\`タグで囲んでください。
- 箇条書きは\`<ul class="text-sm list-disc pl-5"><li>リスト項目</li></ul>\`の形式を使用してください。

# ユーザー情報
- ユーザープロファイル: MBTI(${userProfile.mbti}), エニアグラム(${
    userProfile.enneagram.join(", ") || "未入力"
  })
- ユーザーの状況: ${
    hasContext
      ? `年代(${userContext.age}), 職業(${userContext.occupation}), 役割(${userContext.role}), 課題(${userContext.issue})`
      : "（特定の状況設定なし）"
  }

# 分析結果サマリー
- エンジンOS: ${os1.name_jp}
- インターフェースOS: ${analysisResult.hexagram_candidates[1].name_jp}
- セーフモードOS: ${analysisResult.hexagram_candidates[2].name_jp}

# 生成すべきJSONの各キーの内容

### 1. "dynamics" (OSの力学)
あなたの3つのOSが互いにどう作用し合っているかを解説してください。${
    hasContext
      ? `特に、ユーザーの課題「${userContext.issue}」が、このOSの力学によってどのように生み出されているのかを、具体的に、そして優しく指摘してください。`
      : "各OSが連携することで生まれる強みと、連携がうまくいかない時に起こりがちな葛藤について、普遍的な観点から解説してください。"
  }

### 2. "overview" (総合所見)
分析結果全体を統合し、ユーザーの「現在地」を物語的に表現してください。そして、このOS構造を活かすことで、どのような素晴らしい未来の可能性があるのか、希望に満ちた展望を提示してください。

### 3. "action" (Next Action)
ユーザーが明日から実践できる、非常に具体的で小さな行動を2〜3個提案してください。各アクションが、どのOSのどの八卦エネルギー（例: 離為火が持つ「火」のエネルギー）を活性化させるためのものかを、【OS名(卦名)の「八卦」エネルギーを活性化】という形式で明確に記述してください。

### 4. "next_steps" (さらなる探求へ)
今回の分析結果を手に、「未来分岐シミュレーター」を使うと、どのような気づきが得られるかを具体的に示唆してください。${
    hasContext
      ? `「あなたのエンジンOSである【${os1.name_jp}】を携えて、もし現在の課題『${userContext.issue}』に対して『進』のアクションを取ると、どのような未来が展開されるか見てみましょう」`
      : `「あなたのエンジンOS【${os1.name_jp}】の力を、もし『進』のアクションで使い続けると、3ステップ先でどのような状況に至るか見てみましょう」`
  }といった形で、次のツール利用へと自然に誘導してください。
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

function assembleFullReportHtml(analysisResult, userContext, aiSectionsObject) {
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
  const getBorderColor = (hexagram) =>
    trigram_colors[hexagram.upper_trigram_id] || "#6b7280";

  const hasContext =
    userContext.issue &&
    userContext.issue.trim() &&
    userContext.issue !== "特になし";
  let contextHtml;
  if (hasContext) {
    const contextParts = [];
    if (userContext.age) contextParts.push(userContext.age);
    if (userContext.occupation) contextParts.push(userContext.occupation);
    if (userContext.role) contextParts.push(`${userContext.role}という役割`);
    const contextSummary =
      contextParts.length > 0 ? contextParts.join("、") + "で、" : "";
    contextHtml = `<p class="text-sm">${contextSummary}「${userContext.issue}」という課題意識をお持ちなのですね。承知いたしました。その状況と、あなたが持つ素晴らしいOSの可能性を掛け合わせ、物語の次章へと進むための羅針盤をここに提示します。</p>`;
  } else {
    contextHtml = `<p class="text-sm">今回は、特定の状況設定なしでの分析となりますね。承知いたしました。あなたの純粋なOS構造が持つ、普遍的なポテンシャルと可能性の物語を、これから読み解いていきましょう。</p>`;
  }

  const header = `<h3 class="text-2xl font-bold text-indigo-300 mb-8 text-center" style="font-family: 'Shippori Mincho', serif;">あなたの物語を読み解く<br>HaQei 統合分析レポート</h3>`;
  const contextSection = `<div class="report-block"><h4>0. はじめに - あなたの現在地</h4>${contextHtml}</div>`;

  const os_manual = HAQEI_DATA.os_manual || {};
  const bibleData = HAQEI_DATA.bible || {};
  const tai_sho_den = bibleData.tai_sho_den || {};
  const zatsu_ka_den = bibleData.zatsu_ka_den || {};

  // ★★★ ここで変数名のタイプミスを修正 ★★★
  const createOsItem = (os, type, color) => {
    const manual = os_manual[os.hexagram_id] || {};
    const taishoText = tai_sho_den[os.hexagram_id] || ""; // 変数名を'taishoText'に統一
    const zatsuData = zatsu_ka_den[os.hexagram_id];
    const zatsu_pair_name =
      zatsuData && HAQEI_DATA.hexagrams_master
        ? HAQEI_DATA.hexagrams_master.find(
            (h) => h.hexagram_id === zatsuData.pair_id
          )?.name_jp || ""
        : "";

    let extended_info = `<div class="mt-3 pt-3 border-t border-gray-700/50 text-xs space-y-2">`;
    if (taishoText) {
      // 正しい変数名でチェック
      extended_info += `<p><strong>自然からの教え（大象伝）:</strong> ${taishoText.replace(
        /\n/g,
        " "
      )}</p>`;
    }
    if (zatsuData && zatsu_pair_name) {
      extended_info += `<p><strong>本質の対比（雑卦伝）:</strong> このOSは<strong>「${
        zatsuData.contrast_theme.split("と")[0]
      }」</strong>を象徴し、対となる<strong>${zatsu_pair_name}</strong>の「${
        zatsuData.contrast_theme.split("と")[1]
      }」と対比することで、その本質がより明確になります。</p>`;
    }
    extended_info += `</div>`;

    return `<li class="p-4 bg-gray-900/50 rounded-lg border-l-4" style="border-color: ${color};">
                <strong>【${type}：${os.name_jp}】</strong><br>
                <span class="text-sm">${manual.summary || os.description}</span>
                ${taishoText || zatsuData ? extended_info : ""}
              </li>`;
  };

  const trinityText = `<div class="report-block"><h4>1. あなたのOSアーキテクチャ - 三位一体モデルの構造</h4><p class="text-sm">あなたのOS構造は、以下の3つのOSが連携して機能しています。それぞれの役割と、その根底にある思想を理解することが、自己を乗りこなす第一歩です。</p>
    <ul class="text-sm list-none space-y-3 mt-4">
      ${createOsItem(os1, "エンジンOS", getBorderColor(os1))}
      ${createOsItem(os2, "インターフェースOS", getBorderColor(os2))}
      ${createOsItem(os3, "セーフモードOS", getBorderColor(os3))}
    </ul>
  </div>`;

  const aiSection1 = `<div class="report-block"><h4>2. OSの力学 - ポテンシャルを最大化する鍵</h4>${
    aiSectionsObject.dynamics || ""
  }</div>`;
  const aiSection2 = `<div class="report-block"><h4>3. 総合所見 - あなたの物語の現在地と未来への羅針盤</h4>${
    aiSectionsObject.overview || ""
  }</div>`;
  const aiSection3 = `<div class="report-block"><h4>4. Next Action - 次の具体的な一歩</h4>${
    aiSectionsObject.action || ""
  }</div>`;
  const aiSection4 = `<div class="report-block"><h4>5. さらなる探求へ - 未来分岐シミュレーターの活用</h4>${
    aiSectionsObject.next_steps || ""
  }</div>`;

  return (
    header +
    contextSection +
    trinityText +
    aiSection1 +
    aiSection2 +
    aiSection3 +
    aiSection4
  );
}
