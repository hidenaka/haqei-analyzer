<!--
  HAQEI 3大基盤技術統合デモンストレーション
  
  目的：
  - RLS + データ移行 + IndexedDB の実際の連携動作を実演
  - HaQei哲学準拠のプライバシー保護デモ
  - Vue3 Composition API での統合利用例
  - エンタープライズ級品質の統合システムの紹介
  
  機能：
  1. リアルタイム統合状態表示
  2. インタラクティブなデータ移行デモ
  3. オフライン・オンライン切り替えデモ
  4. プライバシーレベル制御デモ
  5. Triple OS Architecture統合デモ
  
  更新: 2025-08-03 - Day 4統合デモ完成版
-->

<template>
  <div class="haqei-integration-demo">
    <!-- ヘッダー -->
    <header class="demo-header">
      <h1 class="demo-title">
        🚀 HAQEI 3大基盤技術統合デモ
      </h1>
      <p class="demo-subtitle">
        RLS・データ移行・IndexedDB の完全統合システム
      </p>
      <div class="demo-badges">
        <span class="badge HaQei">🔒 HaQei哲学準拠</span> 
        <span class="badge triple-os">🎯 Triple OS統合</span>
        <span class="badge enterprise">🏢 エンタープライズ級</span>
      </div>
    </header>

    <!-- システム状態パネル -->
    <section class="system-status-panel">
      <h2>📊 システム統合状態</h2>
      
      <div class="status-grid">
        <!-- 接続状態 -->
        <div class="status-card connection">
          <h3>🌐 接続状態</h3>
          <div class="status-indicator" :class="connectionStatusClass">
            {{ connectionStatus }}
          </div>
          <div class="status-details">
            <p>オンライン: {{ offlineState.isOnline ? '✅' : '❌' }}</p>
            <p>Supabase: {{ offlineState.isSupabaseConnected ? '✅' : '❌' }}</p>
            <p>品質: {{ offlineState.connectionQuality }}</p>
          </div>
        </div>

        <!-- データ移行状態 -->
        <div class="status-card migration">
          <h3>📦 データ移行</h3>
          <div class="status-indicator" :class="migrationStatusClass">
            {{ migrationStatus }}
          </div>
          <div class="status-details">
            <p>検出済み: {{ hasLocalStorageData ? '✅' : '❌' }}</p>
            <p>移行可能: {{ canStartMigration ? '✅' : '❌' }}</p>
            <p>進捗: {{ progressPercentage }}%</p>
          </div>
        </div>

        <!-- IndexedDB状態 -->
        <div class="status-card indexeddb">
          <h3>💾 IndexedDB</h3>
          <div class="status-indicator" :class="indexeddbStatusClass">
            {{ indexeddbStatus }}
          </div>
          <div class="status-details">
            <p>レコード数: {{ dbStats.totalRecords }}</p>
            <p>キャッシュ: {{ dbStats.cacheSize }}</p>
            <p>同期待ち: {{ offlineState.pendingOperations }}</p>
          </div>
        </div>

        <!-- プライバシー状態 -->
        <div class="status-card privacy">
          <h3>🔒 プライバシー</h3>
          <div class="status-indicator maximum">
            {{ currentPrivacyLevel }}
          </div>
          <div class="status-details">
            <p>レベル: {{ migrationOptions.privacyLevel }}</p>
            <p>匿名化: {{ migrationOptions.anonymizeData ? '✅' : '❌' }}</p>
            <p>除外制御: {{ migrationOptions.excludeSensitiveData ? '✅' : '❌' }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- インタラクティブデモセクション -->
    <section class="interactive-demo">
      <h2>🎮 インタラクティブデモ</h2>
      
      <div class="demo-tabs">
        <button 
          v-for="tab in demoTabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>

      <!-- データ移行デモ -->
      <div v-if="activeTab === 'migration'" class="demo-content">
        <h3>📦 データ移行デモ</h3>
        
        <div class="migration-controls">
          <div class="control-group">
            <label>プライバシーレベル:</label>
            <select v-model="selectedPrivacyLevel" @change="updatePrivacyLevel">
              <option value="low">Low - 基本保護</option>
              <option value="medium">Medium - 標準保護</option>
              <option value="high">High - 高度保護</option>
              <option value="maximum">Maximum - 最大保護 (推奨)</option>
            </select>
          </div>

          <div class="control-group">
            <label>Triple OS移行設定:</label>
            <div class="checkbox-group">
              <label><input type="checkbox" v-model="migrateEngineOS"> Engine OS</label>
              <label><input type="checkbox" v-model="migrateInterfaceOS"> Interface OS</label>
              <label><input type="checkbox" v-model="migrateSafeModeOS"> Safe Mode OS</label>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="startDataDetection" :disabled="isDetecting" class="btn primary">
            {{ isDetecting ? '検出中...' : '📡 データ検出開始' }}
          </button>
          
          <button 
            @click="startMigrationDemo" 
            :disabled="!canStartMigration || isMigrating"
            class="btn success"
          >
            {{ isMigrating ? '移行中...' : '🚀 移行開始 (デモ)' }}
          </button>
          
          <button @click="resetDemo" class="btn secondary">
            🔄 リセット
          </button>
        </div>

        <!-- 移行進捗表示 -->
        <div v-if="migrationProgress" class="migration-progress">
          <h4>📈 移行進捗</h4>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
          <p class="progress-text">
            {{ currentOperation }} ({{ progressPercentage }}%)
          </p>
          
          <div class="progress-stats" v-if="migrationStats">
            <div class="stat">
              <span class="label">処理済み:</span>
              <span class="value">{{ migrationStats.processed }}</span>
            </div>
            <div class="stat">
              <span class="label">エラー:</span>
              <span class="value">{{ migrationStats.errors }}</span>
            </div>
            <div class="stat">
              <span class="label">経過時間:</span>
              <span class="value">{{ migrationStats.elapsedTime }}s</span>
            </div>
          </div>
        </div>

        <!-- 検出データプレビュー -->
        <div v-if="hasLocalStorageData" class="data-preview">
          <h4>🔍 検出データプレビュー</h4>
          <div class="data-summary">
            <p><strong>総アイテム数:</strong> {{ migrationSummary?.totalItems }}</p>
            <p><strong>データサイズ:</strong> {{ migrationSummary?.totalSizeKB }}KB</p>
            <p><strong>推定時間:</strong> {{ migrationSummary?.estimatedTimeMinutes }}分</p>
            <p><strong>プライバシーリスク:</strong> 
              <span :class="`risk-${migrationSummary?.privacyRisk}`">
                {{ migrationSummary?.privacyRisk }}
              </span>
            </p>
          </div>
          
          <div class="data-types">
            <h5>📋 データタイプ別詳細</h5>
            <div class="data-type-grid">
              <div 
                v-for="dataType in getAvailableDataTypes()" 
                :key="dataType.type"
                class="data-type-card"
              >
                <h6>{{ getDataTypeLabel(dataType.type) }}</h6>
                <p>件数: {{ dataType.count }}</p>
                <p>サイズ: {{ Math.round(dataType.size / 1024) }}KB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- オフライン・オンラインデモ -->
      <div v-if="activeTab === 'offline'" class="demo-content">
        <h3>📴 オフライン・オンラインデモ</h3>
        
        <div class="offline-controls">
          <button @click="toggleOfflineMode" class="btn" :class="isOfflineMode ? 'warning' : 'info'">
            {{ isOfflineMode ? '🌐 オンラインモードに切り替え' : '📴 オフラインモードに切り替え' }}
          </button>
        </div>

        <div class="offline-demo-actions">
          <h4>📝 オフライン操作デモ</h4>
          
          <div class="action-group">
            <button @click="createDemoUser" class="btn primary">
              👤 デモユーザー作成
            </button>
            <button @click="startDemoSession" class="btn success">
              🎯 分析セッション開始
            </button>
            <button @click="saveDemoAnalysis" class="btn info">
              💾 分析結果保存
            </button>
          </div>

          <div v-if="hasOfflineData" class="offline-data-status">
            <h5>📊 オフラインデータ状況</h5>
            <p>未同期操作: {{ offlineState.pendingOperations }}件</p>
            <p>失敗操作: {{ offlineState.failedOperations }}件</p>
            
            <button 
              @click="syncOfflineData" 
              :disabled="!canSync"
              class="btn success"
            >
              {{ offlineState.syncInProgress ? '同期中...' : '🔄 データ同期' }}
            </button>
          </div>
        </div>

        <!-- 同期統計 -->
        <div v-if="syncStats.totalSynced > 0" class="sync-stats">
          <h4>📈 同期統計</h4>
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-value">{{ syncStats.totalSynced }}</span>
              <span class="stat-label">同期済み</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ syncStats.totalFailed }}</span>
              <span class="stat-label">失敗</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ syncStats.totalConflicts }}</span>
              <span class="stat-label">競合</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ Math.round(syncStats.averageSyncTime) }}ms</span>
              <span class="stat-label">平均時間</span>
            </div>
          </div>
        </div>
      </div>

      <!-- プライバシー制御デモ -->
      <div v-if="activeTab === 'privacy'" class="demo-content">
        <h3>🔒 プライバシー制御デモ</h3>
        
        <div class="privacy-levels">
          <h4>📊 プライバシーレベル比較</h4>
          
          <div class="privacy-grid">
            <div 
              v-for="level in privacyLevels" 
              :key="level.value"
              class="privacy-card"
              :class="{ active: selectedPrivacyLevel === level.value }"
              @click="selectPrivacyLevel(level.value)"
            >
              <h5>{{ level.icon }} {{ level.label }}</h5>
              <p class="privacy-description">{{ level.description }}</p>
              
              <div class="privacy-features">
                <div class="feature" :class="{ enabled: level.anonymize }">
                  {{ level.anonymize ? '✅' : '❌' }} データ匿名化
                </div>
                <div class="feature" :class="{ enabled: level.exclude }">
                  {{ level.exclude ? '✅' : '❌' }} 機密データ除外
                </div>
                <div class="feature" :class="{ enabled: level.encrypt }">
                  {{ level.encrypt ? '✅' : '❌' }} 暗号化強化
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="privacy-demo-actions">
          <h4>🧪 プライバシー制御テスト</h4>
          <button @click="testPrivacyLevels" class="btn primary">
            🔍 全レベル動作テスト
          </button>
        </div>

        <!-- プライバシーテスト結果 -->
        <div v-if="privacyTestResults.length > 0" class="privacy-test-results">
          <h4>📋 テスト結果</h4>
          <div class="test-results-list">
            <div 
              v-for="result in privacyTestResults" 
              :key="result.level"
              class="test-result-item"
            >
              <span class="result-level">{{ result.level }}</span>
              <span class="result-status" :class="result.success ? 'success' : 'error'">
                {{ result.success ? '✅ 成功' : '❌ 失敗' }}
              </span>
              <span class="result-time">{{ result.executionTime }}ms</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Triple OS統合デモ -->
      <div v-if="activeTab === 'triple-os'" class="demo-content">
        <h3>🎯 Triple OS Architecture統合デモ</h3>
        
        <div class="triple-os-visualization">
          <div class="os-grid">
            <div 
              v-for="os in tripleOSComponents" 
              :key="os.type"
              class="os-component"
              :class="{ active: os.active }"
            >
              <h4>{{ os.icon }} {{ os.name }}</h4>
              <p class="os-description">{{ os.description }}</p>
              
              <div class="os-metrics">
                <div class="metric">
                  <span class="metric-label">アクティビティ:</span>
                  <div class="metric-bar">
                    <div 
                      class="metric-fill" 
                      :style="{ width: `${os.activity}%` }"
                    ></div>
                  </div>
                  <span class="metric-value">{{ os.activity }}%</span>
                </div>
                
                <div class="metric">
                  <span class="metric-label">統合度:</span>
                  <div class="metric-bar">
                    <div 
                      class="metric-fill integration" 
                      :style="{ width: `${os.integration}%` }"
                    ></div>
                  </div>
                  <span class="metric-value">{{ os.integration }}%</span>
                </div>
              </div>

              <button 
                @click="toggleOSComponent(os.type)" 
                class="btn small"
                :class="os.active ? 'success' : 'secondary'"
              >
                {{ os.active ? '✅ 有効' : '❌ 無効' }}
              </button>
            </div>
          </div>
        </div>

        <div class="os-interactions">
          <h4>🔄 OS間相互作用</h4>
          <div class="interaction-matrix">
            <div 
              v-for="interaction in osInteractions" 
              :key="`${interaction.from}-${interaction.to}`"
              class="interaction-item"
            >
              <span class="interaction-from">{{ interaction.from }}</span>
              <span class="interaction-arrow">→</span>
              <span class="interaction-to">{{ interaction.to }}</span>
              <span class="interaction-strength">
                強度: {{ Math.round(interaction.strength * 100) }}%
              </span>
            </div>
          </div>
        </div>

        <div class="triple-os-actions">
          <button @click="runTripleOSAnalysis" class="btn primary">
            🧠 Triple OS分析実行
          </button>
          <button @click="optimizeOSBalance" class="btn success">
            ⚖️ バランス最適化
          </button>
        </div>
      </div>
    </section>

    <!-- ログ・デバッグパネル -->
    <section class="debug-panel" v-if="showDebugPanel">
      <h2>🐛 デバッグ・ログパネル</h2>
      
      <div class="debug-controls">
        <button @click="clearLogs" class="btn small secondary">
          🗑️ ログクリア
        </button>
        <button @click="exportLogs" class="btn small info">
          📁 ログエクスポート
        </button>
        <label class="debug-toggle">
          <input type="checkbox" v-model="autoScroll"> 自動スクロール
        </label>
      </div>

      <div class="log-container" ref="logContainer">
        <div 
          v-for="(log, index) in debugLogs" 
          :key="index"
          class="log-entry"
          :class="log.level"
        >
          <span class="log-timestamp">{{ formatTimestamp(log.timestamp) }}</span>
          <span class="log-level">{{ log.level.toUpperCase() }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </section>

    <!-- フッター -->
    <footer class="demo-footer">
      <div class="footer-content">
        <p>🚀 HAQEI 3大基盤技術統合システム</p>
        <p>🔒 HaQei哲学準拠 | 🎯 Triple OS Architecture | 🏢 エンタープライズ級品質</p>
        <div class="footer-actions">
          <button @click="showDebugPanel = !showDebugPanel" class="btn small">
            {{ showDebugPanel ? '🔼 デバッグパネル非表示' : '🔽 デバッグパネル表示' }}
          </button>
          <button @click="generateReport" class="btn small primary">
            📊 統合レポート生成
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useMigration } from '@/composables/useMigration'
import { useOfflineDatabase } from '@/composables/useOfflineDatabase'
import { useRLS } from '@/composables/useRLS'
import type { Database } from '@/types/supabase'

