const { chromium } = require("playwright");

async function emergencyDiagnosis() {
  console.log("🚨 EMERGENCY DIAGNOSIS START");
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Console error tracking
  let errors = [];
  page.on("console", msg => {
    if (msg.type() === "error") {
      errors.push(msg.text());
      console.log("❌ Console Error:", msg.text());
    }
  });
  
  // Network error tracking
  let networkErrors = [];
  page.on("requestfailed", request => {
    networkErrors.push(request.url());
    console.log("🌐 Network Error:", request.url());
  });
  
  const urls = [
    "http://127.0.0.1:8084/future_simulator.html",
    "http://127.0.0.1:8085/future_simulator.html", 
    "http://127.0.0.1:8788/future_simulator.html"
  ];
  
  for (const url of urls) {
    try {
      console.log(`Testing ${url}...`);
      await page.goto(url, { waitUntil: "networkidle" });
      
      // Wait and take screenshot
      await page.waitForTimeout(3000);
      await page.screenshot({ path: `emergency-${url.split(":")[2]}.png`, fullPage: true });
      
      // Check if initial screen displays
      const title = await page.title();
      const bodyContent = await page.$eval("body", el => el.textContent.length);
      
      console.log(`✅ ${url}: Title="${title}", Content=${bodyContent} chars`);
      
    } catch (error) {
      console.log(`❌ ${url}: ${error.message}`);
    }
  }
  
  console.log("📊 DIAGNOSIS SUMMARY");
  console.log(`Console Errors: ${errors.length}`);
  console.log(`Network Errors: ${networkErrors.length}`);
  
  await browser.close();
  
  return { errors, networkErrors };
}

emergencyDiagnosis().catch(console.error);
