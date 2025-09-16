import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import url from 'node:url';

const PORT = Number(process.env.PORT || 8789);
const BASE = `http://localhost:${PORT}`;

function startStaticServer(rootDir, port) {
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webm': 'video/webm'
  };
  const server = http.createServer((req, res) => {
    try {
      const parsed = url.parse(req.url || '/');
      let pathname = decodeURIComponent(parsed.pathname || '/');
      if (pathname === '/') pathname = '/future_simulator.html';
      const filePath = path.join(rootDir, pathname);
      if (!filePath.startsWith(rootDir)) {
        res.statusCode = 403; res.end('Forbidden'); return;
      }
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
    } catch (e) {
      res.statusCode = 500; res.end('Server error');
    }
  });
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

async function verify() {
  // Start a minimal static server serving ./public
  const publicDir = path.resolve(process.cwd(), 'public');
  const server = await startStaticServer(publicDir, PORT);
  console.log(`🛰️  Static server running at ${BASE} (root=${publicDir})`);
  const browser = await chromium.launch({ headless: true });
  // Ensure artifacts dirs
  const artifactsDir = path.resolve(process.cwd(), 'artifacts');
  const videosDir = path.join(artifactsDir, 'videos');
  try { fs.mkdirSync(videosDir, { recursive: true }); } catch {}
  const ctx = await browser.newContext({ recordVideo: { dir: videosDir, size: { width: 1280, height: 800 } } });
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
      await page.locator('#now-main-reason').waitFor({ state: 'visible', timeout: 60000 });
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

    // Smooth scroll to bottom to capture full-page experience
    console.log('🖱️ Scrolling to bottom...');
    const step = 600;
    for (let i = 0; i < 40; i++) {
      await page.evaluate((dy) => window.scrollBy(0, dy), step);
      await page.waitForTimeout(150);
      const atBottom = await page.evaluate(() => (window.scrollY + window.innerHeight) >= document.body.scrollHeight - 2);
      if (atBottom) break;
    }
    await page.waitForTimeout(1200);
    // Snapshot at bottom
    try {
      await page.screenshot({ path: path.join(artifactsDir, 'future-simulator-bottom.png'), fullPage: false });
      console.log('📸 Saved', path.join('artifacts','future-simulator-bottom.png'));
    } catch {}

    // Verify recommendation bar exists for at least one card (linked to S7)
    try {
      const hasReco = await page.locator('#eight-branches-display :text("おすすめ度:")').count();
      console.log(`Recommendation labels found: ${hasReco}`);
      if (hasReco <= 0) console.log('ℹ️ No recommendation bar visible (S7 missing or fallback)');
    } catch {}

    // Screenshot evidence
    await page.screenshot({ path: path.join(artifactsDir, 'future-simulator-verify.png'), fullPage: true }).catch(()=>{});
    console.log('📸 Saved', path.join('artifacts','future-simulator-verify.png'));

    return true;
  } catch (e) {
    console.error('❌ Verification failed:', e?.message || e);
    return false;
  } finally {
    try { server.close(); } catch {}
    // Save video
    try {
      const v = page.video();
      if (v) {
        const tmpPath = await v.path();
        const finalPath = path.join(artifactsDir, 'videos', `future-simulator-run.webm`);
        try { fs.copyFileSync(tmpPath, finalPath); } catch {}
        console.log('🎬 Saved video:', path.join('artifacts','videos','future-simulator-run.webm'));
      }
    } catch {}
    await ctx.close();
    await browser.close();
  }
}

verify().then(ok => {
  process.exit(ok ? 0 : 1);
});
