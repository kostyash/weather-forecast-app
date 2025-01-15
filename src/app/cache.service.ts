import { Injectable } from '@angular/core';

const cacheLife = 600000; // ms

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  

  private cache = new Map<string, any>();

  setCache(key: string, data: any) { 
    this.cache.set(key, { ...data, timestamp: new Date().getTime(),  });
  }


  getCache(key: string): any {
    const cacheEntry = this.cache.get(key);
    if (cacheEntry) {
      const { data, timestamp } = cacheEntry;
      const currentTime = new Date().getTime();
      if (currentTime - timestamp < cacheLife) {
        return data;
      } else {
        this.cache.delete(key); 
      }
    }
    return null;
  }

  deleteCache(key: string) {
    this.cache.delete(key);
  }
}