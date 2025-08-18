#!/bin/bash
# スクリプト読み込み一覧から問題のあるファイルを特定

echo "=== HTML内で読み込まれるスクリプトファイルと、その中のexport文をチェック ==="

# future_simulator.htmlから読み込まれるスクリプトファイルを抽出
grep 'src=".*\.js"' public/future_simulator.html | sed 's/.*src="\([^"]*\)".*/\1/' | while read script_path; do
    # 相対パスを絶対パスに変換
    if [[ $script_path == ./js/* ]]; then
        full_path="public/${script_path#./}"
    elif [[ $script_path == js/* ]]; then
        full_path="public/$script_path"
    elif [[ $script_path == https://* ]]; then
        echo "EXTERNAL: $script_path"
        continue
    else
        full_path="public/$script_path"
    fi
    
    if [[ -f "$full_path" ]]; then
        export_count=$(grep -c "^export" "$full_path" 2>/dev/null || echo 0)
        if [[ $export_count -gt 0 ]]; then
            echo "❌ EXPORT FOUND: $script_path ($export_count export statements)"
        else
            echo "✅ OK: $script_path"
        fi
    else
        echo "⚠️ NOT FOUND: $script_path"
    fi
done