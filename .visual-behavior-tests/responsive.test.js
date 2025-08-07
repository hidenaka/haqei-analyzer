
const { test, expect } = require('@playwright/test');


test('Responsive: Desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:8080');
  
  // レイアウト崩れチェック
  const overflowing = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const overflows = [];
    elements.forEach(el => {
      if (el.scrollWidth > el.clientWidth) {
        overflows.push(el.tagName);
      }
    });
    return overflows;
  });
  
  await page.screenshot({ 
    path: '/Users/nakanohideaki/Desktop/haqei-analyzer/.visual-behavior-tests/results/responsive-desktop.png',
    fullPage: true 
  });
  
  return { viewport: 'Desktop', overflowing };
});


test('Responsive: Tablet', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('http://localhost:8080');
  
  // レイアウト崩れチェック
  const overflowing = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const overflows = [];
    elements.forEach(el => {
      if (el.scrollWidth > el.clientWidth) {
        overflows.push(el.tagName);
      }
    });
    return overflows;
  });
  
  await page.screenshot({ 
    path: '/Users/nakanohideaki/Desktop/haqei-analyzer/.visual-behavior-tests/results/responsive-tablet.png',
    fullPage: true 
  });
  
  return { viewport: 'Tablet', overflowing };
});


test('Responsive: Mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:8080');
  
  // レイアウト崩れチェック
  const overflowing = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const overflows = [];
    elements.forEach(el => {
      if (el.scrollWidth > el.clientWidth) {
        overflows.push(el.tagName);
      }
    });
    return overflows;
  });
  
  await page.screenshot({ 
    path: '/Users/nakanohideaki/Desktop/haqei-analyzer/.visual-behavior-tests/results/responsive-mobile.png',
    fullPage: true 
  });
  
  return { viewport: 'Mobile', overflowing };
});

