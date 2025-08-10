const { chromium } = require('playwright');

(async () => {
  console.log('🔍 CORRECTED HAQEI OS Analyzer Testing');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const allErrors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      allErrors.push('CONSOLE: ' + msg.text());
    }
  });
  
  page.on('pageerror', error => {
    allErrors.push('JS ERROR: ' + error.message);
  });
  
  try {
    console.log('📍 Loading page...');
    await page.goto('http://localhost:8080/os_analyzer.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    const title = await page.title();
    console.log('✅ Title:', title);
    
    // Test correct selectors
    const hasStartBtn = await page.locator('#start-btn').count() > 0;
    console.log('Start button:', hasStartBtn ? '✅ Found' : '❌ Missing');
    
    const hasWelcomeContainer = await page.locator('.welcome-container').count() > 0;
    console.log('Welcome container:', hasWelcomeContainer ? '✅ Found' : '❌ Missing');
    
    const hasMainContainers = await page.locator('.container').count();
    console.log('Main containers found:', hasMainContainers);
    
    // Test questionnaire elements
    const hasQuestionnaireForm = await page.locator('#questionnaire-form').count() > 0;
    console.log('Questionnaire form:', hasQuestionnaireForm ? '✅ Found' : '❌ Missing');
    
    // Test button interaction
    if (hasStartBtn) {
      console.log('🔍 Testing start button...');
      await page.click('#start-btn');
      await page.waitForTimeout(2000);
      
      const formVisible = await page.locator('#questionnaire-form').isVisible();
      console.log('Form appears after click:', formVisible ? '✅ Yes' : '❌ No');
      
      // Look for question elements
      const questionElements = await page.locator('input[type="radio"], .question').count();
      console.log('Question elements found:', questionElements);
    }
    
    // Check critical dependencies
    console.log('
📡 Testing dependencies...');
    const jsLoadErrors = await page.evaluate(() => {
      return typeof window.H384H64Database \!== 'undefined' ? 'H384H64Database loaded' : 'Database missing';
    });
    console.log('Database status:', jsLoadErrors);
    
    console.log('
📊 Summary:');
    console.log('Total errors:', allErrors.length);
    
    if (allErrors.length > 0) {
      console.log('❌ Errors found:');
      allErrors.forEach((error, i) => console.log((i+1) + '. ' + error));
    }
    
    if (allErrors.length === 0) {
      console.log('✅ No JavaScript errors\!');
    }
    
    // Overall quality assessment
    let score = 0;
    if (hasStartBtn) score += 20;
    if (hasWelcomeContainer) score += 20;
    if (hasMainContainers >= 3) score += 20;
    if (hasQuestionnaireForm) score += 20;
    if (allErrors.length === 0) score += 20;
    
    console.log('
🎯 QUALITY SCORE: ' + score + '/100');
    
    let grade;
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';
    else grade = 'F';
    
    console.log('📋 GRADE: ' + grade);
    
  } catch (error) {
    console.error('❌ Fatal Error:', error.message);
  } finally {
    await browser.close();
  }
})();
