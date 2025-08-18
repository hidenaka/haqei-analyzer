#!/bin/bash

# HAQEI Analyzer 自動同期セットアップ

echo "🔄 HAQEI Analyzer 自動同期設定..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# launchd用plist作成
PLIST_PATH="$HOME/Library/LaunchAgents/com.haqei.analyzer.sync.plist"

cat > "$PLIST_PATH" << PLIST_EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.haqei.analyzer.sync</string>
    <key>ProgramArguments</key>
    <array>
        <string>bash</string>
        <string>$SCRIPT_DIR/sync-from-icloud.sh</string>
    </array>
    <key>StartInterval</key>
    <integer>3600</integer>
    <key>RunAtLoad</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$HOME/Library/Logs/haqei-sync.log</string>
    <key>StandardErrorPath</key>
    <string>$HOME/Library/Logs/haqei-sync-error.log</string>
</dict>
</plist>
PLIST_EOF

echo "✅ 自動同期設定作成: $PLIST_PATH"

# launchd登録
launchctl load "$PLIST_PATH"
echo "✅ 自動同期サービス開始（1時間間隔）"

echo "📋 自動同期制御コマンド:"
echo "   停止: launchctl unload $PLIST_PATH"
echo "   開始: launchctl load $PLIST_PATH"
echo "   ログ: tail -f $HOME/Library/Logs/haqei-sync.log"

