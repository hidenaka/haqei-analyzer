#!/bin/bash

# HAQEI Analyzer iCloud Drive 同期設定スクリプト
# MacBook Air / Mac mini 間での設定ファイル同期

echo "☁️  HAQEI Analyzer iCloud Drive同期セットアップ開始..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOSTNAME=$(hostname)

# iCloud Drive パス
ICLOUD_PATH="$HOME/Library/Mobile Documents/com~apple~CloudDocs"
HAQEI_ICLOUD_DIR="$ICLOUD_PATH/HAQEI-Analyzer-Config"

echo "📂 iCloud Drive パス: $ICLOUD_PATH"
echo "🎯 HAQEI設定フォルダ: $HAQEI_ICLOUD_DIR"

# iCloud Drive 利用可能性チェック
if [[ ! -d "$ICLOUD_PATH" ]]; then
    echo "❌ iCloud Drive が利用できません"
    echo "   macOS設定 > Apple ID > iCloud > iCloud Drive を有効にしてください"
    exit 1
else
    echo "✅ iCloud Drive 利用可能"
fi

# HAQEI設定ディレクトリ作成
echo "📁 HAQEI設定ディレクトリを作成中..."
mkdir -p "$HAQEI_ICLOUD_DIR/shared"
mkdir -p "$HAQEI_ICLOUD_DIR/device-specific"
mkdir -p "$HAQEI_ICLOUD_DIR/backups"

# デバイス識別
if [[ "$HOSTNAME" == *"macbook"* ]] || [[ "$HOSTNAME" == *"MacBook"* ]]; then
    DEVICE_ID="macbook-air"
    DEVICE_NAME="MacBook Air"
elif [[ "$HOSTNAME" == *"mac-mini"* ]] || [[ "$HOSTNAME" == *"Mac-mini"* ]] || [[ "$HOSTNAME" == *"macmini"* ]]; then
    DEVICE_ID="mac-mini"
    DEVICE_NAME="Mac mini"
else
    DEVICE_ID="unknown-$(hostname | tr '.' '-')"
    DEVICE_NAME="Unknown ($HOSTNAME)"
fi

echo "🖥️  デバイス: $DEVICE_NAME ($DEVICE_ID)"

# 共有設定ファイルリスト
SHARED_CONFIG_FILES=(
    "claude-mcp-config.json:MCP設定テンプレート"
    "device-specific-config.json:デバイス別設定"
    "mac-mini-setup-guide.md:セットアップガイド"
    "package.json:Node.js依存関係"
    "CLAUDE.md:プロジェクト指示書"
    ".serena/project.yml:Serena設定"
    "cipher.config.yaml:Cipher設定"
)

# デバイス固有設定ファイル
DEVICE_SPECIFIC_FILES=(
    ".env.mcp:環境変数"
    "start-mcp-services.sh:サービス起動スクリプト"
    "setup-mcp-environment.sh:環境セットアップスクリプト"
    "verify-mcp-setup.sh:検証スクリプト"
)

echo "📤 共有設定ファイルをiCloud Driveにコピー中..."

# 共有設定ファイルをiCloud Driveにコピー
for file_info in "${SHARED_CONFIG_FILES[@]}"; do
    IFS=':' read -r file desc <<< "$file_info"
    
    if [[ -f "$SCRIPT_DIR/$file" ]]; then
        # ディレクトリ構造を保持してコピー
        TARGET_DIR="$HAQEI_ICLOUD_DIR/shared/$(dirname "$file")"
        mkdir -p "$TARGET_DIR"
        
        cp "$SCRIPT_DIR/$file" "$HAQEI_ICLOUD_DIR/shared/$file"
        echo "✅ $desc → iCloud Drive"
    else
        echo "⚠️  $desc: $file が見つかりません"
    fi
done

echo "📱 デバイス固有設定ファイルをバックアップ中..."

# デバイス固有設定をデバイス別フォルダにコピー
DEVICE_DIR="$HAQEI_ICLOUD_DIR/device-specific/$DEVICE_ID"
mkdir -p "$DEVICE_DIR"

