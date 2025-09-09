// Programmatic UI check for future_simulator.html using Playwright (no test runner)
// Steps:
// 1) Start a simple HTTP server on :8788
// 2) Open the page, input sample text, run analysis
// 3) Extract key fields and save screenshots
// 4) Repeat for determinism check

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { writeFile } from 'node:fs/promises';

const PORT = 8788;
const BASE = `http://localhost:${PORT}`;
const PAGE = `${BASE}/public/future_simulator.html`;

async function startServer() {
  // Use Python's simple HTTP server from repo root
  const proc = spawn('python3', ['-m', 'http.server', String(PORT)], {
    stdio: 'ignore',
    cwd: process.cwd(),
  });
  // Simple readiness check
  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(PAGE);
      if (res.ok) { ready = true; break; }
    } catch {}
    await delay(200);
  }
  if (!ready) throw new Error('HTTP server did not become ready');
  return proc;
}

async function runOnce(page, text) {
  await page.goto(PAGE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#worryInput', { state: 'visible', timeout: 20000 });
  await page.fill('#worryInput', text);
  await page.click('#aiGuessBtn');
  await page.waitForSelector('#lines384Results', { state: 'visible', timeout: 60000 });
  const name = (await page.textContent('#selectedLineName')).trim();
  const hex = (await page.textContent('#selectedLineHexagram')).trim();
  const conf = (await page.textContent('#lineConfidence')).trim();
  const src = (await page.textContent('#lineDataSource')).trim();
  await page.locator('#lines384Results').screenshot({ path: 'future-sim_results.png' });
  return { name, hex, conf, src };
}

async function main() {
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const input = '新しい環境で挑戦し、困難を乗り越えて成長したい。具体的な行動方針を定めたい';
  const first = await runOnce(page, input);
  let deterministic = true;
  for (let i = 0; i < 3; i++) {
    const r = await runOnce(page, input);
    if (r.name !== first.name || r.hex !== first.hex) deterministic = false;
  }

  const report = {
    url: PAGE,
    selected: first,
    determinism: deterministic,
    timestamp: new Date().toISOString(),
  };
  await writeFile('future-sim_report.json', JSON.stringify(report, null, 2));

  await browser.close();
  server.kill('SIGTERM');
  console.log('✅ Future Simulator UI check complete');
  console.log(report);
}

main().catch(err => {
  console.error('❌ UI check failed:', err);
  process.exit(1);
});

