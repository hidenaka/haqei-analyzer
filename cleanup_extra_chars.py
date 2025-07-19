#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
JSONファイルの余分な文字を除去するツール
"""

import re
import os

def clean_extra_characters(file_path):
    """JSONファイルから余分な文字を除去"""
    
    print(f"🧹 クリーンアップ中: {file_path}")
    
    # ファイル読み込み
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # バックアップ作成
    backup_path = file_path + '.cleanup_backup'
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"💾 バックアップ作成: {backup_path}")
    
    original_content = content
    fixed_issues = []
    
    # 修正1: "  c      }," のような余分な文字を除去
    pattern1 = r'^(\s*)[a-zA-Z]+(\s*\}\s*,?\s*)$'
    matches = re.findall(pattern1, content, flags=re.MULTILINE)
    if matches:
        content = re.sub(pattern1, r'\1\2', content, flags=re.MULTILINE)
        fixed_issues.append(f"余分な文字を{len(matches)}箇所で除去")
    
    # 修正2: "interface_combinations": [ の前の余分な文字
    pattern2 = r'([a-zA-Z]+)(\s*"interface_combinations")'
    matches2 = re.findall(pattern2, content)
    if matches2:
        content = re.sub(pattern2, r'\2', content)
        fixed_issues.append(f"interface_combinations前の余分文字を{len(matches2)}箇所で除去")
    
    # 修正3: プロパティ名の前の余分な文字
    pattern3 = r'([a-zA-Z]+)(\s*"(?:interface_id|interface_name|type|overall_score|summary)")'
    matches3 = re.findall(pattern3, content)
    if matches3:
        content = re.sub(pattern3, r'\2', content)
        fixed_issues.append(f"プロパティ名前の余分文字を{len(matches3)}箇所で除去")
    
    # 修正4: evaluation や advice の前の余分な文字
    pattern4 = r'([a-zA-Z]+)(\s*"(?:evaluation|advice)")'
    matches4 = re.findall(pattern4, content)
    if matches4:
        content = re.sub(pattern4, r'\2', content)
        fixed_issues.append(f"evaluation/advice前の余分文字を{len(matches4)}箇所で除去")
    
    # 修正5: 行の最初の余分な文字（より包括的）
    pattern5 = r'^(\s*)[a-zA-Z]+(\s*["\}\]])' 
    matches5 = re.findall(pattern5, content, flags=re.MULTILINE)
    if matches5:
        content = re.sub(pattern5, r'\1\2', content, flags=re.MULTILINE)
        fixed_issues.append(f"行頭の余分文字を{len(matches5)}箇所で除去")
    
    if content != original_content:
        print("✅ 以下の修正を実行しました:")
        for issue in fixed_issues:
            print(f"   - {issue}")
        
        # 修正内容を保存
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return True
    else:
        print("ℹ️ 修正の必要はありませんでした")
        return False

def main():
    import sys
    
    if len(sys.argv) > 1:
        hexagram_id = int(sys.argv[1])
        file_path = f"public/js/data/compatibility/engine-interface/hexagram_{hexagram_id:02d}.json"
    else:
        print("❌ 卦番号を指定してください: python3 cleanup_extra_chars.py 3")
        return
    
    if not os.path.exists(file_path):
        print(f"❌ ファイルが見つかりません: {file_path}")
        return
    
    # クリーンアップ実行
    if clean_extra_characters(file_path):
        print(f"\n🚀 クリーンアップ完了。JSON統合ツールを実行中...")
        os.system(f"python3 json_merge_tool.py {hexagram_id}")
    else:
        print("🔍 直接JSON統合ツールを実行中...")
        os.system(f"python3 json_merge_tool.py {hexagram_id}")

if __name__ == "__main__":
    main()