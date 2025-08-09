import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should display the homepage', async ({ page }) => {
    await page.goto('/')
    
    // Check title
    await expect(page).toHaveTitle(/HAQEI Analyzer/)
    
    // Check main heading
    const heading = page.locator('h1.hero-title')
    await expect(heading).toBeVisible()
    await expect(heading).toHaveText('HAQEI Analyzer')
    
    // Check CTA buttons
    const ctaButtons = page.locator('.cta-buttons .btn')
    await expect(ctaButtons).toHaveCount(2)
  })

  test('should navigate to quick analyzer', async ({ page }) => {
    await page.goto('/')
    
    // Click the main CTA button
    await page.click('text=今すぐ診断を始める')
    
    // Should navigate to quick analyzer
    await expect(page).toHaveURL('/quick-analyzer')
  })

  test('should display feature cards', async ({ page }) => {
    await page.goto('/')
    
    const featureCards = page.locator('.feature-card')
    await expect(featureCards).toHaveCount(3)
    
    // Check feature titles
    await expect(featureCards.nth(0).locator('h3')).toHaveText('Triple OS分析')
    await expect(featureCards.nth(1).locator('h3')).toHaveText('易経64卦')
    await expect(featureCards.nth(2).locator('h3')).toHaveText('AI統合')
  })
})