import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import url from 'node:url';

const PORT = Number(process.env.PORT || 8791);
const BASE = `http://localhost:${PORT}`;

function startStaticServer(rootDir, port) {
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml'
  };
  const server = http.createServer((req, res) => {
    try {
      const parsed = url.parse(req.url || '/');
      let pathname = decodeURIComponent(parsed.pathname || '/');
      if (pathname === '/') pathname = '/future_simulator.html';
      const filePath = path.join(rootDir, pathname);
      if (!filePath.startsWith(rootDir)) { res.statusCode = 403; res.end('Forbidden'); return; }
      fs.stat(filePath, (err, stat) => {
        if (err) { res.statusCode = 404; res.end('Not found'); return; }
        const finalPath = stat.isDirectory() ? path.join(filePath, 'index.html') : filePath;
        fs.readFile(finalPath, (err2, data) => {
          if (err2) { res.statusCode = 404; res.end('Not found'); return; }
          const ext = path.extname(finalPath).toLowerCase();
          res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
          res.end(data);
        });
      });
    } catch (e) { res.statusCode = 500; res.end('Server error'); }
  });
  return new Promise((resolve) => { server.listen(port, '127.0.0.1', () => resolve(server)); });
}

async function run() {
  const publicDir = path.resolve('public');
  const artifacts = path.resolve('artifacts');
  try { fs.mkdirSync(artifacts, { recursive: true }); } catch {}
  const server = await startStaticServer(publicDir, PORT);
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  page.on('console', m => { try { console.log('[browser]', m.type(), m.text()); } catch {} });

  await page.goto(`${BASE}/future_simulator.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });

  // Disclaimer visible
  const disclaimer = page.locator('#fs-disclaimer');
  if (!(await disclaimer.isVisible())) console.log('⚠️ Disclaimer not visible');

  // Input & analyze
  const field = page.locator('#worryInput, textarea, input[type="text"]').first();
  if (await field.count()) await field.fill('将来の方向性について迷っています。次の一歩は？');
  const analyzeBtn = page.locator('#aiGuessBtn');
  if (await analyzeBtn.count()) await analyzeBtn.click().catch(()=>{});

  // EightBranches visible
  const branches = page.locator('#eight-branches-display');
  await branches.waitFor({ state: 'visible', timeout: 90000 });

  // Check badges (現代解釈)
  let hasBadge = 0;
  try {
    await branches.locator('[data-test="badge-applied"]').first().waitFor({ state: 'visible', timeout: 5000 });
    hasBadge = await branches.locator('[data-test="badge-applied"]').count();
  } catch {}
  console.log(`Badges(現代解釈) count: ${hasBadge}`);

  // Compare panel placeholder
  const comparePanel = page.locator('#branches-compare-panel');
  await comparePanel.first().waitFor({ state: 'attached', timeout: 5000 }).catch(()=>{});
  const compareExists = await comparePanel.count();
  console.log(`Compare panel exists: ${compareExists>0}`);

  // Add two cards to compare
  const cmpButtons = branches.locator('button', { hasText: '比較に追加' });
  const btnCount = await cmpButtons.count();
  for (let i = 0; i < Math.min(2, btnCount); i++) {
    await cmpButtons.nth(i).click().catch(()=>{});
    await page.waitForTimeout(100);
  }
  const compareItems = comparePanel.locator('[data-test="compare-item"]');
  const compareItemCount = await compareItems.count();
  console.log(`Compare items: ${compareItemCount}`);

  // Visual elements quick check
  try {
    const spirals = await branches.locator('[data-test="spiral-glyph"]').count();
    const stamps  = await branches.locator('[data-test="outcome-stamp"]').count();
    const effects = await branches.locator('[data-test="visual-effects"]').count();
    const sparks  = await branches.locator('[data-test="visual-spark"]').count();
    console.log(`Visuals — spiral:${spirals} stamp:${stamps} effects:${effects} spark:${sparks}`);
  } catch {}

  // Toggle to Evidence mode
  await page.locator('#display-mode-bar').first().waitFor({ state: 'visible', timeout: 5000 }).catch(()=>{});
  const evBtn = page.locator('#display-mode-bar button', { hasText: '根拠' });
  await evBtn.first().waitFor({ state: 'visible', timeout: 5000 }).catch(()=>{});
  if (await evBtn.count()) {
    await evBtn.first().click();
    // wait for details open with small polling window
    let openDetails = 0;
    const start = Date.now();
    while (Date.now() - start < 5000) {
      openDetails = await branches.locator('details[open]').count();
      if (openDetails > 0) break;
      await page.waitForTimeout(200);
    }
    console.log(`Evidence mode details open: ${openDetails}`);
  } else {
    console.log('⚠️ Evidence toggle not found');
  }

  await page.screenshot({ path: path.join(artifacts, 'future-simulator-extended.png'), fullPage: true }).catch(()=>{});
  await ctx.close();
  await browser.close();
  server.close();
}

run().catch(e => { console.error('❌ Extended verify failed:', e?.message || e); process.exit(1); });
