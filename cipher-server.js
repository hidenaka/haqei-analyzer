#!/usr/bin/env node

/**
 * HAQEI Analyzer Cipher Integration Server (Simplified)
 * HaQei Philosophy + Dual Memory Layer
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class HAQEICipherServer {
  constructor() {
    this.config = this.loadConfig();
    this.memory = new Map();
    this.server = null;
    this.logger = this.createSimpleLogger();
  }

  createSimpleLogger() {
    return {
      info: (msg) => console.log(`[INFO] ${new Date().toISOString()} ${msg}`),
      error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} ${msg}`),
      warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} ${msg}`)
    };
  }

  loadConfig() {
    try {
      const configPath = path.join(__dirname, 'cipher.config.yaml');
      const configFile = readFileSync(configPath, 'utf8');
      return yaml.load(configFile);
    } catch (error) {
      console.error('Failed to load Cipher config:', error);
      return this.getDefaultConfig();
    }
  }

  getDefaultConfig() {
    return {
      server: { 
        port: Number(process.env.PORT || process.env.CIPHER_PORT || 8788), 
        host: process.env.CIPHER_HOST || 'localhost' 
      },
      memory: { enabled: true, provider: 'local', persistent: true },
      storage: { type: 'file', path: './.mcp-data/cipher-memory' },
      logging: { level: 'info', file: './.mcp-data/logs/cipher.log' }
    };
  }

  async initialize() {
    try {
      // Ensure storage directories exist
      this.ensureStorageDirectories();
      
      // Load persistent memory if exists
      this.loadPersistentMemory();
      
      // Initialize simplified memory system with HAQEI-specific context
      this.initializeMemoryContext();
      
      // Create Express app
      const app = express();
      
      // Security and performance middleware
      app.disable('x-powered-by');
      
      // Helmet security headers with relaxed CSP for development
      app.use(helmet({
        contentSecurityPolicy: {
          useDefaults: false, // Start with minimal restrictions
          directives: {
            "default-src": ["'self'"],
            "img-src": ["'self'", "data:", "blob:"],
            "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // TODO: gradual CSP hardening
            "style-src": ["'self'", "'unsafe-inline'"],
            "connect-src": ["'self'"],
            "font-src": ["'self'", "data:"],
            "frame-src": ["'none'"],
            "object-src": ["'none'"],
          }
        },
        referrerPolicy: { policy: "no-referrer" },
        crossOriginOpenerPolicy: { policy: "same-origin" },
        crossOriginResourcePolicy: { policy: "same-origin" }
      }));
      
      // Compression (gzip + brotli if available)
      app.use(compression());
      
      // CORS for development
      app.use(cors());
      
      // API routes
      app.get('/health', (req, res) => {
        res.json({ 
          status: 'healthy', 
          timestamp: new Date().toISOString(),
          version: 'v2.2.2',
          ok: true 
        });
      });
      
      app.get('/ready', async (req, res) => {
        try {
          // Readiness checks: dependencies and configuration
          const eightPalacesPath = path.resolve(__dirname, 'data/eight_palaces.v1.json');
          const manifestPath = path.resolve(__dirname, 'data/source_manifest.json');
          
          if (!existsSync(eightPalacesPath)) {
            throw new Error('Eight Palaces data not found');
          }
          
          if (!existsSync(manifestPath)) {
            throw new Error('Source manifest not found');
          }
          
          // Test main app file accessibility
          const mainAppPath = path.resolve(__dirname, 'public/os_analyzer.html');
          if (!existsSync(mainAppPath)) {
            throw new Error('Main application file not found');
          }
          
          res.json({ 
            ready: true, 
            timestamp: new Date().toISOString(),
            checks: {
              eight_palaces: 'ok',
              manifest: 'ok',
              main_app: 'ok',
              memory: this.memory.size > 0 ? 'ok' : 'empty'
            }
          });
        } catch (error) {
          res.status(503).json({ 
            ready: false, 
            error: error.message,
            timestamp: new Date().toISOString()
          });
        }
      });
      
      app.get('/memory', (req, res) => {
        const memoryData = Array.from(this.memory.entries()).map(([key, value]) => ({ key, value }));
        res.json({ memory: memoryData });
      });
      
      // Static file serving (dist優先 → なければpublic)
      const PUBLIC_DIR = path.resolve(__dirname, 'public');
      const DIST_DIR = path.resolve(__dirname, 'dist');
      
      const staticOpts = { 
        extensions: ['html'], 
        maxAge: '1h',
        etag: true,
        immutable: false,
        index: false  // Disable directory index to prevent conflicts
      };
      
      // First try dist, then public
      app.use(express.static(DIST_DIR, staticOpts));
      app.use(express.static(PUBLIC_DIR, staticOpts));
      
      // Root redirect to main app
      app.get('/', (req, res) => {
        res.redirect('/os_analyzer.html');
      });
      
      // 404 handler with graceful fallback
      app.use((req, res) => {
        const fallbackPath = path.join(PUBLIC_DIR, '404.html');
        if (existsSync(fallbackPath)) {
          res.status(404).sendFile(fallbackPath);
        } else {
          res.status(404).json({ 
            error: 'Not found',
            path: req.path,
            message: 'HAQEI Static files or API endpoint not found',
            suggestion: 'Try accessing /os_analyzer.html directly'
          });
        }
      });
      
      // Global error handler
      app.use((err, req, res, next) => {
        console.error('Server error:', err);
        this.logger.error(`Server error: ${err.message}`);
        
        const fallbackPath = path.join(PUBLIC_DIR, '500.html');
        if (existsSync(fallbackPath)) {
          res.status(500).sendFile(fallbackPath);
        } else {
          res.status(500).json({
            error: 'Internal server error',
            message: 'HAQEI server encountered an unexpected error',
            timestamp: new Date().toISOString()
          });
        }
      });

      const port = this.config.server.port;
      const host = this.config.server.host;
      
      this.server = app.listen(port, host, () => {
        this.logger.info(`🔮 HAQEI App+API Server listening on http://${host}:${port}`);
        this.logger.info('📊 Dual Memory Layer: Programming Concepts + Reasoning Steps');
        this.logger.info('🎯 HaQei Philosophy Integration: Active');
        this.logger.info('🛡️  Privacy Level: Maximum (Local Storage Only)');
        this.logger.info(`📁 Static Files: ${DIST_DIR} (priority) → ${PUBLIC_DIR}`);
        this.logger.info(`🌐 Main App: http://${host}:${port}/os_analyzer.html`);
      });
      
      return true;
    } catch (error) {
      this.logger.error('Failed to initialize Cipher server:', error);
      return false;
    }
  }

  ensureStorageDirectories() {
    const storagePath = this.config.storage.path;
    const logPath = path.dirname(this.config.logging.file);
    
    if (!existsSync(storagePath)) {
      mkdirSync(storagePath, { recursive: true });
      this.logger.info(`Created storage directory: ${storagePath}`);
    }
    
    if (!existsSync(logPath)) {
      mkdirSync(logPath, { recursive: true });
    }
  }
  
  loadPersistentMemory() {
    try {
      const memoryFile = path.join(this.config.storage.path, 'memory.json');
      if (existsSync(memoryFile)) {
        const data = JSON.parse(readFileSync(memoryFile, 'utf8'));
        Object.entries(data).forEach(([key, value]) => {
          this.memory.set(key, value);
        });
        this.logger.info(`Loaded ${Object.keys(data).length} memory entries from persistent storage`);
      }
    } catch (error) {
      this.logger.warn(`Failed to load persistent memory: ${error.message}`);
    }
  }
  
  savePersistentMemory() {
    try {
      const memoryFile = path.join(this.config.storage.path, 'memory.json');
      const data = {};
      this.memory.forEach((value, key) => {
        data[key] = value;
      });
      writeFileSync(memoryFile, JSON.stringify(data, null, 2));
      this.logger.info(`Saved ${Object.keys(data).length} memory entries to persistent storage`);
    } catch (error) {
      this.logger.error(`Failed to save persistent memory: ${error.message}`);
    }
  }
  
  initializeMemoryContext() {
    const context = {
      project: 'HAQEI Analyzer',
      philosophy: 'HaQei',
      architecture: 'Triple OS (Engine/Interface/Safe Mode)',
      principles: [
        'User Sovereignty & Privacy First',
        'I Ching 易経 Wisdom Integration', 
        'Dual Memory Layer (Programming + Reasoning)',
        'Local Storage Complete',
        'Transparency Engine'
      ],
      timestamp: new Date().toISOString()
    };
    
    this.memory.set('haqei-context', context);
    this.savePersistentMemory(); // Save immediately after context initialization
    this.logger.info('HAQEI context initialized in memory');
  }


  async storeHaQeiContext(context) {
    try {
      const key = `HaQei-${Date.now()}`;
      const memoryEntry = {
        type: 'HaQei-philosophy',
        content: context,
        tags: ['philosophy', 'core-principles', 'triple-os'],
        timestamp: new Date().toISOString()
      };
      
      this.memory.set(key, memoryEntry);
      this.savePersistentMemory(); // Save after storing new context
      this.logger.info(`Stored HaQei context with key: ${key}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to store HaQei context:', error);
      return false;
    }
  }

  async retrieveContext(query) {
    try {
      const results = [];
      for (const [key, value] of this.memory.entries()) {
        if (value.type && ['HaQei-philosophy', 'iching-logic', 'implementation-patterns'].includes(value.type)) {
          results.push({ key, ...value });
        }
      }
      this.logger.info(`Retrieved ${results.length} context entries for query: ${query}`);
      return results;
    } catch (error) {
      this.logger.error('Failed to retrieve context:', error);
      return null;
    }
  }

  async shutdown() {
    if (this.server) {
      this.savePersistentMemory(); // Save before shutdown
      this.server.close(() => {
        this.logger.info('🔮 HAQEI Cipher Server stopped');
      });
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new HAQEICipherServer();
  
  process.on('SIGINT', async () => {
    console.log('\n⏹️  Shutting down HAQEI Cipher Server...');
    await server.shutdown();
    process.exit(0);
  });

  server.initialize().then(success => {
    if (!success) {
      console.error('❌ Failed to start HAQEI Cipher Server');
      process.exit(1);
    }
  });
}

export default HAQEICipherServer;