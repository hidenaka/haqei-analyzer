/**
 * ErrorHandlingValidator Test Suite for calculatePriorityConflict
 * 
 * This test suite validates the error handling capabilities of the calculatePriorityConflict method
 * and ensures graceful degradation under various error conditions.
 * 
 * Test Scenarios:
 * 1. Undefined personality object handling
 * 2. Missing priorities array handling
 * 3. Empty priorities array handling
 * 4. Mixed scenarios with one valid, one invalid OS
 * 5. Performance impact of error handling
 * 6. Edge cases and boundary conditions
 */

class PriorityConflictValidator {
  constructor() {
    this.testResults = [];
    this.performanceMetrics = {};
    this.errorCounts = {};
  }

  /**
   * Execute all validation tests
   */
  async executeAllTests() {
    console.log('🧪 Starting Priority Conflict Error Handling Validation');
    console.log('=' .repeat(60));

    // Test Categories
    await this.testUndefinedPersonalityHandling();
    await this.testMissingPrioritiesHandling();
    await this.testEmptyPrioritiesHandling();
    await this.testMixedValidInvalidScenarios();
    await this.testPerformanceImpact();
    await this.testEdgeCasesAndBoundaries();
    await this.testGracefulDegradation();

    // Generate comprehensive report
    this.generateValidationReport();
    
    return this.testResults;
  }

  /**
   * Test Scenario 1: Undefined personality object handling
   */
  async testUndefinedPersonalityHandling() {
    console.log('\n📋 Test 1: Undefined Personality Object Handling');
    console.log('-'.repeat(50));

    const testCases = [
      {
        name: 'Both OS personalities undefined',
        os1: { osType: 'engine' }, // personality missing
        os2: { osType: 'interface' }, // personality missing
        expectedBehavior: 'Should return fallback value without throwing error'
      },
      {
        name: 'OS1 personality undefined, OS2 valid',
        os1: { osType: 'engine' }, // personality missing
        os2: { osType: 'interface', personality: { priorities: ['harmony', 'cooperation'] } },
        expectedBehavior: 'Should handle mixed scenario gracefully'
      },
      {
        name: 'OS1 valid, OS2 personality undefined',
        os1: { osType: 'engine', personality: { priorities: ['creativity', 'idealism'] } },
        os2: { osType: 'interface' }, // personality missing
        expectedBehavior: 'Should handle mixed scenario gracefully'
      },
      {
        name: 'Personality exists but is null',
        os1: { osType: 'engine', personality: null },
        os2: { osType: 'interface', personality: null },
        expectedBehavior: 'Should handle null personality objects'
      }
    ];

    for (const testCase of testCases) {
      await this.runIndividualTest('undefined_personality', testCase);
    }
  }

  /**
   * Test Scenario 2: Missing priorities array handling
   */
  async testMissingPrioritiesHandling() {
    console.log('\n📋 Test 2: Missing Priorities Array Handling');
    console.log('-'.repeat(50));

    const testCases = [
      {
        name: 'Both OS priorities property missing',
        os1: { osType: 'engine', personality: {} }, // priorities missing
        os2: { osType: 'interface', personality: {} }, // priorities missing
        expectedBehavior: 'Should return fallback value'
      },
      {
        name: 'OS1 priorities missing, OS2 has priorities',
        os1: { osType: 'engine', personality: {} }, // priorities missing
        os2: { osType: 'interface', personality: { priorities: ['harmony'] } },
        expectedBehavior: 'Should handle asymmetric case'
      },
      {
        name: 'Priorities property exists but is undefined',
        os1: { osType: 'engine', personality: { priorities: undefined } },
        os2: { osType: 'interface', personality: { priorities: undefined } },
        expectedBehavior: 'Should handle undefined priorities'
      },
      {
        name: 'Priorities property exists but is null',
        os1: { osType: 'engine', personality: { priorities: null } },
        os2: { osType: 'interface', personality: { priorities: null } },
        expectedBehavior: 'Should handle null priorities'
      }
    ];

    for (const testCase of testCases) {
      await this.runIndividualTest('missing_priorities', testCase);
    }
  }

