import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { WeatherForecastContainerComponent } from './weather-forecast-container.component';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MeteoService } from '../meteo.service';
import { FeatureKey } from '../state/selectors';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('WeatherForecastContainerComponent', () => {
  let component: WeatherForecastContainerComponent;
  let fixture: ComponentFixture<WeatherForecastContainerComponent>;
  let store: MockStore;
  let httpMock: HttpTestingController;
  let meteoService: MeteoService;

  const mockForecast = {
    location: 'Test City',
    days: [
      {
        date: '2024-03-20',
        minTemperature: 15,
        maxTemperature: 25,
        condition: 'Sunny',
        image: 'test.png',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherForecastContainerComponent],
      providers: [
        provideRouter([]),
        MeteoService,
        provideMockStore({
          initialState: {
            [FeatureKey]: { city: '' },
          },
        }),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    httpMock = TestBed.inject(HttpTestingController);
    meteoService = TestBed.inject(MeteoService);
    fixture = TestBed.createComponent(WeatherForecastContainerComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading state initially', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const loadingSpinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(loadingSpinner).toBeTruthy();
  }));

  it('should handle error state', fakeAsync(() => {
    // Mock the service to return an error
    jest
      .spyOn(meteoService, 'getForeCastByCity')
      .mockReturnValue(throwError(() => new Error('Test error')));

    store.setState({
      [FeatureKey]: { city: 'test-city' },
    });

    fixture.detectChanges();
    tick();

    const errorCard = fixture.debugElement.query(By.css('mat-card'));
    expect(errorCard).toBeTruthy();
    expect(errorCard.nativeElement.textContent).toContain(
      'Failed to load forecast for required location'
    );
  }));

  it('should handle loaded state', fakeAsync(() => {
    // Mock the service to return success
    jest
      .spyOn(meteoService, 'getForeCastByCity')
      .mockReturnValue(of(mockForecast));

    store.setState({
      [FeatureKey]: { city: 'test-city' },
    });

    fixture.detectChanges();
    tick();

    const forecastComponent = fixture.debugElement.query(
      By.css('app-weather-forecast')
    );
    expect(forecastComponent).toBeTruthy();
  }));
});
