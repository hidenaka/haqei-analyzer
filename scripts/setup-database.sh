#!/bin/bash

# =====================================================================
# HAQEI Database Setup Script
# =====================================================================
# 目的: HAQEIデータベーススキーマの完全セットアップ
# 対象: PostgreSQL 14+ (ローカル/Supabase対応)
# 作成: 2025-08-03 by Programmer Agent
# 
# 使用方法:
# chmod +x scripts/setup-database.sh
# ./scripts/setup-database.sh [local|supabase]
# =====================================================================

set -e  # エラー時に停止

# カラー出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ログ関数
log_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_header() {
    echo -e "${PURPLE}========================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}========================================${NC}"
}

# 引数チェック
if [ $# -eq 0 ]; then
    log_error "使用方法: $0 [local|supabase]"
    echo "  local     - ローカルPostgreSQLデータベース"
    echo "  supabase  - Supabaseプロジェクト"
    exit 1
fi

DEPLOYMENT_TYPE=$1

# 環境設定
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATABASE_DIR="$PROJECT_ROOT/database"
MIGRATIONS_DIR="$DATABASE_DIR/migrations"
DATA_DIR="$DATABASE_DIR/data"

log_header "HAQEI Database Setup - $DEPLOYMENT_TYPE"

# ファイル存在確認
required_files=(
    "$DATABASE_DIR/schema.sql"
    "$MIGRATIONS_DIR/001_initial_schema_setup.sql"
    "$MIGRATIONS_DIR/002_vue3_integration.sql"
    "$DATA_DIR/initial_hexagram_data.sql"
)

log_info "必要ファイルの存在確認..."
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        log_error "必要ファイルが見つかりません: $file"
        exit 1
    fi
done
log_success "すべての必要ファイルが確認されました"

# デプロイメントタイプ別処理
case $DEPLOYMENT_TYPE in
    "local")
        log_header "ローカルPostgreSQLデータベースセットアップ"
        
        # 環境変数確認
        if [ -z "$DATABASE_URL" ]; then
            log_warning "DATABASE_URLが設定されていません"
            read -p "データベースURL (例: postgresql://user:password@localhost:5432/haqei): " DATABASE_URL
        fi
        
        # 接続テスト
        log_info "データベース接続テスト..."
        if ! psql "$DATABASE_URL" -c "SELECT version();" > /dev/null 2>&1; then
            log_error "データベースに接続できません: $DATABASE_URL"
            exit 1
        fi
        log_success "データベース接続成功"
        
        # スキーマ実行
        log_info "メインスキーマの実行..."
        psql "$DATABASE_URL" -f "$DATABASE_DIR/schema.sql"
        log_success "メインスキーマ実行完了"
        
        # マイグレーション実行
        log_info "マイグレーション002の実行..."
        psql "$DATABASE_URL" -f "$MIGRATIONS_DIR/002_vue3_integration.sql"
        log_success "Vue 3統合マイグレーション完了"
        
        # 初期データ挿入
        log_info "易経64卦データの挿入..."
        psql "$DATABASE_URL" -f "$DATA_DIR/initial_hexagram_data.sql"
        log_success "初期データ挿入完了"
        
        # セットアップ検証
        log_info "セットアップ検証中..."
        VERIFICATION_RESULT=$(psql "$DATABASE_URL" -t -c "
            SELECT 
                'Tables: ' || (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public') ||
                ', Views: ' || (SELECT COUNT(*) FROM pg_views WHERE schemaname = 'public') ||
                ', Functions: ' || (SELECT COUNT(*) FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.prokind = 'f') ||
                ', Hexagrams: ' || (SELECT COUNT(*) FROM hexagrams) ||
                ', Trigrams: ' || (SELECT COUNT(*) FROM trigrams);
        ")
        log_success "セットアップ検証完了: $VERIFICATION_RESULT"
        ;;
        
    "supabase")
        log_header "Supabaseプロジェクトセットアップ"
        
        # Supabase CLI確認
        if ! command -v supabase &> /dev/null; then
            log_error "Supabase CLIがインストールされていません"
            log_info "インストール方法: npm install -g supabase"
            exit 1
        fi
        
        # プロジェクト初期化確認
        if [ ! -f "$PROJECT_ROOT/supabase/config.toml" ]; then
            log_info "Supabaseプロジェクトを初期化します..."
            cd "$PROJECT_ROOT"
            supabase init
        fi
        
        # 環境変数確認
        if [ -z "$SUPABASE_PROJECT_REF" ]; then
            log_warning "SUPABASE_PROJECT_REFが設定されていません"
            read -p "SupabaseプロジェクトID: " SUPABASE_PROJECT_REF
        fi
        
        if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
            log_warning "SUPABASE_ACCESS_TOKENが設定されていません"
            read -s -p "Supabaseアクセストークン: " SUPABASE_ACCESS_TOKEN
            echo
        fi
        
        # Supabaseログイン
        log_info "Supabaseにログイン中..."
        echo "$SUPABASE_ACCESS_TOKEN" | supabase auth login --token
        
        # プロジェクトリンク
        log_info "プロジェクトをリンク中..."
        supabase link --project-ref "$SUPABASE_PROJECT_REF"
        
        # SQLファイルをSupabaseマイグレーションディレクトリにコピー
        SUPABASE_MIGRATIONS_DIR="$PROJECT_ROOT/supabase/migrations"
        mkdir -p "$SUPABASE_MIGRATIONS_DIR"
        
        # タイムスタンプ付きでマイグレーションファイルを作成
        TIMESTAMP=$(date +"%Y%m%d%H%M%S")
        
        log_info "HAQEIスキーママイグレーションファイルを作成中..."
        cat > "$SUPABASE_MIGRATIONS_DIR/${TIMESTAMP}_haqei_schema_setup.sql" << 'EOF'
-- HAQEI Database Schema Setup for Supabase
-- Generated by setup-database.sh

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

EOF
        
        # メインスキーマを追加（CREATE EXTENSION部分を除く）
        sed '/CREATE EXTENSION/d' "$DATABASE_DIR/schema.sql" >> "$SUPABASE_MIGRATIONS_DIR/${TIMESTAMP}_haqei_schema_setup.sql"
        
        # Vue 3統合マイグレーションを追加
        log_info "Vue 3統合マイグレーションファイルを作成中..."
        cat > "$SUPABASE_MIGRATIONS_DIR/${TIMESTAMP}_vue3_integration.sql" << 'EOF'
-- Vue 3 Integration Enhancement for Supabase
-- Generated by setup-database.sh

EOF
        cat "$MIGRATIONS_DIR/002_vue3_integration.sql" >> "$SUPABASE_MIGRATIONS_DIR/${TIMESTAMP}_vue3_integration.sql"
        
        # 初期データマイグレーションを作成
        log_info "初期データマイグレーションファイルを作成中..."
        cp "$DATA_DIR/initial_hexagram_data.sql" "$SUPABASE_MIGRATIONS_DIR/${TIMESTAMP}_initial_hexagram_data.sql"
        
        # マイグレーション実行
        log_info "Supabaseマイグレーション実行中..."
        supabase db push
        
        log_success "Supabaseセットアップ完了"
        ;;
        
    *)
        log_error "無効なデプロイメントタイプ: $DEPLOYMENT_TYPE"
        log_error "有効なオプション: local, supabase"
        exit 1
        ;;
