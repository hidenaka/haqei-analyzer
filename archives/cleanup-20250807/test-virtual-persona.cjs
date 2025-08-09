const { chromium } = require('playwright');

(async () => {
  try {
    console.log('🚀 Starting Virtual Persona Implementation Test...');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:8788/public/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    // Test 1: Check title changes
    const heroTitle = await page.textContent('.hero-title');
    console.log('✓ Hero Title:', heroTitle);
    
    const subtitle = await page.textContent('.hero-subtitle');
    const hasVirtualPersona = subtitle.includes('仮想人格');
    console.log('✓ Subtitle contains virtual persona:', hasVirtualPersona, '|', subtitle);
    
    // Test 2: Check about section
    const aboutText = await page.textContent('.about-content p:first-child');
    const hasGenerationTool = aboutText.includes('仮想人格生成ツール');
    console.log('✓ About text updated to generation tool:', hasGenerationTool);
    
    // Test 3: Check if VirtualPersonaEnhancer is loaded
    const classExists = await page.evaluate(() => {
      return typeof window.virtualPersonaEnhancer !== 'undefined';
    });
    console.log('✓ VirtualPersonaEnhancer class loaded:', classExists);
    
    // Test 4: Check page title
    const pageTitle = await page.title();
    const titleUpdated = pageTitle.includes('仮想人格生成システム');
    console.log('✓ Page title updated:', titleUpdated, '|', pageTitle);
    
    // Test 5: Try starting the analysis to test deeper integration
    await page.click('#start-btn');
    await page.waitForTimeout(2000);
    
    const questionVisible = await page.isVisible('#question-screen.active');
    console.log('✓ Question screen loads:', questionVisible);
    
    await page.screenshot({ path: 'virtual-persona-implementation-test.png', fullPage: true });
    console.log('✓ Screenshot saved: virtual-persona-implementation-test.png');
    
    await browser.close();
    
    // Summary
    console.log('\n📊 Implementation Test Results:');
    console.log('  - Title Updated:', titleUpdated ? '✅' : '❌');
    console.log('  - Subtitle Updated:', hasVirtualPersona ? '✅' : '❌');
    console.log('  - About Text Updated:', hasGenerationTool ? '✅' : '❌');
    console.log('  - VirtualPersonaEnhancer Class:', classExists ? '✅' : '❌');
    console.log('  - Question Flow Working:', questionVisible ? '✅' : '❌');
    
    const allPassed = titleUpdated && hasVirtualPersona && hasGenerationTool && classExists && questionVisible;
    console.log('\n🎯 Overall Result:', allPassed ? '✅ ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
})();