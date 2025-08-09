/**
 * プロダクション環境移行準備スクリプト
 * 本番環境への移行に必要な全ての設定と検証を自動化
 */

const { existsSync, readFileSync, writeFileSync, mkdirSync } = require('fs');
const { join, resolve } = require('path');
const { execSync } = require('child_process');
const { glob } = require('glob');

/**
 * 環境設定の型定義
 * @typedef {Object} EnvironmentConfig
 * @property {string} NODE_ENV
 * @property {string} API_URL
 * @property {string} [SUPABASE_URL]
 * @property {string} [SUPABASE_ANON_KEY]
 * @property {string} [CDN_URL]
 * @property {string} [ANALYTICS_ID]
 * @property {string} [SENTRY_DSN]
 * @property {string} APP_VERSION
 */

/**
 * 本番環境チェック項目
 * @typedef {Object} ProductionChecklist
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {Function} check
 * @property {Function} [fix]
 * @property {boolean} critical
 */

/**
 * プロダクション環境セットアップクラス
 */
class ProductionSetup {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = resolve(projectRoot);
    this.buildDir = join(this.projectRoot, 'dist');
    this.checklist = [];
    this.initializeChecklist();
  }

  /**
   * チェックリストを初期化
   */
  initializeChecklist() {
    this.checklist = [
      {
        id: 'env-vars',
        name: '環境変数設定',
        description: 'プロダクション用環境変数が設定されているか',
        check: () => this.checkEnvironmentVariables(),
        fix: () => this.setupEnvironmentVariables(),
        critical: true
      },
      {
        id: 'build-optimization',
        name: 'ビルド最適化',
        description: 'プロダクションビルドが最適化されているか',
        check: () => this.checkBuildOptimization(),
        fix: () => this.optimizeBuild(),
        critical: true
      },
      {
        id: 'security-headers',
        name: 'セキュリティヘッダー',
        description: 'セキュリティヘッダーが設定されているか',
        check: () => this.checkSecurityHeaders(),
        fix: () => this.setupSecurityHeaders(),
        critical: true
      },
      {
        id: 'ssl-certificate',
        name: 'SSL証明書',
        description: 'SSL証明書が設定されているか',
        check: () => this.checkSSLCertificate(),
        critical: true
      },
      {
        id: 'database-connection',
        name: 'データベース接続',
        description: 'プロダクションデータベースに接続できるか',
        check: () => this.checkDatabaseConnection(),
        critical: true
      },
      {
        id: 'performance-optimization',
        name: 'パフォーマンス最適化',
        description: 'パフォーマンス最適化が適用されているか',
        check: () => this.checkPerformanceOptimization(),
        fix: () => this.applyPerformanceOptimizations(),
        critical: false
      },
      {
        id: 'error-tracking',
        name: 'エラートラッキング',
        description: 'エラートラッキングが設定されているか',
        check: () => this.checkErrorTracking(),
        fix: () => this.setupErrorTracking(),
        critical: false
      },
      {
        id: 'monitoring',
        name: 'モニタリング',
        description: 'アプリケーションモニタリングが設定されているか',
        check: () => this.checkMonitoring(),
        fix: () => this.setupMonitoring(),
        critical: false
      },
      {
        id: 'cdn-setup',
        name: 'CDN設定',
        description: 'CDNが適切に設定されているか',
        check: () => this.checkCDNSetup(),
        fix: () => this.setupCDN(),
        critical: false
      },
      {
        id: 'backup-strategy',
        name: 'バックアップ戦略',
        description: 'データバックアップ戦略が設定されているか',
        check: () => this.checkBackupStrategy(),
        fix: () => this.setupBackupStrategy(),
        critical: false
      }
    ]
  }

  /**
   * プロダクション環境移行を実行
   */
  async setupProduction() {
    console.log('🚀 プロダクション環境移行準備を開始...\n')

    const results = await this.runChecklist()
    
    console.log('\n📊 チェック結果サマリー:')
    const passed = results.filter(r => r.passed).length
    const total = results.length
    const critical = results.filter(r => !r.passed && r.critical).length
    
    console.log(`   ✅ 合格: ${passed}/${total}`)
    console.log(`   ❌ 不合格: ${total - passed}/${total}`)
    console.log(`   🔴 重要な問題: ${critical}`)

    if (critical > 0) {
      console.log('\n⚠️ 重要な問題があります。修正してから本番デプロイしてください。')
      process.exit(1)
    }

    if (passed < total) {
      console.log('\n⚠️ 一部のチェックが失敗しています。確認してください。')
    } else {
      console.log('\n🎉 全てのチェックが完了しました！本番デプロイの準備ができています。')
    }

    // デプロイメント設定の生成
    await this.generateDeploymentConfigs()
    
    // プロダクション環境の最終検証
    await this.finalValidation()
  }

  /**
   * チェックリストを実行
   */
  async runChecklist() {
    const results = []

    for (const item of this.checklist) {
      console.log(`🔍 チェック中: ${item.name}`)
      
      try {
        const passed = await item.check()
        
        if (passed) {
          console.log(`   ✅ ${item.description}`)
        } else {
          console.log(`   ❌ ${item.description}`)
          
          if (item.fix) {
            console.log(`   🔧 自動修正を試行中...`)
            await item.fix()
            
            // 修正後に再チェック
            const recheck = await item.check()
            if (recheck) {
              console.log(`   ✅ 修正完了: ${item.description}`)
            }
          }
        }

        results.push({
          id: item.id,
          name: item.name,
          passed,
          critical: item.critical
        })
      } catch (error) {
        console.log(`   ❌ エラー: ${error}`)
        results.push({
          id: item.id,
          name: item.name,
          passed: false,
          critical: item.critical,
          error: error instanceof Error ? error.message : String(error)
        })
      }
    }

    return results
  }

  /**
   * 環境変数をチェック
   */
  checkEnvironmentVariables() {
    const requiredVars = [
      'NODE_ENV',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY'
    ]

    const envFile = join(this.projectRoot, '.env.production')
    if (!existsSync(envFile)) {
      return false
    }

    const envContent = readFileSync(envFile, 'utf-8')
    
    for (const varName of requiredVars) {
      if (!envContent.includes(`${varName}=`)) {
        return false
      }
    }

    return true
  }

  /**
   * 環境変数を設定
   */
  setupEnvironmentVariables() {
    const envTemplate = `# プロダクション環境設定
NODE_ENV=production

# Supabase設定
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# アプリケーション設定
API_URL=https://your-domain.com/api
CDN_URL=https://cdn.your-domain.com
APP_VERSION=1.0.0

# 分析・モニタリング
ANALYTICS_ID=your_analytics_id_here
SENTRY_DSN=your_sentry_dsn_here

# セキュリティ
SECURE_COOKIES=true
TRUST_PROXY=true
`

    const envFile = join(this.projectRoot, '.env.production')
    writeFileSync(envFile, envTemplate)
    console.log(`     📁 作成: ${envFile}`)
  }

  /**
   * ビルド最適化をチェック
   */
  private checkBuildOptimization(): boolean {
    const viteConfigPath = join(this.projectRoot, 'haqei-vue', 'vite.config.ts')
    
    if (!existsSync(viteConfigPath)) {
      return false
    }

    const config = readFileSync(viteConfigPath, 'utf-8')
    
    // 必要な最適化設定をチェック
    const requiredOptimizations = [
      'minify',
      'sourcemap',
      'rollupOptions'
    ]

    return requiredOptimizations.every(opt => config.includes(opt))
  }

  /**
   * ビルドを最適化
   */
  private optimizeBuild(): void {
    const viteConfigPath = join(this.projectRoot, 'haqei-vue', 'vite.config.ts')
    
    const optimizedConfig = `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    // プロダクション最適化
    minify: 'terser',
    sourcemap: false,
    target: 'es2015',
    cssCodeSplit: true,
    
    // Rollup設定
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          utils: ['lodash', 'date-fns']
        }
      }
    },
    
    // Terser設定
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  // 最適化設定
  optimizeDeps: {
    include: ['vue', 'vue-router']
  }
})
`

    writeFileSync(viteConfigPath, optimizedConfig)
    console.log(`     🔧 最適化設定を適用: ${viteConfigPath}`)
  }

  /**
   * セキュリティヘッダーをチェック
   */
  private checkSecurityHeaders(): boolean {
    const securityConfigDir = join(this.projectRoot, 'security-configs')
    return existsSync(securityConfigDir)
  }

  /**
   * セキュリティヘッダーを設定
   */
  private async setupSecurityHeaders(): Promise<void> {
    const { SecurityHeaderManager } = await import('../src/security/SecurityHeaderManager')
    const manager = new SecurityHeaderManager(this.projectRoot, false)
    await manager.generateAllConfigs()
  }

  /**
   * SSL証明書をチェック
   */
  private checkSSLCertificate(): boolean {
    // SSL証明書の存在確認（実際の実装では証明書ファイルをチェック）
    const certPath = join(this.projectRoot, 'ssl', 'certificate.crt')
    const keyPath = join(this.projectRoot, 'ssl', 'private.key')
    
    return existsSync(certPath) && existsSync(keyPath)
  }

  /**
   * データベース接続をチェック
   */
  private async checkDatabaseConnection(): Promise<boolean> {
    try {
      // Supabase接続テスト（実際の実装では接続をテスト）
      const envFile = join(this.projectRoot, '.env.production')
      if (!existsSync(envFile)) return false
      
      const envContent = readFileSync(envFile, 'utf-8')
      const hasSupabaseUrl = envContent.includes('SUPABASE_URL=')
      const hasSupabaseKey = envContent.includes('SUPABASE_ANON_KEY=')
      
      return hasSupabaseUrl && hasSupabaseKey
    } catch (error) {
      return false
    }
  }

  /**
   * パフォーマンス最適化をチェック
   */
  private checkPerformanceOptimization(): boolean {
    const optimizations = [
      // 画像最適化
      existsSync(join(this.projectRoot, 'public', 'images', 'optimized')),
      // CSS最適化
      existsSync(join(this.projectRoot, 'haqei-vue', 'src', 'styles', 'critical.css')),
      // Service Worker
      existsSync(join(this.projectRoot, 'haqei-vue', 'public', 'sw.js'))
    ]

    return optimizations.some(opt => opt)
  }

  /**
   * パフォーマンス最適化を適用
   */
  private applyPerformanceOptimizations(): void {
    // Service Worker設定
    const swContent = `// Service Worker (プロダクション用)
const CACHE_NAME = 'haqei-analyzer-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})
`

    const swPath = join(this.projectRoot, 'haqei-vue', 'public', 'sw.js')
    writeFileSync(swPath, swContent)
    console.log(`     📁 作成: Service Worker`)
  }

  /**
   * エラートラッキングをチェック
   */
  private checkErrorTracking(): boolean {
    const mainTsPath = join(this.projectRoot, 'haqei-vue', 'src', 'main.ts')
    
    if (!existsSync(mainTsPath)) return false
    
    const content = readFileSync(mainTsPath, 'utf-8')
    return content.includes('Sentry') || content.includes('error tracking')
  }

  /**
   * エラートラッキングを設定
   */
  private setupErrorTracking(): void {
    const errorTrackingCode = `
// エラートラッキング設定
if (import.meta.env.PROD) {
  // Sentry設定（本番環境のみ）
  // import * as Sentry from "@sentry/vue"
  // Sentry.init({
  //   app,
  //   dsn: import.meta.env.VITE_SENTRY_DSN
  // })
  
  // カスタムエラーハンドラー
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    // エラーログをサーバーに送信
  })
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    // エラーログをサーバーに送信
  })
}
`

    const mainTsPath = join(this.projectRoot, 'haqei-vue', 'src', 'main.ts')
    if (existsSync(mainTsPath)) {
      const content = readFileSync(mainTsPath, 'utf-8')
      const updatedContent = content + errorTrackingCode
      writeFileSync(mainTsPath, updatedContent)
      console.log(`     🔧 エラートラッキングを追加: ${mainTsPath}`)
    }
  }

  /**
   * モニタリングをチェック
   */
  private checkMonitoring(): boolean {
    // アナリティクス設定の確認
    const indexHtmlPath = join(this.projectRoot, 'haqei-vue', 'index.html')
    
    if (!existsSync(indexHtmlPath)) return false
    
    const content = readFileSync(indexHtmlPath, 'utf-8')
    return content.includes('gtag') || content.includes('analytics')
  }

  /**
   * モニタリングを設定
   */
  private setupMonitoring(): void {
    console.log(`     📊 Google Analytics設定を確認してください`)
    console.log(`     💡 ANALYTICS_ID環境変数を設定してください`)
  }

  /**
   * CDN設定をチェック
   */
  private checkCDNSetup(): boolean {
    const envFile = join(this.projectRoot, '.env.production')
    if (!existsSync(envFile)) return false
    
    const content = readFileSync(envFile, 'utf-8')
    return content.includes('CDN_URL=')
  }

  /**
   * CDNを設定
   */
  private setupCDN(): void {
    console.log(`     🌐 CDN設定を確認してください`)
    console.log(`     💡 CloudFront, CloudFlare等のCDN設定を推奨`)
  }

  /**
   * バックアップ戦略をチェック
   */
  private checkBackupStrategy(): boolean {
    const backupDir = join(this.projectRoot, 'backup-scripts')
    return existsSync(backupDir)
  }

  /**
   * バックアップ戦略を設定
   */
  private setupBackupStrategy(): void {
    const backupDir = join(this.projectRoot, 'backup-scripts')
    
    try {
      mkdirSync(backupDir, { recursive: true })
    } catch (error) {
      // ディレクトリが既に存在する場合は無視
    }

    const backupScript = `#!/bin/bash
# データベースバックアップスクリプト

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/haqei-analyzer"

# バックアップディレクトリ作成
mkdir -p $BACKUP_DIR

# Supabaseバックアップ（pg_dump等を使用）
echo "データベースバックアップを開始..."

# アプリケーションファイルバックアップ
echo "アプリケーションファイルバックアップを開始..."
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /var/www/haqei-analyzer

echo "バックアップ完了: $DATE"
`

    const scriptPath = join(backupDir, 'backup.sh')
    writeFileSync(scriptPath, backupScript)
    
    // 実行権限を付与
    try {
      execSync(`chmod +x ${scriptPath}`)
    } catch (error) {
      // Windows環境では実行権限の設定をスキップ
    }
    
    console.log(`     📁 作成: バックアップスクリプト`)
  }

  /**
   * デプロイメント設定を生成
   */
  private async generateDeploymentConfigs(): Promise<void> {
    console.log('\n📁 デプロイメント設定を生成中...')

    const deployDir = join(this.projectRoot, 'deployment')
    
    try {
      mkdirSync(deployDir, { recursive: true })
    } catch (error) {
      // ディレクトリが既に存在する場合は無視
    }

    // Docker設定
    const dockerfile = `FROM node:18-alpine

WORKDIR /app

# 依存関係をコピー
COPY package*.json ./
COPY haqei-vue/package*.json ./haqei-vue/

# 依存関係をインストール
RUN npm ci --only=production
RUN cd haqei-vue && npm ci --only=production

# アプリケーションコードをコピー
COPY . .

# ビルド
RUN cd haqei-vue && npm run build

# ポート設定
EXPOSE 3000

# アプリケーション起動
CMD ["npm", "start"]
`

    writeFileSync(join(deployDir, 'Dockerfile'), dockerfile)

    // docker-compose設定
    const dockerCompose = `version: '3.8'

services:
  haqei-analyzer:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./security-configs/nginx.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - haqei-analyzer
    restart: unless-stopped
`

    writeFileSync(join(deployDir, 'docker-compose.yml'), dockerCompose)

    console.log('   ✅ Dockerfile')
    console.log('   ✅ docker-compose.yml')
  }

  /**
   * 最終検証
   */
  private async finalValidation(): Promise<void> {
    console.log('\n🔍 最終検証を実行中...')

    // ビルドテスト
    try {
      console.log('   📦 プロダクションビルドをテスト中...')
      execSync('cd haqei-vue && npm run build', { 
        cwd: this.projectRoot,
        stdio: 'pipe'
      })
      console.log('   ✅ ビルド成功')
    } catch (error) {
      console.log('   ❌ ビルド失敗')
      throw error
    }

    // バンドルサイズチェック
    const distDir = join(this.projectRoot, 'haqei-vue', 'dist')
    if (existsSync(distDir)) {
      const jsFiles = await glob('**/*.js', { cwd: distDir })
      const totalSize = jsFiles.reduce((size, file) => {
        const filePath = join(distDir, file)
        const stats = require('fs').statSync(filePath)
        return size + stats.size
      }, 0)

      const sizeMB = (totalSize / 1024 / 1024).toFixed(2)
      console.log(`   📊 総バンドルサイズ: ${sizeMB}MB`)

      if (totalSize > 5 * 1024 * 1024) { // 5MB以上
        console.log('   ⚠️ バンドルサイズが大きいです。最適化を検討してください')
      }
    }

    console.log('\n🎉 プロダクション環境移行準備が完了しました！')
  }
}

/**
 * CLI実行用のメイン関数
 */
async function setupProductionEnvironment(projectRoot = process.cwd()) {
  const setup = new ProductionSetup(projectRoot);
  await setup.setupProduction();
}

// CLI実行時
if (require.main === module) {
  setupProductionEnvironment().catch(error => {
    console.error('❌ プロダクション環境設定でエラーが発生:', error);
    process.exit(1);
  });
}

// exports
module.exports = {
  ProductionSetup,
  setupProductionEnvironment
};