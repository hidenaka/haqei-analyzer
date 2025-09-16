import { chromium } from 'playwright';

const PORT = process.env.PORT || 8789;
const BASE = `http://localhost:${PORT}`;

async function main(){
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  try {
    await page.goto(`${BASE}/future_simulator.html`, { waitUntil: 'domcontentloaded' });
    await page.addInitScript(() => {
      window.HAQEI_CONFIG = window.HAQEI_CONFIG || {};
      window.HAQEI_CONFIG.featureFlags = window.HAQEI_CONFIG.featureFlags || {};
      window.HAQEI_CONFIG.featureFlags.layoutClassic = false;
      window.HAQEI_CONFIG.featureFlags.evidencePanel = true;
    });
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Run analysis
    await page.locator('#worryInput').fill('根拠トグル検証');
    await page.locator('#aiGuessBtn').click();

    // Ensure Now is populated first
    await page.locator('#now-main-reason').waitFor({ state: 'visible', timeout: 30000 });

    // Wait for branches grid
    const grid = page.locator('#eight-branches-display [data-role="branches-grid"]');
    await grid.waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForFunction((sel) => {
      const el = document.querySelector(sel); return el && el.children && el.children.length >= 8;
    }, '#eight-branches-display [data-role="branches-grid"]', { timeout: 30000 });

    // Count open details before toggle
    const beforeOpen = await page.locator('#eight-branches-display details[open]').count();

    // Click 根拠 button
    const evBtn = page.locator('#display-mode-bar button', { hasText: '根拠' });
    await evBtn.click();

    // Wait for re-render and evidence to open
    await page.waitForTimeout(200); // brief
    const afterOpen = await page.locator('#eight-branches-display details[open]').count();
    const evidenceLabels = await page.locator('#eight-branches-display summary', { hasText: /根拠（引用と適用）|理由（引用と使い方）/ }).count();

    console.log('beforeOpen:', beforeOpen, 'afterOpen:', afterOpen, 'evidenceLabels:', evidenceLabels);
    if (afterOpen <= beforeOpen || evidenceLabels === 0) {
      const dump = await page.locator('#eight-branches-display').innerHTML();
      console.log('DOM dump (partial):\n', dump.slice(0, 2000));
      throw new Error('Evidence toggle did not expand details or evidence labels not found');
    }

    console.log('✅ Evidence toggle works (details opened).');
  } finally {
    await ctx.close();
    await browser.close();
  }
}

main().catch(e => { console.error('❌ evidence toggle check failed:', e?.message || e); process.exit(1); });
