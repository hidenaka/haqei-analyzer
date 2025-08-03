<!--
  HAQEI Data Migration Dialog Component
  
  目的:
  - localStorageからSupabaseへのデータ移行UI
  - bunenjin哲学準拠のプライバシー制御UI
  - Triple OS Architecture移行設定
  - リアクティブな進捗表示とエラーハンドリング
  
  実装: 2025-08-03 - TASK-038完了版
-->

<template>
  <div v-if="showDialog" class="migration-dialog-overlay" @click.self="closeDialog">
    <div class="migration-dialog">
      <!-- ヘッダー -->
      <div class="dialog-header">
        <h2 class="dialog-title">
          <i class="fas fa-database"></i>
          データ移行 - localStorage → Supabase
        </h2>
        <button 
          class="close-button" 
          @click="closeDialog"
          :disabled="isMigrating"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- フェーズインジケーター -->
      <div class="phase-indicator">
        <div 
          v-for="(phase, index) in phases" 
          :key="phase.key"
          class="phase-step"
          :class="{
            'active': uiState.currentPhase === phase.key,
            'completed': isPhaseCompleted(phase.key),
            'error': uiState.hasErrors && uiState.currentPhase === phase.key
          }"
        >
          <div class="phase-icon">
            <i :class="phase.icon"></i>
          </div>
          <span class="phase-label">{{ phase.label }}</span>
        </div>
      </div>

      <!-- コンテンツエリア -->
      <div class="dialog-content">
        
        <!-- フェーズ1: データ検出 -->
        <div v-if="uiState.currentPhase === 'idle' || uiState.currentPhase === 'detecting'" class="phase-content">
          <div class="detection-phase">
            <h3>ローカルデータの検出</h3>
            <p>localStorageに保存されているHAQEIデータを検出します。</p>
            
            <div v-if="isDetecting" class="loading-state">
              <div class="spinner"></div>
              <p>データを検出中...</p>
            </div>
            
            <div v-else-if="detectionError" class="error-state">
              <i class="fas fa-exclamation-triangle"></i>
              <p>{{ detectionError }}</p>
              <button class="retry-button" @click="detectLocalStorageData">
                再試行
              </button>
            </div>
            
            <div v-else-if="!hasLocalStorageData" class="empty-state">
              <i class="fas fa-folder-open"></i>
              <p>移行可能なデータが見つかりませんでした。</p>
            </div>
            
            <div v-else class="action-buttons">
              <button 
                class="primary-button" 
                @click="detectLocalStorageData"
                :disabled="isDetecting"
              >
                <i class="fas fa-search"></i>
                データを検出
              </button>
            </div>
          </div>
        </div>

        <!-- フェーズ2: データプレビュー -->
        <div v-else-if="uiState.currentPhase === 'preview'" class="phase-content">
          <div class="preview-phase">
            <h3>検出されたデータ</h3>
            
            <div v-if="migrationSummary" class="summary-card">
              <div class="summary-stats">
                <div class="stat-item">
                  <span class="stat-value">{{ migrationSummary.totalItems }}</span>
                  <span class="stat-label">アイテム</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ migrationSummary.totalSizeKB }}KB</span>
                  <span class="stat-label">データサイズ</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ migrationSummary.estimatedTimeMinutes }}分</span>
                  <span class="stat-label">推定時間</span>
                </div>
              </div>
              
              <!-- プライバシーリスク表示 -->
              <div class="privacy-risk" :class="`risk-${migrationSummary.privacyRisk}`">
                <i class="fas fa-shield-alt"></i>
                <span>プライバシーリスク: {{ getRiskLabel(migrationSummary.privacyRisk) }}</span>
              </div>
            </div>

            <!-- データタイプ別表示 -->
            <div class="data-types">
              <h4>データタイプ別詳細</h4>
              <div class="data-type-list">
                <div 
                  v-for="dataType in getAvailableDataTypes()" 
                  :key="dataType.type"
                  class="data-type-item"
                >
                  <div class="data-type-info">
                    <i :class="getDataTypeIcon(dataType.type)"></i>
                    <span class="data-type-name">{{ getDataTypeName(dataType.type) }}</span>
                    <span class="data-type-count">({{ dataType.count }}個)</span>
                  </div>
                  <div class="data-type-size">{{ Math.round(dataType.size / 1024) }}KB</div>
                </div>
              </div>
            </div>

            <!-- 互換性チェック結果 -->
            <div v-if="detectedData?.compatibilityCheck.issues.length" class="compatibility-issues">
              <h4><i class="fas fa-exclamation-triangle"></i> 互換性の問題</h4>
              <ul>
                <li v-for="issue in detectedData.compatibilityCheck.issues" :key="issue">
                  {{ issue }}
                </li>
              </ul>
            </div>

            <div class="action-buttons">
              <button class="secondary-button" @click="resetMigrationState">
                戻る
              </button>
              <button 
                class="primary-button" 
                @click="Object.assign(uiState, { currentPhase: 'configuring' })"
                :disabled="!canStartMigration"
              >
                設定へ進む
              </button>
            </div>
          </div>
        </div>

        <!-- フェーズ3: 移行設定 -->
        <div v-else-if="uiState.currentPhase === 'configuring'" class="phase-content">
          <div class="configuration-phase">
            <h3>移行設定</h3>

            <!-- プライバシー設定 -->
            <div class="config-section">
              <h4><i class="fas fa-user-shield"></i> プライバシー設定（bunenjin哲学準拠）</h4>
              <div class="privacy-options">
                <label class="radio-option">
                  <input 
                    type="radio" 
                    :value="'maximum'" 
                    v-model="migrationOptions.privacyLevel"
                    @change="setPrivacyLevel('maximum')"
                  >
                  <span class="radio-label">
                    <strong>最大限（推奨）</strong> - 全データを匿名化、機密情報除外
                  </span>
                </label>
                <label class="radio-option">
                  <input 
                    type="radio" 
                    :value="'high'" 
                    v-model="migrationOptions.privacyLevel"
                    @change="setPrivacyLevel('high')"
                  >
                  <span class="radio-label">
                    <strong>高</strong> - 機密情報のみ除外
                  </span>
                </label>
                <label class="radio-option">
                  <input 
                    type="radio" 
                    :value="'medium'" 
                    v-model="migrationOptions.privacyLevel"
                    @change="setPrivacyLevel('medium')"
                  >
                  <span class="radio-label">
                    <strong>中</strong> - 基本的なプライバシー保護
                  </span>
                </label>
              </div>
            </div>

            <!-- Triple OS設定 -->
            <div class="config-section">
              <h4><i class="fas fa-layer-group"></i> Triple OS Architecture</h4>
              <div class="triple-os-options">
                <label class="checkbox-option">
                  <input 
                    type="checkbox" 
                    v-model="migrationOptions.migrateEngineOS"
                  >
                  <span class="checkbox-label">Engine OS データを移行</span>
                </label>
                <label class="checkbox-option">
                  <input 
                    type="checkbox" 
                    v-model="migrationOptions.migrateInterfaceOS"
                  >
                  <span class="checkbox-label">Interface OS データを移行</span>
                </label>
                <label class="checkbox-option">
                  <input 
                    type="checkbox" 
                    v-model="migrationOptions.migrateSafeModeOS"
                  >
                  <span class="checkbox-label">Safe Mode OS データを移行</span>
                </label>
                <label class="checkbox-option">
                  <input 
                    type="checkbox" 
                    v-model="migrationOptions.preserveOSInteractions"
                  >
                  <span class="checkbox-label">OS間相互作用データを保持</span>
                </label>
              </div>
            </div>

            <!-- 高度な設定 -->
            <div class="config-section">
              <h4><i class="fas fa-cogs"></i> 高度な設定</h4>
              <div class="advanced-options">
                <label class="checkbox-option">
                  <input 
                    type="checkbox" 
                    v-model="migrationOptions.createBackup"
                  >
                  <span class="checkbox-label">移行前にバックアップを作成</span>
                </label>
                <label class="checkbox-option">
                  <input 
                    type="checkbox" 
                    v-model="migrationOptions.validateData"
                  >
                  <span class="checkbox-label">データ検証を実行</span>
                </label>
                <label class="checkbox-option">
                  <input 
                    type="checkbox" 
                    v-model="migrationOptions.dryRun"
                  >
                  <span class="checkbox-label">テスト実行（実際には移行しない）</span>
                </label>
              </div>

              <div class="numeric-options">
                <div class="numeric-option">
                  <label>バッチサイズ:</label>
                  <input 
                    type="number" 
                    v-model.number="migrationOptions.batchSize"
                    min="1" 
                    max="1000"
                    class="numeric-input"
                  >
                </div>
                <div class="numeric-option">
                  <label>最大リトライ回数:</label>
                  <input 
                    type="number" 
                    v-model.number="migrationOptions.maxRetries"
                    min="0" 
                    max="10"
                    class="numeric-input"
                  >
                </div>
              </div>
            </div>

            <div class="action-buttons">
              <button class="secondary-button" @click="Object.assign(uiState, { currentPhase: 'preview' })"
                戻る
              </button>
              <button 
                class="primary-button" 
                @click="startMigration"
                :disabled="!canStartMigration"
              >
                <i class="fas fa-play"></i>
                移行開始
              </button>
            </div>
          </div>
        </div>

        <!-- フェーズ4: 移行実行中 -->
        <div v-else-if="uiState.currentPhase === 'migrating'" class="phase-content">
          <div class="migration-phase">
            <h3>データ移行実行中</h3>

            <!-- 進捗表示 -->
            <div class="progress-section">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: `${progressPercentage}%` }"
                ></div>
              </div>
              <div class="progress-text">
                <span class="progress-percentage">{{ Math.round(progressPercentage) }}%</span>
                <span class="progress-operation">{{ currentOperation }}</span>
              </div>
            </div>

            <!-- 詳細統計 -->
            <div v-if="migrationStats" class="migration-stats">
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value">{{ migrationStats.processed }}</div>
                  <div class="stat-label">処理済み</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ migrationStats.errors }}</div>
                  <div class="stat-label">エラー</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ migrationStats.elapsedTime }}s</div>
                  <div class="stat-label">経過時間</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ migrationStats.itemsPerSecond }}/s</div>
                  <div class="stat-label">処理速度</div>
                </div>
              </div>

              <!-- Triple OS統計 -->
              <div class="triple-os-stats">
                <h4>Triple OS 移行状況</h4>
                <div class="os-stats">
                  <div class="os-stat-item">
                    <span class="os-name">Engine OS:</span>
                    <span class="os-count">{{ migrationStats.engineOSMigrated }}</span>
                  </div>
                  <div class="os-stat-item">
                    <span class="os-name">Interface OS:</span>
                    <span class="os-count">{{ migrationStats.interfaceOSMigrated }}</span>
                  </div>
                  <div class="os-stat-item">
                    <span class="os-name">Safe Mode OS:</span>
                    <span class="os-count">{{ migrationStats.safeModeOSMigrated }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- エラー表示 -->
            <div v-if="criticalErrors.length > 0" class="error-section">
              <h4><i class="fas fa-exclamation-triangle"></i> 重大なエラー</h4>
              <div class="error-list">
                <div 
                  v-for="error in criticalErrors.slice(0, 5)" 
                  :key="error.timestamp"
                  class="error-item"
                >
                  <span class="error-operation">{{ error.operation }}</span>
                  <span class="error-message">{{ error.error }}</span>
                </div>
              </div>
            </div>

            <div class="action-buttons">
              <button 
                class="danger-button" 
                @click="cancelMigration"
                :disabled="!isMigrating"
              >
                <i class="fas fa-stop"></i>
                キャンセル
              </button>
            </div>
          </div>
        </div>

        <!-- フェーズ5: 完了/エラー -->
        <div v-else-if="uiState.currentPhase === 'completed' || uiState.currentPhase === 'error'" class="phase-content">
          <div class="completion-phase">
            
            <!-- 成功時 -->
            <div v-if="uiState.currentPhase === 'completed'" class="success-state">
              <div class="success-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <h3>移行が正常に完了しました</h3>

              <div v-if="migrationResult" class="completion-summary">
                <div class="summary-stats">
                  <div class="summary-item">
                    <span class="summary-label">移行完了:</span>
                    <span class="summary-value">{{ migrationResult.summary.itemsMigrated }}個</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">データ転送:</span>
                    <span class="summary-value">{{ Math.round(migrationResult.summary.dataTransferredBytes / 1024) }}KB</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">実行時間:</span>
                    <span class="summary-value">{{ Math.round(migrationResult.summary.executionTimeMs / 1000) }}秒</span>
                  </div>
                </div>

                <!-- Triple OS結果 -->
                <div class="triple-os-results">
                  <h4>Triple OS 移行結果</h4>
                  <div class="os-results">
                    <div class="os-result-item">
                      <span class="os-name">Engine OS:</span>
                      <span class="os-result">{{ migrationResult.tripleOSResults.engineOS.migrated }}個成功</span>
                    </div>
                    <div class="os-result-item">
                      <span class="os-name">Interface OS:</span>
                      <span class="os-result">{{ migrationResult.tripleOSResults.interfaceOS.migrated }}個成功</span>
                    </div>
                    <div class="os-result-item">
                      <span class="os-name">Safe Mode OS:</span>
                      <span class="os-result">{{ migrationResult.tripleOSResults.safeModeOS.migrated }}個成功</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- バックアップ情報 -->
              <div v-if="backupLocation" class="backup-info">
                <i class="fas fa-archive"></i>
                <span>バックアップが作成されました</span>
                <button class="rollback-button" @click="rollbackMigration">
                  <i class="fas fa-undo"></i>
                  ロールバック
                </button>
              </div>
            </div>

            <!-- エラー時 -->
            <div v-else class="error-state">
              <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <h3>移行中にエラーが発生しました</h3>

              <div class="error-message">
                {{ migrationError }}
              </div>

              <div v-if="criticalErrors.length > 0" class="error-details">
                <h4>エラー詳細</h4>
                <div class="error-analysis">
                  <p>{{ analyzeErrors().summary }}</p>
                  <ul>
                    <li v-for="recommendation in analyzeErrors().recommendations" :key="recommendation">
                      {{ recommendation }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="action-buttons">
              <button v-if="uiState.currentPhase === 'error'" class="secondary-button" @click="resetMigrationState">
                最初から
              </button>
              <button class="primary-button" @click="closeDialog">
                閉じる
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMigration } from '@/composables/useMigration'

// Props
interface Props {
  show: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  completed: [result: any]
}>()

// Migration Composable
const {
  // データ
  detectedData,
  migrationOptions,
  migrationProgress,
  migrationResult,
  uiState,
  
  // Computed
  hasLocalStorageData,
  migrationSummary,
  progressPercentage,
  currentOperation,
  migrationStats,
  criticalErrors,
  canStartMigration,
  
  // 状態フラグ
  isDetecting,
  isMigrating,
  isRollingBack,
  
  // エラー
  detectionError,
  migrationError,
  rollbackError,
  
  // バックアップ  
  backupLocation,
  
  // アクション
  detectLocalStorageData,
  startMigration,
  cancelMigration,
  rollbackMigration,
  resetMigrationState,
  setPrivacyLevel,
  getDataPreview,
  getAvailableDataTypes,
  analyzeErrors
} = useMigration()

// ローカル状態
const showDialog = ref(false)

// フェーズ定義
const phases = [
  { key: 'idle', label: '検出', icon: 'fas fa-search' },
  { key: 'detecting', label: '検出', icon: 'fas fa-search' },
  { key: 'preview', label: 'プレビュー', icon: 'fas fa-eye' },
  { key: 'configuring', label: '設定', icon: 'fas fa-cogs' },
  { key: 'migrating', label: '移行', icon: 'fas fa-exchange-alt' },
  { key: 'completed', label: '完了', icon: 'fas fa-check' },
  { key: 'error', label: 'エラー', icon: 'fas fa-exclamation-triangle' }
]

// Computed
const isPhaseCompleted = (phaseKey: string) => {
  const phaseIndex = phases.findIndex(p => p.key === phaseKey)
  const currentIndex = phases.findIndex(p => p.key === uiState.currentPhase)
  return phaseIndex < currentIndex || uiState.currentPhase === 'completed'
}

// Methods
const closeDialog = () => {
  if (!isMigrating.value) {
    showDialog.value = false
    emit('close')
  }
}

const getRiskLabel = (risk: string) => {
  const labels = {
    low: '低',
    medium: '中',
    high: '高'
  }
  return labels[risk] || risk
}

const getDataTypeIcon = (type: string) => {
  const icons = {
    user: 'fas fa-user',
    session: 'fas fa-play-circle',
    response: 'fas fa-comment-dots',
    analysis: 'fas fa-chart-line',
    triple_os: 'fas fa-layer-group',
    settings: 'fas fa-cog'
  }
  return icons[type] || 'fas fa-file'
}

const getDataTypeName = (type: string) => {
  const names = {
    user: 'ユーザーデータ',
    session: 'セッションデータ',
    response: '回答データ',
    analysis: '分析結果',
    triple_os: 'Triple OS',
    settings: '設定データ'
  }
  return names[type] || type
}

// Watchers
watch(() => props.show, (newShow) => {
  showDialog.value = newShow
  if (newShow && !hasLocalStorageData.value) {
    detectLocalStorageData()
  }
})

watch(() => uiState.migrationComplete, (completed) => {
  if (completed && migrationResult.value) {
    emit('completed', migrationResult.value)
  }
})
</script>

<style scoped>
.migration-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.migration-dialog {
  background: white;
  border-radius: 12px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.25);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.dialog-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.close-button {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.close-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.close-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* フェーズインジケーター */
.phase-indicator {
  display: flex;
  padding: 20px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  overflow-x: auto;
}

.phase-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 80px;
  position: relative;
}

.phase-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  right: -50%;
  width: 100%;
  height: 2px;
  background: #d1d5db;
  z-index: 0;
}

