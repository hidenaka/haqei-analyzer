/**
 * エラーメッセージユーティリティ
 * 統一されたエラーハンドリングとメッセージ表示を提供
 */

import type { SupportedLocale } from '../i18n'

// エラーコンテキストの定義
export type ErrorContext = 
  | 'network'
  | 'auth' 
  | 'database'
  | 'file'
  | 'api'
  | 'sync'
  | 'offline'
  | 'validation'
  | 'system'

// エラーコードの定義
export const ERROR_CODES = {
  // ネットワークエラー
  NETWORK_CONNECTION_FAILED: 'connectionFailed',
  NETWORK_TIMEOUT: 'timeout',
  NETWORK_SERVER_ERROR: 'serverError',
  NETWORK_NOT_FOUND: 'notFound',
  NETWORK_UNAUTHORIZED: 'unauthorized',
  NETWORK_FORBIDDEN: 'forbidden',
  NETWORK_BAD_REQUEST: 'badRequest',
  NETWORK_RATE_LIMITED: 'rateLimited',
  NETWORK_OFFLINE: 'offline',

  // 認証エラー
  AUTH_INVALID_CREDENTIALS: 'invalidCredentials',
  AUTH_SESSION_EXPIRED: 'sessionExpired',
  AUTH_ACCOUNT_LOCKED: 'accountLocked',
  AUTH_EMAIL_NOT_VERIFIED: 'emailNotVerified',
  AUTH_WEAK_PASSWORD: 'weakPassword',
  AUTH_EMAIL_ALREADY_EXISTS: 'emailAlreadyExists',
  AUTH_INVALID_TOKEN: 'invalidToken',
  AUTH_TOKEN_EXPIRED: 'tokenExpired',

  // データベースエラー
  DATABASE_CONNECTION_ERROR: 'connectionError',
  DATABASE_QUERY_ERROR: 'queryError',
  DATABASE_CONSTRAINT_VIOLATION: 'constraintViolation',
  DATABASE_DUPLICATE_KEY: 'duplicateKey',
  DATABASE_TRANSACTION_FAILED: 'transactionFailed',
  DATABASE_MIGRATION_ERROR: 'migrationError',
  DATABASE_BACKUP_ERROR: 'backupError',
  DATABASE_RESTORE_ERROR: 'restoreError',

  // ファイルエラー
  FILE_UPLOAD_FAILED: 'uploadFailed',
  FILE_DOWNLOAD_FAILED: 'downloadFailed',
  FILE_TOO_LARGE: 'fileTooLarge',
  FILE_INVALID_TYPE: 'invalidFileType',
  FILE_NOT_FOUND: 'fileNotFound',
  FILE_PERMISSION_DENIED: 'permissionDenied',
  FILE_DISK_FULL: 'diskFull',
  FILE_CORRUPTED: 'corruptedFile',

  // APIエラー
  API_INVALID_RESPONSE: 'invalidResponse',
  API_MALFORMED_DATA: 'malformedData',
  API_VERSION_MISMATCH: 'versionMismatch',
  API_QUOTA_EXCEEDED: 'quotaExceeded',
  API_SERVICE_UNAVAILABLE: 'serviceUnavailable',
  API_MAINTENANCE_MODE: 'maintenanceMode',
  API_DEPRECATED_ENDPOINT: 'deprecatedEndpoint',

  // 同期エラー
  SYNC_FAILED: 'syncFailed',
  SYNC_CONFLICT_DETECTED: 'conflictDetected',
  SYNC_OUT_OF_SYNC: 'outOfSync',
  SYNC_MERGE_FAILED: 'mergeFailed',
  SYNC_VERSION_CONFLICT: 'versionConflict',
  SYNC_LOCK_TIMEOUT: 'lockTimeout',
  SYNC_CHECKSUM_MISMATCH: 'checksumMismatch',

  // オフラインエラー
  OFFLINE_NO_CONNECTION: 'noConnection',
  OFFLINE_WEAK_CONNECTION: 'weakConnection',
  OFFLINE_DATA_NOT_AVAILABLE: 'dataNotAvailable',
  OFFLINE_SYNC_REQUIRED: 'syncRequired',
  OFFLINE_MODE_ACTIVE: 'offlineModeActive',
  OFFLINE_STORAGE_QUOTA_EXCEEDED: 'storageQuotaExceeded',

  // バリデーションエラー
  VALIDATION_INVALID_FORMAT: 'invalidFormat',
  VALIDATION_OUT_OF_RANGE: 'outOfRange',
  VALIDATION_DUPLICATE_ENTRY: 'duplicateEntry',
  VALIDATION_REFERENCE_NOT_FOUND: 'referenceNotFound',
  VALIDATION_DEPENDENCY_ERROR: 'dependencyError',
  VALIDATION_BUSINESS_RULE_VIOLATION: 'businessRuleViolation',

  // システムエラー
  SYSTEM_UNEXPECTED_ERROR: 'unexpectedError',
  SYSTEM_CONFIGURATION_ERROR: 'configurationError',
  SYSTEM_PERMISSION_ERROR: 'permissionError',
  SYSTEM_RESOURCE_NOT_FOUND: 'resourceNotFound',
  SYSTEM_SERVICE_TIMEOUT: 'serviceTimeout',
  SYSTEM_MEMORY_ERROR: 'memoryError',
  SYSTEM_DISK_ERROR: 'diskError',
  SYSTEM_CRITICAL_ERROR: 'criticalError'
} as const

