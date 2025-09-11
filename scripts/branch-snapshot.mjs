import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.HAQEI_CONFIG = window.HAQEI_CONFIG || {};
    window.HAQEI_CONFIG.featureFlags = Object.assign({ layoutClassic: false, enableTop3Mode: false }, window.HAQEI_CONFIG.featureFlags || {});
    try { localStorage.setItem('haqei_view_prefs', JSON.stringify({ summary:true, compare:true, evidence:true, learn:true })); } catch {}
  });
  await page.goto('http://localhost:5173/future_simulator.html', { waitUntil: 'domcontentloaded' });
  await page.fill('#worryInput', '新しい仕事、マジで人足りてない！Aさんは頑張ってくれてるけど、Bさんは全然やる気ないし…。このままだと絶対間に合わない。どうすりゃいいんだ…。焦る。');
  await page.click('#aiGuessBtn');
  const root = page.locator('#eight-branches-display');
  await root.waitFor({ state: 'visible', timeout: 20000 });
  const grid = root.locator('[data-role="branches-grid"]').first();
  await grid.waitFor({ state: 'visible', timeout: 20000 });
  const count = await grid.locator(':scope > *').count();
  const max = Math.min(count, 3);
  const reports = [];
  for (let i=0; i<max; i++) {
    const card = grid.locator(':scope > *').nth(i);
    const getText = async (label) => {
      const el = card.locator(`text=${label}`);
      if (await el.count()) {
        const text = await el.first().innerText();
        return text.trim();
      }
      return '';
    };
    const title = await card.locator('div').first().innerText();
    const full = await card.innerText();
    const pick = (k) => {
      const m = full.match(new RegExp(`${k}:.*`));
      return m ? m[0].trim() : '';
    };
    reports.push({
      title: title.split('\n')[0],
      overview: pick('全体像'),
      traits: pick('特徴(卦・爻)'),
      reason: pick('選ぶ理由'),
      next: pick('次の一手'),
      fit: pick('合う条件'),
      avoid: pick('避けたい人'),
      gain: pick('得るもの'),
      loss: pick('失う可能性'),
      caution: pick('注意点'),
      outcome: pick('成果イメージ')
    });
  }
  console.log(JSON.stringify({ cardCount: count, reports }, null, 2));
  await browser.close();
})();
