/**
 * Staging Environment Configuration
 * 
 * ステージング環境用の設定ファイル
 * 本番環境と同等の設定でテストを実施
 * 
 * @version 1.0.0
 * @date 2025-08-03
 */

module.exports = {
  // 環境設定
  environment: 'staging',
  
  // アプリケーション設定
  app: {
    name: 'HaQei Analyzer (Staging)',
    version: process.env.npm_package_version || '1.0.0',
    baseUrl: 'https://staging.haqei.com',
    apiUrl: 'https://staging-api.haqei.com',
    cdnUrl: 'https://cdn-staging.haqei.com'
  },

  // データベース設定
  database: {
    supabase: {
      url: process.env.VITE_SUPABASE_URL,
      anonKey: process.env.VITE_SUPABASE_ANON_KEY,
      serviceKey: process.env.SUPABASE_SERVICE_KEY
    }
  },

  // API設定
  api: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
      model: {
        flash: 'gemini-1.5-flash',
        pro: 'gemini-1.5-pro'
      },
      rateLimits: {
        requestsPerMinute: 30,
        requestsPerDay: 1000
      }
    }
  },

  // セキュリティ設定
  security: {
    corsOrigins: [
      'https://staging.haqei.com',
      'https://staging-admin.haqei.com',
      'http://localhost:3000', // 開発用
      'http://localhost:5173'  // Vite開発サーバー
    ],
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        // 'unsafe-inline' removed for security - use nonce or hash instead
        'https://cdnjs.cloudflare.com',
        'https://cdn.jsdelivr.net'
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com'
      ],
      fontSrc: [
        "'self'",
        'https://fonts.gstatic.com'
      ],
      imgSrc: [
        "'self'",
        'data:',
        'https:'
      ],
      connectSrc: [
        "'self'",
        'https://staging-project.supabase.co',
        'https://generativelanguage.googleapis.com'
      ]
    },
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15分
      max: 1000 // リクエスト数制限（ステージング用）
    }
  },

  // ログ設定
  logging: {
    level: 'debug', // ステージングでは詳細ログ
    enableConsole: true,
    enableFile: true,
    enableRemote: false, // ステージングでは無効
    maxFiles: 5,
    maxSize: '10m'
  },

  // パフォーマンス設定
  performance: {
    enableCompression: true,
    enableCaching: true,
    cacheMaxAge: 300, // 5分（短めに設定）
    enableServiceWorker: false, // ステージングでは無効
    bundleAnalyzer: true // バンドル分析有効
  },

  // 監視・分析設定
  monitoring: {
    enableAnalytics: true,
    enableErrorTracking: true,
    enablePerformanceMonitoring: true,
    sampleRate: 1.0, // 100%サンプリング（ステージング用）
    
    // アラート設定
    alerts: {
      errorRate: 0.05, // 5%エラー率でアラート
      responseTime: 3000, // 3秒でアラート
      memoryUsage: 0.8 // 80%メモリ使用率でアラート
    }
  },

  // 機能フラグ
  features: {
    enableBetaFeatures: true, // ベータ機能有効
    enableDebugMode: true,
    enableMockData: false,
    enableA11yTools: true, // アクセシビリティツール有効
    
    // 個別機能制御
    geminiIntegration: true,
    offlineMode: true,
    shareFeatures: true,
    professionalReports: true
  },

  // テスト設定
  testing: {
    enableTestData: true,
    mockApiResponses: false,
    enableE2ETests: true,
    enableVisualRegression: true,
    
    // テストユーザー
    testUsers: [
      {
        id: 'test-user-1',
        email: 'test@staging.haqei.com',
        role: 'user'
      },
      {
        id: 'test-admin-1',
        email: 'admin@staging.haqei.com', 
        role: 'admin'
      }
    ]
  },

  // デプロイメント設定
  deployment: {
    platform: 'cloudflare-pages',
    branch: 'develop',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    
    // 環境変数
    environmentVariables: {
      NODE_ENV: 'staging',
      VITE_APP_ENV: 'staging',
      VITE_APP_VERSION: process.env.npm_package_version
    },
    
    // ヘッダー設定
    headers: {
      '/*': {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'X-Robots-Tag': 'noindex, nofollow' // ステージング環境は検索回避
      },
      '/api/*': {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      '/static/*': {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    },

    // リダイレクト設定
    redirects: [
      {
        from: '/old-path/*',
        to: '/new-path/:splat',
        status: 301
      }
    ]
  },

  // 開発者向け設定
  development: {
    enableHotReload: true,
    enableSourceMaps: true,
    enableBundleAnalyzer: true,
    
    // デバッグツール
    debugTools: {
      enableVueDevtools: true,
      enableReduxDevtools: false,
      enableConsoleWarnings: true
    }
  },

  // 外部サービス設定
  externalServices: {
    cloudflare: {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
      projectName: 'haqei-staging',
      zoneId: process.env.CLOUDFLARE_ZONE_ID
    },
    
    slack: {
      webhookUrl: process.env.SLACK_WEBHOOK,
      channel: '#staging-alerts',
      enableNotifications: true
    }
  }
};

// 設定検証
function validateConfig() {
  const config = module.exports;
  
  // 必須設定チェック
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_KEY',
    'GEMINI_API_KEY'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables for staging:', missingVars);
  }
  
  return config;
}

// 設定エクスポート前に検証
module.exports = validateConfig();