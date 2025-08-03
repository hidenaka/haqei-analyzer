<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-container">
      <div class="error-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      
      <h1 class="error-title">申し訳ございません</h1>
      
      <p class="error-message">
        予期しないエラーが発生しました。<br>
        ページを再読み込みするか、しばらく時間をおいてから再度お試しください。
      </p>
      
      <div class="error-actions">
        <button @click="reload" class="error-button error-button--primary">
          ページを再読み込み
        </button>
        <button @click="goHome" class="error-button error-button--secondary">
          ホームに戻る
        </button>
      </div>
      
      <details v-if="showDetails" class="error-details">
        <summary>エラーの詳細</summary>
        <pre>{{ errorInfo }}</pre>
      </details>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, type ComponentPublicInstance } from 'vue'
import { useRouter } from 'vue-router'

/**
 * ErrorBoundary - エラー境界コンポーネント
 * 
 * 目的：
 * - 子コンポーネントで発生したエラーをキャッチ
 * - ユーザーフレンドリーなエラー画面を表示
 * - エラー情報のログ収集とレポート
 * - アプリケーション全体のクラッシュを防止
 * 
 * 機能：
 * - Vue 3のonErrorCapturedフックでエラーキャッチ
 * - カスタマイズ可能なエラーハンドリング
 * - エラー詳細の表示/非表示切り替え
 * - リカバリーアクション（再読み込み、ホーム遷移）
 * - 将来のエラートラッキングサービス連携
 */

interface Props {
  /** エラー詳細を表示するか（デフォルト: false） */
  showDetails?: boolean
  /** カスタムエラーハンドラー */
  onError?: (error: Error, instance: ComponentPublicInstance | null, info: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: false,
})

const router = useRouter()
const hasError = ref<boolean>(false)
const errorInfo = ref<string>('')

/**
 * エラーキャッチャー
 * 
 * 目的：
 * - 子コンポーネントで発生したエラーをキャッチ
 * - エラー情報の記録と表示
 * - カスタムエラーハンドリングの実行
 * 
 * 処理内容：
 * 1. エラー情報をコンソールに出力
 * 2. エラー状態とエラー詳細を設定
 * 3. カスタムエラーハンドラーの呼び出し
 * 4. エラーログサービスへの送信
 * 5. エラー伝播の停止
 * 
 * 副作用：
 * - hasError、errorInfoの更新
 * - コンソールエラー出力
 * - エラーログの記録
 */
onErrorCaptured((error: Error, instance: ComponentPublicInstance | null, info: string) => {
  console.error('Error caught by ErrorBoundary:', error)
  console.error('Component:', instance)
  console.error('Error info:', info)
  
  hasError.value = true
  errorInfo.value = `${error.name}: ${error.message}\n${error.stack || ''}`
  
  // カスタムエラーハンドラーを呼び出し
  props.onError?.(error, instance, info)
  
  // エラーをログサービスに送信（将来の実装用）
  logError(error, info)
  
  // エラーの伝播を停止
  return false
})

/**
 * ページ再読み込み処理
 * 
 * 目的：
 * - エラー状態からの復旧
 * - ページ全体のリフレッシュ
 * 
 * 副作用：
 * - ブラウザの完全リロード
 */
const reload = (): void => {
  window.location.reload()
}

/**
 * ホーム画面への遷移処理
 * 
 * 目的：
 * - エラー状態をリセット
 * - 安全なホーム画面への復帰
 * 
 * 処理内容：
 * 1. エラー状態をfalseにリセット
 * 2. ルーターでホーム画面へ遷移
 * 
 * 副作用：
 * - hasErrorの変更
 * - ルーター遷移
 */
const goHome = (): void => {
  hasError.value = false
  router.push('/')
}

/**
 * エラーログ記録処理
 * 
 * 目的：
 * - エラー情報の永続化
 * - 将来のエラートラッキングサービス連携
 * 
 * 入力：
 * - error: Error - キャッチしたエラーオブジェクト
 * - info: string - Vue固有のエラー情報
 * 
 * 処理内容：
 * 1. 開発環境でのコンソールログ出力
 * 2. 将来のSentry、LogRocket等への送信準備
 * 
 * 注意事項：
 * - 本番環境では外部サービスへの送信を想定
 * - 現在は開発環境でのみログ出力
 */
const logError = (error: Error, info: string): void => {
  // 将来的にSentryやLogRocketなどのエラー追跡サービスに送信
  if (import.meta.env.DEV) {
    console.log('Error logged:', {
      error: error.message,
      stack: error.stack,
      info,
      timestamp: new Date().toISOString(),
    })
  }
}
</script>

<style scoped>
.error-boundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background-color: var(--bg-secondary);
}

.error-container {
  max-width: 600px;
  width: 100%;
  text-align: center;
  padding: var(--space-8);
  background-color: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.error-icon {
  display: inline-flex;
  width: 80px;
  height: 80px;
  margin-bottom: var(--space-6);
  color: var(--error);
}

.error-icon svg {
  width: 100%;
  height: 100%;
}

.error-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-4) 0;
}

.error-message {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin: 0 0 var(--space-6) 0;
  line-height: var(--leading-relaxed);
}

.error-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}

.error-button {
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  font-family: inherit;
}

.error-button--primary {
  background-color: var(--primary-color);
  color: white;
}

.error-button--primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.error-button--secondary {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.error-button--secondary:hover {
  background-color: var(--bg-secondary);
}

.error-details {
  margin-top: var(--space-6);
  text-align: left;
}

.error-details summary {
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
}

.error-details pre {
  background-color: var(--bg-secondary);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--text-secondary);
}

@media (max-width: 640px) {
  .error-container {
    padding: var(--space-6);
  }
  
  .error-icon {
    width: 60px;
    height: 60px;
  }
  
  .error-title {
    font-size: var(--text-2xl);
  }
  
  .error-message {
    font-size: var(--text-base);
  }
  
  .error-actions {
    flex-direction: column;
  }
  
  .error-button {
    width: 100%;
  }
}
</style>