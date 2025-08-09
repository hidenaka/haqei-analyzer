/**
 * HAQEIアナライザー本番環境設定
 * HaQei哲学に基づく企業レベル運用設定
 */

export const productionConfig = {
 // システム基盤設定
 system: {
 environment: 'production',
 version: '1.0.0',
 buildTimestamp: new Date().toISOString(),
 maintenanceMode: false,
 philosophy: 'HaQei' // 分人哲学遵守
 },

 // パフォーマンス設定
 performance: {
 enableCaching: true,
 cacheMaxAge: 86400, // 24時間
 enableCompression: true,
 enableMinification: true,
 lazyLoading: true,
 preloadCriticalResources: true,
 maxConcurrentRequests: 10,
 requestTimeout: 30000 // 30秒
 },

 // セキュリティ設定
 security: {
 enableCSP: true,
 enableHSTS: true,
 enableXSSProtection: true,
 enableContentTypeSniffing: false,
 enableReferrerPolicy: true,
 sessionTimeout: 1800000, // 30分
 maxLoginAttempts: 5,
 lockoutDuration: 900000, // 15分
 passwordPolicy: {
 minLength: 12,
 requireNumbers: true,
 requireSymbols: true,
 requireUppercase: true,
 requireLowercase: true
 }
 },

 // ログ設定
 logging: {
 level: 'info',
 enableStructuredLogging: true,
 enableErrorTracking: true,
 enablePerformanceLogging: true,
 enableSecurityLogging: true,
 logRetentionDays: 90,
 sensitiveDataMasking: true
 },

 // 監視設定
 monitoring: {
 enableHealthChecks: true,
 healthCheckInterval: 30000, // 30秒
 enableMetrics: true,
 metricsInterval: 60000, // 1分
 enableAlerts: true,
 alertThresholds: {
 errorRate: 0.05, // 5%
 responseTime: 3000, // 3秒
 memoryUsage: 0.85, // 85%
 cpuUsage: 0.80 // 80%
 }
 },

 // データベース設定
 database: {
 connectionPool: {
 min: 2,
 max: 20,
 acquireTimeoutMillis: 10000,
 idleTimeoutMillis: 30000
 },
 enableReadReplicas: true,
 enableQueryLogging: false, // 本番環境では無効
 enableConnectionRetry: true,
 maxRetryAttempts: 3
 },

 // API設定
 api: {
 rateLimit: {
 windowMs: 900000, // 15分
 max: 100, // リクエスト数
 skipSuccessfulRequests: false
 },
 enableCORS: true,
 allowedOrigins: [
 'https://haqei.com',
 'https://www.haqei.com'
 ],
 enableRequestValidation: true,
 enableResponseCompression: true
 },

 // CDN設定
 cdn: {
 enabled: true,
 provider: 'cloudflare',
 enableImageOptimization: true,
 enableAssetCaching: true,
 cacheHeaders: {
 'Cache-Control': 'public, max-age=31536000', // 1年
 'ETag': true,
 'Last-Modified': true
 }
 },

 // エラーハンドリング設定
 errorHandling: {
 enableGlobalHandler: true,
 enableErrorReporting: true,
 enableUserFriendlyMessages: true,
 enableStackTraceCapture: false, // 本番環境では無効
 errorPageRedirect: '/error',
 maintenancePageRedirect: '/maintenance'
 },

 // HaQei哲学実装設定
 HaQei: {
 enableUserSovereignty: true, // ユーザー主権
 enableTransparency: true, // 透明性
 enableHarmony: true, // 調和
 enableSustainability: true, // 持続可能性
 dataOwnership: 'user', // データ所有権はユーザー
 privacyFirst: true, // プライバシーファースト
 consentManagement: true // 同意管理
 },

 // I Ching統合設定
 iching: {
 enableAuthenticity: true, // 正統性確保
 validateHexagrams: true, // 卦の検証
 enablePhilosophicalAccuracy: true, // 哲学的正確性
 culturalSensitivity: true // 文化的配慮
 }
};

export default productionConfig;
