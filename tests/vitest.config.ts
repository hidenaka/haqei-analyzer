import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      thresholds: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      },
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/**',
        'public/js/legacy/**',
        'public/assets/**'
      ]
    },
    include: [
      'tests/unit/**/*.{test,spec}.{js,ts}',
      'public/js/**/*.{test,spec}.{js,ts}'
    ],
    exclude: [
      'node_modules/',
      'dist/',
      'public/assets/',
      'public/dict/',
      '**/*.legacy.*'
    ],
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    isolate: true,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 1,
        maxThreads: 4
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      '@public': resolve(__dirname, '../public'),
      '@tests': resolve(__dirname, '../tests'),
      '@core': resolve(__dirname, '../public/js/core'),
      '@components': resolve(__dirname, '../public/js/components'),
      '@utils': resolve(__dirname, '../public/js/utils')
    }
  }
})