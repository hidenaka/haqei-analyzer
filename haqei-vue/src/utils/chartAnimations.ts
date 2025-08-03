/**
 * Chart.js用のアニメーションとインタラクション設定
 * 
 * 目的：
 * - チャートのアニメーション効果を統一管理
 * - インタラクティブな動作パターンを提供
 * - パフォーマンスを考慮した最適化設定
 */

import type { ChartOptions, AnimationSpec } from 'chart.js'

/**
 * デフォルトのアニメーション設定
 */
export const defaultAnimations = {
  // フェードイン効果
  fadeIn: {
    duration: 1000,
    easing: 'easeOutQuart' as const,
    delay: (context: any) => {
      let delay = 0
      if (context.type === 'data' && context.mode === 'default') {
        delay = context.dataIndex * 50 + context.datasetIndex * 100
      }
      return delay
    }
  },

  // スライドイン効果（左から）
  slideInLeft: {
    x: {
      duration: 1200,
      easing: 'easeOutCubic' as const,
      from: (context: any) => {
        if (context.type !== 'data' || !context.chart.chartArea) {
          return
        }
        return -context.chart.chartArea.width
      }
    }
  },

  // スライドイン効果（下から）
  slideInBottom: {
    y: {
      duration: 1200,
      easing: 'easeOutCubic' as const,
      from: (context: any) => {
        if (context.type !== 'data' || !context.chart.chartArea) {
          return
        }
        return context.chart.chartArea.bottom
      }
    }
  },

  // スケールアップ効果
  scaleUp: {
    duration: 800,
    easing: 'easeOutBack' as const,
    from: 0
  },

  // 回転効果（ドーナツ・パイチャート用）
  rotate: {
    animateRotate: true,
    animateScale: false,
    duration: 1500,
    easing: 'easeOutQuart' as const
  }
}

/**
 * インタラクションエフェクト設定
 */
export const interactionEffects = {
  // ホバー時の拡大効果
  hoverScale: {
    hover: {
      animationDuration: 200
    },
    hoverBackgroundColor: (context: any) => {
      const originalColor = context.dataset.backgroundColor
      if (Array.isArray(originalColor)) {
        return originalColor.map((color: string) => adjustColorBrightness(color, 10))
      }
      return adjustColorBrightness(originalColor, 10)
    },
    hoverBorderWidth: 3
  },

  // クリック時のパルス効果
  clickPulse: (chart: any, element: any) => {
    const dataset = chart.data.datasets[element.datasetIndex]
    const originalRadius = dataset.pointRadius || 3
    
    // パルスアニメーション
    dataset.pointRadius = originalRadius * 1.5
    chart.update('none')
    
    setTimeout(() => {
      dataset.pointRadius = originalRadius
      chart.update()
    }, 300)
  },

  // ツールチップカスタマイズ
  enhancedTooltip: {
    enabled: true,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    titleColor: '#ffffff',
    bodyColor: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    cornerRadius: 12,
    padding: 16,
    displayColors: true,
    intersect: false,
    mode: 'nearest' as const,
    animation: {
      duration: 200
    },
    callbacks: {
      title: (tooltipItems: any[]) => {
        return tooltipItems[0].label || ''
      },
      label: (context: any) => {
        let label = context.dataset.label || ''
        if (label) {
          label += ': '
        }
        if (context.parsed.y !== null) {
          label += `${context.parsed.y}%`
        } else if (context.parsed !== null) {
          label += `${context.parsed}%`
        }
        return label
      },
      afterLabel: (context: any) => {
        // 追加情報表示
        if (context.dataIndex !== undefined && context.dataset.descriptions) {
          return context.dataset.descriptions[context.dataIndex]
        }
        return ''
      }
    }
  }
}

/**
 * チャートタイプ別の推奨アニメーション設定
 */
export const chartTypeAnimations = {
  bar: {
    animation: {
      ...defaultAnimations.slideInBottom,
      onComplete: (animation: any) => {
        // アニメーション完了時のコールバック
        const chart = animation.chart
        chart.options.animation = false // 後続の更新でアニメーション無効化
      }
    }
  },

  line: {
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart' as const,
      onProgress: (animation: any) => {
        const chart = animation.chart
        const ctx = chart.ctx
        ctx.globalAlpha = animation.currentStep / animation.numSteps
      },
      onComplete: (animation: any) => {
        const chart = animation.chart
        const ctx = chart.ctx
        ctx.globalAlpha = 1
      }
    }
  },

  doughnut: {
    animation: defaultAnimations.rotate
  },

  pie: {
    animation: defaultAnimations.rotate
  },

  radar: {
    animation: {
      duration: 1200,
      easing: 'easeOutQuart' as const,
      animateRotate: false,
      animateScale: true
    }
  }
}

