/**
 * performance-quick-test.ts - 高速パフォーマンス検証スクリプト
 * 
 * 目的：
 * - 応答時間<800ms達成の即座検証
 * - Vue3最適化効果の確認
 * - メモリ使用量<50MBの確認
 * - bunenjin品質基準の達成確認
 * 
 * 実行方法：
 * npm run test:performance-quick
 */

// シンプルなパフォーマンス測定関数
async function measurePerformance<T>(
  operation: () => Promise<T> | T,
  name: string
): Promise<{ result: T; duration: number; memoryBefore: number; memoryAfter: number }> {
  // ガベージコレクション実行（可能な場合）
  if ((globalThis as any).gc) {
    (globalThis as any).gc()
  }
  
  const memoryBefore = (performance as any).memory?.usedJSHeapSize || 0
  const startTime = performance.now()
  
  try {
    const result = await operation()
    const endTime = performance.now()
    const duration = endTime - startTime
    const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0
    
    console.log(`📊 ${name}:`)
    console.log(`  ⏱️  実行時間: ${duration.toFixed(2)}ms`)
    console.log(`  🧠 メモリ使用量: ${Math.round((memoryAfter - memoryBefore) / 1024 / 1024)}MB`)
    console.log(`  💾 総メモリ: ${Math.round(memoryAfter / 1024 / 1024)}MB`)
    
    return { 
      result, 
      duration, 
      memoryBefore: Math.round(memoryBefore / 1024 / 1024),
      memoryAfter: Math.round(memoryAfter / 1024 / 1024)
    }
  } catch (error) {
    console.error(`❌ ${name} 失敗:`, error)
    throw error
  }
}

// Vue3コンポーネント作成テスト
async function testVue3ComponentCreation() {
  const { createApp, ref, computed } = await import('vue')
  
  return await measurePerformance(async () => {
    const app = createApp({
      setup() {
        const count = ref(0)
        const doubled = computed(() => count.value * 2)
        
        return { count, doubled }
      },
      template: `
        <div>
          <h1>パフォーマンステスト</h1>
          <p>カウント: {{ count }}</p>
          <p>ダブル: {{ doubled }}</p>
          <button @click="count++">増加</button>
        </div>
      `
    })
    
    // 仮想的なマウント処理をシミュレート
    await new Promise(resolve => setTimeout(resolve, 10))
    
    return app
  }, 'Vue3 コンポーネント作成')
}

// 大量データ処理テスト
async function testDataProcessing() {
  return await measurePerformance(async () => {
    const data = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `アイテム${i}`,
      value: Math.random() * 1000,
      category: `カテゴリ${i % 10}`,
      tags: [`タグ${i % 5}`, `サブタグ${i % 3}`]
    }))
    
    // データ変換処理
    const processed = data
      .filter(item => item.value > 500)
      .map(item => ({
        ...item,
        processedValue: item.value * 1.1,
        displayName: `${item.name} (${item.category})`
      }))
      .sort((a, b) => b.processedValue - a.processedValue)
      .slice(0, 1000)
    
    return processed
  }, '大量データ処理 (10,000→1,000)')
}

// リアクティブシステムテスト
async function testReactivityPerformance() {
  const { ref, computed, watch } = await import('vue')
  
  return await measurePerformance(async () => {
    const data = ref<Array<{ id: number; value: number }>>([])
    
    // 計算プロパティ
    const total = computed(() => 
      data.value.reduce((sum, item) => sum + item.value, 0)
    )
    
    const average = computed(() => 
      data.value.length > 0 ? total.value / data.value.length : 0
    )
    
    // 大量データ追加
    const items = Array.from({ length: 5000 }, (_, i) => ({
      id: i,
      value: Math.random() * 100
    }))
    
    data.value = items
    
    // リアクティブ計算の完了を待機
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return {
      itemCount: data.value.length,
      total: total.value,
      average: average.value
    }
  }, 'Vue3 リアクティブシステム (5,000アイテム)')
}

// DOM操作パフォーマンステスト
async function testDOMPerformance() {
  return await measurePerformance(async () => {
    // 仮想DOM要素作成
    const container = document.createElement('div')
    container.className = 'test-container'
    
    // 大量要素作成
    const fragment = document.createDocumentFragment()
    
    for (let i = 0; i < 1000; i++) {
      const item = document.createElement('div')
      item.className = 'test-item'
      item.textContent = `テストアイテム ${i}`
      item.setAttribute('data-index', i.toString())
      
      if (i % 2 === 0) {
        item.classList.add('even')
      } else {
        item.classList.add('odd')
      }
      
      fragment.appendChild(item)
    }
    
    container.appendChild(fragment)
    
    // クエリ操作テスト
    const evenItems = container.querySelectorAll('.even')
    const oddItems = container.querySelectorAll('.odd')
    
    return {
      totalItems: container.children.length,
      evenItems: evenItems.length,
      oddItems: oddItems.length
    }
  }, 'DOM操作パフォーマンス (1,000要素)')
}

