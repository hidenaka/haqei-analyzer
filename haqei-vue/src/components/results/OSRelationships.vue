<template>
  <div class="os-relationships">
    <div class="relationship-overview">
      <div class="overall-score">
        <h4>全体的な整合性</h4>
        <div class="score-display">
          <span class="score-value">{{ misalignmentData.overallScore }}%</span>
          <span class="risk-level" :class="getRiskClass(misalignmentData.riskLevel)">
            {{ misalignmentData.riskLevel }}
          </span>
        </div>
      </div>
      
      <div class="relationship-grid">
        <div class="relationship-card">
          <div class="relationship-header">
            <span class="os-pair">Engine ↔ Interface</span>
            <span class="pair-score">{{ misalignmentData.pairScores.engineInterface }}%</span>
          </div>
          <div class="relationship-bar">
            <div 
              class="relationship-fill"
              :style="{ width: misalignmentData.pairScores.engineInterface + '%' }"
              :class="getScoreClass(misalignmentData.pairScores.engineInterface)"
            ></div>
          </div>
          <p class="relationship-description">
            価値観と社会的振る舞いの一致度
          </p>
        </div>

        <div class="relationship-card">
          <div class="relationship-header">
            <span class="os-pair">Engine ↔ SafeMode</span>
            <span class="pair-score">{{ misalignmentData.pairScores.engineSafeMode }}%</span>
          </div>
          <div class="relationship-bar">
            <div 
              class="relationship-fill"
              :style="{ width: misalignmentData.pairScores.engineSafeMode + '%' }"
              :class="getScoreClass(misalignmentData.pairScores.engineSafeMode)"
            ></div>
          </div>
          <p class="relationship-description">
            価値観と防御機制の調和度
          </p>
        </div>

        <div class="relationship-card">
          <div class="relationship-header">
            <span class="os-pair">Interface ↔ SafeMode</span>
            <span class="pair-score">{{ misalignmentData.pairScores.interfaceSafeMode }}%</span>
          </div>
          <div class="relationship-bar">
            <div 
              class="relationship-fill"
              :style="{ width: misalignmentData.pairScores.interfaceSafeMode + '%' }"
              :class="getScoreClass(misalignmentData.pairScores.interfaceSafeMode)"
            ></div>
          </div>
          <p class="relationship-description">
            社会的振る舞いと防御機制の連携度
          </p>
        </div>
      </div>
    </div>

    <div v-if="misalignmentData.analysis" class="analysis-insights">
      <h4>関係性の分析</h4>
      <div class="insight-content">
        {{ getRelationshipInsight() }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

// Props
const props = defineProps({
  misalignmentData: {
    type: Object as PropType<{
      overallScore: number
      pairScores: {
        engineInterface: number
        engineSafeMode: number
        interfaceSafeMode: number
      }
      riskLevel: string
      analysis?: any
    }>,
    required: true
  }
})

// Methods
function getRiskClass(riskLevel: string): string {
  const classMap: Record<string, string> = {
    '低リスク': 'risk-low',
    '中リスク': 'risk-medium',
    '高リスク': 'risk-high',
    '非常に高リスク': 'risk-very-high'
  }
  return classMap[riskLevel] || ''
}

function getScoreClass(score: number): string {
  if (score >= 80) return 'score-high'
  if (score >= 60) return 'score-medium'
  return 'score-low'
}

function getRelationshipInsight(): string {
  const { overallScore, pairScores } = props.misalignmentData
  
  if (overallScore >= 80) {
    return '3つのOSが高度に調和しており、内面と外面の一貫性が保たれています。自然体で行動でき、ストレスの少ない状態です。この調和を維持しながら、さらなる成長を目指しましょう。'
  } else if (overallScore >= 60) {
    return '適度なバランスが保たれており、状況に応じて柔軟に対応できる状態です。時に内面と外面のギャップを感じることもありますが、それが成長の機会となります。'
  } else {
    // Analyze which pair has the lowest score
    const lowestPair = Object.entries(pairScores).reduce((min, [key, value]) => 
      value < min.value ? { key, value } : min
    , { key: '', value: 100 })
    
    if (lowestPair.key === 'engineInterface') {
      return '価値観と社会的振る舞いの間にギャップがあります。本音と建前の使い分けに意識的になることで、より自然な自己表現が可能になります。'
    } else if (lowestPair.key === 'engineSafeMode') {
      return '価値観と防御機制の間に不一致があります。ストレス時に本来の価値観とは異なる行動を取りやすい傾向があります。自己理解を深めることが大切です。'
    } else {
      return '社会的振る舞いと防御機制の連携に課題があります。プレッシャー下での対応力を高めるために、自己観察を続けることをお勧めします。'
    }
  }
}
</script>

<style scoped>
.os-relationships {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Overview */
.relationship-overview {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.overall-score {
  text-align: center;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.overall-score h4 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.score-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.score-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.risk-level {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.risk-low {
  background: #4ECDC420;
  color: #4ECDC4;
}

.risk-medium {
  background: #FFD93D20;
  color: #FFB300;
}

.risk-high {
  background: #FF8C9420;
  color: #FF6B6B;
}

.risk-very-high {
  background: #FF6B6B20;
  color: #FF4444;
}

/* Relationship Grid */
.relationship-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.relationship-card {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1.25rem;
}

.relationship-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.os-pair {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.pair-score {
  font-weight: bold;
  color: var(--primary-color);
}

.relationship-bar {
  height: 6px;
  background: var(--bg-primary);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.relationship-fill {
  height: 100%;
  transition: width 0.5s ease;
  border-radius: 3px;
}

.score-high {
  background: #4ECDC4;
}

.score-medium {
  background: #FFD93D;
}

.score-low {
  background: #FF8C94;
}

.relationship-description {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Analysis Insights */
.analysis-insights {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1.5rem;
}

.analysis-insights h4 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.insight-content {
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Responsive */
@media (max-width: 768px) {
  .score-value {
    font-size: 2rem;
  }
  
  .relationship-grid {
    grid-template-columns: 1fr;
  }
}
</style>