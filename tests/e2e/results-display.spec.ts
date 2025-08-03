// E2E test for Results Display functionality
// This test should be run with Playwright separately from unit tests

const { test, expect } = require('@playwright/test')

/**
 * Results Display E2E Tests
 * 
 * 目的：
 * - 結果表示ページの完全なユーザーフローテスト
 * - Triple OS分析結果の表示確認
 * - レスポンシブデザインの動作確認
 * 
 * テスト範囲：
 * 1. 分析結果の表示
 * 2. チャート・グラフの表示
 * 3. PDF エクスポート機能
 * 4. レスポンシブ対応
 * 5. エラーハンドリング
 */

test.describe('Results Display', () => {
  test.beforeEach(async ({ page }) => {
    // テスト用の分析データをセットアップ
    await page.goto('/results')
    
    // LocalStorageにテストデータを設定
    await page.evaluate(() => {
      const mockAnalysisResult = {
        timestamp: new Date().toISOString(),
        dimensionScores: new Map([
          ['創造性', 75],
          ['論理性', 68],
          ['感情性', 82],
          ['社会性', 71],
          ['実用性', 79],
          ['独立性', 73],
          ['協調性', 77],
          ['安定性', 69]
        ]),
        totalScore: 594,
        averageScore: 74.25
      }
      
      const mockTripleOSResult = {
        engineOS: {
          hexagramId: 1,
          hexagramName: '乾為天',
          matchScore: 0.85,
          trigramEnergies: { upper: '乾', lower: '乾' }
        },
        interfaceOS: {
          hexagramId: 2,
          hexagramName: '坤為地',
          matchScore: 0.78,
          trigramEnergies: { upper: '坤', lower: '坤' }
        },
        safeModeOS: {
          hexagramId: 3,
          hexagramName: '水雷屯',
          matchScore: 0.72,
          trigramEnergies: { upper: '坎', lower: '震' }
        },
        consistencyScore: 0.78,
        misalignmentData: {
          hasSignificantMisalignment: false,
          misalignmentPercentage: 15
        }
      }
      
      localStorage.setItem('haqei_analysis_result', JSON.stringify(mockAnalysisResult))
      localStorage.setItem('haqei_triple_os_result', JSON.stringify(mockTripleOSResult))
    })
    
    await page.reload()
  })

  test('should display analysis results correctly', async ({ page }) => {
    // ページタイトルの確認
    await expect(page.locator('h1')).toContainText('HaQei 分析結果')
    
    // タイムスタンプの表示確認
    await expect(page.locator('.timestamp')).toBeVisible()
    
    // Triple OS セクションの表示確認
    await expect(page.locator('.triple-os-section')).toBeVisible()
    await expect(page.locator('.triple-os-section h2')).toContainText('Triple OS 分析結果')
    
    // 主要卦セクションの表示確認
    await expect(page.locator('.hexagram-section')).toBeVisible()
    await expect(page.locator('.hexagram-section h2')).toContainText('あなたの主要卦')
    
    // レーダーチャートセクションの表示確認
    await expect(page.locator('.radar-section')).toBeVisible()
    await expect(page.locator('.radar-section h2')).toContainText('8次元パーソナリティマップ')
  })

  test('should display charts and visualizations', async ({ page }) => {
    // Chart.js キャンバス要素の確認
    await expect(page.locator('canvas')).toHaveCount(3, { timeout: 5000 })
    
    // レーダーチャートの表示確認
    const radarChart = page.locator('.radar-section canvas')
    await expect(radarChart).toBeVisible()
    
    // バーチャートの表示確認
    const barChart = page.locator('.chart-section canvas')
    await expect(barChart).toBeVisible()
    
    // ドーナツチャートの表示確認
    const doughnutChart = page.locator('.os-distribution-section canvas')
    await expect(doughnutChart).toBeVisible()
  })

  test('should handle PDF export functionality', async ({ page }) => {
    // PDFダウンロードボタンの確認
    const pdfButton = page.locator('button', { hasText: 'PDFダウンロード' })
    await expect(pdfButton).toBeVisible()
    
    // PDFエクスポート機能のクリック（実際のダウンロードはテストしない）
    await pdfButton.click()
    
    // エラーが発生しないことを確認
    await expect(page.locator('.error-message')).not.toBeVisible()
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    // モバイルビューポートに変更
    await page.setViewportSize({ width: 375, height: 667 })
    
    // ヘッダーのレスポンシブ確認
    const header = page.locator('.results-header')
    await expect(header).toHaveCSS('flex-direction', 'column')
    
    // アクションボタンのスタック確認
    const headerActions = page.locator('.header-actions')
    await expect(headerActions).toHaveCSS('flex-direction', 'column')
    
    // フッターボタンの縦配置確認
    const footer = page.locator('.results-footer')
    await expect(footer).toHaveCSS('flex-direction', 'column')
    
    // セクションの余白調整確認
    const sections = page.locator('section')
    const firstSection = sections.first()
    await expect(firstSection).toHaveCSS('padding', '24px') // 1.5rem = 24px
  })

  test('should handle missing data gracefully', async ({ page }) => {
    // LocalStorageをクリア
    await page.evaluate(() => {
      localStorage.removeItem('haqei_analysis_result')
      localStorage.removeItem('haqei_triple_os_result')
    })
    
    await page.reload()
    
    // 分析ページにリダイレクトされることを確認
    await expect(page).toHaveURL('/analysis')
  })

  test('should handle dimension and OS clicks', async ({ page }) => {
    // 次元クリックのテスト（実装されている場合）
    const dimensionElements = page.locator('[data-testid="dimension-item"]')
    if (await dimensionElements.count() > 0) {
      await dimensionElements.first().click()
      // 詳細表示または何らかのアクションが実行されることを確認
    }
    
    // OS クリックのテスト（実装されている場合）
    const osElements = page.locator('[data-testid="os-item"]')
    if (await osElements.count() > 0) {
      await osElements.first().click()
      // 詳細表示または何らかのアクションが実行されることを確認
    }
  })

  test('should navigate correctly from action buttons', async ({ page }) => {
    // 新しい分析を開始ボタン
    const newAnalysisButton = page.locator('button', { hasText: '新しい分析を開始' })
    await expect(newAnalysisButton).toBeVisible()
    await newAnalysisButton.click()
    
    // 質問ページにリダイレクトされることを確認
    await expect(page).toHaveURL('/questions')
  })

  test('should maintain accessibility standards', async ({ page }) => {
    // ページのアクセシビリティ確認
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('h2')).toHaveCount(6) // 各セクションのタイトル
    
    // ボタンのアクセシビリティ確認
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i)
      await expect(button).toBeVisible()
      
      // ボタンがタブナビゲーション可能であることを確認
      await expect(button).toBeFocusable()
    }
  })

  test('should handle share functionality', async ({ page }) => {
    // シェアボタンの確認
    const shareButton = page.locator('button', { hasText: 'シェア' })
    await expect(shareButton).toBeVisible()
    
    // シェア機能のクリック（TODO実装）
    await shareButton.click()
    
    // エラーが発生しないことを確認
    await expect(page.locator('.error-message')).not.toBeVisible()
  })
})

