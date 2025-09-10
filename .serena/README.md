Serena MCP 設定とログ運用

目的
- Serena/MCP 関連の設定・記録をリポジトリ直下の `.serena` に一元化します。

ファイル構成（日付パーティション化）
- `.serena/project.yml`: Serena MCP の基本設定とログ方針（決定ログに限定）
- `.serena/index.json`: 日付→セッション/チェックポイントの簡易インデックス
- `.serena/logs/YYYY/YYYY-MM-DD.ndjson`: 1日1ファイルのNDJSON（append-only）
- `.serena/context.json`: 直近N日（既定7日）の要約

運用ルール（決定ログのみ）
- セッション開始/意思決定/セッション終了のみを記録（作業ログは記録しない）
- 1ファイル=1日（NDJSON）に追記し、`.serena/index.json` を更新
- 任意タイミングでチェックポイント（タグ付け）を記録し、ロールバック基点に利用

コマンド
- セッション開始: `npm run serena:session:start -- --intent "目的"`
- 意思決定の記録: `npm run serena:decision -- --type implementation --title "..." --plan "..." --decisions "..."`
- セッション終了: `npm run serena:session:end -- --summary "..."`
- チェックポイント: `npm run serena:checkpoint -- --tag v2025-09-10-1 --note "説明"`
- コンテキスト要約: `npm run serena:context:refresh -- --days 7`
- 復元（ドライラン）: `npm run serena:restore -- --tag v2025-09-10-1`

Git 連携（自動記録）
- インストール: `npm run hooks:install`
- 以後、`git push` 前に `.githooks/pre-push` が自動で直近コミットを `.serena/logs/YYYY/YYYY-MM-DD.ndjson` へ記録（要 Node）
- 記録内容: 最終コミットSHA/メッセージ/変更ファイル一覧 + チェックポイント

他エージェントへの引き継ぎ
- 参照すべき場所: `.serena/index.json`（日付/セッション/チェックポイントの索引）、`.serena/logs/YYYY/*.ndjson`（詳細ログ）、`.serena/context.json`（直近要約）
- 運用: セッション開始→決定を都度→セッション終了、または `git push` による自動記録

注意
- APIキーなどの機密情報は書かない
- 大きなバイナリや長大テキストは格納しない
- 必要に応じて要約して記録
