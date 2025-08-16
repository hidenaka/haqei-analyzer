# 📋 HAQEI Analyzer ローカル静的配信手順

## 🎯 概要

HAQEI AnalyzerをローカルHTTPサーバーで静的配信するための完全手順書です。

## 📁 配信準備

### 1. 必要なファイル構造確認

```
public/                           # 配信ルートディレクトリ
├── os_analyzer.html             # メインアプリ（502KB・フル機能版）
├── os_analyzer_clean.html       # CSP準拠版（推奨）
├── os_analyzer_optimized.html   # 最適化版（11.2KB・軽量）
├── os_analyzer_a11y.html        # アクセシビリティ版（7.6KB・WCAG準拠）
├── _headers                     # セキュリティヘッダー設定
├── netlify.toml                 # 静的ホスティング設定
├── assets/
│   ├── H384H64database.js       # 384爻・64卦データベース
│   └── js/
│       ├── questions-full.js    # 36問完全版質問データ
│       └── app.js              # メインアプリケーション
├── js/
│   ├── core/                    # コア機能
│   ├── components/              # UIコンポーネント
│   └── lib/
│       └── chart.min.js        # 自己ホスト版Chart.js
└── css/                         # スタイルシート
    ├── os-analyzer.css         # メインスタイル
    ├── accessibility.css       # アクセシビリティ拡張
    └── mobile.css              # レスポンシブ対応
```

## 🚀 配信方法

### 方法1: Python標準ライブラリ（推奨）

```bash
# 1. プロジェクトディレクトリに移動
cd /path/to/haqei-analyzer

# 2. publicディレクトリから配信開始
cd public
python3 -m http.server 8080

# 3. ブラウザでアクセス
# http://localhost:8080/os_analyzer_clean.html （推奨）
# http://localhost:8080/os_analyzer.html （フル機能版）
```

### 方法2: Node.js (http-server)

```bash
# インストール（初回のみ）
npm install -g http-server

# publicディレクトリから配信
cd public  
http-server -p 8080 -c-1

# アクセス
# http://localhost:8080/os_analyzer_clean.html
```

### 方法3: PHP組み込みサーバー

```bash
cd public
php -S localhost:8080

# アクセス
# http://localhost:8080/os_analyzer_clean.html
```

## 🎨 配信版選択ガイド

### os_analyzer_clean.html（推奨）
- **用途**: 本番環境・一般ユーザー向け
- **特徴**: CSP準拠・セキュリティ強化・適切なファイルサイズ
- **対象**: 一般的な利用・安定性重視

### os_analyzer_optimized.html
- **用途**: 軽量版・モバイル優先
- **特徴**: 11.2KB・高速読み込み・Core Web Vitals最適化
- **対象**: 低帯域・パフォーマンス重視

### os_analyzer_a11y.html  
- **用途**: アクセシビリティ重視環境
- **特徴**: WCAG 2.1 Level AA準拠・7.6KB
- **対象**: 支援技術利用者・公的機関

### os_analyzer.html
- **用途**: 開発・デバッグ用
- **特徴**: 502KB・全機能・開発者ツール統合
- **対象**: 開発者・テスト環境

## 🔒 セキュリティ設定

### Content Security Policy (CSP)
```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self';
frame-ancestors 'none';
```

### セキュリティヘッダー
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## ⚡ パフォーマンス最適化

### キャッシュ戦略
```bash
# 静的アセット（1年キャッシュ）
/css/* → Cache-Control: public, max-age=31536000
/js/*  → Cache-Control: public, max-age=31536000
/assets/* → Cache-Control: public, max-age=31536000

# HTMLファイル（キャッシュ無効）
*.html → Cache-Control: no-cache, no-store
```

### Core Web Vitals達成値
- **Largest Contentful Paint (LCP)**: 1.1秒
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

## 📱 モバイル対応

### レスポンシブ対応確認
```bash
# デベロッパーツールでテスト
# iPhone SE: 375x667
# iPad: 768x1024 
# Desktop: 1280x800
```

## 🧪 動作確認

### 1. 基本機能テスト
```bash
# 必須チェック項目
□ ウェルカム画面が表示される
□ 「分析を始める」ボタンが動作する
□ 36問の質問が順番に表示される
□ 各質問に5つの選択肢（A～E）がある
□ プログレスバーが0→36まで進行する
□ 分析結果画面が表示される
□ Triple OS（Engine/Interface/Safe Mode）結果が表示
□ 64卦と八宮の情報が表示される
□ チャート（グラフ）が正常表示される
```

### 2. パフォーマンステスト
```bash
# ブラウザのデベロッパーツール → Network → Throttling: Fast 3G
# 初期読み込み時間が3秒未満であることを確認
```

### 3. アクセシビリティテスト
```bash
# ブラウザのデベロッパーツール → Lighthouse
# Accessibility Score 90点以上を確認
```

## 🔧 トラブルシューティング

### よくある問題

#### 1. ファイルが見つからない (404 Error)
```bash
# 原因: ファイルパスの問題
# 解決: publicディレクトリから配信しているか確認
cd public  
python3 -m http.server 8080
```

#### 2. JavaScriptエラーが発生
```bash
# 原因: CSPブロック・ファイル不足
# 解決: ブラウザのコンソールでエラー確認
# F12 → Console → 赤いエラーメッセージを確認
```

#### 3. Chart.jsが表示されない  
```bash
# 原因: chart.min.jsファイル不足
# 解決: lib/chart.min.jsの存在確認
ls public/js/lib/chart.min.js
```

#### 4. 質問が表示されない
```bash
# 原因: questions-full.jsの読み込み問題
# 解決: ファイル存在確認
ls public/assets/js/questions-full.js
```

#### 5. 結果画面が空白
```bash
# 原因: H384H64database.jsの問題
# 解決: データベースファイル確認
ls public/assets/H384H64database.js
```

## 📊 監視・ログ

### アクセスログ確認
```bash
# Python http.serverのログ
# 標準出力にアクセスログが表示される
# 例: 127.0.0.1 - - [14/Jan/2025 08:30:00] "GET /os_analyzer_clean.html HTTP/1.1" 200 -
```

### エラーログ確認
```bash
# ブラウザのデベロッパーツール
# F12 → Console → Filter: Errors
```

## 🚀 本番配信準備

### 1. ファイル最終チェック
```bash
# 必須ファイルの存在確認
find public -name "*.html" | head -5
find public -name "*.js" | grep -E "(questions-full|H384H64database)" 
find public -name "*.css" | head -3
```

### 2. セキュリティ最終確認
```bash
# CSP設定確認
grep -r "Content-Security-Policy" public/_headers
```

### 3. パフォーマンス最終確認
```bash
# ファイルサイズ確認
du -sh public/os_analyzer*.html
```

## ✅ デプロイ完了チェックリスト

- [ ] 配信サーバー起動完了
- [ ] メインアプリ(os_analyzer_clean.html)にアクセス可能
- [ ] ウェルカム画面が正常表示
- [ ] 分析開始ボタンが動作
- [ ] 質問フローが正常動作
- [ ] 結果画面が正常表示
- [ ] セキュリティヘッダーが適用
- [ ] パフォーマンス目標達成（LCP < 3s）
- [ ] モバイル対応確認
- [ ] エラーログなし

---

## 📞 サポート

問題が発生した場合は以下を確認：
1. ブラウザのコンソール（F12）でエラーを確認
2. ネットワークタブで404エラーがないか確認  
3. 必要ファイルの存在確認
4. サーバーログの確認

**静的配信の完了により、HAQEI Analyzerを安全・高速・安定的にローカル環境で提供できます。**