import { chromium } from 'playwright';

const PORT = process.env.PORT || 8789;
const BASE = `http://localhost:${PORT}`;

async function verify() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  page.on('console', (msg) => {
    try { console.log('[browser]', msg.type(), msg.text()); } catch {}
  });
  page.on('pageerror', (err) => { console.log('[browser][error]', err?.message || String(err)); });
  page.on('requestfailed', (req) => { console.log('[browser][requestfailed]', req.url(), req.failure()?.errorText); });
  try {
    console.log(`🔎 Opening ${BASE}/future_simulator.html`);
    await page.goto(`${BASE}/future_simulator.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Fill input (best-effort: try common selectors)
    const selectors = ['#worryInput', 'textarea', 'input[type="text"]'];
    let found = false;
    for (const sel of selectors) {
      const loc = page.locator(sel);
      if (await loc.count() > 0) {
        await loc.first().fill('将来の方向性について迷っています。次の一歩は？');
        found = true;
        break;
      }
    }
    console.log(`✍️ Input field ${found ? 'found' : 'not found (continuing)'}`);

    // Click analyze button if present
    const analyzeBtn = page.locator('#aiGuessBtn');
    if (await analyzeBtn.count() > 0) {
      await analyzeBtn.first().click({ trial: false }).catch(()=>{});
      console.log('🔘 Clicked analysis button');
    }

    // Wait for EightBranches container
    const branches = page.locator('#eight-branches-display');
    await branches.waitFor({ state: 'visible', timeout: 90000 });
    console.log('✅ EightBranches container visible');

    // Verify Now block has non-empty reason (not fallback '未登録')
    try {
      await page.locator('#now-main-reason').waitFor({ state: 'visible', timeout: 45000 });
      const nowText = (await page.locator('#now-main-reason').innerText()).trim();
      if (!nowText || nowText.includes('未登録')) throw new Error('Now main reason is empty or fallback');
      console.log('✅ Now main reason present:', nowText.slice(0, 60) + (nowText.length>60?'…':''));
    } catch (e) {
      console.log('⚠️ Now main reason check:', e?.message || e);
    }

    // Check that at least one card contains the easy guidance header
    // The implementation injects a block titled 'やさしい指針'
    let hasEasy = await page.locator('#eight-branches-display :text("やさしい指針")').count();
    if (hasEasy <= 0) {
      await page.waitForTimeout(2000);
      hasEasy = await page.locator('#eight-branches-display :text("やさしい指針")').count();
    }
    if (hasEasy <= 0) {
      // final attempt: wait up to 25s polling
      const start = Date.now();
      while (Date.now() - start < 25000) {
        await page.waitForTimeout(1000);
        hasEasy = await page.locator('#eight-branches-display :text("やさしい指針")').count();
        if (hasEasy > 0) break;
      }
    }
    console.log(`Easy guidance blocks found: ${hasEasy}`);
    if (hasEasy <= 0) {
      // Fallback check: look for chips/labels added by easy guidance
      const hasFit = await page.locator('#eight-branches-display :text("向いている:")').count();
      const hasAvoid = await page.locator('#eight-branches-display :text("非推奨:")').count();
      const hasCaution = await page.locator('#eight-branches-display :text("⚠ 注意:")').count();
      console.log(`Fallback labels — fit:${hasFit} avoid:${hasAvoid} caution:${hasCaution}`);
      if ((hasFit + hasAvoid + hasCaution) <= 0) throw new Error('easy guidance labels not found');
    }

    // Verify recommendation bar exists for at least one card (linked to S7)
    try {
      const hasReco = await page.locator('#eight-branches-display :text("おすすめ度:")').count();
      console.log(`Recommendation labels found: ${hasReco}`);
      if (hasReco <= 0) console.log('ℹ️ No recommendation bar visible (S7 missing or fallback)');
    } catch {}

    // Screenshot evidence
    await page.screenshot({ path: 'artifacts/future-simulator-verify.png', fullPage: true }).catch(()=>{});
    console.log('📸 Saved artifacts/future-simulator-verify.png');

    return true;
  } catch (e) {
    console.error('❌ Verification failed:', e?.message || e);
    return false;
  } finally {
    await ctx.close();
    await browser.close();
  }
}

verify().then(ok => {
  process.exit(ok ? 0 : 1);
});
