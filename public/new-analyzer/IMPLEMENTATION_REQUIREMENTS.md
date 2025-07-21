# 🎯 HaQei Analyzer 実装要件整理

## 📋 現状分析

### ✅ 既に動作している機能
- 設問の読み込み（question flow）
- 設問への回答
- 回答データの保存
- 基本的な3層OS分析
- 結果画面の表示

### ❌ 現在発生している問題
- `HAQEI_DATA` 読み込みエラー
- データファイルのパス不整合
- compatibilityデータが結果画面に反映されない

### 📁 データ構造の現状
```
/public/js/data/          # 元のデータファイル群
├── data_box.js           # HAQEI_DATA
├── questions.js          # WORLDVIEW_QUESTIONS, SCENARIO_QUESTIONS  
├── vectors.js            # H64_8D_VECTORS
├── hexagrams.js
├── hexagram_details.js
├── compatibility_matrix.js
└── compatibility_definition.js

/public/new-analyzer/js/data/compatibility/  # 新しく追加したcompatibilityデータ
├── engine-interface/
│   ├── hexagram_01.json
│   ├── hexagram_02.json
│   └── ... (64個のJSONファイル)
└── engine-safemode/
    ├── hexagram_01.json  
    ├── hexagram_02.json
    └── ... (64個のJSONファイル)
```

## 🎯 実装要件

### 1. データ読み込み修正 🔧
**目的**: 既存の設問〜回答保存機能を維持しながら、データ読み込みエラーを解決

**実装内容**:
- 元の`/public/js/data/`から必要なデータファイルをコピーまたは参照
- `analyzer.html`のスクリプト読み込みパスを修正
- `HAQEI_DATA`, `WORLDVIEW_QUESTIONS`, `SCENARIO_QUESTIONS`, `H64_8D_VECTORS`の読み込みを確保

### 2. Compatibilityデータ統合 📊
**目的**: `/public/new-analyzer/js/data/compatibility/`の詳細データを結果画面で表示

**実装内容**:
- CompatibilityDataLoaderによるJSONファイル読み込み
- 結果画面での詳細相性情報の表示
- engine-interface, engine-safemodeデータの活用

### 3. 結果画面の機能拡張 🎨
**目的**: compatibilityデータを使った高度な分析結果を美しく表示

**実装内容**:
- 詳細相性分析結果の可視化
- JSONデータに基づく具体的なアドバイス表示
- ユーザーフレンドリーな結果プレゼンテーション

## 🚀 実装アプローチ

### Phase 1: データ読み込み修正 
1. 既存データファイルの統合
2. パス修正とエラー解決
3. 基本機能の動作確認

### Phase 2: Compatibility表示機能
1. CompatibilityDataLoaderの完全統合
2. JSONデータの結果画面統合
3. UIコンポーネントの拡張

### Phase 3: 品質保証
1. 設問〜保存機能の回帰テスト
2. 新機能の動作テスト
3. 全体統合テスト

## 🎯 成功基準

### 必須要件
- [x] 既存の設問〜回答保存機能が正常動作
- [ ] データ読み込みエラーの完全解決
- [ ] compatibilityデータが結果画面に表示される
- [ ] ユーザーが追加された詳細情報を確認できる

### 品質要件
- パフォーマンス: 読み込み時間5秒以内
- 安定性: エラー処理とフォールバック完備
- UX: 直感的で理解しやすい結果表示

## 📝 注意事項

### 保持すべき既存機能
- QuestionFlow（設問フロー）
- 回答データの保存機能
- 基本的なTripleOS分析
- ResultsViewの基本表示

### 新規追加機能
- 詳細compatibility分析
- JSONベースの具体的アドバイス
- 高度な相性洞察表示

この要件に基づいて、段階的に実装を進めます。