import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { WeatherForecastComponent } from './weather-forecast.component';
import { Forecast } from '../contracts';

@Component({
  template: `<app-weather-forecast [forecast]="forecast"></app-weather-forecast>`,
  standalone: true,
  imports: [WeatherForecastComponent],
})
class TestHostComponent {
  forecast: Forecast = {
    location: 'Petah Tikwa',
    days: [
      {
        date: '2024-04-01',
        minTemperature: 10,
        maxTemperature: 20,
        condition: 'Sunny',
        image: 'sunny.png',
        chanceOfRain: 10,
        maxWind: 15,
        avgHumidity: 50,
        uvIndex: 5,
      },
    ],
  };
}

describe('WeatherForecastComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: WeatherForecastComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.debugElement.query(
      By.directive(WeatherForecastComponent)
    ).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display location', () => {
    const title = fixture.debugElement.query(By.css('.forecast-title'));
    expect(title.nativeElement.textContent).toContain('Petah Tikwa');
  });
});
