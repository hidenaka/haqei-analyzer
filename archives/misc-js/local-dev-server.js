/**
 * HAQEI Analyzer ローカル開発サーバー
 * 
 * 目的：
 * - ユーザーのローカル環境でHAQEIシステムの動作確認
 * - os_analyzer.html と results.html の遷移テスト
 * - 静的ファイル配信とルーティング
 * 
 * 入力：
 * - port: number - サーバーポート（デフォルト: 3000）
 * - publicDir: string - 静的ファイルディレクトリ（デフォルト: 'public'）
 * 
 * 処理内容：
 * 1. Express.jsサーバーの初期化
 * 2. 静的ファイル配信の設定
 * 3. HAQEIシステム用ルーティング設定
 * 4. CORSとセキュリティ設定
 * 5. エラーハンドリング
 * 
 * 出力：
 * - HTTP Server: localhost上でHAQEIシステムが動作
 * 
 * 副作用：
 * - 指定ポートでHTTPサーバーを起動
 * - コンソールにアクセスログとエラーログを出力
 * 
 * 前提条件：
 * - Node.jsがインストール済み
 * - publicディレクトリにHAQEIファイルが存在
 * 
 * エラー処理：
 * - ポート衝突時の代替ポート提案
 * - 404エラーの適切な処理
 * - CORS エラーの防止
 */

