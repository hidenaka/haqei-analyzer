/**
 * HAQEIシステム統合E2Eテストスイート
 * Day 3完了システムの包括的品質保証検証
 * 
 * テスト対象：
 * - ユーザー登録→易経診断→結果表示の完全フロー
 * - Triple OS分析機能動作確認
 * - データ保存・復元機能テスト
 * - RLS・セキュリティ・プライバシー保護検証
 * - bunenjin哲学実装の動作確認
 * - Future Simulator 90%成功率維持確認
 * - Vue3統合システム全体動作確認
 * - パフォーマンス・負荷・レスポンス時間テスト
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

// Components
import App from '../App.vue'
import QuestionFlow from '../components/QuestionFlow.vue'
import AnalysisView from '../views/AnalysisView.vue'
import ResultsView from '../views/ResultsView.vue'

// Services & Composables
import { useDatabase } from '../composables/useDatabase'
import { useRLS } from '../composables/useRLS'
import { useOfflineDatabase } from '../composables/useOfflineDatabase'
import { useMigration } from '../composables/useMigration'
import { useTripleOS } from '../composables/useTripleOS'

// Utils
import { tripleOSEngine } from '../utils/tripleOSEngine'
import { calculator } from '../utils/calculator'

// Types
import type { Answer, Question, AnalysisResult } from '../data/types'

// Mock data
const mockQuestions: Question[] = [
  {
    id: 'Q1',
    text: 'テスト設問：あなたの行動パターンは？',
    choices: [
      { id: 'Q1A', text: '計画的に進める', value: 'A' },
      { id: 'Q1B', text: '直感で判断する', value: 'B' }
    ],
    category: 'thinking',
    dimension: 'structure'
  },
  {
    id: 'Q2', 
    text: 'テスト設問：ストレス対処法は？',
    choices: [
      { id: 'Q2A', text: '論理的に分析する', value: 'A' },
      { id: 'Q2B', text: '感情を受け入れる', value: 'B' }
    ],
    category: 'emotional',
    dimension: 'harmony'
  }
]

const mockAnswers: Answer[] = [
  {
    questionId: 'Q1',
    selectedValue: 'A',
    selectedChoice: 'Q1A',
    choiceText: '計画的に進める',
    timestamp: Date.now(),
    confidence: 0.8
  },
  {
    questionId: 'Q2',
    selectedValue: 'B', 
    selectedChoice: 'Q2B',
    choiceText: '感情を受け入れる',
    timestamp: Date.now(),
    confidence: 0.9
  }
]

describe('HAQEIシステム統合E2Eテスト', () => {
  let pinia: any
  let router: any
  let mockUser: any
  
  beforeAll(async () => {
    // Pinia & Router setup
    pinia = createPinia()
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/questions', component: QuestionFlow },
        { path: '/analysis', component: AnalysisView },
        { path: '/results', component: ResultsView }
      ]
    })
    
    // Mock user for testing
    mockUser = {
      id: 'test-user-' + Date.now(),
      email: 'test@haqei.test',
      metadata: { name: 'テストユーザー' }
    }
    
    // Setup test environment
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    } as any
    
    global.indexedDB = {
      open: vi.fn(),
      deleteDatabase: vi.fn()
    } as any
    
    console.log('🧪 E2E テスト環境初期化完了')
  })
  
  afterAll(() => {
    console.log('🏁 E2E テスト終了')
  })
  
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  describe('1. エンドツーエンドフローテスト', () => {
    it('1.1 ユーザー登録→易経診断→結果表示の完全フロー', async () => {
      console.log('🚀 完全フローテスト開始')
      
      // Phase 1: ユーザー登録・認証
      const { initializeDatabase, saveUserData } = useDatabase()
      await initializeDatabase()
      
      const userData = await saveUserData(mockUser.id, {
        profile: mockUser.metadata,
        preferences: { theme: 'light', language: 'ja' }
      })
      
      expect(userData).toBeDefined()
      expect(userData.id).toBe(mockUser.id)
      
      // Phase 2: 設問回答フロー
      const wrapper = mount(QuestionFlow, {
        global: {
          plugins: [pinia, router]
        },
        props: {
          questions: mockQuestions
        }
      })
      
      // 設問1回答
      const firstQuestion = wrapper.find('[data-testid="question-0"]')
      expect(firstQuestion.exists()).toBe(true)
      
      const choice1 = wrapper.find('[data-testid="choice-Q1A"]')
      await choice1.trigger('click')
      
      // 次の設問へ進む
      await wrapper.vm.$nextTick()
      
      // 設問2回答
      const choice2 = wrapper.find('[data-testid="choice-Q2B"]')
      await choice2.trigger('click')
      
      // Phase 3: 分析実行
      const analysisResult = tripleOSEngine.analyze(mockAnswers)
      
      expect(analysisResult).toBeDefined()
      expect(analysisResult.tripleOS).toBeDefined()
      expect(analysisResult.dimensions).toBeDefined()
      expect(analysisResult.hexagram).toBeDefined()
      
      // Phase 4: 結果表示確認
      expect(analysisResult.tripleOS.conscious).toBeGreaterThanOrEqual(0)
      expect(analysisResult.tripleOS.conscious).toBeLessThanOrEqual(100)
      expect(analysisResult.tripleOS.subconscious).toBeGreaterThanOrEqual(0)
      expect(analysisResult.tripleOS.subconscious).toBeLessThanOrEqual(100)
      expect(analysisResult.tripleOS.superconscious).toBeGreaterThanOrEqual(0)
      expect(analysisResult.tripleOS.superconscious).toBeLessThanOrEqual(100)
      
      console.log('✅ 完全フローテスト成功', {
        user: userData.id,
        answers: mockAnswers.length,
        tripleOS: analysisResult.tripleOS,
        hexagram: analysisResult.hexagram.number
      })
    }, 30000)
    
    it('1.2 Triple OS分析機能動作確認', async () => {
      console.log('🔬 Triple OS分析テスト開始')
      
      const { analyzeTripleOS, validateOSBalance } = useTripleOS()
      
      // 分析実行
      const result = await analyzeTripleOS(mockAnswers)
      
      expect(result).toBeDefined()
      expect(result.conscious).toBeGreaterThanOrEqual(0)
      expect(result.subconscious).toBeGreaterThanOrEqual(0)
      expect(result.superconscious).toBeGreaterThanOrEqual(0)
      
      // バランス検証
      const balance = validateOSBalance(result)
      expect(balance.isBalanced).toBeDefined()
      expect(balance.dominantOS).toBeDefined()
      expect(balance.suggestions).toBeDefined()
      expect(Array.isArray(balance.suggestions)).toBe(true)
      
      console.log('✅ Triple OS分析成功', {
        result,
        balance: balance.isBalanced,
        dominant: balance.dominantOS
      })
    })
    
    it('1.3 データ保存・復元機能テスト', async () => {
      console.log('💾 データ保存・復元テスト開始')
      
      const { initializeDatabase, saveAnalysisResult, getAnalysisHistory } = useDatabase()
      await initializeDatabase()
      
      // テスト分析結果
      const testResult: AnalysisResult = {
        id: 'test-analysis-' + Date.now(),
        userId: mockUser.id,
        timestamp: Date.now(),
        tripleOS: { conscious: 70, subconscious: 60, superconscious: 80 },
        dimensions: {
          structure: 75,
          harmony: 65,
          innovation: 85,
          empathy: 70,
          resilience: 80,
          wisdom: 90
        },
        hexagram: {
          number: 42,
          name: '益',
          description: '増益・成長・発展',
          lines: [true, false, true, true, false, true]
        },
        insights: ['テスト洞察1', 'テスト洞察2'],
        recommendations: ['テスト推奨1', 'テスト推奨2']
      }
      
      // データ保存
      const savedResult = await saveAnalysisResult(testResult)
      expect(savedResult).toBeDefined()
      expect(savedResult.id).toBe(testResult.id)
      
      // データ復元
      const history = await getAnalysisHistory(mockUser.id)
      expect(Array.isArray(history)).toBe(true)
      expect(history.length).toBeGreaterThan(0)
      
      const retrieved = history.find(r => r.id === testResult.id)
      expect(retrieved).toBeDefined()
      expect(retrieved?.tripleOS.conscious).toBe(70)
      
      console.log('✅ データ保存・復元成功', {
        saved: savedResult.id,
        retrieved: retrieved?.id,
        historyCount: history.length
      })
    })
  })
  
  describe('2. セキュリティ統合テスト', () => {
    it('2.1 RLS政策の実運用確認', async () => {
      console.log('🔒 RLS政策テスト開始')
      
      const { testRLSPolicies, validateDataIsolation } = useRLS()
      
      // RLS政策テスト
      const rlsResult = await testRLSPolicies(mockUser.id)
      
      expect(rlsResult.authenticated).toBe(true)
      expect(rlsResult.canAccessOwnData).toBe(true)
      expect(rlsResult.canAccessOthersData).toBe(false)
      expect(rlsResult.policies.length).toBeGreaterThan(0)
      
      // データ分離確認
      const isolation = await validateDataIsolation(mockUser.id, 'other-user-id')
      expect(isolation.isIsolated).toBe(true)
      expect(isolation.leakageDetected).toBe(false)
      
      console.log('✅ RLS政策テスト成功', {
        policies: rlsResult.policies.length,
        isolated: isolation.isIsolated
      })
    })
    
    it('2.2 プライバシー保護機能検証', async () => {
      console.log('🛡️ プライバシー保護テスト開始')
      
      // 個人データ暗号化テスト
      const sensitiveData = {
        email: 'test@example.com',
        answers: mockAnswers,
        analysis: { tripleOS: { conscious: 70, subconscious: 60, superconscious: 80 } }
      }
      
      const { encryptSensitiveData, decryptSensitiveData } = useDatabase()
      
      const encrypted = await encryptSensitiveData(sensitiveData)
      expect(encrypted).toBeDefined()
      expect(encrypted).not.toEqual(sensitiveData)
      
      const decrypted = await decryptSensitiveData(encrypted)
      expect(decrypted).toEqual(sensitiveData)
      
      console.log('✅ プライバシー保護テスト成功')
    })
  })
  
  describe('3. データ統合テスト', () => {
    it('3.1 localStorage→Supabase移行動作確認', async () => {
      console.log('🔄 データ移行テスト開始')
      
      const { migrateLegacyData, validateMigration } = useMigration()
      
      // レガシーデータ準備
      const legacyData = {
        'haqei_answers': JSON.stringify(mockAnswers),
        'haqei_analysis': JSON.stringify({
          tripleOS: { conscious: 70, subconscious: 60, superconscious: 80 },
          timestamp: Date.now()
        })
      }
      
      // localStorage mock設定
      Object.keys(legacyData).forEach(key => {
        global.localStorage.getItem = vi.fn().mockImplementation((k) => 
          k === key ? legacyData[k] : null
        )
      })
      
      // 移行実行
      const migrationResult = await migrateLegacyData(mockUser.id)
      
      expect(migrationResult.success).toBe(true)
      expect(migrationResult.migratedItems).toBeGreaterThan(0)
      expect(migrationResult.errors.length).toBe(0)
      
      // 移行検証
      const validation = await validateMigration(mockUser.id)
      expect(validation.isComplete).toBe(true)
      expect(validation.dataIntegrity).toBe(true)
      
      console.log('✅ データ移行テスト成功', {
        migrated: migrationResult.migratedItems,
        valid: validation.isComplete
      })
    })
    
    it('3.2 IndexedDBオフライン機能テスト', async () => {
      console.log('📱 オフライン機能テスト開始')
      
      const { saveOffline, getOfflineData, syncWhenOnline } = useOfflineDatabase()
      
      // オフラインデータ保存
      const offlineResult = {
        id: 'offline-test-' + Date.now(),
        data: mockAnswers,
        timestamp: Date.now(),
        synced: false
      }
      
      await saveOffline('answers', offlineResult)
      
      // オフラインデータ取得
      const retrieved = await getOfflineData('answers', offlineResult.id)
      expect(retrieved).toBeDefined()
      expect(retrieved.data).toEqual(mockAnswers)
      expect(retrieved.synced).toBe(false)
      
      // オンライン同期
      const syncResult = await syncWhenOnline()
      expect(syncResult.success).toBe(true)
      expect(syncResult.syncedItems).toBeGreaterThanOrEqual(0)
      
      console.log('✅ オフライン機能テスト成功', {
        saved: offlineResult.id,
        synced: syncResult.syncedItems
      })
    })
  })
  
  describe('4. パフォーマンステスト', () => {
    it('4.1 応答時間測定（目標<2秒）', async () => {
      console.log('⏱️ 応答時間テスト開始')
      
      const startTime = performance.now()
      
      // 完全な分析処理を実行
      const analysisResult = tripleOSEngine.analyze(mockAnswers)
      const calculations = calculator.calculateAllDimensions(mockAnswers)
      
      const endTime = performance.now()
      const responseTime = endTime - startTime
      
      expect(responseTime).toBeLessThan(2000) // 2秒以内
      expect(analysisResult).toBeDefined()
      expect(calculations).toBeDefined()
      
      console.log('✅ 応答時間テスト成功', {
        responseTime: Math.round(responseTime),
        target: '< 2000ms'
      })
    })
    
    it('4.2 メモリ・CPU使用率確認', async () => {
      console.log('💻 リソース使用率テスト開始')
      
      const initialMemory = process.memoryUsage().heapUsed
      const startTime = performance.now()
      
      // 集約的な処理を実行
      const results = []
      for (let i = 0; i < 100; i++) {
        results.push(tripleOSEngine.analyze(mockAnswers))
      }
      
      const endTime = performance.now()
      const finalMemory = process.memoryUsage().heapUsed
      
      const memoryIncrease = finalMemory - initialMemory
      const processingTime = endTime - startTime
      
      // メモリ使用量は50MB以下であること
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024)
      
      // 100回の処理が10秒以内であること
      expect(processingTime).toBeLessThan(10000)
      
      console.log('✅ リソース使用率テスト成功', {
        memoryIncrease: Math.round(memoryIncrease / 1024 / 1024) + 'MB',
        processingTime: Math.round(processingTime) + 'ms',
        iterations: results.length
      })
    })
  })
  
  describe('5. bunenjin哲学テスト', () => {
    it('5.1 多面性受容機能確認', async () => {
      console.log('🎭 多面性受容テスト開始')
      
      // 矛盾する回答パターンをテスト
      const contradictoryAnswers: Answer[] = [
        {
          questionId: 'Q1',
          selectedValue: 'A', // 論理的
          selectedChoice: 'Q1A',
          choiceText: '論理的に判断',
          timestamp: Date.now(),
          confidence: 0.9
        },
        {
          questionId: 'Q2',
          selectedValue: 'B', // 感情的
          selectedChoice: 'Q2B', 
          choiceText: '感情で決める',
          timestamp: Date.now(),
          confidence: 0.8
        }
      ]
      
      const result = tripleOSEngine.analyze(contradictoryAnswers)
      
      // bunenjin哲学：矛盾を受容し統合する
      expect(result.bunenjinInsights).toBeDefined()
      expect(result.bunenjinInsights.contradictionAcceptance).toBe(true)
      expect(result.bunenjinInsights.harmonyPath).toBeDefined()
      expect(result.bunenjinInsights.multiFacetedNature).toBeDefined()
      
      console.log('✅ 多面性受容テスト成功', {
        contradictions: result.bunenjinInsights.contradictionAcceptance,
        harmony: result.bunenjinInsights.harmonyPath
      })
    })
    
    it('5.2 調和追求アルゴリズム動作確認', async () => {
      console.log('☯️ 調和追求テスト開始')
      
      const { findHarmonyPath, optimizeBalance } = useTripleOS()
      
      // 不均衡なTriple OS
      const imbalancedOS = {
        conscious: 90,   // 高い
        subconscious: 30, // 低い  
        superconscious: 40 // 低い
      }
      
      const harmonyPath = await findHarmonyPath(imbalancedOS)
      const optimizedBalance = await optimizeBalance(imbalancedOS)
      
      expect(harmonyPath).toBeDefined()
      expect(harmonyPath.steps).toBeDefined()
      expect(harmonyPath.steps.length).toBeGreaterThan(0)
      
      expect(optimizedBalance).toBeDefined()
      expect(Math.abs(optimizedBalance.conscious - optimizedBalance.subconscious)).toBeLessThan(30)
      expect(Math.abs(optimizedBalance.conscious - optimizedBalance.superconscious)).toBeLessThan(30)
      
      console.log('✅ 調和追求テスト成功', {
        steps: harmonyPath.steps.length,
        optimized: optimizedBalance
      })
    })
  })
  
  describe('6. Future Simulator テスト', () => {
    it('6.1 90%成功率維持確認', async () => {
      console.log('🔮 Future Simulator テスト開始')
      
      // 100回のシミュレーション実行
      let successCount = 0
      const totalRuns = 100
      
      for (let i = 0; i < totalRuns; i++) {
        try {
          const simulation = tripleOSEngine.simulateFuture(mockAnswers, {
            timeframe: '1year',
            scenarios: 3,
            focusAreas: ['career', 'relationships', 'personal_growth']
          })
          
          if (simulation && simulation.scenarios && simulation.scenarios.length > 0) {
            successCount++
          }
        } catch (error) {
          // エラーは失敗としてカウント
          console.warn(`シミュレーション ${i + 1} でエラー:`, error)
        }
      }
      
      const successRate = (successCount / totalRuns) * 100
      
      expect(successRate).toBeGreaterThanOrEqual(90)
      
      console.log('✅ Future Simulator テスト成功', {
        successRate: successRate.toFixed(1) + '%',
        successCount,
        totalRuns
      })
    })
  })
  
  describe('7. Vue3統合システムテスト', () => {
    it('7.1 コンポーネント統合動作確認', async () => {
      console.log('⚡ Vue3統合テスト開始')
      
      // App全体をマウント
      const wrapper = mount(App, {
        global: {
          plugins: [pinia, router]
        }
      })
      
      expect(wrapper.vm).toBeDefined()
      
      // 主要コンポーネントの存在確認
      await router.push('/questions')
      await wrapper.vm.$nextTick()
      
      // QuestionFlowコンポーネント
      const questionFlow = wrapper.findComponent(QuestionFlow)
      expect(questionFlow.exists()).toBe(true)
      
      // 分析画面への遷移
      await router.push('/analysis')
      await wrapper.vm.$nextTick()
      
      const analysisView = wrapper.findComponent(AnalysisView)
      expect(analysisView.exists()).toBe(true)
      
      // 結果画面への遷移
      await router.push('/results')
      await wrapper.vm.$nextTick()
      
      const resultsView = wrapper.findComponent(ResultsView)
      expect(resultsView.exists()).toBe(true)
      
      console.log('✅ Vue3統合テスト成功')
    })
  })
})

// テスト終了後のクリーンアップ
process.on('exit', () => {
  console.log('🧹 E2Eテスト環境クリーンアップ')
})
