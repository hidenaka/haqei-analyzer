/**
 * Redis Rate Limiter for HAQEI
 * Scalable rate limiting with Redis backend
 */

import IORedis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

class RedisRateLimiter {
  constructor(options = {}) {
    this.options = {
      redisUrl: options.redisUrl || process.env.REDIS_URL || 'redis://localhost:6379',
      keyPrefix: options.keyPrefix || 'haqei:rl',
      points: options.points || 100,  // requests
      duration: options.duration || 60,  // seconds
      blockDuration: options.blockDuration || 60,  // seconds
      ...options
    };
    
    this.redis = null;
    this.limiter = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      // Initialize Redis connection
      this.redis = new IORedis(this.options.redisUrl, {
        enableOfflineQueue: false,
        maxRetriesPerRequest: 3,
        retryDelayOnFailover: 100,
        lazyConnect: true
      });

      // Test connection
      await this.redis.ping();
      console.log('✅ Redis connection established for rate limiting');

      // Initialize rate limiter
      this.limiter = new RateLimiterRedis({
        storeClient: this.redis,
        keyPrefix: this.options.keyPrefix,
        points: this.options.points,
        duration: this.options.duration,
        blockDuration: this.options.blockDuration,
        execEvenly: true  // Spread requests evenly across the duration
      });

      this.initialized = true;
      return true;
    } catch (error) {
      console.warn('⚠️ Redis rate limiter initialization failed:', error.message);
      console.log('📝 Falling back to in-memory rate limiting');
      return false;
    }
  }

  async middleware(req, res, next) {
    if (!this.initialized) {
      // Fallback to simple in-memory rate limiting
      return this.fallbackMiddleware(req, res, next);
    }

    const key = this.getKey(req);
    
    try {
      const rateLimiterRes = await this.limiter.consume(key);
      
      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': String(this.options.points),
        'X-RateLimit-Remaining': String(rateLimiterRes.remainingPoints),
        'X-RateLimit-Reset': new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString(),
        'X-RateLimit-Window': `${this.options.duration}s`
      });

      next();
    } catch (rejRes) {
      // Rate limit exceeded
      const retryAfter = Math.ceil(rejRes.msBeforeNext / 1000);
      
      res.set({
        'X-RateLimit-Limit': String(this.options.points),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(Date.now() + rejRes.msBeforeNext).toISOString(),
        'X-RateLimit-Window': `${this.options.duration}s`,
        'Retry-After': String(retryAfter)
      });

      return res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        retryAfter: retryAfter
      });
    }
  }

  getKey(req) {
    // Use IP address as the key, with support for proxied requests
    return req.ip || req.connection.remoteAddress || 'unknown';
  }

  fallbackMiddleware(req, res, next) {
    // Simple in-memory fallback (for development/testing)
    if (!this.fallbackStore) {
      this.fallbackStore = new Map();
    }

    const key = this.getKey(req);
    const now = Date.now();
    const windowStart = now - (this.options.duration * 1000);

    // Clean old entries
    for (const [ip, requests] of this.fallbackStore.entries()) {
      const validRequests = requests.filter(time => time > windowStart);
      if (validRequests.length === 0) {
        this.fallbackStore.delete(ip);
      } else {
        this.fallbackStore.set(ip, validRequests);
      }
    }

    // Check current IP
    const currentRequests = this.fallbackStore.get(key) || [];
    const recentRequests = currentRequests.filter(time => time > windowStart);

    if (recentRequests.length >= this.options.points) {
      const retryAfter = Math.ceil((windowStart + (this.options.duration * 1000) - now) / 1000);
      
      res.set({
        'X-RateLimit-Limit': String(this.options.points),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(windowStart + (this.options.duration * 1000)).toISOString(),
        'X-RateLimit-Window': `${this.options.duration}s`,
        'Retry-After': String(retryAfter)
      });

      return res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        retryAfter: retryAfter
      });
    }

    // Add current request
    recentRequests.push(now);
    this.fallbackStore.set(key, recentRequests);

    // Set headers
    res.set({
      'X-RateLimit-Limit': String(this.options.points),
      'X-RateLimit-Remaining': String(Math.max(0, this.options.points - recentRequests.length)),
      'X-RateLimit-Reset': new Date(windowStart + (this.options.duration * 1000)).toISOString(),
      'X-RateLimit-Window': `${this.options.duration}s`
    });

    next();
  }

  async close() {
    if (this.redis) {
      await this.redis.quit();
      console.log('✅ Redis connection closed');
    }
  }

  async getStats() {
    if (!this.initialized || !this.redis) {
      return {
        type: 'fallback',
        entries: this.fallbackStore ? this.fallbackStore.size : 0
      };
    }

    try {
      const keys = await this.redis.keys(`${this.options.keyPrefix}:*`);
      return {
        type: 'redis',
        activeKeys: keys.length,
        redis: {
          status: 'connected',
          memory: await this.redis.memory('usage')
        }
      };
    } catch (error) {
      return {
        type: 'redis',
        error: error.message
      };
    }
  }
}

export default RedisRateLimiter;