import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';
import { CacheService } from './cache.service';

export const cachingInterceptor: HttpInterceptorFn = (req, next) => {
  const cacheKey = req.urlWithParams;
  const cacheService = inject(CacheService);
  const cachedResponse = cacheService.getCache(cacheKey);
  if (cachedResponse) {
    return of(cachedResponse);
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        if (req.method === 'GET' && req.url.includes('api.weatherapi.com')) {
          cacheService.setCache(cacheKey, { data: event, maxAge: 90000 });
        }

      }
    })
  );
};