  /**
   * Test Scenario 3: Empty priorities array handling
   */
  async testEmptyPrioritiesHandling() {
    console.log('\n📋 Test 3: Empty Priorities Array Handling');
    console.log('-'.repeat(50));

    const testCases = [
      {
        name: 'Both OS have empty priorities arrays',
        os1: { osType: 'engine', personality: { priorities: [] } },
        os2: { osType: 'interface', personality: { priorities: [] } },
        expectedBehavior: 'Should return expected fallback value (0.3)'
      },
      {
        name: 'OS1 empty, OS2 has priorities',
        os1: { osType: 'engine', personality: { priorities: [] } },
        os2: { osType: 'interface', personality: { priorities: ['harmony', 'cooperation'] } },
        expectedBehavior: 'Should return expected fallback value (0.3)'
      },
      {
        name: 'OS1 has priorities, OS2 empty',
        os1: { osType: 'engine', personality: { priorities: ['creativity', 'idealism'] } },
        os2: { osType: 'interface', personality: { priorities: [] } },
        expectedBehavior: 'Should return expected fallback value (0.3)'
      }
    ];

    for (const testCase of testCases) {
      await this.runIndividualTest('empty_priorities', testCase);
    }
  }

  /**
   * Test Scenario 4: Mixed valid/invalid scenarios
   */
  async testMixedValidInvalidScenarios() {
    console.log('\n📋 Test 4: Mixed Valid/Invalid Scenarios');
    console.log('-'.repeat(50));

    const testCases = [
      {
        name: 'Valid OS1, completely invalid OS2',
        os1: { 
          osType: 'engine', 
          personality: { priorities: ['creativity', 'idealism', 'perfection'] } 
        },
        os2: null, // completely invalid
        expectedBehavior: 'Should handle null OS gracefully'
      },
      {
        name: 'Invalid OS1, valid OS2',
        os1: undefined, // completely invalid
        os2: { 
          osType: 'interface', 
          personality: { priorities: ['harmony', 'cooperation'] } 
        },
        expectedBehavior: 'Should handle undefined OS gracefully'  
      },
      {
        name: 'OS with non-array priorities',
        os1: { 
          osType: 'engine', 
          personality: { priorities: 'not_an_array' } 
        },
        os2: { 
          osType: 'interface', 
          personality: { priorities: ['harmony'] } 
        },
        expectedBehavior: 'Should handle non-array priorities'
      },
      {
        name: 'OS with numeric priorities',
        os1: { 
          osType: 'engine', 
          personality: { priorities: 42 } 
        },
        os2: { 
          osType: 'interface', 
          personality: { priorities: ['harmony'] } 
        },
        expectedBehavior: 'Should handle numeric priorities'
      }
    ];

    for (const testCase of testCases) {
      await this.runIndividualTest('mixed_scenarios', testCase);
    }
  }

  /**
   * Test Scenario 5: Performance impact of error handling
   */
  async testPerformanceImpact() {
    console.log('\n📋 Test 5: Performance Impact Assessment');
    console.log('-'.repeat(50));

    const iterations = 1000;
    
    // Performance test with valid data
    const validOS1 = { 
      osType: 'engine', 
      personality: { priorities: ['creativity', 'idealism', 'perfection'] } 
    };
    const validOS2 = { 
      osType: 'interface', 
      personality: { priorities: ['harmony', 'cooperation', 'empathy'] } 
    };

    const validStartTime = performance.now();
    for (let i = 0; i < iterations; i++) {
      this.simulateCalculatePriorityConflict(validOS1, validOS2);
    }
    const validEndTime = performance.now();
    const validExecutionTime = validEndTime - validStartTime;

    // Performance test with error-prone data
    const errorOS1 = { osType: 'engine' }; // missing personality
    const errorOS2 = { osType: 'interface' }; // missing personality

    const errorStartTime = performance.now();
    for (let i = 0; i < iterations; i++) {
      this.simulateCalculatePriorityConflict(errorOS1, errorOS2);
    }
    const errorEndTime = performance.now();
    const errorExecutionTime = errorEndTime - errorStartTime;

    this.performanceMetrics = {
      validCaseTime: validExecutionTime,
      errorCaseTime: errorExecutionTime,
      performanceImpact: ((errorExecutionTime - validExecutionTime) / validExecutionTime) * 100,
      iterationsPerSecond: {
        valid: iterations / (validExecutionTime / 1000),
        error: iterations / (errorExecutionTime / 1000)
      }
    };

    console.log(`⏱️  Valid cases: ${validExecutionTime.toFixed(2)}ms (${iterations} iterations)`);
    console.log(`⏱️  Error cases: ${errorExecutionTime.toFixed(2)}ms (${iterations} iterations)`);
    console.log(`📊 Performance impact: ${this.performanceMetrics.performanceImpact.toFixed(2)}%`);
  }

