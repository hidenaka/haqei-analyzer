# 質問データ移行ガイド

## 概要
このドキュメントは、レガシーシステムの`questions.js`からTypeScript版への移行手順を説明します。

## 完了した作業

### 1. TypeScript型定義の作成
- `src/data/types.ts` - 全ての型定義
  - `Question`, `QuestionOption`, `ScoringTag`インターフェース
  - `ScenarioQuestion`拡張インターフェース
  - `DimensionKey`, `KouiLevel`型定義
  - 8次元定数の定義

### 2. 基本構造の実装
- `src/data/questions.ts` - メイン質問データファイル
  - 価値観設問（q1-q6）の実装例
  - シナリオ設問（q25）の実装例
  - ヘルパー関数とエクスポート

### 3. 移行支援ツールの作成
- `src/utils/questionsMigration.ts` - 移行ユーティリティ
  - レガシーデータの変換関数
  - データ検証機能
  - スコア計算関数

### 4. 移行テンプレートの準備
- `src/data/questionsComplete.ts` - 完全データのテンプレート
  - 追加質問データの構造
  - データ統合ヘルパー

## 残りの作業

### 1. 質問データの完全移行
```bash
# レガシーファイルの場所
/Users/hideakimacbookair/Desktop/haqei-analyzer/public/js/shared/data/questions.js

# 移行対象
- q7-q24: 価値観設問の残り
- q26-q30: シナリオ設問の残り
```

### 2. データ検証の実施
```typescript
import { validateQuestions } from '@/utils/questionsMigration'
import { ALL_QUESTIONS } from '@/data/questions'

const validation = validateQuestions(ALL_QUESTIONS)
console.log('検証結果:', validation)
```

### 3. レガシーデータとの互換性確保
- localStorageキーの維持
- データ構造の後方互換性
- 既存の分析結果との整合性

## 移行手順

### ステップ1: 残りの質問データをコピー
1. `questions.js`からq7-q24をコピー
2. TypeScript形式に変換
3. `questions.ts`の`WORLDVIEW_QUESTIONS`配列に追加

### ステップ2: シナリオ設問の移行
1. q26-q30のシナリオ設問をコピー
2. `ScenarioQuestion`型に適合するよう変換
3. inner/outerの選択肢を適切に構造化

### ステップ3: データ検証
```bash
npm run test:unit -- src/data/__tests__/questions.spec.ts
```

### ステップ4: 統合テスト
- QuestionFlowコンポーネントでの動作確認
- 既存データとの互換性テスト
- パフォーマンステスト

## 注意事項

### 型安全性の確保
- 全てのscoringTagsにkey/valueが必須
- typeフィールドは'conflicting'か'complementary'のみ
- koui_levelは1-6の数値のみ

### データ整合性
- 質問IDの重複チェック
- 8次元キーの正確性
- スコアリング値の妥当性（通常-3.0〜3.0）

### パフォーマンス考慮
- 大きなデータセットのため、必要に応じて遅延読み込み検討
- インデックス化による高速アクセス
- メモ化による再計算の削減

## 移行後の確認項目

- [ ] 全30問が正しく移行されている
- [ ] TypeScript型チェックがパスする
- [ ] データ検証で エラーがない
- [ ] 既存のlocalStorageデータが読み込める
- [ ] 分析計算が正しく動作する
- [ ] UIコンポーネントで正しく表示される

## 参考リンク
- レガシーシステムドキュメント: `/docs/development/data_schema.md`
- 8次元システム説明: `/docs/implementation/`
- TypeScriptベストプラクティス: [公式ドキュメント](https://www.typescriptlang.org/docs/)