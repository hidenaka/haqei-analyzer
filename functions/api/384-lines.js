/**
 * 384爻データAPI
 * Cloudflare Workers Function for D1 Database access
 * Edge constraint compliant implementation
 */

export async function onRequest(context) {
    const { env, request } = context;
    const url = new URL(request.url);
    
    // CORSヘッダー設定
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };
    
    // OPTIONS リクエスト対応
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }
    
    // キャッシュチェック
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);
    const cachedResponse = await cache.match(cacheKey);
    
    if (cachedResponse) {
        console.log('📦 Cache hit for 384-lines data');
        return cachedResponse;
    }
    
    try {
        // クエリパラメータの解析
        const params = url.searchParams;
        const type = params.get('type') || 'all'; // all, koudo, hexagrams, yaoci
        const limit = parseInt(params.get('limit')) || 0; // 0 = no limit
        
        const responseData = {
            success: true,
            timestamp: new Date().toISOString(),
            data: {}
        };
        
        // データ取得（typeに応じて必要なもののみ）
        const performanceMetrics = {};
        let startTime, endTime;
        if (type === 'all' || type === 'koudo') {
            const koudoQuery = limit > 0 
                ? `SELECT * FROM koudo_shishin LIMIT ${limit}`
                : `SELECT * FROM koudo_shishin`;
            
            startTime = performance.now();
            const { results: koudo } = await env.DB.prepare(koudoQuery).all();
            endTime = performance.now();
            performanceMetrics.koudoQueryTime = (endTime - startTime).toFixed(2) + 'ms';
            responseData.data.lines = koudo;
            responseData.data.linesCount = koudo.length;
        }
        
        if (type === 'all' || type === 'hexagrams') {
            startTime = performance.now();
            const { results: hexagrams } = await env.DB.prepare(
                "SELECT * FROM hexagrams"
            ).all();
            endTime = performance.now();
            performanceMetrics.hexagramsQueryTime = (endTime - startTime).toFixed(2) + 'ms';
            responseData.data.hexagrams = hexagrams;
            responseData.data.hexagramsCount = hexagrams.length;
        }
        
        if (type === 'all' || type === 'yaoci') {
            const yaoQuery = limit > 0
                ? `SELECT * FROM yaoci_lines LIMIT ${limit}`
                : `SELECT * FROM yaoci_lines`;
            
            startTime = performance.now();
            const { results: yaoci } = await env.DB.prepare(yaoQuery).all();
            endTime = performance.now();
            performanceMetrics.yaociQueryTime = (endTime - startTime).toFixed(2) + 'ms';
            responseData.data.yaoci = yaoci;
            responseData.data.yaoCount = yaoci.length;
        }
        
        responseData.performanceMetrics = performanceMetrics;

        // レスポンス作成
        const response = new Response(
            JSON.stringify(responseData),
            {
                headers: {
                    ...corsHeaders,
                    'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 1時間キャッシュ
                    'Surrogate-Control': 'max-age=86400', // CDNで1日キャッシュ
                }
            }
        );
        
        // キャッシュ保存（非同期で実行）
        context.waitUntil(cache.put(cacheKey, response.clone()));
        
        console.log(`✅ 384-lines API response: ${JSON.stringify({
            type,
            linesCount: responseData.data.linesCount,
            hexagramsCount: responseData.data.hexagramsCount,
            yaoCount: responseData.data.yaoCount
        })}`);
        
        return response;
        
    } catch (error) {
        console.error('❌ 384-lines API error:', error);
        
        // エラーレスポンス
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message,
                errorType: error.constructor.name,
                timestamp: new Date().toISOString(),
                // フォールバック情報
                fallbackUrl: '/data/koudo_shishin.json'
            }),
            {
                status: 500,
                headers: corsHeaders
            }
        );
    }
}

/**
 * Configuration export for Cloudflare Pages
 */
export const config = {
    // Edge-specific configurations
    maxAge: 3600,
    edgeCache: true,
    bypassCache: false,
};