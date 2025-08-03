/**
 * HAQEI CRUD操作 Composable テストスイート
 * 
 * 目的：
 * - useCRUDOperationsの包括的なテスト
 * - エラーハンドリング・バリデーション検証
 * - パフォーマンス測定・品質保証
 * - bunenjin哲学準拠の動作確認
 * 
 * カバレッジ：
 * - 基本CRUD操作（Create, Read, Update, Delete）
 * - バッチ操作（一括作成・削除）
 * - 検索・フィルタリング機能
 * - エラー回復・オフライン対応
 * - パフォーマンス監視
 * 
 * 更新: 2025-08-03 - TASK-036テスト実装完了
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { useCRUDOperations, useAnalysisResults, useDiagnosisHistory } from '@/composables/useCRUDOperations'

// モック設定
const mockDatabase = {
  currentUser: ref({ id: 'test-user-id', email: 'test@example.com' }),
  currentSession: ref({ id: 'test-session-id' }),
  canUseRealtime: ref(true),
  isOffline: ref(false),
  analysisResultsOperations: {
    getAllAnalysisResults: vi.fn(),
    getAnalysisResult: vi.fn(),
    saveAnalysisResult: vi.fn(),
    updateAnalysisResult: vi.fn(),
    deleteAnalysisResult: vi.fn()
  },
  historyOperations: {
    getDiagnosisHistory: vi.fn(),
    deleteDiagnosisHistory: vi.fn(),
    batchDeleteHistory: vi.fn()
  },
  userOperations: {
    createOrGetUser: vi.fn(),
    updatePrivacySettings: vi.fn()
  },
  ichingOperations: {
    getHexagram: vi.fn()
  }
}

const mockRealtime = {
  subscribeToAnalysisProgress: vi.fn(() => ({ unsubscribe: vi.fn() })),
  subscribeToQuestionResponses: vi.fn(() => ({ unsubscribe: vi.fn() }))
}

// useDatabase mock
vi.mock('@/composables/useDatabase', () => ({
  useDatabase: () => mockDatabase
}))

// useSupabaseRealtime mock
vi.mock('@/services/supabase', () => ({
  useSupabaseRealtime: () => mockRealtime
}))

describe('useCRUDOperations', () => {
  let crud: ReturnType<typeof useCRUDOperations>

  beforeEach(() => {
    vi.clearAllMocks()
    crud = useCRUDOperations('analysis_results', {
      autoLoad: false,
      enableRealtime: false
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('基本CRUD操作', () => {
    it('データの読み込み（loadAll）が正常に動作する', async () => {
      // Arrange
      const mockData = [
        { id: '1', session_id: 'session-1', analysis_data: {}, triple_os_data: {} },
        { id: '2', session_id: 'session-2', analysis_data: {}, triple_os_data: {} }
      ]
      mockDatabase.analysisResultsOperations.getAllAnalysisResults.mockResolvedValue({
        success: true,
        data: mockData
      })

      // Act
      const result = await crud.loadAll()

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockData)
      expect(crud.items.value).toEqual(mockData)
      expect(crud.hasItems.value).toBe(true)
      expect(crud.isEmpty.value).toBe(false)
    })

    it('単一データの読み込み（loadById）が正常に動作する', async () => {
      // Arrange
      const mockData = { id: '1', session_id: 'session-1', analysis_data: {} }
      mockDatabase.analysisResultsOperations.getAnalysisResult.mockResolvedValue({
        success: true,
        data: mockData
      })

      // Act
      const result = await crud.loadById('1')

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockData)
      expect(crud.currentItem.value).toEqual(mockData)
    })

    it('データの作成（create）が正常に動作する', async () => {
      // Arrange
      const newData = { session_id: 'new-session', analysis_data: {}, triple_os_data: {} }
      const createdData = { id: 'new-id', ...newData }
      mockDatabase.analysisResultsOperations.saveAnalysisResult.mockResolvedValue({
        success: true,
        data: createdData
      })

      // Act
      const result = await crud.create(newData)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toEqual(createdData)
      expect(crud.items.value).toContainEqual(createdData)
    })

    it('データの更新（update）が正常に動作する', async () => {
      // Arrange
      const existingData = { id: '1', session_id: 'session-1', analysis_data: {} }
      crud.items.value = [existingData]
      crud.currentItem.value = existingData

      const updateData = { analysis_data: { updated: true } }
      const updatedData = { ...existingData, ...updateData }
      mockDatabase.analysisResultsOperations.updateAnalysisResult.mockResolvedValue({
        success: true,
        data: updatedData
      })

      // Act
      const result = await crud.update('1', updateData)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toEqual(updatedData)
      expect(crud.items.value[0]).toEqual(updatedData)
      expect(crud.currentItem.value).toEqual(updatedData)
    })

    it('データの削除（remove）が正常に動作する', async () => {
      // Arrange
      const existingData = { id: '1', session_id: 'session-1' }
      crud.items.value = [existingData]
      crud.currentItem.value = existingData

      mockDatabase.analysisResultsOperations.deleteAnalysisResult.mockResolvedValue({
        success: true,
        data: true
      })

      // Act
      const result = await crud.remove('1')

      // Assert
      expect(result.success).toBe(true)
      expect(crud.items.value).not.toContainEqual(existingData)
      expect(crud.currentItem.value).toBeNull()
    })
  })

  describe('バッチ操作', () => {
    it('バッチ削除（batchRemove）が正常に動作する', async () => {
      // Arrange
      const ids = ['1', '2', '3']
      crud.items.value = [
        { id: '1', name: 'item1' },
        { id: '2', name: 'item2' },
        { id: '3', name: 'item3' },
        { id: '4', name: 'item4' }
      ]

      // remove関数をモック
      vi.spyOn(crud, 'remove').mockImplementation(async (id: string) => ({
        success: true,
        data: true
      }))

      // Act
      const result = await crud.batchRemove(ids)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data?.successfullyDeleted).toBe(3)
      expect(result.data?.failed).toBe(0)
      expect(result.data?.errors).toHaveLength(0)
    })

    it('バッチ作成（batchCreate）が正常に動作する', async () => {
      // Arrange
      const dataList = [
        { session_id: 'session-1', analysis_data: {}, triple_os_data: {} },
        { session_id: 'session-2', analysis_data: {}, triple_os_data: {} }
      ]

      // create関数をモック
      vi.spyOn(crud, 'create').mockImplementation(async (data: any) => ({
        success: true,
        data: { id: `new-${Date.now()}`, ...data }
      }))

      // Act
      const result = await crud.batchCreate(dataList)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data?.created).toHaveLength(2)
      expect(result.data?.failed).toBe(0)
      expect(result.data?.errors).toHaveLength(0)
    })

    it('バッチ操作でエラー時の部分的成功を正しく処理する', async () => {
      // Arrange
      const ids = ['1', '2', '3']
      
      // 2番目の削除が失敗するようにモック
      vi.spyOn(crud, 'remove').mockImplementation(async (id: string) => {
        if (id === '2') {
          return { success: false, error: 'Deletion failed' }
        }
        return { success: true, data: true }
      })

      // Act
      const result = await crud.batchRemove(ids)

      // Assert
      expect(result.success).toBe(true) // 部分的成功
      expect(result.data?.successfullyDeleted).toBe(2)
      expect(result.data?.failed).toBe(1)
      expect(result.data?.errors).toContain('ID 2: Deletion failed')
    })
  })

  describe('検索・フィルタリング機能', () => {
    it('検索（search）が正常に動作する', async () => {
      // Arrange
      const mockSearchResults = [
        { id: '1', metadata: 'test search term', session_id: 'session-1' }
      ]
      
      // loadAll関数をモック
      vi.spyOn(crud, 'loadAll').mockResolvedValue({
        success: true,
        data: mockSearchResults
      })

      // Act
      const result = await crud.search({
        query: 'test search',
        exactMatch: false
      })

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockSearchResults)
    })

    it('フィルタリング条件の追加・クリアが正常に動作する', () => {
      // Act
      crud.addFilter('status', 'eq', 'completed')
      crud.addFilter('created_at', 'gte', '2025-01-01')

      // Assert
      expect(crud.filters.value).toHaveLength(2)
      expect(crud.filters.value[0]).toEqual({
        field: 'status',
        operator: 'eq',
        value: 'completed'
      })

      // Act - クリア
      crud.clearFilters()

      // Assert
      expect(crud.filters.value).toHaveLength(0)
    })

    it('ソート条件の設定が正常に動作する', () => {
      // Act
      crud.setSorting('created_at', 'asc')

      // Assert
      expect(crud.sortBy.value).toBe('created_at')
      expect(crud.sortOrder.value).toBe('asc')
    })
  })

  describe('データバリデーション', () => {
    it('作成時のバリデーションが正常に動作する', () => {
      // Arrange
      const validData = {
        session_id: 'session-1',
        analysis_data: { score: 85 },
        triple_os_data: { engine: {}, interface: {}, safeMode: {} }
      }

      // Act
      const result = crud.validateData(validData, 'create')

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('必須フィールド不足時のバリデーションエラーを正しく検出する', () => {
      // Arrange
      const invalidData = {
        analysis_data: { score: 85 }
        // session_idとtriple_os_dataが不足
      }

      // Act
      const result = crud.validateData(invalidData, 'create')

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('session_idは必須項目です')
      expect(result.errors).toContain('triple_os_dataは必須項目です')
    })

    it('データ品質の警告を正しく生成する', () => {
      // Arrange
      const dataWithLowConfidence = {
        session_id: 'session-1',
        analysis_data: { confidence: 0.5 }, // 低い信頼度
        triple_os_data: {}
      }

      // Act
      const result = crud.validateData(dataWithLowConfidence, 'create')

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.warnings).toContain('分析の信頼度が低い値です')
    })
  })

  describe('パフォーマンス監視', () => {
    it('パフォーマンス統計が正しく更新される', () => {
      // Act
      crud.updatePerformanceStats('create', 150, true, false)
      crud.updatePerformanceStats('read', 50, true, true)

      // Assert
      expect(crud.performanceStats.value.totalOperations).toBe(2)
      expect(crud.performanceStats.value.lastOperationTime).toBe(50)
      expect(crud.performanceStats.value.operationHistory).toHaveLength(2)
      expect(crud.performanceStats.value.cacheHitRate).toBe(50) // 1/2 = 50%
    })

    it('エラー率が正しく計算される', () => {
      // Act
      crud.updatePerformanceStats('create', 100, true)
      crud.updatePerformanceStats('create', 120, false) // エラー
      crud.updatePerformanceStats('read', 80, true)
      crud.updatePerformanceStats('update', 200, false) // エラー

      // Assert
      expect(crud.performanceStats.value.errorRate).toBe(50) // 2/4 = 50%
    })
  })

  describe('エラーハンドリング・回復機能', () => {
    it('エラー発生時の回復機能が正常に動作する', async () => {
      // Arrange
      const failedOperation = {
        type: 'create' as const,
        data: { session_id: 'test', analysis_data: {}, triple_os_data: {} }
      }

      // create関数をモック（今度は成功）
      vi.spyOn(crud, 'create').mockResolvedValue({
        success: true,
        data: { id: 'recovered-id', ...failedOperation.data }
      })

      // Act
      const result = await crud.recoverFromError(failedOperation)

      // Assert
      expect(result.success).toBe(true)
      expect(crud.create).toHaveBeenCalledWith(failedOperation.data)
    })

    it('オフライン時のエラー回復が適切に処理される', async () => {
      // Arrange
      mockDatabase.isOffline.value = true
      const failedOperation = { type: 'create' as const, data: {} }

      // Act
      const result = await crud.recoverFromError(failedOperation)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('オフライン状態のため回復できません')
    })
  })

  describe('ページネーション', () => {
    it('次のページの読み込みが正常に動作する', async () => {
      // Arrange
      crud.pagination.value.currentPage = 1
      crud.pagination.value.totalPages = 3
      crud.pagination.value.hasNext = true

      vi.spyOn(crud, 'loadAll').mockResolvedValue({
        success: true,
        data: [{ id: 'page2-item1' }, { id: 'page2-item2' }]
      })

      // Act
      const result = await crud.loadNextPage()

      // Assert
      expect(result.success).toBe(true)
      expect(crud.pagination.value.currentPage).toBe(2)
    })

    it('最後のページで次のページの読み込みが失敗する', async () => {
      // Arrange
      crud.pagination.value.currentPage = 3
      crud.pagination.value.totalPages = 3
      crud.pagination.value.hasNext = false

      // Act
      const result = await crud.loadNextPage()

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('次のページがありません')
    })
  })

  describe('リアルタイム機能', () => {
    it('リアルタイム更新の設定が正常に動作する', () => {
      // Arrange
      const crudWithRealtime = useCRUDOperations('analysis_sessions', {
        enableRealtime: true,
        autoLoad: false
      })

      // Act
      crudWithRealtime.setupRealtime()

      // Assert
      expect(mockRealtime.subscribeToAnalysisProgress).toHaveBeenCalledWith(
        'test-user-id',
        expect.any(Function)
      )
    })
  })
})

describe('特定テーブル用Composable関数', () => {
  describe('useAnalysisResults', () => {
    it('分析結果用の設定でCRUD操作が初期化される', () => {
      // Act
      const analysisResults = useAnalysisResults()

      // Assert
      expect(analysisResults.sortBy.value).toBe('created_at')
      expect(analysisResults.pagination.value.pageSize).toBe(10)
    })
  })

  describe('useDiagnosisHistory', () => {
    it('診断履歴用の設定でCRUD操作が初期化される', () => {
      // Act
      const diagnosisHistory = useDiagnosisHistory()

      // Assert
      expect(diagnosisHistory.sortBy.value).toBe('created_at')
      expect(diagnosisHistory.pagination.value.pageSize).toBe(20)
    })
  })
})

describe('型安全性・エッジケース', () => {
  it('不正なテーブル名でエラーが発生する', async () => {
    // Arrange
    const invalidCrud = useCRUDOperations('invalid_table', { autoLoad: false })

    // Act
    const result = await invalidCrud.loadAll()

    // Assert
    expect(result.success).toBe(false)
    expect(result.error).toContain('未サポートのテーブル')
  })

  it('空の配列でのバッチ操作が正常に処理される', async () => {
    // Act
    const result = await crud.batchRemove([])

    // Assert
    expect(result.success).toBe(true)
    expect(result.data?.totalRequested).toBe(0)
    expect(result.data?.successfullyDeleted).toBe(0)
  })

  it('大量データでのバッチ操作制限が正常に動作する', async () => {
    // Arrange
    const largeIdList = Array.from({ length: 6000 }, (_, i) => `id-${i}`)

    // Act
    const result = await crud.batchRemove(largeIdList)

    // Assert
    expect(result.success).toBe(false)
    expect(result.error).toContain('一度に処理できるIDは5000個までです')
  })
})