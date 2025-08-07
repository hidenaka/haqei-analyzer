/**
 * HAQEIアナライザー本番環境監視設定
 * HaQei哲学に基づく企業レベルモニタリングシステム
 */

export const monitoringConfig = {
 // システム監視基本設定
 system: {
 environment: 'production',
 serviceName: 'haqei-analyzer',
 version: '1.0.0',
 philosophy: 'HaQei'
 },

 // パフォーマンス監視
 performance: {
 // レスポンスタイム闾値
 responseTime: {
 excellent: 1000, // 1秒以下
 good: 3000, // 3秒以下
 warning: 5000, // 5秒以下
 critical: 10000 // 10秒以上でアラート
 },

 // メモリ使用量闾値
 memory: {
 warning: 0.75, // 75%で警告
 critical: 0.90 // 90%でアラート
 },

 // CPU使用量闾値
 cpu: {
 warning: 0.70, // 70%で警告
 critical: 0.85 // 85%でアラート
 },

 // スループット闾値
 throughput: {
 minRequestsPerSecond: 1,
 warningDropPercentage: 0.20, // 20%以上の低下で警告
 criticalDropPercentage: 0.50 // 50%以上の低下でアラート
 }
 },

 // エラー監視
 errors: {
 // エラーレート闾値
 errorRate: {
 warning: 0.02, // 2%で警告
 critical: 0.05 // 5%でアラート
 },

 // エラーカテゴリ分類
 categories: {
 client: { // 4xxエラー
 codes: [400, 401, 403, 404, 422, 429],
 alertThreshold: 10 // 10件/分でアラート
 },
 server: { // 5xxエラー
 codes: [500, 502, 503, 504],
 alertThreshold: 1 // 1件で即アラート
 },
 security: { // セキュリティエラー
 patterns: ['CSRF', 'XSS', 'SQL Injection', 'Unauthorized'],
 alertThreshold: 1 // 1件で即アラート
 }
 },

 // エラーログ保存設定
 logging: {
 maxLogSize: '100MB',
 rotationInterval: '24h',
 retentionDays: 30,
 compressionEnabled: true
 }
 },

 // ヘルスチェック設定
 healthCheck: {
 // エンドポイント設定
 endpoints: [
 {
 name: 'main-site',
 url: 'https://haqei.com',
 method: 'GET',
 expectedStatus: 200,
 timeout: 10000,
 interval: 30000, // 30秒ごと
 retries: 3
 },
 {
 name: 'health-endpoint',
 url: 'https://haqei.com/health',
 method: 'GET',
 expectedStatus: 200,
 timeout: 5000,
 interval: 15000, // 15秒ごと
 retries: 2
 },
 {
 name: 'api-health',
 url: 'https://api.haqei.com/health',
 method: 'GET',
 expectedStatus: 200,
 timeout: 5000,
 interval: 15000,
 retries: 2
 }
 ],

 // ヘルスチェック結果の評価基準
 evaluation: {
 consecutiveFailures: 3, // 3回連続失敗でアラート
 recoveryThreshold: 2 // 2回連続成功で復旧
 }
 },

 // セキュリティ監視
 security: {
 // アクセスパターン監視
 accessPatterns: {
 unusualTrafficThreshold: 1000, // 通常の10倍のトラフィックでアラート
 suspiciousIPThreshold: 100, // 同一IPかラ100リクエスト/分でアラート
 geoAnomalyDetection: true, // 地理的異常検知
 timeBasedAnomalyDetection: true // 時間帯異常検知
 },

 // 脆弱性スキャン
 vulnerabilityScanning: {
 enabled: true,
 schedule: '0 2 * * *', // 毎日午前2時に実行
 scanTypes: ['owasp-zap', 'dependency-check', 'ssl-check'],
 alertOnNewVulnerabilities: true
 },

 // SSL/TLS監視
 ssl: {
 certificateExpiryWarning: 30, // 30日前に警告
 certificateExpiryCritical: 7, // 7日前にアラート
 weakCipherDetection: true,
 mixedContentDetection: true
 }
 },

 // アラート設定
 alerting: {
 // 通知チャンネル
 channels: {
 email: {
 enabled: true,
 recipients: [
 'ops@haqei.com',
 'dev@haqei.com',
 'security@haqei.com'
 ],
 severityFilter: ['warning', 'critical']
 },
 slack: {
 enabled: true,
 webhook: process.env.SLACK_WEBHOOK_URL,
 channel: '#haqei-alerts',
 severityFilter: ['critical']
 },
 sms: {
 enabled: true,
 provider: 'twilio',
 recipients: ['+81-90-XXXX-XXXX'], // 緊急連絡先
 severityFilter: ['critical'],
 quietHours: {
 start: '23:00',
 end: '07:00',
 timezone: 'Asia/Tokyo'
 }
 }
 },

 // アラートルール
 rules: {
 // 重複アラート防止
 deduplication: {
 enabled: true,
 timeWindow: 300000, // 5分間の重複を防止
 groupByFields: ['service', 'alert_type', 'severity']
 },

 // エスカレーション
 escalation: {
 enabled: true,
 levels: [
 {
 delay: 0, // 即座
 channels: ['slack']
 },
 {
 delay: 900000, // 15分後
 channels: ['email']
 },
 {
 delay: 1800000, // 30分後
 channels: ['sms']
 }
 ]
 },

 // アラート抑制
 suppression: {
 maintenanceMode: {
 enabled: false,
 schedule: [], // メンテナンスウィンドウ
 suppressAll: false
 }
 }
 }
 },

 // メトリクス収集
 metrics: {
 // 収集間隔
 collectionInterval: 60000, // 1分ごと

 // メトリクスカテゴリ
 categories: {
 // システムメトリクス
 system: {
 cpu: {
 enabled: true,
 fields: ['usage_percent', 'load_average']
 },
 memory: {
 enabled: true,
 fields: ['usage_percent', 'available_bytes', 'swap_usage']
 },
 disk: {
 enabled: true,
 fields: ['usage_percent', 'available_bytes', 'io_operations']
 },
 network: {
 enabled: true,
 fields: ['bytes_sent', 'bytes_received', 'packets_sent', 'packets_received']
 }
 },

 // アプリケーションメトリクス
 application: {
 requests: {
 enabled: true,
 fields: ['total_count', 'rate_per_second', 'error_rate']
 },
 responses: {
 enabled: true,
 fields: ['response_time_p50', 'response_time_p95', 'response_time_p99']
 },
 users: {
 enabled: true,
 fields: ['active_sessions', 'new_registrations', 'concurrent_users']
 },
 HaQei: {
 enabled: true,
 fields: ['philosophy_compliance_score', 'user_sovereignty_index', 'transparency_level']
 }
 },

 // ビジネスメトリクス
 business: {
 conversions: {
 enabled: true,
 fields: ['analysis_completions', 'user_engagement_score', 'retention_rate']
 },
 quality: {
 enabled: true,
 fields: ['analysis_accuracy', 'user_satisfaction', 'iching_authenticity_score']
 }
 }
 },

 // データ保存設定
 retention: {
 realtime: '24h', // リアルタイムデータ
 shortTerm: '7d', // 短期データ
 longTerm: '90d', // 長期データ
 archive: '1y' // アーカイブデータ
 }
 },

 // ログ管理
 logging: {
 // ログレベル設定
 levels: {
 production: 'info',
 debug: 'debug',
 security: 'warn'
 },

 // ログカテゴリ
 categories: {
 access: {
 enabled: true,
 format: 'combined',
 rotation: 'daily',
 retention: '30d'
 },
 error: {
 enabled: true,
 format: 'json',
 rotation: 'daily',
 retention: '90d',
 stackTrace: true
 },
 security: {
 enabled: true,
 format: 'json',
 rotation: 'daily',
 retention: '365d',
 encryption: true
 },
 audit: {
 enabled: true,
 format: 'json',
 rotation: 'daily',
 retention: '2y',
 immutable: true
 }
 },

 // ログ集約設定
 aggregation: {
 enabled: true,
 services: ['elasticsearch', 'cloudflare-logs'],
 indexPattern: 'haqei-logs-%{+YYYY.MM.dd}',
 shardCount: 1,
 replicaCount: 1
 }
 },

 // ダッシュボード設定
 dashboard: {
 // メインダッシュボード
 main: {
 title: 'HAQEIアナライザー - 本番環境監視',
 refreshInterval: 30000, // 30秒
 autoRefresh: true,
 sections: [
 'system-overview',
 'performance-metrics',
 'error-tracking',
 'security-monitoring',
 'business-metrics',
 'HaQei-compliance'
 ]
 },

 // アラートダッシュボード
 alerts: {
 title: 'アラート一覧',
 refreshInterval: 10000, // 10秒
 autoRefresh: true,
 filterBySeverity: true,
 groupByService: true
 },

 // パフォーマンスダッシュボード
 performance: {
 title: 'パフォーマンス分析',
 refreshInterval: 60000, // 1分
 timeRange: '24h',
 includeHistoricalComparison: true
 }
 },

 // レポート設定
 reporting: {
 // 定期レポート
 scheduled: {
 daily: {
 enabled: true,
 time: '09:00',
 timezone: 'Asia/Tokyo',
 recipients: ['ops@haqei.com'],
 sections: ['summary', 'performance', 'errors', 'security']
 },
 weekly: {
 enabled: true,
 day: 'monday',
 time: '09:00',
 timezone: 'Asia/Tokyo',
 recipients: ['management@haqei.com'],
 sections: ['executive-summary', 'trends', 'recommendations']
 },
 monthly: {
 enabled: true,
 day: 1,
 time: '09:00',
 timezone: 'Asia/Tokyo',
 recipients: ['board@haqei.com'],
 sections: ['business-metrics', 'growth-analysis', 'strategic-insights']
 }
 },

 // インシデントレポート
 incident: {
 autoGeneration: true,
 template: 'postmortem',
 includeTimeline: true,
 includeRootCause: true,
 includeActionItems: true
 }
 },

 // HaQei哲学特化監視
 HaQeiMonitoring: {
 // ユーザー主権監視
 userSovereignty: {
 enabled: true,
 metrics: [
 'data_ownership_transparency',
 'consent_management_effectiveness',
 'user_control_accessibility'
 ],
 alertThresholds: {
 transparencyScore: 0.90, // 90%以下でアラート
 consentCompliance: 0.95 // 95%以下でアラート
 }
 },

 // 調和性監視
 harmony: {
 enabled: true,
 metrics: [
 'system_balance_index',
 'user_experience_coherence',
 'philosophical_consistency'
 ],
 alertThresholds: {
 balanceIndex: 0.80, // 80%以下でアラート
 coherenceScore: 0.85 // 85%以下でアラート
 }
 },

 // I Ching正統性監視
 ichingAuthenticity: {
 enabled: true,
 metrics: [
 'hexagram_accuracy',
 'philosophical_alignment',
 'cultural_sensitivity'
 ],
 alertThresholds: {
 accuracyScore: 0.95, // 95%以下でアラート
 alignmentScore: 0.90 // 90%以下でアラート
 }
 }
 }
};

export default monitoringConfig;
