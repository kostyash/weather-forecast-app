import { TestBed } from '@angular/core/testing';

import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get cache (hit)', () => {
    service.setCache('key', { foo: 'bar' });
    // Simulate immediate retrieval (not expired)
    const result = service.getCache('key');
    expect(result).toEqual({ foo: 'bar' });
  });

  it('should return null for missing cache (miss)', () => {
    expect(service.getCache('missing')).toBeNull();
  });

  it('should delete cache', () => {
    service.setCache('key', { foo: 'bar' });
    service.deleteCache('key');
    expect(service.getCache('key')).toBeNull();
  });

  it('should expire cache after cacheLife', () => {
    jest.useFakeTimers();
    service.setCache('expire', { foo: 'baz' });
    // Fast-forward time beyond cacheLife
    jest.advanceTimersByTime(600001);
    const result = service.getCache('expire');
    expect(result).toBeNull();
    jest.useRealTimers();
  });
});