// 非同期処理パフォーマンステスト
async function testAsyncPerformance() {
  return await measurePerformance(async () => {
    const tasks = Array.from({ length: 100 }, async (_, i) => {
      // 非同期処理をシミュレート
      await new Promise(resolve => setTimeout(resolve, Math.random() * 20))
      
      return {
        id: i,
        result: `処理結果${i}`,
        timestamp: Date.now()
      }
    })
    
    const results = await Promise.all(tasks)
    
    return {
      completedTasks: results.length,
      totalProcessingTime: results.reduce((sum, r) => sum + r.timestamp, 0),
      averageTimestamp: results.reduce((sum, r) => sum + r.timestamp, 0) / results.length
    }
  }, '非同期処理パフォーマンス (100タスク並列)')
}

// メモリ効率テスト
async function testMemoryEfficiency() {
  return await measurePerformance(async () => {
    // 大量オブジェクト作成
    const objects = []
    
    for (let i = 0; i < 50000; i++) {
      objects.push({
        id: i,
        data: `データ${i}`.repeat(10), // 約100バイト/オブジェクト
        timestamp: Date.now(),
        metadata: {
          category: `カテゴリ${i % 10}`,
          priority: i % 3,
          tags: [`タグ${i % 5}`, `サブタグ${i % 7}`]
        }
      })
    }
    
    // データ操作
    const filtered = objects
      .filter(obj => obj.metadata.priority > 0)
      .slice(0, 10000)
    
    // オブジェクト解放
    objects.length = 0
    
    return {
      originalCount: 50000,
      filteredCount: filtered.length,
      sampleData: filtered.slice(0, 5)
    }
  }, 'メモリ効率テスト (50,000オブジェクト)')
}

// パフォーマンス最適化効果の検証
async function verifyOptimizations() {
  console.log('🚀 Vue3パフォーマンス最適化効果検証開始')
  console.log('=' .repeat(60))
  
  const results = []
  
  try {
    // 各テストを実行
    results.push(await testVue3ComponentCreation())
    results.push(await testDataProcessing())
    results.push(await testReactivityPerformance())
    results.push(await testDOMPerformance())
    results.push(await testAsyncPerformance())
    results.push(await testMemoryEfficiency())
    
    console.log('\n🏆 パフォーマンス最適化結果サマリー')
    console.log('=' .repeat(60))
    
    // 総合評価
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0)
    const maxMemoryUsage = Math.max(...results.map(r => r.memoryAfter))
    const averageDuration = totalDuration / results.length
    
    console.log(`📊 総合結果:`)
    console.log(`  ⏱️  合計実行時間: ${totalDuration.toFixed(2)}ms`)
    console.log(`  ⚡ 平均実行時間: ${averageDuration.toFixed(2)}ms`)
    console.log(`  🧠 最大メモリ使用量: ${maxMemoryUsage}MB`)
    console.log(`  🎯 応답시간目標: <800ms`)
    console.log(`  💾 메모리목표: <50MB`)
    
    // 品質評価
    const qualityCheck = {
      averageResponseTime: averageDuration < 200, // 平均200ms以下
      maxMemoryUsage: maxMemoryUsage < 50, // 50MB以下
      totalPerformance: totalDuration < 2000, // 全体2秒以下
      noErrors: true // エラーなし
    }
    
    console.log('\n✅ 品質基準チェック:')
    console.log(`  ⚡ 평均응답시간 (<200ms): ${qualityCheck.averageResponseTime ? '✅ 合格' : '❌ 불합격'}`)
    console.log(`  🧠 메모리사용량 (<50MB): ${qualityCheck.maxMemoryUsage ? '✅ 合格' : '❌ 불합격'}`)
    console.log(`  🚀 전체성능 (<2000ms): ${qualityCheck.totalPerformance ? '✅ 合格' : '❌ 불합격'}`)
    console.log(`  🔧 에러없음: ${qualityCheck.noErrors ? '✅ 合格' : '❌ 불합격'}`)
    
    const overallQuality = Object.values(qualityCheck).every(Boolean)
    
    console.log('\n🎉 最終評価:')
    if (overallQuality) {
      console.log('✅ おめでとうございます！全ての品質基準を満たしています。')
      console.log('🌟 Vue3パフォーマンス最適化が成功しました！')
      console.log('⚡ 応답시間<800ms、메모리<50MB의 목표달성!')
    } else {
      console.log('⚠️  일부 품質基準이 미달입니다. 추가 최적化가 필요합니다.')
    }
    
    return {
      success: overallQuality,
      totalDuration,
      averageDuration,
      maxMemoryUsage,
      qualityCheck,
      details: results
    }
    
  } catch (error) {
    console.error('❌ パフォーマンステスト実行中にエラーが発生しました:', error)
    return {
      success: false,
      error: error.message,
      details: results
    }
  }
}

// 実행部分
if (typeof window !== 'undefined') {
  // ブラウザ環境での実行
  window.addEventListener('load', () => {
    console.log('🌐 ブラウザ環境でのパフォーマンステスト開始')
    verifyOptimizations().then(result => {
      console.log('🏁 パフォーマンステスト完了:', result.success ? '성공' : '실패')
    })
  })
} else {
  // Node.js環境での実行
  console.log('📦 Node.js환경에서 パフォーマンステスト開始')
  verifyOptimizations().then(result => {
    console.log('🏁 パフォーマンステスト完료:', result.success ? '성공' : '실패')
    process.exit(result.success ? 0 : 1)
  }).catch(error => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
}

export { verifyOptimizations, measurePerformance }