// HAQEI Analyzer - Monitoring and Health Check Configuration  
// T15: Comprehensive monitoring with HaQei philosophy

export const monitoringConfig = {
  // Engine OS: Core system monitoring
  engine_os: {
    name: "Core System Monitoring",
    
    uptime_monitoring: {
      endpoints: [
        {
          name: "Main Application",
          url: "/os_analyzer_clean.html",
          method: "GET",
          expected_status: 200,
          check_interval: "1m",
          timeout: "10s",
          retry_count: 3
        },
        {
          name: "Future Simulator",
          url: "/future_simulator.html", 
          method: "GET",
          expected_status: 200,
          check_interval: "2m",
          timeout: "10s",
          retry_count: 3
        },
        {
          name: "Philosophy API",
          url: "/api/philosophy",
          method: "GET", 
          expected_status: 200,
          check_interval: "5m",
          timeout: "5s",
          retry_count: 2
        },
        {
          name: "Health Check API",
          url: "/api/health",
          method: "GET",
          expected_status: 200,
          check_interval: "1m",
          timeout: "5s", 
          retry_count: 3
        }
      ],

      performance_monitoring: {
        core_web_vitals: {
          lcp_threshold: 1100, // ms - Already achieved
          fid_threshold: 100,  // ms
          cls_threshold: 0.1,  // score
          fcp_threshold: 800   // ms
        },
        
        custom_metrics: {
          philosophy_load_time: 500,    // ms
          question_flow_time: 200,     // ms per question
          analysis_completion: 3000,   // ms
          result_rendering: 1000       // ms
        },

        resource_monitoring: {
          javascript_bundle_size: "< 1MB",
          css_bundle_size: "< 200KB", 
          image_total_size: "< 100KB",
          font_loading_time: "< 500ms"
        }
      }
    },

    error_tracking: {
      javascript_errors: {
        enabled: true,
        sampling_rate: 100,
        ignore_patterns: [
          "Script error",
          "Non-Error promise rejection"
        ]
      },
      
      network_errors: {
        enabled: true,
        track_failed_requests: true,
        track_slow_requests: true,
        slow_threshold: 2000 // ms
      },

      user_experience_errors: {
        enabled: true,
        track_rage_clicks: true,
        track_dead_clicks: true,
        track_form_abandonment: true
      }
    }
  },

  // Interface OS: User experience monitoring
  interface_os: {
    name: "User Experience Monitoring",
    
    user_journey_monitoring: {
      critical_paths: [
        {
          name: "Complete OS Analysis",
          steps: [
            "land_on_welcome",
            "click_start_analysis", 
            "answer_36_questions",
            "view_results",
            "explore_triple_os"
          ],
          success_criteria: "view_results",
          timeout: "300s"
        },
        {
          name: "Future Simulation",
          steps: [
            "access_future_simulator",
            "input_situation",
            "generate_scenarios",
            "view_eight_outcomes"
          ],
          success_criteria: "view_eight_outcomes", 
          timeout: "180s"
        }
      ],

      user_satisfaction: {
        nps_tracking: true,
        satisfaction_surveys: true,
        feedback_collection: true,
        session_recordings: false // Privacy-focused
      }
    },

    accessibility_monitoring: {
      wcag_compliance: {
        level: "AA",
        automated_testing: true,
        manual_testing_schedule: "weekly"
      },
      
      assistive_technology: {
        screen_reader_compatibility: true,
        keyboard_navigation: true,
        high_contrast_support: true
      }
    },

    device_experience: {
      mobile_optimization: {
        viewport_compatibility: true,
        touch_target_sizes: true,
        loading_performance: true
      },
      
      cross_browser_testing: [
        "Chrome (latest)",
        "Firefox (latest)",
        "Safari (latest)", 
        "Edge (latest)",
        "Mobile Safari (iOS)",
        "Chrome Mobile (Android)"
      ]
    }
  },

  // Safe Mode OS: Security and incident response
  safe_mode_os: {
    name: "Security and Incident Monitoring",
    
    security_monitoring: {
      csp_violations: {
        enabled: true,
        report_uri: "/api/csp-report",
        report_only: false
      },
      
      suspicious_activity: {
        rate_limiting_triggers: true,
        unusual_traffic_patterns: true,
        malformed_requests: true
      },

      ssl_certificate: {
        expiration_monitoring: true,
        certificate_transparency: true,
        ssl_grade_monitoring: true
      }
    },

    incident_response: {
      alert_channels: [
        {
          type: "email",
          severity: ["critical", "high"],
          recipients: ["admin@example.com"]
        },
        {
          type: "webhook", 
          severity: ["critical"],
          url: "/api/incident-webhook"
        }
      ],
      
      escalation_policy: {
        initial_response: "5m",
        escalation_after: "15m", 
        max_escalation_levels: 3
      },

      automated_recovery: {
        cache_purging: true,
        service_restart: false, // Static deployment
        traffic_rerouting: true
      }
    },

    compliance_monitoring: {
      privacy_compliance: {
        gdpr: true,
        ccpa: true,
        data_processing_logs: true
      },
      
      accessibility_compliance: {
        wcag_2_1_aa: true,
        section_508: true,
        ada_compliance: true
      }
    }
  },

  // Provider-specific monitoring configurations
  providers: {
    netlify: {
      build_monitoring: true,
      deploy_notifications: true,
      form_spam_detection: false,
      bandwidth_alerts: true
    },

    vercel: {
      function_monitoring: true,
      edge_function_logs: true,
      deployment_checks: true,
      analytics_integration: true
    },

    github_pages: {
      build_status_monitoring: true,
      workflow_failure_alerts: true,
      dependency_vulnerability_scans: true
    },

    cloudflare: {
      workers_analytics: true,
      edge_logs: true,
      security_events: true,
      performance_insights: true
    }
  },

  // HaQei philosophy-specific monitoring
  philosophy_monitoring: {
    // Engine OS: Core philosophy metrics
    engine_metrics: [
      "authentic_self_discovery_rate",
      "core_values_identification_success",
      "inner_motivation_analysis_completion"
    ],

    // Interface OS: Social interaction patterns  
    interface_metrics: [
      "behavioral_pattern_recognition_accuracy",
      "social_adaptation_insights_generated",
      "interpersonal_dynamic_analysis_depth"
    ],

    // Safe Mode OS: Protective mechanism insights
    safe_mode_metrics: [
      "defense_mechanism_identification_rate", 
      "stress_response_pattern_detection",
      "risk_management_strategy_effectiveness"
    ],

    // Integrated philosophy metrics
    integrated_metrics: [
      "triple_os_synthesis_completion_rate",
      "strategic_navigation_insights_quality",
      "life_direction_clarity_improvement"
    ]
  }
};

