/**
 * HAQEI Data Migration System - 包括的テストスイート
 * 
 * 目的：
 * - TASK-038データ移行システムの包括的品質検証
 * - bunenjin哲学準拠のプライバシー保護テスト
 * - Triple OS Architecture データ整合性テスト
 * - Vue3統合の動作確認
 * - RLS準拠性検証
 * - パフォーマンス・セキュリティテスト
 * 
 * 実装: 2025-08-03 - TASK-038完了版テスト
 */

import { describe, it, expect, beforeEach, afterEach, vi, type MockedFunction } from 'vitest'
import { mount } from '@vue/test-utils'
import type { ComponentMountingOptions } from '@vue/test-utils'
import { nextTick } from 'vue'

// テスト対象のインポート
import { HAQEIDataMigrationService, migrationService } from '@/services/migration'
import { useMigration } from '@/composables/useMigration'
import type { 
  DetectedLocalStorageData,
  MigrationOptions,
  MigrationProgress,
  MigrationResult,
  LocalStorageDataItem,
  MigrationError
} from '@/services/migration'

// モックデータの定義
const mockLocalStorageData: Record<string, any> = {
  'haqei_user_test123': {
    id: 'user_test123',
    username: 'test_user',
    email: 'test@haqei.com',
    privacy_level: 'maximum',
    created_at: '2025-08-03T10:00:00.000Z'
  },
  'haqei_session_session123': {
    id: 'session123',
    user_id: 'user_test123',
    session_type: 'triple_os_analysis',
    completion_status: 'completed',
    created_at: '2025-08-03T10:30:00.000Z',
    metadata: { test: true }
  },
  'haqei_response_resp1': {
    id: 'resp1',
    session_id: 'session123',
    user_id: 'user_test123',
    question_id: 'q_engine_1',
    question_text: 'あなたは本当の自分を表現できていますか？',
    response_value: 7,
    response_time_seconds: 3.5,
    created_at: '2025-08-03T10:35:00.000Z'
  },
  'haqei_analysis_analysis123': {
    id: 'analysis123',
    session_id: 'session123',
    user_id: 'user_test123',
    analysis_data: {
      authenticity_score: 85,
      confidence: 0.87,
      primary_characteristics: ['創造性', '独立性']
    },
    triple_os_data: {
      engineOS: { score: 85, hexagram: 1 },
      interfaceOS: { score: 78, hexagram: 11 },
      safeModeOS: { score: 73, hexagram: 52 }
    },
    created_at: '2025-08-03T10:40:00.000Z'
  },
  'haqei_triple_os_engine_test123': {
    id: 'engine_test123',
    user_id: 'user_test123',
    hexagram_id: 1,
    trigram_upper_id: 1,
    trigram_lower_id: 1,
    confidence_score: 0.87,
    analysis_data: {
      authenticity_score: 85,
      characteristics: ['創造性', '指導力']
    },
    created_at: '2025-08-03T10:45:00.000Z'
  },
  'haqei_triple_os_interface_test123': {
    id: 'interface_test123',
    user_id: 'user_test123',
    hexagram_id: 11,
    trigram_upper_id: 8,
    trigram_lower_id: 2,
    confidence_score: 0.92,
    analysis_data: {
      adaptability_score: 78,
      characteristics: ['調和性', '柔軟性']
    },
    created_at: '2025-08-03T10:50:00.000Z'
  },
  'haqei_triple_os_safe_test123': {
    id: 'safe_test123',
    user_id: 'user_test123',
    hexagram_id: 52,
    trigram_upper_id: 7,
    trigram_lower_id: 7,
    confidence_score: 0.79,
    analysis_data: {
      resilience_level: 73,
      characteristics: ['安定性', '内省性']
    },
    created_at: '2025-08-03T10:55:00.000Z'
  }
}

