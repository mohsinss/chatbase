// Types for better type safety
type CacheEntry<T> = { data: T; timestamp: number };
type CacheMap<T> = Map<string, CacheEntry<T>>;

// Cache for frequently accessed data
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
export const cache = {
  chatbots: new Map<string, CacheEntry<any>>(),
  datasets: new Map<string, CacheEntry<any>>(),
  instagramPages: new Map<string, CacheEntry<any>>(),
  lastCleanup: Date.now()
};

// Clean up expired cache entries
export function cleanupCache(): void {
  const now = Date.now();
  if (now - cache.lastCleanup > CACHE_TTL) {
    // Use Array.from to avoid iterator issues
    Array.from(cache.chatbots.entries()).forEach(([key, { timestamp }]) => {
      if (now - timestamp > CACHE_TTL) cache.chatbots.delete(key);
    });

    Array.from(cache.datasets.entries()).forEach(([key, { timestamp }]) => {
      if (now - timestamp > CACHE_TTL) cache.datasets.delete(key);
    });

    Array.from(cache.instagramPages.entries()).forEach(([key, { timestamp }]) => {
      if (now - timestamp > CACHE_TTL) cache.instagramPages.delete(key);
    });

    cache.lastCleanup = now;
  }
}

// Helper function to get cached or fetch data
export async function getCachedOrFetch<T>(cacheMap: CacheMap<T>, key: string, fetchFn: () => Promise<T>): Promise<T> {
  cleanupCache();

  if (cacheMap.has(key)) {
    const entry = cacheMap.get(key);
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
      return entry.data;
    }
  }

  const data = await fetchFn();
  cacheMap.set(key, { data, timestamp: Date.now() });
  return data;
}
