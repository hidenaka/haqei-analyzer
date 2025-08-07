const { chromium } = require('playwright');

(async () => {
  try {
    console.log('🎭 Testing Virtual Persona Card Generation...');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:8788/public/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    // Start the analysis
    await page.click('#start-btn');
    await page.waitForTimeout(1000);
    
    // Answer all 30 questions quickly to get to results
    console.log('📝 Answering all 30 questions...');
    for (let i = 0; i < 30; i++) {
      await page.waitForSelector('.option:first-child', { timeout: 5000 });
      await page.click('.option:first-child');
      await page.waitForTimeout(100);
      
      const nextBtn = page.locator('#next-btn');
      const isEnabled = await nextBtn.isEnabled();
      
      if (isEnabled) {
        await nextBtn.click();
        await page.waitForTimeout(100);
      }
    }
    
    // Wait for analysis to complete
    console.log('⚗️ Waiting for analysis to complete...');
    await page.waitForSelector('#results-screen.active', { timeout: 10000 });
    
    // Check if persona cards are generated
    const personaCards = await page.$$('.virtual-persona-card');
    console.log('✓ Number of persona cards found:', personaCards.length);
    
    // Check for specific persona elements
    const personaSymbols = await page.$$('.persona-symbol');
    const personaNames = await page.$$('.persona-name');
    const personaCatchphrases = await page.$$('.persona-catchphrase');
    const traitTags = await page.$$('.trait-tag');
    
    console.log('✓ Persona symbols found:', personaSymbols.length);
    console.log('✓ Persona names found:', personaNames.length);
    console.log('✓ Persona catchphrases found:', personaCatchphrases.length);
    console.log('✓ Trait tags found:', traitTags.length);
    
    // Get persona names if available
    if (personaNames.length > 0) {
      for (let i = 0; i < personaNames.length; i++) {
        const name = await personaNames[i].textContent();
        const symbol = personaSymbols[i] ? await personaSymbols[i].textContent() : 'N/A';
        console.log(`  - Persona ${i + 1}: ${symbol} ${name}`);
      }
    }
    
    // Take screenshot of results
    await page.screenshot({ path: 'persona-cards-results.png', fullPage: true });
    console.log('✓ Results screenshot saved: persona-cards-results.png');
    
    await browser.close();
    
    // Summary
    console.log('\n🎭 Persona Card Generation Test Results:');
    console.log('  - Persona Cards Generated:', personaCards.length > 0 ? '✅' : '❌');
    console.log('  - Persona Symbols Present:', personaSymbols.length > 0 ? '✅' : '❌');
    console.log('  - Persona Names Present:', personaNames.length > 0 ? '✅' : '❌');
    console.log('  - Catchphrases Present:', personaCatchphrases.length > 0 ? '✅' : '❌');
    console.log('  - Trait Tags Present:', traitTags.length > 0 ? '✅' : '❌');
    
    const allPersonaFeatures = personaCards.length > 0 && personaSymbols.length > 0 && 
                              personaNames.length > 0 && personaCatchphrases.length > 0 && 
                              traitTags.length > 0;
    
    console.log('\n🎯 Persona Generation Result:', allPersonaFeatures ? '✅ FULL PERSONA SYSTEM WORKING' : '⚠️ PARTIAL IMPLEMENTATION');
    
  } catch (error) {
    console.error('❌ Persona card test failed:', error);
  }
})();