// Monitoring thresholds and SLA definitions
export const slaConfig = {
  availability: {
    target: 99.9, // 99.9% uptime
    measurement_window: "30d",
    exclusions: [
      "planned_maintenance",
      "force_majeure_events"
    ]
  },

  performance: {
    response_time: {
      p50: "< 100ms",
      p95: "< 500ms", 
      p99: "< 1000ms"
    },
    
    throughput: {
      requests_per_second: "> 100",
      concurrent_users: "> 50"
    }
  },

  user_experience: {
    core_web_vitals: {
      lcp_target: "< 1.1s",
      fid_target: "< 100ms",
      cls_target: "< 0.1"
    },
    
    error_rates: {
      javascript_errors: "< 1%",
      network_errors: "< 0.5%",
      user_journey_failures: "< 2%"
    }
  }
};

// Alerting rules
export const alertRules = [
  {
    name: "Site Down",
    condition: "uptime < 99%",
    severity: "critical",
    notification_channels: ["email", "webhook"]
  },
  {
    name: "High Response Time",
    condition: "response_time_p95 > 1000ms", 
    severity: "high",
    notification_channels: ["email"]
  },
  {
    name: "Core Web Vitals Degradation",
    condition: "lcp > 1500ms OR fid > 200ms OR cls > 0.2",
    severity: "medium",
    notification_channels: ["email"]
  },
  {
    name: "JavaScript Error Rate",
    condition: "js_error_rate > 5%",
    severity: "medium", 
    notification_channels: ["email"]
  },
  {
    name: "HaQei Philosophy Analysis Failure",
    condition: "philosophy_analysis_success_rate < 95%",
    severity: "high",
    notification_channels: ["email", "webhook"]
  }
];

export default monitoringConfig;