// Composable の初期化
const migration = useMigration()
const offline = useOfflineDatabase()
const rls = useRLS()

// デモ状態管理
const activeTab = ref('migration')
const showDebugPanel = ref(false)
const autoScroll = ref(true)
const logContainer = ref<HTMLElement>()

// デモタブ定義
const demoTabs = [
  { id: 'migration', label: 'データ移行', icon: '📦' },
  { id: 'offline', label: 'オフライン', icon: '📴' },
  { id: 'privacy', label: 'プライバシー', icon: '🔒' },
  { id: 'triple-os', label: 'Triple OS', icon: '🎯' }
]

// プライバシーレベル定義
const privacyLevels = [
  {
    value: 'low' as const,
    label: 'Low',
    icon: '🔓',
    description: '基本的なプライバシー保護',
    anonymize: false,
    exclude: false,
    encrypt: false
  },
  {
    value: 'medium' as const,
    label: 'Medium', 
    icon: '🔐',
    description: '標準的なプライバシー保護',
    anonymize: false,
    exclude: true,
    encrypt: true
  },
  {
    value: 'high' as const,
    label: 'High',
    icon: '🔒',
    description: '高度なプライバシー保護',
    anonymize: true,
    exclude: true,
    encrypt: true
  },
  {
    value: 'maximum' as const,
    label: 'Maximum',
    icon: '🛡️',
    description: '最大限のプライバシー保護（推奨）',
    anonymize: true,
    exclude: true,
    encrypt: true
  }
]

