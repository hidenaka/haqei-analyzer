#!/bin/bash

# Playwright使用監視フック
# APIコンテキストウィンドウエラーを防ぐためのチェック

# PlaywrightのMCPツール使用を検知
if [[ "$1" == *"mcp__playwright__"* ]]; then
    
    # browser_take_screenshotの使用を検知
    if [[ "$1" == *"browser_take_screenshot"* ]]; then
        
        # fullPageパラメータのチェック
        if [[ "$1" == *"fullPage"*":"*"true"* ]]; then
            echo "⚠️ 警告: フルページスクリーンショットはAPIコンテキストウィンドウエラーの原因となる可能性があります。"
            echo "推奨: fullPage: false を使用するか、browser_snapshot()を代わりに使用してください。"
            echo ""
            echo "修正例:"
            echo "mcp__playwright__browser_take_screenshot({"
            echo "  fullPage: false,  // ビューポートのみ"
            echo "  raw: false       // JPEG圧縮"
            echo "})"
            echo ""
            echo "または:"
            echo "mcp__playwright__browser_snapshot()  // テキスト情報取得"
            
            # エラーを返してコマンド実行を停止（オプション）
            # exit 1
        fi
        
        # rawパラメータのチェック（圧縮なし画像の検知）
        if [[ "$1" == *"raw"*":"*"true"* ]]; then
            echo "💡 ヒント: raw: false を使用してJPEG圧縮することで、画像サイズを削減できます。"
        fi
        
        # 大きなHTMLファイルを開いている場合の警告
        if [[ "$1" == *"results-v3"* ]] || [[ "$1" == *"results.html"* ]]; then
            echo "⚠️ 注意: 大きなHTMLファイルを開いています。"
            echo "推奨設定:"
            echo "- fullPage: false（必須）"
            echo "- raw: false（推奨）"
            echo "- または browser_snapshot() を使用"
        fi
    fi
    
    # browser_navigateで大きなファイルを開く場合の警告
    if [[ "$1" == *"browser_navigate"* ]] && [[ "$1" == *"results"* ]]; then
        echo "📝 リマインダー: 大きなHTMLファイルを開いた後のスクリーンショット撮影時は"
        echo "必ず fullPage: false を指定してください。"
    fi
fi

# 正常終了
exit 0