/**
 * パフォーマンス最適化設定
 */
export const performanceOptimizations = {
  // 大量データ用の設定
  largeDataset: {
    animation: {
      duration: 0 // アニメーション無効化
    },
    parsing: false,
    normalized: true,
    spanGaps: true
  },

  // リアルタイム更新用の設定
  realtime: {
    animation: {
      duration: 750,
      easing: 'linear' as const
    },
    interaction: {
      intersect: false
    },
    scales: {
      x: {
        type: 'realtime' as const,
        realtime: {
          duration: 20000,
          refresh: 1000,
          delay: 2000,
          onRefresh: (chart: any) => {
            // データ更新ロジック
          }
        }
      }
    }
  }
}

/**
 * 色の明度を調整するヘルパー関数
 */
function adjustColorBrightness(color: string, percent: number): string {
  // HEX色をRGBに変換
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
}

/**
 * チャートのアニメーション設定を取得
 */
export function getChartAnimationOptions(chartType: string, options?: Partial<ChartOptions>): Partial<ChartOptions> {
  const baseAnimation = chartTypeAnimations[chartType as keyof typeof chartTypeAnimations] || {}
  
  return {
    ...baseAnimation,
    plugins: {
      tooltip: interactionEffects.enhancedTooltip,
      ...options?.plugins
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'xy' as const,
      intersect: false,
      ...options?.interaction
    }
  }
}

/**
 * チャートの更新アニメーション
 */
export function updateChartWithAnimation(chart: any, newData: any, animationType: 'fade' | 'slide' | 'scale' = 'fade') {
  const animationConfig = {
    fade: { duration: 500, easing: 'easeOutQuad' as const },
    slide: { duration: 750, easing: 'easeOutCubic' as const },
    scale: { duration: 600, easing: 'easeOutBack' as const }
  }

  chart.data = newData
  chart.update(animationConfig[animationType])
}

/**
 * カスタムアニメーション効果の登録
 */
export function registerCustomAnimation(name: string, config: AnimationSpec<any>) {
  // Chart.jsのアニメーションレジストリに追加
  ;(defaultAnimations as any)[name] = config
}

/**
 * インタラクティブな凡例設定
 */
export const interactiveLegend = {
  display: true,
  position: 'bottom' as const,
  labels: {
    generateLabels: (chart: any) => {
      const datasets = chart.data.datasets
      return chart.data.labels.map((label: string, i: number) => ({
        text: label,
        fillStyle: datasets[0].backgroundColor[i],
        strokeStyle: datasets[0].borderColor?.[i] || datasets[0].backgroundColor[i],
        lineWidth: datasets[0].borderWidth || 1,
        hidden: false,
        index: i,
        // カスタムプロパティ
        clickable: true,
        hoverable: true
      }))
    },
    usePointStyle: true,
    padding: 20,
    font: {
      size: 12,
      family: 'var(--font-family-base)'
    }
  },
  onClick: (_e: any, legendItem: any, legend: any) => {
    const index = legendItem.index
    const chart = legend.chart
    const meta = chart.getDatasetMeta(0)
    
    // データの表示/非表示を切り替え
    meta.data[index].hidden = !meta.data[index].hidden
    
    // アニメーション付きで更新
    chart.update('active')
  },
  onHover: (_e: any, legendItem: any, legend: any) => {
    const chart = legend.chart
    chart.canvas.style.cursor = 'pointer'
    
    // ホバー中の要素を強調
    const activeElements = [{
      datasetIndex: 0,
      index: legendItem.index
    }]
    chart.setActiveElements(activeElements)
    chart.update('none')
  },
  onLeave: (_e: any, _legendItem: any, legend: any) => {
    const chart = legend.chart
    chart.canvas.style.cursor = 'default'
    
    // アクティブ要素をクリア
    chart.setActiveElements([])
    chart.update('none')
  }
}