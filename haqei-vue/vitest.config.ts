import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    testTimeout: 30000, // CI環境でのタイムアウトを30秒に設定
    hookTimeout: 10000, // フック（setup/teardown）のタイムアウト
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
      ],
    },
    // CI環境での安定性向上
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: process.env.CI === 'true', // CI環境では単一プロセスで実行
      },
    },
    // CI環境では重いテストを除外
    exclude: process.env.CI === 'true' ? [
      '**/node_modules/**',
      '**/dist/**',
      '**/future-simulator-precision.test.ts',
      '**/future-simulator-comprehensive.test.ts',
      '**/integration-system-comprehensive.test.ts',
      '**/performance-benchmark.test.ts'
    ] : [
      '**/node_modules/**',
      '**/dist/**'
    ],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@views': resolve(__dirname, './src/views'),
      '@stores': resolve(__dirname, './src/stores'),
      '@composables': resolve(__dirname, './src/composables'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
      '@services': resolve(__dirname, './src/services'),
      '@styles': resolve(__dirname, './src/styles'),
    }
  },
})