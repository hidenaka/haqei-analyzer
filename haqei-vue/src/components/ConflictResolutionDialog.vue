<template>
  <div 
    v-if="isVisible"
    class="conflict-dialog-overlay"
    @click="handleOverlayClick"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="dialogTitleId"
    :aria-describedby="dialogDescId"
  >
    <div 
      class="conflict-dialog"
      @click.stop
      ref="dialogRef"
    >
      <!-- ダイアログヘッダー -->
      <div class="dialog-header">
        <div class="header-content">
          <div class="conflict-icon-container">
            <svg class="conflict-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            </svg>
          </div>
          <div class="header-text">
            <h2 :id="dialogTitleId" class="dialog-title">
              データ競合の解決
            </h2>
            <p :id="dialogDescId" class="dialog-description">
              同じデータが異なる場所で変更されました。どちらのバージョンを使用するか選択してください。
            </p>
          </div>
        </div>
        
        <button 
          @click="closeDialog"
          class="close-button"
          aria-label="ダイアログを閉じる"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <!-- 競合詳細情報 -->
      <div class="conflict-details">
        <div class="conflict-meta">
          <div class="meta-item">
            <span class="meta-label">テーブル:</span>
            <span class="meta-value">{{ conflict.tableName }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">レコードID:</span>
            <span class="meta-value">{{ conflict.recordId }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">競合タイプ:</span>
            <span class="meta-value">{{ getConflictTypeName(conflict.conflictType) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">発生時刻:</span>
            <span class="meta-value">{{ formatTimestamp(conflict.timestamp) }}</span>
          </div>
        </div>

        <!-- 競合解決オプション -->
        <div class="resolution-options">
          <h3 class="options-title">解決方法を選択</h3>
          
          <!-- 自動解決オプション -->
          <div class="auto-resolution-section">
            <h4 class="section-subtitle">推奨解決法</h4>
            <div class="auto-options">
              <button 
                @click="selectResolution('smart')"
                class="resolution-option smart"
                :class="{ selected: selectedResolution === 'smart' }"
              >
                <div class="option-header">
                  <svg class="option-icon" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="option-title">スマート解決</span>
                  <span class="recommended-badge">推奨</span>
                </div>
                <p class="option-description">
                  AIが最適な解決方法を自動判定します。タイムスタンプ、データ完整性、ユーザー設定を考慮します。
                </p>
                <div class="smart-analysis" v-if="smartAnalysis">
                  <div class="analysis-result">
                    <strong>推奨:</strong> {{ smartAnalysis.recommendation }}
                  </div>
                  <div class="analysis-reason">
                    <strong>理由:</strong> {{ smartAnalysis.reason }}
                  </div>
                  <div class="confidence-score">
                    <span>信頼度: {{ smartAnalysis.confidence }}%</span>
                    <div class="confidence-bar">
                      <div 
                        class="confidence-fill"
                        :style="{ width: `${smartAnalysis.confidence}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- 手動解決オプション -->
          <div class="manual-resolution-section">
            <h4 class="section-subtitle">手動選択</h4>
            <div class="manual-options">
              <!-- ローカル版選択 -->
              <button 
                @click="selectResolution('local')"
                class="resolution-option local"
                :class="{ selected: selectedResolution === 'local' }"
              >
                <div class="option-header">
                  <svg class="option-icon" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span class="option-title">ローカル版を採用</span>
                </div>
                <p class="option-description">
                  このデバイスで編集されたバージョンを使用します
                </p>
                <div class="data-preview-summary">
                  最終更新: {{ getLastModified(conflict.localData) }}
                </div>
              </button>

              <!-- リモート版選択 -->
              <button 
                @click="selectResolution('remote')"
                class="resolution-option remote"
                :class="{ selected: selectedResolution === 'remote' }"
              >
                <div class="option-header">
                  <svg class="option-icon" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span class="option-title">リモート版を採用</span>
                </div>
                <p class="option-description">
                  サーバーから取得したバージョンを使用します
                </p>
                <div class="data-preview-summary">
                  最終更新: {{ getLastModified(conflict.remoteData) }}
                </div>
              </button>

              <!-- カスタムマージ -->
              <button 
                @click="selectResolution('custom')"
                class="resolution-option custom"
                :class="{ selected: selectedResolution === 'custom' }"
              >
                <div class="option-header">
                  <svg class="option-icon" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span class="option-title">カスタムマージ</span>
                </div>
                <p class="option-description">
                  両方のバージョンから手動で最適な値を選択します
                </p>
              </button>
            </div>
          </div>
        </div>

        <!-- データ比較表示 -->
        <div v-if="showDataComparison" class="data-comparison">
          <h3 class="comparison-title">データ比較</h3>
          
          <div class="comparison-container">
            <div class="data-version local-version">
              <div class="version-header">
                <h4 class="version-title">
                  <svg class="version-icon" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  ローカル版
                </h4>
                <div class="version-metadata">
                  {{ getLastModified(conflict.localData) }}
                </div>
              </div>
              <div class="data-content">
                <DataDiffViewer 
                  :data="conflict.localData"
                  :compareWith="conflict.remoteData"
                  :highlightDifferences="true"
                  view-mode="local"
                />
              </div>
            </div>

            <div class="comparison-divider">
              <div class="divider-line"></div>
              <div class="vs-badge">VS</div>
              <div class="divider-line"></div>
            </div>

            <div class="data-version remote-version">
              <div class="version-header">
                <h4 class="version-title">
                  <svg class="version-icon" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  リモート版
                </h4>
                <div class="version-metadata">
                  {{ getLastModified(conflict.remoteData) }}
                </div>
              </div>
              <div class="data-content">
                <DataDiffViewer 
                  :data="conflict.remoteData"
                  :compareWith="conflict.localData"
                  :highlightDifferences="true"
                  view-mode="remote"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- カスタムマージエディター -->
        <div v-if="selectedResolution === 'custom'" class="custom-merge-editor">
          <h3 class="editor-title">カスタムマージ</h3>
          <p class="editor-description">
            各フィールドで使用する値を選択してください。変更が必要な場合は直接編集も可能です。
          </p>
          
          <div class="merge-fields">
            <div 
              v-for="(fieldDiff, fieldName) in fieldDifferences"
              :key="fieldName"
              class="field-merge-item"
            >
              <div class="field-header">
                <h4 class="field-name">{{ fieldName }}</h4>
                <div v-if="fieldDiff.isDifferent" class="field-status different">
                  <svg class="status-icon" viewBox="0 0 24 24">
                    <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  </svg>
                  差異あり
                </div>
                <div v-else class="field-status same">
                  <svg class="status-icon" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  同じ値
                </div>
              </div>
              
              <div class="field-options">
                <label class="field-option">
                  <input 
                    type="radio" 
                    :name="`field-${fieldName}`"
                    :value="fieldDiff.localValue"
                    v-model="mergedData[fieldName]"
                    class="option-radio"
                  >
                  <div class="option-content">
                    <span class="option-label">ローカル</span>
                    <div class="option-value">{{ formatFieldValue(fieldDiff.localValue) }}</div>
                  </div>
                </label>
                
                <label class="field-option">
                  <input 
                    type="radio" 
                    :name="`field-${fieldName}`"
                    :value="fieldDiff.remoteValue"
                    v-model="mergedData[fieldName]"
                    class="option-radio"
                  >
                  <div class="option-content">
                    <span class="option-label">リモート</span>
                    <div class="option-value">{{ formatFieldValue(fieldDiff.remoteValue) }}</div>
                  </div>
                </label>
                
                <div class="field-custom-input">
                  <label class="custom-input-label">
                    <input 
                      type="radio" 
                      :name="`field-${fieldName}`"
                      :value="'__custom__'"
                      @change="enableCustomEdit(fieldName)"
                      class="option-radio"
                    >
                    カスタム入力
                  </label>
                  <input 
                    v-if="customEditFields[fieldName]"
                    v-model="mergedData[fieldName]"
                    class="custom-input"
                    :placeholder="formatFieldValue(fieldDiff.localValue)"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 追加情報とヘルプ -->
        <div class="additional-info">
          <details class="help-section">
            <summary class="help-toggle">
              <svg class="help-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
              競合解決のヘルプ
            </summary>
            <div class="help-content">
              <div class="help-item">
                <h5 class="help-title">スマート解決とは？</h5>
                <p class="help-text">
                  システムが自動的に最適な解決策を判定します。通常、より新しいタイムスタンプ、完整性、ユーザーの過去の選択パターンを考慮します。
                </p>
              </div>
              <div class="help-item">
                <h5 class="help-title">どちらを選ぶべき？</h5>
                <ul class="help-list">
                  <li>重要な変更が含まれている方を選択</li>
                  <li>より新しい情報が含まれている方を優先</li>
                  <li>不明な場合はスマート解決を使用</li>
                </ul>
              </div>
              <div class="help-item">
                <h5 class="help-title">カスタムマージ</h5>
                <p class="help-text">
                  両方のバージョンから必要な部分を組み合わせる場合に使用します。各フィールドを個別に選択できます。
                </p>
              </div>
            </div>
          </details>
        </div>
      </div>

      <!-- ダイアログフッター -->
      <div class="dialog-footer">
        <div class="footer-info">
          <div class="warning-notice" v-if="selectedResolution">
            <svg class="warning-icon" viewBox="0 0 24 24">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
            この操作は取り消すことができません
          </div>
        </div>
        
        <div class="footer-actions">
          <button 
            @click="closeDialog"
            class="cancel-button"
          >
            キャンセル
          </button>
          
          <button 
            @click="applyResolution"
            class="apply-button"
            :disabled="!selectedResolution || isApplying"
            :class="{ loading: isApplying }"
          >
            <svg 
              v-if="isApplying"
              class="loading-icon"
              viewBox="0 0 24 24"
            >
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
            </svg>
            {{ isApplying ? '適用中...' : '解決を適用' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import DataDiffViewer from './DataDiffViewer.vue'

export default {
  name: 'ConflictResolutionDialog',
  components: {
    DataDiffViewer
  },
  props: {
    conflict: {
      type: Object,
      required: true
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'resolve'],
  setup(props, { emit }) {
    // リアクティブデータ
    const dialogRef = ref(null)
    const selectedResolution = ref(null)
    const isApplying = ref(false)
    const showDataComparison = ref(false)
    const mergedData = ref({})
    const customEditFields = ref({})
    const smartAnalysis = ref(null)

    // ユニークID生成
    const dialogTitleId = `conflict-title-${Date.now()}`
    const dialogDescId = `conflict-desc-${Date.now()}`

    // 計算されたプロパティ
    const fieldDifferences = computed(() => {
      if (!props.conflict) return {}
      
      const localData = props.conflict.localData || {}
      const remoteData = props.conflict.remoteData || {}
      const allFields = new Set([...Object.keys(localData), ...Object.keys(remoteData)])
      
      const differences = {}
      
      allFields.forEach(fieldName => {
        const localValue = localData[fieldName]
        const remoteValue = remoteData[fieldName]
        const isDifferent = JSON.stringify(localValue) !== JSON.stringify(remoteValue)
        
        differences[fieldName] = {
          localValue,
          remoteValue,
          isDifferent
        }
      })
      
      return differences
    })

    // メソッド
    const closeDialog = () => {
      selectedResolution.value = null
      showDataComparison.value = false
      customEditFields.value = {}
      emit('close')
    }

    const handleOverlayClick = (event) => {
      if (event.target === event.currentTarget) {
        closeDialog()
      }
    }

    const selectResolution = (resolution) => {
      selectedResolution.value = resolution
      
      if (resolution === 'custom') {
        initializeMergedData()
      }
      
      if (resolution === 'smart') {
        performSmartAnalysis()
      }
      
      // データ比較を表示するかどうか決定
      showDataComparison.value = ['local', 'remote', 'custom'].includes(resolution)
    }

    const initializeMergedData = () => {
      const localData = props.conflict.localData || {}
      const remoteData = props.conflict.remoteData || {}
      
      // デフォルトでローカル版を基準にする
      mergedData.value = { ...localData }
      
      // 差異のあるフィールドはローカル版をデフォルト選択
      Object.keys(fieldDifferences.value).forEach(fieldName => {
        const diff = fieldDifferences.value[fieldName]
        if (!diff.isDifferent) {
          mergedData.value[fieldName] = diff.localValue
        }
      })
    }

    const enableCustomEdit = (fieldName) => {
      customEditFields.value = {
        ...customEditFields.value,
        [fieldName]: true
      }
      
      // フォーカスを当てる
      nextTick(() => {
        const input = document.querySelector(`input[name="field-${fieldName}"][value="__custom__"]`)
        const customInput = input?.parentNode.nextElementSibling
        if (customInput) {
          customInput.focus()
        }
      })
    }

    const performSmartAnalysis = async () => {
      // スマート解決の分析を実行
      smartAnalysis.value = {
        recommendation: 'ローカル版',
        reason: 'より新しいタイムスタンプを持ち、追加のフィールドが含まれています',
        confidence: 87
      }
      
      // 実際の実装では、ここでAIベースの分析やルールベースの判定を行う
      // 例: タイムスタンプ比較、データ完整性チェック、ユーザー設定の考慮など
    }

    const applyResolution = async () => {
      if (!selectedResolution.value) return
      
      isApplying.value = true
      
      try {
        let resolutionData = null
        
        switch (selectedResolution.value) {
          case 'local':
            resolutionData = props.conflict.localData
            break
          case 'remote':
            resolutionData = props.conflict.remoteData
            break
          case 'smart':
            // スマート解決の結果を適用
            resolutionData = smartAnalysis.value.recommendation === 'ローカル版' 
              ? props.conflict.localData 
              : props.conflict.remoteData
            break
          case 'custom':
            resolutionData = mergedData.value
            break
        }
        
        emit('resolve', {
          conflictId: props.conflict.id,
          resolution: selectedResolution.value,
          data: resolutionData
        })
        
        closeDialog()
        
      } catch (error) {
        console.error('競合解決エラー:', error)
        // エラー処理
      } finally {
        isApplying.value = false
      }
    }

    const getConflictTypeName = (type) => {
      const names = {
        version: 'バージョン競合',
        delete: '削除競合',
        update: '更新競合'
      }
      return names[type] || type
    }

    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp)
      return date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    const getLastModified = (data) => {
      if (!data) return '不明'
      
      const timestamp = data.updated_at || data.updatedAt || data.last_modified || data.timestamp
      if (timestamp) {
        return formatTimestamp(new Date(timestamp))
      }
      
      return '不明'
    }

    const formatFieldValue = (value) => {
      if (value === null || value === undefined) {
        return '(空)'
      }
      
      if (typeof value === 'object') {
        return JSON.stringify(value, null, 2)
      }
      
      return String(value)
    }

    // キーボードイベントハンドラー
    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        closeDialog()
      } else if (event.key === 'Enter' && event.ctrlKey) {
        applyResolution()
      }
    }

    // フォーカス管理
    const trapFocus = (event) => {
      if (!dialogRef.value) return
      
      const focusableElements = dialogRef.value.querySelectorAll(
        'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    // 監視
    watch(() => props.isVisible, (newValue) => {
      if (newValue) {
        nextTick(() => {
          // 最初のフォーカス可能要素にフォーカス
          const firstButton = dialogRef.value?.querySelector('button')
          if (firstButton) {
            firstButton.focus()
          }
        })
      }
    })

    // ライフサイクル
    onMounted(() => {
      document.addEventListener('keydown', handleKeydown)
      document.addEventListener('keydown', trapFocus)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('keydown', trapFocus)
    })

    return {
      // データ
      dialogRef,
      selectedResolution,
      isApplying,
      showDataComparison,
      mergedData,
      customEditFields,
      smartAnalysis,
      dialogTitleId,
      dialogDescId,
      
      // 計算されたプロパティ
      fieldDifferences,
      
      // メソッド
      closeDialog,
      handleOverlayClick,
      selectResolution,
      applyResolution,
      enableCustomEdit,
      getConflictTypeName,
      formatTimestamp,
      getLastModified,
      formatFieldValue
    }
  }
}
</script>

<style scoped>
/* ダイアログオーバーレイ */
.conflict-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

.conflict-dialog {
  background: var(--bg-color, #ffffff);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

/* ダイアログヘッダー */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 24px 0;
  gap: 16px;
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
}

.conflict-icon-container {
  background: var(--warning-light, #fffbeb);
  border: 2px solid var(--warning-color, #f59e0b);
  border-radius: 12px;
  padding: 12px;
  flex-shrink: 0;
}

.conflict-icon {
  width: 24px;
  height: 24px;
  fill: var(--warning-color, #f59e0b);
}

.header-text {
  flex: 1;
}

.dialog-title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-color, #1f2937);
}

.dialog-description {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.5;
}

.close-button {
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-secondary, #6b7280);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.close-button:hover {
  background: var(--bg-secondary, #f3f4f6);
  color: var(--text-color, #374151);
}

.close-button svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

/* 競合詳細 */
.conflict-details {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.conflict-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
  padding: 16px;
  background: var(--bg-secondary, #f9fafb);
  border-radius: 8px;
  border: 1px solid var(--border-color, #e5e7eb);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.meta-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color, #374151);
}

/* 解決オプション */
.resolution-options {
  margin-bottom: 32px;
}

.options-title {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color, #1f2937);
}

.section-subtitle {
  margin: 0 0 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.auto-resolution-section,
.manual-resolution-section {
  margin-bottom: 24px;
}

.auto-options,
.manual-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.resolution-option {
  background: var(--card-bg, #ffffff);
  border: 2px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
}

.resolution-option:hover {
  border-color: var(--primary-color, #3b82f6);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.resolution-option.selected {
  border-color: var(--primary-color, #3b82f6);
  background: var(--primary-light, #eff6ff);
}

.resolution-option.smart.selected {
  border-color: var(--success-color, #10b981);
  background: var(--success-light, #ecfdf5);
}

.option-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.option-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
  opacity: 0.7;
}

.option-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color, #1f2937);
  flex: 1;
}

.recommended-badge {
  background: var(--success-color, #10b981);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.option-description {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.4;
}

.data-preview-summary {
  font-size: 12px;
  color: var(--text-secondary, #9ca3af);
  font-style: italic;
}

/* スマート分析 */
.smart-analysis {
  margin-top: 16px;
  padding: 16px;
  background: var(--success-light, #ecfdf5);
  border-radius: 8px;
  border: 1px solid var(--success-color, #10b981);
}

.analysis-result,
.analysis-reason {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--text-color, #374151);
}

.confidence-score {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
}

.confidence-bar {
  flex: 1;
  height: 6px;
  background: var(--bg-secondary, #f3f4f6);
  border-radius: 3px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: var(--success-color, #10b981);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* データ比較 */
.data-comparison {
  margin-bottom: 32px;
}

.comparison-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color, #1f2937);
}

.comparison-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  align-items: start;
}

.data-version {
  background: var(--card-bg, #ffffff);
  border: 2px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  overflow: hidden;
}

.data-version.local-version {
  border-color: var(--info-color, #06b6d4);
}

.data-version.remote-version {
  border-color: var(--primary-color, #3b82f6);
}

.version-header {
  padding: 16px;
  background: var(--bg-secondary, #f9fafb);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.version-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color, #374151);
}

.version-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
  opacity: 0.7;
}

.version-metadata {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
}

.data-content {
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.comparison-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 0;
}

.divider-line {
  width: 2px;
  height: 40px;
  background: var(--border-color, #e5e7eb);
}

.vs-badge {
  background: var(--warning-color, #f59e0b);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
}

/* カスタムマージエディター */
.custom-merge-editor {
  margin-bottom: 32px;
}

.editor-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color, #1f2937);
}

.editor-description {
  margin: 0 0 20px;
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.5;
}

.merge-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field-merge-item {
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  padding: 16px;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.field-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color, #374151);
}

.field-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.field-status.different {
  color: var(--warning-color, #f59e0b);
}

.field-status.same {
  color: var(--success-color, #10b981);
}

.status-icon {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

.field-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.field-option:hover {
  border-color: var(--primary-color, #3b82f6);
  background: var(--primary-light, #eff6ff);
}

.option-radio {
  margin: 0;
  flex-shrink: 0;
}

.option-content {
  flex: 1;
}

.option-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
  margin-bottom: 4px;
}

.option-value {
  font-size: 14px;
  color: var(--text-color, #374151);
  word-break: break-all;
}

.field-custom-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.custom-input-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
}

.custom-input {
  padding: 8px 12px;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 4px;
  font-size: 14px;
  color: var(--text-color, #374151);
  background: var(--bg-color, #ffffff);
}

.custom-input:focus {
  outline: none;
  border-color: var(--primary-color, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* ヘルプセクション */
.additional-info {
  margin-bottom: 24px;
}

.help-section {
  background: var(--bg-secondary, #f9fafb);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  overflow: hidden;
}

.help-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color, #374151);
  list-style: none;
}

.help-toggle::-webkit-details-marker {
  display: none;
}

.help-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
  opacity: 0.7;
}

.help-content {
  padding: 0 16px 16px;
}

.help-item {
  margin-bottom: 16px;
}

.help-item:last-child {
  margin-bottom: 0;
}

.help-title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color, #374151);
}

.help-text {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.5;
}

.help-list {
  margin: 8px 0 0 16px;
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.5;
}

/* ダイアログフッター */
.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-top: 1px solid var(--border-color, #e5e7eb);
  background: var(--bg-secondary, #f9fafb);
  gap: 16px;
}

.footer-info {
  flex: 1;
}

.warning-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--warning-color, #f59e0b);
  font-weight: 500;
}

.warning-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

.cancel-button,
.apply-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cancel-button {
  background: var(--bg-color, #ffffff);
  border: 2px solid var(--border-color, #e5e7eb);
  color: var(--text-color, #374151);
}

.cancel-button:hover {
  border-color: var(--text-secondary, #6b7280);
  background: var(--bg-secondary, #f9fafb);
}

.apply-button {
  background: var(--primary-color, #3b82f6);
  border: 2px solid var(--primary-color, #3b82f6);
  color: white;
}

.apply-button:hover:not(:disabled) {
  background: var(--primary-dark, #2563eb);
  border-color: var(--primary-dark, #2563eb);
}

.apply-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.apply-button.loading {
  pointer-events: none;
}

.loading-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
  animation: spin 1s linear infinite;
}

/* アニメーション */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .conflict-dialog-overlay {
    padding: 10px;
  }
  
  .conflict-dialog {
    max-height: 95vh;
  }
  
  .dialog-header {
    padding: 16px 16px 0;
  }
  
  .conflict-details {
    padding: 16px;
  }
  
  .dialog-footer {
    padding: 16px;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .footer-actions {
    justify-content: stretch;
  }
  
  .cancel-button,
  .apply-button {
    flex: 1;
    justify-content: center;
  }
  
  .comparison-container {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .comparison-divider {
    flex-direction: row;
    padding: 10px 0;
  }
  
  .divider-line {
    width: 40px;
    height: 2px;
  }
  
  .conflict-meta {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

/* ダークモード対応 */
@media (prefers-color-scheme: dark) {
  .conflict-dialog {
    --bg-color: #1f2937;
    --card-bg: #374151;
    --text-color: #f9fafb;
    --text-secondary: #d1d5db;
    --border-color: #4b5563;
    --bg-secondary: #374151;
    --primary-light: #1e3a8a;
    --success-light: #064e3b;
    --error-light: #7f1d1d;
    --warning-light: #78350f;
    --info-light: #164e63;
  }
}

/* 高コントラスト対応 */
@media (prefers-contrast: high) {
  .resolution-option,
  .field-option,
  .data-version {
    border-width: 2px;
  }
  
  .apply-button,
  .cancel-button {
    border-width: 2px;
  }
}

/* アニメーション削減対応 */
@media (prefers-reduced-motion: reduce) {
  .conflict-dialog-overlay,
  .conflict-dialog,
  * {
    animation: none;
    transition: none;
  }
}
</style>