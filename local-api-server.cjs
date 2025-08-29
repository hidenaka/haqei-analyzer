/**
 * Local Development API Server
 * Provides API endpoints for HAQEI Analyzer development
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8093;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Helper function to load JSON data
function loadJsonData(filename) {
  try {
    const filePath = path.join(__dirname, 'data', filename);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return null;
  }
}

// API endpoint: /api/384-lines
app.get('/api/384-lines', (req, res) => {
  try {
    const type = req.query.type || 'all';
    const limit = parseInt(req.query.limit) || 0;

    const responseData = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {},
    };

    // Load data based on type
    if (type === 'all' || type === 'koudo') {
      const koudoData = loadJsonData('384koudo.json');
      if (koudoData) {
        responseData.data.koudo = limit > 0 ? koudoData.slice(0, limit) : koudoData;
      }
    }

    if (type === 'all' || type === 'hexagrams') {
      const hexagramsData = loadJsonData('hexagrams.json');
      if (hexagramsData) {
        responseData.data.hexagrams = limit > 0 ? hexagramsData.slice(0, limit) : hexagramsData;
      }
    }

    if (type === 'all' || type === 'yaoci') {
      const yaociData = loadJsonData('yaoci.json');
      if (yaociData) {
        responseData.data.yaoci = limit > 0 ? yaociData.slice(0, limit) : yaociData;
      }
    }

    res.json(responseData);
  } catch (error) {
    console.error('Error in /api/384-lines:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

// API endpoint: /api/hexagrams
app.get('/api/hexagrams', (req, res) => {
  try {
    const hexagramsData = loadJsonData('hexagrams.json');
    if (hexagramsData) {
      res.json({
        success: true,
        data: hexagramsData,
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Hexagrams data not found',
      });
    }
  } catch (error) {
    console.error('Error in /api/hexagrams:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

// API endpoint: /api/yaoci
app.get('/api/yaoci', (req, res) => {
  try {
    const yaociData = loadJsonData('yaoci.json');
    if (yaociData) {
      res.json({
        success: true,
        data: yaociData,
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Yaoci data not found',
      });
    }
  } catch (error) {
    console.error('Error in /api/yaoci:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    message: `Endpoint ${req.method} ${req.path} not found`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Local API Server running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   - GET /api/384-lines?type=[all|koudo|hexagrams|yaoci]&limit=[number]`);
  console.log(`   - GET /api/hexagrams`);
  console.log(`   - GET /api/yaoci`);
  console.log(`   - GET /health`);
});

module.exports = app;
