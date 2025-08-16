# Canvas要素0個問題 - 外部専門家向け技術調査報告書

**日付**: 2025年8月14日  
**システム**: HaQei 易経未来分析システム v4.3.1  
**問題**: Canvas要素が0個と表示される現象の根本原因調査  
**調査手法**: Playwright自動化テスト + リアルタイムDOM監視  

---

## 🎯 問題の概要

**現象**: Chart.js (3.9.1)を使用したCanvas要素によるスコアグラフが表示されない  
**ユーザー影響**: 8つのシナリオ分析結果の視覚的比較ができない  
**技術的検出**: `document.querySelectorAll('canvas').length === 0`  

---

## 🔍 調査手法・環境

### 技術スタック
- **フロントエンド**: Vanilla JavaScript + Chart.js 3.9.1
- **DOM操作**: innerHTML, appendChild, createElement  
- **アーキテクチャ**: SPA (Single Page Application)
- **テスト環境**: Playwright (Chromium) + localhost:8788

### 調査手法
1. リアルタイムDOM監視 (createElement, appendChild, innerHTML監視)
2. Canvas操作ライフサイクル追跡
3. Chart.js初期化プロセス検証
4. エラーログ包括収集

---

## 📊 調査結果 - 決定的証拠

### Phase 1: 初期化状況 ✅
```javascript
{
  "libraries": {
    "chartJs": { "loaded": true, "version": "3.9.1" },
    "scoreVisualization": { "loaded": true },
    "eightScenarios": { "loaded": true }
  },
  "dom": {
    "containerExists": true,
    "canvasCount": 4,  // ← 正常に4個のCanvas要素作成済み
    "readyState": "complete"
  }
}
```

### Phase 2: DOM操作追跡 ⚠️
**重要ログ（タイムスタンプ付き）**:
```
[LOG] ✅ Canvas created and appended: canvas#three-stage-canvas-xxx
[LOG] 📊 Chart containers initialized  
[LOG] 📊 Chart.js available
[LOG] 🗑️ innerHTML change removed Canvas elements from {elementId: resultsContainer}  ← 🚨 決定的証拠
```

### Phase 3: 最終状態 ❌
```javascript
{
  "finalDomState": {
    "canvasCount": 0,  // ← Canvas要素が完全消失
    "containerState": {
      "exists": false  // ← Container要素も消失
    }
  },
  "chartJsTest": {
    "canCreate": true,  // ← Chart.js自体は正常動作
    "error": null
  }
}
```

---

## 🎯 根本原因の特定

### **結論**: DOM操作による意図しないCanvas要素削除

**問題の流れ**:
1. ✅ **Canvas要素正常作成** - 4個のCanvas要素が`resultsContainer`内に生成
2. ✅ **Chart.js正常初期化** - Chart.js 3.9.1が正常に読み込まれ、動作可能
3. ❌ **DOM更新処理** - 分析結果表示時に`resultsContainer.innerHTML = newContent`実行
4. ❌ **Canvas要素削除** - innerHTML更新により既存のCanvas要素が破棄
5. ❌ **Container消失** - `eight-scenarios-display-container`も削除対象に

### 技術的メカニズム

```javascript
// 問題のコードパターン（推定）
resultsContainer.innerHTML = `
  <div class="new-analysis-results">
    ${analysisResults}
  </div>
`;
// ↑ この時点で既存のCanvas要素とイベントリスナーが全て破棄される
```

---

## 🔧 推奨される解決策

### 【優先度1】DOM更新方法の変更

**現在の問題のあるパターン**:
```javascript
// ❌ 既存要素を全て破棄
container.innerHTML = newContent;
```

**推奨される修正**:
```javascript
// ✅ 既存Canvas要素を保持した更新
const existingCanvas = container.querySelectorAll('canvas');
const tempContainer = document.createElement('div');
tempContainer.innerHTML = newContent;

// Canvas要素を新しいコンテンツに再配置
existingCanvas.forEach(canvas => {
  const targetContainer = tempContainer.querySelector('#eight-scenarios-display-container .score-visualization-container');
  if (targetContainer) {
    targetContainer.appendChild(canvas);
  }
});

container.replaceWith(tempContainer);
```

### 【優先度2】Canvas生成タイミングの最適化

```javascript
// 分析完了後にCanvas要素を生成する方式に変更
function displayAnalysisResults(results) {
  // 1. DOM構造を先に構築
  updateDOMStructure(results);
  
  // 2. Canvas要素とChart.jsを初期化
  initializeCanvasElements();
  
  // 3. データを描画
  renderCharts(results);
}
```

### 【優先度3】エラーハンドリング強化

```javascript
// Canvas要素の存在確認と自動復旧
function ensureCanvasElements() {
  const container = document.getElementById('eight-scenarios-display-container');
  if (!container) {
    console.warn('Container missing, recreating...');
    createCanvasContainer();
  }
  
  const canvasCount = document.querySelectorAll('canvas').length;
  if (canvasCount === 0) {
    console.warn('Canvas elements missing, regenerating...');
    initializeCanvasElements();
  }
}
```

---

## 📋 外部専門家への質問事項

### 技術的検証依頼

1. **DOM操作ベストプラクティス**:
   - innerHTML vs appendChild vs replaceChild の使い分け
   - Chart.js + SPA環境でのCanvas要素管理手法
   - DOM更新時のイベントリスナー保持方法

2. **Chart.js専門的知見**:
   - Chart.js 3.9.1でのCanvas要素ライフサイクル管理
   - 動的DOM更新環境でのChart.jsインスタンス管理
   - Canvas要素削除時のメモリリーク防止手法

3. **パフォーマンス最適化**:
   - 大量のDOM操作（26個のシナリオカード + Canvas）の最適化
   - CSP (Content Security Policy) エラー13件の影響評価
   - レンダリング性能の改善提案

### 設計レビュー依頼

4. **アーキテクチャレビュー**:
   - SPA環境でのCanvas要素管理アーキテクチャ
   - 状態管理とDOM同期の設計パターン
   - エラー耐性のあるUI更新フロー

5. **代替案検討**:
   - Chart.js以外のライブラリ（D3.js、ApexCharts等）の適用性
   - SVG vs Canvas のトレードオフ評価
   - Web Components化による独立性確保

---

## 📁 提供資料

1. **`comprehensive-canvas-investigation.mjs`** - 包括的調査スクリプト
2. **`20250814_canvas_root_cause_investigation.json`** - 詳細調査データ  
3. **ソースコード** - 該当するJavaScriptファイル群
4. **再現環境** - localhost:8788での再現手順書

---

## 🎯 期待する専門家のフィードバック

1. **根本原因分析の妥当性確認**
2. **推奨解決策の技術的検証**  
3. **代替アプローチの提案**
4. **長期的な改善提案**
5. **類似問題の予防策**

---

**連絡先**: [プロジェクト担当者]  
**緊急度**: 高（ユーザー体験に直接影響）  
**技術負債レベル**: 中（設計改善必要）