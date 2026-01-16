import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Forecast } from '../contracts';

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrl: './weather-forecast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherForecastComponent {
  forecast = input.required<Forecast>();
}
