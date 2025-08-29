# HAQEI Analyzer Runbook

## 概要
このRunbookは、HAQEI Analyzerシステムの運用監視、トラブルシューティング、フォールバック手順を記述します。

## 監視メトリクス
- レイテンシ: p50/p95/p99
- 解析モード: kuromoji/fallback
- データソース: D1/KV/JSON
- アラート件数: 偏り検知、決定論違反

## アラート閾値
- レイテンシ: p95 > 45ms
- 決定論: 一致率 < 100%
- 偏り: χ² p ≤ 0.05, 最大使用率 > 30%, 用九/用六 > 1%

## 調査手順
1. HUD確認
2. コンソールログ確認
3. Cloudflare Pages Logs確認

## フォールバック切替
- D1 → KV → JSON

## ロールバック
- Git revert使用