// エラーコードの型定義
export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]

// エラー情報インターフェース
export interface ErrorInfo {
  code: ErrorCode
  context: ErrorContext
  message: string
  timestamp: Date
  stack?: string
  metadata?: Record<string, any>
}

// エラーレベル
export const ErrorLevel = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
} as const

export type ErrorLevelType = typeof ErrorLevel[keyof typeof ErrorLevel]

// エラーカテゴリマッピング
const ERROR_CONTEXT_MAP: Record<string, ErrorContext> = {
  NETWORK_: 'network',
  AUTH_: 'auth',
  DATABASE_: 'database',
  FILE_: 'file',
  API_: 'api',
  SYNC_: 'sync',
  OFFLINE_: 'offline',
  VALIDATION_: 'validation',
  SYSTEM_: 'system'
}

/**
 * エラーコードからコンテキストを推定
 * @param errorCode - エラーコード
 * @returns エラーコンテキスト
 */
export function getErrorContext(errorCode: string): ErrorContext {
  for (const [prefix, context] of Object.entries(ERROR_CONTEXT_MAP)) {
    if (errorCode.startsWith(prefix)) {
      return context
    }
  }
  return 'system'
}

/**
 * HTTPステータスコードからエラーコードを取得
 * @param status - HTTPステータスコード
 * @returns エラーコード
 */
export function getErrorCodeFromHttpStatus(status: number): ErrorCode {
  switch (status) {
    case 400:
      return ERROR_CODES.NETWORK_BAD_REQUEST
    case 401:
      return ERROR_CODES.NETWORK_UNAUTHORIZED
    case 403:
      return ERROR_CODES.NETWORK_FORBIDDEN
    case 404:
      return ERROR_CODES.NETWORK_NOT_FOUND
    case 408:
      return ERROR_CODES.NETWORK_TIMEOUT
    case 429:
      return ERROR_CODES.NETWORK_RATE_LIMITED
    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_CODES.NETWORK_SERVER_ERROR
    default:
      return ERROR_CODES.SYSTEM_UNEXPECTED_ERROR
  }
}

/**
 * JavaScript Errorオブジェクトからエラーコードを推定
 * @param error - Error オブジェクト
 * @returns エラーコード
 */
export function getErrorCodeFromError(error: Error): ErrorCode {
  const message = error.message.toLowerCase()
  
  // ネットワークエラー
  if (message.includes('network') || message.includes('connection')) {
    return ERROR_CODES.NETWORK_CONNECTION_FAILED
  }
  if (message.includes('timeout')) {
    return ERROR_CODES.NETWORK_TIMEOUT
  }
  if (message.includes('offline') || message.includes('internet')) {
    return ERROR_CODES.NETWORK_OFFLINE
  }
  
  // 認証エラー
  if (message.includes('unauthorized') || message.includes('authentication')) {
    return ERROR_CODES.AUTH_INVALID_CREDENTIALS
  }
  if (message.includes('token') && message.includes('expired')) {
    return ERROR_CODES.AUTH_TOKEN_EXPIRED
  }
  
  // ファイルエラー
  if (message.includes('file') && message.includes('not found')) {
    return ERROR_CODES.FILE_NOT_FOUND
  }
  if (message.includes('permission') && message.includes('denied')) {
    return ERROR_CODES.FILE_PERMISSION_DENIED
  }
  
  // バリデーションエラー
  if (message.includes('validation') || message.includes('invalid')) {
    return ERROR_CODES.VALIDATION_INVALID_FORMAT
  }
  
  return ERROR_CODES.SYSTEM_UNEXPECTED_ERROR
}

/**
 * エラーレベルを判定
 * @param errorCode - エラーコード
 * @returns エラーレベル
 */
