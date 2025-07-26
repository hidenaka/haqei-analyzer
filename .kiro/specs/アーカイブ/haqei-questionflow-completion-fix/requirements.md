# Requirements Document

## Introduction

HaQei 診断システムの QuestionFlow コンポーネントにおいて、質問の完了チェック機能に不具合が発生しています。ユーザーが実際に質問に回答しているにも関わらず、システムが「未完了の質問があります」と誤って判定し、診断を完了できない問題が発生しています。この問題により、ユーザーは診断結果を得ることができず、システムの基本機能が正常に動作しない状態となっています。

## Requirements

### Requirement 1: 質問回答状態の正確な検出

**User Story:** ユーザーとして、質問に回答した後に、システムが正確に回答済み状態を認識してほしい。そうすることで、診断を正常に完了できるようになる。

#### Acceptance Criteria

1. WHEN ユーザーが質問に回答する THEN システムは回答データを正確に保存する SHALL
2. WHEN 回答完了チェックを実行する THEN システムは保存された回答データを正確に検索・照合する SHALL
3. WHEN 回答済みの質問をチェックする THEN システムは「回答なし」として誤判定しない SHALL
4. IF 回答データの保存に失敗した場合 THEN システムは適切なエラーハンドリングを行い、ユーザーに再回答を促す SHALL

### Requirement 2: 回答データの整合性確保

**User Story:** システム管理者として、質問 ID と回答データのマッピングが正確に行われることを確認したい。そうすることで、データの整合性を保ち、診断の信頼性を向上させることができる。

#### Acceptance Criteria

1. WHEN 回答を保存する THEN questionId フィールドが質問の id と正確に一致する SHALL
2. WHEN 複数の回答が存在する THEN 各回答が一意の質問 ID に対応している SHALL
3. WHEN 回答データを検索する THEN find()メソッドが正確にマッチする回答を返す SHALL
4. IF 重複する質問 ID の回答が存在する場合 THEN システムは最新の回答を優先して使用する SHALL

### Requirement 3: シナリオ質問と通常質問の適切な処理

**User Story:** ユーザーとして、シナリオ質問（inner/outer 選択）と通常質問の両方で、回答完了状態が正確に判定されてほしい。そうすることで、どちらのタイプの質問でも診断を正常に完了できるようになる。

#### Acceptance Criteria

1. WHEN シナリオ質問に回答する THEN innerChoice と outerChoice の両方が適切に保存される SHALL
2. WHEN 通常質問に回答する THEN selectedValue が適切に保存される SHALL
3. WHEN シナリオ質問の完了をチェックする THEN innerChoice と outerChoice の両方の存在を確認する SHALL
4. WHEN 通常質問の完了をチェックする THEN selectedValue の存在を確認する SHALL
5. IF シナリオ質問で片方の選択のみが完了している場合 THEN システムは未完了として正確に判定する SHALL

### Requirement 4: デバッグ情報とエラー報告の改善

**User Story:** 開発者として、回答完了チェックの詳細な動作状況を把握したい。そうすることで、問題の原因を迅速に特定し、修正することができる。

#### Acceptance Criteria

1. WHEN 回答完了チェックを実行する THEN 各質問の回答状態を詳細にログ出力する SHALL
2. WHEN 未完了質問が検出される THEN 具体的な未完了理由（回答なし、inner 未回答、outer 未回答等）を明示する SHALL
3. WHEN 回答データの不整合が発見される THEN 詳細なエラー情報をコンソールに出力する SHALL
4. IF デバッグモードが有効な場合 THEN 回答配列と質問配列の詳細な比較情報を提供する SHALL

### Requirement 5: システムの堅牢性向上

**User Story:** ユーザーとして、一時的なデータ保存エラーやブラウザの状態変化があっても、診断を継続できるようにしたい。そうすることで、安定した診断体験を得ることができる。

#### Acceptance Criteria

1. WHEN ストレージからの回答読み込みに失敗する THEN システムは適切なフォールバック処理を実行する SHALL
2. WHEN 回答データが破損している THEN システムは安全にエラーハンドリングを行い、診断を継続可能にする SHALL
3. WHEN ページリロード後に診断を再開する THEN 保存された回答状態が正確に復元される SHALL
4. IF 回答完了チェックで予期しないエラーが発生した場合 THEN システムは診断を強制終了せず、ユーザーに選択肢を提供する SHALL