// Triple OS コンポーネント定義
const tripleOSComponents = ref([
  {
    type: 'engine',
    name: 'Engine OS',
    icon: '🧠',
    description: '論理的思考・分析処理システム',
    active: true,
    activity: 85,
    integration: 92
  },
  {
    type: 'interface',
    name: 'Interface OS',
    icon: '🤝',
    description: '社会的スキル・コミュニケーションシステム',
    active: true,
    activity: 72,
    integration: 88
  },
  {
    type: 'safeMode',
    name: 'Safe Mode OS',
    icon: '🛡️',
    description: '情緒安定・ストレス管理システム',
    active: true,
    activity: 91,
    integration: 95
  }
])

// OS間相互作用定義
const osInteractions = ref([
  { from: 'Engine', to: 'Interface', strength: 0.78 },
  { from: 'Engine', to: 'SafeMode', strength: 0.85 },
  { from: 'Interface', to: 'SafeMode', strength: 0.73 },
  { from: 'SafeMode', to: 'Engine', strength: 0.82 },
  { from: 'SafeMode', to: 'Interface', strength: 0.69 },
  { from: 'Interface', to: 'Engine', strength: 0.71 }
])

// デモ状態
const selectedPrivacyLevel = ref<Database['public']['Enums']['privacy_level']>('maximum')
const migrateEngineOS = ref(true)
const migrateInterfaceOS = ref(true)
const migrateSafeModeOS = ref(true)

