# USEP実行指示書（AI用）

## このシステムについて

USEP (Universal Service Evolution Platform) は、AI仮想ユーザーを使ってWebサービスを自動改善するシステムです。

## 実行方法

### 最も簡単な実行（これだけでOK）

```bash
cd /Users/nakanohideaki/Desktop/haqei-analyzer
npm install
npm run usep:demo
open output/demo/report.html
```

### 実行オプション

- `usep:demo` - 10人でクイックテスト（1-2分）
- `usep:quick` - 10人でクイック分析
- `usep:haqei` - 100人で標準分析（5-10分）
- `usep:run -- -c 1000 -s haqei -r` - 1000人で詳細分析（30-60分）

### 結果の場所

```
output/
└── demo/ または usep-haqei-[日時]/
    └── report.html  ← これを開く
```

## 何が起きるか

1. **仮想ユーザー生成**: AIが様々なペルソナのユーザーを作成
2. **体験シミュレーション**: 各ユーザーがサービスを使う様子をシミュレート
3. **改善分析**: 問題点を発見し、優先順位付けされた改善提案を生成
4. **レポート作成**: ビジュアルなHTMLレポートを生成

## 期待される結果

- コンバージョン率の改善提案
- ユーザー満足度の向上方法
- 具体的な実装アドバイス
- 優先順位付けされたロードマップ

## トラブル時

エラーが出たら：
```bash
npm install --force
```

それでもダメなら：
```bash
rm -rf node_modules package-lock.json
npm install
```

## サポートされているサービスタイプ

- `haqei` - HaQei Analyzer（デフォルト）
- `ecommerce` - Eコマースサイト
- `saas` - SaaSアプリケーション
- `content` - コンテンツサイト
- `social` - ソーシャルメディア

---

**実行するには上記の「最も簡単な実行」のコマンドをコピー&ペーストしてください。**