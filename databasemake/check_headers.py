import csv
import os

# このスクリプトが置かれているフォルダのパスを取得
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
    # 確認したいCSVファイルのパスを指定
CSV_FILE_PATH = os.path.join(SCRIPT_DIR, 'H384.csv')
    
print(f"--- {CSV_FILE_PATH} のヘッダー情報を確認します ---")
    
try:
        with open(CSV_FILE_PATH, mode='r', encoding='utf-8-sig') as csvfile:
            # DictReaderを使ってCSVを読み込み、ヘッダー（フィールド名）を取得
            reader = csv.DictReader(csvfile)
            headers = reader.fieldnames
            
            print("\n【検出されたヘッダー名】:")
            print(headers)
            print("\n----------------------------------------------------")
            
            # '卦名' が存在するかチェック
            if '卦名' in headers:
                print("\n✅ '卦名' というヘッダーは見つかりました。")
            else:
                print("\n❌ '卦名' というヘッダーが見つかりませんでした。")
                print("上の【検出されたヘッダー名】のリストをよく確認し、")
                print("正しい列名を create_database.py スクリプトに反映させる必要があります。")
    
except FileNotFoundError:
        print(f"\n[エラー] ファイルが見つかりません: {CSV_FILE_PATH}")
        print("'H384.csv' が 'databasemake' フォルダに存在するか確認してください。")
except Exception as e:
        print(f"\n[エラー] ファイルの読み込み中にエラーが発生しました: {e}")
