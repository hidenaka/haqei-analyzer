# HAQEI Future Simulator 二分木型分岐システム設計要件
**日付**: 2025-08-06 22:50 JST  
**重要度**: 最高  
**状況**: ユーザーから本質的設計指摘受領

## 現在の問題点
**誤解していた実装**:
- 8つの並列的な未来を提示
- 段階的分岐を無視
- 易経の陰陽二元論を適用していない

## 正しい設計要件

### 1. 二分木型の段階的分岐構造
```
現在の状況（386爻のいずれか）
    │
    ├─【第1分岐】テーマを進む（順行型）
    │   │
    │   ├─【第2分岐】さらに進む
    │   │   │
    │   │   ├─【第3分岐】継続強化
    │   │   └─【第3分岐】調整しつつ進む
    │   │
    │   └─【第2分岐】一部転換
    │       │
    │       ├─【第3分岐】部分的修正
    │       └─【第3分岐】新要素追加
    │
    └─【第1分岐】テーマを転換（転換型）
        │
        ├─【第2分岐】完全転換
        │   │
        │   ├─【第3分岐】新路線確立
        │   └─【第3分岐】実験的試行
        │
        └─【第2分岐】統合的転換
            │
            ├─【第3分岐】折衷案採用
            └─【第3分岐】第三の道
```

### 2. 技術実装要件
**核心システム**: `FutureBranchingSystem.js`
- 現在の爻位置から3段階先まで予測
- 各段階での陰陽選択ロジック
- 2^3 = 8パターンの最終到達点
- 各経路の易経的意味と特徴

**設計ファイル**:
```javascript
// 二分木型分岐生成
function generateBinaryTreeFutures(currentLine) {
    const level1 = {
        progress: calculateProgress(currentLine),     // 順行
        transform: calculateTransform(currentLine)    // 転換
    };
    
    const level2 = {
        progress: {
            continue: calculateContinue(level1.progress),
            adjust: calculateAdjust(level1.progress)
        },
        transform: {
            complete: calculateComplete(level1.transform),
            integrate: calculateIntegrate(level1.transform)
        }
    };
    
    // ... level3まで展開
    
    return buildTreeStructure(level1, level2, level3);
}
```

### 3. 386爻システム統合
- **現在の実装**: H384データベースあり
- **必要な変更**: 各爻からの3段階分岐計算
- **陰陽変化**: 爻の上昇/反転による次の選択肢

### 4. 表示システム革新
- **段階的選択UI**: ツリー構造の視覚化
- **各ノードの説明**: 選択理由と結果予測
- **経路追跡**: 最終8パターンへの道筋表示
- **易経的根拠**: 各分岐の哲学的意味

### 5. HaQei哲学統合
- **矛盾受容**: 2つの選択肢の両方を理解
- **分人視点**: 各段階での分人の影響
- **動的選択**: 状況変化に応じた経路変更可能性

## 現在のファイル状況分析
**EightScenariosGenerator.js**: 
- 8つの並列シナリオ生成（誤った実装）
- HaQei哲学統合は良好
- 完全なリデザインが必要

**TextToIChingEngine.js**: 確認必要
**FutureBranchingSystem.js**: 確認必要

## 実装計画
1. **Phase 1**: 現在の実装確認と分析
2. **Phase 2**: 二分木型分岐ロジック設計
3. **Phase 3**: 386爻システムとの統合
4. **Phase 4**: UI革新と表示システム
5. **Phase 5**: MCP検証と動作確認

## 緊急度
**最高**: ユーザーが本質的な設計欠陥を指摘
**影響**: Future Simulatorの核心機能
**対応**: 即座の設計変更と実装開始必要