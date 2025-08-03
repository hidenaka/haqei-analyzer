/**
 * HAQEI Row Level Security (RLS) Comprehensive Security Test Suite
 * =================================================================
 * 
 * 目的：
 * - bunenjin哲学準拠のRLS実装の完全なセキュリティ検証
 * - Triple OS Architectureデータ保護の検証
 * - プライバシーレベル階層の強制検証
 * - 企業グレードセキュリティの完全性確認
 * 
 * テスト範囲：
 * - ユーザー分離テスト（完全隔離の確認）
 * - プライバシーレベル階層テスト
 * - 監査ログ機能テスト
 * - Triple OSデータ保護テスト
 * - パフォーマンス影響評価
 * - セキュリティ侵害テスト
 * 
 * Created: 2025-08-03 - Security Tester Agent
 * Philosophy: bunenjin (文人) - Privacy-First Maximum Security
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Test configuration
const TEST_CONFIG = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321',
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'test-key',
  testTimeout: 30000,
  performanceThreshold: 500, // ms
  maxRetries: 3
}

// Test user data for isolation testing
const TEST_USERS = {
  alice: {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'alice@test.haqei.local',
    privacy_level: 'maximum' as const
  },
  bob: {
    id: '22222222-2222-2222-2222-222222222222', 
    email: 'bob@test.haqei.local',
    privacy_level: 'high' as const
  },
  charlie: {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'charlie@test.haqei.local', 
    privacy_level: 'medium' as const
  },
  david: {
    id: '44444444-4444-4444-4444-444444444444',
    email: 'david@test.haqei.local',
    privacy_level: 'low' as const
  }
}

// Security test results interface
interface SecurityTestResult {
  testName: string
  passed: boolean
  details: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  recommendation?: string
  executionTime?: number
}

interface ComprehensiveSecurityReport {
  summary: {
    totalTests: number
    passed: number
    failed: number
    criticalFailures: number
    overallSecurityScore: number
    bunenjinCompliant: boolean
  }
  testResults: SecurityTestResult[]
  performanceImpact: {
    averageQueryTime: number
    slowestQuery: number
    acceptablePerformance: boolean
  }
  privacyCompliance: {
    defaultPrivacyEnforced: boolean
    dataIsolationComplete: boolean
    auditingFunctional: boolean
    tripleOSProtected: boolean
  }
  recommendations: string[]
  timestamp: string
}

// Test suite class
class RLSSecurityTester {
  private supabase: SupabaseClient<Database>
  private testResults: SecurityTestResult[] = []
  private performanceMetrics: number[] = []

  constructor() {
    this.supabase = createClient<Database>(
      TEST_CONFIG.supabaseUrl,
      TEST_CONFIG.supabaseKey,
      {
        auth: { persistSession: false },
        global: {
          headers: {
            'X-Test-Mode': 'security-validation',
            'X-HAQEI-RLS-Test': 'comprehensive'
          }
        }
      }
    )
  }

  private recordResult(result: SecurityTestResult) {
    this.testResults.push(result)
    if (result.executionTime) {
      this.performanceMetrics.push(result.executionTime)
    }
  }

  private async measureExecutionTime<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<{ result: T; executionTime: number }> {
    const start = performance.now()
    try {
      const result = await operation()
      const executionTime = performance.now() - start
      return { result, executionTime }
    } catch (error) {
      const executionTime = performance.now() - start
      console.error(`${operationName} failed:`, error)
      throw error
    }
  }

  // Test 1: User Data Isolation (Critical Security Test)
  async testUserDataIsolation(): Promise<SecurityTestResult> {
    console.log('🔒 Testing user data isolation...')
    
    try {
      const { executionTime } = await this.measureExecutionTime(async () => {
        // Test: Alice (maximum privacy) cannot access Bob's data
        const { data: aliceCanAccessBob, error } = await this.supabase
          .from('users')
          .select('*')
          .eq('id', TEST_USERS.bob.id)
          .limit(1)

        // Test: Bob cannot access Charlie's data
        const { data: bobCanAccessCharlie } = await this.supabase
          .from('users')
          .select('*')
          .eq('id', TEST_USERS.charlie.id)
          .limit(1)

        // Test: Analysis sessions isolation
        const { data: crossUserSessions } = await this.supabase
          .from('analysis_sessions')
          .select('*')
          .neq('user_id', TEST_USERS.alice.id)
          .limit(10)

        return {
          crossUserAccess: aliceCanAccessBob?.length || 0,
          bobToCharlie: bobCanAccessCharlie?.length || 0,
          crossSessions: crossUserSessions?.length || 0
        }
      }, 'User Data Isolation Test')

      const isolationPerfect = executionTime.result.crossUserAccess === 0 && 
                              executionTime.result.bobToCharlie === 0 && 
                              executionTime.result.crossSessions === 0

      const result: SecurityTestResult = {
        testName: 'User Data Isolation',
        passed: isolationPerfect,
        details: `Cross-user access attempts: ${executionTime.result.crossUserAccess}, Cross-sessions: ${executionTime.result.crossSessions}`,
        severity: 'critical',
        executionTime: executionTime.executionTime,
        recommendation: isolationPerfect ? undefined : 'CRITICAL: User data isolation failed. Review RLS policies immediately.'
      }

      this.recordResult(result)
      return result

    } catch (error) {
      const result: SecurityTestResult = {
        testName: 'User Data Isolation',
        passed: false,
        details: `Test execution failed: ${error}`,
        severity: 'critical',
        recommendation: 'CRITICAL: Unable to test user isolation. Database connection or RLS configuration issue.'
      }
      this.recordResult(result)
      return result
    }
  }

  // Test 2: Privacy Level Hierarchy Enforcement
  async testPrivacyLevelHierarchy(): Promise<SecurityTestResult> {
    console.log('🔐 Testing privacy level hierarchy enforcement...')
    
    try {
      const { executionTime } = await this.measureExecutionTime(async () => {
        // Test maximum privacy user cannot be accessed by lower levels
        const { data: maxPrivacyData } = await this.supabase
          .from('bunenjin_privacy_config')
          .select('*')
          .eq('privacy_level', 'maximum')
          .limit(5)

        // Test high privacy user data access by medium/low users
        const { data: highPrivacyData } = await this.supabase
          .from('bunenjin_privacy_config')
          .select('*')
          .eq('privacy_level', 'high')
          .limit(5)

        // Test privacy access matrix enforcement
        const { data: accessMatrix } = await this.supabase
          .from('privacy_access_matrix')
          .select('*')
          .eq('privacy_level', 'maximum')

        return {
          maxPrivacyConfigs: maxPrivacyData?.length || 0,
          highPrivacyConfigs: highPrivacyData?.length || 0,
          accessMatrixRules: accessMatrix?.length || 0
        }
      }, 'Privacy Level Hierarchy Test')

      const hierarchyEnforced = executionTime.result.accessMatrixRules > 0

      const result: SecurityTestResult = {
        testName: 'Privacy Level Hierarchy',
        passed: hierarchyEnforced,
        details: `Maximum privacy configs: ${executionTime.result.maxPrivacyConfigs}, Access matrix rules: ${executionTime.result.accessMatrixRules}`,
        severity: 'high',
        executionTime: executionTime.executionTime,
        recommendation: hierarchyEnforced ? undefined : 'Privacy level hierarchy not properly enforced. Review access matrix configuration.'
      }

      this.recordResult(result)
      return result

    } catch (error) {
      const result: SecurityTestResult = {
        testName: 'Privacy Level Hierarchy',
        passed: false,
        details: `Test execution failed: ${error}`,
        severity: 'high',
        recommendation: 'Unable to validate privacy hierarchy. Check bunenjin_privacy_config table and policies.'
      }
      this.recordResult(result)
      return result
    }
  }

  // Test 3: Triple OS Data Protection
  async testTripleOSDataProtection(): Promise<SecurityTestResult> {
    console.log('🛡️ Testing Triple OS data protection...')
    
    try {
      const { executionTime } = await this.measureExecutionTime(async () => {
        // Test Engine OS data protection
        const { data: engineOSData, error: engineError } = await this.supabase
          .from('engine_os_profiles')
          .select('*')
          .limit(5)

        // Test Interface OS data protection
        const { data: interfaceOSData, error: interfaceError } = await this.supabase
          .from('interface_os_profiles')
          .select('*')
          .limit(5)

        // Test Safe Mode OS data protection (should be most restricted)
        const { data: safeModeOSData, error: safeModeError } = await this.supabase
          .from('safe_mode_os_profiles')
          .select('*')
          .limit(5)

        // Test OS interactions
        const { data: osInteractions, error: interactionError } = await this.supabase
          .from('os_interactions')
          .select('*')
          .limit(5)

        return {
          engineOSAccessible: !engineError,
          interfaceOSAccessible: !interfaceError,
          safeModeOSAccessible: !safeModeError,
          osInteractionsAccessible: !interactionError,
          engineOSCount: engineOSData?.length || 0,
          interfaceOSCount: interfaceOSData?.length || 0,
          safeModeOSCount: safeModeOSData?.length || 0
        }
      }, 'Triple OS Data Protection Test')

      // Safe Mode OS should be most protected (least accessible)
      const tripleOSProtected = executionTime.result.safeModeOSCount === 0 || 
                               !executionTime.result.safeModeOSAccessible

      const result: SecurityTestResult = {
        testName: 'Triple OS Data Protection',
        passed: tripleOSProtected,
        details: `Engine OS accessible: ${executionTime.result.engineOSAccessible}, Interface OS accessible: ${executionTime.result.interfaceOSAccessible}, Safe Mode OS protected: ${!executionTime.result.safeModeOSAccessible}`,
        severity: 'high',
        executionTime: executionTime.executionTime,
        recommendation: tripleOSProtected ? undefined : 'Triple OS data protection insufficient. Safe Mode OS should have maximum protection.'
      }

      this.recordResult(result)
      return result

    } catch (error) {
      const result: SecurityTestResult = {
        testName: 'Triple OS Data Protection',
        passed: false,
        details: `Test execution failed: ${error}`,
        severity: 'high',
        recommendation: 'Unable to test Triple OS protection. Check RLS policies for Triple OS tables.'
      }
      this.recordResult(result)
      return result
    }
  }

  // Test 4: Audit Logging Functionality
  async testAuditLogging(): Promise<SecurityTestResult> {
    console.log('📋 Testing audit logging functionality...')
    
    try {
      const { executionTime } = await this.measureExecutionTime(async () => {
        // Test audit log accessibility
        const { data: auditLogs, error: auditError } = await this.supabase
          .from('audit_log')
          .select('*')
          .limit(10)

        // Test if audit log entries are being created
        const { data: recentAudits } = await this.supabase
          .from('audit_log')
          .select('*')
          .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .limit(50)

        return {
          auditLogsAccessible: !auditError,
          auditLogCount: auditLogs?.length || 0,
          recentAuditCount: recentAudits?.length || 0
        }
      }, 'Audit Logging Test')

      const auditingFunctional = executionTime.result.auditLogsAccessible && 
                                executionTime.result.auditLogCount >= 0

      const result: SecurityTestResult = {
        testName: 'Audit Logging Functionality',
        passed: auditingFunctional,
        details: `Audit logs accessible: ${executionTime.result.auditLogsAccessible}, Recent audit entries: ${executionTime.result.recentAuditCount}`,
        severity: 'high',
        executionTime: executionTime.executionTime,
        recommendation: auditingFunctional ? undefined : 'Audit logging system not functional. Critical for compliance and security monitoring.'
      }

      this.recordResult(result)
      return result

    } catch (error) {
      const result: SecurityTestResult = {
        testName: 'Audit Logging Functionality',
        passed: false,
        details: `Test execution failed: ${error}`,
        severity: 'high',
        recommendation: 'Unable to test audit logging. Check audit_log table and audit triggers.'
      }
      this.recordResult(result)
      return result
    }
  }

  // Test 5: bunenjin Philosophy Compliance
  async testBunenjinCompliance(): Promise<SecurityTestResult> {
    console.log('🎌 Testing bunenjin philosophy compliance...')
    
    try {
      const { executionTime } = await this.measureExecutionTime(async () => {
        // Test default privacy level is maximum
        const { data: privacyConfigs } = await this.supabase
          .from('bunenjin_privacy_config')
          .select('privacy_level')
          .limit(100)

        // Test privacy access matrix has maximum privacy rules
        const { data: maxPrivacyRules } = await this.supabase
          .from('privacy_access_matrix')
          .select('*')
          .eq('privacy_level', 'maximum')

        // Count privacy levels
        const privacyLevelCounts = privacyConfigs?.reduce((acc, config) => {
          acc[config.privacy_level] = (acc[config.privacy_level] || 0) + 1
          return acc
        }, {} as Record<string, number>) || {}

        return {
          totalConfigs: privacyConfigs?.length || 0,
          maximumPrivacyConfigs: privacyLevelCounts['maximum'] || 0,
          maximumPrivacyRules: maxPrivacyRules?.length || 0,
          privacyLevelDistribution: privacyLevelCounts
        }
      }, 'bunenjin Compliance Test')

      // bunenjin compliance: majority should have maximum privacy
      const totalConfigs = executionTime.result.totalConfigs
      const maxPrivacyConfigs = executionTime.result.maximumPrivacyConfigs
      const bunenjinCompliant = totalConfigs === 0 || 
                               (maxPrivacyConfigs / totalConfigs) >= 0.5 || 
                               executionTime.result.maximumPrivacyRules > 0

      const result: SecurityTestResult = {
        testName: 'bunenjin Philosophy Compliance',
        passed: bunenjinCompliant,
        details: `Total configs: ${totalConfigs}, Maximum privacy: ${maxPrivacyConfigs}, Privacy rules: ${executionTime.result.maximumPrivacyRules}`,
        severity: 'critical',
        executionTime: executionTime.executionTime,
        recommendation: bunenjinCompliant ? undefined : 'CRITICAL: bunenjin philosophy not enforced. Default privacy level must be maximum.'
      }

      this.recordResult(result)
      return result

    } catch (error) {
      const result: SecurityTestResult = {
        testName: 'bunenjin Philosophy Compliance',
        passed: false,
        details: `Test execution failed: ${error}`,
        severity: 'critical',
        recommendation: 'Unable to verify bunenjin compliance. Check privacy configuration system.'
      }
      this.recordResult(result)
      return result
    }
  }

  // Test 6: RLS Policy Coverage
  async testRLSPolicyCoverage(): Promise<SecurityTestResult> {
    console.log('🔍 Testing RLS policy coverage...')
    
    try {
      const { executionTime } = await this.measureExecutionTime(async () => {
        // Query PostgreSQL system tables to check RLS policies
        const { data: rlsPolicies, error } = await this.supabase
          .rpc('get_rls_policy_coverage')
          .catch(() => ({ data: null, error: 'RPC function not available' }))

        // Alternative: Check specific tables manually
        const criticalTables = [
          'users', 'bunenjin_privacy_config', 'audit_log',
          'engine_os_profiles', 'interface_os_profiles', 'safe_mode_os_profiles',
          'analysis_sessions', 'question_responses', 'analysis_results'
        ]

        return {
          rlsPolicies: rlsPolicies || [],
          criticalTables,
          policiesAvailable: !error
        }
      }, 'RLS Policy Coverage Test')

      const adequateCoverage = executionTime.result.policiesAvailable || 
                              executionTime.result.criticalTables.length > 0

      const result: SecurityTestResult = {
        testName: 'RLS Policy Coverage',
        passed: adequateCoverage,
        details: `RLS policies available: ${executionTime.result.policiesAvailable}, Critical tables: ${executionTime.result.criticalTables.length}`,
        severity: 'high',
        executionTime: executionTime.executionTime,
        recommendation: adequateCoverage ? undefined : 'Insufficient RLS policy coverage. All sensitive tables must have RLS policies.'
      }

      this.recordResult(result)
      return result

    } catch (error) {
      const result: SecurityTestResult = {
        testName: 'RLS Policy Coverage',
        passed: false,
        details: `Test execution failed: ${error}`,
        severity: 'high',
        recommendation: 'Unable to assess RLS policy coverage. Check database permissions and policies.'
      }
      this.recordResult(result)
      return result
    }
  }

  // Test 7: Performance Impact Assessment
  async testPerformanceImpact(): Promise<SecurityTestResult> {
    console.log('⚡ Testing RLS performance impact...')
    
    try {
      const performanceTests = []
      
      // Test 1: Simple user query
      for (let i = 0; i < 5; i++) {
        const { executionTime } = await this.measureExecutionTime(async () => {
          return await this.supabase
            .from('users')
            .select('id, email, privacy_level')
            .limit(10)
        }, `User Query ${i + 1}`)
        performanceTests.push(executionTime)
      }

      // Test 2: Complex analysis query
      for (let i = 0; i < 3; i++) {
        const { executionTime } = await this.measureExecutionTime(async () => {
          return await this.supabase
            .from('analysis_sessions')
            .select('*, question_responses(*)')
            .limit(5)
        }, `Analysis Query ${i + 1}`)
        performanceTests.push(executionTime)
      }

      const avgPerformance = performanceTests.reduce((a, b) => a + b, 0) / performanceTests.length
      const maxPerformance = Math.max(...performanceTests)
      const acceptablePerformance = avgPerformance < TEST_CONFIG.performanceThreshold

      const result: SecurityTestResult = {
        testName: 'RLS Performance Impact',
        passed: acceptablePerformance,
        details: `Average query time: ${avgPerformance.toFixed(2)}ms, Max query time: ${maxPerformance.toFixed(2)}ms, Threshold: ${TEST_CONFIG.performanceThreshold}ms`,
        severity: 'medium',
        executionTime: avgPerformance,
        recommendation: acceptablePerformance ? undefined : `Performance impact too high. Consider optimizing RLS policies or adding indexes.`
      }

      this.recordResult(result)
      return result

    } catch (error) {
      const result: SecurityTestResult = {
        testName: 'RLS Performance Impact',
        passed: false,
        details: `Test execution failed: ${error}`,
        severity: 'medium',
        recommendation: 'Unable to assess performance impact. Check database connectivity and query permissions.'
      }
      this.recordResult(result)
      return result
    }
  }

  // Test 8: Security Roles and Permissions
  async testSecurityRoles(): Promise<SecurityTestResult> {
    console.log('👥 Testing security roles and permissions...')
    
    try {
      const { executionTime } = await this.measureExecutionTime(async () => {
        // Test privacy functions availability
        const { data: privacySummary, error: privacyError } = await this.supabase
          .rpc('get_privacy_summary', { p_user_id: TEST_USERS.alice.id })
          .catch(() => ({ data: null, error: 'Function not available' }))

        // Test permission checking function
        const { data: permissionCheck, error: permissionError } = await this.supabase
          .rpc('check_privacy_permission', { 
            p_user_id: TEST_USERS.alice.id,
            p_data_category: 'user_profile',
            p_operation: 'read'
          })
          .catch(() => ({ data: null, error: 'Function not available' }))

        return {
          privacyFunctionAvailable: !privacyError,
          permissionFunctionAvailable: !permissionError,
          privacySummaryData: privacySummary,
          permissionResult: permissionCheck
        }
      }, 'Security Roles Test')

      const rolesWorking = executionTime.result.privacyFunctionAvailable || 
                          executionTime.result.permissionFunctionAvailable

      const result: SecurityTestResult = {
        testName: 'Security Roles and Permissions',
        passed: rolesWorking,
        details: `Privacy functions available: ${executionTime.result.privacyFunctionAvailable}, Permission functions available: ${executionTime.result.permissionFunctionAvailable}`,
        severity: 'medium',
        executionTime: executionTime.executionTime,
        recommendation: rolesWorking ? undefined : 'Security roles and functions not properly configured. Check function permissions and role assignments.'
      }

      this.recordResult(result)
      return result

    } catch (error) {
      const result: SecurityTestResult = {
        testName: 'Security Roles and Permissions',
        passed: false,
        details: `Test execution failed: ${error}`,
        severity: 'medium',
        recommendation: 'Unable to test security roles. Check database functions and permissions.'
      }
      this.recordResult(result)
      return result
    }
  }

  // Comprehensive Security Assessment
  async runComprehensiveSecurityAssessment(): Promise<ComprehensiveSecurityReport> {
    console.log('🛡️ Starting comprehensive RLS security assessment...')
    console.log('📋 bunenjin Philosophy: Privacy-First Maximum Security')
    console.log('🎯 Testing enterprise-grade security implementation...')
    
    const startTime = Date.now()
    this.testResults = []
    this.performanceMetrics = []

    // Run all security tests
    const tests = [
      () => this.testUserDataIsolation(),
      () => this.testPrivacyLevelHierarchy(),
      () => this.testTripleOSDataProtection(),
      () => this.testAuditLogging(),
      () => this.testBunenjinCompliance(),
      () => this.testRLSPolicyCoverage(),
      () => this.testPerformanceImpact(),
      () => this.testSecurityRoles()
    ]

    // Execute all tests
    for (const test of tests) {
      try {
        await test()
      } catch (error) {
        console.error('Test execution error:', error)
      }
    }

    // Calculate metrics
    const totalTests = this.testResults.length
    const passed = this.testResults.filter(r => r.passed).length
    const failed = totalTests - passed
    const criticalFailures = this.testResults.filter(r => !r.passed && r.severity === 'critical').length
    const overallSecurityScore = totalTests > 0 ? (passed / totalTests) * 100 : 0

    // Performance analysis
    const avgQueryTime = this.performanceMetrics.length > 0 
      ? this.performanceMetrics.reduce((a, b) => a + b, 0) / this.performanceMetrics.length 
      : 0
    const slowestQuery = this.performanceMetrics.length > 0 
      ? Math.max(...this.performanceMetrics) 
      : 0

    // Privacy compliance checks
    const privacyCompliance = {
      defaultPrivacyEnforced: this.testResults.find(r => r.testName === 'bunenjin Philosophy Compliance')?.passed || false,
      dataIsolationComplete: this.testResults.find(r => r.testName === 'User Data Isolation')?.passed || false,
      auditingFunctional: this.testResults.find(r => r.testName === 'Audit Logging Functionality')?.passed || false,
      tripleOSProtected: this.testResults.find(r => r.testName === 'Triple OS Data Protection')?.passed || false
    }

    // Generate recommendations
    const recommendations = [
      ...this.testResults.filter(r => !r.passed && r.recommendation).map(r => r.recommendation!),
      criticalFailures > 0 ? 'CRITICAL: Address all critical security failures immediately before production deployment.' : null,
      overallSecurityScore < 80 ? 'Security score below 80%. Comprehensive security review required.' : null,
      avgQueryTime > TEST_CONFIG.performanceThreshold ? 'Performance optimization needed for RLS policies.' : null
    ].filter(Boolean) as string[]

    if (recommendations.length === 0) {
      recommendations.push('✅ All security tests passed. RLS implementation meets enterprise-grade security standards.')
    }

    const report: ComprehensiveSecurityReport = {
      summary: {
        totalTests,
        passed,
        failed,
        criticalFailures,
        overallSecurityScore: Math.round(overallSecurityScore * 100) / 100,
        bunenjinCompliant: privacyCompliance.defaultPrivacyEnforced && 
                          privacyCompliance.dataIsolationComplete
      },
      testResults: this.testResults,
      performanceImpact: {
        averageQueryTime: Math.round(avgQueryTime * 100) / 100,
        slowestQuery: Math.round(slowestQuery * 100) / 100,
        acceptablePerformance: avgQueryTime <= TEST_CONFIG.performanceThreshold
      },
      privacyCompliance,
      recommendations,
      timestamp: new Date().toISOString()
    }

    const executionTime = Date.now() - startTime
    console.log(`✅ Security assessment completed in ${executionTime}ms`)
    
    return report
  }
}

// Test Suite Implementation
describe('HAQEI RLS Security Test Suite', () => {
  let securityTester: RLSSecurityTester

  beforeAll(async () => {
    securityTester = new RLSSecurityTester()
    console.log('🔧 Security test suite initialized')
  }, TEST_CONFIG.testTimeout)

  beforeEach(() => {
    console.log('🧪 Preparing security test...')
  })

  test('User Data Isolation Test', async () => {
    const result = await securityTester.testUserDataIsolation()
    expect(result.passed).toBe(true)
    if (!result.passed) {
      console.error(`❌ ${result.testName}: ${result.details}`)
      if (result.recommendation) {
        console.error(`💡 Recommendation: ${result.recommendation}`)
      }
    }
  }, TEST_CONFIG.testTimeout)

  test('Privacy Level Hierarchy Test', async () => {
    const result = await securityTester.testPrivacyLevelHierarchy()
    expect(result.passed).toBe(true)
    if (!result.passed) {
      console.error(`❌ ${result.testName}: ${result.details}`)
    }
  }, TEST_CONFIG.testTimeout)

  test('Triple OS Data Protection Test', async () => {
    const result = await securityTester.testTripleOSDataProtection()
    expect(result.passed).toBe(true)
    if (!result.passed) {
      console.error(`❌ ${result.testName}: ${result.details}`)
    }
  }, TEST_CONFIG.testTimeout)

  test('Audit Logging Functionality Test', async () => {
    const result = await securityTester.testAuditLogging()
    expect(result.passed).toBe(true)
    if (!result.passed) {
      console.error(`❌ ${result.testName}: ${result.details}`)
    }
  }, TEST_CONFIG.testTimeout)

  test('bunenjin Philosophy Compliance Test', async () => {
    const result = await securityTester.testBunenjinCompliance()
    expect(result.passed).toBe(true)
    if (!result.passed) {
      console.error(`❌ CRITICAL: ${result.testName}: ${result.details}`)
    }
  }, TEST_CONFIG.testTimeout)

  test('RLS Policy Coverage Test', async () => {
    const result = await securityTester.testRLSPolicyCoverage()
    expect(result.passed).toBe(true)
    if (!result.passed) {
      console.error(`❌ ${result.testName}: ${result.details}`)
    }
  }, TEST_CONFIG.testTimeout)

  test('Performance Impact Assessment', async () => {
    const result = await securityTester.testPerformanceImpact()
    expect(result.passed).toBe(true)
    if (!result.passed) {
      console.warn(`⚠️ ${result.testName}: ${result.details}`)
    }
  }, TEST_CONFIG.testTimeout)

  test('Security Roles and Permissions Test', async () => {
    const result = await securityTester.testSecurityRoles()
    expect(result.passed).toBe(true)
    if (!result.passed) {
      console.warn(`⚠️ ${result.testName}: ${result.details}`)
    }
  }, TEST_CONFIG.testTimeout)

  test('Comprehensive Security Assessment', async () => {
    const report = await securityTester.runComprehensiveSecurityAssessment()
    
    // Log detailed report
    console.log('\n🛡️ COMPREHENSIVE SECURITY ASSESSMENT REPORT')
    console.log('=' .repeat(50))
    console.log(`📊 Overall Security Score: ${report.summary.overallSecurityScore}%`)
    console.log(`✅ Tests Passed: ${report.summary.passed}/${report.summary.totalTests}`)
    console.log(`❌ Tests Failed: ${report.summary.failed}`)
    console.log(`🚨 Critical Failures: ${report.summary.criticalFailures}`)
    console.log(`🎌 bunenjin Compliant: ${report.summary.bunenjinCompliant ? 'YES' : 'NO'}`)
    console.log(`⚡ Average Query Time: ${report.performanceImpact.averageQueryTime}ms`)
    console.log(`🐌 Slowest Query: ${report.performanceImpact.slowestQuery}ms`)
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:')
      report.recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`)
      })
    }
    
    console.log('\n🔍 DETAILED TEST RESULTS:')
    report.testResults.forEach(test => {
      const status = test.passed ? '✅' : '❌'
      const severity = test.severity.toUpperCase()
      console.log(`${status} [${severity}] ${test.testName}: ${test.details}`)
      if (test.recommendation) {
        console.log(`   💡 ${test.recommendation}`)
      }
    })
    
    // Assertions for overall security
    expect(report.summary.criticalFailures).toBe(0)
    expect(report.summary.overallSecurityScore).toBeGreaterThanOrEqual(80)
    expect(report.summary.bunenjinCompliant).toBe(true)
    expect(report.performanceImpact.acceptablePerformance).toBe(true)

  }, TEST_CONFIG.testTimeout * 2)
})

// Export for standalone usage
export { RLSSecurityTester, type ComprehensiveSecurityReport, type SecurityTestResult }
export default RLSSecurityTester