#!/bin/bash
# HAQEIアナライザーヘルスチェックシステム
# 本番環境の総合的なシステム状態モニタリング

set -euo pipefail

# カラー出力設定
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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
PRODUCTION_URL="https://haqei.com"
STAGING_URL="https://staging.haqei.com"
BLUE_URL="https://blue.haqei.com"
API_BASE_URL="https://api.haqei.com"
TIMEOUT=10
MAX_RESPONSE_TIME=3000 # 3秒

# グローバル状態追跡
declare -A health_status
overall_status="healthy"

# HTTPステータスチェック
check_http_status() {
 local name="$1"
 local url="$2"
 local expected_status="${3:-200}"
 
 log_info "$name のHTTPステータスをチェック中: $url"
 
 local start_time=$(date +%s%3N)
 local response=$(curl -s -w "%{http_code},%{time_total}" --max-time $TIMEOUT "$url" -o /dev/null || echo "000,0")
 local end_time=$(date +%s%3N)
 
 local http_code=$(echo "$response" | cut -d',' -f1)
 local response_time=$(echo "$response" | cut -d',' -f2)
 local response_time_ms=$(echo "$response_time * 1000" | bc -l | cut -d'.' -f1)
 
 if [[ "$http_code" == "$expected_status" ]]; then
 if [[ $response_time_ms -le $MAX_RESPONSE_TIME ]]; then
 log_success "$name: OK (ステータス: $http_code, 応答時間: ${response_time_ms}ms)"
 health_status["$name"]="healthy"
 else
 log_warning "$name: SLOW (ステータス: $http_code, 応答時間: ${response_time_ms}ms)"
 health_status["$name"]="degraded"
 overall_status="degraded"
 fi
 else
 log_error "$name: FAILED (ステータス: $http_code, 応答時間: ${response_time_ms}ms)"
 health_status["$name"]="unhealthy"
 overall_status="unhealthy"
 fi
}

# APIエンドポイントチェック
check_api_endpoint() {
 local name="$1"
 local endpoint="$2"
 local expected_status="${3:-200}"
 
 log_info "$name APIエンドポイントをチェック中: $endpoint"
 
 local response=$(curl -s -w "%{http_code}" --max-time $TIMEOUT "$endpoint" || echo "000")
 local http_code="$response"
 
 if [[ "$http_code" == "$expected_status" ]]; then
 log_success "$name API: OK (ステータス: $http_code)"
 health_status["${name}_api"]="healthy"
 else
 log_error "$name API: FAILED (ステータス: $http_code)"
 health_status["${name}_api"]="unhealthy"
 overall_status="unhealthy"
 fi
}

# SSL証明書チェック
check_ssl_certificate() {
 local name="$1"
 local domain="$2"
 
 log_info "$name のSSL証明書をチェック中: $domain"
 
 local expiry_date=$(echo | openssl s_client -servername "$domain" -connect "$domain":443 2>/dev/null | \
 openssl x509 -noout -dates | grep 'notAfter' | cut -d= -f2)
 
 if [[ -n "$expiry_date" ]]; then
 local expiry_timestamp=$(date -d "$expiry_date" +%s)
 local current_timestamp=$(date +%s)
 local days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
 
 if [[ $days_until_expiry -gt 30 ]]; then
 log_success "$name SSL: OK (有効期限: $expiry_date, 残り${days_until_expiry}日)"
 health_status["${name}_ssl"]="healthy"
 elif [[ $days_until_expiry -gt 7 ]]; then
 log_warning "$name SSL: WARNING (有効期限: $expiry_date, 残り${days_until_expiry}日)"
 health_status["${name}_ssl"]="degraded"
 overall_status="degraded"
 else
 log_error "$name SSL: CRITICAL (有効期限: $expiry_date, 残り${days_until_expiry}日)"
 health_status["${name}_ssl"]="unhealthy"
 overall_status="unhealthy"
 fi
 else
 log_error "$name SSL: FAILED (SSL証明書情報を取得できません)"
 health_status["${name}_ssl"]="unhealthy"
 overall_status="unhealthy"
 fi
}

