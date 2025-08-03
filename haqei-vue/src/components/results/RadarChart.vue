<template>
  <div class="radar-chart-container">
    <canvas ref="chartCanvas"></canvas>
    <div class="chart-legend">
      <div 
        v-for="item in dimensionScores" 
        :key="item.dimension"
        class="legend-item"
      >
        <span class="legend-color" :style="{ background: getDimensionColor(item.dimension) }"></span>
        <span class="legend-label">{{ item.dimension }}</span>
        <span class="legend-value">{{ item.score.toFixed(1) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, type PropType } from 'vue'
import Chart from 'chart.js/auto'

// Props
const props = defineProps({
  dimensionScores: {
    type: Array as PropType<Array<{
      dimension: string
      score: number
    }>>,
    required: true
  }
})

// Refs
const chartCanvas = ref<HTMLCanvasElement>()
let chartInstance: Chart | null = null

// Methods
function getDimensionColor(dimension: string): string {
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
  return colorMap[dimension] || '#666666'
}

function createChart() {
  if (!chartCanvas.value) return
  
  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy()
  }

  const labels = props.dimensionScores.map(item => item.dimension)
  const data = props.dimensionScores.map(item => item.score)
  const backgroundColor = props.dimensionScores.map(item => getDimensionColor(item.dimension) + '40')
  const borderColor = props.dimensionScores.map(item => getDimensionColor(item.dimension))

  chartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        label: '8次元スコア',
        data,
        backgroundColor: backgroundColor[0],
        borderColor: borderColor[0],
        borderWidth: 2,
        pointBackgroundColor: borderColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: borderColor,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.label}: ${context.parsed.r.toFixed(1)}`
            }
          }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20,
            font: {
              size: 10
            }
          },
          pointLabels: {
            font: {
              size: 12
            },
            color: '#666'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  })
}

// Lifecycle
onMounted(() => {
  createChart()
})

watch(() => props.dimensionScores, () => {
  createChart()
}, { deep: true })
</script>

<style scoped>
.radar-chart-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

canvas {
  max-width: 500px;
  max-height: 500px;
  width: 100%;
  height: auto;
}

/* Legend */
.chart-legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  width: 100%;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--bg-secondary);
  border-radius: 6px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.legend-value {
  font-weight: bold;
  color: var(--primary-color);
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .chart-legend {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.5rem;
  }
  
  .legend-item {
    padding: 0.25rem 0.5rem;
  }
}
</style>