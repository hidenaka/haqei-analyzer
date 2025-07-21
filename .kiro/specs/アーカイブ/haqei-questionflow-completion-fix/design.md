# Design Document

## Overview

HaQei 診断システムの QuestionFlow コンポーネントにおける質問完了チェック機能の不具合を修正するための設計書です。現在、ユーザーが質問に回答しているにも関わらず、システムが「未完了の質問があります」と誤判定する問題が発生しています。

この設計では、回答データの保存・検索ロジックの改善、データ整合性の確保、デバッグ機能の強化を通じて、正確な質問完了判定を実現するシステムを構築します。

## Architecture

### 現在のアーキテクチャの問題点

1. **回答データの不整合**: questionId と質問の id のマッピングに問題がある可能性
2. **検索ロジックの脆弱性**: find()メソッドによる回答検索が正確に動作していない
3. **エラーハンドリングの不足**: データ不整合時の適切な処理が不十分
4. **デバッグ情報の不足**: 問題の原因特定が困難

### 改善後のアーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                    QuestionFlow                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │ Answer Storage  │  │ Completion      │  │ Debug &         ││
│  │ Manager         │  │ Validator       │  │ Error Handler   ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    StorageManager                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │ Answer          │  │ Data Integrity  │  │ Recovery        ││
│  │ Persistence     │  │ Validation      │  │ Mechanism       ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Answer Storage Manager

#### 強化された saveAnswer()メソッド

```javascript
saveAnswer(questionId, selectedValue, scoringTags, choiceType = null) {
  // データ整合性チェック
  if (!questionId || !selectedValue) {
    throw new Error('Invalid answer data: questionId and selectedValue are required');
  }

  // 既存回答の検索（重複チェック）
  let answerIndex = this.answers.findIndex(a => a.questionId === questionId);

  if (answerIndex === -1) {
    // 新規回答の作成
    answerIndex = this.answers.length;
    this.answers.push({
      questionId: questionId,
      timestamp: new Date().toISOString()
    });
  }

  // 回答データの更新
  const answer = this.answers[answerIndex];
  this.updateAnswerData(answer, selectedValue, scoringTags, choiceType);

  // データ整合性の検証
  this.validateAnswerData(answer);

  // ストレージへの保存
  this.persistAnswers();

  // デバッグログ出力
  this.logAnswerSaved(questionId, answer);
}
```

#### 新規メソッド: validateAnswerData()

```javascript
validateAnswerData(answer) {
  if (!answer.questionId) {
    throw new Error('Answer missing questionId');
  }

  // シナリオ質問の検証
  if (this.isScenarioQuestion(answer.questionId)) {
    if (!answer.innerChoice || !answer.outerChoice) {
      console.warn(`⚠️ Incomplete scenario answer for ${answer.questionId}`);
    }
  } else {
    // 通常質問の検証
    if (!answer.selectedValue) {
      console.warn(`⚠️ Missing selectedValue for ${answer.questionId}`);
    }
  }
}
```

### 2. Completion Validator

#### 強化された checkAllQuestionsAnswered()メソッド

```javascript
checkAllQuestionsAnswered() {
  const missing = [];
  const debugInfo = {
    totalQuestions: this.questions.length,
    totalAnswers: this.answers.length,
    questionIds: this.questions.map(q => q.id),
    answerIds: this.answers.map(a => a.questionId),
    missingDetails: []
  };

  for (let i = 0; i < this.questions.length; i++) {
    const question = this.questions[i];
    const answer = this.findAnswerByQuestionId(question.id);

    const validationResult = this.validateQuestionCompletion(question, answer);

    if (!validationResult.isComplete) {
      missing.push(validationResult.reason);
      debugInfo.missingDetails.push({
        questionId: question.id,
        reason: validationResult.reason,
        answerFound: !!answer,
        answerData: answer ? this.sanitizeAnswerForDebug(answer) : null
      });
    }
  }

  // デバッグ情報の出力
  if (missing.length > 0) {
    this.logCompletionDebugInfo(debugInfo);
  }

  return {
    isComplete: missing.length === 0,
    missing: missing,
    debugInfo: debugInfo
  };
}
```

