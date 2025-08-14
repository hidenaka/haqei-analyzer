# safeValidate沈黙フォールバック全廃方針
**HAQEI v4.3.1 品質保証ポリシー**

## 🚨 基本原則：沈黙で握りつぶさない

### 禁止パターン
```javascript
// ❌ 禁止：沈黙フォールバック
function safeValidate(data) {
  try {
    return validate(data);
  } catch (error) {
    return []; // 沈黙で空配列を返す（禁止）
  }
}
```

### 推奨パターン

#### 1. 例外を投げる（最推奨）
```javascript
// ✅ 推奨：例外を投げる
function validateOrThrow(data) {
  try {
    return validate(data);
  } catch (error) {
    throw new ValidationError(`Validation failed: ${error.message}`, {
      originalError: error,
      data: data,
      timestamp: new Date().toISOString()
    });
  }
}
```

#### 2. Result型でUI強制バナー
```javascript
// ✅ 推奨：Result型で明示的エラー処理
function validateWithResult(data) {
  try {
    const result = validate(data);
    return { success: true, data: result };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      displayBanner: true, // UI側で必ずエラー表示
      telemetryEvent: 'validation_failed'
    };
  }
}
```

#### 3. テレメトリ必須警告
```javascript
// ✅ 推奨：テレメトリで必ず記録
function validateWithTelemetry(data) {
  try {
    return validate(data);
  } catch (error) {
    // テレメトリ送信（必須）
    telemetry.error('validation_failed', {
      error: error.message,
      stack: error.stack,
      input: JSON.stringify(data),
      timestamp: Date.now()
    });
    
    // UI警告表示（必須）
    ui.showWarningBanner(`Validation failed: ${error.message}`);
    
    // 例外再投げ
    throw error;
  }
}
```

## 🔧 実装ガイドライン

### 現在の沈黙フォールバック箇所
検出された7箇所の対応方針：

1. **HexagramAnalyzer.js**: `return []` → `throw new HexagramValidationError()`
2. **ContextNormalizer.js**: `return []` → Result型でUI警告
3. **DiversitySelector.js**: `return []` → テレメトリ + 例外

### CI/CD統合
```yaml
# GitHub Actions でのチェック
- name: Check for silent fallbacks
  run: |
    if grep -r "return\s*\[\s*\]" public/js/ --include="*.js" | grep -v test; then
      echo "❌ Silent fallbacks detected"
      exit 1
    fi
```

### ESLint規則追加
```javascript
// .eslintrc.js
rules: {
  'no-silent-fallback': 'error', // カスタム規則
  'prefer-explicit-errors': 'warn'
}
```

## 📊 監視・測定

### テレメトリ指標
- `validation_failure_rate`: 検証失敗率
- `silent_fallback_attempts`: 沈黙フォールバック試行回数（0が目標）
- `error_visibility_rate`: エラー可視化率（100%が目標）

### ダッシュボード監視
- **エラー可視化率**: 全エラーのうち、UIまたはログに表示された割合
- **沈黙失敗検出**: バックグラウンドでの検証失敗をリアルタイム監視
- **ユーザー影響度**: 沈黙エラーによるユーザー体験劣化の測定

## ⚡ 緊急対応手順

### 沈黙フォールバック検出時
1. **即座停止**: 該当機能の無効化
2. **ログ収集**: 過去24時間の関連ログ収集
3. **影響範囲特定**: 影響を受けたユーザー・セッション特定
4. **修正実装**: 明示的エラー処理への変更
5. **テスト**: カナリアテストでの動作確認
6. **デプロイ**: ホットフィックス適用

### エスカレーション条件
- 沈黙フォールバック率 > 0.1%
- ユーザー影響セッション > 100
- 重要機能での沈黙エラー検出

## 📋 チェックリスト

### 開発時
- [ ] 全`try-catch`ブロックで明示的エラー処理
- [ ] 空配列・null返却の正当性確認
- [ ] テレメトリ送信実装
- [ ] UI警告表示実装

### レビュー時
- [ ] 沈黙フォールバックの有無確認
- [ ] エラー処理の適切性確認
- [ ] テスト時エラー再現性確認

### デプロイ時
- [ ] CI/CDでの自動チェック通過
- [ ] カナリアテストでエラー処理確認
- [ ] 監視アラート設定確認

---

**有効日**: 2025-08-14  
**適用範囲**: HAQEI v4.3.1以降  
**責任者**: Claude Code AI Assistant  
**更新頻度**: 四半期ごと見直し