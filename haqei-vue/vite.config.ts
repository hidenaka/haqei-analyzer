import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue({
    // Vue3パフォーマンス最適化
    template: {
      compilerOptions: {
        // インラインイベントハンドラの最適化
        hoistStatic: true,
        // 定数の巻き上げ
        cacheHandlers: true
      }
    }
  })],
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
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    // 最適化設定
    target: 'es2015',
    cssTarget: 'chrome80',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      mangle: {
        safari10: true
      }
    },
    // バンドル分割最適化
    rollupOptions: {
      output: {
        manualChunks: {
          // ベンダーライブラリを分離
          vendor: ['vue', '@vue/runtime-dom'],
          // Vue RouterとPiniaを分離
          router: ['vue-router', 'pinia'],
          // Supabase関連を分離
          supabase: ['@supabase/supabase-js'],
          // Chart.js関連を分離
          charts: ['chart.js'],
          // ユーティリティライブラリを分離
          utils: ['date-fns', 'axios'],
          // PDFとCanvas関連を分離
          export: ['html2canvas', 'jspdf'],
          // データベース関連を分離
          database: ['dexie']
        },
        // ファイル名最適化
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.ts', '') : 'chunk';
          return `js/${facadeModuleId || 'chunk'}-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // 並列処理とキャッシュ最適化
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    // ソースマップ最適化
    sourcemap: false
  },
  optimizeDeps: {
    // 依存関係の事前バンドル
    include: [
      'vue',
      'vue-router',
      'pinia',
      '@supabase/supabase-js',
      'chart.js',
      'date-fns',
      'axios',
      'dexie'
    ],
    // 大きな依存関係は除外
    exclude: ['html2canvas', 'jspdf']
  },
  server: {
    port: 3000,
    host: true,
    open: true,
    // パフォーマンス最適化
    fs: {
      strict: true
    },
    // HTTP/2とキープアライブ
    middlewareMode: false
  },
  // 開発時パフォーマンス最適化
  define: {
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
  },
  // プレロード設定
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `/${filename}` }
      }
      return { relative: true }
    }
  }
})