.phase-step.completed:not(:last-child)::after {
  background: #10b981;
}

.phase-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #d1d5db;
  color: white;
  font-size: 16px;
  z-index: 1;
  transition: all 0.3s;
}

.phase-step.active .phase-icon {
  background: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.phase-step.completed .phase-icon {
  background: #10b981;
}

.phase-step.error .phase-icon {
  background: #ef4444;
}

.phase-label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-align: center;
}

.phase-step.active .phase-label {
  color: #3b82f6;
  font-weight: 600;
}

/* コンテンツエリア */
.dialog-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.phase-content {
  min-height: 400px;
}

/* 共通要素 */
.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success-icon, .error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.success-icon {
  color: #10b981;
}

.error-icon {
  color: #ef4444;
}

/* サマリーカード */
.summary-card {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  margin-bottom: 16px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.privacy-risk {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 6px;
  font-weight: 500;
}

.privacy-risk.risk-low {
  background: #d1fae5;
  color: #065f46;
}

.privacy-risk.risk-medium {
  background: #fef3c7;
  color: #92400e;
}

.privacy-risk.risk-high {
  background: #fee2e2;
  color: #991b1b;
}

/* データタイプリスト */
.data-types {
  margin-bottom: 24px;
}

.data-type-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.data-type-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.data-type-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.data-type-name {
  font-weight: 500;
}

.data-type-count {
  color: #6b7280;
  font-size: 14px;
}

.data-type-size {
  font-size: 14px;
  color: #6b7280;
}

/* 設定セクション */
.config-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.config-section:last-child {
  border-bottom: none;
}

.config-section h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #374151;
}

