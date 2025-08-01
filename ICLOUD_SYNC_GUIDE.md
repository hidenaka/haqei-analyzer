# HAQEI Analyzer iCloud Drive 同期ガイド

## 🎯 概要

HAQEI AnalyzerのMCP環境設定をiCloud Driveを使用してMacBook AirとMac mini間で自動同期するシステムです。

## ✨ 特徴

- **☁️ iCloud Drive統合**: 設定ファイルの自動同期
- **🖥️ マルチデバイス対応**: MacBook Air ⇄ Mac mini
- **⚙️ 完全自動化**: ワンクリックセットアップ
- **🔄 継続同期**: 設定変更の自動反映
- **🛡️ バックアップ**: デバイス固有設定の安全な保存

## 📋 システム構成

### iCloud Drive フォルダ構造
```
~/Library/Mobile Documents/com~apple~CloudDocs/HAQEI-Analyzer-Config/
├── shared/                    # 全デバイス共通設定
│   ├── claude-mcp-config.json    # MCP設定テンプレート
│   ├── CLAUDE.md                 # プロジェクト指示書
│   ├── package.json              # Node.js依存関係
│   ├── cipher.config.yaml        # Cipher設定
│   └── .serena/project.yml       # Serena設定
├── device-specific/           # デバイス別設定
│   ├── macbook-air/
│   │   ├── .env.mcp                 # 環境変数
│   │   ├── claude_desktop_config.json  # Claude Desktop設定
│   │   └── *.sh                     # 起動スクリプト
│   └── mac-mini/
│       └── (同様の構成)
├── backups/                   # バックアップ
├── devices.json              # デバイス一覧
└── README.md                 # 説明書
```

## 🚀 セットアップ手順

### 1️⃣ MacBook Air（1台目）での初期設定

```bash
# プロジェクトディレクトリで実行
cd ~/Desktop/haqei-analyzer

# iCloud Drive同期設定
./setup-icloud-sync.sh

# 環境検証
./verify-mcp-setup.sh
```

**結果**: 
- iCloud Driveに設定フォルダが作成される
- 全ての設定ファイルがクラウドに保存される
- 同期スクリプトが生成される

### 2️⃣ Mac mini（2台目）での環境構築

#### 方法A: クイックスタート（推奨）
```bash
# プロジェクトをダウンロード
curl -O https://your-repo/mac-mini-quickstart.sh
chmod +x mac-mini-quickstart.sh

# ワンクリックセットアップ
./mac-mini-quickstart.sh
```

#### 方法B: 手動セットアップ
```bash
# プロジェクトディレクトリ作成
mkdir -p ~/Desktop/haqei-analyzer
cd ~/Desktop/haqei-analyzer

# iCloud Driveから同期
curl -O https://your-repo/sync-from-icloud.sh
chmod +x sync-from-icloud.sh
./sync-from-icloud.sh

# 環境構築
./setup-mcp-environment.sh
```

## 🔄 日常的な使用方法

### 設定変更を他のデバイスに同期

```bash
# MacBook Air で設定変更後
./setup-icloud-sync.sh  # 変更をiCloud Driveにアップロード

# Mac mini で最新設定を取得
./sync-from-icloud.sh   # iCloud Driveから最新設定をダウンロード
```

### 自動同期の有効化

```bash
# 1時間おきの自動同期を設定
./setup-auto-sync.sh

# 自動同期の制御
launchctl unload ~/Library/LaunchAgents/com.haqei.analyzer.sync.plist  # 停止
launchctl load ~/Library/LaunchAgents/com.haqei.analyzer.sync.plist    # 開始

# 同期ログ確認
tail -f ~/Library/Logs/haqei-sync.log
```

## 📋 利用可能なコマンド

| コマンド | 説明 | 使用場面 |
|---------|------|----------|
| `./setup-icloud-sync.sh` | iCloud Drive同期初期設定 | 1台目デバイス初期設定 |
| `./sync-from-icloud.sh` | 設定をiCloud Driveから取得 | 2台目以降、日常同期 |
| `./mac-mini-quickstart.sh` | Mac mini用ワンクリックセットアップ | Mac mini初期設定特化 |
| `./setup-mcp-environment.sh` | MCP環境構築 | 環境構築・再構築 |
| `./start-mcp-services.sh` | MCPサービス起動 | 開発開始時 |
| `./verify-mcp-setup.sh` | 環境検証 | トラブルシューティング |
| `./setup-auto-sync.sh` | 自動同期有効化 | 継続運用設定 |

## 🛠️ トラブルシューティング

### よくある問題と解決方法

