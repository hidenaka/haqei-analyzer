<template>
  <div class="triple-os-comparison">
    <h2 class="section-title">Triple OS 相互関係分析</h2>
    
    <!-- OS Overview Cards -->
    <div class="os-cards">
      <div 
        v-for="os in osData" 
        :key="os.type"
        class="os-card"
        :class="`os-${os.type}`"
        @click="selectOS(os.type)"
      >
        <div class="os-header">
          <h3 class="os-title">{{ os.label }}</h3>
          <span class="os-subtitle">{{ os.subtitle }}</span>
        </div>
        
        <HexagramVisualization
          :hexagram-id="os.hexagramId"
          size="small"
          :show-info="false"
          :animated="false"
        />
        
        <div class="os-details">
          <div class="hexagram-name">{{ os.hexagramName }}</div>
          <div class="match-score">
            <span class="score-label">一致度:</span>
            <span class="score-value">{{ os.matchingScore.toFixed(1) }}%</span>
          </div>
        </div>
        
        <div class="dominant-trigrams">
          <span class="trigram-label">主要な卦:</span>
          <div class="trigram-list">
            <span 
              v-for="trigram in os.dominantTrigrams" 
              :key="trigram"
              class="trigram-item"
            >
              {{ trigram }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Compatibility Matrix -->
    <div class="compatibility-section">
      <h3 class="subsection-title">システム間の整合性</h3>
      
      <div class="compatibility-matrix">
        <div class="matrix-row" v-for="(row, i) in compatibilityMatrix" :key="i">
          <div class="matrix-cell label">{{ row.label }}</div>
          <div 
            v-for="(cell, j) in row.cells" 
            :key="j"
            class="matrix-cell"
            :class="getCompatibilityClass(cell.score)"
          >
            <div v-if="cell.score !== null">
              <span class="score">{{ cell.score.toFixed(0) }}%</span>
              <span class="description">{{ cell.description }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="compatibility-legend">
        <div class="legend-item">
          <span class="legend-color high"></span>
          <span>高整合性 (80%以上)</span>
        </div>
        <div class="legend-item">
          <span class="legend-color medium"></span>
          <span>中整合性 (60-79%)</span>
        </div>
        <div class="legend-item">
          <span class="legend-color low"></span>
          <span>低整合性 (40-59%)</span>
        </div>
        <div class="legend-item">
          <span class="legend-color critical"></span>
          <span>要注意 (40%未満)</span>
        </div>
      </div>
    </div>
    
    <!-- Selected OS Comparison -->
    <transition name="fade-slide">
      <div v-if="selectedComparison" class="comparison-detail">
        <h3 class="subsection-title">
          {{ selectedComparison.title }}
        </h3>
        
        <HexagramComparison
          :primary-hexagram-id="selectedComparison.primary.hexagramId"
          :secondary-hexagram-id="selectedComparison.secondary.hexagramId"
          :primary-label="selectedComparison.primary.label"
          :secondary-label="selectedComparison.secondary.label"
          :comparison-type="selectedComparison.type"
          :show-analysis="true"
        />
        
        <div class="comparison-insights">
          <h4>関係性の洞察</h4>
          <p>{{ selectedComparison.insight }}</p>
          
          <div class="action-recommendations">
            <h5>推奨される行動</h5>
            <ul>
              <li v-for="(action, index) in selectedComparison.actions" :key="index">
                {{ action }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import HexagramVisualization from '../hexagram/HexagramVisualization.vue'
import HexagramComparison from '../hexagram/HexagramComparison.vue'
import type { TripleOSAnalysisResult } from '@/utils/tripleOSEngine'

/**
 * Triple OS間の関係性を視覚化するコンポーネント
 * 
 * 目的：
 * - 3つのOSの相互関係を表示
 * - 整合性スコアの視覚化
 * - OSペアの詳細比較
 * - 不整合の原因分析
 * 
 * 処理内容：
 * 1. 3つのOSカードを表示
 * 2. 整合性マトリックスを生成
 * 3. 選択されたペアの詳細比較
 * 4. 関係性の洞察と推奨事項
 * 
 * 副作用：
 * - os-selectイベントの発火
 * - comparison-changeイベントの発火
 */

// Props
const props = defineProps({
  tripleOSResult: {
    type: Object as PropType<TripleOSAnalysisResult>,
    required: true
  }
})

// State
const selectedPair = ref<[string, string] | null>(null)

// Computed
const osData = computed(() => [
  {
    type: 'engine',
    label: 'Engine OS',
    subtitle: '価値観システム',
    hexagramId: props.tripleOSResult.engineOS.hexagramId,
    hexagramName: props.tripleOSResult.engineOS.hexagramName,
    matchingScore: props.tripleOSResult.engineOS.matchingScore,
    dominantTrigrams: props.tripleOSResult.engineOS.dominantTrigrams || []
  },
  {
    type: 'interface',
    label: 'Interface OS',
    subtitle: '社会的システム',
    hexagramId: props.tripleOSResult.interfaceOS.hexagramId,
    hexagramName: props.tripleOSResult.interfaceOS.hexagramName,
    matchingScore: props.tripleOSResult.interfaceOS.matchingScore,
    dominantTrigrams: props.tripleOSResult.interfaceOS.dominantTrigrams || []
  },
  {
    type: 'safemode',
    label: 'SafeMode OS',
    subtitle: '防御システム',
    hexagramId: props.tripleOSResult.safeModeOS.hexagramId,
    hexagramName: props.tripleOSResult.safeModeOS.hexagramName,
    matchingScore: props.tripleOSResult.safeModeOS.matchingScore,
    dominantTrigrams: props.tripleOSResult.safeModeOS.dominantTrigrams || []
  }
])

const compatibilityMatrix = computed(() => {
  const misalignment = props.tripleOSResult.misalignmentData
  if (!misalignment) return []
  
  return [
    {
      label: 'Engine OS',
      cells: [
        { score: null, description: '' },
        { 
          score: misalignment.pairScores.engineInterface,
          description: getCompatibilityDescription(misalignment.pairScores.engineInterface)
        },
        { 
          score: misalignment.pairScores.engineSafeMode,
          description: getCompatibilityDescription(misalignment.pairScores.engineSafeMode)
        }
      ]
    },
    {
      label: 'Interface OS',
      cells: [
        { 
          score: misalignment.pairScores.engineInterface,
          description: getCompatibilityDescription(misalignment.pairScores.engineInterface)
        },
        { score: null, description: '' },
        { 
          score: misalignment.pairScores.interfaceSafeMode,
          description: getCompatibilityDescription(misalignment.pairScores.interfaceSafeMode)
        }
      ]
    },
    {
      label: 'SafeMode OS',
      cells: [
        { 
          score: misalignment.pairScores.engineSafeMode,
          description: getCompatibilityDescription(misalignment.pairScores.engineSafeMode)
        },
        { 
          score: misalignment.pairScores.interfaceSafeMode,
          description: getCompatibilityDescription(misalignment.pairScores.interfaceSafeMode)
        },
        { score: null, description: '' }
      ]
    }
  ]
})

const selectedComparison = computed(() => {
  if (!selectedPair.value) return null
  
  const [primary, secondary] = selectedPair.value
  const pairKey = `${primary}-${secondary}`
  
  const comparisons: Record<string, any> = {
    'engine-interface': {
      title: '価値観と社会的表現の関係',
      primary: osData.value.find(os => os.type === 'engine'),
      secondary: osData.value.find(os => os.type === 'interface'),
      type: 'relation',
      insight: getEngineInterfaceInsight(),
      actions: getEngineInterfaceActions()
    },
    'engine-safemode': {
      title: '価値観と防御反応の関係',
      primary: osData.value.find(os => os.type === 'engine'),
      secondary: osData.value.find(os => os.type === 'safemode'),
      type: 'contrast',
      insight: getEngineSafeModeInsight(),
      actions: getEngineSafeModeActions()
    },
    'interface-safemode': {
      title: '社会的表現と防御反応の関係',
      primary: osData.value.find(os => os.type === 'interface'),
      secondary: osData.value.find(os => os.type === 'safemode'),
      type: 'balance',
      insight: getInterfaceSafeModeInsight(),
      actions: getInterfaceSafeModeActions()
    }
  }
  
  return comparisons[pairKey] || null
})

// Methods
function selectOS(osType: string) {
  if (!selectedPair.value) {
    selectedPair.value = [osType, '']
  } else if (selectedPair.value[0] === osType) {
    selectedPair.value = null
  } else {
    selectedPair.value = [selectedPair.value[0], osType].sort() as [string, string]
  }
}

function getCompatibilityClass(score: number | null): string {
  if (score === null) return 'empty'
  if (score >= 80) return 'high'
  if (score >= 60) return 'medium'
  if (score >= 40) return 'low'
  return 'critical'
}

function getCompatibilityDescription(score: number): string {
  if (score >= 80) return '調和的'
  if (score >= 60) return '補完的'
  if (score >= 40) return '緊張感'
  return '要調整'
}

// Insight generation functions
function getEngineInterfaceInsight(): string {
  const score = props.tripleOSResult.misalignmentData?.pairScores.engineInterface || 0
  if (score >= 80) {
    return '内なる価値観と外への表現が高度に一致しています。あなたは自分に正直に生きており、表裏のない誠実な人格を形成しています。'
  } else if (score >= 60) {
    return '価値観と社会的表現の間に適度なバランスが保たれています。状況に応じて柔軟に対応しながらも、核となる価値は守っています。'
  } else {
    return '内なる価値観と社会的な振る舞いの間にギャップが存在します。本音と建前の使い分けに疲れを感じることがあるかもしれません。'
  }
}

function getEngineSafeModeInsight(): string {
  const score = props.tripleOSResult.misalignmentData?.pairScores.engineSafeMode || 0
  if (score >= 80) {
    return '価値観と防御反応が調和しています。ストレス下でも自分の信念を貫く強さを持っています。'
  } else if (score >= 60) {
    return '通常時と緊急時で異なる判断基準を持っています。これは適応的な反応であり、生存に有利な特性です。'
  } else {
    return 'ストレス時に本来の価値観とは異なる行動を取りやすい傾向があります。自己矛盾に悩むことがあるかもしれません。'
  }
}

function getInterfaceSafeModeInsight(): string {
  const score = props.tripleOSResult.misalignmentData?.pairScores.interfaceSafeMode || 0
  if (score >= 80) {
    return '社会的な振る舞いと防御反応が一貫しています。どんな状況でも安定した対人関係を維持できます。'
  } else if (score >= 60) {
    return '平常時と緊急時で異なる社会的戦略を使い分けています。状況適応力が高い証拠です。'
  } else {
    return 'ストレス下では普段とは全く異なる人格が現れる可能性があります。これは強力な防御機制の表れです。'
  }
}

// Action recommendation functions
function getEngineInterfaceActions(): string[] {
  const score = props.tripleOSResult.misalignmentData?.pairScores.engineInterface || 0
  if (score >= 80) {
    return [
      'この調和を維持するため、定期的な自己対話を続けましょう',
      '他者にも同じ誠実さを期待しすぎないよう注意してください',
      'あなたの一貫性は周囲に安心感を与えます'
    ]
  } else {
    return [
      '本音を安全に表現できる場所や人を見つけましょう',
      '価値観と行動のギャップを認識し、受け入れることから始めてください',
      '小さなことから、本当の自分を表現する練習をしてみましょう'
    ]
  }
}

function getEngineSafeModeActions(): string[] {
  const score = props.tripleOSResult.misalignmentData?.pairScores.engineSafeMode || 0
  if (score >= 80) {
    return [
      'ストレス管理の方法を維持・強化してください',
      '危機的状況でも価値観を見失わない強さを活かしましょう',
      '他者のストレス反応にも理解を示すことが大切です'
    ]
  } else {
    return [
      'ストレス時の自分の反応パターンを観察・記録してみましょう',
      '防御反応は生存のための重要な機能だと理解してください',
      'リラックスできる環境を意識的に作ることが重要です'
    ]
  }
}

function getInterfaceSafeModeActions(): string[] {
  const score = props.tripleOSResult.misalignmentData?.pairScores.interfaceSafeMode || 0
  if (score >= 80) {
    return [
      '安定した対人関係スキルを維持・向上させてください',
      '他者の緊急時の変化にも寛容になることが大切です',
      'あなたの安定性は周囲にとって大きな支えとなります'
    ]
  } else {
    return [
      'ストレス下での自分の変化を事前に周囲に伝えておくと良いでしょう',
      '防御モードに入った時のサインを自覚しましょう',
      '信頼できる人に、両方の自分を受け入れてもらうことが大切です'
    ]
  }
}
</script>

<style scoped>
.triple-os-comparison {
  width: 100%;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: var(--text-primary);
  text-align: center;
}

/* OS Cards */
.os-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.os-card {
  background: var(--bg-surface);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.os-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.os-card.os-engine {
  border-color: var(--color-engine, #FF6B6B);
}

.os-card.os-interface {
  border-color: var(--color-interface, #4ECDC4);
}

.os-card.os-safemode {
  border-color: var(--color-safemode, #45B7D1);
}

.os-header {
  text-align: center;
  margin-bottom: 1rem;
}

.os-title {
  font-size: 1.2rem;
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
}

.os-subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.os-details {
  margin-top: 1rem;
  text-align: center;
}

.hexagram-name {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.match-score {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.score-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.score-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--primary-color);
}

.dominant-trigrams {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.trigram-label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.trigram-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.trigram-item {
  padding: 0.25rem 0.75rem;
  background: var(--bg-secondary);
  border-radius: 1rem;
  font-size: 0.85rem;
  color: var(--text-primary);
}

/* Compatibility Section */
.compatibility-section {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.subsection-title {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.compatibility-matrix {
  display: grid;
  grid-template-columns: 150px repeat(3, 1fr);
  gap: 1px;
  background: var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.matrix-row {
  display: contents;
}

.matrix-cell {
  background: var(--bg-surface);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 80px;
}

.matrix-cell.label {
  font-weight: 500;
  color: var(--text-primary);
  background: var(--bg-secondary);
}

.matrix-cell.empty {
  background: var(--bg-secondary);
}

.matrix-cell.high {
  background: rgba(76, 175, 80, 0.1);
}

.matrix-cell.medium {
  background: rgba(255, 193, 7, 0.1);
}

.matrix-cell.low {
  background: rgba(255, 152, 0, 0.1);
}

.matrix-cell.critical {
  background: rgba(244, 67, 54, 0.1);
}

.matrix-cell .score {
  display: block;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.matrix-cell .description {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Compatibility Legend */
.compatibility-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.legend-color.high {
  background: rgba(76, 175, 80, 0.3);
}

.legend-color.medium {
  background: rgba(255, 193, 7, 0.3);
}

.legend-color.low {
  background: rgba(255, 152, 0, 0.3);
}

.legend-color.critical {
  background: rgba(244, 67, 54, 0.3);
}

/* Comparison Detail */
.comparison-detail {
  background: var(--bg-surface);
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
}

.comparison-insights {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.comparison-insights h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.comparison-insights p {
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.action-recommendations h5 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.action-recommendations ul {
  margin: 0;
  padding-left: 1.5rem;
}

.action-recommendations li {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .os-cards {
    grid-template-columns: 1fr;
  }
  
  .compatibility-matrix {
    grid-template-columns: 100px repeat(3, 1fr);
    font-size: 0.9rem;
  }
  
  .matrix-cell {
    padding: 0.5rem;
    min-height: 60px;
  }
  
  .compatibility-legend {
    gap: 1rem;
    font-size: 0.9rem;
  }
}
</style>