<template>
  <div class="action-plans">
    <div class="plans-intro">
      <p>あなたの分析結果に基づいた、具体的な行動提案です。</p>
    </div>

    <div class="plans-grid">
      <!-- Short-term Actions -->
      <div class="plan-section short-term">
        <div class="section-header">
          <h4>短期アクション（1-2週間）</h4>
          <span class="section-icon">🎯</span>
        </div>
        <div class="action-items">
          <div 
            v-for="(action, index) in shortTermActions" 
            :key="`short-${index}`"
            class="action-item"
          >
            <span class="action-number">{{ index + 1 }}</span>
            <div class="action-content">
              <h5>{{ action.title }}</h5>
              <p>{{ action.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Medium-term Actions -->
      <div class="plan-section medium-term">
        <div class="section-header">
          <h4>中期アクション（1-3ヶ月）</h4>
          <span class="section-icon">📈</span>
        </div>
        <div class="action-items">
          <div 
            v-for="(action, index) in mediumTermActions" 
            :key="`medium-${index}`"
            class="action-item"
          >
            <span class="action-number">{{ index + 1 }}</span>
            <div class="action-content">
              <h5>{{ action.title }}</h5>
              <p>{{ action.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Long-term Actions -->
      <div class="plan-section long-term">
        <div class="section-header">
          <h4>長期アクション（3ヶ月以上）</h4>
          <span class="section-icon">🚀</span>
        </div>
        <div class="action-items">
          <div 
            v-for="(action, index) in longTermActions" 
            :key="`long-${index}`"
            class="action-item"
          >
            <span class="action-number">{{ index + 1 }}</span>
            <div class="action-content">
              <h5>{{ action.title }}</h5>
              <p>{{ action.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="action-tips">
      <h4>実行のヒント</h4>
      <ul>
        <li>まずは短期アクションから始めましょう</li>
        <li>無理せず、自分のペースで進めることが大切です</li>
        <li>定期的に振り返り、必要に応じて調整しましょう</li>
        <li>小さな成功を積み重ねることで、大きな変化につながります</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'

// Props
const props = defineProps({
  engineOS: {
    type: Object as PropType<{
      hexagramId: number
      hexagramName: string
      primaryTrigram: string
      secondaryTrigram: string
    }>,
    required: true
  },
  consistencyScore: {
    type: Number,
    required: true
  }
})

// Computed actions based on analysis
const shortTermActions = computed(() => {
  const actions = []
  
  // Based on primary trigram
  if (props.engineOS.primaryTrigram === '乾') {
    actions.push({
      title: '新しいプロジェクトの開始',
      description: 'あなたの創造性を活かせる小さなプロジェクトを始めてみましょう。'
    })
  } else if (props.engineOS.primaryTrigram === '坤') {
    actions.push({
      title: 'サポート活動への参加',
      description: '他者を支援する活動に参加し、受容性を活かしましょう。'
    })
  }
  
  // Based on consistency score
  if (props.consistencyScore < 60) {
    actions.push({
      title: '自己観察日記の開始',
      description: '内面と外面のギャップを観察する日記をつけてみましょう。'
    })
  }
  
  // Default action
  actions.push({
    title: '毎日の振り返り時間',
    description: '1日10分、今日の行動と感情を振り返る時間を作りましょう。'
  })
  
  return actions.slice(0, 3)
})

const mediumTermActions = computed(() => {
  const actions = []
  
  if (props.engineOS.secondaryTrigram === '震') {
    actions.push({
      title: '行動パターンの最適化',
      description: '自分の行動パターンを分析し、より効果的な方法を見つけましょう。'
    })
  } else if (props.engineOS.secondaryTrigram === '艮') {
    actions.push({
      title: '安定基盤の構築',
      description: '日常のルーティンを見直し、安定した基盤を作りましょう。'
    })
  }
  
  actions.push({
    title: 'スキル向上計画',
    description: 'あなたの強みを活かせるスキルを計画的に向上させましょう。'
  })
  
  actions.push({
    title: '人間関係の深化',
    description: '重要な人間関係をより深め、相互理解を促進しましょう。'
  })
  
  return actions.slice(0, 3)
})

const longTermActions = computed(() => {
  return [
    {
      title: 'ライフビジョンの明確化',
      description: 'あなたの価値観に基づいた長期的なビジョンを描きましょう。'
    },
    {
      title: 'Triple OSの統合',
      description: '3つのOSをより調和させ、統合された自己を目指しましょう。'
    },
    {
      title: '継続的な成長システム',
      description: '定期的な自己分析と改善のシステムを確立しましょう。'
    }
  ]
})
</script>

<style scoped>
.action-plans {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.plans-intro {
  text-align: center;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

/* Plans Grid */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.plan-section {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1.5rem;
  border-top: 3px solid transparent;
}

.short-term {
  border-top-color: #4ECDC4;
}

.medium-term {
  border-top-color: #FFD93D;
}

.long-term {
  border-top-color: #6C5CE7;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h4 {
  margin: 0;
  color: var(--text-primary);
}

.section-icon {
  font-size: 1.5rem;
}

/* Action Items */
.action-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 6px;
  transition: transform 0.2s ease;
}

.action-item:hover {
  transform: translateX(4px);
}

.action-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.action-content {
  flex: 1;
}

.action-content h5 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.action-content p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Tips */
.action-tips {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid var(--primary-color);
}

.action-tips h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.action-tips ul {
  margin: 0;
  padding-left: 1.5rem;
  color: var(--text-secondary);
}

.action-tips li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.action-tips li:last-child {
  margin-bottom: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }
}
</style>