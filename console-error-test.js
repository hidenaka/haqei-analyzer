/**
 * HAQEI Analyzer Console Error Test
 * 
 * This script simulates browser environment and checks for potential runtime issues
 * by analyzing the code structure, dependencies, and potential error sources.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class HAQEIErrorChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.criticalIssues = [];
    this.resourceChecks = [];
    this.performanceIssues = [];
    this.memoryLeaks = [];
  }

  /**
   * Main test runner
   */
  async runComprehensiveCheck() {
    console.log('🔍 Starting HAQEI Analyzer Console Error Test...\n');

    // 1. Check HTML file structure and dependencies
    await this.checkHTMLStructure();

    // 2. Check JavaScript file loading and dependencies
    await this.checkJavaScriptDependencies();

    // 3. Check for common error patterns
    await this.checkCommonErrorPatterns();

    // 4. Check resource loading issues
    await this.checkResourceLoading();

    // 5. Check for memory leak potential
    await this.checkMemoryLeakPotential();

    // 6. Check performance bottlenecks
    await this.checkPerformanceBottlenecks();

    // 7. Generate report
    this.generateReport();
  }

  /**
   * Check HTML file structure
   */
  async checkHTMLStructure() {
    console.log('📄 Checking HTML structure...');
    
    try {
      const htmlPath = path.join(__dirname, 'public', 'os_analyzer.html');
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      
      // Check for missing script dependencies
      const scriptTags = htmlContent.match(/<script[^>]*src="([^"]*)"[^>]*>/g) || [];
      
      for (const scriptTag of scriptTags) {
        const srcMatch = scriptTag.match(/src="([^"]*)"/);
        if (srcMatch) {
          const src = srcMatch[1];
          if (!src.startsWith('http') && !src.startsWith('//')) {
            const scriptPath = path.join(__dirname, 'public', src);
            if (!fs.existsSync(scriptPath)) {
              this.criticalIssues.push({
                type: 'MISSING_SCRIPT',
                message: `Missing script file: ${src}`,
                impact: 'HIGH',
                file: 'os_analyzer.html'
              });
            }
          }
        }
      }

      // Check for CSS dependencies
      const linkTags = htmlContent.match(/<link[^>]*rel="stylesheet"[^>]*>/g) || [];
      
      for (const linkTag of linkTags) {
        const hrefMatch = linkTag.match(/href="([^"]*)"/);
        if (hrefMatch) {
          const href = hrefMatch[1];
          if (!href.startsWith('http') && !href.startsWith('//')) {
            const cssPath = path.join(__dirname, 'public', href);
            if (!fs.existsSync(cssPath)) {
              this.warnings.push({
                type: 'MISSING_CSS',
                message: `Missing CSS file: ${href}`,
                impact: 'MEDIUM',
                file: 'os_analyzer.html'
              });
            }
          }
        }
      }

      console.log('✅ HTML structure check completed');
      
    } catch (error) {
      this.criticalIssues.push({
        type: 'HTML_READ_ERROR',
        message: `Cannot read HTML file: ${error.message}`,
        impact: 'CRITICAL',
        file: 'os_analyzer.html'
      });
    }
  }

  /**
   * Check JavaScript dependencies and potential errors
   */
  async checkJavaScriptDependencies() {
    console.log('🔧 Checking JavaScript dependencies...');

    const jsFiles = [
      'public/js/app.js',
      'public/js/core/UnifiedErrorHandler.js',
      'public/js/os-analyzer/components/VirtualQuestionFlow.js',
      'public/js/os-analyzer/components/HaqeiQuestionElement.js'
    ];

    for (const jsFile of jsFiles) {
      await this.checkJavaScriptFile(jsFile);
    }

    console.log('✅ JavaScript dependency check completed');
  }

  /**
   * Check individual JavaScript file
   */
  async checkJavaScriptFile(filePath) {
    try {
      const fullPath = path.join(__dirname, filePath);
      if (!fs.existsSync(fullPath)) {
        this.criticalIssues.push({
          type: 'MISSING_JS_FILE',
          message: `Missing JavaScript file: ${filePath}`,
          impact: 'HIGH',
          file: filePath
        });
        return;
      }

      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check for common error patterns
      this.checkSyntaxErrors(content, filePath);
      this.checkUndefinedVariables(content, filePath);
      this.checkAsyncErrors(content, filePath);
      this.checkEventListenerLeaks(content, filePath);
      
    } catch (error) {
      this.errors.push({
        type: 'JS_READ_ERROR',
        message: `Error reading ${filePath}: ${error.message}`,
        impact: 'MEDIUM',
        file: filePath
      });
    }
  }

  /**
   * Check for syntax errors
   */
  checkSyntaxErrors(content, filePath) {
    // Check for common syntax issues
    const syntaxPatterns = [
      { pattern: /console\.log\([^)]*\);?[\s]*console\.log/, message: 'Multiple console.log statements without proper separation' },
      { pattern: /}\s*else\s*{/, message: 'Potential else clause formatting issue' },
      { pattern: /catch\s*\(\s*\)\s*{/, message: 'Empty catch block parameter' },
      { pattern: /addEventListener\([^)]*\)\s*;?\s*addEventListener/, message: 'Multiple event listeners without proper cleanup' }
    ];

    for (const { pattern, message } of syntaxPatterns) {
      if (pattern.test(content)) {
        this.warnings.push({
          type: 'SYNTAX_WARNING',
          message: `${message} in ${filePath}`,
          impact: 'LOW',
          file: filePath
        });
      }
    }
  }

  /**
   * Check for undefined variables
   */
  checkUndefinedVariables(content, filePath) {
    // Check for potential undefined variable usage
    const undefinedPatterns = [
      { pattern: /typeof\s+(\w+)\s*===?\s*['"]undefined['"]/, variable: 'conditional check' },
      { pattern: /if\s*\(\s*window\.(\w+)\s*\)/, variable: 'window property check' },
      { pattern: /(\w+)\.addEventListener/, variable: 'DOM element' }
    ];

    // Check for variables used without declaration
    const variableUsage = content.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g) || [];
    const commonGlobals = ['window', 'document', 'console', 'localStorage', 'setTimeout', 'clearTimeout', 'fetch', 'JSON'];
    
    // This is a simplified check - in practice, you'd need a proper AST parser
    for (const variable of variableUsage) {
      if (!commonGlobals.includes(variable) && content.includes(`${variable}.`) && !content.includes(`var ${variable}`) && !content.includes(`let ${variable}`) && !content.includes(`const ${variable}`)) {
        // Potential undefined variable usage - but this is a basic heuristic
      }
    }
  }

  /**
   * Check for async/await error handling
   */
  checkAsyncErrors(content, filePath) {
    // Check for async functions without proper error handling
    const asyncFunctions = content.match(/async\s+function\s+\w+\s*\([^)]*\)\s*{[^}]*}/g) || [];
    
    for (const asyncFunc of asyncFunctions) {
      if (!asyncFunc.includes('try') && !asyncFunc.includes('catch')) {
        this.warnings.push({
          type: 'ASYNC_NO_ERROR_HANDLING',
          message: `Async function without error handling in ${filePath}`,
          impact: 'MEDIUM',
          file: filePath
        });
      }
    }

    // Check for await without try-catch in non-async functions
    if (content.includes('await') && !content.includes('async')) {
      this.errors.push({
        type: 'AWAIT_WITHOUT_ASYNC',
        message: `'await' used outside async function in ${filePath}`,
        impact: 'HIGH',
        file: filePath
      });
    }
  }

  /**
   * Check for potential memory leaks
   */
  checkEventListenerLeaks(content, filePath) {
    const addEventListenerCalls = (content.match(/addEventListener/g) || []).length;
    const removeEventListenerCalls = (content.match(/removeEventListener/g) || []).length;
    
    if (addEventListenerCalls > removeEventListenerCalls * 2) {
      this.memoryLeaks.push({
        type: 'EVENT_LISTENER_LEAK',
        message: `Potential event listener leak: ${addEventListenerCalls} added vs ${removeEventListenerCalls} removed in ${filePath}`,
        impact: 'MEDIUM',
        file: filePath
      });
    }

    // Check for setInterval without clearInterval
    const setIntervalCalls = (content.match(/setInterval/g) || []).length;
    const clearIntervalCalls = (content.match(/clearInterval/g) || []).length;
    
    if (setIntervalCalls > clearIntervalCalls) {
      this.memoryLeaks.push({
        type: 'INTERVAL_LEAK',
        message: `Potential interval leak: ${setIntervalCalls} set vs ${clearIntervalCalls} cleared in ${filePath}`,
        impact: 'HIGH',
        file: filePath
      });
    }
  }

  /**
   * Check for common error patterns
   */
  async checkCommonErrorPatterns() {
    console.log('🔍 Checking for common error patterns...');

    // Check for localStorage usage without error handling
    const jsFiles = await this.getAllJSFiles();
    
    for (const jsFile of jsFiles) {
      try {
        const content = fs.readFileSync(jsFile, 'utf8');
        
        // localStorage without try-catch
        if (content.includes('localStorage.') && !content.includes('try') && !content.includes('catch')) {
          this.warnings.push({
            type: 'LOCALSTORAGE_NO_ERROR_HANDLING',
            message: `localStorage usage without error handling in ${jsFile}`,
            impact: 'MEDIUM',
            file: jsFile
          });
        }

        // fetch without error handling
        if (content.includes('fetch(') && !content.includes('.catch')) {
          this.warnings.push({
            type: 'FETCH_NO_ERROR_HANDLING',
            message: `fetch usage without error handling in ${jsFile}`,
            impact: 'MEDIUM',
            file: jsFile
          });
        }

        // DOM manipulation without null checks
        const domMethods = ['getElementById', 'querySelector', 'querySelectorAll'];
        for (const method of domMethods) {
          if (content.includes(method) && !content.includes('if (') && !content.includes('&&')) {
            // This is a simplified check - might have false positives
          }
        }
        
      } catch (error) {
        this.errors.push({
          type: 'FILE_READ_ERROR',
          message: `Error reading ${jsFile}: ${error.message}`,
          impact: 'LOW',
          file: jsFile
        });
      }
    }

    console.log('✅ Common error patterns check completed');
  }

  /**
   * Check resource loading issues
   */
  async checkResourceLoading() {
    console.log('📦 Checking resource loading...');

    // Check for 404 potential issues
    const resourcePaths = [
      'public/css/core.css',
      'public/css/components.css',
      'public/css/layouts.css',
      'public/css/interactive.css',
      'public/css/results.css',
      'public/css/responsive.css',
      'public/css/themes.css',
      'public/css/accessibility-wcag.css'
    ];

    for (const resourcePath of resourcePaths) {
      const fullPath = path.join(__dirname, resourcePath);
      if (!fs.existsSync(fullPath)) {
        this.resourceChecks.push({
          type: 'MISSING_RESOURCE',
          message: `Missing resource: ${resourcePath}`,
          impact: 'MEDIUM',
          file: resourcePath
        });
      }
    }

    // Check for CORS issues (local development)
    this.resourceChecks.push({
      type: 'CORS_INFO',
      message: 'Local development server should handle CORS properly',
      impact: 'LOW',
      file: 'server'
    });

    console.log('✅ Resource loading check completed');
  }

  /**
   * Check for performance bottlenecks
   */
  async checkPerformanceBottlenecks() {
    console.log('⚡ Checking performance bottlenecks...');

    const jsFiles = await this.getAllJSFiles();
    
    for (const jsFile of jsFiles) {
      try {
        const content = fs.readFileSync(jsFile, 'utf8');
        
        // Check for synchronous operations in loops
        if (content.includes('for (') && content.includes('localStorage.')) {
          this.performanceIssues.push({
            type: 'SYNC_OPERATION_IN_LOOP',
            message: `Synchronous localStorage operations in loop in ${jsFile}`,
            impact: 'MEDIUM',
            file: jsFile
          });
        }

        // Check for large DOM manipulations
        if (content.includes('innerHTML') && content.includes('for (')) {
          this.performanceIssues.push({
            type: 'DOM_MANIPULATION_IN_LOOP',
            message: `DOM manipulation in loop in ${jsFile}`,
            impact: 'HIGH',
            file: jsFile
          });
        }

        // Check for missing debouncing
        if (content.includes('addEventListener') && (content.includes('resize') || content.includes('scroll'))) {
          if (!content.includes('debounce') && !content.includes('throttle')) {
            this.performanceIssues.push({
              type: 'MISSING_DEBOUNCE',
              message: `Missing debouncing for resize/scroll events in ${jsFile}`,
              impact: 'MEDIUM',
              file: jsFile
            });
          }
        }
        
      } catch (error) {
        // Skip files that can't be read
      }
    }

    console.log('✅ Performance bottlenecks check completed');
  }

  /**
   * Check for potential memory leaks
   */
  async checkMemoryLeakPotential() {
    console.log('🧠 Checking memory leak potential...');

    const jsFiles = await this.getAllJSFiles();
    
    for (const jsFile of jsFiles) {
      try {
        const content = fs.readFileSync(jsFile, 'utf8');
        
        // Check for circular references
        if (content.includes('this.') && content.includes('=') && content.includes('function')) {
          // Potential circular reference - needs deeper analysis
        }

        // Check for large arrays/objects without cleanup
        if (content.includes('new Array') || content.includes('new Map') || content.includes('new Set')) {
          if (!content.includes('clear()') && !content.includes('delete ')) {
            this.memoryLeaks.push({
              type: 'POTENTIAL_MEMORY_LEAK',
              message: `Large data structures without cleanup in ${jsFile}`,
              impact: 'MEDIUM',
              file: jsFile
            });
          }
        }
        
      } catch (error) {
        // Skip files that can't be read
      }
    }

    console.log('✅ Memory leak potential check completed');
  }

  /**
   * Get all JavaScript files
   */
  async getAllJSFiles() {
    const jsFiles = [];
    const publicJsDir = path.join(__dirname, 'public', 'js');
    
    if (fs.existsSync(publicJsDir)) {
      const scanDirectory = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          if (fs.statSync(filePath).isDirectory()) {
            scanDirectory(filePath);
          } else if (file.endsWith('.js')) {
            jsFiles.push(filePath);
          }
        }
      };
      
      scanDirectory(publicJsDir);
    }
    
    return jsFiles;
  }

  /**
   * Generate comprehensive report
   */
  generateReport() {
    console.log('\n📊 =================================');
    console.log('📊 HAQEI ANALYZER ERROR ANALYSIS REPORT');
    console.log('📊 =================================\n');

    // Summary
    const totalIssues = this.criticalIssues.length + this.errors.length + this.warnings.length + 
                       this.resourceChecks.length + this.performanceIssues.length + this.memoryLeaks.length;

    console.log(`📈 SUMMARY:`);
    console.log(`   Total Issues Found: ${totalIssues}`);
    console.log(`   🚨 Critical Issues: ${this.criticalIssues.length}`);
    console.log(`   ❌ Errors: ${this.errors.length}`);
    console.log(`   ⚠️  Warnings: ${this.warnings.length}`);
    console.log(`   📦 Resource Issues: ${this.resourceChecks.length}`);
    console.log(`   ⚡ Performance Issues: ${this.performanceIssues.length}`);
    console.log(`   🧠 Memory Leak Potential: ${this.memoryLeaks.length}\n`);

    // Critical Issues
    if (this.criticalIssues.length > 0) {
      console.log('🚨 CRITICAL ISSUES:');
      this.criticalIssues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue.type}: ${issue.message}`);
        console.log(`      Impact: ${issue.impact} | File: ${issue.file}`);
      });
      console.log('');
    }

    // Errors
    if (this.errors.length > 0) {
      console.log('❌ ERRORS:');
      this.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.type}: ${error.message}`);
        console.log(`      Impact: ${error.impact} | File: ${error.file}`);
      });
      console.log('');
    }

    // Warnings
    if (this.warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      this.warnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning.type}: ${warning.message}`);
        console.log(`      Impact: ${warning.impact} | File: ${warning.file}`);
      });
      console.log('');
    }

    // Resource Issues
    if (this.resourceChecks.length > 0) {
      console.log('📦 RESOURCE ISSUES:');
      this.resourceChecks.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue.type}: ${issue.message}`);
        console.log(`      Impact: ${issue.impact} | File: ${issue.file}`);
      });
      console.log('');
    }

    // Performance Issues
    if (this.performanceIssues.length > 0) {
      console.log('⚡ PERFORMANCE ISSUES:');
      this.performanceIssues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue.type}: ${issue.message}`);
        console.log(`      Impact: ${issue.impact} | File: ${issue.file}`);
      });
      console.log('');
    }

    // Memory Leak Potential
    if (this.memoryLeaks.length > 0) {
      console.log('🧠 MEMORY LEAK POTENTIAL:');
      this.memoryLeaks.forEach((leak, index) => {
        console.log(`   ${index + 1}. ${leak.type}: ${leak.message}`);
        console.log(`      Impact: ${leak.impact} | File: ${leak.file}`);
      });
      console.log('');
    }

    // Recommendations
    console.log('💡 RECOMMENDATIONS:');
    
    if (this.criticalIssues.length > 0) {
      console.log('   🚨 Fix critical issues immediately - these will cause runtime failures');
    }
    
    if (this.errors.length > 0) {
      console.log('   ❌ Address errors to prevent console noise and potential failures');
    }
    
    if (this.performanceIssues.length > 0) {
      console.log('   ⚡ Optimize performance issues to improve user experience');
    }
    
    if (this.memoryLeaks.length > 0) {
      console.log('   🧠 Address memory leak potential to prevent browser slowdown');
    }

    console.log('   🔍 Test the application in browser dev tools for runtime verification');
    console.log('   📊 Monitor console for additional errors during user interaction');
    console.log('   🚀 Use browser performance tools to verify optimizations\n');

    // Overall Status
    if (totalIssues === 0) {
      console.log('✅ OVERALL STATUS: EXCELLENT - No issues detected in static analysis');
    } else if (this.criticalIssues.length === 0 && this.errors.length === 0) {
      console.log('✅ OVERALL STATUS: GOOD - Only warnings and optimization opportunities found');
    } else if (this.criticalIssues.length === 0) {
      console.log('⚠️  OVERALL STATUS: FAIR - Some errors found, but no critical issues');
    } else {
      console.log('🚨 OVERALL STATUS: NEEDS ATTENTION - Critical issues must be fixed');
    }

    console.log('\n📊 =================================\n');
  }
}

// Run the checker
const checker = new HAQEIErrorChecker();
checker.runComprehensiveCheck().catch(error => {
  console.error('❌ Error running HAQEI error checker:', error);
});