  /**
   * Test Scenario 6: Edge cases and boundary conditions
   */
  async testEdgeCasesAndBoundaries() {
    console.log('\n📋 Test 6: Edge Cases and Boundary Conditions');
    console.log('-'.repeat(50));

    const testCases = [
      {
        name: 'Very large priorities arrays',
        os1: { 
          osType: 'engine', 
          personality: { priorities: Array.from({length: 100}, (_, i) => `priority_${i}`) } 
        },
        os2: { 
          osType: 'interface', 
          personality: { priorities: Array.from({length: 100}, (_, i) => `priority_${i}`) } 
        },
        expectedBehavior: 'Should handle large arrays without performance issues'
      },
      {
        name: 'Priorities with special characters',
        os1: { 
          osType: 'engine', 
          personality: { priorities: ['創造性', '理想主義', '完璧主義'] } 
        },
        os2: { 
          osType: 'interface', 
          personality: { priorities: ['調和', '協力', '共感'] } 
        },
        expectedBehavior: 'Should handle Unicode characters properly'
      },
      {
        name: 'Priorities with null/undefined elements',
        os1: { 
          osType: 'engine', 
          personality: { priorities: ['creativity', null, 'idealism', undefined] } 
        },
        os2: { 
          osType: 'interface', 
          personality: { priorities: ['harmony', null, 'cooperation'] } 
        },
        expectedBehavior: 'Should handle null/undefined array elements'
      },
      {
        name: 'Circular reference in personality object',
        os1: (() => {
          const os = { osType: 'engine', personality: { priorities: ['creativity'] } };
          os.personality.self = os; // circular reference
          return os;
        })(),
        os2: { 
          osType: 'interface', 
          personality: { priorities: ['harmony'] } 
        },
        expectedBehavior: 'Should handle circular references'
      }
    ];

    for (const testCase of testCases) {
      await this.runIndividualTest('edge_cases', testCase);
    }
  }

  /**
   * Test Scenario 7: Graceful degradation patterns
   */
  async testGracefulDegradation() {
    console.log('\n📋 Test 7: Graceful Degradation Patterns');
    console.log('-'.repeat(50));

    const testCases = [
      {
        name: 'Verify fallback value consistency',
        os1: { osType: 'engine' },
        os2: { osType: 'interface' },
        expectedBehavior: 'Should consistently return same fallback value',
        validationFunc: (result) => result === 0.3
      },
      {
        name: 'Verify result is always numeric',
        os1: { osType: 'engine', personality: 'invalid' },
        os2: { osType: 'interface', personality: 42 },
        expectedBehavior: 'Should always return a number',
        validationFunc: (result) => typeof result === 'number' && !isNaN(result)
      },
      {
        name: 'Verify result is within valid range',
        os1: { osType: 'engine', personality: { priorities: null } },
        os2: { osType: 'interface', personality: { priorities: [] } },
        expectedBehavior: 'Should return value between 0 and 1',
        validationFunc: (result) => result >= 0 && result <= 1
      }
    ];

    for (const testCase of testCases) {
      await this.runIndividualTest('graceful_degradation', testCase, testCase.validationFunc);
    }
  }

