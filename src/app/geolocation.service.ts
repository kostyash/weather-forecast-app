import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeoLocation } from './contracts';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  getGeoLocation(): Observable<GeoLocation> {
    return new Observable((observer) => {
      if (!navigator || !navigator.geolocation) {
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
        (error) => {
          observer.error(error);
        }
      );
    });
  }
}
