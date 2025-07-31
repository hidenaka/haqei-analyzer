# HAQEI 並行開発運用ガイド

## 🚀 並行開発システム概要

このガイドは、同一プロジェクトで複数のClaude Codeセッションを使用した並行開発の運用方法を説明します。

### 📋 基本コンセプト

- **OS Analyzer開発**: ターミナル1でTriple OS Architecture、分析エンジン等の改善
- **Future Simulator開発**: ターミナル2で未来予測、易経分析等の修正
- **自動競合回避**: ポート分離、ブランチ分離、Git管理
- **リアルタイム同期**: Git-based継続的統合

## 🎯 実際の運用フロー

### ステップ1: 並行開発セッション開始

**ターミナル1（OS Analyzer専用）**
```bash
cd /Users/hideakimacbookair/Desktop/haqei-analyzer
./portable-os-analyzer.sh
```

**実行結果:**
- Cipher Server: ポート3001-3010（自動選択）
- Git Branch: `feature/os-analyzer-[hostname]`
- 専用Claude Code起動
- 専門領域: Triple OS Architecture、ResultsView、TripleOSEngine等

**ターミナル2（Future Simulator専用）**
```bash
cd /Users/hideakimacbookair/Desktop/haqei-analyzer
./portable-future-simulator.sh
```

**実行結果:**
- Cipher Server: ポート3011-3020（自動選択）
- Git Branch: `feature/future-simulator-[hostname]`
- 独立Claude Code起動
- 専門領域: 未来予測アルゴリズム、易経分析、戦略シナリオ等

### ステップ2: 開発指示の出し方

**ターミナル1での指示例:**
```
「OS Analyzerの Triple OS Architecture を改善して、
Engine/Interface/Safe Mode の相互作用をより明確に表示できるようにして」
```

**ターミナル2での指示例:**
```
「Future Simulatorの易経アルゴリズムを修正して、
64卦の変化パターンをより正確に予測できるようにして」
```

### ステップ3: 変更の統合

**各セッション終了時:**
```bash
# 自動的に適切なブランチにコミット
git add .
git commit -m "[OS-Analyzer] Triple OS improvements"
git push origin feature/os-analyzer-hideakimacbook-air

# または
git commit -m "[Future-Simulator] I Ching algorithm fixes"
git push origin feature/future-simulator-hideakimacbook-air
```

**統合時:**
```bash
# developブランチで統合
git checkout develop
git merge feature/os-analyzer-hideakimacbook-air
git merge feature/future-simulator-hideakimacbook-air
git push origin develop
```

## 🛠️ 詳細設定

### 自動ポート管理
- OS Analyzer: 3001-3010
- Future Simulator: 3011-3020
- 競合回避で自動選択

### ブランチ戦略
```
develop
├── feature/os-analyzer-[device]
├── feature/future-simulator-[device]
└── feature/[custom-feature-name]
```

### Claude Codeコンテキスト分離
- 各セッションは独立したCipher Serverに接続
- 専門領域の記憶とコンテキストを維持
- 混在を防ぐファイルフォーカス設定

## 🎮 実践的使用例

### 例1: UI改善 + ロジック修正の並行開発

**ターミナル1:**
```bash
./portable-os-analyzer.sh
# 指示: "ResultsViewのUI/UXを改善して、ユーザビリティを向上させて"
```

**ターミナル2:**
```bash
./portable-future-simulator.sh
# 指示: "未来予測の精度を向上させるため、統計的アルゴリズムを最適化して"
```

### 例2: バグ修正 + 新機能開発の並行実行

**ターミナル1:**
```bash
./portable-os-analyzer.sh
# 指示: "Triple OSの結果表示でエラーが出るバグを修正して"
```

**ターミナル2:**
```bash
./portable-future-simulator.sh
# 指示: "新しい戦略シミュレーション機能を追加して"
```

### 例3: Mac mini併用での4重並行開発

**MacBook Air:**
- ターミナル1: OS Analyzer UI改善
- ターミナル2: Future Simulator ロジック改善

**Mac mini:**
- ターミナル1: OS Analyzer バックエンド改善
- ターミナル2: Future Simulator 新機能追加

## ⚠️ 注意事項とベストプラクティス

### DO's ✅
- 各セッションに明確な役割分担
- 定期的なgit push（作業終了時）
- 専門領域の指示を明確に
- セッション間の調整・確認

### DON'Ts ❌
- 同じファイルの同時編集は避ける
- 無関係な変更の混在
- 長時間のセッション放置
- 未コミット状態での切り替え

## 🔧 トラブルシューティング

### ポート競合
```bash
# 使用中ポート確認
lsof -i :3001-3020

# 手動ポート指定
CIPHER_PORT=3025 ./portable-os-analyzer.sh
```

### ブランチ競合
```bash
# 安全な同期
git stash
git pull origin develop
git stash pop
```

### パフォーマンス問題
```bash
# 軽量版使用
./scripts/lightweight-worktree-setup.sh
```

## 📊 期待効果

- **開発速度**: 2-4倍向上
- **品質**: 専門特化による精度向上
- **効率**: 待ち時間の排除
- **柔軟性**: デバイス間シームレス切り替え

## 🎯 次のステップ

1. 基本的な並行開発の習得
2. 複雑な機能の分散開発
3. チーム開発への拡張
4. CI/CD統合

---

**重要**: このシステムはHAQEIの bunenjin哲学 に基づき、調和のとれた並行開発を実現します。各セッションが独立しつつも、全体として統合された開発体験を提供します。