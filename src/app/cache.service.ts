import { Injectable } from '@angular/core';

const cacheLife = 600000; // ms

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, CacheEntry<unknown>>();

  setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: new Date().getTime() });
  }

  getCache<T>(key: string): T | null {
    const cacheEntry = this.cache.get(key);
    if (cacheEntry) {
      const { data, timestamp } = cacheEntry;
      const currentTime = new Date().getTime();
      if (currentTime - timestamp < cacheLife) {
        return data as T;
      } else {
        this.cache.delete(key);
      }
    }
    return null;
  }

  deleteCache(key: string): void {
    this.cache.delete(key);
  }
}
