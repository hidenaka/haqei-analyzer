# Enhanced MIME Type Setup Guide

## 🎯 概要

HaQei Analyzerでの MIME タイプエラーを解決し、JavaScript ファイルが適切に配信されるようにするための包括的ガイドです。

## 🚨 問題の識別

### 典型的な症状
- Console に表示される「不正な MIME タイプ: text/html」エラー
- JavaScript ファイルが HTML として配信される
- スクリプトの実行が阻害される
- PathValidation で大量の警告

### 根本原因
1. **サーバー設定不備**: JavaScript ファイルのMIMEタイプが未設定
2. **file:// プロトコル使用**: 直接ファイルアクセス
3. **開発サーバーの設定ミス**: 不適切なMIMEタイプ配信

## 🔧 解決方法 (優先順位順)

### Method 1: Python HTTP Server (推奨)
```bash
# Python 3 の場合
python3 -m http.server 8000

# Python 2 の場合 (非推奨)
python -m SimpleHTTPServer 8000
```

**特徴:**
- ✅ 設定不要で即座に使用可能
- ✅ 正しい MIME タイプを自動設定
- ✅ CORS 問題を回避
- ✅ 開発環境に最適

**カスタム設定版:**
```python
#!/usr/bin/env python3
# server.py
import http.server
import mimetypes
import socketserver

# JavaScript ファイルの MIME タイプを明示的に設定
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('application/json', '.json')

PORT = 8000

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # CORS ヘッダーを追加 (必要に応じて)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"🚀 Server running at http://localhost:{PORT}")
        httpd.serve_forever()
```

### Method 2: Node.js/npm HTTP Server
```bash
# npx を使用 (Node.js 必須)
npx http-server -p 8000

# または npm インストール後
npm install -g http-server
http-server -p 8000
```

**設定オプション:**
```bash
# CORS 有効化とキャッシュ無効化
npx http-server -p 8000 --cors -c-1

# 特定ディレクトリを指定
npx http-server ./public -p 8000 --cors
```

### Method 3: Apache HTTP Server

#### .htaccess 方式 (推奨)
プロジェクトルートに `.htaccess` ファイルを作成:

```apache
# .htaccess
# JavaScript ファイルの MIME タイプ設定
AddType application/javascript .js
AddType application/json .json

# 追加設定 (オプション)
<IfModule mod_deflate.c>
    # JavaScript ファイルの圧縮
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# キャッシュ設定 (開発時は無効化推奨)
<IfModule mod_expires.c>
    ExpiresActive Off
</IfModule>

# 開発時のキャッシュ無効化
<IfModule mod_headers.c>
    <FilesMatch "\.(js|css|json)$">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Pragma "no-cache"
        Header set Expires 0
    </FilesMatch>
</IfModule>
```

#### httpd.conf 方式
Apache のメイン設定ファイル `/etc/apache2/httpd.conf` を編集:

```apache
# MIME タイプ設定
LoadModule mime_module modules/mod_mime.so

<IfModule mod_mime.c>
    TypesConfig /etc/apache2/mime.types
    AddType application/javascript .js
    AddType application/json .json
</IfModule>
```

**設定確認方法:**
```bash
# Apache 設定テスト
sudo apache2ctl configtest

# Apache 再起動
sudo systemctl restart apache2

# MIME タイプ確認
curl -I http://localhost/js/script.js
```

### Method 4: Nginx

#### nginx.conf 設定
```nginx
server {
    listen 8000;
    server_name localhost;
    root /path/to/your/project;

    # JavaScript ファイルの MIME タイプ設定
    location ~* \.js$ {
        add_header Content-Type application/javascript;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        expires off;
    }

    # JSON ファイルの設定
    location ~* \.json$ {
        add_header Content-Type application/json;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        expires off;
    }

    # CORS 設定 (必要に応じて)
    location ~* \.(js|css|json)$ {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type";
    }
}
```

**設定適用:**
```bash
# Nginx 設定テスト
nginx -t

# Nginx 再読み込み
sudo systemctl reload nginx

# MIME タイプ確認
curl -I http://localhost:8000/js/script.js
```

### Method 5: Node.js Express.js

