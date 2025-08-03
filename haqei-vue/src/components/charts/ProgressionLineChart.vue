<template>
  <div class="progression-line-chart">
    <h3 v-if="title" class="chart-title">{{ title }}</h3>
    <BaseChart
      type="line"
      :data="chartData"
      :options="chartOptions"
      :height="height"
      :enable-interactions="true"
      animation-type="fade"
      @chart-click="handleChartClick"
      @chart-hover="handleChartHover"
    />
    <div v-if="showLegend" class="custom-legend">
      <div 
        v-for="(dataset, index) in datasets"
        :key="dataset.label"
        class="legend-item"
        :class="{ disabled: !dataset.visible }"
        @click="toggleDataset(index)"
      >
        <span 
          class="legend-color" 
          :style="{ backgroundColor: dataset.borderColor }"
        ></span>
        <span class="legend-label">{{ dataset.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import BaseChart from './BaseChart.vue'
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js'

/**
 * 時系列データの変化を表示するラインチャート
 * 
 * 目的：
 * - 複数の指標の時間的変化を視覚化
 * - インタラクティブな操作で詳細情報を表示
 * - データセットの表示/非表示切り替え機能
 * 
 * 処理内容：
 * 1. 時系列データをラインチャートにマッピング
 * 2. 複数のデータセットを同時表示
 * 3. ホバー時にツールチップで詳細表示
 * 4. 凡例クリックでデータセット切り替え
 * 
 * 副作用：
 * - data-point-clickイベントの発火
 * - データセットの表示状態更新
 */

interface DataPoint {
  x: string | Date
  y: number
  metadata?: any
}

interface Dataset {
  label: string
  data: DataPoint[]
  borderColor: string
  backgroundColor?: string
  visible?: boolean
}

// Props
const props = defineProps({
  datasets: {
    type: Array as PropType<Dataset[]>,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  height: {
    type: [Number, String],
    default: 400
  },
  showLegend: {
    type: Boolean,
    default: true
  },
  xAxisLabel: {
    type: String,
    default: ''
  },
  yAxisLabel: {
    type: String,
    default: ''
  },
  enableArea: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['data-point-click', 'dataset-toggle'])

// State
const datasetVisibility = ref<boolean[]>(
  props.datasets.map(() => true)
)

// Computed
const visibleDatasets = computed(() => {
  return props.datasets.filter((_, index) => datasetVisibility.value[index])
})

const chartData = computed((): ChartData<'line'> => {
  // Get all unique x values from all datasets
  const allXValues = new Set<string>()
  props.datasets.forEach(dataset => {
    dataset.data.forEach(point => {
      allXValues.add(String(point.x))
    })
  })
  
  const labels = Array.from(allXValues).sort()
  
  const datasets = visibleDatasets.value.map(dataset => ({
    label: dataset.label,
    data: dataset.data.map(point => point.y),
    borderColor: dataset.borderColor,
    backgroundColor: props.enableArea 
      ? (dataset.backgroundColor || dataset.borderColor + '20')
      : 'transparent',
    borderWidth: 3,
    pointRadius: 5,
    pointHoverRadius: 7,
    pointBackgroundColor: dataset.borderColor,
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
    tension: 0.3,
    fill: props.enableArea
  }))
  
  return { labels, datasets }
})

const chartOptions = computed((): ChartOptions<'line'> => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: false // Using custom legend
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: TooltipItem<'line'>[]) => {
            return tooltipItems[0].label || ''
          },
          label: (context: TooltipItem<'line'>) => {
            const label = context.dataset.label || ''
            const value = context.parsed.y
            return `${label}: ${value.toFixed(1)}`
          },
          afterLabel: (context: TooltipItem<'line'>) => {
            // Show metadata if available
            const dataIndex = context.dataIndex
            const datasetIndex = context.datasetIndex
            const originalDataset = props.datasets[datasetIndex]
            if (originalDataset && originalDataset.data[dataIndex]?.metadata) {
              return `追加情報: ${originalDataset.data[dataIndex].metadata}`
            }
            return ''
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        title: {
          display: !!props.xAxisLabel,
          text: props.xAxisLabel,
          font: {
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        title: {
          display: !!props.yAxisLabel,
          text: props.yAxisLabel,
          font: {
            size: 12
          }
        },
        ticks: {
          callback: (value) => `${value}%`
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
      onProgress: (animation) => {
        const chart = animation.chart
        const ctx = chart.ctx
        
        // Add gradient effect during animation
        if (props.enableArea) {
          ctx.globalAlpha = animation.currentStep / animation.numSteps
        }
      },
      onComplete: (animation) => {
        const chart = animation.chart
        const ctx = chart.ctx
        ctx.globalAlpha = 1
      }
    }
  }
})

// Methods
function toggleDataset(index: number) {
  datasetVisibility.value[index] = !datasetVisibility.value[index]
  emit('dataset-toggle', {
    index,
    visible: datasetVisibility.value[index],
    dataset: props.datasets[index]
  })
}

function handleChartClick(event: any) {
  if (event.elements.length > 0) {
    const element = event.elements[0]
    const datasetIndex = element.datasetIndex
    const dataIndex = element.index
    const dataset = props.datasets[datasetIndex]
    const dataPoint = dataset.data[dataIndex]
    
    emit('data-point-click', {
      dataset: dataset.label,
      point: dataPoint,
      index: dataIndex
    })
  }
}

function handleChartHover(event: any) {
  // Could implement hover effects
}
</script>

<style scoped>
.progression-line-chart {
  width: 100%;
}

.chart-title {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  text-align: center;
  color: var(--text-primary);
}

/* Custom Legend */
.custom-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: var(--bg-secondary);
}

.legend-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.legend-item.disabled {
  opacity: 0.4;
}

.legend-color {
  width: 20px;
  height: 3px;
  border-radius: 2px;
  transition: all 0.2s ease;
}

.legend-item:not(.disabled) .legend-color {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8);
}

.legend-label {
  font-size: 0.9rem;
  color: var(--text-primary);
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .custom-legend {
    gap: 0.75rem;
  }
  
  .legend-item {
    padding: 0.25rem 0.75rem;
    font-size: 0.85rem;
  }
}
</style>