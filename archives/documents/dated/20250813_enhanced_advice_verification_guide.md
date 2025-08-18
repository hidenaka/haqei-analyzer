# 拡張アドバイス機能 動作検証ガイド - 2025年8月13日

## 検証方法

### 方法1: 簡易テストページで確認
1. ブラウザで以下を開く：
   ```
   http://localhost:8788/test-enhanced-advice-simple.html
   ```
2. 以下が表示されれば成功：
   - ✅ 各機能のテスト結果
   - 生成されたアドバイス文（複数段落）
   - 品質メトリクス（一貫性、バランス、カバレッジの%表示）

### 方法2: 実際のos_analyzer.htmlでコンソールテスト
1. ブラウザで開く：
   ```
   http://localhost:8788/os_analyzer.html
   ```

2. 開発者ツールのコンソールを開く（F12 または Cmd+Option+I）

3. `test-console-enhanced-advice.js`の内容をコピーして貼り付け、Enter

4. 以下の結果が表示されれば成功：
   ```
   ✅ TripleOSReportGeneratorクラスが存在
   ✅ インスタンス作成成功
   ✅ getHexagramWisdom関数が存在
   ✅ generatePatternId関数が存在
   ✅ analyzeBalancePattern関数が存在
   ✅ defineGrowthStage関数が存在
   ✅ calculateQualityMetrics関数が存在
   ✅ generateEnhancedAdvice関数が存在
   
   パターンID: 013
   バランスパターン: 外向的リーダー型
   成長段階: 確立期
   品質メトリクス: 一貫性85% バランス72% カバレッジ88%
   
   [拡張アドバイスの長文が表示される]
   ```

### 方法3: 実際の分析フローで確認
1. os_analyzer.htmlで「✨ 仮想人格生成を開始する」をクリック
2. 36問の質問に回答
3. 結果画面で以下を確認：
   - アドバイス文が従来より詳細（5段落以上）
   - 具体的な実践方法が含まれる
   - 成長段階の説明がある
   - 品質指標が表示される（任意）

## 確認ポイント

### 拡張機能の確認項目
- [ ] 512パターンのID生成（3桁の数字）
- [ ] 4つのバランスパターン（外向的リーダー型など）
- [ ] 4つの成長段階（探索期、成長期、確立期、成熟期）
- [ ] 64卦それぞれの知恵データ
- [ ] 品質メトリクス3指標（一貫性、バランス、カバレッジ）
- [ ] 詳細なアドバイス文（観察、強み、成長、実践、注意の5要素）

### エラーが出た場合
JavaScriptエラー「Unexpected token 'if'」が表示される場合：
- 他のJavaScriptファイルに構文エラーがある可能性
- os_analyzer.html内の実装自体は正しい

## 実装箇所
- **ファイル**: `public/os_analyzer.html`
- **行番号**: 8149-8402行
- **主要関数**:
  - `getHexagramWisdom()` - 64卦データベース
  - `generatePatternId()` - 512パターンID生成
  - `analyzeBalancePattern()` - バランス分析
  - `defineGrowthStage()` - 成長段階定義
  - `calculateQualityMetrics()` - 品質メトリクス
  - `generateEnhancedAdvice()` - 拡張アドバイス生成
  - `generateSimpleAdvice()` - 拡張版を呼び出すラッパー