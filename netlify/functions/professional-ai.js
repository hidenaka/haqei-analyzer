// ファイルパス: /netlify/functions/professional-ai.js (v3.7 色とSVGグラフ実装版)
const { HAQEI_DATA } = require("../../assets/haqei_main_database.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function generateReportImprovements(userProfile, db) {
  // ... この関数の内容は変更ありません ...
  const getHexagramById = (id) =>
    db.hexagrams_master.find((h) => h.hexagram_id === id);
  const getTrigramById = (id) =>
    db.trigrams_master.find((t) => t.trigram_id === id);

  const getEnhancedInfoForOS = (osId) => {
    const osData = getHexagramById(osId);
    if (!osData) return { name: "不明", reading: "", catchphrase: "" };
    return {
      name: osData.name_jp,
      reading: osData.reading,
      catchphrase: osData.catchphrase || "キャッチコピー未設定",
    };
  };

  const enhancedOsInfo = {
    engine: getEnhancedInfoForOS(userProfile.engineOsId),
    interface: getEnhancedInfoForOS(userProfile.interfaceOsId),
    safe_mode: getEnhancedInfoForOS(userProfile.safeModeOsId),
  };

  const mbtiData = db.mbti_map.find((m) => m.mbti_type === userProfile.mbti);
  let logicExplanation = "";
  if (mbtiData) {
    const topTrigramScore = [...mbtiData.scores].sort(
      (a, b) => b.score - a.score
    )[0];
    const topTrigram = getTrigramById(topTrigramScore.trigram_id);
    const mbtiNickname =
      db.mbti_nicknames.find((n) => n.type === userProfile.mbti)?.nickname ||
      userProfile.mbti;

    logicExplanation = `<p class="text-sm">あなたのMBTIタイプ「<strong>${userProfile.mbti}（${mbtiNickname}）</strong>」が持つ特性は、特に<strong>【${topTrigram.name_en}】</strong>のエネルギーと強く共鳴しています。この「${topTrigram.strength_description}」という性質が、あなたの中心的な力であるエンジンOS<strong>【${enhancedOsInfo.engine.name}】</strong>の「${enhancedOsInfo.engine.catchphrase}」という資質の大きな根拠の一つとなっています。</p>`;
  }

  const getOsNode = (osId, type) => {
    const hex = getHexagramById(osId);
    if (!hex) return null;
    const upperEl = getTrigramById(hex.upper_trigram_id)?.element;
    const lowerEl = getTrigramById(hex.lower_trigram_id)?.element;
    return {
      id: osId,
      name: hex.name_jp,
      type: type,
      elements: [upperEl, lowerEl].filter(
        (e, i, self) => e && self.indexOf(e) === i
      ),
    };
  };

  const nodes = [
    getOsNode(userProfile.engineOsId, "エンジン"),
    getOsNode(userProfile.interfaceOsId, "インターフェース"),
    getOsNode(userProfile.safeModeOsId, "セーフモード"),
  ].filter(Boolean);

  const infographicData = { nodes, links: [] };

  return {
    enhancedOsInfo,
    logicExplanation,
    infographicData,
  };
}

