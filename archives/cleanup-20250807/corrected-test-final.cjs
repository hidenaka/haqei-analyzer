const puppeteer = require("puppeteer");
const fs = require("fs");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  
  const allErrors = [];
  const jsErrors = [];
  
  page.on("console", msg => {
    if (msg.type() === "error" && !msg.text().includes("favicon")) {
      jsErrors.push({
        type: msg.type(),
        message: msg.text(),
        timestamp: new Date().toISOString()
      });
      console.log("❌ JS ERROR:", msg.text());
    }
  });
  
  page.on("pageerror", error => {
    jsErrors.push({
      type: "pageerror", 
      message: error.message,
      timestamp: new Date().toISOString()
    });
    console.log("🚨 PAGE ERROR:", error.message);
  });
  
  console.log("🚀 Starting CORRECTED analysis test...");
  await page.goto("http://localhost:8080/future_simulator.html");
  await delay(6000);
  
  // Check for CORRECT elements
  const textarea = await page.$("textarea");
  const analyzeBtn = await page.$("button");
  const buttonText = await page.$("#buttonText");
  
  console.log(`📝 Textarea exists: ${!!textarea}`);
  console.log(`🔘 Button exists: ${!!analyzeBtn}`);  
  console.log(`📝 ButtonText span exists: ${!!buttonText}`);
  
  if (textarea && analyzeBtn) {
    console.log("✍️ Typing test text into textarea...");
    await page.type("textarea", "転職を考えているが、現在の安定した職を手放すリスクが心配。新しい挑戦をしたい気持ちと安全を求める気持ちが混在している。どちらを選択すべきか迷っている。家族のことも考えると決断が難しい。");
    
    console.log("🔍 Clicking main analyze button...");
    await page.click("button");
    
    console.log("⏳ Waiting for analysis processing...");
    await delay(15000);
    
    // Check for results sections
    const resultsContainer = await page.$("#results");
    const eightScenariosSection = await page.$(".eight-scenarios, #scenarios");
    const chartContainers = await page.$(".chart-container");
    
    console.log(`📊 Results container: ${!!resultsContainer}`);
    console.log(`🎯 Eight scenarios section: ${!!eightScenariosSection}`);  
    console.log(`📈 Chart containers: ${!!chartContainers}`);
  } else {
    console.log("❌ Required form elements still not found");
  }
  
  await page.screenshot({ path: "corrected-analysis-test.png", fullPage: true });
  
  const finalReport = {
    timestamp: new Date().toISOString(),
    testStatus: "CORRECTED_SELECTORS",
    foundElements: {
      textarea: !!textarea,
      analyzeButton: !!analyzeBtn,
      buttonTextSpan: !!buttonText
    },
    jsErrors: jsErrors,
    errorCount: jsErrors.length
  };
  
  fs.writeFileSync("corrected-analysis-report.json", JSON.stringify(finalReport, null, 2));
  
  console.log(`\n✅ CORRECTED TEST COMPLETE:`);
  console.log(`JS Errors (excluding favicon): ${jsErrors.length}`);
  console.log(`Elements found: textarea=${!!textarea}, button=${!!analyzeBtn}`);
  
  await browser.close();
})();