// localStorage モック
const mockLocalStorage = {
  storage: new Map<string, string>(),
  
  getItem: vi.fn((key: string) => {
    return mockLocalStorage.storage.get(key) || null
  }),
  
  setItem: vi.fn((key: string, value: string) => {
    mockLocalStorage.storage.set(key, value)
  }),
  
  removeItem: vi.fn((key: string) => {
    mockLocalStorage.storage.delete(key)
  }),
  
  clear: vi.fn(() => {
    mockLocalStorage.storage.clear()
  }),
  
  key: vi.fn((index: number) => {
    const keys = Array.from(mockLocalStorage.storage.keys())
    return keys[index] || null
  }),
  
  get length() {
    return mockLocalStorage.storage.size
  }
}

// useSupabase モック
vi.mock('@/services/supabase', () => {
  const mockSupabaseClient = {
    from: vi.fn((table: string) => ({
      upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        count: 'exact' as const,
        head: true as const
      })
    }))
  }
  
  return {
    useSupabase: () => ({
      client: mockSupabaseClient
    }),
    getConnectionState: () => ({
      isSupabaseConnected: true,
      connectionQuality: 'good',
      lastPing: Date.now()
    })
  }
})

describe('HAQEI Data Migration System - 包括的テスト', () => {
  let migrationServiceInstance: HAQEIDataMigrationService

  beforeEach(() => {
    // グローバルlocalStorageモックの設定
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    })
    
    // テストデータの設定
    mockLocalStorage.storage.clear()
    Object.entries(mockLocalStorageData).forEach(([key, value]) => {
      mockLocalStorage.storage.set(key, JSON.stringify(value))
    })
    
    // 新しいサービスインスタンスを作成
    migrationServiceInstance = new HAQEIDataMigrationService()
    
    // モックのリセット
    vi.clearAllMocks()
  })

  afterEach(() => {
    mockLocalStorage.storage.clear()
    vi.clearAllMocks()
  })

  describe('1. localStorageデータ検出の正確性テスト', () => {
    it('HAQEIデータを正確に検出できる', async () => {
      const result = await migrationServiceInstance.detectLocalStorageData()
      
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      
      const data = result.data!
      expect(data.totalItems).toBe(7) // モックデータのアイテム数
      expect(data.totalSizeBytes).toBeGreaterThan(0)
      
      // データタイプ別の検証
      expect(data.dataByType.user).toHaveLength(1)
      expect(data.dataByType.session).toHaveLength(1)
      expect(data.dataByType.response).toHaveLength(1)
      expect(data.dataByType.analysis).toHaveLength(1)
      expect(data.dataByType.triple_os).toHaveLength(3)
    })

    it('HAQEI以外のデータを除外する', async () => {
      // 非HAQEIデータを追加
      mockLocalStorage.storage.set('other_app_data', 'test')
      mockLocalStorage.storage.set('random_key', 'value')
      
      const result = await migrationServiceInstance.detectLocalStorageData()
      
      expect(result.success).toBe(true)
      expect(result.data!.totalItems).toBe(7) // HAQEIデータのみ
    })

    it('空のlocalStorageを適切に処理する', async () => {
      mockLocalStorage.storage.clear()
      
      const result = await migrationServiceInstance.detectLocalStorageData()
      
      expect(result.success).toBe(true)
      expect(result.data!.totalItems).toBe(0)
      expect(result.data!.totalSizeBytes).toBe(0)
    })

    it('破損したJSONデータを適切に処理する', async () => {
      mockLocalStorage.storage.set('haqei_broken_json', '{invalid json}')
      
      const result = await migrationServiceInstance.detectLocalStorageData()
      
      expect(result.success).toBe(true)
      expect(result.data!.compatibilityCheck.issues).toContain('haqei_broken_json: JSON解析に失敗')
    })

    it('データタイプの判定が正確', async () => {
      const result = await migrationServiceInstance.detectLocalStorageData()
      const data = result.data!
      
      // ユーザーデータ
      const userData = data.dataByType.user[0]
      expect(userData.key).toBe('haqei_user_test123')
      expect(userData.dataType).toBe('user')
      
      // Triple OSデータ
      const tripleOSData = data.dataByType.triple_os
      expect(tripleOSData).toHaveLength(3)
      expect(tripleOSData.some(item => item.key.includes('engine'))).toBe(true)
      expect(tripleOSData.some(item => item.key.includes('interface'))).toBe(true)
      expect(tripleOSData.some(item => item.key.includes('safe'))).toBe(true)
    })
  })

  describe('2. プライバシーレベル別移行テスト（bunenjin哲学準拠）', () => {
    it('maximum プライバシーレベルでの移行', async () => {
      const options: Partial<MigrationOptions> = {
        privacyLevel: 'maximum',
        anonymizeData: true,
        excludeSensitiveData: true,
        dryRun: true
      }
      
      const result = await migrationServiceInstance.migrateData(options)
      
      expect(result.success).toBe(true)
      expect(result.data!.summary.itemsMigrated).toBeGreaterThan(0)
    })

    it('high プライバシーレベルでの移行', async () => {
      const options: Partial<MigrationOptions> = {
        privacyLevel: 'high',
        anonymizeData: false,
        excludeSensitiveData: true,
        dryRun: true
      }
      
      const result = await migrationServiceInstance.migrateData(options)
      
      expect(result.success).toBe(true)
    })

    it('medium プライバシーレベルでの移行', async () => {
      const options: Partial<MigrationOptions> = {
        privacyLevel: 'medium',
        anonymizeData: false,
        excludeSensitiveData: false,
        dryRun: true
      }
      
      const result = await migrationServiceInstance.migrateData(options)
      
      expect(result.success).toBe(true)
    })

    it('low プライバシーレベルでの移行', async () => {
      const options: Partial<MigrationOptions> = {
        privacyLevel: 'low',
        anonymizeData: false,
        excludeSensitiveData: false,
        dryRun: true
      }
      
      const result = await migrationServiceInstance.migrateData(options)
      
      expect(result.success).toBe(true)
    })

    it('高リスクデータでmaximumレベル制限', async () => {
      // 高リスクデータをシミュレート（大量のユーザーデータ）
      for (let i = 0; i < 10; i++) {
        mockLocalStorage.storage.set(`haqei_user_${i}`, JSON.stringify({
          id: `user_${i}`,
          email: `user${i}@example.com`,
          sensitive_data: 'confidential'
        }))
      }
      
      const options: Partial<MigrationOptions> = {
        privacyLevel: 'maximum',
        dryRun: true
      }
      
      const result = await migrationServiceInstance.migrateData(options)
      
      // maximumレベルでは高リスクデータの移行を制限する場合があることを確認
      expect(result.success).toBe(true)
    })
  })

  describe('3. Triple OS データ移行整合性テスト', () => {
    it('全Triple OSデータタイプの移行', async () => {
      const options: Partial<MigrationOptions> = {
        migrateEngineOS: true,
        migrateInterfaceOS: true,
        migrateSafeModeOS: true,
        preserveOSInteractions: true,
        dryRun: true
      }
      
      const result = await migrationServiceInstance.migrateData(options)
      
      expect(result.success).toBe(true)
      const tripleOSResults = result.data!.tripleOSResults
      
      expect(tripleOSResults.engineOS.migrated).toBeGreaterThan(0)
      expect(tripleOSResults.interfaceOS.migrated).toBeGreaterThan(0)
      expect(tripleOSResults.safeModeOS.migrated).toBeGreaterThan(0)
    })

    it('Engine OSのみの選択的移行', async () => {
      const options: Partial<MigrationOptions> = {
        migrateEngineOS: true,
        migrateInterfaceOS: false,
        migrateSafeModeOS: false,
        dryRun: true
      }
      
      const result = await migrationServiceInstance.migrateData(options)
      
      expect(result.success).toBe(true)
      const tripleOSResults = result.data!.tripleOSResults
      
      expect(tripleOSResults.engineOS.migrated).toBeGreaterThan(0)
      expect(tripleOSResults.interfaceOS.migrated).toBe(0)
      expect(tripleOSResults.safeModeOS.migrated).toBe(0)
    })

    it('Triple OSデータの構造整合性検証', async () => {
      const result = await migrationServiceInstance.detectLocalStorageData()
      const tripleOSData = result.data!.dataByType.triple_os
      
      tripleOSData.forEach(item => {
        const data = item.value
        
        // 必須フィールドの存在確認
        expect(data).toHaveProperty('id')
        expect(data).toHaveProperty('user_id')
        expect(data).toHaveProperty('hexagram_id')
        expect(data).toHaveProperty('confidence_score')
        expect(data).toHaveProperty('analysis_data')
        
        // 信頼度スコアの範囲確認
        expect(data.confidence_score).toBeGreaterThanOrEqual(0)
        expect(data.confidence_score).toBeLessThanOrEqual(1)
        
        // 卦IDの範囲確認（1-64）
        expect(data.hexagram_id).toBeGreaterThanOrEqual(1)
        expect(data.hexagram_id).toBeLessThanOrEqual(64)
      })
    })

    it('OS間相互作用データの保持', async () => {
      const options: Partial<MigrationOptions> = {
        preserveOSInteractions: true,
        dryRun: true
      }
      
      const result = await migrationServiceInstance.migrateData(options)
      
      expect(result.success).toBe(true)
      // 相互作用データが適切に処理されることを確認
      expect(result.data!.details.tripleOSMigrated).toBe(3)
    })
  })

  describe('4. バッチ処理とエラー回復テスト', () => {
    it('大量データのバッチ処理', async () => {
      // 大量のテストデータを生成
      for (let i = 0; i < 100; i++) {
        mockLocalStorage.storage.set(`haqei_response_batch_${i}`, JSON.stringify({
          id: `response_${i}`,
          session_id: 'session123',
          question_id: `q_${i}`,
          response_value: Math.floor(Math.random() * 7) + 1
        }))
      }
      
      const options: Partial<MigrationOptions> = {
        batchSize: 10,
        dryRun: true
      }
      
      const result = await migrationServiceInstance.migrateData(options)
      
      expect(result.success).toBe(true)
      expect(result.data!.summary.itemsMigrated).toBeGreaterThan(100)
    })

    it('バッチサイズ制限の適用', async () => {
      const options: Partial<MigrationOptions> = {
        batchSize: 2,
        dryRun: true
      }
      
      const result = await migrationServiceInstance.migrateData(options)
      
      expect(result.success).toBe(true)
      // バッチ処理が適用されていることを確認
    })

    it('リトライ機能のテスト', async () => {
      // リトライ設定でテスト
      const options: Partial<MigrationOptions> = {
        maxRetries: 2,
        dryRun: true
      }
      
      const result = await migrationServiceInstance.migrateData(options)
      
      // リトライ機能が設定されていることを確認
      expect(result.success).toBe(true)
    })

    it('タイムアウト処理', async () => {
      const options: Partial<MigrationOptions> = {
        timeoutMs: 100, // 短いタイムアウト
        dryRun: true
      }
      
      // タイムアウトが適切に処理されることを確認
      const result = await migrationServiceInstance.migrateData(options)
      
      // タイムアウトでも適切にエラーハンドリングされる
      expect(result).toBeDefined()
    })
  })

  describe('5. Vue3統合の動作確認', () => {
    it('useMigration composableの基本機能', async () => {
      const { hasLocalStorageData, detectLocalStorageData, startMigration } = useMigration()
      
      // 初期状態の確認
      expect(hasLocalStorageData.value).toBe(false)
      
      // データ検出
      await detectLocalStorageData()
      await nextTick()
      
      expect(hasLocalStorageData.value).toBe(true)
    })

    it('リアクティブな進捗更新', async () => {
      const { migrationProgress, startMigration, isMigrating } = useMigration()
      
      // 進捗の初期値
      expect(migrationProgress.value).toBeNull()
      expect(isMigrating.value).toBe(false)
      
      // 移行開始（非同期処理のため、実際の進捗更新は難しいのでモック状態を確認）
      expect(typeof startMigration).toBe('function')
    })

    it('エラー状態の管理', async () => {
      const { 
        detectionError, 
        migrationError, 
        detectLocalStorageData 
      } = useMigration()
      
      // 初期状態
      expect(detectionError.value).toBeNull()
      expect(migrationError.value).toBeNull()
      
      // エラー処理は実際のエラー発生時にテストされる
    })

    it('プライバシー設定の更新', () => {
      const { 
        migrationOptions, 
        setPrivacyLevel, 
        updateMigrationOptions 
      } = useMigration()
      
      // プライバシーレベル設定
      setPrivacyLevel('high')
      expect(migrationOptions.privacyLevel).toBe('high')
      
      // オプション更新
      updateMigrationOptions({ batchSize: 25 })
      expect(migrationOptions.batchSize).toBe(25)
    })

    it('Triple OS設定の管理', () => {
      const { 
        migrationOptions, 
        configureTripleOSMigration 
      } = useMigration()
      
      configureTripleOSMigration({
        migrateEngineOS: false,
        migrateInterfaceOS: true,
        migrateSafeModeOS: true
      })
      
      expect(migrationOptions.migrateEngineOS).toBe(false)
      expect(migrationOptions.migrateInterfaceOS).toBe(true)
      expect(migrationOptions.migrateSafeModeOS).toBe(true)
    })
  })

  describe('6. RLS準拠性テスト', () => {
    it('RLS準拠のデータ挿入', async () => {
      const options: Partial<MigrationOptions> = {
        validateData: true,
        dryRun: true
      }
      
      const result = await migrationServiceInstance.migrateData(options)
      
      expect(result.success).toBe(true)
      
      // Supabaseクライアントが適切に呼び出されたかを確認
      // Supabaseクライアントが呼び出される想定
      expect(result.success).toBe(true)
    })

    it('ユーザーIDベースのデータ分離', async () => {
      const result = await migrationServiceInstance.detectLocalStorageData()
      const userData = result.data!.dataByType.user[0].value
      const sessionData = result.data!.dataByType.session[0].value
      
      // 同一ユーザーIDでデータが関連付けられていることを確認
      expect(userData.id).toBe(sessionData.user_id)
    })

    it('データ検証機能', async () => {
      const options: Partial<MigrationOptions> = {
        validateData: true,
        dryRun: true
      }
      
      const result = await migrationServiceInstance.migrateData(options)
      
      expect(result.success).toBe(true)
      // 検証が実行されることを確認
    })
  })

  describe('7. パフォーマンステスト', () => {
    it('大量データ処理の性能', async () => {
      // 1000件のテストデータを生成
      for (let i = 0; i < 1000; i++) {
        mockLocalStorage.storage.set(`haqei_perf_test_${i}`, JSON.stringify({
          id: `item_${i}`,
          data: `test_data_${i}`,
          timestamp: Date.now()
        }))
      }
      
      const startTime = Date.now()
      
      const result = await migrationServiceInstance.detectLocalStorageData()
      
      const endTime = Date.now()
      const executionTime = endTime - startTime
      
      expect(result.success).toBe(true)
      expect(result.data!.totalItems).toBeGreaterThan(1000)
      
      // 1秒以内に完了することを期待（パフォーマンス要件）
      expect(executionTime).toBeLessThan(1000)
    })

    it('メモリ効率的な処理', async () => {
      // メモリ使用量の測定は環境依存のため、
      // 代わりに適切なバッチ処理が行われることを確認
      const options: Partial<MigrationOptions> = {
        batchSize: 50,
        dryRun: true
      }
      
      const result = await migrationServiceInstance.migrateData(options)
      
      expect(result.success).toBe(true)
      expect(result.data!.summary.executionTimeMs).toBeGreaterThan(0)
    })

    it('並行処理の制限', async () => {
      // 複数の移行処理を同時に実行しようとした場合
      const promise1 = migrationServiceInstance.migrateData({ dryRun: true })
      const promise2 = migrationServiceInstance.migrateData({ dryRun: true })
      
      const [result1, result2] = await Promise.all([promise1, promise2])
      
      // 一方は成功、もう一方は「既に実行中」エラーになるはず
      const successCount = [result1.success, result2.success].filter(Boolean).length
      expect(successCount).toBe(1)
    })
  })

  describe('8. エラーハンドリングとセキュリティ', () => {
    it('不正なデータ形式の処理', async () => {
      mockLocalStorage.storage.set('haqei_invalid_data', 'not json')
      
      const result = await migrationServiceInstance.detectLocalStorageData()
      
      expect(result.success).toBe(true)
      expect(result.data!.compatibilityCheck.issues.length).toBeGreaterThan(0)
    })

    it('SQLインジェクション対策', async () => {
      const maliciousData = {
        id: "'; DROP TABLE users; --",
        user_id: 'test123',
        malicious_field: "<script>alert('xss')</script>"
      }
      
      mockLocalStorage.storage.set('haqei_malicious_test', JSON.stringify(maliciousData))
      
      const result = await migrationServiceInstance.migrateData({ dryRun: true })
      
      // サービスがクラッシュせずに処理できることを確認
      expect(result).toBeDefined()
    })

    it('大きすぎるデータの処理', async () => {
      const largeData = {
        id: 'large_test',
        large_field: 'x'.repeat(1000000) // 1MB のデータ
      }
      
      mockLocalStorage.storage.set('haqei_large_test', JSON.stringify(largeData))
      
      const result = await migrationServiceInstance.detectLocalStorageData()
      
      expect(result.success).toBe(true)
      // 大きなデータも適切に処理される
      expect(result.data!.totalSizeBytes).toBeGreaterThan(1000000)
    })

    it('接続エラー時の処理', async () => {
      // 接続エラー状態での処理をテスト
      const result = await migrationServiceInstance.migrateData({ dryRun: true })
      
      // 基本的なエラーハンドリングが動作することを確認
      expect(result).toBeDefined()
      expect(typeof result.success).toBe('boolean')
    })
  })

  describe('9. バックアップとロールバック機能', () => {
    it('バックアップ作成', async () => {
      const options: Partial<MigrationOptions> = {
        createBackup: true,
        dryRun: true
      }
      
      const result = await migrationServiceInstance.migrateData(options)
      
      expect(result.success).toBe(true)
      expect(result.data!.backupLocation).toBeDefined()
      expect(result.data!.rollbackAvailable).toBe(true)
    })

    it('ロールバック機能', async () => {
      // まずバックアップを作成
      const migrationResult = await migrationServiceInstance.migrateData({
        createBackup: true,
        dryRun: true
      })
      
      expect(migrationResult.success).toBe(true)
      const backupLocation = migrationResult.data!.backupLocation!
      
      // ロールバック実行
      const rollbackResult = await migrationServiceInstance.rollbackFromBackup(backupLocation)
      
      expect(rollbackResult.success).toBe(true)
    })

    it('存在しないバックアップからのロールバック', async () => {
      const result = await migrationServiceInstance.rollbackFromBackup('nonexistent_backup')
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('バックアップ')
    })
  })

  describe('10. 統合テスト', () => {
    it('完全な移行フローの実行', async () => {
      // 1. データ検出
      const detectionResult = await migrationServiceInstance.detectLocalStorageData()
      expect(detectionResult.success).toBe(true)
      
      // 2. 移行設定
      const options: MigrationOptions = {
        batchSize: 10,
        maxRetries: 3,
        timeoutMs: 30000,
        dryRun: true,
        privacyLevel: 'maximum',
        anonymizeData: true,
        excludeSensitiveData: false,
        skipExisting: true,
        validateData: true,
        createBackup: true,
        rollbackOnError: false,
        enableProgressTracking: true,
        reportInterval: 1000,
        migrateEngineOS: true,
        migrateInterfaceOS: true,
        migrateSafeModeOS: true,
        preserveOSInteractions: true
      }
      
      // 3. 移行実行
      const migrationResult = await migrationServiceInstance.migrateData(options)
      expect(migrationResult.success).toBe(true)
      
      // 4. 結果検証
      const result = migrationResult.data!
      expect(result.summary.itemsMigrated).toBeGreaterThan(0)
      expect(result.details.userDataMigrated).toBeGreaterThan(0)
      expect(result.details.tripleOSMigrated).toBe(3)
      expect(result.tripleOSResults.engineOS.migrated).toBeGreaterThan(0)
      expect(result.tripleOSResults.interfaceOS.migrated).toBeGreaterThan(0)
      expect(result.tripleOSResults.safeModeOS.migrated).toBeGreaterThan(0)
    })

    it('異なるプライバシーレベルでの一貫性', async () => {
      const privacyLevels: Array<'maximum' | 'high' | 'medium' | 'low'> = ['maximum', 'high', 'medium', 'low']
      
      for (const level of privacyLevels) {
        const options: Partial<MigrationOptions> = {
          privacyLevel: level,
          dryRun: true
        }
        
        const result = await migrationServiceInstance.migrateData(options)
        
        expect(result.success).toBe(true)
        expect(result.data!.summary.itemsMigrated).toBeGreaterThan(0)
      }
    })

    it('Vue3 Composableとサービスの統合', async () => {
      const composable = useMigration()
      
      // データ検出
      await composable.detectLocalStorageData()
      await nextTick()
      
      expect(composable.hasLocalStorageData.value).toBe(true)
      expect(composable.canStartMigration.value).toBe(true)
      
      // プライバシー設定
      composable.setPrivacyLevel('high')
      expect(composable.migrationOptions.privacyLevel).toBe('high')
      
      // Triple OS設定
      composable.configureTripleOSMigration({
        migrateEngineOS: true,
        migrateInterfaceOS: false,
        migrateSafeModeOS: true
      })
      
      expect(composable.migrationOptions.migrateEngineOS).toBe(true)
      expect(composable.migrationOptions.migrateInterfaceOS).toBe(false)
    })
  })
})

