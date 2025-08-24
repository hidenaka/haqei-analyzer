# 診断ロジックv2統合契約書

## 実施日: 2025-01-11
## バージョン: 2.0.0

## 1. 統合目的
- 純卦率を12-18%に最適化（Codex専門家要件準拠）
- Herfindahl指数による集中度連動制御
- 再現性のための乱数シード対応

## 2. 技術仕様

### 2.1 主要パラメータ
```javascript
// 純卦制御範囲
const PURE_HEXAGRAM_TARGET = {
    min: 0.12,  // 12%
    max: 0.18   // 18%
};

// Herfindahl指数の線形写像
const H8_norm = (H - 1/8) / (1 - 1/8);
```

### 2.2 統合対象ファイル
- **改修対象**: `/public/js/core/TripleOSInteractionAnalyzer.js`
- **統合元**: `/improved-diagnostic-logic-v2.js`

## 3. 統合方法

### 3.1 メソッド置換
```javascript
// 現行メソッド（置換対象）
calculateHexagramProbabilities(baguaEnergies)

// 新メソッド（v2から移植）
calculateHexagramProbabilitiesV2(baguaEnergies, osType, seed)
```

### 3.2 必須機能
1. **Softmax正規化**（ReLU削除済み）
2. **線形写像による純卦確率計算**
3. **SeededRandom対応**
4. **詳細ログ出力**

## 4. 品質基準

### 4.1 検証項目
- [ ] 純卦率が12-18%範囲内
- [ ] 再現性テスト合格（同一seed→同一結果）
- [ ] 集中度と純卦率の相関確認
- [ ] 各OS別パラメータ動作確認

### 4.2 テストケース
```javascript
// テストパターン
const testCases = [
    { name: "完全均等", vector: {乾:1,兌:1,離:1,震:1,巽:1,坎:1,艮:1,坤:1} },
    { name: "一極集中", vector: {乾:8,兌:0,離:0,震:0,巽:0,坎:0,艮:0,坤:0} },
    { name: "二極分散", vector: {乾:4,兌:0,離:0,震:0,巽:0,坎:0,艮:0,坤:4} }
];
```

## 5. 実装手順

### Phase 1: バックアップ
1. TripleOSInteractionAnalyzer.jsのバックアップ作成
2. 現行純卦率の測定記録

### Phase 2: コード統合
1. ImprovedDiagnosticEngineV2クラスの組み込み
2. calculateHexagramProbabilitiesメソッドの置換
3. SeededRandomクラスの追加

### Phase 3: 検証
1. 単体テスト実行
2. 統合テスト実行
3. 純卦率測定（1000回試行）

## 6. ロールバック条件
- 純卦率が目標範囲外（<10% または >20%）
- エラー率が5%以上
- パフォーマンス劣化（2倍以上の処理時間）

## 7. 承認事項
本契約に基づき、以下を実施する：
- TripleOSInteractionAnalyzer.jsへのv2ロジック統合
- 既存機能の完全互換性維持
- テスト完了後の本番環境適用

## 8. リスク管理
- **リスク**: 既存の診断結果との乖離
- **対策**: A/Bテストによる段階的移行
- **監視**: 純卦率のリアルタイム監視

---
契約作成者: Claude Code
承認者: [pending]