export function getErrorLevel(errorCode: ErrorCode): ErrorLevelType {
  // クリティカルエラー
  if (errorCode === ERROR_CODES.SYSTEM_CRITICAL_ERROR ||
      errorCode === ERROR_CODES.DATABASE_CONNECTION_ERROR ||
      errorCode === ERROR_CODES.SYSTEM_MEMORY_ERROR) {
    return ErrorLevel.CRITICAL
  }
  
  // エラー
  if (errorCode.includes('ERROR') || 
      errorCode === ERROR_CODES.AUTH_INVALID_CREDENTIALS ||
      errorCode === ERROR_CODES.NETWORK_SERVER_ERROR) {
    return ErrorLevel.ERROR
  }
  
  // 警告
  if (errorCode === ERROR_CODES.AUTH_SESSION_EXPIRED ||
      errorCode === ERROR_CODES.NETWORK_RATE_LIMITED ||
      errorCode === ERROR_CODES.OFFLINE_WEAK_CONNECTION) {
    return ErrorLevel.WARNING
  }
  
  return ErrorLevel.INFO
}

/**
 * エラー情報を作成
 * @param error - Error オブジェクトまたはエラーコード
 * @param context - エラーコンテキスト（自動推定可能）
 * @param metadata - 追加のメタデータ
 * @returns エラー情報
 */
export function createErrorInfo(
  error: Error | ErrorCode,
  context?: ErrorContext,
  metadata?: Record<string, any>
): ErrorInfo {
  let code: ErrorCode
  let message: string
  let stack: string | undefined
  
  if (typeof error === 'string') {
    code = error
    message = error
  } else {
    code = getErrorCodeFromError(error)
    message = error.message
    stack = error.stack
  }
  
  const inferredContext = context || getErrorContext(code)
  
  return {
    code,
    context: inferredContext,
    message,
    timestamp: new Date(),
    stack,
    metadata
  }
}

/**
 * エラー情報をログ用文字列に変換
 * @param errorInfo - エラー情報
 * @returns ログ文字列
 */
export function formatErrorForLog(errorInfo: ErrorInfo): string {
  const level = getErrorLevel(errorInfo.code)
  const timestamp = errorInfo.timestamp.toISOString()
  
  let logMessage = `[${level.toUpperCase()}] ${timestamp} - ${errorInfo.context}:${errorInfo.code} - ${errorInfo.message}`
  
  if (errorInfo.metadata && Object.keys(errorInfo.metadata).length > 0) {
    logMessage += ` | Metadata: ${JSON.stringify(errorInfo.metadata)}`
  }
  
  if (errorInfo.stack && process.env.NODE_ENV === 'development') {
    logMessage += `\nStack: ${errorInfo.stack}`
  }
  
  return logMessage
}

/**
 * 共通エラーハンドラー
 * @param error - Error オブジェクトまたはエラーコード
 * @param context - エラーコンテキスト
 * @param metadata - 追加のメタデータ
 * @returns エラー情報
 */
export function handleError(
  error: Error | ErrorCode,
  context?: ErrorContext,
  metadata?: Record<string, any>
): ErrorInfo {
  const errorInfo = createErrorInfo(error, context, metadata)
  const logMessage = formatErrorForLog(errorInfo)
  const level = getErrorLevel(errorInfo.code)
  
  // コンソールに出力
  switch (level) {
    case ErrorLevel.CRITICAL:
      console.error(logMessage)
      break
    case ErrorLevel.ERROR:
      console.error(logMessage)
      break
    case ErrorLevel.WARNING:
      console.warn(logMessage)
      break
    case ErrorLevel.INFO:
      console.info(logMessage)
      break
  }
  
  // 将来的にはここで外部ログサービスに送信
  // await sendToErrorReportingService(errorInfo)
  
  return errorInfo
}

/**
 * ネットワークエラー専用ハンドラー
 * @param error - Error オブジェクト
 * @param requestInfo - リクエスト情報
 * @returns エラー情報
 */
export function handleNetworkError(
  error: Error,
  requestInfo?: {
    url?: string
    method?: string
    status?: number
  }
): ErrorInfo {
  let errorCode: ErrorCode
  
  if (requestInfo?.status) {
    errorCode = getErrorCodeFromHttpStatus(requestInfo.status)
  } else {
    errorCode = getErrorCodeFromError(error)
  }
  
  return handleError(errorCode, 'network', {
    originalError: error.message,
    ...requestInfo
  })
}

/**
 * 非同期操作のエラーラッパー
 * @param asyncFn - 非同期関数
 * @param context - エラーコンテキスト
 * @param metadata - 追加のメタデータ
 * @returns エラーハンドリング付きの非同期関数
 */
export function withErrorHandling<T extends any[], R>(
  asyncFn: (...args: T) => Promise<R>,
  context?: ErrorContext,
  metadata?: Record<string, any>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await asyncFn(...args)
    } catch (error) {
      handleError(error as Error, context, metadata)
      throw error
    }
  }
}

// デフォルトエクスポート
export default {
  ERROR_CODES,
  ErrorLevel,
  getErrorContext,
  getErrorCodeFromHttpStatus,
  getErrorCodeFromError,
  getErrorLevel,
  createErrorInfo,
  formatErrorForLog,
  handleError,
  handleNetworkError,
  withErrorHandling
}