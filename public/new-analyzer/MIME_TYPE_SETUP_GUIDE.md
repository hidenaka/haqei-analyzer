# MIME タイプ設定ガイド - ローカル開発環境

## 概要

HaQei Analyzer のローカル開発環境で発生する MIME タイプエラーを解決するためのガイドです。

## 一般的な MIME タイプエラー

### 1. JavaScript ファイルの MIME タイプエラー

```
Refused to execute script from 'file.js' because its MIME type ('text/html') is not executable
```

### 2. Strict MIME Type Checking エラー

```
Failed to load module script: The server responded with a non-JavaScript MIME type
```

## 解決方法

### 方法 1: HTTP サーバーの使用（推奨）

#### Python を使用

```bash
# Python 3.x
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000
```

#### Node.js を使用

```bash
# http-server をインストール
npm install -g http-server

# サーバー起動
http-server -p 8000
```

#### PHP を使用

```bash
php -S localhost:8000
```

### 方法 2: Live Server 拡張機能（VS Code）

1. VS Code で Live Server 拡張機能をインストール
2. HTML ファイルを右クリック → "Open with Live Server"

### 方法 3: Apache/Nginx の設定

#### Apache (.htaccess)

```apache
AddType application/javascript .js
AddType application/json .json
AddType text/css .css
```

#### Nginx

```nginx
location ~* \.(js)$ {
    add_header Content-Type application/javascript;
}
location ~* \.(json)$ {
    add_header Content-Type application/json;
}
```

## ブラウザ別の対処法

### Chrome

- `--allow-file-access-from-files` フラグで起動
- セキュリティ上推奨されません

### Firefox

- `about:config` で `security.fileuri.strict_origin_policy` を false に設定
- セキュリティ上推奨されません

### Safari

- 開発メニューから「ローカルファイル制限を無効にする」
- セキュリティ上推奨されません

## 推奨開発環境

1. **HTTP サーバーの使用**: 最も安全で確実
2. **HTTPS の使用**: 本番環境に近い環境でのテスト
3. **CORS 設定**: 必要に応じて適切な CORS ヘッダーを設定

## トラブルシューティング

### 問題: スクリプトが読み込まれない

- ファイルパスを確認
- HTTP サーバーが起動しているか確認
- ブラウザの開発者ツールでネットワークタブを確認

### 問題: 404 エラー

- ファイルの存在を確認
- パスの大文字小文字を確認
- 相対パスと絶対パスの使い分けを確認

### 問題: CORS エラー

- 同一オリジンポリシーの確認
- 適切な CORS ヘッダーの設定
- プリフライトリクエストの対応

## 開発時のベストプラクティス

1. **常に HTTP サーバーを使用**
2. **ファイルパスの統一**（相対パス推奨）
3. **適切な MIME タイプの設定**
4. **エラーログの定期的な確認**
5. **複数ブラウザでのテスト**

## 自動化スクリプト

### package.json での設定例

```json
{
  "scripts": {
    "dev": "http-server -p 8000 -c-1",
    "start": "python -m http.server 8000"
  }
}
```

### 簡単な起動スクリプト (start-dev.sh)

```bash
#!/bin/bash
echo "Starting development server..."
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m http.server 8000
elif command -v node &> /dev/null; then
    npx http-server -p 8000
else
    echo "Python or Node.js is required"
    exit 1
fi
```