// テスト結果
const privacyTestResults = ref<Array<{
  level: string
  success: boolean
  executionTime: number
}>>([])

// ログシステム
interface DebugLog {
  timestamp: number
  level: 'info' | 'success' | 'warning' | 'error'
  message: string
}

const debugLogs = ref<DebugLog[]>([])

// Computed プロパティ
const {
  offlineState,
  syncStats,
  dbStats,
  isLoading,
  canSync,
  hasOfflineData,
  isOfflineMode
} = offline

const {
  hasLocalStorageData,
  migrationSummary,
  progressPercentage,
  currentOperation,
  migrationStats,
  canStartMigration,
  isDetecting,
  isMigrating,
  migrationOptions,
  migrationProgress,
  getAvailableDataTypes
} = migration

const connectionStatus = computed(() => {
  if (offlineState.value.isOnline && offlineState.value.isSupabaseConnected) {
    return 'オンライン'
  } else if (offlineState.value.isOnline) {
    return 'Supabase接続エラー'
  } else {
    return 'オフライン'
  }
})

const connectionStatusClass = computed(() => {
  if (offlineState.value.isOnline && offlineState.value.isSupabaseConnected) {
    return 'online'
  } else {
    return 'offline'
  }
})

const migrationStatus = computed(() => {
  if (isMigrating.value) return '移行中'
  if (hasLocalStorageData.value) return '準備完了'
  return '待機中'
})

