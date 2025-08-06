# HAQEI Analyzer 緊急最適化タスク定義書

## タスク一覧サマリー

**総タスク数**: 24タスク  
**見積工数**: 10-14日  
**優先度**: 最高（本番環境移行ブロッカー）

---

## Phase 1: 即時対応タスク（1-2日）

### TASK-001: セキュリティヘッダーのメタタグ実装
**優先度**: 🔴 Critical  
**見積時間**: 2時間  
**担当**: フロントエンド  
**前提条件**: なし

**実装内容**:
```html
<!-- os_analyzer.htmlのheadタグ内に追加 -->
<meta http-equiv="Content-Security-Policy" content="...">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
```

**完了条件**:
- [ ] メタタグが正しく設置されている
- [ ] CSPエラーが発生していない
- [ ] 既存機能が正常動作する

---

### TASK-002: Critical CSS抽出
**優先度**: 🔴 Critical  
**見積時間**: 4時間  
**担当**: フロントエンド  
**前提条件**: なし

**実装内容**:
1. ファーストビューで必要なCSSを特定
2. critical.css（14KB以下）を作成
3. os_analyzer.htmlにインライン化

**ツール**: 
- Critical (npm package)
- Chrome DevTools Coverage

**完了条件**:
- [ ] Critical CSSが14KB以下
- [ ] ファーストビューが即座に表示される
- [ ] レイアウトシフトが発生しない

---

### TASK-003: 大容量データファイルの分離
**優先度**: 🔴 Critical  
**見積時間**: 6時間  
**担当**: フロントエンド  
**前提条件**: なし

**実装内容**:
1. 以下のファイルをpublic/dataディレクトリに移動
   - data_box.js → data/hexagrams.json
   - H384_DATABASE.js → data/h384.json
   - koudo_shishin_database.js → data/koudo_shishin.json
   - ai_theme_database.js → data/ai_themes.json
   - bible.js → data/bible.json

2. グローバル変数の互換性レイヤー作成

**完了条件**:
- [ ] データファイルがJSONとして分離されている
- [ ] 既存コードが動作する（互換性維持）
- [ ] scriptタグから削除されている

---

### TASK-004: CSRF保護の完全実装
**優先度**: 🔴 Critical  
**見積時間**: 3時間  
**担当**: フロントエンド  
**前提条件**: TASK-001完了

**実装内容**:
```javascript
// 1. CSRFProtection.jsの機能拡張
// 2. fetch APIへの自動トークン付与
// 3. メタタグへのトークン設定
```

**完了条件**:
- [ ] CSRFトークンが生成される
- [ ] APIリクエストにトークンが含まれる
- [ ] トークン検証が機能する

---

### TASK-005: SRI実装の完全化
**優先度**: 🟡 High  
**見積時間**: 2時間  
**担当**: フロントエンド  
**前提条件**: なし

**実装内容**:
1. 外部スクリプトのSRIハッシュ生成
2. integrity属性の追加
3. crossorigin属性の設定

**対象**:
- Chart.js
- DOMPurify
- その他のCDNリソース

**完了条件**:
- [ ] 全外部スクリプトにSRI設定
- [ ] リソースが正常にロードされる
- [ ] コンソールにSRIエラーなし

---

## Phase 2: API実装タスク（3-4日）

### TASK-006: Cloudflare Workers環境構築
**優先度**: 🔴 Critical  
**見積時間**: 4時間  
**担当**: バックエンド  
**前提条件**: TASK-003完了

**実装内容**:
1. Wranglerプロジェクト初期化
2. KVネームスペース作成
3. 開発環境設定

```bash
wrangler init haqei-api
wrangler kv:namespace create "HEXAGRAMS"
wrangler kv:namespace create "H384"
```

**完了条件**:
- [ ] Workers環境が動作する
- [ ] KVストレージが利用可能
- [ ] ローカル開発環境構築完了

---

### TASK-007: 卦データAPI実装
**優先度**: 🔴 Critical  
**見積時間**: 6時間  
**担当**: バックエンド  
**前提条件**: TASK-006完了

**エンドポイント**:
```
GET /api/v1/hexagrams/summary
GET /api/v1/hexagrams/{id}
POST /api/v1/hexagrams/bulk
```

**完了条件**:
- [ ] APIが正常にレスポンスを返す
- [ ] レスポンスタイム < 100ms
- [ ] 適切なキャッシュヘッダー設定

---

### TASK-008: H384データAPI実装
**優先度**: 🔴 Critical  
**見積時間**: 4時間  
**担当**: バックエンド  
**前提条件**: TASK-006完了

**エンドポイント**:
```
GET /api/v1/h384/{hexagram}/{line}
GET /api/v1/h384/bulk
```

