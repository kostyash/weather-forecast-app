import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherTodayComponent } from './weather-today.component';
import { provideRouter } from '@angular/router';
import { MeteoService } from '../meteo.service';
import { provideHttpClient } from '@angular/common/http';

describe('WeatherTodayComponent', () => {
  let component: WeatherTodayComponent;
  let fixture: ComponentFixture<WeatherTodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherTodayComponent],
      providers: [
        provideRouter([]), MeteoService, provideHttpClient()
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(WeatherTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
