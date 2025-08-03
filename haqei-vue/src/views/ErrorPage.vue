<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-illustration">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" stroke="currentColor" stroke-width="2" opacity="0.2"/>
          <path 
            d="M70 70 L130 130 M130 70 L70 130" 
            stroke="currentColor" 
            stroke-width="3" 
            stroke-linecap="round"
          />
          <circle cx="100" cy="160" r="3" fill="currentColor"/>
        </svg>
      </div>
      
      <h1 class="error-code">{{ errorCode }}</h1>
      <h2 class="error-title">{{ errorTitle }}</h2>
      
      <p class="error-description">
        {{ errorDescription }}
      </p>
      
      <div class="error-suggestions">
        <h3>以下をお試しください：</h3>
        <ul>
          <li>ブラウザの更新ボタンをクリックしてページを再読み込みする</li>
          <li>インターネット接続を確認する</li>
          <li>ブラウザのキャッシュをクリアする</li>
          <li>別のブラウザでアクセスする</li>
        </ul>
      </div>
      
      <div class="error-actions">
        <HButton variant="primary" @click="goHome">
          ホームへ戻る
        </HButton>
        <HButton variant="outline" @click="goBack">
          前のページへ戻る
        </HButton>
        <HButton variant="ghost" @click="reload">
          ページを再読み込み
        </HButton>
      </div>
      
      <div v-if="showTechnicalDetails" class="error-technical">
        <details>
          <summary>技術的な詳細</summary>
          <div class="technical-content">
            <p><strong>エラーコード:</strong> {{ errorCode }}</p>
            <p><strong>タイムスタンプ:</strong> {{ timestamp }}</p>
            <p><strong>URL:</strong> {{ currentUrl }}</p>
            <p v-if="errorMessage"><strong>メッセージ:</strong> {{ errorMessage }}</p>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HButton from '@/components/common/HButton.vue'

const route = useRoute()
const router = useRouter()

// エラータイプに基づいて情報を決定
const errorType = computed(() => route.params.type as string || '404')

const errorConfigs = {
  '404': {
    code: '404',
    title: 'ページが見つかりません',
    description: 'お探しのページは移動または削除された可能性があります。',
  },
  '403': {
    code: '403',
    title: 'アクセスが拒否されました',
    description: 'このページにアクセスする権限がありません。',
  },
  '500': {
    code: '500',
    title: 'サーバーエラー',
    description: 'サーバーで問題が発生しました。しばらくしてから再度お試しください。',
  },
  'network': {
    code: 'Network Error',
    title: 'ネットワークエラー',
    description: 'サーバーに接続できません。インターネット接続を確認してください。',
  },
  'unknown': {
    code: 'Error',
    title: '予期しないエラー',
    description: '申し訳ございません。予期しないエラーが発生しました。',
  },
}

const currentError = computed(() => {
  return errorConfigs[errorType.value] || errorConfigs.unknown
})

const errorCode = computed(() => currentError.value.code)
const errorTitle = computed(() => currentError.value.title)
const errorDescription = computed(() => currentError.value.description)

// クエリパラメータから追加情報を取得
const errorMessage = computed(() => route.query.message as string)
const timestamp = computed(() => {
  const ts = route.query.timestamp as string
  if (ts) {
    return new Date(parseInt(ts)).toLocaleString('ja-JP')
  }
  return new Date().toLocaleString('ja-JP')
})

const currentUrl = computed(() => window.location.href)
const showTechnicalDetails = computed(() => import.meta.env.DEV)

// アクション
const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    goHome()
  }
}

const reload = () => {
  window.location.reload()
}

// エラーログ
onMounted(() => {
  console.log('Error page mounted:', {
    type: errorType.value,
    message: errorMessage.value,
    timestamp: timestamp.value,
  })
})
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background-color: var(--bg-secondary);
}

.error-content {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.error-illustration {
  width: 120px;
  height: 120px;
  margin: 0 auto var(--space-6);
  color: var(--text-tertiary);
}

.error-code {
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  color: var(--primary-color);
  margin: 0 0 var(--space-2) 0;
}

.error-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-4) 0;
}

.error-description {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin: 0 0 var(--space-6) 0;
  line-height: var(--leading-relaxed);
}

.error-suggestions {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  margin-bottom: var(--space-6);
  text-align: left;
}

.error-suggestions h3 {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-3) 0;
}

.error-suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.error-suggestions li {
  position: relative;
  padding-left: var(--space-6);
  margin-bottom: var(--space-2);
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.error-suggestions li::before {
  content: '•';
  position: absolute;
  left: var(--space-3);
  color: var(--primary-color);
}

.error-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-6);
}

.error-technical {
  text-align: left;
}

.error-technical details {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}

.error-technical summary {
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  user-select: none;
}

.technical-content {
  margin-top: var(--space-3);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.technical-content p {
  margin: var(--space-2) 0;
}

.technical-content strong {
  color: var(--text-primary);
}

@media (max-width: 640px) {
  .error-illustration {
    width: 80px;
    height: 80px;
  }
  
  .error-code {
    font-size: var(--text-4xl);
  }
  
  .error-title {
    font-size: var(--text-xl);
  }
  
  .error-description {
    font-size: var(--text-base);
  }
  
  .error-actions {
    flex-direction: column;
  }
  
  .error-actions > * {
    width: 100%;
  }
}
</style>