const puppeteer = require("puppeteer");
const fs = require("fs");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  const errors = [];
  const networkErrors = [];
  
  page.on("console", msg => {
    if (msg.type() === "error") {
      errors.push({
        type: "console",
        message: msg.text(),
        location: msg.location()
      });
      console.log("CONSOLE ERROR:", msg.text());
    }
  });
  
  page.on("requestfailed", request => {
    const url = request.url();
    const failure = request.failure();
    networkErrors.push({
      url,
      error: failure ? failure.errorText : "Unknown error"
    });
    console.log("NETWORK ERROR:", url, "-", failure ? failure.errorText : "Unknown");
  });
  
  console.log("🔗 Loading Future Simulator...");
  await page.goto("http://localhost:8080/future_simulator.html", { 
    waitUntil: "domcontentloaded" 
  });
  
  console.log("⏳ Waiting for load completion...");
  await delay(8000);
  
  const report = {
    timestamp: new Date().toISOString(),
    consoleErrors: errors,
    networkErrors: networkErrors,
    summary: {
      consoleErrorCount: errors.length,
      networkErrorCount: networkErrors.length
    }
  };
  
  fs.writeFileSync("detailed-console-errors.json", JSON.stringify(report, null, 2));
  
  console.log(`\n📊 ERRORS FOUND:`);
  console.log(`Console errors: ${errors.length}`);
  console.log(`Network errors: ${networkErrors.length}`);
  
  await browser.close();
})();
