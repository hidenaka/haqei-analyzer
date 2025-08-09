import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface NetworkInfo {
  isOnline: boolean
  connectionType: string
  effectiveType: string
  downlink: number
  rtt: number
  saveData: boolean
}

export interface ConnectionQuality {
  level: 'excellent' | 'good' | 'poor' | 'weak' | 'offline'
  score: number
  description: string
}

/**
 * ネットワーク状況監視のComposable
 * オンライン/オフライン状態、接続品質、データセーバーモードなどを監視
 */
export function useNetworkMonitor() {
  // リアクティブデータ
  const isOnline = ref(navigator.onLine)
  const connectionInfo = ref<NetworkInfo>({
    isOnline: navigator.onLine,
    connectionType: 'unknown',
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
    saveData: false
  })

  // 接続履歴追跡
  const connectionHistory = ref<Array<{ timestamp: number; isOnline: boolean; quality: ConnectionQuality }>>([])
  const maxHistoryLength = 50

  // イベントリスナー参照
  let onlineHandler: (() => void) | null = null
  let offlineHandler: (() => void) | null = null
  let connectionChangeHandler: (() => void) | null = null

  // 接続品質の計算
  const connectionQuality = computed<ConnectionQuality>(() => {
    if (!isOnline.value) {
      return {
        level: 'offline',
        score: 0,
        description: 'オフライン'
      }
    }

    const { effectiveType, downlink, rtt } = connectionInfo.value

    // 接続タイプによる基本スコア
    let baseScore = 50
    switch (effectiveType) {
      case '4g':
        baseScore = 90
        break
      case '3g':
        baseScore = 60
        break
      case '2g':
        baseScore = 30
        break
      case 'slow-2g':
        baseScore = 10
        break
    }

    // ダウンリンク速度による調整（Mbps）
    if (downlink > 10) baseScore = Math.min(100, baseScore + 20)
    else if (downlink > 5) baseScore = Math.min(100, baseScore + 10)
    else if (downlink < 1) baseScore = Math.max(10, baseScore - 20)

    // RTT（往復時間）による調整（ms）
    if (rtt < 50) baseScore = Math.min(100, baseScore + 10)
    else if (rtt > 300) baseScore = Math.max(10, baseScore - 20)
    else if (rtt > 500) baseScore = Math.max(10, baseScore - 30)

    const score = Math.max(0, Math.min(100, baseScore))

    // レベル判定
    let level: ConnectionQuality['level']
    let description: string

    if (score >= 85) {
      level = 'excellent'
      description = '優秀'
    } else if (score >= 65) {
      level = 'good'
      description = '良好'
    } else if (score >= 40) {
      level = 'poor'
      description = '普通'
    } else {
      level = 'weak'
      description = '弱い'
    }

    return { level, score, description }
  })

  // 接続安定性の計算
  const connectionStability = computed(() => {
    if (connectionHistory.value.length < 5) {
      return { stable: true, changes: 0, reliability: 100 }
    }

    const recentHistory = connectionHistory.value.slice(-20)
    const changes = recentHistory.reduce((count, entry, index) => {
      if (index > 0 && entry.isOnline !== recentHistory[index - 1].isOnline) {
        return count + 1
      }
      return count
    }, 0)

    const reliability = Math.max(0, 100 - (changes * 10))
    const stable = changes <= 2

    return { stable, changes, reliability }
  })

  // データセーバーモード判定
  const isDataSaverMode = computed(() => {
    return connectionInfo.value.saveData || 
           connectionQuality.value.level === 'weak' ||
           connectionInfo.value.effectiveType === '2g' ||
           connectionInfo.value.effectiveType === 'slow-2g'
  })

  // 推奨する機能制限レベル
  const recommendedLimitations = computed(() => {
    const quality = connectionQuality.value
    const dataSaver = isDataSaverMode.value

    if (!isOnline.value) {
      return {
        level: 'offline',
        disableImages: true,
        disableVideos: true,
        disableAnimations: true,
        limitApiCalls: true,
        useCache: true,
        message: 'オフラインモード: ローカルデータのみ使用'
      }
    }

    if (dataSaver || quality.level === 'weak') {
      return {
        level: 'strict',
        disableImages: false,
        disableVideos: true,
        disableAnimations: true,
        limitApiCalls: true,
        useCache: true,
        message: '省データモード: 最小限の通信のみ'
      }
    }

    if (quality.level === 'poor') {
      return {
        level: 'moderate',
        disableImages: false,
        disableVideos: false,
        disableAnimations: true,
        limitApiCalls: false,
        useCache: true,
        message: '軽量モード: アニメーション無効'
      }
    }

    return {
      level: 'none',
      disableImages: false,
      disableVideos: false,
      disableAnimations: false,
      limitApiCalls: false,
      useCache: false,
      message: '通常モード: 全機能有効'
    }
  })

  // メソッド
  const updateConnectionInfo = () => {
    const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection

    if (connection) {
      connectionInfo.value = {
        isOnline: navigator.onLine,
        connectionType: connection.type || 'unknown',
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false
      }
    } else {
      connectionInfo.value = {
        isOnline: navigator.onLine,
        connectionType: 'unknown',
        effectiveType: 'unknown',
        downlink: 0,
        rtt: 0,
        saveData: false
      }
    }

    // 履歴に追加
    addToHistory()
  }

  const addToHistory = () => {
    const entry = {
      timestamp: Date.now(),
      isOnline: isOnline.value,
      quality: connectionQuality.value
    }

    connectionHistory.value.push(entry)

    // 履歴サイズ制限
    if (connectionHistory.value.length > maxHistoryLength) {
      connectionHistory.value = connectionHistory.value.slice(-maxHistoryLength)
    }
  }

  const handleOnline = () => {
    isOnline.value = true
    updateConnectionInfo()
  }

  const handleOffline = () => {
    isOnline.value = false
    updateConnectionInfo()
  }

  const handleConnectionChange = () => {
    updateConnectionInfo()
  }

  // 接続テスト
  const testConnection = async (): Promise<{
    success: boolean
    latency: number
    timestamp: number
  }> => {
    const startTime = Date.now()
    
    try {
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000) // 5秒タイムアウト
      })

      const latency = Date.now() - startTime
      
      return {
        success: true,
        latency,
        timestamp: Date.now()
      }
    } catch (error) {
      return {
        success: false,
        latency: Date.now() - startTime,
        timestamp: Date.now()
      }
    }
  }

  // 接続品質の詳細分析
  const analyzeConnection = async () => {
    const tests = []
    const testCount = 3

    // 複数回の接続テストを実行
    for (let i = 0; i < testCount; i++) {
      const result = await testConnection()
      tests.push(result)
      
      // テスト間の間隔
      if (i < testCount - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    const successfulTests = tests.filter(t => t.success)
    const avgLatency = successfulTests.length > 0 
      ? successfulTests.reduce((sum, t) => sum + t.latency, 0) / successfulTests.length
      : 0

    return {
      totalTests: testCount,
      successfulTests: successfulTests.length,
      successRate: (successfulTests.length / testCount) * 100,
      averageLatency: avgLatency,
      reliability: connectionStability.value.reliability,
      currentQuality: connectionQuality.value
    }
  }

  // 統計情報の取得
  const getNetworkStats = () => {
    const history = connectionHistory.value
    if (history.length === 0) return null

    const onlineTime = history.filter(h => h.isOnline).length
    const offlineTime = history.length - onlineTime
    const uptime = (onlineTime / history.length) * 100

    const qualityDistribution = history.reduce((acc, entry) => {
      const level = entry.quality.level
      acc[level] = (acc[level] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      uptime: Math.round(uptime),
      totalSamples: history.length,
      onlineSamples: onlineTime,
      offlineSamples: offlineTime,
      qualityDistribution,
      stability: connectionStability.value
    }
  }

  // ライフサイクル
  onMounted(() => {
    // 初期状態の更新
    updateConnectionInfo()

    // イベントリスナーの設定
    onlineHandler = handleOnline
    offlineHandler = handleOffline
    
    window.addEventListener('online', onlineHandler)
    window.addEventListener('offline', offlineHandler)

    // Connection API のサポートチェック
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection

    if (connection) {
      connectionChangeHandler = handleConnectionChange
      connection.addEventListener('change', connectionChangeHandler)
    }
  })

  onUnmounted(() => {
    // イベントリスナーの削除
    if (onlineHandler) {
      window.removeEventListener('online', onlineHandler)
    }
    if (offlineHandler) {
      window.removeEventListener('offline', offlineHandler)
    }

    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection

    if (connection && connectionChangeHandler) {
      connection.removeEventListener('change', connectionChangeHandler)
    }
  })

  return {
    // 基本状態
    isOnline,
    connectionInfo,
    connectionHistory,
    
    // 計算されたプロパティ
    connectionQuality,
    connectionStability,
    isDataSaverMode,
    recommendedLimitations,
    
    // メソッド
    updateConnectionInfo,
    testConnection,
    analyzeConnection,
    getNetworkStats
  }
}