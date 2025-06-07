import { TestBed } from '@angular/core/testing';

import { GeolocationService } from './geolocation.service';

describe('GeolocationService', () => {
  let service: GeolocationService;
  let originalGeolocation: any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeolocationService);
    originalGeolocation = navigator.geolocation;
  });

  afterEach(() => {
    (global as any).navigator.geolocation = originalGeolocation;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get geolocation (success)', (done) => {
    const mockPosition = { coords: { latitude: 1, longitude: 2 } };
    (global as any).navigator.geolocation = {
      getCurrentPosition: (success: any) => success(mockPosition),
    };
    service.getGeoLocation().subscribe((pos) => {
      expect(pos.latitude).toBe(1);
      expect(pos.longitude).toBe(2);
      done();
    });
  });

  it('should error if geolocation fails', (done) => {
    (global as any).navigator.geolocation = {
      getCurrentPosition: (_: any, error: any) => error('fail'),
    };
    service.getGeoLocation().subscribe({
      error: (err) => {
        expect(err).toBe('fail');
        done();
      },
    });
  });

  it('should error if geolocation is unavailable', (done) => {
    (global as any).navigator.geolocation = undefined;
    service.getGeoLocation().subscribe({
      error: (err) => {
        expect(err).toBe('Geolocation is not available in this browser.');
        done();
      },
    });
  });
});
