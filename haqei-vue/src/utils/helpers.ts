/**
 * helpers.ts - 汎用ユーティリティ関数
 * HaQei Analyzer - Helper Utilities
 */

/**
 * ディープクローン
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }
  
  if (obj instanceof Object) {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  
  return obj
}

/**
 * デバウンス関数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * スロットル関数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * ランダムな文字列を生成
 */
export function generateRandomId(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * オブジェクトが空かどうかチェック
 */
export function isEmpty(obj: any): boolean {
  if (obj === null || obj === undefined) {
    return true
  }
  
  if (typeof obj === 'string' || Array.isArray(obj)) {
    return obj.length === 0
  }
  
  if (typeof obj === 'object') {
    return Object.keys(obj).length === 0
  }
  
  return false
}

/**
 * 配列をシャッフル
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return shuffled
}

/**
 * 配列から重複を除去
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

/**
 * 配列をグループ化
 */
export function groupBy<T>(
  array: T[],
  key: keyof T | ((item: T) => string)
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key])
    
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    
    groups[groupKey].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * 範囲内の数値配列を生成
 */
export function range(start: number, end: number, step = 1): number[] {
  const result = []
  
  for (let i = start; i <= end; i += step) {
    result.push(i)
  }
  
  return result
}

/**
 * 値を範囲内に制限
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * プロミスでスリープ
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 関数の実行時間を計測
 */
export async function measureTime<T>(
  func: () => T | Promise<T>
): Promise<{ result: T; time: number }> {
  const start = performance.now()
  const result = await func()
  const time = performance.now() - start
  
  return { result, time }
}

/**
 * ローカルストレージの安全な操作
 */
export const storage = {
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : (defaultValue ?? null)
    } catch {
      return defaultValue ?? null
    }
  },
  
  set(key: string, value: any): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },
  
  remove(key: string): void {
    localStorage.removeItem(key)
  },
  
  clear(): void {
    localStorage.clear()
  }
}

/**
 * URLパラメータの取得
 */
export function getUrlParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search)
  const result: Record<string, string> = {}
  
  params.forEach((value, key) => {
    result[key] = value
  })
  
  return result
}

/**
 * URLパラメータの設定
 */
export function setUrlParam(key: string, value: string): void {
  const url = new URL(window.location.href)
  url.searchParams.set(key, value)
  window.history.pushState({}, '', url.toString())
}

/**
 * デバイスタイプの判定
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth
  
  if (width < 768) {
    return 'mobile'
  } else if (width < 1024) {
    return 'tablet'
  } else {
    return 'desktop'
  }
}

/**
 * ブラウザのダークモード判定
 */
export function isDarkMode(): boolean {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * クリップボードにコピー
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // フォールバック
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    
    try {
      document.execCommand('copy')
      return true
    } catch {
      return false
    } finally {
      document.body.removeChild(textarea)
    }
  }
}

/**
 * Triple OS計算用ヘルパー
 */
export function calculateOSBalance(scores: {
  engine: number
  interface: number
  safemode: number
}): {
  dominant: 'engine' | 'interface' | 'safemode'
  balance: number
  isBalanced: boolean
} {
  const values = Object.values(scores)
  const max = Math.max(...values)
  const min = Math.min(...values)
  const balance = max - min
  
  let dominant: 'engine' | 'interface' | 'safemode' = 'engine'
  if (scores.interface === max) dominant = 'interface'
  else if (scores.safemode === max) dominant = 'safemode'
  
  return {
    dominant,
    balance,
    isBalanced: balance < 0.2
  }
}

/**
 * 8次元ベクトルの正規化
 */
export function normalizeVector(vector: Record<string, number>): Record<string, number> {
  const values = Object.values(vector)
  const sum = values.reduce((acc, val) => acc + val, 0)
  
  if (sum === 0) return vector
  
  const normalized: Record<string, number> = {}
  for (const [key, value] of Object.entries(vector)) {
    normalized[key] = value / sum
  }
  
  return normalized
}