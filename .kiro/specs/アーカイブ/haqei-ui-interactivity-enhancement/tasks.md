# Implementation Plan

- [x] 1. データ参照の修正とフォールバック機能の実装

  - TripleOSResultsView.js の render メソッド内で OS データの参照方法を修正する
  - engineOS、interfaceOS、safeModeOS の正しいオブジェクトパスを使用する
  - データが存在しない場合のフォールバック表示を実装する
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. OS カードヘッダーに展開アイコンを追加

  - 各 OS カードのヘッダー部分（.os-card-header）に展開アイコン（+）を追加する
  - HTML テンプレートを修正して expand-icon クラスの span 要素を挿入する
  - 初期状態では「+」、展開時には「×」として表示されるようにする
  - _Requirements: 2.1, 2.3, 2.4_

- [x] 3. 展開アイコンの CSS アニメーションを実装

  - components.css に.expand-icon のスタイルを追加する
  - 0.4 秒のスムーズな回転アニメーション（transform: rotate(45deg)）を実装する
  - ホバー時の視覚的フィードバックを追加する
  - _Requirements: 2.3, 2.4, 5.1, 5.2_

- [x] 4. OS カードの展開・収縮機能を実装

  - \_bindEventListeners メソッドに.os-card のクリックイベントリスナーを追加する
  - クリック時に.is-expanded クラスをトグルする機能を実装する
  - .os-card-body の表示・非表示を max-height トランジションで制御する
  - _Requirements: 2.1, 2.2, 5.3, 5.5_

- [x] 5. OS カード詳細コンテンツの構造化表示を実装

  - generateOSCardBody メソッドを修正して構造化された HTML を生成する
  - hexagram_details.js から潜在的な強みと成長の課題を取得する
  - 「潜在的な強み」「成長の課題」の見出し付きリスト表示を実装する
  - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [x] 6. hexagram_details.js データアクセスの改善

  - DataManager クラスの getHexagramDetails メソッドを確認・修正する
  - OS タイプ（engine、interface、safemode）に応じた適切なデータ取得を実装する
  - データが存在しない場合のフォールバック機能を追加する
  - _Requirements: 3.4, 3.5_

- [x] 7. 力学カードのクリック機能を実装

  - \_bindEventListeners メソッドに.dynamics-card のクリックイベントリスナーを追加する
  - クリック時に.is-expanded クラスをトグルする機能を実装する
  - 力学カードヘッダーに展開アイコンを追加する
  - _Requirements: 4.1, 4.2, 4.5_

- [x] 8. 力学カードの詳細評価項目表示を実装

  - 5 つの評価項目（機能効率、適応性、安定性、表現力、調和維持）の HTML テンプレートを作成する
  - 各評価項目に横棒グラフ（.evaluation-bar）を実装する
  - 評価スコアの数値表示を追加する
  - _Requirements: 4.3, 4.4, 4.6_

- [x] 9. 力学カード詳細表示の CSS スタイリングを実装

  - components.css に.dynamics-details の展開・収縮アニメーションを追加する
  - .evaluation-item のグリッドレイアウトスタイルを実装する
  - 横棒グラフ（.evaluation-bar）の視覚的スタイルを追加する
  - _Requirements: 4.5, 5.3, 5.4_

- [x] 10. アクセシビリティ機能の実装

  - 展開可能な要素に aria-expanded 属性を追加する
  - キーボードナビゲーション（Enter キー、Space キー）のサポートを実装する
  - スクリーンリーダー用の aria-label を追加する
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 11. エラーハンドリングとフォールバック機能の強化

  - データ取得失敗時の適切なエラーメッセージ表示を実装する
  - 部分的なデータ欠損に対する段階的フォールバックを追加する
  - コンソールエラーログの改善とデバッグ情報の追加
  - _Requirements: 1.3, 3.4_

- [x] 12. アニメーションとトランジションの最適化

  - すべての CSS transition のタイミングを統一・最適化する
  - アニメーション中の重複クリック防止機能を実装する
  - パフォーマンス最適化（will-change、transform3d 使用）を適用する
  - _Requirements: 5.1, 5.2, 5.3, 5.5_

- [x] 13. 統合テストとデバッグ

  - 全ての対話機能が正常に動作することを確認する
  - 異なるデータ状態（完全、部分的、欠損）でのテストを実行する
  - レスポンシブデザインでの動作確認を行う
  - _Requirements: 1.1, 2.1, 3.1, 4.1_

- [x] 14. 最終品質チェックとポリッシュ
  - 要件定義書のチェックリスト項目を全て確認する
  - ユーザビリティテストを実施して改善点を特定する
  - コードの最適化とコメントの追加を行う
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1_
