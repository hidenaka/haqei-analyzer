// HAQEI Analyzer - Automated Deployment Pipeline Configuration
// T15: Complete CI/CD pipeline with HaQei philosophy

export const deploymentConfig = {
  // Engine OS: Core deployment infrastructure
  engine_os: {
    name: "Core Deployment Infrastructure",
    
    build_pipeline: {
      stages: [
        {
          name: "validation",
          description: "Validate file structure and integrity",
          required: true,
          timeout: "5m",
          actions: [
            "check_required_files",
            "validate_html_structure", 
            "verify_asset_integrity",
            "test_core_functionality"
          ]
        },
        {
          name: "security_scan",
          description: "Security and compliance checks",
          required: true,
          timeout: "3m",
          actions: [
            "scan_for_vulnerabilities",
            "check_csp_compliance",
            "validate_access_controls",
            "verify_data_privacy"
          ]
        },
        {
          name: "performance_test",
          description: "Performance and optimization validation",
          required: true,
          timeout: "2m", 
          actions: [
            "measure_core_web_vitals",
            "validate_bundle_sizes",
            "check_loading_performance",
            "verify_responsive_design"
          ]
        }
      ]
    },

    deployment_targets: [
      {
        name: "production",
        providers: ["netlify", "vercel", "github-pages", "cloudflare"],
        trigger: "main_branch_push",
        auto_deploy: true,
        rollback_enabled: true
      },
      {
        name: "staging",
        providers: ["netlify", "vercel"],
        trigger: "develop_branch_push", 
        auto_deploy: true,
        rollback_enabled: false
      },
      {
        name: "preview",
        providers: ["vercel", "netlify"],
        trigger: "pull_request",
        auto_deploy: true,
        rollback_enabled: false
      }
    ]
  },

  // Interface OS: User experience deployment
  interface_os: {
    name: "User Experience Deployment",
    
    deployment_strategies: {
      blue_green: {
        enabled: false, // Static deployment doesn't require this
        description: "Zero-downtime deployment strategy"
      },
      
      canary: {
        enabled: false, // Not applicable for static sites
        description: "Gradual traffic shifting"
      },
      
      rolling: {
        enabled: true,
        description: "Progressive deployment across edge locations",
        rollout_percentage: [25, 50, 75, 100],
        health_check_interval: "30s"
      }
    },

    user_experience_validation: {
      lighthouse_checks: {
        enabled: true,
        performance_threshold: 90,
        accessibility_threshold: 95,
        best_practices_threshold: 90,
        seo_threshold: 90
      },
      
      cross_device_testing: {
        enabled: true,
        devices: ["mobile", "tablet", "desktop"],
        browsers: ["chrome", "firefox", "safari", "edge"]
      },
      
      haqei_philosophy_validation: {
        triple_os_functionality: true,
        question_flow_integrity: true,
        result_accuracy: true,
        i_ching_integration: true
      }
    }
  },

  // Safe Mode OS: Security and monitoring deployment
  safe_mode_os: {
    name: "Security and Monitoring Deployment",
    
    security_deployment: {
      ssl_certificates: {
        auto_renewal: true,
        certificate_transparency: true,
        security_headers: true
      },
      
      content_security_policy: {
        enforcement: "strict",
        report_violations: true,
        auto_update: false // Manually managed for precision
      },
      
      access_controls: {
        rate_limiting: true,
        geo_blocking: false,
        ddos_protection: true
      }
    },

    monitoring_deployment: {
      health_checks: {
        post_deploy: true,
        interval: "1m",
        timeout: "10s",
        failure_threshold: 3
      },
      
      alerting: {
        deployment_success: true,
        deployment_failure: true,
        performance_degradation: true,
        security_incidents: true
      },
      
      rollback_triggers: {
        health_check_failure: true,
        performance_degradation: true,
        error_rate_increase: true,
        security_alert: true
      }
    }
  },

  // Provider-specific deployment configurations
  providers: {
    netlify: {
      build_settings: {
        publish_directory: "public",
        build_command: "echo 'Static deployment ready'",
        node_version: "18"
      },
      
      deployment_settings: {
        auto_publishing: true,
        deploy_previews: true,
        branch_deploys: true,
        form_processing: false
      },
      
      performance_settings: {
        asset_optimization: true,
        image_processing: false,
        large_media: false
      }
    },

    vercel: {
      build_settings: {
        output_directory: "public",
        build_command: "echo 'Static deployment ready'",
        node_version: "18.x"
      },
      
      deployment_settings: {
        regions: ["iad1", "hnd1", "fra1"],
        functions_region: "iad1",
        edge_functions: true
      },
      
      performance_settings: {
        edge_caching: true,
        compression: true,
        analytics: true
      }
    },

    github_pages: {
      build_settings: {
        source_branch: "main",
        source_folder: "public",
        jekyll: false
      },
      
      deployment_settings: {
        custom_domain: true,
        enforce_https: true,
        subdirectory: false
      },
      
      workflow_settings: {
        auto_deploy: true,
        manual_deploy: true,
        scheduled_deploy: false
      }
    },

    cloudflare_pages: {
      build_settings: {
        build_command: "echo 'Static deployment ready'",
        build_output_directory: "public",
        environment_variables: {
          "HAQEI_PHILOSOPHY": "Triple OS Architecture",
          "VERSION": "4.3.1"
        }
      },
      
      deployment_settings: {
        workers_integration: true,
        analytics_engine: true,
        kv_storage: true
      },
      
      edge_settings: {
        caching: "aggressive",
        compression: "maximum",
        security: "strict"
      }
    }
  },

  // HaQei philosophy-specific deployment rules
  philosophy_deployment: {
    // Engine OS: Core functionality must always deploy successfully
    critical_components: [
      {
        name: "OS Analyzer",
        files: [
          "public/os_analyzer_clean.html",
          "public/assets/H384H64database.js", 
          "public/assets/js/questions-full.js"
        ],
        health_check: "/os_analyzer_clean.html",
        failure_action: "block_deployment"
      },
      
      {
        name: "Future Simulator", 
        files: [
          "public/future_simulator.html",
          "public/js/pages/future-simulator/"
        ],
        health_check: "/future_simulator.html",
        failure_action: "warn_continue"
      }
    ],

    // Interface OS: User experience validation
    user_experience_gates: [
      {
        name: "Core Web Vitals",
        thresholds: {
          lcp: 1100,
          fid: 100,
          cls: 0.1
        },
        failure_action: "warn_continue"
      },
      
      {
        name: "Accessibility Score",
        threshold: 95,
        failure_action: "block_deployment"
      }
    ],

    // Safe Mode OS: Security and privacy validation
    safety_gates: [
      {
        name: "CSP Validation",
        check: "csp_headers_present",
        failure_action: "block_deployment"
      },
      
      {
        name: "Privacy Compliance",
        check: "no_tracking_scripts",
        failure_action: "block_deployment"
      }
    ]
  },

  // Rollback configuration
  rollback: {
    triggers: [
      {
        name: "health_check_failure",
        threshold: "3_consecutive_failures",
        auto_rollback: true
      },
      {
        name: "performance_degradation", 
        threshold: "lcp_increase_50_percent",
        auto_rollback: true
      },
      {
        name: "error_rate_spike",
        threshold: "error_rate_above_5_percent",
        auto_rollback: true
      }
    ],

    strategy: {
      method: "immediate",
      preserve_logs: true,
      notification: true,
      post_rollback_verification: true
    }
  }
};