for file_info in "${DEVICE_SPECIFIC_FILES[@]}"; do
    IFS=':' read -r file desc <<< "$file_info"
    
    if [[ -f "$SCRIPT_DIR/$file" ]]; then
        cp "$SCRIPT_DIR/$file" "$DEVICE_DIR/$file"
        echo "✅ $desc → デバイス専用バックアップ"
    fi
done

# Claude Desktop設定もバックアップ
CLAUDE_CONFIG_PATHS=(
    "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
    "$HOME/.config/claude-desktop/config.json"
)

for config_path in "${CLAUDE_CONFIG_PATHS[@]}"; do
    if [[ -f "$config_path" ]]; then
        cp "$config_path" "$DEVICE_DIR/claude_desktop_config.json"
        echo "✅ Claude Desktop設定 → デバイス専用バックアップ"
        break
    fi
done

# 同期スクリプト生成
echo "🔄 同期スクリプトを生成中..."

SYNC_SCRIPT="$SCRIPT_DIR/sync-from-icloud.sh"
cat > "$SYNC_SCRIPT" << EOF
#!/bin/bash

# HAQEI Analyzer iCloud Drive からの同期スクリプト

echo "☁️  iCloud Drive から設定を同期中..."

SCRIPT_DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
ICLOUD_PATH="\$HOME/Library/Mobile Documents/com~apple~CloudDocs"
HAQEI_ICLOUD_DIR="\$ICLOUD_PATH/HAQEI-Analyzer-Config"

# iCloud Drive 利用可能性チェック
if [[ ! -d "\$HAQEI_ICLOUD_DIR" ]]; then
    echo "❌ iCloud Drive にHAQEI設定が見つかりません"
    echo "   他のデバイスでsetup-icloud-sync.shを実行してください"
    exit 1
fi

echo "📥 共有設定ファイルをダウンロード中..."

# 共有設定ファイルをローカルにコピー
SHARED_FILES=($(find "\$HAQEI_ICLOUD_DIR/shared" -type f -name "*.json" -o -name "*.md" -o -name "*.yml" -o -name "*.yaml"))

for file in "\${SHARED_FILES[@]}"; do
    RELATIVE_PATH="\${file#\$HAQEI_ICLOUD_DIR/shared/}"
    TARGET_PATH="\$SCRIPT_DIR/\$RELATIVE_PATH"
    
    # ディレクトリ作成
    mkdir -p "\$(dirname "\$TARGET_PATH")"
    
    # ファイルコピー（既存ファイルは確認）
    if [[ -f "\$TARGET_PATH" ]]; then
        echo "⚠️  \$RELATIVE_PATH は既に存在します（スキップ）"
    else
        cp "\$file" "\$TARGET_PATH"
        echo "✅ \$RELATIVE_PATH をダウンロード"
    fi
done

# デバイス固有設定の確認
HOSTNAME=\$(hostname)
if [[ "\$HOSTNAME" == *"macbook"* ]] || [[ "\$HOSTNAME" == *"MacBook"* ]]; then
    DEVICE_ID="macbook-air"
elif [[ "\$HOSTNAME" == *"mac-mini"* ]] || [[ "\$HOSTNAME" == *"Mac-mini"* ]] || [[ "\$HOSTNAME" == *"macmini"* ]]; then
    DEVICE_ID="mac-mini"
else
    DEVICE_ID="unknown-\$(hostname | tr '.' '-')"
fi

DEVICE_DIR="\$HAQEI_ICLOUD_DIR/device-specific/\$DEVICE_ID"

if [[ -d "\$DEVICE_DIR" ]]; then
    echo "📱 デバイス固有設定を復元中..."
    
    # .env.mcp復元
    if [[ -f "\$DEVICE_DIR/.env.mcp" ]]; then
        cp "\$DEVICE_DIR/.env.mcp" "\$SCRIPT_DIR/.env.mcp"
        echo "✅ 環境変数を復元"
    fi
    
    # Claude Desktop設定復元
    if [[ -f "\$DEVICE_DIR/claude_desktop_config.json" ]]; then
        CLAUDE_CONFIG_DIR="\$HOME/Library/Application Support/Claude"
        mkdir -p "\$CLAUDE_CONFIG_DIR"
        cp "\$DEVICE_DIR/claude_desktop_config.json" "\$CLAUDE_CONFIG_DIR/claude_desktop_config.json"
        echo "✅ Claude Desktop設定を復元"
    fi
