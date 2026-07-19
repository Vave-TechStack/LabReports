import { Redis } from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 3) return null;
    return Math.min(times * 200, 2000);
  },
  lazyConnect: true,
});

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err) => console.warn('⚠️ Redis:', err.message));

export const getCached = async <T>(key: string): Promise<T | null> => {
  try {
    if (redis.status !== 'ready') return null;
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

export const setCached = async (key: string, data: unknown, ttl = 300): Promise<void> => {
  try {
    if (redis.status === 'ready') {
      await redis.setex(key, ttl, JSON.stringify(data));
    }
  } catch { /* silently fail */ }
};

export const invalidateCache = async (pattern: string): Promise<void> => {
  try {
    if (redis.status !== 'ready') return;
    let cursor = '0';
    do {
      const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 50);
      if (keys.length > 0) await redis.del(...keys);
      cursor = nextCursor;
    } while (cursor !== '0');
  } catch { /* silently fail */ }
};
