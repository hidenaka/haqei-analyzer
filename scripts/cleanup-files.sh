#!/bin/bash

# ファイル整理実行スクリプト
# 作成日: 2025年8月18日
# 目的: 不要ファイルの安全な整理

set -e  # エラー時に停止

# 色付き出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== ファイル整理スクリプト（全形式対応版） ===${NC}"
echo "実行日時: $(date)"
echo ""

# 容量確認
echo -e "${YELLOW}現在のpublicディレクトリ容量:${NC}"
du -sh public/
echo ""

# Step 1: バックアップ作成
echo -e "${YELLOW}Step 1: バックアップ作成${NC}"
BACKUP_FILE="backup-before-cleanup-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$BACKUP_FILE" public/
echo -e "${GREEN}✓ バックアップ作成完了: $BACKUP_FILE${NC}"
echo ""

# Step 2: ディレクトリ作成
echo -e "${YELLOW}Step 2: 整理用ディレクトリ作成${NC}"
mkdir -p archives/2025-08
mkdir -p quarantine
echo -e "${GREEN}✓ ディレクトリ作成完了${NC}"
echo ""

# Step 3: 削除リスト作成
echo -e "${YELLOW}Step 3: 削除対象ファイルリスト作成${NC}"
echo "=== 削除対象ファイル ===" > deleted-files.log
echo "実行日時: $(date)" >> deleted-files.log
echo "" >> deleted-files.log

# 日付付きファイルをリストアップ
echo "日付付きファイル:" >> deleted-files.log
ls public/20250814_*.* 2>/dev/null >> deleted-files.log || true
ls public/20250815_*.* 2>/dev/null >> deleted-files.log || true
ls public/20250816_*.* 2>/dev/null >> deleted-files.log || true

echo "" >> deleted-files.log
echo "テストファイル:" >> deleted-files.log
ls public/test-*.* 2>/dev/null >> deleted-files.log || true

echo "" >> deleted-files.log
echo "スクリーンショットPNG (2.9MB):" >> deleted-files.log
ls -lah public/future-simulator-*.png 2>/dev/null >> deleted-files.log || true

echo "" >> deleted-files.log
echo "古いレポート:" >> deleted-files.log
ls public/DAY*.md public/PHASE*.md public/VIRTUAL*.md 2>/dev/null >> deleted-files.log || true

echo -e "${GREEN}✓ 削除リスト作成完了${NC}"
echo ""

# Step 4: 実行確認
echo -e "${RED}=== 実行確認 ===${NC}"
echo "以下の処理を実行します:"
echo "1. 日付付きファイルの削除（20250814-16）"
echo "2. テストファイルの削除（test-*）"
echo "3. スクリーンショットPNGの削除（2.9MB）"
echo "4. 古いレポートMDの削除"
echo "5. V2系ファイルのアーカイブ"
echo "6. Claude Flowメトリクスの削除"
echo ""
read -p "実行しますか？ (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}キャンセルしました${NC}"
    exit 1
fi

# Step 5: DELETE処理（安全な削除）
echo -e "${YELLOW}Step 5: 不要ファイル削除${NC}"

# 日付付きファイル削除
echo "- 日付付きファイル削除中..."
rm -f public/20250814_*.{js,html,mjs,md} 2>/dev/null || true
rm -f public/20250815_*.{js,html,mjs} 2>/dev/null || true
rm -f public/20250816_*.{js,mjs} 2>/dev/null || true

# テストファイル削除
echo "- テストファイル削除中..."
rm -f public/test-*.{js,html} 2>/dev/null || true
rm -f public/qa_integration_test_*.mjs 2>/dev/null || true

# スクリーンショットPNG削除（2.9MB）
echo "- スクリーンショットPNG削除中（2.9MB節約）..."
rm -f public/future-simulator-*.png 2>/dev/null || true

# 古いレポートMD削除
echo "- 古いレポートMD削除中..."
rm -f public/DAY*.md 2>/dev/null || true
rm -f public/PHASE*.md 2>/dev/null || true
rm -f public/VIRTUAL*.md 2>/dev/null || true

# サーバーログ削除
echo "- サーバーログ削除中..."
rm -f public/server.log 2>/dev/null || true

# Claude Flowメトリクス削除
echo "- Claude Flowメトリクス削除中..."
rm -rf public/.claude-flow 2>/dev/null || true
rm -rf public/*/.claude-flow 2>/dev/null || true

echo -e "${GREEN}✓ 削除完了${NC}"
echo ""

# Step 6: ARCHIVE処理
echo -e "${YELLOW}Step 6: アーカイブ処理${NC}"

# V2系ファイルをアーカイブ
if ls public/js/V2*.js 1> /dev/null 2>&1; then
    mv public/js/V2*.js archives/2025-08/ 2>/dev/null
    echo "- V2系ファイルをアーカイブしました"
fi

if ls public/js/v2-*.js 1> /dev/null 2>&1; then
    mv public/js/v2-*.js archives/2025-08/ 2>/dev/null
    echo "- v2系ファイルをアーカイブしました"
fi

# ResultsPageV2もアーカイブ
if [ -f "public/js/ResultsPageV2.js" ]; then
    mv public/js/ResultsPageV2.js archives/2025-08/
    echo "- ResultsPageV2.jsをアーカイブしました"
fi

echo -e "${GREEN}✓ アーカイブ完了${NC}"
echo ""

# Step 7: レポート作成
echo -e "${YELLOW}Step 7: 整理結果レポート${NC}"

REMAINING_JS=$(ls public/js/*.js 2>/dev/null | wc -l)
ARCHIVED_COUNT=$(ls archives/2025-08/*.js 2>/dev/null | wc -l || echo "0")
FINAL_SIZE=$(du -sh public/ | cut -f1)

echo "=== 整理結果 ===" | tee cleanup-report.txt
echo "実行日時: $(date)" | tee -a cleanup-report.txt
echo "" | tee -a cleanup-report.txt
echo "【ファイル数】" | tee -a cleanup-report.txt
echo "残存JSファイル: $REMAINING_JS" | tee -a cleanup-report.txt
echo "アーカイブ数: $ARCHIVED_COUNT" | tee -a cleanup-report.txt
echo "" | tee -a cleanup-report.txt
echo "【容量】" | tee -a cleanup-report.txt
echo "最終容量: $FINAL_SIZE" | tee -a cleanup-report.txt
echo "削減: 約3MB（主にPNG画像）" | tee -a cleanup-report.txt
echo "" | tee -a cleanup-report.txt
echo "【バックアップ】" | tee -a cleanup-report.txt
echo "ファイル: $BACKUP_FILE" | tee -a cleanup-report.txt
echo ""

echo -e "${GREEN}=== 整理完了 ===${NC}"
echo ""
echo "次のステップ:"
echo "1. npm run mcp で動作確認"
echo "2. 問題があれば: tar -xzf $BACKUP_FILE で復元"
echo "3. 1週間後にquarantine処理を実行"
echo ""
echo "詳細は以下のファイルを参照:"
echo "- deleted-files.log（削除リスト）"
echo "- cleanup-report.txt（実行結果）"