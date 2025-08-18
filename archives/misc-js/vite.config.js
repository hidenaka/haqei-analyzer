import { defineConfig } from 'vite';

export default defineConfig({
  // 基本設定
  root: './public',
  base: './',
  publicDir: 'assets',
  
  // 開発サーバー設定
  server: {
    port: 8788,
    host: true,
    open: false,
    strictPort: true
  },

  // ビルド設定 - Bundle size削減最適化
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'es2020',
    
    // Bundle size削減のためのRollup設定
    rollupOptions: {
      // Manual chunksによる分割
      output: {
        manualChunks: {
          // Core HaQei Engine
          'core': [
            './js/app.js',
            './js/shared/core/BaseComponent.js',
            './js/shared/core/MicroStorageManager.js'
          ],
          
          // I Ching & Dictionary system
          'iching': [
            './js/data/hexagrams.js',
            './js/os-analyzer/core/PrecompiledQuestions.js',
            './js/core/DictionaryManager.js'
          ],
          
          // UI Components
          'ui': [
            './js/os-analyzer/components/WelcomeScreen.js',
            './js/os-analyzer/components/HaqeiQuestionElement.js',
            './js/os-analyzer/components/VirtualQuestionFlow.js'
          ],
          
          // Analysis Engine
          'analysis': [
            './js/os-analyzer/core/Engine.js',
            './js/os-analyzer/core/TripleOSAnalyzer.js',
            './js/os-analyzer/core/Calculator.js'
          ],
          
          // Future Simulator (大容量のため分離)
          'future-simulator': [
            './js/future-simulator-core.js',
            './js/future-simulator-ui-enhancements.js'
          ],
          
          // Security & Error Handling
          'security': [
            './js/security/CSRFProtectionSystem.js',
            './js/security/SecurityHeaderManager.js',
            './js/error-handler.js'
          ]
        },
        
        // ファイル名最適化
        chunkFileNames: 'chunks/[name]-[hash:8].js',
        entryFileNames: '[name]-[hash:8].js',
        assetFileNames: 'assets/[name]-[hash:8].[ext]'
      },
      
      // 外部依存関係の除外（もしある場合）
      external: []
    },
    
    // Terser最適化設定
    minify: 'terser',
    terserOptions: {
      compress: {
        // Console除去
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        
        // 最適化設定
        dead_code: true,
        unused: true,
        collapse_vars: true,
        reduce_vars: true,
        
        // IE対応不要のため積極的最適化
        ecma: 2020,
        module: true,
        toplevel: true
      },
      
      mangle: {
        toplevel: true,
        properties: false // プロパティ名変更は危険なため無効
      },
      
      format: {
        comments: false // コメント除去
      }
    },
    
    // チャンクサイズ警告閾値
    chunkSizeWarningLimit: 500, // 500KB
    
    // SourceMap設定（プロダクションでは無効化）
    sourcemap: false,
    
    // CSS設定
    cssTarget: 'chrome80',
    cssMinify: true,
    
    // その他最適化
    reportCompressedSize: true,
    assetsInlineLimit: 4096 // 4KB以下はinline化
  },

  // CSS前処理設定
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./css/variables.css";`
      }
    }
  },

  // プラグイン設定
  plugins: [],

  // 最適化設定
  optimizeDeps: {
    // 事前バンドル対象
    include: [],
    
    // 事前バンドル除外
    exclude: [
      // 大きな辞書ファイルは動的ロード
      './dict/base.dat.gz',
      './dict/check.dat.gz',
      './dict/tid.dat.gz'
    ]
  },

  // 実験的機能
  experimental: {
    renderBuiltUrl: (filename, { hostType }) => {
      if (hostType === 'js') {
        return { js: `'/${filename}'` };
      }
      return filename;
    }
  }
});