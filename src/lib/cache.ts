// ===== LOCAL CACHE SYSTEM =====
// Prevents excessive API consumption with localStorage-based caching

const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CacheItem {
  data: string;
  timestamp: number;
  ttl: number;
  version: number;
}

function getCacheKey(key: string): string {
  return `cache_${key}`;
}

export function getFromCache(key: string): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(getCacheKey(key));
    if (!stored) return null;
    
    const item: CacheItem = JSON.parse(stored);
    const now = Date.now();
    
    // Check if expired
    if (now - item.timestamp > item.ttl) {
      localStorage.removeItem(getCacheKey(key));
      return null;
    }
    
    return item.data;
  } catch {
    return null;
  }
}

export function setInCache(key: string, data: string, ttl: number = DEFAULT_TTL): void {
  if (typeof window === 'undefined') return;
  
  try {
    const item: CacheItem = {
      data,
      timestamp: Date.now(),
      ttl,
      version: 1
    };
    
    localStorage.setItem(getCacheKey(key), JSON.stringify(item));
  } catch (e) {
    // localStorage might be full - clean old entries
    console.warn('Cache storage full, cleaning old entries', e);
    cleanOldCache();
    try {
      const item: CacheItem = {
        data,
        timestamp: Date.now(),
        ttl,
        version: 1
      };
      localStorage.setItem(getCacheKey(key), JSON.stringify(item));
    } catch {
      console.error('Cache storage still full after cleanup');
    }
  }
}

export function removeFromCache(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(getCacheKey(key));
}

export function cleanOldCache(): void {
  if (typeof window === 'undefined') return;
  
  const now = Date.now();
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith('cache_')) continue;
    
    try {
      const item: CacheItem = JSON.parse(localStorage.getItem(key) || '');
      if (now - item.timestamp > item.ttl) {
        keysToRemove.push(key);
      }
    } catch {
      keysToRemove.push(key!);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

export function getCacheStats(): { totalEntries: number; totalSize: number; oldestEntry: number } {
  if (typeof window === 'undefined') return { totalEntries: 0, totalSize: 0, oldestEntry: 0 };
  
  let totalEntries = 0;
  let totalSize = 0;
  let oldestEntry = Date.now();
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith('cache_')) continue;
    
    const value = localStorage.getItem(key) || '';
    totalEntries++;
    totalSize += value.length;
    
    try {
      const item: CacheItem = JSON.parse(value);
      if (item.timestamp < oldestEntry) {
        oldestEntry = item.timestamp;
      }
    } catch {
      // ignore
    }
  }
  
  return { totalEntries, totalSize, oldestEntry };
}

export function clearAllCache(): void {
  if (typeof window === 'undefined') return;
  
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('cache_')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
}
