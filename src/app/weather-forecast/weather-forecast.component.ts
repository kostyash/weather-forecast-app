import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Forecast } from '../contracts';

@Component({
  selector: 'app-weather-forecast',
  imports: [MatCardModule],
  templateUrl: './weather-forecast.component.html',
  styleUrl: './weather-forecast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherForecastComponent {

  @Input() forecast!: Forecast;

}
