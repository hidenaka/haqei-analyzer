/**
 * Supabase Client Configuration
 * 
 * 目的：
 * - Supabaseクライアントの初期化と設定
 * - データベース接続の管理
 * - 認証機能の統合
 * 
 * 機能：
 * - Supabaseクライアント初期化
 * - 環境変数からの設定読み込み
 * - エラーハンドリング
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// 環境変数の型定義
interface SupabaseConfig {
  url: string
  anonKey: string
}

/**
 * Supabase設定を環境変数から取得
 * 
 * 処理内容：
 * 1. 環境変数の存在確認
 * 2. 必須設定値の検証
 * 3. 設定オブジェクトの生成
 */
function getSupabaseConfig(): SupabaseConfig {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'Supabase configuration missing. Please check your environment variables:\n' +
      '- VITE_SUPABASE_URL\n' +
      '- VITE_SUPABASE_ANON_KEY'
    )
  }

  return { url, anonKey }
}

/**
 * Supabaseクライアントの初期化
 * 
 * 設定オプション：
 * - auth.autoRefreshToken: 自動トークン更新
 * - auth.persistSession: セッション永続化
 * - realtime: リアルタイム機能
 */
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    const config = getSupabaseConfig()
    
    supabaseClient = createClient<Database>(config.url, config.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  }

  return supabaseClient
}

/**
 * Supabase接続テスト
 * 
 * 目的：
 * アプリケーション起動時にデータベース接続を確認
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase.from('analysis_results').select('count').limit(1)
    
    if (error) {
      console.error('Supabase connection test failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return false
  }
}

/**
 * デフォルトエクスポート
 */
export const supabase = getSupabaseClient()
export type SupabaseClient = typeof supabase

// 開発環境でのデバッグ情報
if (import.meta.env.DEV) {
  console.log('🚀 Supabase client initialized in development mode')
  
  // 接続テストを実行（開発環境のみ）
  testSupabaseConnection().then(success => {
    if (success) {
      console.log('📊 Database connection ready')
    } else {
      console.warn('⚠️ Database connection issues detected')
    }
  })
}