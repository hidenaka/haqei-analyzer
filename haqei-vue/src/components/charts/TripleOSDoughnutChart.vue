<template>
  <div class="triple-os-doughnut-chart">
    <h3 v-if="title" class="chart-title">{{ title }}</h3>
    <div class="chart-container">
      <BaseChart
        type="doughnut"
        :data="chartData"
        :options="chartOptions"
        :height="size"
        :width="size"
        :plugins="plugins"
      />
      <div class="center-text">
        <span class="center-value">{{ consistencyScore }}%</span>
        <span class="center-label">整合性</span>
      </div>
    </div>
    <div class="os-details">
      <div 
        v-for="os in osData" 
        :key="os.name"
        class="os-item"
        @click="handleOSClick(os)"
      >
        <span 
          class="os-color" 
          :style="{ backgroundColor: os.color }"
        ></span>
        <div class="os-info">
          <span class="os-name">{{ os.name }}</span>
          <span class="os-hexagram">{{ os.hexagram }}</span>
        </div>
        <span class="os-percentage">{{ os.percentage.toFixed(1) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import BaseChart from './BaseChart.vue'
import type { ChartData, ChartOptions, Plugin } from 'chart.js'

// Props
const props = defineProps({
  engineOS: {
    type: Object as PropType<{
      hexagramId: number
      hexagramName: string
    }>,
    required: true
  },
  interfaceOS: {
    type: Object as PropType<{
      hexagramId: number
      hexagramName: string
    }>,
    required: true
  },
  safeModeOS: {
    type: Object as PropType<{
      hexagramId: number
      hexagramName: string
    }>,
    required: true
  },
  consistencyScore: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 300
  }
})

// Emits
const emit = defineEmits(['os-click'])

// OS Data
const osData = computed(() => {
  // Simple equal distribution for visualization
  // In real implementation, this could be based on actual usage or influence
  // const total = 100
  const engineWeight = 40
  const interfaceWeight = 35
  const safeModeWeight = 25

  return [
    {
      name: 'Engine OS',
      hexagram: `${props.engineOS.hexagramId}. ${props.engineOS.hexagramName}`,
      color: '#FF6B6B',
      percentage: engineWeight,
      value: engineWeight
    },
    {
      name: 'Interface OS',
      hexagram: `${props.interfaceOS.hexagramId}. ${props.interfaceOS.hexagramName}`,
      color: '#4ECDC4',
      percentage: interfaceWeight,
      value: interfaceWeight
    },
    {
      name: 'SafeMode OS',
      hexagram: `${props.safeModeOS.hexagramId}. ${props.safeModeOS.hexagramName}`,
      color: '#45B7D1',
      percentage: safeModeWeight,
      value: safeModeWeight
    }
  ]
})

// Chart data
const chartData = computed((): ChartData<'doughnut'> => {
  return {
    labels: osData.value.map(os => os.name),
    datasets: [{
      data: osData.value.map(os => os.value),
      backgroundColor: osData.value.map(os => os.color),
      borderWidth: 0,
      hoverOffset: 8
    }]
  }
})

// Chart options
const chartOptions = computed((): ChartOptions<'doughnut'> => {
  return {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const os = osData.value[context.dataIndex]
            return [
              `${os.name}: ${os.percentage}%`,
              os.hexagram
            ]
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: false,
      duration: 1500,
      easing: 'easeOutQuart'
    }
  }
})

// Center text plugin
const centerTextPlugin: Plugin<'doughnut'> = {
  id: 'centerText',
  beforeDraw: (_chart) => {
    // Center text is handled by CSS overlay
  }
}

const plugins = [centerTextPlugin]

// Methods
function handleOSClick(os: any) {
  emit('os-click', os)
}
</script>

<style scoped>
.triple-os-doughnut-chart {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-title {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  text-align: center;
  color: var(--text-primary);
}

/* Chart Container */
.chart-container {
  position: relative;
  display: inline-block;
}

/* Center Text */
.center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.center-value {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-color);
  line-height: 1;
}

.center-label {
  display: block;
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

/* OS Details */
.os-details {
  width: 100%;
  max-width: 400px;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.os-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.os-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.os-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.os-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.os-name {
  font-weight: 500;
  color: var(--text-primary);
}

.os-hexagram {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.os-percentage {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--primary-color);
}

/* Responsive */
@media (max-width: 480px) {
  .center-value {
    font-size: 2rem;
  }
  
  .os-details {
    max-width: 100%;
  }
}
</style>