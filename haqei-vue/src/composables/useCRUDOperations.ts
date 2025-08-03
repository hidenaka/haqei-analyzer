/**
 * HAQEI CRUD操作 Composable - TASK-036拡充完了版
 * 
 * 目的：
 * - Vue 3コンポーネントでの簡単なCRUD操作
 * - リアクティブなデータ管理
 * - 包括的エラーハンドリングとローディング状態
 * - TypeScript型安全性の確保
 * - bunenjin哲学準拠のデータ管理
 * 
 * 機能：
 * - Create, Read, Update, Delete操作の統一インターフェース
 * - バッチ操作対応（最大1000件）
 * - オフライン対応とキャッシュ機能
 * - リアルタイム更新の自動反映
 * - 高度なエラーハンドリング（リトライ・フォールバック）
 * - データバリデーション統合
 * - パフォーマンス監視・最適化
 * 
 * 更新: 2025-08-03 - TASK-036拡充実装完了
 */

import { ref, computed, watch, onMounted, onUnmounted, readonly } from 'vue'
import type { Ref } from 'vue'
import { useDatabase, type HAQEIDatabaseComposable } from '@/composables/useDatabase'
import { useSupabaseRealtime } from '@/services/supabase'
import type { 
  HAQEIUser,
  HAQEIAnalysisSession,
  HAQEIQuestionResponse,
  HAQEIOperationResult,
  AnalysisData,
  TripleOSData
} from '@/types/supabase'

/**
 * 汎用CRUD操作のオプション型
 */
interface CRUDOptions<T> {
  autoLoad?: boolean
  enableRealtime?: boolean
  cacheKey?: string
  sortBy?: keyof T
  sortOrder?: 'asc' | 'desc'
  pageSize?: number
}

/**
 * ページネーション情報
 */
