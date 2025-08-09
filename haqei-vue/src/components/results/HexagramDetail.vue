<template>
  <div class="hexagram-detail">
    <div class="hexagram-main">
      <HexagramVisualization
        :hexagram-id="hexagramId"
        size="large"
        :show-info="false"
        :show-trigram-labels="true"
        :show-trigram-separator="true"
        :animated="true"
        @hexagram-click="handleHexagramClick"
      />
      
      <div class="hexagram-content">
        <div class="hexagram-header">
          <h3 class="hexagram-number">第{{ hexagramId }}卦</h3>
          <h4 class="hexagram-name">{{ hexagramData?.nameJp }}</h4>
          <p class="hexagram-reading">{{ hexagramData?.reading }}</p>
        </div>
        
        <div class="hexagram-catchphrase">
          {{ hexagramData?.catchphrase }}
        </div>
        
        <div class="hexagram-description">
          <p>{{ hexagramData?.description }}</p>
        </div>
        
        <div class="hexagram-keywords">
          <span class="keywords-label">キーワード:</span>
          <div class="keyword-tags">
            <span 
              v-for="keyword in keywords" 
              :key="keyword"
              class="keyword-tag"
            >
              {{ keyword }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="trigramEnergies" class="trigram-energies">
      <h4>八卦エネルギー分布</h4>
      <div class="energy-bars">
        <div 
          v-for="[trigram, energy] in sortedEnergies" 
          :key="trigram"
          class="energy-item"
        >
          <div class="energy-label">
            <span class="trigram-name">{{ trigram }}</span>
            <span class="energy-value">{{ energy.toFixed(0) }}</span>
          </div>
          <div class="energy-bar">
            <div 
              class="energy-fill"
              :style="{ width: energy + '%' }"
              :class="getEnergyClass(trigram)"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import HexagramVisualization from '../hexagram/HexagramVisualization.vue'
import { getHexagramById } from '@/data/hexagrams'

// Props
const props = defineProps({
  hexagramId: {
    type: Number,
    required: true
  },
  hexagramName: {
    type: String,
    required: true
  },
  trigramEnergies: {
    type: Object as PropType<Record<string, number>>,
    default: () => ({})
  }
})

// Computed
const hexagramData = computed(() => getHexagramById(props.hexagramId))

const keywords = computed(() => 
  hexagramData.value?.keywords.split(',').map(k => k.trim()) || []
)

const sortedEnergies = computed(() => {
  if (!props.trigramEnergies) return []
  return Object.entries(props.trigramEnergies)
    .sort(([, a], [, b]) => b - a)
})

// Methods
function handleHexagramClick(event: any) {
  console.log('Hexagram clicked:', event)
  // Could emit event to parent or show additional details
}

function getEnergyClass(trigram: string): string {
  const colorMap: Record<string, string> = {
    '乾': 'energy-qian',
    '震': 'energy-zhen',
    '坎': 'energy-kan',
    '艮': 'energy-gen',
    '坤': 'energy-kun',
    '巽': 'energy-xun',
    '離': 'energy-li',
    '兌': 'energy-dui'
  }
  return colorMap[trigram] || ''
}
</script>

<style scoped>
.hexagram-detail {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Main Hexagram Display */
.hexagram-main {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
}

/* Hexagram Content */
.hexagram-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hexagram-header {
  text-align: left;
}

.hexagram-number {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.hexagram-name {
  font-size: 1.25rem;
  color: var(--text-primary);
  margin: 0.5rem 0;
}

.hexagram-reading {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Catchphrase */
.hexagram-catchphrase {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--primary-color);
  line-height: 1.5;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
}

/* Description */
.hexagram-description {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.hexagram-description p {
  margin: 0;
}

/* Keywords */
.hexagram-keywords {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.keywords-label {
  font-weight: 500;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.keyword-tag {
  padding: 0.25rem 0.75rem;
  background: var(--bg-secondary);
  border-radius: 1rem;
  font-size: 0.9rem;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

/* Trigram Energies */
.trigram-energies {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1.5rem;
}

.trigram-energies h4 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.energy-bars {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.energy-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.energy-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.trigram-name {
  color: var(--text-primary);
  font-weight: 500;
}

.energy-value {
  color: var(--text-secondary);
}

.energy-bar {
  height: 6px;
  background: var(--bg-primary);
  border-radius: 3px;
  overflow: hidden;
}

.energy-fill {
  height: 100%;
  transition: width 0.5s ease;
  border-radius: 3px;
}

/* Energy Colors */
.energy-qian { background: #FF6B6B; }
.energy-zhen { background: #4ECDC4; }
.energy-kan { background: #45B7D1; }
.energy-gen { background: #96CEB4; }
.energy-kun { background: #DDA0DD; }
.energy-xun { background: #FFD93D; }
.energy-li { background: #FF8C94; }
.energy-dui { background: #6C5CE7; }

/* Responsive */
@media (max-width: 768px) {
  .hexagram-main {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
  
  .hexagram-content {
    width: 100%;
  }
  
  .hexagram-header {
    text-align: center;
  }
  
  .hexagram-keywords {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>