/**
 * セキュリティヘッダー強化管理システム
 * HTTPセキュリティヘッダーの設定と管理を自動化
 */

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

// セキュリティヘッダーの設定インターフェース
interface SecurityHeaders {
  'Content-Security-Policy': string
  'Strict-Transport-Security': string
  'X-Frame-Options': string
  'X-Content-Type-Options': string
  'X-XSS-Protection': string
  'Referrer-Policy': string
  'Permissions-Policy': string
  'Cross-Origin-Embedder-Policy': string
  'Cross-Origin-Opener-Policy': string
  'Cross-Origin-Resource-Policy': string
}

// CSPディレクティブの設定
interface CSPDirectives {
  'default-src': string[]
  'script-src': string[]
  'style-src': string[]
  'img-src': string[]
  'font-src': string[]
  'connect-src': string[]
  'media-src': string[]
  'object-src': string[]
  'child-src': string[]
  'worker-src': string[]
  'base-uri': string[]
  'form-action': string[]
  'frame-ancestors': string[]
  'upgrade-insecure-requests': boolean
}

/**
 * セキュリティヘッダー管理クラス
 */
export class SecurityHeaderManager {
  private projectRoot: string
  private isDevelopment: boolean

  constructor(projectRoot: string, isDevelopment: boolean = false) {
    this.projectRoot = projectRoot
    this.isDevelopment = isDevelopment
  }

  /**
   * プロダクション用セキュリティヘッダーを生成
   */
  generateProductionHeaders(): SecurityHeaders {
    const cspDirectives = this.getCSPDirectives()
    
    return {
      'Content-Security-Policy': this.buildCSPString(cspDirectives),
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': this.buildPermissionsPolicyString(),
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin'
    }
  }

  /**
   * 開発用セキュリティヘッダーを生成（制限を緩和）
   */
  generateDevelopmentHeaders(): SecurityHeaders {
    const cspDirectives = this.getCSPDirectives(true)
    
    return {
      'Content-Security-Policy': this.buildCSPString(cspDirectives),
      'Strict-Transport-Security': 'max-age=0', // 開発時は無効
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': this.buildPermissionsPolicyString(true),
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    }
  }

  /**
   * CSPディレクティブを取得
   * @param isDev - 開発モードかどうか
   */
  private getCSPDirectives(isDev: boolean = false): CSPDirectives {
    const baseDirectives: CSPDirectives = {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'", // Vue開発モードで必要
        "'unsafe-eval'",   // Vue開発モードで必要
        'https://cdn.jsdelivr.net',
        'https://unpkg.com'
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'", // CSSインラインスタイルで必要
        'https://fonts.googleapis.com',
        'https://cdn.jsdelivr.net'
      ],
      'img-src': [
        "'self'",
        'data:',
        'blob:',
        'https:',
        'http:' // 開発時のみ
      ],
      'font-src': [
        "'self'",
        'https://fonts.gstatic.com',
        'https://cdn.jsdelivr.net',
        'data:'
      ],
      'connect-src': [
        "'self'",
        'https://api.supabase.co',
        'wss://realtime.supabase.co',
        'https://fonts.googleapis.com'
      ],
      'media-src': ["'self'", 'data:', 'blob:'],
      'object-src': ["'none'"],
      'child-src': ["'self'"],
      'worker-src': ["'self'", 'blob:'],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'upgrade-insecure-requests': !isDev
    }

    if (isDev) {
      // 開発モードでの追加許可
      baseDirectives['connect-src'].push(
        'ws://localhost:*',
        'http://localhost:*',
        'https://localhost:*'
      )
      baseDirectives['script-src'].push('http://localhost:*')
      baseDirectives['style-src'].push('http://localhost:*')
    }

