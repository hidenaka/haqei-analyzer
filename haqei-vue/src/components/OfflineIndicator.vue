<template>
  <div class="offline-indicator-container">
    <!-- オフライン状態インジケーター -->
    <transition name="slide-down">
      <div 
        v-if="!isOnline"
        class="offline-banner"
        role="alert"
        aria-live="polite"
      >
        <div class="offline-content">
          <svg class="offline-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <div class="offline-text">
            <h3 class="offline-title">オフライン モード</h3>
            <p class="offline-message">{{ offlineMessage }}</p>
          </div>
          <button 
            @click="retryConnection"
            class="retry-button"
            :disabled="isRetrying"
            :aria-label="isRetrying ? '接続を確認中...' : 'インターネット接続を再試行'"
          >
            <span v-if="!isRetrying">再試行</span>
            <span v-else class="retry-loading">
              <svg class="spinner" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="4"/>
                <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </transition>

    <!-- ネットワーク状況表示 -->
    <div 
      v-if="showNetworkInfo"
      class="network-status"
      :class="networkStatusClass"
    >
      <div class="network-indicator">
        <div class="connection-bars">
          <div 
            v-for="i in 4" 
            :key="i"
            class="bar"
            :class="{ active: i <= connectionStrength }"
          ></div>
        </div>
        <span class="network-label">{{ networkStatusText }}</span>
      </div>
    </div>

    <!-- 同期ステータス -->
    <div 
      v-if="showSyncStatus && syncStatus !== 'idle'"
      class="sync-status"
      :class="syncStatusClass"
    >
      <div class="sync-content">
        <svg 
          v-if="syncStatus === 'syncing'" 
          class="sync-icon spinning"
          viewBox="0 0 24 24"
        >
          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
        </svg>
        <svg 
          v-else-if="syncStatus === 'success'" 
          class="sync-icon"
          viewBox="0 0 24 24"
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        <svg 
          v-else-if="syncStatus === 'error'" 
          class="sync-icon"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
        </svg>
        <span class="sync-text">{{ syncStatusText }}</span>
      </div>
    </div>

    <!-- データ使用量表示（オプション） -->
    <div 
      v-if="showDataUsage && dataUsage"
      class="data-usage"
    >
      <div class="data-usage-content">
        <span class="data-label">オフライン データ</span>
        <div class="data-bar">
          <div 
            class="data-progress"
            :style="{ width: `${dataUsage.percentage}%` }"
          ></div>
        </div>
        <span class="data-text">{{ dataUsage.used }} / {{ dataUsage.total }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useOfflineDatabase } from '@/composables/useOfflineDatabase'

