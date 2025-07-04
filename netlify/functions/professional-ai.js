// ファイルパス: /netlify/functions/professional-ai.js

// Netlifyのサーバー上で動作する、AIとの通信を中継する関数

// あとで実際のAI APIを叩く際に必要となるライブラリ
// const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // professional_report.htmlから送られてきたデータを解析
  const requestData = JSON.parse(event.body);
  const { analysis, userContext } = requestData;

  // ★★★ 将来、ここにAIへのリクエスト処理を書きます ★★★
  // process.env.GEMINI_API_KEY のように、Netlifyの環境変数から安全にキーを読み込む
  // const apiKey = process.env.GEMINI_API_KEY;

  // 今は、前回作成した「擬似AI」ロジックを、ここで実行する形にします
  const generatedText = generateProfessionalReportText(analysis, userContext);

  // フロントエンドに、成功したことと、生成したテキストを返す
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      success: true,
      report: generatedText,
    }),
  };
};

// レポートテキストを生成する関数（前回 professional_report.html に実装したものと同じ）
function generateProfessionalReportText(analysisResult, userContext) {
  const os1 = analysisResult.hexagram_candidates[0];
  const os2 = analysisResult.hexagram_candidates[1];
  const os3 = analysisResult.hexagram_candidates[2];
  const trigram_profile = analysisResult.trigram_profile;

  const contextText =
    userContext.age ||
    userContext.occupation ||
    userContext.role ||
    userContext.issue
      ? `<h4>1. ご入力いただいた状況の確認</h4><p class="text-sm">「${
          userContext.age || ""
        } ${userContext.occupation || ""} ${userContext.role || ""}」で、「${
          userContext.issue || "特になし"
        }」という課題意識をお持ちなのですね。承知いたしました。その状況を踏まえ、あなたのOSを読み解いていきましょう。</p>`
      : '<p class="text-sm text-gray-500 italic">（ユーザーの追加情報が入力されなかったため、OSの基本構造のみを解説します）</p>';

  const profileText = `<h4>2. エネルギープロファイルから見るあなたの「基本性質」</h4><p class="text-sm">あなたのエネルギープロファイルから、あなたの根源的な性質が見えてきます。特に、上位のエネルギーはあなたの強みを、下位のエネルギーは意識しないと使いにくい側面を示唆しています。</p>`;

  const trinityText = `<h4>3. 「三位一体OSモデル」の構造的解説</h4><p class="text-sm">あなたのOS構造は、<strong>【エンジンOS：${os1.name_jp}】</strong>が放つエネルギーを、<strong>【インターフェースOS：${os2.name_jp}】</strong>というフィルターを通して社会に表現します。そして、ストレス下では<strong>【セーフモードOS：${os3.name_jp}】</strong>に立ち返る、という動的な構造を持っています。</p>`;

  const getDynamicAdvice = () => {
    if (
      userContext.issue.includes("人間関係") ||
      userContext.issue.includes("部下") ||
      userContext.issue.includes("育成")
    ) {
      return `「${userContext.issue}」という課題についてですね。あなたのOS構造を見ると、解決の鍵は<strong>インターフェースOS『${os2.name_jp}』</strong>の使い方にありそうです。あなたのエンジン『${os1.name_jp}』は非常に強力ですが、そのエネルギーを直接相手にぶつけるのではなく、インターフェースOSの持つ性質を意識的に使ってみてください。`;
    } else if (
      context.issue.includes("キャリア") ||
      context.issue.includes("未来") ||
      context.issue.includes("転職")
    ) {
      return `「${context.issue}」という、ご自身のキャリアに関するお悩みですね。このような時は、あなたの<strong>セーフモードOS『${os3.name_jp}』</strong>が顔を出しやすいかもしれません。行き詰まりを感じると、つい特定の思考パターンに陥りがちです。これを自覚した上で、あなたの**エンジンOS『${os1.name_jp}』**の根源的な欲求を、キャリアにおいてどう実現できるか？という視点で未来を考えてみてください。`;
    }
    return `あなたの人生をより良くドライブさせるには、エンジンである「${os1.name_jp}」の欲求を、インターフェースである「${os2.name_jp}」の性質を使って、いかに社会に表現していくかがテーマとなります。`;
  };

  const adviceText = `<h4>4. 総合所見とあなたへの戦略的アドバイス</h4><p class="text-sm">${getDynamicAdvice()}</p>`;
  const actionPlanText = `<h4>5. 次の具体的な一歩</h4><ul class="text-sm list-disc pl-5"><li>まず、あなたのインターフェースOSである「${os2.name_jp}」の取扱説明書を読み返し、そこに書かれている「最適化クエスト」を一つ、今週中に実行してみてください。</li><li>あなたのエンジンOS「${os1.name_jp}」が最も喜ぶことは何でしょうか？それを知るために、5分だけ時間をとって「自分が本当に望む状態」を紙に書き出してみましょう。</li></ul>`;

  return `
        <h3 class="text-2xl font-bold text-amber-300 mb-6 text-center" style="font-family: 'Shippori Mincho', serif;">HaQeiプロフェッショナル<br>総合解説レポート</h3>
        <div class="report-block">${contextText}</div>
        <div class="report-block">${profileText}</div>
        <div class="report-block">${trinityText}</div>
        <div class="report-block">${adviceText}</div>
        <div class="report-block">${actionPlanText}</div>
    `;
}