    return baseDirectives
  }

  /**
   * CSP文字列を構築
   * @param directives - CSPディレクティブ
   */
  private buildCSPString(directives: CSPDirectives): string {
    const cspParts: string[] = []

    for (const [directive, values] of Object.entries(directives)) {
      if (directive === 'upgrade-insecure-requests') {
        if (values as boolean) {
          cspParts.push('upgrade-insecure-requests')
        }
      } else {
        const valueList = (values as string[]).join(' ')
        cspParts.push(`${directive} ${valueList}`)
      }
    }

    return cspParts.join('; ')
  }

  /**
   * Permissions Policy文字列を構築
   * @param isDev - 開発モードかどうか
   */
  private buildPermissionsPolicyString(isDev: boolean = false): string {
    const policies = [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'accelerometer=()',
      'gyroscope=()',
      'fullscreen=(self)'
    ]

    if (isDev) {
      // 開発時は一部制限を緩和
      policies.push('clipboard-read=(self)', 'clipboard-write=(self)')
    }

    return policies.join(', ')
  }

  /**
   * Nginx設定ファイルを生成
   */
  generateNginxConfig(): string {
    const headers = this.isDevelopment 
      ? this.generateDevelopmentHeaders()
      : this.generateProductionHeaders()

    let config = `# セキュリティヘッダー設定 (自動生成)
# Generated at: ${new Date().toISOString()}

# セキュリティヘッダーの追加
`

    for (const [header, value] of Object.entries(headers)) {
      config += `add_header ${header} "${value}" always;\n`
    }

    config += `
# HTTPS リダイレクト（プロダクションのみ）
${!this.isDevelopment ? `
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}
` : ''}

# メイン設定
server {
    ${this.isDevelopment ? 'listen 80;' : `
    listen 443 ssl http2;
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    `}
    
    server_name your-domain.com www.your-domain.com;
    root /var/www/haqei-analyzer;
    index index.html;
    
    # セキュリティヘッダー
${Object.entries(headers).map(([header, value]) => 
    `    add_header ${header} "${value}" always;`
).join('\n')}
    
    # Gzip 圧縮
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    
    # ファイルアクセス制御
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA用のフォールバック
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API プロキシ（必要に応じて）
    location /api/ {
        proxy_pass https://api.supabase.co/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
`

    return config
  }

  /**
   * Apache .htaccess設定を生成
   */
  generateApacheConfig(): string {
    const headers = this.isDevelopment 
      ? this.generateDevelopmentHeaders()
      : this.generateProductionHeaders()

    let config = `# セキュリティヘッダー設定 (自動生成)
# Generated at: ${new Date().toISOString()}

<IfModule mod_headers.c>
`

    for (const [header, value] of Object.entries(headers)) {
      config += `    Header always set ${header} "${value}"\n`
    }

    config += `</IfModule>

# HTTPS リダイレクト（プロダクションのみ）
${!this.isDevelopment ? `
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
` : ''}

# ファイルアクセス制御
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"
</IfModule>

# Gzip圧縮
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# SPA用のリライト
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# セキュリティファイルの保護
<Files ~ "^\\.(htaccess|htpasswd|env)">
    Order allow,deny
    Deny from all
</Files>
`

    return config
  }

  /**
   * Express.js用のミドルウェア設定を生成
   */
  generateExpressMiddleware(): string {
    const headers = this.isDevelopment 
      ? this.generateDevelopmentHeaders()
      : this.generateProductionHeaders()

    return `/**
 * セキュリティヘッダー設定ミドルウェア (自動生成)
 * Generated at: ${new Date().toISOString()}
 */

import { Request, Response, NextFunction } from 'express'

export function securityHeaders(req: Request, res: Response, next: NextFunction): void {
  // セキュリティヘッダーの設定
${Object.entries(headers).map(([header, value]) => 
  `  res.setHeader('${header}', '${value}')`
).join('\n')}
  
  next()
}

// helmet.js を使用する場合の設定
export const helmetConfig = {
  contentSecurityPolicy: {
    directives: ${JSON.stringify(this.getCSPDirectives(this.isDevelopment), null, 6)}
  },
  hsts: {
    maxAge: ${this.isDevelopment ? '0' : '31536000'},
    includeSubDomains: true,
    preload: true
  },
  crossOriginEmbedderPolicy: ${this.isDevelopment ? 'false' : 'true'},
  crossOriginOpenerPolicy: { policy: '${this.isDevelopment ? 'unsafe-none' : 'same-origin'}' },
  crossOriginResourcePolicy: { policy: '${this.isDevelopment ? 'cross-origin' : 'same-origin'}' }
}
`
  }

  /**
   * セキュリティ設定を全て出力
   */
  async generateAllConfigs(): Promise<void> {
    const outputDir = join(this.projectRoot, 'security-configs')
    
    // ディレクトリが存在しない場合は作成
    const fs = await import('fs/promises')
    try {
      await fs.mkdir(outputDir, { recursive: true })
    } catch (error) {
      // ディレクトリが既に存在する場合は無視
    }

    // 各設定ファイルを生成
    const configs = [
      {
        filename: 'nginx.conf',
        content: this.generateNginxConfig()
      },
      {
        filename: '.htaccess',
        content: this.generateApacheConfig()
      },
      {
        filename: 'express-security.ts',
        content: this.generateExpressMiddleware()
      },
      {
        filename: 'security-headers.json',
        content: JSON.stringify({
          environment: this.isDevelopment ? 'development' : 'production',
          headers: this.isDevelopment 
            ? this.generateDevelopmentHeaders()
            : this.generateProductionHeaders(),
          generated: new Date().toISOString()
        }, null, 2)
      }
    ]

    for (const config of configs) {
      const filePath = join(outputDir, config.filename)
      writeFileSync(filePath, config.content)
      console.log(`✅ 生成完了: ${filePath}`)
    }

    console.log(`\n🎯 セキュリティ設定ファイルを生成しました: ${outputDir}`)
  }

  /**
   * 現在の設定を検証
   */
  validateCurrentHeaders(currentHeaders: Record<string, string>): {
    missing: string[]
    weak: string[]
    recommendations: string[]
  } {
    const recommended = this.generateProductionHeaders()
    const missing: string[] = []
    const weak: string[] = []
    const recommendations: string[] = []

    // 必須ヘッダーのチェック
    for (const [header, expectedValue] of Object.entries(recommended)) {
      if (!currentHeaders[header]) {
        missing.push(header)
        recommendations.push(`${header} ヘッダーを追加してください: ${expectedValue}`)
      } else if (currentHeaders[header] !== expectedValue) {
        weak.push(header)
        recommendations.push(`${header} の値を強化してください: ${expectedValue}`)
      }
    }

    // 非推奨ヘッダーのチェック
    const deprecatedHeaders = ['X-XSS-Protection', 'X-Content-Type-Options']
    for (const header of deprecatedHeaders) {
      if (currentHeaders[header] && header === 'X-XSS-Protection' && currentHeaders[header] !== '1; mode=block') {
        recommendations.push(`${header} は非推奨ですが、設定する場合は "1; mode=block" を使用してください`)
      }
    }

    return { missing, weak, recommendations }
  }
}

/**
 * CLI実行用のメイン関数
 */
export async function setupSecurityHeaders(
  projectRoot: string = process.cwd(),
  isDevelopment: boolean = false
): Promise<void> {
  console.log('🔒 セキュリティヘッダー設定を開始...')
  
  const manager = new SecurityHeaderManager(projectRoot, isDevelopment)
  
  try {
    await manager.generateAllConfigs()
    
    console.log('\n📋 生成された設定ファイル:')
    console.log('   - nginx.conf (Nginx用設定)')
    console.log('   - .htaccess (Apache用設定)')
    console.log('   - express-security.ts (Express.js用ミドルウェア)')
    console.log('   - security-headers.json (ヘッダー一覧)')
    
    console.log('\n🚀 次のステップ:')
    console.log('   1. 使用しているWebサーバーに応じて設定ファイルを適用')
    console.log('   2. ドメイン名やSSL証明書パスを実際の値に変更')
    console.log('   3. CSPポリシーを本番環境に合わせて調整')
    console.log('   4. セキュリティヘッダーテストツールで検証')
    
  } catch (error) {
    console.error('❌ セキュリティヘッダー設定でエラーが発生:', error)
    process.exit(1)
  }
}

// デフォルトエクスポート
export default SecurityHeaderManager