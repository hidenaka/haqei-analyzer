/**
 * HAQEI Supabase Storage Composable
 * 
 * 目的：
 * - HaQei哲学に基づくユーザーデータ管理
 * - Supabase Storageの完全統合
 * - ファイルアップロード・ダウンロード・管理機能
 * - プライバシー保護ファイル処理
 * 
 * 機能：
 * - 分析結果の安全な保存・取得
 * - ユーザー文書のアップロード・管理
 * - ファイル共有・アクセス制御
 * - ストレージ使用量監視・最適化
 * 
 * TASK-040: Supabase Storage設定実装
 * 更新: 2025-08-03
 */

import { ref, computed, reactive } from 'vue'
import { useSupabase } from '@/services/supabase'
import { useRLS } from './useRLS'

// ストレージ状態の管理
interface StorageState {
  userId: string | null
  isInitialized: boolean
  uploadProgress: Record<string, number>
  storageUsage: {
    used: number
    limit: number
    percentage: number
  }
  recentFiles: Array<{
    name: string
    path: string
    size: number
    created_at: string
    category: string
  }>
  errorLog: Array<{
    timestamp: Date
    operation: string
    error: string
    file?: string
  }>
}

const storageState = reactive<StorageState>({
  userId: null,
  isInitialized: false,
  uploadProgress: {},
  storageUsage: {
    used: 0,
    limit: 104857600, // 100MB デフォルト
    percentage: 0
  },
  recentFiles: [],
  errorLog: []
})

