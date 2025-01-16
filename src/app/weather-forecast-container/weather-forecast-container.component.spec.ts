import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherForecastContainerComponent } from './weather-forecast-container.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { MeteoService } from '../meteo.service';

describe('WeatherForecastContainerComponent', () => {
  let component: WeatherForecastContainerComponent;
  let fixture: ComponentFixture<WeatherForecastContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherForecastContainerComponent],
      providers: [
              provideRouter([]),
              MeteoService,
              provideMockStore({ initialState: { city: '' } }),
              provideHttpClient(),
              provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherForecastContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
