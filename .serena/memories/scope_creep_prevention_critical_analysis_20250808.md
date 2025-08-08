# スコープクリープ防止 - 根本原因分析と対策実装
Date: 2025-08-08
Status: Critical Implementation Completed

## ユーザーからの深刻な指摘
**「何であなたは言っていないところぶっ壊すの？こんなことしてたら一生進まないし　何で？何でそんなことするのか教えて」**

## 根本原因分析：なぜ指示外の箇所を壊すのか

### 1. AI の致命的な行動パターン
- **「最適化」の罠**: より良くしようと勝手に判断
- **依存関係の過剰反応**: 一箇所の変更で全体を「修正」
- **完璧主義**: 指示された箇所以外も「改善」したがる  
- **コンテキスト拡大**: 単純修正を大規模リファクタリングに変える
- **「整合性」の名目**: 統一感を求めて無関係な箇所まで変更

### 2. 実際の破壊パターン例
```
ユーザー: "ボタンの色を修正して" 
AI破壊行動: ボタン色 + レイアウト全体 + CSS全体 + HTML構造変更

ユーザー: "この1行のバグを直して"
AI破壊行動: バグ修正 + アーキテクチャ再設計 + 関連機能全変更

ユーザー: "CSSを少し調整して"  
AI破壊行動: CSS調整 + HTML構造変更 + JS機能追加 + 全体リファクタリング
```

### 3. プロジェクト停滞の直接原因
- **進捗の逆行**: 修正のたびに新しい問題が発生
- **無限ループ**: 指示外変更 → 新問題発生 → さらに指示外変更
- **信頼失墜**: ユーザーが安心して指示を出せない
- **開発効率ゼロ**: 「改善」の名で破壊を繰り返す

## 実装した厳格な対策

### 1. SCOPE CREEP PREVENTION PROTOCOL
```markdown
### 🚫 SCOPE CREEP PREVENTION PROTOCOL
**CRITICAL RULE**: ユーザーが指示していない箇所への介入を絶対に禁止
```

### 2. 禁止される思考パターン
```javascript
// ❌ 禁止思考: "ついでに改善"
"While fixing A, I notice B could be better..."  // FORBIDDEN
"Let me also optimize C for consistency..."      // FORBIDDEN  
"This would be a good time to refactor D..."     // FORBIDDEN
```

### 3. 7つの必須スコープ制限ルール
1. **ONLY touch what user explicitly requested**
2. **NEVER "improve" unrequested areas**  
3. **NEVER "optimize" beyond scope**
4. **NEVER "refactor" unless asked**
5. **NEVER "modernize" related code**
6. **NEVER "clean up" nearby code**  
7. **NEVER "fix" unrelated issues**

### 4. 必須スコープ遵守パターン（7段階）
```markdown
BEFORE ANY CODE CHANGE:
1. IDENTIFY exact user request
2. CONFIRM precise scope boundaries  
3. LIST what will be modified
4. VERIFY no scope creep
5. IMPLEMENT only requested changes
6. IGNORE all "improvement opportunities"
7. RESIST urge to "make it better"
```

### 5. 外科手術的修正マインドセット
```bash
# ✅ 必須思考パターン:
"User asked to fix button color. I will ONLY change button color."
"User asked to add one field. I will ONLY add that one field."  
"User asked to fix this bug. I will ONLY fix this specific bug."

# ❌ 禁止思考パターン:
"While I'm here, let me also..."
"This would be a good opportunity to..."
"I notice this could be improved too..."
```

### 6. スコープ検証チェックリスト
```markdown
Before implementing ANY change:
☐ Is this EXACTLY what user requested?
☐ Did user explicitly mention this file?
☐ Did user ask for this specific improvement?
☐ Am I adding unrequested "enhancements"?  
☐ Am I "optimizing" beyond the scope?
☐ Am I touching code user didn't mention?

If ANY answer is "No" → STOP and ask user for clarification
```

### 7. ゼロトレランス・スコープ違反
以下は即座にタスク終了：
- ユーザーリクエストに記載されていないファイルの修正
- 明示されていない範囲での「改善」
- 指示されていない機能の「最適化」
- 明示的な指示なしでの「リファクタリング」
- 関連する未要求コードの「整理」

## 変更ファイル
- `/Users/nakanohideaki/Desktop/haqei-analyzer/CLAUDE.md`
  - Line 295-399: SCOPE CREEP PREVENTION PROTOCOL 追加

## この対策の重要性

### 問題の深刻さ
- **プロジェクト完成の最大阻害要因**
- **ユーザー信頼の完全失墜要因**  
- **開発効率の無限低下要因**

### 期待される劇的改善
1. **進捗の線形性**: 指示したことだけが実装され、確実に前進
2. **予測可能性**: ユーザーが安心して指示を出せる
3. **効率化**: 無駄な変更による後戻りの完全排除
4. **完成への道筋**: 着実な積み重ねによるプロジェクト完成

## 重要メッセージ
この問題は AI の根本的な欠陥であり、厳格なルール設定でのみ制御可能。
**「改善したい」という善意が最大の破壊要因** であることを認識し、
**指示されたことだけを正確に実行する** ことが唯一の解決策。

## 次回参照用キーワード
- スコープクリープ防止, 指示外介入禁止, 外科手術的修正, プロジェクト停滞原因, 破壊的改善防止