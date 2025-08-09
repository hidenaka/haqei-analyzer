/**
 * formatters.ts - フォーマット用ユーティリティ関数
 * HaQei Analyzer - Formatting Utilities
 */

/**
 * 数値を百分率表示にフォーマット
 */
export function formatPercentage(value: number, decimals = 0): string {
  const percentage = value * 100
  return `${percentage.toFixed(decimals)}%`
}

/**
 * 数値を通貨表示にフォーマット
 */
export function formatCurrency(
  value: number,
  currency = 'JPY',
  locale = 'ja-JP'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * 日付をフォーマット
 */
export function formatDate(
  date: Date | string | number,
  format = 'YYYY年MM月DD日'
): string {
  const d = new Date(date)
  
  if (isNaN(d.getTime())) {
    return ''
  }
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 相対的な時間表示
 */
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date()
  const target = new Date(date)
  const diffMs = now.getTime() - target.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffSeconds < 60) {
    return 'たった今'
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分前`
  } else if (diffHours < 24) {
    return `${diffHours}時間前`
  } else if (diffDays < 7) {
    return `${diffDays}日前`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks}週間前`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months}ヶ月前`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years}年前`
  }
}

/**
 * 数値を短縮表示
 */
export function formatNumber(
  value: number,
  options?: {
    decimals?: number
    separator?: string
    compact?: boolean
  }
): string {
  const decimals = options?.decimals ?? 0
  const separator = options?.separator ?? ','
  const compact = options?.compact ?? false
  
  if (compact) {
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(1)}B`
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`
    }
  }
  
  const parts = value.toFixed(decimals).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  return parts.join('.')
}

/**
 * 文字列を省略表示
 */
export function truncate(
  str: string,
  maxLength: number,
  ellipsis = '...'
): string {
  if (str.length <= maxLength) {
    return str
  }
  
  return str.slice(0, maxLength - ellipsis.length) + ellipsis
}

/**
 * キャメルケースをケバブケースに変換
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * ケバブケースをキャメルケースに変換
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * ファイルサイズをフォーマット
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

/**
 * 時間をフォーマット（秒数から）
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  const parts = []
  if (hours > 0) parts.push(`${hours}時間`)
  if (minutes > 0) parts.push(`${minutes}分`)
  if (secs > 0 || parts.length === 0) parts.push(`${secs}秒`)
  
  return parts.join(' ')
}

/**
 * Triple OS スコアのフォーマット
 */
export function formatOSScore(score: number): string {
  const percentage = score * 100
  
  if (percentage >= 80) {
    return `${percentage.toFixed(0)}% (非常に高い)`
  } else if (percentage >= 60) {
    return `${percentage.toFixed(0)}% (高い)`
  } else if (percentage >= 40) {
    return `${percentage.toFixed(0)}% (中程度)`
  } else if (percentage >= 20) {
    return `${percentage.toFixed(0)}% (低い)`
  } else {
    return `${percentage.toFixed(0)}% (非常に低い)`
  }
}

/**
 * 易経の卦をフォーマット
 */
export function formatHexagram(
  id: number,
  name: string,
  reading?: string
): string {
  const paddedId = String(id).padStart(2, '0')
  
  if (reading) {
    return `${paddedId}. ${name} (${reading})`
  }
  
  return `${paddedId}. ${name}`
}

/**
 * 8次元ベクトルの値をフォーマット
 */
export function formatDimensionValue(
  dimension: string,
  value: number
): string {
  const percentage = (value * 100).toFixed(0)
  return `${dimension}: ${percentage}%`
}

/**
 * 信頼区間をフォーマット
 */
export function formatConfidenceInterval(
  mean: number,
  lowerBound: number,
  upperBound: number,
  confidence = 95
): string {
  const meanPercent = (mean * 100).toFixed(1)
  const lowerPercent = (lowerBound * 100).toFixed(1)
  const upperPercent = (upperBound * 100).toFixed(1)
  
  return `${meanPercent}% (${confidence}% CI: ${lowerPercent}%-${upperPercent}%)`
}

/**
 * 質問番号をフォーマット
 */
export function formatQuestionNumber(
  current: number,
  total: number
): string {
  return `質問 ${current} / ${total}`
}

/**
 * エラーメッセージをフォーマット
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  
  return '予期しないエラーが発生しました'
}