.privacy-options, .triple-os-options, .advanced-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-option, .checkbox-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  padding: 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.radio-option:hover, .checkbox-option:hover {
  background: #f8fafc;
}

.radio-label, .checkbox-label {
  flex: 1;
  line-height: 1.5;
}

.numeric-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.numeric-option {
  display: flex;
  align-items: center;
  gap: 12px;
}

.numeric-input {
  width: 80px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

/* 進捗表示 */
.progress-section {
  margin-bottom: 24px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  transition: width 0.3s ease;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-percentage {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.progress-operation {
  color: #6b7280;
  font-size: 14px;
}

/* 統計表示 */
.migration-stats {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.stat-card .stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.stat-card .stat-label {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.triple-os-stats h4 {
  margin-bottom: 12px;
  color: #374151;
}

.os-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.os-stat-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 4px;
}

.os-name {
  font-weight: 500;
}

.os-count {
  color: #3b82f6;
  font-weight: 600;
}

/* ボタンスタイル */
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.primary-button, .secondary-button, .danger-button, .retry-button, .rollback-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 14px;
}

.primary-button {
  background: #3b82f6;
  color: white;
}

.primary-button:hover:not(:disabled) {
  background: #2563eb;
}

.secondary-button {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.secondary-button:hover:not(:disabled) {
  background: #e5e7eb;
}

.danger-button {
  background: #ef4444;
  color: white;
}

.danger-button:hover:not(:disabled) {
  background: #dc2626;
}

.retry-button, .rollback-button {
  background: #f59e0b;
  color: white;
  font-size: 12px;
  padding: 8px 16px;
}

.retry-button:hover, .rollback-button:hover {
  background: #d97706;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* エラー表示 */
.error-section, .compatibility-issues {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.error-section h4, .compatibility-issues h4 {
  color: #991b1b;
  margin-bottom: 12px;
}

.error-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.error-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: white;
  border-radius: 4px;
}

.error-operation {
  font-weight: 500;
  font-size: 12px;
  color: #6b7280;
}

.error-message {
  color: #991b1b;
  font-size: 14px;
}

/* 完了画面 */
.completion-summary {
  margin: 24px 0;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.summary-label {
  color: #6b7280;
}

.summary-value {
  font-weight: 600;
  color: #1f2937;
}

.backup-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 6px;
  margin-top: 16px;
  color: #065f46;
}

/* レスポンシ響応 */
@media (max-width: 640px) {
  .migration-dialog {
    width: 95%;
    margin: 20px;
  }
  
  .phase-indicator {
    padding: 16px;
  }
  
  .dialog-content {
    padding: 16px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .phase-step {
    min-width: 60px;
  }
  
  .phase-label {
    font-size: 10px;
  }
}
</style>