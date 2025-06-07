import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { CacheService } from './cache.service';
import { of } from 'rxjs';

import { cachingInterceptor } from './caching.interceptor';

describe('cachingInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => cachingInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CacheService],
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should return cached response if available', (done) => {
    const cacheService = TestBed.inject(CacheService);
    const req = new HttpRequest(
      'GET',
      'http://api.weatherapi.com/v1/test?q=city'
    );
    cacheService.setCache(req.urlWithParams, { foo: 'bar' });
    interceptor(req, () =>
      of(new HttpResponse({ body: { foo: 'should not be called' } }))
    ).subscribe((res) => {
      expect((res as HttpResponse<any>).body.foo).toBe('bar');
      done();
    });
  });

  it('should cache GET weatherapi responses', (done) => {
    const cacheService = TestBed.inject(CacheService);
    const req = new HttpRequest(
      'GET',
      'http://api.weatherapi.com/v1/test?q=city'
    );
    const next = () => of(new HttpResponse({ body: { foo: 'bar' } }));
    interceptor(req, next).subscribe((res) => {
      expect((res as HttpResponse<any>).body.foo).toBe('bar');
      // Should be cached now
      expect(cacheService.getCache(req.urlWithParams)).toBeTruthy();
      done();
    });
  });

  it('should not cache non-GET requests', (done) => {
    const cacheService = TestBed.inject(CacheService);
    const req = new (HttpRequest as any)(
      'POST',
      'http://api.weatherapi.com/v1/test?q=city'
    );
    const next = () => of(new HttpResponse({ body: { foo: 'bar' } }));
    interceptor(req, next).subscribe((res) => {
      expect((res as HttpResponse<any>).body.foo).toBe('bar');
      expect(cacheService.getCache(req.urlWithParams)).toBeNull();
      done();
    });
  });

  it('should not cache non-weatherapi requests', (done) => {
    const cacheService = TestBed.inject(CacheService);
    const req = new HttpRequest('GET', 'http://example.com/api');
    const next = () => of(new HttpResponse({ body: { foo: 'bar' } }));
    interceptor(req, next).subscribe((res) => {
      expect((res as HttpResponse<any>).body.foo).toBe('bar');
      expect(cacheService.getCache(req.urlWithParams)).toBeNull();
      done();
    });
  });
});
