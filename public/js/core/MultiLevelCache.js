class MultiLevelCache {
    constructor(env) {
        this.l1 = new Map();           // L1: メモリキャッシュ (TTL: 5分, 容量: 10MB)
        this.l1MaxSize = 100;  // 約10MB相当 (項目数制限)
        this.l2 = env.KV;              // L2: Cloudflare KV (TTL: 1時間, 容量: 25MB)
        this.l3 = env.DB;              // L3: Cloudflare D1 (TTL: 24時間)
    }
    
    async get(key) {
        // L1: メモリ（0ms）
        if (this.l1.has(key)) {
            return { data: this.l1.get(key), source: 'memory' };
        }
        
        // L2: Workers KV（5ms）
        const kvData = await this.l2.get(key, 'json');
        if (kvData) {
            this.l1.set(key, kvData);
            return { data: kvData, source: 'kv' };
        }
        
        // L3: D1 Database（10ms）
        const d1Data = await this.l3.prepare('SELECT value FROM cache WHERE key = ? AND expiration > ?')
            .bind(key, Date.now())
            .first();
        if (d1Data) {
            const data = JSON.parse(d1Data.value);
            this.promote(key, data);
            return { data, source: 'd1' };
        }
        
        return null;
    }
    
    async set(key, value, ttl) {
        const jsonValue = JSON.stringify(value);
        // L1
        this.l1.set(key, value);
        if (this.l1.size > this.l1MaxSize) {
            const firstKey = this.l1.keys().next().value;
            this.l1.delete(firstKey);
        }
        // L2 (TTL: 1時間 default)
        this.l2.put(key, jsonValue, { expirationTtl: ttl || 3600 });
        // L3 (TTL: 24時間 default)
        const expiration = Date.now() + (ttl * 1000 || 86400000);
        await this.l3.prepare('INSERT OR REPLACE INTO cache (key, value, expiration) VALUES (?, ?, ?)')
            .bind(key, jsonValue, expiration)
            .run();
    }
    
    async promote(key, data) {
        // 上位レイヤーへプロモート
        this.l1.set(key, data);
        this.l2.put(key, JSON.stringify(data));
    }
    
    async invalidate(key) {
        this.l1.delete(key);
        await this.l2.delete(key);
        await this.l3.prepare('DELETE FROM cache WHERE key = ?').bind(key).run();
    }
}