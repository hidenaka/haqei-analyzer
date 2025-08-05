/**
 * Future Simulator Core Module
 * HAQEI Future Simulator - Core functionality
 */

console.log('🚀 Future Simulator Core Module loading...');

// 本番環境検出とパフォーマンス最適化
const isProductionEnvironment = () => {
  return location.hostname !== 'localhost' && 
         location.hostname !== '127.0.0.1' && 
         !location.hostname.includes('dev') &&
         location.protocol === 'https:';
};

// 本番環境警告の抑制（CDN関連）
if (isProductionEnvironment()) {
  // Console警告を静音化（本番環境では不要）
  const originalWarn = console.warn;
  console.warn = function(...args) {
    const message = args.join(' ');
    // Tailwind CDN警告や開発向け警告をフィルタリング
    if (message.includes('tailwindcss.com should not be used in production') ||
        message.includes('development') ||
        message.includes('CDN') ||
        message.includes('should not be used in production')) {
      return; // 本番環境では警告を非表示
    }
    originalWarn.apply(console, args);
  };

  // パフォーマンス最適化のためのプリロード指示
  const addPreloadHints = () => {
    const criticalResources = [
      './js/koudo_shishin_database.js',
      './js/ai_theme_database.js',
      './js/sns_worry_patterns.js',
      './js/keyword_expansion_engine.js',
      './js/ml-integration.js'
    ];
    
    criticalResources.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = src;
      document.head.appendChild(link);
    });
  };
  
  addPreloadHints();
  console.log('🚀 本番環境向け最適化が適用されました');
}

// Export for use in other modules
export { isProductionEnvironment };

console.log('✅ Future Simulator Core Module loaded');