**完了条件**:
- [ ] 384爻データが取得できる
- [ ] データ整合性確認
- [ ] エラーハンドリング実装

---

### TASK-009: データローダークライアント実装
**優先度**: 🔴 Critical  
**見積時間**: 8時間  
**担当**: フロントエンド  
**前提条件**: TASK-007, TASK-008完了

**実装内容**:
```javascript
// hexagram-loader.js
class HexagramLoader {
  constructor() {
    this.cache = new OptimizedCacheManager();
    this.baseURL = '/api/v1';
  }
  
  async getHexagram(id) { ... }
  async getH384(hexagram, line) { ... }
  async getBulk(ids) { ... }
}
```

**完了条件**:
- [ ] APIからデータ取得できる
- [ ] キャッシング機能が動作
- [ ] エラー時のフォールバック

---

### TASK-010: IndexedDBキャッシング実装
**優先度**: 🟡 High  
**見積時間**: 6時間  
**担当**: フロントエンド  
**前提条件**: TASK-009完了

**実装内容**:
1. IndexedDBスキーマ設計
2. キャッシュマネージャー実装
3. TTL管理機能
4. 容量管理機能

**完了条件**:
- [ ] データがIndexedDBに保存される
- [ ] オフライン時も基本動作可能
- [ ] 古いデータが自動削除される

---

## Phase 3: コード分割タスク（3-4日）

### TASK-011: Webpack/Vite設定更新
**優先度**: 🔴 Critical  
**見積時間**: 4時間  
**担当**: ビルド設定  
**前提条件**: なし

**実装内容**:
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['chart.js'],
          'core': ['./js/core/*.js'],
          'engines': ['./js/engines/*.js']
        }
      }
    }
  }
}
```

**完了条件**:
- [ ] チャンク分割が機能する
- [ ] ビルドが成功する
- [ ] ソースマップ生成

---

### TASK-012: Dynamic Import実装 - コアモジュール
**優先度**: 🔴 Critical  
**見積時間**: 6時間  
**担当**: フロントエンド  
**前提条件**: TASK-011完了

**対象モジュール**:
- StatisticalEngine
- Calculator
- AnalysisView
- TripleOSEngine

**実装例**:
```javascript
// Before
import { StatisticalEngine } from './engines/StatisticalEngine.js';

