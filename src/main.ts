/**
 * HAQEI Analyzer - Main Application Entry Point
 * TypeScript Strict Mode & bunenjin Philosophy Implementation
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import type { HAQEIError } from './types'

// アプリケーション設定
const app = createApp(App)

// Piniaストア設定（状態管理）
const pinia = createPinia()
app.use(pinia)

// Vue Routerセットアップ
app.use(router)

// グローバルエラーハンドラー
app.config.errorHandler = (error: unknown, instance, info: string): void => {
  console.error('Vue Application Error:', {
    error,
    component: instance,
    info,
    timestamp: new Date().toISOString()
  })
  
  // HAQEIError型に変換
  const haqeiError: HAQEIError = {
    name: 'ApplicationError',
    message: error instanceof Error ? error.message : '不明なエラーが発生しました',
    category: 'TECHNICAL',
    severity: 'HIGH',
    context: {
      component: instance?.type?.name || 'Unknown',
      errorInfo: info,
      stack: error instanceof Error ? error.stack : undefined
    },
    bunenjinGuidance: 'Multiple Dividualsの概念では、エラーも学習の機会です。システムと調和を保ちながら解決策を見つけましょう。',
    ichingHexagram: 63, // 既済卦 - 完成の後の注意
    timestamp: new Date()
  }
  
  // エラーレポート送信（開発環境でのみログ出力）
  if (import.meta.env.DEV) {
    console.warn('HAQEI Error Report:', haqeiError)
  }
  
  // TODO: 本番環境ではエラーレポートAPIに送信
}

// パフォーマンス設定
app.config.performance = import.meta.env.DEV

// グローバルプロパティ設定（型安全性確保）
app.config.globalProperties.$haqei = {
  version: '2.0.0',
  buildTime: import.meta.env.VITE_BUILD_TIME || new Date().toISOString(),
  bunenjinMode: true,
  ichingEnabled: true
}

// 開発モード設定
if (import.meta.env.DEV) {
  // Vue DevTools有効化
  app.config.devtools = true
  
  // 開発用デバッグ情報
  console.log('%c🏵️ HAQEI Analyzer', 'color: #667eea; font-size: 24px; font-weight: bold;')
  console.log('%cbunenjin Philosophy Implementation', 'color: #764ba2; font-size: 16px;')
  console.log('%cTypeScript Strict Mode: Enabled', 'color: #10b981; font-weight: bold;')
  console.log('Build Info:', {
    mode: import.meta.env.MODE,
    base: import.meta.env.BASE_URL,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD
  })
}

// アプリケーション初期化エラーハンドリング
try {
  // DOMマウント待機
  const mountApp = (): void => {
    const appElement = document.getElementById('app')
    
    if (!appElement) {
      throw new Error('Application mount point #app not found')
    }
    
    app.mount(appElement)
    
    console.log('✅ HAQEI Analyzer successfully initialized')
    console.log('🔮 bunenjin philosophy: Multiple Dividuals ready')
    console.log('📚 I Ching system: 64 hexagrams loaded')
  }
  
  // DOMContentLoaded待機
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountApp)
  } else {
    mountApp()
  }
  
} catch (error) {
  console.error('❌ Failed to initialize HAQEI Analyzer:', error)
  
  // フォールバック表示
  const appElement = document.getElementById('app')
  if (appElement) {
    appElement.innerHTML = `
      <div style="
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center; 
        height: 100vh; 
        font-family: system-ui, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-align: center;
        padding: 2rem;
      ">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">HAQEI Analyzer</h1>
        <p style="font-size: 1.2rem; margin-bottom: 2rem;">アプリケーションの初期化に失敗しました</p>
        <p style="opacity: 0.8; max-width: 600px; line-height: 1.6;">
          bunenjin哲学では、一時的な困難も成長の機会と捉えます。
          ページを再読み込みするか、しばらく時間をおいてから再度お試しください。
        </p>
        <button 
          onclick="window.location.reload()" 
          style="
            background: white; 
            color: #667eea; 
            border: none; 
            padding: 0.75rem 1.5rem; 
            border-radius: 8px; 
            font-weight: 600;
            cursor: pointer;
            margin-top: 2rem;
            transition: all 0.2s;
          "
          onmouseover="this.style.transform='translateY(-1px)'"
          onmouseout="this.style.transform='translateY(0)'"
        >
          ページを再読み込み
        </button>
      </div>
    `
  }
}

// 型安全性の確保
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $haqei: {
      version: string;
      buildTime: string;
      bunenjinMode: boolean;
      ichingEnabled: boolean;
    };
  }
}

export { app, router, pinia }