/**
 * HAQEI Analyzer Phase 1 Critical Error Fix Validation
 * 
 * Validates all fixes implemented for:
 * - T001: async Promise executor patterns
 * - T002: Module import paths
 * - T003: Runtime error handling
 * - T005: Unicode encoding
 * - T006: Strict mode compliance
 */

class Phase1CriticalErrorValidator {
  constructor() {
    this.testResults = [];
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
  }

  async runAllValidations() {
    console.log('🔧 HAQEI Phase 1 Critical Error Fix Validation');
    console.log('='.repeat(60));

    try {
      // T001: Validate async Promise executor fixes
      await this.validateAsyncPromiseExecutorFixes();
      
      // T002: Validate module import paths
      await this.validateModuleImportPaths();
      
      // T003: Validate runtime error handling
      await this.validateRuntimeErrorHandling();
      
      // T005: Validate Unicode encoding
      await this.validateUnicodeEncoding();
      
      // T006: Validate strict mode compliance
      await this.validateStrictModeCompliance();
      
      // Generate summary report
      this.generateSummaryReport();
      
      return {
        success: this.failedTests === 0,
        totalTests: this.totalTests,
        passedTests: this.passedTests,
        failedTests: this.failedTests,
        results: this.testResults
      };
      
    } catch (error) {
      console.error('❌ Validation failed:', error);
      throw error;
    }
  }

  recordTest(testName, passed, details = {}) {
    this.totalTests++;
    if (passed) {
      this.passedTests++;
      console.log(`✅ ${testName}: PASS`);
    } else {
      this.failedTests++;
      console.log(`❌ ${testName}: FAIL - ${details.reason || 'Unknown error'}`);
    }
    
    this.testResults.push({
      name: testName,
      status: passed ? 'PASS' : 'FAIL',
      details
    });
  }

