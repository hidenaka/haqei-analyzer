<template>
  <div class="integration-insights">
    <div 
      v-for="(insight, index) in insights" 
      :key="index"
      class="insight-card"
      :class="`insight-${insight.type}`"
    >
      <div class="insight-header">
        <i :class="getInsightIcon(insight.type)"></i>
        <h4>{{ insight.title }}</h4>
      </div>
      <div class="insight-content">
        <p>{{ insight.content }}</p>
      </div>
      <div v-if="insight.recommendations" class="insight-recommendations">
        <h5>推奨アクション:</h5>
        <ul>
          <li v-for="(rec, idx) in insight.recommendations" :key="idx">
            {{ rec }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

// Props
const props = defineProps({
  insights: {
    type: Array as PropType<Array<{
      type: string
      title: string
      content: string
      recommendations?: string[]
    }>>,
    required: true
  }
})

// Methods
function getInsightIcon(type: string): string {
  const iconMap: Record<string, string> = {
    'strength': 'icon-star',
    'opportunity': 'icon-lightbulb',
    'challenge': 'icon-alert',
    'balance': 'icon-balance',
    'growth': 'icon-trending-up',
    'harmony': 'icon-heart'
  }
  return iconMap[type] || 'icon-info'
}
</script>

<style scoped>
.integration-insights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.insight-card {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid transparent;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.insight-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Insight Types */
.insight-strength {
  border-left-color: #4ECDC4;
}

.insight-opportunity {
  border-left-color: #FFD93D;
}

.insight-challenge {
  border-left-color: #FF8C94;
}

.insight-balance {
  border-left-color: #6C5CE7;
}

.insight-growth {
  border-left-color: #96CEB4;
}

.insight-harmony {
  border-left-color: #DDA0DD;
}

/* Header */
.insight-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.insight-header i {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--bg-primary);
  color: var(--primary-color);
}

.insight-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

/* Content */
.insight-content {
  margin-bottom: 1rem;
}

.insight-content p {
  margin: 0;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Recommendations */
.insight-recommendations {
  background: var(--bg-primary);
  border-radius: 6px;
  padding: 1rem;
}

.insight-recommendations h5 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.insight-recommendations ul {
  margin: 0;
  padding-left: 1.25rem;
  list-style-type: none;
}

.insight-recommendations li {
  position: relative;
  padding-left: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.insight-recommendations li:last-child {
  margin-bottom: 0;
}

.insight-recommendations li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--primary-color);
}

/* Icons (placeholder styles) */
[class^="icon-"] {
  font-style: normal;
  font-weight: bold;
  font-size: 0.9rem;
}

.icon-star::before { content: '★'; }
.icon-lightbulb::before { content: '💡'; }
.icon-alert::before { content: '⚠'; }
.icon-balance::before { content: '⚖'; }
.icon-trending-up::before { content: '📈'; }
.icon-heart::before { content: '❤'; }
.icon-info::before { content: 'ℹ'; }

/* Responsive */
@media (max-width: 768px) {
  .integration-insights {
    grid-template-columns: 1fr;
  }
}
</style>