exports.handler = async (event) => {
  // ... この関数の内容は変更ありません ...
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

async function generateProfessionalReportSections(
  analysisResult,
  userContext,
  userProfile
) {
  // ... この関数の内容は変更ありません ...
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

function assembleFullReportHtml(
  analysisResult,
  userContext,
  userProfile,
  aiSectionsObject
) {
  const improvedReport = generateReportImprovements(
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

  // ★ 八卦の色定義
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

  const hasContext =
    userContext.issue &&
    userContext.issue.trim() &&
    userContext.issue !== "特になし";
  let contextHtml = hasContext
    ? `<p class="text-sm">年代(${userContext.age || "未設定"}), 職業(${
        userContext.occupation || "未設定"
      }), 役割(${userContext.role || "未設定"})で、「${
        userContext.issue
      }」という課題意識をお持ちなのですね。承知いたしました。</p>`
    : `<p class="text-sm">今回は、特定の状況設定なしでの分析となりますね。承知いたしました。</p>`;

  const header = `<h3 class="text-2xl font-bold text-indigo-300 mb-8 text-center" style="font-family: 'Shippori Mincho', serif;">あなたの物語を読み解く<br>HaQei 統合分析レポート</h3>`;
  const contextSection = `<div class="report-block"><h4>0. はじめに - あなたの現在地</h4>${contextHtml}</div>`;

  const createOsItem = (os, type, enhancedInfo) => {
    const color = getOsColor(os);
    const bibleData = HAQEI_DATA.bible || {};
    const taishoText = bibleData.tai_sho_den?.[os.hexagram_id] || "";

    // ★ OS名のテキストに色を適用
    return `<li class="p-4 bg-gray-900/50 rounded-lg border-l-4" style="border-color: ${color};">
              <strong style="color: ${color};">【${type}：<ruby>${
      enhancedInfo.name
    }<rt>${enhancedInfo.reading}</rt></ruby>】</strong><br>
              <span class="font-bold">${enhancedInfo.catchphrase}</span>
              <div class="mt-3 pt-3 border-t border-gray-700/50 text-xs space-y-2">
                <p><strong>自然からの教え:</strong> ${taishoText.replace(
                  /\n/g,
                  " "
                )}</p>
              </div>
            </li>`;
  };

  const trinityText = `<div class="report-block"><h4>1. あなたのOSアーキテクチャ</h4><p class="text-sm">あなたのOS構造は、以下の3つのOSが連携して機能します。</p>
    <ul class="text-sm list-none space-y-3 mt-4">
      ${createOsItem(os1, "エンジンOS", improvedReport.enhancedOsInfo.engine)}
      ${createOsItem(
        os2,
        "インターフェースOS",
        improvedReport.enhancedOsInfo.interface
      )}
      ${createOsItem(
        os3,
        "セーフモードOS",
        improvedReport.enhancedOsInfo.safe_mode
      )}
    </ul>
  </div>`;

  const logicSection = `<div class="report-block"><h4>分析ロジックの根拠</h4>${improvedReport.logicExplanation}</div>`;

  // ★ SVGインフォグラフィック生成
  const createInfographicSvg = (nodes) => {
    const positions = [
      { cx: 150, cy: 60 },
      { cx: 75, cy: 180 },
      { cx: 225, cy: 180 },
    ];
    const gearIcon = `<path d="M16.9,9.4l-2.4-0.4c-0.3-1-0.7-1.9-1.2-2.7l1.4-2c-0.6-0.8-1.3-1.5-2.1-2.1l-2,1.4C9.8,3.2,8.9,2.8,8,2.5L7.6,0.1H5.4L5.1,2.5C4.1,2.8,3.2,3.2,2.5,3.7l-2-1.4c-0.8,0.6-1.5,1.3-2.1,2.1l1.4,2c-0.5,0.8-0.9,1.7-1.2,2.7L-1.9,9.4v2.3l2.4,0.4c0.3,1,0.7,1.9,1.2,2.7l-1.4,2c0.6,0.8,1.3,1.5,2.1,2.1l2-1.4c0.8,0.5,1.7,0.9,2.7,1.2l0.4,2.4h2.3l0.4-2.4c1-0.3,1.9-0.7,2.7-1.2l2,1.4c0.8-0.6,1.5-1.3,2.1-2.1l-1.4-2c0.5-0.8,0.9-1.7,1.2-2.7l2.4-0.4V9.4z M6.5,14.4c-1.9,0-3.4-1.5-3.4-3.4s1.5-3.4,3.4-3.4s3.4,1.5,3.4,3.4S8.4,14.4,6.5,14.4z" />`;

    let svgContent = `<svg viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">`;
    // Lines connecting gears
    svgContent += `<line x1="150" y1="60" x2="75" y2="180" stroke="#4b5563" stroke-width="1.5" stroke-dasharray="4"/>`;
    svgContent += `<line x1="75" y1="180" x2="225" y2="180" stroke="#4b5563" stroke-width="1.5" stroke-dasharray="4"/>`;
    svgContent += `<line x1="225" y1="180" x2="150" y2="60" stroke="#4b5563" stroke-width="1.5" stroke-dasharray="4"/>`;

    nodes.forEach((node, i) => {
      const pos = positions[i];
      const color = getOsColor(
        analysisResult.hexagram_candidates.find(
          (c) => c.hexagram_id === node.id
        )
      );
      svgContent += `<g transform="translate(${pos.cx}, ${pos.cy})">
              <g transform="scale(3)">${gearIcon}</g>
              <circle r="38" fill="#111827" opacity="0.8"/>
              <text y="-8" text-anchor="middle" fill="${color}" font-size="14" font-weight="bold">${node.type}</text>
              <text y="12" text-anchor="middle" fill="#d1d5db" font-size="16" font-weight="bold">${node.name}</text>
          </g>`;
    });
    svgContent += `</svg>`;
    return svgContent;
  };

  const infographicSection = `<div class="report-block">
    <h4>OSアーキテクチャ図</h4>
    <p class="text-sm mb-4">あなたの3つのOSの関係性を可視化したものです。</p>
    <div class="bg-gray-900/50 p-4 rounded-lg">
        ${createInfographicSvg(improvedReport.infographicData.nodes)}
    </div>
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
    logicSection +
    infographicSection +
    aiSection1 +
    aiSection2 +
    aiSection3 +
    aiSection4
  );
}
