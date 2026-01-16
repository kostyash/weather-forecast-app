import { Injectable } from '@angular/core';

const cacheLife = 600000; // ms
const maxCacheSize = 50;

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
    // LRU eviction: remove oldest entry when at capacity
    if (this.cache.size >= maxCacheSize && !this.cache.has(key)) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    // If key already exists, delete it first to update its position (move to end)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    this.cache.set(key, { data, timestamp: new Date().getTime() });
  }

  getCache<T>(key: string): T | null {
    const cacheEntry = this.cache.get(key);
    if (cacheEntry) {
      const { data, timestamp } = cacheEntry;
      const currentTime = new Date().getTime();
      if (currentTime - timestamp < cacheLife) {
        // Update access order (move to end of Map for LRU)
        this.cache.delete(key);
        this.cache.set(key, cacheEntry);
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
