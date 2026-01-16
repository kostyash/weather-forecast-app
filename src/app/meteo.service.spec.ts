import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { GeolocationService } from './geolocation.service';
import { MeteoService } from './meteo.service';
import { of } from 'rxjs';

describe('MeteoService', () => {
  let service: MeteoService;
  let httpMock: HttpTestingController;
  let geoService: GeolocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GeolocationService],
    });
    service = TestBed.inject(MeteoService);
    httpMock = TestBed.inject(HttpTestingController);
    geoService = TestBed.inject(GeolocationService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get forecast by city', () => {
    const mockRes = {
      location: { name: 'A', region: 'B', country: 'C' },
      forecast: { forecastday: [] },
    };
    service.getForeCastByCity('London').subscribe((res) => {
      expect(res.location).toContain('A');
      expect(res.days).toBeDefined();
    });
    const req = httpMock.expectOne((r) => r.url.includes('forecast.json'));
    expect(req.request.method).toBe('GET');
    req.flush(mockRes);
  });

  it('should get current weather by city', () => {
    const mockRes = {
      location: { name: 'A', region: 'B', country: 'C', localtime: 'now' },
      current: {
        condition: { text: 'Sunny', icon: 'icon.png' },
        humidity: 10,
        temp_c: 20,
      },
    };
    service.getCurrentWeatherByCity('London').subscribe((res) => {
      expect(res.location).toContain('A');
      expect(res.condition).toBe('Sunny');
    });
    const req = httpMock.expectOne((r) => r.url.includes('current.json'));
    expect(req.request.method).toBe('GET');
    req.flush(mockRes);
  });

  it('should use geolocation if city is not provided (forecast)', () => {
    jest
      .spyOn(geoService, 'getGeoLocation')
      .mockReturnValue(of({ latitude: 1, longitude: 2 }));
    service.getForeCastByCity('').subscribe();
    const req = httpMock.expectOne(
      (r) => r.url.includes('forecast.json') && r.url.includes('1,2')
    );
    req.flush({
      location: { name: '', region: '', country: '' },
      forecast: { forecastday: [] },
    });
  });

  it('should use geolocation if city is not provided (current)', () => {
    jest
      .spyOn(geoService, 'getGeoLocation')
      .mockReturnValue(of({ latitude: 1, longitude: 2 }));
    service.getCurrentWeatherByCity('').subscribe();
    const req = httpMock.expectOne(
      (r) => r.url.includes('current.json') && r.url.includes('1,2')
    );
    req.flush({
      location: { name: '', region: '', country: '', localtime: '' },
      current: { condition: { text: '', icon: '' }, humidity: 0, temp_c: 0 },
    });
  });

  it('should handle error in getCurrentWeatherByCity', (done) => {
    service.getCurrentWeatherByCity('London').subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
    const req = httpMock.expectOne((r) => r.url.includes('current.json'));
    req.error(new ErrorEvent('fail'));
  });

  it('should handle error in getForeCastByCity', (done) => {
    service.getForeCastByCity('London').subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
    const req = httpMock.expectOne((r) => r.url.includes('forecast.json'));
    req.error(new ErrorEvent('fail'));
  });

  describe('searchLocations', () => {
    it('should return empty array for empty query', (done) => {
      service.searchLocations('').subscribe((results) => {
        expect(results).toEqual([]);
        done();
      });
      // No HTTP request should be made
      httpMock.expectNone((r) => r.url.includes('search.json'));
    });

    it('should return empty array for query with less than 2 characters', (done) => {
      service.searchLocations('L').subscribe((results) => {
        expect(results).toEqual([]);
        done();
      });
      httpMock.expectNone((r) => r.url.includes('search.json'));
    });

    it('should search locations for valid query', (done) => {
      const mockResults = [
        { name: 'London', region: 'England', country: 'UK' },
        { name: 'Los Angeles', region: 'California', country: 'USA' },
      ];

      service.searchLocations('Lon').subscribe((results) => {
        expect(results.length).toBe(2);
        expect(results[0].name).toBe('London');
        expect(results[0].region).toBe('England');
        expect(results[0].country).toBe('UK');
        done();
      });

      const req = httpMock.expectOne((r) => r.url.includes('search.json') && r.url.includes('Lon'));
      expect(req.request.method).toBe('GET');
      req.flush(mockResults);
    });

    it('should encode special characters in query', () => {
      service.searchLocations('Tel Aviv').subscribe();
      const req = httpMock.expectOne((r) => r.url.includes('search.json') && r.url.includes('Tel%20Aviv'));
      req.flush([]);
    });
  });
});