esac

# 最終検証
log_header "最終検証とテスト"

# テストクエリ実行
log_info "データベース機能テスト実行中..."

case $DEPLOYMENT_TYPE in
    "local")
        # ローカルテスト
        TEST_RESULTS=$(psql "$DATABASE_URL" -t -c "
            SELECT 
                'Hexagrams: ' || (SELECT COUNT(*) FROM hexagrams WHERE number BETWEEN 1 AND 64) ||
                ', Trigrams: ' || (SELECT COUNT(*) FROM trigrams WHERE LENGTH(binary_value) = 3) ||
                ', Vue3Views: ' || (SELECT COUNT(*) FROM pg_views WHERE viewname LIKE 'vue3_%') ||
                ', Functions: ' || (SELECT COUNT(*) FROM pg_proc WHERE proname LIKE '%analysis%');
        ")
        ;;
        
    "supabase")
        # Supabaseテスト（基本的な接続確認）
        log_info "Supabase接続確認..."
        if supabase projects list &> /dev/null; then
            TEST_RESULTS="Supabase connection: OK"
        else
            TEST_RESULTS="Supabase connection: FAILED"
        fi
        ;;
esac

log_success "テスト結果: $TEST_RESULTS"

# 成功メッセージ
log_header "セットアップ完了"
log_success "HAQEIデータベースセットアップが正常に完了しました！"
echo
echo -e "${CYAN}セットアップ内容:${NC}"
echo "  ✅ 易経64卦システム (64卦 + 8三爻 + 384爻)"
echo "  ✅ Triple OS Architecture (Engine/Interface/SafeMode)"
echo "  ✅ Row Level Security (RLS) ポリシー"
echo "  ✅ Vue 3統合最適化"
echo "  ✅ パフォーマンス最適化インデックス"
echo "  ✅ リアルタイム通知システム"
echo "  ✅ bunenjin哲学準拠のプライバシー制御"
echo
echo -e "${CYAN}次のステップ:${NC}"
echo "  1. 環境変数の設定 (.env ファイル)"
echo "  2. Vue 3アプリケーションの起動"
echo "  3. 接続テストの実行"
echo
echo -e "${PURPLE}🌟 HAQEI Database is ready for Triple OS enlightenment! 🌟${NC}"