#!/usr/bin/env node

/**
 * HAQEI Analyzer Cipher Integration Server
 * Bunenjin Philosophy + Dual Memory Layer
 */

import { MemAgent, createLogger } from '@byterover/cipher/core';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));

class HAQEICipherServer {
  constructor() {
    this.config = this.loadConfig();
    this.memAgent = null;
    this.logger = createLogger({ level: 'info' });
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
      // Initialize MemAgent with HAQEI-specific context
      this.memAgent = new MemAgent({
        name: 'HAQEI-Analyzer',
        description: 'HAQEI bunenjin philosophy memory agent',
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
        },
        logger: this.logger
      });

      this.logger.info(`🔮 HAQEI Cipher Server started on ${this.config.server.host}:${this.config.server.port}`);
      this.logger.info('📊 Dual Memory Layer: Programming Concepts + Reasoning Steps');
      this.logger.info('🎯 Bunenjin Philosophy Integration: Active');
      this.logger.info('🛡️  Privacy Level: Maximum (Local Storage Only)');
      
      return true;
    } catch (error) {
      this.logger.error('Failed to initialize Cipher server:', error);
      return false;
    }
  }

  async storeBunenjinContext(context) {
    if (!this.memAgent) return false;
    
    try {
      // MemAgentを使用してコンテキストを保存
      await this.memAgent.addMemory({
        type: 'bunenjin-philosophy',
        content: context,
        tags: ['philosophy', 'core-principles', 'triple-os'],
        timestamp: new Date().toISOString()
      });
      return true;
    } catch (error) {
      this.logger.error('Failed to store bunenjin context:', error);
      return false;
    }
  }

  async retrieveContext(query) {
    if (!this.memAgent) return null;
    
    try {
      return await this.memAgent.queryMemory(query, {
        contexts: ['bunenjin-philosophy', 'iching-logic', 'implementation-patterns']
      });
    } catch (error) {
      this.logger.error('Failed to retrieve context:', error);
      return null;
    }
  }

  async shutdown() {
    if (this.memAgent) {
      this.logger.info('🔮 HAQEI Cipher Server stopped');
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