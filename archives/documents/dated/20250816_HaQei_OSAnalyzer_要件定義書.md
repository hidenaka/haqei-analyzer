# 📋 HaQei Triple OS Analyzer 要件定義書

**作成日**: 2025年8月16日  
**バージョン**: 1.0  
**プロジェクト**: HaQei OSAnalyzer 完全再構築  

---

## 1. プロジェクト概要

### 1.1 目的
ユーザーの内面にある3つの仮想人格（Engine OS、Interface OS、Safe Mode OS）を易経の64卦システムを用いて分析・可視化する創造的な自己理解ツールを提供する。

### 1.2 背景
- HaQei哲学に基づく革新的な人格分析手法
- 現代的なUI/UXと伝統的な易経の融合
- ユーザー主権とプライバシー保護の両立

### 1.3 スコープ
- **含む**: 36問の質問収集、Triple OS分析、易卦マッピング、結果表示
- **含まない**: ユーザー登録、データ永続化、外部API連携

---

## 2. 機能要件

### 2.1 画面遷移
```
[ウェルカム画面] → [質問画面(36問)] → [分析処理] → [結果画面]
```

### 2.2 ウェルカム画面
- **必須機能**:
  - HaQeiシステムの説明表示
  - 分析開始ボタン
  - Triple OSの概要説明

### 2.3 質問画面
- **必須機能**:
  - 36問の段階的表示（1問ずつ）
  - 5択回答（A〜E）
  - 進捗表示（現在の質問番号/36）
  - 前の質問に戻る機能
  - 回答の一時保存（ブラウザメモリ）

- **質問構成**:
  ```
  - Engine OS関連: 12問（創造性・推進力）
  - Interface OS関連: 12問（社会性・協調性）
  - Safe Mode OS関連: 12問（安全性・慎重さ）
  ```

### 2.4 分析処理
- **必須機能**:
  - 36問の回答からTriple OSスコア計算
  - 各OSを64卦のいずれかにマッピング
  - OS間の相互作用分析
  - 分析中のローディング表示

- **計算ロジック**:
  ```javascript
  // 基本スコア計算
  Engine_Score = Σ(Engine関連回答) / 12
  Interface_Score = Σ(Interface関連回答) / 12  
  SafeMode_Score = Σ(SafeMode関連回答) / 12
  
  // 易卦マッピング
  hexagram_id = mapToHexagram(score, pattern)
  ```

### 2.5 結果画面
- **必須機能**:
  - Triple OSカード表示（3枚）
    - OS名称
    - スコア（0-100%）
    - 易卦番号と名称
    - 象徴的な説明文
  - 8卦エネルギーバランス表示（レーダーチャート）
  - OS間の相互作用説明
  - 結果の再計算ボタン

---

## 3. 非機能要件

### 3.1 パフォーマンス
- ページ初期表示: 3秒以内
- 質問遷移: 100ms以内
- 分析処理: 5秒以内
- アニメーション: 60fps維持

### 3.2 セキュリティ
- データはすべてクライアント側で処理
- 外部送信なし（完全オフライン動作可能）
- XSS対策（入力値サニタイゼーション）
- CSP（Content Security Policy）実装

### 3.3 アクセシビリティ
- WCAG 2.1 レベルAA準拠
- キーボード操作完全対応
- スクリーンリーダー対応
- コントラスト比4.5:1以上

### 3.4 ブラウザ対応
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- モバイルブラウザ対応

### 3.5 レスポンシブデザイン
- モバイル: 320px〜767px
- タブレット: 768px〜1023px
- デスクトップ: 1024px〜

---

## 4. データ要件

### 4.1 質問データ
```javascript
{
  id: number,           // 1-36
  text: string,        // 質問文
  category: 'engine' | 'interface' | 'safe',
  options: [
    { value: 'A', label: '強くそう思う', score: 5 },
    { value: 'B', label: 'そう思う', score: 4 },
    { value: 'C', label: 'どちらともいえない', score: 3 },
    { value: 'D', label: 'そう思わない', score: 2 },
    { value: 'E', label: '全くそう思わない', score: 1 }
  ]
}
```

