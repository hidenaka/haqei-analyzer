<!--
  HAQEI Migration Dashboard Component
  
  目的：
  - データマイグレーション状況の可視化
  - リアルタイム進捗監視
  - ユーザーフレンドリーなマイグレーション操作
  - エラーハンドリングと復旧支援
  
  機能：
  - ローカルデータスキャン表示
  - マイグレーション進捗表示
  - バックアップ・復元操作
  - 接続状態監視
  
  更新: 2025-08-03 - TASK-038 Vue 3統合完了
-->

<template>
  <div class="migration-dashboard">
    <!-- ヘッダー -->
    <div class="dashboard-header">
      <h1 class="dashboard-title">
        <span class="icon">🚀</span>
        HAQEI Data Migration Dashboard
      </h1>
      <p class="dashboard-subtitle">
        ローカルストレージからSupabaseへの安全なデータ移行
      </p>
    </div>

    <!-- 接続状態表示 -->
    <HCard class="connection-status-card">
      <template #header>
        <h2 class="card-title">
          <span class="icon">🔗</span>
          接続状態
        </h2>
      </template>
      
      <div class="connection-status">
        <div class="status-item">
          <span class="status-label">インターネット:</span>
          <span :class="['status-badge', connectionState.isOnline ? 'online' : 'offline']">
            {{ connectionState.isOnline ? 'オンライン' : 'オフライン' }}
          </span>
        </div>
        
        <div class="status-item">
          <span class="status-label">Supabase:</span>
          <span :class="['status-badge', connectionState.isSupabaseConnected ? 'connected' : 'disconnected']">
            {{ connectionState.isSupabaseConnected ? '接続済み' : '未接続' }}
          </span>
        </div>
        
        <div class="status-item">
          <span class="status-label">品質:</span>
          <span :class="['status-badge', `quality-${connectionState.connectionQuality}`]">
            {{ formatConnectionQuality(connectionState.connectionQuality) }}
          </span>
        </div>
      </div>
      
      <HButton 
        v-if="!connectionState.isSupabaseConnected"
        @click="testConnection"
        :loading="testingConnection"
        variant="secondary"
        class="test-connection-btn"
      >
        接続をテスト
      </HButton>
    </HCard>

    <!-- ローカルデータスキャン -->
    <HCard class="local-data-card">
      <template #header>
        <h2 class="card-title">
          <span class="icon">🔍</span>
          ローカルデータスキャン
        </h2>
      </template>
      
      <div v-if="!localDataScan">
        <HButton @click="scanLocalData" :loading="scanning" variant="primary">
          ローカルデータをスキャン
        </HButton>
      </div>
      
      <div v-else class="scan-results">
        <div v-if="!localDataScan.hasLegacyData" class="no-data">
          <span class="icon">📭</span>
          <p>移行対象のデータが見つかりませんでした</p>
        </div>
        
        <div v-else class="data-summary">
          <div class="summary-stats">
            <div class="stat-item">
              <span class="stat-label">総アイテム数:</span>
              <span class="stat-value">{{ localDataScan.totalItems.toLocaleString() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">推定サイズ:</span>
              <span class="stat-value">{{ formatBytes(localDataScan.estimatedSize) }}</span>
            </div>
            <div v-if="localDataScan.lastModified" class="stat-item">
              <span class="stat-label">最終更新:</span>
              <span class="stat-value">{{ formatDate(localDataScan.lastModified) }}</span>
            </div>
          </div>
          
          <div class="data-breakdown">
            <h3>データ内訳</h3>
            <div class="breakdown-items">
              <div class="breakdown-item">
                <span class="item-icon">👤</span>
                <span class="item-label">ユーザー:</span>
                <span class="item-count">{{ localDataScan.dataTypes.users }}</span>
              </div>
              <div class="breakdown-item">
                <span class="item-icon">📊</span>
                <span class="item-label">セッション:</span>
                <span class="item-count">{{ localDataScan.dataTypes.sessions }}</span>
              </div>
              <div class="breakdown-item">
                <span class="item-icon">❓</span>
                <span class="item-label">応答:</span>
                <span class="item-count">{{ localDataScan.dataTypes.responses }}</span>
              </div>
              <div class="breakdown-item">
                <span class="item-icon">🎯</span>
                <span class="item-label">Triple OS:</span>
                <span class="item-count">{{ localDataScan.dataTypes.tripleOS }}</span>
              </div>
              <div class="breakdown-item">
                <span class="item-icon">⚙️</span>
                <span class="item-label">設定:</span>
                <span class="item-count">{{ localDataScan.dataTypes.settings }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="scan-actions">
          <HButton @click="scanLocalData" :loading="scanning" variant="secondary" size="small">
            再スキャン
          </HButton>
        </div>
      </div>
    </HCard>

    <!-- マイグレーション操作 -->
    <HCard v-if="localDataScan?.hasLegacyData" class="migration-actions-card">
      <template #header>
        <h2 class="card-title">
          <span class="icon">🔄</span>
          マイグレーション操作
        </h2>
      </template>
      
      <div class="migration-actions">
        <div class="action-group">
          <h3>バックアップ作成</h3>
          <p class="action-description">
            移行前にローカルデータの完全なバックアップを作成します
          </p>
          <HButton 
            @click="createBackup"
            :loading="creatingBackup"
            :disabled="!canMigrate"
            variant="secondary"
          >
            バックアップ作成
          </HButton>
        </div>
        
        <div class="action-group">
          <h3>完全移行</h3>
          <p class="action-description">
            ローカルデータをSupabaseに完全移行します（バックアップ自動作成）
          </p>
          <HButton 
            @click="startMigration"
            :loading="migrationStatus.isRunning"
            :disabled="!canMigrate"
            variant="primary"
          >
            移行開始
          </HButton>
        </div>
        
        <div v-if="migrationHistory.length > 0" class="action-group">
          <h3>バックアップから復元</h3>
          <p class="action-description">
            過去のバックアップからデータを復元します
          </p>
          <HSelect 
            v-model="selectedBackup"
            :options="backupOptions"
            placeholder="バックアップを選択"
          />
          <HButton 
            @click="restoreFromBackup"
            :loading="restoring"
            :disabled="!selectedBackup"
            variant="danger"
          >
            復元実行
          </HButton>
        </div>
      </div>
    </HCard>

    <!-- マイグレーション進捗 -->
    <HCard v-if="migrationStatus.isRunning" class="migration-progress-card">
      <template #header>
        <h2 class="card-title">
          <span class="icon">⏳</span>
          マイグレーション進捗
        </h2>
      </template>
      
      <div class="migration-progress">
        <HProgress 
          :value="migrationStatus.progress"
          :max="100"
          class="progress-bar"
        />
        
        <div class="progress-info">
          <div class="progress-stats">
            <span class="current-step">{{ formatStep(migrationStatus.currentStep) }}</span>
            <span class="progress-percentage">{{ migrationStatus.progress }}%</span>
          </div>
          
          <div class="progress-details">
            <span>ステップ {{ migrationStatus.completedSteps }} / {{ migrationStatus.totalSteps }}</span>
            <span v-if="migrationStatus.estimatedTimeRemaining">
              残り約 {{ migrationStatus.estimatedTimeRemaining }}秒
            </span>
          </div>
        </div>
        
        <div v-if="migrationStatus.hasError" class="migration-error">
          <span class="error-icon">⚠️</span>
          <span class="error-message">{{ migrationStatus.errorMessage }}</span>
        </div>
      </div>
    </HCard>

    <!-- マイグレーション履歴 -->
    <HCard v-if="migrationHistory.length > 0" class="migration-history-card">
      <template #header>
        <h2 class="card-title">
          <span class="icon">📋</span>
          マイグレーション履歴
        </h2>
      </template>
      
      <div class="migration-history">
        <div 
          v-for="(history, index) in migrationHistory.slice(0, 5)" 
          :key="index"
          class="history-item"
        >
          <div class="history-header">
            <span :class="['history-status', history.success ? 'success' : 'failed']">
              {{ history.success ? '✅ 成功' : '❌ 失敗' }}
            </span>
            <span class="history-duration">{{ Math.round(history.duration / 1000) }}秒</span>
          </div>
          
          <div class="history-details">
            <div class="migrated-counts">
              <span>👤{{ history.migratedItems.users }}</span>
              <span>📊{{ history.migratedItems.sessions }}</span>
              <span>❓{{ history.migratedItems.responses }}</span>
              <span>🎯{{ history.migratedItems.tripleOS }}</span>
            </div>
            
            <div v-if="history.errors.length > 0" class="history-errors">
              <span class="error-count">{{ history.errors.length }} エラー</span>
            </div>
          </div>
        </div>
      </div>
    </HCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useSupabaseMigration } from '@/services/supabaseMigration'
import { getConnectionState, testSupabaseConnection } from '@/services/supabase'
import HCard from '@/components/common/HCard.vue'
import HButton from '@/components/common/HButton.vue'
import HProgress from '@/components/common/HProgress.vue'
import HSelect from '@/components/common/HSelect.vue'

// Composables
const migration = useSupabaseMigration()

// リアクティブ状態
const testingConnection = ref(false)
const scanning = ref(false)
const creatingBackup = ref(false)
const restoring = ref(false)
const selectedBackup = ref('')

// Computed状態
const connectionState = computed(() => getConnectionState())
const localDataScan = computed(() => migration.localDataScan.value)
const migrationStatus = computed(() => migration.migrationStatus)
const migrationHistory = computed(() => migration.migrationHistory.value)
const canMigrate = computed(() => migration.canMigrate.value)
// const isOnline = computed(() => migration.isOnline.value)
// const migrationProgress = computed(() => migration.migrationProgress.value)

// バックアップ選択肢
const backupOptions = computed(() => {
  return migrationHistory.value
    .filter(h => h.backupPath)
    .map(h => ({
      value: h.backupPath!,
      label: `${formatDate(new Date(h.duration))} - ${h.success ? '成功' : '失敗'}`
    }))
})

// メソッド
async function testConnection() {
  testingConnection.value = true
  try {
    await testSupabaseConnection()
  } finally {
    testingConnection.value = false
  }
}

async function scanLocalData() {
  scanning.value = true
  try {
    await migration.scanLocalData()
  } finally {
    scanning.value = false
  }
}

async function createBackup() {
  creatingBackup.value = true
  try {
    await migration.createBackup()
  } finally {
    creatingBackup.value = false
  }
}

async function startMigration() {
  await migration.runCompleteMigration()
}

async function restoreFromBackup() {
  if (!selectedBackup.value) return
  
  restoring.value = true
  try {
    await migration.restoreFromBackup(selectedBackup.value)
  } finally {
    restoring.value = false
  }
}

// ユーティリティ関数
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatDate(date: Date): string {
  return format(date, 'yyyy/MM/dd HH:mm', { locale: ja })
}

function formatConnectionQuality(quality: string): string {
  const qualityMap: Record<string, string> = {
    excellent: '優秀',
    good: '良好',
    poor: '不安定',
    unavailable: '利用不可'
  }
  return qualityMap[quality] || quality
}

function formatStep(step: string): string {
  const stepMap: Record<string, string> = {
    detect: 'データ検出',
    backup: 'バックアップ作成',
    validate: 'データ検証',
    migrate_user: 'ユーザー移行',
    migrate_sessions: 'セッション移行',
    migrate_responses: '応答移行',
    migrate_triple_os: 'Triple OS移行',
    verify: '検証',
    cleanup: 'クリーンアップ',
    complete: '完了'
  }
  return stepMap[step] || step
}

// ライフサイクル
onMounted(() => {
  // 自動スキャン
  scanLocalData()
})
</script>

<style scoped>
.migration-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-header {
  text-align: center;
  padding: 2rem 0;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.dashboard-subtitle {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  font-size: 1.2em;
}

/* 接続状態 */
.connection-status {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-label {
  font-weight: 500;
  color: var(--color-text-secondary);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.online,
.status-badge.connected {
  background-color: var(--color-success-light);
  color: var(--color-success-dark);
}

.status-badge.offline,
.status-badge.disconnected {
  background-color: var(--color-error-light);
  color: var(--color-error-dark);
}

.status-badge.quality-excellent {
  background-color: var(--color-success-light);
  color: var(--color-success-dark);
}

.status-badge.quality-good {
  background-color: var(--color-info-light);
  color: var(--color-info-dark);
}

.status-badge.quality-poor {
  background-color: var(--color-warning-light);
  color: var(--color-warning-dark);
}

.status-badge.quality-unavailable {
  background-color: var(--color-error-light);
  color: var(--color-error-dark);
}

.test-connection-btn {
  margin-top: 1rem;
}

/* ローカルデータスキャン */
.scan-results {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-secondary);
}

.no-data .icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.data-summary {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: var(--color-background-secondary);
  border-radius: 0.5rem;
}

.stat-label {
  font-weight: 500;
  color: var(--color-text-secondary);
}

.stat-value {
  font-weight: 600;
  color: var(--color-primary);
}

.data-breakdown h3 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
}

.breakdown-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: var(--color-background-tertiary);
  border-radius: 0.375rem;
}

.item-icon {
  font-size: 1.2rem;
}

.item-label {
  font-weight: 500;
  color: var(--color-text-secondary);
  flex: 1;
}

.item-count {
  font-weight: 600;
  color: var(--color-primary);
}

.scan-actions {
  display: flex;
  justify-content: flex-end;
}

/* マイグレーション操作 */
.migration-actions {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.action-group {
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background-color: var(--color-background-secondary);
}

.action-group h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-text-primary);
}

.action-description {
  margin: 0 0 1rem 0;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

/* マイグレーション進捗 */
.migration-progress {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.progress-bar {
  height: 1rem;
}

.progress-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-step {
  font-weight: 600;
  color: var(--color-primary);
}

.progress-percentage {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-text-primary);
}

.progress-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.migration-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: var(--color-error-light);
  border-radius: 0.5rem;
  color: var(--color-error-dark);
}

.error-icon {
  font-size: 1.2rem;
}

/* マイグレーション履歴 */
.migration-history {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background-color: var(--color-background-secondary);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.history-status.success {
  color: var(--color-success);
}

.history-status.failed {
  color: var(--color-error);
}

.history-duration {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.history-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.migrated-counts {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.error-count {
  font-size: 0.875rem;
  color: var(--color-error);
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .migration-dashboard {
    padding: 1rem;
    gap: 1.5rem;
  }
  
  .dashboard-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .summary-stats {
    grid-template-columns: 1fr;
  }
  
  .breakdown-items {
    grid-template-columns: 1fr;
  }
  
  .progress-stats,
  .progress-details,
  .history-header,
  .history-details {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}
</style>