#!/usr/bin/env node

/**
 * HAQEI Analyzer Cipher Integration Server
 * Bunenjin Philosophy + Dual Memory Layer
 */

import { Cipher } from '@byterover/cipher';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));

class HAQEICipherServer {
  constructor() {
    this.config = this.loadConfig();
    this.cipher = null;
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
      server: { port: 3001, host: 'localhost' },
      memory: { enabled: true, provider: 'local', persistent: true },
      storage: { type: 'file', path: './data/cipher-memory' },
      logging: { level: 'info', file: './logs/cipher.log' }
    };
  }

  async initialize() {
    try {
      // Initialize Cipher with HAQEI-specific context
      this.cipher = new Cipher({
        ...this.config,
        context: {
          project: 'HAQEI Analyzer',
          philosophy: 'bunenjin',
          architecture: 'Triple OS (Engine/Interface/Safe Mode)',
          principles: [
            'User Sovereignty & Privacy First',
            'I Ching 易経 Wisdom Integration', 
            'Dual Memory Layer (Programming + Reasoning)',
            'Local Storage Complete',
            'Transparency Engine'
          ]
        }
      });

      await this.cipher.start();
      
      console.log(`🔮 HAQEI Cipher Server started on ${this.config.server.host}:${this.config.server.port}`);
      console.log('📊 Dual Memory Layer: Programming Concepts + Reasoning Steps');
      console.log('🎯 Bunenjin Philosophy Integration: Active');
      console.log('🛡️  Privacy Level: Maximum (Local Storage Only)');
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Cipher server:', error);
      return false;
    }
  }

  async storeBunenjinContext(context) {
    if (!this.cipher) return false;
    
    try {
      await this.cipher.store({
        type: 'bunenjin-philosophy',
        content: context,
        tags: ['philosophy', 'core-principles', 'triple-os'],
        timestamp: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Failed to store bunenjin context:', error);
      return false;
    }
  }

  async retrieveContext(query) {
    if (!this.cipher) return null;
    
    try {
      return await this.cipher.retrieve({
        query,
        contexts: ['bunenjin-philosophy', 'iching-logic', 'implementation-patterns']
      });
    } catch (error) {
      console.error('Failed to retrieve context:', error);
      return null;
    }
  }

  async shutdown() {
    if (this.cipher) {
      await this.cipher.stop();
      console.log('🔮 HAQEI Cipher Server stopped');
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