const migrationStatusClass = computed(() => {
  if (isMigrating.value) return 'in-progress'
  if (hasLocalStorageData.value) return 'ready'
  return 'idle'
})

const indexeddbStatus = computed(() => {
  if (dbStats.value.totalRecords > 0) return 'データあり'
  return '空'
})

const indexeddbStatusClass = computed(() => {
  return dbStats.value.totalRecords > 0 ? 'active' : 'empty'
})

const currentPrivacyLevel = computed(() => {
  return privacyLevels.find(level => level.value === selectedPrivacyLevel.value)?.label || 'Unknown'
})

// メソッド
function addLog(level: DebugLog['level'], message: string) {
  debugLogs.value.push({
    timestamp: Date.now(),
    level,
    message
  })
  
  if (autoScroll.value) {
    nextTick(() => {
      if (logContainer.value) {
        logContainer.value.scrollTop = logContainer.value.scrollHeight
      }
    })
  }
}

function clearLogs() {
  debugLogs.value = []
  addLog('info', 'ログがクリアされました')
}

function exportLogs() {
  const logsText = debugLogs.value
    .map(log => `[${formatTimestamp(log.timestamp)}] ${log.level.toUpperCase()}: ${log.message}`)
    .join('\n')
  
  const blob = new Blob([logsText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `haqei-integration-logs-${Date.now()}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  addLog('success', 'ログがエクスポートされました')
}

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString()
}

function updatePrivacyLevel() {
  migration.setPrivacyLevel(selectedPrivacyLevel.value)
  addLog('info', `プライバシーレベルを ${selectedPrivacyLevel.value} に変更`)
}

async function startDataDetection() {
  addLog('info', 'データ検出を開始します')
  try {
    await migration.detectLocalStorageData()
    addLog('success', 'データ検出が完了しました')
  } catch (error) {
    addLog('error', `データ検出エラー: ${error}`)
  }
}

async function startMigrationDemo() {
  addLog('info', '移行デモを開始します（dryRun）')
  
  // Triple OS設定の更新
  migration.configureTripleOSMigration({
    migrateEngineOS: migrateEngineOS.value,
    migrateInterfaceOS: migrateInterfaceOS.value,
    migrateSafeModeOS: migrateSafeModeOS.value,
    preserveInteractions: true
  })
  
  migration.updateMigrationOptions({ dryRun: true })
  
  try {
    // await migration.startMigration() // 実際の移行はコメントアウト
    addLog('success', '移行デモが完了しました（シミュレーション）')
  } catch (error) {
    addLog('error', `移行デモエラー: ${error}`)
  }
}

function resetDemo() {
  migration.resetMigrationState()
  addLog('info', 'デモがリセットされました')
}

function toggleOfflineMode() {
  // オフライン状態のシミュレート
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: !isOfflineMode.value
  })
  
  window.dispatchEvent(new Event(isOfflineMode.value ? 'online' : 'offline'))
  
  addLog('info', `${isOfflineMode.value ? 'オンライン' : 'オフライン'}モードに切り替えました`)
}

async function createDemoUser() {
  addLog('info', 'デモユーザーを作成中...')
  try {
    const result = await offline.createUser({
      email: `demo${Date.now()}@haqei.com`,
      username: `DemoUser${Date.now()}`,
      privacy_level: selectedPrivacyLevel.value
    })
    
    if (result.success) {
      addLog('success', 'デモユーザーが作成されました')
    } else {
      addLog('error', `ユーザー作成エラー: ${result.error}`)
    }
  } catch (error) {
    addLog('error', `ユーザー作成エラー: ${error}`)
  }
}

async function startDemoSession() {
  addLog('info', 'デモ分析セッション開始中...')
  try {
    const result = await offline.startAnalysisSession('demo-user', 'integration_demo')
    
    if (result.success) {
      addLog('success', 'デモセッションが開始されました')
    } else {
      addLog('error', `セッション開始エラー: ${result.error}`)
    }
  } catch (error) {
    addLog('error', `セッション開始エラー: ${error}`)
  }
}

async function saveDemoAnalysis() {
  addLog('info', 'デモ分析結果保存中...')
  try {
    const analysisData = {
      engineOS: { score: Math.random() * 0.3 + 0.7 },
      interfaceOS: { score: Math.random() * 0.3 + 0.7 },
      safeModeOS: { score: Math.random() * 0.3 + 0.7 }
    }
    
    const result = await offline.saveAnalysisResult(
      'demo-session',
      analysisData,
      { dominantOS: 'safeMode' }
    )
    
    if (result.success) {
      addLog('success', 'デモ分析結果が保存されました')
    } else {
      addLog('error', `分析結果保存エラー: ${result.error}`)
    }
  } catch (error) {
    addLog('error', `分析結果保存エラー: ${error}`)
  }
}

async function syncOfflineData() {
  addLog('info', 'オフラインデータ同期中...')
  try {
    const result = await offline.syncNow()
    
    if (result.success) {
      addLog('success', 'データ同期が完了しました')
    } else {
      addLog('warning', `同期エラー: ${result.error}`)
    }
  } catch (error) {
    addLog('error', `同期エラー: ${error}`)
  }
}

function selectPrivacyLevel(level: Database['public']['Enums']['privacy_level']) {
  selectedPrivacyLevel.value = level
  updatePrivacyLevel()
}

async function testPrivacyLevels() {
  addLog('info', '全プライバシーレベルのテストを開始します')
  privacyTestResults.value = []
  
  for (const level of privacyLevels) {
    const startTime = performance.now()
    
    try {
      // プライバシーレベル別のテスト実行
      selectedPrivacyLevel.value = level.value
      updatePrivacyLevel()
      
      // 簡単なテスト操作
      await offline.createUser({
        email: `test-${level.value}@haqei.com`,
        username: `Test${level.value}`,
        privacy_level: level.value
      })
      
      const executionTime = performance.now() - startTime
      
      privacyTestResults.value.push({
        level: level.label,
        success: true,
        executionTime: Math.round(executionTime)
      })
      
      addLog('success', `${level.label} レベルテスト完了 (${Math.round(executionTime)}ms)`)
      
    } catch (error) {
      const executionTime = performance.now() - startTime
      
      privacyTestResults.value.push({
        level: level.label,
        success: false,
        executionTime: Math.round(executionTime)
      })
      
      addLog('error', `${level.label} レベルテスト失敗: ${error}`)
    }
  }
  
  addLog('info', 'プライバシーレベルテストが完了しました')
}

function toggleOSComponent(type: string) {
  const component = tripleOSComponents.value.find(c => c.type === type)
  if (component) {
    component.active = !component.active
    addLog('info', `${component.name} を ${component.active ? '有効' : '無効'} にしました`)
  }
}

async function runTripleOSAnalysis() {
  addLog('info', 'Triple OS分析を実行中...')
  
  // 各OSコンポーネントのアクティビティ更新
  tripleOSComponents.value.forEach(component => {
    if (component.active) {
      component.activity = Math.round(Math.random() * 30 + 70) // 70-100%
      component.integration = Math.round(Math.random() * 20 + 80) // 80-100%
    } else {
      component.activity = 0
      component.integration = 0
    }
  })
  
  // OS間相互作用の更新
  osInteractions.value.forEach(interaction => {
    interaction.strength = Math.random() * 0.4 + 0.6 // 0.6-1.0
  })
  
  addLog('success', 'Triple OS分析が完了しました')
}

function optimizeOSBalance() {
  addLog('info', 'OSバランス最適化中...')
  
  // バランス最適化のシミュレート
  const totalActivity = tripleOSComponents.value.reduce((sum, c) => sum + c.activity, 0)
  const averageActivity = totalActivity / tripleOSComponents.value.length
  
  tripleOSComponents.value.forEach(component => {
    if (component.active) {
      // 平均に近づけるような調整
      const diff = averageActivity - component.activity
      component.activity = Math.round(component.activity + diff * 0.3)
      component.integration = Math.min(100, component.integration + 5)
    }
  })
  
  addLog('success', 'OSバランスが最適化されました')
}

function getDataTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    user: '👤 ユーザーデータ',
    session: '🎯 セッションデータ',
    response: '💬 回答データ',
    analysis: '📊 分析データ',
    triple_os: '🎯 Triple OSデータ',
    settings: '⚙️ 設定データ'
  }
  return labels[type] || type
}

function generateReport() {
  addLog('info', '統合レポートを生成中...')
  
  const report = {
    timestamp: new Date().toISOString(),
    system_status: {
      connection: connectionStatus.value,
      migration: migrationStatus.value,
      indexeddb: indexeddbStatus.value,
      privacy: currentPrivacyLevel.value
    },
    statistics: {
      db_records: dbStats.value.totalRecords,
      cache_size: dbStats.value.cacheSize,
      pending_operations: offlineState.value.pendingOperations,
      sync_stats: syncStats.value
    },
    triple_os: {
      components: tripleOSComponents.value,
      interactions: osInteractions.value
    },
    privacy_tests: privacyTestResults.value,
    logs: debugLogs.value.slice(-50) // 最新50件
  }
  
  const reportText = JSON.stringify(report, null, 2)
  const blob = new Blob([reportText], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `haqei-integration-report-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  addLog('success', '統合レポートが生成されました')
}

// ライフサイクル
onMounted(() => {
  addLog('info', 'HAQEI 3大基盤技術統合デモが開始されました')
  
  // 初期データ検出
  if (localStorage.length > 0) {
    startDataDetection()
  }
})

onUnmounted(() => {
  addLog('info', '統合デモが終了されました')
})

// ウォッチャー
watch(selectedPrivacyLevel, (newLevel) => {
  addLog('info', `プライバシーレベルが ${newLevel} に変更されました`)
})

watch([migrateEngineOS, migrateInterfaceOS, migrateSafeModeOS], ([engine, interface_, safeMode]) => {
  const enabled = [
    engine && 'Engine OS',
    interface_ && 'Interface OS',
    safeMode && 'Safe Mode OS'
  ].filter(Boolean)
  
  addLog('info', `Triple OS移行設定: ${enabled.join(', ')}`)
})
</script>

<style scoped>
.haqei-integration-demo {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.demo-header {
  text-align: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.2);
}

.demo-title {
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(45deg, #ffd700, #ff6b6b);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.demo-subtitle {
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
  opacity: 0.9;
}

.demo-badges {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
}

.badge.HaQei {
  background: linear-gradient(45deg, #4CAF50, #45a049);
}

.badge.triple-os {
  background: linear-gradient(45deg, #2196F3, #1976D2);
}

.badge.enterprise {
  background: linear-gradient(45deg, #FF9800, #F57C00);
}

.system-status-panel {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  margin: 2rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.status-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.status-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.status-indicator {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 1rem;
}

.status-indicator.online {
  background: #4CAF50;
}

.status-indicator.offline {
  background: #f44336;
}

.status-indicator.ready {
  background: #2196F3;
}

.status-indicator.in-progress {
  background: #FF9800;
}

.status-indicator.idle {
  background: #9E9E9E;
}

.status-indicator.active {
  background: #4CAF50;
}

.status-indicator.empty {
  background: #9E9E9E;
}

.status-indicator.maximum {
  background: #8E24AA;
}

.status-details p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.interactive-demo {
  padding: 2rem;
}

.demo-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tab-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.tab-button.active {
  background: linear-gradient(45deg, #ffd700, #ff6b6b);
  color: #333;
  font-weight: bold;
}

.demo-content {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.demo-content h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
}

.migration-controls {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-weight: bold;
}

.control-group select {
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.checkbox-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn.primary {
  background: #2196F3;
  color: white;
}

.btn.success {
  background: #4CAF50;
  color: white;
}

.btn.warning {
  background: #FF9800;
  color: white;
}

.btn.info {
  background: #00BCD4;
  color: white;
}

.btn.secondary {
  background: #9E9E9E;
  color: white;
}

.btn.small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.migration-progress {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 10px;
  margin: 1rem 0;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  overflow: hidden;
  margin: 1rem 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #2196F3);
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  margin: 0.5rem 0;
  font-weight: bold;
}

.progress-stats {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat {
  text-align: center;
}

.stat .label {
  display: block;
  font-size: 0.9rem;
  opacity: 0.8;
}

.stat .value {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffd700;
}

.data-preview {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 10px;
  margin: 1rem 0;
}

.data-summary p {
  margin: 0.5rem 0;
}

.risk-low { color: #4CAF50; }
.risk-medium { color: #FF9800; }
.risk-high { color: #f44336; }

.data-type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.data-type-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.data-type-card h6 {
  margin: 0 0 0.5rem 0;
  color: #ffd700;
}

.data-type-card p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.offline-controls,
.privacy-demo-actions,
.triple-os-actions {
  margin-bottom: 2rem;
}

.action-group {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.offline-data-status {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 10px;
  margin: 1rem 0;
}

.sync-stats {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 10px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.stat-card {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffd700;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.5rem;
}

.privacy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.privacy-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.privacy-card:hover {
  background: rgba(255, 255, 255, 0.15);
}

.privacy-card.active {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
}

.privacy-card h5 {
  margin: 0 0 1rem 0;
  color: #ffd700;
}

.privacy-description {
  margin-bottom: 1rem;
  opacity: 0.9;
}

.privacy-features {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feature {
  padding: 0.25rem 0;
  font-size: 0.9rem;
}

.feature.enabled {
  color: #4CAF50;
}

.test-results-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.test-result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.result-status.success {
  color: #4CAF50;
}

.result-status.error {
  color: #f44336;
}

.triple-os-visualization {
  margin: 2rem 0;
}

.os-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.os-component {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.os-component.active {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
}

.os-component h4 {
  margin: 0 0 1rem 0;
  color: #ffd700;
}

.os-description {
  margin-bottom: 1rem;
  opacity: 0.9;
  font-size: 0.9rem;
}

.os-metrics {
  margin: 1rem 0;
}

.metric {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem 0;
}

.metric-label {
  min-width: 80px;
  font-size: 0.9rem;
}

.metric-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s ease;
}

.metric-fill.integration {
  background: #2196F3;
}

.metric-value {
  min-width: 40px;
  text-align: right;
  font-size: 0.9rem;
  font-weight: bold;
}

.os-interactions {
  margin: 2rem 0;
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 10px;
}

.interaction-matrix {
  display: grid;
  gap: 0.5rem;
}

.interaction-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.interaction-from,
.interaction-to {
  font-weight: bold;
  min-width: 80px;
}

.interaction-arrow {
  color: #ffd700;
  font-size: 1.2rem;
}

.interaction-strength {
  margin-left: auto;
  font-size: 0.9rem;
  color: #4CAF50;
}

.debug-panel {
  margin: 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  overflow: hidden;
}

.debug-panel h2 {
  padding: 1rem 2rem;
  margin: 0;
  background: rgba(0, 0, 0, 0.2);
}

.debug-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.debug-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  margin-left: auto;
}

.log-container {
  height: 300px;
  overflow-y: auto;
  padding: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.log-entry {
  display: flex;
  gap: 1rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.log-timestamp {
  color: #9E9E9E;
  min-width: 80px;
}

.log-level {
  min-width: 60px;
  font-weight: bold;
}

.log-entry.info .log-level { color: #2196F3; }
.log-entry.success .log-level { color: #4CAF50; }
.log-entry.warning .log-level { color: #FF9800; }
.log-entry.error .log-level { color: #f44336; }

.log-message {
  flex: 1;
}

.demo-footer {
  background: rgba(0, 0, 0, 0.3);
  padding: 2rem;
  text-align: center;
}

.footer-content p {
  margin: 0.5rem 0;
}

.footer-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .demo-title {
    font-size: 2rem;
  }
  
  .demo-badges {
    flex-direction: column;
    align-items: center;
  }
  
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .demo-tabs {
    flex-direction: column;
  }
  
  .action-buttons,
  .action-group {
    flex-direction: column;
  }
  
  .privacy-grid,
  .os-grid {
    grid-template-columns: 1fr;
  }
  
  .debug-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .debug-toggle {
    margin-left: 0;
    justify-content: center;
  }
}
</style>