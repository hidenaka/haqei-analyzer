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
    });
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Fill input and run
    const input = page.locator('#worryInput');
    await input.fill('将来の方向性について迷っています。次の一歩は？');
    await page.locator('#aiGuessBtn').click();

    // Wait for Now block
    await page.locator('#now-main-reason').waitFor({ state: 'visible', timeout: 30000 });

    // Wait for branches grid and ensure 8 direct children (cards)
    const grid = page.locator('#eight-branches-display [data-role="branches-grid"]');
    await grid.waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForFunction((sel) => {
      const el = document.querySelector(sel);
      return el && el.children && el.children.length >= 8;
    }, '#eight-branches-display [data-role="branches-grid"]', { timeout: 30000 });
    const cards = grid.locator(':scope > div');
    const count = await cards.count();
    if (count < 8) {
      const html = await page.locator('#eight-branches-display').innerHTML();
      console.log('DOM dump:\n', html.slice(0, 3000));
      throw new Error(`Expected >= 8 cards, got ${count}`);
    }
    // Save screenshot and print basic titles
    const fs = await import('node:fs');
    const path = await import('node:path');
    const artifactsDir = path.resolve(process.cwd(), 'artifacts');
    fs.mkdirSync(artifactsDir, { recursive: true });
    const screenshotPath = path.join(artifactsDir, 'eight-branches.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    const titles = [];
    for (let i = 0; i < count; i++) {
      const txt = await cards.nth(i).innerText();
      const m = txt.match(/分岐\d+｜[進変][^\n]*/);
      if (m) titles.push(m[0]);
    }
    console.log('✅ Eight branches rendered successfully. Count:', count);
    console.log('Screenshot:', screenshotPath);
    console.log('Titles:', titles.join(' | '));
  } finally {
    await ctx.close();
    await browser.close();
  }
}

main().catch(e => { console.error('❌ check failed:', e?.message || e); process.exit(1); });