else
    echo "⚠️  このデバイス(\$DEVICE_ID)の専用設定が見つかりません"
    echo "   setup-mcp-environment.sh を実行して新規設定を作成してください"
fi

echo "🔧 MCP環境セットアップを実行中..."
if [[ -f "\$SCRIPT_DIR/setup-mcp-environment.sh" ]]; then
    chmod +x "\$SCRIPT_DIR/setup-mcp-environment.sh"
    "\$SCRIPT_DIR/setup-mcp-environment.sh"
else
    echo "❌ setup-mcp-environment.sh が見つかりません"
fi

echo "✅ iCloud Drive同期完了！"
echo ""
echo "🚀 次のステップ:"
echo "   1. Claude Desktop を再起動"
echo "   2. ./start-mcp-services.sh でサービス起動テスト"
echo "   3. ./verify-mcp-setup.sh で環境検証"

EOF

chmod +x "$SYNC_SCRIPT"

# 自動同期設定スクリプト生成
AUTO_SYNC_SCRIPT="$SCRIPT_DIR/setup-auto-sync.sh"
cat > "$AUTO_SYNC_SCRIPT" << 'EOF'
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

EOF

chmod +x "$AUTO_SYNC_SCRIPT"

# README作成
README_PATH="$HAQEI_ICLOUD_DIR/README.md"
cat > "$README_PATH" << 'EOF'
# HAQEI Analyzer iCloud Drive 同期設定

このフォルダはHAQEI AnalyzerのMCP環境設定をMacBook AirとMac mini間で同期するために使用されます。

## 📁 フォルダ構造

- `shared/` - 全デバイス共通の設定ファイル
- `device-specific/` - デバイス固有の設定（macbook-air, mac-mini）
- `backups/` - 設定のバックアップ

## 🔄 同期方法

### 初回セットアップ（1台目のデバイス）
```bash
./setup-icloud-sync.sh
```

### 2台目以降のデバイス
```bash
./sync-from-icloud.sh
```

### 自動同期設定
```bash
./setup-auto-sync.sh
```

## 📋 含まれる設定

### 共有設定
- MCP設定テンプレート
- プロジェクト指示書
- 依存関係情報
- Serena/Cipher設定

### デバイス固有設定
- 環境変数
- Claude Desktop設定
- パス設定
- 起動スクリプト

## ⚠️ 注意事項

- iCloud Drive の同期が完了するまで時間がかかる場合があります
- 設定変更後は他のデバイスで同期を実行してください
- 競合が発生した場合は手動で解決してください

---

Generated: $(date)
Device: $(hostname)
EOF

# デバイス一覧ファイル作成
DEVICES_FILE="$HAQEI_ICLOUD_DIR/devices.json"
cat > "$DEVICES_FILE" << EOF
{
  "lastUpdated": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "devices": {
    "$DEVICE_ID": {
      "hostname": "$HOSTNAME",
      "deviceName": "$DEVICE_NAME",
      "lastSync": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
      "status": "active"
    }
  },
  "syncHistory": [
    {
      "device": "$DEVICE_ID",
      "action": "initial_setup",
      "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    }
  ]
}
EOF

echo ""
echo "☁️  iCloud Drive同期セットアップ完了！"
echo ""
echo "📋 作成されたファイル:"
echo "   📁 iCloud設定フォルダ: $HAQEI_ICLOUD_DIR"
echo "   🔄 同期スクリプト: $SYNC_SCRIPT"
echo "   ⚙️  自動同期設定: $AUTO_SYNC_SCRIPT"
echo ""
echo "🚀 他のデバイスでの使用方法:"
echo "   1. このプロジェクトをクローン/ダウンロード"
echo "   2. ./sync-from-icloud.sh を実行"
echo "   3. Claude Desktop を再起動"
echo ""
echo "💡 利用可能なコマンド:"
echo "   📥 設定同期: ./sync-from-icloud.sh"
echo "   ⚙️  自動同期: ./setup-auto-sync.sh"
echo "   🔍 環境確認: ./verify-mcp-setup.sh"
echo ""
echo "✨ Happy Coding with HAQEI + iCloud Sync! ✨"