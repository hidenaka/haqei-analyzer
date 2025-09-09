Serena MCP 設定とログ運用

目的
- Serena/MCP 関連の設定・記録をリポジトリ直下の `.serena` に一元化します。

ファイル構成
- `.serena/project.yml`: Serena MCP の基本設定とログ方針
- `.serena/activity.ndjson`: アクティビティログ（1行1JSON）

運用ルール（ログ）
- 次のイベントで `.serena/activity.ndjson` に追記します。
  - git-commit: コミット後に記録
  - deploy: デプロイ実行時
  - future-simulator.analysis: 重要な分析実行や不具合修正の完了時

追記方法
- スクリプトで追記（推奨）: `npm run serena:log -- --event <name> --meta '{"key":"value"}'`
- 直接追記: 1行に1JSONを追記（機密情報は含めない）

注意
- APIキーなどの機密情報は書かない
- 大きなバイナリや長大テキストは格納しない
- 必要に応じて要約して記録