test.describe('Results Display - Performance', () => {
  test('should load results page quickly', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/results')
    
    // 主要要素の表示確認
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('.triple-os-section')).toBeVisible()
    
    const loadTime = Date.now() - startTime
    
    // 3秒以内にロードされることを確認
    expect(loadTime).toBeLessThan(3000)
  })
  
  test('should handle large datasets efficiently', async ({ page }) => {
    // 大量のテストデータを設定
    await page.evaluate(() => {
      const largeMockData = {
        timestamp: new Date().toISOString(),
        dimensionScores: new Map([
          ['創造性', 75], ['論理性', 68], ['感情性', 82], ['社会性', 71],
          ['実用性', 79], ['独立性', 73], ['協調性', 77], ['安定性', 69],
          ['洞察力', 84], ['表現力', 76], ['組織力', 72], ['集中力', 80]
        ]),
        totalScore: 906,
        averageScore: 75.5
      }
      
      localStorage.setItem('haqei_analysis_result', JSON.stringify(largeMockData))
    })
    
    await page.goto('/results')
    
    // チャートが正常に描画されることを確認
    await expect(page.locator('canvas')).toHaveCount(3, { timeout: 10000 })
    
    // ページがフリーズしていないことを確認
    await expect(page.locator('h1')).toBeVisible()
  })
})