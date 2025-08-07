// Test script for verifying 30 questions flow
import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🚀 Starting 30 questions test...');
  
  // Navigate to the page
  await page.goto('http://localhost:3001/os_analyzer.html');
  
  // Wait for initial load
  await page.waitForSelector('#welcomeScreen', { timeout: 5000 });
  console.log('✅ Welcome screen loaded');
  
  // Click start button
  await page.click('#startButton');
  console.log('✅ Started analysis');
  
  // Wait for first question
  await page.waitForSelector('.question-container', { timeout: 5000 });
  console.log('✅ First question displayed');
  
  // Answer all 30 questions
  for (let i = 1; i <= 30; i++) {
    try {
      // Wait for question to be visible
      await page.waitForSelector('.question-container', { visible: true, timeout: 5000 });
      
      // Get question text
      const questionText = await page.$eval('.question-text', el => el.textContent);
      console.log(`📝 Question ${i}/30: ${questionText.substring(0, 50)}...`);
      
      // Select a random answer
      const buttons = await page.$$('.answer-button');
      if (buttons.length > 0) {
        const randomIndex = Math.floor(Math.random() * buttons.length);
        await buttons[randomIndex].click();
        console.log(`✅ Answered question ${i}`);
      }
      
      // Wait a bit for transition
      await page.waitForTimeout(500);
    } catch (error) {
      console.error(`❌ Error on question ${i}:`, error.message);
      break;
    }
  }
  
  // Check if results are displayed
  try {
    await page.waitForSelector('#resultsContainer', { timeout: 10000 });
    console.log('✅ Results displayed successfully!');
    
    // Check for Chart.js errors
    const chartErrors = await page.evaluate(() => {
      return typeof Chart !== 'undefined';
    });
    console.log(`✅ Chart.js loaded: ${chartErrors}`);
    
    // Check for hexagram data
    const hexagramExists = await page.evaluate(() => {
      const engine = window.tripleOSEngine || window.engine;
      return engine && typeof engine.getHexagramData === 'function';
    });
    console.log(`✅ getHexagramData function exists: ${hexagramExists}`);
    
  } catch (error) {
    console.error('❌ Results not displayed:', error.message);
  }
  
  // Keep browser open for manual inspection
  console.log('🔍 Test complete. Browser will remain open for inspection.');
  
})();