# DNS解決チェック
check_dns_resolution() {
 local name="$1"
 local domain="$2"
 
 log_info "$name のDNS解決をチェック中: $domain"
 
 local ip_address=$(dig +short "$domain" A | head -n1)
 
 if [[ -n "$ip_address" && "$ip_address" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
 log_success "$name DNS: OK (IP: $ip_address)"
 health_status["${name}_dns"]="healthy"
 else
 log_error "$name DNS: FAILED (解決できません)"
 health_status["${name}_dns"]="unhealthy"
 overall_status="unhealthy"
 fi
}

# コンテンツ整合性チェック
check_content_integrity() {
 local name="$1"
 local url="$2"
 local expected_keywords=("${@:3}")
 
 log_info "$name のコンテンツ整合性をチェック中"
 
 local content=$(curl -s --max-time $TIMEOUT "$url" || echo "")
 
 if [[ -z "$content" ]]; then
 log_error "$name コンテンツ: FAILED (コンテンツを取得できません)"
 health_status["${name}_content"]="unhealthy"
 overall_status="unhealthy"
 return
 fi
 
 local missing_keywords=()
 for keyword in "${expected_keywords[@]}"; do
 if [[ "$content" != *"$keyword"* ]]; then
 missing_keywords+=("$keyword")
 fi
 done
 
 if [[ ${#missing_keywords[@]} -eq 0 ]]; then
 log_success "$name コンテンツ: OK (必要なキーワードがすべて存在)"
 health_status["${name}_content"]="healthy"
 else
 log_error "$name コンテンツ: FAILED (欠落キーワード: ${missing_keywords[*]})"
 health_status["${name}_content"]="unhealthy"
 overall_status="unhealthy"
 fi
}

# Cloudflareステータスチェック
check_cloudflare_status() {
 log_info "Cloudflareステータスをチェック中"
 
 local cf_status=$(curl -s "https://www.cloudflarestatus.com/api/v2/status.json" | jq -r '.status.indicator' 2>/dev/null || echo "unknown")
 
 case "$cf_status" in
 "none")
 log_success "Cloudflare: OK (ステータス: 正常)"
 health_status["cloudflare"]="healthy"
 ;;
 "minor"|"major")
 log_warning "Cloudflare: DEGRADED (ステータス: $cf_status)"
 health_status["cloudflare"]="degraded"
 overall_status="degraded"
 ;;
 "critical")
 log_error "Cloudflare: CRITICAL (ステータス: $cf_status)"
 health_status["cloudflare"]="unhealthy"
 overall_status="unhealthy"
 ;;
 *)
 log_warning "Cloudflare: UNKNOWN (ステータスを取得できません)"
 health_status["cloudflare"]="degraded"
 overall_status="degraded"
 ;;
 esac
}

# パフォーマンスメトリクス収集
collect_performance_metrics() {
 log_info "パフォーマンスメトリクスを収集中"
 
 # Lighthouseスコア取得（簡易版）
 if command -v lighthouse &> /dev/null; then
 local lighthouse_score=$(lighthouse "$PRODUCTION_URL" --quiet --chrome-flags="--headless --no-sandbox" --output json | \
 jq '.categories.performance.score * 100' 2>/dev/null || echo "N/A")
 
 if [[ "$lighthouse_score" != "N/A" ]]; then
 if (( $(echo "$lighthouse_score >= 90" | bc -l) )); then
 log_success "パフォーマンススコア: ${lighthouse_score}/100 (EXCELLENT)"
 elif (( $(echo "$lighthouse_score >= 70" | bc -l) )); then
 log_warning "パフォーマンススコア: ${lighthouse_score}/100 (GOOD)"
 else
 log_error "パフォーマンススコア: ${lighthouse_score}/100 (NEEDS IMPROVEMENT)"
 overall_status="degraded"
 fi
 else
 log_warning "パフォーマンススコアを取得できませんでした"
 fi
 else
 log_info "Lighthouseがインストールされていません。パフォーマンススコアをスキップします。"
 fi
}

# 結果レポート生成
generate_report() {
 echo
 log_info "=== HAQEIアナライザーヘルスチェック結果 ==="
 echo
 
 # 総合ステータス
 case "$overall_status" in
 "healthy")
 log_success "総合ステータス: 正常 (ALL SYSTEMS OPERATIONAL)"
 ;;
 "degraded")
 log_warning "総合ステータス: 一部機能低下 (SOME SYSTEMS DEGRADED)"
 ;;
 "unhealthy")
 log_error "総合ステータス: システム障害 (SYSTEM OUTAGE DETECTED)"
 ;;
 esac
 
 echo
 log_info "個別コンポーネント状態:"
 
 for component in "${!health_status[@]}"; do
 local status="${health_status[$component]}"
 case "$status" in
 "healthy")
 log_success "$component: 正常"
 ;;
 "degraded")
 log_warning "$component: 低下"
 ;;
 "unhealthy")
 log_error "$component: 異常"
 ;;
 esac
 done
 
 echo
 log_info "実行時刻: $(date)"
 log_info "次回チェック推奨: 5分後"
 
 # JSONレポート出力（オプション）
 if [[ "${OUTPUT_JSON:-}" == "true" ]]; then
 local json_output="{"
 json_output+="\"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ\")\","
 json_output+="\"overall_status\": \"$overall_status\","
 json_output+="\"components\": {"
 
 local first=true
 for component in "${!health_status[@]}"; do
 if [[ "$first" == "true" ]]; then
 first=false
 else
 json_output+=","
 fi
 json_output+="\"$component\": \"${health_status[$component]}\""
 done
 
 json_output+="}}"
 echo "$json_output" > "health-check-$(date +%Y%m%d-%H%M%S).json"
 log_info "JSONレポートを生成しました"
 fi
}