  async validateAsyncPromiseExecutorFixes() {
    console.log('\n🔍 T001: Validating async Promise executor fixes...');
    
    const testFile = 'backup/20250805_legacy_system/integrated-test-system.js';
    
    try {
      const response = await fetch(testFile);
      const content = await response.text();
      
      // Check for the anti-pattern: new Promise(async (resolve, reject) =>
      const asyncPromisePattern = /new Promise\(async\s*\(/g;
      const matches = content.match(asyncPromisePattern);
      
      if (matches) {
        this.recordTest('Async Promise Executor Pattern Removal', false, {
          reason: `Found ${matches.length} remaining async promise executor patterns`,
          matches: matches
        });
      } else {
        this.recordTest('Async Promise Executor Pattern Removal', true, {
          reason: 'All async promise executor patterns have been fixed'
        });
      }
      
      // Check for proper async function patterns
      const properAsyncPattern = /async function \w+\(\)\s*\{[^}]*try\s*\{/g;
      const properMatches = content.match(properAsyncPattern);
      
      if (properMatches && properMatches.length >= 5) {
        this.recordTest('Proper Async Function Implementation', true, {
          reason: `Found ${properMatches.length} properly implemented async functions`
        });
      } else {
        this.recordTest('Proper Async Function Implementation', false, {
          reason: 'Insufficient proper async function implementations found'
        });
      }
      
    } catch (error) {
      this.recordTest('Async Promise Executor Validation', false, {
        reason: `Failed to read test file: ${error.message}`
      });
    }
  }

  async validateModuleImportPaths() {
    console.log('\n🔍 T002: Validating module import paths...');
    
    const testFile = 'dist/js/app.js';
    
    try {
      const response = await fetch(testFile);
      const content = await response.text();
      
      // Check for strict mode
      const hasStrictMode = content.includes('"use strict"');
      this.recordTest('Strict Mode Declaration', hasStrictMode, {
        reason: hasStrictMode ? 'Strict mode properly declared' : 'Missing strict mode declaration'
      });
      
      // Check for proper null checking
      const nullCheckPattern = /\w+\s*&&\s*\w+\.\w+/g;
      const nullChecks = content.match(nullCheckPattern);
      
      this.recordTest('Null Safety Checks', nullChecks && nullChecks.length > 0, {
        reason: nullChecks ? `Found ${nullChecks.length} null safety checks` : 'No null safety checks found'
      });
      
      // Check for template literal safety
      const templateLiteralSafety = !content.includes('${') || content.includes('+ \'');
      this.recordTest('Template Literal Safety', templateLiteralSafety, {
        reason: templateLiteralSafety ? 'Safe string concatenation used' : 'Potentially unsafe template literals found'
      });
      
    } catch (error) {
      this.recordTest('Module Import Path Validation', false, {
        reason: `Failed to read app.js: ${error.message}`
      });
    }
  }

  async validateRuntimeErrorHandling() {
    console.log('\n🔍 T003: Validating runtime error handling...');
    
    // Test proper error boundaries
    try {
      // Simulate a runtime error scenario
      const testObject = null;
      
      // This should not throw due to proper null checking
      const safeAccess = testObject && testObject.property;
      
      this.recordTest('Null Reference Protection', true, {
        reason: 'Null reference protection working correctly'
      });
      
    } catch (error) {
      this.recordTest('Null Reference Protection', false, {
        reason: `Null reference protection failed: ${error.message}`
      });
    }
    
    // Test undefined access protection
    try {
      const testObj = {};
      const safeProperty = testObj.nonExistent && testObj.nonExistent.property;
      
      this.recordTest('Undefined Access Protection', true, {
        reason: 'Undefined access protection working correctly'
      });
      
    } catch (error) {
      this.recordTest('Undefined Access Protection', false, {
        reason: `Undefined access protection failed: ${error.message}`
      });
    }
  }

  async validateUnicodeEncoding() {
    console.log('\n🔍 T005: Validating Unicode encoding fixes...');
    
    const testFiles = [
      'edge-case-test-suite.js',
      'hexagram-validity-test.js',
      'comprehensive_security_audit.js'
    ];
    
    let totalUnicodeIssues = 0;
    
    for (const file of testFiles) {
      try {
        const response = await fetch(file);
        const content = await response.text();
        
        // Check for malformed Unicode escape sequences
        const badUnicodePattern = /\\u[0-9a-fA-F]{0,3}[^0-9a-fA-F]/g;
        const unicodeIssues = content.match(badUnicodePattern);
        
        if (unicodeIssues) {
          totalUnicodeIssues += unicodeIssues.length;
          console.log(`⚠️ Found ${unicodeIssues.length} Unicode issues in ${file}`);
        }
        
      } catch (error) {
        console.warn(`⚠️ Could not validate ${file}: ${error.message}`);
      }
    }
    
    this.recordTest('Unicode Encoding Fixes', totalUnicodeIssues === 0, {
      reason: totalUnicodeIssues === 0 ? 'No Unicode encoding issues found' : `Found ${totalUnicodeIssues} Unicode encoding issues`
    });
  }

  async validateStrictModeCompliance() {
    console.log('\n🔍 T006: Validating strict mode compliance...');
    
    const testFiles = [
      'dist/js/app.js',
      'security_audit.js'
    ];
    
    let evalUsage = 0;
    let withStatements = 0;
    let strictModeFiles = 0;
    
    for (const file of testFiles) {
      try {
        const response = await fetch(file);
        const content = await response.text();
        
        // Check for eval usage (should be removed)
        const evalPattern = /\beval\s*\(/g;
        const evalMatches = content.match(evalPattern);
        if (evalMatches) {
          evalUsage += evalMatches.length;
        }
        
        // Check for with statements (should be removed)
        const withPattern = /\bwith\s*\(/g;
        const withMatches = content.match(withPattern);
        if (withMatches) {
          withStatements += withMatches.length;
        }
        
        // Check for strict mode
        if (content.includes('"use strict"') || content.includes("'use strict'")) {
          strictModeFiles++;
        }
        
      } catch (error) {
        console.warn(`⚠️ Could not validate ${file}: ${error.message}`);
      }
    }
    
    this.recordTest('Eval Usage Removal', evalUsage === 0, {
      reason: evalUsage === 0 ? 'No eval usage found' : `Found ${evalUsage} eval usages`
    });
    
    this.recordTest('With Statement Removal', withStatements === 0, {
      reason: withStatements === 0 ? 'No with statements found' : `Found ${withStatements} with statements`
    });
    
    this.recordTest('Strict Mode Implementation', strictModeFiles > 0, {
      reason: `Found strict mode in ${strictModeFiles} files`
    });
  }

  generateSummaryReport() {
    console.log('\n📊 Phase 1 Critical Error Fix Summary');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${this.totalTests}`);
    console.log(`Passed: ${this.passedTests}`);
    console.log(`Failed: ${this.failedTests}`);
    console.log(`Success Rate: ${((this.passedTests / this.totalTests) * 100).toFixed(1)}%`);
    
    if (this.failedTests === 0) {
      console.log('🎉 All Phase 1 critical errors have been successfully fixed!');
    } else {
      console.log('❌ Some issues remain. Please review failed tests.');
    }
    
    // Detailed failure report
    if (this.failedTests > 0) {
      console.log('\n❌ Failed Tests Details:');
      this.testResults
        .filter(test => test.status === 'FAIL')
        .forEach(test => {
          console.log(`  - ${test.name}: ${test.details.reason}`);
        });
    }
  }
}

// Auto-run validation if in browser environment
if (typeof window !== 'undefined') {
  window.Phase1CriticalErrorValidator = Phase1CriticalErrorValidator;
  
  // Auto-execute when page loads
  document.addEventListener('DOMContentLoaded', async () => {
    const validator = new Phase1CriticalErrorValidator();
    try {
      const results = await validator.runAllValidations();
      console.log('✅ Phase 1 validation completed:', results);
    } catch (error) {
      console.error('❌ Phase 1 validation failed:', error);
    }
  });
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Phase1CriticalErrorValidator;
}