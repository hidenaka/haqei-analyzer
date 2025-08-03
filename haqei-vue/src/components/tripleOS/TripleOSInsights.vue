<template>
  <div class="triple-os-insights">
    <h2 class="section-title">Triple OS 統合的洞察</h2>
    
    <!-- Overall Integration Status -->
    <div class="integration-status">
      <div class="status-card" :class="`status-${integrationLevel}`">
        <div class="status-icon">
          <i :class="statusIcon"></i>
        </div>
        <div class="status-content">
          <h3>{{ integrationTitle }}</h3>
          <p>{{ integrationDescription }}</p>
        </div>
        <div class="status-metrics">
          <div class="metric">
            <span class="metric-value">{{ consistencyScore }}%</span>
            <span class="metric-label">統合度</span>
          </div>
          <div class="metric">
            <span class="metric-value">{{ riskLevel }}</span>
            <span class="metric-label">リスク</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Key Insights -->
    <div class="key-insights">
      <h3 class="subsection-title">
        <i class="icon-key"></i>
        主要な洞察
      </h3>
      
      <div class="insight-cards">
        <div 
          v-for="(insight, index) in keyInsights" 
          :key="index"
          class="insight-card"
          :class="`insight-${insight.type}`"
        >
          <div class="insight-header">
            <span class="insight-number">{{ index + 1 }}</span>
            <h4>{{ insight.title }}</h4>
          </div>
          <p class="insight-content">{{ insight.content }}</p>
          <div v-if="insight.implications" class="insight-implications">
            <h5>影響と意味:</h5>
            <ul>
              <li v-for="(implication, i) in insight.implications" :key="i">
                {{ implication }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Dynamic Patterns -->
    <div class="dynamic-patterns">
      <h3 class="subsection-title">
        <i class="icon-pattern"></i>
        動的パターン分析
      </h3>
      
      <div class="pattern-grid">
        <div 
          v-for="pattern in dynamicPatterns" 
          :key="pattern.id"
          class="pattern-card"
        >
          <div class="pattern-visualization">
            <svg viewBox="0 0 200 200" class="pattern-svg">
              <!-- Pattern visualization -->
              <g v-if="pattern.type === 'flow'">
                <!-- Flow pattern -->
                <path
                  d="M 50 100 Q 100 50 150 100 T 150 150"
                  fill="none"
                  :stroke="pattern.color"
                  stroke-width="3"
                  opacity="0.8"
                />
                <circle
                  v-for="(node, i) in pattern.nodes"
                  :key="i"
                  :cx="node.x"
                  :cy="node.y"
                  r="8"
                  :fill="pattern.color"
                />
              </g>
              
              <g v-else-if="pattern.type === 'cycle'">
                <!-- Cycle pattern -->
                <circle
                  cx="100"
                  cy="100"
                  r="60"
                  fill="none"
                  :stroke="pattern.color"
                  stroke-width="3"
                  stroke-dasharray="10,5"
                  opacity="0.8"
                />
                <g v-for="(angle, i) in [0, 120, 240]" :key="i">
                  <circle
                    :cx="100 + 60 * Math.cos(angle * Math.PI / 180)"
                    :cy="100 + 60 * Math.sin(angle * Math.PI / 180)"
                    r="12"
                    :fill="pattern.colors[i]"
                  />
                </g>
              </g>
              
              <g v-else-if="pattern.type === 'balance'">
                <!-- Balance pattern -->
                <line x1="50" y1="150" x2="150" y2="150" stroke="#999" stroke-width="2"/>
                <polygon
                  points="100,150 80,170 120,170"
                  fill="#666"
                />
                <rect
                  :x="50 + pattern.balance * 100 - 10"
                  y="130"
                  width="20"
                  height="20"
                  :fill="pattern.color"
                  rx="2"
                />
              </g>
            </svg>
          </div>
          
          <div class="pattern-info">
            <h4>{{ pattern.name }}</h4>
            <p>{{ pattern.description }}</p>
            <div class="pattern-strength">
              <span class="strength-label">強度:</span>
              <div class="strength-bar">
                <div 
                  class="strength-fill"
                  :style="{ width: pattern.strength + '%' }"
                ></div>
              </div>
              <span class="strength-value">{{ pattern.strength }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Strategic Recommendations -->
    <div class="strategic-recommendations">
      <h3 class="subsection-title">
        <i class="icon-strategy"></i>
        戦略的推奨事項
      </h3>
      
      <div class="recommendation-timeline">
        <div 
          v-for="(phase, index) in strategicPhases" 
          :key="index"
          class="phase-card"
        >
          <div class="phase-header">
            <span class="phase-number">Phase {{ index + 1 }}</span>
            <h4>{{ phase.title }}</h4>
            <span class="phase-duration">{{ phase.duration }}</span>
          </div>
          
          <div class="phase-content">
            <p>{{ phase.description }}</p>
            
            <div class="phase-actions">
              <h5>具体的なアクション:</h5>
              <div class="action-list">
                <div 
                  v-for="(action, i) in phase.actions" 
                  :key="i"
                  class="action-item"
                >
                  <input 
                    type="checkbox" 
                    :id="`action-${index}-${i}`"
                    class="action-checkbox"
                  >
                  <label :for="`action-${index}-${i}`">
                    {{ action }}
                  </label>
                </div>
              </div>
            </div>
            
            <div v-if="phase.expectedOutcome" class="phase-outcome">
              <h5>期待される成果:</h5>
              <p>{{ phase.expectedOutcome }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Growth Potential -->
    <div class="growth-potential">
      <h3 class="subsection-title">
        <i class="icon-growth"></i>
        成長の可能性
      </h3>
      
      <div class="potential-visualization">
        <div class="current-state">
          <h4>現在の状態</h4>
          <div class="state-diagram">
            <div 
              v-for="os in currentState" 
              :key="os.type"
              class="os-node"
              :style="{ 
                left: os.x + '%', 
                top: os.y + '%',
                backgroundColor: os.color + '20',
                borderColor: os.color
              }"
            >
              <span class="os-label">{{ os.label }}</span>
              <span class="os-score">{{ os.score }}%</span>
            </div>
          </div>
        </div>
        
        <div class="growth-arrow">
          <i class="icon-arrow-right"></i>
        </div>
        
        <div class="potential-state">
          <h4>潜在的な統合状態</h4>
          <div class="state-diagram">
            <div 
              v-for="os in potentialState" 
              :key="os.type"
              class="os-node integrated"
              :style="{ 
                left: os.x + '%', 
                top: os.y + '%',
                backgroundColor: os.color + '40',
                borderColor: os.color
              }"
            >
              <span class="os-label">{{ os.label }}</span>
              <span class="os-score">{{ os.score }}%</span>
            </div>
            <div class="integration-center">
              <span>統合</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="growth-metrics">
        <div class="metric-card">
          <h5>統合による効果</h5>
          <ul>
            <li>意思決定の一貫性: <strong>+{{ improvementMetrics.consistency }}%</strong></li>
            <li>ストレス耐性: <strong>+{{ improvementMetrics.resilience }}%</strong></li>
            <li>対人関係の安定性: <strong>+{{ improvementMetrics.relationships }}%</strong></li>
            <li>自己実現度: <strong>+{{ improvementMetrics.selfActualization }}%</strong></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { TripleOSAnalysisResult } from '@/utils/tripleOSEngine'

/**
 * Triple OS統合に関する深い洞察を提供
 * 
 * 目的：
 * - 3つのOSの統合状態の総合評価
 * - 動的パターンの可視化
 * - 戦略的な成長推奨事項
 * - 潜在的な成長可能性の提示
 * 
 * 処理内容：
 * 1. 統合レベルの判定と表示
 * 2. 主要な洞察の抽出
 * 3. 動的パターンの分析
 * 4. 段階的な戦略提案
 * 5. 成長可能性の可視化
 */

// Props
const props = defineProps({
  tripleOSResult: {
    type: Object as PropType<TripleOSAnalysisResult>,
    required: true
  }
})

// Computed
const consistencyScore = computed(() => 
  Math.round(props.tripleOSResult.consistencyScore || 0)
)

const integrationLevel = computed(() => {
  const score = consistencyScore.value
  if (score >= 80) return 'excellent'
  if (score >= 60) return 'good'
  if (score >= 40) return 'moderate'
  return 'low'
})

const statusIcon = computed(() => {
  const level = integrationLevel.value
  const icons: Record<string, string> = {
    excellent: 'icon-star',
    good: 'icon-check-circle',
    moderate: 'icon-info-circle',
    low: 'icon-alert-circle'
  }
  return icons[level]
})

const integrationTitle = computed(() => {
  const level = integrationLevel.value
  const titles: Record<string, string> = {
    excellent: '優れた統合状態',
    good: '良好な統合状態',
    moderate: '改善の余地あり',
    low: '統合への取り組みが必要'
  }
  return titles[level]
})

const integrationDescription = computed(() => {
  const level = integrationLevel.value
  const descriptions: Record<string, string> = {
    excellent: '3つのシステムが高度に調和し、あなたの人格は統合されています。',
    good: 'システム間の連携は良好で、バランスの取れた状態です。',
    moderate: 'システム間に一定の不整合があり、調整により改善可能です。',
    low: '各システムが独立して動作しており、統合的なアプローチが推奨されます。'
  }
  return descriptions[level]
})

const riskLevel = computed(() => {
  const score = consistencyScore.value
  if (score >= 80) return '低'
  if (score >= 60) return '中'
  if (score >= 40) return '高'
  return '要注意'
})

const keyInsights = computed(() => {
  const insights = []
  const misalignment = props.tripleOSResult.misalignmentData
  
  if (!misalignment) return insights
  
  // Engine-Interface insight
  if (misalignment.pairScores.engineInterface < 60) {
    insights.push({
      type: 'warning',
      title: '価値観と表現のギャップ',
      content: '内なる価値観と社会的な表現の間に乖離が見られます。本音と建前の使い分けが負担となっている可能性があります。',
      implications: [
        '自己表現の場を見つけることが重要',
        '信頼できる人との対話を増やす',
        '小さな自己開示から始める'
      ]
    })
  }
  
  // Engine-SafeMode insight
  if (misalignment.pairScores.engineSafeMode < 60) {
    insights.push({
      type: 'info',
      title: 'ストレス時の価値観変化',
      content: 'プレッシャー下では本来の価値観とは異なる判断をする傾向があります。これは適応的な反応ですが、自己矛盾を感じる原因にもなります。',
      implications: [
        'ストレス管理方法の確立が必要',
        '緊急時の判断基準を事前に設定',
        '価値観の優先順位を明確化'
      ]
    })
  }
  
  // Interface-SafeMode insight
  if (misalignment.pairScores.interfaceSafeMode < 60) {
    insights.push({
      type: 'alert',
      title: '対人関係の一貫性',
      content: '平常時と緊急時で異なる人格が現れる傾向があります。これは強力な防御機制ですが、周囲を混乱させる可能性があります。',
      implications: [
        '自分の変化パターンを周囲に説明',
        '安全な環境での練習が有効',
        'セーフモードのトリガーを認識'
      ]
    })
  }
  
  // Positive insight
  if (consistencyScore.value >= 70) {
    insights.push({
      type: 'success',
      title: '統合への準備',
      content: 'あなたのシステムは統合に向けた良好な基盤を持っています。意識的な取り組みにより、さらなる成長が期待できます。',
      implications: [
        '現在の強みを活かす',
        '小さな改善の積み重ね',
        '定期的な自己観察の継続'
      ]
    })
  }
  
  return insights
})

const dynamicPatterns = computed(() => {
  const patterns = []
  const scores = props.tripleOSResult.misalignmentData?.pairScores
  
  if (!scores) return patterns
  
  // Flow pattern
  if (scores.engineInterface >= 70 && scores.interfaceSafeMode >= 70) {
    patterns.push({
      id: 'flow',
      type: 'flow',
      name: '流動的調和',
      description: '価値観が自然に表現され、ストレス時も安定した対応が可能です。',
      strength: Math.round((scores.engineInterface + scores.interfaceSafeMode) / 2),
      color: '#4ECDC4',
      nodes: [
        { x: 50, y: 100 },
        { x: 100, y: 50 },
        { x: 150, y: 100 }
      ]
    })
  }
  
  // Cycle pattern
  if (Math.abs(scores.engineInterface - scores.engineSafeMode) > 30) {
    patterns.push({
      id: 'cycle',
      type: 'cycle',
      name: '循環的適応',
      description: '状況に応じて異なるシステムが活性化する循環パターンです。',
      strength: 100 - Math.abs(scores.engineInterface - scores.engineSafeMode),
      color: '#FF6B6B',
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1']
    })
  }
  
  // Balance pattern
  const avgScore = (scores.engineInterface + scores.engineSafeMode + scores.interfaceSafeMode) / 3
  patterns.push({
    id: 'balance',
    type: 'balance',
    name: 'システムバランス',
    description: '3つのシステム間の全体的なバランス状態を示します。',
    strength: Math.round(avgScore),
    color: '#45B7D1',
    balance: avgScore / 100
  })
  
  return patterns
})

const strategicPhases = computed(() => {
  const phases = []
  const score = consistencyScore.value
  
  if (score < 60) {
    phases.push({
      title: '自己認識の深化',
      duration: '1-2週間',
      description: '各システムの動作パターンを観察し、理解を深めます。',
      actions: [
        '毎日の感情と行動の記録',
        'ストレス時の反応パターンの観察',
        '価値観の優先順位リストの作成'
      ],
      expectedOutcome: '自己理解の向上と気づきの増加'
    })
  }
  
  phases.push({
    title: '小さな統合実験',
    duration: '2-4週間',
    description: '安全な環境で、システム間の調和を促す小さな実験を行います。',
    actions: [
      '信頼できる人への段階的な自己開示',
      'ストレス管理技法の実践',
      '価値観に基づいた小さな行動の実施'
    ],
    expectedOutcome: 'システム間の連携強化'
  })
  
  phases.push({
    title: '統合の定着',
    duration: '1-3ヶ月',
    description: '新しいパターンを日常生活に組み込み、持続可能な統合を実現します。',
    actions: [
      '統合的な意思決定の練習',
      'フィードバックの積極的な活用',
      '成長の記録と振り返り'
    ],
    expectedOutcome: '安定した統合状態の確立'
  })
  
  return phases
})

const currentState = computed(() => [
  {
    type: 'engine',
    label: 'Engine',
    score: Math.round(props.tripleOSResult.engineOS.matchingScore),
    color: '#FF6B6B',
    x: 20,
    y: 20
  },
  {
    type: 'interface',
    label: 'Interface',
    score: Math.round(props.tripleOSResult.interfaceOS.matchingScore),
    color: '#4ECDC4',
    x: 60,
    y: 20
  },
  {
    type: 'safemode',
    label: 'SafeMode',
    score: Math.round(props.tripleOSResult.safeModeOS.matchingScore),
    color: '#45B7D1',
    x: 40,
    y: 60
  }
])

const potentialState = computed(() => [
  {
    type: 'engine',
    label: 'Engine',
    score: Math.min(100, Math.round(props.tripleOSResult.engineOS.matchingScore + 15)),
    color: '#FF6B6B',
    x: 35,
    y: 30
  },
  {
    type: 'interface',
    label: 'Interface',
    score: Math.min(100, Math.round(props.tripleOSResult.interfaceOS.matchingScore + 15)),
    color: '#4ECDC4',
    x: 45,
    y: 30
  },
  {
    type: 'safemode',
    label: 'SafeMode',
    score: Math.min(100, Math.round(props.tripleOSResult.safeModeOS.matchingScore + 15)),
    color: '#45B7D1',
    x: 40,
    y: 40
  }
])

const improvementMetrics = computed(() => ({
  consistency: Math.round(20 * (consistencyScore.value / 100)),
  resilience: Math.round(25 * (consistencyScore.value / 100)),
  relationships: Math.round(30 * (consistencyScore.value / 100)),
  selfActualization: Math.round(35 * (consistencyScore.value / 100))
}))
</script>

<style scoped>
.triple-os-insights {
  width: 100%;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: var(--text-primary);
  text-align: center;
}

/* Integration Status */
.integration-status {
  margin-bottom: 3rem;
}

.status-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 2rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.status-card.status-excellent {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.05);
}

