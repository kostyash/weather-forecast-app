import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { MeteoService } from '../meteo.service';
import { CurrentWeatherContainerComponent } from './current-weather-container.component';

describe('CurrentWeatherContainerComponent', () => {
  let component: CurrentWeatherContainerComponent;
  let fixture: ComponentFixture<CurrentWeatherContainerComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentWeatherContainerComponent],
      providers: [
        provideRouter([]),
        MeteoService,
        provideMockStore({ initialState: { city: '' } }),
        provideHttpClient(),
        provideHttpClientTesting()]
    })
      .compileComponents();

    
    fixture = TestBed.createComponent(CurrentWeatherContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