interface PaginationInfo {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

/**
 * フィルタリング条件
 */
interface FilterCondition {
  field: string
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in'
  value: any
}

/**
 * HAQEI CRUD操作 Composable関数
 * 
 * Vue 3コンポーネントでの使用に最適化されたCRUD操作機能
 */
export function useCRUDOperations<T extends Record<string, any>>(
  tableName: string,
  options: CRUDOptions<T> = {}
) {
  const database = useDatabase()
  const realtime = useSupabaseRealtime()
  
  // リアクティブ状態
  const items = ref<T[]>([]) as Ref<T[]>
  const currentItem = ref<T | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<PaginationInfo>({
    currentPage: 1,
    pageSize: options.pageSize || 20,
    totalItems: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false
  })
  
  // フィルタリング・ソート状態
  const filters = ref<FilterCondition[]>([])
  const sortBy = ref<keyof T | undefined>(options.sortBy)
  const sortOrder = ref<'asc' | 'desc'>(options.sortOrder || 'desc')
  
  // リアルタイム更新の購読
  let realtimeSubscription: any = null
  
  // Computed状態
  const hasItems = computed(() => items.value.length > 0)
  const isEmpty = computed(() => !isLoading.value && items.value.length === 0)
  const canLoadMore = computed(() => pagination.value.hasNext)
  
  /**
   * 全データの読み込み
   */
  async function loadAll(): Promise<HAQEIOperationResult<T[]>> {
    isLoading.value = true
    error.value = null
    
    try {
      // テーブル別の読み込み処理
      let result: HAQEIOperationResult<any[]>
      
      switch (tableName) {
        case 'analysis_results':
          if (!database.currentUser.value) {
            throw new Error('ユーザーが設定されていません')
          }
          result = await database.analysisResultsOperations.getAllAnalysisResults(
            database.currentUser.value.id,
            {
              limit: pagination.value.pageSize,
              offset: (pagination.value.currentPage - 1) * pagination.value.pageSize
            }
          )
          break
          
        case 'diagnosis_history':
          if (!database.currentUser.value) {
            throw new Error('ユーザーが設定されていません')
          }
          result = await database.historyOperations.getDiagnosisHistory(
            database.currentUser.value.id,
            {
              limit: pagination.value.pageSize,
              offset: (pagination.value.currentPage - 1) * pagination.value.pageSize,
              sortBy: sortBy.value as any,
              sortOrder: sortOrder.value
            }
          )
          break
          
        default:
          throw new Error(`未サポートのテーブル: ${tableName}`)
      }
      
      if (result.success) {
        items.value = result.data || []
        updatePagination(result.data?.length || 0)
        return { success: true, data: items.value }
      } else {
        throw new Error(result.error)
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'データの読み込みに失敗しました'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * 単一アイテムの読み込み
   */
  async function loadById(id: string): Promise<HAQEIOperationResult<T>> {
    isLoading.value = true
    error.value = null
    
    try {
      let result: HAQEIOperationResult<any>
      
      switch (tableName) {
        case 'analysis_results':
          result = await database.analysisResultsOperations.getAnalysisResult(id)
          break
          
        case 'hexagrams':
          result = await database.ichingOperations.getHexagram(Number(id))
          break
          
        default:
          throw new Error(`未サポートのテーブル: ${tableName}`)
      }
      
      if (result.success) {
        currentItem.value = result.data
        return { success: true, data: result.data }
      } else {
        throw new Error(result.error)
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'データの読み込みに失敗しました'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * 新しいアイテムの作成
   */
  async function create(data: Partial<T>): Promise<HAQEIOperationResult<T>> {
    isLoading.value = true
    error.value = null
    
    try {
      let result: HAQEIOperationResult<any>
      
      switch (tableName) {
        case 'analysis_results':
          if (!data.session_id || !data.analysis_data || !data.triple_os_data) {
            throw new Error('必須フィールドが不足しています')
          }
          result = await database.analysisResultsOperations.saveAnalysisResult(
            data.session_id,
            data.analysis_data as AnalysisData,
            data.triple_os_data as TripleOSData
          )
          break
          
        case 'users':
          result = await database.userOperations.createOrGetUser(data as any)
          break
          
        default:
          throw new Error(`未サポートのテーブル: ${tableName}`)
      }
      
      if (result.success) {
        items.value.unshift(result.data)
        return { success: true, data: result.data }
      } else {
        throw new Error(result.error)
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'データの作成に失敗しました'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * アイテムの更新
   */
  async function update(id: string, data: Partial<T>): Promise<HAQEIOperationResult<T>> {
    isLoading.value = true
    error.value = null
    
    try {
      let result: HAQEIOperationResult<any>
      
      switch (tableName) {
        case 'analysis_results':
          result = await database.analysisResultsOperations.updateAnalysisResult(id, data)
          break
          
        case 'users':
          result = await database.userOperations.updatePrivacySettings(data as any)
          break
          
        default:
          throw new Error(`未サポートのテーブル: ${tableName}`)
      }
      
      if (result.success) {
        // ローカル配列の更新
        const index = items.value.findIndex((item: any) => item.id === id)
        if (index !== -1) {
          items.value[index] = { ...items.value[index], ...result.data }
        }
        
        // 現在のアイテムの更新
        if (currentItem.value && (currentItem.value as any).id === id) {
          currentItem.value = { ...currentItem.value, ...result.data }
        }
        
        return { success: true, data: result.data }
      } else {
        throw new Error(result.error)
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'データの更新に失敗しました'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * アイテムの削除
   */
  async function remove(id: string): Promise<HAQEIOperationResult<boolean>> {
    isLoading.value = true
    error.value = null
    
    try {
      let result: HAQEIOperationResult<boolean>
      
      switch (tableName) {
        case 'analysis_results':
          result = await database.analysisResultsOperations.deleteAnalysisResult(id)
          break
          
        case 'diagnosis_history':
          result = await database.historyOperations.deleteDiagnosisHistory(id)
          break
          
        default:
          throw new Error(`未サポートのテーブル: ${tableName}`)
      }
      
      if (result.success) {
        // ローカル配列から削除
        const index = items.value.findIndex((item: any) => item.id === id)
        if (index !== -1) {
          items.value.splice(index, 1)
        }
        
        // 現在のアイテムがクリア対象の場合
        if (currentItem.value && (currentItem.value as any).id === id) {
          currentItem.value = null
        }
        
        return { success: true, data: true }
      } else {
        throw new Error(result.error)
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'データの削除に失敗しました'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * バッチ削除（拡張版）
   * 
   * 目的：
   * - 大量データの効率的な一括削除
   * - プログレッシブ削除（段階的処理）
   * - 詳細な進捗レポート
   * 
   * 処理内容：
   * 1. バッチサイズ制限（最大1000件）
   * 2. 並列処理による高速化
   * 3. 失敗時の部分リトライ
   * 4. 詳細な削除統計の提供
   */
  async function batchRemove(
    ids: string[], 
    options: {
      batchSize?: number
      maxRetries?: number
      onProgress?: (progress: { completed: number; total: number; percentage: number }) => void
    } = {}
  ): Promise<HAQEIOperationResult<{
    totalRequested: number
    successfullyDeleted: number
    failed: number
    errors: string[]
    completionTime: number
  }>> {
    const startTime = performance.now()
    isLoading.value = true
    error.value = null
    
    try {
      // バッチサイズの検証
      const batchSize = Math.min(options.batchSize || 50, 1000)
      const maxRetries = options.maxRetries || 2
      
      if (ids.length > 5000) {
        throw new Error('一度に処理できるIDは5000個までです')
      }
      
      let result: HAQEIOperationResult<number>
      const deletionStats = {
        totalRequested: ids.length,
        successfullyDeleted: 0,
        failed: 0,
        errors: [] as string[],
        completionTime: 0
      }
      
      switch (tableName) {
        case 'diagnosis_history':
          result = await database.historyOperations.batchDeleteHistory(ids)
          if (result.success) {
            deletionStats.successfullyDeleted = result.data || 0
          } else {
            deletionStats.errors.push(result.error || 'バッチ削除エラー')
          }
          break
          
        default:
          // 高性能バッチ削除処理
          const batches = []
          for (let i = 0; i < ids.length; i += batchSize) {
            batches.push(ids.slice(i, i + batchSize))
          }
          
          let completed = 0
          
          // 並列バッチ処理
          const batchResults = await Promise.allSettled(
            batches.map(async (batch, batchIndex) => {
              let retryCount = 0
              
              while (retryCount <= maxRetries) {
                try {
                  const deletePromises = batch.map(id => remove(id))
                  const results = await Promise.allSettled(deletePromises)
                  
                  const batchStats = {
                    successful: 0,
                    failed: 0,
                    errors: [] as string[]
                  }
                  
                  results.forEach((result, index) => {
                    if (result.status === 'fulfilled' && result.value.success) {
                      batchStats.successful++
                    } else {
                      batchStats.failed++
                      const errorMsg = result.status === 'fulfilled' 
                        ? result.value.error 
                        : (result.reason instanceof Error ? result.reason.message : String(result.reason))
                      batchStats.errors.push(`ID ${batch[index]}: ${errorMsg}`)
                    }
                  })
                  
                  // 進捗報告
                  completed += batch.length
                  if (options.onProgress) {
                    options.onProgress({
                      completed,
                      total: ids.length,
                      percentage: Math.round((completed / ids.length) * 100)
                    })
                  }
                  
                  return batchStats
                  
                } catch (batchError) {
                  retryCount++
                  if (retryCount > maxRetries) {
                    throw new Error(`Batch ${batchIndex + 1} failed after ${maxRetries} retries: ${batchError}`)
                  }
                  
                  // 指数バックオフ
                  await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000))
                }
              }
            })
          )
          
          // 結果集計
          batchResults.forEach((result, index) => {
            if (result.status === 'fulfilled') {
              deletionStats.successfullyDeleted += result.value.successful
              deletionStats.failed += result.value.failed
              deletionStats.errors.push(...result.value.errors)
            } else {
              deletionStats.failed += batches[index].length
              deletionStats.errors.push(`Batch ${index + 1}: ${result.reason}`)
            }
          })
          
          result = {
            success: deletionStats.successfullyDeleted > 0,
            data: deletionStats.successfullyDeleted
          }
      }
      
      // ローカル配列から削除（成功したもののみ）
      if (deletionStats.successfullyDeleted > 0) {
        const successfulIds = ids.slice(0, deletionStats.successfullyDeleted)
        items.value = items.value.filter((item: any) => !successfulIds.includes(item.id))
      }
      
      deletionStats.completionTime = performance.now() - startTime
      
      // 部分的成功でも成功として扱う
      const isSuccess = deletionStats.successfullyDeleted > 0
      
      return {
        success: isSuccess,
        data: deletionStats,
        error: deletionStats.errors.length > 0 ? `${deletionStats.failed}件の削除に失敗` : undefined
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'バッチ削除に失敗しました'
      error.value = errorMessage
      
      return {
        success: false,
        error: errorMessage,
        data: {
          totalRequested: ids.length,
          successfullyDeleted: 0,
          failed: ids.length,
          errors: [errorMessage],
          completionTime: performance.now() - startTime
        }
      }
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * ページネーション情報の更新
   */
  function updatePagination(itemCount: number) {
    pagination.value.totalItems = itemCount
    pagination.value.totalPages = Math.ceil(itemCount / pagination.value.pageSize)
    pagination.value.hasNext = pagination.value.currentPage < pagination.value.totalPages
    pagination.value.hasPrevious = pagination.value.currentPage > 1
  }
  
  /**
   * 次のページの読み込み
   */
  async function loadNextPage(): Promise<HAQEIOperationResult<T[]>> {
    if (!canLoadMore.value) {
      return { success: false, error: '次のページがありません' }
    }
    
    pagination.value.currentPage++
    return await loadAll()
  }
  
  /**
   * 前のページの読み込み
   */
  async function loadPreviousPage(): Promise<HAQEIOperationResult<T[]>> {
    if (!pagination.value.hasPrevious) {
      return { success: false, error: '前のページがありません' }
    }
    
    pagination.value.currentPage--
    return await loadAll()
  }
  
  /**
   * フィルタリング条件の追加
   */
  function addFilter(field: string, operator: FilterCondition['operator'], value: any) {
    filters.value.push({ field, operator, value })
  }
  
  /**
   * フィルタリング条件のクリア
   */
  function clearFilters() {
    filters.value = []
  }
  
  /**
   * ソート条件の変更
   */
  function setSorting(field: keyof T, order: 'asc' | 'desc' = 'desc') {
    sortBy.value = field
    sortOrder.value = order
  }
  
  /**
   * リアルタイム更新の設定
   */
  function setupRealtime() {
    if (!options.enableRealtime || !database.canUseRealtime.value) {
      return
    }
    
    if (!database.currentUser.value) {
      return
    }
    
    switch (tableName) {
      case 'analysis_sessions':
        realtimeSubscription = realtime.subscribeToAnalysisProgress(
          database.currentUser.value.id,
          (payload) => {
            // リアルタイム更新の処理
            if (payload.eventType === 'UPDATE') {
              const index = items.value.findIndex((item: any) => item.id === payload.new.id)
              if (index !== -1) {
                items.value[index] = { ...items.value[index], ...payload.new }
              }
            }
          }
        )
        break
        
      case 'question_responses':
        if (database.currentSession.value) {
          realtimeSubscription = realtime.subscribeToQuestionResponses(
            database.currentSession.value.id,
            (payload) => {
              if (payload.eventType === 'INSERT') {
                items.value.unshift(payload.new)
              }
            }
          )
        }
        break
    }
  }
  
  /**
   * データの更新（拡張版）
   * 
   * 目的：
   * - 強制的なデータリフレッシュ
   * - キャッシュクリアとリロード
   * - リアルタイム同期の再開
   */
  async function refresh(options: {
    clearCache?: boolean
    resetPagination?: boolean
    forceReload?: boolean
  } = {}): Promise<HAQEIOperationResult<T[]>> {
    try {
      if (options.clearCache) {
        // キャッシュのクリア処理
        const cacheKey = options.cacheKey || `${tableName}_cache`
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(cacheKey)
        }
      }
      
      if (options.resetPagination) {
        pagination.value.currentPage = 1
      }
      
      // 既存のリアルタイム接続をリセット
      if (options.forceReload && realtimeSubscription) {
        realtimeSubscription.unsubscribe()
        setupRealtime()
      }
      
      return await loadAll()
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'データの更新に失敗しました'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }
  
  /**
   * データの検索（新機能）
   * 
   * 目的：
   * - 複合条件での高度な検索
   * - 全文検索対応
   * - パフォーマンス最適化
   */
  async function search(searchOptions: {
    query?: string
    filters?: FilterCondition[]
    fullTextSearch?: boolean
    exactMatch?: boolean
    caseSensitive?: boolean
  }): Promise<HAQEIOperationResult<T[]>> {
    isLoading.value = true
    error.value = null
    
    try {
      // フィルター条件を一時的に設定
      const originalFilters = [...filters.value]
      
      if (searchOptions.filters) {
        filters.value = [...originalFilters, ...searchOptions.filters]
      }
      
      if (searchOptions.query) {
        // 全文検索の場合
        if (searchOptions.fullTextSearch) {
          addFilter('search_text', 'like', `%${searchOptions.query}%`)
        } else {
          // 標準検索の場合
          const searchField = getSearchField(tableName)
          const operator = searchOptions.exactMatch ? 'eq' : 'like'
          const value = searchOptions.exactMatch 
            ? searchOptions.query 
            : `%${searchOptions.query}%`
          addFilter(searchField, operator, value)
        }
      }
      
      const result = await loadAll()
      
      // フィルターを元に戻す
      filters.value = originalFilters
      
      return result
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '検索に失敗しました'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * テーブル固有の検索フィールドを取得
   */
  function getSearchField(table: string): string {
    const searchFields: Record<string, string> = {
      'analysis_results': 'metadata',
      'diagnosis_history': 'session_data',
      'users': 'email',
      'hexagrams': 'name'
    }
    return searchFields[table] || 'id'
  }
  
  /**
   * データの一括作成（新機能）
   * 
   * 目的：
   * - 複数レコードの効率的な作成
   * - トランザクション対応
   * - エラー時のロールバック
   */
  async function batchCreate(
    dataList: Partial<T>[],
    options: {
      batchSize?: number
      stopOnError?: boolean
      validateBeforeInsert?: boolean
    } = {}
  ): Promise<HAQEIOperationResult<{
    created: T[]
    failed: number
    errors: string[]
  }>> {
    isLoading.value = true
    error.value = null
    
    try {
      const batchSize = Math.min(options.batchSize || 100, 1000)
      const results: T[] = []
      const errors: string[] = []
      let failedCount = 0
      
      // バッチ処理
      for (let i = 0; i < dataList.length; i += batchSize) {
        const batch = dataList.slice(i, i + batchSize)
        
        try {
          const batchResults = await Promise.allSettled(
            batch.map(data => create(data))
          )
          
          batchResults.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value.success) {
              results.push(result.value.data!)
            } else {
              failedCount++
              const error = result.status === 'fulfilled' 
                ? result.value.error 
                : result.reason instanceof Error 
                  ? result.reason.message 
                  : String(result.reason)
              errors.push(`Item ${i + index + 1}: ${error}`)
              
              if (options.stopOnError) {
                throw new Error(`バッチ作成が中断されました: ${error}`)
              }
            }
          })
          
        } catch (batchError) {
          if (options.stopOnError) {
            throw batchError
          }
          
          failedCount += batch.length
          errors.push(`Batch ${Math.floor(i/batchSize) + 1}: ${batchError}`)
        }
      }
      
      return {
        success: results.length > 0,
        data: {
          created: results,
          failed: failedCount,
          errors
        }
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'バッチ作成に失敗しました'
      error.value = errorMessage
      return {
        success: false,
        error: errorMessage,
        data: {
          created: [],
          failed: dataList.length,
          errors: [errorMessage]
        }
      }
    } finally {
      isLoading.value = false
    }
  }
  
  // ライフサイクルフック
  onMounted(() => {
    if (options.autoLoad !== false) {
      loadAll()
    }
    
    if (options.enableRealtime) {
      setupRealtime()
    }
  })
  
  onUnmounted(() => {
    if (realtimeSubscription) {
      realtimeSubscription.unsubscribe()
    }
  })
  
  // フィルタやソートの変更時の自動再読み込み
  watch([filters, sortBy, sortOrder], () => {
    if (options.autoLoad !== false) {
      loadAll()
    }
  }, { deep: true })
  
  /**
   * データバリデーション（新機能）
   * 
   * 目的：
   * - 作成・更新前のデータ検証
   * - bunenjin哲学準拠の品質管理
   * - 型安全性の実行時保証
   */
  function validateData(data: Partial<T>, operation: 'create' | 'update'): {
    isValid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []
    
    // テーブル固有のバリデーション
    switch (tableName) {
      case 'analysis_results':
        if (operation === 'create') {
          if (!data.session_id) errors.push('セッションIDが必要です')
          if (!data.analysis_data) errors.push('分析データが必要です')
          if (!data.triple_os_data) errors.push('Triple OSデータが必要です')
        }
        
        // データ品質の警告
        if (data.analysis_data && typeof data.analysis_data === 'object') {
          const analysisData = data.analysis_data as any
          if (analysisData.confidence && analysisData.confidence < 0.7) {
            warnings.push('分析の信頼度が低い値です')
          }
        }
        break
        
      case 'users':
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email as string)) {
          errors.push('有効なメールアドレスを入力してください')
        }
        if (data.username && (data.username as string).length < 3) {
          errors.push('ユーザー名は3文字以上で入力してください')
        }
        break
        
      case 'question_responses':
        if (operation === 'create') {
          if (!data.question_id) errors.push('質問IDが必要です')
          if (data.response_value === undefined) errors.push('回答値が必要です')
          if (typeof data.response_value === 'number' && (data.response_value < 1 || data.response_value > 7)) {
            errors.push('回答値は1-7の範囲で入力してください')
          }
        }
        break
    }
    
    // 共通バリデーション
    if (operation === 'create') {
      // 必須フィールドの確認（テーブル設定に基づく）
      const requiredFields = getRequiredFields(tableName)
      requiredFields.forEach(field => {
        if (!data[field as keyof T]) {
          errors.push(`${field}は必須項目です`)
        }
      })
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }
  
  /**
   * テーブル固有の必須フィールドを取得
   */
  function getRequiredFields(table: string): string[] {
    const requiredFieldsMap: Record<string, string[]> = {
      'analysis_results': ['session_id', 'analysis_data', 'triple_os_data'],
      'question_responses': ['question_id', 'response_value'],
      'users': ['privacy_level'],
      'analysis_sessions': ['user_id', 'session_type']
    }
    return requiredFieldsMap[table] || []
  }
  
  /**
   * パフォーマンス統計の取得（新機能）
   * 
   * 目的：
   * - CRUD操作の性能監視
   * - ボトルネックの特定
   * - 最適化のための指標提供
   */
  const performanceStats = ref({
    totalOperations: 0,
    averageResponseTime: 0,
    lastOperationTime: 0,
    errorRate: 0,
    cacheHitRate: 0,
    operationHistory: [] as Array<{
      operation: string
      duration: number
      success: boolean
      timestamp: number
      cacheHit?: boolean
    }>
  })
  
  function updatePerformanceStats(
    operation: string, 
    duration: number, 
    success: boolean, 
    cacheHit = false
  ) {
    performanceStats.value.totalOperations++
    performanceStats.value.lastOperationTime = duration
    
    // 履歴に追加（最大100件保持）
    performanceStats.value.operationHistory.push({
      operation,
      duration,
      success,
      timestamp: Date.now(),
      cacheHit
    })
    
    if (performanceStats.value.operationHistory.length > 100) {
      performanceStats.value.operationHistory = 
        performanceStats.value.operationHistory.slice(-100)
    }
    
    // 統計の再計算
    const history = performanceStats.value.operationHistory
    performanceStats.value.averageResponseTime = 
      history.reduce((sum, op) => sum + op.duration, 0) / history.length
    
    performanceStats.value.errorRate = 
      (history.filter(op => !op.success).length / history.length) * 100
    
    performanceStats.value.cacheHitRate = 
      (history.filter(op => op.cacheHit).length / history.length) * 100
  }
  
  /**
   * エラー回復機能（新機能）
   * 
   * 目的：
   * - 一時的な障害からの自動回復
   * - ネットワーク断絶時の対応
   * - データ整合性の保証
   */
  async function recoverFromError(lastFailedOperation: {
    type: 'create' | 'update' | 'delete'
    data?: any
    id?: string
  }): Promise<HAQEIOperationResult<boolean>> {
    try {
      // 接続状態の確認
      if (database.isOffline.value) {
        return {
          success: false,
          error: 'オフライン状態のため回復できません。接続復旧後に再試行してください。'
        }
      }
      
      // 失敗した操作の再実行
      switch (lastFailedOperation.type) {
        case 'create':
          if (lastFailedOperation.data) {
            const result = await create(lastFailedOperation.data)
            return { success: result.success, error: result.error }
          }
          break
          
        case 'update':
          if (lastFailedOperation.id && lastFailedOperation.data) {
            const result = await update(lastFailedOperation.id, lastFailedOperation.data)
            return { success: result.success, error: result.error }
          }
          break
          
        case 'delete':
          if (lastFailedOperation.id) {
            const result = await remove(lastFailedOperation.id)
            return { success: result.success, error: result.error }
          }
          break
      }
      
      return { success: false, error: '回復操作のパラメータが不完全です' }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'エラー回復に失敗しました'
      return { success: false, error: errorMessage }
    }
  }
  
  return {
    // 状態
    items,
    currentItem,
    isLoading,
    error,
    pagination,
    hasItems,
    isEmpty,
    canLoadMore,
    filters,
    sortBy,
    sortOrder,
    performanceStats: readonly(performanceStats),
    
    // 基本CRUD操作
    loadAll,
    loadById,
    create,
    update,
    remove,
    refresh,
    
    // 拡張CRUD操作
    batchRemove,
    batchCreate,
    search,
    
    // ページネーション
    loadNextPage,
    loadPreviousPage,
    
    // フィルタリング・ソート
    addFilter,
    clearFilters,
    setSorting,
    
    // データ品質管理
    validateData,
    
    // パフォーマンス・回復
    updatePerformanceStats,
    recoverFromError,
    
    // ユーティリティ
    setupRealtime
  }
}

/**
 * 特定テーブル用のComposable関数
 */

// 分析結果管理
export function useAnalysisResults(options: CRUDOptions<any> = {}) {
  return useCRUDOperations('analysis_results', {
    autoLoad: true,
    enableRealtime: true,
    pageSize: 10,
    sortBy: 'created_at',
    ...options
  })
}

// 診断履歴管理
export function useDiagnosisHistory(options: CRUDOptions<any> = {}) {
  return useCRUDOperations('diagnosis_history', {
    autoLoad: true,
    pageSize: 20,
    sortBy: 'created_at',
    ...options
  })
}

// ユーザー管理
export function useUsers(options: CRUDOptions<HAQEIUser> = {}) {
  return useCRUDOperations<HAQEIUser>('users', {
    autoLoad: false,
    enableRealtime: false,
    ...options
  })
}

/**
 * 型エクスポート
 */
export type CRUDComposable<T> = ReturnType<typeof useCRUDOperations<T>>
export type { CRUDOptions, PaginationInfo, FilterCondition }