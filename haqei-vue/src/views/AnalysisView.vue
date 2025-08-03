<template>
  <div class="analysis-view">
    <div class="container">
      <!-- Loading State -->
      <div v-if="isAnalyzing" class="analysis-loading">
        <HSpinner size="large" />
        <h2>分析中...</h2>
        <p>あなたの回答を解析しています</p>
      </div>

      <!-- Results -->
      <div v-else-if="analysisResult" class="analysis-results">
        <div class="results-header">
          <h1>分析完了</h1>
          <p class="timestamp">{{ formattedTimestamp }}</p>
        </div>

        <!-- Primary Hexagram -->
        <HCard class="hexagram-card">
          <h2>あなたのプライマリ卦</h2>
          <div class="hexagram-display">
            <div class="hexagram-number">{{ analysisResult.primaryHexagram }}</div>
            <div class="hexagram-name">{{ hexagramName }}</div>
          </div>
          <div class="compatibility">
            <span class="label">一致度:</span>
            <span class="value">{{ analysisResult.compatibility }}%</span>
          </div>
        </HCard>

        <!-- Dimension Scores -->
        <HCard class="dimensions-card">
          <h2>8次元スコア</h2>
          <div class="dimension-list">
            <div 
              v-for="[dimension, score] in dimensionEntries" 
              :key="dimension"
              class="dimension-item"
            >
              <div class="dimension-info">
                <span class="dimension-name">{{ dimension }}</span>
                <span class="dimension-score">{{ formatScore(score) }}</span>
              </div>
              <div class="dimension-bar">
                <div 
                  class="dimension-fill" 
                  :style="{ width: getBarWidth(score) + '%' }"
                  :class="getDimensionClass(dimension)"
                ></div>
              </div>
            </div>
          </div>
        </HCard>

        <!-- Actions -->
        <div class="actions">
          <HButton 
            variant="primary" 
            size="large"
            @click="viewDetailedResults"
          >
            詳細結果を見る
          </HButton>
          <HButton 
            variant="secondary" 
            size="large"
            @click="startNewAnalysis"
          >
            新しい分析を開始
          </HButton>
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="no-results">
        <h2>分析結果がありません</h2>
        <p>まず質問に回答してください</p>
        <HButton 
          variant="primary" 
          size="large"
          @click="startAnalysis"
        >
          分析を開始
        </HButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useAnalysisStore } from '@/stores/analysis'
import HCard from '@/components/common/HCard.vue'
import HButton from '@/components/common/HButton.vue'
import HSpinner from '@/components/common/HSpinner.vue'

const router = useRouter()
const analysisStore = useAnalysisStore()

// Computed properties
const isAnalyzing = computed(() => analysisStore.isAnalyzing)
const analysisResult = computed(() => analysisStore.analysisResult)

const formattedTimestamp = computed(() => {
  if (!analysisResult.value) return ''
  return format(new Date(analysisResult.value.timestamp), 'yyyy年MM月dd日 HH:mm', { locale: ja })
})

const dimensionEntries = computed(() => {
  if (!analysisResult.value) return []
  return Array.from(analysisResult.value.dimensionScores.entries())
})

// Hexagram mapping (simplified)
const hexagramNames: Record<number, string> = {
  1: '乾（天）',
  2: '坤（地）',
  29: '坎（水）',
  30: '離（火）',
  51: '震（雷）',
  52: '艮（山）',
  57: '巽（風）',
  58: '兌（沢）'
}

const hexagramName = computed(() => {
  if (!analysisResult.value) return ''
  return hexagramNames[analysisResult.value.primaryHexagram] || '未知'
})

// Methods
function formatScore(score: number): string {
  return score.toFixed(1)
}

function getBarWidth(score: number): number {
  // Normalize score to 0-100 range
  // Assuming scores range from -50 to 50
  const normalized = ((score + 50) / 100) * 100
  return Math.max(0, Math.min(100, normalized))
}

function getDimensionClass(dimension: string): string {
  const classes: Record<string, string> = {
    '乾_創造性': 'dimension-creative',
    '震_行動性': 'dimension-active',
    '坎_探求性': 'dimension-explore',
    '艮_安定性': 'dimension-stable',
    '坤_受容性': 'dimension-receptive',
    '巽_適応性': 'dimension-adaptive',
    '離_表現性': 'dimension-expressive',
    '兌_調和性': 'dimension-harmonious'
  }
  return classes[dimension] || ''
}

function viewDetailedResults() {
  router.push('/results')
}

function startNewAnalysis() {
  analysisStore.clearData()
  router.push('/questions')
}

function startAnalysis() {
  router.push('/questions')
}
</script>

<style scoped>
.analysis-view {
  min-height: 100vh;
  padding: 2rem 0;
  background: var(--bg-primary);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Loading State */
.analysis-loading {
  text-align: center;
  padding: 4rem 0;
}

.analysis-loading h2 {
  margin-top: 2rem;
  color: var(--text-primary);
}

.analysis-loading p {
  color: var(--text-secondary);
}

/* Results */
.results-header {
  text-align: center;
  margin-bottom: 2rem;
}

.results-header h1 {
  margin-bottom: 0.5rem;
}

.timestamp {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Hexagram Card */
.hexagram-card {
  text-align: center;
  margin-bottom: 2rem;
}

.hexagram-display {
  margin: 2rem 0;
}

.hexagram-number {
  font-size: 4rem;
  font-weight: bold;
  color: var(--primary-color);
  line-height: 1;
}

.hexagram-name {
  font-size: 1.5rem;
  margin-top: 0.5rem;
}

.compatibility {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border-radius: 2rem;
}

.compatibility .label {
  color: var(--text-secondary);
}

.compatibility .value {
  font-weight: bold;
  color: var(--primary-color);
}

/* Dimensions Card */
.dimensions-card {
  margin-bottom: 2rem;
}

.dimension-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.dimension-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dimension-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dimension-name {
  font-weight: 500;
}

.dimension-score {
  font-weight: bold;
  color: var(--primary-color);
}

.dimension-bar {
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.dimension-fill {
  height: 100%;
  transition: width 0.5s ease;
  border-radius: 4px;
}

/* Dimension Colors */
.dimension-creative { background: #FF6B6B; }
.dimension-active { background: #4ECDC4; }
.dimension-explore { background: #45B7D1; }
.dimension-stable { background: #96CEB4; }
.dimension-receptive { background: #DDA0DD; }
.dimension-adaptive { background: #FFD93D; }
.dimension-expressive { background: #FF8C94; }
.dimension-harmonious { background: #6C5CE7; }

/* Actions */
.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 3rem;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 4rem 0;
}

.no-results h2 {
  margin-bottom: 1rem;
}

.no-results p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .actions {
    flex-direction: column;
  }
  
  .hexagram-number {
    font-size: 3rem;
  }
}
</style>