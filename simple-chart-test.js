const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log("Starting Chart.js validation");
  
  await page.goto("http://localhost:8788/os_analyzer.html");
  await page.waitForTimeout(3000);
  
  const chartJsLoaded = await page.evaluate(() => {
    return typeof window.Chart \!== "undefined";
  });
  
  console.log("Chart.js loaded:", chartJsLoaded);
  
  const canvasCount = await page.evaluate(() => {
    return document.querySelectorAll("canvas").length;
  });
  
  console.log("Canvas elements found:", canvasCount);
  
  await page.screenshot({ path: "chart-validation.png", fullPage: true });
  
  await browser.close();
  
  console.log("Validation complete");
})();
