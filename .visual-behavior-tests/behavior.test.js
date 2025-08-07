
const { test, expect } = require('@playwright/test');

test('Interactive behavior test', async ({ page }) => {
  await page.goto('http://localhost:8080');
  
  // ボタンクリックテスト
  const buttons = await page.$$('button');
  const results = [];
  
  for (const button of buttons) {
    const text = await button.textContent();
    const isClickable = await button.isEnabled();
    results.push({ text, clickable: isClickable });
  }
  
  // フォーム入力テスト
  const inputs = await page.$$('input');
  for (const input of inputs) {
    const type = await input.getAttribute('type');
    if (type === 'text' || type === 'email') {
      await input.fill('test@example.com');
      const value = await input.inputValue();
      results.push({ type, filled: value === 'test@example.com' });
    }
  }
  
  // ナビゲーションテスト
  const links = await page.$$('a[href]');
  const linkCount = links.length;
  
  return { 
    buttons: results,
    inputsCount: inputs.length,
    linksCount: linkCount
  };
});
