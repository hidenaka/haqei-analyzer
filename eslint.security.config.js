/**
 * ESLint Security Configuration for HAQEI Project
 * Enhanced security scanning with HaQei philosophy compliance
 */

import js from '@eslint/js'
import security from 'eslint-plugin-security'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        console: 'readonly',
        process: 'readonly'
      }
    },
    plugins: {
      security
    },
    rules: {
      // Security rules
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'error',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-non-literal-fs-filename': 'error',
      'security/detect-non-literal-regexp': 'error',
      'security/detect-non-literal-require': 'error',
      'security/detect-object-injection': 'error',
      'security/detect-possible-timing-attacks': 'error',
      'security/detect-pseudoRandomBytes': 'error',
      'security/detect-unsafe-regex': 'error',
      
      // Additional security considerations for I Ching data
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      
      // HaQei philosophy: Avoid single-identity assumptions
      'no-console': ['warn', { 
        allow: ['warn', 'error', 'info'] 
      }],
      
      // Performance and memory safety
      'no-global-assign': 'error',
      'no-implicit-globals': 'error',
      'no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }]
    }
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'public/dict/**',
      'public/assets/**',
      '*.config.js',
      '*.config.ts'
    ]
  }
]