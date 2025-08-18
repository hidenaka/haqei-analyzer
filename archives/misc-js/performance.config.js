// HAQEI Analyzer - Performance Optimization Configuration
// T15: Cloud deployment performance settings with HaQei philosophy

export const performanceConfig = {
  // Engine OS: Core performance requirements
  engine_os: {
    name: "Core Performance Layer",
    metrics: {
      // Core Web Vitals targets
      largest_contentful_paint: "< 1.1s",  // Already achieved
      first_input_delay: "< 100ms",
      cumulative_layout_shift: "< 0.1",
      first_contentful_paint: "< 0.8s"
    },
    
    caching_strategy: {
      html_files: {
        policy: "no-cache, no-store, must-revalidate",
        reason: "Dynamic content updates"
      },
      static_assets: {
        css: "public, max-age=31536000, immutable",
        js: "public, max-age=31536000, immutable", 
        images: "public, max-age=31536000, immutable",
        fonts: "public, max-age=31536000, immutable"
      },
      api_endpoints: {
        analytics: "no-cache",
        health: "no-cache",
        philosophy: "public, max-age=3600"
      }
    },

    compression: {
      enabled: true,
      algorithms: ["br", "gzip"],
      min_size: "1KB",
      file_types: [".html", ".css", ".js", ".json", ".xml", ".svg"]
    }
  },

  // Interface OS: User experience optimization
  interface_os: {
    name: "User Experience Layer",
    
    responsive_design: {
      breakpoints: {
        mobile: "375px",
        tablet: "768px", 
        desktop: "1280px"
      },
      image_optimization: {
        formats: ["webp", "avif", "jpg"],
        sizes: [400, 800, 1200],
        lazy_loading: true
      }
    },

    progressive_enhancement: {
      critical_css: true,
      async_js: true,
      prefetch_dns: [
        "fonts.googleapis.com",
        "cdnjs.cloudflare.com"
      ]
    },

    user_interaction: {
      click_delay_elimination: true,
      touch_optimization: true,
      keyboard_navigation: true
    }
  },

  // Safe Mode OS: Monitoring and fallbacks
  safe_mode_os: {
    name: "Monitoring and Reliability Layer",
    
    performance_monitoring: {
      real_user_monitoring: true,
      synthetic_monitoring: true,
      error_tracking: true,
      availability_monitoring: true
    },

    fallback_strategies: {
      offline_support: {
        enabled: true,
        cache_strategy: "cache-first",
        fallback_page: "/offline.html"
      },
      cdn_fallbacks: {
        primary: "Cloudflare",
        fallback: "jsDelivr"
      },
      graceful_degradation: true
    },

    security_performance: {
      content_security_policy: true,
      subresource_integrity: true,
      https_enforcement: true,
      security_headers: true
    }
  },

  // Cloud provider specific optimizations
  cloud_providers: {
    netlify: {
      asset_optimization: true,
      form_processing: false,
      edge_handlers: false,
      large_media: false
    },

    vercel: {
      edge_functions: true,
      image_optimization: false, // Static deployment
      serverless_functions: true,
      analytics: true
    },

    github_pages: {
      jekyll_processing: false,
      custom_domain: true,
      https_enforcement: true,
      subdirectory_support: false
    },

    cloudflare_pages: {
      workers_integration: true,
      analytics_engine: true,
      kv_storage: true,
      r2_storage: false
    }
  },

  // Deployment optimization settings
  deployment: {
    build_optimization: {
      minification: {
        html: false, // Already optimized manually
        css: false,  // Already optimized manually  
        js: false    // Already optimized manually
      },
      
      bundling: {
        strategy: "manual", // Self-contained approach
        code_splitting: false,
        tree_shaking: false
      },

      asset_pipeline: {
        fingerprinting: false, // Static files with version control
        compression: true,
        optimization: true
      }
    },

    edge_optimization: {
      global_cdn: true,
      edge_caching: true,
      regional_failover: true,
      load_balancing: false // Static content
    }
  }
};

// Performance budget definitions
export const performanceBudget = {
  // File size budgets (already achieved)
  file_sizes: {
    "os_analyzer_clean.html": "< 500KB",
    "os_analyzer_optimized.html": "< 15KB", 
    "os_analyzer_a11y.html": "< 10KB",
    "total_css": "< 200KB",
    "total_js": "< 1MB",
    "images": "< 100KB"
  },

  // Network budgets
  network: {
    total_requests: "< 20",
    total_size: "< 2MB",
    critical_path_size: "< 500KB"
  },

  // Runtime budgets
  runtime: {
    main_thread_time: "< 2s",
    javascript_execution: "< 1s",
    layout_thrashing: "< 100ms"
  }
};

// Monitoring configuration
export const monitoringConfig = {
  // Core Web Vitals monitoring
  web_vitals: {
    lcp_threshold: 1100, // milliseconds
    fid_threshold: 100,  // milliseconds  
    cls_threshold: 0.1,  // score
    fcp_threshold: 800   // milliseconds
  },

  // Custom metrics for HaQei philosophy
  haqei_metrics: {
    philosophy_load_time: "< 500ms",
    question_response_time: "< 200ms", 
    analysis_completion_time: "< 3s",
    result_rendering_time: "< 1s"
  },

  // Error tracking
  error_monitoring: {
    javascript_errors: true,
    network_errors: true,
    performance_errors: true,
    user_experience_errors: true
  }
};

export default performanceConfig;