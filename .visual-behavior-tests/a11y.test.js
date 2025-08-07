
const { test, expect } = require('@playwright/test');
const { injectAxe, checkA11y } = require('axe-playwright');

test('Accessibility compliance', async ({ page }) => {
  await page.goto('http://localhost:8080');
  await injectAxe(page);
  
  const violations = await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: {
      html: true
    }
  });
  
  return { violations: violations || [] };
});
