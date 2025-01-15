import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherForecastComponent } from './weather-forecast.component';
import { ActivatedRoute, provideRouter, RouterLink, RouterModule } from '@angular/router';

describe('WeatherForecastComponent', () => {
  let component: WeatherForecastComponent;
  let fixture: ComponentFixture<WeatherForecastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherForecastComponent],
      providers: [        
        provideRouter([])        
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