// After
const { StatisticalEngine } = await import('./engines/StatisticalEngine.js');
```

**完了条件**:
- [ ] 動的インポートが動作
- [ ] 適切なローディング表示
- [ ] エラーハンドリング実装

---

### TASK-013: app.js最適化
**優先度**: 🔴 Critical  
**見積時間**: 8時間  
**担当**: フロントエンド  
**前提条件**: TASK-012完了

**実装内容**:
1. 初期化処理の最適化
2. Progressive Enhancement実装
3. アイドル時の先読み

**完了条件**:
- [ ] 初期表示3秒以内
- [ ] スムーズな段階的読み込み
- [ ] メモリ使用量削減

---

### TASK-014: CSS最適化
**優先度**: 🟡 High  
**見積時間**: 6時間  
**担当**: フロントエンド  
**前提条件**: TASK-002完了

**実装内容**:
1. interactive.css（2.97MB）の分析
2. 重複ルール削除
3. 未使用CSS削除
4. ファイル分割

**ツール**:
- PurgeCSS
- PostCSS

**完了条件**:
- [ ] CSS総サイズ < 500KB
- [ ] スタイル崩れなし
- [ ] アニメーション動作確認

---

### TASK-015: プリロード/プリフェッチ最適化
**優先度**: 🟡 High  
**見積時間**: 3時間  
**担当**: フロントエンド  
**前提条件**: TASK-013完了

**実装内容**:
```html
<link rel="preload" href="/js/core-bundle.js" as="script">
<link rel="prefetch" href="/js/engines-bundle.js">
<link rel="preconnect" href="https://api.haqei.com">
```

**完了条件**:
- [ ] 適切なリソースヒント設定
- [ ] ネットワークウォーターフォール最適化
- [ ] 測定可能な改善

---

## Phase 4: 最終調整タスク（2-3日）

### TASK-016: Service Worker実装
**優先度**: 🟡 High  
**見積時間**: 6時間  
**担当**: フロントエンド  
**前提条件**: Phase 1-3完了

**実装内容**:
1. キャッシュ戦略設計
2. オフライン対応
3. バックグラウンド同期

**完了条件**:
- [ ] Service Worker登録成功
- [ ] オフライン時も基本動作
- [ ] キャッシュ更新戦略動作

---

### TASK-017: Cloudflare Workersセキュリティヘッダー
**優先度**: 🟡 High  
**見積時間**: 3時間  
**担当**: バックエンド  
**前提条件**: TASK-006完了

**実装内容**:
```javascript
// _middleware.js
export async function onRequest(context) {
  const response = await context.next();
  
  // セキュリティヘッダー追加
  response.headers.set('X-Content-Type-Options', 'nosniff');
  // ... その他のヘッダー
  
  return response;
}
```

**完了条件**:
- [ ] 全レスポンスにヘッダー付与
- [ ] セキュリティスコア90以上
- [ ] パフォーマンス影響なし

---

### TASK-018: パフォーマンステスト自動化
**優先度**: 🟡 High  
**見積時間**: 4時間  
**担当**: QA  
**前提条件**: Phase 1-3完了

**実装内容**:
1. Lighthouse CI設定
2. GitHub Actions統合
3. 閾値設定

**完了条件**:
- [ ] 自動テスト実行
- [ ] PRにレポート表示
- [ ] 閾値違反で警告

---

### TASK-019: A/Bテスト準備
**優先度**: 🟢 Medium  
**見積時間**: 3時間  
**担当**: フロントエンド  
**前提条件**: Phase 1-3完了

**実装内容**:
1. Feature Flag実装
2. メトリクス収集
3. ロールバック機能

**完了条件**:
- [ ] 新旧バージョン切り替え可能
- [ ] パフォーマンスメトリクス収集
- [ ] 即時ロールバック可能

---

### TASK-020: エラー監視強化
**優先度**: 🟢 Medium  
**見積時間**: 2時間  
**担当**: フロントエンド  
**前提条件**: なし

**実装内容**:
1. エラー収集の詳細化
2. パフォーマンスエラー追跡
3. ユーザー影響分析

**完了条件**:
- [ ] 詳細なエラーログ
- [ ] エラー率の可視化
- [ ] アラート設定

---

### TASK-021: ドキュメント更新
**優先度**: 🟢 Medium  
**見積時間**: 4時間  
**担当**: ドキュメント  
**前提条件**: 全タスク完了

**更新対象**:
- README.md
- CLAUDE.md
- デプロイメントガイド
- API仕様書

**完了条件**:
- [ ] 全変更が文書化
- [ ] 新しいアーキテクチャ図
- [ ] トラブルシューティングガイド

---

### TASK-022: 統合テスト
**優先度**: 🔴 Critical  
**見積時間**: 8時間  
**担当**: QA  
**前提条件**: Phase 1-3完了

**テスト項目**:
1. 30問フロー完全動作
2. オフライン時動作
3. 3G環境テスト
4. エラー時の回復

**完了条件**:
- [ ] 全テストケース合格
- [ ] パフォーマンス基準達成
- [ ] ユーザビリティ維持

---

### TASK-023: 本番環境検証
**優先度**: 🔴 Critical  
**見積時間**: 4時間  
**担当**: DevOps  
**前提条件**: TASK-022完了

**検証内容**:
1. Cloudflare Pagesデプロイ
2. 実環境パフォーマンス測定
3. セキュリティ監査

**完了条件**:
- [ ] 本番環境で正常動作
- [ ] Core Web Vitals合格
- [ ] セキュリティ要件達成

---

### TASK-024: 段階的ロールアウト
**優先度**: 🔴 Critical  
**見積時間**: 2時間  
**担当**: DevOps  
**前提条件**: TASK-023完了

**実施内容**:
1. 10%トラフィック切り替え
2. メトリクス監視（24時間）
3. 問題なければ100%切り替え

**完了条件**:
- [ ] エラー率増加なし
- [ ] パフォーマンス劣化なし
- [ ] ユーザークレームなし

---

## 依存関係図

```
Phase 1 (即時対応)
├── TASK-001 → TASK-004
├── TASK-002 → TASK-014
├── TASK-003 → TASK-006
└── TASK-005

Phase 2 (API実装)
├── TASK-006 → TASK-007, TASK-008, TASK-017
├── TASK-007 → TASK-009
├── TASK-008 → TASK-009
└── TASK-009 → TASK-010

Phase 3 (コード分割)
├── TASK-011 → TASK-012
├── TASK-012 → TASK-013
├── TASK-013 → TASK-015
└── TASK-014

Phase 4 (最終調整)
├── TASK-016
├── TASK-018
├── TASK-019
├── TASK-020
├── TASK-021
├── TASK-022 → TASK-023 → TASK-024
└── All → TASK-021
```

---

## リソース割り当て

**必要人員**:
- フロントエンドエンジニア: 2名
- バックエンドエンジニア: 1名
- QAエンジニア: 1名
- DevOpsエンジニア: 1名

**推奨スケジュール**:
- Week 1: Phase 1 + Phase 2開始
- Week 2: Phase 2完了 + Phase 3 + Phase 4

---

**タスク定義書作成日**: 2025年8月6日  
**プロジェクト開始予定**: 即時  
**完了予定日**: 2025年8月20日