#### 新規メソッド: findAnswerByQuestionId()

```javascript
findAnswerByQuestionId(questionId) {
  // より堅牢な検索ロジック
  const answer = this.answers.find(a => {
    // 厳密な一致チェック
    if (a.questionId === questionId) return true;

    // 型変換による一致チェック（文字列 vs 数値等）
    if (String(a.questionId) === String(questionId)) return true;

    return false;
  });

  if (!answer) {
    console.warn(`⚠️ No answer found for question ${questionId}`);
    console.warn('Available answer IDs:', this.answers.map(a => a.questionId));
  }

  return answer;
}
```

#### 新規メソッド: validateQuestionCompletion()

```javascript
validateQuestionCompletion(question, answer) {
  if (!answer) {
    return {
      isComplete: false,
      reason: `${question.id}: 回答なし`
    };
  }

  // シナリオ質問の場合
  const isScenario = question.scenario && question.inner_q && question.outer_q;
  if (isScenario) {
    if (!answer.innerChoice) {
      return {
        isComplete: false,
        reason: `${question.id}: 内面選択肢未回答`
      };
    }
    if (!answer.outerChoice) {
      return {
        isComplete: false,
        reason: `${question.id}: 外面選択肢未回答`
      };
    }
  } else {
    // 通常質問の場合
    if (!answer.selectedValue) {
      return {
        isComplete: false,
        reason: `${question.id}: 選択肢未回答`
      };
    }
  }

  return {
    isComplete: true,
    reason: null
  };
}
```

### 3. Debug & Error Handler

#### 新規メソッド: logCompletionDebugInfo()

```javascript
logCompletionDebugInfo(debugInfo) {
  console.group('🔍 Question Completion Debug Info');
  console.log('📊 Summary:', {
    totalQuestions: debugInfo.totalQuestions,
    totalAnswers: debugInfo.totalAnswers,
    missingCount: debugInfo.missingDetails.length
  });

  console.log('📝 Question IDs:', debugInfo.questionIds);
  console.log('💾 Answer IDs:', debugInfo.answerIds);

  if (debugInfo.missingDetails.length > 0) {
    console.group('❌ Missing Details');
    debugInfo.missingDetails.forEach(detail => {
      console.log(`${detail.questionId}:`, detail);
    });
    console.groupEnd();
  }

  console.groupEnd();
}
```

#### 新規メソッド: performDataIntegrityCheck()

```javascript
performDataIntegrityCheck() {
  const issues = [];

  // 重複回答のチェック
  const answerIds = this.answers.map(a => a.questionId);
  const duplicates = answerIds.filter((id, index) => answerIds.indexOf(id) !== index);
  if (duplicates.length > 0) {
    issues.push(`Duplicate answers found: ${duplicates.join(', ')}`);
  }

  // 孤立回答のチェック（対応する質問が存在しない回答）
  const questionIds = this.questions.map(q => q.id);
  const orphanAnswers = this.answers.filter(a => !questionIds.includes(a.questionId));
  if (orphanAnswers.length > 0) {
    issues.push(`Orphan answers found: ${orphanAnswers.map(a => a.questionId).join(', ')}`);
  }

  // 不完全なシナリオ回答のチェック
  const incompleteScenarios = this.answers.filter(a => {
    const question = this.questions.find(q => q.id === a.questionId);
    if (question && question.scenario) {
      return !a.innerChoice || !a.outerChoice;
    }
    return false;
  });

  if (incompleteScenarios.length > 0) {
    issues.push(`Incomplete scenario answers: ${incompleteScenarios.map(a => a.questionId).join(', ')}`);
  }

  return {
    hasIssues: issues.length > 0,
    issues: issues
  };
}
```

## Data Models

### Enhanced Answer Model

