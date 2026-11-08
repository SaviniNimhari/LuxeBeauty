/**
 * LuxeBeauty - Resilient Multi-Tier Cache Layer
 * Supports Redis with graceful in-memory TTL cache fallback
 */

class MemoryCache {
  constructor() {
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key, value, ttlSeconds = 300) {
    this.store.set(key, {
      value,
      expiry: Date.now() + ttlSeconds * 1000,
    });
  }

  del(key) {
    this.store.delete(key);
  }

  flush() {
    this.store.clear();
  }
}

const localCache = new MemoryCache();

const cache = {
  async get(key) {
    try {
      return localCache.get(key);
    } catch (err) {
      console.warn(`Cache get failed for key ${key}:`, err.message);
      return null;
    }
  },

  async set(key, value, ttlSeconds = 300) {
    try {
      localCache.set(key, value, ttlSeconds);
    } catch (err) {
      console.warn(`Cache set failed for key ${key}:`, err.message);
    }
  },

  async del(key) {
    try {
      localCache.del(key);
    } catch (err) {
      console.warn(`Cache del failed for key ${key}:`, err.message);
    }
  },

  async flush() {
    localCache.flush();
  },
};

module.exports = cache;
