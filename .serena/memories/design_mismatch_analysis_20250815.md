# 設計不整合分析

日付: 2025/08/15
ユーザー要求: "実際の表示の設計と今変わろうとしている設計のチグハグになっているところを確認してください。"

## 🔍 発見された不整合

### 1. **表示関数の存在状態**
- `displayAuthentic386Results`: 存在するが、window.haqeiFutureSimulatorには未登録
- `displayBinaryTreeResults`: 同上
- 実際はfuture-simulator-core.js内に定義されている

### 2. **DOM管理システムの競合**
```
現状:
- SingleDOMManager ✅ (新規追加)
- SafeDOMUpdater ❌ (参照されるが存在しない)
- DOMPreserver ❌ (削除済み？)
- FutureSimulatorDOMIntegration ❌ (削除済み？)
```

### 3. **コンテナ構造の不一致**

#### 元の設計（実際に存在）:
- `#resultsContainer` ✅
- `#eight-scenarios-display-container` ✅
- Canvas要素 4個 ✅

#### SingleDOMManagerが期待する構造（存在しない）:
- `#scenarios-cards` ❌
- `#canvas-container` ❌

### 4. **実行フローの問題**

```javascript
// future-simulator-core.js:454
if (window.SafeDOMUpdater) {  // 存在しない
    // 使われない
}
// フォールバック:484
tempContainer.innerHTML = ... // ここでinnerHTML使用！
```

## 🚨 根本的な問題

1. **SingleDOMManagerが機能していない**
   - `window.haqeiFutureSimulator.displayAuthentic386Results`が未定義
   - オーバーライドが効いていない

2. **SafeDOMUpdaterへの依存**
   - future-simulator-core.jsがSafeDOMUpdaterを期待
   - しかし実際には存在しない
   - 結果、innerHTMLフォールバックが実行される

3. **要素IDの不一致**
   - SingleDOMManagerは新しいID体系を使用
   - HTMLは元のID体系のまま
   - 結果、要素が見つからない

## 📝 解決策

### Option 1: 元の設計に合わせる（推奨）
1. SingleDOMManagerを元のコンテナIDで動作するよう修正
2. `eight-scenarios-display-container`を使用
3. 既存のCanvas IDを維持

### Option 2: SafeDOMUpdaterを復活
1. SafeDOMUpdaterを再実装
2. future-simulator-core.jsの期待に応える

### Option 3: 完全な統合
1. window.haqeiFutureSimulatorを正しく初期化
2. SingleDOMManagerのオーバーライドを確実に適用
3. innerHTML使用箇所を完全に排除

## 結論

実際の表示設計（元の設計）と変更中の設計（SingleDOMManager）が以下の点でチグハグ：

1. **要素ID体系が異なる**
2. **必要なDOM管理システムが存在しない**
3. **関数のオーバーライドが効いていない**
4. **結果としてinnerHTMLが使われ続けている**

これらの不整合を解消することが必要。