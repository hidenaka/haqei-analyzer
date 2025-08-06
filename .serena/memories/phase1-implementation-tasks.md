# Phase 1 緊急最適化タスク実装詳細

## TASK-001: セキュリティヘッダーのメタタグ実装
**ファイル**: /public/os_analyzer.html
**実装内容**:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data:;
  connect-src 'self' https://api.haqei.com;
">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
```

## TASK-002: Critical CSS抽出
**目標**: 14KB以下のインラインCSS
**対象要素**:
- ウェルカム画面
- 初期ローディング
- 基本レイアウト

## TASK-003: データファイル分離
**移動対象**:
- /public/js/data/data_box.js → /public/data/hexagrams.json
- /public/js/core/H384_DATABASE.js → /public/data/h384.json
- /public/js/koudo_shishin_database.js → /public/data/koudo_shishin.json
- /public/js/ai_theme_database.js → /public/data/ai_themes.json
- /public/js/bible.js → /public/data/bible.json

## TASK-004: CSRF保護完全実装
**既存**: /public/js/shared/utils/CSRFProtection.js
**追加実装**:
- fetch APIへの自動トークン付与
- メタタグへのトークン設定
- SameSiteクッキー設定

## TASK-005: SRI実装
**対象スクリプト**:
- Chart.js (cdnjs.cloudflare.com)
- DOMPurify (cdnjs.cloudflare.com)
- その他の外部リソース