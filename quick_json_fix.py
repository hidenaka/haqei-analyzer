#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Quick JSON Fix Tool - 簡単なJSON修正ツール
余分な文字やコンマエラーを自動修正
"""

import re
import os

def fix_json_syntax_errors(file_path):
    """JSON構文エラーを自動修正"""
    
    print(f"🔧 修正中: {file_path}")
    
    # ファイル読み込み
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # バックアップ作成
    backup_path = file_path + '.quickfix_backup'
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"💾 バックアップ作成: {backup_path}")
    
    original_content = content
    
    # 修正1: 余分な文字 + } の組み合わせを修正
    # 例: "a      }," -> "      },"
    content = re.sub(r'^(\s*)[a-zA-Z]\s*(\}\s*,?\s*)$', r'\1\2', content, flags=re.MULTILINE)
    
    # 修正2: 重複した閉じ括弧を修正
    content = re.sub(r'\}\s*\}\s*,', '},', content)
    
    # 修正3: 余分なコンマを削除（配列やオブジェクトの最後）
    content = re.sub(r',(\s*[\]}])', r'\1', content)
    
    # 修正4: 不正な文字列の修正
    content = re.sub(r'(["\w])\s*([a-zA-Z])\s*(["\w])', r'\1\3', content)
    
    if content != original_content:
        print("✅ 構文エラーを修正しました")
        
        # 修正内容を保存
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return True
    else:
        print("ℹ️ 修正の必要はありませんでした")
        return False

def main():
    file_path = "public/js/data/compatibility/engine-interface/hexagram_02.json"
    
    if not os.path.exists(file_path):
        print(f"❌ ファイルが見つかりません: {file_path}")
        return
    
    fix_json_syntax_errors(file_path)
    
    # 修正後にJSON統合ツールを実行
    print("\n🚀 JSON統合ツールを実行中...")
    os.system("python3 json_merge_tool.py 2")

if __name__ == "__main__":
    main()