import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import url from 'node:url';

const PORT = Number(process.env.PORT || 8790);
const BASE = `http://localhost:${PORT}`;

function startStaticServer(rootDir, port) {
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8'
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
  const server = await startStaticServer(path.resolve('public'), PORT);
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(`${BASE}/future_simulator.html`, { waitUntil: 'domcontentloaded' });
  // 入力 → 分析
  const inputSel = '#worryInput, textarea, input[type="text"]';
  const loc = page.locator(inputSel).first();
  if (await loc.count()) {
    await loc.fill('将来の方向性について迷っています。次の一歩は？');
  }
  const btn = page.locator('#aiGuessBtn');
  if (await btn.count()) await btn.click().catch(()=>{});
  // 八分岐の表示待ち
  const container = page.locator('#eight-branches-display');
  await container.waitFor({ state: 'visible', timeout: 60000 });
  // 8カードから識別情報を抽出
  const data = await page.evaluate(() => {
    const root = document.querySelector('#eight-branches-display');
    if (!root) return [];
    const cards = Array.from(root.querySelectorAll('[role="group"]'));
    return cards.slice(0, 8).map((c, i) => {
      const title = (c.querySelector('[data-role="branch-title"]') || Array.from(c.querySelectorAll('div')).find(d => /分岐\d/.test(d.textContent || '')) || { innerText: '' }).innerText;
      const summary = c.querySelector('[data-section="summary"]')?.innerText || '';
      const easy = Array.from(c.querySelectorAll('div'))
        .find(d => d.textContent && d.textContent.trim() === 'やさしい指針');
      let oneLine = '';
      if (easy) {
        const next = easy.parentElement;
        // oneLineはsummary置換済みの可能性があるため、chipsや警告の前の最初のテキストを拾う
        oneLine = next ? next.innerText.split('\n').slice(1,2).join(' ') : '';
      }
      return { idx: i+1, title, summary, oneLine };
    });
  });
  console.log(JSON.stringify(data, null, 2));
  await ctx.close();
  await browser.close();
  server.close();
}

run().catch(e => { console.error(e); process.exit(1); });
