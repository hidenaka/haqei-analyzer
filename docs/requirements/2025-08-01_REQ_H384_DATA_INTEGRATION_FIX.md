# H384_DATA統合問題解決要件書

**作成日**: 2025年8月1日  
**プロジェクト**: HAQEI Analyzer Future Simulator  
**優先度**: 最高（システム動作に必須）  
**担当**: 開発チーム  

## 📋 要件概要

Future Simulatorにおいて、H384H64database.jsは正常に読み込まれるが、`H384_DATA`変数が`undefined`状態となり、386爻システム全体が機能不全に陥っている問題を解決する。

## 🎯 解決すべき問題

### 主要問題: H384_DATA変数未定義
- **現象**: `window.H384_DATA === undefined`
- **影響**: システム全体の初期化失敗
- **症状**: エラーモーダル表示、分析ボタン無効化
- **根本原因**: 変数スコープまたは実行順序の問題

### 副次問題
1. **不明な404エラー**: `/data`リクエストの特定と解決
2. **モーダル阻害**: ユーザーインターフェース使用不可
3. **Claude統合停止**: 4コンポーネント統合システム動作不能

## 🔍 技術要件

### 1. H384_DATA変数管理改善

#### 1.1 変数スコープ確保
**要件**: H384_DATAを確実にグローバルスコープで利用可能にする

**実装方針**:
```javascript
// 方針A: 明示的window オブジェクト代入
window.H384_DATA = H384_DATA;

// 方針B: 即座実行関数での保護
(function() {
    if (typeof H384_DATA !== 'undefined') {
        window.H384_DATA = H384_DATA;
    }
})();

// 方針C: データ検証機能付き設定
window.setH384Data = function(data) {
    if (Array.isArray(data) && data.length === 386) {
        window.H384_DATA = data;
        console.log('✅ H384_DATA正常設定:', data.length);
        return true;
    }
    console.error('❌ H384_DATA設定失敗:', data);
    return false;
};
```

#### 1.2 読み込み順序保証
**要件**: H384H64database.jsが他のスクリプトより先に確実に実行される

**実装方針**:
```html
<!-- 最優先読み込み -->
<script src="./assets/H384H64database.js"></script>
<script>
// 読み込み確認
if (typeof H384_DATA === 'undefined') {
    console.error('H384_DATA読み込み失敗');
    // フォールバック処理
}
</script>
<!-- その他のスクリプト -->
```

#### 1.3 データ整合性検証
**要件**: 386爻データの完全性を保証する

**検証項目**:
- [ ] 総エントリ数: 386
- [ ] 用九エントリ: 通し番号7存在
- [ ] 用六エントリ: 通し番号14存在
- [ ] データ構造: 必須フィールド完備

### 2. エラー処理強化

#### 2.1 404エラー特定・解決
**要件**: `/data`リクエストの発生元を特定し、適切な処理を実装

**実装手順**:
1. ネットワークタブでリクエスト発生タイミング特定
2. 発生元JavaScript特定
3. 適切なエンドポイントまたはエラーハンドリング実装

#### 2.2 フェイルセーフ機能
**要件**: H384_DATA読み込み失敗時の代替動作実装

**実装内容**:
```javascript
// フェイルセーフデータ提供
const FALLBACK_H384_DATA = [
    // 最小限の386爻データ
];

function ensureH384Data() {
    if (!window.H384_DATA || !Array.isArray(window.H384_DATA) || window.H384_DATA.length !== 386) {
        console.warn('H384_DATAフォールバックモード');
        window.H384_DATA = FALLBACK_H384_DATA;
    }
    return window.H384_DATA;
}
```

### 3. 初期化プロセス改善

#### 3.1 段階的初期化
**要件**: データ読み込み→検証→システム初期化の順序保証

**実装フロー**:
```javascript
async function initializeFutureSimulator() {
    // Phase 1: データ読み込み確認
    if (!ensureH384Data()) {
        throw new Error('H384_DATA初期化失敗');
    }
    
    // Phase 2: 386爻システム検証
    validateH384Data(window.H384_DATA);
    
    // Phase 3: Claude統合システム初期化
    initializeClaudeComponents();
    
    // Phase 4: UI有効化
    enableUserInterface();
}
```

#### 3.2 エラー状態管理
**要件**: 初期化失敗時の適切なユーザー通知

**実装内容**:
- モーダル表示改善（具体的エラー内容）
- リトライ機能
- デバッグ情報表示

### 4. テスト要件

