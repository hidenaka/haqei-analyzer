import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:8899';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  try {
    console.log(`🔎 Navigate to ${BASE}/future_simulator.html`);
    await page.goto(`${BASE}/future_simulator.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('✅ future_simulator.html loaded');

    // Open the served plain database as a document and verify text presence
    console.log(`🔎 Open ${BASE}/assets/H384H64database.plain.js`);
    await page.goto(`${BASE}/assets/H384H64database.plain.js`, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const text = await page.evaluate(() => document.body ? document.body.innerText || '' : '');
    const ok385 = text.includes('形より誠。簡素でも、真が通れば吉。');
    const ok386 = text.includes('最後ほど慎重に。急げば頭まで濡れる。');
    console.log(`385 present: ${ok385}`);
    console.log(`386 present: ${ok386}`);

    if (!ok385 || !ok386) {
      throw new Error('Required text not found in served H384H64database.plain.js');
    }

    // Save a screenshot of the asset view as evidence
    await page.screenshot({ path: 'artifacts/plain-385-386-check.png', fullPage: true }).catch(()=>{});
    console.log('📸 Saved artifacts/plain-385-386-check.png');

    return 0;
  } catch (e) {
    console.error('❌ Verification failed:', e?.message || e);
    return 1;
  } finally {
    await ctx.close();
    await browser.close();
  }
}

const code = await run();
process.exit(code);
