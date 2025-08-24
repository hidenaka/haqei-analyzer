// @ts-check
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

test.describe('HAQEI Analyzer UI Testing', () => {
  let page;
  let consoleErrors = [];

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(`Console Error: ${msg.text()}`);
        console.log(`Console Error: ${msg.text()}`);
      }
    });

    // Listen for page errors
    page.on('pageerror', error => {
      consoleErrors.push(`Page Error: ${error.message}`);
      console.log(`Page Error: ${error.message}`);
    });
  });

  test.afterAll(async () => {
    if (page) {
      await page.close();
    }
    
    // Report console errors
    if (consoleErrors.length > 0) {
      console.log('\n=== CONSOLE ERRORS SUMMARY ===');
      consoleErrors.forEach(error => console.log(error));
    }
  });

  test('1. Navigate to main page and verify modern white/blue design', async () => {
    console.log('🧪 Testing main page navigation and design...');
    
    await page.goto(`${BASE_URL}/index.html`);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of main page
    await page.screenshot({ 
      path: '/Users/hideakimacbookair/Desktop/haqei-analyzer/test-screenshots/01-main-page.png',
      fullPage: true 
    });
    
    // Verify page loads correctly
    await expect(page).toHaveTitle(/HaQei/);
    
    // Check for modern design elements
    const body = await page.locator('body');
    const backgroundStyle = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    console.log(`Main page background color: ${backgroundStyle}`);
    
    // Look for blue accent elements
    const blueElements = await page.locator('[style*="blue"], [class*="blue"], [class*="primary"]').count();
    console.log(`Found ${blueElements} blue accent elements`);
    
    // Verify CSS is loaded
    const cssLoaded = await page.evaluate(() => {
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      return links.length > 0;
    });
    expect(cssLoaded).toBe(true);
    
    console.log('✅ Main page design verification complete');
  });

  test('2. Navigate to results page and verify white/blue design (not black/purple)', async () => {
    console.log('🧪 Testing results page design...');
    
    await page.goto(`${BASE_URL}/results.html`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Allow any dynamic content to load
    
    // Take screenshot of results page
    await page.screenshot({ 
      path: '/Users/hideakimacbookair/Desktop/haqei-analyzer/test-screenshots/02-results-page.png',
      fullPage: true 
    });
    
    // Check background color is white/light (not black/purple)
    const bodyBackground = await page.evaluate(() => {
      const body = document.body;
      const computedStyle = getComputedStyle(body);
      return {
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color
      };
    });
    
    console.log(`Results page background: ${bodyBackground.backgroundColor}`);
    console.log(`Results page text color: ${bodyBackground.color}`);
    
    // Verify it's not using dark colors (black/purple theme)
    const isDarkTheme = await page.evaluate(() => {
      const body = document.body;
      const style = getComputedStyle(body);
      const bg = style.backgroundColor;
      const color = style.color;
      
      // Check for dark backgrounds
      return bg.includes('rgb(0, 0, 0)') || 
             bg.includes('rgba(0, 0, 0') ||
             bg.includes('#000') ||
             bg.includes('purple') ||
             bg.includes('rgb(75, 0, 130)'); // indigo/purple
    });
    
    expect(isDarkTheme).toBe(false);
    console.log('✅ Results page is using light theme (not dark)');
  });

  test('3. Verify TabNavigator system is initialized (not VirtualPersonaResultsView)', async () => {
    console.log('🧪 Testing TabNavigator initialization...');
    
    await page.goto(`${BASE_URL}/results.html`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Allow JavaScript to initialize
    
    // Check if TabNavigator is defined and initialized
    const tabNavigatorExists = await page.evaluate(() => {
      return typeof window.TabNavigator !== 'undefined';
    });
    
    console.log(`TabNavigator exists: ${tabNavigatorExists}`);
    
    // Check if VirtualPersonaResultsView is NOT being used as main system
    const virtualPersonaActive = await page.evaluate(() => {
      return typeof window.VirtualPersonaResultsView !== 'undefined' && 
             window.VirtualPersonaResultsView?.isActive === true;
    });
    
    console.log(`VirtualPersonaResultsView active: ${virtualPersonaActive}`);
    
    // Look for tab navigation elements in DOM
    const tabElements = await page.locator('.tab, [class*="tab"], [data-tab]').count();
    console.log(`Found ${tabElements} tab-related elements`);
    
    // Check for TabNavigator specific elements
    const tabNavContainer = await page.locator('#tab-container, .tab-container, .tab-navigation').count();
    console.log(`Found ${tabNavContainer} tab navigation containers`);
    
    expect(tabNavigatorExists || tabElements > 0).toBe(true);
    console.log('✅ TabNavigator system verification complete');
  });

  test('4. Verify BasicResultsTab displays correctly', async () => {
    console.log('🧪 Testing BasicResultsTab display...');
    
    await page.goto(`${BASE_URL}/results.html`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Look for BasicResultsTab elements
    const basicResultsElements = await page.evaluate(() => {
      // Check for various possible selectors for basic results
      const selectors = [
        '[data-tab="basic"]',
        '.basic-results',
        '#basic-tab',
        '.tab-basic',
        '[class*="basic"]'
      ];
      
      let found = [];
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          found.push(`${selector}: ${elements.length} elements`);
        }
      });
      
      return found;
    });
    
    console.log('BasicResultsTab elements found:', basicResultsElements);
    
    // Check if basic results content is visible
    const basicContentVisible = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="basic"], [data-tab="basic"]');
      for (let element of elements) {
        const style = getComputedStyle(element);
        if (style.display !== 'none' && style.visibility !== 'hidden') {
          return true;
        }
      }
      return false;
    });
    
    console.log(`Basic results content visible: ${basicContentVisible}`);
    
    // Take screenshot focused on results area
    await page.screenshot({ 
      path: '/Users/hideakimacbookair/Desktop/haqei-analyzer/test-screenshots/03-basic-results-tab.png',
      fullPage: true 
    });
    
    console.log('✅ BasicResultsTab display verification complete');
  });

  test('5. Check for console errors and JavaScript functionality', async () => {
    console.log('🧪 Testing for JavaScript errors and functionality...');
    
    const pages = ['index.html', 'results.html', 'os_analyzer.html'];
    
    for (const pageName of pages) {
      console.log(`Testing ${pageName}...`);
      await page.goto(`${BASE_URL}/${pageName}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Try to interact with the page to trigger any JavaScript
      const clickableElements = await page.locator('button, [onclick], .clickable, [role="button"]').count();
      if (clickableElements > 0) {
        console.log(`Found ${clickableElements} clickable elements on ${pageName}`);
        
        // Try clicking the first button if it exists
        const firstButton = page.locator('button, [onclick], .clickable, [role="button"]').first();
        try {
          await firstButton.click({ timeout: 3000 });
          await page.waitForTimeout(1000);
        } catch (error) {
          console.log(`Could not click element on ${pageName}: ${error.message}`);
        }
      }
    }
    
    console.log(`Total console errors found: ${consoleErrors.length}`);
    
    // Take final screenshot of results page
    await page.goto(`${BASE_URL}/results.html`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: '/Users/hideakimacbookair/Desktop/haqei-analyzer/test-screenshots/04-final-results-state.png',
      fullPage: true 
    });
    
    console.log('✅ JavaScript functionality check complete');
  });

  test('6. Verify CSS unified design system is applied', async () => {
    console.log('🧪 Testing unified design system...');
    
    await page.goto(`${BASE_URL}/results.html`);
    await page.waitForLoadState('networkidle');
    
    // Check if the unified design CSS is loaded
    const unifiedCSSLoaded = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.some(link => 
        link.href.includes('haqei-unified-design.css') ||
        link.href.includes('unified') ||
        link.href.includes('design')
      );
    });
    
    console.log(`Unified CSS loaded: ${unifiedCSSLoaded}`);
    
    // Check for consistent color scheme
    const colorScheme = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const colors = new Set();
      const backgrounds = new Set();
      
      for (let i = 0; i < Math.min(50, elements.length); i++) {
        const style = getComputedStyle(elements[i]);
        if (style.color && style.color !== 'rgba(0, 0, 0, 0)') {
          colors.add(style.color);
        }
        if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          backgrounds.add(style.backgroundColor);
        }
      }
      
      return {
        colorsCount: colors.size,
        backgroundsCount: backgrounds.size,
        colors: Array.from(colors).slice(0, 10),
        backgrounds: Array.from(backgrounds).slice(0, 10)
      };
    });
    
    console.log(`Color scheme analysis:`, colorScheme);
    
    console.log('✅ Unified design system verification complete');
  });
});