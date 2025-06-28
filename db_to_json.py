import sqlite3
import json
import os

# --- パス設定 ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# 入力DBのパス (databasemakeフォルダの中のdbファイル)
DB_FILE = os.path.join(SCRIPT_DIR, "databasemake/haqei_database.db") 
# 出力JSのパス (プロジェクトルートにあるassetsフォルダの中)
# ★★★★★ ここを修正しました ★★★★★
JS_OUTPUT_FILE = os.path.join(SCRIPT_DIR, "assets/haqei_main_database.js")

def convert_db_to_js():
    if not os.path.exists(DB_FILE):
        print(f"[エラー] データベースファイルが見つかりません: {DB_FILE}")
        print("先に 'databasemake/create_database.py' を実行してください。")
        return

    # assetsフォルダがなければ作成する
    assets_dir = os.path.dirname(JS_OUTPUT_FILE)
    if not os.path.exists(assets_dir):
        print(f"'{assets_dir}' フォルダを作成します。")
        os.makedirs(assets_dir)
        
    print(f"データベース '{DB_FILE}' を読み込んでいます...")
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # --- 実際に存在するテーブル名の一覧を取得 ---
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    existing_tables = [row['name'] for row in cursor.fetchall()]
    print(f"データベース内のテーブル: {existing_tables}")

    all_data = {}

    # 取得対象のテーブルリスト
    # create_database.pyで作成されるテーブル名をすべて記述
    target_tables = [
        "trigrams_master", "element_relationships", "hexagrams_master", "mbti_map",
        "384_master", "64_master", "koudo_shishin"
    ]

    print("テーブルデータを変換中...")
    for table_name in target_tables:
        if table_name in existing_tables:
            print(f" - テーブル '{table_name}' を読み込み中...")
            # テーブル名に数字が含まれる可能性を考慮し、安全のため[]で囲む
            query = f"SELECT * FROM [{table_name}]"
            cursor.execute(query)
            rows = cursor.fetchall()
            all_data[table_name] = [dict(row) for row in rows]
        else:
            print(f" - [警告] テーブル '{table_name}' が見つからないため、スキップします。")
            all_data[table_name] = [] # データがない場合は空のリストをセット

    conn.close()

    print(f"\nJavaScriptファイル '{JS_OUTPUT_FILE}' にデータを書き出しています...")
    with open(JS_OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("// HaQei Project Main Database File\n\n")
        f.write("const HDB = ")
        # 人格OS分析で使うテーブル群をHDBオブジェクトにまとめる
        json.dump({
            "trigrams_master": all_data.get("trigrams_master", []),
            "element_relationships": all_data.get("element_relationships", []),
            "hexagrams_master": all_data.get("hexagrams_master", []),
            "mbti_map": all_data.get("mbti_map", []),
        }, f, ensure_ascii=False, indent=2)
        f.write(";\n\n")

        # 未来予測で使うデータを個別の定数として書き出す
        f.write("const H384_DATA = ")
        json.dump(all_data.get("384_master", []), f, ensure_ascii=False, indent=2)
        f.write(";\n\n")

        f.write("const H64_DATA = ")
        json.dump(all_data.get("64_master", []), f, ensure_ascii=False, indent=2)
        f.write(";\n\n")

        f.write("const koudoShishinData = ")
        json.dump(all_data.get("koudo_shishin", []), f, ensure_ascii=False, indent=2)
        f.write(";\n\n")

    print("\n変換が完了しました。")
    print(f"'{JS_OUTPUT_FILE}' が assets フォルダ内に作成されました。")

if __name__ == '__main__':
    convert_db_to_js()
