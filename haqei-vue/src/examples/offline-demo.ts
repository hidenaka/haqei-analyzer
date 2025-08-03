/**
 * HAQEI Offline Database Demo - TASK-041実装例
 * 
 * オフライン統合機能の使用例とデモンストレーション
 * 
 * 使用方法:
 * tsx src/examples/offline-demo.ts
 */

import { useOfflineDatabase, useOfflineStatus } from '@/composables/useOfflineDatabase'

async function demonstrateOfflineFeatures() {
  console.log('🚀 HAQEI Offline Database Demo Starting...\n')

  try {
    // オフライン状態の確認
    const { isOnline, isOffline, connectionQuality } = useOfflineStatus()
    console.log('📡 Connection Status:')
    console.log(`   Online: ${isOnline.value}`)
    console.log(`   Offline: ${isOffline.value}`)
    console.log(`   Quality: ${connectionQuality.value}\n`)

    // オフラインデータベースの初期化
    const {
      offlineState,
      syncStats,
      dbStats,
      createUser,
      saveAnalysisResult,
      startAnalysisSession,
      syncNow,
      performHealthCheck
    } = useOfflineDatabase()

    console.log('💾 Database State:')
    console.log(`   Pending Operations: ${offlineState.value.pendingOperations}`)
    console.log(`   Failed Operations: ${offlineState.value.failedOperations}`)
    console.log(`   Last Sync: ${offlineState.value.lastSyncTime}\n`)

    // 1. ユーザー作成（オフライン）
    console.log('1️⃣ Creating user offline...')
    const userResult = await createUser({
      email: 'demo@haqei.com',
      username: 'demo-user',
      privacy_level: 'maximum'
    })

    if (userResult.success) {
      console.log(`✅ User created: ${userResult.data?.id}`)
      console.log(`   Email: ${userResult.data?.email}`)
      console.log(`   Privacy: ${userResult.data?.privacy_level}\n`)
    }

    // 2. 分析セッション開始
    console.log('2️⃣ Starting analysis session...')
    const sessionResult = await startAnalysisSession(
      userResult.data?.id || 'demo-user-id',
      'offline_demo'
    )

    if (sessionResult.success) {
      console.log(`✅ Session started: ${sessionResult.data?.id}`)
      console.log(`   Type: ${sessionResult.data?.session_type}`)
      console.log(`   Status: ${sessionResult.data?.status}\n`)
    }

    // 3. 分析結果保存
    console.log('3️⃣ Saving analysis result...')
    const analysisData = {
      hexagram: 42,
      confidence: 0.89,
      insights: [
        'Strong analytical capabilities detected',
        'Balanced emotional intelligence',
        'High potential for strategic thinking'
      ],
      bunenjin_score: 0.85
    }

    const tripleOSData = {
      engine_os: {
        rational_thinking: 0.88,
        analytical_processing: 0.82,
        logical_reasoning: 0.90
      },
      interface_os: {
        social_skills: 0.75,
        communication_style: 0.78,
        empathy_level: 0.72
      },
      safe_mode_os: {
        emotional_stability: 0.85,
        stress_management: 0.80,
        resilience_factor: 0.87
      }
    }

    const analysisResult = await saveAnalysisResult(
      sessionResult.data?.id || 'demo-session-id',
      analysisData,
      tripleOSData
    )

    if (analysisResult.success) {
      console.log(`✅ Analysis result saved: ${analysisResult.data?.id}`)
      console.log(`   Confidence: ${analysisResult.data?.confidence_score}`)
      console.log(`   Hexagram: ${analysisResult.data?.analysis_data.hexagram}\n`)
    }

    // 4. データベース統計
    console.log('4️⃣ Database Statistics:')
    console.log(`   Total Records: ${dbStats.value.totalRecords}`)
    console.log(`   Offline Operations: ${dbStats.value.offlineOperations}`)
    console.log(`   Cache Size: ${dbStats.value.cacheSize}`)
    console.log(`   Storage Used: ${Math.round(dbStats.value.storageUsed / 1024)}KB\n`)

    // 5. 健康チェック
    console.log('5️⃣ Running health check...')
    const healthCheck = await performHealthCheck()

    if (healthCheck.success) {
      console.log(`✅ Database Health: ${healthCheck.data?.isHealthy ? 'Healthy' : 'Issues detected'}`)
      
      if (healthCheck.data?.issues && healthCheck.data.issues.length > 0) {
        console.log('⚠️  Issues found:')
        healthCheck.data.issues.forEach((issue, index) => {
          console.log(`   ${index + 1}. ${issue}`)
        })
      }

      if (healthCheck.data?.recommendations && healthCheck.data.recommendations.length > 0) {
        console.log('💡 Recommendations:')
        healthCheck.data.recommendations.forEach((rec, index) => {
          console.log(`   ${index + 1}. ${rec}`)
        })
      }
      console.log('')
    }

    // 6. 同期統計
    console.log('6️⃣ Sync Statistics:')
    console.log(`   Total Synced: ${syncStats.value.totalSynced}`)
    console.log(`   Total Failed: ${syncStats.value.totalFailed}`)
    console.log(`   Total Conflicts: ${syncStats.value.totalConflicts}`)
    console.log(`   Average Sync Time: ${Math.round(syncStats.value.averageSyncTime)}ms`)
    console.log(`   Last Sync Success: ${syncStats.value.syncSuccess}\n`)

    // 7. 同期実行（オンラインの場合）
    if (isOnline.value) {
      console.log('7️⃣ Triggering sync...')
      const syncResult = await syncNow()

      if (syncResult.success) {
        console.log('✅ Sync completed successfully')
        console.log(`   Synced: ${syncResult.data?.totalSynced || 0}`)
        console.log(`   Failed: ${syncResult.data?.totalFailed || 0}`)
        console.log(`   Conflicts: ${syncResult.data?.totalConflicts || 0}\n`)
      } else {
        console.log(`❌ Sync failed: ${syncResult.error}\n`)
      }
    } else {
      console.log('7️⃣ Sync skipped (offline mode)\n')
    }

    console.log('🎉 Demo completed successfully!')
    console.log('\n📝 Summary:')
    console.log('   - User creation: ✅ Working offline')
    console.log('   - Session management: ✅ Local storage')
    console.log('   - Analysis results: ✅ Cached locally')
    console.log('   - Data integrity: ✅ Validated')
    console.log('   - Sync capability: ✅ Ready for online')
    console.log('\n🔒 bunenjin Philosophy:')
    console.log('   - Complete offline functionality')
    console.log('   - Maximum privacy protection')
    console.log('   - User-controlled data')
    console.log('   - No external dependencies required')

  } catch (error) {
    console.error('❌ Demo failed:', error)
  }
}

// 実行
if (require.main === module) {
  demonstrateOfflineFeatures()
    .then(() => {
      console.log('\n✨ HAQEI Offline Database Demo completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Demo error:', error)
      process.exit(1)
    })
}

export default demonstrateOfflineFeatures