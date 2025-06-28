# AI開発アシスタント用ルール for "HaQei アナライザー"

## 1. プロジェクトの最優先事項

- **目的:** 「人格OS」と「今の状況」を掛け合わせ、ユーザーのポテンシャルを最大化する戦略を導き出すウェブサイトを構築する。
- **データフローの厳守:** データは常に **「CSV → SQLite → JavaScript」** の流れで処理する。この設計思想は絶対に崩さないこと。
- **技術スタックの遵守:** 提案・実装は必ず指定された技術スタック（HTML, JavaScript, Tailwind CSS, Chart.js, Python）の範囲内で行うこと。
- **開発者への配慮:** 開発者はプログラミング経験がないため、提供するコードや手順は**「コピー＆ペーストでそのまま動く」**ことを絶対条件とする。変更箇所、ファイル名、設置場所を明確に指示すること。

---

## 2. 技術スタック (Technology Stack)

- **フロントエンド:** `HTML`, `JavaScript` (ES6準拠)
- **スタイリング:** `Tailwind CSS` (CDN経由での利用を前提とする)
- **グラフ描画:** `Chart.js` (CDN経由での利用を前提とする)
- **データ処理 (バッチ):** `Python`
- **禁止事項:** `npm`, `yarn`, `Webpack`, `Vite` などのビルドツールやパッケージマネージャーの導入は提案しない。

---

## 3. ファイル構造とデータフロー (File Structure & Data Flow)

### 主要ファイル

- **HTML:** `index.html`, `os_analyzer.html`, `future_simulator.html`
- **自動生成データJS:** `assets/haqei_main_database.js` (このファイルは直接編集しない)
- **手動管理データJS:** `assets/koudo_shishin_database.js`
- **DB生成スクリプト:** `databasemake/create_database.py`
- **JSデータ生成スクリプト:** `db_to_json.py`
- **元データ:** `databasemake/*.csv`

### データフローのルール

1.  全てのデータ変更・追加は、原則として`databasemake/`内のCSVファイルを編集することから始める。
2.  CSV編集後、`create_database.py`を実行して`haqei_database.db`を更新する。
3.  次に`db_to_json.py`を実行して`assets/haqei_main_database.js`を更新する。
4.  HTML/JavaScript側は、更新された`assets/haqei_main_database.js`を読み込んで動作する。
5.  行動指針などのテキストデータは、`assets/koudo_shishin_database.js`で手動管理する。

---

## 4. コーディングスタイル (Coding Style)

- **JavaScript:**
    - 変数宣言は `let` または `const` を使用する。`var` は使用しない。
    - 関数は `function 関数名() {}` または `const 関数名 = () => {}` の形式で統一する。
    - コードの意図が分かりにくい箇所には、必ずコメント `//` を追加する。
- **HTML:**
    - インデントを適切に使い、構造を分かりやすく保つ。
    - `id`や`class`には、`calculate-button` のように、機能が推測しやすい名前を付ける。

---
