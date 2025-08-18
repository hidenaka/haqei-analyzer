// HAQEI Analyzer - CDN Configuration
// T15: Content Delivery Network optimization with HaQei philosophy

export const cdnConfig = {
  // Engine OS: Core CDN requirements
  engine_os: {
    name: "Core CDN Infrastructure",
    
    primary_providers: [
      {
        name: "Cloudflare",
        type: "global_cdn",
        features: [
          "edge_caching",
          "ddos_protection", 
          "ssl_termination",
          "workers_integration"
        ],
        regions: "global",
        priority: 1
      },
      {
        name: "jsDelivr", 
        type: "public_cdn",
        features: [
          "github_integration",
          "npm_packages",
          "auto_minification"
        ],
        regions: "global", 
        priority: 2
      }
    ],

    caching_rules: {
      // Static assets - Engine OS core files
      "*.html": {
        cache_control: "no-cache, no-store, must-revalidate",
        edge_ttl: 0,
        browser_ttl: 0,
        reason: "Dynamic content updates for philosophy guidance"
      },
      
      "*.css": {
        cache_control: "public, max-age=31536000, immutable",
        edge_ttl: 31536000,
        browser_ttl: 31536000,
        compression: ["br", "gzip"]
      },
      
      "*.js": {
        cache_control: "public, max-age=31536000, immutable", 
        edge_ttl: 31536000,
        browser_ttl: 31536000,
        compression: ["br", "gzip"],
        minification: false // Already optimized
      },

      "/assets/*": {
        cache_control: "public, max-age=31536000, immutable",
        edge_ttl: 31536000,
        browser_ttl: 31536000,
        compression: ["br", "gzip"]
      }
    }
  },

  // Interface OS: User experience optimization
  interface_os: {
    name: "User Experience CDN Layer",
    
    geographic_distribution: {
      primary_regions: [
        "North America (US East, US West)",
        "Europe (London, Frankfurt)", 
        "Asia Pacific (Tokyo, Singapore)",
        "Australia (Sydney)"
      ],
      
      failover_strategy: "nearest_available",
      health_check_interval: "30s",
      automatic_failover: true
    },

    performance_optimization: {
      http2_push: false, // Not needed for static deployment
      early_hints: true,
      prefetch_dns: [
        "fonts.googleapis.com",
        "cdnjs.cloudflare.com"
      ],
      
      edge_side_includes: false,
      dynamic_content_acceleration: true,
      tcp_optimization: true
    },

    mobile_optimization: {
      amp_acceleration: false,
      image_optimization: true,
      adaptive_delivery: true,
      connection_aware: true
    }
  },

  // Safe Mode OS: Security and monitoring  
  safe_mode_os: {
    name: "CDN Security and Monitoring",
    
    security_features: {
      ddos_protection: true,
      waf_rules: [
        "sql_injection",
        "xss_protection", 
        "rate_limiting"
      ],
      
      ssl_configuration: {
        min_tls_version: "1.2",
        cipher_suites: "modern",
        hsts_preload: true,
        certificate_transparency: true
      },

      content_integrity: {
        subresource_integrity: true,
        content_security_policy: true,
        referrer_policy: "strict-origin-when-cross-origin"
      }
    },

    monitoring_analytics: {
      real_time_analytics: true,
      performance_insights: true,
      security_events: true,
      cache_hit_ratio: true,
      
      custom_metrics: [
        "haqei_philosophy_requests",
        "os_analyzer_completions", 
        "future_simulator_usage",
        "triple_os_analysis_time"
      ]
    },

    availability_sla: {
      uptime_target: "99.9%",
      response_time_target: "< 100ms",
      error_rate_threshold: "< 0.1%",
      incident_response_time: "< 5min"
    }
  },

  // Provider-specific configurations
  providers: {
    cloudflare: {
      zones: [
        {
          name: "haqei.example.com",
          plan: "free", // Upgrade as needed
          settings: {
            ssl: "flexible",
            security_level: "medium", 
            cache_level: "aggressive",
            minify: {
              css: false, // Already optimized
              js: false,  // Already optimized
              html: false // Already optimized
            },
            
            page_rules: [
              {
                url: "*.html",
                settings: {
                  cache_level: "bypass",
                  edge_cache_ttl: 0
                }
              },
              {
                url: "/css/*",
                settings: {
                  cache_level: "cache_everything",
                  edge_cache_ttl: 31536000
                }
              },
              {
                url: "/js/*", 
                settings: {
                  cache_level: "cache_everything",
                  edge_cache_ttl: 31536000
                }
              },
              {
                url: "/assets/*",
                settings: {
                  cache_level: "cache_everything",
                  edge_cache_ttl: 31536000
                }
              }
            ]
          }
        }
      ],

      workers: {
        enabled: true,
        script: "haqei-worker.js",
        routes: [
          "/api/*",
          "/*"
        ]
      }
    },

    jsdelivr: {
      // Fallback CDN configuration
      packages: [
        "chart.js@3.9.1",
        "kuromoji@0.1.2"
      ],
      
      optimization: {
        combine: false,
        minify: false // Using pre-minified versions
      }
    }
  },

  // HaQei philosophy-specific CDN rules
  philosophy_rules: {
    // Engine OS: Core functionality always available
    critical_paths: [
      "/os_analyzer_clean.html",
      "/css/os-analyzer.css", 
      "/js/lib/chart.min.js",
      "/assets/H384H64database.js"
    ],

    // Interface OS: Enhanced user experience
    enhanced_paths: [
      "/future_simulator.html",
      "/haqei-philosophy.html",
      "/strategic-dashboard.html"
    ],

    // Safe Mode OS: Fallback and error handling
    fallback_paths: [
      "/offline.html",
      "/error.html", 
      "/maintenance.html"
    ]
  }
};

// CDN performance budgets
export const cdnBudget = {
  global_performance: {
    ttfb: "< 100ms", // Time to First Byte
    dns_resolution: "< 20ms",
    connection_time: "< 50ms",
    ssl_handshake: "< 30ms"
  },
  
  regional_targets: {
    north_america: "< 50ms",
    europe: "< 75ms", 
    asia_pacific: "< 100ms",
    australia: "< 125ms"
  },

  cache_efficiency: {
    hit_ratio: "> 95%",
    edge_efficiency: "> 90%",
    bandwidth_savings: "> 80%"
  }
};

export default cdnConfig;