#### カスタム Express サーバー
```javascript
// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 8000;

// 静的ファイルの配信設定
app.use(express.static('public', {
  setHeaders: (res, filePath) => {
    // JavaScript ファイルのMIMEタイプ設定
    if (path.extname(filePath) === '.js') {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.extname(filePath) === '.json') {
      res.setHeader('Content-Type', 'application/json');
    }
    
    // 開発時のキャッシュ無効化
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// CORS 設定 (必要に応じて)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.listen(PORT, () => {
  console.log(`🚀 Express server running at http://localhost:${PORT}`);
});
```

**実行方法:**
```bash
npm init -y
npm install express
node server.js
```

## 🔍 診断と検証

### 1. 現在の MIME タイプ確認
```bash
# curl でヘッダー確認
curl -I http://localhost:8000/js/core/ScriptPathValidator.js

# 期待される出力:
# Content-Type: application/javascript
```

### 2. ブラウザ開発者ツールでの確認
1. F12 で開発者ツールを開く
2. Network タブを選択
3. ページをリロード
4. JavaScript ファイルをクリック
5. Response Headers の Content-Type を確認

### 3. 自動診断スクリプト
```javascript
// ブラウザコンソールで実行
async function diagnoseMimeTypes() {
  const testFiles = [
    'js/core/ScriptPathValidator.js',
    'js/core/DataManager.js',
    'js/components/WelcomeScreen.js'
  ];

  console.group('🔍 MIME Type Diagnosis');
  
  for (const file of testFiles) {
    try {
      const response = await fetch(file, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      const isCorrect = contentType && contentType.includes('javascript');
      
      console.log(`${isCorrect ? '✅' : '❌'} ${file}: ${contentType || 'No Content-Type'}`);
    } catch (error) {
      console.log(`❌ ${file}: ${error.message}`);
    }
  }
  
  console.groupEnd();
}

diagnoseMimeTypes();
```

## 🚀 クイックスタート (3分で解決)

### 最も簡単な解決法
1. プロジェクトディレクトリで以下を実行:
```bash
python3 -m http.server 8000
```

2. ブラウザで `http://localhost:8000` にアクセス

3. 完了! MIMEタイプエラーが解消されます。

### Windows 用バッチファイル
```batch
@echo off
echo Starting HaQei Analyzer Development Server...
echo.
echo Server will start at http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
pause
```

### macOS/Linux 用シェルスクリプト
```bash
#!/bin/bash
# start-dev-server.sh

echo "🚀 Starting HaQei Analyzer Development Server..."
echo "Server will be available at: http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo ""

python3 -m http.server 8000
```

実行権限を付与:
```bash
chmod +x start-dev-server.sh
./start-dev-server.sh
```

## 🔧 高度な設定

### 1. カスタム MIME タイプマッピング

#### Python カスタムサーバー
```python
import http.server
import mimetypes
from urllib.parse import unquote

class EnhancedHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # カスタム MIME タイプを追加
        mimetypes.add_type('application/javascript', '.js')
        mimetypes.add_type('application/json', '.json')
        mimetypes.add_type('text/css', '.css')
        super().__init__(*args, **kwargs)
    
    def end_headers(self):
        # セキュリティヘッダー追加
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        
        # CORS ヘッダー
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        
        # キャッシュ制御 (開発時)
        path = unquote(self.path)
        if path.endswith(('.js', '.css', '.json')):
            self.send_header('Cache-Control', 'no-cache, must-revalidate')
            self.send_header('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT')
        
        super().end_headers()
    
    def log_message(self, format, *args):
        # カスタムログ出力
        print(f"🌐 [{self.address_string()}] {format % args}")
```

### 2. Docker を使用した環境構築
```dockerfile
# Dockerfile
FROM nginx:alpine

# カスタム nginx.conf をコピー
COPY nginx.conf /etc/nginx/conf.d/default.conf

# プロジェクトファイルをコピー
COPY . /usr/share/nginx/html/

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  haqei-analyzer:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - .:/usr/share/nginx/html
    environment:
      - NGINX_HOST=localhost
      - NGINX_PORT=8000
```

実行:
```bash
docker-compose up -d
```

### 3. 自動設定検証スクリプト
```javascript
// config-validator.js
class MimeTypeConfigValidator {
  constructor() {
    this.testFiles = [
      'js/core/ScriptPathValidator.js',
      'js/core/CompatibilityDataLoader.js',
      'js/components/WelcomeScreen.js'
    ];
  }

  async validateConfiguration() {
    console.group('🔧 MIME Type Configuration Validation');
    
    const results = {
      passed: 0,
      failed: 0,
      details: []
    };

    for (const file of this.testFiles) {
      try {
        const response = await fetch(file, { method: 'HEAD' });
        const contentType = response.headers.get('content-type');
        const isValid = this.validateJavaScriptMimeType(contentType);
        
        const result = {
          file,
          contentType: contentType || 'Not set',
          isValid,
          status: response.status
        };
        
        results.details.push(result);
        
        if (isValid) {
          results.passed++;
          console.log(`✅ ${file}: ${contentType}`);
        } else {
          results.failed++;
          console.error(`❌ ${file}: ${contentType || 'No Content-Type'}`);
        }
        
      } catch (error) {
        results.failed++;
        console.error(`❌ ${file}: ${error.message}`);
        results.details.push({
          file,
          error: error.message,
          isValid: false
        });
      }
    }

    console.log(`\n📊 Results: ${results.passed} passed, ${results.failed} failed`);
    
    if (results.failed > 0) {
      console.group('💡 Recommendations');
      this.generateRecommendations();
      console.groupEnd();
    }
    
    console.groupEnd();
    return results;
  }

  validateJavaScriptMimeType(contentType) {
    if (!contentType) return false;
    
    const validTypes = [
      'application/javascript',
      'text/javascript',
      'application/x-javascript'
    ];
    
    return validTypes.some(type => contentType.includes(type));
  }

  generateRecommendations() {
    console.log('1. 🐍 Use Python HTTP server: python3 -m http.server 8000');
    console.log('2. 📦 Use npx http-server: npx http-server -p 8000');
    console.log('3. ⚙️ Configure your web server MIME types');
    console.log('4. 📁 Check file paths and server configuration');
  }
}

// 自動実行
window.addEventListener('load', async () => {
  const validator = new MimeTypeConfigValidator();
  await validator.validateConfiguration();
});
```

## 🐛 トラブルシューティング

### よくある問題と解決法

#### 1. "file:// URLs are not supported"
**症状**: file:// プロトコルでアクセスしている
**解決法**: HTTPサーバーを使用する

#### 2. "CORS policy blocks the request"
**症状**: クロスオリジンエラー
**解決法**: 同一オリジンで配信、またはCORS設定

#### 3. "Permission denied on port 8000"
**症状**: ポートが使用中
**解決法**: 
```bash
# 別のポートを使用
python3 -m http.server 8001

# または使用中のプロセスを確認
lsof -i :8000
```

#### 4. "Module not found" エラー
**症状**: ES6 import が動作しない
**解決法**: type="module" を確認、またはグローバル変数方式を使用

#### 5. キャッシュ問題
**症状**: 変更が反映されない
**解決法**:
```bash
# キャッシュバスティング
curl -I "http://localhost:8000/js/script.js?v=$(date +%s)"
```

### デバッグコマンド集
```bash
# 1. ポート使用状況確認
netstat -tulpn | grep :8000

# 2. HTTP ヘッダー詳細確認
curl -v http://localhost:8000/js/core/ScriptPathValidator.js

# 3. サーバーログ確認 (Python)
python3 -m http.server 8000 --bind 127.0.0.1

# 4. ネットワーク接続確認
telnet localhost 8000

# 5. DNS 解決確認
nslookup localhost
```

## 📋 チェックリスト

### 設定完了チェック
- [ ] HTTPサーバーが起動している
- [ ] JavaScript ファイルが `application/javascript` で配信されている
- [ ] Console にMIMEタイプエラーが出ていない
- [ ] スクリプトが正常に実行されている
- [ ] ブラウザ開発者ツールでContent-Typeが確認できる

### パフォーマンス最適化チェック
- [ ] 開発時はキャッシュが無効化されている
- [ ] 本番環境では適切なキャッシュ設定がされている
- [ ] 不要なCORSヘッダーが削除されている
- [ ] セキュリティヘッダーが適切に設定されている

## 🎯 まとめ

MIME タイプ問題の解決は、以下の優先順位で実施してください:

1. **即座の解決**: `python3 -m http.server 8000`
2. **開発環境整備**: 適切な開発サーバーの構築
3. **本番環境対応**: サーバー設定の最適化
4. **監視とメンテナンス**: 継続的な設定検証

この設定により、HaQei Analyzer の JavaScript ファイルが適切なMIMEタイプで配信され、エラーが解消されます。

---

**更新日**: 2025年1月  
**対象バージョン**: HaQei Analyzer v1.0.0