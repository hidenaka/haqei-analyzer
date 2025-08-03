<template>
  <div class="sync-progress-manager">
    <!-- プログレス表示ヘッダー -->
    <div class="progress-header">
      <div class="header-info">
        <h3 class="progress-title">
          <svg class="title-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
          </svg>
          同期進捗管理
        </h3>
        <div class="progress-summary">
          {{ progressSummaryText }}
        </div>
      </div>
      
      <div class="header-controls">
        <button 
          v-if="canPause"
          @click="pauseSync"
          class="control-button pause"
          :disabled="!isSyncing"
        >
          <svg class="button-icon" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
          一時停止
        </button>
        
        <button 
          v-if="canResume"
          @click="resumeSync"
          class="control-button resume"
          :disabled="!isPaused"
        >
          <svg class="button-icon" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          再開
        </button>
        
        <button 
          v-if="canCancel"
          @click="cancelSync"
          class="control-button cancel"
          :disabled="!isSyncing && !isPaused"
        >
          <svg class="button-icon" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
          キャンセル
        </button>
      </div>
    </div>

    <!-- 全体進捗バー -->
    <div class="overall-progress">
      <div class="progress-info">
        <div class="progress-label">全体進捗</div>
        <div class="progress-percentage">{{ Math.round(overallProgress) }}%</div>
      </div>
      
      <div class="progress-bar-container">
        <div class="progress-bar overall">
          <div 
            class="progress-fill"
            :style="{ 
              width: `${overallProgress}%`,
              backgroundColor: getProgressColor(overallProgress)
            }"
          >
            <div class="progress-shine"></div>
          </div>
        </div>
      </div>
      
      <div class="progress-details">
        <span class="detail-item">
          完了: {{ completedOperations }} / {{ totalOperations }}
        </span>
        <span class="detail-item">
          残り時間: {{ estimatedTimeRemaining }}
        </span>
      </div>
    </div>

    <!-- 操作別進捗 -->
    <div v-if="operations.length > 0" class="operations-progress">
      <h4 class="operations-title">操作詳細</h4>
      
      <div class="operations-list">
        <div 
          v-for="operation in operations" 
          :key="operation.id"
          class="operation-item"
          :class="getOperationStatusClass(operation)"
        >
          <div class="operation-header">
            <div class="operation-info">
              <div class="operation-type">
                <svg class="operation-icon" viewBox="0 0 24 24">
                  <path v-if="operation.type === 'upload'" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  <path v-else-if="operation.type === 'download'" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
                  <path v-else d="M12,18.17L8.83,15L7.42,16.41L12,21L16.58,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.42,7.59L8.83,9L12,5.83Z"/>
                </svg>
                <span class="operation-name">{{ getOperationName(operation.type) }}</span>
              </div>
              
              <div class="operation-meta">
                <span class="table-name">{{ operation.tableName }}</span>
                <span class="record-info">{{ operation.recordCount }} 件</span>
              </div>
            </div>
            
            <div class="operation-status">
              <div class="status-indicator" :class="getStatusIndicatorClass(operation)">
                <svg v-if="operation.status === 'completed'" class="status-icon" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <svg v-else-if="operation.status === 'error'" class="status-icon" viewBox="0 0 24 24">
                  <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                </svg>
                <svg v-else-if="operation.status === 'paused'" class="status-icon" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
                <div v-else class="loading-spinner">
                  <div class="spinner-ring"></div>
                </div>
              </div>
              
              <span class="status-text">{{ getOperationStatusText(operation) }}</span>
            </div>
          </div>
          
          <div class="operation-progress">
            <div class="progress-bar operation">
              <div 
                class="progress-fill"
                :style="{ 
                  width: `${operation.progress}%`,
                  backgroundColor: getOperationProgressColor(operation)
                }"
              >
                <div class="progress-shine"></div>
              </div>
            </div>
            
            <div class="progress-info-row">
              <span class="progress-text">{{ operation.progress }}%</span>
              <span class="progress-speed" v-if="operation.speed">
                {{ formatSpeed(operation.speed) }}
              </span>
              <span class="progress-eta" v-if="operation.eta">
                残り {{ formatDuration(operation.eta) }}
              </span>
            </div>
          </div>
          
          <!-- エラー情報 -->
          <div v-if="operation.error" class="operation-error">
            <div class="error-header">
              <svg class="error-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
              </svg>
              <span class="error-title">エラーが発生しました</span>
            </div>
            <div class="error-details">
              <p class="error-message">{{ operation.error.message }}</p>
              <div class="error-actions">
                <button 
                  @click="retryOperation(operation.id)"
                  class="retry-button"
                  :disabled="isRetrying(operation.id)"
                >
                  <svg class="retry-icon" viewBox="0 0 24 24">
                    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                  </svg>
                  {{ isRetrying(operation.id) ? '再試行中...' : '再試行' }}
                </button>
                
                <button 
                  @click="skipOperation(operation.id)"
                  class="skip-button"
                >
                  スキップ
                </button>
              </div>
            </div>
          </div>
          
          <!-- 詳細情報（展開可能） -->
          <details v-if="operation.details" class="operation-details">
            <summary class="details-toggle">
              <svg class="toggle-icon" viewBox="0 0 24 24">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
              詳細情報
            </summary>
            <div class="details-content">
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">開始時刻:</span>
                  <span class="detail-value">{{ formatTimestamp(operation.startTime) }}</span>
                </div>
                <div class="detail-item" v-if="operation.endTime">
                  <span class="detail-label">完了時刻:</span>
                  <span class="detail-value">{{ formatTimestamp(operation.endTime) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">処理時間:</span>
                  <span class="detail-value">{{ getOperationDuration(operation) }}</span>
                </div>
                <div class="detail-item" v-if="operation.bytesTransferred">
                  <span class="detail-label">転送量:</span>
                  <span class="detail-value">{{ formatBytes(operation.bytesTransferred) }}</span>
                </div>
                <div class="detail-item" v-if="operation.averageSpeed">
                  <span class="detail-label">平均速度:</span>
                  <span class="detail-value">{{ formatSpeed(operation.averageSpeed) }}</span>
                </div>
                <div class="detail-item" v-if="operation.retryCount > 0">
                  <span class="detail-label">再試行回数:</span>
                  <span class="detail-value">{{ operation.retryCount }}</span>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>

    <!-- 統計情報 -->
    <div class="sync-statistics">
      <h4 class="statistics-title">同期統計</h4>
      
      <div class="statistics-grid">
        <div class="stat-card">
          <div class="stat-header">
            <svg class="stat-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span class="stat-label">成功率</span>
          </div>
          <div class="stat-value success">{{ Math.round(successRate) }}%</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <svg class="stat-icon" viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
            <span class="stat-label">平均時間</span>
          </div>
          <div class="stat-value">{{ formatDuration(averageOperationTime) }}</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <svg class="stat-icon" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            <span class="stat-label">転送量</span>
          </div>
          <div class="stat-value">{{ formatBytes(totalBytesTransferred) }}</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <svg class="stat-icon" viewBox="0 0 24 24">
              <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18z"/>
            </svg>
            <span class="stat-label">再試行回数</span>
          </div>
          <div class="stat-value retry">{{ totalRetries }}</div>
        </div>
      </div>
    </div>

    <!-- 履歴とログ -->
    <div v-if="showLogs" class="sync-logs">
      <div class="logs-header">
        <h4 class="logs-title">同期ログ</h4>
        <button 
          @click="clearLogs"
          class="clear-logs-button"
        >
          <svg class="clear-icon" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
          ログをクリア
        </button>
      </div>
      
      <div class="logs-container">
        <div 
          v-for="log in logs" 
          :key="log.id"
          class="log-entry"
          :class="getLogLevelClass(log.level)"
        >
          <div class="log-timestamp">{{ formatTimestamp(log.timestamp) }}</div>
          <div class="log-level">{{ log.level.toUpperCase() }}</div>
          <div class="log-message">{{ log.message }}</div>
        </div>
        
        <div v-if="logs.length === 0" class="empty-logs">
          ログがありません
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

export default {
  name: 'SyncProgressManager',
  props: {
    operations: {
      type: Array,
      default: () => []
    },
    showLogs: {
      type: Boolean,
      default: true
    },
    canPause: {
      type: Boolean,
      default: true
    },
    canResume: {
      type: Boolean,
      default: true
    },
    canCancel: {
      type: Boolean,
      default: true
    }
  },
  emits: ['pause', 'resume', 'cancel', 'retry-operation', 'skip-operation', 'clear-logs'],
  setup(props, { emit }) {
    // リアクティブデータ
    const retryingOperations = ref(new Set())
    const logs = ref([])
    const startTime = ref(Date.now())

    // 計算されたプロパティ
    const isSyncing = computed(() => {
      return props.operations.some(op => op.status === 'running')
    })

    const isPaused = computed(() => {
      return props.operations.some(op => op.status === 'paused')
    })

    const overallProgress = computed(() => {
      if (props.operations.length === 0) return 0
      
      const totalProgress = props.operations.reduce((sum, op) => sum + op.progress, 0)
      return totalProgress / props.operations.length
    })

    const completedOperations = computed(() => {
      return props.operations.filter(op => op.status === 'completed').length
    })

    const totalOperations = computed(() => {
      return props.operations.length
    })

    const progressSummaryText = computed(() => {
      if (props.operations.length === 0) return '同期操作はありません'
      
      const completed = completedOperations.value
      const total = totalOperations.value
      const progress = Math.round(overallProgress.value)
      
      if (completed === total) {
        return `すべての操作が完了しました (${total}/${total})`
      } else if (isSyncing.value) {
        return `同期中... ${progress}% (${completed}/${total})`
      } else if (isPaused.value) {
        return `一時停止中 ${progress}% (${completed}/${total})`
      } else {
        return `待機中 (${completed}/${total})`
      }
    })

    const estimatedTimeRemaining = computed(() => {
      if (!isSyncing.value || overallProgress.value === 0) return '--'
      
      const elapsed = Date.now() - startTime.value
      const progressRatio = overallProgress.value / 100
      const estimatedTotal = elapsed / progressRatio
      const remaining = estimatedTotal - elapsed
      
      return formatDuration(Math.max(0, remaining))
    })

    const successRate = computed(() => {
      if (props.operations.length === 0) return 100
      
      const successful = props.operations.filter(op => op.status === 'completed').length
      return (successful / props.operations.length) * 100
    })

    const averageOperationTime = computed(() => {
      const completedOps = props.operations.filter(op => 
        op.status === 'completed' && op.startTime && op.endTime
      )
      
      if (completedOps.length === 0) return 0
      
      const totalTime = completedOps.reduce((sum, op) => 
        sum + (op.endTime - op.startTime), 0
      )
      
      return totalTime / completedOps.length
    })

    const totalBytesTransferred = computed(() => {
      return props.operations.reduce((sum, op) => 
        sum + (op.bytesTransferred || 0), 0
      )
    })

    const totalRetries = computed(() => {
      return props.operations.reduce((sum, op) => 
        sum + (op.retryCount || 0), 0
      )
    })

    // メソッド
    const pauseSync = () => {
      emit('pause')
      addLog('info', '同期を一時停止しました')
    }

    const resumeSync = () => {
      emit('resume')
      addLog('info', '同期を再開しました')
    }

    const cancelSync = () => {
      emit('cancel')
      addLog('warn', '同期をキャンセルしました')
    }

    const retryOperation = (operationId) => {
      retryingOperations.value.add(operationId)
      emit('retry-operation', operationId)
      addLog('info', `操作 ${operationId} を再試行しています`)
      
      // 3秒後に再試行状態を解除
      setTimeout(() => {
        retryingOperations.value.delete(operationId)
      }, 3000)
    }

    const skipOperation = (operationId) => {
      emit('skip-operation', operationId)
      addLog('warn', `操作 ${operationId} をスキップしました`)
    }

    const clearLogs = () => {
      logs.value = []
      emit('clear-logs')
    }

    const isRetrying = (operationId) => {
      return retryingOperations.value.has(operationId)
    }

    const getOperationStatusClass = (operation) => ({
      'operation-running': operation.status === 'running',
      'operation-completed': operation.status === 'completed',
      'operation-error': operation.status === 'error',
      'operation-paused': operation.status === 'paused',
      'operation-pending': operation.status === 'pending'
    })

    const getStatusIndicatorClass = (operation) => ({
      'status-running': operation.status === 'running',
      'status-completed': operation.status === 'completed',
      'status-error': operation.status === 'error',
      'status-paused': operation.status === 'paused',
      'status-pending': operation.status === 'pending'
    })

    const getOperationName = (type) => {
      const names = {
        upload: 'アップロード',
        download: 'ダウンロード',
        merge: 'マージ',
        sync: '同期',
        backup: 'バックアップ',
        restore: '復元'
      }
      return names[type] || type
    }

    const getOperationStatusText = (operation) => {
      const texts = {
        running: '実行中',
        completed: '完了',
        error: 'エラー',
        paused: '一時停止',
        pending: '待機中'
      }
      return texts[operation.status] || operation.status
    }

    const getProgressColor = (progress) => {
      if (progress >= 100) return 'var(--success-color, #10b981)'
      if (progress >= 75) return 'var(--info-color, #06b6d4)'
      if (progress >= 50) return 'var(--primary-color, #3b82f6)'
      if (progress >= 25) return 'var(--warning-color, #f59e0b)'
      return 'var(--error-color, #ef4444)'
    }

    const getOperationProgressColor = (operation) => {
      if (operation.status === 'error') return 'var(--error-color, #ef4444)'
      if (operation.status === 'completed') return 'var(--success-color, #10b981)'
      if (operation.status === 'paused') return 'var(--warning-color, #f59e0b)'
      return getProgressColor(operation.progress)
    }

    const getLogLevelClass = (level) => ({
      'log-info': level === 'info',
      'log-warn': level === 'warn',
      'log-error': level === 'error',
      'log-debug': level === 'debug'
    })

    const formatDuration = (ms) => {
      if (!ms || ms < 0) return '--'
      
      const seconds = Math.floor(ms / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      
      if (hours > 0) {
        return `${hours}時間${minutes % 60}分`
      } else if (minutes > 0) {
        return `${minutes}分${seconds % 60}秒`
      } else {
        return `${seconds}秒`
      }
    }

    const formatSpeed = (bytesPerSecond) => {
      if (!bytesPerSecond) return '--'
      
      const units = ['B/s', 'KB/s', 'MB/s', 'GB/s']
      let value = bytesPerSecond
      let unitIndex = 0
      
      while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024
        unitIndex++
      }
      
      return `${value.toFixed(1)} ${units[unitIndex]}`
    }

    const formatBytes = (bytes) => {
      if (!bytes) return '0 B'
      
      const units = ['B', 'KB', 'MB', 'GB', 'TB']
      let value = bytes
      let unitIndex = 0
      
      while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024
        unitIndex++
      }
      
      return `${value.toFixed(1)} ${units[unitIndex]}`
    }

    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp)
      return date.toLocaleString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    const getOperationDuration = (operation) => {
      if (!operation.startTime) return '--'
      
      const endTime = operation.endTime || Date.now()
      const duration = endTime - operation.startTime
      
      return formatDuration(duration)
    }

    const addLog = (level, message) => {
      logs.value.unshift({
        id: Date.now() + Math.random(),
        timestamp: Date.now(),
        level,
        message
      })
      
      // ログの最大数を制限
      if (logs.value.length > 100) {
        logs.value = logs.value.slice(0, 100)
      }
    }

    // 監視
    watch(() => props.operations, (newOps, oldOps) => {
      // 新しい操作の検出
      newOps.forEach(newOp => {
        const oldOp = oldOps?.find(op => op.id === newOp.id)
        
        if (!oldOp) {
          addLog('info', `新しい操作を開始: ${getOperationName(newOp.type)} (${newOp.tableName})`)
        } else if (oldOp.status !== newOp.status) {
          if (newOp.status === 'completed') {
            addLog('info', `操作完了: ${getOperationName(newOp.type)} (${newOp.tableName})`)
          } else if (newOp.status === 'error') {
            addLog('error', `操作エラー: ${getOperationName(newOp.type)} (${newOp.tableName}) - ${newOp.error?.message || '不明なエラー'}`)
          }
        }
      })
    }, { deep: true })

    // ライフサイクル
    onMounted(() => {
      addLog('info', '同期進捗管理を開始しました')
    })

    onUnmounted(() => {
      retryingOperations.value.clear()
    })

    return {
      // データ
      retryingOperations,
      logs,
      
      // 計算されたプロパティ
      isSyncing,
      isPaused,
      overallProgress,
      completedOperations,
      totalOperations,
      progressSummaryText,
      estimatedTimeRemaining,
      successRate,
      averageOperationTime,
      totalBytesTransferred,
      totalRetries,
      
      // メソッド
      pauseSync,
      resumeSync,
      cancelSync,
      retryOperation,
      skipOperation,
      clearLogs,
      isRetrying,
      getOperationStatusClass,
      getStatusIndicatorClass,
      getOperationName,
      getOperationStatusText,
      getProgressColor,
      getOperationProgressColor,
      getLogLevelClass,
      formatDuration,
      formatSpeed,
      formatBytes,
      formatTimestamp,
      getOperationDuration
    }
  }
}
</script>

