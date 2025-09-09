import { chromium } from 'playwright';
import { logSerena } from './serena-logger.mjs';
import fs from 'node:fs';
import path from 'node:path';

const PORT = process.env.PORT || 8789;
const BASE = `http://localhost:${PORT}`;

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  try {
    await page.goto(`${BASE}/future_simulator.html`, { waitUntil: 'domcontentloaded' });
    // Feature flag
    await page.addInitScript(() => {
      window.HAQEI_CONFIG = window.HAQEI_CONFIG || {};
      window.HAQEI_CONFIG.useEightBranches = true;
    });
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Interact
    await page.locator('#worryInput').fill('将来の方向性について迷っています。次の一歩は？');
    await page.locator('#aiGuessBtn').click();

    // Wait for native Now block and reason
    const nowBlock = page.locator('#current-status-block');
    await nowBlock.waitFor({ timeout: 30000, state: 'visible' });
    const nowReason = page.locator('#now-main-reason');
    await expect(nowReason).toBeVisible({ timeout: 30000 });
    await expect(nowReason).not.toHaveText('', { timeout: 30000 });

    // Verify native EightBranches rendered
    const branches = page.locator('#eight-branches-display');
    await branches.waitFor({ timeout: 30000, state: 'visible' });
    const grid = branches.locator(':scope > div');
    await grid.waitFor({ timeout: 30000, state: 'visible' });
    const cardsCount = await grid.locator(':scope > div').count();
    if (cardsCount !== 8) throw new Error(`Expected 8 branch cards, got ${cardsCount}`);

    // Screenshot artifacts
    const artifactsDir = path.resolve(process.cwd(), 'artifacts');
    fs.mkdirSync(artifactsDir, { recursive: true });
    const screenshotPath = path.join(artifactsDir, 'eight-branches.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });

    console.log('✅ Smoke OK (8 branches rendered)');
    console.log('Screenshot:', screenshotPath);
    // Serena log (success)
    try {
      await logSerena({
        task: 'eight-branches-smoke',
        status: 'success',
        details: { port: PORT, screenshot: 'artifacts/eight-branches.png' }
      });
    } catch {}
  } catch (e) {
    try {
      await logSerena({ task: 'eight-branches-smoke', status: 'failure', details: { error: e?.message || String(e) } });
    } catch {}
    throw e;
  } finally {
    await ctx.close();
    await browser.close();
  }
}

main().catch((e) => {
  console.error('❌ Smoke failed:', e?.message || e);
  process.exit(1);
});
