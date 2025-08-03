<template>
  <div class="error-handler">
    <!-- グローバル通知表示 -->
    <Transition
      name="slide-down"
      appear
    >
      <div
        v-if="notification"
        :class="[
          'notification',
          `notification--${notification.type}`,
          { 'notification--dismissible': isDismissible }
        ]"
        role="alert"
        :aria-live="notification.type === 'error' ? 'assertive' : 'polite'"
      >
        <div class="notification__content">
          <!-- アイコン -->
          <div class="notification__icon">
            <svg
              v-if="notification.type === 'success'"
              class="icon icon--success"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <svg
              v-else-if="notification.type === 'error'"
              class="icon icon--error"
              viewBox="0 0 24 24"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
            <svg
              v-else-if="notification.type === 'warning'"
              class="icon icon--warning"
              viewBox="0 0 24 24"
            >
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
            <svg
              v-else-if="notification.type === 'info'"
              class="icon icon--info"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>

          <!-- メッセージ内容 -->
          <div class="notification__text">
            <h4 
              v-if="notification.title"
              class="notification__title"
            >
              {{ notification.title }}
            </h4>
            <p class="notification__message">
              {{ notification.message }}
            </p>
            
            <!-- アクションボタン（エラー時） -->
            <div 
              v-if="notification.type === 'error' && showRetryAction"
              class="notification__actions"
            >
              <button
                class="btn btn--small btn--outline"
                @click="retryLastAction"
                :disabled="retrying"
              >
                <svg
                  v-if="retrying"
                  class="icon icon--spinning"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6z"/>
                </svg>
                <span>{{ t('common.retry') }}</span>
              </button>
            </div>
          </div>

          <!-- 閉じるボタン -->
          <button
            v-if="isDismissible"
            class="notification__close"
            @click="closeNotification"
            :aria-label="t('common.close')"
          >
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <!-- プログレスバー（自動消去時） -->
        <div
          v-if="notification.duration && notification.duration > 0"
          class="notification__progress"
          :style="{ animationDuration: `${notification.duration}ms` }"
        ></div>
      </div>
    </Transition>

    <!-- エラー境界表示 -->
    <div 
      v-if="hasGlobalError"
      class="error-boundary"
    >
      <div class="error-boundary__content">
        <div class="error-boundary__icon">
          <svg class="icon icon--large" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h2 class="error-boundary__title">
          {{ t('errors.system.criticalError') }}
        </h2>
        <p class="error-boundary__message">
          {{ globalErrorMessage }}
        </p>
        <div class="error-boundary__actions">
          <button
            class="btn btn--primary"
            @click="reloadPage"
          >
            {{ t('common.reload') }}
          </button>
          <button
            class="btn btn--outline"
            @click="reportError"
          >
            {{ t('common.reportIssue') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ネットワーク状態エラー -->
    <Transition name="slide-up">
      <div
        v-if="showNetworkError"
        class="network-error"
      >
        <div class="network-error__content">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M24 4.77c-.45-.39-1.4-.39-1.4-.39s-.95 0-1.4.39L12 12.77l-9.2-8c-.45-.39-1.4-.39-1.4-.39s-.95 0-1.4.39c-.39.45-.39 1.4-.39 1.4s0 .95.39 1.4L9.2 12l-9.2 8.43c-.39.45-.39 1.4-.39 1.4s0 .95.39 1.4c.45.39 1.4.39 1.4.39s.95 0 1.4-.39L12 14.83l9.2 8c.45.39 1.4.39 1.4.39s.95 0 1.4-.39c.39-.45.39-1.4.39-1.4s0-.95-.39-1.4L14.8 12l9.2-8.43c.39-.45.39-1.4.39-1.4s0-.95-.39-1.4z"/>
          </svg>
          <span>{{ t('errors.network.offline') }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useI18n, useErrorHandler } from '../composables/useI18n'
import { useNetworkMonitor } from '../composables/useNetworkMonitor'

// Props
interface Props {
  showRetryAction?: boolean
  isDismissible?: boolean
  autoClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showRetryAction: true,
  isDismissible: true,
  autoClose: true
})

// Composables
const { notification, clearNotification, t } = useI18n()
const { handleError } = useErrorHandler()
const { isOnline } = useNetworkMonitor()

// リアクティブ状態
const hasGlobalError = ref(false)
const globalErrorMessage = ref('')
const retrying = ref(false)
const lastFailedAction = ref<Function | null>(null)

// 計算プロパティ
const showNetworkError = computed(() => !isOnline.value)

// メソッド
const closeNotification = (): void => {
  clearNotification()
}

const retryLastAction = async (): Promise<void> => {
  if (!lastFailedAction.value || retrying.value) return
  
  retrying.value = true
  try {
    await lastFailedAction.value()
    closeNotification()
  } catch (error) {
    handleError(error as Error, 'system')
  } finally {
    retrying.value = false
  }
}

const reloadPage = (): void => {
  window.location.reload()
}

const reportError = (): void => {
  // エラー報告機能の実装
  console.log('Error reporting triggered')
  
  // 将来的にはエラー報告サービスへの送信を実装
  const errorReport = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    error: globalErrorMessage.value
  }
  
  console.log('Error report:', errorReport)
}