# メイン実行
run_health_checks() {
 log_info "HAQEIアナライザーヘルスチェックを開始します"
 echo
 
 # 基本サービスチェック
 check_http_status "本番サイト" "$PRODUCTION_URL"
 check_http_status "ステージング" "$STAGING_URL"
 
 # DNSチェック
 check_dns_resolution "本番" "haqei.com"
 check_dns_resolution "ステージング" "staging.haqei.com"
 
 # SSL証明書チェック
 check_ssl_certificate "本番" "haqei.com"
 check_ssl_certificate "ステージング" "staging.haqei.com"
 
 # コンテンツ整合性チェック
 check_content_integrity "本番" "$PRODUCTION_URL" "HAQEI" "bunenjin" "深い自己洞察"
 
 # 外部サービスチェック
 check_cloudflare_status
 
 # パフォーマンスメトリクス
 if [[ "${SKIP_PERFORMANCE:-}" != "true" ]]; then
 collect_performance_metrics
 fi
 
 # 結果レポート
 generate_report
 
 # 終了コード設定
 case "$overall_status" in
 "healthy")
 exit 0
 ;;
 "degraded")
 exit 1
 ;;
 "unhealthy")
 exit 2
 ;;
 esac
}

# ヘルプ表示
show_help() {
 echo "HAQEIアナライザーヘルスチェックシステム"
 echo
 echo "使用方法:"
 echo " $0 [オプション]"
 echo
 echo "オプション:"
 echo " -h, --help このヘルプを表示"
 echo " --json JSONレポートを生成"
 echo " --skip-performance パフォーマンスチェックをスキップ"
 echo " --url URL カスタムURLでチェック"
 echo
 echo "終了コード:"
 echo " 0: 正常 (healthy)"
 echo " 1: 一部機能低下 (degraded)"
 echo " 2: システム障害 (unhealthy)"
}

# コマンドライン引数処理
while [[ $# -gt 0 ]]; do
 case $1 in
 -h|--help)
 show_help
 exit 0
 ;;
 --json)
 export OUTPUT_JSON=true
 shift
 ;;
 --skip-performance)
 export SKIP_PERFORMANCE=true
 shift
 ;;
 --url)
 PRODUCTION_URL="$2"
 shift 2
 ;;
 *)
 log_error "不明なオプション: $1"
 show_help
 exit 1
 ;;
 esac
done

# メイン実行
run_health_checks
