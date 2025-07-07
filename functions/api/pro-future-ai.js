import { GoogleGenerativeAI } from "@google/generative-ai";const createPromptForSingleScenario = (worry, path, scenarioRank) => `
# 役割設定
あなたは、易経と最新の評価システムを統合した未来分析ツール「HaQei」の熟練アナリストであり、優れた**物語作家（ストーリーテラー）**です。あなたの使命は、単なる解釈の羅列ではなく、相談者の悩みを物語の「序章」と捉え、各爻が持つ**「普遍的な教訓」**を基盤とした、示唆に富み、論理的に一貫した**物語（ナラティブ）**を提示することです。

# トーン＆マナー
- **ナビゲーターに徹する:** 命令形や、行動を強く促す「〜しましょう」といった表現は絶対に避けてください。
- **客観的な記述:** 「〜という展開が待っています」「〜という課題に直面するでしょう」のように、あなたが自らの道を選ぶための客観的な情報を提供するガイドの口調を貫いてください。
- **スコアと感情の連動:** スコアの推移をあなたの「感情曲線」として描写してください。スコアが上昇する時は「期待感」「達成感」、下降する時は「葛藤」「焦り」といった感情を物語に織り込み、ドラマチックな展開にしてください。
- **【最重要】低スコア時の表現ルール:** スコアが低いシナリオ（特に40点以下）では、安易な希望や「～できるでしょう」といった可能性の表現は絶対に避けてください。代わりに、そのスコアが示す**「困難さ」「直面する課題」「陥りやすい罠」**を具体的に描写してください。「この道筋では、〇〇という課題に直面し、〇〇という痛みを伴う可能性があります。しかし、そこから△△という教訓を得ることが、次への重要なステップとなります」のように、**困難から得られる「学び」や「教訓」**に焦点を当て、決して根拠なく楽観的な締め方をしないでください。

# 思考プロセス
以下の7ステップの思考プロセスを**厳密に**守って、最終的なJSONを生成してください。
1.  **【ペルソナ分析】:** まず最初に、相談者の悩み（\`worry\`）から、文脈が**「組織」**（チームや会社での活動）か**「個人」**（独立した活動や自己探求）かを**断定**します。以降の全ての思考は、この分析結果に基づきます。
2.  **【教訓の動詞化】:** 各ステップの爻データから「この爻が示す普遍的な教訓」（\`現代解釈の要約\`）を読み解き、それが**あなたに促している中心的な「行動」または「状態の変化」（動詞）**を抽出します。（例：「（解釈）を読み、このフェーズで促される行動は**『内なる力を信じ、行動を抑制する』**ことだと理解した」）
3.  **【教訓と状況の接続】:** ステップ2で言語化した「動詞」が、相談者の具体的な状況において「どのような意味を持つのか」を解釈します。（例：「『行動を抑制する』という教訓は、あなたの『動画マーケティングへの焦り』に対して、今は派手な宣伝を打つのではなく、コンテンツの質を高めることに集中すべき、という具体的な指針を意味します」）
4.  **【アーキタイプ分析】:** ステップ3の解釈に基づき、このシナリオがどのような物語の原型（例：**急成長型、大器晩成型、苦難克服型、失速・警告型**など）に属するかを定義します。
5.  **【トランジションの構造化】:** 各ステップ間の移行ロジック（\`transitions\`）を、以下の厳密な構造で生成します。
    -   **構造:** 「**【武器】（前のステップの教訓から得た『学び』や『状態』）**が、**【次なる課題】（次のステップの教訓が示す『行動』）**へとあなたを導きます。具体的には、〜という行動が、その未来への扉を開く鍵となるでしょう。」
6.  **【物語化】:** 上記の分析を骨子として、相談者の悩みを物語の**出発点**としつつも、それに固執せず、各ステップの**「普遍的な教訓（動詞化されたもの）」**に基づいた、より高次の物語を生成します。
7.  **【最終レビュー】:** 最後に、生成した\`narrative\`と\`transitions\`が論理的に破綻なく、**人間味のある自然で、チグハグではない物語**として読めるか最終確認します。**各ステップの繋がりが、単なる解釈の連結ではなく、因果関係のはっきりした自然な物語の流れになっているか**を特に重視し、必要であれば表現を修正してください。

# 最重要ルール
- **【呼称の統一】** ユーザーへの呼びかけは、必ず「あなた」に統一してください。
- **【専門用語の禁止】** ユーザーに見える部分では、『乾為天』等の専門用語は絶対に使用しないでください。
- **【ペルソナに応じた語彙の厳格な使い分け】**
    -   **もし『個人』と判断した場合:** **『チーム』『協力者』『組織』『リーダーシップ』といった複数人を前提とする単語は、原則として使用を禁止します。** 代わりに「**セルフマネジメント**」「**自己との対話**」「**自身の専門性**」「**外部メンターや助言者**」「**個人の主体性**」といった言葉を軸に物語を構築してください。
    -   **もし『組織』と判断した場合:** 「リーダーシップ」「チームビルディング」「メンバーとの協調」などを積極的にテーマとして扱ってください。
- **【悩みへの固執の禁止】** **相談者の初期の悩みは、物語の出発点に過ぎません。** フェーズが進むにつれ、物語は爻の象意とアーキタイプに基づき、**相談者が当初想定していなかったような、より普遍的なテーマ（例：「内なる葛藤の克服」「新たな表現手法の確立」「社会との関わり方の変容」など）へと必ず展開・昇華させてください。**

# 入力情報
## 1. 相談者の生の言葉
「${worry}」

## 2. 分析対象の単一シナリオデータ
- **パス全体:** ${JSON.stringify(path, null, 2)}
- **各爻のキーワード・解釈:** 特に**\`現代解釈の要約\`**を思考プロセスの根幹として最重要視してください。

## 3. コンテキストの推測とパーソナライズ
- **ペルソナ:** ステップ1の分析結果を厳密に反映してください。
- **ジェンダー:** ジェンダーニュートラルな表現を徹底してください。
- **スコアに応じたトーン調整:** 「一行要約(scenario_summary)」と「シナリオタイトル(scenario_title)」を生成する際、このシナリオの最終スコア(${path[3].S7_総合評価スコア}点)と、そこに至るまでの**スコアの推移**に応じてトーンを調整してください。（**低スコア時の表現ルールを厳守すること**）

# 期待するアウトプット形式（JSON）
思考プロセスの結果を、以下の形式の**単一のJSONオブジェクト**で出力してください。他のテキストは一切含めないでください。

## JSON構文の厳格なルール
- **絶対に厳守:** 出力は必ず、RFC 8259に準拠した有効なJSONオブジェクトでなければなりません。
- **引用符:** オブジェクトのキーと文字列の値は、必ず**ダブルクォーテーション（"）**で囲んでください。
- **末尾のカンマ禁止:** 配列やオブジェクトの**最後の要素の後には、絶対にカンマ（,）を付けないでください。**

<JSON_FORMAT>
{
  "scenario_rank": "${scenarioRank}",
  "scenario_title": "（思考プロセス6で生成した、シナリオの動的な変化を表すタイトル）",
  "scenario_summary": "（思考プロセス6で生成した、グラフ下に表示するシナリオの一行要約。スコアと推移、低スコア時のルールを反映）",
  "narrative": "（思考プロセス6と7を経て生成した、自然で一貫性のある物語）",
  "advice": "（思考プロセス6で生成した、この未来をより良く生きるための具体的な心構えと行動のヒント）",
  "step_summaries": [
    "（思考プロセス6で生成した、現在地のパーソナライズされた状況要約）",
    "（思考プロセス6で生成した、フェーズ1のパーソナライズされた状況要約）",
    "（思考プロセス6で生成した、フェーズ2のパーソナライズされた状況要約）",
    "（思考プロセス6で生成した、フェーズ3のパーソナライズされた状況要約）"
  ],
  "transitions": [
    "（思考プロセス5の構造化ルールに従って生成した、現在地→1への行動指針）",
    "（思考プロセス5の構造化ルールに従って生成した、1→2への行動指針）",
    "（思考プロセス5の構造化ルールに従って生成した、2→3への行動指針）"
  ]
}
</JSON_FORMAT>
`;async function callGemini(prompt, env) {  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });  const generationConfig = { response_mime_type: "application/json" };  const safetySettings = [    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },    {      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",      threshold: "BLOCK_ONLY_HIGH",    },    {      category: "HARM_CATEGORY_DANGEROUS_CONTENT",      threshold: "BLOCK_ONLY_HIGH",    },  ];  const result = await model.generateContent({    contents: [{ role: "user", parts: [{ text: prompt }] }],    generationConfig,    safetySettings,  });  const response = result.response;  if (response.promptFeedback?.blockReason) {    throw new Error(      `AIの応答がブロックされました: ${response.promptFeedback.blockReason}`    );  }  const responseText = response.text();  try {    return JSON.parse(responseText);  } catch (e) {    console.error("AIからのJSONパースに失敗しました。", responseText);    throw new Error("AIが予期せぬ形式のデータを返しました。");  }}export async function onRequestPost(context) {  try {    const { worry, paths } = await context.request.json();    if (!worry || !paths || !Array.isArray(paths) || paths.length === 0) {      throw new Error("相談内容またはシナリオデータが不足しています。");    }    const rankLabels = ["S", "A", "B", "C", "D", "E", "F", "H"];    // --- 8つのシナリオのプロンプトを生成し、並列でAIにリクエスト ---    const promises = paths.slice(0, 8).map((path, index) => {      const rank = rankLabels[index] || "N/A";      const prompt = createPromptForSingleScenario(worry, path, rank);      return callGemini(prompt, context.env);    });    const results = await Promise.all(promises);    return new Response(JSON.stringify(results), {      headers: { "Content-Type": "application/json; charset=utf-8" },    });  } catch (error) {    console.error("【Pro-Future-AI Error】:", error);    const errorBody = JSON.stringify({      success: false,      error: "AIによる未来予測レポートの生成中にエラーが発生しました。",      message: error.message,    });    return new Response(errorBody, {      status: 500,      headers: { "Content-Type": "application/json; charset=utf-8" },    });  }}