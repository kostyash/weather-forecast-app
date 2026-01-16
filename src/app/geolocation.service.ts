import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { GeoLocation } from './contracts';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private cachedLocation$: Observable<GeoLocation> | null = null;
  private cacheTimestamp = 0;
  private readonly cacheTTL = 300000; // 5 minutes

  getGeoLocation(): Observable<GeoLocation> {
    if (this.cachedLocation$ && Date.now() - this.cacheTimestamp < this.cacheTTL) {
      return this.cachedLocation$;
    }

    this.cacheTimestamp = Date.now();
    this.cachedLocation$ = new Observable<GeoLocation>((observer) => {
      if (!navigator?.geolocation) {
        observer.error('Geolocation is not available in this browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          observer.complete();
        },
        (error) => observer.error(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }).pipe(shareReplay(1));

    return this.cachedLocation$;
  }

  clearCache(): void {
    this.cachedLocation$ = null;
    this.cacheTimestamp = 0;
  }
}
