module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-unused-vars': 'off',
    'no-undef': 'off'
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'public/',
    '*.config.js',
    '*.config.ts',
    'haqei-vue/',
    '.tsbuildinfo',
    'coverage/',
    'playwright-report/',
    'test-results/',
    '**/*.min.js',
    '**/*.bundle.js'
  ]
};