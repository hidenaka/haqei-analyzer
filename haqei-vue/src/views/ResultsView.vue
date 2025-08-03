<template>
  <div class="results-view">
    <div class="results-container">
      <!-- Header -->
      <header class="results-header">
        <div class="header-content">
          <h1>HaQei 分析結果</h1>
          <p class="timestamp">{{ formattedTimestamp }}</p>
        </div>
        <div class="header-actions">
          <HButton
            variant="secondary"
            size="small"
            icon="download"
            @click="exportPDF"
          >
            PDFダウンロード
          </HButton>
          <HButton
            variant="secondary"
            size="small"
            icon="share"
            @click="shareResults"
          >
            シェア
          </HButton>
        </div>
      </header>

      <!-- Main Results -->
      <main class="results-main">
        <!-- Triple OS Overview -->
        <section class="triple-os-section">
          <h2 class="section-title">Triple OS 分析結果</h2>
          <TripleOSOverview
            v-if="tripleOSResult"
            :engine-os="tripleOSResult.engineOS"
            :interface-os="tripleOSResult.interfaceOS"
            :safe-mode-os="tripleOSResult.safeModeOS"
            :consistency-score="tripleOSResult.consistencyScore"
          />
        </section>

        <!-- Primary Hexagram Detail -->
        <section class="hexagram-section">
          <h2 class="section-title">あなたの主要卦</h2>
          <HexagramDetail
            v-if="tripleOSResult"
            :hexagram-id="tripleOSResult.engineOS.hexagramId"
            :hexagram-name="tripleOSResult.engineOS.hexagramName"
            :trigram-energies="tripleOSResult.engineOS.trigramEnergies"
          />
        </section>

        <!-- 8D Radar Chart -->
        <section class="radar-section">
          <h2 class="section-title">8次元パーソナリティマップ</h2>
          <DimensionRadarChart
            v-if="analysisResult"
            :dimension-scores="analysisResult.dimensionScores"
            @dimension-click="handleDimensionClick"
          />
        </section>

        <!-- Dimension Bar Chart -->
        <section class="chart-section">
          <h2 class="section-title">次元別スコア分布</h2>
          <DimensionBarChart
            v-if="analysisResult"
            :dimension-scores="analysisResult.dimensionScores"
            title="各次元の詳細スコア"
            :horizontal="false"
            :show-legend="true"
            @dimension-click="handleDimensionClick"
          />
        </section>

        <!-- Triple OS Distribution -->
        <section class="os-distribution-section">
          <h2 class="section-title">Triple OS 構成比</h2>
          <TripleOSDoughnutChart
            v-if="tripleOSResult"
            :engine-os="tripleOSResult.engineOS"
            :interface-os="tripleOSResult.interfaceOS"
            :safe-mode-os="tripleOSResult.safeModeOS"
            :consistency-score="tripleOSResult.consistencyScore"
            title="OS間のバランス"
            @os-click="handleOSClick"
          />
        </section>

        <!-- Dimension Breakdown -->
        <section class="dimensions-section">
          <h2 class="section-title">次元別詳細分析</h2>
          <DimensionBreakdown
            v-if="analysisResult"
            :dimension-scores="analysisResult.dimensionScores"
          />
        </section>

        <!-- Triple OS Comparison -->
        <section class="comparison-section">
          <TripleOSComparison
            v-if="tripleOSResult"
            :triple-os-result="tripleOSResult"
          />
        </section>

        <!-- Misalignment Indicator -->
        <section class="misalignment-section">
          <MisalignmentIndicator
            v-if="tripleOSResult?.misalignmentData"
            :misalignment-data="tripleOSResult.misalignmentData"
          />
        </section>

        <!-- Triple OS Insights -->
        <section v-if="tripleOSResult" class="insights-section">
          <TripleOSInsights
            :triple-os-result="tripleOSResult"
          />
        </section>

        <!-- Action Plans -->
        <section class="actions-section">
          <h2 class="section-title">次のステップ</h2>
          <ActionPlans
            v-if="tripleOSResult"
            :engine-os="tripleOSResult.engineOS"
            :consistency-score="tripleOSResult.consistencyScore"
          />
        </section>
      </main>

      <!-- Footer Actions -->
      <footer class="results-footer">
        <HButton
          variant="primary"
          size="large"
          @click="startNewAnalysis"
        >
          新しい分析を開始
        </HButton>
        <HButton
          variant="secondary"
          size="large"
          @click="saveResults"
        >
          結果を保存
        </HButton>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useAnalysisStore } from '@/stores/analysis'
import HButton from '@/components/common/HButton.vue'
import HCard from '@/components/common/HCard.vue'
import TripleOSOverview from '@/components/results/TripleOSOverview.vue'
import HexagramDetail from '@/components/results/HexagramDetail.vue'
import RadarChart from '@/components/results/RadarChart.vue'
import DimensionRadarChart from '@/components/charts/DimensionRadarChart.vue'
import DimensionBarChart from '@/components/charts/DimensionBarChart.vue'
import TripleOSDoughnutChart from '@/components/charts/TripleOSDoughnutChart.vue'
import DimensionBreakdown from '@/components/results/DimensionBreakdown.vue'
import ActionPlans from '@/components/results/ActionPlans.vue'