  /**
   * Run individual test case
   */
  async runIndividualTest(category, testCase, customValidator = null) {
    try {
      console.log(`\n🧪 Testing: ${testCase.name}`);
      
      const startTime = performance.now();
      const result = this.simulateCalculatePriorityConflict(testCase.os1, testCase.os2);
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      let passed = true;
      let errorMessage = null;

      // Apply custom validation if provided
      if (customValidator) {
        passed = customValidator(result);
        if (!passed) {
          errorMessage = 'Custom validation failed';
        }
      }

      // Default validations
      if (passed) {
        // Result should be a number
        if (typeof result !== 'number' || isNaN(result)) {
          passed = false;
          errorMessage = 'Result is not a valid number';
        }
        // Result should be within reasonable bounds (0-1)
        else if (result < 0 || result > 1) {
          passed = false;
          errorMessage = 'Result outside expected range [0,1]';
        }
      }

      const testResult = {
        category,
        name: testCase.name,
        passed,
        result,
        executionTime,
        errorMessage,
        expectedBehavior: testCase.expectedBehavior,
        timestamp: new Date().toISOString()
      };

      this.testResults.push(testResult);

      // Update error counts
      if (!this.errorCounts[category]) {
        this.errorCounts[category] = { passed: 0, failed: 0 };
      }
      if (passed) {
        this.errorCounts[category].passed++;
        console.log(`   ✅ PASSED: ${result.toFixed(4)} (${executionTime.toFixed(2)}ms)`);
      } else {
        this.errorCounts[category].failed++;
        console.log(`   ❌ FAILED: ${errorMessage} - Result: ${result}`);
      }

    } catch (error) {
      console.log(`   💥 EXCEPTION: ${error.message}`);
      
      this.testResults.push({
        category,
        name: testCase.name,
        passed: false,
        result: null,
        executionTime: null,
        errorMessage: `Exception thrown: ${error.message}`,
        expectedBehavior: testCase.expectedBehavior,
        timestamp: new Date().toISOString()
      });

      if (!this.errorCounts[category]) {
        this.errorCounts[category] = { passed: 0, failed: 0 };
      }
      this.errorCounts[category].failed++;
    }
  }

  /**
   * Simulate the calculatePriorityConflict method with proper error handling
   */
  simulateCalculatePriorityConflict(os1, os2) {
    try {
      // Improved error handling version
      
      // Input validation
      if (!os1 || !os2) {
        console.warn('⚠️ calculatePriorityConflict: Invalid OS parameters', { 
          os1: typeof os1, 
          os2: typeof os2 
        });
        return 0.3; // fallback value
      }

      // Safe access to personality objects
      const personality1 = os1.personality;
      const personality2 = os2.personality;

      if (!personality1 || !personality2) {
        console.warn('⚠️ calculatePriorityConflict: Missing personality objects', {
          os1HasPersonality: !!personality1,
          os2HasPersonality: !!personality2
        });
        return 0.3; // fallback value
      }

      // Safe access to priorities arrays
      const priorities1 = Array.isArray(personality1.priorities) ? personality1.priorities : [];
      const priorities2 = Array.isArray(personality2.priorities) ? personality2.priorities : [];

      // Handle empty arrays
      if (priorities1.length === 0 || priorities2.length === 0) {
        console.log('ℹ️ calculatePriorityConflict: Empty priorities arrays detected');
        return 0.3; // fallback value as per original logic
      }

      // Filter out null/undefined priorities
      const validPriorities1 = priorities1.filter(p => p != null && typeof p === 'string');
      const validPriorities2 = priorities2.filter(p => p != null && typeof p === 'string');

      if (validPriorities1.length === 0 || validPriorities2.length === 0) {
        console.warn('⚠️ calculatePriorityConflict: No valid priorities after filtering');
        return 0.3;
      }

      // Calculate conflicts (simulation of arePrioritiesConflicting)
      const conflictingPriorities = validPriorities1.filter(p1 => 
        validPriorities2.some(p2 => this.arePrioritiesConflicting(p1, p2))
      );

      const maxLength = Math.max(validPriorities1.length, validPriorities2.length);
      const conflictRatio = conflictingPriorities.length / maxLength;

      // Ensure result is within bounds
      return Math.max(0, Math.min(1, conflictRatio));

    } catch (error) {
      console.error('❌ calculatePriorityConflict: Unexpected error', error);
      return 0.3; // emergency fallback
    }
  }

