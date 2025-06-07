import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentWeatherComponent } from './current-weather.component';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { ChangeDetectorRef, Component } from '@angular/core';
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
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, MatCardModule],
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
    const locationElement = fixture.debugElement.query(By.css('.location'));
    expect(locationElement.nativeElement.textContent.trim()).toBe(
      mockWeather.location
    );
  });

  it('should display the description correctly', () => {
    const descElement = fixture.debugElement.queryAll(
      By.css('mat-card-subtitle')
    )[0];
    expect(descElement.nativeElement.textContent.trim()).toBe(mockWeather.desc);
  });

  it('should display the date correctly', () => {
    const dateElement = fixture.debugElement.queryAll(
      By.css('mat-card-subtitle')
    )[1];
    expect(dateElement.nativeElement.textContent.trim()).toBe(mockWeather.date);
  });

  it('should display the weather condition correctly', () => {
    const conditionElement = fixture.debugElement.query(
      By.css('mat-card-content div')
    );
    expect(conditionElement.nativeElement.textContent.trim()).toBe(
      mockWeather.condition
    );
  });

  it('should display the humidity correctly', () => {
    const humidityElement = fixture.debugElement.queryAll(
      By.css('mat-card-content span')
    )[0];
    expect(humidityElement.nativeElement.textContent.trim()).toBe(
      `Humidity: ${mockWeather.humidity}%`
    );
  });

  it('should display the temperature correctly', () => {
    const tempElement = fixture.debugElement.queryAll(
      By.css('mat-card-content span')
    )[1];
    expect(tempElement.nativeElement.textContent.trim()).toBe(
      `Temperature: ${mockWeather.temperature}°C`
    );
  });

  it('should display the weather image with correct attributes', () => {
    const imgElement = fixture.debugElement.query(
      By.css('img[mat-card-image]')
    );
    const imgSrc = imgElement.nativeElement.src;
    expect(imgSrc.endsWith(mockWeather.image)).toBeTruthy();
    expect(imgElement.nativeElement.alt).toBe(mockWeather.condition);
    expect(imgElement.nativeElement.width).toBe(40);
    expect(imgElement.nativeElement.height).toBe(40);
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

    const tempElement = fixture.debugElement.queryAll(
      By.css('mat-card-content span')
    )[1];
    const humidityElement = fixture.debugElement.queryAll(
      By.css('mat-card-content span')
    )[0];
    const conditionElement = fixture.debugElement.query(
      By.css('mat-card-content div')
    );

    expect(tempElement.nativeElement.textContent.trim()).toBe(
      `Temperature: ${updatedWeather.temperature}°C`
    );
    expect(humidityElement.nativeElement.textContent.trim()).toBe(
      `Humidity: ${updatedWeather.humidity}%`
    );
    expect(conditionElement.nativeElement.textContent.trim()).toBe(
      updatedWeather.condition
    );
  });
});
