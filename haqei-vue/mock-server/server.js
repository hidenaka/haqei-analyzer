/**
 * Mock API Server for HAQEI Analyzer Development
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Mock data
const mockQuestions = [
  {
    id: 'q1',
    text: '朝起きた時の気分は？',
    options: [
      { value: 'energetic', label: 'とても元気' },
      { value: 'normal', label: '普通' },
      { value: 'tired', label: '疲れている' }
    ]
  },
  // Add more questions as needed
];

const mockAnalysisResults = {
  primaryOS: {
    hexagramId: 1,
    hexagramInfo: {
      hexagram_id: 1,
      name_jp: '乾',
      reading: 'けん',
      catchphrase: '天の創造力'
    },
    similarity: 0.85,
    matchPercentage: 85
  },
  eightDimensionVector: {
    '乾_創造性': 0.8,
    '震_行動性': 0.7,
    '坎_探求性': 0.6,
    '艮_安定性': 0.5,
    '坤_受容性': 0.4,
    '巽_適応性': 0.6,
    '離_表現性': 0.7,
    '兌_調和性': 0.8
  }
};

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Get questions
app.get('/api/questions', (req, res) => {
  res.json({
    success: true,
    data: mockQuestions,
    meta: {
      total: mockQuestions.length,
      timestamp: new Date().toISOString()
    }
  });
});

// Submit answers and get analysis
app.post('/api/analyze', (req, res) => {
  const { answers } = req.body;
  
  // Simulate processing time
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        ...mockAnalysisResults,
        answersCount: answers?.length || 0,
        timestamp: new Date().toISOString()
      },
      meta: {
        processingTime: '1.5s',
        timestamp: new Date().toISOString()
      }
    });
  }, 1500);
});

// Get user analysis history
app.get('/api/analyses', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        primaryHexagram: '乾',
        matchPercentage: 85
      },
      {
        id: '2',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        primaryHexagram: '坤',
        matchPercentage: 78
      }
    ],
    meta: {
      total: 2,
      timestamp: new Date().toISOString()
    }
  });
});

// Get specific analysis
app.get('/api/analyses/:id', (req, res) => {
  const { id } = req.params;
  
  res.json({
    success: true,
    data: {
      id,
      ...mockAnalysisResults,
      createdAt: new Date().toISOString()
    },
    meta: {
      timestamp: new Date().toISOString()
    }
  });
});

// Save analysis
app.post('/api/analyses', (req, res) => {
  const { analysis } = req.body;
  
  res.json({
    success: true,
    data: {
      id: Date.now().toString(),
      ...analysis,
      savedAt: new Date().toISOString()
    },
    meta: {
      timestamp: new Date().toISOString()
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /health');
  console.log('  GET  /api/questions');
  console.log('  POST /api/analyze');
  console.log('  GET  /api/analyses');
  console.log('  GET  /api/analyses/:id');
  console.log('  POST /api/analyses');
});