// Deployment environments configuration
export const environments = {
  development: {
    name: "Development",
    domain: "localhost:8788",
    auto_deploy: false,
    debug_mode: true,
    csp_report_only: true
  },

  staging: {
    name: "Staging", 
    domain: "haqei-staging.netlify.app",
    auto_deploy: true,
    debug_mode: false,
    csp_report_only: false,
    basic_auth: true
  },

  production: {
    name: "Production",
    domains: [
      "haqei.netlify.app",
      "haqei.vercel.app", 
      "username.github.io/haqei-analyzer",
      "haqei.pages.dev"
    ],
    auto_deploy: true,
    debug_mode: false,
    csp_report_only: false,
    monitoring: "full"
  }
};

// Quality gates for each deployment stage
export const qualityGates = [
  {
    stage: "pre_deployment",
    gates: [
      "file_structure_validation",
      "security_scan",
      "performance_baseline"
    ],
    required: true
  },
  
  {
    stage: "post_deployment",
    gates: [
      "health_check_validation",
      "performance_verification", 
      "functionality_test"
    ],
    required: true
  },
  
  {
    stage: "user_acceptance",
    gates: [
      "core_web_vitals_validation",
      "accessibility_compliance",
      "haqei_philosophy_integrity"
    ],
    required: false,
    warning_only: true
  }
];

export default deploymentConfig;