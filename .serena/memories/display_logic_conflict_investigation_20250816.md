# 表示ロジック競合の調査結果

日付: 2025/08/16
ユーザー要求: "表示ロジックの競合の原因を調査してください"

## 🔍 調査結果サマリー

### 1. 問題の現象
- **シナリオカードが表示されない**: 分析は実行されるが、カードが0個
- **eight-scenarios-display-container**: 存在するが子要素が3個のみ（カードなし）
- **Canvas要素**: 4個維持されている（これは成功）

### 2. 競合の原因

#### 根本原因
`binary-tree-complete-display.js`の以下の処理が問題：
- Line 366: `container.innerHTML = result.finalEightPaths.map(...).join('');`
- Line 380: `container.innerHTML = this.generateHTML(result);`

これらのinnerHTML操作により：
1. DOM要素が完全に破壊される
2. SafeDOMUpdaterが復元を試みる
3. しかし、データの受け渡しに失敗

#### データフローの問題
```
分析実行
  ↓
future-simulator-core.js
  ↓
SafeDOMUpdater.updateResultsContainer() ← 呼ばれている
  ↓
binary-tree-complete-display.js ← ここでDOM破壊
  ↓
シナリオカードが作成されない
```

### 3. 詳細な調査結果

#### テスト1: display_logic_conflict.mjs
- SafeDOMUpdater.extractScenarios()は正しく動作（テストデータで1個ずつ抽出成功）
- しかし実際の分析時にはデータが渡されていない

#### テスト2: data_structure_trace.mjs
- localStorage内には`haqei_futureSimulation`キーが存在
- しかしwindow.dataFlowTraceにデータがキャプチャされない
- 関数のインターセプトが効いていない可能性

#### テスト3: card_location_check.mjs
- シナリオカード: 0個（完全に作成されていない）
- eight-scenarios-display-container: 存在するが、カードなし
- resultsContainer: 1個の子要素のみ

### 4. 問題の構造

```
正常な流れ（期待）:
1. 分析実行
2. データ生成（finalEightPaths）
3. SafeDOMUpdaterがデータを受け取る
4. extractScenariosでシナリオ抽出
5. basicScenarioUpdateでカード作成
6. eight-scenarios-display-containerに配置

実際の流れ（問題）:
1. 分析実行
2. データ生成（finalEightPaths）
3. binary-tree-complete-display.jsが先に実行
4. innerHTMLでDOM破壊
5. SafeDOMUpdaterが復元を試みる
6. しかしデータが渡されない/取得できない
7. カードが作成されない
```

### 5. HTMLファイルの構造
`dist/future_simulator.html`のline 1851に：
```html
<div id="eight-scenarios-display-container" class="eight-scenarios-container" ...>
```
が存在することを確認。

## 📝 次のステップ

### 優先度1: データ受け渡しの修正
1. future-simulator-core.jsでSafeDOMUpdaterに渡すデータを確認
2. finalEightPathsをSafeDOMUpdaterで利用可能にする

### 優先度2: DOM操作の順序制御
1. binary-tree-complete-display.jsの実行タイミングを制御
2. またはinnerHTML使用を差分更新に変更

### 優先度3: 統合アプローチ
1. binary-treeが作成したカードを利用
2. SafeDOMUpdaterは保護のみ行う

## 結論

表示ロジックの競合は、**binary-tree-complete-display.jsのinnerHTML使用**と**SafeDOMUpdaterへのデータ未到達**の組み合わせが原因。SafeDOMUpdaterはDOM保護には成功しているが、データがないためカードを作成できない状態。