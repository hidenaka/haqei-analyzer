# Implementation Plan

- [x] 1. DataManager 統一データ取得機能の実装

  - DataManager クラスに getUnifiedHexagramData メソッドを追加
  - 複数データソース（hexagrams、osManual）の統合ロジックを実装
  - データ優先順位とエラーハンドリングを含む
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. TestInputSystem 統一 OS 詳細生成機能の実装

  - TestInputSystem クラスに generateUnifiedOSDetail メソッドを追加
  - 統一データから一貫した OS 詳細テキストを生成する機能を実装
  - フォーマット統一と null チェックを含む
  - _Requirements: 1.1, 1.2_

- [x] 3. オブジェクト型安全表示機能の実装

  - generateUserText メソッド内の taiShoDen データ処理を修正
  - 型チェックと適切な文字列変換ロジックを実装
  - text/content/interpretation プロパティの優先順位処理を追加
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [-] 4. OS 特性分析機能の実装

  - TestInputSystem クラスに categorizeOSType メソッドを追加
  - OS 名から特性（type、energy、focus）を自動分類する機能を実装
  - 拡張可能な分類ロジックとデフォルト処理を含む
  - _Requirements: 3.1, 3.5_

- [ ] 5. OS 組み合わせ分析機能の実装

  - TestInputSystem クラスに analyzeOSCombination メソッドを追加
  - 3 つの OS の特性分析と相互関係評価機能を実装
  - 矛盾検出と dominantTheme 特定ロジックを含む
  - _Requirements: 3.1, 3.2_

- [ ] 6. 統合洞察メッセージ生成機能の実装

  - TestInputSystem クラスに detectContrast と generateUnifyingMessage メソッドを追加
  - 矛盾する特性を多面的魅力として表現するロジックを実装
  - 調和的組み合わせと対比的組み合わせの両方に対応
  - _Requirements: 3.2, 3.3, 3.4_

- [x] 7. generateUserText メソッドの統合修正

  - 既存の generateUserText メソッドを新しい統一データ取得方式に変更
  - window.getOSDetailText 呼び出しを generateUnifiedOSDetail 呼び出しに置換
  - 統合洞察ロジックを組み込んだテンプレート生成を実装
  - _Requirements: 1.1, 1.2, 3.3_

- [ ] 8. データ整合性テストの実装

  - 同一卦 ID から取得したデータの一貫性を検証するテストコードを作成
  - getUnifiedHexagramData メソッドの正常系・異常系テストを実装
  - テスト実行とログ出力機能を追加
  - _Requirements: 4.1, 4.2_

- [ ] 9. オブジェクト表示エラーテストの実装

  - [object Object]エラーが解消されていることを確認するテストコードを作成
  - 各種データ型に対する文字列変換テストを実装
  - テスト結果の可視化機能を追加
  - _Requirements: 4.1, 4.3_

- [ ] 10. 統合洞察品質テストの実装

  - 矛盾する組み合わせが適切に魅力として表現されることを確認するテストコードを作成
  - 各種 OS 組み合わせパターンでの洞察生成テストを実装
  - 洞察品質の評価指標とレポート機能を追加
  - _Requirements: 4.1, 4.4_

- [ ] 11. エラーハンドリング強化の実装

  - 各メソッドに適切な try-catch 処理を追加
  - エラー発生時の分かりやすいメッセージ表示機能を実装
  - ログ出力とデバッグ情報の充実化
  - _Requirements: 1.4, 2.4, 3.5, 4.5_

- [ ] 12. 全体統合テストと動作確認
  - 修正された全機能の統合動作テストを実行
  - 既存機能への影響がないことを確認
  - パフォーマンス劣化がないことを検証
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