.status-card.status-good {
  border-color: #2196F3;
  background: rgba(33, 150, 243, 0.05);
}

.status-card.status-moderate {
  border-color: #FFC107;
  background: rgba(255, 193, 7, 0.05);
}

.status-card.status-low {
  border-color: #FF9800;
  background: rgba(255, 152, 0, 0.05);
}

.status-icon {
  font-size: 3rem;
  color: var(--primary-color);
}

.status-content h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.status-content p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

.status-metrics {
  display: flex;
  gap: 2rem;
}

.metric {
  text-align: center;
}

.metric-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.metric-label {
  display: block;
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

/* Key Insights */
.key-insights {
  margin-bottom: 3rem;
}

.subsection-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.insight-cards {
  display: grid;
  gap: 1.5rem;
}

.insight-card {
  background: var(--bg-surface);
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid transparent;
}

.insight-card.insight-success {
  border-left-color: #4CAF50;
}

.insight-card.insight-info {
  border-left-color: #2196F3;
}

.insight-card.insight-warning {
  border-left-color: #FFC107;
}

.insight-card.insight-alert {
  border-left-color: #FF9800;
}

.insight-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.insight-number {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  font-weight: bold;
}

.insight-header h4 {
  margin: 0;
  color: var(--text-primary);
}

.insight-content {
  margin: 0 0 1rem 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

.insight-implications h5 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.insight-implications ul {
  margin: 0;
  padding-left: 1.5rem;
}

.insight-implications li {
  margin-bottom: 0.25rem;
  color: var(--text-secondary);
}

/* Dynamic Patterns */
.dynamic-patterns {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 3rem;
}

.pattern-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.pattern-card {
  background: var(--bg-surface);
  border-radius: 8px;
  padding: 1rem;
}

.pattern-visualization {
  margin-bottom: 1rem;
}

.pattern-svg {
  width: 100%;
  height: auto;
}

.pattern-info h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.pattern-info p {
  margin: 0 0 1rem 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.pattern-strength {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.strength-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.strength-bar {
  flex: 1;
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.5s ease;
}

.strength-value {
  font-size: 0.85rem;
  font-weight: bold;
  color: var(--primary-color);
}

/* Strategic Recommendations */
.strategic-recommendations {
  margin-bottom: 3rem;
}

.recommendation-timeline {
  display: grid;
  gap: 1.5rem;
}

.phase-card {
  background: var(--bg-surface);
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 4px solid var(--primary-color);
}

.phase-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.phase-number {
  padding: 0.25rem 0.75rem;
  background: var(--primary-color);
  color: white;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: bold;
}

.phase-header h4 {
  margin: 0;
  flex: 1;
  color: var(--text-primary);
}

.phase-duration {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.phase-content > p {
  margin: 0 0 1.5rem 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

.phase-actions h5,
.phase-outcome h5 {
  margin: 0 0 0.75rem 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.action-list {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.action-item label {
  cursor: pointer;
  color: var(--text-secondary);
  flex: 1;
}

.action-checkbox:checked + label {
  text-decoration: line-through;
  opacity: 0.7;
}

.phase-outcome p {
  margin: 0;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 0.75rem;
  border-radius: 4px;
}

/* Growth Potential */
.growth-potential {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 2rem;
}

.potential-visualization {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  align-items: center;
  margin-bottom: 2rem;
}

.current-state,
.potential-state {
  text-align: center;
}

.current-state h4,
.potential-state h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.state-diagram {
  position: relative;
  height: 200px;
  background: var(--bg-surface);
  border-radius: 8px;
  overflow: hidden;
}

.os-node {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.os-node:hover {
  transform: scale(1.1);
}

.os-label {
  font-size: 0.85rem;
  font-weight: bold;
  color: var(--text-primary);
}

.os-score {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.integration-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  opacity: 0.8;
}

.growth-arrow {
  font-size: 2rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.growth-metrics {
  margin-top: 2rem;
}

.metric-card {
  background: var(--bg-surface);
  border-radius: 8px;
  padding: 1.5rem;
}

.metric-card h5 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.metric-card ul {
  margin: 0;
  padding-left: 1.5rem;
}

.metric-card li {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.metric-card strong {
  color: var(--primary-color);
}

/* Icons (placeholder) */
.icon-key::before {
  content: '🔑';
}

.icon-pattern::before {
  content: '🔄';
}

.icon-strategy::before {
  content: '📋';
}

.icon-growth::before {
  content: '📈';
}

.icon-star::before {
  content: '⭐';
}

.icon-check-circle::before {
  content: '✅';
}

.icon-info-circle::before {
  content: 'ℹ️';
}

.icon-alert-circle::before {
  content: '⚠️';
}

.icon-arrow-right::before {
  content: '→';
}

/* Responsive */
@media (max-width: 768px) {
  .status-card {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .status-metrics {
    justify-content: center;
  }
  
  .pattern-grid {
    grid-template-columns: 1fr;
  }
  
  .potential-visualization {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .growth-arrow {
    transform: rotate(90deg);
  }
}
</style>