import { test, expect } from '@playwright/test'

test('Low reading level copy appears when flag is ON', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).HAQEI_CONFIG = (window as any).HAQEI_CONFIG || {};
    (window as any).HAQEI_CONFIG.featureFlags = Object.assign(
      { lowReadingLevel: true },
      (window as any).HAQEI_CONFIG.featureFlags || {}
    );
  });
  await page.goto('/future_simulator.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#heroTitle')).toHaveText('未来の選択を、かんたんに');
  await expect(page.locator('#heroSubtitle')).toHaveText('あなたの言葉から道を見つけます');
  await expect(page.locator('#guideHeading')).toContainText('やさしく書いて');
  await expect(page.locator('#buttonText')).toHaveText('分析を始める');
  // toggles: 理由/ヒント 表示
  await page.locator('#viewToggles').evaluate(n => (n as HTMLElement).style.display = 'flex');
  await expect(page.locator('#viewToggles')).toContainText('理由');
  await expect(page.locator('#viewToggles')).toContainText('ヒント');
});

