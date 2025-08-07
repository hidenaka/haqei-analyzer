const puppeteer = require("puppeteer");
const fs = require("fs");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();
  
  const allErrors = [];
  const jsErrors = [];
  const warnings = [];
  
  page.on("console", msg => {
    const entry = {
      type: msg.type(),
      message: msg.text(),
      timestamp: new Date().toISOString(),
      url: msg.location().url
    };
    
    if (msg.type() === "error") {
      allErrors.push(entry);
      if (!entry.message.includes("favicon")) {
        jsErrors.push(entry);
        console.log("❌ JS ERROR:", msg.text());
      }
    } else if (msg.type() === "warning") {
      warnings.push(entry);
      console.log("⚠️ WARNING:", msg.text());
    } else if (msg.type() === "log") {
      console.log("📝 LOG:", msg.text());
    }
  });
  
  page.on("pageerror", error => {
    jsErrors.push({
      type: "pageerror",
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    console.log("🚨 PAGE ERROR:", error.message);
  });
  
  console.log("🚀 Starting comprehensive analysis test...");
  await page.goto("http://localhost:8080/future_simulator.html");
  
  console.log("⏳ Waiting for page initialization...");
  await delay(5000);
  
  // Check if elements exist
  const textInput = await page.$("#text-input");
  const analyzeBtn = await page.$("#analyze-btn");
  
  console.log(`📝 Text input exists: ${!!textInput}`);
  console.log(`🔘 Analyze button exists: ${!!analyzeBtn}`);
  
  if (textInput && analyzeBtn) {
    console.log("✍️ Typing analysis text...");
    await page.type("#text-input", "転職を考えているが、現在の安定した職を手放すリスクが心配。新しい挑戦をしたい気持ちと安全を求める気持ちが混在している。どちらを選択すべきか迷っている。");
    
    console.log("🔍 Clicking analyze button...");
    await page.click("#analyze-btn");
    
    console.log("⏳ Waiting for analysis results...");
    await delay(12000);
    
    // Check for results display
    const resultsDiv = await page.$("#results-container, .results-section, #analysis-results");
    const scenariosDiv = await page.$("#scenarios-container, .scenarios-section");
    
    console.log(`📊 Results container exists: ${!!resultsDiv}`);
    console.log(`🎯 Scenarios container exists: ${!!scenariosDiv}`);
  } else {
    console.log("❌ Required form elements not found");
  }
  
  await page.screenshot({ path: "analysis-flow-test.png", fullPage: true });
  
  const fullReport = {
    timestamp: new Date().toISOString(),
    testPhase: "Comprehensive Analysis Flow Test",
    summary: {
      totalErrors: allErrors.length,
      criticalJSErrors: jsErrors.length,
      warnings: warnings.length,
      elementsFound: {
        textInput: !!textInput,
        analyzeButton: !!analyzeBtn
      }
    },
    errors: {
      all: allErrors,
      jsOnly: jsErrors,
      warnings: warnings
    }
  };
  
  fs.writeFileSync("comprehensive-error-analysis.json", JSON.stringify(fullReport, null, 2));
  
  console.log(`\n🎯 COMPREHENSIVE TEST COMPLETE:`);
  console.log(`Total errors: ${allErrors.length}`);
  console.log(`Critical JS errors: ${jsErrors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  
  await browser.close();
})();
