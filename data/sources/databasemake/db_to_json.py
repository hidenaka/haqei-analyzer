import sqlite3
import json
import os

# --- パス設定 ---
# このスクリプト(db_to_json.py)があるディレクトリ
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# データベースファイルのパス
DB_FILE = os.path.join(SCRIPT_DIR, 'haqei_database.db')
# JavaScriptの出力先パス (assetsフォルダ)
JS_OUTPUT_FILE = os.path.join(SCRIPT_DIR, '..', 'assets', 'haqei_main_database.js')

def convert_db_to_js():
    """ データベースの内容をJavaScriptファイルに変換する """
    if not os.path.exists(DB_FILE):
        print(f"[エラー] データベースファイルが見つかりません: {DB_FILE}")
        print("先に 'create_database.py' を実行して、データベースを作成してください。")
        return

    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # --- データベースから全テーブルのデータを読み込む ---
    haqei_data = {}
    
    # 読み込むテーブル名のリスト
    # ★haqei_main_database.jsに含めたいテーブル名をここに列挙★
    table_names = [
        "hexagrams_master", "trigrams_master", "element_relationships", "384", "H64_DATA",
        "mbti_map", "mbti_nicknames", "enneagram_map", "strengthsfinder_map",
        "keyword_map", "line_keyword_map", "os_manual", "action_plans",
        "tuan_den", "sho_den", "tai_sho_den", "zatsu_ka_den", "jo_ka_den"
    ]

    for table in table_names:
        try:
            cursor.execute(f"SELECT * FROM [{table}]")
            rows = cursor.fetchall()
            haqei_data[table] = [dict(row) for row in rows]
            print(f"テーブル '{table}' を読み込みました。")
        except sqlite3.OperationalError:
            print(f"[警告] テーブル '{table}' が見つかりませんでした。スキップします。")

    # --- haqei_potential_scores を別に読み込む ---
    potential_scores = []
    try:
        cursor.execute("SELECT score FROM haqei_potential_scores ORDER BY id")
        potential_scores = [row['score'] for row in cursor.fetchall()]
        print("テーブル 'haqei_potential_scores' を読み込みました。")
    except sqlite3.OperationalError:
        print("[警告] テーブル 'haqei_potential_scores' が見つかりませんでした。")
        
    conn.close()

    # --- JavaScriptが期待する最終的なデータ構造をPythonで構築 ---
    bible_data = {
        "tuan_den": {str(item['hexagram_id']): item for item in haqei_data.get("tuan_den", [])},
        "sho_den": {str(item['line_id']): item for item in haqei_data.get("sho_den", [])},
        "tai_sho_den": {str(item['hexagram_id']): item['text'] for item in haqei_data.get("tai_sho_den", [])},
        "zatsu_ka_den": {str(item['hexagram_id']): item for item in haqei_data.get("zatsu_ka_den", [])},
        "jo_ka_den": {str(item['hexagram_id']): item for item in haqei_data.get("jo_ka_den", [])}
    }
    # bibleのサブキーを削除
    for key in ["tuan_den", "sho_den", "tai_sho_den", "zatsu_ka_den", "jo_ka_den"]:
        haqei_data.pop(key, None)
    
    # bibleオブジェクトをhaqei_dataに追加
    haqei_data['bible'] = bible_data

    # --- JavaScriptファイルに書き出す ---
    print(f"\nJavaScriptファイル '{JS_OUTPUT_FILE}' に書き出しています...")
    with open(JS_OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("// HaQei Project Main Database File\n// This file is auto-generated. DO NOT EDIT.\n\n")
        f.write("const HAQEI_DATA = ")
        json.dump(haqei_data, f, ensure_ascii=False, indent=2)
        f.write(";\n\n")

        f.write("const haqei_potential_scores = ")
        json.dump(potential_scores, f, ensure_ascii=False, indent=2)
        f.write(";\n\n")
        
        f.write("// --- Backward compatibility ---\n")
        f.write("if (typeof H384_DATA === 'undefined') { const H384_DATA = HAQEI_DATA['384']; }\n")
        f.write("if (typeof H64_DATA === 'undefined') { const H64_DATA = HAQEI_DATA['H64_DATA']; }\n")

    print(f"'{JS_OUTPUT_FILE}' の作成が完了しました。")

if __name__ == '__main__':
    convert_db_to_js()