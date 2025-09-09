import { chromium } from 'playwright';

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

    // Try to wait for results container (best-effort; page has multiple flows)
    const results = page.locator('#resultsContainer');
    try { await results.waitFor({ timeout: 8000, state: 'visible' }); } catch {}

    // Mount EightBranches using current analysis from page
    await page.evaluate(async () => {
      let hex = 1;
      let line = 1;
      // Try to use page-provided analysis first
      const res = window.integratedAnalysisResult;
      if (res && res.iching && res.iching.hexagram && res.iching.yao) {
        hex = Number(res.iching.hexagram.number) || hex;
        line = Number(res.iching.yao.position) || line;
      } else if (window.getIChingSimulator) {
        try {
          const sim = window.getIChingSimulator();
          const s = sim && sim.getCurrent?.();
          if (s && s.hexagram && s.hexagram.number && s.yao && s.yao.position) {
            hex = Number(s.hexagram.number) || hex;
            line = Number(s.yao.position) || line;
          }
        } catch {}
      }

      // Ensure container exists
      let container = document.getElementById('eight-branches-display');
      if (!container) {
        container = document.createElement('div');
        container.id = 'eight-branches-display';
        container.style.marginTop = '1rem';
        (document.getElementById('resultsContainer') || document.body).appendChild(container);
      }
      const disp = new window.EightBranchesDisplay();
      disp.initialize('eight-branches-display');
      const gen = new window.BranchGenerator();
      const branches = await gen.generateEightBranches(hex, line);
      disp.displayBranches(branches);
    });

    // Verify 8 cards rendered
    const branches = page.locator('#eight-branches-display');
    await branches.waitFor({ timeout: 20000, state: 'visible' });
    const grid = branches.locator(':scope > div');
    await grid.waitFor({ timeout: 20000, state: 'visible' });
    const cardsCount = await grid.locator(':scope > div').count();
    if (cardsCount !== 8) throw new Error(`Expected 8 branch cards, got ${cardsCount}`);

    console.log('✅ Smoke OK (8 branches rendered)');
  } finally {
    await ctx.close();
    await browser.close();
  }
}

main().catch((e) => {
  console.error('❌ Smoke failed:', e?.message || e);
  process.exit(1);
});