// Triple OS Components
import { TripleOSComparison, MisalignmentIndicator, TripleOSInsights } from '@/components/tripleOS'

const router = useRouter()
const analysisStore = useAnalysisStore()

// Computed properties
const analysisResult = computed(() => analysisStore.analysisResult)
const tripleOSResult = computed(() => analysisStore.tripleOSResult)

const formattedTimestamp = computed(() => {
  if (!analysisResult.value) return ''
  return format(new Date(analysisResult.value.timestamp), 'yyyy年MM月dd日 HH:mm', { locale: ja })
})

const dimensionScoresArray = computed(() => {
  if (!analysisResult.value) return []
  return Array.from(analysisResult.value.dimensionScores.entries()).map(([key, value]) => ({
    dimension: key,
    score: value
  }))
})

// Check if results exist
onMounted(() => {
  if (!analysisResult.value || !tripleOSResult.value) {
    router.push('/analysis')
  }
})

// Methods
async function exportPDF() {
  if (!analysisResult.value || !tripleOSResult.value) {
    alert('分析結果がありません')
    return
  }
  
  try {
    const { exportToPDF } = await import('@/utils/pdfExport')
    await exportToPDF(analysisResult.value, tripleOSResult.value, {
      includeCharts: true,
      includeDetailedAnalysis: true,
      includeActionPlans: true
    })
  } catch (error) {
    console.error('PDF export failed:', error)
    alert('PDFのエクスポートに失敗しました')
  }
}

async function shareResults() {
  if (!analysisResult.value || !tripleOSResult.value) {
    alert('分析結果がありません')
    return
  }

  try {
    const shareData = {
      title: 'HaQei 分析結果',
      text: `私のTriple OS分析結果をシェアします！\n整合性スコア: ${tripleOSResult.value.consistencyScore}%`,
      url: window.location.href
    }

    // Web Share API対応チェック
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData)
    } else {
      // フォールバック: URLをクリップボードにコピー
      await navigator.clipboard.writeText(window.location.href)
      alert('結果のURLをクリップボードにコピーしました')
    }
  } catch (error) {
    console.error('Share failed:', error)
    
    // 最終フォールバック: 簡単なテキストコピー
    try {
      const shareText = `HaQei 分析結果\n整合性スコア: ${tripleOSResult.value.consistencyScore}%\n${window.location.href}`
      await navigator.clipboard.writeText(shareText)
      alert('分析結果をクリップボードにコピーしました')
    } catch (clipboardError) {
      console.error('Clipboard access failed:', clipboardError)
      alert('シェア機能が利用できません')
    }
  }
}

function startNewAnalysis() {
  analysisStore.clearData()
  router.push('/questions')
}

function saveResults() {
  // Results are already saved in localStorage
  // Could implement additional save functionality
  alert('結果が保存されました')
}

function handleDimensionClick(dimension: { name: string; score: number }) {
  console.log('Dimension clicked:', dimension)
  // Could show detailed analysis for this dimension
}

function handleOSClick(os: { name: string; hexagram: string; percentage: number }) {
  console.log('OS clicked:', os)
  // Could show detailed OS information
}
</script>

<style scoped>
.results-view {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 2rem 0;
}

.results-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.header-content h1 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.timestamp {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* Main Content */
.results-main {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* Sections */
section {
  background: var(--bg-surface);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 1.5rem;
  background: var(--primary-color);
  border-radius: 2px;
}

/* Footer */
.results-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .results-container {
    padding: 0 2rem;
  }
  
  .results-main {
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .results-view {
    padding: 1rem 0;
  }
  
  .results-container {
    padding: 0 1rem;
  }
  
  .results-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
  }
  
  .header-content h1 {
    font-size: 1.75rem;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .results-main {
    gap: 2rem;
  }
  
  section {
    padding: 1.5rem;
    border-radius: 8px;
  }
  
  .section-title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .section-title::before {
    width: 3px;
    height: 1.25rem;
  }
  
  .results-footer {
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
  }
}

@media (max-width: 480px) {
  .results-view {
    padding: 0.5rem 0;
  }
  
  .results-container {
    padding: 0 0.75rem;
  }
  
  .header-content h1 {
    font-size: 1.5rem;
  }
  
  .timestamp {
    font-size: 0.8rem;
  }
  
  section {
    padding: 1rem;
    border-radius: 6px;
  }
  
  .section-title {
    font-size: 1.125rem;
    margin-bottom: 0.75rem;
  }
  
  .results-main {
    gap: 1.5rem;
  }
  
  .results-footer {
    margin-top: 1.5rem;
    padding-top: 1rem;
  }
}

/* Grid adjustments for charts */
@media (max-width: 768px) {
  .chart-section,
  .radar-section,
  .os-distribution-section {
    overflow-x: auto;
  }
  
  .chart-section canvas,
  .radar-section canvas,
  .os-distribution-section canvas {
    max-width: 100%;
    height: auto !important;
  }
}

/* Touch optimizations */
@media (hover: none) and (pointer: coarse) {
  .header-actions button,
  .results-footer button {
    min-height: 44px;
    padding: 0.75rem 1.5rem;
  }
}
</style>