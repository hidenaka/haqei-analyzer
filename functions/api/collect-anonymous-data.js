// /functions/api/collect-anonymous-data.js

/**
 * 匿名化された統計データを受け取り、Cloudflare Analytics Engine に書き込む関数
 */
export async function onRequestPost(context) {
  try {
    // リクエストからJSONデータを取得
    const data = await context.request.json();

    // データがなければ何もしない
    if (!data) {
      return new Response(null, { status: 204 }); // No Content
    }

    // wrangler.tomlで 'ANALYTICS_ENGINE' という名前でバインドされたAnalytics Engineを取得
    // ※このバインディング設定が別途必要です
    const analyticsEngine = context.env.ANALYTICS_ENGINE;

    if (analyticsEngine) {
      // Analytics Engineに書き込むためのデータを準備
      // blobsには文字列データ、doublesには数値データを入れます
      analyticsEngine.writeDataPoint({
        blobs: [
          data.mbti || null,
          data.os_engine || null,
          data.os_interface || null,
          data.start_hexagram || null,
          data.selected_scenario_rank || null,
          data.selected_scenario_path || null,
          data.final_hexagram || null,
          context.request.headers.get("cf-ipcountry") || null, // 国コード
        ],
        doubles: [data.worry_word_count || 0],
      });
    }

    // 成功レスポンスを返す (202 Accepted)
    return new Response("Accepted", { status: 202 });
  } catch (error) {
    console.error("Anonymous data collection error:", error);
    // エラーが発生しても、クライアントには成功したかのように見せ、詳細なエラーは返さない
    return new Response("Error processing request", { status: 500 });
  }
}
