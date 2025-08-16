#!/bin/bash
# ローカル静的配信テストスクリプト

echo "🚀 HAQEI Analyzer ローカル静的配信テスト開始"
echo "=================================================="

# 1. 必要ファイル存在確認
echo "📁 1. 必要ファイル存在確認..."

required_files=(
    "public/os_analyzer_clean.html"
    "public/os_analyzer.html"
    "public/assets/H384H64database.js"
    "public/assets/js/questions-full.js"
    "public/js/lib/chart.min.js"
    "public/_headers"
    "public/netlify.toml"
)

missing_files=0

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (不足)"
        missing_files=$((missing_files + 1))
    fi
done

if [ $missing_files -gt 0 ]; then
    echo "❌ $missing_files 個のファイルが不足しています"
    exit 1
fi

# 2. ファイルサイズ確認
echo ""
echo "📊 2. HTMLファイルサイズ確認..."
for html_file in public/os_analyzer*.html; do
    if [ -f "$html_file" ]; then
        size=$(du -h "$html_file" | cut -f1)
        echo "   📄 $(basename $html_file): $size"
    fi
done

# 3. セキュリティ設定確認
echo ""
echo "🔒 3. セキュリティ設定確認..."
if grep -q "Content-Security-Policy" public/_headers; then
    echo "   ✅ CSP設定存在"
else
    echo "   ❌ CSP設定不足"
fi

if grep -q "X-Frame-Options" public/_headers; then
    echo "   ✅ X-Frame-Options設定存在"
else
    echo "   ❌ X-Frame-Options設定不足"
fi

# 4. JavaScript構文チェック
echo ""
echo "🔧 4. 主要JavaScriptファイル構文確認..."
js_files=(
    "public/assets/js/questions-full.js"
    "public/assets/js/app.js"
)

for js_file in "${js_files[@]}"; do
    if [ -f "$js_file" ]; then
        if node -c "$js_file" 2>/dev/null; then
            echo "   ✅ $(basename $js_file) 構文OK"
        else
            echo "   ❌ $(basename $js_file) 構文エラー"
        fi
    fi
done

# 5. テストサーバー起動準備
echo ""
echo "🌐 5. テストサーバー起動テスト..."

# 使用可能ポートの確認
test_port=8080
while lsof -Pi :$test_port -sTCP:LISTEN -t >/dev/null; do
    test_port=$((test_port + 1))
done

echo "   📡 使用ポート: $test_port"

# バックグラウンドでサーバー起動
cd public
python3 -m http.server $test_port > /dev/null 2>&1 &
server_pid=$!

# サーバー起動を待機
sleep 2

# サーバー起動確認
if curl -s "http://localhost:$test_port/os_analyzer_clean.html" > /dev/null; then
    echo "   ✅ サーバー正常起動 (PID: $server_pid)"
    echo "   🌍 URL: http://localhost:$test_port/os_analyzer_clean.html"
    
    # HTMLファイルのレスポンス確認
    response_size=$(curl -s "http://localhost:$test_port/os_analyzer_clean.html" | wc -c)
    echo "   📦 レスポンスサイズ: $response_size bytes"
    
else
    echo "   ❌ サーバー起動失敗"
fi

# 6. 主要リソースの配信確認
echo ""
echo "📡 6. 主要リソース配信確認..."

resources=(
    "os_analyzer_clean.html"
    "assets/H384H64database.js"
    "assets/js/questions-full.js"
    "js/lib/chart.min.js"
    "css/os-analyzer.css"
)

working_resources=0
for resource in "${resources[@]}"; do
    if curl -s "http://localhost:$test_port/$resource" > /dev/null; then
        echo "   ✅ $resource"
        working_resources=$((working_resources + 1))
    else
        echo "   ❌ $resource (配信エラー)"
    fi
done

# 7. 結果サマリー
echo ""
echo "📊 配信テスト結果サマリー"
echo "=================================================="
echo "必要ファイル: $(( ${#required_files[@]} - missing_files ))/${#required_files[@]} 存在"
echo "リソース配信: $working_resources/${#resources[@]} 成功"

if [ $missing_files -eq 0 ] && [ $working_resources -eq ${#resources[@]} ]; then
    echo "🎉 ローカル静的配信準備完了！"
    echo ""
    echo "🚀 配信開始手順:"
    echo "1. cd public"
    echo "2. python3 -m http.server $test_port"
    echo "3. ブラウザで http://localhost:$test_port/os_analyzer_clean.html にアクセス"
    echo ""
    echo "⏸️  テストサーバーは起動中です (PID: $server_pid)"
    echo "    停止するには: kill $server_pid"
else
    echo "⚠️  配信準備に問題があります。上記のエラーを修正してください。"
    # サーバーが起動している場合は停止
    if [ ! -z "$server_pid" ]; then
        kill $server_pid 2>/dev/null
    fi
fi

echo "=================================================="