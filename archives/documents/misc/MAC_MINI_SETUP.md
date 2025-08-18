# Mac mini セットアップガイド

## 🖥️ Mac miniでの HAQEI 開発環境セットアップ

### 1. プロジェクトの取得

**方法A: iCloud Drive経由（推奨）**
```bash
# iCloud Drive同期を確認
ls ~/Library/Mobile\ Documents/com~apple~CloudDocs/HAQEI-Cross-Device-Sync/

# プロジェクトをコピー（Mac miniの任意の場所）
cp -r /path/to/existing/haqei-analyzer ~/haqei-analyzer
cd ~/haqei-analyzer
```

**方法B: Git経由**
```bash
git clone [your-repo-url] haqei-analyzer
cd haqei-analyzer
```

### 2. Mac mini環境セットアップ

```bash
# クロスデバイス同期セットアップ
./scripts/cross-device-sync.sh setup

# 最新状態を取得
./scripts/cross-device-sync.sh pull

# 依存関係インストール
npm install
```

### 3. Mac mini固有起動スクリプト使用

```bash
# Mac mini用起動スクリプトが自動生成される
./start-[mac-mini-hostname].sh

# 例: ./start-mac-mini.local.sh
```

### 4. 開発ワークフロー

**Mac miniで開発開始時:**
```bash
cd ~/haqei-analyzer
./scripts/cross-device-sync.sh pull  # 最新状態取得
./start-mac-mini.local.sh            # 開発環境起動
```

**開発終了時:**
```bash
./scripts/cross-device-sync.sh push  # 変更をiCloud Driveに保存
```

**MacBook Airに戻る時:**
```bash
./scripts/cross-device-sync.sh pull  # Mac miniの変更を取得
```

### 5. 自動デバイス識別

- Mac miniは自動的に異なるポートを使用
- デバイス固有の設定が自動生成
- 競合なしで両方のMacで同時開発可能

### 6. トラブルシューティング

**iCloud Drive同期が遅い場合:**
```bash
# Git ベースの同期に切り替え
git add .
git commit -m "Mac mini update"
git push origin main
```

**ポート競合が発生した場合:**
```bash
# .env.[device-name] ファイルでポート変更
export CIPHER_PORT=3004  # 任意の空きポート
```

## ✅ 完了！

これでMacBook AirとMac miniの両方で同じHAQEIプロジェクトを効率的に開発できます。