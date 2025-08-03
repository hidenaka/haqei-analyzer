<template>
  <div class="data-diff-viewer">
    <!-- ビューモード切り替え -->
    <div class="viewer-header">
      <div class="view-mode-selector">
        <button 
          @click="setViewMode('side-by-side')"
          class="mode-button"
          :class="{ active: viewMode === 'side-by-side' }"
          aria-label="サイドバイサイド表示"
        >
          <svg class="mode-icon" viewBox="0 0 24 24">
            <path d="M3 3h18v18H3V3zm2 2v14h6V5H5zm8 0v14h6V5h-6z"/>
          </svg>
          サイドバイサイド
        </button>
        
        <button 
          @click="setViewMode('unified')"
          class="mode-button"
          :class="{ active: viewMode === 'unified' }"
          aria-label="統合表示"
        >
          <svg class="mode-icon" viewBox="0 0 24 24">
            <path d="M3 3h18v18H3V3zm2 2v14h14V5H5z"/>
          </svg>
          統合
        </button>
        
        <button 
          @click="setViewMode('raw')"
          class="mode-button"
          :class="{ active: viewMode === 'raw' }"
          aria-label="生データ表示"
        >
          <svg class="mode-icon" viewBox="0 0 24 24">
            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
          </svg>
          生データ
        </button>
      </div>
      
      <div class="viewer-controls">
        <button 
          @click="toggleHighlights"
          class="control-button"
          :class="{ active: showHighlights }"
          aria-label="差異ハイライト切り替え"
        >
          <svg class="control-icon" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          {{ showHighlights ? 'ハイライト ON' : 'ハイライト OFF' }}
        </button>
        
        <button 
          @click="copyToClipboard"
          class="control-button"
          aria-label="差分をクリップボードにコピー"
        >
          <svg class="control-icon" viewBox="0 0 24 24">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
          コピー
        </button>
      </div>
    </div>

    <!-- データ表示エリア -->
    <div class="viewer-content" :class="contentClass">
      <!-- サイドバイサイド表示 -->
      <div v-if="viewMode === 'side-by-side'" class="side-by-side-view">
        <div class="data-panel left-panel">
          <div class="panel-header">
            <h4 class="panel-title">
              <svg class="panel-icon" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {{ leftPanelTitle }}
            </h4>
            <div class="panel-meta">
              {{ getDataMeta(leftData) }}
            </div>
          </div>
          <div class="panel-content">
            <pre class="data-display"><code v-html="renderData(leftData, 'left')"></code></pre>
          </div>
        </div>
        
        <div class="data-panel right-panel">
          <div class="panel-header">
            <h4 class="panel-title">
              <svg class="panel-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              {{ rightPanelTitle }}
            </h4>
            <div class="panel-meta">
              {{ getDataMeta(rightData) }}
            </div>
          </div>
          <div class="panel-content">
            <pre class="data-display"><code v-html="renderData(rightData, 'right')"></code></pre>
          </div>
        </div>
      </div>

      <!-- 統合表示 -->
      <div v-else-if="viewMode === 'unified'" class="unified-view">
        <div class="unified-panel">
          <div class="panel-header">
            <h4 class="panel-title">
              <svg class="panel-icon" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              統合差分表示
            </h4>
            <div class="legend">
              <span class="legend-item added">
                <div class="legend-color"></div>
                追加
              </span>
              <span class="legend-item modified">
                <div class="legend-color"></div>
                変更
              </span>
              <span class="legend-item removed">
                <div class="legend-color"></div>
                削除
              </span>
            </div>
          </div>
          <div class="panel-content">
            <pre class="data-display"><code v-html="renderUnifiedDiff()"></code></pre>
          </div>
        </div>
      </div>

      <!-- 生データ表示 -->
      <div v-else-if="viewMode === 'raw'" class="raw-view">
        <div class="raw-panel">
          <div class="panel-header">
            <h4 class="panel-title">
              <svg class="panel-icon" viewBox="0 0 24 24">
                <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
              </svg>
              生データ (JSON)
            </h4>
            <div class="raw-controls">
              <button 
                @click="toggleRawFormat"
                class="format-button"
                :class="{ active: formatRawData }"
              >
                {{ formatRawData ? '整形済み' : '圧縮' }}
              </button>
            </div>
          </div>
          <div class="panel-content">
            <div class="raw-data-container">
              <div class="raw-section">
                <h5 class="raw-section-title">{{ leftPanelTitle }}</h5>
                <pre class="raw-data"><code>{{ formatJsonData(leftData) }}</code></pre>
              </div>
              <div class="raw-section">
                <h5 class="raw-section-title">{{ rightPanelTitle }}</h5>
                <pre class="raw-data"><code>{{ formatJsonData(rightData) }}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 差分統計 -->
    <div class="diff-stats">
      <div class="stats-container">
        <div class="stat-item">
          <span class="stat-label">追加フィールド:</span>
          <span class="stat-value added">{{ diffStats.added }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">変更フィールド:</span>
          <span class="stat-value modified">{{ diffStats.modified }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">削除フィールド:</span>
          <span class="stat-value removed">{{ diffStats.removed }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">同一フィールド:</span>
          <span class="stat-value unchanged">{{ diffStats.unchanged }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">類似度:</span>
          <span class="stat-value similarity">{{ diffStats.similarity }}%</span>
        </div>
      </div>
    </div>

    <!-- コピー成功通知 -->
    <div v-if="showCopyNotification" class="copy-notification">
      <svg class="notification-icon" viewBox="0 0 24 24">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
      クリップボードにコピーしました
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'DataDiffViewer',
  props: {
    data: {
      type: [Object, Array, String, Number, Boolean],
      required: true
    },
    compareWith: {
      type: [Object, Array, String, Number, Boolean],
      default: null
    },
    highlightDifferences: {
      type: Boolean,
      default: true
    },
    viewMode: {
      type: String,
      default: 'local',
      validator: value => ['local', 'remote', 'both'].includes(value)
    },
    title: {
      type: String,
      default: ''
    }
  },
  emits: ['view-mode-change'],
  setup(props, { emit }) {
    // リアクティブデータ
    const viewMode = ref('side-by-side')
    const showHighlights = ref(true)
    const formatRawData = ref(true)
    const showCopyNotification = ref(false)

    // 計算されたプロパティ
    const leftData = computed(() => {
      if (props.viewMode === 'local') return props.data
      if (props.viewMode === 'remote') return props.compareWith
      return props.data // both モードでは左側をデータとする
    })

    const rightData = computed(() => {
      if (props.viewMode === 'local') return props.compareWith
      if (props.viewMode === 'remote') return props.data
      return props.compareWith // both モードでは右側を比較データとする
    })

    const leftPanelTitle = computed(() => {
      if (props.viewMode === 'local') return 'ローカル版'
      if (props.viewMode === 'remote') return 'リモート版'
      return 'データ A'
    })

    const rightPanelTitle = computed(() => {
      if (props.viewMode === 'local') return 'リモート版'
      if (props.viewMode === 'remote') return 'ローカル版'
      return 'データ B'
    })

    const contentClass = computed(() => ({
      'show-highlights': showHighlights.value,
      'hide-highlights': !showHighlights.value
    }))

    const diffStats = computed(() => {
      if (!rightData.value) {
        return {
          added: 0,
          modified: 0,
          removed: 0,
          unchanged: 0,
          similarity: 100
        }
      }

      const leftObj = normalizeData(leftData.value)
      const rightObj = normalizeData(rightData.value)
      
      const leftKeys = new Set(Object.keys(leftObj))
      const rightKeys = new Set(Object.keys(rightObj))
      const allKeys = new Set([...leftKeys, ...rightKeys])

      let added = 0
      let modified = 0
      let removed = 0
      let unchanged = 0

      allKeys.forEach(key => {
        if (!leftKeys.has(key)) {
          added++
        } else if (!rightKeys.has(key)) {
          removed++
        } else if (JSON.stringify(leftObj[key]) !== JSON.stringify(rightObj[key])) {
          modified++
        } else {
          unchanged++
        }
      })

      const total = allKeys.size
      const similarity = total > 0 ? Math.round((unchanged / total) * 100) : 100

      return { added, modified, removed, unchanged, similarity }
    })

    // メソッド
    const setViewMode = (mode) => {
      viewMode.value = mode
      emit('view-mode-change', mode)
    }

    const toggleHighlights = () => {
      showHighlights.value = !showHighlights.value
    }

    const toggleRawFormat = () => {
      formatRawData.value = !formatRawData.value
    }

    const normalizeData = (data) => {
      if (data === null || data === undefined) return {}
      if (typeof data === 'object' && !Array.isArray(data)) return data
      if (Array.isArray(data)) {
        return data.reduce((acc, item, index) => {
          acc[`[${index}]`] = item
          return acc
        }, {})
      }
      return { value: data }
    }

    const renderData = (data, side) => {
      const obj = normalizeData(data)
      const compareObj = side === 'left' ? normalizeData(rightData.value) : normalizeData(leftData.value)
      
      return renderObject(obj, compareObj, '', side)
    }

    const renderObject = (obj, compareObj, prefix = '', side = 'left') => {
      if (!obj || typeof obj !== 'object') {
        return escapeHtml(JSON.stringify(obj, null, 2))
      }

      let result = ''
      const keys = Object.keys(obj).sort()

      keys.forEach(key => {
        const value = obj[key]
        const compareValue = compareObj ? compareObj[key] : undefined
        const fullKey = prefix ? `${prefix}.${key}` : key
        
        let lineClass = ''
        if (showHighlights.value && compareObj) {
          if (compareValue === undefined) {
            lineClass = side === 'left' ? 'removed' : 'added'
          } else if (JSON.stringify(value) !== JSON.stringify(compareValue)) {
            lineClass = 'modified'
          }
        }

        const keyHtml = `<span class="key">"${escapeHtml(key)}"</span>`
        
        if (typeof value === 'object' && value !== null) {
          result += `<span class="line ${lineClass}">${keyHtml}: {</span>\n`
          result += renderObject(value, compareValue, fullKey, side)
          result += `<span class="line ${lineClass}">}</span>\n`
        } else {
          const valueHtml = `<span class="value ${getValueType(value)}">${escapeHtml(JSON.stringify(value))}</span>`
          result += `<span class="line ${lineClass}">${keyHtml}: ${valueHtml}</span>\n`
        }
      })

      return result
    }

    const renderUnifiedDiff = () => {
      const leftObj = normalizeData(leftData.value)
      const rightObj = normalizeData(rightData.value)
      
      if (!rightObj) return renderObject(leftObj, null, '', 'unified')

      const leftKeys = new Set(Object.keys(leftObj))
      const rightKeys = new Set(Object.keys(rightObj))
      const allKeys = [...new Set([...leftKeys, ...rightKeys])].sort()

      let result = ''

      allKeys.forEach(key => {
        const leftValue = leftObj[key]
        const rightValue = rightObj[key]
        const keyHtml = `<span class="key">"${escapeHtml(key)}"</span>`

        if (!leftKeys.has(key)) {
          // 追加された項目
          const valueHtml = `<span class="value ${getValueType(rightValue)}">${escapeHtml(JSON.stringify(rightValue))}</span>`
          result += `<span class="line added">+ ${keyHtml}: ${valueHtml}</span>\n`
        } else if (!rightKeys.has(key)) {
          // 削除された項目
          const valueHtml = `<span class="value ${getValueType(leftValue)}">${escapeHtml(JSON.stringify(leftValue))}</span>`
          result += `<span class="line removed">- ${keyHtml}: ${valueHtml}</span>\n`
        } else if (JSON.stringify(leftValue) !== JSON.stringify(rightValue)) {
          // 変更された項目
          const leftValueHtml = `<span class="value ${getValueType(leftValue)}">${escapeHtml(JSON.stringify(leftValue))}</span>`
          const rightValueHtml = `<span class="value ${getValueType(rightValue)}">${escapeHtml(JSON.stringify(rightValue))}</span>`
          result += `<span class="line removed">- ${keyHtml}: ${leftValueHtml}</span>\n`
          result += `<span class="line added">+ ${keyHtml}: ${rightValueHtml}</span>\n`
        } else {
          // 変更なし
          const valueHtml = `<span class="value ${getValueType(leftValue)}">${escapeHtml(JSON.stringify(leftValue))}</span>`
          result += `<span class="line unchanged">  ${keyHtml}: ${valueHtml}</span>\n`
        }
      })

      return result
    }

    const getValueType = (value) => {
      if (value === null) return 'null'
      if (typeof value === 'string') return 'string'
      if (typeof value === 'number') return 'number'
      if (typeof value === 'boolean') return 'boolean'
      if (Array.isArray(value)) return 'array'
      if (typeof value === 'object') return 'object'
      return 'unknown'
    }

    const escapeHtml = (text) => {
      const div = document.createElement('div')
      div.textContent = text
      return div.innerHTML
    }

    const formatJsonData = (data) => {
      try {
        return JSON.stringify(data, null, formatRawData.value ? 2 : 0)
      } catch (error) {
        return String(data)
      }
    }

    const getDataMeta = (data) => {
      if (!data) return '空'
      
      if (typeof data === 'object' && data !== null) {
        const keys = Object.keys(data).length
        if (Array.isArray(data)) {
          return `配列 (${data.length} 項目)`
        }
        return `オブジェクト (${keys} フィールド)`
      }
      
      return `${typeof data} 値`
    }

    const copyToClipboard = async () => {
      try {
        let textToCopy = ''
        
        if (viewMode.value === 'side-by-side') {
          textToCopy = `=== ${leftPanelTitle.value} ===\n`
          textToCopy += JSON.stringify(leftData.value, null, 2)
          textToCopy += `\n\n=== ${rightPanelTitle.value} ===\n`
          textToCopy += JSON.stringify(rightData.value, null, 2)
        } else if (viewMode.value === 'unified') {
          textToCopy = renderUnifiedDiff().replace(/<[^>]*>/g, '')
        } else {
          textToCopy = `${leftPanelTitle.value}:\n${JSON.stringify(leftData.value, null, 2)}\n\n`
          textToCopy += `${rightPanelTitle.value}:\n${JSON.stringify(rightData.value, null, 2)}`
        }
        
        await navigator.clipboard.writeText(textToCopy)
        
        showCopyNotification.value = true
        setTimeout(() => {
          showCopyNotification.value = false
        }, 2000)
        
      } catch (error) {
        console.error('クリップボードへのコピーに失敗:', error)
      }
    }

    return {
      // データ
      viewMode,
      showHighlights,
      formatRawData,
      showCopyNotification,
      
      // 計算されたプロパティ
      leftData,
      rightData,
      leftPanelTitle,
      rightPanelTitle,
      contentClass,
      diffStats,
      
      // メソッド
      setViewMode,
      toggleHighlights,
      toggleRawFormat,
      renderData,
      renderUnifiedDiff,
      formatJsonData,
      getDataMeta,
      copyToClipboard
    }
  }
}
</script>

<style scoped>
.data-diff-viewer {
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-color, #ffffff);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  position: relative;
}

/* ヘッダー */
.viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-secondary, #f9fafb);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  gap: 16px;
}

.view-mode-selector {
  display: flex;
  gap: 4px;
}

.mode-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 6px;
  background: var(--bg-color, #ffffff);
  color: var(--text-secondary, #6b7280);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-button:hover {
  border-color: var(--primary-color, #3b82f6);
  color: var(--primary-color, #3b82f6);
}

.mode-button.active {
  background: var(--primary-color, #3b82f6);
  border-color: var(--primary-color, #3b82f6);
  color: white;
}

.mode-icon {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

.viewer-controls {
  display: flex;
  gap: 8px;
}

.control-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 6px;
  background: var(--bg-color, #ffffff);
  color: var(--text-secondary, #6b7280);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-button:hover {
  border-color: var(--primary-color, #3b82f6);
  color: var(--primary-color, #3b82f6);
}

.control-button.active {
  background: var(--success-color, #10b981);
  border-color: var(--success-color, #10b981);
  color: white;
}

.control-icon {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

/* コンテンツエリア */
.viewer-content {
  min-height: 200px;
  max-height: 600px;
  overflow: auto;
}

/* サイドバイサイド表示 */
.side-by-side-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
}

.data-panel {
  border-right: 1px solid var(--border-color, #e5e7eb);
  display: flex;
  flex-direction: column;
}

.data-panel:last-child {
  border-right: none;
}

.panel-header {
  padding: 12px 16px;
  background: var(--bg-secondary, #f9fafb);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  flex-shrink: 0;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color, #374151);
}

.panel-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
  opacity: 0.7;
}

.panel-meta {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
}

.panel-content {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

/* 統合表示 */
.unified-view {
  height: 100%;
}

.unified-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.legend {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-secondary, #6b7280);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-item.added .legend-color {
  background: var(--diff-added, #dcfce7);
  border: 1px solid var(--diff-added-border, #22c55e);
}

.legend-item.modified .legend-color {
  background: var(--diff-modified, #fef3c7);
  border: 1px solid var(--diff-modified-border, #f59e0b);
}

.legend-item.removed .legend-color {
  background: var(--diff-removed, #fecaca);
  border: 1px solid var(--diff-removed-border, #ef4444);
}

/* 生データ表示 */
.raw-view {
  height: 100%;
}

.raw-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.raw-controls {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.format-button {
  padding: 4px 8px;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 4px;
  background: var(--bg-color, #ffffff);
  color: var(--text-secondary, #6b7280);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.format-button.active {
  background: var(--primary-color, #3b82f6);
  border-color: var(--primary-color, #3b82f6);
  color: white;
}

.raw-data-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.raw-section {
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 6px;
  overflow: hidden;
}

.raw-section-title {
  margin: 0;
  padding: 8px 12px;
  background: var(--bg-secondary, #f9fafb);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color, #374151);
}

.raw-data {
  margin: 0;
  padding: 12px;
  background: var(--code-bg, #f8fafc);
  overflow-x: auto;
}

/* データ表示 */
.data-display {
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.5;
  color: var(--text-color, #374151);
}

/* ハイライト表示 */
.show-highlights .line.added {
  background: var(--diff-added, #dcfce7);
  border-left: 3px solid var(--diff-added-border, #22c55e);
  padding-left: 8px;
  margin-left: -8px;
}

.show-highlights .line.removed {
  background: var(--diff-removed, #fecaca);
  border-left: 3px solid var(--diff-removed-border, #ef4444);
  padding-left: 8px;
  margin-left: -8px;
}

.show-highlights .line.modified {
  background: var(--diff-modified, #fef3c7);
  border-left: 3px solid var(--diff-modified-border, #f59e0b);
  padding-left: 8px;
  margin-left: -8px;
}

.line.unchanged {
  opacity: 0.7;
}

/* シンタックスハイライト */
.key {
  color: var(--syntax-key, #7c3aed);
  font-weight: 600;
}

.value.string {
  color: var(--syntax-string, #059669);
}

.value.number {
  color: var(--syntax-number, #dc2626);
}

.value.boolean {
  color: var(--syntax-boolean, #7c2d12);
}

.value.null {
  color: var(--syntax-null, #6b7280);
  font-style: italic;
}

.value.array {
  color: var(--syntax-array, #1d4ed8);
}

.value.object {
  color: var(--syntax-object, #be185d);
}

/* 差分統計 */
.diff-stats {
  padding: 12px 16px;
  background: var(--bg-secondary, #f9fafb);
  border-top: 1px solid var(--border-color, #e5e7eb);
}

.stats-container {
  display: flex;
  gap: 24px;
  justify-content: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.stat-label {
  color: var(--text-secondary, #6b7280);
  font-weight: 500;
}

.stat-value {
  font-weight: 700;
}

.stat-value.added {
  color: var(--success-color, #10b981);
}

.stat-value.modified {
  color: var(--warning-color, #f59e0b);
}

.stat-value.removed {
  color: var(--error-color, #ef4444);
}

.stat-value.unchanged {
  color: var(--text-secondary, #6b7280);
}

.stat-value.similarity {
  color: var(--primary-color, #3b82f6);
}

/* コピー通知 */
.copy-notification {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--success-color, #10b981);
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
  animation: slideInFade 0.3s ease, slideOutFade 0.3s ease 1.7s;
  z-index: 100;
}

.notification-icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

/* アニメーション */
@keyframes slideInFade {
  from {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

@keyframes slideOutFade {
  from {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -40%);
  }
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .viewer-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .view-mode-selector {
    justify-content: center;
  }
  
  .viewer-controls {
    justify-content: center;
  }
  
  .side-by-side-view {
    grid-template-columns: 1fr;
  }
  
  .data-panel {
    border-right: none;
    border-bottom: 1px solid var(--border-color, #e5e7eb);
  }
  
  .data-panel:last-child {
    border-bottom: none;
  }
  
  .stats-container {
    flex-wrap: wrap;
    gap: 12px;
    justify-content: flex-start;
  }
  
  .raw-data-container {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .data-diff-viewer {
    font-size: 12px;
  }
  
  .mode-button,
  .control-button {
    padding: 4px 8px;
    font-size: 11px;
  }
  
  .mode-button span:not(.mode-icon),
  .control-button span:not(.control-icon) {
    display: none;
  }
  
  .panel-content {
    padding: 12px;
  }
  
  .stats-container {
    flex-direction: column;
    gap: 8px;
  }
}

/* ダークモード対応 */
@media (prefers-color-scheme: dark) {
  .data-diff-viewer {
    --bg-color: #1f2937;
    --bg-secondary: #374151;
    --text-color: #f9fafb;
    --text-secondary: #d1d5db;
    --border-color: #4b5563;
    --code-bg: #374151;
    
    --diff-added: #064e3b;
    --diff-added-border: #10b981;
    --diff-modified: #78350f;
    --diff-modified-border: #f59e0b;
    --diff-removed: #7f1d1d;
    --diff-removed-border: #ef4444;
    
    --syntax-key: #a78bfa;
    --syntax-string: #34d399;
    --syntax-number: #fca5a5;
    --syntax-boolean: #fed7aa;
    --syntax-null: #9ca3af;
    --syntax-array: #93c5fd;
    --syntax-object: #f9a8d4;
  }
}

/* 高コントラスト対応 */
@media (prefers-contrast: high) {
  .data-panel,
  .unified-panel,
  .raw-panel {
    border-width: 2px;
  }
  
  .mode-button,
  .control-button {
    border-width: 2px;
  }
  
  .show-highlights .line.added,
  .show-highlights .line.removed,
  .show-highlights .line.modified {
    border-left-width: 4px;
  }
}

/* アニメーション削減対応 */
@media (prefers-reduced-motion: reduce) {
  .copy-notification {
    animation: none;
  }
  
  * {
    transition: none;
  }
}
</style>