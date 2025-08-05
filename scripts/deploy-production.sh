#!/bin/bash
# HAQEIアナライザー本番デプロイメントスクリプト
# bunenjin哲学に基づく企業レベル運用デプロイ

set -euo pipefail

# カラー出力設定
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ログ関数
log_info() {
 echo -e "${BLUE}[INFO]${NC} $1"
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

# 設定変数
PROJECT_NAME="haqei-analyzer"
PRODUCTION_ENV="production"
STAGING_ENV="staging"
BLUE_GREEN_ENV="blue"
DEPLOY_TIMEOUT=600 # 10分
HEALTH_CHECK_TIMEOUT=300 # 5分

# 必要な環境変数チェック
check_env_vars() {
 log_info "環境変数をチェック中..."
 
 local required_vars=(
 "CLOUDFLARE_API_TOKEN"
 "CLOUDFLARE_ZONE_ID"
 "SENTRY_DSN"
 "GA4_MEASUREMENT_ID"
 )
 
 for var in "${required_vars[@]}"; do
 if [[ -z "${!var:-}" ]]; then
 log_error "必須環境変数 $var が設定されていません"
 exit 1
 fi
 done
 
 log_success "環境変数チェック完了"
}

# 事前チェック
pre_deployment_checks() {
 log_info "デプロイ前チェックを実行中..."
 
 # Git状態チェック
 if [[ -n $(git status --porcelain) ]]; then
 log_error "未コミットの変更があります"
 git status
 exit 1
 fi
 
 # ブランチチェック
 local current_branch=$(git branch --show-current)
 if [[ "$current_branch" != "main" ]]; then
 log_warning "現在のブランチ: $current_branch (mainブランチではありません)"
 read -p "続行しますか? (y/N): " -n 1 -r
 echo
 if [[ ! $REPLY =~ ^[Yy]$ ]]; then
 log_info "デプロイを中止しました"
 exit 0
 fi
 fi
 
 # 依存関係チェック
 log_info "依存関係をインストール中..."
 npm ci --production=false
 
 # セキュリティ監査
 log_info "セキュリティ監査を実行中..."
 npm audit --audit-level high
 
 log_success "事前チェック完了"
}

# テスト実行
run_tests() {
 log_info "テストスイートを実行中..."
 
 # 単体テスト
 npm run test:unit
 
 # E2Eテスト
 npm run test:e2e
 
 # セキュリティテスト
 npm run test:security
 
 # パフォーマンステスト
 npm run test:performance
 
 # bunenjin哲学準拠テスト
 npm run test:bunenjin
 
 # I Ching正統性テスト
 npm run test:iching
 
 log_success "すべてのテストが成功しました"
}

# ビルド実行
build_application() {
 log_info "本番ビルドを実行中..."
 
 # 環境変数設定
 export NODE_ENV=production
 export VITE_APP_BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
 
 # ビルド実行
 npm run build
 
 # ビルド結果検証
 if [[ ! -d "dist" ]]; then
 log_error "ビルドが失敗しました"
 exit 1
 fi
 
 # ビルドサイズチェック
 local build_size=$(du -sh dist | cut -f1)
 log_info "ビルドサイズ: $build_size"
 
 log_success "ビルド完了"
}

# Blue-Greenデプロイメント
deploy_blue_green() {
 log_info "Blue-Greenデプロイメントを開始..."
 
 # BlueEnvironmentにデプロイ
 log_info "Blue環境にデプロイ中..."
 wrangler pages deploy dist --project-name "$PROJECT_NAME-blue" --env blue
 
 # Health Check
 log_info "Blue環境のヘルスチェック中..."
 if ! health_check "https://blue.haqei.com"; then
 log_error "Blue環境のヘルスチェックが失敗しました"
 exit 1
 fi
 
 # トラフィック切り替え前の確認
 log_warning "Blue環境の準備が完了しました"
 log_info "Blue環境URL: https://blue.haqei.com"
 read -p "本番環境にトラフィックを切り替えますか? (y/N): " -n 1 -r
 echo
 
 if [[ $REPLY =~ ^[Yy]$ ]]; then
 # 本番環境にデプロイ
 log_info "本番環境にデプロイ中..."
 wrangler pages deploy dist --project-name "$PROJECT_NAME-production" --env production
 
 # 本番環境ヘルスチェック
 log_info "本番環境のヘルスチェック中..."
 if ! health_check "https://haqei.com"; then
 log_error "本番環境のヘルスチェックが失敗しました"
 log_warning "ロールバックを実行してください"
 exit 1
 fi
 
 log_success "本番デプロイメント完了!"
 else
 log_info "トラフィック切り替えをスキップしました"
 log_info "Blue環境で検証を続行してください"
 fi
}

# ヘルスチェック
health_check() {
 local url="$1"
 local max_attempts=30
 local attempt=1
 
 log_info "ヘルスチェック開始: $url"
 
 while [[ $attempt -le $max_attempts ]]; do
 if curl -f -s --max-time 10 "$url/health" > /dev/null; then
 log_success "ヘルスチェック成功 ($attempt/$max_attempts)"
 return 0
 fi
 
 log_info "ヘルスチェック待機中... ($attempt/$max_attempts)"
 sleep 10
 ((attempt++))
 done
 
 log_error "ヘルスチェックがタイムアウトしました"
 return 1
}

# ロールバック
rollback() {
 log_warning "ロールバックを実行中..."
 
 # 前回のデプロイメント情報を取得
 local previous_deployment=$(wrangler pages deployment list --project-name "$PROJECT_NAME-production" --format json | jq -r '.[1].id')
 
 if [[ "$previous_deployment" != "null" ]]; then
 # 前回のデプロイメントに戻す
 wrangler pages deployment promote "$previous_deployment" --project-name "$PROJECT_NAME-production"
 log_success "ロールバック完了"
 else
 log_error "ロールバック対象が見つかりませんでした"
 exit 1
 fi
}

# 通知送信
send_notification() {
 local status="$1"
 local message="$2"
 
 # Slack通知（設定されている場合）
 if [[ -n "${SLACK_WEBHOOK_URL:-}" ]]; then
 curl -X POST -H 'Content-type: application/json' \
 --data "{\"text\":\"[HAQEI] $status: $message\"}" \
 "$SLACK_WEBHOOK_URL"
 fi
 
 # Discord通知（設定されている場合）
 if [[ -n "${DISCORD_WEBHOOK_URL:-}" ]]; then
 curl -X POST -H 'Content-type: application/json' \
 --data "{\"content\":\"[HAQEI] $status: $message\"}" \
 "$DISCORD_WEBHOOK_URL"
 fi
}

# メイン実行
main() {
 log_info "HAQEIアナライザー本番デプロイメント開始"
 log_info "実行時刻: $(date)"
 
 # トラップ設定（エラー時の通知）
 trap 'send_notification "FAILED" "本番デプロイメントが失敗しました"' ERR
 
 # 実行確認
 read -p "本番環境にデプロイしますか? (y/N): " -n 1 -r
 echo
 if [[ ! $REPLY =~ ^[Yy]$ ]]; then
 log_info "デプロイを中止しました"
 exit 0
 fi
 
 # 実行ステップ
 check_env_vars
 pre_deployment_checks
 run_tests
 build_application
 deploy_blue_green
 
 # 成功通知
 send_notification "SUCCESS" "本番デプロイメントが正常に完了しました"
 
 log_success "デプロイメント完了!"
 log_info "本番URL: https://haqei.com"
 log_info "管理URL: https://dash.cloudflare.com"
}

# ヘルプ表示
show_help() {
 echo "HAQEIアナライザー本番デプロイメントスクリプト"
 echo
 echo "使用方法:"
 echo " $0 [オプション]"
 echo
 echo "オプション:"
 echo " -h, --help このヘルプを表示"
 echo " --rollback 前回のデプロイメントにロールバック"
 echo " --health-check URL ヘルスチェックのみ実行"
 echo
 echo "必要な環境変数:"
 echo " CLOUDFLARE_API_TOKEN"
 echo " CLOUDFLARE_ZONE_ID"
 echo " SENTRY_DSN"
 echo " GA4_MEASUREMENT_ID"
 echo
 echo "オプション環境変数:"
 echo " SLACK_WEBHOOK_URL (Slack通知用)"
 echo " DISCORD_WEBHOOK_URL (Discord通知用)"
}

# コマンドライン引数処理
case "${1:-}" in
 -h|--help)
 show_help
 exit 0
 ;;
 --rollback)
 rollback
 exit 0
 ;;
 --health-check)
 if [[ -n "${2:-}" ]]; then
 health_check "$2"
 else
 log_error "URL を指定してください"
 exit 1
 fi
 exit 0
 ;;
 *)
 main
 ;;
esac
