#!/usr/bin/env node

/**
 * Clean Start Server for HAQEI Analyzer
 * クリーンな環境でサーバーを起動
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 9000;
const ROOT_DIR = __dirname;

// MIMETypeマッピング
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'text/plain';
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - File Not Found</h1>');
      return;
    }

    const contentType = getContentType(filePath);
    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  let pathname = url.parse(req.url).pathname;
  
  // ルート要求の場合はos_analyzer.htmlを返す
  if (pathname === '/') {
    pathname = '/os_analyzer.html';
  }
  
  const filePath = path.join(ROOT_DIR, pathname);
  
  // セキュリティチェック（パストラバーサル防止）
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 - Forbidden</h1>');
    return;
  }
  
  // ファイル存在チェック
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // ファイルが存在しない場合、os_analyzer.htmlにフォールバック
      if (pathname !== '/os_analyzer.html') {
        serveFile(res, path.join(ROOT_DIR, 'os_analyzer.html'));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>');
      }
      return;
    }
    
    serveFile(res, filePath);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 HAQEI Analyzer Server running at http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${ROOT_DIR}`);
  console.log(`🌐 Access: http://localhost:${PORT}/os_analyzer.html`);
  console.log('✨ Clean environment - No cache, fresh start');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Server shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});