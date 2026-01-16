import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentWeatherComponent } from './current-weather.component';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

// Test host component to simulate parent component
@Component({
  template: `<app-current-weather [weather]="weather"></app-current-weather>`,
  standalone: true,
  imports: [CurrentWeatherComponent],
})
class TestHostComponent {
  weather = {
    condition: 'sunny',
    date: '04 05 2024',
    humidity: 3,
    image: 'ghr.png',
    temperature: 23,
    location: 'Petah Tikwa',
    desc: 'Israel',
    feelsLike: 25,
    windSpeed: 15,
    windDirection: 'NW',
    pressure: 1013,
    uvIndex: 5,
    visibility: 10,
    cloud: 20,
  };
}

describe('CurrentWeatherComponent', () => {
  let component: CurrentWeatherComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  const mockWeather = {
    condition: 'sunny',
    date: '04 05 2024',
    humidity: 3,
    image: 'ghr.png',
    temperature: 23,
    location: 'Petah Tikwa',
    desc: 'Israel',
    feelsLike: 25,
    windSpeed: 15,
    windDirection: 'NW',
    pressure: 1013,
    uvIndex: 5,
    visibility: 10,
    cloud: 20,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(
      By.directive(CurrentWeatherComponent)
    ).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the location correctly', () => {
    const locationElement = fixture.debugElement.query(By.css('.location-name'));
    expect(locationElement.nativeElement.textContent.trim()).toBe(
      mockWeather.location
    );
  });

  it('should display the description correctly', () => {
    const descElement = fixture.debugElement.query(By.css('.location-desc'));
    expect(descElement.nativeElement.textContent.trim()).toBe(mockWeather.desc);
  });

  it('should display the date correctly', () => {
    const dateElement = fixture.debugElement.query(By.css('.weather-time'));
    expect(dateElement.nativeElement.textContent.trim()).toBe(mockWeather.date);
  });

  it('should display the weather condition correctly', () => {
    const conditionElement = fixture.debugElement.query(By.css('.condition-text'));
    expect(conditionElement.nativeElement.textContent.trim()).toBe(
      mockWeather.condition
    );
  });

  it('should display the humidity correctly', () => {
    const humidityElement = fixture.debugElement.query(By.css('.stat-value'));
    expect(humidityElement.nativeElement.textContent.trim()).toBe(
      `${mockWeather.humidity}%`
    );
  });

  it('should display the temperature correctly', () => {
    const tempElement = fixture.debugElement.query(By.css('.temperature-value'));
    expect(tempElement.nativeElement.textContent.trim()).toBe(
      `${mockWeather.temperature}`
    );
  });

  it('should display the weather image with correct attributes', () => {
    const imgElement = fixture.debugElement.query(By.css('.condition-icon'));
    const imgSrc = imgElement.nativeElement.src;
    expect(imgSrc.endsWith(mockWeather.image)).toBeTruthy();
    expect(imgElement.nativeElement.alt).toBe(mockWeather.condition);
    expect(imgElement.nativeElement.width).toBe(80);
    expect(imgElement.nativeElement.height).toBe(80);
  });

  it('should update the display when weather input changes', () => {
    const updatedWeather = {
      ...mockWeather,
      temperature: 25,
      humidity: 5,
      condition: 'cloudy',
    };

    hostComponent.weather = updatedWeather;
    fixture.detectChanges();

    const tempElement = fixture.debugElement.query(By.css('.temperature-value'));
    const conditionElement = fixture.debugElement.query(By.css('.condition-text'));

    expect(tempElement.nativeElement.textContent.trim()).toBe(
      `${updatedWeather.temperature}`
    );
    expect(conditionElement.nativeElement.textContent.trim()).toBe(
      updatedWeather.condition
    );
  });
});
