import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MeteoService } from '../meteo.service';
import { CurrentWeatherContainerComponent } from './current-weather-container.component';
import { FeatureKey } from '../state/selectors';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('CurrentWeatherContainerComponent', () => {
  let component: CurrentWeatherContainerComponent;
  let fixture: ComponentFixture<CurrentWeatherContainerComponent>;
  let store: MockStore;
  let httpMock: HttpTestingController;
  let meteoService: MeteoService;

  const mockWeather = {
    location: 'Test City',
    desc: 'Test Region',
    temperature: 25,
    humidity: 60,
    condition: 'Sunny',
    image: 'test.png',
    date: '2024-03-20',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentWeatherContainerComponent],
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
    fixture = TestBed.createComponent(CurrentWeatherContainerComponent);
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
      .spyOn(meteoService, 'getCurrentWeatherByCity')
      .mockReturnValue(throwError(() => new Error('Test error')));

    store.setState({
      [FeatureKey]: { city: 'test-city' },
    });

    fixture.detectChanges();
    tick();

    const errorCard = fixture.debugElement.query(By.css('mat-card'));
    expect(errorCard).toBeTruthy();
    expect(errorCard.nativeElement.textContent).toContain(
      'Failed load weather for required location'
    );
  }));

  it('should handle loaded state', fakeAsync(() => {
    // Mock the service to return success
    jest
      .spyOn(meteoService, 'getCurrentWeatherByCity')
      .mockReturnValue(of(mockWeather));

    store.setState({
      [FeatureKey]: { city: 'test-city' },
    });

    fixture.detectChanges();
    tick();

    const weatherComponent = fixture.debugElement.query(
      By.css('app-current-weather')
    );
    expect(weatherComponent).toBeTruthy();
  }));
});
