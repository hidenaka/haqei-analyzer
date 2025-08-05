const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Container Visibility Debug Test');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500,
    args: ['--no-sandbox', '--disable-web-security']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Enhanced console logging
  page.on('console', msg => {
    const type = msg.type().toUpperCase();
    const text = msg.text();
    console.log(`[BROWSER ${type}] ${text}`);
  });
  
  // Error logging
  page.on('pageerror', error => {
    console.error(`[PAGE ERROR] ${error.message}`);
  });
  
  try {
    console.log('📍 Navigating to OS Analyzer...');
    await page.goto('http://localhost:8788/os_analyzer.html');
    
    console.log('⏳ Waiting for page to load...');
    await page.waitForTimeout(3000);
    
    // Click start button
    const startButton = await page.$('#start-analysis-btn');
    if (startButton) {
      console.log('🖱️ Clicking start button...');
      await startButton.click();
      
      // Wait for transition
      await page.waitForTimeout(2000);
      
      // Deep dive into container visibility
      const containerAnalysis = await page.evaluate(() => {
        const container = document.getElementById('questions-container');
        if (!container) return { error: 'Container not found' };
        
        const computedStyle = window.getComputedStyle(container);
        const rect = container.getBoundingClientRect();
        
        return {
          // Basic properties
          exists: !!container,
          offsetParent: container.offsetParent !== null,
          offsetWidth: container.offsetWidth,
          offsetHeight: container.offsetHeight,
          
          // Computed styles
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          opacity: computedStyle.opacity,
          position: computedStyle.position,
          top: computedStyle.top,
          left: computedStyle.left,
          width: computedStyle.width,
          height: computedStyle.height,
          zIndex: computedStyle.zIndex,
          transform: computedStyle.transform,
          
          // Bounding rect
          rectTop: rect.top,
          rectLeft: rect.left,
          rectWidth: rect.width,
          rectHeight: rect.height,
          rectVisible: rect.width > 0 && rect.height > 0,
          
          // Classes and attributes
          className: container.className,
          id: container.id,
          
          // Parent chain analysis
          parentElements: (() => {
            const parents = [];
            let parent = container.parentElement;
            while (parent && parents.length < 5) {
              const parentStyle = window.getComputedStyle(parent);
              parents.push({
                tagName: parent.tagName,
                id: parent.id,
                className: parent.className,
                display: parentStyle.display,
                visibility: parentStyle.visibility,
                opacity: parentStyle.opacity,
                overflow: parentStyle.overflow,
                transform: parentStyle.transform
              });
              parent = parent.parentElement;
            }
            return parents;
          })(),
          
          // Child elements analysis
          childElements: Array.from(container.children).slice(0, 5).map(child => {
            const childStyle = window.getComputedStyle(child);
            const childRect = child.getBoundingClientRect();
            return {
              tagName: child.tagName,
              id: child.id,
              className: child.className,
              display: childStyle.display,
              visibility: childStyle.visibility,
              opacity: childStyle.opacity,
              width: childRect.width,
              height: childRect.height
            };
          })
        };
      });
      
      console.log('📊 Container Analysis:', JSON.stringify(containerAnalysis, null, 2));
      
      // Check if there are any overlaying elements
      const overlayAnalysis = await page.evaluate(() => {
        const container = document.getElementById('questions-container');
        if (!container) return { error: 'Container not found' };
        
        // Check what elements are at the container's position
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const elementAtCenter = document.elementFromPoint(centerX, centerY);
        const elementsAtPoint = [];
        
        // Get multiple points to check for overlays
        const points = [
          { x: rect.left + 10, y: rect.top + 10 },
          { x: rect.left + rect.width - 10, y: rect.top + 10 },
          { x: centerX, y: centerY },
          { x: rect.left + 10, y: rect.top + rect.height - 10 },
          { x: rect.left + rect.width - 10, y: rect.top + rect.height - 10 }
        ];
        
        points.forEach((point, index) => {
          const element = document.elementFromPoint(point.x, point.y);
          if (element) {
            elementsAtPoint.push({
              point: `${index + 1}`,
              x: point.x,
              y: point.y,
              tagName: element.tagName,
              id: element.id,
              className: element.className,
              isContainer: element === container,
              isChildOfContainer: container.contains(element)
            });
          }
        });
        
        return {
          containerRect: { ...rect },
          centerPoint: { x: centerX, y: centerY },
          elementAtCenter: elementAtCenter ? {
            tagName: elementAtCenter.tagName,
            id: elementAtCenter.id,
            className: elementAtCenter.className,
            isContainer: elementAtCenter === container
          } : null,
          elementsAtPoints: elementsAtPoint
        };
      });
      
      console.log('🎯 Overlay Analysis:', JSON.stringify(overlayAnalysis, null, 2));
      
      // Take screenshot for visual debugging
      await page.screenshot({ path: 'container-visibility-debug.png' });
      console.log('📸 Screenshot saved: container-visibility-debug.png');
      
    } else {
      console.log('❌ Start button not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'container-visibility-error.png' });
  }
  
  console.log('⏳ Keeping browser open for manual inspection...');
  await page.waitForTimeout(10000);  
  await browser.close();
})();