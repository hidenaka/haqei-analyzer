<template>
  <div class="base-chart" :style="containerStyle">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, type PropType } from 'vue'
import { Chart, type ChartType, type ChartData, type ChartOptions, registerables } from 'chart.js'
import { getChartAnimationOptions, updateChartWithAnimation } from '@/utils/chartAnimations'

// Register all Chart.js components
Chart.register(...registerables)

// Props
const props = defineProps({
  type: {
    type: String as PropType<ChartType>,
    required: true
  },
  data: {
    type: Object as PropType<ChartData>,
    required: true
  },
  options: {
    type: Object as PropType<ChartOptions>,
    default: () => ({})
  },
  width: {
    type: [Number, String],
    default: '100%'
  },
  height: {
    type: [Number, String],
    default: '300px'
  },
  plugins: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  animationType: {
    type: String as PropType<'default' | 'fade' | 'slide' | 'scale' | 'none'>,
    default: 'default'
  },
  enableInteractions: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['chart-click', 'chart-hover'])

// Refs
const chartCanvas = ref<HTMLCanvasElement>()
let chartInstance: Chart | null = null

// Computed
const containerStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  position: 'relative' as const
}))

// Default options based on chart type
const defaultOptions = computed((): ChartOptions => {
  const base: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            family: 'var(--font-family-base)'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || ''
            const value = context.parsed.y ?? context.parsed
            return `${label}: ${value}`
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'xy' as const,
      intersect: false
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        emit('chart-click', { event, elements })
      }
    },
    onHover: (event, elements) => {
      if (chartCanvas.value) {
        chartCanvas.value.style.cursor = elements.length > 0 ? 'pointer' : 'default'
      }
      emit('chart-hover', { event, elements })
    }
  }

  // Type-specific defaults
  if (props.type === 'bar') {
    return {
      ...base,
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              size: 11
            }
          }
        }
      }
    }
  } else if (props.type === 'line') {
    return {
      ...base,
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      },
      elements: {
        line: {
          tension: 0.4
        }
      }
    }
  } else if (props.type === 'doughnut' || props.type === 'pie') {
    return {
      ...base,
      plugins: {
        ...base.plugins,
        legend: {
          ...(base.plugins?.legend as any),
          position: 'bottom' as const
        }
      }
    }
  }

  return base
})

// Merged options
const mergedOptions = computed(() => {
  // Get animation options based on chart type
  const animationOptions = props.animationType !== 'none' 
    ? getChartAnimationOptions(props.type, props.options)
    : { animation: false }

  // Merge all options
  const merged = {
    ...defaultOptions.value,
    ...animationOptions,
    ...props.options,
    plugins: {
      ...(defaultOptions.value as any).plugins,
      ...(animationOptions as any).plugins,
      ...(props.options as any)?.plugins
    }
  }

  // Disable animations if requested
  if (props.animationType === 'none') {
    merged.animation = false
  }

  return merged
})

// Methods
function createChart() {
  if (!chartCanvas.value) return
  
  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  // Create new chart
  chartInstance = new Chart(ctx, {
    type: props.type,
    data: props.data,
    options: mergedOptions.value as any,
    plugins: props.plugins
  })
}

function updateChart() {
  if (!chartInstance) {
    createChart()
    return
  }

  // Use animated update if enabled
  if (props.animationType !== 'none' && props.animationType !== 'default') {
    updateChartWithAnimation(chartInstance, props.data, props.animationType as 'fade' | 'slide' | 'scale')
  } else {
    // Standard update
    chartInstance.data = props.data
    chartInstance.options = mergedOptions.value as any
    chartInstance.update('active')
  }
}

// Lifecycle
onMounted(() => {
  createChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})

// Watchers
watch(() => props.type, () => {
  createChart()
})

watch(() => props.data, () => {
  updateChart()
}, { deep: true })

watch(() => props.options, () => {
  updateChart()
}, { deep: true })

// Expose chart instance for external access
defineExpose({
  chartInstance: () => chartInstance,
  update: updateChart,
  destroy: () => {
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }
  }
})
</script>

<style scoped>
.base-chart {
  display: flex;
  align-items: center;
  justify-content: center;
}

.base-chart canvas {
  max-width: 100%;
  max-height: 100%;
}
</style>