export function useStorage() {
  const { storage } = useSupabase()
  const { isSecurityActive, checkDataAccess } = useRLS()
  
  const isStorageReady = computed(() => storageState.isInitialized && storageState.userId !== null)
  const storageUsage = computed(() => storageState.storageUsage)
  const hasStorageSpace = computed(() => storageState.storageUsage.percentage < 90)
  
  /**
   * ストレージシステムの初期化
   * 
   * 目的：
   * - ユーザー専用ストレージ領域の設定
   * - 使用量監視システムの開始
   * - セキュリティ制御の統合
   * 
   * 処理内容：
   * 1. ユーザーディレクトリ構造の確認・作成
   * 2. 既存ファイル一覧の取得
   * 3. ストレージ使用量の計算
   * 4. セキュリティポリシーの適用
   * 
   * HaQei哲学統合：
   * - ユーザー主権のファイル管理
   * - データ所有権の明確化
   * - 透明性の確保
   */
  const initializeStorage = async (userId: string) => {
    try {
      storageState.userId = userId
      
      // ユーザーディレクトリ構造の確認
      const directories = ['results', 'documents', 'exports', 'backups']
      
      for (const dir of directories) {
        const { files, error } = await storage.listUserFiles(userId, dir)
        if (error && !error.message.includes('not found')) {
          console.warn(`Failed to initialize directory ${dir}:`, error)
        }
      }
      
      // 既存ファイルの取得と使用量計算
      await refreshFileList()
      await calculateStorageUsage()
      
      storageState.isInitialized = true
      
      console.log(`📁 Storage initialized for user ${userId}`)
      console.log(`💾 Current usage: ${storageState.storageUsage.percentage}%`)
      
      return { success: true, error: null }
      
    } catch (error) {
      console.error('Storage initialization failed:', error)
      logStorageError('initialize', error instanceof Error ? error.message : 'Unknown error')
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Storage initialization failed' 
      }
    }
  }
  
  /**
   * 分析結果の保存
   * 
   * 目的：
   * - Triple OS分析結果の安全な永続化
   * - JSONフォーマットでの構造化保存
   * - バージョン管理・履歴保持
   */
  const saveAnalysisResult = async (
    analysisData: any, 
    metadata: any = {},
    filename?: string
  ) => {
    if (!isStorageReady.value) {
      return { success: false, error: 'Storage not initialized' }
    }
    
    if (!hasStorageSpace.value) {
      return { success: false, error: 'Insufficient storage space' }
    }
    
    try {
      // セキュリティチェック
      if (isSecurityActive.value) {
        const { hasAccess } = await checkDataAccess('analysis_results', 'new', 'INSERT')
        if (!hasAccess) {
          return { success: false, error: 'Access denied by security policy' }
        }
      }
      
      const enrichedData = {
        analysisData,
        metadata: {
          ...metadata,
          saved_at: new Date().toISOString(),
          user_id: storageState.userId,
          version: '1.0',
          haqei_format: 'triple_os_analysis'
        }
      }
      
      const { filePath, error } = await storage.uploadAnalysisResult(
        storageState.userId!,
        enrichedData,
        filename
      )
      
      if (error) {
        logStorageError('save_analysis', error.message, filename)
        return { success: false, error: error.message }
      }
      
      // ファイル一覧の更新
      await refreshFileList()
      await calculateStorageUsage()
      
      console.log(`💾 Analysis result saved: ${filePath}`)
      
      return { success: true, filePath, error: null }
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      logStorageError('save_analysis', errorMsg, filename)
      return { success: false, error: errorMsg }
    }
  }
  
  /**
   * 分析結果の読み込み
   * 
   * 目的：
   * - 保存済み分析結果の取得
   * - データ整合性の検証
   * - アクセス権限の確認
   */
  const loadAnalysisResult = async (filePath: string) => {
    if (!isStorageReady.value) {
      return { data: null, error: 'Storage not initialized' }
    }
    
    try {
      // セキュリティチェック
      if (isSecurityActive.value) {
        const { hasAccess } = await checkDataAccess('analysis_results', filePath, 'SELECT')
        if (!hasAccess) {
          return { data: null, error: 'Access denied by security policy' }
        }
      }
      
      const { data, error } = await storage.downloadAnalysisResult(storageState.userId!, filePath)
      
      if (error) {
        logStorageError('load_analysis', error.message, filePath)
        return { data: null, error: error.message }
      }
      
      // データ整合性の基本チェック
      if (data && typeof data === 'object' && data.metadata && data.analysisData) {
        console.log(`📖 Analysis result loaded: ${filePath}`)
        return { data, error: null }
      } else {
        const errorMsg = 'Invalid analysis data format'
        logStorageError('load_analysis', errorMsg, filePath)
        return { data: null, error: errorMsg }
      }
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      logStorageError('load_analysis', errorMsg, filePath)
      return { data: null, error: errorMsg }
    }
  }
  
  /**
   * ユーザー文書のアップロード
   * 
   * 目的：
   * - PDFレポート・画像・設定ファイルの管理
   * - ファイルタイプ・サイズの検証
   * - プログレス追跡・エラーハンドリング
   */
  const uploadDocument = async (
    file: File, 
    category = 'documents',
    onProgress?: (progress: number) => void
  ) => {
    if (!isStorageReady.value) {
      return { success: false, error: 'Storage not initialized' }
    }
    
    if (!hasStorageSpace.value) {
      return { success: false, error: 'Insufficient storage space' }
    }
    
    try {
      const uploadId = `${Date.now()}_${file.name}`
      
      // プログレス追跡の開始
      if (onProgress) {
        storageState.uploadProgress[uploadId] = 0
        onProgress(0)
      }
      
      // ファイルアップロード
      const { filePath, error } = await storage.uploadUserDocument(
        storageState.userId!,
        file,
        category
      )
      
      if (error) {
        delete storageState.uploadProgress[uploadId]
        logStorageError('upload_document', error.message, file.name)
        return { success: false, error: error.message }
      }
      
      // 完了状態の更新
      if (onProgress) {
        storageState.uploadProgress[uploadId] = 100
        onProgress(100)
        setTimeout(() => delete storageState.uploadProgress[uploadId], 3000)
      }
      
      // ファイル一覧・使用量の更新
      await refreshFileList()
      await calculateStorageUsage()
      
      console.log(`📤 Document uploaded: ${file.name} → ${filePath}`)
      
      return { success: true, filePath, error: null }
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      logStorageError('upload_document', errorMsg, file.name)
      return { success: false, error: errorMsg }
    }
  }
  
  /**
   * ファイル一覧の取得・更新
   * 
   * カテゴリ別のファイル整理と状態同期
   */
  const refreshFileList = async () => {
    if (!isStorageReady.value) return
    
    try {
      const { files, error } = await storage.listUserFiles(storageState.userId!)
      
      if (error) {
        console.warn('Failed to refresh file list:', error)
        return
      }
      
      const recentFiles = (files || [])
        .filter(file => file.name !== '.emptyFolderPlaceholder')
        .map(file => ({
          name: file.name,
          path: `users/${storageState.userId}/${file.name}`,
          size: file.metadata?.size || 0,
          created_at: file.created_at || new Date().toISOString(),
          category: file.name.includes('/results/') ? 'results' : 
                   file.name.includes('/documents/') ? 'documents' :
                   file.name.includes('/exports/') ? 'exports' : 'other'
        }))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 20) // 最新20件
      
      storageState.recentFiles = recentFiles
      
    } catch (error) {
      console.error('File list refresh error:', error)
    }
  }
  
  /**
   * ストレージ使用量の計算
   * 
   * ファイルサイズの集計と使用率の監視
   */
  const calculateStorageUsage = async () => {
    if (!isStorageReady.value) return
    
    try {
      const totalSize = storageState.recentFiles.reduce((sum, file) => sum + file.size, 0)
      
      storageState.storageUsage = {
        used: totalSize,
        limit: storageState.storageUsage.limit,
        percentage: Math.round((totalSize / storageState.storageUsage.limit) * 100)
      }
      
    } catch (error) {
      console.error('Storage usage calculation error:', error)
    }
  }
  
  /**
   * ファイル削除
   * 
   * セキュリティ確認付きの安全な削除
   */
  const deleteFile = async (filePath: string) => {
    if (!isStorageReady.value) {
      return { success: false, error: 'Storage not initialized' }
    }
    
    try {
      // セキュリティチェック
      if (isSecurityActive.value) {
        const { hasAccess } = await checkDataAccess('user_files', filePath, 'DELETE')
        if (!hasAccess) {
          return { success: false, error: 'Access denied by security policy' }
        }
      }
      
      const { deleted, error } = await storage.deleteUserFile(storageState.userId!, filePath)
      
      if (error) {
        logStorageError('delete_file', error.message, filePath)
        return { success: false, error: error.message }
      }
      
      // ファイル一覧・使用量の更新
      await refreshFileList()
      await calculateStorageUsage()
      
      console.log(`🗑️ File deleted: ${filePath}`)
      
      return { success: true, error: null }
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      logStorageError('delete_file', errorMsg, filePath)
      return { success: false, error: errorMsg }
    }
  }
  
  /**
   * ファイル共有URL生成
   * 
   * 一時的なアクセス可能URLの作成
   */
  const createShareableUrl = async (filePath: string, expiresInSeconds = 3600) => {
    if (!isStorageReady.value) {
      return { url: null, error: 'Storage not initialized' }
    }
    
    try {
      const { url, error } = await storage.getFileUrl(filePath, expiresInSeconds)
      
      if (error) {
        logStorageError('create_share_url', error.message, filePath)
        return { url: null, error: error.message }
      }
      
      console.log(`🔗 Shareable URL created for: ${filePath} (expires in ${expiresInSeconds}s)`)
      
      return { url, error: null }
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      logStorageError('create_share_url', errorMsg, filePath)
      return { url: null, error: errorMsg }
    }
  }
  
  /**
   * エラーログ記録
   * 
   * ストレージ操作の失敗記録と分析
   */
  const logStorageError = (operation: string, error: string, file?: string) => {
    storageState.errorLog.unshift({
      timestamp: new Date(),
      operation,
      error,
      file
    })
    
    // 最新100件まで保持
    if (storageState.errorLog.length > 100) {
      storageState.errorLog = storageState.errorLog.slice(0, 100)
    }
  }
  
  /**
   * ストレージ状態のリセット
   * 
   * ログアウト時の完全クリア
   */
  const clearStorageState = () => {
    storageState.userId = null
    storageState.isInitialized = false
    storageState.uploadProgress = {}
    storageState.recentFiles = []
    storageState.errorLog = []
    
    console.log('🧹 Storage state cleared')
  }
  
  /**
   * ストレージ診断
   * 
   * システム状態の確認と推奨事項の提供
   */
  const runStorageDiagnostic = async () => {
    if (!isStorageReady.value) {
      return {
        status: 'not_initialized',
        recommendations: ['Initialize storage to begin file management']
      }
    }
    
    const diagnostics = {
      status: 'active',
      userId: storageState.userId,
      filesCount: storageState.recentFiles.length,
      storageUsage: storageState.storageUsage,
      activeUploads: Object.keys(storageState.uploadProgress).length,
      recentErrors: storageState.errorLog.slice(0, 5),
      recommendations: [] as string[]
    }
    
    // 推奨事項の生成
    if (diagnostics.storageUsage.percentage > 80) {
      diagnostics.recommendations.push('Consider cleaning up old files to free storage space')
    }
    
    if (diagnostics.recentErrors.length > 3) {
      diagnostics.recommendations.push('Multiple recent errors detected, check network connection')
    }
    
    if (diagnostics.filesCount === 0) {
      diagnostics.recommendations.push('No files found, consider backing up your analysis results')
    }
    
    if (diagnostics.recommendations.length === 0) {
      diagnostics.recommendations.push('Storage system is working optimally')
    }
    
    return diagnostics
  }
  
  return {
    // 状態
    isStorageReady,
    storageUsage,
    hasStorageSpace,
    recentFiles: computed(() => storageState.recentFiles),
    uploadProgress: computed(() => storageState.uploadProgress),
    errorLog: computed(() => storageState.errorLog),
    
    // メソッド
    initializeStorage,
    saveAnalysisResult,
    loadAnalysisResult,
    uploadDocument,
    deleteFile,
    createShareableUrl,
    refreshFileList,
    clearStorageState,
    runStorageDiagnostic
  }
}

/**
 * ストレージユーティリティ関数
 * 
 * よく使用されるファイル操作の簡易ヘルパー
 */
export const StorageUtils = {
  /**
   * ファイルサイズの可読性表示
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },
  
  /**
   * ファイル拡張子からタイプ判定
   */
  getFileTypeIcon(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase()
    
    const icons = {
      json: '📄',
      pdf: '📕',
      csv: '📊',
      png: '🖼️',
      jpg: '🖼️',
      jpeg: '🖼️',
      txt: '📝',
      md: '📝'
    }
    
    return icons[extension as keyof typeof icons] || '📎'
  },
  
  /**
   * アップロード進捗の表示
   */
  formatUploadProgress(progress: number): string {
    return `${Math.round(progress)}%`
  },
  
  /**
   * ファイルカテゴリの表示名
   */
  getCategoryDisplayName(category: string): string {
    const names = {
      results: '分析結果',
      documents: '文書',
      exports: 'エクスポート',
      backups: 'バックアップ',
      other: 'その他'
    }
    return names[category as keyof typeof names] || category
  }
}