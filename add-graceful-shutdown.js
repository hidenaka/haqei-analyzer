/**
 * Add Graceful Shutdown Method to HAQEICipherServer
 */

const shutdownMethod = `
  setupGracefulShutdown() {
    const signals = ['SIGINT', 'SIGTERM', 'SIGUSR2'];
    
    signals.forEach(signal => {
      process.on(signal, async () => {
        this.logger.info(\`🛑 Received \${signal}, initiating graceful shutdown...\`);
        
        try {
          // Save persistent memory
          this.savePersistentMemory();
          this.logger.info('💾 Persistent memory saved');
          
          // Close rate limiter Redis connection if exists
          if (this.rateLimiter) {
            await this.rateLimiter.close();
            this.logger.info('🔒 Rate limiter closed');
          }
          
          // Close server
          if (this.server) {
            await new Promise((resolve, reject) => {
              this.server.close((err) => {
                if (err) {
                  this.logger.error(\`❌ Server close error: \${err.message}\`);
                  reject(err);
                } else {
                  this.logger.info('🔮 HAQEI Server closed gracefully');
                  resolve();
                }
              });
              
              // Force close after timeout
              setTimeout(() => {
                this.logger.warn('⚠️ Force closing after 5s timeout');
                resolve();
              }, 5000);
            });
          }
          
          this.logger.info('✅ Graceful shutdown complete');
          process.exit(0);
          
        } catch (error) {
          this.logger.error(\`❌ Shutdown error: \${error.message}\`);
          process.exit(1);
        }
      });
    });
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      this.logger.error('🚨 Uncaught Exception:', { 
        error: error.message, 
        stack: error.stack,
        pid: process.pid
      });
      
      // Try graceful shutdown, but don't wait too long
      setTimeout(() => {
        this.logger.error('🚨 Force exit due to uncaught exception');
        process.exit(1);
      }, 3000);
      
      this.shutdown('UNCAUGHT_EXCEPTION');
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      this.logger.error('🚨 Unhandled Rejection:', { 
        reason: reason?.message || reason,
        promise: promise?.toString(),
        pid: process.pid
      });
      
      // Don't exit immediately for unhandled rejections, just log
      // In production, you might want to exit depending on severity
    });
    
    this.logger.info('🛡️ Graceful shutdown handlers installed');
  }
`;

console.log('Graceful shutdown method ready to add to HAQEICipherServer class:');
console.log(shutdownMethod);