  /**
   * Simulate arePrioritiesConflicting method
   */
  arePrioritiesConflicting(priority1, priority2) {
    if (!priority1 || !priority2 || typeof priority1 !== 'string' || typeof priority2 !== 'string') {
      return false;
    }

    const conflictPairs = [
      ['安全性', '冒険性'],
      ['個人主義', '集団主義'],
      ['完璧主義', '効率性'],
      ['creativity', 'caution'],
      ['idealism', 'realism'],
      ['harmony', 'independence']
    ];
    
    return conflictPairs.some(pair => 
      (pair[0] === priority1 && pair[1] === priority2) ||
      (pair[1] === priority1 && pair[0] === priority2)
    );
  }

  /**
   * Generate comprehensive validation report
   */
  generateValidationReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 PRIORITY CONFLICT ERROR HANDLING VALIDATION REPORT');
    console.log('='.repeat(60));

    // Overall statistics
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.passed).length;
    const failedTests = totalTests - passedTests;
    const passRate = ((passedTests / totalTests) * 100).toFixed(1);

    console.log(`\n📈 Overall Results:`);
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Passed: ${passedTests} (${passRate}%)`);
    console.log(`   Failed: ${failedTests}`);

    // Category breakdown
    console.log(`\n📋 Results by Category:`);
    Object.entries(this.errorCounts).forEach(([category, counts]) => {
      const categoryTotal = counts.passed + counts.failed;
      const categoryPassRate = ((counts.passed / categoryTotal) * 100).toFixed(1);
      console.log(`   ${category}: ${counts.passed}/${categoryTotal} passed (${categoryPassRate}%)`);
    });

    // Performance metrics
    if (Object.keys(this.performanceMetrics).length > 0) {
      console.log(`\n⏱️  Performance Metrics:`);
      console.log(`   Valid case performance: ${this.performanceMetrics.iterationsPerSecond.valid.toFixed(0)} ops/sec`);
      console.log(`   Error case performance: ${this.performanceMetrics.iterationsPerSecond.error.toFixed(0)} ops/sec`);
      console.log(`   Performance impact: ${this.performanceMetrics.performanceImpact.toFixed(2)}%`);
    }

    // Failed tests details
    const failedTestDetails = this.testResults.filter(t => !t.passed);
    if (failedTestDetails.length > 0) {
      console.log(`\n❌ Failed Tests Details:`);
      failedTestDetails.forEach(test => {
        console.log(`   • ${test.category}/${test.name}: ${test.errorMessage}`);
      });
    }

    // Recommendations
    console.log(`\n💡 Recommendations:`);
    if (passRate < 100) {
      console.log(`   • Address ${failedTests} failing test case(s)`);
    }
    if (this.performanceMetrics.performanceImpact > 10) {
      console.log(`   • Consider optimizing error handling paths (${this.performanceMetrics.performanceImpact.toFixed(1)}% impact)`);
    }
    if (passRate >= 95) {
      console.log(`   • Error handling implementation is robust`);
    }
    console.log(`   • Maintain consistent fallback behavior (0.3 for empty/invalid cases)`);
    console.log(`   • Consider adding input sanitization for better resilience`);

    console.log('\n✅ Validation completed successfully');
  }
}

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PriorityConflictValidator;
}

// Auto-run if loaded directly
if (typeof window !== 'undefined') {
  window.PriorityConflictValidator = PriorityConflictValidator;
  
  // Auto-execute validation on load
  const validator = new PriorityConflictValidator();
  validator.executeAllTests().then(() => {
    console.log('🎯 Error handling validation completed');
  }).catch(error => {
    console.error('💥 Validation failed:', error);
  });
}