### 4.2 易卦データ
```javascript
{
  id: number,          // 1-64
  name: string,        // 易卦名（例: "乾為天"）
  symbol: string,      // 卦の記号
  description: string, // 説明文
  trigrams: {
    upper: number,     // 上卦（1-8）
    lower: number      // 下卦（1-8）
  }
}
```

### 4.3 分析結果データ
```javascript
{
  timestamp: Date,
  answers: Array<string>,  // 36個の回答（A-E）
  tripleOS: {
    engine: {
      score: number,       // 0-1の範囲
      percentage: number,  // 0-100
      hexagramId: number,  // 1-64
      hexagramName: string,
      description: string
    },
    interface: { /* 同様 */ },
    safeMode: { /* 同様 */ }
  },
  interactions: {
    primary: string,       // 主要な相互作用の説明
    harmony: number,       // 調和度（0-1）
    tension: Array<string> // 緊張点の説明
  }
}
```

---

## 5. UI/UX要件

### 5.1 ビジュアルデザイン
- **カラーパレット**:
  - Primary: #4F7CAC（信頼感のある青）
  - Secondary: #162447（深い紺）
  - Accent: #E43F6F（アクセントのピンク）
  - Success: #22C55E（成功の緑）
  - Warning: #F59E0B（警告の橙）

- **タイポグラフィ**:
  - 見出し: Noto Sans JP Bold
  - 本文: Noto Sans JP Regular
  - 数値: Roboto Mono

### 5.2 インタラクション
- ボタンホバー効果
- 質問遷移アニメーション（スライド）
- 結果表示アニメーション（フェードイン）
- ローディングスピナー

### 5.3 フィードバック
- 回答選択時の視覚的フィードバック
- 進捗バーの更新
- エラーメッセージの表示
- 成功メッセージの表示

---

## 6. 技術要件

### 6.1 必須技術スタック
- HTML5（セマンティック）
- CSS3（Grid/Flexbox）
- Vanilla JavaScript（ES6+）
- Chart.js（レーダーチャート用）

### 6.2 禁止事項
- jQueryの使用
- 外部CDN依存（Chart.js除く）
- インラインスタイル
- eval()の使用

### 6.3 コーディング規約
- BEM命名規則
- JSDoc コメント
- 関数は単一責任原則
- DRY原則の遵守

---

## 7. テスト要件

### 7.1 単体テスト
- スコア計算ロジック
- 易卦マッピングロジック
- データ変換関数

### 7.2 統合テスト
- 画面遷移フロー
- データフロー（回答→分析→表示）
- エラーハンドリング

### 7.3 E2Eテスト
- 完全フロー（開始→36問回答→結果表示）
- 各種ブラウザでの動作確認
- モバイル/タブレット表示確認

---

## 8. 成功基準

### 8.1 定量的基準
- Lighthouse Performance: 90以上
- Lighthouse Accessibility: 95以上
- 初期表示時間: 3秒以内
- エラー率: 0.1%以下

### 8.2 定性的基準
- 直感的で使いやすいUI
- HaQei哲学の正確な表現
- 分析結果の納得感
- 継続利用への動機付け

---

## 9. 制約事項

### 9.1 技術的制約
- ファイルサイズ: HTML+CSS+JS合計1MB以下
- 外部API非依存
- オフライン動作必須

### 9.2 法的制約
- GDPR準拠
- 個人情報非収集
- Cookieの最小限使用

---

## 10. 今後の拡張可能性

### 10.1 将来的な機能
- 結果の保存/読み込み
- SNS共有機能
- 詳細レポートPDF出力
- 多言語対応
- AI による解説生成

### 10.2 拡張性の確保
- モジュール化設計
- プラグイン対応構造
- API化の準備
- データ構造の標準化

---

**承認者**: HaQei プロジェクトチーム  
**最終更新**: 2025年8月16日