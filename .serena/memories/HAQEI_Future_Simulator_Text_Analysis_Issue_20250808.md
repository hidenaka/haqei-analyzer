# HAQEI Future Simulator テキスト解析問題
日付: 2025-08-08

## 問題の要約
Future Simulatorでテキスト入力から状況卦と爻が表示されない。
データベース連動していない。

## 根本原因
1. **startAnalysis()メソッドの問題**
   - `future-simulator-core.js`のstartAnalysis()でBinaryTreeFutureEngineを使用
   - ランダムな行番号（1-384）を生成して分析（テキスト解析していない）
   
2. **テキスト解析の欠如**
   ```javascript
   // 現在の問題コード（future-simulator-core.js:262-264）
   const currentLine = Math.floor(Math.random() * 384) + 1;
   const context = { inputText: situation };
   ```

3. **本来必要な処理**
   - テキスト形態素解析 → キーワード抽出
   - キーワードからH384データベース検索
   - 適切な状況卦と爻の決定
   - 結果をBinaryTreeFutureEngineに渡す

## 既存の未使用コンポーネント
- IChingGuidanceEngine
- H384DatabaseConnector  
- KeywordExpansionEngine
- IntegratedAnalysisEngine
これらが読み込まれているが使われていない

## 修正方針
1. テキスト解析システムとH384データベース連携の実装
2. startAnalysis()メソッドを修正してテキスト解析を追加
3. 解析結果の状況卦・爻をBinaryTreeFutureEngineに渡す
4. 結果表示部分の修正