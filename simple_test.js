const { chromium } = require("playwright");

async function test() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto("http://127.0.0.1:8083/future_simulator.html");
    await page.screenshot({ path: "test-screenshot.png" });
    const title = await page.title();
    console.log("Success - Title:", title);
    return true;
  } catch (error) {
    console.error("Error:", error.message);
    return false;
  } finally {
    await browser.close();
  }
}

test();
