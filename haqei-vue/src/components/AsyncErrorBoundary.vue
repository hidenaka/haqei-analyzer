<template>
  <div>
    <div v-if="error" class="async-error">
      <div class="async-error-content">
        <p class="async-error-message">{{ errorMessage }}</p>
        <button @click="retry" class="async-error-retry">
          <svg 
            v-if="isRetrying" 
            class="async-error-spinner" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="45" />
          </svg>
          <span>{{ isRetrying ? '再試行中...' : '再試行' }}</span>
        </button>
      </div>
    </div>
    <slot v-else :retry="retry" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, provide } from 'vue'

interface Props {
  errorMessage?: string
  onRetry?: () => Promise<void>
  maxRetries?: number
  retryDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  errorMessage: 'エラーが発生しました。再度お試しください。',
  maxRetries: 3,
  retryDelay: 1000,
})

const error = ref<Error | null>(null)
const isRetrying = ref(false)
const retryCount = ref(0)

// エラーをキャッチする関数を提供
const catchError = (err: Error) => {
  error.value = err
  console.error('AsyncErrorBoundary caught:', err)
}

// エラーをクリアする関数を提供
const clearError = () => {
  error.value = null
  retryCount.value = 0
}

// 再試行関数
const retry = async () => {
  if (isRetrying.value || retryCount.value >= props.maxRetries) {
    return
  }
  
  isRetrying.value = true
  retryCount.value++
  
  try {
    // 遅延を入れる
    await new Promise(resolve => setTimeout(resolve, props.retryDelay))
    
    // カスタム再試行ハンドラーがある場合は実行
    if (props.onRetry) {
      await props.onRetry()
    }
    
    // エラーをクリア
    clearError()
  } catch (err) {
    console.error('Retry failed:', err)
    error.value = err as Error
  } finally {
    isRetrying.value = false
  }
}

// 子コンポーネントで使用できるように提供
provide('asyncError', {
  catchError,
  clearError,
  retry,
})

// エラーの変更を監視
watch(error, (newError) => {
  if (newError) {
    // エラー通知やログ送信などの処理
    console.error('Error state changed:', newError)
  }
})
</script>

<style scoped>
.async-error {
  padding: var(--space-4);
  background-color: var(--error-alpha-20);
  border: 1px solid var(--error);
  border-radius: var(--radius-lg);
  margin: var(--space-4) 0;
}

.async-error-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.async-error-message {
  color: var(--error);
  font-size: var(--text-base);
  margin: 0;
  flex: 1;
}

.async-error-retry {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background-color: var(--bg-primary);
  color: var(--error);
  border: 1px solid var(--error);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-base);
  font-family: inherit;
}

.async-error-retry:hover:not(:disabled) {
  background-color: var(--error);
  color: white;
}

.async-error-retry:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.async-error-spinner {
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .async-error-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .async-error-retry {
    justify-content: center;
  }
}
</style>