
const { test, expect } = require('@playwright/test');

test('Performance metrics', async ({ page }) => {
  await page.goto('http://localhost:8080');
  
  const metrics = await page.evaluate(() => {
    const perf = window.performance;
    const timing = perf.timing;
    
    return {
      loadTime: timing.loadEventEnd - timing.navigationStart,
      domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
      firstPaint: perf.getEntriesByType('paint')[0]?.startTime || 0,
      resources: perf.getEntriesByType('resource').length
    };
  });
  
  // 3秒以内にロード完了することを確認
  expect(metrics.loadTime).toBeLessThan(3000);
  
  return metrics;
});
