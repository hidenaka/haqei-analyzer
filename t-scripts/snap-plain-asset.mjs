import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:8899';
const URL = `${BASE}/assets/H384H64database.plain.js`;

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.screenshot({ path: 'artifacts/plain-asset.png', fullPage: true }).catch(()=>{});
console.log('📸 Saved artifacts/plain-asset.png');
await ctx.close();
await browser.close();