export default {
  name: 'OfflineIndicator',
  props: {
    // 表示オプション
    showNetworkInfo: {
      type: Boolean,
      default: true
    },
    showSyncStatus: {
      type: Boolean,
      default: true
    },
    showDataUsage: {
      type: Boolean,
      default: false
    },
    // 自動再試行設定
    autoRetry: {
      type: Boolean,
      default: true
    },
    retryInterval: {
      type: Number,
      default: 30000 // 30秒
    },
    // カスタムメッセージ
    customOfflineMessage: {
      type: String,
      default: ''
    }
  },
  emits: ['online', 'offline', 'sync-start', 'sync-complete', 'sync-error'],
  setup(props, { emit }) {
    // リアクティブデータ
    const isOnline = ref(navigator.onLine || false)
    const isRetrying = ref(false)
    const connectionStrength = ref(4)
    const syncStatus = ref('idle') // idle, syncing, success, error
    const dataUsage = ref(null)
    
    // オフラインデータベース
    const { isReady, initializeDatabase, syncData } = useOfflineDatabase()

    // 自動再試行タイマー
    let retryTimer = null
    let networkCheckTimer = null

    // 計算されたプロパティ
    const offlineMessage = computed(() => {
      if (props.customOfflineMessage) {
        return props.customOfflineMessage
      }
      
      if (isReady.value) {
        return 'インターネット接続が切断されました。データはローカルに保存され、接続が復旧すると自動で同期されます。'
      } else {
        return 'インターネット接続が必要です。接続を確認してから再試行してください。'
      }
    })

    const networkStatusClass = computed(() => ({
      'network-excellent': connectionStrength.value === 4,
      'network-good': connectionStrength.value === 3,
      'network-poor': connectionStrength.value === 2,
      'network-weak': connectionStrength.value === 1
    }))

    const networkStatusText = computed(() => {
      const labels = ['圏外', '弱い', '普通', '良好', '優秀']
      return labels[connectionStrength.value] || '不明'
    })

    const syncStatusClass = computed(() => ({
      'sync-syncing': syncStatus.value === 'syncing',
      'sync-success': syncStatus.value === 'success',
      'sync-error': syncStatus.value === 'error'
    }))

    const syncStatusText = computed(() => {
      const texts = {
        idle: '',
        syncing: '同期中...',
        success: '同期完了',
        error: '同期エラー'
      }
      return texts[syncStatus.value] || ''
    })

    // メソッド
    const updateOnlineStatus = () => {
      const wasOnline = isOnline.value
      isOnline.value = navigator.onLine
      
      if (wasOnline !== isOnline.value) {
        if (isOnline.value) {
          emit('online')
          handleOnlineRecovery()
        } else {
          emit('offline')
          handleOffline()
        }
      }
    }

    const handleOnlineRecovery = async () => {
      if (isReady.value) {
        await performSync()
      }
      
      if (props.autoRetry && retryTimer) {
        clearInterval(retryTimer)
        retryTimer = null
      }
    }

    const handleOffline = () => {
      if (props.autoRetry) {
        startAutoRetry()
      }
      updateDataUsage()
    }

    const retryConnection = async () => {
      if (isRetrying.value) return
      
      isRetrying.value = true
      
      try {
        // 接続テスト
        const response = await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache'
        })
        
        // 接続が復旧した場合
        if (response || navigator.onLine) {
          updateOnlineStatus()
        }
      } catch (error) {
        console.log('接続テスト失敗:', error.message)
      } finally {
        setTimeout(() => {
          isRetrying.value = false
        }, 1000)
      }
    }

    const startAutoRetry = () => {
      if (retryTimer) return
      
      retryTimer = setInterval(() => {
        if (navigator.onLine) {
          updateOnlineStatus()
        }
      }, props.retryInterval)
    }

    const performSync = async () => {
      if (!isOnline.value || !isReady.value) return
      
      syncStatus.value = 'syncing'
      emit('sync-start')
      
      try {
        await syncData()
        syncStatus.value = 'success'
        emit('sync-complete')
        
        // 2秒後にステータスをリセット
        setTimeout(() => {
          syncStatus.value = 'idle'
        }, 2000)
        
      } catch (error) {
        console.error('同期エラー:', error)
        syncStatus.value = 'error'
        emit('sync-error', error)
        
        // 5秒後にステータスをリセット
        setTimeout(() => {
          syncStatus.value = 'idle'
        }, 5000)
      }
    }

    const checkConnectionStrength = async () => {
      if (!isOnline.value) {
        connectionStrength.value = 0
        return
      }

      try {
        const startTime = Date.now()
        await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache'
        })
        const latency = Date.now() - startTime
        
        // レイテンシーに基づいて接続強度を設定
        if (latency < 100) connectionStrength.value = 4
        else if (latency < 300) connectionStrength.value = 3
        else if (latency < 600) connectionStrength.value = 2
        else connectionStrength.value = 1
        
      } catch (error) {
        connectionStrength.value = 1
      }
    }

    const updateDataUsage = async () => {
      if (!props.showDataUsage || !isReady.value) return
      
      try {
        // IndexedDBのストレージ使用量を取得
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          const estimate = await navigator.storage.estimate()
          const used = estimate.usage || 0
          const quota = estimate.quota || 0
          
          dataUsage.value = {
            used: formatBytes(used),
            total: formatBytes(quota),
            percentage: Math.round((used / quota) * 100)
          }
        }
      } catch (error) {
        console.error('データ使用量取得エラー:', error)
      }
    }

    const formatBytes = (bytes) => {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // ライフサイクル
    onMounted(async () => {
      // オフラインデータベースの初期化
      await initializeDatabase()
      
      // イベントリスナー設定
      window.addEventListener('online', updateOnlineStatus)
      window.addEventListener('offline', updateOnlineStatus)
      
      // 初期状態の設定
      updateOnlineStatus()
      
      // 定期的な接続強度チェック
      networkCheckTimer = setInterval(checkConnectionStrength, 5000)
      checkConnectionStrength()
      
      // データ使用量の初期取得
      updateDataUsage()
    })

    onUnmounted(() => {
      // イベントリスナー削除
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      
      // タイマークリア
      if (retryTimer) {
        clearInterval(retryTimer)
      }
      if (networkCheckTimer) {
        clearInterval(networkCheckTimer)
      }
    })

    return {
      // データ
      isOnline,
      isRetrying,
      connectionStrength,
      syncStatus,
      dataUsage,
      
      // 計算されたプロパティ
      offlineMessage,
      networkStatusClass,
      networkStatusText,
      syncStatusClass,
      syncStatusText,
      
      // メソッド
      retryConnection,
      performSync
    }
  }
}
</script>

