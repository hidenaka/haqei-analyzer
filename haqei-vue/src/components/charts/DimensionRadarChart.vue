<template>
  <div class="dimension-radar-chart">
    <h3 v-if="title" class="chart-title">{{ title }}</h3>
    <div class="chart-wrapper">
      <BaseChart
        type="radar"
        :data="chartData"
        :options="chartOptions"
        :height="size"
        :width="size"
        :enable-interactions="true"
        @chart-click="handleChartClick"
        @chart-hover="handleChartHover"
      />
    </div>
    <div v-if="selectedDimension" class="dimension-detail">
      <h4>{{ selectedDimension.name }}</h4>
      <p class="dimension-score">スコア: {{ selectedDimension.score }}%</p>
      <p class="dimension-description">{{ getDimensionDescription(selectedDimension.name) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import BaseChart from './BaseChart.vue'
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js'

/**
 * レーダーチャートで8次元の特性を視覚化
 * 
 * 目的：
 * - 8つの次元の相対的な強さを一目で把握
 * - インタラクティブな操作で詳細情報を表示
 * - アニメーション効果で視覚的な魅力を向上
 * 
 * 処理内容：
 * 1. 8次元のスコアをレーダーチャートにマッピング
 * 2. ホバー時に各次元の詳細情報を表示
 * 3. クリックで選択した次元の詳細解説を表示
 * 4. 滑らかなアニメーションで表示
 * 
 * 副作用：
 * - dimension-clickイベントの発火
 * - selectedDimensionの状態更新
 */

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
  size: {
    type: [Number, String],
    default: 500
  },
  showBackground: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['dimension-click', 'dimension-hover'])

// State
const selectedDimension = ref<{ name: string; score: number } | null>(null)

// Dimension metadata
const dimensionInfo: Record<string, { color: string; description: string }> = {
  '乾_創造性': {
    color: '#FF6B6B',
    description: '新しいアイデアを生み出し、革新的な解決策を見つける力'
  },
  '震_行動性': {
    color: '#4ECDC4',
    description: '積極的に行動し、実行に移す推進力'
  },
  '坎_探求性': {
    color: '#45B7D1',
    description: '深く考察し、真理を追求する探究心'
  },
  '艮_安定性': {
    color: '#96CEB4',
    description: '一貫性を保ち、着実に物事を進める安定力'
  },
  '坤_受容性': {
    color: '#DDA0DD',
    description: '他者を受け入れ、柔軟に対応する包容力'
  },
  '巽_適応性': {
    color: '#FFD93D',
    description: '状況に応じて柔軟に変化する適応力'
  },
  '離_表現性': {
    color: '#FF8C94',
    description: '自己を表現し、他者と共有する発信力'
  },
  '兌_調和性': {
    color: '#6C5CE7',
    description: '全体のバランスを考え、調和を生み出す力'
  }
}

// Helper functions
function getDimensionDescription(dimension: string): string {
  return dimensionInfo[dimension]?.description || ''
}

// Chart data
const chartData = computed((): ChartData<'radar'> => {
  const labels = Array.from(props.dimensionScores.keys())
  const data = Array.from(props.dimensionScores.values())
  
  return {
    labels,
    datasets: [{
      label: '8次元特性',
      data,
      backgroundColor: 'rgba(74, 144, 226, 0.2)',
      borderColor: '#4A90E2',
      borderWidth: 2,
      pointBackgroundColor: labels.map(label => dimensionInfo[label]?.color || '#666'),
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointHoverBorderWidth: 3
    }]
  }
})

// Chart options
const chartOptions = computed((): ChartOptions<'radar'> => {
  return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'radar'>) => {
            const dimension = context.label || ''
            const score = context.parsed.r
            return `${dimension}: ${score}%`
          },
          afterLabel: (context: TooltipItem<'radar'>) => {
            const dimension = context.label || ''
            return getDimensionDescription(dimension)
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
            size: 11
          },
          callback: (value) => `${value}%`
        },
        grid: {
          circular: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        pointLabels: {
          font: {
            size: 13,
            weight: '500'
          },
          callback: (label) => {
            // ラベルを短縮表示
            return label.split('_')[1] || label
          }
        }
      }
    },
    animation: {
      duration: 1200,
      easing: 'easeOutQuart',
      animateRotate: false,
      animateScale: true
    },
    elements: {
      line: {
        tension: 0.15
      }
    },
    interaction: {
      mode: 'point',
      intersect: true
    }
  }
})

// Event handlers
function handleChartClick(event: any) {
  if (event.elements.length > 0) {
    const element = event.elements[0]
    const labels = Array.from(props.dimensionScores.keys())
    const scores = Array.from(props.dimensionScores.values())
    
    selectedDimension.value = {
      name: labels[element.index],
      score: scores[element.index]
    }
    
    emit('dimension-click', selectedDimension.value)
  }
}

function handleChartHover(event: any) {
  if (event.elements.length > 0) {
    const element = event.elements[0]
    const labels = Array.from(props.dimensionScores.keys())
    const scores = Array.from(props.dimensionScores.values())
    
    emit('dimension-hover', {
      name: labels[element.index],
      score: scores[element.index]
    })
  }
}
</script>

<style scoped>
.dimension-radar-chart {
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

.chart-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

/* Dimension Detail */
.dimension-detail {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  width: 100%;
  animation: fadeIn 0.3s ease;
}

.dimension-detail h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: var(--primary-color);
}

.dimension-score {
  margin: 0.5rem 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
}

.dimension-description {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .chart-wrapper {
    max-width: 100%;
  }
  
  .dimension-detail {
    max-width: 100%;
    padding: 1rem;
  }
}
</style>