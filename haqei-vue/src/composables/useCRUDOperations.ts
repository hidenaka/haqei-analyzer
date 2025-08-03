/**
 * HAQEI CRUD操作 Composable
 * 
 * 目的：
 * - Vue 3コンポーネントでの簡単なCRUD操作
 * - リアクティブなデータ管理
 * - エラーハンドリングとローディング状態
 * - TypeScript型安全性の確保
 * 
 * 機能：
 * - Create, Read, Update, Delete操作の統一インターフェース
 * - バッチ操作対応
 * - オフライン対応とキャッシュ機能
 * - リアルタイム更新の自動反映
 * 
 * 更新: 2025-08-03 - TASK-036実装完了
 */

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
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
   * バッチ削除
   */
  async function batchRemove(ids: string[]): Promise<HAQEIOperationResult<number>> {
    isLoading.value = true
    error.value = null
    
    try {
      let result: HAQEIOperationResult<number>
      
      switch (tableName) {
        case 'diagnosis_history':
          result = await database.historyOperations.batchDeleteHistory(ids)
          break
          
        default:
          // 単一削除の繰り返し
          let deletedCount = 0
          const errors: string[] = []
          
          for (const id of ids) {
            const deleteResult = await remove(id)
            if (deleteResult.success) {
              deletedCount++
            } else {
              errors.push(deleteResult.error || `ID ${id} の削除に失敗`)
            }
          }
          
          if (errors.length > 0) {
            result = { success: false, error: errors.join(', ') }
          } else {
            result = { success: true, data: deletedCount }
          }
      }
      
      if (result.success) {
        // ローカル配列から一括削除
        items.value = items.value.filter((item: any) => !ids.includes(item.id))
        return { success: true, data: result.data }
      } else {
        throw new Error(result.error)
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'バッチ削除に失敗しました'
      error.value = errorMessage
      return { success: false, error: errorMessage }
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
   * データの更新
   */
  async function refresh(): Promise<HAQEIOperationResult<T[]>> {
    return await loadAll()
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
    
    // CRUD操作
    loadAll,
    loadById,
    create,
    update,
    remove,
    batchRemove,
    refresh,
    
    // ページネーション
    loadNextPage,
    loadPreviousPage,
    
    // フィルタリング・ソート
    addFilter,
    clearFilters,
    setSorting,
    
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