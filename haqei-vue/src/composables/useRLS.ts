/**
 * HAQEI Row Level Security (RLS) Composable
 * 
 * 目的：
 * - bunenjin哲学に基づくデータプライバシー制御
 * - Row Level Securityの完全統合管理
 * - ユーザー主権の技術的実現
 * - 監査証跡・アクセス制御の透明性確保
 * 
 * 機能：
 * - RLSセキュリティコンテキスト管理
 * - データアクセス権限の動的制御
 * - 監査ログ・アクセス履歴の管理
 * - プライバシーレベル別の自動制御
 * 
 * TASK-037: Row Level Security設定実装
 * 更新: 2025-08-03
 */

import { ref, computed, reactive } from 'vue'
import { useSupabase } from '@/services/supabase'
import type { Database } from '@/types/supabase'

// RLSセキュリティ状態の管理
interface RLSSecurityState {
  userId: string | null
  privacyLevel: Database['public']['Enums']['privacy_level']
  isAuthenticated: boolean
  securityContext: Record<string, any>
  lastAuditCheck: Date | null
  accessPermissions: Record<string, boolean>
  auditLogEnabled: boolean
}

const rlsState = reactive<RLSSecurityState>({
  userId: null,
  privacyLevel: 'maximum',
  isAuthenticated: false,
  securityContext: {},
  lastAuditCheck: null,
  accessPermissions: {},
  auditLogEnabled: true
})

