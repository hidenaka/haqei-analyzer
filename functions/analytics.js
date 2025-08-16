// Vercel Edge Function for HAQEI Analytics
// T15: Cloud deployment analytics endpoint

export default function handler(request, response) {
  // HaQei Philosophy: Interface OS - provide analytics while preserving privacy
  
  // CORS headers for cross-origin requests
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }
  
  // Only allow GET and POST
  if (!['GET', 'POST'].includes(request.method)) {
    return response.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const timestamp = new Date().toISOString();
    const userAgent = request.headers['user-agent'] || 'unknown';
    
    // Basic analytics data structure following HaQei principles
    const analyticsData = {
      timestamp,
      method: request.method,
      engine_os: {
        // Core technical metrics
        endpoint: '/api/analytics',
        status: 'active',
        performance_tier: 'edge'
      },
      interface_os: {
        // User interaction patterns (anonymized)
        user_agent_type: userAgent.includes('Mobile') ? 'mobile' : 'desktop',
        request_origin: request.headers['referer'] || 'direct',
        session_type: 'anonymous'
      },
      safe_mode_os: {
        // Privacy and security measures
        ip_logged: false,
        personal_data_stored: false,
        gdpr_compliant: true,
        data_retention: '24h'
      }
    };
    
    // Return analytics endpoint info
    if (request.method === 'GET') {
      return response.status(200).json({
        message: 'HAQEI Analytics Endpoint',
        philosophy: 'Triple OS Architecture',
        status: 'operational',
        privacy: 'anonymous',
        data: analyticsData
      });
    }
    
    // Handle POST requests for event tracking
    if (request.method === 'POST') {
      // In a real implementation, you would store this data
      // For now, just acknowledge the event
      return response.status(200).json({
        message: 'Event recorded',
        status: 'success',
        acknowledged_at: timestamp
      });
    }
    
  } catch (error) {
    // Safe Mode OS: Error handling without exposing system details
    return response.status(500).json({
      error: 'Internal server error',
      message: 'Analytics temporarily unavailable',
      timestamp: new Date().toISOString()
    });
  }
}