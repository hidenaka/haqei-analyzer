<template>
  <div class="calculator-demo">
    <h2>Calculator Demo</h2>
    
    <!-- Input Section -->
    <div class="demo-section">
      <h3>Test Vector Input</h3>
      <div class="dimension-inputs">
        <div v-for="dimension in dimensions" :key="dimension" class="dimension-input">
          <label>{{ dimension }}:</label>
          <input 
            type="number" 
            v-model.number="testVector[dimension]" 
            min="0" 
            max="10"
            step="0.1"
          />
        </div>
      </div>
      
      <button @click="analyzeVector" :disabled="isCalculating" class="analyze-btn">
        {{ isCalculating ? '計算中...' : 'ベクトル分析' }}
      </button>
    </div>
    
    <!-- Results Section -->
    <div v-if="analysisResult" class="demo-section">
      <h3>分析結果</h3>
      
      <div class="result-item">
        <h4>トップ候補</h4>
        <ul>
          <li v-for="candidate in analysisResult.candidates" :key="candidate.osId">
            ID: {{ candidate.osId }} - 
            スコア: {{ (candidate.score * 100).toFixed(1) }}% 
            (類似度: {{ (candidate.similarity * 100).toFixed(1) }}%, 
            活性化: {{ (candidate.activation * 100).toFixed(1) }}%)
          </li>
        </ul>
      </div>
      
      <div class="result-item">
        <h4>統計情報</h4>
        <p>処理数: {{ analysisResult.statistics.totalProcessed }}</p>
        <p>有効候補: {{ analysisResult.statistics.validCandidates }}</p>
        <p>修正スコア: {{ analysisResult.statistics.correctedScores }}</p>
      </div>
    </div>
    
    <!-- Error Display -->
    <div v-if="calculationError" class="error-message">
      <p>エラー: {{ calculationError }}</p>
      <button @click="clearError">エラーをクリア</button>
    </div>
    
    <!-- Hexagram Line Analysis -->
    <div class="demo-section">
      <h3>爻位分析デモ</h3>
      <div class="hexagram-input">
        <label>六爻入力 (0=陰, 1=陽):</label>
        <div class="line-inputs">
          <input 
            v-for="i in 6" 
            :key="i"
            v-model.number="hexagramLines[i-1]" 
            type="number" 
            min="0" 
            max="1"
            class="line-input"
          />
        </div>
        <button @click="analyzeLines">爻関係分析</button>
      </div>
      
      <div v-if="lineAnalysis && !('error' in lineAnalysis)" class="line-results">
        <h4>応の関係</h4>
        <ul>
          <li v-for="corr in lineAnalysis.correspondence" :key="corr.positions.join('-')">
            {{ corr.names.join('と') }}: {{ corr.relationship }} - {{ corr.meaning }}
          </li>
        </ul>
        
        <h4>中正</h4>
        <p>{{ lineAnalysis.centrality.lowerCentral.name }}: 
          {{ lineAnalysis.centrality.lowerCentral.isCorrectPosition ? '正位' : '不正位' }}
        </p>
        <p>{{ lineAnalysis.centrality.upperCentral.name }}: 
          {{ lineAnalysis.centrality.upperCentral.isCorrectPosition ? '正位' : '不正位' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useCalculator } from '@/composables/useCalculator'
import type { UserVector, OSVector } from '@/utils/calculator'

// Composable
const {
  isCalculating,
  calculationError,
  analysisResult,
  analyzeOSCandidates,
  analyzeHexagramLines,
  clearError
} = useCalculator()

// Constants
const dimensions = [
  '乾_創造性',
  '震_行動性',
  '坎_探求性',
  '艮_安定性',
  '坤_受容性',
  '巽_適応性',
  '離_表現性',
  '兌_調和性'
]

// State
const testVector = reactive<UserVector>(
  dimensions.reduce((acc, dim) => {
    acc[dim] = 5
    return acc
  }, {} as UserVector)
)

const hexagramLines = ref([1, 0, 1, 0, 1, 0]) // Default alternating pattern
const lineAnalysis = ref<any>(null)

// Sample vectors for testing (in real app, these would come from data files)
const sampleVectors: { [key: string]: OSVector } = {
  '1': { // 乾卦
    '乾_創造性': 10,
    '震_行動性': 8,
    '坎_探求性': 6,
    '艮_安定性': 4,
    '坤_受容性': 2,
    '巽_適応性': 3,
    '離_表現性': 7,
    '兌_調和性': 5
  },
  '2': { // 坤卦
    '乾_創造性': 2,
    '震_行動性': 3,
    '坎_探求性': 4,
    '艮_安定性': 6,
    '坤_受容性': 10,
    '巽_適応性': 8,
    '離_表現性': 5,
    '兌_調和性': 7
  },
  '29': { // 坎卦
    '乾_創造性': 4,
    '震_行動性': 6,
    '坎_探求性': 10,
    '艮_安定性': 5,
    '坤_受容性': 6,
    '巽_適応性': 7,
    '離_表現性': 4,
    '兌_調和性': 5
  },
  '30': { // 離卦
    '乾_創造性': 7,
    '震_行動性': 5,
    '坎_探求性': 4,
    '艮_安定性': 3,
    '坤_受容性': 5,
    '巽_適応性': 6,
    '離_表現性': 10,
    '兌_調和性': 8
  }
}

// Methods
async function analyzeVector() {
  try {
    await analyzeOSCandidates(testVector, sampleVectors)
  } catch (error) {
    console.error('Analysis failed:', error)
  }
}

function analyzeLines() {
  lineAnalysis.value = analyzeHexagramLines(hexagramLines.value)
}
</script>

<style scoped>
.calculator-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.demo-section {
  background: var(--bg-secondary, #f5f5f5);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.dimension-inputs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.dimension-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dimension-input label {
  flex: 1;
  font-weight: 500;
}

.dimension-input input {
  width: 80px;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 4px;
}

.analyze-btn {
  background: var(--primary-color, #4f46e5);
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;
}

.analyze-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.analyze-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result-item {
  margin-bottom: 1.5rem;
}

.result-item h4 {
  margin-bottom: 0.5rem;
  color: var(--text-primary, #333);
}

.result-item ul {
  list-style: none;
  padding: 0;
}

.result-item li {
  padding: 0.5rem;
  background: white;
  margin-bottom: 0.25rem;
  border-radius: 4px;
}

.error-message {
  background: var(--error-bg, #fee);
  border: 1px solid var(--error-border, #fcc);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: var(--error-color, #c00);
}

.error-message button {
  margin-top: 0.5rem;
  background: var(--error-color, #c00);
  color: white;
  border: none;
  padding: 0.25rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.hexagram-input {
  margin-bottom: 1rem;
}

.line-inputs {
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.line-input {
  width: 40px;
  padding: 0.25rem;
  text-align: center;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 4px;
}

.line-results {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
}

.line-results h4 {
  margin-bottom: 0.5rem;
  color: var(--primary-color, #4f46e5);
}

.line-results ul {
  list-style: none;
  padding: 0;
}

.line-results li {
  padding: 0.25rem 0;
  border-bottom: 1px solid var(--border-color, #eee);
}

.line-results li:last-child {
  border-bottom: none;
}
</style>