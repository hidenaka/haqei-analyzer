import sqlite3
import pandas as pd
import glob
import os

DB_FILE = 'haqei_database.db'
CSV_DIR = 'databasemake/'

def create_hexagrams_master_table(cursor):
    """ 64卦マスターテーブルを新しいスキーマで作成する """
    cursor.execute('DROP TABLE IF EXISTS hexagrams_master')
    # ★★★ CSVの列構成に完全に一致させる ★★★
    cursor.execute('''
    CREATE TABLE hexagrams_master (
        hexagram_id INTEGER PRIMARY KEY,
        name_jp TEXT,
        description TEXT,
        keywords TEXT,
        goka_name TEXT,
        goka_description TEXT,
        sakka_name TEXT,
        sakka_description TEXT,
        souka_name TEXT,
        souka_description TEXT,
        henko_1_name TEXT,
        henko_2_name TEXT,
        henko_3_name TEXT,
        henko_4_name TEXT,
        henko_5_name TEXT,
        henko_6_name TEXT
    )
    ''')
    print("テーブル 'hexagrams_master' を新しいスキーマで作成しました。")

def import_hexagrams_from_csv(conn, cursor):
    """ CSVから64卦データをインポートする """
    # 読み込むCSVファイル名を指定
    csv_file_path = os.path.join(CSV_DIR, "６４卦　錯卦綜卦互卦変爻卦　テキスト.csv")
    
    if not os.path.exists(csv_file_path):
        print(f"エラー: CSVファイルが見つかりません: {csv_file_path}")
        return
        
    print(f"'{csv_file_path}' からデータを読み込みます...")
    
    try:
        df = pd.read_csv(csv_file_path)
        # ★★★ 実際のCSV列名に合わせてデータを挿入 ★★★
        for index, row in df.iterrows():
            cursor.execute('''
                INSERT INTO hexagrams_master (
                    hexagram_id, name_jp, description, keywords, 
                    goka_name, goka_description, 
                    sakka_name, sakka_description, 
                    souka_name, souka_description,
                    henko_1_name, henko_2_name, henko_3_name,
                    henko_4_name, henko_5_name, henko_6_name
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                row['卦番号'], row['卦名'], row['基本的な特徴'], row['キーワード'],
                row['互卦'], row['内なる本質'], row['錯卦'], row['逆の視点'],
                row['綜卦'], row['裏からの視点'], row['初爻変'], row['二爻変'],
                row['三爻変'], row['四爻変'], row['五爻変'], row['上爻変']
            ))
        conn.commit()
        print(f"{len(df)} 件のデータを 'hexagrams_master' に挿入しました。")
    except KeyError as e:
        print(f"エラー: CSVファイルに予期された列が見つかりません: {e}")
    except Exception as e:
        print(f"予期せぬエラーが発生しました: {e}")

def main():
    """ メインの処理 """
    db_path = os.path.join(os.path.dirname(__file__), '..', DB_FILE)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    create_hexagrams_master_table(cursor)
    import_hexagrams_from_csv(conn, cursor)
    
    conn.close()
    print("データベースの更新が完了しました。")

if __name__ == '__main__':
    main()