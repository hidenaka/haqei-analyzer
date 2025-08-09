<template>
  <div class="dimension-breakdown">
    <div 
      v-for="[dimension, score] in sortedDimensions" 
      :key="dimension"
      class="dimension-card"
    >
      <div class="dimension-header">
        <h4 class="dimension-name">{{ dimension }}</h4>
        <div class="dimension-score">
          <span class="score-value">{{ score.toFixed(1) }}</span>
          <span class="score-label">/ 100</span>
        </div>
      </div>
      
      <div class="dimension-bar">
        <div 
          class="dimension-fill"
          :style="{ width: getBarWidth(score) + '%' }"
          :class="getDimensionClass(dimension)"
        ></div>
      </div>
      
      <div class="dimension-interpretation">
        <p>{{ getDimensionInterpretation(dimension, score) }}</p>
      </div>
      
      <div class="dimension-traits">
        <span class="trait-label">特徴:</span>
        <div class="trait-tags">
          <span 
            v-for="trait in getDimensionTraits(dimension, score)" 
            :key="trait"
            class="trait-tag"
          >
            {{ trait }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'

// Props
const props = defineProps({
  dimensionScores: {
    type: Map as PropType<Map<string, number>>,
    required: true
  }
})

// Computed
const sortedDimensions = computed(() => {
  return Array.from(props.dimensionScores.entries())
    .sort(([, a], [, b]) => b - a)
})

// Methods
function getBarWidth(score: number): number {
  // Normalize score to 0-100 range
  return Math.max(0, Math.min(100, (score + 50)))
}

function getDimensionClass(dimension: string): string {
  const classes: Record<string, string> = {
    '乾_創造性': 'fill-creative',
    '震_行動性': 'fill-active',
    '坎_探求性': 'fill-explore',
    '艮_安定性': 'fill-stable',
    '坤_受容性': 'fill-receptive',
    '巽_適応性': 'fill-adaptive',
    '離_表現性': 'fill-expressive',
    '兌_調和性': 'fill-harmonious'
  }
  return classes[dimension] || ''
}

function getDimensionInterpretation(dimension: string, score: number): string {
  const interpretations: Record<string, { high: string, medium: string, low: string }> = {
    '乾_創造性': {
      high: '強い創造性とリーダーシップを持ち、新しいアイデアを生み出す力に優れています。',
      medium: 'バランスの取れた創造性を持ち、必要に応じて革新的な発想ができます。',
      low: '慎重で現実的な思考を好み、実績のある方法を重視する傾向があります。'
    },
    '震_行動性': {
      high: '積極的で行動力があり、迅速な決断と実行力を持っています。',
      medium: '状況に応じて行動できる柔軟性を持ち、計画的に物事を進められます。',
      low: '慎重で思慮深く、じっくりと考えてから行動する傾向があります。'
    },
    '坎_探求性': {
      high: '知的好奇心が強く、深い洞察力と分析力を持っています。',
      medium: '必要に応じて深く探求でき、実用的な知識を求めます。',
      low: '実践的で具体的なものを好み、抽象的な探求よりも実用性を重視します。'
    },
    '艮_安定性': {
      high: '安定志向が強く、一貫性と信頼性を重視します。',
      medium: '安定と変化のバランスを取り、状況に応じて対応できます。',
      low: '変化を好み、新しい環境や挑戦を求める傾向があります。'
    },
    '坤_受容性': {
      high: '高い受容性と包容力を持ち、他者を支援することに喜びを感じます。',
      medium: '適度な受容性を持ち、自他のバランスを保てます。',
      low: '独立心が強く、自己の判断と価値観を重視します。'
    },
    '巽_適応性': {
      high: '高い適応力と柔軟性を持ち、様々な状況に対応できます。',
      medium: '必要に応じて適応でき、自分のペースも大切にします。',
      low: '自分のスタイルを貫き、一貫性を重視する傾向があります。'
    },
    '離_表現性': {
      high: '豊かな表現力と発信力を持ち、自己表現に優れています。',
      medium: '適度な表現力を持ち、必要に応じて自己表現ができます。',
      low: '控えめで内省的、深い思考を大切にする傾向があります。'
    },
    '兌_調和性': {
      high: '高い協調性と調和を重視し、人間関係を大切にします。',
      medium: 'バランスの取れた協調性を持ち、状況に応じて対応します。',
      low: '独立性を重視し、自己の価値観に基づいて行動します。'
    }
  }
  
  const interpretation = interpretations[dimension]
  if (!interpretation) return ''
  
  if (score >= 70) return interpretation.high
  if (score >= 30) return interpretation.medium
  return interpretation.low
}

function getDimensionTraits(dimension: string, score: number): string[] {
  const traits: Record<string, { high: string[], medium: string[], low: string[] }> = {
    '乾_創造性': {
      high: ['革新的', 'リーダーシップ', '先見性'],
      medium: ['創意工夫', 'バランス感覚', '実用的'],
      low: ['慎重', '現実的', '堅実']
    },
    '震_行動性': {
      high: ['即断即決', '実行力', '積極的'],
      medium: ['計画的', '柔軟', '効率的'],
      low: ['熟慮', '慎重', '着実']
    },
    '坎_探求性': {
      high: ['分析的', '洞察力', '知的'],
      medium: ['実用的探求', 'バランス', '効率重視'],
      low: ['実践的', '具体的', '現実重視']
    },
    '艮_安定性': {
      high: ['一貫性', '信頼性', '継続力'],
      medium: ['適応的安定', 'バランス', '柔軟'],
      low: ['変化志向', '挑戦的', '革新的']
    },
    '坤_受容性': {
      high: ['包容力', '共感力', '支援的'],
      medium: ['バランス', '適度な距離', '協力的'],
      low: ['独立的', '自律的', '主体的']
    },
    '巽_適応性': {
      high: ['柔軟', '多様性', '変化対応'],
      medium: ['状況判断', 'バランス', '選択的適応'],
      low: ['一貫性', '信念', '独自性']
    },
    '離_表現性': {
      high: ['発信力', '創造的表現', '影響力'],
      medium: ['適切な表現', 'バランス', '状況対応'],
      low: ['内省的', '深慮', '控えめ']
    },
    '兌_調和性': {
      high: ['協調的', '円滑', '人間関係重視'],
      medium: ['バランス', '状況判断', '適応的'],
      low: ['独立的', '自己確立', '個性重視']
    }
  }
  
  const trait = traits[dimension]
  if (!trait) return []
  
  if (score >= 70) return trait.high
  if (score >= 30) return trait.medium
  return trait.low
}
</script>

<style scoped>
.dimension-breakdown {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.dimension-card {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s ease;
}

.dimension-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Header */
.dimension-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.dimension-name {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 0;
}

.dimension-score {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.score-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.score-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* Progress Bar */
.dimension-bar {
  height: 8px;
  background: var(--bg-primary);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.dimension-fill {
  height: 100%;
  transition: width 0.5s ease;
  border-radius: 4px;
}

/* Fill Colors */
.fill-creative { background: #FF6B6B; }
.fill-active { background: #4ECDC4; }
.fill-explore { background: #45B7D1; }
.fill-stable { background: #96CEB4; }
.fill-receptive { background: #DDA0DD; }
.fill-adaptive { background: #FFD93D; }
.fill-expressive { background: #FF8C94; }
.fill-harmonious { background: #6C5CE7; }

/* Interpretation */
.dimension-interpretation {
  margin-bottom: 1rem;
}

.dimension-interpretation p {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0;
}

/* Traits */
.dimension-traits {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.trait-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.trait-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.trait-tag {
  padding: 0.25rem 0.75rem;
  background: var(--bg-primary);
  border-radius: 1rem;
  font-size: 0.85rem;
  color: var(--text-primary);
}

/* Responsive */
@media (max-width: 768px) {
  .dimension-breakdown {
    grid-template-columns: 1fr;
  }
}
</style>