#### 4.1 自動検証機能
**要件**: H384_DATA状態を自動検証する機能

**実装内容**:
```javascript
function validateH384DataIntegrity() {
    const tests = {
        exists: typeof window.H384_DATA !== 'undefined',
        isArray: Array.isArray(window.H384_DATA),
        correctLength: window.H384_DATA?.length === 386,
        hasYoukyu: window.H384_DATA?.some(item => item['通し番号'] === 7),
        hasYourikyu: window.H384_DATA?.some(item => item['通し番号'] === 14)
    };
    
    const passed = Object.values(tests).every(test => test);
    console.log('H384_DATA検証結果:', tests, passed ? '✅ 合格' : '❌ 不合格');
    return { tests, passed };
}
```

#### 4.2 統合テスト強化
**要件**: Playwright MCPテストでの完全動作確認

**テストケース**:
- H384_DATA読み込み確認
- 386爻システム動作確認
- ユーザー入力→分析→結果表示の完全フロー
- Claude統合コンポーネント動作確認

## 🚀 実装計画

### Phase 1: 緊急修正（即座実行）
**目標**: H384_DATA基本読み込み問題解決
- [ ] 変数スコープ修正
- [ ] 読み込み順序調整
- [ ] 基本的な動作確認

### Phase 2: 安定化（1-2時間）
**目標**: エラー処理とフェイルセーフ実装
- [ ] 404エラー特定・解決
- [ ] フェイルセーフ機能実装
- [ ] エラー表示改善

### Phase 3: 品質向上（2-3時間）
**目標**: テスト自動化と保守性向上
- [ ] 自動検証機能実装
- [ ] 統合テスト整備
- [ ] ドキュメント更新

## 📊 成功基準

### 必須達成項目
- [ ] `window.H384_DATA`が386エントリで定義される
- [ ] 用九・用六エントリが正常認識される
- [ ] エラーモーダルが表示されない
- [ ] 分析ボタンが有効化される
- [ ] ユーザー入力→分析実行が正常動作する

### 品質向上項目
- [ ] 404エラーが発生しない
- [ ] 初期化時間が3秒以内
- [ ] Claude統合コンポーネント全て動作
- [ ] Playwrightテストが100%成功
- [ ] 自動検証機能が正常動作

### パフォーマンス基準
- [ ] ページ読み込み時間: 2秒以内
- [ ] 初期化完了時間: 3秒以内
- [ ] 分析実行時間: 5秒以内
- [ ] メモリ使用量: 50MB以内

## 🔧 技術制約

### 必須保持事項
- [ ] 既存の386爻データ構造維持
- [ ] bunenjin哲学との整合性
- [ ] Triple OSアーキテクチャとの互換性
- [ ] Claude統合コンポーネントとの整合性

### 実装制約
- [ ] 外部APIへの依存禁止（ゼロコスト維持）
- [ ] 既存の統合テストとの互換性
- [ ] ブラウザ互換性（Chrome, Safari, Firefox）
- [ ] モバイルデバイス対応

## 📋 検証手順

### 開発中検証
1. **単体テスト**: `test-h384-data.html`での確認
2. **統合テスト**: `debug-future-simulator.cjs`での確認
3. **手動テスト**: ブラウザでの実際の動作確認

### 完了時検証
1. **Playwrightテスト**: 全テストケース成功
2. **ストレステスト**: 連続実行での安定性確認
3. **クロスブラウザテスト**: 主要ブラウザでの動作確認

## 🎯 期待される効果

### 即座効果
- Future Simulator完全復旧
- 386爻システム正常動作
- ユーザー体験向上

### 中長期効果
- システム安定性向上
- 保守性改善
- 新機能開発基盤整備

## 📝 リスク要因

### 技術リスク
- **変数競合**: 他のスクリプトとの変数名衝突
- **実行順序**: 非同期読み込みによる不確定性
- **ブラウザ差異**: 異なるJavaScriptエンジンでの挙動差

### 対策
- 明示的な変数スコープ管理
- 読み込み順序の厳密制御
- クロスブラウザテストの徹底

## 🏁 完了判定

**Definition of Done**:
1. H384_DATA が386エントリで正常定義される
2. Future Simulator が完全に動作する
3. 全ての自動テストが成功する
4. エラーやワーニングが発生しない
5. パフォーマンス基準を満たす

---

**作成者**: Claude Code (Sonnet 4)  
**レビュー**: 必要  
**承認**: 必要  
**実装予定**: 即座開始