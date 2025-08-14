#!/usr/bin/env node

/**
 * HAQEI Analyzer Cipher Integration Server (Simplified)
 * HaQei Philosophy + Dual Memory Layer
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import http from 'http';
import express from 'express';
import cors from 'cors';
import compression from 'compression';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
      const configPath = join(__dirname, 'cipher.config.yaml');
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
      app.use(compression());
      app.use(cors());
      
      // Security headers
      app.use((req, res, next) => {
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        next();
      });
      
      // API routes
      app.get('/health', (req, res) => {
        res.json({ 
          status: 'healthy', 
          timestamp: new Date().toISOString(),
          version: 'v2.2.2',
          ok: true 
        });
      });
      
      app.get('/memory', (req, res) => {
        const memoryData = Array.from(this.memory.entries()).map(([key, value]) => ({ key, value }));
        res.json({ memory: memoryData });
      });
      
      // Static file serving (dist優先 → なければpublic)
      const PUBLIC_DIR = join(__dirname, 'public');
      const DIST_DIR = join(__dirname, 'dist');
      
      const staticOpts = { 
        extensions: ['html'], 
        maxAge: '1h',
        index: false  // Disable directory index to prevent conflicts
      };
      
      // First try dist, then public
      app.use(express.static(DIST_DIR, staticOpts));
      app.use(express.static(PUBLIC_DIR, staticOpts));
      
      // Root redirect to main app
      app.get('/', (req, res) => {
        res.redirect('/os_analyzer.html');
      });
      
      // 404 fallback
      app.use((req, res) => {
        res.status(404).json({ 
          error: 'Not found',
          path: req.path,
          message: 'HAQEI Static files or API endpoint not found'
        });
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
    const logPath = dirname(this.config.logging.file);
    
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
      const memoryFile = join(this.config.storage.path, 'memory.json');
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
      const memoryFile = join(this.config.storage.path, 'memory.json');
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