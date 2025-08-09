# ProbabilisticSituationModeler 依存関係マッピング報告書

作成日: 2025年08月05日  
作成者: HAQEI CTO Agent  
状態: 完了

## 1. エグゼクティブサマリー

ProbabilisticSituationModelerの完全な依存関係分析を実施した結果、以下を確認：
- **直接参照箇所**: 4ファイル
- **影響範囲**: 限定的（すでに未使用状態）
- **削除リスク**: 低

## 2. 依存関係詳細マッピング

### 2.1 モジュール本体
```
ファイル: /public/js/pages/future-simulator/ProbabilisticSituationModeler.js
行数: 941行
状態: スタンドアロンモジュール
エクスポート: window.ProbabilisticSituationModeler
```

### 2.2 直接参照箇所

#### 2.2.1 テストシステム
**ファイル**: `/tests/integrated-test-system.js`
- **行53**: モジュール名リスト内
- **行130**: テスト実行関数呼び出し
- **行724-776**: 単体テストメソッド実装
- **状態**: テスト専用、本番システムに影響なし

#### 2.2.2 SituationalHexagramTester
**ファイル**: `/public/js/pages/future-simulator/SituationalHexagramTester.js`
- **行51**: エンジンプロパティ定義
- **行150-153**: 条件付き初期化
- **行222-225**: 条件付き実行
- **行440-447**: 実行メソッド
- **行658**: バージョン情報
- **状態**: オプション機能として実装、デフォルト無効

### 2.3 HTMLファイルからの読み込み
**状態**: なし
- `future_simulator.html`でスクリプトタグなし
- 他のHTMLファイルでも参照なし

## 3. 現在の統合状態

### 3.1 future_simulator.html
```javascript
// 行1204-1297: generateScenarios()
// すでに削除済み、deprecation警告のみ
generateScenarios() {
  console.warn('⚠️ generateScenarios() is deprecated. Use authentic I Ching system in displayResults()');
  return [];
}
```

### 3.2 実質的な利用状況
- **本番環境**: 未使用
- **テスト環境**: 単体テストのみ
- **開発環境**: SituationalHexagramTesterでオプション

## 4. 削除影響分析

### 4.1 影響なし
- future_simulator.html（すでに正統易経システムに移行済み）
- Authentic8ScenariosSystem.js（独立動作）
- 本番ユーザー体験

### 4.2 軽微な修正必要
1. **integrated-test-system.js**
   - テストケース削除またはスキップ設定
   
2. **SituationalHexagramTester.js**
   - probabilisticModeler関連コードの削除
   - バージョン情報の更新

## 5. 削除推奨事項

### 5.1 削除順序
1. テストシステムからの参照削除
2. SituationalHexagramTesterからの参照削除
3. モジュール本体の削除

### 5.2 削除後の確認事項
- [ ] future_simulatorの動作確認
- [ ] テストスイートの実行
- [ ] SituationalHexagramTesterの動作確認（オプション）

## 6. 結論

ProbabilisticSituationModelerは安全に削除可能：
- すでに本番環境では未使用
- 正統易経システムへの移行完了
- 依存関係が限定的で管理可能

次のステップ: 削除計画書に基づいた実装