<template>
  <div class="sync-status-dashboard">
    <!-- ダッシュボードヘッダー -->
    <div class="dashboard-header">
      <div class="header-info">
        <h2 class="dashboard-title">
          <svg class="title-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
          </svg>
          データ同期管理
        </h2>
        <p class="dashboard-subtitle">オンライン・オフライン間のデータ同期状況を監視・管理</p>
      </div>
      
      <div class="header-actions">
        <button 
          @click="toggleAutoSync"
          class="action-button"
          :class="{ active: autoSyncEnabled }"
          :aria-pressed="autoSyncEnabled"
        >
          <svg class="button-icon" viewBox="0 0 24 24">
            <path v-if="autoSyncEnabled" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            <path v-else d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          {{ autoSyncEnabled ? '自動同期 ON' : '自動同期 OFF' }}
        </button>
        
        <button 
          @click="startManualSync"
          class="action-button primary"
          :disabled="isSyncing || !isOnline"
          :aria-label="isSyncing ? '同期中...' : '手動同期を開始'"
        >
          <svg 
            class="button-icon" 
            :class="{ spinning: isSyncing }"
            viewBox="0 0 24 24"
          >
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
          </svg>
          {{ isSyncing ? '同期中...' : '今すぐ同期' }}
        </button>
      </div>
    </div>

    <!-- 同期状況概要 -->
    <div class="sync-overview">
      <div class="overview-cards">
        <!-- 同期ステータス -->
        <div class="status-card" :class="syncStatusClass">
          <div class="card-header">
            <svg class="card-icon" viewBox="0 0 24 24">
              <path v-if="syncStatus === 'syncing'" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
              <path v-else-if="syncStatus === 'success'" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              <path v-else-if="syncStatus === 'error'" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
              <path v-else-if="syncStatus === 'conflict'" d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
              <path v-else d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h3 class="card-title">同期状況</h3>
          </div>
          <div class="card-content">
            <div class="status-text">{{ syncStatusText }}</div>
            <div class="status-detail">{{ lastSyncText }}</div>
            <div v-if="isSyncing" class="sync-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill"
                  :style="{ width: `${syncProgress}%` }"
                ></div>
              </div>
              <span class="progress-text">{{ syncProgress }}%</span>
            </div>
          </div>
        </div>

        <!-- ネットワーク状況 -->
        <div class="status-card" :class="networkStatusClass">
          <div class="card-header">
            <div class="network-bars">
              <div 
                v-for="i in 4" 
                :key="i"
                class="network-bar"
                :class="{ active: i <= connectionStrength }"
              ></div>
            </div>
            <h3 class="card-title">ネットワーク</h3>
          </div>
          <div class="card-content">
            <div class="status-text">{{ isOnline ? 'オンライン' : 'オフライン' }}</div>
            <div class="status-detail">接続品質: {{ networkQualityText }}</div>
            <div v-if="networkLatency" class="network-latency">
              応答時間: {{ networkLatency }}ms
            </div>
          </div>
        </div>

        <!-- 保留中データ -->
        <div class="status-card">
          <div class="card-header">
            <svg class="card-icon" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            <h3 class="card-title">保留中データ</h3>
          </div>
          <div class="card-content">
            <div class="status-text">{{ pendingChangesCount }} 件</div>
            <div class="status-detail">同期待ちのデータ</div>
          </div>
        </div>

        <!-- 競合状況 -->
        <div class="status-card" :class="{ warning: hasConflicts }">
          <div class="card-header">
            <svg class="card-icon" viewBox="0 0 24 24">
              <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            </svg>
            <h3 class="card-title">競合</h3>
          </div>
          <div class="card-content">
            <div class="status-text">{{ conflictsCount }} 件</div>
            <div class="status-detail">{{ hasConflicts ? '要解決' : '競合なし' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 進行中の同期操作 -->
    <div v-if="currentOperations.length > 0" class="sync-operations">
      <h3 class="section-title">同期操作</h3>
      <div class="operations-list">
        <div 
          v-for="operation in currentOperations" 
          :key="operation.id"
          class="operation-item"
          :class="operationStatusClass(operation)"
        >
          <div class="operation-info">
            <div class="operation-type">
              <svg class="operation-icon" viewBox="0 0 24 24">
                <path v-if="operation.type === 'upload'" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                <path v-else-if="operation.type === 'download'" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
                <path v-else d="M12,18.17L8.83,15L7.42,16.41L12,21L16.58,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.42,7.59L8.83,9L12,5.83Z"/>
              </svg>
              <span class="operation-name">{{ getOperationTypeName(operation.type) }}</span>
            </div>
            <div class="operation-details">
              <span class="table-name">{{ operation.tableName }}</span>
              <span class="record-count">{{ operation.recordCount }} 件</span>
            </div>
          </div>
          
          <div class="operation-progress">
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: `${operation.progress}%` }"
              ></div>
            </div>
            <span class="progress-percentage">{{ operation.progress }}%</span>
          </div>
          
          <div v-if="operation.error" class="operation-error">
            <svg class="error-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
            </svg>
            <span class="error-message">{{ operation.error }}</span>
          </div>
          
          <div class="operation-timing">
            <span class="timing-text">
              {{ formatOperationTime(operation) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 競合解決インターフェース -->
    <div v-if="hasConflicts" class="conflicts-section">
      <h3 class="section-title">
        <svg class="section-icon" viewBox="0 0 24 24">
          <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        </svg>
        データ競合の解決
      </h3>
      
      <div class="conflicts-list">
        <div 
          v-for="conflict in syncConflicts" 
          :key="conflict.id"
          class="conflict-item"
        >
          <div class="conflict-header">
            <div class="conflict-info">
              <h4 class="conflict-title">{{ conflict.tableName }} の競合</h4>
              <p class="conflict-detail">
                レコードID: {{ conflict.recordId }} | 
                タイプ: {{ getConflictTypeName(conflict.conflictType) }}
              </p>
            </div>
            <div class="conflict-timestamp">
              {{ formatTimestamp(conflict.timestamp) }}
            </div>
          </div>
          
          <div class="conflict-comparison">
            <div class="data-version local">
              <h5 class="version-title">ローカル版</h5>
              <pre class="data-preview">{{ formatDataPreview(conflict.localData) }}</pre>
            </div>
            
            <div class="vs-divider">
              <span class="vs-text">VS</span>
            </div>
            
            <div class="data-version remote">
              <h5 class="version-title">リモート版</h5>
              <pre class="data-preview">{{ formatDataPreview(conflict.remoteData) }}</pre>
            </div>
          </div>
          
          <div class="conflict-actions">
            <button 
              @click="resolveConflict(conflict.id, 'local')"
              class="resolve-button local"
            >
              ローカル版を採用
            </button>
            <button 
              @click="resolveConflict(conflict.id, 'remote')"
              class="resolve-button remote"
            >
              リモート版を採用
            </button>
            <button 
              @click="resolveConflict(conflict.id, 'merge')"
              class="resolve-button merge"
            >
              自動マージ
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 同期統計情報 -->
    <div class="sync-stats">
      <h3 class="section-title">同期統計</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label">最終同期</div>
          <div class="stat-value">{{ lastSyncText }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">総操作数</div>
          <div class="stat-value">{{ syncStats.totalOperations }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">成功率</div>
          <div class="stat-value">{{ syncSuccessRate }}%</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">平均時間</div>
          <div class="stat-value">{{ formatDuration(syncStats.averageSyncTime) }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">同期データ量</div>
          <div class="stat-value">{{ formatDataSize(syncStats.totalDataSynced) }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">自動同期間隔</div>
          <div class="stat-value">{{ formatDuration(syncInterval) }}</div>
        </div>
      </div>
    </div>

    <!-- 設定セクション -->
    <div class="sync-settings">
      <h3 class="section-title">同期設定</h3>
      <div class="settings-form">
        <div class="setting-item">
          <label class="setting-label" for="auto-sync-toggle">
            自動同期
          </label>
          <div class="setting-control">
            <input 
              id="auto-sync-toggle"
              type="checkbox" 
              v-model="autoSyncEnabled"
              @change="toggleAutoSync"
              class="toggle-input"
            >
            <label for="auto-sync-toggle" class="toggle-label">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
        
        <div class="setting-item">
          <label class="setting-label" for="sync-interval-select">
            同期間隔
          </label>
          <div class="setting-control">
            <select 
              id="sync-interval-select"
              v-model="selectedSyncInterval"
              @change="updateSyncInterval"
              class="interval-select"
            >
              <option value="30000">30秒</option>
              <option value="60000">1分</option>
              <option value="300000">5分</option>
              <option value="600000">10分</option>
              <option value="1800000">30分</option>
            </select>
          </div>
        </div>
        
        <div class="setting-item">
          <button 
            @click="clearSyncHistory"
            class="clear-button"
          >
            履歴をクリア
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSyncStatus } from '@/composables/useSyncStatus'
import { useNetworkMonitor } from '@/composables/useNetworkMonitor'

export default {
  name: 'SyncStatusDashboard',
  emits: ['sync-start', 'sync-complete', 'sync-error', 'conflict-resolved'],
  setup(props, { emit }) {
    // Composables
    const {
      syncStatus,
      currentOperations,
      syncConflicts,
      syncStats,
      autoSyncEnabled,
      syncInterval,
      isSyncing,
      hasConflicts,
      syncProgress,
      lastSyncText,
      syncStatusText,
      startSync,
      resolveConflict: resolveSyncConflict,
      clearSyncHistory: clearHistory,
      setAutoSync,
      setSyncInterval
    } = useSyncStatus()

    const {
      isOnline,
      connectionQuality,
      testConnection
    } = useNetworkMonitor()

    // ローカル状態
    const networkLatency = ref(null)
    const selectedSyncInterval = ref(syncInterval.value.toString())
    const connectionStrength = ref(4)

    // 計算されたプロパティ
    const syncStatusClass = computed(() => ({
      'status-syncing': syncStatus.value === 'syncing',
      'status-success': syncStatus.value === 'success',
      'status-error': syncStatus.value === 'error',
      'status-conflict': syncStatus.value === 'conflict',
      'status-idle': syncStatus.value === 'idle'
    }))

    const networkStatusClass = computed(() => ({
      'network-online': isOnline.value,
      'network-offline': !isOnline.value,
      'network-excellent': connectionQuality.value.level === 'excellent',
      'network-good': connectionQuality.value.level === 'good',
      'network-poor': connectionQuality.value.level === 'poor',
      'network-weak': connectionQuality.value.level === 'weak'
    }))

    const networkQualityText = computed(() => {
      if (!isOnline.value) return 'オフライン'
      return connectionQuality.value.description
    })

    const pendingChangesCount = computed(() => {
      return currentOperations.value.reduce((count, op) => {
        return count + (op.progress < 100 ? op.recordCount : 0)
      }, 0)
    })

    const conflictsCount = computed(() => syncConflicts.value.length)

    const syncSuccessRate = computed(() => {
      const total = syncStats.value.totalOperations
      if (total === 0) return 100
      return Math.round((syncStats.value.successfulOperations / total) * 100)
    })

    // メソッド
    const startManualSync = async () => {
      emit('sync-start')
      const success = await startSync()
      
      if (success) {
        emit('sync-complete')
      } else {
        emit('sync-error')
      }
    }

    const toggleAutoSync = () => {
      setAutoSync(!autoSyncEnabled.value)
    }

    const updateSyncInterval = () => {
      const newInterval = parseInt(selectedSyncInterval.value)
      setSyncInterval(newInterval)
    }

    const resolveConflict = async (conflictId, resolution) => {
      const success = await resolveSyncConflict(conflictId, resolution)
      
      if (success) {
        emit('conflict-resolved', { conflictId, resolution })
      }
    }

    const clearSyncHistory = () => {
      clearHistory()
    }

    const operationStatusClass = (operation) => ({
      'operation-pending': operation.progress < 100 && !operation.error,
      'operation-completed': operation.progress === 100 && !operation.error,
      'operation-error': operation.error
    })

    const getOperationTypeName = (type) => {
      const names = {
        upload: 'アップロード',
        download: 'ダウンロード',
        merge: 'マージ'
      }
      return names[type] || type
    }

    const getConflictTypeName = (type) => {
      const names = {
        version: 'バージョン競合',
        delete: '削除競合',
        update: '更新競合'
      }
      return names[type] || type
    }

    const formatOperationTime = (operation) => {
      if (operation.endTime) {
        const duration = operation.endTime - operation.startTime
        return `完了 (${formatDuration(duration)})`
      } else {
        const elapsed = Date.now() - operation.startTime
        return `実行中 (${formatDuration(elapsed)})`
      }
    }

    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp)
      return date.toLocaleString('ja-JP')
    }

    const formatDataPreview = (data) => {
      if (!data) return 'null'
      
      try {
        return JSON.stringify(data, null, 2).substring(0, 200) + '...'
      } catch (error) {
        return String(data).substring(0, 200) + '...'
      }
    }

    const formatDuration = (ms) => {
      if (ms < 1000) return `${ms}ms`
      if (ms < 60000) return `${Math.round(ms / 1000)}秒`
      if (ms < 3600000) return `${Math.round(ms / 60000)}分`
      return `${Math.round(ms / 3600000)}時間`
    }

    const formatDataSize = (bytes) => {
      if (bytes === 0) return '0 B'
      
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const updateConnectionStrength = async () => {
      try {
        const result = await testConnection()
        networkLatency.value = result.latency
        
        if (result.success) {
          if (result.latency < 100) connectionStrength.value = 4
          else if (result.latency < 300) connectionStrength.value = 3
          else if (result.latency < 600) connectionStrength.value = 2
          else connectionStrength.value = 1
        } else {
          connectionStrength.value = 0
        }
      } catch (error) {
        connectionStrength.value = 0
        networkLatency.value = null
      }
    }

    // ライフサイクル
    let strengthCheckTimer = null

    onMounted(() => {
      selectedSyncInterval.value = syncInterval.value.toString()
      
      // 定期的な接続強度チェック
      updateConnectionStrength()
      strengthCheckTimer = setInterval(updateConnectionStrength, 10000)
    })

    onUnmounted(() => {
      if (strengthCheckTimer) {
        clearInterval(strengthCheckTimer)
      }
    })

    return {
      // データ
      syncStatus,
      currentOperations,
      syncConflicts,
      syncStats,
      autoSyncEnabled,
      syncInterval,
      selectedSyncInterval,
      networkLatency,
      connectionStrength,
      
      // 計算されたプロパティ
      syncStatusClass,
      networkStatusClass,
      networkQualityText,
      isSyncing,
      hasConflicts,
      syncProgress,
      lastSyncText,
      syncStatusText,
      isOnline,
      pendingChangesCount,
      conflictsCount,
      syncSuccessRate,
      
      // メソッド
      startManualSync,
      toggleAutoSync,
      updateSyncInterval,
      resolveConflict,
      clearSyncHistory,
      operationStatusClass,
      getOperationTypeName,
      getConflictTypeName,
      formatOperationTime,
      formatTimestamp,
      formatDataPreview,
      formatDuration,
      formatDataSize
    }
  }
}
</script>

<style scoped>
.sync-status-dashboard {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #1f2937);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ダッシュボードヘッダー */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 24px;
}

.header-info {
  flex: 1;
}

.dashboard-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color, #3b82f6);
}

.title-icon {
  width: 32px;
  height: 32px;
  fill: currentColor;
}

.dashboard-subtitle {
  margin: 0;
  font-size: 16px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.5;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 2px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #374151);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover:not(:disabled) {
  border-color: var(--primary-color, #3b82f6);
  background: var(--primary-light, #eff6ff);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button.active {
  background: var(--success-color, #10b981);
  border-color: var(--success-color, #10b981);
  color: white;
}

.action-button.primary {
  background: var(--primary-color, #3b82f6);
  border-color: var(--primary-color, #3b82f6);
  color: white;
}

.action-button.primary:hover:not(:disabled) {
  background: var(--primary-dark, #2563eb);
  border-color: var(--primary-dark, #2563eb);
}

.button-icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.spinning {
  animation: spin 1s linear infinite;
}

/* 同期状況概要 */
.sync-overview {
  margin-bottom: 32px;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.status-card {
  background: var(--card-bg, #ffffff);
  border: 2px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
}

.status-card:hover {
  border-color: var(--primary-color, #3b82f6);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.status-card.status-syncing {
  border-color: var(--info-color, #06b6d4);
  background: var(--info-light, #ecfeff);
}

.status-card.status-success {
  border-color: var(--success-color, #10b981);
  background: var(--success-light, #ecfdf5);
}

.status-card.status-error {
  border-color: var(--error-color, #ef4444);
  background: var(--error-light, #fef2f2);
}

.status-card.status-conflict,
.status-card.warning {
  border-color: var(--warning-color, #f59e0b);
  background: var(--warning-light, #fffbeb);
}

.status-card.network-online.network-excellent {
  border-color: var(--success-color, #10b981);
}

.status-card.network-online.network-good {
  border-color: var(--info-color, #06b6d4);
}

.status-card.network-online.network-poor {
  border-color: var(--warning-color, #f59e0b);
}

.status-card.network-online.network-weak,
.status-card.network-offline {
  border-color: var(--error-color, #ef4444);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.card-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
  opacity: 0.8;
}

.network-bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
}

.network-bar {
  width: 4px;
  background: var(--border-color, #e5e7eb);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.network-bar:nth-child(1) { height: 8px; }
.network-bar:nth-child(2) { height: 12px; }
.network-bar:nth-child(3) { height: 16px; }
.network-bar:nth-child(4) { height: 20px; }

.network-bar.active {
  background: currentColor;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color, #374151);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-text {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color, #1f2937);
}

.status-detail {
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
}

.network-latency {
  font-size: 12px;
  color: var(--text-secondary, #9ca3af);
}

.sync-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: var(--bg-secondary, #f3f4f6);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color, #3b82f6);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
}

/* セクション */
.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color, #1f2937);
}

.section-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
  opacity: 0.7;
}

/* 同期操作 */
.sync-operations {
  margin-bottom: 32px;
}

.operations-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.operation-item {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 16px;
  align-items: center;
  padding: 16px;
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.operation-item.operation-completed {
  border-color: var(--success-color, #10b981);
  background: var(--success-light, #ecfdf5);
}

.operation-item.operation-error {
  border-color: var(--error-color, #ef4444);
  background: var(--error-light, #fef2f2);
}

.operation-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.operation-type {
  display: flex;
  align-items: center;
  gap: 8px;
}

.operation-icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
  opacity: 0.7;
}

.operation-name {
  font-weight: 600;
  color: var(--text-color, #374151);
}

.operation-details {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
}

.operation-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.progress-percentage {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
  white-space: nowrap;
}

.operation-error {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--error-color, #ef4444);
  font-size: 12px;
}

.error-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.operation-timing {
  font-size: 12px;
  color: var(--text-secondary, #9ca3af);
  text-align: right;
  white-space: nowrap;
}

/* 競合解決 */
.conflicts-section {
  margin-bottom: 32px;
}

.conflicts-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.conflict-item {
  background: var(--card-bg, #ffffff);
  border: 2px solid var(--warning-color, #f59e0b);
  border-radius: 12px;
  padding: 20px;
}

.conflict-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
}

.conflict-title {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color, #1f2937);
}

.conflict-detail {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
}

.conflict-timestamp {
  font-size: 12px;
  color: var(--text-secondary, #9ca3af);
  white-space: nowrap;
}

.conflict-comparison {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.data-version {
  background: var(--bg-secondary, #f9fafb);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  padding: 16px;
}

.data-version.local {
  border-color: var(--info-color, #06b6d4);
}

.data-version.remote {
  border-color: var(--primary-color, #3b82f6);
}

.version-title {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color, #374151);
}

.data-preview {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.4;
  color: var(--text-secondary, #6b7280);
  background: var(--code-bg, #f3f4f6);
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.vs-divider {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vs-text {
  background: var(--warning-color, #f59e0b);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.conflict-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.resolve-button {
  padding: 10px 20px;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.resolve-button.local {
  background: var(--info-color, #06b6d4);
  color: white;
}

.resolve-button.local:hover {
  background: var(--info-dark, #0891b2);
}

.resolve-button.remote {
  background: var(--primary-color, #3b82f6);
  color: white;
}

.resolve-button.remote:hover {
  background: var(--primary-dark, #2563eb);
}

.resolve-button.merge {
  background: var(--success-color, #10b981);
  color: white;
}

.resolve-button.merge:hover {
  background: var(--success-dark, #059669);
}

/* 統計情報 */
.sync-stats {
  margin-bottom: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-item {
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
  margin-bottom: 4px;
  font-weight: 500;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-color, #1f2937);
}

/* 設定 */
.sync-settings {
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  padding: 24px;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.setting-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color, #374151);
}

.setting-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* トグルスイッチ */
.toggle-input {
  display: none;
}

.toggle-label {
  display: block;
  width: 48px;
  height: 24px;
  background: var(--border-color, #e5e7eb);
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.toggle-input:checked + .toggle-label {
  background: var(--success-color, #10b981);
}

.toggle-slider {
  display: block;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-input:checked + .toggle-label .toggle-slider {
  transform: translateX(24px);
}

.interval-select {
  padding: 8px 12px;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 6px;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #374151);
  font-size: 14px;
  cursor: pointer;
}

.clear-button {
  padding: 8px 16px;
  background: var(--error-color, #ef4444);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-button:hover {
  background: var(--error-dark, #dc2626);
}

/* アニメーション */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* レスポンシブ対応 */
@media (max-width: 1024px) {
  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .overview-cards {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
  }
  
  .conflict-comparison {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .vs-divider {
    order: 2;
  }
  
  .data-version.remote {
    order: 3;
  }
}

@media (max-width: 768px) {
  .sync-status-dashboard {
    padding: 16px;
  }
  
  .dashboard-title {
    font-size: 24px;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .operation-item {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .conflict-actions {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .header-actions {
    flex-direction: column;
  }
  
  .action-button {
    justify-content: center;
  }
}

/* ダークモード対応 */
@media (prefers-color-scheme: dark) {
  .sync-status-dashboard {
    --bg-color: #1f2937;
    --card-bg: #374151;
    --text-color: #f9fafb;
    --text-secondary: #d1d5db;
    --border-color: #4b5563;
    --bg-secondary: #4b5563;
    --code-bg: #374151;
    --primary-light: #1e3a8a;
    --success-light: #064e3b;
    --error-light: #7f1d1d;
    --warning-light: #78350f;
    --info-light: #164e63;
  }
}

/* 高コントラスト対応 */
@media (prefers-contrast: high) {
  .status-card,
  .operation-item,
  .conflict-item,
  .stat-item,
  .sync-settings {
    border-width: 2px;
  }
  
  .action-button,
  .resolve-button {
    border-width: 2px;
  }
}

/* アニメーション削減対応 */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>