<template>
  <div class="misalignment-indicator">
    <div class="indicator-header">
      <h3 class="indicator-title">システム整合性分析</h3>
      <div class="overall-score">
        <span class="score-value">{{ overallScore }}%</span>
        <span class="score-label">総合整合性</span>
      </div>
    </div>
    
    <!-- Risk Level Indicator -->
    <div class="risk-indicator">
      <div class="risk-meter">
        <div 
          class="risk-fill"
          :style="{ width: (100 - overallScore) + '%' }"
          :class="riskLevelClass"
        ></div>
        <div class="risk-markers">
          <span class="marker" style="left: 20%"></span>
          <span class="marker" style="left: 40%"></span>
          <span class="marker" style="left: 60%"></span>
          <span class="marker" style="left: 80%"></span>
        </div>
      </div>
      <div class="risk-labels">
        <span class="risk-label low">低リスク</span>
        <span class="risk-label medium">中リスク</span>
        <span class="risk-label high">高リスク</span>
        <span class="risk-label critical">要注意</span>
      </div>
    </div>
    
    <!-- Pair Analysis -->
    <div class="pair-analysis">
      <h4 class="analysis-title">個別関係性分析</h4>
      
      <div class="pair-charts">
        <div 
          v-for="pair in pairData" 
          :key="pair.id"
          class="pair-chart"
        >
          <div class="pair-header">
            <span class="pair-label">{{ pair.label }}</span>
            <span class="pair-score" :class="getScoreClass(pair.score)">
              {{ pair.score }}%
            </span>
          </div>
          
          <div class="pair-visual">
            <svg viewBox="0 0 200 100" class="pair-svg">
              <!-- Background circle -->
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e0e0e0"
                stroke-width="2"
              />
              <circle
                cx="150"
                cy="50"
                r="40"
                fill="none"
                stroke="#e0e0e0"
                stroke-width="2"
              />
              
              <!-- OS circles -->
              <circle
                cx="50"
                cy="50"
                r="40"
                :fill="pair.colors[0] + '20'"
                :stroke="pair.colors[0]"
                stroke-width="3"
              />
              <circle
                cx="150"
                cy="50"
                r="40"
                :fill="pair.colors[1] + '20'"
                :stroke="pair.colors[1]"
                stroke-width="3"
              />
              
              <!-- Connection line -->
              <line
                x1="90"
                y1="50"
                x2="110"
                y2="50"
                :stroke="getConnectionColor(pair.score)"
                stroke-width="3"
                stroke-dasharray="5,5"
                :opacity="pair.score / 100"
              />
              
              <!-- Icons -->
              <text x="50" y="55" text-anchor="middle" class="os-icon">
                {{ pair.icons[0] }}
              </text>
              <text x="150" y="55" text-anchor="middle" class="os-icon">
                {{ pair.icons[1] }}
              </text>
            </svg>
          </div>
          
          <div class="pair-description">
            {{ pair.description }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Misalignment Patterns -->
    <div class="pattern-analysis">
      <h4 class="analysis-title">不整合パターン分析</h4>
      
      <div class="patterns">
        <div 
          v-for="pattern in patterns" 
          :key="pattern.type"
          class="pattern-item"
          :class="{ active: pattern.detected }"
        >
          <div class="pattern-icon">
            <i :class="pattern.icon"></i>
          </div>
          <div class="pattern-content">
            <h5 class="pattern-name">{{ pattern.name }}</h5>
            <p class="pattern-description">{{ pattern.description }}</p>
            <div v-if="pattern.detected" class="pattern-advice">
              <strong>アドバイス:</strong> {{ pattern.advice }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recommendations -->
    <div class="recommendations">
      <h4 class="recommendations-title">
        <i class="icon-lightbulb"></i>
        統合への推奨事項
      </h4>
      
      <div class="recommendation-list">
        <div 
          v-for="(rec, index) in recommendations" 
          :key="index"
          class="recommendation-item"
        >
          <div class="recommendation-number">{{ index + 1 }}</div>
          <div class="recommendation-content">
            <h5>{{ rec.title }}</h5>
            <p>{{ rec.description }}</p>
            <div class="recommendation-actions">
              <span 
                v-for="action in rec.actions" 
                :key="action"
                class="action-tag"
              >
                {{ action }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'

/**
 * Triple OSの不整合（ミスアライメント）を視覚化
 * 
 * 目的：
 * - システム間の不整合度を直感的に表示
 * - リスクレベルの可視化
 * - 具体的な改善提案の提示
 * 
 * 処理内容：
 * 1. 総合整合性スコアの表示
 * 2. ペアごとの関係性分析
 * 3. 不整合パターンの検出
 * 4. 改善推奨事項の生成
 */

interface MisalignmentData {
  overallScore: number
  pairScores: {
    engineInterface: number
    engineSafeMode: number
    interfaceSafeMode: number
  }
  riskLevel: string
  analysis?: any
}

// Props
const props = defineProps({
  misalignmentData: {
    type: Object as PropType<MisalignmentData>,
    required: true
  }
})

// Computed
const overallScore = computed(() => Math.round(props.misalignmentData.overallScore))

const riskLevelClass = computed(() => {
  const score = overallScore.value
  if (score >= 80) return 'low'
  if (score >= 60) return 'medium'
  if (score >= 40) return 'high'
  return 'critical'
})

const pairData = computed(() => [
  {
    id: 'engine-interface',
    label: '価値観 ⇔ 社会的表現',
    score: Math.round(props.misalignmentData.pairScores.engineInterface),
    colors: ['#FF6B6B', '#4ECDC4'],
    icons: ['🎯', '🎭'],
    description: getDescription('engineInterface', props.misalignmentData.pairScores.engineInterface)
  },
  {
    id: 'engine-safemode',
    label: '価値観 ⇔ 防御反応',
    score: Math.round(props.misalignmentData.pairScores.engineSafeMode),
    colors: ['#FF6B6B', '#45B7D1'],
    icons: ['🎯', '🛡️'],
    description: getDescription('engineSafeMode', props.misalignmentData.pairScores.engineSafeMode)
  },
  {
    id: 'interface-safemode',
    label: '社会的表現 ⇔ 防御反応',
    score: Math.round(props.misalignmentData.pairScores.interfaceSafeMode),
    colors: ['#4ECDC4', '#45B7D1'],
    icons: ['🎭', '🛡️'],
    description: getDescription('interfaceSafeMode', props.misalignmentData.pairScores.interfaceSafeMode)
  }
])

const patterns = computed(() => {
  const scores = props.misalignmentData.pairScores
  
  return [
    {
      type: 'authentic',
      name: '統合的人格',
      icon: 'icon-check-circle',
      description: '3つのシステムが高度に統合されています',
      detected: overallScore.value >= 80,
      advice: 'この統合性を維持し、さらに深めていきましょう'
    },
    {
      type: 'facade',
      name: '仮面症候群',
      icon: 'icon-mask',
      description: '社会的な顔と内なる自分に大きな乖離があります',
      detected: scores.engineInterface < 40,
      advice: '本音を安全に表現できる環境を見つけることが重要です'
    },
    {
      type: 'volatile',
      name: '不安定型',
      icon: 'icon-warning',
      description: 'ストレス下で予測不能な反応を示す可能性があります',
      detected: scores.engineSafeMode < 40 && scores.interfaceSafeMode < 40,
      advice: '自己観察を深め、反応パターンを理解することから始めましょう'
    },
    {
      type: 'adaptive',
      name: '適応型',
      icon: 'icon-shuffle',
      description: '状況に応じて柔軟に人格を切り替えています',
      detected: scores.engineInterface >= 60 && scores.interfaceSafeMode < 60,
      advice: 'この柔軟性は強みですが、自分の核を見失わないよう注意してください'
    }
  ]
})

const recommendations = computed(() => {
  const recs = []
  const scores = props.misalignmentData.pairScores
  
  // Engine-Interface recommendations
  if (scores.engineInterface < 60) {
    recs.push({
      title: '価値観と表現の一致を高める',
      description: '内なる価値観をより自然に表現できるよう、小さな一歩から始めましょう。',
      actions: ['日記を書く', '信頼できる人と対話', '小さな自己表現']
    })
  }
  
  // Engine-SafeMode recommendations
  if (scores.engineSafeMode < 60) {
    recs.push({
      title: 'ストレス管理の改善',
      description: 'ストレス下でも価値観を保持できるよう、対処法を身につけましょう。',
      actions: ['瞑想・マインドフルネス', 'ストレス日記', '休息の確保']
    })
  }
  
  // Interface-SafeMode recommendations
  if (scores.interfaceSafeMode < 60) {
    recs.push({
      title: '一貫性のある対人関係',
      description: '平常時と緊急時の振る舞いのギャップを認識し、調整しましょう。',
      actions: ['事前の説明', '信頼関係の構築', '自己開示']
    })
  }
  
  // General recommendation
  if (overallScore.value < 80) {
    recs.push({
      title: '統合的な自己理解',
      description: '3つのシステムを統合的に理解し、受け入れることが重要です。',
      actions: ['定期的な自己分析', 'フィードバックを求める', '成長の記録']
    })
  }
  
  return recs
})

// Methods
function getScoreClass(score: number): string {
  if (score >= 80) return 'high'
  if (score >= 60) return 'medium'
  if (score >= 40) return 'low'
  return 'critical'
}

function getConnectionColor(score: number): string {
  if (score >= 80) return '#4CAF50'
  if (score >= 60) return '#FFC107'
  if (score >= 40) return '#FF9800'
  return '#F44336'
}

function getDescription(pairType: string, score: number): string {
  const descriptions: Record<string, Record<string, string>> = {
    engineInterface: {
      high: '価値観と社会的表現が調和しています',
      medium: '適度なバランスを保っています',
      low: '内面と外面にギャップがあります',
      critical: '大きな乖離が生じています'
    },
    engineSafeMode: {
      high: '価値観と防御反応が一致しています',
      medium: '状況に応じた適応をしています',
      low: 'ストレス下で価値観が揺らぎます',
      critical: '緊急時に別人格が現れます'
    },
    interfaceSafeMode: {
      high: '社会的振る舞いが安定しています',
      medium: '柔軟な対応力を持っています',
      low: 'ストレスで社会性が変化します',
      critical: '極端な人格変化が起きます'
    }
  }
  
  let level = 'critical'
  if (score >= 80) level = 'high'
  else if (score >= 60) level = 'medium'
  else if (score >= 40) level = 'low'
  
  return descriptions[pairType]?.[level] || ''
}
</script>

<style scoped>
.misalignment-indicator {
  width: 100%;
}

/* Header */
.indicator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.indicator-title {
  font-size: 1.25rem;
  color: var(--text-primary);
  margin: 0;
}

.overall-score {
  text-align: center;
}

.score-value {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-color);
  line-height: 1;
}

.score-label {
  display: block;
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

/* Risk Indicator */
.risk-indicator {
  margin-bottom: 2rem;
}

.risk-meter {
  position: relative;
  height: 40px;
  background: var(--bg-secondary);
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.risk-fill {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  transition: all 0.5s ease;
}

.risk-fill.low {
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
}

.risk-fill.medium {
  background: linear-gradient(90deg, #FFC107, #FFD54F);
}

.risk-fill.high {
  background: linear-gradient(90deg, #FF9800, #FFB74D);
}

.risk-fill.critical {
  background: linear-gradient(90deg, #F44336, #EF5350);
}

.risk-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 20%;
}

.marker {
  width: 2px;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
}

.risk-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.risk-label {
  flex: 1;
  text-align: center;
  color: var(--text-secondary);
}

/* Pair Analysis */
.pair-analysis {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.analysis-title {
  font-size: 1.1rem;
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
}

.pair-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.pair-chart {
  background: var(--bg-surface);
  border-radius: 8px;
  padding: 1rem;
}

.pair-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.pair-label {
  font-size: 0.9rem;
  color: var(--text-primary);
  font-weight: 500;
}

.pair-score {
  font-size: 1.1rem;
  font-weight: bold;
}

.pair-score.high {
  color: #4CAF50;
}

.pair-score.medium {
  color: #FFC107;
}

.pair-score.low {
  color: #FF9800;
}

.pair-score.critical {
  color: #F44336;
}

.pair-visual {
  margin-bottom: 1rem;
}

.pair-svg {
  width: 100%;
  height: auto;
}

.os-icon {
  font-size: 24px;
  fill: currentColor;
}

.pair-description {
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-align: center;
}

/* Pattern Analysis */
.pattern-analysis {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.patterns {
  display: grid;
  gap: 1rem;
}

.pattern-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-surface);
  border-radius: 8px;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.pattern-item.active {
  opacity: 1;
  border-left: 4px solid var(--primary-color);
}

.pattern-icon {
  font-size: 2rem;
  color: var(--primary-color);
}

.pattern-content {
  flex: 1;
}

.pattern-name {
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.pattern-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
}

.pattern-advice {
  font-size: 0.85rem;
  color: var(--primary-color);
  padding: 0.5rem;
  background: var(--bg-secondary);
  border-radius: 4px;
}

/* Recommendations */
.recommendations {
  background: var(--bg-surface);
  border-radius: 12px;
  padding: 2rem;
}

.recommendations-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
}

.recommendation-list {
  display: grid;
  gap: 1.5rem;
}

.recommendation-item {
  display: flex;
  gap: 1rem;
}

.recommendation-number {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  font-weight: bold;
}

.recommendation-content h5 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.recommendation-content p {
  margin: 0 0 0.75rem 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

.recommendation-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.action-tag {
  padding: 0.25rem 0.75rem;
  background: var(--bg-secondary);
  border-radius: 1rem;
  font-size: 0.85rem;
  color: var(--text-primary);
}

/* Icons (placeholder) */
.icon-lightbulb::before {
  content: '💡';
}

.icon-check-circle::before {
  content: '✅';
}

.icon-mask::before {
  content: '🎭';
}

.icon-warning::before {
  content: '⚠️';
}

.icon-shuffle::before {
  content: '🔄';
}

/* Responsive */
@media (max-width: 768px) {
  .indicator-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .pair-charts {
    grid-template-columns: 1fr;
  }
  
  .recommendation-item {
    flex-direction: column;
    text-align: center;
  }
  
  .recommendation-number {
    margin: 0 auto;
  }
}
</style>