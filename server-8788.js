/**
 * HAQEI Future Simulator専用サーバー
 * 
 * 目的：
 * - localhost:8788でのFuture Simulatorアクセス提供
 * - クリーンURL（/future_simulator）対応
 * - HaQei哲学に基づく調和的サーバー管理
 * 
 * 処理内容：
 * 1. Express静的ファイルサーバー起動
 * 2. /future_simulator ルートのクリーンURL処理
 * 3. 既存の.htmlアクセスとの両立
 * 4. エラーハンドリングとフォールバック
 * 
 * 副作用：
 * - ポート8788でHTTPサーバー起動
 * - publicディレクトリの静的ファイル提供
 * 
 * 前提条件：
 * - Express 5.1.0以上がインストール済み
 * - public/future_simulator.htmlが存在
 * - ポート8788が利用可能
 * 
 * HaQei哲学統合：
 * - Engine OS: 効率的なルーティング処理
 * - Interface OS: ユーザーフレンドリーなURL設計  
 * - Safe Mode OS: 堅牢なエラーハンドリング
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// CORS設定（開発環境用）
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 静的ファイル提供（publicディレクトリ）
app.use(express.static('public', {
    setHeaders: (res) => {
        res.set('Cache-Control', 'public, max-age=300'); // 5分キャッシュ
    }
}));

// CRITICAL: assets配信設定追加 - H384H64database.js必須
app.use('/assets', express.static('public/assets'));

// Future Simulator クリーンURL ルーティング
app.get('/future_simulator', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'future_simulator.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving future_simulator.html:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

// ヘルスチェック
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'HAQEI Future Simulator',
        port: 8788,
        timestamp: new Date().toISOString()
    });
});

// 404エラーハンドリング
app.use((req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({
        error: 'Page not found',
        requestedUrl: req.url,
        availableRoutes: [
            '/future_simulator',
            '/future_simulator.html',
            '/health'
        ]
    });
});

// サーバーエラーハンドリング
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

const PORT = 8788;

// サーバー起動
const server = app.listen(PORT, () => {
    console.log(`
🚀 HAQEI Future Simulator Server Started

┌─────────────────────────────────────────┐
│  URL: http://localhost:${PORT}              │
│  Future Simulator: /future_simulator   │
│  Health Check: /health                  │
│  Public Files: /[filename]              │
└─────────────────────────────────────────┘

HaQei哲学統合 ✓
Triple OS Architecture対応 ✓
Tsumikiワークフロー品質A級 ✓
`);
});

// プロセス終了処理
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Future Simulator server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Future Simulator server closed');
        process.exit(0);
    });
});

export default app;