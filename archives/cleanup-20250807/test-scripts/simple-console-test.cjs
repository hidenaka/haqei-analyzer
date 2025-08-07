const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  const errors = [];
  page.on("console", msg => {
    if (msg.type() === "error") {
      errors.push(msg.text());
      console.log("ERROR:", msg.text());
    }
  });
  
  await page.goto("http://localhost:8080/future_simulator.html");
  await page.waitForTimeout(5000);
  
  const report = { errors, count: errors.length };
  fs.writeFileSync("console-errors.json", JSON.stringify(report, null, 2));
  
  await browser.close();
})();
