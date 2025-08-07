/**
 * Jest Configuration for HAQEI Future Simulator I Ching Integration
 * Following HaQei philosophy with multi-persona testing approaches
 */

module.exports = {
  displayName: 'HAQEI Future Simulator Tests',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  
  // Test file patterns
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.spec.js',
    '<rootDir>/public/js/**/*.test.js'
  ],
  
  // Module path mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@public/(.*)$': '<rootDir>/public/$1',
    '^@core/(.*)$': '<rootDir>/public/js/core/$1',
    '^@components/(.*)$': '<rootDir>/public/js/components/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  },
  
  // Coverage configuration - 90%+ requirement
  collectCoverageFrom: [
    'public/js/core/**/*.js',
    'public/js/components/**/*.js',
    'public/js/os-analyzer/**/*.js',
    'public/js/future-simulator/**/*.js',
    '!public/js/**/*.test.js',
    '!public/js/**/*.spec.js',
    '!public/js/legacy/**/*',
    '!public/assets/**/*'
  ],
  
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
    // Critical modules require higher coverage
    'public/js/core/H384_DATABASE.js': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    },
    'public/js/core/CacheManager.js': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageDirectory: '<rootDir>/coverage',
  
  // Performance testing - 2-second response requirement
  testTimeout: 10000,
  
  // Mock browser APIs
  setupFiles: ['<rootDir>/tests/browser-mocks.js'],
  
  // Transform configuration
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // Test environment setup
  testEnvironmentOptions: {
    url: 'http://localhost:8080'
  },
  
  // HaQei philosophy: Test multiple personas
  globals: {
    'BUNENJIN_TEST_PERSONAS': [
      'analytical_thinker',
      'intuitive_feeler', 
      'pragmatic_doer',
      'creative_explorer'
    ],
    'ICHING_VALIDATION_MODE': true,
    'PERFORMANCE_TARGET_MS': 2000
  },
  
  // Verbose reporting for transparency
  verbose: true,
  
  // Fail fast on coverage threshold violations
  coverageFailure: true,
  
  // Custom reporters for HaQei philosophy alignment
  reporters: [
    'default',
    ['<rootDir>/tests/reporters/HaQei-reporter.js', {
      outputFile: 'test-results/HaQei-philosophy-compliance.json'
    }],
    ['<rootDir>/tests/reporters/iching-authenticity-reporter.js', {
      outputFile: 'test-results/iching-authenticity-validation.json'  
    }]
  ]
}