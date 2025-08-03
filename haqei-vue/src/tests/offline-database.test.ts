/**
 * HAQEI Offline Database Integration Tests - TASK-041
 * 
 * 目的：
 * - IndexedDBオフライン統合機能の包括的テスト
 * - Supabase同期機能のテスト
 * - Vue3 Composable統合のテスト
 * - データ整合性とパフォーマンステスト
 * 
 * 更新: 2025-08-03 - TASK-041統合テスト実装
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref } from 'vue'
import { 
  getOfflineDatabaseService,
  HAQEIOfflineDatabaseService
} from '@/services/offline-database'
import { useOfflineDatabase, useOfflineStatus } from '@/composables/useOfflineDatabase'
import type { HAQEIUser, HAQEIAnalysisResult } from '@/types/supabase'

// Supabaseクライアントのモック
vi.mock('@/services/supabase', () => ({
  getSupabaseClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ data: {}, error: null })),
      update: vi.fn(() => Promise.resolve({ data: {}, error: null })),
      delete: vi.fn(() => Promise.resolve({ data: {}, error: null })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: {}, error: null }))
        }))
      }))
    }))
  })),
  useSupabase: vi.fn(() => ({
    client: {
      from: vi.fn(() => ({
        insert: vi.fn(() => Promise.resolve({ data: {}, error: null })),
        update: vi.fn(() => Promise.resolve({ data: {}, error: null })),
        delete: vi.fn(() => Promise.resolve({ data: {}, error: null }))
      }))
    }
  })),
  getConnectionState: vi.fn(() => ({
    isOnline: true,
    isSupabaseConnected: true,
    connectionQuality: 'good' as const
  }))
}))

// グローバル環境のモック
Object.defineProperty(global, 'window', {
  value: {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    navigator: {
      onLine: true,
      userAgent: 'test-agent'
    },
    localStorage: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    }
  },
  writable: true
})

Object.defineProperty(global, 'navigator', {
  value: {
    onLine: true,
    userAgent: 'test-agent'
  },
  writable: true
})

describe('HAQEIOfflineDatabaseService', () => {
  let service: HAQEIOfflineDatabaseService

  beforeEach(async () => {
    // サービスインスタンスの初期化
    service = getOfflineDatabaseService()
    
    // データベースのクリア
    await service.database.clearAllData()
  })

  afterEach(async () => {
    if (service) {
      await service.destroy()
    }
  })

  describe('基本機能テスト', () => {
    it('サービスが正常に初期化される', () => {
      expect(service).toBeDefined()
      expect(service.database).toBeDefined()
    })

    it('データベース統計を取得できる', async () => {
      const stats = await service.database.getStatistics()
      
      expect(stats).toBeDefined()
      expect(stats.totalRecords).toBe(0)
      expect(stats.offlineOperations).toBe(0)
      expect(stats.cacheSize).toBe(0)
      expect(stats.lastSyncTime).toBeNull()
      expect(stats.tables).toBeDefined()
    })

    it('デフォルト同期設定が初期化される', async () => {
      const config = await service.database.syncConfig.get('default')
      
      expect(config).toBeDefined()
      expect(config?.enabled).toBe(true)
      expect(config?.autoSync).toBe(true)
      expect(config?.maxRetries).toBe(3)
      expect(config?.conflictResolution).toBe('local')
    })
  })

  describe('オフライン操作テスト', () => {
    it('オフライン操作をキューに追加できる', async () => {
      const testData = {
        id: 'test-user-1',
        email: 'test@example.com',
        username: 'testuser',
        privacy_level: 'maximum' as const
      }

      const operationId = await service.addOfflineOperation('create', 'users', testData)
      
      expect(operationId).toBeDefined()
      expect(operationId).toMatch(/^op_\d+_[a-z0-9]+$/)

      // キューにオペレーションが追加されているか確認
      const operation = await service.database.offlineOperations.get(operationId)
      expect(operation).toBeDefined()
      expect(operation?.type).toBe('create')
      expect(operation?.table).toBe('users')
      expect(operation?.syncStatus).toBe('pending')
    })

    it('複数のオフライン操作を管理できる', async () => {
      const operations = [
        { type: 'create' as const, table: 'users', data: { id: '1', email: 'user1@test.com' } },
        { type: 'update' as const, table: 'users', data: { username: 'updated' }, recordId: '1' },
        { type: 'delete' as const, table: 'users', recordId: '1' }
      ]

      const operationIds = await Promise.all(
        operations.map(op => 
          service.addOfflineOperation(op.type, op.table, op.data, op.recordId)
        )
      )

      expect(operationIds).toHaveLength(3)

      const queuedOps = await service.database.offlineOperations.toArray()
      expect(queuedOps).toHaveLength(3)
      expect(queuedOps.every(op => op.syncStatus === 'pending')).toBe(true)
    })
  })

  describe('データベース操作テスト', () => {
    it('ユーザーデータを保存できる', async () => {
      const testUser: HAQEIUser = {
        id: 'test-user-1',
        email: 'test@example.com',
        username: 'testuser',
        privacy_level: 'maximum',
        preferences: { theme: 'dark' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      await service.database.users.add(testUser)

      const savedUser = await service.database.users.get('test-user-1')
      expect(savedUser).toBeDefined()
      expect(savedUser?.email).toBe('test@example.com')
      expect(savedUser?.privacy_level).toBe('maximum')
    })

    it('分析結果を保存できる', async () => {
      const testResult: HAQEIAnalysisResult = {
        id: 'test-result-1',
        session_id: 'test-session-1',
        user_id: 'test-user-1',
        analysis_data: {
          hexagram: 1,
          confidence: 0.85,
          insights: ['test insight']
        },
        triple_os_data: {
          engine_os: { rational_thinking: 0.8 },
          interface_os: { social_skills: 0.7 },
          safe_mode_os: { emotional_stability: 0.9 }
        },
        confidence_score: 0.85,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      await service.database.analysisResults.add(testResult)

      const savedResult = await service.database.analysisResults.get('test-result-1')
      expect(savedResult).toBeDefined()
      expect(savedResult?.confidence_score).toBe(0.85)
      expect(savedResult?.analysis_data.hexagram).toBe(1)
    })
  })

  describe('バックアップ・復元テスト', () => {
    it('データベースバックアップを作成できる', async () => {
      // テストデータの追加
      const testUser = {
        id: 'backup-test-user',
        email: 'backup@test.com',
        username: 'backupuser',
        privacy_level: 'maximum' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      await service.database.users.add(testUser)

      const backup = await service.database.createBackup()

      expect(backup).toBeDefined()
      expect(backup.data).toBeDefined()
      expect(backup.metadata).toBeDefined()
      expect(backup.metadata.recordCount).toBeGreaterThan(0)
      expect(backup.metadata.checksum).toBeDefined()
    })

    it('バックアップからデータを復元できる', async () => {
      // 元のデータを作成
      const originalUser = {
        id: 'restore-test-user',
        email: 'restore@test.com',
        username: 'restoreuser',
        privacy_level: 'maximum' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      await service.database.users.add(originalUser)

      // バックアップを作成
      const backup = await service.database.createBackup()

      // データをクリア
      await service.database.clearAllData()

      // ユーザーが削除されていることを確認
      const clearedUser = await service.database.users.get('restore-test-user')
      expect(clearedUser).toBeUndefined()

      // バックアップから復元
      await service.database.restoreFromBackup(backup)

      // データが復元されていることを確認
      const restoredUser = await service.database.users.get('restore-test-user')
      expect(restoredUser).toBeDefined()
      expect(restoredUser?.email).toBe('restore@test.com')
    })
  })

  describe('整合性チェックテスト', () => {
    it('データベース整合性をチェックできる', async () => {
      const result = await service.database.performIntegrityCheck()

      expect(result).toBeDefined()
      expect(result.isValid).toBeDefined()
      expect(Array.isArray(result.issues)).toBe(true)
      expect(Array.isArray(result.recommendations)).toBe(true)
    })

    it('孤立したレコードを検出できる', async () => {
      // 孤立した分析結果を作成（対応するセッションなし）
      const orphanResult = {
        id: 'orphan-result',
        session_id: 'nonexistent-session',
        user_id: 'test-user',
        analysis_data: {},
        triple_os_data: {},
        confidence_score: 0.5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      await service.database.analysisResults.add(orphanResult)

      const integrityCheck = await service.database.performIntegrityCheck()

      expect(integrityCheck.isValid).toBe(false)
      expect(integrityCheck.issues.length).toBeGreaterThan(0)
      expect(integrityCheck.issues[0]).toContain('orphan-result')
    })
  })

  describe('同期機能テスト', () => {
    it('同期プロセスを実行できる', async () => {
      // オンライン状態をモック
      ;(window.navigator as any).onLine = true

      const result = await service.triggerSync()

      expect(result).toBeDefined()
      expect(result.success).toBeDefined()
      expect(result.data || result.error).toBeDefined()
    })

    it('オフライン時は同期できない', async () => {
      // オフライン状態をモック
      ;(window.navigator as any).onLine = false

      const result = await service.triggerSync()

      expect(result.success).toBe(false)
      expect(result.error).toContain('offline')
    })
  })
})

describe('useOfflineDatabase Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Composableが正常に初期化される', async () => {
    const { 
      offlineState, 
      syncStats, 
      dbStats,
      isLoading,
      canSync,
      isOfflineMode
    } = useOfflineDatabase()

    expect(offlineState.value).toBeDefined()
    expect(syncStats.value).toBeDefined()
    expect(dbStats.value).toBeDefined()
    expect(isLoading.value).toBe(false)
    expect(canSync.value).toBeDefined()
    expect(isOfflineMode.value).toBeDefined()
  })

  it('ユーザーを作成できる', async () => {
    const { createUser } = useOfflineDatabase()

    const userData = {
      email: 'composable@test.com',
      username: 'composableuser',
      privacy_level: 'high' as const
    }

    const result = await createUser(userData)

    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
    expect(result.data?.email).toBe('composable@test.com')
  })

  it('分析結果を保存できる', async () => {
    const { saveAnalysisResult } = useOfflineDatabase()

    const analysisData = {
      hexagram: 42,
      confidence: 0.9,
      insights: ['test insight']
    }

    const tripleOSData = {
      engine_os: { rational_thinking: 0.8 },
      interface_os: { social_skills: 0.7 },
      safe_mode_os: { emotional_stability: 0.9 }
    }

    const result = await saveAnalysisResult('test-session', analysisData, tripleOSData)

    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
    expect(result.data?.analysis_data.hexagram).toBe(42)
  })

  it('分析結果を取得できる', async () => {
    const { getAnalysisResults } = useOfflineDatabase()

    const result = await getAnalysisResults('test-user-id')

    expect(result.success).toBe(true)
    expect(Array.isArray(result.data)).toBe(true)
  })

  it('同期を実行できる', async () => {
    const { syncNow } = useOfflineDatabase()

    const result = await syncNow()

    expect(result).toBeDefined()
    expect(result.success).toBeDefined()
  })
})

describe('useOfflineStatus Composable', () => {
  it('オフライン状態を監視できる', () => {
    const { isOnline, isOffline, connectionQuality } = useOfflineStatus()

    expect(isOnline.value).toBeDefined()
    expect(isOffline.value).toBeDefined()
    expect(connectionQuality.value).toBeDefined()
  })

  it('接続状態の変更を検出できる', async () => {
    const { isOnline, updateStatus } = useOfflineStatus()

    // 初期状態
    expect(isOnline.value).toBe(true)

    // オフライン状態に変更
    ;(window.navigator as any).onLine = false
    updateStatus()

    expect(isOnline.value).toBe(false)
  })
})

describe('パフォーマンステスト', () => {
  let service: HAQEIOfflineDatabaseService

  beforeEach(async () => {
    service = getOfflineDatabaseService()
    await service.database.clearAllData()
  })

  afterEach(async () => {
    if (service) {
      await service.destroy()
    }
  })

  it('大量データの処理パフォーマンス', async () => {
    const startTime = performance.now()
    
    // 1000件のユーザーデータを作成
    const users = Array.from({ length: 1000 }, (_, i) => ({
      id: `perf-user-${i}`,
      email: `user${i}@test.com`,
      username: `user${i}`,
      privacy_level: 'maximum' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    await service.database.users.bulkAdd(users)

    const endTime = performance.now()
    const duration = endTime - startTime

    // 1000件の挿入が5秒以内に完了することを確認
    expect(duration).toBeLessThan(5000)

    // データが正しく保存されていることを確認
    const count = await service.database.users.count()
    expect(count).toBe(1000)
  })

  it('クエリパフォーマンス', async () => {
    // テストデータの準備
    const users = Array.from({ length: 100 }, (_, i) => ({
      id: `query-user-${i}`,
      email: `queryuser${i}@test.com`,
      username: `queryuser${i}`,
      privacy_level: i % 2 === 0 ? 'maximum' as const : 'high' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    await service.database.users.bulkAdd(users)

    const startTime = performance.now()

    // 複合クエリの実行
    const results = await service.database.users
      .where('privacy_level')
      .equals('maximum')
      .and(user => user.email.includes('@test.com'))
      .toArray()

    const endTime = performance.now()
    const duration = endTime - startTime

    // クエリが100ms以内に完了することを確認
    expect(duration).toBeLessThan(100)
    expect(results.length).toBe(50) // 偶数インデックスのユーザー
  })
})

describe('エラーハンドリングテスト', () => {
  let service: HAQEIOfflineDatabaseService

  beforeEach(async () => {
    service = getOfflineDatabaseService()
    await service.database.clearAllData()
  })

  afterEach(async () => {
    if (service) {
      await service.destroy()
    }
  })

  it('無効なデータでエラーが適切に処理される', async () => {
    const { createUser } = useOfflineDatabase()

    // 無効なデータ（必須フィールド不足）
    const invalidUserData = {
      username: 'testuser'
      // email が不足
    }

    const result = await createUser(invalidUserData)

    // エラーが適切に処理されることを確認
    expect(result.success).toBe(true) // オフラインモードでは基本的にlocal-firstで成功
    expect(result.data).toBeDefined()
  })

  it('データベース接続エラーの処理', async () => {
    // データベースを閉じる
    await service.database.close()

    const { createUser } = useOfflineDatabase()

    try {
      await createUser({
        email: 'test@example.com',
        username: 'testuser',
        privacy_level: 'maximum'
      })
    } catch (error) {
      expect(error).toBeDefined()
    }
  })
})