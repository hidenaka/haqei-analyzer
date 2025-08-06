/**
 * HAQEI Analyzer Critical Error Check
 * Focused analysis on the most likely runtime issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CriticalErrorChecker {
  constructor() {
    this.criticalIssues = [];
    this.potentialErrors = [];
    this.browserIncompatibilities = [];
  }

  async runCriticalCheck() {
    console.log('🚨 HAQEI Analyzer - Critical Error Analysis\n');

    await this.checkMainApplicationFile();
    await this.checkUnifiedErrorHandler();
    await this.checkVirtualQuestionFlow();
    await this.checkDependencyChain();
    await this.checkQuestionData();
    await this.checkLocalStorageUsage();
    await this.checkWebComponentImplementation();

    this.generateCriticalReport();
  }

  async checkMainApplicationFile() {
    console.log('📱 Checking main application file (app.js)...');
    
    try {
      const appPath = path.join(__dirname, 'public', 'js', 'app.js');
      const content = fs.readFileSync(appPath, 'utf8');

      // Check for critical initialization issues
      if (!content.includes('document.addEventListener("DOMContentLoaded"')) {
        this.criticalIssues.push({
          type: 'MISSING_DOM_READY',
          file: 'app.js',
          message: 'No DOMContentLoaded event listener found',
          severity: 'HIGH'
        });
      }

      // Check for error handling in initialization
      if (!content.includes('try') || !content.includes('catch')) {
        this.potentialErrors.push({
          type: 'NO_INIT_ERROR_HANDLING',
          file: 'app.js',
          message: 'Initialization code lacks error handling',
          severity: 'MEDIUM'
        });
      }

      // Check for undefined variable usage
      const undefinedChecks = [
        'typeof window.WORLDVIEW_QUESTIONS',
        'typeof window.SCENARIO_QUESTIONS',
        'typeof window.BaseComponent',
        'typeof window.VirtualQuestionFlow'
      ];

      let hasUndefinedChecks = 0;
      for (const check of undefinedChecks) {
        if (content.includes(check)) {
          hasUndefinedChecks++;
        }
      }

      if (hasUndefinedChecks < 2) {
        this.potentialErrors.push({
          type: 'INSUFFICIENT_UNDEFINED_CHECKS',
          file: 'app.js',
          message: 'Insufficient checks for undefined global variables',
          severity: 'MEDIUM'
        });
      }

      console.log('✅ Main application file checked');

    } catch (error) {
      this.criticalIssues.push({
        type: 'FILE_READ_ERROR',
        file: 'app.js',
        message: `Cannot read app.js: ${error.message}`,
        severity: 'CRITICAL'
      });
    }
  }

  async checkUnifiedErrorHandler() {
    console.log('🛡️ Checking UnifiedErrorHandler...');
    
    try {
      const handlerPath = path.join(__dirname, 'public', 'js', 'core', 'UnifiedErrorHandler.js');
      const content = fs.readFileSync(handlerPath, 'utf8');

      // Check for global error handler setup
      if (!content.includes('window.addEventListener(\'error\'')) {
        this.criticalIssues.push({
          type: 'MISSING_GLOBAL_ERROR_HANDLER',
          file: 'UnifiedErrorHandler.js',
          message: 'No global error event listener',
          severity: 'HIGH'
        });
      }

      // Check for unhandled promise rejection handler
      if (!content.includes('unhandledrejection')) {
        this.criticalIssues.push({
          type: 'MISSING_PROMISE_REJECTION_HANDLER',
          file: 'UnifiedErrorHandler.js',
          message: 'No unhandled promise rejection listener',
          severity: 'HIGH'
        });
      }

      // Check for proper class export
      if (!content.includes('window.UnifiedErrorHandler = UnifiedErrorHandler')) {
        this.potentialErrors.push({
          type: 'MISSING_GLOBAL_EXPORT',
          file: 'UnifiedErrorHandler.js',
          message: 'Class not properly exported to global scope',
          severity: 'MEDIUM'
        });
      }

      console.log('✅ UnifiedErrorHandler checked');

    } catch (error) {
      this.criticalIssues.push({
        type: 'FILE_READ_ERROR',
        file: 'UnifiedErrorHandler.js',
        message: `Cannot read UnifiedErrorHandler.js: ${error.message}`,
        severity: 'CRITICAL'
      });
    }
  }

  async checkVirtualQuestionFlow() {
    console.log('📝 Checking VirtualQuestionFlow...');
    
    try {
      const flowPath = path.join(__dirname, 'public', 'js', 'os-analyzer', 'components', 'VirtualQuestionFlow.js');
      const content = fs.readFileSync(flowPath, 'utf8');

      // Check for BaseComponent dependency
      if (!content.includes('extends BaseComponent')) {
        this.criticalIssues.push({
          type: 'MISSING_BASE_CLASS',
          file: 'VirtualQuestionFlow.js',
          message: 'Does not extend BaseComponent',
          severity: 'HIGH'
        });
      }

      // Check for array initialization safety
      if (!content.includes('this.answers = []') || !content.includes('Array.isArray')) {
        this.potentialErrors.push({
          type: 'UNSAFE_ARRAY_INITIALIZATION',
          file: 'VirtualQuestionFlow.js',
          message: 'Potential array initialization issues',
          severity: 'MEDIUM'
        });
      }

      // Check for MutationObserver usage
      if (content.includes('MutationObserver') && !content.includes('observer.disconnect()')) {
        this.potentialErrors.push({
          type: 'MUTATION_OBSERVER_LEAK',
          file: 'VirtualQuestionFlow.js',
          message: 'MutationObserver may not be properly cleaned up',
          severity: 'MEDIUM'
        });
      }

      // Check for question display logic
      if (!content.includes('showCurrentQuestion')) {
        this.criticalIssues.push({
          type: 'MISSING_DISPLAY_METHOD',
          file: 'VirtualQuestionFlow.js',
          message: 'No showCurrentQuestion method found',
          severity: 'HIGH'
        });
      }

      console.log('✅ VirtualQuestionFlow checked');

    } catch (error) {
      this.criticalIssues.push({
        type: 'FILE_READ_ERROR',
        file: 'VirtualQuestionFlow.js',
        message: `Cannot read VirtualQuestionFlow.js: ${error.message}`,
        severity: 'CRITICAL'
      });
    }
  }

  async checkDependencyChain() {
    console.log('🔗 Checking dependency chain...');

    const criticalDependencies = [
      'public/js/shared/core/BaseComponent.js',
      'public/js/shared/data/questions.js',
      'public/js/os-analyzer/components/HaqeiQuestionElement.js'
    ];

    for (const depPath of criticalDependencies) {
      const fullPath = path.join(__dirname, depPath);
      if (!fs.existsSync(fullPath)) {
        this.criticalIssues.push({
          type: 'MISSING_CRITICAL_DEPENDENCY',
          file: depPath,
          message: `Critical dependency file not found: ${depPath}`,
          severity: 'CRITICAL'
        });
      }
    }

    console.log('✅ Dependency chain checked');
  }

  async checkQuestionData() {
    console.log('📚 Checking question data availability...');

    try {
      const questionsPath = path.join(__dirname, 'public', 'js', 'shared', 'data', 'questions.js');
      const content = fs.readFileSync(questionsPath, 'utf8');

      // Check for data structure
      if (!content.includes('WORLDVIEW_QUESTIONS') || !content.includes('SCENARIO_QUESTIONS')) {
        this.criticalIssues.push({
          type: 'MISSING_QUESTION_DATA',
          file: 'questions.js',
          message: 'Critical question data constants not found',
          severity: 'CRITICAL'
        });
      }

      // Check for global export
      if (!content.includes('window.WORLDVIEW_QUESTIONS') || !content.includes('window.SCENARIO_QUESTIONS')) {
        this.criticalIssues.push({
          type: 'QUESTION_DATA_NOT_GLOBAL',
          file: 'questions.js',
          message: 'Question data not exported to global scope',
          severity: 'HIGH'
        });
      }

      console.log('✅ Question data checked');

    } catch (error) {
      this.criticalIssues.push({
        type: 'FILE_READ_ERROR',
        file: 'questions.js',
        message: `Cannot read questions.js: ${error.message}`,
        severity: 'CRITICAL'
      });
    }
  }

  async checkLocalStorageUsage() {
    console.log('💾 Checking localStorage usage patterns...');

    const jsFiles = this.getAllJSFiles();
    let unsafeLocalStorageUsage = 0;

    for (const jsFile of jsFiles.slice(0, 10)) { // Check first 10 files
      try {
        const content = fs.readFileSync(jsFile, 'utf8');
        
        // Check for localStorage usage without try-catch
        const localStorageMatches = content.match(/localStorage\.(getItem|setItem|removeItem)/g) || [];
        const tryCatchBlocks = content.match(/try\s*{[^}]*localStorage[^}]*}\s*catch/g) || [];
        
        if (localStorageMatches.length > 0 && tryCatchBlocks.length === 0) {
          unsafeLocalStorageUsage++;
          
          if (jsFile.includes('StorageManager') || jsFile.includes('app.js')) {
            this.potentialErrors.push({
              type: 'UNSAFE_LOCALSTORAGE_USAGE',
              file: path.basename(jsFile),
              message: 'Critical localStorage usage without error handling',
              severity: 'HIGH'
            });
          }
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }

    if (unsafeLocalStorageUsage > 5) {
      this.potentialErrors.push({
        type: 'WIDESPREAD_UNSAFE_LOCALSTORAGE',
        file: 'multiple',
        message: `${unsafeLocalStorageUsage} files with unsafe localStorage usage`,
        severity: 'MEDIUM'
      });
    }

    console.log('✅ localStorage usage checked');
  }

  async checkWebComponentImplementation() {
    console.log('🧩 Checking Web Component implementation...');

    try {
      const componentPath = path.join(__dirname, 'public', 'js', 'os-analyzer', 'components', 'HaqeiQuestionElement.js');
      const content = fs.readFileSync(componentPath, 'utf8');

      // Check for proper Web Component structure
      if (!content.includes('customElements.define')) {
        this.criticalIssues.push({
          type: 'WEB_COMPONENT_NOT_DEFINED',
          file: 'HaqeiQuestionElement.js',
          message: 'Web Component not properly defined with customElements.define',
          severity: 'HIGH'
        });
      }

      // Check for Shadow DOM usage
      if (!content.includes('attachShadow')) {
        this.potentialErrors.push({
          type: 'NO_SHADOW_DOM',
          file: 'HaqeiQuestionElement.js',
          message: 'Web Component does not use Shadow DOM',
          severity: 'LOW'
        });
      }

      // Check for lifecycle methods
      const lifecycleMethods = ['connectedCallback', 'disconnectedCallback'];
      for (const method of lifecycleMethods) {
        if (!content.includes(method)) {
          this.potentialErrors.push({
            type: 'MISSING_LIFECYCLE_METHOD',
            file: 'HaqeiQuestionElement.js',
            message: `Missing ${method} lifecycle method`,
            severity: 'LOW'
          });
        }
      }

      console.log('✅ Web Component implementation checked');

    } catch (error) {
      this.criticalIssues.push({
        type: 'FILE_READ_ERROR',
        file: 'HaqeiQuestionElement.js',
        message: `Cannot read HaqeiQuestionElement.js: ${error.message}`,
        severity: 'CRITICAL'
      });
    }
  }

  getAllJSFiles() {
    const jsFiles = [];
    const publicJsDir = path.join(__dirname, 'public', 'js');
    
    if (fs.existsSync(publicJsDir)) {
      const scanDirectory = (dir) => {
        try {
          const files = fs.readdirSync(dir);
          for (const file of files) {
            const filePath = path.join(dir, file);
            try {
              if (fs.statSync(filePath).isDirectory()) {
                scanDirectory(filePath);
              } else if (file.endsWith('.js')) {
                jsFiles.push(filePath);
              }
            } catch (error) {
              // Skip files/directories that can't be accessed
            }
          }
        } catch (error) {
          // Skip directories that can't be read
        }
      };
      
      scanDirectory(publicJsDir);
    }
    
    return jsFiles;
  }

  generateCriticalReport() {
    console.log('\n🚨 ========================================');
    console.log('🚨 CRITICAL ERROR ANALYSIS REPORT');
    console.log('🚨 ========================================\n');

    const totalIssues = this.criticalIssues.length + this.potentialErrors.length + this.browserIncompatibilities.length;

    console.log(`📊 CRITICAL ANALYSIS SUMMARY:`);
    console.log(`   🚨 Critical Issues: ${this.criticalIssues.length}`);
    console.log(`   ⚠️  Potential Errors: ${this.potentialErrors.length}`);
    console.log(`   🌐 Browser Incompatibilities: ${this.browserIncompatibilities.length}`);
    console.log(`   📈 Total Issues: ${totalIssues}\n`);

    // Critical Issues (Will cause runtime failures)
    if (this.criticalIssues.length > 0) {
      console.log('🚨 CRITICAL ISSUES (Will cause runtime failures):');
      this.criticalIssues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue.type}`);
        console.log(`      File: ${issue.file}`);
        console.log(`      Issue: ${issue.message}`);
        console.log(`      Severity: ${issue.severity}\n`);
      });
    }

    // Potential Errors (May cause issues under certain conditions)
    if (this.potentialErrors.length > 0) {
      console.log('⚠️  POTENTIAL ERRORS (May cause console errors):');
      this.potentialErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.type}`);
        console.log(`      File: ${error.file}`);
        console.log(`      Issue: ${error.message}`);
        console.log(`      Severity: ${error.severity}\n`);
      });
    }

    // Overall Assessment
    console.log('🎯 RUNTIME ERROR ASSESSMENT:');
    
    if (this.criticalIssues.length === 0) {
      console.log('   ✅ No critical runtime errors detected');
      console.log('   ✅ Application should load without fatal errors');
    } else {
      console.log(`   🚨 ${this.criticalIssues.length} critical issues will cause runtime failures`);
      console.log('   🚨 Application may not function properly');
    }

    if (this.potentialErrors.length > 0) {
      console.log(`   ⚠️  ${this.potentialErrors.length} potential issues may cause console warnings`);
    }

    console.log('\n💡 RECOMMENDATIONS FOR BROWSER TESTING:');
    console.log('   1. Open browser developer tools (F12)');
    console.log('   2. Navigate to Console tab');
    console.log('   3. Load http://localhost:8080/os_analyzer.html');
    console.log('   4. Watch for red error messages (JavaScript errors)');
    console.log('   5. Check Network tab for 404 errors (missing resources)');
    console.log('   6. Test question flow - click through 5-10 questions');
    console.log('   7. Monitor memory usage in Performance tab');

    if (this.criticalIssues.length === 0 && this.potentialErrors.length <= 3) {
      console.log('\n✅ OVERALL STATUS: GOOD - Should run with minimal console noise');
    } else if (this.criticalIssues.length === 0) {
      console.log('\n⚠️  OVERALL STATUS: FAIR - Will run but may have console warnings');
    } else {
      console.log('\n🚨 OVERALL STATUS: NEEDS IMMEDIATE ATTENTION - Critical fixes required');
    }

    console.log('\n🚨 ========================================\n');
  }
}

// Run the critical checker
const checker = new CriticalErrorChecker();
checker.runCriticalCheck().catch(error => {
  console.error('❌ Error running critical error checker:', error);
});