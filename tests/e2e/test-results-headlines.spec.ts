import { test, expect } from '@playwright/test'

test.describe('Results Headlines and Taglines', () => {
  const resultsPath = `file://${process.cwd()}/public/results.html`

  test('renders 4-line summary header', async ({ page }) => {
    await page.goto(resultsPath)
    await page.waitForTimeout(2000)
    await expect(page.locator('[data-testid="summary-line-1"]')).toBeVisible()
    await expect(page.locator('[data-testid="summary-line-2"]')).toBeVisible()
    await expect(page.locator('[data-testid="summary-line-3"]')).toBeVisible()
    await expect(page.locator('[data-testid="summary-line-4"]')).toBeVisible()
  })

  test('renders taglines and action/caution lists', async ({ page }) => {
    await page.goto(resultsPath)
    await page.waitForTimeout(2500)

    // Taglines
    await expect(page.locator('[data-testid="engine-tagline"]')).toBeVisible()
    await expect(page.locator('[data-testid="interface-tagline"]')).toBeVisible()
    await expect(page.locator('[data-testid="safemode-tagline"]')).toBeVisible()

    // Actions/Cautions have at least placeholder li
    await expect(page.locator('[data-testid="engine-action-list"] li').first()).toBeVisible()
    await expect(page.locator('[data-testid="engine-caution-list"] li').first()).toBeVisible()
    await expect(page.locator('[data-testid="interface-action-list"] li').first()).toBeVisible()
    await expect(page.locator('[data-testid="interface-caution-list"] li').first()).toBeVisible()
    await expect(page.locator('[data-testid="safemode-action-list"] li').first()).toBeVisible()
    await expect(page.locator('[data-testid="safemode-caution-list"] li').first()).toBeVisible()
  })
})

