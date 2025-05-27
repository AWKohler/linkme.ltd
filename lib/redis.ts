import { Redis } from '@upstash/redis';

// Initialize Redis client with Upstash configuration
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cache key prefixes for organization
export const CACHE_KEYS = {
  QR_REDIRECT: 'qr:',           // qr:<slug> -> targetUrl
  IP_INFO: 'ip:',               // ip:<ip> -> JSON geo data
  SLUG_EXISTS: 'slug_exists:'   // slug_exists:<slug> -> 1 (for quick existence checks)
} as const;

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  QR_REDIRECT: 3600,      // 1 hour - QR redirects (can be longer if slugs are immutable)
  IP_INFO: 2592000,       // 30 days - IP geolocation data
  SLUG_EXISTS: 3600       // 1 hour - Slug existence cache
} as const;

// Helper functions for common cache operations
export const cacheHelpers = {
  // QR redirect caching
  async getQRRedirect(slug: string): Promise<string | null> {
    try {
      return await redis.get(`${CACHE_KEYS.QR_REDIRECT}${slug}`);
    } catch (error) {
      console.error('Redis get QR redirect error:', error);
      return null;
    }
  },

  async setQRRedirect(slug: string, targetUrl: string): Promise<void> {
    try {
      await redis.setex(`${CACHE_KEYS.QR_REDIRECT}${slug}`, CACHE_TTL.QR_REDIRECT, targetUrl);
    } catch (error) {
      console.error('Redis set QR redirect error:', error);
    }
  },

  // IP info caching
  async getIPInfo(ip: string): Promise<any | null> {
    try {
      const cached = await redis.get(`${CACHE_KEYS.IP_INFO}${ip}`);
      return cached ? JSON.parse(cached as string) : null;
    } catch (error) {
      console.error('Redis get IP info error:', error);
      return null;
    }
  },

  async setIPInfo(ip: string, data: any): Promise<void> {
    try {
      await redis.setex(`${CACHE_KEYS.IP_INFO}${ip}`, CACHE_TTL.IP_INFO, JSON.stringify(data));
    } catch (error) {
      console.error('Redis set IP info error:', error);
    }
  },

  // Slug existence caching
  async slugExists(slug: string): Promise<boolean> {
    try {
      const exists = await redis.exists(`${CACHE_KEYS.QR_REDIRECT}${slug}`);
      return exists === 1;
    } catch (error) {
      console.error('Redis slug exists check error:', error);
      return false;
    }
  },

  // Remove QR from cache (for updates/deletes)
  async removeQR(slug: string): Promise<void> {
    try {
      await redis.del(`${CACHE_KEYS.QR_REDIRECT}${slug}`);
    } catch (error) {
      console.error('Redis remove QR error:', error);
    }
  }
};