#### 1. iCloud Driveに設定フォルダが見つからない
```bash
# 原因: iCloud Drive同期が未完了
# 解決: システム設定でiCloud Drive状況確認

# iCloud Drive強制同期
killall bird
sleep 5
open ~/Library/Mobile\ Documents/com~apple~CloudDocs/
```

#### 2. 設定ファイルが古い
```bash
# 最新設定を強制取得
./sync-from-icloud.sh

# タイムスタンプ確認
ls -la ~/Library/Mobile\ Documents/com~apple~CloudDocs/HAQEI-Analyzer-Config/
```

#### 3. Claude Desktopでの認識エラー
```bash
# Claude Desktop完全再起動
pkill -f "Claude Desktop"
sleep 3
open -a "Claude Desktop"

# MCP設定ファイル確認
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

#### 4. ポート競合
```bash
# 使用中のポート確認
lsof -i :3001

# 競合プロセス終了
pkill -f cipher-server
pkill -f node
```

#### 5. 権限エラー
```bash
# スクリプト実行権限付与
find . -name "*.sh" -exec chmod +x {} \;

# iCloud Driveアクセス権限確認
ls -la ~/Library/Mobile\ Documents/com~apple~CloudDocs/
```

### 環境診断コマンド

```bash
# 包括的環境診断
./verify-mcp-setup.sh

# iCloud Drive同期状況確認
ls -la ~/Library/Mobile\ Documents/com~apple~CloudDocs/HAQEI-Analyzer-Config/devices.json

# MCPサーバー接続状況
curl -s http://localhost:3001/health

# システム情報表示
uname -a
hostname
node --version
python3 --version
```

## 🔐 セキュリティとプライバシー

### データ保護
- **ローカル処理**: 機密データはデバイス内で処理
- **暗号化**: iCloud Drive標準暗号化
- **アクセス制御**: Apple ID認証による保護

### プライバシー設定
```bash
# 機密情報を環境変数から除外
echo "API_KEY=your_secret_key" >> .env.local
echo ".env.local" >> .gitignore
```

### バックアップ戦略
- **iCloud Drive**: 主要バックアップ
- **ローカル**: デバイス固有設定
- **Git**: コード・設定バージョン管理

## 📊 同期ステータス確認

### デバイス一覧表示
```bash
# 登録デバイス確認
cat ~/Library/Mobile\ Documents/com~apple~CloudDocs/HAQEI-Analyzer-Config/devices.json
```

### 同期履歴
```bash
# 最新同期情報
jq '.syncHistory[-5:]' ~/Library/Mobile\ Documents/com~apple~CloudDocs/HAQEI-Analyzer-Config/devices.json
```

### ファイル更新日時
```bash
# 設定ファイル更新日時確認
find ~/Library/Mobile\ Documents/com~apple~CloudDocs/HAQEI-Analyzer-Config/ -type f -exec ls -la {} \;
```

## 🎯 最適化のヒント

### パフォーマンス向上
1. **定期的クリーンアップ**: 不要なバックアップファイル削除
2. **選択的同期**: 大容量ファイルの除外設定
3. **帯域制限**: iCloud Drive同期速度調整

### ワークフロー効率化
1. **エイリアス設定**: よく使うコマンドのショートカット作成
2. **IDE統合**: VSCode/Cursorでのスクリプト実行設定
3. **通知設定**: 同期完了時の通知

## 🆘 サポート

### 問題報告時の情報
```bash
# システム情報収集
{
    echo "=== System Info ==="
    uname -a
    echo "=== Hostname ==="
    hostname
    echo "=== Node.js ==="
    node --version
    echo "=== Python ==="
    python3 --version
    echo "=== iCloud Drive ==="
    ls -la ~/Library/Mobile\ Documents/com~apple~CloudDocs/HAQEI-Analyzer-Config/
    echo "=== MCP Config ==="
    cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
} > haqei-debug-info.txt
```

### 緊急時復旧手順
1. **設定リセット**: `rm -rf ~/.claude && ./setup-mcp-environment.sh`
2. **iCloud再同期**: `./setup-icloud-sync.sh --force`
3. **完全再構築**: `./mac-mini-quickstart.sh --rebuild`

---

## 📈 将来の拡張予定

- **Windows対応**: OneDrive統合
- **Linux対応**: Nextcloud統合  
- **チーム共有**: 組織アカウント対応
- **バージョン管理**: 設定変更履歴追跡
- **競合解決**: 自動マージ機能

---

**作成日**: 2025年8月1日  
**対象デバイス**: MacBook Air ⇄ Mac mini  
**同期方式**: iCloud Drive  
**作成者**: HAQEI Analyzer Development Team