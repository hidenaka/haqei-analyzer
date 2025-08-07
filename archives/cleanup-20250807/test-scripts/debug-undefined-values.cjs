#!/usr/bin/env node
const { chromium } = require('playwright');

async function debugUndefinedValues() {
  console.log('🔍 Undefined Values Debug Test');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Console monitoring for undefined values
  const undefinedMessages = [];
  const errors = [];
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') {
      errors.push(text);
      console.log(`❌ ${text}`);
    } else if (text.includes('undefined') || text.includes('null') || text.includes('NaN')) {
      undefinedMessages.push(text);
      console.log(`⚠️ ${text}`);
    } else if (text.includes('trigramEnergies') || text.includes('Energy:')) {
      console.log(`📊 ${text}`);
    }
  });
  
  try {
    console.log('🚀 Loading HAQEI OS Analyzer...');
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    // Quick 30-question test
    console.log('⚡ Running 30-question test to trigger undefined scenarios...');
    await page.click('#start-btn');
    await page.waitForTimeout(2000);
    
    // Answer questions with pattern that might trigger undefined values
    const answers = [4,0,4,0,4,0,4,0,4,0, 1,2,1,2,1,2,1,2,1,2, 3,4,3,4,3,4,3,4,3,4]; // Edge case pattern
    for (let i = 1; i <= 30; i++) {
      const options = await page.$$('.option[role="radio"]');
      if (options.length > 0) {
        const answerIndex = answers[i-1] % options.length;
        await options[answerIndex].click();
        
        if (i < 30) {
          await page.waitForSelector('#next-btn:not([disabled])', { timeout: 3000 });
          await page.click('#next-btn');
        }
      }
      await page.waitForTimeout(50);
    }
    
    // Final analysis
    await page.waitForSelector('#next-btn:not([disabled])', { timeout: 5000 });
    await page.click('#next-btn');
    
    // Wait for results
    await page.waitForTimeout(5000);
    
    // Check for undefined values in rendered content
    const undefinedInUI = await page.evaluate(() => {
      const results = [];
      
      // Check all text content for "undefined", "null", "NaN"
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const text = el.textContent || '';
        if ((text.includes('undefined') || text.includes('null') || text.includes('NaN')) && 
            !text.includes('script') && text.trim().length > 0) {
          results.push({
            tag: el.tagName,
            class: el.className,
            id: el.id,
            text: text.substring(0, 100),
            location: el.id || el.className || el.tagName
          });
        }
      });
      
      // Check for missing data in results
      const analyzer = window.criticalCSSAnalyzer;
      const tripleOSResults = analyzer?.state?.tripleOSResults;
      
      const dataIssues = [];
      if (tripleOSResults) {
        ['engineOS', 'interfaceOS', 'safeModeOS'].forEach(osType => {
          const os = tripleOSResults[osType];
          if (!os) {
            dataIssues.push(osType + ': completely missing');
          } else {
            if (!os.hexagramName || os.hexagramName === 'undefined') {
              dataIssues.push(osType + '.hexagramName: ' + os.hexagramName);
            }
            if (!os.catchphrase || os.catchphrase === 'undefined') {
              dataIssues.push(osType + '.catchphrase: ' + os.catchphrase);
            }
            if (!os.trigramEnergies) {
              dataIssues.push(osType + '.trigramEnergies: missing');
            } else {
              Object.entries(os.trigramEnergies).forEach(([trigram, energy]) => {
                if (energy === undefined || energy === null || isNaN(energy)) {
                  dataIssues.push(osType + '.trigramEnergies.' + trigram + ': ' + energy);
                }
              });
            }
            if (os.energy === undefined || os.energy === null || isNaN(os.energy)) {
              dataIssues.push(osType + '.energy: ' + os.energy);
            }
          }
        });
      }
      
      return {
        undefinedInText: results,
        dataIssues: dataIssues,
        tripleOSResultsExist: !!tripleOSResults
      };
    });
    
    console.log('🔍 Undefined Values Analysis:');
    console.log('   Triple OS Results exist:', undefinedInUI.tripleOSResultsExist ? '✅' : '❌');
    
    if (undefinedInUI.undefinedInText.length > 0) {
      console.log('   ❌ Undefined values found in UI text:');
      undefinedInUI.undefinedInText.forEach((issue, i) => {
        console.log('      ' + (i+1) + '. ' + issue.location + ': "' + issue.text + '"');
      });
    } else {
      console.log('   ✅ No undefined values found in UI text');
    }
    
    if (undefinedInUI.dataIssues.length > 0) {
      console.log('   ❌ Data structure issues:');
      undefinedInUI.dataIssues.forEach((issue, i) => {
        console.log('      ' + (i+1) + '. ' + issue);
      });
    } else {
      console.log('   ✅ No data structure issues found');
    }
    
    // Check for common UI problems
    const uiProblems = await page.evaluate(() => {
      const problems = [];
      
      // Check for empty charts or graphs
      const charts = document.querySelectorAll('canvas');
      charts.forEach(chart => {
        const ctx = chart.getContext('2d');
        // Simple check: if canvas is completely blank
        if (chart.width === 0 || chart.height === 0) {
          problems.push('Chart ' + (chart.id || 'unnamed') + ' has zero dimensions');
        }
      });
      
      // Check for empty sections
      const sections = [
        'os-cards-container',
        'dynamic-balance-display', 
        'eight-dimensional-radar',
        'trigram-energy-analysis'
      ];
      
      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section && section.innerHTML.trim().length === 0) {
          problems.push('Section ' + sectionId + ' is empty');
        }
      });
      
      return problems;
    });
    
    if (uiProblems.length > 0) {
      console.log('   ❌ UI rendering issues:');
      uiProblems.forEach((problem, i) => {
        console.log('      ' + (i+1) + '. ' + problem);
      });
    } else {
      console.log('   ✅ No UI rendering issues detected');
    }
    
    console.log('📝 Console Messages Summary:');
    console.log('   Undefined-related messages:', undefinedMessages.length);
    console.log('   Error messages:', errors.length);
    
    if (undefinedMessages.length > 0) {
      console.log('   Undefined messages details:');
      undefinedMessages.forEach((msg, i) => {
        console.log('      ' + (i+1) + '. ' + msg);
      });
    }
    
    // Screenshot for debugging
    await page.screenshot({ 
      path: 'debug-undefined-values-result.png', 
      fullPage: true 
    });
    
    console.log('✅ Undefined values debug completed - screenshot saved');
    
    return {
      undefinedInUI,
      uiProblems,
      undefinedMessages,
      errors
    };
    
  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
    await page.screenshot({ path: 'debug-undefined-values-error.png', fullPage: true });
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

debugUndefinedValues();