export function useRLS() {
  const { rls } = useSupabase()
  
  const isSecurityActive = computed(() => rlsState.isAuthenticated && rlsState.userId !== null)
  const privacyLevel = computed(() => rlsState.privacyLevel)
  const auditingEnabled = computed(() => rlsState.auditLogEnabled)
  
  /**
   * RLSセキュリティコンテキストの初期化
   * 
   * 目的：
   * - ユーザーのプライバシー設定に基づくRLS制御の開始
   * - データアクセス権限の動的設定
   * - 監査ログシステムの有効化
   * 
   * 処理内容：
   * 1. ユーザーIDとプライバシーレベルの設定
   * 2. Supabaseクライアント側RLSコンテキストの設定
   * 3. データアクセス権限マトリックスの初期化
   * 4. 監査ログ記録の開始
   * 
   * bunenjin哲学統合：
   * - ユーザー主権の技術的具現化
   * - 透明性・可視性の確保
   * - データ最小化原則の実装
   */
  const initializeSecurityContext = async (
    userId: string, 
    privacyLevel: Database['public']['Enums']['privacy_level'] = 'maximum'
  ) => {
    try {
      rlsState.userId = userId
      rlsState.privacyLevel = privacyLevel
      
      // Supabase RLSコンテキストの設定
      const { error } = await rls.setUserContext(userId, privacyLevel)
      
      if (error) {
        console.error('RLS context initialization failed:', error)
        return { success: false, error: error.message }
      }
      
      // アクセス権限マトリックスの初期化
      await initializeAccessPermissions(userId, privacyLevel)
      
      rlsState.isAuthenticated = true
      rlsState.lastAuditCheck = new Date()
      
      console.log(`✅ RLS Security Context initialized for user ${userId} with privacy level: ${privacyLevel}`)
      
      return { success: true, error: null }
      
    } catch (error) {
      console.error('Security context initialization error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown security error' 
      }
    }
  }
  
  /**
   * データアクセス権限の動的チェック
   * 
   * 目的：
   * - リアルタイムでのデータアクセス可否判定
   * - プライバシーレベルに応じた段階的制御
   * - 不正アクセス試行の検出・記録
   */
  const checkDataAccess = async (tableIdentifier: string, rowId: string, operation = 'SELECT') => {
    if (!isSecurityActive.value) {
      return { hasAccess: false, reason: 'Security context not initialized' }
    }
    
    try {
      const { hasAccess, error } = await rls.checkDataAccess(tableIdentifier, rowId)
      
      if (error) {
        console.warn(`Data access check failed for ${tableIdentifier}:${rowId}:`, error)
        return { hasAccess: false, reason: error.message }
      }
      
      // アクセス結果をキャッシュ（短期間）
      const accessKey = `${tableIdentifier}:${rowId}:${operation}`
      rlsState.accessPermissions[accessKey] = hasAccess
      
      // 不正アクセス試行の場合は詳細ログ
      if (!hasAccess) {
        console.warn(`🚫 Access denied: ${rlsState.userId} attempted ${operation} on ${tableIdentifier}:${rowId}`)
      }
      
      return { hasAccess, reason: hasAccess ? 'Access granted' : 'Access denied by RLS policy' }
      
    } catch (error) {
      console.error('Data access check error:', error)
      return { 
        hasAccess: false, 
        reason: 'Security check failed: ' + (error instanceof Error ? error.message : 'Unknown error')
      }
    }
  }
  
  /**
   * 監査ログの取得・管理
   * 
   * 目的：
   * - ユーザーのデータアクセス履歴の透明性確保
   * - bunenjin哲学に基づく完全な可視性提供
   * - セキュリティインシデントの早期検出
   */
  const getAuditHistory = async (days = 30, includeDetails = false) => {
    if (!isSecurityActive.value) {
      return { auditLog: [], error: 'Security context not initialized' }
    }
    
    try {
      const { auditLog, error } = await rls.getAuditLog(rlsState.userId!, days)
      
      if (error) {
        console.error('Audit log retrieval failed:', error)
        return { auditLog: [], error: error.message }
      }
      
      // プライバシーレベルに応じた情報フィルタリング
      const filteredLog = auditLog?.map(entry => {
        if (!includeDetails && rlsState.privacyLevel === 'maximum') {
          // 最高プライバシーレベルでは最小限の情報のみ
          return {
            accessed_at: entry.accessed_at,
            table_name: entry.table_name,
            operation: entry.operation,
            access_granted: entry.access_granted
          }
        }
        return entry
      }) || []
      
      console.log(`📊 Retrieved ${filteredLog.length} audit log entries for last ${days} days`)
      
      return { auditLog: filteredLog, error: null }
      
    } catch (error) {
      console.error('Audit history retrieval error:', error)
      return { 
        auditLog: [], 
        error: error instanceof Error ? error.message : 'Unknown audit error' 
      }
    }
  }
  
  /**
   * プライバシーレベルの動的変更
   * 
   * 目的：
   * - ユーザーの意思に基づくプライバシー制御の即座反映
   * - データアクセス権限の再評価・更新
   * - 変更履歴の監査証跡記録
   */
  const updatePrivacyLevel = async (newPrivacyLevel: Database['public']['Enums']['privacy_level']) => {
    if (!isSecurityActive.value) {
      return { success: false, error: 'Security context not initialized' }
    }
    
    try {
      const previousLevel = rlsState.privacyLevel
      
      // Supabase側のコンテキスト更新
      const { error } = await rls.setUserContext(rlsState.userId!, newPrivacyLevel)
      
      if (error) {
        console.error('Privacy level update failed:', error)
        return { success: false, error: error.message }
      }
      
      // ローカル状態の更新
      rlsState.privacyLevel = newPrivacyLevel
      
      // アクセス権限キャッシュのクリア（再評価が必要）
      rlsState.accessPermissions = {}
      
      console.log(`🔒 Privacy level updated: ${previousLevel} → ${newPrivacyLevel} for user ${rlsState.userId}`)
      
      return { success: true, error: null }
      
    } catch (error) {
      console.error('Privacy level update error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Privacy update failed' 
      }
    }
  }
  
  /**
   * アクセス権限マトリックスの初期化
   * 
   * プライバシーレベルに応じた基本的なアクセス権限を設定
   */
  const initializeAccessPermissions = async (
    userId: string, 
    privacyLevel: Database['public']['Enums']['privacy_level']
  ) => {
    const permissions: Record<string, boolean> = {}
    
    // bunenjin哲学に基づく段階的アクセス制御
    switch (privacyLevel) {
      case 'maximum':
        // 最高レベル：自分のデータのみ完全制御
        permissions['own_data_read'] = true
        permissions['own_data_write'] = true
        permissions['anonymous_research'] = false
        permissions['data_sharing'] = false
        break
        
      case 'high':
        // 高レベル：匿名統計への限定参加
        permissions['own_data_read'] = true
        permissions['own_data_write'] = true
        permissions['anonymous_research'] = true
        permissions['data_sharing'] = false
        break
        
      case 'medium':
        // 中レベル：研究協力・集合知への貢献
        permissions['own_data_read'] = true
        permissions['own_data_write'] = true
        permissions['anonymous_research'] = true
        permissions['data_sharing'] = true
        permissions['collective_growth'] = true
        break
        
      case 'low':
        // 低レベル：オープンな知識共有
        permissions['own_data_read'] = true
        permissions['own_data_write'] = true
        permissions['anonymous_research'] = true
        permissions['data_sharing'] = true
        permissions['collective_growth'] = true
        permissions['wisdom_sharing'] = true
        break
    }
    
    rlsState.accessPermissions = permissions
  }
  
  /**
   * セキュリティ状態のリセット
   * 
   * ログアウト時やセッション終了時の完全クリア
   */
  const clearSecurityContext = () => {
    rlsState.userId = null
    rlsState.privacyLevel = 'maximum'
    rlsState.isAuthenticated = false
    rlsState.securityContext = {}
    rlsState.lastAuditCheck = null
    rlsState.accessPermissions = {}
    
    console.log('🔐 RLS Security context cleared')
  }
  
  /**
   * セキュリティ診断・ヘルスチェック
   * 
   * RLS設定の正常性確認とセキュリティ推奨事項の提供
   */
  const runSecurityDiagnostic = async () => {
    if (!isSecurityActive.value) {
      return {
        status: 'inactive',
        recommendations: ['Initialize security context to enable RLS protection']
      }
    }
    
    const diagnostics = {
      status: 'active',
      userId: rlsState.userId,
      privacyLevel: rlsState.privacyLevel,
      auditEnabled: rlsState.auditLogEnabled,
      permissionsCount: Object.keys(rlsState.accessPermissions).length,
      lastCheck: rlsState.lastAuditCheck,
      recommendations: [] as string[]
    }
    
    // セキュリティ推奨事項の生成
    if (rlsState.privacyLevel === 'low') {
      diagnostics.recommendations.push('Consider increasing privacy level for better data protection')
    }
    
    if (!rlsState.auditLogEnabled) {
      diagnostics.recommendations.push('Enable audit logging for complete transparency')
    }
    
    if (diagnostics.recommendations.length === 0) {
      diagnostics.recommendations.push('Security configuration is optimal')
    }
    
    return diagnostics
  }
  
  return {
    // 状態
    isSecurityActive,
    privacyLevel,
    auditingEnabled,
    securityState: computed(() => ({ ...rlsState })),
    
    // メソッド
    initializeSecurityContext,
    checkDataAccess,
    getAuditHistory,
    updatePrivacyLevel,
    clearSecurityContext,
    runSecurityDiagnostic
  }
}

