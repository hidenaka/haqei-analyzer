/**
 * Vitest Setup File - Global Test Configuration
 * 
 * 目的：
 * - グローバルテスト環境の設定
 * - 共通モックの設定
 * - Dexie.jsのモック設定
 * - Vue環境の準備
 */

import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Vue Test Utils グローバル設定
config.global.stubs = {
  // 必要に応じてグローバルスタブを設定
}

// Dexie.jsモック
vi.mock('dexie', () => {
  // モックテーブル作成関数
  const createMockTable = () => ({
    add: vi.fn().mockResolvedValue('mock-id'),
    get: vi.fn().mockResolvedValue(undefined),
    put: vi.fn().mockResolvedValue('mock-id'),
    delete: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
    count: vi.fn().mockResolvedValue(0),
    toArray: vi.fn().mockResolvedValue([]),
    bulkAdd: vi.fn().mockResolvedValue([]),
    where: vi.fn().mockReturnThis(),
    equals: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    reverse: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    and: vi.fn().mockReturnThis(),
    modify: vi.fn().mockResolvedValue(0),
    update: vi.fn().mockResolvedValue(1),
    toCollection: vi.fn().mockReturnThis(),
    first: vi.fn().mockResolvedValue(undefined),
  })

  // Dexieモッククラス
  class MockDexie {
    users = createMockTable()
    analysisResults = createMockTable()
    analysisSessions = createMockTable()
    questionResponses = createMockTable()
    hexagrams = createMockTable()
    trigrams = createMockTable()
    yaoLines = createMockTable()
    engineOSProfiles = createMockTable()
    interfaceOSProfiles = createMockTable()
    safeModeOSProfiles = createMockTable()
    osInteractions = createMockTable()
    offlineOperations = createMockTable()
    dataVersions = createMockTable()
    syncConfig = {
      ...createMockTable(),
      get: vi.fn().mockResolvedValue({
        id: 'default',
        enabled: true,
        autoSync: true,
        syncInterval: 60000,
        maxRetries: 3,
        conflictResolution: 'local',
        batchSize: 50
      })
    }
    cacheData = createMockTable()
    
    // tables配列
    tables = [
      { name: 'users', ...this.users },
      { name: 'analysisResults', ...this.analysisResults },
      { name: 'analysisSessions', ...this.analysisSessions },
      { name: 'questionResponses', ...this.questionResponses },
      { name: 'offlineOperations', ...this.offlineOperations },
      { name: 'dataVersions', ...this.dataVersions },
      { name: 'syncConfig', ...this.syncConfig },
      { name: 'cacheData', ...this.cacheData }
    ]
    
    // verno
    verno = 2
    
    constructor(name: string) {
      // Constructor logic if needed
    }
    
    version = vi.fn().mockReturnThis()
    stores = vi.fn().mockReturnThis()
    upgrade = vi.fn().mockReturnThis()
    on = vi.fn().mockReturnThis()
    open = vi.fn().mockResolvedValue(undefined)
    close = vi.fn().mockResolvedValue(undefined)
    transaction = vi.fn((mode, tables, fn) => fn())
    
    clearAllData = vi.fn().mockResolvedValue(undefined)
    
    // 統計情報メソッド
    getStatistics = vi.fn().mockResolvedValue({
      totalRecords: 0,
      offlineOperations: 0,
      cacheSize: 0,
      lastSyncTime: null,
      tables: {
        users: 0,
        analysisResults: 0,
        analysisSessions: 0,
        questionResponses: 0
      }
    })
    
    // 整合性チェックメソッド
    performIntegrityCheck = vi.fn().mockResolvedValue({
      isValid: true,
      issues: [],
      recommendations: []
    })
    
    // バックアップメソッド
    createBackup = vi.fn().mockResolvedValue({
      data: {},
      metadata: {
        version: 2,
        timestamp: Date.now(),
        recordCount: 0,
        checksum: 'mock-checksum'
      }
    })
    
    // 復元メソッド
    restoreFromBackup = vi.fn().mockResolvedValue(undefined)
  }
  
  // 静的プロパティの追加
  MockDexie.liveQuery = vi.fn((fn) => ({
    subscribe: vi.fn((observer) => {
      // 即座にコールバックを実行
      Promise.resolve().then(() => {
        observer.next(fn())
      })
      // unsubscribe関数を返す
      return { unsubscribe: vi.fn() }
    })
  }))

  return {
    default: MockDexie,
    Dexie: MockDexie,
    Table: vi.fn(),
    liveQuery: MockDexie.liveQuery
  }
})

// グローバルオブジェクトのモック
global.window = global.window || {}
Object.assign(global.window, {
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
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0
  },
  location: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000'
  }
})

// navigator のグローバル設定
Object.defineProperty(global, 'navigator', {
  value: {
    onLine: true,
    userAgent: 'test-agent'
  },
  writable: true,
  configurable: true
})

// performance のモック
global.performance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn(),
  getEntriesByName: vi.fn(() => []),
  getEntriesByType: vi.fn(() => [])
} as any

// document のモック
global.document = global.document || {
  createElement: vi.fn((tag: string) => ({
    tagName: tag.toUpperCase(),
    style: {},
    setAttribute: vi.fn(),
    getAttribute: vi.fn(),
    appendChild: vi.fn(),
    removeChild: vi.fn(),
    click: vi.fn(),
    href: '',
    download: ''
  })),
  body: {
    appendChild: vi.fn(),
    removeChild: vi.fn()
  }
} as any

// URL のモック
global.URL = {
  createObjectURL: vi.fn(() => 'blob:mock-url'),
  revokeObjectURL: vi.fn()
} as any

// Blob のモック  
global.Blob = vi.fn((content, options) => ({
  size: JSON.stringify(content).length,
  type: options?.type || 'application/octet-stream'
})) as any

// console メソッドのモック（テスト実行時のノイズを減らす）
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
}