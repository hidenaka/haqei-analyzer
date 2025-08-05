#!/bin/bash
# HAQEIアナライザー本番環境ロールバックスクリプト
# 緊急時対応用高速ロールバックシステム

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
PROJECT_NAME="haqei-analyzer-production"
MAX_ROLLBACK_HISTORY=10
HEALTH_CHECK_TIMEOUT=300 # 5分

# ロールバック対象リスト取得
get_deployment_list() {
 log_info "デプロイメント履歴を取得中..."
 
 local deployments=$(wrangler pages deployment list \
 --project-name "$PROJECT_NAME" \
 --format json \
 | jq -r '.[:10] | .[] | "\(.id) \(.created_on) \(.deployment_trigger.metadata.commit_hash // "unknown") \(.url)"')
 
 if [[ -z "$deployments" ]]; then
 log_error "デプロイメント履歴が見つかりません"
 exit 1
 fi
 
 echo "$deployments"
}

# ロールバック対象選択
select_rollback_target() {
 local deployments="$1"
 
 log_info "利用可能なデプロイメント:"
 echo
 echo "番号 | デプロイメントID | 作成日時 | コミットハッシュ | URL"
 echo "-----|-------------|-----------|-------------|-----"
 
 local count=1
 while IFS= read -r deployment; do
 local id=$(echo "$deployment" | cut -d' ' -f1)
 local created=$(echo "$deployment" | cut -d' ' -f2)
 local commit=$(echo "$deployment" | cut -d' ' -f3)
 local url=$(echo "$deployment" | cut -d' ' -f4)
 
 printf "%4d | %12s | %s | %8s | %s\n" \
 "$count" "${id:0:8}..." "$created" "${commit:0:8}" "$url"
 
 ((count++))
 done <<< "$deployments"
 
 echo
 read -p "ロールバック先を選択してください (1-$((count-1))): " -r selected
 
 if [[ ! "$selected" =~ ^[0-9]+$ ]] || [[ "$selected" -lt 1 ]] || [[ "$selected" -gt $((count-1)) ]]; then
 log_error "無効な選択です"
 exit 1
 fi
 
 # 選択されたデプロイメントIDを取得
 local selected_deployment=$(echo "$deployments" | sed -n "${selected}p")
 local target_id=$(echo "$selected_deployment" | cut -d' ' -f1)
 
 echo "$target_id"
}

# ロールバック実行
perform_rollback() {
 local target_id="$1"
 
 log_warning "ロールバックを実行します"
 log_info "ターゲットデプロイメントID: $target_id"
 
 # 最終確認
 read -p "本当にロールバックしますか? (yes/no): " -r confirm
 if [[ "$confirm" != "yes" ]]; then
 log_info "ロールバックを中止しました"
 exit 0
 fi
 
 # ロールバック実行
 log_info "ロールバック実行中..."
 wrangler pages deployment promote "$target_id" --project-name "$PROJECT_NAME"
 
 if [[ $? -eq 0 ]]; then
 log_success "ロールバックが正常に完了しました"
 else
 log_error "ロールバックが失敗しました"
 exit 1
 fi
}

# ヘルスチェック
health_check() {
 local url="https://haqei.com"
 local max_attempts=30
 local attempt=1
 
 log_info "ロールバック後のヘルスチェック中..."
 
 while [[ $attempt -le $max_attempts ]]; do
 if curl -f -s --max-time 10 "$url/health" > /dev/null || \
 curl -f -s --max-time 10 "$url" > /dev/null; then
 log_success "ヘルスチェック成功 ($attempt/$max_attempts)"
 return 0
 fi
 
 log_info "ヘルスチェック待機中... ($attempt/$max_attempts)"
 sleep 10
 ((attempt++))
 done
 
 log_warning "ヘルスチェックがタイムアウトしましたが、ロールバックは完了しています"
 return 1
}

# 緊急ロールバック（前回のデプロイメントに自動復帰）
emergency_rollback() {
 log_warning "緊急ロールバックを実行中..."
 
 # 前回のデプロイメントIDを自動取得
 local previous_deployment=$(wrangler pages deployment list \
 --project-name "$PROJECT_NAME" \
 --format json \
 | jq -r '.[1].id')
 
 if [[ "$previous_deployment" == "null" || -z "$previous_deployment" ]]; then
 log_error "前回のデプロイメントが見つかりません"
 exit 1
 fi
 
 log_info "前回のデプロイメントに自動復帰: $previous_deployment"
 
 # 確認なしで自動実行
 wrangler pages deployment promote "$previous_deployment" --project-name "$PROJECT_NAME"
 
 if [[ $? -eq 0 ]]; then
 log_success "緊急ロールバックが正常に完了しました"
 health_check
 else
 log_error "緊急ロールバックが失敗しました"
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
 --data "{\"text\":\"[HAQEI ROLLBACK] $status: $message\"}" \
 "$SLACK_WEBHOOK_URL"
 fi
 
 # Discord通知（設定されている場合）
 if [[ -n "${DISCORD_WEBHOOK_URL:-}" ]]; then
 curl -X POST -H 'Content-type: application/json' \
 --data "{\"content\":\"[HAQEI ROLLBACK] $status: $message\"}" \
 "$DISCORD_WEBHOOK_URL"
 fi
}

# メイン実行
main() {
 log_info "HAQEIアナライザー本番環境ロールバックシステム"
 log_info "実行時刻: $(date)"
 
 # トラップ設定（エラー時の通知）
 trap 'send_notification "FAILED" "ロールバックが失敗しました"' ERR
 
 # デプロイメント履歴取得
 local deployments=$(get_deployment_list)
 
 # ロールバック対象選択
 local target_id=$(select_rollback_target "$deployments")
 
 # ロールバック実行
 perform_rollback "$target_id"
 
 # ヘルスチェック
 health_check
 
 # 成功通知
 send_notification "SUCCESS" "ロールバックが正常に完了しました"
 
 log_success "ロールバック完了!"
 log_info "本番URL: https://haqei.com"
}

# ヘルプ表示
show_help() {
 echo "HAQEIアナライザー本番環境ロールバックシステム"
 echo
 echo "使用方法:"
 echo " $0 [オプション]"
 echo
 echo "オプション:"
 echo " -h, --help このヘルプを表示"
 echo " --emergency 緊急ロールバック（前回のデプロイメントに自動復帰）"
 echo " --health-check ヘルスチェックのみ実行"
 echo " --list デプロイメント履歴のみ表示"
 echo
 echo "例:"
 echo " $0 # 対話式ロールバック"
 echo " $0 --emergency # 緊急ロールバック"
 echo " $0 --list # デプロイメント履歴表示"
}

# コマンドライン引数処理
case "${1:-}" in
 -h|--help)
 show_help
 exit 0
 ;;
 --emergency)
 emergency_rollback
 exit 0
 ;;
 --health-check)
 health_check
 exit 0
 ;;
 --list)
 get_deployment_list
 exit 0
 ;;
 *)
 main
 ;;
esac