/**
 * RLSユーティリティ関数
 * 
 * よく使用されるセキュリティ操作の簡易ラッパー
 */
export const RLSUtils = {
  /**
   * プライバシーレベルの日本語表示名取得
   */
  getPrivacyLevelDisplayName(level: Database['public']['Enums']['privacy_level']): string {
    const names = {
      maximum: '最高（完全プライベート）',
      high: '高（匿名統計のみ）', 
      medium: '中（研究協力）',
      low: '低（知識共有）'
    }
    return names[level] || level
  },
  
  /**
   * プライバシーレベルの説明文取得
   */
  getPrivacyLevelDescription(level: Database['public']['Enums']['privacy_level']): string {
    const descriptions = {
      maximum: 'あなたのデータは完全にプライベートで、あなた以外は一切アクセスできません。',
      high: 'あなたのデータは匿名化された統計にのみ使用され、個人を特定することはできません。',
      medium: '研究目的での匿名データ使用に協力し、HAQEIシステムの改善に貢献します。',
      low: '知識の共有によって集合知の向上に貢献し、コミュニティの成長をサポートします。'
    }
    return descriptions[level] || 'プライバシーレベルの説明が見つかりません。'
  },
  
  /**
   * アクセス権限の可読性表示
   */
  formatAccessPermission(hasAccess: boolean, reason?: string): string {
    if (hasAccess) {
      return `✅ アクセス許可${reason ? ` (${reason})` : ''}`
    } else {
      return `🚫 アクセス拒否${reason ? ` (${reason})` : ''}`
    }
  }
}