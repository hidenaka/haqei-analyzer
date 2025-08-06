# HAQEI Triple OS分析エンジン 要件定義

## プロジェクト概要
- **名前**: HAQEI Triple OS分析エンジン易経準拠化プロジェクト
- **目的**: bunenjin哲学に基づくTriple OS（Engine/Interface/SafeMode）の完全実装
- **重要度**: ★★★ 最高（システムの根幹ロジック）

## 現状分析

### 1. Engine OS
- **状態**: 実装済みだが易経準拠性要検証
- **機能**: 8次元ベクトル→三爻エネルギー→64卦マッピング
- **検証必要項目**:
  - 三爻対応の正確性
  - 上下卦決定ロジック
  - 計算式の易経準拠性

### 2. Interface OS
- **状態**: 簡略実装（固定値）
- **現在の問題**: 「地天泰」(11)固定返し
- **必要な実装**: Q25-Q30社会的パターン→64卦分析

### 3. SafeMode OS
- **状態**: 簡略実装（固定値）
- **現在の問題**: 「坤為地」(2)固定返し
- **必要な実装**: Q25-Q30防御パターン→64卦分析

## 技術制約
- 単一HTMLファイル構成維持
- 30問質問システム（Q1-Q24価値観、Q25-Q30シナリオ）
- 64卦データベース活用
- 易経正統性の厳守

## 成功基準
1. 易経専門家による妥当性確認
2. 全3つのOSが64卦から適切な結果出力
3. 三爻と64卦の本来意味に基づく実装
4. bunenjin哲学との整合性

## 重要ファイルパス
- **メインファイル**: /Users/nakanohideaki/Desktop/haqei-analyzer/emergency_haqei.html
- **質問データ**: /Users/nakanohideaki/Desktop/haqei-analyzer/haqei-vue/src/data/questions.ts
- **64卦データベース**: /Users/nakanohideaki/Desktop/haqei-analyzer/public/data/hexagrams.json

## 開発優先度
1. **最優先**: Engine OS の易経準拠性検証・修正
2. **高優先**: Interface OS の社会的パターン分析実装
3. **高優先**: SafeMode OS の防御パターン分析実装

## bunenjin哲学との整合性
- 三爻システムによる内面・関係・行動の統合分析
- 64卦による包括的人格・状況理解
- Triple OS による多層的意思決定支援