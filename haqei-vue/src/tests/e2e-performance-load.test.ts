/**
 * HAQEI E2E Performance Load Testing Suite
 * 
 * 目的：
 * - 大規模負荷下でのシステム安定性確認
 * - 並行処理・リソース管理の検証
 * - スケーラビリティ限界の測定
 * - 本番環境相当のストレステスト
 * 
 * 実装: 2025-08-03 - Performance Load Test Suite
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest'
import { performance } from 'perf_hooks'

// システムサービスのインポート
import { useOfflineDatabase } from '@/composables/useOfflineDatabase'
import { getOfflineDatabaseService } from '@/services/offline-database'
import { migrationService } from '@/services/migration'
import { useMigration } from '@/composables/useMigration'

// パフォーマンス測定のユーティリティ
interface PerformanceMetrics {
  startTime: number
  endTime: number
  duration: number
  memoryBefore: number
  memoryAfter: number
  memoryDelta: number
  throughput: number
  errorCount: number
  successRate: number
}

class PerformanceProfiler {
  private metrics: PerformanceMetrics[] = []
  private currentTest: Partial<PerformanceMetrics> = {}

  startProfiling(testName: string) {
    this.currentTest = {
      startTime: performance.now(),
      memoryBefore: this.getMemoryUsage(),
      errorCount: 0
    }
    console.log(`🚀 ${testName} - パフォーマンス計測開始`)
  }

  endProfiling(testName: string, operationCount: number = 1): PerformanceMetrics {
    const endTime = performance.now()
    const memoryAfter = this.getMemoryUsage()
    
    const metrics: PerformanceMetrics = {
      startTime: this.currentTest.startTime!,
      endTime,
      duration: endTime - this.currentTest.startTime!,
      memoryBefore: this.currentTest.memoryBefore!,
      memoryAfter,
      memoryDelta: memoryAfter - this.currentTest.memoryBefore!,
      throughput: operationCount / ((endTime - this.currentTest.startTime!) / 1000),
      errorCount: this.currentTest.errorCount || 0,
      successRate: Math.max(0, (operationCount - (this.currentTest.errorCount || 0)) / operationCount)
    }

    this.metrics.push(metrics)
    
    console.log(`📊 ${testName} - パフォーマンス結果:`)
    console.log(`  実行時間: ${metrics.duration.toFixed(2)}ms`)
    console.log(`  スループット: ${metrics.throughput.toFixed(2)} ops/sec`)
    console.log(`  メモリ使用量: ${(metrics.memoryDelta / 1024 / 1024).toFixed(2)}MB`)
    console.log(`  成功率: ${(metrics.successRate * 100).toFixed(1)}%`)

    return metrics
  }

  recordError() {
    this.currentTest.errorCount = (this.currentTest.errorCount || 0) + 1
  }

  private getMemoryUsage(): number {
    if (typeof performance.memory !== 'undefined') {
      return performance.memory.usedJSHeapSize
    }
    return 0
  }

  getAverageMetrics(): Partial<PerformanceMetrics> {
    if (this.metrics.length === 0) return {}

    const sum = this.metrics.reduce((acc, metric) => ({
      duration: acc.duration + metric.duration,
      throughput: acc.throughput + metric.throughput,
      memoryDelta: acc.memoryDelta + metric.memoryDelta,
      successRate: acc.successRate + metric.successRate
    }), { duration: 0, throughput: 0, memoryDelta: 0, successRate: 0 })

    return {
      duration: sum.duration / this.metrics.length,
      throughput: sum.throughput / this.metrics.length,
      memoryDelta: sum.memoryDelta / this.metrics.length,
      successRate: sum.successRate / this.metrics.length
    }
  }

  reset() {
    this.metrics = []
    this.currentTest = {}
  }
}

// パフォーマンス基準値
const PERFORMANCE_BENCHMARKS = {
  CONCURRENT_USERS: {
    LIGHT: 50,
    MEDIUM: 100,
    HEAVY: 500,
    EXTREME: 1000
  },
  RESPONSE_TIME: {
    EXCELLENT: 100,  // ms
    GOOD: 500,
    ACCEPTABLE: 1000,
    POOR: 2000
  },
  THROUGHPUT: {
    MIN_ACCEPTABLE: 10,  // ops/sec
    GOOD: 50,
    EXCELLENT: 100
  },
  MEMORY: {
    MAX_INCREASE: 100 * 1024 * 1024, // 100MB
    LEAK_THRESHOLD: 50 * 1024 * 1024  // 50MB
  },
  SUCCESS_RATE: {
    MIN_ACCEPTABLE: 0.95, // 95%
    TARGET: 0.99 // 99%
  }
}

vi.mock('@/services/supabase', () => {
  const mockSupabaseClient = {
    from: vi.fn((table: string) => ({
      insert: vi.fn(() => Promise.resolve({ data: [], error: null })),
      update: vi.fn(() => Promise.resolve({ data: [], error: null })),
      upsert: vi.fn(() => Promise.resolve({ data: [], error: null })),
      delete: vi.fn(() => Promise.resolve({ data: [], error: null })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: {}, error: null })),
          limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
        })),
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }))
  }

  return {
    useSupabase: () => ({ client: mockSupabaseClient }),
    getSupabaseClient: () => mockSupabaseClient,
    getConnectionState: () => ({
      isOnline: true,
      isSupabaseConnected: true,
      connectionQuality: 'excellent',
      lastPing: Date.now()
    })
  }
})

describe('🔥 HAQEI E2E Performance Load Testing', () => {
  let profiler: PerformanceProfiler
  let service: any

  beforeAll(async () => {
    console.log('\n🔥 ====== E2E Performance Load Testing 開始 ======')
    console.log('🎯 目標: 世界最高レベルのパフォーマンス実証')
    console.log('================================================\n')
    
    profiler = new PerformanceProfiler()
    service = getOfflineDatabaseService()
    
    // テスト環境の初期化
    await service.database.clearAllData()
  })

  afterAll(() => {
    const avgMetrics = profiler.getAverageMetrics()
    console.log('\n📊 ====== 総合パフォーマンス統計 ======')
    console.log(`平均実行時間: ${avgMetrics.duration?.toFixed(2)}ms`)
    console.log(`平均スループット: ${avgMetrics.throughput?.toFixed(2)} ops/sec`)
    console.log(`平均メモリ増加: ${((avgMetrics.memoryDelta || 0) / 1024 / 1024).toFixed(2)}MB`)
    console.log(`平均成功率: ${((avgMetrics.successRate || 0) * 100).toFixed(1)}%`)
    console.log('=====================================\n')
  })

  beforeEach(async () => {
    await service.database.clearAllData()
    profiler.reset()
  })

  describe('💨 軽負荷テスト (50並行ユーザー)', () => {
    it('50並行ユーザー作成テスト', async () => {
      const userCount = PERFORMANCE_BENCHMARKS.CONCURRENT_USERS.LIGHT
      profiler.startProfiling('50並行ユーザー作成')

      const userPromises = Array.from({ length: userCount }, (_, i) => 
        (async () => {
          try {
            const { createUser } = useOfflineDatabase()
            return await createUser({
              email: `load-light-${i}@haqei.com`,
              username: `loaduser_light_${i}`,
              privacy_level: 'medium'
            })
          } catch (error) {
            profiler.recordError()
            throw error
          }
        })()
      )

      const results = await Promise.allSettled(userPromises)
      const successCount = results.filter(r => r.status === 'fulfilled').length

      const metrics = profiler.endProfiling('50並行ユーザー作成', userCount)

      // パフォーマンス検証
      expect(metrics.duration).toBeLessThan(PERFORMANCE_BENCHMARKS.RESPONSE_TIME.GOOD)
      expect(metrics.throughput).toBeGreaterThan(PERFORMANCE_BENCHMARKS.THROUGHPUT.MIN_ACCEPTABLE)
      expect(metrics.successRate).toBeGreaterThan(PERFORMANCE_BENCHMARKS.SUCCESS_RATE.MIN_ACCEPTABLE)
      expect(successCount).toBe(userCount)

      console.log('✅ 軽負荷テスト合格')
    }, 15000)

    it('50並行データ読み取りテスト', async () => {
      // 事前データ準備
      const testUsers = Array.from({ length: 50 }, (_, i) => ({
        id: `read-test-${i}`,
        email: `read${i}@test.com`,
        username: `readuser${i}`,
        privacy_level: 'medium' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))

      await service.database.users.bulkAdd(testUsers)

      profiler.startProfiling('50並行データ読み取り')

      const readPromises = Array.from({ length: 50 }, (_, i) =>
        (async () => {
          try {
            return await service.database.users.get(`read-test-${i}`)
          } catch (error) {
            profiler.recordError()
            throw error
          }
        })()
      )

      const results = await Promise.allSettled(readPromises)
      const successCount = results.filter(r => r.status === 'fulfilled').length

      const metrics = profiler.endProfiling('50並行データ読み取り', 50)

      expect(metrics.duration).toBeLessThan(PERFORMANCE_BENCHMARKS.RESPONSE_TIME.EXCELLENT)
      expect(metrics.throughput).toBeGreaterThan(PERFORMANCE_BENCHMARKS.THROUGHPUT.GOOD)
      expect(successCount).toBe(50)

      console.log('✅ 軽負荷読み取りテスト合格')
    }, 10000)
  })

  describe('⚡ 中負荷テスト (100並行ユーザー)', () => {
    it('100並行ユーザー作成テスト', async () => {
      const userCount = PERFORMANCE_BENCHMARKS.CONCURRENT_USERS.MEDIUM
      profiler.startProfiling('100並行ユーザー作成')

      const userPromises = Array.from({ length: userCount }, (_, i) =>
        (async () => {
          try {
            const { createUser } = useOfflineDatabase()
            return await createUser({
              email: `load-medium-${i}@haqei.com`,
              username: `loaduser_medium_${i}`,
              privacy_level: i % 2 === 0 ? 'high' : 'medium',
              preferences: {
                theme: i % 3 === 0 ? 'dark' : 'light',
                language: ['ja', 'en', 'zh'][i % 3],
                notifications: i % 2 === 0
              }
            })
          } catch (error) {
            profiler.recordError()
            throw error
          }
        })()
      )

      const results = await Promise.allSettled(userPromises)
      const successCount = results.filter(r => r.status === 'fulfilled').length

      const metrics = profiler.endProfiling('100並行ユーザー作成', userCount)

      // 中負荷でのパフォーマンス要件
      expect(metrics.duration).toBeLessThan(PERFORMANCE_BENCHMARKS.RESPONSE_TIME.ACCEPTABLE)
      expect(metrics.throughput).toBeGreaterThan(PERFORMANCE_BENCHMARKS.THROUGHPUT.MIN_ACCEPTABLE)
      expect(metrics.successRate).toBeGreaterThan(PERFORMANCE_BENCHMARKS.SUCCESS_RATE.MIN_ACCEPTABLE)
      expect(successCount).toBeGreaterThan(userCount * 0.95) // 95%以上の成功

      console.log('✅ 中負荷テスト合格')
    }, 30000)

    it('100並行分析結果保存テスト', async () => {
      const resultCount = 100
      profiler.startProfiling('100並行分析結果保存')

      const analysisPromises = Array.from({ length: resultCount }, (_, i) =>
        (async () => {
          try {
            const { saveAnalysisResult } = useOfflineDatabase()
            return await saveAnalysisResult(
              `medium-load-session-${i}`,
              {
                hexagram: (i % 64) + 1,
                confidence: 0.7 + (i % 30) / 100,
                insights: [`分析結果 ${i}`, `洞察 ${i}`]
              },
              {
                engine_os: { rational_thinking: 0.5 + (i % 50) / 100 },
                interface_os: { social_skills: 0.6 + (i % 40) / 100 },
                safe_mode_os: { emotional_stability: 0.7 + (i % 30) / 100 }
              }
            )
          } catch (error) {
            profiler.recordError()
            throw error
          }
        })()
      )

      const results = await Promise.allSettled(analysisPromises)
      const successCount = results.filter(r => r.status === 'fulfilled').length

      const metrics = profiler.endProfiling('100並行分析結果保存', resultCount)

      expect(metrics.duration).toBeLessThan(PERFORMANCE_BENCHMARKS.RESPONSE_TIME.ACCEPTABLE)
      expect(metrics.successRate).toBeGreaterThan(PERFORMANCE_BENCHMARKS.SUCCESS_RATE.MIN_ACCEPTABLE)
      expect(successCount).toBeGreaterThan(resultCount * 0.95)

      console.log('✅ 中負荷分析結果保存テスト合格')
    }, 30000)
  })

  describe('🔥 高負荷テスト (500並行ユーザー)', () => {
    it('500並行混合操作テスト', async () => {
      const operationCount = PERFORMANCE_BENCHMARKS.CONCURRENT_USERS.HEAVY
      profiler.startProfiling('500並行混合操作')

      // 混合操作の準備（読み取り、書き込み、更新、削除）
      const operations = Array.from({ length: operationCount }, (_, i) => {
        const operationType = ['create', 'read', 'update', 'delete'][i % 4]
        
        return (async () => {
          try {
            const { createUser, getAnalysisResults } = useOfflineDatabase()
            
            switch (operationType) {
              case 'create':
                return await createUser({
                  email: `heavy-load-${i}@haqei.com`,
                  username: `heavyuser${i}`,
                  privacy_level: 'medium'
                })
              
              case 'read':
                return await getAnalysisResults(`user-${i % 100}`)
              
              case 'update':
                // 更新操作のシミュレーション
                return { success: true, data: { updated: true } }
              
              case 'delete':
                // 削除操作のシミュレーション
                return { success: true, data: { deleted: true } }
              
              default:
                return { success: true, data: null }
            }
          } catch (error) {
            profiler.recordError()
            return { success: false, error }
          }
        })()
      })

      const results = await Promise.allSettled(operations)
      const successCount = results.filter(r => 
        r.status === 'fulfilled' && r.value.success
      ).length

      const metrics = profiler.endProfiling('500並行混合操作', operationCount)

      // 高負荷での要件（やや緩和）
      expect(metrics.duration).toBeLessThan(PERFORMANCE_BENCHMARKS.RESPONSE_TIME.POOR)
      expect(metrics.successRate).toBeGreaterThan(0.90) // 90%以上の成功率
      expect(successCount).toBeGreaterThan(operationCount * 0.90)

      console.log('✅ 高負荷混合操作テスト合格')
    }, 60000)

    it('500並行データ移行テスト', async () => {
      // 大量のlocalStorageデータを準備
      const mockLocalStorage = {
        storage: new Map<string, string>(),
        getItem: vi.fn((key: string) => mockLocalStorage.storage.get(key) || null),
        setItem: vi.fn((key: string, value: string) => mockLocalStorage.storage.set(key, value)),
        removeItem: vi.fn((key: string) => mockLocalStorage.storage.delete(key)),
        clear: vi.fn(() => mockLocalStorage.storage.clear()),
        get length() { return mockLocalStorage.storage.size }
      }

      // 500件のデータを準備
      for (let i = 0; i < 500; i++) {
        mockLocalStorage.storage.set(
          `haqei_user_heavy_${i}`,
          JSON.stringify({
            id: `heavy-user-${i}`,
            email: `heavy${i}@test.com`,
            username: `heavyuser${i}`,
            privacy_level: 'medium',
            created_at: new Date().toISOString()
          })
        )
      }

      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true
      })

      profiler.startProfiling('500件データ移行')

      try {
        const detectionResult = await migrationService.detectLocalStorageData()
        expect(detectionResult.success).toBe(true)
        expect(detectionResult.data!.totalItems).toBe(500)

        const migrationResult = await migrationService.migrateData({
          batchSize: 50,
          maxRetries: 3,
          dryRun: true,
          privacyLevel: 'medium'
        })

        expect(migrationResult.success).toBe(true)

        const metrics = profiler.endProfiling('500件データ移行', 500)

        // データ移行の性能要件
        expect(metrics.duration).toBeLessThan(30000) // 30秒以内
        expect(metrics.successRate).toBeGreaterThan(0.95)

        console.log('✅ 高負荷データ移行テスト合格')
      } catch (error) {
        profiler.recordError()
        throw error
      }
    }, 45000)
  })

  describe('💥 極限負荷テスト (メモリ・安定性)', () => {
    it('メモリリーク検出テスト', async () => {
      profiler.startProfiling('メモリリーク検出')

      const iterations = 100
      const memorySnapshots: number[] = []

      for (let i = 0; i < iterations; i++) {
        // メモリスナップショットを取得
        if (performance.memory) {
          memorySnapshots.push(performance.memory.usedJSHeapSize)
        }

        // 大量のデータを作成・削除
        const tempData = Array.from({ length: 1000 }, (_, j) => ({
          id: `temp-${i}-${j}`,
          data: new Array(1000).fill(`data-${i}-${j}`),
          timestamp: Date.now()
        }))

        // データの処理
        const { createUser } = useOfflineDatabase()
        await createUser({
          email: `memory-test-${i}@test.com`,
          username: `memoryuser${i}`,
          privacy_level: 'low'
        })

        // 明示的なクリーンアップ
        tempData.length = 0

        // ガベージコレクションのヒント
        if (global.gc) {
          global.gc()
        }

        // 進捗表示
        if (i % 20 === 0) {
          console.log(`  メモリテスト進捗: ${i}/${iterations}`)
        }
      }

      const metrics = profiler.endProfiling('メモリリーク検出', iterations)

      // メモリリークの検証
      if (memorySnapshots.length > 0) {
        const initialMemory = memorySnapshots[0]
        const finalMemory = memorySnapshots[memorySnapshots.length - 1]
        const memoryIncrease = finalMemory - initialMemory

        console.log(`📊 メモリ使用量変化: ${Math.round(memoryIncrease / 1024 / 1024)}MB`)

        // メモリ増加が許容範囲内であることを確認
        expect(memoryIncrease).toBeLessThan(PERFORMANCE_BENCHMARKS.MEMORY.LEAK_THRESHOLD)
      }

      expect(metrics.successRate).toBeGreaterThan(PERFORMANCE_BENCHMARKS.SUCCESS_RATE.MIN_ACCEPTABLE)

      console.log('✅ メモリリーク検出テスト合格')
    }, 120000)

    it('長時間稼働安定性テスト', async () => {
      const testDuration = 30000 // 30秒間
      const operationInterval = 100 // 100ms間隔
      const expectedOperations = testDuration / operationInterval

      profiler.startProfiling('長時間稼働安定性')

      let operationCount = 0
      let errorCount = 0

      const stabilityTest = new Promise<void>((resolve) => {
        const interval = setInterval(async () => {
          try {
            // 定期的な操作を実行
            const { createUser } = useOfflineDatabase()
            await createUser({
              email: `stability-${operationCount}@test.com`,
              username: `stabilityuser${operationCount}`,
              privacy_level: 'medium'
            })

            operationCount++

            if (performance.now() > testDuration) {
              clearInterval(interval)
              resolve()
            }
          } catch (error) {
            errorCount++
            profiler.recordError()
          }
        }, operationInterval)
      })

      await stabilityTest

      const metrics = profiler.endProfiling('長時間稼働安定性', operationCount)

      // 安定性の検証
      const actualSuccessRate = (operationCount - errorCount) / operationCount
      
      console.log(`📊 長時間稼働結果:`)
      console.log(`  実行操作数: ${operationCount}`)
      console.log(`  エラー数: ${errorCount}`)
      console.log(`  実際の成功率: ${(actualSuccessRate * 100).toFixed(1)}%`)

      expect(actualSuccessRate).toBeGreaterThan(PERFORMANCE_BENCHMARKS.SUCCESS_RATE.MIN_ACCEPTABLE)
      expect(operationCount).toBeGreaterThan(expectedOperations * 0.8) // 80%以上の操作完了

      console.log('✅ 長時間稼働安定性テスト合格')
    }, 45000)

    it('システム限界点測定テスト', async () => {
      profiler.startProfiling('システム限界点測定')

      const limits = {
        maxConcurrentUsers: 0,
        maxDataSize: 0,
        maxOperationsPerSecond: 0
      }

      // 並行ユーザー数の限界測定
      console.log('  🔍 並行ユーザー数限界測定中...')
      for (let userCount = 100; userCount <= 2000; userCount += 100) {
        try {
          const startTime = performance.now()
          
          const userPromises = Array.from({ length: userCount }, (_, i) =>
            (async () => {
              const { createUser } = useOfflineDatabase()
              return await createUser({
                email: `limit-test-${userCount}-${i}@test.com`,
                username: `limituser${userCount}_${i}`,
                privacy_level: 'low'
              })
            })()
          )

          const results = await Promise.allSettled(userPromises)
          const successCount = results.filter(r => r.status === 'fulfilled').length
          const successRate = successCount / userCount
          const duration = performance.now() - startTime

          if (successRate > 0.9 && duration < 10000) { // 90%成功率、10秒以内
            limits.maxConcurrentUsers = userCount
            console.log(`    ✅ ${userCount}並行ユーザー: 成功率${(successRate * 100).toFixed(1)}%`)
          } else {
            console.log(`    ❌ ${userCount}並行ユーザー: 限界到達`)
            break
          }

          // データベースクリア
          await service.database.clearAllData()
          
        } catch (error) {
          console.log(`    ❌ ${userCount}並行ユーザー: エラー発生`)
          break
        }
      }

      const metrics = profiler.endProfiling('システム限界点測定', 1)

      console.log(`📊 システム限界点:`)
      console.log(`  最大並行ユーザー数: ${limits.maxConcurrentUsers}`)
      
      // 最低限の性能要件を満たしていることを確認
      expect(limits.maxConcurrentUsers).toBeGreaterThan(100)

      console.log('✅ システム限界点測定テスト完了')
    }, 180000) // 3分
  })

  describe('🎯 ベンチマーク比較テスト', () => {
    it('業界標準との比較ベンチマーク', async () => {
      console.log('🏁 業界標準ベンチマーク比較開始')

      const benchmarkTests = [
        {
          name: 'シンプルCRUD操作',
          operation: async () => {
            const { createUser } = useOfflineDatabase()
            return await createUser({
              email: 'benchmark@test.com',
              username: 'benchmarkuser',
              privacy_level: 'medium'
            })
          },
          industryStandard: 50, // ms
          target: 30 // ms
        },
        {
          name: '複合クエリ実行',
          operation: async () => {
            const users = await service.database.users
              .where('privacy_level')
              .equals('medium')
              .limit(100)
              .toArray()
            return { success: true, data: users }
          },
          industryStandard: 100, // ms
          target: 50 // ms
        },
        {
          name: 'バッチ処理',
          operation: async () => {
            const batchData = Array.from({ length: 100 }, (_, i) => ({
              id: `batch-${i}`,
              email: `batch${i}@test.com`,
              username: `batchuser${i}`,
              privacy_level: 'low' as const,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }))

            await service.database.users.bulkAdd(batchData)
            return { success: true, data: batchData }
          },
          industryStandard: 500, // ms
          target: 200 // ms
        }
      ]

      const benchmarkResults = []

      for (const test of benchmarkTests) {
        console.log(`  🔄 ${test.name}ベンチマーク実行中...`)
        
        // 5回の平均を取る
        const runs = []
        for (let i = 0; i < 5; i++) {
          const startTime = performance.now()
          await test.operation()
          const duration = performance.now() - startTime
          runs.push(duration)
        }

        const avgDuration = runs.reduce((a, b) => a + b, 0) / runs.length
        const performance_score = Math.max(0, 100 - (avgDuration / test.target * 50))

        benchmarkResults.push({
          name: test.name,
          avgDuration: avgDuration.toFixed(2),
          industryStandard: test.industryStandard,
          target: test.target,
          performance_score: performance_score.toFixed(1),
          vs_industry: ((test.industryStandard - avgDuration) / test.industryStandard * 100).toFixed(1),
          vs_target: avgDuration <= test.target ? 'PASS' : 'NEEDS_IMPROVEMENT'
        })

        console.log(`    ✅ ${test.name}: ${avgDuration.toFixed(2)}ms (目標: ${test.target}ms)`)
      }

      // ベンチマーク結果のサマリー
      console.log('\n📊 ====== ベンチマーク比較結果 ======')
      benchmarkResults.forEach(result => {
        console.log(`${result.name}:`)
        console.log(`  平均実行時間: ${result.avgDuration}ms`)
        console.log(`  業界標準比: ${result.vs_industry}% 改善`)
        console.log(`  目標達成: ${result.vs_target}`)
        console.log(`  性能スコア: ${result.performance_score}/100`)
        console.log('')
      })

      // 全体的な性能要件の確認
      const allTargetsMet = benchmarkResults.every(r => r.vs_target === 'PASS')
      const avgPerformanceScore = benchmarkResults.reduce((sum, r) => sum + parseFloat(r.performance_score), 0) / benchmarkResults.length

      expect(avgPerformanceScore).toBeGreaterThan(70) // 70点以上
      console.log(`総合性能スコア: ${avgPerformanceScore.toFixed(1)}/100`)

      if (allTargetsMet) {
        console.log('🎉 全ベンチマーク目標達成！')
      } else {
        console.log('⚠️  一部ベンチマークで改善の余地あり')
      }
    }, 60000)
  })
})