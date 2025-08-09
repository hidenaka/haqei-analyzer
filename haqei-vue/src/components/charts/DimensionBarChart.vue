<template>
  <div class="dimension-bar-chart">
    <h3 v-if="title" class="chart-title">{{ title }}</h3>
    <BaseChart
      type="bar"
      :data="chartData"
      :options="chartOptions"
      :height="height"
      @chart-click="handleChartClick"
    />
    <div v-if="showLegend" class="dimension-legend">
      <div 
        v-for="(dimension, index) in dimensions" 
        :key="dimension.name"
        class="legend-item"
        @click="toggleDimension(index)"
      >
        <span 
          class="legend-color" 
          :style="{ 
            backgroundColor: dimension.visible ? getColor(dimension.name) : '#ccc',
            opacity: dimension.visible ? 1 : 0.5
          }"
        ></span>
        <span class="legend-label" :style="{ opacity: dimension.visible ? 1 : 0.5 }">
          {{ dimension.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import BaseChart from './BaseChart.vue'
import type { ChartData, ChartOptions } from 'chart.js'

// Props
const props = defineProps({
  dimensionScores: {
    type: Map as PropType<Map<string, number>>,
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
    default: false
  },
  horizontal: {
    type: Boolean,
    default: false
  },
  animated: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['dimension-click'])

// Data
const dimensions = ref(
  Array.from(props.dimensionScores.entries()).map(([name, score]) => ({
    name,
    score,
    visible: true
  }))
)

// Color mapping
const colorMap: Record<string, string> = {
  '乾_創造性': '#FF6B6B',
  '震_行動性': '#4ECDC4',
  '坎_探求性': '#45B7D1',
  '艮_安定性': '#96CEB4',
  '坤_受容性': '#DDA0DD',
  '巽_適応性': '#FFD93D',
  '離_表現性': '#FF8C94',
  '兌_調和性': '#6C5CE7'
}

// Methods
function getColor(dimension: string): string {
  return colorMap[dimension] || '#666666'
}

function toggleDimension(index: number) {
  dimensions.value[index].visible = !dimensions.value[index].visible
}

function handleChartClick(event: any) {
  if (event.elements.length > 0) {
    const element = event.elements[0]
    const dimension = dimensions.value[element.index]
    emit('dimension-click', dimension)
  }
}

// Computed
const chartData = computed((): ChartData<'bar'> => {
  const visibleDimensions = dimensions.value.filter(d => d.visible)
  
  return {
    labels: visibleDimensions.map(d => d.name),
    datasets: [{
      label: '8次元スコア',
      data: visibleDimensions.map(d => d.score),
      backgroundColor: visibleDimensions.map(d => getColor(d.name) + 'CC'),
      borderColor: visibleDimensions.map(d => getColor(d.name)),
      borderWidth: 2,
      borderRadius: 4,
      borderSkipped: false
    }]
  }
})

const chartOptions = computed((): ChartOptions<'bar'> => {
  return {
    indexAxis: props.horizontal ? 'y' : 'x',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.parsed.y ?? context.parsed.x} / 100`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: !props.horizontal
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          display: props.horizontal,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          stepSize: 20,
          font: {
            size: 11
          }
        }
      }
    },
    animation: props.animated ? {
      duration: 1000,
      easing: 'easeOutQuart'
    } : false
  }
})
</script>

<style scoped>
.dimension-bar-chart {
  width: 100%;
}

.chart-title {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  text-align: center;
  color: var(--text-primary);
}

/* Legend */
.dimension-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.legend-item:hover {
  opacity: 0.8;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.legend-label {
  font-size: 0.9rem;
  color: var(--text-primary);
  transition: opacity 0.2s ease;
}
</style>