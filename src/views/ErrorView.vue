<template>
  <div class="error-view">
    <div class="error-container">
      <div class="error-icon">
        <svg 
          width="64" 
          height="64" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 2L1 21h22L12 2z" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          />
          <path 
            d="M12 9v4" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          />
          <path 
            d="M12 17h.01" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          />
        </svg>
      </div>
      
      <h1 class="error-title">{{ errorTitle }}</h1>
      <p class="error-message">{{ errorMessage }}</p>
      
      <div v-if="bunenjinGuidance" class="bunenjin-guidance">
        <h3>bunenjin哲学からの導き</h3>
        <p>{{ bunenjinGuidance }}</p>
      </div>
      
      <div v-if="ichingGuidance" class="iching-guidance">
        <h3>易経からの智慧</h3>
        <p>{{ ichingGuidance }}</p>
      </div>
      
      <div class="error-actions">
        <button 
          @click="goHome" 
          class="btn btn-primary"
          type="button"
        >
          ホームに戻る
        </button>
        
        <button 
          v-if="canGoBack" 
          @click="goBack" 
          class="btn btn-secondary"
          type="button"
        >
          前のページに戻る
        </button>
        
        <button 
          v-if="redirectPath" 
          @click="retry" 
          class="btn btn-accent"
          type="button"
        >
          再試行
        </button>
      </div>
      
      <div v-if="showDebugInfo && debugInfo" class="debug-info">
        <details>
          <summary>デバッグ情報</summary>
          <pre>{{ debugInfo }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { HAQEIError } from '@/types'

interface Props {
  code?: string;
  error?: HAQEIError;
}

const props = withDefaults(defineProps<Props>(), {
  code: 'unknown',
  error: undefined
})

const route = useRoute()
const router = useRouter()

// エラー情報の計算
const errorCode = computed(() => props.code || route.params.code as string || 'unknown')
const redirectPath = computed(() => route.query.redirect as string | undefined)
const requiredLevel = computed(() => route.query.required as string | undefined)

// エラーメッセージの生成
const errorInfo = computed(() => {
  const code = errorCode.value
  
  switch (code) {
    case 'auth_required':
      return {
        title: '認証が必要です',
        message: 'このページにアクセスするには認証が必要です。',
        bunenjinGuidance: 'Multiple Dividualsの概念では、異なる状況に応じて適切な「個」を選択することが重要です。認証は信頼関係構築の第一歩です。',
        ichingGuidance: '需卦（5番）: 待つことの智慧。適切な時期を待ち、準備を整えることで道は開かれます。'
      }
      
    case 'insufficient_bunenjin_level':
      return {
        title: 'bunenjinレベルが不足しています',
        message: `このページにアクセスするには${requiredLevel.value}レベルのbunenjin理解が必要です。`,
        bunenjinGuidance: '哲学的理解は段階的に深まるものです。基礎から学び、実践を通じて理解を深めていきましょう。',
        ichingGuidance: '蒙卦（4番）: 学びの智慧。無知を恥じることなく、謙虚に学び続ける姿勢が成長をもたらします。'
      }
      
    case 'iching_knowledge_required':
      return {
        title: '易経の知識が必要です',
        message: 'このページにアクセスするには易経の基礎知識が必要です。',
        bunenjinGuidance: '古典的な智慧は現代の複雑性を理解する鍵となります。時間をかけて学ぶ価値があります。',
        ichingGuidance: '山水蒙（4番）: 啓蒙の時。師を求め、基礎を固めることで真の理解に至ります。'
      }
      
    case 'network_error':
      return {
        title: 'ネットワークエラー',
        message: 'ネットワーク接続に問題があります。しばらく時間をおいて再試行してください。',
        bunenjinGuidance: '接続の問題は一時的なものです。Multiple Dividualsの柔軟性を活かし、状況に適応しましょう。',
        ichingGuidance: '屯卦（3番）: 困難な始まり。忍耐と継続的な努力により突破口が見えてきます。'
      }
      
    case 'session_expired':
      return {
        title: 'セッションが期限切れです',
        message: 'セッションの有効期限が切れました。もう一度ログインしてください。',
        bunenjinGuidance: '時間の流れとともに状況は変化します。新たな「個」として再スタートしましょう。',
        ichingGuidance: '革卦（49番）: 変革の時。古いものを手放し、新しい段階へ進むことが必要です。'
      }
      
    default:
      return {
        title: '予期しないエラーが発生しました',
        message: 'システムでエラーが発生しました。しばらく時間をおいて再試行してください。',
        bunenjinGuidance: '予期しない出来事も成長の機会です。柔軟性を持って対応しましょう。',
        ichingGuidance: '既済卦（63番）: 完成の後の注意。慢心せず、常に改善の姿勢を保つことが大切です。'
      }
  }
})

const errorTitle = computed(() => errorInfo.value.title)
const errorMessage = computed(() => errorInfo.value.message)
const bunenjinGuidance = computed(() => errorInfo.value.bunenjinGuidance)
const ichingGuidance = computed(() => errorInfo.value.ichingGuidance)

// デバッグ情報
const showDebugInfo = computed(() => {
  return import.meta.env.DEV || route.query.debug === 'true'
})

const debugInfo = computed(() => {
  if (!showDebugInfo.value) return null
  
  return {
    errorCode: errorCode.value,
    route: {
      path: route.path,
      params: route.params,
      query: route.query
    },
    error: props.error,
    timestamp: new Date().toISOString()
  }
})

// ナビゲーション機能
const canGoBack = computed(() => {
  return window.history.length > 1
})

const goHome = (): void => {
  router.push({ name: 'Home' })
}

const goBack = (): void => {
  router.back()
}

const retry = (): void => {
  if (redirectPath.value) {
    router.push(redirectPath.value)
  } else {
    window.location.reload()
  }
}

// エラーレポート送信
const reportError = async (): Promise<void> => {
  try {
    // TODO: エラーレポートAPIに送信
    console.log('Error report:', {
      code: errorCode.value,
      route: route.path,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    })
  } catch (error) {
    console.warn('Failed to report error:', error)
  }
}

onMounted(() => {
  // エラーレポート送信
  reportError()
  
  // ページタイトル設定
  document.title = `${errorTitle.value} - HAQEI Analyzer`
})
</script>

<style scoped>
.error-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.error-container {
  max-width: 600px;
  width: 100%;
  background: white;
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.error-icon {
  color: #ef4444;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.error-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.error-message {
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.bunenjin-guidance,
.iching-guidance {
  background: #f8fafc;
  border-left: 4px solid #3b82f6;
  padding: 1.5rem;
  margin: 2rem 0;
  text-align: left;
  border-radius: 0 8px 8px 0;
}

.bunenjin-guidance h3,
.iching-guidance h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.bunenjin-guidance p,
.iching-guidance p {
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

.btn-accent {
  background: #10b981;
  color: white;
}

.btn-accent:hover {
  background: #059669;
  transform: translateY(-1px);
}

.debug-info {
  margin-top: 2rem;
  text-align: left;
}

.debug-info details {
  background: #f3f4f6;
  border-radius: 8px;
  padding: 1rem;
}

.debug-info summary {
  cursor: pointer;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.debug-info pre {
  background: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.875rem;
  margin: 0;
}

@media (max-width: 640px) {
  .error-container {
    padding: 2rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .error-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>