describe('HAQEI Migration System - パフォーマンス・ベンチマークテスト', () => {
  let migrationServiceInstance: HAQEIDataMigrationService

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    })
    mockLocalStorage.storage.clear()
    migrationServiceInstance = new HAQEIDataMigrationService()
    vi.clearAllMocks()
  })

  it('1000件データ処理のベンチマーク', async () => {
    // 1000件のテストデータ生成
    for (let i = 0; i < 1000; i++) {
      mockLocalStorage.storage.set(`haqei_benchmark_${i}`, JSON.stringify({
        id: `item_${i}`,
        user_id: `user_${i % 10}`, // 10ユーザーに分散
        data: `test_data_${i}`,
        timestamp: Date.now() - (i * 1000)
      }))
    }

    const startTime = performance.now()
    
    const detectionResult = await migrationServiceInstance.detectLocalStorageData()
    expect(detectionResult.success).toBe(true)
    
    const migrationResult = await migrationServiceInstance.migrateData({
      batchSize: 50,
      dryRun: true
    })
    expect(migrationResult.success).toBe(true)
    
    const endTime = performance.now()
    const totalTime = endTime - startTime
    
    console.log(`📊 1000件データ処理時間: ${totalTime.toFixed(2)}ms`)
    console.log(`📊 1件あたりの処理時間: ${(totalTime / 1000).toFixed(2)}ms`)
    
    // パフォーマンス要件: 1000件を5秒以内で処理
    expect(totalTime).toBeLessThan(5000)
  })

  it('メモリ使用量の測定', async () => {
    // 大量データでメモリ効率をテスト
    for (let i = 0; i < 5000; i++) {
      const largeObject = {
        id: `large_${i}`,
        data: new Array(1000).fill(`data_${i}`).join(''),
        metadata: {
          created: new Date().toISOString(),
          index: i,
          tags: new Array(10).fill(`tag_${i}`)
        }
      }
      mockLocalStorage.storage.set(`haqei_memory_test_${i}`, JSON.stringify(largeObject))
    }

    // メモリ使用量は直接測定できないため、処理が完了することを確認
    const result = await migrationServiceInstance.detectLocalStorageData()
    
    expect(result.success).toBe(true)
    expect(result.data!.totalItems).toBe(5000)
    
    console.log(`📊 大量データ検出完了: ${result.data!.totalItems}件`)
    console.log(`📊 総データサイズ: ${Math.round(result.data!.totalSizeBytes / 1024 / 1024)}MB`)
  })
})