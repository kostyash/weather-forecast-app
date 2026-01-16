import { TestBed } from '@angular/core/testing';

import { GeolocationService } from './geolocation.service';

interface MockGeolocation {
  getCurrentPosition: (
    success: (position: { coords: { latitude: number; longitude: number } }) => void,
    error?: (err: string) => void
  ) => void;
}

describe('GeolocationService', () => {
  let service: GeolocationService;
  let originalGeolocation: Geolocation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeolocationService);
    originalGeolocation = navigator.geolocation;
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'geolocation', {
      value: originalGeolocation,
      writable: true,
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get geolocation (success)', (done) => {
    const mockPosition = { coords: { latitude: 1, longitude: 2 } };
    const mockGeolocation: MockGeolocation = {
      getCurrentPosition: (success) => success(mockPosition),
    };
    Object.defineProperty(navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
    });
    service.getGeoLocation().subscribe((pos) => {
      expect(pos.latitude).toBe(1);
      expect(pos.longitude).toBe(2);
      done();
    });
  });

  it('should error if geolocation fails', (done) => {
    const mockGeolocation: MockGeolocation = {
      getCurrentPosition: (_, error) => error?.('fail'),
    };
    Object.defineProperty(navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
    });
    service.getGeoLocation().subscribe({
      error: (err) => {
        expect(err).toBe('fail');
        done();
      },
    });
  });

  it('should error if geolocation is unavailable', (done) => {
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      writable: true,
    });
    service.getGeoLocation().subscribe({
      error: (err) => {
        expect(err).toBe('Geolocation is not available in this browser.');
        done();
      },
    });
  });
});