// グローバルエラーハンドラー
const handleGlobalError = (error: Error | string, context?: string): void => {
  console.error('Global error:', error, context)
  hasGlobalError.value = true
  globalErrorMessage.value = typeof error === 'string' ? error : error.message
}

// Window error listeners
const handleWindowError = (event: ErrorEvent): void => {
  handleGlobalError(event.error || event.message, 'window')
}

const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
  handleGlobalError(event.reason, 'promise')
}

// ライフサイクル
onMounted(() => {
  window.addEventListener('error', handleWindowError)
  window.addEventListener('unhandledrejection', handleUnhandledRejection)
})

onUnmounted(() => {
  window.removeEventListener('error', handleWindowError)
  window.removeEventListener('unhandledrejection', handleUnhandledRejection)
})

// リアクティブな監視
watch(
  () => notification.value,
  (newNotification) => {
    if (newNotification && props.autoClose && newNotification.duration) {
      // 自動クローズ機能は通知システム内で実装済み
    }
  }
)

// 外部からのアクセス用
const setLastFailedAction = (action: Function): void => {
  lastFailedAction.value = action
}

// Expose for parent components
defineExpose({
  setLastFailedAction,
  handleGlobalError
})
</script>

<style scoped>
/* =================================
   エラーハンドラー ベーススタイル
   ================================= */

.error-handler {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* =================================
   通知システム
   ================================= */

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  min-width: 320px;
  max-width: 480px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  font-size: 14px;
  line-height: 1.5;
}

.notification__content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  position: relative;
}

.notification__icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-top: 2px;
}

.notification__text {
  flex: 1;
  min-width: 0;
}

.notification__title {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
  color: currentColor;
}

.notification__message {
  margin: 0;
  color: currentColor;
  opacity: 0.9;
}

.notification__actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.notification__close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.notification__close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.notification__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  animation: progress-countdown linear forwards;
}

/* 通知タイプ別スタイル */
.notification--success {
  background: linear-gradient(135deg, #10b981, #06b6d4);
  color: white;
}

.notification--error {
  background: linear-gradient(135deg, #ef4444, #f59e0b);
  color: white;
}

.notification--warning {
  background: linear-gradient(135deg, #f59e0b, #eab308);
  color: white;
}

.notification--info {
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  color: white;
}

/* =================================
   エラー境界
   ================================= */

.error-boundary {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10001;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.error-boundary__content {
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 480px;
  text-align: center;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.3);
}

.error-boundary__icon {
  margin-bottom: 24px;
  color: #ef4444;
}

.error-boundary__title {
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.error-boundary__message {
  margin: 0 0 32px 0;
  color: #6b7280;
  line-height: 1.6;
}

.error-boundary__actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* =================================
   ネットワークエラー
   ================================= */

.network-error {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: rgba(239, 68, 68, 0.95);
  color: white;
  padding: 12px 20px;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 500;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.network-error__content {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* =================================
   アイコン
   ================================= */

.icon {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.icon--large {
  width: 48px;
  height: 48px;
}

.icon--spinning {
  animation: spin 1s linear infinite;
}

/* =================================
   ボタン
   ================================= */

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn--small {
  padding: 6px 12px;
  font-size: 12px;
}

.btn--primary {
  background: #3b82f6;
  color: white;
}

.btn--primary:hover {
  background: #2563eb;
}

.btn--outline {
  background: transparent;
  color: currentColor;
  border: 1.5px solid currentColor;
}

.btn--outline:hover {
  background: currentColor;
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* =================================
   アニメーション
   ================================= */

/* スライドダウン */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* スライドアップ */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* 回転 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* プログレス */
@keyframes progress-countdown {
  from { width: 100%; }
  to { width: 0%; }
}

/* =================================
   レスポンシブ対応
   ================================= */

@media (max-width: 768px) {
  .notification {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }
  
  .error-boundary__content {
    margin: 20px;
    padding: 24px;
  }
  
  .error-boundary__actions {
    flex-direction: column;
  }
  
  .network-error {
    bottom: 10px;
    left: 10px;
    right: 10px;
    transform: none;
  }
}

/* =================================
   アクセシビリティ対応
   ================================= */

@media (prefers-reduced-motion: reduce) {
  .notification,
  .network-error,
  .slide-down-enter-active,
  .slide-down-leave-active,
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: none;
  }
  
  .icon--spinning {
    animation: none;
  }
  
  .notification__progress {
    animation: none;
  }
}

/* 高コントラストモード */
@media (prefers-contrast: high) {
  .notification {
    border: 2px solid currentColor;
  }
  
  .error-boundary__content {
    border: 2px solid #ef4444;
  }
  
  .network-error {
    border: 2px solid white;
  }
}
</style>