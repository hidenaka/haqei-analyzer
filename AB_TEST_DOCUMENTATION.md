# 📊 HAQEI A/Bテスト実装ドキュメント

**作成日**: 2025年08月07日  
**目的**: 分析精度とUX改善のためのA/Bテスト

## 🎯 A/Bテストの目的

### 検証項目
1. **完了率の向上**: どちらのUIが高い完了率を達成するか
2. **ユーザー満足度**: どちらが高い満足度を得られるか
3. **精度評価**: ユーザーが感じる分析精度の違い
4. **エンゲージメント**: 滞在時間と相互作用の質

## 🔧 実装内容

### 1. A/Bテストフレームワーク (`ab-testing.js`)
- **自動振り分け**: 50/50でユーザーをA/Bグループに振り分け
- **イベント追跡**: ユーザー行動を自動記録
- **メトリクス収集**: 完了率、所要時間、満足度を測定
- **データエクスポート**: テスト結果をJSON形式で出力

### 2. フィードバックウィジェット (`feedback-widget.js`)
- **5段階評価**: 満足度と精度を評価
- **定性フィードバック**: コメント欄で詳細な意見収集
- **非侵襲的UI**: 右下に控えめに配置

## 📋 バリアント設定

### Variant A (コントロール)
- 現在の標準UI
- 変更なし

### Variant B (テスト)
- ボタンテキスト変更: より行動を促す表現
- ビジュアルフィードバック強化: ホバーエフェクト追加
- プログレスバー改善: グラデーション表示

## 📈 測定指標

### 主要KPI
```javascript
{
    conversionRate: "分析完了率 (%)",
    averageCompletionTime: "平均完了時間 (ms)",
    satisfactionScore: "満足度スコア (1-5)",
    accuracyScore: "精度スコア (1-5)",
    dropOffRate: "離脱率 (%)"
}
```

### イベント追跡
- `page_view`: ページ訪問
- `variant_assigned`: バリアント割り当て
- `analysis_started`: 分析開始
- `question_answered`: 質問回答
- `analysis_completed`: 分析完了
- `user_feedback`: フィードバック送信

## 🚀 導入方法

### 1. HTMLに追加
```html
<!-- A/Bテストとフィードバック -->
<script src="/js/ab-testing.js"></script>
<script src="/js/feedback-widget.js"></script>
```

### 2. 分析完了時の処理
```javascript
// 分析完了時
if (window.haqeiABTest) {
    window.haqeiABTest.trackAnalysisComplete(results);
}

// フィードバックウィジェット表示
if (window.feedbackWidget) {
    window.feedbackWidget.showAfterAnalysis(5000); // 5秒後に表示
}
```

## 📊 データ分析

### ローカルストレージ構造
```javascript
// A/Bテストデータ
localStorage.getItem('haqei_test_id')       // テストID
localStorage.getItem('haqei_test_variant')  // バリアント (A/B)
localStorage.getItem('haqei_ab_events')     // イベントログ

// フィードバックデータ
localStorage.getItem('haqei_feedback')      // フィードバック履歴
```

### データエクスポート
```javascript
// ブラウザコンソールで実行
window.haqeiABTest.exportTestData(); // JSONファイルでダウンロード
```

## 📈 成功基準

### 統計的有意性
- **サンプルサイズ**: 各バリアント最低100ユーザー
- **テスト期間**: 2週間以上
- **信頼区間**: 95%

### 成功指標
- **完了率向上**: +5%以上
- **満足度向上**: 平均4.0以上
- **精度評価**: 平均3.5以上

## 🔍 分析レポート生成

### 週次レポート項目
1. 各バリアントのユーザー数
2. 完了率の比較
3. 平均完了時間
4. 満足度・精度スコア
5. 定性フィードバックのサマリー

### 月次レポート項目
1. 統計的有意性の検証
2. セグメント別分析
3. 改善提案
4. 次期テストの計画

## ⚠️ 注意事項

### プライバシー配慮
- 個人情報は収集しない
- データは匿名化される
- ローカルストレージのみ使用

### パフォーマンス影響
- 追加のJSファイル: 約10KB
- CPU使用: 最小限
- メモリ使用: < 1MB

### ブラウザ互換性
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🚦 ロールアウト計画

### Phase 1: ソフトローンチ (Week 1-2)
- 全トラフィックの10%でテスト
- バグと問題の検出

### Phase 2: 本格展開 (Week 3-4)
- 全トラフィックの50%に拡大
- データ収集本格化

### Phase 3: 評価と決定 (Week 5)
- データ分析
- 勝者バリアントの決定
- 全ユーザーへの展開

## 📞 サポート

問題が発生した場合:
1. ブラウザコンソールでエラーを確認
2. `window.haqeiABTest.getMetrics()`で状態確認
3. フィードバックウィジェットから報告

---

**ステータス**: 実装完了・テスト準備完了
**次のステップ**: 本番環境へのデプロイとモニタリング開始