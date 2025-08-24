// Cloudflare Worker for HAQEI Analyzer
// T15: Edge computing integration with HaQei philosophy

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // HaQei Triple OS Architecture handling
    try {
      // Engine OS: Core routing logic
      if (url.pathname === '/api/philosophy') {
        return handlePhilosophyAPI(request, env);
      }
      
      if (url.pathname === '/api/health') {
        return handleHealthCheck(request, env);
      }
      
      if (url.pathname.startsWith('/api/analytics')) {
        return handleAnalytics(request, env);
      }
      
      // Interface OS: Handle static assets with optimization
      if (url.pathname.endsWith('.html')) {
        return handleHTMLRequest(request, env);
      }
      
      // Default: Pass through to Pages
      return env.ASSETS.fetch(request);
      
    } catch (error) {
      // Safe Mode OS: Error handling
      return new Response(
        JSON.stringify({
          error: 'Service temporarily unavailable',
          philosophy: 'Safe Mode OS activated',
          timestamp: new Date().toISOString()
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
};

// Engine OS: Philosophy API endpoint
async function handlePhilosophyAPI(request, env) {
  const philosophyData = {
    name: "HAQEI Philosophy (分人思想)",
    description: "Strategic Life Navigation Through Multiple Sub-Personalities",
    architecture: {
      engine_os: {
        description: "Core values and authentic drives",
        focus: "Inner motivations and true self"
      },
      interface_os: {
        description: "Social expressions and behavioral patterns", 
        focus: "External interactions and adaptability"
      },
      safe_mode_os: {
        description: "Defense mechanisms and protective patterns",
        focus: "Risk management and stability"
      }
    },
    principles: [
      "Embrace multiple sub-personalities instead of seeking single identity",
      "Strategic navigation through understanding different aspects of self",
      "Continuous adaptation based on situational context",
      "Integration of I Ching wisdom with modern psychology"
    ],
    deployment: {
      environment: env.ENVIRONMENT || 'unknown',
      tier: env.DEPLOYMENT_TIER || 'edge',
      version: env.VERSION || '4.3.1',
      timestamp: new Date().toISOString()
    }
  };
  
  return new Response(
    JSON.stringify(philosophyData, null, 2),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      }
    }
  );
}

// Safe Mode OS: Health check endpoint
async function handleHealthCheck(request, env) {
  const healthData = {
    status: 'operational',
    philosophy: 'Triple OS Architecture',
    services: {
      engine_os: 'active',
      interface_os: 'active', 
      safe_mode_os: 'active'
    },
    environment: env.ENVIRONMENT || 'unknown',
    timestamp: new Date().toISOString(),
    uptime: 'continuous',
    version: env.VERSION || '4.3.1'
  };
  
  return new Response(
    JSON.stringify(healthData, null, 2),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      }
    }
  );
}

// Interface OS: Analytics handling
async function handleAnalytics(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  
  try {
    const analyticsData = await request.json();
    
    // Store in Analytics Engine if available
    if (env.ANALYTICS_ENGINE) {
      await env.ANALYTICS_ENGINE.writeDataPoint({
        blobs: [
          analyticsData.event_type || 'page_view',
          analyticsData.user_agent || 'unknown',
          analyticsData.page || 'unknown'
        ],
        doubles: [
          Date.now()
        ],
        indexes: [
          env.ENVIRONMENT || 'unknown'
        ]
      });
    }
    
    return new Response(
      JSON.stringify({ 
        status: 'recorded',
        philosophy: 'Interface OS analytics',
        timestamp: new Date().toISOString()
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Analytics processing failed',
        philosophy: 'Safe Mode OS error handling'
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Interface OS: HTML optimization
async function handleHTMLRequest(request, env) {
  const response = await env.ASSETS.fetch(request);
  
  if (response.status !== 200) {
    return response;
  }
  
  // Add performance and security headers
  const newResponse = new Response(response.body, response);
  
  // Enhanced security headers for HaQei applications
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newResponse.headers.set('X-HaQei-Philosophy', 'Triple OS Architecture');
  newResponse.headers.set('X-HaQei-Version', env.VERSION || '4.3.1');
  
  // Performance headers
  newResponse.headers.set('X-DNS-Prefetch-Control', 'on');
  
  return newResponse;
}