<style scoped>
.sync-progress-manager {
  background: var(--bg-color, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* プログレス表示ヘッダー */
.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 24px;
  background: var(--bg-secondary, #f9fafb);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  gap: 16px;
}

.header-info {
  flex: 1;
}

.progress-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-color, #1f2937);
}

.title-icon {
  width: 24px;
  height: 24px;
  fill: var(--primary-color, #3b82f6);
}

.progress-summary {
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.4;
}

.header-controls {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.control-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 6px;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #374151);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-button:hover:not(:disabled) {
  border-color: var(--primary-color, #3b82f6);
  background: var(--primary-light, #eff6ff);
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-button.pause {
  border-color: var(--warning-color, #f59e0b);
  color: var(--warning-color, #f59e0b);
}

.control-button.resume {
  border-color: var(--success-color, #10b981);
  color: var(--success-color, #10b981);
}

.control-button.cancel {
  border-color: var(--error-color, #ef4444);
  color: var(--error-color, #ef4444);
}

.button-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* 全体進捗バー */
.overall-progress {
  padding: 24px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color, #374151);
}

.progress-percentage {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-color, #3b82f6);
}

.progress-bar-container {
  margin-bottom: 12px;
}

.progress-bar {
  height: 12px;
  background: var(--bg-secondary, #f3f4f6);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.progress-bar.overall {
  height: 16px;
  border-radius: 8px;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color, #3b82f6);
  border-radius: inherit;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.progress-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 2s infinite;
}

.progress-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
}

.detail-item {
  font-weight: 500;
}

/* 操作別進捗 */
.operations-progress {
  padding: 24px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.operations-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color, #1f2937);
}

.operations-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.operation-item {
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s ease;
}

.operation-item.operation-running {
  border-color: var(--info-color, #06b6d4);
  background: var(--info-light, #ecfeff);
}

.operation-item.operation-completed {
  border-color: var(--success-color, #10b981);
  background: var(--success-light, #ecfdf5);
}

.operation-item.operation-error {
  border-color: var(--error-color, #ef4444);
  background: var(--error-light, #fef2f2);
}

.operation-item.operation-paused {
  border-color: var(--warning-color, #f59e0b);
  background: var(--warning-light, #fffbeb);
}

.operation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 16px;
}

.operation-info {
  flex: 1;
}

.operation-type {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.operation-icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
  opacity: 0.7;
}

.operation-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color, #374151);
}

.operation-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
}

.operation-status {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.status-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-indicator.status-running {
  background: var(--info-color, #06b6d4);
}

.status-indicator.status-completed {
  background: var(--success-color, #10b981);
}

.status-indicator.status-error {
  background: var(--error-color, #ef4444);
}

.status-indicator.status-paused {
  background: var(--warning-color, #f59e0b);
}

.status-indicator.status-pending {
  background: var(--text-secondary, #6b7280);
}

.status-icon {
  width: 14px;
  height: 14px;
  fill: white;
}

.loading-spinner {
  width: 16px;
  height: 16px;
}

.spinner-ring {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.status-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color, #374151);
}

.operation-progress {
  margin-bottom: 12px;
}

.progress-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 11px;
  color: var(--text-secondary, #6b7280);
}

.progress-text {
  font-weight: 600;
}

/* エラー情報 */
.operation-error {
  margin-top: 12px;
  padding: 12px;
  background: var(--error-light, #fef2f2);
  border: 1px solid var(--error-color, #ef4444);
  border-radius: 6px;
}

.error-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.error-icon {
  width: 16px;
  height: 16px;
  fill: var(--error-color, #ef4444);
}

.error-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--error-color, #ef4444);
}

.error-message {
  margin: 0 0 12px;
  font-size: 12px;
  color: var(--text-color, #374151);
  line-height: 1.4;
}

.error-actions {
  display: flex;
  gap: 8px;
}

.retry-button,
.skip-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 4px;
  background: var(--bg-color, #ffffff);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-button {
  color: var(--success-color, #10b981);
  border-color: var(--success-color, #10b981);
}

.retry-button:hover:not(:disabled) {
  background: var(--success-light, #ecfdf5);
}

.skip-button {
  color: var(--text-secondary, #6b7280);
}

.skip-button:hover {
  background: var(--bg-secondary, #f9fafb);
}

.retry-icon {
  width: 12px;
  height: 12px;
  fill: currentColor;
}

/* 詳細情報 */
.operation-details {
  margin-top: 12px;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 6px;
  overflow: hidden;
}

.details-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-secondary, #f9fafb);
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color, #374151);
  list-style: none;
}

.details-toggle::-webkit-details-marker {
  display: none;
}

.toggle-icon {
  width: 14px;
  height: 14px;
  fill: currentColor;
  transition: transform 0.2s ease;
}

.operation-details[open] .toggle-icon {
  transform: rotate(180deg);
}

.details-content {
  padding: 12px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.detail-label {
  color: var(--text-secondary, #6b7280);
  font-weight: 500;
}

.detail-value {
  color: var(--text-color, #374151);
  font-weight: 600;
}

/* 統計情報 */
.sync-statistics {
  padding: 24px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.statistics-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color, #1f2937);
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stat-icon {
  width: 20px;
  height: 20px;
  fill: var(--primary-color, #3b82f6);
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color, #1f2937);
}

.stat-value.success {
  color: var(--success-color, #10b981);
}

.stat-value.retry {
  color: var(--warning-color, #f59e0b);
}

/* ログ */
.sync-logs {
  padding: 24px;
}

.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.logs-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color, #1f2937);
}

.clear-logs-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 4px;
  background: var(--bg-color, #ffffff);
  color: var(--text-secondary, #6b7280);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-logs-button:hover {
  border-color: var(--error-color, #ef4444);
  color: var(--error-color, #ef4444);
}

.clear-icon {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

.logs-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 6px;
  background: var(--code-bg, #f8fafc);
}

.log-entry {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 12px;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  font-size: 12px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.log-entry:last-child {
  border-bottom: none;
}

.log-entry.log-info {
  background: var(--info-light, #ecfeff);
}

.log-entry.log-warn {
  background: var(--warning-light, #fffbeb);
}

.log-entry.log-error {
  background: var(--error-light, #fef2f2);
}

.log-timestamp {
  color: var(--text-secondary, #6b7280);
  font-weight: 500;
}

.log-level {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 700;
  text-align: center;
  min-width: 50px;
}

.log-info .log-level {
  background: var(--info-color, #06b6d4);
  color: white;
}

.log-warn .log-level {
  background: var(--warning-color, #f59e0b);
  color: white;
}

.log-error .log-level {
  background: var(--error-color, #ef4444);
  color: white;
}

.log-debug .log-level {
  background: var(--text-secondary, #6b7280);
  color: white;
}

.log-message {
  color: var(--text-color, #374151);
  line-height: 1.4;
}

.empty-logs {
  padding: 24px;
  text-align: center;
  color: var(--text-secondary, #6b7280);
  font-style: italic;
}

/* アニメーション */
@keyframes shine {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .progress-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .header-controls {
    justify-content: center;
  }
  
  .progress-details {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }
  
  .operation-header {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .operation-status {
    justify-content: center;
  }
  
  .statistics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .log-entry {
    grid-template-columns: 1fr;
    gap: 4px;
    text-align: left;
  }
}

@media (max-width: 480px) {
  .sync-progress-manager {
    margin: 0 -16px;
    border-radius: 0;
  }
  
  .progress-header,
  .overall-progress,
  .operations-progress,
  .sync-statistics,
  .sync-logs {
    padding: 16px;
  }
  
  .statistics-grid {
    grid-template-columns: 1fr;
  }
  
  .control-button {
    padding: 6px 12px;
    font-size: 12px;
  }
}

/* ダークモード対応 */
@media (prefers-color-scheme: dark) {
  .sync-progress-manager {
    --bg-color: #1f2937;
    --card-bg: #374151;
    --bg-secondary: #374151;
    --text-color: #f9fafb;
    --text-secondary: #d1d5db;
    --border-color: #4b5563;
    --code-bg: #374151;
    --info-light: #164e63;
    --success-light: #064e3b;
    --error-light: #7f1d1d;
    --warning-light: #78350f;
  }
}

/* 高コントラスト対応 */
@media (prefers-contrast: high) {
  .operation-item,
  .stat-card,
  .operation-details {
    border-width: 2px;
  }
  
  .control-button,
  .retry-button,
  .skip-button {
    border-width: 2px;
  }
}

/* アニメーション削減対応 */
@media (prefers-reduced-motion: reduce) {
  .progress-fill,
  .toggle-icon,
  * {
    transition: none;
    animation: none;
  }
}
</style>