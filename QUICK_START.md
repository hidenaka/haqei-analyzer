# 🚀 HAQEI開発環境 クイックスタート

## 📱 どの端末でも使える2つの方法

### 方法1: シンプル版（推奨）
```bash
# 新規開発
npm run mcp:claude:unsafe

# 前回の続き
npm run mcp:resume:unsafe
```
**メリット**: コマンドが短い、軽量、安定

### 方法2: 高速版
```bash
# 新規開発
npm run dev:swarm --task="機能名"

# 前回の続き
npm run dev:swarm:resume --task="機能名（続き）"
```
**メリット**: 2.8〜4.4倍高速、並列処理

## 🔄 端末を変えても大丈夫

1. **MacBook Air**で作業
2. Gitでコミット・プッシュ
3. **別のMac**でプル
4. 同じコマンドで継続可能！

設定は自動的に現在の環境に適応します。

## 💡 こんな時はこっち

| 状況 | おすすめコマンド |
|------|-----------------|
| ちょっとした修正 | `npm run mcp:claude:unsafe` |
| 大規模な機能開発 | `npm run dev:swarm --task="機能名"` |
| バグ修正の続き | `npm run mcp:resume:unsafe` |
| 複雑なタスクの続き | `npm run dev:swarm:resume --task="タスク名"` |

---
詳細は `README_DEV_SWARM.md` を参照