<style scoped>
.offline-indicator-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  pointer-events: none;
}

/* オフライン バナー */
.offline-banner {
  background: linear-gradient(135deg, #ff6b6b, #ffa500);
  color: white;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  pointer-events: all;
}

.offline-content {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
}

.offline-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
  flex-shrink: 0;
}

.offline-text {
  flex: 1;
  min-width: 0;
}

.offline-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
}

.offline-message {
  margin: 4px 0 0;
  font-size: 14px;
  line-height: 1.3;
  opacity: 0.9;
}

.retry-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.retry-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.retry-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.retry-loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

/* ネットワーク状況表示 */
.network-status {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  position: fixed;
  top: 16px;
  right: 16px;
  border-radius: 20px;
  font-size: 12px;
  pointer-events: all;
  backdrop-filter: blur(10px);
}

.network-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.connection-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
}

.bar {
  width: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 1px;
  transition: all 0.3s ease;
}

.bar:nth-child(1) { height: 8px; }
.bar:nth-child(2) { height: 12px; }
.bar:nth-child(3) { height: 16px; }
.bar:nth-child(4) { height: 20px; }

.bar.active {
  background: currentColor;
}

.network-excellent { color: #4ade80; }
.network-good { color: #22d3ee; }
.network-poor { color: #fbbf24; }
.network-weak { color: #f87171; }

/* 同期ステータス */
.sync-status {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  position: fixed;
  bottom: 16px;
  right: 16px;
  border-radius: 20px;
  font-size: 12px;
  pointer-events: all;
  backdrop-filter: blur(10px);
}

.sync-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sync-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.sync-syncing { color: #22d3ee; }
.sync-success { color: #4ade80; }
.sync-error { color: #f87171; }

.spinning {
  animation: spin 1s linear infinite;
}

/* データ使用量表示 */
.data-usage {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  position: fixed;
  bottom: 60px;
  right: 16px;
  border-radius: 12px;
  font-size: 11px;
  pointer-events: all;
  backdrop-filter: blur(10px);
  min-width: 150px;
}

.data-usage-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.data-label {
  font-weight: 500;
  opacity: 0.8;
}

.data-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.data-progress {
  height: 100%;
  background: #22d3ee;
  transition: width 0.3s ease;
}

.data-text {
  font-size: 10px;
  opacity: 0.7;
  text-align: center;
}

/* アニメーション */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .offline-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .offline-text {
    order: 2;
  }
  
  .retry-button {
    order: 3;
    align-self: stretch;
  }
  
  .network-status,
  .sync-status,
  .data-usage {
    position: relative;
    top: auto;
    right: auto;
    bottom: auto;
    margin: 8px 16px;
    display: inline-block;
  }
  
  .offline-title {
    font-size: 14px;
  }
  
  .offline-message {
    font-size: 13px;
  }
}

/* ダークモード対応 */
@media (prefers-color-scheme: dark) {
  .network-status,
  .sync-status,
  .data-usage {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

/* 高コントラスト対応 */
@media (prefers-contrast: high) {
  .offline-banner {
    border: 2px solid white;
  }
  
  .retry-button {
    border: 2px solid white;
  }
  
  .network-status,
  .sync-status,
  .data-usage {
    border: 1px solid white;
  }
}

/* アニメーション削減対応 */
@media (prefers-reduced-motion: reduce) {
  .slide-down-enter-active,
  .slide-down-leave-active,
  .bar,
  .data-progress,
  .retry-button {
    transition: none;
  }
  
  .spinning,
  .spinner {
    animation: none;
  }
}
</style>