```javascript
{
  questionId: string,              // 質問ID（厳密な型チェック）
  timestamp: string,               // 回答時刻（ISO形式）

  // 通常質問用
  selectedValue?: string,          // 選択された値
  scoring_tags?: Array,            // スコアリングタグ

  // シナリオ質問用
  innerChoice?: {
    value: string,
    scoring_tags: Array
  },
  outerChoice?: {
    value: string,
    scoring_tags: Array
  },

  // メタデータ
  metadata?: {
    userAgent: string,
    sessionId: string,
    version: string
  }
}
```

### Completion Check Result

```javascript
{
  isComplete: boolean,             // 完了状態
  missing: Array<string>,          // 未完了項目リスト
  debugInfo: {
    totalQuestions: number,
    totalAnswers: number,
    questionIds: Array<string>,
    answerIds: Array<string>,
    missingDetails: Array<{
      questionId: string,
      reason: string,
      answerFound: boolean,
      answerData: object | null
    }>
  }
}
```

## Error Handling

### 1. 回答保存エラー

**発生条件**: 無効なデータでの回答保存試行
**処理方法**:

- データ検証の実行
- エラーメッセージの表示
- 再入力の促進
- ログ出力

### 2. 回答検索エラー

**発生条件**: 回答データの検索・照合失敗
**処理方法**:

- 複数の検索方法の試行
- データ整合性チェックの実行
- デバッグ情報の出力
- フォールバック処理

### 3. データ整合性エラー

**発生条件**: 重複回答、孤立回答等の検出
**処理方法**:

- 自動修復の試行
- ユーザーへの状況説明
- 手動修正オプションの提供
- データバックアップの作成

## Testing Strategy

### 1. 単体テスト

#### Answer Storage Manager

- 正常系: 有効なデータでの回答保存
- 異常系: 無効なデータでのエラーハンドリング
- 境界値: 重複回答の処理

#### Completion Validator

- 正常系: 完了済み質問の正確な判定
- 異常系: 未完了質問の正確な検出
- 特殊ケース: シナリオ質問の部分完了

### 2. 統合テスト

#### 回答フロー全体テスト

```javascript
// 通常質問の回答・完了チェック
const questionId = "q1";
questionFlow.saveAnswer(questionId, "A", scoringTags);
const result = questionFlow.checkAllQuestionsAnswered();
assert(!result.missing.includes(`${questionId}: 回答なし`));
```

#### シナリオ質問テスト

```javascript
// シナリオ質問の両方選択・完了チェック
const scenarioId = "s1";
questionFlow.saveAnswer(scenarioId, "A", innerTags, "inner");
questionFlow.saveAnswer(scenarioId, "B", outerTags, "outer");
const result = questionFlow.checkAllQuestionsAnswered();
assert(!result.missing.some((m) => m.includes(scenarioId)));
```

### 3. データ整合性テスト

#### 重複回答テスト

```javascript
// 重複回答の適切な処理確認
questionFlow.saveAnswer("q1", "A", tags1);
questionFlow.saveAnswer("q1", "B", tags2); // 上書き
const integrity = questionFlow.performDataIntegrityCheck();
assert(!integrity.hasIssues);
```

### 4. エラーハンドリングテスト

#### 不正データテスト

```javascript
// 不正データでのエラーハンドリング確認
try {
  questionFlow.saveAnswer(null, "A", tags);
  assert.fail("Should throw error");
} catch (error) {
  assert(error.message.includes("Invalid answer data"));
}
```

## Implementation Considerations

### 1. 後方互換性

- 既存の回答データ形式との互換性維持
- 段階的な移行による影響最小化
- 旧バージョンからのデータ移行サポート

### 2. パフォーマンス

- 大量の回答データでの検索最適化
- 不要な処理の削減
- キャッシュ機能の活用

### 3. ユーザビリティ

- エラー発生時の分かりやすいメッセージ
- 回復可能なエラーでの自動修復
- 進行状況の可視化

### 4. 保守性

- デバッグ情報の充実
- ログ出力の標準化
- テストカバレッジの確保
