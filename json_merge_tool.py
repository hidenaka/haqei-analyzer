#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
JSON Merge Tool for HaQei Analyzer Compatibility Data
複数のJSONオブジェクトが含まれるファイルを1つの正しいJSONに統合するツール
"""

import json
import re
import os
import sys
from typing import Dict, List, Any

class JSONMergeTool:
    def __init__(self):
        self.base_path = "public/js/data/compatibility/engine-interface/"
        
    def detect_multiple_json_objects(self, file_content: str) -> List[str]:
        """
        ファイル内の複数のJSONオブジェクトを検出して分割
        """
        # より賢い検出: "hexagram_id"をキーとして独立したJSONオブジェクトを識別
        lines = file_content.split('\n')
        json_starts = []
        
        for i, line in enumerate(lines):
            stripped = line.strip()
            # JSONオブジェクトの開始を検出（'{' + 次の行が "hexagram_id"）
            if stripped == '{' and i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                if '"hexagram_id"' in next_line:
                    json_starts.append(i)
                    
        print(f"🔍 検出されたJSONオブジェクト開始位置: {json_starts}")
        
        if len(json_starts) <= 1:
            return [file_content]  # 1つのJSONオブジェクトのみ
            
        # 各JSONオブジェクトを分割
        json_objects = []
        for i, start in enumerate(json_starts):
            if i < len(json_starts) - 1:
                # 次のJSONオブジェクトの開始まで
                next_start = json_starts[i + 1]
                obj_lines = lines[start:next_start]
                # 末尾の空行を削除
                while obj_lines and not obj_lines[-1].strip():
                    obj_lines.pop()
            else:
                # 最後のJSONオブジェクト
                obj_lines = lines[start:]
                
            obj_content = '\n'.join(obj_lines).strip()
            if obj_content:
                json_objects.append(obj_content)
            
        return json_objects
    
    def parse_json_safely(self, json_str: str) -> Dict[str, Any]:
        """
        JSON文字列を安全にパース（エラーハンドリング付き）
        """
        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"❌ JSON解析エラー: {e}")
            print(f"エラー位置: 行{e.lineno}, 列{e.colno}")
            
            # エラー周辺のコンテキストを表示
            lines = json_str.split('\n')
            start_line = max(0, e.lineno - 3)
            end_line = min(len(lines), e.lineno + 3)
            
            print("🔍 エラー周辺のコンテキスト:")
            for i in range(start_line, end_line):
                if i < len(lines):
                    marker = ">>> " if i == e.lineno - 1 else "    "
                    print(f"{marker}{i+1:3d}: {lines[i]}")
            
            return None
    
    def merge_interface_combinations(self, json_objects: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        複数のJSONオブジェクトのinterface_combinationsを1つに統合
        """
        if not json_objects:
            return None
            
        # 最初のオブジェクトをベースとする
        merged = json_objects[0].copy()
        base_combinations = merged['internal_team_analysis']['interface_combinations']
        
        # 他のオブジェクトのcombinationsを追加
        for i, obj in enumerate(json_objects[1:], 1):
            if 'internal_team_analysis' in obj and 'interface_combinations' in obj['internal_team_analysis']:
                additional_combinations = obj['internal_team_analysis']['interface_combinations']
                base_combinations.extend(additional_combinations)
                print(f"✅ セクション{i+1}から {len(additional_combinations)}個の組み合わせを追加")
        
        # interface_idでソート
        base_combinations.sort(key=lambda x: x.get('interface_id', 0))
        
        return merged
    
    def fix_json_file(self, filename: str) -> bool:
        """
        指定されたJSONファイルを修正
        """
        filepath = os.path.join(self.base_path, filename)
        
        if not os.path.exists(filepath):
            print(f"❌ ファイルが見つかりません: {filepath}")
            return False
            
        print(f"🔧 修正中: {filename}")
        
        # ファイル読み込み
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"❌ ファイル読み込みエラー: {e}")
            return False
        
        # バックアップ作成
        backup_path = filepath + '.backup'
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"💾 バックアップ作成: {backup_path}")
        
        # 複数のJSONオブジェクトを検出
        json_strings = self.detect_multiple_json_objects(content)
        
        if len(json_strings) == 1:
            # 1つのJSONオブジェクトのみ - 構文チェックのみ
            parsed = self.parse_json_safely(json_strings[0])
            if parsed is None:
                return False
            print(f"✅ {filename}: 既に正しい形式です")
            return True
        
        print(f"🔍 {len(json_strings)}個のJSONオブジェクトを検出")
        
        # 各JSONオブジェクトをパース
        parsed_objects = []
        for i, json_str in enumerate(json_strings):
            parsed = self.parse_json_safely(json_str)
            if parsed is None:
                print(f"❌ セクション{i+1}の解析に失敗")
                return False
            parsed_objects.append(parsed)
        
        # interface_combinationsを統合
        merged_object = self.merge_interface_combinations(parsed_objects)
        if merged_object is None:
            print(f"❌ 統合に失敗")
            return False
        
        # 統合結果をファイルに保存
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(merged_object, f, ensure_ascii=False, indent=2)
            
            total_combinations = len(merged_object['internal_team_analysis']['interface_combinations'])
            print(f"✅ {filename}: 統合完了 ({total_combinations}個の組み合わせ)")
            
            # 構文チェック
            with open(filepath, 'r', encoding='utf-8') as f:
                json.load(f)
            print(f"✅ {filename}: JSON構文チェック完了")
            
            return True
            
        except Exception as e:
            print(f"❌ ファイル保存エラー: {e}")
            # バックアップから復元
            with open(backup_path, 'r', encoding='utf-8') as f:
                backup_content = f.read()
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(backup_content)
            return False
    
    def fix_all_hexagram_files(self):
        """
        全てのhexagram_XX.jsonファイルを修正
        """
        print("🚀 HaQei Analyzer JSON統合ツール開始")
        print("=" * 50)
        
        success_count = 0
        error_count = 0
        
        for i in range(1, 65):  # 1-64卦
            filename = f"hexagram_{i:02d}.json"
            
            if self.fix_json_file(filename):
                success_count += 1
            else:
                error_count += 1
            
            print("-" * 30)
        
        print("=" * 50)
        print(f"📊 処理結果:")
        print(f"   ✅ 成功: {success_count}ファイル")
        print(f"   ❌ エラー: {error_count}ファイル")
        
        if error_count == 0:
            print("🎉 全てのファイルの統合が完了しました！")
        else:
            print("⚠️  一部のファイルでエラーが発生しました。.backupファイルから復元できます。")
    
    def fix_single_file(self, hexagram_id: int):
        """
        特定の1つのファイルのみを修正
        """
        filename = f"hexagram_{hexagram_id:02d}.json"
        print(f"🔧 単一ファイル修正: {filename}")
        
        if self.fix_json_file(filename):
            print(f"✅ {filename}の修正が完了しました")
        else:
            print(f"❌ {filename}の修正に失敗しました")

def main():
    """
    メイン実行関数
    """
    merger = JSONMergeTool()
    
    if len(sys.argv) > 1:
        # 特定のファイルのみ処理
        try:
            hexagram_id = int(sys.argv[1])
            if 1 <= hexagram_id <= 64:
                merger.fix_single_file(hexagram_id)
            else:
                print("❌ 卦番号は1-64の範囲で指定してください")
        except ValueError:
            print("❌ 有効な卦番号を指定してください")
    else:
        # 全ファイル処理
        merger.fix_all_hexagram_files()

if __name__ == "__main__":
    main()