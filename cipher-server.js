#!/usr/bin/env node

/**
 * HAQEI Analyzer Cipher Integration Server (Simplified)
 * Bunenjin Philosophy + Dual Memory Layer
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import http from 'http';

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
        port: process.env.CIPHER_PORT || 3001, 
        host: process.env.CIPHER_HOST || 'localhost' 
      },
      memory: { enabled: true, provider: 'local', persistent: true },
      storage: { type: 'file', path: './data/cipher-memory' },
      logging: { level: 'info', file: './logs/cipher.log' }
    };
  }

  async initialize() {
    try {
      // Initialize simplified memory system with HAQEI-specific context
      this.initializeMemoryContext();
      
      // Create HTTP server
      this.server = http.createServer((req, res) => {
        this.handleRequest(req, res);
      });

      const port = this.config.server.port;
      const host = this.config.server.host;
      
      this.server.listen(port, host, () => {
        this.logger.info(`🔮 HAQEI Cipher Server started on ${host}:${port}`);
        this.logger.info('📊 Dual Memory Layer: Programming Concepts + Reasoning Steps');
        this.logger.info('🎯 Bunenjin Philosophy Integration: Active');
        this.logger.info('🛡️  Privacy Level: Maximum (Local Storage Only)');
      });
      
      return true;
    } catch (error) {
      this.logger.error('Failed to initialize Cipher server:', error);
      return false;
    }
  }

  initializeMemoryContext() {
    const context = {
      project: 'HAQEI Analyzer',
      philosophy: 'bunenjin',
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
    this.logger.info('HAQEI context initialized in memory');
  }

  handleRequest(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.url === '/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
      return;
    }

    if (req.url === '/memory' && req.method === 'GET') {
      const memoryData = Array.from(this.memory.entries()).map(([key, value]) => ({ key, value }));
      res.writeHead(200);
      res.end(JSON.stringify({ memory: memoryData }));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }

  async storeBunenjinContext(context) {
    try {
      const key = `bunenjin-${Date.now()}`;
      const memoryEntry = {
        type: 'bunenjin-philosophy',
        content: context,
        tags: ['philosophy', 'core-principles', 'triple-os'],
        timestamp: new Date().toISOString()
      };
      
      this.memory.set(key, memoryEntry);
      this.logger.info(`Stored bunenjin context with key: ${key}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to store bunenjin context:', error);
      return false;
    }
  }

  async retrieveContext(query) {
    try {
      const results = [];
      for (const [key, value] of this.memory.entries()) {
        if (value.type && ['bunenjin-philosophy', 'iching-logic', 'implementation-patterns'].includes(value.type)) {
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