import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class LocalDevServer {
    constructor(options = {}) {
        this.port = options.port || 3000;
        this.publicDir = join(__dirname, options.publicDir || 'public');
        this.server = null;
        
        // MIMEタイプマッピング
        this.mimeTypes = {
            '.html': 'text/html; charset=utf-8',
            '.js': 'application/javascript; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.json': 'application/json; charset=utf-8',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.ttf': 'font/ttf',
            '.eot': 'application/vnd.ms-fontobject'
        };
    }

    /**
     * ファイルの存在確認とMIMEタイプ取得
     */
    async getFileInfo(filePath) {
        try {
            const stats = await stat(filePath);
            if (stats.isFile()) {
                const ext = extname(filePath).toLowerCase();
                const mimeType = this.mimeTypes[ext] || 'application/octet-stream';
                return { exists: true, mimeType, size: stats.size };
            }
            return { exists: false };
        } catch (error) {
            return { exists: false };
        }
    }

    /**
     * リクエストパスをファイルパスに解決
     */
    resolveFilePath(requestPath) {
        // ルートパスの処理
        if (requestPath === '/' || requestPath === '') {
            return join(this.publicDir, 'index.html');
        }
        
        // HAQEIシステム用の特別ルーティング
        if (requestPath === '/os_analyzer' || requestPath === '/os-analyzer') {
            return join(this.publicDir, 'os_analyzer.html');
        }
        
        if (requestPath === '/results') {
            return join(this.publicDir, 'results.html');
        }
        
        if (requestPath === '/future-simulator') {
            return join(this.publicDir, 'future_simulator.html');
        }
        
        // 通常のファイルパス解決
        const cleanPath = requestPath.split('?')[0]; // クエリパラメータを除去
        return join(this.publicDir, cleanPath);
    }

    /**
     * HTTPレスポンスヘッダーの設定
     */
    setResponseHeaders(response, mimeType) {
        // CORS設定
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        // キャッシュ設定
        if (mimeType.includes('html')) {
            response.setHeader('Cache-Control', 'no-cache, must-revalidate');
        } else {
            response.setHeader('Cache-Control', 'public, max-age=3600');
        }
        
        // セキュリティヘッダー
        response.setHeader('X-Content-Type-Options', 'nosniff');
        response.setHeader('X-Frame-Options', 'DENY');
        response.setHeader('X-XSS-Protection', '1; mode=block');
        
        // Content-Type設定
        response.setHeader('Content-Type', mimeType);
    }

    /**
     * 404エラーページの生成
     */
    generate404Page(requestPath) {
        return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - ページが見つかりません</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .error-container {
            text-align: center;
            padding: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(15px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        h1 { font-size: 4em; margin: 0 0 20px 0; }
        h2 { font-size: 1.5em; margin: 0 0 30px 0; opacity: 0.9; }
        .path { 
            background: rgba(255, 255, 255, 0.1); 
            padding: 10px 20px; 
            border-radius: 10px; 
            font-family: monospace; 
            margin: 20px 0;
        }
        .nav-links {
            margin-top: 30px;
        }
        .nav-links a {
            display: inline-block;
            margin: 10px;
            padding: 12px 24px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            transition: all 0.3s ease;
        }
        .nav-links a:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="error-container">
        <h1>404</h1>
        <h2>ページが見つかりません</h2>
        <div class="path">${requestPath}</div>
        <p>お探しのページは存在しないか、移動された可能性があります。</p>
        
        <div class="nav-links">
            <a href="/">🏠 ホーム</a>
            <a href="/os_analyzer">🧠 OS Analyzer</a>
            <a href="/results">📊 結果表示</a>
            <a href="/future-simulator">🔮 Future Simulator</a>
        </div>
    </div>
</body>
</html>`;
    }

    /**
     * リクエストハンドラー
     */
    async handleRequest(request, response) {
        const startTime = Date.now();
        const requestPath = new URL(request.url, `http://localhost:${this.port}`).pathname;
        
        // OPTIONS リクエストの処理（CORS プリフライト）
        if (request.method === 'OPTIONS') {
            this.setResponseHeaders(response, 'text/plain');
            response.writeHead(200);
            response.end();
            return;
        }
        
        console.log(`📡 ${request.method} ${requestPath}`);
        
        try {
            const filePath = this.resolveFilePath(requestPath);
            const fileInfo = await this.getFileInfo(filePath);
            
            if (fileInfo.exists) {
                // ファイルが存在する場合
                const content = await readFile(filePath);
                this.setResponseHeaders(response, fileInfo.mimeType);
                response.writeHead(200);
                response.end(content);
                
                const duration = Date.now() - startTime;
                console.log(`✅ ${requestPath} → ${filePath} (${fileInfo.size} bytes, ${duration}ms)`);
            } else {
                // ファイルが存在しない場合
                const errorPage = this.generate404Page(requestPath);
                this.setResponseHeaders(response, 'text/html; charset=utf-8');
                response.writeHead(404);
                response.end(errorPage);
                
                const duration = Date.now() - startTime;
                console.log(`❌ ${requestPath} → 404 Not Found (${duration}ms)`);
            }
        } catch (error) {
            // サーバーエラーの処理
            console.error(`💥 Server Error for ${requestPath}:`, error);
            
            response.writeHead(500, {
                'Content-Type': 'text/html; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            });
            
            response.end(`
                <h1>500 Internal Server Error</h1>
                <p>サーバーエラーが発生しました。</p>
                <pre>${error.message}</pre>
                <a href="/">ホームに戻る</a>
            `);
        }
    }

    /**
     * サーバー起動
     */
    async start() {
        return new Promise((resolve, reject) => {
            this.server = createServer((req, res) => this.handleRequest(req, res));
            
            this.server.on('error', (error) => {
                if (error.code === 'EADDRINUSE') {
                    console.error(`❌ ポート ${this.port} は既に使用されています`);
                    console.log(`💡 以下のコマンドで代替ポートを試してください:`);
                    console.log(`   node local-dev-server.js --port ${this.port + 1}`);
                    reject(error);
                } else {
                    console.error('❌ サーバーエラー:', error);
                    reject(error);
                }
            });
            
            this.server.listen(this.port, () => {
                console.log('\n🚀 HAQEI Analyzer ローカル開発サーバー起動完了!\n');
                console.log(`📍 URL: http://localhost:${this.port}`);
                console.log(`📁 Public Directory: ${this.publicDir}`);
                console.log('\n🔗 主要エンドポイント:');
                console.log(`   🏠 ホーム:           http://localhost:${this.port}/`);
                console.log(`   🧠 OS Analyzer:      http://localhost:${this.port}/os_analyzer`);
                console.log(`   📊 結果表示:         http://localhost:${this.port}/results`);
                console.log(`   🔮 Future Simulator: http://localhost:${this.port}/future-simulator`);
                console.log(`   🧪 統合テスト:       http://localhost:${this.port}/test-integration-complete.html`);
                console.log(`   ✅ QA検証結果:       http://localhost:${this.port}/qa-validation-complete.html`);
                console.log('\n⏹️  停止するには Ctrl+C を押してください\n');
                
                resolve();
            });
        });
    }

    /**
     * サーバー停止
     */
    stop() {
        if (this.server) {
            this.server.close(() => {
                console.log('🛑 サーバーを停止しました');
            });
        }
    }
}

// メイン実行部分
const main = async () => {
    const args = process.argv.slice(2);
    const portArg = args.find(arg => arg.startsWith('--port='));
    const port = portArg ? parseInt(portArg.split('=')[1]) : 3000;
    
    const server = new LocalDevServer({ port });
    
    // Ctrl+C でのグレースフル終了
    process.on('SIGINT', () => {
        console.log('\n🛑 サーバー停止処理を開始...');
        server.stop();
        process.exit(0);
    });
    
    try {
        await server.start();
    } catch (error) {
        console.error('❌ サーバー起動失敗:', error.message);
        process.exit(1);
    }
};

// スクリプトが直接実行された場合のみmainを実行
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export default LocalDevServer;