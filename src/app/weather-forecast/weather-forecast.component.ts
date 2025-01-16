import { Component, Input } from '@angular/core';
import { Forecast } from '../contracts';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-weather-forecast',
  imports: [MatCardModule],
  templateUrl: './weather-forecast.component.html',
  styleUrl: './weather-forecast.component.scss'
})
export class WeatherForecastComponent {

  @Input() forecast!: Forecast;

}
