# HAQEI Analyzer 緊急最適化要件定義書

## 1. プロジェクト概要

### 1.1 背景
HAQEIアナライザーの本番環境移行前評価により、以下の致命的な問題が発見された：
- JavaScriptバンドルサイズ: 26MB（目標の1,344%超過）
- セキュリティヘッダー未実装（スコア40/100）
- Core Web Vitals全項目FAIL予測

### 1.2 目的
本番環境移行のための必須要件を満たすため、以下を実施する：
1. バンドルサイズを5MB以下に削減
2. 基本セキュリティヘッダーの完全実装

### 1.3 スコープ
- **対象**: os_analyzer.html および関連リソース
- **期間**: 1-2週間（2025年8月6日〜8月20日）
- **優先度**: 最高（本番環境移行のブロッカー）

---

## 2. 現状分析

### 2.1 バンドルサイズ内訳
```
総バンドルサイズ: 26MB
├── JavaScript: 26MB+
│   ├── data_box.js: 388KB（卦データ）
│   ├── H384_DATABASE.js: 299KB（384爻データベース）
│   ├── koudo_shishin_database.js: 298KB（行動指針）
│   ├── ai_theme_database.js: 265KB（AIテーマ）
│   ├── bible.js: 245KB（聖書参照）
│   └── その他50+ファイル
└── CSS: 3.7MB
    └── interactive.css: 2.97MB
```

### 2.2 パフォーマンス影響
- 初期ロード時間: 8-12秒（3G環境で30秒以上）
- メモリ使用量: 150-200MB
- ユーザー離脱率: 高リスク

### 2.3 セキュリティ現状
- XSS保護: 実装済み（85/100）
- CSRF保護: 部分実装（70/100）
- セキュリティヘッダー: 未実装（40/100）

---

## 3. 機能要件

### 3.1 バンドルサイズ削減要件

#### FR-001: データベースファイルのAPI化
- **説明**: 大容量データベースファイルをAPIエンドポイント化
- **対象ファイル**:
  - data_box.js（388KB）
  - H384_DATABASE.js（299KB）
  - koudo_shishin_database.js（298KB）
  - ai_theme_database.js（265KB）
  - bible.js（245KB）
- **実装方式**: 
  - JSONファイルとして分離
  - 必要時のみフェッチ
  - IndexedDBキャッシング

#### FR-002: コード分割実装
- **説明**: JavaScriptファイルの動的インポート化
- **対象**: 
  - 初期表示に不要なコンポーネント
  - 分析エンジン類
  - ヘルプシステム
- **目標**: 初期バンドル1MB以下

#### FR-003: CSS最適化
- **説明**: interactive.css（2.97MB）の分割と最適化
- **実装**:
  - 重複ルール削除
  - 未使用CSS削除
  - Critical CSS抽出

### 3.2 セキュリティ強化要件

#### FR-004: セキュリティヘッダー実装
- **Content-Security-Policy（CSP）**
  ```
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data:;
  ```
- **X-Frame-Options**: SAMEORIGIN
- **X-Content-Type-Options**: nosniff
- **Strict-Transport-Security**: max-age=31536000; includeSubDomains

#### FR-005: CSRF保護完全実装
- **トークン生成**: サーバーサイド実装
- **トークン検証**: 全フォーム送信時
- **SameSiteクッキー**: Strict設定

#### FR-006: SRI（Subresource Integrity）完全実装
- **対象**: 全外部スクリプト
- **実装**: integrity属性追加

---

## 4. 非機能要件

### 4.1 パフォーマンス要件
- **初期ロード時間**: 3秒以内（3G環境）
- **FCP**: 1.8秒以内
- **LCP**: 2.5秒以内
- **総バンドルサイズ**: 5MB以下

### 4.2 互換性要件
- **既存機能**: 100%維持
- **ブラウザサポート**: 現行維持
- **後方互換性**: localStorage/IndexedDB移行

### 4.3 品質要件
- **エラー発生率**: 0%（新規エラーなし）
- **テストカバレッジ**: 既存テスト全合格
- **bunenjin哲学**: 準拠維持

---

## 5. 技術仕様

### 5.1 API設計
```javascript
// データAPI仕様
GET /api/v1/hexagrams/{id}
GET /api/v1/hexagrams/bulk?ids=1,2,3
GET /api/v1/h384/{hexagram}/{line}
GET /api/v1/koudo-shishin/{category}
GET /api/v1/ai-themes/{theme}

// レスポンス形式
{
  "status": "success",
  "data": {...},
  "cached_until": "2025-08-07T00:00:00Z"
}
```

### 5.2 キャッシング戦略
```javascript
// IndexedDB構造
{
  database: "haqei_cache",
  version: 1,
  stores: {
    hexagrams: { keyPath: "id", indexes: ["number"] },
    h384: { keyPath: "key", indexes: ["hexagram", "line"] },
    koudo_shishin: { keyPath: "id", indexes: ["category"] }
  }
}
```

### 5.3 動的インポート実装
```javascript
// Before
import { Engine } from './js/engines/Engine.js';

// After
const Engine = await import('./js/engines/Engine.js');
```

---

## 6. 実装アプローチ

### 6.1 段階的移行戦略
1. **Phase 1**: データファイル分離（互換性維持）
2. **Phase 2**: API実装とキャッシング
3. **Phase 3**: 動的インポート実装
4. **Phase 4**: CSS最適化
5. **Phase 5**: セキュリティヘッダー実装

### 6.2 リスク管理
- **リスク1**: データ取得失敗
  - 対策: オフラインフォールバック
- **リスク2**: 初回ロード遅延
  - 対策: プリロード戦略
- **リスク3**: 既存機能破損
  - 対策: 段階的移行とテスト

---

## 7. テスト要件

### 7.1 機能テスト
- 30問フロー完全動作確認
- データ取得エラー時の動作
- キャッシュ有効性確認

### 7.2 パフォーマンステスト
- Lighthouse CI自動テスト
- 実機3G環境テスト
- メモリ使用量監視

### 7.3 セキュリティテスト
- CSPポリシー違反チェック
- CSRF攻撃シミュレーション
- ヘッダー検証

---

## 8. 制約事項

### 8.1 技術的制約
- Cloudflare Pages環境
- 静的サイトホスティング
- サーバーレス関数利用可能

### 8.2 時間的制約
- 2週間以内の完了必須
- 段階的リリース不可（一括移行）

### 8.3 リソース制約
- 既存コードベース維持
- bunenjin哲学準拠必須

---

## 9. 成功基準

### 9.1 定量的基準
- [ ] 総バンドルサイズ: 5MB以下
- [ ] 初期ロード: 3秒以内
- [ ] Core Web Vitals: 全項目PASS
- [ ] セキュリティスコア: 90/100以上

### 9.2 定性的基準
- [ ] ユーザー体験の維持
- [ ] エラーフリーな動作
- [ ] スムーズな移行

---

## 10. 承認

- **作成者**: Claude Code Assistant
- **作成日**: 2025年8月6日
- **承認者**: [承認待ち]
- **承認日**: [承認待ち]